import { WebGLRenderer, Scene, Object3D, Vector2, Mesh, Texture, Color, Vector3 } from 'three';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export declare class GLView {
    private _scene;
    private _modelScene;
    private _helperScene;
    renderer: WebGLRenderer;
    container: HTMLElement;
    [x: string]: any;
    _controls: OrbitControls;
    constructor(settings?: any);
    init(settings: any): void;
    set modelScene(val: Object3D);
    get modelScene(): Object3D;
    set helperScene(val: Object3D);
    get helperScene(): Object3D;
    set clearColor(val: Color | number);
    setTransfromMode(mode: any): void;
    attach(model: any): void;
    detach(model: any): void;
    pmrenvMap(texture: Texture, type?: number): void;
    set toneExposure(val: any);
    get camera(): any;
    set camera(value: any);
    get scene(): Scene;
    get width(): number;
    get height(): number;
    set scene(value: Scene);
    get domElement(): HTMLCanvasElement;
    get enablePostProcessing(): any;
    set enablePostProcessing(value: any);
    addPass(pass: any): void;
    addPassEx(name: string, params?: {
        threshold: number;
        strength: number;
        radius: number;
    }): UnrealBloomPass | undefined;
    /**
     * 向场景添加模型
     * @param  {Object3D} object 模型
     */
    add(...object: any[] | Object3D[] | Mesh[]): this;
    /**
     * 场景移除模型
     * @param  {Object3D} object 模型
     */
    remove(...object: any[] | Object3D[] | Mesh[]): this;
    /**
     * 设置渲染DOM的宽高 更新相机
     * @param  {} width
     * @param  {} height
     */
    size(width: number, height: number): void;
    /**
     * 添加更新函数
     * @param  {} ...updates
     */
    addUpdates(...updates: any[]): void;
    removeUpdates(...updates: any[]): void;
    onMousedown(event: MouseEvent): void;
    onResize(): void;
    /**
     * 世界坐标投影到屏幕坐标
     * @param  {Vector3} v3 世界坐标
     */
    project(v3: Vector3): Vector3;
    /**
     * 世界坐标中的点对应document坐标
     * @param  {} v3
     */
    getScreenPosition(v3: Vector3): Vector2;
    /**
     * 从一个坐标点获取模型
     * @param  {} v2
     * @param  {} first=true
     */
    getSelect(v2: Vector2, isMousePos?: boolean, first?: boolean): import("three").Intersection | import("three").Intersection[] | null;
    /**
     * 将屏幕点反投影到世界坐标
     * @param  {} v3
     */
    unproject(v3: Vector3): Vector3;
    selectMD(mulSelected?: boolean): any;
    /**
     * 设置要选中的模型为选中状态
     * @param  {} models
     */
    selectModels(models: any): void;
    select(models: any[] | undefined): void;
    /**
     * 取消模型的选中状态
     * @param  {} models
     */
    unselect(models?: any): void;
    /**
     * 判断点是否在渲染区域（是否可见）
     * @param  {} v3
     */
    inRendererArea(v3: Vector3): boolean;
    render(): void;
    run(): void;
    hide(obj: {
        visible: boolean;
    }): void;
    hideOther(obj: {
        traverse: (arg0: (e: any) => void) => void;
        visible: boolean;
        parent: any;
    }): void;
    showAll(): void;
}
