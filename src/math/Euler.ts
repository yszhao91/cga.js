import { v3 } from "./Vec3";
import { clamp } from "./Math";
import { m4, Mat4 } from "./Mat4";
import { quat, Quat } from './Quat';

var _matrix = m4();
var _Quat = quat();

const RotationOrders = ["XYZ", "YZX", "ZXY", "XZY", "YXZ", "ZYX"];
const DefaultOrder = "XYZ";
export class Euler {
  isEuler: boolean = true;
  constructor(public _x: number = 0, public _y: number = 0, public _z: number = 0, public _order = DefaultOrder) {

  }
  get x() {
    return this._x;
  }

  set x(value) {
    if (this._x !== value) {
      this._x = value;
      // this.fire('change', 'x', this._x, value)
    }
  }

  get y() {
    return this._y;
  }

  set y(value) {
    if (this._y !== value) {
      this._y = value;
      // this.fire('change', 'y', this._y, value)
    }
  }

  get z() {
    return this._z;
  }

  set z(value) {
    if (this._z !== value) {
      this._z = value;
      // this.fire('change', 'z', this._z, value)
    }
  }


  get order() {
    return this._order;
  }

  set order(value) {
    if (this._order !== value) {
      // this.fire('change', 'order', this._order, value)
      this._order = value;
    }
  }

  set(x: number, y: number, z: number, order: string) {
    this._x = x;
    this._y = y;
    this._z = z;
    this._order = order || this._order;

    // this.fire('change')


    return this;
  }

  clone() {
    return new Euler(this._x, this._y, this._z, this._order);
  }

  copy(Euler: { _x: number; _y: number; _z: number; _order: string; }) {
    this._x = Euler._x;
    this._y = Euler._y;
    this._z = Euler._z;
    this._order = Euler._order;

    // this.fire('change')

    return this;
  }

  setFromRotationMat(m: Mat4, order: string, update: boolean | undefined) {
    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)

    var te = m.elements;
    var m11 = te[0],
      m12 = te[4],
      m13 = te[8];
    var m21 = te[1],
      m22 = te[5],
      m23 = te[9];
    var m31 = te[2],
      m32 = te[6],
      m33 = te[10];

    order = order || this._order;

    if (order === "XYZ") {
      this._y = Math.asin(clamp(m13, -1, 1));

      if (Math.abs(m13) < 0.9999999) {
        this._x = Math.atan2(-m23, m33);
        this._z = Math.atan2(-m12, m11);
      } else {
        this._x = Math.atan2(m32, m22);
        this._z = 0;
      }
    } else if (order === "YXZ") {
      this._x = Math.asin(-clamp(m23, -1, 1));

      if (Math.abs(m23) < 0.9999999) {
        this._y = Math.atan2(m13, m33);
        this._z = Math.atan2(m21, m22);
      } else {
        this._y = Math.atan2(-m31, m11);
        this._z = 0;
      }
    } else if (order === "ZXY") {
      this._x = Math.asin(clamp(m32, -1, 1));

      if (Math.abs(m32) < 0.9999999) {
        this._y = Math.atan2(-m31, m33);
        this._z = Math.atan2(-m12, m22);
      } else {
        this._y = 0;
        this._z = Math.atan2(m21, m11);
      }
    } else if (order === "ZYX") {
      this._y = Math.asin(-clamp(m31, -1, 1));

      if (Math.abs(m31) < 0.9999999) {
        this._x = Math.atan2(m32, m33);
        this._z = Math.atan2(m21, m11);
      } else {
        this._x = 0;
        this._z = Math.atan2(-m12, m22);
      }
    } else if (order === "YZX") {
      this._z = Math.asin(clamp(m21, -1, 1));

      if (Math.abs(m21) < 0.9999999) {
        this._x = Math.atan2(-m23, m22);
        this._y = Math.atan2(-m31, m11);
      } else {
        this._x = 0;
        this._y = Math.atan2(m13, m33);
      }
    } else if (order === "XZY") {
      this._z = Math.asin(-clamp(m12, -1, 1));

      if (Math.abs(m12) < 0.9999999) {
        this._x = Math.atan2(m32, m22);
        this._y = Math.atan2(m13, m11);
      } else {
        this._x = Math.atan2(-m23, m33);
        this._y = 0;
      }
    } else {
      console.warn(
        "Euler: .setFromRotationMat() given unsupported order: " + order
      );
    }

    this._order = order;

    if (update !== false)// this.fire('change')

      return this;
  }

  setFromQuat(q: Quat, order?: any, update?: boolean) {
    _matrix.makeRotationFromQuat(q);

    return this.setFromRotationMat(_matrix, order, update);
  }

  setFromVec3(v: { x: any; y: any; z: any; }, order: any) {
    return this.set(v.x, v.y, v.z, order || this._order);
  }

  reorder(newOrder: any) {
    // WARNING: this discards revolution information -bhouston

    _Quat.setFromEuler(this);

    return this.setFromQuat(_Quat, newOrder);
  }

  equals(Euler: { _x: number; _y: number; _z: number; _order: string; }) {
    return (
      Euler._x === this._x &&
      Euler._y === this._y &&
      Euler._z === this._z &&
      Euler._order === this._order
    );
  }

  fromArray(array: any[]) {
    this._x = array[0];
    this._y = array[1];
    this._z = array[2];
    if (array[3] !== undefined) this._order = array[3];

    // this.fire('change')

    return this;
  }

  toArray(array: any[] = [], offset: number = 0) {

    array[offset] = this._x;
    array[offset + 1] = this._y;
    array[offset + 2] = this._z;
    array[offset + 3] = this._order;

    return array;
  }

  toVec3(optionalResult: { set: (arg0: number, arg1: number, arg2: number) => any; }) {
    if (optionalResult) {
      return optionalResult.set(this._x, this._y, this._z);
    } else {
      return v3(this._x, this._y, this._z);
    }
  }



}
export function euler(x?: number, y?: number, z?: number) {
  return new Euler(x, y, z);
}
