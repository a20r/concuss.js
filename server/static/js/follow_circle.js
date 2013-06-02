
var circle_array = [new CanvasImage("mainCanvas", "open_circle"), new CanvasImage("mainCanvas", "open_circle")];

var interval = window.setInterval(updateBoundaryCircles, 5);

function initGame() {

	// Gets the canvas
	var canvas = document.getElementById("mainCanvas");

	// Makes the canvas the size of the page
    canvas.width = document.width;
    canvas.height = document.height;

    circle_array[0].updatePosition(150, 300);
    circle_array[1].updatePosition(600, 300);

    circle_array.map(function (val) {
    	val.redraw();
    });

  	// ff it is touchable, touch functions get fired
    if('createTouch' in document) {
		canvas.addEventListener('touchstart', onTouchStart, false);
		canvas.addEventListener('touchmove', onTouchMove, false);
		canvas.addEventListener('touchend', onTouchEnd, false);
	}
}

function onTouchStart(event) {
	for (var i in circle_array) {
		for (var t = 0; t < event.touches.length; t++) {
			if (circle_array[i].withinBounds(event.touches[t].pageX, event.touches[t].pageY)) {
				circle_array[i].setCurrentTouchId(event.touches[t].identifier);
				circle_array[i].image = document.getElementById("green_circle");
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
			if (circle_array[i].withinBounds(event.touches[t].pageX, event.touches[t].pageY)) {
				circle_array[i].image = document.getElementById("green_circle");
				//updateBoundaryCircles();
			} else {
				count++;
			}
		}
		if (count == event.touches.length) {
			circle_array[i].image = document.getElementById("open_circle");
		}
	}

	//img_array[0].clearCanvas();
	drawBoundaryCircles();
} 
 
function onTouchEnd(event) {
	//alert(circle_array[0].getCurrentTouchId());
	for (var i in circle_array) {
		var count = 0;
		for (var t = 0; t < event.touches.length; t++) {
			if (!circle_array[i].withinBounds(event.touches[t].pageX, event.touches[t].pageY)) {
				count++;
			}
		}
		if (count == event.touches.length) {
			circle_array[i].image = document.getElementById("open_circle");
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
		if (circle_array[i].y + circle_array[i].image.height / 2 + circle_array[i].hy > document.height ||
			circle_array[i].y - circle_array[i].image.height / 2  + circle_array[i].hy < 0) {
			circle_array[i].hy = -circle_array[i].hy;
		}

		// pushes the circle from the vertical boundaries
		if (circle_array[i].x + circle_array[i].image.width / 2  + circle_array[i].hx > document.width ||
			circle_array[i].x - circle_array[i].image.width / 2  + circle_array[i].hx < 0) {
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
	drawBoundaryCircles();
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

