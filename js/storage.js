import {
  state,
  USERS_STORAGE_KEY,
  CURRENT_USER_STORAGE_KEY
} from "./state.js";

export function getUsers() {
  const raw = localStorage.getItem(USERS_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Erreur lecture users :", error);
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

export function getCurrentUserId() {
  return localStorage.getItem(CURRENT_USER_STORAGE_KEY);
}

export function setCurrentUserId(userId) {
  localStorage.setItem(CURRENT_USER_STORAGE_KEY, userId);
}

export function clearCurrentUserId() {
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

export function findUserByEmail(email) {
  const users = getUsers();
  return users.find(
    (user) => (user.email || "").trim().toLowerCase() === email.trim().toLowerCase()
  ) || null;
}

export function findUserById(userId) {
  const users = getUsers();
  return users.find((user) => user.id === userId) || null;
}

export function saveCurrentUserAppData() {
  if (!state.user?.id) return;

  const users = getUsers();
  const index = users.findIndex((user) => user.id === state.user.id);
  if (index === -1) return;

  users[index].data = {
    clients: state.clients,
    sales: state.sales,
    expenses: state.expenses,
    payments: state.payments
  };

  saveUsers(users);
}

export function loadCurrentUserIntoState() {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return false;

  const user = findUserById(currentUserId);
  if (!user) return false;

  state.user = {
    id: user.id,
    name: user.name,
    email: user.email
  };

  state.clients = Array.isArray(user.data?.clients) ? user.data.clients : [];
  state.sales = Array.isArray(user.data?.sales) ? user.data.sales : [];
  state.expenses = Array.isArray(user.data?.expenses) ? user.data.expenses : [];
  state.payments = Array.isArray(user.data?.payments) ? user.data.payments : [];
  state.selectedClientId = null;
  state.selectedCreditClientId = null;
  state.cashDraftItems = [];
  state.creditDraftItems = [];

  return true;
}

export function resetStateData() {
  state.user = null;
  state.clients = [];
  state.sales = [];
  state.expenses = [];
  state.payments = [];
  state.selectedClientId = null;
  state.selectedCreditClientId = null;
  state.cashDraftItems = [];
  state.creditDraftItems = [];
}

export function clearAllAppData() {
  localStorage.removeItem(USERS_STORAGE_KEY);
  localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  resetStateData();
}