/*
 * @Description  : 
 * @Author       : 赵耀圣
 * @Q群           : 632839661
 * @Date         : 2020-12-10 15:01:42
 * @LastEditTime : 2021-03-12 10:13:55
 * @FilePath     : \cga.js\src\struct\3d\Plane.ts
 */
import { Vec3 } from '../../math/Vec3';
import { approximateEqual, sign, delta4 } from "../../math/Math";
import { Segment } from './Segment';
import { Orientation } from '../data/type';
import { Triangle } from './Triangle';
import { IGeometry } from '../../render/geometry';
import { ISplitResult } from '../../alg/split';
import { Line } from './Line';
import { MeshTool } from '../../render/mesh';
import { Polygon } from './Polygon';

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
        this.w = -p.dot(normal)
    }
    set(normal: Vec3, w: number) {
        this.normal = normal;
        this.w = w;
    }


    setComponents(x: number, y: number, z: number, w: number) {
        this.normal.set(x, y, z);
        this.w = w;
        return this;
    }

    normalize() {
        const inverseNormalLength = 1.0 / this.normal.length();
        this.normal.multiplyScalar(inverseNormalLength);
        this.w *= inverseNormalLength;

        return this;
    }

    setFromThreePoint(p0: Vec3, p1: Vec3, p2: Vec3) {
        this.normal = p1.clone().sub(p0).cross(p2.clone().sub(p0)).normalize();
        this.w = -p0.dot(this.normal);
    }

    negate() {
        this.w *= - 1;
        this.normal.negate();
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
        return this.normal.dot(point) + this.w;
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
     * @param {Segment|Array<Vec3> segment 
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


    intersectLine(line: Line, result?: Vec3) {
        return line.intersectPlane(this, result)
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
            result.intersectPoint = intersectPoint;
        }

        return result;
    }

    /**
     * 切割三角形 编码完成  等待测试
     * @param {Triangle} triangle 
     */
    splitTriangle(triangle: Triangle | Vec3[]): ISplitResult {
        const result: ISplitResult = {
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

        var hasConsis = consis > 0;
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

                    var intersectPoint = this.intersectSegmentLw([triangle[i],
                    triangle[(i + 1) % 3]]);
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

    /**
     * 平面切割线段
     * @param polygon 
     */
    splitConvexPolygon(polygon: Vec3[]) {
        polygon = [...polygon];
        MeshTool.indexable(polygon);

        let jd0 = -1;//找出第一个交点 
        let jdp0: any;//找出第一个交点 
        let lastOriention = this.orientationPoint(polygon[0]);
        const plen = polygon.length;
        //分割点   
        const splitPoints = [];
        const pVs = [];
        const nVs = [];
        for (let i = 1; i <= plen; i++) {
            const v = polygon[i % plen];
            const oriention = this.orientationPoint(v);
            if (oriention === Orientation.Common ) {
                jd0 = i;
                jdp0 = v.clone(); 
            }
            lastOriention = oriention;
            //TODO
        }


    }

    //---orientation------------------------------
    /**
     * 点在平面的位置判断
     * @param {Point} point 
     * @returns {Orientation} 方位
     */
    orientationPoint(point: Vec3): Orientation {
        let signDistance = this.normal.clone().dot(point) + this.w;
        if (Math.abs(signDistance) < delta4)
            return Orientation.Intersect;
        else if (signDistance < 0)
            return Orientation.Negative;
        else /* if (signDistance > 0) */
            return Orientation.Positive;
    }


    //静态API


    /**
     * @description : 平面分割几何体
     * @param        {Plane} plane
     * @param        {IGeometry} geometry
     * @return       {IGeometry[]} 返回多个几何体  
     * @example     : 
     */
    static splitGeometry(plane: Plane, geometry: IGeometry) {
        var indices = geometry.index!;
        var positions = geometry.position!;
        for (let i = 0; i < indices.length; i += 3) {
            const index_a = indices[i * 3] * 3;
            const index_b = indices[i * 3 + 1] * 3;
            const index_c = indices[i * 3 + 2] * 3;
            _v1.set(positions[index_a], positions[index_a + 1], positions[index_a + 2]);
            _v2.set(positions[index_b], positions[index_b + 1], positions[index_b + 2]);
            _v3.set(positions[index_c], positions[index_c + 1], positions[index_c + 2]);
            var data: ISplitResult = plane.splitTriangle(_tris);
            if (data.common.length > 0) {
                //共面处理
            }
            if (data.negative.length > 0) {

            }
            if (data.positive.length > 0) {

            }
        }
    }

}

const _v1 = new Vec3();
const _v2 = new Vec3();
const _v3 = new Vec3();
const _tris = [_v1, _v2, _v3];
export { Plane }