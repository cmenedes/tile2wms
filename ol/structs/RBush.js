'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _util = require('../util.js');

var _rbush = require('rbush');

var _rbush2 = _interopRequireDefault(_rbush);

var _extent = require('../extent.js');

var _obj = require('../obj.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @typedef {Object} Entry
 * @property {number} minX
 * @property {number} minY
 * @property {number} maxX
 * @property {number} maxY
 * @property {Object} [value]
 */

/**
 * @classdesc
 * Wrapper around the RBush by Vladimir Agafonkin.
 * See https://github.com/mourner/rbush.
 *
 * @template T
 */
/**
 * @module ol/structs/RBush
 */
var RBush = function RBush(opt_maxEntries) {

  /**
   * @private
   */
  this.rbush_ = (0, _rbush2.default)(opt_maxEntries, undefined);

  /**
   * A mapping between the objects added to this rbush wrapper
   * and the objects that are actually added to the internal rbush.
   * @private
   * @type {Object<string, Entry>}
   */
  this.items_ = {};
};

/**
 * Insert a value into the RBush.
 * @param {import("../extent.js").Extent} extent Extent.
 * @param {T} value Value.
 */
RBush.prototype.insert = function insert(extent, value) {
  /** @type {Entry} */
  var item = {
    minX: extent[0],
    minY: extent[1],
    maxX: extent[2],
    maxY: extent[3],
    value: value
  };

  this.rbush_.insert(item);
  this.items_[(0, _util.getUid)(value)] = item;
};

/**
 * Bulk-insert values into the RBush.
 * @param {Array<import("../extent.js").Extent>} extents Extents.
 * @param {Array<T>} values Values.
 */
RBush.prototype.load = function load(extents, values) {
  var items = new Array(values.length);
  for (var i = 0, l = values.length; i < l; i++) {
    var extent = extents[i];
    var value = values[i];

    /** @type {Entry} */
    var item = {
      minX: extent[0],
      minY: extent[1],
      maxX: extent[2],
      maxY: extent[3],
      value: value
    };
    items[i] = item;
    this.items_[(0, _util.getUid)(value)] = item;
  }
  this.rbush_.load(items);
};

/**
 * Remove a value from the RBush.
 * @param {T} value Value.
 * @return {boolean} Removed.
 */
RBush.prototype.remove = function remove(value) {
  var uid = (0, _util.getUid)(value);

  // get the object in which the value was wrapped when adding to the
  // internal rbush. then use that object to do the removal.
  var item = this.items_[uid];
  delete this.items_[uid];
  return this.rbush_.remove(item) !== null;
};

/**
 * Update the extent of a value in the RBush.
 * @param {import("../extent.js").Extent} extent Extent.
 * @param {T} value Value.
 */
RBush.prototype.update = function update(extent, value) {
  var item = this.items_[(0, _util.getUid)(value)];
  var bbox = [item.minX, item.minY, item.maxX, item.maxY];
  if (!(0, _extent.equals)(bbox, extent)) {
    this.remove(value);
    this.insert(extent, value);
  }
};

/**
 * Return all values in the RBush.
 * @return {Array<T>} All.
 */
RBush.prototype.getAll = function getAll() {
  var items = this.rbush_.all();
  return items.map(function (item) {
    return item.value;
  });
};

/**
 * Return all values in the given extent.
 * @param {import("../extent.js").Extent} extent Extent.
 * @return {Array<T>} All in extent.
 */
RBush.prototype.getInExtent = function getInExtent(extent) {
  /** @type {Entry} */
  var bbox = {
    minX: extent[0],
    minY: extent[1],
    maxX: extent[2],
    maxY: extent[3]
  };
  var items = this.rbush_.search(bbox);
  return items.map(function (item) {
    return item.value;
  });
};

/**
 * Calls a callback function with each value in the tree.
 * If the callback returns a truthy value, this value is returned without
 * checking the rest of the tree.
 * @param {function(this: S, T): *} callback Callback.
 * @param {S=} opt_this The object to use as `this` in `callback`.
 * @return {*} Callback return value.
 * @template S
 */
RBush.prototype.forEach = function forEach(callback, opt_this) {
  return this.forEach_(this.getAll(), callback, opt_this);
};

/**
 * Calls a callback function with each value in the provided extent.
 * @param {import("../extent.js").Extent} extent Extent.
 * @param {function(this: S, T): *} callback Callback.
 * @param {S=} opt_this The object to use as `this` in `callback`.
 * @return {*} Callback return value.
 * @template S
 */
RBush.prototype.forEachInExtent = function forEachInExtent(extent, callback, opt_this) {
  return this.forEach_(this.getInExtent(extent), callback, opt_this);
};

/**
 * @param {Array<T>} values Values.
 * @param {function(this: S, T): *} callback Callback.
 * @param {S=} opt_this The object to use as `this` in `callback`.
 * @private
 * @return {*} Callback return value.
 * @template S
 */
RBush.prototype.forEach_ = function forEach_(values, callback, opt_this) {
  var result;
  for (var i = 0, l = values.length; i < l; i++) {
    result = callback.call(opt_this, values[i]);
    if (result) {
      return result;
    }
  }
  return result;
};

/**
 * @return {boolean} Is empty.
 */
RBush.prototype.isEmpty = function isEmpty$1() {
  return (0, _obj.isEmpty)(this.items_);
};

/**
 * Remove all values from the RBush.
 */
RBush.prototype.clear = function clear() {
  this.rbush_.clear();
  this.items_ = {};
};

/**
 * @param {import("../extent.js").Extent=} opt_extent Extent.
 * @return {import("../extent.js").Extent} Extent.
 */
RBush.prototype.getExtent = function getExtent(opt_extent) {
  var data = this.rbush_.toJSON();
  return (0, _extent.createOrUpdate)(data.minX, data.minY, data.maxX, data.maxY, opt_extent);
};

/**
 * @param {RBush} rbush R-Tree.
 */
RBush.prototype.concat = function concat(rbush) {
  this.rbush_.load(rbush.rbush_.all());
  for (var i in rbush.items_) {
    this.items_[i] = rbush.items_[i];
  }
};

exports.default = RBush;

//# sourceMappingURL=RBush.js.map