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
exports.v2 = exports.Vec2 = void 0;
var eventhandler_1 = require("../render/eventhandler");
var thing_1 = require("../render/thing");
var Vec2 = /** @class */ (function (_super) {
    __extends(Vec2, _super);
    function Vec2(_x, _y) {
        if (_x === void 0) { _x = 0; }
        if (_y === void 0) { _y = 0; }
        var _this = _super.call(this) || this;
        _this._x = _x;
        _this._y = _y;
        _this.isVec2 = true;
        thing_1.buildAccessors(['x', 'y'], _this);
        return _this;
    }
    Vec2.isVec2 = function (v) {
        return !isNaN(v.x) && !isNaN(v.y) && isNaN(v.z) && isNaN(v.w);
    };
    Object.defineProperty(Vec2.prototype, "width", {
        get: function () {
            return this.x;
        },
        set: function (value) {
            this.x = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2.prototype, "height", {
        get: function () {
            return this.y;
        },
        set: function (value) {
            this.y = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2, "UnitX", {
        get: function () {
            return new Vec2(1, 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Vec2, "UnitY", {
        get: function () {
            return new Vec2(0, 1);
        },
        enumerable: false,
        configurable: true
    });
    Vec2.prototype.set = function (x, y) {
        this.x = x;
        this.y = y;
        return this;
    };
    Vec2.prototype.setScalar = function (scalar) {
        this.x = scalar;
        this.y = scalar;
        return this;
    };
    Vec2.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Vec2.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Vec2.prototype.setComponent = function (index, value) {
        switch (index) {
            case 0:
                this.x = value;
                break;
            case 1:
                this.y = value;
                break;
            default:
                throw new Error("index is out of range: " + index);
        }
        return this;
    };
    Vec2.prototype.getComponent = function (index) {
        switch (index) {
            case 0:
                return this.x;
            case 1:
                return this.y;
            default:
                throw new Error("index is out of range: " + index);
        }
    };
    Vec2.prototype.clone = function () {
        return new Vec2(this.x, this.y);
    };
    Vec2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vec2.prototype.add = function (v, w) {
        if (w !== undefined) {
            console.warn("Vec2: .add() now only accepts one argument. Use .addVecs( a, b ) instead.");
            return this.addVecs(v, w);
        }
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    Vec2.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        return this;
    };
    Vec2.prototype.addVecs = function (a, b) {
        this.x = a.x + b.x;
        this.y = a.y + b.y;
        return this;
    };
    Vec2.prototype.addScaledVec = function (v, s) {
        this.x += v.x * s;
        this.y += v.y * s;
        return this;
    };
    Vec2.prototype.sub = function (v, w) {
        if (w !== undefined) {
            console.warn("Vec2: .sub() now only accepts one argument. Use .subVecs( a, b ) instead.");
            return this.subVecs(v, w);
        }
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    Vec2.prototype.subScalar = function (s) {
        this.x -= s;
        this.y -= s;
        return this;
    };
    Vec2.prototype.subVecs = function (a, b) {
        this.x = a.x - b.x;
        this.y = a.y - b.y;
        return this;
    };
    Vec2.prototype.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };
    Vec2.prototype.multiplyScalar = function (scalar) {
        this.x *= scalar;
        this.y *= scalar;
        return this;
    };
    Vec2.prototype.divide = function (v) {
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };
    Vec2.prototype.divideScalar = function (scalar) {
        return this.multiplyScalar(1 / scalar);
    };
    Vec2.prototype.applyMat3 = function (m) {
        var x = this.x, y = this.y;
        var e = m.elements;
        this.x = e[0] * x + e[3] * y + e[6];
        this.y = e[1] * x + e[4] * y + e[7];
        return this;
    };
    Vec2.prototype.min = function (v) {
        this.x = Math.min(this.x, v.x);
        this.y = Math.min(this.y, v.y);
        return this;
    };
    Vec2.prototype.max = function (v) {
        this.x = Math.max(this.x, v.x);
        this.y = Math.max(this.y, v.y);
        return this;
    };
    Vec2.prototype.clamp = function (min, max) {
        // assumes min < max, componentwise
        this.x = Math.max(min.x, Math.min(max.x, this.x));
        this.y = Math.max(min.y, Math.min(max.y, this.y));
        return this;
    };
    Vec2.prototype.clampScalar = function (minVal, maxVal) {
        this.x = Math.max(minVal, Math.min(maxVal, this.x));
        this.y = Math.max(minVal, Math.min(maxVal, this.y));
        return this;
    };
    Vec2.prototype.clampLength = function (min, max) {
        var length = this.length();
        return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
    };
    Vec2.prototype.floor = function () {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this;
    };
    Vec2.prototype.ceil = function () {
        this.x = Math.ceil(this.x);
        this.y = Math.ceil(this.y);
        return this;
    };
    Vec2.prototype.round = function () {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this;
    };
    Vec2.prototype.roundToZero = function () {
        this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
        this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
        return this;
    };
    Vec2.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    Vec2.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vec2.prototype.cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    Vec2.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vec2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vec2.prototype.manhattanLength = function () {
        return Math.abs(this.x) + Math.abs(this.y);
    };
    Vec2.prototype.normalize = function () {
        return this.divideScalar(this.length() || 1);
    };
    Vec2.prototype.angle = function () {
        // computes the angle in radians with respect to the positive x-axis
        var angle = Math.atan2(this.y, this.x);
        if (angle < 0)
            angle += 2 * Math.PI;
        return angle;
    };
    Vec2.prototype.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };
    Vec2.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    };
    Vec2.prototype.manhattanDistanceTo = function (v) {
        return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
    };
    Vec2.prototype.setLength = function (length) {
        return this.normalize().multiplyScalar(length);
    };
    Vec2.prototype.lerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    };
    Vec2.prototype.lerpVecs = function (v1, v2, alpha) {
        return this.subVecs(v2, v1)
            .multiplyScalar(alpha)
            .add(v1);
    };
    Vec2.prototype.equals = function (v) {
        return v.x === this.x && v.y === this.y;
    };
    Vec2.prototype.fromArray = function (array, offset) {
        if (offset === void 0) { offset = 0; }
        this.x = array[offset];
        this.y = array[offset + 1];
        return this;
    };
    Vec2.prototype.toArray = function (array, offset) {
        if (array === void 0) { array = []; }
        if (offset === void 0) { offset = 0; }
        array[offset] = this.x;
        array[offset + 1] = this.y;
        return array;
    };
    Vec2.prototype.fromBufferAttribute = function (attribute, index, offset) {
        if (offset !== undefined) {
            console.warn("Vec2: offset has been removed from .fromBufferAttribute().");
        }
        this.x = attribute.getX(index);
        this.y = attribute.getY(index);
        return this;
    };
    Vec2.prototype.rotateAround = function (center, angle) {
        var c = Math.cos(angle), s = Math.sin(angle);
        var x = this.x - center.x;
        var y = this.y - center.y;
        this.x = x * c - y * s + center.x;
        this.y = x * s + y * c + center.y;
        return this;
    };
    return Vec2;
}(eventhandler_1.EventHandler));
exports.Vec2 = Vec2;
function v2() {
    return new Vec2();
}
exports.v2 = v2;
