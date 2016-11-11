"use strict";

Array.prototype.enumerationBuilder = function() {
    let enumeration = {};
    for(let entry of this) {
        enumeration[entry] = entry;
    }
    return enumeration;
};

const OPENMODELIST = [
    "ALL",
    "FOLLOWING"
];
const OPENMODE = OPENMODELIST.enumerationBuilder();

const MESSAGETYPE = [
    "OPEN"
].enumerationBuilder();
