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
        else if (ele.clone)
        {
            result[i] = ele.clone();
        }
        else if (ele instanceof Array)
            result[i] = clone(ele);
        else
            throw ("数组有元素不能clone")
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

/**
 * 遍历多级数组中所有对象
 * @param {*} array 
 * @param {*} method 
 */
export function forall(array, method) {
    for (let i = 0; i < array.length; i++)
    {
        const ele = array[i];
        method(ele);
        if (Array.isArray(ele))
            forall(ele, method)
    }
}