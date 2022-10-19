/*
 * @Description  : 
 * @Author       : 赵耀圣
 * @Q群           : 632839661
 * @Date         : 2020-12-10 15:01:42
 * @LastEditTime : 2021-03-11 10:54:11
 * @FilePath     : \cga.js\src\extends\geometryaid.ts
 */
import { Vec3 } from '../math/Vec3';
import { extrude_obsolete, IExtrudeOptions, linkSides } from '../alg/extrude';
import { AxisPlane } from '../alg/trianglution';
import { flat } from '../utils/array';
import { BufferGeometry, IGeometry } from '../render/geometry';
import { ArrayList } from '../struct/data/ArrayList';
import { MeshTool } from '../render/mesh';

export function toGeometryBuffer(geo: IGeometry) {

    var buffer: BufferGeometry = MeshTool.toGeoBuffer(geo.position, geo.index!, geo.uv)

    return buffer
}

/**
 * shape 挤压后转几何体
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 */
export function extrudeToGeometryBuffer(shape: ArrayList<Vec3>, arg_path: Array<Vec3>, options: IExtrudeOptions) {
    var extrudeRes = extrude_obsolete(shape, arg_path, options);
    return MeshTool.toGeoBuffer(extrudeRes.vertices, extrudeRes.index!, extrudeRes.uvs);
}


/**
 * 两个轮廓缝合
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 * @param {*} material 
 */
export function linkToGeometry(shape: Array<Vec3>, shape1: | Array<Vec3>, axisPlane: AxisPlane = AxisPlane.XY, shapeClose: boolean = false) {
    const geo: IGeometry = linkSides({ shapes: [shape, shape1], shapeClosed: shapeClose, orgShape: shape, axisPlane: axisPlane })

    const geometry = toGeometryBuffer(geo);

    return geometry;
}

/** 
 * 多个轮廓缝合
 * @param shapes 
 * @param isClose 
 * @param material 
 */
export function linksToGeometry(shapes: Array<Vec3>[], pathClosed: boolean = true, shapeClosed: boolean = true) {
    const vertices = flat(shapes);
    MeshTool.indexable(vertices)
    const geo = linkSides({ shapes, shapeClosed: pathClosed, orgShape: shapes[0] });

    const geometry = toGeometryBuffer(geo)

    return geometry;
}

// /**
//  * 三角剖分后转成几何体
//  * 只考虑XY平面
//  * @param {*} boundary
//  * @param {*} hole
//  * @param {*} options
//  */
// export function trianglutionToGeometryBuffer(boundary: any, holes: any[] = [], options: any = { normal: Vec3.UnitZ }) {
//     var triangles = triangulation(boundary, holes, options)
//     var vertices = [...boundary, ...flat(holes)]
//     var uvs: any = [];
//     vertices.reduce((acc, v) => {
//         acc.push(v.x, v.y);
//         return acc;
//     }, uvs);

//     var geometry = toGeometryBuffer(vertices, triangles, uvs);

//     return geometry;
// }