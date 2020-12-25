"use strict";
// // import { Vec3, v3, Quat, Segment } from "./index"
// import { createProgram } from './render/gl';
// // var v = new Vec3();
// // v.add(v3(10, 1230, 12));
// // document.write(v.toString());
Object.defineProperty(exports, "__esModule", { value: true });
var Vec3_1 = require("./math/Vec3");
var glview_1 = require("./glview");
var PolyLine_1 = require("./struct/3d/PolyLine");
var glv = new glview_1.GLView({ container: document.body });
glv.run();
// var delaunay = new cga.Delaunay()
var vs = [];
var data = [];
for (var i = 0; i < 10000; i++) {
    var x = Math.random() * 1000 - 500;
    var y = Math.random() * 1000 - 500;
    vs.push(new Vec3_1.Vec3(x, y, 0));
    data.push(x, y);
}
// // var index = delaunay.triangulation(vs)
// var delaunator = Delaunay.from(data);
// // const delaunay1 = Delaunay.from(data);
// var index = delaunator.triangles;
// const voronoi = delaunator.voronoi([-520, -520, 520, 520]);
// var k = -1;
// var geometry = new Geometry();
// while (k++ < 10000) {
//     var vvs: any = voronoi._clip(k);
//     debugger
//     for (let i = 0; i < vvs.length; i++) {
//         const e0 = vvs[i];
//         const e1 = vvs[(i + 1) % vvs.length];
//         geometry.vertices.push(new Vector3(e0[0], e0[1], 0));
//         geometry.vertices.push(new Vector3(e1[0], e1[1], 0));
//     }
// }
// var geo = toGeometryBuffer(vs, index)
// glv.add(new Mesh(geo, new MeshBasicMaterial({ wireframe: true, side: DoubleSide })));
// glv.add(new LineSegments(geometry, new LineBasicMaterial({ color: 0xff0000 })));
// var section = [-1, -1, -1, 1, 1, 1, 1, -1];
// extrudeNext(section, path, { sectionClosed: true, pathClosed: false, vecdim: 2 })
var pathx = [Vec3_1.v3(-20, 0, 0), Vec3_1.v3(-20, 0, 20), Vec3_1.v3(20, 0, 20), Vec3_1.v3(20, 0, 0)];
var polyline = new PolyLine_1.Polyline(pathx);
polyline.offset(1);
