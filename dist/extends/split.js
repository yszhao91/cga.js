"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.splitPlaneGeometry = void 0;
var Vec3_1 = require("../math/Vec3");
function splitPlaneGeometry(plane, geometry) {
    for (var i = 0; i < geometry.faces.length; i++) {
        var face = geometry.faces[i];
        var a = geometry.vertices[face.a];
        var b = geometry.vertices[face.b];
        var c = geometry.vertices[face.c];
        var splitres = plane.splitTriangle([a, b, c].map(function (e) { return Vec3_1.v3().copy(e); }));
    }
}
exports.splitPlaneGeometry = splitPlaneGeometry;
