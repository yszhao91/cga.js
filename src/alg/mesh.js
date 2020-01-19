import { Vector3 } from "../math/Vector3";
import { Vector2 } from "../math/Vector2";

export function indexable(obj, refIndexInfo = { index: 0 }, force = false) {
    if (obj instanceof Array)
    {
        for (var i = 0; i < obj.length; i++)
            indexable(obj[i], refIndexInfo);
    }
    else if (obj instanceof Object)
    {
        if (obj.index === undefined)
            obj.index = refIndexInfo.index++;
        else if (force)
            obj.index = refIndexInfo.index++;
    }

}

export function triangListToBuffer(vertices, triangleList) {
    indexable(triangleList);
    var indices = [];
    triangleList.forall((v) => {
        indices.push(v.index);
    })

    return toBuffer(vertices, indices);
}

/**
 * 
 * @param {Array<Verctor3|Number>} vertices 
 * @param {Array<Number>} indices
 * @param {Array<Verctor2|Number>} uvs
 */
export function toBuffer(inVertices, indices, inUvs = []) {
    var vertices = []
    if (inVertices[0] instanceof Vector3)
    {
        for (let i = 0; i < inVertices.length; i++)
        {
            const v = inVertices[i];
            vertices.push(v.x, v.y, v.z);
        }
    } else
    {
        vertices = inVertices;
    }
    var uvs = []
    if (inUvs.length > 0 && inUvs[0] instanceof Vector2)
    {
        for (let i = 0; i < inUvs.length; i++)
        {
            const uv = inVertices[i];
            uvs.push(uv.x, uv.y);
        }
    } else
    {
        uvs = inUvs;
    }
    var verticesBuffer = new Float32Array(vertices);
    var uvsBuffer = new Float32Array(uvs.length === 0 ? vertices.length / 3 * 2 : uvs);
    var indicesBuffer = new ((verticesBuffer.length / 3) > 65535 ? Uint32Array : Uint16Array)(indices);


    return { verticesBuffer, uvsBuffer, indicesBuffer };
}

