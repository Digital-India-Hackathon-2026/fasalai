// script.js

// ---------- POPUP HANDLING (About / How / FAQ / Contact) ----------
function openPopup(id) {
  const popup = document.getElementById(id);
  if (popup) {
    popup.style.display = "block";
  }
}

function closePopup(id) {
  const popup = document.getElementById(id);
  if (popup) {
    popup.style.display = "none";
  }
}

// Close popup on outside click
window.addEventListener("click", (e) => {
  const popups = document.querySelectorAll(".popup");
  popups.forEach((popup) => {
    if (e.target === popup) {
      popup.style.display = "none";
    }
  });
});

// ---------- GENERAL VIEW TOGGLING ----------
const landingSection = document.getElementById("landing");
const loginSection = document.getElementById("farmerLogin");
const homeSection = document.getElementById("farmerHome");
const formSection = document.getElementById("farmerForm");
const dashboardSection = document.getElementById("farmerDashboard");

function showLanding() {
  landingSection.classList.remove("hidden");
  loginSection.classList.add("hidden");
  homeSection.classList.add("hidden");
  formSection.classList.add("hidden");
  dashboardSection.classList.add("hidden");
}

function showLogin() {
  landingSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
  homeSection.classList.add("hidden");
  formSection.classList.add("hidden");
  dashboardSection.classList.add("hidden");
}

function showHome() {
  landingSection.classList.add("hidden");
  loginSection.classList.add("hidden");
  homeSection.classList.remove("hidden");
  formSection.classList.add("hidden");
  dashboardSection.classList.add("hidden");
}

function showForm() {
  landingSection.classList.add("hidden");
  loginSection.classList.add("hidden");
  homeSection.classList.add("hidden");
  formSection.classList.remove("hidden");
  dashboardSection.classList.add("hidden");
}

function showDashboard() {
  landingSection.classList.add("hidden");
  loginSection.classList.add("hidden");
  homeSection.classList.add("hidden");
  formSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
}

// ---------- LOGIN LOGIC ----------
document.addEventListener("DOMContentLoaded", () => {
  const navLoginBtn = document.getElementById("navLoginBtn");
  const continueFarmerBtn = document.getElementById("continueFarmerBtn");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  const loginUsernameInput = document.getElementById("loginUsername");
  const loginPasswordInput = document.getElementById("loginPassword");
  const homeWelcomeText = document.getElementById("homeWelcomeText");
  const dropdownUserLine = document.getElementById("dropdownUserLine");

  navLoginBtn.addEventListener("click", showLogin);
  continueFarmerBtn.addEventListener("click", showLogin);

  loginSubmitBtn.addEventListener("click", () => {
    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    // Demo credentials from your HTML
    if (username === "9876543210" && password === "password") {
      showHome();
      homeWelcomeText.textContent = "Welcome back, Demo Farmer!";
      dropdownUserLine.textContent = "Logged in: " + username;
    } else {
      alert("Invalid credentials. Use 9876543210 / password for demo.");
    }
  });

  // ---------- PROFILE DROPDOWN ----------
  const profileIconBtn = document.getElementById("profileIconBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const menuPersonalDetails = document.getElementById("menuPersonalDetails");
  const menuSettings = document.getElementById("menuSettings");
  const menuHelp = document.getElementById("menuHelp");
  const menuLogout = document.getElementById("menuLogout");

  profileIconBtn.addEventListener("click", () => {
    profileDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (
      !profileDropdown.contains(e.target) &&
      e.target !== profileIconBtn
    ) {
      profileDropdown.classList.add("hidden");
    }
  });

  menuLogout.addEventListener("click", () => {
    showLanding();
    profileDropdown.classList.add("hidden");
  });

  // ---------- DASHBOARD PANELS ----------
  const homeMainContent = document.getElementById("homeMainContent");
  const personalDetailsView = document.getElementById("personalDetailsView");
  const personalDetailsForm = document.getElementById("personalDetailsForm");
  const settingsPanel = document.getElementById("settingsPanel");
  const helpPanel = document.getElementById("helpPanel");
  const searchPanel = document.getElementById("searchPanel");

  const qaPersonalDetails = document.getElementById("qaPersonalDetails");
  const qaAssessment = document.getElementById("qaAssessment");
  const qaSearchOther = document.getElementById("qaSearchOther");
  const goToAssessmentBtn = document.getElementById("goToAssessmentBtn");

  const backFromDetailsViewBtn = document.getElementById("backFromDetailsViewBtn");
  const cancelPersonalDetailsBtn = document.getElementById("cancelPersonalDetailsBtn");
  const editPersonalDetailsBtn = document.getElementById("editPersonalDetailsBtn");
  const backFromSettingsBtn = document.getElementById("backFromSettingsBtn");
  const backFromHelpBtn = document.getElementById("backFromHelpBtn");

  const menuPersonalDetailsBtn = document.getElementById("menuPersonalDetails");
  const menuSettingsBtn = document.getElementById("menuSettings");
  const menuHelpBtn = document.getElementById("menuHelp");

  function showDashboardMain() {
    homeMainContent.classList.remove("hidden");
    personalDetailsView.classList.add("hidden");
    personalDetailsForm.classList.add("hidden");
    settingsPanel.classList.add("hidden");
    helpPanel.classList.add("hidden");
    searchPanel.classList.add("hidden");
  }

  // From top menu
  menuPersonalDetailsBtn.addEventListener("click", () => {
    profileDropdown.classList.add("hidden");
    homeMainContent.classList.add("hidden");
    personalDetailsView.classList.remove("hidden");
  });

  menuSettingsBtn.addEventListener("click", () => {
    profileDropdown.classList.add("hidden");
    homeMainContent.classList.add("hidden");
    settingsPanel.classList.remove("hidden");
  });

  menuHelpBtn.addEventListener("click", () => {
    profileDropdown.classList.add("hidden");
    homeMainContent.classList.add("hidden");
    helpPanel.classList.remove("hidden");
  });

  // From quick actions
  qaPersonalDetails.addEventListener("click", () => {
    homeMainContent.classList.add("hidden");
    personalDetailsView.classList.remove("hidden");
  });

  qaAssessment.addEventListener("click", () => {
    showForm();
  });

  qaSearchOther.addEventListener("click", () => {
    homeMainContent.classList.add("hidden");
    searchPanel.classList.remove("hidden");
  });

  goToAssessmentBtn.addEventListener("click", () => {
    showForm();
  });

  backFromDetailsViewBtn.addEventListener("click", showDashboardMain);
  cancelPersonalDetailsBtn.addEventListener("click", showDashboardMain);
  backFromSettingsBtn.addEventListener("click", showDashboardMain);
  backFromHelpBtn.addEventListener("click", showDashboardMain);

  editPersonalDetailsBtn.addEventListener("click", () => {
    personalDetailsView.classList.add("hidden");
    personalDetailsForm.classList.remove("hidden");
  });

  // ---------- PERSONAL DETAILS SAVE / DISPLAY ----------
  const savePersonalDetailsBtn = document.getElementById("savePersonalDetailsBtn");
  const personalDetailsDisplay = document.getElementById("personalDetailsDisplay");

  const pdFullName = document.getElementById("pdFullName");
  const pdAge = document.getElementById("pdAge");
  const pdMobile = document.getElementById("pdMobile");
  const pdEmail = document.getElementById("pdEmail");
  const pdAddress = document.getElementById("pdAddress");
  const pdVillage = document.getElementById("pdVillage");
  const pdState = document.getElementById("pdState");

  savePersonalDetailsBtn.addEventListener("click", () => {
    const details = {
      fullName: pdFullName.value.trim(),
      age: pdAge.value.trim(),
      mobile: pdMobile.value.trim(),
      email: pdEmail.value.trim(),
      address: pdAddress.value.trim(),
      village: pdVillage.value.trim(),
      state: pdState.value.trim(),
    };

    if (!details.fullName || !details.age || !details.mobile || !details.address || !details.village || !details.state) {
      alert("Please fill all required (*) fields.");
      return;
    }

    // Simple display of saved details
    personalDetailsDisplay.innerHTML = `
      <div class="detail-item"><span class="detail-label">Name</span><span class="detail-value">${details.fullName}</span></div>
      <div class="detail-item"><span class="detail-label">Age</span><span class="detail-value">${details.age}</span></div>
      <div class="detail-item"><span class="detail-label">Mobile</span><span class="detail-value">${details.mobile}</span></div>
      <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${details.email || "-"}</span></div>
      <div class="detail-item"><span class="detail-label">Address</span><span class="detail-value">${details.address}</span></div>
      <div class="detail-item"><span class="detail-label">Village / Town</span><span class="detail-value">${details.village}</span></div>
      <div class="detail-item"><span class="detail-label">State</span><span class="detail-value">${details.state}</span></div>
    `;

    personalDetailsForm.classList.add("hidden");
    personalDetailsView.classList.remove("hidden");
  });

  // ---------- SEARCH OTHER FARMERS (DEMO) ----------
  const searchIconBtn = document.getElementById("searchIconBtn");
  const closeSearchBtn = document.getElementById("closeSearchBtn");
  const farmerSearchInput = document.getElementById("farmerSearchInput");
  const searchResults = document.getElementById("searchResults");

  const demoFarmers = [
    { name: "Ramesh", village: "Nalgonda", crop: "Paddy", score: 72 },
    { name: "Sita", village: "Warangal", crop: "Cotton", score: 65 },
    { name: "Mahesh", village: "Karimnagar", crop: "Maize", score: 80 },
  ];

  searchIconBtn.addEventListener("click", () => {
    homeMainContent.classList.add("hidden");
    searchPanel.classList.remove("hidden");
  });

  closeSearchBtn.addEventListener("click", () => {
    showDashboardMain();
  });

  farmerSearchInput.addEventListener("input", () => {
    const q = farmerSearchInput.value.toLowerCase();
    const filtered = demoFarmers.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.village.toLowerCase().includes(q) ||
        f.crop.toLowerCase().includes(q)
    );

    if (!q) {
      searchResults.innerHTML =
        "<p style='padding: 8px; color:#666;'>Type to search farmer records.</p>";
      return;
    }

    if (filtered.length === 0) {
      searchResults.innerHTML =
        "<p style='padding: 8px; color:#666;'>No matching farmers found.</p>";
      return;
    }

    searchResults.innerHTML = filtered
      .map(
        (f) =>
          `<div class="search-row">
            <strong>${f.name}</strong> – ${f.village} – ${f.crop} – Capability Score: ${f.score}
          </div>`
      )
      .join("");
  });

  // ---------- MULTI-STEP CAPABILITY FORM WIZARD ----------
  const capabilityForm = document.getElementById("capabilityForm");
  const stepPane1 = document.getElementById("stepPane1");
  const stepPane2 = document.getElementById("stepPane2");
  const stepPane3 = document.getElementById("stepPane3");
  const stepPane4 = document.getElementById("stepPane4");

  const stepIndicator1 = document.getElementById("stepIndicator1");
  const stepIndicator2 = document.getElementById("stepIndicator2");
  const stepIndicator3 = document.getElementById("stepIndicator3");
  const stepIndicator4 = document.getElementById("stepIndicator4");
  const stepLine1 = document.getElementById("stepLine1");
  const stepLine2 = document.getElementById("stepLine2");
  const stepLine3 = document.getElementById("stepLine3");

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");

  let currentStep = 1;

  function updateStepView() {
    // Pane visibility
    stepPane1.classList.toggle("hidden", currentStep !== 1);
    stepPane2.classList.toggle("hidden", currentStep !== 2);
    stepPane3.classList.toggle("hidden", currentStep !== 3);
    stepPane4.classList.toggle("hidden", currentStep !== 4);

    // Stepper styles
    const activeColor = "#146c43";
    const inactiveColor = "#cbd5e1";

    [stepIndicator1, stepIndicator2, stepIndicator3, stepIndicator4].forEach(
      (indicator, index) => {
        const stepNum = indicator.querySelector(".step-num");
        const stepLabel = indicator.querySelector(".step-label");
        const stepIndex = index + 1;
        if (stepIndex <= currentStep) {
          indicator.style.opacity = "1";
          stepNum.style.background = activeColor;
          stepNum.style.color = "#ffffff";
          stepLabel.style.color = activeColor;
        } else {
          indicator.style.opacity = "0.5";
          stepNum.style.background = inactiveColor;
          stepNum.style.color = "#475569";
          stepLabel.style.color = "#64748b";
        }
      }
    );

    [stepLine1, stepLine2, stepLine3].forEach((line, index) => {
      line.style.background =
        currentStep > index + 1 ? activeColor : "#cbd5e1";
    });

    // Buttons
    if (currentStep === 1) {
      prevBtn.classList.add("hidden");
      nextBtn.classList.remove("hidden");
      submitBtn.classList.add("hidden");
      nextBtn.textContent = "Next Step";
    } else if (currentStep === 4) {
      prevBtn.classList.remove("hidden");
      nextBtn.classList.add("hidden");
      submitBtn.classList.remove("hidden");
    } else {
      prevBtn.classList.remove("hidden");
      nextBtn.classList.remove("hidden");
      submitBtn.classList.add("hidden");
      nextBtn.textContent = "Next Step";
    }
  }

  function validateCurrentStep() {
    // Simple required validation per step
    let valid = true;

    if (currentStep === 1) {
      const requiredIds = [
        "fullName",
        "age",
        "contactNumber",
        "aadharNumber",
        "aadharPic",
        "panNumber",
        "panPic",
      ];
      requiredIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el.value || (el.type === "file" && el.files.length === 0)) {
          el.classList.add("input-error");
          valid = false;
        } else {
          el.classList.remove("input-error");
        }
      });
    }

    if (currentStep === 2) {
      const requiredIds = [
        "farmingExperience",
        "ownershipType",
        "cropDuration",
        "primaryCrop",
        "landSize",
        "irrigationMethod",
      ];
      requiredIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el.value) {
          el.classList.add("input-error");
          valid = false;
        } else {
          el.classList.remove("input-error");
        }
      });
    }

    if (currentStep === 3) {
      const requiredIds = [
        "agronomySkill",
        "businessSkill",
        "machinerySkill",
        "pastInvestment",
        "pastProfit",
        "isLossSelect",
        "proofPics",
      ];
      requiredIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el.value || (el.type === "file" && el.files.length === 0)) {
          el.classList.add("input-error");
          valid = false;
        } else {
          el.classList.remove("input-error");
        }
      });

      const isLoss = document.getElementById("isLossSelect").value === "true";
      if (isLoss) {
        const lossAmountInput = document.getElementById("lossAmount");
        if (!lossAmountInput.value) {
          lossAmountInput.classList.add("input-error");
          valid = false;
        } else {
          lossAmountInput.classList.remove("input-error");
        }
      }
    }

    if (currentStep === 4) {
      const requiredIds = ["activeCropInsurance", "landDocs", "salesReceipts"];
      const activeCropInsurance = document.getElementById("activeCropInsurance").value;
      const insuranceDocWrapper = document.getElementById("insuranceDocWrapper");
      const insuranceDoc = document.getElementById("insuranceDoc");
      const ownershipType = document.getElementById("ownershipType").value;
      const leaseDeedWrapper = document.getElementById("leaseDeedWrapper");
      const leaseDeed = document.getElementById("leaseDeed");
      const farmingExperience = parseFloat(
        document.getElementById("farmingExperience").value || "0"
      );

      // Base required
      requiredIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el.value || (el.type === "file" && el.files.length === 0)) {
          el.classList.add("input-error");
          valid = false;
        } else {
          el.classList.remove("input-error");
        }
      });

      // Conditional crop insurance doc
      if (activeCropInsurance === "Yes") {
        insuranceDocWrapper.classList.remove("hidden");
        if (!insuranceDoc.files.length) {
          insuranceDoc.classList.add("input-error");
          valid = false;
        } else {
          insuranceDoc.classList.remove("input-error");
        }
      } else {
        insuranceDocWrapper.classList.add("hidden");
      }

      // Conditional lease deed
      if (ownershipType === "lease") {
        leaseDeedWrapper.classList.remove("hidden");
        if (!leaseDeed.files.length) {
          leaseDeed.classList.add("input-error");
          valid = false;
        } else {
          leaseDeed.classList.remove("input-error");
        }
      } else {
        leaseDeedWrapper.classList.add("hidden");
      }

      // Sales receipts required only if experience > 1 year
      const salesReceiptsWrapper = document.getElementById("salesReceiptsWrapper");
      const salesReceipts = document.getElementById("salesReceipts");
      if (farmingExperience > 1) {
        salesReceiptsWrapper.classList.remove("hidden");
        if (!salesReceipts.files.length) {
          salesReceipts.classList.add("input-error");
          valid = false;
        } else {
          salesReceipts.classList.remove("input-error");
        }
      } else {
        salesReceiptsWrapper.classList.add("hidden");
      }
    }

    if (!valid) {
      alert("Please fill all required fields in this step.");
    }

    return valid;
  }

  prevBtn.addEventListener("click", () => {
    if (currentStep > 1) {
      currentStep -= 1;
      updateStepView();
    }
  });

  nextBtn.addEventListener("click", () => {
    if (!validateCurrentStep()) return;
    if (currentStep < 4) {
      currentStep += 1;
      updateStepView();
    }
  });

  // Show / hide loss amount field when user selects loss
  const isLossSelect = document.getElementById("isLossSelect");
  const lossAmountWrapper = document.getElementById("lossAmountWrapper");

  isLossSelect.addEventListener("change", () => {
    if (isLossSelect.value === "true") {
      lossAmountWrapper.classList.remove("hidden");
    } else {
      lossAmountWrapper.classList.add("hidden");
    }
  });

  // Show / hide insurance / lease / receipts based on user inputs (live)
  const activeCropInsuranceSelect = document.getElementById("activeCropInsurance");
  const insuranceDocWrapper = document.getElementById("insuranceDocWrapper");
  const ownershipTypeSelect = document.getElementById("ownershipType");
  const leaseDeedWrapper = document.getElementById("leaseDeedWrapper");
  const farmingExperienceInput = document.getElementById("farmingExperience");
  const salesReceiptsWrapper = document.getElementById("salesReceiptsWrapper");

  activeCropInsuranceSelect.addEventListener("change", () => {
    if (activeCropInsuranceSelect.value === "Yes") {
      insuranceDocWrapper.classList.remove("hidden");
    } else {
      insuranceDocWrapper.classList.add("hidden");
    }
  });

  ownershipTypeSelect.addEventListener("change", () => {
    if (ownershipTypeSelect.value === "lease") {
      leaseDeedWrapper.classList.remove("hidden");
    } else {
      leaseDeedWrapper.classList.add("hidden");
    }
  });

  farmingExperienceInput.addEventListener("input", () => {
    const val = parseFloat(farmingExperienceInput.value || "0");
    if (val > 1) {
      salesReceiptsWrapper.classList.remove("hidden");
    } else {
      salesReceiptsWrapper.classList.add("hidden");
    }
  });

  updateStepView(); // initialize wizard UI

  // ---------- CAPABILITY SCORE CALCULATION ----------
  const scoreValueEl = document.getElementById("scoreValue");
  const tierValueEl = document.getElementById("tierValue");
  const tierDescriptionEl = document.getElementById("tierDescription");
  const recLoanLimitEl = document.getElementById("recLoanLimit");
  const recInterestRateEl = document.getElementById("recInterestRate");
  const recTenorEl = document.getElementById("recTenor");
  const printReportBtn = document.getElementById("printReportBtn");

  capabilityForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!validateCurrentStep()) return;

    // Skills scores
    const agronomyScore = parseFloat(
      document.getElementById("agronomySkill").value || "0"
    );
    const businessScore = parseFloat(
      document.getElementById("businessSkill").value || "0"
    );
    const machineryScore = parseFloat(
      document.getElementById("machinerySkill").value || "0"
    );

    // Experience & finance
    const farmingExperience = parseFloat(
      document.getElementById("farmingExperience").value || "0"
    );
    const pastInvestment = parseFloat(
      document.getElementById("pastInvestment").value || "0"
    );
    const pastProfit = parseFloat(
      document.getElementById("pastProfit").value || "0"
    );
    const isLoss = document.getElementById("isLossSelect").value === "true";
    const lossAmount = parseFloat(
      document.getElementById("lossAmount").value || "0"
    );
    const ownershipType = document.getElementById("ownershipType").value;
    const activeCropInsurance = document.getElementById("activeCropInsurance").value;
    const landSize = parseFloat(
      document.getElementById("landSize").value || "0"
    );
    const irrigationMethod = document.getElementById("irrigationMethod").value;

    // Base skill score
    let capabilityScore =
      agronomyScore + businessScore + machineryScore; // max 90

    // Experience weight (up to +10)
    capabilityScore += Math.min(farmingExperience, 10);

    // Profitability adjustment (normalized)
    const profitFactor =
      pastInvestment > 0 ? Math.min(pastProfit / pastInvestment, 1.5) : 0;
    capabilityScore += profitFactor * 5; // up to +7.5

    // Loss penalty
    if (isLoss && lossAmount > 0) {
      const lossFactor =
        pastInvestment > 0 ? Math.min(lossAmount / pastInvestment, 1.5) : 1;
      capabilityScore -= lossFactor * 3; // up to -4.5
    }

    // Ownership bonus
    if (ownershipType === "owner") {
      capabilityScore += 5;
    } else if (ownershipType === "lease") {
      capabilityScore += 2;
    }

    // Insurance bonus
    if (activeCropInsurance === "Yes") {
      capabilityScore += 3;
    }

    // Irrigation reliability
    if (irrigationMethod === "Micro-irrigation") {
      capabilityScore += 4;
    } else if (irrigationMethod === "Borewell" || irrigationMethod === "Canal") {
      capabilityScore += 3;
    } else if (irrigationMethod === "Rainfed") {
      capabilityScore += 0; // no bonus
    }

    // Land size scaling (but capped)
    const landFactor = Math.min(landSize, 10) * 0.8; // up to +8
    capabilityScore += landFactor;

    // Clamp score 0–100
    capabilityScore = Math.max(0, Math.min(100, capabilityScore));

    // Tier mapping
    let tier = "";
    let description = "";
    let loanLimit = 0;
    let interestRate = 0;
    let tenorMonths = 0;

    if (capabilityScore >= 80) {
      tier = "Tier A – High Capability";
      description =
        "Farmer demonstrates strong agronomy, financial planning, and reliable evidence. Suitable for higher loan limits with preferred interest rates.";
      loanLimit =
        Math.round((pastInvestment + pastProfit + landSize * 50000) / 10000) *
        10000;
      interestRate = 10.5;
      tenorMonths = 36;
    } else if (capabilityScore >= 60) {
      tier = "Tier B – Moderate Capability";
      description =
        "Farmer shows consistent operations with reasonable skills and documentation, eligible for standard loan programs.";
      loanLimit =
        Math.round((pastInvestment + landSize * 30000) / 10000) * 10000;
      interestRate = 12.0;
      tenorMonths = 24;
    } else if (capabilityScore >= 40) {
      tier = "Tier C – Emerging Capability";
      description =
        "Farmer has basic skills and limited records. Recommend smaller ticket loans and closer monitoring.";
      loanLimit =
        Math.round((pastInvestment + landSize * 15000) / 10000) * 10000;
      interestRate = 13.5;
      tenorMonths = 18;
    } else {
      tier = "Tier D – High Risk / Support Required";
      description =
        "Current evidence suggests higher risk or inexperienced operations. Recommend capacity building and small working‑capital support only.";
      loanLimit =
        Math.round((pastInvestment + landSize * 8000) / 10000) * 10000;
      interestRate = 15.0;
      tenorMonths = 12;
    }

    // Update dashboard
    scoreValueEl.textContent = capabilityScore.toFixed(1);
    tierValueEl.textContent = tier;
    tierDescriptionEl.textContent = description;
    recLoanLimitEl.textContent = "₹" + loanLimit.toLocaleString("en-IN");
    recInterestRateEl.textContent = interestRate.toFixed(1) + "%";
    recTenorEl.textContent = tenorMonths + " Months";

    showDashboard();
  });

  // Print report
  printReportBtn.addEventListener("click", () => {
    window.print();
  });
});