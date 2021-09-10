import { Mat3 } from './Mat3';
import { EventHandler } from '../render/eventhandler';
export class Vec2 extends EventHandler {
  isVec2: boolean = true;

  constructor(private _x: number = 0, private _y: number = 0) {
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

  static isVec2(v: any): boolean {
    return !isNaN(v.x) && !isNaN(v.y) && isNaN(v.z) && isNaN(v.w);
  }

  get width(): number {
    return this._x;
  }

  set width(value: number) {
    this._x = value;
  }

  get height(): number {
    return this._y;
  }

  set height(value: number) {
    this._y = value;
  }

  static get UnitX(): Vec2 {
    return new Vec2(1, 0);
  }

  static get UnitY(): Vec2 {
    return new Vec2(0, 1);
  }

  set(x: number, y: number) {
    this._x = x;
    this._y = y;

    return this;
  }

  setScalar(scalar: number) {
    this._x = scalar;
    this._y = scalar;

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

  setComponent(index: number, value: number) {
    switch (index) {
      case 0:
        this._x = value;
        break;
      case 1:
        this._y = value;
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
      default:
        throw new Error("index is out of range: " + index);
    }
  }

  clone(): Vec2 {
    return new Vec2(this._x, this._y);
  }

  copy(v: Vec2): Vec2 {
    this._x = v.x;
    this._y = v.y;

    return this;
  }

  add(v: Vec2, w?: Vec2) {
    if (w !== undefined) {
      console.warn(
        "Vec2: .add() now only accepts one argument. Use .addVecs( a, b ) instead."
      );
      return this.addVecs(v, w);
    }

    this._x += v.x;
    this._y += v.y;

    return this;
  }

  addScalar(s: number) {
    this._x += s;
    this._y += s;

    return this;
  }

  addVecs(a: Vec2, b: Vec2) {
    this._x = a.x + b.x;
    this._y = a.y + b.y;

    return this;
  }

  addScaledVec(v: Vec2, s: number) {
    this._x += v.x * s;
    this._y += v.y * s;

    return this;
  }

  sub(v: Vec2, w: Vec2) {
    if (w !== undefined) {
      console.warn(
        "Vec2: .sub() now only accepts one argument. Use .subVecs( a, b ) instead."
      );
      return this.subVecs(v, w);
    }

    this._x -= v.x;
    this._y -= v.y;

    return this;
  }

  subScalar(s: number) {
    this._x -= s;
    this._y -= s;

    return this;
  }

  subVecs(a: Vec2, b: Vec2) {
    this._x = a.x - b.x;
    this._y = a.y - b.y;

    return this;
  }

  multiply(v: Vec2) {
    this._x *= v.x;
    this._y *= v.y;

    return this;
  }

  multiplyScalar(scalar: number) {
    this._x *= scalar;
    this._y *= scalar;

    return this;
  }

  divide(v: Vec2) {
    this._x /= v.x;
    this._y /= v.y;

    return this;
  }

  divideScalar(scalar: number) {
    return this.multiplyScalar(1 / scalar);
  }

  applyMat3(m: Mat3) {
    var x = this._x,
      y = this._y;
    var e = m.elements;

    this._x = e[0] * x + e[3] * y + e[6];
    this._y = e[1] * x + e[4] * y + e[7];

    return this;
  }

  min(v: Vec2) {
    this._x = Math.min(this._x, v.x);
    this._y = Math.min(this._y, v.y);

    return this;
  }

  max(v: Vec2) {
    this._x = Math.max(this._x, v.x);
    this._y = Math.max(this._y, v.y);

    return this;
  }

  clamp(min: Vec2, max: Vec2) {
    // assumes min < max, componentwise

    this._x = Math.max(min.x, Math.min(max.x, this._x));
    this._y = Math.max(min.y, Math.min(max.y, this._y));

    return this;
  }

  clampScalar(minVal: number, maxVal: number) {
    this._x = Math.max(minVal, Math.min(maxVal, this._x));
    this._y = Math.max(minVal, Math.min(maxVal, this._y));

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

    return this;
  }

  ceil() {
    this._x = Math.ceil(this._x);
    this._y = Math.ceil(this._y);

    return this;
  }

  round() {
    this._x = Math.round(this._x);
    this._y = Math.round(this._y);

    return this;
  }

  roundToZero() {
    this._x = this._x < 0 ? Math.ceil(this._x) : Math.floor(this._x);
    this._y = this._y < 0 ? Math.ceil(this._y) : Math.floor(this._y);

    return this;
  }

  negate() {
    this._x = -this._x;
    this._y = -this._y;

    return this;
  }

  dot(v: Vec2) {
    return this._x * v.x + this._y * v.y;
  }

  cross(v: Vec2) {
    return this._x * v.y - this._y * v.x;
  }

  lengthSq() {
    return this._x * this._x + this._y * this._y;
  }

  length() {
    return Math.sqrt(this._x * this._x + this._y * this._y);
  }

  manhattanLength() {
    return Math.abs(this._x) + Math.abs(this._y);
  }

  normalize() {
    return this.divideScalar(this.length() || 1);
  }

  angle() {
    // computes the angle in radians with respect to the positive x-axis

    var angle = Math.atan2(this._y, this._x);

    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  }

  distanceTo(v: Vec2) {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared(v: Vec2) {
    var dx = this._x - v.x,
      dy = this._y - v.y;
    return dx * dx + dy * dy;
  }

  manhattanDistanceTo(v: Vec2) {
    return Math.abs(this._x - v.x) + Math.abs(this._y - v.y);
  }

  setLength(length: number) {
    return this.normalize().multiplyScalar(length);
  }

  lerp(v: Vec2, alpha: number) {
    this._x += (v.x - this._x) * alpha;
    this._y += (v.y - this._y) * alpha;

    return this;
  }

  lerpVecs(v1: Vec2, v2: Vec2, alpha: number) {
    return this.subVecs(v2, v1)
      .multiplyScalar(alpha)
      .add(v1);
  }

  equals(v: Vec2) {
    return v.x === this._x && v.y === this._y;
  }

  fromArray(array: number[], offset: number = 0) {
    this._x = array[offset];
    this._y = array[offset + 1];

    return this;
  }

  toArray(array: number[] = [], offset: number = 0) {
    array[offset] = this._x;
    array[offset + 1] = this._y;

    return array;
  }

  fromBufferAttribute(attribute: any, index: number, offset: any) {
    if (offset !== undefined) {
      console.warn(
        "Vec2: offset has been removed from .fromBufferAttribute()."
      );
    }

    this._x = attribute.getX(index);
    this._y = attribute.getY(index);

    return this;
  }

  rotateAround(center: Vec2, angle: number) {
    var c = Math.cos(angle),
      s = Math.sin(angle);

    var x = this._x - center.x;
    var y = this._y - center.y;

    this._x = x * c - y * s + center.x;
    this._y = x * s + y * c + center.y;

    return this;
  }
}

export function v2() {
  return new Vec2();
}

