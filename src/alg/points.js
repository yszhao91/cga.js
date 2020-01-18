import { Quaternion } from "../math/Quaternion";
import { clone } from "../utils/array";
/**
 * 
 * @param {*} points 
 * @param {*} quaternion 
 * @param {Boolean} ref 是否是引用
 */
export function applyQuaternion(points, quaternion, ref = true) {
    if (ref) {
        points.flat(Infinity).forEach(point => {
            point.applyQuaternion(quaternion);
        });
        return points;
    }

    return applyQuaternion(clone(points))
}

/**
 * 平移
 * @param {*} points 
 * @param {*} distance 
 * @param {*} ref 
 */
export function translate(points, distance, ref = true) {
    if (ref) {
        points.flat(Infinity).forEach(point => {
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
export function rotate(points, axis, angle, ref = true) {
    return applyQuaternion(points, new Quaternion().setFromAxisAngle(axis, angle), ref)
}

/**
 * 旋转
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function rotateByUnitVectors(points, vFrom, vTo, ref = true) {
    return applyQuaternion(points, new Quaternion().setFromUnitVectors(vFrom, vTo), ref)
}


/**
 * 缩放
 * @param {*} points 
 * @param {*} axis 
 * @param {*} angle 
 * @param {*} ref 
 */
export function scale(points, scale, ref = true) {
    if (ref) {
        points.flat(Infinity).forEach(point => {
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
export function applyMatrix4(points, matrix, ref = true) {
    if (ref) {
        points.flat(Infinity).forEach(point => {
            point.applyMatrix4(matrix);
        });
        return points;
    }
    return applyMatrix4(clone(points));
}

/**
 * 简化点集数组，折线，路径
 * @param {*} points 点集数组，折线，路径 ,继承Array
 * @param {*} maxDistance  简化最大距离
 * @param {*} maxAngle  简化最大角度
 */
export function simplifyPointList(points, maxDistance = 0.1, maxAngle = Math.PI / 180 * 5) {
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
 *  最优凸包
 */
export function convexHull(points) {

    return new Polygon();
}

export function vectorCompare(a, b) {
    if (a.x === b.x) {
        if (a.z !== undefined && a.y === b.y)
            return a.z - b.z
        else
            return a.y - b.y;
    }
    else
        return a.x - b.x;
}


