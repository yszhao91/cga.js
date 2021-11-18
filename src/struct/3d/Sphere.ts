import { Mat4 } from '@/cga/math/Mat4';
import { v3, Vec3 } from '../../math/Vec3';

export class Sphere {
    applyMat4(mat: Mat4) {
        throw new Error('Method not implemented.');
    }

    center: Vec3;
    radius: number;
    constructor(center: Vec3 = v3(), radius: number = 0) {
        this.center = center;
        this.radius = radius;
    }

    copy(sphere: Sphere) {
        this.center.copy(sphere.center)
        this.radius = sphere.radius;
        return this;
    }

    clone(): Sphere | undefined {
        return new Sphere().copy(this);
    }
}