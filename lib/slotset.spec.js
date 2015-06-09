'use strict';

var SlotSet = require('./slotset')
    , should = require('chai').should();


describe('SlotSet', function() {
    var slotSet, evictCalled;

    describe('scalar keys', function() {
        beforeEach(function() {
            slotSet = new SlotSet(2, evictEarliest);
            evictCalled = false;
        });


        it('should put 2 items without evicting any', function() {
            slotSet.put(1, 'test1');
            slotSet.put(2, 'test2');
            evictCalled .should.equal(false);

            slotSet.put(3, 'test3');
            evictCalled .should.equal(true);
        });


        it('should get previously put items', function() {
            slotSet.put(1, 'test1');
            slotSet.put(2, 'test2');

            slotSet.get(1) .should.equal('test1');
            slotSet.get(2) .should.equal('test2');
        });


        it('should evict the item that was put the earliest', function() {
            slotSet.put(1, 'test1');
            slotSet.put(2, 'test2');
            slotSet.put(3, 'test3');

            should.not.exist(slotSet.get(1));
            slotSet.get(2) .should.equal('test2');
            slotSet.get(3) .should.equal('test3');
        });


        it('should replace the value if the same key is used', function() {
            slotSet.put(1, 'test1');
            slotSet.put(2, 'test2');
            slotSet.put(2, 'test2.1');
            evictCalled .should.equal(false);

            slotSet.get(1) .should.equal('test1');
            slotSet.get(2) .should.equal('test2.1');

            slotSet.put(3, 'test3');
            evictCalled .should.equal(true);

            should.not.exist(slotSet.get(1));
            slotSet.get(2) .should.equal('test2.1');
            slotSet.get(3) .should.equal('test3');
        });
    });


    describe('object keys', function() {
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
