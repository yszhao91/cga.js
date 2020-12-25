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
exports.Polyline = void 0;
var ArrayEx_1 = require("../struct/data/ArrayEx");
var Vec3_1 = require("./Vec3");
var Math_1 = require("./Math");
var type_1 = require("../struct/data/type");
/**
 *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
 */
var Polyline = /** @class */ (function (_super) {
    __extends(Polyline, _super);
    function Polyline(vs, normal) {
        if (normal === void 0) { normal = Vec3_1.Vec3.UnitY; }
        var _this = _super.apply(this, vs) || this;
        _this.isCoPlanar = true;
        _this.normal = normal;
        return _this;
    }
    /**
     * 偏移
     * @param {Number} distance  偏移距离
     * @param {Vector3} normal  折线所在平面法线
     */
    Polyline.prototype.offset = function (distance, normal) {
        if (normal === void 0) { normal = this.normal; }
        var offsetSign = Math_1.sign(distance) > 0 ? type_1.Orientation.Positive : type_1.Orientation.Negative;
        var direction = Vec3_1.v3();
        var segments = []; //偏移过后的线段
        for (var i = 0; i < this.length - 1; i++) {
            var point = this[i];
            var pointNext = this[i + 1];
            var binormal = direction.sub(pointNext, point).normalize().cross(this.normal).normalize();
            var offsetVector = binormal.clone().multiplyScalar(distance);
            segments.push([offsetVector.clone().add(point), offsetVector.add(pointNext)]);
        }
        //线段两两相交
        for (var i = 0; i < segments.length; i++) {
            var segi = segments[i];
            for (var j = 0; j < segments.length; j++) {
                if (i === j)
                    continue;
                var segj = segments[j];
                var orien0 = segi.orientationSegment(segj.p0, normal);
                var orien1 = segi.orientationSegment(segj.fixedPoint1, normal);
                var orienInfo = orien0 | orien1;
                var disRes = segi.distanceSegment(segj);
                if (disRes.distance > Math_1.gPrecision) {
                    if (orienInfo !== offsetSign) {
                        segments.splice(j, 1);
                        j--;
                    }
                }
                else {
                    // 出现相交  那么就会有切割
                    var intersectPoit = disRes.closests[0];
                    //删除不要的部分
                }
            }
        }
        return new Polyline(this);
    };
    /**
     * 圆角   将折线拐点圆角化
     * @param {Number} useDistance 圆角段距离
     * @param {Number} segments 分切割段数
     */
    Polyline.prototype.corner = function (useDistance, segments, normal, threshold) {
        if (segments === void 0) { segments = 3; }
        if (normal === void 0) { normal = this.normal; }
        if (threshold === void 0) { threshold = 0.1; }
        var polyline = new Polyline();
        for (var i = 0; i < this.length - 2; i++) {
            // polyline.push(p0);
            // const p0 = this[i];
            // const p1 = this[i + 1];
            // const p2 = this[i + 2];
            // var fixedPoint0 = p0.distanceTo(p1).length() <= useDistance * 2 ? p0.clone().add(p1).multiplyScalar(0.5) : p0.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
            // var fixedPoint1 = p2.distanceTo(p1).length() <= useDistance * 2 ? p2.clone().add(p1).multiplyScalar(0.5) : p2.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
            // polyline.push(fixedPoint0);
            // var binormal0 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2);
            // var binormal1 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2);
            // //计算圆弧点
            // var line0 = new Line(fixedPoint0, binormal0.add(fixedPoint0));
            // var line1 = new Line(fixedPoint1, binormal1.add(fixedPoint1));
            // var center = line0.distanceLine(line1).closests[0];//圆心
            // polyline.push(fixedPoint1);
        }
        return polyline;
    };
    return Polyline;
}(ArrayEx_1.ArrayEx));
exports.Polyline = Polyline;
