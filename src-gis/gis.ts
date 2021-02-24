import { Vec3 } from '../src/math/Vec3';

export const wgs84OneOverRadii = new Vec3(
    1.0 / 6378137.0,
    1.0 / 6378137.0,
    1.0 / 6356752.3142451793
);

export const wgs84OneOverRadiiSquared = new Vec3(
    1.0 / 40680631590769.0,
    1.0 / 40408299984661.442761299913289148,
    1.0 / 40680631590769.0
);

export const wgs84RadiiSquared = new Vec3(
    40680631590769,
    40408299984661.442761299913289148,//极半径
    40680631590769//赤道半径
);

export const wgs84Radii = new Vec3(
    6378137.0,
    6356752.3142451793, //极半径
    6378137.0 // 赤道半径
);
