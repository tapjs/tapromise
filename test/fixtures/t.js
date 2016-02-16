var t = require('tap')
var tapromise = require('../..')

function promiseToBeTen () {
  return Promise.resolve(10)
}

t.test('promises with tapromise', function (t) {
  t = tapromise(t)
  return Promise.all([
    t.equal(promiseToBeTen(), 10),
    t.ok(Promise.resolve(true)),
    t.match(Promise.resolve({ a: 1 }), { a: 1 }),
    t.isa(Promise.resolve('foo'), Number),
    t.isa(Promise.resolve('bar'), 'string'),
    t.match(Promise.reject(new Error('oops')), {}),
    t.ok(true, 'this comes before the rejection').then(() => true)
  ])
})

t.test('promises with just tap', function (t) {
  return promiseToBeTen().then(function (ten) {
    t.equal(ten, 10)
    return Promise.resolve(true)
  }).then(function (shouldBeTrue) {
    t.ok(shouldBeTrue)
    return Promise.resolve({ a: 1 })
  }).then(function (obj) {
    t.match(obj, { a: 1 })
    return Promise.resolve('foo')
  }).then(function (num) {
    t.isa(num, Number)
    return Promise.resolve('bar')
  }).then(function (bar) {
    t.isa(bar, 'string')
    t.ok(true, 'this comes before the rejection')
  }).then(function () {
    return Promise.reject(new Error('oops'))
  })
})
