import { Quat } from "../math/Quat";
import { v3, Vec3 } from "../math/Vec3";
import { gPrecision } from "../math/Math";
import { Line } from "../struct/3d/Line";
import { Plane } from "../struct/3d/Plane";
import { Mat4 } from '../math/Mat4';
import { clone } from "./common";

const _Vec = v3();

/**
 * 点排序函数
 * @param {Vec*} a 
 * @param {Vec*} b
 */
export function VecCompare(a: { x: number; z: number | undefined; y: number; }, b: { x: number; y: number; z: number; }) {
    if (a.x === b.x) {
        if (a.z !== undefined && a.y === b.y)
            return a.z - b.z
        else
            return a.y - b.y;
    }
    else
        return a.x - b.x;
}

/**
 * 将向量拆解为数字
 * @param {Array} points 
 * @param {String} feature 
 * @returns {Array<Number>} 数字数组
 */
export function verctorToNumbers(points: string | any[], feature = "xyz") {
    if (!(points instanceof Array)) {
        console.error("传入参数必须是数组");
        return;
    }

    var numbers: any[] = [];
    if (points[0].x !== undefined && points[0].y !== undefined && points[0].z !== undefined) {
        for (var i = 0; i < points.length; i++) {
            for (let j = 0; j < feature.length; j++) {
                numbers.push(points[i][feature[j]]);
            }
        }
    } else if (points[0].x !== undefined && points[0].y !== undefined)
        for (var i = 0; i < points.length; i++) {
            numbers.push(points[i].x);
            numbers.push(points[i].y);
        }
    else if (points[0] instanceof Array) {
        for (var i = 0; i < points.length; i++) {
            numbers = numbers.concat(verctorToNumbers(points[i]));
        }
    } else {
        console.error("数组内部的元素不是向量");
    }

    return numbers;
}

/**
 * 计算包围盒
 * @param {*} points  点集
 * @returns {Array[min,max]} 返回最小最大值
 */
export function boundingBox(points: string | any[]) {
    const min = new Vec3(+Infinity, +Infinity, +Infinity);
    const max = new Vec3(-Infinity, -Infinity, -Infinity);
    for (let i = 0; i < points.length; i++) {
        min.min(points[i]);
        max.max(points[i]);
    }
    return [min, max];
}

/**
 * 点集响应矩阵
 * @param {*} points 
 * @param {*} Quat 
 * @param {Boolean} ref 是否是引用
 */
export function applyQuat(points: any | any[], quat: Quat, ref: boolean = true): Quat {
    if (ref) {
        points.flat(Infinity).forEach((point: { applyQuat: (arg0: any) => void; }) => {
            point.applyQuat(quat);
        });
        return points;
    }

    return applyQuat(clone(points), quat)
}

/**
 * 平移
 * @param {*} points 
 * @param {*} distance 
 * @param {*} ref 
 */
export function translate(points: any[] | any, distance?: Vec3, ref = true): any {
    if (ref) {
        points.flat(Infinity).forEach((point: { add: (arg0: any) => void; }) => {
            point.add(distance);
        });
        return points;
    }
    return translate(clone(points))
}

/**
 * 旋转
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function rotate(points: any, axis: any, angle: any, ref = true) {
    return applyQuat(points, new Quat().setFromAxisAngle(axis, angle), ref)
}

/**
 * 两个向量之间存在的旋转量来旋转点集
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function rotateByUnitVecs(points: any, vFrom: any, vTo: any, ref = true) {
    return applyQuat(points, new Quat().setFromUnitVecs(vFrom, vTo), ref)
}


/**
 * 缩放
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function scale(points: any, scale: (arg0: any[]) => any, ref = true) {
    if (ref) {
        points.flat(Infinity).forEach((point: { scale: { multiply: (arg0: any) => void; }; }) => {
            point.scale.multiply(scale);
        });
        return points;
    }
    return scale(clone(points));
}

/**
 * 响应矩阵
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function applyMat4(points: any, mat4: Mat4, ref: boolean = true): any {
    if (ref) {
        points.flat(Infinity).forEach((point: { applyMat4: (arg0: any) => void; }) => {
            point.applyMat4(mat4);
        });
        return points;
    }
    return applyMat4(clone(points), mat4);
}

/**
 * 简化点集数组，折线，路径
 * @param {*} points 点集数组，折线，路径 ,继承Array
 * @param {*} maxDistance  简化最大距离
 * @param {*} maxAngle  简化最大角度
 */
export function simplifyPointList(points: any, maxDistance = 0.1, maxAngle = Math.PI / 180 * 5) {
    for (let i = 0; i < points.length; i++) {
        // 删除小距离
        const P = points[i];
        const nextP = points[i + 1];
        if (P.distanceTo(nextP) < maxDistance) {
            if (i === 0)
                points.remove(i + 1, 1);
            else if (i === points.length - 2)
                points.splice(i, 1);
            else {
                points.splice(i, 2, P.clone().add(nextP).multiplyScalar(0.5));
            }
            i--;
        }
    }

    for (let i = 1; i < points.length - 1; i++) {
        // 删除小小角度
        const preP = points[i - 1];
        const P = points[i];
        const nextP = points[i + 1];
        if (Math.acos(P.clone().sub(preP).normalize().dot(nextP.clone().sub(P).normalize())) < maxAngle) {
            points.splice(i, 1);
            i--
        }
    }
    return points;
}

/**
 * 以某个平面生成对称镜像
 * @param {*} points  点集
 * @param {*} plane 对称镜像平面
 */
export function reverseOnPlane(points: any, plane: Plane) {

}

/**
 * 投影到平面
 * @param {*} points 点集
 * @param {*} plane  投影平面
 * @param {*} projectDirect  默认是法线的方向
 */
export function projectOnPlane(points: Vec3[], plane: Plane, projectDirect: Vec3 = plane.normal, ref: boolean = true): any {
    if (ref) {
        for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            pt.projectDirectionOnPlane(plane, projectDirect);
        }
        return points;
    } else {
        return projectOnPlane(clone(points), plane, projectDirect)
    }
}

/**
 * 计算共面点集所在的平面
 * @param {Array<Vec3|Point>} points 
 */
export function recognitionPlane(points: any) {
    points.sort(VecCompare);
    var line = new Line(points[0], points.get(-1));
    var maxDistance = -Infinity;
    var ipos = -1;
    for (let i = 1; i < points.length - 1; i++) {
        const pt = points[i];
        var distance: any = line.distancePoint(pt).distance;
        if (distance > maxDistance) {
            maxDistance = distance;
            ipos = i;
        }
    }
    var plane = new Plane();
    plane.setFromThreePoint(points[0], points.get(-1), points[ipos]);
    return plane;
}

/** 
 * 判断所有点是否在同一个平面
 * @param {Array<Vec3|Point>} points 
 * @param {*} precision 
 * @returns {Boolean|Plane} 如果在同一个平面返回所在平面，否则返回false 
 */
export function isInOnePlane(points: string | any[], precision = gPrecision) {
    var plane = recognitionPlane(points);
    for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        if (plane.distancePoint(pt) >= precision)
            return false;
    }
    return plane;
}


// export function 


