import { Point } from "../struct/3d/Point";
import { gPrecision } from "../math/Math";
import { Vector3 } from "../math/Vector3";



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