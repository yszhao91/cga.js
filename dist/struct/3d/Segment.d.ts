import { Vec3 } from '../../math/Vec3';
import { DistanceResult } from '../../alg/result';
export declare class Segment extends Array {
    center: Vec3;
    extentDirection: Vec3;
    extentSqr: number;
    extent: number;
    direction: Vec3;
    normal: Vec3 | undefined;
    /**
     * 线段
     * @param  {Point|Vec3} p0
     * @param  {Point|Vec3} p1
     */
    constructor(_p0?: Vec3, _p1?: Vec3);
    get p0(): Vec3;
    set p0(v: Vec3);
    get p1(): Vec3;
    set p1(v: Vec3);
    offset(distance: number, normal?: Vec3): void;
    /**
     * 线段到线段的距离
     * @param  {Segment} segment
     */
    distanceSegment(segment: Segment): DistanceResult;
    intersectSegment(segment: Segment): void;
}
export declare function segment(p0: Vec3, p1: Vec3): Segment;
