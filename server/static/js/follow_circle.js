
// array of circle images used
var circle_array = [new CanvasImage("mainCanvas", "open_circle"), new CanvasImage("mainCanvas", "open_circle")];

// main drawing interval
var interval = undefined;

var gameLength = 25 * 1000;

// interval in which game lasts
var gameInterval = undefined;

// green circle used to show that the user has their finger
// inside the circle
var green_circle = document.getElementById("green_circle");

// open circle used to show that the user does not have
// their finger inside the correct area
var open_circle = document.getElementById("open_circle");

// Gets the canvas
var canvas = document.getElementById("mainCanvas");

// Function that needs to be called to initiate the game
function initGame() {

	$("#startMessage").modal("show");

	// Makes the canvas the size of the page
    canvas.width = document.width;
    canvas.height = document.height;

    circle_array[0].updatePosition(150, 300);
    circle_array[1].updatePosition(600, 300);

    circle_array.map(function (val) {
    	val.redraw();
    });

  	// if it is touchable, touch functions get fired
    if('createTouch' in document) {
		canvas.addEventListener('touchstart', onTouchStart, false);
		canvas.addEventListener('touchmove', onTouchMove, false);
		canvas.addEventListener('touchend', onTouchEnd, false);
	}
	$('#endMessage').on('hide', function () {
  		for (var i in circle_array) {
			circle_array[i].timeElapsed = 0;
			circle_array[i].timer = undefined;
			circle_array[i].image = open_circle;
			$("#timer" + i).html((0).toFixed(2));
		}
	});
}

function sendData() {
	$.ajax({
		type: 'POST',
      	url:'/form_submit/',
      	data: {
      		subject_data: JSON.stringify(
      			{
      				fName : $.cookie("fName"), 
      				lName : $.cookie("lName"),
      				email : $.cookie("email"),
      				age : $.cookie("age"),
      				sport : $.cookie("sport"),
      				gender : $.cookie("gender"),
      				education : $.cookie("education"),
      				classification : $.cookie("classification"),
      				priorConcussion : $.cookie("priorConcussion"),
      				time : new Date().toString(),
      				results : {
      					reflex : {
      						circleA : {
      							time : $("#resultTime0").html().split(" ")[0],
      							percent : $("#resultPercent0").html().split("%")[0]
      						}, 
      						circleB : {
      							time : $("#resultTime1").html().split(" ")[0],
      							percent : $("#resultPercent1").html().split("%")[0]
      						}
      					}
      				}
      			}
      		)
      	}
    });
    $("#endMessage").modal("hide");
    $("#thankYouMessage").modal('show');
}

// obviously occurs when game ends. Shows a modal with the score
function whenGameEnds() {
	window.clearInterval(gameInterval);
	for (var i = 0; i < circle_array.length; i++) {
		$("#resultTime" + i).html((+ $("#timer" + i).html()).toFixed(2) + " sec");
		$("#resultPercent" + i).html((+ $("#timer" + i).html() / gameLength * 1000 * 100).toFixed(1) + "%");
	}
	$("#endMessage").modal('show');
}

function onTouchStart(event) {
	if (interval == undefined) {
		interval = window.setInterval(updateBoundaryCircles, 5);
	}
	for (var i in circle_array) {
		for (var t = 0; t < event.touches.length; t++) {
			if (circle_array[i].withinBounds(event.touches[t].pageX, event.touches[t].pageY - 60)) {
				if (gameInterval == undefined) {
					gameInterval = window.setInterval(whenGameEnds, gameLength);
				}
				circle_array[i].setCurrentTouchId(event.touches[t].identifier);
				circle_array[i].image = green_circle;
				if (circle_array[i].timer == undefined) {
					circle_array[i].timer = new Date().getTime();
				}
				//updateBoundaryCircles();
			}
		}
	}
}

function onTouchMove(event) {

	// prevents JavaScript from doing what it usually does
	event.preventDefault();

	// iterates through all of images and checks if a certain
	// touch is within its bounds
	for (var i in circle_array) {
		var count = 0;
		for (var t = 0; t < event.touches.length; t++) {
			if (circle_array[i].withinBounds(event.touches[t].pageX, event.touches[t].pageY - 60)) {
				circle_array[i].image = green_circle;
				if (circle_array[i].timer == undefined) {
					circle_array[i].timer = new Date().getTime();
				}
				//updateBoundaryCircles();
			} else {
				count++;
			}
		}
		if (count == event.touches.length) {
			circle_array[i].image = open_circle;
			circle_array[i].timer = undefined;
		}
	}
	//drawBoundaryCircles();
} 
 
function onTouchEnd(event) {
	for (var i in circle_array) {
		var count = 0;
		for (var t = 0; t < event.touches.length; t++) {
			if (!circle_array[i].withinBounds(event.touches[t].pageX, event.touches[t].pageY - 60)) {
				count++;
			}
		}
		if (count == event.touches.length) {
			circle_array[i].image = open_circle;
			circle_array[i].timer = undefined;
		}
	}
}

function drawBoundaryCircles() {
	for (var i in circle_array) {
		// gets a new random heading
		if (getRandomInt(-1000, 10) > 0) {
			circle_array[i].setHeading(getRandomInt(-3, 3), getRandomInt(-3, 3));
		}

		// pushes the circle from the horizontal boundaries
		if (circle_array[i].y + circle_array[i].image.height / 2 + circle_array[i].hy > document.height - 120 ||
			circle_array[i].y - circle_array[i].image.height / 2  + circle_array[i].hy < 0) {
			circle_array[i].hy = -circle_array[i].hy;
		}

		// pushes the circle from the vertical boundaries
		if (circle_array[i].x + circle_array[i].image.width / 2  + circle_array[i].hx > document.width - 30 ||
			circle_array[i].x - circle_array[i].image.width / 2  + circle_array[i].hx < 0 ) {
			circle_array[i].hx = -circle_array[i].hx;
		}

		// checks if the balls are hitting each other, and if so, negate the headings
		for (var k in circle_array) {
			if (circle_array[i].intersects(circle_array[k]) && k != i) {
				circle_array[i].setHeading(-circle_array[i].hx, -circle_array[i].hy);
			}
		}

		// increments the position
		circle_array[i].incrementPosition();
		circle_array[i].redraw();
	}
}

function updateBoundaryCircles() {
	circle_array[0].clearCanvas();
	var curTime = new Date().getTime();

	// updates the timers 
	for (var i in circle_array) {
		if (circle_array[i].timer != undefined) {
			circle_array[i].timeElapsed += (curTime - circle_array[i].timer);
			circle_array[i].timer = curTime;
			$("#timer" + i).html((circle_array[i].timeElapsed / 1000).toFixed(2));
		}
	}
	drawBoundaryCircles();
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

