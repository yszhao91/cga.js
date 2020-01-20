import { Quaternion } from "../math/Quaternion";
import { clone } from "../utils/array";
import { v3 } from "../math/Vector3";

const _vector = v3();

/**
 * 点排序函数
 * @param {Vector*} a 
 * @param {Vector*} b
 */
export function vectorCompare(a, b) {
    if (a.x === b.x)
    {
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
export function verctorToNumbers(points, feature = "xyz") {
    if (!(points instanceof Array))
    {
        console.error("传入参数必须是数组");
        return;
    }

    var numbers = [];
    if (points[0].x !== undefined && points[0].y !== undefined && points[0].z !== undefined)
    {
        for (var i = 0; i < points.length; i++)
        {
            for (let j = 0; j < feature.length; j++)
            {
                numbers.push(points[i][feature[j]]);
            }
        }
    } else if (points[0].x !== undefined && points[0].y !== undefined)
        for (var i = 0; i < points.length; i++)
        {
            numbers.push(points[i].x);
            numbers.push(points[i].y);
        }
    else if (points[0] instanceof Array)
    {
        for (var i = 0; i < points.length; i++)
        {
            numbers = numbers.concat(verctorToNumbers(points[i]));
        }
    } else
    {
        console.error("数组内部的元素不是向量");
    }

    return numbers;
}

/**
 * 计算包围盒
 * @param {*} points  点集
 * @returns {Array[min,max]} 返回最小最大值
 */
export function boundingBox(points) {
    this.min = new Vector3(+Infinity, +Infinity, +Infinity);
    this.max = new Vector3(-Infinity, -Infinity, -Infinity);
    for (let i = 0; i < points.length; i++)
    {
        this.min.min(points[i]);
        this.max.max(points[i]);
    }
    return [min, max];
}

/**
 * 
 * @param {*} points 
 * @param {*} quaternion 
 * @param {Boolean} ref 是否是引用
 */
export function applyQuaternion(points, quaternion, ref = true) {
    if (ref)
    {
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
    if (ref)
    {
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
 * 两个向量之间存在的旋转量来旋转点集
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
    if (ref)
    {
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
    if (ref)
    {
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
    for (let i = 0; i < points.length; i++)
    {
        // 删除小距离
        const P = points[i];
        const nextP = points[i + 1];
        if (P.distanceTo(nextP) < maxDistance)
        {
            if (i === 0)
                points.remove(i + 1, 1);
            else if (i === points.length - 2)
                points.splice(i, 1);
            else
            {
                points.splice(i, 2, P.clone().add(nextP).multiplyScalar(0.5));
            }
            i--;
        }
    }

    for (let i = 1; i < points.length - 1; i++)
    {
        // 删除小小角度
        const preP = points[i - 1];
        const P = points[i];
        const nextP = points[i + 1];
        if (Math.acos(P.clone().sub(preP).normalize().dot(nextP.clone().sub(P).normalize())) < maxAngle)
        {
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
export function reverseOnPlane(points, plane) {

}

/**
 * 投影到平面
 * @param {*} points 点集
 * @param {*} plane  投影平面
 * @param {*} projectDirect  默认是法线的方向
 */
export function projectOnPlane(points, plane, projectDirect) {
    return points;
}

/** 
 * 最优凸包 quick-hull 2D 3D 都行
 * @param {*} points 点集 
 * @param {*} select 如果是3d的，并且在同一平面，可以使用此项选抽取两个轴，来生成平面凸包
 */
export function convexHull(points, select = "XYZ") {

    return new Polygon();
}

// export function 


