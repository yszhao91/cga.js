"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.triangulation = void 0;
var earcut_1 = __importDefault(require("earcut"));
var Vec3_1 = require("../math/Vec3");
var array_1 = require("../utils/array");
var common_1 = require("./common");
var Math_1 = require("../math/Math");
var pointset_1 = require("./pointset");
/**
 * 三角剖分  earcut.js
 * @param {Array} boundary 边界
 * @param {Array<Array>} holes 洞的数组
 * @param {options:{feature,dim,normal}} feature 选择平平面
 * @returns {Array<Number>} 三角形索引数组
 */
function triangulation(inboundary, holes, options) {
    if (holes === void 0) { holes = []; }
    if (options === void 0) { options = { normal: Vec3_1.Vec3.UnitZ }; }
    options = __assign({ feature: "xyz", dim: 3 }, options);
    var boundary = null;
    var feature = options.feature;
    var dim = options.dim;
    var normal = options.normal;
    if (normal.dot(Vec3_1.Vec3.UnitZ) < 1 - Math_1.gPrecision) {
        boundary = common_1.clone(inboundary);
        common_1.rotateByUnitVectors(boundary, normal, Vec3_1.Vec3.UnitZ);
    }
    else {
        boundary = inboundary;
    }
    var allV = __spreadArrays(boundary, array_1.flat(holes));
    var vertextNumbers = pointset_1.verctorToNumbers(allV, feature);
    var holesIndex = [];
    var baseIndex = boundary.length;
    for (var i = -1; i < holes.length - 1; i++) {
        holesIndex.push(baseIndex);
        var hole = holes[i + 1];
        holesIndex.push(baseIndex + hole.length);
    }
    var result = earcut_1.default(vertextNumbers, holesIndex, dim);
    return result;
}
exports.triangulation = triangulation;
