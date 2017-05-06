import { javaScriptTypes, shallowClone } from './helpers';

/**
 * @description: No-op function; used as default function in some cases when argument is optional
 * and consumer does not provide.
 * @returns: {undefined}
 */
function noop() {}

/**
 * Identity :: a -> a
 * @description: Identity function; takes any item and returns same item when invoked
 *
 * @param: {*} item - Any value of any type
 * @returns: {*} - returns item
 */
function identity(item) { return item; }

/**
 * constant :: a -> () -> a
 * @description:
 * @param: {*} item
 * @returns: {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
function constant(item) {
    return function _constant() {
        return item;
    };
}

/**
 * kestrel :: a -> () -> a
 * @description:
 * @note: @see {@link constant}
 * @type: {function}
 * @param: {*} item
 * @returns: {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

/**
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
function apply(fn) {
    return function _apply(...args) {
        return function _apply_() {
            return fn(...args);
        }
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {*} arg
 * @param: {function} fn
 * @returns {arg}
 */
var tap = curry(function _tap(fn, arg) {
    fn(arg);
    return arg;
});

/**
 * @description:
 * @param: {function} fn
 * @returns: {function}
 */
function once(fn) {
    var invoked = false;
    return function _once(...args) {
        return invoked ? undefined : fn(...args);
    };
}

/**
 * @description:
 * @param: {Array} fns
 * @returns: {function}
 */
function sequence(fns) {
    return function _sequence(...args) {
        fns.forEach(function fSequence(fn) {
            fn(...args);
        });
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {function} join
 * @param: {function} fn1
 * @param: {function} fn2
 * @returns: {function}
 */
var fork = curry(function _fork(join, fn1, fn2) {
    return function _fork_(...args) {
        return join(fn1(...args), fn2(...args));
    };
});

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {object} obj
 * @returns: {*}
 */
var get = curry(function _get(prop, obj) {
    return obj[prop];
});

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {*} val
 * @param: {object} obj
 * @return: {object}
 */
var set = curry(function _set(prop, val, obj) {
    obj[prop] = val;
    return obj;
});

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {*} val
 * @param: {object} obj
 * @returns: {object}
 */
var objectSet = curry(function _objectSet(prop, val, obj) {
    var result = shallowClone(obj);
    result[prop] = val;
    return result;
});

/**
 * @description: Updates the value at a specified index of an array by first creating a shallow copy
 * of the array and then updating its value at the specified index.
 * @type: {function}
 * @note: @see {@link adjust}
 * @param: {number} idx - The index of the array to which the alternate value will be set.
 * @param: {*} x - The value to be used to update the array at the index specified.
 * @param: {Array} list - The list on which to perform the update.
 * @returns: {Array} - Returns a new array with the value at the specified index being
 * set to the value of the 'x' argument.
 */
var arraySet = curry(function _arraySet(idx, x, list) {
    return adjust(kestrel(x), idx, list);
});

/**
 * compose :: [a] -> (b -> c)
 * @description:
 * @type: {function}
 * @note: @see {@link pipe}
 * @param: {Array} funcs
 * @returns: {*}
 */
function compose(...funcs) {
    return pipe(funcs.reverse());
}

/**
 * pipe :: [a] -> (b -> c)
 * @description: -  Takes a list of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the list of functions over the item,
 * starting with the first function in the list and working through
 * sequentially. Performs a similar functionality to compose, but applies
 * the functions in reverse order to that of compose.
 * @refer: {compose}
 * @note: @see {@link compose}
 * @param: {function} fn - The function to run initially; may be any arity.
 * @param: {Array} fns - The remaining functions in the pipeline. Each receives
 * its input from the output of the previous function. Therefore each of these
 * functions must be unary.
 * @returns: {function} - Returns a function waiting for the item over which
 * to reduce the functions.
 */
function pipe(fn, ...fns) {
    return function _pipe(...args) {
        return fns.reduce(function pipeReduce(item, f) {
            return f(item);
        }, fn(...args));
    };
}

/**
 * ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description: Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @type: {function}
 * @param: {function} predicate
 * @param: {function} ifFunc
 * @param: {function} elseFunc
 * @param: {*} data
 * @return: {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry(function _ifElse(predicate, ifFunc, elseFunc, data) {
    if (predicate(data))
        return ifFunc(data);
    return elseFunc(data);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} predicate
 * @param: {function} ifFunc
 * @param: {*} ifArg
 * @param: {*} thatArg
 * @return: {*}
 */
var ifThisThenThat = curry(function _ifThisThenThat(predicate, ifFunc, ifArg, thatArg) {
    if (predicate(ifArg))
        return ifFunc(thatArg);
    return thatArg;
});

/**
 * when :: Function -> (Function -> (a -> b))
 * @description: Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @param: {function} predicate
 * @param: {function} transform
 * @param: {*} data
 * @return: {*}
 */
var when = curry(function _when(predicate, transform, data) {
    if (predicate(data)) return transform(data);
    return data;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} predicate
 * @param: {function} transform
 * @param: {*} data
 * @return: {*}
 */
var whenNot = curry(function _whenNot(predicate, transform, data) {
    if (!predicate(data)) return transform(data);
    return data;
});

/**
 * @description:
 * @type: {function}
 * @param: {number} offset
 * @param: {Array} list
 * @return: {*}
 */
var nth = curry(function nth(offset, list) {
    var idx = offset < 0 ? list.length + offset : offset;
    return 'string' === typeof list ? list.charAt(idx) : list[idx];
});

/**
 * wrap :: a -> [a]
 * @description: Takes any value of any type and returns an array containing
 * the value passed as its only item
 *
 * @param: {*} data - Any value, any type
 * @return: {[*]} - Returns an array of any value, any type
 */
function wrap(data) {
    return [data];
}

/**
 * @description:
 * @param: {*} a
 * @return: {string}
 */
function type(a) {
    return typeof a;
}

/**
 * isArray :: a -> Boolean
 * @description:
 * @param: data
 * @return: {boolean}
 */
function isArray(data) {
    return Array.isArray(data);
}

/**
 * isObject :: a -> Boolean
 * @description:
 * @param: item
 * @return: {boolean}
 */
function isObject(item) {
    return javaScriptTypes.object === type(item) && null !==  item;
}

/**
 * isFunction :: a -> Boolean
 * @description:
 * @param: {function} fn
 * @return: {boolean}
 */
function isFunction(fn) {
    return javaScriptTypes.function === type(fn);
}

/**
 * @description:
 * @param: {number} num
 * @return: {boolean}
 */
function isNumber(num) {
    return javaScriptTypes.number === type(num);
}

/**
 * @description:
 * @param: {string} str
 * @return: {boolean}
 */
function isString(str) {
    return javaScriptTypes.string === type(str);
}

/**
 * @description:
 * @param: {boolean} bool
 * @return: {boolean}
 */
function isBoolean(bool) {
    return javaScriptTypes.boolean === type(bool);
}

/**
 * @description:
 * @param: {Symbol} sym
 * @return: {boolean}
 */
function isSymbol(sym) {
    return javaScriptTypes.symbol === type(sym);
}

/**
 * @description:
 * @param: {*} n
 * @return: {string|boolean}
 */
function isNull(n) {
    return type(n) && null === n;
}

/**
 * @description:
 * @param: {*} u
 * @return: {boolean}
 */
function isUndefined(u) {
    return javaScriptTypes.undefined === type(u);
}

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
function isNothing(x) {
    return null == x;
}

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
function isSomething(x) {
    return null != x;
}

/**
 * not :: () -> !()
 *
 * @description: - Returns a function, that, when invoked, will return the
 * result of the inversion of the invocation of the function argument. The
 * returned function is curried to the same arity as the function argument,
 * so it can be partially applied even after being 'wrapped' inside the
 * not function.
 * @param: {function} fn
 * @return: {*}
 */
function not(fn) {
    return function _not(...args) {
        return !fn(...args);
    };
}

/**
 * or :: (*... -> Boolean) -> ((*... -> Boolean) -> ((*... -> Boolean)))
 * @description:
 * @type {function}
 * @param: {function} a
 * @param: {function} b
 * @param: {*} item
 * @return: {boolean}
 */
var or = curry(function _or(a, b, item) {
    return a(item) || b(item);
});

/**
 * and :: (*... -> Boolean) -> ((*... -> Boolean) -> ((*... -> Boolean)))
 * @description:
 * @type {function}
 * @param: {function} a
 * @param: {function} b
 * @param: {*}
 * @return: {boolean}
 */
var and = curry(function _and(a, b, item) {
    return a(item) && b(item);
});

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
function flip(x) {
    return !x;
}

/**
 * @description:
 * @param: {*} x
 * @return: {boolean}
 */
function truthy(x) {
    return !!x;
}

/**
 * @description:
 * @type {flip}
 * @see flip
 * @param {*} x
 * @returns {boolean}
 */
var falsey = flip;

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var add = curry(function _add(x, y) {
    return x + y;
});

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var subtract = curry(function _subtract(x, y) {
    return x - y;
});

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var divide = curry(function _divide(x, y) {
    return x / y;
});

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var multiple = curry(function _multiple(x, y) {
    return x * y;
});

/**
 * @description:
 * @type: {function}
 * @param: {number} x
 * @param: {number} y
 * @return: {number}
 */
var modulus = curry(function _modulus(x, y) {
    return x % y;
});

/**
 * @description:
 * @param: {Array} first
 * @param: {Array} rest
 * @return: {string | Array}
 */
function concat(first, ...rest) {
    if (null == rest || !rest.length) return first;
    return rest.reduce(function _concatStrings(cur, next) {
        return cur.concat(next);
    }, first);
}

/**
 * @description:
 * @param: {number} x
 * @return: {number}
 */
function negate(x) {
    return -x;
}

/**
 * @description:
 * @type: {function}
 * @param: {*} x
 * @param: {*} y
 * @return: {boolean}
 */
var equal = curry(function _curry(x, y) {
    return x == y;
});

/**
 * @description:
 * @type: {function}
 * @param: {*} x
 * @param: {*} y
 * @return: {boolean}
 */
var strictEqual = curry(function _strictEqual(x, y) {
    return x === y;
});

/**
 * @description:
 * @type: {function}
 * @param: {*}
 * @param: {*}
 * @return: {boolean}
 */
var notEqual = curry(function _notEqual(x, y) {
    return x != y;
});

/**
 * @description:
 * @type: {function}
 * @param: {*} x
 * @param: {*} y
 * @return: {boolean}
 */
var strictNotEqual = curry(function _strictNotEqual(x, y) {
    return x !== y;
});

/**
 * @description:
 * @type: {function}
 * @param: {number | string} x
 * @param: {number | string} y
 * @return: {boolean}
 */
var greaterThan = curry(function _greaterThan(x, y) {
    return x > y;
});

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var greaterThanOrEqual = curry(function _greaterThanOrEqual(x, y) {
    return x >= y;
});

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var lessThan = curry(function _lessThan(x, y) {
    return x < y;
});

/**
 * @description:
 * @type: {function}
 * @param: {string | number} x
 * @param: {string | number} y
 * @return: {boolean}
 */
var lessThanOrEqual = curry(function _lessThanOrEqual(x, y) {
    return x <= y;
});

/**
 * @description:
 * @type: {function}
 * @param: {object} delegator
 * @param: {object} delegate
 * @returns: {boolean}
 */
var delegatesTo = curry(function _delegatesTo(delegator, delegate) {
    return delegate.isPrototypeOf(delegator);
});

/**
 * @description:
 * @type: {function}
 * @param: {object} delegate
 * @param: {object} delegator
 * @returns: {boolean}
 */
var delegatesFrom = curry(function _delegatesFrom(delegate, delegator) {
    return delegate.isPrototypeOf(delegator);
});

/**
 * @description:
 * @type: {function}
 * @param: {number} idx
 * @param: {function} f
 * @param: {Array} xs
 * @return: {Array}
 */
var arrayLens = curry(function _arrayLens(idx, f, xs) {
    return map(function (val) {
        return arraySet(idx, val, xs)
    }, f(xs[idx]));
});

/**
 * @description:
 * @type: {function}
 * @param: {string} prop
 * @param: {function} f
 * @param: {Object} xs
 * @return: {Object}
 */
var objectLens = curry(function _objectLens(prop, f, xs) {
    return map(function _map(rep) {
        return objectSet(prop, rep, xs);
    }, f(xs[prop]));
});

/**
 * @description:
 * @type: {function}
 * @param: {function} lens
 * @param: {Object} target
 * @return:
 */
var view = curry(function _view(lens, target) {
    return lens(kestrel)(target).value;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} lens
 * @param: {function} mapFn
 * @param: {Object} target
 * @return:
 */
var over = curry(function _over(lens, mapFn, target) {
    return lens(function _lens(y) {
        return identity(mapFn(y));
    })(target).value;
});

/**
 * @description:
 * @type: {function}
 * @param: {function} lens
 * @param: {*} val
 * @param: {*} target
 * @return:
 */
var put = curry(function _put(lens, val, target) {
    return over(lens, kestrel(val), target);
});

/**
 * @description:
 * @param: {Array} paths
 * @return: {*}
 */
function makeLenses(...paths) {
    return paths.reduce(function _pathReduce(cur, next) {
        var ol = objectLens(next);
        return put(ol, ol, cur);
    }, { num: arrayLens });
}

/**
 * @description:
 * @param: {Array} path
 * @return: {*}
 */
function lensPath(...path) {
    return compose(...path.map(function _pathMap(p) {
        return 'string' === typeof p ? objectLens(p) : arrayLens(p);
    }));
}

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {object} x
 * @return: {identity<T>}
 */
var mapped = curry(function _mapped(f, x) {
    return identity(map(compose(function _mCompose(x) {
        return x.value;
    }, f), x));
});

/**
 * @description: Updates the value stored in a single specified index of an array. The function
 * argument should be some form of a unary projector. The 'projector' function will receive
 * the value stored in the existing array at the specified 'idx' argument location. A new array
 * is returned and the original array remains unchanged.
 * @type: {function}
 * @param: {function} fn - A function that can operate on a single point of data from the array
 * and a value to be used as an update for the same index in the new array.
 * @param: {number} idx - A number representing the zero-based offset of the array; idx determines
 * what value will be passed as the unary argument to the operator function and what index in the
 * newly created array will be altered. If the value is less than zero, the function will use the
 * 'idx' argument value as an offset from the last element in the array.
 * @param: {Array} list - The list to update.
 * @return: {Array} - Returns a new array identical to the original array except where the new,
 * computed value is inserted
 */
var adjust = curry(function _adjust(fn, idx, list) {
    if (idx >= list.length || idx < -list.length) {
        return list;
    }
    var _idx = idx < 0 ? list.length + idx : idx,
        _list = list.map(identity);
    _list[_idx] = fn(list[_idx]);
    return _list;
});

/**
 * curry :: (* -> a) -> (* -> a)
 * @description:
 * @param: {function} fn
 * @return: {function|*}
 */
function curry(fn) {
    if (!fn.length || 1 === fn.length) return fn;
    return curryN(fn.length, [], fn);
}

/**
 * @description: Curries a function to a specified arity
 * @param: {number} arity - The number of arguments to curry the function for
 * @param: {Array} received - An array of the arguments to be applied to the function
 * @param: {function} fn - The function to be curried
 * @return: {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function invocation
 * if the specified number of arguments have been received
 */
function curryN(arity, received, fn) {
    return function _curryN(...rest) {
        var combined = received.concat(rest);
        if (arity > combined.length)
            return curryN(arity, combined, fn);
        return fn.call(this, ...combined);
    };
}

export { noop, identity, constant, apply, once, kestrel, get, set, objectSet, arraySet, nth, compose, pipe, ifElse, ifThisThenThat,
        when, whenNot, wrap, type, isArray, isObject, isFunction, isNumber, isString, isBoolean, isSymbol, isNull,
        isUndefined, isNothing, isSomething, not, or, and, flip, truthy, falsey, add, subtract, divide, multiple, modulus, concat, negate,
        equal, strictEqual, notEqual, strictNotEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, delegatesTo, delegatesFrom,
        arrayLens, objectLens, view, over, put, makeLenses, lensPath, mapped, adjust, curry, curryN, tap, fork, sequence };