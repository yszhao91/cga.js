/*
 * @Description  : 挤压相关方法
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2020-12-10 15:01:42
 * @LastEditTime : 2021-06-28 15:49:21
 * @FilePath     : \cga.js\src\alg\extrude.ts
 */

import { Vec3, v3, IVec3, IVec2 } from '../math/Vec3';
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
import { isDefined, isUndefined } from '../utils/types';
import { m4 } from '../math/Mat4';
import { IGeometry } from '../render/geometry';

export interface ILinkSideOption {
    side0: { x: number, y: number, z: number, index?: number }[] | number[];//可能是点  也可能是索引
    side1: { x: number, y: number, z: number, index?: number }[] | number[];
    holes0?: Array<Array<Vec3>>;
    holes1?: Array<Array<Vec3>>;
    shapeClosed?: boolean;
    autoUV?: boolean;
    uvScalars?: number[],
    segs?: []
}
/**
 *  常用shape几何操作
 */


/**  
 * @description : 缝合两个边 不提供uv生成  uv有@linkSides 生成
 * @param        { ILinkSideOption } options
 * @returns      { Array<Vec3>} 三角形数组，每三个为一个三角形
 * @example     : 
 */
export function linkSide(options: ILinkSideOption) {
    options = { shapeClosed: true, autoUV: true, ...options };
    const side0: any = options.side0;
    const side1: any = options.side1;
    const shapeClosed = options.shapeClosed;
    if (side0.length !== side1.length)
        throw ("拉伸两边的点数量不一致  linkSide");

    if (side0.length < 2 || side1.length < 2)
        return [];

    var orgLen = side0.length;
    var length = shapeClosed ? side0.length : side0.length - 1;

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
    if (options.holes0 && options.holes1) {
        const holes0 = options.holes0;
        const holes1 = options.holes1;
        for (let h = 0; h < holes0.length; h++) {
            const holeTriangles: any = linkSide({ side0: holes0[h], side1: holes1[h] })
            holeTriangles.reverse();
            triangles.push(...holeTriangles);
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
    shapes: Array<Array<IVec3 | any | IVec3>>;
    orgShape?: Array<IVec3 | any | IVec3>;
    orgHoles?: any;
    sealStart?: boolean,//开始封面
    sealEnd?: boolean;//结束封面
    shapeClosed?: boolean,//shape是否闭合
    pathClosed?: boolean,//路径是否闭合
    index?: { index: number },
    autoIndex?: boolean
    generateUV?: boolean
    axisPlane?: AxisPlane
    holes?: Array<Array<IVec3 | any | IVec3>>[]
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
export function linkSides(options: ILinkSideOptions): IGeometry {
    options = {
        sealEnd: true, sealStart: true, shapeClosed: true, pathClosed: false,
        generateUV: true,
        autoIndex: true,
        axisPlane: AxisPlane.XY,
        ...options
    }

    if (options.autoIndex)
        options.index = options.index || { index: 0 };

    const shapes = options.shapes;
    const holess = options.holes;
    const hasHole: boolean = !!(holess && holess.length > 0);

    var length = options.pathClosed ? shapes.length : shapes.length - 1;
    var triangles: any = [];

    const index = options.index;

    var allVertics = [shapes];
    if (holess && holess.length > 0)
        allVertics.push(holess);

    var orgShape = options.orgShape || shapes[0]
    var orgHoles = options.orgHoles || (holess && holess[0])
    if (index)
        indexable(allVertics, index);

    for (var i = 0; i < length; i++) {
        if (holess)
            triangles.push(...linkSide({ side0: shapes[i], side1: shapes[(i + 1) % shapes.length], holes0: holess[i], holes1: holess[(i + 1) % shapes.length], shapeClosed: options.shapeClosed }));
        else
            triangles.push(...linkSide({ side0: shapes[i], side1: shapes[(i + 1) % shapes.length], shapeClosed: options.shapeClosed }));
    }


    if (options.sealStart) {
        const startShape = clone(shapes[0]);
        allVertics.push(startShape);

        if (holess && holess[0]) {
            var startHoles = clone(holess[0])
            allVertics.push(startHoles)
        }

        var startTris = triangulation(startShape, startHoles, { feature: options.axisPlane });
        if (index) {
            startTris.forEach((v, i) => {
                startTris[i] = v + index?.index;
            })

            index.index += shapes[shapes.length - 2].length
            if (holess && holess[0])
                startHoles.forEach((h: any) => {
                    index.index += h.length
                })
        }
        triangles.push(...startTris.reverse());
    }

    if (options.sealEnd) {
        const endShape = clone(shapes[shapes.length - 1]);
        allVertics.push(endShape);

        if (holess && holess[0]) {
            var endHoles = clone(clone(holess[holess.length - 1]));
            allVertics.push(endHoles)
        }
        var endTris = triangulation(endShape, endHoles, { feature: options.axisPlane });
        if (index) {
            endTris.forEach((v, i) => {
                endTris[i] = v + index?.index;
            })

            index.index += shapes[shapes.length - 1].length
            if (holess && holess[0])
                endHoles.forEach((h: any) => {
                    index.index += h.length
                })
        }
        triangles.push(...endTris.reverse());
    }
    triangles.shapes = allVertics;

    var uvs = []
    if (options.generateUV) {
        //生成UV 
        // let uBasicScalar = new Array(shapes[0].length).fill(0);
        let uBasicScalar = 0;
        for (let i = 0; i < shapes.length; i++) {
            const shape: Vec3[] = shapes[i] as unknown as Vec3[];
            const lastshape: Vec3[] = shapes[i - 1] as unknown as Vec3[];
            if (isNaN(shape[0] as any)) {
                //不是索引才生产纹理，其他都是顶点
                var vScalar = Path.getPerMileages(shape, false);
                var uScalar = 0;
                // if (i > 0)
                //     uScalar = uBasicScalar.map((e, k) => {
                //         return e + shape[k].distanceTo(lastshape[k]);
                //     });
                // else
                //     uScalar = new Array(shapes[0].length).fill(0);

                if (i > 0)
                    uScalar = uBasicScalar + shape[0].distanceTo(lastshape[0]);


                for (let l = 0; l < shape.length; l++) {
                    uvs.push(uScalar, vScalar[l]);
                }
                uBasicScalar = uScalar;

            }
            else
                console.error("索引无法生成纹理")
        }

        if (holess) {
            uBasicScalar = 0;
            for (let i = 0; i < holess.length; i++) {
                const holes = holess[i];
                const lastHole: any = holess[i - 1];
                var uScalar = 0;
                if (i > 0)
                    uScalar = uBasicScalar + holes[0][0].distanceTo(lastHole[0][0]);

                for (let j = 0; j < holes.length; j++) {
                    const hole: any = holes[j];

                    var vScalar = Path.getPerMileages(hole, false);
                    for (let l = 0; l < hole.length; l++) {
                        uvs.push(uScalar, vScalar[l]);
                    }
                }
                uBasicScalar = uScalar;
            }
        }

        //前后纹理
        var sealUvs: any = []
        switch (options.axisPlane) {
            case AxisPlane.XY:
                orgShape.map(e => {
                    sealUvs.push(e.x, e.y)
                })
                if (orgHoles)
                    orgHoles.forEach((h: any) => {
                        h.forEach((e: any) => {
                            sealUvs.push(e.x, e.y)
                        })
                    })
                break;
            case AxisPlane.XZ:
                orgShape.map(e => {
                    sealUvs.push(e.x, e.z)
                })
                if (orgHoles)
                    orgHoles.forEach((h: any) => {
                        h.forEach((e: any) => {
                            sealUvs.push(e.x, e.z)
                        })
                    })
                break;
            case AxisPlane.YZ:
                orgShape.map(e => {
                    sealUvs.push(e.y, e.z)
                })
                if (orgHoles)
                    orgHoles.forEach((h: any) => {
                        h.forEach((e: any) => {
                            sealUvs.push(e.y, e.z)
                        })
                    })
                break;

            default:
                break;
        }

        uvs.push(...sealUvs, ...sealUvs);
    }

    var indices = triangles || [];
    // if (isDefined(shapes[0][0].index)) {
    //     //收集索引
    //     for (let i = 0; i < shapes.length; i++) {
    //         const shape = shapes[i];
    //         for (let j = 0; j < shape.length; j++) {
    //             const v = shape[j];
    //             indices.push(v.index);
    //         }
    //     }
    // }

    const positions = verctorToNumbers(allVertics);
    shapes.pop();
    shapes.pop();

    return { position: positions, index: indices, uv: uvs };
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

const defaultExtrudeOption: IExtrudeOptions = {
    textureEnable: true,
    textureScale: new Vec2(1, 1),
    smoothAngle: Math.PI / 180 * 30,
    sealStart: false,
    sealEnd: false,
    normal: Vec3.UnitZ,
}

export interface IExtrudeOptionsEx {
    shape: Array<Vec3 | IVec3 | Vec2 | IVec2>;//shape默认的矩阵为正交矩阵
    path: Array<Vec3 | IVec3>;
    ups?: Array<Vec3 | IVec3>;
    up?: Vec3 | IVec3;
    right?: Vec3;
    shapeClosed?: boolean;//闭合为多边形 界面
    pathClosed?: boolean;//首尾闭合为圈
    textureEnable?: boolean;
    smoothAngle?: number;
    sealStart?: boolean;
    sealEnd?: boolean;
    normal?: Vec3,
    autoIndex?: boolean,
    axisPlane?: AxisPlane,
    generateUV?: boolean,
    index?: { index: number },
    holes?: Array<Vec3 | IVec3 | Vec2 | IVec2>[]
}

const _matrix = m4();
const _vec1 = v3();
/**
 * @description : 挤压形状生成几何体
 * @param        {IExtrudeOptionsEx} options
 *   IExtrudeOptionsEx {
 *    shape: Array<Vec3 | IVec3 | Vec2 | IVec2>;//shape默认的矩阵为正交矩阵
 *    path: Array<Vec3 | IVec3>;//挤压路径
 *    ups?: Array<Vec3 | IVec3>;
 *    up?: Vec3 | IVec3;
 *    shapeClosed?: boolean;//闭合为多边形 界面
 *    pathClosed?: boolean;//首尾闭合为圈
 *    textureEnable?: boolean;
 *    smoothAngle?: number;
 *    sealStart?: boolean;
 *    sealEnd?: boolean;
 *    normal?: Vec3,//面的法线
 *    autoIndex?: boolean,
 *    index?: { index: number }
 *   holes?: Array<Vec3 | IVec3 | Vec2 | IVec2>[]
 *}
 * @return       {IGeometry} 
 * @example     : 
 *  
 */
export function extrudeEx(options: IExtrudeOptionsEx): IGeometry {
    options = {
        sealEnd: true, sealStart: true, shapeClosed: true, pathClosed: false,
        generateUV: true,
        autoIndex: true,
        axisPlane: AxisPlane.XY, ...options
    }
    const path = new Path(options.path);
    const shapes = [];
    let shape: any = options.shape;
    const ups = options.ups || [];
    if (isUndefined(shape[0].z)) {
        shape = shape.map((e: any) => v3(e.x, e.y, 0));
        options.normal = options.normal || Vec3.UnitZ;

    }

    var up: Vec3 = options.up as Vec3;
    var right: Vec3 = options.right as Vec3;
    var newholes = [];
    for (let i = 0; i < options.path.length; i++) {
        const point = path[i];
        const direction = (point as any).direction;
        const upi = v3().crossVecs(right, direction);

        _matrix.makeBasis(right, upi, direction);
        _matrix.setPosition(point);

        var new_shape = applyMat4(shape, _matrix, false);
        shapes.push(new_shape);

        if (options.holes) {
            const mholes = applyMat4(options.holes, _matrix, false);
            newholes.push(mholes);
        }
    }

    const geo: IGeometry = linkSides({
        shapes,
        holes: newholes,
        orgShape: options.shape,
        orgHoles: options.holes,
        sealStart: options.sealStart,
        sealEnd: options.sealEnd,
        shapeClosed: options.shapeClosed,
        pathClosed: options.pathClosed,
        axisPlane: options.axisPlane,
        autoIndex: options.autoIndex,
        generateUV: options.generateUV,
    })



    return geo;
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

    const gindex = { index: 0 };
    var vertices = flat(shapeArray);
    indexable(vertices, gindex);
    var { index } = linkSides({ shapes: shapeArray, shapeClosed: options.shapeClosed, pathClosed: options.isClosed2, orgShape: shape });
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
        indexable(startSeal, gindex);
    if (options.sealEnd)
        indexable(endSeal, gindex);
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
        index!.push(...sealStartTris);
        for (let i = 0; i < sealUv.length; i++)
            uvs.push(sealUv[i].x, sealUv[i].y);
    }

    if (options.sealEnd) {
        vertices.push(...endSeal);
        sealEndTris.reverse();
        index!.push(...sealEndTris);
        for (let i = 0; i < sealUv.length; i++)
            uvs.push(sealUv[i].x, sealUv[i].y);
    }

    return {
        vertices,
        index,
        uvs
    };

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
