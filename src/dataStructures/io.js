import { constant } from '../combinators';
import { type, strictEquals } from '../functionalHelpers';
import { apply, chain, join, equals, stringMaker, valueOf, traverse } from './data_structure_util';
import { javaScriptTypes } from '../helpers';

/**
 * @signature
 * @description d
 * @namespace Io
 * @memberOf dataStructures
 * @param {function} item - a
 * @return {dataStructures.io} - b
 */
function Io(item) {
    return Object.create(io, {
        _value: {
            value: item,
            writable: false,
            configurable: false
        },
        run: {
            value: item,
            writable: false,
            configurable: false
        }
    });
}

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Io
 * @static
 * @function
 * @param {function|*} item - a
 * @return {io} - b
 */
Io.of =  item => strictEquals(javaScriptTypes.Function, type(item)) ? Io(item) : Io(constant(item));

/**
 * @signature
 * @description d
 * @memberOf dataStructures.Io
 * @static
 * @function
 * @param {Object} f - a
 * @return {boolean} - b
 */
Io.is = f => io.isPrototypeOf(f);

/**
 * @description d
 * @namespace io
 * @memberOf dataStructures
 * @typedef {Object}
 */
var io = {
    get value() {
        return this._value;
    },
    map: function _map(fn) {
        return this.chain(a => Io.of(fn(a)));
    },
    fold: function _fold(fn, x) {
        return fn(this.value, x);
    },
    traverse: traverse,
    runIo: function _runIo(...args) {
        return this.run(...args);
    },
    apply: apply,
    equals: equals,
    valueOf: valueOf,
    toString: stringMaker('Io'),
    get [Symbol.toStringTag]() {
        return 'Io';
    },
    factory: Io
};

/**
 * @description: Since the constant functor does not represent a disjunction, the Io's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out functors/monads does not break an application that is
 * relying on its existence.
 * @memberOf dataStructures.io
 * @type: {{function}}
 * @param: {function} f
 * @param: {function} g
 * @return: {@see io}
 */
io.bimap = io.map;

io.chain = chain;
io.mjoin = join;

io.ap =io.apply;
io.fmap = io.chain;
io.flapMap = io.chain;
io.bind = io.chain;
io.reduce = io.fold;

io.constructor = io.factory;

export { Io, io };