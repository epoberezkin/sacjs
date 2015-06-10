'use strict';

var Cache = require('./cache')
    , should = require('chai').should();


describe('Cache', function() {
    var cache, evictCalled;

    describe('Cache with default options', function() {
        beforeEach(function () {
            cache = new Cache({ assoc: 4, size: 4, evict: evictEarliest });    
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


        function evictEarliest(slotSet) {
            evictCalled = true;

            var earliestCreatedAt = Infinity
                , earliestIndex;

            slotSet.slots.forEach(function (s, i) {
                if (s.createdAt < earliestCreatedAt) {
                    earliestCreatedAt = s.createdAt;
                    earliestIndex = i;
                }
            });

            return earliestIndex || 0;
        }
    });
});
