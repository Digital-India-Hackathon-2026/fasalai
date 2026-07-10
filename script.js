// Navigation Layer Switching
function hideAll() {
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("farmerLogin").classList.add("hidden");
  document.getElementById("farmerForm").classList.add("hidden");
  document.getElementById("farmerDashboard").classList.add("hidden");
}

function showLanding() {
  hideAll();
  document.getElementById("landing").classList.remove("hidden");
}

function showFarmerLogin() {
  hideAll();
  document.getElementById("farmerLogin").classList.remove("hidden");
}

function showFarmerForm() {
  hideAll();
  document.getElementById("farmerForm").classList.remove("hidden");
}

function showDashboard() {
  hideAll();
  document.getElementById("farmerDashboard").classList.remove("hidden");
}

// Logic Initialization
document.addEventListener("DOMContentLoaded", () => {
  
  // Explicit Navigation Events
  document.getElementById("continueFarmerBtn").addEventListener("click", showFarmerLogin);
  document.getElementById("navLoginBtn").addEventListener("click", showFarmerLogin);
  document.getElementById("loginSubmitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    showFarmerForm();
  });

  // Form Processing & Calculation Rule Engine
  const formElement = document.getElementById("capabilityForm");
  formElement.addEventListener("submit", (e) => {
    e.preventDefault();

    // Parse values from select dropdowns containing weights
    const agronomyScore = parseInt(document.getElementById("agronomySkill").value) || 0;
    const businessScore = parseInt(document.getElementById("businessSkill").value) || 0;
    const machineryScore = parseInt(document.getElementById("machinerySkill").value) || 0;
    const certScore = parseInt(document.getElementById("certificateType").value) || 0;

    // Summing components to generate final score out of 100 max points
    const finalScore = agronomyScore + businessScore + machineryScore + certScore;

    const scoreTextElement = document.getElementById("scoreValue");
    const tierBadgeElement = document.getElementById("tierValue");
    const descTextElement = document.getElementById("tierDescription");

    scoreTextElement.textContent = finalScore;
    
    tierBadgeElement.className = "tier-badge";

    // Alternative Credit Underwriting Allocation
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

    showDashboard();
  });
});
// =========================
// Popup Functions
// =========================
function openPopup(id) {
    const popup = document.getElementById(id);
    popup.style.display = "flex";

    setTimeout(() => {
        popup.classList.add("show");
    }, 10);
}

function closePopup(id) {
    const popup = document.getElementById(id);
    popup.classList.remove("show");

    setTimeout(() => {
        popup.style.display = "none";
    }, 300);
}

// Close popup when clicking outside
window.addEventListener("click", function(e) {
    document.querySelectorAll(".popup").forEach((popup) => {
        if (e.target === popup) {
            popup.classList.remove("show");

            setTimeout(() => {
                popup.style.display = "none";
            }, 300);
        }
    });
});