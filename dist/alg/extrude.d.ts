import { Vec3 } from '../math/Vec3';
import { Point } from '../struct/3d/Point';
import { Vec2 } from '../math/Vec2';
import { Polygon } from '../struct/3d/Polygon';
import { Polyline } from '../struct/3d/Polyline';
import { Path } from '../struct/3d/Path';
/**
 *  常用shape几何操作
 */
/**
 * 缝合两个边
 * @param {Array} side0
 * @param {Array} side1
 * @param {Boolean} isClosed
 * @returns {Array<Vec3>} 三角形数组，每三个为一个三角形
 */
export declare function linkSide(side0: Vec3[] | any, side1: Vec3[] | any, isClosed?: boolean): any[];
/**
 * 缝合shape集合
 * @param {Array<Array<Point|Vec3>} shapes  路基 点集的集合， 每个shape的点数量一致
 * @param {Boolean} isClosed 每一个shape是否是封闭的圈 默认false
 * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
 */
export declare function linkSides(shapes: Array<Array<Vec3 | Point>>, isClosed?: boolean, isClosed2?: boolean): any[];
/**
 * 缝合集合
 * @param sides 圈
 * @param closed1 圈自身是否缝合
 * @param closed2 圈拉伸后首尾是否缝合
 */
export declare function links(sides: Array<Polygon | Polyline | Array<Vec3 | Point>>, closed1?: boolean, closed2?: boolean): any[];
export interface IExtrudeOptions {
    fixedY?: boolean;
    isClosed?: boolean;
    isClosed2?: boolean;
    textureEnable?: boolean;
    textureScale?: Vec2;
    smoothAngle?: number;
    sealStart?: boolean;
    sealEnd?: boolean;
    normal?: Vec3;
}
/**
 * 挤压
 * @param {Polygon|Array<Point|Vec3> }  shape   多边形或顶点数组
 * @param {Path|Array<Point|Vec3> } path  路径或者或顶点数组
 * @param {Object} options {
 *      isClosed: false,闭合为多边形 界面
 *      isClosed2: false, 闭合为圈
 *      textureEnable: true, 计算纹理坐标
 *      textureScale: new Vec2(1, 1),纹理坐标缩放
 *      smoothAngle: Math.PI / 180 * 30,大于这个角度则不平滑
 *      sealStart: true, 是否密封开始面
 *      sealEnd: true,是否密封结束面}
 */
export declare function extrude(shape: Polygon | Polyline | Array<Vec3>, arg_path: Array<Vec3> | any, options?: IExtrudeOptions): {
    vertices: any[];
    triangles: any[];
    uvs: any[];
};
export interface IExtrudeNextOptions {
    sectionClosed?: boolean;
    pathClosed?: boolean;
    textureEnable?: boolean;
    textureScale?: Vec2;
    smoothAngle?: number;
    sealStart?: boolean;
    sealEnd?: boolean;
    normal?: Vec3;
    center?: Vec3;
    smooth?: boolean;
    vecdim?: number;
}
/**
 * 是否逆时针
 * counterclockwise
 */
export declare function isCCW(shape: Polygon | Polyline | Array<Vec3>): boolean;
export declare enum JoinType {
    Bevel = 0,
    Round = 1,
    Miter = 2
}
export declare enum EndType {
    Square = 0,
    Round = 1,
    Butt = 2
}
/**
 *
 * @param shape
 * @param followPath
 * @param options
 */
export declare function extrudeNext(shape: Polygon | Polyline | Array<Vec3> | Array<number>, followPath: Array<Vec3> | Path, options?: IExtrudeNextOptions): void;
