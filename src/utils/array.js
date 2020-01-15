import { toFixed as toFixedOne } from "../math/Math"
/**
 * 数组深度复制
 * @param {Array} array 
 */
export function clone(array) {
    var result = new Array()
    for (let i = 0; i < array.length; i++)
    {
        var ele = array[i];
        if (ele instanceof Number || ele instanceof String)
            result[i] = ele;
        else if (ele instanceof Object)
        {
            if (ele.clone)
                result[i] = ele.clone();

            else throw ("对象元素不存在clone方法");
        }
        else if (ele instanceof Array)
            result[i] = clone(ele);
    }
    return result;
}

/** 
 * 数组中所有数字或者向量固定位数
 * @param {Array} array 
 * @param {Number} precision 
 */
export function toFixed(array, precision) {
    for (let i = 0; i < array.length; i++)
    {
        const e = array[i];
        if (e instanceof Array)
            toFixed(e);
        else
            array[i] = toFixedOne(e, precision);
    }
}

/**
 * 数组分类
 * @param {Array} array 
 */
export function classify(array) {
    // 
}