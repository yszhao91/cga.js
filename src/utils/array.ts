/*
 * @Description  : 
 * @Author       : 赵耀圣
 * @Q群           : 632839661
 * @Date         : 2020-12-10 15:01:42
 * @LastEditTime : 2021-09-10 11:15:02
 * @FilePath     : \object_framed:\github\cga.js\src\utils\array.ts
 */
import { delta4, toFixed as toFixedOne } from '../math/Math';

(Array.prototype as any).get = function (index: number): any {
    if (index < 0)
        index = this.length + index;
    return this[index]
};

(Array.prototype as any).last = function (): any {
    return this.get(-1);
};






/**
 * 遍历多级数组中所有对象
 * @param {Array} array 
 * @param {Function} method 
 */
export function forall(array: Array<any>, method: (arg0: any, index?: number, that?: Array<any>) => void) {
    for (let i = 0; i < array.length; i++) {
        const ele = array[i];
        method(ele, i, array);
        if (Array.isArray(ele))
            forall(ele, method)
    }
}

export function flat(array: any[]): any[] {
    if ((<any>array).flat)
        return (<any>array).flat(Infinity);

    return array.reduce((pre, cur) => {
        return pre.concat(Array.isArray(cur) ? flat(cur) : cur);
    })
}

/**
 * 分类
 * example:
 *      var arry = [1,2,3,4,5,6]
 *      var result = classify(array,(a)={return a%2===0})
 * 
 * @param {Array} array 
 * @param {Function} classifyMethod  分类方法
 */
export function classify(array: Array<any>, classifyMethod: (arg0: any, arg1: any, arg2: any[]) => any) {
    var result: any = [];
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < result.length; j++) {
            if (classifyMethod(array[i], result[j][0], result[j])) {
                result[j].push(array[i]);
            } else {
                result.push([array[i]]);
            }
        }
    }
    return result;
}


/**
 * 去掉重复元素
 * @param {Array} array 
 * @param {Function} uniqueMethod  去重复
 * @param {Function} sortMethod 排序 存在就先排序再去重复
 */
export function unique(array: any[], uniqueMethod: (arg0: any, arg1: any) => boolean, sortMethod?: (a: any, b: any) => number) {
    if (sortMethod) {
        array.sort(sortMethod);
        for (let i = 0; i < array.length; i++) {
            for (let j = i + 1; j < array.length; j++) {
                if (uniqueMethod(array[i], array[j]) === true) {
                    array.splice(j, 1);
                    j--
                } else
                    break;
            }

        }
        return array;
    }

    for (let i = 0; i < array.length; i++) {
        for (let j = i + 1; j < array.length; j++) {
            if (uniqueMethod(array[i], array[j]) === true) {
                array.splice(j, 1);
                j--
            }
        }

    }
    return array;
}

