'use strict';

var SlotSet = require('./slotset')
    , stableStringify = require('json-stable-stringify')
    , algorithms = require('./algorithms');


module.exports = Cache;


/**
 * Associative Cache
 * @param {Object} opts an object defining some cache behaviours with the following properties:
 *     assoc: cache associativity level
 *     size: the number of sets of items the cache can store (total number of items is assoc * size)
 *     serialize: function to convert the key to the string (json-stable-stringify is used if not passed)
 *                or false if serialised keys are used (strings or numbers)
 *     algorithm: eviction algorithm, can be defined as an object that has three functions:
 *             created: called when a slot is created (passed slot)
 *             accessed: called when a slot is accessed (passed slot)
 *             evict: called when a slot should be evicted (passed hash with slots)
 *         or as a name of the algorithm ('lru', 'mru', 'lfu', 'mfu' are defined).
 *         By default 'lru' is used.
 */
function Cache(opts) {
    this.assoc = opts.assoc;
    this.size = opts.size;
    if (opts.serialize !== undefined)
        this.serialize = opts.serialize;
    var algo = opts.algorithm || opts.evict || 'lru';
    this.algorithm = typeof algo == 'string'
                      ? algorithms[algo]
                      : algo;

    this.sets = new Array(this.size);
    this.stat = {
        hits: 0,
        misses: 0
    };
}


/**
 * Serialize cache key into a string, stableStringify by default
 * @param  {Any} key  cache key
 * @return {String}   serialized key
 */
Cache.prototype.serialize = stableStringify;


/**
 * Store value in cache (potentially overwriting stored value)
 * @param  {Any} key   cache key
 * @param  {Any} value value to store in cache
 */
Cache.prototype.put = function Cache_put(key, value) {
    key = this.serialize && this.serialize(key);
    var id = getSetId.call(this, key);
    var slotSet = this.sets[id];
    if (slotSet === undefined)
        slotSet = this.sets[id] = new SlotSet(this.assoc, this.algorithm);
    var result = slotSet.put(key, value);
    if (!this.stat[result]) this.stat[result] = 0;
    this.stat[result]++;
}


/**
 * Get value from cache
 * @param  {Any} key cache key
 * @return {Any}     stored value
 */
Cache.prototype.get = function Cache_get(key) {
    key = this.serialize && this.serialize(key);
    var id = getSetId.call(this, key);
    var slotSet = this.sets[id];
    if (slotSet === undefined)
        this.stat.misses++;
    else {
        var value = slotSet.get(key);
        this.stat[value === undefined ? 'misses' : 'hits']++;
        return value;
    }
}


/**
 * Remove value from cache
 * @param  {Any} key
 */
Cache.prototype.del = function Cache_del(key) {
    key = this.serialize && this.serialize(key);
    var id = getSetId.call(this, key);
    var slotSet = this.sets[id];
    if (slotSet) slotSet.del(key);
}


/**
 * Clear all values from cache
 */
Cache.prototype.clear = function Cache_clear() {
    this.sets = new Array(this.size);
}


function getSetId(key) {
    var hash = dbHash(key);
    return hash % this.size;
}


function dbHash(str) {
    var hash = 5381;
    for (var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
    }
    return hash >= 0 ? hash : -hash;
}
