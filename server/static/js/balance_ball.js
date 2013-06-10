

var circleBoundary = new CanvasImage("mainCanvas", "green_circle");

var circleSmall = new CanvasImage("mainCanvas", "circlesmall");

var circleOpen = document.getElementById("open_circle");

var circleGreen = document.getElementById("green_circle");

var gameInterval = undefined;

var updateRate = 5;

var scaleY = 5;

var scaleX = 4;

var drawInterval = undefined;

// change in x velocity per 5 milliseconds
var ax = 0;

// change in y velocity per 5 milliseconds
var ay = 0;

var gameLength = 45 * 1000;

// Gets the canvas
var canvas = document.getElementById("mainCanvas");

window.onload = initGame;

function initGame() {
	$("#startMessage").modal("show");
	$("#startMessage").on("hidden", function () {
		drawInterval = setInterval(drawCircles, updateRate);
		gameInterval = setInterval(whenGameEnds, gameLength);
	});

	if(window.DeviceOrientationEvent) {
    	window.addEventListener('deviceorientation', orientationEventHandler, false);
    }

	// Makes the canvas the size of the page
    canvas.width = document.width;
    canvas.height = document.height;

    ax = updateRate * getRandomInt(-20, 20) / 1000;
    ay = updateRate * getRandomInt(-20, 20) / 1000;

    circleSmall.setHeading(ax, ay);

    circleSmall.updatePosition(canvas.width / 2, canvas.height / 2).redraw();
    circleBoundary.updatePosition(canvas.width / 2, canvas.height / 2).redraw();
    //alert(checkOrientation());
}

function checkOrientation() {
 
      switch(window.orientation){
 
           case 0:
           return 0;
 
           case -90:
           return 1;
 
           case 90:
           return -1;
 
           case 180:
           return 0;
     }
}

function whenGameEnds() {
	var finalTime = +$("#timer").html()
	$("#time").html(finalTime + " sec");
	$("#percent").html((100 * 1000 * finalTime / gameLength).toFixed(1) + "%");
	$("#endMessage").modal("show");
}

function orientationEventHandler(event) {
	event.preventDefault();
	$("#tiltVertical").html(Math.floor(event.gamma));
	$("#tiltHorizontal").html(Math.floor(event.beta));
}

function drawCircles() {
	circleBoundary.clearCanvas();
	circleBoundary.redraw();

	// fix this constants crap
	if (circleSmall.x + circleSmall.hx + circleSmall.image.width / 2 > document.width - 50 || 
		circleSmall.x + circleSmall.hx - circleSmall.image.width / 2 < 0) {
		circleSmall.hx = -circleSmall.hx / 1.8;
	}

	if (circleSmall.y + circleSmall.hy + circleSmall.image.height / 2 > document.height - 170 || 
		circleSmall.y + circleSmall.hy - circleSmall.image.height / 2 < 50) {
		circleSmall.hy = -circleSmall.hy / 1.8;
	}

	circleSmall.incrementPosition().redraw();

	if (Math.sqrt(Math.pow(circleSmall.x - circleBoundary.x, 2) + 
		Math.pow(circleSmall.y - circleBoundary.y, 2)) <= circleBoundary.image.height / 2) {
		circleBoundary.image = circleGreen;
		if (circleSmall.timer == undefined) {
			circleSmall.timer = +new Date();
		}
		updateTimer();
	} else {
		circleBoundary.image = circleOpen;
		circleSmall.timer = undefined;
	}

	var ori = checkOrientation();

	uax = mapVal(-ori * $("#tiltHorizontal").html(), -45, 45, -scaleX * Math.abs(ax), scaleX * Math.abs(ax));
	uay = mapVal(ori * +$("#tiltVertical").html(), -45, 45, -scaleY * Math.abs(ay), scaleY * Math.abs(ay));

	circleSmall.setHeading(circleSmall.hx + ax + uax, circleSmall.hy + ay + uay);
}

function updateTimer() {
	var curTime = +new Date();
	circleSmall.timeElapsed += (curTime - circleSmall.timer);
	circleSmall.timer = curTime;
	$("#timer").html((circleSmall.timeElapsed / 1000).toFixed(2));
}

function sendData() {
	$.cookie("balancePercent", $("#percent").html());
	$.cookie("balanceTime", $("#time").html());

	$("#endMessage").modal("hide");
}

function mapVal(x, in_min, in_max, out_min, out_max) {
  return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
