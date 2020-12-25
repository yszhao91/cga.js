---
sidebarDepth: 2
---

# 线段与其他几何体的距离

## 线段到线段的距离

<div></div>
<ClientOnly>
<distance geo0 = "Segment" geo1 = "Segment"></distance> 
</ClientOnly>

```javascript
import * as cga from "@xtor/cga.js";
var seg0 = new cga.Segment(randomV3(), randomV3());
var seg1 = new cga.Segment(randomV3(), randomV3());
var result = seg0.distanceSegment(seg);
```
