import { Vec3 } from '../../math/Vec3';

export class Point extends Vec3 {
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        super(x, y, z);
    }
}