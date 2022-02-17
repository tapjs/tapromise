module.exports = Tapromise

var StackUtils = require('stack-utils')

// Filter out tap, tape, and this module.
var stack = new StackUtils({
  internals: StackUtils.nodeInternals().concat([
    /node_modules[\\\/]tap(romise|e)?[\\\/]/
  ])
})

var P = require('bluebird')

function Tapromise (t, options) {
  if (!(this instanceof Tapromise)) {
    return new Tapromise(t, options)
  }

  if (!t || typeof t !== 'object') {
    throw new TypeError('Test object required')
  }

  options = options || {}
  var exclude = options.exclude || []
  if (typeof exclude === 'string') {
    exclude = [ exclude ]
  }
  if (!Array.isArray(exclude)) {
    throw new TypeError('non-array exclude list')
  }

  // traverse over all enumerable props, including inherited
  for (var i in t) {
    if (typeof t[i] !== 'function') {
      continue
    }
    /* istanbul ignore next - patch welcome */
    if (exclude.indexOf(i) !== -1) {
      this[i] = t[i].bind(t)
      continue
    }
    makeMethod(this, t, i, {
      writable: true,
      enumerable: true,
      configurable: true
    })
  }

  // also include own value props that are not enumerable
  Object.getOwnPropertyNames(t).forEach(function (i) {
    if (typeof t[i] !== 'function') {
      return
    }
    if (this[i]) {
      return
    }
    if (exclude.indexOf(i) !== -1) {
      this[i] = t[i].bind(t)
      return
    }
    var desc = Object.getOwnPropertyDescriptor(t, i)
    if (desc.value) {
      makeMethod(this, t, i, desc)
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
