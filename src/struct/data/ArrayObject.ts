export class ArrayObject extends Array {
    constructor(...args: any) {
        super(...args);

        Object.setPrototypeOf(this, ArrayObject.prototype);
    }

    get last() {
        return this.get(-1);
    }

    get(index: number) {
        if (index < 0)
            index = this.length + index;
        return this[index]
    }

    /**
     * 深度优先遍历
     * @param {*} method 
     */
    forall(method: (arg0: any) => void) {
        for (let i = 0; i < this.length; i++) {
            method(this[i]);
            if (this[i] instanceof Array)
                this[i].forall(method);
        }
    }

    /**
     * 
    */
    clone() {
        var result = new ArrayObject()
        for (let i = 0; i < this.length; i++) {
            var ele = this[i];
            if (ele instanceof Number || ele instanceof String)
                result[i] = ele;
            else if (ele.clone) {
                result[i] = ele.clone();
            }
            else
                throw ("数组有元素不能clone")
        }
        return result;
    }
    /**
     * 分类
     * example:
     *      var arry = [1,2,3,4,5,6]
     *      var result = classify(this,(a)={return a%2===0}) 
     * 
     * @param {Function} classifyMethod  分类方法
     */
    classify(classifyMethod: (arg0: any, arg1: any, arg2: any[]) => any) {
        var result = [];
        for (let i = 0; i < this.length; i++) {
            for (let j = 0; j < result.length; j++) {
                if (classifyMethod(this[i], result[j][0], result[j])) {
                    result[j].push(this[i]);
                } else {
                    result.push([this[i]]);
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
    unique(uniqueMethod: (arg0: any, arg1: any) => boolean, sortMethod: ((a: any, b: any) => number) | undefined) {
        if (sortMethod) {
            this.sort(sortMethod);
            for (let i = 0; i < this.length; i++) {
                for (let j = i + 1; j < this.length; j++) {
                    if (uniqueMethod(this[i], this[j]) === true) {
                        this.splice(j, 1);
                        j--
                    } else
                        break;
                }

            }
            return this;
        }

        for (let i = 0; i < this.length; i++) {
            for (let j = i + 1; j < this.length; j++) {
                if (uniqueMethod(this[i], this[j]) === true) {
                    this.splice(j, 1);
                    j--
                }
            }

        }
        return this;
    }
}