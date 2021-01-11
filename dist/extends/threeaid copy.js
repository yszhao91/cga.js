"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trianglutionToGeometryBuffer = exports.linksToMesh = exports.linkToMesh = exports.extrudeToMesh = exports.extrudeToGeometryBuffer = exports.toGeometryBuffer = void 0;
var THREE = __importStar(require("three"));
var mesh_1 = require("../render/mesh");
var Vec3_1 = require("../math/Vec3");
var extrude_1 = require("../alg/extrude");
var trianglution_1 = require("../alg/trianglution");
var array_1 = require("../utils/array");
function toGeometryBuffer(vertices, triangles, uvs) {
    if (uvs === void 0) { uvs = []; }
    var buffer = mesh_1.toGeoBuffer(vertices, triangles, uvs);
    var geometry = new THREE.BufferGeometry();
    if (buffer.indices)
        geometry.setIndex(new THREE.BufferAttribute(buffer.indices, 1));
    geometry.setAttribute('position', new THREE.BufferAttribute(buffer.vertices, 3));
    if (buffer.uvs)
        geometry.setAttribute('uv', new THREE.BufferAttribute(buffer.uvs, 2));
    geometry.computeVertexNormals();
    return geometry;
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
 *  shape 挤压后转Mesh
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 * @param {*} material
 */
function extrudeToMesh(shape, arg_path, options, material) {
    if (material === void 0) { material = new THREE.MeshStandardMaterial({ color: 0xeeaabb }); }
    var geometry = extrudeToGeometryBuffer(shape, arg_path, options);
    return new THREE.Mesh(geometry, material);
}
exports.extrudeToMesh = extrudeToMesh;
/**
 * 两个轮廓缝合
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 * @param {*} material
 */
function linkToMesh(shape, shape1, isClose, material) {
    if (isClose === void 0) { isClose = false; }
    if (material === void 0) { material = new THREE.MeshStandardMaterial({ color: 0xeeaabb }); }
    var vertices = __spreadArrays(shape, shape1);
    mesh_1.indexable(vertices);
    var tris = extrude_1.linkSide(shape, shape1, isClose);
    var geometry = toGeometryBuffer(vertices, tris);
    return new THREE.Mesh(geometry, material);
}
exports.linkToMesh = linkToMesh;
/**
 * 多个轮廓缝合
 * @param shape
 * @param isClose
 * @param material
 */
function linksToMesh(shape, isClose, material) {
    if (isClose === void 0) { isClose = false; }
    if (material === void 0) { material = new THREE.MeshStandardMaterial({ color: 0xeeaabb }); }
    var vertices = array_1.flat(shape);
    mesh_1.indexable(vertices);
    var tris = extrude_1.linkSides(shape, isClose);
    var geometry = toGeometryBuffer(vertices, tris);
    return new THREE.Mesh(geometry, material);
}
exports.linksToMesh = linksToMesh;
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
