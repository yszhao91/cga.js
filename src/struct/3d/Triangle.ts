import { Vec3 } from '../../math/Vec3';
export class Triangle extends Array {
    constructor(_p0: Vec3, _p1: Vec3, _p2: Vec3) {
        super();
        Object.setPrototypeOf(this, Triangle.prototype);
        this.push(_p0, _p1, _p2);
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

    //---distance--------------------------------------   
    distanceTriangle(triangle: Triangle) {

    }

    //---intersection-------------------------------------------
    
}