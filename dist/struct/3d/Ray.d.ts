import { Vec3 } from '../../math/Vec3';
import { Segment } from './Segment';
import { DistanceResult } from '../../alg/result';
import { Triangle } from './Triangle';
export declare class Ray {
    origin: Vec3;
    direction: Vec3;
    constructor(origin: Vec3, direction: Vec3);
    /**
  * 射线到射线的距离
  * @param  {Ray} ray
  */
    distanceRay(ray: Ray): DistanceResult;
    /**
     * 射线到线段的距离
     * @param segment
     */
    distanceSegment(segment: Segment): DistanceResult;
    distanceTriangle(triangle: Triangle): DistanceResult;
    distancePloyline(): DistanceResult;
}
