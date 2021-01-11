import { toGeoBuffer, IGeometryBuffer, indexable } from '../render/mesh';
import { Vec3 } from '../math/Vec3';
import { Vec2 } from '../math/Vec2';
import { extrude, IExtrudeOptions, linkSide, linkSides } from '../alg/extrude';
import { Polyline } from '../struct/3d/Polyline';
import { Polygon } from '../struct/3d/Polygon';
import { triangulation } from '../alg/trianglution';
import { flat } from '../utils/array';

export function toGeometryBuffer(vertices: number[] | Vec3[], triangles: number[], uvs: Vec2[] | number[] = []) {

    var buffer: IGeometryBuffer = toGeoBuffer(vertices, triangles, uvs)

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
    return toGeometryBuffer(extrudeRes.vertices, extrudeRes.triangles, extrudeRes.uvs);
}




/**
 * 两个轮廓缝合
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 * @param {*} material 
 */
export function linkToGeometry(shape: Polygon | Polyline | Array<Vec3>, shape1: Polygon | Polyline | Array<Vec3>, isClose: boolean = false) {
    const vertices = [...shape, ...shape1];
    indexable(vertices)
    const tris = linkSide(shape, shape1, isClose)

    const geometry = toGeometryBuffer(vertices, tris);

    return geometry;
}

/**
 * 多个轮廓缝合
 * @param shape 
 * @param isClose 
 * @param material 
 */
export function linksToGeometry(shape: (Polygon | Polyline | Array<Vec3>)[], isClose: boolean = false) {
    const vertices = flat(shape);
    indexable(vertices)
    const tris = linkSides(shape, isClose)

    const geometry = toGeometryBuffer(vertices, tris)

    return geometry
}

/**
 * 三角剖分后转成几何体
 * 只考虑XY平面
 * @param {*} boundary 
 * @param {*} hole 
 * @param {*} options 
 */
export function trianglutionToGeometryBuffer(boundary: any, holes: any[] = [], options: any = { normal: Vec3.UnitZ }) {
    var triangles = triangulation(boundary, holes, options)
    var vertices = [...boundary, ...flat(holes)]
    var uvs: any = [];
    vertices.reduce((acc, v) => {
        acc.push(v.x, v.y);
        return acc;
    }, uvs);

    var geometry = toGeometryBuffer(vertices, triangles, uvs);

    return geometry;
}