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

    const users = {
      "9876543210": { id: "demo-farmer", name: "Demo Farmer", type: "farmer" },
      "9000000000": { id: "network-viewer", name: "Kiran Finance", type: "viewer" },
    };
    if (users[username] && password === "password") {
      loginError.classList.add("hidden");
      sessionStorage.setItem("farmerAuthenticated", "true");
      sessionStorage.setItem("farmerUsername", username);
      sessionStorage.setItem("smartFarmerUser", JSON.stringify(users[username]));
      window.location.href = "dashboard.html";
    } else {
      loginError.textContent = "Invalid credentials. Use either demo account with password 'password'.";
      loginError.classList.remove("hidden");
    }
  });
});
