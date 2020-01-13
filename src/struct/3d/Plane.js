import { sign, approximateEqual, gPrecision } from "../../math/Math";
import { Orientation } from "../3d/type"
class Plane {
    constructor(normal, w) {
        this.normal = normal;
        this.w = w;
        this.origin = this.normal.clone().multiplyScalar(w)
        // this.w = this.normal.dot(this.origin)
    }

    /**
     * 判断一个点在平面的正面或者反面
     * @param  {Vector3} point
     * @returns {Number} -1 or 1 or z
     */
    frontback(point) {
        let value = this.normal.dot(point);
        if (approximateEqual(value, 0))
            return 0;
        return sign(this.normal.dot(point));
    }

    distancePoint(point) {
        return this.normal.dot(point) - this.w;
    }

    distanceRay(ray) {

    }

    distanceLine(line) {

    }

    distanceSegment(segment) {

    }

    distancePlane(plane) {

    }

    //---Split-----------------------------------------
    /**
     * 切割线段
     * @param {Segment} segment 
     */
    splitSegment(segment) {
        const result = { splits: [], orientation: false };
        let orientation0 = this.orientationPoint(segment.p0);
        let orientation1 = this.orientationPoint(segment.p1);

        let orientation = orientation0 | orientation1;
        result.orientation = orientation;
        switch (orientation)
        {
            case Orientation.Negative:
                result.splits.push(null, segment.clone());
                break;
            case Orientation.Positive:
                result.splits.push(segment.clone(), null);
                break;
            case Orientation.Intersect:
                this.distanceSegment()
                break;
            default:
                break;
        }

        return result;
    }

    splitTriangle(triangle) {
        const result = { splits: [], orientation: false };
        let orientation0 = this.orientationPoint(segment.p0);
        let orientation1 = this.orientationPoint(segment.p1);

        let orientation = orientation0 | orientation1;
        result.orientation = orientation;
        switch (orientation)
        {
            case Orientation.Negative:
                result.splits.push(null, segment.clone());
                break;
            case Orientation.Positive:
                result.splits.push(segment.clone(), null);
                break;
            case Orientation.Intersect:
                this.distanceSegment()
                break;
            default:
                break;
        }

        return result;
    }

    //---orientation------------------------------
    /**
     * 点在平面的位置判断
     * @param {Point} point 
     * @returns {Orientation} 方位
     */
    orientationPoint(point) {
        let signDistance = this.normal.clone().dot(point) - this.w;
        if (Math.abs(signDistance) < gPrecision)
            return Orientation.Intersect;
        else if (signDistance < 0)
            return Orientation.Negative;
        else if (signDistance > 0)
            return Orientation.Positive;
    }


}

export { Plane }