import * as THREE from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertex from '../shaders/vertex.glsl';
import fragment from '../shaders/fragment.glsl';
import gsap from "gsap";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.5,  // Adjust scrolling smoothness
  easing: (t) => 1 - Math.pow(1 - t, 3),  // Custom easing function
  smoothWheel: true,
  smoothTouch: true, // Enables touch support
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}

// Ensure the loop runs only when the page is active
requestAnimationFrame(raf);

// Optional: Sync Lenis with GSAP (if using GSAP)
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

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
// camera.position.z = 12;
function setCameraPosition() {
    if (window.innerWidth < 500) {
        camera.position.z = 22;
    } else if (window.innerWidth < 700) {
        camera.position.z = 20;
    } else {
        camera.position.z = 12;
    }
}
setCameraPosition();

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

function updateMeshPosition() {
  if (window.innerWidth > 700) {
    mesh.position.y = -3.75;
  } else {
    mesh.position.y = 2;
    mesh.position.z = -10;
  }
}

// Set initial position
updateMeshPosition();

// Update on window resize
window.addEventListener("resize", updateMeshPosition);
// mesh.position.y = -3.75; 
scene.add(mesh);


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
.to(".landing h1", {
  opacity:0,
}, "first")
.to(".who", {
  opacity:1,
  ease: "power2.out"
})
.to(".navA" , {
  opacity:0,
  ease: "power2.out"
})


let buttons = document.querySelectorAll(".common");

buttons.forEach((btn) => {
  btn.addEventListener("mouseenter", () => {
    gsap.to(btn, {
      background: "#000",
      color: "#f8f8f8",
      duration: 0.6,
    });
  });

  btn.addEventListener("mouseleave", () => {
    gsap.to(btn, {
      background: "transparent",
      color: "#000",
      duration: 0.6,
    });
  });
});


// let btn = document.querySelector(".common");
// btn.addEventListener("mouseenter", ()=> {
//   gsap.to(btn, {
//     background : "#000",
//     color : "#f8f8f8",
//     duration : 0.6
//   })
// })
// btn.addEventListener("mouseleave", ()=> {
//   gsap.to(btn, {
//     background : "transparent",
//     color : "#000",
//     duration : 0.6
//   })
// })

// Color Animation Loop
gsap.to(material.uniforms.uColorChange, {
  value: 1,
  duration: 3,
  repeat: -1, // Infinite loop
  yoyo: true, // Go back and forth
  ease: "power2.inOut",
});

//nav
const menu = document.querySelector(".menupg");
const menuBar = document.querySelector(".cross");
let isOpen = false;

// gsap.to(menu , {
//   x: "100vw"
// })

menuBar.addEventListener("click", () => {
    if (!isOpen) {
        gsap.to(".bar1", { y: 6, rotate: 45, duration: 0.3 });
        gsap.to(".bar2", { y: -6, rotate: -45, duration: 0.3 });
        gsap.to(menu , {x: 0});
        gsap.to(".navA" , {display : "none"});
    } else {
        gsap.to(".bar1", { y: 0, rotate: 0, duration: 0.3 });
        gsap.to(".bar2", { y: 0, rotate: 0, duration: 0.3 });
        gsap.to(menu , {x: "100vw", ease: "linear.inOut",});
        gsap.to(".navA" , {display : "flex"})
    }
    isOpen = !isOpen;
});

// const photos = gsap.utils.toArray(".images:not(:first-child)");
// gsap.set(photos, { yPercent: 101 });

// const animation = gsap.to(photos, {
//   yPercent: 0,
//   duration: 1,
//   stagger: 1,
//   ease: "power1.inOut" // Added easing for smoother animation
// });

// ScrollTrigger.create({
//   trigger: ".gallery",
//   start: "top top",
//   end: "bottom bottom",
//   pin: ".right",
//   animation: animation,
//   scrub: true,
//   markers: true,
//   anticipatePin: 1 // Added to improve pinning behavior
// });

// // Select all images except the first one
// const photos = gsap.utils.toArray(".images:not(:first-child)");

// // Set initial position of images (below their starting point)
// gsap.set(photos, { yPercent: 101 });

// gsap.to(photos, {
//   yPercent: 0,
//   stagger: 1,
//   duration: 1, // Staggers each image to appear in sequence
//   ease: "linear.inOut",
//   scrollTrigger: {
//     trigger: ".gallery",
//     start: "top top",
//     end: "bottom bottom",
//     scrub: true, // Smooth scroll-based animation
//     pin: ".right", // Keeps right section fixed while scrolling
//     anticipatePin: 1, // Helps prevent flickering
//     // markers: true,
//   }
// });

// Select all images except the first one
const photos = gsap.utils.toArray(".images:not(:first-child)");
const gallerySection = document.querySelector(".gallery"); // Target `.gallery` instead of `.right`

// Define background colors corresponding to each image
const bgColors = ["#D3D6F0", "#FAE1ED", "#FFEDE0", "#E0F0FF", "#FFEAE1"]; 

// Set initial position of images (below their starting point)
gsap.set(photos, { yPercent: 101 });

gsap.to(photos, {
  yPercent: 0,
  stagger: 1,
  duration: 1,
  ease: "linear.inOut",
  scrollTrigger: {
    trigger: ".gallery",
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    pin: ".right",
    anticipatePin: 1,
    // markers: true,
    onUpdate: (self) => {
      // Calculate the index of the current image
      let index = Math.floor(self.progress * (bgColors.length));
      gallerySection.style.backgroundColor = bgColors[index] || bgColors[bgColors.length - 1];
    }
  }
});


function startLoader() {
  let counterElem = document.querySelector(".counter");
  let currentVal = 0;

  function updateCounter() {
    if(currentVal === 100) {
      return;
    }

    currentVal += Math.floor(Math.random() * 10) + 1;

    if(currentVal > 100) {
      currentVal = 100;
    }

    counterElem.textContent = currentVal;

    let delay = Math.floor(Math.random() * 200) + 50;
    setTimeout(updateCounter , delay);
  }
  updateCounter();
  
}

startLoader();

gsap.to(".counter", 0.25, {
  delay : 3.5,
  opacity : 0
})

gsap.to(".bar", 1.5, {
  delay:3.5,
  height:0,
  stagger : {
    amount : 0.5
  },
  ease : "power4.inOut"
})

gsap.from(".title", 1.5 , {
  delay:4,
  y:700,
  // stagger : {
  //   amount:0.5
  // },
  ease : "power4.inOut"
})
gsap.from(mesh.position, 2, {
  delay: 4.2,
  y: -15,
  ease: "power4.inOut",
  onComplete: function() {
    document.querySelector(".overlay").style.display = "none";
  }
});

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


