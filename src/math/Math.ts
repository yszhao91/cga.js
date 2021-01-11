export const gPrecision = 1e-4;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export function sign(value: number) {
    return value >= 0 ? 1 : -1;
}

export function approximateEqual(v1: number, v2: number, precision = gPrecision) {
    return Math.abs(v1 - v2) < precision
}

export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export function lerp(x: number, y: number, t: number) {
    return (1 - t) * x + t * y;
}

export function smoothstep(x: number, min: number, max: number) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
}

export function smootherstep(x: number, min: number, max: number) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * x * (x * (x * 6 - 15) + 10);
}

// Random integer from <low, high> interval

export function randInt(low: number, high: number) {
    return low + Math.floor(Math.random() * (high - low + 1));
}

// Random float from <low, high> interval
/**
 * 生成一个low~high之间的浮点数
 * @param {*} low 
 * @param {*} high 
 */
export function randFloat(low: number, high: number) {
    return low + Math.random() * (high - low);
}

export function isPowerOfTwo(value: number) {
    return (value & (value - 1)) === 0 && value !== 0;
}

export function ceilPowerOfTwo(value: number) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}

export function floorPowerOfTwo(value: number) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}

export function degToRad(degrees: number) {
    return degrees * DEG2RAD;
}

export function radToDeg(radians: number) {
    return radians * RAD2DEG;
}

/**
 * 数字或者向量固定位数
 * @param {Object} obj 数字或者向量
 * @param {*} fractionDigits 
 */
export function toFixed(obj: { toFixed: (arg0: any) => string; x: number | undefined; y: number | undefined; z: number | undefined; }, fractionDigits: number | undefined) {
    if (obj instanceof Number)
        return parseFloat(obj.toFixed(fractionDigits))
    else {
        if (obj.x !== undefined)
            obj.x = parseFloat(obj.x.toFixed(fractionDigits))

        if (obj.y !== undefined)
            obj.y = parseFloat(obj.y.toFixed(fractionDigits))

        if (obj.z !== undefined)
            obj.z = parseFloat(obj.z.toFixed(fractionDigits))

    }
    return obj;
}

/** 
 * 数组中所有数字或者向量固定位数
 * @param {Array} array 
 * @param {Number} precision 
 */
export function toFixedAry(array: Array<any>, precision: number = gPrecision) {
    for (let i = 0; i < array.length; i++) {
        const e = array[i];
        if (e instanceof Array)
            toFixedAry(e);
        else
            array[i] = toFixed(e, precision);
    }
}
