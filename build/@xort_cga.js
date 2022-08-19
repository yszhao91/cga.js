/**
* https://github.com/yszhao91/cga.js
*CGA Lib |cga.js |alex Zhao | Zhao yaosheng
*@license free for all
*/
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.cga = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var array = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.unique = exports.classify = exports.flat = exports.forall = void 0;

	Array.prototype.get = function (index) {
	  if (index < 0) index = this.length + index;
	  return this[index];
	};

	Array.prototype.last = function () {
	  return this.get(-1);
	};
	/**
	 * 遍历多级数组中所有对象
	 * @param {Array} array
	 * @param {Function} method
	 */


	function forall(array, method) {
	  for (var i = 0; i < array.length; i++) {
	    var ele = array[i];
	    method(ele, i, array);
	    if (Array.isArray(ele)) forall(ele, method);
	  }
	}

	exports.forall = forall;

	function flat(array) {
	  if (array.flat) return array.flat(Infinity);
	  return array.reduce(function (pre, cur) {
	    return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
	  });
	}

	exports.flat = flat;
	/**
	 * 分类
	 * example:
	 *      var arry = [1,2,3,4,5,6]
	 *      var result = classify(array,(a)={return a%2===0})
	 *
	 * @param {Array} array
	 * @param {Function} classifyMethod  分类方法
	 */

	function classify(array, classifyMethod) {
	  var result = [];

	  for (var i = 0; i < array.length; i++) {
	    for (var j = 0; j < result.length; j++) {
	      if (classifyMethod(array[i], result[j][0], result[j])) {
	        result[j].push(array[i]);
	      } else {
	        result.push([array[i]]);
	      }
	    }
	  }

	  return result;
	}

	exports.classify = classify;
	/**
	 * 去掉重复元素
	 * @param {Array} array
	 * @param {Function} uniqueMethod  去重复
	 * @param {Function} sortMethod 排序 存在就先排序再去重复
	 */

	function unique(array, uniqueMethod, sortMethod) {
	  if (sortMethod) {
	    array.sort(sortMethod);

	    for (var i = 0; i < array.length; i++) {
	      for (var j = i + 1; j < array.length; j++) {
	        if (uniqueMethod(array[i], array[j]) === true) {
	          array.splice(j, 1);
	          j--;
	        } else break;
	      }
	    }

	    return array;
	  }

	  for (var i = 0; i < array.length; i++) {
	    for (var j = i + 1; j < array.length; j++) {
	      if (uniqueMethod(array[i], array[j]) === true) {
	        array.splice(j, 1);
	        j--;
	      }
	    }
	  }

	  return array;
	}

	exports.unique = unique;
	});

	unwrapExports(array);
	var array_1 = array.unique;
	var array_2 = array.classify;
	var array_3 = array.flat;
	var array_4 = array.forall;

	var eventhandler = createCommonjsModule(function (module, exports) {

	var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from, pack) {
	  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	    if (ar || !(i in from)) {
	      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	      ar[i] = from[i];
	    }
	  }
	  return to.concat(ar || Array.prototype.slice.call(from));
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.EventHandler = void 0;

	var EventHandler =
	/** @class */
	function () {
	  function EventHandler() {
	    this._callbacks = {};
	    this._callbackActive = {};
	  }

	  EventHandler.prototype._addCallback = function (name, callback, scope, once) {
	    if (!name || typeof name !== 'string' || !callback) return;
	    if (!this._callbacks[name]) this._callbacks[name] = [];
	    if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name]) this._callbackActive[name] = this._callbackActive[name].slice();

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
	      if (this._callbackActive[name] && this._callbackActive[name] === this._callbacks[name]) this._callbackActive[name] = this._callbackActive[name].slice();
	    } else {
	      for (var key in this._callbackActive) {
	        if (!this._callbacks[key]) continue;
	        if (this._callbacks[key] !== this._callbackActive[key]) continue;
	        this._callbackActive[key] = this._callbackActive[key].slice();
	      }
	    }

	    if (!name) {
	      this._callbacks = {};
	    } else if (!callback) {
	      if (this._callbacks[name]) this._callbacks[name] = [];
	    } else {
	      var events = this._callbacks[name];
	      if (!events) return this;
	      var count = events.length;

	      for (var i = 0; i < count; i++) {
	        if (events[i].callback !== callback) continue;
	        if (scope && events[i].scope !== scope) continue;
	        events[i--] = events[--count];
	      }

	      events.length = count;
	    }

	    return this;
	  }; // ESLint rule disabled here as documenting arg1, arg2...argN as [...] rest
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

	    if (!name || !this._callbacks[name]) return this;
	    var callbacks;

	    if (!this._callbackActive[name]) {
	      this._callbackActive[name] = this._callbacks[name];
	    } else {
	      if (this._callbackActive[name] === this._callbacks[name]) this._callbackActive[name] = this._callbackActive[name].slice();
	      callbacks = this._callbacks[name].slice();
	    } // TODO: What does callbacks do here?
	    // In particular this condition check looks wrong: (i < (callbacks || this._callbackActive[name]).length)
	    // Because callbacks is not an integer
	    // eslint-disable-next-line no-unmodified-loop-condition


	    for (var i = 0; (callbacks || this._callbackActive[name]) && i < (callbacks || this._callbackActive[name]).length; i++) {
	      var evt = (callbacks || this._callbackActive[name])[i];

	      (_a = evt.callback).call.apply(_a, __spreadArray([evt.scope], args, false));

	      if (evt.once) {
	        var ind = this._callbacks[name].indexOf(evt);

	        if (ind !== -1) {
	          if (this._callbackActive[name] === this._callbacks[name]) this._callbackActive[name] = this._callbackActive[name].slice();

	          this._callbacks[name].splice(ind, 1);
	        }
	      }
	    }

	    if (!callbacks) this._callbackActive[name] = null;
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
	    return this._callbacks[name] && this._callbacks[name].length !== 0 || false;
	  };

	  return EventHandler;
	}();

	exports.EventHandler = EventHandler;
	});

	unwrapExports(eventhandler);
	var eventhandler_1 = eventhandler.EventHandler;

	var Vec2_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.v2 = exports.Vec2 = void 0;



	var Vec2 =
	/** @class */
	function (_super) {
	  __extends(Vec2, _super);

	  function Vec2(_x, _y) {
	    if (_x === void 0) {
	      _x = 0;
	    }

	    if (_y === void 0) {
	      _y = 0;
	    }

	    var _this = _super.call(this) || this;

	    _this._x = _x;
	    _this._y = _y;
	    _this.isVec2 = true;
	    return _this;
	  }

	  Object.defineProperty(Vec2.prototype, "x", {
	    get: function () {
	      return this._x;
	    },
	    set: function (value) {
	      if (this._x !== value) {
	        this._x = value;
	        this.fire('change', 'x', this._x, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec2.prototype, "y", {
	    get: function () {
	      return this._y;
	    },
	    set: function (value) {
	      if (this._y !== value) {
	        this._y = value;
	        this.fire('change', 'y', this._y, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Vec2.isVec2 = function (v) {
	    return !isNaN(v.x) && !isNaN(v.y) && isNaN(v.z) && isNaN(v.w);
	  };

	  Object.defineProperty(Vec2.prototype, "width", {
	    get: function () {
	      return this._x;
	    },
	    set: function (value) {
	      this._x = value;
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec2.prototype, "height", {
	    get: function () {
	      return this._y;
	    },
	    set: function (value) {
	      this._y = value;
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec2, "UnitX", {
	    get: function () {
	      return new Vec2(1, 0);
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec2, "UnitY", {
	    get: function () {
	      return new Vec2(0, 1);
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Vec2.prototype.set = function (x, y) {
	    this._x = x;
	    this._y = y;
	    return this;
	  };

	  Vec2.prototype.setScalar = function (scalar) {
	    this._x = scalar;
	    this._y = scalar;
	    return this;
	  };

	  Vec2.prototype.setX = function (x) {
	    this._x = x;
	    return this;
	  };

	  Vec2.prototype.setY = function (y) {
	    this._y = y;
	    return this;
	  };

	  Vec2.prototype.setComponent = function (index, value) {
	    switch (index) {
	      case 0:
	        this._x = value;
	        break;

	      case 1:
	        this._y = value;
	        break;

	      default:
	        throw new Error("index is out of range: " + index);
	    }

	    return this;
	  };

	  Vec2.prototype.getComponent = function (index) {
	    switch (index) {
	      case 0:
	        return this._x;

	      case 1:
	        return this._y;

	      default:
	        throw new Error("index is out of range: " + index);
	    }
	  };

	  Vec2.prototype.clone = function () {
	    return new Vec2(this._x, this._y);
	  };

	  Vec2.prototype.copy = function (v) {
	    this._x = v.x;
	    this._y = v.y;
	    return this;
	  };

	  Vec2.prototype.add = function (v, w) {
	    if (w !== undefined) {
	      console.warn("Vec2: .add() now only accepts one argument. Use .addVecs( a, b ) instead.");
	      return this.addVecs(v, w);
	    }

	    this._x += v.x;
	    this._y += v.y;
	    return this;
	  };

	  Vec2.prototype.addScalar = function (s) {
	    this._x += s;
	    this._y += s;
	    return this;
	  };

	  Vec2.prototype.addVecs = function (a, b) {
	    this._x = a.x + b.x;
	    this._y = a.y + b.y;
	    return this;
	  };

	  Vec2.prototype.addScaledVec = function (v, s) {
	    this._x += v.x * s;
	    this._y += v.y * s;
	    return this;
	  };

	  Vec2.prototype.sub = function (v, w) {
	    if (w !== undefined) {
	      console.warn("Vec2: .sub() now only accepts one argument. Use .subVecs( a, b ) instead.");
	      return this.subVecs(v, w);
	    }

	    this._x -= v.x;
	    this._y -= v.y;
	    return this;
	  };

	  Vec2.prototype.subScalar = function (s) {
	    this._x -= s;
	    this._y -= s;
	    return this;
	  };

	  Vec2.prototype.subVecs = function (a, b) {
	    this._x = a.x - b.x;
	    this._y = a.y - b.y;
	    return this;
	  };

	  Vec2.prototype.multiply = function (v) {
	    this._x *= v.x;
	    this._y *= v.y;
	    return this;
	  };

	  Vec2.prototype.multiplyScalar = function (scalar) {
	    this._x *= scalar;
	    this._y *= scalar;
	    return this;
	  };

	  Vec2.prototype.divide = function (v) {
	    this._x /= v.x;
	    this._y /= v.y;
	    return this;
	  };

	  Vec2.prototype.divideScalar = function (scalar) {
	    return this.multiplyScalar(1 / scalar);
	  };

	  Vec2.prototype.applyMat3 = function (m) {
	    var x = this._x,
	        y = this._y;
	    var e = m.elements;
	    this._x = e[0] * x + e[3] * y + e[6];
	    this._y = e[1] * x + e[4] * y + e[7];
	    return this;
	  };

	  Vec2.prototype.min = function (v) {
	    this._x = Math.min(this._x, v.x);
	    this._y = Math.min(this._y, v.y);
	    return this;
	  };

	  Vec2.prototype.max = function (v) {
	    this._x = Math.max(this._x, v.x);
	    this._y = Math.max(this._y, v.y);
	    return this;
	  };

	  Vec2.prototype.clamp = function (min, max) {
	    // assumes min < max, componentwise
	    this._x = Math.max(min.x, Math.min(max.x, this._x));
	    this._y = Math.max(min.y, Math.min(max.y, this._y));
	    return this;
	  };

	  Vec2.prototype.clampScalar = function (minVal, maxVal) {
	    this._x = Math.max(minVal, Math.min(maxVal, this._x));
	    this._y = Math.max(minVal, Math.min(maxVal, this._y));
	    return this;
	  };

	  Vec2.prototype.clampLength = function (min, max) {
	    var length = this.length();
	    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
	  };

	  Vec2.prototype.floor = function () {
	    this._x = Math.floor(this._x);
	    this._y = Math.floor(this._y);
	    return this;
	  };

	  Vec2.prototype.ceil = function () {
	    this._x = Math.ceil(this._x);
	    this._y = Math.ceil(this._y);
	    return this;
	  };

	  Vec2.prototype.round = function () {
	    this._x = Math.round(this._x);
	    this._y = Math.round(this._y);
	    return this;
	  };

	  Vec2.prototype.roundToZero = function () {
	    this._x = this._x < 0 ? Math.ceil(this._x) : Math.floor(this._x);
	    this._y = this._y < 0 ? Math.ceil(this._y) : Math.floor(this._y);
	    return this;
	  };

	  Vec2.prototype.negate = function () {
	    this._x = -this._x;
	    this._y = -this._y;
	    return this;
	  };

	  Vec2.prototype.dot = function (v) {
	    return this._x * v.x + this._y * v.y;
	  };

	  Vec2.prototype.cross = function (v) {
	    return this._x * v.y - this._y * v.x;
	  };

	  Vec2.prototype.lengthSq = function () {
	    return this._x * this._x + this._y * this._y;
	  };

	  Vec2.prototype.length = function () {
	    return Math.sqrt(this._x * this._x + this._y * this._y);
	  };

	  Vec2.prototype.manhattanLength = function () {
	    return Math.abs(this._x) + Math.abs(this._y);
	  };

	  Vec2.prototype.normalize = function () {
	    return this.divideScalar(this.length() || 1);
	  };

	  Vec2.prototype.angle = function () {
	    // computes the angle in radians with respect to the positive x-axis
	    var angle = Math.atan2(this._y, this._x);
	    if (angle < 0) angle += 2 * Math.PI;
	    return angle;
	  };

	  Vec2.prototype.distanceTo = function (v) {
	    return Math.sqrt(this.distanceToSquared(v));
	  };

	  Vec2.prototype.distanceToSquared = function (v) {
	    var dx = this._x - v.x,
	        dy = this._y - v.y;
	    return dx * dx + dy * dy;
	  };

	  Vec2.prototype.manhattanDistanceTo = function (v) {
	    return Math.abs(this._x - v.x) + Math.abs(this._y - v.y);
	  };

	  Vec2.prototype.setLength = function (length) {
	    return this.normalize().multiplyScalar(length);
	  };

	  Vec2.prototype.lerp = function (v, alpha) {
	    this._x += (v.x - this._x) * alpha;
	    this._y += (v.y - this._y) * alpha;
	    return this;
	  };

	  Vec2.prototype.lerpVecs = function (v1, v2, alpha) {
	    return this.subVecs(v2, v1).multiplyScalar(alpha).add(v1);
	  };

	  Vec2.prototype.equals = function (v) {
	    return v.x === this._x && v.y === this._y;
	  };

	  Vec2.prototype.fromArray = function (array, offset) {
	    if (offset === void 0) {
	      offset = 0;
	    }

	    this._x = array[offset];
	    this._y = array[offset + 1];
	    return this;
	  };

	  Vec2.prototype.toArray = function (array, offset) {
	    if (array === void 0) {
	      array = [];
	    }

	    if (offset === void 0) {
	      offset = 0;
	    }

	    array[offset] = this._x;
	    array[offset + 1] = this._y;
	    return array;
	  };

	  Vec2.prototype.fromBufferAttribute = function (attribute, index, offset) {
	    if (offset !== undefined) {
	      console.warn("Vec2: offset has been removed from .fromBufferAttribute().");
	    }

	    this._x = attribute.getX(index);
	    this._y = attribute.getY(index);
	    return this;
	  };

	  Vec2.prototype.rotateAround = function (center, angle) {
	    var c = Math.cos(angle),
	        s = Math.sin(angle);
	    var x = this._x - center.x;
	    var y = this._y - center.y;
	    this._x = x * c - y * s + center.x;
	    this._y = x * s + y * c + center.y;
	    return this;
	  };

	  return Vec2;
	}(eventhandler.EventHandler);

	exports.Vec2 = Vec2;

	function v2() {
	  return new Vec2();
	}

	exports.v2 = v2;
	});

	unwrapExports(Vec2_1);
	var Vec2_2 = Vec2_1.v2;
	var Vec2_3 = Vec2_1.Vec2;

	var _Math = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.toFixedAry = exports.toFixed = exports.ToDegrees = exports.toRadians = exports.floorPowerOfTwo = exports.ceilPowerOfTwo = exports.isPowerOfTwo = exports.randFloat = exports.randInt = exports.smootherstep = exports.smoothstep = exports.lerp = exports.clamp = exports.approximateEqual = exports.sign = exports.RADIANS_PER_ARCSECOND = exports.DEGREES_PER_RADIAN = exports.RADIANS_PER_DEGREE = exports.ONE_OVER_TWO_PI = exports.PI_TWO = exports.THREE_PI_OVER_TWO = exports.PI_OVER_SIX = exports.PI_OVER_FOUR = exports.PI_OVER_THREE = exports.PI_OVER_TWO = exports.ONE_OVER_PI = exports.PI = exports.delta9 = exports.delta8 = exports.delta7 = exports.delta6 = exports.delta5 = exports.delta4 = void 0;
	exports.delta4 = 1e-4;
	exports.delta5 = 1e-5;
	exports.delta6 = 1e-6;
	exports.delta7 = 1e-7;
	exports.delta8 = 1e-8;
	exports.delta9 = 1e-9;
	/**
	 * pi
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.PI = Math.PI;
	/**
	 * 1/pi
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.ONE_OVER_PI = 1.0 / Math.PI;
	/**
	 * pi/2
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.PI_OVER_TWO = Math.PI / 2.0;
	/**
	 * pi/3
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.PI_OVER_THREE = Math.PI / 3.0;
	/**
	 * pi/4
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.PI_OVER_FOUR = Math.PI / 4.0;
	/**
	 * pi/6
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.PI_OVER_SIX = Math.PI / 6.0;
	/**
	 * 3pi/2
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.THREE_PI_OVER_TWO = 3.0 * Math.PI / 2.0;
	/**
	 * 2pi
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.PI_TWO = 2.0 * Math.PI;
	/**
	 * 1/2pi
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.ONE_OVER_TWO_PI = 1.0 / (2.0 * Math.PI);
	/**
	 * The number of radians in a degree.
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.RADIANS_PER_DEGREE = Math.PI / 180.0;
	/**
	 * The number of degrees in a radian.
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.DEGREES_PER_RADIAN = 180.0 / Math.PI;
	/**
	 * The number of radians in an arc second.
	 *
	 * @type {Number}
	 * @constant
	 */

	exports.RADIANS_PER_ARCSECOND = exports.RADIANS_PER_DEGREE / 3600.0;

	function sign(value) {
	  return value >= 0 ? 1 : -1;
	}

	exports.sign = sign;

	function approximateEqual(v1, v2, precision) {
	  if (precision === void 0) {
	    precision = exports.delta4;
	  }

	  return Math.abs(v1 - v2) < precision;
	}

	exports.approximateEqual = approximateEqual;

	function clamp(value, min, max) {
	  return Math.max(min, Math.min(max, value));
	}

	exports.clamp = clamp;

	function lerp(x, y, t) {
	  return (1 - t) * x + t * y;
	}

	exports.lerp = lerp;

	function smoothstep(x, min, max) {
	  if (x <= min) return 0;
	  if (x >= max) return 1;
	  x = (x - min) / (max - min);
	  return x * x * (3 - 2 * x);
	}

	exports.smoothstep = smoothstep;

	function smootherstep(x, min, max) {
	  if (x <= min) return 0;
	  if (x >= max) return 1;
	  x = (x - min) / (max - min);
	  return x * x * x * (x * (x * 6 - 15) + 10);
	}

	exports.smootherstep = smootherstep; // Random integer from <low, high> interval

	function randInt(low, high) {
	  return low + Math.floor(Math.random() * (high - low + 1));
	}

	exports.randInt = randInt; // Random float from <low, high> interval

	/**
	 * 生成一个low~high之间的浮点数
	 * @param {*} low
	 * @param {*} high
	 */

	function randFloat(low, high) {
	  return low + Math.random() * (high - low);
	}

	exports.randFloat = randFloat;

	function isPowerOfTwo(value) {
	  return (value & value - 1) === 0 && value !== 0;
	}

	exports.isPowerOfTwo = isPowerOfTwo;

	function ceilPowerOfTwo(value) {
	  return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
	}

	exports.ceilPowerOfTwo = ceilPowerOfTwo;

	function floorPowerOfTwo(value) {
	  return Math.pow(2, Math.floor(Math.log(value) / Math.LN2));
	}

	exports.floorPowerOfTwo = floorPowerOfTwo;

	function toRadians(degrees) {
	  return degrees * exports.RADIANS_PER_DEGREE;
	}

	exports.toRadians = toRadians;

	function ToDegrees(radians) {
	  return radians * exports.DEGREES_PER_RADIAN;
	}

	exports.ToDegrees = ToDegrees;
	/**
	 * 数字或者向量固定位数
	 * @param {Object} obj 数字或者向量
	 * @param {*} fractionDigits
	 */

	function toFixed(obj, fractionDigits) {
	  if (obj instanceof Number) return parseFloat(obj.toFixed(fractionDigits));else {
	    if (obj.x !== undefined) obj.x = parseFloat(obj.x.toFixed(fractionDigits));
	    if (obj.y !== undefined) obj.y = parseFloat(obj.y.toFixed(fractionDigits));
	    if (obj.z !== undefined) obj.z = parseFloat(obj.z.toFixed(fractionDigits));
	  }
	  return obj;
	}

	exports.toFixed = toFixed;
	/**
	 * 数组中所有数字或者向量固定位数
	 * @param {Array} array
	 * @param {Number} precision
	 */

	function toFixedAry(array, precision) {
	  if (precision === void 0) {
	    precision = exports.delta4;
	  }

	  for (var i = 0; i < array.length; i++) {
	    var e = array[i];
	    if (e instanceof Array) toFixedAry(e);else array[i] = toFixed(e, precision);
	  }
	}

	exports.toFixedAry = toFixedAry;
	});

	unwrapExports(_Math);
	var _Math_1 = _Math.toFixedAry;
	var _Math_2 = _Math.toFixed;
	var _Math_3 = _Math.ToDegrees;
	var _Math_4 = _Math.toRadians;
	var _Math_5 = _Math.floorPowerOfTwo;
	var _Math_6 = _Math.ceilPowerOfTwo;
	var _Math_7 = _Math.isPowerOfTwo;
	var _Math_8 = _Math.randFloat;
	var _Math_9 = _Math.randInt;
	var _Math_10 = _Math.smootherstep;
	var _Math_11 = _Math.smoothstep;
	var _Math_12 = _Math.lerp;
	var _Math_13 = _Math.clamp;
	var _Math_14 = _Math.approximateEqual;
	var _Math_15 = _Math.sign;
	var _Math_16 = _Math.RADIANS_PER_ARCSECOND;
	var _Math_17 = _Math.DEGREES_PER_RADIAN;
	var _Math_18 = _Math.RADIANS_PER_DEGREE;
	var _Math_19 = _Math.ONE_OVER_TWO_PI;
	var _Math_20 = _Math.PI_TWO;
	var _Math_21 = _Math.THREE_PI_OVER_TWO;
	var _Math_22 = _Math.PI_OVER_SIX;
	var _Math_23 = _Math.PI_OVER_FOUR;
	var _Math_24 = _Math.PI_OVER_THREE;
	var _Math_25 = _Math.PI_OVER_TWO;
	var _Math_26 = _Math.ONE_OVER_PI;
	var _Math_27 = _Math.PI;
	var _Math_28 = _Math.delta9;
	var _Math_29 = _Math.delta8;
	var _Math_30 = _Math.delta7;
	var _Math_31 = _Math.delta6;
	var _Math_32 = _Math.delta5;
	var _Math_33 = _Math.delta4;

	var Quat_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.quat = exports.Quat = void 0;





	var Quat =
	/** @class */
	function (_super) {
	  __extends(Quat, _super);

	  function Quat(_x, _y, _z, _w) {
	    if (_x === void 0) {
	      _x = 0;
	    }

	    if (_y === void 0) {
	      _y = 0;
	    }

	    if (_z === void 0) {
	      _z = 0;
	    }

	    if (_w === void 0) {
	      _w = 1;
	    }

	    var _this = _super.call(this) || this;

	    _this._x = _x;
	    _this._y = _y;
	    _this._z = _z;
	    _this._w = _w;
	    _this.isQuat = true;
	    return _this;
	  }

	  Object.defineProperty(Quat.prototype, "x", {
	    get: function () {
	      return this._x;
	    },
	    set: function (value) {
	      if (this._x !== value) {
	        this._x = value;
	        this.fire('change', 'x', this._x, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Quat.prototype, "y", {
	    get: function () {
	      return this._y;
	    },
	    set: function (value) {
	      if (this._y !== value) {
	        this._y = value;
	        this.fire('change', 'y', this._y, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Quat.prototype, "z", {
	    get: function () {
	      return this._z;
	    },
	    set: function (value) {
	      if (this._z !== value) {
	        this._z = value;
	        this.fire('change', 'z', this._z, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Quat.prototype, "w", {
	    get: function () {
	      return this._w;
	    },
	    set: function (value) {
	      if (this._w !== value) {
	        this._w = value;
	        this.fire('change', 'w', this._w, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Quat.slerp = function (qa, qb, qm, t) {
	    return qm.copy(qa).slerp(qb, t);
	  };

	  Quat.slerpFlat = function (dst, dstOffset, src0, srcOffset0, src1, srcOffset1, t) {
	    // fuzz-free, array-based Quat SLERP operation
	    var x0 = src0[srcOffset0 + 0],
	        y0 = src0[srcOffset0 + 1],
	        z0 = src0[srcOffset0 + 2],
	        w0 = src0[srcOffset0 + 3],
	        x1 = src1[srcOffset1 + 0],
	        y1 = src1[srcOffset1 + 1],
	        z1 = src1[srcOffset1 + 2],
	        w1 = src1[srcOffset1 + 3];

	    if (w0 !== w1 || x0 !== x1 || y0 !== y1 || z0 !== z1) {
	      var s = 1 - t,
	          cos = x0 * x1 + y0 * y1 + z0 * z1 + w0 * w1,
	          dir = cos >= 0 ? 1 : -1,
	          sqrSin = 1 - cos * cos; // Skip the Slerp for tiny steps to avoid numeric problems:

	      if (sqrSin > Number.EPSILON) {
	        var sin = Math.sqrt(sqrSin),
	            len = Math.atan2(sin, cos * dir);
	        s = Math.sin(s * len) / sin;
	        t = Math.sin(t * len) / sin;
	      }

	      var tDir = t * dir;
	      x0 = x0 * s + x1 * tDir;
	      y0 = y0 * s + y1 * tDir;
	      z0 = z0 * s + z1 * tDir;
	      w0 = w0 * s + w1 * tDir; // Normalize in case we just did a lerp:

	      if (s === 1 - t) {
	        var f = 1 / Math.sqrt(x0 * x0 + y0 * y0 + z0 * z0 + w0 * w0);
	        x0 *= f;
	        y0 *= f;
	        z0 *= f;
	        w0 *= f;
	      }
	    }

	    dst[dstOffset] = x0;
	    dst[dstOffset + 1] = y0;
	    dst[dstOffset + 2] = z0;
	    dst[dstOffset + 3] = w0;
	  };

	  Quat.multiplyQuatsFlat = function (dst, dstOffset, src0, srcOffset0, src1, srcOffset1) {
	    var x0 = src0[srcOffset0];
	    var y0 = src0[srcOffset0 + 1];
	    var z0 = src0[srcOffset0 + 2];
	    var w0 = src0[srcOffset0 + 3];
	    var x1 = src1[srcOffset1];
	    var y1 = src1[srcOffset1 + 1];
	    var z1 = src1[srcOffset1 + 2];
	    var w1 = src1[srcOffset1 + 3];
	    dst[dstOffset] = x0 * w1 + w0 * x1 + y0 * z1 - z0 * y1;
	    dst[dstOffset + 1] = y0 * w1 + w0 * y1 + z0 * x1 - x0 * z1;
	    dst[dstOffset + 2] = z0 * w1 + w0 * z1 + x0 * y1 - y0 * x1;
	    dst[dstOffset + 3] = w0 * w1 - x0 * x1 - y0 * y1 - z0 * z1;
	    return dst;
	  };

	  Quat.prototype.set = function (x, y, z, w) {
	    this._x = x;
	    this._y = y;
	    this._z = z;
	    this._w = w;
	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.clone = function () {
	    return new Quat(this._x, this._y, this._z, this._w);
	  };

	  Quat.prototype.copy = function (quat) {
	    this._x = quat.x;
	    this._y = quat.y;
	    this._z = quat.z;
	    this._w = quat.w;
	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.setFromEuler = function (euler, update) {
	    if (!(euler && euler.isEuler)) {
	      throw new Error("Quat: .setFromEuler() now expects an Euler rotation rather than a Vec3 and order.");
	    }

	    var x = euler._x,
	        y = euler._y,
	        z = euler._z,
	        order = euler.order; // http://www.mathworks.com/matlabcentral/fileexchange/
	    // 	20696-function-to-convert-between-dcm-Euler-angles-Quats-and-Euler-Vecs/
	    //	content/SpinCalc.m

	    var cos = Math.cos;
	    var sin = Math.sin;
	    var c1 = cos(x / 2);
	    var c2 = cos(y / 2);
	    var c3 = cos(z / 2);
	    var s1 = sin(x / 2);
	    var s2 = sin(y / 2);
	    var s3 = sin(z / 2);

	    if (order === "XYZ") {
	      this._x = s1 * c2 * c3 + c1 * s2 * s3;
	      this._y = c1 * s2 * c3 - s1 * c2 * s3;
	      this._z = c1 * c2 * s3 + s1 * s2 * c3;
	      this._w = c1 * c2 * c3 - s1 * s2 * s3;
	    } else if (order === "YXZ") {
	      this._x = s1 * c2 * c3 + c1 * s2 * s3;
	      this._y = c1 * s2 * c3 - s1 * c2 * s3;
	      this._z = c1 * c2 * s3 - s1 * s2 * c3;
	      this._w = c1 * c2 * c3 + s1 * s2 * s3;
	    } else if (order === "ZXY") {
	      this._x = s1 * c2 * c3 - c1 * s2 * s3;
	      this._y = c1 * s2 * c3 + s1 * c2 * s3;
	      this._z = c1 * c2 * s3 + s1 * s2 * c3;
	      this._w = c1 * c2 * c3 - s1 * s2 * s3;
	    } else if (order === "ZYX") {
	      this._x = s1 * c2 * c3 - c1 * s2 * s3;
	      this._y = c1 * s2 * c3 + s1 * c2 * s3;
	      this._z = c1 * c2 * s3 - s1 * s2 * c3;
	      this._w = c1 * c2 * c3 + s1 * s2 * s3;
	    } else if (order === "YZX") {
	      this._x = s1 * c2 * c3 + c1 * s2 * s3;
	      this._y = c1 * s2 * c3 + s1 * c2 * s3;
	      this._z = c1 * c2 * s3 - s1 * s2 * c3;
	      this._w = c1 * c2 * c3 - s1 * s2 * s3;
	    } else if (order === "XZY") {
	      this._x = s1 * c2 * c3 - c1 * s2 * s3;
	      this._y = c1 * s2 * c3 - s1 * c2 * s3;
	      this._z = c1 * c2 * s3 + s1 * s2 * c3;
	      this._w = c1 * c2 * c3 + s1 * s2 * s3;
	    }

	    if (update !== false) this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.setFromAxisAngle = function (axis, angle) {
	    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/angleToQuat/index.htm
	    // assumes axis is normalized
	    var halfAngle = angle / 2,
	        s = Math.sin(halfAngle);
	    this._x = axis.x * s;
	    this._y = axis.y * s;
	    this._z = axis.z * s;
	    this._w = Math.cos(halfAngle);
	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.setFromRotationMat = function (m) {
	    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToQuat/index.htm
	    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	    var te = m.elements,
	        m11 = te[0],
	        m12 = te[4],
	        m13 = te[8],
	        m21 = te[1],
	        m22 = te[5],
	        m23 = te[9],
	        m31 = te[2],
	        m32 = te[6],
	        m33 = te[10],
	        trace = m11 + m22 + m33,
	        s;

	    if (trace > 0) {
	      s = 0.5 / Math.sqrt(trace + 1.0);
	      this._w = 0.25 / s;
	      this._x = (m32 - m23) * s;
	      this._y = (m13 - m31) * s;
	      this._z = (m21 - m12) * s;
	    } else if (m11 > m22 && m11 > m33) {
	      s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
	      this._w = (m32 - m23) / s;
	      this._x = 0.25 * s;
	      this._y = (m12 + m21) / s;
	      this._z = (m13 + m31) / s;
	    } else if (m22 > m33) {
	      s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
	      this._w = (m13 - m31) / s;
	      this._x = (m12 + m21) / s;
	      this._y = 0.25 * s;
	      this._z = (m23 + m32) / s;
	    } else {
	      s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
	      this._w = (m21 - m12) / s;
	      this._x = (m13 + m31) / s;
	      this._y = (m23 + m32) / s;
	      this._z = 0.25 * s;
	    }

	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.setFromUnitVecs = function (vFrom, vTo) {
	    // assumes direction Vecs vFrom and vTo are normalized
	    var EPS = 0.000001;
	    var r = vFrom.dot(vTo) + 1;

	    if (r < EPS) {
	      r = 0;

	      if (Math.abs(vFrom.x) > Math.abs(vFrom.z)) {
	        this._x = -vFrom.y;
	        this._y = vFrom.x;
	        this._z = 0;
	        this._w = r;
	      } else {
	        this._x = 0;
	        this._y = -vFrom.z;
	        this._z = vFrom.y;
	        this._w = r;
	      }
	    } else {
	      // crossVecs( vFrom, vTo ); // inlined to avoid cyclic dependency on Vec3
	      this._x = vFrom.y * vTo.z - vFrom.z * vTo.y;
	      this._y = vFrom.z * vTo.x - vFrom.x * vTo.z;
	      this._z = vFrom.x * vTo.y - vFrom.y * vTo.x;
	      this._w = r;
	    }

	    return this.normalize();
	  };

	  Quat.prototype.angleTo = function (q) {
	    return 2 * Math.acos(Math.abs((0, _Math.clamp)(this.dot(q), -1, 1)));
	  };

	  Quat.prototype.rotateTowards = function (q, step) {
	    var angle = this.angleTo(q);
	    if (angle === 0) return this;
	    var t = Math.min(1, step / angle);
	    this.slerp(q, t);
	    return this;
	  };

	  Quat.prototype.inverse = function () {
	    // Quat is assumed to have unit length
	    return this.conjugate();
	  };

	  Quat.prototype.invert = function () {
	    // quaternion is assumed to have unit length
	    return this.conjugate();
	  };

	  Quat.prototype.conjugate = function () {
	    this._x *= -1;
	    this._y *= -1;
	    this._z *= -1;
	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.dot = function (v) {
	    return this._x * v._x + this._y * v._y + this._z * v._z + this._w * v._w;
	  };

	  Quat.prototype.lengthSq = function () {
	    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
	  };

	  Quat.prototype.length = function () {
	    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
	  };

	  Quat.prototype.normalize = function () {
	    var l = this.length();

	    if (l === 0) {
	      this._x = 0;
	      this._y = 0;
	      this._z = 0;
	      this._w = 1;
	    } else {
	      l = 1 / l;
	      this._x = this._x * l;
	      this._y = this._y * l;
	      this._z = this._z * l;
	      this._w = this._w * l;
	    }

	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.multiply = function (q, p) {
	    if (p !== undefined) {
	      return this.multiplyQuats(q, p);
	    }

	    return this.multiplyQuats(this, q);
	  };

	  Quat.prototype.premultiply = function (q) {
	    return this.multiplyQuats(q, this);
	  };

	  Quat.prototype.multiplyQuats = function (a, b) {
	    // from http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/Quats/code/index.htm
	    var qax = a._x,
	        qay = a._y,
	        qaz = a._z,
	        qaw = a._w;
	    var qbx = b._x,
	        qby = b._y,
	        qbz = b._z,
	        qbw = b._w;
	    this._x = qax * qbw + qaw * qbx + qay * qbz - qaz * qby;
	    this._y = qay * qbw + qaw * qby + qaz * qbx - qax * qbz;
	    this._z = qaz * qbw + qaw * qbz + qax * qby - qay * qbx;
	    this._w = qaw * qbw - qax * qbx - qay * qby - qaz * qbz;
	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.slerp = function (qb, t) {
	    if (t === 0) return this;
	    if (t === 1) return this.copy(qb);
	    var x = this._x,
	        y = this._y,
	        z = this._z,
	        w = this._w; // http://www.euclideanspace.com/maths/algebra/realNormedAlgebra/Quats/slerp/

	    var cosHalfTheta = w * qb._w + x * qb._x + y * qb._y + z * qb._z;

	    if (cosHalfTheta < 0) {
	      this._w = -qb._w;
	      this._x = -qb._x;
	      this._y = -qb._y;
	      this._z = -qb._z;
	      cosHalfTheta = -cosHalfTheta;
	    } else {
	      this.copy(qb);
	    }

	    if (cosHalfTheta >= 1.0) {
	      this._w = w;
	      this._x = x;
	      this._y = y;
	      this._z = z;
	      return this;
	    }

	    var sqrSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

	    if (sqrSinHalfTheta <= Number.EPSILON) {
	      var s = 1 - t;
	      this._w = s * w + t * this._w;
	      this._x = s * x + t * this._x;
	      this._y = s * y + t * this._y;
	      this._z = s * z + t * this._z;
	      this.normalize();
	      this.fire("change", this);
	      return this;
	    }

	    var sinHalfTheta = Math.sqrt(sqrSinHalfTheta);
	    var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
	    var ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta,
	        ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
	    this._w = w * ratioA + this._w * ratioB;
	    this._x = x * ratioA + this._x * ratioB;
	    this._y = y * ratioA + this._y * ratioB;
	    this._z = z * ratioA + this._z * ratioB;
	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.equals = function (quat) {
	    return quat._x === this._x && quat._y === this._y && quat._z === this._z && quat._w === this._w;
	  };

	  Quat.prototype.fromArray = function (array, offset) {
	    if (offset === void 0) {
	      offset = 0;
	    }

	    this._x = array[offset];
	    this._y = array[offset + 1];
	    this._z = array[offset + 2];
	    this._w = array[offset + 3];
	    this.fire("change", this);
	    return this;
	  };

	  Quat.prototype.toArray = function (array, offset) {
	    if (array === void 0) {
	      array = [];
	    }

	    if (offset === void 0) {
	      offset = 0;
	    }

	    array[offset] = this._x;
	    array[offset + 1] = this._y;
	    array[offset + 2] = this._z;
	    array[offset + 3] = this._w;
	    return array;
	  };

	  return Quat;
	}(eventhandler.EventHandler);

	exports.Quat = Quat;

	function quat(x, y, z, w) {
	  return new Quat(x, y, z, w);
	}

	exports.quat = quat;
	});

	unwrapExports(Quat_1);
	var Quat_2 = Quat_1.quat;
	var Quat_3 = Quat_1.Quat;

	var Segment_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.segment = exports.Segment = void 0;



	var Segment =
	/** @class */
	function (_super) {
	  __extends(Segment, _super);
	  /**
	   * 线段
	   * @param  {Point|Vec3} p0
	   * @param  {Point|Vec3} p1
	   */


	  function Segment(_p0, _p1) {
	    if (_p0 === void 0) {
	      _p0 = (0, Vec3_1.v3)();
	    }

	    if (_p1 === void 0) {
	      _p1 = (0, Vec3_1.v3)();
	    }

	    var _this = _super.call(this) || this;

	    Object.setPrototypeOf(_this, Segment.prototype);

	    _this.push((0, Vec3_1.v3)().copy(_p0), (0, Vec3_1.v3)().copy(_p1));

	    _this.center = (0, Vec3_1.v3)().addVecs(_p0, _p1).multiplyScalar(0.5);
	    _this.extentDirection = (0, Vec3_1.v3)().subVecs(_p1, _p0);
	    _this.extentSqr = _this.extentDirection.lengthSq();
	    _this.extent = Math.sqrt(_this.extentSqr);
	    _this.direction = (0, Vec3_1.v3)().copy(_this.extentDirection).normalize();
	    return _this;
	  }

	  Segment.prototype.set = function (p0, p1) {
	    this[0].copy(p0);
	    this[1].copy(p1);
	    this.change();
	  };

	  Segment.prototype.change = function () {
	    this.center.addVecs(this[1], this[0]).multiplyScalar(0.5);
	    this.extentDirection.subVecs(this[1], this[0]);
	    this.extentSqr = this.extentDirection.lengthSq();
	    this.extent = Math.sqrt(this.extentSqr);
	    this.direction.copy(this.extentDirection.clone()).normalize();
	  };

	  Object.defineProperty(Segment.prototype, "p0", {
	    get: function () {
	      return this[0];
	    },
	    set: function (v) {
	      this[0].copy(v);
	      this.change();
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Segment.prototype, "p1", {
	    get: function () {
	      return this[1];
	    },
	    set: function (v) {
	      this[1].copy(v);
	      this.change();
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Segment.prototype.offset = function (distance, normal) {
	    if (normal === void 0) {
	      normal = Vec3_1.Vec3.UnitY;
	    }

	    var vdir = this.direction.clone().applyAxisAngle(normal, Math.PI / 2);
	    vdir.normalize().multiplyScalar(distance);
	    this.p0.add(vdir);
	    this.p1.add(vdir);
	  };
	  /**
	   * 线段到线段的距离
	   * @param  {Segment} segment
	   */


	  Segment.prototype.distanceSegment = function (segment) {
	    var result = {
	      parameters: [],
	      closests: []
	    };

	    function GetClampedRoot(slope, h0, h1) {
	      var r;

	      if (h0 < 0) {
	        if (h1 > 0) {
	          r = -h0 / slope;

	          if (r > 1) {
	            r = 0.5;
	          } // The slope is positive and -h0 is positive, so there is no
	          // need to test for a negative value and clamp it.

	        } else {
	          r = 1;
	        }
	      } else {
	        r = 0;
	      }

	      return r;
	    }

	    function ComputevarIntersection(sValue, classify, edge, end) {
	      if (classify[0] < 0) {
	        edge[0] = 0;
	        end[0][0] = 0;
	        end[0][1] = mF00 / mB;

	        if (end[0][1] < 0 || end[0][1] > 1) {
	          end[0][1] = 0.5;
	        }

	        if (classify[1] == 0) {
	          edge[1] = 3;
	          end[1][0] = sValue[1];
	          end[1][1] = 1;
	        } else // classify[1] > 0
	          {
	            edge[1] = 1;
	            end[1][0] = 1;
	            end[1][1] = mF10 / mB;

	            if (end[1][1] < 0 || end[1][1] > 1) {
	              end[1][1] = 0.5;
	            }
	          }
	      } else if (classify[0] == 0) {
	        edge[0] = 2;
	        end[0][0] = sValue[0];
	        end[0][1] = 0;

	        if (classify[1] < 0) {
	          edge[1] = 0;
	          end[1][0] = 0;
	          end[1][1] = mF00 / mB;

	          if (end[1][1] < 0 || end[1][1] > 1) {
	            end[1][1] = 0.5;
	          }
	        } else if (classify[1] == 0) {
	          edge[1] = 3;
	          end[1][0] = sValue[1];
	          end[1][1] = 1;
	        } else {
	          edge[1] = 1;
	          end[1][0] = 1;
	          end[1][1] = mF10 / mB;

	          if (end[1][1] < 0 || end[1][1] > 1) {
	            end[1][1] = 0.5;
	          }
	        }
	      } else // classify[0] > 0
	        {
	          edge[0] = 1;
	          end[0][0] = 1;
	          end[0][1] = mF10 / mB;

	          if (end[0][1] < 0 || end[0][1] > 1) {
	            end[0][1] = 0.5;
	          }

	          if (classify[1] == 0) {
	            edge[1] = 3;
	            end[1][0] = sValue[1];
	            end[1][1] = 1;
	          } else {
	            edge[1] = 0;
	            end[1][0] = 0;
	            end[1][1] = mF00 / mB;

	            if (end[1][1] < 0 || end[1][1] > 1) {
	              end[1][1] = 0.5;
	            }
	          }
	        }
	    }

	    function ComputeMinimumParameters(edge, end, parameters) {
	      var delta = end[1][1] - end[0][1];
	      var h0 = delta * (-mB * end[0][0] + mC * end[0][1] - mE);

	      if (h0 >= 0) {
	        if (edge[0] == 0) {
	          parameters[0] = 0;
	          parameters[1] = GetClampedRoot(mC, mG00, mG01);
	        } else if (edge[0] == 1) {
	          parameters[0] = 1;
	          parameters[1] = GetClampedRoot(mC, mG10, mG11);
	        } else {
	          parameters[0] = end[0][0];
	          parameters[1] = end[0][1];
	        }
	      } else {
	        var h1 = delta * (-mB * end[1][0] + mC * end[1][1] - mE);

	        if (h1 <= 0) {
	          if (edge[1] == 0) {
	            parameters[0] = 0;
	            parameters[1] = GetClampedRoot(mC, mG00, mG01);
	          } else if (edge[1] == 1) {
	            parameters[0] = 1;
	            parameters[1] = GetClampedRoot(mC, mG10, mG11);
	          } else {
	            parameters[0] = end[1][0];
	            parameters[1] = end[1][1];
	          }
	        } else // h0 < 0 and h1 > 0
	          {
	            var z = Math.min(Math.max(h0 / (h0 - h1), 0), 1);
	            var omz = 1 - z;
	            parameters[0] = omz * end[0][0] + z * end[1][0];
	            parameters[1] = omz * end[0][1] + z * end[1][1];
	          }
	      }
	    }

	    var seg0Dir = this.p1.clone().sub(this.p0);
	    var seg1Dir = segment.p1.clone().sub(segment.p0);
	    var segDiff = this.p0.clone().sub(segment.p0);
	    var mA = seg0Dir.dot(seg0Dir);
	    var mB = seg0Dir.dot(seg1Dir);
	    var mC = seg1Dir.dot(seg1Dir);
	    var mD = seg0Dir.dot(segDiff);
	    var mE = seg1Dir.dot(segDiff);
	    var mF00 = mD;
	    var mF10 = mF00 + mA;
	    var mF01 = mF00 - mB;
	    var mF11 = mF10 - mB;
	    var mG00 = -mE;
	    var mG10 = mG00 - mB;
	    var mG01 = mG00 + mC;
	    var mG11 = mG10 + mC;

	    if (mA > 0 && mC > 0) {
	      var sValue = [];
	      sValue[0] = GetClampedRoot(mA, mF00, mF10);
	      sValue[1] = GetClampedRoot(mA, mF01, mF11);
	      var classify = [];

	      for (var i = 0; i < 2; ++i) {
	        if (sValue[i] <= 0) {
	          classify[i] = -1;
	        } else if (sValue[i] >= 1) {
	          classify[i] = +1;
	        } else {
	          classify[i] = 0;
	        }
	      }

	      if (classify[0] == -1 && classify[1] == -1) {
	        // The minimum must occur on s = 0 for 0 <= t <= 1.
	        result.parameters[0] = 0;
	        result.parameters[1] = GetClampedRoot(mC, mG00, mG01);
	      } else if (classify[0] == +1 && classify[1] == +1) {
	        // The minimum must occur on s = 1 for 0 <= t <= 1.
	        result.parameters[0] = 1;
	        result.parameters[1] = GetClampedRoot(mC, mG10, mG11);
	      } else {
	        // The line dR/ds = 0 varersects the domain [0,1]^2 in a
	        // nondegenerate segment.  Compute the endpoints of that segment,
	        // end[0] and end[1].  The edge[i] flag tells you on which domain
	        // edge end[i] lives: 0 (s=0), 1 (s=1), 2 (t=0), 3 (t=1).
	        var edge = [];
	        var end = new Array(2);

	        for (var i_1 = 0; i_1 < end.length; i_1++) end[i_1] = new Array(2);

	        ComputevarIntersection(sValue, classify, edge, end); // The directional derivative of R along the segment of
	        // varersection is
	        //   H(z) = (end[1][1]-end[1][0])*dR/dt((1-z)*end[0] + z*end[1])
	        // for z in [0,1].  The formula uses the fact that dR/ds = 0 on
	        // the segment.  Compute the minimum of H on [0,1].

	        ComputeMinimumParameters(edge, end, result.parameters);
	      }
	    } else {
	      if (mA > 0) {
	        // The Q-segment is degenerate ( segment.point0 and  segment.p0 are the same point) and
	        // the quadratic is R(s,0) = a*s^2 + 2*d*s + f and has (half)
	        // first derivative F(t) = a*s + d.  The closests P-point is
	        // varerior to the P-segment when F(0) < 0 and F(1) > 0.
	        result.parameters[0] = GetClampedRoot(mA, mF00, mF10);
	        result.parameters[1] = 0;
	      } else if (mC > 0) {
	        // The P-segment is degenerate ( this.point0 and  this.p0 are the same point) and
	        // the quadratic is R(0,t) = c*t^2 - 2*e*t + f and has (half)
	        // first derivative G(t) = c*t - e.  The closests Q-point is
	        // varerior to the Q-segment when G(0) < 0 and G(1) > 0.
	        result.parameters[0] = 0;
	        result.parameters[1] = GetClampedRoot(mC, mG00, mG01);
	      } else {
	        // P-segment and Q-segment are degenerate.
	        result.parameters[0] = 0;
	        result.parameters[1] = 0;
	      }
	    }

	    result.closests[0] = this.p0.clone().multiplyScalar(1 - result.parameters[0]).add(this.p1.clone().multiplyScalar(result.parameters[0]));
	    result.closests[1] = segment.p0.clone().multiplyScalar(1 - result.parameters[1]).add(segment.p1.clone().multiplyScalar(result.parameters[1]));
	    var diff = result.closests[0].clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };

	  Segment.prototype.distancePlane = function (plane) {
	    plane.orientationPoint(this.p0);
	  }; //---Intersect--------------------------------------------------------------------------------------------


	  Segment.prototype.intersectSegment = function (segment) {
	  };

	  return Segment;
	}(Array);

	exports.Segment = Segment;

	function segment(p0, p1) {
	  return new Segment(p0, p1);
	}

	exports.segment = segment;
	});

	unwrapExports(Segment_1);
	var Segment_2 = Segment_1.segment;
	var Segment_3 = Segment_1.Segment;

	var Vec3_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.v3 = exports.Vec3 = void 0;









	var Vec3 =
	/** @class */
	function (_super) {
	  __extends(Vec3, _super);

	  function Vec3(_x, _y, _z) {
	    if (_x === void 0) {
	      _x = 0;
	    }

	    if (_y === void 0) {
	      _y = 0;
	    }

	    if (_z === void 0) {
	      _z = 0;
	    }

	    var _this = _super.call(this) || this;

	    _this._x = _x;
	    _this._y = _y;
	    _this._z = _z;
	    return _this;
	  }

	  Object.defineProperty(Vec3.prototype, "x", {
	    get: function () {
	      return this._x;
	    },
	    set: function (value) {
	      if (this._x !== value) {
	        this._x = value;
	        this.fire('change', 'x', this._x, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec3.prototype, "y", {
	    get: function () {
	      return this._y;
	    },
	    set: function (value) {
	      if (this._y !== value) {
	        this._y = value;
	        this.fire('change', 'y', this._y, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec3.prototype, "z", {
	    get: function () {
	      return this._z;
	    },
	    set: function (value) {
	      if (this._z !== value) {
	        this._z = value;
	        this.fire('change', 'z', this._z, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Vec3.isVec3 = function (v) {
	    return !isNaN(v.x) && !isNaN(v.y) && !isNaN(v.z) && isNaN(v.w);
	  };

	  Object.defineProperty(Vec3.prototype, "isVec3", {
	    get: function () {
	      return true;
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec3, "Up", {
	    get: function () {
	      return new Vec3(0, 1, 0);
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec3, "Down", {
	    get: function () {
	      return new Vec3(0, 1, 0);
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec3, "UnitX", {
	    get: function () {
	      return new Vec3(1, 0, 0);
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec3, "UnitY", {
	    get: function () {
	      return new Vec3(0, 1, 0);
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec3, "UnitZ", {
	    get: function () {
	      return new Vec3(0, 0, 1);
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Vec3.prototype.set = function (x, y, z) {
	    this._x = x;
	    this._y = y;
	    this._z = z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.setScalar = function (scalar) {
	    this._x = scalar;
	    this._y = scalar;
	    this._z = scalar;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.setComponent = function (index, value) {
	    switch (index) {
	      case 0:
	        this._x = value;
	        break;

	      case 1:
	        this._y = value;
	        break;

	      case 2:
	        this._z = value;
	        break;

	      default:
	        throw new Error("index is out of range: " + index);
	    }

	    return this;
	  };

	  Vec3.prototype.getComponent = function (index) {
	    switch (index) {
	      case 0:
	        return this._x;

	      case 1:
	        return this._y;

	      case 2:
	        return this._z;

	      default:
	        throw new Error("index is out of range: " + index);
	    }
	  };

	  Vec3.prototype.clone = function () {
	    return new Vec3(this._x, this._y, this._z);
	  };

	  Vec3.prototype.copy = function (v) {
	    this._x = v.x;
	    this._y = v.y;
	    this._z = v.z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.add = function (v, w) {
	    if (w !== undefined) {
	      console.warn("Vec3: .add() now only accepts one argument. Use .addVecs( a, b ) instead.");
	      return this.addVecs(v, w);
	    }

	    this._x += v.x;
	    this._y += v.y;
	    this._z += v.z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.addScalar = function (s) {
	    this._x += s;
	    this._y += s;
	    this._z += s;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.addVecs = function (a, b) {
	    this._x = a.x + b.x;
	    this._y = a.y + b.y;
	    this._z = a.z + b.z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.addScaledVec = function (v, s) {
	    this._x += v.x * s;
	    this._y += v.y * s;
	    this._z += v.z * s;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.sub = function (v, w) {
	    if (w !== undefined) {
	      console.warn("Vec3: .sub() now only accepts one argument. Use .subVecs( a, b ) instead.");
	      return this.subVecs(v, w);
	    }

	    this._x -= v.x;
	    this._y -= v.y;
	    this._z -= v.z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.subScalar = function (s) {
	    this._x -= s;
	    this._y -= s;
	    this._z -= s;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.subVecs = function (a, b) {
	    this._x = a.x - b.x;
	    this._y = a.y - b.y;
	    this._z = a.z - b.z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.multiply = function (v, w) {
	    if (w !== undefined) {
	      return this.multiplyVecs(v, w);
	    }

	    this._x *= v.x;
	    this._y *= v.y;
	    this._z *= v.z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.multiplyScalar = function (scalar) {
	    this._x *= scalar;
	    this._y *= scalar;
	    this._z *= scalar;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.multiplyVecs = function (a, b) {
	    this._x = a.x * b.x;
	    this._y = a.y * b.y;
	    this._z = a.z * b.z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.applyEuler = function (euler) {
	    if (!(euler && euler.isEuler)) {
	      console.error("Vec3: .applyEuler() now expects an Euler rotation rather than a Vec3 and order.");
	    }

	    return this.applyQuat(_quat.setFromEuler(euler));
	  };

	  Vec3.prototype.applyAxisAngle = function (axis, angle) {
	    return this.applyQuat(_quat.setFromAxisAngle(axis, angle));
	  };

	  Vec3.prototype.applyNormalMat = function (m) {
	    return this.applyMat3(m).normalize();
	  };

	  Vec3.prototype.applyMat3 = function (m) {
	    var x = this._x,
	        y = this._y,
	        z = this._z;
	    var e = m.elements;
	    this._x = e[0] * x + e[3] * y + e[6] * z;
	    this._y = e[1] * x + e[4] * y + e[7] * z;
	    this._z = e[2] * x + e[5] * y + e[8] * z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.applyMat4 = function (m) {
	    var x = this._x,
	        y = this._y,
	        z = this._z;
	    var e = m.elements;
	    var w = 1 / (e[3] * x + e[7] * y + e[11] * z + e[15]);
	    this._x = (e[0] * x + e[4] * y + e[8] * z + e[12]) * w;
	    this._y = (e[1] * x + e[5] * y + e[9] * z + e[13]) * w;
	    this._z = (e[2] * x + e[6] * y + e[10] * z + e[14]) * w;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.applyQuat = function (q) {
	    var x = this._x,
	        y = this._y,
	        z = this._z;
	    var qx = q.x,
	        qy = q.y,
	        qz = q.z,
	        qw = q.w; // calculate Quat * Vec

	    var ix = qw * x + qy * z - qz * y;
	    var iy = qw * y + qz * x - qx * z;
	    var iz = qw * z + qx * y - qy * x;
	    var iw = -qx * x - qy * y - qz * z; // calculate result * inverse Quat

	    this._x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
	    this._y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
	    this._z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.project = function (camera) {
	    return this.applyMat4(camera.matrixWorldInverse).applyMat4(camera.projectionMat);
	  };

	  Vec3.prototype.unproject = function (camera) {
	    return this.applyMat4(camera.projectionMatInverse).applyMat4(camera.matrixWorld);
	  };

	  Vec3.prototype.transformDirection = function (m) {
	    // input: Mat4 affine matrix
	    // Vec interpreted as a direction
	    var x = this._x,
	        y = this._y,
	        z = this._z;
	    var e = m.elements;
	    this._x = e[0] * x + e[4] * y + e[8] * z;
	    this._y = e[1] * x + e[5] * y + e[9] * z;
	    this._z = e[2] * x + e[6] * y + e[10] * z;
	    this.fire('change');
	    return this.normalize();
	  };

	  Vec3.prototype.divide = function (v) {
	    this._x /= v.x;
	    this._y /= v.y;
	    this._z /= v.z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.divideScalar = function (scalar) {
	    return this.multiplyScalar(1 / scalar);
	  };

	  Vec3.prototype.min = function (v) {
	    this._x = Math.min(this._x, v.x);
	    this._y = Math.min(this._y, v.y);
	    this._z = Math.min(this._z, v.z);
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.max = function (v) {
	    this._x = Math.max(this._x, v.x);
	    this._y = Math.max(this._y, v.y);
	    this._z = Math.max(this._z, v.z);
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.clamp = function (min, max) {
	    // assumes min < max, componentwise
	    this._x = Math.max(min.x, Math.min(max.x, this._x));
	    this._y = Math.max(min.y, Math.min(max.y, this._y));
	    this._z = Math.max(min.z, Math.min(max.z, this._z));
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.clampScalar = function (minVal, maxVal) {
	    this._x = Math.max(minVal, Math.min(maxVal, this._x));
	    this._y = Math.max(minVal, Math.min(maxVal, this._y));
	    this._z = Math.max(minVal, Math.min(maxVal, this._z));
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.clampLength = function (min, max) {
	    var length = this.length();
	    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
	  };

	  Vec3.prototype.floor = function () {
	    this._x = Math.floor(this._x);
	    this._y = Math.floor(this._y);
	    this._z = Math.floor(this._z);
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.ceil = function () {
	    this._x = Math.ceil(this._x);
	    this._y = Math.ceil(this._y);
	    this._z = Math.ceil(this._z);
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.round = function () {
	    this._x = Math.round(this._x);
	    this._y = Math.round(this._y);
	    this._z = Math.round(this._z);
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.roundToZero = function () {
	    this._x = this._x < 0 ? Math.ceil(this._x) : Math.floor(this._x);
	    this._y = this._y < 0 ? Math.ceil(this._y) : Math.floor(this._y);
	    this._z = this._z < 0 ? Math.ceil(this._z) : Math.floor(this._z);
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.negate = function () {
	    this._x = -this._x;
	    this._y = -this._y;
	    this._z = -this._z;
	    this.fire('change');
	    return this;
	  };

	  Vec3.prototype.dot = function (v) {
	    return this._x * v.x + this._y * v.y + this._z * v.z;
	  }; // TODO lengthSquared?


	  Vec3.prototype.lengthSq = function () {
	    return this._x * this._x + this._y * this._y + this._z * this._z;
	  };

	  Vec3.prototype.length = function () {
	    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z);
	  };

	  Vec3.prototype.manhattanLength = function () {
	    return Math.abs(this._x) + Math.abs(this._y) + Math.abs(this._z);
	  };

	  Vec3.prototype.normalize = function (robust) {

	    return this.divideScalar(this.length() || 1); // if (robust)
	    // {
	    //   var maxAbsComp = Math.abs(v[0]);
	    //   for (var i = 1; i < N; ++i)
	    //   {
	    //     var absComp = Math.abs(v[i]);
	    //     if (absComp > maxAbsComp)
	    //     {
	    //       maxAbsComp = absComp;
	    //     }
	    //   }
	    //   var length;
	    //   if (maxAbsComp > 0)
	    //   {
	    //     v /= maxAbsComp;
	    //     length = Math.sqrt(Dot(v, v));
	    //     v /= length;
	    //     length *= maxAbsComp;
	    //   }
	    //   else
	    //   {
	    //     length = 0;
	    //     for (var i = 0; i < N; ++i)
	    //     {
	    //       v[i] = 0;
	    //     }
	    //   }
	    //   return length;
	    // }
	    // else
	    // {
	    //   var length = this.length();
	    //   if (length > 0)
	    //   {
	    //     v /= length;
	    //   }
	    //   else
	    //   {
	    //     for (var i = 0; i < N; ++i)
	    //     {
	    //       v[i] = 0;
	    //     }
	    //   }
	    // }
	  };

	  Vec3.prototype.setLength = function (length) {
	    return this.normalize().multiplyScalar(length);
	  };

	  Vec3.prototype.lerp = function (v, alpha) {
	    this._x += (v.x - this._x) * alpha;
	    this._y += (v.y - this._y) * alpha;
	    this._z += (v.z - this._z) * alpha;
	    return this;
	  };

	  Vec3.prototype.lerpVecs = function (v1, v2, alpha) {
	    return this.subVecs(v2, v1).multiplyScalar(alpha).add(v1);
	  };

	  Vec3.prototype.slerp = function (v2, radian) {
	    return this.slerpVecs(this, v2, radian);
	  };
	  /**
	   *  v1 到 v2 选择angle弧度  v1，v2构成一个平面
	   * @param v1
	   * @param v2
	   * @param alpha
	   * @returns
	   */


	  Vec3.prototype.slerpVecs = function (v1, v2, radian) {
	    this.crossVecs(v1, v2).normalize();

	    _quat.setFromAxisAngle(this, radian);

	    this.applyQuat(_quat);
	  };

	  Vec3.prototype.cross = function (v, w) {
	    if (w !== undefined) {
	      console.warn("Vec3: .cross() now only accepts one argument. Use .crossVecs( a, b ) instead.");
	      return this.crossVecs(v, w);
	    }

	    return this.crossVecs(this, v);
	  };

	  Vec3.prototype.crossVecs = function (a, b) {
	    var ax = a.x,
	        ay = a.y,
	        az = a.z;
	    var bx = b.x,
	        by = b.y,
	        bz = b.z;
	    this._x = ay * bz - az * by;
	    this._y = az * bx - ax * bz;
	    this._z = ax * by - ay * bx;
	    return this;
	  };

	  Vec3.prototype.projectOnVec = function (vec) {
	    var scalar = vec.dot(this) / vec.lengthSq();
	    return this.copy(vec).multiplyScalar(scalar);
	  };
	  /**
	   * 投影到法线的所在平面  相当于平面上距离点最近的点
	   * @param planeNormal
	   * @returns
	   */


	  Vec3.prototype.projectOnPlaneNormal = function (planeNormal) {
	    _vec.copy(this).projectOnVec(planeNormal);

	    return this.sub(_vec);
	  };
	  /**
	   * 投影到平面
	   * @param normal 正交化的法线
	   * @param w  距离
	   * @returns
	   */


	  Vec3.prototype.projectOnPlaneNormalDis = function (normal, w) {
	    var scalar = normal.dot(this) - w;

	    _vec.copy(normal).multiplyScalar(scalar);

	    return this.sub(_vec);
	  };
	  /**
	  * 投影到平面
	  * @param plane 平面
	  * @returns
	  */


	  Vec3.prototype.projectOnPlane = function (plane) {
	    var scalar = plane.normal.dot(this) - plane.w;

	    _vec.copy(plane.normal).multiplyScalar(scalar);

	    return this.sub(_vec);
	  };
	  /**
	   * 从指定方向线(斜线，也可能是法线)上投影到平面
	   * @param planeNormal
	   * @param dir
	   */


	  Vec3.prototype.projectDirectionOnPlane = function (plane, dir) {
	    var scalar = plane.normal.dot(this) - plane.w;

	    _vec.copy(plane.normal).multiplyScalar(scalar);

	    _vec.negate().add(this);

	    var len = this.distanceTo(_vec);
	    var nlen = len / plane.normal.dot(dir);
	    this.add(_vec.copy(dir).negate().multiplyScalar(nlen));
	    return this;
	  };

	  Vec3.prototype.reflect = function (normal) {
	    // reflect incident Vec off plane orthogonal to normal
	    // normal is assumed to have unit length
	    return this.sub(_vec.copy(normal).multiplyScalar(2 * this.dot(normal)));
	  };

	  Vec3.prototype.angleTo = function (v, normal) {
	    if (normal) return this.angleToEx(v, normal);
	    var theta = this.dot(v) / Math.sqrt(this.lengthSq() * v.lengthSq());
	    return Math.acos((0, _Math.clamp)(theta, -1, 1));
	  };

	  Vec3.prototype.angleToEx = function (v, normal) {
	    var theta = this.dot(v) / Math.sqrt(this.lengthSq() * v.lengthSq());
	    if (this.clone().cross(v).dot(normal) > 0) return Math.acos((0, _Math.clamp)(theta, -1, 1));else return Math.PI * 2 - Math.acos((0, _Math.clamp)(theta, -1, 1));
	  };

	  Vec3.prototype.distanceTo = function (v) {
	    return Math.sqrt(this.distanceToSquared(v));
	  };

	  Vec3.prototype.distanceToSquared = function (v) {
	    var dx = this._x - v.x,
	        dy = this._y - v.y,
	        dz = this._z - v.z;
	    return dx * dx + dy * dy + dz * dz;
	  };

	  Vec3.prototype.manhattanDistanceTo = function (v) {
	    return Math.abs(this._x - v.x) + Math.abs(this._y - v.y) + Math.abs(this._z - v.z);
	  };

	  Vec3.prototype.setFromSpherical = function (s) {
	    return this.setFromSphericalCoords(s.radius, s.phi, s.theta);
	  };

	  Vec3.prototype.setFromSphericalCoords = function (radius, phi, theta) {
	    var sinPhiRadius = Math.sin(phi) * radius;
	    this._x = sinPhiRadius * Math.sin(theta);
	    this._y = Math.cos(phi) * radius;
	    this._z = sinPhiRadius * Math.cos(theta);
	    return this;
	  };

	  Vec3.prototype.setFromCylindrical = function (c) {
	    return this.setFromCylindricalCoords(c.radius, c.theta, c.y);
	  };

	  Vec3.prototype.setFromCylindricalCoords = function (radius, theta, y) {
	    this._x = radius * Math.sin(theta);
	    this._y = y;
	    this._z = radius * Math.cos(theta);
	    return this;
	  };

	  Vec3.prototype.setFromMatPosition = function (m) {
	    var e = m.elements;
	    this._x = e[12];
	    this._y = e[13];
	    this._z = e[14];
	    return this;
	  };

	  Vec3.prototype.setFromMatScale = function (m) {
	    var sx = this.setFromMatColumn(m, 0).length();
	    var sy = this.setFromMatColumn(m, 1).length();
	    var sz = this.setFromMatColumn(m, 2).length();
	    this._x = sx;
	    this._y = sy;
	    this._z = sz;
	    return this;
	  };

	  Vec3.prototype.setFromMatColumn = function (m, index) {
	    return this.fromArray(m.elements, index * 4);
	  };

	  Vec3.prototype.equals = function (v) {
	    return v.x === this._x && v.y === this._y && v.z === this._z;
	  };

	  Vec3.prototype.fromArray = function (array, offset) {
	    if (offset === undefined) offset = 0;
	    this._x = array[offset];
	    this._y = array[offset + 1];
	    this._z = array[offset + 2];
	    return this;
	  };

	  Vec3.prototype.toArray = function (array, offset) {
	    if (array === void 0) {
	      array = [];
	    }

	    if (offset === void 0) {
	      offset = 0;
	    }

	    array[offset] = this._x;
	    array[offset + 1] = this._y;
	    array[offset + 2] = this._z;
	    return array;
	  };

	  Vec3.prototype.fromBufferAttribute = function (attribute, index, offset) {
	    if (offset !== undefined) {
	      console.warn("Vec3: offset has been removed from .fromBufferAttribute().");
	    }

	    this._x = attribute.getX(index);
	    this._y = attribute.getY(index);
	    this._z = attribute.getZ(index);
	    return this;
	  };

	  Vec3.prototype.toFixed = function (fractionDigits) {
	    if (fractionDigits !== undefined) {
	      this._x = parseFloat(this._x.toFixed(fractionDigits));
	      this._y = parseFloat(this._y.toFixed(fractionDigits));
	      this._z = parseFloat(this._z.toFixed(fractionDigits));
	    }

	    return this;
	  }; //---Distance-------------------------------------------------------------------------------


	  Vec3.prototype.distancePoint = function (point) {
	    var result = {};
	    result.distanceSqr = this.distanceToSquared(point);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };

	  Vec3.prototype.distanceVec3 = function (point) {
	    return this.distancePoint(point);
	  };
	  /**
	   * 点到直线的距离  point distance to Line
	   * @param line
	   */


	  Vec3.prototype.distanceLine = function (line) {
	    var result = {
	      parameters: [],
	      closests: []
	    };
	    var diff = this.clone().sub(line.origin);
	    var lineParameter = line.direction.dot(diff);
	    var lineClosest = line.direction.clone().multiplyScalar(lineParameter).add(line.origin);
	    result.parameters.push(0, lineParameter);
	    result.closests.push(this, lineClosest);
	    diff = result.closests[0].clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	  * Test success
	  * 到射线的距离
	  * @param  {Line} line
	  * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
	  */


	  Vec3.prototype.distanceRay = function (ray) {
	    var result = {
	      parameters: [0],
	      closests: [this]
	    };
	    var diff = this.clone().sub(ray.origin);
	    result.parameters[1] = ray.direction.dot(diff);

	    if (result.parameters[1] > 0) {
	      result.closests[1] = ray.direction.clone().multiplyScalar(result.parameters[1]).add(ray.origin);
	    } else {
	      result.closests[1] = ray.origin.clone();
	    }

	    diff = this.clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	  * Test success
	  * 到线段的距离
	  * @param  {Line} line
	  * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
	  */


	  Vec3.prototype.distanceSegment = function (segment) {
	    var result = {
	      parameters: [],
	      closests: []
	    };
	    var diff = this.clone().sub(segment.p1);
	    var t = segment.extentDirection.dot(diff);

	    if (t >= 0) {
	      result.parameters[1] = 1;
	      result.closests[1] = segment.p1;
	    } else {
	      diff = this.clone().sub(segment.p0);
	      t = segment.extentDirection.dot(diff);

	      if (t <= 0) {
	        result.parameters[1] = 0;
	        result.closests[1] = segment.p0;
	      } else {
	        var sqrLength = segment.extentSqr;
	        if (sqrLength <= 0) sqrLength = 0;
	        t /= sqrLength;
	        result.parameters[1] = t;
	        result.closests[1] = segment.extentDirection.clone().multiplyScalar(t).add(segment.p0);
	      }
	    }

	    result.closests[0] = this;
	    diff = this.clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	   * 点与线段的距离
	   * @param plane
	   */


	  Vec3.prototype.distancePlane = function (plane) {
	    // this.clone().sub(plane.origin).dot(plane.normal);
	    var result = {
	      parameters: [],
	      closests: [],
	      signedDistance: 0,
	      distance: 0
	    };
	    result.signedDistance = this.clone().dot(plane.normal) - plane.w;
	    result.distance = Math.abs(result.signedDistance);
	    result.closests[1] = this.clone().sub(plane.normal.clone().multiplyScalar(result.signedDistance));
	    return result;
	  };
	  /**
	   * 点与圆圈的距离
	   * @param {*} circle
	   * @param {*} disk
	   * @returns {} result
	   */


	  Vec3.prototype.distanceCircle = function (circle) {
	    var result = {
	      parameters: [],
	      closests: [],
	      equidistant: false //是否等距

	    }; // Projection of P-C onto plane is Q-C = P-C - Dot(N,P-C)*N.

	    var PmC = this.clone().sub(circle.center);
	    var QmC = PmC.clone().sub(circle.normal.clone().multiplyScalar(circle.normal.dot(PmC)));
	    var lengthQmC = QmC.length();

	    if (lengthQmC > _Math.delta4) {
	      result.circleClosest = QmC.clone().multiplyScalar(circle.radius / lengthQmC).add(circle.center);
	      result.equidistant = false;
	    } else {
	      var offsetPoint = circle.center.clone().add(v3(10, 10, 10));
	      var CP = offsetPoint.sub(circle.center);
	      var CQ = CP.clone().sub(circle.normal.clone().multiplyScalar(circle.normal.dot(CP))).normalize(); //在圆圈圆心的法线上，到圆圈上的没一点都相同 

	      result.circleClosest = CQ.clone().multiplyScalar(circle.radius).add(circle.center);
	      result.equidistant = true;
	    }

	    result.closests.push(this, result.circleClosest);
	    var diff = this.clone().sub(result.circleClosest);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	  * 点与圆盘的距离
	  * @param {*} Disk
	  * @returns {} result
	  */


	  Vec3.prototype.distanceDisk = function (disk) {
	    var result = {
	      parameters: [],
	      closests: [],
	      signedDistance: 1,
	      distanceSqr: 0,
	      distance: 0
	    };
	    var PmC = this.clone().sub(disk.center);
	    var QmC = PmC.clone().sub(disk.normal.clone().multiplyScalar(disk.normal.dot(PmC)));
	    var lengthQmC = QmC.length();
	    result.signedDistance = this.clone().dot(disk.normal) - disk.w;

	    if (lengthQmC > disk.radius) {
	      result.diskClosest = QmC.clone().multiplyScalar(disk.radius / lengthQmC).add(disk.center);
	    } else {
	      var signedDistance = this.clone().dot(disk.normal) - disk.w;
	      result.diskClosest = this.clone().sub(disk.normal.clone().multiplyScalar(signedDistance));
	    }

	    result.closests.push(this, result.diskClosest);
	    var diff = this.clone().sub(result.diskClosest);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	   * 点与线段的距离
	   * 点与折线的距离 测试排除法，平均比线性检索(暴力法)要快两倍以上
	   * @param { Polyline | Vec3[]} polyline
	   */


	  Vec3.prototype.distancePolyline = function (polyline) {
	    var u = +Infinity;
	    var ipos = -1;
	    var tempResult;
	    var result = null;

	    for (var i = 0; i < polyline.length - 1; i++) {
	      var pti = void 0,
	          ptj = void 0;

	      if (Array.isArray(polyline)) {
	        pti = polyline[i];
	        ptj = polyline[i + 1];
	      } else {
	        pti = polyline.get(i);
	        ptj = polyline.get(i + 1);
	      }

	      if (Math.abs(pti.x - this._x) > u && Math.abs(ptj.x - this._x) > u && (pti.x - this._x) * (ptj.x - this._x) > 0) continue;
	      if (Math.abs(pti.y - this._y) > u && Math.abs(ptj.y - this._y) > u && (pti.y - this._y) * (ptj.y - this._y) > 0) continue;
	      if (Math.abs(pti.z - this._z) > u && Math.abs(ptj.z - this._z) > u && (pti.z - this._z) * (ptj.z - this._z) > 0) continue;
	      tempResult = this.distanceSegment(new Segment_1.Segment(pti, ptj));

	      if (tempResult.distance < u) {
	        u = tempResult.distance;
	        result = tempResult;
	        ipos = i;
	      }
	    }

	    result.segmentIndex = ipos;
	    return result;
	  };
	  /**
	   * 点到三角形的距离
	   * @param {Triangle} triangle
	   */


	  Vec3.prototype.distanceTriangle = function (triangle) {
	    function GetMinEdge02(a11, b1, p) {
	      p[0] = 0;

	      if (b1 >= 0) {
	        p[1] = 0;
	      } else if (a11 + b1 <= 0) {
	        p[1] = 1;
	      } else {
	        p[1] = -b1 / a11;
	      }
	    }

	    function GetMinEdge12(a01, a11, b1, f10, f01, p) {
	      var h0 = a01 + b1 - f10;

	      if (h0 >= 0) {
	        p[1] = 0;
	      } else {
	        var h1 = a11 + b1 - f01;

	        if (h1 <= 0) {
	          p[1] = 1;
	        } else {
	          p[1] = h0 / (h0 - h1);
	        }
	      }

	      p[0] = 1 - p[1];
	    }

	    function GetMinInterior(p0, h0, p1, h1, p) {
	      var z = h0 / (h0 - h1);
	      p[0] = (1 - z) * p0[0] + z * p1[0];
	      p[1] = (1 - z) * p0[1] + z * p1[1];
	    }

	    var diff = this.clone().sub(triangle.p0);
	    var edge0 = triangle.p1.clone().sub(triangle.p0);
	    var edge1 = triangle.p2.clone().sub(triangle.p0);
	    var a00 = edge0.dot(edge0);
	    var a01 = edge0.dot(edge1);
	    var a11 = edge1.dot(edge1);
	    var b0 = -diff.dot(edge0);
	    var b1 = -diff.dot(edge1);
	    var f00 = b0;
	    var f10 = b0 + a00;
	    var f01 = b0 + a01;
	    var p0 = [0, 0],
	        p1 = [0, 0],
	        p = [0, 0];
	    var dt1, h0, h1;

	    if (f00 >= 0) {
	      if (f01 >= 0) {
	        // (1) p0 = (0,0), p1 = (0,1), H(z) = G(L(z))
	        GetMinEdge02(a11, b1, p);
	      } else {
	        // (2) p0 = (0,t10), p1 = (t01,1-t01),
	        // H(z) = (t11 - t10)*G(L(z))
	        p0[0] = 0;
	        p0[1] = f00 / (f00 - f01);
	        p1[0] = f01 / (f01 - f10);
	        p1[1] = 1 - p1[0];
	        dt1 = p1[1] - p0[1];
	        h0 = dt1 * (a11 * p0[1] + b1);

	        if (h0 >= 0) {
	          GetMinEdge02(a11, b1, p);
	        } else {
	          h1 = dt1 * (a01 * p1[0] + a11 * p1[1] + b1);

	          if (h1 <= 0) {
	            GetMinEdge12(a01, a11, b1, f10, f01, p);
	          } else {
	            GetMinInterior(p0, h0, p1, h1, p);
	          }
	        }
	      }
	    } else if (f01 <= 0) {
	      if (f10 <= 0) {
	        // (3) p0 = (1,0), p1 = (0,1),
	        // H(z) = G(L(z)) - F(L(z))
	        GetMinEdge12(a01, a11, b1, f10, f01, p);
	      } else {
	        // (4) p0 = (t00,0), p1 = (t01,1-t01), H(z) = t11*G(L(z))
	        p0[0] = f00 / (f00 - f10);
	        p0[1] = 0;
	        p1[0] = f01 / (f01 - f10);
	        p1[1] = 1 - p1[0];
	        h0 = p1[1] * (a01 * p0[0] + b1);

	        if (h0 >= 0) {
	          p = p0; // GetMinEdge01
	        } else {
	          h1 = p1[1] * (a01 * p1[0] + a11 * p1[1] + b1);

	          if (h1 <= 0) {
	            GetMinEdge12(a01, a11, b1, f10, f01, p);
	          } else {
	            GetMinInterior(p0, h0, p1, h1, p);
	          }
	        }
	      }
	    } else if (f10 <= 0) {
	      // (5) p0 = (0,t10), p1 = (t01,1-t01),
	      // H(z) = (t11 - t10)*G(L(z))
	      p0[0] = 0;
	      p0[1] = f00 / (f00 - f01);
	      p1[0] = f01 / (f01 - f10);
	      p1[1] = 1 - p1[0];
	      dt1 = p1[1] - p0[1];
	      h0 = dt1 * (a11 * p0[1] + b1);

	      if (h0 >= 0) {
	        GetMinEdge02(a11, b1, p);
	      } else {
	        h1 = dt1 * (a01 * p1[0] + a11 * p1[1] + b1);

	        if (h1 <= 0) {
	          GetMinEdge12(a01, a11, b1, f10, f01, p);
	        } else {
	          GetMinInterior(p0, h0, p1, h1, p);
	        }
	      }
	    } else {
	      // (6) p0 = (t00,0), p1 = (0,t11), H(z) = t11*G(L(z))
	      p0[0] = f00 / (f00 - f10);
	      p0[1] = 0;
	      p1[0] = 0;
	      p1[1] = f00 / (f00 - f01);
	      h0 = p1[1] * (a01 * p0[0] + b1);

	      if (h0 >= 0) {
	        p = p0; // GetMinEdge01
	      } else {
	        h1 = p1[1] * (a11 * p1[1] + b1);

	        if (h1 <= 0) {
	          GetMinEdge02(a11, b1, p);
	        } else {
	          GetMinInterior(p0, h0, p1, h1, p);
	        }
	      }
	    }

	    var result = {
	      closests: [],
	      parameters: [],
	      triangleParameters: []
	    };
	    result.triangleParameters[0] = 1 - p[0] - p[1];
	    result.triangleParameters[1] = p[0];
	    result.triangleParameters[2] = p[1];
	    var closest = triangle.p0.clone().add(edge0.multiplyScalar(p[0])).add(edge1.multiplyScalar(p[1]));
	    result.parameters.push(0, result.triangleParameters);
	    result.closests.push(this, closest);
	    diff = this.clone().sub(closest);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	   * 点到矩形的距离
	   * @param  {Rectangle} rectangle
	   */


	  Vec3.prototype.distanceRectangle = function (rectangle) {
	    var result = {
	      rectangleParameters: [],
	      parameters: [],
	      closests: []
	    };
	    var diff = rectangle.center.clone().sub(this);
	    var b0 = diff.dot(rectangle.axis[0]);
	    var b1 = diff.dot(rectangle.axis[1]);
	    var s0 = -b0,
	        s1 = -b1;
	    result.distanceSqr = diff.dot(diff);

	    if (s0 < -rectangle.extent[0]) {
	      s0 = -rectangle.extent[0];
	    } else if (s0 > rectangle.extent[0]) {
	      s0 = rectangle.extent[0];
	    }

	    result.distanceSqr += s0 * (s0 + 2 * b0);

	    if (s1 < -rectangle.extent[1]) {
	      s1 = -rectangle.extent[1];
	    } else if (s1 > rectangle.extent[1]) {
	      s1 = rectangle.extent[1];
	    }

	    result.distanceSqr += s1 * (s1 + 2 * b1); // Account for numerical round-off error.

	    if (result.distanceSqr < 0) {
	      result.distanceSqr = 0;
	    }

	    result.distance = Math.sqrt(result.distanceSqr);
	    result.rectangleParameters[0] = s0;
	    result.rectangleParameters[1] = s1;
	    var rectangleClosestPoint = rectangle.center.clone();

	    for (var i = 0; i < 2; ++i) {
	      rectangleClosestPoint.add(rectangle.axis[i].multiplyScalar(result.rectangleParameters[i]));
	    }

	    result.closests[0] = this;
	    result.closests[1] = rectangleClosestPoint;
	    return result;
	  };
	  /**
	  * 点到胶囊的距离
	  * @param {Capsule} capsule
	  */


	  Vec3.prototype.distanceCapsule = function (capsule) {
	    var result = this.distanceSegment(capsule);
	    result.distance = result.distance - capsule.radius;
	    var closest = this.clone().sub(result.closests[1]).normalize().multiplyScalar(capsule.radius);
	    result.interior = result.distance < 0;
	    result.closests = [this, closest];
	    return result;
	  };

	  return Vec3;
	}(eventhandler.EventHandler);

	exports.Vec3 = Vec3;

	var _vec = v3();

	var _quat = (0, Quat_1.quat)();

	function v3(x, y, z) {
	  return new Vec3(x, y, z);
	}

	exports.v3 = v3;
	});

	unwrapExports(Vec3_1);
	var Vec3_2 = Vec3_1.v3;
	var Vec3_3 = Vec3_1.Vec3;

	var Vec4_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.v4 = exports.Vec4 = void 0;



	var Vec4 =
	/** @class */
	function (_super) {
	  __extends(Vec4, _super);

	  function Vec4(_x, _y, _z, _w) {
	    if (_x === void 0) {
	      _x = 0;
	    }

	    if (_y === void 0) {
	      _y = 0;
	    }

	    if (_z === void 0) {
	      _z = 0;
	    }

	    if (_w === void 0) {
	      _w = 1;
	    }

	    var _this = _super.call(this) || this;

	    _this._x = _x;
	    _this._y = _y;
	    _this._z = _z;
	    _this._w = _w;
	    _this.isVec4 = true;
	    return _this;
	  }

	  Object.defineProperty(Vec4.prototype, "x", {
	    get: function () {
	      return this._x;
	    },
	    set: function (value) {
	      if (this._x !== value) {
	        this._x = value;
	        this.fire('change', 'x', this._x, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec4.prototype, "y", {
	    get: function () {
	      return this._y;
	    },
	    set: function (value) {
	      if (this._y !== value) {
	        this._y = value;
	        this.fire('change', 'y', this._y, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec4.prototype, "z", {
	    get: function () {
	      return this._z;
	    },
	    set: function (value) {
	      if (this._z !== value) {
	        this._z = value;
	        this.fire('change', 'z', this._z, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec4.prototype, "w", {
	    get: function () {
	      return this._w;
	    },
	    set: function (value) {
	      if (this._w !== value) {
	        this._w = value;
	        this.fire('change', 'w', this._w, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Vec4.isVec4 = function (v) {
	    return !isNaN(v.x) && !isNaN(v.y) && !isNaN(v.z) && !isNaN(v.w);
	  };

	  Object.defineProperty(Vec4.prototype, "width", {
	    get: function () {
	      return this._z;
	    },
	    set: function (value) {
	      this._z = value;
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Vec4.prototype, "height", {
	    get: function () {
	      return this._w;
	    },
	    set: function (value) {
	      this._w = value;
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Vec4.prototype.set = function (x, y, z, w) {
	    this._x = x;
	    this._y = y;
	    this._z = z;
	    this._w = w;
	    return this;
	  };

	  Vec4.prototype.setScalar = function (scalar) {
	    this._x = scalar;
	    this._y = scalar;
	    this._z = scalar;
	    this._w = scalar;
	    return this;
	  };

	  Vec4.prototype.setX = function (x) {
	    this._x = x;
	    return this;
	  };

	  Vec4.prototype.setY = function (y) {
	    this._y = y;
	    return this;
	  };

	  Vec4.prototype.setZ = function (z) {
	    this._z = z;
	    return this;
	  };

	  Vec4.prototype.setW = function (w) {
	    this._w = w;
	    return this;
	  };

	  Vec4.prototype.setComponent = function (index, value) {
	    switch (index) {
	      case 0:
	        this._x = value;
	        break;

	      case 1:
	        this._y = value;
	        break;

	      case 2:
	        this._z = value;
	        break;

	      case 3:
	        this._w = value;
	        break;

	      default:
	        throw new Error("index is out of range: " + index);
	    }

	    return this;
	  };

	  Vec4.prototype.getComponent = function (index) {
	    switch (index) {
	      case 0:
	        return this._x;

	      case 1:
	        return this._y;

	      case 2:
	        return this._z;

	      case 3:
	        return this._w;

	      default:
	        throw new Error("index is out of range: " + index);
	    }
	  };

	  Vec4.prototype.clone = function () {
	    return new Vec4(this._x, this._y, this._z, this._w);
	  };

	  Vec4.prototype.copy = function (v) {
	    this._x = v.x;
	    this._y = v.y;
	    this._z = v.z;
	    this._w = v.w !== undefined ? v.w : 1;
	    return this;
	  };

	  Vec4.prototype.add = function (v, w) {
	    if (w !== undefined) {
	      console.warn("Vec4: .add() now only accepts one argument. Use .addVecs( a, b ) instead.");
	      return this.addVecs(v, w);
	    }

	    this._x += v.x;
	    this._y += v.y;
	    this._z += v.z;
	    this._w += v.w;
	    return this;
	  };

	  Vec4.prototype.addScalar = function (s) {
	    this._x += s;
	    this._y += s;
	    this._z += s;
	    this._w += s;
	    return this;
	  };

	  Vec4.prototype.addVecs = function (a, b) {
	    this._x = a.x + b.x;
	    this._y = a.y + b.y;
	    this._z = a.z + b.z;
	    this._w = a.w + b.w;
	    return this;
	  };

	  Vec4.prototype.addScaledVec = function (v, s) {
	    this._x += v.x * s;
	    this._y += v.y * s;
	    this._z += v.z * s;
	    this._w += v.w * s;
	    return this;
	  };

	  Vec4.prototype.sub = function (v, w) {
	    if (w !== undefined) {
	      return this.subVecs(v, w);
	    }

	    this._x -= v.x;
	    this._y -= v.y;
	    this._z -= v.z;
	    this._w -= v.w;
	    return this;
	  };

	  Vec4.prototype.subScalar = function (s) {
	    this._x -= s;
	    this._y -= s;
	    this._z -= s;
	    this._w -= s;
	    return this;
	  };

	  Vec4.prototype.subVecs = function (a, b) {
	    this._x = a.x - b.x;
	    this._y = a.y - b.y;
	    this._z = a.z - b.z;
	    this._w = a.w - b.w;
	    return this;
	  };

	  Vec4.prototype.multiplyScalar = function (scalar) {
	    this._x *= scalar;
	    this._y *= scalar;
	    this._z *= scalar;
	    this._w *= scalar;
	    return this;
	  };

	  Vec4.prototype.applyMat4 = function (m) {
	    var x = this._x,
	        y = this._y,
	        z = this._z,
	        w = this._w;
	    var e = m.elements;
	    this._x = e[0] * x + e[4] * y + e[8] * z + e[12] * w;
	    this._y = e[1] * x + e[5] * y + e[9] * z + e[13] * w;
	    this._z = e[2] * x + e[6] * y + e[10] * z + e[14] * w;
	    this._w = e[3] * x + e[7] * y + e[11] * z + e[15] * w;
	    return this;
	  };

	  Vec4.prototype.divideScalar = function (scalar) {
	    return this.multiplyScalar(1 / scalar);
	  };

	  Vec4.prototype.setAxisAngleFromQuat = function (q) {
	    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/QuatToAngle/index.htm
	    // q is assumed to be normalized
	    this._w = 2 * Math.acos(q.w);
	    var s = Math.sqrt(1 - q.w * q.w);

	    if (s < 0.0001) {
	      this._x = 1;
	      this._y = 0;
	      this._z = 0;
	    } else {
	      this._x = q.x / s;
	      this._y = q.y / s;
	      this._z = q.z / s;
	    }

	    return this;
	  };

	  Vec4.prototype.setAxisAngleFromRotationMat = function (m) {
	    // http://www.euclideanspace.com/maths/geometry/rotations/conversions/matrixToAngle/index.htm
	    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	    var angle,
	        x,
	        y,
	        z,
	        // variables for result
	    epsilon = 0.01,
	        // margin to allow for rounding errors
	    epsilon2 = 0.1,
	        // margin to distinguish between 0 and 180 degrees
	    te = m.elements,
	        m11 = te[0],
	        m12 = te[4],
	        m13 = te[8],
	        m21 = te[1],
	        m22 = te[5],
	        m23 = te[9],
	        m31 = te[2],
	        m32 = te[6],
	        m33 = te[10];

	    if (Math.abs(m12 - m21) < epsilon && Math.abs(m13 - m31) < epsilon && Math.abs(m23 - m32) < epsilon) {
	      // singularity found
	      // first check for identity matrix which must have +1 for all terms
	      // in leading diagonal and zero in other terms
	      if (Math.abs(m12 + m21) < epsilon2 && Math.abs(m13 + m31) < epsilon2 && Math.abs(m23 + m32) < epsilon2 && Math.abs(m11 + m22 + m33 - 3) < epsilon2) {
	        // this singularity is identity matrix so angle = 0
	        this.set(1, 0, 0, 0);
	        return this; // zero angle, arbitrary axis
	      } // otherwise this singularity is angle = 180


	      angle = Math.PI;
	      var xx = (m11 + 1) / 2;
	      var yy = (m22 + 1) / 2;
	      var zz = (m33 + 1) / 2;
	      var xy = (m12 + m21) / 4;
	      var xz = (m13 + m31) / 4;
	      var yz = (m23 + m32) / 4;

	      if (xx > yy && xx > zz) {
	        // m11 is the largest diagonal term
	        if (xx < epsilon) {
	          x = 0;
	          y = 0.707106781;
	          z = 0.707106781;
	        } else {
	          x = Math.sqrt(xx);
	          y = xy / x;
	          z = xz / x;
	        }
	      } else if (yy > zz) {
	        // m22 is the largest diagonal term
	        if (yy < epsilon) {
	          x = 0.707106781;
	          y = 0;
	          z = 0.707106781;
	        } else {
	          y = Math.sqrt(yy);
	          x = xy / y;
	          z = yz / y;
	        }
	      } else {
	        // m33 is the largest diagonal term so base result on this
	        if (zz < epsilon) {
	          x = 0.707106781;
	          y = 0.707106781;
	          z = 0;
	        } else {
	          z = Math.sqrt(zz);
	          x = xz / z;
	          y = yz / z;
	        }
	      }

	      this.set(x, y, z, angle);
	      return this; // return 180 deg rotation
	    } // as we have reached here there are no singularities so we can handle normally


	    var s = Math.sqrt((m32 - m23) * (m32 - m23) + (m13 - m31) * (m13 - m31) + (m21 - m12) * (m21 - m12)); // used to normalize

	    if (Math.abs(s) < 0.001) s = 1; // prevent divide by zero, should not happen if matrix is orthogonal and should be
	    // caught by singularity test above, but I've left it in just in case

	    this._x = (m32 - m23) / s;
	    this._y = (m13 - m31) / s;
	    this._z = (m21 - m12) / s;
	    this._w = Math.acos((m11 + m22 + m33 - 1) / 2);
	    return this;
	  };

	  Vec4.prototype.min = function (v) {
	    this._x = Math.min(this._x, v.x);
	    this._y = Math.min(this._y, v.y);
	    this._z = Math.min(this._z, v.z);
	    this._w = Math.min(this._w, v.w);
	    return this;
	  };

	  Vec4.prototype.max = function (v) {
	    this._x = Math.max(this._x, v.x);
	    this._y = Math.max(this._y, v.y);
	    this._z = Math.max(this._z, v.z);
	    this._w = Math.max(this._w, v.w);
	    return this;
	  };

	  Vec4.prototype.clamp = function (min, max) {
	    // assumes min < max, componentwise
	    this._x = Math.max(min.x, Math.min(max.x, this._x));
	    this._y = Math.max(min.y, Math.min(max.y, this._y));
	    this._z = Math.max(min.z, Math.min(max.z, this._z));
	    this._w = Math.max(min.w, Math.min(max.w, this._w));
	    return this;
	  };

	  Vec4.prototype.clampScalar = function (minVal, maxVal) {
	    this._x = Math.max(minVal, Math.min(maxVal, this._x));
	    this._y = Math.max(minVal, Math.min(maxVal, this._y));
	    this._z = Math.max(minVal, Math.min(maxVal, this._z));
	    this._w = Math.max(minVal, Math.min(maxVal, this._w));
	    return this;
	  };

	  Vec4.prototype.clampLength = function (min, max) {
	    var length = this.length();
	    return this.divideScalar(length || 1).multiplyScalar(Math.max(min, Math.min(max, length)));
	  };

	  Vec4.prototype.floor = function () {
	    this._x = Math.floor(this._x);
	    this._y = Math.floor(this._y);
	    this._z = Math.floor(this._z);
	    this._w = Math.floor(this._w);
	    return this;
	  };

	  Vec4.prototype.ceil = function () {
	    this._x = Math.ceil(this._x);
	    this._y = Math.ceil(this._y);
	    this._z = Math.ceil(this._z);
	    this._w = Math.ceil(this._w);
	    return this;
	  };

	  Vec4.prototype.round = function () {
	    this._x = Math.round(this._x);
	    this._y = Math.round(this._y);
	    this._z = Math.round(this._z);
	    this._w = Math.round(this._w);
	    return this;
	  };

	  Vec4.prototype.roundToZero = function () {
	    this._x = this._x < 0 ? Math.ceil(this._x) : Math.floor(this._x);
	    this._y = this._y < 0 ? Math.ceil(this._y) : Math.floor(this._y);
	    this._z = this._z < 0 ? Math.ceil(this._z) : Math.floor(this._z);
	    this._w = this._w < 0 ? Math.ceil(this._w) : Math.floor(this._w);
	    return this;
	  };

	  Vec4.prototype.negate = function () {
	    this._x = -this._x;
	    this._y = -this._y;
	    this._z = -this._z;
	    this._w = -this._w;
	    return this;
	  };

	  Vec4.prototype.dot = function (v) {
	    return this._x * v.x + this._y * v.y + this._z * v.z + this._w * v.w;
	  };

	  Vec4.prototype.lengthSq = function () {
	    return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
	  };

	  Vec4.prototype.length = function () {
	    return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
	  };

	  Vec4.prototype.manhattanLength = function () {
	    return Math.abs(this._x) + Math.abs(this._y) + Math.abs(this._z) + Math.abs(this._w);
	  };

	  Vec4.prototype.normalize = function () {
	    return this.divideScalar(this.length() || 1);
	  };

	  Vec4.prototype.setLength = function (length) {
	    return this.normalize().multiplyScalar(length);
	  };

	  Vec4.prototype.lerp = function (v, alpha) {
	    this._x += (v.x - this._x) * alpha;
	    this._y += (v.y - this._y) * alpha;
	    this._z += (v.z - this._z) * alpha;
	    this._w += (v.w - this._w) * alpha;
	    return this;
	  };

	  Vec4.prototype.lerpVecs = function (v1, v2, alpha) {
	    return this.subVecs(v2, v1).multiplyScalar(alpha).add(v1);
	  };

	  Vec4.prototype.equals = function (v) {
	    return v.x === this._x && v.y === this._y && v.z === this._z && v.w === this._w;
	  };

	  Vec4.prototype.fromArray = function (array, offset) {
	    if (offset === void 0) {
	      offset = 0;
	    }

	    this._x = array[offset];
	    this._y = array[offset + 1];
	    this._z = array[offset + 2];
	    this._w = array[offset + 3];
	    return this;
	  };

	  Vec4.prototype.toArray = function (array, offset) {
	    if (array === void 0) {
	      array = [];
	    }

	    if (offset === void 0) {
	      offset = 0;
	    }

	    array[offset] = this._x;
	    array[offset + 1] = this._y;
	    array[offset + 2] = this._z;
	    array[offset + 3] = this._w;
	    return array;
	  };

	  Vec4.prototype.fromBufferAttribute = function (attribute, index, offset) {
	    if (offset !== undefined) {
	      console.warn("Vec4: offset has been removed from .fromBufferAttribute().");
	    }

	    this._x = attribute.getX(index);
	    this._y = attribute.getY(index);
	    this._z = attribute.getZ(index);
	    this._w = attribute.getW(index);
	    return this;
	  };

	  return Vec4;
	}(eventhandler.EventHandler);

	exports.Vec4 = Vec4;

	function v4(x, y, z, w) {
	  return new Vec4(x, y, z, w);
	}

	exports.v4 = v4;
	});

	unwrapExports(Vec4_1);
	var Vec4_2 = Vec4_1.v4;
	var Vec4_3 = Vec4_1.Vec4;

	var Mat3_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.m3 = exports.Mat3 = void 0;



	var _Vec = (0, Vec3_1.v3)();

	var Mat3 =
	/** @class */
	function () {
	  function Mat3() {
	    this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1];
	    this.isMat3 = true;

	    if (arguments.length > 0) {
	      console.error("Mat3: the constructor no longer reads arguments. use .set() instead.");
	    }
	  }

	  Mat3.prototype.set = function (n11, n12, n13, n21, n22, n23, n31, n32, n33) {
	    var te = this.elements;
	    te[0] = n11;
	    te[1] = n21;
	    te[2] = n31;
	    te[3] = n12;
	    te[4] = n22;
	    te[5] = n32;
	    te[6] = n13;
	    te[7] = n23;
	    te[8] = n33;
	    return this;
	  };

	  Mat3.prototype.identity = function () {
	    this.set(1, 0, 0, 0, 1, 0, 0, 0, 1);
	    return this;
	  };

	  Mat3.prototype.clone = function () {
	    return new Mat3().fromArray(this.elements);
	  };

	  Mat3.prototype.copy = function (m) {
	    var te = this.elements;
	    var me = m.elements;
	    te[0] = me[0];
	    te[1] = me[1];
	    te[2] = me[2];
	    te[3] = me[3];
	    te[4] = me[4];
	    te[5] = me[5];
	    te[6] = me[6];
	    te[7] = me[7];
	    te[8] = me[8];
	    return this;
	  };

	  Mat3.prototype.setFromMat4 = function (m) {
	    var me = m.elements;
	    this.set(me[0], me[4], me[8], me[1], me[5], me[9], me[2], me[6], me[10]);
	    return this;
	  };

	  Mat3.prototype.applyToBufferAttribute = function (attribute) {
	    for (var i = 0, l = attribute.count; i < l; i++) {
	      _Vec.x = attribute.getX(i);
	      _Vec.y = attribute.getY(i);
	      _Vec.z = attribute.getZ(i);

	      _Vec.applyMat3(this);

	      attribute.setXYZ(i, _Vec.x, _Vec.y, _Vec.z);
	    }

	    return attribute;
	  };

	  Mat3.prototype.multiply = function (m) {
	    return this.multiplyMatrices(this, m);
	  };

	  Mat3.prototype.premultiply = function (m) {
	    return this.multiplyMatrices(m, this);
	  };

	  Mat3.prototype.multiplyMatrices = function (a, b) {
	    var ae = a.elements;
	    var be = b.elements;
	    var te = this.elements;
	    var a11 = ae[0],
	        a12 = ae[3],
	        a13 = ae[6];
	    var a21 = ae[1],
	        a22 = ae[4],
	        a23 = ae[7];
	    var a31 = ae[2],
	        a32 = ae[5],
	        a33 = ae[8];
	    var b11 = be[0],
	        b12 = be[3],
	        b13 = be[6];
	    var b21 = be[1],
	        b22 = be[4],
	        b23 = be[7];
	    var b31 = be[2],
	        b32 = be[5],
	        b33 = be[8];
	    te[0] = a11 * b11 + a12 * b21 + a13 * b31;
	    te[3] = a11 * b12 + a12 * b22 + a13 * b32;
	    te[6] = a11 * b13 + a12 * b23 + a13 * b33;
	    te[1] = a21 * b11 + a22 * b21 + a23 * b31;
	    te[4] = a21 * b12 + a22 * b22 + a23 * b32;
	    te[7] = a21 * b13 + a22 * b23 + a23 * b33;
	    te[2] = a31 * b11 + a32 * b21 + a33 * b31;
	    te[5] = a31 * b12 + a32 * b22 + a33 * b32;
	    te[8] = a31 * b13 + a32 * b23 + a33 * b33;
	    return this;
	  };

	  Mat3.prototype.multiplyScalar = function (s) {
	    var te = this.elements;
	    te[0] *= s;
	    te[3] *= s;
	    te[6] *= s;
	    te[1] *= s;
	    te[4] *= s;
	    te[7] *= s;
	    te[2] *= s;
	    te[5] *= s;
	    te[8] *= s;
	    return this;
	  };

	  Mat3.prototype.determinant = function () {
	    var te = this.elements;
	    var a = te[0],
	        b = te[1],
	        c = te[2],
	        d = te[3],
	        e = te[4],
	        f = te[5],
	        g = te[6],
	        h = te[7],
	        i = te[8];
	    return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
	  };

	  Mat3.prototype.getInverse = function (matrix, throwOnDegenerate) {
	    if (throwOnDegenerate === void 0) {
	      throwOnDegenerate = false;
	    }

	    if (matrix && matrix.isMat4) {
	      console.error("Mat3: .getInverse() no longer takes a Mat4 argument.");
	    }

	    var me = matrix.elements,
	        te = this.elements,
	        n11 = me[0],
	        n21 = me[1],
	        n31 = me[2],
	        n12 = me[3],
	        n22 = me[4],
	        n32 = me[5],
	        n13 = me[6],
	        n23 = me[7],
	        n33 = me[8],
	        t11 = n33 * n22 - n32 * n23,
	        t12 = n32 * n13 - n33 * n12,
	        t13 = n23 * n12 - n22 * n13,
	        det = n11 * t11 + n21 * t12 + n31 * t13;

	    if (det === 0) {
	      var msg = "Mat3: .getInverse() can't invert matrix, determinant is 0";

	      if (throwOnDegenerate === true) {
	        throw new Error(msg);
	      } else {
	        console.warn(msg);
	      }

	      return this.identity();
	    }

	    var detInv = 1 / det;
	    te[0] = t11 * detInv;
	    te[1] = (n31 * n23 - n33 * n21) * detInv;
	    te[2] = (n32 * n21 - n31 * n22) * detInv;
	    te[3] = t12 * detInv;
	    te[4] = (n33 * n11 - n31 * n13) * detInv;
	    te[5] = (n31 * n12 - n32 * n11) * detInv;
	    te[6] = t13 * detInv;
	    te[7] = (n21 * n13 - n23 * n11) * detInv;
	    te[8] = (n22 * n11 - n21 * n12) * detInv;
	    return this;
	  };

	  Mat3.prototype.transpose = function () {
	    var tmp,
	        m = this.elements;
	    tmp = m[1];
	    m[1] = m[3];
	    m[3] = tmp;
	    tmp = m[2];
	    m[2] = m[6];
	    m[6] = tmp;
	    tmp = m[5];
	    m[5] = m[7];
	    m[7] = tmp;
	    return this;
	  };

	  Mat3.prototype.getNormalMat = function (mat4) {
	    return this.setFromMat4(mat4).getInverse(this).transpose();
	  };

	  Mat3.prototype.transposeIntoArray = function (r) {
	    var m = this.elements;
	    r[0] = m[0];
	    r[1] = m[3];
	    r[2] = m[6];
	    r[3] = m[1];
	    r[4] = m[4];
	    r[5] = m[7];
	    r[6] = m[2];
	    r[7] = m[5];
	    r[8] = m[8];
	    return this;
	  };

	  Mat3.prototype.setUvTransform = function (tx, ty, sx, sy, rotation, cx, cy) {
	    var c = Math.cos(rotation);
	    var s = Math.sin(rotation);
	    this.set(sx * c, sx * s, -sx * (c * cx + s * cy) + cx + tx, -sy * s, sy * c, -sy * (-s * cx + c * cy) + cy + ty, 0, 0, 1);
	  };

	  Mat3.prototype.scale = function (sx, sy) {
	    var te = this.elements;
	    te[0] *= sx;
	    te[3] *= sx;
	    te[6] *= sx;
	    te[1] *= sy;
	    te[4] *= sy;
	    te[7] *= sy;
	    return this;
	  };

	  Mat3.prototype.rotate = function (theta) {
	    var c = Math.cos(theta);
	    var s = Math.sin(theta);
	    var te = this.elements;
	    var a11 = te[0],
	        a12 = te[3],
	        a13 = te[6];
	    var a21 = te[1],
	        a22 = te[4],
	        a23 = te[7];
	    te[0] = c * a11 + s * a21;
	    te[3] = c * a12 + s * a22;
	    te[6] = c * a13 + s * a23;
	    te[1] = -s * a11 + c * a21;
	    te[4] = -s * a12 + c * a22;
	    te[7] = -s * a13 + c * a23;
	    return this;
	  };

	  Mat3.prototype.translate = function (tx, ty) {
	    var te = this.elements;
	    te[0] += tx * te[2];
	    te[3] += tx * te[5];
	    te[6] += tx * te[8];
	    te[1] += ty * te[2];
	    te[4] += ty * te[5];
	    te[7] += ty * te[8];
	    return this;
	  };

	  Mat3.prototype.equals = function (matrix) {
	    var te = this.elements;
	    var me = matrix.elements;

	    for (var i = 0; i < 9; i++) {
	      if (te[i] !== me[i]) return false;
	    }

	    return true;
	  };

	  Mat3.prototype.fromArray = function (array, offset) {
	    if (offset === void 0) {
	      offset = 0;
	    }

	    for (var i = 0; i < 9; i++) {
	      this.elements[i] = array[i + offset];
	    }

	    return this;
	  };

	  Mat3.prototype.toArray = function (array, offset) {
	    if (array === void 0) {
	      array = [];
	    }

	    if (offset === void 0) {
	      offset = 0;
	    }

	    var te = this.elements;
	    array[offset] = te[0];
	    array[offset + 1] = te[1];
	    array[offset + 2] = te[2];
	    array[offset + 3] = te[3];
	    array[offset + 4] = te[4];
	    array[offset + 5] = te[5];
	    array[offset + 6] = te[6];
	    array[offset + 7] = te[7];
	    array[offset + 8] = te[8];
	    return array;
	  };

	  return Mat3;
	}();

	exports.Mat3 = Mat3;

	function m3() {
	  return new Mat3();
	}

	exports.m3 = m3;
	});

	unwrapExports(Mat3_1);
	var Mat3_2 = Mat3_1.m3;
	var Mat3_3 = Mat3_1.Mat3;

	var Mat4_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.m4 = exports.Mat4 = void 0;



	var Mat4 =
	/** @class */
	function () {
	  function Mat4() {
	    this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
	    this.isMat4 = true;

	    if (arguments.length > 0) {
	      console.error(" Mat4: the constructor no longer reads arguments. use .set() instead.");
	    }
	  }

	  Mat4.prototype.set = function (n11, n12, n13, n14, n21, n22, n23, n24, n31, n32, n33, n34, n41, n42, n43, n44) {
	    var te = this.elements;
	    te[0] = n11;
	    te[4] = n12;
	    te[8] = n13;
	    te[12] = n14;
	    te[1] = n21;
	    te[5] = n22;
	    te[9] = n23;
	    te[13] = n24;
	    te[2] = n31;
	    te[6] = n32;
	    te[10] = n33;
	    te[14] = n34;
	    te[3] = n41;
	    te[7] = n42;
	    te[11] = n43;
	    te[15] = n44;
	    return this;
	  };

	  Object.defineProperty(Mat4, "Identity", {
	    get: function () {
	      return new Mat4();
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Mat4.prototype.identity = function () {
	    this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	    return this;
	  };

	  Mat4.prototype.clone = function () {
	    return new Mat4().fromArray(this.elements);
	  };

	  Mat4.prototype.copy = function (m) {
	    var te = this.elements;
	    var me = m.elements;
	    te[0] = me[0];
	    te[1] = me[1];
	    te[2] = me[2];
	    te[3] = me[3];
	    te[4] = me[4];
	    te[5] = me[5];
	    te[6] = me[6];
	    te[7] = me[7];
	    te[8] = me[8];
	    te[9] = me[9];
	    te[10] = me[10];
	    te[11] = me[11];
	    te[12] = me[12];
	    te[13] = me[13];
	    te[14] = me[14];
	    te[15] = me[15];
	    return this;
	  };

	  Mat4.prototype.copyPosition = function (m) {
	    var te = this.elements,
	        me = m.elements;
	    te[12] = me[12];
	    te[13] = me[13];
	    te[14] = me[14];
	    return this;
	  };

	  Mat4.prototype.extractBasis = function (xAxis, yAxis, zAxis) {
	    xAxis.setFromMatColumn(this, 0);
	    yAxis.setFromMatColumn(this, 1);
	    zAxis.setFromMatColumn(this, 2);
	    return this;
	  };

	  Mat4.prototype.makeBasis = function (xAxis, yAxis, zAxis) {
	    this.set(xAxis.x, yAxis.x, zAxis.x, 0, xAxis.y, yAxis.y, zAxis.y, 0, xAxis.z, yAxis.z, zAxis.z, 0, 0, 0, 0, 1);
	    return this;
	  };

	  Mat4.prototype.extractRotation = function (m) {
	    // this method does not support reflection matrices
	    var te = this.elements;
	    var me = m.elements;

	    var scaleX = 1 / _v1.setFromMatColumn(m, 0).length();

	    var scaleY = 1 / _v1.setFromMatColumn(m, 1).length();

	    var scaleZ = 1 / _v1.setFromMatColumn(m, 2).length();

	    te[0] = me[0] * scaleX;
	    te[1] = me[1] * scaleX;
	    te[2] = me[2] * scaleX;
	    te[3] = 0;
	    te[4] = me[4] * scaleY;
	    te[5] = me[5] * scaleY;
	    te[6] = me[6] * scaleY;
	    te[7] = 0;
	    te[8] = me[8] * scaleZ;
	    te[9] = me[9] * scaleZ;
	    te[10] = me[10] * scaleZ;
	    te[11] = 0;
	    te[12] = 0;
	    te[13] = 0;
	    te[14] = 0;
	    te[15] = 1;
	    return this;
	  };

	  Mat4.prototype.makeRotationFromEuler = function (euler) {
	    if (!(euler && euler.isEuler)) {
	      console.error(" Mat4: .makeRotationFromEuler() now expects a Euler rotation rather than a Vec3 and order.");
	    }

	    var te = this.elements;
	    var x = euler.x,
	        y = euler.y,
	        z = euler.z;
	    var a = Math.cos(x),
	        b = Math.sin(x);
	    var c = Math.cos(y),
	        d = Math.sin(y);
	    var e = Math.cos(z),
	        f = Math.sin(z);

	    if (euler.order === "XYZ") {
	      var ae = a * e,
	          af = a * f,
	          be = b * e,
	          bf = b * f;
	      te[0] = c * e;
	      te[4] = -c * f;
	      te[8] = d;
	      te[1] = af + be * d;
	      te[5] = ae - bf * d;
	      te[9] = -b * c;
	      te[2] = bf - ae * d;
	      te[6] = be + af * d;
	      te[10] = a * c;
	    } else if (euler.order === "YXZ") {
	      var ce = c * e,
	          cf = c * f,
	          de = d * e,
	          df = d * f;
	      te[0] = ce + df * b;
	      te[4] = de * b - cf;
	      te[8] = a * d;
	      te[1] = a * f;
	      te[5] = a * e;
	      te[9] = -b;
	      te[2] = cf * b - de;
	      te[6] = df + ce * b;
	      te[10] = a * c;
	    } else if (euler.order === "ZXY") {
	      var ce = c * e,
	          cf = c * f,
	          de = d * e,
	          df = d * f;
	      te[0] = ce - df * b;
	      te[4] = -a * f;
	      te[8] = de + cf * b;
	      te[1] = cf + de * b;
	      te[5] = a * e;
	      te[9] = df - ce * b;
	      te[2] = -a * d;
	      te[6] = b;
	      te[10] = a * c;
	    } else if (euler.order === "ZYX") {
	      var ae = a * e,
	          af = a * f,
	          be = b * e,
	          bf = b * f;
	      te[0] = c * e;
	      te[4] = be * d - af;
	      te[8] = ae * d + bf;
	      te[1] = c * f;
	      te[5] = bf * d + ae;
	      te[9] = af * d - be;
	      te[2] = -d;
	      te[6] = b * c;
	      te[10] = a * c;
	    } else if (euler.order === "YZX") {
	      var ac = a * c,
	          ad = a * d,
	          bc = b * c,
	          bd = b * d;
	      te[0] = c * e;
	      te[4] = bd - ac * f;
	      te[8] = bc * f + ad;
	      te[1] = f;
	      te[5] = a * e;
	      te[9] = -b * e;
	      te[2] = -d * e;
	      te[6] = ad * f + bc;
	      te[10] = ac - bd * f;
	    } else if (euler.order === "XZY") {
	      var ac = a * c,
	          ad = a * d,
	          bc = b * c,
	          bd = b * d;
	      te[0] = c * e;
	      te[4] = -f;
	      te[8] = d * e;
	      te[1] = ac * f + bd;
	      te[5] = a * e;
	      te[9] = ad * f - bc;
	      te[2] = bc * f - ad;
	      te[6] = b * e;
	      te[10] = bd * f + ac;
	    } // bottom row


	    te[3] = 0;
	    te[7] = 0;
	    te[11] = 0; // last column

	    te[12] = 0;
	    te[13] = 0;
	    te[14] = 0;
	    te[15] = 1;
	    return this;
	  };

	  Mat4.prototype.makeRotationFromQuat = function (q) {
	    return this.compose(_zero, q, _one);
	  };

	  Mat4.prototype.lookAt = function (eye, target, up) {
	    var te = this.elements;

	    _z.subVecs(eye, target);

	    if (_z.lengthSq() === 0) {
	      // eye and target are in the same position
	      _z.z = 1;
	    }

	    _z.normalize();

	    _x.crossVecs(up, _z);

	    if (_x.lengthSq() === 0) {
	      // up and z are parallel
	      if (Math.abs(up.z) === 1) {
	        _z.x += 0.0001;
	      } else {
	        _z.z += 0.0001;
	      }

	      _z.normalize();

	      _x.crossVecs(up, _z);
	    }

	    _x.normalize();

	    _y.crossVecs(_z, _x);

	    te[0] = _x.x;
	    te[4] = _y.x;
	    te[8] = _z.x;
	    te[1] = _x.y;
	    te[5] = _y.y;
	    te[9] = _z.y;
	    te[2] = _x.z;
	    te[6] = _y.z;
	    te[10] = _z.z;
	    return this;
	  };

	  Mat4.prototype.multiply = function (m, n) {
	    if (n !== undefined) {
	      return this.multiplyMats(m, n);
	    }

	    return this.multiplyMats(this, m);
	  };

	  Mat4.prototype.premultiply = function (m) {
	    return this.multiplyMats(m, this);
	  };

	  Mat4.prototype.multiplyMats = function (a, b) {
	    var ae = a.elements;
	    var be = b.elements;
	    var te = this.elements;
	    var a11 = ae[0],
	        a12 = ae[4],
	        a13 = ae[8],
	        a14 = ae[12];
	    var a21 = ae[1],
	        a22 = ae[5],
	        a23 = ae[9],
	        a24 = ae[13];
	    var a31 = ae[2],
	        a32 = ae[6],
	        a33 = ae[10],
	        a34 = ae[14];
	    var a41 = ae[3],
	        a42 = ae[7],
	        a43 = ae[11],
	        a44 = ae[15];
	    var b11 = be[0],
	        b12 = be[4],
	        b13 = be[8],
	        b14 = be[12];
	    var b21 = be[1],
	        b22 = be[5],
	        b23 = be[9],
	        b24 = be[13];
	    var b31 = be[2],
	        b32 = be[6],
	        b33 = be[10],
	        b34 = be[14];
	    var b41 = be[3],
	        b42 = be[7],
	        b43 = be[11],
	        b44 = be[15];
	    te[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
	    te[4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
	    te[8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
	    te[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
	    te[1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
	    te[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
	    te[9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
	    te[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
	    te[2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
	    te[6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
	    te[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
	    te[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
	    te[3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
	    te[7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
	    te[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
	    te[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;
	    return this;
	  };

	  Mat4.prototype.multiplyScalar = function (s) {
	    var te = this.elements;
	    te[0] *= s;
	    te[4] *= s;
	    te[8] *= s;
	    te[12] *= s;
	    te[1] *= s;
	    te[5] *= s;
	    te[9] *= s;
	    te[13] *= s;
	    te[2] *= s;
	    te[6] *= s;
	    te[10] *= s;
	    te[14] *= s;
	    te[3] *= s;
	    te[7] *= s;
	    te[11] *= s;
	    te[15] *= s;
	    return this;
	  };

	  Mat4.prototype.applyToBufferAttribute = function (attribute) {
	    for (var i = 0, l = attribute.count; i < l; i++) {
	      _v1.x = attribute.getX(i);
	      _v1.y = attribute.getY(i);
	      _v1.z = attribute.getZ(i);

	      _v1.applyMat4(this);

	      attribute.setXYZ(i, _v1.x, _v1.y, _v1.z);
	    }

	    return attribute;
	  };

	  Mat4.prototype.determinant = function () {
	    var te = this.elements;
	    var n11 = te[0],
	        n12 = te[4],
	        n13 = te[8],
	        n14 = te[12];
	    var n21 = te[1],
	        n22 = te[5],
	        n23 = te[9],
	        n24 = te[13];
	    var n31 = te[2],
	        n32 = te[6],
	        n33 = te[10],
	        n34 = te[14];
	    var n41 = te[3],
	        n42 = te[7],
	        n43 = te[11],
	        n44 = te[15]; //TODO: make this more efficient
	    //( based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm )

	    return n41 * (+n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34) + n42 * (+n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31) + n43 * (+n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31) + n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
	  };

	  Mat4.prototype.transpose = function () {
	    var te = this.elements;
	    var tmp;
	    tmp = te[1];
	    te[1] = te[4];
	    te[4] = tmp;
	    tmp = te[2];
	    te[2] = te[8];
	    te[8] = tmp;
	    tmp = te[6];
	    te[6] = te[9];
	    te[9] = tmp;
	    tmp = te[3];
	    te[3] = te[12];
	    te[12] = tmp;
	    tmp = te[7];
	    te[7] = te[13];
	    te[13] = tmp;
	    tmp = te[11];
	    te[11] = te[14];
	    te[14] = tmp;
	    return this;
	  };

	  Mat4.prototype.setPosition = function (x, y, z) {
	    var te = this.elements;

	    if (x.isVec3) {
	      te[12] = x.x;
	      te[13] = x.y;
	      te[14] = x.z;
	    } else if (y !== undefined && z !== undefined) {
	      te[12] = x;
	      te[13] = y;
	      te[14] = z;
	    } else {
	      if (x.x !== undefined && x.y !== undefined && x.z !== undefined) {
	        te[12] = x.x;
	        te[13] = x.y;
	        te[14] = x.z;
	      }
	    }

	    return this;
	  };
	  /**
	   * 矩阵求逆
	   * @returns  自己
	   */


	  Mat4.prototype.invert = function () {
	    // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
	    var te = this.elements,
	        n11 = te[0],
	        n21 = te[1],
	        n31 = te[2],
	        n41 = te[3],
	        n12 = te[4],
	        n22 = te[5],
	        n32 = te[6],
	        n42 = te[7],
	        n13 = te[8],
	        n23 = te[9],
	        n33 = te[10],
	        n43 = te[11],
	        n14 = te[12],
	        n24 = te[13],
	        n34 = te[14],
	        n44 = te[15],
	        t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
	        t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
	        t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
	        t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
	    var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
	    if (det === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
	    var detInv = 1 / det;
	    te[0] = t11 * detInv;
	    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
	    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
	    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
	    te[4] = t12 * detInv;
	    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
	    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
	    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
	    te[8] = t13 * detInv;
	    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
	    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
	    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
	    te[12] = t14 * detInv;
	    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
	    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
	    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
	    return this;
	  };

	  Mat4.prototype.getInverse = function (m, throwOnDegenerate) {
	    if (throwOnDegenerate === void 0) {
	      throwOnDegenerate = true;
	    } // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm


	    var te = this.elements,
	        me = m.elements,
	        n11 = me[0],
	        n21 = me[1],
	        n31 = me[2],
	        n41 = me[3],
	        n12 = me[4],
	        n22 = me[5],
	        n32 = me[6],
	        n42 = me[7],
	        n13 = me[8],
	        n23 = me[9],
	        n33 = me[10],
	        n43 = me[11],
	        n14 = me[12],
	        n24 = me[13],
	        n34 = me[14],
	        n44 = me[15],
	        t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44,
	        t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44,
	        t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44,
	        t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;
	    var det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;

	    if (det === 0) {
	      var msg = " Mat4: .getInverse() can't invert matrix, determinant is 0";

	      if (throwOnDegenerate === true) {
	        throw new Error(msg);
	      } else {
	        console.warn(msg);
	      }

	      return this.identity();
	    }

	    var detInv = 1 / det;
	    te[0] = t11 * detInv;
	    te[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
	    te[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
	    te[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
	    te[4] = t12 * detInv;
	    te[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
	    te[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
	    te[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
	    te[8] = t13 * detInv;
	    te[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
	    te[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
	    te[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
	    te[12] = t14 * detInv;
	    te[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
	    te[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
	    te[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
	    return this;
	  };

	  Mat4.prototype.scale = function (v) {
	    var te = this.elements;
	    var x = v.x,
	        y = v.y,
	        z = v.z;
	    te[0] *= x;
	    te[4] *= y;
	    te[8] *= z;
	    te[1] *= x;
	    te[5] *= y;
	    te[9] *= z;
	    te[2] *= x;
	    te[6] *= y;
	    te[10] *= z;
	    te[3] *= x;
	    te[7] *= y;
	    te[11] *= z;
	    return this;
	  };

	  Mat4.prototype.getMaxScaleOnAxis = function () {
	    var te = this.elements;
	    var scaleXSq = te[0] * te[0] + te[1] * te[1] + te[2] * te[2];
	    var scaleYSq = te[4] * te[4] + te[5] * te[5] + te[6] * te[6];
	    var scaleZSq = te[8] * te[8] + te[9] * te[9] + te[10] * te[10];
	    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
	  };

	  Mat4.prototype.makeTranslation = function (x, y, z) {
	    this.set(1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1);
	    return this;
	  };

	  Mat4.prototype.makeRotationX = function (theta) {
	    var c = Math.cos(theta),
	        s = Math.sin(theta);
	    this.set(1, 0, 0, 0, 0, c, -s, 0, 0, s, c, 0, 0, 0, 0, 1);
	    return this;
	  };

	  Mat4.prototype.makeRotationY = function (theta) {
	    var c = Math.cos(theta),
	        s = Math.sin(theta);
	    this.set(c, 0, s, 0, 0, 1, 0, 0, -s, 0, c, 0, 0, 0, 0, 1);
	    return this;
	  };

	  Mat4.prototype.makeRotationZ = function (theta) {
	    var c = Math.cos(theta),
	        s = Math.sin(theta);
	    this.set(c, -s, 0, 0, s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	    return this;
	  };

	  Mat4.prototype.makeRotationAxis = function (axis, angle) {
	    // Based on http://www.gamedev.net/reference/articles/article1199.asp
	    var c = Math.cos(angle);
	    var s = Math.sin(angle);
	    var t = 1 - c;
	    var x = axis.x,
	        y = axis.y,
	        z = axis.z;
	    var tx = t * x,
	        ty = t * y;
	    this.set(tx * x + c, tx * y - s * z, tx * z + s * y, 0, tx * y + s * z, ty * y + c, ty * z - s * x, 0, tx * z - s * y, ty * z + s * x, t * z * z + c, 0, 0, 0, 0, 1);
	    return this;
	  };

	  Mat4.prototype.makeScale = function (x, y, z) {
	    this.set(x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1);
	    return this;
	  };
	  /**
	   *  6个参数 都是由两个值来影响  [v1][v2]  v1表示v2轴在v1轴产生效果
	   * @param xy
	   * @param xz
	   * @param yx
	   * @param yz
	   * @param zx
	   * @param zy
	   * @returns
	   */


	  Mat4.prototype.makeShear = function (xy, xz, yx, yz, zx, zy) {
	    this.set(1, yx, zx, 0, xy, 1, zy, 0, xz, yz, 1, 0, 0, 0, 0, 1);
	    return this;
	  };

	  Mat4.prototype.compose = function (position, quat, scale) {
	    var te = this.elements;
	    var x = quat._x,
	        y = quat._y,
	        z = quat._z,
	        w = quat._w;
	    var x2 = x + x,
	        y2 = y + y,
	        z2 = z + z;
	    var xx = x * x2,
	        xy = x * y2,
	        xz = x * z2;
	    var yy = y * y2,
	        yz = y * z2,
	        zz = z * z2;
	    var wx = w * x2,
	        wy = w * y2,
	        wz = w * z2;
	    var sx = scale.x,
	        sy = scale.y,
	        sz = scale.z;
	    te[0] = (1 - (yy + zz)) * sx;
	    te[1] = (xy + wz) * sx;
	    te[2] = (xz - wy) * sx;
	    te[3] = 0;
	    te[4] = (xy - wz) * sy;
	    te[5] = (1 - (xx + zz)) * sy;
	    te[6] = (yz + wx) * sy;
	    te[7] = 0;
	    te[8] = (xz + wy) * sz;
	    te[9] = (yz - wx) * sz;
	    te[10] = (1 - (xx + yy)) * sz;
	    te[11] = 0;
	    te[12] = position.x;
	    te[13] = position.y;
	    te[14] = position.z;
	    te[15] = 1;
	    return this;
	  };

	  Mat4.prototype.decompose = function (position, quat, scale) {
	    var te = this.elements;

	    var sx = _v1.set(te[0], te[1], te[2]).length();

	    var sy = _v1.set(te[4], te[5], te[6]).length();

	    var sz = _v1.set(te[8], te[9], te[10]).length(); // if determine is negative, we need to invert one scale


	    var det = this.determinant();
	    if (det < 0) sx = -sx;
	    position.x = te[12];
	    position.y = te[13];
	    position.z = te[14]; // scale the rotation part

	    _m1.copy(this);

	    var invSX = 1 / sx;
	    var invSY = 1 / sy;
	    var invSZ = 1 / sz;
	    _m1.elements[0] *= invSX;
	    _m1.elements[1] *= invSX;
	    _m1.elements[2] *= invSX;
	    _m1.elements[4] *= invSY;
	    _m1.elements[5] *= invSY;
	    _m1.elements[6] *= invSY;
	    _m1.elements[8] *= invSZ;
	    _m1.elements[9] *= invSZ;
	    _m1.elements[10] *= invSZ;
	    quat.setFromRotationMat(_m1);
	    scale.x = sx;
	    scale.y = sy;
	    scale.z = sz;
	    return this;
	  };

	  Mat4.prototype.makePerspective = function (left, right, top, bottom, near, far) {
	    if (far === undefined) {
	      console.warn(" Mat4: .makePerspective() has been redefined and has a new signature. Please check the docs.");
	    }

	    var te = this.elements;
	    var x = 2 * near / (right - left);
	    var y = 2 * near / (top - bottom);
	    var a = (right + left) / (right - left);
	    var b = (top + bottom) / (top - bottom);
	    var c = -(far + near) / (far - near);
	    var d = -2 * far * near / (far - near);
	    te[0] = x;
	    te[4] = 0;
	    te[8] = a;
	    te[12] = 0;
	    te[1] = 0;
	    te[5] = y;
	    te[9] = b;
	    te[13] = 0;
	    te[2] = 0;
	    te[6] = 0;
	    te[10] = c;
	    te[14] = d;
	    te[3] = 0;
	    te[7] = 0;
	    te[11] = -1;
	    te[15] = 0;
	    return this;
	  };

	  Mat4.prototype.makeOrthographic = function (left, right, top, bottom, near, far) {
	    var te = this.elements;
	    var w = 1.0 / (right - left);
	    var h = 1.0 / (top - bottom);
	    var p = 1.0 / (far - near);
	    var x = (right + left) * w;
	    var y = (top + bottom) * h;
	    var z = (far + near) * p;
	    te[0] = 2 * w;
	    te[4] = 0;
	    te[8] = 0;
	    te[12] = -x;
	    te[1] = 0;
	    te[5] = 2 * h;
	    te[9] = 0;
	    te[13] = -y;
	    te[2] = 0;
	    te[6] = 0;
	    te[10] = -2 * p;
	    te[14] = -z;
	    te[3] = 0;
	    te[7] = 0;
	    te[11] = 0;
	    te[15] = 1;
	    return this;
	  };

	  Mat4.prototype.equals = function (matrix) {
	    var te = this.elements;
	    var me = matrix.elements;

	    for (var i = 0; i < 16; i++) {
	      if (te[i] !== me[i]) return false;
	    }

	    return true;
	  };

	  Mat4.prototype.fromArray = function (array, offset) {
	    if (offset === void 0) {
	      offset = 0;
	    }

	    for (var i = 0; i < 16; i++) {
	      this.elements[i] = array[i + offset];
	    }

	    return this;
	  };

	  Mat4.prototype.toArray = function (array, offset) {
	    if (array === void 0) {
	      array = [];
	    }

	    if (offset === void 0) {
	      offset = 0;
	    }

	    var te = this.elements;
	    array[offset] = te[0];
	    array[offset + 1] = te[1];
	    array[offset + 2] = te[2];
	    array[offset + 3] = te[3];
	    array[offset + 4] = te[4];
	    array[offset + 5] = te[5];
	    array[offset + 6] = te[6];
	    array[offset + 7] = te[7];
	    array[offset + 8] = te[8];
	    array[offset + 9] = te[9];
	    array[offset + 10] = te[10];
	    array[offset + 11] = te[11];
	    array[offset + 12] = te[12];
	    array[offset + 13] = te[13];
	    array[offset + 14] = te[14];
	    array[offset + 15] = te[15];
	    return array;
	  };

	  return Mat4;
	}();

	exports.Mat4 = Mat4;

	var _v1 = (0, Vec3_1.v3)();

	var _m1 = m4();

	var _m2 = m4();

	var _zero = (0, Vec3_1.v3)(0, 0, 0);

	var _one = (0, Vec3_1.v3)(1, 1, 1);

	var _x = (0, Vec3_1.v3)();

	var _y = (0, Vec3_1.v3)();

	var _z = (0, Vec3_1.v3)();

	function m4() {
	  return new Mat4();
	}

	exports.m4 = m4;
	});

	unwrapExports(Mat4_1);
	var Mat4_2 = Mat4_1.m4;
	var Mat4_3 = Mat4_1.Mat4;

	var Euler_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.euler = exports.Euler = void 0;











	var _matrix = (0, Mat4_1.m4)();

	var _Quat = (0, Quat_1.quat)();
	var DefaultOrder = "XYZ";

	var Euler =
	/** @class */
	function (_super) {
	  __extends(Euler, _super);

	  function Euler(_x, _y, _z, _order) {
	    if (_x === void 0) {
	      _x = 0;
	    }

	    if (_y === void 0) {
	      _y = 0;
	    }

	    if (_z === void 0) {
	      _z = 0;
	    }

	    if (_order === void 0) {
	      _order = DefaultOrder;
	    }

	    var _this = _super.call(this) || this;

	    _this._x = _x;
	    _this._y = _y;
	    _this._z = _z;
	    _this._order = _order;
	    _this.isEuler = true;
	    return _this;
	  }

	  Object.defineProperty(Euler.prototype, "x", {
	    get: function () {
	      return this._x;
	    },
	    set: function (value) {
	      if (this._x !== value) {
	        this._x = value;
	        this.fire('change', 'x', this._x, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Euler.prototype, "y", {
	    get: function () {
	      return this._y;
	    },
	    set: function (value) {
	      if (this._y !== value) {
	        this._y = value;
	        this.fire('change', 'y', this._y, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Euler.prototype, "z", {
	    get: function () {
	      return this._z;
	    },
	    set: function (value) {
	      if (this._z !== value) {
	        this._z = value;
	        this.fire('change', 'z', this._z, value);
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Euler.prototype, "order", {
	    get: function () {
	      return this._order;
	    },
	    set: function (value) {
	      if (this._order !== value) {
	        this.fire('change', 'order', this._order, value);
	        this._order = value;
	      }
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Euler.prototype.set = function (x, y, z, order) {
	    this._x = x;
	    this._y = y;
	    this._z = z;
	    this._order = order || this._order;
	    this.fire('change');
	    return this;
	  };

	  Euler.prototype.clone = function () {
	    return new Euler(this._x, this._y, this._z, this._order);
	  };

	  Euler.prototype.copy = function (Euler) {
	    this._x = Euler._x;
	    this._y = Euler._y;
	    this._z = Euler._z;
	    this._order = Euler._order;
	    this.fire('change');
	    return this;
	  };

	  Euler.prototype.setFromRotationMat = function (m, order, update) {
	    // assumes the upper 3x3 of m is a pure rotation matrix (i.e, unscaled)
	    var te = m.elements;
	    var m11 = te[0],
	        m12 = te[4],
	        m13 = te[8];
	    var m21 = te[1],
	        m22 = te[5],
	        m23 = te[9];
	    var m31 = te[2],
	        m32 = te[6],
	        m33 = te[10];
	    order = order || this._order;

	    if (order === "XYZ") {
	      this._y = Math.asin((0, _Math.clamp)(m13, -1, 1));

	      if (Math.abs(m13) < 0.9999999) {
	        this._x = Math.atan2(-m23, m33);
	        this._z = Math.atan2(-m12, m11);
	      } else {
	        this._x = Math.atan2(m32, m22);
	        this._z = 0;
	      }
	    } else if (order === "YXZ") {
	      this._x = Math.asin(-(0, _Math.clamp)(m23, -1, 1));

	      if (Math.abs(m23) < 0.9999999) {
	        this._y = Math.atan2(m13, m33);
	        this._z = Math.atan2(m21, m22);
	      } else {
	        this._y = Math.atan2(-m31, m11);
	        this._z = 0;
	      }
	    } else if (order === "ZXY") {
	      this._x = Math.asin((0, _Math.clamp)(m32, -1, 1));

	      if (Math.abs(m32) < 0.9999999) {
	        this._y = Math.atan2(-m31, m33);
	        this._z = Math.atan2(-m12, m22);
	      } else {
	        this._y = 0;
	        this._z = Math.atan2(m21, m11);
	      }
	    } else if (order === "ZYX") {
	      this._y = Math.asin(-(0, _Math.clamp)(m31, -1, 1));

	      if (Math.abs(m31) < 0.9999999) {
	        this._x = Math.atan2(m32, m33);
	        this._z = Math.atan2(m21, m11);
	      } else {
	        this._x = 0;
	        this._z = Math.atan2(-m12, m22);
	      }
	    } else if (order === "YZX") {
	      this._z = Math.asin((0, _Math.clamp)(m21, -1, 1));

	      if (Math.abs(m21) < 0.9999999) {
	        this._x = Math.atan2(-m23, m22);
	        this._y = Math.atan2(-m31, m11);
	      } else {
	        this._x = 0;
	        this._y = Math.atan2(m13, m33);
	      }
	    } else if (order === "XZY") {
	      this._z = Math.asin(-(0, _Math.clamp)(m12, -1, 1));

	      if (Math.abs(m12) < 0.9999999) {
	        this._x = Math.atan2(m32, m22);
	        this._y = Math.atan2(m13, m11);
	      } else {
	        this._x = Math.atan2(-m23, m33);
	        this._y = 0;
	      }
	    } else {
	      console.warn("Euler: .setFromRotationMat() given unsupported order: " + order);
	    }

	    this._order = order;
	    if (update !== false) this.fire('change');
	    return this;
	  };

	  Euler.prototype.setFromQuat = function (q, order, update) {
	    _matrix.makeRotationFromQuat(q);

	    return this.setFromRotationMat(_matrix, order, update);
	  };

	  Euler.prototype.setFromVec3 = function (v, order) {
	    return this.set(v.x, v.y, v.z, order || this._order);
	  };

	  Euler.prototype.reorder = function (newOrder) {
	    // WARNING: this discards revolution information -bhouston
	    _Quat.setFromEuler(this);

	    return this.setFromQuat(_Quat, newOrder);
	  };

	  Euler.prototype.equals = function (Euler) {
	    return Euler._x === this._x && Euler._y === this._y && Euler._z === this._z && Euler._order === this._order;
	  };

	  Euler.prototype.fromArray = function (array) {
	    this._x = array[0];
	    this._y = array[1];
	    this._z = array[2];
	    if (array[3] !== undefined) this._order = array[3];
	    this.fire('change');
	    return this;
	  };

	  Euler.prototype.toArray = function (array, offset) {
	    if (array === void 0) {
	      array = [];
	    }

	    if (offset === void 0) {
	      offset = 0;
	    }

	    array[offset] = this._x;
	    array[offset + 1] = this._y;
	    array[offset + 2] = this._z;
	    array[offset + 3] = this._order;
	    return array;
	  };

	  Euler.prototype.toVec3 = function (optionalResult) {
	    if (optionalResult) {
	      return optionalResult.set(this._x, this._y, this._z);
	    } else {
	      return (0, Vec3_1.v3)(this._x, this._y, this._z);
	    }
	  };

	  return Euler;
	}(eventhandler.EventHandler);

	exports.Euler = Euler;

	function euler(x, y, z) {
	  return new Euler(x, y, z);
	}

	exports.euler = euler;
	});

	unwrapExports(Euler_1);
	var Euler_2 = Euler_1.euler;
	var Euler_3 = Euler_1.Euler;

	var types = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isString = exports.isFinite = exports.isUndefined = exports.isDefined = void 0;

	function isDefined(value) {
	  return value !== undefined && value !== null;
	}

	exports.isDefined = isDefined; //Method

	function isUndefined(value) {
	  return value === undefined;
	}

	exports.isUndefined = isUndefined;

	function isFinite(value) {
	  return typeof value == 'number' && globalThis.isFinite(value);
	}

	exports.isFinite = isFinite;

	function isString(value) {
	  return typeof value == 'string';
	}

	exports.isString = isString;
	});

	unwrapExports(types);
	var types_1 = types.isString;
	var types_2 = types.isFinite;
	var types_3 = types.isUndefined;
	var types_4 = types.isDefined;

	var Line_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.line = exports.Line = void 0;







	var _v1 = new Vec3_1.Vec3();

	var Line =
	/** @class */
	function () {
	  function Line(origin, end) {
	    if (origin === void 0) {
	      origin = (0, Vec3_1.v3)();
	    }

	    if (end === void 0) {
	      end = (0, Vec3_1.v3)();
	    }

	    this.origin = origin;
	    this.end = end;
	    this.direction = this.end.clone().sub(this.origin).normalize();
	  }

	  Line.prototype.set = function (origin, end) {
	    this.origin.copy(origin);
	    this.end.copy(end);
	    return this;
	  };

	  Line.prototype.distancePoint = function (pt) {
	    var res = pt.distanceLine(this); // res.closests?.reverse();
	    // res.parameters?.reverse();

	    return res;
	  };

	  Line.prototype.distanceSegment = function (segment) {
	    var result = {
	      parameters: [],
	      closests: []
	    };
	    var segCenter = segment.center;
	    var segDirection = segment.direction;
	    var segExtent = segment.extent * 0.5;
	    var diff = this.origin.clone().sub(segCenter);
	    var a01 = -this.direction.dot(segDirection);
	    var b0 = diff.dot(this.direction);
	    var s0, s1;

	    if (Math.abs(a01) < 1) {
	      // 判断是否平行
	      var det = 1 - a01 * a01;
	      var extDet = segExtent * det;
	      var b1 = -diff.dot(segDirection);
	      s1 = a01 * b0 - b1;

	      if (s1 >= -extDet) {
	        if (s1 <= extDet) {
	          // Two interior points are closest, one on the this
	          // and one on the segment.
	          s0 = (a01 * b1 - b0) / det;
	          s1 /= det;
	        } else {
	          // The endpoint e1 of the segment and an interior
	          // point of the this are closest.
	          s1 = segExtent;
	          s0 = -(a01 * s1 + b0);
	        }
	      } else {
	        // The endpoint e0 of the segment and an interior point
	        // of the this are closest.
	        s1 = -segExtent;
	        s0 = -(a01 * s1 + b0);
	      }
	    } else {
	      // The this and segment are parallel.  Choose the closest pair
	      // so that one point is at segment origin.
	      s1 = 0;
	      s0 = -b0;
	    }

	    result.parameters[0] = s0;
	    result.parameters[1] = s1;
	    result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
	    result.closests[1] = segDirection.clone().multiplyScalar(s1).add(segCenter);
	    diff = result.closests[0].clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  }; //---距离-------------

	  /**
	   * 直线到直线的距离
	   * 参数与最近点顺序一致
	   * @param  {Line} line
	   */


	  Line.prototype.distanceLine = function (line) {
	    var result = {
	      parameters: [],
	      closests: []
	    };
	    var diff = this.origin.clone().sub(line.origin);
	    var a01 = -this.direction.dot(line.direction);
	    var b0 = diff.dot(this.direction);
	    var s0, s1;

	    if (Math.abs(a01) < 1) {
	      var det = 1 - a01 * a01;
	      var b1 = -diff.dot(line.direction);
	      s0 = (a01 * b1 - b0) / det;
	      s1 = (a01 * b0 - b1) / det;
	    } else {
	      s0 = -b0;
	      s1 = 0;
	    }

	    result.parameters[0] = s0;
	    result.parameters[1] = s1;
	    result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
	    result.closests[1] = line.direction.clone().multiplyScalar(s1).add(line.origin);
	    diff = result.closests[0].clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	   * 直线与射线的距离
	   * @param {Ray} ray
	   */


	  Line.prototype.distanceRay = function (ray) {
	    var result = {
	      parameters: [],
	      closests: []
	    };
	    var diff = this.origin.clone().sub(ray.origin);
	    var a01 = -this.direction.dot(ray.direction);
	    var b0 = diff.dot(this.direction);
	    var s0, s1;

	    if (Math.abs(a01) < 1) {
	      var b1 = -diff.dot(ray.direction);
	      s1 = a01 * b0 - b1;

	      if (s1 >= 0) {
	        //在最近点在射线上，相当于直线与直线最短距离
	        var det = 1 - a01 * a01;
	        s0 = (a01 * b1 - b0) / det;
	        s1 /= det;
	      } else {
	        // 射线的起始点是离直线的最近点
	        s0 = -b0;
	        s1 = 0;
	      }
	    } else {
	      s0 = -b0;
	      s1 = 0;
	    }

	    result.parameters[0] = s0;
	    result.parameters[1] = s1;
	    result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
	    result.closests[1] = ray.direction.clone().multiplyScalar(s1).add(ray.origin);
	    diff = result.closests[0].clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	   *
	   * @param triangle
	   */


	  Line.prototype.distanceTriangle = function (triangle) {
	    function Orthonormalize(numInputs, v, robust) {

	      if (v && 1 <= numInputs && numInputs <= 3) {
	        var minLength = v[0].length();
	        v[0].normalize();

	        for (var i = 1; i < numInputs; ++i) {
	          for (var j = 0; j < i; ++j) {
	            var dot = v[i].dot(v[j]);
	            v[i].sub(v[j].clone().multiplyScalar(dot));
	          }

	          var length = v[i].length();
	          v[i].normalize();

	          if (length < minLength) {
	            minLength = length;
	          }
	        }

	        return minLength;
	      }

	      return 0;
	    }

	    function ComputeOrthogonalComplement(numInputs, v, robust) {

	      if (numInputs === 1) {
	        if (Math.abs(v[0][0]) > Math.abs(v[0][1])) {
	          v[1] = (0, Vec3_1.v3)(-v[0].z, 0, +v[0].x);
	        } else {
	          v[1] = (0, Vec3_1.v3)(0, +v[0].z, -v[0].y);
	        }
	        numInputs = 2;
	      }

	      if (numInputs == 2) {
	        v[2] = v[0].clone().cross(v[1]);
	        return Orthonormalize(3, v);
	      }

	      return 0;
	    }

	    var result = {
	      closests: [],
	      parameters: [],
	      triangleParameters: []
	    }; // Test if line intersects triangle.  If so, the squared distance
	    // is zero. 

	    var edge0 = triangle.p1.clone().sub(triangle.p0);
	    var edge1 = triangle.p2.clone().sub(triangle.p0);
	    var normal = edge0.clone().cross(edge1).normalize();
	    var NdD = normal.dot(this.direction);

	    if (Math.abs(NdD) >= _Math.delta4) {
	      // The line and triangle are not parallel, so the line
	      // intersects/ the plane of the triangle.
	      var diff = this.origin.clone().sub(triangle.p0);
	      var basis = new Array(3); // {D, U, V}

	      basis[0] = this.direction;
	      ComputeOrthogonalComplement(1, basis);
	      var UdE0 = basis[1].dot(edge0);
	      var UdE1 = basis[1].dot(edge1);
	      var UdDiff = basis[1].dot(diff);
	      var VdE0 = basis[2].dot(edge0);
	      var VdE1 = basis[2].dot(edge1);
	      var VdDiff = basis[2].dot(diff);
	      var invDet = 1 / (UdE0 * VdE1 - UdE1 * VdE0); // Barycentric coordinates for the point of intersection.

	      var b1 = (VdE1 * UdDiff - UdE1 * VdDiff) * invDet;
	      var b2 = (UdE0 * VdDiff - VdE0 * UdDiff) * invDet;
	      var b0 = 1 - b1 - b2;

	      if (b0 >= 0 && b1 >= 0 && b2 >= 0) {
	        // Line parameter for the point of intersection.
	        var DdE0 = this.direction.dot(edge0);
	        var DdE1 = this.direction.dot(edge1);
	        var DdDiff = this.direction.dot(diff);
	        result.lineParameter = b1 * DdE0 + b2 * DdE1 - DdDiff; // Barycentric coordinates for the point of intersection.

	        result.triangleParameters[0] = b0;
	        result.triangleParameters[1] = b1;
	        result.triangleParameters[2] = b2; // The intersection point is inside or on the triangle.

	        result.closests[0] = this.direction.clone().multiplyScalar(result.lineParameter).add(this.origin);
	        result.closests[1] = edge0.multiplyScalar(b1).add(edge1.multiplyScalar(b2)).add(triangle.p0);
	        result.distance = 0;
	        result.distanceSqr = 0;
	        return result;
	      }
	    } // Either (1) the line is not parallel to the triangle and the
	    // point of intersection of the line and the plane of the triangle
	    // is outside the triangle or (2) the line and triangle are
	    // parallel.  Regardless, the closest point on the triangle is on
	    // an edge of the triangle.  Compare the line to all three edges
	    // of the triangle.


	    result.distance = +Infinity;
	    result.distanceSqr = +Infinity;

	    for (var i0 = 2, i1 = 0; i1 < 3; i0 = i1++) {
	      var segCenter = triangle[i0].clone().add(triangle[i1]).multiplyScalar(0.5);
	      var segDirection = triangle[i1].clone().sub(triangle[i0]);
	      var segExtent = 0.5 * segDirection.length();
	      segDirection.normalize();
	      var segment = new Segment_1.Segment(triangle[i0], triangle[i1]);
	      var lsResult = this.distanceSegment(segment);

	      if (lsResult.distanceSqr < result.distanceSqr) {
	        result.distanceSqr = lsResult.distanceSqr;
	        result.distance = lsResult.distance;
	        result.lineParameter = lsResult.parameters[0];
	        result.triangleParameters[i0] = 0.5 * (1 - lsResult.parameters[0] / segExtent);
	        result.triangleParameters[i1] = 1 - result.triangleParameters[i0];
	        result.triangleParameters[3 - i0 - i1] = 0;
	        result.closests[0] = lsResult.closests[0];
	        result.closests[1] = lsResult.closests[1];
	      }
	    }

	    return result;
	  };

	  Line.prototype.distancePolyline = function (polyline) {
	    var polyl = polyline._array || polyline;
	    var result = null;
	    var maodian = -1;

	    for (var i = 0; i < polyl.length - 1; i++) {
	      var segment = new Segment_1.Segment(polyl[i], polyl[i + 1]);
	      var oneres = this.distanceSegment(segment);

	      if (!result || result.distance < oneres.distance) {
	        result = oneres;
	      }

	      if (result.distance < _Math.delta4) {
	        maodian = i;
	        break;
	      }
	    }

	    return {
	      distance: result === null || result === void 0 ? void 0 : result.distance,
	      distanceSqr: result === null || result === void 0 ? void 0 : result.distanceSqr,
	      parameters: result === null || result === void 0 ? void 0 : result.parameters,
	      closests: result === null || result === void 0 ? void 0 : result.closests,
	      segmentIndex: maodian
	    };
	  }; //---intersect--------------------------

	  /**
	   * 线与平面相交
	   * @param plane
	   * @param result
	   */


	  Line.prototype.intersectPlane = function (plane, result) {
	    if (!result) result = new Vec3_1.Vec3();
	    var direction = this.direction;
	    var denominator = plane.normal.dot(direction);

	    if (denominator === 0) {
	      // line is coplanar, return origin
	      if (this.distancePoint(this.origin).distance === 0) {
	        return result.copy(this.origin);
	      } // Unsure if this is the correct method to handle this case.


	      return;
	    }

	    var t = -(this.origin.dot(plane.normal) - plane.w) / denominator;

	    if (t < 0 || t > 1) {
	      return;
	    }

	    return result.copy(direction).multiplyScalar(t).add(this.origin);
	  };

	  return Line;
	}();

	exports.Line = Line;

	function line(start, end) {
	  return new Line(start, end);
	}

	exports.line = line;
	});

	unwrapExports(Line_1);
	var Line_2 = Line_1.line;
	var Line_3 = Line_1.Line;

	var Circle_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.circle = exports.Circle = void 0;







	var Circle =
	/** @class */
	function () {
	  /**
	   * 圆圈
	   * @param  {Vec3} center 中心点
	   * @param  {Vec3} normal 法线
	   * @param  {Number} radius 半径
	   */
	  function Circle(center, radius, normal) {
	    if (center === void 0) {
	      center = new Vec3_1.Vec3();
	    }

	    if (radius === void 0) {
	      radius = 0;
	    }

	    if (normal === void 0) {
	      normal = Vec3_1.Vec3.UnitY;
	    }

	    this.center = center;
	    this.radius = radius;
	    this.normal = normal;
	    this.startAngle = 0;
	    this.endAngle = Math.PI * 2;
	    this.radiusSqr = 0;
	  }

	  Circle.prototype.area = function () {
	    return Math.PI * this.radius * this.radius;
	  };
	  /**
	   * 两个点
	   * @param fixp0
	   * @param fixp1
	   * @param movep
	   * @param normal
	   */


	  Circle.prototype.arc1 = function (fixp0, fixp1, movep, normal) {
	    this.setFrom3Points(fixp0, fixp1, movep);
	    this.startAngle = 0;
	    this.endAngle = (0, common.angle)(fixp0.clone().sub(this.center).normalize(), fixp1.clone().sub(this.center).normalize(), this.normal || normal);
	  };
	  /**
	   * 全两个点确定半径，后面点确定 弧度 ,只需要检测鼠标移动时鼠标是否跨过第一条半径即可确定顺逆时针
	   * @param fixp0
	   * @param fixp1
	   * @param movep
	   */


	  Circle.prototype.arc2 = function (center, fixp1, movep, ccw, normal) {

	    this.radius = fixp1.distanceTo(center);
	    this.center.copy(center);
	    var v2 = movep.clone().sub(center);
	    var v1 = fixp1.clone().sub(center);
	    var jd = (0, common.angle)(v1, v2);
	  };

	  Circle.prototype.setFrom3Points = function (p0, p1, p2, normal) {
	    // if (pointsCollinear(p0, p1, p2))
	    //     throw ("calcCircleFromThreePoint：三点共线或者距离太近");
	    var d1 = p1.clone().sub(p0);
	    var d2 = p2.clone().sub(p0);
	    var d1center = p1.clone().add(p0).multiplyScalar(0.5);
	    var d2center = p2.clone().add(p0).multiplyScalar(0.5);
	    normal = normal || d1.clone().cross(d2).normalize();
	    d1.applyAxisAngle(normal, Math.PI / 2);
	    d2.applyAxisAngle(normal, Math.PI / 2);
	    var line1 = new Line_1.Line(d1center, d1center.clone().add(d1));
	    var line2 = new Line_1.Line(d2center, d2center.clone().add(d2));
	    var center = line1.distanceLine(line2).closests[0];
	    var radiusSqr = p0.distanceToSquared(center);
	    this.center = center;
	    this.radiusSqr = radiusSqr;
	    this.radius = Math.sqrt(radiusSqr);
	    this.normal = normal;
	    return this;
	  };

	  return Circle;
	}();

	exports.Circle = Circle;

	function circle(center, radius, normal) {
	  return new Circle(center, radius, normal);
	}

	exports.circle = circle;
	});

	unwrapExports(Circle_1);
	var Circle_2 = Circle_1.circle;
	var Circle_3 = Circle_1.Circle;

	var type = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Orientation = exports.IntersectType = void 0;
	var IntersectType;

	(function (IntersectType) {
	  IntersectType[IntersectType["None"] = 0] = "None";
	  IntersectType[IntersectType["Parallel"] = 1] = "Parallel";
	  IntersectType[IntersectType["Perpendicular"] = 2] = "Perpendicular";
	  IntersectType[IntersectType["Collineation"] = 3] = "Collineation";
	})(IntersectType = exports.IntersectType || (exports.IntersectType = {}));

	var Orientation;

	(function (Orientation) {
	  Orientation[Orientation["None"] = -1] = "None";
	  Orientation[Orientation["Positive"] = 1] = "Positive";
	  Orientation[Orientation["Negative"] = 2] = "Negative";
	  Orientation[Orientation["Common"] = 3] = "Common";
	  Orientation[Orientation["Intersect"] = 3] = "Intersect";
	})(Orientation = exports.Orientation || (exports.Orientation = {}));
	});

	unwrapExports(type);
	var type_1 = type.Orientation;
	var type_2 = type.IntersectType;

	var Vec_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Vec = void 0;
	/**
	 * 暂不使用
	 */

	var Vec =
	/** @class */
	function (_super) {
	  __extends(Vec, _super);

	  function Vec(n) {
	    var _this = _super.call(this) || this;

	    while (n-- > 0) {
	      _this[_this.length] = 0;
	    }

	    return _this;
	  }

	  Vec.max = function (array) {
	    if (array.length === 0) return -Infinity;
	    var max = array[0];

	    for (var i = 1, l = array.length; i < l; ++i) {
	      if (array[i] > max) max = array[i];
	    }

	    return max;
	  };

	  return Vec;
	}(Array);

	exports.Vec = Vec;
	});

	unwrapExports(Vec_1);
	var Vec_2 = Vec_1.Vec;

	var Box_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Box = void 0;



	var _vector = new Vec3_1.Vec3();

	var Box =
	/** @class */
	function () {
	  function Box(min, max) {
	    if (min === void 0) {
	      min = (0, Vec3_1.v3)(Infinity, Infinity, Infinity);
	    }

	    if (max === void 0) {
	      max = (0, Vec3_1.v3)(-Infinity, -Infinity, -Infinity);
	    }

	    this._center = (0, Vec3_1.v3)();
	    this.min = min;
	    this.max = max; // if (points) {
	    //     this.setFromPoints(points);
	    // }
	  }

	  Object.defineProperty(Box.prototype, "center", {
	    get: function () {
	      return this._center.add(this.min, this.max).multiplyScalar(0.5);
	    },
	    enumerable: false,
	    configurable: true
	  });
	  /**
	   *
	   * @param {Array<Vec3>} points
	   */

	  Box.prototype.setFromPoints = function (points) {
	    this.min.set(Infinity, Infinity, Infinity);
	    this.max.set(-Infinity, -Infinity, -Infinity);
	    this.expand.apply(this, points);
	  };

	  Box.prototype.expand = function () {
	    var points = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      points[_i] = arguments[_i];
	    }

	    for (var i = 0; i < points.length; i++) {
	      var point = points[i];
	      this.min.min(point);
	      this.max.max(point);
	    }

	    this.center.addVecs(this.min, this.max).multiplyScalar(0.5);
	  };

	  Box.prototype.makeEmpty = function () {
	    this.min.x = this.min.y = this.min.z = +Infinity;
	    this.max.x = this.max.y = this.max.z = -Infinity;
	    return this;
	  };

	  Box.prototype.clone = function () {
	    return new Box().copy(this);
	  };

	  Box.prototype.copy = function (box) {
	    this.min.copy(box.min);
	    this.max.copy(box.max);
	    return this;
	  };

	  Box.prototype.setFromCenterAndSize = function (center, size) {
	    var halfSize = _vector.copy(size).multiplyScalar(0.5);

	    this.min.copy(center).sub(halfSize);
	    this.max.copy(center).add(halfSize);
	    return this;
	  };

	  Box.prototype.setFromBufferAttribute = function (attribute) {
	    var minX = +Infinity;
	    var minY = +Infinity;
	    var minZ = +Infinity;
	    var maxX = -Infinity;
	    var maxY = -Infinity;
	    var maxZ = -Infinity;

	    for (var i = 0, l = attribute.count; i < l; i++) {
	      var x = attribute.getX(i);
	      var y = attribute.getY(i);
	      var z = attribute.getZ(i);
	      if (x < minX) minX = x;
	      if (y < minY) minY = y;
	      if (z < minZ) minZ = z;
	      if (x > maxX) maxX = x;
	      if (y > maxY) maxY = y;
	      if (z > maxZ) maxZ = z;
	    }

	    this.min.set(minX, minY, minZ);
	    this.max.set(maxX, maxY, maxZ);
	    return this;
	  };

	  Box.prototype.expandByPoint = function (point) {
	    this.min.min(point);
	    this.max.max(point);
	    return this;
	  };

	  Box.prototype.isEmpty = function () {
	    return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
	  };

	  Box.prototype.getCenter = function (target) {
	    if (target === undefined) {
	      console.warn('THREE.Box3: .getCenter() target is now required');
	      target = new Vec3_1.Vec3();
	    }

	    return this.isEmpty() ? target.set(0, 0, 0) : target.addVecs(this.min, this.max).multiplyScalar(0.5);
	  };

	  return Box;
	}();

	exports.Box = Box;
	});

	unwrapExports(Box_1);
	var Box_2 = Box_1.Box;

	var Sphere_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Sphere = void 0;



	var Sphere =
	/** @class */
	function () {
	  function Sphere(center, radius) {
	    if (center === void 0) {
	      center = (0, Vec3_1.v3)();
	    }

	    if (radius === void 0) {
	      radius = 0;
	    }

	    this.center = center;
	    this.radius = radius;
	  }

	  Sphere.prototype.applyMat4 = function (mat) {
	    throw new Error('Method not implemented.');
	  };

	  Sphere.prototype.setComponents = function (cx, cy, cz, radius) {
	    this.center.set(cx, cy, cz);
	    this.radius = radius;
	    return this;
	  };

	  Sphere.prototype.copy = function (sphere) {
	    this.center.copy(sphere.center);
	    this.radius = sphere.radius;
	    return this;
	  };

	  Sphere.prototype.clone = function () {
	    return new Sphere().copy(this);
	  };

	  return Sphere;
	}();

	exports.Sphere = Sphere;
	});

	unwrapExports(Sphere_1);
	var Sphere_2 = Sphere_1.Sphere;

	var bufferAttribute = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Float64BufferAttribute = exports.Float32BufferAttribute = exports.Uint32BufferAttribute = exports.Int32BufferAttribute = exports.Uint16BufferAttribute = exports.Int16BufferAttribute = exports.Uint8ClampedBufferAttribute = exports.Uint8BufferAttribute = exports.Int8BufferAttribute = exports.BufferAttribute = void 0;







	var _vector = new Vec3_1.Vec3();

	var BufferAttribute =
	/** @class */
	function () {
	  /**
	   *
	   * @param array {BufferArray} Buffer数据
	   * @param itemSize 单元长度，vec3是3，vec4是4
	   * @param normalized
	   */
	  function BufferAttribute(array, itemSize, normalized) {
	    this.isBufferAttribute = true;
	    this.name = '';
	    this.array = array;
	    this.itemSize = itemSize;
	    this.count = array !== undefined ? array.length / itemSize : 0;
	    this.normalized = normalized === true; // this.usage = StaticDrawUsage;

	    this.updateRange = {
	      offset: 0,
	      count: -1
	    };
	    this.version = 0;
	  }

	  Object.defineProperty(BufferAttribute.prototype, "needsUpdate", {
	    set: function (value) {
	      if (value === true) this.version++;
	    },
	    enumerable: false,
	    configurable: true
	  });

	  BufferAttribute.prototype.onUpload = function (callback) {
	    this.onUploadCallback = callback;
	    return this;
	  };

	  BufferAttribute.prototype.setUsage = function (usage) {
	    return this;
	  };

	  BufferAttribute.prototype.copy = function (source) {
	    this.name = source.name;
	    this.array = new source.array.constructor(source.array);
	    this.itemSize = source.itemSize;
	    this.count = source.count;
	    this.normalized = source.normalized; // this.usage = source.usage;

	    return this;
	  };

	  BufferAttribute.prototype.copyAt = function (index1, attribute, index2) {
	    index1 *= this.itemSize;
	    index2 *= attribute.itemSize;

	    for (var i = 0, l = this.itemSize; i < l; i++) {
	      this.array[index1 + i] = attribute.array[index2 + i];
	    }

	    return this;
	  };

	  BufferAttribute.prototype.copyArray = function (array) {
	    this.array.set(array);
	    return this;
	  };

	  BufferAttribute.prototype.copyColorsArray = function (colors) {
	    var array = this.array;

	    for (var i = 0, l = colors.length; i < l; i++) {
	      var color = colors[i]; // if (color === undefined) {
	      //     console.warn('THREE.BufferAttribute.copyColorsArray(): color is undefined', i);
	      //     color = new Color();
	      // }
	      // array[offset++] = color.r;
	      // array[offset++] = color.g;
	      // array[offset++] = color.b;
	    }

	    return this;
	  };

	  BufferAttribute.prototype.copyVec2sArray = function (vectors) {
	    var array = this.array,
	        offset = 0;

	    for (var i = 0, l = vectors.length; i < l; i++) {
	      var vector = vectors[i];

	      if (vector === undefined) {
	        console.warn('THREE.BufferAttribute.copyVec2sArray(): vector is undefined', i);
	        vector = new Vec2_1.Vec2();
	      }

	      array[offset++] = vector.x;
	      array[offset++] = vector.y;
	    }

	    return this;
	  };

	  BufferAttribute.prototype.copyVec3sArray = function (vectors) {
	    var array = this.array,
	        offset = 0;

	    for (var i = 0, l = vectors.length; i < l; i++) {
	      var vector = vectors[i];

	      if (vector === undefined) {
	        console.warn('THREE.BufferAttribute.copyVec3sArray(): vector is undefined', i);
	        vector = new Vec3_1.Vec3();
	      }

	      array[offset++] = vector.x;
	      array[offset++] = vector.y;
	      array[offset++] = vector.z;
	    }

	    return this;
	  };

	  BufferAttribute.prototype.copyVec4sArray = function (vectors) {
	    var array = this.array,
	        offset = 0;

	    for (var i = 0, l = vectors.length; i < l; i++) {
	      var vector = vectors[i];

	      if (vector === undefined) {
	        console.warn('THREE.BufferAttribute.copyVec4sArray(): vector is undefined', i);
	        vector = new Vec4_1.Vec4();
	      }

	      array[offset++] = vector.x;
	      array[offset++] = vector.y;
	      array[offset++] = vector.z;
	      array[offset++] = vector.w;
	    }

	    return this;
	  };

	  BufferAttribute.prototype.applyMat3 = function (m) {
	    for (var i = 0, l = this.count; i < l; i++) {
	      _vector.x = this.getX(i);
	      _vector.y = this.getY(i);
	      _vector.z = this.getZ(i);

	      _vector.applyMat3(m);

	      this.setXYZ(i, _vector.x, _vector.y, _vector.z);
	    }

	    return this;
	  };

	  BufferAttribute.prototype.applyMat4 = function (m) {
	    for (var i = 0, l = this.count; i < l; i++) {
	      _vector.x = this.getX(i);
	      _vector.y = this.getY(i);
	      _vector.z = this.getZ(i);

	      _vector.applyMat4(m);

	      this.setXYZ(i, _vector.x, _vector.y, _vector.z);
	    }

	    return this;
	  };

	  BufferAttribute.prototype.applyNormalMat = function (m) {
	    for (var i = 0, l = this.count; i < l; i++) {
	      _vector.x = this.getX(i);
	      _vector.y = this.getY(i);
	      _vector.z = this.getZ(i);

	      _vector.applyNormalMat(m);

	      this.setXYZ(i, _vector.x, _vector.y, _vector.z);
	    }

	    return this;
	  };

	  BufferAttribute.prototype.transformDirection = function (m) {
	    for (var i = 0, l = this.count; i < l; i++) {
	      _vector.x = this.getX(i);
	      _vector.y = this.getY(i);
	      _vector.z = this.getZ(i);

	      _vector.transformDirection(m);

	      this.setXYZ(i, _vector.x, _vector.y, _vector.z);
	    }

	    return this;
	  };

	  BufferAttribute.prototype.set = function (value, offset) {
	    if (offset === undefined) offset = 0;
	    this.array.set(value, offset);
	    return this;
	  };

	  BufferAttribute.prototype.getX = function (index) {
	    return this.array[index * this.itemSize];
	  };

	  BufferAttribute.prototype.setX = function (index, x) {
	    this.array[index * this.itemSize] = x;
	    return this;
	  };

	  BufferAttribute.prototype.getY = function (index) {
	    return this.array[index * this.itemSize + 1];
	  };

	  BufferAttribute.prototype.setY = function (index, y) {
	    this.array[index * this.itemSize + 1] = y;
	    return this;
	  };

	  BufferAttribute.prototype.getZ = function (index) {
	    return this.array[index * this.itemSize + 2];
	  };

	  BufferAttribute.prototype.setZ = function (index, z) {
	    this.array[index * this.itemSize + 2] = z;
	    return this;
	  };

	  BufferAttribute.prototype.getW = function (index) {
	    return this.array[index * this.itemSize + 3];
	  };

	  BufferAttribute.prototype.setW = function (index, w) {
	    this.array[index * this.itemSize + 3] = w;
	    return this;
	  };

	  BufferAttribute.prototype.setXY = function (index, x, y) {
	    index *= this.itemSize;
	    this.array[index + 0] = x;
	    this.array[index + 1] = y;
	    return this;
	  };

	  BufferAttribute.prototype.setXYZ = function (index, x, y, z) {
	    index *= this.itemSize;
	    this.array[index + 0] = x;
	    this.array[index + 1] = y;
	    this.array[index + 2] = z;
	    return this;
	  };

	  BufferAttribute.prototype.setXYZW = function (index, x, y, z, w) {
	    index *= this.itemSize;
	    this.array[index + 0] = x;
	    this.array[index + 1] = y;
	    this.array[index + 2] = z;
	    this.array[index + 3] = w;
	    return this;
	  };

	  BufferAttribute.prototype.clone = function () {
	    return new BufferAttribute(this.array, this.itemSize).copy(this);
	  };

	  BufferAttribute.prototype.toJSON = function () {
	    return {
	      itemSize: this.itemSize,
	      type: this.array.constructor.name,
	      array: Array.prototype.slice.call(this.array),
	      normalized: this.normalized
	    };
	  };

	  return BufferAttribute;
	}();

	exports.BufferAttribute = BufferAttribute;

	var Int8BufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Int8BufferAttribute, _super);

	  function Int8BufferAttribute(array, itemSize, normalized) {
	    if (normalized === void 0) {
	      normalized = false;
	    }

	    if (Array.isArray(array)) array = new Int8Array(array);
	    return _super.call(this, new Int8Array(array), itemSize, normalized) || this;
	  }

	  return Int8BufferAttribute;
	}(BufferAttribute);

	exports.Int8BufferAttribute = Int8BufferAttribute;

	var Uint8BufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Uint8BufferAttribute, _super);

	  function Uint8BufferAttribute(array, itemSize, normalized) {
	    if (normalized === void 0) {
	      normalized = false;
	    }

	    if (Array.isArray(array)) array = new Uint8Array(array);
	    return _super.call(this, array, itemSize, normalized) || this;
	  }

	  return Uint8BufferAttribute;
	}(BufferAttribute);

	exports.Uint8BufferAttribute = Uint8BufferAttribute;

	var Uint8ClampedBufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Uint8ClampedBufferAttribute, _super);

	  function Uint8ClampedBufferAttribute(array, itemSize, normalized) {
	    if (normalized === void 0) {
	      normalized = false;
	    }

	    if (Array.isArray(array)) array = new Uint8ClampedArray(array);
	    return _super.call(this, array, itemSize, normalized) || this;
	  }

	  return Uint8ClampedBufferAttribute;
	}(BufferAttribute);

	exports.Uint8ClampedBufferAttribute = Uint8ClampedBufferAttribute;

	var Int16BufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Int16BufferAttribute, _super);

	  function Int16BufferAttribute(array, itemSize, normalized) {
	    if (normalized === void 0) {
	      normalized = false;
	    }

	    if (Array.isArray(array)) array = new Int16Array(array);
	    return _super.call(this, array, itemSize, normalized) || this;
	  }

	  return Int16BufferAttribute;
	}(BufferAttribute);

	exports.Int16BufferAttribute = Int16BufferAttribute;

	var Uint16BufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Uint16BufferAttribute, _super);

	  function Uint16BufferAttribute(array, itemSize, normalized) {

	    if (Array.isArray(array)) array = new Uint16Array(array);
	    return _super.call(this, array, itemSize) || this;
	  }

	  return Uint16BufferAttribute;
	}(BufferAttribute);

	exports.Uint16BufferAttribute = Uint16BufferAttribute;

	var Int32BufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Int32BufferAttribute, _super);

	  function Int32BufferAttribute(array, itemSize, normalized) {
	    if (normalized === void 0) {
	      normalized = false;
	    }

	    if (Array.isArray(array)) array = new Int32Array(array);
	    return _super.call(this, array, itemSize, normalized) || this;
	  }

	  return Int32BufferAttribute;
	}(BufferAttribute);

	exports.Int32BufferAttribute = Int32BufferAttribute;

	var Uint32BufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Uint32BufferAttribute, _super);

	  function Uint32BufferAttribute(array, itemSize, normalized) {
	    if (normalized === void 0) {
	      normalized = false;
	    }

	    if (Array.isArray(array)) array = new Uint32Array(array);
	    return _super.call(this, array, itemSize, normalized) || this;
	  }

	  return Uint32BufferAttribute;
	}(BufferAttribute);

	exports.Uint32BufferAttribute = Uint32BufferAttribute;

	var Float32BufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Float32BufferAttribute, _super);

	  function Float32BufferAttribute(array, itemSize, normalized) {
	    if (normalized === void 0) {
	      normalized = false;
	    }

	    if (Array.isArray(array)) array = new Float32Array(array);
	    return _super.call(this, array, itemSize, normalized) || this;
	  }

	  return Float32BufferAttribute;
	}(BufferAttribute);

	exports.Float32BufferAttribute = Float32BufferAttribute;

	var Float64BufferAttribute =
	/** @class */
	function (_super) {
	  __extends(Float64BufferAttribute, _super);

	  function Float64BufferAttribute(array, itemSize, normalized) {
	    if (normalized === void 0) {
	      normalized = false;
	    }

	    if (Array.isArray(array)) array = new Float64Array(array);
	    return _super.call(this, array, itemSize, normalized) || this;
	  }

	  return Float64BufferAttribute;
	}(BufferAttribute);

	exports.Float64BufferAttribute = Float64BufferAttribute;
	});

	unwrapExports(bufferAttribute);
	var bufferAttribute_1 = bufferAttribute.Float64BufferAttribute;
	var bufferAttribute_2 = bufferAttribute.Float32BufferAttribute;
	var bufferAttribute_3 = bufferAttribute.Uint32BufferAttribute;
	var bufferAttribute_4 = bufferAttribute.Int32BufferAttribute;
	var bufferAttribute_5 = bufferAttribute.Uint16BufferAttribute;
	var bufferAttribute_6 = bufferAttribute.Int16BufferAttribute;
	var bufferAttribute_7 = bufferAttribute.Uint8ClampedBufferAttribute;
	var bufferAttribute_8 = bufferAttribute.Uint8BufferAttribute;
	var bufferAttribute_9 = bufferAttribute.Int8BufferAttribute;
	var bufferAttribute_10 = bufferAttribute.BufferAttribute;

	var types$1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isBufferArray = void 0;

	var isBufferArray = function (obj) {
	  var types = ['Int8Array', 'Uint8Array', 'Uint8ClampedArray', 'Int16Array', 'Uint16Array', 'Int32Array', 'Uint32Array', 'Float32Array', 'Float64Array'];
	  return types.indexOf(obj.constructor.name) > -1;
	};

	exports.isBufferArray = isBufferArray;
	});

	unwrapExports(types$1);
	var types_1$1 = types$1.isBufferArray;

	var geometry = createCommonjsModule(function (module, exports) {

	var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
	  return mod && mod.__esModule ? mod : {
	    "default": mod
	  };
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.BufferGeometry = void 0;





















	var vector_1$1 = __importDefault(vector_1);

	var _bufferGeometryId = 1; // BufferGeometry uses odd numbers as Id

	var _m1 = new Mat4_1.Mat4();

	var _offset = new Vec3_1.Vec3();

	var _box = new Box_1.Box();

	var _boxMorphTargets = new Box_1.Box();

	var _vector = new Vec3_1.Vec3();
	/**
	 * BufferType 几何体，用于独立计算几何体
	 */


	var BufferGeometry =
	/** @class */
	function () {
	  function BufferGeometry() {
	    this.isBufferGeometry = true;
	    this.uuid = "";
	    this.type = "BufferGeometry";
	    Object.defineProperty(this, 'id', {
	      value: _bufferGeometryId += 2
	    });
	    this.name = '';
	    this.attributes = {};
	    this.morphAttributes = {};
	    this.morphTargetsRelative = false;
	    this.groups = [];
	    this.drawRange = {
	      start: 0,
	      count: Infinity
	    };
	  }
	  /**
	   * 转化成BufferArray来计算
	   * @param geo
	   */


	  BufferGeometry.prototype.setFromGeometry = function (geo) {
	    this.setAttribute('position', new bufferAttribute.Float32BufferAttribute(geo.position, 3));
	    if (geo.uv) this.setAttribute('uv', new bufferAttribute.Float32BufferAttribute(geo.uv, 2));
	    if (geo.index) this.setIndex(geo.index);
	    return this;
	  };

	  BufferGeometry.prototype.getIndex = function () {
	    return this.index;
	  };

	  BufferGeometry.prototype.setIndex = function (index) {
	    if (Array.isArray(index)) {
	      this.index = new (Vec_1.Vec.max(index) > 65535 ? bufferAttribute.Uint32BufferAttribute : bufferAttribute.Uint16BufferAttribute)(index, 1);
	    } else if (index instanceof bufferAttribute.BufferAttribute) {
	      this.index = index;
	    } else {
	      this.index = new (Vec_1.Vec.max(index) > 65535 ? bufferAttribute.Uint32BufferAttribute : bufferAttribute.Uint16BufferAttribute)(index, 1);
	    }
	  };

	  BufferGeometry.prototype.getAttribute = function (name) {
	    return this.attributes[name];
	  };

	  BufferGeometry.prototype.setAttribute = function (name, attribute) {
	    this.attributes[name] = attribute;
	    return this;
	  };

	  BufferGeometry.prototype.addAttribute = function (name, attribute, itemSize) {
	    if (itemSize === void 0) {
	      itemSize = 1;
	    }

	    if (Array.isArray(attribute)) {
	      if (attribute[0] instanceof Vec2_1.Vec2) {
	        var nums = vector_1$1.default.verctorToNumbers(attribute);
	        this.setAttribute(name, new bufferAttribute.Float32BufferAttribute(nums, 2));
	      } else if (attribute[0] instanceof Vec3_1.Vec3) {
	        var nums = vector_1$1.default.verctorToNumbers(attribute);
	        this.setAttribute(name, new bufferAttribute.Float32BufferAttribute(nums, 3));
	      } else if (attribute[0] instanceof Vec4_1.Vec4) {
	        var nums = vector_1$1.default.verctorToNumbers(attribute);
	        this.setAttribute(name, new bufferAttribute.Float32BufferAttribute(nums, 4));
	      } else if (!isNaN(attribute[0])) {
	        this.setAttribute(name, new bufferAttribute.Float32BufferAttribute(attribute, itemSize));
	      } else {
	        console.error("类型不存在");
	      }
	    } else if (attribute instanceof bufferAttribute.BufferAttribute) {
	      this.attributes[name] = attribute;
	    } else if ((0, types$1.isBufferArray)(attribute)) {
	      this.setAttribute(name, new bufferAttribute.BufferAttribute(attribute, itemSize));
	    }

	    return this;
	  };

	  BufferGeometry.prototype.deleteAttribute = function (name) {
	    delete this.attributes[name];
	    return this;
	  };

	  BufferGeometry.prototype.addGroup = function (start, count, materialIndex) {
	    this.groups.push({
	      start: start,
	      count: count,
	      materialIndex: materialIndex !== undefined ? materialIndex : 0
	    });
	  };

	  BufferGeometry.prototype.clearGroups = function () {
	    this.groups = [];
	  };

	  BufferGeometry.prototype.setDrawRange = function (start, count) {
	    this.drawRange.start = start;
	    this.drawRange.count = count;
	  };

	  BufferGeometry.prototype.applyMat4 = function (matrix) {
	    var position = this.attributes.position;

	    if (position !== undefined) {
	      position.applyMat4(matrix);
	      position.needsUpdate = true;
	    }

	    var normal = this.attributes.normal;

	    if (normal !== undefined) {
	      var normalMatrix = new Mat3_1.Mat3().getNormalMat(matrix);
	      normal.applyNormalMat(normalMatrix);
	      normal.needsUpdate = true;
	    }

	    var tangent = this.attributes.tangent;

	    if (tangent !== undefined) {
	      tangent.transformDirection(matrix);
	      tangent.needsUpdate = true;
	    }

	    if (!this.boundingBox) {
	      this.computeBoundingBox();
	    }

	    if (!this.boundingSphere) {
	      this.computeBoundingSphere();
	    }

	    return this;
	  };

	  BufferGeometry.prototype.rotateX = function (angle) {
	    // rotate geometry around world x-axis
	    _m1.makeRotationX(angle);

	    this.applyMat4(_m1);
	    return this;
	  };

	  BufferGeometry.prototype.rotateY = function (angle) {
	    // rotate geometry around world y-axis
	    _m1.makeRotationY(angle);

	    this.applyMat4(_m1);
	    return this;
	  };

	  BufferGeometry.prototype.rotateZ = function (angle) {
	    // rotate geometry around world z-axis
	    _m1.makeRotationZ(angle);

	    this.applyMat4(_m1);
	    return this;
	  };

	  BufferGeometry.prototype.translate = function (x, y, z) {
	    // translate geometry
	    _m1.makeTranslation(x, y, z);

	    this.applyMat4(_m1);
	    return this;
	  };

	  BufferGeometry.prototype.scale = function (x, y, z) {
	    // scale geometry
	    _m1.makeScale(x, y, z);

	    this.applyMat4(_m1);
	    return this;
	  };

	  BufferGeometry.prototype.lookAt = function (vector) {
	    _m1.lookAt((0, Vec3_1.v3)(), vector, Vec3_1.Vec3.UnitY);

	    this.applyMat4(_m1);
	    return this;
	  };

	  BufferGeometry.prototype.center = function () {
	    this.computeBoundingBox();
	    this.boundingBox.getCenter(_offset).negate();
	    this.translate(_offset.x, _offset.y, _offset.z);
	    return this;
	  };

	  BufferGeometry.prototype.setFromObject = function (object) {
	    // console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this );
	    var geometry = object.geometry;

	    if (object.isPoints || object.isLine) {
	      var positions = new bufferAttribute.Float32BufferAttribute(geometry.vertices.length * 3, 3);
	      var colors = new bufferAttribute.Float32BufferAttribute(geometry.colors.length * 3, 3);
	      this.setAttribute('position', positions.copyVec3sArray(geometry.vertices));
	      this.setAttribute('color', colors.copyColorsArray(geometry.colors));

	      if (geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length) {
	        var lineDistances = new bufferAttribute.Float32BufferAttribute(geometry.lineDistances.length, 1);
	        this.setAttribute('lineDistance', lineDistances.copyArray(geometry.lineDistances));
	      }

	      if (geometry.boundingSphere !== null) {
	        this.boundingSphere = geometry.boundingSphere.clone();
	      }

	      if (geometry.boundingBox !== null) {
	        this.boundingBox = geometry.boundingBox.clone();
	      }
	    } else if (object.isMesh) ;

	    return this;
	  };

	  BufferGeometry.prototype.setFromPoints = function (points) {
	    var position = [];

	    for (var i = 0, l = points.length; i < l; i++) {
	      var point = points[i];
	      position.push(point.x, point.y, point.z || 0);
	    }

	    this.setAttribute('position', new bufferAttribute.Float32BufferAttribute(position, 3));
	    return this;
	  };

	  BufferGeometry.prototype.updateFromObject = function (object) {
	    var geometry = object.geometry;

	    if (object.isMesh) {
	      var direct = geometry.__directGeometry;

	      if (geometry.elementsNeedUpdate === true) {
	        direct = undefined;
	        geometry.elementsNeedUpdate = false;
	      } // if (direct === undefined) {
	      //     return this.fromGeometry(geometry);
	      // }


	      direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
	      direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
	      direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
	      direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
	      direct.groupsNeedUpdate = geometry.groupsNeedUpdate;
	      geometry.verticesNeedUpdate = false;
	      geometry.normalsNeedUpdate = false;
	      geometry.colorsNeedUpdate = false;
	      geometry.uvsNeedUpdate = false;
	      geometry.groupsNeedUpdate = false;
	      geometry = direct;
	    }

	    var attribute;

	    if (geometry.verticesNeedUpdate === true) {
	      attribute = this.attributes.position;

	      if (attribute !== undefined) {
	        attribute.copyVec3sArray(geometry.vertices);
	        attribute.needsUpdate = true;
	      }

	      geometry.verticesNeedUpdate = false;
	    }

	    if (geometry.normalsNeedUpdate === true) {
	      attribute = this.attributes.normal;

	      if (attribute !== undefined) {
	        attribute.copyVec3sArray(geometry.normals);
	        attribute.needsUpdate = true;
	      }

	      geometry.normalsNeedUpdate = false;
	    }

	    if (geometry.colorsNeedUpdate === true) {
	      attribute = this.attributes.color;

	      if (attribute !== undefined) {
	        attribute.copyColorsArray(geometry.colors);
	        attribute.needsUpdate = true;
	      }

	      geometry.colorsNeedUpdate = false;
	    }

	    if (geometry.uvsNeedUpdate) {
	      attribute = this.attributes.uv;

	      if (attribute !== undefined) {
	        attribute.copyVec2sArray(geometry.uvs);
	        attribute.needsUpdate = true;
	      }

	      geometry.uvsNeedUpdate = false;
	    }

	    if (geometry.lineDistancesNeedUpdate) {
	      attribute = this.attributes.lineDistance;

	      if (attribute !== undefined) {
	        attribute.copyArray(geometry.lineDistances);
	        attribute.needsUpdate = true;
	      }

	      geometry.lineDistancesNeedUpdate = false;
	    }

	    if (geometry.groupsNeedUpdate) {
	      geometry.computeGroups(object.geometry);
	      this.groups = geometry.groups;
	      geometry.groupsNeedUpdate = false;
	    }

	    return this;
	  }; // fromGeometry(geometry: any) {
	  //     geometry.__directGeometry = new DirectGeometry().fromGeometry(geometry);
	  //     return this.fromDirectGeometry(geometry.__directGeometry);
	  // }
	  // fromDirectGeometry(geometry) {
	  //     var positions = new Float32Array(geometry.vertices.length * 3);
	  //     this.setAttribute('position', new BufferAttribute(positions, 3).copyVec3sArray(geometry.vertices));
	  //     if (geometry.normals.length > 0) {
	  //         var normals = new Float32Array(geometry.normals.length * 3);
	  //         this.setAttribute('normal', new BufferAttribute(normals, 3).copyVec3sArray(geometry.normals));
	  //     }
	  //     if (geometry.colors.length > 0) {
	  //         var colors = new Float32Array(geometry.colors.length * 3);
	  //         this.setAttribute('color', new BufferAttribute(colors, 3).copyColorsArray(geometry.colors));
	  //     }
	  //     if (geometry.uvs.length > 0) {
	  //         var uvs = new Float32Array(geometry.uvs.length * 2);
	  //         this.setAttribute('uv', new BufferAttribute(uvs, 2).copyVec2sArray(geometry.uvs));
	  //     }
	  //     if (geometry.uvs2.length > 0) {
	  //         var uvs2 = new Float32Array(geometry.uvs2.length * 2);
	  //         this.setAttribute('uv2', new BufferAttribute(uvs2, 2).copyVec2sArray(geometry.uvs2));
	  //     }
	  //     // groups
	  //     this.groups = geometry.groups;
	  //     // morphs
	  //     for (var name in geometry.morphTargets) {
	  //         var array = [];
	  //         var morphTargets = geometry.morphTargets[name];
	  //         for (var i = 0, l = morphTargets.length; i < l; i++) {
	  //             var morphTarget = morphTargets[i];
	  //             var attribute = new Float32BufferAttribute(morphTarget.data.length * 3, 3);
	  //             attribute.name = morphTarget.name;
	  //             array.push(attribute.copyVec3sArray(morphTarget.data));
	  //         }
	  //         this.morphAttributes[name] = array;
	  //     }
	  //     // skinning
	  //     if (geometry.skinIndices.length > 0) {
	  //         var skinIndices = new Float32BufferAttribute(geometry.skinIndices.length * 4, 4);
	  //         this.setAttribute('skinIndex', skinIndices.copyVec4sArray(geometry.skinIndices));
	  //     }
	  //     if (geometry.skinWeights.length > 0) {
	  //         var skinWeights = new Float32BufferAttribute(geometry.skinWeights.length * 4, 4);
	  //         this.setAttribute('skinWeight', skinWeights.copyVec4sArray(geometry.skinWeights));
	  //     }
	  //     //
	  //     if (geometry.boundingSphere !== null) {
	  //         this.boundingSphere = geometry.boundingSphere.clone();
	  //     }
	  //     if (geometry.boundingBox !== null) {
	  //         this.boundingBox = geometry.boundingBox.clone();
	  //     }
	  //     return this;
	  // }


	  BufferGeometry.prototype.computeBoundingBox = function () {
	    if (!this.boundingBox) {
	      this.boundingBox = new Box_1.Box();
	    }

	    var position = this.attributes.position;
	    var morphAttributesPosition = this.morphAttributes.position;

	    if (position) {
	      this.boundingBox.setFromBufferAttribute(position); // process morph attributes if present

	      if (morphAttributesPosition) {
	        for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
	          var morphAttribute = morphAttributesPosition[i];

	          _box.setFromBufferAttribute(morphAttribute);

	          if (this.morphTargetsRelative) {
	            _vector.addVecs(this.boundingBox.min, _box.min);

	            this.boundingBox.expandByPoint(_vector);

	            _vector.addVecs(this.boundingBox.max, _box.max);

	            this.boundingBox.expandByPoint(_vector);
	          } else {
	            this.boundingBox.expandByPoint(_box.min);
	            this.boundingBox.expandByPoint(_box.max);
	          }
	        }
	      }
	    } else {
	      this.boundingBox.makeEmpty();
	    }

	    if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
	      console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
	    }
	  };

	  BufferGeometry.prototype.computeBoundingSphere = function () {
	    if (!this.boundingSphere) {
	      this.boundingSphere = new Sphere_1.Sphere();
	    }

	    var position = this.attributes.position;
	    var morphAttributesPosition = this.morphAttributes.position;

	    if (position) {
	      // first, find the center of the bounding sphere
	      var center = this.boundingSphere.center;

	      _box.setFromBufferAttribute(position); // process morph attributes if present


	      if (morphAttributesPosition) {
	        for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
	          var morphAttribute = morphAttributesPosition[i];

	          _boxMorphTargets.setFromBufferAttribute(morphAttribute);

	          if (this.morphTargetsRelative) {
	            _vector.addVecs(_box.min, _boxMorphTargets.min);

	            _box.expandByPoint(_vector);

	            _vector.addVecs(_box.max, _boxMorphTargets.max);

	            _box.expandByPoint(_vector);
	          } else {
	            _box.expandByPoint(_boxMorphTargets.min);

	            _box.expandByPoint(_boxMorphTargets.max);
	          }
	        }
	      }

	      _box.getCenter(center); // second, try to find a boundingSphere with a radius smaller than the
	      // boundingSphere of the boundingBox: sqrt(3) smaller in the best case


	      var maxRadiusSq = 0;

	      for (var i = 0, il = position.count; i < il; i++) {
	        _vector.fromBufferAttribute(position, i);

	        maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
	      } // process morph attributes if present


	      if (morphAttributesPosition) {
	        for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {
	          var morphAttribute = morphAttributesPosition[i];
	          var morphTargetsRelative = this.morphTargetsRelative;

	          for (var j = 0, jl = morphAttribute.count; j < jl; j++) {
	            _vector.fromBufferAttribute(morphAttribute, j);

	            if (morphTargetsRelative) {
	              _offset.fromBufferAttribute(position, j);

	              _vector.add(_offset);
	            }

	            maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(_vector));
	          }
	        }
	      }

	      this.boundingSphere.radius = Math.sqrt(maxRadiusSq);

	      if (isNaN(this.boundingSphere.radius)) {
	        console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
	      }
	    }
	  };

	  BufferGeometry.prototype.computeFaceNormals = function () {// backwards compatibility
	  };

	  BufferGeometry.prototype.computeVertexNormals = function () {
	    var index = this.index;
	    var attributes = this.attributes;

	    if (attributes.position) {
	      var positions = attributes.position.array;

	      if (attributes.normal === undefined) {
	        this.setAttribute('normal', new bufferAttribute.BufferAttribute(new Float32Array(positions.length), 3));
	      } else {
	        // reset existing normals to zero
	        var array = attributes.normal.array;

	        for (var i = 0, il = array.length; i < il; i++) {
	          array[i] = 0;
	        }
	      }

	      var normals = attributes.normal.array;
	      var vA, vB, vC;
	      var pA = new Vec3_1.Vec3(),
	          pB = new Vec3_1.Vec3(),
	          pC = new Vec3_1.Vec3();
	      var cb = new Vec3_1.Vec3(),
	          ab = new Vec3_1.Vec3(); // indexed elements

	      if (index) {
	        var indices = index.array;

	        for (var i = 0, il = index.count; i < il; i += 3) {
	          vA = indices[i + 0] * 3;
	          vB = indices[i + 1] * 3;
	          vC = indices[i + 2] * 3;
	          pA.fromArray(positions, vA);
	          pB.fromArray(positions, vB);
	          pC.fromArray(positions, vC);
	          cb.subVecs(pC, pB);
	          ab.subVecs(pA, pB);
	          cb.cross(ab);
	          normals[vA] += cb.x;
	          normals[vA + 1] += cb.y;
	          normals[vA + 2] += cb.z;
	          normals[vB] += cb.x;
	          normals[vB + 1] += cb.y;
	          normals[vB + 2] += cb.z;
	          normals[vC] += cb.x;
	          normals[vC + 1] += cb.y;
	          normals[vC + 2] += cb.z;
	        }
	      } else {
	        // non-indexed elements (unconnected triangle soup)
	        for (var i = 0, il = positions.length; i < il; i += 9) {
	          pA.fromArray(positions, i);
	          pB.fromArray(positions, i + 3);
	          pC.fromArray(positions, i + 6);
	          cb.subVecs(pC, pB);
	          ab.subVecs(pA, pB);
	          cb.cross(ab);
	          normals[i] = cb.x;
	          normals[i + 1] = cb.y;
	          normals[i + 2] = cb.z;
	          normals[i + 3] = cb.x;
	          normals[i + 4] = cb.y;
	          normals[i + 5] = cb.z;
	          normals[i + 6] = cb.x;
	          normals[i + 7] = cb.y;
	          normals[i + 8] = cb.z;
	        }
	      }

	      this.normalizeNormals();
	      attributes.normal.needsUpdate = true;
	    }
	  };

	  BufferGeometry.prototype.merge = function (geometry, offset) {
	    if (!(geometry && geometry.isBufferGeometry)) {
	      console.error('THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry);
	      return;
	    }

	    if (offset === undefined) {
	      offset = 0;
	      console.warn('THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. ' + 'Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.');
	    }

	    var attributes = this.attributes;

	    for (var key in attributes) {
	      if (geometry.attributes[key] === undefined) continue;
	      var attribute1 = attributes[key];
	      var attributeArray1 = attribute1.array;
	      var attribute2 = geometry.attributes[key];
	      var attributeArray2 = attribute2.array;
	      var attributeOffset = attribute2.itemSize * offset;
	      var length = Math.min(attributeArray2.length, attributeArray1.length - attributeOffset);

	      for (var i = 0, j = attributeOffset; i < length; i++, j++) {
	        attributeArray1[j] = attributeArray2[i];
	      }
	    }

	    return this;
	  };

	  BufferGeometry.prototype.normalizeNormals = function () {
	    var normals = this.attributes.normal;

	    for (var i = 0, il = normals.count; i < il; i++) {
	      _vector.x = normals.getX(i);
	      _vector.y = normals.getY(i);
	      _vector.z = normals.getZ(i);

	      _vector.normalize();

	      normals.setXYZ(i, _vector.x, _vector.y, _vector.z);
	    }
	  };

	  BufferGeometry.prototype.toFlat = function () {
	    var indices = this.index.array;
	    var attributes = this.attributes;
	    var geometry2 = new BufferGeometry();

	    function convertBufferAttribute(attribute, indices) {
	      var array = attribute.array;
	      var itemSize = attribute.itemSize;
	      var array2 = new array.constructor(indices.length * itemSize);
	      var index = 0,
	          index2 = 0;

	      for (var i = 0, l = indices.length; i < l; i++) {
	        index = indices[i] * itemSize;

	        for (var j = 0; j < itemSize; j++) {
	          array2[index2++] = array[index++];
	        }
	      }

	      return new bufferAttribute.BufferAttribute(array2, itemSize);
	    }

	    for (var name in attributes) {
	      var attribute = attributes[name];
	      var newAttribute = convertBufferAttribute(attribute, indices);
	      geometry2.setAttribute(name, newAttribute);
	    }

	    var indices2 = indices.map(function (v, i) {
	      return i;
	    });
	    geometry2.setIndex(indices2);
	    return geometry2;
	  };

	  BufferGeometry.prototype.toNonIndexed = function () {
	    function convertBufferAttribute(attribute, indices) {
	      var array = attribute.array;
	      var itemSize = attribute.itemSize;
	      var array2 = new array.constructor(indices.length * itemSize);
	      var index = 0,
	          index2 = 0;

	      for (var i = 0, l = indices.length; i < l; i++) {
	        index = indices[i] * itemSize;

	        for (var j = 0; j < itemSize; j++) {
	          array2[index2++] = array[index++];
	        }
	      }

	      return new bufferAttribute.BufferAttribute(array2, itemSize);
	    } //


	    if (this.index === undefined) {
	      console.warn('THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.');
	      return this;
	    }

	    var geometry2 = new BufferGeometry();
	    var indices = this.index.array;
	    var attributes = this.attributes; // attributes

	    for (var name in attributes) {
	      var attribute = attributes[name];
	      var newAttribute = convertBufferAttribute(attribute, indices);
	      geometry2.setAttribute(name, newAttribute);
	    } // morph attributes


	    var morphAttributes = this.morphAttributes;

	    for (name in morphAttributes) {
	      var morphArray = [];
	      var morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

	      for (var i = 0, il = morphAttribute.length; i < il; i++) {
	        var attribute = morphAttribute[i];
	        var newAttribute = convertBufferAttribute(attribute, indices);
	        morphArray.push(newAttribute);
	      }

	      geometry2.morphAttributes[name] = morphArray;
	    }

	    geometry2.morphTargetsRelative = this.morphTargetsRelative; // groups

	    var groups = this.groups;

	    for (var i = 0, l = groups.length; i < l; i++) {
	      var group = groups[i];
	      geometry2.addGroup(group.start, group.count, group.materialIndex);
	    }

	    return geometry2;
	  };

	  BufferGeometry.prototype.toJSON = function () {
	    var data = {
	      metadata: {
	        version: 4.5,
	        type: 'BufferGeometry',
	        generator: 'BufferGeometry.toJSON'
	      }
	    }; // standard BufferGeometry serialization

	    data.uuid = this.uuid;
	    data.type = this.type;
	    if (this.name !== '') data.name = this.name;
	    if (Object.keys(this.userData).length > 0) data.userData = this.userData;

	    if (this.parameters !== undefined) {
	      var parameters = this.parameters;

	      for (var key in parameters) {
	        if (parameters[key] !== undefined) data[key] = parameters[key];
	      }

	      return data;
	    }

	    data.data = {
	      attributes: {}
	    };
	    var index = this.index;

	    if (index) {
	      data.data.index = {
	        type: index.array.constructor.name,
	        array: Array.prototype.slice.call(index.array)
	      };
	    }

	    var attributes = this.attributes;

	    for (var key in attributes) {
	      var attribute = attributes[key];
	      var attributeData = attribute.toJSON();
	      if (attribute.name !== '') attributeData.name = attribute.name;
	      data.data.attributes[key] = attributeData;
	    }

	    var morphAttributes = {};
	    var hasMorphAttributes = false;

	    for (var key in this.morphAttributes) {
	      var attributeArray = this.morphAttributes[key];
	      var array = [];

	      for (var i = 0, il = attributeArray.length; i < il; i++) {
	        var attribute = attributeArray[i];
	        var attributeData = attribute.toJSON();
	        if (attribute.name !== '') attributeData.name = attribute.name;
	        array.push(attributeData);
	      }

	      if (array.length > 0) {
	        morphAttributes[key] = array;
	        hasMorphAttributes = true;
	      }
	    }

	    if (hasMorphAttributes) {
	      data.data.morphAttributes = morphAttributes;
	      data.data.morphTargetsRelative = this.morphTargetsRelative;
	    }

	    var groups = this.groups;

	    if (groups.length > 0) {
	      data.data.groups = JSON.parse(JSON.stringify(groups));
	    }

	    var boundingSphere = this.boundingSphere;

	    if (boundingSphere) {
	      data.data.boundingSphere = {
	        center: boundingSphere.center.toArray(),
	        radius: boundingSphere.radius
	      };
	    }

	    return data;
	  };

	  BufferGeometry.prototype.userData = function (userData) {
	    throw new Error("Method not implemented.");
	  };

	  BufferGeometry.prototype.clone = function () {
	    /*
	     // Handle primitives
	            var parameters = this.parameters;
	            if ( parameters !== undefined ) {
	            var values = [];
	            for ( var key in parameters ) {
	            values.push( parameters[ key ] );
	            }
	            var geometry = Object.create( this.constructor.prototype );
	     this.constructor.apply( geometry, values );
	     return geometry;
	            }
	            return new this.constructor().copy( this );
	     */
	    return new BufferGeometry().copy(this);
	  };

	  BufferGeometry.prototype.copy = function (source) {
	    var name, i, l; // reset

	    this.attributes = {};
	    this.morphAttributes = {};
	    this.groups = []; // name

	    this.name = source.name; // index

	    var index = source.index;

	    if (index) {
	      this.setIndex(index.clone());
	    } // attributes


	    var attributes = source.attributes;

	    for (name in attributes) {
	      var attribute = attributes[name];
	      this.setAttribute(name, attribute.clone());
	    } // morph attributes


	    var morphAttributes = source.morphAttributes;

	    for (name in morphAttributes) {
	      var array = [];
	      var morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

	      for (i = 0, l = morphAttribute.length; i < l; i++) {
	        array.push(morphAttribute[i].clone());
	      }

	      this.morphAttributes[name] = array;
	    }

	    this.morphTargetsRelative = source.morphTargetsRelative; // groups

	    var groups = source.groups;

	    for (i = 0, l = groups.length; i < l; i++) {
	      var group = groups[i];
	      this.addGroup(group.start, group.count, group.materialIndex);
	    } // bounding box


	    var boundingBox = source.boundingBox;

	    if (boundingBox) {
	      this.boundingBox = boundingBox.clone();
	    } // bounding sphere


	    var boundingSphere = source.boundingSphere;

	    if (boundingSphere) {
	      this.boundingSphere = boundingSphere.clone();
	    } // draw range


	    this.drawRange.start = source.drawRange.start;
	    this.drawRange.count = source.drawRange.count; // user data

	    this.userData = source.userData;
	    return this;
	  };

	  return BufferGeometry;
	}();

	exports.BufferGeometry = BufferGeometry;
	});

	unwrapExports(geometry);
	var geometry_1 = geometry.BufferGeometry;

	var earcut_1 = earcut;
	var default_1 = earcut;

	function earcut(data, holeIndices, dim) {

	    dim = dim || 2;

	    var hasHoles = holeIndices && holeIndices.length,
	        outerLen = hasHoles ? holeIndices[0] * dim : data.length,
	        outerNode = linkedList(data, 0, outerLen, dim, true),
	        triangles = [];

	    if (!outerNode || outerNode.next === outerNode.prev) return triangles;

	    var minX, minY, maxX, maxY, x, y, invSize;

	    if (hasHoles) outerNode = eliminateHoles(data, holeIndices, outerNode, dim);

	    // if the shape is not too simple, we'll use z-order curve hash later; calculate polygon bbox
	    if (data.length > 80 * dim) {
	        minX = maxX = data[0];
	        minY = maxY = data[1];

	        for (var i = dim; i < outerLen; i += dim) {
	            x = data[i];
	            y = data[i + 1];
	            if (x < minX) minX = x;
	            if (y < minY) minY = y;
	            if (x > maxX) maxX = x;
	            if (y > maxY) maxY = y;
	        }

	        // minX, minY and invSize are later used to transform coords into integers for z-order calculation
	        invSize = Math.max(maxX - minX, maxY - minY);
	        invSize = invSize !== 0 ? 32767 / invSize : 0;
	    }

	    earcutLinked(outerNode, triangles, dim, minX, minY, invSize, 0);

	    return triangles;
	}

	// create a circular doubly linked list from polygon points in the specified winding order
	function linkedList(data, start, end, dim, clockwise) {
	    var i, last;

	    if (clockwise === (signedArea(data, start, end, dim) > 0)) {
	        for (i = start; i < end; i += dim) last = insertNode(i, data[i], data[i + 1], last);
	    } else {
	        for (i = end - dim; i >= start; i -= dim) last = insertNode(i, data[i], data[i + 1], last);
	    }

	    if (last && equals(last, last.next)) {
	        removeNode(last);
	        last = last.next;
	    }

	    return last;
	}

	// eliminate colinear or duplicate points
	function filterPoints(start, end) {
	    if (!start) return start;
	    if (!end) end = start;

	    var p = start,
	        again;
	    do {
	        again = false;

	        if (!p.steiner && (equals(p, p.next) || area(p.prev, p, p.next) === 0)) {
	            removeNode(p);
	            p = end = p.prev;
	            if (p === p.next) break;
	            again = true;

	        } else {
	            p = p.next;
	        }
	    } while (again || p !== end);

	    return end;
	}

	// main ear slicing loop which triangulates a polygon (given as a linked list)
	function earcutLinked(ear, triangles, dim, minX, minY, invSize, pass) {
	    if (!ear) return;

	    // interlink polygon nodes in z-order
	    if (!pass && invSize) indexCurve(ear, minX, minY, invSize);

	    var stop = ear,
	        prev, next;

	    // iterate through ears, slicing them one by one
	    while (ear.prev !== ear.next) {
	        prev = ear.prev;
	        next = ear.next;

	        if (invSize ? isEarHashed(ear, minX, minY, invSize) : isEar(ear)) {
	            // cut off the triangle
	            triangles.push(prev.i / dim | 0);
	            triangles.push(ear.i / dim | 0);
	            triangles.push(next.i / dim | 0);

	            removeNode(ear);

	            // skipping the next vertex leads to less sliver triangles
	            ear = next.next;
	            stop = next.next;

	            continue;
	        }

	        ear = next;

	        // if we looped through the whole remaining polygon and can't find any more ears
	        if (ear === stop) {
	            // try filtering points and slicing again
	            if (!pass) {
	                earcutLinked(filterPoints(ear), triangles, dim, minX, minY, invSize, 1);

	            // if this didn't work, try curing all small self-intersections locally
	            } else if (pass === 1) {
	                ear = cureLocalIntersections(filterPoints(ear), triangles, dim);
	                earcutLinked(ear, triangles, dim, minX, minY, invSize, 2);

	            // as a last resort, try splitting the remaining polygon into two
	            } else if (pass === 2) {
	                splitEarcut(ear, triangles, dim, minX, minY, invSize);
	            }

	            break;
	        }
	    }
	}

	// check whether a polygon node forms a valid ear with adjacent nodes
	function isEar(ear) {
	    var a = ear.prev,
	        b = ear,
	        c = ear.next;

	    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

	    // now make sure we don't have other points inside the potential ear
	    var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

	    // triangle bbox; min & max are calculated like this for speed
	    var x0 = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
	        y0 = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
	        x1 = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
	        y1 = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy);

	    var p = c.next;
	    while (p !== a) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) &&
	            area(p.prev, p, p.next) >= 0) return false;
	        p = p.next;
	    }

	    return true;
	}

	function isEarHashed(ear, minX, minY, invSize) {
	    var a = ear.prev,
	        b = ear,
	        c = ear.next;

	    if (area(a, b, c) >= 0) return false; // reflex, can't be an ear

	    var ax = a.x, bx = b.x, cx = c.x, ay = a.y, by = b.y, cy = c.y;

	    // triangle bbox; min & max are calculated like this for speed
	    var x0 = ax < bx ? (ax < cx ? ax : cx) : (bx < cx ? bx : cx),
	        y0 = ay < by ? (ay < cy ? ay : cy) : (by < cy ? by : cy),
	        x1 = ax > bx ? (ax > cx ? ax : cx) : (bx > cx ? bx : cx),
	        y1 = ay > by ? (ay > cy ? ay : cy) : (by > cy ? by : cy);

	    // z-order range for the current triangle bbox;
	    var minZ = zOrder(x0, y0, minX, minY, invSize),
	        maxZ = zOrder(x1, y1, minX, minY, invSize);

	    var p = ear.prevZ,
	        n = ear.nextZ;

	    // look for points inside the triangle in both directions
	    while (p && p.z >= minZ && n && n.z <= maxZ) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
	        p = p.prevZ;

	        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
	        n = n.nextZ;
	    }

	    // look for remaining points in decreasing z-order
	    while (p && p.z >= minZ) {
	        if (p.x >= x0 && p.x <= x1 && p.y >= y0 && p.y <= y1 && p !== a && p !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
	        p = p.prevZ;
	    }

	    // look for remaining points in increasing z-order
	    while (n && n.z <= maxZ) {
	        if (n.x >= x0 && n.x <= x1 && n.y >= y0 && n.y <= y1 && n !== a && n !== c &&
	            pointInTriangle(ax, ay, bx, by, cx, cy, n.x, n.y) && area(n.prev, n, n.next) >= 0) return false;
	        n = n.nextZ;
	    }

	    return true;
	}

	// go through all polygon nodes and cure small local self-intersections
	function cureLocalIntersections(start, triangles, dim) {
	    var p = start;
	    do {
	        var a = p.prev,
	            b = p.next.next;

	        if (!equals(a, b) && intersects(a, p, p.next, b) && locallyInside(a, b) && locallyInside(b, a)) {

	            triangles.push(a.i / dim | 0);
	            triangles.push(p.i / dim | 0);
	            triangles.push(b.i / dim | 0);

	            // remove two nodes involved
	            removeNode(p);
	            removeNode(p.next);

	            p = start = b;
	        }
	        p = p.next;
	    } while (p !== start);

	    return filterPoints(p);
	}

	// try splitting polygon into two and triangulate them independently
	function splitEarcut(start, triangles, dim, minX, minY, invSize) {
	    // look for a valid diagonal that divides the polygon into two
	    var a = start;
	    do {
	        var b = a.next.next;
	        while (b !== a.prev) {
	            if (a.i !== b.i && isValidDiagonal(a, b)) {
	                // split the polygon in two by the diagonal
	                var c = splitPolygon(a, b);

	                // filter colinear points around the cuts
	                a = filterPoints(a, a.next);
	                c = filterPoints(c, c.next);

	                // run earcut on each half
	                earcutLinked(a, triangles, dim, minX, minY, invSize, 0);
	                earcutLinked(c, triangles, dim, minX, minY, invSize, 0);
	                return;
	            }
	            b = b.next;
	        }
	        a = a.next;
	    } while (a !== start);
	}

	// link every hole into the outer loop, producing a single-ring polygon without holes
	function eliminateHoles(data, holeIndices, outerNode, dim) {
	    var queue = [],
	        i, len, start, end, list;

	    for (i = 0, len = holeIndices.length; i < len; i++) {
	        start = holeIndices[i] * dim;
	        end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
	        list = linkedList(data, start, end, dim, false);
	        if (list === list.next) list.steiner = true;
	        queue.push(getLeftmost(list));
	    }

	    queue.sort(compareX);

	    // process holes from left to right
	    for (i = 0; i < queue.length; i++) {
	        outerNode = eliminateHole(queue[i], outerNode);
	    }

	    return outerNode;
	}

	function compareX(a, b) {
	    return a.x - b.x;
	}

	// find a bridge between vertices that connects hole with an outer ring and and link it
	function eliminateHole(hole, outerNode) {
	    var bridge = findHoleBridge(hole, outerNode);
	    if (!bridge) {
	        return outerNode;
	    }

	    var bridgeReverse = splitPolygon(bridge, hole);

	    // filter collinear points around the cuts
	    filterPoints(bridgeReverse, bridgeReverse.next);
	    return filterPoints(bridge, bridge.next);
	}

	// David Eberly's algorithm for finding a bridge between hole and outer polygon
	function findHoleBridge(hole, outerNode) {
	    var p = outerNode,
	        hx = hole.x,
	        hy = hole.y,
	        qx = -Infinity,
	        m;

	    // find a segment intersected by a ray from the hole's leftmost point to the left;
	    // segment's endpoint with lesser x will be potential connection point
	    do {
	        if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
	            var x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
	            if (x <= hx && x > qx) {
	                qx = x;
	                m = p.x < p.next.x ? p : p.next;
	                if (x === hx) return m; // hole touches outer segment; pick leftmost endpoint
	            }
	        }
	        p = p.next;
	    } while (p !== outerNode);

	    if (!m) return null;

	    // look for points inside the triangle of hole point, segment intersection and endpoint;
	    // if there are no points found, we have a valid connection;
	    // otherwise choose the point of the minimum angle with the ray as connection point

	    var stop = m,
	        mx = m.x,
	        my = m.y,
	        tanMin = Infinity,
	        tan;

	    p = m;

	    do {
	        if (hx >= p.x && p.x >= mx && hx !== p.x &&
	                pointInTriangle(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {

	            tan = Math.abs(hy - p.y) / (hx - p.x); // tangential

	            if (locallyInside(p, hole) &&
	                (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContainsSector(m, p)))))) {
	                m = p;
	                tanMin = tan;
	            }
	        }

	        p = p.next;
	    } while (p !== stop);

	    return m;
	}

	// whether sector in vertex m contains sector in vertex p in the same coordinates
	function sectorContainsSector(m, p) {
	    return area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
	}

	// interlink polygon nodes in z-order
	function indexCurve(start, minX, minY, invSize) {
	    var p = start;
	    do {
	        if (p.z === 0) p.z = zOrder(p.x, p.y, minX, minY, invSize);
	        p.prevZ = p.prev;
	        p.nextZ = p.next;
	        p = p.next;
	    } while (p !== start);

	    p.prevZ.nextZ = null;
	    p.prevZ = null;

	    sortLinked(p);
	}

	// Simon Tatham's linked list merge sort algorithm
	// http://www.chiark.greenend.org.uk/~sgtatham/algorithms/listsort.html
	function sortLinked(list) {
	    var i, p, q, e, tail, numMerges, pSize, qSize,
	        inSize = 1;

	    do {
	        p = list;
	        list = null;
	        tail = null;
	        numMerges = 0;

	        while (p) {
	            numMerges++;
	            q = p;
	            pSize = 0;
	            for (i = 0; i < inSize; i++) {
	                pSize++;
	                q = q.nextZ;
	                if (!q) break;
	            }
	            qSize = inSize;

	            while (pSize > 0 || (qSize > 0 && q)) {

	                if (pSize !== 0 && (qSize === 0 || !q || p.z <= q.z)) {
	                    e = p;
	                    p = p.nextZ;
	                    pSize--;
	                } else {
	                    e = q;
	                    q = q.nextZ;
	                    qSize--;
	                }

	                if (tail) tail.nextZ = e;
	                else list = e;

	                e.prevZ = tail;
	                tail = e;
	            }

	            p = q;
	        }

	        tail.nextZ = null;
	        inSize *= 2;

	    } while (numMerges > 1);

	    return list;
	}

	// z-order of a point given coords and inverse of the longer side of data bbox
	function zOrder(x, y, minX, minY, invSize) {
	    // coords are transformed into non-negative 15-bit integer range
	    x = (x - minX) * invSize | 0;
	    y = (y - minY) * invSize | 0;

	    x = (x | (x << 8)) & 0x00FF00FF;
	    x = (x | (x << 4)) & 0x0F0F0F0F;
	    x = (x | (x << 2)) & 0x33333333;
	    x = (x | (x << 1)) & 0x55555555;

	    y = (y | (y << 8)) & 0x00FF00FF;
	    y = (y | (y << 4)) & 0x0F0F0F0F;
	    y = (y | (y << 2)) & 0x33333333;
	    y = (y | (y << 1)) & 0x55555555;

	    return x | (y << 1);
	}

	// find the leftmost node of a polygon ring
	function getLeftmost(start) {
	    var p = start,
	        leftmost = start;
	    do {
	        if (p.x < leftmost.x || (p.x === leftmost.x && p.y < leftmost.y)) leftmost = p;
	        p = p.next;
	    } while (p !== start);

	    return leftmost;
	}

	// check if a point lies within a convex triangle
	function pointInTriangle(ax, ay, bx, by, cx, cy, px, py) {
	    return (cx - px) * (ay - py) >= (ax - px) * (cy - py) &&
	           (ax - px) * (by - py) >= (bx - px) * (ay - py) &&
	           (bx - px) * (cy - py) >= (cx - px) * (by - py);
	}

	// check if a diagonal between two polygon nodes is valid (lies in polygon interior)
	function isValidDiagonal(a, b) {
	    return a.next.i !== b.i && a.prev.i !== b.i && !intersectsPolygon(a, b) && // dones't intersect other edges
	           (locallyInside(a, b) && locallyInside(b, a) && middleInside(a, b) && // locally visible
	            (area(a.prev, a, b.prev) || area(a, b.prev, b)) || // does not create opposite-facing sectors
	            equals(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0); // special zero-length case
	}

	// signed area of a triangle
	function area(p, q, r) {
	    return (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
	}

	// check if two points are equal
	function equals(p1, p2) {
	    return p1.x === p2.x && p1.y === p2.y;
	}

	// check if two segments intersect
	function intersects(p1, q1, p2, q2) {
	    var o1 = sign(area(p1, q1, p2));
	    var o2 = sign(area(p1, q1, q2));
	    var o3 = sign(area(p2, q2, p1));
	    var o4 = sign(area(p2, q2, q1));

	    if (o1 !== o2 && o3 !== o4) return true; // general case

	    if (o1 === 0 && onSegment(p1, p2, q1)) return true; // p1, q1 and p2 are collinear and p2 lies on p1q1
	    if (o2 === 0 && onSegment(p1, q2, q1)) return true; // p1, q1 and q2 are collinear and q2 lies on p1q1
	    if (o3 === 0 && onSegment(p2, p1, q2)) return true; // p2, q2 and p1 are collinear and p1 lies on p2q2
	    if (o4 === 0 && onSegment(p2, q1, q2)) return true; // p2, q2 and q1 are collinear and q1 lies on p2q2

	    return false;
	}

	// for collinear points p, q, r, check if point q lies on segment pr
	function onSegment(p, q, r) {
	    return q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
	}

	function sign(num) {
	    return num > 0 ? 1 : num < 0 ? -1 : 0;
	}

	// check if a polygon diagonal intersects any polygon segments
	function intersectsPolygon(a, b) {
	    var p = a;
	    do {
	        if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i &&
	                intersects(p, p.next, a, b)) return true;
	        p = p.next;
	    } while (p !== a);

	    return false;
	}

	// check if a polygon diagonal is locally inside the polygon
	function locallyInside(a, b) {
	    return area(a.prev, a, a.next) < 0 ?
	        area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 :
	        area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
	}

	// check if the middle point of a polygon diagonal is inside the polygon
	function middleInside(a, b) {
	    var p = a,
	        inside = false,
	        px = (a.x + b.x) / 2,
	        py = (a.y + b.y) / 2;
	    do {
	        if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y &&
	                (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x))
	            inside = !inside;
	        p = p.next;
	    } while (p !== a);

	    return inside;
	}

	// link two polygon vertices with a bridge; if the vertices belong to the same ring, it splits polygon into two;
	// if one belongs to the outer ring and another to a hole, it merges it into a single ring
	function splitPolygon(a, b) {
	    var a2 = new Node(a.i, a.x, a.y),
	        b2 = new Node(b.i, b.x, b.y),
	        an = a.next,
	        bp = b.prev;

	    a.next = b;
	    b.prev = a;

	    a2.next = an;
	    an.prev = a2;

	    b2.next = a2;
	    a2.prev = b2;

	    bp.next = b2;
	    b2.prev = bp;

	    return b2;
	}

	// create a node and optionally link it with previous one (in a circular doubly linked list)
	function insertNode(i, x, y, last) {
	    var p = new Node(i, x, y);

	    if (!last) {
	        p.prev = p;
	        p.next = p;

	    } else {
	        p.next = last.next;
	        p.prev = last;
	        last.next.prev = p;
	        last.next = p;
	    }
	    return p;
	}

	function removeNode(p) {
	    p.next.prev = p.prev;
	    p.prev.next = p.next;

	    if (p.prevZ) p.prevZ.nextZ = p.nextZ;
	    if (p.nextZ) p.nextZ.prevZ = p.prevZ;
	}

	function Node(i, x, y) {
	    // vertex index in coordinates array
	    this.i = i;

	    // vertex coordinates
	    this.x = x;
	    this.y = y;

	    // previous and next vertex nodes in a polygon ring
	    this.prev = null;
	    this.next = null;

	    // z-order curve value
	    this.z = 0;

	    // previous and next nodes in z-order
	    this.prevZ = null;
	    this.nextZ = null;

	    // indicates whether this is a steiner point
	    this.steiner = false;
	}

	// return a percentage difference between the polygon area and its triangulation area;
	// used to verify correctness of triangulation
	earcut.deviation = function (data, holeIndices, dim, triangles) {
	    var hasHoles = holeIndices && holeIndices.length;
	    var outerLen = hasHoles ? holeIndices[0] * dim : data.length;

	    var polygonArea = Math.abs(signedArea(data, 0, outerLen, dim));
	    if (hasHoles) {
	        for (var i = 0, len = holeIndices.length; i < len; i++) {
	            var start = holeIndices[i] * dim;
	            var end = i < len - 1 ? holeIndices[i + 1] * dim : data.length;
	            polygonArea -= Math.abs(signedArea(data, start, end, dim));
	        }
	    }

	    var trianglesArea = 0;
	    for (i = 0; i < triangles.length; i += 3) {
	        var a = triangles[i] * dim;
	        var b = triangles[i + 1] * dim;
	        var c = triangles[i + 2] * dim;
	        trianglesArea += Math.abs(
	            (data[a] - data[c]) * (data[b + 1] - data[a + 1]) -
	            (data[a] - data[b]) * (data[c + 1] - data[a + 1]));
	    }

	    return polygonArea === 0 && trianglesArea === 0 ? 0 :
	        Math.abs((trianglesArea - polygonArea) / polygonArea);
	};

	function signedArea(data, start, end, dim) {
	    var sum = 0;
	    for (var i = start, j = end - dim; i < end; i += dim) {
	        sum += (data[j] - data[i]) * (data[i + 1] + data[j + 1]);
	        j = i;
	    }
	    return sum;
	}

	// turn a polygon in a multi-dimensional array form (e.g. as in GeoJSON) into a form Earcut accepts
	earcut.flatten = function (data) {
	    var dim = data[0][0].length,
	        result = {vertices: [], holes: [], dimensions: dim},
	        holeIndex = 0;

	    for (var i = 0; i < data.length; i++) {
	        for (var j = 0; j < data[i].length; j++) {
	            for (var d = 0; d < dim; d++) result.vertices.push(data[i][j][d]);
	        }
	        if (i > 0) {
	            holeIndex += data[i - 1].length;
	            result.holes.push(holeIndex);
	        }
	    }
	    return result;
	};
	earcut_1.default = default_1;

	var trianglution = createCommonjsModule(function (module, exports) {

	var __assign = commonjsGlobal && commonjsGlobal.__assign || function () {
	  __assign = Object.assign || function (t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	      s = arguments[i];

	      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	    }

	    return t;
	  };

	  return __assign.apply(this, arguments);
	};

	var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from, pack) {
	  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	    if (ar || !(i in from)) {
	      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	      ar[i] = from[i];
	    }
	  }
	  return to.concat(ar || Array.prototype.slice.call(from));
	};

	var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
	  return mod && mod.__esModule ? mod : {
	    "default": mod
	  };
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.triangulation = exports.AxisPlane = void 0;

	var earcut_1$1 = __importDefault(earcut_1);









	var vector_1$1 = __importDefault(vector_1);

	var AxisPlane;

	(function (AxisPlane) {
	  AxisPlane["XY"] = "xy";
	  AxisPlane["XZ"] = "xz";
	  AxisPlane["YZ"] = "yz";
	  AxisPlane["XYZ"] = "xyz";
	})(AxisPlane = exports.AxisPlane || (exports.AxisPlane = {}));
	/**
	 * 三角剖分  earcut.js
	 * @param {Array} boundary 边界
	 * @param {Array<Array>} holes 洞的数组
	 * @param {options:{feature,dim,normal}} feature 选择平平面
	 * @returns {Array<Number>} 三角形索引数组
	 */


	function triangulation(inboundary, holes, options) {
	  if (holes === void 0) {
	    holes = [];
	  }

	  if (options === void 0) {
	    options = {
	      normal: Vec3_1.Vec3.UnitZ
	    };
	  }

	  options = __assign({
	    feature: AxisPlane.XYZ,
	    dim: 3
	  }, options);
	  if (options.feature !== AxisPlane.XYZ) options.dim = 2;
	  var boundary = null;
	  var feature = options.feature;
	  var dim = options.dim;
	  var normal = options.normal;

	  if (normal && normal.dot(Vec3_1.Vec3.UnitZ) < 1 - _Math.delta4) {
	    boundary = (0, common.clone)(inboundary);
	    (0, common.rotateByUnitVectors)(boundary, normal, Vec3_1.Vec3.UnitZ);
	  } else {
	    boundary = inboundary;
	  }

	  var allV = __spreadArray(__spreadArray([], boundary, true), (0, array.flat)(holes), true);

	  var vertextNumbers = vector_1$1.default.verctorToNumbers(allV, feature);
	  var holesIndex = [];
	  var baseIndex = boundary.length;

	  for (var i = -1; i < holes.length - 1; i++) {
	    holesIndex.push(baseIndex);
	    var hole = holes[i + 1]; // holesIndex.push(baseIndex + hole.length);

	    baseIndex += hole.length;
	  }

	  var result = (0, earcut_1$1.default)(vertextNumbers, holesIndex, dim);
	  return result;
	}

	exports.triangulation = triangulation;
	});

	unwrapExports(trianglution);
	var trianglution_1 = trianglution.triangulation;
	var trianglution_2 = trianglution.AxisPlane;

	var mesh = createCommonjsModule(function (module, exports) {

	var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from, pack) {
	  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	    if (ar || !(i in from)) {
	      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	      ar[i] = from[i];
	    }
	  }
	  return to.concat(ar || Array.prototype.slice.call(from));
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.trianglutionToGeometryBuffer = exports.toGeoBuffer = exports.triangListToBuffer = exports.indexable = void 0;
	/*
	 * @Description  :
	 * @Author       : 赵耀圣
	 * @Q群           : 632839661
	 * @Date         : 2020-12-10 15:01:42
	 * @LastEditTime : 2021-03-11 09:09:57
	 * @FilePath     : \cga.js\src\render\mesh.ts
	 */









	function indexable(obj, refIndexInfo, force) {
	  if (refIndexInfo === void 0) {
	    refIndexInfo = {
	      index: 0
	    };
	  }

	  if (force === void 0) {
	    force = false;
	  }

	  if (obj instanceof Array) {
	    for (var i = 0; i < obj.length; i++) indexable(obj[i], refIndexInfo);
	  } else if (obj instanceof Object) {
	    if (obj.index === undefined) obj.index = refIndexInfo.index++;else if (force) obj.index = refIndexInfo.index++;
	  }
	}

	exports.indexable = indexable;

	function triangListToBuffer(vertices, triangleList) {
	  indexable(triangleList);
	  var indices = [];
	  (0, array.forall)(triangleList, function (v) {
	    indices.push(v.index);
	  });
	  return toGeoBuffer(vertices, indices);
	}

	exports.triangListToBuffer = triangListToBuffer;
	/**
	 * 顶点纹理坐标所以转化为buffer数据
	 * @param {Array<Verctor3|Number>} vertices
	 * @param {Array<Number>} indices
	 * @param {Array<Verctor2|Number>} uvs
	 */

	function toGeoBuffer(vertices, indices, uvs) {
	  var geometry$1 = new geometry.BufferGeometry();
	  geometry$1.addAttribute('position', vertices, 3);
	  geometry$1.addAttribute('uv', uvs || new Float32Array(geometry$1.getAttribute('position').array.length / 3 * 2), 2);
	  geometry$1.setIndex(indices);
	  return geometry$1;
	}

	exports.toGeoBuffer = toGeoBuffer;
	/**
	 * 三角剖分后转成几何体
	 * 只考虑XY平面
	 * @param {*} boundary
	 * @param {*} hole
	 * @param {*} options
	 */

	function trianglutionToGeometryBuffer(boundary, holes, options) {
	  if (holes === void 0) {
	    holes = [];
	  }

	  if (options === void 0) {
	    options = {
	      normal: Vec3_1.Vec3.UnitZ
	    };
	  }

	  var triangles = (0, trianglution.triangulation)(boundary, holes, options);

	  var vertices = __spreadArray(__spreadArray([], boundary, true), (0, array.flat)(holes), true);

	  var uvs = [];
	  vertices.forEach(function (v) {
	    uvs.push(v.x, v.z);
	  });
	  var geometry = toGeoBuffer(vertices, triangles, uvs);
	  return geometry;
	}

	exports.trianglutionToGeometryBuffer = trianglutionToGeometryBuffer;
	});

	unwrapExports(mesh);
	var mesh_1 = mesh.trianglutionToGeometryBuffer;
	var mesh_2 = mesh.toGeoBuffer;
	var mesh_3 = mesh.triangListToBuffer;
	var mesh_4 = mesh.indexable;

	var Plane_1 = createCommonjsModule(function (module, exports) {

	var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from, pack) {
	  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	    if (ar || !(i in from)) {
	      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	      ar[i] = from[i];
	    }
	  }
	  return to.concat(ar || Array.prototype.slice.call(from));
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Plane = void 0;
	/*
	 * @Description  :
	 * @Author       : 赵耀圣
	 * @Q群           : 632839661
	 * @Date         : 2020-12-10 15:01:42
	 * @LastEditTime : 2021-03-12 10:13:55
	 * @FilePath     : \cga.js\src\struct\3d\Plane.ts
	 */









	var Plane =
	/** @class */
	function () {
	  function Plane(normal, w) {
	    if (normal === void 0) {
	      normal = Vec3_1.Vec3.UnitZ;
	    }

	    if (w === void 0) {
	      w = 0;
	    }

	    this.normal = normal;
	    this.w = w;
	    this.origin = this.normal.clone().multiplyScalar(w); // this.w = this.normal.dot(this.origin)
	  }

	  Plane.setFromPointNormal = function (p, normal) {
	    var plane = new Plane();
	    plane.setFromPointNormal(p, normal);
	    return plane;
	  };

	  Plane.prototype.setFromPointNormal = function (p, normal) {
	    this.normal = normal;
	    this.w = -p.dot(normal);
	  };

	  Plane.prototype.set = function (normal, w) {
	    this.normal = normal;
	    this.w = w;
	  };

	  Plane.prototype.setComponents = function (x, y, z, w) {
	    this.normal.set(x, y, z);
	    this.w = w;
	    return this;
	  };

	  Plane.prototype.normalize = function () {
	    var inverseNormalLength = 1.0 / this.normal.length();
	    this.normal.multiplyScalar(inverseNormalLength);
	    this.w *= inverseNormalLength;
	    return this;
	  };

	  Plane.prototype.setFromThreePoint = function (p0, p1, p2) {
	    this.normal = p1.clone().sub(p0).cross(p2.clone().sub(p0)).normalize();
	    this.w = -p0.dot(this.normal);
	  };

	  Plane.prototype.negate = function () {
	    this.w *= -1;
	    this.normal.negate();
	  };
	  /**
	   * 判断一个点在平面的正面或者反面
	   * @param  {Vec3} point
	   * @returns {Number} -1 or 1 or z
	   */


	  Plane.prototype.frontback = function (point) {
	    var value = this.normal.dot(point);
	    if ((0, _Math.approximateEqual)(value, 0)) return 0;
	    return (0, _Math.sign)(this.normal.dot(point));
	  }; //---Distance-------------------------------------------------------------------------------


	  Plane.prototype.distancePoint = function (point) {
	    return this.normal.dot(point) + this.w;
	  };

	  Plane.prototype.distanceRay = function (ray) {};

	  Plane.prototype.distanceLine = function (line) {};

	  Plane.prototype.distanceSegment = function (segment) {};

	  Plane.prototype.distancePlane = function (plane) {}; //---Intersect-----------------------------------

	  /**
	   * 只返回交点
	   * Lw --Lightweight
	   * @param {Segment|Array<Vec3> segment
	   */


	  Plane.prototype.intersectSegmentLw = function (segment) {
	    var orientation0 = this.orientationPoint(segment[0]);
	    var orientation1 = this.orientationPoint(segment[0]);
	    var orientation = orientation0 | orientation1;
	    if (orientation === type.Orientation.Common) return segment;

	    if (orientation === type.Orientation.Intersect) {
	      var dist = segment[0].clone().sub(this.origin).dot(this.normal);
	      var intersectPoint = this.normal.clone().multiplyScalar(dist).add(segment[0]);
	      return intersectPoint;
	    }

	    return null;
	  };

	  Plane.prototype.intersectLine = function (line, result) {
	    return line.intersectPlane(this, result);
	  };
	  /**
	     * 切割线段 代码完成  等待测试
	     * @param {Segment} segment
	     * @returns {
	        *       positive: [], //正面点
	        *       negative: [],// 反面位置点
	        *       common: [], 在平面上的点
	        *       orientation: Orientation.None 线段的总体位置
	        *   };
	        */


	  Plane.prototype.splitSegment = function (segment) {
	    var result = {
	      positive: [],
	      negative: [],
	      common: [],
	      orientation: type.Orientation.None
	    };
	    var orientation0 = this.orientationPoint(segment[0]);
	    var orientation1 = this.orientationPoint(segment[1]);
	    var orientation = orientation0 | orientation1;
	    result.orientation = orientation;
	    if (orientation0 === type.Orientation.Positive) result.positive.push(segment[0]);else if (orientation0 === type.Orientation.Negative) result.negative.push(segment[0]);else result.common.push(segment[0]);
	    if (orientation1 === type.Orientation.Positive) result.positive.push(segment[1]);else if (orientation1 === type.Orientation.Negative) result.negative.push(segment[1]);else result.common.push(segment[1]);

	    if (orientation === type.Orientation.Intersect) {
	      var dist = segment[0].clone().sub(this.origin).dot(this.normal);
	      var intersectPoint = this.normal.clone().multiplyScalar(dist).add(segment[0]);
	      result.positive.push(intersectPoint);
	      result.negative.push(intersectPoint);
	      result.intersectPoint = intersectPoint;
	    }

	    return result;
	  };
	  /**
	   * 切割三角形 编码完成  等待测试
	   * @param {Triangle} triangle
	   */


	  Plane.prototype.splitTriangle = function (triangle) {
	    var _a, _b, _c;

	    var result = {
	      negative: [],
	      positive: [],
	      common: [],
	      orientation: type.Orientation.None
	    };
	    var scope = this;
	    var orientations = triangle.map(function (p) {
	      return scope.orientationPoint(p);
	    });
	    var pos = 0;
	    var neg = 0;

	    for (var i_1 = 0; i_1 < triangle.length; i_1++) {
	      var orientation = orientations[i_1];
	      if (orientation === type.Orientation.Positive) pos++;else if (orientation === type.Orientation.Negative) neg++;
	    }
	    var hasFront = pos > 0;
	    var hasBack = neg > 0;
	    var negTris = result.positive,
	        posTris = result.negative;

	    if (hasBack && !hasFront) {
	      //反面
	      result.orientation = type.Orientation.Negative;

	      (_a = result.negative).push.apply(_a, triangle);
	    } else if (!hasBack && hasFront) {
	      //正面 
	      result.orientation = type.Orientation.Positive;

	      (_b = result.positive).push.apply(_b, triangle);
	    } else if (hasFront && hasBack) {
	      //相交 共面点最多只有一个
	      result.orientation = type.Orientation.Intersect;

	      for (var i = 0; i < 3; i++) {
	        if (orientations[i] || orientations[(i + 1) % 3] === type.Orientation.Intersect) {
	          if (orientations[i] === type.Orientation.Positive) {
	            posTris.push(triangle[i]);
	          } else if (orientations[i] == type.Orientation.Negative) {
	            negTris.push(triangle[i]);
	          } else {
	            negTris.push(triangle[i]);
	            posTris.push(triangle[i]);
	            result.common.push(triangle[i]);
	          }

	          var intersectPoint = this.intersectSegmentLw([triangle[i], triangle[(i + 1) % 3]]);

	          if (intersectPoint) {
	            if (!Array.isArray(intersectPoint)) result.common.push(intersectPoint);
	          }
	        }
	      }
	    } else {
	      // 三点共面
	      result.orientation = type.Orientation.Common;

	      (_c = result.common).push.apply(_c, triangle);
	    }

	    return result;
	  };
	  /**
	   * 平面切割线段
	   * @param polyVS
	   */


	  Plane.prototype.splitPolyVS = function (polyVS) {
	    polyVS = __spreadArray([], polyVS, true);
	    (0, mesh.indexable)(polyVS);

	    var jdp0; //找出第一个交点 

	    var lastOriention = this.orientationPoint(polyVS[0]);

	    for (var i = 0; i < polyVS.length - 1; i++) {
	      var v = polyVS[i];
	      var oriention = this.orientationPoint(v);

	      if (oriention === type.Orientation.Common || lastOriention !== type.Orientation.None && lastOriention !== oriention) {
	        jdp0 = v.clone();
	        lastOriention = oriention;
	        break;
	      }

	      lastOriention = oriention; //TODO
	    }
	  }; //---orientation------------------------------

	  /**
	   * 点在平面的位置判断
	   * @param {Point} point
	   * @returns {Orientation} 方位
	   */


	  Plane.prototype.orientationPoint = function (point) {
	    var signDistance = this.normal.clone().dot(point) + this.w;
	    if (Math.abs(signDistance) < _Math.delta4) return type.Orientation.Intersect;else if (signDistance < 0) return type.Orientation.Negative;else
	      /* if (signDistance > 0) */
	      return type.Orientation.Positive;
	  }; //静态API

	  /**
	   * @description : 平面分割几何体
	   * @param        {Plane} plane
	   * @param        {IGeometry} geometry
	   * @return       {IGeometry[]} 返回多个几何体
	   * @example     :
	   */


	  Plane.splitGeometry = function (plane, geometry) {
	    var indices = geometry.index;
	    var positions = geometry.position;

	    for (var i = 0; i < indices.length; i += 3) {
	      var index_a = indices[i * 3] * 3;
	      var index_b = indices[i * 3 + 1] * 3;
	      var index_c = indices[i * 3 + 2] * 3;

	      _v1.set(positions[index_a], positions[index_a + 1], positions[index_a + 2]);

	      _v2.set(positions[index_b], positions[index_b + 1], positions[index_b + 2]);

	      _v3.set(positions[index_c], positions[index_c + 1], positions[index_c + 2]);

	      var data = plane.splitTriangle(_tris);

	      if (data.common.length > 0) ;

	      if (data.negative.length > 0) ;

	      if (data.positive.length > 0) ;
	    }
	  };

	  return Plane;
	}();

	exports.Plane = Plane;

	var _v1 = new Vec3_1.Vec3();

	var _v2 = new Vec3_1.Vec3();

	var _v3 = new Vec3_1.Vec3();

	var _tris = [_v1, _v2, _v3];
	});

	unwrapExports(Plane_1);
	var Plane_2 = Plane_1.Plane;

	var common = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.angle = exports.calcCircleFromThreePoint = exports.pointsCollinear = exports.isInOnePlane = exports.recognitionPlane = exports.projectOnPlane = exports.reverseOnPlane = exports.simplifyPointList = exports.applyMatrix4 = exports.scale = exports.rotateByUnitVectors = exports.rotate = exports.translate = exports.applyQuat = exports.boundingBox = exports.vectorCompare = exports.clone = void 0;















	var XYZSort = function (e1, e2) {
	  if (e1.x !== e2.x) return e1.x - e2.x;else if (e1.y !== e2.y) return e1.y - e2.y;else return e1.z - e2.z;
	};

	var _vector = (0, Vec3_1.v3)();
	/**
	 * 数组深度复制
	 * @param {Array} array
	 */


	function clone(array) {
	  if (!(0, types.isDefined)(array)) return array;

	  if (Array.isArray(array)) {
	    var result = new Array();

	    for (var i = 0; i < array.length; i++) {
	      result[i] = clone(array[i]);
	    }

	    return result;
	  } else {
	    if (array.clone) return array.clone();else return array;
	  }
	}

	exports.clone = clone;
	/**
	 * 点排序函数 xyz 有序排序回调
	 * @param {Vector*} a
	 * @param {Vector*} b
	 */

	function vectorCompare(a, b) {
	  if (a.x === b.x) {
	    if (a.z !== undefined && a.y === b.y) return a.z - b.z;else return a.y - b.y;
	  } else return a.x - b.x;
	}

	exports.vectorCompare = vectorCompare;
	/**
	 * 计算包围盒
	 * @param {*} points  点集
	 * @returns {Array[min,max]} 返回最小最大值
	 */

	function boundingBox(points) {
	  var min = new Vec3_1.Vec3(+Infinity, +Infinity, +Infinity);
	  var max = new Vec3_1.Vec3(-Infinity, -Infinity, -Infinity);

	  for (var i = 0; i < points.length; i++) {
	    min.min(points[i]);
	    max.max(points[i]);
	  }

	  return [min, max];
	}

	exports.boundingBox = boundingBox;
	/**
	 *
	 * @param {*} points
	 * @param {*} Quat
	 * @param {Boolean} ref 是否是引用
	 */

	function applyQuat(points, Quat, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  if (ref) {
	    points.flat(Infinity).forEach(function (point) {
	      point.applyQuat(Quat);
	    });
	    return points;
	  }

	  return applyQuat(clone(points), Quat);
	}

	exports.applyQuat = applyQuat;
	/**
	 * 平移
	 * @param {*} points
	 * @param {*} distance
	 * @param {*} ref
	 */

	function translate(points, distance, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  if (ref) {
	    points.flat(Infinity).forEach(function (point) {
	      point.add(distance);
	    });
	    return points;
	  }

	  return translate(clone(points), distance);
	}

	exports.translate = translate;
	/**
	 * 旋转
	 * @param {*} points
	 * @param {*} axis
	 * @param {*} angle
	 * @param {*} ref
	 */

	function rotate(points, axis, angle, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  return applyQuat(points, new Quat_1.Quat().setFromAxisAngle(axis, angle), ref);
	}

	exports.rotate = rotate;
	/**
	 * 两个向量之间存在的旋转量来旋转点集
	 * @param {*} points
	 * @param {*} axis
	 * @param {*} angle
	 * @param {*} ref
	 */

	function rotateByUnitVectors(points, vFrom, vTo, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  return applyQuat(points, new Quat_1.Quat().setFromUnitVecs(vFrom, vTo), ref);
	}

	exports.rotateByUnitVectors = rotateByUnitVectors;
	/**
	 * 缩放
	 * @param {*} points
	 * @param {*} axis
	 * @param {*} angle
	 * @param {*} ref
	 */

	function scale(points, _scale, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  if (ref) {
	    points.flat(Infinity).forEach(function (point) {
	      point.multiply(_scale);
	    });
	    return points;
	  }

	  return scale(clone(points), _scale);
	}

	exports.scale = scale;
	/**
	 * 响应矩阵
	 * @param {*} points
	 * @param {*} axis
	 * @param {*} angle
	 * @param {*} ref
	 */

	function applyMatrix4(points, matrix, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  if (ref) {
	    points.flat(Infinity).forEach(function (point) {
	      point.applyMatrix4(matrix);
	    });
	    return points;
	  }

	  return applyMatrix4(clone(points), matrix);
	}

	exports.applyMatrix4 = applyMatrix4;
	/**
	 * 简化点集数组，折线，路径
	 * @param {*} points 点集数组，折线，路径 ,继承Array
	 * @param {*} maxDistance  简化最大距离
	 * @param {*} maxAngle  简化最大角度
	 */

	function simplifyPointList(points, maxDistance, maxAngle) {
	  if (maxDistance === void 0) {
	    maxDistance = 0.1;
	  }

	  if (maxAngle === void 0) {
	    maxAngle = Math.PI / 180 * 5;
	  }

	  for (var i = 0; i < points.length; i++) {
	    // 删除小距离
	    var P = points[i];
	    var nextP = points[i + 1];

	    if (P.distanceTo(nextP) < maxDistance) {
	      if (i === 0) points.remove(i + 1, 1);else if (i === points.length - 2) points.splice(i, 1);else {
	        points.splice(i, 2, P.clone().add(nextP).multiplyScalar(0.5));
	      }
	      i--;
	    }
	  }

	  for (var i = 1; i < points.length - 1; i++) {
	    // 删除小小角度
	    var preP = points[i - 1];
	    var P = points[i];
	    var nextP = points[i + 1];

	    if (Math.acos(P.clone().sub(preP).normalize().dot(nextP.clone().sub(P).normalize())) < maxAngle) {
	      points.splice(i, 1);
	      i--;
	    }
	  }

	  return points;
	}

	exports.simplifyPointList = simplifyPointList;
	/**
	 * 以某个平面生成对称镜像
	 * @param {*} points  点集
	 * @param {*} plane 对称镜像平面
	 */

	function reverseOnPlane(points, plane) {}

	exports.reverseOnPlane = reverseOnPlane;
	/**
	 * 投影到平面
	 * @param {*} points 点集
	 * @param {*} plane  投影平面
	 * @param {*} projectDirect  默认是法线的方向
	 */

	function projectOnPlane(points, plane, projectDirect) {
	  return points;
	}

	exports.projectOnPlane = projectOnPlane;
	/**
	 * 计算共面点集所在的平面
	 * @param {Array<Vec3|Point>} points
	 */

	function recognitionPlane(points) {
	  points.sort(vectorCompare);
	  var line = new Line_1.Line(points[0], points.get(-1));
	  var maxDistance = -Infinity;
	  var ipos = -1;

	  for (var i = 1; i < points.length - 1; i++) {
	    var pt = points[i];
	    var distance = line.distancePoint(pt).distance;

	    if (distance > maxDistance) {
	      maxDistance = distance;
	      ipos = i;
	    }
	  }

	  var plane = new Plane_1.Plane();
	  plane.setFromThreePoint(points[0], points.get(-1), points[ipos]);
	  return plane;
	}

	exports.recognitionPlane = recognitionPlane;
	/**
	 * 判断所有点是否在同一个平面
	 * @param {Array<Vec3|Point>} points
	 * @param {*} precision
	 * @returns {Boolean|Plane} 如果在同一个平面返回所在平面，否则返回false
	 */

	function isInOnePlane(points, precision) {
	  if (precision === void 0) {
	    precision = _Math.delta4;
	  }

	  var plane = recognitionPlane(points);

	  for (var i = 0; i < points.length; i++) {
	    var pt = points[i];
	    if (plane.distancePoint(pt) >= precision) return false;
	  }

	  return plane;
	}

	exports.isInOnePlane = isInOnePlane;
	/**
	 * 判断多边是否共线:
	 * 考虑情况点之间的距离应该大于最小容忍值
	 * @param  {...Vec3[]} ps
	 */

	function pointsCollinear() {
	  var ps = [];

	  for (var _i = 0; _i < arguments.length; _i++) {
	    ps[_i] = arguments[_i];
	  }

	  ps.sort(XYZSort);
	  var sedir = ps[ps.length - 1].clone().sub(ps[0]);
	  var selen = ps[ps.length - 1].distanceTo(ps[0]);

	  for (var i = 1; i < ps.length - 1; i++) {
	    var ilens = ps[i].distanceTo(ps[0]);
	    var ilene = ps[i].distanceTo(ps[ps.length - 1]);

	    if (ilens < ilene) {
	      if (Math.abs(ps[i].clone().sub(ps[0]).dot(sedir) - selen * ilens) > _Math.delta4) return false;
	    } else {
	      if (Math.abs(ps[i].clone().sub(ps[ps.length - 1]).dot(sedir) - selen * ilene) > _Math.delta4) return false;
	    }
	  }

	  return true;
	}

	exports.pointsCollinear = pointsCollinear;
	/**
	 * 三点计算圆
	 * @param p0
	 * @param p1
	 * @param p2
	 */

	function calcCircleFromThreePoint(p0, p1, p2) {
	  return new Circle_1.Circle().setFrom3Points(p0, p1, p2);
	}

	exports.calcCircleFromThreePoint = calcCircleFromThreePoint;

	function angle(v0, v1, normal) {
	  return v0.angleTo(v1, normal);
	}

	exports.angle = angle;
	});

	unwrapExports(common);
	var common_1 = common.angle;
	var common_2 = common.calcCircleFromThreePoint;
	var common_3 = common.pointsCollinear;
	var common_4 = common.isInOnePlane;
	var common_5 = common.recognitionPlane;
	var common_6 = common.projectOnPlane;
	var common_7 = common.reverseOnPlane;
	var common_8 = common.simplifyPointList;
	var common_9 = common.applyMatrix4;
	var common_10 = common.scale;
	var common_11 = common.rotateByUnitVectors;
	var common_12 = common.rotate;
	var common_13 = common.translate;
	var common_14 = common.applyQuat;
	var common_15 = common.boundingBox;
	var common_16 = common.vectorCompare;
	var common_17 = common.clone;

	var ArrayList_1 = createCommonjsModule(function (module, exports) {

	var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from, pack) {
	  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	    if (ar || !(i in from)) {
	      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	      ar[i] = from[i];
	    }
	  }
	  return to.concat(ar || Array.prototype.slice.call(from));
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ArrayList = void 0;

	 // TMaterial extends Material | Material[] = Material | Material[],


	var ArrayList =
	/** @class */
	function () {
	  function ArrayList(data) {
	    var _this = this;

	    this.isArrayList = true;
	    this._array = new Array();
	    if (Array.isArray(data)) data.forEach(function (v, i) {
	      v.i = i;

	      _this._array.push(v);
	    });else if (data.isArrayList === true) (data === null || data === void 0 ? void 0 : data._array).forEach(function (v, i) {
	      v.i = i;

	      _this._array.push(v);
	    });
	  }

	  Object.defineProperty(ArrayList.prototype, "array", {
	    get: function () {
	      return this._array;
	    },
	    set: function (val) {
	      this._array = val;
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(ArrayList.prototype, "length", {
	    get: function () {
	      return this._array.length;
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(ArrayList.prototype, "last", {
	    get: function () {
	      return this.get(-1);
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(ArrayList.prototype, "first", {
	    get: function () {
	      return this._array[0];
	    },
	    enumerable: false,
	    configurable: true
	  });

	  ArrayList.prototype.map = function (callbackfn) {
	    return this._array.map(callbackfn);
	  };

	  ArrayList.prototype.push = function () {
	    var _a;

	    var values = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      values[_i] = arguments[_i];
	    }

	    (_a = this._array).push.apply(_a, values);
	  };

	  ArrayList.prototype.reverse = function () {
	    this._array.reverse();

	    return this;
	  };

	  ArrayList.prototype.pop = function () {
	    return Array.prototype.pop.apply(this._array);
	  };

	  ArrayList.prototype.unshift = function () {
	    var _a;

	    var items = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      items[_i] = arguments[_i];
	    }

	    return (_a = this._array).unshift.apply(_a, items);
	  };

	  ArrayList.prototype.insertAt = function (i) {
	    var _a;

	    var value = [];

	    for (var _i = 1; _i < arguments.length; _i++) {
	      value[_i - 1] = arguments[_i];
	    }

	    (_a = this._array).splice.apply(_a, __spreadArray([i, 0], value, false));
	  };

	  ArrayList.prototype.splice = function (start, deleteCount) {
	    var _a;

	    var items = [];

	    for (var _i = 2; _i < arguments.length; _i++) {
	      items[_i - 2] = arguments[_i];
	    }

	    (_a = this._array).splice.apply(_a, __spreadArray([start, deleteCount], items, false));
	  };

	  ArrayList.prototype.get = function (index) {
	    if (index < 0) index = this._array.length + index;
	    return this._array[index];
	  };
	  /**
	   * 遍历
	   * @param {*} method
	   */


	  ArrayList.prototype.forall = function (method) {
	    for (var i = 0; i < this._array.length; i++) {
	      method(this._array[i]);
	    }
	  };
	  /**
	   * 克隆
	   */


	  ArrayList.prototype.clone = function () {
	    return new this.constructor((0, common.clone)(this._array));
	  };
	  /**
	   * 分类
	   * example:
	   *      var arry = [1,2,3,4,5,6]
	   *      var result = classify(this._array,(a)={return a%2===0})
	   *
	   * @param {Function} classifyMethod  分类方法
	   */


	  ArrayList.prototype.classify = function (classifyMethod) {
	    var result = [];

	    for (var i = 0; i < this._array.length; i++) {
	      for (var j = 0; j < result.length; j++) {
	        if (classifyMethod(this._array[i], result[j][0], result[j])) {
	          result[j].push(this._array[i]);
	        } else {
	          result.push([this._array[i]]);
	        }
	      }
	    }

	    return result;
	  };
	  /**
	   * 去掉重复元素
	   * @param {Function} uniqueMethod  去重复
	   * @param {Function} sortMethod 排序
	   */


	  ArrayList.prototype.unique = function (uniqueMethod, sortMethod) {
	    if (sortMethod) {
	      this._array.sort(sortMethod);

	      for (var i = 0; i < this._array.length; i++) {
	        for (var j = i + 1; j < this._array.length; j++) {
	          if (uniqueMethod(this._array[i], this._array[j]) === true) {
	            this._array.splice(j, 1);

	            j--;
	          } else break;
	        }
	      }

	      return this;
	    }

	    for (var i = 0; i < this._array.length; i++) {
	      for (var j = i + 1; j < this._array.length; j++) {
	        if (uniqueMethod(this._array[i], this._array[j]) === true) {
	          this._array.splice(j, 1);

	          j--;
	        }
	      }
	    }

	    return this;
	  };

	  return ArrayList;
	}();

	exports.ArrayList = ArrayList;
	});

	unwrapExports(ArrayList_1);
	var ArrayList_2 = ArrayList_1.ArrayList;

	var pointset = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.isInOnePlane = exports.recognitionPlane = exports.projectOnPlane = exports.reverseOnPlane = exports.simplifyPointList = exports.applyMat4 = exports.rotateByUnitVecs = exports.rotate = exports.translate = exports.applyQuat = exports.boundingBox = exports.VecCompare = void 0;













	var _Vec = (0, Vec3_1.v3)();
	/**
	 * 点排序函数
	 * @param {Vec*} a
	 * @param {Vec*} b
	 */


	function VecCompare(a, b) {
	  if (a.x === b.x) {
	    if (a.z !== undefined && a.y === b.y) return a.z - b.z;else return a.y - b.y;
	  } else return a.x - b.x;
	}

	exports.VecCompare = VecCompare;
	/**
	 * 计算包围盒
	 * @param {*} points  点集
	 * @returns {Array[min,max]} 返回最小最大值
	 */

	function boundingBox(points) {
	  var min = new Vec3_1.Vec3(+Infinity, +Infinity, +Infinity);
	  var max = new Vec3_1.Vec3(-Infinity, -Infinity, -Infinity);

	  for (var i = 0; i < points.length; i++) {
	    min.min(points[i]);
	    max.max(points[i]);
	  }

	  return [min, max];
	}

	exports.boundingBox = boundingBox;
	/**
	 * 点集响应矩阵
	 * @param {*} points
	 * @param {*} Quat
	 * @param {Boolean} ref 是否是引用
	 */

	function applyQuat(points, quat, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  if (ref) {
	    points.flat(Infinity).forEach(function (point) {
	      point.applyQuat(quat);
	    });
	    return points;
	  }

	  return applyQuat((0, common.clone)(points), quat);
	}

	exports.applyQuat = applyQuat;
	/**
	 * 平移
	 * @param {*} points
	 * @param {*} distance
	 * @param {*} ref
	 */

	function translate(points, distance, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  if (ref) {
	    points.flat(Infinity).forEach(function (point) {
	      point.add(distance);
	    });
	    return points;
	  }

	  return translate((0, common.clone)(points));
	}

	exports.translate = translate;
	/**
	 * 旋转
	 * @param {*} points
	 * @param {*} axis
	 * @param {*} angle
	 * @param {*} ref
	 */

	function rotate(points, axis, angle, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  return applyQuat(points, new Quat_1.Quat().setFromAxisAngle(axis, angle), ref);
	}

	exports.rotate = rotate;
	/**
	 * 两个向量之间存在的旋转量来旋转点集
	 * @param {*} points
	 * @param {*} axis
	 * @param {*} angle
	 * @param {*} ref
	 */

	function rotateByUnitVecs(points, vFrom, vTo, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  return applyQuat(points, new Quat_1.Quat().setFromUnitVecs(vFrom, vTo), ref);
	}

	exports.rotateByUnitVecs = rotateByUnitVecs;
	/**
	 * 响应矩阵
	 * @param {*} points
	 * @param {*} axis
	 * @param {*} angle
	 * @param {*} ref
	 */

	function applyMat4(points, mat4, ref) {
	  if (ref === void 0) {
	    ref = true;
	  }

	  if (ref) {
	    points.flat(Infinity).forEach(function (point) {
	      point.applyMat4(mat4);
	    });
	    return points;
	  }

	  return applyMat4((0, common.clone)(points), mat4);
	}

	exports.applyMat4 = applyMat4;
	/**
	 * 简化点集数组，折线，路径
	 * @param {*} points 点集数组，折线，路径 ,继承Array
	 * @param {*} maxDistance  简化最大距离
	 * @param {*} maxAngle  简化最大角度
	 */

	function simplifyPointList(points, maxDistance, maxAngle) {
	  if (maxDistance === void 0) {
	    maxDistance = 0.1;
	  }

	  if (maxAngle === void 0) {
	    maxAngle = Math.PI / 180 * 5;
	  }

	  for (var i = 0; i < points.length; i++) {
	    // 删除小距离
	    var P = points[i];
	    var nextP = points[i + 1];

	    if (P.distanceTo(nextP) < maxDistance) {
	      if (i === 0) points.remove(i + 1, 1);else if (i === points.length - 2) points.splice(i, 1);else {
	        points.splice(i, 2, P.clone().add(nextP).multiplyScalar(0.5));
	      }
	      i--;
	    }
	  }

	  for (var i = 1; i < points.length - 1; i++) {
	    // 删除小小角度
	    var preP = points[i - 1];
	    var P = points[i];
	    var nextP = points[i + 1];

	    if (Math.acos(P.clone().sub(preP).normalize().dot(nextP.clone().sub(P).normalize())) < maxAngle) {
	      points.splice(i, 1);
	      i--;
	    }
	  }

	  return points;
	}

	exports.simplifyPointList = simplifyPointList;
	/**
	 * 以某个平面生成对称镜像
	 * @param {*} points  点集
	 * @param {*} plane 对称镜像平面
	 */

	function reverseOnPlane(points, plane) {}

	exports.reverseOnPlane = reverseOnPlane;
	/**
	 * 投影到平面
	 * @param {*} points 点集
	 * @param {*} plane  投影平面
	 * @param {*} projectDirect  默认是法线的方向
	 */

	function projectOnPlane(points, plane, projectDirect, ref) {
	  if (projectDirect === void 0) {
	    projectDirect = plane.normal;
	  }

	  if (ref === void 0) {
	    ref = true;
	  }

	  if (ref) {
	    for (var i = 0; i < points.length; i++) {
	      var pt = points[i];
	      pt.projectDirectionOnPlane(plane, projectDirect);
	    }

	    return points;
	  } else {
	    return projectOnPlane((0, common.clone)(points), plane, projectDirect);
	  }
	}

	exports.projectOnPlane = projectOnPlane;
	/**
	 * 计算共面点集所在的平面
	 * @param {Array<Vec3|Point>} points
	 */

	function recognitionPlane(points) {
	  points.sort(VecCompare);
	  var line = new Line_1.Line(points[0], points.get(-1));
	  var maxDistance = -Infinity;
	  var ipos = -1;

	  for (var i = 1; i < points.length - 1; i++) {
	    var pt = points[i];
	    var distance = line.distancePoint(pt).distance;

	    if (distance > maxDistance) {
	      maxDistance = distance;
	      ipos = i;
	    }
	  }

	  var plane = new Plane_1.Plane();
	  plane.setFromThreePoint(points[0], points.get(-1), points[ipos]);
	  return plane;
	}

	exports.recognitionPlane = recognitionPlane;
	/**
	 * 判断所有点是否在同一个平面
	 * @param {Array<Vec3|Point>} points
	 * @param {*} precision
	 * @returns {Boolean|Plane} 如果在同一个平面返回所在平面，否则返回false
	 */

	function isInOnePlane(points, precision) {
	  if (precision === void 0) {
	    precision = _Math.delta4;
	  }

	  var plane = recognitionPlane(points);

	  for (var i = 0; i < points.length; i++) {
	    var pt = points[i];
	    if (plane.distancePoint(pt) >= precision) return false;
	  }

	  return plane;
	}

	exports.isInOnePlane = isInOnePlane; // export function
	});

	unwrapExports(pointset);
	var pointset_1 = pointset.isInOnePlane;
	var pointset_2 = pointset.recognitionPlane;
	var pointset_3 = pointset.projectOnPlane;
	var pointset_4 = pointset.reverseOnPlane;
	var pointset_5 = pointset.simplifyPointList;
	var pointset_6 = pointset.applyMat4;
	var pointset_7 = pointset.rotateByUnitVecs;
	var pointset_8 = pointset.rotate;
	var pointset_9 = pointset.translate;
	var pointset_10 = pointset.applyQuat;
	var pointset_11 = pointset.boundingBox;
	var pointset_12 = pointset.VecCompare;

	var Path_1 = createCommonjsModule(function (module, exports) {
	/*
	 * @Author       : 赵耀圣
	 * @Date         : 2020-12-10 15:01:42
	 * @QQ           : 549184003
	 * @LastEditTime : 2021-09-07 15:40:10
	 * @FilePath     : \cesium-taji-dabaod:\github\cga.js\src\struct\3d\Path.ts
	 */

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Path = void 0;













	var Path =
	/** @class */
	function (_super) {
	  __extends(Path, _super);
	  /**
	   *
	   * @param vs  假定是没有重复的点集
	   * @param closed
	   * @param calcNormal
	   */


	  function Path(vs, closed, calcNormal) {
	    if (closed === void 0) {
	      closed = false;
	    }

	    if (calcNormal === void 0) {
	      calcNormal = false;
	    }

	    var _this = _super.call(this, vs) || this;

	    _this._calcNoraml = false;
	    _this._closed = closed;

	    _this.init(calcNormal);

	    return _this;
	  }

	  Path.prototype.init = function (calcNormal) {
	    if (this.length === 0) return;
	    this.get(0).len = 0;
	    this.get(0).tlen = 0;
	    var end = this.length;

	    for (var i = 0; i < end; i++) {
	      var e = this.get(i);

	      if (i !== 0) {
	        e.len = this.get(i).distanceTo(this.get(i - 1));
	        e.tlen = this.get(i - 1).tlen + e.len;
	      }

	      this.get(i).direction = this.get((i + 1) % this.length).clone().sub(this.get(i)).normalize();
	    }

	    if (!this._closed) {
	      this.get(-1).direction.copy(this.get(-2).direction);
	    }

	    if (calcNormal) {
	      for (var i = 0; i < end; i++) {
	        var d1 = this.get(i - 1).direction;
	        var d2 = this.get(i).direction; // if (Math.abs(d1.dot(d2) - 1) > delta6) {
	        //应该同时考虑长度差        
	        //normal是两条线段所在的平面的法线
	        //bdirection是两条方向线的等分线
	        //TODO

	        var normal = new Vec3_1.Vec3();
	        normal.crossVecs(d1, d2).normalize();
	        this.get(i).normal = normal;
	        var bdir = (0, Vec3_1.v3)().addVecs(d1, d2).normalize();
	        this.get(i).bdirection = bdir;
	        this.get(i).bnormal = (0, Vec3_1.v3)().crossVecs(bdir, normal).normalize(); // }
	      }

	      if (!this._closed) {
	        //不闭合路径 最后一个点没有
	        this.get(-1).bdirection = (0, Vec3_1.v3)();
	        this.get(-1).normal = (0, Vec3_1.v3)();
	        this.get(-1).bnormal = (0, Vec3_1.v3)();
	      }

	      if (!this._closed) {
	        // 不闭合的情况下怎么样去计算端点的up和normal
	        this.get(0).normal.copy(this.get(1).normal);
	        this.get(0).bdirection.copy(this.get(0).direction);
	        var bdir = this.get(0).bdirection;
	        this.get(0).bnormal.crossVecs(bdir, this.get(0).normal);
	        this.get(-1).normal.copy(this.get(-2).normal);
	        this.get(-1).bdirection.copy(this.get(-1).direction);
	        bdir = this.get(-1).bdirection;
	        this.get(-1).bnormal.crossVecs(bdir, this.get(-1).normal).normalize();
	      }
	    }
	  };

	  Object.defineProperty(Path.prototype, "closed", {
	    get: function () {
	      return this._closed;
	    },
	    set: function (val) {
	      this._closed = val;
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Path.prototype, "tlen", {
	    get: function () {
	      if (this.length === 0) return 0;
	      return Math.max(this.get(-1).tlen, this.get(0).tlen);
	    },
	    enumerable: false,
	    configurable: true
	  });

	  Path.prototype.applyMat4 = function (mat4) {
	    (0, pointset.applyMat4)(this._array, mat4);
	  };

	  Path.prototype.scale = function (x, y, z) {
	    (0, common.scale)(this._array, (0, Vec3_1.v3)(x, y, z), true);
	  };
	  /**
	   * 截取一段从from到to的path
	   * @param {Number} from
	   * @param {Number} to
	   */


	  Path.prototype.splitByFromToDistance = function (from, to) {
	    if (from === void 0) {
	      from = 0;
	    }

	    if (to === void 0) {
	      to = 0;
	    }

	    if (to <= from) return null;
	    var newPath = new Path([]);

	    for (var i = 0; i < this.length - 1; i++) {
	      var pt = this.get(i);
	      var ptnext = this.get(i + 1);

	      if (pt.tlen <= from && ptnext.tlen >= from) {
	        var v3 = new Vec3_1.Vec3().lerpVecs(pt, ptnext, (from - pt.tlen) / (ptnext.tlen - pt.tlen));
	        newPath.add(v3);
	      }

	      if (pt.tlen > from && pt.tlen < to) {
	        newPath.add(pt.clone());
	      }

	      if (pt.tlen <= to && ptnext.tlen >= to) {
	        var v3 = new Vec3_1.Vec3().lerpVecs(pt, ptnext, (to - pt.tlen) / (ptnext.tlen - pt.tlen));
	        newPath.add(v3);
	        return newPath;
	      }
	    }

	    return newPath;
	  };
	  /**
	   * 从起点出发到距离等于distance位置  的坐标 二分查找
	   * @param {Number} distance
	   */


	  Path.prototype.getPointByDistance = function (arg_distance, left, right) {
	    if (left === void 0) {
	      left = 0;
	    }

	    if (right === void 0) {
	      right = this.length - 1;
	    }

	    var distance = (0, _Math.clamp)(arg_distance, 0, this.get(-1).tlen);
	    if (distance !== arg_distance) return null;

	    if (right - left === 1) {
	      return {
	        isNode: false,
	        point: new Vec3_1.Vec3().lerpVecs(this.get(left), this.get(right), (distance - this.get(left).tlen) / this.get(right).len),
	        direction: this.get(left).direction
	      };
	    }

	    var mid = left + right >> 1;
	    if (this.get(mid).tlen > distance) return this.getPointByDistance(distance, left, mid);else if (this.get(mid).tlen < distance) return this.getPointByDistance(distance, mid, right);else return {
	      isNode: true,
	      point: new Vec3_1.Vec3().lerpVecs(this.get(left), this.get(right), (distance - this.get(left).tlen) / this.get(right).len),
	      direction: this.get(left).direction
	    };
	  };
	  /**
	   * 从起点出发到距离等于distance位置  的坐标 二分查找
	   * @param {Number} distance
	   */


	  Path.prototype.getPointByDistancePure = function (arg_distance, left, right) {
	    if (left === void 0) {
	      left = 0;
	    }

	    if (right === void 0) {
	      right = this.length - 1;
	    }

	    var distance = (0, _Math.clamp)(arg_distance, 0, this.get(-1).tlen);
	    if (distance !== arg_distance) return null;

	    if (right - left === 1) {
	      return new Vec3_1.Vec3().lerpVecs(this.get(left), this.get(right), (distance - this.get(left).tlen) / this.get(right).len);
	    }

	    var mid = left + right >> 1;
	    if (this.get(mid).tlen > distance) return this.getPointByDistancePure(distance, left, mid);else if (this.get(mid).tlen < distance) return this.getPointByDistancePure(distance, mid, right);else return this.get(mid).clone();
	  };
	  /**
	   * 平均切割为 splitCount 段
	   * @param {Number} splitCount
	   * @returns {Path} 新的path
	   */


	  Path.prototype.splitAverage = function (splitCount) {
	    var tlen = this.last.tlen;
	    var perlen = tlen / splitCount;
	    var res = [];
	    var curJ = 0;

	    for (var i = 0; i <= splitCount; i++) {
	      var plen = i * perlen;

	      for (var j = curJ; j < this.length - 1; j++) {
	        if (this.get(j).tlen <= plen && this.get(j + 1).tlen >= plen) {
	          var p = new Vec3_1.Vec3().lerpVecs(this.get(j), this.get(j + 1), (plen - this.get(j).tlen) / this.get(j + 1).len);
	          res.push(p);
	          curJ = j;
	          break;
	        }
	      }
	    }

	    return new Path(res);
	  };
	  /**
	   * 通过测试
	  * 平均切割为 splitCount 段
	  * @param {Number} splitCount
	  * @param {Boolean} integer 是否取整
	  * @returns {Path} 新的path
	  */


	  Path.prototype.splitAverageLength = function (splitLength, integer) {
	    if (integer === void 0) {
	      integer = true;
	    }

	    var tlen = this.last.tlen;
	    var count = tlen / splitLength;
	    if (integer) count = Math.round(count);
	    return this.splitAverage(count);
	  };
	  /**
	   *
	   * @param  {...any} ps
	   */


	  Path.prototype.add = function () {
	    var ps = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      ps[_i] = arguments[_i];
	    }

	    if (this.length == 0) {
	      var firstpt = ps.shift();
	      this.push(firstpt);
	      this.get(0).len = 0;
	      this.get(0).tlen = 0;
	    }

	    for (var i = 0; i < ps.length; i++) {
	      var pt = ps[i];
	      pt.len = pt.distanceTo(this.get(-1));
	      pt.tlen = this.get(-1).tlen + pt.len;
	      pt.direction = pt.clone().sub(this.get(-1)).normalize();
	      if (!this.get(-1).direction) this.get(-1).direction = pt.clone().sub(this.get(-1)).normalize();else this.get(-1).direction.copy(pt.direction);
	      this.push(pt);
	    }
	  };
	  /**
	   * @description : 计算一段线段的总长度
	   * @param        {ArrayLike} ps
	   * @return       {number}   总长度
	   */


	  Path.totalMileages = function (ps) {
	    var alldisance = 0;

	    for (var i = 0, len = ps.length - 1; i < len; i++) {
	      alldisance += ps[i + 1].distanceTo(ps[i]);
	    }

	    return alldisance;
	  };
	  /**
	   * @description : 获取没一点的里程  里程是指从第一个点出发的长度
	   * @param        {ArrayLike} ps 里程上的点集
	   * @param        {boolean} normalize 是否归一化
	   * @return       {number[]}  每一个点的里程数组
	   * @example     :
	   */


	  Path.getPerMileages = function (ps, normalize, totalMileage) {
	    if (normalize === void 0) {
	      normalize = false;
	    }

	    var res = [];
	    var mileages = 0;
	    res.push(mileages);

	    for (var i = 0, len = ps.length - 1; i < len; i++) {
	      mileages += ps[i + 1].distanceTo(ps[i]);
	      res.push(mileages);
	    }

	    if (normalize) {
	      var tl = (0, types.isDefined)(totalMileage) ? totalMileage : this.totalMileages(ps);

	      for (var i = 0, len = ps.length; i < len; i++) {
	        res[i] /= tl;
	      }
	    }

	    return res;
	  };

	  return Path;
	}(ArrayList_1.ArrayList);

	exports.Path = Path;
	});

	unwrapExports(Path_1);
	var Path_2 = Path_1.Path;

	var distance = createCommonjsModule(function (module, exports) {

	var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
	  return mod && mod.__esModule ? mod : {
	    "default": mod
	  };
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Distance = void 0;



	var vector_1$1 = __importDefault(vector_1);
	/*
	 * @Description  :  如无必要，勿增实体
	 * @Author       : 赵耀圣
	 * @QQ           : 549184003
	 * @Date         : 2021-09-30 10:54:56
	 * @LastEditTime : 2021-09-30 10:59:50
	 * @FilePath     : \cga.js\src\alg\distance.ts
	 */


	var _vec3_1 = new Vec3_1.Vec3();

	var Distance =
	/** @class */
	function () {
	  function Distance() {}

	  Distance.Point2Point_Number = function (x0, y0, z0, x1, y1, z1) {
	    return vector_1$1.default.distance(x0, y0, z0, x1, y1, z1);
	  };

	  Distance.Point2Line_Number = function (x0, y0, z0, sox, soy, soz, sdx, sdy, sdz) {};
	  /**
	   *
	   * @param point
	   * @param origin
	   * @param dir 默认已经正交化
	   */


	  Distance.Point2Line_Vec3 = function (point, origin, dir, result) {
	    if (result === void 0) {
	      result = new Vec3_1.Vec3();
	    }

	    result.copy(point).sub(origin);
	    var len = result.dot(dir);
	    result.copy(dir).multiplyScalar(len);
	    result.add(point);
	    return result;
	  };

	  return Distance;
	}();

	exports.Distance = Distance;
	});

	unwrapExports(distance);
	var distance_1 = distance.Distance;

	var extrude_1 = createCommonjsModule(function (module, exports) {
	/*
	 * @Description  : 挤压相关方法
	 * @Author       : 赵耀圣
	 * @QQ           : 549184003
	 * @Date         : 2020-12-10 15:01:42
	 * @LastEditTime : 2021-09-14 10:07:25
	 * @FilePath     : \cesium-taji-dabaod:\github\cga.js\src\alg\extrude.ts
	 */

	var __assign = commonjsGlobal && commonjsGlobal.__assign || function () {
	  __assign = Object.assign || function (t) {
	    for (var s, i = 1, n = arguments.length; i < n; i++) {
	      s = arguments[i];

	      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
	    }

	    return t;
	  };

	  return __assign.apply(this, arguments);
	};

	var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from, pack) {
	  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	    if (ar || !(i in from)) {
	      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	      ar[i] = from[i];
	    }
	  }
	  return to.concat(ar || Array.prototype.slice.call(from));
	};

	var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function (mod) {
	  return mod && mod.__esModule ? mod : {
	    "default": mod
	  };
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.extrudeNext = exports.EndType = exports.JoinType = exports.extrude_obsolete = exports.extrude = exports.linkSides = exports.linkSide = void 0;

























	var vector_1$1 = __importDefault(vector_1);


	/**
	 *  常用shape几何操作
	 */

	/**
	 * @description : 缝合两个边 不提供uv生成  uv有@linkSides 生成
	 * @param        { ILinkSideOption } options
	 * @returns      { Array<Vec3>} 三角形数组，每三个为一个三角形
	 * @example     :
	 */


	function linkSide(options) {
	  options = __assign({
	    shapeClosed: true,
	    autoUV: true
	  }, options);
	  var side0 = options.side0;
	  var side1 = options.side1;
	  var shapeClosed = options.shapeClosed;
	  if (side0.length !== side1.length) throw "拉伸两边的点数量不一致  linkSide";
	  if (side0.length < 2 || side1.length < 2) return [];
	  var orgLen = side0.length;
	  var length = shapeClosed ? side0.length : side0.length - 1;
	  var triangles = [];

	  if (side0[0] instanceof Number) {
	    //索引三角形
	    for (var i = 0; i < length; i++) {
	      var v00 = side0[i];
	      var v01 = side0[(i + 1) % orgLen];
	      var v10 = side1[i];
	      var v11 = side1[(i + 1) % orgLen];
	      triangles.push(v00);
	      triangles.push(v01);
	      triangles.push(v11);
	      triangles.push(v00);
	      triangles.push(v11);
	      triangles.push(v10);
	    }
	  } else {
	    if ((0, types.isDefined)(side0[0].index)) {
	      //含索引的顶点
	      for (var i = 0; i < length; i++) {
	        var v00 = side0[i];
	        var v01 = side0[(i + 1) % orgLen];
	        var v10 = side1[i];
	        var v11 = side1[(i + 1) % orgLen];
	        triangles.push(v00.index);
	        triangles.push(v01.index);
	        triangles.push(v11.index);
	        triangles.push(v00.index);
	        triangles.push(v11.index);
	        triangles.push(v10.index);
	      }
	    } else {
	      //三角形顶点
	      for (var i = 0; i < length; i++) {
	        var v00 = side0[i];
	        var v01 = side0[(i + 1) % orgLen];
	        var v10 = side1[i];
	        var v11 = side1[(i + 1) % orgLen];
	        triangles.push(v00);
	        triangles.push(v01);
	        triangles.push(v11);
	        triangles.push(v00);
	        triangles.push(v11);
	        triangles.push(v10);
	      }
	    }
	  }

	  if (options.holes0 && options.holes1) {
	    var holes0 = options.holes0;
	    var holes1 = options.holes1;

	    for (var h = 0; h < holes0.length; h++) {
	      var holeTriangles = linkSide({
	        side0: holes0[h],
	        side1: holes1[h]
	      });
	      holeTriangles.reverse();
	      triangles.push.apply(triangles, holeTriangles);
	    }
	  }

	  return triangles;
	}

	exports.linkSide = linkSide;
	/**
	 * @description : 链接多个shape 生成几何体
	 * @param        {ILinkSideOptions} optionsILinkSideOptions {
	 *   shapes: Array<Array<IVec3 | number | any>>;
	 *   sealStart?: boolean,//开始封面
	 *   sealEnd?: boolean;//结束封面
	 *   shapeClosed?: boolean,//shape是否闭合
	 *   pathClosed?: boolean,//路径是否闭合
	 *   index?: { index: number },
	 *   generateUV?: boolean
	 *   }
	 *
	 * @return       {*}
	 * @example     :
	 *
	 */

	function linkSides(options) {
	  options = __assign({
	    sealEnd: true,
	    sealStart: true,
	    shapeClosed: true,
	    pathClosed: false,
	    generateUV: true,
	    autoIndex: true,
	    axisPlane: trianglution.AxisPlane.XY
	  }, options);
	  if (options.autoIndex) options.index = options.index || {
	    index: 0
	  };
	  var shapes = options.shapes;
	  var holess = options.holes;
	  var hasHole = !!(holess && holess.length > 0);
	  var length = options.pathClosed ? shapes.length : shapes.length - 1;
	  var triangles = [];
	  var index = options.index;
	  var allVertics = [shapes];
	  if (hasHole) allVertics.push(holess);
	  var orgShape = options.orgShape || shapes[0];
	  var orgHoles = options.orgHoles || holess && holess[0];
	  if (index) (0, mesh.indexable)(allVertics, index);

	  for (var i = 0; i < length; i++) {
	    if (holess) triangles.push.apply(triangles, linkSide({
	      side0: shapes[i],
	      side1: shapes[(i + 1) % shapes.length],
	      holes0: holess[i],
	      holes1: holess[(i + 1) % shapes.length],
	      shapeClosed: options.shapeClosed
	    }));else triangles.push.apply(triangles, linkSide({
	      side0: shapes[i],
	      side1: shapes[(i + 1) % shapes.length],
	      shapeClosed: options.shapeClosed
	    }));
	  }

	  if (options.sealStart) {
	    var startShape = (0, common.clone)(shapes[0]);
	    allVertics.push(startShape);

	    if (holess && holess[0]) {
	      var startHoles = (0, common.clone)(holess[0]);
	      allVertics.push(startHoles);
	    }

	    var startTris = (0, trianglution.triangulation)(orgShape, orgHoles, {
	      feature: trianglution.AxisPlane.XYZ
	    });

	    if (index) {
	      startTris.forEach(function (v, i) {
	        startTris[i] = v + (index === null || index === void 0 ? void 0 : index.index);
	      });
	      index.index += startShape.length;
	      if (holess && holess[0]) startHoles.forEach(function (h) {
	        index.index += h.length;
	      });
	    }

	    triangles.push.apply(triangles, startTris.reverse());
	  }

	  if (options.sealEnd) {
	    var endShape = (0, common.clone)(shapes[shapes.length - 1]);
	    allVertics.push(endShape);

	    if (holess && holess[0]) {
	      var endHoles = (0, common.clone)((0, common.clone)(holess[holess.length - 1]));
	      allVertics.push(endHoles);
	    }

	    var endTris = (0, trianglution.triangulation)(orgShape, orgHoles, {
	      feature: trianglution.AxisPlane.XYZ
	    });

	    if (index) {
	      endTris.forEach(function (v, i) {
	        endTris[i] = v + (index === null || index === void 0 ? void 0 : index.index);
	      });
	      index.index += endShape.length;
	      if (holess && holess[0]) endHoles.forEach(function (h) {
	        index.index += h.length;
	      });
	    }

	    triangles.push.apply(triangles, endTris);
	  }

	  triangles.shapes = allVertics;
	  var uvs = [];

	  if (options.generateUV) {
	    //生成UV 
	    // let uBasicScalar = new Array(shapes[0].length).fill(0);
	    var uBasicScalar = 0;

	    for (var i_1 = 0; i_1 < shapes.length; i_1++) {
	      var shape = shapes[i_1];
	      var lastshape = shapes[i_1 - 1];

	      if (isNaN(shape[0])) {
	        //不是索引才生产纹理，其他都是顶点
	        var vScalar = Path_1.Path.getPerMileages(shape, false);
	        var uScalar = 0; // if (i > 0)
	        //     uScalar = uBasicScalar.map((e, k) => {
	        //         return e + shape[k].distanceTo(lastshape[k]);
	        //     });
	        // else
	        //     uScalar = new Array(shapes[0].length).fill(0);

	        if (i_1 > 0) uScalar = uBasicScalar + shape[0].distanceTo(lastshape[0]);

	        for (var l = 0; l < shape.length; l++) {
	          uvs.push(uScalar, vScalar[l]);
	        }

	        uBasicScalar = uScalar;
	      } else console.error("索引无法生成纹理");
	    }

	    if (holess) {
	      uBasicScalar = 0;

	      for (var i_2 = 0; i_2 < holess.length; i_2++) {
	        var holes = holess[i_2];
	        var lastHole = holess[i_2 - 1];
	        var uScalar = 0;
	        if (i_2 > 0) uScalar = uBasicScalar + holes[0][0].distanceTo(lastHole[0][0]);

	        for (var j = 0; j < holes.length; j++) {
	          var hole = holes[j];
	          var vScalar = Path_1.Path.getPerMileages(hole, false);

	          for (var l = 0; l < hole.length; l++) {
	            uvs.push(uScalar, vScalar[l]);
	          }
	        }

	        uBasicScalar = uScalar;
	      }
	    } //前后纹理


	    var sealUvs = [];

	    switch (options.axisPlane) {
	      case trianglution.AxisPlane.XY:
	        orgShape.map(function (e) {
	          sealUvs.push(e.x, e.y);
	        });
	        if (orgHoles) orgHoles.forEach(function (h) {
	          h.forEach(function (e) {
	            sealUvs.push(e.x, e.y);
	          });
	        });
	        break;

	      case trianglution.AxisPlane.XZ:
	        orgShape.map(function (e) {
	          sealUvs.push(e.x, e.z);
	        });
	        if (orgHoles) orgHoles.forEach(function (h) {
	          h.forEach(function (e) {
	            sealUvs.push(e.x, e.z);
	          });
	        });
	        break;

	      case trianglution.AxisPlane.YZ:
	        orgShape.map(function (e) {
	          sealUvs.push(e.y, e.z);
	        });
	        if (orgHoles) orgHoles.forEach(function (h) {
	          h.forEach(function (e) {
	            sealUvs.push(e.y, e.z);
	          });
	        });
	        break;
	    }

	    uvs.push.apply(uvs, __spreadArray(__spreadArray([], sealUvs, false), sealUvs, false));
	  }

	  var indices = triangles || []; // if (isDefined(shapes[0][0].index)) {
	  //     //收集索引
	  //     for (let i = 0; i < shapes.length; i++) {
	  //         const shape = shapes[i];
	  //         for (let j = 0; j < shape.length; j++) {
	  //             const v = shape[j];
	  //             indices.push(v.index);
	  //         }
	  //     }
	  // }

	  var positions = vector_1$1.default.verctorToNumbers(allVertics);
	  shapes.pop();
	  shapes.pop();
	  return {
	    position: positions,
	    index: indices,
	    uv: uvs
	  };
	}

	exports.linkSides = linkSides;
	var defaultExtrudeOption = {
	  textureEnable: true,
	  textureScale: new Vec2_1.Vec2(1, 1),
	  smoothAngle: Math.PI / 180 * 30,
	  sealStart: false,
	  sealEnd: false,
	  normal: Vec3_1.Vec3.UnitZ
	};

	var _matrix = (0, Mat4_1.m4)();

	var _matrix1 = (0, Mat4_1.m4)();

	var _quat = (0, Quat_1.quat)();

	var _quat1 = (0, Quat_1.quat)();

	var _vec1 = (0, Vec3_1.v3)();

	var _vec2 = (0, Vec3_1.v3)();
	/**
	 * @description : 挤压形状生成几何体
	 * @param        {IExtrudeOptionsEx} options
	 *   IExtrudeOptionsEx {
	 *    shape: Array<Vec3 | IVec3 | Vec2 | IVec2>;//shape默认的矩阵为正交矩阵
	 *    path: Array<Vec3 | IVec3>;//挤压路径
	 *    ups?: Array<Vec3 | IVec3>;
	 *    up?: Vec3 | IVec3;
	 *    shapeClosed?: boolean;//闭合为多边形 界面
	 *    pathClosed?: boolean;//首尾闭合为圈
	 *    textureEnable?: boolean;
	 *    smoothAngle?: number;
	 *    sealStart?: boolean;
	 *    sealEnd?: boolean;
	 *    normal?: Vec3,//面的法线
	 *    autoIndex?: boolean,
	 *    index?: { index: number }
	 *    holes?: Array<Vec3 | IVec3 | Vec2 | IVec2>[]
	 *}
	 * @return       {IGeometry}
	 * @example     :
	 *
	 */


	function extrude(options) {
	  options = __assign({
	    sealEnd: true,
	    sealStart: true,
	    shapeClosed: true,
	    pathClosed: false,
	    generateUV: true,
	    autoIndex: true,
	    axisPlane: trianglution.AxisPlane.XY,
	    up: Vec3_1.Vec3.Up,
	    smoothAngle: 30 * _Math.RADIANS_PER_DEGREE,
	    enableSmooth: false
	  }, options);
	  if (!vector_1$1.default.isCCW(options.shape)) options.shape.reverse();
	  if (options.holes) options.holes.forEach(function (hole) {
	    if (!vector_1$1.default.isCCW(hole)) hole.reverse();
	  });
	  var path = new Path_1.Path(options.path);
	  var shapes = [];
	  var shape = options.shape;
	  if (options.shapeClosed && !shape[0].equals(shape[shape.length - 1])) shape.push(shape[0].clone());
	  var shapePath = new Path_1.Path(shape, options.shapeClosed);
	  if (options.enableSmooth) for (var i = 1; i < shapePath.length; i++) {
	    //大角度插入点 角度过大为了呈现flat shader的效果
	    if (shapePath.get(i).direction.dot(shapePath.get((i + 1) % shapePath.length).direction) < Math.cos(options.smoothAngle)) {
	      shapePath.splice(i + 1, 0, shapePath.get(i).clone());
	      i++;
	    }
	  }
	  var ups = options.ups || [];

	  if ((0, types.isUndefined)(shapePath.first.z)) {
	    shapePath.array = shapePath.array.map(function (e) {
	      return (0, Vec3_1.v3)(e.x, e.y, 0);
	    });
	    options.normal = options.normal || Vec3_1.Vec3.UnitZ;
	  }

	  var up = options.up;
	  var right = options.right;
	  var newholes = [];

	  for (var i = 0; i < options.path.length; i++) {
	    var point = path.get(i);
	    var direction = point.direction;
	    var upi = void 0;
	    upi = ups[i] || up || (0, Vec3_1.v3)().crossVecs(right, direction);
	    var righti = right;
	    if (!right) righti = (0, Vec3_1.v3)().crossVecs(upi, direction).normalize();

	    _matrix.makeBasis(righti, upi, direction);

	    _matrix.setPosition(point);

	    var new_shape = shapePath.clone();
	    new_shape.applyMat4(_matrix);
	    shapes.push(new_shape);

	    if (options.holes) {
	      var mholes = (0, pointset.applyMat4)(options.holes, _matrix, false);
	      newholes.push(mholes);
	    }
	  }

	  var geo = linkSides({
	    shapes: shapes.map(function (e) {
	      return e._array;
	    }),
	    holes: newholes,
	    orgShape: shapePath._array,
	    orgHoles: options.holes,
	    sealStart: options.sealStart,
	    sealEnd: options.sealEnd,
	    shapeClosed: options.shapeClosed,
	    pathClosed: options.pathClosed,
	    axisPlane: options.axisPlane,
	    autoIndex: options.autoIndex,
	    generateUV: options.generateUV
	  });
	  return geo;
	}

	exports.extrude = extrude;
	/**
	 * 挤压
	 * @param {Polygon|Array<Point|Vec3> }  shape   多边形或顶点数组
	 * @param {Path|Array<Point|Vec3> } path  路径或者或顶点数组
	 * @param {Object} options {
	 *      isClosed: false,闭合为多边形 界面
	 *      isClosed2: false, 闭合为圈
	 *      textureEnable: true, 计算纹理坐标
	 *      textureScale: new Vec2(1, 1),纹理坐标缩放
	 *      smoothAngle: Math.PI / 180 * 30,大于这个角度则不平滑
	 *      sealStart: true, 是否密封开始面
	 *      sealEnd: true,是否密封结束面}
	 */

	function extrude_obsolete(shape, arg_path, options) {
	  var _a, _b;

	  if (options === void 0) {
	    options = defaultExtrudeOption;
	  }

	  options = __assign(__assign({}, defaultExtrudeOption), options);

	  if (arg_path.length < 2) {
	    throw "路径节点数必须大于2";
	  }

	  var isCCW = vector_1$1.default.isCCW(shape);
	  if (!isCCW) shape.reverse();
	  var normal = options.normal;
	  var startSeal = (0, common.clone)(shape);
	  var shapepath = new Path_1.Path(shape);
	  var insertNum = 0;

	  for (var i = 1; i < shapepath.length - 1; i++) {
	    //大角度插入点 角度过大为了呈现flat shader的效果
	    if (Math.acos(shapepath.get(i).tangent.dot(shapepath.get(i + 1).tangent)) > options.smoothAngle) shape.splice(i + insertNum++, 0, shapepath.get(i).clone());
	  }

	  if (options.shapeClosed) {
	    var dir1 = shapepath.get(-1).clone().sub(shapepath.get(-2)).normalize();
	    var dir2 = shapepath.get(0).clone().sub(shapepath.get(-1)).normalize();
	    if (Math.acos(dir1.dot(dir2)) > options.smoothAngle) shape.push(shape.get(-1).clone()); //新加起始点纹理拉伸

	    shape.unshift(shape.first.clone());
	  }

	  var path = arg_path;
	  if (!(path instanceof Path_1.Path) && path instanceof Array) path = new Path_1.Path(arg_path);
	  var shapeArray = [];

	  for (var i = 0; i < path.length; i++) {
	    var node = path[i];
	    var dir = node.tangent;
	    var newShape = (0, common.clone)(shape);
	    (0, common.rotateByUnitVectors)(newShape, normal, dir);

	    if (options.fixedY) {
	      var v = Vec3_1.Vec3.UnitX;
	      (0, common.rotateByUnitVectors)([v], normal, dir);
	      var v1 = v.clone();
	      v1.y = 0;
	      (0, common.rotateByUnitVectors)(newShape, v, v1);
	    }

	    (0, pointset.translate)(newShape, node);
	    shapeArray.push(newShape);
	  }

	  var gindex = {
	    index: 0
	  };
	  var vertices = (0, array.flat)(shapeArray);
	  (0, mesh.indexable)(vertices, gindex);
	  var index = linkSides({
	    shapes: shapeArray,
	    shapeClosed: options.shapeClosed,
	    pathClosed: options.isClosed2,
	    orgShape: shape
	  }).index;
	  shapepath = new Path_1.Path(shape);
	  var uvs = [];

	  for (var i = 0; i < path.length; i++) {
	    for (var j = 0; j < shapepath.length; j++) {
	      uvs.push(shapepath.get(j).tlen * options.textureScale.x, path.get(i).tlen * options.textureScale.y);
	    }
	  }

	  var sealUv = (0, common.clone)(startSeal);
	  if (normal.dot(Vec3_1.Vec3.UnitZ) < 1 - 1e-4) (0, common.rotateByUnitVectors)(sealUv, normal, Vec3_1.Vec3.UnitZ);
	  var endSeal = (0, common.clone)(startSeal);
	  (0, common.rotateByUnitVectors)(startSeal, normal, path[0].tangent);

	  if (options.fixedY) {
	    var v = Vec3_1.Vec3.UnitX;
	    (0, common.rotateByUnitVectors)([v], normal, path[0].tangent);
	    var v1 = v.clone();
	    v1.y = 0;
	    (0, common.rotateByUnitVectors)(startSeal, v, v1);
	  }

	  (0, pointset.translate)(startSeal, path[0]);
	  (0, common.rotateByUnitVectors)(endSeal, normal, path.get(-1).tangent);

	  if (options.fixedY) {
	    var v = Vec3_1.Vec3.UnitX;
	    (0, common.rotateByUnitVectors)([v], normal, path.get(-1).tangent);
	    var v1 = v.clone();
	    v1.y = 0;
	    (0, common.rotateByUnitVectors)(endSeal, v, v1);
	  }

	  (0, pointset.translate)(endSeal, path.get(-1));
	  var sealStartTris = (0, trianglution.triangulation)(sealUv, [], {
	    normal: normal
	  });
	  sealStartTris.reverse();
	  if (options.sealStart) (0, mesh.indexable)(startSeal, gindex);
	  if (options.sealEnd) (0, mesh.indexable)(endSeal, gindex);
	  var sealEndTris = [];
	  var hasVLen = vertices.length;
	  if (options.sealStart) for (var i = 0; i < sealStartTris.length; i++) {
	    sealStartTris[i] += hasVLen;
	  }
	  if (options.sealEnd && !options.sealStart) for (var i = 0; i < sealStartTris.length; i++) {
	    sealEndTris[i] = sealStartTris[i] + hasVLen;
	  }

	  if (options.sealEnd && options.sealStart) {
	    for (var i = 0; i < sealStartTris.length; i++) {
	      sealEndTris[i] = sealStartTris[i] + startSeal.length;
	    }
	  }

	  if (options.sealStart) {
	    vertices.push.apply(vertices, startSeal);

	    (_a = index).push.apply(_a, sealStartTris);

	    for (var i = 0; i < sealUv.length; i++) uvs.push(sealUv[i].x, sealUv[i].y);
	  }

	  if (options.sealEnd) {
	    vertices.push.apply(vertices, endSeal);
	    sealEndTris.reverse();

	    (_b = index).push.apply(_b, sealEndTris);

	    for (var i = 0; i < sealUv.length; i++) uvs.push(sealUv[i].x, sealUv[i].y);
	  }

	  return {
	    vertices: vertices,
	    index: index,
	    uvs: uvs
	  };
	}

	exports.extrude_obsolete = extrude_obsolete;
	var JoinType;

	(function (JoinType) {
	  JoinType[JoinType["Square"] = 0] = "Square";
	  JoinType[JoinType["Round"] = 1] = "Round";
	  JoinType[JoinType["Miter"] = 2] = "Miter";
	  JoinType[JoinType["Bevel"] = 0] = "Bevel";
	})(JoinType = exports.JoinType || (exports.JoinType = {}));

	var EndType;

	(function (EndType) {
	  EndType[EndType["Square"] = 0] = "Square";
	  EndType[EndType["Round"] = 1] = "Round";
	  EndType[EndType["Butt"] = 2] = "Butt";
	  EndType[EndType["etClosedLine"] = 3] = "etClosedLine";
	  EndType[EndType["etClosedPolygon"] = 4] = "etClosedPolygon";
	  EndType[EndType["etOpenButt"] = 5] = "etOpenButt";
	  EndType[EndType["etOpenSquare"] = 6] = "etOpenSquare";
	})(EndType = exports.EndType || (exports.EndType = {}));
	/**
	 * 将路径看做挤压操作中心
	 *
	 * @param shape
	 * @param followPath
	 * @param options
	 */


	function extrudeNext(options) {
	  options = __assign({
	    sealEnd: true,
	    sealStart: true,
	    shapeClosed: true,
	    pathClosed: false,
	    generateUV: true,
	    autoIndex: true,
	    axisPlane: trianglution.AxisPlane.XY,
	    smoothAngle: 30 * _Math.RADIANS_PER_DEGREE,
	    enableSmooth: false
	  }, options);
	  var path = options.shapeCenter ? (0, pointset.translate)(options.path, options.shapeCenter, false) : options.path;
	  var shape = options.shape;
	  (0, array.unique)(path, function (a, b) {
	    return a.equals(b);
	  });
	  (0, array.unique)(shape, function (a, b) {
	    return a.equals(b);
	  });
	  var pathPath = new Path_1.Path(path, options.pathClosed, true);
	  var starti = options.shapeClosed ? 0 : 1;
	  var shapePath = new Path_1.Path(shape, options.shapeClosed);
	  if (options.enableSmooth) for (var i = 1; i < shapePath.length; i++) {
	    //大角度插入点 角度过大为了呈现flat shader的效果
	    if (shapePath.get(i).direction.dot(shapePath.get((i + 1) % shapePath.length).direction) < options.smoothAngle) {
	      shapePath.splice(i + 1, 0, shapePath.get(i).clone());
	      i++;
	    }
	  }
	  options.normal = options.normal || Vec3_1.Vec3.UnitZ;

	  if ((0, types.isUndefined)(shapePath.first.z)) {
	    shapePath.array = shapePath.array.map(function (e) {
	      return (0, Vec3_1.v3)(e.x, e.y, 0);
	    });
	  }

	  var up = options.up;
	  var right = options.right;
	  var shapes = [],
	      newholes = [];
	  var accMat = (0, Mat4_1.m4)();
	  /**
	   * 如果路径闭合  要考虑首尾shape矩阵变化后还能一致吻合
	   */

	  switch (options.jtType) {
	    case JoinType.Square:
	      //切角
	      break;

	    case JoinType.Round:
	      //圆角

	      /**
	       * 原理，计算所有交点处的平分面，
	       * 两条相接不共线的的线段可以确定一个平面，平面法线与
	       */
	      for (var i = 0; i < pathPath.length; i++) {
	        var p = pathPath.get(i);
	        var pLast = pathPath.get(i - 1);
	        var pNext = pathPath.get(i + 1);
	        var dir = p.direction; //两个外向

	        var bdir = p.bdirection;
	        var bnormal = p.bnormal;
	        var normal = p.normal; //相邻两个向量发生的旋转

	        if (i === 0) {
	          _quat.setFromUnitVecs(Vec3_1.Vec3.UnitZ, dir);
	        } else {
	          _quat.setFromUnitVecs(pathPath.get(i - 1).direction, dir);
	        }

	        var new_shape = shapePath.clone(); //旋转 

	        _quat.setFromUnitVecs(dir, bdir);

	        _matrix.makeRotationFromQuat(_quat);

	        _matrix.multiply(accMat); //位置


	        _matrix.setPosition(p);

	        new_shape.applyMat4(_matrix); // 找出最近一个点  绕此点旋转 

	        var min = Infinity;
	        var anchor = 0;

	        for (var i_3 = 0; i_3 < new_shape.array.length; i_3++) {
	          var p_1 = new_shape.get(i_3);
	          var tdot = bdir.dot(_vec1.copy(p_1).sub(new_shape.get(0)));

	          if (tdot < min) {
	            min = tdot;
	            anchor = i_3;
	          }
	        }

	        var minPoint = new_shape.get(anchor); //找出距离连个线段最近的点
	        // 垂直的两个点  这两个点与

	        if (i !== 0 && i !== pathPath.length - 1) {
	          var P0 = distance.Distance.Point2Line_Vec3(minPoint, pLast, _vec1.copy(p).sub(pLast).normalize());
	          var P1 = distance.Distance.Point2Line_Vec3(minPoint, p, _vec1.copy(pNext).sub(p).normalize());

	          _vec1.copy(P0).sub(minPoint);

	          _vec2.copy(P1).sub(minPoint);

	          var angle_1 = _vec1.angleTo(_vec2, normal);

	          var seg = Math.ceil(angle_1 / 0.1);
	          var perAngle = angle_1 / seg;

	          for (var i_4 = 0; i_4 <= seg; i_4++) {
	            var cAngle = i_4 * perAngle;

	            for (var j = 0; j < new_shape.length; j++) {
	              var np = new_shape.get(j);
	              var v = new Vec3_1.Vec3().slerpVecs(_vec1, _vec2, cAngle);
	              var t = np.clone().sub(minPoint);
	            }
	          } // if (options.holes) {
	          //     const mholes = applyMat4(options.holes, _matrix1, false);
	          //     applyMat4(mholes, _matrix, true);
	          //     newholes.push(mholes);
	          // } 

	        }

	        shapes.push(new_shape);
	      }

	      break;

	    case JoinType.Miter:
	      //直角
	      for (var i = 0; i < pathPath.length; i++) {
	        var p = pathPath.get(i);
	        var dir = p.direction;
	        var bdir = p.bdirection;
	        var bnormal = p.bnormal;
	        var normal = p.normal; //相邻两个向量发生的旋转

	        if (i === 0) {
	          _quat.setFromUnitVecs(Vec3_1.Vec3.UnitZ, dir);
	        } else {
	          _quat.setFromUnitVecs(pathPath.get(i - 1).direction, dir);
	        }

	        var new_shape = shapePath.clone(); //旋转

	        _matrix.makeRotationFromQuat(_quat);

	        accMat.premultiply(_matrix);

	        _quat.setFromUnitVecs(dir, bdir);

	        _matrix.makeRotationFromQuat(_quat);

	        _matrix.multiply(accMat); // /旋转到原地缩放----开始-----------------------


	        var cosA = dir.dot(bdir);
	        var shear = 1 / cosA;

	        _vec1.crossVecs(normal, bdir);

	        _matrix1.copy(_matrix);

	        _matrix1.invert();

	        _vec1.applyMat4(_matrix1);

	        _quat.setFromUnitVecs(_vec1, Vec3_1.Vec3.Up);

	        _matrix1.makeRotationFromQuat(_quat);

	        new_shape.applyMat4(_matrix1);
	        new_shape.scale(1, shear, 1);
	        new_shape.applyMat4(_matrix1.invert()); // /旋转到原地缩放----结束-----------------------
	        //位置

	        _matrix.setPosition(p);

	        new_shape.applyMat4(_matrix); // if (options.holes) {
	        //     const mholes = applyMat4(options.holes, _matrix1, false);
	        //     applyMat4(mholes, _matrix, true);
	        //     newholes.push(mholes);
	        // }  

	        shapes.push(new_shape);
	      }

	      break;
	  }

	  var geo = linkSides({
	    shapes: shapes.map(function (e) {
	      return e.array;
	    }),
	    holes: newholes,
	    orgShape: shapePath._array,
	    orgHoles: options.holes,
	    sealStart: options.sealStart,
	    sealEnd: options.sealEnd,
	    shapeClosed: options.shapeClosed,
	    pathClosed: options.pathClosed,
	    axisPlane: options.axisPlane,
	    autoIndex: options.autoIndex,
	    generateUV: options.generateUV
	  });
	  return geo;
	}

	exports.extrudeNext = extrudeNext;
	});

	unwrapExports(extrude_1);
	var extrude_2 = extrude_1.extrudeNext;
	var extrude_3 = extrude_1.EndType;
	var extrude_4 = extrude_1.JoinType;
	var extrude_5 = extrude_1.extrude_obsolete;
	var extrude_6 = extrude_1.extrude;
	var extrude_7 = extrude_1.linkSides;
	var extrude_8 = extrude_1.linkSide;

	var Polyline_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Polyline = void 0;












	/**
	 *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
	 */


	var Polyline =
	/** @class */
	function (_super) {
	  __extends(Polyline, _super);

	  function Polyline(vs, normal) {
	    if (normal === void 0) {
	      normal = Vec3_1.Vec3.UnitY;
	    }

	    var _this = _super.call(this, vs) || this;

	    _this.isPolyline = true;
	    _this.normal = normal;
	    _this.isCoPlanar = true;
	    return _this;
	  }
	  /**
	   * 偏移
	   * @param {Number} distance  偏移距离
	   * @param {Vector3} normal  折线所在平面法线
	   */


	  Polyline.prototype.offset = function (distance, normal, endtype, jointype) {
	    if (normal === void 0) {
	      normal = Vec3_1.Vec3.UnitY;
	    }

	    if (endtype === void 0) {
	      endtype = extrude_1.EndType.Butt;
	    }

	    if (jointype === void 0) {
	      jointype = extrude_1.JoinType.Miter;
	    }

	    var segs = [];

	    var _loop_1 = function (i) {
	      var seg = new Segment_1.Segment(this_1.get(i).clone(), this_1.get(i + 1).clone());
	      var segtangetvec = seg[1].clone().sub(seg[0]).normalize().applyAxisAngle(normal, Math.PI / 2).multiplyScalar(distance);
	      seg.forEach(function (e) {
	        return e.add(segtangetvec);
	      });
	      segs.push(seg);
	    };

	    var this_1 = this;

	    for (var i = 0; i < this.length - 1; i++) {
	      _loop_1(i);
	    }

	    for (var i = 0; i < segs.length - 1; i++) {
	      var segi = segs[i];

	      for (var j = i + 1; j < segs.length; j++) {
	        var segj = segs[j];
	        var disRes = segi.distanceSegment(segj);

	        if (disRes.distance < _Math.delta4) {
	          //相交
	          segj[0].copy(disRes.closests[0]);
	          segi[1].copy(disRes.closests[0]);
	        }
	      }
	    }

	    var offsetPts = [];
	    offsetPts.push(segs[0].p0);

	    for (var i = 0; i < segs.length; i++) {
	      var element = segs[i];
	      offsetPts.push(element.p1);
	    }

	    return new Polyline(offsetPts);
	  };
	  /**
	   * 圆角   将折线拐点圆角化
	   * @param {Number} useDistance 圆角段距离
	   * @param {Number} segments 分切割段数
	   */


	  Polyline.prototype.corner = function (useDistance, normal) {
	    if (normal === void 0) {
	      normal = this.normal;
	    }

	    var polyline = new Polyline();

	    for (var i = 0; i < this.length - 2; i++) {
	      var p0 = this.get(i);
	      var p1 = this.get(i + 1);
	      var p2 = this.get(i + 2);
	      polyline.push(p0);
	      var fixedPoint0 = p0.distanceTo(p1) <= useDistance * 2 ? p0.clone().add(p1).multiplyScalar(0.5) : p0.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
	      var fixedPoint1 = p2.distanceTo(p1) <= useDistance * 2 ? p2.clone().add(p1).multiplyScalar(0.5) : p2.clone().sub(p1).normalize().multiplyScalar(useDistance).add(p1);
	      polyline.push(fixedPoint0);
	      var binormal0 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2);
	      var binormal1 = p1.clone().sub(p0).applyAxisAngle(normal, Math.PI / 2); //计算圆弧点

	      var line0 = new Line_1.Line(fixedPoint0, binormal0.add(fixedPoint0));
	      var line1 = new Line_1.Line(fixedPoint1, binormal1.add(fixedPoint1));
	      polyline.push(fixedPoint1);
	    }

	    return polyline;
	  };

	  return Polyline;
	}(ArrayList_1.ArrayList);

	exports.Polyline = Polyline;
	});

	unwrapExports(Polyline_1);
	var Polyline_2 = Polyline_1.Polyline;

	var Polygon_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Polygon = void 0;







	var Polygon =
	/** @class */
	function (_super) {
	  __extends(Polygon, _super);

	  function Polygon(vs) {
	    var _this = _super.call(this, vs) || this;

	    _this.isPolygon = true;
	    return _this;
	  }

	  Polygon.prototype.offset = function (distance, normal) {
	    if (normal === void 0) {
	      normal = Vec3_1.Vec3.UnitY;
	    }

	    var segments = [];

	    for (var i = 0; i < this.length; i++) {
	      var point = this.get(i);
	      var pointNext = this.get((i + 1) % this.length);
	      var segment = new Segment_1.Segment(point, pointNext);
	      segments.push(segment);
	      segment.offset(distance, normal);
	    }

	    for (var i = 0; i < this.length; i++) {
	      var seg = segments[i];
	      var segNext = segments[i + 1];
	      var result = seg.distanceLine(segNext);
	      seg.p1 = result.closests[0];
	      segNext.p0 = result.closests[1];
	    }

	    for (var i = 0; i < this.length; i++) {
	      var seg = segments[i];
	    }

	    return new Polygon();
	  };

	  Polygon.prototype.containPoint = function (point) {};

	  return Polygon;
	}(Polyline_1.Polyline);

	exports.Polygon = Polygon;
	});

	unwrapExports(Polygon_1);
	var Polygon_2 = Polygon_1.Polygon;

	var vector_1 = createCommonjsModule(function (module, exports) {
	/**
	 * 当向量以数组的方式出现，一个计算单元库
	 * @Description  : 向量数组
	 * @Author       : 赵耀圣
	 * @QQ           : 549184003
	 * @Date         : 2021-08-02 15:09:33
	 * @LastEditTime : 2021-08-02 15:50:16
	 * @FilePath     : \cga.js\src\math\VecArray.ts
	 */

	var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function (to, from, pack) {
	  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	    if (ar || !(i in from)) {
	      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	      ar[i] = from[i];
	    }
	  }
	  return to.concat(ar || Array.prototype.slice.call(from));
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});













	var ckeckVec = function (vs, component) {
	  if (vs.length % component !== 0) throw "向量组件数量不一样";
	};
	/**
	 * 矢量几何操作，数字数组/矢量数组，常用工具集合
	 */


	var vector =
	/** @class */
	function () {
	  function vector() {}
	  /**
	   * 去除相邻的重复向量
	   * @param vs 矢量集合
	   * @param delta 误差
	   * @returns
	   */


	  vector.uniqueNeighborVecs = function (vs, delta) {
	    if (delta === void 0) {
	      delta = _Math.delta4;
	    }

	    for (var i = 0; i < vs.length - 1; i++) {
	      var lenSq = vs[i].distanceTo(vs[i + 1]);
	      if (lenSq < delta) vs.splice(i, 1);
	    }

	    return vs;
	  };
	  /**
	   * 去除相邻没有重复点
	   */


	  vector.uniqueNeighbor = function (vs, component, delta) {
	    if (component === void 0) {
	      component = 3;
	    }

	    if (delta === void 0) {
	      delta = _Math.delta4;
	    }

	    for (var i = 0; i < vs.length; i += component) {
	      for (var j = i + 3; j < vs.length;) {
	        var lensq = 0;

	        for (var c = 0; c < component; c++) {
	          lensq += (vs[i + c] - vs[j + c]) * (vs[i + c] - vs[j + c]);
	        }

	        if (Math.sqrt(lensq) < delta) vs.splice(j, component);else break;
	      }
	    }

	    return vs;
	  };
	  /**
	   * 去除任意重复点
	   * @param vs 向量数组
	   * @param component 向量组件数量
	   * @returns 无重复向量数组
	   */


	  vector.unique = function (vs, component) {
	    if (component === void 0) {
	      component = 3;
	    }

	    for (var i = 0; i < vs.length; i += component) {
	      for (var j = i + 3; j < vs.length;) {
	        var lensq = 0;

	        for (var c = 0; c < component; c++) {
	          lensq += (vs[i + c] - vs[j + c]) * (vs[i + c] - vs[j + c]);
	        }

	        if (Math.sqrt(lensq) < 1e-5) vs.splice(j, component);else j += component;
	      }
	    }

	    return vs;
	  };
	  /**
	   *  翻转向量数组
	   * @param vecs 向量数组
	   * @param component  组件数量
	   * @returns
	   */


	  vector.reverse = function (vecs, component) {
	    if (component === void 0) {
	      component = 3;
	    }

	    ckeckVec(vecs, component);
	    var length = vecs.length;

	    for (var i = 0; i < length; i += component) {
	      vecs.unshift.apply(vecs, vecs.splice(i, component));
	    }

	    return vecs;
	  };
	  /**
	   * 点积
	   * @param vecs
	   * @returns
	   */


	  vector.dot = function () {
	    var vecs = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      vecs[_i] = arguments[_i];
	    }

	    if (vecs.length % 2 !== 0) throw "两个向量组件数量不一样";
	    var len = vecs.length / 2;
	    var dot = 0;

	    for (var i = 0; i < len; i++) {
	      dot += vecs[i] * vecs[len + i];
	    }

	    return dot;
	  };
	  /**
	   * 长度平方
	   * @param vecs
	   * @returns
	   */


	  vector.distanceSq = function () {
	    var vecs = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      vecs[_i] = arguments[_i];
	    }

	    if (vecs.length % 2 !== 0) throw "向量组件数量不一样";
	    var len = vecs.length / 2;
	    var lenSq = 0;

	    for (var i = 0; i < len; i++) {
	      var d = vecs[i] - vecs[len + i];
	      lenSq += d * d;
	    }

	    return lenSq;
	  };
	  /**
	   * 长度
	   * @param vecs
	   * @returns
	   */


	  vector.distance = function () {
	    var vecs = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      vecs[_i] = arguments[_i];
	    }

	    return Math.sqrt(this.distanceSq.apply(this, vecs));
	  };
	  /**
	   * 相加
	   * @param vecs
	   * @returns
	   */


	  vector.add = function () {
	    var vecs = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      vecs[_i] = arguments[_i];
	    }

	    if (vecs.length % 2 !== 0) throw "两个向量组件数量不一样";

	    if (Array.isArray(vecs[0]) && Array.isArray(vecs[1])) {
	      for (var i = 0; i < vecs[0].length; i++) {
	        vecs[0][i] += vecs[1][i];
	      }

	      return vecs[0];
	    }

	    if (vecs.length % 2 !== 0) console.error("VecArray:distanceSq  向量错误!!!");
	    var len = vecs.length / 2;
	    var res = [];

	    for (var i = 0; i < len; i++) {
	      res[i] = res[len + i] + res[i];
	    }

	    return res;
	  };
	  /**
	   * 相减
	   * @param vecs
	   * @returns
	   */


	  vector.sub = function () {
	    var vecs = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      vecs[_i] = arguments[_i];
	    }

	    ckeckVec(vecs, 2);

	    if (Array.isArray(vecs[0]) && Array.isArray(vecs[1])) {
	      for (var i = 0; i < vecs[0].length; i++) {
	        vecs[0][i] -= vecs[1][i];
	      }

	      return vecs[0];
	    }

	    if (vecs.length % 2 !== 0) console.error("VecArray:distanceSq  向量错误!!!");
	    var len = vecs.length / 2;
	    var res = [];

	    for (var i = 0; i < len; i++) {
	      res[i] = res[i] - res[len + i];
	    }

	    return res;
	  };
	  /**
	   * 相乘
	   * @param vecs
	   * @returns
	   */


	  vector.mul = function () {
	    var vecs = [];

	    for (var _i = 0; _i < arguments.length; _i++) {
	      vecs[_i] = arguments[_i];
	    }

	    ckeckVec(vecs, 2);

	    if (Array.isArray(vecs[0]) && Array.isArray(vecs[1])) {
	      for (var i = 0; i < vecs[0].length; i++) {
	        vecs[0][i] *= vecs[1][i];
	      }

	      return vecs[0];
	    }

	    if (vecs.length % 2 !== 0) console.error("VecArray:distanceSq  向量错误!!!");
	    var len = vecs.length / 2;
	    var res = [];

	    for (var i = 0; i < len; i++) {
	      res[i] = res[i] * res[len + i];
	    }

	    return res;
	  };
	  /**
	   * 获取矢量数组的i个矢量
	   * @param vecs
	   * @param i
	   * @param component
	   * @returns
	   */


	  vector.getVecAt = function (vecs, i, component) {

	    return [vecs[3 * i], vecs[3 * i + 1], vecs[3 * i + 2]];
	  };
	  /**
	   * 在第 i 个位置插入一个向量
	   * @param vecs
	   * @param i
	   * @param vec
	   */


	  vector.insertAt = function (vecs, i) {
	    var vec = [];

	    for (var _i = 2; _i < arguments.length; _i++) {
	      vec[_i - 2] = arguments[_i];
	    }

	    vecs.splice.apply(vecs, __spreadArray([i * vecs.length, 0], vecs, false));
	  }; //

	  /**
	   * 是否逆时针
	   * counterclockwise
	   */


	  vector.isCCW = function (shape, component) {
	    if (component === void 0) {
	      component = 3;
	    }

	    var d = 0;
	    if (shape instanceof Polyline_1.Polyline || shape instanceof Polygon_1.Polygon) for (var i = 0; i < shape.length; i++) {
	      var pt = shape.get(i);
	      var ptnext = shape.get((i + 1) % shape.length);
	      d += -0.5 * (ptnext.y + pt.y) * (ptnext.x - pt.x);
	    } else if (Array.isArray(shape) && shape.length > 0) {
	      if (shape[0] instanceof Vec3_1.Vec3 || shape[0] instanceof Vec2_1.Vec2) {
	        for (var i = 0; i < shape.length; i++) {
	          var pt = shape[i];
	          var ptnext = shape[(i + 1) % shape.length];
	          d += -0.5 * (ptnext.y + pt.y) * (ptnext.x - pt.x);
	        }
	      } else if (!isNaN(shape[0])) {
	        for (var i = 0; i < shape.length; i += component) {
	          var ptx = shape[i];
	          var pty = shape[(i + 1) % shape.length];
	          var ptnextx = shape[(i + 3) % shape.length];
	          var ptnexty = shape[(i + 4) % shape.length];
	          d += -0.5 * (ptnexty + pty) * (ptnextx - ptx);
	        }
	      }
	    }
	    return d > 0;
	  };
	  /**
	   * 将向量深度拆解为数字
	   * @param {Array} Array<Vec4 | Vec3 | Vec2 | any> | any
	   * @param {String} comSort  'x','y','z','w' 按顺序选取后自由组合
	   * @returns {Array<Number>} 数字数组
	   */


	  vector.verctorToNumbers = function (vecs, comSort) {
	    if (comSort === void 0) {
	      comSort = "xyz";
	    }

	    if (!(vecs instanceof Array)) {
	      console.error("传入参数必须是数组");
	      return [];
	    }

	    var numbers = [];

	    if (vecs[0].x !== undefined && vecs[0].y !== undefined && vecs[0].z !== undefined && vecs[0].w !== undefined) {
	      comSort = comSort.length !== 4 ? 'xyzw' : comSort;

	      for (var i = 0; i < vecs.length; i++) {
	        for (var j = 0; j < comSort.length; j++) {
	          numbers.push(vecs[i][comSort[j]]);
	        }
	      }
	    }

	    if (vecs[0].x !== undefined && vecs[0].y !== undefined && vecs[0].z !== undefined) {
	      comSort = comSort.length !== 3 ? 'xyz' : comSort;

	      for (var i = 0; i < vecs.length; i++) {
	        for (var j = 0; j < comSort.length; j++) {
	          numbers.push(vecs[i][comSort[j]]);
	        }
	      }
	    } else if (vecs[0].x !== undefined && vecs[0].y !== undefined) {
	      comSort = comSort.length !== 2 ? 'xy' : comSort;

	      for (var i = 0; i < vecs.length; i++) {
	        for (var j = 0; j < comSort.length; j++) {
	          numbers.push(vecs[i][comSort[j]]);
	        }
	      }
	    } else if (vecs[0] instanceof Array) {
	      for (var i = 0; i < vecs.length; i++) {
	        numbers = numbers.concat(vector.verctorToNumbers(vecs[i]));
	      }
	    } else {
	      console.error("数组内部的元素不是向量");
	    }

	    return numbers;
	  };

	  vector.vec = function (component) {
	    if (component === void 0) {
	      component = 3;
	    }

	    if (component === 2) return new Vec2_1.Vec2();
	    if (component === 3) return new Vec3_1.Vec3();
	    if (component === 4) return new Vec4_1.Vec4();
	    throw '暂时不支持4维以上的矢量';
	  };
	  /**
	   * 数字数组 转 适量数组
	   * @param vss  数字数组
	   * @param component 矢量维度，默认为3
	   * @returns
	   */


	  vector.numbersToVecs = function (vss, component) {
	    if (component === void 0) {
	      component = 3;
	    }

	    var result = [];
	    var length = vss.length;

	    for (var i = 0; i < length; i += component) {
	      var vec = vector.vec(component);
	      vec.fromArray(vss.slice(i, i + component));
	      result.push(vec);
	    }

	    return result;
	  };

	  return vector;
	}();

	exports.default = vector;
	});

	unwrapExports(vector_1);

	var result = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	});

	unwrapExports(result);

	var delaunator = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Delaunator = void 0;
	var EPSILON = Math.pow(2, -52);
	var EDGE_STACK = new Uint32Array(512);

	var Delaunator =
	/** @class */
	function () {
	  function Delaunator(coords) {
	    var n = coords.length >> 1;
	    if (n > 0 && typeof coords[0] !== 'number') throw new Error('Expected coords to contain numbers.');
	    this.coords = coords; // arrays that will store the triangulation graph

	    var maxTriangles = Math.max(2 * n - 5, 0);
	    this._triangles = new Uint32Array(maxTriangles * 3);
	    this._halfedges = new Int32Array(maxTriangles * 3); // temporary arrays for tracking the edges of the advancing convex hull

	    this._hashSize = Math.ceil(Math.sqrt(n));
	    this._hullPrev = new Uint32Array(n); // edge to prev edge

	    this._hullNext = new Uint32Array(n); // edge to next edge

	    this._hullTri = new Uint32Array(n); // edge to adjacent triangle

	    this._hullHash = new Int32Array(this._hashSize).fill(-1); // angular edge hash
	    // temporary arrays for sorting points

	    this._ids = new Uint32Array(n);
	    this._dists = new Float64Array(n);
	    this.update();
	  }

	  Delaunator.from = function (points) {
	    var n = points.length;
	    var coords = new Float64Array(n);

	    for (var i = 0; i < n; i++) {
	      var p = points[i];
	      coords[i] = p;
	    }

	    return new Delaunator(coords);
	  };

	  Delaunator.fromVecs = function (points) {
	    var ps = [];

	    for (var i = 0; i < points.length; i++) {
	      ps.push(points[i].x, points[i].y);
	    }

	    return Delaunator.from(ps);
	  };

	  Delaunator.prototype.update = function () {
	    var _a = this,
	        coords = _a.coords,
	        hullPrev = _a._hullPrev,
	        hullNext = _a._hullNext,
	        hullTri = _a._hullTri,
	        hullHash = _a._hullHash;

	    var n = coords.length >> 1; // populate an array of point indices; calculate input data bbox

	    var minX = Infinity;
	    var minY = Infinity;
	    var maxX = -Infinity;
	    var maxY = -Infinity;

	    for (var i = 0; i < n; i++) {
	      var x = coords[2 * i];
	      var y = coords[2 * i + 1];
	      if (x < minX) minX = x;
	      if (y < minY) minY = y;
	      if (x > maxX) maxX = x;
	      if (y > maxY) maxY = y;
	      this._ids[i] = i;
	    }

	    var cx = (minX + maxX) / 2;
	    var cy = (minY + maxY) / 2;
	    var minDist = Infinity;
	    var i0 = 0,
	        i1 = 0,
	        i2 = 0; // pick a seed point close to the center

	    for (var i = 0; i < n; i++) {
	      var d = dist(cx, cy, coords[2 * i], coords[2 * i + 1]);

	      if (d < minDist) {
	        i0 = i;
	        minDist = d;
	      }
	    }

	    var i0x = coords[2 * i0];
	    var i0y = coords[2 * i0 + 1];
	    minDist = Infinity; // find the point closest to the seed

	    for (var i = 0; i < n; i++) {
	      if (i === i0) continue;
	      var d = dist(i0x, i0y, coords[2 * i], coords[2 * i + 1]);

	      if (d < minDist && d > 0) {
	        i1 = i;
	        minDist = d;
	      }
	    }

	    var i1x = coords[2 * i1];
	    var i1y = coords[2 * i1 + 1];
	    var minRadius = Infinity; // find the third point which forms the smallest circumcircle with the first two

	    for (var i = 0; i < n; i++) {
	      if (i === i0 || i === i1) continue;
	      var r = circumradius(i0x, i0y, i1x, i1y, coords[2 * i], coords[2 * i + 1]);

	      if (r < minRadius) {
	        i2 = i;
	        minRadius = r;
	      }
	    }

	    var i2x = coords[2 * i2];
	    var i2y = coords[2 * i2 + 1];

	    if (minRadius === Infinity) {
	      // order collinear points by dx (or dy if all x are identical)
	      // and return the list as a hull
	      for (var i = 0; i < n; i++) {
	        this._dists[i] = coords[2 * i] - coords[0] || coords[2 * i + 1] - coords[1];
	      }

	      quicksort(this._ids, this._dists, 0, n - 1);
	      var hull = new Uint32Array(n);
	      var j = 0;

	      for (var i = 0, d0 = -Infinity; i < n; i++) {
	        var id = this._ids[i];

	        if (this._dists[id] > d0) {
	          hull[j++] = id;
	          d0 = this._dists[id];
	        }
	      }

	      this.hull = hull.subarray(0, j);
	      this.triangles = new Uint32Array(0);
	      this.halfedges = new Uint32Array(0);
	      return;
	    } // swap the order of the seed points for counter-clockwise orientation


	    if (orient(i0x, i0y, i1x, i1y, i2x, i2y)) {
	      var i = i1;
	      var x = i1x;
	      var y = i1y;
	      i1 = i2;
	      i1x = i2x;
	      i1y = i2y;
	      i2 = i;
	      i2x = x;
	      i2y = y;
	    }

	    var center = circumcenter(i0x, i0y, i1x, i1y, i2x, i2y);
	    this._cx = center.x;
	    this._cy = center.y;

	    for (var i = 0; i < n; i++) {
	      this._dists[i] = dist(coords[2 * i], coords[2 * i + 1], center.x, center.y);
	    } // sort the points by distance from the seed triangle circumcenter


	    quicksort(this._ids, this._dists, 0, n - 1); // set up the seed triangle as the starting hull

	    this._hullStart = i0;
	    var hullSize = 3;
	    hullNext[i0] = hullPrev[i2] = i1;
	    hullNext[i1] = hullPrev[i0] = i2;
	    hullNext[i2] = hullPrev[i1] = i0;
	    hullTri[i0] = 0;
	    hullTri[i1] = 1;
	    hullTri[i2] = 2;
	    hullHash.fill(-1);
	    hullHash[this._hashKey(i0x, i0y)] = i0;
	    hullHash[this._hashKey(i1x, i1y)] = i1;
	    hullHash[this._hashKey(i2x, i2y)] = i2;
	    this.trianglesLen = 0;

	    this._addTriangle(i0, i1, i2, -1, -1, -1);

	    for (var k = 0, xp = void 0, yp = void 0; k < this._ids.length; k++) {
	      var i = this._ids[k];
	      var x = coords[2 * i];
	      var y = coords[2 * i + 1]; // skip near-duplicate points

	      if (k > 0) if (xp !== undefined && yp !== undefined) {
	        if (Math.abs(x - xp) <= EPSILON && Math.abs(y - yp) <= EPSILON) continue;
	      } else continue;
	      xp = x;
	      yp = y; // skip seed triangle points

	      if (i === i0 || i === i1 || i === i2) continue; // find a visible edge on the convex hull using edge hash

	      var start = 0;

	      for (var j = 0, key = this._hashKey(x, y); j < this._hashSize; j++) {
	        start = hullHash[(key + j) % this._hashSize];
	        if (start !== -1 && start !== hullNext[start]) break;
	      }

	      start = hullPrev[start];
	      var e = start,
	          q = void 0;

	      while (q = hullNext[e], !orient(x, y, coords[2 * e], coords[2 * e + 1], coords[2 * q], coords[2 * q + 1])) {
	        e = q;

	        if (e === start) {
	          e = -1;
	          break;
	        }
	      }

	      if (e === -1) continue; // likely a near-duplicate point; skip it
	      // add the first triangle from the point

	      var t = this._addTriangle(e, i, hullNext[e], -1, -1, hullTri[e]); // recursively flip triangles from the point until they satisfy the Delaunay condition


	      hullTri[i] = this._legalize(t + 2);
	      hullTri[e] = t; // keep track of boundary triangles on the hull

	      hullSize++; // walk forward through the hull, adding more triangles and flipping recursively

	      var n_1 = hullNext[e];

	      while (q = hullNext[n_1], orient(x, y, coords[2 * n_1], coords[2 * n_1 + 1], coords[2 * q], coords[2 * q + 1])) {
	        t = this._addTriangle(n_1, i, q, hullTri[i], -1, hullTri[n_1]);
	        hullTri[i] = this._legalize(t + 2);
	        hullNext[n_1] = n_1; // mark as removed

	        hullSize--;
	        n_1 = q;
	      } // walk backward from the other side, adding more triangles and flipping


	      if (e === start) {
	        while (q = hullPrev[e], orient(x, y, coords[2 * q], coords[2 * q + 1], coords[2 * e], coords[2 * e + 1])) {
	          t = this._addTriangle(q, i, e, -1, hullTri[e], hullTri[q]);

	          this._legalize(t + 2);

	          hullTri[q] = t;
	          hullNext[e] = e; // mark as removed

	          hullSize--;
	          e = q;
	        }
	      } // update the hull indices


	      this._hullStart = hullPrev[i] = e;
	      hullNext[e] = hullPrev[n_1] = i;
	      hullNext[i] = n_1; // save the two new edges in the hash table

	      hullHash[this._hashKey(x, y)] = i;
	      hullHash[this._hashKey(coords[2 * e], coords[2 * e + 1])] = e;
	    }

	    this.hull = new Uint32Array(hullSize);

	    for (var i = 0, e = this._hullStart; i < hullSize; i++) {
	      this.hull[i] = e;
	      e = hullNext[e];
	    } // trim typed triangle mesh arrays


	    this.triangles = this._triangles.subarray(0, this.trianglesLen);
	    this.halfedges = this._halfedges.subarray(0, this.trianglesLen);
	  };

	  Delaunator.prototype._hashKey = function (x, y) {
	    return Math.floor(pseudoAngle(x - this._cx, y - this._cy) * this._hashSize) % this._hashSize;
	  };

	  Delaunator.prototype._legalize = function (a) {
	    var _a = this,
	        triangles = _a._triangles,
	        halfedges = _a._halfedges,
	        coords = _a.coords;

	    var i = 0;
	    var ar = 0; // recursion eliminated with a fixed-size stack

	    while (true) {
	      var b = halfedges[a];
	      /* if the pair of triangles doesn't satisfy the Delaunay condition
	       * (p1 is inside the circumcircle of [p0, pl, pr]), flip them,
	       * then do the same check/flip recursively for the new pair of triangles
	       *
	       *           pl                    pl
	       *          /||\                  /  \
	       *       al/ || \bl            al/    \a
	       *        /  ||  \              /      \
	       *       /  a||b  \    flip    /___ar___\
	       *     p0\   ||   /p1   =>   p0\---bl---/p1
	       *        \  ||  /              \      /
	       *       ar\ || /br             b\    /br
	       *          \||/                  \  /
	       *           pr                    pr
	       */

	      var a0 = a - a % 3;
	      ar = a0 + (a + 2) % 3;

	      if (b === -1) {
	        // convex hull edge
	        if (i === 0) break;
	        a = EDGE_STACK[--i];
	        continue;
	      }

	      var b0 = b - b % 3;
	      var al = a0 + (a + 1) % 3;
	      var bl = b0 + (b + 2) % 3;
	      var p0 = triangles[ar];
	      var pr = triangles[a];
	      var pl = triangles[al];
	      var p1 = triangles[bl];
	      var illegal = inCircle(coords[2 * p0], coords[2 * p0 + 1], coords[2 * pr], coords[2 * pr + 1], coords[2 * pl], coords[2 * pl + 1], coords[2 * p1], coords[2 * p1 + 1]);

	      if (illegal) {
	        triangles[a] = p1;
	        triangles[b] = p0;
	        var hbl = halfedges[bl]; // edge swapped on the other side of the hull (rare); fix the halfedge reference

	        if (hbl === -1) {
	          var e = this._hullStart;

	          do {
	            if (this._hullTri[e] === bl) {
	              this._hullTri[e] = a;
	              break;
	            }

	            e = this._hullPrev[e];
	          } while (e !== this._hullStart);
	        }

	        this._link(a, hbl);

	        this._link(b, halfedges[ar]);

	        this._link(ar, bl);

	        var br = b0 + (b + 1) % 3; // don't worry about hitting the cap: it can only happen on extremely degenerate input

	        if (i < EDGE_STACK.length) {
	          EDGE_STACK[i++] = br;
	        }
	      } else {
	        if (i === 0) break;
	        a = EDGE_STACK[--i];
	      }
	    }

	    return ar;
	  };

	  Delaunator.prototype._link = function (a, b) {
	    this._halfedges[a] = b;
	    if (b !== -1) this._halfedges[b] = a;
	  }; // add a new triangle given vertex indices and adjacent half-edge ids


	  Delaunator.prototype._addTriangle = function (i0, i1, i2, a, b, c) {
	    var t = this.trianglesLen;
	    this._triangles[t] = i0;
	    this._triangles[t + 1] = i1;
	    this._triangles[t + 2] = i2;

	    this._link(t, a);

	    this._link(t + 1, b);

	    this._link(t + 2, c);

	    this.trianglesLen += 3;
	    return t;
	  };

	  return Delaunator;
	}();

	exports.Delaunator = Delaunator; // monotonically increases with real angle, but doesn't need expensive trigonometry

	function pseudoAngle(dx, dy) {
	  var p = dx / (Math.abs(dx) + Math.abs(dy));
	  return (dy > 0 ? 3 - p : 1 + p) / 4; // [0..1]
	}

	function dist(ax, ay, bx, by) {
	  var dx = ax - bx;
	  var dy = ay - by;
	  return dx * dx + dy * dy;
	} // return 2d orientation sign if we're confident in it through J. Shewchuk's error bound check


	function orientIfSure(px, py, rx, ry, qx, qy) {
	  var l = (ry - py) * (qx - px);
	  var r = (rx - px) * (qy - py);
	  return Math.abs(l - r) >= 3.3306690738754716e-16 * Math.abs(l + r) ? l - r : 0;
	} // a more robust orientation test that's stable in a given triangle (to fix robustness issues)


	function orient(rx, ry, qx, qy, px, py) {
	  return (orientIfSure(px, py, rx, ry, qx, qy) || orientIfSure(rx, ry, qx, qy, px, py) || orientIfSure(qx, qy, px, py, rx, ry)) < 0;
	}

	function inCircle(ax, ay, bx, by, cx, cy, px, py) {
	  var dx = ax - px;
	  var dy = ay - py;
	  var ex = bx - px;
	  var ey = by - py;
	  var fx = cx - px;
	  var fy = cy - py;
	  var ap = dx * dx + dy * dy;
	  var bp = ex * ex + ey * ey;
	  var cp = fx * fx + fy * fy;
	  return dx * (ey * cp - bp * fy) - dy * (ex * cp - bp * fx) + ap * (ex * fy - ey * fx) < 0;
	}

	function circumradius(ax, ay, bx, by, cx, cy) {
	  var dx = bx - ax;
	  var dy = by - ay;
	  var ex = cx - ax;
	  var ey = cy - ay;
	  var bl = dx * dx + dy * dy;
	  var cl = ex * ex + ey * ey;
	  var d = 0.5 / (dx * ey - dy * ex);
	  var x = (ey * bl - dy * cl) * d;
	  var y = (dx * cl - ex * bl) * d;
	  return x * x + y * y;
	}

	function circumcenter(ax, ay, bx, by, cx, cy) {
	  var dx = bx - ax;
	  var dy = by - ay;
	  var ex = cx - ax;
	  var ey = cy - ay;
	  var bl = dx * dx + dy * dy;
	  var cl = ex * ex + ey * ey;
	  var d = 0.5 / (dx * ey - dy * ex);
	  var x = ax + (ey * bl - dy * cl) * d;
	  var y = ay + (dx * cl - ex * bl) * d;
	  return {
	    x: x,
	    y: y
	  };
	}

	function quicksort(ids, dists, left, right) {
	  if (right - left <= 20) {
	    for (var i = left + 1; i <= right; i++) {
	      var temp = ids[i];
	      var tempDist = dists[temp];
	      var j = i - 1;

	      while (j >= left && dists[ids[j]] > tempDist) ids[j + 1] = ids[j--];

	      ids[j + 1] = temp;
	    }
	  } else {
	    var median = left + right >> 1;
	    var i = left + 1;
	    var j = right;
	    swap(ids, median, i);
	    if (dists[ids[left]] > dists[ids[right]]) swap(ids, left, right);
	    if (dists[ids[i]] > dists[ids[right]]) swap(ids, i, right);
	    if (dists[ids[left]] > dists[ids[i]]) swap(ids, left, i);
	    var temp = ids[i];
	    var tempDist = dists[temp];

	    while (true) {
	      do i++; while (dists[ids[i]] < tempDist);

	      do j--; while (dists[ids[j]] > tempDist);

	      if (j < i) break;
	      swap(ids, i, j);
	    }

	    ids[left + 1] = ids[j];
	    ids[j] = temp;

	    if (right - i + 1 >= j - left) {
	      quicksort(ids, dists, i, right);
	      quicksort(ids, dists, left, j - 1);
	    } else {
	      quicksort(ids, dists, left, j - 1);
	      quicksort(ids, dists, i, right);
	    }
	  }
	}

	function swap(arr, i, j) {
	  var tmp = arr[i];
	  arr[i] = arr[j];
	  arr[j] = tmp;
	}
	});

	unwrapExports(delaunator);
	var delaunator_1 = delaunator.Delaunator;

	var voronoi = createCommonjsModule(function (module, exports) {

	var __generator = commonjsGlobal && commonjsGlobal.__generator || function (thisArg, body) {
	  var _ = {
	    label: 0,
	    sent: function () {
	      if (t[0] & 1) throw t[1];
	      return t[1];
	    },
	    trys: [],
	    ops: []
	  },
	      f,
	      y,
	      t,
	      g;
	  return g = {
	    next: verb(0),
	    "throw": verb(1),
	    "return": verb(2)
	  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
	    return this;
	  }), g;

	  function verb(n) {
	    return function (v) {
	      return step([n, v]);
	    };
	  }

	  function step(op) {
	    if (f) throw new TypeError("Generator is already executing.");

	    while (_) try {
	      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	      if (y = 0, t) op = [op[0] & 2, t.value];

	      switch (op[0]) {
	        case 0:
	        case 1:
	          t = op;
	          break;

	        case 4:
	          _.label++;
	          return {
	            value: op[1],
	            done: false
	          };

	        case 5:
	          _.label++;
	          y = op[1];
	          op = [0];
	          continue;

	        case 7:
	          op = _.ops.pop();

	          _.trys.pop();

	          continue;

	        default:
	          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
	            _ = 0;
	            continue;
	          }

	          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
	            _.label = op[1];
	            break;
	          }

	          if (op[0] === 6 && _.label < t[1]) {
	            _.label = t[1];
	            t = op;
	            break;
	          }

	          if (t && _.label < t[2]) {
	            _.label = t[2];

	            _.ops.push(op);

	            break;
	          }

	          if (t[2]) _.ops.pop();

	          _.trys.pop();

	          continue;
	      }

	      op = body.call(thisArg, _);
	    } catch (e) {
	      op = [6, e];
	      y = 0;
	    } finally {
	      f = t = 0;
	    }

	    if (op[0] & 5) throw op[1];
	    return {
	      value: op[0] ? op[1] : void 0,
	      done: true
	    };
	  }
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Voronoi = void 0;

	var Polygon =
	/** @class */
	function () {
	  function Polygon() {
	    this._ = [];
	  }

	  Polygon.prototype.moveTo = function (x, y) {
	    this._.push([x, y]);
	  };

	  Polygon.prototype.closePath = function () {
	    this._.push(this._[0].slice());
	  };

	  Polygon.prototype.lineTo = function (x, y) {
	    this._.push([x, y]);
	  };

	  Polygon.prototype.value = function () {
	    return this._.length ? this._ : null;
	  };

	  return Polygon;
	}();

	var Voronoi =
	/** @class */
	function () {
	  function Voronoi(delaunay, _a) {
	    var _b = _a === void 0 ? [0, 0, 960, 500] : _a,
	        xmin = _b[0],
	        ymin = _b[1],
	        xmax = _b[2],
	        ymax = _b[3];

	    if (!((xmax = +xmax) >= (xmin = +xmin)) || !((ymax = +ymax) >= (ymin = +ymin))) throw new Error("invalid bounds");
	    this.delaunay = delaunay;
	    this._circumcenters = new Float64Array(delaunay.points.length);
	    this.vectors = new Float64Array(delaunay.points.length);
	    this.xmax = xmax, this.xmin = xmin;
	    this.ymax = ymax, this.ymin = ymin;

	    this._init();
	  }

	  Voronoi.prototype.update = function () {
	    this.delaunay.update();

	    this._init();

	    return this;
	  };

	  Voronoi.prototype._init = function () {
	    var _a = this,
	        _b = _a.delaunay,
	        points = _b.points,
	        hull = _b.hull,
	        triangles = _b.triangles,
	        vectors = _a.vectors; // Compute circumcenters.


	    var circumcenters = this.circumcenters = this._circumcenters.subarray(0, triangles.length / 3 * 2);

	    for (var i = 0, j = 0, n = triangles.length, x = void 0, y = void 0; i < n; i += 3, j += 2) {
	      var t1 = triangles[i] * 2;
	      var t2 = triangles[i + 1] * 2;
	      var t3 = triangles[i + 2] * 2;
	      var x1_1 = points[t1];
	      var y1_1 = points[t1 + 1];
	      var x2 = points[t2];
	      var y2 = points[t2 + 1];
	      var x3 = points[t3];
	      var y3 = points[t3 + 1];
	      var dx = x2 - x1_1;
	      var dy = y2 - y1_1;
	      var ex = x3 - x1_1;
	      var ey = y3 - y1_1;
	      var bl = dx * dx + dy * dy;
	      var cl = ex * ex + ey * ey;
	      var ab = (dx * ey - dy * ex) * 2;

	      if (!ab) {
	        // degenerate case (collinear diagram)
	        x = (x1_1 + x3) / 2 - 1e8 * ey;
	        y = (y1_1 + y3) / 2 + 1e8 * ex;
	      } else if (Math.abs(ab) < 1e-8) {
	        // almost equal points (degenerate triangle)
	        x = (x1_1 + x3) / 2;
	        y = (y1_1 + y3) / 2;
	      } else {
	        var d = 1 / ab;
	        x = x1_1 + (ey * bl - dy * cl) * d;
	        y = y1_1 + (dx * cl - ex * bl) * d;
	      }

	      circumcenters[j] = x;
	      circumcenters[j + 1] = y;
	    } // Compute exterior cell rays.


	    var h = hull[hull.length - 1];
	    var p0,
	        p1 = h * 4;
	    var x0,
	        x1 = points[2 * h];
	    var y0,
	        y1 = points[2 * h + 1];
	    vectors.fill(0);

	    for (var i = 0; i < hull.length; ++i) {
	      h = hull[i];
	      p0 = p1, x0 = x1, y0 = y1;
	      p1 = h * 4, x1 = points[2 * h], y1 = points[2 * h + 1];
	      vectors[p0 + 2] = vectors[p1] = y0 - y1;
	      vectors[p0 + 3] = vectors[p1 + 1] = x1 - x0;
	    }
	  };

	  Voronoi.prototype.cellPolygons = function () {
	    var points, i, n, cell;
	    return __generator(this, function (_a) {
	      switch (_a.label) {
	        case 0:
	          points = this.delaunay.points;
	          i = 0, n = points.length / 2;
	          _a.label = 1;

	        case 1:
	          if (!(i < n)) return [3
	          /*break*/
	          , 4];
	          cell = this.cellPolygon(i);
	          if (!cell) return [3
	          /*break*/
	          , 3];
	          cell.index = i;
	          return [4
	          /*yield*/
	          , cell];

	        case 2:
	          _a.sent();

	          _a.label = 3;

	        case 3:
	          ++i;
	          return [3
	          /*break*/
	          , 1];

	        case 4:
	          return [2
	          /*return*/
	          ];
	      }
	    });
	  };

	  Voronoi.prototype.cellPolygon = function (i) {
	    var polygon = new Polygon();
	    return polygon.value();
	  };

	  Voronoi.prototype._renderSegment = function (x0, y0, x1, y1, context) {
	    var S;

	    var c0 = this._regioncode(x0, y0);

	    var c1 = this._regioncode(x1, y1);

	    if (c0 === 0 && c1 === 0) {
	      context.moveTo(x0, y0);
	      context.lineTo(x1, y1);
	    } else if (S = this._clipSegment(x0, y0, x1, y1, c0, c1)) {
	      context.moveTo(S[0], S[1]);
	      context.lineTo(S[2], S[3]);
	    }
	  };

	  Voronoi.prototype.contains = function (i, x, y) {
	    if ((x = +x, x !== x) || (y = +y, y !== y)) return false;
	    return this.delaunay._step(i, x, y) === i;
	  };

	  Voronoi.prototype.neighbors = function (i) {
	    var ci, _i, _a, j, cj, ai, li, aj, lj;

	    return __generator(this, function (_b) {
	      switch (_b.label) {
	        case 0:
	          ci = this._clip(i);
	          if (!ci) return [3
	          /*break*/
	          , 8];
	          _i = 0, _a = this.delaunay.neighbors(i);
	          _b.label = 1;

	        case 1:
	          if (!(_i < _a.length)) return [3
	          /*break*/
	          , 8];
	          j = _a[_i];
	          cj = this._clip(j);
	          if (!cj) return [3
	          /*break*/
	          , 7];
	          ai = 0, li = ci.length;
	          _b.label = 2;

	        case 2:
	          if (!(ai < li)) return [3
	          /*break*/
	          , 7];
	          aj = 0, lj = cj.length;
	          _b.label = 3;

	        case 3:
	          if (!(aj < lj)) return [3
	          /*break*/
	          , 6];
	          if (!(ci[ai] == cj[aj] && ci[ai + 1] == cj[aj + 1] && ci[(ai + 2) % li] == cj[(aj + lj - 2) % lj] && ci[(ai + 3) % li] == cj[(aj + lj - 1) % lj])) return [3
	          /*break*/
	          , 5];
	          return [4
	          /*yield*/
	          , j];

	        case 4:
	          _b.sent();

	          return [3
	          /*break*/
	          , 7];

	        case 5:
	          aj += 2;
	          return [3
	          /*break*/
	          , 3];

	        case 6:
	          ai += 2;
	          return [3
	          /*break*/
	          , 2];

	        case 7:
	          _i++;
	          return [3
	          /*break*/
	          , 1];

	        case 8:
	          return [2
	          /*return*/
	          ];
	      }
	    });
	  };

	  Voronoi.prototype._cell = function (i) {
	    var _a = this,
	        circumcenters = _a.circumcenters,
	        _b = _a.delaunay,
	        inedges = _b.inedges,
	        halfedges = _b.halfedges,
	        triangles = _b.triangles;

	    var e0 = inedges[i];
	    if (e0 === -1) return null; // coincident point

	    var points = [];
	    var e = e0;

	    do {
	      var t = Math.floor(e / 3);
	      points.push(circumcenters[t * 2], circumcenters[t * 2 + 1]);
	      e = e % 3 === 2 ? e - 2 : e + 1;
	      if (triangles[e] !== i) break; // bad triangulation

	      e = halfedges[e];
	    } while (e !== e0 && e !== -1);

	    return points;
	  };

	  Voronoi.prototype._clip = function (i) {
	    // degenerate case (1 valid point: return the box)
	    if (i === 0 && this.delaunay.hull.length === 1) {
	      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
	    }

	    var points = this._cell(i);

	    if (points === null) return null;
	    var V = this.vectors;
	    var v = i * 4;
	    return V[v] || V[v + 1] ? this._clipInfinite(i, points, V[v], V[v + 1], V[v + 2], V[v + 3]) : this._clipFinite(i, points);
	  };

	  Voronoi.prototype._clipFinite = function (i, points) {
	    var n = points.length;
	    var P = null;
	    var x0,
	        y0,
	        x1 = points[n - 2],
	        y1 = points[n - 1];

	    var c0,
	        c1 = this._regioncode(x1, y1);

	    var e0, e1;

	    for (var j = 0; j < n; j += 2) {
	      x0 = x1, y0 = y1, x1 = points[j], y1 = points[j + 1];
	      c0 = c1, c1 = this._regioncode(x1, y1);

	      if (c0 === 0 && c1 === 0) {
	        e0 = e1, e1 = 0;
	        if (P) P.push(x1, y1);else P = [x1, y1];
	      } else {
	        var S = void 0,
	            sx0 = void 0,
	            sy0 = void 0,
	            sx1 = void 0,
	            sy1 = void 0;

	        if (c0 === 0) {
	          if ((S = this._clipSegment(x0, y0, x1, y1, c0, c1)) === null) continue;
	          sx0 = S[0], sy0 = S[1], sx1 = S[2], sy1 = S[3];
	        } else {
	          if ((S = this._clipSegment(x1, y1, x0, y0, c1, c0)) === null) continue;
	          sx1 = S[0], sy1 = S[1], sx0 = S[2], sy0 = S[3];
	          e0 = e1, e1 = this._edgecode(sx0, sy0);
	          if (e0 && e1) this._edge(i, e0, e1, P, P.length);
	          if (P) P.push(sx0, sy0);else P = [sx0, sy0];
	        }

	        e0 = e1, e1 = this._edgecode(sx1, sy1);
	        if (e0 && e1) this._edge(i, e0, e1, P, P.length);
	        if (P) P.push(sx1, sy1);else P = [sx1, sy1];
	      }
	    }

	    if (P) {
	      e0 = e1, e1 = this._edgecode(P[0], P[1]);
	      if (e0 && e1) this._edge(i, e0, e1, P, P.length);
	    } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
	      return [this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax, this.xmin, this.ymin];
	    }

	    return P;
	  };

	  Voronoi.prototype._clipSegment = function (x0, y0, x1, y1, c0, c1) {
	    while (true) {
	      if (c0 === 0 && c1 === 0) return [x0, y0, x1, y1];
	      if (c0 & c1) return null;
	      var x = void 0,
	          y = void 0,
	          c = c0 || c1;
	      if (c & 8) x = x0 + (x1 - x0) * (this.ymax - y0) / (y1 - y0), y = this.ymax;else if (c & 4) x = x0 + (x1 - x0) * (this.ymin - y0) / (y1 - y0), y = this.ymin;else if (c & 2) y = y0 + (y1 - y0) * (this.xmax - x0) / (x1 - x0), x = this.xmax;else y = y0 + (y1 - y0) * (this.xmin - x0) / (x1 - x0), x = this.xmin;
	      if (c0) x0 = x, y0 = y, c0 = this._regioncode(x0, y0);else x1 = x, y1 = y, c1 = this._regioncode(x1, y1);
	    }
	  };

	  Voronoi.prototype._clipInfinite = function (i, points, vx0, vy0, vxn, vyn) {
	    var P = Array.from(points),
	        p;
	    if (p = this._project(P[0], P[1], vx0, vy0)) P.unshift(p[0], p[1]);
	    if (p = this._project(P[P.length - 2], P[P.length - 1], vxn, vyn)) P.push(p[0], p[1]);

	    if (P = this._clipFinite(i, P)) {
	      for (var j = 0, n = P.length, c0 = void 0, c1 = this._edgecode(P[n - 2], P[n - 1]); j < n; j += 2) {
	        c0 = c1, c1 = this._edgecode(P[j], P[j + 1]);
	        if (c0 && c1) j = this._edge(i, c0, c1, P, j), n = P.length;
	      }
	    } else if (this.contains(i, (this.xmin + this.xmax) / 2, (this.ymin + this.ymax) / 2)) {
	      P = [this.xmin, this.ymin, this.xmax, this.ymin, this.xmax, this.ymax, this.xmin, this.ymax];
	    }

	    return P;
	  };

	  Voronoi.prototype._edge = function (i, e0, e1, P, j) {
	    while (e0 !== e1) {
	      var x = void 0,
	          y = void 0;

	      switch (e0) {
	        case 5:
	          e0 = 4;
	          continue;
	        // top-left

	        case 4:
	          e0 = 6, x = this.xmax, y = this.ymin;
	          break;
	        // top

	        case 6:
	          e0 = 2;
	          continue;
	        // top-right

	        case 2:
	          e0 = 10, x = this.xmax, y = this.ymax;
	          break;
	        // right

	        case 10:
	          e0 = 8;
	          continue;
	        // bottom-right

	        case 8:
	          e0 = 9, x = this.xmin, y = this.ymax;
	          break;
	        // bottom

	        case 9:
	          e0 = 1;
	          continue;
	        // bottom-left

	        case 1:
	          e0 = 5, x = this.xmin, y = this.ymin;
	          break;
	        // left
	      }

	      if ((P[j] !== x || P[j + 1] !== y) && this.contains(i, x, y)) {
	        P.splice(j, 0, x, y), j += 2;
	      }
	    }

	    if (P.length > 4) {
	      for (var i_1 = 0; i_1 < P.length; i_1 += 2) {
	        var j_1 = (i_1 + 2) % P.length,
	            k = (i_1 + 4) % P.length;
	        if (P[i_1] === P[j_1] && P[j_1] === P[k] || P[i_1 + 1] === P[j_1 + 1] && P[j_1 + 1] === P[k + 1]) P.splice(j_1, 2), i_1 -= 2;
	      }
	    }

	    return j;
	  };

	  Voronoi.prototype._project = function (x0, y0, vx, vy) {
	    var t = Infinity,
	        c,
	        x,
	        y;

	    if (vy < 0) {
	      // top
	      if (y0 <= this.ymin) return null;
	      if ((c = (this.ymin - y0) / vy) < t) y = this.ymin, x = x0 + (t = c) * vx;
	    } else if (vy > 0) {
	      // bottom
	      if (y0 >= this.ymax) return null;
	      if ((c = (this.ymax - y0) / vy) < t) y = this.ymax, x = x0 + (t = c) * vx;
	    }

	    if (vx > 0) {
	      // right
	      if (x0 >= this.xmax) return null;
	      if ((c = (this.xmax - x0) / vx) < t) x = this.xmax, y = y0 + (t = c) * vy;
	    } else if (vx < 0) {
	      // left
	      if (x0 <= this.xmin) return null;
	      if ((c = (this.xmin - x0) / vx) < t) x = this.xmin, y = y0 + (t = c) * vy;
	    }

	    return [x, y];
	  };

	  Voronoi.prototype._edgecode = function (x, y) {
	    return (x === this.xmin ? 1 : x === this.xmax ? 2 : 0) | (y === this.ymin ? 4 : y === this.ymax ? 8 : 0);
	  };

	  Voronoi.prototype._regioncode = function (x, y) {
	    return (x < this.xmin ? 1 : x > this.xmax ? 2 : 0) | (y < this.ymin ? 4 : y > this.ymax ? 8 : 0);
	  };

	  return Voronoi;
	}();

	exports.Voronoi = Voronoi;
	});

	unwrapExports(voronoi);
	var voronoi_1 = voronoi.Voronoi;

	var delaunay = createCommonjsModule(function (module, exports) {

	var __generator = commonjsGlobal && commonjsGlobal.__generator || function (thisArg, body) {
	  var _ = {
	    label: 0,
	    sent: function () {
	      if (t[0] & 1) throw t[1];
	      return t[1];
	    },
	    trys: [],
	    ops: []
	  },
	      f,
	      y,
	      t,
	      g;
	  return g = {
	    next: verb(0),
	    "throw": verb(1),
	    "return": verb(2)
	  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
	    return this;
	  }), g;

	  function verb(n) {
	    return function (v) {
	      return step([n, v]);
	    };
	  }

	  function step(op) {
	    if (f) throw new TypeError("Generator is already executing.");

	    while (_) try {
	      if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	      if (y = 0, t) op = [op[0] & 2, t.value];

	      switch (op[0]) {
	        case 0:
	        case 1:
	          t = op;
	          break;

	        case 4:
	          _.label++;
	          return {
	            value: op[1],
	            done: false
	          };

	        case 5:
	          _.label++;
	          y = op[1];
	          op = [0];
	          continue;

	        case 7:
	          op = _.ops.pop();

	          _.trys.pop();

	          continue;

	        default:
	          if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
	            _ = 0;
	            continue;
	          }

	          if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
	            _.label = op[1];
	            break;
	          }

	          if (op[0] === 6 && _.label < t[1]) {
	            _.label = t[1];
	            t = op;
	            break;
	          }

	          if (t && _.label < t[2]) {
	            _.label = t[2];

	            _.ops.push(op);

	            break;
	          }

	          if (t[2]) _.ops.pop();

	          _.trys.pop();

	          continue;
	      }

	      op = body.call(thisArg, _);
	    } catch (e) {
	      op = [6, e];
	      y = 0;
	    } finally {
	      f = t = 0;
	    }

	    if (op[0] & 5) throw op[1];
	    return {
	      value: op[0] ? op[1] : void 0,
	      done: true
	    };
	  }
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});





	var pow = Math.pow; // 如果三角剖分的所有三角形都具有非空区域，则三角剖分是共线的

	function collinear(d) {
	  var triangles = d.triangles,
	      coords = d.coords;

	  for (var i = 0; i < triangles.length; i += 3) {
	    var a = 2 * triangles[i],
	        b = 2 * triangles[i + 1],
	        c = 2 * triangles[i + 2],
	        cross = (coords[c] - coords[a]) * (coords[b + 1] - coords[a + 1]) - (coords[b] - coords[a]) * (coords[c + 1] - coords[a + 1]);
	    if (cross > 1e-10) return false;
	  }

	  return true;
	}

	function jitter(x, y, r) {
	  return [x + Math.sin(x + y) * r, y + Math.cos(x - y) * r];
	}

	var Delaunay =
	/** @class */
	function () {
	  function Delaunay(points) {
	    this._delaunator = new delaunator.Delaunator(points);
	    this.inedges = new Int32Array(points.length / 2);
	    this._hullIndex = new Int32Array(points.length / 2);
	    this.points = this._delaunator.coords;

	    this._init();
	  }

	  Delaunay.from = function (points) {
	    return new Delaunay(new Float64Array(points));
	  };

	  Delaunay.prototype.update = function () {
	    this._delaunator.update();

	    this._init();

	    return this;
	  };

	  Delaunay.prototype._init = function () {
	    var d = this._delaunator,
	        points = this.points; // check for collinear

	    if (d.hull && d.hull.length > 2 && collinear(d)) {
	      this.collinear = Int32Array.from({
	        length: points.length / 2
	      }, function (_, i) {
	        return i;
	      }).sort(function (i, j) {
	        return points[2 * i] - points[2 * j] || points[2 * i + 1] - points[2 * j + 1];
	      }); // for exact neighbors

	      var e = this.collinear[0],
	          f = this.collinear[this.collinear.length - 1],
	          bounds = [points[2 * e], points[2 * e + 1], points[2 * f], points[2 * f + 1]],
	          r = 1e-8 * Math.hypot(bounds[3] - bounds[1], bounds[2] - bounds[0]);

	      for (var i = 0, n = points.length / 2; i < n; ++i) {
	        var p = jitter(points[2 * i], points[2 * i + 1], r);
	        points[2 * i] = p[0];
	        points[2 * i + 1] = p[1];
	      }

	      this._delaunator = new delaunator.Delaunator(points);
	    } else {
	      delete this.collinear;
	    }

	    var halfedges = this.halfedges = this._delaunator.halfedges;
	    var hull = this.hull = this._delaunator.hull;
	    var triangles = this.triangles = this._delaunator.triangles;
	    var inedges = this.inedges.fill(-1);

	    var hullIndex = this._hullIndex.fill(-1); // Compute an index from each point to an (arbitrary) incoming halfedge
	    // Used to give the first neighbor of each point; for this reason,
	    // on the hull we give priority to exterior halfedges


	    for (var e = 0, n = halfedges.length; e < n; ++e) {
	      var p = triangles[e % 3 === 2 ? e - 2 : e + 1];
	      if (halfedges[e] === -1 || inedges[p] === -1) inedges[p] = e;
	    }

	    for (var i = 0, n = hull.length; i < n; ++i) {
	      hullIndex[hull[i]] = i;
	    } // degenerate case: 1 or 2 (distinct) points


	    if (hull.length <= 2 && hull.length > 0) {
	      this.triangles = new Uint32Array(3).fill(-1);
	      this.halfedges = new Uint32Array(3).fill(-1);
	      this.triangles[0] = hull[0];
	      this.triangles[1] = hull[1];
	      this.triangles[2] = hull[1];
	      inedges[hull[0]] = 1;
	      if (hull.length === 2) inedges[hull[1]] = 0;
	    }
	  };

	  Delaunay.prototype.voronoi = function (bounds) {
	    return new voronoi.Voronoi(this, bounds);
	  };

	  Delaunay.prototype.neighbors = function (i) {
	    var _a, inedges, hull, _hullIndex, halfedges, triangles, collinear, l, e0, e, p0, p;

	    return __generator(this, function (_b) {
	      switch (_b.label) {
	        case 0:
	          _a = this, inedges = _a.inedges, hull = _a.hull, _hullIndex = _a._hullIndex, halfedges = _a.halfedges, triangles = _a.triangles, collinear = _a.collinear;
	          if (!collinear) return [3
	          /*break*/
	          , 5];
	          l = collinear.indexOf(i);
	          if (!(l > 0)) return [3
	          /*break*/
	          , 2];
	          return [4
	          /*yield*/
	          , collinear[l - 1]];

	        case 1:
	          _b.sent();

	          _b.label = 2;

	        case 2:
	          if (!(l < collinear.length - 1)) return [3
	          /*break*/
	          , 4];
	          return [4
	          /*yield*/
	          , collinear[l + 1]];

	        case 3:
	          _b.sent();

	          _b.label = 4;

	        case 4:
	          return [2
	          /*return*/
	          ];

	        case 5:
	          e0 = inedges[i];
	          if (e0 === -1) return [2
	          /*return*/
	          ]; // coincident point

	          e = e0, p0 = -1;
	          _b.label = 6;

	        case 6:
	          return [4
	          /*yield*/
	          , p0 = triangles[e]];

	        case 7:
	          _b.sent();

	          e = e % 3 === 2 ? e - 2 : e + 1;
	          if (triangles[e] !== i) return [2
	          /*return*/
	          ]; // bad triangulation

	          e = halfedges[e];
	          if (!(e === -1)) return [3
	          /*break*/
	          , 10];
	          p = hull[(_hullIndex[i] + 1) % hull.length];
	          if (!(p !== p0)) return [3
	          /*break*/
	          , 9];
	          return [4
	          /*yield*/
	          , p];

	        case 8:
	          _b.sent();

	          _b.label = 9;

	        case 9:
	          return [2
	          /*return*/
	          ];

	        case 10:
	          if (e !== e0) return [3
	          /*break*/
	          , 6];
	          _b.label = 11;

	        case 11:
	          return [2
	          /*return*/
	          ];
	      }
	    });
	  };

	  Delaunay.prototype.find = function (x, y, i) {
	    if (i === void 0) {
	      i = 0;
	    }

	    if ((x = +x, x !== x) || (y = +y, y !== y)) return -1;
	    var i0 = i;
	    var c;

	    while ((c = this._step(i, x, y)) >= 0 && c !== i && c !== i0) i = c;

	    return c;
	  };

	  Delaunay.prototype._step = function (i, x, y) {
	    var _a = this,
	        inedges = _a.inedges,
	        hull = _a.hull,
	        _hullIndex = _a._hullIndex,
	        halfedges = _a.halfedges,
	        triangles = _a.triangles,
	        points = _a.points;

	    if (inedges[i] === -1 || !points.length) return (i + 1) % (points.length >> 1);
	    var c = i;
	    var dc = pow(x - points[i * 2], 2) + pow(y - points[i * 2 + 1], 2);
	    var e0 = inedges[i];
	    var e = e0;

	    do {
	      var t = triangles[e];
	      var dt = pow(x - points[t * 2], 2) + pow(y - points[t * 2 + 1], 2);
	      if (dt < dc) dc = dt, c = t;
	      e = e % 3 === 2 ? e - 2 : e + 1;
	      if (triangles[e] !== i) break; // bad triangulation

	      e = halfedges[e];

	      if (e === -1) {
	        e = hull[(_hullIndex[i] + 1) % hull.length];

	        if (e !== t) {
	          if (pow(x - points[e * 2], 2) + pow(y - points[e * 2 + 1], 2) < dc) return e;
	        }

	        break;
	      }
	    } while (e !== e0);

	    return c;
	  };

	  return Delaunay;
	}();

	exports.default = Delaunay;
	});

	unwrapExports(delaunay);

	var Capsule_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Capsule = void 0;



	var Capsule =
	/** @class */
	function (_super) {
	  __extends(Capsule, _super);
	  /**
	   * 胶囊体
	   * @param {Point|Vec3} p0 点0
	   * @param {Point|Vec3} p1 点1
	   * @param {Number} radius  半径
	   */


	  function Capsule(p0, p1, radius) {
	    if (radius === void 0) {
	      radius = 0;
	    }

	    var _this = _super.call(this, p0, p1) || this;

	    _this.radius = radius;
	    return _this;
	  }

	  return Capsule;
	}(Segment_1.Segment);

	exports.Capsule = Capsule;
	});

	unwrapExports(Capsule_1);
	var Capsule_2 = Capsule_1.Capsule;

	var Disk_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.disk = exports.Disk = void 0;



	var Disk =
	/** @class */
	function () {
	  function Disk(center, radius, normal) {
	    if (normal === void 0) {
	      normal = Vec3_1.Vec3.UnitY;
	    }

	    this.center = center || (0, Vec3_1.v3)();
	    this.normal = normal;
	    this.radius = radius || 0;
	    this.w = this.normal.dot(center);
	  }

	  Disk.prototype.area = function () {
	    return Math.PI * this.radius * this.radius;
	  };

	  return Disk;
	}();

	exports.Disk = Disk;

	function disk(center, radius, normal) {
	  return new Disk(center, radius, normal);
	}

	exports.disk = disk;
	});

	unwrapExports(Disk_1);
	var Disk_2 = Disk_1.disk;
	var Disk_3 = Disk_1.Disk;

	var Point_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Point = void 0;



	var Point =
	/** @class */
	function (_super) {
	  __extends(Point, _super);

	  function Point(_x, _y, _z) {
	    if (_x === void 0) {
	      _x = 0;
	    }

	    if (_y === void 0) {
	      _y = 0;
	    }

	    if (_z === void 0) {
	      _z = 0;
	    }

	    return _super.call(this, _x, _y, _z) || this;
	  }

	  return Point;
	}(Vec3_1.Vec3);

	exports.Point = Point;
	});

	unwrapExports(Point_1);
	var Point_2 = Point_1.Point;

	var Ray_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Ray = void 0;



	var Ray =
	/** @class */
	function () {
	  function Ray(origin, direction) {
	    this.origin = origin;
	    this.direction = direction.normalize();
	  }
	  /**
	  * 射线到射线的距离
	  * @param  {Ray} ray
	  */


	  Ray.prototype.distanceRay = function (ray) {
	    var result = {
	      parameters: [],
	      closests: []
	    };
	    var diff = this.origin.clone().sub(ray.origin);
	    var a01 = -this.direction.dot(ray.direction);
	    var b0 = diff.dot(this.direction),
	        b1;
	    var s0, s1;

	    if (Math.abs(a01) < 1) {
	      // 射线不平行
	      b1 = -diff.dot(ray.direction);
	      s0 = a01 * b1 - b0;
	      s1 = a01 * b0 - b1;

	      if (s0 >= 0) {
	        if (s1 >= 0) // region 0 (interior)
	          {
	            // Minimum at two interior points of rays.
	            var det = 1 - a01 * a01;
	            s0 /= det;
	            s1 /= det;
	          } else // region 3 (side)
	          {
	            s1 = 0;

	            if (b0 >= 0) {
	              s0 = 0;
	            } else {
	              s0 = -b0;
	            }
	          }
	      } else {
	        if (s1 >= 0) // region 1 (side)
	          {
	            s0 = 0;

	            if (b1 >= 0) {
	              s1 = 0;
	            } else {
	              s1 = -b1;
	            }
	          } else // region 2 (corner)
	          {
	            if (b0 < 0) {
	              s0 = -b0;
	              s1 = 0;
	            } else {
	              s0 = 0;

	              if (b1 >= 0) {
	                s1 = 0;
	              } else {
	                s1 = -b1;
	              }
	            }
	          }
	      }
	    } else {
	      // Rays are parallel.
	      if (a01 > 0) {
	        // Opposite direction vectors.
	        s1 = 0;

	        if (b0 >= 0) {
	          s0 = 0;
	        } else {
	          s0 = -b0;
	        }
	      } else {
	        // Same direction vectors.
	        if (b0 >= 0) {
	          b1 = -diff.dot(ray.direction);
	          s0 = 0;
	          s1 = -b1;
	        } else {
	          s0 = -b0;
	          s1 = 0;
	        }
	      }
	    }

	    result.parameters[0] = s0;
	    result.parameters[1] = s1;
	    result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
	    result.closests[1] = ray.direction.clone().multiplyScalar(s1).add(ray.origin);
	    diff = result.closests[0].clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };
	  /**
	   * 射线到线段的距离
	   * @param segment
	   */


	  Ray.prototype.distanceSegment = function (segment) {
	    var result = {
	      parameters: [],
	      closests: []
	    }; // segment.GetCenteredForm(segCenter, segDirection, segExtent);

	    var segCenter = segment.center;
	    var segDirection = segment.direction;
	    var segExtent = segment.extent * 0.5;
	    var diff = this.origin.clone().sub(segCenter);
	    var a01 = -this.direction.dot(segDirection);
	    var b0 = diff.dot(this.direction);
	    var s0, s1;

	    if (Math.abs(a01) < 1) {
	      // The ray and segment are not parallel.
	      var det = 1 - a01 * a01;
	      var extDet = segExtent * det;
	      var b1 = -diff.dot(segDirection);
	      s0 = a01 * b1 - b0;
	      s1 = a01 * b0 - b1;

	      if (s0 >= 0) {
	        if (s1 >= -extDet) {
	          if (s1 <= extDet) // region 0
	            {
	              // Minimum at interior points of ray and segment.
	              s0 /= det;
	              s1 /= det;
	            } else // region 1
	            {
	              s1 = segExtent;
	              s0 = Math.max(-(a01 * s1 + b0), 0);
	            }
	        } else // region 5
	          {
	            s1 = -segExtent;
	            s0 = Math.max(-(a01 * s1 + b0), 0);
	          }
	      } else {
	        if (s1 <= -extDet) // region 4
	          {
	            s0 = -(-a01 * segExtent + b0);

	            if (s0 > 0) {
	              s1 = -segExtent;
	            } else {
	              s0 = 0;
	              s1 = -b1;

	              if (s1 < -segExtent) {
	                s1 = -segExtent;
	              } else if (s1 > segExtent) {
	                s1 = segExtent;
	              }
	            }
	          } else if (s1 <= extDet) // region 3
	          {
	            s0 = 0;
	            s1 = -b1;

	            if (s1 < -segExtent) {
	              s1 = -segExtent;
	            } else if (s1 > segExtent) {
	              s1 = segExtent;
	            }
	          } else // region 2
	          {
	            s0 = -(a01 * segExtent + b0);

	            if (s0 > 0) {
	              s1 = segExtent;
	            } else {
	              s0 = 0;
	              s1 = -b1;

	              if (s1 < -segExtent) {
	                s1 = -segExtent;
	              } else if (s1 > segExtent) {
	                s1 = segExtent;
	              }
	            }
	          }
	      }
	    } else {
	      // Ray and segment are parallel.
	      if (a01 > 0) {
	        // Opposite direction vectors.
	        s1 = -segExtent;
	      } else {
	        // Same direction vectors.
	        s1 = segExtent;
	      }

	      s0 = Math.max(-(a01 * s1 + b0), 0);
	    }

	    result.parameters[0] = s0;
	    result.parameters[1] = s1;
	    result.closests[0] = this.direction.clone().multiplyScalar(s0).add(this.origin);
	    result.closests[1] = segDirection.clone().multiplyScalar(s1).add(segCenter);
	    diff = result.closests[0].clone().sub(result.closests[1]);
	    result.distanceSqr = diff.dot(diff);
	    result.distance = Math.sqrt(result.distanceSqr);
	    return result;
	  };

	  Ray.prototype.distanceTriangle = function (triangle) {
	    var result = {
	      parameters: [],
	      closests: [],
	      triangleParameters: []
	    };
	    var line = new Line_1.Line(this.origin, this.origin.clone().add(this.direction)); // DCPQuery < Real, Line3 < Real >, Triangle3 < Real >> ltQuery;

	    var ltResult = line.distanceTriangle(triangle);

	    if (ltResult.lineParameter >= 0) {
	      //最近点在直线前半部分部分，涉嫌方向
	      result.distance = ltResult.distance;
	      result.distanceSqr = ltResult.distanceSqr;
	      result.rayParameter = ltResult.lineParameter;
	      result.triangleParameters[0] = ltResult.triangleParameters[0];
	      result.triangleParameters[1] = ltResult.triangleParameters[1];
	      result.triangleParameters[2] = ltResult.triangleParameters[2];
	      result.closests[0] = ltResult.closests[0];
	      result.closests[1] = ltResult.closests[1];
	    } else {
	      var ptResult = this.origin.clone().distanceTriangle(triangle);
	      result.distance = ptResult.distance;
	      result.distanceSqr = ptResult.distanceSqr;
	      result.rayParameter = 0;
	      result.triangleParameters[0] = ptResult.triangleParameters[0];
	      result.triangleParameters[1] = ptResult.triangleParameters[1];
	      result.triangleParameters[2] = ptResult.triangleParameters[2];
	      result.closests[0] = this.origin;
	      result.closests[1] = ptResult.closests[1];
	    }

	    return result;
	  };

	  Ray.prototype.distancePloyline = function () {
	    var result = {};
	    return result;
	  };

	  return Ray;
	}();

	exports.Ray = Ray;
	});

	unwrapExports(Ray_1);
	var Ray_2 = Ray_1.Ray;

	var Triangle_1 = createCommonjsModule(function (module, exports) {

	var __extends = commonjsGlobal && commonjsGlobal.__extends || function () {
	  var extendStatics = function (d, b) {
	    extendStatics = Object.setPrototypeOf || {
	      __proto__: []
	    } instanceof Array && function (d, b) {
	      d.__proto__ = b;
	    } || function (d, b) {
	      for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
	    };

	    return extendStatics(d, b);
	  };

	  return function (d, b) {
	    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	    extendStatics(d, b);

	    function __() {
	      this.constructor = d;
	    }

	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	  };
	}();

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Triangle = void 0;

	var Triangle =
	/** @class */
	function (_super) {
	  __extends(Triangle, _super);

	  function Triangle(_p0, _p1, _p2) {
	    var _this = _super.call(this) || this;

	    Object.setPrototypeOf(_this, Triangle.prototype);

	    _this.push(_p0, _p1, _p2);

	    return _this;
	  }

	  Object.defineProperty(Triangle.prototype, "p0", {
	    get: function () {
	      return this[0];
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Triangle.prototype, "p1", {
	    get: function () {
	      return this[1];
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Triangle.prototype, "p2", {
	    get: function () {
	      return this[2];
	    },
	    enumerable: false,
	    configurable: true
	  }); //---distance--------------------------------------   

	  Triangle.prototype.distanceTriangle = function (triangle) {};

	  return Triangle;
	}(Array);

	exports.Triangle = Triangle;
	});

	unwrapExports(Triangle_1);
	var Triangle_2 = Triangle_1.Triangle;

	var Frustum_1 = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.Frustum = void 0;





	var _sphere = new Sphere_1.Sphere();
	/**
	 * 视锥体
	 */


	var Frustum =
	/** @class */
	function () {
	  function Frustum() {
	    this.planes = [new Plane_1.Plane(), new Plane_1.Plane(), new Plane_1.Plane(), new Plane_1.Plane(), new Plane_1.Plane(), new Plane_1.Plane()];
	  }

	  Object.defineProperty(Frustum.prototype, "front", {
	    get: function () {
	      return this.planes[0];
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Frustum.prototype, "back", {
	    get: function () {
	      return this.planes[1];
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Frustum.prototype, "top", {
	    get: function () {
	      return this.planes[2];
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Frustum.prototype, "bottom", {
	    get: function () {
	      return this.planes[3];
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Frustum.prototype, "left", {
	    get: function () {
	      return this.planes[4];
	    },
	    enumerable: false,
	    configurable: true
	  });
	  Object.defineProperty(Frustum.prototype, "right", {
	    get: function () {
	      return this.planes[5];
	    },
	    enumerable: false,
	    configurable: true
	  });
	  /**
	   * 从投影矩阵计算视锥体
	   * @param m
	   * @returns
	   */

	  Frustum.prototype.setFromProjectionMatrix = function (m) {
	    var planes = this.planes;
	    var me = m.elements;
	    var me0 = me[0],
	        me1 = me[1],
	        me2 = me[2],
	        me3 = me[3];
	    var me4 = me[4],
	        me5 = me[5],
	        me6 = me[6],
	        me7 = me[7];
	    var me8 = me[8],
	        me9 = me[9],
	        me10 = me[10],
	        me11 = me[11];
	    var me12 = me[12],
	        me13 = me[13],
	        me14 = me[14],
	        me15 = me[15];
	    planes[0].setComponents(me3 - me0, me7 - me4, me11 - me8, me12 - me15).normalize();
	    planes[1].setComponents(me3 + me0, me7 + me4, me11 + me8, me12 + me15).normalize();
	    planes[2].setComponents(me3 + me1, me7 + me5, me11 + me9, me13 + me15).normalize();
	    planes[3].setComponents(me3 - me1, me7 - me5, me11 - me9, me13 - me15).normalize();
	    planes[4].setComponents(me3 - me2, me7 - me6, me11 - me10, me14 - me15).normalize();
	    planes[5].setComponents(me3 + me2, me7 + me6, me11 + me10, me14 + me15).normalize();
	    return this;
	  };

	  Frustum.fromProjectionMatrix = function (m) {
	    return new Frustum().setFromProjectionMatrix(m);
	  };

	  Frustum.prototype.setFromPerspective = function (position, target, up, fov, aspect, near, far) {
	    var direction = target.clone().sub(position);
	  };

	  Frustum.prototype.intersectsObject = function (geometry, mat) {
	    if (!geometry.boundingSphere) geometry.computeBoundingSphere();

	    _sphere.copy(geometry.boundingSphere).applyMat4(mat);

	    return this.intersectsSphere(_sphere);
	  }; // intersectsSprite(sprite) {
	  //     _sphere.center.set(0, 0, 0);
	  //     _sphere.radius = 0.7071067811865476;
	  //     _sphere.applyMatrix4(sprite.matrixWorld);
	  //     return this.intersectsSphere(_sphere);
	  // }


	  Frustum.prototype.intersectsSphere = function (sphere) {
	    var planes = this.planes;
	    var center = sphere.center;
	    var negRadius = -sphere.radius;

	    for (var i = 0; i < 6; i++) {
	      var distance = planes[i].distancePoint(center);

	      if (distance < negRadius) {
	        return false;
	      }
	    }

	    return true;
	  };

	  Frustum.prototype.intersectsSphereComponents = function (cx, cy, cz, radius) {
	    _sphere.setComponents(cx, cy, cz, radius);

	    return this.intersectsSphere(_sphere);
	  };

	  Frustum.prototype.containsPoint = function (point) {
	    var planes = this.planes;

	    for (var i = 0; i < 6; i++) {
	      if (planes[i].distancePoint(point) < 0) {
	        return false;
	      }
	    }

	    return true;
	  };

	  Frustum.prototype.intersectSegment = function (segment) {
	    var planes = this.planes;

	    for (var i = 0; i < 6; i++) {
	      var intersectPoint = planes[i].intersectSegmentLw(segment);

	      if (intersectPoint !== null) {
	        return intersectPoint;
	      }
	    }

	    return null;
	  };

	  Frustum.prototype.simpleIntersectVS = function (vs) {
	    var _this = this;

	    var contains = vs.map(function (v) {
	      return _this.containsPoint(v);
	    });
	    var res = [];

	    for (var i = 0; i < vs.length; i++) {
	      var p = vs[i];
	      var c0 = contains[i];
	      p.index = i;

	      if (c0) {
	        res.push(p);
	      }
	    }

	    if (res.length > 0) {
	      var startI = res[0].index;
	      var endI = res[res.length - 1].index;
	      if (startI > 0) res.unshift(vs[startI - 1]);
	      if (endI < vs.length - 2) res.push(vs[endI + 1]);
	    }

	    return res;
	  };

	  Frustum.prototype.copy = function (frustum) {};

	  Frustum.prototype.clone = function () {
	    return new this.constructor().copy(this);
	  };

	  return Frustum;
	}();

	exports.Frustum = Frustum;
	});

	unwrapExports(Frustum_1);
	var Frustum_2 = Frustum_1.Frustum;

	var geometryaid = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.linksToGeometry = exports.linkToGeometry = exports.extrudeToGeometryBuffer = exports.toGeometryBuffer = void 0;
	/*
	 * @Description  :
	 * @Author       : 赵耀圣
	 * @Q群           : 632839661
	 * @Date         : 2020-12-10 15:01:42
	 * @LastEditTime : 2021-03-11 10:54:11
	 * @FilePath     : \cga.js\src\extends\geometryaid.ts
	 */









	function toGeometryBuffer(geo) {
	  var buffer = (0, mesh.toGeoBuffer)(geo.position, geo.index, geo.uv);
	  return buffer;
	}

	exports.toGeometryBuffer = toGeometryBuffer;
	/**
	 * shape 挤压后转几何体
	 * @param {*} shape
	 * @param {*} arg_path
	 * @param {*} options
	 */

	function extrudeToGeometryBuffer(shape, arg_path, options) {
	  var extrudeRes = (0, extrude_1.extrude_obsolete)(shape, arg_path, options);
	  return (0, mesh.toGeoBuffer)(extrudeRes.vertices, extrudeRes.index, extrudeRes.uvs);
	}

	exports.extrudeToGeometryBuffer = extrudeToGeometryBuffer;
	/**
	 * 两个轮廓缝合
	 * @param {*} shape
	 * @param {*} arg_path
	 * @param {*} options
	 * @param {*} material
	 */

	function linkToGeometry(shape, shape1, axisPlane, shapeClose) {
	  if (axisPlane === void 0) {
	    axisPlane = trianglution.AxisPlane.XY;
	  }

	  if (shapeClose === void 0) {
	    shapeClose = false;
	  }

	  var geo = (0, extrude_1.linkSides)({
	    shapes: [shape, shape1],
	    shapeClosed: shapeClose,
	    orgShape: shape,
	    axisPlane: axisPlane
	  });
	  var geometry = toGeometryBuffer(geo);
	  return geometry;
	}

	exports.linkToGeometry = linkToGeometry;
	/**
	 * 多个轮廓缝合
	 * @param shapes
	 * @param isClose
	 * @param material
	 */

	function linksToGeometry(shapes, pathClosed, shapeClosed) {
	  if (pathClosed === void 0) {
	    pathClosed = true;
	  }

	  var vertices = (0, array.flat)(shapes);
	  (0, mesh.indexable)(vertices);
	  var geo = (0, extrude_1.linkSides)({
	    shapes: shapes,
	    shapeClosed: pathClosed,
	    orgShape: shapes[0]
	  });
	  var geometry = toGeometryBuffer(geo);
	  return geometry;
	}

	exports.linksToGeometry = linksToGeometry; // /**
	//  * 三角剖分后转成几何体
	//  * 只考虑XY平面
	//  * @param {*} boundary 
	//  * @param {*} hole 
	//  * @param {*} options 
	//  */
	// export function trianglutionToGeometryBuffer(boundary: any, holes: any[] = [], options: any = { normal: Vec3.UnitZ }) {
	//     var triangles = triangulation(boundary, holes, options)
	//     var vertices = [...boundary, ...flat(holes)]
	//     var uvs: any = [];
	//     vertices.reduce((acc, v) => {
	//         acc.push(v.x, v.y);
	//         return acc;
	//     }, uvs);
	//     var geometry = toGeometryBuffer(vertices, triangles, uvs);
	//     return geometry;
	// }
	});

	unwrapExports(geometryaid);
	var geometryaid_1 = geometryaid.linksToGeometry;
	var geometryaid_2 = geometryaid.linkToGeometry;
	var geometryaid_3 = geometryaid.extrudeToGeometryBuffer;
	var geometryaid_4 = geometryaid.toGeometryBuffer;

	var src = createCommonjsModule(function (module, exports) {

	var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function (o, m, k, k2) {
	  if (k2 === undefined) k2 = k;
	  var desc = Object.getOwnPropertyDescriptor(m, k);

	  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
	    desc = {
	      enumerable: true,
	      get: function () {
	        return m[k];
	      }
	    };
	  }

	  Object.defineProperty(o, k2, desc);
	} : function (o, m, k, k2) {
	  if (k2 === undefined) k2 = k;
	  o[k2] = m[k];
	});

	var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function (m, exports) {
	  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
	};

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__exportStar(array, exports);

	__exportStar(Vec2_1, exports);

	__exportStar(Vec3_1, exports);

	__exportStar(Vec4_1, exports);

	__exportStar(Mat3_1, exports);

	__exportStar(Mat4_1, exports);

	__exportStar(Quat_1, exports);

	__exportStar(_Math, exports);

	__exportStar(Euler_1, exports); //common


	__exportStar(vector_1, exports);

	__exportStar(common, exports);

	__exportStar(result, exports);

	__exportStar(extrude_1, exports);

	__exportStar(delaunay, exports);

	__exportStar(mesh, exports);

	__exportStar(Box_1, exports);

	__exportStar(Capsule_1, exports);

	__exportStar(Circle_1, exports);

	__exportStar(Disk_1, exports);

	__exportStar(Line_1, exports);

	__exportStar(Path_1, exports);

	__exportStar(Plane_1, exports);

	__exportStar(Point_1, exports);

	__exportStar(Polyline_1, exports);

	__exportStar(Polygon_1, exports);

	__exportStar(Ray_1, exports);

	__exportStar(Segment_1, exports);

	__exportStar(Triangle_1, exports);

	__exportStar(Frustum_1, exports);

	__exportStar(Sphere_1, exports);

	__exportStar(delaunator, exports);

	__exportStar(voronoi, exports);

	__exportStar(geometryaid, exports); //Geometry 


	__exportStar(bufferAttribute, exports);

	__exportStar(geometry, exports);

	__exportStar(mesh, exports);
	});

	var index = unwrapExports(src);

	return index;

})));
