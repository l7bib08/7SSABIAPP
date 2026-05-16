import { state } from "../state.js";
import { api } from "../services/api.js";
import { formatMoney, formatDisplayDate } from "../utils/helpers.js";

export function bindHomeEvents(showScreen) {
  document.getElementById("go-cash")?.addEventListener("click", () => {
    showScreen("screen-cash");
  });

  document.getElementById("go-credit")?.addEventListener("click", () => {
    showScreen("screen-credit");
  });

  document.getElementById("go-expense")?.addEventListener("click", () => {
    showScreen("screen-expense");
  });

  document.getElementById("btn-back-home-from-cash")?.addEventListener("click", async () => {
    await loadHomeData();
    renderHome();
    showScreen("screen-home");
  });

  document.getElementById("btn-go-credit-from-cash")?.addEventListener("click", () => {
    showScreen("screen-credit");
  });

  document.getElementById("btn-back-cash-from-credit")?.addEventListener("click", () => {
    showScreen("screen-cash");
  });

  document.getElementById("btn-go-expense-from-credit")?.addEventListener("click", () => {
    showScreen("screen-expense");
  });

  document.getElementById("btn-back-credit-from-expense")?.addEventListener("click", () => {
    showScreen("screen-credit");
  });
}

export async function loadHomeData() {
  const data = await api.getDashboard();

  state.dashboard = {
    salesToday: Number(data.sales_today || 0),
    expensesToday: Number(data.expenses_today || 0),
    profitToday: Number(data.profit_today || 0),
    date: data.date
  };
}

export function renderHome() {
  const d = state.dashboard || {};

  const salesTodayEl = document.getElementById("stat-sales-today");
  const expensesTodayEl = document.getElementById("stat-expenses-today");
  const profitTodayEl = document.getElementById("stat-profit-today");
  const homeDateEl = document.getElementById("home-date");

  if (salesTodayEl) {
    salesTodayEl.textContent = formatMoney(d.salesToday || 0);
  }

  if (expensesTodayEl) {
    expensesTodayEl.textContent = formatMoney(d.expensesToday || 0);
  }

  if (profitTodayEl) {
    profitTodayEl.textContent = formatMoney(d.profitToday || 0);
  }

  if (homeDateEl) {
    homeDateEl.textContent = formatDisplayDate(new Date());
  }
}