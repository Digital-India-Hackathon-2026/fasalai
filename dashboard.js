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
  window.location.href = "index.html";
}

function showLogin() {
  if (landingSection) {
    landingSection.classList.add("hidden");
  }
  if (loginSection) {
    loginSection.classList.remove("hidden");
  }
  if (homeSection) {
    homeSection.classList.add("hidden");
  }
  if (formSection) {
    formSection.classList.add("hidden");
  }
  if (dashboardSection) {
    dashboardSection.classList.add("hidden");
  }
}

function showHome() {
  if (landingSection) {
    landingSection.classList.add("hidden");
  }
  if (loginSection) {
    loginSection.classList.add("hidden");
  }
  if (homeSection) {
    homeSection.classList.remove("hidden");
  }
  if (formSection) {
    formSection.classList.add("hidden");
  }
  if (dashboardSection) {
    dashboardSection.classList.add("hidden");
  }
}

function showForm() {
  if (landingSection) {
    landingSection.classList.add("hidden");
  }
  if (loginSection) {
    loginSection.classList.add("hidden");
  }
  if (homeSection) {
    homeSection.classList.add("hidden");
  }
  if (formSection) {
    formSection.classList.remove("hidden");
  }
  if (dashboardSection) {
    dashboardSection.classList.add("hidden");
  }
}

function showDashboard() {
  if (landingSection) {
    landingSection.classList.add("hidden");
  }
  if (loginSection) {
    loginSection.classList.add("hidden");
  }
  if (homeSection) {
    homeSection.classList.add("hidden");
  }
  if (formSection) {
    formSection.classList.add("hidden");
  }
  if (dashboardSection) {
    dashboardSection.classList.remove("hidden");
  }
}

// ---------- LOGIN LOGIC ----------
document.addEventListener("DOMContentLoaded", () => {
  const authenticated = sessionStorage.getItem("farmerAuthenticated") === "true";
  if (!authenticated) {
    window.location.href = "login.html";
    return;
  }

  const navLoginBtn = document.getElementById("navLoginBtn");
  const continueFarmerBtn = document.getElementById("continueFarmerBtn");
  const loginSubmitBtn = document.getElementById("loginSubmitBtn");
  const loginUsernameInput = document.getElementById("loginUsername");
  const loginPasswordInput = document.getElementById("loginPassword");
  const homeWelcomeText = document.getElementById("homeWelcomeText");
  const dropdownUserLine = document.getElementById("dropdownUserLine");
  const logoutBtn = document.getElementById("logoutBtn");

  if (navLoginBtn) {
    navLoginBtn.addEventListener("click", showLanding);
  }

  if (continueFarmerBtn) {
    continueFarmerBtn.addEventListener("click", showLanding);
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("farmerAuthenticated");
      sessionStorage.removeItem("farmerUsername");
      window.location.href = "index.html";
    });
  }

  if (loginSubmitBtn && loginUsernameInput && loginPasswordInput) {
    loginSubmitBtn.addEventListener("click", () => {
      const username = loginUsernameInput.value.trim();
      const password = loginPasswordInput.value.trim();

      if (username === "9876543210" && password === "password") {
        sessionStorage.setItem("farmerAuthenticated", "true");
        sessionStorage.setItem("farmerUsername", username);
        showHome();
        if (homeWelcomeText) {
          homeWelcomeText.textContent = "Welcome back, Demo Farmer!";
        }
        if (dropdownUserLine) {
          dropdownUserLine.textContent = "Logged in: " + username;
        }
      } else {
        alert("Invalid credentials. Use 9876543210 / password for demo.");
      }
    });
  }

  showHome();
  if (homeWelcomeText) {
    homeWelcomeText.textContent = "Welcome back, Demo Farmer!";
  }
  if (dropdownUserLine) {
    dropdownUserLine.textContent = "Logged in: " + sessionStorage.getItem("farmerUsername") || "9876543210";
  }

  // ---------- PROFILE DROPDOWN ----------
  const profileIconBtn = document.getElementById("profileIconBtn");
  const profileDropdown = document.getElementById("profileDropdown");
  const menuPersonalDetails = document.getElementById("menuPersonalDetails");
  const menuSettings = document.getElementById("menuSettings");
  const menuHelp = document.getElementById("menuHelp");
  const menuLogout = document.getElementById("menuLogout");

  if (profileIconBtn && profileDropdown) {
    profileIconBtn.addEventListener("click", () => {
      profileDropdown.classList.toggle("hidden");
    });

    document.addEventListener("click", (e) => {
      if (!profileDropdown.contains(e.target) && e.target !== profileIconBtn) {
        profileDropdown.classList.add("hidden");
      }
    });
  }

  if (menuLogout) {
    menuLogout.addEventListener("click", () => {
      sessionStorage.removeItem("farmerAuthenticated");
      sessionStorage.removeItem("farmerUsername");
      window.location.href = "index.html";
    });
  }

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
    if (homeMainContent) {
      homeMainContent.classList.remove("hidden");
    }
    if (personalDetailsView) {
      personalDetailsView.classList.add("hidden");
    }
    if (personalDetailsForm) {
      personalDetailsForm.classList.add("hidden");
    }
    if (settingsPanel) {
      settingsPanel.classList.add("hidden");
    }
    if (helpPanel) {
      helpPanel.classList.add("hidden");
    }
    if (searchPanel) {
      searchPanel.classList.add("hidden");
    }
  }

  if (menuPersonalDetailsBtn) {
    menuPersonalDetailsBtn.addEventListener("click", () => {
      if (profileDropdown) profileDropdown.classList.add("hidden");
      if (homeMainContent) homeMainContent.classList.add("hidden");
      if (personalDetailsView) personalDetailsView.classList.remove("hidden");
    });
  }

  if (menuSettingsBtn) {
    menuSettingsBtn.addEventListener("click", () => {
      if (profileDropdown) profileDropdown.classList.add("hidden");
      if (homeMainContent) homeMainContent.classList.add("hidden");
      if (settingsPanel) settingsPanel.classList.remove("hidden");
    });
  }

  if (menuHelpBtn) {
    menuHelpBtn.addEventListener("click", () => {
      if (profileDropdown) profileDropdown.classList.add("hidden");
      if (homeMainContent) homeMainContent.classList.add("hidden");
      if (helpPanel) helpPanel.classList.remove("hidden");
    });
  }

  if (qaPersonalDetails) {
    qaPersonalDetails.addEventListener("click", () => {
      if (homeMainContent) homeMainContent.classList.add("hidden");
      if (personalDetailsView) personalDetailsView.classList.remove("hidden");
    });
  }

  if (qaAssessment) {
    qaAssessment.addEventListener("click", () => {
      showForm();
    });
  }

  if (qaSearchOther) {
    qaSearchOther.addEventListener("click", () => {
      if (homeMainContent) homeMainContent.classList.add("hidden");
      if (searchPanel) searchPanel.classList.remove("hidden");
    });
  }

  if (goToAssessmentBtn) {
    goToAssessmentBtn.addEventListener("click", () => {
      showForm();
    });
  }

  if (backFromDetailsViewBtn) {
    backFromDetailsViewBtn.addEventListener("click", showDashboardMain);
  }
  if (cancelPersonalDetailsBtn) {
    cancelPersonalDetailsBtn.addEventListener("click", showDashboardMain);
  }
  if (backFromSettingsBtn) {
    backFromSettingsBtn.addEventListener("click", showDashboardMain);
  }
  if (backFromHelpBtn) {
    backFromHelpBtn.addEventListener("click", showDashboardMain);
  }

  if (editPersonalDetailsBtn) {
    editPersonalDetailsBtn.addEventListener("click", () => {
      if (personalDetailsView) personalDetailsView.classList.add("hidden");
      if (personalDetailsForm) personalDetailsForm.classList.remove("hidden");
    });
  }

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

  if (savePersonalDetailsBtn && personalDetailsDisplay) {
    savePersonalDetailsBtn.addEventListener("click", () => {
      const details = {
        fullName: pdFullName ? pdFullName.value.trim() : "",
        age: pdAge ? pdAge.value.trim() : "",
        mobile: pdMobile ? pdMobile.value.trim() : "",
        email: pdEmail ? pdEmail.value.trim() : "",
        address: pdAddress ? pdAddress.value.trim() : "",
        village: pdVillage ? pdVillage.value.trim() : "",
        state: pdState ? pdState.value.trim() : "",
      };

      if (!details.fullName || !details.age || !details.mobile || !details.address || !details.village || !details.state) {
        alert("Please fill all required (*) fields.");
        return;
      }

      personalDetailsDisplay.innerHTML = `
        <div class="detail-item"><span class="detail-label">Name</span><span class="detail-value">${details.fullName}</span></div>
        <div class="detail-item"><span class="detail-label">Age</span><span class="detail-value">${details.age}</span></div>
        <div class="detail-item"><span class="detail-label">Mobile</span><span class="detail-value">${details.mobile}</span></div>
        <div class="detail-item"><span class="detail-label">Email</span><span class="detail-value">${details.email || "-"}</span></div>
        <div class="detail-item"><span class="detail-label">Address</span><span class="detail-value">${details.address}</span></div>
        <div class="detail-item"><span class="detail-label">Village / Town</span><span class="detail-value">${details.village}</span></div>
        <div class="detail-item"><span class="detail-label">State</span><span class="detail-value">${details.state}</span></div>
      `;

      if (personalDetailsForm) personalDetailsForm.classList.add("hidden");
      if (personalDetailsView) personalDetailsView.classList.remove("hidden");
    });
  }

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

  if (searchIconBtn) {
    searchIconBtn.addEventListener("click", () => {
      if (homeMainContent) homeMainContent.classList.add("hidden");
      if (searchPanel) searchPanel.classList.remove("hidden");
    });
  }

  if (closeSearchBtn) {
    closeSearchBtn.addEventListener("click", () => {
      showDashboardMain();
    });
  }

  if (farmerSearchInput) {
    farmerSearchInput.addEventListener("input", () => {
      const q = farmerSearchInput.value.toLowerCase();
      const filtered = demoFarmers.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.village.toLowerCase().includes(q) ||
          f.crop.toLowerCase().includes(q)
      );

      if (!q) {
        if (searchResults) {
          searchResults.innerHTML = "<p style='padding: 8px; color:#666;'>Type to search farmer records.</p>";
        }
        return;
      }

      if (filtered.length === 0) {
        if (searchResults) {
          searchResults.innerHTML = "<p style='padding: 8px; color:#666;'>No matching farmers found.</p>";
        }
        return;
      }

      if (searchResults) {
        searchResults.innerHTML = filtered
          .map(
            (f) =>
              `<div class="search-row">
                <strong>${f.name}</strong> – ${f.village} – ${f.crop} – Capability Score: ${f.score}
              </div>`
          )
          .join("");
      }
    });
  }

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
    if (stepPane1) stepPane1.classList.toggle("hidden", currentStep !== 1);
    if (stepPane2) stepPane2.classList.toggle("hidden", currentStep !== 2);
    if (stepPane3) stepPane3.classList.toggle("hidden", currentStep !== 3);
    if (stepPane4) stepPane4.classList.toggle("hidden", currentStep !== 4);

    const activeColor = "#146c43";
    const inactiveColor = "#cbd5e1";

    [stepIndicator1, stepIndicator2, stepIndicator3, stepIndicator4].forEach(
      (indicator, index) => {
        if (!indicator) return;
        const stepNum = indicator.querySelector(".step-num");
        const stepLabel = indicator.querySelector(".step-label");
        const stepIndex = index + 1;
        if (stepIndex <= currentStep) {
          indicator.style.opacity = "1";
          if (stepNum) {
            stepNum.style.background = activeColor;
            stepNum.style.color = "#ffffff";
          }
          if (stepLabel) {
            stepLabel.style.color = activeColor;
          }
        } else {
          indicator.style.opacity = "0.5";
          if (stepNum) {
            stepNum.style.background = inactiveColor;
            stepNum.style.color = "#475569";
          }
          if (stepLabel) {
            stepLabel.style.color = "#64748b";
          }
        }
      }
    );

    [stepLine1, stepLine2, stepLine3].forEach((line, index) => {
      if (line) {
        line.style.background = currentStep > index + 1 ? activeColor : "#cbd5e1";
      }
    });

    if (currentStep === 1) {
      if (prevBtn) prevBtn.classList.add("hidden");
      if (nextBtn) {
        nextBtn.classList.remove("hidden");
        nextBtn.textContent = "Next Step";
      }
      if (submitBtn) submitBtn.classList.add("hidden");
    } else if (currentStep === 4) {
      if (prevBtn) prevBtn.classList.remove("hidden");
      if (nextBtn) nextBtn.classList.add("hidden");
      if (submitBtn) submitBtn.classList.remove("hidden");
    } else {
      if (prevBtn) prevBtn.classList.remove("hidden");
      if (nextBtn) nextBtn.classList.remove("hidden");
      if (submitBtn) submitBtn.classList.add("hidden");
    }
  }

  function validateCurrentStep() {
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
        if (!el || !el.value || (el.type === "file" && el.files.length === 0)) {
          if (el) {
            el.classList.add("input-error");
          }
          valid = false;
        } else if (el) {
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
        if (!el || !el.value) {
          if (el) {
            el.classList.add("input-error");
          }
          valid = false;
        } else if (el) {
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
        if (!el || !el.value || (el.type === "file" && el.files.length === 0)) {
          if (el) {
            el.classList.add("input-error");
          }
          valid = false;
        } else if (el) {
          el.classList.remove("input-error");
        }
      });

      const isLoss = document.getElementById("isLossSelect")?.value === "true";
      if (isLoss) {
        const lossAmountInput = document.getElementById("lossAmount");
        if (!lossAmountInput || !lossAmountInput.value) {
          if (lossAmountInput) {
            lossAmountInput.classList.add("input-error");
          }
          valid = false;
        } else if (lossAmountInput) {
          lossAmountInput.classList.remove("input-error");
        }
      }
    }

    if (currentStep === 4) {
      const requiredIds = ["activeCropInsurance", "landDocs", "salesReceipts"];
      const activeCropInsurance = document.getElementById("activeCropInsurance")?.value;
      const insuranceDocWrapper = document.getElementById("insuranceDocWrapper");
      const insuranceDoc = document.getElementById("insuranceDoc");
      const ownershipType = document.getElementById("ownershipType")?.value;
      const leaseDeedWrapper = document.getElementById("leaseDeedWrapper");
      const leaseDeed = document.getElementById("leaseDeed");
      const farmingExperience = parseFloat(document.getElementById("farmingExperience")?.value || "0");

      requiredIds.forEach((id) => {
        const el = document.getElementById(id);
        if (!el || !el.value || (el.type === "file" && el.files.length === 0)) {
          if (el) {
            el.classList.add("input-error");
          }
          valid = false;
        } else if (el) {
          el.classList.remove("input-error");
        }
      });

      if (activeCropInsurance === "Yes") {
        if (insuranceDocWrapper) insuranceDocWrapper.classList.remove("hidden");
        if (!insuranceDoc || !insuranceDoc.files.length) {
          if (insuranceDoc) insuranceDoc.classList.add("input-error");
          valid = false;
        } else if (insuranceDoc) {
          insuranceDoc.classList.remove("input-error");
        }
      } else if (insuranceDocWrapper) {
        insuranceDocWrapper.classList.add("hidden");
      }

      if (ownershipType === "lease") {
        if (leaseDeedWrapper) leaseDeedWrapper.classList.remove("hidden");
        if (!leaseDeed || !leaseDeed.files.length) {
          if (leaseDeed) leaseDeed.classList.add("input-error");
          valid = false;
        } else if (leaseDeed) {
          leaseDeed.classList.remove("input-error");
        }
      } else if (leaseDeedWrapper) {
        leaseDeedWrapper.classList.add("hidden");
      }

      const salesReceiptsWrapper = document.getElementById("salesReceiptsWrapper");
      const salesReceipts = document.getElementById("salesReceipts");
      if (farmingExperience > 1) {
        if (salesReceiptsWrapper) salesReceiptsWrapper.classList.remove("hidden");
        if (!salesReceipts || !salesReceipts.files.length) {
          if (salesReceipts) salesReceipts.classList.add("input-error");
          valid = false;
        } else if (salesReceipts) {
          salesReceipts.classList.remove("input-error");
        }
      } else if (salesReceiptsWrapper) {
        salesReceiptsWrapper.classList.add("hidden");
      }
    }

    if (!valid) {
      alert("Please fill all required fields in this step.");
    }

    return valid;
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      if (currentStep > 1) {
        currentStep -= 1;
        updateStepView();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      if (!validateCurrentStep()) return;
      if (currentStep < 4) {
        currentStep += 1;
        updateStepView();
      }
    });
  }

  const isLossSelect = document.getElementById("isLossSelect");
  const lossAmountWrapper = document.getElementById("lossAmountWrapper");

  if (isLossSelect) {
    isLossSelect.addEventListener("change", () => {
      if (isLossSelect.value === "true") {
        if (lossAmountWrapper) lossAmountWrapper.classList.remove("hidden");
      } else if (lossAmountWrapper) {
        lossAmountWrapper.classList.add("hidden");
      }
    });
  }

  const activeCropInsuranceSelect = document.getElementById("activeCropInsurance");
  const insuranceDocWrapper = document.getElementById("insuranceDocWrapper");
  const ownershipTypeSelect = document.getElementById("ownershipType");
  const leaseDeedWrapper = document.getElementById("leaseDeedWrapper");
  const farmingExperienceInput = document.getElementById("farmingExperience");
  const salesReceiptsWrapper = document.getElementById("salesReceiptsWrapper");

  if (activeCropInsuranceSelect) {
    activeCropInsuranceSelect.addEventListener("change", () => {
      if (activeCropInsuranceSelect.value === "Yes") {
        if (insuranceDocWrapper) insuranceDocWrapper.classList.remove("hidden");
      } else if (insuranceDocWrapper) {
        insuranceDocWrapper.classList.add("hidden");
      }
    });
  }

  if (ownershipTypeSelect) {
    ownershipTypeSelect.addEventListener("change", () => {
      if (ownershipTypeSelect.value === "lease") {
        if (leaseDeedWrapper) leaseDeedWrapper.classList.remove("hidden");
      } else if (leaseDeedWrapper) {
        leaseDeedWrapper.classList.add("hidden");
      }
    });
  }

  if (farmingExperienceInput) {
    farmingExperienceInput.addEventListener("input", () => {
      const val = parseFloat(farmingExperienceInput.value || "0");
      if (val > 1) {
        if (salesReceiptsWrapper) salesReceiptsWrapper.classList.remove("hidden");
      } else if (salesReceiptsWrapper) {
        salesReceiptsWrapper.classList.add("hidden");
      }
    });
  }

  updateStepView();

  // ---------- CAPABILITY SCORE CALCULATION ----------
  const scoreValueEl = document.getElementById("scoreValue");
  const tierValueEl = document.getElementById("tierValue");
  const tierDescriptionEl = document.getElementById("tierDescription");
  const recLoanLimitEl = document.getElementById("recLoanLimit");
  const recInterestRateEl = document.getElementById("recInterestRate");
  const recTenorEl = document.getElementById("recTenor");
  const printReportBtn = document.getElementById("printReportBtn");

  if (capabilityForm) {
    capabilityForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateCurrentStep()) return;

      const agronomyScore = parseFloat(document.getElementById("agronomySkill")?.value || "0");
      const businessScore = parseFloat(document.getElementById("businessSkill")?.value || "0");
      const machineryScore = parseFloat(document.getElementById("machinerySkill")?.value || "0");

      const farmingExperience = parseFloat(document.getElementById("farmingExperience")?.value || "0");
      const pastInvestment = parseFloat(document.getElementById("pastInvestment")?.value || "0");
      const pastProfit = parseFloat(document.getElementById("pastProfit")?.value || "0");
      const isLoss = document.getElementById("isLossSelect")?.value === "true";
      const lossAmount = parseFloat(document.getElementById("lossAmount")?.value || "0");
      const ownershipType = document.getElementById("ownershipType")?.value;
      const activeCropInsurance = document.getElementById("activeCropInsurance")?.value;
      const landSize = parseFloat(document.getElementById("landSize")?.value || "0");
      const irrigationMethod = document.getElementById("irrigationMethod")?.value;

      let capabilityScore = agronomyScore + businessScore + machineryScore;
      capabilityScore += Math.min(farmingExperience, 10);

      const profitFactor = pastInvestment > 0 ? Math.min(pastProfit / pastInvestment, 1.5) : 0;
      capabilityScore += profitFactor * 5;

      if (isLoss && lossAmount > 0) {
        const lossFactor = pastInvestment > 0 ? Math.min(lossAmount / pastInvestment, 1.5) : 1;
        capabilityScore -= lossFactor * 3;
      }

      if (ownershipType === "owner") {
        capabilityScore += 5;
      } else if (ownershipType === "lease") {
        capabilityScore += 2;
      }

      if (activeCropInsurance === "Yes") {
        capabilityScore += 3;
      }

      if (irrigationMethod === "Micro-irrigation") {
        capabilityScore += 4;
      } else if (irrigationMethod === "Borewell" || irrigationMethod === "Canal") {
        capabilityScore += 3;
      }

      const landFactor = Math.min(landSize, 10) * 0.8;
      capabilityScore += landFactor;
      capabilityScore = Math.max(0, Math.min(100, capabilityScore));

      let tier = "";
      let description = "";
      let loanLimit = 0;
      let interestRate = 0;
      let tenorMonths = 0;

      if (capabilityScore >= 80) {
        tier = "Tier A – High Capability";
        description = "Farmer demonstrates strong agronomy, financial planning, and reliable evidence. Suitable for higher loan limits with preferred interest rates.";
        loanLimit = Math.round((pastInvestment + pastProfit + landSize * 50000) / 10000) * 10000;
        interestRate = 10.5;
        tenorMonths = 36;
      } else if (capabilityScore >= 60) {
        tier = "Tier B – Moderate Capability";
        description = "Farmer shows consistent operations with reasonable skills and documentation, eligible for standard loan programs.";
        loanLimit = Math.round((pastInvestment + landSize * 30000) / 10000) * 10000;
        interestRate = 12.0;
        tenorMonths = 24;
      } else if (capabilityScore >= 40) {
        tier = "Tier C – Emerging Capability";
        description = "Farmer has basic skills and limited records. Recommend smaller ticket loans and closer monitoring.";
        loanLimit = Math.round((pastInvestment + landSize * 15000) / 10000) * 10000;
        interestRate = 13.5;
        tenorMonths = 18;
      } else {
        tier = "Tier D – High Risk / Support Required";
        description = "Current evidence suggests higher risk or inexperienced operations. Recommend capacity building and small working-capital support only.";
        loanLimit = Math.round((pastInvestment + landSize * 8000) / 10000) * 10000;
        interestRate = 15.0;
        tenorMonths = 12;
      }

      if (scoreValueEl) scoreValueEl.textContent = capabilityScore.toFixed(1);
      if (tierValueEl) tierValueEl.textContent = tier;
      if (tierDescriptionEl) tierDescriptionEl.textContent = description;
      if (recLoanLimitEl) recLoanLimitEl.textContent = "₹" + loanLimit.toLocaleString("en-IN");
      if (recInterestRateEl) recInterestRateEl.textContent = interestRate.toFixed(1) + "%";
      if (recTenorEl) recTenorEl.textContent = tenorMonths + " Months";

      showDashboard();
    });
  }

  if (printReportBtn) {
    printReportBtn.addEventListener("click", () => {
      window.print();
    });
  }
});
