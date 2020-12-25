"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Delaunator = void 0;
var EPSILON = Math.pow(2, -52);
var EDGE_STACK = new Uint32Array(512);
var Delaunator = /** @class */ (function () {
    function Delaunator(coords) {
        var n = coords.length >> 1;
        if (n > 0 && typeof coords[0] !== 'number')
            throw new Error('Expected coords to contain numbers.');
        this.coords = coords;
        // arrays that will store the triangulation graph
        var maxTriangles = Math.max(2 * n - 5, 0);
        this._triangles = new Uint32Array(maxTriangles * 3);
        this._halfedges = new Int32Array(maxTriangles * 3);
        // temporary arrays for tracking the edges of the advancing convex hull
        this._hashSize = Math.ceil(Math.sqrt(n));
        this._hullPrev = new Uint32Array(n); // edge to prev edge
        this._hullNext = new Uint32Array(n); // edge to next edge
        this._hullTri = new Uint32Array(n); // edge to adjacent triangle
        this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash
        // temporary arrays for sorting points
        this._ids = new Uint32Array(n);
        this._dists = new Float64Array(n);
        this.update();
    }
    Delaunator.from = function (points) {
        var n = points.length;
        var coords = new Float64Array(n);
        for (var i = 0; i < n; i++) {
            var p = points[i];
            coords[i] = p;
        }
        return new Delaunator(coords);
    };
    Delaunator.fromVecs = function (points) {
        var ps = [];
        for (var i = 0; i < points.length; i++) {
            ps.push(points[i].x, points[i].y);
        }
        return Delaunator.from(ps);
    };
    Delaunator.prototype.update = function () {
        var _a = this, coords = _a.coords, hullPrev = _a._hullPrev, hullNext = _a._hullNext, hullTri = _a._hullTri, hullHash = _a._hullHash;
        var n = coords.length >> 1;
        // populate an array of point indices; calculate input data bbox
        var minX = Infinity;
        var minY = Infinity;
        var maxX = -Infinity;
        var maxY = -Infinity;
        for (var i = 0; i < n; i++) {
            var x = coords[2 * i];
            var y = coords[2 * i + 1];
            if (x < minX)
                minX = x;
            if (y < minY)
                minY = y;
            if (x > maxX)
                maxX = x;
            if (y > maxY)
                maxY = y;
            this._ids[i] = i;
        }
        var cx = (minX + maxX) / 2;
        var cy = (minY + maxY) / 2;
        var minDist = Infinity;
        var i0 = 0, i1 = 0, i2 = 0;
        // pick a seed point close to the center
        for (var i = 0; i < n; i++) {
            var d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);
            if (d < minDist) {
                i0 = i;
                minDist = d;
            }
        }
        var i0x = coords[2 * i0];
        var i0y = coords[2 * i0 + 1];
        minDist = Infinity;
        // find the point closest to the seed
        for (var i = 0; i < n; i++) {
            if (i === i0)
                continue;
            var d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);
            if (d < minDist && d > 0) {
                i1 = i;
                minDist = d;
            }
        }
        var i1x = coords[2 * i1];
        var i1y = coords[2 * i1 + 1];
        var minRadius = Infinity;
        // find the third point which forms the smallest circumcircle with the first two
        for (var i = 0; i < n; i++) {
            if (i === i0 || i === i1)
                continue;
            var r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);
            if (r < minRadius) {
                i2 = i;
                minRadius = r;
            }
        }
        var i2x = coords[2 * i2];
        var i2y = coords[2 * i2 + 1];
        if (minRadius === Infinity) {
            // order collinear points by dx (or dy if all x are identical)
            // and return the list as a hull
            for (var i = 0; i < n; i++) {
                this._dists[i] = (coords[2 * i] - coords[0]) || (coords[2 * i + 1] - coords[1]);
            }
            quicksort(this._ids, this._dists, 0, n - 1);
            var hull = new Uint32Array(n);
            var j = 0;
            for (var i = 0, d0 = -Infinity; i < n; i++) {
                var id = this._ids[i];
                if (this._dists[id] > d0) {
                    hull[j++] = id;
                    d0 = this._dists[id];
                }
            }
            this.hull = hull.subarray(0, j);
            this.triangles = new Uint32Array(0);
            this.halfedges = new Uint32Array(0);
            return;
        }
        // swap the order of the seed points for counter-clockwise orientation
        if (orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
            var i = i1;
            var x = i1x;
            var y = i1y;
            i1 = i2;
            i1x = i2x;
            i1y = i2y;
            i2 = i;
            i2x = x;
            i2y = y;
        }
        var center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
        this._cx = center.x;
        this._cy = center.y;
        for (var i = 0; i < n; i++) {
            this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
        }
        // sort the points by distance from the seed triangle circumcenter
        quicksort(this._ids, this._dists, 0, n - 1);
        // set up the seed triangle as the starting hull
        this._hullStart = i0;
        var hullSize = 3;
        hullNext[i0] = hullPrev[i2] = i1;
        hullNext[i1] = hullPrev[i0] = i2;
        hullNext[i2] = hullPrev[i1] = i0;
        hullTri[i0] = 0;
        hullTri[i1] = 1;
        hullTri[i2] = 2;
        hullHash.fill(-1);
        hullHash[this._hashKey(i0x, i0y)] = i0;
        hullHash[this._hashKey(i1x, i1y)] = i1;
        hullHash[this._hashKey(i2x, i2y)] = i2;
        this.trianglesLen = 0;
        this._addTriangle(i0, i1, i2, -1, -1, -1);
        for (var k = 0, xp = void 0, yp = void 0; k < this._ids.length; k++) {
            var i = this._ids[k];
            var x = coords[2 * i];
            var y = coords[2 * i + 1];
            // skip near-duplicate points
            if (k > 0)
                if (xp !== undefined && yp !== undefined) {
                    if (Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON)
                        continue;
                }
                else
                    continue;
            xp = x;
            yp = y;
            // skip seed triangle points
            if (i === i0 || i === i1 || i === i2)
                continue;
            // find a visible edge on the convex hull using edge hash
            var start = 0;
            for (var j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
                start = hullHash[(key + j) % this._hashSize];
                if (start !== -1 && start !== hullNext[start])
                    break;
            }
            start = hullPrev[start];
            var e = start, q = void 0;
            while (q = hullNext[e], !orient(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1])) {
                e = q;
                if (e === start) {
                    e = -1;
                    break;
                }
            }
            if (e === -1)
                continue; // likely a near-duplicate point; skip it
            // add the first triangle from the point
            var t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]);
            // recursively flip triangles from the point until they satisfy the Delaunay condition
            hullTri[i] = this._legalize(t + 2);
            hullTri[e] = t; // keep track of boundary triangles on the hull
            hullSize++;
            // walk forward through the hull, adding more triangles and flipping recursively
            var n_1 = hullNext[e];
            while (q = hullNext[n_1], orient(x, y, coords[2 * n_1], coords[2 * n_1 + 1], coords[2 * q], coords[2 * q + 1])) {
                t = this._addTriangle(n_1, i, q, hullTri[i], -1, hullTri[n_1]);
                hullTri[i] = this._legalize(t + 2);
                hullNext[n_1] = n_1; // mark as removed
                hullSize--;
                n_1 = q;
            }
            // walk backward from the other side, adding more triangles and flipping
            if (e === start) {
                while (q = hullPrev[e], orient(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1])) {
                    t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);
                    this._legalize(t + 2);
                    hullTri[q] = t;
                    hullNext[e] = e; // mark as removed
                    hullSize--;
                    e = q;
                }
            }
            // update the hull indices
            this._hullStart = hullPrev[i] = e;
            hullNext[e] = hullPrev[n_1] = i;
            hullNext[i] = n_1;
            // save the two new edges in the hash table
            hullHash[this._hashKey(x, y)] = i;
            hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
        }
        this.hull = new Uint32Array(hullSize);
        for (var i = 0, e = this._hullStart; i < hullSize; i++) {
            this.hull[i] = e;
            e = hullNext[e];
        }
        // trim typed triangle mesh arrays
        this.triangles = this._triangles.subarray(0, this.trianglesLen);
        this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
    };
    Delaunator.prototype._hashKey = function (x, y) {
        return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
    };
    Delaunator.prototype._legalize = function (a) {
        var _a = this, triangles = _a._triangles, halfedges = _a._halfedges, coords = _a.coords;
        var i = 0;
        var ar = 0;
        // recursion eliminated with a fixed-size stack
        while (true) {
            var b = halfedges[a];
            /* if the pair of triangles doesn't satisfy the Delaunay condition
             * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
             * then do the same check/flip recursively for the new pair of triangles
             *
             *           pl                    pl
             *          /||\                  /  \
             *       al/ || \bl            al/    \a
             *        /  ||  \              /      \
             *       /  a||b  \    flip    /___ar___\
             *     p0\   ||   /p1   =>   p0\---bl---/p1
             *        \  ||  /              \      /
             *       ar\ || /br             b\    /br
             *          \||/                  \  /
             *           pr                    pr
             */
            var a0 = a - a % 3;
            ar = a0 + (a + 2) % 3;
            if (b === -1) { // convex hull edge
                if (i === 0)
                    break;
                a = EDGE_STACK[--i];
                continue;
            }
            var b0 = b - b % 3;
            var al = a0 + (a + 1) % 3;
            var bl = b0 + (b + 2) % 3;
            var p0 = triangles[ar];
            var pr = triangles[a];
            var pl = triangles[al];
            var p1 = triangles[bl];
            var illegal = inCircle(coords[2 * p0], coords[2 * p0 + 1], coords[2 * pr], coords[2 * pr + 1], coords[2 * pl], coords[2 * pl + 1], coords[2 * p1], coords[2 * p1 + 1]);
            if (illegal) {
                triangles[a] = p1;
                triangles[b] = p0;
                var hbl = halfedges[bl];
                // edge swapped on the other side of the hull (rare); fix the halfedge reference
                if (hbl === -1) {
                    var e = this._hullStart;
                    do {
                        if (this._hullTri[e] === bl) {
                            this._hullTri[e] = a;
                            break;
                        }
                        e = this._hullPrev[e];
                    } while (e !== this._hullStart);
                }
                this._link(a, hbl);
                this._link(b, halfedges[ar]);
                this._link(ar, bl);
                var br = b0 + (b + 1) % 3;
                // don't worry about hitting the cap: it can only happen on extremely degenerate input
                if (i < EDGE_STACK.length) {
                    EDGE_STACK[i++] = br;
                }
            }
            else {
                if (i === 0)
                    break;
                a = EDGE_STACK[--i];
            }
        }
        return ar;
    };
    Delaunator.prototype._link = function (a, b) {
        this._halfedges[a] = b;
        if (b !== -1)
            this._halfedges[b] = a;
    };
    // add a new triangle given vertex indices and adjacent half-edge ids
    Delaunator.prototype._addTriangle = function (i0, i1, i2, a, b, c) {
        var t = this.trianglesLen;
        this._triangles[t] = i0;
        this._triangles[t + 1] = i1;
        this._triangles[t + 2] = i2;
        this._link(t, a);
        this._link(t + 1, b);
        this._link(t + 2, c);
        this.trianglesLen += 3;
        return t;
    };
    return Delaunator;
}());
exports.Delaunator = Delaunator;
// monotonically increases with real angle, but doesn't need expensive trigonometry
function pseudoAngle(dx, dy) {
    var p = dx / (Math.abs(dx) + Math.abs(dy));
    return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
}
function dist(ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return dx * dx + dy * dy;
}
// return 2d orientation sign if we're confident in it through J. Shewchuk's error bound check
function orientIfSure(px, py, rx, ry, qx, qy) {
    var l = (ry - py) * (qx - px);
    var r = (rx - px) * (qy - py);
    return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r) ? l - r : 0;
}
// a more robust orientation test that's stable in a given triangle (to fix robustness issues)
function orient(rx, ry, qx, qy, px, py) {
    return (orientIfSure(px, py, rx, ry, qx, qy) ||
        orientIfSure(rx, ry, qx, qy, px, py) ||
        orientIfSure(qx, qy, px, py, rx, ry)) < 0;
}
function inCircle(ax, ay, bx, by, cx, cy, px, py) {
    var dx = ax - px;
    var dy = ay - py;
    var ex = bx - px;
    var ey = by - py;
    var fx = cx - px;
    var fy = cy - py;
    var ap = dx * dx + dy * dy;
    var bp = ex * ex + ey * ey;
    var cp = fx * fx + fy * fy;
    return dx * (ey * cp - bp * fy) -
        dy * (ex * cp - bp * fx) +
        ap * (ex * fy - ey * fx) < 0;
}
function circumradius(ax, ay, bx, by, cx, cy) {
    var dx = bx - ax;
    var dy = by - ay;
    var ex = cx - ax;
    var ey = cy - ay;
    var bl = dx * dx + dy * dy;
    var cl = ex * ex + ey * ey;
    var d = 0.5 / (dx * ey - dy * ex);
    var x = (ey * bl - dy * cl) * d;
    var y = (dx * cl - ex * bl) * d;
    return x * x + y * y;
}
function circumcenter(ax, ay, bx, by, cx, cy) {
    var dx = bx - ax;
    var dy = by - ay;
    var ex = cx - ax;
    var ey = cy - ay;
    var bl = dx * dx + dy * dy;
    var cl = ex * ex + ey * ey;
    var d = 0.5 / (dx * ey - dy * ex);
    var x = ax + (ey * bl - dy * cl) * d;
    var y = ay + (dx * cl - ex * bl) * d;
    return { x: x, y: y };
}
function quicksort(ids, dists, left, right) {
    if (right - left <= 20) {
        for (var i = left + 1; i <= right; i++) {
            var temp = ids[i];
            var tempDist = dists[temp];
            var j = i - 1;
            while (j >= left && dists[ids[j]] > tempDist)
                ids[j + 1] = ids[j--];
            ids[j + 1] = temp;
        }
    }
    else {
        var median = (left + right) >> 1;
        var i = left + 1;
        var j = right;
        swap(ids, median, i);
        if (dists[ids[left]] > dists[ids[right]])
            swap(ids, left, right);
        if (dists[ids[i]] > dists[ids[right]])
            swap(ids, i, right);
        if (dists[ids[left]] > dists[ids[i]])
            swap(ids, left, i);
        var temp = ids[i];
        var tempDist = dists[temp];
        while (true) {
            do
                i++;
            while (dists[ids[i]] < tempDist);
            do
                j--;
            while (dists[ids[j]] > tempDist);
            if (j < i)
                break;
            swap(ids, i, j);
        }
        ids[left + 1] = ids[j];
        ids[j] = temp;
        if (right - i + 1 >= j - left) {
            quicksort(ids, dists, i, right);
            quicksort(ids, dists, left, j - 1);
        }
        else {
            quicksort(ids, dists, left, j - 1);
            quicksort(ids, dists, i, right);
        }
    }
}
function swap(arr, i, j) {
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
