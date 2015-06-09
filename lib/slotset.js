'use strict';


module.exports = SlotSet;


/**
 * SlotSet class holds cache slots
 * @param {Integer} assoc cache association
 * @param {Function} evict eviction algorythm
 * @param {Function} equal optional key comparison algorythm
 */
function SlotSet(assoc, evict, equal) {
    this.assoc = assoc;
    this.equal = equal || strictEqual;
    this.evict = evict;
    this.slots = new Array(assoc);
    this.used = 0;
}


SlotSet.prototype.put = function SlotSet_put(key, value) {
    var slot = new Slot(key, value)
        , index = _findIndex.call(this, key);
    if (index !== undefined)
        this.slots[index] = slot;
    else if (this.used < this.assoc)
        this.slots[this.used++] = slot;
    else {
        var slotId = this.evict(this);
        this.slots[slotId] = slot;
    }
}


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
        if (this.equal(s.key, key)) {
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


function strictEqual(key1, key2) {
    return key1 === key2;
}


function Slot(key, value) {
    this.key = key;
    this.value = value;
    this.usageOrder = 0;
    this.usageCount = 0;
    this.usedAt = undefined;
    this.createdAt = Date.now();
}
