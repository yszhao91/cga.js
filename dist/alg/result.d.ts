import { Vec3 } from "@/math/Vec3";
export interface DistanceResult {
    rayParameter?: any;
    lineParameter?: any;
    closests?: Array<any>;
    parameters?: Array<any>;
    distance?: number;
    distanceSqr?: number;
    equidistant?: boolean;
    interior?: boolean;
    triangleParameters?: Array<any>;
    rectangleParameters?: Array<any>;
    circleClosest?: Vec3;
    signedDistance?: number;
    segmentIndex?: number;
    diskClosest?: Vec3;
}
export interface IntersectResult extends DistanceResult {
    interserct?: boolean;
    equals?: boolean;
    intersetctPts: Array<Array<Vec3>>;
}
