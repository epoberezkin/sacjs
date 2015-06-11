'use strict';


var evictions = require('./evictions')
    , SlotSet = require('./slotset')
    , should = require('chai').should();


describe('Evictions', function() {
    var slotSet;

    describe('lru', function() {
        beforeEach(function(){
            slotSet = new SlotSet(4, evictions.lru);
        });

        it('should evict lru item - the earliest stored', function() {
            slotSet.put(1, 'test1');
            slotSet.put(2, 'test2');
            slotSet.put(3, 'test3');
            slotSet.put(4, 'test4');

            slotSet.put(5, 'test5');
            should.not.exist(slotSet.get(1));

            slotSet.put(6, 'test6');
            should.not.exist(slotSet.get(2));

            slotSet.get(3) .should.equal('test3');
            slotSet.get(4) .should.equal('test4');
            slotSet.get(5) .should.equal('test5');
            slotSet.get(6) .should.equal('test6');
        });

        it('should evict lru item - the earliest accessed', function() {
            slotSet.put(1, 'test1');
            slotSet.put(2, 'test2');
            slotSet.put(3, 'test3');
            slotSet.put(4, 'test4');

            slotSet.get(3); // will be evicted first
            slotSet.get(4); // will be evicted second
            slotSet.get(1);
            slotSet.get(2);

            slotSet.put(5, 'test5');
            should.not.exist(slotSet.get(3));

            slotSet.put(6, 'test6');
            should.not.exist(slotSet.get(4));

            slotSet.get(1) .should.equal('test1');
            slotSet.get(2) .should.equal('test2');
            slotSet.get(5) .should.equal('test5');
            slotSet.get(6) .should.equal('test6');
        });
    });


    describe('mru', function() {
        beforeEach(function(){
            slotSet = new SlotSet(4, evictions.mru);
        });

        it('should evict mru item - the latest stored', function() {
            slotSet.put(1, 'test1');
            slotSet.put(2, 'test2');
            slotSet.put(3, 'test3');
            slotSet.put(4, 'test4');

            slotSet.put(5, 'test5');
            should.not.exist(slotSet.get(4));

            slotSet.put(6, 'test6');
            should.not.exist(slotSet.get(5));

            slotSet.get(1) .should.equal('test1');
            slotSet.get(2) .should.equal('test2');
            slotSet.get(3) .should.equal('test3');
            slotSet.get(6) .should.equal('test6');
        });

        it('should evict mru item - the latest accessed', function() {
            slotSet.put(1, 'test1');
            slotSet.put(2, 'test2');
            slotSet.put(3, 'test3');
            slotSet.put(4, 'test4');

            slotSet.get(3); 
            slotSet.get(4);
            slotSet.get(2); // will be evicted

            slotSet.put(5, 'test5');
            should.not.exist(slotSet.get(2));

            slotSet.get(1); // will be evicted

            slotSet.put(6, 'test6');
            should.not.exist(slotSet.get(1));

            slotSet.get(3) .should.equal('test3');
            slotSet.get(4) .should.equal('test4');
            slotSet.get(5) .should.equal('test5');
            slotSet.get(6) .should.equal('test6');
        });
    });
});
