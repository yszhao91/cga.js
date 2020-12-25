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
exports.Rectangle = void 0;
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(v0, v1, v2, v3) {
        var _this = _super.call(this) || this;
        if (!v3)
            v3 = v1.clone().sub(v0).add(v2.clone().sub(v0)).add(v0);
        _this.push(v0, v1, v2, v3);
        var d01 = v1.clone().sub(v0);
        var d03 = v3.clone().sub(v0);
        _this.extent = [d01.length() * 0.5, d03.length() * 0.5];
        _this.axis = [d01.normalize(), d03.normalize()];
        _this.center = v0.clone().add(v2).multiplyScalar(0.5);
        return _this;
    }
    return Rectangle;
}(Array));
exports.Rectangle = Rectangle;
