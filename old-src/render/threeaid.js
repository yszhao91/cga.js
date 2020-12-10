import { BufferGeometry, BufferAttribute, MeshStandardMaterial, Mesh, DoubleSide } from "three"
import { extrude } from "../alg/shape"
import { toBuffer } from "../alg/mesh";
import { triangulation } from "../alg/triangulation";
export function toGeometryBuffer(vertices, triangles, uvs) {

    var buffer = toBuffer(vertices, triangles, uvs)

    var geometry = new BufferGeometry()
    geometry.setIndex(new BufferAttribute(buffer.indicesBuffer, 1));
    geometry.setAttribute('position', new BufferAttribute(buffer.verticesBuffer, 3));
    geometry.setAttribute('uv', new BufferAttribute(buffer.uvsBuffer, 2));
    geometry.computeVertexNormals();

    return geometry
}

/**
 * shape 挤压后转几何体
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 */
export function extrudeToGeometryBuffer(shape, arg_path, options) {

    var extrudeRes = extrude(shape, arg_path, options);
    return toGeometryBuffer(extrudeRes.vertices, extrudeRes.triangles, extrudeRes.uvs);
}

/**
 *  shape 挤压后转Mesh
 * @param {*} shape 
 * @param {*} arg_path 
 * @param {*} options 
 * @param {*} material 
 */
export function extrudeToMesh(shape, arg_path, options, material = new MeshStandardMaterial({ color: 0xeeaabb, side: DoubleSide })) {
    var geometry = extrudeToGeometryBuffer(shape, arg_path, options)
    return new Mesh(geometry, material);
}


/**
 * 三角剖分后转成几何体
 * 只考虑XY平面
 * @param {*} boundary 
 * @param {*} hole 
 * @param {*} options 
 */
export function trianglutionToGeometryBuffer(boundary, hole = [], options) {
    var triangles = triangulation(boundary, hole, options)
    var vertices = [...boundary, ...hole.flat(Infinity)]
    var uvs = [];
    vertices.reduce((acc, v) => {
        acc.push(v.x, v.y);
        return acc;
    }, uvs);

    var geometry = toGeometryBuffer(vertices, triangles, uvs);

    return geometry;
}