/*
 * @Description  :
 * @Author       : 赵耀圣
 * @Q群           : 632839661
 * @Date         : 2021-03-11 16:29:35
 * @LastEditTime : 2021-03-11 16:30:52
 * @FilePath     : \cga.js\src\alg\split.ts
 */

import { Vec3 } from "../math/Vec3";
import { Orientation } from "../struct/data/type";

export interface ISplitResult {
    negative: Vec3[], positive: Vec3[], common: Vec3[], orientation: Orientation
}