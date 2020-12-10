import { Vector3 } from "../../math/Vector3";
import { Line } from "./Line";
import { pointsCollinear } from "../../alg/collinear";
import { Point } from "./Point";

export class Circle {
  /**
   * 圆圈
   * @param  {Vector3} center 中心点
   * @param  {Vector3} normal 法线
   * @param  {Number} radius 半径
   */
  constructor(center, normal, radius) {
    this.center = center || new Vector3();
    this.normal = normal.normalize();
    this.radius = radius || 0;
  }

  area() {
    return Math.PI * this.radius * this.radius;
  }
}
/**
  * 圆圈生成方法
  * @param  {Vector3} center 中心点
  * @param  {Vector3} normal 法线
  * @param  {Number} radius 半径
  * @returns {Circle} circle 返回一个圆
  */
export function circle(center, normal, radius) {
  return new Circle(center, normal, radius);
}

/**
 * 三点计算圆 --low --debugging
 * @param {Point} p0 点1
 * @param {Point} p1 点2
 * @param {Point} p2 点3
 * @returns {Circle} circle 返回一个圆
 */
export function calcCircleFromThreePoint(p0, p1, p2) {
  if (pointsCollinear(p1, p2, p3))
  {
    alert("calcCircleFromThreePoint：三点共线或者距离太近")
  }
  var d1 = p1.clone().sub(p0)
  var d2 = p2.clone().sub(p0)
  var d1center = p1.clone().add(p0).multiplyScalar(0.5)
  var d2center = p2.clone().add(p0).multiplyScalar(0.5)
  var normal = d1.clone().cross(d2).normalize();
  d1.applyAxisAngle(normal, Math.PI / 2);
  d2.applyAxisAngle(normal, Math.PI / 2);

  var line1 = new Line(d1center, d1center.clone().add(d1));
  var line2 = new Line(d2center, d2center.clone().add(d2));
  var center = line1.distanceLine(line2).closestPoint[0];
  var radius = d1.distanceTo(center)

  return circle(center, radius);
}
// vertical
// horizontal