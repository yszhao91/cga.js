"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toGeoBuffer = exports.triangListToBuffer = exports.indexable = void 0;
var array_1 = require("../utils/array");
var geometry_1 = require("./geometry");
var _three_0_116_1_three_1 = require("_three@0.116.1@three");
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
function toGeoBuffer(vertices, indices, uvs) {
    var geometry = new geometry_1.BufferGeometry();
    geometry.addAttribute('position', vertices, 3);
    geometry.addAttribute('uv', new Float32Array(geometry.getAttribute('position').array.length / 3 * 2), 2);
    geometry.setIndex(indices);
    return geometry;
}
exports.toGeoBuffer = toGeoBuffer;
_three_0_116_1_three_1.Float64BufferAttribute;
