import earcut from "earcut"
import { verctorToNumbers } from "./points";

/** 
 * 三角剖分  earcut.js
 * @param {Array} boundary 边界
 * @param {Array<Array>} holes 洞的数组
 * @param {String} feature 选择平平面
 * @param {Number} dim 维数
 */
export function trianglation(boundary, holes = [], feature = "xyz", dim = 3) {
    var allV = [...boundary, ...holes.flat(2)];
    var vertextNumbers = verctorToNumbers(allV, feature);

    var holesIndex = [];
    var baseIndex = boundary.length;
    for (let i = -1; i < holes.length - 1; i++)
    {
        holesIndex.push(baseIndex);
        const hole = holes[i + 1];
        holesIndex.push(baseIndex + hole.length);
    }

    var result = earcut(vertextNumbers, holesIndex, dim);

    return result;
}