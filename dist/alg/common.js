"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.angle = exports.calcCircleFromThreePoint = exports.pointsCollinear = exports.isInOnePlane = exports.recognitionPlane = exports.projectOnPlane = exports.reverseOnPlane = exports.simplifyPointList = exports.applyMatrix4 = exports.scale = exports.rotateByUnitVectors = exports.rotate = exports.translate = exports.applyQuat = exports.boundingBox = exports.verctorToNumbers = exports.vectorCompare = exports.clone = void 0;
var Vec3_1 = require("../math/Vec3");
var Math_1 = require("../math/Math");
var Line_1 = require("../struct/3d/Line");
var Circle_1 = require("../struct/3d/Circle");
var Quat_1 = require("../math/Quat");
var Plane_1 = require("../struct/3d/Plane");
var XYZSort = function (e1, e2) {
    if (e1.x !== e2.x)
        return e1.x - e2.x;
    else if (e1.y !== e2.y)
        return e1.y - e2.y;
    else
        return e1.z - e2.z;
};
var _vector = Vec3_1.v3();
/**
 * 数组深度复制
 * @param {Array} array
 */
function clone(array) {
    var result = new Array();
    for (var i = 0; i < array.length; i++) {
        var ele = array[i];
        if (ele instanceof Number || ele instanceof String)
            result[i] = ele;
        else if (ele.clone) {
            result[i] = ele.clone();
        }
        else if (ele instanceof Array)
            result[i] = clone(ele);
        else
            throw ("数组有元素不能clone");
    }
    return result;
}
exports.clone = clone;
/**
 * 点排序函数
 * @param {Vector*} a
 * @param {Vector*} b
 */
function vectorCompare(a, b) {
    if (a.x === b.x) {
        if (a.z !== undefined && a.y === b.y)
            return a.z - b.z;
        else
            return a.y - b.y;
    }
    else
        return a.x - b.x;
}
exports.vectorCompare = vectorCompare;
/**
 * 将向量拆解为数字
 * @param {Array} points
 * @param {String} feature
 * @returns {Array<Number>} 数字数组
 */
function verctorToNumbers(points, feature) {
    if (feature === void 0) { feature = "xyz"; }
    if (!(points instanceof Array)) {
        console.error("传入参数必须是数组");
        return;
    }
    var numbers = [];
    if (points[0].x !== undefined && points[0].y !== undefined && points[0].z !== undefined) {
        for (var i = 0; i < points.length; i++) {
            for (var j = 0; j < feature.length; j++) {
                numbers.push(points[i][feature[j]]);
            }
        }
    }
    else if (points[0].x !== undefined && points[0].y !== undefined)
        for (var i = 0; i < points.length; i++) {
            numbers.push(points[i].x);
            numbers.push(points[i].y);
        }
    else if (points[0] instanceof Array) {
        for (var i = 0; i < points.length; i++) {
            numbers = numbers.concat(verctorToNumbers(points[i]));
        }
    }
    else {
        console.error("数组内部的元素不是向量");
    }
    return numbers;
}
exports.verctorToNumbers = verctorToNumbers;
/**
 * 计算包围盒
 * @param {*} points  点集
 * @returns {Array[min,max]} 返回最小最大值
 */
function boundingBox(points) {
    var min = new Vec3_1.Vec3(+Infinity, +Infinity, +Infinity);
    var max = new Vec3_1.Vec3(-Infinity, -Infinity, -Infinity);
    for (var i = 0; i < points.length; i++) {
        min.min(points[i]);
        max.max(points[i]);
    }
    return [min, max];
}
exports.boundingBox = boundingBox;
/**
 *
 * @param {*} points
 * @param {*} Quat
 * @param {Boolean} ref 是否是引用
 */
function applyQuat(points, Quat, ref) {
    if (ref === void 0) { ref = true; }
    if (ref) {
        points.flat(Infinity).forEach(function (point) {
            point.applyQuat(Quat);
        });
        return points;
    }
    return applyQuat(clone(points), Quat);
}
exports.applyQuat = applyQuat;
/**
 * 平移
 * @param {*} points
 * @param {*} distance
 * @param {*} ref
 */
function translate(points, distance, ref) {
    if (ref === void 0) { ref = true; }
    if (ref) {
        points.flat(Infinity).forEach(function (point) {
            point.add(distance);
        });
        return points;
    }
    return translate(clone(points), distance);
}
exports.translate = translate;
/**
 * 旋转
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
function rotate(points, axis, angle, ref) {
    if (ref === void 0) { ref = true; }
    return applyQuat(points, new Quat_1.Quat().setFromAxisAngle(axis, angle), ref);
}
exports.rotate = rotate;
/**
 * 两个向量之间存在的旋转量来旋转点集
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
function rotateByUnitVectors(points, vFrom, vTo, ref) {
    if (ref === void 0) { ref = true; }
    return applyQuat(points, new Quat_1.Quat().setFromUnitVecs(vFrom, vTo), ref);
}
exports.rotateByUnitVectors = rotateByUnitVectors;
/**
 * 缩放
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
function scale(points, _scale, ref) {
    if (ref === void 0) { ref = true; }
    if (ref) {
        points.flat(Infinity).forEach(function (point) {
            point.scale.multiply(_scale);
        });
        return points;
    }
    return scale(clone(points), _scale);
}
exports.scale = scale;
/**
 * 响应矩阵
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
function applyMatrix4(points, matrix, ref) {
    if (ref === void 0) { ref = true; }
    if (ref) {
        points.flat(Infinity).forEach(function (point) {
            point.applyMatrix4(matrix);
        });
        return points;
    }
    return applyMatrix4(clone(points), matrix);
}
exports.applyMatrix4 = applyMatrix4;
/**
 * 简化点集数组，折线，路径
 * @param {*} points 点集数组，折线，路径 ,继承Array
 * @param {*} maxDistance  简化最大距离
 * @param {*} maxAngle  简化最大角度
 */
function simplifyPointList(points, maxDistance, maxAngle) {
    if (maxDistance === void 0) { maxDistance = 0.1; }
    if (maxAngle === void 0) { maxAngle = Math.PI / 180 * 5; }
    for (var i = 0; i < points.length; i++) {
        // 删除小距离
        var P = points[i];
        var nextP = points[i + 1];
        if (P.distanceTo(nextP) < maxDistance) {
            if (i === 0)
                points.remove(i + 1, 1);
            else if (i === points.length - 2)
                points.splice(i, 1);
            else {
                points.splice(i, 2, P.clone().add(nextP).multiplyScalar(0.5));
            }
            i--;
        }
    }
    for (var i = 1; i < points.length - 1; i++) {
        // 删除小小角度
        var preP = points[i - 1];
        var P = points[i];
        var nextP = points[i + 1];
        if (Math.acos(P.clone().sub(preP).normalize().dot(nextP.clone().sub(P).normalize())) < maxAngle) {
            points.splice(i, 1);
            i--;
        }
    }
    return points;
}
exports.simplifyPointList = simplifyPointList;
/**
 * 以某个平面生成对称镜像
 * @param {*} points  点集
 * @param {*} plane 对称镜像平面
 */
function reverseOnPlane(points, plane) {
}
exports.reverseOnPlane = reverseOnPlane;
/**
 * 投影到平面
 * @param {*} points 点集
 * @param {*} plane  投影平面
 * @param {*} projectDirect  默认是法线的方向
 */
function projectOnPlane(points, plane, projectDirect) {
    return points;
}
exports.projectOnPlane = projectOnPlane;
/**
 * 计算共面点集所在的平面
 * @param {Array<Vec3|Point>} points
 */
function recognitionPlane(points) {
    points.sort(vectorCompare);
    var line = new Line_1.Line(points[0], points.get(-1));
    var maxDistance = -Infinity;
    var ipos = -1;
    for (var i = 1; i < points.length - 1; i++) {
        var pt = points[i];
        var distance = line.distancePoint(pt).distance;
        if (distance > maxDistance) {
            maxDistance = distance;
            ipos = i;
        }
    }
    var plane = new Plane_1.Plane();
    plane.setFromThreePoint(points[0], points.get(-1), points[ipos]);
    return plane;
}
exports.recognitionPlane = recognitionPlane;
/**
 * 判断所有点是否在同一个平面
 * @param {Array<Vec3|Point>} points
 * @param {*} precision
 * @returns {Boolean|Plane} 如果在同一个平面返回所在平面，否则返回false
 */
function isInOnePlane(points, precision) {
    if (precision === void 0) { precision = Math_1.gPrecision; }
    var plane = recognitionPlane(points);
    for (var i = 0; i < points.length; i++) {
        var pt = points[i];
        if (plane.distancePoint(pt) >= precision)
            return false;
    }
    return plane;
}
exports.isInOnePlane = isInOnePlane;
/**
 * 判断多边是否共线:
 * 考虑情况点之间的距离应该大于最小容忍值
 * @param  {...Vec3[]} ps
 */
function pointsCollinear() {
    var ps = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        ps[_i] = arguments[_i];
    }
    ps.sort(XYZSort);
    var sedir = ps[ps.length - 1].clone().sub(ps[0]);
    var selen = ps[ps.length - 1].distanceTo(ps[0]);
    for (var i = 1; i < ps.length - 1; i++) {
        var ilens = ps[i].distanceTo(ps[0]);
        var ilene = ps[i].distanceTo(ps[ps.length - 1]);
        if (ilens < ilene) {
            if (Math.abs(ps[i].clone().sub(ps[0]).dot(sedir) - selen * ilens) > Math_1.gPrecision)
                return false;
        }
        else {
            if (Math.abs(ps[i].clone().sub(ps[ps.length - 1]).dot(sedir) - selen * ilene) > Math_1.gPrecision)
                return false;
        }
    }
    return true;
}
exports.pointsCollinear = pointsCollinear;
/**
 * 三点计算圆
 * @param p0
 * @param p1
 * @param p2
 */
function calcCircleFromThreePoint(p0, p1, p2) {
    return new Circle_1.Circle().setFrom3Points(p0, p1, p2);
}
exports.calcCircleFromThreePoint = calcCircleFromThreePoint;
function angle(v0, v1, normal) {
    return v0.angleTo(v1, normal);
}
exports.angle = angle;
