import { DistanceResult } from '../../alg/result';
import { Vec3 } from '../../math/Vec3';
import { Segment } from './Segment';
import { Polyline } from "./Polyline";

export class Polygon<T> extends Polyline<T> {
    isPolygon: boolean = true;
    constructor(vs?: any[]) {
        super(vs);
    }

    offset(distance: number, normal: Vec3 = Vec3.UnitY): Polygon<T> {

        const segments = [];
        for (let i = 0; i < this.length; i++) {
            const point = this.get(i);
            const pointNext = this.get((i + 1) % this.length);
            const segment = new Segment(point, pointNext)
            segments.push(segment)
            segment.offset(distance, normal);
        }

        for (let i = 0; i < this.length; i++) {
            const seg = segments[i];
            const segNext = segments[(i + 1)];
            const result: DistanceResult = (seg as any).distanceLine(segNext as any);
            seg.p1 = result.closests![0]
            segNext.p0 = result.closests![1];
        }

        for (let i = 0; i < this.length; i++) {
            const seg = segments[i];

        }

        return new Polygon() as any;
    }

    containPoint(point: Vec3) {

    }


}
