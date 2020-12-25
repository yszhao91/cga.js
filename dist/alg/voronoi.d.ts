import Delaunay from './delaunay';
export declare class Voronoi {
    delaunay: any;
    _circumcenters: Float64Array;
    vectors: Float64Array;
    xmax: number;
    xmin: number;
    ymax: number;
    ymin: number;
    circumcenters: any;
    constructor(delaunay: Delaunay, [xmin, ymin, xmax, ymax]?: [number, number, number, number]);
    update(): this;
    _init(): void;
    cellPolygons(): Generator<any, void, unknown>;
    cellPolygon(i: number): any[] | null;
    _renderSegment(x0: any, y0: any, x1: any, y1: any, context: {
        moveTo: (arg0: any, arg1: any) => void;
        lineTo: (arg0: any, arg1: any) => void;
    }): void;
    contains(i: any, x: number | any, y: number | any): boolean;
    neighbors(i: any): Generator<any, void, unknown>;
    _cell(i: string | number): any[] | null;
    _clip(i: number): any;
    _clipFinite(i: any, points: string | any[]): any;
    _clipSegment(x0: number, y0: number, x1: number, y1: number, c0: number, c1: number): number[] | null;
    _clipInfinite(i: any, points: any, vx0: number, vy0: number, vxn: number, vyn: number): unknown[];
    _edge(i: any, e0: number, e1: number, P: any[], j: number): number;
    _project(x0: any, y0: any, vx: number, vy: number): any[] | null;
    _edgecode(x: unknown, y: unknown): number;
    _regioncode(x: number, y: number): number;
}
