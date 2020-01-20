import { vectorCompare } from "./points";
// import { Vector3 } from "../math/Vector3";
import { Vector2 } from "../math/Vector2";
import { unique } from "../utils/array";

export class ConvexHull {
    constructor(points) {
        this.min = new Vector2(+Infinity, +Infinity, +Infinity);
        this.max = new Vector2(-Infinity, -Infinity, -Infinity);
        for (let i = 0; i < points.length; i++)
        {
            this.min.min(points[i]);
            this.max.max(points[i]);
        }
        this.boundingRange = this.max.clone().sub(this.min);
        points.sort(vectorCompare);
        unique(points, (a, b) => a.equals(b), vectorCompare);
    }

    getHull() {

    }
}