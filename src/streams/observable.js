import { observableStatus } from '../helpers';
import { subscriber } from './subscribers/subscriber';
import { debounceOperator, distinctOperator, chainOperator, filterOperator, groupByOperator, itemBufferOperator, mapOperator,
    mergeOperator, timeBufferOperator, zipOperator } from './streamOperators/operators';
import { generatorProto } from '../helpers';
import { wrap, noop, delegatesTo } from '../functionalHelpers';
import { compose, all, identity } from '../combinators';

//TODO: I thinking about implementing an 'observable watcher' functionality. the concept would be
//TODO: that you have an observable that is registered to watch one or more other observables. When
//TODO: the complete or error, the watcher will be notified in its .next handler. To do this, I'd
//TODO: need to assign each observable a unique id, and allow an observable watching to register a
//TODO: unique handler per watched observable if so desired.
var observable = {
    get source() {
        return this._source;
    },
    set source(src) {
        this._source = src;
    },
    get operator() {
        return this._operator;
    },
    set operator(op) {
        this._operator = op;
    },
    setSource: function _setSource(src) {
        this.source = src;
        return this;
    },
    setOperator: function _setOperator(op) {
        this.operator = op;
        return this;
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @return {observable} - b
     */
    map: function _map(fn) {
        return this.lift(Object.create(mapOperator).init(fn));
        /*
        if (delegatesTo(this.operator, mapOperator))
            return this.lift.call(this.source, Object.create(mapOperator).init(compose(fn, this.operator.transform)));
        return op.call(this, mapOperator, fn);
        */
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @return {observable} - b
     */
    chain: function _deepMap(fn) {
        return this.lift(Object.create(chainOperator).init(fn));
        //return op.call(this, chainOperator, fn);
    },
    /**
     * @signature
     * @description d
     * @param {function} comparer - A function used to compare values passed to the observable
     * for distinctness. Defaults to 'strict equality' if no comparer is provided.
     * @return {observable} Returns an observable
     */
    distinct: function _distinct(comparer) {
        return this.lift(Object.create(distinctOperator).init(comparer));
    },
    /**
     * @sig
     * @description d
     * @param {function} predicate - a
     * @return {observable} - b
     */
    filter: function _filter(predicate) {
        return this.lift(Object.create(filterOperator).init(predicate));
        /*
        if (delegatesTo(this.operator, filterOperator))
            return this.lift.call(this.source, Object.create(filterOperator).init(all(predicate, this.operator.predicate)));
        return op.call(this, filterOperator, predicate);
        */
    },
    /**
     * @sig
     * @description d
     * @param {function} keySelector - a
     * @param {function} comparer - b
     * @param {number} bufferAmt - c
     * @return {observable} - d
     */
    groupBy: function _groupBy(keySelector, comparer, bufferAmt = 0) {
        return this.lift(Object.create(groupByOperator).init(keySelector, comparer, bufferAmt));
    },
    /**
     * @sig
     * @description d
     * @param {Array} observables - a
     * @return {observable} - b
     */
    merge: function _merge(...observables) {
        //TODO: fix merge operator - it doesn't appear to be working as intended
        //return this.mergeMap(null, ...observables);
        var transform;
        if ('function' === typeof observables[observables.length - 1]) {
            transform = observables[observables.length - 1];
            observables = observables.slice(0, observables.length - 1);
        }
        return this.lift(Object.create(mergeOperator).init(observables, transform));
    },
    /**
     * @sig
     * @description d
     * @param {function} fn - a
     * @param {observable} observables - b
     * @return {observable} - c
     */
    mergeMap: function _mergeMap(fn, ...observables) {
        //TODO: fix merge operator - it doesn't appear to be working as intended
        fn = fn || identity;
        if (mergeOperator.isPrototypeOf(this.operator))
            return this.lift.call(this.source, Object.create(mergeOperator).init([this].concat(observables, this.operator.observables)));
        return this.lift(Object.create(mergeOperator).init([this].concat(observables), fn));

        /*
        if (delegatesTo(this.operator, mergeOperator))
            return this.lift.call(this.source, Object.create(mergeOperator).init(fn, [this].concat(observables, this.operator.observables)));
        return op.call(this, mergeOperator, fn, [this].concat(observables));
        */
    },
    /**
     * @sig
     * @description d
     * @param {Number} count - a
     * @return {observable} - b
     */
    itemBuffer: function _itemBuffer(count) {
        //return op.call(this, itemBufferOperator, count);
        return this.lift(Object.create(itemBufferOperator).init(count));
    },
    /**
     * @sig
     * @description d
     * @param {Number} amt - a
     * @return {observable} - b
     */
    timeBuffer: function _timeBuffer(amt) {
        //return op.call(this, timeBufferOperator, amt);
        return this.lift(Object.create(timeBufferOperator).init(amt));
    },
    /**
     * @sig
     * @description d
     * @param {Number} amt - a
     * @return {*|observable} - b
     */
    debounce: function _debounce(amt) {
        //return op.call(this, debounceOperator, amt);
        return this.lift(Object.create(debounceOperator).init(amt));
    },
    /**
     * @description d
     * @param {observable} observables - One or more observables to zip with the current observable
     * @param {function} [zipFunc] - An optional function that is used once all matching items from the
     * separate observables have been received. This function will be invoked with one item from each of
     * the observables - they will be passed as individual items, not an array.
     * @return {observable} Returns an observable
     */
    zip: function _zip(...observables) {
        let hasProjection = 'function' === typeof observables[observables.length - 1];
        observables = hasProjection ? observables.slice(0, observables.length - 2) : observables;
        let projection = hasProjection ? observables[observables.length - 1] : i;
        return this.lift(Object.create(zipOperator).init(observables, projection));
    },
    /**
     * @sig
     * @description d
     * @param {function} operator - a
     * @return {observable} - b
     */
    lift: function lift(operator) {
        return Object.create(observable).setSource(this).setOperator(operator);
    },
    /**
     * @sig
     * @description d
     * @param {*} src - a
     * @param {string} evt - b
     * @return {observable} - c
     */
    fromEvent: function _fromEvent(src, evt) {
        var o = Object.create(observable);
        o.source = src;
        o.event = evt;
        o.subscribe = function _subscribe(subscriber) {
            var source = this.source,
                event = this.event;

            function eventHandler(e) {
                return subscriber.next(e);
            }

            function unSub() {
                subscriber.status = observableStatus.complete;
                return source.removeEventListener(event, eventHandler);
            }
            source.addEventListener(event, eventHandler);
            subscriber.unsubscribe = unSub;
            return subscriber;
        };
        return o;
    },
    //Not actual property, just naming it this temporarily until I figure out how to make this work
    //and determine a better name for it.
    fromInterval: function _fromInterval(fn) {
        var o = Object.create(observable);
        o.subscribe = function _subscribe(subscriber) {
            var res = fn(function _cb(val) {
                return subscriber.next(val);
            });

            subscriber.unsubscribe = function _unSub() {
                subscriber.status = observableStatus.complete;
                clearInterval(res);
            };

            return subscriber;
        };

        return o;
    },
    /**
     * @sig
     * @description d
     * @param {Array} list - a
     * @param {Number} startingIdx - b
     * @return {observable} - c
     */
    fromList: function _fromList(list, startingIdx = 0) {
        var o = Object.create(observable);
        o.source = list;
        o.idx = startingIdx;
        o.subscribe = function _subscribe(sub) {
            function unSub() {
                this.status = observableStatus.complete;
            }

            var runner = (function _runner() {
                if (sub.status !== observableStatus.paused && sub.status !== observableStatus.complete &&
                    this.idx < this.source.length) {
                    Promise.resolve(this.source[this.idx++])
                        .then(function _resolve(val) {
                            sub.next(val);
                            runner();
                        });
                }
                else {
                    //var d = sub;
                    //while (d.subscriber && d.subscriber.subscriber) d = d.subscriber;
                    //if (d.unsubscribe) d.unsubscribe();
                    //else if (d.complete) d.complete();
                    //Promise.resolve(sub).then(_unsubscribe);
                    Promise.resolve(sub).then(s => _unsubscribe(sub));
                    //_unsubscribe(sub);
                    function _unsubscribe(sub) {
                        sub = sub.subscriber ? sub.subscriber : sub;
                        if (sub.subscribers && sub.subscribers.length) {
                            sub.subscribers.forEach(function _forEachSubscriber(s) {
                                _unsubscribe(s);
                            });
                        }
                        else {
                            if (sub.complete) sub.complete();
                            if (sub.unsubscribe) sub.unsubscribe();
                        }
                    }
                }
            }).bind(this);

            Promise.resolve()
                .then(function _callRunner() {
                    runner();
                });

            if (subscriber.isPrototypeOf(sub)) {
                sub.unsubscribe = unSub;
            }
            else {
                sub = {
                    next: sub,
                    error: arguments[1],
                    complete: arguments[2]
                };
            }

            return sub;

            /*
            var runner = (function _runner() {
                if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete && this.idx < this.source.length) {
                    for (let item of source) {
                        Promise.resolve(item)
                            .then(function _resolve(val) {
                                subscriber.next(val);
                                runner();
                            });
                    }
                }
                else {
                    //TODO: don't think I need to do this 'recursive' unsubscribe here since the
                    //TODO: unsubscribe function is itself recursive
                    var d = subscriber;
                    while (d.subscriber.subscriber) d = d.subscriber;
                    d.unsubscribe();
                }
            }).bind(this);

            Promise.resolve()
                .then(function _callRunner() {
                    runner();
                });
            */

            /*
            Promise.resolve()
                .then(function _callRunner() {
                    ((function _runner() {
                        if (subscriber.status !== observableStatus.paused && subscriber.status !== observableStatus.complete &&
                            this.idx < this.source.length) {
                            for (let item of source) {
                                Promise.resolve(item)
                                    .then(function _resolve(val) {
                                        subscriber.next(val);
                                        _runner();
                                    });
                            }
                        }
                        else {
                            //TODO: don't think I need to do this 'recursive' unsubscribe here since the
                            //TODO: unsubscribe function is itself recursive
                            var d = subscriber;
                            while (d.subscriber.subscriber) d = d.subscriber;
                            d.unsubscribe();
                        }
                    }).bind(this))();
                });
            */

            //subscriber.unsubscribe = unSub;
            //return subscriber;
        };
        return o;
    },
    fromArray: function _fromArray(arr, startingIdx = 0) {

    },
    /**
     * @sig
     * @description Creates a new observable from a generator function
     * @param {*} src - a
     * @return {observable} - b
     */
    fromGenerator: function _fromGenerator(src) {
        var o = Object.create(observable);
        o.source = src;
        o.subscribe = function _subscribe(subscriber_next, error, complete) {
            var it = this.source();
            ((function _runner() {
                if ('object' !== typeof subscriber_next || (subscriber_next.status !== observableStatus.paused && subscriber_next.status !== observableStatus.complete)) {
                    Promise.resolve(it.next())
                        .then(function _then(val) {
                            if (!val.done) {
                                if ('function' === typeof subscriber_next) subscriber_next(val.value);
                                else subscriber_next.next(val.value);
                                _runner();
                            }
                        });
                }
                else if ('function' !== typeof subscriber_next) {
                    this.unsubscribe();
                }
                else complete();
            }).bind(this))();
        };
        return o;
    },
    /**
     * @sig
     * @description d
     * @param {*} src - a
     * @return {observable} - Returns a new observable
     */
    from: function _from(src) {
        if (generatorProto.isPrototypeOf(src)) return this.fromGenerator(src);
        return this.fromList(src[Symbol.iterator] ? src : wrap(src));
    },
    /**
     * @sig
     * @description Creates a new subscriber for this observable. Takes three function handlers;
     * a 'next' handler that receives each item after having passed through the lower
     * level subscribers, an 'error' handler that is called if an exception is thrown
     * while the stream is active, and a complete handler that is called whenever the
     * stream is done.
     * @param {function} next - A function handler
     * @param {function} error - A function handler
     * @param {function} complete - A function handler
     * @return {subscriber} - a
     */
    subscribe: function _subscribe(next, error, complete) {
        var s = Object.create(subscriber).initialize(next, error, complete);
        if (this.operator) this.operator.subscribe(s, this.source);
        return s;
    },
    /**
     * @sig
     * @description d
     * @param {function} next - a
     * @return {*} - b
     */
    onValue: function _onValue(next) {
        var s = Object.create(subscriber).initialize(next, noop, noop);
        if (this.operator) this.operator.subscriber(s, this.source);
        return s;
    }
};

function op(operator, ...args) {
    return this.lift(Object.create(operator).init(...args));
}

export { observable };