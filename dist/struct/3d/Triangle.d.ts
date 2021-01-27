import { Vec3 } from '../../math/Vec3';
export declare class Triangle extends Array {
    constructor(_p0: Vec3, _p1: Vec3, _p2: Vec3);
    get p0(): any;
    get p1(): any;
    get p2(): any;
    distanceTriangle(triangle: Triangle): void;
}
