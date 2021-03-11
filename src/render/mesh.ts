/*
 * @Description  : 
 * @Author       : 赵耀圣
 * @Q群           : 632839661
 * @Date         : 2020-12-10 15:01:42
 * @LastEditTime : 2021-03-11 09:09:57
 * @FilePath     : \cga.js\src\render\mesh.ts
 */
import { Vec3 } from "../math/Vec3";
import { Vec2 } from "../math/Vec2";
import { flat, forall } from '../utils/array';
import { BufferGeometry } from "./geometry";
import { BufferAttribute } from "./buffer-attribute";
import { Vec4 } from "../math/Vec4";
import { TypedArray } from "./types";
import { triangulation } from "../alg/trianglution";



export function indexable(obj: any[] | any, refIndexInfo = { index: 0 }, force = false) {
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

export function triangListToBuffer(vertices: Vec3[], triangleList: Vec3[]) {
    indexable(triangleList);
    const indices: number[] = [];
    forall(triangleList, (v: Vec3 | any) => {
        indices.push(v.index);
    })
    return toGeoBuffer(vertices, indices);
}


/**
 * 顶点纹理坐标所以转化为buffer数据
 * @param {Array<Verctor3|Number>} vertices 
 * @param {Array<Number>} indices
 * @param {Array<Verctor2|Number>} uvs
 */
export function toGeoBuffer(vertices: BufferAttribute | Array<number | Vec2 | Vec3 | Vec4> | TypedArray, indices: number[] | Uint32Array | Uint16Array, uvs?: BufferAttribute | TypedArray | Array<Vec2 | number>): BufferGeometry {
    const geometry = new BufferGeometry();
    geometry.addAttribute('position', vertices, 3)
    geometry.addAttribute('uv', uvs || new Float32Array(geometry.getAttribute('position').array.length / 3 * 2), 2)
    geometry.setIndex(indices)
    return geometry;
}





/**
 * 三角剖分后转成几何体
 * 只考虑XY平面
 * @param {*} boundary 
 * @param {*} hole 
 * @param {*} options 
 */
export function trianglutionToGeometryBuffer(boundary: any, holes: any[] = [], options: any = { normal: Vec3.UnitZ }): BufferGeometry {
    var triangles = triangulation(boundary, holes, options)
    var vertices = [...boundary, ...flat(holes)]
    var uvs: any = [];

    vertices.forEach(v => {
        uvs.push(v.x, v.z);
    })
    var geometry = toGeoBuffer(vertices, triangles, uvs);

    return geometry;
}
