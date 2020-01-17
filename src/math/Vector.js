/**
 * 暂不使用
 */
export class Vector extends Array {
    constructor(n) {
        super();
        while (n-- > 0)
        {
            arr[arr.length] = 0;
        }
    }
    get size() {
        return Math.sqrt(this.sizeSq())
    }

    get sizeSq() {
        this.reduce((acc, val) => acc += val * val)
    }
    normalize() {
        var size = this.size;

    }

    multiply(v) {
        for (let i = 0; i < this.length; i++)
            this[i] *= scalar;
    }


    multiplyScalar(scalar) {
        for (let i = 0; i < this.length; i++)
            this[i] *= scalar;

        return this;
    }

    divide(v) {
        for (let i = 0; i < this.length; i++)
            this[i] *= scalar;
    }

    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar)
    }


}