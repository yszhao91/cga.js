import { HVec3 } from "src/math/HVec3";
import Decimal from "decimal.js"
const EPSILON = new Decimal(1e-15);

enum Side {
    COPLANAR = 0,
    FRONT = 1,
    BACK = 2,
    SPANNING = 3,
}
/*
 * @Description  : 高精度多边形
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-03 11:11:59
 * @LastEditTime : 2021-08-03 15:49:25
 * @FilePath     : \cga.js\src\csg\polygon.ts
 */
export class Polygon {

    w: Decimal = new Decimal(0);
    normal: HVec3 = new HVec3;
    vertices: HVec3[];
    constructor(vertices: HVec3[] = []) {
        this.vertices = vertices

        this.vertices = vertices;
        if (vertices.length > 0) {
            this.calcPlane();
        }
    }

    calcPlane() {
        var a = this.vertices[0],
            b = this.vertices[1],
            c = this.vertices[2];

        this.normal = b.clone().sub(a).cross(c.clone().sub(a)).normalize();
        this.w = this.normal.clone().dot(a);

        return this;
    }

    flip() {
        this.normal.multiplyScalar(-1);
        this.w.mul(-1);

        this.vertices.reverse();

        return this;
    }


    /**
     * @description : 判断点与当前多边形所在的平面的位置关系
     * @param        {HVec3} vertex
     * @return       {*}
     * @example     : 
     */
    classifyVertex(vertex: HVec3) {
        var side_value: Decimal = this.normal.dot(vertex).sub(this.w);

        if (side_value.lessThan(-EPSILON)) {
            return Side.BACK;
        } else if (side_value > EPSILON) {
            return Side.FRONT;
        } else {
            return Side.COPLANAR;
        }
    }

    /**
     * @description : 判断另一个多边形与当前多边形的位置关系
     * @param        {Polygon} polygon
     * @return       {*}
     * @example     : 
     */
    classifySide(polygon: Polygon) {
        var vertex, classification,
            num_positive = 0,
            num_negative = 0;

        const vslen = polygon.vertices.length;
        let i;
        for (i = 0; i < vslen; i++) {
            vertex = polygon.vertices[i];
            classification = this.classifyVertex(vertex);
            if (classification === Side.FRONT) {
                num_positive++;
            } else if (classification === Side.BACK) {
                num_negative++;
            }
        }

        if (num_positive === vslen && num_negative === 0) {
            return Side.FRONT;
        } else if (num_positive === 0 && num_negative === vslen) {
            return Side.BACK;
        } else if (num_positive > 0 && num_negative > 0) {
            return Side.SPANNING;
        } else {
            return Side.COPLANAR;
        }
    }

    /**
     * @description : 切割多边形
     * @param        {Polygon} polygon
     * @param        {Polygon} coplanar_front
     * @param        {Polygon} coplanar_back
     * @param        {Polygon} front
     * @param        {Polygon} back
     * @return       {*}
     * @example     : 
     */
    splitPolygon(polygon: Polygon, coplanar_front: Polygon[] = [], coplanar_back: Polygon[] = [], front: Polygon[] = [], back: Polygon[] = []) {
        var classification = this.classifySide(polygon);

        if (classification === Side.COPLANAR) {

            (this.normal.dot(polygon.normal).greaterThan(0) ? coplanar_front : coplanar_back).push(polygon);

        } else if (classification === Side.FRONT) {

            front.push(polygon);

        } else if (classification === Side.BACK) {

            back.push(polygon);

        } else {

            var i: number, j: number,
                ti: Side, tj: Side,
                vi: HVec3, vj: HVec3,
                t: Decimal, v: HVec3,
                f: HVec3[] = [],
                b: HVec3[] = [];

            let vslen;

            for (i = 0, vslen = polygon.vertices.length; i < vslen; i++) {

                j = (i + 1) % vslen;
                vi = polygon.vertices[i];
                vj = polygon.vertices[j];
                ti = this.classifyVertex(vi);
                tj = this.classifyVertex(vj);

                if (ti != Side.BACK) f.push(vi);
                if (ti != Side.FRONT) b.push(vi);
                if ((ti | tj) === Side.SPANNING) {
                    t = (this.w.sub(this.normal.dot(vi))).div(this.normal.dot(vj.clone().sub(vi)));
                    v = vi.lerp(vj, t);
                    f.push(v);
                    b.push(v);
                }
            }


            if (f.length >= 3) front.push(new Polygon(f).calcPlane());
            if (b.length >= 3) back.push(new Polygon(b).calcPlane());
        }
    }

    clone(): Polygon {
        var i, vslen = this.vertices.length
        const polygon = new Polygon();

        for (i = 0; i < vslen; i++) {
            polygon.vertices.push(this.vertices[i].clone());
        }
        polygon.calcPlane();

        return polygon;
    }
}