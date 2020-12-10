import { Vec3 } from "../../math/Vec3";
import { approximateEqual, sign, gPrecision } from "../../math/Math";

class Plane {
    normal: Vec3;
    w: number;
    origin: Vec3;
    common: any;
    constructor(normal = Vec3.UnitZ, w = 0) {
        this.normal = normal;
        this.w = w;
        this.origin = this.normal.clone().multiplyScalar(w)
        // this.w = this.normal.dot(this.origin)
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
    //---Intersection-----------------------------------
    /**
     * 只返回交点
     * Lw --Lightweight
     * @param {Segment|Array<Vec3>} segment 
     */
    intersectSegmentLw(segment: any[]) {
        let orientation0 = this.orientationPoint(segment[0]);

        return null;
    }
    //---Split-----------------------------------------
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
    splitSegment(segment: { p0: { clone: () => { (): any; new(): any; sub: { (arg0: any): { (): any; new(): any; dot: { (arg0: any): any; new(): any; }; }; new(): any; }; }; }; p1: any; }) {

    }

    /**
     * 切割三角形 编码完成  等待测试
     * @param {Triangle} triangle 
     */
    splitTriangle(triangle: any[]) {

    }

    //---orientation------------------------------
    /**
     * 点在平面的位置判断
     * @param {Point} point 
     * @returns {Orientation} 方位 
     */
    orientationPoint(point: any) {

    }


}

export { Plane }