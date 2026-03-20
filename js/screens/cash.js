import { state } from "../state.js";
import { saveData } from "../storage.js";
import { generateId, getTodayDate, getCurrentTime, formatMoney, escapeHtml, toNumber } from "../helpers.js";
import { renderHome } from "./home.js";
import { renderReports } from "./reports.js";

export function bindCashEvents() {
  document.getElementById("btn-cash-add-item")?.addEventListener("click", addCashItem);
  document.getElementById("btn-cash-save")?.addEventListener("click", saveCashSale);
}

function addCashItem() {
  const nameInput = document.getElementById("cash-article-name");
  const priceInput = document.getElementById("cash-article-price");
  const qtyInput = document.getElementById("cash-article-qty");

  const name = nameInput?.value.trim();
  const price = toNumber(priceInput?.value);
  const qty = toNumber(qtyInput?.value || 1);

  if (!name || price <= 0 || qty <= 0) {
    alert("Entrer un article valide.");
    return;
  }

  state.cashDraftItems.push({
    id: generateId("cash_item"),
    name,
    price,
    qty,
    subtotal: price * qty
  });

  renderCashDraft();
  clearCashInputs();
}

function renderCashDraft() {
  const listEl = document.getElementById("cash-items");
  const totalEl = document.getElementById("cash-total");
  if (!listEl || !totalEl) return;

  if (state.cashDraftItems.length === 0) {
    listEl.innerHTML = "";
    totalEl.textContent = formatMoney(0);
    return;
  }

  listEl.innerHTML = state.cashDraftItems.map((item) => `
    <div style="display:flex; justify-content:space-between; align-items:center; margin:8px 0; padding:10px; border:1px solid #ddd; border-radius:12px;">
      <div>
        <strong>${escapeHtml(item.name)}</strong><br>
        <small>${item.qty} x ${formatMoney(item.price)}</small>
      </div>
      <div style="text-align:right;">
        <strong>${formatMoney(item.subtotal)}</strong><br>
        <button type="button" data-remove-cash-item="${item.id}" style="margin-top:4px;">Supprimer</button>
      </div>
    </div>
  `).join("");

  const total = state.cashDraftItems.reduce((sum, item) => sum + item.subtotal, 0);
  totalEl.textContent = formatMoney(total);

  listEl.querySelectorAll("[data-remove-cash-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove-cash-item");
      state.cashDraftItems = state.cashDraftItems.filter((item) => item.id !== id);
      renderCashDraft();
    });
  });
}

function saveCashSale() {
  if (state.cashDraftItems.length === 0) {
    alert("Ajoute au moins un article.");
    return;
  }

  const total = state.cashDraftItems.reduce((sum, item) => sum + item.subtotal, 0);

  state.sales.push({
    id: generateId("sale"),
    type: "cash",
    clientId: null,
    items: [...state.cashDraftItems],
    total,
    date: getTodayDate(),
    time: getCurrentTime(),
    createdAt: new Date().toISOString()
  });

  state.cashDraftItems = [];
  renderCashDraft();
  clearCashInputs();
  saveData();
  renderHome();
  renderReports();

  alert("Vente cash enregistrée.");
}

function clearCashInputs() {
  const ids = ["cash-article-name", "cash-article-price", "cash-article-qty"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}