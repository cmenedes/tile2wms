'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readBoolean = readBoolean;
exports.readBooleanString = readBooleanString;
exports.readDateTime = readDateTime;
exports.readDecimal = readDecimal;
exports.readDecimalString = readDecimalString;
exports.readNonNegativeInteger = readNonNegativeInteger;
exports.readNonNegativeIntegerString = readNonNegativeIntegerString;
exports.readString = readString;
exports.writeBooleanTextNode = writeBooleanTextNode;
exports.writeCDATASection = writeCDATASection;
exports.writeDateTimeTextNode = writeDateTimeTextNode;
exports.writeDecimalTextNode = writeDecimalTextNode;
exports.writeNonNegativeIntegerTextNode = writeNonNegativeIntegerTextNode;
exports.writeStringTextNode = writeStringTextNode;

var _xml = require('../xml.js');

var _string = require('../string.js');

/**
 * @param {Node} node Node.
 * @return {boolean|undefined} Boolean.
 */
/**
 * @module ol/format/xsd
 */
function readBoolean(node) {
  var s = (0, _xml.getAllTextContent)(node, false);
  return readBooleanString(s);
}

/**
 * @param {string} string String.
 * @return {boolean|undefined} Boolean.
 */
function readBooleanString(string) {
  var m = /^\s*(true|1)|(false|0)\s*$/.exec(string);
  if (m) {
    return m[1] !== undefined || false;
  } else {
    return undefined;
  }
}

/**
 * @param {Node} node Node.
 * @return {number|undefined} DateTime in seconds.
 */
function readDateTime(node) {
  var s = (0, _xml.getAllTextContent)(node, false);
  var dateTime = Date.parse(s);
  return isNaN(dateTime) ? undefined : dateTime / 1000;
}

/**
 * @param {Node} node Node.
 * @return {number|undefined} Decimal.
 */
function readDecimal(node) {
  var s = (0, _xml.getAllTextContent)(node, false);
  return readDecimalString(s);
}

/**
 * @param {string} string String.
 * @return {number|undefined} Decimal.
 */
function readDecimalString(string) {
  // FIXME check spec
  var m = /^\s*([+\-]?\d*\.?\d+(?:e[+\-]?\d+)?)\s*$/i.exec(string);
  if (m) {
    return parseFloat(m[1]);
  } else {
    return undefined;
  }
}

/**
 * @param {Node} node Node.
 * @return {number|undefined} Non negative integer.
 */
function readNonNegativeInteger(node) {
  var s = (0, _xml.getAllTextContent)(node, false);
  return readNonNegativeIntegerString(s);
}

/**
 * @param {string} string String.
 * @return {number|undefined} Non negative integer.
 */
function readNonNegativeIntegerString(string) {
  var m = /^\s*(\d+)\s*$/.exec(string);
  if (m) {
    return parseInt(m[1], 10);
  } else {
    return undefined;
  }
}

/**
 * @param {Node} node Node.
 * @return {string|undefined} String.
 */
function readString(node) {
  return (0, _xml.getAllTextContent)(node, false).trim();
}

/**
 * @param {Node} node Node to append a TextNode with the boolean to.
 * @param {boolean} bool Boolean.
 */
function writeBooleanTextNode(node, bool) {
  writeStringTextNode(node, bool ? '1' : '0');
}

/**
 * @param {Node} node Node to append a CDATA Section with the string to.
 * @param {string} string String.
 */
function writeCDATASection(node, string) {
  node.appendChild(_xml.DOCUMENT.createCDATASection(string));
}

/**
 * @param {Node} node Node to append a TextNode with the dateTime to.
 * @param {number} dateTime DateTime in seconds.
 */
function writeDateTimeTextNode(node, dateTime) {
  var date = new Date(dateTime * 1000);
  var string = date.getUTCFullYear() + '-' + (0, _string.padNumber)(date.getUTCMonth() + 1, 2) + '-' + (0, _string.padNumber)(date.getUTCDate(), 2) + 'T' + (0, _string.padNumber)(date.getUTCHours(), 2) + ':' + (0, _string.padNumber)(date.getUTCMinutes(), 2) + ':' + (0, _string.padNumber)(date.getUTCSeconds(), 2) + 'Z';
  node.appendChild(_xml.DOCUMENT.createTextNode(string));
}

/**
 * @param {Node} node Node to append a TextNode with the decimal to.
 * @param {number} decimal Decimal.
 */
function writeDecimalTextNode(node, decimal) {
  var string = decimal.toPrecision();
  node.appendChild(_xml.DOCUMENT.createTextNode(string));
}

/**
 * @param {Node} node Node to append a TextNode with the decimal to.
 * @param {number} nonNegativeInteger Non negative integer.
 */
function writeNonNegativeIntegerTextNode(node, nonNegativeInteger) {
  var string = nonNegativeInteger.toString();
  node.appendChild(_xml.DOCUMENT.createTextNode(string));
}

/**
 * @param {Node} node Node to append a TextNode with the string to.
 * @param {string} string String.
 */
function writeStringTextNode(node, string) {
  node.appendChild(_xml.DOCUMENT.createTextNode(string));
}

//# sourceMappingURL=xsd.js.map