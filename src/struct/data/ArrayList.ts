import { clone } from '../../alg/common';

// TMaterial extends Material | Material[] = Material | Material[],
export class ArrayList<T> {
    protected _array: Array<T>;
    isArrayList: boolean = true;
    constructor(data?: Array<T> | ArrayList<T>) {
        this._array = new Array()
        if (Array.isArray(data))
            this._array.push(...data);
        else if ((data as any).isArrayList === true)
            this._array.push(...data?._array as Array<T>)
    }

    get array() {
        return this._array;
    }

    set array(val: T[]) {
        this._array = val;
    }

    get length() {
        return this._array.length;
    }

    get last() {
        return this.get(-1);
    }

    get first() {
        return this._array[0];
    }


    map(callbackfn: (value: T, index: number, array: T[]) => unknown) {
        return this._array.map(callbackfn)
    }

    push(...values: any[]) {
        this._array.push(...values);
    }

    reverse() {
        this._array.reverse();
        return this;
    }


    pop() {
        return Array.prototype.pop.apply(this._array)
    }


    unshift(...items: any[]) {
        return this._array.unshift(...items);
    }

    insertAt(i: number, ...value: T[]) {
        this._array.splice(i, 0, ...value)
    }

    splice(start: number, deleteCount: number, ...items: any[]) {
        this._array.splice(start, deleteCount, ...items)
    }

    get(index: number): any {
        if (index < 0)
            index = this._array.length + index;
        return this._array[index];
    }

    /**
     * 遍历
     * @param {*} method 
     */
    forall(method: (arg0: any) => void) {
        for (let i = 0; i < this._array.length; i++) {
            method(this._array[i]);
        }
    }

    /**
     * 克隆
     */
    clone() {
        return new (this.constructor as any)(clone(this._array));
    }

    /**
     * 分类
     * example:
     *      var arry = [1,2,3,4,5,6]
     *      var result = classify(this._array,(a)={return a%2===0}) 
     * 
     * @param {Function} classifyMethod  分类方法
     */
    classify(classifyMethod: (arg0: any, arg1: any, arg2: any[]) => any) {
        var result = [];
        for (let i = 0; i < this._array.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if (classifyMethod(this._array[i], result[j][0], result[j])) {
                    result[j].push(this._array[i]);
                } else {
                    result.push([this._array[i]]);
                }
            }
        }
        return result;
    }

    /**
     * 去掉重复元素 
     * @param {Function} uniqueMethod  去重复
     * @param {Function} sortMethod 排序
     */
    unique(uniqueMethod: (arg0: T, arg1: T) => boolean, sortMethod?: ((a: T, b: T) => number)) {
        if (sortMethod) {
            this._array.sort(sortMethod);
            for (let i = 0; i < this._array.length; i++) {
                for (let j = i + 1; j < this._array.length; j++) {
                    if (uniqueMethod(this._array[i], this._array[j]) === true) {
                        this._array.splice(j, 1);
                        j--;
                    } else
                        break;
                }

            }
            return this;
        }

        for (let i = 0; i < this._array.length; i++) {
            for (let j = i + 1; j < this._array.length; j++) {
                if (uniqueMethod(this._array[i], this._array[j]) === true) {
                    this._array.splice(j, 1);
                    j--
                }
            }

        }
        return this;
    }
}