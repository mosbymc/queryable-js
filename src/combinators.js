/**
 * @description:
 * @param: {Array} fns - One or more comma separated function arguments
 * @return: {function}
 */
function all(...fns) {
    return function _all(...args) {
        return fns.every(function _testAll(fn) {
            return fn(...args);
        });
    };
}

/**
 * @description:
 * @param: {Array} fns - One or more comma separated function arguments
 * @return: {function}
 */
function any(...fns) {
    return function _any(...args) {
        return fns.some(function _testAny(fn) {
            return fn(...args);
        });
    };
}

/**
 * @description:
 * @type: {function}
 * @param: {function} x
 * @param: {*} y
 * @param: {*} z
 * @return: {*}
 */
var c = curry(function _c(x, y, z) {
    console.log(x, y, z);
    return x(y)(z);
});

var rev = (...args) => args.reverse();

/**
 * compose :: (b -> c) -> (a -> b) -> (a -> c)
 * @description:
 * @type: {function}
 * @note: @see {@link pipe}
 * @param: {Array} fns
 * @returns: {*}
 */
function compose(...fns) {
    fns = fns.reverse();
    return pipe(...fns);
}

/**
 * @description:
 * @type: {function}
 * @param: {function} exp1
 * @param: {function} exp2
 * @param: {function} cond
 * @return: {*}
 */
var condition = curry((exp1, exp2, cond) => cond(exp1, exp2));

var notFn = condition(constant(x => x), x => x);

var n = function _n(x, y, z) {
    return function _n_(...args) {
        console.log(x, y, z);
        x ? y(...args) : z(...args);
    };
};

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
 * @type: curry :: (* -> a) -> (* -> a)
 * @description:
 * @param: {function} fn
 * @return: {function|*}
 */
function curry(fn) {
    if (!fn.length || 1 >= fn.length) return fn;
    return curryN(this, fn.length, fn);
}

/**
 * @type: curryN :: (* -> a) -> (* -> a)
 * @description: Curries a function to a specified arity
 * @param: {number} arity - The number of arguments to curry the function for
 * @param: {Array} received - An array of the arguments to be applied to the function
 * @param: {function} fn - The function to be curried
 * @return: {function | *} - Returns either a function waiting for more arguments to
 * be applied before invocation, or will return the result of the function applied
 * to the supplied arguments if the specified number of arguments have been received.
 */
function curryN(context, arity, fn, received = []) {
    if (fn.orig && fn.orig !== fn) return curryN(context, arity, fn.orig, received);
    function _curryN(...rest) {
        var combined = received.concat(rest);
        if (arity > combined.length) return curryN(context, arity, fn, combined);
        return fn.call(context, ...combined.slice(0, arity));
    }

    _curryN.orig = fn;
    return _curryN;
}

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return: {Function|*}
 */
function curryRight(fn) {
    return curryN(this, fn.length, function _wrapper(...args) {
        return fn.call(this, ...args.reverse());
    });
}

/**
 * @type:
 * @description:
 * @param: {*}
 * @return: {function}
 */
var first = constant;

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return {*}
 */
function fixedPoint(fn) {
    function _fixedPoint(x) {
        return fn(function _y_(v) {
            x(x)(v);
        });
    }
    return _fixedPoint(_fixedPoint);
}

/**
 * @type:
 * @description:
 * @param: {function} join
 * @param: {function} fn1
 * @param: {function} fn2
 * @returns: {function}
 */
var fork = curry((join, fn1, fn2) => {
    return (...args) => join(fn1(...args), fn2(...args));
});

/**
 * @type: Identity :: a -> a
 * @description: Identity function; takes any item and returns same item when invoked
 * @param: {*} item - Any value of any type
 * @returns: {*} - returns item
 */
var identity = item => item;

/**
 * @type: ifElse :: Function -> ( Function -> ( Function -> (a -> b) ) )
 * @description: Takes a predicate function that is applied to the data; If a truthy value
 * is returned from the application, the provided ifFunc argument will be
 * invoked, passing the data as an argument, otherwise the elseFunc is
 * invoked with the data as an argument.
 * @param: {function} predicate
 * @param: {function} ifFunc
 * @param: {function} elseFunc
 * @param: {*} data
 * @return: {*} - returns the result of invoking the ifFunc or elseFunc
 * on the data
 */
var ifElse = curry((predicate, ifFunc, elseFunc, data) => predicate(data) ? ifFunc(data) : elseFunc(data));

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @param: {function} ifFunc
 * @param: {*} ifArg
 * @param: {*} thatArg
 * @return: {*}
 */
var ifThisThenThat = curry((predicate, ifFunc, ifArg, thatArg) => predicate(ifArg) ? ifFunc(thatArg) : thatArg);

/**
 * @type: kestrel :: a -> () -> a
 * @description:
 * @note: @see {@link constant}
 * @param: {*} item
 * @returns: {function} - Returns a function, that when invoked, will
 * return the item passed to the constant function as an argument.
 */
var kestrel = constant;

/**
 * @type:
 * @description:
 * @param: {function} a
 * @return: {*}
 */
var m = a => a(a);

/**
 * @type:
 * @description:
 * @param: {function} a
 * @param: {function} b
 * @return: {*}
 */
var o = curry((a, b) => b(a(b)));

/**
 * @type: pipe :: [a] -> (b -> c)
 * @description: -  Takes a List of functions as arguments and returns
 * a function waiting to be invoked with a single item. Once the returned
 * function is invoked, it will reduce the List of functions over the item,
 * starting with the first function in the List and working through
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
 * @type:
 * @description:
 * @param: {function} a
 * @param: {function} b
 * @param: {*} c
 * @return: {*}
 */
var q = curry((a, b, c) => b(a(c)));

//const reduce = (accFn, start, xs) => xs.reduce(accFn, start);
/**
 * @type:
 * @description:
 * @param: {function} accFunc
 * @param: {*} start
 * @param: {Array} xs
 * @return: {Array};
 */
var reduce = curry(function _reduce(accFunc, start, xs) {
    /*
     for (let item of xs) {
     start = accFunc(start, item);
     }
     return start;
     */

    /*
     for (let item of xs) {
     let next = txf(acc, item);//we could also pass an index or xs, but K.I.S.S.
     acc = next && next[reduce.stopper] || next;// {[reduce.stopper]:value} or just a value
     if (next[reduce.stopper]) {
     break;
     }
     }
     return acc;

     //goes outside reduce definition; or side by side with declaration:
     //set reduce.stopper be a Symbol that only is only ever = to reduce.stopper itself
     Object.defineProperty(reduce, 'stopper', {
     enumerable: false,
     configurable: false,
     writable: false,
     value: Symbol('stop reducing')//no possible computation could come up with this by accident
     });
     */
    return xs.reduce(accFunc, start);
});

/**
 * @type:
 * @description:
 */
var second = constant(identity);

/**
 * @type:
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
 * @type:
 * @description:
 * @param: {*} x
 * @param: {function} f
 * @return: {*}
 */
var t = curry((x, f) => f(x));

/**
 * @type:
 * @description:
 * @refer: {t}
 * @note: @see {@link t}
 */
var thrush = t;

/**
 * @type:
 * @description:
 * @param: {function} a
 * @param: {function} b
 * @return: {*}
 */
var u = curry((a, b) => b(a(a)(b)));

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
function uncurry(fn) {
    if (fn && fn.orig) return fn.orig;
    return fn;
}

/**
 * @type:
 * @description:
 * @param: {number} depth
 * @param: {function} fn
 * @return: {function|*}
 */
var uncurryN = curry(function uncurryN(depth, fn) {
    console.log(depth, fn);
    return curryN(this, depth, function _uncurryN(...args) {
        console.log(args);
        var currentDepth = 1,
            value = fn,
            idx = 0,
            endIdx;
        while (currentDepth <= depth && 'function' === typeof value) {
            endIdx = currentDepth === depth ? args.length : idx + value.length;
            value = value.apply(this, args.slice(idx, endIdx));
            currentDepth += 1;
            idx = endIdx;
        }
        return value;
    });
});

/**
 * @type:
 * @description:
 * @param: {function} a
 * @param: {*} b
 * @return: {*}
 */
var w = curry((a, b) => a(b)(b));

/**
 * @type: when :: Function -> (Function -> (a -> b))
 * @description: Similar to ifElse, but no 'elseFunc' argument. Instead, if the application
 * of the predicate to the data returns truthy, the transform is applied to
 * the data. Otherwise, the data is returned without invoking the transform.
 * @param: {function} predicate
 * @param: {function} transform
 * @param: {*} data
 * @return: {*}
 */
var when = curry((predicate, transform, data) => predicate(data) ? transform(data) : data);

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @param: {function} transform
 * @param: {*} data
 * @return: {*}
 */
var whenNot = curry((predicate, transform, data) => !predicate(data) ? transform(data) : data);

/**
 * @type:
 * @description:
 */
var y = fixedPoint;

/**
 * @type:
 * @description:
 * @param: {function} fn
 * @return: {function}
 */
function applyWhenReady(fn) {
    var values = [];
    function _applyWhenReady(...args) {
        values = values.concat(args);
        return _applyWhenReady;
    }

    _applyWhenReady.apply = function _apply() {
        return fn(...values);
    };

    _applyWhenReady.leftApply = _applyWhenReady.apply;

    _applyWhenReady.rightApply = function _rightApply() {
        console.log(values);
        return fn(...values.reverse());
    };

    return _applyWhenReady;
}

export { all, any, applyWhenReady, c, compose, constant, curry, curryN, curryRight, first, fixedPoint, fork, identity,
          ifElse, ifThisThenThat, kestrel, m, pipe, o, q, reduce, rev, second, sequence, t, thrush, u, uncurry, uncurryN, w, when, whenNot, y };