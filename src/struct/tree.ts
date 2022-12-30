export abstract class Tree {
    /**
     * N个子节点
     */
    N: number = 2048;

    /**
     * 最大深度
     */
    maxDepth: number = 8;

    /**
     * 子节点
     */
    children!: this[];

    /**
     * 容器，用来放满足该层级条件的数据
     */
    objects: any[] = [];

    constructor(N?: number) {
        if (N !== void 0) {
            this.children = new Array(N)
            this.N = N;
        }

    }

    abstract add(obj: any): any;

    abstract remove(obj: any): any;

    abstract find(condition: any): any;
}