import { Vec3 } from "../math/Vec3";
import { Vec2 } from "../math/Vec2";
import { forall } from '../utils/array';

export interface IGeometry {
    vertices: number[];
    normals?: number[];
    indices?: number[];
    uvs?: number[];
    uvs2?: number[];
    tangents?: number[];
}


export interface IGeometryBuffer {
    vertices: Float32Array;
    indices?: Uint32Array | Uint16Array
    normals?: Float32Array;
    uvs?: Float32Array;
    uvs2?: Float32Array;
    tangents?: Uint32Array[];
}

export function indexable(obj: any[] | any, refIndexInfo = { index: 0 }, force = false) {
    if (obj instanceof Array) {
        for (var i = 0; i < obj.length; i++)
            indexable(obj[i], refIndexInfo);
    }
    else if (obj instanceof Object) {
        if (obj.index === undefined)
            obj.index = refIndexInfo.index++;
        else if (force)
            obj.index = refIndexInfo.index++;
    }

}

export function triangListToBuffer(vertices: Vec3[], triangleList: Vec3[]) {
    indexable(triangleList);
    const indices: number[] = [];
    forall(triangleList, (v: Vec3 | any) => {
        indices.push(v.index);
    })
    return toGeoBuffer(vertices, indices);
}


/**
 * 顶点纹理坐标所以转化为buffer数据
 * @param {Array<Verctor3|Number>} vertices 
 * @param {Array<Number>} indices
 * @param {Array<Verctor2|Number>} uvs
 */
export function toGeoBuffer(inVertices: number[] | Vec3[], indices: number[] | Uint32Array | Uint16Array, inUvs: Vec2[] | number[] = []): IGeometryBuffer {
    var vertices: any[] = []
    if (Vec3.isVec3(inVertices[0])) {
        for (let i = 0; i < inVertices.length; i++) {
            const v = <Vec3>inVertices[i];
            vertices.push(v.x, v.y, v.z);
        }
    } else {
        vertices = inVertices;
    }
    var uvs: number[] = []
    if (inUvs.length > 0 && Vec2.isVec2(inUvs[0])) {
        for (let i = 0; i < inUvs.length; i++) {
            const uv = <Vec2>inUvs[i];
            uvs.push(uv.x, uv.y);
        }
    } else {
        uvs = <number[]>inUvs;
    }
    var verticesBuffer = new Float32Array(vertices);
    var uvsBuffer = uvs.length === 0 ? new Float32Array(vertices.length / 3 * 2) : new Float32Array(uvs);
    var indicesBuffer
    if (indices instanceof Uint32Array || indices instanceof Uint16Array)
        indicesBuffer = indices
    else
        indicesBuffer = new ((verticesBuffer.length / 3) > 65535 ? Uint32Array : Uint16Array)(indices);


    return {
        vertices: verticesBuffer,
        uvs: uvsBuffer,
        indices: indicesBuffer
    };
}

