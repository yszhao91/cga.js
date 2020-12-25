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
exports.Triangle = void 0;
var Triangle = /** @class */ (function (_super) {
    __extends(Triangle, _super);
    function Triangle(_p0, _p1, _p2) {
        var _this = _super.call(this) || this;
        Object.setPrototypeOf(_this, Triangle.prototype);
        _this.push(_p0, _p1, _p2);
        return _this;
    }
    Object.defineProperty(Triangle.prototype, "p0", {
        get: function () {
            return this[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Triangle.prototype, "p1", {
        get: function () {
            return this[1];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Triangle.prototype, "p2", {
        get: function () {
            return this[2];
        },
        enumerable: false,
        configurable: true
    });
    //---distance--------------------------------------   
    Triangle.prototype.distanceTriangle = function (triangle) {
    };
    return Triangle;
}(Array));
exports.Triangle = Triangle;
