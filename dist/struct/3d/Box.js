"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = void 0;
var Vec3_1 = require("../../math/Vec3");
/**
 *
 */
var Box = /** @class */ (function () {
    function Box(points) {
        this.min = Vec3_1.v3(Infinity, Infinity, Infinity);
        this.max = Vec3_1.v3(-Infinity, -Infinity, -Infinity);
        this._center = Vec3_1.v3();
        if (points) {
            this.setFromPoints(points);
        }
    }
    Object.defineProperty(Box.prototype, "center", {
        get: function () {
            return this._center.add(this.min, this.max).multiplyScalar(0.5);
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * @param {Array<Vec3>} points
     */
    Box.prototype.setFromPoints = function (points) {
        this.min.set(Infinity, Infinity, Infinity);
        this.max.set(-Infinity, -Infinity, -Infinity);
        this.expand.apply(this, points);
    };
    Box.prototype.expand = function () {
        var points = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            points[_i] = arguments[_i];
        }
        for (var i = 0; i < points.length; i++) {
            var point = points[i];
            this.min.min(point);
            this.max.max(point);
        }
        this.center.addVecs(this.min, this.max).multiplyScalar(0.5);
    };
    return Box;
}());
exports.Box = Box;
