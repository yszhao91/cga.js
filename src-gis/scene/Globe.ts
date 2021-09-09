/*
 * @Description  : 地球  或者不同圆椭球体
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-05 10:10:40
 * @LastEditTime : 2021-08-05 10:54:14
 * @FilePath     : \cga.js\src-gis\scene\Globe.ts
 */

import { EllipsoidTerrainProvider } from "src-gis/core/EllipsoidTerrainProvider";
import { Cartographic } from "src-gis/math/Cartographic";
import { Ellipsoid } from "src-gis/math/ellipsoid";
import { GVec3 } from "src-gis/math/GVec3";
import { TerrainProvider } from "src-gis/provider/TerrainProvider";
import { Ray } from "src/struct/3d/Ray";
import { GlobeSurfaceShaderSet } from "./GlobeSurfaceShaderSet";
import { GlobeSurfaceTileProvider } from "./GlobeSurfaceTileProvider";
import { ImageryLayerCollection } from "./ImageryLayerCollection";
import { QuadtreePrimitive } from "./quadtree_primitive";

export class Globe {
    ellipsoid: Ellipsoid;
    /**
     *   地形提供器
     */
    private _terrainProvider!: TerrainProvider;

    /**
     *   图层集合  
     */
    imageLayers: ImageryLayerCollection = new ImageryLayerCollection();

    /**
     *  地形块存数量
     */
    tileCacheSize: number = 100;
    loadingDescendantLimit: number = 20;

    /**
     * 显示水的效果
     */
    showWaterEffect: boolean = false;

    _surface: QuadtreePrimitive;
    _surfaceShaderSet: GlobeSurfaceShaderSet;

    showSkirts: boolean = true;

    constructor(ellipsoid: Ellipsoid = Ellipsoid.WGS84) {
        this.ellipsoid = ellipsoid;
        this._terrainProvider = new EllipsoidTerrainProvider({
            ellipsoid: ellipsoid,
        });

        this._surfaceShaderSet = new GlobeSurfaceShaderSet();

        this._surface = new QuadtreePrimitive({
            tileProvider: new GlobeSurfaceTileProvider({
                terrainProvider: this._terrainProvider,
                imageryLayers: this.imageLayers,
                surfaceShaderSet: this._surfaceShaderSet
            })
        })

    }

    pick(rat: Ray, scene: any, result: GVec3) { };

    getHeight(cartographic: Cartographic): number | undefined {
        return 0;
    }

    get tilesLoaded() {
        return true;
    }
}