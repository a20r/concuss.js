

window.onload = function () {
	$("#loginMessage").modal("show");
}

function getData () {
	$.getJSON("/get_data/" + $("#proctorEmail").val() + "/" + $("#password").val(), visualizeData);
}

function visualizeData (data) {
	
}