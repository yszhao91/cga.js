import { Vec3 } from "../math/Vec3";
import { Vec2 } from "../math/Vec2";
import { BufferGeometry } from "./geometry";
import { BufferAttribute } from "./buffer-attribute";
import { Vec4 } from "@/math/Vec4";
import { TypedArray } from "./types";
export declare function indexable(obj: any[] | any, refIndexInfo?: {
    index: number;
}, force?: boolean): void;
export declare function triangListToBuffer(vertices: Vec3[], triangleList: Vec3[]): BufferGeometry;
/**
 * 顶点纹理坐标所以转化为buffer数据
 * @param {Array<Verctor3|Number>} vertices
 * @param {Array<Number>} indices
 * @param {Array<Verctor2|Number>} uvs
 */
export declare function toGeoBuffer(vertices: BufferAttribute | Array<number | Vec2 | Vec3 | Vec4> | TypedArray, indices: number[] | Uint32Array | Uint16Array, uvs?: BufferAttribute | TypedArray | Array<Vec2 | number>): BufferGeometry;
