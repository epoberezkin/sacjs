'use strict';


var evictions = module.exports = {
    lru: {
        created: _ruAccessed,
        accessed: _ruAccessed,
        evict: __uEvict('accessedAt', Infinity, true)
    },
    mru: {
        created: _ruAccessed,
        accessed: _ruAccessed,
        evict: __uEvict('accessedAt', -Infinity, false)        
    },
    lfu: {
        created: _fuAccessed,
        accessed: _fuAccessed,
        evict: __uEvict('accessCount', Infinity, true)
    },
    mfu: {
        created: _fuAccessed,
        accessed: _fuAccessed,
        evict: __uEvict('accessCount', -Infinity, false)
    }
};


function _ruAccessed(slot) {
    slot.stat.accessedAt = Date.now();
}


function _fuAccessed(slot) {
    var stat = slot.stat;
    if (!stat.accessCount) stat.accessCount = 0;
    stat.accessCount++
}


function __uEvict(property, initValue, lessThan) {
    return function evict(slots) {
        var __uProperty = initValue
            , __uKey;

        for (var key in slots) {
            var stat = slots[key].stat;
            if (lessThan === stat[property] < __uProperty) {
                __uProperty = stat[property];
                __uKey = key;
            }
        }

        delete slots[__uKey];
    }
}
