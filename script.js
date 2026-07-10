// Hide all sections except the navbar
function hideAll() {

  document.getElementById("landing").style.display = "none";

  document.getElementById("farmerLogin").classList.add("hidden");

  document.getElementById("bankerLogin").classList.add("hidden");

  document.getElementById("farmerForm").classList.add("hidden");

  document.getElementById("bankerDashboard").classList.add("hidden");

}

// Show Farmer Login
function showFarmerLogin() {

  hideAll();

  document.getElementById("farmerLogin").classList.remove("hidden");

}

// Show Banker Login
function showBankerLogin() {

  hideAll();

  document.getElementById("bankerLogin").classList.remove("hidden");

}

// After Farmer Login -> Show Farmer Information Form
function showFarmerForm() {

  document.getElementById("farmerLogin").classList.add("hidden");

  document.getElementById("farmerForm").classList.remove("hidden");

}

// After Banker Login -> Show Banker Dashboard
function showBankerDashboard() {

  document.getElementById("bankerLogin").classList.add("hidden");

  document.getElementById("bankerDashboard").classList.remove("hidden");

}

// Open Login Modal
function openLogin() {

  document.getElementById("loginModal").classList.remove("hidden");

}

// Close Login Modal
function closeLogin() {

  document.getElementById("loginModal").classList.add("hidden");

}