import { Vec3 } from "../../math/Vec3";
export declare class Sphere {
    clone(): Sphere | undefined;
    center: Vec3;
    radius: number;
    constructor(center?: Vec3, radius?: number);
}
