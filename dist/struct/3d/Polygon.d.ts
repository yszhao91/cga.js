import { Vec3 } from '../../math/Vec3';
import { Polyline } from "./Polyline";
export declare class Polygon extends Polyline {
    isPolygon: boolean;
    constructor(vs?: any[]);
    offset(distance: number, normal?: Vec3): Polygon;
    containPoint(point: Vec3): void;
}
