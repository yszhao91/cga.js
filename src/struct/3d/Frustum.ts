import { Plane } from './Plane'
import { Vec3 } from '../../math/Vec3';
import { Mat4 } from '../../math/Mat4';
import { BufferGeometry } from '../../render/geometry';
import { Sphere } from './Sphere';
import { applyMat4 } from '../../alg/pointset';
import { Segment } from './Segment';
import { Path } from './Path';

const _sphere = new Sphere()
/**
 * 视锥体
 */
export class Frustum {

    planes: Plane[] = [new Plane(), new Plane(), new Plane(), new Plane(), new Plane(), new Plane()];


    constructor() {

    }

    get front(): Plane {
        return this.planes[0]
    }
    get back(): Plane {
        return this.planes[1]
    }
    get top(): Plane {
        return this.planes[2]
    }
    get bottom(): Plane {
        return this.planes[3]
    }
    get left(): Plane {
        return this.planes[4]
    }
    get right(): Plane {
        return this.planes[5]
    }

    /**
     * 从投影矩阵计算视锥体
     * @param m 
     * @returns 
     */
    setFromProjectionMatrix(m: Mat4) {

        const planes = this.planes;
        const me = m.elements;
        const me0 = me[0], me1 = me[1], me2 = me[2], me3 = me[3];
        const me4 = me[4], me5 = me[5], me6 = me[6], me7 = me[7];
        const me8 = me[8], me9 = me[9], me10 = me[10], me11 = me[11];
        const me12 = me[12], me13 = me[13], me14 = me[14], me15 = me[15];

        planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me12 - me15).normalize();
        planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me12 + me15).normalize();
        planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me13 + me15).normalize();
        planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me13 - me15).normalize();
        planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me14 - me15).normalize();
        planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me14 + me15).normalize();

        return this;

    }


    static fromProjectionMatrix(m: Mat4) {
        return new Frustum().setFromProjectionMatrix(m);
    }

    setFromPerspective(position: Vec3, target: Vec3, up: Vec3, fov: number, aspect: number, near: number, far: number) {
        const direction = target.clone().sub(position);
    }

    intersectsObject(geometry: BufferGeometry, mat: Mat4) {

        if (!geometry.boundingSphere) geometry.computeBoundingSphere();

        _sphere.copy(geometry.boundingSphere!).applyMat4(mat);

        return this.intersectsSphere(_sphere);

    }

    // intersectsSprite(sprite) {

    //     _sphere.center.set(0, 0, 0);
    //     _sphere.radius = 0.7071067811865476;
    //     _sphere.applyMatrix4(sprite.matrixWorld);

    //     return this.intersectsSphere(_sphere);

    // }

    intersectsSphere(sphere: Sphere) {

        const planes = this.planes;
        const center = sphere.center;
        const negRadius = - sphere.radius;

        for (let i = 0; i < 6; i++) {

            const distance = planes[i].distancePoint(center);

            if (distance < negRadius) {

                return false;

            }

        }

        return true;

    }

    intersectsSphereComponents(cx: number, cy: number, cz: number, radius: number) {

        _sphere.setComponents(cx, cy, cz, radius)

        return this.intersectsSphere(_sphere)
    }


    containsPoint(point: Vec3) {

        const planes = this.planes;

        for (let i = 0; i < 6; i++) {

            if (planes[i].distancePoint(point) < 0) {

                return false;

            }

        }

        return true;

    }

    intersectSegment(segment: Segment | Vec3[]) {
        const planes = this.planes;
        for (let i = 0; i < 6; i++) {
            const intersectPoint = planes[i].intersectSegmentLw(segment)
            if (intersectPoint !== null) {
                return intersectPoint;
            }
        }
        return null;
    }

    simpleIntersectVS(vs: Vec3[]) {
        const contains: boolean[] = vs.map(v => this.containsPoint(v))
        const res = []
        let oneres: Vec3[] = []
        for (let i = 0; i < vs.length; i++) {
            const p: Vec3 = vs[i];
            const c0 = contains[i];
            (p as any).index = i;
            if (c0) {
                res.push(p);
            }
        }

        if (res.length > 0) {
            const startI = (res[0] as any).index;
            const endI = (res[res.length - 1] as any).index;
            if (startI > 0)
                res.unshift(vs[startI - 1])
            if (endI < vs.length - 2)
                res.push(vs[endI + 1])
        }
        return res;
    }

    copy(frustum: Frustum) {

    }

    clone() {

        return new (this as any).constructor().copy(this);

    }

}