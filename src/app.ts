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
import { Mesh, PlaneBufferGeometry, MeshBasicMaterial, DoubleSide, Vector3, LineSegments, LineBasicMaterial, MeshStandardMaterial, FrontSide, BufferGeometryUtils, WebGLRenderTarget, MeshNormalMaterial, MeshDepthMaterial, DepthTexture, MeshPhongMaterial, CanvasTexture, ShaderMaterial, } from 'three';

import { Delaunator } from './alg/delaunator';
import Delaunay from './alg/delaunay';
import { extrudeEx, linkSides } from './alg/extrude';
import { Polyline } from './struct/3d/Polyline';
import { PI, PI_OVER_TWO, PI_TWO } from "./math/Math";
import { clone, scale, translate } from "./alg/common";
import { BufferGeometry } from "./render/geometry";
import { toGeoBuffer } from "./render/mesh";


// var a = Vec3.fromDegrees(-75.62898254394531, 40.02804946899414, 0.0);
// console.log(a);

var glv = new GLView({ container: document.body });


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


var dizhu = (bottomR: number, topR: number, bh: number, gh: number, th: number) => {
    var bq: cga.Vec3[] = []
    var tq: cga.Vec3[] = []
    for (let i = 0; i < 33; i++) {
        var x = Math.cos(cga.PI_TWO / 32 * i)
        var z = Math.sin(cga.PI_TWO / 32 * i)
        bq.push(cga.v3(x, 0, z));
    }
    tq = cga.clone(bq);

    cga.scale(bq, cga.v3(bottomR, 1, bottomR))
    var bq1 = cga.clone(bq);
    cga.translate(bq1, cga.v3(0, bh, 0))


    cga.scale(tq, cga.v3(topR, 1, topR))
    var tq1 = cga.clone(tq);

    cga.translate(tq, cga.v3(0, bh + gh, 0));
    cga.translate(tq1, cga.v3(0, bh + gh + th, 0));

    var sides = [bq, bq1, cga.clone(bq1), tq, cga.clone(tq), tq1];
    var index = { index: 0 };

    var geo = cga.linkSides({ shapes: sides, index, orgShape: bq });

    var geometry = cga.toGeometryBuffer(geo);
    return geometry;
}

var shape = [v3(-5, 0, 0), v3(5, 0, 0), v3(5, 0, 0), v3(5, 10, 0), v3(5, 10, 0), v3(-5, 10, 0), v3(-5, 10, 0)]

var hole3 = [v3(-4, 5, 0), v3(-1, 5, 0), v3(-1, 5, 0), v3(-4, 9, 0), v3(-4, 9, 0), v3(-4, 5, 0)]
var hole1 = [v3(1, 5, 0), v3(4, 5, 0), v3(4, 5, 0), v3(4, 9, 0), v3(4, 9, 0), v3(1, 9, 0), v3(1, 9, 0), v3(1, 5, 0)]
var hole2 = [v3(-4, 1, 0), v3(4, 1, 0), v3(4, 1, 0), v3(4, 4, 0), v3(4, 4, 0), v3(-4, 4, 0), v3(-4, 4, 0), v3(-4, 1, 0)]

var holes = [hole1, hole2, hole3]

var path = [];
var ia = Math.PI / 100;
for (let i = 0; i <= 100; i++) {
    var x = Math.cos(ia * i) * 50 + 50;
    var y = Math.sin(ia * i) * 50;
    path.push(v3(x, 0, y))
}

var geo = extrudeEx({ shape: shape, holes, path: path, sealStart: true })

// var geo = dizhu(1.8, 0.9, 0.3, 0.5, 10);
var geometry = cga.toGeometryBuffer(geo);
geometry.computeVertexNormals();

import * as THREE from "three"
import { diamondMaterial } from "./diamondMaterialShader";
import { BreathLight } from "./effect/breath-light";
import { Mat4 } from "./math/Mat4";
var tgeo = new THREE.BufferGeometry();
tgeo.setAttribute('position', new THREE.Float32BufferAttribute(geometry.getAttribute('position').array, 3));
tgeo.setAttribute('normal', new THREE.Float32BufferAttribute(geometry.getAttribute('normal').array, 3));
tgeo.setAttribute('uv', new THREE.Float32BufferAttribute(geometry.getAttribute('uv').array, 2));
tgeo.setIndex(new THREE.Uint16BufferAttribute(geometry.getIndex()!.array, 1));

var map = new THREE.TextureLoader().load("./assets/color.jpg");
map.repeat.set(0.4, 0.4)
map.wrapT = map.wrapS = THREE.MirroredRepeatWrapping;
var renderTarget = new WebGLRenderTarget(window.innerWidth, window.innerHeight, { depthTexture: new DepthTexture(window.innerWidth, window.innerHeight) })
var normalMaterial = new MeshNormalMaterial();
var mesh = new Mesh(tgeo, new MeshPhongMaterial({ map: map, side: FrontSide }));
glv.add(mesh);
// var mesh1 = new Mesh(new PlaneBufferGeometry(100, 100), new MeshBasicMaterial({ map: renderTarget.depthTexture, side: DoubleSide }));
// glv.add(mesh1);
// glv.addUpdates(() => {
//     glv.renderer.setRenderTarget(renderTarget);
//     glv.render();
//     glv.renderer.setRenderTarget(null);
// }) 



class LabelTexture {
    width: number;
    height: number;
    sideColor: string;
    areaColor: string;
    canvas: HTMLCanvasElement = document.createElement('canvas');
    ctx: CanvasRenderingContext2D = this.canvas.getContext('2d')!;
    fontsize: number = 100;
    constructor(width: number = 1, height: number = 1, sideColor: string = "#1f9ccf", areaColor: string = "#1f9cff1f") {
        this.width = width;
        this.height = height;
        this.sideColor = sideColor;
        this.areaColor = areaColor
    }

}


glv.add(new BreathLight())
var label = new LabelTexture()

var mesh1 = new Mesh(new PlaneBufferGeometry(100, 10), new MeshBasicMaterial({ map: new CanvasTexture(label.canvas), side: DoubleSide, transparent: true }));
glv.add(mesh1);



var shapeMaterial = new ShaderMaterial({ transparent: true, side: DoubleSide });
var planeGeo = new PlaneBufferGeometry(10, 10);
planeGeo.translate(0, 5, -1)
var mesh = new Mesh(planeGeo, shapeMaterial);

glv.add(mesh)

var m = new Mat4()