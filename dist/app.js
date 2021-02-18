"use strict";
// // import { Vec3, v3, Quat, Segment } from "./index"
// import { createProgram } from './render/gl';
// // var v = new Vec3();
// // v.add(v3(10, 1230, 12));
// // document.write(v.toString());
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Vec3_1 = require("./math/Vec3");
var glview_1 = require("./glview");
var three_1 = require("three");
var extrude_1 = require("./alg/extrude");
var Math_1 = require("./math/Math");
var common_1 = require("./alg/common");
var mesh_1 = require("./render/mesh");
// var a = Vec3.fromDegrees(-75.62898254394531, 40.02804946899414, 0.0);
// console.log(a);
var glv = new glview_1.GLView({ container: document.body });
glv.run();
// var delaunay = new cga.Delaunay()
// var vs = []
// var data = []
// for (let i = 0; i < 10000; i++) {
//     var x = Math.random() * 1000 - 500
//     var y = Math.random() * 1000 - 500
//     vs.push(new Vec3(x, y, 0));
//     data.push(x, y);
// }
// // // var index = delaunay.triangulation(vs)
// // var delaunator = Delaunay.from(data);
// // // const delaunay1 = Delaunay.from(data);
// // var index = delaunator.triangles;
// // const voronoi = delaunator.voronoi([-520, -520, 520, 520]);
// // var k = -1;
// // var geometry = new Geometry();
// // while (k++ < 10000) {
// //     var vvs: any = voronoi._clip(k);
// //     debugger
// //     for (let i = 0; i < vvs.length; i++) {
// //         const e0 = vvs[i];
// //         const e1 = vvs[(i + 1) % vvs.length];
// //         geometry.vertices.push(new Vector3(e0[0], e0[1], 0));
// //         geometry.vertices.push(new Vector3(e1[0], e1[1], 0));
// //     }
// // }
// // var geo = toGeometryBuffer(vs, index)
// // glv.add(new Mesh(geo, new MeshBasicMaterial({ wireframe: true, side: DoubleSide })));
// // glv.add(new LineSegments(geometry, new LineBasicMaterial({ color: 0xff0000 })));
// // var section = [-1, -1, -1, 1, 1, 1, 1, -1];
// // extrudeNext(section, path, { sectionClosed: true, pathClosed: false, vecdim: 2 })
// var pathx = [v3(-20, 0, 0), v3(-20, 0, 20), v3(20, 0, 20), v3(20, 0, 0)]
// var polyline = new Polyline(pathx);
// polyline.offset(1)
var dizhu = function (bottomR, topR, bh, gh, th) {
    var bq = [];
    var tq = [];
    for (var i = 0; i < 33; i++) {
        var x = Math.cos(Math_1.PI_TWO / 32 * i);
        var z = Math.sin(Math_1.PI_TWO / 32 * i);
        bq.push(Vec3_1.v3(x, 0, z));
    }
    tq = common_1.clone(bq);
    common_1.scale(bq, Vec3_1.v3(bottomR, 1, bottomR));
    var bq1 = common_1.clone(bq);
    common_1.translate(bq1, Vec3_1.v3(0, bh, 0));
    common_1.scale(tq, Vec3_1.v3(topR, 1, topR));
    var tq1 = common_1.clone(tq);
    common_1.translate(tq, Vec3_1.v3(0, bh + gh, 0));
    common_1.translate(tq1, Vec3_1.v3(0, bh + gh + th, 0));
    var sides = [bq, bq1, common_1.clone(bq1), tq, common_1.clone(tq), tq1];
    var index = { index: 0 };
    var triangles = extrude_1.linkSides(sides, true, false, index);
    var sides1 = __spreadArrays(bq, bq1, common_1.clone(bq1), tq, common_1.clone(tq), tq1);
    var geometry = mesh_1.toGeoBuffer(sides1, triangles);
    return geometry;
};
var geometry = dizhu(1.8, 0.9, 0.3, 0.5, 10);
geometry.computeVertexNormals();
var THREE = __importStar(require("three"));
var tgeo = new THREE.BufferGeometry();
tgeo.setAttribute('position', new THREE.Float32BufferAttribute(geometry.getAttribute('position').array, 3));
tgeo.setAttribute('normal', new THREE.Float32BufferAttribute(geometry.getAttribute('normal').array, 3));
tgeo.setAttribute('uv', new THREE.Float32BufferAttribute(geometry.getAttribute('uv').array, 2));
tgeo.setIndex(new THREE.Uint16BufferAttribute(geometry.getIndex().array, 1));
var mesh = new three_1.Mesh(tgeo, new three_1.MeshStandardMaterial({ color: 0xff0000, side: three_1.FrontSide }));
var box = new THREE.BoxBufferGeometry();
glv.add(mesh);
