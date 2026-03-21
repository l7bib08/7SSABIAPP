import { getUsers, saveUsers, setCurrentUserId, clearCurrentUserId, findUserByEmail, loadCurrentUserIntoState, saveCurrentUserAppData, resetStateData } from "../storage.js";
import { generateId } from "../helpers.js";

export function bindAuthEvents(showScreen) {
  const btnLoginNext = document.getElementById("btn-login-next");
  const btnGoSignup = document.getElementById("btn-go-signup");
  const btnBackLogin = document.getElementById("btn-back-login");
  const btnCreateAccount = document.getElementById("btn-create-account");
  const btnLogout = document.getElementById("btn-profile-logout");

  btnGoSignup?.addEventListener("click", () => {
    showScreen("screen-signup");
  });

  btnBackLogin?.addEventListener("click", () => {
    showScreen("screen-login");
  });

  btnCreateAccount?.addEventListener("click", () => {
    const name = document.getElementById("signup-name")?.value.trim();
    const email = document.getElementById("signup-email")?.value.trim().toLowerCase();
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

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      alert("Un compte avec cet email existe déjà.");
      return;
    }

    const users = getUsers();

    const newUser = {
      id: generateId("user"),
      name,
      email,
      password,
      data: {
        clients: [],
        sales: [],
        expenses: [],
        payments: []
      }
    };

    users.push(newUser);
    saveUsers(users);
    setCurrentUserId(newUser.id);
    loadCurrentUserIntoState();

    showScreen("screen-home");
  });

  btnLoginNext?.addEventListener("click", () => {
    const email = document.getElementById("login-email")?.value.trim().toLowerCase();
    const password = document.getElementById("login-password")?.value.trim();

    if (!email || !password) {
      alert("Entrer email et mot de passe.");
      return;
    }

    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      alert("Email ou mot de passe incorrect.");
      return;
    }

    setCurrentUserId(user.id);
    loadCurrentUserIntoState();

    showScreen("screen-home");
  });

  btnLogout?.addEventListener("click", () => {
    saveCurrentUserAppData();
    clearCurrentUserId();
    resetStateData();
    showScreen("screen-login");
  });
}