export * from "./math/Math";
export * from "./math/Vector2";
export * from "./math/Vector3";
export * from "./math/Vector4";
export * from "./math/Matrix3";
export * from "./math/Matrix4";
export * from "./math/Quaternion";
export * from "./math/Euler";
export * from "./struct/3d/Circle";
export * from "./struct/3d/Disk";
export * from "./struct/3d/Point"
export * from "./struct/3d/Line";
export * from "./struct/3d/Plane";
export * from "./struct/3d/Polyline";
export * from "./struct/3d/Polygon";
export * from "./struct/3d/Ray";
export * from "./struct/3d/Segment";
export * from "./struct/3d/Sphere";
export * from "./struct/3d/Triangle";


export * from "./struct/data/ArrayEx"
export * from "./struct/3d/Path"
export * from "./utils/array"
export * from "./alg/points"
export * from "./alg/mesh"
export * from "./alg/shape"
export * from "./alg/triangulation"
export * from "./alg/convexHull"

if (!Array.prototype.get)
    Array.prototype.get = function (index) {
        if (index < 0)
            index = this.length + index;
        return this[index]
    }

/**
 * 深度优先遍历
 * @param {*} method 
 */
if (!Array.prototype.forall)
    Array.prototype.forall = function (method) {
        for (let i = 0; i < this.length; i++)
        {
            method(this[i]);
            if (this[i] instanceof Array)
                this[i].forall(method);
        }
    }


/**
 * 分类
 * example:
 *      var arry = [1,2,3,4,5,6]
 *      var result = classify(this,(a)={return a%2===0}) 
 * 
 * @param {Function} classifyMethod  分类方法
 */

if (!Array.prototype.forall)
    Array.prototype.classify = function (classifyMethod) {
        var result = [];
        for (let i = 0; i < this.length; i++)
        {
            for (let j = 0; j < result.length; j++)
            {
                if (classifyMethod(this[i], result[j][0], result[j]))
                {
                    result[j].push(this[i]);
                } else
                {
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

if (!Array.prototype.unique)
    Array.prototype.unique = function (uniqueMethod, sortMethod) {
        if (sortMethod)
        {
            this.sort(sortMethod);
            for (let i = 0; i < this.length; i++)
            {
                for (let j = i + 1; j < this.length; j++)
                {
                    if (uniqueMethod(this[i], this[j]) === true)
                    {
                        this.splice(j, 1);
                        j--
                    } else
                        break;
                }

            }
            return this;
        }

        for (let i = 0; i < this.length; i++)
        {
            for (let j = i + 1; j < this.length; j++)
            {
                if (uniqueMethod(this[i], this[j]) === true)
                {
                    this.splice(j, 1);
                    j--
                }
            }

        }
        return this;
    }