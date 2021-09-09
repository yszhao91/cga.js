import { Ellipsoid } from "src-gis/math/ellipsoid";

/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-05 10:14:25
 * @LastEditTime : 2021-08-05 13:43:47
 * @FilePath     : \cga.js\src-gis\provider\DcTerrainProvider.ts
 */

export interface IDcTerrainProviderParamters {
    url: string;
    ellipsoid: Ellipsoid;
}

export class DcTerrainProvider {
    _heightmapWidth: number = 65;
    _ellipsoid: Ellipsoid;
    _heightmapStructure = undefined;
    _hasWaterMask: boolean = false;
    _hasVertexNormals: boolean = false;
    _url: string;

    constructor(options: IDcTerrainProviderParamters) {
        this._ellipsoid = options.ellipsoid;
        this._url = options.url;

        fetch(options.url).then(() => {

        });
    }

    getTileDataAvailable(x: number, y: number, level: number) {
    }
}