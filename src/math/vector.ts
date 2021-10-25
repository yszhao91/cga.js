/**
 * 当向量以数组的方式出现，一个计算单元库
 * @Description  : 向量数组
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-02 15:09:33
 * @LastEditTime : 2021-08-02 15:50:16
 * @FilePath     : \cga.js\src\math\VecArray.ts
 */

const ckeckVec = (vs: any, component: number) => {
    if (vs.length % component !== 0)
        throw ("向量组件数量不一样")
}

export const vector = {
    /**
     * 检测相邻没有重复点
     */
    uniqueNeighbor: (vs: number[], component: number = 3) => {

        for (let i = 0; i < vs.length; i += component) {
            for (let j = i + 3; j < vs.length;) {
                let lensq = 0
                for (let c = 0; c < component; c++) {
                    lensq += (vs[i + c] - vs[j + c]) * (vs[i + c] - vs[j + c])
                }

                if (Math.sqrt(lensq) < 1e-5)
                    vs.splice(j, component)
                else
                    break;
            }
        }

        return vs;
    },

    /**
     * 去除任意重复点
     * @param vs 向量数组
     * @param component 向量组件数量 
     * @returns 无重复向量数组
     */
    unique: (vs: number[], component: number = 3) => {
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
    },

    /**
     *  翻转向量数组 
     * @param vecs 向量数组
     * @param component  组件数量
     * @returns 
     */
    reverse: (vecs: number[], component: number = 3) => {
        ckeckVec(vecs, component);

        const length = vecs.length;
        for (let i = 0; i < length; i += component) {
            vecs.unshift(...vecs.splice(i, component))
        }

        return vecs;
    },

    dot: (...vecs: number[]) => {
        if (vecs.length % 2 !== 0)
            throw ("两个向量组件数量不一样")

        const len = vecs.length / 2;

        let dot = 0;
        for (let i = 0; i < len; i++) {
            dot += vecs[i] * vecs[len + i];
        }

        return dot;
    },

    /**
     * 长度平方
     * @param vecs 
     * @returns 
     */
    distanceSq: (...vecs: number[]) => {
        if (vecs.length % 2 !== 0)
            throw ("向量组件数量不一样")

        const len = vecs.length / 2;

        let lenSq = 0;
        for (let i = 0; i < len; i++) {
            var d = (vecs[i] - vecs[len + i]);
            lenSq += d * d;
        }
        return lenSq;
    },

    /**
     * 长度 
     * @param vecs 
     * @returns 
     */
    distance: (...vecs: number[]) => {
        return Math.sqrt(vector.distanceSq(...vecs));
    },

    /**
     * 相加
     * @param vecs 
     * @returns 
     */
    add: (...vecs: number[]) => {
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
    },

    /**
     * 相减
     * @param vecs 
     * @returns 
     */
    sub: (...vecs: number[]): number[] => {
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
    },


    /**
     * 相乘
     * @param vecs 
     * @returns 
     */
    mul: (...vecs: number[]) => {
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
    },


    /**
     * 获取矢量数组的i个矢量
     * @param vecs 
     * @param i 
     * @param component 
     * @returns 
     */
    getVecAt: (vecs: number[], i: number, component: number = 3): number[] => {
        return [vecs[3 * i], vecs[3 * i + 1], vecs[3 * i + 2]];
    },

    /**
     * 在第 i 个位置插入一个向量
     * @param vecs 
     * @param i 
     * @param vec 
     */
    insertAt: (vecs: number[], i: number, ...vec: number[]) => {
        vecs.splice(i * vecs.length, 0, ...vecs);
    }

}