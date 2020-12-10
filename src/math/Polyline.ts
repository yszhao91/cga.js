import { ArrayEx } from '../struct/data/ArrayEx';
import { Vec3, v3 } from './Vec3';
import { sign, gPrecision } from './Math';
import { Orientation } from '../struct/data/type';

/**
 *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
 */
export class Polyline extends ArrayEx {
    isCoPlanar: boolean;
    normal: Vec3;
    constructor(vs?: any, normal: Vec3 = Vec3.UnitY) {
        super(...vs);
        this.isCoPlanar = true;
        this.normal = normal;

    }

    /**
     * 偏移
     * @param {Number} distance  偏移距离  
     * @param {Vector3} normal  折线所在平面法线
     */
    offset(distance: number, normal: Vec3 = this.normal) {
        var offsetSign = sign(distance) > 0 ? Orientation.Positive : Orientation.Negative;
        var direction = v3();
        var segments: any = [];//偏移过后的线段
        for (let i = 0; i < this.length - 1; i++) {
            const point = this[i];
            const pointNext = this[i + 1];
            var binormal = direction.sub(pointNext, point).normalize().cross(this.normal).normalize();
            var offsetVector = binormal.clone().multiplyScalar(distance);
            segments.push([offsetVector.clone().add(point), offsetVector.add(pointNext)])
        }


        //线段两两相交
        for (let i = 0; i < segments.length; i++) {
            const segi: any = segments[i];
            for (let j = 0; j < segments.length; j++) {
                if (i === j)
                    continue;
                const segj = segments[j];
                var orien0 = segi.orientationSegment(segj.p0, normal)
                var orien1 = segi.orientationSegment(segj.fixedPoint1, normal)

                var orienInfo = orien0 | orien1;
                var disRes = segi.distanceSegment(segj);
                if (disRes.distance > gPrecision) {
                    if (orienInfo !== offsetSign) {
                        segments.splice(j, 1);
                        j--;
                    }
                } else {
                    // 出现相交  那么就会有切割
                    var intersectPoit = disRes.closests[0];
                    //删除不要的部分

                }



            }
        }

        return new Polyline(this);

    }

    /**
     * 圆角   将折线拐点圆角化
     * @param {Number} useDistance 圆角段距离 
     * @param {Number} segments 分切割段数
     */
    corner(useDistance: number, segments = 3, normal = this.normal, threshold = 0.1) {
        var polyline = new Polyline();
        for (let i = 0; i < this.length - 2; i++) {
            // polyline.push(p0);
            // const p0 = this[i];
            // const p1 = this[i + 1];
            // const p2 = this[i + 2];
            // var fixedPoint0 = p0.distanceTo(p1).length() <= useDistance * 2 ? p0.clone().add(p1).multiplyScalar(0.5) : p0.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
            // var fixedPoint1 = p2.distanceTo(p1).length() <= useDistance * 2 ? p2.clone().add(p1).multiplyScalar(0.5) : p2.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
            // polyline.push(fixedPoint0);
            // var binormal0 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2);
            // var binormal1 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2);
            // //计算圆弧点
            // var line0 = new Line(fixedPoint0, binormal0.add(fixedPoint0));
            // var line1 = new Line(fixedPoint1, binormal1.add(fixedPoint1));
            // var center = line0.distanceLine(line1).closests[0];//圆心


            // polyline.push(fixedPoint1);

        }
        return polyline;
    }


}