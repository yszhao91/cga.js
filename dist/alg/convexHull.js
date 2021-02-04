"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickHull = exports.ConvexHull = void 0;
var mesh_1 = require("@/render/mesh");
var common_1 = require("./common");
var common_2 = require("./common");
var Vec3_1 = require("../math/Vec3");
var Line_1 = require("@/struct/3d/Line");
var type_1 = require("@/struct/data/type");
var ConvexHull = /** @class */ (function () {
    /**
     * Create a convex hull from points.
     * @param {Point[]} pts 二维点集
     * @param {Object} options
     */
    function ConvexHull(pts, options) {
        this._hull = [];
        this._originPoints = undefined;
        this._normal = Vec3_1.Vec3.UnitZ;
        if (pts.length < 3) {
            throw Error('Cannot build a simplex out of < 3 points');
        }
        this._originPoints = pts;
        var _newPoints = common_1.clone(pts);
        mesh_1.indexable(_newPoints);
        var _planeNormal = options === null || options === void 0 ? void 0 : options.planeNormal;
        if (!_planeNormal) {
            var _plane = common_2.isInOnePlane(_newPoints);
            if (_plane) {
                _planeNormal = _plane.normal;
            }
        }
        if (_planeNormal) {
            if (this._normal.dot(_planeNormal) < 0) {
                _planeNormal.negate();
            }
            common_2.rotateByUnitVectors(_newPoints, _planeNormal, this._normal);
            _newPoints.forEach(function (pt) { return pt.z = 0; });
            var _a = this.getMinMax(_newPoints), minPt = _a[0], maxPt = _a[1];
            var line0 = new Line_1.Line(minPt, maxPt), line1 = new Line_1.Line(maxPt, minPt);
            this.addBoundSeg(line0, _newPoints);
            this.addBoundSeg(line1, _newPoints);
        }
    }
    ConvexHull.prototype.getMinMax = function (points) {
        var maxXp = points[0];
        var minXp = points[0];
        for (var i = 1; i < points.length; i++) {
            var pt = points[i];
            if (maxXp.x < pt.x)
                maxXp = pt;
            else if (minXp.x > pt.x)
                minXp = pt;
        }
        return [minXp, maxXp];
    };
    ConvexHull.prototype.addBoundSeg = function (line, points) {
        var _this = this;
        var _outerPoints = [];
        points.forEach(function (pt) {
            if (line.orientationPoint(pt, _this._normal) === type_1.Orientation.Positive) {
                _outerPoints.push(pt);
            }
        });
        return _outerPoints;
    };
    Object.defineProperty(ConvexHull.prototype, "hull", {
        /* ============== Getter & Setter ============ */
        /**
         * Getter for hull result.
         */
        get: function () {
            if (this._hull.length === 0 && this._originPoints) {
                return common_1.clone(this._originPoints);
            }
            return this._hull;
        },
        enumerable: false,
        configurable: true
    });
    return ConvexHull;
}());
exports.ConvexHull = ConvexHull;
function quickHull(points) {
    var _convexHull = new ConvexHull(points);
    return _convexHull.hull;
}
exports.quickHull = quickHull;
