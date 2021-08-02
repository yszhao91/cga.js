/**
 * 当向量以数组的方式出现，一个计算单元库
 * @Description  : 向量数组
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-02 15:09:33
 * @LastEditTime : 2021-08-02 15:50:16
 * @FilePath     : \cga.js\src\math\VecArray.ts
 */

export class VecArray {
    /**
     * 检测相邻没有重复点
     */
    static uniqueNeighbor(vs: number[], component: number = 3) {
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
    }

    /**
     * 去除任意重复点
     * 
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


    static distanceSq(...vecs: number[]) {
        if (vecs.length % 2 !== 0)
            console.error("VecArray:distanceSq  向量错误!!!");
        const len = vecs.length / 2;

        let lenSq = 0;
        for (let i = 0; i < len; i++) {
            var d = (vecs[i] - vecs[len + i]);
            lenSq += d * d;
        }
        return lenSq;
    }

    static distance(...vecs: number[]) {
        return Math.sqrt(this.distanceSq(...vecs));
    }

    static reverse(vs: number[], component: number = 3) {
        const length = vs.length;
        for (let i = 0; i < length; i += component) {
            vs.unshift(...vs.splice(i, component))
        }
        return vs;
    }

    static dot(...vecs: number[]) {
        if (vecs.length % 2 !== 0)
            console.error("VecArray:distanceSq  向量错误!!!");

        const len = vecs.length / 2;

        let dot = 0;
        for (let i = 0; i < len; i++) {
            dot += vecs[i] * vecs[len + i];
        }

        return dot;
    }

    static add(...vecs: number[]) {
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

    static sub(...vecs: number[]) {
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
}