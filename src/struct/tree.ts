export class Tree {
    N: number = 2;//数量决定是N叉树；
    children!: this[];
    findFn!: Function;
    objects: any[] = [];

    constructor(N: number = -1) {
        this.N = N;
        if (N !== -1)
            this.children = new Array(N)
    }

    setObject(obj: any, generateFn: Function, findFn: Function) {
        generateFn(this, obj);
        this.findFn = findFn;
    }

    add(obj: any) {

    }

    remove(obj: any) {

    }

    find(condition: any) {

        this.findFn(this, condition);
    }
}