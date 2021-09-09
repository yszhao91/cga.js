import { Undefinable } from "../../src/utils/types";
import { EllipsoidTerrainProvider } from "../core/EllipsoidTerrainProvider";
import { ImageryLayerCollection } from "./ImageryLayerCollection";
import { QuadtreePrimitive } from "./quadtree_primitive";

export interface IGlobeSurfaceTileProviderOption {
    terrainProvider: any,
    imageryLayers: any,
    surfaceShaderSet: any,
}

/**
 * @description :  包装地球所有的提供器
 * @param        {*}
 * @return       {*}
 * @example     : 
 */
export class GlobeSurfaceTileProvider {
    _quadtree: Undefinable<QuadtreePrimitive>
    _terrainProvider: Undefinable<EllipsoidTerrainProvider>
    _imageryLayers: Undefinable<ImageryLayerCollection>
    constructor(option: IGlobeSurfaceTileProviderOption) {

    }
}