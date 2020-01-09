import { v3 } from "../../math/Vector3";
import { gPrecision } from "../../math/Math";
import { Segment } from "./Segment";

export class Line {
  constructor(origin, end) {
    this.origin = origin !== undefined ? origin : v3();
    this.end = end !== undefined ? end : v3();
    this.direction = end
      .clone()
      .sub(origin)
      .normalize();
  }

  distancePoint(point) {
    return point.distanceLine(this);
  }

  //---距离-------------
  /**
   * 直线到直线的距离
   * @param  {Line} line
   */
  distanceLine(line) {
    var result = {
      parameter: [],
      closestPoint: []
    };
    var diff = this.origin.clone().sub(line.origin);
    var a01 = -this.direction.dot(line.direction);
    var b0 = diff.dot(this.direction);
    var s0, s1;
    if (Math.abs(a01) < 1)
    {
      var det = 1 - a01 * a01;
      var b1 = -diff.dot(line.direction);
      s0 = (a01 * b1 - b0) / det;
      s1 = (a01 * b0 - b1) / det;
    } else
    {
      s0 = -b0;
      s1 = 0;
    }
    result.parameter[0] = s0;
    result.parameter[1] = s1;
    result.closestPoint[0] = this.direction
      .clone()
      .multiplyScalar(s0)
      .add(this.origin);
    result.closestPoint[1] = line.direction
      .clone()
      .multiplyScalar(s1)
      .add(line.origin);
    diff = result.closestPoint[0].clone().sub(result.closestPoint[1]);
    result.sqrDistance = diff.dot(diff);
    result.distance = Math.sqrt(result.sqrDistance);

    return result;
  }

  /**
   * 直线与射线的距离
   * @param {Ray} ray 
   */
  distanceRay(ray) {
    const result = {
      parameter: [],
      closestPoint: [],
      sqrDistance: 0,
      distance: 0
    };
    var diff = this.origin.clone().sub(ray.origin);
    var a01 = - this.direction.dot(ray.direction);
    var b0 = diff.dot(this.direction);
    var s0, s1;
    if (Math.abs(a01) < 1)
    {
      var b1 = -diff.dot(ray.direction);
      s1 = a01 * b0 - b1;

      if (s1 >= 0)
      {
        //在最近点在射线上，相当于直线与直线最短距离
        var det = 1 - a01 * a01;
        s0 = (a01 * b1 - b0) / det;
        s1 /= det;
      }
      else
      {
        // 射线的起始点是离直线的最近点
        s0 = -b0;
        s1 = 0;
      }
    } else
    {
      s0 = -b0;
      s1 = 0;
    }

    result.parameter[0] = s0;
    result.parameter[1] = s1;
    result.closestPoint[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
    result.closestPoint[1] = ray.direction.clone().multiplyScalar(s1).add(ray.origin);
    diff = result.closestPoint[0].clone().sub(result.closestPoint[1]);
    result.sqrDistance = diff.dot(diff);
    result.distance = Math.sqrt(result.sqrDistance);
    return result;
  }

  /**
   * 直线与线段的距离
   * @param  {Segment} segment
   */
  distanceSegment(segment) {
    var result = {
      parameter: [],
      closestPoint: []
    };

    u = line.origin.clone().sub(segment.p0);
    a = line.direction.dot(line.direction);
    b = line.direction.dot(segment.direction);
    c = segment.direction.dot(segment.direction);
    d = line.direction.dot(u);
    e = segment.direction.dot(u);
    det = a * c - b * b;
    sDenom = det;
    // 检测是否平行
    if (det < gPrecision)
    {
      // 任意选一点
      sNum = 0;
      tNum = e;
      tDenom = c;
    } else
    {
      sNum = b * e - c * d;
      tNum = a * e - b * d;
    }
    // Check t
    if (tNum < 0)
    {
      tNum = 0;
      sNum = -d;
      sDenom = a;
    } else if (tNum > tDenom)
    {
      tNum = tDenom;
      sNum = -d + b;
      sDenom = a;
    }
    // Parameters of nearest points on restricted domain
    s = sNum / sDenom;
    t = tNum / tDenom;

    // Dot product of vector between points is squared distance
    // between segments
    result.parameter[0] = s;
    result.parameter[1] = t;

    result.closestPoint[0] = this.direction.clone().multiplyScalar(s).add(this.origin);
    result.closestPoint[1] = segment.direction.clone().multiplyScalar(t).add(segment.p0);
    diff = result.closestPoint[0].clone().sub(result.closestPoint[1]);
    result.sqrDistance = diff.dot(diff);
    result.distance = Math.sqrt(result.sqrDistance);

    return result;
  }


  distancePlane(plane) {

  }



  //---相交-------------
  intersectLine(line) {

  }

  //---平行-------------
  parallelLine(line) { }
}

export function line(start, end) {
  return new Line(start, end);
}

