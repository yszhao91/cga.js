/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-03-22 17:22:02
 * @LastEditTime : 2021-03-22 17:26:46
 * @FilePath     : \cga.js\src\IKanimation\solver.ts
 */

export interface ISolver {
    updateTarget: Function;
    solveIK: Function;
}