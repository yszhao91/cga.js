import { v3 } from "./Vec3";
import { Mat4 } from './Mat4';

var _Vec = v3();

export class Mat3 {
  elements: number[] = [1, 0, 0, 0, 1, 0, 0, 0, 1];;
  isMat3: boolean = true;
  constructor() {

    if (arguments.length > 0) {
      console.error(
        "Mat3: the constructor no longer reads arguments. use .set() instead."
      );
    }
  }

  set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number) {
    var te = this.elements;

    te[0] = n11;
    te[1] = n21;
    te[2] = n31;
    te[3] = n12;
    te[4] = n22;
    te[5] = n32;
    te[6] = n13;
    te[7] = n23;
    te[8] = n33;

    return this;
  }

  identity() {
    this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);

    return this;
  }

  clone() {
    return new Mat3().fromArray(this.elements);
  }

  copy(m: Mat3) {
    var te = this.elements;
    var me = m.elements;

    te[0] = me[0];
    te[1] = me[1];
    te[2] = me[2];
    te[3] = me[3];
    te[4] = me[4];
    te[5] = me[5];
    te[6] = me[6];
    te[7] = me[7];
    te[8] = me[8];

    return this;
  }

  setFromMat4(m: Mat4) {
    var me = m.elements;

    this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]);

    return this;
  }

  applyToBufferAttribute(attribute: any) {
    for (var i = 0, l = attribute.count; i < l; i++) {
      _Vec.x = attribute.getX(i);
      _Vec.y = attribute.getY(i);
      _Vec.z = attribute.getZ(i);

      _Vec.applyMat3(this);

      attribute.setXYZ(i, _Vec.x, _Vec.y, _Vec.z);
    }

    return attribute;
  }

  multiply(m: Mat3) {
    return this.multiplyMatrices(this, m);
  }

  premultiply(m: Mat3) {
    return this.multiplyMatrices(m, this);
  }

  multiplyMatrices(a: Mat3, b: Mat3) {
    var ae = a.elements;
    var be = b.elements;
    var te = this.elements;

    var a11 = ae[0],
      a12 = ae[3],
      a13 = ae[6];
    var a21 = ae[1],
      a22 = ae[4],
      a23 = ae[7];
    var a31 = ae[2],
      a32 = ae[5],
      a33 = ae[8];

    var b11 = be[0],
      b12 = be[3],
      b13 = be[6];
    var b21 = be[1],
      b22 = be[4],
      b23 = be[7];
    var b31 = be[2],
      b32 = be[5],
      b33 = be[8];

    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
    te[6] = a11 * b13 + a12 * b23 + a13 * b33;

    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
    te[7] = a21 * b13 + a22 * b23 + a23 * b33;

    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
    te[8] = a31 * b13 + a32 * b23 + a33 * b33;

    return this;
  }

  multiplyScalar(s: number) {
    var te = this.elements;

    te[0] *= s;
    te[3] *= s;
    te[6] *= s;
    te[1] *= s;
    te[4] *= s;
    te[7] *= s;
    te[2] *= s;
    te[5] *= s;
    te[8] *= s;

    return this;
  }

  determinant() {
    var te = this.elements;

    var a = te[0],
      b = te[1],
      c = te[2],
      d = te[3],
      e = te[4],
      f = te[5],
      g = te[6],
      h = te[7],
      i = te[8];

    return (
      a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g
    );
  }

  getInverse(matrix: Mat3 | Mat4 | any, throwOnDegenerate: boolean = false) {
    if (matrix && matrix.isMat4) {
      console.error(
        "Mat3: .getInverse() no longer takes a Mat4 argument."
      );
    }

    var me = matrix.elements,
      te = this.elements,
      n11 = me[0],
      n21 = me[1],
      n31 = me[2],
      n12 = me[3],
      n22 = me[4],
      n32 = me[5],
      n13 = me[6],
      n23 = me[7],
      n33 = me[8],
      t11 = n33 * n22 - n32 * n23,
      t12 = n32 * n13 - n33 * n12,
      t13 = n23 * n12 - n22 * n13,
      det = n11 * t11 + n21 * t12 + n31 * t13;

    if (det === 0) {
      var msg =
        "Mat3: .getInverse() can't invert matrix, determinant is 0";

      if (throwOnDegenerate === true) {
        throw new Error(msg);
      } else {
        console.warn(msg);
      }

      return this.identity();
    }

    var detInv = 1 / det;

    te[0] = t11 * detInv;
    te[1] = (n31 * n23 - n33 * n21) * detInv;
    te[2] = (n32 * n21 - n31 * n22) * detInv;

    te[3] = t12 * detInv;
    te[4] = (n33 * n11 - n31 * n13) * detInv;
    te[5] = (n31 * n12 - n32 * n11) * detInv;

    te[6] = t13 * detInv;
    te[7] = (n21 * n13 - n23 * n11) * detInv;
    te[8] = (n22 * n11 - n21 * n12) * detInv;

    return this;
  }

  transpose() {
    var tmp,
      m = this.elements;

    tmp = m[1];
    m[1] = m[3];
    m[3] = tmp;
    tmp = m[2];
    m[2] = m[6];
    m[6] = tmp;
    tmp = m[5];
    m[5] = m[7];
    m[7] = tmp;

    return this;
  }

  getNormalMatrix(mat4: Mat4) {
    return this.setFromMat4(mat4)
      .getInverse(this)
      .transpose();
  }

  transposeIntoArray(r: number[]) {
    var m = this.elements;

    r[0] = m[0];
    r[1] = m[3];
    r[2] = m[6];
    r[3] = m[1];
    r[4] = m[4];
    r[5] = m[7];
    r[6] = m[2];
    r[7] = m[5];
    r[8] = m[8];

    return this;
  }

  setUvTransform(tx: any, ty: any, sx: number, sy: number, rotation: number, cx: number, cy: number) {
    var c = Math.cos(rotation);
    var s = Math.sin(rotation);

    this.set(
      sx * c,
      sx * s,
      -sx * (c * cx + s * cy) + cx + tx,
      -sy * s,
      sy * c,
      -sy * (-s * cx + c * cy) + cy + ty,
      0,
      0,
      1
    );
  }

  scale(sx: number, sy: number) {
    var te = this.elements;

    te[0] *= sx;
    te[3] *= sx;
    te[6] *= sx;
    te[1] *= sy;
    te[4] *= sy;
    te[7] *= sy;

    return this;
  }

  rotate(theta: number) {
    var c = Math.cos(theta);
    var s = Math.sin(theta);

    var te = this.elements;

    var a11 = te[0],
      a12 = te[3],
      a13 = te[6];
    var a21 = te[1],
      a22 = te[4],
      a23 = te[7];

    te[0] = c * a11 + s * a21;
    te[3] = c * a12 + s * a22;
    te[6] = c * a13 + s * a23;

    te[1] = -s * a11 + c * a21;
    te[4] = -s * a12 + c * a22;
    te[7] = -s * a13 + c * a23;

    return this;
  }

  translate(tx: number, ty: number) {
    var te = this.elements;

    te[0] += tx * te[2];
    te[3] += tx * te[5];
    te[6] += tx * te[8];
    te[1] += ty * te[2];
    te[4] += ty * te[5];
    te[7] += ty * te[8];

    return this;
  }

  equals(matrix: Mat3) {
    var te = this.elements;
    var me = matrix.elements;

    for (var i = 0; i < 9; i++) {
      if (te[i] !== me[i]) return false;
    }

    return true;
  }

  fromArray(array: number[], offset: number = 0) {

    for (var i = 0; i < 9; i++) {
      this.elements[i] = array[i + offset];
    }

    return this;
  }

  toArray(array: number[] = [], offset: number = 0) {
    var te = this.elements;

    array[offset] = te[0];
    array[offset + 1] = te[1];
    array[offset + 2] = te[2];

    array[offset + 3] = te[3];
    array[offset + 4] = te[4];
    array[offset + 5] = te[5];

    array[offset + 6] = te[6];
    array[offset + 7] = te[7];
    array[offset + 8] = te[8];

    return array;
  }
}

export function m3() {
  return new Mat3();
} 
