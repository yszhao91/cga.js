export class Ellipsoid {
    static readonly WGS84 = new Ellipsoid(6378137.0, 6378137.0, 6356752.3142451793);
    static readonly UNIT_SPHERE = new Ellipsoid(1.0, 1.0, 1.0);

    x: number;
    y: number;
    z: number;
    constructor(x: number, y: number, z: number) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}