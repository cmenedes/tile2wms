'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Disposable = require('../Disposable.js');

var _Disposable2 = _interopRequireDefault(_Disposable);

var _Polygon = require('../geom/Polygon.js');

var _Polygon2 = _interopRequireDefault(_Polygon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/render/Box
 */

var RenderBox = /*@__PURE__*/function (Disposable) {
  function RenderBox(className) {
    Disposable.call(this);

    /**
     * @type {import("../geom/Polygon.js").default}
     * @private
     */
    this.geometry_ = null;

    /**
     * @type {HTMLDivElement}
     * @private
     */
    this.element_ = /** @type {HTMLDivElement} */document.createElement('div');
    this.element_.style.position = 'absolute';
    this.element_.className = 'ol-box ' + className;

    /**
     * @private
     * @type {import("../PluggableMap.js").default}
     */
    this.map_ = null;

    /**
     * @private
     * @type {import("../pixel.js").Pixel}
     */
    this.startPixel_ = null;

    /**
     * @private
     * @type {import("../pixel.js").Pixel}
     */
    this.endPixel_ = null;
  }

  if (Disposable) RenderBox.__proto__ = Disposable;
  RenderBox.prototype = Object.create(Disposable && Disposable.prototype);
  RenderBox.prototype.constructor = RenderBox;

  /**
   * @inheritDoc
   */
  RenderBox.prototype.disposeInternal = function disposeInternal() {
    this.setMap(null);
  };

  /**
   * @private
   */
  RenderBox.prototype.render_ = function render_() {
    var startPixel = this.startPixel_;
    var endPixel = this.endPixel_;
    var px = 'px';
    var style = this.element_.style;
    style.left = Math.min(startPixel[0], endPixel[0]) + px;
    style.top = Math.min(startPixel[1], endPixel[1]) + px;
    style.width = Math.abs(endPixel[0] - startPixel[0]) + px;
    style.height = Math.abs(endPixel[1] - startPixel[1]) + px;
  };

  /**
   * @param {import("../PluggableMap.js").default} map Map.
   */
  RenderBox.prototype.setMap = function setMap(map) {
    if (this.map_) {
      this.map_.getOverlayContainer().removeChild(this.element_);
      var style = this.element_.style;
      style.left = style.top = style.width = style.height = 'inherit';
    }
    this.map_ = map;
    if (this.map_) {
      this.map_.getOverlayContainer().appendChild(this.element_);
    }
  };

  /**
   * @param {import("../pixel.js").Pixel} startPixel Start pixel.
   * @param {import("../pixel.js").Pixel} endPixel End pixel.
   */
  RenderBox.prototype.setPixels = function setPixels(startPixel, endPixel) {
    this.startPixel_ = startPixel;
    this.endPixel_ = endPixel;
    this.createOrUpdateGeometry();
    this.render_();
  };

  /**
   * Creates or updates the cached geometry.
   */
  RenderBox.prototype.createOrUpdateGeometry = function createOrUpdateGeometry() {
    var startPixel = this.startPixel_;
    var endPixel = this.endPixel_;
    var pixels = [startPixel, [startPixel[0], endPixel[1]], endPixel, [endPixel[0], startPixel[1]]];
    var coordinates = pixels.map(this.map_.getCoordinateFromPixel, this.map_);
    // close the polygon
    coordinates[4] = coordinates[0].slice();
    if (!this.geometry_) {
      this.geometry_ = new _Polygon2.default([coordinates]);
    } else {
      this.geometry_.setCoordinates([coordinates]);
    }
  };

  /**
   * @return {import("../geom/Polygon.js").default} Geometry.
   */
  RenderBox.prototype.getGeometry = function getGeometry() {
    return this.geometry_;
  };

  return RenderBox;
}(_Disposable2.default);

exports.default = RenderBox;

//# sourceMappingURL=Box.js.map