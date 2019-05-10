'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

/**
 * Base class for replay groups.
 */
var ReplayGroup = function ReplayGroup() {}; /**
                                              * @module ol/render/ReplayGroup
                                              */


ReplayGroup.prototype.getReplay = function getReplay(zIndex, replayType) {
  return (0, _util.abstract)();
};

/**
 * @abstract
 * @return {boolean} Is empty.
 */
ReplayGroup.prototype.isEmpty = function isEmpty() {
  return (0, _util.abstract)();
};

/**
 * @abstract
 * @param {boolean} group Group with previous replay
 * @return {Array<*>} The resulting instruction group
 */
ReplayGroup.prototype.addDeclutter = function addDeclutter(group) {
  return (0, _util.abstract)();
};

exports.default = ReplayGroup;

//# sourceMappingURL=ReplayGroup.js.map