"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelaunaySlow = void 0;
var Vec3_1 = require("../math/Vec3");
var Circle_1 = require("../struct/3d/Circle");
/**
 * 只考虑2d的散点，如果是3d的以后会新建一个Delaunay3
 */
var EPSILON = 1.0 / 1048576.0;
var DelaunaySlow = /** @class */ (function () {
    function DelaunaySlow(vs) {
        this.vs = vs;
    }
    DelaunaySlow.prototype.supertriangle = function (vertices) {
        var xmin = +Infinity, ymin = +Infinity, xmax = -Infinity, ymax = -Infinity, i, dx, dy, dmax, xmid, ymid;
        for (i = vertices.length; i--;) {
            if (vertices[i].x < xmin)
                xmin = vertices[i].x;
            if (vertices[i].x > xmax)
                xmax = vertices[i].x;
            if (vertices[i].y < ymin)
                ymin = vertices[i].y;
            if (vertices[i].y > ymax)
                ymax = vertices[i].y;
        }
        dx = xmax - xmin;
        dy = ymax - ymin;
        dmax = Math.max(dx, dy);
        xmid = xmin + dx * 0.5;
        ymid = ymin + dy * 0.5;
        return [
            new Vec3_1.Vec3(xmid - 20 * dmax, ymid - dmax),
            new Vec3_1.Vec3(xmid, ymid + 20 * dmax),
            new Vec3_1.Vec3(xmid + 20 * dmax, ymid - dmax)
        ];
    };
    DelaunaySlow.prototype.triangulation = function (vs) {
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
        var superTriangle = this.supertriangle(vs);
        vs.push.apply(vs, superTriangle); //新加大三角形点
        var open = [this.circumcircle(vs, vslen + 0, vslen + 1, vslen + 2)];
        var closed = [];
        for (var i_1 = indices.length; i_1--;) {
            var edges = [];
            var c = indices[i_1];
            var point = vs[c];
            for (var j = open.length; j--;) {
                var openj = open[j];
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
                edges.push(openj.i, openj.j, openj.j, openj.k, openj.k, openj.i);
                open.splice(j, 1);
            }
            this.dedup(edges);
            for (var j = edges.length; j;) {
                var b = edges[--j];
                var a = edges[--j];
                open.push(this.circumcircle(vs, a, b, c));
            }
        }
        for (i = open.length; i--;)
            closed.push(open[i]);
        open.length = 0;
        var result = [];
        for (i = closed.length; i--;) {
            var close = closed[i];
            if (close.i < vslen && close.j < vslen && close.k < vslen)
                result.push(close.i, close.j, close.k);
        }
        /* Yay, we're done! */
        return result;
    };
    /**
     * 外接圆
     * @param vertices 点击
     * @param i
     * @param j
     * @param k
     */
    DelaunaySlow.prototype.circumcircle = function (vertices, i, j, k) {
        var circle = new Circle_1.Circle().setFrom3Points(vertices[i], vertices[j], vertices[k]);
        circle.i = i;
        circle.j = j;
        circle.k = k;
        return circle;
    };
    DelaunaySlow.prototype.dedup = function (edges) {
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
    };
    DelaunaySlow.prototype.contains = function (tri, p) {
        /* Bounding box test first, for quick rejections. */
        if ((p.x < tri[0].x && p.x < tri[1].x && p.x < tri[2].x) ||
            (p.x > tri[0].x && p.x > tri[1].x && p.x > tri[2].x) ||
            (p.y < tri[0].y && p.y < tri[1].y && p.y < tri[2].y) ||
            (p.y > tri[0].y && p.y > tri[1].y && p.y > tri[2].y))
            return null;
        var a = tri[1].x - tri[0].x, b = tri[2].x - tri[0].x, c = tri[1].y - tri[0].y, d = tri[2].y - tri[0].y, i = a * d - b * c;
        /* Degenerate tri. */
        if (i === 0.0)
            return null;
        var u = (d * (p.x - tri[0].x) - b * (p.y - tri[0].y)) / i, v = (a * (p.y - tri[0].y) - c * (p.x - tri[0].x)) / i;
        /* If we're outside the tri, fail. */
        if (u < 0.0 || v < 0.0 || (u + v) > 1.0)
            return null;
        return [u, v];
    };
    return DelaunaySlow;
}());
exports.DelaunaySlow = DelaunaySlow;
