'use strict';


var algorithms = require('./algorithms')
    , SlotSet = require('./slotset')
    , should = require('chai').should();


describe('algorithms', function() {
    var slotSet;

    describe('lru', function() {
        beforeEach(function(){
            slotSet = new SlotSet(4, algorithms.lru);
        });

        it('should evict lru item - the earliest stored', function (done) {
            slotSet.put(1, 'test1');
            setTimeout(function() {
            slotSet.put(2, 'test2');
            setTimeout(function() {
            slotSet.put(3, 'test3');
            setTimeout(function() {
            slotSet.put(4, 'test4');

            setTimeout(function() {
            slotSet.put(5, 'test5');
            should.not.exist(slotSet.get(1));

            setTimeout(function() {
            slotSet.put(6, 'test6');
            should.not.exist(slotSet.get(2));

            slotSet.get(3) .should.equal('test3');
            slotSet.get(4) .should.equal('test4');
            slotSet.get(5) .should.equal('test5');
            slotSet.get(6) .should.equal('test6');

            done();
            }); }); }); }); }); 
        });

        it('should evict lru item - the earliest accessed', function (done) {
            slotSet.put(1, 'test1');
            setTimeout(function() {
            slotSet.put(2, 'test2');
            setTimeout(function() {
            slotSet.put(3, 'test3');
            setTimeout(function() {
            slotSet.put(4, 'test4');

            setTimeout(function() {
            slotSet.get(3); // will be evicted first
            setTimeout(function() {
            slotSet.get(4); // will be evicted second
            setTimeout(function() {
            slotSet.get(1);
            setTimeout(function() {
            slotSet.get(2);

            setTimeout(function() {
            slotSet.put(5, 'test5');
            should.not.exist(slotSet.get(3));

            setTimeout(function() {
            slotSet.put(6, 'test6');
            should.not.exist(slotSet.get(4));

            slotSet.get(1) .should.equal('test1');
            slotSet.get(2) .should.equal('test2');
            slotSet.get(5) .should.equal('test5');
            slotSet.get(6) .should.equal('test6');

            done();
            }); }); }); }); }); }); }); }); });
        });
    });


    describe('mru', function() {
        beforeEach(function(){
            slotSet = new SlotSet(4, algorithms.mru);
        });

        it('should evict mru item - the latest stored', function (done) {
            slotSet.put(1, 'test1');
            setTimeout(function() {
            slotSet.put(2, 'test2');
            setTimeout(function() {
            slotSet.put(3, 'test3');
            setTimeout(function() {
            slotSet.put(4, 'test4');

            setTimeout(function() {
            slotSet.put(5, 'test5');
            should.not.exist(slotSet.get(4));

            setTimeout(function() {
            slotSet.put(6, 'test6');
            should.not.exist(slotSet.get(5));

            slotSet.get(1) .should.equal('test1');
            slotSet.get(2) .should.equal('test2');
            slotSet.get(3) .should.equal('test3');
            slotSet.get(6) .should.equal('test6');

            done();
            }); }); }); }); });
        });

        it('should evict mru item - the latest accessed', function (done) {
            slotSet.put(1, 'test1');
            setTimeout(function() {
            slotSet.put(2, 'test2');
            setTimeout(function() {
            slotSet.put(3, 'test3');
            setTimeout(function() {
            slotSet.put(4, 'test4');

            setTimeout(function() {
            slotSet.get(3); 
            setTimeout(function() {
            slotSet.get(4);
            setTimeout(function() {
            slotSet.get(2); // will be evicted

            setTimeout(function() {
            slotSet.put(5, 'test5');
            should.not.exist(slotSet.get(2));

            setTimeout(function() {
            slotSet.get(1); // will be evicted

            setTimeout(function() {
            slotSet.put(6, 'test6');
            should.not.exist(slotSet.get(1));

            slotSet.get(3) .should.equal('test3');
            slotSet.get(4) .should.equal('test4');
            slotSet.get(5) .should.equal('test5');
            slotSet.get(6) .should.equal('test6');

            done();
            }); }); }); }); }); }); }); }); });
        });
    });
});
