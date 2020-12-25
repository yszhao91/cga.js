import { Plane } from '@/struct/3d/Plane';
import { Triangle } from '@/struct/3d/Triangle';
import { Face3, Geometry } from 'three';
import { v3 } from '../math/Vec3';

export function splitPlaneGeometry(plane: Plane, geometry: Geometry) {
    for (let i = 0; i < geometry.faces.length; i++) {
        var face: Face3 = geometry.faces[i];
        var a = geometry.vertices[face.a];
        var b = geometry.vertices[face.b];
        var c = geometry.vertices[face.c];

        var splitres = plane.splitTriangle([a, b, c].map((e: any) => v3().copy(e)));
    }
}
