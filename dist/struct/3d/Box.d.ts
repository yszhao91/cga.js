import { Vec3 } from "../../math/Vec3";
/**
 *
 */
export declare class Box {
    makeEmpty(): void;
    clone(): Box | undefined;
    setFromBufferAttribute(morphAttribute: any): void;
    expandByPoint(_vector: Vec3): void;
    getCenter(center: any): Vec3;
    min: Vec3;
    max: Vec3;
    _center: Vec3;
    constructor(min?: Vec3, max?: Vec3);
    get center(): Vec3;
    /**
     *
     * @param {Array<Vec3>} points
     */
    setFromPoints(points: any): void;
    expand(...points: any[]): void;
}
