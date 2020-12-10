import { Vec3 } from '../math/Vec3';
export function vectorCompare(a: Vec3, b: Vec3) {
    if (a.x === b.x) {
        if (a.z !== undefined && a.y === b.y)
            return a.z - b.z
        else
            return a.y - b.y;
    }
    else
        return a.x - b.x;
}
