/**
 * 遍历多级数组中所有对象
 * @param {Array} array
 * @param {Function} method
 */
export declare function forall(array: Array<any>, method: (arg0: any, index?: number, that?: Array<any>) => void): void;
export declare function flat(array: any[]): any[];
/**
 * 分类
 * example:
 *      var arry = [1,2,3,4,5,6]
 *      var result = classify(array,(a)={return a%2===0})
 *
 * @param {Array} array
 * @param {Function} classifyMethod  分类方法
 */
export declare function classify(array: Array<any>, classifyMethod: (arg0: any, arg1: any, arg2: any[]) => any): any[][];
/**
 * 去掉重复元素
 * @param {Array} array
 * @param {Function} uniqueMethod  去重复
 * @param {Function} sortMethod 排序
 */
export declare function unique(array: any[], uniqueMethod: (arg0: any, arg1: any) => boolean, sortMethod: any): any[];
