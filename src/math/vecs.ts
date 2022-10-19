/**
 * 当向量以数组的方式出现，一个计算单元库
 * @Description  : 向量数组
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-02 15:09:33
 * @LastEditTime : 2021-08-02 15:50:16
 * @FilePath     : \cga.js\src\math\VecArray.ts
 */

import { Polygon } from "../struct/3d/Polygon"
import { Polyline } from "../struct/3d/Polyline"
import { Vec2 } from './Vec2';
import { Vec3 } from './Vec3';
import { ArrayList } from '../struct/data/ArrayList';
import { Vec4 } from './Vec4';
import { delta4 } from './Math';
import { Mat4 } from "./Mat4";
import { Quat } from "./Quat";
import { TypedArrayLike } from "../render/types";



const _vec21 = new Vec2();
const _vec31 = new Vec3();
const _vec41 = new Vec4();

const ckeckVec = (vs: any, component: number) => {
    if (vs.length % component !== 0)
        throw ("向量组件数量不一样")
}
/**
 * 矢量几何操作，数字数组/矢量数组，常用工具集合
 */
export class vecs {
    /**
     * 去除相邻的重复向量
     * @param vs 矢量集合
     * @param delta 误差 
     * @returns 
     */
    static uniqueNeighborVecs(vs: Array<Vec3>, delta: number = delta4) {

        for (let i = 0; i < vs.length - 1; i++) {
            const lenSq = vs[i].distanceTo(vs[i + 1])
            if (lenSq < delta)
                vs.splice(i, 1);
        }

        return vs;
    }

    /**
     * 找到最大值 
     * @param array 
     * @returns 
     */
    static max(array: ArrayLike<number>) {

        if (array.length === 0) return - Infinity;

        var max = array[0];

        for (var i = 1, l = array.length; i < l; ++i) {

            if (array[i] > max) max = array[i];

        }

        return max;
    }

    /**
    * 找到最小值 
    * @param array 
    * @returns 
    */
    static min(array: ArrayLike<number>) {

        if (array.length === 0) return - Infinity;

        var min = array[0];

        for (var i = 1, l = array.length; i < l; ++i) {

            if (array[i] < min) min = array[i];

        }

        return min;
    }

    /**
     * 去除相邻没有重复点
     */
    static uniqueNeighbor(vs: number[], component: number = 3, delta: number = delta4) {

        for (let i = 0; i < vs.length; i += component) {
            for (let j = i + 3; j < vs.length;) {
                let lensq = 0
                for (let c = 0; c < component; c++) {
                    lensq += (vs[i + c] - vs[j + c]) * (vs[i + c] - vs[j + c])
                }

                if (Math.sqrt(lensq) < delta)
                    vs.splice(j, component);
                else
                    break;
            }
        }

        return vs;
    }

    /**
     * 去除任意重复点
     * @param vs 向量数组
     * @param component 向量组件数量 
     * @returns 无重复向量数组
     */
    static unique(vs: number[], component: number = 3) {
        for (let i = 0; i < vs.length; i += component) {
            for (let j = i + 3; j < vs.length;) {
                let lensq = 0
                for (let c = 0; c < component; c++) {
                    lensq += (vs[i + c] - vs[j + c]) * (vs[i + c] - vs[j + c])
                }

                if (Math.sqrt(lensq) < 1e-5)
                    vs.splice(j, component)
                else
                    j += component
            }
        }

        return vs;
    }

    /**
     *  翻转向量数组 
     * @param vecs 向量数组
     * @param component  组件数量
     * @returns 
     */
    static reverse(vecs: number[], component: number = 3) {
        ckeckVec(vecs, component);

        const length = vecs.length;
        for (let i = 0; i < length; i += component) {
            vecs.unshift(...vecs.splice(i, component))
        }

        return vecs;
    }

    /**
     * 点积
     * @param vecs 
     * @returns 
     */
    static dot(...vecs: number[]) {
        if (vecs.length % 2 !== 0)
            throw ("两个向量组件数量不一样")

        const len = vecs.length / 2;

        let dot = 0;
        for (let i = 0; i < len; i++) {
            dot += vecs[i] * vecs[len + i];
        }

        return dot;
    }

    /**
     * 长度平方
     * @param vecs 
     * @returns 
     */
    static distanceSq(...vecs: number[]) {
        if (vecs.length % 2 !== 0)
            throw ("向量组件数量不一样")

        const len = vecs.length / 2;

        let lenSq = 0;
        for (let i = 0; i < len; i++) {
            var d = (vecs[i] - vecs[len + i]);
            lenSq += d * d;
        }
        return lenSq;
    }

    /**
     * 长度 
     * @param vecs 
     * @returns 
     */
    static distance(...vecs: number[]) {
        return Math.sqrt(this.distanceSq(...vecs));
    }

    /**
     * 相加
     * @param vecs 
     * @returns 
     */
    static add(...vecs: number[]) {
        if (vecs.length % 2 !== 0)
            throw ("两个向量组件数量不一样")
        if (Array.isArray(vecs[0]) && Array.isArray(vecs[1])) {
            for (let i = 0; i < vecs[0].length; i++) {
                vecs[0][i] += vecs[1][i];

            }
            return vecs[0]
        }

        if (vecs.length % 2 !== 0)
            console.error("VecArray:distanceSq  向量错误!!!");

        const len = vecs.length / 2;

        let res: number[] = [];
        for (let i = 0; i < len; i++) {
            res[i] = res[len + i] + res[i];
        }

        return res;
    }

    /**
     * 相减
     * @param vecs 
     * @returns 
     */
    static sub(...vecs: number[]): number[] {
        ckeckVec(vecs, 2);

        if (Array.isArray(vecs[0]) && Array.isArray(vecs[1])) {
            for (let i = 0; i < vecs[0].length; i++) {
                vecs[0][i] -= vecs[1][i];

            }
            return vecs[0]
        }

        if (vecs.length % 2 !== 0)
            console.error("VecArray:distanceSq  向量错误!!!");

        const len = vecs.length / 2;

        let res: number[] = [];
        for (let i = 0; i < len; i++) {
            res[i] = res[i] - res[len + i];
        }

        return res;
    }


    /**
     * 相乘
     * @param vecs 
     * @returns 
     */
    static mul(...vecs: number[]) {
        ckeckVec(vecs, 2);
        if (Array.isArray(vecs[0]) && Array.isArray(vecs[1])) {
            for (let i = 0; i < vecs[0].length; i++) {
                vecs[0][i] *= vecs[1][i];

            }
            return vecs[0]
        }

        if (vecs.length % 2 !== 0)
            console.error("VecArray:distanceSq  向量错误!!!");

        const len = vecs.length / 2;

        let res: number[] = [];
        for (let i = 0; i < len; i++) {
            res[i] = res[i] * res[len + i];
        }

        return res;
    }


    /**
     * 获取矢量数组的i个矢量
     * @param vecs 
     * @param i 
     * @param component 
     * @returns 
     */
    static getVecAt(vecs: number[], i: number, component: number = 3): number[] {
        return [vecs[3 * i], vecs[3 * i + 1], vecs[3 * i + 2]]
    }

    /**
     * 在第 i 个位置插入一个向量
     * @param vecs 
     * @param i 
     * @param vec 
     */
    static insertAt(vecs: number[], i: number, ...vec: number[]) {
        vecs.splice(i * vecs.length, 0, ...vecs);
    }


    //

    /**
     * 是否逆时针
     * counterclockwise
     */
    static isCCW<T>(shape: Array<T> | ArrayList<T>, component: number = 3): boolean {
        let d = 0;
        if (shape instanceof Polyline || shape instanceof Polygon)
            for (let i = 0; i < shape.length; i++) {
                const pt = shape.get(i);
                const ptnext = shape.get((i + 1) % shape.length);
                d += -0.5 * (ptnext.y + pt.y) * (ptnext.x - pt.x);
            }
        else if (Array.isArray(shape) && shape.length > 0) {
            if (shape[0] instanceof Vec3 || shape[0] instanceof Vec2) {
                for (let i = 0; i < shape.length; i++) {
                    const pt: Vec3 | Vec2 = shape[i] as any;
                    const ptnext: Vec3 | Vec2 = shape[(i + 1) % shape.length] as any;
                    d += -0.5 * (ptnext.y + pt.y) * (ptnext.x - pt.x);
                }
            } else if (!isNaN(shape[0] as any)) {
                for (let i = 0; i < shape.length; i += component) {
                    const ptx: number = shape[i] as any;
                    const pty: number = shape[(i + 1) % shape.length] as any;
                    const ptnextx = shape[(i + 3) % shape.length] as any;
                    const ptnexty = shape[(i + 4) % shape.length] as any;
                    d += -0.5 * (ptnexty + pty) * (ptnextx - ptx);
                }
            }
        }
        return d > 0;
    }




    /**
     * 将向量深度拆解为数字
     * @param {Array} Array<Vec4 | Vec3 | Vec2 | any> | any 
     * @param {String} comSort  'x','y','z','w' 按顺序选取后自由组合
     * @returns {Array<Number>} 数字数组 
     */
    static verctorToNumbers(vectors: Array<Vec4 | Vec3 | Vec2 | any> | any, comSort = "xyz"): number[] {
        if (!(vectors instanceof Array)) {
            console.error("传入参数必须是数组");
            return [];
        }

        var numbers: number[] = [];
        if (vectors[0].x !== undefined && vectors[0].y !== undefined && vectors[0].z !== undefined && vectors[0].w !== undefined) {
            comSort = comSort.length !== 4 ? 'xyzw' : comSort;
            for (var i = 0; i < vectors.length; i++) {
                for (let j = 0; j < comSort.length; j++) {
                    numbers.push(vectors[i][comSort[j]]);
                }
            }
        }
        if (vectors[0].x !== undefined && vectors[0].y !== undefined && vectors[0].z !== undefined) {
            comSort = comSort.length !== 3 ? 'xyz' : comSort;
            for (var i = 0; i < vectors.length; i++) {
                for (let j = 0; j < comSort.length; j++) {
                    numbers.push(vectors[i][comSort[j]]);
                }
            }
        } else if (vectors[0].x !== undefined && vectors[0].y !== undefined) {
            comSort = comSort.length !== 2 ? 'xy' : comSort;
            for (var i = 0; i < vectors.length; i++) {
                for (let j = 0; j < comSort.length; j++) {
                    numbers.push(vectors[i][comSort[j]]);
                }
            }
        }
        else if (vectors[0] instanceof Array) {
            for (var i = 0; i < vectors.length; i++) {
                numbers = numbers.concat(vecs.verctorToNumbers(vectors[i]));
            }
        } else {
            console.error("数组内部的元素不是向量");
        }

        return numbers;
    }

    static vec(component: number = 3) {
        if (component === 2)
            return new Vec2;
        if (component === 3)
            return new Vec3;
        if (component === 4)
            return new Vec4;

        throw ('暂时不支持4维以上的矢量')
    }

    /**
     * 数字数组 转 适量数组
     * @param vss  数字数组
     * @param component 矢量维度，默认为3
     * @returns 
     */
    static numbersToVecs(vss: TypedArrayLike, component: number = 3): Vec2[] | Vec3[] | Vec4[] {
        const result: any = []

        for (let i = 0, length = vss.length; i < length; i += component) {
            const vec = vecs.vec(component);
            vec.fromArray(vss, i);
            result.push(vec);
        }

        return result;
    }

    static applyQuat(vss: TypedArrayLike, quat: Quat, component: number = 3) {
        let vec;
        if (component === 3)
            vec = _vec31;
        else if (component === 2)
            vec = _vec21
        else if (component === 4)
            vec = _vec41;

        for (let i = 0; i < vss.length; i += component) {
            (vec as any).fromArray(vss, i)
                .applyQuat(quat)
                .toArray(vss, i);
        }
    }

    static applyMat4(vss: TypedArrayLike, mat: Mat4, component: number = 3) {
        let vec;
        if (component === 3)
            vec = _vec31;
        else if (component === 2)
            vec = _vec21
        else if (component === 4)
            vec = _vec41;

        for (let i = 0; i < vss.length; i += component) {
            (vec as Vec3).fromArray(vss, i)
                .applyMat4(mat)
                .toArray(vss, i);
        }
    }

    static translate(vss: TypedArrayLike, distance: number[], component = 3) {
        for (let i = 0; i < vss.length; i += component) {
            for (let j = 0; j < component; j++) {
                vss[i + j] += distance[j];
            }
        }
    }

    static rotate(vss: TypedArrayLike, axis: Vec3, angle: number) {
        vecs.applyQuat(vss, new Quat().setFromAxisAngle(axis, angle))
    }


    static scale(vss: TypedArrayLike, _scale: number[], component = 3) {
        for (let i = 0; i < vss.length; i += component) {
            for (let j = 0; j < component; j++) {
                vss[i + j] *= _scale[j];
            }
        }
    }
}