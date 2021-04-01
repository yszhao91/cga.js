/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-03-23 15:38:27
 * @LastEditTime : 2021-03-23 16:05:43
 * @FilePath     : \cga.js\src\IKanimation\constaint\constraint.ts
 */

import { Mat4 } from "../../math/Mat4";

export enum ISpace {
    Globe,
    Local,
}

export abstract class TypedConstraint {
    space: ISpace = ISpace.Local;
    matrix: Mat4 = Mat4.Identity;
    constructor() {

    }
}