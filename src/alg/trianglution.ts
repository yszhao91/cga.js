import earcut from "earcut";
import { Vec3 } from '../math/Vec3';
import { flat } from '../utils/array';
import { clone, rotateByUnitVectors } from './common';
import { gPrecision } from '../math/Math';
import { verctorToNumbers } from './pointset';

/** 
 * 三角剖分  earcut.js
 * @param {Array} boundary 边界
 * @param {Array<Array>} holes 洞的数组
 * @param {options:{feature,dim,normal}} feature 选择平平面 
 * @returns {Array<Number>} 三角形索引数组
 */
export function triangulation(inboundary: any, holes: any[] = [], options: any = { normal: Vec3.UnitZ }) {
    options = { feature: "xyz", dim: 3, ...options }
    let boundary = null;
    let feature = options.feature;
    let dim = options.dim;
    let normal = options.normal;
    if (normal.dot(Vec3.UnitZ) < 1 - gPrecision) {
        boundary = clone(inboundary);
        rotateByUnitVectors(boundary, normal, Vec3.UnitZ);
    } else {
        boundary = inboundary;
    }

    var allV = [...boundary, ...flat(holes)];
    var vertextNumbers: any | number[] = verctorToNumbers(allV, feature);

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