import { Vec3 } from "../../math/Vec3";
import { Segment } from "./Segment";
export declare class Capsule extends Segment {
    radius: number;
    /**
     * 胶囊体
     * @param {Point|Vec3} p0 点0
     * @param {Point|Vec3} p1 点1
     * @param {Number} radius  半径
     */
    constructor(p0: Vec3, p1: Vec3, radius?: number);
}
