import { Vec3 } from '../math/Vec3';
import { Circle } from '../struct/3d/Circle';
import { Quat } from '../math/Quat';
import { Plane } from '../struct/3d/Plane';
import { Mat4 } from '../math/Mat4';
export declare function clone(array: any | []): any[];
/**
 * 点排序函数
 * @param {Vector*} a
 * @param {Vector*} b
 */
export declare function vectorCompare(a: any | Vec3, b: any | Vec3): number;
/**
 * 将向量拆解为数字
 * @param {Array} points
 * @param {String} feature
 * @returns {Array<Number>} 数字数组
 */
export declare function verctorToNumbers(points: any, feature?: string): any;
/**
 * 计算包围盒
 * @param {*} points  点集
 * @returns {Array[min,max]} 返回最小最大值
 */
export declare function boundingBox(points: Vec3[]): Vec3[];
/**
 *
 * @param {*} points
 * @param {*} Quat
 * @param {Boolean} ref 是否是引用
 */
export declare function applyQuat(points: any | Vec3[], Quat: Quat, ref?: boolean): Vec3 | any;
/**
 * 平移
 * @param {*} points
 * @param {*} distance
 * @param {*} ref
 */
export declare function translate(points: any | Vec3[], distance: Vec3, ref?: boolean): Vec3[] | any;
/**
 * 旋转
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
export declare function rotate(points: any | Vec3[], axis: Vec3, angle: number, ref?: boolean): any;
/**
 * 两个向量之间存在的旋转量来旋转点集
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
export declare function rotateByUnitVectors(points: any | Vec3[], vFrom: Vec3, vTo: Vec3, ref?: boolean): any;
/**
 * 缩放
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
export declare function scale(points: any | Vec3[], _scale: Vec3, ref?: boolean): Vec3[] | any;
/**
 * 响应矩阵
 * @param {*} points
 * @param {*} axis
 * @param {*} angle
 * @param {*} ref
 */
export declare function applyMatrix4(points: any | Vec3[], matrix: Mat4, ref?: boolean): Vec3[] | any;
/**
 * 简化点集数组，折线，路径
 * @param {*} points 点集数组，折线，路径 ,继承Array
 * @param {*} maxDistance  简化最大距离
 * @param {*} maxAngle  简化最大角度
 */
export declare function simplifyPointList(points: any | Vec3[], maxDistance?: number, maxAngle?: number): any;
/**
 * 以某个平面生成对称镜像
 * @param {*} points  点集
 * @param {*} plane 对称镜像平面
 */
export declare function reverseOnPlane(points: any | Vec3[], plane: Plane): void;
/**
 * 投影到平面
 * @param {*} points 点集
 * @param {*} plane  投影平面
 * @param {*} projectDirect  默认是法线的方向
 */
export declare function projectOnPlane(points: any | Vec3[], plane: Plane, projectDirect: Vec3): any;
/**
 * 计算共面点集所在的平面
 * @param {Array<Vec3|Point>} points
 */
export declare function recognitionPlane(points: Vec3[] | any): Plane;
/**
 * 判断所有点是否在同一个平面
 * @param {Array<Vec3|Point>} points
 * @param {*} precision
 * @returns {Boolean|Plane} 如果在同一个平面返回所在平面，否则返回false
 */
export declare function isInOnePlane(points: Vec3[] | any, precision?: number): false | Plane;
/**
 * 判断多边是否共线:
 * 考虑情况点之间的距离应该大于最小容忍值
 * @param  {...Vec3[]} ps
 */
export declare function pointsCollinear(...ps: Vec3[]): boolean;
/**
 * 三点计算圆
 * @param p0
 * @param p1
 * @param p2
 */
export declare function calcCircleFromThreePoint(p0: Vec3, p1: Vec3, p2: Vec3): Circle;
export declare function angle(v0: Vec3, v1: Vec3, normal?: Vec3): number;
