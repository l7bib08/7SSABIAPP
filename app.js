document.addEventListener("DOMContentLoaded", () => {
  initApp();
});

const STORAGE_KEY = "jibi_app_data";

let state = {
  currentScreen: "screen-initial",
  user: null,
  clients: [],
  sales: [],
  expenses: [],
  payments: []
};

let selectedClientId = null;

function initApp() {
  loadData();
  bindEvents();

  showScreen("screen-initial");

  setTimeout(() => {
    showScreen("screen-login");
  }, 3000);

  updateHomeStats();
  renderClients();
  renderReports();
}

/* =========================
   STORAGE
========================= */
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);

    state = {
      ...state,
      ...parsed,
      clients: Array.isArray(parsed.clients) ? parsed.clients : [],
      sales: Array.isArray(parsed.sales) ? parsed.sales : [],
      expenses: Array.isArray(parsed.expenses) ? parsed.expenses : [],
      payments: Array.isArray(parsed.payments) ? parsed.payments : []
    };
  } catch (error) {
    console.error("Erreur lors du chargement des données :", error);
  }
}

/* =========================
   SCREEN NAVIGATION
========================= */
function showScreen(screenId) { 
  const screens = document.querySelectorAll(".screen");
  const target = document.getElementById(screenId);

  if (!target) {
    console.warn(`Écran introuvable : ${screenId}`);
    return;
  }

  screens.forEach((screen) => {
    screen.classList.remove("active");
  });

  target.classList.add("active");
  state.currentScreen = screenId;

  updateNavVisibility(screenId);
  updateBottomNavActive(screenId);
  saveData();
}

function updateNavVisibility(screenId) {
  const app = document.querySelector(".app");
  if (!app) return;

  const hideNavScreens = [
    "screen-initial",
    "screen-login",
    "screen-signup"
  ];

  if (hideNavScreens.includes(screenId)) {
    app.classList.add("hide-nav");
  } else {
    app.classList.remove("hide-nav");
  }
}

function updateBottomNavActive(screenId) {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-item");

  navButtons.forEach((btn) => btn.classList.remove("is-active"));

  if (screenId === "screen-home") {
    navButtons[0]?.classList.add("is-active");
  } else if (screenId === "screen-cash" || screenId === "screen-credit" || screenId === "screen-expense") {
    navButtons[1]?.classList.add("is-active");
  } else if (screenId === "screen-clients" || screenId === "screen-add-client") {
    navButtons[2]?.classList.add("is-active");
  } else if (screenId === "screen-reports") {
    navButtons[3]?.classList.add("is-active");
  } else if (screenId === "screen-profile") {
    navButtons[4]?.classList.add("is-active");
  }
}

/* =========================
   EVENTS
========================= */
function bindEvents() {
  bindAuthEvents();
  bindHomeEvents();
  bindBackEvents();
  bindClientEvents();
  bindBottomNavEvents();
  bindOverlayEvents();
}

function bindAuthEvents() {
  const btnLoginNext = document.getElementById("btn-login-next");
  const btnGoSignup = document.getElementById("btn-go-signup");
  const btnBackLogin = document.getElementById("btn-back-login");
  const btnCreateAccount = document.getElementById("btn-create-account");

  btnLoginNext?.addEventListener("click", () => {
    showScreen("screen-home");
  });

  btnGoSignup?.addEventListener("click", () => {
    showScreen("screen-signup");
  });

  btnBackLogin?.addEventListener("click", () => {
    showScreen("screen-login");
  });

  btnCreateAccount?.addEventListener("click", () => {
    showScreen("screen-home");
  });
}

function bindHomeEvents() {
  const goCash = document.getElementById("go-cash");
  const goCredit = document.getElementById("go-credit");
  const goExpense = document.getElementById("go-expense");

  goCash?.addEventListener("click", () => {
    showScreen("screen-cash");
  });

  goCredit?.addEventListener("click", () => {
    showScreen("screen-credit");
  });

  goExpense?.addEventListener("click", () => {
    showScreen("screen-expense");
  });
}

function bindBackEvents() {
  const backCash = document.getElementById("btn-back-home-from-cash");
  const nextFromCash = document.getElementById("btn-go-credit-from-cash");

  const backCredit = document.getElementById("btn-back-cash-from-credit");
  const nextFromCredit = document.getElementById("btn-go-expense-from-credit");

  const backExpense = document.getElementById("btn-back-credit-from-expense");

  backCash?.addEventListener("click", () => {
    showScreen("screen-home");
  });

  nextFromCash?.addEventListener("click", () => {
    showScreen("screen-credit");
  });

  backCredit?.addEventListener("click", () => {
    showScreen("screen-cash");
  });

  nextFromCredit?.addEventListener("click", () => {
    showScreen("screen-expense");
  });

  backExpense?.addEventListener("click", () => {
    showScreen("screen-credit");
  });
}

function bindClientEvents() {
  const goAddClient = document.getElementById("go-add-client");
  const btnCreditAddClient = document.getElementById("btn-credit-add-client");
  const btnSaveClient = document.getElementById("btn-save-client");

  goAddClient?.addEventListener("click", () => {
    showScreen("screen-add-client");
  });

  btnCreditAddClient?.addEventListener("click", () => {
    showScreen("screen-add-client");
  });

  btnSaveClient?.addEventListener("click", () => {
    showScreen("screen-clients");
  });
}

function bindBottomNavEvents() {
  const navButtons = document.querySelectorAll(".bottom-nav .nav-item");

  navButtons[0]?.addEventListener("click", () => {
    showScreen("screen-home");
  });

  navButtons[1]?.addEventListener("click", () => {
    showScreen("screen-cash");
  });

  navButtons[2]?.addEventListener("click", () => {
    showScreen("screen-clients");
  });

  navButtons[3]?.addEventListener("click", () => {
    showScreen("screen-reports");
  });

  navButtons[4]?.addEventListener("click", () => {
    showScreen("screen-profile");
  });
}

function bindOverlayEvents() {
  const overlay = document.getElementById("overlay");
  if (!overlay) return;

  const overlayCloseArea = document.getElementById("overlay-close-area");
  const close1 = document.getElementById("btn-overlay-close-1");
  const close2 = document.getElementById("btn-overlay-close-2");
  const close3 = document.getElementById("btn-overlay-close-3");
  const btnOpenPayment = document.getElementById("btn-open-payment");

  overlayCloseArea?.addEventListener("click", closeOverlay);
  close1?.addEventListener("click", closeOverlay);
  close2?.addEventListener("click", closeOverlay);
  close3?.addEventListener("click", closeOverlay);

  btnOpenPayment?.addEventListener("click", openPaymentOverlay);
}

function openOverlay(panelId) {
  const overlay = document.getElementById("overlay");
  if (!overlay) return;

  const panels = overlay.querySelectorAll(".overlay-panel");
  panels.forEach((panel) => panel.classList.add("hidden"));

  const targetPanel = document.getElementById(panelId);
  targetPanel?.classList.remove("hidden");

  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (!overlay) return;

  const panels = overlay.querySelectorAll(".overlay-panel");
  panels.forEach((panel) => panel.classList.add("hidden"));

  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

function openClientInfo(clientId) {
  const client = state.clients.find((item) => item.id === clientId);
  if (!client) return;

  selectedClientId = clientId;

  const consumed = Number(client.consumed || 0);
  const paid = Number(client.paid || 0);
  const remaining = consumed - paid;

  document.getElementById("overlay-client-name").textContent = client.name || "--";
  document.getElementById("overlay-client-id").textContent = `: ${client.id || "--"}`;
  document.getElementById("overlay-client-phone").textContent = `: ${client.phone || "--"}`;
  document.getElementById("overlay-client-limit").textContent = `: ${client.limit || 0} DH`;
  document.getElementById("overlay-client-consumed").textContent = `: ${consumed} DH`;
  document.getElementById("overlay-client-paid").textContent = `: ${paid} DH`;
  document.getElementById("overlay-client-remaining").textContent = `: ${remaining} DH`;

  const img = document.getElementById("overlay-client-img");
  if (img) {
    img.src = client.image || "assets/Icons/user.png";
  }

  openOverlay("overlay-client-info");
}

function openPaymentOverlay() {
  if (!selectedClientId) return;

  const client = state.clients.find((item) => item.id === selectedClientId);
  if (!client) return;

  const remaining = getClientDebt(client.id);

  document.getElementById("payment-client-name").textContent = client.name || "--";
  document.getElementById("payment-remaining").textContent = formatMoney(remaining);

  const img = document.getElementById("payment-client-img");
  if (img) {
    img.src = client.image || "assets/Icons/user.png";
  }

  const amountInput = document.getElementById("payment-amount");
  if (amountInput) {
    amountInput.value = "";
  }

  openOverlay("overlay-payment");
}

/* =========================
   RENDER / UI
========================= */
function updateHomeStats() {
  const salesTodayEl = document.getElementById("stat-sales-today");
  const expensesTodayEl = document.getElementById("stat-expenses-today");
  const profitTodayEl = document.getElementById("stat-profit-today");
  const homeDateEl = document.getElementById("home-date");

  const today = getTodayDate();

  const salesToday = state.sales
    .filter((sale) => sale.date === today && sale.type === "cash")
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);

  const expensesToday = state.expenses
    .filter((expense) => expense.date === today)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const profitToday = salesToday - expensesToday;

  if (salesTodayEl) salesTodayEl.textContent = formatMoney(salesToday);
  if (expensesTodayEl) expensesTodayEl.textContent = formatMoney(expensesToday);
  if (profitTodayEl) profitTodayEl.textContent = formatMoney(profitToday);
  if (homeDateEl) homeDateEl.textContent = formatDisplayDate(new Date());
}

function renderClients() {
  const clientsList = document.getElementById("clients-list");
  const summary = document.getElementById("clients-summary");

  if (!clientsList || !summary) return;

  clientsList.innerHTML = "";

  if (state.clients.length === 0) {
    summary.textContent = "0 client • Dette totale : 0 DH";
    clientsList.innerHTML = `<p style="text-align:center; margin-top:20px;">Aucun client enregistré</p>`;
    return;
  }

  const totalDebt = state.clients.reduce((sum, client) => {
    return sum + getClientDebt(client.id);
  }, 0);

  summary.textContent = `${state.clients.length} clients • Dette totale : ${formatMoney(totalDebt)}`;

  state.clients.forEach((client) => {
    const debt = getClientDebt(client.id);

    const card = document.createElement("div");
    card.className = "client-card";

    card.innerHTML = `
      <div class="client-left">
        <img class="client-avatar" src="${client.image || "assets/Icons/user.png"}" alt="client avatar" />
      </div>

      <div class="client-center">
        <div class="client-name">${client.name || "--"} - ${client.phone || "--"}</div>
        <div class="client-amount ${debt > 0 ? "danger" : "success"}">
          ${formatMoney(debt)}
        </div>
      </div>

      <div class="client-right" aria-label="menu">
        <span class="client-menu">&#9776;</span>
      </div>
    `;

    card.addEventListener("click", () => {
      openClientInfo(client.id);
    });

    clientsList.appendChild(card);
  });
}

function renderReports() {
  const reportDateEl = document.querySelector("#screen-reports #report-date");
  const reportCashValue = document.getElementById("report-cash-value");
  const reportCreditValue = document.getElementById("report-credit-value");
  const reportExpenseValue = document.getElementById("report-expense-value");
  const reportProfitValue = document.getElementById("report-profit-value");
  const reportTotalDebtValue = document.getElementById("report-total-debt-value");

  const today = getTodayDate();

  const cashTotal = state.sales
    .filter((sale) => sale.date === today && sale.type === "cash")
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);

  const creditTotal = state.sales
    .filter((sale) => sale.date === today && sale.type === "credit")
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);

  const expenseTotal = state.expenses
    .filter((expense) => expense.date === today)
    .reduce((sum, expense) => sum + Number(expense.amount || 0), 0);

  const totalDebt = state.clients.reduce((sum, client) => {
    return sum + getClientDebt(client.id);
  }, 0);

  const profit = cashTotal + creditTotal - expenseTotal;

  if (reportDateEl) reportDateEl.textContent = `Aujourd'hui - ${formatDisplayDate(new Date())}`;
  if (reportCashValue) reportCashValue.textContent = formatMoney(cashTotal);
  if (reportCreditValue) reportCreditValue.textContent = formatMoney(creditTotal);
  if (reportExpenseValue) reportExpenseValue.textContent = formatMoney(expenseTotal);
  if (reportProfitValue) reportProfitValue.textContent = formatMoney(profit);
  if (reportTotalDebtValue) reportTotalDebtValue.textContent = formatMoney(totalDebt);
}

/* =========================
   HELPERS
========================= */
function getTodayDate() {
  return new Date().toISOString().split("T")[0];
}

function formatMoney(amount) {
  return `${Number(amount || 0).toFixed(2)} DH`;
}

function formatDisplayDate(date) {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function getClientDebt(clientId) {
  const totalCredit = state.sales
    .filter((sale) => sale.type === "credit" && sale.clientId === clientId)
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);

  const totalPaid = state.payments
    .filter((payment) => payment.clientId === clientId)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  return totalCredit - totalPaid;
}