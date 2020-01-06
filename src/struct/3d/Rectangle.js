import { Vector3 } from "../../math/Vector3";

export class Rectangle extends Array {
    constructor(v0, v1, v2, v3) {
        super();
        if (!v3)
            v3 = v1.clone().sub(v0).add(v2.clone().sub(v0)).add(v0);

        this.push(v0, v1, v2, v3)
        var d01 = v1.clone().sub(v0);
        var d03 = v3.clone().sub(v0);
        this.extent = [d01.length() * 0.5, d03.length() * 0.5]
        this.axis = [d01.normalize(), d03.normalize()];
        this.center = v0.clone().add(v2).multiplyScalar(0.5);
    }
}