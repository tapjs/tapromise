module.exports = Tapromise

var StackUtils = require('stack-utils')

// Filter out tap, tape, and this module.
var stack = new StackUtils({
  internals: StackUtils.nodeInternals().concat([
    /node_modules[\\\/]tap(romise|e)?[\\\/]/
  ])
})

var P = require('bluebird')

function Tapromise (t) {
  if (!(this instanceof Tapromise)) {
    return new Tapromise(t)
  }

  if (!t || typeof t !== 'object') {
    throw new TypeError('Test object required')
  }

  for (var i in t) {
    if (typeof t[i] === 'function') {
      makeMethod(this, t, i, {
        writable: true,
        enumerable: true,
        configurable: true
      })
    }
  }

  Object.getOwnPropertyNames(t).forEach(function (i) {
    if (typeof t[i] === 'function' && !this[i]) {
      var desc = Object.getOwnPropertyDescriptor(t, i)
      if (desc.value) {
        makeMethod(this, t, i, desc)
      }
    }
  }, this)
}

function makeMethod (self, t, i, desc) {
  var method = function () {
    var at = stack.at(method)
    var st = stack.captureString(method)
    var args = Array.prototype.slice.call(arguments)
    return P.all(args).then(function THEN (args) {
      t.assertAt = at
      t.assertStack = st
      return t[i].apply(t, args)
    })
  }

  desc.value = method
  Object.defineProperty(self, i, desc)
}
