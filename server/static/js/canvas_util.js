
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

	this.timer = undefined;
	this.timeElapsed = 0;

	this.grabbed = false;
	this.image = document.getElementById(id);
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");
}

// getter for touch id
CanvasImage.prototype.getCurrentTouchId = function () {
	return this.uniqueId;
}

// setter for touch id
CanvasImage.prototype.setCurrentTouchId = function (n_id) {
	this.uniqueId = n_id;
}

// gets the distance to a Canvas Image
CanvasImage.prototype.distanceTo = function (n_x, n_y) {
	return Math.sqrt(Math.pow(this.x - n_x, 2) + Math.pow(this.y - n_y, 2));
}

// checks if to CanvasImages intersect
CanvasImage.prototype.intersects = function (canvasImage) {
	return (
		(
			canvasImage.x - 
			canvasImage.image.width / 2 < 
			this.x + this.image.width / 2
		) && 
		(
			canvasImage.x + 
			canvasImage.image.width / 2 > 
			this.x - this.image.width / 2
		) && 
		(
			canvasImage.y - 
			canvasImage.image.height / 2 < 
			this.y + this.image.height / 2
		) && 
		(
			canvasImage.y + 
			canvasImage.image.height / 2 > 
			this.y - this.image.height / 2
		)
	);
}

// setter for the transformation vector
CanvasImage.prototype.setTransformVector = function (n_tx, n_ty) {
	this.tx = n_tx;
	this.ty = n_ty;
}

// draws the image on the canvas
CanvasImage.prototype.redraw = function() {
	this.context.drawImage(
		this.image, 
		this.x - this.image.width / 2, 
		this.y - this.image.height / 2
	);
}

// Draws the image on the specified canvas
CanvasImage.prototype.updatePosition = function (n_x, n_y) {

	// updates the velocity
	this.vx = n_x - this.x;
	this.vy = n_y - this.y;

	// updates the current position
	this.x = n_x + this.tx;
	this.y = n_y + this.ty;
	return this;
}

// setter for the heading
CanvasImage.prototype.setHeading = function (n_x, n_y) {
	this.hx = n_x;
	this.hy = n_y;
}

// increments the position based on the current heading
CanvasImage.prototype.incrementPosition = function () {
	this.x = this.x + this.tx + this.hx;
	this.y = this.y + this.ty + this.hy;
	return this;
}

// clears the canvas
CanvasImage.prototype.clearCanvas = function () {
	// clears the canvas and draws the new image
	this.context.clearRect(
		0, 0, 
		this.canvas.width, 
		this.canvas.height
	);
}

// checks if a point is inside the image
CanvasImage.prototype.withinBounds = function (n_x, n_y) {
	if (
			(
				n_x > this.x - this.image.width / 2 && 
				n_x < this.x + this.image.width / 2
			) && 
			(
				n_y > this.y - this.image.height / 2 && 
				n_y < this.y + this.image.height / 2
			)
	) {
		return true;
	} else {
		return false;
	}
}

// updates the grabbed variable if the touch is within bounds
// and sets the transformation vector
CanvasImage.prototype.updateGrabbed = function (n_touch) {
	this.grabbed = this.withinBounds(
		n_touch.pageX, 
		n_touch.pageY
	);
	if (this.grabbed) {
		this.setCurrentTouchId(n_touch.identifier);
		this.setTransformVector(
			this.x - n_touch.pageX, 
			this.y - n_touch.pageY
		);
	}
}

// should be called when their is no longer a hold
// on the image
CanvasImage.prototype.releaseGrabbed = function () {
	this.grabbed = false;
	this.setCurrentTouchId(undefined);
	this.setTransformVector(0, 0);

}

// object used for building mazes
function CanvasRectangle(xPos, yPos, width, height) {
	this.x = xPos;
	this.y = yPos;
	this.width = width;
	this.height = height;
}

// draws the rectangle on the canvas
CanvasRectangle.prototype.redraw = function (context, innerColor, outerColor, lineWidth) {
	context.beginPath();
	context.rect(
		this.x, this.y, 
		this.width, this.height
	);
	context.fillStyle = innerColor;
	context.fill();
    context.lineWidth = lineWidth;
    context.strokeStyle = outerColor;
    context.stroke();
}

// checks if a canvas image intersects with the rectangle
CanvasRectangle.prototype.intersects = function (canvasImage, px, py) {
	return (
		px - canvasImage.image.width / 2 < this.x + this.width && 
		px + canvasImage.image.width / 2 > this.x && 
		py - canvasImage.image.height / 2 < this.y + this.height && 
		py + canvasImage.image.height / 2 > this.y
	);
}

// object used to store data about a maze
// created 
function CanvasMap(canvasId, obstacleArray) {
	this.canvas = document.getElementById(canvasId);
	this.context = this.canvas.getContext("2d");

	// list of Rectangle objects
	this.obstacleArray = obstacleArray;
}

// draws the map
CanvasMap.prototype.redraw = function () {
	for (var i = 0; i < this.obstacleArray.length; i++) {
		this.obstacleArray[i].redraw(
			this.context, 
			"lightblue", 
			"black", 
			4
		);
	}
}

// clears the canvas
CanvasMap.prototype.clearCanvas = function () {
	// clears the canvas and draws the new image
	this.context.clearRect(
		0, 0, 
		this.canvas.width, 
		this.canvas.height
	);
}

// checks if any intersects exists between a canvas image
// and the obstacle array
CanvasMap.prototype.intersects = function (canvasImage, px, py) {
	return this.obstacleArray.some(
		function (val, index, array) {
			return val.intersects(canvasImage, px, py);
		}
	);
}

