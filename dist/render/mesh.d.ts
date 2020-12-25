import { Vec3 } from "../math/Vec3";
import { Vec2 } from "../math/Vec2";
export interface IGeometry {
    vertices: number[];
    normals?: number[];
    indices?: number[];
    uvs?: number[];
    uvs2?: number[];
    tangents?: number[];
}
export interface IGeometryBuffer {
    vertices: Float32Array;
    indices?: Uint32Array | Uint16Array;
    normals?: Float32Array;
    uvs?: Float32Array;
    uvs2?: Float32Array;
    tangents?: Uint32Array[];
}
export declare function indexable(obj: any[] | any, refIndexInfo?: {
    index: number;
}, force?: boolean): void;
export declare function triangListToBuffer(vertices: Vec3[], triangleList: Vec3[]): IGeometryBuffer;
/**
 * 顶点纹理坐标所以转化为buffer数据
 * @param {Array<Verctor3|Number>} vertices
 * @param {Array<Number>} indices
 * @param {Array<Verctor2|Number>} uvs
 */
export declare function toGeoBuffer(inVertices: number[] | Vec3[], indices: number[] | Uint32Array | Uint16Array, inUvs?: Vec2[] | number[]): IGeometryBuffer;
