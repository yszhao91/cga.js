import { Vec3 } from '../../math/Vec3';
export declare class Disk {
    center: Vec3;
    normal: Vec3;
    radius: number;
    w: number;
    constructor(center: Vec3, radius: number, normal?: Vec3);
    area(): number;
}
export declare function disk(center: Vec3, radius: number, normal: Vec3): Disk;
