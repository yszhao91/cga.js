/*
 * @Description  : 
 * @Author       : 赵耀圣
 * @Q群           : 632839661
 * @Date         : 2020-12-10 14:57:48
 * @LastEditTime : 2021-03-12 09:31:54
 * @FilePath     : \cga.js\rollup.config.js
 */
// Libs
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import gzip from 'rollup-plugin-gzip';
import nodeResolve from 'rollup-plugin-node-resolve';
import path from 'path';
import { uglify } from 'rollup-plugin-uglify';

// Read package config
const pkgConfig = require('./package.json');

// Constants
const DIST = process.env.DIST || false;
const MIN = process.env.MIN || false;

const banner = `/**
* https://github.com/yszhao91/cga.js
*CGA Lib |cga.js |alex Zhao | Zhao yaosheng
*@license free for all
*/`;

const plugins = [
    babel({
        exclude: 'node_modules/**'
    }),
    nodeResolve({
        browser: true
    }),
    commonjs({
        sourceMap: false,
        // namedExports: {
        //     'node_modules/eventemitter2/lib/eventemitter2.js': ['EventEmitter2']
        // }
        // 'namedExports': {
        //     './dist/src/index.js': ['__moduleExports']
        // }
    })
];

if (MIN) {
    plugins.push(uglify({
        output: {
            comments: /@license/
        }
    }));
    plugins.push(gzip());
}

export default {
    input: path.join('dist', 'index.js'),
    external: ['lodash'],
    plugins: plugins,
    output: {
        file: path.join(DIST ? 'dist' : 'build', '@xort_cga' + (MIN ? '.min' : '') + '.js'),
        format: 'umd',
        // format: 'umd',
        name: 'cga',
        banner: banner,
        globals: {
            lodash: '_'
        }
    }
};
