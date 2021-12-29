import { Vec } from './vec';
import Decimal from 'decimal.js';
export class Plane {
    normal: Vec = new Vec(new Decimal(0), new Decimal(0), new Decimal(0));
    w: Decimal;
    constructor(point: Vec, normal: Vec) {
        this.normal.copy(normal)
        this.w = point.dot(normal).negated();
    }


}