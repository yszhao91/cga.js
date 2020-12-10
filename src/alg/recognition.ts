import { Vec3 } from '../math/Vec3';
import { Point } from '../struct/3d/Point';
import { Line } from '../struct/3d/Line';
import { vectorCompare } from './sort';
import { Plane } from '../struct/3d/Plane';
import { clone } from '../utils/array';
import { Vec2 } from '../math/Vec2';

/**
 * 识别平面
 * @param points 点集
 */
export function recognitionPlane(points: Vec3[] | Point[] | any) {
    points.sort(vectorCompare);
    var line = new Line(points[0].clone(), points[Math.floor(points.length / 2 + 0.5)].clone());
    var maxDistance = -Infinity;
    var ipos = -1;
    for (let i = 1; i < points.length - 1; i++) {
        const pt: Vec3 | Point = points[i];
        var distance: number = pt.distanceLine(line).distance!;
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
 * 识别多边形顺逆时针  格林求和 投影到XY平面
 * @param points 
 */
export function recognitionCCW(points: Vec2[] | Vec3[]) {
    let d = 0;
    for (var i = 0; i < points.length - 1; i++) {
        var p = points[i]
        var p1 = points[i + 1]
        d += -0.5 * (p1.y + p.y) * (p1.x + p.x);
    }
    return d > 0;
}