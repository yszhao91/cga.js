import { v3, Vector3 } from "../../math/Vector3";
import { Segment } from "./Segment";

export class Capsule extends Segment {
    /**
     * 胶囊体
     * @param {Point|Vector3} p0 点0
     * @param {Point|Vector3} p1 点1
     * @param {Number} radius  半径
     */
    constructor(p0, p1, radius) {
        super(p0, p1);
        this.radius = radius || 0;
    }


}