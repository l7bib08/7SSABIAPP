export const USERS_STORAGE_KEY = "jibi_users";
export const CURRENT_USER_STORAGE_KEY = "jibi_current_user_id";

export const state = {
  currentScreen: "screen-initial",
  user: null,
  clients: [],
  sales: [],
  expenses: [],
  payments: [],
  selectedClientId: null,
  selectedCreditClientId: null,
  cashDraftItems: [],
  creditDraftItems: []
};