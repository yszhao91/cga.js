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
    signedDistance?: number;//需要符号距离正负距离
    segmentIndex?: number;//多线段最近位置 
}

export interface IntersectResult extends DistanceResult {
    interserct?: boolean;
    equals?: boolean;
    intersetctPts: Array<Array<Vec3>>;
}