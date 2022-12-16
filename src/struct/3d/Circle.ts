import { Vec3, v3 } from '../../math/Vec3';
import { angle, pointsCollinear, rotate } from '../../alg/common';
import { Line } from './Line';

export class Circle {
    startAngle: number = 0;
    lengthAngle: number = Math.PI * 2;
    radiusSqr: number = 0;
    /**
     * 圆圈
     * @param  {Vec3} center 中心点
     * @param  {Vec3} normal 法线
     * @param  {Number} radius 半径
     */
    constructor(public center: Vec3 = new Vec3(), public radius: number = 0, startAngle = 0, lengthAngle = Math.PI * 2, public normal: Vec3 = Vec3.UnitY) {
        this.startAngle = startAngle;
        this.lengthAngle = lengthAngle;

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
        this.lengthAngle = angle(fixp0.clone().sub(this.center).normalize(), fixp1.clone().sub(this.center).normalize(), this.normal || normal)
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


    /**
     * 将圆环或者圆弧转化为路径点，生成XY平面上得三维点
     * @param center 中心点
     * @param radius 半径
     * @param startAngle 起始角 右手坐标系 以X正坐标轴为起点 单位弧度
     * @param lengthAngle 弧度长度   单位弧度
     * @param segment 分段
     */
    static toVecs(center: Vec3, radius: number, startAngle: number = 0, lengthAngle: number = Math.PI * 2, segment: number = 16) {
        const Xvec: Vec3 = Vec3.UnitX;
        Xvec.multiplyScalar(radius);

        const result: Vec3[] = []

        const up: Vec3 = Vec3.UnitY;
        const perAngle = lengthAngle / segment;
        for (let i = 0; i <= segment; i++) {
            const langlei = perAngle * i + startAngle;

            const vi = Xvec.clone().applyAxisAngle(up, langlei).add(center);

            result.push(vi);
        }

        return result; 
    }


    /**
     * 在p点延伸a，b两个方向，生成半径为r的圆弧，圆弧所在位置在a,b向量的内夹角
     * @param p 位置
     * @param a a方向
     * @param b b方向
     * @param r 圆弧半径
     */
    static PAdBdtoVecs(p: Vec3, a: Vec3, b: Vec3, r: number, segment: number = 3) {
        let bd = v3().addVecs(a, b).normalize();

        let normal = v3().crossVecs(a, b).normalize();
        a.applyAxisAngle(normal, Math.PI / 2);



        a.normalize();

    }

    static PApBptoVecs(p: Vec3, a: Vec3, b: Vec3, r: number, segment: number = 3) {
        let bd = v3().addVecs(a, b).normalize();

    }

}

export function circle(center?: Vec3, radius?: number) {
    return new Circle(center, radius);
}