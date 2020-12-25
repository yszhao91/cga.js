"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trianglutionToGeometryBuffer = exports.linksToGeometry = exports.linkToGeometry = exports.extrudeToGeometryBuffer = exports.toGeometryBuffer = void 0;
var mesh_1 = require("../render/mesh");
var Vec3_1 = require("../math/Vec3");
var extrude_1 = require("../alg/extrude");
var trianglution_1 = require("../alg/trianglution");
var array_1 = require("../utils/array");
function toGeometryBuffer(vertices, triangles, uvs) {
    if (uvs === void 0) { uvs = []; }
    var buffer = mesh_1.toGeoBuffer(vertices, triangles, uvs);
    return buffer;
}
exports.toGeometryBuffer = toGeometryBuffer;
/**
 * shape 挤压后转几何体
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 */
function extrudeToGeometryBuffer(shape, arg_path, options) {
    var extrudeRes = extrude_1.extrude(shape, arg_path, options);
    return toGeometryBuffer(extrudeRes.vertices, extrudeRes.triangles, extrudeRes.uvs);
}
exports.extrudeToGeometryBuffer = extrudeToGeometryBuffer;
/**
 * 两个轮廓缝合
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 * @param {*} material
 */
function linkToGeometry(shape, shape1, isClose) {
    if (isClose === void 0) { isClose = false; }
    var vertices = __spreadArrays(shape, shape1);
    mesh_1.indexable(vertices);
    var tris = extrude_1.linkSide(shape, shape1, isClose);
    var geometry = toGeometryBuffer(vertices, tris);
    return geometry;
}
exports.linkToGeometry = linkToGeometry;
/**
 * 多个轮廓缝合
 * @param shape
 * @param isClose
 * @param material
 */
function linksToGeometry(shape, isClose) {
    if (isClose === void 0) { isClose = false; }
    var vertices = array_1.flat(shape);
    mesh_1.indexable(vertices);
    var tris = extrude_1.linkSides(shape, isClose);
    var geometry = toGeometryBuffer(vertices, tris);
    return geometry;
}
exports.linksToGeometry = linksToGeometry;
/**
 * 三角剖分后转成几何体
 * 只考虑XY平面
 * @param {*} boundary
 * @param {*} hole
 * @param {*} options
 */
function trianglutionToGeometryBuffer(boundary, holes, options) {
    if (holes === void 0) { holes = []; }
    if (options === void 0) { options = { normal: Vec3_1.Vec3.UnitZ }; }
    var triangles = trianglution_1.triangulation(boundary, holes, options);
    var vertices = __spreadArrays(boundary, array_1.flat(holes));
    var uvs = [];
    vertices.reduce(function (acc, v) {
        acc.push(v.x, v.y);
        return acc;
    }, uvs);
    var geometry = toGeometryBuffer(vertices, triangles, uvs);
    return geometry;
}
exports.trianglutionToGeometryBuffer = trianglutionToGeometryBuffer;
