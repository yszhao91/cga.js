import { Vec3 } from "../math/Vec3";
import {vecs} from "../math/vecs";


/*
 * @Description  :  如无必要，勿增实体
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-09-30 10:54:56
 * @LastEditTime : 2021-09-30 10:59:50
 * @FilePath     : \cga.js\src\alg\distance.ts
 */
const _vec3_1 = new Vec3();
export class Distance {

    static Point2Point_Number(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number) {
        return vecs.distance(x0, y0, z0, x1, y1, z1)
    }

    static Point2Line_Number(x0: number, y0: number, z0: number, sox: number, soy: number, soz: number, sdx: number, sdy: number, sdz: number) {

    }

    /**
     * 
     * @param point 
     * @param origin 
     * @param dir 默认已经正交化
     */
    static Point2Line_Vec3(point: Vec3, origin: Vec3, dir: Vec3, result: Vec3 = new Vec3): Vec3 {
        result.copy(point).sub(origin);
        const len = result.dot(dir);

        result.copy(dir).multiplyScalar(len);
        result.add(point)

        return result;
    }

}