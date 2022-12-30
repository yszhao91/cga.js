import { Tree } from "./tree";

/**
 * 
 */
export class BSP extends Tree {

    constructor() {
        super(2);
    }

    get pos() {
        return this.children[0];
    }

    get neg() {
        return this.children[1];
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