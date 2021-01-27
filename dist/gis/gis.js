"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wgs84Radii = exports.wgs84RadiiSquared = exports.wgs84OneOverRadiiSquared = exports.wgs84OneOverRadii = void 0;
var Vec3_1 = require("../math/Vec3");
exports.wgs84OneOverRadii = new Vec3_1.Vec3(1.0 / 6378137.0, 1.0 / 6378137.0, 1.0 / 6356752.3142451793);
exports.wgs84OneOverRadiiSquared = new Vec3_1.Vec3(1.0 / 40680631590769.0, 1.0 / 40408299984661.442761299913289148, 1.0 / 40680631590769.0);
exports.wgs84RadiiSquared = new Vec3_1.Vec3(40680631590769, 40408299984661.442761299913289148, //极半径
40680631590769 //赤道半径
);
exports.wgs84Radii = new Vec3_1.Vec3(6378137.0, 6356752.3142451793, //极半径
6378137.0 // 赤道半径
);
