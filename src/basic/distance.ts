import { Point, vector } from "src";

/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-09-30 10:54:56
 * @LastEditTime : 2021-09-30 10:59:50
 * @FilePath     : \cga.js\src\alg\distance.ts
 */
export class Distance {

    static Point_Point(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
        return vector.distance(x0, y0, z0, x1, y1, z1)
    }

    static Point2Line(x0: number, y0: number, z0: number, sox: number, soy: number, soz: number, sdx: number, sdy: number, sdz: number) {

    }


}