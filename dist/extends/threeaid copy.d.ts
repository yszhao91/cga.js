import * as THREE from "three";
import { Vec3 } from '../math/Vec3';
import { Vec2 } from '../math/Vec2';
import { IExtrudeOptions } from '../alg/extrude';
import { Polyline } from '../struct/3d/PolyLine';
import { Polygon } from '../struct/3d/Polygon';
export declare function toGeometryBuffer(vertices: number[] | Vec3[], triangles: number[] | Uint32Array, uvs?: Vec2[] | number[]): THREE.BufferGeometry;
/**
 * shape 挤压后转几何体
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 */
export declare function extrudeToGeometryBuffer(shape: Polygon | Polyline | Array<Vec3>, arg_path: Array<Vec3> | any, options: IExtrudeOptions): THREE.BufferGeometry;
/**
 *  shape 挤压后转Mesh
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 * @param {*} material
 */
export declare function extrudeToMesh(shape: Polygon | Polyline | Array<Vec3>, arg_path: Array<Vec3> | any, options: IExtrudeOptions, material?: any): THREE.Mesh;
/**
 * 两个轮廓缝合
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 * @param {*} material
 */
export declare function linkToMesh(shape: Polygon | Polyline | Array<Vec3>, shape1: Polygon | Polyline | Array<Vec3>, isClose?: boolean, material?: any): THREE.Mesh;
/**
 * 多个轮廓缝合
 * @param shape
 * @param isClose
 * @param material
 */
export declare function linksToMesh(shape: (Polygon | Polyline | Array<Vec3>)[], isClose?: boolean, material?: any): THREE.Mesh;
/**
 * 三角剖分后转成几何体
 * 只考虑XY平面
 * @param {*} boundary
 * @param {*} hole
 * @param {*} options
 */
export declare function trianglutionToGeometryBuffer(boundary: any, holes?: any[], options?: any): THREE.BufferGeometry;
