// ============================================================
// Smart Farmer Portal — Multi-Step Navigation & PostgreSQL Database Engine
// ============================================================

// Global user state
let currentUser = null;

// File Upload base64 caches
const fileCaches = {
  aadharPic: "",
  panPic: "",
  proofPics: [],
  insuranceDoc: "",
  landDocs: "",
  leaseDeed: "",
  certificates: [],
  salesReceipts: []
};

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
  resetFormWizard();
  scrollTop();
}

function showDashboard() {
  hideAll();
  document.getElementById("farmerDashboard").classList.remove("hidden");
  scrollTop();
}

// ---------- Form Wizard State Machine ----------
let currentStep = 1;
const totalSteps = 4;

function resetFormWizard() {
  currentStep = 1;
  updateWizardUI();
}

function updateWizardUI() {
  // Update Step Panes
  for (let i = 1; i <= totalSteps; i++) {
    const pane = document.getElementById(`stepPane${i}`);
    if (i === currentStep) {
      pane.classList.remove("hidden");
    } else {
      pane.classList.add("hidden");
    }

    // Update Stepper Indicators
    const indicator = document.getElementById(`stepIndicator${i}`);
    const line = document.getElementById(`stepLine${i}`);
    const numEl = indicator.querySelector(".step-num");
    const labelEl = indicator.querySelector(".step-label");

    if (i === currentStep) {
      indicator.style.opacity = "1";
      numEl.style.background = "#146c43";
      numEl.style.color = "white";
      labelEl.style.color = "#146c43";
    } else if (i < currentStep) {
      indicator.style.opacity = "1";
      numEl.style.background = "#198754";
      numEl.style.color = "white";
      labelEl.style.color = "#198754";
    } else {
      indicator.style.opacity = "0.5";
      numEl.style.background = "#cbd5e1";
      numEl.style.color = "#475569";
      labelEl.style.color = "#64748b";
    }

    // Colors of stepper lines
    if (line) {
      if (i < currentStep) {
        line.style.background = "#198754";
      } else {
        line.style.background = "#cbd5e1";
      }
    }
  }

  // Update Buttons
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  if (currentStep === 1) {
    prevBtn.classList.add("hidden");
  } else {
    prevBtn.classList.remove("hidden");
  }

  if (currentStep === totalSteps) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
  
  scrollTop();
}

// Validate inputs inside current step pane
function validateCurrentStep() {
  const currentPane = document.getElementById(`stepPane${currentStep}`);
  const inputs = currentPane.querySelectorAll("input[required], select[required]");
  
  for (let input of inputs) {
    // If input is inside a hidden wrapper, don't validate it
    let parent = input.parentElement;
    let isHidden = false;
    while (parent) {
      if (parent.classList.contains("hidden")) {
        isHidden = true;
        break;
      }
      parent = parent.parentElement;
    }
    
    if (isHidden) continue;

    if (!input.value.trim()) {
      input.reportValidity();
      return false;
    }
    
    // Pattern or min/max matching
    if (!input.checkValidity()) {
      input.reportValidity();
      return false;
    }
    
    // File inputs check
    if (input.type === "file" && input.files.length === 0) {
      // Check if we already have it in cache
      const cacheKey = input.id;
      if (!fileCaches[cacheKey] || (Array.isArray(fileCaches[cacheKey]) && fileCaches[cacheKey].length === 0)) {
        alert(`Please upload the required file: ${input.previousElementSibling ? input.previousElementSibling.textContent : "Document"}`);
        return false;
      }
    }
  }
  return true;
}

// Helper to convert File to Base64
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}

// ---------- Helpers ----------

// Animate the score counting up
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

// Personalized greeting line above the score
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
    ? " — as a tenant farmer, your leasing credibility and skill-based metrics bypass conventional collateral rules!"
    : " — as a verified landowner, your skill metrics fast-track you for optimum lending tiers.";
  greet.textContent = `Welcome, ${displayName}!${roleNote}`;
}

// Helper to render historic evaluations on the dashboard
function renderHistoryList(history) {
  let historyWrap = document.getElementById("evaluationHistory");
  if (!historyWrap) {
    historyWrap = document.createElement("div");
    historyWrap.id = "evaluationHistory";
    historyWrap.className = "dashboard-details";
    historyWrap.style.marginTop = "20px";
    const dashboardSection = document.getElementById("farmerDashboard");
    dashboardSection.appendChild(historyWrap);
  }

  if (!history || history.length === 0) {
    historyWrap.innerHTML = `<h3>Database Activity Log</h3><p style="color: #666; font-size: 13px;">No past profiles saved in database yet.</p>`;
    return;
  }

  historyWrap.innerHTML = `<h3>Your Database Profile History</h3>` + history.map((h, index) => `
    <div style="border-bottom: 1px solid #ddd; padding: 10px 0; display: flex; justify-content: space-between; align-items: center; font-size: 13px;">
      <div>
        <strong>${h.primaryCrop}</strong> (${h.landHolding} Acres)
        <br>
        <span style="color:#666; font-size:11px;">Saved: ${new Date(h.createdAt).toLocaleString()}</span>
      </div>
      <div style="text-align: right;">
        <span style="font-weight: 700; color: #198754;">Score: ${h.finalScore}</span>
        <br>
        <span style="font-size: 11px; background: #e2efe2; padding: 2px 6px; border-radius: 4px; display: inline-block; margin-top: 2px;">${h.tier.split(":")[0]}</span>
      </div>
    </div>
  `).join("");
}

// ---------- App Init ----------
document.addEventListener("DOMContentLoaded", () => {

  // Navigation events
  document.getElementById("continueFarmerBtn").addEventListener("click", showFarmerLogin);
  document.getElementById("navLoginBtn").addEventListener("click", showFarmerLogin);

  // Setup live conditional UI handlers
  
  // 1. Ownership conditional triggers
  const ownershipSelect = document.getElementById("ownershipType");
  const leaseDeedWrapper = document.getElementById("leaseDeedWrapper");
  const leaseDeedInput = document.getElementById("leaseDeed");
  const landDocsLabel = document.getElementById("landDocsLabel");

  ownershipSelect.addEventListener("change", () => {
    if (ownershipSelect.value === "lease") {
      leaseDeedWrapper.classList.remove("hidden");
      leaseDeedInput.setAttribute("required", "required");
      landDocsLabel.textContent = "Upload Land Records / Lease Owner Documents *";
    } else {
      leaseDeedWrapper.classList.add("hidden");
      leaseDeedInput.removeAttribute("required");
      landDocsLabel.textContent = "Upload Land Records (Khata/Fard/7-12) *";
    }
  });

  // 2. Loss Amount conditional triggers
  const isLossSelect = document.getElementById("isLossSelect");
  const lossAmountWrapper = document.getElementById("lossAmountWrapper");
  const lossAmountInput = document.getElementById("lossAmount");

  isLossSelect.addEventListener("change", () => {
    if (isLossSelect.value === "true") {
      lossAmountWrapper.classList.remove("hidden");
      lossAmountInput.setAttribute("required", "required");
    } else {
      lossAmountWrapper.classList.add("hidden");
      lossAmountInput.removeAttribute("required");
      lossAmountInput.value = "0";
    }
  });

  // 3. Insurance Doc conditional triggers
  const activeInsuranceSelect = document.getElementById("activeCropInsurance");
  const insuranceDocWrapper = document.getElementById("insuranceDocWrapper");
  const insuranceDocInput = document.getElementById("insuranceDoc");

  activeInsuranceSelect.addEventListener("change", () => {
    if (activeInsuranceSelect.value === "Yes") {
      insuranceDocWrapper.classList.remove("hidden");
      insuranceDocInput.setAttribute("required", "required");
    } else {
      insuranceDocWrapper.classList.add("hidden");
      insuranceDocInput.removeAttribute("required");
    }
  });

  // 4. File input base64 converters
  const setupFileBase64 = (inputId, cacheKey, isMultiple = false) => {
    const input = document.getElementById(inputId);
    input.addEventListener("change", async (e) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;
      
      try {
        if (isMultiple) {
          fileCaches[cacheKey] = [];
          for (let file of files) {
            const b64 = await fileToBase64(file);
            fileCaches[cacheKey].push(b64);
          }
        } else {
          fileCaches[cacheKey] = await fileToBase64(files[0]);
        }
      } catch (err) {
        console.error("File processing error:", err);
        alert("Failed to process file upload. Please choose a smaller image file.");
      }
    });
  };

  setupFileBase64("aadharPic", "aadharPic");
  setupFileBase64("panPic", "panPic");
  setupFileBase64("proofPics", "proofPics", true);
  setupFileBase64("insuranceDoc", "insuranceDoc");
  setupFileBase64("landDocs", "landDocs");
  setupFileBase64("leaseDeed", "leaseDeed");
  setupFileBase64("certificates", "certificates", true);
  setupFileBase64("salesReceipts", "salesReceipts", true);

  // Wizard Buttons handlers
  document.getElementById("prevBtn").addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep--;
      updateWizardUI();
    }
  });

  document.getElementById("nextBtn").addEventListener("click", () => {
    // Dynamic conditional check for Sales Receipts based on experience (Leaving step 2)
    if (currentStep === 2) {
      const experienceInput = document.getElementById("farmingExperience");
      const salesReceiptsWrapper = document.getElementById("salesReceiptsWrapper");
      const salesReceiptsInput = document.getElementById("salesReceipts");
      
      const years = parseInt(experienceInput.value) || 0;
      if (years <= 1) {
        // Beginner: Sales receipts NOT required!
        salesReceiptsWrapper.classList.add("hidden");
        salesReceiptsInput.removeAttribute("required");
      } else {
        // Experienced: Sales receipts are required!
        salesReceiptsWrapper.classList.remove("hidden");
        salesReceiptsInput.setAttribute("required", "required");
      }
    }

    if (validateCurrentStep()) {
      if (currentStep < totalSteps) {
        currentStep++;
        updateWizardUI();
      }
    }
  });

  // Handle Login submission
  document.getElementById("loginSubmitBtn").addEventListener("click", async (e) => {
    e.preventDefault();
    const usernameInput = document.getElementById("loginUsername");
    const passwordInput = document.getElementById("loginPassword");

    if (!usernameInput.value.trim() || !passwordInput.value.trim()) {
      alert("Please enter both Username and Password.");
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: usernameInput.value,
          password: passwordInput.value
        })
      });

      const result = await response.json();
      if (result.success) {
        currentUser = result.user;
        // Update login button in navbar
        const navLoginBtn = document.getElementById("navLoginBtn");
        navLoginBtn.textContent = `Logged in: ${currentUser.username}`;
        navLoginBtn.style.background = "#146c43";
        navLoginBtn.disabled = true;

        showFarmerForm();
      } else {
        alert(result.error || "Authentication failed.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      // Fallback local auth if server has issues
      currentUser = { id: 1, uid: "demo_user", username: usernameInput.value };
      showFarmerForm();
    }
  });

  // Capability form submission to Server API + Scoring engine
  const formElement = document.getElementById("capabilityForm");

  formElement.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateCurrentStep()) return;

    // Build pay-load
    const payload = {
      userId: currentUser ? currentUser.id : null,
      name: document.getElementById("fullName").value,
      age: document.getElementById("age").value,
      contactNum: document.getElementById("contactNumber").value,
      aadharNum: document.getElementById("aadharNumber").value,
      aadharPic: fileCaches.aadharPic,
      panNum: document.getElementById("panNumber").value,
      panPic: fileCaches.panPic,
      farmingExperience: document.getElementById("farmingExperience").value,
      landOwnerStatus: document.getElementById("ownershipType").value,
      cropDuration: document.getElementById("cropDuration").value,
      primaryCrop: document.getElementById("primaryCrop").value,
      landHolding: document.getElementById("landSize").value,
      irrigationMethod: document.getElementById("irrigationMethod").value,
      agronomySkill: document.getElementById("agronomySkill").value,
      businessSkill: document.getElementById("businessSkill").value,
      machinerySkill: document.getElementById("machinerySkill").value,
      pastInvestment: document.getElementById("pastInvestment").value,
      pastProfit: document.getElementById("pastProfit").value,
      isLoss: document.getElementById("isLossSelect").value,
      lossAmount: document.getElementById("lossAmount").value,
      proofPics: fileCaches.proofPics.join(","),
      landDocs: fileCaches.landDocs,
      leaseDeed: fileCaches.leaseDeed,
      certificates: fileCaches.certificates.join(","),
      activeCropInsurance: document.getElementById("activeCropInsurance").value,
      salesReceipts: fileCaches.salesReceipts.join(",")
    };

    const submitBtn = document.getElementById("submitBtn");
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Analyzing Credentials on Cloud Server...";
    submitBtn.disabled = true;

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;

      if (result.success) {
        const evalData = result.evaluation;
        
        const scoreTextElement = document.getElementById("scoreValue");
        const tierBadgeElement = document.getElementById("tierValue");
        const descTextElement = document.getElementById("tierDescription");

        // Animate count up
        animateScore(scoreTextElement, evalData.finalScore);

        tierBadgeElement.className = "tier-badge";

        if (evalData.finalScore >= 80) {
          tierBadgeElement.textContent = "Tier 1: Master Farmer";
          tierBadgeElement.classList.add("tier-1");
          descTextElement.textContent = "Excellent operational rating. Highly competent management traits verified. System recommends optimal loan limits with fast-track digital approval processing and minimum base interest rates.";
        } else if (evalData.finalScore >= 50) {
          tierBadgeElement.textContent = "Tier 2: Capable Farmer";
          tierBadgeElement.classList.add("tier-2");
          descTextElement.textContent = "Solid functional operations capabilities detected. Standard processing track approved. Tip: Complete verified micro-irrigation training or upload organic trade certifications to transition to Tier 1 terms.";
        } else {
          tierBadgeElement.textContent = "Tier 3: Developing Farmer";
          tierBadgeElement.classList.add("tier-3");
          descTextElement.textContent = "Baseline structural parameters limited. Recommended conditional loan approval linked directly with regional cooperative oversight or micro-credit safety streams.";
        }

        renderGreeting(evalData.name, evalData.landOwnerStatus);

        renderBreakdown([
          { label: "Crop Management & Agronomy", score: evalData.agronomySkill, max: 40 },
          { label: "Financial & Market Skill", score: evalData.businessSkill, max: 30 },
          { label: "Machinery & Tech Proficiency", score: evalData.machinerySkill, max: 20 },
          { label: "Verified Credentials", score: (evalData.certificates && evalData.certificates.length > 10) ? 10 : 0, max: 10 },
        ]);

        // Loan recommendations
        const recLoanLimit = document.getElementById("recLoanLimit");
        const recInterestRate = document.getElementById("recInterestRate");
        const recTenor = document.getElementById("recTenor");

        if (evalData.finalScore >= 80) {
          recLoanLimit.textContent = "₹3,50,000";
          recInterestRate.textContent = "4.0%";
          recTenor.textContent = "18 Months";
        } else if (evalData.finalScore >= 50) {
          recLoanLimit.textContent = "₹1,50,000";
          recInterestRate.textContent = "6.5%";
          recTenor.textContent = "12 Months";
        } else {
          recLoanLimit.textContent = "₹50,000";
          recInterestRate.textContent = "8.5%";
          recTenor.textContent = "6 Months";
        }

        // Retrieve and display user's historic evaluations from Cloud SQL Database
        if (currentUser) {
          try {
            const histResponse = await fetch(`/api/evaluations/${currentUser.id}`);
            const histData = await histResponse.json();
            if (histData.success) {
              renderHistoryList(histData.history);
            }
          } catch (histErr) {
            console.error("Could not fetch database logs:", histErr);
          }
        }

        showDashboard();
      } else {
        alert(result.error || "Failed to calculate capability index.");
      }
    } catch (err) {
      console.error("Evaluation request error:", err);
      alert("Failed to connect to Cloud Service. Check database initialization.");
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Print button
  document.getElementById("printReportBtn").addEventListener("click", () => {
    window.print();
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