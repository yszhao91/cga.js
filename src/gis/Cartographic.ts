
import { Vec3 } from '../math/Vec3';
import { toRadians } from '../math/Math';
import { wgs84OneOverRadii, wgs84OneOverRadiiSquared } from './gis';
import { Mat4 } from '../math/Mat4';

/**
 * 地图的制图坐标系经纬度以及高度
 */

export class Cartographic {
    constructor(public longitude: number = 0, public latitude: number = 0, public height: number = 0) {


    }

    set(longitude: number = 0, latitude: number = 0, height = 0) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.height = height;
    }

    setFromDegrees(longitude: number = 0, latitude: number = 0, height = 0) {
        this.set(toRadians(longitude), toRadians(latitude), height);
    }

    setFromVec3(v: Vec3, ellipsoid?: any) {
        var oneOverRadii = wgs84OneOverRadii
        var oneOverRadiiSquared = wgs84OneOverRadiiSquared;
        var centerToleranceSquared = 0.1;
    }



}

