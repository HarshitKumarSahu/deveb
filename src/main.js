import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertex from '../shaders/vertex.glsl';
import fragment from '../shaders/fragment.glsl';
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Setup
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ 
  canvas,
  antialias: true,
  alpha : true
 });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  25, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  100
);
camera.position.z = 12;

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// Clock
const clock = new THREE.Clock();

// Geometry
const geometry = new THREE.IcosahedronGeometry(3, 60, 60);

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  side : THREE.DoubleSide,
  // wireframe : true,
  uniforms: {
    uTime : { value : 0 },
    uColorChange : { value : 0 }
  }
});

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.position.y = -3.75; 
scene.add(mesh);

// gsap
let tl = gsap.timeline({
  scrollTrigger : {
    trigger : ".landing",
    start : " top top",
    end : "bottom center",
    scrub : 2,
    // markers : true
  }
})

tl.to(mesh.position, {
  y : 0,
  z : -5,
  ease : 'power2.inOut'
}, "first")
.to(material.uniforms.uColorChange, {
  value : 1,
  ease : 'power2.inOut'
}, "first")


// Resize handler
const handleResize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};

window.addEventListener('resize', handleResize);
handleResize();

// Animation
const animate = () => {
  const elapsedTime = clock.getElapsedTime();
  
  // Update uniforms
  material.uniforms.uTime.value = elapsedTime;
  
  // Update controls
  // controls.update();
  
  // Render
  renderer.render(scene, camera);
  
  requestAnimationFrame(animate);
};

animate();
