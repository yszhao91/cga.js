import { Mat3 } from './Mat3';
import { Mat4 } from './Mat4';
import { Euler } from './Euler';
import { DistanceResult } from '../alg/result';
import { Line } from '../struct/3d/Line';
import { Ray } from '../struct/3d/Ray';
import { Segment } from '../struct/3d/Segment';
import { Plane } from '../struct/3d/Plane';
import { EventHandler } from '../render/eventhandler';
import { Triangle } from '../struct/3d/Triangle';
import { Capsule } from '../struct/3d/Capsule';
import { Rectangle } from '../struct/3d/Rectangle';
import { Circle } from '../struct/3d/Circle';
import { Disk } from '../struct/3d/Disk';
import { Polyline } from '..';
export declare class Vec3 extends EventHandler {
    private _x;
    private _y;
    private _z;
    x: number;
    y: number;
    z: number;
    constructor(_x?: number, _y?: number, _z?: number);
    static isVec3(v: any): boolean;
    get isVec3(): boolean;
    static get Up(): Vec3;
    static get Down(): Vec3;
    static get UnitX(): Vec3;
    static get UnitY(): Vec3;
    static get UnitZ(): Vec3;
    set(x: number, y: number, z: number): this;
    setScalar(scalar: number): this;
    setComponent(index: number, value: number): this;
    getComponent(index: number): number;
    clone(): Vec3;
    copy(v: Vec3): this;
    add(v: Vec3, w?: Vec3): this;
    addScalar(s: number): this;
    addVecs(a: Vec3, b: Vec3): this;
    addScaledVec(v: Vec3, s: number): this;
    sub(v: Vec3, w?: Vec3): this;
    subScalar(s: number): this;
    subVecs(a: Vec3, b: Vec3): this;
    multiply(v: Vec3, w: Vec3): this;
    multiplyScalar(scalar: number): this;
    multiplyVecs(a: Vec3, b: Vec3): this;
    applyEuler(euler: Euler): this;
    applyAxisAngle(axis: any, angle: any): this;
    applyMat3(m: Mat3): this;
    applyMat4(m: Mat4): this;
    applyQuat(q: {
        x: any;
        y: any;
        z: any;
        w: any;
    }): this;
    project(camera: {
        matrixWorldInverse: any;
        projectionMatrix: any;
    }): this;
    unproject(camera: {
        projectionMatrixInverse: any;
        matrixWorld: any;
    }): this;
    transformDirection(m: {
        elements: any;
    }): this;
    divide(v: Vec3): this;
    divideScalar(scalar: number): this;
    min(v: Vec3): this;
    max(v: Vec3): this;
    clamp(min: Vec3, max: Vec3): this;
    clampScalar(minVal: number, maxVal: number): this;
    clampLength(min: number, max: number): this;
    floor(): this;
    ceil(): this;
    round(): this;
    roundToZero(): this;
    negate(): this;
    dot(v: Vec3): number;
    lengthSq(): number;
    length(): number;
    manhattanLength(): number;
    normalize(robust?: boolean): this;
    setLength(length: any): this;
    lerp(v: Vec3, alpha: number): this;
    lerpVecs(v1: Vec3, v2: any, alpha: any): this;
    cross(v: Vec3, w?: Vec3): this;
    crossVecs(a: Vec3, b: Vec3): this;
    projectOnVec(vec: Vec3): this;
    projectOnPlaneNormal(planeNormal: any): this;
    /**
     * 投影到平面
     * @param plane
     */
    projectOnPlane(plane: Plane): this;
    /**
     * 从指定方向线(斜线，也可能是法线)上投影到平面
     * @param planeNormal
     * @param dir
     */
    projectDirectionOnPlane(plane: Plane, dir: Vec3): this;
    reflect(normal: any): this;
    angleTo(v: Vec3, normal?: Vec3 | any): number;
    angleToEx(v: Vec3, normal: Vec3): number;
    distanceTo(v: any): number;
    distanceToSquared(v: Vec3): number;
    manhattanDistanceTo(v: Vec3): number;
    setFromSpherical(s: {
        radius: number;
        phi: number;
        theta: number;
    }): this;
    setFromSphericalCoords(radius: number, phi: number, theta: number): this;
    setFromCylindrical(c: {
        radius: any;
        theta: any;
        y: any;
    }): this;
    setFromCylindricalCoords(radius: number, theta: number, y: number): this;
    setFromMatrixPosition(m: {
        elements: any;
    }): this;
    setFromMatrixScale(m: any): this;
    setFromMatrixColumn(m: {
        elements: any;
    }, index: number): this;
    equals(v: Vec3): boolean;
    fromArray(array: {
        [x: string]: number;
    }, offset: number | undefined): this;
    toArray(array?: number[], offset?: number): number[];
    fromBufferAttribute(attribute: {
        getX: (arg0: any) => number;
        getY: (arg0: any) => number;
        getZ: (arg0: any) => number;
    }, index: any, offset: undefined): this;
    toFixed(fractionDigits: number | undefined): this;
    distancePoint(point: Vec3): DistanceResult;
    distanceVec3(point: Vec3): DistanceResult;
    /**
     * 点到直线的距离  point distance to Line
     * @param line
     */
    distanceLine(line: Line): DistanceResult;
    /**
   * Test success
   * 到射线的距离
   * @param  {Line} line
   * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
   */
    distanceRay(ray: Ray): DistanceResult;
    /**
    * Test success
    * 到线段的距离
    * @param  {Line} line
    * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
    */
    distanceSegment(segment: Segment): DistanceResult;
    /**
     * 点与线段的距离
     * @param plane
     */
    distancePlane(plane: Plane): DistanceResult;
    /**
     * 点与圆圈的距离
     * @param {*} circle
     * @param {*} disk
     * @returns {} result
     */
    distanceCircle(circle: Circle): DistanceResult;
    /**
    * 点与圆盘的距离
    * @param {*} Disk
    * @returns {} result
    */
    distanceDisk(disk: Disk): DistanceResult;
    /**
     * 点与线段的距离
     * 点与折线的距离 测试排除法，平均比线性检索(暴力法)要快两倍以上
     * @param { Polyline | Vec3[]} polyline
     */
    distancePolyline(polyline: Polyline | Vec3[]): DistanceResult | null;
    /**
     * 点到三角形的距离
     * @param {Triangle} triangle
     */
    distanceTriangle(triangle: Triangle): DistanceResult;
    /**
     * 点到矩形的距离
     * @param  {Rectangle} rectangle
     */
    distanceRectangle(rectangle: Rectangle): DistanceResult;
    /**
    * 点到胶囊的距离
    * @param {Capsule} capsule
    */
    distanceCapsule(capsule: Capsule): DistanceResult;
}
export declare function v3(x?: number, y?: number, z?: number): Vec3;
