---
title:射线
---

# 射线与其他几何体的距离

## 射线到射线的距离

计算射线到射线的距离

<div></div>
<ClientOnly>
<distance geo0 = "Ray" geo1 = "Ray"></distance> 
</ClientOnly>

```javascript
import * as cga from "xtorcga";
var ray0 = new cga.Ray(randomV3(), randomV3().normalize());
var ray1 = new cga.Ray(randomV3(), randomV3().normalize());
var result = ray0.distanceLine(ray1);
```

## 射线到线段的距离

计算射线到线段的距离

<div></div>
<ClientOnly>
<distance geo0 = "Ray" geo1 = "Segment"></distance> 
</ClientOnly>

```javascript
import * as cga from "xtorcga";
var ray = new cga.Ray(randomV3(), randomV3().normalize());
var segment = new cga.Segment(randomV3(), randomV3());
var result = ray.distanceSegment(segment);
```

## 射线到三角形的距离

计算射线到三角形的距离

<div></div>
<ClientOnly>
<distance geo0 = "Ray" geo1 = "Tringle"></distance> 
</ClientOnly>

```javascript
import * as cga from "xtorcga";
var ray = new cga.Ray(randomV3(), randomV3());
var tringle = new cga.Tringle(randomV3(), randomV3(), randomV3());
var result = ray.distanceTriangle(triangle);
```
