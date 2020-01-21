import { v3, Vector3 } from "../../math/Vector3";

/**
 * 
 */
export class Box {
    constructor() {
        this.min = v3(Infinity, Infinity, Infinity);
        this.max = v3(-Infinity, -Infinity, -Infinity);
        this._center = v3();
    }

    get center() {
        return this._center.add(this.min, this.max).multiplyScalar(0.5)
    }

    /**
     * 
     * @param {Array<Vector3>} points 
     */
    setFromPoints(points) {
        this.min.set(Infinity, Infinity, Infinity);
        this.max.set(-Infinity, -Infinity, -Infinity);
        this.expand(...points)
    }

    expand(...points) {
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            this.min.min(point);
            this.max.max(point);
        }
        this.center.addVectors(this.min, this.max).multiplyScalar(0.5);
    }


}