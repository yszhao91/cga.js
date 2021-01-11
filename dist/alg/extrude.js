"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extrudeNext = exports.EndType = exports.JoinType = exports.isCCW = exports.extrude = exports.links = exports.linkSides = exports.linkSide = void 0;
var Vec3_1 = require("../math/Vec3");
var Vec2_1 = require("../math/Vec2");
var Polyline_1 = require("../struct/3d/Polyline");
var Path_1 = require("../struct/3d/Path");
var common_1 = require("./common");
var pointset_1 = require("./pointset");
var mesh_1 = require("../render/mesh");
var trianglution_1 = require("./trianglution");
var array_1 = require("../utils/array");
var recognition_1 = require("./recognition");
var Plane_1 = require("../struct/3d/Plane");
var threeaid_1 = require("../extends/threeaid");
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
function linkSide(side0, side1, isClosed) {
    if (isClosed === void 0) { isClosed = false; }
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
    }
    else {
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
        }
        else {
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
exports.linkSide = linkSide;
/**
 * 缝合shape集合
 * @param {Array<Array<Point|Vec3>} shapes  路基 点集的集合， 每个shape的点数量一致
 * @param {Boolean} isClosed 每一个shape是否是封闭的圈 默认false
 * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
 */
function linkSides(shapes, isClosed, isClosed2) {
    if (isClosed === void 0) { isClosed = false; }
    if (isClosed2 === void 0) { isClosed2 = false; }
    var length = isClosed2 ? shapes.length : shapes.length - 1;
    var triangles = [];
    for (var i = 0; i < length; i++) {
        triangles.push.apply(triangles, linkSide(shapes[i], shapes[(i + 1) % shapes.length], isClosed));
    }
    return triangles;
}
exports.linkSides = linkSides;
/**
 * 缝合集合
 * @param sides 圈
 * @param closed1 圈自身是否缝合
 * @param closed2 圈拉伸后首尾是否缝合
 */
function links(sides, closed1, closed2) {
    if (closed1 === void 0) { closed1 = false; }
    if (closed2 === void 0) { closed2 = false; }
    closed1 = sides[0] instanceof Polyline_1.Polyline ? true : false || closed1;
    return linkSides(sides, closed1, closed2);
}
exports.links = links;
var defaultExtrudeOption = {
    sectionClosed: false,
    pathClosed: false,
    textureEnable: true,
    textureScale: new Vec2_1.Vec2(1, 1),
    smoothAngle: Math.PI / 180 * 30,
    sealStart: false,
    sealEnd: false,
    normal: Vec3_1.Vec3.UnitZ,
    vecdim: 3,
};
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
function extrude(shape, arg_path, options) {
    if (options === void 0) { options = defaultExtrudeOption; }
    options = __assign(__assign({}, defaultExtrudeOption), options);
    if (arg_path.length < 2) {
        throw ("路径节点数必须大于2");
    }
    var isCCW = recognition_1.recognitionCCW(shape);
    if (!isCCW)
        shape.reverse();
    var normal = options.normal;
    var startSeal = common_1.clone(shape);
    var shapepath = new Path_1.Path(shape);
    var insertNum = 0;
    for (var i = 1; i < shapepath.length - 1; i++) { //大角度插入点 角度过大为了呈现flat shader的效果
        if (Math.acos(shapepath[i].tangent.dot(shapepath[i + 1].tangent)) > options.smoothAngle)
            shape.splice(i + insertNum++, 0, shapepath[i].clone());
    }
    if (options.isClosed) {
        var dir1 = shapepath.get(-1).clone().sub(shapepath.get(-2)).normalize();
        var dir2 = shapepath[0].clone().sub(shapepath.get(-1)).normalize();
        if (Math.acos(dir1.dot(dir2)) > options.smoothAngle)
            shape.push(shape.get(-1).clone());
        //新加起始点纹理拉伸
        shape.unshift(shape[0].clone());
    }
    var path = arg_path;
    if (!(path instanceof Path_1.Path) && path instanceof Array)
        path = new Path_1.Path(arg_path);
    var shapeArray = [];
    for (var i = 0; i < path.length; i++) {
        var node = path[i];
        var dir = node.tangent;
        var newShape = common_1.clone(shape);
        common_1.rotateByUnitVectors(newShape, normal, dir);
        if (options.fixedY) {
            var v = Vec3_1.Vec3.UnitX;
            common_1.rotateByUnitVectors([v], normal, dir);
            var v1 = v.clone();
            v1.y = 0;
            common_1.rotateByUnitVectors(newShape, v, v1);
        }
        pointset_1.translate(newShape, node);
        shapeArray.push(newShape);
    }
    var index = { index: 0 };
    var vertices = array_1.flat(shapeArray);
    mesh_1.indexable(vertices, index);
    var triangles = linkSides(shapeArray, options.isClosed, options.isClosed2);
    shapepath = new Path_1.Path(shape);
    var uvs = [];
    for (var i = 0; i < path.length; i++) {
        for (var j = 0; j < shapepath.length; j++) {
            uvs.push(shapepath[j].tlen * options.textureScale.x, path[i].tlen * options.textureScale.y);
        }
    }
    var sealUv = common_1.clone(startSeal);
    if (normal.dot(Vec3_1.Vec3.UnitZ) < 1 - 1e-4)
        common_1.rotateByUnitVectors(sealUv, normal, Vec3_1.Vec3.UnitZ);
    var endSeal = common_1.clone(startSeal);
    common_1.rotateByUnitVectors(startSeal, normal, path[0].tangent);
    if (options.fixedY) {
        var v = Vec3_1.Vec3.UnitX;
        common_1.rotateByUnitVectors([v], normal, path[0].tangent);
        var v1 = v.clone();
        v1.y = 0;
        common_1.rotateByUnitVectors(startSeal, v, v1);
    }
    pointset_1.translate(startSeal, path[0]);
    common_1.rotateByUnitVectors(endSeal, normal, path.get(-1).tangent);
    if (options.fixedY) {
        var v = Vec3_1.Vec3.UnitX;
        common_1.rotateByUnitVectors([v], normal, path.get(-1).tangent);
        var v1 = v.clone();
        v1.y = 0;
        common_1.rotateByUnitVectors(endSeal, v, v1);
    }
    pointset_1.translate(endSeal, path.get(-1));
    var sealStartTris = trianglution_1.triangulation(sealUv, [], { normal: normal });
    sealStartTris.reverse();
    if (options.sealStart)
        mesh_1.indexable(startSeal, index);
    if (options.sealEnd)
        mesh_1.indexable(endSeal, index);
    var sealEndTris = [];
    var hasVLen = vertices.length;
    if (options.sealStart)
        for (var i = 0; i < sealStartTris.length; i++) {
            sealStartTris[i] += hasVLen;
        }
    if (options.sealEnd && !options.sealStart)
        for (var i = 0; i < sealStartTris.length; i++) {
            sealEndTris[i] = sealStartTris[i] + hasVLen;
        }
    if (options.sealEnd && options.sealStart) {
        for (var i = 0; i < sealStartTris.length; i++) {
            sealEndTris[i] = sealStartTris[i] + startSeal.length;
        }
    }
    if (options.sealStart) {
        vertices.push.apply(vertices, startSeal);
        triangles.push.apply(triangles, sealStartTris);
        for (var i = 0; i < sealUv.length; i++)
            uvs.push(sealUv[i].x, sealUv[i].y);
    }
    if (options.sealEnd) {
        vertices.push.apply(vertices, endSeal);
        sealEndTris.reverse();
        triangles.push.apply(triangles, sealEndTris);
        for (var i = 0; i < sealUv.length; i++)
            uvs.push(sealUv[i].x, sealUv[i].y);
    }
    return {
        vertices: vertices,
        triangles: triangles,
        uvs: uvs
    };
}
exports.extrude = extrude;
/**
 * 是否逆时针
 * counterclockwise
 */
function isCCW(shape) {
    var d = 0;
    for (var i = 0; i < shape.length; i++) {
        var pt = shape[i];
        var ptnext = shape[(i + 1) % shape.length];
        d += -0.5 * (ptnext.y + pt.y) * (ptnext.x - pt.x);
    }
    return d > 0;
}
exports.isCCW = isCCW;
var JoinType;
(function (JoinType) {
    JoinType[JoinType["Bevel"] = 0] = "Bevel";
    JoinType[JoinType["Round"] = 1] = "Round";
    JoinType[JoinType["Miter"] = 2] = "Miter";
})(JoinType = exports.JoinType || (exports.JoinType = {}));
var EndType;
(function (EndType) {
    EndType[EndType["Square"] = 0] = "Square";
    EndType[EndType["Round"] = 1] = "Round";
    EndType[EndType["Butt"] = 2] = "Butt";
})(EndType = exports.EndType || (exports.EndType = {}));
/**
 *
 * @param shape
 * @param followPath
 * @param options
 */
function extrudeNext(shape, followPath, options) {
    if (options === void 0) { options = defaultExtrudeOption; }
    var shapeAry = [];
    if (!isNaN(shape[0])) {
        //数字数组转向量数据
        var axis = ['x', 'y', 'z'];
        for (var i = 0; i < shape.length; i += options.vecdim) {
            var pt = new Vec3_1.Vec3();
            for (var j = 0; j < options.vecdim; j++) {
                pt[axis[j]] = shape[i + j];
            }
            shapeAry.push(pt);
        }
        shape = shapeAry;
    }
    //截面所在的平面
    if (!recognition_1.recognitionCCW(shape)) {
        //逆时针
        shape.reverse();
    }
    if (!options.normal) {
        //识别法线
        options.normal = recognition_1.recognitionPlane(shape).normal;
    }
    //旋转到xy平面
    if (options.center) {
        //偏移
        pointset_1.translate(shape, options.center);
    }
    var shapepath = new Path_1.Path(shape);
    var insertNum = 0;
    for (var i = 1; i < shapepath.length - 1; i++) { //大角度插入点 角度过大为了呈现flat shader的效果
        if (Math.acos(shapepath[i].tangent.dot(shapepath[i + 1].tangent)) > options.smoothAngle)
            shape.splice(i + insertNum++, 0, shapepath[i].clone());
    }
    if (options.sealStart) {
    }
    if (options.sealEnd) {
    }
    //计算截面uv 
    for (var i = 0; i < shape.length; i++) {
        var pt_1 = shape[i];
        pt_1.u = pt_1.tlen;
        var linkShapes = [];
        for (var i_1 = 1; i_1 < followPath.length - 1; i_1++) {
            var node = followPath[i_1];
            var dir = node.tangent;
            var newShape = common_1.clone(shape);
            //节点平分线
            var pnormal = followPath[i_1 + 1].clone().sub(followPath[i_1]).normalize().add(followPath[i_1].clone().sub(followPath[i_1 - 1]).normalize()).normalize();
            var jointPlane = Plane_1.Plane.setFromPointNormal(node, pnormal);
            jointPlane.negate();
            var projectDir = Vec3_1.v3().subVecs(node, followPath[i_1 - 1]).normalize();
            pointset_1.projectOnPlane(newShape, jointPlane, projectDir);
            linkShapes.push(newShape);
        }
        threeaid_1.linksToGeometry(linkShapes);
    }
}
exports.extrudeNext = extrudeNext;
