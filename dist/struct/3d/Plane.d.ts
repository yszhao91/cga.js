import { Vec3 } from '../../math/Vec3';
import { Segment } from './Segment';
import { Orientation } from '../data/type';
import { Triangle } from './Triangle';
declare class Plane {
    normal: Vec3;
    w: number;
    origin: Vec3;
    constructor(normal?: Vec3, w?: number);
    static setFromPointNormal(p: Vec3, normal: Vec3): Plane;
    setFromPointNormal(p: Vec3, normal: Vec3): void;
    setFromThreePoint(p0: Vec3, p1: Vec3, p2: Vec3): void;
    negate(): void;
    /**
     * 判断一个点在平面的正面或者反面
     * @param  {Vec3} point
     * @returns {Number} -1 or 1 or z
     */
    frontback(point: any): 1 | 0 | -1;
    distancePoint(point: any): number;
    distanceRay(ray: any): void;
    distanceLine(line: any): void;
    distanceSegment(segment: any): void;
    distancePlane(plane: any): void;
    /**
     * 只返回交点
     * Lw --Lightweight
     * @param {Segment|Array<Vector3></Vector3>} segment
     */
    intersectSegmentLw(segment: Segment | Vec3[]): Vec3 | Vec3[] | Segment | null;
    /**
       * 切割线段 代码完成  等待测试
       * @param {Segment} segment
       * @returns {
          *       positive: [], //正面点
          *       negative: [],// 反面位置点
          *       common: [], 在平面上的点
          *       orientation: Orientation.None 线段的总体位置
          *   };
          */
    splitSegment(segment: Segment | Vec3[]): any;
    /**
     * 切割三角形 编码完成  等待测试
     * @param {Triangle} triangle
     */
    splitTriangle(triangle: Triangle | Vec3[]): any;
    /**
     * 点在平面的位置判断
     * @param {Point} point
     * @returns {Orientation} 方位
     */
    orientationPoint(point: Vec3): Orientation;
}
export { Plane };
