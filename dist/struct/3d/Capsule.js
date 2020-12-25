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
exports.Capsule = void 0;
var Segment_1 = require("./Segment");
var Capsule = /** @class */ (function (_super) {
    __extends(Capsule, _super);
    /**
     * 胶囊体
     * @param {Point|Vec3} p0 点0
     * @param {Point|Vec3} p1 点1
     * @param {Number} radius  半径
     */
    function Capsule(p0, p1, radius) {
        if (radius === void 0) { radius = 0; }
        var _this = _super.call(this, p0, p1) || this;
        _this.radius = radius;
        return _this;
    }
    return Capsule;
}(Segment_1.Segment));
exports.Capsule = Capsule;
