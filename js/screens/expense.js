import { state } from "../state.js";
import { saveCurrentUserAppData } from "../storage.js";
import { generateId, getTodayDate, getCurrentTime, toNumber } from "../helpers.js";
import { renderHome } from "./home.js";
import { renderReports } from "./reports.js";

export function bindExpenseEvents() {
  document.getElementById("btn-expense-save")?.addEventListener("click", saveExpense);
  document.getElementById("go-add-expense")?.addEventListener("click", clearExpenseForm);
}

function saveExpense() {
  const typeInput = document.getElementById("expense-type");
  const amountInput = document.getElementById("expense-amount");
  const notesInput = document.getElementById("expense-notes");

  const label = typeInput?.value.trim();
  const amount = toNumber(amountInput?.value);
  const note = notesInput?.value.trim() || "";

  if (!label || amount <= 0) {
    alert("Entrer une dépense valide.");
    return;
  }

  state.expenses.push({
    id: generateId("expense"),
    label,
    amount,
    note,
    date: getTodayDate(),
    time: getCurrentTime(),
    createdAt: new Date().toISOString()
  });

  saveCurrentUserAppData();
  renderHome();
  renderReports();
  clearExpenseForm();

  alert("Dépense enregistrée.");
}

function clearExpenseForm() {
  const ids = ["expense-type", "expense-amount", "expense-notes"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}