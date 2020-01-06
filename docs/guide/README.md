# 介绍

cga 计算库基于 JavaScript，主要用于（**web 图形**）场景的几何计算，通常包含几何体之间的关系包含,距离,平行,相交等....

- **距离**

计算几何体之间的距离，返回结果包含了距离的最近点

- **相交**

判断物体相交，并包含相交的信息

- **其他**

平行，偏移，共面...

::: tip TIP
需要几何计算都可以使用本库
:::

## 安装

- npm 安装

```sh
npm install xtorcga
#国内镜像
cnpm install xtorcga
```

<!-- - yarn 安装

```sh
yarn add @jiaminghi/data-view
``` -->

## 使用

```js
// 全部引用
import * as cga from "xtorcga";
```

## 按需引入

按需引入仅支持基于**ES module**的**tree shaking**，按需引入示例如下：

```js
import { Point, Segment } from "xtorcga";
```

## UMD 版

`UMD`版可直接使用`script`标签引入，`UMD`版文件下载请移步[UMD](https://github.com/yszhao91/xtorcga/tree/master/build)， 直接引入使用

```html
<script src="./build/cga.js" />
```

<fold-box title="点击以展示/隐藏UMD版使用示例">
<!-- <<< @/docs/guide/umdExample.html -->
</fold-box>
