import { Vec3 } from '../math/Vec3';
import { Vec2 } from '../math/Vec2';
import { IExtrudeOptions } from '../alg/extrude';
import { Polyline } from '../struct/3d/Polyline';
import { Polygon } from '../struct/3d/Polygon';
import { BufferGeometry } from '@/render/geometry';
export declare function toGeometryBuffer(vertices: number[] | Vec3[], triangles: number[], uvs?: Vec2[] | number[]): BufferGeometry;
/**
 * shape 挤压后转几何体
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 */
export declare function extrudeToGeometryBuffer(shape: Polygon | Polyline | Array<Vec3>, arg_path: Array<Vec3> | any, options: IExtrudeOptions): BufferGeometry;
/**
 * 两个轮廓缝合
 * @param {*} shape
 * @param {*} arg_path
 * @param {*} options
 * @param {*} material
 */
export declare function linkToGeometry(shape: Polygon | Polyline | Array<Vec3>, shape1: Polygon | Polyline | Array<Vec3>, isClose?: boolean): BufferGeometry;
/**
 * 多个轮廓缝合
 * @param shape
 * @param isClose
 * @param material
 */
export declare function linksToGeometry(shape: (Polygon | Polyline | Array<Vec3>)[], isClose?: boolean): BufferGeometry;
/**
 * 三角剖分后转成几何体
 * 只考虑XY平面
 * @param {*} boundary
 * @param {*} hole
 * @param {*} options
 */
export declare function trianglutionToGeometryBuffer(boundary: any, holes?: any[], options?: any): BufferGeometry;
