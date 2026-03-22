import { loadCurrentUserIntoState } from "./services/storage.js";
import { state } from "./state.js";
import { showScreen } from "./ui/navigation.js";
import { bindOverlayEvents } from "./overlay/overlay.js";

import { bindAuthEvents } from "./screens/auth.js";
import { bindHomeEvents, renderHome } from "./screens/home.js";
import { bindClientEvents, renderClients } from "./screens/clients.js";
import { bindCashEvents } from "./screens/cash.js";
import { bindCreditEvents } from "./screens/credit.js";
import { bindExpenseEvents } from "./screens/expense.js";
import { bindReportsEvents, renderReports } from "./screens/reports.js";
import { bindProfileEvents, renderProfile } from "./screens/profile.js";

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  bindAllEvents();

  showScreen("screen-initial");

  setTimeout(() => {
    const hasSession = loadCurrentUserIntoState();

    if (hasSession && state.user) {
      renderAllScreens();
      showScreen("screen-home");
    } else {
      showScreen("screen-login");
    }
  }, 1500);
}

function bindAllEvents() {
  bindAuthEvents(showScreen);
  bindHomeEvents(showScreen);
  bindClientEvents(showScreen);
  bindCashEvents();
  bindCreditEvents(showScreen);
  bindExpenseEvents();
  bindReportsEvents();
  bindProfileEvents();
  bindOverlayEvents();
  bindBottomNavEvents();
}

function bindBottomNavEvents() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-item");

  navButtons[0]?.addEventListener("click", () => showScreen("screen-home"));
  navButtons[1]?.addEventListener("click", () => showScreen("screen-cash"));
  navButtons[2]?.addEventListener("click", () => showScreen("screen-clients"));
  navButtons[3]?.addEventListener("click", () => showScreen("screen-reports"));
  navButtons[4]?.addEventListener("click", () => showScreen("screen-profile"));
}

function renderAllScreens() {
  renderHome();
  renderClients();
  renderReports();
  renderProfile();
}