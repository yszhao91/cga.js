import "./app.css"
import * as cga from "./";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { Point } from "./struct/3d/Point";
import { BufferGeometry, Geometry, Line, LineDashedMaterial, Float32BufferAttribute, PointsMaterial, Points, LineBasicMaterial, Mesh, WebGLRenderer, PerspectiveCamera, Scene, HemisphereLight, PolarGridHelper, Face3, DoubleSide } from "three";
import { Quaternion } from "./math/Quaternion";
import { v3 } from "./math/Vector3";
import { Polyline } from "./struct/3d/Polyline";
function toDisSeg(obj, opts) {
    var geometry = new Geometry()
    geometry.vertices.push(...obj)
    var material = new LineDashedMaterial({
        color: 0xff0000,
        dashSize: 1,
        gapSize: 1,
        scale: 1, // 比例越大，虚线越密；反之，虚线越疏 
        ...opts
    });
    // debugger
    // Line.computeLineDistances(geometry);//
    var line = new Line(geometry, material);
    line.computeLineDistances();
    return line;
}

function toMesh(obj, opts) {
    var renderObj = null;
    if (obj instanceof cga.Point || obj.isVector3) {
        var geometry = new BufferGeometry()
        geometry.setAttribute('position', new Float32BufferAttribute([obj.x, obj.y, obj.z], 3));
        var material = new PointsMaterial({ size: 5, sizeAttenuation: false, color: 0x0ff0f0, alphaTest: 0.9, transparent: true });
        renderObj = new Points(geometry, material);

    } else if (obj instanceof cga.Line) {
        var geometry = new Geometry()
        var v1 = obj.direction.clone().multiplyScalar(10000).add(obj.origin);
        var v2 = obj.direction.clone().multiplyScalar(-10000).add(obj.origin);
        geometry.vertices.push(v1, v2);
        var material = new LineBasicMaterial({ color: 0xffff8f });
        renderObj = new Line(geometry, material);

    } else if (obj instanceof cga.Ray) {
        var geometry = new Geometry()
        var v1 = obj.direction.clone().multiplyScalar(10000).add(obj.origin);
        geometry.vertices.push(obj.origin, v1);
        var material = new LineBasicMaterial({ color: 0xff8fff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof cga.Segment) {
        var geometry = new Geometry()
        geometry.vertices.push(obj.p0, obj.p1);
        var material = new LineBasicMaterial({ color: 0x8fffff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof cga.Triangle) {
        debugger
        var geometry = new Geometry()
        geometry.vertices = [...obj];
        geometry.faces.push(new Face3(0, 1, 2))
        var material = new MeshBasicMaterial({ color: 0x8f8fff, side: DoubleSide });
        renderObj = new Mesh(geometry, material);
    }

    else if (obj instanceof cga.Polyline) {
        var geometry = new Geometry()
        geometry.vertices.push(...obj);
        var material = new LineBasicMaterial({ color: 0xff8fff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof cga.Polygon) {

    }

    return renderObj;

}


function randomV3() {
    return cga.v3(Math.random() * 100 - 50, Math.random() * 100, Math.random() * 100 - 50);
}


const container = document.body;

var infoPanel = document.createElement("div");
infoPanel.classList.add("info_panel");
document.body.append(infoPanel)

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x222222);
const camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000);
camera.position.set(0, 160, -120);
const control = new OrbitControls(camera, renderer.domElement);
container.append(renderer.domElement);
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    camera.updateMatrix();
})
var scene = new Scene();
scene.add(new HemisphereLight(0xffffff, 0x555555));
// scene.add(new gl.Mesh(new gl.SphereBufferGeometry(1, 30, 30), new gl.MeshStandardMaterial()))
// scene.add(toMesh(new Point(10, 0, 0)))
scene.add(new PolarGridHelper(100, 8, 10, 64, 0x0a9ff0, 0x0af09f))
//---点与直线的距离测试----------------------------------------------------------------
// var point = new cga.Point().copy(randomV3());
// var line = new cga.Line(randomV3(), randomV3());
// var result = point.distanceLine(line);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(point));
// scene.add(toMesh(line));
// scene.add(toDisSeg([point, result.lineClosest]))
//---点与射线的距离测试----------------------------------------------------------------
// var point = new cga.Point().copy(randomV3());
// var ray = new cga.Ray(randomV3(), randomV3().normalize());
// var result = point.distanceRay(ray);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(point));
// scene.add(toMesh(ray));
// scene.add(toDisSeg([point, result.rayClosest]))
// scene.add(toMesh(ray));
//---点与线段的距离测试----------------------------------------------------------------
// var point = new cga.Point().copy(randomV3());
// var seg = new cga.Segment(randomV3(), randomV3());
// var result = point.distanceSegment(seg);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(point));
// scene.add(toMesh(seg));
// scene.add(toDisSeg([point, result.segmentClosest])
//---点与折线的距离测试----------------------------------------------------
// var vs = [];
// for (let i = 0; i < 100000; i++)
// {
//     vs.push(randomV3());
// }
// var point = new cga.Point().copy(randomV3());
// var polyline = new cga.Polyline(vs);
// console.time("测试法")
// var result = point.distancePolyLine(polyline);
// console.timeEnd("测试法")
// console.time("线性检索")
// var result1 = point.distancePolyLine1(polyline);
// console.timeEnd("线性检索")
// infoPanel.innerText = JSON.stringify(result) + "\n" + JSON.stringify(result1);
// scene.add(toMesh(point));
// scene.add(toMesh(polyline));
// scene.add(toDisSeg([point, result.segmentClosest]))
// scene.add(toDisSeg([point, result1.segmentClosest], { color: 0x00ff00 }))

//---点与三角形的距离测试----------------------------------------------------------------
// var point = new cga.Point().copy(randomV3());
// var triangle = new cga.Triangle(randomV3(), randomV3(), randomV3());
// var result = point.distanceTriangle(triangle);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(point));
// scene.add(toMesh(triangle));
// scene.add(toMesh(result.closest));
// scene.add(toDisSeg([point, result.closest]))

//---直线与直线的距离测试----------------------------------------------------------------
// var line = new cga.Line(randomV3(), randomV3());
// var line1 = new cga.Line(randomV3(), randomV3()); debugger
// var result = line.distanceLine(line1);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(line));
// scene.add(toMesh(line1));
// scene.add(toMesh(result.closestPoint[0]));
// scene.add(toMesh(result.closestPoint[1]));
// scene.add(toDisSeg(result.closestPoint))

//---直线与射线的距离测试----------------------------------------------------------------
// var line = new cga.Line(randomV3(), randomV3());
// var ray = new cga.Ray(randomV3(), randomV3().normalize());
// var result = line.distanceRay(ray);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(line));
// scene.add(toMesh(ray));
// scene.add(toMesh(result.closestPoint[0]));
// scene.add(toMesh(result.closestPoint[1]));
// scene.add(toDisSeg(result.closestPoint))
//---直线与射线的距离测试----------------------------------------------------------------
// var ray0 = new cga.Ray(randomV3(), randomV3().normalize());
// var ray1 = new cga.Ray(randomV3(), randomV3().normalize());
// var result = ray0.distanceRay(ray1);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(ray0));
// scene.add(toMesh(ray1));
// scene.add(toMesh(result.closestPoint[0]));
// scene.add(toMesh(result.closestPoint[1]));
// scene.add(toDisSeg(result.closestPoint))

//---直线与射线的距离测试----------------------------------------------------------------
// var ray = new cga.Ray(randomV3(), randomV3().normalize());
// var segment = new cga.Segment(randomV3(), randomV3());
// var result = ray.distanceSegment(segment);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(ray));
// scene.add(toMesh(segment));
// debugger
// scene.add(toMesh(result.closests[0]));
// scene.add(toMesh(result.closests[1]));
// scene.add(toDisSeg(result.closests))
//---线段与线段的距离测试----------------------------------------------------------------
// var seg0 = new cga.Segment(randomV3(), randomV3());
// var seg1 = new cga.Segment(randomV3(), randomV3());
// var result = seg0.distanceSegment(seg1);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(seg0));
// scene.add(toMesh(seg1));
// scene.add(toMesh(result.closest[0]));
// scene.add(toMesh(result.closest[1]));
// scene.add(toDisSeg(result.closest))

//---折线偏移测试----------------------------------------------------------------
var polyline = new Polyline([v3(0, 0, 0), v3(0, 0, 10), v3(2, 0, 20), v3(5, 0, 30), v3(10, 0, 40), v3(17, 0, 50)])
scene.add(toMesh(polyline));
debugger
polyline.offset(2);
// var result = seg0.distanceSegment(seg1);
// infoPanel.innerText = JSON.stringify(result);
// scene.add(toMesh(seg0));
// scene.add(toMesh(seg1));
// scene.add(toMesh(result.closest[0]));
// scene.add(toMesh(result.closest[1]));
// scene.add(toDisSeg(result.closest))

// scene.add(new gl.GridHelper(60, 30))
// scene.add(new gl.AxesHelper(1000))

// scene.add(toMesh(new cga.Line(new cga.Point(0, 10, 0), new cga.Point(3, 10, 20))))
// scene.add(toMesh(new cga.Segment(new cga.Point(10, 10, 0), new cga.Point(3, 0, 20))))
// scene.add(toMesh(new cga.Ray(new cga.Point(0, 10, 0), new cga.v3(1, 1, 1))))
// scene.add(toMesh(new cga.Polyline([new cga.Point(0, 0, 0),
// new cga.v3(1, 0, 1),
// new cga.v3(2, 0, 1),
// new cga.v3(2, 0, 2),
// new cga.v3(3, 0, 2),
// ])))

// scene.add(toMesh(new cga.Triangle(new cga.Point(-1, 0, -1),
//     new cga.v3(-1, 0, -4),
//     new cga.v3(-4, 0, -1)
// )))

var q = new Quaternion();
q.setFromUnitVectors(v3(0, 0, 1), v3(0, 1, 0))
var v = new v3(0, 0, 1);
debugger
v.apply

function render() {
    renderer.render(scene, camera)
}

function animate(params) {
    render()
    requestAnimationFrame(animate)
}

animate();