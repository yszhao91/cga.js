export declare class ArrayEx extends Array {
    constructor(...args: any);
    get last(): any;
    get(index: number): any;
    /**
     * 深度优先遍历
     * @param {*} method
     */
    forall(method: (arg0: any) => void): void;
    /**
     *
    */
    clone(): ArrayEx;
    /**
     * 分类
     * example:
     *      var arry = [1,2,3,4,5,6]
     *      var result = classify(this,(a)={return a%2===0})
     *
     * @param {Function} classifyMethod  分类方法
     */
    classify(classifyMethod: (arg0: any, arg1: any, arg2: any[]) => any): any[][];
    /**
     * 去掉重复元素
     * @param {Function} uniqueMethod  去重复
     * @param {Function} sortMethod 排序
     */
    unique(uniqueMethod: (arg0: any, arg1: any) => boolean, sortMethod: ((a: any, b: any) => number) | undefined): this;
}
