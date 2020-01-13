import { v3 } from "../../math/Vector3";
import { gPrecision } from "../../math/Math";
import { Segment } from "./Segment";

export class Line {
  constructor(origin, end) {
    this.origin = origin !== undefined ? origin : v3();
    this.end = end !== undefined ? end : v3();
    this.direction = this.end
      .clone()
      .sub(this.origin)
      .normalize();
  }

  distancePoint(point) {
    return point.distanceLine(this);
  }

  //---距离-------------
  /**
   * 直线到直线的距离
   * 参数与最近点顺序一致
   * @param  {Line} line
   */
  distanceLine(line) {
    var result = {
      parameters: [],
      closests: []
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
    result.parameters[0] = s0;
    result.parameters[1] = s1;
    result.closests[0] = this.direction
      .clone()
      .multiplyScalar(s0)
      .add(this.origin);
    result.closests[1] = line.direction
      .clone()
      .multiplyScalar(s1)
      .add(line.origin);
    diff = result.closests[0].clone().sub(result.closests[1]);
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
      parameters: [],
      closests: [],
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

    result.parameters[0] = s0;
    result.parameters[1] = s1;
    result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
    result.closests[1] = ray.direction.clone().multiplyScalar(s1).add(ray.origin);
    diff = result.closests[0].clone().sub(result.closests[1]);
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
      parameters: [],
      closests: []
    };

    var segCenter = segment.center;
    var segDirection = segment.direction;
    var segExtent = segment.len * 0.5;

    var diff = this.origin.clone().sub(segCenter);
    var a01 = - this.direction.dot(segDirection);
    var b0 = diff.dot(this.direction);
    var s0, s1;

    if (Math.abs(a01) < 1)
    {
      // 判断是否平行
      var det = 1 - a01 * a01;
      var extDet = segExtent * det;
      var b1 = -diff.dot(segDirection);
      s1 = a01 * b0 - b1;

      if (s1 >= -extDet)
      {
        if (s1 <= extDet)
        {
          // Two interior points are closest, one on the this
          // and one on the segment.
          s0 = (a01 * b1 - b0) / det;
          s1 /= det;
        }
        else
        {
          // The endpoint e1 of the segment and an interior
          // point of the this are closest.
          s1 = segExtent;
          s0 = -(a01 * s1 + b0);
        }
      }
      else
      {
        // The endpoint e0 of the segment and an interior point
        // of the this are closest.
        s1 = -segExtent;
        s0 = -(a01 * s1 + b0);
      }
    }
    else
    {
      // The this and segment are parallel.  Choose the closest pair
      // so that one point is at segment origin.
      s1 = 0;
      s0 = -b0;
    }

    result.parameters[0] = s0;
    result.parameters[1] = s1;
    result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
    result.closests[1] = segDirection.clone().multiplyScalar(s1).add(segCenter);
    diff = result.closests[0].clone().sub(result.closests[1]);
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

