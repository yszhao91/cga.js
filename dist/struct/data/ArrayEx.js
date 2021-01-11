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
exports.ArrayEx = void 0;
var ArrayEx = /** @class */ (function (_super) {
    __extends(ArrayEx, _super);
    function ArrayEx() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.apply(this, args) || this;
    }
    Object.defineProperty(ArrayEx.prototype, "last", {
        get: function () {
            return this.get(-1);
        },
        enumerable: false,
        configurable: true
    });
    ArrayEx.prototype.get = function (index) {
        if (index < 0)
            index = this.length + index;
        return this[index];
    };
    /**
     * 深度优先遍历
     * @param {*} method
     */
    ArrayEx.prototype.forall = function (method) {
        for (var i = 0; i < this.length; i++) {
            method(this[i]);
            if (this[i] instanceof Array)
                this[i].forall(method);
        }
    };
    /**
     *
    */
    ArrayEx.prototype.clone = function () {
        var result = new ArrayEx();
        for (var i = 0; i < this.length; i++) {
            var ele = this[i];
            if (ele instanceof Number || ele instanceof String)
                result[i] = ele;
            else if (ele.clone) {
                result[i] = ele.clone();
            }
            else
                throw ("数组有元素不能clone");
        }
        return result;
    };
    /**
     * 分类
     * example:
     *      var arry = [1,2,3,4,5,6]
     *      var result = classify(this,(a)={return a%2===0})
     *
     * @param {Function} classifyMethod  分类方法
     */
    ArrayEx.prototype.classify = function (classifyMethod) {
        var result = [];
        for (var i = 0; i < this.length; i++) {
            for (var j = 0; j < result.length; j++) {
                if (classifyMethod(this[i], result[j][0], result[j])) {
                    result[j].push(this[i]);
                }
                else {
                    result.push([this[i]]);
                }
            }
        }
        return result;
    };
    /**
     * 去掉重复元素
     * @param {Function} uniqueMethod  去重复
     * @param {Function} sortMethod 排序
     */
    ArrayEx.prototype.unique = function (uniqueMethod, sortMethod) {
        if (sortMethod) {
            this.sort(sortMethod);
            for (var i = 0; i < this.length; i++) {
                for (var j = i + 1; j < this.length; j++) {
                    if (uniqueMethod(this[i], this[j]) === true) {
                        this.splice(j, 1);
                        j--;
                    }
                    else
                        break;
                }
            }
            return this;
        }
        for (var i = 0; i < this.length; i++) {
            for (var j = i + 1; j < this.length; j++) {
                if (uniqueMethod(this[i], this[j]) === true) {
                    this.splice(j, 1);
                    j--;
                }
            }
        }
        return this;
    };
    return ArrayEx;
}(Array));
exports.ArrayEx = ArrayEx;
