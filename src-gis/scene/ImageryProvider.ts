import { isDefined } from "src/utils/types"
const ktxRegex = /\.ktx$/i;
const crnRegex = /\.crn$/i;

export class ImageryProvider {
    constructor() {

    }

    static loadImage(imageryProvider: any, url: string) {
        // var resource = Resource.createIfNeeded(url);
        // if (
        //     isDefined(imageryProvider) &&
        //     isDefined(imageryProvider.tileDiscardPolicy)
        // ) {
        //     return resource.fetchImage({
        //         preferBlob: true,
        //         preferImageBitmap: true,
        //         flipY: true,
        //     });
        // }

        // return resource.fetchImage({
        //     preferImageBitmap: true,
        //     flipY: true,
        // });
    }
}