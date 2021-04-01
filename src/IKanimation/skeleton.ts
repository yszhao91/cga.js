/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-03-22 17:38:38
 * @LastEditTime : 2021-03-23 16:45:35
 * @FilePath     : \cga.js\src\IKanimation\skeleton.ts
 */

import { Bone } from "./Bone"


/**
 * @description : 骨架
 * @param        {*}
 * @return       {*}
 * @example     : 
 */
export class Skeleton {
    bones: Bone[][] = [[]];//多级骨骼
    rootBone: Bone | undefined;

    constructor() {

    }

    get boneNum() {
        return this.bones.length;
    }
}