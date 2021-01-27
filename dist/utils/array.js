"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unique = exports.classify = exports.flat = exports.forall = void 0;
Array.prototype.get = function (index) {
    if (index < 0)
        index = this.length + index;
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
        if (Array.isArray(ele))
            forall(ele, method);
    }
}
exports.forall = forall;
function flat(array) {
    if (array.flat)
        return array.flat(Infinity);
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
            }
            else {
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
 * @param {Function} sortMethod 排序
 */
function unique(array, uniqueMethod, sortMethod) {
    if (sortMethod) {
        array.sort(sortMethod);
        for (var i = 0; i < array.length; i++) {
            for (var j = i + 1; j < array.length; j++) {
                if (uniqueMethod(array[i], array[j]) === true) {
                    array.splice(j, 1);
                    j--;
                }
                else
                    break;
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
