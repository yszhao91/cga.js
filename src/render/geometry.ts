import { Vec } from "../math/Vec";
import { Mat3 } from "../math/Mat3";
import { Mat4 } from "../math/Mat4";
import { v3, Vec3 } from "../math/Vec3";
import { Box } from "../struct/3d/Box";
import { Sphere } from "../struct/3d/Sphere";
import { BufferAttribute, Float32BufferAttribute, Uint16BufferAttribute, Uint32BufferAttribute } from "./buffer-attribute";
import { isBufferArray, TypedArray } from "./types";
import { Vec2 } from "../math/Vec2";
import { Vec4 } from "../math/Vec4";
import { verctorToNumbers } from "..";


export interface IGeometry {
    position: number[];
    normals?: number[];
    indices?: number[];
    uvs?: number[];
    uvs2?: number[];
    tangents?: number[];
}

export interface IBufferGeometry {
    position: Float32Array | undefined;
    indices?: Uint32Array | Uint16Array
    normals?: Float32Array;
    uvs?: Float32Array;
    uvs2?: Float32Array;
    tangents?: Float32Array;
}


var _bufferGeometryId = 1; // BufferGeometry uses odd numbers as Id

var _m1 = new Mat4();
var _offset = new Vec3();
var _box = new Box();
var _boxMorphTargets = new Box();
var _vector = new Vec3();

/**
 * BufferType 几何体，用于独立计算几何体
 */
export class BufferGeometry {
    name: string;
    index: BufferAttribute | undefined;
    morphAttributes: any;
    morphTargetsRelative: boolean;
    groups: { start: number; count: number; materialIndex?: number }[];
    boundingBox: Box | undefined;
    boundingSphere: Sphere | undefined;
    drawRange: { start: number; count: number; };
    attributes: { [key: string]: BufferAttribute };
    parameters: any;
    readonly isBufferGeometry: true = true;
    uuid: string = "";
    type: string = "BufferGeometry";
    constructor() {

        Object.defineProperty(this, 'id', { value: _bufferGeometryId += 2 });

        this.name = '';

        this.attributes = {};

        this.morphAttributes = {};
        this.morphTargetsRelative = false;

        this.groups = [];

        this.drawRange = { start: 0, count: Infinity };
    }



    getIndex() {

        return this.index;

    }

    setIndex(index: BufferAttribute | TypedArray | number[]) {
        if (Array.isArray(index)) {
            this.index = new (Vec.max(index as any) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute)(index, 1);
        } else if (index instanceof BufferAttribute) {
            this.index = index;
        } else {
            this.index = new (Vec.max(index as any) > 65535 ? Uint32BufferAttribute : Uint16BufferAttribute)(index, 1)
        }

    }

    getAttribute(name: string) {

        return this.attributes[name];

    }

    setAttribute(name: string, attribute: BufferAttribute) {

        this.attributes[name] = attribute;
        return this;

    }

    addAttribute(name: string, attribute: BufferAttribute | TypedArray | Array<number | Vec2 | Vec3 | Vec4>, itemSize: number = 1) {
        if (Array.isArray(attribute)) {
            if (attribute[0] instanceof Vec2) {
                var nums = verctorToNumbers(attribute);
                this.setAttribute(name, new Float32BufferAttribute(nums, 2))
            } else if (attribute[0] instanceof Vec3) {
                var nums = verctorToNumbers(attribute);
                this.setAttribute(name, new Float32BufferAttribute(nums, 3))
            } else if (attribute[0] instanceof Vec4) {
                var nums = verctorToNumbers(attribute);
                this.setAttribute(name, new Float32BufferAttribute(nums, 4))
            } else if (!isNaN(attribute[0])) {
                this.setAttribute(name, new Float32BufferAttribute(attribute, itemSize));
            } else {
                console.error("类型不存在");
            }
        }
        else if (attribute instanceof BufferAttribute) {
            this.attributes[name] = attribute;
        } else if (isBufferArray(attribute)) {
            this.setAttribute(name, new BufferAttribute(attribute as any, itemSize))
        }

        return this;
    }

    deleteAttribute(name: string) {

        delete this.attributes[name];
        return this;

    }

    addGroup(start: number, count: number, materialIndex?: number) {

        this.groups.push({

            start: start,
            count: count,
            materialIndex: materialIndex !== undefined ? materialIndex : 0

        });

    }

    clearGroups() {

        this.groups = [];

    }

    setDrawRange(start: number, count: number) {

        this.drawRange.start = start;
        this.drawRange.count = count;

    }

    applyMat4(matrix: Mat4) {

        var position = this.attributes.position;

        if (position !== undefined) {

            position.applyMat4(matrix);

            position.needsUpdate = true;

        }

        var normal = this.attributes.normal;

        if (normal !== undefined) {

            var normalMatrix = new Mat3().getNormalMatrix(matrix);

            normal.applyNormalMat(normalMatrix);

            normal.needsUpdate = true;

        }

        var tangent = this.attributes.tangent;

        if (tangent !== undefined) {

            tangent.transformDirection(matrix);

            tangent.needsUpdate = true;

        }

        if (!this.boundingBox) {

            this.computeBoundingBox();

        }

        if (!this.boundingSphere) {

            this.computeBoundingSphere();

        }

        return this;

    }

    rotateX(angle: number) {

        // rotate geometry around world x-axis

        _m1.makeRotationX(angle);

        this.applyMat4(_m1);

        return this;

    }

    rotateY(angle: number) {

        // rotate geometry around world y-axis

        _m1.makeRotationY(angle);

        this.applyMat4(_m1);

        return this;

    }

    rotateZ(angle: number) {

        // rotate geometry around world z-axis

        _m1.makeRotationZ(angle);

        this.applyMat4(_m1);

        return this;

    }

    translate(x: number, y: number, z: number) {

        // translate geometry

        _m1.makeTranslation(x, y, z);

        this.applyMat4(_m1);

        return this;

    }

    scale(x: number, y: number, z: number) {

        // scale geometry

        _m1.makeScale(x, y, z);

        this.applyMat4(_m1);

        return this;

    }

    lookAt(vector: Vec3) {

        _m1.lookAt(v3(), vector, Vec3.UnitY);

        this.applyMat4(_m1);

        return this;

    }

    center() {

        this.computeBoundingBox();

        this.boundingBox!.getCenter(_offset).negate();

        this.translate(_offset.x, _offset.y, _offset.z);

        return this;

    }

    setFromObject(object: any) {

        // console.log( 'THREE.BufferGeometry.setFromObject(). Converting', object, this );

        var geometry = object.geometry;

        if (object.isPoints || object.isLine) {

            var positions = new Float32BufferAttribute(geometry.vertices.length * 3, 3);
            var colors = new Float32BufferAttribute(geometry.colors.length * 3, 3);

            this.setAttribute('position', positions.copyVec3sArray(geometry.vertices));
            this.setAttribute('color', colors.copyColorsArray(geometry.colors));

            if (geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length) {

                var lineDistances = new Float32BufferAttribute(geometry.lineDistances.length, 1);

                this.setAttribute('lineDistance', lineDistances.copyArray(geometry.lineDistances));

            }

            if (geometry.boundingSphere !== null) {

                this.boundingSphere = geometry.boundingSphere.clone();

            }

            if (geometry.boundingBox !== null) {

                this.boundingBox = geometry.boundingBox.clone();

            }

        } else if (object.isMesh) {

            // if (geometry && geometry.isGeometry) {

            //     this.fromGeometry(geometry);

            // }

        }

        return this;

    }

    setFromPoints(points: Vec3[]) {

        var position = [];

        for (var i = 0, l = points.length; i < l; i++) {

            var point = points[i];
            position.push(point.x, point.y, point.z || 0);

        }

        this.setAttribute('position', new Float32BufferAttribute(position, 3));

        return this;

    }

    updateFromObject(object: any) {

        var geometry = object.geometry;

        if (object.isMesh) {

            var direct = geometry.__directGeometry;

            if (geometry.elementsNeedUpdate === true) {

                direct = undefined;
                geometry.elementsNeedUpdate = false;

            }

            // if (direct === undefined) {

            //     return this.fromGeometry(geometry);

            // }

            direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
            direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
            direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
            direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
            direct.groupsNeedUpdate = geometry.groupsNeedUpdate;

            geometry.verticesNeedUpdate = false;
            geometry.normalsNeedUpdate = false;
            geometry.colorsNeedUpdate = false;
            geometry.uvsNeedUpdate = false;
            geometry.groupsNeedUpdate = false;

            geometry = direct;

        }

        var attribute;

        if (geometry.verticesNeedUpdate === true) {

            attribute = this.attributes.position;

            if (attribute !== undefined) {

                attribute.copyVec3sArray(geometry.vertices);
                attribute.needsUpdate = true;

            }

            geometry.verticesNeedUpdate = false;

        }

        if (geometry.normalsNeedUpdate === true) {

            attribute = this.attributes.normal;

            if (attribute !== undefined) {

                attribute.copyVec3sArray(geometry.normals);
                attribute.needsUpdate = true;

            }

            geometry.normalsNeedUpdate = false;

        }

        if (geometry.colorsNeedUpdate === true) {

            attribute = this.attributes.color;

            if (attribute !== undefined) {

                attribute.copyColorsArray(geometry.colors);
                attribute.needsUpdate = true;

            }

            geometry.colorsNeedUpdate = false;

        }

        if (geometry.uvsNeedUpdate) {

            attribute = this.attributes.uv;

            if (attribute !== undefined) {

                attribute.copyVec2sArray(geometry.uvs);
                attribute.needsUpdate = true;

            }

            geometry.uvsNeedUpdate = false;

        }

        if (geometry.lineDistancesNeedUpdate) {

            attribute = this.attributes.lineDistance;

            if (attribute !== undefined) {

                attribute.copyArray(geometry.lineDistances);
                attribute.needsUpdate = true;

            }

            geometry.lineDistancesNeedUpdate = false;

        }

        if (geometry.groupsNeedUpdate) {

            geometry.computeGroups(object.geometry);
            this.groups = geometry.groups;

            geometry.groupsNeedUpdate = false;

        }

        return this;

    }

    // fromGeometry(geometry: any) {

    //     geometry.__directGeometry = new DirectGeometry().fromGeometry(geometry);

    //     return this.fromDirectGeometry(geometry.__directGeometry);

    // }

    // fromDirectGeometry(geometry) {

    //     var positions = new Float32Array(geometry.vertices.length * 3);
    //     this.setAttribute('position', new BufferAttribute(positions, 3).copyVec3sArray(geometry.vertices));

    //     if (geometry.normals.length > 0) {

    //         var normals = new Float32Array(geometry.normals.length * 3);
    //         this.setAttribute('normal', new BufferAttribute(normals, 3).copyVec3sArray(geometry.normals));

    //     }

    //     if (geometry.colors.length > 0) {

    //         var colors = new Float32Array(geometry.colors.length * 3);
    //         this.setAttribute('color', new BufferAttribute(colors, 3).copyColorsArray(geometry.colors));

    //     }

    //     if (geometry.uvs.length > 0) {

    //         var uvs = new Float32Array(geometry.uvs.length * 2);
    //         this.setAttribute('uv', new BufferAttribute(uvs, 2).copyVec2sArray(geometry.uvs));

    //     }

    //     if (geometry.uvs2.length > 0) {

    //         var uvs2 = new Float32Array(geometry.uvs2.length * 2);
    //         this.setAttribute('uv2', new BufferAttribute(uvs2, 2).copyVec2sArray(geometry.uvs2));

    //     }

    //     // groups

    //     this.groups = geometry.groups;

    //     // morphs

    //     for (var name in geometry.morphTargets) {

    //         var array = [];
    //         var morphTargets = geometry.morphTargets[name];

    //         for (var i = 0, l = morphTargets.length; i < l; i++) {

    //             var morphTarget = morphTargets[i];

    //             var attribute = new Float32BufferAttribute(morphTarget.data.length * 3, 3);
    //             attribute.name = morphTarget.name;

    //             array.push(attribute.copyVec3sArray(morphTarget.data));

    //         }

    //         this.morphAttributes[name] = array;

    //     }

    //     // skinning

    //     if (geometry.skinIndices.length > 0) {

    //         var skinIndices = new Float32BufferAttribute(geometry.skinIndices.length * 4, 4);
    //         this.setAttribute('skinIndex', skinIndices.copyVec4sArray(geometry.skinIndices));

    //     }

    //     if (geometry.skinWeights.length > 0) {

    //         var skinWeights = new Float32BufferAttribute(geometry.skinWeights.length * 4, 4);
    //         this.setAttribute('skinWeight', skinWeights.copyVec4sArray(geometry.skinWeights));

    //     }

    //     //

    //     if (geometry.boundingSphere !== null) {

    //         this.boundingSphere = geometry.boundingSphere.clone();

    //     }

    //     if (geometry.boundingBox !== null) {

    //         this.boundingBox = geometry.boundingBox.clone();

    //     }

    //     return this;

    // }

    computeBoundingBox() {

        if (!this.boundingBox) {
            this.boundingBox = new Box();
        }

        var position = this.attributes.position;
        var morphAttributesPosition = this.morphAttributes.position;

        if (position) {

            this.boundingBox!.setFromBufferAttribute(position);

            // process morph attributes if present

            if (morphAttributesPosition) {

                for (var i = 0, il = morphAttributesPosition.length; i < il; i++) {

                    var morphAttribute = morphAttributesPosition[i];
                    _box.setFromBufferAttribute(morphAttribute);

                    if (this.morphTargetsRelative) {

                        _vector.addVecs(this.boundingBox.min, _box.min);
                        this.boundingBox.expandByPoint(_vector);

                        _vector.addVecs(this.boundingBox.max, _box.max);
                        this.boundingBox.expandByPoint(_vector);

                    } else {

                        this.boundingBox.expandByPoint(_box.min);
                        this.boundingBox.expandByPoint(_box.max);

                    }

                }

            }

        } else {

            this.boundingBox.makeEmpty();

        }

        if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {

            console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);

        }

    }

    computeBoundingSphere() {

        if (!this.boundingSphere) {

            this.boundingSphere = new Sphere();

        }

        var position = this.attributes.position;
        var morphAttributesPosition = this.morphAttributes.position;

        if (position) {

            // first, find the center of the bounding sphere

            var center = this.boundingSphere!.center;

            _box.setFromBufferAttribute(position);

            // process morph attributes if present

            if (morphAttributesPosition) {

                for (var i = 0, il: number = morphAttributesPosition.length; i < il; i++) {

                    var morphAttribute = morphAttributesPosition[i];
                    _boxMorphTargets.setFromBufferAttribute(morphAttribute);

                    if (this.morphTargetsRelative) {

                        _vector.addVecs(_box.min, _boxMorphTargets.min);
                        _box.expandByPoint(_vector);

                        _vector.addVecs(_box.max, _boxMorphTargets.max);
                        _box.expandByPoint(_vector);

                    } else {

                        _box.expandByPoint(_boxMorphTargets.min);
                        _box.expandByPoint(_boxMorphTargets.max);

                    }

                }

            }

            _box.getCenter(center);

            // second, try to find a boundingSphere with a radius smaller than the
            // boundingSphere of the boundingBox: sqrt(3) smaller in the best case

            var maxRadiusSq = 0;

            for (var i = 0, il: number = position.count; i < il; i++) {

                _vector.fromBufferAttribute(position, i);

                maxRadiusSq = Math.max(maxRadiusSq, center!.distanceToSquared(_vector));

            }

            // process morph attributes if present

            if (morphAttributesPosition) {

                for (var i = 0, il: number = morphAttributesPosition.length; i < il; i++) {

                    var morphAttribute = morphAttributesPosition[i];
                    var morphTargetsRelative = this.morphTargetsRelative;

                    for (var j = 0, jl = morphAttribute.count; j < jl; j++) {

                        _vector.fromBufferAttribute(morphAttribute, j);

                        if (morphTargetsRelative) {

                            _offset.fromBufferAttribute(position, j);
                            _vector.add(_offset);

                        }

                        maxRadiusSq = Math.max(maxRadiusSq, center!.distanceToSquared(_vector));

                    }

                }

            }

            this.boundingSphere!.radius = Math.sqrt(maxRadiusSq);

            if (isNaN(this.boundingSphere!.radius)) {

                console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);

            }

        }

    }

    computeFaceNormals() {

        // backwards compatibility

    }

    computeVertexNormals() {

        var index = this.index;
        var attributes = this.attributes;

        if (attributes.position) {

            var positions = attributes.position.array;

            if (attributes.normal === undefined) {

                this.setAttribute('normal', new BufferAttribute(new Float32Array(positions.length), 3));

            } else {

                // reset existing normals to zero

                var array = attributes.normal.array;

                for (var i = 0, il = array.length; i < il; i++) {

                    array[i] = 0;

                }

            }

            var normals = attributes.normal.array;

            var vA, vB, vC;
            var pA = new Vec3(), pB = new Vec3(), pC = new Vec3();
            var cb = new Vec3(), ab = new Vec3();

            // indexed elements

            if (index) {

                var indices = index.array;

                for (var i = 0, il = index.count; i < il; i += 3) {

                    vA = indices[i + 0] * 3;
                    vB = indices[i + 1] * 3;
                    vC = indices[i + 2] * 3;

                    pA.fromArray(positions, vA);
                    pB.fromArray(positions, vB);
                    pC.fromArray(positions, vC);

                    cb.subVecs(pC, pB);
                    ab.subVecs(pA, pB);
                    cb.cross(ab);

                    normals[vA] += cb.x;
                    normals[vA + 1] += cb.y;
                    normals[vA + 2] += cb.z;

                    normals[vB] += cb.x;
                    normals[vB + 1] += cb.y;
                    normals[vB + 2] += cb.z;

                    normals[vC] += cb.x;
                    normals[vC + 1] += cb.y;
                    normals[vC + 2] += cb.z;

                }

            } else {

                // non-indexed elements (unconnected triangle soup)

                for (var i = 0, il = positions.length; i < il; i += 9) {

                    pA.fromArray(positions, i);
                    pB.fromArray(positions, i + 3);
                    pC.fromArray(positions, i + 6);

                    cb.subVecs(pC, pB);
                    ab.subVecs(pA, pB);
                    cb.cross(ab);

                    normals[i] = cb.x;
                    normals[i + 1] = cb.y;
                    normals[i + 2] = cb.z;

                    normals[i + 3] = cb.x;
                    normals[i + 4] = cb.y;
                    normals[i + 5] = cb.z;

                    normals[i + 6] = cb.x;
                    normals[i + 7] = cb.y;
                    normals[i + 8] = cb.z;

                }

            }

            this.normalizeNormals();

            attributes.normal.needsUpdate = true;

        }

    }

    merge(geometry: BufferGeometry, offset: number) {

        if (!(geometry && geometry.isBufferGeometry)) {

            console.error('THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry);
            return;

        }

        if (offset === undefined) {

            offset = 0;

            console.warn(
                'THREE.BufferGeometry.merge(): Overwriting original geometry, starting at offset=0. '
                + 'Use BufferGeometryUtils.mergeBufferGeometries() for lossless merge.'
            );

        }

        var attributes = this.attributes;

        for (var key in attributes) {

            if (geometry.attributes[key] === undefined) continue;

            var attribute1 = attributes[key];
            var attributeArray1 = attribute1.array;

            var attribute2 = geometry.attributes[key];
            var attributeArray2 = attribute2.array;

            var attributeOffset = attribute2.itemSize * offset;
            var length = Math.min(attributeArray2.length, attributeArray1.length - attributeOffset);

            for (var i = 0, j = attributeOffset; i < length; i++, j++) {

                attributeArray1[j] = attributeArray2[i];

            }

        }

        return this;

    }

    normalizeNormals() {

        var normals = this.attributes.normal;

        for (var i = 0, il = normals.count; i < il; i++) {

            _vector.x = normals.getX(i);
            _vector.y = normals.getY(i);
            _vector.z = normals.getZ(i);

            _vector.normalize();

            normals.setXYZ(i, _vector.x, _vector.y, _vector.z);

        }

    }

    toNonIndexed() {

        function convertBufferAttribute(attribute: BufferAttribute, indices: ArrayLike<number>) {

            var array = attribute.array;
            var itemSize = attribute.itemSize;

            var array2 = new (array as any).constructor(indices.length * itemSize);

            var index = 0, index2 = 0;

            for (var i = 0, l = indices.length; i < l; i++) {

                index = indices[i] * itemSize;

                for (var j = 0; j < itemSize; j++) {

                    array2[index2++] = array[index++];

                }

            }

            return new BufferAttribute(array2, itemSize);

        }

        //

        if (this.index === undefined) {

            console.warn('THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.');
            return this;

        }

        var geometry2 = new BufferGeometry();

        var indices = this.index!.array;
        var attributes = this.attributes;

        // attributes

        for (var name in attributes) {

            var attribute = attributes[name];

            var newAttribute = convertBufferAttribute(attribute, indices);

            geometry2.setAttribute(name, newAttribute);

        }

        // morph attributes

        var morphAttributes = this.morphAttributes;

        for (name in morphAttributes) {

            var morphArray = [];
            var morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

            for (var i = 0, il = morphAttribute.length; i < il; i++) {

                var attribute: BufferAttribute = morphAttribute[i];

                var newAttribute = convertBufferAttribute(attribute, indices);

                morphArray.push(newAttribute);

            }

            geometry2.morphAttributes[name] = morphArray;

        }

        geometry2.morphTargetsRelative = this.morphTargetsRelative;

        // groups

        var groups = this.groups;

        for (var i = 0, l = groups.length; i < l; i++) {

            var group = groups[i];
            geometry2.addGroup(group.start, group.count, group.materialIndex);

        }

        return geometry2;

    }

    toJSON() {

        var data: any = {
            metadata: {
                version: 4.5,
                type: 'BufferGeometry',
                generator: 'BufferGeometry.toJSON'
            }
        };

        // standard BufferGeometry serialization

        data.uuid = this.uuid;
        data.type = this.type;
        if (this.name !== '') data.name = this.name;
        if (Object.keys(this.userData).length > 0) data.userData = this.userData;

        if (this.parameters !== undefined) {

            var parameters = this.parameters;

            for (var key in parameters) {

                if (parameters[key] !== undefined) data[key] = parameters[key];

            }

            return data;

        }

        data.data = { attributes: {} };

        var index = this.index;

        if (index) {

            data.data.index = {
                type: index.array.constructor.name,
                array: Array.prototype.slice.call(index.array)
            };

        }

        var attributes = this.attributes;

        for (var key in attributes) {

            var attribute = attributes[key];

            var attributeData: any = attribute.toJSON();

            if (attribute.name !== '') attributeData.name = attribute.name;

            data.data.attributes[key] = attributeData;

        }

        var morphAttributes: any = {};
        var hasMorphAttributes = false;

        for (var key in this.morphAttributes) {

            var attributeArray = this.morphAttributes[key];

            var array = [];

            for (var i = 0, il = attributeArray.length; i < il; i++) {

                var attribute: BufferAttribute = attributeArray[i];

                var attributeData: any = attribute.toJSON();

                if (attribute.name !== '') attributeData.name = attribute.name;

                array.push(attributeData);

            }

            if (array.length > 0) {

                morphAttributes[key] = array;

                hasMorphAttributes = true;

            }

        }

        if (hasMorphAttributes) {

            data.data.morphAttributes = morphAttributes;
            data.data.morphTargetsRelative = this.morphTargetsRelative;

        }

        var groups = this.groups;

        if (groups.length > 0) {

            data.data.groups = JSON.parse(JSON.stringify(groups));

        }

        var boundingSphere = this.boundingSphere;

        if (boundingSphere) {

            data.data.boundingSphere = {
                center: boundingSphere.center.toArray(),
                radius: boundingSphere.radius
            };

        }

        return data;

    }
    userData(userData: any) {
        throw new Error("Method not implemented.");
    }

    clone() {

        /*
         // Handle primitives
     
         var parameters = this.parameters;
     
         if ( parameters !== undefined ) {
     
         var values = [];
     
         for ( var key in parameters ) {
     
         values.push( parameters[ key ] );
     
         }
     
         var geometry = Object.create( this.constructor.prototype );
         this.constructor.apply( geometry, values );
         return geometry;
     
         }
     
         return new this.constructor().copy( this );
         */

        return new BufferGeometry().copy(this);

    }

    copy(source: BufferGeometry) {

        var name, i, l;

        // reset

        this.attributes = {};
        this.morphAttributes = {};
        this.groups = [];

        // name

        this.name = source.name;

        // index

        var index = source.index;

        if (index) {

            this.setIndex(index.clone());

        }

        // attributes

        var attributes = source.attributes;

        for (name in attributes) {

            var attribute = attributes[name];
            this.setAttribute(name, attribute.clone());

        }

        // morph attributes

        var morphAttributes = source.morphAttributes;

        for (name in morphAttributes) {

            var array = [];
            var morphAttribute = morphAttributes[name]; // morphAttribute: array of Float32BufferAttributes

            for (i = 0, l = morphAttribute.length; i < l; i++) {

                array.push(morphAttribute[i].clone());

            }

            this.morphAttributes[name] = array;

        }

        this.morphTargetsRelative = source.morphTargetsRelative;

        // groups

        var groups = source.groups;

        for (i = 0, l = groups.length; i < l; i++) {

            var group = groups[i];
            this.addGroup(group.start, group.count, group.materialIndex);

        }

        // bounding box

        var boundingBox = source.boundingBox;

        if (boundingBox) {

            this.boundingBox = boundingBox.clone();

        }

        // bounding sphere

        var boundingSphere = source.boundingSphere;

        if (boundingSphere) {

            this.boundingSphere = boundingSphere.clone();

        }

        // draw range

        this.drawRange.start = source.drawRange.start;
        this.drawRange.count = source.drawRange.count;

        // user data

        this.userData = source.userData;

        return this;

    }

}
