import { v3 } from "../../math/Vector3";

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
    if (Math.abs(a01) < 1) {
      var det = 1 - a01 * a01;
      var b1 = -diff.dot(line.direction);
      s0 = (a01 * b1 - b0) / det;
      s1 = (a01 * b0 - b1) / det;
    } else {
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

  distanceSegment(segment) {
    var result = {
      parameter: [],
      closestPoint: []
    };

    var diff = this.origin - segment.point1;
    var a01 = - this.direction.dot(segment.direction);
    var b0 = diff.dot(segment.direction);
    var s0, s1;


    result.parameter[0] = s0;
    result.parameter[1] = s1;
    result.closestPoint[0] = this.origin + s0 * this.direction;
    result.closestPoint[1] = ray.origin + s1 * ray.direction;
    diff = result.closestPoint[0].clone().sub(result.closestPoint[1]);
    result.sqrDistance = diff.dot(diff);
    result.distance = Math.sqrt(result.sqrDistance);
    return result
  }



  //---相交-------------
  intersectLine(line) { }

  //---平行-------------
  parallelLine(line) { }
}

export function line(start, end) {
  return new Line(start, end);
}

