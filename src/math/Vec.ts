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

    static max(array: ArrayLike<number>) {

        if (array.length === 0) return - Infinity;

        var max = array[0];

        for (var i = 1, l = array.length; i < l; ++i) {

            if (array[i] > max) max = array[i];

        }

        return max;
    }
}