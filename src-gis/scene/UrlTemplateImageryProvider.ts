import { Rectangle } from "src-gis/core/Rectangle";
import { isDefined, Undefinable } from "src/utils/types";
import { ImageryProvider } from "./ImageryProvider";


export class UrlTemplateImageryProvider {
    private _tileWidth: Undefinable<number>;
    private _tileHeight: Undefinable<number>;
    private _rectangle: Undefinable<Rectangle>;
    private _resource: Undefinable<any>;
    constructor() {
        this._tileWidth = undefined;
        this._tileHeight = undefined;
    }

    get ready() {
        return isDefined(this._resource);
    }


    requestImage(x: number, y: number, level: number, request: any) {

        if (!this.ready) {
            console.error("requestImage must not be called before the imagery provider is ready.")
        }
        //>>includeEnd('debug');
        // return ImageryProvider.loadImage(
        //     this,
        //     buildImageResource(this, x, y, level, request)
        // );
    }
}