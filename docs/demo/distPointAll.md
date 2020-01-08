# 点与其他几何体的案例

<div ref="p2other" class="container"></div>
<div ref='infoPanel' class="info_panel"></div>
{{ 1 + 1 }}
<!-- :::
`{{ This will be displayed as-is }}`
::: -->
<!-- ::: v-pre
`{{ This will be displayed as-is }}`
::: -->

<!-- <click-to-copy :info="loadingTag" /> -->
<!-- <fold-box title="点击以展示/隐藏UMD版使用示例"> -->

{{"\`\`\`js\n\n\`\`\`"}}

```

```

<!-- </fold-box> -->

<script>
import * as cga from "../../src/";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { BufferGeometry, Geometry, Line, LineDashedMaterial, Float32BufferAttribute, PointsMaterial, Points, LineBasicMaterial, Mesh, WebGLRenderer, PerspectiveCamera, Scene, HemisphereLight, PolarGridHelper, Face3, DoubleSide,BoxGeometry,MeshNormalMaterial ,AxesHelper } from "three";

export default {
  data () {
    return {

      loadingTag: `avs`
    }
  },
  methods: {
    initTestScene:function(){
        var point0 = new cga.Point().copy(this.randomV3());
        var point1 = new cga.Point().copy(this.randomV3());
        var result = point0.distanceTo(point1); 
        this.$refs.infoPanel.innerText = JSON.stringify(result);
        this.scene.add(this.toMesh(point0));
        this.scene.add(this.toMesh(point1));
        this.scene.add(this.toDisSeg([point0, point1])); 
    },
    randomV3:function() {
        return cga.v3(Math.random() * 100 - 50, Math.random() * 100, Math.random() * 100 - 50);
    },
    toDisSeg :function(obj, opts){
    var geometry = new Geometry()
    geometry.vertices.push(...obj)
    var material = new LineDashedMaterial({
        color: 0xff0000,
        dashSize: 1,
        gapSize: 1,
        scale: 1, // 比例越大，虚线越密；反之，虚线越疏
        ...opts
    });
    // debugger
    // Line.computeLineDistances(geometry);//
    var line = new Line(geometry, material);
    line.computeLineDistances();
    return line;
    },

    toMesh:function(obj, opts) {
    var renderObj = null;
    if (obj instanceof  cga.Point || obj.isVector3) {
        var geometry = new BufferGeometry()
        geometry.setAttribute('position', new Float32BufferAttribute([obj.x, obj.y, obj.z], 3));
        var material = new PointsMaterial({ size: 5, sizeAttenuation: false, color: 0x0ff0f0, alphaTest: 0.9, transparent: true });
        renderObj = new Points(geometry, material);

    } else if (obj instanceof  cga.Line) {
        var geometry = new Geometry()
        var v1 = obj.direction.clone().multiplyScalar(10000).add(obj.origin);
        var v2 = obj.direction.clone().multiplyScalar(-10000).add(obj.origin);
        geometry.vertices.push(v1, v2);
        var material = new LineBasicMaterial({ color: 0xffff8f });
        renderObj = new Line(geometry, material);

    } else if (obj instanceof  cga.Ray) {
        var geometry = new Geometry()
        var v1 = obj.direction.clone().multiplyScalar(10000).add(obj.origin);
        geometry.vertices.push(obj.origin, v1);
        var material = new LineBasicMaterial({ color: 0xff8fff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof  cga.Segment) {
        var geometry = new Geometry()
        geometry.vertices.push(obj.p0, obj.p1);
        var material = new LineBasicMaterial({ color: 0x8fffff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof  cga.Triangle) { 
        var geometry = new Geometry()
        geometry.vertices = [...obj];
        geometry.faces.push(new Face3(0, 1, 2))
        var material = new MeshBasicMaterial({ color: 0x8f8fff, side: DoubleSide });
        renderObj = new Mesh(geometry, material);
    }

    else if (obj instanceof  cga.PolyLine) {
        var geometry = new Geometry()
        geometry.vertices.push(...obj);
        var material = new LineBasicMaterial({ color: 0xff8fff });
        renderObj = new Line(geometry, material);
    } else if (obj instanceof  cga.Polygon) {

    }

    return renderObj;

},

    init: function() {
      let container = this.$refs.p2other;

      this.camera = new  PerspectiveCamera(
        55,
        container.clientWidth / container.clientHeight,
        0.01,
        1000
      );
      this.camera.position.set(0, 200, -120);
      this.scene = new  Scene();
      let geometry = new  BoxGeometry(0.2, 0.2, 0.2);
      let material = new  MeshNormalMaterial();
      this.mesh = new  Mesh(geometry, material);
      this.scene.add(this.mesh);
  
      this.renderer = new WebGLRenderer( { antialias: true } );
			this.renderer.setPixelRatio( window.devicePixelRatio);
      this.renderer.setSize(container.clientWidth, container.clientHeight);
      this.control = new OrbitControls(this.camera, this.renderer.domElement);
      container.appendChild(this.renderer.domElement);
      this.scene.add(new PolarGridHelper(100, 8, 10, 64, 0x0a9ff0, 0x0af09f))
      this.scene.add(new AxesHelper(1000))
     //---点与直线的距离测试---------------------------------------------------------------- 
 
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
    this.initTestScene()
  }
}
</script>

<style lang="css" scoped>
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
.info_panel{ 
  background-color: #eeeeee;
}
</style>
