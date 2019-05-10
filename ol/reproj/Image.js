'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _common = require('./common.js');

var _ImageBase = require('../ImageBase.js');

var _ImageBase2 = _interopRequireDefault(_ImageBase);

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _events = require('../events.js');

var _EventType = require('../events/EventType.js');

var _EventType2 = _interopRequireDefault(_EventType);

var _extent = require('../extent.js');

var _reproj = require('../reproj.js');

var _Triangulation = require('./Triangulation.js');

var _Triangulation2 = _interopRequireDefault(_Triangulation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {function(import("../extent.js").Extent, number, number) : import("../ImageBase.js").default} FunctionType
 */

/**
 * @classdesc
 * Class encapsulating single reprojected image.
 * See {@link module:ol/source/Image~ImageSource}.
 */
/**
 * @module ol/reproj/Image
 */
var ReprojImage = /*@__PURE__*/function (ImageBase) {
  function ReprojImage(sourceProj, targetProj, targetExtent, targetResolution, pixelRatio, getImageFunction) {
    var maxSourceExtent = sourceProj.getExtent();
    var maxTargetExtent = targetProj.getExtent();

    var limitedTargetExtent = maxTargetExtent ? (0, _extent.getIntersection)(targetExtent, maxTargetExtent) : targetExtent;

    var targetCenter = (0, _extent.getCenter)(limitedTargetExtent);
    var sourceResolution = (0, _reproj.calculateSourceResolution)(sourceProj, targetProj, targetCenter, targetResolution);

    var errorThresholdInPixels = _common.ERROR_THRESHOLD;

    var triangulation = new _Triangulation2.default(sourceProj, targetProj, limitedTargetExtent, maxSourceExtent, sourceResolution * errorThresholdInPixels);

    var sourceExtent = triangulation.calculateSourceExtent();
    var sourceImage = getImageFunction(sourceExtent, sourceResolution, pixelRatio);
    var state = _ImageState2.default.LOADED;
    if (sourceImage) {
      state = _ImageState2.default.IDLE;
    }
    var sourcePixelRatio = sourceImage ? sourceImage.getPixelRatio() : 1;

    ImageBase.call(this, targetExtent, targetResolution, sourcePixelRatio, state);

    /**
     * @private
     * @type {import("../proj/Projection.js").default}
     */
    this.targetProj_ = targetProj;

    /**
     * @private
     * @type {import("../extent.js").Extent}
     */
    this.maxSourceExtent_ = maxSourceExtent;

    /**
     * @private
     * @type {!import("./Triangulation.js").default}
     */
    this.triangulation_ = triangulation;

    /**
     * @private
     * @type {number}
     */
    this.targetResolution_ = targetResolution;

    /**
     * @private
     * @type {import("../extent.js").Extent}
     */
    this.targetExtent_ = targetExtent;

    /**
     * @private
     * @type {import("../ImageBase.js").default}
     */
    this.sourceImage_ = sourceImage;

    /**
     * @private
     * @type {number}
     */
    this.sourcePixelRatio_ = sourcePixelRatio;

    /**
     * @private
     * @type {HTMLCanvasElement}
     */
    this.canvas_ = null;

    /**
     * @private
     * @type {?import("../events.js").EventsKey}
     */
    this.sourceListenerKey_ = null;
  }

  if (ImageBase) ReprojImage.__proto__ = ImageBase;
  ReprojImage.prototype = Object.create(ImageBase && ImageBase.prototype);
  ReprojImage.prototype.constructor = ReprojImage;

  /**
   * @inheritDoc
   */
  ReprojImage.prototype.disposeInternal = function disposeInternal() {
    if (this.state == _ImageState2.default.LOADING) {
      this.unlistenSource_();
    }
    ImageBase.prototype.disposeInternal.call(this);
  };

  /**
   * @inheritDoc
   */
  ReprojImage.prototype.getImage = function getImage() {
    return this.canvas_;
  };

  /**
   * @return {import("../proj/Projection.js").default} Projection.
   */
  ReprojImage.prototype.getProjection = function getProjection() {
    return this.targetProj_;
  };

  /**
   * @private
   */
  ReprojImage.prototype.reproject_ = function reproject_() {
    var sourceState = this.sourceImage_.getState();
    if (sourceState == _ImageState2.default.LOADED) {
      var width = (0, _extent.getWidth)(this.targetExtent_) / this.targetResolution_;
      var height = (0, _extent.getHeight)(this.targetExtent_) / this.targetResolution_;

      this.canvas_ = (0, _reproj.render)(width, height, this.sourcePixelRatio_, this.sourceImage_.getResolution(), this.maxSourceExtent_, this.targetResolution_, this.targetExtent_, this.triangulation_, [{
        extent: this.sourceImage_.getExtent(),
        image: this.sourceImage_.getImage()
      }], 0);
    }
    this.state = sourceState;
    this.changed();
  };

  /**
   * @inheritDoc
   */
  ReprojImage.prototype.load = function load() {
    if (this.state == _ImageState2.default.IDLE) {
      this.state = _ImageState2.default.LOADING;
      this.changed();

      var sourceState = this.sourceImage_.getState();
      if (sourceState == _ImageState2.default.LOADED || sourceState == _ImageState2.default.ERROR) {
        this.reproject_();
      } else {
        this.sourceListenerKey_ = (0, _events.listen)(this.sourceImage_, _EventType2.default.CHANGE, function (e) {
          var sourceState = this.sourceImage_.getState();
          if (sourceState == _ImageState2.default.LOADED || sourceState == _ImageState2.default.ERROR) {
            this.unlistenSource_();
            this.reproject_();
          }
        }, this);
        this.sourceImage_.load();
      }
    }
  };

  /**
   * @private
   */
  ReprojImage.prototype.unlistenSource_ = function unlistenSource_() {
    (0, _events.unlistenByKey)( /** @type {!import("../events.js").EventsKey} */this.sourceListenerKey_);
    this.sourceListenerKey_ = null;
  };

  return ReprojImage;
}(_ImageBase2.default);

exports.default = ReprojImage;

//# sourceMappingURL=Image.js.map