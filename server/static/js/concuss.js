
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

