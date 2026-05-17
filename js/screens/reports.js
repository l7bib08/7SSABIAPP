import { state } from "../state.js";
import { api } from "../services/api.js";
import { getTodayDate, formatMoney, formatDisplayDate, escapeHtml } from "../utils/helpers.js";
import { showToast } from "../ui/notifications.js";

export function bindReportsEvents() {
  document.getElementById("btn-export-report")?.addEventListener("click", exportReport);
}

export async function loadReports() {
  const data = await api.getReports();
  state.reports = data.report || data;
}

export function renderReports() {
  const r = state.reports || {};
  const screenRoot = document.getElementById("screen-reports");
  if (!screenRoot) return;

  screenRoot.querySelector("#report-date").textContent = `Aujourd'hui - ${formatDisplayDate(new Date())}`;
  screenRoot.querySelector("#report-cash-value").textContent = formatMoney(r.cashSales || 0);
  screenRoot.querySelector("#report-credit-value").textContent = formatMoney(r.creditSales || 0);
  screenRoot.querySelector("#report-expense-value").textContent = formatMoney(r.expenses || 0);
  screenRoot.querySelector("#report-profit-value").textContent = formatMoney(r.profit || 0);
  screenRoot.querySelector("#report-total-debt-value").textContent = formatMoney(r.totalDebt || 0);
  screenRoot.querySelector("#report-total-cash-value").textContent = formatMoney(r.totalEncashed || 0);

  const transactionsList = screenRoot.querySelector("#report-transactions-list");
  const transactions = r.transactions || [];
  transactionsList.innerHTML = transactions.length ? transactions.map((row) => `<div class="report-row"><div><p class="report-title">${escapeHtml(row.title)}</p><small>${escapeHtml(row.time || "--:--")}</small></div><strong>${formatMoney(row.amount)}</strong></div>`).join("") : `<div class="report-row"><div><p class="report-title">Aucune transaction aujourd'hui</p><small>--:--</small></div><strong>0.00 DH</strong></div>`;

  const clientsList = screenRoot.querySelector("#report-clients-list");
  const debtors = r.debtors || [];
  clientsList.innerHTML = debtors.length ? debtors.map((row) => `<div class="report-row"><div><p class="report-title">${escapeHtml(row.name)}</p><small>Reste à payer</small></div><strong>${formatMoney(row.debt)}</strong></div>`).join("") : `<div class="report-row"><div><p class="report-title">Aucun client endetté</p><small>Reste à payer</small></div><strong>0.00 DH</strong></div>`;
}

function exportReport() {
  const blob = new Blob([JSON.stringify(state.reports || {}, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jibi-report-${getTodayDate()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast("Rapport exporté.", "success");
}

export function bindReportExportEvents() {

    document.getElementById("btn-export-pdf")
        ?.addEventListener("click", exportPDF);
}

async function exportPDF() {
    const dateInput = document.getElementById("report-export-date");
    const date      = dateInput?.value || new Date().toISOString().slice(0,10);

    try {
        const res  = await api.exportReport(date);
        const data = res.data;

        const html = buildPDFHTML(data);
        const win  = window.open("", "_blank");
        win.document.write(html);
        win.document.close();
        win.print();
    } catch (e) {
        showToast(e.message, "error");
    }
}

function buildPDFHTML(data) {
    const rows = data.transactions.map(t => `
        <tr>
            <td>${t.time}</td>
            <td>${t.title}</td>
            <td style="text-align:right">${parseFloat(t.amount).toFixed(2)} DH</td>
        </tr>
    `).join("");

    const debtors = data.debtors.map(d => `
        <tr>
            <td>${d.name}</td>
            <td style="text-align:right;color:#c0392b">${parseFloat(d.debt).toFixed(2)} DH</td>
        </tr>
    `).join("");

    return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Rapport JIBI — ${data.date}</title>
<style>
    body { font-family: Arial, sans-serif; padding: 30px; color: #222; }
    .header { text-align: center; border-bottom: 2px solid #1a73e8; padding-bottom: 16px; margin-bottom: 24px; }
    .logo { font-size: 32px; font-weight: bold; color: #1a73e8; letter-spacing: 2px; }
    .commerce-name { font-size: 18px; font-weight: bold; margin: 6px 0 2px; }
    .commerce-info { font-size: 13px; color: #666; }
    .date-label { font-size: 13px; color: #888; margin-top: 8px; }
    .summary { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .summary-box { flex: 1; min-width: 120px; background: #f4f7fb; border-radius: 10px; padding: 14px 16px; }
    .summary-box .label { font-size: 12px; color: #888; margin-bottom: 4px; }
    .summary-box .value { font-size: 20px; font-weight: bold; color: #1a73e8; }
    .summary-box.danger .value { color: #c0392b; }
    .summary-box.success .value { color: #27ae60; }
    h3 { font-size: 14px; color: #555; border-bottom: 1px solid #eee; padding-bottom: 6px; margin: 20px 0 10px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    td, th { padding: 8px 10px; border-bottom: 1px solid #f0f0f0; }
    th { background: #f4f7fb; font-weight: bold; text-align: left; }
    .footer { text-align: center; margin-top: 30px; font-size: 11px; color: #aaa; }
</style>
</head>
<body>

<div class="header">
    <div class="logo">7SSABI</div>
    <div class="commerce-name">${data.commerce.nom || "Mon Commerce"}</div>
    <div class="commerce-info">${data.commerce.adresse || ""} ${data.commerce.telephone ? "· " + data.commerce.telephone : ""}</div>
    <div class="date-label">Rapport du ${data.date}</div>
</div>

<div class="summary">
    <div class="summary-box">
        <div class="label">Ventes Cash</div>
        <div class="value">${data.cashSales.toFixed(2)} DH</div>
    </div>
    <div class="summary-box">
        <div class="label">Ventes Crédit</div>
        <div class="value">${data.creditSales.toFixed(2)} DH</div>
    </div>
    <div class="summary-box danger">
        <div class="label">Dépenses</div>
        <div class="value">${data.expenses.toFixed(2)} DH</div>
    </div>
    <div class="summary-box success">
        <div class="label">Bénéfice</div>
        <div class="value">${data.profit.toFixed(2)} DH</div>
    </div>
</div>

<h3>Transactions du jour</h3>
<table>
    <thead><tr><th>Heure</th><th>Description</th><th style="text-align:right">Montant</th></tr></thead>
    <tbody>${rows || "<tr><td colspan='3' style='text-align:center;color:#aaa'>Aucune transaction</td></tr>"}</tbody>
</table>

<h3>Clients débiteurs</h3>
<table>
    <thead><tr><th>Client</th><th style="text-align:right">Dette</th></tr></thead>
    <tbody>${debtors || "<tr><td colspan='2' style='text-align:center;color:#aaa'>Aucun débiteur</td></tr>"}</tbody>
</table>

<div class="footer">Généré par 7SSABI App · ${new Date().toLocaleString("fr-FR")}</div>
</body>
</html>`;
}