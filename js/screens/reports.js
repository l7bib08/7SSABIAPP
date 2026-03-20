import { state } from "../state.js";
import { getTodayDate, formatMoney, formatDisplayDate, escapeHtml } from "../helpers.js";
import { getClientDebt } from "./clients.js";

export function bindReportsEvents() {
  document.getElementById("btn-export-report")?.addEventListener("click", exportReport);
}

export function renderReports() {
  const screenRoot = document.getElementById("screen-reports");
  if (!screenRoot) return;

  const reportDateEl = screenRoot.querySelector("#report-date");
  const reportCashValue = screenRoot.querySelector("#report-cash-value");
  const reportCreditValue = screenRoot.querySelector("#report-credit-value");
  const reportExpenseValue = screenRoot.querySelector("#report-expense-value");
  const reportProfitValue = screenRoot.querySelector("#report-profit-value");
  const reportTotalDebtValue = screenRoot.querySelector("#report-total-debt-value");
  const reportTotalCashValue = screenRoot.querySelector("#report-total-cash-value");
  const transactionsList = screenRoot.querySelector("#report-transactions-list");
  const clientsList = screenRoot.querySelector("#report-clients-list");

  const today = getTodayDate();

  const cashSalesToday = state.sales.filter((sale) => sale.date === today && sale.type === "cash");
  const creditSalesToday = state.sales.filter((sale) => sale.date === today && sale.type === "credit");
  const expensesToday = state.expenses.filter((expense) => expense.date === today);

  const cashTotal = cashSalesToday.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const creditTotal = creditSalesToday.reduce((sum, sale) => sum + Number(sale.total || 0), 0);
  const expenseTotal = expensesToday.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
  const totalDebt = state.clients.reduce((sum, client) => sum + getClientDebt(client.id), 0);
  const totalEncashedToday = cashTotal + state.payments
    .filter((payment) => payment.date === today)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

  const profit = cashTotal + creditTotal - expenseTotal;

  if (reportDateEl) reportDateEl.textContent = `Aujourd'hui - ${formatDisplayDate(new Date())}`;
  if (reportCashValue) reportCashValue.textContent = formatMoney(cashTotal);
  if (reportCreditValue) reportCreditValue.textContent = formatMoney(creditTotal);
  if (reportExpenseValue) reportExpenseValue.textContent = formatMoney(expenseTotal);
  if (reportProfitValue) reportProfitValue.textContent = formatMoney(profit);
  if (reportTotalDebtValue) reportTotalDebtValue.textContent = formatMoney(totalDebt);
  if (reportTotalCashValue) reportTotalCashValue.textContent = formatMoney(totalEncashedToday);

  if (transactionsList) {
    const rows = [];

    cashSalesToday.forEach((sale) => {
      rows.push({
        title: "Vente Cash",
        time: sale.time || "--:--",
        amount: sale.total || 0
      });
    });

    creditSalesToday.forEach((sale) => {
      const client = state.clients.find((c) => c.id === sale.clientId);
      rows.push({
        title: `Vente Crédit - ${client?.name || "Client"}`,
        time: sale.time || "--:--",
        amount: sale.total || 0
      });
    });

    expensesToday.forEach((expense) => {
      rows.push({
        title: `Dépense - ${expense.label || "Sans nom"}`,
        time: expense.time || "--:--",
        amount: expense.amount || 0
      });
    });

    if (rows.length === 0) {
      transactionsList.innerHTML = `
        <div class="report-row">
          <div>
            <p class="report-title">Aucune transaction aujourd'hui</p>
            <small>--:--</small>
          </div>
          <strong>0.00 DH</strong>
        </div>
      `;
    } else {
      transactionsList.innerHTML = rows.map((row) => `
        <div class="report-row">
          <div>
            <p class="report-title">${escapeHtml(row.title)}</p>
            <small>${escapeHtml(row.time)}</small>
          </div>
          <strong>${formatMoney(row.amount)}</strong>
        </div>
      `).join("");
    }
  }

  if (clientsList) {
    const debtors = state.clients
      .map((client) => ({
        client,
        debt: getClientDebt(client.id)
      }))
      .filter((entry) => entry.debt > 0);

    if (debtors.length === 0) {
      clientsList.innerHTML = `
        <div class="report-row">
          <div>
            <p class="report-title">Aucun client endetté</p>
            <small>Reste à payer</small>
          </div>
          <strong>0.00 DH</strong>
        </div>
      `;
    } else {
      clientsList.innerHTML = debtors.map(({ client, debt }) => `
        <div class="report-row">
          <div>
            <p class="report-title">${escapeHtml(client.name || "--")}</p>
            <small>Reste à payer</small>
          </div>
          <strong>${formatMoney(debt)}</strong>
        </div>
      `).join("");
    }
  }
}

function exportReport() {
  const today = getTodayDate();

  const payload = {
    date: today,
    sales: state.sales.filter((sale) => sale.date === today),
    expenses: state.expenses.filter((expense) => expense.date === today),
    payments: state.payments.filter((payment) => payment.date === today),
    clients: state.clients
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `jibi-report-${today}.json`;
  a.click();
  URL.revokeObjectURL(url);
}