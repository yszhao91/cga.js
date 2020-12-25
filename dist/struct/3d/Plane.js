"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plane = void 0;
var Vec3_1 = require("../../math/Vec3");
var Math_1 = require("../../math/Math");
var type_1 = require("../data/type");
var Plane = /** @class */ (function () {
    function Plane(normal, w) {
        if (normal === void 0) { normal = Vec3_1.Vec3.UnitZ; }
        if (w === void 0) { w = 0; }
        this.normal = normal;
        this.w = w;
        this.origin = this.normal.clone().multiplyScalar(w);
        // this.w = this.normal.dot(this.origin)
    }
    Plane.setFromPointNormal = function (p, normal) {
        var plane = new Plane();
        plane.setFromPointNormal(p, normal);
        return plane;
    };
    Plane.prototype.setFromPointNormal = function (p, normal) {
        this.normal = normal;
        this.w = p.dot(normal);
    };
    Plane.prototype.setFromThreePoint = function (p0, p1, p2) {
        this.normal = p1.clone().sub(p0).cross(p2.clone().sub(p0)).normalize();
        this.w = p0.dot(this.normal);
    };
    Plane.prototype.negate = function () {
        this.normal.negate();
        this.w = -this.w;
    };
    /**
     * 判断一个点在平面的正面或者反面
     * @param  {Vec3} point
     * @returns {Number} -1 or 1 or z
     */
    Plane.prototype.frontback = function (point) {
        var value = this.normal.dot(point);
        if (Math_1.approximateEqual(value, 0))
            return 0;
        return Math_1.sign(this.normal.dot(point));
    };
    //---Distance-------------------------------------------------------------------------------
    Plane.prototype.distancePoint = function (point) {
        return this.normal.dot(point) - this.w;
    };
    Plane.prototype.distanceRay = function (ray) {
    };
    Plane.prototype.distanceLine = function (line) {
    };
    Plane.prototype.distanceSegment = function (segment) {
    };
    Plane.prototype.distancePlane = function (plane) {
    };
    //---Intersect-----------------------------------
    /**
     * 只返回交点
     * Lw --Lightweight
     * @param {Segment|Array<Vector3></Vector3>} segment
     */
    Plane.prototype.intersectSegmentLw = function (segment) {
        var orientation0 = this.orientationPoint(segment[0]);
        var orientation1 = this.orientationPoint(segment[0]);
        var orientation = orientation0 | orientation1;
        if (orientation === type_1.Orientation.Common)
            return segment;
        if (orientation === type_1.Orientation.Intersect) {
            var dist = segment[0].clone().sub(this.origin).dot(this.normal);
            var intersectPoint = this.normal.clone().multiplyScalar(dist).add(segment[0]);
            return intersectPoint;
        }
        return null;
    };
    /**
       * 切割线段 代码完成  等待测试
       * @param {Segment} segment
       * @returns {
          *       positive: [], //正面点
          *       negative: [],// 反面位置点
          *       common: [], 在平面上的点
          *       orientation: Orientation.None 线段的总体位置
          *   };
          */
    Plane.prototype.splitSegment = function (segment) {
        var result = {
            positive: [],
            negative: [],
            common: [],
            orientation: type_1.Orientation.None
        };
        var orientation0 = this.orientationPoint(segment[0]);
        var orientation1 = this.orientationPoint(segment[1]);
        var orientation = orientation0 | orientation1;
        result.orientation = orientation;
        if (orientation0 === type_1.Orientation.Positive)
            result.positive.push(segment[0]);
        else if (orientation0 === type_1.Orientation.Negative)
            result.negative.push(segment[0]);
        else
            result.common.push(segment[0]);
        if (orientation1 === type_1.Orientation.Positive)
            result.positive.push(segment[1]);
        else if (orientation1 === type_1.Orientation.Negative)
            result.negative.push(segment[1]);
        else
            result.common.push(segment[1]);
        if (orientation === type_1.Orientation.Intersect) {
            var dist = segment[0].clone().sub(this.origin).dot(this.normal);
            var intersectPoint = this.normal.clone().multiplyScalar(dist).add(segment[0]);
            result.positive.push(intersectPoint);
            result.negative.push(intersectPoint);
        }
        return result;
    };
    /**
     * 切割三角形 编码完成  等待测试
     * @param {Triangle} triangle
     */
    Plane.prototype.splitTriangle = function (triangle) {
        var _a, _b, _c;
        var result = {
            negative: [],
            positive: [], common: [], orientation: type_1.Orientation.None
        };
        var scope = this;
        var orientations = triangle.map(function (p) { return scope.orientationPoint(p); });
        var consis = 0;
        var pos = 0;
        var neg = 0;
        for (var i_1 = 0; i_1 < triangle.length; i_1++) {
            var orientation = orientations[i_1];
            if (orientation === type_1.Orientation.Positive)
                pos++;
            else if (orientation === type_1.Orientation.Negative)
                neg++;
            else
                consis++;
        }
        // var hasConsis = consis > 0;
        var hasFront = pos > 0;
        var hasBack = neg > 0;
        var negTris = result.positive, posTris = result.negative;
        if (hasBack && !hasFront) {
            //反面
            result.orientation = type_1.Orientation.Negative;
            (_a = result.negative).push.apply(_a, triangle);
        }
        else if (!hasBack && hasFront) {
            //正面 
            result.orientation = type_1.Orientation.Positive;
            (_b = result.positive).push.apply(_b, triangle);
        }
        else if (hasFront && hasBack) {
            //相交 共面点最多只有一个
            result.orientation = type_1.Orientation.Intersect;
            for (var i = 0; i < 3; i++) {
                if (orientations[i] || orientations[(i + 1) % 3] === type_1.Orientation.Intersect) {
                    if (orientations[i] === type_1.Orientation.Positive) {
                        posTris.push(triangle[i]);
                    }
                    else if (orientations[i] == type_1.Orientation.Negative) {
                        negTris.push(triangle[i]);
                    }
                    else {
                        negTris.push(triangle[i]);
                        posTris.push(triangle[i]);
                        result.common.push(triangle[i]);
                    }
                    var intersectPoint = this.intersectSegmentLw([triangle[i], triangle[(i + 1) % 3]]);
                    if (intersectPoint) {
                        if (!Array.isArray(intersectPoint))
                            result.common.push(intersectPoint);
                    }
                }
            }
        }
        else {
            // 三点共面
            result.orientation = type_1.Orientation.Common;
            (_c = result.common).push.apply(_c, triangle);
        }
        return result;
    };
    //---orientation------------------------------
    /**
     * 点在平面的位置判断
     * @param {Point} point
     * @returns {Orientation} 方位
     */
    Plane.prototype.orientationPoint = function (point) {
        var signDistance = this.normal.clone().dot(point) - this.w;
        if (Math.abs(signDistance) < Math_1.gPrecision)
            return type_1.Orientation.Intersect;
        else if (signDistance < 0)
            return type_1.Orientation.Negative;
        else /* if (signDistance > 0) */
            return type_1.Orientation.Positive;
    };
    return Plane;
}());
exports.Plane = Plane;
