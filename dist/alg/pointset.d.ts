import { Quat } from "../math/Quat";
import { Vec3 } from "../math/Vec3";
import { Plane } from "../struct/3d/Plane";
import { Mat4 } from '../math/Mat4';
/**
 * 点排序函数
 * @param {Vec*} a
 * @param {Vec*} b
 */
export declare function VecCompare(a: {
    x: number;
    z: number | undefined;
    y: number;
}, b: {
    x: number;
    y: number;
    z: number;
}): number;
/**
 * 将向量拆解为数字
 * @param {Array} points
 * @param {String} feature
 * @returns {Array<Number>} 数字数组
 */
export declare function verctorToNumbers(points: string | any[], feature?: string): any[] | undefined;
/**
 * 计算包围盒
 * @param {*} points  点集
 * @returns {Array[min,max]} 返回最小最大值
 */
export declare function boundingBox(points: string | any[]): Vec3[];
/**
 * 点集响应矩阵
 * @param {*} points
 * @param {*} Quat
 * @param {Boolean} ref 是否是引用
 */
export declare function applyQuat(points: any | any[], quat: Quat, ref?: boolean): Quat;
/**
 * 平移
 * @param {*} points
 * @param {*} distance
 * @param {*} ref
 */
export declare function translate(points: any[] | any, distance?: Vec3, ref?: boolean): any;
/**
 * 旋转
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
export declare function rotate(points: any, axis: any, angle: any, ref?: boolean): Quat;
/**
 * 两个向量之间存在的旋转量来旋转点集
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
export declare function rotateByUnitVecs(points: any, vFrom: any, vTo: any, ref?: boolean): Quat;
/**
 * 缩放
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
export declare function scale(points: any, scale: (arg0: any[]) => any, ref?: boolean): any;
/**
 * 响应矩阵
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
export declare function applyMat4(points: any, mat4: Mat4, ref?: boolean): any;
/**
 * 简化点集数组，折线，路径
 * @param {*} points 点集数组，折线，路径 ,继承Array
 * @param {*} maxDistance  简化最大距离
 * @param {*} maxAngle  简化最大角度
 */
export declare function simplifyPointList(points: any, maxDistance?: number, maxAngle?: number): any;
/**
 * 以某个平面生成对称镜像
 * @param {*} points  点集
 * @param {*} plane 对称镜像平面
 */
export declare function reverseOnPlane(points: any, plane: Plane): void;
/**
 * 投影到平面
 * @param {*} points 点集
 * @param {*} plane  投影平面
 * @param {*} projectDirect  默认是法线的方向
 */
export declare function projectOnPlane(points: Vec3[], plane: Plane, projectDirect?: Vec3, ref?: boolean): any;
/**
 * 计算共面点集所在的平面
 * @param {Array<Vec3|Point>} points
 */
export declare function recognitionPlane(points: any): Plane;
/**
 * 判断所有点是否在同一个平面
 * @param {Array<Vec3|Point>} points
 * @param {*} precision
 * @returns {Boolean|Plane} 如果在同一个平面返回所在平面，否则返回false
 */
export declare function isInOnePlane(points: string | any[], precision?: number): false | Plane;
