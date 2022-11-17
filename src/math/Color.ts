
export class Color {
    _r: number = 0.0;
    _g: number = 0.0;
    _b: number = 0.0;
    _a: number = 1.0;

    constructor(r: number = 0, g: number = 0, b: number = 0, a: number = 1) {
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
            // this.fire('change', 'r', this._r, value)
        }
    }

    get g() {
        return this._g;
    }

    set g(value) {
        if (this._g !== value) {
            this._g = value;
            // this.fire('change', 'g', this._g, value)
        }
    }

    get b() {
        return this._g;
    }

    set b(value) {
        if (this._b !== value) {
            this._b = value;
            // this.fire('change', 'b', this._b, value)
        }
    }

    get a() {
        return this._a;
    }

    set a(value) {
        if (this._a !== value) {
            this._a = value;
            // this.fire('change', 'a', this._a, value)
        }
    }


    set(value: any) {

        if (value && value.isColor) {
            this.copy(value);
        } else if (typeof value === 'number') {
            this.setHex(value);
        }
        if (typeof value === 'string') {
            if (value.indexOf("#") === 0)
                this.setHexCssString(value);
            else
                console.error("未匹配的颜色数据")
        }

        return this;
    }

    setHex(hex: number) {
        hex = Math.floor(hex);

        this._r = (hex >> 16 & 255) / 255;
        this._g = (hex >> 8 & 255) / 255;
        this._b = (hex & 255) / 255;

        return this;
    }

    setHexCssString(style: string) {
        let m: any = /^\#([A-Fa-f\d]+)$/.exec(style)
        // hex color

        const hex = m[1];
        const size = hex.length;

        if (size === 3) {

            // #ff0
            this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
            this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
            this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;

            return this;

        } else if (size === 6) {

            // #ff0000
            this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255;
            this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255;
            this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255;
            return this;
        }
        else if (size === 4) {

            // #ff0000
            this.r = parseInt(hex.charAt(0) + hex.charAt(0), 16) / 255;
            this.g = parseInt(hex.charAt(1) + hex.charAt(1), 16) / 255;
            this.b = parseInt(hex.charAt(2) + hex.charAt(2), 16) / 255;
            this.a = parseInt(hex.charAt(3) + hex.charAt(3), 16) / 255;
            return this;
        }
        else if (size === 8) {

            // #ff0000
            this.r = parseInt(hex.charAt(0) + hex.charAt(1), 16) / 255;
            this.g = parseInt(hex.charAt(2) + hex.charAt(3), 16) / 255;
            this.b = parseInt(hex.charAt(4) + hex.charAt(5), 16) / 255;
            this.a = parseInt(hex.charAt(6) + hex.charAt(7), 16) / 255;
            return this;
        }
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
        this._a = color.a;

        return this;
    }

    equals(c: this) {
        return (c.r === this.r) && (c.g === this.g) && (c.b === this.b) && (c.a === this.a);
    }

    toArray(array: number[] = [], offset = 0) {

        array[offset] = this.r;
        array[offset + 1] = this.g;
        array[offset + 2] = this.b;
        array[offset + 3] = this.a;

        return array;
    }

    fromArray(array: number[] = [], offset = 0) {

        this.r = array[offset];
        this.g = array[offset + 1];
        this.b = array[offset + 2];

        if (array.length >= 4 + offset)
            this.a = array[offset + 3];

        return array;
    }

    private byteToFloat(val: number) {
        return val / 255.0;
    };

    private floatToByte(val: number) {
        return val === 1.0 ? 255.0 : (val * 256.0) | 0;
    };

    getHexCssString() {
        let r = this.floatToByte(this._r).toString(16);
        if (r.length < 2) {
            r = `0${r}`;
        }
        let g = this.floatToByte(this._g).toString(16);
        if (g.length < 2) {
            g = `0${g}`;
        }
        let b = this.floatToByte(this._b).toString(16);
        if (b.length < 2) {
            b = `0${b}`;
        }
        if (this._a < 1) {
            let hexAlpha = this.floatToByte(this._a).toString(16);
            if (hexAlpha.length < 2) {
                hexAlpha = `0${hexAlpha}`;
            }
            return `#${r}${g}${b}${hexAlpha}`;
        }
        return `#${r}${g}${b}`;
    }

    toJSON() {
        return this.getHexCssString();
    }

}