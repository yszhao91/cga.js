
import { BufferAttribute } from "../../render/bufferAttribute";
import { v3, Vec3 } from "../../math/Vec3";


const _vector = new Vec3();

export class Box {

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

    makeEmpty() {
        this.min.x = this.min.y = this.min.z = + Infinity;
        this.max.x = this.max.y = this.max.z = - Infinity;

        return this;
    }
    clone(): Box | undefined {
        return new Box().copy(this);
    }
    copy(box: Box): Box {
        this.min.copy(box.min);
        this.max.copy(box.max);

        return this;
    }
    setFromCenterAndSize(center: Vec3, size: Vec3) {

        const halfSize = _vector.copy(size).multiplyScalar(0.5);

        this.min.copy(center).sub(halfSize);
        this.max.copy(center).add(halfSize);

        return this;

    }


    setFromBufferAttribute(attribute: BufferAttribute) {

        let minX = + Infinity;
        let minY = + Infinity;
        let minZ = + Infinity;

        let maxX = - Infinity;
        let maxY = - Infinity;
        let maxZ = - Infinity;

        for (let i = 0, l = attribute.count; i < l; i++) {

            const x = attribute.getX(i);
            const y = attribute.getY(i);
            const z = attribute.getZ(i);

            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (z < minZ) minZ = z;

            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
            if (z > maxZ) maxZ = z;

        }

        this.min.set(minX, minY, minZ);
        this.max.set(maxX, maxY, maxZ);

        return this;
    }
    expandByPoint(point: Vec3) {
        this.min.min(point);
        this.max.max(point);

        return this;
    }

    isEmpty() {
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }

    getCenter(target: Vec3): Vec3 {
        if (target === undefined) {

            console.warn('THREE.Box3: .getCenter() target is now required');
            target = new Vec3();

        }

        return this.isEmpty() ? target.set(0, 0, 0) : target.addVecs(this.min, this.max).multiplyScalar(0.5);

    }
}