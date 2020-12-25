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
exports.Vec = void 0;
/**
 * 暂不使用
 */
var Vec = /** @class */ (function (_super) {
    __extends(Vec, _super);
    function Vec(n) {
        var _this = _super.call(this) || this;
        while (n-- > 0) {
            _this[_this.length] = 0;
        }
        return _this;
    }
    return Vec;
}(Array));
exports.Vec = Vec;
