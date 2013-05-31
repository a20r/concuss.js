
// Fields
var img_array = [new CanvasImage("mainCanvas", "c_img"), new CanvasImage("mainCanvas", "c_img")];

window.onload = function() {

	// Gets the canvas
	var canvas = document.getElementById("mainCanvas");

	// Makes the canvas the size of the page
    canvas.width = document.width;
    canvas.height = document.height;

    // sets the starting positions of the circles
    img_array[0].updatePosition(300, 300);
    img_array[1].updatePosition(500, 300);

    // draws the circles
    img_array.map(function (val) {
    	val.redraw();
    });

  	// If it is touchable, touch functions get fired
    if('createTouch' in document) {
		canvas.addEventListener('touchstart', onTouchStart, false);
		canvas.addEventListener('touchmove', onTouchMove, false);
		canvas.addEventListener('touchend', onTouchEnd, false);
	}
}

function onTouchStart(event) {

	//c_img.draw(event.touches[0].pageX, event.touches[0].pageY);
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
			if (img_array[i].getCurrentTouchId() == event.touches[t].identifier) {
				img_array[i].updatePosition(event.touches[t].pageX, event.touches[t].pageY);
			}
		}
	}

	// clears the screen so shapes can be redrawn
	img_array[0].clearCanvas();

	// draws the circles back on the screen
	for (var i in img_array) {
		img_array[i].redraw();
	}
} 
 
function onTouchEnd(event) {

	// iterates through the touches and images
	// to see if any image has been let go
	for (var t = 0; event.touches.length; t++) {
		for (var i in img_array) {
			if (event.touhces[t].identifier == img_array[i].getCurrentTouchId()) {
				img_array[i].releaseGrabbed();
			}
		}
	}
}

