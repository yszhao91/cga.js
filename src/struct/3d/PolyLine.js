/**
 *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
 */
export class Polyline extends Array {
    constructor(vs) {
        super();
        this.push(...vs);
    }

    offset(distance) {
        return new Polyline(this);
    }
}