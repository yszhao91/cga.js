import { Segment } from '../struct/3d/Segment';
import { Vec3 } from '../math/Vec3';
import { Vec2 } from '../math/Vec2';
/**
 * 集合算法，点集，线段集
 */
/**
 * 线段项链的地方合成起来
 * @param segmentset  线段集合
 */
export declare function compose(segmentset: Segment[] | Vec3[] | Vec2[]): any[];
