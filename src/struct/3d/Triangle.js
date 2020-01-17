import { Polyline } from "./Polyline";

class Triangle extends Array {
    constructor(v0, v1, v2) {
        super();
        this.push(v0, v1, v2);
    }

    get p0() {
        return this[0];
    }

    get p1() {
        return this[1];
    }

    get p2() {
        return this[2];
    }

    distancePoint(point) {

    }

    distanceLine(line) {

    }

    distanceRay(ray) {

    }

    distanceSegment(segment) {

    }
}

export { Triangle };