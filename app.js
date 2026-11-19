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