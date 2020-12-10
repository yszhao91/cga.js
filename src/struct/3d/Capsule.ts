import { v3, Vec3 } from "../../math/Vec3";
import { Segment } from "./Segment";

export class Capsule extends Segment {
    /**
     * 胶囊体
     * @param {Point|Vec3} p0 点0
     * @param {Point|Vec3} p1 点1
     * @param {Number} radius  半径
     */
    constructor(p0: Vec3, p1: Vec3, public radius: number = 0) {
        super(p0, p1);
    }

    //距离


}