import { Vec3 } from '../math/Vec3';
import { Line } from "@/struct/3d/Line";
import { Point } from "@/struct/3d/Point";
declare class ConvexHull {
    _hull: Point[];
    _originPoints: Point[] | undefined;
    _normal: Vec3;
    /**
     * Create a convex hull from points.
     * @param {Point[]} pts 二维点集
     * @param {Object} options
     */
    constructor(pts: Point[], options?: {
        planeNormal: any;
        method?: string;
    });
    getMinMax(points: Point[]): [Point, Point];
    addBoundSeg(line: Line, points: Point[]): Point[];
    /**
     * Getter for hull result.
     */
    get hull(): any[];
}
declare function quickHull(points: Point[]): any[];
export { ConvexHull, quickHull };
