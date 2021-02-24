import { toRadians } from "../../src/math/Math";
import { Vec3 } from "../../src/math/Vec3";

export const wgs84OneOverRadii = new Vec3(
    1.0 / 6378137.0,
    1.0 / 6378137.0,
    1.0 / 6356752.3142451793
);
export const wgs84OneOverRadiiSquared = new Vec3(
    1.0 / (6378137.0 * 6378137.0),
    1.0 / (6378137.0 * 6378137.0),
    1.0 / (6356752.3142451793 * 6356752.3142451793)
);

/**
 * 地理坐标
 */
export class Cartographic {
    /**
     * 单位都是弧度
     * @param longitude  经度
     * @param latitude 纬度
     * @param height 海拔
     */
    constructor(public longitude: number = 0.0, public latitude: number = 0.0, public height: number = 0.0) {

    }

    static fromRadians(longitude: number = 0.0, latitude: number = 0.0, height: number = 0.0, result?: Cartographic) {
        if (!result) {
            return new Cartographic(longitude, latitude, height);
        }
        result.longitude = longitude;
        result.latitude = latitude;
        result.height = height;
        return result;
    }

    static fromDegrees(longitude: number = 0.0, latitude: number = 0.0, height: number = 0.0, result?: Cartographic) {
        if (!result) {
            return new Cartographic(longitude, latitude, height);
        }
        result.longitude = toRadians(longitude);
        result.latitude = toRadians(latitude);
        result.height = height;
        return result;
    }
}