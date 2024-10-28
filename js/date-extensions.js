
// see https://stackoverflow.com/a/30458400

Date.prototype.yyyymm = function () {
  var yyyy = this.getFullYear();
  var mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1); // getMonth() is zero-based
  return "".concat(yyyy).concat(mm);
};

Date.prototype.yyyymmdd = function() {
  var yyyymm = this.yyyymm();
  var dd = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
  return "".concat(yyyymm).concat(dd);
};

  Date.prototype.hhmm = function() {
    var hh = this.getHours() < 10 ? "0" + this.getHours() : this.getHours();
    var min = this.getMinutes() < 10 ? "0" + this.getMinutes() : this.getMinutes();
    return "".concat(hh).concat(min);
  };
  
  Date.prototype.hhmmss = function() {
    var hhmm = this.hhmm();
    var ss = this.getSeconds() < 10 ? "0" + this.getSeconds() : this.getSeconds();
    return "".concat(hhmm).concat(ss);
};
  
  Date.prototype.yyyymmddhhmm = function() {
    var yyyymmdd = this.yyyymmdd();
    var hhmm = this.hhmm();
    return "".concat(yyyymmdd).concat(hhmm);
  };
  
  Date.prototype.yyyymmddhhmmss = function() {
    var yyyymmdd = this.yyyymmdd();
    var hhmmss = this.hhmmss();
    return "".concat(yyyymmdd).concat(hhmmss);
  };