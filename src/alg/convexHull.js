import { vectorCompare, isInOnePlane, rotateByUnitVectors } from "./points";
// import { Vector3 } from "../math/Vector3";
import { Vector2 } from "../math/Vector2";
import { unique, clone } from "../utils/array";
import { v3, Vector3 } from "../math/Vector3";
import { indexable } from "./mesh"
import { Line } from "../struct/3d/Line";
import { Orientation } from "../struct/3d/type";
import { gPrecision } from "../math/Math";

export class ConvexHull {
    /**
     * 
     * @param {Array<Points>} points  点集
     * @param {} options  {planeNormal,method}
     */
    constructor(points, options = { planeNormal: null, method: 'quick' }) {
        if (points.length < 3) {
            throw Error('cannot build a simplex out of <3 points')
        }
        this._hull = [];
        this.originPoints = points;
        var newpoints = clone(points);
        indexable(newpoints);
        var planeNormal = options.planeNormal
        if (!planeNormal) {
            var plane = isInOnePlane(newpoints);
            if (plane)
                planeNormal = plane.normal;
        }
        this.normal = Vector3.UnitZ;
        if (planeNormal) {
            //在一个平面  2D ConvexHull 
            if (this.normal.dot(planeNormal) < 0)
                planeNormal.negate();
            rotateByUnitVectors(newpoints, planeNormal, this.normal);
            newpoints.forEach(pt => pt.z = 0)
            //找出一段在某个轴距离最远点
            var [minPt, maxPt] = this.getMinMax(newpoints);
            var line0 = new Line(minPt, maxPt);
            var line1 = new Line(maxPt, minPt);

            this.addBoundSeg(line0, newpoints);
            this.addBoundSeg(line1, newpoints);
        } else {
            //3D Hull
            // 先找出一个平面最大Convex

        }
    }

    getMinMax(points) {
        var maxXp = points[0];
        var minXp = points[0];
        for (let i = 1; i < points.length; i++) {
            var point = points[i];
            if (maxXp.x < point.x)
                maxXp = point;
            else if (minXp.x > point.x)
                minXp = point;
        }
        return [minXp, maxXp];
    }

    outerPoints(line, points) {
        var outerPoint = []
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            if (line.orientationPoint(point, this.normal) === Orientation.Positive)
                outerPoint.push(point);
        }
        return outerPoint;
    }
    distalPoints(line, points) {
        var distalPoint = null;
        var maxDistance = -Infinity;
        for (let i = 0; i < points.length; i++) {
            const point = points[i];
            var distance = line.distancePoint(point).distance;
            if (distance > maxDistance) {
                distalPoint = point;
                maxDistance = distance;
            }
        }
        return distalPoint;
    }

    addBoundSeg(line, points) {
        var subPoints = this.outerPoints(line, points);
        if (subPoints.length === 0)
            return this._hull.push(line.origin);
        var distalPt = this.distalPoints(line, subPoints)
        this.addBoundSeg(new Line(line.origin, distalPt), subPoints);
        this.addBoundSeg(new Line(distalPt, line.end), subPoints);
    }

    get hull() {
        if (!this.__hull) {
            this.__hull = [];
            debugger
            for (let i = 0; i < this._hull.length; i++) {
                const point = this._hull[i];
                this.__hull.push(this.originPoints[point.index]);
            }
        }
        return this.__hull;
    }
}

export function quickHull(points) {
    var ch = new ConvexHull(points);

    return ch.hull;
}