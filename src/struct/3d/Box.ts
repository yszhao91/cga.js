import { v3, Vec3 } from "../../math/Vec3";

/**
 * 
 */
export class Box {
    min: Vec3 = v3(Infinity, Infinity, Infinity);
    max: Vec3 = v3(-Infinity, -Infinity, -Infinity);
    _center: Vec3 = v3();
    constructor(points: any) {
        if (points) {
            this.setFromPoints(points);
        }
    }

    get center() {
        return this._center.add(this.min, this.max).multiplyScalar(0.5)
    }

    /**
     * 
     * @param {Array<Vec3>} points 
     */
    setFromPoints(points: any) {
        this.min.set(Infinity, Infinity, Infinity);
        this.max.set(-Infinity, -Infinity, -Infinity);
        this.expand(...points)
    }

    expand(...points: any[]) {
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            this.min.min(point);
            this.max.max(point);
        }
        this.center.addVecs(this.min, this.max).multiplyScalar(0.5);
    }


}