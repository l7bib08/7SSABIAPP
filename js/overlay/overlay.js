import { state } from "../state.js";
import { api } from "../services/api.js";
import { formatMoney, formatDisplayDate, escapeHtml, toNumber, DEFAULT_USER_IMAGE } from "../utils/helpers.js";
import { getClientDebt, getClientCreditConsumed, getClientPaidTotal, loadClients, renderClients } from "../screens/clients.js";
import { loadReports, renderReports } from "../screens/reports.js";
import { loadHomeData, renderHome } from "../screens/home.js";
import { validatePaymentAmount } from "../services/validators.js";
import { showToast } from "../ui/notifications.js";

export function bindOverlayEvents() {
    document.getElementById("overlay-close-area")?.addEventListener("click", closeOverlay);
    document.getElementById("btn-overlay-close-1")?.addEventListener("click", closeOverlay);
    document.getElementById("btn-overlay-close-2")?.addEventListener("click", closeOverlay);
    document.getElementById("btn-overlay-close-3")?.addEventListener("click", closeOverlay);
    document.getElementById("btn-open-payment")?.addEventListener("click", openPaymentOverlay);
    document.getElementById("btn-open-report")?.addEventListener("click", openClientReportOverlay);
    document.getElementById("btn-payment-save")?.addEventListener("click", savePayment);

    // Nouveaux boutons
    document.getElementById("btn-delete-client")?.addEventListener("click", deleteClient);
    document.getElementById("btn-edit-client")?.addEventListener("click", openEditClientOverlay);
}

export function openOverlay(panelId) {
    const overlay = document.getElementById("overlay");
    if (!overlay) return;
    overlay.querySelectorAll(".overlay-panel").forEach((panel) => panel.classList.add("hidden"));
    document.getElementById(panelId)?.classList.remove("hidden");
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
}

export function closeOverlay() {
    const overlay = document.getElementById("overlay");
    if (!overlay) return;
    overlay.querySelectorAll(".overlay-panel").forEach((panel) => panel.classList.add("hidden"));
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
}

export function openClientInfo(clientId) {
    const client = state.clients.find((c) => String(c.id) === String(clientId));
    if (!client) return;
    state.selectedClientId = clientId;

    const root = document.getElementById("overlay-client-info");
    if (!root) return;

    root.querySelector("#overlay-client-name").textContent = client.name || "--";
    root.querySelector("#overlay-client-id").textContent = `: ${client.id || "--"}`;
    root.querySelector("#overlay-client-phone").textContent = `: ${client.phone || "--"}`;
    root.querySelector("#overlay-client-limit").textContent = `: ${formatMoney(client.credit_limit || client.limit || 0)}`;
    root.querySelector("#overlay-client-consumed").textContent = `: ${formatMoney(getClientCreditConsumed(clientId))}`;
    root.querySelector("#overlay-client-paid").textContent = `: ${formatMoney(getClientPaidTotal(clientId))}`;
    root.querySelector("#overlay-client-remaining").textContent = `: ${formatMoney(getClientDebt(clientId))}`;

    const img = root.querySelector("#overlay-client-img");
    if (img) img.src = client.image || DEFAULT_USER_IMAGE;
    openOverlay("overlay-client-info");
}

export function openPaymentOverlay() {
    if (!state.selectedClientId) return;
    const client = state.clients.find((c) => String(c.id) === String(state.selectedClientId));
    if (!client) return;

    const root = document.getElementById("overlay-payment");
    if (!root) return;
    root.querySelector("#payment-client-name").textContent = client.name || "--";
    root.querySelector("#payment-remaining").textContent = formatMoney(getClientDebt(client.id));
    const img = root.querySelector("#payment-client-img");
    if (img) img.src = client.image || DEFAULT_USER_IMAGE;
    const amountInput = root.querySelector("#payment-amount");
    if (amountInput) amountInput.value = "";
    openOverlay("overlay-payment");
}

export async function savePayment() {
    if (!state.selectedClientId) return;
    const amount = toNumber(document.getElementById("payment-amount")?.value);
    const remaining = getClientDebt(state.selectedClientId);
    const error = validatePaymentAmount({ amount, remaining });
    if (error) return showToast(error, "error");

    try {
        await api.createPayment({ client_id: state.selectedClientId, amount });
        await Promise.all([loadClients(), loadHomeData(), loadReports()]);
        renderHome();
        renderClients();
        renderReports();
        closeOverlay();
        showToast("Paiement enregistré.", "success");
    } catch (error) {
        showToast(error.message, "error");
    }
}

export function openClientReportOverlay() {
    if (!state.selectedClientId) return;
    const client = state.clients.find((c) => String(c.id) === String(state.selectedClientId));
    if (!client) return;

    const root = document.getElementById("overlay-report");
    if (!root) return;

    const lastSale = client.last_sale || null;
    root.querySelector("#overlay-report-client-name").textContent = client.name || "--";
    root.querySelector("#overlay-report-date").textContent = formatDisplayDate(new Date());
    root.querySelector("#overlay-report-time").textContent = lastSale?.time || "--:--";

    const listEl = root.querySelector("#overlay-report-items-list");
    const items = lastSale?.items || [];
    listEl.innerHTML = items.length
        ? items.map((item) => `
            <div class="overlay-report-item-row">
                <p class="overlay-report-item-name">${escapeHtml(item.product_name || item.name)} x${item.quantity || item.qty}</p>
                <p class="overlay-report-item-price">: ${formatMoney(item.subtotal)}</p>
            </div>`
        ).join("")
        : `<div class="overlay-report-item-row">
               <p class="overlay-report-item-name">Aucun article aujourd'hui</p>
               <p class="overlay-report-item-price">: 0.00 DH</p>
           </div>`;

    root.querySelector("#overlay-report-total").textContent = formatMoney(lastSale?.total_amount || lastSale?.total || 0);
    root.querySelector("#overlay-report-to-pay").textContent = formatMoney(getClientDebt(client.id));
    const img = root.querySelector("#overlay-report-client-img");
    if (img) img.src = client.image || DEFAULT_USER_IMAGE;
    openOverlay("overlay-report");
}

 
async function deleteClient() {
    if (!state.selectedClientId) return;

    const client = state.clients.find((c) => String(c.id) === String(state.selectedClientId));
    if (!client) return;

    const confirmed = confirm(`Supprimer "${client.name}" ? Cette action est irréversible.`);
    if (!confirmed) return;

    try {
        await api.deleteClient(state.selectedClientId);
        await loadClients();
        renderClients();
        closeOverlay();
        showToast("Client supprimé.", "success");
    } catch (error) {
        showToast(error.message, "error");
    }
}


function openEditClientOverlay() {
    if (!state.selectedClientId) return;

    const client = state.clients.find((c) => String(c.id) === String(state.selectedClientId));
    if (!client) return;

    // Pré-remplir le formulaire d'édition
    const nameEl  = document.getElementById("edit-client-name");
    const phoneEl = document.getElementById("edit-client-phone");
    const limitEl = document.getElementById("edit-client-limit");

    if (nameEl)  nameEl.value  = client.name  || "";
    if (phoneEl) phoneEl.value = client.phone || "";
    if (limitEl) limitEl.value = client.credit_limit || client.limit || "";

    closeOverlay();

    // Afficher l'écran d'édition
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
    document.getElementById("screen-edit-client")?.classList.add("active");
}