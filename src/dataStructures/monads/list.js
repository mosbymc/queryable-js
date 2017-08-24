import { all, any, chain, except, intersect, union, map, groupBy, sortBy, prepend, concat, groupJoin, join, zip, filter, intersperse,
    contains, first, last, count, foldLeft, reduceRight, distinct, ofType, binarySearch, equals, takeWhile, skipWhile, reverse,
    copyWithin, fill, findIndex, findLastIndex, repeat, foldRight, unfold } from '../list_iterators';
import { sortDirection, generatorProto } from '../../helpers';
import { wrap, defaultPredicate, delegatesFrom, isArray, noop, invoke } from '../../functionalHelpers';
import { when, ifElse, identity } from '../../combinators';
import { not } from '../../decorators';
import { createListCreator, taker_skipper, listExtensionHelper } from '../list_helpers';

/**
 * @description: Object that contains the core functionality of a List; both the m_list and ordered_m_list
 * objects delegate to this object for all functionality besides orderBy/orderByDescending
 * and thenBy/thenByDescending respectively. Getter/setters are present for state-manipulation
 * at the consumer-object level, as well as to provide default values for a consumer-level
 * object at creation if not specified.
 * @typedef {Object}
 * @property {function} value
 * @property {function} apply
 * @property {function} append
 * @property {function} bimap
 * @property {function} chain
 * @property {function} concat
 * @property {function} copyWithin
 * @property {function} distinct
 * @property {function} except
 * @property {function} fill
 * @property {function} filter
 * @property {function} groupBy
 * @property {function} groupByDescending
 * @property {function} groupJoin
 * @property {function} intersect
 * @property {function} intersperse
 * @property {function} join
 * @property {function} map
 * @property {function} mjoin
 * @property {function} ofType
 * @property {function} prepend
 * @property {function} reverse
 * @property {function} sequence
 * @property {function} skip
 * @property {function} skipWhile
 * @property {function} take
 * @property {function} takeWhile
 * @property {function} union
 * @property {function} zip
 * @property {function} all
 * @property {function} any
 * @property {function} count
 * @property {function} equals
 * @property {function} findIndex
 * @property {function} findLastIndex
 * @property {function} first
 * @property {function} foldl
 * @property {function} foldr
 * @property {function} isEmpty
 * @property {function} last
 * @property {function} reduceRight
 * @property {function} toArray
 * @property {function} toEvaluatedList
 * @property {function} toMap
 * @property {function} toSet
 * @property {function} toString
 * @property {function} traverse
 * @property {function} valueOf
 * @property {function} factory
 * @property {function} of
 * @property {Symbol.iterator}
 * @kind {Object}
 * @memberOf monads
 * @namespace list_core
 * @description This is the delegate object that specifies the behavior of the list functor. Most
 * operations that may be performed on an list functor 'instance' delegate to this object. List
 * functor 'instances' are created by the {@link monads.List} factory function via Object.create,
 * during which the underlying value is placed directly on the newly created object. No other
 * properties exist directly on an list functor delegator object beyond the ._value property.
 * All behavior delegates to this object, or higher up the prototype chain.
 */
var list_core = {
    //Using getters for these properties because there's a chance the setting and/or getting
    //functionality could change; this will allow for a consistent interface while the
    //logic beneath changes
    /**
     * @signature () -> *
     * @description Returns the underlying value of an identity_functor delegator. This
     * getter is not expected to be used directly by consumers - it is meant as an internal
     * access only. To manipulate the underlying value of an identity_functor delegator,
     * see {@link monads.list#map} and {@link monads.list#bimap}.
     * To retrieve the underlying value of an identity_functor delegator, see {@link monads.list#get},
     * {@link monads.list#orElse}, {@link monads.list#getOrElse},
     * and {@link monads.list#valueOf}.
     * @memberOf monads.list_core
     * @instance
     * @protected
     * @function value
     * @return {*} Returns the underlying value of the delegator. May be any value.
     */
    get value() {
        return this._value;
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function copyWithin
     * @param {number} index - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {monads.list_core} - d
     */
    copyWithin: function _copyWithin(index, start, end) {
        return this.of(this, copyWithin(index, start, end, this));
    },

    /**
     * @signature
     * @description Concatenates two or more lists by appending the "method's" List argument(s) to the
     * List's value. This function is a deferred execution call that returns
     * a new queryable object delegator instance that contains all the requisite
     * information on how to perform the operation.
     * @memberOf monads.list_core
     * @instance
     * @function concat
     * @param {Array | *} ys - a
     * @return {monads.list_core} - b
     */
    concat: function _concat(...ys) {
        return this.of(this, concat(this, ys, ys.length));
    },

    /**
     * @signature (a -> boolean) -> List<b>
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function distinct
     * @param {function} comparer - a
     * @return {monads.list_core} - b
     */
    distinct: function _distinct(comparer) {
        return this.of(this, distinct(this, comparer));
    },

    /**
     * @signature
     * @description Produces a List that contains the objectSet difference between the queryable object
     * and the List that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * equality comparer.
     * @memberOf monads.list_core
     * @instance
     * @function except
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {monads.list_core} - c
     */
    except: function _except(xs, comparer) {
        return this.of(this, except(this, xs, comparer));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function fill
     * @param {number} value - a
     * @param {number} start - b
     * @param {number} end - c
     * @return {monads.list_core} - d
     */
    fill: function _fill(value, start, end) {
        return this.of(this, fill(value, start, end, this));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function filter
     * @param {function} predicate - a
     * @return {monads.list_core} - b
     */
    filter: function _filter(predicate) {
        return this.of(this, filter(this, predicate));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function groupBy
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {monads.list_core} - c
     */
    groupBy: function _groupBy(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
        return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function groupByDescending
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {monads.list_core} - c
     */
    groupByDescending: function _groupByDescending(keySelector, comparer) {
        var groupObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
        return this.of(this, groupBy(this, groupObj, createGroupedListDelegate));
    },

    /**
     * @signature
     * @description Correlates the items in two lists based on the equality of a key and groups
     * all items that share the same key. A comparer function may be provided to
     * the function that determines the equality/inequality of the items in each
     * List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @memberOf monads.list_core
     * @instance
     * @function groupJoin
     * @param {monads.list_core | Array} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} comparer - e
     * @return {monads.list_core} - f
     */
    groupJoin: function _groupJoin(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, groupJoin(this, ys, xSelector, ySelector, projector, createGroupedListDelegate, comparer));
    },

    /**
     * @signature
     * @description Produces the objectSet intersection of the List object's value and the List
     * that is passed as a function argument. A comparer function may be
     * provided to the function that determines the equality/inequality of the items in
     * each List; if left undefined, the function will use a default equality comparer.
     * This function is a deferred execution call that returns a new queryable
     * object delegator instance that contains all the requisite information on
     * how to perform the operation.
     * @memberOf monads.list_core
     * @instance
     * @function intersect
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {monads.list_core} - c
     */
    intersect: function _intersect(xs, comparer) {
        return this.of(this, intersect(this, xs, comparer));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function intersperse
     * @param {*} val - a
     * @return {monads.list_core} - b
     */
    intersperse: function _intersperse(val) {
        return this.of(this, intersperse(this, val));
    },

    /**
     * @signature
     * @description Correlates the items in two lists based on the equality of items in each
     * List. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @memberOf monads.list_core
     * @instance
     * @function join
     * @param {Array|List} ys - a
     * @param {function} xSelector - b
     * @param {function} ySelector - c
     * @param {function} projector - d
     * @param {function} comparer - e
     * @return {monads.list_core} - f
     */
    join: function _join(ys, xSelector, ySelector, projector, comparer) {
        return this.of(this, join(this, ys, xSelector, ySelector, projector, comparer));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function map
     * @param {function} mapFunc - a
     * @return {monads.list_core} - b
     */
    map: function _map(mapFunc) {
        return this.of(this, map(this, mapFunc));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function ofType
     * @param {string|Object} type - a
     * @returns {monads.list_core} - b
     */
    ofType: function _ofType(type) {
        return this.of(this, ofType(this, type));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function prepend
     * @param {Array|generator} xs - a
     * @return {monads.list_core} - b
     */
    prepend: function _prepend(xs) {
        return this.of(this, prepend(this, xs));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function reverse
     * @return {monads.list_core} - a
     */
    reverse: function _reverse() {
        return this.of(this, reverse(this));
    },

    /**
     * @signature
     * @description Skips over a specified number of items in the source and returns the
     * remaining items. If no amount is specified, an empty list is returned;
     * Otherwise, a list containing the items collected from the source is
     * returned.
     * @memberOf monads.list_core
     * @instance
     * @function skip
     * @param {number} amt - The number of items in the source to skip before
     * returning the remainder.
     * @return {monads.list_core} - a
     */
    skip: function _skip(amt) {
        return this.skipWhile(taker_skipper(amt));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function skipWhile
     * @param {function} predicate - a
     * @return {monads.list_core} - b
     */
    skipWhile: function _skipWhile(predicate = defaultPredicate) {
        return this.of(this, skipWhile(this, predicate));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function take
     * @param {number} amt - a
     * @return {monads.list_core} - b
     */
    take: function _take(amt) {
        return this.takeWhile(taker_skipper(amt));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function takeWhile
     * @param {function} predicate - a
     * @return {monads.list_core} - b
     */
    takeWhile: function _takeWhile(predicate = defaultPredicate) {
        return this.of(this, takeWhile(this, predicate));
    },

    /**
     * @signature
     * @description Produces the objectSet union of two lists by selecting each unique item in both
     * lists. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @memberOf monads.list_core
     * @instance
     * @function union
     * @param {Array|generator} xs - a
     * @param {function} comparer - b
     * @return {monads.list_core} - c
     */
    union: function _union(xs, comparer) {
        return this.of(this, union(this, xs, comparer));
    },

    /**
     * @signature
     * @description Produces a List of the items in the queryable object and the List passed as
     * a function argument. A comparer function may be provided to the function that determines
     * the equality/inequality of the items in each List; if left undefined, the
     * function will use a default equality comparer. This function is a deferred
     * execution call that returns a new queryable object delegator instance that
     * contains all the requisite information on how to perform the operation.
     * @memberOf monads.list_core
     * @instance
     * @function zip
     * @param {function} selector - a
     * @param {Array|generator} xs - b
     * @return {monads.list_core} - c
     */
    zip: function _zip(selector, xs) {
        return this.of(this, zip(this, xs, selector));
    },

    /**
     * @signature (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function all
     * @param {function} predicate - a
     * @return {boolean} - b
     */
    all: function _all(predicate = defaultPredicate) {
        return all(this, predicate);
    },

    /**
     * @signature: (a -> Boolean) -> [a] -> Boolean
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function any
     * @param {function} predicate - a
     * @return {boolean} - b
     */
    any: function _any(predicate = defaultPredicate) {
        return any(this, predicate);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function count
     * @param {function} predicate - a
     * @return {Number} -  b
     */
    count: function _count(predicate) {
        return count(this, predicate);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function equals
     * @param {monads.list_core} f - a
     * @param {function} comparer - b
     * @return {boolean} - c
     */
    equals: function _equals(f, comparer) {
        return Object.getPrototypeOf(this).isPrototypeOf(f) && equals(this, f, comparer);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function findIndex
     * @param {function} comparer - a
     * @return {Number} - b
     */
    findIndex: function _findIndex(comparer) {
        return findIndex(this, comparer);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function findLastIndex
     * @param {function} comparer - a
     * @return {Number} - b
     */
    findLastIndex: function _findLastIndex(comparer) {
        return findLastIndex(this, comparer);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function first
     * @param {function} predicate - a
     * @return {*} - b
     */
    first: function _first(predicate = defaultPredicate) {
        return first(this, predicate);
    },

    /**
     * @signature (a -> b -> c) -> a -> [b] -> a
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function foldl
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldl: function _foldl(fn, acc) {
        return foldLeft(this, fn, acc);
    },

    /**
     * @signature (a -> a -> a) -> [a] -> a
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function foldr
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    foldr: function _foldr(fn, acc) {
        return foldRight(this, fn, acc);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function isEmpty
     * @return {boolean} - a
     */
    isEmpty: function _isEmpty() {
        return 0 === this.data.length;
    },

    /**
     * @signature
     * @description d
     * @memberOf  monads.list_core
     * @instance
     * @function last
     * @param {function} predicate - a
     * @return {*} - b
     */
    last: function _last(predicate = defaultPredicate) {
        return last(this, predicate);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function reduceRight
     * @param {function} fn - a
     * @param {*} acc - b
     * @return {*} - c
     */
    reduceRight: function _reduceRight(fn, acc) {
        return reduceRight(this, fn, acc);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function toArray
     * @return {Array} - a
     */
    toArray: function _toArray() {
        return Array.from(this);
    },

    /**
     * @signature
     * @description Evaluates the current List instance and returns a new List
     * instance with the evaluated data as its source. This is used when the
     * initial List's data must be iterated more than once as it will cause
     * the evaluation to happen each item it is iterated. Rather the pulling the
     * initial data through the List's 'pipeline' every time, this property will
     * allow you to evaluate the List's data and store it in a new List that can
     * be iterated many times without needing to re-evaluate. It is effectively
     * a syntactical shortcut for: List.from(listInstance.data)
     * @memberOf monads.list_core
     * @instance
     * @function toEvaluatedList
     * @return {monads.list_core} - a
     */
    toEvaluatedList: function _toEvaluatedList() {
        return List.from(this.data /* the .data property is a getter function that forces evaluation */);
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function toMap
     * @return {Map} - a
     */
    toMap: function _toMap() {
        return new Map(this.data.map(function _map(val, idx) {
            return [idx, val];
        }));
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function toSet
     * @return {Set} - a
     */
    toSet: function _toSet() {
        return new Set(this);
    },

    /**
     * @signature
     * @description Returns a string representation of an instance of a List
     * delegator object. This function does not cause evaluation of the source,
     * but this also means the returned value only reflects the underlying
     * data, not the evaluated data.
     * @memberOf monads.list_core
     * @instance
     * @function toString
     * @return {string} - a
     */
    toString: function _toString() {
        //console.log(this.value);
        //console.log(list_core.isPrototypeOf(this.value), this.value.toString(), this.value);

        /*if (list_core.isPrototypeOf(this.value) || (Array.isArray(this.value) && this.value.length === 5)) {
            console.log(list_core.isPrototypeOf(this.value));
            console.log(this);
            console.log(this.value);

            if (list_core.isPrototypeOf(this.value)) {
                console.log(this.value.toString());
            }
        }*/
        var val = list_core.isPrototypeOf(this.value) ? this.value.toString() : this.value;
        return `List(${val})`;
        //return list_core.isPrototypeOf(this.value) ? this.value.toString() : `List(${this.value})`;
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function valueOf
     * @return {*} - a
     */
    valueOf: function _valueOf() {
        return this.value;
    },

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function factory
     * @return {monads.list_core} - a
     */
    factory: List,

    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function of
     * @param {*} xs - a
     * @param {generator} [iterator] - b
     * @param {Array} [sortObj] - c
     * @param {string} [key] - d
     * @return {monads.list_core} - e
     */
    of: function _of(xs, iterator, sortObj, key) {
        return createListDelegateInstance(xs, iterator, sortObj, key);
    },

    /**
     * @signature
     * @description Base iterator to which all queryable_core delegator objects
     * delegate to for iteration if for some reason an iterator wasn't
     * objectSet on the delegator at the time of creation.
     * @memberOf monads.list_core
     * @instance
     * @generator
     * @return {Array} - a
     */
    [Symbol.iterator]: function *_iterator() {
        var data = Array.from(this.value);
        for (let item of data) {
            yield item;
        }
    },
    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function chain
     * @param {function} fn - a
     * @return {monads.list} - b
     */
    chain: function _chain(fn) {
        return this.of(chain(this, fn));
    },
    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function mjoin
     * @return {monads.list} - a
     */
    mjoin: function _mjoin() {
        return this.value;
    },
    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function sequence
     * @param {Object} p - a
     * @return {monads.list} - b
     */
    sequence: function _sequence(p) {
        return this.traverse(p, identity);
    },
    /**
     * @signature
     * @description d
     * @memberOf monads.list_core
     * @instance
     * @function traverse
     * @param {function} fa - a
     * @param {function} fn - b
     * @return {monads.list} - c
     */
    traverse: function _traverse(fa, fn) {
        return this.value.reduce(function _reduce(xs, x) {
            fn(x).map(x => y => y.concat([x])).apply(xs);
        }, fa.of(List.of()));

        /*
        return this.fold(function _reductioAdAbsurdum(xs, x) {
            fn(x).map(function _map(x) {
                return function _map_(y) {
                    return y.concat([x]);
                };
            }).ap(xs);
            return fa(this.empty);
        });*/

        //TODO: this exists inside the traverse function. Function should take a typeRep + fn
        /*
         var xs = this;
         function go(idx, n) {
             switch (n) {
                 case 0: return of(typeRep, []);
                 case 2: return lift2(pair, f(xs[idx]), f(xs[idx + 1]));
                 default:
                     var m = Math.floor(n / 4) * 2;
                     return lift2(concat_, go(idx, m), go(idx + m, n - m));
            }
         }
         return this.length % 2 === 1 ?
             lift2(concat_, map(Array$of, f(this[0])), go(1, this.length - 1)) :
             go(0, this.length);
         */
    },
    /**
     * @signature
     * @description Applies a function contained in another functor to the source
     * of this List object instance's underlying source. A new List object instance
     * is returned.
     * @memberOf monads.list_core
     * @instance
     * @function apply
     * @param {Object} ma - a
     * @return {monads.list} - b
     */
    apply: function _apply(ma) {
        return this.map(ma.value);
    }
};

/**
 * @signature
 * @description Alias for {@link monads.list_core#concat}
 * @memberOf monads.list_core
 * @instance
 * @function append
 * @see monads.list_core#concat
 * @param {Array | *} ys - a
 * @return {monads.list_core} - b
 */
list_core.append = list_core.concat;

/**
 * @signature Object -> Object
 * @description Alias for {@link monads.list_core#apply}
 * @memberOf monads.list_core
 * @instance
 * @function ap
 * @see monads.list_core#apply
 * @param {Object} ma - Any object with a map function - i.e. a monad.
 * @return {Object} Returns an instance of the monad object provide as an argument.
 */
list_core.ap = list_core.apply;

/**
 * @signature
 * @description Alias for {@link monads.list_core#chain}
 * @memberOf monads.list_core
 * @instance
 * @function fmap
 * @param {function} fn - a
 * @return {monads.list} - b
 */
list_core.fmap = list_core.chain;

/**
 * @signature
 * @description Alias for {@link monads.list_core#chain}
 * @memberOf monads.list_core
 * @instance
 * @function fmap
 * @param {function} fn - a
 * @return {monads.list} - b
 */
list_core.flapMap = list_core.chain;

/**
 * @signature
 * @description Alias for {@link monads.list_core#chain}
 * @memberOf monads.list_core
 * @instance
 * @function bind
 * @property {function} fn
 * @return {monads.list_core} - Returns a new list monad
 */
list_core.bind = list_core.chain;

/**
 * @delegate
 * @delegator {@link monads.list_core}
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the list_core object, also exposes .orderBy and .orderByDescending
 * functions. These functions allow a consumer to sort a List's data by
 * a given key.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
 * @kind {Object}
 * @memberOf monads
 * @namespace list
 */
var list = Object.create(list_core, {
    /**
     * @signature
     * @description d
     * @memberOf monads.list
     * @instance
     * @function sortBy
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list} - c
     */
    sortBy: {
        value: function _orderBy(keySelector, comparer = defaultPredicate) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending }];
            return this.of(this, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @signature
     * @description d
     * @memberOf monads.list
     * @instance
     * @function sortByDescending
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list} - c
     */
    sortByDescending: {
        value: function _orderByDescending(keySelector, comparer = defaultPredicate) {
            var sortObj = [{ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending }];
            return this.of(this, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @signature
     * @description d
     * @memberOf monads.list
     * @instance
     * @function contains
     * @param {*} val - a
     * @param {function} comparer - b
     * @return {boolean} - c
     */
    contains: {
        value: function _contains(val, comparer) {
            return contains(this, val, comparer);
        }
    }
});

/**
 * @description: A list_core delegator object that, in addition to the delegatable functionality
 * it has from the queryable_core object, also exposes .thenBy and .thenByDescending
 * functions. These functions allow a consumer to sort more on than a single column.
 * @typedef {Object}
 * @property {function} sortBy
 * @property {function} sortByDescending
 * @property {function} contains
 * @memberOf monads
 * @namespace ordered_list
 */
var ordered_list = Object.create(list_core, {
    _appliedSorts: {
        value: []
    },
    //In these two functions, feeding the call to "orderBy" with the .value property of the List delegate
    //rather than the delegate itself, effectively excludes the previous call to the orderBy/orderByDescending
    //since the iterator exists on the delegate, not on its value. Each subsequent call to thenBy/thenByDescending
    //will continue to exclude the previous call's iterator... effectively what we're doing is ignoring all the
    //prior calls made to orderBy/orderByDescending/thenBy/thenByDescending and calling it once but with an array
    //of the the requested sorts.
    /**
     * @signature
     * @description d
     * @memberOf monads.ordered_list
     * @instance
     * @function thenBy
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list} - c
     */
    thenBy: {
        value: function _thenBy(keySelector, comparer = defaultPredicate) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: sortDirection.ascending });
            return this.of(this.value, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @signature
     * @description d
     * @memberOf monads.ordered_list
     * @instance
     * @function thenByDescending
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @return {ordered_list} - c
     */
    thenByDescending: {
        value: function thenByDescending(keySelector, comparer = defaultPredicate) {
            var sortObj = this._appliedSorts.concat({ keySelector: keySelector, comparer: comparer, direction: sortDirection.descending });
            return this.of(this.value, sortBy(this, sortObj), sortObj);
        }
    },
    /**
     * @signature
     * @description Performs the same functionality as list_core#contains, but utilizes
     * a binary searching algorithm rather than a sequential search. If this function is called
     * an a non-ordered List, it will internally delegate to list_core#contains instead. This
     * function should not be called on a sorted List for look for a value that is not the
     * primary field on which the List's data is sorted on as an incorrect result will likely
     * be returned.
     * @memberOf monads.ordered_list
     * @instance
     * @function contains
     * @param {*} val - The value that should be searched for
     * @param {function} comparer - The function used to compare values in the List to
     * the 'val' parameter
     * @return {boolean} - Returns true if the List contains the searched for value, false
     * otherwise.
     */
    contains: {
        value: function _contains(val, comparer) {
            return binarySearch(when(not(isArray), Array.from, this.value), val, comparer);
        }
    }
});

/**
 * @signature
 * @description Creates a new list object delegate instance; list type is determined by
 * the parameters passed to the function. If only the 'source' parameter is provided, a
 * 'basic' list delegate object instance is created. If the source and iterator parameters
 * are passed as arguments, a 'basic' list delegate object instance is created and the
 * iterator provided is used as the new instance object's iterator rather than the default
 * list iterator. If the source, iterator, and sortObj parameters are passed as arguments,
 * an ordered_list delegate object instance is created. The provided iterator is set on
 * the instance object to be used in lieu of the default iterator and the ._appliedSorts
 * field is set as the 'sortObj' parameter. If all four of the function's arguments are
 * provided (source, iterator, sortObj, and key), then a list delegate object instance
 * is created, setting the iterator for the object instance as the provided iterator, the
 * ._appliedSorts field as the sortObj argument, and the ._key field as the 'key' parameter's
 * value.
 *
 * The switch case inside the function only handles a subset of the possible bit flag values.
 * Technically there could be as many as eight different scenarios to check, not including the
 * default case. However, in practice, the only values received from the 'createBitMask' function
 * will be odd. Thus, only odd values (plus the default case which covers a value of zero) need
 * to be handled. A case of zero arises when only the 'source' argument is provided.
 *
 * @private
 * @param {*} source - The value to be used as the underlying source of the list functor; may be
 * anything javascript object that has an iterator.
 * @param {generator} iterator - A generator function that is to be used on the new list delegate
 * object instance's iterator.
 * @param {Array} sortObj - An array of the sort(s) (field and direction} to be used when the
 * instance is evaluated.
 * @param {string} key - A string that denotes what value the new list delegate object instance
 * was grouped on.
 * @return {list_core}
 */
var createListDelegateInstance = createListCreator(list, ordered_list, list);

/**
 * @signature
 * @description d
 * @private
 * @param {*} [source] - a
 * @return {monads.list} - b
 */
var listFromNonGen = source => createListDelegateInstance(source && source[Symbol.iterator] ? source : wrap(source));

/**
 * @signature
 * @description d
 * @private
 * @param {generator} source - a
 * @return {monads.list} - b
 */
var listFromGen = source => createListDelegateInstance(invoke(source));

/**
 * @signature
 * @factory List
 * @description Creator function for a new List object. Takes any value/type as a parameter
 * and, if it has an iterator defined, with set it as the underlying source of the List as is,
 * or, wrap the item in an array if there is no defined iterator.
 * @namespace List
 * @memberOf monads
 * @property {function} from {@link monads.List#from}
 * @property {function} of {@link monads.List#of}
 * @property {function} ordered {@link monads.List#ordered}
 * @property {function} empty {@link monads.List#empty}
 * @property {function} just {@link monads.List#just}
 * @property {function} unfold {@link monads.List#unfold}
 * @property {function} is {@link monads.List#is}
 * @property {function} repeat {@link monads.List#repeat}
 * @property {function} extend {@link monads.List#extend}
 * @param {*} [source] - Any type, any value; used as the underlying source of the List
 * @return {monads.list} - A new List instance with the value provided as the underlying source.
 */
//TODO: should I exclude strings from being used as a source directly, or allow it because
//TODO: they have an iterator?
function List(source) {
    return ifElse(delegatesFrom(generatorProto), listFromGen, listFromNonGen, source);
}

/**
 * @signature
 * @description Convenience function for listCreate a new List instance; internally calls List.
 * @memberOf monads.List
 * @static
 * @function from
 * @see List
 * @param {*} [source] - Any type, any value; used as the underlying source of the List
 * @return {monads.list} - A new List instance with the value provided as the underlying source.
 */
List.from = source => List(source);

/**
 * @signature
 * @description Alias for List.from
 * @memberOf monads.List
 * @static
 * @function of
 * @see List.from
 * @param {*}
 * @return {list} - a
 */
List.of = List.from;

//TODO: implement this so that a consumer can initiate a List as ordered
/**
 * @signature
 * @description Creates a new {@link monads.ordered_list} for the source provided. An optional
 * source selector and comparer functions may be provided.
 * @memberOf monads.List
 * @static
 * @function ordered
 * @param {*} [source] - Any JavaScript value
 * @param {function} [selector] - A function that selects either a subset of each value in the list, or can
 * act as the 'identity' function and just return the entire value.
 * @param {function} [comparer] - A function that knows how to compare the type of values the selector function
 * 'pulls' out of the list.
 * @return {monads.ordered_list} Returns a new list monad
 */
List.ordered = (source, selector, comparer = defaultPredicate) => createListDelegateInstance(source, null,
    [{ keySelector: selector, comparer: comparer, direction: sortDirection.ascending }]);

/**
 * @signature
 * @description Creates and returns a new {@link monads.ordered_list} since an empty list is trivially
 * ordered.
 * @memberOf monads.List
 * @static
 * @function empty
 * @see List
 * @return {monads.ordered_list} - a
 */
List.empty = () => createListDelegateInstance([], null,
    [{ keySelector: identity, comparer: defaultPredicate, direction: sortDirection.ascending }]);

/**
 * @signature
 * @description Creates and returns a new {@link monads.ordered_list} since a list with a single
 * item is trivially ordered.
 * @memberOf monads.List
 * @static
 * @function just
 * @see List
 * @param {*} val - a
 * @return {monads.ordered_list} - b
 */
List.just = val => createListDelegateInstance([val], null,
    [{ keySelector: identity, comparer: defaultPredicate, direction: sortDirection.ascending }]);

/**
 * @signature
 * @description Takes a function and a seed value. The function is used to 'unfold' the seed value
 * into an array which is used as the source of a new List monad.
 * @memberOf monads.List
 * @static
 * @function unfold
 * @see List
 * @param {function|generator} fn - a
 * @param {*} seed - b
 * @return {monads.list} - c
 */
List.unfold = (fn, seed) => createListDelegateInstance(unfold(fn)(seed));

/**
 * @signature
 * @description Takes any value as an argument and returns a boolean indicating if
 * the value is a list.
 * @memberOf monads.List
 * @static
 * @function is
 * @see List
 * @param {*} f - Any JavaScript value
 * @return {boolean} - Returns a boolean indicating of the value is a list.
 */
List.is = f => list_core.isPrototypeOf(f);

/**
 * @signature
 * @description Generates a new list with the specified item repeated the specified number of times. Because
 * this generates a list with the same item repeated n times, the resulting List is trivially
 * sorted. Thus, a sorted List is returned rather than an unsorted list.
 * @memberOf monads.List
 * @static
 * @function repeat
 * @see List
 * @param {*} item - Any JavaScript value that should be used to build a new list monad.
 * @param {number} count - The number of times the value should be repeated to build the list.
 * @return {monads.ordered_list} - Returns a new ordered list monad.
 */
List.repeat = function _repeat(item, count) {
    return createListDelegateInstance([], repeat(item, count), [{ keySelector: noop, comparer: noop, direction: sortDirection.descending }]);
};

/**
 * @signature
 * @summary Extension function that allows new functionality to be applied to
 * the queryable object
 * @memberOf monads.List
 * @static
 * @function extend
 * @see List
 * @param {string} prop - The name of the new property that should exist on the List; must be unique
 * @param {function} fn - A function that defines the new List functionality and
 * will be called when this new List property is invoked.
 * @return {monads.List} - a
 *
 * @description The fn parameter must be a non-generator function that takes one or more
 * arguments. If this new List function should be an immediately evaluated
 * function (like: foldl, any, reverse, etc.), it merely needs the accept one or more
 * arguments and know how to iterate the source. In the case of an immediately evaluated
 * function, the return type can be any javascript type. The first argument is always the
 * previous List instance that must be iterated. Additional arguments may be specified
 * if desired.
 *
 * If the function's evaluation should be deferred it needs to work a bit differently.
 * In this case, the function should accept one or more arguments, the first and only
 * required argument being the underlying source of the List object. This underlying
 * source can be anything with an iterator (generator, array, map, set, another list, etc.).
 * Any additional arguments that the function needs should be specified in the signature.
 * The return value of the function should be a generator that knows how to iterate the
 * underlying source. If the generator should operate like most List functions, i.e.
 * take a single item, process it, and then yield it out before asking for the next, a
 * for-of loop is the preferred method for employment. However, if the generator needs
 * all of the underlying data upfront (like orderBy and groupBy), Array.from is the
 * preferred method. Array.from will 'force' all the underlying List instances
 * to evaluate their data before it is handed over in full to the generator. The generator
 * can then act with full knowledge of the data and perform whatever operation is needed
 * before ultimately yielding out a single item at a time. If your extension function
 * needs to yield out all items at once, then that function is not a lazy evaluation
 * function and should be constructed like the immediately evaluated functions described
 * above.
 */
List.extend = listExtensionHelper(List, list_core, createListDelegateInstance, list, ordered_list);

function createGroupedListDelegate(source, key) {
    return createListDelegateInstance(source, undefined, undefined, key);
}

//Since FantasyLand is the defacto standard for JavaScript algebraic data structures, and I want to maintain
//compliance with the standard, a .constructor property must be on the container delegators. In this case, its
//just an alias for the true .factory property, which points to the delegator factory. I am isolating this from
//the actual delegator itself as it encourages poor JavaScript development patterns and ... the myth of Javascript
//classes and inheritance. I do not recommend using the .constructor property at all since that just encourages
//FantasyLand and others to continue either not learning how JavaScript actually works, or refusing to use it
//as it was intended... you know, like Douglas Crockford and his "good parts", which is really just another
//way of saying: "your too dumb to understand how JavaScript works, and I either don't know myself, or don't
//care to know, so just stick with what I tell you to use."
list_core.constructor = list_core.factory;
list_core.fold = list_core.foldl;
list_core.reduce = list_core.foldl;

/**
 * @signature
 * @description Since the constant functor does not represent a disjunction, the List's
 * bimap function property behaves just as its map function property. It is merely here as a
 * convenience so that swapping out monads/monads does not break an application that is
 * relying on its existence.
 * @memberOf monads.list_core
 * @instance
 * @function bimap
 * @param {function} f - a
 * @param {function} g - b
 * @return {monads.list} - c
 */
list_core.bimap = list_core.map;

export { List, list_core, list, ordered_list };