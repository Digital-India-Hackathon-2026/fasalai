document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginUsernameInput = document.getElementById("loginUsername");
  const loginPasswordInput = document.getElementById("loginPassword");
  const loginError = document.getElementById("loginError");

  if (!loginForm || !loginUsernameInput || !loginPasswordInput || !loginError) {
    return;
  }

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = loginUsernameInput.value.trim();
    const password = loginPasswordInput.value.trim();

    if (username === "9876543210" && password === "password") {
      loginError.classList.add("hidden");
      sessionStorage.setItem("farmerAuthenticated", "true");
      sessionStorage.setItem("farmerUsername", username);
      window.location.href = "dashboard.html";
    } else {
      loginError.textContent = "Invalid credentials. Use 9876543210 / password for demo.";
      loginError.classList.remove("hidden");
    }
  });
});
