'use strict';


module.exports = SlotSet;


/**
 * SlotSet class holds cache slots
 * @param {Integer} assoc cache association level
 * @param {Object} algorithm eviction algorithm
 */
function SlotSet(assoc, algorithm) {
    this.assoc = assoc;
    this.algorithm = algorithm;
    this.slots = {};
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
    var slot = new Slot(value)
        , result;
    if (this.slots[key]) {
        result = SlotSet.REPLACED;
    } else if (this.used < this.assoc) {
        this.used++;
        result = SlotSet.STORED;
    } else {
        this.algorithm.evict(this.slots);
        result = SlotSet.EVICTED;
    }
    this.slots[key] = slot;
    this.algorithm.created(slot);
    return result;
}


/**
 * Retrieve item from the set
 * @param  {String} key item key
 * @return {Any} item value
 */
SlotSet.prototype.get = function SlotSet_get(key) {
    var slot = this.slots[key];
    if (slot) {
        this.algorithm.accessed(slot);
        return slot.value;
    }
}


/**
 * Delete item from the set
 * @param  {String} key item key
 */
SlotSet.prototype.del = function SlotSet_del(key) {
    var slot = this.slots[key];
    if (slot) {
        delete this.slots[key];
        this.used--;
    }
}


/**
 * Slot that holds a single item
 * @param {Any} value
 */
function Slot(value) {
    this.value = value;
    this.stat = {};
}
