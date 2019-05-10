'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../../util.js');

var _array = require('../../array.js');

var _color = require('../../color.js');

var _extent = require('../../extent.js');

var _obj = require('../../obj.js');

var _transform = require('../../geom/flat/transform.js');

var _defaultshader = require('./circlereplay/defaultshader.js');

var _Locations = require('./circlereplay/defaultshader/Locations.js');

var _Locations2 = _interopRequireDefault(_Locations);

var _Replay = require('./Replay.js');

var _Replay2 = _interopRequireDefault(_Replay);

var _webgl = require('../webgl.js');

var _webgl2 = require('../../webgl.js');

var _Buffer = require('../../webgl/Buffer.js');

var _Buffer2 = _interopRequireDefault(_Buffer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module ol/render/webgl/CircleReplay
 */
var WebGLCircleReplay = /*@__PURE__*/function (WebGLReplay) {
  function WebGLCircleReplay(tolerance, maxExtent) {
    WebGLReplay.call(this, tolerance, maxExtent);

    /**
     * @private
     * @type {import("./circlereplay/defaultshader/Locations.js").default}
     */
    this.defaultLocations_ = null;

    /**
     * @private
     * @type {Array<Array<Array<number>|number>>}
     */
    this.styles_ = [];

    /**
     * @private
     * @type {Array<number>}
     */
    this.styleIndices_ = [];

    /**
     * @private
     * @type {number}
     */
    this.radius_ = 0;

    /**
     * @private
     * @type {{fillColor: (Array<number>|null),
     *         strokeColor: (Array<number>|null),
     *         lineDash: Array<number>,
     *         lineDashOffset: (number|undefined),
     *         lineWidth: (number|undefined),
     *         changed: boolean}|null}
     */
    this.state_ = {
      fillColor: null,
      strokeColor: null,
      lineDash: null,
      lineDashOffset: undefined,
      lineWidth: undefined,
      changed: false
    };
  }

  if (WebGLReplay) WebGLCircleReplay.__proto__ = WebGLReplay;
  WebGLCircleReplay.prototype = Object.create(WebGLReplay && WebGLReplay.prototype);
  WebGLCircleReplay.prototype.constructor = WebGLCircleReplay;

  /**
   * @private
   * @param {Array<number>} flatCoordinates Flat coordinates.
   * @param {number} offset Offset.
   * @param {number} end End.
   * @param {number} stride Stride.
   */
  WebGLCircleReplay.prototype.drawCoordinates_ = function drawCoordinates_(flatCoordinates, offset, end, stride) {
    var numVertices = this.vertices.length;
    var numIndices = this.indices.length;
    var n = numVertices / 4;
    var i, ii;
    for (i = offset, ii = end; i < ii; i += stride) {
      this.vertices[numVertices++] = flatCoordinates[i];
      this.vertices[numVertices++] = flatCoordinates[i + 1];
      this.vertices[numVertices++] = 0;
      this.vertices[numVertices++] = this.radius_;

      this.vertices[numVertices++] = flatCoordinates[i];
      this.vertices[numVertices++] = flatCoordinates[i + 1];
      this.vertices[numVertices++] = 1;
      this.vertices[numVertices++] = this.radius_;

      this.vertices[numVertices++] = flatCoordinates[i];
      this.vertices[numVertices++] = flatCoordinates[i + 1];
      this.vertices[numVertices++] = 2;
      this.vertices[numVertices++] = this.radius_;

      this.vertices[numVertices++] = flatCoordinates[i];
      this.vertices[numVertices++] = flatCoordinates[i + 1];
      this.vertices[numVertices++] = 3;
      this.vertices[numVertices++] = this.radius_;

      this.indices[numIndices++] = n;
      this.indices[numIndices++] = n + 1;
      this.indices[numIndices++] = n + 2;

      this.indices[numIndices++] = n + 2;
      this.indices[numIndices++] = n + 3;
      this.indices[numIndices++] = n;

      n += 4;
    }
  };

  /**
   * @inheritDoc
   */
  WebGLCircleReplay.prototype.drawCircle = function drawCircle(circleGeometry, feature) {
    var radius = circleGeometry.getRadius();
    var stride = circleGeometry.getStride();
    if (radius) {
      this.startIndices.push(this.indices.length);
      this.startIndicesFeature.push(feature);
      if (this.state_.changed) {
        this.styleIndices_.push(this.indices.length);
        this.state_.changed = false;
      }

      this.radius_ = radius;
      var flatCoordinates = circleGeometry.getFlatCoordinates();
      flatCoordinates = (0, _transform.translate)(flatCoordinates, 0, 2, stride, -this.origin[0], -this.origin[1]);
      this.drawCoordinates_(flatCoordinates, 0, 2, stride);
    } else {
      if (this.state_.changed) {
        this.styles_.pop();
        if (this.styles_.length) {
          var lastState = this.styles_[this.styles_.length - 1];
          this.state_.fillColor = /** @type {Array<number>} */lastState[0];
          this.state_.strokeColor = /** @type {Array<number>} */lastState[1];
          this.state_.lineWidth = /** @type {number} */lastState[2];
          this.state_.changed = false;
        }
      }
    }
  };

  /**
   * @inheritDoc
   **/
  WebGLCircleReplay.prototype.finish = function finish(context) {
    // create, bind, and populate the vertices buffer
    this.verticesBuffer = new _Buffer2.default(this.vertices);

    // create, bind, and populate the indices buffer
    this.indicesBuffer = new _Buffer2.default(this.indices);

    this.startIndices.push(this.indices.length);

    //Clean up, if there is nothing to draw
    if (this.styleIndices_.length === 0 && this.styles_.length > 0) {
      this.styles_ = [];
    }

    this.vertices = null;
    this.indices = null;
  };

  /**
   * @inheritDoc
   */
  WebGLCircleReplay.prototype.getDeleteResourcesFunction = function getDeleteResourcesFunction(context) {
    // We only delete our stuff here. The shaders and the program may
    // be used by other CircleReplay instances (for other layers). And
    // they will be deleted when disposing of the import("../../webgl/Context.js").WebGLContext
    // object.
    var verticesBuffer = this.verticesBuffer;
    var indicesBuffer = this.indicesBuffer;
    return function () {
      context.deleteBuffer(verticesBuffer);
      context.deleteBuffer(indicesBuffer);
    };
  };

  /**
   * @inheritDoc
   */
  WebGLCircleReplay.prototype.setUpProgram = function setUpProgram(gl, context, size, pixelRatio) {
    // get the program
    var program = context.getProgram(_defaultshader.fragment, _defaultshader.vertex);

    // get the locations
    var locations;
    if (!this.defaultLocations_) {
      locations = new _Locations2.default(gl, program);
      this.defaultLocations_ = locations;
    } else {
      locations = this.defaultLocations_;
    }

    context.useProgram(program);

    // enable the vertex attrib arrays
    gl.enableVertexAttribArray(locations.a_position);
    gl.vertexAttribPointer(locations.a_position, 2, _webgl2.FLOAT, false, 16, 0);

    gl.enableVertexAttribArray(locations.a_instruction);
    gl.vertexAttribPointer(locations.a_instruction, 1, _webgl2.FLOAT, false, 16, 8);

    gl.enableVertexAttribArray(locations.a_radius);
    gl.vertexAttribPointer(locations.a_radius, 1, _webgl2.FLOAT, false, 16, 12);

    // Enable renderer specific uniforms.
    gl.uniform2fv(locations.u_size, size);
    gl.uniform1f(locations.u_pixelRatio, pixelRatio);

    return locations;
  };

  /**
   * @inheritDoc
   */
  WebGLCircleReplay.prototype.shutDownProgram = function shutDownProgram(gl, locations) {
    gl.disableVertexAttribArray(locations.a_position);
    gl.disableVertexAttribArray(locations.a_instruction);
    gl.disableVertexAttribArray(locations.a_radius);
  };

  /**
   * @inheritDoc
   */
  WebGLCircleReplay.prototype.drawReplay = function drawReplay(gl, context, skippedFeaturesHash, hitDetection) {
    if (!(0, _obj.isEmpty)(skippedFeaturesHash)) {
      this.drawReplaySkipping_(gl, context, skippedFeaturesHash);
    } else {
      //Draw by style groups to minimize drawElements() calls.
      var i, start, end, nextStyle;
      end = this.startIndices[this.startIndices.length - 1];
      for (i = this.styleIndices_.length - 1; i >= 0; --i) {
        start = this.styleIndices_[i];
        nextStyle = this.styles_[i];
        this.setFillStyle_(gl, /** @type {Array<number>} */nextStyle[0]);
        this.setStrokeStyle_(gl, /** @type {Array<number>} */nextStyle[1],
        /** @type {number} */nextStyle[2]);
        this.drawElements(gl, context, start, end);
        end = start;
      }
    }
  };

  /**
   * @inheritDoc
   */
  WebGLCircleReplay.prototype.drawHitDetectionReplayOneByOne = function drawHitDetectionReplayOneByOne(gl, context, skippedFeaturesHash, featureCallback, opt_hitExtent) {
    var i, start, end, nextStyle, groupStart, feature, featureIndex;
    featureIndex = this.startIndices.length - 2;
    end = this.startIndices[featureIndex + 1];
    for (i = this.styleIndices_.length - 1; i >= 0; --i) {
      nextStyle = this.styles_[i];
      this.setFillStyle_(gl, /** @type {Array<number>} */nextStyle[0]);
      this.setStrokeStyle_(gl, /** @type {Array<number>} */nextStyle[1],
      /** @type {number} */nextStyle[2]);
      groupStart = this.styleIndices_[i];

      while (featureIndex >= 0 && this.startIndices[featureIndex] >= groupStart) {
        start = this.startIndices[featureIndex];
        feature = this.startIndicesFeature[featureIndex];

        if (skippedFeaturesHash[(0, _util.getUid)(feature)] === undefined && feature.getGeometry() && (opt_hitExtent === undefined || (0, _extent.intersects)(
        /** @type {Array<number>} */opt_hitExtent, feature.getGeometry().getExtent()))) {
          gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
          this.drawElements(gl, context, start, end);

          var result = featureCallback(feature);

          if (result) {
            return result;
          }
        }
        featureIndex--;
        end = start;
      }
    }
    return undefined;
  };

  /**
   * @private
   * @param {WebGLRenderingContext} gl gl.
   * @param {import("../../webgl/Context.js").default} context Context.
   * @param {Object} skippedFeaturesHash Ids of features to skip.
   */
  WebGLCircleReplay.prototype.drawReplaySkipping_ = function drawReplaySkipping_(gl, context, skippedFeaturesHash) {
    var i, start, end, nextStyle, groupStart, feature, featureIndex, featureStart;
    featureIndex = this.startIndices.length - 2;
    end = start = this.startIndices[featureIndex + 1];
    for (i = this.styleIndices_.length - 1; i >= 0; --i) {
      nextStyle = this.styles_[i];
      this.setFillStyle_(gl, /** @type {Array<number>} */nextStyle[0]);
      this.setStrokeStyle_(gl, /** @type {Array<number>} */nextStyle[1],
      /** @type {number} */nextStyle[2]);
      groupStart = this.styleIndices_[i];

      while (featureIndex >= 0 && this.startIndices[featureIndex] >= groupStart) {
        featureStart = this.startIndices[featureIndex];
        feature = this.startIndicesFeature[featureIndex];

        if (skippedFeaturesHash[(0, _util.getUid)(feature)]) {
          if (start !== end) {
            this.drawElements(gl, context, start, end);
          }
          end = featureStart;
        }
        featureIndex--;
        start = featureStart;
      }
      if (start !== end) {
        this.drawElements(gl, context, start, end);
      }
      start = end = groupStart;
    }
  };

  /**
   * @private
   * @param {WebGLRenderingContext} gl gl.
   * @param {Array<number>} color Color.
   */
  WebGLCircleReplay.prototype.setFillStyle_ = function setFillStyle_(gl, color) {
    gl.uniform4fv(this.defaultLocations_.u_fillColor, color);
  };

  /**
   * @private
   * @param {WebGLRenderingContext} gl gl.
   * @param {Array<number>} color Color.
   * @param {number} lineWidth Line width.
   */
  WebGLCircleReplay.prototype.setStrokeStyle_ = function setStrokeStyle_(gl, color, lineWidth) {
    gl.uniform4fv(this.defaultLocations_.u_strokeColor, color);
    gl.uniform1f(this.defaultLocations_.u_lineWidth, lineWidth);
  };

  /**
   * @inheritDoc
   */
  WebGLCircleReplay.prototype.setFillStrokeStyle = function setFillStrokeStyle(fillStyle, strokeStyle) {
    var strokeStyleColor, strokeStyleWidth;
    if (strokeStyle) {
      var strokeStyleLineDash = strokeStyle.getLineDash();
      this.state_.lineDash = strokeStyleLineDash ? strokeStyleLineDash : _webgl.DEFAULT_LINEDASH;
      var strokeStyleLineDashOffset = strokeStyle.getLineDashOffset();
      this.state_.lineDashOffset = strokeStyleLineDashOffset ? strokeStyleLineDashOffset : _webgl.DEFAULT_LINEDASHOFFSET;
      strokeStyleColor = strokeStyle.getColor();
      if (!(strokeStyleColor instanceof CanvasGradient) && !(strokeStyleColor instanceof CanvasPattern)) {
        strokeStyleColor = (0, _color.asArray)(strokeStyleColor).map(function (c, i) {
          return i != 3 ? c / 255 : c;
        }) || _webgl.DEFAULT_STROKESTYLE;
      } else {
        strokeStyleColor = _webgl.DEFAULT_STROKESTYLE;
      }
      strokeStyleWidth = strokeStyle.getWidth();
      strokeStyleWidth = strokeStyleWidth !== undefined ? strokeStyleWidth : _webgl.DEFAULT_LINEWIDTH;
    } else {
      strokeStyleColor = [0, 0, 0, 0];
      strokeStyleWidth = 0;
    }
    var fillStyleColor = fillStyle ? fillStyle.getColor() : [0, 0, 0, 0];
    if (!(fillStyleColor instanceof CanvasGradient) && !(fillStyleColor instanceof CanvasPattern)) {
      fillStyleColor = (0, _color.asArray)(fillStyleColor).map(function (c, i) {
        return i != 3 ? c / 255 : c;
      }) || _webgl.DEFAULT_FILLSTYLE;
    } else {
      fillStyleColor = _webgl.DEFAULT_FILLSTYLE;
    }
    if (!this.state_.strokeColor || !(0, _array.equals)(this.state_.strokeColor, strokeStyleColor) || !this.state_.fillColor || !(0, _array.equals)(this.state_.fillColor, fillStyleColor) || this.state_.lineWidth !== strokeStyleWidth) {
      this.state_.changed = true;
      this.state_.fillColor = fillStyleColor;
      this.state_.strokeColor = strokeStyleColor;
      this.state_.lineWidth = strokeStyleWidth;
      this.styles_.push([fillStyleColor, strokeStyleColor, strokeStyleWidth]);
    }
  };

  return WebGLCircleReplay;
}(_Replay2.default);

exports.default = WebGLCircleReplay;

//# sourceMappingURL=CircleReplay.js.map