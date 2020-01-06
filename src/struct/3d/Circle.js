import { v3 } from "../../math/Vector3";

class Circle {
  constructor(center, radius) {
    this.center = center || v3();
    this.radius = radius || 0;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}

function circle(center, radius) {
  return new Circle(center, radius);
}

//三点计算圆心
function calcCircleFromThreePoint(point1, point2, point3) {
  return circle();
}

export { Circle, circle, calcCircleFromThreePoint };
