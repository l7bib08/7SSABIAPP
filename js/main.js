import { state } from "./state.js";
import { showScreen } from "./ui/navigation.js";
import { bindOverlayEvents } from "./overlay/overlay.js";

import { bindReportsEvents, bindReportExportEvents, renderReports } from "./screens/reports.js";
import { bindAuthEvents } from "./screens/auth.js";
import { bindHomeEvents, loadHomeData, renderHome } from "./screens/home.js";
import { bindClientEvents, loadClients, renderClients } from "./screens/clients.js";
import { bindCashEvents } from "./screens/cash.js";
import { bindCreditEvents } from "./screens/credit.js";
import { bindExpenseEvents } from "./screens/expense.js";
import { bindProfileEvents, renderProfile } from "./screens/profile.js";

document.addEventListener("DOMContentLoaded", initApp);

function initApp() {
  bindAllEvents();

  showScreen("screen-initial");

  setTimeout(async () => {
    try {
      if (window.JIBI_SESSION?.isLoggedIn) {
        state.user = window.JIBI_SESSION.user;

        await loadHomeData();
        await loadClients();

        renderAllScreens();
        showScreen("screen-home");
      } else {
        showScreen("screen-login");
      }
    } catch (error) {
      console.error("Erreur initApp:", error);
      showScreen("screen-home");
    }
  }, 1000);
}

function bindAllEvents() {
  bindAuthEvents(showScreen);
  bindHomeEvents(showScreen);
  bindClientEvents(showScreen);
  bindCashEvents();
  bindCreditEvents(showScreen);
  bindExpenseEvents();
  bindReportsEvents();
  bindProfileEvents(showScreen); 
  bindOverlayEvents();
  bindBottomNavEvents();
  bindReportExportEvents();
}

function bindBottomNavEvents() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-item");

  navButtons[0]?.addEventListener("click", async () => {
    await loadHomeData();
    renderHome();
    showScreen("screen-home");
  });

  navButtons[1]?.addEventListener("click", () => showScreen("screen-cash"));

  navButtons[2]?.addEventListener("click", async () => {
    await loadClients();
    renderClients();
    showScreen("screen-clients");
  });

  navButtons[3]?.addEventListener("click", () => showScreen("screen-reports"));
  navButtons[4]?.addEventListener("click", () => showScreen("screen-profile"));
}

function renderAllScreens() {
  renderHome();
  renderClients();
  renderReports();
  renderProfile();
}