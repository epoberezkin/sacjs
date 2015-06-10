'use strict';

var SlotSet = require('./slotset')
    , stableStringify = require('json-stable-stringify')
    , evictions = require('./evictions');


module.exports = Cache;


/**
 * Associative Cache
 * @param {Object} opts an object defining some cache behaviours with the following properties:
 *     assoc: cache associativity level
 *     size: the number of sets of items the cache can store (total number of items is assoc * size)
 *     serialize: function to convert the key to the string (json-stable-stringify is used if not passed)
 *     evict: eviction algorythm, can be defined as a function that accepts the SlotSet instance and returns the id of the item that should be evicted
 *             or as a name of the algorythm ('lru' and 'mru' are defined). By default 'lru' is used.
 */
function Cache(opts) {
    this.assoc = opts.assoc;
    this.size = opts.size;
    this.serialize = opts.serialize || stableStringify;
    this.evict = (typeof opts.evict == 'string'
                    ? evictions[opts.evict]
                    : opts.evict) || evictions.lru;

    this.sets = new Array(this.size);
    this.stat = {
        hits: 0,
        misses: 0
    };
}


Cache.prototype.put = function Cache_put(key, value) {
    key = this.serialize(key);
    var id = getSetId.call(this, key);
    var slotSet = this.sets[id];
    if (slotSet === undefined)
        slotSet = this.sets[id] = new SlotSet(this.assoc, this.evict, this.equal);
    var result = slotSet.put(key, value);
    if (!this.stat[result]) this.stat[result] = 0;
    this.stat[result]++;
    return;
}


Cache.prototype.get = function Cache_get(key) {
    key = this.serialize(key);
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
    return hash > 0 ? hash : -hash;
}
