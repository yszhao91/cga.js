import { Vec3 } from '../math/Vec3';
/**
 * 地图的制图坐标系经纬度以及高度
 */
export declare class Cartographic {
    longitude: number;
    latitude: number;
    height: number;
    constructor(longitude?: number, latitude?: number, height?: number);
    set(longitude?: number, latitude?: number, height?: number): void;
    setFromDegrees(longitude?: number, latitude?: number, height?: number): void;
    setFromVec3(v: Vec3, ellipsoid?: any): void;
}
