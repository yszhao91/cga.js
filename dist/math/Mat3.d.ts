import { Mat4 } from './Mat4';
export declare class Mat3 {
    elements: number[];
    isMat3: boolean;
    constructor();
    set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
    identity(): this;
    clone(): Mat3;
    copy(m: Mat3): this;
    setFromMat4(m: Mat4): this;
    applyToBufferAttribute(attribute: any): any;
    multiply(m: Mat3): this;
    premultiply(m: Mat3): this;
    multiplyMatrices(a: Mat3, b: Mat3): this;
    multiplyScalar(s: number): this;
    determinant(): number;
    getInverse(matrix: Mat3 | Mat4 | any, throwOnDegenerate?: boolean): this;
    transpose(): this;
    getNormalMatrix(mat4: Mat4): this;
    transposeIntoArray(r: number[]): this;
    setUvTransform(tx: any, ty: any, sx: number, sy: number, rotation: number, cx: number, cy: number): void;
    scale(sx: number, sy: number): this;
    rotate(theta: number): this;
    translate(tx: number, ty: number): this;
    equals(matrix: Mat3): boolean;
    fromArray(array: number[], offset?: number): this;
    toArray(array?: number[], offset?: number): number[];
}
export declare function m3(): Mat3;
