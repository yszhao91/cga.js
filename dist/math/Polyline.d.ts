import { ArrayEx } from '../struct/data/ArrayEx';
import { Vec3 } from './Vec3';
/**
 *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
 */
export declare class Polyline extends ArrayEx {
    isCoPlanar: boolean;
    normal: Vec3;
    constructor(vs?: any, normal?: Vec3);
    /**
     * 偏移
     * @param {Number} distance  偏移距离
     * @param {Vector3} normal  折线所在平面法线
     */
    offset(distance: number, normal?: Vec3): Polyline;
    /**
     * 圆角   将折线拐点圆角化
     * @param {Number} useDistance 圆角段距离
     * @param {Number} segments 分切割段数
     */
    corner(useDistance: number, segments?: number, normal?: Vec3, threshold?: number): Polyline;
}
