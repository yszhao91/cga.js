/**
 * 暂不使用
 */
export class Vec extends Array {
    constructor(n: number) {
        super();
        while (n-- > 0) {
            this[this.length] = 0;
        }
    }


}