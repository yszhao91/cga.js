import { HeightmapTerrainData } from "src-gis/core/HeightmapTerrainData";
import { Undefinable } from "src/utils/types";
import { Ellipsoid } from "../math/ellipsoid";
import { GeographicTilingScheme } from "../scene/GeographicTilingScheme";

export interface IEllipsoidTerrainProviderOprion {
    ellipsoid?: Ellipsoid
}
export class EllipsoidTerrainProvider {
    private _tilingScheme: Undefinable<GeographicTilingScheme>;

    constructor(options: IEllipsoidTerrainProviderOprion) {
        if (!this._tilingScheme) {

            this._tilingScheme = new GeographicTilingScheme({
                ellipsoid: options.ellipsoid ?? Ellipsoid.WGS84,
            });
        }
    }


    requestTileGeometry(x: number, y: number, level: number, request: any): Promise<HeightmapTerrainData> {
        var width = 16;
        var height = 16;

        return new Promise((resolve, reject) => {
            resolve(new HeightmapTerrainData({
                buffer: new Uint8Array(width * height),
                width: width,
                height: height,
            }))
        })
    }

}