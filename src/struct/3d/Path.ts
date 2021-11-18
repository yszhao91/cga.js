/*
 * @Author       : 赵耀圣
 * @Date         : 2020-12-10 15:01:42
 * @QQ           : 549184003
 * @LastEditTime : 2021-09-07 15:40:10
 * @FilePath     : \cesium-taji-dabaod:\github\cga.js\src\struct\3d\Path.ts
 */


import { Vec3, v3 } from '../../math/Vec3';
import { Point } from './Point';
import { clamp, delta6 } from '../../math/Math';
import { Polyline } from './Polyline';
import { isDefined } from '../../utils/types';
// import { Polyline } from './PolyLine';
import { Polygon } from './Polygon';
import { ArrayList } from '../data/ArrayList';
import { Mat4 } from '../../math/Mat4';
import { applyMat4 } from '../../alg/pointset';
import { scale } from '../../alg/common';

export interface IDistanceResut {
    isNode: boolean;//是否在节点上
    point: Vec3;
    direction: Vec3;
}

export class Path<T extends Vec3> extends ArrayList<T> {
    _closed: boolean;
    _calcNoraml: boolean = false
    /**
     * 
     * @param vs  假定是没有重复的点集
     * @param closed 
     * @param calcNormal 
     */
    constructor(vs: Array<T> | ArrayList<T>, closed: boolean = false, calcNormal: boolean = false) {
        super(vs);
        this._closed = closed;
        this.init(calcNormal);
    }

    init(calcNormal: boolean) {
        if (this.length === 0)
            return
        this.get(0).len = 0;
        this.get(0).tlen = 0;

        const end = this.length;
        for (let i = 0; i < end; i++) {
            const e = this.get(i);
            if (i !== 0) {
                e.len = this.get(i).distanceTo(this.get(i - 1));
                e.tlen = this.get(i - 1).tlen + e.len;
            }
            this.get(i).direction = this.get((i + 1) % this.length).clone().sub(this.get(i)).normalize();
        }
        if (!this._closed) {
            this.get(-1).direction.copy(this.get(-2).direction);
        }

        if (calcNormal) {
            for (let i = 0; i < end; i++) {
                const d1: Vec3 = this.get(i - 1).direction;
                const d2: Vec3 = this.get(i).direction;
                // if (Math.abs(d1.dot(d2) - 1) > delta6) {
                //应该同时考虑长度差        
                //normal是两条线段所在的平面的法线
                //bdirection是两条方向线的等分线
                //TODO
                const normal = new Vec3();
                normal.crossVecs(d1, d2).normalize();
                this.get(i).normal = normal;
                const bdir = v3().addVecs(d1, d2).normalize();
                this.get(i).bdirection = bdir;
                this.get(i).bnormal = v3().crossVecs(bdir, normal).normalize();
                // }
            }

            if (!this._closed) { //不闭合路径 最后一个点没有
                this.get(-1).bdirection = v3()
                this.get(-1).normal = v3()
                this.get(-1).bnormal = v3()
            }

            if (!this._closed) {
                // 不闭合的情况下怎么样去计算端点的up和normal
                this.get(0).normal.copy(this.get(1).normal)
                this.get(0).bdirection.copy(this.get(0).direction)
                let bdir = this.get(0).bdirection;
                this.get(0).bnormal.crossVecs(bdir, this.get(0).normal)

                this.get(-1).normal.copy(this.get(-2).normal)
                this.get(-1).bdirection.copy(this.get(-1).direction)
                bdir = this.get(-1).bdirection;
                this.get(-1).bnormal.crossVecs(bdir, this.get(-1).normal).normalize();
            }
        }



    }


    set closed(val: boolean) {
        this._closed = val;
    }

    get closed() {
        return this._closed;
    }

    get tlen() {
        if (this.length === 0)
            return 0;
        return Math.max(this.get(-1).tlen, this.get(0).tlen);
    }

    applyMat4(mat4: Mat4) {
        applyMat4(this._array, mat4);
    }

    scale(x: number, y: number, z: number) {
        scale(this._array, v3(x, y, z), true);
    }



    /**
     * 截取一段从from到to的path
     * @param {Number} from 
     * @param {Number} to
     */
    splitByFromToDistance(from: number = 0, to: number = 0) {
        if (to <= from)
            return null;
        var newPath = new Path([]);
        for (let i = 0; i < this.length - 1; i++) {
            const pt = this.get(i);
            const ptnext = this.get(i + 1);
            if (pt.tlen <= from && ptnext.tlen >= from) {
                var v3 = new Vec3().lerpVecs(pt, ptnext, (from - pt.tlen) / (ptnext.tlen - pt.tlen));
                newPath.add(v3);
            }
            if (pt.tlen > from && pt.tlen < to) {
                newPath.add(pt.clone());
            }
            if (pt.tlen <= to && ptnext.tlen >= to) {
                var v3 = new Vec3().lerpVecs(pt, ptnext, (to - pt.tlen) / (ptnext.tlen - pt.tlen));
                newPath.add(v3);
                return newPath;
            }
        }
        return newPath;
    }

    /**
     * 从起点出发到距离等于distance位置  的坐标 二分查找
     * @param {Number} distance
     */
    getPointByDistance(arg_distance: number, left: number = 0, right: number = this.length - 1): IDistanceResut | null {
        const distance = clamp(arg_distance, 0, this.get(-1).tlen);
        if (distance !== arg_distance)
            return null;

        if (right - left === 1) {
            return {
                isNode: false,//是否在节点上
                point: new Vec3().lerpVecs(this.get(left), this.get(right), (distance - this.get(left).tlen) / this.get(right).len),
                direction: this.get(left).diretion,
            }
        }
        var mid = (left + right) >> 1;
        if (this.get(mid).tlen > distance)
            return this.getPointByDistance(distance, left, mid);
        else if (this.get(mid).tlen < distance)
            return this.getPointByDistance(distance, mid, right);
        else return {
            isNode: true,//是否在节点上
            point: new Vec3().lerpVecs(this.get(left), this.get(right), (distance - this.get(left).tlen) / this.get(right).len),
            direction: this.get(left).direction
        }
    }
    /**
     * 从起点出发到距离等于distance位置  的坐标 二分查找
     * @param {Number} distance 
     */
    getPointByDistancePure(arg_distance: number, left: number = 0, right: number = this.length - 1): Vec3 | null {
        const distance = clamp(arg_distance, 0, this.get(-1).tlen);
        if (distance !== arg_distance)
            return null;

        if (right - left === 1) {
            return new Vec3().lerpVecs(this.get(left), this.get(right), (distance - this.get(left).tlen) / this.get(right).len);
        }

        var mid = (left + right) >> 1;
        if (this.get(mid).tlen > distance)
            return this.getPointByDistancePure(distance, left, mid);
        else if (this.get(mid).tlen < distance)
            return this.getPointByDistancePure(distance, mid, right);
        else return this.get(mid).clone();
    }

    /**
     * 平均切割为 splitCount 段
     * @param {Number} splitCount 
     * @returns {Path} 新的path
     */
    splitAverage(splitCount: number): Path<T> {
        var tlen = this.last.tlen;
        var perlen = tlen / splitCount;

        var res: Vec3[] = [];
        var curJ = 0
        for (var i = 0; i <= splitCount; i++) {
            var plen = i * perlen;
            for (let j = curJ; j < this.length - 1; j++) {
                if (this.get(j).tlen <= plen && this.get(j + 1).tlen >= plen) {
                    var p = new Vec3().lerpVecs(this.get(j), this.get(j + 1), (plen - this.get(j).tlen) / (this.get(j + 1).len))
                    res.push(p);
                    curJ = j;
                    break;
                }
            }
        }
        return new Path<any>(res);
    }

    /**
     * 通过测试
    * 平均切割为 splitCount 段
    * @param {Number} splitCount 
    * @param {Boolean} integer 是否取整
    * @returns {Path} 新的path
    */
    splitAverageLength(splitLength: number, integer = true) {
        var tlen = this.last.tlen;
        var count = tlen / splitLength;
        if (integer)
            count = Math.round(count);
        return this.splitAverage(count);
    }

    /**
     * 
     * @param  {...any} ps 
     */
    add(...ps: Vec3[] | Point[]) {
        if (this.length == 0) {
            const firstpt = ps.shift();
            this.push(firstpt);
            this.get(0).len = 0;
            this.get(0).tlen = 0;

        }
        for (let i = 0; i < ps.length; i++) {
            const pt: any = ps[i];
            pt.len = pt.distanceTo(this.get(-1));
            pt.tlen = this.get(-1).tlen + pt.len;
            pt.direction = pt.clone().sub(this.get(-1)).normalize();
            if (!this.get(-1).direction)
                this.get(-1).direction = pt.clone().sub(this.get(-1)).normalize();
            else
                this.get(-1).direction.copy(pt.direction);
            this.push(pt);
        }


    }


    /**
     * @description : 计算一段线段的总长度
     * @param        {ArrayLike} ps
     * @return       {number}   总长度
     */
    static totalMileages(ps: ArrayLike<Vec3>): number {
        var alldisance = 0
        for (let i = 0, len = ps.length - 1; i < len; i++) {
            alldisance += ps[i + 1].distanceTo(ps[i]);
        }

        return alldisance;
    }

    /**
     * @description : 获取没一点的里程  里程是指从第一个点出发的长度
     * @param        {ArrayLike} ps 里程上的点集
     * @param        {boolean} normalize 是否归一化
     * @return       {number[]}  每一个点的里程数组 
     * @example     : 
     */
    static getPerMileages(ps: ArrayLike<Vec3>, normalize: boolean = false, totalMileage?: number): number[] {
        const res: number[] = [];

        let mileages = 0
        res.push(mileages);
        for (let i = 0, len = ps.length - 1; i < len; i++) {
            mileages += ps[i + 1].distanceTo(ps[i]);
            res.push(mileages);
        }

        if (normalize) {
            const tl = isDefined(totalMileage) ? totalMileage : this.totalMileages(ps);

            for (let i = 0, len = ps.length; i < len; i++) {
                res[i] /= tl!;
            }
        }

        return res;
    }
}