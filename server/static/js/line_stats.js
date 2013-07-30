
// object used to store data about the final
// results 
function FinalStats(sDev, eDev, vel) {
      this.sDeviation = sDev;
      this.eDeviation = eDev;
      this.vel = vel;
}

// object used to collect statistics 
// about the drawn line from the user
function LineStats() {
      // variable used if current line tracking
      // is in use
      this.currentLine = new Array();

      // stores the velocity from each line drawn
      this.globalVelValues = new Array();

      // stores the slopes from each line drawn
      this.globalMDistances = new Array();

      // stores the distances from the starting points
      // to the starting circle
      this.globalSDistances = new Array();

      // stores the distance from the ending points
      // to the ending circle
      this.globalEDistances = new Array();

      // dynamic starting point of the line
      this.sx = 0;
      this.sy = 0;

      // dynamic ending point of the line
      this.ex = 0;
      this.ey = 0;

      // starting time
      this.sTime = 0;

      // ending time
      this.eTime = 0;
}

// resets the data stored for the current line
LineStats.prototype.clearCurrentLine = function () {
      this.currentLine = new Array();
}

// pushes new data to the current line
LineStats.prototype.push = function (hx, hy) {
      this.currentLine.push(hy / hx);
}

// sets the starting time for the current line
LineStats.prototype.setStartTime = function () {
      this.sTime = +new Date();
}

// sets the ending time for the current line
LineStats.prototype.setEndTime = function () {
      this.eTime = +new Date();
}

// sets the starting position of the line
LineStats.prototype.setStart = function (x, y) {
      this.sx = x;
      this.sy = y;
}

// sets the ending point of the current line
LineStats.prototype.setEnd = function (x, y) {
      this.ex = x;
      this.ey = y;
}

// compiles the current statistics and puts the data into
// the respective arrays
LineStats.prototype.compileCurrentStats = function (lx1, ly1, lx2, ly2) {
      this.globalVelValues.push(
            1000 * 100 * Math.sqrt(
                  Math.pow(
                        (lx1 - lx2) / screen.width, 2
                  ) + 
                  Math.pow(
                        (ly1 - ly2) / screen.height, 2
                  )
            ) / (this.eTime - this.sTime)
      );
      this.globalSDistances.push(
            1000 * Math.sqrt(
                  Math.pow(
                        (lx1 - this.sx) / screen.width, 2
                  ) + 
                  Math.pow(
                        (ly1 - this.sy) / screen.height, 2
                  )
            )
      );
      this.globalEDistances.push(
            1000 * Math.sqrt(
                  Math.pow(
                        (lx2 - this.ex) / screen.width, 2
                  ) + 
                  Math.pow(
                        (ly2 - this.ey) / screen.height, 2
                  )
            )
      );
}

// returns a FinalStats object containing the average scaled
// statistics from each of the arrays
LineStats.prototype.getGlobalStats = function () {
      //alert(this.globalSDistances.avg().toFixed(2));
      return new FinalStats(
            this.globalSDistances.avg().toFixed(2), 
            this.globalEDistances.avg().toFixed(2),
            this.globalVelValues.avg().toFixed(2)
      );
}

// determines the average of a number array
Array.prototype.avg = function () {
      var sum = this.reduce(
            function (prev, cur, index, array) {
                  return prev + cur;
            }
      );
      return sum / this.length;
}
