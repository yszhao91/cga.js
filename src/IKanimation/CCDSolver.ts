/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-03-22 17:27:16
 * @LastEditTime : 2021-03-23 18:01:49
 * @FilePath     : \cga.js\src\IKanimation\CCDSolver.ts
 */

import { clamp } from "../math/Math";
import { Plane } from "../struct/3d/Plane";
import { Quat } from "../math/Quat";
import { v3, Vec3 } from "../math/Vec3";
import { TypedConstraint } from "./constaint/constraint";
import { ISolver } from "./isolver";
import { Skeleton } from "./skeleton";


const _quat = new Quat();
const _plane = new Plane();
/**
 * @description : 
 * @param        {*}
 * @return       {*}
 * @example     : 
 */
export class CCDSolver implements ISolver {
    constructor() {

    }

    updateTarget() {

    }

    projectPlane(v: Vec3, normal: Vec3) {
        return v.clone().projectOnPlaneNormal(normal);
    }

    calcAngle(v1: Vec3, v2: Vec3, dir: Vec3) {
        var vc1 = v1.clone();
        var vc2 = v2.clone();
        var angle = clamp(vc1.normalize().dot(vc2.normalize()), -1, 1);
        angle = Math.acos(angle);
        if (vc1.cross(vc2).dot(dir) < 0) return -angle;
        return angle;
    }

    /**
     * @description : 
     * @param        {Vec3} target 目标点
     * @param        {Vec3} zeroPos 关节原点
     * @param        {Vec3} effector 末端效应点
     * @return       {*}
     * @example     : 
     */
    solveTranslate(target: Vec3, zeroPos: Vec3, effector: Vec3) {

    }


    /**
     * @description :
     * @param        {Vec3} target 目标点
     * @param        {Vec3} zeroPos 关节原点
     * @param        {Vec3} effector 末端效应点
     * @return       {*}
     * @example     :
     */
    solveRotation(target: Vec3, zeroPos: Vec3, effector: Vec3, contraints?: TypedConstraint[]) {
        let dir0 = effector.clone().sub(zeroPos).normalize();
        let dir1 = target.clone().sub(zeroPos).normalize();
        var rotationAxis = v3().cross(dir0, dir1).normalize();

        _plane.setFromPointNormal(zeroPos, rotationAxis);
        //最近点
        const closestDir: Vec3 = this.projectPlane(target, rotationAxis);
        closestDir.sub(zeroPos);

        var angle = 0;


        _quat.setFromUnitVecs(dir0, closestDir);
        return _quat.clone();
    }

    solveIK(skeleton: Skeleton, target: Vec3) {
        let i = 0;
        while (i++ < skeleton.boneNum) {

        }
    }

    solve(bones: any) {
        // for (var i = bones.Length - 2; i > -1; i--) {
        //     // Slerp if weight is < 0
        //     //CCD tends to overemphasise the rotations of the bones closer to the target position. Reducing bone weight down the hierarchy will compensate for this effect.
        //     var w = bones[i].weight * IKPositionWeight;

        //     if (w > 0) {
        //         Vec3 toLastBone = bones[bones.Length - 1].transform.position - bones[i].transform.position;
        //         Vec3 toTarget = targetPosition - bones[i].transform.position;

        //         // Get the rotation to direct the last bone to the target
        //         Quat targetRotation = Quat.FromToRotation(toLastBone, toTarget) * bones[i].transform.rotation;

        //         if (w >= 1) bones[i].transform.rotation = targetRotation;
        //         else bones[i].transform.rotation = Quaternion.Lerp(bones[i].transform.rotation, targetRotation, w);
        //     }
        // }
    }


}