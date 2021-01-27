"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventHandler = void 0;
var EventHandler = /** @class */ (function () {
    function EventHandler() {
        this._callbacks = {};
        this._callbackActive = {};
    }
    EventHandler.prototype._addCallback = function (name, callback, scope, once) {
        if (!name || typeof name !== 'string' || !callback)
            return;
        if (!this._callbacks[name])
            this._callbacks[name] = [];
        if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name])
            this._callbackActive[name] = this._callbackActive[name].slice();
        this._callbacks[name].push({
            callback: callback,
            scope: scope || this,
            once: once || false
        });
    };
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
    EventHandler.prototype.on = function (name, callback, scope) {
        this._addCallback(name, callback, scope, false);
        return this;
    };
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
    EventHandler.prototype.off = function (name, callback, scope) {
        if (name) {
            if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name])
                this._callbackActive[name] = this._callbackActive[name].slice();
        }
        else {
            for (var key in this._callbackActive) {
                if (!this._callbacks[key])
                    continue;
                if (this._callbacks[key] !== this._callbackActive[key])
                    continue;
                this._callbackActive[key] = this._callbackActive[key].slice();
            }
        }
        if (!name) {
            this._callbacks = {};
        }
        else if (!callback) {
            if (this._callbacks[name])
                this._callbacks[name] = [];
        }
        else {
            var events = this._callbacks[name];
            if (!events)
                return this;
            var count = events.length;
            for (var i = 0; i < count; i++) {
                if (events[i].callback !== callback)
                    continue;
                if (scope && events[i].scope !== scope)
                    continue;
                events[i--] = events[--count];
            }
            events.length = count;
        }
        return this;
    };
    // ESLint rule disabled here as documenting arg1, arg2...argN as [...] rest
    // arguments is preferable to documenting each one individually.
    /* eslint-disable valid-jsdoc */
    /**
     * @function
     * @name EventHandler#fire
     * @description Fire an event, all additional arguments are passed on to the event listener.
     * @param {object} name - Name of event to fire.
     * @param {*} [args] - arguments that is passed to the event handler.
     * obj.fire('test', 'This is the message');
     */
    /* eslint-enable valid-jsdoc */
    EventHandler.prototype.fire = function (name) {
        var _a;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!name || !this._callbacks[name])
            return this;
        var callbacks;
        if (!this._callbackActive[name]) {
            this._callbackActive[name] = this._callbacks[name];
        }
        else {
            if (this._callbackActive[name] === this._callbacks[name])
                this._callbackActive[name] = this._callbackActive[name].slice();
            callbacks = this._callbacks[name].slice();
        }
        // TODO: What does callbacks do here?
        // In particular this condition check looks wrong: (i < (callbacks || this._callbackActive[name]).length)
        // Because callbacks is not an integer
        // eslint-disable-next-line no-unmodified-loop-condition
        for (var i = 0; (callbacks || this._callbackActive[name]) && (i < (callbacks || this._callbackActive[name]).length); i++) {
            var evt = (callbacks || this._callbackActive[name])[i];
            (_a = evt.callback).call.apply(_a, __spreadArrays([evt.scope], args));
            if (evt.once) {
                var ind = this._callbacks[name].indexOf(evt);
                if (ind !== -1) {
                    if (this._callbackActive[name] === this._callbacks[name])
                        this._callbackActive[name] = this._callbackActive[name].slice();
                    this._callbacks[name].splice(ind, 1);
                }
            }
        }
        if (!callbacks)
            this._callbackActive[name] = null;
        return this;
    };
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
    EventHandler.prototype.once = function (name, callback, scope) {
        this._addCallback(name, callback, scope, true);
        return this;
    };
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
    EventHandler.prototype.hasEvent = function (name) {
        return (this._callbacks[name] && this._callbacks[name].length !== 0) || false;
    };
    return EventHandler;
}());
exports.EventHandler = EventHandler;
