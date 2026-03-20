import { state } from "../state.js";
import { getTodayDate, formatMoney, formatDisplayDate } from "../helpers.js";

export function bindHomeEvents(showScreen) {
  document.getElementById("go-cash")?.addEventListener("click", () => showScreen("screen-cash"));
  document.getElementById("go-credit")?.addEventListener("click", () => showScreen("screen-credit"));
  document.getElementById("go-expense")?.addEventListener("click", () => showScreen("screen-expense"));

  document.getElementById("btn-back-home-from-cash")?.addEventListener("click", () => showScreen("screen-home"));
  document.getElementById("btn-go-credit-from-cash")?.addEventListener("click", () => showScreen("screen-credit"));

  document.getElementById("btn-back-cash-from-credit")?.addEventListener("click", () => showScreen("screen-cash"));
  document.getElementById("btn-go-expense-from-credit")?.addEventListener("click", () => showScreen("screen-expense"));

  document.getElementById("btn-back-credit-from-expense")?.addEventListener("click", () => showScreen("screen-credit"));
}

export function renderHome() {
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