
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

CanvasImage.prototype.

CanvasImage.prototype.withinBounds = function(n_x, n_y) {
	if (n_x > this.x - this.image.width / 2 && n_x < this.x + this.image.width / 2 && 
		n_y > this.y - this.image.height / 2 && n_y < this.y + this.image.height / 2) {
		return true;
	} else {
		return false;
	}
}

CanvasImage.prototype.updateGrabbed = function(n_x, n_y) {
	this.grabbed = this.withinBounds(n_x, n_y);
}