var Tapromise = require('../')
var t = require('tap')
var Test = t.Test
var Promise = require('bluebird')

var tt = new Test()
var out = ''
var ended = false
var expected = {
  plan: { start: 1, end: 3 },
  count: 3,
  pass: 2,
  ok: false,
  fail: 1,
  time: Number
}
var r = null

t.test('do some stuff', function (t) {
  tt.on('complete', function (r) {
    results = r
  })

  tt.on('end', function () {
    ended = true
  })

  var tpend = Tapromise(tt, {
    exclude: 'end'
  })

  var tperrmatch = Tapromise(tt, {
    exclude: [ 'error', 'match' ]
  })

  t.throws(function () {
    var tp = Tapromise(t, {
      exclude: { not: 'a string or array' }
    })
  }, TypeError)

  t.isa(tpend.end, 'function')
  t.notOk(tperrmatch.error(new Error('x')))
  t.ok(tperrmatch.match(Promise.resolve(1), { then: Function }))
  var p = tpend.match(Promise.resolve(1), 1)
  t.match(p, { then: Function })
  p.then(function (ok) {
    t.ok(ok)
    tperrmatch.end().then(function () {
      t.end()
    })
  })
})

t.test('check results', function (t) {
  t.ok(ended, 'ended')
  t.match(results, expected)
  t.end()
})
