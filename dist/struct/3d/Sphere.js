"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sphere = void 0;
var Vec3_1 = require("../../math/Vec3");
var Sphere = /** @class */ (function () {
    function Sphere(center, radius) {
        this.center = Vec3_1.v3();
        this.radius = 0;
    }
    Sphere.prototype.clone = function () {
        throw new Error("Method not implemented.");
    };
    return Sphere;
}());
exports.Sphere = Sphere;
