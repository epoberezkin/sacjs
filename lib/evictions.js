'use strict';


var evictions = module.exports = {
    lru: lru,
    mru: mru
};


function lru(slotSet) {
    var slotId, usageOrder = -1;
    slotSet.slots.forEach(function(slot, index) {
        if (slot.usageOrder > usageOrder) {
            usageOrder = slot.usageOrder;
            slotId = index;
        }
    });
    return slotId;
}


function mru(slotSet) {
    var slotId;
    slotSet.slots.some(function(slot, index) {
        if (slot.usageOrder === 0) {
            slotId = index;
            return true;
        }
    });
    return slotId;
}
