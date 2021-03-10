/*
 * @Description  : 挤压相关方法
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2020-12-10 15:01:42
 * @LastEditTime : 2021-03-10 18:00:48
 * @FilePath     : \cga.js\src\alg\extrude.ts
 */

import { Vec3, v3, IVec3 } from '../math/Vec3';
import { Vec2 } from '../math/Vec2';
import { Polygon } from '../struct/3d/Polygon';
import { Polyline } from '../struct/3d/Polyline';
import { Path } from '../struct/3d/Path';
import { clone, rotateByUnitVectors, verctorToNumbers } from './common';
import { applyMat4, projectOnPlane, translate } from './pointset';
import { indexable } from '../render/mesh';
import { AxisPlane, triangulation } from './trianglution';
import { flat } from '../utils/array';
import { recognitionCCW, } from './recognition';
import { isDefined } from '../utils/types';
import { m4 } from '../math/Mat4';
import { IGeometry } from '../render/geometry';

export interface ILinkSideOption {
    side0: { x: number, y: number, z: number, index?: number }[] | number[];//可能是点  也可能是索引
    side1: { x: number, y: number, z: number, index?: number }[] | number[];
    shapeClosed?: boolean;
    autoUV?: boolean;
    uvScalars?: number[]
}
/**
 *  常用shape几何操作
 */


/**  
 * @description : 缝合两个边 不提供uv生成  uv有@linkSides 生成
 * @param        { ILinkSideOption } sideOptions
 * @returns      { Array<Vec3>} 三角形数组，每三个为一个三角形
 * @example     : 
 */
export function linkSide(sideOptions: ILinkSideOption) {
    sideOptions = { shapeClosed: true, autoUV: true, ...sideOptions };
    const side0: any = sideOptions.side0;
    const side1: any = sideOptions.side1;
    const isClosed = sideOptions.shapeClosed;
    if (side0.length !== side1.length)
        throw ("拉伸两边的点数量不一致  linkSide");

    if (side0.length < 2 || side1.length < 2)
        return [];

    var sidelength = side0.length;

    var orgLen = side0.length;
    var length = isClosed ? side0.length : side0.length - 1;

    var triangles = [];

    if (side0[0] instanceof Number) {
        //索引三角形
        for (var i = 0; i < length; i++) {
            var v00 = side0[i];
            var v01 = side0[(i + 1) % orgLen];
            var v10 = side1[i];
            var v11 = side1[(i + 1) % orgLen];

            triangles.push(v00);
            triangles.push(v10);
            triangles.push(v11);

            triangles.push(v00);
            triangles.push(v11);
            triangles.push(v01);
        }
    } else {
        if (isDefined(side0[0].index)) {
            //含索引的顶点
            for (var i = 0; i < length; i++) {
                var v00 = side0[i];
                var v01 = side0[(i + 1) % orgLen];
                var v10 = side1[i];
                var v11 = side1[(i + 1) % orgLen];

                triangles.push(v00.index);
                triangles.push(v10.index);
                triangles.push(v11.index);

                triangles.push(v00.index);
                triangles.push(v11.index);
                triangles.push(v01.index);
            }
        } else {
            //三角形顶点
            for (var i = 0; i < length; i++) {
                var v00 = side0[i];
                var v01 = side0[(i + 1) % orgLen];
                var v10 = side1[i];
                var v11 = side1[(i + 1) % orgLen];

                triangles.push(v00);
                triangles.push(v10);
                triangles.push(v11);

                triangles.push(v00);
                triangles.push(v01);
                triangles.push(v11);
            }
        }
    }

    return triangles;
}

/**
 * 缝合shape集合
 * @param {Array<Array<Point|Vec3>} shapes  路基 点集的集合， 每个shape的点数量一致
 * @param {Boolean} sealStart 每一个shape是否是封闭的界面 默认false
 * @param {Boolean} isClosed 每一个shape是否是封闭的界面 默认false 
 * @param {Boolean} isClosed2 每一个shape是否是封闭的首尾 默认false
 * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
 */
export interface ILinkSideOptions {
    shapes: Array<Array<IVec3 | number | any>>;
    sealStart?: boolean,//开始封面
    sealEnd?: boolean;//结束封面
    shapeClosed?: boolean,//shape是否闭合
    pathClosed?: boolean,//路径是否闭合
    index?: { index: number },
    generateUV?: boolean
}

/**
 * @description : 链接多个shape 生成几何体
 * @param        {ILinkSideOptions} optionsILinkSideOptions {
 *   shapes: Array<Array<IVec3 | number | any>>;
 *   sealStart?: boolean,//开始封面
 *   sealEnd?: boolean;//结束封面
 *   shapeClosed?: boolean,//shape是否闭合
 *   pathClosed?: boolean,//路径是否闭合
 *   index?: { index: number },
 *   generateUV?: boolean
 *   }
 *
 * @return       {*}
 * @example     : 
 * 
 */
export function linkSides(options: ILinkSideOptions) {
    options = {
        sealEnd: true, sealStart: true, shapeClosed: true, pathClosed: false,
        generateUV: true,
        ...options
    }
    const shapes = options.shapes;
    var length = options.shapeClosed ? shapes.length : shapes.length - 1;
    var triangles: any = [];

    const index = options.index;

    if (options.sealStart)
        shapes.unshift(clone(shapes[0]));
    if (options.sealEnd)
        shapes.push(clone(shapes[shapes.length - 1]));

    if (index)
        indexable(shapes, index)

    for (var i = 0; i < length; i++) {
        triangles.push(...linkSide({ side0: shapes[i], side1: shapes[(i + 1) % shapes.length], shapeClosed: options.shapeClosed }));
    }

    if (options.sealStart) {
        shapes.push(clone(shapes[0]));
        var startTris = triangulation(shapes[shapes.length - 1], undefined, { feature: AxisPlane.XZ });
        if (index) {
            startTris.forEach((v, i) => {
                startTris[i] = v + index?.index;
            })
            index.index += shapes[shapes.length - 1].length
        }
        triangles.push(...startTris);
    }
    if (options.sealEnd) {
        shapes.push(clone(shapes[shapes.length - 2]));
        var endTris = triangulation(shapes[shapes.length - 1], undefined, { feature: AxisPlane.XZ });
        if (index) {
            endTris.forEach((v, i) => {
                endTris[i] = v + index?.index;
            })
            index.index += shapes[shapes.length - 1].length
        }
        triangles.push(...endTris.reverse());
    }
    triangles.shapes = flat(shapes);

    if (options.generateUV) {
        //生成UV
        const uBasicScalar = new Array(shapes[0].length).fill(0);
        var uvs = []
        for (let i = 0; i < shapes.length; i++) {
            const shape: Vec3[] = shapes[i] as unknown as Vec3[];
            if (isNaN(shape[0] as any)) {
                //不是索引才生产纹理，其他都是顶点
                var vScalar = Path.getPerMileages(shape, false);
                var uScalar
                if (i > 0)
                    uScalar = uBasicScalar.map((e, k) => {
                        return e + shape[k].distanceTo(shapes[i - 1][k]);
                    });
                else
                    uScalar = new Array(shapes.length).fill(0);

                for (let l = 0; l < uBasicScalar.length; l++) {
                    uvs.push(uScalar[l], vScalar[l]);
                }

            }
            else
                console.error("索引无法生成纹理")
        }
        triangles.uv = uvs;
    }

    if (isDefined(shapes[0][0].index)) {
        //收集索引
        var indices = [];
        for (let i = 0; i < shapes.length; i++) {
            const shape = shapes[i];
            for (let j = 0; j < shape.length; j++) {
                const v = shape[j];
                indices.push(v.index);
            }
        }
        triangles.index = indices
    }

    return triangles;
}


export interface IExtrudeOptions {
    fixedY?: boolean;
    shapeClosed?: boolean;//闭合为多边形 界面
    isClosed2?: boolean;//首尾闭合为圈
    textureEnable?: boolean;
    textureScale?: Vec2;
    smoothAngle?: number;
    sealStart?: boolean;
    sealEnd?: boolean;
    normal?: Vec3,
}

const defaultExtrudeOption: IExtrudeNextOptions = {
    sectionClosed: false,
    pathClosed: false,
    textureEnable: true,
    textureScale: new Vec2(1, 1),
    smoothAngle: Math.PI / 180 * 30,
    sealStart: false,
    sealEnd: false,
    normal: Vec3.UnitZ,
    vecdim: 3,
}

export interface IExtrudeOptionsEx {
    shape: Array<Vec3 | IVec3>;//shape默认的矩阵为正交矩阵
    path: Array<Vec3 | IVec3>;
    ups?: Array<Vec3 | IVec3>;
    up?: Vec3 | IVec3;
    shapeClosed?: boolean;//闭合为多边形 界面
    pathClosed?: boolean;//首尾闭合为圈
    textureEnable?: boolean;
    smoothAngle?: number;
    sealStart?: boolean;
    sealEnd?: boolean;
    normal?: Vec3,
}

const _matrix = m4();
const _vec1 = v3();
/**
 * @description : 挤压形状生成几何体
 * @param        {IExtrudeOptionsEx} options
 * @return       {*} 
 * @example     : 
 */
export function extrudeEx(options: IExtrudeOptionsEx): IGeometry {
    const path = new Path(options.path);
    const shapes = [];
    const shape = options.shape;
    const ups = options.ups || [];
    for (let i = 0; i < options.path.length; i++) {
        const point = path[i];
        const direction = (point as any).direction;
        var up: Vec3 = (ups[i] || Vec3.UnitY) as Vec3;
        const binormal = v3().crossVecs(direction, up);

        _matrix.makeBasis(binormal, up, direction);
        _matrix.setPosition(point);

        var new_shape = applyMat4(shape, _matrix, false);
        shapes.push(new_shape);
    }

    const data = linkSides({
        shapes,
        sealStart: options.sealStart,
        sealEnd: options.sealEnd,
        shapeClosed: options.shapeClosed,
        pathClosed: options.pathClosed
    })

    const positions = verctorToNumbers(data);
    const uv = verctorToNumbers(data.uv) || [];

    return {
        position: positions,
        uv: uv,
        index: data.index
    }
}

/**
 * 挤压
 * @param {Polygon|Array<Point|Vec3> }  shape   多边形或顶点数组
 * @param {Path|Array<Point|Vec3> } path  路径或者或顶点数组
 * @param {Object} options {  
 *      isClosed: false,闭合为多边形 界面
 *      isClosed2: false, 闭合为圈
 *      textureEnable: true, 计算纹理坐标
 *      textureScale: new Vec2(1, 1),纹理坐标缩放
 *      smoothAngle: Math.PI / 180 * 30,大于这个角度则不平滑
 *      sealStart: true, 是否密封开始面
 *      sealEnd: true,是否密封结束面}
 */
export function extrude(shape: Polygon | Polyline | Array<Vec3>, arg_path: Array<Vec3> | any, options: IExtrudeOptions = defaultExtrudeOption) {
    options = {
        ...defaultExtrudeOption,
        ...options
    }
    if (arg_path.length < 2) { throw ("路径节点数必须大于2") }

    var isCCW = recognitionCCW(shape);
    if (!isCCW)
        shape.reverse();

    var normal = options.normal;

    var startSeal = clone(shape);
    var shapepath = new Path(shape);
    var insertNum = 0;
    for (let i = 1; i < shapepath.length - 1; i++) { //大角度插入点 角度过大为了呈现flat shader的效果
        if (Math.acos(shapepath[i].tangent.dot(shapepath[i + 1].tangent)) > options.smoothAngle!)
            shape.splice(i + insertNum++, 0, shapepath[i].clone());
    }

    if (options.shapeClosed) {
        var dir1 = shapepath.get(-1).clone().sub(shapepath.get(-2)).normalize();
        var dir2 = shapepath[0].clone().sub(shapepath.get(-1)).normalize();
        if (Math.acos(dir1.dot(dir2)) > options.smoothAngle!)
            shape.push((<any>shape).get(-1).clone());

        //新加起始点纹理拉伸
        shape.unshift(shape[0].clone());
    }


    let path = arg_path;
    if (!(path instanceof Path) && path instanceof Array)
        path = new Path(arg_path);

    const shapeArray = [];


    for (let i = 0; i < path.length; i++) {
        const node = path[i];
        var dir = node.tangent;
        var newShape = clone(shape);
        rotateByUnitVectors(newShape, normal!, dir);
        if (options.fixedY) {
            var v = Vec3.UnitX;
            rotateByUnitVectors([v], normal!, dir);
            var v1 = v.clone();
            v1.y = 0;
            rotateByUnitVectors(newShape, v, v1);
        }
        translate(newShape, node);
        shapeArray.push(newShape);
    }

    const index = { index: 0 };
    var vertices = flat(shapeArray);
    indexable(vertices, index);
    var triangles = linkSides({ shapes: shapeArray, shapeClosed: options.shapeClosed, pathClosed: options.isClosed2 });
    shapepath = new Path(shape);
    var uvs = [];

    for (let i = 0; i < path.length; i++) {
        for (let j = 0; j < shapepath.length; j++) {
            uvs.push(shapepath[j].tlen * options.textureScale!.x, path[i].tlen * options.textureScale!.y);
        }
    }


    var sealUv = clone(startSeal);
    if (normal!.dot(Vec3.UnitZ) < 1 - 1e-4)
        rotateByUnitVectors(sealUv, normal!, Vec3.UnitZ);

    var endSeal = clone(startSeal);
    rotateByUnitVectors(startSeal, normal!, path[0].tangent);
    if (options.fixedY) {
        var v = Vec3.UnitX;
        rotateByUnitVectors([v], normal!, path[0].tangent);
        var v1 = v.clone();
        v1.y = 0;
        rotateByUnitVectors(startSeal, v, v1);
    }
    translate(startSeal, path[0])
    rotateByUnitVectors(endSeal, normal!, path.get(-1).tangent);
    if (options.fixedY) {
        var v = Vec3.UnitX;
        rotateByUnitVectors([v], normal!, path.get(-1).tangent);
        var v1 = v.clone();
        v1.y = 0;
        rotateByUnitVectors(endSeal, v, v1);
    }
    translate(endSeal, path.get(-1));

    var sealStartTris = triangulation(sealUv, [], { normal: normal! });
    sealStartTris.reverse();

    if (options.sealStart)
        indexable(startSeal, index);
    if (options.sealEnd)
        indexable(endSeal, index);
    var sealEndTris = []
    var hasVLen = vertices.length;
    if (options.sealStart)
        for (let i = 0; i < sealStartTris.length; i++) {
            sealStartTris[i] += hasVLen;
        }
    if (options.sealEnd && !options.sealStart)
        for (let i = 0; i < sealStartTris.length; i++) {
            sealEndTris[i] = sealStartTris[i] + hasVLen;
        }
    if (options.sealEnd && options.sealStart) {
        for (let i = 0; i < sealStartTris.length; i++) {
            sealEndTris[i] = sealStartTris[i] + startSeal.length;
        }
    }

    if (options.sealStart) {
        vertices.push(...startSeal);
        triangles.push(...sealStartTris);
        for (let i = 0; i < sealUv.length; i++)
            uvs.push(sealUv[i].x, sealUv[i].y);
    }

    if (options.sealEnd) {
        vertices.push(...endSeal);
        sealEndTris.reverse();
        triangles.push(...sealEndTris);
        for (let i = 0; i < sealUv.length; i++)
            uvs.push(sealUv[i].x, sealUv[i].y);
    }

    return {
        vertices,
        triangles,
        uvs
    };

}


export interface IExtrudeNextOptions {
    sectionClosed?: boolean;//闭合为多边形 界面
    pathClosed?: boolean;//首尾闭合为圈
    textureEnable?: boolean;
    textureScale?: Vec2;
    smoothAngle?: number;
    sealStart?: boolean;//section闭合就考虑是否封前后面
    sealEnd?: boolean;
    normal?: Vec3;
    center?: Vec3;// 沿着路线推进是 始终在路线上，
    smooth?: boolean;//是否拐点平滑
    vecdim?: number;//当圈数据为数字数组，这里是向量的维数
}

/**
 * 是否逆时针
 * counterclockwise
 */
export function isCCW(shape: Polygon | Polyline | Array<Vec3>): boolean {
    let d = 0;
    for (let i = 0; i < shape.length; i++) {
        const pt = shape[i];
        const ptnext = shape[(i + 1) % shape.length];
        d += -0.5 * (ptnext.y + pt.y) * (ptnext.x - pt.x);
    }
    return d > 0;
}

export enum JoinType {
    Bevel,
    Round,
    Miter
}
export enum EndType {
    Square,
    Round,
    Butt
}

// /**
//  * 
//  * @param shape 
//  * @param followPath 
//  * @param options 
//  */
// export function extrudeNext(shape: Polygon | Polyline | Array<Vec3> | Array<number>, followPath: Array<Vec3> | Path, options: IExtrudeNextOptions = defaultExtrudeOption) {

//     var shapeAry: Array<Vec3> = [];
//     if (!isNaN(shape[0])) {
//         //数字数组转向量数据
//         var axis = ['x', 'y', 'z'];
//         for (let i = 0; i < shape.length; i += options.vecdim!) {
//             var pt: any = new Vec3();
//             for (let j = 0; j < options.vecdim!; j++) {
//                 pt[axis[j]] = shape[i + j];
//             }
//             shapeAry.push(pt);
//         }
//         shape = shapeAry;
//     }

//     //截面所在的平面

//     if (!recognitionCCW(shape as Vec3[])) {
//         //逆时针
//         shape.reverse();
//     }
//     if (!options.normal) {
//         //识别法线
//         options.normal = recognitionPlane(shape).normal;
//     }
//     //旋转到xy平面

//     if (options.center) {
//         //偏移
//         translate(shape, options.center)
//     }

//     const shapepath = new Path(shape);
//     let insertNum = 0;
//     for (let i = 1; i < shapepath.length - 1; i++) { //大角度插入点 角度过大为了呈现flat shader的效果
//         if (Math.acos(shapepath[i].tangent.dot(shapepath[i + 1].tangent)) > options.smoothAngle!)
//             shape.splice(i + insertNum++, 0, shapepath[i].clone());
//     }

//     if (options.sealStart) {

//     }

//     if (options.sealEnd) {

//     }


//     //计算截面uv 
//     for (let i = 0; i < shape.length; i++) {
//         const pt = shape[i];
//         pt.u = pt.tlen;

//         var linkShapes = [];
//         for (let i = 1; i < followPath.length - 1; i++) {
//             const node = followPath[i];
//             var dir = node.tangent;
//             var newShape = clone(shape);

//             //节点平分线
//             const pnormal = followPath[i + 1].clone().sub(followPath[i]).normalize().add(followPath[i].clone().sub(followPath[i - 1]).normalize()).normalize();
//             const jointPlane = Plane.setFromPointNormal(node, pnormal);
//             jointPlane.negate();
//             var projectDir = v3().subVecs(node, followPath[i - 1]).normalize();

//             projectOnPlane(newShape, jointPlane, projectDir);

//             linkShapes.push(newShape);
//         }

//         linksToGeometry(linkShapes);
//     }
// }
