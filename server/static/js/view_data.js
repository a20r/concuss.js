

window.onload = function () {
	$("#loginMessage").modal("show");
}

function getData () {
	$.getJSON("/get_data/", visualizeData);
}

function visualizeData (data) {
	// finish this up
}