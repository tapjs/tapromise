# tapromise

Turn any tap Test object into a promise-resolving thingie

If you're using [tap](http://npm.im/tap) for tests, and those test
interact with a lot of Promises, sometimes it's nice to be able to do
asserts against those objects by resolving them first.

This will work just fine with any version of [tap](http://npm.im/tap)
or [tape](http://npm.im/tape).

However, tap version 5.5 or greater is strongly recommended because:

1. You don't have to `.then(function() { t.end() })` if you return a
   promise from a `tap` test function, because it groks promises as
   return values.
2. The `at` and `stack` fields will be set in a useful way in tap 5.5
   and higher, so that failures will point at the proper line in your
   test script, rather than in some obscure place inside this module.

Use it like so:

```javascript
var tapromise = require('tapromise')
var t = require('tap')

t.test('whoa lotta promises!', function (t) {
  t = tapromise(t)
  return Promise.all([
    t.equal(promiseToBeTen(), 10),
    t.ok(Promise.resolve(true)),
    t.match(Promise.resolve({ a: 1 }), { a: 1 })
  ])
})
```

This has the following effects:

1. A `tapromise` object has all the same assert methods as the `Test`
   object passed to it.
2. Every assert method on the `tapromise` object resolves all Promises
   passed to it, and returns a Promise.
3. When all the promises resolve, it runs the assert on the data.

So, the above code would be equivalent to:

```javascript
var t = require('tap')

t.test('whoa lotta promises!', function (t) {
  return promiseToBeTen().then(function (ten) {
    t.equal(ten, 10)
    return Promise.resolve(true)
  }).then(function (shouldBeTrue) {
    t.ok(shouldBeTrue)
    return Promise.resolve({ a: 1 })
  }).then(function (obj) {
    t.match(obj, { a: 1 })
  })
})
```

This reduces a lot of the Promise boilerplate.  If you are testing an
API that uses Promises extensively to return data (for example,
Selenium), then this can be very convenient.

Note that this means you can't ever test that an object *is* a
Promise, since the tapromise object will resolve everything it
receives.

## API

* `tapromise(test)` Returns a `tapromise` object with
  methods corresponding to all methods on the `tap.Test` argument that
  accept Promises as args and returns a Promise that resolves when the
  assert has been made.
