/*
 * @Description  : 
 * @Author       : 赵耀圣
 * @Q群           : 632839661
 * @Date         : 2020-12-10 15:01:42
 * @LastEditTime : 2021-03-11 10:54:11
 * @FilePath     : \cga.js\src\extends\geometryaid.ts
 */
import { toGeoBuffer, indexable } from '../render/mesh';
import { Vec3 } from '../math/Vec3';
import { Vec2 } from '../math/Vec2';
import { extrude, IExtrudeOptions, linkSide, linkSides } from '../alg/extrude';
import { Polyline } from '../struct/3d/Polyline';
import { Polygon } from '../struct/3d/Polygon';
import { AxisPlane, triangulation } from '../alg/trianglution';
import { flat } from '../utils/array';
import { BufferGeometry, IBufferGeometry, IGeometry } from '../render/geometry';

export function toGeometryBuffer(geo: IGeometry) {

    var buffer: BufferGeometry = toGeoBuffer(geo.position, geo.index!, geo.uv)

    return buffer
}

/**
 * shape 挤压后转几何体
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 */
export function extrudeToGeometryBuffer(shape: Polygon | Polyline | Array<Vec3>, arg_path: Array<Vec3> | any, options: IExtrudeOptions) {
    var extrudeRes = extrude(shape, arg_path, options);
    return toGeoBuffer(extrudeRes.vertices, extrudeRes.index!, extrudeRes.uvs);
}


/**
 * 两个轮廓缝合
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 * @param {*} material 
 */
export function linkToGeometry(shape: Polygon | Polyline | Array<Vec2>, shape1: Polygon | Polyline | Array<Vec3>, axisPlane: AxisPlane = AxisPlane.XY, shapeClose: boolean = false) {
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
export function linksToGeometry(shapes: (Polygon | Polyline | Array<Vec3>)[], pathClosed: boolean = true, shapeClosed: boolean = true) {
    const vertices = flat(shapes);
    indexable(vertices)
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