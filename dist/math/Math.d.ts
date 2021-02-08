export declare const gPrecision = 0.0001;
/**
 * pi
 *
 * @type {Number}
 * @constant
 */
export declare const PI: number;
/**
 * 1/pi
 *
 * @type {Number}
 * @constant
 */
export declare const ONE_OVER_PI: number;
/**
 * pi/2
 *
 * @type {Number}
 * @constant
 */
export declare const PI_OVER_TWO: number;
/**
 * pi/3
 *
 * @type {Number}
 * @constant
 */
export declare const PI_OVER_THREE: number;
/**
 * pi/4
 *
 * @type {Number}
 * @constant
 */
export declare const PI_OVER_FOUR: number;
/**
 * pi/6
 *
 * @type {Number}
 * @constant
 */
export declare const PI_OVER_SIX: number;
/**
 * 3pi/2
 *
 * @type {Number}
 * @constant
 */
export declare const THREE_PI_OVER_TWO: number;
/**
 * 2pi
 *
 * @type {Number}
 * @constant
 */
export declare const PI_TWO: number;
/**
 * 1/2pi
 *
 * @type {Number}
 * @constant
 */
export declare const ONE_OVER_TWO_PI: number;
/**
 * The number of radians in a degree.
 *
 * @type {Number}
 * @constant
 */
export declare const RADIANS_PER_DEGREE: number;
/**
 * The number of degrees in a radian.
 *
 * @type {Number}
 * @constant
 */
export declare const DEGREES_PER_RADIAN: number;
/**
 * The number of radians in an arc second.
 *
 * @type {Number}
 * @constant
 */
export declare const RADIANS_PER_ARCSECOND: number;
export declare function sign(value: number): 1 | -1;
export declare function approximateEqual(v1: number, v2: number, precision?: number): boolean;
export declare function clamp(value: number, min: number, max: number): number;
export declare function lerp(x: number, y: number, t: number): number;
export declare function smoothstep(x: number, min: number, max: number): number;
export declare function smootherstep(x: number, min: number, max: number): number;
export declare function randInt(low: number, high: number): number;
/**
 * 生成一个low~high之间的浮点数
 * @param {*} low
 * @param {*} high
 */
export declare function randFloat(low: number, high: number): number;
export declare function isPowerOfTwo(value: number): boolean;
export declare function ceilPowerOfTwo(value: number): number;
export declare function floorPowerOfTwo(value: number): number;
export declare function toRadians(degrees: number): number;
export declare function ToDegrees(radians: number): number;
/**
 * 数字或者向量固定位数
 * @param {Object} obj 数字或者向量
 * @param {*} fractionDigits
 */
export declare function toFixed(obj: {
    toFixed: (arg0: any) => string;
    x: number | undefined;
    y: number | undefined;
    z: number | undefined;
}, fractionDigits: number | undefined): number | {
    toFixed: (arg0: any) => string;
    x: number | undefined;
    y: number | undefined;
    z: number | undefined;
};
/**
 * 数组中所有数字或者向量固定位数
 * @param {Array} array
 * @param {Number} precision
 */
export declare function toFixedAry(array: Array<any>, precision?: number): void;
