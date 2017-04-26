//创建场景
var scene = new THREE.Scene();  
              
//创建相机  
var camera;
camera = new THREE.OrthographicCamera(window.innerWidth/-2,window.innerWidth/2,window.innerHeight/2,window.innerHeight/-2,1,1000);
camera.position.set(0,0,50);
camera.lookAt(new THREE.Vector3(0,0,0));
scene.add(camera);
  
//创建渲染器  
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xFFFFFF, 1.0);
// renderer.setClearColor(0xFFF3EE, 1.0);