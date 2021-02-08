import { Mat3 } from "../math/Mat3";
import { Mat4 } from "../math/Mat4";
import { TypedArray } from "./types";
export declare class BufferAttribute {
    name: string;
    array: TypedArray;
    itemSize: number;
    updateRange: {
        offset: number;
        count: number;
    };
    version: number;
    normalized: boolean;
    count: number;
    readonly isBufferAttribute: true;
    /**
     *
     * @param array {BufferArray} Buffer数据
     * @param itemSize 单元长度，vec3是3，vec4是4
     * @param normalized
     */
    constructor(array: TypedArray, itemSize: number, normalized?: boolean);
    set needsUpdate(value: boolean);
    onUploadCallback?: () => void;
    onUpload(callback: () => void): this;
    setUsage(usage: any): this;
    copy(source: BufferAttribute): this;
    copyAt(index1: number, attribute: BufferAttribute, index2: number): this;
    copyArray(array: ArrayLike<number>): this;
    copyColorsArray(colors: {
        r: number;
        g: number;
        b: number;
    }[]): this;
    copyVec2sArray(vectors: {
        x: number;
        y: number;
    }[]): this;
    copyVec3sArray(vectors: {
        x: number;
        y: number;
        z: number;
    }[]): this;
    copyVec4sArray(vectors: {
        x: number;
        y: number;
        z: number;
        w: number;
    }[]): this;
    applyMat3(m: Mat3): this;
    applyMat4(m: Mat4): this;
    applyNormalMat(m: Mat3): this;
    transformDirection(m: Mat4): this;
    set(value: ArrayLike<number>, offset: number): this;
    getX(index: number): number;
    setX(index: number, x: number): this;
    getY(index: number): number;
    setY(index: number, y: number): this;
    getZ(index: number): number;
    setZ(index: number, z: number): this;
    getW(index: number): number;
    setW(index: number, w: number): this;
    setXY(index: number, x: number, y: number): this;
    setXYZ(index: number, x: number, y: number, z: number): this;
    setXYZW(index: number, x: number, y: number, z: number, w: number): this;
    clone(): BufferAttribute;
    toJSON(): {
        itemSize: number;
        type: string;
        array: number[];
        normalized: boolean;
    };
}
export declare class Int8BufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
export declare class Uint8BufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
export declare class Uint8ClampedBufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
export declare class Int16BufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
export declare class Uint16BufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
export declare class Int32BufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
export declare class Uint32BufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
export declare class Float32BufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
export declare class Float64BufferAttribute extends BufferAttribute {
    constructor(array: any, itemSize: number, normalized?: boolean);
}
