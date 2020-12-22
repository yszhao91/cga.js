import { Vec3 } from '../../math/Vec3';
import { approximateEqual, sign, gPrecision } from "../../math/Math";
import { Segment } from './Segment';
import { Orientation } from '../data/type';
import { Triangle } from './Triangle';

class Plane {
    normal: Vec3;
    w: number;
    origin: Vec3;
    constructor(normal = Vec3.UnitZ, w = 0) {
        this.normal = normal;
        this.w = w;
        this.origin = this.normal.clone().multiplyScalar(w)
        // this.w = this.normal.dot(this.origin)
    }

    static setFromPointNormal(p: Vec3, normal: Vec3) {
        const plane = new Plane();
        plane.setFromPointNormal(p, normal)
        return plane;
    }

    setFromPointNormal(p: Vec3, normal: Vec3) {
        this.normal = normal;
        this.w = p.dot(normal)
    }

    setFromThreePoint(p0: Vec3, p1: Vec3, p2: Vec3) {
        this.normal = p1.clone().sub(p0).cross(p2.clone().sub(p0)).normalize();
        this.w = p0.dot(this.normal);
    }

    negate() {
        this.normal.negate();
        this.w = -this.w;
    }

    /**
     * 判断一个点在平面的正面或者反面
     * @param  {Vec3} point
     * @returns {Number} -1 or 1 or z
     */
    frontback(point: any) {
        let value = this.normal.dot(point);
        if (approximateEqual(value, 0))
            return 0;
        return sign(this.normal.dot(point));
    }

    //---Distance-------------------------------------------------------------------------------
    distancePoint(point: any) {
        return this.normal.dot(point) - this.w;
    }

    distanceRay(ray: any) {

    }

    distanceLine(line: any) {

    }

    distanceSegment(segment: any) {

    }

    distancePlane(plane: any) {

    }
    //---Intersect-----------------------------------
    /**
     * 只返回交点
     * Lw --Lightweight
     * @param {Segment|Array<Vector3></Vector3>} segment 
     */
    intersectSegmentLw(segment: Segment | Vec3[]) {
        let orientation0 = this.orientationPoint(segment[0]);
        let orientation1 = this.orientationPoint(segment[0]);

        let orientation = orientation0 | orientation1;

        if (orientation === Orientation.Common)
            return segment;

        if (orientation === Orientation.Intersect) {
            var dist = segment[0].clone().sub(this.origin).dot(this.normal);
            var intersectPoint = this.normal.clone().multiplyScalar(dist).add(segment[0]);
            return intersectPoint;
        }

        return null;
    }
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
    splitSegment(segment: Segment | Vec3[]) {
        const result: any = {
            positive: [],
            negative: [],
            common: [],
            orientation: Orientation.None
        };
        let orientation0 = this.orientationPoint(segment[0]);
        let orientation1 = this.orientationPoint(segment[1]);

        let orientation = orientation0 | orientation1;
        result.orientation = orientation;

        if (orientation0 === Orientation.Positive)
            result.positive.push(segment[0]);
        else if (orientation0 === Orientation.Negative)
            result.negative.push(segment[0]);
        else
            result.common.push(segment[0]);

        if (orientation1 === Orientation.Positive)
            result.positive.push(segment[1]);
        else if (orientation1 === Orientation.Negative)
            result.negative.push(segment[1]);
        else
            result.common.push(segment[1]);


        if (orientation === Orientation.Intersect) {
            var dist = segment[0].clone().sub(this.origin).dot(this.normal);
            var intersectPoint = this.normal.clone().multiplyScalar(dist).add(segment[0]);
            result.positive.push(intersectPoint);
            result.negative.push(intersectPoint);
        }

        return result;
    }

    /**
     * 切割三角形 编码完成  等待测试
     * @param {Triangle} triangle 
     */
    splitTriangle(triangle: Triangle | Vec3[]) {
        const result: any = {
            negative: [],
            positive: [], common: [], orientation: Orientation.None
        };
        var scope = this;
        const orientations: Orientation[] = (triangle as Vec3[]).map((p: Vec3) => scope.orientationPoint(p));

        var consis = 0;
        var pos = 0;
        var neg = 0;

        for (let i = 0; i < triangle.length; i++) {
            var orientation = orientations[i];
            if (orientation === Orientation.Positive)
                pos++;
            else if (orientation === Orientation.Negative)
                neg++;
            else
                consis++
        }

        // var hasConsis = consis > 0;
        var hasFront = pos > 0;
        var hasBack = neg > 0;

        const negTris = result.positive,
            posTris = result.negative;
        if (hasBack && !hasFront) {
            //反面
            result.orientation = Orientation.Negative;
            result.negative.push(...triangle)
        } else if (!hasBack && hasFront) {
            //正面 
            result.orientation = Orientation.Positive;
            result.positive.push(...triangle)
        } else if (hasFront && hasBack) {
            //相交 共面点最多只有一个
            result.orientation = Orientation.Intersect;
            for (var i = 0; i < 3; i++) {
                if (orientations[i] || orientations[(i + 1) % 3] === Orientation.Intersect) {
                    if (orientations[i] === Orientation.Positive) {
                        posTris.push(triangle[i]);
                    } else if (orientations[i] == Orientation.Negative) {
                        negTris.push(triangle[i]);
                    } else {
                        negTris.push(triangle[i]);
                        posTris.push(triangle[i]);
                        result.common.push(triangle[i]);
                    }

                    var intersectPoint = this.intersectSegmentLw([triangle[i], triangle[(i + 1) % 3]]);
                    if (intersectPoint) {
                        if (!Array.isArray(intersectPoint))
                            result.common.push(intersectPoint);
                    }
                }
            }
        } else {
            // 三点共面
            result.orientation = Orientation.Common;
            result.common.push(...triangle)
        }

        return result;
    }

    //---orientation------------------------------
    /**
     * 点在平面的位置判断
     * @param {Point} point 
     * @returns {Orientation} 方位
     */
    orientationPoint(point: Vec3): Orientation {
        let signDistance = this.normal.clone().dot(point) - this.w;
        if (Math.abs(signDistance) < gPrecision)
            return Orientation.Intersect;
        else if (signDistance < 0)
            return Orientation.Negative;
        else /* if (signDistance > 0) */
            return Orientation.Positive;
    }


}

export { Plane }