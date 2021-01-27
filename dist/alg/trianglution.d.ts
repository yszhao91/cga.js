/**
 * 三角剖分  earcut.js
 * @param {Array} boundary 边界
 * @param {Array<Array>} holes 洞的数组
 * @param {options:{feature,dim,normal}} feature 选择平平面
 * @returns {Array<Number>} 三角形索引数组
 */
export declare function triangulation(inboundary: any, holes?: any[], options?: any): number[];
