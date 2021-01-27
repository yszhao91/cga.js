"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recognitionPolygonNormal = exports.recognitionCCW = exports.recognitionPlane = void 0;
var Line_1 = require("../struct/3d/Line");
var sort_1 = require("./sort");
var Plane_1 = require("../struct/3d/Plane");
/**
 * 计算共面点集所在的平面 前提是所有的点都在一个平面上
 * @param {Array<Vec3>} points
 */
function recognitionPlane(points) {
    points.sort(sort_1.vectorCompare);
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
 * 识别多边形顺逆时针  格林求和 投影到XY平面
 * @param points
 */
function recognitionCCW(points) {
    var d = 0;
    for (var i = 0; i < points.length - 1; i++) {
        var p = points[i];
        var p1 = points[i + 1];
        d += -0.5 * (p1.y + p.y) * (p1.x + p.x);
    }
    return d > 0;
}
exports.recognitionCCW = recognitionCCW;
/**
 * robust 识别出点集或者多边形的法线
 * @param {Polygon|Array<Point|Vector3>} points
 * @returns {Vector3} 法线
 */
function recognitionPolygonNormal(points) {
    return recognitionPlane(points).normal;
}
exports.recognitionPolygonNormal = recognitionPolygonNormal;
