"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInOnePlane = exports.recognitionPlane = exports.projectOnPlane = exports.reverseOnPlane = exports.simplifyPointList = exports.applyMat4 = exports.scale = exports.rotateByUnitVecs = exports.rotate = exports.translate = exports.applyQuat = exports.boundingBox = exports.verctorToNumbers = exports.VecCompare = void 0;
var Quat_1 = require("../math/Quat");
var Vec3_1 = require("../math/Vec3");
var Math_1 = require("../math/Math");
var Line_1 = require("../struct/3d/Line");
var Plane_1 = require("../struct/3d/Plane");
var common_1 = require("./common");
var _Vec = Vec3_1.v3();
/**
 * 点排序函数
 * @param {Vec*} a
 * @param {Vec*} b
 */
function VecCompare(a, b) {
    if (a.x === b.x) {
        if (a.z !== undefined && a.y === b.y)
            return a.z - b.z;
        else
            return a.y - b.y;
    }
    else
        return a.x - b.x;
}
exports.VecCompare = VecCompare;
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
 * 点集响应矩阵
 * @param {*} points
 * @param {*} Quat
 * @param {Boolean} ref 是否是引用
 */
function applyQuat(points, quat, ref) {
    if (ref === void 0) { ref = true; }
    if (ref) {
        points.flat(Infinity).forEach(function (point) {
            point.applyQuat(quat);
        });
        return points;
    }
    return applyQuat(common_1.clone(points), quat);
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
    return translate(common_1.clone(points));
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
function rotateByUnitVecs(points, vFrom, vTo, ref) {
    if (ref === void 0) { ref = true; }
    return applyQuat(points, new Quat_1.Quat().setFromUnitVecs(vFrom, vTo), ref);
}
exports.rotateByUnitVecs = rotateByUnitVecs;
/**
 * 缩放
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
function scale(points, scale, ref) {
    if (ref === void 0) { ref = true; }
    if (ref) {
        points.flat(Infinity).forEach(function (point) {
            point.scale.multiply(scale);
        });
        return points;
    }
    return scale(common_1.clone(points));
}
exports.scale = scale;
/**
 * 响应矩阵
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
function applyMat4(points, mat4, ref) {
    if (ref === void 0) { ref = true; }
    if (ref) {
        points.flat(Infinity).forEach(function (point) {
            point.applyMat4(mat4);
        });
        return points;
    }
    return applyMat4(common_1.clone(points), mat4);
}
exports.applyMat4 = applyMat4;
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
function projectOnPlane(points, plane, projectDirect, ref) {
    if (projectDirect === void 0) { projectDirect = plane.normal; }
    if (ref === void 0) { ref = true; }
    if (ref) {
        for (var i = 0; i < points.length; i++) {
            var pt = points[i];
            pt.projectDirectionOnPlane(plane, projectDirect);
        }
        return points;
    }
    else {
        return projectOnPlane(common_1.clone(points), plane, projectDirect);
    }
}
exports.projectOnPlane = projectOnPlane;
/**
 * 计算共面点集所在的平面
 * @param {Array<Vec3|Point>} points
 */
function recognitionPlane(points) {
    points.sort(VecCompare);
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
// export function 
