import { api } from "../services/api.js";
import { toNumber } from "../utils/helpers.js";
import { loadHomeData, renderHome } from "./home.js";
import { loadReports, renderReports } from "./reports.js";
import { validateExpenseData } from "../services/validators.js";
import { showToast } from "../ui/notifications.js";

export function bindExpenseEvents() {
  document.getElementById("btn-expense-save")?.addEventListener("click", saveExpense);
  document.getElementById("go-add-expense")?.addEventListener("click", clearExpenseForm);
}

async function saveExpense() {
  const label = document.getElementById("expense-type")?.value.trim();
  const amount = toNumber(document.getElementById("expense-amount")?.value);
  const note = document.getElementById("expense-notes")?.value.trim() || "";
  const error = validateExpenseData({ label, amount });
  if (error) return showToast(error, "error");

  try {
    await api.createExpense({ title: label, amount, notes: note });
    await Promise.all([loadHomeData(), loadReports()]);
    renderHome();
    renderReports();
    clearExpenseForm();
    showToast("Dépense enregistrée.", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

function clearExpenseForm() {
  ["expense-type", "expense-amount", "expense-notes"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
