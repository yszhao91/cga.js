import { v3, Vec3 } from '../../math/Vec3';

export class Disk {
  center: Vec3;
  normal: Vec3;
  radius: number;
  w: number;
  constructor(center: Vec3, radius: number, normal: Vec3 = Vec3.UnitY) {
    this.center = center || v3();
    this.normal = normal;
    this.radius = radius || 0;
    this.w = this.normal.dot(center)
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

export function disk(center: Vec3, radius: number, normal: Vec3) {
  return new Disk(center, radius, normal);
}
