import { Euler } from './Euler';
import { EventHandler } from '../render/eventhandler';
export declare class Quat extends EventHandler {
    _x: number;
    _y: number;
    _z: number;
    _w: number;
    x: number;
    y: number;
    z: number;
    w: number;
    isQuat: boolean;
    constructor(_x?: number, _y?: number, _z?: number, _w?: number);
    static slerp(qa: any, qb: any, qm: {
        copy: (arg0: any) => {
            (): any;
            new (): any;
            slerp: {
                (arg0: any, arg1: any): any;
                new (): any;
            };
        };
    }, t: any): any;
    static slerpFlat(dst: {
        [x: string]: any;
    }, dstOffset: number, src0: {
        [x: string]: any;
    }, srcOffset0: number, src1: {
        [x: string]: any;
    }, srcOffset1: number, t: number): void;
    static multiplyQuatsFlat(dst: {
        [x: string]: number;
    }, dstOffset: number, src0: {
        [x: string]: any;
    }, srcOffset0: number, src1: {
        [x: string]: any;
    }, srcOffset1: number): {
        [x: string]: number;
    };
    set(x: number, y: number, z: number, w: number): this;
    clone(): Quat;
    copy(quat: Quat): this;
    setFromEuler(euler: Euler, update?: boolean): this;
    setFromAxisAngle(axis: {
        x: number;
        y: number;
        z: number;
    }, angle: number): this;
    setFromRotationMatrix(m: {
        elements: any;
    }): this;
    setFromUnitVecs(vFrom: {
        dot: (arg0: any) => number;
        x: number;
        z: number;
        y: number;
    }, vTo: {
        z: number;
        y: number;
        x: number;
    }): this;
    angleTo(q: any): number;
    rotateTowards(q: any, step: number): this;
    inverse(): this;
    conjugate(): this;
    dot(v: Quat): number;
    lengthSq(): number;
    length(): number;
    normalize(): this;
    multiply(q: any, p: Quat): this;
    premultiply(q: any): this;
    multiplyQuats(a: Quat, b: Quat): this;
    slerp(qb: Quat, t: number): this;
    equals(quat: Quat): boolean;
    fromArray(array: {
        [x: string]: number;
    }, offset: number | undefined): this;
    toArray(array?: number[], offset?: number): number[];
}
export declare function quat(x?: number, y?: number, z?: number, w?: number): Quat;
