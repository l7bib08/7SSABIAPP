import { state } from "../state.js";
import { api } from "../services/api.js";
import { generateId, formatMoney, escapeHtml, toNumber, DEFAULT_USER_IMAGE } from "../utils/helpers.js";
import { getClientDebt, loadClients, renderClients } from "./clients.js";
import { loadReports, renderReports } from "./reports.js";
import { validateSaleItem } from "../services/validators.js";
import { showToast } from "../ui/notifications.js";

export function bindCreditEvents(showScreen) {
  document.getElementById("btn-credit-add-item")?.addEventListener("click", addCreditItem);
  document.getElementById("btn-credit-save")?.addEventListener("click", saveCreditSale);
  document.getElementById("btn-credit-add-client")?.addEventListener("click", () => showScreen("screen-add-client"));
  document.getElementById("credit-client-search")?.addEventListener("input", handleCreditClientSearch);
  document.getElementById("credit-client-search")?.addEventListener("focus", handleCreditClientSearch);
  document.addEventListener("click", handleOutsideClick);
}

function handleCreditClientSearch(e) {
  const input = e?.target || document.getElementById("credit-client-search");
  const suggestionsBox = document.getElementById("credit-client-suggestions");
  if (!input || !suggestionsBox) return;

  const searchTerm = input.value.trim().toLowerCase();
  if (e?.type === "input") {
    state.selectedCreditClientId = null;
    input.removeAttribute("data-selected-client-id");
    updateCreditSelectedClientInfo(null);
  }
  if (!searchTerm) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
    return;
  }

  const matches = state.clients.filter((client) => `${client.name || ""} ${client.phone || ""}`.toLowerCase().includes(searchTerm));
  renderCreditClientSuggestions(matches);
}

function renderCreditClientSuggestions(clients) {
  const suggestionsBox = document.getElementById("credit-client-suggestions");
  if (!suggestionsBox) return;
  if (!clients.length) {
    suggestionsBox.innerHTML = `<div class="credit-suggestion-empty">Aucun client trouvé</div>`;
    suggestionsBox.classList.remove("hidden");
    return;
  }
  suggestionsBox.innerHTML = clients.map((client) => {
    const debt = getClientDebt(client.id);
    return `<button type="button" class="credit-client-simple" data-credit-client-id="${escapeHtml(client.id)}">
      <div class="credit-client-info"><div class="credit-client-name">${escapeHtml(client.name || "Client")}</div><div class="credit-client-phone">${escapeHtml(client.phone || "--")}</div></div>
      <div class="credit-client-debt ${debt > 0 ? "danger" : "success"}">${formatMoney(debt)}</div>
    </button>`;
  }).join("");
  suggestionsBox.classList.remove("hidden");
  suggestionsBox.querySelectorAll("[data-credit-client-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const client = state.clients.find((c) => String(c.id) === String(btn.dataset.creditClientId));
      if (client) selectCreditClient(client);
    });
  });
}

function selectCreditClient(client) {
  const input = document.getElementById("credit-client-search");
  const infoBox = document.getElementById("credit-selected-client-info");
  const suggestionsBox = document.getElementById("credit-client-suggestions");
  if (!input || !infoBox) return;
  state.selectedCreditClientId = client.id;
  input.value = client.name || "";
  input.setAttribute("data-selected-client-id", client.id);
  const debt = getClientDebt(client.id);
  infoBox.innerHTML = `<div class="selected-client-card"><img src="${client.image || DEFAULT_USER_IMAGE}" class="selected-client-avatar" alt="client avatar" /><div class="selected-client-name">${escapeHtml(client.name || "--")}</div><div class="selected-client-phone">${escapeHtml(client.phone || "--")}</div><div class="selected-client-debt ${debt > 0 ? "danger" : "success"}">${formatMoney(debt)}</div></div>`;
  infoBox.classList.remove("hidden");
  if (suggestionsBox) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
  }
}

function updateCreditSelectedClientInfo(client) {
  const infoBox = document.getElementById("credit-selected-client-info");
  if (!infoBox || client) return;
  infoBox.innerHTML = "";
  infoBox.classList.add("hidden");
}

function handleOutsideClick(e) {
  const searchInput = document.getElementById("credit-client-search");
  const suggestionsBox = document.getElementById("credit-client-suggestions");
  if (!searchInput || !suggestionsBox) return;
  if (!searchInput.contains(e.target) && !suggestionsBox.contains(e.target)) suggestionsBox.classList.add("hidden");
}

function addCreditItem() {
  const name = document.getElementById("credit-article-name")?.value.trim();
  const price = toNumber(document.getElementById("credit-article-price")?.value);
  const qty = toNumber(document.getElementById("credit-article-qty")?.value || 1);
  const error = validateSaleItem({ name, price, qty });
  if (error) return showToast(error, "error");
  state.creditDraftItems.push({ id: generateId("credit_item"), product_name: name, name, unit_price: price, price, quantity: qty, qty, subtotal: price * qty });
  renderCreditDraft();
  clearCreditInputs();
}

function renderCreditDraft() {
  const listEl = document.getElementById("credit-items");
  const totalEl = document.getElementById("credit-total");
  if (!listEl || !totalEl) return;
  if (!state.creditDraftItems.length) {
    listEl.innerHTML = "";
    totalEl.textContent = formatMoney(0);
    return;
  }
  listEl.innerHTML = state.creditDraftItems.map((item) => `<div class="draft-row"><div class="draft-col draft-col-name"><strong>${escapeHtml(item.name)}</strong><small>${item.qty} x ${formatMoney(item.price)}</small></div><div class="draft-col draft-col-total"><strong>${formatMoney(item.subtotal)}</strong></div><div class="draft-col draft-col-action"><button type="button" data-remove-credit-item="${item.id}" class="draft-remove-btn">Supprimer</button></div></div>`).join("");
  totalEl.textContent = formatMoney(state.creditDraftItems.reduce((sum, item) => sum + item.subtotal, 0));
  listEl.querySelectorAll("[data-remove-credit-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.creditDraftItems = state.creditDraftItems.filter((item) => item.id !== btn.dataset.removeCreditItem);
      renderCreditDraft();
    });
  });
}

async function saveCreditSale() {
  if (!state.selectedCreditClientId) return showToast("Sélectionne un client dans la liste.", "error");
  if (!state.creditDraftItems.length) return showToast("Ajoute au moins un article.", "error");
  const client = state.clients.find((c) => String(c.id) === String(state.selectedCreditClientId));
  const total = state.creditDraftItems.reduce((sum, item) => sum + item.subtotal, 0);
  const limit = Number(client?.credit_limit || client?.limit || 0);
  if (limit > 0 && getClientDebt(client.id) + total > limit) return showToast("Cette vente dépasse la limite de crédit du client.", "error");

  try {
    await api.createSale({ type: "credit", client_id: state.selectedCreditClientId, total_amount: total, items: state.creditDraftItems });
    state.creditDraftItems = [];
    state.selectedCreditClientId = null;
    renderCreditDraft();
    clearCreditInputs();
    const clientInput = document.getElementById("credit-client-search");
    if (clientInput) clientInput.value = "";
    updateCreditSelectedClientInfo(null);
    await Promise.all([loadClients(), loadReports()]);
    renderClients();
    renderReports();
    showToast("Vente à crédit enregistrée.", "success");
  } catch (error) {
    showToast(error.message, "error");
  }
}

function clearCreditInputs() {
  ["credit-article-name", "credit-article-price", "credit-article-qty"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}
