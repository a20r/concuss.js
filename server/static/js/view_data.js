
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

function visualizeData(data) {
	$("#dataHolder")

}
