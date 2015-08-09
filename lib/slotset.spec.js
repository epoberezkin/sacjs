'use strict';

var SlotSet = require('./slotset')
    , should = require('chai').should();


describe('SlotSet', function() {
    var slotSet, evictCalled;

    var earliestalgorithm = {
        created: createdEarliest,
        accessed: accessedEarliest,
        evict: evictEarliest
    }


    describe('scalar keys', function() {
        beforeEach(function() {
            slotSet = new SlotSet(2, earliestalgorithm);
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


        it('should evict the item that was put the earliest', function (done) {
            slotSet.put(1, 'test1');
            setTimeout(function() {
            slotSet.put(2, 'test2');
            setTimeout(function() {
            slotSet.put(3, 'test3');

            should.not.exist(slotSet.get(1));
            slotSet.get(2) .should.equal('test2');
            slotSet.get(3) .should.equal('test3');

            done();
            }); });
        });


        it('should replace the value if the same key is used', function (done) {
            slotSet.put(1, 'test1');
            setTimeout(function() {
            slotSet.put(2, 'test2');
            setTimeout(function() {
            slotSet.put(2, 'test2.1');
            evictCalled .should.equal(false);

            setTimeout(function() {
            slotSet.get(1) .should.equal('test1');
            setTimeout(function() {
            slotSet.get(2) .should.equal('test2.1');

            setTimeout(function() {
            slotSet.put(3, 'test3');
            evictCalled .should.equal(true);

            should.not.exist(slotSet.get(1));
            slotSet.get(2) .should.equal('test2.1');
            slotSet.get(3) .should.equal('test3');
            
            done();
            }); }); }); }); });
        });


        it('should delete item', function() {
            slotSet.put(1, 'test1');
            slotSet.get(1) .should.equal('test1');
            slotSet.del(1);
            should.not.exist(slotSet.get(1));
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
