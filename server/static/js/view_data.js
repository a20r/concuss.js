
var email = undefined;

var password = undefined;

var latestSearch = undefined;

window.onload = function () {
	$("#loginMessage").modal("show");
}

function graphEnabled() {
	if ($("#graphical").attr("class") != "disabled") {
		$("#graphical").attr("class", "active");
		$("#tabular").attr("class", "");
		searchData(latestSearch);
	}
}

function tableEnabled() {
	if ($("#graphical").attr("class") != "disabled") {
		$("#graphical").attr("class", "");
		$("#tabular").attr("class", "active");
		searchData(latestSearch);
	}
}

function getNames() {
	$.getJSON("/get_names/" + email + "/" + password, nameWork);
}

function getData () {
	email = $("#proctorEmail").val();
	password = $("#password").val();
	$.getJSON("/get_names/" + email + "/" + password, getNames());
}

function nameWork(nameData) {
	var names = new Array();
	for (var i = 0; i < nameData.length; i++) {
		names.push(makeStringPresentable(nameData[i]["fName"]) + " " + makeStringPresentable(nameData[i]["lName"]));
	}

	names.sort();
	$("#searchTerm").typeahead().data('typeahead').source = names;

	var nameTable = new Table("<h2>Subjects</h2>");
	for (var i = 0; i < names.length; i++) {
		nameTable.addRow(["<a class=\"lead\" href=\"#\" onclick='searchData(\"" + 
			names[i].toLowerCase() + "\")'>" + names[i] + "</a>"]);
	}

	$("#graphical").attr("class", "disabled");
	$("#tabular").attr("class", "disabled");
	$("#dataHolder").html("");
	$("#nameArea").html(nameTable.getHtml());
}

// clean up the string more
function searchData(searchTerm) {
	if ($("#graphical").attr("class") == "disabled") {
		$("#graphical").attr("class", "");
		$("#tabular").attr("class", "active");
	}

	latestSearch = searchTerm;
	$("#searchTerm").val("");
	var terms = searchTerm.split(" ");
	if (terms.length == 1) {
		$.getJSON("/get_data/" + $("#proctorEmail").val() + "/" + $("#password").val() + 
			"/email/" + searchTerm, visualizeData);
	} else {
		$.getJSON("/get_data/" + $("#proctorEmail").val() + "/" + $("#password").val() + 
			"/name/" + terms[0] + "/" + terms[1], visualizeData);
	}
}

function addTab(heading) {
	var collapseId = Date.parse(heading);
	var tab = '<div class="accordion-group">' + 
					'<div class="accordion-heading">' + 
						'<a class="accordion-toggle lead" data-toggle="collapse" data-parent="#dataHolder" href="#' + 
						collapseId + '">' + heading + '</a></div>' +
			    '<div id="' + collapseId + '" class="accordion-body collapse in">' + 
			    	'<div class="accordion-inner" id=' + collapseId + '_inner></div></div></div>';
	return tab;
}

function Table(heading) {
	this.hString = "<p class='lead'><b>" + heading + "</b></p>";
	this.sString = "<table class='table table-hover'>";
	this.inner = "";
	this.eString = "</table>";
}

Table.prototype.addRow = function (rowArray) {
	 this.inner += "<tr><td>" + rowArray.join("</td><td>") + "</td></tr>";
}

Table.prototype.getHtml = function () {
	return this.hString + this.sString + this.inner + this.eString;
}

// Makes the string presentable (obviously)
// Capitalizes the first letter and 
// puts space where there is an underscore
function makeStringPresentable(string) {
  var spaceString = string.replace("_", " ");
  return spaceString.charAt(0).toUpperCase() + spaceString.slice(1);
}

function visualizeData(data) {
	$("#dataHolder").html("");
	var results = data[0]["data"];

	$("#nameArea").html(
		"<h2>" + makeStringPresentable(data[0]["fName"]) + " " + 
		makeStringPresentable(data[0]["lName"]) + "</h2>");

	if($("#tabular").attr("class") == "active") {
		tableVisualization(results);
	} else if ($("#graphical").attr("class") == "active") {
		graphicVisualization(results);
	}
	$(".collapse").collapse("hide");
}

function Chart(title, containerId) {
	this.title = title;
	this.series = {};
	this.categories = new Array();
	$("#" + containerId).append('<div class="chart" id="' + title + 
		'" style="min-width: 500px; height: 300px; margin: 0 auto"></div>');
}

Chart.prototype.pushCategory = function (cat) {
	this.categories.push(cat);
}

Chart.prototype.pushSeries = function (key, value) {
	if (this.series[key] == undefined){
		this.series[key] = new Array();
	}
	this.series[key].push(value);
}

Chart.prototype.compileSeries = function () {
	var seriesArray = new Array();
	for (var i in this.series) {
		seriesArray.push({name : i, data : this.series[i]});
	}
	return seriesArray;
}

Chart.prototype.show = function (yTitle, yUnit) {
	var seriesArray = this.compileSeries();
	//alert(JSON.stringify(seriesArray));
	$("#" + this.title).highcharts({
        chart: {
            type: 'line',
            marginRight: 130,
            marginBottom: 40
        },
        title: {
            text: this.title,
            x: -20 //center
        },
        xAxis: {
            categories: this.categories
        },
        yAxis: {
        	title: {
        		text : yTitle
        	},
            plotLines: [{
                value: 0,
                width: 1,
                color: '#808080'
            }]
        },
        tooltip: {
        	valueSuffix : " " + yUnit
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -10,
            y: 100,
            borderWidth: 0
        },
        series: seriesArray
    });
}

function graphicVisualization(results) {

	var balanceChart = new Chart("Balance", "dataHolder");
	var memoryChart = new Chart("Memory", "dataHolder");
	var reflexChart = new Chart("Reflex", "dataHolder");

	for (var i = 0; i < results.length; i++) {

		balanceChart.pushCategory(results[i]["time"].slice(4, 21));
		memoryChart.pushCategory(results[i]["time"].slice(4, 21));
		reflexChart.pushCategory(results[i]["time"].slice(4, 21));

		balanceChart.pushSeries("Within Boundary", results[i]["balance"]["percent"]);

		memoryChart.pushSeries("Initial Deviation", results[i]["memory"]["initialDev"]);
		memoryChart.pushSeries("Final Deviation", results[i]["memory"]["finalDev"]);
		memoryChart.pushSeries("Velocity", results[i]["memory"]["velocity"]);

		reflexChart.pushSeries("Left", results[i]["reflex"]["circleA"]["percent"]);
		reflexChart.pushSeries("Right", results[i]["reflex"]["circleB"]["percent"]);
	}

	balanceChart.show("Percent %", "%");
	reflexChart.show("Percent %", "%");
	memoryChart.show("Scaled Pixel Metric", "SPM");

}

function tableVisualization(results) {
	for (var i = 0; i < results.length; i++) {

		$("#dataHolder").append(addTab(results[i]["time"]));
		var innerId = Date.parse(results[i]["time"]) + "_inner";

		var balanceTable = new Table("Balance");
		balanceTable.addRow(["Time", results[i]["balance"]["time"]]);
		balanceTable.addRow(["Percent", results[i]["balance"]["percent"]]);

		var memoryTable = new Table("Memory");
		memoryTable.addRow(["Initial Deviation", results[i]["memory"]["initialDev"]]);
		memoryTable.addRow(["Final Deviation", results[i]["memory"]["finalDev"]]);
		memoryTable.addRow(["Velocity", results[i]["memory"]["velocity"]]);

		var reflexTable = new Table("Reflex");
		reflexTable.addRow(["", "Left", "Right"]);
		reflexTable.addRow(["Time", results[i]["reflex"]["circleA"]["time"], results[i]["reflex"]["circleB"]["time"]]);
		reflexTable.addRow(["Percent", results[i]["reflex"]["circleA"]["percent"], results[i]["reflex"]["circleB"]["percent"]]);

		var infoTable = new Table("Patient Information");
		infoTable.addRow(["Age", results[i]["age"]]);
		infoTable.addRow(["Sport", makeStringPresentable(results[i]["sport"])]);
		infoTable.addRow(["Prior Concussion", results[i]["priorConcussion"] ? "Yes" : "No"]);
		infoTable.addRow(["Classification", makeStringPresentable(results[i]["classification"])]);

		$("#" + innerId).append(infoTable.getHtml());
		$("#" + innerId).append(balanceTable.getHtml());
		$("#" + innerId).append(memoryTable.getHtml());
		$("#" + innerId).append(reflexTable.getHtml());

	}
}

