import { v3 } from "../../math/Vector3";

export class Box {
    constructor() {
        this.min = v3();
        this.max = v3();
        this._center = v3();
    }

    get center() {
        return this._center.add(this.min, this.max).multiplyScalar(0.5)
    }

    setFromPoints(points) {
        for (let i = 0; i < points.length; i++)
        {
            this.
        }
    }
}