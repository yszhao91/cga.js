# 点与其他几何体的距离

3D 点是有 x,y,z 三个坐标组成，类名 Point，

## 三维向量与与点

```js
import * as cga from "xtorcga";
function randomV3() {
  return cga.Vector3(
    Math.random() * 100 - 50,
    Math.random() * 100,
    Math.random() * 100 - 50
  );
}
```

## 点与点的距离

计算点到点的距离

<div class="container" ref="p2p"> 
   <div ref="p2pInfoPPanel" class="info_panel"></div>
</div>

```javascript
import * as cga from "xtorcga";
var point0 = new cga.Point().copy(this.randomV3());
var point1 = new cga.Point().copy(this.randomV3());
var result = point0.distanceTo(point1);
```

## 点到直线的距离

计算点到直线的距离

<div class="container" ref="p2l"> 
   <div ref="p2lInfoPPanel" class="info_panel"></div>
</div>

```javascript
import * as cga from "xtorcga";
var point = new cga.Point().copy(this.randomV3());
var line = new cga.Line(randomV3(), randomV3());
var result = point.distanceTo(line);
```

## 点到射线的距离

<div class="container" ref="p2l"> 
   <div ref="p2lInfoPPanel" class="info_panel"></div>
</div>

```javascript
import * as cga from "xtorcga";
var point = new cga.Point().copy(randomV3());
var ray = new cga.Ray(randomV3(), randomV3().normalize());
var result = point.distanceRay(ray);
```

## 点到线段的距离

<div class="container" ref="p2l"> 
   <div ref="p2lInfoPPanel" class="info_panel"></div>
</div>

```javascript
import * as cga from "xtorcga";
var point = new cga.Point().copy(randomV3());
var seg = new cga.Segment(randomV3(), randomV3());
var result = point.distanceSegment(seg);
```

## 点到折线的距离

<div class="container" ref="p2l"> 
   <div ref="p2lInfoPPanel" class="info_panel"></div>
</div>

```javascript
import * as cga from "xtorcga";
var vs = [];
for (let i = 0; i < 100000; i++) {
  vs.push(randomV3());
}
var point = new cga.Point().copy(randomV3());
var polyline = new cga.PolyLine(vs);
console.time("测试法");
var result = point.distancePolyLine(polyline);
console.timeEnd("测试法");
console.time("线性检索");
var result1 = point.distancePolyLine1(polyline);
console.timeEnd("线性检索");
```

## 点与三角形的距离测试

<div class="container" ref="p2l"> 
   <div ref="p2lInfoPPanel" class="info_panel"></div>
</div>

```javascript
var point = new cga.Point().copy(randomV3());
var triangle = new cga.Triangle(randomV3(), randomV3(), randomV3());
var result = point.distanceTriangle(triangle);
infoPanel.innerText = JSON.stringify(result);
```

<!-- <click-to-copy :info="loadingTag" /> -->

<script>
import * as cga from "../../src/";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { BufferGeometry, Geometry, Line, LineDashedMaterial, Float32BufferAttribute, PointsMaterial, Points, LineBasicMaterial, Mesh, WebGLRenderer, PerspectiveCamera, Scene, HemisphereLight, PolarGridHelper, Face3, DoubleSide,BoxGeometry,MeshNormalMaterial ,AxesHelper } from "three";

export default {
  data () {
    return {

      loadingTag: ``
    }
  },
  methods: {
    initTestScene:function(){
        var point0 = new cga.Point().copy(this.randomV3());
        var point1 = new cga.Point().copy(this.randomV3());
        var result = point0.distanceTo(point1);
        this.$refs.p2pInfoPPanel.innerText = JSON.stringify(result);
        this.scene.add(this.toMesh(point0));
        this.scene.add(this.toMesh(point1));
        this.scene.add(this.toDisSeg([point0, point1]));
        //---点与直线的距离测试--------------------------------------------------------------
var point = new  cga.Point().copy(this.randomV3());
var line = new  cga.Line(this.randomV3(), this.randomV3());
var result = point.distanceLine(line);
this.$refs.p2lInfoPPanel.innerText = JSON.stringify(result);
this.scene.add(this.toMesh(point));
this.scene.add(this.toMesh(line));
this.scene.add(this.toDisSeg([point, result.lineClosest]))
    },
    randomV3:function() {
        return cga.v3(Math.random() * 100 - 50, Math.random() * 100, Math.random() * 100 - 50);
    },
    toDisSeg :function(obj, opts){
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
    },

    toMesh:function(obj, opts) {
    var renderObj = null;
    if (obj instanceof  cga.Point || obj.isVector3) {
        var geometry = new BufferGeometry()
        geometry.setAttribute('position', new Float32BufferAttribute([obj.x, obj.y, obj.z], 3));
        var material = new PointsMaterial({ size: 5, sizeAttenuation: false, color: 0x0ff0f0, alphaTest: 0.9, transparent: true });
        renderObj = new Points(geometry, material);

    } else if (obj instanceof  cga.Line) {
        var geometry = new Geometry()
        var v1 = obj.direction.clone().multiplyScalar(10000).add(obj.origin);
        var v2 = obj.direction.clone().multiplyScalar(-10000).add(obj.origin);
        geometry.vertices.push(v1, v2);
        var material = new LineBasicMaterial({ color: 0xffff8f });
        renderObj = new Line(geometry, material);

    } else if (obj instanceof  cga.Ray) {
        var geometry = new Geometry()
        var v1 = obj.direction.clone().multiplyScalar(10000).add(obj.origin);
        geometry.vertices.push(obj.origin, v1);
        var material = new LineBasicMaterial({ color: 0xff8fff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof  cga.Segment) {
        var geometry = new Geometry()
        geometry.vertices.push(obj.p0, obj.p1);
        var material = new LineBasicMaterial({ color: 0x8fffff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof  cga.Triangle) {
        debugger
        var geometry = new Geometry()
        geometry.vertices = [...obj];
        geometry.faces.push(new Face3(0, 1, 2))
        var material = new MeshBasicMaterial({ color: 0x8f8fff, side: DoubleSide });
        renderObj = new Mesh(geometry, material);
    }

    else if (obj instanceof  cga.PolyLine) {
        var geometry = new Geometry()
        geometry.vertices.push(...obj);
        var material = new LineBasicMaterial({ color: 0xff8fff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof  cga.Polygon) {

    }

    return renderObj;

},

    init: function() {
      let container = this.$refs.p2p;

      this.camera = new  PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.01,
        1000
      );
      this.camera.position.set(0, 200, -120);
      this.scene = new  Scene();
      let geometry = new  BoxGeometry(0.2, 0.2, 0.2);
      let material = new  MeshNormalMaterial();
      this.mesh = new  Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new  WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      container.appendChild(this.renderer.domElement);
      this.scene.add(new PolarGridHelper(100, 8, 10, 64, 0x0a9ff0, 0x0af09f))
      this.scene.add(new AxesHelper(1000))
     //---点与直线的距离测试----------------------------------------------------------------


    //  for(var i=0;i < // get its position relative to the page's viewport
	// 				var rect = this.refs[key].getBoundingClientRect();
	// 				// check if it's offscreen. If so skip it
	// 				if ( rect.bottom < 0 || rect.top > renderer.domElement.clientHeight ||
	// 					 rect.right < 0 || rect.left > renderer.domElement.clientWidth ) {
	// 					return; // it's off screen
	// 				}
	// 				// set the viewport
	// 				var width = rect.right - rect.left;
	// 				var height = rect.bottom - rect.top;
	// 				var left = rect.left;
	// 				var bottom = renderer.domElement.clientHeight - rect.bottom;
	// 				renderer.setViewport( left, bottom, width, height );
	// 				renderer.setScissor( left, bottom, width, height );)

    },
    animate: function() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
      this.renderer1.render(this.scene1, this.camera);
    }
  },
  mounted() {
    this.init();
    this.animate();
    this.initTestScene()
  }
}
</script>

<style lang="css" scoped>
.container {
  position: relative;
  height: 300px;
  background-color: #282c34;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
  color: #fff;
}
.info_panel{
    position: absolute;
    z-index: 9;
    color: aliceblue;
}
</style>

```

```
