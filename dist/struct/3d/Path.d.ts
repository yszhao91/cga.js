import { Vec3 } from '../../math/Vec3';
import { Point } from './Point';
import { Polyline } from './Polyline';
export interface IDistanceResut {
    isNode: boolean;
    point: Vec3;
}
export declare class Path extends Polyline {
    _closed: boolean;
    constructor(vs: any[]);
    set closed(val: boolean);
    get closed(): boolean;
    init(): void;
    get tlen(): number;
    /**
     * 截取一段从from到to的path
     * @param {Number} from
     * @param {Number} to
     */
    splitByFromToDistance(from?: number, to?: number): Path | null;
    /**
     * 从起点出发到距离等于distance位置  的坐标 二分查找
     * @param {Number} distance
     */
    getPointByDistance(arg_distance: number, left?: number, right?: number): IDistanceResut | null;
    /**
     * 从起点出发到距离等于distance位置  的坐标 二分查找
     * @param {Number} distance
     */
    getPointByDistancePure(arg_distance: number, left?: number, right?: number): Vec3 | null;
    /**
     * 平均切割为 splitCount 段
     * @param {Number} splitCount
     * @returns {Path} 新的path
     */
    splitAverage(splitCount: number): Path;
    /**
     * 通过测试
    * 平均切割为 splitCount 段
    * @param {Number} splitCount
    * @param {Boolean} integer 是否取整
    * @returns {Path} 新的path
    */
    splitAverageLength(splitLength: number, integer?: boolean): Path;
    /**
     *
     * @param  {...any} ps
     */
    add(...ps: Vec3[] | Point[]): void;
}
