
var email = undefined;

var password = undefined;

window.onload = function () {
	$("#loginMessage").modal("show");
}

function getData () {
	email = $("#proctorEmail").val();
	password = $("#password").val();
	$.getJSON("/get_names/" + email + "/" + password, nameWork);
}

function nameWork(nameData) {
	var names = new Array();
	for (var i = 0; i < nameData.length; i++) {
		names.push(makeStringPresentable(nameData[i]["fName"]) + " " + makeStringPresentable(nameData[i]["lName"]));
	}
	//alert(name.concat(emails));
	$("#searchTerm").typeahead().data('typeahead').source = names;
	//alert($("#searchTerm").typeahead().data('typeahead').source);
}

// clean up the string more
function searchData(searchTerm) {
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
	$(".collapse").collapse("hide");
}

