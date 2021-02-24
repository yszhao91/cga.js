import { UrlTemplateImageryProvider } from "./UrlTemplateImageryProvider";

function createFactory(Type: any) {
    return function (options: any) {
        return new Type(options);
    };
}
const ImageryProviderMapping = {
    // ARCGIS_MAPSERVER: createFactory(ArcGisMapServerImageryProvider),
    // BING: createFactory(BingMapsImageryProvider),
    // GOOGLE_EARTH: createFactory(GoogleEarthEnterpriseMapsProvider),
    // MAPBOX: createFactory(MapboxImageryProvider),
    // SINGLE_TILE: createFactory(SingleTileImageryProvider),
    // TMS: createFactory(TileMapServiceImageryProvider),
    URL_TEMPLATE: createFactory(UrlTemplateImageryProvider),
    // WMS: createFactory(WebMapServiceImageryProvider),
    // WMTS: createFactory(WebMapTileServiceImageryProvider),
};

export class DcImageryProvider {
    private _ready: any;
    private _imageryProvider: any;
    constructor() {

    }

    requestImage(x: number, y: number, level: number, request: any) {
        //>>includeStart('debug', pragmas.debug);
        if (!this._ready) {
            console.error("requestImage must not be called before the imagery provider is ready.");

        }
        //>>includeEnd('debug');
        return this._imageryProvider.requestImage(x, y, level, request);
    };
}