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
    'OPEN'
  ])

  let OPENMODELIST = [
    'ALL',
    'FOLLOWING'
  ]
  let OPENMODE = enumerationBuilder(OPENMODELIST)

  /* explicit export variables */
  global.enumerationBuilder = enumerationBuilder
  global.MESSAGETYPE = MESSAGETYPE
  global.OPENMODELIST = OPENMODELIST
  global.OPENMODE = OPENMODE
})(this)
