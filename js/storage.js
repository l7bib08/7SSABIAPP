import { state, STORAGE_KEY } from "./state.js";

export function saveData() {
  const dataToSave = {
    currentScreen: state.currentScreen,
    user: state.user,
    clients: state.clients,
    sales: state.sales,
    expenses: state.expenses,
    payments: state.payments
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

export function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);

    state.currentScreen = parsed.currentScreen || "screen-initial";
    state.user = parsed.user || null;
    state.clients = Array.isArray(parsed.clients) ? parsed.clients : [];
    state.sales = Array.isArray(parsed.sales) ? parsed.sales : [];
    state.expenses = Array.isArray(parsed.expenses) ? parsed.expenses : [];
    state.payments = Array.isArray(parsed.payments) ? parsed.payments : [];
  } catch (error) {
    console.error("Erreur chargement localStorage :", error);
  }
}

export function clearData() {
  localStorage.removeItem(STORAGE_KEY);
}