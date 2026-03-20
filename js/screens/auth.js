import { state } from "../state.js";
import { saveData } from "../storage.js";

export function bindAuthEvents(showScreen) {
  const btnLoginNext = document.getElementById("btn-login-next");
  const btnGoSignup = document.getElementById("btn-go-signup");
  const btnBackLogin = document.getElementById("btn-back-login");
  const btnCreateAccount = document.getElementById("btn-create-account");
  const btnLogout = document.getElementById("btn-profile-logout");

  btnLoginNext?.addEventListener("click", () => {
    const email = document.getElementById("login-email")?.value.trim();
    const password = document.getElementById("login-password")?.value.trim();

    if (!email || !password) {
      alert("Entrer email et mot de passe.");
      return;
    }

    state.user = {
      name: "Omar",
      email
    };

    saveData();
    showScreen("screen-home");
  });

  btnGoSignup?.addEventListener("click", () => {
    showScreen("screen-signup");
  });

  btnBackLogin?.addEventListener("click", () => {
    showScreen("screen-login");
  });

  btnCreateAccount?.addEventListener("click", () => {
    const name = document.getElementById("signup-name")?.value.trim();
    const email = document.getElementById("signup-email")?.value.trim();
    const password = document.getElementById("signup-password")?.value.trim();
    const password2 = document.getElementById("signup-password2")?.value.trim();

    if (!name || !email || !password || !password2) {
      alert("Tous les champs sont obligatoires.");
      return;
    }

    if (password !== password2) {
      alert("Les mots de passe ne correspondent pas.");
      return;
    }

    state.user = { name, email };
    saveData();
    showScreen("screen-home");
  });

  btnLogout?.addEventListener("click", () => {
    state.user = null;
    saveData();
    showScreen("screen-login");
  });
}