import { state } from "../state.js";
import { saveData } from "../storage.js";
import { generateId, getTodayDate, getCurrentTime, formatMoney, escapeHtml, toNumber } from "../helpers.js";
import { getClientDebt, renderClients } from "./clients.js";
import { renderReports } from "./reports.js";

export function bindCreditEvents(showScreen) {
  document.getElementById("btn-credit-add-item")?.addEventListener("click", addCreditItem);
  document.getElementById("btn-credit-save")?.addEventListener("click", saveCreditSale);
  document.getElementById("btn-credit-add-client")?.addEventListener("click", () => showScreen("screen-add-client"));
}

function addCreditItem() {
  const nameInput = document.getElementById("credit-article-name");
  const priceInput = document.getElementById("credit-article-price");
  const qtyInput = document.getElementById("credit-article-qty");

  const name = nameInput?.value.trim();
  const price = toNumber(priceInput?.value);
  const qty = toNumber(qtyInput?.value || 1);

  if (!name || price <= 0 || qty <= 0) {
    alert("Entrer un article valide.");
    return;
  }

  state.creditDraftItems.push({
    id: generateId("credit_item"),
    name,
    price,
    qty,
    subtotal: price * qty
  });

  renderCreditDraft();
  clearCreditInputs();
}

function renderCreditDraft() {
  const listEl = document.getElementById("credit-items");
  const totalEl = document.getElementById("credit-total");
  if (!listEl || !totalEl) return;

  if (state.creditDraftItems.length === 0) {
    listEl.innerHTML = "";
    totalEl.textContent = formatMoney(0);
    return;
  }

  listEl.innerHTML = state.creditDraftItems.map((item) => `
    <div style="display:flex; justify-content:space-between; align-items:center; margin:8px 0; padding:10px; border:1px solid #ddd; border-radius:12px;">
      <div>
        <strong>${escapeHtml(item.name)}</strong><br>
        <small>${item.qty} x ${formatMoney(item.price)}</small>
      </div>
      <div style="text-align:right;">
        <strong>${formatMoney(item.subtotal)}</strong><br>
        <button type="button" data-remove-credit-item="${item.id}" style="margin-top:4px;">Supprimer</button>
      </div>
    </div>
  `).join("");

  const total = state.creditDraftItems.reduce((sum, item) => sum + item.subtotal, 0);
  totalEl.textContent = formatMoney(total);

  listEl.querySelectorAll("[data-remove-credit-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-remove-credit-item");
      state.creditDraftItems = state.creditDraftItems.filter((item) => item.id !== id);
      renderCreditDraft();
    });
  });
}

function saveCreditSale() {
  const clientSearch = document.getElementById("credit-client-search");
  const clientName = clientSearch?.value.trim().toLowerCase();

  if (!clientName) {
    alert("Entrer le nom du client.");
    return;
  }

  const client = state.clients.find((c) =>
    (c.name || "").trim().toLowerCase() === clientName
  );

  if (!client) {
    alert("Client introuvable. Ajoute-le d'abord.");
    return;
  }

  if (state.creditDraftItems.length === 0) {
    alert("Ajoute au moins un article.");
    return;
  }

  const total = state.creditDraftItems.reduce((sum, item) => sum + item.subtotal, 0);
  const currentDebt = getClientDebt(client.id);
  const limit = Number(client.limit || 0);

  if (limit > 0 && currentDebt + total > limit) {
    alert("Cette vente dépasse la limite de crédit du client.");
    return;
  }

  state.sales.push({
    id: generateId("sale"),
    type: "credit",
    clientId: client.id,
    items: [...state.creditDraftItems],
    total,
    date: getTodayDate(),
    time: getCurrentTime(),
    createdAt: new Date().toISOString()
  });

  state.creditDraftItems = [];
  renderCreditDraft();
  clearCreditInputs();
  if (clientSearch) clientSearch.value = "";

  saveData();
  renderClients();
  renderReports();

  alert("Vente à crédit enregistrée.");
}

function clearCreditInputs() {
  const ids = ["credit-article-name", "credit-article-price", "credit-article-qty"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}