import { arraySet, mapSet, objectSet, setSet, isArray } from './functionalHelpers';
import { not } from './decorators';
import { curry, compose, kestrel, when } from './combinators';
import { deepClone } from './helpers';
import { Maybe } from './dataStructures/maybe';
import { Identity } from './dataStructures/identity';
import { Constant } from './dataStructures/constant';
import { mapWith } from './pointless_data_structures';

/** @module lenses */

/**
 * @signature
 * @description d
 * @kind function
 * @function lens
 * @param {function} getter - a
 * @param {function} setter - b
 * @param {String} key - c
 * @param {function} f - d
 * @param {Array} xs - e
 * @return {*} - f
 */
var lens = curry(function _lens(getter, setter, key, f, xs) {
    return mapWith(replace => setter(key, replace, xs), f(getter(key, xs)));
});

/**
 * @signature
 * @description d
 * @kind function
 * @function prism
 * @param {function} getter - a
 * @param {function} setter - b
 * @param {String} key - c
 * @param {function} f - d
 * @param {Array} xs - e
 * @param {*} - f
 * @return {*} - g
 */
var prism = curry(function _prism(getter, setter, key, f, xs) {
    return mapWith(replace => setter(key, replace, xs), Maybe(f(getter(key, xs))));
});

/**
 * @signature
 * @description d
 * @kind function
 * @function arrayLens
 * @param {number} idx - a
 * @param {function} f - b
 * @param {Array} xs - c
 * @return {Array} - c
 */
var arrayLens = lens((idx, xs) => xs[idx], arraySet);

/**
 * @signature
 * @description d
 * @kind function
 * @function objectLens
 * @param {string} prop - a
 * @param {function} f - b
 * @param {Object} xs - c
 * @return {Object} - c
 */
var objectLens = lens((prop, xs) => xs[prop], objectSet);

/**
 * @signature
 * @description d
 * @kind function
 * @function mapLens
 * @param {*} key - a
 * @param {*} val - b
 * @param {Map} xs - c
 * @return {Map} d
 */
var mapLens = lens((key, xs) => xs.get(key), function _mapSet(key, val, xs) {
    var ret = new Map();
    for (let k of xs.keys()) {
        if (k === key) {
            ret.set(k, val);
        }
        else ret.set(k, xs.get(k));
    }
    return ret;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function unifiedLens
 * @param {string} prop - a
 * @param {function} f - b
 * @param {Array|Object} xs - c
 * @return {*} - d
 */
var unifiedLens = curry(function _unifiedLens(prop, f, xs) {
    return mapWith(function _mapWith(value) {
        if (Array.isArray(xs)) return arraySet(prop, value, xs);
        else if (Map.prototype.isPrototypeOf(xs)) return mapSet(prop, value, xs);
        return objectSet(prop, value, xs);
    }, Map.prototype.isPrototypeOf(xs) ? f(xs.get(prop)) : f(xs[prop]));
});

/**
 * @signature
 * @description d
 * @kind function
 * @function view
 * @param {function} lens - a
 * @param {Object} target - b
 * @return {*} - c
 */
var view = curry(function _view(lens, target) {
    return lens(Constant)(target).value;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function over
 * @param {function} lens - a
 * @param {function} mapFn - b
 * @param {Object} target - c
 * @return {*} - d
 */
var over = curry(function _over(lens, mapFn, target) {
    return lens(function _lens(y) {
        return Identity(mapFn(y));
    })(target).value;
});

/**
 * @signature
 * @description d
 * @kind function
 * @function put
 * @param {function} lens - a
 * @param {*} val - b
 * @param {*} target - c
 * @return {*} - d
 */
var put = curry(function _put(lens, val, target) {
    return over(lens, kestrel(val), target);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function set
 * @param {function} lens - a
 * @param {*} val - b
 * @param {Object} targetData - c
 * @return {*} - c
 */
var set = curry((lens, val, targetData) => over(lens, kestrel(val), targetData));

/**
 * @signature
 * @description d
 * @param {string} paths - a
 * @return {*} - b
 */
function makeLenses(...paths) {
    return paths.reduce(function _pathReduce(cur, next) {
        var ol = objectLens(next);
        return put(ol, ol, cur);
    }, { num: arrayLens });
}

/**
 * @signature
 * @description d
 * @param {string} paths - a
 * @return {function} - b
 */
function improvedLensPath(...paths) {
    var innerLensDef = curry(function _innerLensDef(prop, fn, xs) {
        return mapWith(function _map(rep) {
            return objectSet(prop, rep, xs);
        }, fn(xs[prop]));
    });

    return compose(...paths.map(function _pathsMap(p) {
        return innerLensDef(p);
    }));
}

/**
 * @signature
 * @description d
 * @param {string|Number} path - a
 * @return {*} - b
 */
function lensPath(...path) {
    return compose(...path.map(function _pathMap(p) {
        return unifiedLens(p);
    }));
}

/**
 * @signature
 * @description d
 * @kind function
 * @function prismPath
 * @param {Array|String} path - a
 * @param {Object} obj - b
 * @return {*} - c
 */
var prismPath = curry(function _prismPath(path, obj) {
    path = when(not(isArray), split('.'), path);
    console.log(path, obj);
    var val = obj,
        idx = 0;
    while (idx < path.length) {
        if (null == val) return Maybe.Nothing();
        console.log(val[path[idx]]);
        val = val[path[idx]];
        ++idx;
    }
    return Maybe(val);
});

/**
 * @signature
 * @description d
 * @kind function
 * @function split
 * @param {String} delimiter - a
 * @param {String} string - b
 * @return {Array} - c
 */
var split = curry(function _split(delimiter, string) {
    return string.split(delimiter);
});

var extract = i => i.extract;

var map = curry((fn, f) => f.map(fn));

var  mapped = curry((f, x) => Identity(map(compose(extract, f), x)));

//+ traversed :: Functor f => (a -> f a) -> Setter (f a) (f b) a b
var traversed = curry((point, f, x) => Identity(traverse(compose(extract, f), point, x)));

var traverse = curry((f, point, fctr) => compose(sequenceA(point), map(f))(fctr));

var sequenceA = curry((point, fctr) => fctr.traverse(id, point));

export { arrayLens, objectLens, mapLens, view, over, put, set, lens, prism, prismPath, makeLenses, lensPath, unifiedLens };