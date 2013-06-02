
// Object definition for a canvas image
function CanvasImage(canvasId, id) {
	
	// x and y position of the image on the screen
	this.x = 0;
	this.y = 0;

	// transformation vector for fluid object movement
	this.tx = 0;
	this.ty = 0;

	// image velocity
	this.vx = 0;
	this.vy = 0;

	// image heading
	this.hx = 0;
	this.hy = 0;

	this.uniqueId = undefined;

	this.grabbed = false;
	this.image = document.getElementById(id);
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

CanvasImage.prototype.intersects = function (canvasImage) {
	return canvasImage.x - canvasImage.image.width / 2 < this.x + this.image.width / 2 && 
		canvasImage.x + canvasImage.image.width / 2 > this.x - this.image.width / 2 && 
		canvasImage.y - canvasImage.image.height / 2 < this.y + this.image.height /2 && 
		canvasImage.y + canvasImage.image.height / 2 > this.y - this.image.height / 2;
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

	// updates the velocity
	this.vx = n_x - this.x;
	this.vy = n_y - this.y;

	// updates the current position
	this.x = n_x + this.tx;
	this.y = n_y + this.ty;
}

CanvasImage.prototype.setHeading = function (n_x, n_y) {
	this.hx = n_x;
	this.hy = n_y;
}

CanvasImage.prototype.incrementPosition = function () {
	this.x = this.x + this.tx + this.hx;
	this.y = this.y + this.ty + this.hy;
}

CanvasImage.prototype.clearCanvas = function () {
	// clears the canvas and draws the new image
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasImage.prototype.withinBounds = function (n_x, n_y) {
	if (n_x > this.x - this.image.width / 2 && n_x < this.x + this.image.width / 2 && 
		n_y > this.y - this.image.height / 2 && n_y < this.y + this.image.height / 2) {
		return true;
	} else {
		return false;
	}
}

CanvasImage.prototype.updateGrabbed = function (n_touch) {
	this.grabbed = this.withinBounds(n_touch.pageX, n_touch.pageY);
	if (this.grabbed) {
		this.setCurrentTouchId(n_touch.identifier);
		this.setTransformVector(this.x - n_touch.pageX, this.y - n_touch.pageY);
	}
}

CanvasImage.prototype.releaseGrabbed = function () {
	this.grabbed = false;
	this.setCurrentTouchId(undefined);
	this.setTransformVector(0, 0);

}

function CanvasRectangle(xPos, yPos, width, height) {
	this.x = xPos;
	this.y = yPos;
	this.width = width;
	this.height = height;
}

CanvasRectangle.prototype.redraw = function (context, innerColor, outerColor, lineWidth) {
	context.beginPath();
	context.rect(this.x, this.y, this.width, this.height);
	context.fillStyle = innerColor;
	context.fill();
    context.lineWidth = lineWidth;
    context.strokeStyle = outerColor;
    context.stroke();
}

CanvasRectangle.prototype.intersects = function (canvasImage, px, py) {
	return px - canvasImage.image.width / 2 < this.x + this.width && 
		px + canvasImage.image.width / 2 > this.x && 
		py - canvasImage.image.height / 2 < this.y + this.height && 
		py + canvasImage.image.height / 2 > this.y;
}

function CanvasMap(canvasId, obstacleArray) {
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");

	// list of Rectangle objects
	this.obstacleArray = obstacleArray;
}

CanvasMap.prototype.redraw = function () {
	for (var i = 0; i < this.obstacleArray.length; i++) {
		this.obstacleArray[i].redraw(this.context, "lightblue", "black", 4);
	}
}

CanvasMap.prototype.clearCanvas = function () {
	// clears the canvas and draws the new image
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

CanvasMap.prototype.intersects = function (canvasImage, px, py) {
	return this.obstacleArray.some(function (val, index, array) {
		return val.intersects(canvasImage, px, py);
	});
}

