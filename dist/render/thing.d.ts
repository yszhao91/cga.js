import { EventHandler } from './eventhandler';
export declare class Thing extends EventHandler {
    [x: string]: any;
    protected cache: any;
    constructor(opts?: any);
    add(thing: this, force?: boolean): this;
    remove(thing: any): this;
    foreach(cb: (arg0: this) => void): void;
    getObjectByProperty(name: string, value: any): any;
    getObjectById(id: any): any;
    getObjectByName(name: any): any;
    /**
   * 生成属性的set/get方法
   * @param {string} name
   * @param {function} setFunc
   * @param {boolean} skipEqualsCheck
   */
    defineProperty(name: string | number | symbol, setFunc: any, skipEqualsCheck?: boolean): void;
    buildAccessor(name: any, bindObject?: this): void;
    buildAccessors(schema: any[], bindObject?: this): void;
}
export declare function buildAccessor(name: any, bindObject: any): void;
export declare function buildAccessors(schema: any[], bindObject: any): void;
