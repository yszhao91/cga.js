// // import { Vec3, v3, Quat, Segment } from "./index"
// import { createProgram } from './render/gl';
// // var v = new Vec3();
// // v.add(v3(10, 1230, 12));
// // document.write(v.toString());

// // var quat = new Quat();

// // document.write(quat.x + "")
// // var segment = new Segment(v3(10, 20, 0), v3(100, 100, 0));
// // const distance = v.distanceSegment(segment);
// // document.write(JSON.stringify(distance))
// const vs = `
// uniform mat4 u,worldViewProjection;
// uniform vec3 u,lightWorldPos;
// uniform mat4 u,world;
// uniform mat4 u,viewInverse;
// uniform mat4 u,worldInverseTranspose;

// attribute vec4 position;
// attribute vec3 normal;
// attribute vec2 texcoord;

// varying vec4 v,position;
// varying vec2 v,texCoord;
// varying vec3 v,normal;
// varying vec3 v,surfaceToLight;
// varying vec3 v,surfaceToView;

// void main() {
//     v,texCoord = texcoord;
//     v,position = u,worldViewProjection * position;
//     v,normal = (u,worldInverseTranspose * vec4(normal, 0)).xyz;
//     v,surfaceToLight = u,lightWorldPos - (u,world * position).xyz;
//     v,surfaceToView = (u,viewInverse[3] - (u,world * position)).xyz;
//     gl,Position = v,position;
// }
// `
// const fs = `
// varying vec4 v,position;
// varying vec2 v,texCoord;
// varying vec3 v,normal;
// varying vec3 v,surfaceToLight;
// varying vec3 v,surfaceToView;

// uniform vec4 u,lightColor;
// uniform vec4 u,ambient;
// uniform sampler2D u,diffuse;
// uniform vec4 u,specular;
// uniform float u,shininess;
// uniform float u,specularFactor;

// vec4 lit(float l, float h, float m) {
//     return vec4(1.0,
//         max(l, 0.0),
//         (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
//         1.0);
// }

// void main() {
//     vec4 diffuseColor = texture2D(u,diffuse, v,texCoord);
//     vec3 a,normal = normalize(v,normal);
//     vec3 surfaceToLight = normalize(v,surfaceToLight);
//     vec3 surfaceToView = normalize(v,surfaceToView);
//     vec3 halfVector = normalize(surfaceToLight + surfaceToView);
//     vec4 litR = lit(dot(a,normal, surfaceToLight),
//         dot(a,normal, halfVector), u,shininess);
//     vec4 outColor = vec4((
//         u,lightColor * (diffuseColor * litR.y + diffuseColor * u,ambient +
//             u,specular * litR.z * u,specularFactor)).rgb,
//         diffuseColor.a);
//     gl,FragColor = outColor;
// }
// `

// const canvas = document.createElement('canvas');
// const renderer: WebGL2RenderingContext | WebGLRenderingContext = canvas.getContext("webgl2") || canvas.getContext("webgl")!;

// const program = createProgram(renderer, { vertexShader: vs, fragmentShader: fs })

// const arrays = {
//     position: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, 1, 1, 1, -1, 1, 1, -1, -1, 1, 1, -1, 1, -1, 1, -1, 1, 1, -1, 1, -1, -1, -1, -1, -1],
//     normal: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1],
//     texcoord: [1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1],
//     indices: [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23],
// };

// function render(time: number) {
//     requestAnimationFrame(render);
// }
// requestAnimationFrame(render)
import * as cga from "./index"
import { Vec3, v3 } from './math/Vec3';
import { GLView } from './glview';
import { recognitionCCW } from './alg/recognition';
import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, DoubleSide, Geometry, Vector3, LineSegments, LineBasicMaterial } from 'three';
import { clone } from './utils/array';
import { toGeometryBuffer } from './extends/threeaid copy';
import { Delaunator } from './alg/delaunator';
// import { Delaunay } from "d3-delaunay";

var glv = new GLView({ container: document.body });


glv.run();


var delaunay = new cga.DelaunaySlow()

var vs = []
var data = []
for (let i = 0; i < 10000; i++) {
    var x = Math.random() * 1000 - 500
    var y = Math.random() * 1000 - 500
    vs.push(new Vec3(x, y, 0));
    data.push([x, y]);
}

// var index = delaunay.triangulation(vs)
// var delaunator = Delaunator.from(data);
// const delaunay1 = Delaunay.from(data);
// var index = delaunay1.triangles;
// const voronoi = delaunay1.voronoi([-520, -520, 520, 520]);

// var k = 0;
// var geometry = new Geometry();
// while (k++ < 10000) {
//     var vvs: any = voronoi.cellPolygon(k);

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