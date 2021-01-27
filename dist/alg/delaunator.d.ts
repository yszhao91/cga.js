import { Vec2 } from '../math/Vec2';
import { Vec3 } from '../math/Vec3';
export declare class Delaunator {
    coords: Float64Array;
    _triangles: Uint32Array;
    _halfedges: Int32Array;
    _hashSize: number;
    _hullPrev: Uint32Array;
    _hullNext: Uint32Array;
    _hullTri: Uint32Array;
    _hullHash: Int32Array;
    _ids: Uint32Array;
    _dists: Float64Array;
    hull: Uint32Array;
    triangles: Uint32Array;
    halfedges: any;
    _cx: any;
    _cy: any;
    _hullStart: number;
    trianglesLen: number;
    static from(points: number[]): Delaunator;
    static fromVecs(points: Vec2[] | Vec3[]): Delaunator;
    constructor(coords: Float64Array);
    update(): void;
    _hashKey(x: number, y: number): number;
    _legalize(a: number): number;
    _link(a: number, b: number): void;
    _addTriangle(i0: number, i1: number, i2: number, a: number, b: number, c: number): number;
}
