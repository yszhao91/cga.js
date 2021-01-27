"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cartographic = void 0;
var Math_1 = require("../math/Math");
var gis_1 = require("./gis");
/**
 * 地图的制图坐标系经纬度以及高度
 */
var Cartographic = /** @class */ (function () {
    function Cartographic(longitude, latitude, height) {
        if (longitude === void 0) { longitude = 0; }
        if (latitude === void 0) { latitude = 0; }
        if (height === void 0) { height = 0; }
        this.longitude = longitude;
        this.latitude = latitude;
        this.height = height;
    }
    Cartographic.prototype.set = function (longitude, latitude, height) {
        if (longitude === void 0) { longitude = 0; }
        if (latitude === void 0) { latitude = 0; }
        if (height === void 0) { height = 0; }
        this.longitude = longitude;
        this.latitude = latitude;
        this.height = height;
    };
    Cartographic.prototype.setFromDegrees = function (longitude, latitude, height) {
        if (longitude === void 0) { longitude = 0; }
        if (latitude === void 0) { latitude = 0; }
        if (height === void 0) { height = 0; }
        this.set(Math_1.toRadians(longitude), Math_1.toRadians(latitude), height);
    };
    Cartographic.prototype.setFromVec3 = function (v, ellipsoid) {
        var oneOverRadii = gis_1.wgs84OneOverRadii;
        var oneOverRadiiSquared = gis_1.wgs84OneOverRadiiSquared;
        var centerToleranceSquared = 0.1;
    };
    return Cartographic;
}());
exports.Cartographic = Cartographic;
