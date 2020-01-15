import { gPrecision, clamp } from "../math/Math";
import { clone, toFixed } from "../utils/array";
import { Quaternion } from "../math/Quaternion";
import { Vector3 } from "../math/Vector3";
export function vectorCompare(a, b) {
    if (a.x === b.x)
    {
        if (a.y === b.y)
            return a.z - b.z
        else
            return a.y - b.y;
    }
    else
        return a.x - b.x;
}
export function vectorYCompare(a, b) {
    return a.y - b.y;
}
export function vectorXCompare(a, b) {
    return a.x - b.x;
}
/**
 * 线段按照是否相连在一起分块
 * @param {Array} arg_segments 
 */
export function block(arg_segments) {
    const segments = clone(arg_segments);
    for (let i = 0; i < segments.length; i++)
    {
        const seg = segments[0];
    }
}

/**
 * 清除不能形成多边形的线段
 * @param {Array} arg_segments 
 */
export function clearRedundancy(arg_segments) {
    const segments = clone(arg_segments);
    for (let i = 0; i < segments.length; i++)
    {
        const seg = segments[0];
    }
}


export function calcRelation(segments, seg, precision = gPrecision) {
    var intersectSegs = [];//别切割的直线
    var intersectSegs = [];//被切割成新的线段
    var splitSegs = []; //seg被已有的线段切割

    for (let i = 0; i < segments.length; i++)
    {
        const element = segments[i];
        let res = element.distanceSegment(seg)
        if (res.distance < precision)
        {
            //相交

        }

    }

    return {
        intersectSeg,
        splitSegments,
        splitSegs
    }

}
/**
 * 点相邻线段按角度排序
 * @param {*} point 
 * @param {*} edges 
 */
export function sortAdjEdges(point, edges) {
    var YAxis = Vector3.UnitY;
    var ZAxis = Vector3.UnitZ;
    edges.forEach(e => {
        if (e.p0.index === point.index)
            e.dir = e.direction.clone();
        else
            e.dir = e.direction.clone().negate();

        e.Y_angle = Math.acos(clamp(e.dir.dot(YAxis), -1, 1));
        if (e.dir.clone().cross(YAxis).dot(ZAxis) < 0)
            e.Y_angle = Math.PI * 2 - e.Y_angle;
    });

    edges.sort((a, b) => a.Y_angle - b.Y_angle)
}

/**
 * 找出一块相交线段且在同一个平面的最外圈
 * @param {*} segs 
 */
export function boundSegments(segments) {
    const points = segments.flat(2);
    points.sort(vectorCompare)

    //变换到XY平面
    var quanternion = new Quaternion();
    quanternion.setFromUnitVectors(v3(0, 0, 1), v3(0, 0, 1))

    //在平面上Y最大者一定是边界点，所相连的边一定有边界
    points.sort(vectorYCompare);

    var anchorPoint = points[0];
    var adjEdges = anchorPoint.edges;

    sortAdjEdges(anchorPoint, adjEdges);

    //定位到的第一条边界线段
    var anchorEdge = adjEdges[0];

    //接下来只需要搜索下一个点中相邻边 由锚点边出发 顺时针方向第一个边或者逆时针方向最后一个边
    //如此往返便可以找到所有边界

}

export class segmentGroup {
    constructor() {
        this.vertices = [];
        this.edges = [];
        this.faces = [];
        this.precision = gPrecision;
    }
    get vIndex() {
        return this.vertices.length;
    }
    get eIndex() {
        return this.edges.length;
    }
    get fIndex() {
        return this.faces.length;
    }
    remove(args) {
        args = Array.isArray(args) ? args : [args]
        if (args[0] instanceof Segment)
        {
            for (let i = 0; i < args.length; i++)
            {
                let segment = args[i];
                var index = this.edges.findIndex(e => e === segment);
                if (index === -1)
                    return;

                this.segments.splice(index, 1);


                //判断点是否是孤点
                segment.p0.edges.splice(segment.p0.edges.indexOf(segment), 1)
                segment.p1.edges.splice(segment.p1.edges.indexOf(segment), 1)
                if (segment.p0.edges.length === 0)
                    this.remove(segment.p0)
                if (segment.p1.edges.length === 0)
                    this.remove(segment.p1)
            }

            //重新计算线段索引
            for (let i = 0; i < this.edges.length; i++)
                this.edges[i].index = i
        }
        else if (args[0] instanceof Vector3)
        {
            for (let i = 0; i < args.length; i++)
            {
                let vertex = args[i];
                var index = this.edges.findIndex(e => e === vertex);
                if (index === -1)
                    return;

                this.segments.splice(index, 1);
            }

            //重新计算线段索引
            for (let i = index; i < this.vertices.length; i++)
                this.vertices[i].index = i
        }
    }

    add(segment) {
        //---查找去重复-------------
        segment = clone(segment);
        toFixed(segment, this.precision);
        let p0 = this.vertices.find(v => {
            v.equals(segment.p0)
        })
        let p1 = this.vertices.find(v => {
            v.equals(segment.p1)
        })
        if (!p0)
        {
            p0 = segment.p0;
            p0.index = this.vIndex;
            this.vertices.push(p0);
            segment[0] = p0;
        }
        if (!p1)
        {
            p1 = segment.p1;
            p1.index = this.vIndex;
            this.vertices.push(p1);
            segment[1] = p1;
        }

        let testsegment = this.segments.find((seg) => {
            return (segment.p0.index === seg.p0.index && segment.p1.index === seg.p1.index) || (segment.p0.index === seg.p1.index && segment.p0.index === seg.p1.index)
        })
        if (testsegment)
            segment = testsegment
        else
        {
            segment.index = this.vIndex;
            this.segments.push(segment);
        }
        segment.p0.edges = [segment]
        segment.p1.edges = [segment]
        //-----------开始计算相交关系--------------------
        [intersectSeg, splitSegments, splitSegs] = calcRelation(this.segments, segment);
        this.remove(intersectSeg);
        this.add(splitSegments);
        this.add(splitSegs);
    }
}