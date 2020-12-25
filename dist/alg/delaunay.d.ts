import { Delaunator } from "./delaunator";
import { Voronoi } from './voronoi';
export default class Delaunay {
    _delaunator: Delaunator;
    inedges: Int32Array;
    _hullIndex: Int32Array;
    points: Float64Array;
    collinear?: Int32Array;
    halfedges: any;
    hull: Uint32Array;
    triangles: Uint32Array;
    static from(points: number[]): Delaunay;
    constructor(points: Float64Array);
    update(): this;
    _init(): void;
    voronoi(bounds: [number, number, number, number] | undefined): Voronoi;
    neighbors(i: number): Generator<number, void, unknown>;
    find(x: number, y: number, i?: number): number;
    _step(i: number, x: number, y: number): number;
}
