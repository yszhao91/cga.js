"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.v4 = exports.Vec4 = void 0;
var eventhandler_1 = require("../render/eventhandler");
var thing_1 = require("../render/thing");
var Vec4 = /** @class */ (function (_super) {
    __extends(Vec4, _super);
    function Vec4(_x, _y, _z, _w) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_z === void 0) { _z = 0; }
        if (_w === void 0) { _w = 1; }
        var _this = _super.call(this) || this;
        _this._x = _x;
        _this._y = _y;
        _this._z = _z;
        _this._w = _w;
        _this.isVec4 = true;
        thing_1.buildAccessors(['x', 'y', 'z', 'w'], _this);
        return _this;
    }
    Vec4.isVec4 = function (v) {
        return !isNaN(v.x) && !isNaN(v.y) && !isNaN(v.z) && !isNaN(v.w);
    };
    Object.defineProperty(Vec4.prototype, "width", {
        get: function () {
            return this.z;
        },
        set: function (value) {
            this.z = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec4.prototype, "height", {
        get: function () {
            return this.w;
        },
        set: function (value) {
            this.w = value;
        },
        enumerable: false,
        configurable: true
    });
    Vec4.prototype.set = function (x, y, z, w) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
        return this;
    };
    Vec4.prototype.setScalar = function (scalar) {
        this.x = scalar;
        this.y = scalar;
        this.z = scalar;
        this.w = scalar;
        return this;
    };
    Vec4.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Vec4.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Vec4.prototype.setZ = function (z) {
        this.z = z;
        return this;
    };
    Vec4.prototype.setW = function (w) {
        this.w = w;
        return this;
    };
    Vec4.prototype.setComponent = function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            case 2:
                this.z = value;
                break;
            case 3:
                this.w = value;
                break;
            default:
                throw new Error("index is out of range: " + index);
        }
        return this;
    };
    Vec4.prototype.getComponent = function (index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            case 2:
                return this.z;
            case 3:
                return this.w;
            default:
                throw new Error("index is out of range: " + index);
        }
    };
    Vec4.prototype.clone = function () {
        return new Vec4(this.x, this.y, this.z, this.w);
    };
    Vec4.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        this.z = v.z;
        this.w = v.w !== undefined ? v.w : 1;
        return this;
    };
    Vec4.prototype.add = function (v, w) {
        if (w !== undefined) {
            console.warn("Vec4: .add() now only accepts one argument. Use .addVecs( a, b ) instead.");
            return this.addVecs(v, w);
        }
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        this.w += v.w;
        return this;
    };
    Vec4.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        this.z += s;
        this.w += s;
        return this;
    };
    Vec4.prototype.addVecs = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        this.z = a.z + b.z;
        this.w = a.w + b.w;
        return this;
    };
    Vec4.prototype.addScaledVec = function (v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        this.z += v.z * s;
        this.w += v.w * s;
        return this;
    };
    Vec4.prototype.sub = function (v, w) {
        if (w !== undefined) {
            return this.subVecs(v, w);
        }
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        this.w -= v.w;
        return this;
    };
    Vec4.prototype.subScalar = function (s) {
        this.x -= s;
        this.y -= s;
        this.z -= s;
        this.w -= s;
        return this;
    };
    Vec4.prototype.subVecs = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        this.z = a.z - b.z;
        this.w = a.w - b.w;
        return this;
    };
    Vec4.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        this.z *= scalar;
        this.w *= scalar;
        return this;
    };
    Vec4.prototype.applyMat4 = function (m) {
        var x = this.x, y = this.y, z = this.z, w = this.w;
        var e = m.elements;
        this.x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
        this.y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
        this.z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
        this.w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
        return this;
    };
    Vec4.prototype.divideScalar = function (scalar) {
        return this.multiplyScalar(1 / scalar);
    };
    Vec4.prototype.setAxisAngleFromQuat = function (q) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/QuatToAngle/index.htm
        // q is assumed to be normalized
        this.w = 2 * Math.acos(q.w);
        var s = Math.sqrt(1 - q.w * q.w);
        if (s < 0.0001) {
            this.x = 1;
            this.y = 0;
            this.z = 0;
        }
        else {
            this.x = q.x / s;
            this.y = q.y / s;
            this.z = q.z / s;
        }
        return this;
    };
    Vec4.prototype.setAxisAngleFromRotationMatrix = function (m) {
        // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        var angle, x, y, z, // variables for result
        epsilon = 0.01, // margin to allow for rounding errors
        epsilon2 = 0.1, // margin to distinguish between 0 and 180 degrees
        te = m.elements, m11 = te[0], m12 = te[4], m13 = te[8], m21 = te[1], m22 = te[5], m23 = te[9], m31 = te[2], m32 = te[6], m33 = te[10];
        if (Math.abs(m12 - m21) < epsilon &&
            Math.abs(m13 - m31) < epsilon &&
            Math.abs(m23 - m32) < epsilon) {
            // singularity found
            // first check for identity matrix which must have +1 for all terms
            // in leading diagonal and zero in other terms
            if (Math.abs(m12 + m21) < epsilon2 &&
                Math.abs(m13 + m31) < epsilon2 &&
                Math.abs(m23 + m32) < epsilon2 &&
                Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
                // this singularity is identity matrix so angle = 0
                this.set(1, 0, 0, 0);
                return this; // zero angle, arbitrary axis
            }
            // otherwise this singularity is angle = 180
            angle = Math.PI;
            var xx = (m11 + 1) / 2;
            var yy = (m22 + 1) / 2;
            var zz = (m33 + 1) / 2;
            var xy = (m12 + m21) / 4;
            var xz = (m13 + m31) / 4;
            var yz = (m23 + m32) / 4;
            if (xx > yy && xx > zz) {
                // m11 is the largest diagonal term
                if (xx < epsilon) {
                    x = 0;
                    y = 0.707106781;
                    z = 0.707106781;
                }
                else {
                    x = Math.sqrt(xx);
                    y = xy / x;
                    z = xz / x;
                }
            }
            else if (yy > zz) {
                // m22 is the largest diagonal term
                if (yy < epsilon) {
                    x = 0.707106781;
                    y = 0;
                    z = 0.707106781;
                }
                else {
                    y = Math.sqrt(yy);
                    x = xy / y;
                    z = yz / y;
                }
            }
            else {
                // m33 is the largest diagonal term so base result on this
                if (zz < epsilon) {
                    x = 0.707106781;
                    y = 0.707106781;
                    z = 0;
                }
                else {
                    z = Math.sqrt(zz);
                    x = xz / z;
                    y = yz / z;
                }
            }
            this.set(x, y, z, angle);
            return this; // return 180 deg rotation
        }
        // as we have reached here there are no singularities so we can handle normally
        var s = Math.sqrt((m32 - m23) * (m32 - m23) +
            (m13 - m31) * (m13 - m31) +
            (m21 - m12) * (m21 - m12)); // used to normalize
        if (Math.abs(s) < 0.001)
            s = 1;
        // prevent divide by zero, should not happen if matrix is orthogonal and should be
        // caught by singularity test above, but I've left it in just in case
        this.x = (m32 - m23) / s;
        this.y = (m13 - m31) / s;
        this.z = (m21 - m12) / s;
        this.w = Math.acos((m11 + m22 + m33 - 1) / 2);
        return this;
    };
    Vec4.prototype.min = function (v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        this.z = Math.min(this.z, v.z);
        this.w = Math.min(this.w, v.w);
        return this;
    };
    Vec4.prototype.max = function (v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        this.z = Math.max(this.z, v.z);
        this.w = Math.max(this.w, v.w);
        return this;
    };
    Vec4.prototype.clamp = function (min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        this.z = Math.max(min.z, Math.min(max.z, this.z));
        this.w = Math.max(min.w, Math.min(max.w, this.w));
        return this;
    };
    Vec4.prototype.clampScalar = function (minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        this.z = Math.max(minVal, Math.min(maxVal, this.z));
        this.w = Math.max(minVal, Math.min(maxVal, this.w));
        return this;
    };
    Vec4.prototype.clampLength = function (min, max) {
        var length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    };
    Vec4.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        this.z = Math.floor(this.z);
        this.w = Math.floor(this.w);
        return this;
    };
    Vec4.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        this.z = Math.ceil(this.z);
        this.w = Math.ceil(this.w);
        return this;
    };
    Vec4.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        this.z = Math.round(this.z);
        this.w = Math.round(this.w);
        return this;
    };
    Vec4.prototype.roundToZero = function () {
        this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
        this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);
        this.w = this.w < 0 ? Math.ceil(this.w) : Math.floor(this.w);
        return this;
    };
    Vec4.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        this.z = -this.z;
        this.w = -this.w;
        return this;
    };
    Vec4.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y + this.z * v.z + this.w * v.w;
    };
    Vec4.prototype.lengthSq = function () {
        return (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    };
    Vec4.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
    };
    Vec4.prototype.manhattanLength = function () {
        return (Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w));
    };
    Vec4.prototype.normalize = function () {
        return this.divideScalar(this.length() || 1);
    };
    Vec4.prototype.setLength = function (length) {
        return this.normalize().multiplyScalar(length);
    };
    Vec4.prototype.lerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        this.z += (v.z - this.z) * alpha;
        this.w += (v.w - this.w) * alpha;
        return this;
    };
    Vec4.prototype.lerpVecs = function (v1, v2, alpha) {
        return this.subVecs(v2, v1)
            .multiplyScalar(alpha)
            .add(v1);
    };
    Vec4.prototype.equals = function (v) {
        return v.x === this.x && v.y === this.y && v.z === this.z && v.w === this.w;
    };
    Vec4.prototype.fromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        this.x = array[offset];
        this.y = array[offset + 1];
        this.z = array[offset + 2];
        this.w = array[offset + 3];
        return this;
    };
    Vec4.prototype.toArray = function (array, offset) {
        if (array === void 0) { array = []; }
        if (offset === void 0) { offset = 0; }
        array[offset] = this.x;
        array[offset + 1] = this.y;
        array[offset + 2] = this.z;
        array[offset + 3] = this.w;
        return array;
    };
    Vec4.prototype.fromBufferAttribute = function (attribute, index, offset) {
        if (offset !== undefined) {
            console.warn("Vec4: offset has been removed from .fromBufferAttribute().");
        }
        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        this.z = attribute.getZ(index);
        this.w = attribute.getW(index);
        return this;
    };
    return Vec4;
}(eventhandler_1.EventHandler));
exports.Vec4 = Vec4;
function v4(x, y, z, w) {
    return new Vec4(x, y, z, w);
}
exports.v4 = v4;
