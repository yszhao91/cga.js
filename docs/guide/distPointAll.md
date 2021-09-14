# 点与其他几何体的距离

3D 点是有 x,y,z 三个坐标组成，类名 Point，

## 三维向量点

```js
import * as cga from "@xtor/cga.js";
function randomV3() {
  return cga.Vec3(
    Math.random() * 100 - 50,
    Math.random() * 100,
    Math.random() * 100 - 50
  );
}
```

## 点与点的距离

计算点到点的距离

<div></div>
<ClientOnly>
<distance geo0 = "Vec3" geo1 = "Vec3"></distance> 
</ClientOnly>

```javascript
import * as cga from "@xtor/cga.js";
var point0 = new cga.Vec3().copy(randomV3());
var point1 = new cga.Vec3().copy(randomV3());
var result = point0.distancePoint(point1);
```

## 点到直线的距离

计算点到直线的距离

<div></div>
<ClientOnly>
<distance geo0 = "Vec3" geo1 = "Line"></distance> 
</ClientOnly>

```javascript
import * as cga from "@xtor/cga.js";
var point = new cga.Vec3().copy(randomV3());
var line = new cga.Line(randomV3(), randomV3());
var result = point.distanceTo(line);
```

## 点到射线的距离

<div></div>
<ClientOnly>
<distance geo0 = "Vec3" geo1 = "Ray"></distance> 
</ClientOnly>

```javascript
import * as cga from "@xtor/cga.js";
var point = new cga.Vec3().copy(randomV3());
var ray = new cga.Ray(randomV3(), randomV3().normalize());
var result = point.distanceRay(ray);
```

## 点到线段的距离

<div></div>
<ClientOnly>
<distance geo0 = "Vec3" geo1 = "Segment"></distance> 
</ClientOnly>

```javascript
import * as cga from "@xtor/cga.js";
var point = new cga.Vec3().copy(randomV3());
var seg = new cga.Segment(randomV3(), randomV3());
var result = point.distanceSegment(seg);
```

## 点到折线的距离

<div></div>
<ClientOnly>
<distance geo0 = "Vec3" geo1 = "Polyline"></distance> 
</ClientOnly>

```javascript
import * as cga from "@xtor/cga.js";
var vs = [];
for (let i = 0; i < 100000; i++) {
  vs.push(randomV3());
}
var point = new cga.Vec3().copy(randomV3());
var polyline = new cga.Polyline(vs);
console.time("测试法");
var result = point.distancePolyline(polyline);
console.timeEnd("测试法");
// console.time("线性检索");
// var result1 = point.distancePolyLine1(polyline);
// console.timeEnd("线性检索");
//测试法大规模数据要比线性检索快两倍以上
```

## 点到圆圈的距离

<div></div>
<ClientOnly>
<distance geo0 = "Vec3" geo1 = "Circle"></distance> 
</ClientOnly>

```javascript
var point = new cga.Vec3().copy(randomV3());
var circle = new cga.Circle(randomV3(), 5);
var result = point.distanceCircle(circle);
infoPanel.innerText = JSON.stringify(result);
```

## 点与三角形的距离测试

<div></div>
<ClientOnly>
<distance geo0 = "Vec3" geo1 = "Triangle"></distance> 
</ClientOnly>

```javascript
var point = new cga.Vec3().copy(randomV3());
var triangle = new cga.Triangle(randomV3(), randomV3(), randomV3());
var result = point.distanceTriangle(triangle);
infoPanel.innerText = JSON.stringify(result);
```

## 点到圆盘的距离

<div></div>
<ClientOnly>
<distance geo0 = "Vec3" geo1 = "Disk"></distance> 
</ClientOnly>

<!-- <click-to-copy :info="loadingTag" /> -->
