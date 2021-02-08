import { Mat4 } from "../math/Mat4";
import { Vec3 } from "../math/Vec3";
import { Box } from "../struct/3d/Box";
import { Sphere } from "../struct/3d/Sphere";
import { BufferAttribute } from "./buffer-attribute";
import { TypedArray } from "./types";
import { Vec2 } from "../math/Vec2";
import { Vec4 } from "../math/Vec4";
export interface IGeometry {
    vertices: number[];
    normals?: number[];
    indices?: number[];
    uvs?: number[];
    uvs2?: number[];
    tangents?: number[];
}
export interface IBufferGeometry {
    vertices: Float32Array | undefined;
    indices?: Uint32Array | Uint16Array;
    normals?: Float32Array;
    uvs?: Float32Array;
    uvs2?: Float32Array;
    tangents?: Float32Array;
}
/**
 * BufferType 几何体，用于独立计算几何体
 */
export declare class BufferGeometry {
    name: string;
    index: BufferAttribute | undefined;
    morphAttributes: any;
    morphTargetsRelative: boolean;
    groups: {
        start: number;
        count: number;
        materialIndex?: number;
    }[];
    boundingBox: Box | undefined;
    boundingSphere: Sphere | undefined;
    drawRange: {
        start: number;
        count: number;
    };
    attributes: {
        [key: string]: BufferAttribute;
    };
    parameters: any;
    readonly isBufferGeometry: true;
    uuid: string;
    type: string;
    constructor();
    getIndex(): BufferAttribute | undefined;
    setIndex(index: BufferAttribute | TypedArray | number[]): void;
    getAttribute(name: string): BufferAttribute;
    setAttribute(name: string, attribute: BufferAttribute): this;
    addAttribute(name: string, attribute: BufferAttribute | TypedArray | Array<number | Vec2 | Vec3 | Vec4>, itemSize?: number): this;
    deleteAttribute(name: string): this;
    addGroup(start: number, count: number, materialIndex?: number): void;
    clearGroups(): void;
    setDrawRange(start: number, count: number): void;
    applyMat4(matrix: Mat4): this;
    rotateX(angle: number): this;
    rotateY(angle: number): this;
    rotateZ(angle: number): this;
    translate(x: number, y: number, z: number): this;
    scale(x: number, y: number, z: number): this;
    lookAt(vector: Vec3): this;
    center(): this;
    setFromObject(object: any): this;
    setFromPoints(points: Vec3[]): this;
    updateFromObject(object: any): this;
    computeBoundingBox(): void;
    computeBoundingSphere(): void;
    computeFaceNormals(): void;
    computeVertexNormals(): void;
    merge(geometry: BufferGeometry, offset: number): this | undefined;
    normalizeNormals(): void;
    toNonIndexed(): BufferGeometry;
    toJSON(): any;
    userData(userData: any): void;
    clone(): BufferGeometry;
    copy(source: BufferGeometry): this;
}
