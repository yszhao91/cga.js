"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Orientation = exports.IntersectType = void 0;
var IntersectType;
(function (IntersectType) {
    IntersectType[IntersectType["None"] = 0] = "None";
    IntersectType[IntersectType["Parallel"] = 1] = "Parallel";
    IntersectType[IntersectType["Perpendicular"] = 2] = "Perpendicular";
    IntersectType[IntersectType["Collineation"] = 3] = "Collineation";
})(IntersectType = exports.IntersectType || (exports.IntersectType = {}));
var Orientation;
(function (Orientation) {
    Orientation[Orientation["None"] = -1] = "None";
    Orientation[Orientation["Common"] = 0] = "Common";
    Orientation[Orientation["Positive"] = 1] = "Positive";
    Orientation[Orientation["Negative"] = 2] = "Negative";
    Orientation[Orientation["Intersect"] = 3] = "Intersect";
})(Orientation = exports.Orientation || (exports.Orientation = {}));
