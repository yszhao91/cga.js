import { isDefined, Undefinable } from "src/utils/types";

function canTransferArrayBuffer() {
    if (!isDefined(TaskProcessor._canTransferArrayBuffer)) {
        var worker = new Worker(getWorkerUrl("Workers/transferTypedArrayTest.js"));
        worker.postMessage = (worker as any).webkitPostMessage || worker.postMessage

        var value = 99;
        var array = new Int8Array([value]);

        try {
            // postMessage might fail with a DataCloneError
            // if transferring array buffers is not supported.
            worker.postMessage(
                {
                    array: array,
                },
                [array.buffer]
            );
        } catch (e) {
            TaskProcessor._canTransferArrayBuffer = false;
            return TaskProcessor._canTransferArrayBuffer;
        }

        var deferred = new Promise(() => { });

        worker.onmessage = (event) => {
            var array = event.data.array;

            // some versions of Firefox silently fail to transfer typed arrays.
            // https://bugzilla.mozilla.org/show_bug.cgi?id=841904
            // Check to make sure the value round-trips successfully.
            var result = isDefined(array) && array[0] === value;
            new Promise((resolve, reject) => {
                resolve(result);
            }).then(() => {
                TaskProcessor._canTransferArrayBuffer = true;
            });

            worker.terminate();

            TaskProcessor._canTransferArrayBuffer = result;
        };

    }

    return TaskProcessor._canTransferArrayBuffer;
}


function completeTask(processor: any, data: any) {
    --processor._activeTasks;

    var id = data.id;
    if (!isDefined(id)) {
        // This is not one of ours.
        return;
    }

    var deferreds = processor._deferreds;
    var deferred = deferreds[id];

    if (isDefined(data.error)) {
        var error = data.error;
        if (error.name === "RuntimeError") {
            error = console.log(data.error.message);
        } else if (error.name === "DeveloperError") {
            error = console.log(data.error.message);
        }
        // taskCompletedEvent.raiseEvent(error);
        deferred.reject(error);
    } else {
        // taskCompletedEvent.raiseEvent();
        deferred.resolve(data.result);
    }

    delete deferreds[id];
}

function getWorkerUrl(moduleID: any) {
    var url = moduleID;

    // if (isCrossOriginUrl(url)) {
    //     //to load cross-origin, create a shim worker from a blob URL
    //     var script = 'importScripts("' + url + '");';

    //     var blob;
    //     try {
    //         blob = new Blob([script], {
    //             type: "application/javascript",
    //         });
    //     } catch (e) {
    //         var BlobBuilder =
    //             (window as any).BlobBuilder ||
    //             (window as any).WebKitBlobBuilder ||
    //             (window as any).MozBlobBuilder ||
    //             (window as any).MSBlobBuilder;
    //         var blobBuilder = new BlobBuilder();
    //         blobBuilder.append(script);
    //         blob = blobBuilder.getBlob("application/javascript");
    //     }

    //     var URL = window.URL || window.webkitURL;
    //     url = URL.createObjectURL(blob);
    // }

    return url;
}

var bootstrapperUrlResult: any;
function getBootstrapperUrl() {
    if (!isDefined(bootstrapperUrlResult)) {
        bootstrapperUrlResult = getWorkerUrl("Workers/cesiumWorkerBootstrapper.js");
    }
    return bootstrapperUrlResult;
}

function createWorker(processor: TaskProcessor) {
    var worker = new Worker(getBootstrapperUrl());
    worker.postMessage = (<any>worker).webkitPostMessage || worker.postMessage;

    var bootstrapMessage = {

    };

    worker.postMessage(bootstrapMessage);
    worker.onmessage = function (event) {
        completeTask(processor, event.data);
    };

    return worker;
}

var emptyTransferableObjectArray: any = [];
/**
 * A wrapper around a web worker that allows scheduling tasks for a given worker,
 * returning results asynchronously via a promise.
 *
 * The Worker is not constructed until a task is scheduled.
 *
 * @alias TaskProcessor
 * @constructor
 *
 * @param {String} workerPath The Url to the worker. This can either be an absolute path or relative to the Cesium Workers folder.
 * @param {Number} [maximumActiveTasks=5] The maximum number of active tasks.  Once exceeded,
 *                                        scheduleTask will not queue any more tasks, allowing
 *                                        work to be rescheduled in future frames.
 */
export class TaskProcessor {

    static _defaultWorkerModulePrefix = "Workers/";
    static _workerModulePrefix = TaskProcessor._defaultWorkerModulePrefix;
    static _canTransferArrayBuffer: boolean = true;

    private _workerPath: string = '';
    private _maximumActiveTasks: number;
    private _activeTasks: number;
    _deferreds: any = {};
    private _nextID: number;
    private _worker: Undefinable<Worker>
    constructor(workerPath: string, maximumActiveTasks: number = 5) {
        this._workerPath = TaskProcessor._workerModulePrefix + workerPath;
        this._maximumActiveTasks = maximumActiveTasks;
        this._activeTasks = 0;
        this._deferreds = {};
        this._nextID = 0;
    }

    scheduleTask(parameters: any, transferableObjects: any) {
        if (!isDefined(this._worker)) {
            this._worker = createWorker(this);
        }

        if (this._activeTasks >= this._maximumActiveTasks) {
            return undefined;
        }

        ++this._activeTasks;

        var processor = this;
        var deferred = new Promise((resolve, reject) => {
            resolve(canTransferArrayBuffer())
        }).then(function (canTransferArrayBuffer) {
            if (!isDefined(transferableObjects)) {
                transferableObjects = emptyTransferableObjectArray;
            } else if (!canTransferArrayBuffer) {
                transferableObjects.length = 0;
            }

            var id = processor._nextID++;
            processor._deferreds[id] = deferred;

            if (processor._worker)
                processor._worker.postMessage(
                    {
                        id: id,
                        parameters: parameters,
                        canTransferArrayBuffer: canTransferArrayBuffer,
                    },
                    transferableObjects
                );
        });
    }

    isDestroyed() {
        return false;
    };


    /**
     * Destroys this object.  This will immediately terminate the Worker.
     * <br /><br />
     * Once an object is destroyed, it should not be used; calling any function other than
     * <code>isDestroyed</code> will result in a {@link DeveloperError} exception.
     */
    destroy() {
        if (isDefined(this._worker)) {
            this._worker!.terminate();
        }
    };
}

