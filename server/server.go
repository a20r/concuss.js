package main

// Imports
import (
    "fmt"
    "io/ioutil"
    "net/http"
    "flag"
    "encoding/json"
    "strings"
    rethink "github.com/christopherhesse/rethinkgo"
)

// JSON response mapping
type Response map[string]interface{}
type SubjectInfo Response

// Represents an file loaded
type Page struct {
	Title string
	Body []byte
}

// Converts the JSON to strings
// to be sent as a response
func (r Response) String() (s string) {
    b, err := json.Marshal(r)
    if err != nil {
            s = ""
            return
    }
    s = string(b)
    return
}

var session, _ = rethink.Connect("localhost:28015", "concussdb")

// Opens a file and returns it represented
// as a Page.
func loadPage(folder, title string) (*Page, error) {
    filename := folder + "/" + title
    body, err := ioutil.ReadFile(filename)
    if err != nil {
        return nil, err
    }
    return &Page{Title: title, Body: body}, nil
}

// Creates a function that will be used as a handler
// for static and template responses. See Usage!
func fileResponseCreator(folder string) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
        fmt.Println("GET\t" + r.URL.Path)
    	var p *Page
    	var err error
    	if len(r.URL.Path) == 1 {
            // In case the path is just '/'
    		p, err = loadPage("templates", "index.html")
    	} else {
    		p, err = loadPage(folder, r.URL.Path[1:])
    	}
    	if p != nil {
    		w.Write(p.Body)
    	} else {
    		fmt.Println("ERROR\t" + err.Error())
    	}
	}
}

func getResultFormat(sData SubjectInfo) (rethink.Map) {
    // the line below gets a sub interface because Go is stupid
    reflexMap := sData["results"].(map[string]interface{})["reflex"].(map[string]interface{})
    memoryMap := sData["results"].(map[string]interface{})["memory"].(map[string]interface{})
    balanceMap := sData["results"].(map[string]interface{})["balance"].(map[string]interface{})
    return rethink.Map{
        "reflex" : rethink.Map{
            "circleA": rethink.Map{
                "time" : reflexMap["circleA"].(map[string]interface{})["time"],
                "percent" : reflexMap["circleA"].(map[string]interface{})["percent"],
            },
            "circleB": rethink.Map{
                "time" : reflexMap["circleB"].(map[string]interface{})["time"],
                "percent" : reflexMap["circleB"].(map[string]interface{})["percent"],
            },
        },
        "memory" : rethink.Map{
            "initialDev" : memoryMap["initialDev"],
            "finalDev" : memoryMap["finalDev"],
            "velocity" : memoryMap["velocity"],
        },
        "balance" : rethink.Map{
            "time" : balanceMap["time"],
            "percent" : balanceMap["percent"],
        },
        "classification" : sData["classification"],
        "sport" : sData["sport"],
        "time" : sData["time"],
        "priorConcussion" : sData["priorConcussion"],
        "age" : sData["age"],
        "password" : sData["password"],
        "proctorEmail" : sData["proctorEmail"],
    }
}

func formSubmitted(w http.ResponseWriter, r *http.Request) {
    r.ParseForm()
    fmt.Println("POST\t" + r.URL.Path)
    fmt.Println("DATA\t" + r.Form["subject_data"][0])

    // decodes the JSON data to be sent to the database
    var sData SubjectInfo
    json.Unmarshal([]byte (r.Form["subject_data"][0]), &sData)

    // checks if the entry is already in the databaseå
    var exists []interface{}
    rethink.Table("concuss_data").GetAll("email", sData["email"]).Run(session).All(&exists)

    // appends a list of results if the entry is already there
    if len(exists) > 0 {
        var person interface{}
        rethink.Table("concuss_data").GetAll("email",
            sData["email"]).Nth(0).Attr("results").Append(getResultFormat(sData)).Run(session).One(&person)
        //fmt.Println(person)
        rethink.Table("concuss_data").GetAll("email",
            sData["email"]).Update(rethink.Map{"results" : person}).Run(session).Exec()
    // if entry is not in database, add new entry
    } else {
        rethink.Table("concuss_data").Insert(
            rethink.Map{
                "fName" : sData["fName"],
                "lName" : sData["lName"],
                "email" : sData["email"],
                "gender" : sData["gender"],
                "education" : sData["education"],
                "results" : rethink.List{
                    getResultFormat(sData),
                },
            },
        ).Run(session).Exec()
    }
}

func proctorQuery(email, password string) (rethink.Exp) {

    filterFunc := func (result rethink.Exp) (rethink.Exp) {
        return result.Attr("proctorEmail").Eq(email).And(result.Attr("password").Eq(password))
    }

    mapFunc := func (val rethink.Exp) (rethink.Map) {
        return rethink.Map{
            "fName" : val.Attr("fName"), "lName" : val.Attr("lName"),
            "email" : val.Attr("email"), "education" : val.Attr("education"),
            "data" : val.Attr("results").Filter(filterFunc),
        }
    }

    filterNullData := func (val rethink.Exp) (rethink.Exp) {
        return val.Attr("data").Count().Gt(0);
    }

    return rethink.Table("concuss_data").Map(mapFunc).Filter(filterNullData)
}

func dataWanted(w http.ResponseWriter, r *http.Request) {
    urlVars := strings.Split(r.URL.Path[1:], "/")
    fmt.Println("GET\t" + r.URL.Path)

    email, password, queryTerm := urlVars[1], urlVars[2], urlVars[3]

    var data []interface{}
    query := proctorQuery(email, password)

    if queryTerm == "name" {
        fName := urlVars[4]
        lName := urlVars[5]
        query.Filter(rethink.Map{
            "fName" : fName,
            "lName" : lName,
        }).Run(session).All(&data)
    } else {
        subjectEmail := urlVars[4]
        query.Filter(rethink.Map{
            "email" : subjectEmail,
        }).Run(session).All(&data)
    }

    b, err := json.Marshal(data)
    if err != nil {
        fmt.Println("ERROR\t" + err.Error())
    } else {
        fmt.Println(string(b))
        w.Write(b)
    }
}

func namesWanted(w http.ResponseWriter, r *http.Request) {
    urlVars := strings.Split(r.URL.Path[1:], "/")
    fmt.Println("GET\t" + r.URL.Path)
    email, password := urlVars[1], urlVars[2]

    mappingFunc := func (val rethink.Exp) (rethink.Map) {
        return rethink.Map{
            "fName" : val.Attr("fName"),
            "lName" : val.Attr("lName"),
        }
    }

    var data []interface{}
    query := proctorQuery(email, password)
    query.Map(mappingFunc).Run(session).All(&data)

    b, err := json.Marshal(data)
    if err != nil {
        fmt.Println("ERROR\t" + err.Error())
    } else {
        fmt.Println(string(b))
        w.Write(b)
    }
}

func forMac(w http.ResponseWriter, r *http.Request) {
    fmt.Println("GET\t" + r.URL.Path)
    mReader, err := r.MultipartReader()
    if (err != nil) {
        fmt.Println("ERROR\t" + err.Error())
    } else {
        fmt.Println("Got here")
        nPart, _ := mReader.NextPart()
        //fmt.Println("ERROR\t" + err.Error())
        fmt.Println(nPart.FileName())
    }
    //fmt.Println("POST\t" + r.URL.Path)
    //fmt.Println("DATA\t" + r.Form)
}

// Handles all Javascript, images, and HTML
// file requests
func displayHandler() {
    staticHandler := fileResponseCreator("static")
    http.HandleFunc("/", fileResponseCreator("templates"))
    http.HandleFunc("/css/", staticHandler)
    http.HandleFunc("/js/", staticHandler)
    http.HandleFunc("/img/", staticHandler)
    http.HandleFunc("/favicon.ico", fileResponseCreator("static/img"))
}

func main() {
    displayHandler()
    http.HandleFunc("/form_submit/", formSubmitted)
    http.HandleFunc("/get_data/", dataWanted)
    http.HandleFunc("/get_names/", namesWanted)
    http.HandleFunc("/mac/", forMac)
    var addr_flag = flag.String("addr", "localhost", "Address the http server binds to")
    var port_flag = flag.String("port", "8080", "Port used for http server")
    flag.Parse()
    //fmt.Println("Running server on " + *addr_flag + ":" + *port_flag)
    err := http.ListenAndServe(*addr_flag + ":" + *port_flag, nil)
    fmt.Println(err)
}

