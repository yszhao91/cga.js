import { Mat4 } from "./Mat4";
import { Quat } from './Quat';
export declare class Euler {
    _x: number;
    _y: number;
    _z: number;
    _order: string;
    isEuler: boolean;
    constructor(_x?: number, _y?: number, _z?: number, _order?: string);
    get x(): number;
    set x(value: number);
    get y(): number;
    set y(value: number);
    get z(): number;
    set z(value: number);
    get order(): string;
    set order(value: string);
    set(x: number, y: number, z: number, order: string): this;
    clone(): Euler;
    copy(Euler: {
        _x: number;
        _y: number;
        _z: number;
        _order: string;
    }): this;
    setFromRotationMatrix(m: Mat4, order: string, update: boolean | undefined): this;
    setFromQuat(q: Quat, order: any, update?: boolean): this;
    setFromVec3(v: {
        x: any;
        y: any;
        z: any;
    }, order: any): this;
    reorder(newOrder: any): this;
    equals(Euler: {
        _x: number;
        _y: number;
        _z: number;
        _order: string;
    }): boolean;
    fromArray(array: any[]): this;
    toArray(array?: any[], offset?: number): any[];
    toVec3(optionalResult: {
        set: (arg0: number, arg1: number, arg2: number) => any;
    }): any;
    _onChange(callback: () => void): this;
    _onChangeCallback(): void;
}
export declare function euler(x?: number, y?: number, z?: number): Euler;
