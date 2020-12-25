# 介绍

cga 计算库基于 JavaScript，主要用于（**web 图形**）场景的几何计算，通常包含几何体之间的关系包含,距离,平行,相交等....

> github 地址：[https://github.com/yszhao91/cga.js(主要地址)](https://github.com/yszhao91/cga.js)

> 码云地址：[https://gitee.com/Dcgraph/cga.js](https://gitee.com/Dcgraph/cga.jss)

- **距离**

计算几何体之间的距离，返回结果包含了距离的最近点

已经实现距离算法

√ 表示已经实现

-√ 表示已经实现还未测试

? 表示可能会实现

× 表示不存在或者不实现 相关问问题可能是相交问题

空白 表示对称位置相对应

|     |        |  1  |  2   |  3   |  4   |  5   |  6   |   7    |  8   |  9   |  10  | 11     |
| :-: | :----: | :-: | :--: | :--: | :--: | :--: | :--: | :----: | :--: | :--: | :--: | ------ |
|     |        | 点  | 直线 | 射线 | 线段 | 圆圈 | 平面 | 三角形 | 矩形 | 圆盘 | 球体 | 胶囊体 |
|  1  |   点   |  √  |  √   |  √   |  √   |  √   |  √   |   √    |  -√  |  √   |  -√  | -√     |
|  2  |  直线  |     |  √   |  √   |  √   |  ?   |  x   |   √    |  ?   |  ?   |  ?   | ?      |
|  3  |  射线  |     |      |  √   |  √   |  ?   |  x   |   √    |  ?   |  ?   |  ?   | ?      |
|  4  |  线段  |     |      |      |  √   |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  5  |  圆圈  |     |      |      |      |  ?   |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  6  |  平面  |     |      |      |      |      |  ?   |   ?    |  ?   |  ?   |  ?   | ?      |
|  7  | 三角形 |     |      |      |      |      |      |   ?    |  ?   |  ?   |  ?   | ?      |
|  8  |  矩形  |     |      |      |      |      |      |        |  ?   |  ?   |  ?   | ?      |
|  9  |  圆盘  |     |      |      |      |      |      |        |      |  ?   |  ?   | ?      |
| 10  |  球体  |     |      |      |      |      |      |        |      |      |  ?   | ?      |
| 11  | 胶囊体 |     |      |      |      |      |      |        |      |      |      | ?      |

- **相交**

判断物体相交，并包含相交的信息

- **其他**

平行，偏移，共面...

::: tip 提示建议
需要几何计算都可以使用本库
:::

## 安装

- npm 安装

```sh
npm install @xtor/cga.js -D
#国内镜像
cnpm install @xtor/cga.js -D
```

<!-- - yarn 安装

```sh
yarn add @jiaminghi/data-view
``` -->

## 使用

```js
// 全部引用
import * as cga from "@xtor/cga.js";
```

## 按需引入

按需引入仅支持基于**ES module**的**tree shaking**，按需引入示例如下：

```js
import { Point, Segment } from "@xtor/cga.js";
```

## UMD 版

`UMD`版可直接使用`script`标签引入，`UMD`版文件下载请移步[UMD](https://github.com/yszhao91/@xtor/cga.js/tree/master/build)， 直接引入使用

```html
<script src="./build/cga.js" />
```

<!--
<fold-box title="点击以展示/隐藏UMD版使用示例">
<<< @/docs/guide/umdExample.html
</fold-box> -->
