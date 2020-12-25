import { Vec3 } from './Vec3';
import { Euler } from './Euler';
export declare class Mat4 {
    elements: number[];
    isMat4: boolean;
    constructor();
    set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): this;
    static get Identity(): Mat4;
    identity(): this;
    clone(): Mat4;
    copy(m: Mat4): this;
    copyPosition(m: {
        elements: any;
    }): this;
    extractBasis(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this;
    makeBasis(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this;
    extractRotation(m: Mat4): this;
    makeRotationFromEuler(euler: Euler): this;
    makeRotationFromQuat(q: any): this;
    lookAt(eye: Vec3, target: Vec3, up: Vec3): this;
    multiply(m: Mat4, n: Mat4): this;
    premultiply(m: Mat4): this;
    multiplyMatrices(a: Mat4, b: Mat4): this;
    multiplyScalar(s: number): this;
    applyToBufferAttribute(attribute: {
        count: any;
        getX: (arg0: number) => number;
        getY: (arg0: number) => number;
        getZ: (arg0: number) => number;
        setXYZ: (arg0: number, arg1: number, arg2: number, arg3: number) => void;
    }): {
        count: any;
        getX: (arg0: number) => number;
        getY: (arg0: number) => number;
        getZ: (arg0: number) => number;
        setXYZ: (arg0: number, arg1: number, arg2: number, arg3: number) => void;
    };
    determinant(): number;
    transpose(): this;
    setPosition(x: number | Vec3 | any, y: number, z: number): this;
    getInverse(m: {
        elements: any;
    }, throwOnDegenerate: boolean): this;
    scale(v: {
        x: any;
        y: any;
        z: any;
    }): this;
    getMaxScaleOnAxis(): number;
    makeTranslation(x: number, y: number, z: number): this;
    makeRotationX(theta: number): this;
    makeRotationY(theta: number): this;
    makeRotationZ(theta: number): this;
    makeRotationAxis(axis: {
        x: any;
        y: any;
        z: any;
    }, angle: number): this;
    makeScale(x: number, y: number, z: number): this;
    makeShear(x: number, y: number, z: number): this;
    compose(position: Vec3, Quat: {
        _x: any;
        _y: any;
        _z: any;
        _w: any;
    }, scale: Euler | Vec3): this;
    decompose(position: Vec3, Quat: {
        setFromRotationMatrix: (arg0: Mat4) => void;
    }, scale: Vec3): this;
    makePerspective(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
    makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
    equals(matrix: {
        elements: any;
    }): boolean;
    fromArray(array: number[], offset?: number): this;
    toArray(array?: number[], offset?: number): number[];
}
export declare function m4(): Mat4;
