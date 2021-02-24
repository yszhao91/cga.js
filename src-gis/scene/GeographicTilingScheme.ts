import { PI_TWO } from "../../src/math/Math";
import { Rectangle } from "../core/Rectangle";
import { Ellipsoid } from "../math/ellipsoid";

export interface IGeographicTilingScheme {
    ellipsoid?: Ellipsoid,
    _tilingScheme?: any;
    numberOfLevelZeroTilesX?: number
    numberOfLevelZeroTilesY?: number
}
/**
 * 地理学块
 */
export class GeographicTilingScheme {
    private _numberOfLevelZeroTilesY: number;
    private _numberOfLevelZeroTilesX: number;
    private _rectangle: Rectangle = GeographicTilingScheme.MAX_VALUE;

    constructor(options: IGeographicTilingScheme = {}) {
        this._numberOfLevelZeroTilesX = options.numberOfLevelZeroTilesX || 2;
        this._numberOfLevelZeroTilesY = options.numberOfLevelZeroTilesY || 2;
    }

    tileXYToRectangle(x: number, y: number, level: number, result?: Rectangle) {
        var rectangle = this._rectangle;

        var xTiles = this.getNumberOfXTilesAtLevel(level);
        var yTiles = this.getNumberOfYTilesAtLevel(level);

        var xTileWidth = rectangle.width / xTiles;
        var west = x * xTileWidth + rectangle.west;
        var east = (x + 1) * xTileWidth + rectangle.west;

        var yTileHeight = rectangle.height / yTiles;
        var north = rectangle.north - y * yTileHeight;
        var south = rectangle.north - (y + 1) * yTileHeight;

        if (!result) {
            result = new Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;
        return result;
    }

    getNumberOfXTilesAtLevel(level: number) {
        return this._numberOfLevelZeroTilesX << level;
    };
    getNumberOfYTilesAtLevel(level: number) {
        return this._numberOfLevelZeroTilesY << level;
    };

    static MAX_VALUE = Object.freeze(
        new Rectangle(
            -Math.PI,
            -PI_TWO,
            Math.PI,
            PI_TWO
        )
    );

}