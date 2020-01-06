import { PolyLine } from "./PolyLine";

class Triangle extends Array {
    constructor(v0, v1, v2) {
        super();
        this.push(v0, v1, v2);
    }

    get v0() {
        return this[0];
    }

    get v1() {
        return this[1];
    }

    get v2() {
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