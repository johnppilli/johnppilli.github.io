import * as THREE from 'three';

// ---------- Setup ----------
const canvas = document.getElementById('bg3d');
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 22;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

// ---------- Node network ----------
const NODE_COUNT = 70;
const SPREAD = 16;          // how far nodes spread from center
const LINK_DISTANCE = 6.5;  // max distance to draw a connecting line

const group = new THREE.Group();
scene.add(group);

// generate random node positions
const nodePositions = [];
for (let i = 0; i < NODE_COUNT; i++) {
  nodePositions.push(new THREE.Vector3(
    (Math.random() - 0.5) * SPREAD * 2,
    (Math.random() - 0.5) * SPREAD * 1.2,
    (Math.random() - 0.5) * SPREAD
  ));
}

// glowing points (the nodes themselves)
const pointsGeometry = new THREE.BufferGeometry().setFromPoints(nodePositions);
const pointsMaterial = new THREE.PointsMaterial({
  color: 0x4f8cff,
  size: 0.14,
  transparent: true,
  opacity: 0.9,
  sizeAttenuation: true,
});
const points = new THREE.Points(pointsGeometry, pointsMaterial);
group.add(points);

// connecting lines between nearby nodes
const linePositions = [];
for (let i = 0; i < nodePositions.length; i++) {
  for (let j = i + 1; j < nodePositions.length; j++) {
    if (nodePositions[i].distanceTo(nodePositions[j]) < LINK_DISTANCE) {
      linePositions.push(
        nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
        nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
      );
    }
  }
}
const lineGeometry = new THREE.BufferGeometry();
lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
const lineMaterial = new THREE.LineBasicMaterial({
  color: 0x2f6fed,
  transparent: true,
  opacity: 0.18,
});
const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
group.add(lines);

// ---------- Mouse parallax ----------
let mouseX = 0;
let mouseY = 0;
window.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX / window.innerWidth) * 2 - 1;
  mouseY = (e.clientY / window.innerHeight) * 2 - 1;
});

// ---------- Resize ----------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ---------- Animate ----------
function animate() {
  requestAnimationFrame(animate);

  // slow constant drift/rotation
  group.rotation.y += 0.0009;
  group.rotation.x += 0.0002;

  // subtle camera parallax following the mouse
  camera.position.x += (mouseX * 2.2 - camera.position.x) * 0.03;
  camera.position.y += (-mouseY * 1.4 - camera.position.y) * 0.03;
  camera.lookAt(scene.position);

  renderer.render(scene, camera);
}
animate();
