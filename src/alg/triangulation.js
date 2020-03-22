import earcut from "earcut"
import { verctorToNumbers, rotateByUnitVectors } from "./points";
import { recognitionPolygonNormal } from "../struct/3d/Polygon";
import { clone } from "../utils/array";
import { Vector3 } from "../math/Vector3";
import { gPrecision } from "../math/Math";

/** 
 * 三角剖分  earcut.js
 * @param {Array} boundary 边界
 * @param {Array<Array>} holes 洞的数组
 * @param {options:{feature,dim,normal}} feature 选择平平面 
 * @returns {Array<Number>} 三角形索引数组
 */
export function triangulation(inboundary, holes = [], options = { normal: Vector3.UnitZ }) {
    options = { feature: "xyz", dim: 3, ...options }
    let boundary = null;
    let feature = options.feature;
    let dim = options.dim;
    let normal = options.normal || recognitionPolygonNormal(inboundary);
    if (normal.dot(Vector3.UnitZ) < 1 - gPrecision) {
        boundary = clone(inboundary);
        rotateByUnitVectors(boundary, normal, Vector3.UnitZ);
    } else {
        boundary = inboundary;
    }

    var allV = [...boundary, ...holes.flat(2)];
    var vertextNumbers = verctorToNumbers(allV, feature);

    var holesIndex = [];
    var baseIndex = boundary.length;
    for (let i = -1; i < holes.length - 1; i++) {
        holesIndex.push(baseIndex);
        const hole = holes[i + 1];
        holesIndex.push(baseIndex + hole.length);
    }

    var result = earcut(vertextNumbers, holesIndex, dim);

    return result;
}