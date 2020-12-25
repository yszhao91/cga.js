export declare const gPrecision = 0.0001;
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
export declare function degToRad(degrees: number): number;
export declare function radToDeg(radians: number): number;
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
