"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.euler = exports.Euler = void 0;
var Vec3_1 = require("./Vec3");
var Math_1 = require("./Math");
var Mat4_1 = require("./Mat4");
var Quat_1 = require("./Quat");
var _matrix = Mat4_1.m4();
var _Quat = Quat_1.quat();
var RotationOrders = ["XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"];
var DefaultOrder = "XYZ";
var Euler = /** @class */ (function () {
    function Euler(_x, _y, _z, _order) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        if (_z === void 0) { _z = 0; }
        if (_order === void 0) { _order = DefaultOrder; }
        this._x = _x;
        this._y = _y;
        this._z = _z;
        this._order = _order;
        this.isEuler = true;
    }
    Object.defineProperty(Euler.prototype, "x", {
        get: function () {
            return this._x;
        },
        set: function (value) {
            this._x = value;
            this._onChangeCallback();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Euler.prototype, "y", {
        get: function () {
            return this._y;
        },
        set: function (value) {
            this._y = value;
            this._onChangeCallback();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Euler.prototype, "z", {
        get: function () {
            return this._z;
        },
        set: function (value) {
            this._z = value;
            this._onChangeCallback();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Euler.prototype, "order", {
        get: function () {
            return this._order;
        },
        set: function (value) {
            this._order = value;
            this._onChangeCallback();
        },
        enumerable: false,
        configurable: true
    });
    Euler.prototype.set = function (x, y, z, order) {
        this._x = x;
        this._y = y;
        this._z = z;
        this._order = order || this._order;
        this._onChangeCallback();
        return this;
    };
    Euler.prototype.clone = function () {
        return new Euler(this._x, this._y, this._z, this._order);
    };
    Euler.prototype.copy = function (Euler) {
        this._x = Euler._x;
        this._y = Euler._y;
        this._z = Euler._z;
        this._order = Euler._order;
        this._onChangeCallback();
        return this;
    };
    Euler.prototype.setFromRotationMatrix = function (m, order, update) {
        // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
        var te = m.elements;
        var m11 = te[0], m12 = te[4], m13 = te[8];
        var m21 = te[1], m22 = te[5], m23 = te[9];
        var m31 = te[2], m32 = te[6], m33 = te[10];
        order = order || this._order;
        if (order === "XYZ") {
            this._y = Math.asin(Math_1.clamp(m13, -1, 1));
            if (Math.abs(m13) < 0.9999999) {
                this._x = Math.atan2(-m23, m33);
                this._z = Math.atan2(-m12, m11);
            }
            else {
                this._x = Math.atan2(m32, m22);
                this._z = 0;
            }
        }
        else if (order === "YXZ") {
            this._x = Math.asin(-Math_1.clamp(m23, -1, 1));
            if (Math.abs(m23) < 0.9999999) {
                this._y = Math.atan2(m13, m33);
                this._z = Math.atan2(m21, m22);
            }
            else {
                this._y = Math.atan2(-m31, m11);
                this._z = 0;
            }
        }
        else if (order === "ZXY") {
            this._x = Math.asin(Math_1.clamp(m32, -1, 1));
            if (Math.abs(m32) < 0.9999999) {
                this._y = Math.atan2(-m31, m33);
                this._z = Math.atan2(-m12, m22);
            }
            else {
                this._y = 0;
                this._z = Math.atan2(m21, m11);
            }
        }
        else if (order === "ZYX") {
            this._y = Math.asin(-Math_1.clamp(m31, -1, 1));
            if (Math.abs(m31) < 0.9999999) {
                this._x = Math.atan2(m32, m33);
                this._z = Math.atan2(m21, m11);
            }
            else {
                this._x = 0;
                this._z = Math.atan2(-m12, m22);
            }
        }
        else if (order === "YZX") {
            this._z = Math.asin(Math_1.clamp(m21, -1, 1));
            if (Math.abs(m21) < 0.9999999) {
                this._x = Math.atan2(-m23, m22);
                this._y = Math.atan2(-m31, m11);
            }
            else {
                this._x = 0;
                this._y = Math.atan2(m13, m33);
            }
        }
        else if (order === "XZY") {
            this._z = Math.asin(-Math_1.clamp(m12, -1, 1));
            if (Math.abs(m12) < 0.9999999) {
                this._x = Math.atan2(m32, m22);
                this._y = Math.atan2(m13, m11);
            }
            else {
                this._x = Math.atan2(-m23, m33);
                this._y = 0;
            }
        }
        else {
            console.warn("Euler: .setFromRotationMatrix() given unsupported order: " + order);
        }
        this._order = order;
        if (update !== false)
            this._onChangeCallback();
        return this;
    };
    Euler.prototype.setFromQuat = function (q, order, update) {
        _matrix.makeRotationFromQuat(q);
        return this.setFromRotationMatrix(_matrix, order, update);
    };
    Euler.prototype.setFromVec3 = function (v, order) {
        return this.set(v.x, v.y, v.z, order || this._order);
    };
    Euler.prototype.reorder = function (newOrder) {
        // WARNING: this discards revolution information -bhouston
        _Quat.setFromEuler(this);
        return this.setFromQuat(_Quat, newOrder);
    };
    Euler.prototype.equals = function (Euler) {
        return (Euler._x === this._x &&
            Euler._y === this._y &&
            Euler._z === this._z &&
            Euler._order === this._order);
    };
    Euler.prototype.fromArray = function (array) {
        this._x = array[0];
        this._y = array[1];
        this._z = array[2];
        if (array[3] !== undefined)
            this._order = array[3];
        this._onChangeCallback();
        return this;
    };
    Euler.prototype.toArray = function (array, offset) {
        if (array === void 0) { array = []; }
        if (offset === void 0) { offset = 0; }
        array[offset] = this._x;
        array[offset + 1] = this._y;
        array[offset + 2] = this._z;
        array[offset + 3] = this._order;
        return array;
    };
    Euler.prototype.toVec3 = function (optionalResult) {
        if (optionalResult) {
            return optionalResult.set(this._x, this._y, this._z);
        }
        else {
            return Vec3_1.v3(this._x, this._y, this._z);
        }
    };
    Euler.prototype._onChange = function (callback) {
        this._onChangeCallback = callback;
        return this;
    };
    Euler.prototype._onChangeCallback = function () { };
    return Euler;
}());
exports.Euler = Euler;
function euler(x, y, z) {
    return new Euler(x, y, z);
}
exports.euler = euler;
