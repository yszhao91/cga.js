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
}