import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const parts = [
  {
    system: "Suspension",
    name: "Front Lower Control Arm (pair)",
    pn: "F4ZZ-5A649-A",
    notes: "Includes ball joint and bushings. Common wear item on 94-95."
  },
  {
    system: "Suspension",
    name: "Rear Upper Control Arm",
    pn: "F2ZZ-5500-A",
    notes: "Without Cobra. Bushings included."
  },
  {
    system: "Brakes",
    name: "Front Brake Pads (set)",
    pn: "F5ZZ-2001-A / 1U2Z-2V001-KA",
    notes: "OEM ceramic or equivalent. 10.9\" rotors."
  },
  {
    system: "Brakes",
    name: "Front Rotors",
    pn: "YR3Z-1V125-B",
    notes: "Without Cobra. Ventilated 10.9\"."
  },
  {
    system: "Engine",
    name: "Spark Plugs (set of 8)",
    pn: "ASF-32C / Motorcraft SP-419",
    notes: "Gap 0.054\". Torque 11-15 ft-lbs. Cast iron heads."
  },
  {
    system: "Engine",
    name: "Oil Filter",
    pn: "FL-820 / Motorcraft FL-820S",
    notes: "5 quarts 5W-30 (or 5W-20 updated)."
  },
  {
    system: "Drivetrain",
    name: "Clutch Kit",
    pn: "OEM or Centerforce / Spec equivalent",
    notes: "T5 manual. Replace while engine is out."
  }
];

const upgrades = [
  {
    name: "Full Suspension Bushing Refresh",
    category: "reliability",
    impact: "Eliminates clunks and improves highway tracking. Critical for daily 100+ mile days.",
    cost: "$200-400"
  },
  {
    name: "3.73 or 3.55 Gears",
    category: "highway",
    impact: "Better cruising RPM on highway without killing low-end. Stock is typically 3.27 or 3.08.",
    cost: "$400-700"
  },
  {
    name: "GT40 Heads + Intake",
    category: "power",
    impact: "Classic 30-40hp gain on the 5.0. Proven, reliable, and the friends already know the combo.",
    cost: "$800-1500 used"
  },
  {
    name: "Maximum Motorsports or Steeda Suspension Kit",
    category: "track",
    impact: "Transforms the chassis. The SN95 responds extremely well to proper geometry.",
    cost: "$800-1500"
  },
  {
    name: "Aluminum Radiator + Electric Fan",
    category: "reliability",
    impact: "Keeps temps in check on long highway runs, especially once power is added.",
    cost: "$250-450"
  }
];

function renderParts(filter = "") {
  const grid = document.getElementById("parts-grid");
  const filtered = parts.filter(p =>
    p.name.toLowerCase().includes(filter.toLowerCase()) ||
    p.pn.toLowerCase().includes(filter.toLowerCase()) ||
    p.system.toLowerCase().includes(filter.toLowerCase())
  );
  grid.innerHTML = filtered.map(p => `
    <div class="card">
      <div class="meta">${p.system}</div>
      <h3>${p.name}</h3>
      <div class="pn">${p.pn}</div>
      <p class="meta">${p.notes}</p>
    </div>
  `).join("") || "<p>No parts found.</p>";
}

function renderUpgrades(filter = "all") {
  const grid = document.getElementById("upgrades-grid");
  const filtered = filter === "all" ? upgrades : upgrades.filter(u => u.category === filter);
  grid.innerHTML = filtered.map(u => `
    <div class="card">
      <h3>${u.name}</h3>
      <p>${u.impact}</p>
      <div class="meta">Est. ${u.cost}</div>
    </div>
  `).join("");
}

document.getElementById("parts-search").addEventListener("input", e => renderParts(e.target.value));

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    renderUpgrades(btn.dataset.filter);
  });
});

const themeToggle = document.getElementById("theme-toggle");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
document.documentElement.setAttribute("data-theme", prefersDark ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
});

const saved = localStorage.getItem("theme");
if (saved) document.documentElement.setAttribute("data-theme", saved);

renderParts();
renderUpgrades();

// ===== 3D Visualizer =====
const canvas = document.getElementById('viz-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new THREE.Scene();
scene.background = null;

const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(4.5, 2.2, 6);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0.6, 0);

const ambient = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambient);
const dir = new THREE.DirectionalLight(0xffffff, 1.1);
dir.position.set(5, 8, 4);
scene.add(dir);
const fill = new THREE.DirectionalLight(0xffffff, 0.4);
fill.position.set(-4, 3, -2);
scene.add(fill);

// Car group
const car = new THREE.Group();
scene.add(car);

// Body (simplified SN95 coupe shape)
const bodyMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.4, roughness: 0.45 });
const bodyGeo = new THREE.BoxGeometry(3.8, 1.1, 1.7);
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.position.y = 0.85;
body.castShadow = true;
car.add(body);

// Hood / cabin rise
const cabinGeo = new THREE.BoxGeometry(1.6, 0.55, 1.55);
const cabin = new THREE.Mesh(cabinGeo, bodyMat);
cabin.position.set(-0.3, 1.5, 0);
car.add(cabin);

// Windshield angle approx
const glassMat = new THREE.MeshStandardMaterial({ color: 0x88ccff, transparent: true, opacity: 0.35, metalness: 0.1, roughness: 0.1 });
const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.5, 1.4), glassMat);
windshield.position.set(0.55, 1.45, 0);
windshield.rotation.x = -0.35;
car.add(windshield);

// Wheels
const wheelMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.7, roughness: 0.3 });
const rimMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.15 });
function makeWheel(x, z) {
  const group = new THREE.Group();
  const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.22, 24), wheelMat);
  tire.rotation.z = Math.PI / 2;
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.24, 16), rimMat);
  rim.rotation.z = Math.PI / 2;
  group.add(tire, rim);
  group.position.set(x, 0.38, z);
  return group;
}
const wheels = [
  makeWheel(1.25, 0.85),
  makeWheel(1.25, -0.85),
  makeWheel(-1.35, 0.85),
  makeWheel(-1.35, -0.85)
];
wheels.forEach(w => car.add(w));

// Ground
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.9 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// Explode state
let exploded = false;
const originalPositions = new Map();
car.children.forEach(child => {
  originalPositions.set(child.uuid, child.position.clone());
});

function explode(amount = 1.4) {
  exploded = true;
  // Body stays, wheels and cabin move out
  wheels.forEach((w, i) => {
    const dir = new THREE.Vector3(w.position.x > 0 ? 1 : -1, 0.3, w.position.z > 0 ? 1 : -1).normalize();
    w.position.copy(originalPositions.get(w.uuid)).add(dir.multiplyScalar(amount));
  });
  cabin.position.copy(originalPositions.get(cabin.uuid)).add(new THREE.Vector3(0, 0.8, 0));
  windshield.position.copy(originalPositions.get(windshield.uuid)).add(new THREE.Vector3(0.4, 0.6, 0));
}

function reset() {
  exploded = false;
  car.children.forEach(child => {
    const orig = originalPositions.get(child.uuid);
    if (orig) child.position.copy(orig);
  });
}

document.getElementById('explode-btn').addEventListener('click', () => {
  if (exploded) reset(); else explode();
});
document.getElementById('reset-btn').addEventListener('click', reset);

function resize() {
  const container = document.getElementById('viz-container');
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h, false);
}
window.addEventListener('resize', resize);
resize();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();