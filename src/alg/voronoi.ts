import Delaunay from './delaunay';
const epsilon = 1e-6;


class Polygon {
    _: any[];
    constructor() {
        this._ = [];
    }
    moveTo(x: any, y: any) {
        this._.push([x, y]);
    }
    closePath() {
        this._.push(this._[0].slice());
    }
    lineTo(x: any, y: any) {
        this._.push([x, y]);
    }
    value() {
        return this._.length ? this._ : null;
    }
}


export class Voronoi {
    delaunay: any;
    _circumcenters: Float64Array;
    vectors: Float64Array;
    xmax: number;
    xmin: number;
    ymax: number;
    ymin: number;
    circumcenters: any;
    constructor(delaunay: Delaunay, [xmin, ymin, xmax, ymax] = [0, 0, 960, 500]) {
        if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
        this.delaunay = delaunay;
        this._circumcenters = new Float64Array(delaunay.points.length);
        this.vectors = new Float64Array(delaunay.points.length);
        this.xmax = xmax, this.xmin = xmin;
        this.ymax = ymax, this.ymin = ymin;
        this._init();
    }
    update() {
        this.delaunay.update();
        this._init();
        return this;
    }
    _init() {
        const { delaunay: { points, hull, triangles }, vectors } = this;

        // Compute circumcenters.
        const circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
        for (let i = 0, j = 0, n = triangles.length, x, y; i < n; i += 3, j += 2) {
            const t1 = triangles[i] * 2;
            const t2 = triangles[i + 1] * 2;
            const t3 = triangles[i + 2] * 2;
            const x1 = points[t1];
            const y1 = points[t1 + 1];
            const x2 = points[t2];
            const y2 = points[t2 + 1];
            const x3 = points[t3];
            const y3 = points[t3 + 1];

            const dx = x2 - x1;
            const dy = y2 - y1;
            const ex = x3 - x1;
            const ey = y3 - y1;
            const bl = dx * dx + dy * dy;
            const cl = ex * ex + ey * ey;
            const ab = (dx * ey - dy * ex) * 2;

            if (!ab) {
                // degenerate case (collinear diagram)
                x = (x1 + x3) / 2 - 1e8 * ey;
                y = (y1 + y3) / 2 + 1e8 * ex;
            }
            else if (Math.abs(ab) < 1e-8) {
                // almost equal points (degenerate triangle)
                x = (x1 + x3) / 2;
                y = (y1 + y3) / 2;
            } else {
                const d = 1 / ab;
                x = x1 + (ey * bl - dy * cl) * d;
                y = y1 + (dx * cl - ex * bl) * d;
            }
            circumcenters[j] = x;
            circumcenters[j + 1] = y;
        }

        // Compute exterior cell rays.
        let h = hull[hull.length - 1];
        let p0, p1 = h * 4;
        let x0, x1 = points[2 * h];
        let y0, y1 = points[2 * h + 1];
        vectors.fill(0);
        for (let i = 0; i < hull.length; ++i) {
            h = hull[i];
            p0 = p1, x0 = x1, y0 = y1;
            p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
            vectors[p0 + 2] = vectors[p1] = y0 - y1;
            vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
        }
    }

    *cellPolygons() {
        const { delaunay: { points } } = this;
        for (let i = 0, n = points.length / 2; i < n; ++i) {
            const cell: any = this.cellPolygon(i);
            if (cell) cell.index = i, yield cell;
        }
    }
    cellPolygon(i: number) {
        const polygon = new Polygon;
        return polygon.value();
    }
    _renderSegment(x0: any, y0: any, x1: any, y1: any, context: { moveTo: (arg0: any, arg1: any) => void; lineTo: (arg0: any, arg1: any) => void; }) {
        let S;
        const c0 = this._regioncode(x0, y0);
        const c1 = this._regioncode(x1, y1);
        if (c0 === 0 && c1 === 0) {
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
        } else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
            context.moveTo(S[0], S[1]);
            context.lineTo(S[2], S[3]);
        }
    }
    contains(i: any, x: number | any, y: number | any) {
        if ((x = +x, x !== x) || (y = +y, y !== y)) return false;
        return this.delaunay._step(i, x, y) === i;
    }
    *neighbors(i: any) {
        const ci = this._clip(i);
        if (ci) for (const j of this.delaunay.neighbors(i)) {
            const cj = this._clip(j);
            // find the common edge
            if (cj) loop: for (let ai = 0, li = ci.length; ai < li; ai += 2) {
                for (let aj = 0, lj = cj.length; aj < lj; aj += 2) {
                    if (ci[ai] == cj[aj]
                        && ci[ai + 1] == cj[aj + 1]
                        && ci[(ai + 2) % li] == cj[(aj + lj - 2) % lj]
                        && ci[(ai + 3) % li] == cj[(aj + lj - 1) % lj]
                    ) {
                        yield j;
                        break loop;
                    }
                }
            }
        }
    }
    _cell(i: string | number) {
        const { circumcenters, delaunay: { inedges, halfedges, triangles } } = this;
        const e0 = inedges[i];
        if (e0 === -1) return null; // coincident point
        const points = [];
        let e = e0;
        do {
            const t = Math.floor(e / 3);
            points.push(circumcenters[t * 2], circumcenters[t * 2 + 1]);
            e = e % 3 === 2 ? e - 2 : e + 1;
            if (triangles[e] !== i) break; // bad triangulation
            e = halfedges[e];
        } while (e !== e0 && e !== -1);
        return points;
    }
    _clip(i: number) {
        // degenerate case (1 valid point: return the box)
        if (i === 0 && this.delaunay.hull.length === 1) {
            return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
        }
        const points = this._cell(i);
        if (points === null) return null;
        const { vectors: V } = this;
        const v = i * 4;
        return V[v] || V[v + 1]
            ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3])
            : this._clipFinite(i, points);
    }
    _clipFinite(i: any, points: string | any[]) {
        const n = points.length;
        let P: any = null;
        let x0, y0, x1 = points[n - 2], y1 = points[n - 1];
        let c0, c1 = this._regioncode(x1, y1);
        let e0, e1;
        for (let j = 0; j < n; j += 2) {
            x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
            c0 = c1, c1 = this._regioncode(x1, y1);
            if (c0 === 0 && c1 === 0) {
                e0 = e1, e1 = 0;
                if (P) P.push(x1, y1);
                else P = [x1, y1];
            } else {
                let S, sx0, sy0, sx1, sy1;
                if (c0 === 0) {
                    if ((S = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
                    [sx0, sy0, sx1, sy1] = S;
                } else {
                    if ((S = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
                    [sx1, sy1, sx0, sy0] = S;
                    e0 = e1, e1 = this._edgecode(sx0, sy0);
                    if (e0 && e1) this._edge(i, e0, e1, P, P.length);
                    if (P) P.push(sx0, sy0);
                    else P = [sx0, sy0];
                }
                e0 = e1, e1 = this._edgecode(sx1, sy1);
                if (e0 && e1) this._edge(i, e0, e1, P, P.length);
                if (P) P.push(sx1, sy1);
                else P = [sx1, sy1];
            }
        }
        if (P) {
            e0 = e1, e1 = this._edgecode(P[0], P[1]);
            if (e0 && e1) this._edge(i, e0, e1, P, P.length);
        } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
            return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
        }
        return P;
    }
    _clipSegment(x0: number, y0: number, x1: number, y1: number, c0: number, c1: number) {//线段的切割
        while (true) {
            if (c0 === 0 && c1 === 0) return [x0, y0, x1, y1];
            if (c0 & c1) return null;
            let x, y, c = c0 || c1;
            if (c & 0b1000) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;
            else if (c & 0b0100) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;
            else if (c & 0b0010) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
            else y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
            if (c0) x0 = x, y0 = y, c0 = this._regioncode(x0, y0);
            else x1 = x, y1 = y, c1 = this._regioncode(x1, y1);
        }
    }
    _clipInfinite(i: any, points: any, vx0: number, vy0: number, vxn: number, vyn: number) {
        let P = Array.from(points), p;
        if (p = this._project(P[0], P[1], vx0, vy0)) P.unshift(p[0], p[1]);
        if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) P.push(p[0], p[1]);
        if (P = this._clipFinite(i, P)) {
            for (let j = 0, n = P.length, c0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2) {
                c0 = c1, c1 = this._edgecode(P[j], P[j + 1]);
                if (c0 && c1) j = this._edge(i, c0, c1, P, j), n = P.length;
            }
        } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
            P = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
        }
        return P;
    }
    _edge(i: any, e0: number, e1: number, P: any[], j: number) {
        while (e0 !== e1) {
            let x, y;
            switch (e0) {
                case 0b0101: e0 = 0b0100; continue; // top-left
                case 0b0100: e0 = 0b0110, x = this.xmax, y = this.ymin; break; // top
                case 0b0110: e0 = 0b0010; continue; // top-right
                case 0b0010: e0 = 0b1010, x = this.xmax, y = this.ymax; break; // right
                case 0b1010: e0 = 0b1000; continue; // bottom-right
                case 0b1000: e0 = 0b1001, x = this.xmin, y = this.ymax; break; // bottom
                case 0b1001: e0 = 0b0001; continue; // bottom-left
                case 0b0001: e0 = 0b0101, x = this.xmin, y = this.ymin; break; // left
            }
            if ((P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y)) {
                P.splice(j, 0, x, y), j += 2;
            }
        }
        if (P.length > 4) {
            for (let i = 0; i < P.length; i += 2) {
                const j = (i + 2) % P.length, k = (i + 4) % P.length;
                if (P[i] === P[j] && P[j] === P[k]
                    || P[i + 1] === P[j + 1] && P[j + 1] === P[k + 1])
                    P.splice(j, 2), i -= 2;
            }
        }
        return j;
    }
    _project(x0: any, y0: any, vx: number, vy: number) {
        let t = Infinity, c, x, y;
        if (vy < 0) { // top
            if (y0 <= this.ymin) return null;
            if ((c = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c) * vx;
        } else if (vy > 0) { // bottom
            if (y0 >= this.ymax) return null;
            if ((c = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c) * vx;
        }
        if (vx > 0) { // right
            if (x0 >= this.xmax) return null;
            if ((c = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c) * vy;
        } else if (vx < 0) { // left
            if (x0 <= this.xmin) return null;
            if ((c = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c) * vy;
        }
        return [x, y];
    }
    _edgecode(x: unknown, y: unknown) {
        return (x === this.xmin ? 0b0001
            : x === this.xmax ? 0b0010 : 0b0000)
            | (y === this.ymin ? 0b0100
                : y === this.ymax ? 0b1000 : 0b0000);
    }
    _regioncode(x: number, y: number) {
        return (x < this.xmin ? 0b0001
            : x > this.xmax ? 0b0010 : 0b0000)
            | (y < this.ymin ? 0b0100
                : y > this.ymax ? 0b1000 : 0b0000);
    }
}
