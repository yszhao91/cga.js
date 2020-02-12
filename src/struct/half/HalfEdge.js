export class HalfEdge {
    constructor(vertex,face) {
        this.vertex = vertex;
        this.face =face;
        this.next = null;
        this.prev = null;
        this.pair = null;
    }
}