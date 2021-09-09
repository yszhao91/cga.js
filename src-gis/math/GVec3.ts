import { toRadians } from "src";
import { wgs84RadiiSquared } from "src-gis/gis";
import { Vec3 } from "src/math/Vec3";

/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-04 11:39:03
 * @LastEditTime : 2021-08-04 16:02:16
 * @FilePath     : \cga.js\src-gis\math\GVec3.ts
 */

const scratchN = new Vec3();
const scratchK = new Vec3();
export class GVec3 extends Vec3 {
    static fromDegrees(longitude: number,
        latitude: number,
        height: number = 0,
        ellipsoid: Vec3 = wgs84RadiiSquared,
    ) {
        longitude = toRadians(longitude);
        latitude = toRadians(latitude);

        return GVec3.fromRadians(longitude, latitude, height, ellipsoid);
    }

    /**
     * @description : 
     * @param ellipsoid  {椭球体}
     * @return       {*}
     * @example     : 
     */
    static fromRadians(longitude: number, latitude: number,
        height: number = 0,
        ellipsoid: Vec3 = wgs84RadiiSquared) {

        var cosLatitude = Math.cos(latitude);
        scratchN.x = cosLatitude * Math.cos(longitude);
        scratchN.y = Math.sin(latitude);
        scratchN.z = cosLatitude * Math.sin(longitude);
        scratchN.normalize(); //标准球形坐标

        scratchK.copy(scratchN).multiply(ellipsoid);//各个单位
        var gamma = Math.sqrt(scratchN.dot(scratchK));
        scratchK.divideScalar(gamma);
        scratchN.multiplyScalar(height);//scratchN始终是一个标准球

        var result = new Vec3();
        return result.addVecs(scratchK, scratchN);
    }

    static toCartographic() {
    }
}