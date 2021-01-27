"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateVolume = void 0;
/**
 * 计算体积
 * @param faces 一个几何体的所有三角面
 */
function calculateVolume(faces) {
    var volumes = 0;
    for (var i = 0; i < faces.length; i++) {
        var P = faces[i][0];
        var Q = faces[i][1];
        var R = faces[i][2];
        volumes += P.dot(Q.clone().cross(R)) / 6;
    }
    return Math.abs(volumes);
}
exports.calculateVolume = calculateVolume;
