import { Vec3, v3 } from '../math/Vec3';
import { Point } from '../struct/3d/Point';
import { delta4 } from '../math/Math';
import { Line } from '../struct/3d/Line';
import { circle, Circle } from '../struct/3d/Circle';
import { Quat } from '../math/Quat';
import { Plane } from '../struct/3d/Plane';
import { Mat4 } from '../math/Mat4';
import { isDefined } from '../utils/types';

const XYZSort = (e1: Vec3, e2: Vec3) => {
    if (e1.x !== e2.x)
        return e1.x - e2.x;
    else if (e1.y !== e2.y)
        return e1.y - e2.y;
    else
        return e1.z - e2.z;
}


const _vector = v3();

/**
 * 数组深度复制
 * @param {Array} array
 */
export function clone(array: any | any[]) {
    if (!isDefined(array))
        return array;

    if (Array.isArray(array)) {
        var result = new Array()
        for (let i = 0; i < array.length; i++) {

            result[i] = clone(array[i]);

        }
        return result;
    } else {
        if (array.clone)
            return array.clone();
        else
            return array;
    }
}


/**
 * 点排序函数 xyz 有序排序回调
 * @param {Vector*} a 
 * @param {Vector*} b
 */
export function vectorCompare(a: any | Vec3, b: any | Vec3) {
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
 * 计算包围盒
 * @param {*} points  点集
 * @returns {Array[min,max]} 返回最小最大值
 */
export function boundingBox(points: Vec3[]) {
    const min = new Vec3(+Infinity, +Infinity, +Infinity);
    const max = new Vec3(-Infinity, -Infinity, -Infinity);
    for (let i = 0; i < points.length; i++) {
        min.min(points[i]);
        max.max(points[i]);
    }
    return [min, max];
}

/**
 * 
 * @param {*} points 
 * @param {*} quat 
 * @param {Boolean} ref 是否是引用
 */
export function applyQuat(points: any | Vec3[], quat: Quat, ref = true): Vec3 | any {
    if (ref) {
        points.flat(Infinity).forEach((point: Vec3 | any) => {
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
export function translate(points: any | Vec3[], distance: Vec3, ref = true): Vec3[] | any {
    if (ref) {
        points.flat(Infinity).forEach((point: Vec3 | any) => {
            point.add(distance);
        });
        return points;
    }
    return translate(clone(points), distance)
}

/**
 * 旋转
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function rotate(points: any | Vec3[], axis: Vec3, angle: number, ref = true) {
    return applyQuat(points, new Quat().setFromAxisAngle(axis, angle), ref)
}

/**
 * 两个向量之间存在的旋转量来旋转点集
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function rotateByUnitVectors(points: any | Vec3[], vFrom: Vec3, vTo: Vec3, ref = true) {
    return applyQuat(points, new Quat().setFromUnitVecs(vFrom, vTo), ref)
}


/**
 * 缩放
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function scale(points: any | Vec3[], _scale: Vec3, ref = true): Vec3[] | any {
    if (ref) {
        points.flat(Infinity).forEach((point: Vec3 | any) => {
            point.multiply(_scale);
        });
        return points;
    }
    return scale(clone(points), _scale);
}

/**
 * 响应矩阵
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function applyMatrix4(points: any | Vec3[], matrix: Mat4, ref = true): Vec3[] | any {
    if (ref) {
        points.flat(Infinity).forEach((point: Vec3 | any) => {
            point.applyMatrix4(matrix);
        });
        return points;
    }
    return applyMatrix4(clone(points), matrix);
}

/**
 * 简化点集数组，折线，路径
 * @param {*} points 点集数组，折线，路径 ,继承Array
 * @param {*} maxDistance  简化最大距离
 * @param {*} maxAngle  简化最大角度
 */
export function simplifyPointList(points: any | Vec3[], maxDistance = 0.1, maxAngle = Math.PI / 180 * 5) {
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
export function reverseOnPlane(points: any | Vec3[], plane: Plane) {

}

/**
 * 投影到平面
 * @param {*} points 点集
 * @param {*} plane  投影平面
 * @param {*} projectDirect  默认是法线的方向
 */
export function projectOnPlane(points: any | Vec3[], plane: Plane, projectDirect: Vec3) {
    return points;
}

/**
 * 计算共面点集所在的平面
 * @param {Array<Vec3|Point>} points 
 */
export function recognitionPlane(points: Vec3[] | any) {
    points.sort(vectorCompare);
    var line = new Line(points[0], points.get(-1));
    var maxDistance = -Infinity;
    var ipos = -1;
    for (let i = 1; i < points.length - 1; i++) {
        const pt = points[i];
        const distance: any | number = line.distancePoint(pt).distance;
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
export function isInOnePlane(points: Vec3[] | any, precision = delta4) {
    var plane = recognitionPlane(points);
    for (let i = 0; i < points.length; i++) {
        const pt = points[i];
        if (plane.distancePoint(pt) >= precision)
            return false;
    }
    return plane;
}






/**
 * 判断多边是否共线:
 * 考虑情况点之间的距离应该大于最小容忍值
 * @param  {...Vec3[]} ps  
 */
export function pointsCollinear(...ps: Vec3[]) {
    ps.sort(XYZSort);
    var sedir = ps[ps.length - 1].clone().sub(ps[0])
    var selen = ps[ps.length - 1].distanceTo(ps[0])
    for (let i = 1; i < ps.length - 1; i++) {
        var ilens = ps[i].distanceTo(ps[0]);
        var ilene = ps[i].distanceTo(ps[ps.length - 1]);
        if (ilens < ilene) {
            if (Math.abs(ps[i].clone().sub(ps[0]).dot(sedir) - selen * ilens) > delta4)
                return false
        } else {
            if (Math.abs(ps[i].clone().sub(ps[ps.length - 1]).dot(sedir) - selen * ilene) > delta4)
                return false
        }
    }
    return true
}

/**
 * 三点计算圆
 * @param p0 
 * @param p1 
 * @param p2 
 */
export function calcCircleFromThreePoint(p0: Vec3, p1: Vec3, p2: Vec3) {
    return new Circle().setFrom3Points(p0, p1, p2);
}


export function angle(v0: Vec3, v1: Vec3, normal?: Vec3): number {
    return v0.angleTo(v1, normal)
}

