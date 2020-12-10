import { WebGLRenderer, Scene, PerspectiveCamera, Object3D, Vector2, Raycaster, MeshPhongMaterial, WebGLRenderTarget, PMREMGenerator, RGBFormat, sRGBEncoding, EquirectangularReflectionMapping, DirectionalLight, Mesh, PlaneBufferGeometry, MeshPhysicalMaterial, DoubleSide, UnsignedByteType, AxesHelper, GridHelper, Texture, Color, Vector3, PointLight } from 'three';
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { TransformControls } from "three/examples/jsm/controls/TransformControls"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



const raycaster = new Raycaster();
const mouse = new Vector2();
const selectMaterial = new MeshPhongMaterial({ color: 0xaa3366 });
const PMREM = {
    Scene: 0,
    Equirectangular: 1,
    CubeMap: 2

}

export class GLView {
    private _scene: Scene;
    private _modelScene: Object3D;
    private _helperScene: Object3D;
    renderer: WebGLRenderer;
    container: HTMLElement;
    [x: string]: any;
    _controls!: OrbitControls;
    constructor(settings: any = {}) {
        this.allowSelected = true;
        this.renderer = new WebGLRenderer({
            antialias: true
        });
        this.container = settings.container;
        if (this.container) this.container.appendChild(this.renderer.domElement);

        this._scene = settings.scene || new Scene();
        this._scene.name = "默认场景";
        this._modelScene = new Object3D();
        this._modelScene.name = "模型场景";
        this._scene.add(this._modelScene);

        this._helperScene = new Object3D();
        this._helperScene.add(new AxesHelper(1000000));
        this._scene.add(this._helperScene);


        this.clearColor = settings.clearColor;


        this.selectedObject = new Object3D();
        this.selectedObject.parent = this._scene;
        this.selecteds = this.selectedObject.children;

        this.updates = [];

        // Prefiltered, Mipmapped Radiance Environment Map
        this._pmremGenerator = null

        this._enablePostProcessing = settings._enablePostProcessing || false;
        this.effectComposer = new EffectComposer(this.renderer)

        this.init(settings);

        this.onResize();
        this.domElement.addEventListener("mousedown", this.onMousedown.bind(this));
        window.addEventListener("resize", this.onResize.bind(this));
    }

    init(settings: any) {
        this._camera = settings.camera || new PerspectiveCamera(45, 1, 0.1, 20000);
        this._camera.position.set(16, 4, -30);
        this._camera.name = "默认相机";
        this._controls = new OrbitControls(this._camera, this.domElement);
        this._controls.addEventListener("change", (e) => {
            // console.log(e);
            const oc: OrbitControls = e.target;
            console.log(oc.target);
            console.log(oc.object.position);
        })
        this._controls.minDistance = 10;
        this._transfromControl = new TransformControls(this._camera, this.domElement)
        this.scene.add(this._transfromControl);
        this.scene.add(this._camera);

        var light = new DirectionalLight();
        light.name = "默认方向光";
        light.position.set(1, 1, 1);
        this.scene.add(light);
        var pl = new PointLight();
        pl.distance = 1000;
        this._camera.add(pl);
        this.scene.add(this._camera)

        this.scene.add(new AxesHelper(10000))
        this.scene.add(new GridHelper(100, 20, 0xff0000, 0xaaaaaa))
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
    }

    set modelScene(val: Object3D) {
        this._modelScene = val;
        this.add(val);
    }
    get modelScene(): Object3D {
        return this._modelScene;
    }


    set helperScene(val: Object3D) {
        this._helperScene = val;
        this.add(val);
    }

    get helperScene(): Object3D {
        return this._helperScene;
    }

    set clearColor(val: Color | number) {
        val = val || 0xaaeeff
        this.renderer.setClearColor(<Color>val)
    }

    setTransfromMode(mode: any) {
        this._transfromControl.setMode(mode);
    }

    attach(model: any) {
        if (!model) {
            this.detach(model)
        } else {
            this._transfromControl.attach(model);
            this._controls.enabled = false;
        }
    }
    detach(model: any) {
        this._transfromControl.detach(model);
        this._controls.enabled = true;
    }

    pmrenvMap(texture: Texture, type = PMREM.Equirectangular) {
        texture.mapping = EquirectangularReflectionMapping;
        if (!this._pmremGenerator)
            this._pmremGenerator = new PMREMGenerator(this.renderer);

        let renderTarget;
        switch (type) {
            case PMREM.CubeMap:
                this._pmremGenerator.compileCubemapShader();
                renderTarget = this._pmremGenerator.fromCubemap(texture)
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
    }

    set toneExposure(val: any) {
        this.renderer.toneMappingExposure = val;
    }



    get camera() {
        return this._camera;
    }

    set camera(value) {
        this._camera = value;
        this._controls.object = value;
    }

    get scene() {
        return this._scene;
    }
    get width() {
        return this.domElement.width;
    }
    get height() {
        return this.domElement.height;
    }

    set scene(value) {
        this._scene = value;
    }

    get domElement() {
        return this.renderer.domElement;
    }

    get enablePostProcessing() { return this._enablePostProcessing }
    set enablePostProcessing(value) {
        this._enablePostProcessing = value;
        if (!value)
            return
        if (!this.renderPass) {
            this.renderPass = new RenderPass(this._scene, this._camera);
            this.effectComposer.addPass(this.renderPass);
            this.effectComposer.setSize(this.width, this.height);
        }
    }

    addPass(pass: any) {
        this.effectComposer.addPass(pass)
    }

    addPassEx(name: string, params = { threshold: 0.01, strength: 0.1, radius: 0.4 }) {
        if (name === "Bloom") {
            var bloomPass = new UnrealBloomPass(new Vector2(this.width, this.height), 1.5, 0.4, 0.85);
            bloomPass.threshold = params.threshold;
            bloomPass.strength = params.strength;
            bloomPass.radius = params.radius;

            this.effectComposer.addPass(bloomPass);
            return bloomPass
        }

    }

    /**
     * 向场景添加模型
     * @param  {Object3D} object 模型
     */
    add(...object: any[] | Object3D[] | Mesh[]) {
        for (let i = 0; i < object.length; i++) {
            const object_i = object[i];
            if (object_i.isSequence) {
                this._modelScene.add(object_i.renderObject);
                this.addUpdates(object_i)

            }

            if (object_i.isBody) {
                this._modelScene.add(object_i.renderObject);
            } else if (object_i.isHelper) {
                this._helperScene.add(object_i)
            } else {
                this._modelScene.add(object_i)
            }

        }
        return this;
    }
    /**
     * 场景移除模型
     * @param  {Object3D} object 模型
     */
    remove(...object: any[] | Object3D[] | Mesh[]) {
        for (let i = 0; i < object.length; i++) {
            const object_i = object[i];
            if (object_i.isSequence) {
                this._modelScene.remove(object_i.renderObject);
                this.removeUpdates(object_i)

            }
            if (object_i.isBody) {
                this._modelScene.remove(object_i.renderObject);
            } else if (object_i.isHelper) {
                this._helperScene.remove(object_i)
            } else {
                this._modelScene.remove(object_i)
            }

        }
        return this;
    }
    /**
     * 设置渲染DOM的宽高 更新相机
     * @param  {} width
     * @param  {} height
     */
    size(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

        if (this._enablePostProcessing)
            this.effectComposer.setSize(width, height);
    }

    /**
     * 添加更新函数
     * @param  {} ...updates
     */
    addUpdates(...updates: any[]) {
        this.updates.push(...updates);
    }

    removeUpdates(...updates: any[]) {
        for (let i = 0; i < updates.length; i++) {
            const upm = updates[i];
            var upos = this.updates.indexOf(upm)
            if (upos >= 0)
                this.updates.splice(upos, 1);
        }
    }

    onMousedown(event: MouseEvent) {
        let rect = this.domElement.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / this.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / this.height) * 2 + 1;

        if (event.button === 0) {
            let intersect = this.getSelect(mouse, false);
        }
    }

    onResize() {
        this.size(window.innerWidth, window.innerHeight);
    }


    /**
     * 世界坐标投影到屏幕坐标
     * @param  {Vector3} v3 世界坐标
     */
    project(v3: Vector3) {
        return v3.project(this.camera);
    }
    /**
     * 世界坐标中的点对应document坐标
     * @param  {} v3
     */
    getScreenPosition(v3: Vector3) {
        v3 = this.project(v3);
        let rect = this.domElement.getBoundingClientRect();
        let x = ((v3.x + 1) / 2) * this.width + rect.left;
        let y = -((v3.y - 1) / 2) * this.height + rect.top;

        return new Vector2(x, y);
    }
    /**
     * 从一个坐标点获取模型
     * @param  {} v2
     * @param  {} first=true
     */
    getSelect(v2: Vector2, isMousePos = true, first = true) {
        if (isMousePos) {
            let rect = this.domElement.getBoundingClientRect();
            v2.x = ((v2.x - rect.left) / this.width) * 2 - 1;
            v2.y = -((v2.y - rect.top) / this.height) * 2 + 1;
        }

        //渲染区域之外
        if (v2.x < -1 || v2.x > 1 || v2.y < -1 || v2.y > 1) return null;

        raycaster.setFromCamera(v2, this.camera);
        var intersects = raycaster.intersectObject(this.modelScene, true);

        if (intersects.length > 0) {
            if (first) return intersects[0];
            else return intersects;
        }
        return null;
    }
    /**
     * 将屏幕点反投影到世界坐标
     * @param  {} v3
     */
    unproject(v3: Vector3) {
        return v3.unproject(this.camera);
    }

    selectMD(mulSelected = false) {
        if (!this.allowSelected) return null;
        raycaster.setFromCamera(mouse, this.camera);

        var intersects = raycaster.intersectObject(this.modelScene, true);

        if (intersects.length > 0) {
            var intersect = intersects[0];
            const itrObj = this.getUserParent(intersect.object);
            console.log(intersect.point);

            if (!mulSelected) {
                // 不允许多选
                this.unselect();
            }

            if (!itrObj.selected) {
                this.select(itrObj);
            } else {
                itrObj.selected = false;
                var idx = this.selecteds.indexOf(itrObj);
                this.selecteds.splice(idx, 1);
                itrObj.material = itrObj.orgMaterial;
            }
            return itrObj;
        } else {
            this.unselect();
        }
        return null;
    }

    /**
     * 设置要选中的模型为选中状态
     * @param  {} models
     */
    selectModels(models: any) {
        let ary = Array.isArray(models) ? models : [models];

        //unselected
        this.unselect();

        //selected
        this.select(ary);
    }

    select(models: any[] | undefined) {
        if (!this.allowSelected) return;
        if (models && !Array.isArray(models))
            this._modelControl.attach(this.getUserParent(models));

        let ary;
        if (models === undefined) ary = this.selecteds;
        else ary = Array.isArray(models) ? models : [models];
        ary = ary.map((o: any) => this.getUserParent(o));
        this.selecteds.push(...ary);

        for (let i = 0; i < ary.length; i++) {
            var model = ary[i];
            //显示开始和结束的控制点
            var model_bone;
            model.children.forEach((cm: { name: string | string[]; }) => {
                if (cm.name.indexOf("bone_start") !== -1) {
                    model_bone = cm;
                    return;
                }
            });
            if (model_bone) {
                this.startControl.attach(model_bone);
            }
            //End----------------------------------------------

            for (let j = 0; j < model.children.length; j++) {
                var m = model.children[j];
                //当前层级的选中
                if (m.name.indexOf("hide_node") !== -1) {
                    m.traverse((obj: { orgMaterial: any; material: MeshPhongMaterial; selected: boolean; }) => {
                        if (!obj.orgMaterial) obj.orgMaterial = obj.material;
                        obj.selected = true;
                        obj.material = selectMaterial;
                    });
                }

                //显示骨骼操作点
                if (m.name.indexOf("bone") !== -1) m.visible = true;
            }
        }


    }
    /**
     * 取消模型的选中状态
     * @param  {} models
     */
    unselect(models?: any) {
        this._modelControl.detach();
        let ary;
        if (models === undefined) ary = this.selecteds;
        else ary = Array.isArray(models) ? models : [models];

        for (let i = 0; i < ary.length; i++) {
            var model = ary[i];
            for (let j = 0; j < model.children.length; j++) {
                var m = model.children[j];
                //当前层级的选中
                if (m.name.indexOf("hide_node") !== -1) {
                    if (m.orgMaterial && m.selected) m.material = m.orgMaterial;
                }
                //显示骨骼操作点
                if (m.name.indexOf("bone") !== -1) m.visible = false;
            }
        }

        // this.selectedObject.remove(...ary);
        while (ary.length > 0) {
            const objs = ary.pop();
            objs.traverse((obj: { orgMaterial: any; selected: boolean; material: any; }) => {
                if (obj.orgMaterial && obj.selected) obj.material = obj.orgMaterial;
                obj.selected = false;
            });
        }

        this.startControl.detach();
        this.endControl.detach();
    }
    /**
     * 判断点是否在渲染区域（是否可见）
     * @param  {} v3
     */
    inRendererArea(v3: Vector3) {
        v3 = this.project(v3);
        return !(v3.x > 1 || v3.x < -1 || v3.y > 1 || v3.y < -1);
    }

    render() {
        if (this._enablePostProcessing)
            this.effectComposer.render()
        else
            this.renderer.render(this._scene, this._camera);
    }



    run() {
        this.render();
        requestAnimationFrame(this.run.bind(this));
    }



    hide(obj: { visible: boolean; }) {
        obj.visible = false;
    }

    hideOther(obj: { traverse: (arg0: (e: any) => void) => void; visible: boolean; parent: any; }) {
        this.modelScene.traverse((e: { visible: boolean; }) => {
            e.visible = false;
        });
        obj.traverse((e: { visible: boolean; }) => {
            e.visible = true;
        });
        this.modelScene.visible = true;
        while (obj !== this.modelScene) {
            obj.visible = true;
            obj = obj.parent;
        }
    }

    showAll() {
        this.modelScene.traverse((e: { visible: boolean; }) => {
            e.visible = true;
        });
    }

    //---模型转化使用API-----------------------------------------------------------------------

}