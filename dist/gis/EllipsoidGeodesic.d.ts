import { Cartographic } from './Cartographic';
/**
 * 椭圆测地线 计算测地距离
 */
export declare class EllipsoidGeodesic {
    start: Cartographic;
    end: Cartographic;
    constructor(_ellipsoid: any);
    computeProperties(ellipsoid: {
        cartographicToCartesian: (arg0: any, arg1: any) => any;
        maximumRadius: any;
        minimumRadius: any;
    }): void;
}
