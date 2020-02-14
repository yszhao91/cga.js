import { boundingBox, isInOnePlane } from "./points";
import { v3 } from "../math/Vector3";
import { calcCircleFromThreePoint } from "../struct/3d/Circle";

export class Delaunay {
    constructor(points, options = { planeNormal: null }) {
        //如果planeNormal为null 需要判断是否在一个平面
        if (points.length < 3)
            throw ("points 数量必须大于3")
        this._triangles = [];
        this.isCoPlane = true;//是否共面
        this.originPoints = points;
        var newpoints = clone(points);
        indexable(newpoints);
        var planeNormal = options.planeNormal
        if (!planeNormal) {
            var plane = isInOnePlane(newpoints);
            if (plane)
                planeNormal = plane.normal;
        }
        this.isCoPlane = !!planeNormal;

        if (planeNormal) {
            // 平面上计算 可以看做2D
            if (this.normal.dot(planeNormal) < 0)
                planeNormal.negate();
            rotateByUnitVectors(newpoints, planeNormal, this.normal);
            var superTriangle = this.boundTriangle(newpoints);

            this._triangles.push(superTriangle);

            // 按X轴排序
            newpoints.sort((p0, p1) => {
                if (p0.x === p1.x)
                    return p0.x - p1.x;
                return p0.y - p1.y;
            });

            var nlen = newpoints.length;

            var open = [calcCircleFromThreePoint(newpoints[n], newpoints[n + 1], newpoints[n + 2])];
            var close = [];
            var edges = [];

            for (let i = 0; i < nlen; i++) {
                const np = newpoints[i];
                for (let j = 0; j < open.length; j++) {
                    closed.push(open[j]);
                    open.splice(j, 1);
                    continue;
                }
            }
        }
    }

    /**
     * 计算一个将所有点都包含的大三角形
     * @param {Array<Point>} points 
     */
    boundTriangle(points) {
        var [min, max] = boundingBox(points);
        if (this.isCoPlane) {
            var dx = max.x - min.x;
            var dy = max.y - min.y;
            var dmax = Math.max(dx, dy);
            var xmid = min.x + dx * 0.5;
            var ymid = min.y + dy * 0.5;
            return [
                [v3(xmid - 20 * dmax, ymin - dmax, 0),
                v3(xmid, ymid + 20 * dmax),
                v3(xmid + 20 * dmax, ymid - dmax)]
            ]
        }
    }


}