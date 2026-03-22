import { state } from "../state.js";
import { saveCurrentUserAppData } from "../services/storage.js";
import {
  generateId,
  getTodayDate,
  getCurrentTime,
  formatMoney,
  escapeHtml,
  toNumber,
  DEFAULT_USER_IMAGE
} from "../utils/helpers.js";
import { getClientDebt, renderClients } from "./clients.js";
import { renderReports } from "./reports.js";
import { validateSaleItem } from "../services/validators.js";
import { showToast } from "../ui/notifications.js";

export function bindCreditEvents(showScreen) {
  document.getElementById("btn-credit-add-item")?.addEventListener("click", addCreditItem);
  document.getElementById("btn-credit-save")?.addEventListener("click", saveCreditSale);

  document.getElementById("btn-credit-add-client")?.addEventListener("click", () => {
    showScreen("screen-add-client");
  });

  document.getElementById("credit-client-search")?.addEventListener("input", handleCreditClientSearch);
  document.getElementById("credit-client-search")?.addEventListener("focus", handleCreditClientSearch);

  document.addEventListener("click", handleOutsideClick);
}

function handleCreditClientSearch(e) {
  const input = e?.target || document.getElementById("credit-client-search");
  if (!input) return;

  const searchTerm = input.value.trim().toLowerCase();
  const suggestionsBox = document.getElementById("credit-client-suggestions");

  if (!suggestionsBox) return;

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

  const matches = state.clients.filter((client) => {
    const name = (client.name || "").toLowerCase();
    const phone = (client.phone || "").toLowerCase();
    return name.includes(searchTerm) || phone.includes(searchTerm);
  });

  renderCreditClientSuggestions(matches);
}

function renderCreditClientSuggestions(clients) {
  const suggestionsBox = document.getElementById("credit-client-suggestions");
  if (!suggestionsBox) return;

  if (!clients.length) {
    suggestionsBox.innerHTML = `
      <div class="credit-suggestion-empty">
        Aucun client trouvé
      </div>
    `;
    suggestionsBox.classList.remove("hidden");
    return;
  }

  suggestionsBox.innerHTML = clients.map((client) => {
    const debt = getClientDebt(client.id);

    return `
      <button
        type="button"
        class="credit-client-simple"
        data-credit-client-id="${escapeHtml(client.id)}"
      >
        <div class="credit-client-info">
          <div class="credit-client-name">
            ${escapeHtml(client.name || "Client")}
          </div>
          <div class="credit-client-phone">
            ${escapeHtml(client.phone || "--")}
          </div>
        </div>

        <div class="credit-client-debt ${debt > 0 ? "danger" : "success"}">
          ${formatMoney(debt)}
        </div>
      </button>
    `;
  }).join("");

  suggestionsBox.classList.remove("hidden");

  suggestionsBox.querySelectorAll("[data-credit-client-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const clientId = btn.getAttribute("data-credit-client-id");
      const client = state.clients.find((c) => c.id === clientId);
      if (!client) return;

      selectCreditClient(client);
    });
  });
}

function selectCreditClient(client) {
  const input = document.getElementById("credit-client-search");
  const infoBox = document.getElementById("credit-selected-client-info");
  const suggestionsBox = document.getElementById("credit-client-suggestions");

  if (!input || !infoBox) return;

  state.selectedCreditClientId = client.id;
  const debt = getClientDebt(client.id);

  input.value = client.name || "";
  input.setAttribute("data-selected-client-id", client.id);

  infoBox.innerHTML = `
    <div class="selected-client-card">
      <img
        src="${client.image || DEFAULT_USER_IMAGE}"
        class="selected-client-avatar"
        alt="client avatar"
      />

      <div class="selected-client-name">
        ${escapeHtml(client.name || "--")}
      </div>

      <div class="selected-client-phone">
        ${escapeHtml(client.phone || "--")}
      </div>

      <div class="selected-client-debt ${debt > 0 ? "danger" : "success"}">
        ${formatMoney(debt)}
      </div>
    </div>
  `;

  infoBox.classList.remove("hidden");

  if (suggestionsBox) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
  }
}

function updateCreditSelectedClientInfo(client) {
  const infoBox = document.getElementById("credit-selected-client-info");
  if (!infoBox) return;

  if (!client) {
    infoBox.innerHTML = "";
    infoBox.classList.add("hidden");
  }
}

function handleOutsideClick(e) {
  const searchInput = document.getElementById("credit-client-search");
  const suggestionsBox = document.getElementById("credit-client-suggestions");

  if (!searchInput || !suggestionsBox) return;

  const clickedInsideInput = searchInput.contains(e.target);
  const clickedInsideSuggestions = suggestionsBox.contains(e.target);

  if (!clickedInsideInput && !clickedInsideSuggestions) {
    suggestionsBox.classList.add("hidden");
  }
}

function addCreditItem() {
  const nameInput = document.getElementById("credit-article-name");
  const priceInput = document.getElementById("credit-article-price");
  const qtyInput = document.getElementById("credit-article-qty");

  const name = nameInput?.value.trim();
  const price = toNumber(priceInput?.value);
  const qty = toNumber(qtyInput?.value || 1);

  const error = validateSaleItem({ name, price, qty });
  if (error) {
    showToast(error, "error");
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
          data-remove-credit-item="${item.id}"
          class="draft-remove-btn"
        >
          Supprimer
        </button>
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
  const clientInput = document.getElementById("credit-client-search");

  if (!state.selectedCreditClientId) {
    showToast("Sélectionne un client dans la liste.", "error");
    return;
  }

  const client = state.clients.find((c) => c.id === state.selectedCreditClientId);
  if (!client) {
    showToast("Client introuvable.", "error");
    return;
  }

  if (state.creditDraftItems.length === 0) {
    showToast("Ajoute au moins un article.", "error");
    return;
  }

  const total = state.creditDraftItems.reduce((sum, item) => sum + item.subtotal, 0);
  const currentDebt = getClientDebt(client.id);
  const limit = Number(client.limit || 0);

  if (limit > 0 && currentDebt + total > limit) {
    showToast("Cette vente dépasse la limite de crédit du client.", "error");
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
  state.selectedCreditClientId = null;

  renderCreditDraft();
  clearCreditInputs();

  if (clientInput) {
    clientInput.value = "";
    clientInput.removeAttribute("data-selected-client-id");
  }

  const suggestionsBox = document.getElementById("credit-client-suggestions");
  if (suggestionsBox) {
    suggestionsBox.innerHTML = "";
    suggestionsBox.classList.add("hidden");
  }

  updateCreditSelectedClientInfo(null);

  saveCurrentUserAppData();
  renderClients();
  renderReports();

  showToast("Vente à crédit enregistrée.", "success");
}

function clearCreditInputs() {
  const ids = ["credit-article-name", "credit-article-price", "credit-article-qty"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}