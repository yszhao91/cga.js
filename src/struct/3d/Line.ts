import { v3, Vec3 } from "../../math/Vec3";
import { DistanceResult } from '../../alg/result'; 
import { Segment } from './Segment';
import { gPrecision } from '../../math/Math';
import { Ray } from './Ray';
import { Triangle } from './Triangle';
import { Polyline } from "./Polyline";
import { Point } from "./Point";
import { Orientation } from "../data/type";

export class Line {

  direction: Vec3;
  constructor(public origin: Vec3 = v3(), public end: Vec3 = v3()) {
    this.direction = this.end
      .clone()
      .sub(this.origin)
      .normalize();
  }

  distancePoint(pt: Vec3): DistanceResult {
    var res: DistanceResult = pt.distanceLine(this)!;
    // res.closests?.reverse();
    // res.parameters?.reverse();
    return res;
  }

  distanceSegment(segment: Segment): DistanceResult {
    var result: DistanceResult = {
      parameters: [],
      closests: []
    };

    var segCenter = segment.center;
    var segDirection = segment.direction;
    var segExtent = segment.extent * 0.5;

    var diff = this.origin.clone().sub(segCenter);
    var a01 = - this.direction.dot(segDirection);
    var b0 = diff.dot(this.direction);
    var s0, s1;

    if (Math.abs(a01) < 1) {
      // 判断是否平行
      var det = 1 - a01 * a01;
      var extDet = segExtent * det;
      var b1 = -diff.dot(segDirection);
      s1 = a01 * b0 - b1;

      if (s1 >= -extDet) {
        if (s1 <= extDet) {
          // Two interior points are closest, one on the this
          // and one on the segment.
          s0 = (a01 * b1 - b0) / det;
          s1 /= det;
        }
        else {
          // The endpoint e1 of the segment and an interior
          // point of the this are closest.
          s1 = segExtent;
          s0 = -(a01 * s1 + b0);
        }
      }
      else {
        // The endpoint e0 of the segment and an interior point
        // of the this are closest.
        s1 = -segExtent;
        s0 = -(a01 * s1 + b0);
      }
    }
    else {
      // The this and segment are parallel.  Choose the closest pair
      // so that one point is at segment origin.
      s1 = 0;
      s0 = -b0;
    }

    result.parameters![0] = s0;
    result.parameters![1] = s1;
    result.closests![0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
    result.closests![1] = segDirection.clone().multiplyScalar(s1).add(segCenter);
    diff = result.closests![0].clone().sub(result.closests![1]);
    result.distanceSqr = diff.dot(diff);
    result.distance = Math.sqrt(result.distanceSqr);

    return result;
  }

  //---距离-------------
  /**
   * 直线到直线的距离
   * 参数与最近点顺序一致
   * @param  {Line} line
   */
  distanceLine(line: Line) {
    var result: DistanceResult = {
      parameters: [],
      closests: []
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
    result.parameters![0] = s0;
    result.parameters![1] = s1;
    result.closests![0] = this.direction
      .clone()
      .multiplyScalar(s0)
      .add(this.origin);
    result.closests![1] = line.direction
      .clone()
      .multiplyScalar(s1)
      .add(line.origin);
    diff = result.closests![0].clone().sub(result.closests![1]);
    result.distanceSqr = diff.dot(diff);
    result.distance = Math.sqrt(result.distanceSqr);

    return result;
  }


  /**
   * 直线与射线的距离
   * @param {Ray} ray 
   */
  distanceRay(ray: Ray): DistanceResult {
    const result: DistanceResult = {
      parameters: [],
      closests: []
    };
    var diff = this.origin.clone().sub(ray.origin);
    var a01 = - this.direction.dot(ray.direction);
    var b0 = diff.dot(this.direction);
    var s0, s1;
    if (Math.abs(a01) < 1) {
      var b1 = -diff.dot(ray.direction);
      s1 = a01 * b0 - b1;

      if (s1 >= 0) {
        //在最近点在射线上，相当于直线与直线最短距离
        var det = 1 - a01 * a01;
        s0 = (a01 * b1 - b0) / det;
        s1 /= det;
      }
      else {
        // 射线的起始点是离直线的最近点
        s0 = -b0;
        s1 = 0;
      }
    } else {
      s0 = -b0;
      s1 = 0;
    }

    result.parameters![0] = s0;
    result.parameters![1] = s1;
    result.closests![0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
    result.closests![1] = ray.direction.clone().multiplyScalar(s1).add(ray.origin);
    diff = result.closests![0].clone().sub(result.closests![1]);
    result.distanceSqr = diff.dot(diff);
    result.distance = Math.sqrt(result.distanceSqr);
    return result;
  }

  /**
   * 
   * @param triangle 
   */
  distanceTriangle(triangle: Triangle): DistanceResult {
    function Orthonormalize(numInputs: any, v: any, robust = false) {
      if (v && 1 <= numInputs && numInputs <= 3) {
        var minLength = v[0].length();
        v[0].normalize();
        for (var i = 1; i < numInputs; ++i) {
          for (var j = 0; j < i; ++j) {
            var dot = v[i].dot(v[j]);
            v[i].sub(v[j].clone().multiplyScalar(dot));
          }
          var length = v[i].length();
          v[i].normalize();
          if (length < minLength) {
            minLength = length;
          }
        }
        return minLength;
      }

      return 0;
    }
    function ComputeOrthogonalComplement(numInputs: any, v: any, robust = false) {
      if (numInputs === 1) {
        if (Math.abs(v[0][0]) > Math.abs(v[0][1])) {
          v[1] = v3(- v[0].z, 0, +v[0].x)
        }
        else {
          v[1] = v3(0, + v[0].z, -v[0].y)
        };
        numInputs = 2;
      }

      if (numInputs == 2) {
        v[2] = v[0].clone().cross(v[1]);
        return Orthonormalize(3, v, robust);
      }

      return 0;
    }

    const result: DistanceResult = {
      closests: [],
      parameters: [],
      triangleParameters: [],
    };

    // Test if line intersects triangle.  If so, the squared distance
    // is zero. 
    var edge0 = triangle.p1.clone().sub(triangle.p0);
    var edge1 = triangle.p2.clone().sub(triangle.p0);
    var normal = edge0.clone().cross(edge1).normalize();
    var NdD = normal.dot(this.direction);

    if (Math.abs(NdD) >= gPrecision) {
      // The line and triangle are not parallel, so the line
      // intersects/ the plane of the triangle.
      var diff = this.origin.clone().sub(triangle.p0);
      var basis = new Array(3);  // {D, U, V}
      basis[0] = this.direction;
      ComputeOrthogonalComplement(1, basis);
      var UdE0 = basis[1].dot(edge0);
      var UdE1 = basis[1].dot(edge1);
      var UdDiff = basis[1].dot(diff);
      var VdE0 = basis[2].dot(edge0);
      var VdE1 = basis[2].dot(edge1);
      var VdDiff = basis[2].dot(diff);
      var invDet = 1 / (UdE0 * VdE1 - UdE1 * VdE0);

      // Barycentric coordinates for the point of intersection.
      var b1 = (VdE1 * UdDiff - UdE1 * VdDiff) * invDet;
      var b2 = (UdE0 * VdDiff - VdE0 * UdDiff) * invDet;
      var b0 = 1 - b1 - b2;

      if (b0 >= 0 && b1 >= 0 && b2 >= 0) {
        // Line parameter for the point of intersection.
        var DdE0 = this.direction.dot(edge0);
        var DdE1 = this.direction.dot(edge1);
        var DdDiff = this.direction.dot(diff);
        result.lineParameter = b1 * DdE0 + b2 * DdE1 - DdDiff;

        // Barycentric coordinates for the point of intersection.
        result.triangleParameters![0] = b0;
        result.triangleParameters![1] = b1;
        result.triangleParameters![2] = b2;

        // The intersection point is inside or on the triangle.
        result.closests![0] = this.direction.clone().multiplyScalar(result.lineParameter).add(this.origin);
        result.closests![1] = edge0.multiplyScalar(b1).add(edge1.multiplyScalar(b2)).add(triangle.p0);

        result.distance = 0;
        result.distanceSqr = 0;
        return result;
      }
    }

    // Either (1) the line is not parallel to the triangle and the
    // point of intersection of the line and the plane of the triangle
    // is outside the triangle or (2) the line and triangle are
    // parallel.  Regardless, the closest point on the triangle is on
    // an edge of the triangle.  Compare the line to all three edges
    // of the triangle.
    result.distance = +Infinity;
    result.distanceSqr = +Infinity;
    for (var i0 = 2, i1 = 0; i1 < 3; i0 = i1++) {
      var segCenter = triangle[i0].clone().add(triangle[i1]).multiplyScalar(0.5);
      var segDirection = triangle[i1].clone().sub(triangle[i0]);
      var segExtent = 0.5 * segDirection.length();
      segDirection.normalize();
      var segment = new Segment(triangle[i0], triangle[i1]);

      var lsResult = this.distanceSegment(segment);
      if (lsResult.distanceSqr! < result.distanceSqr!) {
        result.distanceSqr = lsResult.distanceSqr;
        result.distance = lsResult.distance;
        result.lineParameter = lsResult.parameters![0];
        result.triangleParameters![i0] = 0.5 * (1 -
          lsResult.parameters![0] / segExtent);
        result.triangleParameters![i1] = 1 -
          result.triangleParameters![i0];
        result.triangleParameters![3 - i0 - i1] = 0;
        result.closests![0] = lsResult.closests![0];
        result.closests![1] = lsResult.closests![1];
      }
    }

    return result;
  }

  distancePolyline(polyline: Polyline | Vec3[]): DistanceResult {
    let result: DistanceResult | any = null;
    var maodian: number = -1;
    for (let i = 0; i < polyline.length - 1; i++) {
      const segment = new Segment(polyline[i], polyline[i + 1]);
      var oneres: DistanceResult = this.distanceSegment(segment) as any;
      if (!result || (result as any).distance < (oneres as any).distance) {
        result = oneres;
      }
      if ((result as any).distance < gPrecision) {
        maodian = i;
        break;
      }
    }
    return {
      distance: result?.distance,
      distanceSqr: result?.distanceSqr,
      parameters: result?.parameters,
      closests: result?.closests,
      segmentIndex: maodian,
    }
  }

  orientationPoint(point: Point, normal = Vec3.UnitY) {
    const _binormal = this.direction.clone().cross(normal);
    const _distance = Number(this.distancePoint(point).distance)
    if (!Number.isNaN(_distance) && _distance < gPrecision)
      return Orientation.Common; 
    return point.clone().sub(this.origin).dot(_binormal) > 0 ? Orientation.Positive : Orientation.Negative;
  }
}

export function line(start?: Vec3, end?: Vec3) {
  return new Line(start, end);
}

