import { GVec3 } from "./GVec3";

/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-04 15:23:31
 * @LastEditTime : 2021-08-04 15:27:07
 * @FilePath     : \cga.js\src-gis\math\Cartographic.ts
 */
export class Cartographic {
    longitude: number;
    latitude: number;
    height: number;
    constructor(longitude: number = 0, latitude: number = 0, height: number = 0) {
        this.longitude = longitude;
        this.latitude = latitude;
        this.height = height;
    }

    static fromGVec3(vec: GVec3) {
        return new Cartographic()
    }
}