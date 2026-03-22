let toastContainer = null;

function ensureToastContainer() {
  if (toastContainer) return toastContainer;

  const app = document.querySelector(".app");
  if (!app) return null;

  toastContainer = document.createElement("div");
  toastContainer.id = "toast-container";
  app.appendChild(toastContainer);

  return toastContainer;
}

export function showToast(message, type = "info", duration = 2500) {
  const container = ensureToastContainer();
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add("show");
  });

  setTimeout(() => {
    toast.classList.remove("show");
    toast.classList.add("hide");

    setTimeout(() => {
      toast.remove();
    }, 250);
  }, duration);
}