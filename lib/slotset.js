'use strict';


module.exports = SlotSet;


/**
 * SlotSet class holds cache slots
 * @param {Integer} assoc cache association level
 * @param {Function} evict eviction algorythm
 */
function SlotSet(assoc, evict) {
    this.assoc = assoc;
    this.evict = evict;
    this.slots = new Array(assoc);
    this.used = 0;
}


SlotSet.STORED = 'stored';
SlotSet.REPLACED = 'replaced';
SlotSet.EVICTED = 'evicted';


/**
 * Store item in the set
 * @param  {String} key   item key
 * @param  {Any} value item value
 */
SlotSet.prototype.put = function SlotSet_put(key, value) {
    var slot = new Slot(key, value)
        , index = _findIndex.call(this, key)
        , result;
    if (index !== undefined) {
        result = SlotSet.REPLACED;
    } else if (this.used < this.assoc) {
        index = this.used++;
        result = SlotSet.STORED;
    } else {
        index = this.evict(this);
        result = SlotSet.EVICTED;
    }
    this.slots[index] = slot;
    _accessed.call(this, index);
    return result;
}


/**
 * Retrieve item from the set
 * @param  {String} key item key
 * @return {Any} item value
 */
SlotSet.prototype.get = function SlotSet_get(key) {
    var index = _findIndex.call(this, key);
    if (index !== undefined) {
        _accessed.call(this, index);
        return this.slots[index].value;
    }
}


function _findIndex(key) {
    var index;
    this.slots.some(function (s, i) {
        if (s.key === key) {
            index = i;
            return true;
        }
    }, this);
    return index;
}


function _accessed(index) {
    this.slots.forEach(function (s, i) {
        if (i != index) s.usageOrder++;
    });
    var slot = this.slots[index];
    slot.usageOrder = 0;
    slot.usageCount++;
    slot.usedAt = Date.now();
}


/**
 * Slot that holds a single item
 * @param {String} key
 * @param {Any} value
 */
function Slot(key, value) {
    this.key = key;
    this.value = value;
    this.usageOrder = 0;
    this.usageCount = 0;
    this.usedAt = undefined;
    this.createdAt = Date.now();
}
