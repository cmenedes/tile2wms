'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _xml = require('../xml.js');

/**
 * @classdesc
 * Generic format for reading non-feature XML data
 *
 * @abstract
 */
var XML = function XML() {}; /**
                              * @module ol/format/XML
                              */


XML.prototype.read = function read(source) {
  if (!source) {
    return null;
  } else if (typeof source === 'string') {
    var doc = (0, _xml.parse)(source);
    return this.readFromDocument(doc);
  } else if ((0, _xml.isDocument)(source)) {
    return this.readFromDocument( /** @type {Document} */source);
  } else {
    return this.readFromNode( /** @type {Element} */source);
  }
};

/**
 * @abstract
 * @param {Document} doc Document.
 * @return {Object} Object
 */
XML.prototype.readFromDocument = function readFromDocument(doc) {};

/**
 * @abstract
 * @param {Element} node Node.
 * @return {Object} Object
 */
XML.prototype.readFromNode = function readFromNode(node) {};

exports.default = XML;

//# sourceMappingURL=XML.js.map