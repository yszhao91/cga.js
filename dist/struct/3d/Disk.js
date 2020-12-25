"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disk = exports.Disk = void 0;
var Vec3_1 = require("../../math/Vec3");
var Disk = /** @class */ (function () {
    function Disk(center, radius, normal) {
        if (normal === void 0) { normal = Vec3_1.Vec3.UnitY; }
        this.center = center || Vec3_1.v3();
        this.normal = normal;
        this.radius = radius || 0;
        this.w = this.normal.dot(center);
    }
    Disk.prototype.area = function () {
        return Math.PI * this.radius * this.radius;
    };
    return Disk;
}());
exports.Disk = Disk;
function disk(center, radius, normal) {
    return new Disk(center, radius, normal);
}
exports.disk = disk;
