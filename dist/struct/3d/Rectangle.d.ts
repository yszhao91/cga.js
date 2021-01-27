import { Vec3 } from '../../math/Vec3';
export declare class Rectangle extends Array {
    extent: number[];
    axis: Vec3[];
    center: Vec3;
    constructor(v0: Vec3, v1: Vec3, v2: Vec3, v3: Vec3);
}
