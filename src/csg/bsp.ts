
import { Node } from "./node";
import { Polygon } from "./polygon";

export class BSP {
    tree: Node;
    constructor(faces: Polygon[]) {
        this.tree = new Node(faces);
    }

    //差
    sub(other: BSP) {
        const a = this.tree.clone();
        const b = this.tree.clone();
    }

    //和
    union(other: BSP) {
    }

    //交
    intersect(other: BSP) {
    }
}