'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;

var _dom = require('../dom.js');

var _events = require('../events.js');

var _Target = require('../events/Target.js');

var _Target2 = _interopRequireDefault(_Target);

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _IconImageCache = require('./IconImageCache.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/style/IconImage
 */

var IconImage = /*@__PURE__*/function (EventTarget) {
  function IconImage(image, src, size, crossOrigin, imageState, color) {

    EventTarget.call(this);

    /**
     * @private
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    this.hitDetectionImage_ = null;

    /**
     * @private
     * @type {HTMLImageElement|HTMLCanvasElement}
     */
    this.image_ = !image ? new Image() : image;

    if (crossOrigin !== null) {
      /** @type {HTMLImageElement} */this.image_.crossOrigin = crossOrigin;
    }

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = color ?
    /** @type {HTMLCanvasElement} */document.createElement('canvas') : null;

    /**
     * @private
     * @type {import("../color.js").Color}
     */
    this.color_ = color;

    /**
     * @private
     * @type {Array<import("../events.js").EventsKey>}
     */
    this.imageListenerKeys_ = null;

    /**
     * @private
     * @type {import("../ImageState.js").default}
     */
    this.imageState_ = imageState;

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.size_ = size;

    /**
     * @private
     * @type {string|undefined}
     */
    this.src_ = src;

    /**
     * @private
     * @type {boolean|undefined}
     */
    this.tainted_;
  }

  if (EventTarget) IconImage.__proto__ = EventTarget;
  IconImage.prototype = Object.create(EventTarget && EventTarget.prototype);
  IconImage.prototype.constructor = IconImage;

  /**
   * @private
   * @return {boolean} The image canvas is tainted.
   */
  IconImage.prototype.isTainted_ = function isTainted_() {
    if (this.tainted_ === undefined && this.imageState_ === _ImageState2.default.LOADED) {
      this.tainted_ = false;
      var context = (0, _dom.createCanvasContext2D)(1, 1);
      try {
        context.drawImage(this.image_, 0, 0);
        context.getImageData(0, 0, 1, 1);
      } catch (e) {
        this.tainted_ = true;
      }
    }
    return this.tainted_ === true;
  };

  /**
   * @private
   */
  IconImage.prototype.dispatchChangeEvent_ = function dispatchChangeEvent_() {
    this.dispatchEvent(_EventType2.default.CHANGE);
  };

  /**
   * @private
   */
  IconImage.prototype.handleImageError_ = function handleImageError_() {
    this.imageState_ = _ImageState2.default.ERROR;
    this.unlistenImage_();
    this.dispatchChangeEvent_();
  };

  /**
   * @private
   */
  IconImage.prototype.handleImageLoad_ = function handleImageLoad_() {
    this.imageState_ = _ImageState2.default.LOADED;
    if (this.size_) {
      this.image_.width = this.size_[0];
      this.image_.height = this.size_[1];
    }
    this.size_ = [this.image_.width, this.image_.height];
    this.unlistenImage_();
    this.replaceColor_();
    this.dispatchChangeEvent_();
  };

  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement} Image or Canvas element.
   */
  IconImage.prototype.getImage = function getImage(pixelRatio) {
    return this.canvas_ ? this.canvas_ : this.image_;
  };

  /**
   * @return {import("../ImageState.js").default} Image state.
   */
  IconImage.prototype.getImageState = function getImageState() {
    return this.imageState_;
  };

  /**
   * @param {number} pixelRatio Pixel ratio.
   * @return {HTMLImageElement|HTMLCanvasElement} Image element.
   */
  IconImage.prototype.getHitDetectionImage = function getHitDetectionImage(pixelRatio) {
    if (!this.hitDetectionImage_) {
      if (this.isTainted_()) {
        var width = this.size_[0];
        var height = this.size_[1];
        var context = (0, _dom.createCanvasContext2D)(width, height);
        context.fillRect(0, 0, width, height);
        this.hitDetectionImage_ = context.canvas;
      } else {
        this.hitDetectionImage_ = this.image_;
      }
    }
    return this.hitDetectionImage_;
  };

  /**
   * @return {import("../size.js").Size} Image size.
   */
  IconImage.prototype.getSize = function getSize() {
    return this.size_;
  };

  /**
   * @return {string|undefined} Image src.
   */
  IconImage.prototype.getSrc = function getSrc() {
    return this.src_;
  };

  /**
   * Load not yet loaded URI.
   */
  IconImage.prototype.load = function load() {
    if (this.imageState_ == _ImageState2.default.IDLE) {
      this.imageState_ = _ImageState2.default.LOADING;
      this.imageListenerKeys_ = [(0, _events.listenOnce)(this.image_, _EventType2.default.ERROR, this.handleImageError_, this), (0, _events.listenOnce)(this.image_, _EventType2.default.LOAD, this.handleImageLoad_, this)];
      try {
        /** @type {HTMLImageElement} */this.image_.src = this.src_;
      } catch (e) {
        this.handleImageError_();
      }
    }
  };

  /**
   * @private
   */
  IconImage.prototype.replaceColor_ = function replaceColor_() {
    if (!this.color_ || this.isTainted_()) {
      return;
    }

    this.canvas_.width = this.image_.width;
    this.canvas_.height = this.image_.height;

    var ctx = this.canvas_.getContext('2d');
    ctx.drawImage(this.image_, 0, 0);

    var imgData = ctx.getImageData(0, 0, this.image_.width, this.image_.height);
    var data = imgData.data;
    var r = this.color_[0] / 255.0;
    var g = this.color_[1] / 255.0;
    var b = this.color_[2] / 255.0;

    for (var i = 0, ii = data.length; i < ii; i += 4) {
      data[i] *= r;
      data[i + 1] *= g;
      data[i + 2] *= b;
    }
    ctx.putImageData(imgData, 0, 0);
  };

  /**
   * Discards event handlers which listen for load completion or errors.
   *
   * @private
   */
  IconImage.prototype.unlistenImage_ = function unlistenImage_() {
    this.imageListenerKeys_.forEach(_events.unlistenByKey);
    this.imageListenerKeys_ = null;
  };

  return IconImage;
}(_Target2.default);

/**
 * @param {HTMLImageElement|HTMLCanvasElement} image Image.
 * @param {string} src Src.
 * @param {import("../size.js").Size} size Size.
 * @param {?string} crossOrigin Cross origin.
 * @param {import("../ImageState.js").default} imageState Image state.
 * @param {import("../color.js").Color} color Color.
 * @return {IconImage} Icon image.
 */
function get(image, src, size, crossOrigin, imageState, color) {
  var iconImage = _IconImageCache.shared.get(src, crossOrigin, color);
  if (!iconImage) {
    iconImage = new IconImage(image, src, size, crossOrigin, imageState, color);
    _IconImageCache.shared.set(src, crossOrigin, color, iconImage);
  }
  return iconImage;
}

exports.default = IconImage;

//# sourceMappingURL=IconImage.js.map