import { after, apply, before, binary, bindFunction, guardAfter, guardBefore, leftApply, not, once, repeat, rightApply,
    safe, tap, ternary, tryCatch, unary } from '../../src/decorators';

describe('Decorators Test', function _testDecorators() {
    describe('Test after', function _testAfter() {
        //it();
    });

    describe('Test apply', function _testApply() {
        it('should run a function with the given args', function _apply() {
            function t(...args) { return args.reverse(); }

            var applyT = apply(t),
                tAwait = applyT(1, 2, 3, 4, 5),
                tRes = tAwait();

            tRes.should.be.an('array');
            tRes.should.eql([5, 4, 3, 2, 1]);
        });
    });

    describe('Test before', function _testBefore() {

    });

    describe('Test binary', function _testBinary() {
        it('should make all functions binary', function _binaryTest() {
            function nullary() { return Array.prototype.slice.call(arguments, 0); }
            function unary(arg1) { return Array.prototype.slice.call(arguments, 0); }
            function ternary(arg1, arg2, arg3) { return Array.prototype.slice.call(arguments, 0); }

            var binaryNullary = binary(nullary),
                binaryUnary = binary(unary),
                binaryTernary = binary(ternary);

            var bn = binaryNullary(1),
                bu = binaryUnary(1),
                bt = binaryTernary(1);

            bn.should.be.a('function');
            bu.should.be.a('function');
            bt.should.be.a('function');

            var bnRes = bn(2),
                buRes = bu(2),
                btRes = bt(2);

            bnRes.should.be.an('array');
            bnRes.should.eql([1, 2]);

            buRes.should.be.an('array');
            buRes.should.eql([1, 2]);

            btRes.should.be.an('array');
            btRes.should.eql([1, 2]);
        });
    });

    describe('Test unary', function _testUnary() {
        it('should make all functions unary', function _unaryTest() {
            function nullary() { return Array.prototype.slice.call(arguments, 0); }
            function binary(arg1, arg2) { return Array.prototype.slice.call(arguments, 0); }
            function ternary(arg1, arg2, arg3) { return Array.prototype.slice.call(arguments, 0); }

            var unaryNullary = unary(nullary),
                unaryBinary = unary(binary),
                unaryTernary = unary(ternary);

            var unRes = unaryNullary(1),
                ubRes = unaryBinary(1),
                utRes = unaryTernary(1);

            unRes.should.be.an('array');
            unRes.should.eql([1]);

            ubRes.should.be.an('array');
            ubRes.should.eql([1]);

            utRes.should.be.an('array');
            utRes.should.eql([1]);
        });
    });
});