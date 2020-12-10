import { Vec3, v3 } from '../../math/Vec3';
import { angle, pointsCollinear } from '../../alg/common';
import { Line } from './Line';

export class Circle {
    startAngle: number = 0;
    endAngle: number = Math.PI * 2;
    radiusSqr: number = 0;
    /**
     * 圆圈
     * @param  {Vec3} center 中心点
     * @param  {Vec3} normal 法线
     * @param  {Number} radius 半径
     */
    constructor(public center: Vec3 = new Vec3(), public radius: number = 0, public normal: Vec3 = Vec3.UnitY) {

    }

    area() {
        return Math.PI * this.radius * this.radius;
    }

    /**
     * 两个点
     * @param fixp0 
     * @param fixp1 
     * @param movep 
     * @param normal 
     */
    arc1(fixp0: Vec3, fixp1: Vec3, movep: Vec3, normal?: Vec3) {
        this.setFrom3Points(fixp0, fixp1, movep);
        this.startAngle = 0
        this.endAngle = angle(fixp0.clone().sub(this.center).normalize(), fixp1.clone().sub(this.center).normalize(), this.normal || normal)
    }
    /**
     * 全两个点确定半径，后面点确定 弧度 ,只需要检测鼠标移动时鼠标是否跨过第一条半径即可确定顺逆时针
     * @param fixp0 
     * @param fixp1 
     * @param movep 
     */
    arc2(center: Vec3, fixp1: Vec3, movep: Vec3, ccw: boolean = false, normal?: Vec3) {
        this.radius = fixp1.distanceTo(center);
        this.center.copy(center);
        const v2 = movep.clone().sub(center);
        const v1 = fixp1.clone().sub(center);
        const jd = angle(v1, v2)
    }




    setFrom3Points(p0: Vec3, p1: Vec3, p2: Vec3, normal?: Vec3) {
        // if (pointsCollinear(p0, p1, p2))
        //     throw ("calcCircleFromThreePoint：三点共线或者距离太近");

        const d1 = p1.clone().sub(p0)
        const d2 = p2.clone().sub(p0)
        const d1center = p1.clone().add(p0).multiplyScalar(0.5)
        const d2center = p2.clone().add(p0).multiplyScalar(0.5)
        normal = normal || d1.clone().cross(d2).normalize();
        d1.applyAxisAngle(normal, Math.PI / 2);
        d2.applyAxisAngle(normal, Math.PI / 2);

        const line1 = new Line(d1center, d1center.clone().add(d1));
        const line2 = new Line(d2center, d2center.clone().add(d2));
        const center = line1.distanceLine(line2).closests![0];
        const radiusSqr = p0.distanceToSquared(center)
        this.center = center;
        this.radiusSqr = radiusSqr;
        this.radius = Math.sqrt(radiusSqr);
        this.normal = normal;
        return this;
    }
}

export function circle(center?: Vec3, radius?: number, normal?: Vec3) {
    return new Circle(center, radius, normal);
}