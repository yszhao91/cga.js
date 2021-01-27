import { Vec3 } from "../../math/Vec3";
/**
 *
 */
export declare class Box {
    min: Vec3;
    max: Vec3;
    _center: Vec3;
    constructor(points: any);
    get center(): Vec3;
    /**
     *
     * @param {Array<Vec3>} points
     */
    setFromPoints(points: any): void;
    expand(...points: any[]): void;
}
