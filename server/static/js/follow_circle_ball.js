
// Fields
var img_array = [new CanvasImage("mainCanvas", "c_img"), new CanvasImage("mainCanvas", "c_img")];
var circle_array = [new CanvasImage("mainCanvas", "open_circle"), new CanvasImage("mainCanvas", "open_circle")];

var interval = window.setInterval(updateBoundaryCircles, 5);

function initGame() {

	// Gets the canvas
	var canvas = document.getElementById("mainCanvas");

	// Makes the canvas the size of the page
    canvas.width = document.width;
    canvas.height = document.height;

    // sets the starting positions of the circles
    img_array[0].updatePosition(150, 300);
    img_array[1].updatePosition(600, 300);

    circle_array[0].updatePosition(150, 300);
    circle_array[1].updatePosition(600, 300);

    // draws the circles
    img_array.map(function (val) {
    	val.redraw();
    });

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

	//window.clearInterval(interval);
	// checks if touches fall inside any of the images
	for (var t = 0; t < event.touches.length; t++) {
		for (var i in img_array) {
			if (img_array[i].withinBounds(event.touches[t].pageX, event.touches[t].pageY)) {
				img_array[i].updateGrabbed(event.touches[t]);
			}
		}
	}
}

function onTouchMove(event) {

	// prevents JavaScript from doing what it usually does
	event.preventDefault();

	// iterates through all of images and checks if a certain
	// touch is within its bounds
	for (var i in img_array) {
		for (var t = 0; t < event.touches.length; t++) {
			if (img_array[i].getCurrentTouchId() == event.touches[t].identifier &&
				img_array[i].grabbed) {
				img_array[i].updatePosition(event.touches[t].pageX, event.touches[t].pageY);
			}
		}
	}

	//img_array[0].clearCanvas();

	// draws the circles back on the screen
	for (var i in img_array) {
		img_array[i].redraw();
	}
	drawBoundaryCircles();
} 
 
function onTouchEnd(event) {

	// iterates through the touches and images
	// to see if any image has been let go
	for (var t = 0; event.touches.length; t++) {
		for (var i in img_array) {
			if (event.touches[t].identifier == img_array[i].getCurrentTouchId()) {
				img_array[i].releaseGrabbed();
			}
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
	for (var i in img_array) {
		img_array[i].redraw();
	}
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

