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
 * 遍历多级数组中所有对象
 * @param {Array} array 
 * @param {Function} method 
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


/**
 * 分类
 * example:
 *      var arry = [1,2,3,4,5,6]
 *      var result = classify(array,(a)={return a%2===0})
 * 
 * @param {Array} array 
 * @param {Function} classifyMethod  分类方法
 */
export function classify(array, classifyMethod) {
    var result = [];
    for (let i = 0; i < array.length; i++)
    {
        for (let j = 0; j < result.length; j++)
        {
            if (classifyMethod(array[i], result[j][0], result[j]))
            {
                result[j].push(array[i]);
            } else
            {
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
 * @param {Function} sortMethod 排序
 */
export function unique(array, uniqueMethod, sortMethod) {
    if (sortMethod)
    {
        array.sort(sortMethod);
        for (let i = 0; i < array.length; i++)
        {
            for (let j = i + 1; j < array.length; j++)
            {
                if (uniqueMethod(array[i], array[j]) === true)
                {
                    array.splice(j, 1);
                    j--
                } else
                    break;
            }

        }
        return array;
    }

    for (let i = 0; i < array.length; i++)
    {
        for (let j = i + 1; j < array.length; j++)
        {
            if (uniqueMethod(array[i], array[j]) === true)
            {
                array.splice(j, 1);
                j--
            }
        }

    }
    return array;
}

