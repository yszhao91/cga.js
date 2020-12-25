"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = void 0;
var Vec3_1 = require("../../math/Vec3");
var Math_1 = require("../../math/Math");
var Polyline_1 = require("./Polyline");
var Path = /** @class */ (function (_super) {
    __extends(Path, _super);
    function Path(vs) {
        var _this = _super.call(this, vs) || this;
        Object.setPrototypeOf(_this, Path.prototype);
        _this._closed = false;
        _this.init();
        return _this;
    }
    Object.defineProperty(Path.prototype, "closed", {
        get: function () {
            return this._closed;
        },
        set: function (val) {
            this._closed = val;
        },
        enumerable: false,
        configurable: true
    });
    Path.prototype.init = function () {
        if (this.length === 0)
            return;
        this[0].len = 0;
        this[0].tlen = 0;
        this[0].direction = this[1].clone().sub(this[0]).normalize();
        for (var i = 1; i < this.length; i++) {
            var e = this[i];
            e.len = this[i].distanceTo(this[i - 1]);
            e.tlen = this[i - 1].tlen + e.len;
            this[i].direction = this[i].clone().sub(this[i - 1]).normalize();
        }
        if (this._closed) {
            this.get(-1).direction.copy(this[0]).sub(this.get(-1)).normalize();
        }
        for (var i = 0; i < this.length + 2; i++) {
            // this[i % this.length].tangent = this[i % this.length].direction.clone()
            //     .add(this[(i + 1) % this.length]).normalize();
            this[i % this.length].tangent = this[i % this.length].direction.clone();
        }
        if (!this._closed) {
            this[0].tangent.copy(this[0].direction);
            this.get(-1).tangent.copy(this.get(-1).direction);
        }
    };
    Object.defineProperty(Path.prototype, "tlen", {
        get: function () {
            if (this.length === 0)
                return 0;
            return Math.max(this.get(-1).tlen, this[0].tlen);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * 截取一段从from到to的path
     * @param {Number} from
     * @param {Number} to
     */
    Path.prototype.splitByFromToDistance = function (from, to) {
        if (from === void 0) { from = 0; }
        if (to === void 0) { to = 0; }
        if (to <= from)
            return null;
        var newPath = new Path([]);
        for (var i = 0; i < this.length - 1; i++) {
            var pt = this[i];
            var ptnext = this[i + 1];
            if (pt.tlen <= from && ptnext.tlen >= from) {
                var v3 = new Vec3_1.Vec3().lerpVecs(pt, ptnext, (from - pt.tlen) / (ptnext.tlen - pt.tlen));
                newPath.add(v3);
            }
            if (pt.tlen > from && pt.tlen < to) {
                newPath.add(pt.clone());
            }
            if (pt.tlen <= to && ptnext.tlen >= to) {
                var v3 = new Vec3_1.Vec3().lerpVecs(pt, ptnext, (to - pt.tlen) / (ptnext.tlen - pt.tlen));
                newPath.add(v3);
                return newPath;
            }
        }
        return newPath;
    };
    /**
     * 从起点出发到距离等于distance位置  的坐标 二分查找
     * @param {Number} distance
     */
    Path.prototype.getPointByDistance = function (arg_distance, left, right) {
        if (left === void 0) { left = 0; }
        if (right === void 0) { right = this.length - 1; }
        var distance = Math_1.clamp(arg_distance, 0, this.get(-1).tlen);
        if (distance !== arg_distance)
            return null;
        if (right - left === 1) {
            return {
                isNode: false,
                point: new Vec3_1.Vec3().lerpVecs(this[left], this[right], (distance - this[left].tlen) / this[right].len)
            };
        }
        var mid = (left + right) >> 1;
        if (this[mid].tlen > distance)
            return this.getPointByDistance(distance, left, mid);
        else if (this[mid].tlen < distance)
            return this.getPointByDistance(distance, mid, right);
        else
            return {
                isNode: true,
                point: new Vec3_1.Vec3().lerpVecs(this[left], this[right], (distance - this[left].tlen) / this[right].len)
            };
    };
    /**
     * 从起点出发到距离等于distance位置  的坐标 二分查找
     * @param {Number} distance
     */
    Path.prototype.getPointByDistancePure = function (arg_distance, left, right) {
        if (left === void 0) { left = 0; }
        if (right === void 0) { right = this.length - 1; }
        var distance = Math_1.clamp(arg_distance, 0, this.get(-1).tlen);
        if (distance !== arg_distance)
            return null;
        if (right - left === 1) {
            return new Vec3_1.Vec3().lerpVecs(this[left], this[right], (distance - this[left].tlen) / this[right].len);
        }
        var mid = (left + right) >> 1;
        if (this[mid].tlen > distance)
            return this.getPointByDistancePure(distance, left, mid);
        else if (this[mid].tlen < distance)
            return this.getPointByDistancePure(distance, mid, right);
        else
            return this[mid].clone();
    };
    /**
     * 平均切割为 splitCount 段
     * @param {Number} splitCount
     * @returns {Path} 新的path
     */
    Path.prototype.splitAverage = function (splitCount) {
        var tlen = this.last.tlen;
        var perlen = tlen / splitCount;
        var res = [];
        var curJ = 0;
        for (var i = 0; i <= splitCount; i++) {
            var plen = i * perlen;
            for (var j = curJ; j < this.length - 1; j++) {
                if (this[j].tlen <= plen && this[j + 1].tlen >= plen) {
                    var p = new Vec3_1.Vec3().lerpVecs(this[j], this[j + 1], (plen - this[j].tlen) / (this[j + 1].len));
                    res.push(p);
                    curJ = j;
                    break;
                }
            }
        }
        return new Path(res);
    };
    /**
     * 通过测试
    * 平均切割为 splitCount 段
    * @param {Number} splitCount
    * @param {Boolean} integer 是否取整
    * @returns {Path} 新的path
    */
    Path.prototype.splitAverageLength = function (splitLength, integer) {
        if (integer === void 0) { integer = true; }
        var tlen = this.last.tlen;
        var count = tlen / splitLength;
        if (integer)
            count = Math.round(count);
        return this.splitAverage(count);
    };
    /**
     *
     * @param  {...any} ps
     */
    Path.prototype.add = function () {
        var ps = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            ps[_i] = arguments[_i];
        }
        if (this.length == 0) {
            var firstpt = ps.shift();
            this.push(firstpt);
            this[0].len = 0;
            this[0].tlen = 0;
        }
        for (var i = 0; i < ps.length; i++) {
            var pt = ps[i];
            pt.len = pt.distanceTo(this.get(-1));
            pt.tlen = this.get(-1).tlen + pt.len;
            pt.direction = pt.clone().sub(this.get(-1)).normalize();
            if (!this.get(-1).direction)
                this.get(-1).direction = pt.clone().sub(this.get(-1)).normalize();
            else
                this.get(-1).direction.copy(pt.direction);
            this.push(pt);
        }
    };
    return Path;
}(Polyline_1.Polyline));
exports.Path = Path;
