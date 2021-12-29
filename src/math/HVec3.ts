/*
 * @Description  : arbitrary-precision 任意精度的向量
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-02 16:24:03
 * @LastEditTime : 2021-08-03 11:32:10
 * @FilePath     : \cga.js\src\math\HVec3.ts
 */
import { EventHandler } from '../render/eventhandler';

import Decimal from 'decimal.js';
// import { wgs84RadiiSquared } from '../gis/gis';
export interface IHVec2 {
  x: Decimal;
  y: Decimal;
}
export interface IHVec3 extends IHVec2 {
  z: Decimal;
}
export interface IHVec4 extends IHVec3 {
  w: Decimal;
}

export class HVec3 extends EventHandler implements IHVec3 {
  x: Decimal;
  y: Decimal;
  z: Decimal;
  constructor(private _x: any = 0, private _y: any = 0, private _z: any = 0) {
    super();
    this.x = new Decimal(_x);
    this.y = new Decimal(_x);
    this.z = new Decimal(_x);

  }


  static isVec3(v: any) {
    return !isNaN(v.x) && !isNaN(v.y) && !isNaN(v.z) && isNaN(v.w);
  }


  get isVec3() { return true; }

  static get Up() {
    return new HVec3(0, 1, 0);
  }

  static get Down() {
    return new HVec3(0, 1, 0);
  }

  static get UnitX() {
    return new HVec3(1, 0, 0);
  }
  static get UnitY() {
    return new HVec3(0, 1, 0);
  }
  static get UnitZ() {
    return new HVec3(0, 0, 1);
  }


  set(x: Decimal, y: Decimal, z: Decimal) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  setScalar(scalar: Decimal) {
    this.x = scalar;
    this.y = scalar;
    this.z = scalar;

    return this;
  }

  setComponent(index: number, value: Decimal) {
    switch (index) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      case 2:
        this.z = value;
        break;
      default:
        throw new Error("index is out of range: " + index);
    }

    return this;
  }

  add(v: HVec3, w?: HVec3) {
    if (w !== undefined) {
      console.warn(
        "Vec3: .add() now only accepts one argument. Use .addVecs( a, b ) instead."
      );
      return this.addVecs(v, w);
    }

    this.x.add(v.x);
    this.y.add(v.y);
    this.z.add(v.z);

    return this;
  }


  addVecs(a: HVec3, b: HVec3) {
    this.x = new Decimal(a.x).add(b.x);
    this.y = new Decimal(a.y).add(b.y);
    this.z = new Decimal(a.z).add(b.z);

    return this;
  }


  sub(v: HVec3, w?: HVec3) {
    if (w !== undefined) {
      console.warn(
        "Vec3: .sub() now only accepts one argument. Use .subVecs( a, b ) instead."
      );
      return this.subVecs(v, w);
    }

    this.x.sub(v.x);
    this.y.sub(v.y);
    this.z.sub(v.z);

    return this;
  }


  subVecs(a: HVec3, b: HVec3) {
    this.x = new Decimal(a.x).sub(b.x);
    this.y = new Decimal(a.y).sub(b.y);
    this.z = new Decimal(a.z).sub(b.z);

    return this;
  }


  multiplyScalar(scalar: Decimal | number) {
    scalar = new Decimal(scalar);
    this.x.mul(scalar);
    this.y.mul(scalar);
    this.z.mul(scalar);

    return this;
  }


  cross(v: HVec3, w?: HVec3) {
    if (w !== undefined) {
      console.warn(
        "Vec3: .cross() now only accepts one argument. Use .crossVecs( a, b ) instead."
      );
      return this.crossVecs(v, w);
    }

    return this.crossVecs(this, v);
  }

  crossVecs(a: HVec3, b: HVec3) {
    var ax = a.x,
      ay = a.y,
      az = a.z;
    var bx = b.x,
      by = b.y,
      bz = b.z;

    this.x = ay.mul(bz).sub(az.mul(by));
    this.y = az.mul(bx).sub(ax.mul(bz));
    this.z = ax.mul(by).sub(ay.mul(bx));

    return this;
  }

  dot(v: HVec3) {
    return this.x.mul(v.x).add(this.y.mul(v.y)).add(this.z.mul(v.z));
  }

  lerp(v: HVec3, alpha: number | Decimal) {
    this.x.add(v.x.sub(this.x).mul(alpha));
    this.y.add(v.y.sub(this.y).mul(alpha));
    this.z.add(v.z.sub(this.z).mul(alpha));

    return this;
  }


  clone(): HVec3 {
    return new HVec3(this.x, this.y, this.z);
  }

  length() {
    return this.x.mul(this.x).add(this.y.mul(this.y)).add(this.z.mul(this.z)).sqrt();
  }

  normalize() {
    return this.divideScalar(this.length() || new Decimal(1));

  }

  divideScalar(scalar: number | Decimal) {
    return this.multiplyScalar(new Decimal(1).mul(new Decimal(scalar)));
  }


  //   getComponent(index: number) {
  //     switch (index) {
  //       case 0:
  //         return this.x;
  //       case 1:
  //         return this.y;
  //       case 2:
  //         return this.z;
  //       default:
  //         throw new Error("index is out of range: " + index);
  //     }
  //   }


  //   copy(v: Vec3) {
  //     this.x = v.x;
  //     this.y = v.y;
  //     this.z = v.z;

  //     return this;
  //   }



  //   addScalar(s: number) {
  //     this.x.add(s);
  //     this.y.add(s);
  //     this.z.add(s);

  //     return this;
  //   }


  //   addScaledVec(v: Vec3, s: number) {
  //     this.x.add(v.x.mul(s));
  //     this.y.add(v.y.mul(s));
  //     this.z.add(v.z.mul(s));

  //     return this;
  //   }


  //   multiply(v: Vec3, w?: Vec3) {
  //     if (w !== undefined) {
  //       return this.multiplyVecs(v, w);
  //     }

  //     this.x *= v.x;
  //     this.y *= v.y;
  //     this.z *= v.z;

  //     return this;
  //   }


  //   multiplyVecs(a: Vec3, b: Vec3) {
  //     this.x = a.x * b.x;
  //     this.y = a.y * b.y;
  //     this.z = a.z * b.z;

  //     return this;
  //   }

  //   applyEuler(euler: Euler) {
  //     if (!(euler && euler.isEuler)) {
  //       console.error(
  //         "Vec3: .applyEuler() now expects an Euler rotation rather than a Vec3 and order."
  //       );
  //     }

  //     return this.applyQuat(_quat.setFromEuler(euler));
  //   }

  //   applyAxisAngle(axis: any, angle: any) {
  //     return this.applyQuat(_quat.setFromAxisAngle(axis, angle));
  //   }

  //   applyNormalMat(m: Mat3) {
  //     return this.applyMat3(m).normalize();
  //   }

  //   applyMat3(m: Mat3) {
  //     var x = this.x,
  //       y = this.y,
  //       z = this.z;
  //     var e = m.elements;

  //     this.x = e[0] * x + e[3] * y + e[6] * z;
  //     this.y = e[1] * x + e[4] * y + e[7] * z;
  //     this.z = e[2] * x + e[5] * y + e[8] * z;

  //     return this;
  //   }


  //   applyQuat(q: { x: any; y: any; z: any; w: any; }) {
  //     var x = this.x,
  //       y = this.y,
  //       z = this.z;
  //     var qx = q.x,
  //       qy = q.y,
  //       qz = q.z,
  //       qw = q.w;

  //     // calculate Quat * Vec

  //     var ix = qw * x + qy * z - qz * y;
  //     var iy = qw * y + qz * x - qx * z;
  //     var iz = qw * z + qx * y - qy * x;
  //     var iw = -qx * x - qy * y - qz * z;

  //     // calculate result * inverse Quat

  //     this.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
  //     this.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
  //     this.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

  //     return this;
  //   }

  //   project(camera: { matrixWorldInverse: any; projectionMat: any; }) {
  //     return this.applyMat4(camera.matrixWorldInverse).applyMat4(
  //       camera.projectionMat
  //     );
  //   }

  //   unproject(camera: { projectionMatInverse: any; matrixWorld: any; }) {
  //     return this.applyMat4(camera.projectionMatInverse).applyMat4(
  //       camera.matrixWorld
  //     );
  //   }

  //   transformDirection(m: Mat4) {
  //     // input: Mat4 affine matrix
  //     // Vec interpreted as a direction

  //     var x = this.x,
  //       y = this.y,
  //       z = this.z;
  //     var e = m.elements;

  //     this.x = e[0] * x + e[4] * y + e[8] * z;
  //     this.y = e[1] * x + e[5] * y + e[9] * z;
  //     this.z = e[2] * x + e[6] * y + e[10] * z;

  //     return this.normalize();
  //   }

  //   divide(v: Vec3) {
  //     this.x /= v.x;
  //     this.y /= v.y;
  //     this.z /= v.z;

  //     return this;
  //   }


  //   min(v: Vec3) {
  //     this.x = Math.min(this.x, v.x);
  //     this.y = Math.min(this.y, v.y);
  //     this.z = Math.min(this.z, v.z);

  //     return this;
  //   }

  //   max(v: Vec3) {
  //     this.x = Math.max(this.x, v.x);
  //     this.y = Math.max(this.y, v.y);
  //     this.z = Math.max(this.z, v.z);

  //     return this;
  //   }

  //   clamp(min: Vec3, max: Vec3) {
  //     // assumes min < max, componentwise

  //     this.x = Math.max(min.x, Math.min(max.x, this.x));
  //     this.y = Math.max(min.y, Math.min(max.y, this.y));
  //     this.z = Math.max(min.z, Math.min(max.z, this.z));

  //     return this;
  //   }

  //   clampScalar(minVal: number, maxVal: number) {
  //     this.x = Math.max(minVal, Math.min(maxVal, this.x));
  //     this.y = Math.max(minVal, Math.min(maxVal, this.y));
  //     this.z = Math.max(minVal, Math.min(maxVal, this.z));

  //     return this;
  //   }

  //   clampLength(min: number, max: number) {
  //     var length = this.length();

  //     return this.divideScalar(length || 1).multiplyScalar(
  //       Math.max(min, Math.min(max, length))
  //     );
  //   }

  //   floor() {
  //     this.x = Math.floor(this.x);
  //     this.y = Math.floor(this.y);
  //     this.z = Math.floor(this.z);

  //     return this;
  //   }

  //   ceil() {
  //     this.x = Math.ceil(this.x);
  //     this.y = Math.ceil(this.y);
  //     this.z = Math.ceil(this.z);

  //     return this;
  //   }

  //   round() {
  //     this.x = Math.round(this.x);
  //     this.y = Math.round(this.y);
  //     this.z = Math.round(this.z);

  //     return this;
  //   }

  //   roundToZero() {
  //     this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
  //     this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);
  //     this.z = this.z < 0 ? Math.ceil(this.z) : Math.floor(this.z);

  //     return this;
  //   }

  //   negate() {
  //     this.x = -this.x;
  //     this.y = -this.y;
  //     this.z = -this.z;

  //     return this;
  //   }


  //   // TODO lengthSquared?

  //   lengthSq() {
  //     return this.x * this.x + this.y * this.y + this.z * this.z;
  //   }

  //   length() {
  //     return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  //   }

  //   manhattanLength() {
  //     return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  //   }
  //   setLength(length: any) {
  //     return this.normalize().multiplyScalar(length);
  //   }


  //   lerpVecs(v1: Vec3, v2: any, alpha: any) {
  //     return this.subVecs(v2, v1)
  //       .multiplyScalar(alpha)
  //       .add(v1);
  //   }


  //   projectOnVec(vec: Vec3) {
  //     var scalar = vec.dot(this) / vec.lengthSq();

  //     return this.copy(vec).multiplyScalar(scalar);
  //   }

  //   projectOnPlaneNormal(planeNormal: any) {
  //     _vec.copy(this).projectOnVec(planeNormal);

  //     return this.sub(_vec);
  //   }

  //   /**
  //    * 投影到平面
  //    * @param plane 
  //    */
  //   projectOnPlane(plane: Plane) {
  //     var scalar = plane.normal.dot(this) - plane.w;

  //     _vec.copy(plane.normal).multiplyScalar(scalar);

  //     return this.sub(_vec);
  //   }


  //   /**
  //    * 从指定方向线(斜线，也可能是法线)上投影到平面
  //    * @param planeNormal 
  //    * @param dir 
  //    */
  //   projectDirectionOnPlane(plane: Plane, dir: Vec3) {
  //     var scalar = plane.normal.dot(this) - plane.w;

  //     _vec.copy(plane.normal).multiplyScalar(scalar);

  //     _vec.negate().add(this);
  //     var len = this.distanceTo(_vec);

  //     var nlen = len / plane.normal.dot(dir)

  //     this.add(_vec.copy(dir).negate().multiplyScalar(nlen));

  //     return this;
  //   }

  //   reflect(normal: any) {
  //     // reflect incident Vec off plane orthogonal to normal
  //     // normal is assumed to have unit length

  //     return this.sub(_vec.copy(normal).multiplyScalar(2 * this.dot(normal)));
  //   }

  //   angleTo(v: Vec3, normal?: Vec3 | any) {
  //     if (normal)
  //       return this.angleToEx(v, normal)

  //     var theta = this.dot(v) / Math.sqrt(this.lengthSq() * v.lengthSq());
  //     return Math.acos(clamp(theta, -1, 1));
  //   }

  //   angleToEx(v: Vec3, normal: Vec3) {
  //     var theta = this.dot(v) / Math.sqrt(this.lengthSq() * v.lengthSq());

  //     if (this.clone().cross(v).dot(normal) > 0)
  //       return Math.acos(clamp(theta, -1, 1));
  //     else
  //       return Math.PI * 2 - Math.acos(clamp(theta, -1, 1));
  //   }

  //   distanceTo(v: any) {
  //     return Math.sqrt(this.distanceToSquared(v));
  //   }

  //   distanceToSquared(v: Vec3) {
  //     var dx = this.x - v.x,
  //       dy = this.y - v.y,
  //       dz = this.z - v.z;

  //     return dx * dx + dy * dy + dz * dz;
  //   }

  //   manhattanDistanceTo(v: Vec3) {
  //     return (
  //       Math.abs(this.x - v.x) + Math.abs(this.y - v.y) + Math.abs(this.z - v.z)
  //     );
  //   }

  //   setFromSpherical(s: { radius: number; phi: number; theta: number; }) {
  //     return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
  //   }

  //   setFromSphericalCoords(radius: number, phi: number, theta: number) {
  //     var sinPhiRadius = Math.sin(phi) * radius;

  //     this.x = sinPhiRadius * Math.sin(theta);
  //     this.y = Math.cos(phi) * radius;
  //     this.z = sinPhiRadius * Math.cos(theta);

  //     return this;
  //   }

  //   setFromCylindrical(c: { radius: any; theta: any; y: any; }) {
  //     return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
  //   }

  //   setFromCylindricalCoords(radius: number, theta: number, y: number) {
  //     this.x = radius * Math.sin(theta);
  //     this.y = y;
  //     this.z = radius * Math.cos(theta);

  //     return this;
  //   }

  //   setFromMatPosition(m: { elements: any; }) {
  //     var e = m.elements;

  //     this.x = e[12];
  //     this.y = e[13];
  //     this.z = e[14];

  //     return this;
  //   }

  //   setFromMatScale(m: any) {
  //     var sx = this.setFromMatColumn(m, 0).length();
  //     var sy = this.setFromMatColumn(m, 1).length();
  //     var sz = this.setFromMatColumn(m, 2).length();

  //     this.x = sx;
  //     this.y = sy;
  //     this.z = sz;

  //     return this;
  //   }

  //   setFromMatColumn(m: { elements: any; }, index: number) {
  //     return this.fromArray(m.elements, index * 4);
  //   }

  //   equals(v: Vec3) {
  //     return v.x === this.x && v.y === this.y && v.z === this.z;
  //   }

  //   fromArray(array: ArrayLike<number>, offset?: number) {
  //     if (offset === undefined) offset = 0;

  //     this.x = array[offset];
  //     this.y = array[offset + 1];
  //     this.z = array[offset + 2];

  //     return this;
  //   }

  //   toArray(array: number[] = [], offset: number = 0) {

  //     array[offset] = this.x;
  //     array[offset + 1] = this.y;
  //     array[offset + 2] = this.z;

  //     return array;
  //   }

  //   fromBufferAttribute(attribute: { getX: (arg0: any) => number; getY: (arg0: any) => number; getZ: (arg0: any) => number; }, index: any, offset?: number) {
  //     if (offset !== undefined) {
  //       console.warn(
  //         "Vec3: offset has been removed from .fromBufferAttribute()."
  //       );
  //     }

  //     this.x = attribute.getX(index);
  //     this.y = attribute.getY(index);
  //     this.z = attribute.getZ(index);

  //     return this;
  //   }

  //   toFixed(fractionDigits: number | undefined) {
  //     if (fractionDigits !== undefined) {
  //       this.x = parseFloat(this.x.toFixed(fractionDigits))
  //       this.y = parseFloat(this.y.toFixed(fractionDigits))
  //       this.z = parseFloat(this.z.toFixed(fractionDigits))
  //     }
  //     return this;
  //   }

  //   //---Distance-------------------------------------------------------------------------------
  //   distancePoint(point: Vec3): DistanceResult {
  //     const result: DistanceResult = {};
  //     result.distanceSqr = this.distanceToSquared(point);
  //     result.distance = Math.sqrt(result.distanceSqr);
  //     return result;
  //   }

  //   distanceVec3(point: Vec3): DistanceResult {
  //     return this.distancePoint(point);
  //   }


  //   /**
  //    * 点到直线的距离  point distance to Line
  //    * @param line 
  //    */
  //   distanceLine(line: Line): DistanceResult {
  //     const result: DistanceResult = { parameters: [], closests: [] };
  //     var diff = this.clone().sub(line.origin);
  //     var lineParameter = line.direction.dot(diff);
  //     var lineClosest = line.direction
  //       .clone()
  //       .multiplyScalar(lineParameter)
  //       .add(line.origin);

  //     result.parameters!.push(0, lineParameter);
  //     result.closests!.push(this, lineClosest);

  //     diff = result.closests![0].clone().sub(result.closests![1]);
  //     result.distanceSqr = diff.dot(diff);
  //     result.distance = Math.sqrt(result.distanceSqr);
  //     return result;
  //   }

  //   /**
  //  * Test success
  //  * 到射线的距离
  //  * @param  {Line} line
  //  * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
  //  */
  //   distanceRay(ray: Ray) {
  //     var result: DistanceResult = {
  //       parameters: [0],
  //       closests: [this]
  //     };
  //     var diff = this.clone().sub(ray.origin);
  //     result.parameters![1] = ray.direction.dot(diff);

  //     if (result.parameters![1] > 0) {
  //       result.closests![1] = ray.direction
  //         .clone()
  //         .multiplyScalar(result.parameters![1])
  //         .add(ray.origin);
  //     } else {
  //       result.closests![1] = ray.origin.clone();
  //     }
  //     diff = this.clone().sub(result.closests![1]);
  //     result.distanceSqr = diff.dot(diff);
  //     result.distance = Math.sqrt(result.distanceSqr);

  //     return result;
  //   }

  //   /**
  //   * Test success
  //   * 到线段的距离
  //   * @param  {Line} line
  //   * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
  //   */
  //   distanceSegment(segment: Segment) {
  //     const result: DistanceResult = {
  //       parameters: [],
  //       closests: []
  //     };

  //     var diff = this.clone().sub(segment.p1);
  //     var t = segment.extentDirection.dot(diff);

  //     if (t >= 0) {
  //       result.parameters![1] = 1;
  //       result.closests![1] = segment.p1;
  //     } else {
  //       diff = this.clone().sub(segment.p0);
  //       t = segment.extentDirection.dot(diff);
  //       if (t <= 0) {
  //         result.parameters![1] = 0;
  //         result.closests![1] = segment.p0;
  //       }
  //       else {
  //         var sqrLength = segment.extentSqr;
  //         if (sqrLength <= 0)
  //           sqrLength = 0;

  //         t /= sqrLength;
  //         result.parameters![1] = t;
  //         result.closests![1] = segment.extentDirection
  //           .clone()
  //           .multiplyScalar(t)
  //           .add(segment.p0);
  //       }
  //     }

  //     result.closests![0] = this;
  //     diff = this.clone().sub(result.closests![1]);
  //     result.distanceSqr = diff.dot(diff);
  //     result.distance = Math.sqrt(result.distanceSqr);

  //     return result;
  //   }

  //   /**
  //    * 点与线段的距离
  //    * @param plane 
  //    */
  //   distancePlane(plane: Plane) {
  //     // this.clone().sub(plane.origin).dot(plane.normal);
  //     const result: DistanceResult = {
  //       parameters: [],
  //       closests: [],
  //       signedDistance: 0,
  //       distance: 0
  //     };
  //     result.signedDistance = this.clone().dot(plane.normal) - plane.w;
  //     result.distance = Math.abs(result.signedDistance);
  //     result.closests![1] = this.clone().sub(plane.normal.clone().multiplyScalar(result.signedDistance));
  //     return result;
  //   }


  //   /**
  //    * 点与圆圈的距离
  //    * @param {*} circle 
  //    * @param {*} disk 
  //    * @returns {} result
  //    */
  //   distanceCircle(circle: Circle) {
  //     var result: DistanceResult = {
  //       parameters: [],
  //       closests: [],
  //       equidistant: false//是否等距
  //     };

  //     // Projection of P-C onto plane is Q-C = P-C - Dot(N,P-C)*N.

  //     var PmC = this.clone().sub(circle.center);
  //     var QmC = PmC.clone().sub(circle.normal.clone().multiplyScalar(circle.normal.dot(PmC)));
  //     var lengthQmC = QmC.length();
  //     if (lengthQmC > gPrecision) {
  //       result.circleClosest = QmC.clone().multiplyScalar(circle.radius / lengthQmC).add(circle.center);
  //       result.equidistant = false;
  //     }
  //     else {
  //       var offsetPoint = circle.center.clone().add(v3(10, 10, 10));
  //       var CP = offsetPoint.sub(circle.center);
  //       var CQ = CP.clone().sub(circle.normal.clone().multiplyScalar(circle.normal.dot(CP))).normalize()
  //       //在圆圈圆心的法线上，到圆圈上的没一点都相同 
  //       result.circleClosest = CQ.clone().multiplyScalar(circle.radius).add(circle.center)
  //       result.equidistant = true;
  //     }
  //     result.closests!.push(this, result.circleClosest);
  //     var diff = this.clone().sub(result.circleClosest);
  //     result.distanceSqr = diff.dot(diff);
  //     result.distance = Math.sqrt(result.distanceSqr);

  //     return result;
  //   }


  //   /**
  //   * 点与圆盘的距离 
  //   * @param {*} Disk 
  //   * @returns {} result
  //   */
  //   distanceDisk(disk: Disk): DistanceResult {
  //     var result: DistanceResult = {
  //       parameters: [],
  //       closests: [],
  //       signedDistance: 1,
  //       distanceSqr: 0,
  //       distance: 0,
  //     };

  //     var PmC = this.clone().sub(disk.center);
  //     var QmC = PmC.clone().sub(disk.normal.clone().multiplyScalar(disk.normal.dot(PmC)));
  //     var lengthQmC = QmC.length();

  //     result.signedDistance = this.clone().dot(disk.normal) - disk.w;

  //     if (lengthQmC > disk.radius) {
  //       result.diskClosest = QmC.clone().multiplyScalar(disk.radius / lengthQmC).add(disk.center);
  //     }
  //     else {
  //       var signedDistance = this.clone().dot(disk.normal) - disk.w;
  //       result.diskClosest = this.clone().sub(disk.normal.clone().multiplyScalar(signedDistance));
  //     }
  //     result.closests!.push(this, result.diskClosest);
  //     var diff = this.clone().sub(result.diskClosest);
  //     result.distanceSqr = diff.dot(diff);
  //     result.distance = Math.sqrt(result.distanceSqr);
  //     return result;
  //   }
  //   /**
  //    * 点与线段的距离
  //    * 点与折线的距离 测试排除法，平均比线性检索(暴力法)要快两倍以上
  //    * @param { Polyline | Vec3[]} polyline 
  //    */
  //   distancePolyline(polyline: Polyline | Vec3[]) {
  //     let u = +Infinity;
  //     let ipos: number = -1;
  //     let tempResult: DistanceResult;
  //     let result = null;
  //     for (let i = 0; i < polyline.length - 1; i++) {
  //       const pti = polyline[i];
  //       const ptj = polyline[i + 1];
  //       if (Math.abs(pti.x - this.x) > u && Math.abs(ptj.x - this.x) > u && (pti.x - this.x) * (ptj.x - this.x) > 0)
  //         continue;
  //       if (Math.abs(pti.y - this.y) > u && Math.abs(ptj.y - this.y) > u && (pti.y - this.y) * (ptj.y - this.y) > 0)
  //         continue;
  //       if (Math.abs(pti.z - this.z) > u && Math.abs(ptj.z - this.z) > u && (pti.z - this.z) * (ptj.z - this.z) > 0)
  //         continue;
  //       tempResult = this.distanceSegment(new Segment(pti, ptj));
  //       if (tempResult.distance! < u) {
  //         u = tempResult.distance!;
  //         result = tempResult;
  //         ipos = i;
  //       }
  //     }

  //     result!.segmentIndex = ipos;
  //     return result;
  //   }

  //   /**
  //    * 点到三角形的距离
  //    * @param {Triangle} triangle 
  //    */
  //   distanceTriangle(triangle: Triangle): DistanceResult {

  //     function GetMinEdge02(a11: any, b1: any, p: any) {
  //       p[0] = 0;
  //       if (b1 >= 0) {
  //         p[1] = 0;
  //       }
  //       else if (a11 + b1 <= 0) {
  //         p[1] = 1;
  //       }
  //       else {
  //         p[1] = -b1 / a11;
  //       }
  //     }

  //     function GetMinEdge12(a01: number, a11: number, b1: number, f10: number, f01: number, p: any) {
  //       var h0 = a01 + b1 - f10;
  //       if (h0 >= 0) {
  //         p[1] = 0;
  //       }
  //       else {
  //         var h1 = a11 + b1 - f01;
  //         if (h1 <= 0) {
  //           p[1] = 1;
  //         }
  //         else {
  //           p[1] = h0 / (h0 - h1);
  //         }
  //       }
  //       p[0] = 1 - p[1];
  //     }

  //     function GetMinInterior(p0: any, h0: number, p1: any, h1: number, p: any) {
  //       var z = h0 / (h0 - h1);
  //       p[0] = (1 - z) * p0[0] + z * p1[0];
  //       p[1] = (1 - z) * p0[1] + z * p1[1];
  //     }

  //     var diff = this.clone().sub(triangle.p0);
  //     var edge0 = triangle.p1.clone().sub(triangle.p0);
  //     var edge1 = triangle.p2.clone().sub(triangle.p0);
  //     var a00 = edge0.dot(edge0);
  //     var a01 = edge0.dot(edge1);
  //     var a11 = edge1.dot(edge1);
  //     var b0 = -diff.dot(edge0);
  //     var b1 = -diff.dot(edge1);

  //     var f00 = b0;
  //     var f10 = b0 + a00;
  //     var f01 = b0 + a01;

  //     var p0 = [0, 0], p1 = [0, 0], p = [0, 0];
  //     var dt1, h0, h1;


  //     if (f00 >= 0) {
  //       if (f01 >= 0) {
  //         // (1) p0 = (0,0), p1 = (0,1), H(z) = G(L(z))
  //         GetMinEdge02(a11, b1, p);
  //       }
  //       else {
  //         // (2) p0 = (0,t10), p1 = (t01,1-t01),
  //         // H(z) = (t11 - t10)*G(L(z))
  //         p0[0] = 0;
  //         p0[1] = f00 / (f00 - f01);
  //         p1[0] = f01 / (f01 - f10);
  //         p1[1] = 1 - p1[0];
  //         dt1 = p1[1] - p0[1];
  //         h0 = dt1 * (a11 * p0[1] + b1);
  //         if (h0 >= 0) {
  //           GetMinEdge02(a11, b1, p);
  //         }
  //         else {
  //           h1 = dt1 * (a01 * p1[0] + a11 * p1[1] + b1);
  //           if (h1 <= 0) {
  //             GetMinEdge12(a01, a11, b1, f10, f01, p);
  //           }
  //           else {
  //             GetMinInterior(p0, h0, p1, h1, p);
  //           }
  //         }
  //       }
  //     }
  //     else if (f01 <= 0) {
  //       if (f10 <= 0) {
  //         // (3) p0 = (1,0), p1 = (0,1),
  //         // H(z) = G(L(z)) - F(L(z))
  //         GetMinEdge12(a01, a11, b1, f10, f01, p);
  //       }
  //       else {
  //         // (4) p0 = (t00,0), p1 = (t01,1-t01), H(z) = t11*G(L(z))
  //         p0[0] = f00 / (f00 - f10);
  //         p0[1] = 0;
  //         p1[0] = f01 / (f01 - f10);
  //         p1[1] = 1 - p1[0];
  //         h0 = p1[1] * (a01 * p0[0] + b1);
  //         if (h0 >= 0) {
  //           p = p0;  // GetMinEdge01
  //         }
  //         else {
  //           h1 = p1[1] * (a01 * p1[0] + a11 * p1[1] + b1);
  //           if (h1 <= 0) {
  //             GetMinEdge12(a01, a11, b1, f10, f01, p);
  //           }
  //           else {
  //             GetMinInterior(p0, h0, p1, h1, p);
  //           }
  //         }
  //       }
  //     }
  //     else if (f10 <= 0) {
  //       // (5) p0 = (0,t10), p1 = (t01,1-t01),
  //       // H(z) = (t11 - t10)*G(L(z))
  //       p0[0] = 0;
  //       p0[1] = f00 / (f00 - f01);
  //       p1[0] = f01 / (f01 - f10);
  //       p1[1] = 1 - p1[0];
  //       dt1 = p1[1] - p0[1];
  //       h0 = dt1 * (a11 * p0[1] + b1);
  //       if (h0 >= 0) {
  //         GetMinEdge02(a11, b1, p);
  //       }
  //       else {
  //         h1 = dt1 * (a01 * p1[0] + a11 * p1[1] + b1);
  //         if (h1 <= 0) {
  //           GetMinEdge12(a01, a11, b1, f10, f01, p);
  //         }
  //         else {
  //           GetMinInterior(p0, h0, p1, h1, p);
  //         }
  //       }
  //     }
  //     else {
  //       // (6) p0 = (t00,0), p1 = (0,t11), H(z) = t11*G(L(z))
  //       p0[0] = f00 / (f00 - f10);
  //       p0[1] = 0;
  //       p1[0] = 0;
  //       p1[1] = f00 / (f00 - f01);
  //       h0 = p1[1] * (a01 * p0[0] + b1);
  //       if (h0 >= 0) {
  //         p = p0;  // GetMinEdge01
  //       }
  //       else {
  //         h1 = p1[1] * (a11 * p1[1] + b1);
  //         if (h1 <= 0) {
  //           GetMinEdge02(a11, b1, p);
  //         }
  //         else {
  //           GetMinInterior(p0, h0, p1, h1, p);
  //         }
  //       }
  //     }

  //     var result: DistanceResult = {
  //       closests: [],
  //       parameters: [],
  //       triangleParameters: []
  //     };
  //     result.triangleParameters![0] = 1 - p[0] - p[1];
  //     result.triangleParameters![1] = p[0];
  //     result.triangleParameters![2] = p[1];
  //     var closest = triangle.p0.clone().add(edge0.multiplyScalar(p[0])).add(edge1.multiplyScalar(p[1]));
  //     result.parameters!.push(0, result.triangleParameters);
  //     result.closests!.push(this, closest);
  //     diff = this.clone().sub(closest);
  //     result.distanceSqr = diff.dot(diff);
  //     result.distance = Math.sqrt(result.distanceSqr);
  //     return result;
  //   }

  //   /**
  //    * 点到矩形的距离
  //    * @param  {Rectangle} rectangle
  //    */
  //   distanceRectangle(rectangle: Rectangle): DistanceResult {
  //     var result: DistanceResult = {
  //       rectangleParameters: [],
  //       parameters: [],
  //       closests: [],
  //     };


  //     var diff = rectangle.center.clone().sub(this);
  //     var b0 = diff.dot(rectangle.axis[0]);
  //     var b1 = diff.dot(rectangle.axis[1]);
  //     var s0 = -b0, s1 = -b1;
  //     result.distanceSqr = diff.dot(diff);

  //     if (s0 < -rectangle.extent[0]) {
  //       s0 = -rectangle.extent[0];
  //     }
  //     else if (s0 > rectangle.extent[0]) {
  //       s0 = rectangle.extent[0];
  //     }
  //     result.distanceSqr += s0 * (s0 + 2 * b0);

  //     if (s1 < -rectangle.extent[1]) {
  //       s1 = -rectangle.extent[1];
  //     }
  //     else if (s1 > rectangle.extent[1]) {
  //       s1 = rectangle.extent[1];
  //     }
  //     result.distanceSqr += s1 * (s1 + 2 * b1);

  //     // Account for numerical round-off error.
  //     if (result.distanceSqr < 0) {
  //       result.distanceSqr = 0;
  //     }

  //     result.distance = Math.sqrt(result.distanceSqr);
  //     result.rectangleParameters![0] = s0;
  //     result.rectangleParameters![1] = s1;
  //     var rectangleClosestPoint = rectangle.center.clone();
  //     for (var i = 0; i < 2; ++i) {
  //       rectangleClosestPoint.add(rectangle.axis[i].multiplyScalar(result.rectangleParameters![i]));
  //     }
  //     result.closests![0] = this;
  //     result.closests![1] = rectangleClosestPoint;
  //     return result;
  //   }

  //   /**
  //   * 点到胶囊的距离
  //   * @param {Capsule} capsule 
  //   */
  //   distanceCapsule(capsule: Capsule): DistanceResult {
  //     var result = this.distanceSegment(capsule);
  //     result.distance = result.distance! - capsule.radius;
  //     var closest = this.clone().sub(result.closests![1]).normalize().multiplyScalar(capsule.radius);
  //     result.interior = result.distance < 0;

  //     result.closests = [this, closest];
  //     return result;
  //   }

  //   //---Intersection-------------------------------------------------------------------------------
  // }

  // const _vec = v3();
  // const _quat: Quat = quat();
  // const scratchN = new Vec3();
  // const scratchK = new Vec3();

  // export function v3(x?: number, y?: number, z?: number) {
  //   return new Vec3(x, y, z);
}

