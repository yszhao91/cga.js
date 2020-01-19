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
     * 从起点出发到距离等于distance位置  的坐标
     * @param {Number} distance 
     */
    getPointByDistance(arg_distance) {
        distance = clamp(arg_distance, 0, this.lastElement.tlen)

        if (distance !== arg_distance)
            console.warn("当前距离不在线上");

        for (var i = 0; i < this.length - 1; i++)
        {
            if (distance >= this[i].tlen && distance < this[i + 1].tlen)
            {
                return {
                    range: [i, i + 1],
                    point: new THREE.Vector3().lerpVectors(this.data[i], this.data[i + 1], (len - this.data[i].tlen) / this.data[i + 1].len),
                    direction: this.data[i].direction
                }
            }
        }
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
            var p = this.findByLen(i * perlen);
            res.push(p.point)
        }
        return Path(res);
    }
}