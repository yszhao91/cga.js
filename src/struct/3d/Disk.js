import { v3 } from "../../math/Vector3";

export class Disk {
  constructor(center, normal, radius) {
    this.center = center || v3();
    this.normal = normal;
    this.radius = radius || 0;
    this.w = this.normal.dot(center)
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

export function disk(center, radius) {
  return new Disk(center, radius);
}
