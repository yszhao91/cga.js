// import { Vec2 } from '../math/Vec2';
// import { Vec3 } from '../math/Vec3';
// import { Thing } from '../render/thing';
// import { Path } from '../struct/3d/Path';
// import { EndType } from './extrude';
// import { PI_TWO } from '../math/Math';
// export class PolyNode extends Thing {
//     m_polygon: Vec2[];
//     m_AllPolys: any[];
//     isOpen: boolean;
//     m_Index: number;
//     m_jointype: any;
//     m_endtype: EndType = EndType.Butt;

//     constructor() {
//         super();
//         this.m_polygon = []
//         this.m_AllPolys = [];
//         this.isOpen = false;
//         this.m_Index = 0;
//     }

//     /**
//      * 多边形是否是一个多边形
//      */
//     get IsHoleNode() {
//         let result = true;
//         let node = this.parent;
//         while (node !== null) {
//             result = !result;
//             node = node.parent;
//         }
//         return result;
//     }

//     get ChildCount() {
//         return this.children.length;
//     }

//     get Contour() {
//         return this.m_polygon;
//     }

//     add(thing: any): any {
//         super.add(thing);
//         this.m_Index = this.children.length;
//     }

//     getNext() {
//         if (this.children.length > 0)
//             return this.children[0];
//         else
//             return this.getNextSiblingUp();
//     }

//     getNextSiblingUp() {
//         if (this.parent === null)
//             return null;
//         else if (this.m_Index === this.parent.m_Childs.length - 1)
//             return this.parent.getNextSiblingUp();
//         else
//             return this.parent.m_Childs[this.m_Index + 1];
//     };

// }
// export class Offset {
//     m_delta = 0;
//     m_miterLim: number = 0;
//     m_sinA: number = 0;
//     m_sin: number = 0;
//     m_StepsPerRad = 0;
//     m_destPolys: any = [];
//     m_srcPoly: any = [];
//     m_polyNodes = new PolyNode();
//     m_lowest: Vec2 = new Vec2;

//     arcTolerance: number;
//     miterLimit: number;

//     static def_arc_tolerance = 0.25
//     m_cos: number = 0;
//     m_normals: Vec2[] = [];
//     m_destPoly: any;

//     constructor(miterLimit = 2, arcTolerance = 0.25) {
//         this.miterLimit = miterLimit;
//         this.arcTolerance = arcTolerance;
//         this.m_lowest.x = -1;
//     }

//     addPath(path: Vec2[], jointType: any, endType: EndType) {
//         var highI = path.length - 1;
//         if (highI < 0)
//             return;
//         var newNode = new PolyNode();
//         newNode.m_jointype = jointType;
//         newNode.m_endtype = endType;
//         //从路径中剥离重复点，并将索引移到最低点
//         if (endType === EndType.etClosedLine || endType === EndType.etClosedPolygon)
//             while (highI > 0 && path[0].equals(path[highI]))
//                 highI--;
//         //newNode.m_polygon.set_Capacity(highI + 1);

//         newNode.m_polygon.push(path[0]);
//         var j = 0, k = 0;
//         for (var i = 1; i <= highI; i++)
//             if (!newNode.m_polygon[j].equals(path[i])) {
//                 j++;
//                 newNode.m_polygon.push(path[i]);
//                 if (path[i].y > newNode.m_polygon[k].y
//                     || (path[i].y === newNode.m_polygon[k].y && path[i].x < newNode.m_polygon[k].x))
//                     k = j;
//             }
//         if (endType === EndType.etClosedPolygon && j < 2) return;

//         this.m_polyNodes.add(newNode);

//         //如果此路径的最低pt低于所有其他路径，则更新m_lowest
//         if (endType !== EndType.etClosedPolygon)
//             return;
//         if (this.m_lowest.x < 0)
//             this.m_lowest = new Vec2(this.m_polyNodes.ChildCount - 1, k);
//         else {
//             var ip = this.m_polyNodes.children[this.m_lowest.x].m_polygon[this.m_lowest.y];
//             if (newNode.m_polygon[k].y > ip.L_YZL
//                 || (newNode.m_polygon[k].y === ip.Y && newNode.m_polygon[k].x < ip.x))
//                 this.m_lowest = new Vec2(this.m_polyNodes.ChildCount - 1, k);
//         }
//     }

//     GetUnitNormal = function (pt1: Vec2, pt2: Vec2) {
//         var dx = (pt2.x - pt1.x);
//         var dy = (pt2.y - pt1.y);
//         if ((dx === 0) && (dy === 0))
//             return new Vec2(0, 0);
//         var f = 1 / Math.sqrt(dx * dx + dy * dy);
//         dx *= f;
//         dy *= f;
//         return new Vec2(dy, -dx);
//     };

//     DoRound(j: number, k: number) {
//         var a = Math.atan2(this.m_sinA,
//             this.m_normals[k].x * this.m_normals[j].x + this.m_normals[k].y * this.m_normals[j].y);

//         var steps = Math.max(Math.round(this.m_StepsPerRad * Math.abs(a)), 1);

//         var X = this.m_normals[k].x,
//             Y = this.m_normals[k].y,
//             X2;
//         for (var i = 0; i < steps; ++i) {
//             this.m_destPoly.push(new Vec2(
//                 this.m_srcPoly[j].X + X * this.m_delta,
//                 this.m_srcPoly[j].Y + Y * this.m_delta));
//             X2 = X;
//             X = X * this.m_cos - this.m_sin * Y;
//             Y = X2 * this.m_sin + Y * this.m_cos;
//         }
//         this.m_destPoly.push(new Vec2(
//             this.m_srcPoly[j].X + this.m_normals[j].x * this.m_delta,
//             this.m_srcPoly[j].Y + this.m_normals[j].y * this.m_delta));
//     };

//     DoSquare(j: number, k: number) {
//         var dx = Math.tan(Math.atan2(this.m_sinA,
//             this.m_normals[k].x * this.m_normals[j].x + this.m_normals[k].y * this.m_normals[j].y) / 4);
//         this.m_destPoly.push(new Vec2(
//             this.m_srcPoly[j].X + this.m_delta * (this.m_normals[k].x - this.m_normals[k].y * dx),
//             this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[k].y + this.m_normals[k].x * dx)));
//         this.m_destPoly.push(new Vec2(
//             this.m_srcPoly[j].X + this.m_delta * (this.m_normals[j].x + this.m_normals[j].y * dx),
//             this.m_srcPoly[j].Y + this.m_delta * (this.m_normals[j].y - this.m_normals[j].x * dx)));
//     };

//     DoMiter(j: number, k: number, r: number) {
//         var q = this.m_delta / r;
//         this.m_destPoly.push(new Vec2(
//             this.m_srcPoly[j].X + (this.m_normals[k].x + this.m_normals[j].x) * q,
//             this.m_srcPoly[j].Y + (this.m_normals[k].y + this.m_normals[j].y) * q));
//     };

//     OffsetPoint(j: number, k: number, jointype: any) {
//         //cross product ...
//         this.m_sinA = (this.m_normals[k].x * this.m_normals[j].y - this.m_normals[j].x * this.m_normals[k].y);

//         if (this.m_sinA === 0) {
//             return k;
//         }

//         /*
//                 else if (this.m_sinA < 0.00005 && this.m_sinA > -0.00005)
//         {
//                     console.log(this.m_sinA);
//               return k;
//         }
//         */
//         /*
//                 if (Math.abs(this.m_sinA * this.m_delta) < 1.0)
//                 {
//                     //dot product ...
//                     var cosA = (this.m_normals[k].X * this.m_normals[j].X + this.m_normals[j].Y * this.m_normals[k].Y);
//                     if (cosA > 0) // angle ==> 0 degrees
//                     {
//                         this.m_destPoly.push(new Vec2(this.m_srcPoly[j].X + this.m_normals[k].X * this.m_delta,
//                             this.m_srcPoly[j].Y + this.m_normals[k].Y * this.m_delta));
//                         return k;
//                     }
//                     //else angle ==> 180 degrees
//                 }
//         */
//         else if (this.m_sinA > 1)
//             this.m_sinA = 1.0;
//         else if (this.m_sinA < -1)
//             this.m_sinA = -1.0;
//         if (this.m_sinA * this.m_delta < 0) {
//             this.m_destPolys.push(new Vec2(this.m_srcPoly[j].X + this.m_normals[k].x * this.m_delta,
//                 this.m_srcPoly[j].Y + this.m_normals[k].y * this.m_delta));
//             this.m_destPolys.push(new Vec2().copy(this.m_srcPoly[j]));
//             this.m_destPolys.push(new Vec2(this.m_srcPoly[j].X + this.m_normals[j].x * this.m_delta,
//                 this.m_srcPoly[j].Y + this.m_normals[j].y * this.m_delta));
//         }
//         else
//             switch (jointype) {
//                 case ClipperLib.JoinType.jtMiter:
//                     {
//                         var r = 1 + (this.m_normals[j].x * this.m_normals[k].x + this.m_normals[j].y * this.m_normals[k].y);
//                         if (r >= this.m_miterLim)
//                             this.DoMiter(j, k, r);
//                         else
//                             this.DoSquare(j, k);
//                         break;
//                     }
//                 case ClipperLib.JoinType.jtSquare:
//                     this.DoSquare(j, k);
//                     break;
//                 case ClipperLib.JoinType.jtRound:
//                     this.DoRound(j, k);
//                     break;
//             }
//         k = j;
//         return k;
//     };
//     near_zero(val: any) {
//         return (val > -1E-20) && (val < 1E-20);
//     };

//     DoOffset(delta: number) {
//         this.m_destPolys = new Array();
//         this.m_delta = delta;
//         //if Zero offset, just copy any CLOSED polygons to m_p and return ...
//         if (this.near_zero(delta)) {
//             //this.m_destPolys.set_Capacity(this.m_polyNodes.ChildCount);
//             for (var i = 0; i < this.m_polyNodes.ChildCount; i++) {
//                 var node = this.m_polyNodes.children[i];
//                 if (node.m_endtype === EndType.etClosedPolygon)
//                     this.m_destPolys.push(node.m_polygon);
//             }
//             return;
//         }
//         //see offset_triginometry3.svg in the documentation folder ...
//         if (this.miterLimit > 2)
//             this.m_miterLim = 2 / (this.miterLimit * this.miterLimit);
//         else
//             this.m_miterLim = 0.5;
//         var y;
//         if (this.arcTolerance <= 0)
//             y = Offset.def_arc_tolerance;
//         else if (this.arcTolerance > Math.abs(delta) * Offset.def_arc_tolerance)
//             y = Math.abs(delta) * Offset.def_arc_tolerance;
//         else
//             y = this.arcTolerance;
//         //see offset_triginometry2.svg in the documentation folder ...
//         var steps = 3.14159265358979 / Math.acos(1 - y / Math.abs(delta));
//         this.m_sin = Math.sin(PI_TWO / steps);
//         this.m_cos = Math.cos(PI_TWO / steps);
//         this.m_StepsPerRad = steps / PI_TWO;
//         if (delta < 0)
//             this.m_sin = -this.m_sin;
//         //this.m_destPolys.set_Capacity(this.m_polyNodes.ChildCount * 2);
//         for (var i = 0; i < this.m_polyNodes.ChildCount; i++) {
//             var node = this.m_polyNodes.children[i];
//             this.m_srcPoly = node.m_polygon;
//             var len = this.m_srcPoly.length;
//             if (len === 0 || (delta <= 0 && (len < 3 || node.m_endtype !== EndType.etClosedPolygon)))
//                 continue;
//             this.m_destPolys = new Array();
//             if (len === 1) {
//                 if (node.m_jointype === ClipperLib.JoinType.jtRound) {
//                     var X = 1,
//                         Y = 0;
//                     for (var j = 1; j <= steps; j++) {
//                         this.m_destPolys.push(new Vec2(this.m_srcPoly[0].X + X * delta, this.m_srcPoly[0].Y + Y * delta));
//                         var X2 = X;
//                         X = X * this.m_cos - this.m_sin * Y;
//                         Y = X2 * this.m_sin + Y * this.m_cos;
//                     }
//                 }
//                 else {
//                     var X = -1,
//                         Y = -1;
//                     for (var j = 0; j < 4; ++j) {
//                         this.m_destPolys.push(new Vec2(this.m_srcPoly[0].X + X * delta, this.m_srcPoly[0].Y + Y * delta));
//                         if (X < 0)
//                             X = 1;
//                         else if (Y < 0)
//                             Y = 1;
//                         else
//                             X = -1;
//                     }
//                 }
//                 this.m_destPolys.push(this.m_destPolys);
//                 continue;
//             }
//             //build m_normals ...
//             this.m_normals.length = 0;
//             //this.m_normals.set_Capacity(len);
//             for (var j = 0; j < len - 1; j++)
//                 this.m_normals.push(this.GetUnitNormal(this.m_srcPoly[j], this.m_srcPoly[j + 1]));
//             if (node.m_endtype === EndType.etClosedLine || node.m_endtype === EndType.etClosedPolygon)
//                 this.m_normals.push(this.GetUnitNormal(this.m_srcPoly[len - 1], this.m_srcPoly[0]));
//             else
//                 this.m_normals.push(new Vec2().copy(this.m_normals[len - 2]));
//             if (node.m_endtype === EndType.etClosedPolygon) {
//                 var k = len - 1;
//                 for (var j = 0; j < len; j++)
//                     k = this.OffsetPoint(j, k, node.m_jointype);
//                 this.m_destPolys.push(this.m_destPolys);
//             }
//             else if (node.m_endtype === EndType.etClosedLine) {
//                 var k = len - 1;
//                 for (var j = 0; j < len; j++)
//                     k = this.OffsetPoint(j, k, node.m_jointype);
//                 this.m_destPolys.push(this.m_destPolys);
//                 this.m_destPolys = new Array();
//                 //re-build m_normals ...
//                 var n = this.m_normals[len - 1];
//                 for (var j = len - 1; j > 0; j--)
//                     this.m_normals[j] = new Vec2(-this.m_normals[j - 1].x, -this.m_normals[j - 1].y);
//                 this.m_normals[0] = new Vec2(-n.x, -n.y);
//                 k = 0;
//                 for (var j = len - 1; j >= 0; j--)
//                     k = this.OffsetPoint(j, k, node.m_jointype);
//                 this.m_destPolys.push(this.m_destPolys);
//             }
//             else {
//                 var k = 0;
//                 for (var j = 1; j < len - 1; ++j)
//                     k = this.OffsetPoint(j, k, node.m_jointype);
//                 var pt1;
//                 if (node.m_endtype === EndType.etOpenButt) {
//                     var j = len - 1;
//                     pt1 = new Vec2(this.m_srcPoly[j].X + this.m_normals[j].x * delta, this.m_srcPoly[j].Y + this.m_normals[j].y * delta);
//                     this.m_destPolys.push(pt1);
//                     pt1 = new Vec2(this.m_srcPoly[j].X - this.m_normals[j].x * delta, this.m_srcPoly[j].Y - this.m_normals[j].y * delta);
//                     this.m_destPolys.push(pt1);
//                 }
//                 else {
//                     var j = len - 1;
//                     k = len - 2;
//                     this.m_sinA = 0;
//                     this.m_normals[j] = new Vec2(-this.m_normals[j].x, -this.m_normals[j].y);
//                     if (node.m_endtype === EndType.etOpenSquare)
//                         this.DoSquare(j, k);
//                     else
//                         this.DoRound(j, k);
//                 }
//                 //re-build m_normals ...
//                 for (var j = len - 1; j > 0; j--)
//                     this.m_normals[j] = new Vec2(-this.m_normals[j - 1].x, -this.m_normals[j - 1].y);
//                 this.m_normals[0] = new Vec2(-this.m_normals[1].x, -this.m_normals[1].y);
//                 k = len - 1;
//                 for (var j = k - 1; j > 0; --j)
//                     k = this.OffsetPoint(j, k, node.m_jointype);
//                 if (node.m_endtype === EndType.etOpenButt) {
//                     pt1 = new Vec2(this.m_srcPoly[0].X - this.m_normals[0].x * delta, this.m_srcPoly[0].Y - this.m_normals[0].y * delta);
//                     this.m_destPolys.push(pt1);
//                     pt1 = new Vec2(this.m_srcPoly[0].X + this.m_normals[0].x * delta, this.m_srcPoly[0].Y + this.m_normals[0].y * delta);
//                     this.m_destPolys.push(pt1);
//                 }
//                 else {
//                     k = 1;
//                     this.m_sinA = 0;
//                     if (node.m_endtype === EndType.etOpenSquare)
//                         this.DoSquare(0, 1);
//                     else
//                         this.DoRound(0, 1);
//                 }
//                 this.m_destPolys.push(this.m_destPolys);
//             }
//         }
//     };

//     Area(poly: Vec2[]) {
//         if (!Array.isArray(poly))
//             return 0;
//         var cnt = poly.length;
//         if (cnt < 3)
//             return 0;
//         var a = 0;
//         for (var i = 0, j = cnt - 1; i < cnt; ++i) {
//             a += (poly[j].x + poly[i].x) * (poly[j].y - poly[i].y);
//             j = i;
//         }
//         return -a * 0.5;
//     };
//     Orientation(poly: Vec2[]) {
//         return this.Area(poly) >= 0;
//     };


//     FixOrientations() {
//         //fixup orientations of all closed paths if the orientation of the
//         //closed path with the lowermost vertex is wrong ...
//         if (this.m_lowest.x >= 0 && !this.Orientation(this.m_polyNodes.children[this.m_lowest.x].m_polygon)) {
//             for (var i = 0; i < this.m_polyNodes.ChildCount; i++) {
//                 var node = this.m_polyNodes.children[i];
//                 if (node.m_endtype === EndType.etClosedPolygon
//                     || (node.m_endtype === EndType.etClosedLine && this.Orientation(node.m_polygon)))
//                     node.m_polygon.reverse();
//             }
//         }
//         else {
//             for (var i = 0; i < this.m_polyNodes.ChildCount; i++) {
//                 var node = this.m_polyNodes.children[i];
//                 if (node.m_endtype === EndType.etClosedLine
//                     && !this.Orientation(node.m_polygon))
//                     node.m_polygon.reverse();
//             }
//         }
//     };


//     Execute() {
//         var a = arguments,
//             ispolytree = a[0] instanceof ispolytree;
//         if (!ispolytree) // function (solution, delta)
//         {
//             var solution = a[0],
//                 delta = a[1];
//             ClipperLib.Clear(solution);
//             this.FixOrientations();
//             this.DoOffset(delta);
//             //now clean up 'corners' ...
//             var clpr = new ClipperLib.Clipper(0);
//             clpr.AddPaths(this.m_destPolys, ClipperLib.PolyType.ptSubject, true);
//             if (delta > 0) {
//                 clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
//             }
//             else {
//                 var r = ClipperLib.Clipper.GetBounds(this.m_destPolys);
//                 var outer = [];
//                 outer.push(new Vec2(r.left - 10, r.bottom + 10));
//                 outer.push(new Vec2(r.right + 10, r.bottom + 10));
//                 outer.push(new Vec2(r.right + 10, r.top - 10));
//                 outer.push(new Vec2(r.left - 10, r.top - 10));
//                 clpr.AddPath(outer, ClipperLib.PolyType.ptSubject, true);
//                 clpr.ReverseSolution = true;
//                 clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNegative, ClipperLib.PolyFillType.pftNegative);
//                 if (solution.length > 0)
//                     solution.splice(0, 1);
//             }
//             //console.log(JSON.stringify(solution));
//         }
//         else // function (polytree, delta)
//         {
//             var solution = a[0],
//                 delta = a[1];
//             solution.Clear();
//             this.FixOrientations();
//             this.DoOffset(delta);
//             //now clean up 'corners' ...
//             var clpr = new ClipperLib.Clipper(0);
//             clpr.AddPaths(this.m_destPolys, ClipperLib.PolyType.ptSubject, true);
//             if (delta > 0) {
//                 clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftPositive, ClipperLib.PolyFillType.pftPositive);
//             }
//             else {
//                 var r = ClipperLib.Clipper.GetBounds(this.m_destPolys);
//                 var outer = new ClipperLib.Paths();
//                 outer.push(new Vec2(r.left - 10, r.bottom + 10));
//                 outer.push(new Vec2(r.right + 10, r.bottom + 10));
//                 outer.push(new Vec2(r.right + 10, r.top - 10));
//                 outer.push(new Vec2(r.left - 10, r.top - 10));
//                 clpr.AddPath(outer, ClipperLib.PolyType.ptSubject, true);
//                 clpr.ReverseSolution = true;
//                 clpr.Execute(ClipperLib.ClipType.ctUnion, solution, ClipperLib.PolyFillType.pftNegative, ClipperLib.PolyFillType.pftNegative);
//                 //remove the outer PolyNode rectangle ...
//                 if (solution.ChildCount() === 1 && solution.Childs()[0].ChildCount() > 0) {
//                     var outerNode = solution.Childs()[0];
//                     //solution.Childs.set_Capacity(outerNode.ChildCount);
//                     solution.Childs()[0] = outerNode.Childs()[0];
//                     solution.Childs()[0].m_Parent = solution;
//                     for (var i = 1; i < outerNode.ChildCount(); i++)
//                         solution.AddChild(outerNode.Childs()[i]);
//                 }
//                 else
//                     solution.Clear();
//             }
//         }
//     };
// }