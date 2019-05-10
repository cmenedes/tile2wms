'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ImageBase = require('./ImageBase.js');

var _ImageBase2 = _interopRequireDefault(_ImageBase);

var _ImageState = require('./ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _events = require('./events.js');

var _EventType = require('./events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('./extent.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * A function that takes an {@link module:ol/Image~Image} for the image and a
 * `{string}` for the src as arguments. It is supposed to make it so the
 * underlying image {@link module:ol/Image~Image#getImage} is assigned the
 * content specified by the src. If not specified, the default is
 *
 *     function(image, src) {
 *       image.getImage().src = src;
 *     }
 *
 * Providing a custom `imageLoadFunction` can be useful to load images with
 * post requests or - in general - through XHR requests, where the src of the
 * image element would be set to a data URI when the content is loaded.
 *
 * @typedef {function(ImageWrapper, string)} LoadFunction
 * @api
 */

var ImageWrapper = /*@__PURE__*/function (ImageBase) {
  function ImageWrapper(extent, resolution, pixelRatio, src, crossOrigin, imageLoadFunction) {

    ImageBase.call(this, extent, resolution, pixelRatio, _ImageState2.default.IDLE);

    /**
     * @private
     * @type {string}
     */
    this.src_ = src;

    /**
     * @private
     * @type {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement}
     */
    this.image_ = new Image();
    if (crossOrigin !== null) {
      this.image_.crossOrigin = crossOrigin;
    }

    /**
     * @private
     * @type {Array<import("./events.js").EventsKey>}
     */
    this.imageListenerKeys_ = null;

    /**
     * @protected
     * @type {ImageState}
     */
    this.state = _ImageState2.default.IDLE;

    /**
     * @private
     * @type {LoadFunction}
     */
    this.imageLoadFunction_ = imageLoadFunction;
  }

  if (ImageBase) ImageWrapper.__proto__ = ImageBase;
  ImageWrapper.prototype = Object.create(ImageBase && ImageBase.prototype);
  ImageWrapper.prototype.constructor = ImageWrapper;

  /**
   * @inheritDoc
   * @api
   */
  ImageWrapper.prototype.getImage = function getImage() {
    return this.image_;
  };

  /**
   * Tracks loading or read errors.
   *
   * @private
   */
  ImageWrapper.prototype.handleImageError_ = function handleImageError_() {
    this.state = _ImageState2.default.ERROR;
    this.unlistenImage_();
    this.changed();
  };

  /**
   * Tracks successful image load.
   *
   * @private
   */
  ImageWrapper.prototype.handleImageLoad_ = function handleImageLoad_() {
    if (this.resolution === undefined) {
      this.resolution = (0, _extent.getHeight)(this.extent) / this.image_.height;
    }
    this.state = _ImageState2.default.LOADED;
    this.unlistenImage_();
    this.changed();
  };

  /**
   * Load the image or retry if loading previously failed.
   * Loading is taken care of by the tile queue, and calling this method is
   * only needed for preloading or for reloading in case of an error.
   * @override
   * @api
   */
  ImageWrapper.prototype.load = function load() {
    if (this.state == _ImageState2.default.IDLE || this.state == _ImageState2.default.ERROR) {
      this.state = _ImageState2.default.LOADING;
      this.changed();
      this.imageListenerKeys_ = [(0, _events.listenOnce)(this.image_, _EventType2.default.ERROR, this.handleImageError_, this), (0, _events.listenOnce)(this.image_, _EventType2.default.LOAD, this.handleImageLoad_, this)];
      this.imageLoadFunction_(this, this.src_);
    }
  };

  /**
   * @param {HTMLCanvasElement|HTMLImageElement|HTMLVideoElement} image Image.
   */
  ImageWrapper.prototype.setImage = function setImage(image) {
    this.image_ = image;
  };

  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  ImageWrapper.prototype.unlistenImage_ = function unlistenImage_() {
    this.imageListenerKeys_.forEach(_events.unlistenByKey);
    this.imageListenerKeys_ = null;
  };

  return ImageWrapper;
}(_ImageBase2.default); /**
                         * @module ol/Image
                         */
exports.default = ImageWrapper;

//# sourceMappingURL=Image.js.map