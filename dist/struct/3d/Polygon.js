"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Polygon = void 0;
var Vec3_1 = require("../../math/Vec3");
var Segment_1 = require("./Segment");
var Polyline_1 = require("./Polyline");
var Polygon = /** @class */ (function (_super) {
    __extends(Polygon, _super);
    function Polygon(vs) {
        var _this = _super.call(this, vs) || this;
        _this.isPolygon = true;
        Object.setPrototypeOf(_this, Polygon.prototype);
        return _this;
    }
    Polygon.prototype.offset = function (distance, normal) {
        if (normal === void 0) { normal = Vec3_1.Vec3.UnitY; }
        var segments = [];
        for (var i = 0; i < this.length; i++) {
            var point = this[i];
            var pointNext = this[(i + 1) % this.length];
            var segment = new Segment_1.Segment(point, pointNext);
            segments.push(segment);
            segment.offset(distance, normal);
        }
        for (var i = 0; i < this.length; i++) {
            var seg = segments[i];
            var segNext = segments[(i + 1)];
            var result = seg.distanceLine(segNext);
            seg.p1 = result.closests[0];
            segNext.p0 = result.closests[1];
        }
        for (var i = 0; i < this.length; i++) {
            var seg = segments[i];
        }
        return new Polygon();
    };
    Polygon.prototype.containPoint = function (point) {
    };
    return Polygon;
}(Polyline_1.Polyline));
exports.Polygon = Polygon;
