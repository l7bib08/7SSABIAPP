import { state } from "../state.js";
import { renderHome } from "../screens/home.js";
import { renderClients } from "../screens/clients.js";
import { renderReports } from "../screens/reports.js";
import { renderProfile } from "../screens/profile.js";

export function showScreen(screenId) {
  const screens = document.querySelectorAll(".screen");
  const target = document.getElementById(screenId);

  if (!target) {
    console.warn(`Écran introuvable : ${screenId}`);
    return;
  }

  screens.forEach((screen) => screen.classList.remove("active"));
  target.classList.add("active");

  state.currentScreen = screenId;

  updateNavVisibility(screenId);
  updateBottomNavActive(screenId);
  runScreenRender(screenId);
}

export function updateNavVisibility(screenId) {
  const app = document.querySelector(".app");
  if (!app) return;

  const hideNavScreens = [
    "screen-initial",
    "screen-login",
    "screen-signup"
  ];

  app.classList.toggle("hide-nav", hideNavScreens.includes(screenId));
}

export function updateBottomNavActive(screenId) {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-item");
  navButtons.forEach((btn) => btn.classList.remove("is-active"));

  if (screenId === "screen-home") {
    navButtons[0]?.classList.add("is-active");
  } else if (["screen-cash", "screen-credit", "screen-expense"].includes(screenId)) {
    navButtons[1]?.classList.add("is-active");
  } else if (["screen-clients", "screen-add-client"].includes(screenId)) {
    navButtons[2]?.classList.add("is-active");
  } else if (screenId === "screen-reports") {
    navButtons[3]?.classList.add("is-active");
  } else if (screenId === "screen-profile") {
    navButtons[4]?.classList.add("is-active");
  }
}

function runScreenRender(screenId) {
  switch (screenId) {
    case "screen-home":
      renderHome();
      break;
    case "screen-clients":
      renderClients();
      break;
    case "screen-reports":
      renderReports();
      break;
    case "screen-profile":
      renderProfile();
      break;
    default:
      break;
  }
}