import { Point } from "../struct/3d/Point";
import { gPrecision } from "../math/Math";
import { Vector3 } from "../math/Vector3";

export function XYZSort(p1, p2) {
    return p1.x === p2.x ? (p1.y === p2.y ? p1.y - p2.y : p1.z - p2.z) : p1.x - p2.x;
}

export function maxPoints(ps) {
    var max = new Vector3(-Infinity, -Infinity, -Infinity);
    for (let i = 1; i < ps.length; i++)
    {
        if (ps[i].x > max.x)
            max.x = ps[i].x;
        if (ps[i].y > max.y)
            max.y = ps[i].y;
        if (ps[i].z > max.z)
            max.z = ps[i].z;
    }
    return max;
}

export function minPoints(ps) {
    var min = new Vector3(+Infinity, +Infinity, +Infinity);
    for (let i = 1; i < ps.length; i++)
    {
        if (ps[i].x < min.x)
            min.x = ps[i].x;
        if (ps[i].y < min.y)
            min.y = ps[i].y;
        if (ps[i].z < min.z)
            min.z = ps[i].z;
    }
    return min;
}
/**
 * 判断多边是否共线:
 * 考虑情况点之间的距离应该大于最小容忍值
 * @param  {...Point} ps 
 * @returns {boolean} 
 */
export function pointsCollinear(...ps) {
    ps.sort(XYZSort);
    var sedir = ps[ps.length - 1].clone().sub(ps[0])
    var selen = ps[ps.length - 1].distanceTo(ps[0])
    for (let i = 1; i < ps.length - 1; i++)
    {
        var ilens = ps[i].distanceTo(ps[0]);
        var ilene = ps[i].distanceTo(ps[ps.length - 1]);
        if (ilens < ilene)
        {
            if (Math.abs(ps[i].clone().sub(ps[0]).dot(sedir) - selen * ilens) > gPrecision)
                return false
        } else
        {
            if (Math.abs(ps[i].clone().sub(ps[ps.length - 1]).dot(sedir) - selen * ilene) > gPrecision)
                return false
        }
    }
    return true
}