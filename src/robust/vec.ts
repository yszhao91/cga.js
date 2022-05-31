import Decimal from 'decimal.js'

export class Vec {

    _data: Array<Decimal> = []
    constructor(..._vs: Decimal[]) {
        for (let i = 0; i < _vs.length; i++) {
            this._data[i] = _vs[i];
        }
    }
    copy(normal: Vec) {
        for (let i = 0; i < normal.dim; i++)
            this._data[i] = new Decimal(normal._data[i]);
    }

    get dim(): number {
        return this._data.length;
    }

    check(v: Vec) {
        return this.dim === v.dim;
    }

    cross(v: Vec) {
        if (!this.check(v))
            return;


    }

    get extentSq(): Decimal {
        let res = new Decimal(0);
        for (let i = 0; i < this._data.length; i++)
            res = res.add(this._data[i].mul(this._data[i]))

        return res;
    }

    /**
     * 长度
     */
    get extent(): Decimal {
        let res = this.extentSq;
        return res.squareRoot()
    }

    dot(v: Vec): Decimal {
        if (!this.check(v))
            console.error('dim not equal')

        let res = new Decimal(0);
        for (let i = 0; i < this._data.length; i++) {
            const ti = this._data[i];
            const vi = v._data[i];

            res = res.add(ti.mul(vi));
        }

        return res;
    }
}