export const gPrecision = 1e-4;

export function sign(value) {
    return value >= 0 ? 1 : -1;
}

export function approximateEqual(v1, v2, precision = gPrecision) {
    return Math.abs(v1 - v2) < precision
}

export function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

export function lerp(x, y, t) {
    return (1 - t) * x + t * y;
}

export function smoothstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * (3 - 2 * x);
}

export function smootherstep(x, min, max) {
    if (x <= min) return 0;
    if (x >= max) return 1;

    x = (x - min) / (max - min);

    return x * x * x * (x * (x * 6 - 15) + 10);
}

// Random integer from <low, high> interval

export function randInt(low, high) {
    return low + Math.floor(Math.random() * (high - low + 1));
}

// Random float from <low, high> interval

export function randFloat(low, high) {
    return low + Math.random() * (high - low);
}

export function isPowerOfTwo(value) {
    return (value & (value - 1)) === 0 && value !== 0;
}

export function ceilPowerOfTwo(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
}

export function floorPowerOfTwo(value) {
    return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
}

export function degToRad(degrees) {
    return degrees * _Math.DEG2RAD;
}

export function radToDeg(radians) {
    return radians * _Math.RAD2DEG;
}