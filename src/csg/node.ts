/*
 * @Description  :
 * @Author       : 赵耀圣
 * @QQ           : 549184003
 * @Date         : 2021-08-03 10:18:26
 * @LastEditTime : 2021-08-03 15:56:34
 * @FilePath     : \cga.js\src\csg\node.ts
 */

import { Vec3 } from "src/math/Vec3";
import { Polygon } from "./polygon";



export class Node {
    front: Node | undefined;
    back: Node | undefined;
    polygons: Polygon[];
    divider: Polygon | undefined;
    constructor(polygons: Polygon[] = []) {
        this.polygons = polygons;
        if (polygons && polygons.length > 0)
            this.divider = polygons[0].clone();

        let i = 0;
        const plen = polygons.length;
        const front: any = [], back: any = [];

        if (this.divider)
            for (i = 0; i < plen; i++) {
                this.divider.splitPolygon(polygons[i], this.polygons, this.polygons, front, back);
            }

        if (front.length > 0) {
            this.front = new Node(front);
        }

        if (back.length > 0) {
            this.back = new Node(back);
        }
    }

    clone() {
        var node = new Node();

        if (this.divider)
            node.divider = this.divider.clone();
        node.polygons = this.polygons.map(function (polygon) {
            return polygon.clone();
        });
        node.front = this.front && this.front.clone();
        node.back = this.back && this.back.clone();

        return node;
    }

    invert() {
        var i, polygon_count, temp;

        for (i = 0, polygon_count = this.polygons.length; i < polygon_count; i++) {
            this.polygons[i].flip();
        }
    }

    clipPolygons(polygons: Polygon[]) {
        var i, plen,
            front: any = [], back: any = [];

        if (!this.divider) return polygons.slice();

        front = [];
        back = [];

        for (i = 0, plen = polygons.length; i < plen; i++) {
            this.divider.splitPolygon(polygons[i], front, back, front, back);
        }

        if (this.front) front = this.front.clipPolygons(front);
        if (this.back) back = this.back.clipPolygons(back);
        else back = [];

        return front.concat(back);
    }


    clipTo(node: Node) {
        this.polygons = node.clipPolygons(this.polygons);
        if (this.front) this.front.clipTo(node);
        if (this.back) this.back.clipTo(node);
    }
}