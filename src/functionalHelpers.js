import { javaScriptTypes, typeNames, shallowClone } from './helpers';
import { curry, identity, constant } from './combinators';

/** @module functionalHelpers */

/**
 * @signature
 * @description Updates the value stored in a single specified index of an array. The function
 * argument should be some form of a unary projector. The 'projector' function will receive
 * the value stored in the existing array at the specified 'idx' argument location. A new array
 * is returned and the original array remains unchanged.
 * @kind function
 * @function adjust
 * @param {function} fn - A function that can operate on a single point of data from the array
 * and a value to be used as an update for the same index in the new array.
 * @param {number} idx - A number representing the zero-based offset of the array; idx determines
 * what value will be passed as the unary argument to the operator function and what index in the
 * newly created array will be altered. If the value is less than zero, the function will use the
 * 'idx' argument value as an offset from the last element in the array.
 * @param {Array} List - The List to update.
 * @return {Array} - Returns a new array identical to the original array except where the new,
 * computed value is inserted
 */
var adjust = curry(function _adjust(fn, idx, list) {
    if (idx >= list.length || idx < -list.length) {
        return list;
    }
    var _idx = 0 > idx ? list.length + idx : idx,
        _list = list.map(identity);
    _list[_idx] = fn(list[_idx]);
    return _list;
});

/**
 * @signature Number -> Number -> Number
 * @signature String -> String -> String
 * @description d
 * @kind function
 * @function add
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var add = curry((x, y) => x + y);

/**
 * @signature and :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @kind function
 * @function and
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var and = curry((a, b) => !!(a && b));

/**
 * @signature
 * @description Updates the value at a specified index of an array by first creating a shallow copy
 * of the array and then updating its value at the specified index.
 * @kind function
 * @function arraySet
 * @note @see {@link adjust}
 * @param {number} idx - The index of the array to which the alternate value will be set.
 * @param {*} x - The value to be used to update the array at the index specified.
 * @param {Array} List - The List on which to perform the update.
 * @returns {Array} - Returns a new array with the value at the specified index being
 * set to the value of the 'x' argument.
 */
var arraySet = curry(function _arraySet(idx, x, list) {
    return adjust(constant(x), idx, list);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function both
 * @param {function} f - a
 * @param {function} g - b
 * @return {function} - c
 */
var both = curry(function _both(f, g) {
    return (...args) => !!(f(...args) && g(...args));
});

/**
 * @signature
 * @description d
 * @param {Array} first - a
 * @return {function} - b
 */
var concat = first => (...rest) => null == rest || !rest.length ? first :
    rest.reduce(function _concatStrings(cur, next) {
        return cur.concat(next);
    }, first);

/**
 * @signature
 * @description d
 * @kind function
 * @function defaultPredicate
 * @return {boolean} - a
 */
var defaultPredicate = constant(true);

/**
 * @signature
 * @description d
 * @kind function
 * @function delegatesFrom
 * @param {object} delegate - a
 * @param {object} delegator - b
 * @return {boolean} - c
 */
var delegatesFrom = curry((delegate, delegator) => delegate.isPrototypeOf(delegator));

/**
 * @signature
 * @description d
 * @kind function
 * @function delegatesTo
 * @param {object} delegator - a
 * @param {object} delegate - b
 * @return {boolean} - c
 */
var delegatesTo = curry((delegator, delegate) => delegate.isPrototypeOf(delegator));

/**
 * @signature
 * @description d
 * @kind function
 * @function divide
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var divide = curry((x, y) => x / y);

/**
 * @signature
 * @description d
 * @kind function
 * @function either
 * @param {function} f - a
 * @param {function} g - b
 * @return {boolean} - c
 */
var either = curry(function _either(f, g) {
    return !!(f() || g());
});

/**
 * @signature
 * @description d
 * @kind function
 * @function equals
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var equals = curry((x, y) => x == y);

/**
 * @signature
 * @description d
 * @kind function
 * @function falsey
 * @see flip
 * @param {*} x - a
 * @return {boolean} - b
 */
var falsey = flip;

/**
 * @signature
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var flip = x => !x;

/**
 * @signature
 * @description d
 * @kind function
 * @function getWith
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {*} - c
 */
var getWith = curry((prop, obj) => obj[prop]);

/**
 * @signature
 * @description d
 * @kind function
 * @function greaterThan
 * @param {number | string} x - a
 * @param {number | string} y - b
 * @return {boolean} - c
 */
var greaterThan = curry((x, y) => x > y);

/**
 * @signature
 * @description d
 * @kind function
 * @function greaterThanOrEqual
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var greaterThanOrEqual = curry((x, y) => x >= y);

/**
 * @signature
 * @description d
 * @kind function
 * @function has
 * @param {string} prop - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var has = curry(function _has(prop, obj) {
    return obj.hasOwnProperty(prop);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function inObject
 * @param {string} key - a
 * @param {object} obj - b
 * @return {boolean} - c
 */
var inObject = curry(function _inObject(prop, obj) {
    return prop in obj;
});

/**
 * @signature
 * @description d
 * @param {function|generator} fn - a
 * @return {*} - b
 */
var invoke = fn => fn();

/**
 * @signature isArray :: a -> Boolean
 * @description d
 * @param {*} data - a
 * @return {boolean} - b
 */
var isArray = data => Array.isArray(data);

/**
 * @signature
 * @description d
 * @param {*} [bool] - a
 * @return {boolean} - b
 */
var isBoolean = bool => javaScriptTypes.Boolean === type(bool);

/**
 * @signature isFunction :: a -> Boolean
 * @description d
 * @param {function} [fn] - a
 * @return {boolean} - b
 */
var isFunction = fn => javaScriptTypes.Function === type(fn);

/**
 * @signature isObject :: a -> Boolean
 * @description d
 * @param {*} [item] - a
 * @return {boolean} - b
 */
var isObject = item => javaScriptTypes.Object === type(item) && null !== item;

/**
 * @signature
 * @description d
 * @param {*} [item] - a
 * @return {boolean} - b
 */
function isPrimitive(item) {
    var itemType = type(item);
    return itemType in typeNames && (isNothing(item) || (javaScriptTypes.Object !== itemType && javaScriptTypes.Function !== itemType));
}

/**
 * @signature
 * @description d
 * @param {*} [x] - a
 * @return {boolean} - b
 */
var isNothing = x => null == x;

/**
 * @signature
 * @description d
 * @param {*} [n] - a
 * @return {string|boolean} - b
 */
var isNull = n => null === n;

/**
 * @signature
 * @description d
 * @param {*} [num] - a
 * @return {boolean} - b
 */
var isNumber = num => javaScriptTypes.Number == type(num);

/**
 * @signature
 * @description d
 * @param {*} [x] - a
 * @return {boolean} - b
 */
var isSomething = x => null != x;

/**
 * @signature
 * @description d
 * @param {string} str - a
 * @return {boolean} - b
 */
var isString = str => javaScriptTypes.String === type(str);

/**
 * @signature
 * @description d
 * @param {*} [sym] - a
 * @return {boolean} - b
 */
var isSymbol = sym => javaScriptTypes.Symbol === type(sym);

/**
 * @signature
 * @description d
 * @param {*} [u] - a
 * @return {boolean} - b
 */
var isUndefined = u => javaScriptTypes.Undefined === type(u);

/**
 * @signature
 * @description d
 * @kind function
 * @function lessThan
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThan = curry((x, y) => x < y);

/**
 * @signature
 * @description d
 * @kind function
 * @function lessThanOrEqual
 * @param {string | number} x - a
 * @param {string | number} y - b
 * @return {boolean} - c
 */
var lessThanOrEqual = curry((x, y) => x <= y);

/**
 * @signature
 * @description d
 * @kind function
 * @function mapSet
 * @param {*} key - a
 * @param {*} val - b
 * @param {Map} xs - c
 * @return {Map} - d
 */
var mapSet = curry(function _mapSet(key, val, xs) {
    var ret = new Map();
    for (let k of xs.keys()) {
        ret.set(k, xs.get(k));
    }
    ret.set(key, val);
    return ret;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function modulus
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var modulus = curry((x, y) => x % y);

/**
 * @signature
 * @description d
 * @kind function
 * @function multiply
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var multiply = curry((x, y) => x * y);

/**
 * @signature
 * @description d
 * @param {number} x - a
 * @return {number} - b
 */
var negate = x => -x;

/**
 * @signature
 * @description d
 * @kind function
 * @function notEqual
 * @param {*} - a
 * @param {*} - b
 * @return {boolean} - c
 */
var notEqual = curry((x, y) => x != y);

/**
 * @signature
 * @description No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns {undefined} - a
 */
function noop() {}

/**
 * @signature
 * @description d
 * @kind function
 * @function nth
 * @param {number} offset - a
 * @param {Array} List - b
 * @return {*} - c
 */
var nth = curry(function nth(offset, list) {
    var idx = 0 > offset ? list.length + offset : offset;
    return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * @signature
 * @description d
 * @kind function
 * @function objectSet
 * @param {string} prop - a
 * @param {*} val - b
 * @param {object} obj - c
 * @return {object} - d
 */
var objectSet = curry(function _objectSet(prop, val, obj) {
    var result = shallowClone(obj);
    result[prop] = val;
    return result;
});

/**
 * @signature
 * @description d
 * @param {function} fn - a
 * @return {function} - b
 */
function once(fn) {
    var invoked = false,
        res;
    return function _once(...args) {
        if (!invoked) {
            invoked = true;
            res = fn(...args);
        }
        return res;
    };
}

/**
 * @signature or :: (*... -> a) -> ((*... -> b) -> ((*... -> Boolean)))
 * @description d
 * @kind function
 * @function or
 * @param {*} a - a
 * @param {*} b - b
 * @return {boolean} - c
 */
var or = curry((a, b) => !!(a || b));

/**
 * @signature
 * @description d
 * @param {Array|String|*} args - a
 * @return {Array|String} - b
 */
function reverse(...args) {
    if (1 === args.length) {
        return isArray(args[0]) ? args[0].slice(0).reverse() : args[0].split('').reverse().join('');
    }
    return args.reverse();
}

/**
 * @signature
 * @description d
 * @kind function
 * @function setSet
 * @param {*} val - a
 * @param {Set} set - b
 * @return {Set} - c
 */
var setSet = curry(function _setSet(oldVal, newVal, set) {
    var ret = new Set();
    for (let item of set) {
        if (item !== oldVal) ret.add(item);
    }
    ret.add(newVal);
    return ret;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function strictEquals
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictEquals = curry((x, y) => x === y);

/**
 * @signature strictNotEquals :: * -> * -> boolean
 * @description d
 * @kind function
 * @function strictNotEqual
 * @param {*} x - a
 * @param {*} y - b
 * @return {boolean} - c
 */
var strictNotEqual = curry((x, y) => x !== y);

/**
 * @signature subtract :: number -> number -> number
 * @description d
 * @kind function
 * @function subtract
 * @param {number} x - a
 * @param {number} y - b
 * @return {number} - c
 */
var subtract = curry((x, y) => x - y);

/**
 * @signature truthy :: * -> boolean
 * @description d
 * @param {*} x - a
 * @return {boolean} - b
 */
var truthy = x => flip(flip(x));

/**
 * @signature type :: * -> string
 * @description d
 * @param {*} a - a
 * @return {string} - b
 */
var type = a => typeof a;

/**
 * @signature wrap :: a -> [a]
 * @description Takes any value of any type and returns an array containing
 * the value passed as its only item
 * @param {*} data - Any value, any type
 * @return {Array} - Returns an array of any value, any type
 */
var wrap = data => [data];

export { add, adjust, and, arraySet, both, concat, defaultPredicate, delegatesFrom, delegatesTo, divide, either, equals,
        falsey, flip, getWith, greaterThan, greaterThanOrEqual, has, inObject, invoke, isArray, isBoolean, isFunction,
        isObject, isPrimitive, isNothing, isNull, isNumber, isSomething, isString, isSymbol, isUndefined, lessThan,
        lessThanOrEqual, mapSet, modulus, multiply, negate, notEqual, noop, nth, objectSet, once, or, reverse, setSet,
        strictEquals, strictNotEqual, subtract, truthy, type, wrap };