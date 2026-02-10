/* --------------------------------
   Outlet Selector (minimal logic)
   - Renders orbit pills
   - Select one outlet
   - Enables Online Order
   - Saves selection in localStorage
---------------------------------- */

(function () {
  const outlets = window.OUTLETS || [];
  const orbitEl = document.getElementById("orbit");
  const btnOrder = document.getElementById("btnOrder");
  const hintText = document.getElementById("hintText");

  const LS_KEY = "five_spice_selected_outlet";

  let selectedId = null;

  // -----------------------------
  // UI: compute orbit positions
  // -----------------------------
  function renderOrbit() {
    orbitEl.innerHTML = "";

    const n = outlets.length;
    if (!n) return;

    // Ellipse radii: tall for mobile, wider for desktop
    const rect = orbitEl.getBoundingClientRect();
    // Auto expand orbit when outlet count increases
    const scale = Math.min(1.05, 0.92 + (n * 0.01));
    // examples:
    // 8 outlets  → ~1.06
    // 12 outlets → ~1.14 (capped at 1.10)

    const rx = rect.width * 0.40 * scale;
    const ry = rect.height * 0.40 * scale;

    

    // helper: create + place one pill at an angle
    function placeOutlet(o, angleDeg) {
    const angle = (Math.PI / 180) * angleDeg;

    const x = Math.cos(angle) * rx;
    const y = Math.sin(angle) * ry;

    const btn = document.createElement("button");
     btn.className = "pill";
     btn.type = "button";
    btn.setAttribute("role", "listitem");
     btn.setAttribute("data-id", o.id);

    btn.innerHTML = `<span class="dot" aria-hidden="true"></span><span>${o.name}</span>`;
    btn.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) translate(var(--nx), var(--ny))`;

     if (o.id === selectedId) btn.classList.add("selected");
     btn.addEventListener("click", () => setSelected(o.id));

    orbitEl.appendChild(btn);
    } 

    // ✅ Equal spacing for ALL outlets (no fixed rule)
    const step = 360 / n;
    const startAngle = -90 + 18;  // fixed rotation in degrees

    outlets.forEach((o, i) => {
   placeOutlet(o, startAngle + step * i);
  });
  }

  // -----------------------------
  // State: select an outlet
  // -----------------------------
  function setSelected(id) {
    selectedId = id;

    // Update pill UI
    const pills = orbitEl.querySelectorAll(".pill");
    pills.forEach(p => {
      p.classList.toggle("selected", p.getAttribute("data-id") === id);
    });

    // Enable CTA
    btnOrder.disabled = false;
    btnOrder.classList.add("enabled");
    hintText.textContent = "Ready to order";

    // Save selection
    const selectedOutlet = outlets.find(o => o.id === id) || null;
    localStorage.setItem(LS_KEY, JSON.stringify(selectedOutlet));
  }

  // -----------------------------
  // CTA: Online Order click
  // (For now: demo action)
  // Later you will redirect to your main website / outlet home
  // -----------------------------
  btnOrder.addEventListener("click", () => {
    if (btnOrder.disabled || !selectedId) return;

    // ✅ For now: show where you will route
    const outlet = outlets.find(o => o.id === selectedId);
    alert(`Outlet selected: ${outlet?.name}\n\nNext step: open your ordering page for this outlet.`);
  });

  // -----------------------------
  // Load existing selection
  // -----------------------------
  function loadExistingSelection() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return;
      const obj = JSON.parse(raw);
      if (obj?.id) {
        selectedId = obj.id;
        btnOrder.disabled = false;
        btnOrder.classList.add("enabled");
        hintText.textContent = "Ready to order";
      }
    } catch (e) {
      // ignore
    }
  }

  // -----------------------------
  // Re-render on resize (keeps orbit perfect)
  // -----------------------------
  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(renderOrbit, 100);
  });

  // Init
  loadExistingSelection();
  renderOrbit();
})();



