document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);
  const home = $("dashboardHome");
  const assessment = $("assessmentCard");
  const scoreCard = $("scoreCard");
  const explorer = $("exploreCard");
  const form = $("capabilityForm");
  const DRAFT_KEY = "smartFarmerAssessmentDraft";
  const SENT_REQUESTS_KEY = "smartFarmerSentRequests";
  const ACCESS_REQUESTS_KEY = "smartFarmerAccessRequests";
  const LOAN_DECISIONS_KEY = "smartFarmerLoanDecisions";
  const steps = [...document.querySelectorAll(".form-step")];
  const stepDots = [...document.querySelectorAll(".stepper .step")];
  const requiredFields = [
    ["fullName", "age", "state", "mobile", "aadhaar", "aadhaarFile", "pan", "panFile"],
    ["experience", "ownership", "duration", "crop", "landSize", "irrigation"],
    ["agronomy", "business", "technology", "investment", "profit", "loss", "lossAmount", "proof"],
    ["landDocs", "receipts"],
  ];
  let currentStep = 0;
  let chart;

  if (sessionStorage.getItem("farmerAuthenticated") !== "true") {
    location.href = "login.html";
    return;
  }

  const currentUser = getStoredValue("smartFarmerUser", { id: "demo-farmer", name: "Demo Farmer", type: "farmer" });
  const isViewer = currentUser.type === "viewer";
  $("dashboardTitle").textContent = `Good to see you, ${currentUser.name}.`;
  if (isViewer) {
    $("startAssessmentBtn").classList.add("hidden");
    $("assessmentBtn").classList.add("hidden");
    $("personalBtn").classList.add("hidden");
  }

  function showView(view) {
    home.classList.toggle("hidden", view !== "home");
    assessment.classList.toggle("hidden", view !== "assessment");
    scoreCard.classList.toggle("hidden", view !== "score");
    explorer.classList.toggle("hidden", view !== "explore");
    window.scrollTo(0, 0);
  }

  function getStoredValue(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  }

  const draftFields = [...form.querySelectorAll("input, select")].filter((field) => (
    field.type !== "file" && !["fullName", "mobile", "aadhaar", "pan"].includes(field.id)
  ));

  function saveDraft() {
    const values = Object.fromEntries(draftFields.map((field) => [field.id, field.value]));
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ values, currentStep }));
  }

  function restoreDraft() {
    try {
      const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY));
      if (!draft) return false;
      draftFields.forEach((field) => {
        if (Object.hasOwn(draft.values || {}, field.id)) field.value = draft.values[field.id];
      });
      currentStep = Number.isInteger(draft.currentStep) && draft.currentStep >= 0 && draft.currentStep <= 3 ? draft.currentStep : 0;
      return true;
    } catch {
      sessionStorage.removeItem(DRAFT_KEY);
      return false;
    }
  }

  const hasDraft = restoreDraft();
  const openAssessment = () => {
    showView("assessment");
    saveDraft();
  };

  function openExplorer() {
    showView("explore");
    renderFarmers();
    renderAccessRequests();
  }

  $("startAssessmentBtn").onclick = openAssessment;
  $("assessmentBtn").onclick = openAssessment;
  $("personalBtn").onclick = () => alert("Your personal details are completed in Step 1 of the assessment.");
  $("exploreBtn").onclick = openExplorer;
  $("backToDashboardBtn").onclick = () => showView("home");
  $("logoutBtn").onclick = () => {
    sessionStorage.clear();
    location.href = "index.html";
  };

  function getProfiles() {
    return getStoredValue("smartFarmerProfiles", []);
  }

  function renderFarmers() {
    const query = $("farmerSearch").value.trim().toLowerCase();
    const requests = getAccessRequests();
    const matches = getProfiles().filter((farmer) => farmer.ownerId !== currentUser.id && [farmer.name, farmer.state, farmer.crop].some((value) => String(value).toLowerCase().includes(query)));
    const results = $("farmerResults");
    results.replaceChildren();
    if (!matches.length) {
      results.innerHTML = '<div class="empty-state"><h2>No farmer profiles found</h2><p>A farmer must complete an assessment before their profile appears here.</p></div>';
      return;
    }
    matches.forEach((farmer) => {
      const card = document.createElement("article");
      card.className = "network-card";
      const details = document.createElement("div");
      const heading = document.createElement("h2");
      heading.textContent = farmer.name;
      const description = document.createElement("p");
      const request = requests.find((item) => item.farmerId === farmer.ownerId && item.requesterId === currentUser.id);
      const hasAccess = !isViewer || request?.status === "approved";
      description.textContent = hasAccess
        ? `${farmer.state} · ${farmer.crop} · Capability score ${farmer.score}/100 · ${farmer.tier} · Skills: Agronomy ${farmer.skills.agronomy}, Financial ${farmer.skills.business}, Technology ${farmer.skills.technology} · Age ${farmer.age} · ${farmer.experience} years' experience · ${farmer.land} acres · ${farmer.ownership}`
        : `${farmer.state} · ${farmer.crop} · Private score and skills are available after the farmer approves your request.`;
      details.append(heading, description);
      const controls = document.createElement("div");
      controls.className = "request-actions";
      const button = document.createElement("button");
      button.type = "button";
      button.className = "next";
      button.disabled = !isViewer || Boolean(request);
      button.textContent = !isViewer ? "Your profile" : request?.status === "approved" ? "Access approved" : request ? "Request sent" : "Request profile access";
      button.onclick = () => {
        const sent = getAccessRequests();
        sent.push({
          id: `${currentUser.id}-${farmer.ownerId}`,
          requesterId: currentUser.id,
          requester: currentUser.name,
          farmerId: farmer.ownerId,
          reason: "Requested access to the farmer's score and skill profile.",
          status: "pending",
        });
        localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(sent));
        localStorage.setItem(SENT_REQUESTS_KEY, JSON.stringify(sent.filter((item) => item.requesterId === currentUser.id).map((item) => item.id)));
        renderFarmers();
      };
      controls.append(button);
      if (isViewer && request?.status === "approved") {
        const decisions = getStoredValue(LOAN_DECISIONS_KEY, {});
        const decision = decisions[farmer.ownerId];
        if (decision) {
          const result = document.createElement("span");
          result.className = `request-status ${decision === "recommended" ? "approved" : "declined"}`;
          result.textContent = decision === "recommended" ? "Manual review: recommended" : "Manual review: not recommended";
          controls.append(result);
        } else {
          [["Recommend loan review", "approve", "recommended"], ["Do not recommend", "decline", "not-recommended"]].forEach(([label, className, value]) => {
            const decisionButton = document.createElement("button");
            decisionButton.type = "button";
            decisionButton.className = `previous ${className}`;
            decisionButton.textContent = label;
            decisionButton.onclick = () => {
              const saved = getStoredValue(LOAN_DECISIONS_KEY, {});
              saved[farmer.ownerId] = value;
              localStorage.setItem(LOAN_DECISIONS_KEY, JSON.stringify(saved));
              renderFarmers();
            };
            controls.append(decisionButton);
          });
        }
      }
      card.append(details, controls);
      results.append(card);
    });
  }

  function getAccessRequests() {
    return getStoredValue(ACCESS_REQUESTS_KEY, []);
  }

  function renderAccessRequests() {
    const requests = getAccessRequests().filter((request) => request.farmerId === currentUser.id);
    const list = $("accessRequestList");
    list.replaceChildren();
    if (isViewer) {
      list.innerHTML = '<div class="empty-state"><h2>Your sent requests</h2><p>Requests are shown beside each farmer profile. Approved requests reveal the score and skills.</p></div>';
      return;
    }
    if (!requests.length) {
      list.innerHTML = '<div class="empty-state"><h2>No requests yet</h2><p>When a viewer requests your profile, you can approve or decline it here.</p></div>';
      return;
    }
    requests.forEach((request) => {
      const card = document.createElement("article");
      card.className = "request-card";
      const details = document.createElement("div");
      const heading = document.createElement("h2");
      heading.textContent = request.requester;
      const description = document.createElement("p");
      description.textContent = request.reason;
      details.append(heading, description);
      const controls = document.createElement("div");
      controls.className = "request-actions";
      if (request.status === "pending") {
        [
          ["Approve", "approve", "approved"],
          ["Decline", "decline", "declined"],
        ].forEach(([label, className, status]) => {
          const button = document.createElement("button");
          button.type = "button";
          button.className = `previous ${className}`;
          button.textContent = label;
          button.onclick = () => {
            const updated = getAccessRequests().map((item) => item.id === request.id ? { ...item, status } : item);
            localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(updated));
            renderAccessRequests();
          };
          controls.append(button);
        });
      } else {
        const status = document.createElement("span");
        status.className = `request-status ${request.status}`;
        status.textContent = request.status;
        controls.append(status);
      }
      card.append(details, controls);
      list.append(card);
    });
  }

  $("farmerSearch").addEventListener("input", renderFarmers);

  function setStep() {
    steps.forEach((step, index) => step.classList.toggle("active", index === currentStep));
    stepDots.forEach((step, index) => step.classList.toggle("active", index <= currentStep));
    document.querySelectorAll(".stepper i").forEach((line, index) => line.classList.toggle("active", index < currentStep));
    $("previousBtn").style.visibility = currentStep ? "visible" : "hidden";
    $("nextBtn").classList.toggle("hidden", currentStep === 3);
    $("generateBtn").classList.toggle("hidden", currentStep !== 3);
  }

  function validStep() {
    const fieldsAreValid = requiredFields[currentStep].map((id) => {
      const field = $(id);
      const valid = field.type === "file" ? field.files.length > 0 : field.checkValidity();
      field.classList.toggle("field-error", !valid);
      return valid;
    });
    return fieldsAreValid.every(Boolean);
  }

  function showStatus(message, isError = false) {
    const status = $("predictionStatus");
    status.textContent = message;
    status.classList.toggle("hidden", !message);
    status.classList.toggle("field-error", isError);
  }

  function modelPayload() {
    return {
      age: $("age").value,
      state: $("state").value,
      state: $("state").value,
      farming_experience_years: $("experience").value,
      land_ownership_status: $("ownership").value,
      crop_duration: $("duration").value,
      primary_crop: $("crop").value,
      land_holding_acres: $("landSize").value,
      irrigation_method: $("irrigation").value,
      agronomy_skill_score: $("agronomy").value,
      business_skill_score: $("business").value,
      machinery_skill_score: $("technology").value,
      past_crop_investment_rs: $("investment").value,
      past_crop_profit_rs: $("profit").value,
      suffered_loss: $("loss").value === "yes",
      loss_amount_rs: $("lossAmount").value,
      active_crop_insurance: $("insurance").value === "yes",
      certificates_count: $("certificates").files.length,
      sales_receipts_uploaded: $("receipts").files.length > 0,
    };
  }

  async function getPrediction() {
    let response;
    try {
      response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelPayload()),
      });
    } catch {
      throw new Error("Cannot reach the prediction server. Start the app with python3 app.py and open http://127.0.0.1:5000.");
    }

    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error("The prediction API is unavailable. Open the app through http://127.0.0.1:5000, not by opening dashboard.html directly.");
    }
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "The model could not generate a prediction.");
    return result;
  }

  function showResult(prediction) {
    const profile = {
      name: $("fullName").value,
      age: $("age").value,
      mobile: $("mobile").value,
      crop: $("crop").value,
      land: $("landSize").value,
      experience: $("experience").value,
      ownership: $("ownership").value,
      score: prediction.capability_score,
      tier: prediction.tier,
      risk: prediction.risk,
      confidence: prediction.confidence,
      ownerId: currentUser.id,
      skills: {
        agronomy: $("agronomy").selectedOptions[0].text,
        business: $("business").selectedOptions[0].text,
        technology: $("technology").selectedOptions[0].text,
      },
    };
    localStorage.setItem("smartFarmerProfile", JSON.stringify(profile));
    const profiles = getProfiles().filter((savedProfile) => savedProfile.ownerId !== currentUser.id);
    profiles.push(profile);
    localStorage.setItem("smartFarmerProfiles", JSON.stringify(profiles));
    sessionStorage.removeItem(DRAFT_KEY);
    showView("score");
    $("scoreValue").textContent = profile.score;
    $("tierValue").textContent = profile.tier.replace("Tier ", "T").replace(": ", " · ");
    $("riskValue").textContent = `${profile.risk} (${profile.confidence}%)`;
    const profileLines = [
      profile.name,
      `Age: ${profile.age} · Mobile: ${profile.mobile}`,
      `Crop: ${profile.crop} · Land: ${profile.land} acres`,
      `Experience: ${profile.experience} years · ${profile.ownership}`,
      `Model confidence: ${profile.confidence}%`,
    ];
    const profileDetails = $("profileDetails");
    profileDetails.replaceChildren(...profileLines.map((line) => {
      const paragraph = document.createElement("p");
      paragraph.textContent = line;
      return paragraph;
    }));

    chart?.destroy();
    if (!window.Chart) {
      showStatus("Your result was created, but the skills chart could not load. Check your internet connection and refresh the page.", true);
      return;
    }
    chart = new Chart($("skillChart"), {
      type: "doughnut",
      data: {
        labels: ["Agronomy", "Financial", "Technology"],
        datasets: [{
          data: [+$("agronomy").value, +$("business").value, +$("technology").value],
          backgroundColor: ["#16834c", "#4e9ddd", "#efad37"],
          borderWidth: 0,
        }],
      },
      options: { cutout: "66%", plugins: { legend: { position: "bottom" } } },
    });
    window.scrollTo(0, 0);
  }

  $("nextBtn").onclick = () => {
    if (validStep()) {
      showStatus("");
      currentStep += 1;
      setStep();
      saveDraft();
    } else {
      showStatus("Please complete every required field before continuing.", true);
    }
  };
  $("previousBtn").onclick = () => {
    if (currentStep) {
      currentStep -= 1;
      setStep();
      saveDraft();
    }
  };
  form.addEventListener("input", saveDraft);
  form.addEventListener("change", saveDraft);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!validStep()) {
      showStatus("Please complete every required field before generating your score.", true);
      return;
    }
    const button = $("generateBtn");
    button.disabled = true;
    button.textContent = "Generating prediction…";
    showStatus("Generating your capability profile…");
    try {
      showResult(await getPrediction());
    } catch (error) {
      showStatus(`Prediction unavailable: ${error.message}`, true);
    } finally {
      button.disabled = false;
      button.textContent = "Generate my score →";
    }
  });
  $("editBtn").onclick = () => {
    currentStep = 0;
    setStep();
    showView("assessment");
    saveDraft();
  };

  setStep();
  showView(hasDraft && !isViewer ? "assessment" : "home");
});
