/*
 * @Author       : 赵耀圣
 * @Date         : 2020-12-10 15:01:42
 * @QQ           : 549184003
 * @LastEditTime : 2021-03-09 16:22:54
 * @FilePath     : \cga.js\src\struct\3d\Path.ts
 */


import { IVec3, Vec3 } from '../../math/Vec3';
import { Point } from './Point';
import { clamp } from '../../math/Math';
import { Polyline } from './Polyline';
import { isDefined } from 'src/utils/types';
// import { Polyline } from './PolyLine';

export interface IDistanceResut {
    isNode: boolean;//是否在节点上
    point: Vec3;
}

export class Path extends Polyline {
    _closed: boolean;
    constructor(vs: Array<Vec3 | IVec3>) {
        super(vs);
        Object.setPrototypeOf(this, Path.prototype);
        this._closed = false;
        this.init();
    }

    set closed(val: boolean) {
        this._closed = val;
    }

    get closed() {
        return this._closed;
    }

    init() {
        if (this.length === 0)
            return
        this[0].len = 0;
        this[0].tlen = 0;
        this[0].direction = this[1].clone().sub(this[0]).normalize();
        for (let i = 1; i < this.length; i++) {
            const e = this[i];
            e.len = this[i].distanceTo(this[i - 1]);
            e.tlen = this[i - 1].tlen + e.len;
            this[i].direction = this[i].clone().sub(this[i - 1]).normalize();
        }
        if (this._closed) {
            this.get(-1).direction.copy(this[0]).sub(this.get(-1)).normalize();
        }

        for (let i = 0; i < this.length + 2; i++) {
            // this[i % this.length].tangent = this[i % this.length].direction.clone()
            //     .add(this[(i + 1) % this.length]).normalize();
            this[i % this.length].tangent = this[i % this.length].direction.clone();
        }
        if (!this._closed) {
            this[0].tangent.copy(this[0].direction)
            this.get(-1).tangent.copy(this.get(-1).direction)
        }
    }

    get tlen() {
        if (this.length === 0)
            return 0;
        return Math.max(this.get(-1).tlen, this[0].tlen);
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
            const pt = this[i];
            const ptnext = this[i + 1];
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
                point: new Vec3().lerpVecs(this[left], this[right], (distance - this[left].tlen) / this[right].len)
            }
        }
        var mid = (left + right) >> 1;
        if (this[mid].tlen > distance)
            return this.getPointByDistance(distance, left, mid);
        else if (this[mid].tlen < distance)
            return this.getPointByDistance(distance, mid, right);
        else return {
            isNode: true,//是否在节点上
            point: new Vec3().lerpVecs(this[left], this[right], (distance - this[left].tlen) / this[right].len)
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
            return new Vec3().lerpVecs(this[left], this[right], (distance - this[left].tlen) / this[right].len);
        }

        var mid = (left + right) >> 1;
        if (this[mid].tlen > distance)
            return this.getPointByDistancePure(distance, left, mid);
        else if (this[mid].tlen < distance)
            return this.getPointByDistancePure(distance, mid, right);
        else return this[mid].clone();
    }

    /**
     * 平均切割为 splitCount 段
     * @param {Number} splitCount 
     * @returns {Path} 新的path
     */
    splitAverage(splitCount: number): Path {
        var tlen = this.last.tlen;
        var perlen = tlen / splitCount;

        var res = [];
        var curJ = 0
        for (var i = 0; i <= splitCount; i++) {
            var plen = i * perlen;
            for (let j = curJ; j < this.length - 1; j++) {
                if (this[j].tlen <= plen && this[j + 1].tlen >= plen) {
                    var p = new Vec3().lerpVecs(this[j], this[j + 1], (plen - this[j].tlen) / (this[j + 1].len))
                    res.push(p);
                    curJ = j;
                    break;
                }
            }
        }
        return new Path(res);
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
            this[0].len = 0;
            this[0].tlen = 0;

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