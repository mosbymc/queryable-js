import { observable } from '../../../src/streams/observable';

describe('Test streams', function _testStreams() {
    /*it('should eventually increment the count', function _testAllOperators(done) {
        var count = 0,
            list = [2, 4, 6, 8, 10],
            o = observable.fromList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        o.map(x => x * 2)
            .chain(x => observable.fromList([x * 3]))
            .filter(x => 10 < x)
            .itemBuffer(5)
            .merge(observable.fromList(list), observable.fromList(list))
            .subscribe(function _next(x) {
                count += x;
            }, console.error,
            function complete() {
                count.should.eql(60);
                done();
            });
    });*/

    it('should group the results', function _testGroupBy(done) {
        var res = [],
            o = observable.fromList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
                .groupBy(function _selector(val) {
                    return 6 > val;
                }, function _comparer(x, y) {
                    return x === y;
                }, 5);

        o.subscribe(function _next(val) {
            res = res.concat(val);
        }, function _error(err) {
            console.log(err);
        }, function _complete() {
            res.should.have.lengthOf(2);
            res[0].key.should.be.true;
            res[1].key.should.be.false;
            done();
        });
    });

    /*it('should allow an interval to fire until completion', function _testFromInterval(done) {
        function interval(cb) {
            var idx = 0;
            return setInterval(function _setInterval() {
                cb(++idx);
            }, 10);
        }

        var count = 0,
            o = observable.fromInterval(interval)
                .debounce(5)
                .timeBuffer(10)
                .itemBuffer(5);

        var s = o.subscribe(function _next(num_nums) {
            num_nums.forEach(function _forEach(nums) {
                nums.forEach(num => count += num);
            });
            if (45 <= count) s.unsubscribe();
        }, console.error,
        function _complete() {
            count.should.be.at.least(45);
            done();
        });
    });

    it('should take the alternate path when mapping twice', function _testObservableMap(done) {
        var count = 0,
            o = observable.fromList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        o.map(x => x * 2)
            .map(x => x)
            .map(x => x)
            .subscribe(function _next(x) {
                count += x;
            }, function _error(x) {
                console.log(x);
            }, function complete() {
                count.should.eql(110);
                done();
            });
    });

    it('should take the alternate path when filtering twice', function _testObservableFilter(done) {
        var count = 0,
            o = observable.fromList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        o.map(x => x * 2)
            .filter(x => 0 < x)
            .filter(x => 0 < x)
            .subscribe(function _next(x) {
                count += x;
            }, function _error(x) {
                console.log(x);
            }, function complete() {
                count.should.eql(110);
                done();
            });
    });

    /*
    it('should invoke the error handler when an exception is thrown on the chain operation', function _testObservableChainError(done) {
        var count = 0,
            o = observable.fromList([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

        o.map(x => x * 2)
            .chain(function _chainThrow() {
                throw Error("Chain test exception!");
            })
            .subscribe(function _next(x) {
                count += x;
            }, function _error(x) {
                count.should.eql(0);
                done();
            }, function complete() {
                count.should.eql(40);
            });
    });
    */
});