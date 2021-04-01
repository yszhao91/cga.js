import { Vec3 } from "src/math/Vec3";
import { TypedConstraint } from "./constraint";

/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-03-23 15:38:05
 * @LastEditTime : 2021-03-23 16:01:18
 * @FilePath     : \cga.js\src\IKanimation\constaint\slider.ts
 */
/**
 * @description : 滑块约束 
 * @example     : 
 */
export class SliderConstraint extends TypedConstraint {
    axis: Vec3 = Vec3.UnitX;
    min: number = 0;
    max: number = 10;
    constructor() {
        super();
    }


}