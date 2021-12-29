import earcut from "earcut";
import { Vec3 } from '../math/Vec3';
import { flat } from '../utils/array';
import { clone, rotateByUnitVectors } from './common';
import { delta4 } from '../math/Math';
import vector from '../math/vector';

export enum AxisPlane {
    XY = 'xy',
    XZ = 'xz',
    YZ = 'yz',
    XYZ = 'xyz',
}

export interface ITriangulationOption {
    feature?: AxisPlane;
    dim?: number;
    normal?: Vec3;
}

/** 
 * 三角剖分  earcut.js
 * @param {Array} boundary 边界
 * @param {Array<Array>} holes 洞的数组
 * @param {options:{feature,dim,normal}} feature 选择平平面 
 * @returns {Array<Number>} 三角形索引数组
 */
export function triangulation(inboundary: any, holes: any[] = [], options: ITriangulationOption = { normal: Vec3.UnitZ }) {
    options = { feature: AxisPlane.XYZ, dim: 3, ...options }
    if (options.feature !== AxisPlane.XYZ)
        options.dim = 2;
    let boundary = null;
    let feature = options.feature;
    let dim = options.dim;
    let normal = options.normal;
    if (normal && normal.dot(Vec3.UnitZ) < 1 - delta4) {
        boundary = clone(inboundary);
        rotateByUnitVectors(boundary, normal, Vec3.UnitZ);
    } else {
        boundary = inboundary;
    }

    var allV = [...boundary, ...flat(holes)];
    var vertextNumbers: any | number[] = vector.verctorToNumbers(allV, feature);

    var holesIndex = [];
    var baseIndex = boundary.length;
    for (let i = -1; i < holes.length - 1; i++) {
        holesIndex.push(baseIndex);
        const hole = holes[i + 1];
        // holesIndex.push(baseIndex + hole.length);
        baseIndex += hole.length;
    }

    var result = earcut(vertextNumbers, holesIndex, dim);

    return result;
}