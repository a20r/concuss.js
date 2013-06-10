
// circle used for to indicate the starting and ending positions
var circleMedium = [new CanvasImage("mainCanvas", "circlemedium"), new CanvasImage("mainCanvas", "circlemedium")];

// circle used to draw with
var circleSmall = new CanvasImage("mainCanvas", "circlesmall");

// canvas used for the drawing
var canvas = document.getElementById("mainCanvas");

// context used for the canvas
var context = canvas.getContext("2d");

// circle showing length
var circleShowingTime = 0.5 * 1000;

var circleShowingTimeConstant = 0.5 * 1000;

// wait time before new configurations appear
var waitTime = 1 * 1000;

// funciton that fired to show new circles
var waitInterval = undefined;

// interval used to determine how long the circles are
// on the screen before you should start drawing
var circleInterval = undefined;

// counter that specifies how many times the 
// test will run
var maxCounter = 20;

// used ot hold the line statistics
var stats = new LineStats();

// used to hold final statistics
var endStats = undefined;

var counter = 0;

window.onload = initGame;

function initGame() {
      $("#startMessage").modal("show");

      // Makes the canvas the size of the page
      canvas.width = document.width;
      canvas.height = document.height;
      $("#startMessage").on("hidden", function () {
            drawRandomCircles(100);
            circleInterval = setInterval(getReadyForDrawing, circleShowingTime);
      });
      circleSmall.setTransformVector(-circleSmall.image.width / 2 - 20, -circleSmall.image.height - 20);
}

// occurs after the circles have been
// on the screen for long enough
function getReadyForDrawing() {
      circleSmall.clearCanvas();
      clearInterval(circleInterval);
      addTouchListeners();
}

// draws circles on either side of the canvas
// that the subject needs to draw a line 
// through
function drawRandomCircles(space) {
      circleMedium[0].updatePosition(getRandomInt(space, canvas.width / 2 - space), 
            getRandomInt(space, canvas.height - space)).redraw();
      circleMedium[1].updatePosition(getRandomInt(canvas.width / 2 + space, canvas.width - space), 
            getRandomInt(space, canvas.height - space)).redraw();
}

function addTouchListeners() {
      // if it is touchable, touch functions get fired
      if('createTouch' in document) {
            canvas.addEventListener('touchstart', onTouchStart, false);
            canvas.addEventListener('touchmove', onTouchMove, false);
            canvas.addEventListener('touchend', onTouchEnd, false);
      }
}

function removeTouchListeners() {
      if('createTouch' in document) {
            canvas.removeEventListener('touchstart', onTouchStart, false);
            canvas.removeEventListener('touchmove', onTouchMove, false);
            canvas.removeEventListener('touchend', onTouchEnd, false);
      }
}

// get the unix time here and from on touch end to get the time taken
function onTouchStart(event) {
      circleSmall.updatePosition(event.touches[0].pageX, event.touches[0].pageY).redraw();
      stats.setStartTime();
      stats.setStart(circleSmall.x, circleSmall.y);
}

function onTouchMove(event) {
      event.preventDefault();
      context.beginPath();
      context.moveTo(circleSmall.x, circleSmall.y);
      context.lineTo(event.touches[0].pageX + circleSmall.tx, event.touches[0].pageY + circleSmall.ty);
      context.lineWidth = 5;
      context.stroke();
      circleSmall.updatePosition(event.touches[0].pageX, event.touches[0].pageY);
}

function onTouchEnd(event) {
      removeTouchListeners();
      circleSmall.redraw();
      stats.setEndTime();
      stats.setEnd(circleSmall.x, circleSmall.y);
      stats.compileCurrentStats(circleMedium[0].x, circleMedium[0].y, circleMedium[1].x, circleMedium[1].y);

      circleMedium[0].redraw();
      circleMedium[1].redraw();
      waitInterval = setInterval(showTempResults, waitTime);
}

function whenGameEnds() {
      endStats = stats.getGlobalStats();
      //alert(endStats);
      $("#startingDeviation").html(endStats.sDeviation);
      $("#finalDeviation").html(endStats.eDeviation);
      $("#velocity").html(endStats.vel);
      $("#endMessage").modal("show");
}

function showTempResults() {
      clearInterval(waitInterval);
      if (++counter >= maxCounter) {
            whenGameEnds();
      } else {
            circleSmall.clearCanvas();
            drawRandomCircles(100);
            circleShowingTime -= (circleShowingTimeConstant / (maxCounter + 1));
            circleInterval = setInterval(getReadyForDrawing, circleShowingTime);
      }
}

// sends the data back to the server
function sendData() {
	$.ajax({
		type: 'POST',
      	url:'/form_submit/',
      	data: {
      		subject_data: JSON.stringify(
      			{
      				fName : $.cookie("fName").toLowerCase().replace(" ", "_"), 
      				lName : $.cookie("lName").toLowerCase().replace(" ", "_"),
      				email : $.cookie("email"),
      				age : parseInt($.cookie("age")),
      				sport : $.cookie("sport").toLowerCase().replace(" ", "_"),
      				gender : $.cookie("gender").toLowerCase(),
      				education : $.cookie("education").toLowerCase().replace(" ", "_"),
      				classification : $.cookie("classification").toLowerCase(),
      				priorConcussion : $.cookie("priorConcussion") == "Yes",
      				time : new Date().toString(),
      				results : {
      					reflex : {
      						circleA : {
      							time : parseFloat($.cookie("resultTime0")),
      							percent : parseFloat($.cookie("resultPercent0"))
      						}, 
      						circleB : {
      							time : parseFloat($.cookie("resultTime1")),
      							percent : parseFloat($.cookie("resultPercent1"))
      						}
      					}, 
                                    memory : {
                                          initialDev : parseFloat(endStats.sDeviation),
                                          finalDev : parseFloat(endStats.eDeviation),
                                          velocity : parseFloat(endStats.vel) 
                                    },
                                    balance : {
                                          time : parseFloat($.cookie("balanceTime")),
                                          percent : parseFloat($.cookie("balancePercent"))
                                    }
      				}
      			}
      		)
      	}
      });
	// hides the end message modal and displays a modal
	// that thanks the user for doing the test
    $("#endMessage").modal("hide");
    $("#thankYouMessage").modal('show');
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

