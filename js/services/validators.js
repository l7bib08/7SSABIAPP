export function isRequired(value) {
  return String(value ?? "").trim().length > 0;
}

export function isPositiveNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n > 0;
}

export function isNonNegativeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0;
}

export function isValidEmail(email) {
  const value = String(email ?? "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function isValidPhone(phone) {
  const value = String(phone ?? "").trim();
  return /^[0-9+\s()-]{8,20}$/.test(value);
}

export function normalizeEmail(email) {
  return String(email ?? "").trim().toLowerCase();
}

export function validateSignupData({ name, email, password, password2 }) {
  if (!isRequired(name)) return "Le nom est obligatoire.";
  if (!isRequired(email)) return "L'email est obligatoire.";
  if (!isValidEmail(email)) return "Format d'email invalide.";
  if (!isRequired(password)) return "Le mot de passe est obligatoire.";
  if (String(password).length < 4) return "Le mot de passe doit contenir au moins 4 caractères.";
  if (password !== password2) return "Les mots de passe ne correspondent pas.";
  return null;
}

export function validateLoginData({ email, password }) {
  if (!isRequired(email)) return "L'email est obligatoire.";
  if (!isValidEmail(email)) return "Format d'email invalide.";
  if (!isRequired(password)) return "Le mot de passe est obligatoire.";
  return null;
}

export function validateClientData({ name, phone, limit }) {
  if (!isRequired(name)) return "Le nom du client est obligatoire.";
  if (!isRequired(phone)) return "Le téléphone est obligatoire.";
  if (!isValidPhone(phone)) return "Le numéro de téléphone est invalide.";
  if (limit !== "" && limit !== null && limit !== undefined && !isNonNegativeNumber(limit)) {
    return "La limite de crédit doit être un nombre positif ou nul.";
  }
  return null;
}

export function validateSaleItem({ name, price, qty }) {
  if (!isRequired(name)) return "Le nom de l'article est obligatoire.";
  if (!isPositiveNumber(price)) return "Le prix doit être supérieur à 0.";
  if (!isPositiveNumber(qty)) return "La quantité doit être supérieure à 0.";
  return null;
}

export function validateExpenseData({ label, amount }) {
  if (!isRequired(label)) return "Le type de dépense est obligatoire.";
  if (!isPositiveNumber(amount)) return "Le montant de la dépense doit être supérieur à 0.";
  return null;
}

export function validatePaymentAmount({ amount, remaining }) {
  if (!isPositiveNumber(amount)) return "Le montant doit être supérieur à 0.";
  if (Number(amount) > Number(remaining)) return "Le montant dépasse la dette restante.";
  return null;
}