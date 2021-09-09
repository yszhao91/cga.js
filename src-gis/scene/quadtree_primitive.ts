import { GlobeSurfaceTileProvider } from "./GlobeSurfaceTileProvider";
import { QuadtreeTile } from "./QuadtreeTile";

export interface IQuadtreePrimitiveOption {
    tileProvider: GlobeSurfaceTileProvider;
}

var rootTraversalDetails = [];
export class QuadtreePrimitive {

    private _tilesToRender = [];
    private _levelZeroTiles: QuadtreeTile[] = []
    tileCacheSize: number = 100;//地形块的缓冲区
    private _tileProvider: any;

    constructor(options: IQuadtreePrimitiveOption) {
        if (!options.tileProvider) {
            throw ("options.tileProvider 参数是必须的");
        }
        // if (options.tileProvider.quadtree) {
        //     throw ("A QuadtreeTileProvider can only be used with a single QuadtreePrimitive");
        // }

        this._tileProvider = options.tileProvider;
        this._tileProvider.quadtree = this;
    }

    get tileProvider() {
        return this._tileProvider;
    }

    selectTilesForRendering(frameState: any) {
        var i;
        if (!this._levelZeroTiles) {
            var tilingScheme = this._tileProvider.tilingScheme;
            this._levelZeroTiles = QuadtreeTile.createLevelZeroTiles(tilingScheme);

            var numberOfRootTiles = this._levelZeroTiles.length;
            if (rootTraversalDetails.length < numberOfRootTiles) {
                rootTraversalDetails = new Array(numberOfRootTiles);
                for (i = 0; i < numberOfRootTiles; ++i) {
                    if (rootTraversalDetails[i] === undefined) {
                        // rootTraversalDetails[i] = new TraversalDetails();
                    }
                }
            }
        } else {

        }
    }

    update() {
        this.selectTilesForRendering({});
    }

}


