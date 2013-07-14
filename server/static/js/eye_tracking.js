
var frameWaitTime = 10;

var canvas = document.getElementById(
  'mainCanvas'
);

window.onload = function() {
  canvas.width = 640;
  canvas.height = 480;
  if (hasGetUserMedia()) {
    navigator.webkitGetUserMedia(
      {video : true},
      showVideo,
      videoFail
    )
  } else {
      alert("balls");
  }
}

function showVideo(localMediaStream) {
  var video = document.querySelector(
    'video'
  );

  video.src = window.URL.createObjectURL(
    localMediaStream
  );

  setInterval(
    function () {
      draw(video, canvas)
    }, frameWaitTime
  );
}

function draw(video, thecanvas){
   // get the canvas context for drawing
   var context = thecanvas.getContext('2d');

   // draw the video contents into the canvas x, y, width, height
   context.drawImage(
     video,
     0,
     0,
     thecanvas.width,
     thecanvas.height
   );

   context.getImageData(0, 0, thecanvas.width, thecanvas.height).data
}

function videoFail(e) {
  console.log("Rejected brah", e);
}

function hasGetUserMedia() {
  // Note: Opera is unprefixed.
  return (
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  );
}
