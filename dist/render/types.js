"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBufferArray = void 0;
exports.isBufferArray = function (obj) {
    var types = ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'];
    return types.indexOf(obj.constructor.name) > -1;
};
