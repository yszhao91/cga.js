import { EventHandler } from "../src/render/eventhandler"
import { Ellipsoid } from "./math/ellipsoid";
import { EllipsoidTerrainProvider } from "./core/EllipsoidTerrainProvider";
import { GlobeSurfaceShaderSet } from "./scene/GlobeSurfaceShaderSet";
import { GlobeSurfaceTileProvider } from "./scene/GlobeSurfaceTileProvider";
import { ImageryLayerCollection } from "./scene/ImageryLayerCollection";
import { QuadtreePrimitive } from "./scene/quadtree_primitive";

export class Globe extends EventHandler {
    private _ellipsoid: Ellipsoid;
    private _surface: QuadtreePrimitive;
    private _imageryLayerCollection: ImageryLayerCollection;
    private _surfaceShaderSet: GlobeSurfaceShaderSet;
    private _terrainProvider: EllipsoidTerrainProvider;

    constructor(ellipsoid: Ellipsoid) {
        super();


        var terrainProvider = new EllipsoidTerrainProvider({
            ellipsoid: ellipsoid,
        });
        this._terrainProvider = terrainProvider;

        var imageryLayerCollection = new ImageryLayerCollection();

        this._ellipsoid = ellipsoid;
        this._imageryLayerCollection = imageryLayerCollection;


        this._surfaceShaderSet = new GlobeSurfaceShaderSet();

        this._surface = new QuadtreePrimitive({
            tileProvider: new GlobeSurfaceTileProvider({
                terrainProvider: terrainProvider,
                imageryLayers: imageryLayerCollection,
                surfaceShaderSet: this._surfaceShaderSet,
            }),
        });
    }
    get terrainProvider() {
        return this._terrainProvider;
    }

    set terrainProvider(value: any) {
        if (value !== this._terrainProvider) {
            this._terrainProvider = value;
            this.fire('terrainProviderChanged')
        }
    }



}