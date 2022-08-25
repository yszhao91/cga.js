import { EventHandler } from "../render/eventhandler";

export class Color extends EventHandler {
    _r: number =0.0;
    _g: number =0.0;
    _b: number =0.0;
    _a: number =1.0;
    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
        super();
        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;
    }

    get isColor() {
        return true;
    }

    get r() {
        return this._r;
    }

    set r(value) {
        if (this._r !== value) {
            this._r = value;
            this.fire('change', 'r', this._r, value)
        }
    }

    get g() {
        return this._g;
    }

    set g(value) {
        if (this._g !== value) {
            this._g = value;
            this.fire('change', 'g', this._g, value)
        }
    }

    get b() {
        return this._g;
    }

    set b(value) {
        if (this._b !== value) {
            this._b = value;
            this.fire('change', 'b', this._b, value)
        }
    }

    get a() {
        return this._a;
    }

    set a(value) {
        if (this._a !== value) {
            this._a = value;
            this.fire('change', 'a', this._a, value)
        }
    }


    set(value: any) {

        if (value && value.isColor) {
            this.copy(value);
        } else if (typeof value === 'number') {
            this.setHex(value);
        }

        return this;
    }

    setHex(hex: number) {

        hex = Math.floor(hex);
        if (hex > 0xffffff) {
            this._r = (hex >> 32 & 255) / 255;
            this._g = (hex >> 16 & 255) / 255;
            this._b = (hex >> 8 & 255) / 255;
            this._a = (hex & 255) / 255;
        } else {
            this._r = (hex >> 16 & 255) / 255;
            this._g = (hex >> 8 & 255) / 255;
            this._b = (hex & 255) / 255;
        }

        return this;

    }

    setRGB(r: number, g: number, b: number, a: number = 1.0) {

        this._r = r;
        this._g = g;
        this._b = b;
        this._a = a;

        return this;

    }

    clone() {
        return new (this.constructor as any)(this.r, this.g, this.b, this.a);
    }

    copy(color: this) {
        this._r = color.r;
        this._g = color.g;
        this._b = color.b;

        return this;
    }

    equals(c: this) {
        return (c.r === this.r) && (c.g === this.g) && (c.b === this.b);
    }

    toArray(array: number[] = [], offset = 0) {

        array[offset] = this.r;
        array[offset + 1] = this.g;
        array[offset + 2] = this.b;
        array[offset + 3] = this.a;

        return array;
    }

    getHex() {
        return (this.r * 255) << 32 ^ (this.g * 255) << 16 ^ (this.b * 255) << 8 ^ (this.a * 255) << 0;
    }

    toJSON() {
        return this.getHex();
    }

}