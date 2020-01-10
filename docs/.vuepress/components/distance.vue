<template>
  <div>
    <el-button @click="refresh" type="primary">更新测试案例</el-button>
    <div ref="p2other" class="container"></div>
    <div ref="infoPanel" class="info_panel"></div>
  </div>
</template>

<script>
import * as cga from "../../../src/";
import { initTestScene, randomV3, toDisSeg, toMesh } from "./utils";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  BufferGeometry,
  Geometry,
  Line,
  LineDashedMaterial,
  Float32BufferAttribute,
  PointsMaterial,
  Points,
  LineBasicMaterial,
  Mesh,
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  HemisphereLight,
  PolarGridHelper,
  Face3,
  DoubleSide,
  BoxGeometry,
  MeshNormalMaterial,
  AxesHelper,
  Object3D
} from "three";
export default {
  name: "distance",
  props: { geo0: String, geo1: String },
  data() {
    return {
      loadingTag: `avs`
    };
  },
  methods: {
    init: function() {
      let container = this.$refs.p2other;

      this.camera = new PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.01,
        1000
      );
      this.camera.position.set(0, 200, -120);
      this.scene = new Scene();
      let geometry = new BoxGeometry(0.2, 0.2, 0.2);
      let material = new MeshNormalMaterial();
      this.mesh = new Mesh(geometry, material);
      this.scene.add(this.mesh);

      this.renderer = new WebGLRenderer({ antialias: true });
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      container.appendChild(this.renderer.domElement);
      this.scene.add(new PolarGridHelper(100, 8, 10, 64, 0x0a9ff0, 0x0af09f));
      this.scene.add(new AxesHelper(1000));
      this.testScene = new Object3D();
      this.scene.add(this.testScene);
      //---点与直线的距离测试----------------------------------------------------------------

      var result = initTestScene(this.geo0, this.geo1, this.testScene);
      this.$refs.infoPanel.innerText = JSON.stringify(result);
    },
    refresh: function() {
      this.testScene.children = [];
      var result = initTestScene(this.geo0, this.geo1, this.testScene);
      this.$refs.infoPanel.innerText = JSON.stringify(result);
    },
    animate: function() {
      this.renderer.render(this.scene, this.camera);

      requestAnimationFrame(this.animate);
      // this.renderer1.render(this.scene1, this.camera);
    }
  },
  mounted() {
    this.init();
    this.animate();
  }
};
</script>

<style>
.canvas {
  position: absolute;
  left: 0;
  width: 100%;
  height: 100%;
}

.container {
  position: relative;
  height: 400px;
  background-color: #282c34;
  padding: 0px;
  margin: 0px;
  overflow: hidden;
  color: #fff;
}

.info_panel {
  background-color: #eeeeee;
}
</style>