"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var extrude_1 = require("../../alg/extrude");
var Math_1 = require("../../math/Math");
var Vec3_1 = require("../../math/Vec3");
var ArrayEx_1 = require("../data/ArrayEx");
var Line_1 = require("./Line");
var Segment_1 = require("./Segment");
/**
 *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
 */
var Polyline = /** @class */ (function (_super) {
    __extends(Polyline, _super);
    function Polyline(vs, normal) {
        if (vs === void 0) { vs = []; }
        if (normal === void 0) { normal = Vec3_1.Vec3.UnitY; }
        var _this = _super.call(this) || this;
        _this.normal = normal;
        _this.isPolyline = true;
        Object.setPrototypeOf(_this, Polyline.prototype);
        _this.push.apply(_this, vs);
        _this.isCoPlanar = true;
        return _this;
    }
    /**
     * 偏移
     * @param {Number} distance  偏移距离
     * @param {Vector3} normal  折线所在平面法线
     */
    Polyline.prototype.offset = function (distance, normal, endtype, jointype) {
        if (normal === void 0) { normal = Vec3_1.Vec3.UnitY; }
        if (endtype === void 0) { endtype = extrude_1.EndType.Butt; }
        if (jointype === void 0) { jointype = extrude_1.JoinType.Miter; }
        var segs = [];
        var _loop_1 = function (i) {
            var seg = new Segment_1.Segment(this_1[i].clone(), this_1[i + 1].clone());
            var segtangetvec = seg[1].clone().sub(seg[0]).normalize().applyAxisAngle(normal, Math.PI / 2).multiplyScalar(distance);
            seg.forEach(function (e) { return e.add(segtangetvec); });
            segs.push(seg);
        };
        var this_1 = this;
        for (var i = 0; i < this.length - 1; i++) {
            _loop_1(i);
        }
        for (var i = 0; i < segs.length - 1; i++) {
            var segi = segs[i];
            for (var j = i + 1; j < segs.length; j++) {
                var segj = segs[j];
                var disRes = segi.distanceSegment(segj);
                if (disRes.distance < Math_1.gPrecision) {
                    //相交
                    segj[0].copy(disRes.closests[0]);
                    segi[1].copy(disRes.closests[0]);
                }
                else {
                    //判断是否在内
                    // var i_o = segi.direction.clone().cross(segj.p0.clone().sub(segi.p0)).dot(normal);
                }
            }
        }
        var offsetPts = [];
        offsetPts.push(segs[0].p0);
        for (var i = 0; i < segs.length; i++) {
            var element = segs[i];
            offsetPts.push(element.p1);
        }
        return new Polyline(offsetPts);
    };
    /**
     * 圆角   将折线拐点圆角化
     * @param {Number} useDistance 圆角段距离
     * @param {Number} segments 分切割段数
     */
    Polyline.prototype.corner = function (useDistance, normal) {
        if (normal === void 0) { normal = this.normal; }
        var polyline = new Polyline();
        for (var i = 0; i < this.length - 2; i++) {
            var p0 = this[i];
            var p1 = this[i + 1];
            var p2 = this[i + 2];
            polyline.push(p0);
            var fixedPoint0 = p0.distanceTo(p1) <= useDistance * 2 ? p0.clone().add(p1).multiplyScalar(0.5) : p0.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
            var fixedPoint1 = p2.distanceTo(p1) <= useDistance * 2 ? p2.clone().add(p1).multiplyScalar(0.5) : p2.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
            polyline.push(fixedPoint0);
            var binormal0 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2);
            var binormal1 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2);
            //计算圆弧点
            var line0 = new Line_1.Line(fixedPoint0, binormal0.add(fixedPoint0));
            var line1 = new Line_1.Line(fixedPoint1, binormal1.add(fixedPoint1));
            polyline.push(fixedPoint1);
        }
        return polyline;
    };
    return Polyline;
}(ArrayEx_1.ArrayEx));
exports.Polyline = Polyline;
