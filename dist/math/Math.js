"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toFixedAry = exports.toFixed = exports.ToDegrees = exports.toRadians = exports.floorPowerOfTwo = exports.ceilPowerOfTwo = exports.isPowerOfTwo = exports.randFloat = exports.randInt = exports.smootherstep = exports.smoothstep = exports.lerp = exports.clamp = exports.approximateEqual = exports.sign = exports.RADIANS_PER_ARCSECOND = exports.DEGREES_PER_RADIAN = exports.RADIANS_PER_DEGREE = exports.ONE_OVER_TWO_PI = exports.PI_TWO = exports.THREE_PI_OVER_TWO = exports.PI_OVER_SIX = exports.PI_OVER_FOUR = exports.PI_OVER_THREE = exports.PI_OVER_TWO = exports.ONE_OVER_PI = exports.PI = exports.gPrecision = void 0;
exports.gPrecision = 1e-4;
/**
 * pi
 *
 * @type {Number}
 * @constant
 */
exports.PI = Math.PI;
/**
 * 1/pi
 *
 * @type {Number}
 * @constant
 */
exports.ONE_OVER_PI = 1.0 / Math.PI;
/**
 * pi/2
 *
 * @type {Number}
 * @constant
 */
exports.PI_OVER_TWO = Math.PI / 2.0;
/**
 * pi/3
 *
 * @type {Number}
 * @constant
 */
exports.PI_OVER_THREE = Math.PI / 3.0;
/**
 * pi/4
 *
 * @type {Number}
 * @constant
 */
exports.PI_OVER_FOUR = Math.PI / 4.0;
/**
 * pi/6
 *
 * @type {Number}
 * @constant
 */
exports.PI_OVER_SIX = Math.PI / 6.0;
/**
 * 3pi/2
 *
 * @type {Number}
 * @constant
 */
exports.THREE_PI_OVER_TWO = (3.0 * Math.PI) / 2.0;
/**
 * 2pi
 *
 * @type {Number}
 * @constant
 */
exports.PI_TWO = 2.0 * Math.PI;
/**
 * 1/2pi
 *
 * @type {Number}
 * @constant
 */
exports.ONE_OVER_TWO_PI = 1.0 / (2.0 * Math.PI);
/**
 * The number of radians in a degree.
 *
 * @type {Number}
 * @constant
 */
exports.RADIANS_PER_DEGREE = Math.PI / 180.0;
/**
 * The number of degrees in a radian.
 *
 * @type {Number}
 * @constant
 */
exports.DEGREES_PER_RADIAN = 180.0 / Math.PI;
/**
 * The number of radians in an arc second.
 *
 * @type {Number}
 * @constant
 */
exports.RADIANS_PER_ARCSECOND = exports.RADIANS_PER_DEGREE / 3600.0;
function sign(value) {
    return value >= 0 ? 1 : -1;
}
exports.sign = sign;
function approximateEqual(v1, v2, precision) {
    if (precision === void 0) { precision = exports.gPrecision; }
    return Math.abs(v1 - v2) < precision;
}
exports.approximateEqual = approximateEqual;
function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
exports.clamp = clamp;
function lerp(x, y, t) {
    return (1 - t) * x + t * y;
}
exports.lerp = lerp;
function smoothstep(x, min, max) {
    if (x <= min)
        return 0;
    if (x >= max)
        return 1;
    x = (x - min) / (max - min);
    return x * x * (3 - 2 * x);
}
exports.smoothstep = smoothstep;
function smootherstep(x, min, max) {
    if (x <= min)
        return 0;
    if (x >= max)
        return 1;
    x = (x - min) / (max - min);
    return x * x * x * (x * (x * 6 - 15) + 10);
}
exports.smootherstep = smootherstep;
// Random integer from <low, high> interval
function randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}
exports.randInt = randInt;
// Random float from <low, high> interval
/**
 * 生成一个low~high之间的浮点数
 * @param {*} low
 * @param {*} high
 */
function randFloat(low, high) {
    return low + Math.random() * (high - low);
}
exports.randFloat = randFloat;
function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0 && value !== 0;
}
exports.isPowerOfTwo = isPowerOfTwo;
function ceilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}
exports.ceilPowerOfTwo = ceilPowerOfTwo;
function floorPowerOfTwo(value) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}
exports.floorPowerOfTwo = floorPowerOfTwo;
function toRadians(degrees) {
    return degrees * exports.RADIANS_PER_DEGREE;
}
exports.toRadians = toRadians;
function ToDegrees(radians) {
    return radians * exports.DEGREES_PER_RADIAN;
}
exports.ToDegrees = ToDegrees;
/**
 * 数字或者向量固定位数
 * @param {Object} obj 数字或者向量
 * @param {*} fractionDigits
 */
function toFixed(obj, fractionDigits) {
    if (obj instanceof Number)
        return parseFloat(obj.toFixed(fractionDigits));
    else {
        if (obj.x !== undefined)
            obj.x = parseFloat(obj.x.toFixed(fractionDigits));
        if (obj.y !== undefined)
            obj.y = parseFloat(obj.y.toFixed(fractionDigits));
        if (obj.z !== undefined)
            obj.z = parseFloat(obj.z.toFixed(fractionDigits));
    }
    return obj;
}
exports.toFixed = toFixed;
/**
 * 数组中所有数字或者向量固定位数
 * @param {Array} array
 * @param {Number} precision
 */
function toFixedAry(array, precision) {
    if (precision === void 0) { precision = exports.gPrecision; }
    for (var i = 0; i < array.length; i++) {
        var e = array[i];
        if (e instanceof Array)
            toFixedAry(e);
        else
            array[i] = toFixed(e, precision);
    }
}
exports.toFixedAry = toFixedAry;
