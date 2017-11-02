cv = require("./opencv.js");
config = require("./config.js");
common = require("./common.js");

var TYPES = common.types;

(function() {
  var Kernels = (function() {
    // Iterations will be considered only if config.duration property is set to null
    var Kernels = {


      // example function
      add: {
        name: 'cv.add',
        types: [TYPES.UCharC1, TYPES.ShortC1, TYPES.FloatC1],
        allocate: function(type, image_rows, image_cols) {
          this.mat = cv.Mat.ones(image_rows, image_cols, type);
          this.mat2 = cv.Mat.eye(image_rows, image_cols, type);
          this.mat3 = new cv.Mat();
        },
        from_yuv_data: function(data, image_rows, image_cols) {
          var t1 = Date.now();
          var yuvMat = new cv.Mat(image_rows+image_rows/2, image_cols, TYPES.UCharC1);
          yuvMat.data.set(data);
          // TODO other color formats
          cv.cvtColor(yuvMat, this.mat, cv.COLOR_YUV2GRAY_I420);
          cv.cvtColor(yuvMat, this.mat2, cv.COLOR_YUV2GRAY_I420);
          yuvMat.delete();
          return Date.now() - t1;
        },
        callable: function() {
          return {'func': cv.add, 'params': [this.mat, this.mat2, this.mat3]};
        },
        deallocate: function () {
          this.mat.delete();
          this.mat2.delete();
          this.mat3.delete();
        }
      }
    }

    return Kernels;
  })();

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = Kernels;
  }
  else {
    if (typeof define === 'function' && define.amd) {
      define([], function() {
        return Kernels;
      });
    }
    else {
      window.Kernels = Kernels;
    }
  }

})();
