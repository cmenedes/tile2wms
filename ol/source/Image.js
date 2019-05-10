'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultImageLoadFunction = defaultImageLoadFunction;

var _util = require('../util.js');

var _common = require('../reproj/common.js');

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _array = require('../array.js');

var _Event = require('../events/Event.js');

var _Event2 = _interopRequireDefault(_Event);

var _extent = require('../extent.js');

var _proj = require('../proj.js');

var _Image = require('../reproj/Image.js');

var _Image2 = _interopRequireDefault(_Image);

var _Source = require('./Source.js');

var _Source2 = _interopRequireDefault(_Source);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @enum {string}
 */
var ImageSourceEventType = {

  /**
   * Triggered when an image starts loading.
   * @event ol/source/Image~ImageSourceEvent#imageloadstart
   * @api
   */
  IMAGELOADSTART: 'imageloadstart',

  /**
   * Triggered when an image finishes loading.
   * @event ol/source/Image~ImageSourceEvent#imageloadend
   * @api
   */
  IMAGELOADEND: 'imageloadend',

  /**
   * Triggered if image loading results in an error.
   * @event ol/source/Image~ImageSourceEvent#imageloaderror
   * @api
   */
  IMAGELOADERROR: 'imageloaderror'

};

/**
 * @classdesc
 * Events emitted by {@link module:ol/source/Image~ImageSource} instances are instances of this
 * type.
 */
/**
 * @module ol/source/Image
 */
var ImageSourceEvent = /*@__PURE__*/function (Event) {
  function ImageSourceEvent(type, image) {

    Event.call(this, type);

    /**
     * The image related to the event.
     * @type {import("../Image.js").default}
     * @api
     */
    this.image = image;
  }

  if (Event) ImageSourceEvent.__proto__ = Event;
  ImageSourceEvent.prototype = Object.create(Event && Event.prototype);
  ImageSourceEvent.prototype.constructor = ImageSourceEvent;

  return ImageSourceEvent;
}(_Event2.default);

/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions]
 * @property {import("../proj.js").ProjectionLike} projection
 * @property {Array<number>} [resolutions]
 * @property {import("./State.js").default} [state]
 */

/**
 * @classdesc
 * Abstract base class; normally only used for creating subclasses and not
 * instantiated in apps.
 * Base class for sources providing a single image.
 * @abstract
 * @api
 */
var ImageSource = /*@__PURE__*/function (Source) {
  function ImageSource(options) {
    Source.call(this, {
      attributions: options.attributions,
      projection: options.projection,
      state: options.state
    });

    /**
     * @private
     * @type {Array<number>}
     */
    this.resolutions_ = options.resolutions !== undefined ? options.resolutions : null;

    /**
     * @private
     * @type {import("../reproj/Image.js").default}
     */
    this.reprojectedImage_ = null;

    /**
     * @private
     * @type {number}
     */
    this.reprojectedRevision_ = 0;
  }

  if (Source) ImageSource.__proto__ = Source;
  ImageSource.prototype = Object.create(Source && Source.prototype);
  ImageSource.prototype.constructor = ImageSource;

  /**
   * @return {Array<number>} Resolutions.
   * @override
   */
  ImageSource.prototype.getResolutions = function getResolutions() {
    return this.resolutions_;
  };

  /**
   * @protected
   * @param {number} resolution Resolution.
   * @return {number} Resolution.
   */
  ImageSource.prototype.findNearestResolution = function findNearestResolution(resolution) {
    if (this.resolutions_) {
      var idx = (0, _array.linearFindNearest)(this.resolutions_, resolution, 0);
      resolution = this.resolutions_[idx];
    }
    return resolution;
  };

  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../ImageBase.js").default} Single image.
   */
  ImageSource.prototype.getImage = function getImage(extent, resolution, pixelRatio, projection) {
    var sourceProjection = this.getProjection();
    if (!_common.ENABLE_RASTER_REPROJECTION || !sourceProjection || !projection || (0, _proj.equivalent)(sourceProjection, projection)) {
      if (sourceProjection) {
        projection = sourceProjection;
      }
      return this.getImageInternal(extent, resolution, pixelRatio, projection);
    } else {
      if (this.reprojectedImage_) {
        if (this.reprojectedRevision_ == this.getRevision() && (0, _proj.equivalent)(this.reprojectedImage_.getProjection(), projection) && this.reprojectedImage_.getResolution() == resolution && (0, _extent.equals)(this.reprojectedImage_.getExtent(), extent)) {
          return this.reprojectedImage_;
        }
        this.reprojectedImage_.dispose();
        this.reprojectedImage_ = null;
      }

      this.reprojectedImage_ = new _Image2.default(sourceProjection, projection, extent, resolution, pixelRatio, function (extent, resolution, pixelRatio) {
        return this.getImageInternal(extent, resolution, pixelRatio, sourceProjection);
      }.bind(this));
      this.reprojectedRevision_ = this.getRevision();

      return this.reprojectedImage_;
    }
  };

  /**
   * @abstract
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {number} resolution Resolution.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @return {import("../ImageBase.js").default} Single image.
   * @protected
   */
  ImageSource.prototype.getImageInternal = function getImageInternal(extent, resolution, pixelRatio, projection) {
    return (0, _util.abstract)();
  };

  /**
   * Handle image change events.
   * @param {import("../events/Event.js").default} event Event.
   * @protected
   */
  ImageSource.prototype.handleImageChange = function handleImageChange(event) {
    var image = /** @type {import("../Image.js").default} */event.target;
    switch (image.getState()) {
      case _ImageState2.default.LOADING:
        this.loading = true;
        this.dispatchEvent(new ImageSourceEvent(ImageSourceEventType.IMAGELOADSTART, image));
        break;
      case _ImageState2.default.LOADED:
        this.loading = false;
        this.dispatchEvent(new ImageSourceEvent(ImageSourceEventType.IMAGELOADEND, image));
        break;
      case _ImageState2.default.ERROR:
        this.loading = false;
        this.dispatchEvent(new ImageSourceEvent(ImageSourceEventType.IMAGELOADERROR, image));
        break;
      default:
      // pass
    }
  };

  return ImageSource;
}(_Source2.default);

/**
 * Default image load function for image sources that use import("../Image.js").Image image
 * instances.
 * @param {import("../Image.js").default} image Image.
 * @param {string} src Source.
 */
function defaultImageLoadFunction(image, src) {
  /** @type {HTMLImageElement|HTMLVideoElement} */image.getImage().src = src;
}

exports.default = ImageSource;

//# sourceMappingURL=Image.js.map