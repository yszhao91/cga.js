/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-03-23 15:38:13
 * @LastEditTime : 2021-03-23 16:05:01
 * @FilePath     : \cga.js\src\IKanimation\constaint\hinge.ts
 */

import { Vec3 } from "src/math/Vec3";
import { TypedConstraint } from "./constraint";

/**
 * @description :  铰链约束
 * @example     : 
 */
export class HingeContraint extends TypedConstraint {
    axis: Vec3 = Vec3.UnitX;

    //旋转的最小角度
    minAngle: number = -Infinity;
    //旋转的最大角度
    maxAngle: number = +Infinity;
    constructor() {
        super();


    }
}