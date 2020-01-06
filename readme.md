# 3D 计算几何算法库(3D Compute Geometry Algorithm)

inspire by Wild Magic

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

- 网页嵌入：直接使用 dist 下面的 cga.js

```html
<script src="./dist/cga.js" />
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

## 已经实现距离算法

√ 表示已经实现

-√ 表示已经实现还未测试

? 表示将会实现

× 表示不存在或者不实现

|     |        |  1  |  2   |  3   |  4   |  5   |  6   |   7    |  8   |  9   |  10  | 11     |
| :-: | :----: | :-: | :--: | :--: | :--: | :--: | :--: | :----: | :--: | :--: | :--: | ------ |
|     |        | 点  | 直线 | 射线 | 线段 | 圆圈 | 平面 | 三角形 | 矩形 | 圆盘 | 球体 | 胶囊体 |
|  1  |   点   |  √  |  √   |  √   |  √   |  -√  |  √   |   √    |  -√  |  -√  |  -√  | -√     |
|  2  |  直线  |  √  |  √   |  √   |  -√  |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  3  |  射线  |  √  |  √   |  √   |  √   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  4  |  线段  |  √  |  -√  |  √   |  √   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  5  |  圆圈  | -√  |  ?   |  ?   |  ?   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  6  |  平面  |  √  |  ?   |  ?   |  ?   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  7  | 三角形 |  √  |  ?   |  ?   |  ?   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  8  |  矩形  | -√  |  ?   |  ?   |  ?   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  9  |  圆盘  | -√  |  ?   |  ?   |  ?   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
| 10  |  球体  | -√  |  ?   |  ?   |  ?   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
| 11  | 胶囊体 | -√  |  ?   |  ?   |  ?   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |

## 参考文章

[计算机几何算法（CGA）专栏 https://zhuanlan.zhihu.com/c_1196384168014368768](https://zhuanlan.zhihu.com/c_1196384168014368768)

## 展望

项目将会不断完善，如果你有好的想好可以提交你的想法。欢迎 star,让项目更进一步

## 讨论

QQ 群：469014839
