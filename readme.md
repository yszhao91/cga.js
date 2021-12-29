# 3D 计算几何算法库(3D Computional Geometry Algorithm)

inspire by Wild Magic
threejs/cga.js 开发交流群：284389784
2020 年 12 月 10 日 开发很久 typescript 全新版本更新 可以根据自己的需要编译成 js 版

## 概要

Computional Geometry Algorithm implement JavaScript,javascript 实现计算机几何算法库，实现比如像距离，相交，包含，偏移，平行垂直判断，正负位置等算法

> **如果你需要计算几何类的算法还没实现，可以 issue 提出，获取 Q 群联系我，优先实现**

## 演示地址

案例：

[文档与演示（国内镜像）网速快](http://dcgraph.gitee.io/cga.js/)

[文档与演示（github）](https://yszhao91.github.io/cga.js/)

- [点与其他元素的距离 http://dcgraph.gitee.io/cga.js/guide/distPointAll.html](http://dcgraph.gitee.io/cga.js/guide/distPointAll.html)
- [线与其他元素的距离 http://dcgraph.gitee.io/cga.js/guide/distLineAll.html](http://dcgraph.gitee.io/cga.js/guide/distLineAll.html)
- [射线与其他元素的距离 http://dcgraph.gitee.io/cga.js/guide/distRayAll.html](http://dcgraph.gitee.io/cga.js/guide/distRayAll.html)
- [线段与其他元素的距离 http://dcgraph.gitee.io/cga.js/guide/distSegmentAll.html](http://dcgraph.gitee.io/cga.js/guide/distSegmentAll.html)
- [常用 https://yszhao91.github.io/cga.js/guide/%E5%B8%B8%E7%94%A8.html](https://yszhao91.github.io/cga.js/guide/%E5%B8%B8%E7%94%A8.html)

## 安装

```
npm install xtorcga -D
国内
cnpm install xtorcga -D
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

- 网页嵌入：直接下载使用 build 目录下面的 xtorcga，包含到项目中

```html
<script src="xtorcga" />
或者
<script src="https://raw.githack.com/yszhao91/xtorcga/master/build/xtorcga" />
<script>
  var point = new cga.Point(1, 2, 3);
  var line = new cga.Line(
    new cga.Vector3(10, 10, 20),
    new cga.Vector3(20, 15, 10)
  );
  var result = point.distanceLine(line);
</script>
```

## 项目编译

```shell
npm run build //js 编译到build目录下生成xtorcga dist目录下生成每个文件的js和.d.ts
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

### 在同一平面点集的凸包

[](./cga/img/点与射线.png)

> 已完成
>
> ![凸包](./docs/.vuepress/public/plane-set-convex.png)
>
> ```js
> var convexHull = new ConvexHull(points, { planeNormal: cga.Vector3.UnitZ });
> var hull = convexHull.hull;
> ```

### delauny 三角网构建

> ```js
> var vs = [];
> var data = [];
> for (let i = 0; i < 10000; i++) {
>   var x = Math.random() * 1000 - 500;
>   var y = Math.random() * 1000 - 500;
>   vs.push(new Vec3(x, y, 0));
>   data.push(x, y);
> }
>
> var delaunator = Delaunator.from(data);
> // 或者
> var delaunator = Delaunator.fromVecs(vs);
> var index = delaunator.triangles; //三角形索引
> ```

### voronoi 图构建

> 完成

### 最近点对问题

点集合中最近找出距离最近的一对点 算法时间 O(nlogn)

> 完成

<!-- **分治法求解**

- 分解
  > 对所有的点按照 x 坐标（或者 y）从小到大排序（排序方法时间复杂度 O(nlogn)O(nlogn)O(nlogn)）。
  > 根据下标进行分割，使得点集分为两个集合。
- 解决
  > 递归的寻找两个集合中的最近点对。
  > 取两个集合最近点对中的最小值 min(disleft，disright) min(dis*{left}， dis*{right}) min(disleft ，disright)。
- 合并
  > 最近距离不一定存在于两个集合中，可能一个点在集合 A，一个点在集合 B，而这两点间距离小于 dis。 -->

### 折线或者路径简化

```js
折线或者路径中过密或者过直的点去除;
(2020 年 1 月 17 增加)
/**
 * 简化点集数组，折线，路径
 * @param {*} points 点集数组，折线，路径 ,继承Array
 * @param {*} maxDistance  简化最大距离 默认值0.1
 * @param {*} maxAngle  简化最大角度 弧度 默认值 Math.PI / 180 * 5
 */
simplifyPointList(points, maxDistance, maxAngle);
```

### 距离

一级目录与二级目录存在相应距离算法关系

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
  - Triangle (2020 年 1 月 17 增加)
- Ray
  - Ray
  - Segment
  - Triangle (2020 年 1 月 17 增加)
- Segment
  - Segment

### 相交

> 相交可以使用距离算法来实现，准确的说距离中的 closets 最近点在 distance 为 0(小于 1e-4，精度可以自定义)的时候也就是交点,parameters 表为 0 或 1 可以判断为端点相交

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

> QQ 群：284389784 by: 贵阳赵耀圣

> 本人 2013 接触从事 webgl/threejs 工作，开发经验 7 年左右，一直以来都想着开源，结交更多志同道合的朋友,可接 threejs 项目

> 其他开源项目 看我的 github 主页 地址：[https://github.com/yszhao91](https://github.com/yszhao91) 欢迎大家 follow star,希望开源能帮到大家

## 吃包子

如果觉得这个项目对你有帮助，可以请我吃个包子

支付宝：

![1640758500266.png](image/readme/1640758500266.png)

微信：

![1640758513361.png](image/readme/1640758513361.png)
