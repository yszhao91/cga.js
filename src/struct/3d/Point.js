import { Vector3 } from "../../math/Vector3";
import { Segment } from "./Segment";
import { gPrecision, sign } from "../../math/Math";
import { Rectangle } from "./Rectangle";

export class Point extends Vector3 {
  constructor(x, y, z) {
    super(x, y, z);
  }
  //---距离 Distance-----------------------------------------------------------
  /**
   * Test success
   * 到直线的距离
   * @param  {Line} line
   * @returns
   * {
   *    lineParameter 最近点的参数
   *    lineClosest 最近点
   *    distanceSqr //到最近点距离的平方
   *    distance//到最近点距离
   * }
   */
  distanceLine(line) {
    var result = {};
    var diff = this.clone().sub(line.origin);
    result.lineParameter = line.direction.dot(diff);
    result.lineClosest = line.direction
      .clone()
      .multiplyScalar(result.lineParameter)
      .add(line.origin);

    diff = this.clone().sub(result.lineClosest);
    result.distanceSqr = diff.dot(diff);
    result.distance = Math.sqrt(result.distanceSqr);
    return result;
  }
  /**
   * Test success
   * 到射线的距离
   * @param  {Line} line
   * @returns
   * {
   *    lineParameter 最近点的参数
   *    lineClosest 最近点
   *    distanceSqr //到最近点距离的平方
   *    distance//到最近点距离
   * }
   */
  distanceRay(ray) {
    var result = {};

    var diff = this.clone().sub(ray.origin);
    result.rayParameter = ray.direction.dot(diff);

    if (result.rayParameter > 0)
    {
      result.rayClosest = ray.direction
        .clone()
        .multiplyScalar(result.rayParameter)
        .add(ray.origin);
    } else
    {
      result.rayClosest = ray.origin.clone();
    }

    diff = this.clone().sub(result.rayClosest);
    result.distanceSqr = diff.dot(diff);
    result.distance = Math.sqrt(result.distanceSqr);

    return result;
  }

  /**
   * Test success
   * 到线段的距离
   * @param  {Line} line
   * @returns
   * {
   *    lineParameter 最近点的参数
   *    lineClosest 最近点
   *    distanceSqr //到最近点距离的平方
   *    distance//到最近点距离
   * }
   */
  distanceSegment(segment) {
    const result = {};

    var diff = this.clone().sub(segment.point2);
    var t = segment.lenDirection.dot(diff);

    if (t >= 0)
    {
      result.segmentParameter = 1;
      result.segmentClosest = segment.point2;
    } else
    {
      diff = this.clone().sub(segment.point1);
      t = segment.lenDirection.dot(diff);
      if (t <= 0)
      {
        result.segmentParameter = 0;
        result.segmentClosest = segment.point1;
      }
      else
      {
        var sqrLength = segment.lenSq;
        if (sqrLength <= 0)
          sqrLength = 0;

        t /= sqrLength;
        result.segmentParameter = t;
        result.segmentClosest = segment.lenDirection
          .clone()
          .multiplyScalar(t)
          .add(segment.point1);
      }
    }

    diff = this.clone().sub(result.segmentClosest);
    result.distanceSqr = diff.dot(diff);
    result.distance = Math.sqrt(result.distanceSqr);

    return result;
  }

  /**
   * 点与折线的距离 测试排除法，平均比线性检索(暴力法)要快两倍以上
   * @param {Polygon} polyline  折线
   */
  distancePolyLine(polyline) {
    var u = +Infinity;
    var ipos = -1;
    var tempResult = null;
    var result = null;

    for (let i = 0; i < polyline.length - 1; i++)
    {
      const pti = polyline[i];
      const ptj = polyline[i + 1];
      if (Math.abs(pti.x - this.x) > u && Math.abs(ptj.x - this.x) > u && (pti.x - this.x) * (ptj.x - this.x) > 0)
        continue;
      if (Math.abs(pti.y - this.y) > u && Math.abs(ptj.y - this.y) > u && (pti.y - this.y) * (ptj.y - this.y) > 0)
        continue;
      if (Math.abs(pti.z - this.z) > u && Math.abs(ptj.z - this.z) > u && (pti.z - this.z) * (ptj.z - this.z) > 0)
        continue;
      tempResult = this.distanceSegment(new Segment(pti, ptj));
      if (tempResult.distance < u)
      {
        u = tempResult.distance;
        result = tempResult;
        ipos = i;
      }
    }

    result.segmentIndex = ipos;
    return result;
  }

  distancePolyLine1(polyline) {
    var u = +Infinity;
    var ipos = -1;
    var tempResult = null;
    var result = null;

    for (let i = 0; i < polyline.length - 1; i++)
    {
      const pti = polyline[i];
      const ptj = polyline[i + 1];
      tempResult = this.distanceSegment(new Segment(pti, ptj));
      if (u > tempResult.distance)
      {
        u = tempResult.distance;
        result = tempResult;
        ipos = i
      }
    }
    result.segmentIndex = ipos;
    return result;
  }

  distancePlane(plane) {
    // this.clone().sub(plane.origin).dot(plane.normal);
    const result = {
      signedDistance: 0,
      distance: 0,
      planeClosestPoint: null
    };
    result.signedDistance = this.clone().dot(plane.normal) - plane.w;
    result.distance = Math.abs(result.signedDistance);
    result.planeClosestPoint = this.clone().sub(plane.normal.clone().multiplyScalar(result.signedDistance));
    return result;
  }

  /**
   * 点与圆圈的距离
   * @param {*} circle 
   * @param {*} disk 
   * @returns {} result
   */
  distanceCircle(circle) {
    var result = {
      equidistant: false//是否等距
    };

    // Projection of P-C onto plane is Q-C = P-C - Dot(N,P-C)*N.
    var PmC = this.sub(circle.center);
    var QmC = PmC.clone().sub(circle.normal.clone().multiplyScalar(circle.normal.dot(PmC)));
    var lengthQmC = QmC.length();
    if (lengthQmC > gPrecision)
    {
      result.circleClosest = QmC.clone().multiplyScalar(circle.radius / lengthQmC).add(circle.center);
      result.equidistant = false;
    }
    else
    {
      var offsetPoint = circle.clone().add(10, 10, 10);
      var CP = offsetPoint.sub(circle.center);
      var CQ = CP.clone().sub(circle.normal.clone().multiplyScalar(circle.normal.dot(CP))).normalize()
      //在圆圈圆心的法线上，到圆圈上的没一点都相同 
      result.circleClosest = CQ.clone().multiplyScalar(circle.radius).add(circle.center)
      result.equidistant = true;
    }

    var diff = point.clone().sub(result.circleClosest);
    result.sqrDistance = diff.dot(diff);
    result.distance = Math.sqrt(result.sqrDistance);
    return result;
  }

  /**
 * 点与圆盘的距离
 * @param {*} circle 
 * @param {*} disk 
 * @returns {} result
 */
  distanceDisk(disk) {
    var result = {
      signed: 1,
      sqrDistance: 0,
      distance: 0,
      diskClosest: null
    };

    var PmC = this.sub(disk.center);
    var QmC = PmC.clone().sub(disk.normal.clone().multiplyScalar(disk.normal.dot(PmC)));
    var lengthQmC = QmC.length();

    result.signed = sign(this.clone().dot(disk.normal) - disk.w);

    if (lengthQmC > disk.radius)
    {
      result.diskClosest = QmC.clone().multiplyScalar(disk.radius / lengthQmC).add(disk.center);
    }
    else
    {
      var signedDistance = this.clone().dot(disk.normal) - disk.w;
      result.diskClosest = this.clone().sub(plane.normal.clone().multiplyScalar(signedDistance));
    }

    var diff = point.clone().sub(result.circleClosest);
    result.sqrDistance = diff.dot(diff);
    result.distance = Math.sqrt(result.sqrDistance);
    return result;
  }

  /**
   * 
   * @param {Capsule} capsule 
   */
  distanceCapsule(capsule) {
    var result = this.distanceSegment(capsule);
    result.distance = result.distance - capsule.radius;
    result.closest = this.clone().sub(result.segmentClosest).normalize().multiplyScalar(capsule.radius);
    result.interior = result.distance < 0
    return result;
  }

  distanceTriangle(triangle) {

    function GetMinEdge02(a11, b1, p) {
      p[0] = 0;
      if (b1 >= 0)
      {
        p[1] = 0;
      }
      else if (a11 + b1 <= 0)
      {
        p[1] = 1;
      }
      else
      {
        p[1] = -b1 / a11;
      }
    }

    function GetMinEdge12(a01, a11, b1, f10, f01, p) {
      var h0 = a01 + b1 - f10;
      if (h0 >= 0)
      {
        p[1] = 0;
      }
      else
      {
        var h1 = a11 + b1 - f01;
        if (h1 <= 0)
        {
          p[1] = 1;
        }
        else
        {
          p[1] = h0 / (h0 - h1);
        }
      }
      p[0] = 1 - p[1];
    }

    function GetMinInterior(p0, h0, p1, h1, p) {
      var z = h0 / (h0 - h1);
      p[0] = (1 - z) * p0[0] + z * p1[0];
      p[1] = (1 - z) * p0[1] + z * p1[1];
    }

    var diff = this.clone().sub(triangle.v0);
    var edge0 = triangle.v1.clone().sub(triangle.v0);
    var edge1 = triangle.v2.clone().sub(triangle.v0);
    var a00 = edge0.dot(edge0);
    var a01 = edge0.dot(edge1);
    var a11 = edge1.dot(edge1);
    var b0 = -diff.dot(edge0);
    var b1 = -diff.dot(edge1);

    var f00 = b0;
    var f10 = b0 + a00;
    var f01 = b0 + a01;

    var p0 = [0, 0], p1 = [0, 0], p = [0, 0];
    var dt1, h0, h1;

    debugger
    if (f00 >= 0)
    {
      if (f01 >= 0)
      {
        // (1) p0 = (0,0), p1 = (0,1), H(z) = G(L(z))
        GetMinEdge02(a11, b1, p);
      }
      else
      {
        // (2) p0 = (0,t10), p1 = (t01,1-t01),
        // H(z) = (t11 - t10)*G(L(z))
        p0[0] = 0;
        p0[1] = f00 / (f00 - f01);
        p1[0] = f01 / (f01 - f10);
        p1[1] = 1 - p1[0];
        dt1 = p1[1] - p0[1];
        h0 = dt1 * (a11 * p0[1] + b1);
        if (h0 >= 0)
        {
          GetMinEdge02(a11, b1, p);
        }
        else
        {
          h1 = dt1 * (a01 * p1[0] + a11 * p1[1] + b1);
          if (h1 <= 0)
          {
            GetMinEdge12(a01, a11, b1, f10, f01, p);
          }
          else
          {
            GetMinInterior(p0, h0, p1, h1, p);
          }
        }
      }
    }
    else if (f01 <= 0)
    {
      if (f10 <= 0)
      {
        // (3) p0 = (1,0), p1 = (0,1),
        // H(z) = G(L(z)) - F(L(z))
        GetMinEdge12(a01, a11, b1, f10, f01, p);
      }
      else
      {
        // (4) p0 = (t00,0), p1 = (t01,1-t01), H(z) = t11*G(L(z))
        p0[0] = f00 / (f00 - f10);
        p0[1] = 0;
        p1[0] = f01 / (f01 - f10);
        p1[1] = 1 - p1[0];
        h0 = p1[1] * (a01 * p0[0] + b1);
        if (h0 >= 0)
        {
          p = p0;  // GetMinEdge01
        }
        else
        {
          h1 = p1[1] * (a01 * p1[0] + a11 * p1[1] + b1);
          if (h1 <= 0)
          {
            GetMinEdge12(a01, a11, b1, f10, f01, p);
          }
          else
          {
            GetMinInterior(p0, h0, p1, h1, p);
          }
        }
      }
    }
    else if (f10 <= 0)
    {
      // (5) p0 = (0,t10), p1 = (t01,1-t01),
      // H(z) = (t11 - t10)*G(L(z))
      p0[0] = 0;
      p0[1] = f00 / (f00 - f01);
      p1[0] = f01 / (f01 - f10);
      p1[1] = 1 - p1[0];
      dt1 = p1[1] - p0[1];
      h0 = dt1 * (a11 * p0[1] + b1);
      if (h0 >= 0)
      {
        GetMinEdge02(a11, b1, p);
      }
      else
      {
        h1 = dt1 * (a01 * p1[0] + a11 * p1[1] + b1);
        if (h1 <= 0)
        {
          GetMinEdge12(a01, a11, b1, f10, f01, p);
        }
        else
        {
          GetMinInterior(p0, h0, p1, h1, p);
        }
      }
    }
    else
    {
      // (6) p0 = (t00,0), p1 = (0,t11), H(z) = t11*G(L(z))
      p0[0] = f00 / (f00 - f10);
      p0[1] = 0;
      p1[0] = 0;
      p1[1] = f00 / (f00 - f01);
      h0 = p1[1] * (a01 * p0[0] + b1);
      if (h0 >= 0)
      {
        p = p0;  // GetMinEdge01
      }
      else
      {
        h1 = p1[1] * (a11 * p1[1] + b1);
        if (h1 <= 0)
        {
          GetMinEdge02(a11, b1, p);
        }
        else
        {
          GetMinInterior(p0, h0, p1, h1, p);
        }
      }
    }

    var result = { parameter: [] };
    result.parameter[0] = 1 - p[0] - p[1];
    result.parameter[1] = p[0];
    result.parameter[2] = p[1];
    result.closest = triangle.v0.clone().add(edge0.multiplyScalar(p[0])).add(edge1.multiplyScalar(p[1]));
    diff = this.clone().sub(result.closest);
    result.sqrDistance = diff.dot(diff);
    result.distance = Math.sqrt(result.sqrDistance);
    return result;

  }
  /**
   * 点到矩形的距离
   * @param  {Rectangle} rectangle
   */
  distanceRectangle(rectangle) {
    var result = { rectangleParameter: [] };

    diff = rectangle.center - point;
    var b0 = diff.dot(rectangle.axis[0]);
    var b1 = diff.dot(rectangle.axis[1]);
    var s0 = -b0, s1 = -b1;
    result.sqrDistance = diff.dot(diff);

    if (s0 < -rectangle.extent[0])
    {
      s0 = -rectangle.extent[0];
    }
    else if (s0 > rectangle.extent[0])
    {
      s0 = rectangle.extent[0];
    }
    result.sqrDistance += s0 * (s0 + 2 * b0);

    if (s1 < -rectangle.extent[1])
    {
      s1 = -rectangle.extent[1];
    }
    else if (s1 > rectangle.extent[1])
    {
      s1 = rectangle.extent[1];
    }
    result.sqrDistance += s1 * (s1 + 2 * b1);

    // Account for numerical round-off error.
    if (result.sqrDistance < 0)
    {
      result.sqrDistance = 0;
    }

    result.distance = Math.sqrt(result.sqrDistance);
    result.rectangleParameter[0] = s0;
    result.rectangleParameter[1] = s1;
    result.rectangleClosestPoint = rectangle.center;
    for (var i = 0; i < 2; ++i)
    {
      result.rectangleClosestPoint.add(rectangle.axis[i].clone().multiplyScalar(result.rectangleParameter[i]));
    }
    return result
  }



  distancePolygon(Triangle) {

  }

  distanceSphere(sphere) {
    const result = {}
    result.distance = this.distanceTo(sphere.center) - sphere.radius;
    result.closest = this.point.clone().sub(sphere.center).normalize().multiplyScalar(sphere.radius);
    return result;
  }

  //---包含---------------------------------------------------------------
  insideLine() {

  }

  insideRay() {

  }

  insideSegment() {

  }

  insidePlane() {

  }


  //方位
  orientationLine() {

  }

  orientationPlane() {

  }

  orientationCircle() {

  }
}
