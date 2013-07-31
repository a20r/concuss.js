
function checkAuthProctor() {
	if ($("#password").val() == "" || $("#proctorEmail").val() == "") {
		$("#authAlertProctor").css("display", "block");
		return;
	} else {
		$("#loginMessage").modal("hide");
	}
}

function addNewTest() {
	if ($.cookie("proctorEmail") != null && $.cookie("password") != null) {
		$("#userForm").css("display", "block");
	} else {
		updateProctor();
	}
	$("#loadButtons").css("display", "none");
}

function updateProctor() {
	$('#loginMessage').modal('show');
	$("#loginMessage").on("hidden", function () {
		$("#userForm").css("display", "block");
		$.cookie("proctorEmail", $("#proctorEmail").val());
		$.cookie("password", $("#password").val());
	});
	$("#loadButtons").css("display", "none");
}

function updateCookies() {
	var inputIds = [
		"fName", 
		"lName", 
		"email", 
		"age", 
		"sport", 
		"gender", 
		"education", 
		"classification", 
		"priorConcussion"
	];
	for (var i in inputIds) {
		$.cookie(
			inputIds[i], 
			$("#" + inputIds[i]).val().split(" ")[0].split("'")[0], 
			{expires: 7}
		);
	}
}