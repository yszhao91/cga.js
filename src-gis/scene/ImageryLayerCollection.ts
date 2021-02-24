import { EventHandler } from "../../src/render/eventhandler";

/**
 * 图像层的有序集合。
 */
export class ImageryLayerCollection extends EventHandler {
    static EventType = {
        layerAdded: 'layerAdded',
        layerRemoved: 'layerRemoved',
        layerMoved: 'layerMoved',
        layerShownOrHidden: 'layerShownOrHidden',
    }
    private _layers: any = [];
    constructor() {
        super();
    }


    get length() {
        return this._layers.length;
    }

    add(layer: any, index?: number) {

        this._layers.push(layer)

        this.fire('layerAdded');
    }

    remove(layer: any, destroy: boolean = true) {

        var index = this._layers.indexOf(layer);
        if (index !== -1) {
            this._layers.splice(index, 1);

            this._update();

            this.fire("layerRemoved");

            if (destroy) {
                layer.destroy();
            }

            return true;
        }

        return false;
    };

    removeAll(destroy: boolean = true) {

        var layers = this._layers;
        for (var i = 0, len = layers.length; i < len; i++) {
            var layer = layers[i];
            this.fire('layerRemoved')
            if (destroy) {
                layer.destroy();
            }
        }

        this._layers = [];
    };

    contains(layer: any) {
        return this.indexOf(layer) !== -1;
    };

    indexOf(layer: any) {
        return this._layers.indexOf(layer);
    };

    _update() {

    }
}