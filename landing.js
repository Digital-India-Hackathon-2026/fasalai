document.addEventListener("DOMContentLoaded", () => {
  ["navLoginBtn", "continueFarmerBtn"].forEach(id => document.getElementById(id)?.addEventListener("click", () => { window.location.href = "login.html"; }));
});
