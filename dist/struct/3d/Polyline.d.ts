import { EndType, JoinType } from "../../alg/extrude";
import { Vec3 } from "../../math/Vec3";
import { ArrayEx } from "../data/ArrayEx";
/**
 *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
 */
export declare class Polyline extends ArrayEx {
    normal: Vec3;
    isCoPlanar: boolean;
    isPolyline: boolean;
    constructor(vs?: any[], normal?: Vec3);
    /**
     * 偏移
     * @param {Number} distance  偏移距离
     * @param {Vector3} normal  折线所在平面法线
     */
    offset(distance: number, normal?: Vec3, endtype?: EndType, jointype?: JoinType): Polyline;
    /**
     * 圆角   将折线拐点圆角化
     * @param {Number} useDistance 圆角段距离
     * @param {Number} segments 分切割段数
     */
    corner(useDistance: number, normal?: Vec3): Polyline;
}
