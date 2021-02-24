
import { PI_TWO, toRadians } from "../../src/math/Math";
import { Cartographic } from "./Cartographic";

/**
 * A two dimensional region specified as longitude and latitude coordinates.
 *
 * @alias Rectangle
 * @constructor
 *
 * @param {Number} [west=0.0] The westernmost longitude, in radians, in the range [-Pi, Pi].
 * @param {Number} [south=0.0] The southernmost latitude, in radians, in the range [-Pi/2, Pi/2].
 * @param {Number} [east=0.0] The easternmost longitude, in radians, in the range [-Pi, Pi].
 * @param {Number} [north=0.0] The northernmost latitude, in radians, in the range [-Pi/2, Pi/2].
 *
 * @see Packable
 */
export class Rectangle {
    constructor(public west: number = 0.0, public south: number = 0.0, public east: number = 0.0, public north: number = 0.0) {

    }

    /**
     * 计算宽度 单位弧度
     */
    static computeWidth = function (rectangle: Rectangle) {
        var east = rectangle.east;
        var west = rectangle.west;
        if (east < west) {
            east += PI_TWO;
        }
        return east - west;
    };

    /**
     * 计算高度弧度
     */
    static computeHeight = function (rectangle: Rectangle) {
        return rectangle.north - rectangle.south;
    };

    static fromDegrees(west: number = 0.0, south: number = 0.0, east: number = 0.0, north: number = 0.0, result?: Rectangle) {
        west = toRadians(west);
        south = toRadians(south);
        east = toRadians(east);
        north = toRadians(north);

        if (!result) {
            return new Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;

        return result;
    };

    static fromRadians(west: number = 0.0, south: number = 0.0, east: number = 0.0, north: number = 0.0, result?: Rectangle) {
        if (!result) {
            return new Rectangle(west, south, east, north);
        }

        result.west = west;
        result.south = south;
        result.east = east;
        result.north = north;

        return result;
    };

    get width() {
        return Rectangle.computeWidth(this);
    }

    get height() {
        return Rectangle.computeHeight(this);
    }

    /**
     * Computes the northeast corner of a rectangle.
     *
     * @param {Rectangle} rectangle The rectangle for which to find the corner
     * @param {Cartographic} [result] The object onto which to store the result.
     * @returns {Cartographic} The modified result parameter or a new Cartographic instance if none was provided.
     */
    northeast(result?: Cartographic) {
        if (!result) {
            return new Cartographic(this.east, this.north);
        }
        result.longitude = this.east;
        result.latitude = this.north;
        result.height = 0.0;
        return result;
    };

    /**
     * Computes the southeast corner of a rectangle.
     */
    southeast(result?: Cartographic) {

        if (!result) {
            return new Cartographic(this.east, this.south);
        }
        result.longitude = this.east;
        result.latitude = this.south;
        result.height = 0.0;
        return result;
    };
}

