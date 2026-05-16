import { state } from "../state.js";
import { api } from "../services/api.js";
import {
  formatMoney,
  escapeHtml,
  toNumber,
  DEFAULT_USER_IMAGE,
  normalizePhone
} from "../utils/helpers.js";
import { openClientInfo } from "../overlay/overlay.js";
import { validateClientData } from "../services/validators.js";
import { showToast } from "../ui/notifications.js";

export function bindClientEvents(showScreen) {
  document.getElementById("go-add-client")?.addEventListener("click", () => {
    clearAddClientForm();
    showScreen("screen-add-client");
  });

  document.getElementById("btn-credit-add-client")?.addEventListener("click", () => {
    clearAddClientForm();
    showScreen("screen-add-client");
  });

  document.getElementById("btn-save-client")?.addEventListener("click", async () => {
    await saveClient(showScreen);
  });

  document.getElementById("clients-search")?.addEventListener("input", renderClients);

  document.getElementById("clients-list")?.addEventListener("click", (e) => {
    const card = e.target.closest(".client-card");
    if (card?.dataset.clientId) {
      openClientInfo(card.dataset.clientId);
    }
  });

  document.getElementById("btn-update-client")?.addEventListener("click", async () => {
    await updateClient(showScreen);
  });

  document.getElementById("btn-cancel-edit-client")?.addEventListener("click", () => {
      showScreen("screen-clients");
  });
}

export async function loadClients() {
  const data = await api.getClients();
  state.clients = data.clients || [];
}

export function getClientDebt(clientId) {
  const client = state.clients.find((c) => String(c.id) === String(clientId));
  return Number(client?.debt || client?.remaining_debt || 0);
}

export function getClientCreditConsumed(clientId) {
  const client = state.clients.find((c) => String(c.id) === String(clientId));
  return Number(client?.credit_consumed || 0);
}

export function getClientPaidTotal(clientId) {
  const client = state.clients.find((c) => String(c.id) === String(clientId));
  return Number(client?.paid_total || 0);
}

export function renderClients() {
  const clientsList = document.getElementById("clients-list");
  const summary = document.getElementById("clients-summary");
  const searchInput = document.getElementById("clients-search");

  if (!clientsList || !summary) return;

  const searchTerm = searchInput?.value.trim().toLowerCase() || "";

  const filteredClients = state.clients.filter((client) => {
    const text = `${client.name || ""} ${client.phone || ""}`.toLowerCase();
    return text.includes(searchTerm);
  });

  const totalDebt = state.clients.reduce((sum, client) => {
    return sum + getClientDebt(client.id);
  }, 0);

  summary.textContent = `${state.clients.length} clients • Dette totale : ${formatMoney(totalDebt)}`;

  if (filteredClients.length === 0) {
    clientsList.innerHTML = `
      <p style="text-align:center; margin-top:20px;">
        ${state.clients.length === 0 ? "Aucun client enregistré" : "Aucun résultat trouvé"}
      </p>
    `;
    return;
  }

  clientsList.innerHTML = filteredClients.map((client) => {
    const debt = getClientDebt(client.id);

    return `
      <div class="client-card" data-client-id="${escapeHtml(client.id)}">
        <div class="client-left">
          <img class="client-avatar" src="${client.image || DEFAULT_USER_IMAGE}" alt="client avatar" />
        </div>

        <div class="client-center">
          <div class="client-name">
            ${escapeHtml(client.name || "--")} - ${escapeHtml(client.phone || "--")}
          </div>

          <div class="client-amount ${debt > 0 ? "danger" : "success"}">
            ${formatMoney(debt)}
          </div>
        </div>

        <div class="client-right" aria-label="menu">
          <span class="client-menu">&#9776;</span>
        </div>
      </div>
    `;
  }).join("");
}

async function saveClient(showScreen) {
  const name = document.getElementById("client-name")?.value.trim();
  const phone = normalizePhone(document.getElementById("client-phone")?.value);
  const limitRaw = document.getElementById("client-limit")?.value;
  const limit = toNumber(limitRaw);

  const error = validateClientData({ name, phone, limit: limitRaw });
  if (error) {
    showToast(error, "error");
    return;
  }

  try {
    await api.createClient({
      name,
      phone,
      limit
    });

    await loadClients();
    renderClients();
    clearAddClientForm();

    showToast("Client enregistré avec succès.", "success");
    showScreen("screen-clients");
  } catch (error) {
    showToast(error.message, "error");
  }
}

function clearAddClientForm() {
  ["client-name", "client-phone", "client-limit", "client-image"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}

async function updateClient(showScreen) {
    const name  = document.getElementById("edit-client-name")?.value.trim();
    const phone = document.getElementById("edit-client-phone")?.value.trim();
    const limit = document.getElementById("edit-client-limit")?.value;

    const error = validateClientData({ name, phone, limit });
    if (error) {
        showToast(error, "error");
        return;
    }

    try {
        await api.updateClient(state.selectedClientId, {
            name,
            phone,
            limit: toNumber(limit)
        });

        await loadClients();
        renderClients();
        showToast("Client modifié avec succès.", "success");
        showScreen("screen-clients");
    } catch (error) {
        showToast(error.message, "error");
    }
}