declare module "cga" {
    /**
     * 遍历多级数组中所有对象
     * @param {Array} array
     * @param {Function} method
     */
    declare function forall(array: Array<any>, method: (arg0: any, index?: number, that?: Array<any>) => void): void;
    declare function flat(array: any[]): any[];
    /**
     * 分类
     * example:
     *      var arry = [1,2,3,4,5,6]
     *      var result = classify(array,(a)={return a%2===0})
     *
     * @param {Array} array
     * @param {Function} classifyMethod  分类方法
     */
    declare function classify(array: Array<any>, classifyMethod: (arg0: any, arg1: any, arg2: any[]) => any): any;
    /**
     * 去掉重复元素
     * @param {Array} array
     * @param {Function} uniqueMethod  去重复
     * @param {Function} sortMethod 排序 存在就先排序再去重复
     */
    declare function unique(array: any[], uniqueMethod: (arg0: any, arg1: any) => boolean, sortMethod?: (a: any, b: any) => number): any[];

    declare class Euler {
        _x: number;
        _y: number;
        _z: number;
        _order: string;
        isEuler: boolean;
        constructor(_x?: number, _y?: number, _z?: number, _order?: string);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get order(): string;
        set order(value: string);
        set(x: number, y: number, z: number, order: string): this;
        clone(): Euler;
        copy(Euler: {
            _x: number;
            _y: number;
            _z: number;
            _order: string;
        }): this;
        setFromRotationMat(m: Mat4, order: string, update: boolean | undefined): this | undefined;
        setFromQuat(q: Quat, order?: any, update?: boolean): this | undefined;
        setFromVec3(v: {
            x: any;
            y: any;
            z: any;
        }, order: any): this;
        reorder(newOrder: any): this | undefined;
        equals(Euler: {
            _x: number;
            _y: number;
            _z: number;
            _order: string;
        }): boolean;
        fromArray(array: any[]): this;
        toArray(array?: any[], offset?: number): any[];
        toVec3(optionalResult: {
            set: (arg0: number, arg1: number, arg2: number) => any;
        }): any;
    }
    declare function euler(x?: number, y?: number, z?: number): Euler;

    declare class Quat {
        _x: number;
        _y: number;
        _z: number;
        _w: number;
        isQuat: boolean;
        constructor(_x?: number, _y?: number, _z?: number, _w?: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get w(): number;
        set w(value: number);
        static slerp(qa: any, qb: any, qm: {
            copy: (arg0: any) => {
                (): any;
                new(): any;
                slerp: {
                    (arg0: any, arg1: any): any;
                    new(): any;
                };
            };
        }, t: any): any;
        static slerpFlat(dst: {
            [x: string]: any;
        }, dstOffset: number, src0: {
            [x: string]: any;
        }, srcOffset0: number, src1: {
            [x: string]: any;
        }, srcOffset1: number, t: number): void;
        static multiplyQuatsFlat(dst: {
            [x: string]: number;
        }, dstOffset: number, src0: {
            [x: string]: any;
        }, srcOffset0: number, src1: {
            [x: string]: any;
        }, srcOffset1: number): {
            [x: string]: number;
        };
        set(x: number, y: number, z: number, w: number): this;
        clone(): Quat;
        copy(quat: Quat): this;
        setFromEuler(euler: Euler, update?: boolean): this;
        setFromAxisAngle(axis: {
            x: number;
            y: number;
            z: number;
        }, angle: number): this;
        setFromRotationMat(m: {
            elements: any;
        }): this;
        setFromUnitVecs(vFrom: {
            dot: (arg0: any) => number;
            x: number;
            z: number;
            y: number;
        }, vTo: {
            z: number;
            y: number;
            x: number;
        }): this;
        angleTo(q: any): number;
        rotateTowards(q: any, step: number): this;
        inverse(): this;
        invert(): this;
        conjugate(): this;
        dot(v: Quat): number;
        lengthSq(): number;
        length(): number;
        normalize(): this;
        multiply(q: Quat, p?: Quat): this;
        premultiply(q: Quat): this;
        multiplyQuats(a: Quat, b: Quat): this;
        slerp(qb: Quat, t: number): this;
        equals(quat: Quat): boolean;
        fromArray(array: Array<number>, offset?: number): this;
        toArray(array?: number[], offset?: number): number[];
    }
    declare function quat(x?: number, y?: number, z?: number, w?: number): Quat;

    interface DistanceResult {
        rayParameter?: any;
        lineParameter?: any;
        closests?: Array<any>;
        parameters?: Array<any>;
        distance?: number;
        distanceSqr?: number;
        equidistant?: boolean;
        interior?: boolean;
        triangleParameters?: Array<any>;
        rectangleParameters?: Array<any>;
        circleClosest?: Vec3;
        signedDistance?: number;
        segmentIndex?: number;
        diskClosest?: Vec3;
    }
    interface IntersectResult extends DistanceResult {
        interserct?: boolean;
        equals?: boolean;
        intersetctPts: Array<Array<Vec3>>;
    }

    declare enum Orientation {
        None = -1,
        Positive = 1,
        Negative = 2,
        Common = 3,
        Intersect = 3
    }

    declare class Triangle extends Array {
        constructor(_p0: Vec3, _p1: Vec3, _p2: Vec3);
        get p0(): any;
        get p1(): any;
        get p2(): any;
        distanceTriangle(triangle: Triangle): void;
    }

    type TypedArray = Int8Array | Uint8Array | Uint8ClampedArray | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;
    type TypedArrayLike = number[] | Int8Array | Uint8Array | Int16Array | Uint16Array | Int32Array | Uint32Array | Float32Array | Float64Array;

    /**
     * 几何体buffer属性
     * 记录每个几何数据属性的细节
     */
    declare class BufferAttribute {
        name: string;
        itemSize: number;
        array: TypedArray;
        version: number;
        normalized: boolean;
        count: number;
        updateRange: {
            offset: number;
            count: number;
        };
        readonly isBufferAttribute: true;
        /**
         *
         * @param array {BufferArray} Buffer数据
         * @param itemSize 单元长度，vec3是3，vec4是4
         * @param normalized
         */
        constructor(array: TypedArray, itemSize: number, normalized?: boolean);
        set needsUpdate(value: boolean);
        onUploadCallback?: () => void;
        onUpload(callback: () => void): this;
        setUsage(usage: any): this;
        copy(source: BufferAttribute): this;
        copyAt(index1: number, attribute: BufferAttribute, index2: number): this;
        copyArray(array: ArrayLike<number>): this;
        copyColorsArray(colors: {
            r: number;
            g: number;
            b: number;
        }[]): this;
        copyVec2sArray(vectors: {
            x: number;
            y: number;
        }[]): this;
        copyVec3sArray(vectors: {
            x: number;
            y: number;
            z: number;
        }[]): this;
        copyVec4sArray(vectors: {
            x: number;
            y: number;
            z: number;
            w: number;
        }[]): this;
        applyMat3(m: Mat3): this;
        applyMat4(m: Mat4): this;
        applyNormalMat(m: Mat3): this;
        transformDirection(m: Mat4): this;
        set(value: ArrayLike<number>, offset: number): this;
        getX(index: number): number;
        setX(index: number, x: number): this;
        getY(index: number): number;
        setY(index: number, y: number): this;
        getZ(index: number): number;
        setZ(index: number, z: number): this;
        getW(index: number): number;
        setW(index: number, w: number): this;
        setXY(index: number, x: number, y: number): this;
        setXYZ(index: number, x: number, y: number, z: number): this;
        setXYZW(index: number, x: number, y: number, z: number, w: number): this;
        clone(): BufferAttribute;
        toJSON(): {
            itemSize: number;
            type: string;
            array: number[];
            normalized: boolean;
        };
    }
    declare class Int8BufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }
    declare class Uint8BufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }
    declare class Uint8ClampedBufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }
    declare class Int16BufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }
    declare class Uint16BufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }
    declare class Int32BufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }
    declare class Uint32BufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }
    declare class Float32BufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }
    declare class Float64BufferAttribute extends BufferAttribute {
        constructor(array: any, itemSize: number, normalized?: boolean);
    }

    declare class Box {
        min: Vec3;
        max: Vec3;
        _center: Vec3;
        constructor(min?: Vec3, max?: Vec3);
        get center(): Vec3;
        /**
         *
         * @param {Array<Vec3>} points
         */
        setFromPoints(points: any): void;
        expand(...points: any[]): void;
        makeEmpty(): this;
        clone(): Box | undefined;
        copy(box: Box): Box;
        setFromCenterAndSize(center: Vec3, size: Vec3): this;
        setFromBufferAttribute(attribute: BufferAttribute): this;
        expandByPoint(point: Vec3): this;
        isEmpty(): boolean;
        getCenter(target: Vec3): Vec3;
    }

    declare class Sphere {
        applyMat4(mat: Mat4): void;
        center: Vec3;
        radius: number;
        constructor(center?: Vec3, radius?: number);
        setComponents(cx: number, cy: number, cz: number, radius: number): this;
        copy(sphere: Sphere): this;
        clone(): Sphere | undefined;
    }

    declare class Vec4 {
        private _x;
        private _y;
        private _z;
        private _w;
        isVec4: boolean;
        constructor(_x?: number, _y?: number, _z?: number, _w?: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        get w(): number;
        set w(value: number);
        static isVec4(v: Vec4): boolean;
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        set(x: number, y: number, z: number, w: number): this;
        setScalar(scalar: number): this;
        setX(x: number): this;
        setY(y: number): this;
        setZ(z: number): this;
        setW(w: number): this;
        setComponent(index: number, value: number): this;
        getComponent(index: number): number;
        clone(): Vec4;
        copy(v: {
            x: number;
            y: number;
            z: number;
            w: number | undefined;
        }): this;
        add(v: Vec4, w?: Vec4): Vec4;
        addScalar(s: number): this;
        addVecs(a: Vec4, b: Vec4): this;
        addScaledVec(v: Vec4, s: number): this;
        sub(v: Vec4, w?: Vec4): this;
        subScalar(s: number): this;
        subVecs(a: Vec4, b: Vec4): this;
        multiplyScalar(scalar: number): this;
        applyMat4(m: {
            elements: any;
        }): this;
        divideScalar(scalar: number): this;
        setAxisAngleFromQuat(q: {
            w: number;
            x: number;
            y: number;
            z: number;
        }): this;
        setAxisAngleFromRotationMat(m: {
            elements: any;
        }): this;
        min(v: Vec4): this;
        max(v: Vec4): this;
        clamp(min: Vec4, max: Vec4): this;
        clampScalar(minVal: number, maxVal: number): this;
        clampLength(min: number, max: number): this;
        floor(): this;
        ceil(): this;
        round(): this;
        roundToZero(): this;
        negate(): this;
        dot(v: Vec4): number;
        lengthSq(): number;
        length(): number;
        manhattanLength(): number;
        normalize(): this;
        setLength(length: any): this;
        lerp(v: Vec4, alpha: number): this;
        lerpVecs(v1: Vec4, v2: any, alpha: any): Vec4;
        equals(v: Vec4): boolean;
        fromArray(array: TypedArrayLike, offset?: number): this;
        toArray(array?: TypedArrayLike, offset?: number): TypedArrayLike;
        fromBufferAttribute(attribute: any, index: any, offset: undefined): this;
    }
    declare function v4(x?: number, y?: number, z?: number, w?: number): Vec4;

    interface IGeometry {
        position: number[];
        normal?: number[];
        index?: number[];
        uv?: number[];
        uv2?: number[];
        tangent?: number[];
    }
    interface IBufferGeometry {
        position: Float32Array | undefined;
        index?: Uint32Array | Uint16Array;
        normal?: Float32Array;
        uv?: Float32Array;
        uv2?: Float32Array;
        tangent?: Float32Array;
    }
    /**
     * BufferType 几何体，用于独立计算几何体
     */
    declare class BufferGeometry {
        name: string;
        boundingBox: Box | undefined;
        boundingSphere: Sphere | undefined;
        morphAttributes: any;
        morphTargetsRelative: boolean;
        index: BufferAttribute | undefined;
        attributes: {
            [key: string]: BufferAttribute;
        };
        groups: {
            start: number;
            count: number;
            materialIndex?: number;
        }[];
        drawRange: {
            start: number;
            count: number;
        };
        parameters: any;
        readonly isBufferGeometry: true;
        constructor();
        /**
         * 转化成BufferArray来计算
         * @param geo
         */
        setFromGeometry(geo: IGeometry | IBufferGeometry): this;
        getIndex(): BufferAttribute | undefined;
        setIndex(index: BufferAttribute | TypedArray | number[]): void;
        getAttribute(name: string): BufferAttribute;
        setAttribute(name: string, attribute: BufferAttribute): this;
        addAttribute(name: string, attribute: BufferAttribute | TypedArray | Array<number | Vec2 | Vec3 | Vec4>, itemSize?: number): this;
        deleteAttribute(name: string): this;
        addGroup(start: number, count: number, materialIndex?: number): void;
        clearGroups(): void;
        setDrawRange(start: number, count: number): void;
        applyMat4(matrix: Mat4): this;
        rotateX(angle: number): this;
        rotateY(angle: number): this;
        rotateZ(angle: number): this;
        translate(x: number, y: number, z: number): this;
        scale(x: number, y: number, z: number): this;
        lookAt(vector: Vec3): this;
        center(): this;
        setFromObject(object: any): this;
        setFromPoints(points: Vec3[]): this;
        updateFromObject(object: any): this;
        computeBoundingBox(): void;
        computeBoundingSphere(): void;
        computeFaceNormals(): void;
        computeVertexNormals(): void;
        merge(geometry: BufferGeometry, offset: number): this | undefined;
        normalizeNormals(): void;
        toFlat(): BufferGeometry;
        toNonIndexed(): BufferGeometry;
        toJSON(): any;
        userData(userData: any): void;
        clone(): BufferGeometry;
        copy(source: BufferGeometry): this;
    }

    interface ISplitResult {
        negative: Vec3[];
        positive: Vec3[];
        common: Vec3[];
        orientation: Orientation;
    }

    declare class Plane {
        normal: Vec3;
        w: number;
        origin: Vec3;
        constructor(normal?: Vec3, w?: number);
        static setFromPointNormal(p: Vec3, normal: Vec3): Plane;
        setFromPointNormal(p: Vec3, normal: Vec3): void;
        set(normal: Vec3, w: number): void;
        setComponents(x: number, y: number, z: number, w: number): this;
        normalize(): this;
        setFromThreePoint(p0: Vec3, p1: Vec3, p2: Vec3): void;
        negate(): void;
        /**
         * 判断一个点在平面的正面或者反面
         * @param  {Vec3} point
         * @returns {Number} -1 or 1 or z
         */
        frontback(point: any): 0 | 1 | -1;
        distancePoint(point: any): number;
        distanceRay(ray: any): void;
        distanceLine(line: any): void;
        distanceSegment(segment: any): void;
        distancePlane(plane: any): void;
        /**
         * 只返回交点
         * Lw --Lightweight
         * @param {Segment|Array<Vec3> segment
         */
        intersectSegmentLw(segment: Segment | Vec3[]): Vec3 | Vec3[] | Segment | null;
        intersectLine(line: Line, result?: Vec3): Vec3 | undefined;
        /**
           * 切割线段 代码完成  等待测试
           * @param {Segment} segment
           * @returns {
              *       positive: [], //正面点
              *       negative: [],// 反面位置点
              *       common: [], 在平面上的点
              *       orientation: Orientation.None 线段的总体位置
              *   };
              */
        splitSegment(segment: Segment | Vec3[]): any;
        /**
         * 切割三角形 编码完成  等待测试
         * @param {Triangle} triangle
         */
        splitTriangle(triangle: Triangle | Vec3[]): ISplitResult;
        /**
         * 平面切割线段
         * @param polyVS
         */
        splitPolyVS(polyVS: Vec3[]): void;
        /**
         * 点在平面的位置判断
         * @param {Point} point
         * @returns {Orientation} 方位
         */
        orientationPoint(point: Vec3): Orientation;
        /**
         * @description : 平面分割几何体
         * @param        {Plane} plane
         * @param        {IGeometry} geometry
         * @return       {IGeometry[]} 返回多个几何体
         * @example     :
         */
        static splitGeometry(plane: Plane, geometry: IGeometry): void;
    }

    declare class Segment extends Array {
        center: Vec3;
        extentDirection: Vec3;
        extentSqr: number;
        extent: number;
        direction: Vec3;
        normal: Vec3 | undefined;
        /**
         * 线段
         * @param  {Point|Vec3} p0
         * @param  {Point|Vec3} p1
         */
        constructor(_p0?: Vec3, _p1?: Vec3);
        set(p0: Vec3, p1: Vec3): void;
        private change;
        get p0(): Vec3;
        set p0(v: Vec3);
        get p1(): Vec3;
        set p1(v: Vec3);
        offset(distance: number, normal?: Vec3): void;
        /**
         * 线段到线段的距离
         * @param  {Segment} segment
         */
        distanceSegment(segment: Segment): DistanceResult;
        distancePlane(plane: Plane): void;
        intersectSegment(segment: Segment): void;
    }
    declare function segment(p0: Vec3, p1: Vec3): Segment;

    declare class Ray {
        origin: Vec3;
        direction: Vec3;
        constructor(origin: Vec3, direction: Vec3);
        /**
      * 射线到射线的距离
      * @param  {Ray} ray
      */
        distanceRay(ray: Ray): DistanceResult;
        /**
         * 射线到线段的距离
         * @param segment
         */
        distanceSegment(segment: Segment): DistanceResult;
        distanceTriangle(triangle: Triangle): DistanceResult;
        distancePloyline(): DistanceResult;
    }

    declare enum AxisPlane {
        XY = "xy",
        XZ = "xz",
        YZ = "yz",
        XYZ = "xyz"
    }

    declare class ArrayList<T> {
        protected _array: Array<T>;
        isArrayList: boolean;
        constructor(data?: Array<T> | ArrayList<T>);
        get array(): T[];
        set array(val: T[]);
        get length(): number;
        get last(): any;
        get first(): T;
        map(callbackfn: (value: T, index: number, array: T[]) => unknown): unknown[];
        push(...values: any[]): void;
        reverse(): this;
        pop(): any;
        unshift(...items: any[]): number;
        insertAt(i: number, ...value: T[]): void;
        splice(start: number, deleteCount: number, ...items: any[]): void;
        get(index: number): any;
        /**
         * 遍历
         * @param {*} method
         */
        forall(method: (arg0: any) => void): void;
        /**
         * 克隆
         */
        clone(): any;
        /**
         * 分类
         * example:
         *      var arry = [1,2,3,4,5,6]
         *      var result = classify(this._array,(a)={return a%2===0})
         *
         * @param {Function} classifyMethod  分类方法
         */
        classify(classifyMethod: (arg0: any, arg1: any, arg2: any[]) => any): T[][];
        /**
         * 去掉重复元素
         * @param {Function} uniqueMethod  去重复
         * @param {Function} sortMethod 排序
         */
        unique(uniqueMethod: (arg0: T, arg1: T) => boolean, sortMethod?: ((a: T, b: T) => number)): this;
    }

    interface ILinkSideOption {
        side0: {
            x: number;
            y: number;
            z: number;
            index?: number;
        }[] | number[];
        side1: {
            x: number;
            y: number;
            z: number;
            index?: number;
        }[] | number[];
        holes0?: Array<Array<Vec3>>;
        holes1?: Array<Array<Vec3>>;
        shapeClosed?: boolean;
        autoUV?: boolean;
        uvScalars?: number[];
        segs?: [];
    }
    /**
     *  常用shape几何操作
     */
    /**
     * @description : 缝合两个边 不提供uv生成  uv有@linkSides 生成
     * @param        { ILinkSideOption } options
     * @returns      { Array<Vec3>} 三角形数组，每三个为一个三角形
     * @example     :
     */
    declare function linkSide(options: ILinkSideOption): number[];
    /**
     * 缝合shape集合
     * @param {Array<Array<Point|Vec3>} shapes  路基 点集的集合， 每个shape的点数量一致
     * @param {Boolean} sealStart 每一个shape是否是封闭的界面 默认false
     * @param {Boolean} isClosed 每一个shape是否是封闭的界面 默认false
     * @param {Boolean} isClosed2 每一个shape是否是封闭的首尾 默认false
     * @returns {Array} 返回三角形集合 如果有所用范围索引，否则返回顶点
     */
    interface ILinkSideOptions {
        shapes: Array<Array<IVec3 | any | IVec3>>;
        orgShape?: Array<IVec3 | any | IVec3>;
        orgHoles?: any;
        sealStart?: boolean;
        sealEnd?: boolean;
        shapeClosed?: boolean;
        pathClosed?: boolean;
        index?: {
            index: number;
        };
        autoIndex?: boolean;
        generateUV?: boolean;
        axisPlane?: AxisPlane;
        holes?: Array<Array<IVec3 | any | IVec3>>[];
    }
    /**
     * @description : 链接多个shape 生成几何体
     * @param        {ILinkSideOptions} optionsILinkSideOptions {
     *   shapes: Array<Array<IVec3 | number | any>>;
     *   sealStart?: boolean,//开始封面
     *   sealEnd?: boolean;//结束封面
     *   shapeClosed?: boolean,//shape是否闭合
     *   pathClosed?: boolean,//路径是否闭合
     *   index?: { index: number },
     *   generateUV?: boolean
     *   }
     *
     * @return       {*}
     * @example     :
     *
     */
    declare function linkSides(options: ILinkSideOptions): IGeometry;
    interface IExtrudeOptions {
        fixedY?: boolean;
        shapeClosed?: boolean;
        isClosed2?: boolean;
        textureEnable?: boolean;
        textureScale?: Vec2;
        smoothAngle?: number;
        sealStart?: boolean;
        sealEnd?: boolean;
        normal?: Vec3;
    }
    interface IExtrudeOptionsEx {
        shape: Array<Vec3 | IVec3 | Vec2 | IVec2>;
        path: Array<Vec3 | IVec3>;
        ups?: Array<Vec3 | IVec3>;
        up?: Vec3 | IVec3;
        right?: Vec3;
        shapeClosed?: boolean;
        pathClosed?: boolean;
        textureEnable?: boolean;
        smoothAngle?: number;
        enableSmooth?: boolean;
        sealStart?: boolean;
        sealEnd?: boolean;
        normal?: Vec3;
        autoIndex?: boolean;
        axisPlane?: AxisPlane;
        generateUV?: boolean;
        index?: {
            index: number;
        };
        holes?: Array<Vec3 | IVec3 | Vec2 | IVec2>[];
    }
    /**
     * @description : 挤压形状生成几何体
     * @param        {IExtrudeOptionsEx} options
     *   IExtrudeOptionsEx {
     *    shape: Array<Vec3 | IVec3 | Vec2 | IVec2>;//shape默认的矩阵为正交矩阵
     *    path: Array<Vec3 | IVec3>;//挤压路径
     *    ups?: Array<Vec3 | IVec3>;
     *    up?: Vec3 | IVec3;
     *    shapeClosed?: boolean;//闭合为多边形 界面
     *    pathClosed?: boolean;//首尾闭合为圈
     *    textureEnable?: boolean;
     *    smoothAngle?: number;
     *    sealStart?: boolean;
     *    sealEnd?: boolean;
     *    normal?: Vec3,//面的法线
     *    autoIndex?: boolean,
     *    index?: { index: number }
     *    holes?: Array<Vec3 | IVec3 | Vec2 | IVec2>[]
     *}
     * @return       {IGeometry}
     * @example     :
     *
     */
    declare function extrude(options: IExtrudeOptionsEx): IGeometry;
    /**
     * 挤压
     * @param {Polygon|Array<Point|Vec3> }  shape   多边形或顶点数组
     * @param {Path|Array<Point|Vec3> } path  路径或者或顶点数组
     * @param {Object} options {
     *      isClosed: false,闭合为多边形 界面
     *      isClosed2: false, 闭合为圈
     *      textureEnable: true, 计算纹理坐标
     *      textureScale: new Vec2(1, 1),纹理坐标缩放
     *      smoothAngle: Math.PI / 180 * 30,大于这个角度则不平滑
     *      sealStart: true, 是否密封开始面
     *      sealEnd: true,是否密封结束面}
     */
    declare function extrude_obsolete<T extends Vec3>(shape: ArrayList<T>, arg_path: Array<Vec3> | any, options?: IExtrudeOptions): {
        vertices: any[];
        index: number[] | undefined;
        uvs: any[];
    };
    declare enum JoinType {
        Square = 0,
        Round = 1,
        Miter = 2,
        Bevel = 0
    }
    declare enum EndType {
        Square = 0,
        Round = 1,
        Butt = 2,
        etClosedLine = 3,
        etClosedPolygon = 4,
        etOpenButt = 5,
        etOpenSquare = 6
    }
    interface IExtrudeOptionsNext {
        shape: Array<Vec3>;
        path: Array<Vec3 | IVec3>;
        up?: Array<Vec3 | IVec3> | Vec3 | IVec3;
        right?: Array<Vec3> | Vec3;
        shapeClosed?: boolean;
        pathClosed?: boolean;
        textureEnable?: boolean;
        shapeCenter?: Vec3;
        smoothAngle?: number;
        enableSmooth?: boolean;
        sealStart?: boolean;
        sealEnd?: boolean;
        normal?: Vec3;
        autoIndex?: boolean;
        axisPlane?: AxisPlane;
        generateUV?: boolean;
        index?: {
            index: number;
        };
        holes?: Array<Vec3 | IVec3 | Vec2 | IVec2>[];
        jtType?: JoinType;
        etType?: EndType;
        bevelSize?: any;
    }
    /**
     * 将路径看做挤压操作中心
     *
     * @param shape
     * @param followPath
     * @param options
     */
    declare function extrudeNext(options: IExtrudeOptionsNext): IGeometry;

    declare class Polygon<T> extends Polyline<T> {
        isPolygon: boolean;
        constructor(vs?: any[]);
        offset(distance: number, normal?: Vec3): Polygon<T>;
        containPoint(point: Vec3): void;
    }

    /**
     *  线段正反原则：右手坐标系中，所在平面为XZ平面，把指向方向看着负Z轴，x正为正方向，x负为负方向
     */
    declare class Polyline<T> extends ArrayList<T> {
        isCoPlanar: boolean;
        isPolyline: boolean;
        normal: Vec3;
        constructor(vs?: Array<T> | Polyline<T> | Polygon<T>, normal?: Vec3);
        /**
         * 偏移
         * @param {Number} distance  偏移距离
         * @param {Vector3} normal  折线所在平面法线
         */
        offset(distance: number, normal?: Vec3, endtype?: EndType, jointype?: JoinType): Polyline<T>;
        /**
         * 圆角   将折线拐点圆角化
         * @param {Number} useDistance 圆角段距离
         * @param {Number} segments 分切割段数
         */
        corner(useDistance: number, normal?: Vec3): Polyline<T>;
    }

    declare class Line {
        origin: Vec3;
        end: Vec3;
        direction: Vec3;
        constructor(origin?: Vec3, end?: Vec3);
        set(origin: Vec3, end: Vec3): this;
        distancePoint(pt: Vec3): DistanceResult;
        distanceSegment(segment: Segment): DistanceResult;
        /**
         * 直线到直线的距离
         * 参数与最近点顺序一致
         * @param  {Line} line
         */
        distanceLine(line: Line): DistanceResult;
        /**
         * 直线与射线的距离
         * @param {Ray} ray
         */
        distanceRay(ray: Ray): DistanceResult;
        /**
         *
         * @param triangle
         */
        distanceTriangle(triangle: Triangle): DistanceResult;
        distancePolyline(polyline: Polyline<Vec3> | Vec3[]): DistanceResult;
        /**
         * 线与平面相交
         * @param plane
         * @param result
         */
        intersectPlane(plane: Plane, result?: Vec3): Vec3 | undefined;
    }
    declare function line(start?: Vec3, end?: Vec3): Line;

    declare class Capsule extends Segment {
        radius: number;
        /**
         * 胶囊体
         * @param {Point|Vec3} p0 点0
         * @param {Point|Vec3} p1 点1
         * @param {Number} radius  半径
         */
        constructor(p0: Vec3, p1: Vec3, radius?: number);
    }

    declare class Rectangle extends Array {
        extent: number[];
        axis: Vec3[];
        center: Vec3;
        constructor(v0: Vec3, v1: Vec3, v2: Vec3, v3: Vec3);
    }

    declare class Circle {
        center: Vec3;
        radius: number;
        normal: Vec3;
        startAngle: number;
        lengthAngle: number;
        radiusSqr: number;
        /**
         * 圆圈
         * @param  {Vec3} center 中心点
         * @param  {Vec3} normal 法线
         * @param  {Number} radius 半径
         */
        constructor(center?: Vec3, radius?: number, startAngle?: number, lengthAngle?: number, normal?: Vec3);
        area(): number;
        /**
         * 两个点
         * @param fixp0
         * @param fixp1
         * @param movep
         * @param normal
         */
        arc1(fixp0: Vec3, fixp1: Vec3, movep: Vec3, normal?: Vec3): void;
        /**
         * 全两个点确定半径，后面点确定 弧度 ,只需要检测鼠标移动时鼠标是否跨过第一条半径即可确定顺逆时针
         * @param fixp0
         * @param fixp1
         * @param movep
         */
        arc2(center: Vec3, fixp1: Vec3, movep: Vec3, ccw?: boolean, normal?: Vec3): void;
        setFrom3Points(p0: Vec3, p1: Vec3, p2: Vec3, normal?: Vec3): this;
        /**
         * 将圆环或者圆弧转化为路径点，生成XY平面上得三维点
         * @param center 中心点
         * @param radius 半径
         * @param startAngle 起始角 右手坐标系 以X正坐标轴为起点 单位弧度
         * @param lengthAngle 弧度长度   单位弧度
         * @param segment 分段
         */
        static toVertices(center: Vec3, radius: number, startAngle?: number, lengthAngle?: number, segment?: number): Vec3[];
    }
    declare function circle(center?: Vec3, radius?: number): Circle;

    declare class Disk {
        center: Vec3;
        normal: Vec3;
        radius: number;
        w: number;
        constructor(center: Vec3, radius: number, normal?: Vec3);
        area(): number;
    }
    declare function disk(center: Vec3, radius: number, normal: Vec3): Disk;

    interface IVec2 {
        x: number;
        y: number;
    }
    interface IVec3 extends IVec2 {
        z: number;
    }
    interface IVec4 extends IVec3 {
        w: number;
    }
    declare class Vec3 implements IVec3 {
        private _x;
        private _y;
        private _z;
        constructor(_x?: number, _y?: number, _z?: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);
        static isVec3(v: any): boolean;
        get isVec3(): boolean;
        static get Up(): Vec3;
        static get Down(): Vec3;
        static get UnitX(): Vec3;
        static get UnitY(): Vec3;
        static get UnitZ(): Vec3;
        set(x: number, y: number, z: number): this;
        setScalar(scalar: number): this;
        setComponent(index: number, value: number): this;
        getComponent(index: number): number;
        clone(): Vec3;
        copy(v: Vec3): this;
        add(v: Vec3, w?: Vec3): this;
        addScalar(s: number): this;
        addVecs(a: Vec3, b: Vec3): this;
        addScaledVec(v: Vec3, s: number): this;
        sub(v: Vec3, w?: Vec3): this;
        subScalar(s: number): this;
        subVecs(a: Vec3, b: Vec3): this;
        multiply(v: Vec3, w?: Vec3): this;
        multiplyScalar(scalar: number): this;
        multiplyVecs(a: Vec3, b: Vec3): this;
        applyEuler(euler: Euler): this;
        applyAxisAngle(axis: any, angle: any): this;
        applyNormalMat(m: Mat3): this;
        applyMat3(m: Mat3): this;
        applyMat4(m: Mat4): this;
        applyQuat(q: Quat): this;
        project(camera: {
            matrixWorldInverse: any;
            projectionMat: any;
        }): this;
        unproject(camera: {
            projectionMatInverse: any;
            matrixWorld: any;
        }): this;
        transformDirection(m: Mat4): this;
        divide(v: Vec3): this;
        divideScalar(scalar: number): this;
        min(v: Vec3): this;
        max(v: Vec3): this;
        clamp(min: Vec3, max: Vec3): this;
        clampScalar(minVal: number, maxVal: number): this;
        clampLength(min: number, max: number): this;
        floor(): this;
        ceil(): this;
        round(): this;
        roundToZero(): this;
        negate(): this;
        dot(v: Vec3): number;
        lengthSq(): number;
        length(): number;
        manhattanLength(): number;
        normalize(robust?: boolean): this;
        setLength(length: any): this;
        lerp(v: Vec3, alpha: number): this;
        lerpVecs(v1: Vec3, v2: any, alpha: any): this;
        slerp(v2: any, radian: number): void;
        /**
         *  v1 到 v2 选择angle弧度  v1，v2构成一个平面
         * @param v1
         * @param v2
         * @param alpha
         * @returns
         */
        slerpVecs(v1: Vec3, v2: any, radian: number): void;
        cross(v: Vec3, w?: Vec3): this;
        crossVecs(a: Vec3, b: Vec3): this;
        projectOnVec(vec: Vec3): this;
        /**
         * 投影到法线的所在平面  相当于平面上距离点最近的点
         * @param planeNormal
         * @returns
         */
        projectOnPlaneNormal(planeNormal: any): this;
        /**
         * 投影到平面
         * @param normal 正交化的法线
         * @param w  距离
         * @returns
         */
        projectOnPlaneNormalDis(normal: Vec3, w: number): this;
        /**
       * 投影到平面
       * @param plane 平面
       * @returns
       */
        projectOnPlane(plane: Plane): this;
        /**
         * 从指定方向线(斜线，也可能是法线)上投影到平面
         * @param planeNormal
         * @param dir
         */
        projectDirectionOnPlane(plane: Plane, dir: Vec3): this;
        reflect(normal: any): this;
        angleTo(v: Vec3, normal?: Vec3 | any): number;
        angleToEx(v: Vec3, normal: Vec3): number;
        distanceTo(v: any): number;
        distanceToSquared(v: Vec3): number;
        manhattanDistanceTo(v: Vec3): number;
        setFromSpherical(s: {
            radius: number;
            phi: number;
            theta: number;
        }): this;
        setFromSphericalCoords(radius: number, phi: number, theta: number): this;
        setFromCylindrical(c: {
            radius: any;
            theta: any;
            y: any;
        }): this;
        setFromCylindricalCoords(radius: number, theta: number, y: number): this;
        setFromMatPosition(m: {
            elements: any;
        }): this;
        setFromMatScale(m: any): this;
        setFromMatColumn(m: {
            elements: any;
        }, index: number): this;
        equals(v: Vec3): boolean;
        fromArray(array: ArrayLike<number>, offset?: number): this;
        toArray(array?: TypedArrayLike, offset?: number): TypedArrayLike;
        fromBufferAttribute(attribute: {
            getX: (arg0: any) => number;
            getY: (arg0: any) => number;
            getZ: (arg0: any) => number;
        }, index: any, offset?: number): this;
        toFixed(fractionDigits: number | undefined): this;
        distancePoint(point: Vec3): DistanceResult;
        distanceVec3(point: Vec3): DistanceResult;
        /**
         * 点到直线的距离  point distance to Line
         * @param line
         */
        distanceLine(line: Line): DistanceResult;
        /**
       * Test success
       * 到射线的距离
       * @param  {Line} line
       * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
       */
        distanceRay(ray: Ray): DistanceResult;
        /**
        * Test success
        * 到线段的距离
        * @param  {Line} line
        * @returns {Object} lineParameter 最近点的参数  lineClosest 最近点  distanceSqr 到最近点距离的平方  distance 到最近点距离
        */
        distanceSegment(segment: Segment): DistanceResult;
        /**
         * 点与线段的距离
         * @param plane
         */
        distancePlane(plane: Plane): DistanceResult;
        /**
         * 点与圆圈的距离
         * @param {*} circle
         * @param {*} disk
         * @returns {} result
         */
        distanceCircle(circle: Circle): DistanceResult;
        /**
        * 点与圆盘的距离
        * @param {*} Disk
        * @returns {} result
        */
        distanceDisk(disk: Disk): DistanceResult;
        /**
         * 点与线段的距离
         * 点与折线的距离 测试排除法，平均比线性检索(暴力法)要快两倍以上
         * @param { Polyline | Vec3[]} polyline
         */
        distancePolyline(polyline: Polyline<Vec3> | Vec3[]): DistanceResult | null;
        /**
         * 点到三角形的距离
         * @param {Triangle} triangle
         */
        distanceTriangle(triangle: Triangle): DistanceResult;
        /**
         * 点到矩形的距离
         * @param  {Rectangle} rectangle
         */
        distanceRectangle(rectangle: Rectangle): DistanceResult;
        /**
        * 点到胶囊的距离
        * @param {Capsule} capsule
        */
        distanceCapsule(capsule: Capsule): DistanceResult;
    }
    declare function v3(x?: number, y?: number, z?: number): Vec3;

    declare class Mat4 {
        elements: number[];
        isMat4: boolean;
        constructor();
        set(n11: number, n12: number, n13: number, n14: number, n21: number, n22: number, n23: number, n24: number, n31: number, n32: number, n33: number, n34: number, n41: number, n42: number, n43: number, n44: number): this;
        static get Identity(): Mat4;
        identity(): this;
        clone(): Mat4;
        copy(m: Mat4): this;
        copyPosition(m: {
            elements: any;
        }): this;
        extractBasis(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this;
        makeBasis(xAxis: Vec3, yAxis: Vec3, zAxis: Vec3): this;
        extractRotation(m: Mat4): this;
        makeRotationFromEuler(euler: Euler): this;
        makeRotationFromQuat(q: any): this;
        lookAt(eye: Vec3, target: Vec3, up: Vec3): this;
        multiply(m: Mat4, n?: Mat4): this;
        premultiply(m: Mat4): this;
        multiplyMats(a: Mat4, b: Mat4): this;
        multiplyScalar(s: number): this;
        applyToBufferAttribute(attribute: {
            count: any;
            getX: (arg0: number) => number;
            getY: (arg0: number) => number;
            getZ: (arg0: number) => number;
            setXYZ: (arg0: number, arg1: number, arg2: number, arg3: number) => void;
        }): {
            count: any;
            getX: (arg0: number) => number;
            getY: (arg0: number) => number;
            getZ: (arg0: number) => number;
            setXYZ: (arg0: number, arg1: number, arg2: number, arg3: number) => void;
        };
        determinant(): number;
        transpose(): this;
        setPosition(x: number | Vec3 | any, y?: number, z?: number): this;
        /**
         * 矩阵求逆
         * @returns  自己
         */
        invert(): Mat4;
        getInverse(m: Mat4, throwOnDegenerate?: boolean): this;
        scale(v: {
            x: any;
            y: any;
            z: any;
        }): this;
        getMaxScaleOnAxis(): number;
        makeTranslation(x: number, y: number, z: number): this;
        makeRotationX(theta: number): this;
        makeRotationY(theta: number): this;
        makeRotationZ(theta: number): this;
        makeRotationAxis(axis: {
            x: any;
            y: any;
            z: any;
        }, angle: number): this;
        makeScale(x: number, y: number, z: number): this;
        /**
         *  6个参数 都是由两个值来影响  [v1][v2]  v1表示v2轴在v1轴产生效果
         * @param xy
         * @param xz
         * @param yx
         * @param yz
         * @param zx
         * @param zy
         * @returns
         */
        makeShear(xy: number, xz: number, yx: number, yz: number, zx: number, zy: number): this;
        compose(position: Vec3, quat: Quat, scale: Euler | Vec3): this;
        decompose(position: Vec3, quat: Quat, scale: Vec3): this;
        makePerspective(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
        makeOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number): this;
        equals(matrix: {
            elements: any;
        }): boolean;
        fromArray(array: number[], offset?: number): this;
        toArray(array?: number[], offset?: number): number[];
    }
    declare function m4(): Mat4;

    declare class Mat3 {
        elements: number[];
        isMat3: boolean;
        constructor();
        set(n11: number, n12: number, n13: number, n21: number, n22: number, n23: number, n31: number, n32: number, n33: number): this;
        identity(): this;
        clone(): Mat3;
        copy(m: Mat3): this;
        setFromMat4(m: Mat4): this;
        applyToBufferAttribute(attribute: any): any;
        multiply(m: Mat3): this;
        premultiply(m: Mat3): this;
        multiplyMatrices(a: Mat3, b: Mat3): this;
        multiplyScalar(s: number): this;
        determinant(): number;
        getInverse(matrix: Mat3 | Mat4 | any, throwOnDegenerate?: boolean): this;
        transpose(): this;
        getNormalMat(mat4: Mat4): this;
        transposeIntoArray(r: number[]): this;
        setUvTransform(tx: any, ty: any, sx: number, sy: number, rotation: number, cx: number, cy: number): void;
        scale(sx: number, sy: number): this;
        rotate(theta: number): this;
        translate(tx: number, ty: number): this;
        equals(matrix: Mat3): boolean;
        fromArray(array: number[], offset?: number): this;
        toArray(array?: number[], offset?: number): number[];
    }
    declare function m3(): Mat3;

    declare class Vec2 {
        private _x;
        private _y;
        isVec2: boolean;
        constructor(_x?: number, _y?: number);
        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        static isVec2(v: any): boolean;
        get width(): number;
        set width(value: number);
        get height(): number;
        set height(value: number);
        static get UnitX(): Vec2;
        static get UnitY(): Vec2;
        set(x: number, y: number): this;
        setScalar(scalar: number): this;
        setX(x: number): this;
        setY(y: number): this;
        setComponent(index: number, value: number): this;
        getComponent(index: number): number;
        clone(): Vec2;
        copy(v: Vec2): Vec2;
        add(v: Vec2, w?: Vec2): this;
        addScalar(s: number): this;
        addVecs(a: Vec2, b: Vec2): this;
        addScaledVec(v: Vec2, s: number): this;
        sub(v: Vec2, w: Vec2): this;
        subScalar(s: number): this;
        subVecs(a: Vec2, b: Vec2): this;
        multiply(v: Vec2): this;
        multiplyScalar(scalar: number): this;
        divide(v: Vec2): this;
        divideScalar(scalar: number): this;
        applyMat3(m: Mat3): this;
        min(v: Vec2): this;
        max(v: Vec2): this;
        clamp(min: Vec2, max: Vec2): this;
        clampScalar(minVal: number, maxVal: number): this;
        clampLength(min: number, max: number): this;
        floor(): this;
        ceil(): this;
        round(): this;
        roundToZero(): this;
        negate(): this;
        dot(v: Vec2): number;
        cross(v: Vec2): number;
        lengthSq(): number;
        length(): number;
        manhattanLength(): number;
        normalize(): this;
        angle(): number;
        distanceTo(v: Vec2): number;
        distanceToSquared(v: Vec2): number;
        manhattanDistanceTo(v: Vec2): number;
        setLength(length: number): this;
        lerp(v: Vec2, alpha: number): this;
        lerpVecs(v1: Vec2, v2: Vec2, alpha: number): this;
        equals(v: Vec2): boolean;
        fromArray(array: TypedArrayLike, offset?: number): this;
        toArray(array?: TypedArrayLike, offset?: number): TypedArrayLike;
        fromBufferAttribute(attribute: any, index: number, offset: any): this;
        rotateAround(center: Vec2, angle: number): this;
    }
    declare function v2(): Vec2;

    declare const delta4 = 0.0001;
    declare const delta5 = 0.00001;
    declare const delta6 = 0.000001;
    declare const delta7 = 1e-7;
    declare const delta8 = 1e-8;
    declare const delta9 = 1e-9;
    /**
     * pi
     *
     * @type {Number}
     * @constant
     */
    declare const PI: number;
    /**
     * 1/pi
     *
     * @type {Number}
     * @constant
     */
    declare const ONE_OVER_PI: number;
    /**
     * pi/2
     *
     * @type {Number}
     * @constant
     */
    declare const PI_OVER_TWO: number;
    /**
     * pi/3
     *
     * @type {Number}
     * @constant
     */
    declare const PI_OVER_THREE: number;
    /**
     * pi/4
     *
     * @type {Number}
     * @constant
     */
    declare const PI_OVER_FOUR: number;
    /**
     * pi/6
     *
     * @type {Number}
     * @constant
     */
    declare const PI_OVER_SIX: number;
    /**
     * 3pi/2
     *
     * @type {Number}
     * @constant
     */
    declare const THREE_PI_OVER_TWO: number;
    /**
     * 2pi
     *
     * @type {Number}
     * @constant
     */
    declare const PI_TWO: number;
    /**
     * 1/2pi
     *
     * @type {Number}
     * @constant
     */
    declare const ONE_OVER_TWO_PI: number;
    /**
     * The number of radians in a degree.
     *
     * @type {Number}
     * @constant
     */
    declare const RADIANS_PER_DEGREE: number;
    /**
     * The number of degrees in a radian.
     *
     * @type {Number}
     * @constant
     */
    declare const DEGREES_PER_RADIAN: number;
    /**
     * The number of radians in an arc second.
     *
     * @type {Number}
     * @constant
     */
    declare const RADIANS_PER_ARCSECOND: number;
    declare function sign(value: number): 1 | -1;
    declare function approximateEqual(v1: number, v2: number, precision?: number): boolean;
    declare function clamp(value: number, min: number, max: number): number;
    declare function lerp(x: number, y: number, t: number): number;
    declare function smoothstep(x: number, min: number, max: number): number;
    declare function smootherstep(x: number, min: number, max: number): number;
    declare function randInt(low: number, high: number): number;
    /**
     * 生成一个low~high之间的浮点数
     * @param {*} low
     * @param {*} high
     */
    declare function randFloat(low: number, high: number): number;
    declare function isPowerOfTwo(value: number): boolean;
    declare function ceilPowerOfTwo(value: number): number;
    declare function floorPowerOfTwo(value: number): number;
    declare function toRadians(degrees: number): number;
    declare function ToDegrees(radians: number): number;
    /**
     * 数字或者向量固定位数
     * @param {Object} obj 数字或者向量
     * @param {*} fractionDigits
     */
    declare function toFixed(obj: {
        toFixed: (arg0: any) => string;
        x: number | undefined;
        y: number | undefined;
        z: number | undefined;
    }, fractionDigits: number | undefined): number | {
        toFixed: (arg0: any) => string;
        x: number | undefined;
        y: number | undefined;
        z: number | undefined;
    };
    /**
     * 数组中所有数字或者向量固定位数
     * @param {Array} array
     * @param {Number} precision
     */
    declare function toFixedAry(array: Array<any>, precision?: number): void;

    declare class Color {
        _r: number;
        _g: number;
        _b: number;
        _a: number;
        constructor(r?: number, g?: number, b?: number, a?: number);
        get isColor(): boolean;
        get r(): number;
        set r(value: number);
        get g(): number;
        set g(value: number);
        get b(): number;
        set b(value: number);
        get a(): number;
        set a(value: number);
        set(value: any): this;
        setHex(hex: number): this;
        setHexCssString(style: string): this | undefined;
        setRGB(r: number, g: number, b: number, a?: number): this;
        clone(): any;
        copy(color: this): this;
        equals(c: this): boolean;
        toArray(array?: number[], offset?: number): number[];
        fromArray(array?: number[], offset?: number): number[];
        private byteToFloat;
        private floatToByte;
        getHexCssString(): string;
        toJSON(): string;
        static get White(): Readonly<Color>;
        static get Red(): Color;
        static get Green(): Color;
        static get Blue(): Color;
    }

    /**
     * 当向量以数组的方式出现，一个计算单元库
     * @Description  : 向量数组
     * @Author       : 赵耀圣
     * @QQ           : 549184003
     * @Date         : 2021-08-02 15:09:33
     * @LastEditTime : 2021-08-02 15:50:16
     * @FilePath     : \cga.js\src\math\VecArray.ts
     */

    /**
     * 矢量几何操作，数字数组/矢量数组，常用工具集合
     */
    declare class vecs {
        /**
         * 去除相邻的重复向量
         * @param vs 矢量集合
         * @param delta 误差
         * @returns
         */
        static uniqueNeighborVecs(vs: Array<Vec3>, delta?: number): Vec3[];
        /**
         * 找到最大值
         * @param array
         * @returns
         */
        static max(array: ArrayLike<number>): number;
        /**
        * 找到最小值
        * @param array
        * @returns
        */
        static min(array: ArrayLike<number>): number;
        /**
         * 去除相邻没有重复点
         */
        static uniqueNeighbor(vs: number[], component?: number, delta?: number): number[];
        /**
         * 去除任意重复点
         * @param vs 向量数组
         * @param component 向量组件数量
         * @returns 无重复向量数组
         */
        static unique(vs: number[], component?: number): number[];
        /**
         *  翻转向量数组
         * @param vecs 向量数组
         * @param component  组件数量
         * @returns
         */
        static reverse(vecs: number[], component?: number): number[];
        /**
         * 点积
         * @param vecs
         * @returns
         */
        static dot(...vecs: number[]): number;
        /**
         * 长度平方
         * @param vecs
         * @returns
         */
        static distanceSq(...vecs: number[]): number;
        /**
         * 长度
         * @param vecs
         * @returns
         */
        static distance(...vecs: number[]): number;
        /**
         * 相加
         * @param vecs
         * @returns
         */
        static add(...vecs: number[]): number[] | (number & any[]);
        /**
         * 相减
         * @param vecs
         * @returns
         */
        static sub(...vecs: number[]): number[];
        /**
         * 相乘
         * @param vecs
         * @returns
         */
        static mul(...vecs: number[]): number[] | (number & any[]);
        /**
         * 获取矢量数组的i个矢量
         * @param vecs
         * @param i
         * @param component
         * @returns
         */
        static getVecAt(vecs: number[], i: number, component?: number): number[];
        /**
         * 在第 i 个位置插入一个向量
         * @param vecs
         * @param i
         * @param vec
         */
        static insertAt(vecs: number[], i: number, ...vec: number[]): void;
        /**
         * 是否逆时针
         * counterclockwise
         */
        static isCCW<T>(shape: Array<T> | ArrayList<T>, component?: number): boolean;
        /**
         * 将向量深度拆解为数字
         * @param {Array} Array<Vec4 | Vec3 | Vec2 | any> | any
         * @param {String} comSort  'x','y','z','w' 按顺序选取后自由组合
         * @returns {Array<Number>} 数字数组
         */
        static verctorToNumbers(vectors: Array<Vec4 | Vec3 | Vec2 | any> | any, comSort?: string): number[];
        static vec(component?: number): Vec3 | Vec4 | Vec2;
        /**
         * 数字数组 转 适量数组
         * @param vss  数字数组
         * @param component 矢量维度，默认为3
         * @returns
         */
        static numbersToVecs(vss: TypedArrayLike, component?: number): Vec2[] | Vec3[] | Vec4[];
        static applyQuat(vss: TypedArrayLike, quat: Quat, component?: number): void;
        static applyMat4(vss: TypedArrayLike, mat: Mat4, component?: number): void;
        static translate(vss: TypedArrayLike, distance: number[], component?: number): void;
        static rotate(vss: TypedArrayLike, axis: Vec3, angle: number): void;
        static scale(vss: TypedArrayLike, _scale: number[], component?: number): void;
    }

    /**
     * 数组深度复制
     * @param {Array} array
     */
    declare function clone(array: any | any[]): any;
    /**
     * 点排序函数 xyz 有序排序回调
     * @param {Vector*} a
     * @param {Vector*} b
     */
    declare function vectorCompare(a: any | Vec3, b: any | Vec3): number;
    /**
     * 计算包围盒
     * @param {*} points  点集
     * @returns {Array[min,max]} 返回最小最大值
     */
    declare function boundingBox(points: Vec3[]): Vec3[];
    /**
     *
     * @param {*} points
     * @param {*} quat
     * @param {Boolean} ref 是否是引用
     */
    declare function applyQuat(points: any | Vec3[], quat: Quat, ref?: boolean): Vec3 | any;
    /**
     * 平移
     * @param {*} points
     * @param {*} distance
     * @param {*} ref
     */
    declare function translate(points: any | Vec3[], distance: Vec3, ref?: boolean): Vec3[] | any;
    /**
     * 旋转
     * @param {*} points
     * @param {*} axis
     * @param {*} angle
     * @param {*} ref
     */
    declare function rotate(points: any | Vec3[], axis: Vec3, angle: number, ref?: boolean): any;
    /**
     * 两个向量之间存在的旋转量来旋转点集
     * @param {*} points
     * @param {*} axis
     * @param {*} angle
     * @param {*} ref
     */
    declare function rotateByUnitVectors(points: any | Vec3[], vFrom: Vec3, vTo: Vec3, ref?: boolean): any;
    /**
     * 缩放
     * @param {*} points
     * @param {*} axis
     * @param {*} angle
     * @param {*} ref
     */
    declare function scale(points: any | Vec3[], _scale: Vec3, ref?: boolean): Vec3[] | any;
    /**
     * 响应矩阵
     * @param {*} points
     * @param {*} axis
     * @param {*} angle
     * @param {*} ref
     */
    declare function applyMatrix4(points: any | Vec3[], matrix: Mat4, ref?: boolean): Vec3[] | any;
    /**
     * 简化点集数组，折线，路径
     * @param {*} points 点集数组，折线，路径 ,继承Array
     * @param {*} maxDistance  简化最大距离
     * @param {*} maxAngle  简化最大角度
     */
    declare function simplifyPointList(points: any | Vec3[], maxDistance?: number, maxAngle?: number): any;
    /**
     * 以某个平面生成对称镜像
     * @param {*} points  点集
     * @param {*} plane 对称镜像平面
     */
    declare function reverseOnPlane(points: any | Vec3[], plane: Plane): void;
    /**
     * 投影到平面
     * @param {*} points 点集
     * @param {*} plane  投影平面
     * @param {*} projectDirect  默认是法线的方向
     */
    declare function projectOnPlane(points: any | Vec3[], plane: Plane, projectDirect: Vec3): any;
    /**
     * 计算共面点集所在的平面
     * @param {Array<Vec3|Point>} points
     */
    declare function recognitionPlane(points: Vec3[] | any): Plane;
    /**
     * 判断所有点是否在同一个平面
     * @param {Array<Vec3|Point>} points
     * @param {*} precision
     * @returns {Boolean|Plane} 如果在同一个平面返回所在平面，否则返回false
     */
    declare function isInOnePlane(points: Vec3[] | any, precision?: number): false | Plane;
    /**
     * 判断多边是否共线:
     * 考虑情况点之间的距离应该大于最小容忍值
     * @param  {...Vec3[]} ps
     */
    declare function pointsCollinear(...ps: Vec3[]): boolean;
    /**
     * 三点计算圆
     * @param p0
     * @param p1
     * @param p2
     */
    declare function calcCircleFromThreePoint(p0: Vec3, p1: Vec3, p2: Vec3): Circle;
    declare function angle(v0: Vec3, v1: Vec3, normal?: Vec3): number;

    declare class Delaunator {
        coords: Float64Array;
        _triangles: Uint32Array;
        _halfedges: Int32Array;
        _hashSize: number;
        _hullPrev: Uint32Array;
        _hullNext: Uint32Array;
        _hullTri: Uint32Array;
        _hullHash: Int32Array;
        _ids: Uint32Array;
        _dists: Float64Array;
        hull: Uint32Array;
        triangles: Uint32Array;
        halfedges: any;
        _cx: any;
        _cy: any;
        _hullStart: number;
        trianglesLen: number;
        static from(points: number[]): Delaunator;
        static fromVecs(points: Vec2[] | Vec3[]): Delaunator;
        constructor(coords: Float64Array);
        update(): void;
        _hashKey(x: number, y: number): number;
        _legalize(a: number): number;
        _link(a: number, b: number): void;
        _addTriangle(i0: number, i1: number, i2: number, a: number, b: number, c: number): number;
    }

    declare class Voronoi {
        delaunay: any;
        _circumcenters: Float64Array;
        vectors: Float64Array;
        xmax: number;
        xmin: number;
        ymax: number;
        ymin: number;
        circumcenters: any;
        constructor(delaunay: Delaunay, [xmin, ymin, xmax, ymax]?: [number, number, number, number]);
        update(): this;
        _init(): void;
        cellPolygons(): Generator<any, void, unknown>;
        cellPolygon(i: number): any[] | null;
        _renderSegment(x0: any, y0: any, x1: any, y1: any, context: {
            moveTo: (arg0: any, arg1: any) => void;
            lineTo: (arg0: any, arg1: any) => void;
        }): void;
        contains(i: any, x: number | any, y: number | any): boolean;
        neighbors(i: any): Generator<any, void, unknown>;
        _cell(i: string | number): any[] | null;
        _clip(i: number): any;
        _clipFinite(i: any, points: string | any[]): any;
        _clipSegment(x0: number, y0: number, x1: number, y1: number, c0: number, c1: number): number[] | null;
        _clipInfinite(i: any, points: any, vx0: number, vy0: number, vxn: number, vyn: number): unknown[];
        _edge(i: any, e0: number, e1: number, P: any[], j: number): number;
        _project(x0: any, y0: any, vx: number, vy: number): any[] | null;
        _edgecode(x: unknown, y: unknown): number;
        _regioncode(x: number, y: number): number;
    }

    declare class Delaunay {
        _delaunator: Delaunator;
        inedges: Int32Array;
        _hullIndex: Int32Array;
        points: Float64Array;
        collinear?: Int32Array;
        halfedges: any;
        hull: Uint32Array;
        triangles: Uint32Array;
        static from(points: number[]): Delaunay;
        constructor(points: Float64Array);
        update(): this;
        _init(): void;
        voronoi(bounds: [number, number, number, number] | undefined): Voronoi;
        neighbors(i: number): Generator<number, void, unknown>;
        find(x: number, y: number, i?: number): number;
        _step(i: number, x: number, y: number): number;
    }

    /**
     * 网格工具
     */
    declare class MeshTool {
        static indexable(obj: any[] | any, refIndexInfo?: {
            index: number;
        }, force?: boolean): void;
        static triangListToBuffer(vertices: Vec3[], triangleList: Vec3[]): BufferGeometry;
        /**
         * 顶点纹理坐标所以转化为buffer数据
         * @param {Array<Verctor3|Number>} vertices
         * @param {Array<Number>} indices
         * @param {Array<Verctor2|Number>} uvs
         */
        static toGeoBuffer(vertices: BufferAttribute | Array<number | Vec2 | Vec3 | Vec4> | TypedArray, indices: number[] | Uint32Array | Uint16Array, uvs?: BufferAttribute | TypedArray | Array<Vec2 | number>): BufferGeometry;
        /**
         * 三角剖分后转成几何体
         * 只考虑XY平面
         * @param {*} boundary
         * @param {*} hole
         * @param {*} options
         */
        static trianglutionToGeometryBuffer(boundary: any, holes?: any[], options?: any): BufferGeometry;
    }

    declare class Point extends Vec3 {
        constructor(_x?: number, _y?: number, _z?: number);
    }

    interface IDistanceResut {
        isNode: boolean;
        point: Vec3;
        direction: Vec3;
    }
    declare class Path<T extends Vec3> extends ArrayList<T> {
        _closed: boolean;
        _calcNoraml: boolean;
        /**
         *
         * @param vs  假定是没有重复的点集
         * @param closed
         * @param calcNormal
         */
        constructor(vs: Array<T> | ArrayList<T>, closed?: boolean, calcNormal?: boolean);
        init(calcNormal: boolean): void;
        set closed(val: boolean);
        get closed(): boolean;
        get tlen(): number;
        applyMat4(mat4: Mat4): void;
        scale(x: number, y: number, z: number): void;
        /**
         * 截取一段从from到to的path
         * @param {Number} from
         * @param {Number} to
         */
        splitByFromToDistance(from?: number, to?: number): Path<never> | null;
        /**
         * 从起点出发到距离等于distance位置  的坐标 二分查找
         * @param {Number} distance
         */
        getPointByDistance(arg_distance: number, left?: number, right?: number): IDistanceResut | null;
        /**
         * 从起点出发到距离等于distance位置  的坐标 二分查找
         * @param {Number} distance
         */
        getPointByDistancePure(arg_distance: number, left?: number, right?: number): Vec3 | null;
        /**
         * 平均切割为 splitCount 段
         * @param {Number} splitCount
         * @returns {Path} 新的path
         */
        splitAverage(splitCount: number): Path<T>;
        /**
         * 通过测试
        * 平均切割为 splitCount 段
        * @param {Number} splitCount
        * @param {Boolean} integer 是否取整
        * @returns {Path} 新的path
        */
        splitAverageLength(splitLength: number, integer?: boolean): Path<T>;
        /**
         *
         * @param  {...any} ps
         */
        add(...ps: Vec3[] | Point[]): void;
        /**
         * @description : 计算一段线段的总长度
         * @param        {ArrayLike} ps
         * @return       {number}   总长度
         */
        static totalMileages(ps: ArrayLike<Vec3>): number;
        /**
         * @description : 获取没一点的里程  里程是指从第一个点出发的长度
         * @param        {ArrayLike} ps 里程上的点集
         * @param        {boolean} normalize 是否归一化
         * @return       {number[]}  每一个点的里程数组
         * @example     :
         */
        static getPerMileages(ps: ArrayLike<Vec3>, normalize?: boolean, totalMileage?: number): number[];
    }

    /**
     * 视锥体
     */
    declare class Frustum {
        planes: Plane[];
        constructor();
        get front(): Plane;
        get back(): Plane;
        get top(): Plane;
        get bottom(): Plane;
        get left(): Plane;
        get right(): Plane;
        /**
         * 从投影矩阵计算视锥体
         * @param m
         * @returns
         */
        setFromProjectionMatrix(m: Mat4): this;
        static fromProjectionMatrix(m: Mat4): Frustum;
        setFromPerspective(position: Vec3, target: Vec3, up: Vec3, fov: number, aspect: number, near: number, far: number): void;
        intersectsObject(geometry: BufferGeometry, mat: Mat4): boolean;
        intersectsSphere(sphere: Sphere): boolean;
        intersectsSphereComponents(cx: number, cy: number, cz: number, radius: number): boolean;
        containsPoint(point: Vec3): boolean;
        intersectSegment(segment: Segment | Vec3[]): Vec3 | Vec3[] | Segment | null;
        simpleIntersectVS(vs: Vec3[]): Vec3[];
        copy(frustum: Frustum): void;
        clone(): any;
    }

    declare function toGeometryBuffer(geo: IGeometry): BufferGeometry;
    /**
     * shape 挤压后转几何体
     * @param {*} shape
     * @param {*} arg_path
     * @param {*} options
     */
    declare function extrudeToGeometryBuffer(shape: ArrayList<Vec3>, arg_path: Array<Vec3>, options: IExtrudeOptions): BufferGeometry;
    /**
     * 两个轮廓缝合
     * @param {*} shape
     * @param {*} arg_path
     * @param {*} options
     * @param {*} material
     */
    declare function linkToGeometry(shape: Array<Vec3>, shape1: Array<Vec3>, axisPlane?: AxisPlane, shapeClose?: boolean): BufferGeometry;
    /**
     * 多个轮廓缝合
     * @param shapes
     * @param isClose
     * @param material
     */
    declare function linksToGeometry(shapes: Array<Vec3>[], pathClosed?: boolean, shapeClosed?: boolean): BufferGeometry;

    export { Box, BufferAttribute, BufferGeometry, Capsule, Circle, Color, DEGREES_PER_RADIAN, Delaunator, Disk, DistanceResult, EndType, Euler, Float32BufferAttribute, Float64BufferAttribute, Frustum, IBufferGeometry, IDistanceResut, IExtrudeOptions, IExtrudeOptionsEx, IExtrudeOptionsNext, IGeometry, ILinkSideOption, ILinkSideOptions, IVec2, IVec3, IVec4, Int16BufferAttribute, Int32BufferAttribute, Int8BufferAttribute, IntersectResult, JoinType, Line, Mat3, Mat4, MeshTool, ONE_OVER_PI, ONE_OVER_TWO_PI, PI, PI_OVER_FOUR, PI_OVER_SIX, PI_OVER_THREE, PI_OVER_TWO, PI_TWO, Path, Plane, Point, Polygon, Polyline, Quat, RADIANS_PER_ARCSECOND, RADIANS_PER_DEGREE, Ray, Segment, Sphere, THREE_PI_OVER_TWO, ToDegrees, Triangle, Uint16BufferAttribute, Uint32BufferAttribute, Uint8BufferAttribute, Uint8ClampedBufferAttribute, Vec2, Vec3, Vec4, Voronoi, angle, applyMatrix4, applyQuat, approximateEqual, boundingBox, calcCircleFromThreePoint, ceilPowerOfTwo, circle, clamp, classify, clone, delta4, delta5, delta6, delta7, delta8, delta9, disk, euler, extrude, extrudeNext, extrudeToGeometryBuffer, extrude_obsolete, flat, floorPowerOfTwo, forall, isInOnePlane, isPowerOfTwo, lerp, line, linkSide, linkSides, linkToGeometry, linksToGeometry, m3, m4, pointsCollinear, projectOnPlane, quat, randFloat, randInt, recognitionPlane, reverseOnPlane, rotate, rotateByUnitVectors, scale, segment, sign, simplifyPointList, smootherstep, smoothstep, toFixed, toFixedAry, toGeometryBuffer, toRadians, translate, unique, v2, v3, v4, vecs, vectorCompare };
}