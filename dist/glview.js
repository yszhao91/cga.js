"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GLView = void 0;
var three_1 = require("three");
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
var TransformControls_1 = require("three/examples/jsm/controls/TransformControls");
var EffectComposer_1 = require("three/examples/jsm/postprocessing/EffectComposer");
var RenderPass_1 = require("three/examples/jsm/postprocessing/RenderPass");
var UnrealBloomPass_1 = require("three/examples/jsm/postprocessing/UnrealBloomPass");
var OrbitControls_1 = require("three/examples/jsm/controls/OrbitControls");
var raycaster = new three_1.Raycaster();
var mouse = new three_1.Vector2();
var selectMaterial = new three_1.MeshPhongMaterial({ color: 0xaa3366 });
var PMREM = {
    Scene: 0,
    Equirectangular: 1,
    CubeMap: 2
};
var GLView = /** @class */ (function () {
    function GLView(settings) {
        if (settings === void 0) { settings = {}; }
        this.allowSelected = true;
        this.renderer = new three_1.WebGLRenderer({
            antialias: true
        });
        this.container = settings.container;
        if (this.container)
            this.container.appendChild(this.renderer.domElement);
        this._scene = settings.scene || new three_1.Scene();
        this._scene.name = "默认场景";
        this._modelScene = new three_1.Object3D();
        this._modelScene.name = "模型场景";
        this._scene.add(this._modelScene);
        this._helperScene = new three_1.Object3D();
        this._helperScene.add(new three_1.AxesHelper(1000000));
        this._scene.add(this._helperScene);
        this.clearColor = settings.clearColor;
        this.selectedObject = new three_1.Object3D();
        this.selectedObject.parent = this._scene;
        this.selecteds = this.selectedObject.children;
        this.updates = [];
        // Prefiltered, Mipmapped Radiance Environment Map
        this._pmremGenerator = null;
        this._enablePostProcessing = settings._enablePostProcessing || false;
        this.effectComposer = new EffectComposer_1.EffectComposer(this.renderer);
        this.init(settings);
        this.onResize();
        this.domElement.addEventListener("mousedown", this.onMousedown.bind(this));
        window.addEventListener("resize", this.onResize.bind(this));
    }
    GLView.prototype.init = function (settings) {
        this._camera = settings.camera || new three_1.PerspectiveCamera(45, 1, 0.1, 20000);
        this._camera.position.set(16, 4, -30);
        this._camera.name = "默认相机";
        this._controls = new OrbitControls_1.OrbitControls(this._camera, this.domElement);
        this._controls.addEventListener("change", function (e) {
            // console.log(e);
            var oc = e.target;
            console.log(oc.target);
            console.log(oc.object.position);
        });
        this._controls.minDistance = 10;
        this._transfromControl = new TransformControls_1.TransformControls(this._camera, this.domElement);
        this.scene.add(this._transfromControl);
        this.scene.add(this._camera);
        var light = new three_1.DirectionalLight();
        light.name = "默认方向光";
        light.position.set(1, 1, 1);
        this.scene.add(light);
        var pl = new three_1.PointLight();
        pl.distance = 1000;
        this._camera.add(pl);
        this.scene.add(this._camera);
        this.scene.add(new three_1.AxesHelper(10000));
        this.scene.add(new three_1.GridHelper(100, 20, 0xff0000, 0xaaaaaa));
        //添加一个地板
        // var gdGeo = new PlaneBufferGeometry(1000000, 1000000);
        // gdGeo.rotateX(-Math.PI / 2)
        // var mesh = new Mesh(gdGeo, new MeshPhysicalMaterial({
        //     color: 0xffffff,
        //     transparency: 0.7,
        //     transparent: true,
        //     metalness: 0.0,
        //     roughness: 0.7,
        //     polygonOffset: true,
        //     polygonOffsetFactor: -1,
        //     polygonOffsetUnits: -1
        //     // side: DoubleSide
        // } as any));
        // (<any>mesh).isHelper = true;
        // mesh.position.set(0, -1, 0)
        // this.add(mesh);
        //添加一个环境光 
        // new RGBELoader()
        //     .setDataType(UnsignedByteType)
        //     .load('../../assets/textures/env/quarry_01_1k.hdr', (texture) => {
        //         this.pmrenvMap(texture)
        //     })
    };
    Object.defineProperty(GLView.prototype, "modelScene", {
        get: function () {
            return this._modelScene;
        },
        set: function (val) {
            this._modelScene = val;
            this.add(val);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLView.prototype, "helperScene", {
        get: function () {
            return this._helperScene;
        },
        set: function (val) {
            this._helperScene = val;
            this.add(val);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLView.prototype, "clearColor", {
        set: function (val) {
            val = val || 0xaaeeff;
            this.renderer.setClearColor(val);
        },
        enumerable: false,
        configurable: true
    });
    GLView.prototype.setTransfromMode = function (mode) {
        this._transfromControl.setMode(mode);
    };
    GLView.prototype.attach = function (model) {
        if (!model) {
            this.detach(model);
        }
        else {
            this._transfromControl.attach(model);
            this._controls.enabled = false;
        }
    };
    GLView.prototype.detach = function (model) {
        this._transfromControl.detach(model);
        this._controls.enabled = true;
    };
    GLView.prototype.pmrenvMap = function (texture, type) {
        if (type === void 0) { type = PMREM.Equirectangular; }
        texture.mapping = three_1.EquirectangularReflectionMapping;
        if (!this._pmremGenerator)
            this._pmremGenerator = new three_1.PMREMGenerator(this.renderer);
        var renderTarget;
        switch (type) {
            case PMREM.CubeMap:
                this._pmremGenerator.compileCubemapShader();
                renderTarget = this._pmremGenerator.fromCubemap(texture);
                break;
            case PMREM.Equirectangular:
                renderTarget = this._pmremGenerator.fromEquirectangular(texture);
                this._pmremGenerator.compileEquirectangularShader();
                break;
            default:
                throw ("pmrem error");
        }
        // this.scene.background = renderTarget.texture;
        this.scene.environment = renderTarget.texture;
    };
    Object.defineProperty(GLView.prototype, "toneExposure", {
        set: function (val) {
            this.renderer.toneMappingExposure = val;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLView.prototype, "camera", {
        get: function () {
            return this._camera;
        },
        set: function (value) {
            this._camera = value;
            this._controls.object = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLView.prototype, "scene", {
        get: function () {
            return this._scene;
        },
        set: function (value) {
            this._scene = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLView.prototype, "width", {
        get: function () {
            return this.domElement.width;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLView.prototype, "height", {
        get: function () {
            return this.domElement.height;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLView.prototype, "domElement", {
        get: function () {
            return this.renderer.domElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(GLView.prototype, "enablePostProcessing", {
        get: function () { return this._enablePostProcessing; },
        set: function (value) {
            this._enablePostProcessing = value;
            if (!value)
                return;
            if (!this.renderPass) {
                this.renderPass = new RenderPass_1.RenderPass(this._scene, this._camera);
                this.effectComposer.addPass(this.renderPass);
                this.effectComposer.setSize(this.width, this.height);
            }
        },
        enumerable: false,
        configurable: true
    });
    GLView.prototype.addPass = function (pass) {
        this.effectComposer.addPass(pass);
    };
    GLView.prototype.addPassEx = function (name, params) {
        if (params === void 0) { params = { threshold: 0.01, strength: 0.1, radius: 0.4 }; }
        if (name === "Bloom") {
            var bloomPass = new UnrealBloomPass_1.UnrealBloomPass(new three_1.Vector2(this.width, this.height), 1.5, 0.4, 0.85);
            bloomPass.threshold = params.threshold;
            bloomPass.strength = params.strength;
            bloomPass.radius = params.radius;
            this.effectComposer.addPass(bloomPass);
            return bloomPass;
        }
    };
    /**
     * 向场景添加模型
     * @param  {Object3D} object 模型
     */
    GLView.prototype.add = function () {
        var object = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            object[_i] = arguments[_i];
        }
        for (var i = 0; i < object.length; i++) {
            var object_i = object[i];
            if (object_i.isSequence) {
                this._modelScene.add(object_i.renderObject);
                this.addUpdates(object_i);
            }
            if (object_i.isBody) {
                this._modelScene.add(object_i.renderObject);
            }
            else if (object_i.isHelper) {
                this._helperScene.add(object_i);
            }
            else {
                this._modelScene.add(object_i);
            }
        }
        return this;
    };
    /**
     * 场景移除模型
     * @param  {Object3D} object 模型
     */
    GLView.prototype.remove = function () {
        var object = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            object[_i] = arguments[_i];
        }
        for (var i = 0; i < object.length; i++) {
            var object_i = object[i];
            if (object_i.isSequence) {
                this._modelScene.remove(object_i.renderObject);
                this.removeUpdates(object_i);
            }
            if (object_i.isBody) {
                this._modelScene.remove(object_i.renderObject);
            }
            else if (object_i.isHelper) {
                this._helperScene.remove(object_i);
            }
            else {
                this._modelScene.remove(object_i);
            }
        }
        return this;
    };
    /**
     * 设置渲染DOM的宽高 更新相机
     * @param  {} width
     * @param  {} height
     */
    GLView.prototype.size = function (width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        if (this._enablePostProcessing)
            this.effectComposer.setSize(width, height);
    };
    /**
     * 添加更新函数
     * @param  {} ...updates
     */
    GLView.prototype.addUpdates = function () {
        var _a;
        var updates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            updates[_i] = arguments[_i];
        }
        (_a = this.updates).push.apply(_a, updates);
    };
    GLView.prototype.removeUpdates = function () {
        var updates = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            updates[_i] = arguments[_i];
        }
        for (var i = 0; i < updates.length; i++) {
            var upm = updates[i];
            var upos = this.updates.indexOf(upm);
            if (upos >= 0)
                this.updates.splice(upos, 1);
        }
    };
    GLView.prototype.onMousedown = function (event) {
        var rect = this.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;
        if (event.button === 0) {
            var intersect = this.getSelect(mouse, false);
        }
    };
    GLView.prototype.onResize = function () {
        this.size(window.innerWidth, window.innerHeight);
    };
    /**
     * 世界坐标投影到屏幕坐标
     * @param  {Vector3} v3 世界坐标
     */
    GLView.prototype.project = function (v3) {
        return v3.project(this.camera);
    };
    /**
     * 世界坐标中的点对应document坐标
     * @param  {} v3
     */
    GLView.prototype.getScreenPosition = function (v3) {
        v3 = this.project(v3);
        var rect = this.domElement.getBoundingClientRect();
        var x = ((v3.x + 1) / 2) * this.width + rect.left;
        var y = -((v3.y - 1) / 2) * this.height + rect.top;
        return new three_1.Vector2(x, y);
    };
    /**
     * 从一个坐标点获取模型
     * @param  {} v2
     * @param  {} first=true
     */
    GLView.prototype.getSelect = function (v2, isMousePos, first) {
        if (isMousePos === void 0) { isMousePos = true; }
        if (first === void 0) { first = true; }
        if (isMousePos) {
            var rect = this.domElement.getBoundingClientRect();
            v2.x = ((v2.x - rect.left) / this.width) * 2 - 1;
            v2.y = -((v2.y - rect.top) / this.height) * 2 + 1;
        }
        //渲染区域之外
        if (v2.x < -1 || v2.x > 1 || v2.y < -1 || v2.y > 1)
            return null;
        raycaster.setFromCamera(v2, this.camera);
        var intersects = raycaster.intersectObject(this.modelScene, true);
        if (intersects.length > 0) {
            if (first)
                return intersects[0];
            else
                return intersects;
        }
        return null;
    };
    /**
     * 将屏幕点反投影到世界坐标
     * @param  {} v3
     */
    GLView.prototype.unproject = function (v3) {
        return v3.unproject(this.camera);
    };
    GLView.prototype.selectMD = function (mulSelected) {
        if (mulSelected === void 0) { mulSelected = false; }
        if (!this.allowSelected)
            return null;
        raycaster.setFromCamera(mouse, this.camera);
        var intersects = raycaster.intersectObject(this.modelScene, true);
        if (intersects.length > 0) {
            var intersect = intersects[0];
            var itrObj = this.getUserParent(intersect.object);
            console.log(intersect.point);
            if (!mulSelected) {
                // 不允许多选
                this.unselect();
            }
            if (!itrObj.selected) {
                this.select(itrObj);
            }
            else {
                itrObj.selected = false;
                var idx = this.selecteds.indexOf(itrObj);
                this.selecteds.splice(idx, 1);
                itrObj.material = itrObj.orgMaterial;
            }
            return itrObj;
        }
        else {
            this.unselect();
        }
        return null;
    };
    /**
     * 设置要选中的模型为选中状态
     * @param  {} models
     */
    GLView.prototype.selectModels = function (models) {
        var ary = Array.isArray(models) ? models : [models];
        //unselected
        this.unselect();
        //selected
        this.select(ary);
    };
    GLView.prototype.select = function (models) {
        var _a;
        var _this = this;
        if (!this.allowSelected)
            return;
        if (models && !Array.isArray(models))
            this._modelControl.attach(this.getUserParent(models));
        var ary;
        if (models === undefined)
            ary = this.selecteds;
        else
            ary = Array.isArray(models) ? models : [models];
        ary = ary.map(function (o) { return _this.getUserParent(o); });
        (_a = this.selecteds).push.apply(_a, ary);
        for (var i = 0; i < ary.length; i++) {
            var model = ary[i];
            //显示开始和结束的控制点
            var model_bone;
            model.children.forEach(function (cm) {
                if (cm.name.indexOf("bone_start") !== -1) {
                    model_bone = cm;
                    return;
                }
            });
            if (model_bone) {
                this.startControl.attach(model_bone);
            }
            //End----------------------------------------------
            for (var j = 0; j < model.children.length; j++) {
                var m = model.children[j];
                //当前层级的选中
                if (m.name.indexOf("hide_node") !== -1) {
                    m.traverse(function (obj) {
                        if (!obj.orgMaterial)
                            obj.orgMaterial = obj.material;
                        obj.selected = true;
                        obj.material = selectMaterial;
                    });
                }
                //显示骨骼操作点
                if (m.name.indexOf("bone") !== -1)
                    m.visible = true;
            }
        }
    };
    /**
     * 取消模型的选中状态
     * @param  {} models
     */
    GLView.prototype.unselect = function (models) {
        this._modelControl.detach();
        var ary;
        if (models === undefined)
            ary = this.selecteds;
        else
            ary = Array.isArray(models) ? models : [models];
        for (var i = 0; i < ary.length; i++) {
            var model = ary[i];
            for (var j = 0; j < model.children.length; j++) {
                var m = model.children[j];
                //当前层级的选中
                if (m.name.indexOf("hide_node") !== -1) {
                    if (m.orgMaterial && m.selected)
                        m.material = m.orgMaterial;
                }
                //显示骨骼操作点
                if (m.name.indexOf("bone") !== -1)
                    m.visible = false;
            }
        }
        // this.selectedObject.remove(...ary);
        while (ary.length > 0) {
            var objs = ary.pop();
            objs.traverse(function (obj) {
                if (obj.orgMaterial && obj.selected)
                    obj.material = obj.orgMaterial;
                obj.selected = false;
            });
        }
        this.startControl.detach();
        this.endControl.detach();
    };
    /**
     * 判断点是否在渲染区域（是否可见）
     * @param  {} v3
     */
    GLView.prototype.inRendererArea = function (v3) {
        v3 = this.project(v3);
        return !(v3.x > 1 || v3.x < -1 || v3.y > 1 || v3.y < -1);
    };
    GLView.prototype.render = function () {
        if (this._enablePostProcessing)
            this.effectComposer.render();
        else
            this.renderer.render(this._scene, this._camera);
    };
    GLView.prototype.run = function () {
        this.render();
        requestAnimationFrame(this.run.bind(this));
    };
    GLView.prototype.hide = function (obj) {
        obj.visible = false;
    };
    GLView.prototype.hideOther = function (obj) {
        this.modelScene.traverse(function (e) {
            e.visible = false;
        });
        obj.traverse(function (e) {
            e.visible = true;
        });
        this.modelScene.visible = true;
        while (obj !== this.modelScene) {
            obj.visible = true;
            obj = obj.parent;
        }
    };
    GLView.prototype.showAll = function () {
        this.modelScene.traverse(function (e) {
            e.visible = true;
        });
    };
    return GLView;
}());
exports.GLView = GLView;
