import { curry, compose, identity } from './combinators';
import { getWith } from './functionalHelpers';

//TODO: I need to figure out how to structure this lib. I'd like to have several different types of containers...
//TODO: ...specifically, functors (pointed), monads, and maybe one other type. In addition, each container type
//TODO: would have several implementations: maybe, option, constant, identity, future_functor, io, etc. It would make sense
//TODO: to let the "higher" level containers delegate to the "lower" level implementations since they share all the
//TODO: functionality of the "lower" containers and add to them. In addition, a lot of the containers will have the
//TODO: same mapWith, flatMapWith, chain, apply, etc functionality; it would be nice to share this functionality as well.
//TODO: Finally, I'd like to have each container in a category be capable of converting their underlying value to
//TODO: another container of the same category without the use of 'apply', more in the manner of 'toContainerX'.
//TODO: However, this means that each container in a given category has a dependency on all the other containers in
//TODO: the same category. This, more than the rest, makes structuring this lib difficult. I'd like to, at the very
//TODO: least, split each container category up so that they can be imported (and preferably downloaded) individually.
//TODO: But the more separation between containers, the more they have to 'import' each other.

/**
 * @description:
 * @type: {function}
 * @param: {functor} ma
 * @param: {functor} mb
 * @return: {functor}
 */
var apply = curry(function _apply(ma, mb) {
    return mb.apply(ma);
});

/**
 * @type:
 * @description:
 * @param: {functor|monad} ma
 * @param: {functor|monad} mb
 * @return: {functor|monad mb}
 */
var ap = apply;

/**
 * @type:
 * @description:
 * @param: {Monad a} m
 * @param: {function} fn :: (a) -> Monad b
 * @return: {Monad b}
 */
var flatMap = curry(function _flatMap(m, fn) {
    return m.flatMap(fn);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {functor} m
 * @return: {functor}
 */
var flatMapWith = curry(function _flatMapWith(fn, m) {
    return m.flatMap(fn);
});

/**
 * @type:
 * @description:
 * @param: {Monad a} m
 * @param: {function} fn :: (a) -> b
 * @return: {Monad b}
 */
var map = curry(function _map(m, fn) {
    return m.map(fn);
});

/**
 * @description:
 * @type: {function}
 * @param: {function} fn
 * @param: {functor} m
 * @return: {functor|monad m}
 */
var mapWith = curry(function _map(fn, m) {
    return m.map(fn);
});

/**
 * @type:
 * @description:
 */
var pluckWith = compose(mapWith, getWith);

/**
 * @description:
 * @type {function} @see mapWith
 * @param: {function} fn
 * @param: {functor} m
 * @return:
 */
var fmap = mapWith;

/**
 * @description:
 * @type: {function}
 * @param: {function} f
 * @param: {functor} m
 * @return:
 */
var chain = curry(function _chain(f, m){
    return m.map(f).join(); // or compose(join, mapWith(f))(m)
});

/**
 * @type:
 * @description:
 */
var bind = chain;

/**
 * @type:
 * @description:
 * @param: {function} f
 * @param: {function} g
 * @return: {function}
 */
var mcompose = function _mcompose(f, g) {
    return compose(chain(f), g);
};

/**
 * @type:
 * @description:
 * @param: {*} val
 * @param: {@see state_functor} fa
 * @return: {@see state_functor}
 */
var put = curry(function _put(val, fa) {
    return fa.put(val);
});

/**
 * @type:
 * @description:
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @return: {Mb}
 */
var lift2 = curry(function _lift2(f, m1, m2) {
    return m1.map(f).apply(m2);
});

/**
 * @type:
 * @description:
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @param: {functor} m3
 * @return: {Mb}
 */
var lift3 = curry(function _lift3(f, m1, m2, m3) {
    return lift2(f, m1, m2).apply(m3);
});

/**
 * @type:
 * @description:
 * @param: {function} f
 * @param: {functor} m1
 * @param: {functor} m2
 * @param: {functor} m3
 * @param: {functor} m4
 * @return: {Mb}
 */
var lift4 = curry(function _lift4(f, m1, m2, m3, m4) {
    return lift3(f, m1, m2, m3).apply(m4);
});

/**
 * @type:
 * @description:
 * @param: {function} f
 * @param: {Ma} ...ms
 * @return: {Mb}
 */
var liftN = curry(function _liftN(f, ...ms) {
    return ms.slice(1).reduce(function _apply(curM, nextM) {
        return curM.apply(nextM);
    }, ms.shift().map(f));
});

/**
 * @type:
 * @description:
 * @param: {functor} ma
 * @return: {functor}
 */
function mjoin(ma) {
    return ma.join();
}

/**
 * @type:
 * @description:
 * @param: {functor|monad} type
 * @return: {function}
 */
function toContainerType(type) {
    return function toType(fn = identity) {
        return type.of(fn(this.value));
    };
}

/**
 * @type:
 * @description:
 * @return: {{next: _next}}
 */
function containerIterator() {
    let first = true,
        val = this.value;
    return {
        next: function _next() {
            if (first) {
                first = false;
                return {
                    done: false,
                    value: val
                };
            }
            return {
                done: true
            };
        }
    };
}

/**
 * @type:
 * @description:
 * @param: {functor} ma
 * @return: {@see m_list}
 */
function toList(ma) {
    return List(mjoin(ma));
}

/**
 * @type:
 * @description:
 * @param: {functor} ma
 * @return: {@see _maybe}
 */
function toMaybe(ma) {
    //return Maybe(mjoin(ma));
}

/**
 * @type:
 * @description:
 * @param: {functor} ma
 * @return: {@see _future}
 */
function toFuture(ma) {
    //return Future(mjoin(ma));
}

/**
 * @type:
 * @description:
 * @param: {functor} ma
 * @return: {@see _identity}
 */
function toIdentity(ma) {
    //return Identity(mjoin(ma));
}

/**
 * @type:
 * @description:
 * @param: {functor} ma
 * @return: {@see _just}
 */
function toJust(ma) {
    //return Just(mjoin(ma));
}

//===========================================================================================//
//===========================================================================================//
//=======================           CONTAINER TRANSFORMERS            =======================//
//===========================================================================================//
//===========================================================================================//

function _toIdentity() {
    //return Identity.from(this.value);
}

function _toJust() {
    //return Just.from(this.value);
}

function _toList() {
    //return List.from(this.value);
}

function _toMaybe() {
    //return Maybe.from(this.value);
}



//===========================================================================================//
//===========================================================================================//
//============================           LIST HELPERS            ============================//
//===========================================================================================//
//===========================================================================================//

/**
 * @type:
 * @description:
 * @param: {function} predicate
 * @param: {Array} xs
 * @return: {Array}
 */
var filter = curry(function _filter(predicate, xs) {
    xs.filter(predicate);
});

/**
 * @type:
 * @description:
 * @param: {Array} xs
 * @param: {function} comparer
 * @param: {Array} ys
 * @return: {Array}
 */
var intersect = curry(function _intersect(xs, comparer, ys) {
    return ys.intersect(xs, comparer);
});

/**
 * @type:
 * @description:
 * @param: {Array} xs
 * @param: {function} comparer
 * @param: {Array}
 */
var except = curry(function _except(xs, comparer, ys) {
    return ys.except(xs, comparer);
});

export { apply, ap, fmap, map, mapWith, flatMap, flatMapWith, lift2, lift3, lift4, liftN, mjoin, pluckWith, toContainerType,
            containerIterator, chain, bind, mcompose, filter, intersect, except };