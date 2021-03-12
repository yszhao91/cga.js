import { BufferGeometry } from "src/render/geometry";
import { CircleBufferGeometry, Mesh, MeshBasicMaterial, Object3D, SpriteMaterial } from "_three@0.125.2@three";

export class BreathLight extends Object3D {
    constructor() {
        super();
        const geometry = new CircleBufferGeometry(1, 32);
        geometry.rotateX(-Math.PI / 2);

        var mat1 = new MeshBasicMaterial({ color: 0x1f9ccf });
        var mat2 = new MeshBasicMaterial({ color: 0x1f9ccf, transparent: true, opacity: 0.7 });
        var mat3 = new MeshBasicMaterial({ color: 0x1f9ccf, transparent: true, opacity: 0.1 });

        var mesh1 = new Mesh(geometry, mat1)
        var mesh2 = new Mesh(geometry, mat2)
        var mesh3 = new Mesh(geometry, mat3)
        mesh2.scale.set(2, 2, 2)
        mesh3.scale.set(4, 4, 4)

        this.add(mesh1, mesh2, mesh3);
    }


}
