'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOrder = defaultOrder;
exports.getSquaredTolerance = getSquaredTolerance;
exports.getTolerance = getTolerance;
exports.renderFeature = renderFeature;

var _util = require('../util.js');

var _ImageState = require('../ImageState.js');

var _ImageState2 = _interopRequireDefault(_ImageState);

var _GeometryType = require('../geom/GeometryType.js');

var _GeometryType2 = _interopRequireDefault(_GeometryType);

var _ReplayType = require('../render/ReplayType.js');

var _ReplayType2 = _interopRequireDefault(_ReplayType);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Tolerance for geometry simplification in device pixels.
 * @type {number}
 */
/**
 * @module ol/renderer/vector
 */
var SIMPLIFY_TOLERANCE = 0.5;

/**
 * @const
 * @type {Object<import("../geom/GeometryType.js").default,
 *                function(import("../render/ReplayGroup.js").default, import("../geom/Geometry.js").default,
 *                         import("../style/Style.js").default, Object)>}
 */
var GEOMETRY_RENDERERS = {
  'Point': renderPointGeometry,
  'LineString': renderLineStringGeometry,
  'Polygon': renderPolygonGeometry,
  'MultiPoint': renderMultiPointGeometry,
  'MultiLineString': renderMultiLineStringGeometry,
  'MultiPolygon': renderMultiPolygonGeometry,
  'GeometryCollection': renderGeometryCollectionGeometry,
  'Circle': renderCircleGeometry
};

/**
 * @param {import("../Feature.js").FeatureLike} feature1 Feature 1.
 * @param {import("../Feature.js").FeatureLike} feature2 Feature 2.
 * @return {number} Order.
 */
function defaultOrder(feature1, feature2) {
  return parseInt((0, _util.getUid)(feature1), 10) - parseInt((0, _util.getUid)(feature2), 10);
}

/**
 * @param {number} resolution Resolution.
 * @param {number} pixelRatio Pixel ratio.
 * @return {number} Squared pixel tolerance.
 */
function getSquaredTolerance(resolution, pixelRatio) {
  var tolerance = getTolerance(resolution, pixelRatio);
  return tolerance * tolerance;
}

/**
 * @param {number} resolution Resolution.
 * @param {number} pixelRatio Pixel ratio.
 * @return {number} Pixel tolerance.
 */
function getTolerance(resolution, pixelRatio) {
  return SIMPLIFY_TOLERANCE * resolution / pixelRatio;
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/Circle.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").default} feature Feature.
 */
function renderCircleGeometry(replayGroup, geometry, style, feature) {
  var fillStyle = style.getFill();
  var strokeStyle = style.getStroke();
  if (fillStyle || strokeStyle) {
    var circleReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.CIRCLE);
    circleReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    circleReplay.drawCircle(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.TEXT);
    textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
    textReplay.drawText(geometry, feature);
  }
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../style/Style.js").default} style Style.
 * @param {number} squaredTolerance Squared tolerance.
 * @param {function(this: T, import("../events/Event.js").default)} listener Listener function.
 * @param {T} thisArg Value to use as `this` when executing `listener`.
 * @return {boolean} `true` if style is loading.
 * @template T
 */
function renderFeature(replayGroup, feature, style, squaredTolerance, listener, thisArg) {
  var loading = false;
  var imageStyle = style.getImage();
  if (imageStyle) {
    var imageState = imageStyle.getImageState();
    if (imageState == _ImageState2.default.LOADED || imageState == _ImageState2.default.ERROR) {
      imageStyle.unlistenImageChange(listener, thisArg);
    } else {
      if (imageState == _ImageState2.default.IDLE) {
        imageStyle.load();
      }
      imageState = imageStyle.getImageState();
      imageStyle.listenImageChange(listener, thisArg);
      loading = true;
    }
  }
  renderFeatureInternal(replayGroup, feature, style, squaredTolerance);

  return loading;
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 * @param {import("../style/Style.js").default} style Style.
 * @param {number} squaredTolerance Squared tolerance.
 */
function renderFeatureInternal(replayGroup, feature, style, squaredTolerance) {
  var geometry = style.getGeometryFunction()(feature);
  if (!geometry) {
    return;
  }
  var simplifiedGeometry = geometry.getSimplifiedGeometry(squaredTolerance);
  var renderer = style.getRenderer();
  if (renderer) {
    renderGeometry(replayGroup, simplifiedGeometry, style, feature);
  } else {
    var geometryRenderer = GEOMETRY_RENDERERS[simplifiedGeometry.getType()];
    geometryRenderer(replayGroup, simplifiedGeometry, style, feature);
  }
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/Geometry.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 */
function renderGeometry(replayGroup, geometry, style, feature) {
  if (geometry.getType() == _GeometryType2.default.GEOMETRY_COLLECTION) {
    var geometries = /** @type {import("../geom/GeometryCollection.js").default} */geometry.getGeometries();
    for (var i = 0, ii = geometries.length; i < ii; ++i) {
      renderGeometry(replayGroup, geometries[i], style, feature);
    }
    return;
  }
  var replay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.DEFAULT);
  replay.drawCustom( /** @type {import("../geom/SimpleGeometry.js").default} */geometry, feature, style.getRenderer());
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/GeometryCollection.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").default} feature Feature.
 */
function renderGeometryCollectionGeometry(replayGroup, geometry, style, feature) {
  var geometries = geometry.getGeometriesArray();
  var i, ii;
  for (i = 0, ii = geometries.length; i < ii; ++i) {
    var geometryRenderer = GEOMETRY_RENDERERS[geometries[i].getType()];
    geometryRenderer(replayGroup, geometries[i], style, feature);
  }
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/LineString.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 */
function renderLineStringGeometry(replayGroup, geometry, style, feature) {
  var strokeStyle = style.getStroke();
  if (strokeStyle) {
    var lineStringReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.LINE_STRING);
    lineStringReplay.setFillStrokeStyle(null, strokeStyle);
    lineStringReplay.drawLineString(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.TEXT);
    textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
    textReplay.drawText(geometry, feature);
  }
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/MultiLineString.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 */
function renderMultiLineStringGeometry(replayGroup, geometry, style, feature) {
  var strokeStyle = style.getStroke();
  if (strokeStyle) {
    var lineStringReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.LINE_STRING);
    lineStringReplay.setFillStrokeStyle(null, strokeStyle);
    lineStringReplay.drawMultiLineString(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.TEXT);
    textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
    textReplay.drawText(geometry, feature);
  }
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/MultiPolygon.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").default} feature Feature.
 */
function renderMultiPolygonGeometry(replayGroup, geometry, style, feature) {
  var fillStyle = style.getFill();
  var strokeStyle = style.getStroke();
  if (strokeStyle || fillStyle) {
    var polygonReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.POLYGON);
    polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    polygonReplay.drawMultiPolygon(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.TEXT);
    textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
    textReplay.drawText(geometry, feature);
  }
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/Point.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 */
function renderPointGeometry(replayGroup, geometry, style, feature) {
  var imageStyle = style.getImage();
  if (imageStyle) {
    if (imageStyle.getImageState() != _ImageState2.default.LOADED) {
      return;
    }
    var imageReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.IMAGE);
    imageReplay.setImageStyle(imageStyle, replayGroup.addDeclutter(false));
    imageReplay.drawPoint(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.TEXT);
    textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(!!imageStyle));
    textReplay.drawText(geometry, feature);
  }
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/MultiPoint.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 */
function renderMultiPointGeometry(replayGroup, geometry, style, feature) {
  var imageStyle = style.getImage();
  if (imageStyle) {
    if (imageStyle.getImageState() != _ImageState2.default.LOADED) {
      return;
    }
    var imageReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.IMAGE);
    imageReplay.setImageStyle(imageStyle, replayGroup.addDeclutter(false));
    imageReplay.drawMultiPoint(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.TEXT);
    textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(!!imageStyle));
    textReplay.drawText(geometry, feature);
  }
}

/**
 * @param {import("../render/ReplayGroup.js").default} replayGroup Replay group.
 * @param {import("../geom/Polygon.js").default|import("../render/Feature.js").default} geometry Geometry.
 * @param {import("../style/Style.js").default} style Style.
 * @param {import("../Feature.js").FeatureLike} feature Feature.
 */
function renderPolygonGeometry(replayGroup, geometry, style, feature) {
  var fillStyle = style.getFill();
  var strokeStyle = style.getStroke();
  if (fillStyle || strokeStyle) {
    var polygonReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.POLYGON);
    polygonReplay.setFillStrokeStyle(fillStyle, strokeStyle);
    polygonReplay.drawPolygon(geometry, feature);
  }
  var textStyle = style.getText();
  if (textStyle) {
    var textReplay = replayGroup.getReplay(style.getZIndex(), _ReplayType2.default.TEXT);
    textReplay.setTextStyle(textStyle, replayGroup.addDeclutter(false));
    textReplay.drawText(geometry, feature);
  }
}

//# sourceMappingURL=vector.js.map