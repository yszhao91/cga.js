import { v3 } from "../../math/Vector3";
import { Segment } from "./Segment";

export class Capsule extends Segment {
    constructor(p0, p1, radius) {
        super(p0, p1);
        this.radius = radius || 0;
    }


}