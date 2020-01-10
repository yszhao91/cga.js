---
sidebarDepth: 2
---

# 线与其他几何体的距离

## 直线到直线的距离

计算直线到直线的距离

<div></div>
<ClientOnly>
<distance geo0 = "Line" geo1 = "Line"></distance> 
</ClientOnly>

```javascript
import * as cga from "xtorcga";
var line0 = new cga.Line(randomV3(), randomV3());
var line1 = new cga.Line(randomV3(), randomV3());
var result = line0.distanceLine(line1);
```

## 直线到射线的距离

计算直线到射线的距离

<div></div>
<ClientOnly>
<distance geo0 = "Line" geo1 = "Ray"></distance> 
</ClientOnly>

```javascript
import * as cga from "xtorcga";
var line1 = new cga.Line(randomV3(), randomV3());
var ray = new cga.Ray(randomV3(), randomV3().normalize());
var result = line.distanceRay(ray);
```

## 直线到线段的距离

计算直线到线段的距离

<div></div>
<ClientOnly>
<distance geo0 = "Line" geo1 = "Segment"></distance> 
</ClientOnly>

```javascript
import * as cga from "xtorcga";
var line1 = new cga.Line(randomV3(), randomV3());
var segment = new cga.Segment(randomV3(), randomV3());
var result = line.distanceSegment(segment);
```

<!-- ## 直线到圆圈的距离

计算直线到线段的距离

<div></div>
<ClientOnly>
<distance geo0 = "Line" geo1 = "Circle"></distance>
</ClientOnly>

```javascript
import * as cga from "xtorcga";
var line1 = new cga.Line(randomV3(), randomV3());
var circle = new cga.Circle(randomV3(), randomV3().normalize(),Math.random()*50)+5);
var result = line.distanceCircle(circle);
``` -->
