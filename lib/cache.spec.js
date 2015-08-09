'use strict';

var Cache = require('./cache')
    , should = require('chai').should();


describe('Cache', function() {
    var cache, evictCalled;

    var earliestalgorithm = {
        created: createdEarliest,
        accessed: accessedEarliest,
        evict: evictEarliest
    }


    describe('Cache with default options', function() {
        beforeEach(function () {
            cache = new Cache({ assoc: 4, size: 4, algorithm: earliestalgorithm });    
        });
        
        it('should store and retrieve items', function() {
            cache.put(1, 'test1');
            cache.put(2, 'test2');

            cache.get(1) .should.equal('test1');
            cache.get(2) .should.equal('test2');
        });


        it('should evict items when sets run out of slots', function() {
            for (var i=1; i<=100; i++) {
                cache.put({a:i}, 'test'+i);
                cache.get({a:i}) .should.equal('test'+i);
            }
            evictCalled .should.equal(true);
        });


        it('should delete item', function () {
            cache.put(1, 'test1');
            cache.get(1) .should.equal('test1');
            cache.del(1);
            should.not.exist(cache.get(1));
        });
    });


    function createdEarliest(slot) {
        slot.stat.createdAt = Date.now();
    }


    function accessedEarliest() {}


    function evictEarliest(slots) {
        evictCalled = true;

        var earliestCreatedAt = Infinity
            , earliestKey;

        for (var key in slots) {
            var stat = slots[key].stat;
            if (stat.createdAt < earliestCreatedAt) {
                earliestCreatedAt = stat.createdAt;
                earliestKey = key;
            }
        }

        delete slots[earliestKey];
    }
});
