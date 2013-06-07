
function FinalStats(sDev, eDev, vel) {
      this.sDeviation = sDev;
      this.eDeviation = eDev;
      this.vel = vel;
}

function LineStats() {
      this.currentLine = new Array();
      this.globalVelValues = new Array();
      this.globalMDistances = new Array();
      this.globalSDistances = new Array();
      this.globalEDistances = new Array();
      this.sx = 0;
      this.sy = 0;
      this.ex = 0;
      this.ey = 0;

      this.sTime = 0;
      this.eTime = 0;
}

LineStats.prototype.clearCurrentLine = function () {
      this.currentLine = new Array();
}

LineStats.prototype.push = function (hx, hy) {
      this.currentLine.push(hy / hx);
}

LineStats.prototype.setStartTime = function () {
      this.sTime = +new Date();
}

LineStats.prototype.setEndTime = function () {
      this.eTime = +new Date();
}

LineStats.prototype.setStart = function (x, y) {
      this.sx = x;
      this.sy = y;
}

LineStats.prototype.setEnd = function (x, y) {
      this.ex = x;
      this.ey = y;
}

LineStats.prototype.compileCurrentStats = function (lx1, ly1, lx2, ly2) {
      this.globalVelValues.push(1000 * 100 * Math.sqrt(Math.pow((lx1 - lx2) / screen.width, 2) + 
            Math.pow((ly1 - ly2) / screen.height, 2)) / (this.eTime - this.sTime));
      this.globalSDistances.push(1000 * Math.sqrt(Math.pow((lx1 - this.sx) / screen.width, 2) + 
            Math.pow((ly1 - this.sy) / screen.height, 2)));
      this.globalEDistances.push(1000 * Math.sqrt(Math.pow((lx2 - this.ex) / screen.width, 2) + 
            Math.pow((ly2 - this.ey) / screen.height, 2)));
}

LineStats.prototype.getGlobalStats = function () {
      //alert(this.globalSDistances.avg().toFixed(2));
      return new FinalStats(this.globalSDistances.avg().toFixed(2), this.globalEDistances.avg().toFixed(2),
            this.globalVelValues.avg().toFixed(2));
}

Array.prototype.avg = function () {
      var sum = this.reduce(function (prev, cur, index, array) {
            return prev + cur;
      });
      return sum / this.length;
}
