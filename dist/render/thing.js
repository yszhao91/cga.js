"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildAccessors = exports.buildAccessor = exports.Thing = void 0;
var eventhandler_1 = require("./eventhandler");
var uuid_1 = require("uuid");
var Thing = /** @class */ (function (_super) {
    __extends(Thing, _super);
    function Thing(opts) {
        var _this = _super.call(this) || this;
        _this.cache = {};
        opts = opts || {};
        _this.uuid = uuid_1.v4();
        _this.id = _this.uuid;
        _this.name = opts.name || "未命名";
        _this.alias = opts.alias;
        _this.isThing = true;
        _this.parent = null;
        _this.children = [];
        _this.meta = undefined;
        _this.needsUpdate = false;
        _this._renderObject = null;
        _this._useData = {};
        _this.tag = "untagged";
        _this.on("set", function (name, oldValue, newValue) {
            _this.fire("set_" + name, name, oldValue, newValue);
        });
        for (var key in opts) {
            if (opts.hasOwnProperty(key)) {
                if (!_this[key]) {
                    _this[key] = opts[key];
                }
            }
        }
        return _this;
    }
    Thing.prototype.add = function (thing, force) {
        if (force === void 0) { force = false; }
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.add(arguments[i]);
            }
            return this;
        }
        if (thing === this) {
            console.error("Thing.add: 自己不能作为自己的子节点", thing);
            return this;
        }
        if (thing && this.isThing) {
            if (thing.parent) {
                thing.parent.remove(thing);
            }
            thing.parent = this;
            this.children.push(thing);
        }
        else if (thing && force) {
            if (thing.parent) {
                thing.parent.remove(thing);
            }
            thing.parent = this;
            this.children.push(thing);
        }
        else {
            console.error("Thing.add:不是Thing类型", thing);
        }
        return this;
    };
    Thing.prototype.remove = function (thing) {
        if (arguments.length > 1) {
            for (var i = 0; i < arguments.length; i++) {
                this.remove(arguments[i]);
            }
            return this;
        }
        else {
            //自身从父节点移除
            this.parent.remove(this);
        }
        var index = this.children.indexOf(thing);
        if (index !== -1) {
            thing.parent = null;
            // thing.dispatchEvent( { type: 'removed' } );
            this.children.splice(index, 1);
        }
        return this;
    };
    Thing.prototype.foreach = function (cb) {
        cb(this);
        var children = this.children;
        for (var i = 0; i < children.length; i++) {
            children[i].foreach(cb);
        }
    };
    Thing.prototype.getObjectByProperty = function (name, value) {
        if (this[name] === value)
            return this;
        for (var i = 0, l = this.children.length; i < l; i++) {
            var child = this.children[i];
            if (!child.getObjectByProperty)
                continue;
            var object = child.getObjectByProperty(name, value);
            if (object !== undefined) {
                return object;
            }
        }
        return undefined;
    };
    Thing.prototype.getObjectById = function (id) {
        return this.getObjectByProperty('id', id);
    };
    Thing.prototype.getObjectByName = function (name) {
        return this.getObjectByProperty('name', name);
    };
    /**
   * 生成属性的set/get方法
   * @param {string} name
   * @param {function} setFunc
   * @param {boolean} skipEqualsCheck
   */
    Thing.prototype.defineProperty = function (name, setFunc, skipEqualsCheck) {
        var _this = this;
        if (skipEqualsCheck === void 0) { skipEqualsCheck = true; }
        Object.defineProperty(this, name, {
            get: function () {
                return _this._useData[name];
            },
            set: function (value) {
                var data = _this._useData;
                var oldValue = data[name];
                if (!skipEqualsCheck && oldValue === value)
                    return;
                data[name] = value;
                if (setFunc)
                    setFunc.call(_this, value, oldValue);
            },
            configurable: true
        });
    };
    Thing.prototype.buildAccessor = function (name, bindObject) {
        if (bindObject === void 0) { bindObject = this; }
        if (!bindObject)
            return;
        Object.defineProperty(bindObject, name, {
            get: function () {
                return bindObject["_" + name];
            },
            set: function (value) {
                var oldValue = bindObject["_" + name];
                bindObject["_" + name] = value;
                bindObject.fire('set', name, oldValue, value);
            },
            configurable: true
        });
    };
    Thing.prototype.buildAccessors = function (schema, bindObject) {
        var _this = this;
        schema.forEach(function (descriptor) {
            _this.buildAccessor(descriptor, bindObject);
        });
    };
    return Thing;
}(eventhandler_1.EventHandler));
exports.Thing = Thing;
function buildAccessor(name, bindObject) {
    if (!bindObject)
        return;
    Object.defineProperty(bindObject, name, {
        get: function () {
            return bindObject["_" + name];
        },
        set: function (value) {
            var oldValue = bindObject["_" + name];
            bindObject["_" + name] = value;
            bindObject.fire('set', name, oldValue, value);
        },
        configurable: true
    });
}
exports.buildAccessor = buildAccessor;
function buildAccessors(schema, bindObject) {
    schema.forEach(function (descriptor) {
        buildAccessor(descriptor, bindObject);
    });
}
exports.buildAccessors = buildAccessors;
