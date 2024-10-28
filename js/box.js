
(function ()
{

  'use strict';

  // var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
  // var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
  // var F3 = 1.0 / 3.0;
  // var G3 = 1.0 / 6.0;
  // var F4 = (Math.sqrt(5.0) - 1.0) / 4.0;
  // var G4 = (5.0 - Math.sqrt(5.0)) / 20.0;

  function Box() {
  }

  Box.prototype = {

    geometry: new THREE.BufferGeometry(),
    indices: [],
    vertices: [],
    normals: [],
    colors: [],

    noise2D: function () {
      return 0;
    },
  }

  // amd
  if (typeof define !== 'undefined' && define.amd) define(function() {return Box;});
  // common js
  if (typeof exports !== 'undefined') exports.Box = Box;
  // browser
  else if (typeof window !== 'undefined') window.Box = Box;
  // nodejs
  if (typeof module !== 'undefined') {
    module.exports = Box;
  }

})();
