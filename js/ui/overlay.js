import { state } from "../state.js";
import { saveCurrentUserAppData } from "../storage.js";
import {
  formatMoney,
  formatDisplayDate,
  getTodayDate,
  getCurrentTime,
  generateId,
  escapeHtml,
  toNumber,
  DEFAULT_USER_IMAGE
} from "../helpers.js";
import {
  getClientDebt,
  getClientCreditConsumed,
  getClientPaidTotal,
  renderClients
} from "../screens/clients.js";
import { renderReports } from "../screens/reports.js";
import { renderHome } from "../screens/home.js";

export function bindOverlayEvents() {
  const overlayCloseArea = document.getElementById("overlay-close-area");
  const close1 = document.getElementById("btn-overlay-close-1");
  const close2 = document.getElementById("btn-overlay-close-2");
  const close3 = document.getElementById("btn-overlay-close-3");
  const btnOpenPayment = document.getElementById("btn-open-payment");
  const btnOpenReport = document.getElementById("btn-open-report");
  const btnPaymentSave = document.getElementById("btn-payment-save");

  overlayCloseArea?.addEventListener("click", closeOverlay);
  close1?.addEventListener("click", closeOverlay);
  close2?.addEventListener("click", closeOverlay);
  close3?.addEventListener("click", closeOverlay);

  btnOpenPayment?.addEventListener("click", openPaymentOverlay);
  btnOpenReport?.addEventListener("click", openClientReportOverlay);
  btnPaymentSave?.addEventListener("click", savePayment);
}

export function openOverlay(panelId) {
  const overlay = document.getElementById("overlay");
  if (!overlay) return;

  overlay.querySelectorAll(".overlay-panel").forEach((panel) => {
    panel.classList.add("hidden");
  });

  const target = document.getElementById(panelId);
  if (!target) return;

  target.classList.remove("hidden");
  overlay.classList.remove("hidden");
  overlay.setAttribute("aria-hidden", "false");
}

export function closeOverlay() {
  const overlay = document.getElementById("overlay");
  if (!overlay) return;

  overlay.querySelectorAll(".overlay-panel").forEach((panel) => {
    panel.classList.add("hidden");
  });

  overlay.classList.add("hidden");
  overlay.setAttribute("aria-hidden", "true");
}

export function openClientInfo(clientId) {
  const client = state.clients.find((c) => c.id === clientId);
  if (!client) return;

  state.selectedClientId = clientId;

  const consumed = getClientCreditConsumed(clientId);
  const paid = getClientPaidTotal(clientId);
  const remaining = getClientDebt(clientId);

  const root = document.getElementById("overlay-client-info");
  if (!root) return;

  root.querySelector("#overlay-client-name").textContent = client.name || "--";
  root.querySelector("#overlay-client-id").textContent = `: ${client.id || "--"}`;
  root.querySelector("#overlay-client-phone").textContent = `: ${client.phone || "--"}`;
  root.querySelector("#overlay-client-limit").textContent = `: ${formatMoney(client.limit || 0)}`;
  root.querySelector("#overlay-client-consumed").textContent = `: ${formatMoney(consumed)}`;
  root.querySelector("#overlay-client-paid").textContent = `: ${formatMoney(paid)}`;
  root.querySelector("#overlay-client-remaining").textContent = `: ${formatMoney(remaining)}`;

  const img = root.querySelector("#overlay-client-img");
  if (img) img.src = client.image || DEFAULT_USER_IMAGE;

  openOverlay("overlay-client-info");
}

export function openPaymentOverlay() {
  if (!state.selectedClientId) return;

  const client = state.clients.find((c) => c.id === state.selectedClientId);
  if (!client) return;

  const remaining = getClientDebt(client.id);
  const root = document.getElementById("overlay-payment");
  if (!root) return;

  root.querySelector("#payment-client-name").textContent = client.name || "--";
  root.querySelector("#payment-remaining").textContent = formatMoney(remaining);

  const img = root.querySelector("#payment-client-img");
  if (img) img.src = client.image || DEFAULT_USER_IMAGE;

  const amountInput = root.querySelector("#payment-amount");
  if (amountInput) amountInput.value = "";

  openOverlay("overlay-payment");
}

export function savePayment() {
  if (!state.selectedClientId) return;

  const amountInput = document.getElementById("payment-amount");
  const amount = toNumber(amountInput?.value);

  if (amount <= 0) {
    alert("Entrer un montant valide.");
    return;
  }

  const remaining = getClientDebt(state.selectedClientId);
  if (amount > remaining) {
    alert("Le montant dépasse la dette restante.");
    return;
  }

  state.payments.push({
    id: generateId("payment"),
    clientId: state.selectedClientId,
    amount,
    date: getTodayDate(),
    time: getCurrentTime(),
    createdAt: new Date().toISOString()
  });

  saveCurrentUserAppData();
  renderHome();
  renderClients();
  renderReports();
  closeOverlay();
}

export function openClientReportOverlay() {
  if (!state.selectedClientId) return;

  const client = state.clients.find((c) => c.id === state.selectedClientId);
  if (!client) return;

  const root = document.getElementById("overlay-report");
  if (!root) return;

  const clientSalesToday = state.sales.filter((sale) => (
    sale.type === "credit" &&
    sale.clientId === client.id &&
    sale.date === getTodayDate()
  ));

  const lastSale = clientSalesToday[clientSalesToday.length - 1];

  root.querySelector("#report-client-name").textContent = client.name || "--";

  const dateEl = root.querySelector("#report-date");
  if (dateEl) dateEl.textContent = formatDisplayDate(new Date());

  const timeEl = root.querySelector("#report-time");
  if (timeEl) timeEl.textContent = lastSale?.time || "--:--";

  const listEl = root.querySelector("#report-items-list");
  if (listEl) {
    if (!lastSale || !Array.isArray(lastSale.items) || lastSale.items.length === 0) {
      listEl.innerHTML = `
        <div class="report-item-row">
          <p class="report-item-name">Aucun article aujourd'hui</p>
          <p class="report-item-price">: 0.00 DH</p>
        </div>
      `;
    } else {
      listEl.innerHTML = lastSale.items.map((item) => `
        <div class="report-item-row">
          <p class="report-item-name">${escapeHtml(item.name)} x${item.qty}</p>
          <p class="report-item-price">: ${formatMoney(item.subtotal)}</p>
        </div>
      `).join("");
    }
  }

  const totalEl = root.querySelector("#report-total");
  if (totalEl) totalEl.textContent = formatMoney(lastSale?.total || 0);

  const toPayEl = root.querySelector("#report-to-pay");
  if (toPayEl) toPayEl.textContent = formatMoney(getClientDebt(client.id));

  const img = root.querySelector("#report-client-img");
  if (img) img.src = client.image || DEFAULT_USER_IMAGE;

  openOverlay("overlay-report");
}