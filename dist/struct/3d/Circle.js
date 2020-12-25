"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.circle = exports.Circle = void 0;
var Vec3_1 = require("../../math/Vec3");
var common_1 = require("../../alg/common");
var Line_1 = require("./Line");
var Circle = /** @class */ (function () {
    /**
     * 圆圈
     * @param  {Vec3} center 中心点
     * @param  {Vec3} normal 法线
     * @param  {Number} radius 半径
     */
    function Circle(center, radius, normal) {
        if (center === void 0) { center = new Vec3_1.Vec3(); }
        if (radius === void 0) { radius = 0; }
        if (normal === void 0) { normal = Vec3_1.Vec3.UnitY; }
        this.center = center;
        this.radius = radius;
        this.normal = normal;
        this.startAngle = 0;
        this.endAngle = Math.PI * 2;
        this.radiusSqr = 0;
    }
    Circle.prototype.area = function () {
        return Math.PI * this.radius * this.radius;
    };
    /**
     * 两个点
     * @param fixp0
     * @param fixp1
     * @param movep
     * @param normal
     */
    Circle.prototype.arc1 = function (fixp0, fixp1, movep, normal) {
        this.setFrom3Points(fixp0, fixp1, movep);
        this.startAngle = 0;
        this.endAngle = common_1.angle(fixp0.clone().sub(this.center).normalize(), fixp1.clone().sub(this.center).normalize(), this.normal || normal);
    };
    /**
     * 全两个点确定半径，后面点确定 弧度 ,只需要检测鼠标移动时鼠标是否跨过第一条半径即可确定顺逆时针
     * @param fixp0
     * @param fixp1
     * @param movep
     */
    Circle.prototype.arc2 = function (center, fixp1, movep, ccw, normal) {
        if (ccw === void 0) { ccw = false; }
        this.radius = fixp1.distanceTo(center);
        this.center.copy(center);
        var v2 = movep.clone().sub(center);
        var v1 = fixp1.clone().sub(center);
        var jd = common_1.angle(v1, v2);
    };
    Circle.prototype.setFrom3Points = function (p0, p1, p2, normal) {
        // if (pointsCollinear(p0, p1, p2))
        //     throw ("calcCircleFromThreePoint：三点共线或者距离太近");
        var d1 = p1.clone().sub(p0);
        var d2 = p2.clone().sub(p0);
        var d1center = p1.clone().add(p0).multiplyScalar(0.5);
        var d2center = p2.clone().add(p0).multiplyScalar(0.5);
        normal = normal || d1.clone().cross(d2).normalize();
        d1.applyAxisAngle(normal, Math.PI / 2);
        d2.applyAxisAngle(normal, Math.PI / 2);
        var line1 = new Line_1.Line(d1center, d1center.clone().add(d1));
        var line2 = new Line_1.Line(d2center, d2center.clone().add(d2));
        var center = line1.distanceLine(line2).closests[0];
        var radiusSqr = p0.distanceToSquared(center);
        this.center = center;
        this.radiusSqr = radiusSqr;
        this.radius = Math.sqrt(radiusSqr);
        this.normal = normal;
        return this;
    };
    return Circle;
}());
exports.Circle = Circle;
function circle(center, radius, normal) {
    return new Circle(center, radius, normal);
}
exports.circle = circle;
