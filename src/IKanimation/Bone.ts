import { Mat4 } from "src/math/Mat4";
import { Vec3 } from "src/math/Vec3";
import { Thing } from "src/render/thing";
import { TypedConstraint } from "./constaint/constraint";

/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-03-22 17:41:30
 * @LastEditTime : 2021-03-23 16:19:09
 * @FilePath     : \cga.js\src\IKanimation\Bone.ts
 */
export class Bone extends Thing {
    children: Bone[] = [];
    contraints: TypedConstraint[] = []
    matrix: Mat4 = Mat4.Identity;

    constructor() {
        super();
    }


}