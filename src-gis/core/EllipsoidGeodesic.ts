import { Cartographic } from './Cartographic';


/**
 * 椭圆测地线 计算测地距离
 */
export class EllipsoidGeodesic {
    start: Cartographic;
    end: Cartographic;

    constructor(_ellipsoid: any) {
        this.start = new Cartographic()
        this.end = new Cartographic()
    }

    computeProperties(ellipsoid: { cartographicToCartesian: (arg0: any, arg1: any) => any; maximumRadius: any; minimumRadius: any; }) {
        // var firstCartesian = Cartesian3.normalize(
        //     ellipsoid.cartographicToCartesian(start, scratchCart2),
        //     scratchCart1
        // );
        // var lastCartesian = Cartesian3.normalize(
        //     ellipsoid.cartographicToCartesian(end, scratchCart2),
        //     scratchCart2
        // );

        // //>>includeStart('debug', pragmas.debug);
        // Check.typeOf.number.greaterThanOrEquals(
        //     "value",
        //     Math.abs(
        //         Math.abs(Cartesian3.angleBetween(firstCartesian, lastCartesian)) - Math.PI
        //     ),
        //     0.0125
        // );
        // //>>includeEnd('debug');

        // vincentyInverseFormula(
        //     this,
        //     ellipsoid.maximumRadius,
        //     ellipsoid.minimumRadius,
        //     start.longitude,
        //     start.latitude,
        //     end.longitude,
        //     end.latitude
        // );

        // ellipsoidGeodesic._start = Cartographic.clone(
        //     start,
        //     ellipsoidGeodesic._start
        // );
        // ellipsoidGeodesic._end = Cartographic.clone(end, ellipsoidGeodesic._end);
        // ellipsoidGeodesic._start.height = 0;
        // ellipsoidGeodesic._end.height = 0;

        // setConstants(ellipsoidGeodesic);
    }
}