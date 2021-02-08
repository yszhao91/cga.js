import { v3, Vec3 } from "../../math/Vec3";

/**
 * 
 */
export class Box {
    makeEmpty() {
        throw new Error("Method not implemented.");
    }
    clone(): Box | undefined {
        throw new Error("Method not implemented.");
    }
    setFromBufferAttribute(morphAttribute: any) {
        throw new Error("Method not implemented.");
    }
    expandByPoint(_vector: Vec3) {
        throw new Error("Method not implemented.");
    }
    getCenter(center: any): Vec3 {
        throw new Error("Method not implemented.");
    }
    min: Vec3;
    max: Vec3;
    _center: Vec3 = v3();
    constructor(min: Vec3 = v3(Infinity, Infinity, Infinity), max: Vec3 = v3(-Infinity, -Infinity, -Infinity)) {
        this.min = min;
        this.max = max;
        // if (points) {
        //     this.setFromPoints(points);
        // }
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