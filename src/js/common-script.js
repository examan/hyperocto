'use strict';

(global => {
  /*
    simple chrome polyfill
    Because polyfill by mozilla is not perfectly currently
    https://github.com/mozilla/webextension-polyfill
  */
  global.browser = global.browser || global.chrome

  function enumerationBuilder (list) {
    let enumeration = {}
    for (let entry of list) {
      enumeration[entry] = entry
    }
    return enumeration
  }

  let MESSAGETYPE = enumerationBuilder([
    'GETLINKS',
    'OPENLINKS'
  ])

  let GETMODE = {
    'NONE': 0,
    'FOLLOWING': 1 << 0
  }

  /* explicit export variables */
  global.enumerationBuilder = enumerationBuilder
  global.MESSAGETYPE = MESSAGETYPE
  global.GETMODE = GETMODE
})(this)
