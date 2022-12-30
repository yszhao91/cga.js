import { Tree } from "./tree";

export class QuatTree extends Tree {

    constructor() {
        super(4);
    }

    add(obj: any) {
        throw new Error("Method not implemented.");
    }
    remove(obj: any) {
        throw new Error("Method not implemented.");
    }
    find(condition: any) {
        throw new Error("Method not implemented.");
    }
}