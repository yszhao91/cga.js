import { Vec3 } from '../math/Vec3';
import { Circle } from '../struct/3d/Circle';
export declare class DelaunaySlow {
    private vs?;
    constructor(vs?: Vec3[] | undefined);
    supertriangle(vertices: Vec3[]): Vec3[];
    triangulation(vs: Vec3[]): number[];
    /**
     * 外接圆
     * @param vertices 点击
     * @param i
     * @param j
     * @param k
     */
    circumcircle(vertices: Vec3[], i: number, j: number, k: number): Circle;
    dedup(edges: any[]): void;
    contains(tri: Vec3[], p: Vec3): number[] | null;
}
