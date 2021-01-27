export declare class EventHandler {
    private _callbacks;
    private _callbackActive;
    constructor();
    _addCallback(name: string, callback: any, scope: any, once: boolean): void;
    /**
     * @function
     * @name EventHandler#on
     * @description Attach an event handler to an event.
     * @param {string} name - Name of the event to bind the callback to.
     * @param {callbacks.HandleEvent} callback - Function that is called when event is fired. Note the callback is limited to 8 arguments.
     * @param {object} [scope] - Object to use as 'this' when the event is fired, defaults to current this.
     * @returns {EventHandler} Self for chaining.
     * @example
     * obj.on('test', function (a, b) {
     *     console.log(a + b);
     * });
     * obj.fire('test', 1, 2); // prints 3 to the console
     */
    on(name: string, callback: any, scope?: any): this;
    /**
     * @function
     * @name EventHandler#off
     * @description Detach an event handler from an event. If callback is not provided then all callbacks are unbound from the event,
     * if scope is not provided then all events with the callback will be unbound.
     * @param {string} [name] - Name of the event to unbind.
     * @param {callbacks.HandleEvent} [callback] - Function to be unbound.
     * @param {object} [scope] - Scope that was used as the this when the event is fired.
     * @returns {EventHandler} Self for chaining.
     * @example
     * var handler = function () {
     * };
     * obj.on('test', handler);
     *
     * obj.off(); // Removes all events
     * obj.off('test'); // Removes all events called 'test'
     * obj.off('test', handler); // Removes all handler functions, called 'test'
     * obj.off('test', handler, this); // Removes all hander functions, called 'test' with scope this
     */
    off(name: string | number, callback: any, scope: any): this;
    /**
     * @function
     * @name EventHandler#fire
     * @description Fire an event, all additional arguments are passed on to the event listener.
     * @param {object} name - Name of event to fire.
     * @param {*} [args] - arguments that is passed to the event handler.
     * obj.fire('test', 'This is the message');
     */
    fire(name: string | number, ...args: any[]): this;
    /**
     * @function
     * @name EventHandler#once
     * @description Attach an event handler to an event. This handler will be removed after being fired once.
     * @param {string} name - Name of the event to bind the callback to.
     * @param {callbacks.HandleEvent} callback - Function that is called when event is fired. Note the callback is limited to 8 arguments.
     * @param {object} [scope] - Object to use as 'this' when the event is fired, defaults to current this.
     * @returns {EventHandler} Self for chaining.
     * @example
     * obj.once('test', function (a, b) {
     *     console.log(a + b);
     * });
     * obj.fire('test', 1, 2); // prints 3 to the console
     * obj.fire('test', 1, 2); // not going to get handled
     */
    once(name: string, callback: any, scope: any): this;
    /**
     * @function
     * @name EventHandler#hasEvent
     * @description Test if there are any handlers bound to an event name.
     * @param {string} name - The name of the event to test.
     * @returns {boolean} True if the object has handlers bound to the specified event name.
     * @example
     * obj.on('test', function () { }); // bind an event to 'test'
     * obj.hasEvent('test'); // returns true
     * obj.hasEvent('hello'); // returns false
     */
    hasEvent(name: string | number): boolean;
}
