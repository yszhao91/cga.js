"use strict";
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voronoi = void 0;
var epsilon = 1e-6;
var Polygon = /** @class */ (function () {
    function Polygon() {
        this._ = [];
    }
    Polygon.prototype.moveTo = function (x, y) {
        this._.push([x, y]);
    };
    Polygon.prototype.closePath = function () {
        this._.push(this._[0].slice());
    };
    Polygon.prototype.lineTo = function (x, y) {
        this._.push([x, y]);
    };
    Polygon.prototype.value = function () {
        return this._.length ? this._ : null;
    };
    return Polygon;
}());
var Voronoi = /** @class */ (function () {
    function Voronoi(delaunay, _a) {
        var _b = _a === void 0 ? [0, 0, 960, 500] : _a, xmin = _b[0], ymin = _b[1], xmax = _b[2], ymax = _b[3];
        if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin)))
            throw new Error("invalid bounds");
        this.delaunay = delaunay;
        this._circumcenters = new Float64Array(delaunay.points.length);
        this.vectors = new Float64Array(delaunay.points.length);
        this.xmax = xmax, this.xmin = xmin;
        this.ymax = ymax, this.ymin = ymin;
        this._init();
    }
    Voronoi.prototype.update = function () {
        this.delaunay.update();
        this._init();
        return this;
    };
    Voronoi.prototype._init = function () {
        var _a = this, _b = _a.delaunay, points = _b.points, hull = _b.hull, triangles = _b.triangles, vectors = _a.vectors;
        // Compute circumcenters.
        var circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);
        for (var i = 0, j = 0, n = triangles.length, x = void 0, y = void 0; i < n; i += 3, j += 2) {
            var t1 = triangles[i] * 2;
            var t2 = triangles[i + 1] * 2;
            var t3 = triangles[i + 2] * 2;
            var x1_1 = points[t1];
            var y1_1 = points[t1 + 1];
            var x2 = points[t2];
            var y2 = points[t2 + 1];
            var x3 = points[t3];
            var y3 = points[t3 + 1];
            var dx = x2 - x1_1;
            var dy = y2 - y1_1;
            var ex = x3 - x1_1;
            var ey = y3 - y1_1;
            var bl = dx * dx + dy * dy;
            var cl = ex * ex + ey * ey;
            var ab = (dx * ey - dy * ex) * 2;
            if (!ab) {
                // degenerate case (collinear diagram)
                x = (x1_1 + x3) / 2 - 1e8 * ey;
                y = (y1_1 + y3) / 2 + 1e8 * ex;
            }
            else if (Math.abs(ab) < 1e-8) {
                // almost equal points (degenerate triangle)
                x = (x1_1 + x3) / 2;
                y = (y1_1 + y3) / 2;
            }
            else {
                var d = 1 / ab;
                x = x1_1 + (ey * bl - dy * cl) * d;
                y = y1_1 + (dx * cl - ex * bl) * d;
            }
            circumcenters[j] = x;
            circumcenters[j + 1] = y;
        }
        // Compute exterior cell rays.
        var h = hull[hull.length - 1];
        var p0, p1 = h * 4;
        var x0, x1 = points[2 * h];
        var y0, y1 = points[2 * h + 1];
        vectors.fill(0);
        for (var i = 0; i < hull.length; ++i) {
            h = hull[i];
            p0 = p1, x0 = x1, y0 = y1;
            p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
            vectors[p0 + 2] = vectors[p1] = y0 - y1;
            vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
        }
    };
    Voronoi.prototype.cellPolygons = function () {
        var points, i, n, cell;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    points = this.delaunay.points;
                    i = 0, n = points.length / 2;
                    _a.label = 1;
                case 1:
                    if (!(i < n)) return [3 /*break*/, 4];
                    cell = this.cellPolygon(i);
                    if (!cell) return [3 /*break*/, 3];
                    cell.index = i;
                    return [4 /*yield*/, cell];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    ++i;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    };
    Voronoi.prototype.cellPolygon = function (i) {
        var polygon = new Polygon;
        return polygon.value();
    };
    Voronoi.prototype._renderSegment = function (x0, y0, x1, y1, context) {
        var S;
        var c0 = this._regioncode(x0, y0);
        var c1 = this._regioncode(x1, y1);
        if (c0 === 0 && c1 === 0) {
            context.moveTo(x0, y0);
            context.lineTo(x1, y1);
        }
        else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
            context.moveTo(S[0], S[1]);
            context.lineTo(S[2], S[3]);
        }
    };
    Voronoi.prototype.contains = function (i, x, y) {
        if ((x = +x, x !== x) || (y = +y, y !== y))
            return false;
        return this.delaunay._step(i, x, y) === i;
    };
    Voronoi.prototype.neighbors = function (i) {
        var ci, _i, _a, j, cj, ai, li, aj, lj;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ci = this._clip(i);
                    if (!ci) return [3 /*break*/, 8];
                    _i = 0, _a = this.delaunay.neighbors(i);
                    _b.label = 1;
                case 1:
                    if (!(_i < _a.length)) return [3 /*break*/, 8];
                    j = _a[_i];
                    cj = this._clip(j);
                    if (!cj) return [3 /*break*/, 7];
                    ai = 0, li = ci.length;
                    _b.label = 2;
                case 2:
                    if (!(ai < li)) return [3 /*break*/, 7];
                    aj = 0, lj = cj.length;
                    _b.label = 3;
                case 3:
                    if (!(aj < lj)) return [3 /*break*/, 6];
                    if (!(ci[ai] == cj[aj]
                        && ci[ai + 1] == cj[aj + 1]
                        && ci[(ai + 2) % li] == cj[(aj + lj - 2) % lj]
                        && ci[(ai + 3) % li] == cj[(aj + lj - 1) % lj])) return [3 /*break*/, 5];
                    return [4 /*yield*/, j];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 7];
                case 5:
                    aj += 2;
                    return [3 /*break*/, 3];
                case 6:
                    ai += 2;
                    return [3 /*break*/, 2];
                case 7:
                    _i++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/];
            }
        });
    };
    Voronoi.prototype._cell = function (i) {
        var _a = this, circumcenters = _a.circumcenters, _b = _a.delaunay, inedges = _b.inedges, halfedges = _b.halfedges, triangles = _b.triangles;
        var e0 = inedges[i];
        if (e0 === -1)
            return null; // coincident point
        var points = [];
        var e = e0;
        do {
            var t = Math.floor(e / 3);
            points.push(circumcenters[t * 2], circumcenters[t * 2 + 1]);
            e = e % 3 === 2 ? e - 2 : e + 1;
            if (triangles[e] !== i)
                break; // bad triangulation
            e = halfedges[e];
        } while (e !== e0 && e !== -1);
        return points;
    };
    Voronoi.prototype._clip = function (i) {
        // degenerate case (1 valid point: return the box)
        if (i === 0 && this.delaunay.hull.length === 1) {
            return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
        }
        var points = this._cell(i);
        if (points === null)
            return null;
        var V = this.vectors;
        var v = i * 4;
        return V[v] || V[v + 1]
            ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3])
            : this._clipFinite(i, points);
    };
    Voronoi.prototype._clipFinite = function (i, points) {
        var n = points.length;
        var P = null;
        var x0, y0, x1 = points[n - 2], y1 = points[n - 1];
        var c0, c1 = this._regioncode(x1, y1);
        var e0, e1;
        for (var j = 0; j < n; j += 2) {
            x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
            c0 = c1, c1 = this._regioncode(x1, y1);
            if (c0 === 0 && c1 === 0) {
                e0 = e1, e1 = 0;
                if (P)
                    P.push(x1, y1);
                else
                    P = [x1, y1];
            }
            else {
                var S = void 0, sx0 = void 0, sy0 = void 0, sx1 = void 0, sy1 = void 0;
                if (c0 === 0) {
                    if ((S = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null)
                        continue;
                    sx0 = S[0], sy0 = S[1], sx1 = S[2], sy1 = S[3];
                }
                else {
                    if ((S = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null)
                        continue;
                    sx1 = S[0], sy1 = S[1], sx0 = S[2], sy0 = S[3];
                    e0 = e1, e1 = this._edgecode(sx0, sy0);
                    if (e0 && e1)
                        this._edge(i, e0, e1, P, P.length);
                    if (P)
                        P.push(sx0, sy0);
                    else
                        P = [sx0, sy0];
                }
                e0 = e1, e1 = this._edgecode(sx1, sy1);
                if (e0 && e1)
                    this._edge(i, e0, e1, P, P.length);
                if (P)
                    P.push(sx1, sy1);
                else
                    P = [sx1, sy1];
            }
        }
        if (P) {
            e0 = e1, e1 = this._edgecode(P[0], P[1]);
            if (e0 && e1)
                this._edge(i, e0, e1, P, P.length);
        }
        else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
            return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
        }
        return P;
    };
    Voronoi.prototype._clipSegment = function (x0, y0, x1, y1, c0, c1) {
        while (true) {
            if (c0 === 0 && c1 === 0)
                return [x0, y0, x1, y1];
            if (c0 & c1)
                return null;
            var x = void 0, y = void 0, c = c0 || c1;
            if (c & 8)
                x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;
            else if (c & 4)
                x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;
            else if (c & 2)
                y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;
            else
                y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
            if (c0)
                x0 = x, y0 = y, c0 = this._regioncode(x0, y0);
            else
                x1 = x, y1 = y, c1 = this._regioncode(x1, y1);
        }
    };
    Voronoi.prototype._clipInfinite = function (i, points, vx0, vy0, vxn, vyn) {
        var P = Array.from(points), p;
        if (p = this._project(P[0], P[1], vx0, vy0))
            P.unshift(p[0], p[1]);
        if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn))
            P.push(p[0], p[1]);
        if (P = this._clipFinite(i, P)) {
            for (var j = 0, n = P.length, c0 = void 0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2) {
                c0 = c1, c1 = this._edgecode(P[j], P[j + 1]);
                if (c0 && c1)
                    j = this._edge(i, c0, c1, P, j), n = P.length;
            }
        }
        else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
            P = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
        }
        return P;
    };
    Voronoi.prototype._edge = function (i, e0, e1, P, j) {
        while (e0 !== e1) {
            var x = void 0, y = void 0;
            switch (e0) {
                case 5:
                    e0 = 4;
                    continue; // top-left
                case 4:
                    e0 = 6, x = this.xmax, y = this.ymin;
                    break; // top
                case 6:
                    e0 = 2;
                    continue; // top-right
                case 2:
                    e0 = 10, x = this.xmax, y = this.ymax;
                    break; // right
                case 10:
                    e0 = 8;
                    continue; // bottom-right
                case 8:
                    e0 = 9, x = this.xmin, y = this.ymax;
                    break; // bottom
                case 9:
                    e0 = 1;
                    continue; // bottom-left
                case 1:
                    e0 = 5, x = this.xmin, y = this.ymin;
                    break; // left
            }
            if ((P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y)) {
                P.splice(j, 0, x, y), j += 2;
            }
        }
        if (P.length > 4) {
            for (var i_1 = 0; i_1 < P.length; i_1 += 2) {
                var j_1 = (i_1 + 2) % P.length, k = (i_1 + 4) % P.length;
                if (P[i_1] === P[j_1] && P[j_1] === P[k]
                    || P[i_1 + 1] === P[j_1 + 1] && P[j_1 + 1] === P[k + 1])
                    P.splice(j_1, 2), i_1 -= 2;
            }
        }
        return j;
    };
    Voronoi.prototype._project = function (x0, y0, vx, vy) {
        var t = Infinity, c, x, y;
        if (vy < 0) { // top
            if (y0 <= this.ymin)
                return null;
            if ((c = (this.ymin - y0) / vy) < t)
                y = this.ymin, x = x0 + (t = c) * vx;
        }
        else if (vy > 0) { // bottom
            if (y0 >= this.ymax)
                return null;
            if ((c = (this.ymax - y0) / vy) < t)
                y = this.ymax, x = x0 + (t = c) * vx;
        }
        if (vx > 0) { // right
            if (x0 >= this.xmax)
                return null;
            if ((c = (this.xmax - x0) / vx) < t)
                x = this.xmax, y = y0 + (t = c) * vy;
        }
        else if (vx < 0) { // left
            if (x0 <= this.xmin)
                return null;
            if ((c = (this.xmin - x0) / vx) < t)
                x = this.xmin, y = y0 + (t = c) * vy;
        }
        return [x, y];
    };
    Voronoi.prototype._edgecode = function (x, y) {
        return (x === this.xmin ? 1
            : x === this.xmax ? 2 : 0)
            | (y === this.ymin ? 4
                : y === this.ymax ? 8 : 0);
    };
    Voronoi.prototype._regioncode = function (x, y) {
        return (x < this.xmin ? 1
            : x > this.xmax ? 2 : 0)
            | (y < this.ymin ? 4
                : y > this.ymax ? 8 : 0);
    };
    return Voronoi;
}());
exports.Voronoi = Voronoi;
