import { Mat3 } from "../math/Mat3";
import { Mat4 } from "../math/Mat4";
import { Vec2 } from "../math/Vec2";
import { Vec3 } from "../math/Vec3";
import { Vec4 } from "../math/Vec4";


var _vector = new Vec3();

export class BufferAttribute {
    name: string;
    array: ArrayLike<number>;
    itemSize: number;
    // usage: Usage;
    updateRange: { offset: number; count: number };
    version: number;
    normalized: boolean;
    count: number;

    readonly isBufferAttribute: true = true;
    /**
     * 
     * @param array {BufferArray} Buffer数据
     * @param itemSize 单元长度，vec3是3，vec4是4
     * @param normalized 
     */
    constructor(array: ArrayLike<number>, itemSize: number, normalized?: boolean) {
        this.name = '';

        this.array = array;
        this.itemSize = itemSize;
        this.count = array !== undefined ? array.length / itemSize : 0;
        this.normalized = normalized === true;

        // this.usage = StaticDrawUsage;
        this.updateRange = { offset: 0, count: - 1 };

        this.version = 0;
    }


    set needsUpdate(value: boolean) {
        if (value === true)
            this.version++;
    }


    onUploadCallback?: () => void;
    onUpload(callback: () => void): this {
        this.onUploadCallback = callback;

        return this;
    }
    setUsage(usage: any): this {
        return this
    }

    copy(source: BufferAttribute): this {
        this.name = source.name;
        this.array = new (source.array as unknown as any).constructor(source.array);
        this.itemSize = source.itemSize;
        this.count = source.count;
        this.normalized = source.normalized;

        // this.usage = source.usage;

        return this;
    }

    copyAt(index1: number, attribute: BufferAttribute, index2: number) {

        index1 *= this.itemSize;
        index2 *= attribute.itemSize;

        for (var i = 0, l = this.itemSize; i < l; i++) {

            this.array[index1 + i] = attribute.array[index2 + i];

        }

        return this;

    }

    copyArray(array: ArrayLike<number>) {

        this.array.set(array);

        return this;

    }

    copyColorsArray(colors: { r: number; g: number; b: number }[]) {

        var array = this.array, offset = 0;

        for (var i = 0, l = colors.length; i < l; i++) {

            var color = colors[i];

            // if (color === undefined) {

            //     console.warn('THREE.BufferAttribute.copyColorsArray(): color is undefined', i);
            //     color = new Color();

            // }

            // array[offset++] = color.r;
            // array[offset++] = color.g;
            // array[offset++] = color.b;

        }

        return this;

    }

    copyVector2sArray(vectors: { x: number; y: number }[]) {

        var array = this.array, offset = 0;

        for (var i = 0, l = vectors.length; i < l; i++) {

            var vector = vectors[i];

            if (vector === undefined) {

                console.warn('THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i);
                vector = new Vec2();

            }

            array[offset++] = vector.x;
            array[offset++] = vector.y;

        }

        return this;

    }

    copyVector3sArray(vectors: { x: number; y: number; z: number }[]) {

        var array = this.array, offset = 0;

        for (var i = 0, l = vectors.length; i < l; i++) {

            var vector = vectors[i];

            if (vector === undefined) {

                console.warn('THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i);
                vector = new Vec3();

            }

            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;

        }

        return this;

    }

    copyVector4sArray(vectors: { x: number; y: number; z: number; w: number }[]) {

        var array = this.array, offset = 0;

        for (var i = 0, l = vectors.length; i < l; i++) {

            var vector = vectors[i];

            if (vector === undefined) {

                console.warn('THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i);
                vector = new Vec4();

            }

            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
            array[offset++] = vector.w;

        }

        return this;

    }

    applyMatrix3(m: Mat3) {

        for (var i = 0, l = this.count; i < l; i++) {

            _vector.x = this.getX(i);
            _vector.y = this.getY(i);
            _vector.z = this.getZ(i);

            _vector.applyMatrix3(m);

            this.setXYZ(i, _vector.x, _vector.y, _vector.z);

        }

        return this;

    }

    applyMatrix4(m: Mat4) {

        for (var i = 0, l = this.count; i < l; i++) {

            _vector.x = this.getX(i);
            _vector.y = this.getY(i);
            _vector.z = this.getZ(i);

            _vector.applyMatrix4(m);

            this.setXYZ(i, _vector.x, _vector.y, _vector.z);

        }

        return this;

    }

    applyNormalMatrix(m: Mat3) {

        for (var i = 0, l = this.count; i < l; i++) {

            _vector.x = this.getX(i);
            _vector.y = this.getY(i);
            _vector.z = this.getZ(i);

            _vector.applyNormalMatrix(m);

            this.setXYZ(i, _vector.x, _vector.y, _vector.z);

        }

        return this;

    }

    transformDirection(m) {

        for (var i = 0, l = this.count; i < l; i++) {

            _vector.x = this.getX(i);
            _vector.y = this.getY(i);
            _vector.z = this.getZ(i);

            _vector.transformDirection(m);

            this.setXYZ(i, _vector.x, _vector.y, _vector.z);

        }

        return this;

    }

    set(value, offset) {

        if (offset === undefined) offset = 0;

        this.array.set(value, offset);

        return this;

    }

    getX(index: number) {

        return this.array[index * this.itemSize];

    }

    setX(index: number, x: number) {

        this.array[index * this.itemSize] = x;

        return this;

    }

    getY(index: number) {

        return this.array[index * this.itemSize + 1];

    }

    setY(index: number, y: number) {

        this.array[index * this.itemSize + 1] = y;

        return this;

    }

    getZ(index: number) {

        return this.array[index * this.itemSize + 2];

    }

    setZ(index: number, z: number) {

        this.array[index * this.itemSize + 2] = z;

        return this;

    }

    getW(index: number) {

        return this.array[index * this.itemSize + 3];

    }

    setW(index: number, w: number) {

        this.array[index * this.itemSize + 3] = w;

        return this;

    }

    setXY(index: number, x: number, y: number) {

        index *= this.itemSize;

        this.array[index + 0] = x;
        this.array[index + 1] = y;

        return this;

    }

    setXYZ(index: number, x: number, y: number, z: number) {

        index *= this.itemSize;

        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;

        return this;

    }

    setXYZW(index: number, x: number, y: number, z: number, w: number) {

        index *= this.itemSize;

        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        this.array[index + 3] = w;

        return this;

    }
    clone(): BufferAttribute {
        return new BufferAttribute(this.array, this.itemSize).copy(this);
    }




    toJSON(): {
        itemSize: number,
        type: string,
        array: number[],
        normalized: boolean
    } {

        return {
            itemSize: this.itemSize,
            type: this.array.constructor.name,
            array: Array.prototype.slice.call(this.array),
            normalized: this.normalized
        };

    }

}

export class Int8BufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize, normalized);
    }

}


export class Uint8BufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize, normalized);
    }

}


export class Uint8ClampedBufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize, normalized);
    }

}


export class Int16BufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize, normalized);
    }

}

export class Uint16BufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize)
    }

}


export class Int32BufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize, normalized);
    }

}

export class Uint32BufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize, normalized);
    }

}

export class Float32BufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize, normalized);
    }

}

export class Float64BufferAttribute extends BufferAttribute {

    constructor(array: any, itemSize: number, normalized: boolean = false) {
        super(array, itemSize, normalized);
    }

}
