// ============================================================
// Smart Farmer Portal — Navigation + Capability Scoring Engine
// ============================================================

// ---------- Section Navigation ----------
function hideAll() {
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("farmerLogin").classList.add("hidden");
  document.getElementById("farmerForm").classList.add("hidden");
  document.getElementById("farmerDashboard").classList.add("hidden");
}

function scrollTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showLanding() {
  hideAll();
  document.getElementById("landing").classList.remove("hidden");
  scrollTop();
}

function showFarmerLogin() {
  hideAll();
  document.getElementById("farmerLogin").classList.remove("hidden");
  scrollTop();
}

function showFarmerForm() {
  hideAll();
  document.getElementById("farmerForm").classList.remove("hidden");
  scrollTop();
}

function showDashboard() {
  hideAll();
  document.getElementById("farmerDashboard").classList.remove("hidden");
  scrollTop();
}

// ---------- Helpers ----------

// Small inline error flash instead of a jarring alert()
function flashError(input, message) {
  input.style.border = "2px solid #dc3545";
  input.setAttribute("title", message);
  setTimeout(() => {
    input.style.border = "1px solid #ccc";
  }, 1500);
}

// Animate the score counting up instead of just snapping to the final number
function animateScore(el, target, duration = 900) {
  const start = 0;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(start + (target - start) * eased);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Builds (or reuses) a skill-breakdown block inside the dashboard
function renderBreakdown(parts) {
  let wrap = document.getElementById("skillBreakdown");
  if (!wrap) {
    wrap = document.createElement("div");
    wrap.id = "skillBreakdown";
    wrap.className = "dashboard-details";
    wrap.style.marginTop = "20px";
    const heading = document.getElementById("farmerDashboard").querySelector("h2");
    heading.insertAdjacentElement("afterend", wrap);
  }

  wrap.innerHTML = `<h3>Skill Breakdown</h3>` + parts.map(p => `
    <div style="margin-bottom:14px;">
      <div style="display:flex;justify-content:space-between;font-size:14px;margin-bottom:6px;">
        <span>${p.label}</span>
        <span style="font-weight:600;color:#146c43;">${p.score}/${p.max}</span>
      </div>
      <div style="background:#e9ecef;border-radius:8px;height:10px;overflow:hidden;">
        <div style="width:${(p.score / p.max) * 100}%;background:#198754;height:100%;border-radius:8px;transition:width 0.9s ease;"></div>
      </div>
    </div>
  `).join("");
}

// Personalized greeting line above the score, and lease-specific guidance
function renderGreeting(name, ownershipType) {
  let greet = document.getElementById("farmerGreeting");
  const dashboardSection = document.getElementById("farmerDashboard");

  if (!greet) {
    greet = document.createElement("p");
    greet.id = "farmerGreeting";
    greet.style.fontSize = "16px";
    greet.style.color = "#146c43";
    greet.style.fontWeight = "600";
    greet.style.marginTop = "6px";
    const firstP = dashboardSection.querySelector("p");
    firstP.insertAdjacentElement("afterend", greet);
  }

  const displayName = name && name.trim() ? name.trim() : "Farmer";
  const roleNote = ownershipType === "lease"
    ? " — as a tenant farmer, group guarantee & FPO co-lending schemes may apply."
    : "";
  greet.textContent = `Welcome, ${displayName}!${roleNote}`;
}

// ---------- App Init ----------
document.addEventListener("DOMContentLoaded", () => {

  // Navigation events
  document.getElementById("continueFarmerBtn").addEventListener("click", showFarmerLogin);
  document.getElementById("navLoginBtn").addEventListener("click", showFarmerLogin);

  document.getElementById("loginSubmitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    const loginBox = document.querySelector("#farmerLogin .login-box");
    const [mobileInput, passwordInput] = loginBox.querySelectorAll("input");

    if (!mobileInput.value.trim()) {
      flashError(mobileInput, "Mobile number or username is required");
      return;
    }
    if (!passwordInput.value.trim()) {
      flashError(passwordInput, "Password is required");
      return;
    }
    showFarmerForm();
  });

  // Capability form submission + scoring engine
  const formElement = document.getElementById("capabilityForm");

  formElement.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameInput = formElement.querySelector('input[placeholder="Full Name"]');
    const ownershipSelect = document.getElementById("ownershipType");

    const agronomyScore = parseInt(document.getElementById("agronomySkill").value) || 0;
    const businessScore = parseInt(document.getElementById("businessSkill").value) || 0;
    const machineryScore = parseInt(document.getElementById("machinerySkill").value) || 0;
    const certScore = parseInt(document.getElementById("certificateType").value) || 0;

    const finalScore = agronomyScore + businessScore + machineryScore + certScore;

    const scoreTextElement = document.getElementById("scoreValue");
    const tierBadgeElement = document.getElementById("tierValue");
    const descTextElement = document.getElementById("tierDescription");

    // Reset then animate to new value
    animateScore(scoreTextElement, finalScore);

    tierBadgeElement.className = "tier-badge";

    if (finalScore >= 80) {
      tierBadgeElement.textContent = "Tier 1: Master Farmer";
      tierBadgeElement.classList.add("tier-1");
      descTextElement.textContent = "Excellent operational rating. Highly competent management traits verified. System recommends optimal loan limits with fast-track digital approval processing and minimum base interest rates.";
    } else if (finalScore >= 50) {
      tierBadgeElement.textContent = "Tier 2: Capable Farmer";
      tierBadgeElement.classList.add("tier-2");
      descTextElement.textContent = "Solid functional operations capabilities detected. Standard processing track approved. Tip: Complete verified micro-irrigation training or upload organic trade certifications to transition to Tier 1 terms.";
    } else {
      tierBadgeElement.textContent = "Tier 3: Developing Farmer";
      tierBadgeElement.classList.add("tier-3");
      descTextElement.textContent = "Baseline structural parameters limited. Recommended conditional loan approval linked directly with regional cooperative oversight or micro-credit safety streams.";
    }

    renderGreeting(nameInput ? nameInput.value : "", ownershipSelect.value);

    renderBreakdown([
      { label: "Crop Management & Agronomy", score: agronomyScore, max: 40 },
      { label: "Financial & Market Skill", score: businessScore, max: 30 },
      { label: "Machinery & Tech Proficiency", score: machineryScore, max: 20 },
      { label: "Verified Certification", score: certScore, max: 10 },
    ]);

    showDashboard();
  });
});