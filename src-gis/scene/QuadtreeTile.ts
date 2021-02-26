import { Undefinable } from "src/utils/types";
import { Rectangle } from "src-gis/core/Rectangle";
import { GeographicTilingScheme } from "./GeographicTilingScheme";
// * The state of a {@link QuadtreeTile} in the tile load pipeline.
export enum QuadtreeTileLoadState {
    /**
     * The tile is new and loading has not yet begun. 
     */
    START = 0,

    /**
     * Loading is in progress. 
     */
    LOADING = 1,

    /**
     * Loading is complete. 
     */
    DONE = 2,

    /**
     * The tile has failed to load. 
     */
    FAILED = 3,
};
export interface IQuadtreeTileOptions {
    tilingScheme: GeographicTilingScheme;
    x: number;
    y: number;
    level: number;
    parent?: QuadtreeTile;

}
export class QuadtreeTile {
    private _tilingScheme: GeographicTilingScheme;
    private _x: number;
    private _y: number;
    private _level: number;
    private _parent: Undefinable<QuadtreeTile>;
    private _rectangle: Rectangle;
    private _southwestChild: Undefinable<QuadtreeTile>;
    private _southeastChild: Undefinable<QuadtreeTile>;
    private _northwestChild: Undefinable<QuadtreeTile>;
    private _northeastChild: Undefinable<QuadtreeTile>;
    replacementPrevious: any;
    replacementNext: any;
    state: QuadtreeTileLoadState = QuadtreeTileLoadState.START;
    constructor(options: IQuadtreeTileOptions) {

        this._tilingScheme = options.tilingScheme;
        this._x = options.x;
        this._y = options.y;
        this._level = options.level;
        this._parent = options.parent;
        this._rectangle = this._tilingScheme.tileXYToRectangle(
            this._x,
            this._y,
            this._level
        );

        this._southwestChild = undefined;
        this._southeastChild = undefined;
        this._northwestChild = undefined;
        this._northeastChild = undefined;

        // TileReplacementQueue gets/sets these private properties.
        this.replacementPrevious = undefined;
        this.replacementNext = undefined;

    }

    get northwestChild(): QuadtreeTile {
        if (!this._northwestChild) {
            this._northwestChild = new QuadtreeTile({
                tilingScheme: this._tilingScheme,
                x: this._x * 2,
                y: this._y * 2,
                level: this._level + 1,
                parent: this,
            });
        }
        return this._northwestChild;
    }


    get southwestChild(): QuadtreeTile {
        if (!this._southwestChild) {
            this._southwestChild = new QuadtreeTile({
                tilingScheme: this._tilingScheme,
                x: this._x * 2,
                y: this._y * 2 + 1,
                level: this._level + 1,
                parent: this,
            });
        }
        return this._southwestChild;
    }


    get southeastChild(): QuadtreeTile {
        if (!this._southeastChild) {
            this._southeastChild = new QuadtreeTile({
                tilingScheme: this._tilingScheme,
                x: this._x * 2 + 1,
                y: this._y * 2 + 1,
                level: this._level + 1,
                parent: this,
            });
        }
        return this._southeastChild;
    }

    get northeastChild(): QuadtreeTile {
        if (!this._northeastChild) {
            this._northeastChild = new QuadtreeTile({
                tilingScheme: this._tilingScheme,
                x: this._x * 2 + 1,
                y: this._y * 2,
                level: this._level + 1,
                parent: this,
            });
        }
        return this._northeastChild;
    }


    get children(): QuadtreeTile[] {
        return [
            this.northwestChild,
            this.northeastChild,
            this.southwestChild,
            this.southeastChild,
        ];
    }



    static createLevelZeroTiles(tilingScheme: GeographicTilingScheme) {

        const numberOfLevelZeroTilesX = tilingScheme.getNumberOfXTilesAtLevel(0);
        const numberOfLevelZeroTilesY = tilingScheme.getNumberOfYTilesAtLevel(0);

        const result: QuadtreeTile[] = new Array(numberOfLevelZeroTilesX * numberOfLevelZeroTilesY);

        let i = 0;
        for (let x = 0; x < numberOfLevelZeroTilesX; x++) {
            for (let y = 0; y < numberOfLevelZeroTilesY; y++) {
                result[i++] = new QuadtreeTile({
                    tilingScheme: tilingScheme,
                    x: x,
                    y: y,
                    level: 0,
                });
            }

        }

        return result;
    }


}