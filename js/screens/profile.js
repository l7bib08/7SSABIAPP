import { state } from "../state.js";

export function bindProfileEvents() {
  document.getElementById("btn-profile-status")?.addEventListener("click", () => {
    alert("Fonctionnalité à connecter plus tard.");
  });

  document.getElementById("btn-profile-personal-details")?.addEventListener("click", () => {
    alert("Détails personnels à connecter.");
  });

  document.getElementById("btn-profile-store-details")?.addEventListener("click", () => {
    alert("Détails du commerce à connecter.");
  });

  document.getElementById("btn-profile-settings")?.addEventListener("click", () => {
    alert("Paramètres à connecter.");
  });

  document.getElementById("btn-profile-tips")?.addEventListener("click", () => {
    alert("Conseils et astuces à connecter.");
  });

  document.getElementById("btn-profile-faq")?.addEventListener("click", () => {
    alert("FAQ à connecter.");
  });

  document.getElementById("btn-profile-contact")?.addEventListener("click", () => {
    alert("Contact à connecter.");
  });

  document.getElementById("btn-profile-backup")?.addEventListener("click", () => {
    alert("Sauvegarde à connecter.");
  });

  document.getElementById("btn-profile-export")?.addEventListener("click", () => {
    document.getElementById("btn-export-report")?.click();
  });
}

export function renderProfile() {
  const displayName = document.getElementById("profile-display-name");
  const role = document.getElementById("profile-role");

  if (displayName) {
    displayName.textContent = state.user?.name || "Omar";
  }

  if (role) {
    role.textContent = state.user?.email
      ? `Gérant • ${state.user.email}`
      : "Gérant • JIBI Store";
  }
}