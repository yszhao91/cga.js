/*
 * @Author       : 赵耀圣
 * @Date         : 2020-12-10 15:01:42
 * @QQ           : 549184003
 * @LastEditTime : 2021-09-07 15:40:10
 * @FilePath     : \cesium-taji-dabaod:\github\cga.js\src\struct\3d\Path.ts
 */


import { Vec3 } from '../../math/Vec3';
import { Point } from './Point';
import { clamp } from '../../math/Math';
import { Polyline } from './Polyline';
import { isDefined } from '../../utils/types';
// import { Polyline } from './PolyLine';
import { Polygon } from './Polygon';
import { ArrayList } from '../data/ArrayList';
import { Mat4 } from '../../math/Mat4';
import { applyMat4 } from '../../alg/pointset';

export interface IDistanceResut {
    isNode: boolean;//是否在节点上
    point: Vec3;
}

export class Path<T extends Vec3> extends ArrayList<T> {
    _closed: boolean;
    constructor(vs: Array<T> | ArrayList<T>, closed: boolean = false) {
        super(vs);
        this._closed = closed;
        this.init();
    }

    init() {
        if (this.length === 0)
            return
        this.get(0).len = 0;
        this.get(0).tlen = 0;
        this.get(0).direction = this.get(1).clone().sub(this.get(0)).normalize();
        for (let i = 1; i < this.length; i++) {
            const e = this.get(i);
            e.len = this.get(i).distanceTo(this.get(i - 1));
            e.tlen = this.get(i - 1).tlen + e.len;
            this.get(i).direction = this.get(i).clone().sub(this.get(i - 1)).normalize();
        }
        if (this._closed) {
            this.get(-1).direction.copy(this.get(0)).sub(this.get(-1)).normalize();
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

    applyMat4(mat4: Mat4,) {
        applyMat4(this._array, mat4);
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
                point: new Vec3().lerpVecs(this.get(left), this.get(right), (distance - this.get(left).tlen) / this.get(right).len)
            }
        }
        var mid = (left + right) >> 1;
        if (this.get(mid).tlen > distance)
            return this.getPointByDistance(distance, left, mid);
        else if (this.get(mid).tlen < distance)
            return this.getPointByDistance(distance, mid, right);
        else return {
            isNode: true,//是否在节点上
            point: new Vec3().lerpVecs(this.get(left), this.get(right), (distance - this.get(left).tlen) / this.get(right).len)
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
        var tlen = this.lastValue.tlen;
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
        var tlen = this.lastValue.tlen;
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