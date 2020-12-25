"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vectorCompare = void 0;
function vectorCompare(a, b) {
    if (a.x === b.x) {
        if (a.z !== undefined && a.y === b.y)
            return a.z - b.z;
        else
            return a.y - b.y;
    }
    else
        return a.x - b.x;
}
exports.vectorCompare = vectorCompare;
