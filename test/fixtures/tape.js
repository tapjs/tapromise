var t = require('tape')
var tapromise = require('../..')
var Promise = require('bluebird')

function promiseToBeTen () {
  return Promise.resolve(10)
}

t.test('promises with tapromise', function (t) {
  t = tapromise(t)
  return Promise.all([
    t.equal(promiseToBeTen(), 10),
    t.ok(Promise.resolve(true)),
    t.equal(Promise.resolve('foo'), Promise.resolve('bar')),
    t.ok(true, 'this comes before the rejection').then(function () {
      return true
    })
  ]).then(function () {
    t.end()
  })
})
