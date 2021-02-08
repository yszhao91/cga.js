import { Vec3, v3 } from '../math/Vec3';
import { Point } from '../struct/3d/Point';
import { Vec2 } from '../math/Vec2';
import { Polygon } from '../struct/3d/Polygon';
import { Polyline } from '../struct/3d/Polyline';
import { Path } from '../struct/3d/Path';
import { clone, rotateByUnitVectors } from './common';
import { projectOnPlane, translate } from './pointset';
import { indexable } from '../render/mesh';
import { triangulation } from './trianglution';
import { flat } from '../utils/array';
import { recognitionCCW, recognitionPolygonNormal, recognitionPlane } from './recognition';
import { Plane } from '../struct/3d/Plane';
import { linksToGeometry } from '../extends/threeaid';
/**
 *  常用shape几何操作
 */

/**
 * 缝合两个边
 * @param {Array} side0 
 * @param {Array} side1 
 * @param {Boolean} isClosed 
 * @returns {Array<Vec3>} 三角形数组，每三个为一个三角形 
 */
export function linkSide(side0: Vec3[] | any, side1: Vec3[] | any, isClosed: boolean = false) {
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
        if (side0[0].index !== undefined) {
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
 * @param {Boolean} isClosed 每一个shape是否是封闭的界面 默认false
 * @param {Boolean} isClosed 每一个shape是否是封闭的首尾 默认false
 * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
 */
export function linkSides(shapes: Array<Array<Vec3 | Point>>, isClosed = false, isClosed2 = false, index?: { index: number }) {
    var length = isClosed2 ? shapes.length : shapes.length - 1;
    var triangles = [];
    debugger
    if (index)
        indexable(shapes, index)
    for (var i = 0; i < length; i++) {
        triangles.push(...linkSide(shapes[i], shapes[(i + 1) % shapes.length], isClosed));
    }

    return triangles;
}

/**
 * 缝合集合
 * @param sides 圈
 * @param closed1 圈自身是否缝合
 * @param closed2 圈拉伸后首尾是否缝合
 */
export function links(sides: Array<Polygon | Polyline | Array<Vec3 | Point>>, closed1: boolean = false, closed2: boolean = false) {
    closed1 = sides[0] instanceof Polyline ? true : false || closed1;
    return linkSides(sides, closed1, closed2);
}

export interface IExtrudeOptions {
    fixedY?: boolean;
    isClosed?: boolean;//闭合为多边形 界面
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

    if (options.isClosed) {
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
    var triangles = linkSides(shapeArray, options.isClosed, options.isClosed2);
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

    var sealStartTris = triangulation(sealUv, [], { normal });
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

/**
 * 
 * @param shape 
 * @param followPath 
 * @param options 
 */
export function extrudeNext(shape: Polygon | Polyline | Array<Vec3> | Array<number>, followPath: Array<Vec3> | Path, options: IExtrudeNextOptions = defaultExtrudeOption) {

    var shapeAry: Array<Vec3> = [];
    if (!isNaN(shape[0])) {
        //数字数组转向量数据
        var axis = ['x', 'y', 'z'];
        for (let i = 0; i < shape.length; i += options.vecdim!) {
            var pt: any = new Vec3();
            for (let j = 0; j < options.vecdim!; j++) {
                pt[axis[j]] = shape[i + j];
            }
            shapeAry.push(pt);
        }
        shape = shapeAry;
    }

    //截面所在的平面

    if (!recognitionCCW(shape as Vec3[])) {
        //逆时针
        shape.reverse();
    }
    if (!options.normal) {
        //识别法线
        options.normal = recognitionPlane(shape).normal;
    }
    //旋转到xy平面

    if (options.center) {
        //偏移
        translate(shape, options.center)
    }

    const shapepath = new Path(shape);
    let insertNum = 0;
    for (let i = 1; i < shapepath.length - 1; i++) { //大角度插入点 角度过大为了呈现flat shader的效果
        if (Math.acos(shapepath[i].tangent.dot(shapepath[i + 1].tangent)) > options.smoothAngle!)
            shape.splice(i + insertNum++, 0, shapepath[i].clone());
    }

    if (options.sealStart) {

    }

    if (options.sealEnd) {

    }


    //计算截面uv 
    for (let i = 0; i < shape.length; i++) {
        const pt = shape[i];
        pt.u = pt.tlen;

        var linkShapes = [];
        for (let i = 1; i < followPath.length - 1; i++) {
            const node = followPath[i];
            var dir = node.tangent;
            var newShape = clone(shape);

            //节点平分线
            const pnormal = followPath[i + 1].clone().sub(followPath[i]).normalize().add(followPath[i].clone().sub(followPath[i - 1]).normalize()).normalize();
            const jointPlane = Plane.setFromPointNormal(node, pnormal);
            jointPlane.negate();
            var projectDir = v3().subVecs(node, followPath[i - 1]).normalize();

            projectOnPlane(newShape, jointPlane, projectDir);

            linkShapes.push(newShape);
        }

        linksToGeometry(linkShapes);
    }
}
