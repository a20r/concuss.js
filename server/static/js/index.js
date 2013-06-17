
function checkAuth() {
	if ($("#password").val() == "" || $("#proctorEmail").val() == "") {
		$("#authAlert").css("display", "block");
	} else {
		$("#loginMessage").modal("hide");
	}
}

function addNewTest() {
	if ($.cookie("proctorEmail") != null && $.cookie("password") != null) {
		$("#userForm").css("display", "block");
	} else {
		$('#loginMessage').modal('show');
		$("#loginMessage").on("hidden", function () {
			$("#userForm").css("display", "block");
		});
	}
	$("#loadButtons").css("display", "none");
}

function updateProctor() {
	$('#loginMessage').modal('show');
	$("#loginMessage").on("hidden", function () {
		$("#userForm").css("display", "block");
	});
	$("#loadButtons").css("display", "none");
}

function updateCookies() {
	var inputIds = ["fName", "lName", "email", "age", "sport", "gender", "education", 
					"classification", "priorConcussion", "password", "proctorEmail"];
	for (var i in inputIds) {
		$.cookie(inputIds[i], $("#" + inputIds[i]).val(), {expires: 7});
	}
}