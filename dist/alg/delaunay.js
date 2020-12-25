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
var delaunator_1 = require("./delaunator");
var voronoi_1 = require("./voronoi");
var tau = 2 * Math.PI, pow = Math.pow;
// A triangulation is collinear if all its triangles have a non-null area
function collinear(d) {
    var triangles = d.triangles, coords = d.coords;
    for (var i = 0; i < triangles.length; i += 3) {
        var a = 2 * triangles[i], b = 2 * triangles[i + 1], c = 2 * triangles[i + 2], cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1])
            - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]);
        if (cross > 1e-10)
            return false;
    }
    return true;
}
function jitter(x, y, r) {
    return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];
}
var Delaunay = /** @class */ (function () {
    function Delaunay(points) {
        this._delaunator = new delaunator_1.Delaunator(points);
        this.inedges = new Int32Array(points.length / 2);
        this._hullIndex = new Int32Array(points.length / 2);
        this.points = this._delaunator.coords;
        this._init();
    }
    Delaunay.from = function (points) {
        return new Delaunay(new Float64Array(points));
    };
    Delaunay.prototype.update = function () {
        this._delaunator.update();
        this._init();
        return this;
    };
    Delaunay.prototype._init = function () {
        var d = this._delaunator, points = this.points;
        // check for collinear
        if (d.hull && d.hull.length > 2 && collinear(d)) {
            this.collinear = Int32Array.from({ length: points.length / 2 }, function (_, i) { return i; })
                .sort(function (i, j) { return points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1]; }); // for exact neighbors
            var e = this.collinear[0], f = this.collinear[this.collinear.length - 1], bounds = [points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1]], r = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);
            for (var i = 0, n = points.length / 2; i < n; ++i) {
                var p = jitter(points[2 * i], points[2 * i + 1], r);
                points[2 * i] = p[0];
                points[2 * i + 1] = p[1];
            }
            this._delaunator = new delaunator_1.Delaunator(points);
        }
        else {
            delete this.collinear;
        }
        var halfedges = this.halfedges = this._delaunator.halfedges;
        var hull = this.hull = this._delaunator.hull;
        var triangles = this.triangles = this._delaunator.triangles;
        var inedges = this.inedges.fill(-1);
        var hullIndex = this._hullIndex.fill(-1);
        // Compute an index from each point to an (arbitrary) incoming halfedge
        // Used to give the first neighbor of each point; for this reason,
        // on the hull we give priority to exterior halfedges
        for (var e = 0, n = halfedges.length; e < n; ++e) {
            var p = triangles[e % 3 === 2 ? e - 2 : e + 1];
            if (halfedges[e] === -1 || inedges[p] === -1)
                inedges[p] = e;
        }
        for (var i = 0, n = hull.length; i < n; ++i) {
            hullIndex[hull[i]] = i;
        }
        // degenerate case: 1 or 2 (distinct) points
        if (hull.length <= 2 && hull.length > 0) {
            this.triangles = new Uint32Array(3).fill(-1);
            this.halfedges = new Uint32Array(3).fill(-1);
            this.triangles[0] = hull[0];
            this.triangles[1] = hull[1];
            this.triangles[2] = hull[1];
            inedges[hull[0]] = 1;
            if (hull.length === 2)
                inedges[hull[1]] = 0;
        }
    };
    Delaunay.prototype.voronoi = function (bounds) {
        return new voronoi_1.Voronoi(this, bounds);
    };
    Delaunay.prototype.neighbors = function (i) {
        var _a, inedges, hull, _hullIndex, halfedges, triangles, collinear, l, e0, e, p0, p;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = this, inedges = _a.inedges, hull = _a.hull, _hullIndex = _a._hullIndex, halfedges = _a.halfedges, triangles = _a.triangles, collinear = _a.collinear;
                    if (!collinear) return [3 /*break*/, 5];
                    l = collinear.indexOf(i);
                    if (!(l > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, collinear[l - 1]];
                case 1:
                    _b.sent();
                    _b.label = 2;
                case 2:
                    if (!(l < collinear.length - 1)) return [3 /*break*/, 4];
                    return [4 /*yield*/, collinear[l + 1]];
                case 3:
                    _b.sent();
                    _b.label = 4;
                case 4: return [2 /*return*/];
                case 5:
                    e0 = inedges[i];
                    if (e0 === -1)
                        return [2 /*return*/]; // coincident point
                    e = e0, p0 = -1;
                    _b.label = 6;
                case 6: return [4 /*yield*/, p0 = triangles[e]];
                case 7:
                    _b.sent();
                    e = e % 3 === 2 ? e - 2 : e + 1;
                    if (triangles[e] !== i)
                        return [2 /*return*/]; // bad triangulation
                    e = halfedges[e];
                    if (!(e === -1)) return [3 /*break*/, 10];
                    p = hull[(_hullIndex[i] + 1) % hull.length];
                    if (!(p !== p0)) return [3 /*break*/, 9];
                    return [4 /*yield*/, p];
                case 8:
                    _b.sent();
                    _b.label = 9;
                case 9: return [2 /*return*/];
                case 10:
                    if (e !== e0) return [3 /*break*/, 6];
                    _b.label = 11;
                case 11: return [2 /*return*/];
            }
        });
    };
    Delaunay.prototype.find = function (x, y, i) {
        if (i === void 0) { i = 0; }
        if ((x = +x, x !== x) || (y = +y, y !== y))
            return -1;
        var i0 = i;
        var c;
        while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0)
            i = c;
        return c;
    };
    Delaunay.prototype._step = function (i, x, y) {
        var _a = this, inedges = _a.inedges, hull = _a.hull, _hullIndex = _a._hullIndex, halfedges = _a.halfedges, triangles = _a.triangles, points = _a.points;
        if (inedges[i] === -1 || !points.length)
            return (i + 1) % (points.length >> 1);
        var c = i;
        var dc = pow(x - points[i * 2], 2) + pow(y - points[i * 2 + 1], 2);
        var e0 = inedges[i];
        var e = e0;
        do {
            var t = triangles[e];
            var dt = pow(x - points[t * 2], 2) + pow(y - points[t * 2 + 1], 2);
            if (dt < dc)
                dc = dt, c = t;
            e = e % 3 === 2 ? e - 2 : e + 1;
            if (triangles[e] !== i)
                break; // bad triangulation
            e = halfedges[e];
            if (e === -1) {
                e = hull[(_hullIndex[i] + 1) % hull.length];
                if (e !== t) {
                    if (pow(x - points[e * 2], 2) + pow(y - points[e * 2 + 1], 2) < dc)
                        return e;
                }
                break;
            }
        } while (e !== e0);
        return c;
    };
    return Delaunay;
}());
exports.default = Delaunay;
