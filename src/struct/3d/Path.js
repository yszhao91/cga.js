import { Polyline } from "./Polyline"
import { clamp } from "../../math/Math";
export class Path extends Polyline {
    constructor(vs) {
        super(vs);

        this.init();
    }

    init() {
        this[0].len = 0;
        this[0].tlen = 0;
        this[0].direction = this[1].clone().sub(this[0]).normalize();
        for (let i = 1; i < this.length; i++)
        {
            const e = this[i];
            e.len = this[i].distanceTo(this[i - 1]);
            e.tlen = this[i - 1].tlen + e.len;
            this[i].direction = this[i].clone().sub(this[i - 1]).normalize();
        }
    }

    /**
     * 从起点出发到距离等于distance位置  的坐标 二分查找
     * @param {Number} distance
     */
    getPointByDistance(arg_distance) {
        const distance = clamp(arg_distance, 0, this.get(-1).tlen);
        if (distance !== arg_distance)
            return null;

        if (right - left === 1)
        {
            return {
                position: left,
                isNode: false,//是否在节点上
                point: new Vector3().lerpVectors(this[left], this[right], (distance - this[left].tlen) / this[right].len)
            }
        }
        var mid = (left + right) >> 1;
        if (this[mid].tlen > distance)
            return this.getPointByDistanceEx(distance, left, mid);
        else if (this[mid].tlen < distance)
            return this.getPointByDistanceEx(distance, mid, right);
        else return {
            position: mid,
            isNode: true,//是否在节点上
            point: new Vector3().lerpVectors(this[left], this[right], (distance - this[left].tlen) / this[right].len)
        }
    }
    /**
     * 从起点出发到距离等于distance位置  的坐标 二分查找
     * @param {Number} distance 
     */
    getPointByDistancePure(arg_distance) {
        const distance = clamp(arg_distance, 0, this.get(-1).tlen);
        if (distance !== arg_distance)
            return null;

        if (right - left === 1)
            return new Vector3().lerpVectors(this[left], this[right], (distance - this[left].tlen) / this[right].len);

        var mid = (left + right) >> 1;
        if (this[mid].tlen > distance)
            return this.getPointByDistanceEx(distance, left, mid);
        else if (this[mid].tlen < distance)
            return this.getPointByDistanceEx(distance, mid, right);
        else return this[mid].clone();
    }

    /**
     * 平均切割为 splitCount 段
     * @param {Number} splitCount 
     * @returns {Path} 新的path
     */
    splitAverage(splitCount) {
        var tlen = this.lastElement.tlen;
        var perlen = tlen / splitCount;

        var res = [];
        for (var i = 0; i <= splitCount; i++)
        {
            // 需要重写
            //     var p = this.findByLen(i * perlen);
            //     res.push(p.point)
        }
        return Path(res);
    }

    /**
     * 
     * @param  {...any} ps 
     */
    add(...ps) {
        for (let i = 0; i < ps.length; i++)
        {
            const pt = ps[i];
            this.push(pt);
            pt.len = pt.distanceTo(this.get(-1));
            pt.tlen = this.get(-1).tlen + pt.len;
            pt.direction = pt.clone().sub(this.get(-1).normalize());
            this.get(-1).direction.copy(pt.direction);
        }
    }
}