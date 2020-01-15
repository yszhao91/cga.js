import { v3 } from "../../math/Vector3";

export class Segment extends Array {
  /**
   * 线段
   * @param  {Point|Vector3} p0
   * @param  {Point|Vector3} p1
   */
  constructor(p0, p1) {
    super();
    this.push(p0 || v3(), p1 || v3());
    this.center = this.p0
      .clone()
      .add(this.p1)
      .multiplyScalar(0.5);
    this.lenDirection = this.p1.clone().sub(this.p0);
    this.lenSq = this.lenDirection.lengthSq();
    this.len = Math.sqrt(this.lenSq);
    this.direction = this.lenDirection.clone().normalize();
  }

  get p0() {
    return this[0];
  }
  set p0(value) {
    this[0] = value;
  }

  get p1() {
    return this[1];
  }
  set p1(value) {
    this[1] = value;
  }
  /**
   * @param  {Vector3} amount
   * @param  {Vector3 target
   */
  at(amount, target) {
    if (target === undefined) target = new Vector3();

    return target
      .subVectors(this.end, this.start)
      .multiplyScalar(amount)
      .add(this.start);
  }

  clone() {
    return new Segment(this.p0.clone(), this.p1.clone());
  }
  //---Distance---------------------------------------------
  /**
   * 点是否在线段上
   * @param  {Vector3} point
   */
  containPoint(point) {
    return point.inside(this);
  }
  /**
   * 点与线段的距离
   * @param  {Vector3} point
   */
  distancePoint(point) {
    return point.distanceSegment(this);
  }

  /**
   * 线段到线段的距离
   * @param  {Segment} segment
   */
  distanceSegment(segment) {
    var result = {
      parameters: [],
      closests: []
    };

    function GetClampedRoot(slope, h0, h1) {
      var r;
      if (h0 < 0)
      {
        if (h1 > 0)
        {
          r = -h0 / slope;
          if (r > 1)
          {
            r = 0.5;
          }
          // The slope is positive and -h0 is positive, so there is no
          // need to test for a negative value and clamp it.
        } else
        {
          r = 1;
        }
      } else
      {
        r = 0;
      }
      return r;
    }

    function ComputevarIntersection(sValue, classify, edge, end) {

      if (classify[0] < 0)
      {
        edge[0] = 0;
        end[0][0] = 0;
        end[0][1] = mF00 / mB;
        if (end[0][1] < 0 || end[0][1] > 1)
        {
          end[0][1] = 0.5;
        }

        if (classify[1] == 0)
        {
          edge[1] = 3;
          end[1][0] = sValue[1];
          end[1][1] = 1;
        } else // classify[1] > 0
        {
          edge[1] = 1;
          end[1][0] = 1;
          end[1][1] = mF10 / mB;
          if (end[1][1] < 0 || end[1][1] > 1)
          {
            end[1][1] = 0.5;
          }
        }
      } else if (classify[0] == 0)
      {
        edge[0] = 2;
        end[0][0] = sValue[0];
        end[0][1] = 0;

        if (classify[1] < 0)
        {
          edge[1] = 0;
          end[1][0] = 0;
          end[1][1] = mF00 / mB;
          if (end[1][1] < 0 || end[1][1] > 1)
          {
            end[1][1] = 0.5;
          }
        } else if (classify[1] == 0)
        {
          edge[1] = 3;
          end[1][0] = sValue[1];
          end[1][1] = 1;
        } else
        {
          edge[1] = 1;
          end[1][0] = 1;
          end[1][1] = mF10 / mB;
          if (end[1][1] < 0 || end[1][1] > 1)
          {
            end[1][1] = 0.5;
          }
        }
      } else // classify[0] > 0
      {
        edge[0] = 1;
        end[0][0] = 1;
        end[0][1] = mF10 / mB;
        if (end[0][1] < 0 || end[0][1] > 1)
        {
          end[0][1] = 0.5;
        }

        if (classify[1] == 0)
        {
          edge[1] = 3;
          end[1][0] = sValue[1];
          end[1][1] = 1;
        } else
        {
          edge[1] = 0;
          end[1][0] = 0;
          end[1][1] = mF00 / mB;
          if (end[1][1] < 0 || end[1][1] > 1)
          {
            end[1][1] = 0.5;
          }
        }
      }
    }

    function ComputeMinimumParameters(edge, end, parameters) {
      var delta = end[1][1] - end[0][1];
      var h0 = delta * (-mB * end[0][0] + mC * end[0][1] - mE);
      if (h0 >= 0)
      {
        if (edge[0] == 0)
        {
          parameters[0] = 0;
          parameters[1] = GetClampedRoot(mC, mG00, mG01);
        } else if (edge[0] == 1)
        {
          parameters[0] = 1;
          parameters[1] = GetClampedRoot(mC, mG10, mG11);
        } else
        {
          parameters[0] = end[0][0];
          parameters[1] = end[0][1];
        }
      } else
      {
        var h1 = delta * (-mB * end[1][0] + mC * end[1][1] - mE);
        if (h1 <= 0)
        {
          if (edge[1] == 0)
          {
            parameters[0] = 0;
            parameters[1] = GetClampedRoot(mC, mG00, mG01);
          } else if (edge[1] == 1)
          {
            parameters[0] = 1;
            parameters[1] = GetClampedRoot(mC, mG10, mG11);
          } else
          {
            parameters[0] = end[1][0];
            parameters[1] = end[1][1];
          }
        } else // h0 < 0 and h1 > 0
        {
          var z = Math.min(Math.max(h0 / (h0 - h1), 0), 1);
          var omz = 1 - z;
          parameters[0] = omz * end[0][0] + z * end[1][0];
          parameters[1] = omz * end[0][1] + z * end[1][1];
        }
      }
    }

    var seg0Dir = this.p1.clone().sub(this.p0);
    var seg1Dir = segment.p1.clone().sub(segment.p0);
    var segDiff = this.p0.clone().sub(segment.p0);
    var mA = seg0Dir.dot(seg0Dir);
    var mB = seg0Dir.dot(seg1Dir);
    var mC = seg1Dir.dot(seg1Dir);
    var mD = seg0Dir.dot(segDiff);
    var mE = seg1Dir.dot(segDiff);

    var mF00 = mD;
    var mF10 = mF00 + mA;
    var mF01 = mF00 - mB;
    var mF11 = mF10 - mB;

    var mG00 = -mE;
    var mG10 = mG00 - mB;
    var mG01 = mG00 + mC;
    var mG11 = mG10 + mC;

    if (mA > 0 && mC > 0)
    {
      var sValue = [];
      sValue[0] = GetClampedRoot(mA, mF00, mF10);
      sValue[1] = GetClampedRoot(mA, mF01, mF11);

      var classify = [];
      for (var i = 0; i < 2; ++i)
      {
        if (sValue[i] <= 0)
        {
          classify[i] = -1;
        } else if (sValue[i] >= 1)
        {
          classify[i] = +1;
        } else
        {
          classify[i] = 0;
        }
      }

      if (classify[0] == -1 && classify[1] == -1)
      {
        // The minimum must occur on s = 0 for 0 <= t <= 1.
        result.parameters[0] = 0;
        result.parameters[1] = GetClampedRoot(mC, mG00, mG01);
      } else if (classify[0] == +1 && classify[1] == +1)
      {
        // The minimum must occur on s = 1 for 0 <= t <= 1.
        result.parameters[0] = 1;
        result.parameters[1] = GetClampedRoot(mC, mG10, mG11);
      } else
      {
        // The line dR/ds = 0 varersects the domain [0,1]^2 in a
        // nondegenerate segment.  Compute the endpoints of that segment,
        // end[0] and end[1].  The edge[i] flag tells you on which domain
        // edge end[i] lives: 0 (s=0), 1 (s=1), 2 (t=0), 3 (t=1).
        var edge = [];
        var end = new Array(2)
        for (let i = 0; i < end.length; i++)
          end[i] = new Array(2);

        ComputevarIntersection(sValue, classify, edge, end);

        // The directional derivative of R along the segment of
        // varersection is
        //   H(z) = (end[1][1]-end[1][0])*dR/dt((1-z)*end[0] + z*end[1])
        // for z in [0,1].  The formula uses the fact that dR/ds = 0 on
        // the segment.  Compute the minimum of H on [0,1].
        ComputeMinimumParameters(edge, end, result.parameters);
      }
    } else
    {
      if (mA > 0)
      {
        // The Q-segment is degenerate ( segment.point0 and  segment.p0 are the same point) and
        // the quadratic is R(s,0) = a*s^2 + 2*d*s + f and has (half)
        // first derivative F(t) = a*s + d.  The closests P-point is
        // varerior to the P-segment when F(0) < 0 and F(1) > 0.
        result.parameters[0] = GetClampedRoot(mA, mF00, mF10);
        result.parameters[1] = 0;
      } else if (mC > 0)
      {
        // The P-segment is degenerate ( this.point0 and  this.p0 are the same point) and
        // the quadratic is R(0,t) = c*t^2 - 2*e*t + f and has (half)
        // first derivative G(t) = c*t - e.  The closests Q-point is
        // varerior to the Q-segment when G(0) < 0 and G(1) > 0.
        result.parameters[0] = 0;
        result.parameters[1] = GetClampedRoot(mC, mG00, mG01);
      } else
      {
        // P-segment and Q-segment are degenerate.
        result.parameters[0] = 0;
        result.parameters[1] = 0;
      }
    }


    result.closests[0] = this.p0.clone().multiplyScalar(1 - result.parameters[0]).add(
      this.p1.clone().multiplyScalar(result.parameters[0]));
    result.closests[1] = segment.p0.clone().multiplyScalar(1 - result.parameters[1]).add(
      segment.p1.clone().multiplyScalar(result.parameters[1]));
    var diff = result.closests[0].clone().sub(result.closests[1]);
    result.sqrDistance = diff.dot(diff);
    result.distance = Math.sqrt(result.sqrDistance);
    return result;


  }

  /**
   * 射线到射线的距离
   * @param  {Ray} ray
   */
  distanceRay(ray) { }

  /**
   * 线段到直线的距离
   * @param  {Ray} ray
   */
  distanceLine(line) { }

  //---Intersect---------------------------------------------------
  intersectSegment(segment) {
    
  }

  //---Offset------------------------------------------------------
  /**
   * 线段偏移
   * @param {Vector3} normal  偏移平面法线
   * @param {Vector3} direction 偏移方向
   * @param {Number} distance 偏移距离
   */
  offset(normal, direction, distance) {
    normal = normal || new Vector3(0, 1, 0);
    var direction = p1.clone().sub(p0).normalize();
    var tandir = direction.clone().cross(normal).normalize();
    var result = {}
    result.arr = [
      tandir.clone().multiplyScalar(distance).add(p0),
      tandir.clone().multiplyScalar(distance).add(p1)
    ];
    result.direction = direction
    result.tandir = tandir
    return result
  }
}

export function segment(p0, p1) {
  return new Segment(p0, p1);
}

