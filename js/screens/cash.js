import { state } from "../state.js";
import { saveCurrentUserAppData } from "../services/storage.js";
import {
  generateId,
  getTodayDate,
  getCurrentTime,
  formatMoney,
  escapeHtml,
  toNumber
} from "../utils/helpers.js";
import { renderHome } from "./home.js";
import { renderReports } from "./reports.js";
import { validateSaleItem } from "../services/validators.js";
import { showToast } from "../ui/notifications.js";

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

  const error = validateSaleItem({ name, price, qty });
  if (error) {
    showToast(error, "error");
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
    <div class="draft-row">
      <div class="draft-col draft-col-name">
        <strong>${escapeHtml(item.name)}</strong>
        <small>${item.qty} x ${formatMoney(item.price)}</small>
      </div>

      <div class="draft-col draft-col-total">
        <strong>${formatMoney(item.subtotal)}</strong>
      </div>

      <div class="draft-col draft-col-action">
        <button
          type="button"
          data-remove-cash-item="${item.id}"
          class="draft-remove-btn"
        >
          Supprimer
        </button>
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
    showToast("Ajoute au moins un article.", "error");
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
  saveCurrentUserAppData();
  renderHome();
  renderReports();

  showToast("Vente cash enregistrée.", "success");
}

function clearCashInputs() {
  const ids = ["cash-article-name", "cash-article-price", "cash-article-qty"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}