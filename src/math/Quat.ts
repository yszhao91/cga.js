import { clamp } from "./Math";
import { Euler } from './Euler';
import { EventHandler } from '../render/eventhandler';

export class Quat extends EventHandler {
  isQuat: boolean = true;
  constructor(public _x: number = 0, public _y: number = 0, public _z: number = 0, public _w: number = 1) {
    super();
  }
  get x() {
    return this._x;
  }

  set x(value) {
    if (this._x !== value) {
      this._x = value;
      this.fire('change', 'x', this._x, value)
    }
  }

  get y() {
    return this._y;
  }

  set y(value) {
    if (this._y !== value) {
      this._y = value;
      this.fire('change', 'y', this._y, value)
    }
  }

  get z() {
    return this._z;
  }

  set z(value) {
    if (this._z !== value) {
      this._z = value;
      this.fire('change', 'z', this._z, value)
    }
  }

  get w() {
    return this._w;
  }

  set w(value) {
    if (this._w !== value) {
      this._w = value;
      this.fire('change', 'w', this._w, value)
    }
  }

  static slerp(qa: any, qb: any, qm: { copy: (arg0: any) => { (): any; new(): any; slerp: { (arg0: any, arg1: any): any; new(): any; }; }; }, t: any) {
    return qm.copy(qa).slerp(qb, t);
  }

  static slerpFlat(dst: { [x: string]: any; }, dstOffset: number, src0: { [x: string]: any; }, srcOffset0: number, src1: { [x: string]: any; }, srcOffset1: number, t: number) {
    // fuzz-free, array-based Quat SLERP operation

    var x0 = src0[srcOffset0 + 0],
      y0 = src0[srcOffset0 + 1],
      z0 = src0[srcOffset0 + 2],
      w0 = src0[srcOffset0 + 3],
      x1 = src1[srcOffset1 + 0],
      y1 = src1[srcOffset1 + 1],
      z1 = src1[srcOffset1 + 2],
      w1 = src1[srcOffset1 + 3];

    if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
      var s = 1 - t,
        cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
        dir = cos >= 0 ? 1 : -1,
        sqrSin = 1 - cos * cos;

      // Skip the Slerp for tiny steps to avoid numeric problems:
      if (sqrSin > Number.EPSILON) {
        var sin = Math.sqrt(sqrSin),
          len = Math.atan2(sin, cos * dir);

        s = Math.sin(s * len) / sin;
        t = Math.sin(t * len) / sin;
      }

      var tDir = t * dir;

      x0 = x0 * s + x1 * tDir;
      y0 = y0 * s + y1 * tDir;
      z0 = z0 * s + z1 * tDir;
      w0 = w0 * s + w1 * tDir;

      // Normalize in case we just did a lerp:
      if (s === 1 - t) {
        var f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);

        x0 *= f;
        y0 *= f;
        z0 *= f;
        w0 *= f;
      }
    }

    dst[dstOffset] = x0;
    dst[dstOffset + 1] = y0;
    dst[dstOffset + 2] = z0;
    dst[dstOffset + 3] = w0;
  }

  static multiplyQuatsFlat(dst: { [x: string]: number; }, dstOffset: number, src0: { [x: string]: any; }, srcOffset0: number, src1: { [x: string]: any; }, srcOffset1: number) {

    var x0 = src0[srcOffset0];
    var y0 = src0[srcOffset0 + 1];
    var z0 = src0[srcOffset0 + 2];
    var w0 = src0[srcOffset0 + 3];

    var x1 = src1[srcOffset1];
    var y1 = src1[srcOffset1 + 1];
    var z1 = src1[srcOffset1 + 2];
    var w1 = src1[srcOffset1 + 3];

    dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
    dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
    dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
    dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;

    return dst;

  }


  set(x: number, y: number, z: number, w: number) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;

    this.fire("change", this);

    return this;
  }

  clone() {
    return new Quat(this._x, this._y, this._z, this._w);
  }

  copy(quat: Quat) {
    this._x = quat.x;
    this._y = quat.y;
    this._z = quat.z;
    this._w = quat.w;

    this.fire("change", this);

    return this;
  }

  setFromEuler(euler: Euler, update?: boolean) {
    if (!(euler && euler.isEuler)) {
      throw new Error(
        "Quat: .setFromEuler() now expects an Euler rotation rather than a Vec3 and order."
      );
    }

    var x = euler._x,
      y = euler._y,
      z = euler._z,
      order = euler.order;

    // http://www.mathworks.com/matlabcentral/fileexchange/
    // 	20696-function-to-convert-between-dcm-Euler-angles-Quats-and-Euler-Vecs/
    //	content/SpinCalc.m

    var cos = Math.cos;
    var sin = Math.sin;

    var c1 = cos(x / 2);
    var c2 = cos(y / 2);
    var c3 = cos(z / 2);

    var s1 = sin(x / 2);
    var s2 = sin(y / 2);
    var s3 = sin(z / 2);

    if (order === "XYZ") {
      this._x = s1 * c2 * c3 + c1 * s2 * s3;
      this._y = c1 * s2 * c3 - s1 * c2 * s3;
      this._z = c1 * c2 * s3 + s1 * s2 * c3;
      this._w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "YXZ") {
      this._x = s1 * c2 * c3 + c1 * s2 * s3;
      this._y = c1 * s2 * c3 - s1 * c2 * s3;
      this._z = c1 * c2 * s3 - s1 * s2 * c3;
      this._w = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === "ZXY") {
      this._x = s1 * c2 * c3 - c1 * s2 * s3;
      this._y = c1 * s2 * c3 + s1 * c2 * s3;
      this._z = c1 * c2 * s3 + s1 * s2 * c3;
      this._w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "ZYX") {
      this._x = s1 * c2 * c3 - c1 * s2 * s3;
      this._y = c1 * s2 * c3 + s1 * c2 * s3;
      this._z = c1 * c2 * s3 - s1 * s2 * c3;
      this._w = c1 * c2 * c3 + s1 * s2 * s3;
    } else if (order === "YZX") {
      this._x = s1 * c2 * c3 + c1 * s2 * s3;
      this._y = c1 * s2 * c3 + s1 * c2 * s3;
      this._z = c1 * c2 * s3 - s1 * s2 * c3;
      this._w = c1 * c2 * c3 - s1 * s2 * s3;
    } else if (order === "XZY") {
      this._x = s1 * c2 * c3 - c1 * s2 * s3;
      this._y = c1 * s2 * c3 - s1 * c2 * s3;
      this._z = c1 * c2 * s3 + s1 * s2 * c3;
      this._w = c1 * c2 * c3 + s1 * s2 * s3;
    }

    if (update !== false) this.fire("change", this);

    return this;
  }

  setFromAxisAngle(axis: { x: number; y: number; z: number; }, angle: number) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuat/index.htm

    // assumes axis is normalized

    var halfAngle = angle / 2,
      s = Math.sin(halfAngle);

    this._x = axis.x * s;
    this._y = axis.y * s;
    this._z = axis.z * s;
    this._w = Math.cos(halfAngle);

    this.fire("change", this);

    return this;
  }

  setFromRotationMatrix(m: { elements: any; }) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuat/index.htm

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var te = m.elements,
      m11 = te[0],
      m12 = te[4],
      m13 = te[8],
      m21 = te[1],
      m22 = te[5],
      m23 = te[9],
      m31 = te[2],
      m32 = te[6],
      m33 = te[10],
      trace = m11 + m22 + m33,
      s;

    if (trace > 0) {
      s = 0.5 / Math.sqrt(trace + 1.0);

      this._w = 0.25 / s;
      this._x = (m32 - m23) * s;
      this._y = (m13 - m31) * s;
      this._z = (m21 - m12) * s;
    } else if (m11 > m22 && m11 > m33) {
      s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);

      this._w = (m32 - m23) / s;
      this._x = 0.25 * s;
      this._y = (m12 + m21) / s;
      this._z = (m13 + m31) / s;
    } else if (m22 > m33) {
      s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);

      this._w = (m13 - m31) / s;
      this._x = (m12 + m21) / s;
      this._y = 0.25 * s;
      this._z = (m23 + m32) / s;
    } else {
      s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);

      this._w = (m21 - m12) / s;
      this._x = (m13 + m31) / s;
      this._y = (m23 + m32) / s;
      this._z = 0.25 * s;
    }

    this.fire("change", this);

    return this;
  }

  setFromUnitVecs(vFrom: { dot: (arg0: any) => number; x: number; z: number; y: number; }, vTo: { z: number; y: number; x: number; }) {
    // assumes direction Vecs vFrom and vTo are normalized

    var EPS = 0.000001;

    var r = vFrom.dot(vTo) + 1;

    if (r < EPS) {
      r = 0;

      if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
        this._x = -vFrom.y;
        this._y = vFrom.x;
        this._z = 0;
        this._w = r;
      } else {
        this._x = 0;
        this._y = -vFrom.z;
        this._z = vFrom.y;
        this._w = r;
      }
    } else {
      // crossVecs( vFrom, vTo ); // inlined to avoid cyclic dependency on Vec3

      this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
      this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
      this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
      this._w = r;
    }

    return this.normalize();
  }

  angleTo(q: any) {
    return 2 * Math.acos(Math.abs(clamp(this.dot(q), -1, 1)));
  }

  rotateTowards(q: any, step: number) {
    var angle = this.angleTo(q);

    if (angle === 0) return this;

    var t = Math.min(1, step / angle);

    this.slerp(q, t);

    return this;
  }

  inverse() {
    // Quat is assumed to have unit length

    return this.conjugate();
  }

  invert() {

    // quaternion is assumed to have unit length

    return this.conjugate();

  }

  conjugate() {
    this._x *= -1;
    this._y *= -1;
    this._z *= -1;

    this.fire("change", this);

    return this;
  }

  dot(v: Quat) {
    return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
  }

  lengthSq() {
    return (
      this._x * this._x +
      this._y * this._y +
      this._z * this._z +
      this._w * this._w
    );
  }

  length() {
    return Math.sqrt(
      this._x * this._x +
      this._y * this._y +
      this._z * this._z +
      this._w * this._w
    );
  }

  normalize() {
    var l = this.length();

    if (l === 0) {
      this._x = 0;
      this._y = 0;
      this._z = 0;
      this._w = 1;
    } else {
      l = 1 / l;

      this._x = this._x * l;
      this._y = this._y * l;
      this._z = this._z * l;
      this._w = this._w * l;
    }

    this.fire("change", this);

    return this;
  }

  multiply(q: Quat, p?: Quat) {
    if (p !== undefined) {
      return this.multiplyQuats(q, p);
    }

    return this.multiplyQuats(this, q);
  }

  premultiply(q: Quat) {
    return this.multiplyQuats(q, this);
  }

  multiplyQuats(a: Quat, b: Quat) {
    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/Quats/code/index.htm

    var qax = a._x,
      qay = a._y,
      qaz = a._z,
      qaw = a._w;
    var qbx = b._x,
      qby = b._y,
      qbz = b._z,
      qbw = b._w;

    this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
    this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
    this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
    this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;

    this.fire("change", this);

    return this;
  }

  slerp(qb: Quat, t: number) {
    if (t === 0) return this;
    if (t === 1) return this.copy(qb);

    var x = this._x,
      y = this._y,
      z = this._z,
      w = this._w;

    // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/Quats/slerp/

    var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

    if (cosHalfTheta < 0) {
      this._w = -qb._w;
      this._x = -qb._x;
      this._y = -qb._y;
      this._z = -qb._z;

      cosHalfTheta = -cosHalfTheta;
    } else {
      this.copy(qb);
    }

    if (cosHalfTheta >= 1.0) {
      this._w = w;
      this._x = x;
      this._y = y;
      this._z = z;

      return this;
    }

    var sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

    if (sqrSinHalfTheta <= Number.EPSILON) {
      var s = 1 - t;
      this._w = s * w + t * this._w;
      this._x = s * x + t * this._x;
      this._y = s * y + t * this._y;
      this._z = s * z + t * this._z;

      this.normalize();
      this.fire("change", this);

      return this;
    }

    var sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
    var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
      ratioB = Math.sin(t * halfTheta) / sinHalfTheta;

    this._w = w * ratioA + this._w * ratioB;
    this._x = x * ratioA + this._x * ratioB;
    this._y = y * ratioA + this._y * ratioB;
    this._z = z * ratioA + this._z * ratioB;

    this.fire("change", this);

    return this;
  }

  equals(quat: Quat) {
    return (
      quat._x === this._x &&
      quat._y === this._y &&
      quat._z === this._z &&
      quat._w === this._w
    );
  }

  fromArray(array: { [x: string]: number; }, offset: number | undefined) {
    if (offset === undefined) offset = 0;

    this._x = array[offset];
    this._y = array[offset + 1];
    this._z = array[offset + 2];
    this._w = array[offset + 3];

    this.fire("change", this);

    return this;
  }

  toArray(array: number[] = [], offset: number = 0) {

    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._w;

    return array;
  }

}

export function quat(x?: number, y?: number, z?: number, w?: number) {
  return new Quat(x, y, z, w);
}
