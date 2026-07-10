// Hide all primary layout sections
function hideAll() {
  document.getElementById("landing").classList.add("hidden");
  document.getElementById("farmerLogin").classList.add("hidden");
  document.getElementById("farmerForm").classList.add("hidden");
}

// Show Farmer Login View
function showFarmerLogin() {
  hideAll();
  document.getElementById("farmerLogin").classList.remove("hidden");
}

// Show Farmer Information Form View
function showFarmerForm() {
  hideAll();
  document.getElementById("farmerForm").classList.remove("hidden");
}

// Event Bindings
document.addEventListener("DOMContentLoaded", () => {
  // Navigation / Action triggers
  document.getElementById("continueFarmerBtn").addEventListener("click", showFarmerLogin);
  document.getElementById("navLoginBtn").addEventListener("click", showFarmerLogin);
  
  // Login confirmation trigger
  document.getElementById("loginSubmitBtn").addEventListener("click", (e) => {
    e.preventDefault();
    showFarmerForm();
  });
});