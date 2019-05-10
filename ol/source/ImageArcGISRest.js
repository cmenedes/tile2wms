'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Image = require('../Image.js');

var _Image2 = _interopRequireDefault(_Image);

var _asserts = require('../asserts.js');

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _obj = require('../obj.js');

var _Image3 = require('./Image.js');

var _Image4 = _interopRequireDefault(_Image3);

var _uri = require('../uri.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Options
 * @property {import("./Source.js").AttributionLike} [attributions] Attributions.
 * @property {null|string} [crossOrigin] The `crossOrigin` attribute for loaded images.  Note that
 * you must provide a `crossOrigin` value if you are using the WebGL renderer or if you want to
 * access pixel data with the Canvas renderer.  See
 * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image} for more detail.
 * @property {boolean} [hidpi=true] Use the `ol/Map#pixelRatio` value when requesting the image from
 * the remote server.
 * @property {import("../Image.js").LoadFunction} [imageLoadFunction] Optional function to load an image given
 * a URL.
 * @property {Object<string,*>} [params] ArcGIS Rest parameters. This field is optional. Service
 * defaults will be used for any fields not specified. `FORMAT` is `PNG32` by default. `F` is
 * `IMAGE` by default. `TRANSPARENT` is `true` by default.  `BBOX`, `SIZE`, `BBOXSR`, and `IMAGESR`
 * will be set dynamically. Set `LAYERS` to override the default service layer visibility. See
 * {@link http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Export_Map/02r3000000v7000000/}
 * for further reference.
 * @property {import("../proj.js").ProjectionLike} projection Projection.
 * @property {number} [ratio=1.5] Ratio. `1` means image requests are the size of the map viewport,
 * `2` means twice the size of the map viewport, and so on.
 * @property {Array<number>} [resolutions] Resolutions. If specified, requests will be made for
 * these resolutions only.
 * @property {string} [url] ArcGIS Rest service URL for a Map Service or Image Service. The url
 * should include /MapServer or /ImageServer.
 */

/**
 * @classdesc
 * Source for data from ArcGIS Rest services providing single, untiled images.
 * Useful when underlying map service has labels.
 *
 * If underlying map service is not using labels,
 * take advantage of ol image caching and use
 * {@link module:ol/source/TileArcGISRest} data source.
 *
 * @fires ol/source/Image~ImageSourceEvent
 * @api
 */
/**
 * @module ol/source/ImageArcGISRest
 */

var ImageArcGISRest = /*@__PURE__*/function (ImageSource) {
  function ImageArcGISRest(opt_options) {

    var options = opt_options || /** @type {Options} */{};

    ImageSource.call(this, {
      attributions: options.attributions,
      projection: options.projection,
      resolutions: options.resolutions
    });

    /**
     * @private
     * @type {?string}
     */
    this.crossOrigin_ = options.crossOrigin !== undefined ? options.crossOrigin : null;

    /**
     * @private
     * @type {boolean}
     */
    this.hidpi_ = options.hidpi !== undefined ? options.hidpi : true;

    /**
     * @private
     * @type {string|undefined}
     */
    this.url_ = options.url;

    /**
     * @private
     * @type {import("../Image.js").LoadFunction}
     */
    this.imageLoadFunction_ = options.imageLoadFunction !== undefined ? options.imageLoadFunction : _Image3.defaultImageLoadFunction;

    /**
     * @private
     * @type {!Object}
     */
    this.params_ = options.params || {};

    /**
     * @private
     * @type {import("../Image.js").default}
     */
    this.image_ = null;

    /**
     * @private
     * @type {import("../size.js").Size}
     */
    this.imageSize_ = [0, 0];

    /**
     * @private
     * @type {number}
     */
    this.renderedRevision_ = 0;

    /**
     * @private
     * @type {number}
     */
    this.ratio_ = options.ratio !== undefined ? options.ratio : 1.5;
  }

  if (ImageSource) ImageArcGISRest.__proto__ = ImageSource;
  ImageArcGISRest.prototype = Object.create(ImageSource && ImageSource.prototype);
  ImageArcGISRest.prototype.constructor = ImageArcGISRest;

  /**
   * Get the user-provided params, i.e. those passed to the constructor through
   * the "params" option, and possibly updated using the updateParams method.
   * @return {Object} Params.
   * @api
   */
  ImageArcGISRest.prototype.getParams = function getParams() {
    return this.params_;
  };

  /**
   * @inheritDoc
   */
  ImageArcGISRest.prototype.getImageInternal = function getImageInternal(extent, resolution, pixelRatio, projection) {

    if (this.url_ === undefined) {
      return null;
    }

    resolution = this.findNearestResolution(resolution);
    pixelRatio = this.hidpi_ ? pixelRatio : 1;

    var image = this.image_;
    if (image && this.renderedRevision_ == this.getRevision() && image.getResolution() == resolution && image.getPixelRatio() == pixelRatio && (0, _extent.containsExtent)(image.getExtent(), extent)) {
      return image;
    }

    var params = {
      'F': 'image',
      'FORMAT': 'PNG32',
      'TRANSPARENT': true
    };
    (0, _obj.assign)(params, this.params_);

    extent = extent.slice();
    var centerX = (extent[0] + extent[2]) / 2;
    var centerY = (extent[1] + extent[3]) / 2;
    if (this.ratio_ != 1) {
      var halfWidth = this.ratio_ * (0, _extent.getWidth)(extent) / 2;
      var halfHeight = this.ratio_ * (0, _extent.getHeight)(extent) / 2;
      extent[0] = centerX - halfWidth;
      extent[1] = centerY - halfHeight;
      extent[2] = centerX + halfWidth;
      extent[3] = centerY + halfHeight;
    }

    var imageResolution = resolution / pixelRatio;

    // Compute an integer width and height.
    var width = Math.ceil((0, _extent.getWidth)(extent) / imageResolution);
    var height = Math.ceil((0, _extent.getHeight)(extent) / imageResolution);

    // Modify the extent to match the integer width and height.
    extent[0] = centerX - imageResolution * width / 2;
    extent[2] = centerX + imageResolution * width / 2;
    extent[1] = centerY - imageResolution * height / 2;
    extent[3] = centerY + imageResolution * height / 2;

    this.imageSize_[0] = width;
    this.imageSize_[1] = height;

    var url = this.getRequestUrl_(extent, this.imageSize_, pixelRatio, projection, params);

    this.image_ = new _Image2.default(extent, resolution, pixelRatio, url, this.crossOrigin_, this.imageLoadFunction_);

    this.renderedRevision_ = this.getRevision();

    (0, _events.listen)(this.image_, _EventType2.default.CHANGE, this.handleImageChange, this);

    return this.image_;
  };

  /**
   * Return the image load function of the source.
   * @return {import("../Image.js").LoadFunction} The image load function.
   * @api
   */
  ImageArcGISRest.prototype.getImageLoadFunction = function getImageLoadFunction() {
    return this.imageLoadFunction_;
  };

  /**
   * @param {import("../extent.js").Extent} extent Extent.
   * @param {import("../size.js").Size} size Size.
   * @param {number} pixelRatio Pixel ratio.
   * @param {import("../proj/Projection.js").default} projection Projection.
   * @param {Object} params Params.
   * @return {string} Request URL.
   * @private
   */
  ImageArcGISRest.prototype.getRequestUrl_ = function getRequestUrl_(extent, size, pixelRatio, projection, params) {
    // ArcGIS Server only wants the numeric portion of the projection ID.
    var srid = projection.getCode().split(':').pop();

    params['SIZE'] = size[0] + ',' + size[1];
    params['BBOX'] = extent.join(',');
    params['BBOXSR'] = srid;
    params['IMAGESR'] = srid;
    params['DPI'] = Math.round(90 * pixelRatio);

    var url = this.url_;

    var modifiedUrl = url.replace(/MapServer\/?$/, 'MapServer/export').replace(/ImageServer\/?$/, 'ImageServer/exportImage');
    if (modifiedUrl == url) {
      (0, _asserts.assert)(false, 50); // `options.featureTypes` should be an Array
    }
    return (0, _uri.appendParams)(modifiedUrl, params);
  };

  /**
   * Return the URL used for this ArcGIS source.
   * @return {string|undefined} URL.
   * @api
   */
  ImageArcGISRest.prototype.getUrl = function getUrl() {
    return this.url_;
  };

  /**
   * Set the image load function of the source.
   * @param {import("../Image.js").LoadFunction} imageLoadFunction Image load function.
   * @api
   */
  ImageArcGISRest.prototype.setImageLoadFunction = function setImageLoadFunction(imageLoadFunction) {
    this.image_ = null;
    this.imageLoadFunction_ = imageLoadFunction;
    this.changed();
  };

  /**
   * Set the URL to use for requests.
   * @param {string|undefined} url URL.
   * @api
   */
  ImageArcGISRest.prototype.setUrl = function setUrl(url) {
    if (url != this.url_) {
      this.url_ = url;
      this.image_ = null;
      this.changed();
    }
  };

  /**
   * Update the user-provided params.
   * @param {Object} params Params.
   * @api
   */
  ImageArcGISRest.prototype.updateParams = function updateParams(params) {
    (0, _obj.assign)(this.params_, params);
    this.image_ = null;
    this.changed();
  };

  return ImageArcGISRest;
}(_Image4.default);

exports.default = ImageArcGISRest;

//# sourceMappingURL=ImageArcGISRest.js.map