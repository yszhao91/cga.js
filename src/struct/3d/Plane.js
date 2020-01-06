import { sign, approximateEqual } from "../../math/Math";

class Plane {
    constructor(normal, w) {
        this.normal = normal;
        this.w = w;
        this.origin = this.normal.clone().multiplyScalar(w)
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
        return this.normal.dot(point) + this.w;
    }

    distanceRay(ray) {

    }

    distanceLine(line) {

    }

    distanceSegment(segment) {

    }

    distancePlane(plane) {

    }


}

export { Plane }