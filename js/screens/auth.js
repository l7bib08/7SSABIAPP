import {
  getUsers,
  saveUsers,
  setCurrentUserId,
  clearCurrentUserId,
  findUserByEmail,
  loadCurrentUserIntoState,
  saveCurrentUserAppData,
  resetStateData
} from "../services/storage.js";
import { generateId } from "../utils/helpers.js";
import {
  validateSignupData,
  validateLoginData,
  normalizeEmail
} from "../services/validators.js";
import { showToast } from "../ui/notifications.js";

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
    const email = normalizeEmail(document.getElementById("signup-email")?.value);
    const password = document.getElementById("signup-password")?.value.trim();
    const password2 = document.getElementById("signup-password2")?.value.trim();

    const error = validateSignupData({ name, email, password, password2 });
    if (error) {
      showToast(error, "error");
      return;
    }

    const existingUser = findUserByEmail(email);
    if (existingUser) {
      showToast("Un compte avec cet email existe déjà.", "error");
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

    showToast("Compte créé avec succès.", "success");
    showScreen("screen-home");
  });

  btnLoginNext?.addEventListener("click", () => {
    const email = normalizeEmail(document.getElementById("login-email")?.value);
    const password = document.getElementById("login-password")?.value.trim();

    const error = validateLoginData({ email, password });
    if (error) {
      showToast(error, "error");
      return;
    }

    const user = findUserByEmail(email);

    if (!user || user.password !== password) {
      showToast("Email ou mot de passe incorrect.", "error");
      return;
    }

    setCurrentUserId(user.id);
    loadCurrentUserIntoState();

    showToast("Connexion réussie.", "success");
    showScreen("screen-home");
  });

  btnLogout?.addEventListener("click", () => {
    saveCurrentUserAppData();
    clearCurrentUserId();
    resetStateData();
    showToast("Déconnexion effectuée.", "info");
    showScreen("screen-login");
  });
}