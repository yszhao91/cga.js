import { Vec3 } from '../math/Vec3';
import { Plane } from '../struct/3d/Plane';
import { Vec2 } from '../math/Vec2';
import { Polygon } from '../struct/3d/Polygon';
/**
 * 计算共面点集所在的平面 前提是所有的点都在一个平面上
 * @param {Array<Vec3>} points
 */
export declare function recognitionPlane(points: Vec3[] | any): Plane;
/**
 * 识别多边形顺逆时针  格林求和 投影到XY平面
 * @param points
 */
export declare function recognitionCCW(points: Vec2[] | Vec3[]): boolean;
/**
 * robust 识别出点集或者多边形的法线
 * @param {Polygon|Array<Point|Vector3>} points
 * @returns {Vector3} 法线
 */
export declare function recognitionPolygonNormal(points: Polygon | Vec3[] | any): Vec3;
