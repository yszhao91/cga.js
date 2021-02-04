import { indexable } from "@/render/mesh";
import { clone } from "./common";
import { isInOnePlane, rotateByUnitVectors } from "./common";
import { Vec3 } from '../math/Vec3'
import { Line } from "@/struct/3d/Line";
import { Orientation } from "@/struct/data/type";
import { Point } from "@/struct/3d/Point";

class ConvexHull {
  _hull: Point[] = []
  _originPoints: Point[] | undefined = undefined
  _normal = Vec3.UnitZ;

  /**
   * Create a convex hull from points.
   * @param {Point[]} pts 二维点集
   * @param {Object} options 
   */
  constructor(pts: Point[], options?: {
    planeNormal: any,
    method?: string
  }) {
    if (pts.length < 3) {
      throw Error('Cannot build a simplex out of < 3 points')
    }

    this._originPoints = pts
    const _newPoints = clone(pts)
    indexable(_newPoints)
    let _planeNormal = options?.planeNormal
    if (!_planeNormal) {
      const _plane = isInOnePlane(_newPoints)
      if (_plane) {
        _planeNormal = _plane.normal
      }
    }

    if (_planeNormal) {
      if (this._normal.dot(_planeNormal) < 0) {
        _planeNormal.negate()
      }

      rotateByUnitVectors(_newPoints, _planeNormal, this._normal)
      _newPoints.forEach(pt => pt.z = 0)

      const [minPt, maxPt] = this.getMinMax(_newPoints)
      const line0 = new Line(minPt, maxPt),
        line1 = new Line(maxPt, minPt)
      this.addBoundSeg(line0, _newPoints)
      this.addBoundSeg(line1, _newPoints)
    }
  }

  getMinMax(points: Point[]): [Point, Point] {
    let maxXp = points[0]
    let minXp = points[0]

    for (let i = 1; i < points.length; i++) {
      const pt = points[i]
      if (maxXp.x < pt.x)
        maxXp = pt
      else if (minXp.x > pt.x)
        minXp = pt
    }

    return [minXp, maxXp]
  }

  addBoundSeg(line: Line, points: Point[]) {
    const _outerPoints: Point[] = []
    points.forEach(pt => {
      if (line.orientationPoint(pt, this._normal) === Orientation.Positive) {
        _outerPoints.push(pt)
      }
    })
    return _outerPoints
  }


  /* ============== Getter & Setter ============ */

  /**
   * Getter for hull result.
   */
  get hull() {
    if (this._hull.length === 0 && this._originPoints) {
      return clone(this._originPoints)
    }
    return this._hull;
  }
}

function quickHull(points: Point[]) {
  const _convexHull = new ConvexHull(points);
  return _convexHull.hull;
}

export {
  ConvexHull,
  quickHull
}