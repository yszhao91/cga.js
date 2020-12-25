import { Vec3 } from '../../math/Vec3';
export declare class Circle {
    center: Vec3;
    radius: number;
    normal: Vec3;
    startAngle: number;
    endAngle: number;
    radiusSqr: number;
    /**
     * 圆圈
     * @param  {Vec3} center 中心点
     * @param  {Vec3} normal 法线
     * @param  {Number} radius 半径
     */
    constructor(center?: Vec3, radius?: number, normal?: Vec3);
    area(): number;
    /**
     * 两个点
     * @param fixp0
     * @param fixp1
     * @param movep
     * @param normal
     */
    arc1(fixp0: Vec3, fixp1: Vec3, movep: Vec3, normal?: Vec3): void;
    /**
     * 全两个点确定半径，后面点确定 弧度 ,只需要检测鼠标移动时鼠标是否跨过第一条半径即可确定顺逆时针
     * @param fixp0
     * @param fixp1
     * @param movep
     */
    arc2(center: Vec3, fixp1: Vec3, movep: Vec3, ccw?: boolean, normal?: Vec3): void;
    setFrom3Points(p0: Vec3, p1: Vec3, p2: Vec3, normal?: Vec3): this;
}
export declare function circle(center?: Vec3, radius?: number, normal?: Vec3): Circle;
