import { Vec3 } from '../../math/Vec3';

export class Point extends Vec3 {
    constructor(_x: number = 0, _y: number = 0, _z: number = 0) {
        super(_x, _y, _z);
    }
}