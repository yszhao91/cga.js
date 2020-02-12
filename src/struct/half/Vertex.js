import { Point } from "../3d/Point"
export class Vertex extends Point {
    constructor(x, y, z, index) {
        super(x, y, z);
        this.index = index;

    }
}