
var email = undefined;

var password = undefined;

window.onload = function () {
	$("#loginMessage").modal("show");
}

function getData () {
	email = $("#proctorEmail").val();
	password = $("#password").val();
}

// clean up the string more
function searchData(searchTerm) {
	var terms = searchTerm.split(" ");
	if (terms.length == 1) {
		$.getJSON("/get_data/" + $("#proctorEmail").val() + "/" + $("#password").val() + 
			"/email/" + searchTerm, visualizeData);
	} else {
		$.getJSON("/get_data/" + $("#proctorEmail").val() + "/" + $("#password").val() + 
			"/name/" + terms[0] + "/" + terms[1], visualizeData);
	}
}

function addTab(heading, body) {
	var collapseId = Date.parse(heading);
	var tab = '<div class="accordion-group">' + 
					'<div class="accordion-heading">' + 
						'<a class="accordion-toggle" data-toggle="collapse" data-parent="#dataHolder" href="#' + 
						collapseId + '">' + heading + '</a></div>' +
			    '<div id="' + collapseId + '" class="accordion-body collapse in">' + 
			    	'<div class="accordion-inner">' + body + '</div></div></div>';
	return tab;
}

function visualizeData(data) {
	$("#dataHolder").html("");
	var results = data[0]["data"];
	for (var i = 0; i < results.length; i++) {
		$("#dataHolder").append(addTab(results[i]["time"], JSON.stringify(results[i])));
	}
	$(".collapse").collapse("hide");
}
