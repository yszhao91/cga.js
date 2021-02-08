"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Float64BufferAttribute = exports.Float32BufferAttribute = exports.Uint32BufferAttribute = exports.Int32BufferAttribute = exports.Uint16BufferAttribute = exports.Int16BufferAttribute = exports.Uint8ClampedBufferAttribute = exports.Uint8BufferAttribute = exports.Int8BufferAttribute = exports.BufferAttribute = void 0;
var Vec2_1 = require("../math/Vec2");
var Vec3_1 = require("../math/Vec3");
var Vec4_1 = require("../math/Vec4");
var _vector = new Vec3_1.Vec3();
var BufferAttribute = /** @class */ (function () {
    /**
     *
     * @param array {BufferArray} Buffer数据
     * @param itemSize 单元长度，vec3是3，vec4是4
     * @param normalized
     */
    function BufferAttribute(array, itemSize, normalized) {
        this.isBufferAttribute = true;
        this.name = '';
        this.array = array;
        this.itemSize = itemSize;
        this.count = array !== undefined ? array.length / itemSize : 0;
        this.normalized = normalized === true;
        // this.usage = StaticDrawUsage;
        this.updateRange = { offset: 0, count: -1 };
        this.version = 0;
    }
    Object.defineProperty(BufferAttribute.prototype, "needsUpdate", {
        set: function (value) {
            if (value === true)
                this.version++;
        },
        enumerable: false,
        configurable: true
    });
    BufferAttribute.prototype.onUpload = function (callback) {
        this.onUploadCallback = callback;
        return this;
    };
    BufferAttribute.prototype.setUsage = function (usage) {
        return this;
    };
    BufferAttribute.prototype.copy = function (source) {
        this.name = source.name;
        this.array = new source.array.constructor(source.array);
        this.itemSize = source.itemSize;
        this.count = source.count;
        this.normalized = source.normalized;
        // this.usage = source.usage;
        return this;
    };
    BufferAttribute.prototype.copyAt = function (index1, attribute, index2) {
        index1 *= this.itemSize;
        index2 *= attribute.itemSize;
        for (var i = 0, l = this.itemSize; i < l; i++) {
            this.array[index1 + i] = attribute.array[index2 + i];
        }
        return this;
    };
    BufferAttribute.prototype.copyArray = function (array) {
        this.array.set(array);
        return this;
    };
    BufferAttribute.prototype.copyColorsArray = function (colors) {
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
    };
    BufferAttribute.prototype.copyVec2sArray = function (vectors) {
        var array = this.array, offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVec2sArray(): vector is undefined', i);
                vector = new Vec2_1.Vec2();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
        }
        return this;
    };
    BufferAttribute.prototype.copyVec3sArray = function (vectors) {
        var array = this.array, offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVec3sArray(): vector is undefined', i);
                vector = new Vec3_1.Vec3();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
        }
        return this;
    };
    BufferAttribute.prototype.copyVec4sArray = function (vectors) {
        var array = this.array, offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVec4sArray(): vector is undefined', i);
                vector = new Vec4_1.Vec4();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
            array[offset++] = vector.w;
        }
        return this;
    };
    BufferAttribute.prototype.applyMat3 = function (m) {
        for (var i = 0, l = this.count; i < l; i++) {
            _vector.x = this.getX(i);
            _vector.y = this.getY(i);
            _vector.z = this.getZ(i);
            _vector.applyMat3(m);
            this.setXYZ(i, _vector.x, _vector.y, _vector.z);
        }
        return this;
    };
    BufferAttribute.prototype.applyMat4 = function (m) {
        for (var i = 0, l = this.count; i < l; i++) {
            _vector.x = this.getX(i);
            _vector.y = this.getY(i);
            _vector.z = this.getZ(i);
            _vector.applyMat4(m);
            this.setXYZ(i, _vector.x, _vector.y, _vector.z);
        }
        return this;
    };
    BufferAttribute.prototype.applyNormalMat = function (m) {
        for (var i = 0, l = this.count; i < l; i++) {
            _vector.x = this.getX(i);
            _vector.y = this.getY(i);
            _vector.z = this.getZ(i);
            _vector.applyNormalMat(m);
            this.setXYZ(i, _vector.x, _vector.y, _vector.z);
        }
        return this;
    };
    BufferAttribute.prototype.transformDirection = function (m) {
        for (var i = 0, l = this.count; i < l; i++) {
            _vector.x = this.getX(i);
            _vector.y = this.getY(i);
            _vector.z = this.getZ(i);
            _vector.transformDirection(m);
            this.setXYZ(i, _vector.x, _vector.y, _vector.z);
        }
        return this;
    };
    BufferAttribute.prototype.set = function (value, offset) {
        if (offset === undefined)
            offset = 0;
        this.array.set(value, offset);
        return this;
    };
    BufferAttribute.prototype.getX = function (index) {
        return this.array[index * this.itemSize];
    };
    BufferAttribute.prototype.setX = function (index, x) {
        this.array[index * this.itemSize] = x;
        return this;
    };
    BufferAttribute.prototype.getY = function (index) {
        return this.array[index * this.itemSize + 1];
    };
    BufferAttribute.prototype.setY = function (index, y) {
        this.array[index * this.itemSize + 1] = y;
        return this;
    };
    BufferAttribute.prototype.getZ = function (index) {
        return this.array[index * this.itemSize + 2];
    };
    BufferAttribute.prototype.setZ = function (index, z) {
        this.array[index * this.itemSize + 2] = z;
        return this;
    };
    BufferAttribute.prototype.getW = function (index) {
        return this.array[index * this.itemSize + 3];
    };
    BufferAttribute.prototype.setW = function (index, w) {
        this.array[index * this.itemSize + 3] = w;
        return this;
    };
    BufferAttribute.prototype.setXY = function (index, x, y) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        return this;
    };
    BufferAttribute.prototype.setXYZ = function (index, x, y, z) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        return this;
    };
    BufferAttribute.prototype.setXYZW = function (index, x, y, z, w) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        this.array[index + 3] = w;
        return this;
    };
    BufferAttribute.prototype.clone = function () {
        return new BufferAttribute(this.array, this.itemSize).copy(this);
    };
    BufferAttribute.prototype.toJSON = function () {
        return {
            itemSize: this.itemSize,
            type: this.array.constructor.name,
            array: Array.prototype.slice.call(this.array),
            normalized: this.normalized
        };
    };
    return BufferAttribute;
}());
exports.BufferAttribute = BufferAttribute;
var Int8BufferAttribute = /** @class */ (function (_super) {
    __extends(Int8BufferAttribute, _super);
    function Int8BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Int8Array(array);
        _this = _super.call(this, new Int8Array(array), itemSize, normalized) || this;
        return _this;
    }
    return Int8BufferAttribute;
}(BufferAttribute));
exports.Int8BufferAttribute = Int8BufferAttribute;
var Uint8BufferAttribute = /** @class */ (function (_super) {
    __extends(Uint8BufferAttribute, _super);
    function Uint8BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Uint8Array(array);
        _this = _super.call(this, array, itemSize, normalized) || this;
        return _this;
    }
    return Uint8BufferAttribute;
}(BufferAttribute));
exports.Uint8BufferAttribute = Uint8BufferAttribute;
var Uint8ClampedBufferAttribute = /** @class */ (function (_super) {
    __extends(Uint8ClampedBufferAttribute, _super);
    function Uint8ClampedBufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Uint8ClampedArray(array);
        _this = _super.call(this, array, itemSize, normalized) || this;
        return _this;
    }
    return Uint8ClampedBufferAttribute;
}(BufferAttribute));
exports.Uint8ClampedBufferAttribute = Uint8ClampedBufferAttribute;
var Int16BufferAttribute = /** @class */ (function (_super) {
    __extends(Int16BufferAttribute, _super);
    function Int16BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Int16Array(array);
        _this = _super.call(this, array, itemSize, normalized) || this;
        return _this;
    }
    return Int16BufferAttribute;
}(BufferAttribute));
exports.Int16BufferAttribute = Int16BufferAttribute;
var Uint16BufferAttribute = /** @class */ (function (_super) {
    __extends(Uint16BufferAttribute, _super);
    function Uint16BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Uint16Array(array);
        _this = _super.call(this, array, itemSize) || this;
        return _this;
    }
    return Uint16BufferAttribute;
}(BufferAttribute));
exports.Uint16BufferAttribute = Uint16BufferAttribute;
var Int32BufferAttribute = /** @class */ (function (_super) {
    __extends(Int32BufferAttribute, _super);
    function Int32BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Int32Array(array);
        _this = _super.call(this, array, itemSize, normalized) || this;
        return _this;
    }
    return Int32BufferAttribute;
}(BufferAttribute));
exports.Int32BufferAttribute = Int32BufferAttribute;
var Uint32BufferAttribute = /** @class */ (function (_super) {
    __extends(Uint32BufferAttribute, _super);
    function Uint32BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Uint32Array(array);
        _this = _super.call(this, array, itemSize, normalized) || this;
        return _this;
    }
    return Uint32BufferAttribute;
}(BufferAttribute));
exports.Uint32BufferAttribute = Uint32BufferAttribute;
var Float32BufferAttribute = /** @class */ (function (_super) {
    __extends(Float32BufferAttribute, _super);
    function Float32BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Float32Array(array);
        _this = _super.call(this, array, itemSize, normalized) || this;
        return _this;
    }
    return Float32BufferAttribute;
}(BufferAttribute));
exports.Float32BufferAttribute = Float32BufferAttribute;
var Float64BufferAttribute = /** @class */ (function (_super) {
    __extends(Float64BufferAttribute, _super);
    function Float64BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        var _this = this;
        if (Array.isArray(array))
            array = new Float64Array(array);
        _this = _super.call(this, array, itemSize, normalized) || this;
        return _this;
    }
    return Float64BufferAttribute;
}(BufferAttribute));
exports.Float64BufferAttribute = Float64BufferAttribute;
