# 3D 计算几何算法库(3D Computional Geometry Algorithm)

inspire by Wild Magic

## 概要

Computional Geometry Algorithm implement JavaScript,javascript 实现计算机几何算法库，实现比如像距离，相交，包含，偏移，平行垂直判断，正负位置等算法

> **如果你需要计算几何类的算法还没实现，可以 issue 提出，获取 Q 群联系我，优先实现**

## 演示地址

案例：

[文档与演示（国内镜像）网速快](http://dcgraph.gitee.io/xtorcga/)

[文档与演示（github）](https://yszhao91.github.io/xtorcga/)

- [点与其他元素的距离 http://dcgraph.gitee.io/xtorcga/guide/distPointAll.html](http://dcgraph.gitee.io/xtorcga/guide/distPointAll.html)

- [线与其他元素的距离 http://dcgraph.gitee.io/xtorcga/guide/distLineAll.html](http://dcgraph.gitee.io/xtorcga/guide/distLineAll.html)

- [射线与其他元素的距离 http://dcgraph.gitee.io/xtorcga/guide/distRayAll.html](http://dcgraph.gitee.io/xtorcga/guide/distRayAll.html)

- [线段与其他元素的距离 http://dcgraph.gitee.io/xtorcga/guide/distSegmentAll.html](http://dcgraph.gitee.io/xtorcga/guide/distSegmentAll.html)

## 安装

```
npm install xtorcga -D
```

## 使用

- 全部引用;：

```javascript
import * as cga from "xtorcga";
function randomV3() {
  return cga.v3(
    Math.random() * 100 - 50,
    Math.random() * 100,
    Math.random() * 100 - 50
  );
}

var point = new cga.Point().copy(randomV3());
var seg = new cga.Segment(randomV3(), randomV3());
var result = point.distanceSegment(seg);
```

- 按需求引用：

```javascript
import { v3, Point, Segment } from "xtorcga";
function randomV3() {
  return v3(
    Math.random() * 100 - 50,
    Math.random() * 100,
    Math.random() * 100 - 50
  );
}

var point = new Point().copy(randomV3());
var seg = new Segment(randomV3(), randomV3());
var result = point.distanceSegment(seg);
```

- 网页嵌入：直接下载使用 build 目录下面的 cga.js，包含到项目中

```html
<script src="cga.js" />
<script>
  var point = new CGA.Point(1, 2, 3);
  var line = new CGA.Line(
    new CGA.Vector3(10, 10, 20),
    new CGA.Vector3(20, 15, 10)
  );
  var result = point.distanceLine(line);
</script>
```

## 项目编译

```
npm install
国内
cnpm install

npm run build //编译到dist
npm run dev  //运行项目，自己更改源码测试
```

## 对象的类名

1. 点：**Point**
2. 直线：**Line**
3. 射线：**Ray**
4. 线段：**Segment**
5. 圆圈：**Circle**
6. 平面：**Plane**
7. 三角形：**Triangle**
8. 矩形：**Rectangle**
9. 圆盘：**Disk**
10. 球体：**Sphere**
11. 胶囊体： **Capsule**
12. 包围盒：**Box**

## 已经实现算法

一级目录与二级目录存在相应算法关系

### 距离

- Point
  - Point
  - Line
  - Ray
  - Segment
  - Circle
  - Plane
  - Triangle
  - Rectangle
  - Disk
  - Sphere
  - Capsule
- Line
  - Line
  - Ray
  - Segment
- Ray
  - Ray
  - Segment
- Segment
  - Segment

### 相交

### 偏移

- Segment

### 切割

- Segment
  - Segment
- Plane
  - Segment
  - Triangle

## 参考文章

[计算机几何算法（CGA）专栏 https://zhuanlan.zhihu.com/c_1196384168014368768](https://zhuanlan.zhihu.com/c_1196384168014368768)

## 展望

项目将会不断完善，如果你有好的想好可以提交你的想法。欢迎 star,让项目更进一步

## 讨论

QQ 群：469014839
