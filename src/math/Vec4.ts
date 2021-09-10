import { EventHandler } from '../render/eventhandler';
import { buildAccessors } from '../render/thing';

export class Vec4 extends EventHandler {
  isVec4: boolean = true;

  constructor(private _x: number = 0, private _y: number = 0, private _z: number = 0, private _w: number = 1) {
    super();
    buildAccessors(['x', 'y', 'z', 'w'], this);
  }


  get x() {
    return this._x;
  }

  set x(value) {
    if (this._x !== value) {
      this.fire('change', 'x', this._x, value)
      this._x = value;
    }
  }

  get y() {
    return this._y;
  }

  set y(value) {
    if (this._y !== value) {
      this.fire('change', 'y', this._y, value)
      this._y = value;
    }
  }

  get z() {
    return this._z;
  }

  set z(value) {
    if (this._z !== value) {
      this.fire('change', 'z', this._z, value)
      this._z = value;
    }
  }

  get w() {
    return this._z;
  }

  set w(value) {
    if (this._w !== value) {
      this.fire('change', 'w', this._w, value)
      this._w = value;
    }
  }

  static isVec4(v: Vec4) {
    return !isNaN(v.x) && !isNaN(v.y) && !isNaN(v.z) && !isNaN(v.w);
  }

  get width() {
    return this._z;
  }

  set width(value) {
    this._z = value;
  }

  get height() {
    return this._w;
  }

  set height(value) {
    this._w = value;
  }

  set(x: number, y: number, z: number, w: number) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._w = w;

    return this;
  }

  setScalar(scalar: number) {
    this._x = scalar;
    this._y = scalar;
    this._z = scalar;
    this._w = scalar;

    return this;
  }

  setX(x: number) {
    this._x = x;

    return this;
  }

  setY(y: number) {
    this._y = y;

    return this;
  }

  setZ(z: number) {
    this._z = z;

    return this;
  }

  setW(w: number) {
    this._w = w;

    return this;
  }

  setComponent(index: number, value: number) {
    switch (index) {
      case 0:
        this._x = value;
        break;
      case 1:
        this._y = value;
        break;
      case 2:
        this._z = value;
        break;
      case 3:
        this._w = value;
        break;
      default:
        throw new Error("index is out of range: " + index);
    }

    return this;
  }

  getComponent(index: number) {
    switch (index) {
      case 0:
        return this._x;
      case 1:
        return this._y;
      case 2:
        return this._z;
      case 3:
        return this._w;
      default:
        throw new Error("index is out of range: " + index);
    }
  }

  clone() {
    return new Vec4(this._x, this._y, this._z, this._w);
  }

  copy(v: { x: number; y: number; z: number; w: number | undefined; }) {
    this._x = v.x;
    this._y = v.y;
    this._z = v.z;
    this._w = v.w !== undefined ? v.w : 1;

    return this;
  }

  add(v: Vec4, w?: Vec4): Vec4 {
    if (w !== undefined) {
      console.warn(
        "Vec4: .add() now only accepts one argument. Use .addVecs( a, b ) instead."
      );
      return this.addVecs(v, w);
    }

    this._x += v.x;
    this._y += v.y;
    this._z += v.z;
    this._w += v.w;

    return this;
  }

  addScalar(s: number) {
    this._x += s;
    this._y += s;
    this._z += s;
    this._w += s;

    return this;
  }

  addVecs(a: Vec4, b: Vec4) {
    this._x = a.x + b.x;
    this._y = a.y + b.y;
    this._z = a.z + b.z;
    this._w = a.w + b.w;

    return this;
  }

  addScaledVec(v: Vec4, s: number) {
    this._x += v.x * s;
    this._y += v.y * s;
    this._z += v.z * s;
    this._w += v.w * s;

    return this;
  }

  sub(v: Vec4, w?: Vec4) {
    if (w !== undefined) {
      return this.subVecs(v, w);
    }

    this._x -= v.x;
    this._y -= v.y;
    this._z -= v.z;
    this._w -= v.w;

    return this;
  }

  subScalar(s: number) {
    this._x -= s;
    this._y -= s;
    this._z -= s;
    this._w -= s;

    return this;
  }

  subVecs(a: Vec4, b: Vec4) {
    this._x = a.x - b.x;
    this._y = a.y - b.y;
    this._z = a.z - b.z;
    this._w = a.w - b.w;

    return this;
  }

  multiplyScalar(scalar: number) {
    this._x *= scalar;
    this._y *= scalar;
    this._z *= scalar;
    this._w *= scalar;

    return this;
  }

  applyMat4(m: { elements: any; }) {
    var x = this._x,
      y = this._y,
      z = this._z,
      w = this._w;
    var e = m.elements;

    this._x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
    this._y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
    this._z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
    this._w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;

    return this;
  }

  divideScalar(scalar: number) {
    return this.multiplyScalar(1 / scalar);
  }

  setAxisAngleFromQuat(q: { w: number; x: number; y: number; z: number; }) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/QuatToAngle/index.htm

    // q is assumed to be normalized

    this._w = 2 * Math.acos(q.w);

    var s = Math.sqrt(1 - q.w * q.w);

    if (s < 0.0001) {
      this._x = 1;
      this._y = 0;
      this._z = 0;
    } else {
      this._x = q.x / s;
      this._y = q.y / s;
      this._z = q.z / s;
    }

    return this;
  }

  setAxisAngleFromRotationMatrix(m: { elements: any; }) {
    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm

    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var angle,
      x,
      y,
      z, // variables for result
      epsilon = 0.01, // margin to allow for rounding errors
      epsilon2 = 0.1, // margin to distinguish between 0 and 180 degrees
      te = m.elements,
      m11 = te[0],
      m12 = te[4],
      m13 = te[8],
      m21 = te[1],
      m22 = te[5],
      m23 = te[9],
      m31 = te[2],
      m32 = te[6],
      m33 = te[10];

    if (
      Math.abs(m12 - m21) < epsilon &&
      Math.abs(m13 - m31) < epsilon &&
      Math.abs(m23 - m32) < epsilon
    ) {
      // singularity found
      // first check for identity matrix which must have +1 for all terms
      // in leading diagonal and zero in other terms

      if (
        Math.abs(m12 + m21) < epsilon2 &&
        Math.abs(m13 + m31) < epsilon2 &&
        Math.abs(m23 + m32) < epsilon2 &&
        Math.abs(m11 + m22 + m33 - 3) < epsilon2
      ) {
        // this singularity is identity matrix so angle = 0

        this.set(1, 0, 0, 0);

        return this; // zero angle, arbitrary axis
      }

      // otherwise this singularity is angle = 180

      angle = Math.PI;

      var xx = (m11 + 1) / 2;
      var yy = (m22 + 1) / 2;
      var zz = (m33 + 1) / 2;
      var xy = (m12 + m21) / 4;
      var xz = (m13 + m31) / 4;
      var yz = (m23 + m32) / 4;

      if (xx > yy && xx > zz) {
        // m11 is the largest diagonal term

        if (xx < epsilon) {
          x = 0;
          y = 0.707106781;
          z = 0.707106781;
        } else {
          x = Math.sqrt(xx);
          y = xy / x;
          z = xz / x;
        }
      } else if (yy > zz) {
        // m22 is the largest diagonal term

        if (yy < epsilon) {
          x = 0.707106781;
          y = 0;
          z = 0.707106781;
        } else {
          y = Math.sqrt(yy);
          x = xy / y;
          z = yz / y;
        }
      } else {
        // m33 is the largest diagonal term so base result on this

        if (zz < epsilon) {
          x = 0.707106781;
          y = 0.707106781;
          z = 0;
        } else {
          z = Math.sqrt(zz);
          x = xz / z;
          y = yz / z;
        }
      }

      this.set(x, y, z, angle);

      return this; // return 180 deg rotation
    }

    // as we have reached here there are no singularities so we can handle normally

    var s = Math.sqrt(
      (m32 - m23) * (m32 - m23) +
      (m13 - m31) * (m13 - m31) +
      (m21 - m12) * (m21 - m12)
    ); // used to normalize

    if (Math.abs(s) < 0.001) s = 1;

    // prevent divide by zero, should not happen if matrix is orthogonal and should be
    // caught by singularity test above, but I've left it in just in case

    this._x = (m32 - m23) / s;
    this._y = (m13 - m31) / s;
    this._z = (m21 - m12) / s;
    this._w = Math.acos((m11 + m22 + m33 - 1) / 2);

    return this;
  }

  min(v: Vec4) {
    this._x = Math.min(this._x, v.x);
    this._y = Math.min(this._y, v.y);
    this._z = Math.min(this._z, v.z);
    this._w = Math.min(this._w, v.w);

    return this;
  }

  max(v: Vec4) {
    this._x = Math.max(this._x, v.x);
    this._y = Math.max(this._y, v.y);
    this._z = Math.max(this._z, v.z);
    this._w = Math.max(this._w, v.w);

    return this;
  }

  clamp(min: Vec4, max: Vec4) {
    // assumes min < max, componentwise

    this._x = Math.max(min.x, Math.min(max.x, this._x));
    this._y = Math.max(min.y, Math.min(max.y, this._y));
    this._z = Math.max(min.z, Math.min(max.z, this._z));
    this._w = Math.max(min.w, Math.min(max.w, this._w));

    return this;
  }

  clampScalar(minVal: number, maxVal: number) {
    this._x = Math.max(minVal, Math.min(maxVal, this._x));
    this._y = Math.max(minVal, Math.min(maxVal, this._y));
    this._z = Math.max(minVal, Math.min(maxVal, this._z));
    this._w = Math.max(minVal, Math.min(maxVal, this._w));

    return this;
  }

  clampLength(min: number, max: number) {
    var length = this.length();

    return this.divideScalar(length || 1).multiplyScalar(
      Math.max(min, Math.min(max, length))
    );
  }

  floor() {
    this._x = Math.floor(this._x);
    this._y = Math.floor(this._y);
    this._z = Math.floor(this._z);
    this._w = Math.floor(this._w);

    return this;
  }

  ceil() {
    this._x = Math.ceil(this._x);
    this._y = Math.ceil(this._y);
    this._z = Math.ceil(this._z);
    this._w = Math.ceil(this._w);

    return this;
  }

  round() {
    this._x = Math.round(this._x);
    this._y = Math.round(this._y);
    this._z = Math.round(this._z);
    this._w = Math.round(this._w);

    return this;
  }

  roundToZero() {
    this._x = this._x < 0 ? Math.ceil(this._x) : Math.floor(this._x);
    this._y = this._y < 0 ? Math.ceil(this._y) : Math.floor(this._y);
    this._z = this._z < 0 ? Math.ceil(this._z) : Math.floor(this._z);
    this._w = this._w < 0 ? Math.ceil(this._w) : Math.floor(this._w);

    return this;
  }

  negate() {
    this._x = -this._x;
    this._y = -this._y;
    this._z = -this._z;
    this._w = -this._w;

    return this;
  }

  dot(v: Vec4) {
    return this._x * v.x + this._y * v.y + this._z * v.z + this._w * v.w;
  }

  lengthSq() {
    return (
      this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w
    );
  }

  length() {
    return Math.sqrt(
      this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w
    );
  }

  manhattanLength() {
    return (
      Math.abs(this._x) + Math.abs(this._y) + Math.abs(this._z) + Math.abs(this._w)
    );
  }

  normalize() {
    return this.divideScalar(this.length() || 1);
  }

  setLength(length: any) {
    return this.normalize().multiplyScalar(length);
  }

  lerp(v: Vec4, alpha: number) {
    this._x += (v.x - this._x) * alpha;
    this._y += (v.y - this._y) * alpha;
    this._z += (v.z - this._z) * alpha;
    this._w += (v.w - this._w) * alpha;

    return this;
  }

  lerpVecs(v1: Vec4, v2: any, alpha: any) {
    return this.subVecs(v2, v1)
      .multiplyScalar(alpha)
      .add(v1);
  }

  equals(v: Vec4) {
    return v.x === this._x && v.y === this._y && v.z === this._z && v.w === this._w;
  }

  fromArray(array: number[], offset: number = 0) {
    this._x = array[offset];
    this._y = array[offset + 1];
    this._z = array[offset + 2];
    this._w = array[offset + 3];

    return this;
  }

  toArray(array: number[] = [], offset: number = 0) {

    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._w;

    return array;
  }

  fromBufferAttribute(attribute: any, index: any, offset: undefined) {
    if (offset !== undefined) {
      console.warn(
        "Vec4: offset has been removed from .fromBufferAttribute()."
      );
    }

    this._x = attribute.getX(index);
    this._y = attribute.getY(index);
    this._z = attribute.getZ(index);
    this._w = attribute.getW(index);

    return this;
  }
}

export function v4(x?: number, y?: number, z?: number, w?: number) {
  return new Vec4(x, y, z, w);
}

