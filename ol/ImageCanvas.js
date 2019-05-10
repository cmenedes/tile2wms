'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ImageBase = require('./ImageBase.js');

var _ImageBase2 = _interopRequireDefault(_ImageBase);

var _ImageState = require('./ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A function that is called to trigger asynchronous canvas drawing.  It is
 * called with a "done" callback that should be called when drawing is done.
 * If any error occurs during drawing, the "done" callback should be called with
 * that error.
 *
 * @typedef {function(function(Error=))} Loader
 */

/**
 * @module ol/ImageCanvas
 */
var ImageCanvas = /*@__PURE__*/function (ImageBase) {
  function ImageCanvas(extent, resolution, pixelRatio, canvas, opt_loader) {

    var state = opt_loader !== undefined ? _ImageState2.default.IDLE : _ImageState2.default.LOADED;

    ImageBase.call(this, extent, resolution, pixelRatio, state);

    /**
     * Optional canvas loader function.
     * @type {?Loader}
     * @private
     */
    this.loader_ = opt_loader !== undefined ? opt_loader : null;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = canvas;

    /**
     * @private
     * @type {Error}
     */
    this.error_ = null;
  }

  if (ImageBase) ImageCanvas.__proto__ = ImageBase;
  ImageCanvas.prototype = Object.create(ImageBase && ImageBase.prototype);
  ImageCanvas.prototype.constructor = ImageCanvas;

  /**
   * Get any error associated with asynchronous rendering.
   * @return {Error} Any error that occurred during rendering.
   */
  ImageCanvas.prototype.getError = function getError() {
    return this.error_;
  };

  /**
   * Handle async drawing complete.
   * @param {Error=} err Any error during drawing.
   * @private
   */
  ImageCanvas.prototype.handleLoad_ = function handleLoad_(err) {
    if (err) {
      this.error_ = err;
      this.state = _ImageState2.default.ERROR;
    } else {
      this.state = _ImageState2.default.LOADED;
    }
    this.changed();
  };

  /**
   * @inheritDoc
   */
  ImageCanvas.prototype.load = function load() {
    if (this.state == _ImageState2.default.IDLE) {
      this.state = _ImageState2.default.LOADING;
      this.changed();
      this.loader_(this.handleLoad_.bind(this));
    }
  };

  /**
   * @return {HTMLCanvasElement} Canvas element.
   */
  ImageCanvas.prototype.getImage = function getImage() {
    return this.canvas_;
  };

  return ImageCanvas;
}(_ImageBase2.default);

exports.default = ImageCanvas;

//# sourceMappingURL=ImageCanvas.js.map