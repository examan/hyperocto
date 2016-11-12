'use strict';

(global => {
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

  let GETMODELIST = [
    'ALL',
    'FOLLOWING'
  ]
  let GETMODE = enumerationBuilder(GETMODELIST)

  /* explicit export variables */
  global.enumerationBuilder = enumerationBuilder
  global.MESSAGETYPE = MESSAGETYPE
  global.GETMODELIST = GETMODELIST
  global.GETMODE = GETMODE
})(this)
