'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('./util.js');

/**
 * Error object thrown when an assertion failed. This is an ECMA-262 Error,
 * extended with a `code` property.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
 */
var AssertionError = /*@__PURE__*/function (Error) {
  function AssertionError(code) {
    var path = _util.VERSION === 'latest' ? _util.VERSION : 'v' + _util.VERSION.split('-')[0];
    var message = 'Assertion failed. See https://openlayers.org/en/' + path + '/doc/errors/#' + code + ' for details.';

    Error.call(this, message);

    /**
     * Error code. The meaning of the code can be found on
     * https://openlayers.org/en/latest/doc/errors/ (replace `latest` with
     * the version found in the OpenLayers script's header comment if a version
     * other than the latest is used).
     * @type {number}
     * @api
     */
    this.code = code;

    /**
     * @type {string}
     */
    this.name = 'AssertionError';

    // Re-assign message, see https://github.com/Rich-Harris/buble/issues/40
    this.message = message;
  }

  if (Error) AssertionError.__proto__ = Error;
  AssertionError.prototype = Object.create(Error && Error.prototype);
  AssertionError.prototype.constructor = AssertionError;

  return AssertionError;
}(Error); /**
           * @module ol/AssertionError
           */
exports.default = AssertionError;

//# sourceMappingURL=AssertionError.js.map