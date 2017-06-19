import { Constant, constant_monad } from './constant_monad';
import { Either, Left, Right, either_monad } from './either_monad';
import { Future, future_monad } from './future_monad';
import { Identity, identity_monad } from './identity_monad';
import { Io, io_monad } from './io_monad';
import { List, list_monad, ordered_list_monad } from './list_monad';
import { Maybe, maybe_monad } from './maybe_monad';
import { Validation, validation_monad } from './validation_monad';

import { toFunctorType, containerIterator } from '../../containerHelpers';


/*
    - Semigroup:
        > a.concat(b).concat(c) is equivalent to a.concat(b.concat(c)) (associativity)

    - Monoid:
        > A value that implements the Monoid specification must also implement the Semigroup specification.
        > m.concat(M.empty()) is equivalent to m (right identity)
        > M.empty().concat(m) is equivalent to m (left identity)

    - Functor:
        > u.map(a => a) is equivalent to u (identity)
        > u.map(x => f(g(x))) is equivalent to u.map(g).map(f) (composition)

    - Apply:
        > A value that implements the Apply specification must also implement the Functor specification.
        > v.ap(u.ap(a.map(f => g => x => f(g(x))))) is equivalent to v.ap(u).ap(a) (composition)

    - Applicative:
        > A value that implements the Applicative specification must also implement the Apply specification.
        > v.ap(A.of(x => x)) is equivalent to v (identity)
        > A.of(x).ap(A.of(f)) is equivalent to A.of(f(x)) (homomorphism)
        > A.of(y).ap(u) is equivalent to u.ap(A.of(f => f(y))) (interchange)

    - Foldable:
        > u.reduce is equivalent to u.reduce((acc, x) => acc.concat([x]), []).reduce

    - Traversable:
        > A value that implements the Traversable specification must also implement the Functor and Foldable specifications.
        > t(u.traverse(F, x => x)) is equivalent to u.traverse(G, t) for any t such that t(a).map(f) is equivalent to t(a.map(f)) (naturality)
        > u.traverse(F, F.of) is equivalent to F.of(u) for any Applicative F (identity)
        > u.traverse(Compose, x => new Compose(x)) === new Compose(u.traverse(F, x => x).map(x => x.traverse(G, x => x)))
                for Compose defined below and any Applicatives F and G (composition)

    - Chain:
        > A value that implements the Chain specification must also implement the Apply specification.
        > m.chain(f).chain(g) is equivalent to m.chain(x => f(x).chain(g)) (associativity)

    - ChainRec:
        > A value that implements the ChainRec specification must also implement the Chain specification.
        > M.chainRec((next, done, v) => p(v) ? d(v).map(done) : n(v).map(next), i) is equivalent to (function step(v) { return p(v) ? d(v) : n(v).chain(step); }(i)) (equivalence)
        > Stack usage of M.chainRec(f, i) must be at most a constant multiple of the stack usage of f itself.

    - Monad:
        > A value that implements the Monad specification must also implement the Applicative and Chain specifications.
        > M.of(a).chain(f) is equivalent to f(a) (left identity)
        > m.chain(M.of) is equivalent to m (right identity)

    - Extend:
        > A value that implements the Extend specification must also implement the Functor specification.
        > w.extend(g).extend(f) is equivalent to w.extend(_w => f(_w.extend(g)))

    - Comonad:
        > A value that implements the Comonad specification must also implement the Extend specification.
        > w.extend(_w => _w.extract()) is equivalent to w (left identity)
        > w.extend(f).extract() is equivalent to f(w) (right identity)

    - Bifunctor:
        > A value that implements the Bifunctor specification must also implement the Functor specification.
        > p.bimap(a => a, b => b) is equivalent to p (identity)
        > p.bimap(a => f(g(a)), b => h(i(b)) is equivalent to p.bimap(g, i).bimap(f, h) (composition)

    - Profunctor:
        > A value that implements the Profunctor specification must also implement the Functor specification.
        > p.promap(a => a, b => b) is equivalent to p (identity)
        > p.promap(a => f(g(a)), b => h(i(b))) is equivalent to p.promap(f, i).promap(g, h) (composition)
 */

var mapToConstant = toFunctorType(Constant),
    mapToEither = toFunctorType(Either),
    mapToFuture = toFunctorType(Future),
    mapToIdentity = toFunctorType(Identity),
    mapToIo = toFunctorType(Io),
    mapToLeft = toFunctorType(Left),
    mapToList = toFunctorType(List),
    mapToMaybe = toFunctorType(Maybe),
    mapToRight = toFunctorType(Right),
    mapToValidation = toFunctorType(Validation);

constant_monad.mapToEither = mapToEither;
constant_monad.mapToFuture = mapToFuture;
constant_monad.mapToIdentity = mapToIdentity;
constant_monad.mapToIo = mapToIo;
constant_monad.mapToLeft = mapToLeft;
constant_monad.mapToList = mapToList;
constant_monad.mapToMaybe = mapToMaybe;
constant_monad.mapToRight = mapToRight;
constant_monad.mapToValidation = mapToValidation;
constant_monad[Symbol.iterator] = containerIterator;

either_monad.mapToConstant = mapToConstant;
either_monad.mapToFuture = mapToFuture;
either_monad.mapToIdentity = mapToIdentity;
either_monad.mapToIo = mapToIo;
either_monad.mapToList = mapToList;
either_monad.mapToMaybe = mapToMaybe;
either_monad.mapToValidation = mapToValidation;
either_monad[Symbol.iterator] = containerIterator;

future_monad.mapToConstant = mapToConstant;
future_monad.mapToEither = mapToEither;
future_monad.mapToIdentity = mapToIdentity;
future_monad.mapToIo = mapToIo;
future_monad.mapToLeft = mapToLeft;
future_monad.mapToList = mapToList;
future_monad.mapToMaybe = mapToMaybe;
future_monad.mapToRight = mapToRight;
future_monad.mapToValidation = mapToValidation;
future_monad[Symbol.iterator] = containerIterator;

identity_monad.mapToConstant = mapToConstant;
identity_monad.mapToEither = mapToEither;
identity_monad.mapToFuture = mapToFuture;
identity_monad.mapToIo = mapToIo;
identity_monad.mapToLeft = mapToLeft;
identity_monad.mapToList = mapToList;
identity_monad.mapToMaybe = mapToMaybe;
identity_monad.mapToRight = mapToRight;
identity_monad.mapToValidation = mapToValidation;
identity_monad[Symbol.iterator] = containerIterator;

io_monad.mapToConstant = mapToConstant;
io_monad.mapToEither = mapToEither;
io_monad.mapToFuture = mapToFuture;
io_monad.mapToIdentity = mapToIdentity;
io_monad.mapToLeft = mapToLeft;
io_monad.mapToList = mapToList;
io_monad.mapToMaybe = mapToMaybe;
io_monad.mapToRight = mapToRight;
io_monad.mapToValidation = mapToValidation;
io_monad[Symbol.iterator] = containerIterator;

list_monad.mapToConstant = mapToConstant;
list_monad.mapToEither = mapToEither;
list_monad.mapToFuture = mapToFuture;
list_monad.mapToIdentity = mapToIdentity;
list_monad.mapToIo = mapToIo;
list_monad.mapToLeft = mapToLeft;
list_monad.mapToMaybe = mapToMaybe;
list_monad.mapToRight = mapToRight;
list_monad.mapToValidation = mapToValidation;

ordered_list_monad.mapToConstant = mapToConstant;
ordered_list_monad.mapToEither = mapToEither;
ordered_list_monad.mapToFuture = mapToFuture;
ordered_list_monad.mapToIdentity = mapToIdentity;
ordered_list_monad.mapToIo = mapToIo;
ordered_list_monad.mapToLeft = mapToLeft;
ordered_list_monad.mapToMaybe = mapToMaybe;
ordered_list_monad.mapToRight = mapToRight;
ordered_list_monad.mapToValidation = mapToValidation;

maybe_monad.mapToConstant = mapToConstant;
maybe_monad.mapToEither = mapToEither;
maybe_monad.mapToFuture = mapToFuture;
maybe_monad.mapToIdentity = mapToIdentity;
maybe_monad.mapToIo = mapToIo;
maybe_monad.mapToLeft = mapToLeft;
maybe_monad.mapToList = mapToList;
maybe_monad.mapToRight = mapToRight;
maybe_monad.mapToValidation = mapToValidation;
maybe_monad[Symbol.iterator] = containerIterator;

validation_monad.mapToConstant = mapToConstant;
validation_monad.mapToEither = mapToEither;
validation_monad.mapToFuture = mapToFuture;
validation_monad.mapToIdentity = mapToIdentity;
validation_monad.mapToIo = mapToIo;
validation_monad.mapToLeft = mapToLeft;
validation_monad.mapToList = mapToList;
validation_monad.mapToMaybe = mapToMaybe;
validation_monad.mapToRight = mapToRight;
validation_monad[Symbol.iterator] = containerIterator;

var monads = {
    Constant,
    Either,
    Future,
    Identity,
    Io,
    Left,
    List,
    Maybe,
    Right,
    Validation
};

export { monads };