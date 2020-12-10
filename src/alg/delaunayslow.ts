import { Vec3 } from '../math/Vec3';
import { Circle } from '../struct/3d/Circle';
/**
 * 只考虑2d的散点，如果是3d的以后会新建一个Delaunay3
 */

const EPSILON = 1.0 / 1048576.0;
export class DelaunaySlow {
    constructor(private vs?: Vec3[]) {



    }

    supertriangle(vertices: Vec3[]) {
        var xmin = +Infinity,
            ymin = +Infinity,
            xmax = -Infinity,
            ymax = -Infinity,
            i, dx, dy, dmax, xmid, ymid;

        for (i = vertices.length; i--;) {
            if (vertices[i].x < xmin) xmin = vertices[i].x;
            if (vertices[i].x > xmax) xmax = vertices[i].x;
            if (vertices[i].y < ymin) ymin = vertices[i].y;
            if (vertices[i].y > ymax) ymax = vertices[i].y;
        }

        dx = xmax - xmin;
        dy = ymax - ymin;
        dmax = Math.max(dx, dy);
        xmid = xmin + dx * 0.5;
        ymid = ymin + dy * 0.5;

        return [
            new Vec3(xmid - 20 * dmax, ymid - dmax),
            new Vec3(xmid, ymid + 20 * dmax),
            new Vec3(xmid + 20 * dmax, ymid - dmax)
        ];
    }


    triangulation(vs: Vec3[]): number[] {
        var vslen = vs.length;

        if (vslen < 3)
            return [];

        var indices = new Array(vslen);

        for (var i = vslen; i--;)
            indices[i] = i;

        indices.sort(function (i, j) {
            var diff = vs[j].x - vs[i].x;
            return diff !== 0 ? diff : i - j;
        });

        const superTriangle = this.supertriangle(vs);

        vs.push(...superTriangle);//新加大三角形点

        var open = [this.circumcircle(vs, vslen + 0, vslen + 1, vslen + 2)];
        var closed = [];

        for (let i = indices.length; i--;) {
            var edges = [];
            var c = indices[i];
            var point = vs[c]

            for (let j = open.length; j--;) {
                var openj: any = open[j];
                var dx = point.x - open[j].center.x;

                if (dx > 0.0 && dx * dx > open[j].radiusSqr) {
                    closed.push(open[j]);
                    open.splice(j, 1);
                    continue;
                }

                /* If we're outside the circumcircle, skip this triangle. */
                var dy = vs[c].y - open[j].center.y;
                if (dx * dx + dy * dy - open[j].radiusSqr > EPSILON)
                    continue;

                /* Remove the triangle and add it's edges to the edge list. */
                edges.push(
                    openj.i, openj.j,
                    openj.j, openj.k,
                    openj.k, openj.i
                );
                open.splice(j, 1);
            }

            this.dedup(edges);
            for (let j = edges.length; j;) {
                var b = edges[--j];
                var a = edges[--j];
                open.push(this.circumcircle(vs, a, b, c));
            }

        }
        for (i = open.length; i--;)
            closed.push(open[i]);
        open.length = 0;

        var result = []
        for (i = closed.length; i--;) {
            var close: any = closed[i]
            if (close.i < vslen && close.j < vslen && close.k < vslen)
                result.push(close.i, close.j, close.k);
        }

        /* Yay, we're done! */
        return result;
    }


    /**
     * 外接圆
     * @param vertices 点击
     * @param i 
     * @param j 
     * @param k 
     */
    circumcircle(vertices: Vec3[], i: number, j: number, k: number) {
        var circle = new Circle().setFrom3Points(vertices[i], vertices[j], vertices[k]);
        (circle as any).i = i;
        (circle as any).j = j;
        (circle as any).k = k;
        return circle;
    }

    dedup(edges: any[]) {
        var i, j, a, b, m, n;

        for (j = edges.length; j;) {
            b = edges[--j];
            a = edges[--j];

            for (i = j; i;) {
                n = edges[--i];
                m = edges[--i];

                if ((a === m && b === n) || (a === n && b === m)) {
                    edges.splice(j, 2);
                    edges.splice(i, 2);
                    break;
                }
            }
        }
    }


    contains(tri: Vec3[], p: Vec3) {
        /* Bounding box test first, for quick rejections. */
        if ((p.x < tri[0].x && p.x < tri[1].x && p.x < tri[2].x) ||
            (p.x > tri[0].x && p.x > tri[1].x && p.x > tri[2].x) ||
            (p.y < tri[0].y && p.y < tri[1].y && p.y < tri[2].y) ||
            (p.y > tri[0].y && p.y > tri[1].y && p.y > tri[2].y))
            return null;

        var a = tri[1].x - tri[0].x,
            b = tri[2].x - tri[0].x,
            c = tri[1].y - tri[0].y,
            d = tri[2].y - tri[0].y,
            i = a * d - b * c;

        /* Degenerate tri. */
        if (i === 0.0)
            return null;

        var u = (d * (p.x - tri[0].x) - b * (p.y - tri[0].y)) / i,
            v = (a * (p.y - tri[0].y) - c * (p.x - tri[0].x)) / i;

        /* If we're outside the tri, fail. */
        if (u < 0.0 || v < 0.0 || (u + v) > 1.0)
            return null;

        return [u, v];
    }

}