import { Point } from "src";

/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-09-30 10:54:56
 * @LastEditTime : 2021-09-30 10:59:50
 * @FilePath     : \cga.js\src\alg\distance.ts
 */
export class Distance {

    static Point2Point_o(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
        return Math.sqrt((x0 - x1) * (x0 - x1) + (y0 - y1) * (y0 - y1) + (z0 - z1) * (z0 - z1));
    }

    static Point2Line(x0: number, y0: number, z0: number, sox: number, soy: number, soz: number) {

    }
}