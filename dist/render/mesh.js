"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGeoBuffer = exports.triangListToBuffer = exports.indexable = void 0;
var Vec3_1 = require("../math/Vec3");
var Vec2_1 = require("../math/Vec2");
var array_1 = require("../utils/array");
function indexable(obj, refIndexInfo, force) {
    if (refIndexInfo === void 0) { refIndexInfo = { index: 0 }; }
    if (force === void 0) { force = false; }
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++)
            indexable(obj[i], refIndexInfo);
    }
    else if (obj instanceof Object) {
        if (obj.index === undefined)
            obj.index = refIndexInfo.index++;
        else if (force)
            obj.index = refIndexInfo.index++;
    }
}
exports.indexable = indexable;
function triangListToBuffer(vertices, triangleList) {
    indexable(triangleList);
    var indices = [];
    array_1.forall(triangleList, function (v) {
        indices.push(v.index);
    });
    return toGeoBuffer(vertices, indices);
}
exports.triangListToBuffer = triangListToBuffer;
/**
 * 顶点纹理坐标所以转化为buffer数据
 * @param {Array<Verctor3|Number>} vertices
 * @param {Array<Number>} indices
 * @param {Array<Verctor2|Number>} uvs
 */
function toGeoBuffer(inVertices, indices, inUvs) {
    if (inUvs === void 0) { inUvs = []; }
    var vertices = [];
    if (Vec3_1.Vec3.isVec3(inVertices[0])) {
        for (var i = 0; i < inVertices.length; i++) {
            var v = inVertices[i];
            vertices.push(v.x, v.y, v.z);
        }
    }
    else {
        vertices = inVertices;
    }
    var uvs = [];
    if (inUvs.length > 0 && Vec2_1.Vec2.isVec2(inUvs[0])) {
        for (var i = 0; i < inUvs.length; i++) {
            var uv = inUvs[i];
            uvs.push(uv.x, uv.y);
        }
    }
    else {
        uvs = inUvs;
    }
    var verticesBuffer = new Float32Array(vertices);
    var uvsBuffer = uvs.length === 0 ? new Float32Array(vertices.length / 3 * 2) : new Float32Array(uvs);
    var indicesBuffer;
    if (indices instanceof Uint32Array || indices instanceof Uint16Array)
        indicesBuffer = indices;
    else
        indicesBuffer = new ((verticesBuffer.length / 3) > 65535 ? Uint32Array : Uint16Array)(indices);
    return {
        vertices: verticesBuffer,
        uvs: uvsBuffer,
        indices: indicesBuffer
    };
}
exports.toGeoBuffer = toGeoBuffer;
