
// Fields
var c_img = new CanvasImage("mainCanvas", "c_img");

window.onload = function() {

	// Gets the canvas
	var canvas = document.getElementById("mainCanvas");

	// Makes the canvas the size of the page
    canvas.width = document.width;
    canvas.height = document.height;

    c_img.draw(300, 300);

  	// If it is touchable, touch functions get fired
    if('createTouch' in document) {
		canvas.addEventListener('touchstart', onTouchStart, false);
		canvas.addEventListener('touchmove', onTouchMove, false);
		canvas.addEventListener('touchend', onTouchEnd, false);
	}
}

// Object definition for a canvas image
function CanvasImage(canvasId, id) {
	this.x = 0;
	this.y = 0;
	this.grabbed = false;
	this.image = document.getElementById(id);
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
}

// Draws the image on the specified canvas
CanvasImage.prototype.draw = function(n_x, n_y) {
	
	// updates the current position
	this.x = n_x;
	this.y = n_y;

	// clears the canvas and draws the new image
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	this.context.drawImage(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
}

CanvasImage.prototype.withinBounds = function(n_x, n_y) {
	if (n_x > this.x - this.image.width / 2 && n_x < this.x + this.image.width / 2 && 
		n_y > this.y - this.image.height / 2 && n_y < this.y + this.image.height / 2) {
		return true;
	}
}

CanvasImage.prototype.updateGrabbed = function(n_x, n_y) {
	this.grabbed = this.withinBounds(n_x, n_y);
}

function onTouchStart(event) {
	//c_img.draw(event.touches[0].pageX, event.touches[0].pageY);
	c_img.updateGrabbed(event.touches[0].pageX, event.touches[0].pageY);
}
 
function onTouchMove(event) {
	$("#label").html(event.touches[0].pageX + ", " + event.touches[0].pageY);
	if (c_img.grabbed) {
		c_img.draw(event.touches[0].pageX, event.touches[0].pageY);
	}

	// prevents the browser to do what it usually does
	event.preventDefault(); 
} 
 
function onTouchEnd(event) { 
	c_img.grabbed = false;
}

