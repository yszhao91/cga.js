import { EventHandler } from './eventhandler';
import { v4 as uuidv4 } from 'uuid';

export class Thing extends EventHandler {
  protected cache: any = {};
  uuid: any;
  id: any;
  name: any;
  alias: any;
  isThing: boolean;
  parent: any;
  children: any[];
  meta: any;
  needsUpdate: boolean;
  _renderObject: any;
  _useData: any = {};
  tag: string;
  constructor(opts?: any) {
    super();
    opts = opts || {};
    this.uuid = uuidv4();
    this.id = this.uuid;
    this.name = opts.name || "未命名";
    this.alias = opts.alias;
    this.isThing = true
    this.parent = null;
    this.children = [];
    this.meta = undefined;
    this.needsUpdate = false;
    this._renderObject = null;
    this._useData = {};
    this.tag = "untagged";

    this.on("set", (name: string, oldValue: any, newValue: any) => {
      this.fire("set_" + name, name, oldValue, newValue);
    });

    for (const key in opts) {
      if (opts.hasOwnProperty(key)) {
        if (!(this as any)[key]) {
          (this as any)[key] = opts[key]
        }
      }
    }
  }

  add(thing: any, force: boolean = false) {
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

    } else if (thing && force) {

      if (thing.parent) {
        thing.parent.remove(thing);
      }
      thing.parent = this;
      this.children.push(thing);

    } else {
      console.error("Thing.add:不是Thing类型", thing);
    }
    return this;
  }

  remove(thing: any) {
    if (arguments.length > 1) {
      for (var i = 0; i < arguments.length; i++) {
        this.remove(arguments[i]);
      }
      return this;
    }

    var index = this.children.indexOf(thing);

    if (index !== -1) {
      thing.parent = null;
      // thing.dispatchEvent( { type: 'removed' } );
      this.children.splice(index, 1);
    }

    return this;
  }


  foreach(cb: (arg0: this) => void) {
    cb(this);
    var children = this.children;
    for (let i = 0; i < children.length; i++) {
      children[i].foreach(cb);
    }
  }

  getObjectByProperty(name: string, value: any) {

    if ((this as any)[name] === value) return this;

    for (var i = 0, l = this.children.length; i < l; i++) {

      var child = this.children[i];
      if (!child.getObjectByProperty)
        continue
      var object = child.getObjectByProperty(name, value);

      if (object !== undefined) {
        return object;
      }
    }

    return undefined;

  }

  getObjectById(id: any) {
    return this.getObjectByProperty('id', id);
  }

  getObjectByName(name: any) {
    return this.getObjectByProperty('name', name);
  }

  /**
 * 生成属性的set/get方法
 * @param {string} name 
 * @param {function} setFunc 
 * @param {boolean} skipEqualsCheck 
 */
  defineProperty(name: string | number | symbol, setFunc: any, skipEqualsCheck = true) {
    Object.defineProperty(this, name, {
      get: () => {
        return this._useData[name];
      },
      set: (value) => {
        var data = this._useData;
        var oldValue = data[name];
        if (!skipEqualsCheck && oldValue === value) return;
        data[name] = value;
        if (setFunc) setFunc.call(this, value, oldValue);
      },
      configurable: true
    })
  }

  buildAccessor(name: any, bindObject: any = this) {
    if (!bindObject)
      return
    Object.defineProperty(bindObject, name, {
      get: function () {
        return bindObject[`_${name}`];
      },
      set: function (value) {
        var oldValue = bindObject[`_${name}`];
        bindObject[`_${name}`] = value;
        bindObject.fire('set', name, oldValue, value);
      },
      configurable: true
    });
  }

  buildAccessors(schema: any[], bindObject?: this) {
    schema.forEach((descriptor: any) => {
      this.buildAccessor(descriptor, bindObject)
    });
  }

}


export function buildAccessor(name: any, bindObject: any) {
  if (!bindObject)
    return
  Object.defineProperty(bindObject, name, {
    get: function () {
      return bindObject[`_${name}`];
    },
    set: function (value) {
      var oldValue = bindObject[`_${name}`];
      bindObject[`_${name}`] = value;
      bindObject.fire('set', name, oldValue, value);
    },
    configurable: true
  });
}

export function buildAccessors(schema: any[], bindObject: any) {
  schema.forEach((descriptor: any) => {
    buildAccessor(descriptor, bindObject)
  });
}
