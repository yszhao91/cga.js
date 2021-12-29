/*
 * @Description  : 挤压相关方法
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2020-12-10 15:01:42
 * @LastEditTime : 2021-09-14 10:07:25
 * @FilePath     : \cesium-taji-dabaod:\github\cga.js\src\alg\extrude.ts
 */

import { Vec3, v3, IVec3, IVec2 } from '../math/Vec3';
import { Vec2 } from '../math/Vec2';
import { quat, Quat } from '../math/Quat';
import { Path } from '../struct/3d/Path';
import { clone, rotateByUnitVectors, angle } from './common';
import { applyMat4, translate } from './pointset';
import { indexable } from '../render/mesh';
import { AxisPlane, triangulation } from './trianglution';
import { flat, unique } from '../utils/array';
import { isDefined, isUndefined } from '../utils/types';
import { m4 } from '../math/Mat4';
import { IGeometry } from '../render/geometry';
import { RADIANS_PER_DEGREE } from '../math/Math';
import vector from '../math/vector';
import { ArrayList } from '../struct/data/ArrayList';
import { Distance } from '../basic/distance';

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

    var triangles: number[] = [];

    if (side0[0] instanceof Number) {
        //索引三角形
        for (var i = 0; i < length; i++) {
            var v00 = side0[i];
            var v01 = side0[(i + 1) % orgLen];
            var v10 = side1[i];
            var v11 = side1[(i + 1) % orgLen];

            triangles.push(v00);
            triangles.push(v01);
            triangles.push(v11);

            triangles.push(v00);
            triangles.push(v11);
            triangles.push(v10);
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
                triangles.push(v01.index);
                triangles.push(v11.index);

                triangles.push(v00.index);
                triangles.push(v11.index);
                triangles.push(v10.index);
            }
        } else {
            //三角形顶点
            for (var i = 0; i < length; i++) {
                var v00 = side0[i];
                var v01 = side0[(i + 1) % orgLen];
                var v10 = side1[i];
                var v11 = side1[(i + 1) % orgLen];

                triangles.push(v00);
                triangles.push(v01);
                triangles.push(v11);

                triangles.push(v00);
                triangles.push(v11);
                triangles.push(v10);
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
    if (hasHole)
        allVertics.push(holess as any);

    var orgShape = options.orgShape || shapes[0];
    var orgHoles = options.orgHoles || (holess && holess[0]);

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

        var startTris = triangulation(orgShape, orgHoles, { feature: AxisPlane.XYZ });
        if (index) {
            startTris.forEach((v: number, i: number) => {
                startTris[i] = v + index?.index;
            })

            index.index += startShape.length
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
        var endTris = triangulation(orgShape, orgHoles, { feature: AxisPlane.XYZ });
        if (index) {
            endTris.forEach((v: number, i: number) => {
                endTris[i] = v + index?.index;
            })

            index.index += endShape.length
            if (holess && holess[0])
                endHoles.forEach((h: any) => {
                    index.index += h.length
                })
        }
        triangles.push(...endTris);
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

    const positions = vector.verctorToNumbers(allVertics);
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
    enableSmooth?: boolean;
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
const _matrix1 = m4();
const _quat = quat();
const _quat1 = quat();
const _vec1 = v3();
const _vec2 = v3();
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
 *    holes?: Array<Vec3 | IVec3 | Vec2 | IVec2>[] 
 *}
 * @return       {IGeometry} 
 * @example     : 
 *  
 */
export function extrude(options: IExtrudeOptionsEx): IGeometry {
    options = {
        sealEnd: true, sealStart: true, shapeClosed: true, pathClosed: false,
        generateUV: true,
        autoIndex: true,
        axisPlane: AxisPlane.XY,
        up: Vec3.Up,
        smoothAngle: 30 * RADIANS_PER_DEGREE,
        enableSmooth: false,
        ...options
    }

    if (!vector.isCCW(options.shape))
        options.shape.reverse();
    if (options.holes)
        options.holes.forEach((hole) => {
            if (!vector.isCCW(hole))
                hole.reverse();
        })

    const path = new Path(options.path as any);
    const shapes = [];
    let shape: any = options.shape;

    if (options.shapeClosed && !shape[0].equals(shape[shape.length - 1]))
        shape.push(shape[0].clone())

    let shapePath: Path<Vec3> | any = new Path(shape, options.shapeClosed);

    if (options.enableSmooth)
        for (let i = 1; i < shapePath.length; i++) { //大角度插入点 角度过大为了呈现flat shader的效果
            if (shapePath.get(i).direction.dot(shapePath.get((i + 1) % shapePath.length).direction) < Math.cos(options.smoothAngle!)) {
                shapePath.splice(i + 1, 0, shapePath.get(i).clone());
                i++;
            }
        }

    const ups = options.ups || [];
    if (isUndefined(shapePath.first.z)) {
        shapePath.array = shapePath.array.map((e: any) => v3(e.x, e.y, 0));
        options.normal = options.normal || Vec3.UnitZ;
    }

    var up: Vec3 = options.up as Vec3;
    var right: Vec3 = options.right as Vec3;
    var newholes = [];

    for (let i = 0; i < options.path.length; i++) {
        const point = path.get(i);
        const direction = (point as any).direction;
        let upi: any;

        upi = ups[i] || up || v3().crossVecs(right, direction);
        let righti = right;
        if (!right)
            righti = v3().crossVecs(upi, direction).normalize();

        _matrix.makeBasis(righti, upi, direction);
        _matrix.setPosition(point);

        var new_shape = shapePath.clone();
        new_shape.applyMat4(_matrix);
        shapes.push(new_shape);

        if (options.holes) {
            const mholes = applyMat4(options.holes, _matrix, false);
            newholes.push(mholes);
        }
    }
    const geo: IGeometry = linkSides({
        shapes: shapes.map(e => e._array),
        holes: newholes,
        orgShape: shapePath._array,
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
export function extrude_obsolete<T extends Vec3>(shape: ArrayList<T>, arg_path: Array<Vec3> | any, options: IExtrudeOptions = defaultExtrudeOption) {
    options = {
        ...defaultExtrudeOption,
        ...options
    }
    if (arg_path.length < 2) { throw ("路径节点数必须大于2") }

    var isCCW = vector.isCCW(shape);
    if (!isCCW)
        shape.reverse();

    var normal = options.normal;

    var startSeal = clone(shape);
    var shapepath = new Path(shape as any);
    var insertNum = 0;
    for (let i = 1; i < shapepath.length - 1; i++) { //大角度插入点 角度过大为了呈现flat shader的效果
        if (Math.acos(shapepath.get(i).tangent.dot(shapepath.get(i + 1).tangent)) > options.smoothAngle!)
            shape.splice(i + insertNum++, 0, shapepath.get(i).clone());
    }

    if (options.shapeClosed) {
        var dir1 = shapepath.get(-1).clone().sub(shapepath.get(-2)).normalize();
        var dir2 = shapepath.get(0).clone().sub(shapepath.get(-1)).normalize();
        if (Math.acos(dir1.dot(dir2)) > options.smoothAngle!)
            shape.push((<any>shape).get(-1).clone());

        //新加起始点纹理拉伸
        shape.unshift(shape.first.clone());
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
    var { index } = linkSides({ shapes: shapeArray, shapeClosed: options.shapeClosed, pathClosed: options.isClosed2, orgShape: shape as any });
    shapepath = new Path(shape as any);
    var uvs = [];

    for (let i = 0; i < path.length; i++) {
        for (let j = 0; j < shapepath.length; j++) {
            uvs.push(shapepath.get(j).tlen * options.textureScale!.x, path.get(i).tlen * options.textureScale!.y);
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



export enum JoinType {
    Square = 0,
    Round,
    Miter,
    Bevel = 0,
}
export enum EndType {
    Square,
    Round,
    Butt,
    etClosedLine,
    etClosedPolygon,
    etOpenButt,
    etOpenSquare
}


export interface IExtrudeOptionsNext {
    shape: Array<Vec3>;//shape默认的矩阵为正交矩阵
    path: Array<Vec3 | IVec3>;
    up?: Array<Vec3 | IVec3> | Vec3 | IVec3;
    right?: Array<Vec3> | Vec3;
    shapeClosed?: boolean;//闭合为多边形 界面
    pathClosed?: boolean;//首尾闭合为圈
    textureEnable?: boolean;
    shapeCenter?: Vec3; //shape的中心点  模型是零点
    smoothAngle?: number;
    enableSmooth?: boolean;
    sealStart?: boolean;
    sealEnd?: boolean;
    normal?: Vec3,
    autoIndex?: boolean,
    axisPlane?: AxisPlane,
    generateUV?: boolean,
    index?: { index: number },
    holes?: Array<Vec3 | IVec3 | Vec2 | IVec2>[]
    jtType?: JoinType;
    etType?: EndType
    bevelSize?: any;
}


/**
 * 将路径看做挤压操作中心
 *  
 * @param shape 
 * @param followPath 
 * @param options 
 */
export function extrudeNext(options: IExtrudeOptionsNext) {
    options = {
        sealEnd: true, sealStart: true, shapeClosed: true, pathClosed: false,
        generateUV: true,
        autoIndex: true,
        axisPlane: AxisPlane.XY,
        smoothAngle: 30 * RADIANS_PER_DEGREE,
        enableSmooth: false,
        ...options
    }

    const path = options.shapeCenter ? translate(options.path, options.shapeCenter!, false) : options.path;
    const shape = options.shape;
    unique(path, (a, b) => a.equals(b));
    unique(shape, (a, b) => a.equals(b));

    const pathPath: Path<Vec3> = new Path(path, options.pathClosed, true);

    const starti = options.shapeClosed ? 0 : 1;

    let shapePath: Path<Vec3> | any = new Path(shape, options.shapeClosed);

    if (options.enableSmooth)
        for (let i = 1; i < shapePath.length; i++) { //大角度插入点 角度过大为了呈现flat shader的效果
            if (shapePath.get(i).direction.dot(shapePath.get((i + 1) % shapePath.length).direction) < options.smoothAngle!) {
                shapePath.splice(i + 1, 0, shapePath.get(i).clone());
                i++;
            }
        }

    options.normal = options.normal || Vec3.UnitZ;
    if (isUndefined(shapePath.first.z)) {
        shapePath.array = shapePath.array.map((e: any) => v3(e.x, e.y, 0));
    }

    var up = options.up;
    var right = options.right;

    const shapes = [], newholes: any = [];
    const accMat = m4();
    /**
     * 如果路径闭合  要考虑首尾shape矩阵变化后还能一致吻合
     */
    switch (options.jtType) {
        case JoinType.Square: //切角

            break;
        case JoinType.Round://圆角
            /**
             * 原理，计算所有交点处的平分面， 
             * 两条相接不共线的的线段可以确定一个平面，平面法线与
             */
            for (let i = 0; i < pathPath.length; i++) {
                const p: Vec3 = pathPath.get(i);
                const pLast: Vec3 = pathPath.get(i - 1);
                const pNext: Vec3 = pathPath.get(i + 1);

                const dir: Vec3 = (p as any).direction;
                //两个外向
                const bdir: Vec3 = (p as any).bdirection;
                const bnormal: Vec3 = (p as any).bnormal;
                const normal: Vec3 = (p as any).normal;

                //相邻两个向量发生的旋转
                if (i === 0) {
                    _quat.setFromUnitVecs(Vec3.UnitZ, dir);
                }
                else { _quat.setFromUnitVecs(pathPath.get(i - 1).direction, dir); }

                let new_shape: Path<Vec3> = shapePath.clone();

                //旋转 
                _quat.setFromUnitVecs(dir, bdir);
                _matrix.makeRotationFromQuat(_quat);
                _matrix.multiply(accMat);


                //位置
                _matrix.setPosition(p);
                new_shape.applyMat4(_matrix);

                // 找出最近一个点  绕此点旋转 
                let min = Infinity;
                let anchor = 0;
                for (let i = 0; i < new_shape.array.length; i++) {
                    const p = new_shape.get(i);
                    let tdot = bdir.dot(_vec1.copy(p).sub(new_shape.get(0)));
                    if (tdot < min) {
                        min = tdot;
                        anchor = i;
                    }
                }
                const minPoint = new_shape.get(anchor);

                //找出距离连个线段最近的点
                // 垂直的两个点  这两个点与
                if (i !== 0 && i !== pathPath.length - 1) {
                    const P0 = Distance.Point2Line_Vec3(minPoint, pLast, _vec1.copy(p).sub(pLast).normalize());
                    const P1 = Distance.Point2Line_Vec3(minPoint, p, _vec1.copy(pNext).sub(p).normalize());

                    _vec1.copy(P0).sub(minPoint);
                    _vec2.copy(P1).sub(minPoint);

                    const angle = _vec1.angleTo(_vec2, normal);

                    const seg = Math.ceil(angle / 0.1);
                    const perAngle = angle / seg;

                    for (let i = 0; i <= seg; i++) {
                        const cAngle = i * perAngle;

                        for (let j = 0; j < new_shape.length; j++) {
                            const np = new_shape.get(j);
                            const v = new Vec3().slerpVecs(_vec1, _vec2, cAngle);
                            const t = np.clone().sub(minPoint);

                        }

                    }

                    // if (options.holes) {
                    //     const mholes = applyMat4(options.holes, _matrix1, false);
                    //     applyMat4(mholes, _matrix, true);
                    //     newholes.push(mholes);
                    // } 
                }

                shapes.push(new_shape);

            }

            break;



        case JoinType.Miter://直角
            for (let i = 0; i < pathPath.length; i++) {
                const p: Vec3 = pathPath.get(i);
                const dir: Vec3 = (p as any).direction;
                const bdir: Vec3 = (p as any).bdirection;
                const bnormal: Vec3 = (p as any).bnormal;
                const normal: Vec3 = (p as any).normal;

                //相邻两个向量发生的旋转
                if (i === 0) {
                    _quat.setFromUnitVecs(Vec3.UnitZ, dir);
                }
                else { _quat.setFromUnitVecs(pathPath.get(i - 1).direction, dir); }

                let new_shape: Path<Vec3> = shapePath.clone();

                //旋转
                _matrix.makeRotationFromQuat(_quat);
                accMat.premultiply(_matrix);


                _quat.setFromUnitVecs(dir, bdir);
                _matrix.makeRotationFromQuat(_quat);
                _matrix.multiply(accMat);

                // /旋转到原地缩放----开始-----------------------
                let cosA = dir.dot(bdir);
                const shear = 1 / cosA;

                _vec1.crossVecs(normal, bdir);

                _matrix1.copy(_matrix);
                _matrix1.invert();
                _vec1.applyMat4(_matrix1);

                _quat.setFromUnitVecs(_vec1, Vec3.Up)
                _matrix1.makeRotationFromQuat(_quat);
                new_shape.applyMat4(_matrix1);
                new_shape.scale(1, shear, 1);
                new_shape.applyMat4(_matrix1.invert());
                // /旋转到原地缩放----结束-----------------------

                //位置
                _matrix.setPosition(p);
                new_shape.applyMat4(_matrix);

                // if (options.holes) {
                //     const mholes = applyMat4(options.holes, _matrix1, false);
                //     applyMat4(mholes, _matrix, true);
                //     newholes.push(mholes);
                // }  

                shapes.push(new_shape);
            }
            break;

        default:
            break;
    }

    const geo: IGeometry = linkSides({
        shapes: shapes.map((e: Path<Vec3>) => e.array),
        holes: newholes,
        orgShape: shapePath._array,
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
