import { Mat3 } from './Mat3';
import { EventHandler } from '../render/eventhandler';
import { buildAccessors } from '../render/thing';
export class Vec2 extends EventHandler {
  isVec2: boolean = true;
  x!: number;
  y!: number;
  constructor(private _x: number = 0, private _y: number = 0) {
    super();
    buildAccessors(['x', 'y'], this);
  }

  static isVec2(v: any): boolean {
    return !isNaN(v.x) && !isNaN(v.y) && isNaN(v.z) && isNaN(v.w);
  }

  get width(): number {
    return this.x;
  }

  set width(value: number) {
    this.x = value;
  }

  get height(): number {
    return this.y;
  }

  set height(value: number) {
    this.y = value;
  }

  static get UnitX(): Vec2 {
    return new Vec2(1, 0);
  }

  static get UnitY(): Vec2 {
    return new Vec2(0, 1);
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;

    return this;
  }

  setScalar(scalar: number) {
    this.x = scalar;
    this.y = scalar;

    return this;
  }

  setX(x: number) {
    this.x = x;

    return this;
  }

  setY(y: number) {
    this.y = y;

    return this;
  }

  setComponent(index: number, value: number) {
    switch (index) {
      case 0:
        this.x = value;
        break;
      case 1:
        this.y = value;
        break;
      default:
        throw new Error("index is out of range: " + index);
    }

    return this;
  }

  getComponent(index: number) {
    switch (index) {
      case 0:
        return this.x;
      case 1:
        return this.y;
      default:
        throw new Error("index is out of range: " + index);
    }
  }

  clone(): Vec2 {
    return new Vec2(this.x, this.y);
  }

  copy(v: Vec2): Vec2 {
    this.x = v.x;
    this.y = v.y;

    return this;
  }

  add(v: Vec2, w?: Vec2) {
    if (w !== undefined) {
      console.warn(
        "Vec2: .add() now only accepts one argument. Use .addVecs( a, b ) instead."
      );
      return this.addVecs(v, w);
    }

    this.x += v.x;
    this.y += v.y;

    return this;
  }

  addScalar(s: number) {
    this.x += s;
    this.y += s;

    return this;
  }

  addVecs(a: Vec2, b: Vec2) {
    this.x = a.x + b.x;
    this.y = a.y + b.y;

    return this;
  }

  addScaledVec(v: Vec2, s: number) {
    this.x += v.x * s;
    this.y += v.y * s;

    return this;
  }

  sub(v: Vec2, w: Vec2) {
    if (w !== undefined) {
      console.warn(
        "Vec2: .sub() now only accepts one argument. Use .subVecs( a, b ) instead."
      );
      return this.subVecs(v, w);
    }

    this.x -= v.x;
    this.y -= v.y;

    return this;
  }

  subScalar(s: number) {
    this.x -= s;
    this.y -= s;

    return this;
  }

  subVecs(a: Vec2, b: Vec2) {
    this.x = a.x - b.x;
    this.y = a.y - b.y;

    return this;
  }

  multiply(v: Vec2) {
    this.x *= v.x;
    this.y *= v.y;

    return this;
  }

  multiplyScalar(scalar: number) {
    this.x *= scalar;
    this.y *= scalar;

    return this;
  }

  divide(v: Vec2) {
    this.x /= v.x;
    this.y /= v.y;

    return this;
  }

  divideScalar(scalar: number) {
    return this.multiplyScalar(1 / scalar);
  }

  applyMat3(m: Mat3) {
    var x = this.x,
      y = this.y;
    var e = m.elements;

    this.x = e[0] * x + e[3] * y + e[6];
    this.y = e[1] * x + e[4] * y + e[7];

    return this;
  }

  min(v: Vec2) {
    this.x = Math.min(this.x, v.x);
    this.y = Math.min(this.y, v.y);

    return this;
  }

  max(v: Vec2) {
    this.x = Math.max(this.x, v.x);
    this.y = Math.max(this.y, v.y);

    return this;
  }

  clamp(min: Vec2, max: Vec2) {
    // assumes min < max, componentwise

    this.x = Math.max(min.x, Math.min(max.x, this.x));
    this.y = Math.max(min.y, Math.min(max.y, this.y));

    return this;
  }

  clampScalar(minVal: number, maxVal: number) {
    this.x = Math.max(minVal, Math.min(maxVal, this.x));
    this.y = Math.max(minVal, Math.min(maxVal, this.y));

    return this;
  }

  clampLength(min: number, max: number) {
    var length = this.length();

    return this.divideScalar(length || 1).multiplyScalar(
      Math.max(min, Math.min(max, length))
    );
  }

  floor() {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  ceil() {
    this.x = Math.ceil(this.x);
    this.y = Math.ceil(this.y);

    return this;
  }

  round() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);

    return this;
  }

  roundToZero() {
    this.x = this.x < 0 ? Math.ceil(this.x) : Math.floor(this.x);
    this.y = this.y < 0 ? Math.ceil(this.y) : Math.floor(this.y);

    return this;
  }

  negate() {
    this.x = -this.x;
    this.y = -this.y;

    return this;
  }

  dot(v: Vec2) {
    return this.x * v.x + this.y * v.y;
  }

  cross(v: Vec2) {
    return this.x * v.y - this.y * v.x;
  }

  lengthSq() {
    return this.x * this.x + this.y * this.y;
  }

  length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  manhattanLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  normalize() {
    return this.divideScalar(this.length() || 1);
  }

  angle() {
    // computes the angle in radians with respect to the positive x-axis

    var angle = Math.atan2(this.y, this.x);

    if (angle < 0) angle += 2 * Math.PI;

    return angle;
  }

  distanceTo(v: Vec2) {
    return Math.sqrt(this.distanceToSquared(v));
  }

  distanceToSquared(v: Vec2) {
    var dx = this.x - v.x,
      dy = this.y - v.y;
    return dx * dx + dy * dy;
  }

  manhattanDistanceTo(v: Vec2) {
    return Math.abs(this.x - v.x) + Math.abs(this.y - v.y);
  }

  setLength(length: number) {
    return this.normalize().multiplyScalar(length);
  }

  lerp(v: Vec2, alpha: number) {
    this.x += (v.x - this.x) * alpha;
    this.y += (v.y - this.y) * alpha;

    return this;
  }

  lerpVecs(v1: Vec2, v2: Vec2, alpha: number) {
    return this.subVecs(v2, v1)
      .multiplyScalar(alpha)
      .add(v1);
  }

  equals(v: Vec2) {
    return v.x === this.x && v.y === this.y;
  }

  fromArray(array: number[], offset: number = 0) {
    this.x = array[offset];
    this.y = array[offset + 1];

    return this;
  }

  toArray(array: number[] = [], offset: number = 0) {
    array[offset] = this.x;
    array[offset + 1] = this.y;

    return array;
  }

  fromBufferAttribute(attribute: any, index: number, offset: any) {
    if (offset !== undefined) {
      console.warn(
        "Vec2: offset has been removed from .fromBufferAttribute()."
      );
    }

    this.x = attribute.getX(index);
    this.y = attribute.getY(index);

    return this;
  }

  rotateAround(center: Vec2, angle: number) {
    var c = Math.cos(angle),
      s = Math.sin(angle);

    var x = this.x - center.x;
    var y = this.y - center.y;

    this.x = x * c - y * s + center.x;
    this.y = x * s + y * c + center.y;

    return this;
  }
}

export function v2() {
  return new Vec2();
}

