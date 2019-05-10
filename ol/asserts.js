'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assert = assert;

var _AssertionError = require('./AssertionError.js');

var _AssertionError2 = _interopRequireDefault(_AssertionError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @param {*} assertion Assertion we expected to be truthy.
 * @param {number} errorCode Error code.
 */
function assert(assertion, errorCode) {
  if (!assertion) {
    throw new _AssertionError2.default(errorCode);
  }
}

//# sourceMappingURL=asserts.js.map
/**
 * @module ol/asserts
 */