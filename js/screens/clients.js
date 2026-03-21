import { state } from "../state.js";
import { saveData } from "../storage.js";
import { formatMoney, generateId, readFileAsDataURL, escapeHtml, toNumber } from "../helpers.js";
import { openClientInfo } from "../ui/overlay.js";

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

  document.getElementById("clients-search")?.addEventListener("input", () => {
    renderClients();
  });

  document.getElementById("clients-list")?.addEventListener("click", (e) => {
    const card = e.target.closest(".client-card");
    if (!card) return;

    const clientId = card.dataset.clientId;
    if (!clientId) return;

    openClientInfo(clientId);
  });
}

export function getClientCreditConsumed(clientId) {
  return state.sales
    .filter((sale) => sale.type === "credit" && sale.clientId === clientId)
    .reduce((sum, sale) => sum + Number(sale.total || 0), 0);
}

export function getClientPaidTotal(clientId) {
  return state.payments
    .filter((payment) => payment.clientId === clientId)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

export function getClientDebt(clientId) {
  return getClientCreditConsumed(clientId) - getClientPaidTotal(clientId);
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

  const totalDebt = state.clients.reduce((sum, client) => sum + getClientDebt(client.id), 0);
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
          <img class="client-avatar" src="${client.image || "assets/Icons/user.png"}" alt="client avatar" />
        </div>

        <div class="client-center">
          <div class="client-name">${escapeHtml(client.name || "--")} - ${escapeHtml(client.phone || "--")}</div>
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
  const nameInput = document.getElementById("client-name");
  const phoneInput = document.getElementById("client-phone");
  const limitInput = document.getElementById("client-limit");
  const imageInput = document.getElementById("client-image");

  const name = nameInput?.value.trim();
  const phone = phoneInput?.value.trim();
  const limit = toNumber(limitInput?.value);
  const file = imageInput?.files?.[0];

  if (!name || !phone) {
    alert("Le nom et le téléphone sont obligatoires.");
    return;
  }

  const image = await readFileAsDataURL(file);

  state.clients.push({
    id: generateId("client"),
    name,
    phone,
    limit,
    image: image || "",
    createdAt: new Date().toISOString()
  });

  saveData();
  renderClients();
  clearAddClientForm();
  showScreen("screen-clients");
}

function clearAddClientForm() {
  const ids = ["client-name", "client-phone", "client-limit", "client-image"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
}