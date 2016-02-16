var Tapromise = require('../')
var t = require('tap')

t.throws(function () {
  Tapromise()
}, new Error('Test object required'))

t.isa(Tapromise(t), Tapromise, 'ctor is generator')

Object.defineProperty(t, 'fooblz', {
  get: function () {
    return function () {}
  },
  enumerable: false
})

t.equal(Tapromise(t).fooblz, undefined, 'skips non-value props')
