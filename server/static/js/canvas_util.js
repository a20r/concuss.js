
// Object definition for a canvas image
function CanvasImage(canvasId, id) {
	
	// x and y position of the image on the screen
	this.x = 0;
	this.y = 0;

	// transformation vector for fluid object movement
	this.tx = 0;
	this.ty = 0;

	this.uniqueId = undefined;

	this.grabbed = false;
	this.image = new Image();
	this.image.src = document.getElementById(id).src;
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
}

CanvasImage.prototype.getCurrentTouchId = function () {
	return this.uniqueId;
}

CanvasImage.prototype.setCurrentTouchId = function (n_id) {
	this.uniqueId = n_id;
}

CanvasImage.prototype.distanceTo = function (n_x, n_y) {
	return Math.sqrt(Math.pow(this.x - n_x, 2) + Math.pow(this.y - n_y, 2));
}

CanvasImage.prototype.setTransformVector = function (n_tx, n_ty) {
	this.tx = n_tx;
	this.ty = n_ty;
}

CanvasImage.prototype.redraw = function() {
	this.context.drawImage(this.image, this.x - this.image.width / 2, this.y - this.image.height / 2);
}

// Draws the image on the specified canvas
CanvasImage.prototype.updatePosition = function (n_x, n_y) {

	// updates the current position
	this.x = n_x + this.tx;
	this.y = n_y + this.ty;
}

CanvasImage.prototype.clearCanvas = function () {
	// clears the canvas and draws the new image
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasImage.prototype.withinBounds = function (n_x, n_y) {
	if (n_x > this.x - this.image.width / 2 && n_x < this.x + this.image.width / 2 && 
		n_y > this.y - this.image.height / 2 + 50 && n_y < this.y + this.image.height / 2 + 50) {
		return true;
	} else {
		return false;
	}
}

CanvasImage.prototype.updateGrabbed = function (n_x, n_y) {
	this.grabbed = this.withinBounds(n_x, n_y);
	if (this.grabbed) {
		this.setTransformVector(this.x - n_x, this.y - n_y);
	}
}

CanvasImage.prototype.releaseGrabbed = function () {
	this.grabbed = false;
	this.setCurrentTouchId(undefined);
	this.setTransformVector(0, 0);

}
