import * as THREE from "three"
import { toGeoBuffer, IGeometryBuffer, indexable } from '../render/mesh';
import { Vec3 } from '../math/Vec3';
import { Vec2 } from '../math/Vec2';
import { extrude, IExtrudeOptions, linkSide, linkSides } from '../alg/extrude';
import { Polyline } from '../struct/3d/Polyline';
import { Polygon } from '../struct/3d/Polygon';
import { triangulation } from '../alg/trianglution';
import { flat } from '../utils/array';

export function toGeometryBuffer(vertices: number[] | Vec3[], triangles: number[] | Uint32Array, uvs: Vec2[] | number[] = []) {

    var buffer: IGeometryBuffer = toGeoBuffer(vertices, triangles, uvs)

    var geometry = new THREE.BufferGeometry()
    if (buffer.indices)
        geometry.setIndex(new THREE.BufferAttribute(buffer.indices, 1));
    geometry.setAttribute('position', new THREE.BufferAttribute(buffer.vertices, 3));
    if (buffer.uvs)
        geometry.setAttribute('uv', new THREE.BufferAttribute(buffer.uvs, 2));
    geometry.computeVertexNormals();

    return geometry
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
 *  shape 挤压后转Mesh
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 * @param {*} material 
 */
export function extrudeToMesh(shape: Polygon | Polyline | Array<Vec3>, arg_path: Array<Vec3> | any, options: IExtrudeOptions, material: any = new THREE.MeshStandardMaterial({ color: 0xeeaabb })) {
    var geometry = extrudeToGeometryBuffer(shape, arg_path, options)
    return new THREE.Mesh(geometry, material);
}


/**
 * 两个轮廓缝合
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 * @param {*} material 
 */
export function linkToMesh(shape: Polygon | Polyline | Array<Vec3>, shape1: Polygon | Polyline | Array<Vec3>, isClose: boolean = false, material: any = new THREE.MeshStandardMaterial({ color: 0xeeaabb })) {
    const vertices = [...shape, ...shape1];
    indexable(vertices)
    const tris = linkSide(shape, shape1, isClose)

    const geometry = toGeometryBuffer(vertices, tris)

    return new THREE.Mesh(geometry, material);
}

/**
 * 多个轮廓缝合
 * @param shape 
 * @param isClose 
 * @param material 
 */
export function linksToMesh(shape: (Polygon | Polyline | Array<Vec3>)[], isClose: boolean = false, material: any = new THREE.MeshStandardMaterial({ color: 0xeeaabb })) {
    const vertices = flat(shape);
    indexable(vertices)
    const tris = linkSides(shape, isClose)

    const geometry = toGeometryBuffer(vertices, tris)

    return new THREE.Mesh(geometry, material);
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

