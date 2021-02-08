import { v3, Vec3 } from "../../math/Vec3";

export class Sphere {
    clone(): Sphere | undefined {
        throw new Error("Method not implemented.");
    }
    center: Vec3 = v3();
    radius: number = 0;
    constructor(center?: Vec3, radius?: number) {

    }
}