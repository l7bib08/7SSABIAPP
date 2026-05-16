import { state } from "../state.js";
import { api } from "../services/api.js";
import { showToast } from "../ui/notifications.js";

export function bindProfileEvents(showScreen) {

    document.getElementById("btn-profile-personal-details")
        ?.addEventListener("click", () => {
            document.getElementById("personal-name").textContent  = state.user?.name  || "--";
            document.getElementById("personal-email").textContent = state.user?.email || "--";
            showScreen("screen-personal-details");
        });

    document.getElementById("btn-profile-store-details")
        ?.addEventListener("click", async () => {
            try {
                const res = await api.getCommerce();
                document.getElementById("commerce-nom").value       = res.commerce.nom       || "";
                document.getElementById("commerce-adresse").value   = res.commerce.adresse   || "";
                document.getElementById("commerce-telephone").value = res.commerce.telephone || "";
            } catch (e) {}
            showScreen("screen-commerce-details");
        });

    document.getElementById("btn-profile-settings")
        ?.addEventListener("click", () => showScreen("screen-parametres"));

    document.getElementById("btn-profile-tips")
        ?.addEventListener("click", () => showScreen("screen-tips"));

    document.getElementById("btn-profile-faq")
        ?.addEventListener("click", () => showScreen("screen-faq"));

    document.getElementById("btn-profile-contact")
        ?.addEventListener("click", () => showScreen("screen-contact"));

    document.getElementById("btn-profile-backup")
        ?.addEventListener("click", saveCSV);

    document.getElementById("btn-profile-export")
        ?.addEventListener("click", () => showScreen("screen-reports"));

    // Sauvegarder commerce
    document.getElementById("btn-save-commerce")
        ?.addEventListener("click", async () => {
            const nom       = document.getElementById("commerce-nom")?.value.trim();
            const adresse   = document.getElementById("commerce-adresse")?.value.trim();
            const telephone = document.getElementById("commerce-telephone")?.value.trim();

            if (!nom) {
                showToast("Le nom du commerce est obligatoire.", "error");
                return;
            }

            try {
                await api.saveCommerce({ nom, adresse, telephone });
                showToast("Commerce sauvegardé.", "success");
                showScreen("screen-profile");
            } catch (e) {
                showToast(e.message, "error");
            }
        });

    // Langue
    document.getElementById("btn-lang-fr")
        ?.addEventListener("click", () => {
            document.getElementById("check-fr").textContent = "✓";
            document.getElementById("check-ar").textContent = "";
            window.location.href = "index.php";
        });

    document.getElementById("btn-lang-ar")
        ?.addEventListener("click", () => {
            document.getElementById("check-fr").textContent = "";
            document.getElementById("check-ar").textContent = "✓";
            window.location.href = "index_ar.php";
        });

    // Boutons retour
    [
        ["btn-back-personal",   "screen-profile"],
        ["btn-back-commerce",   "screen-profile"],
        ["btn-back-parametres", "screen-profile"],
        ["btn-back-tips",       "screen-profile"],
        ["btn-back-faq",        "screen-profile"],
        ["btn-back-contact",    "screen-profile"],
    ].forEach(([id, screen]) => {
        document.getElementById(id)
            ?.addEventListener("click", () => showScreen(screen));
    });

    document.getElementById("btn-profile-logout")
    ?.addEventListener("click", async () => {
        try {
            await api.logout();

            state.user = null;
            state.clients = [];
            state.sales = [];
            state.expenses = [];
            state.payments = [];

            showToast("Déconnexion effectuée.", "info");

            setTimeout(() => {
                window.location.href = "index.php";
            }, 800);

        } catch (error) {
            showToast(error.message, "error");
        }
    });
}

async function saveCSV() {
    try {
        const clients = window._state?.clients || [];

        let csv = "=== CLIENTS ===\n";
        csv += "Nom,Téléphone,Dette\n";
        clients.forEach(c => {
            csv += `"${c.name}","${c.phone}","${c.dette || 0}"\n`;
        });

        // BOM UTF-8 pour Excel
        const BOM  = "\uFEFF";
        const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href     = url;
        a.download = `jibi_backup_${new Date().toISOString().slice(0,10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        showToast("Sauvegarde téléchargée.", "success");
    } catch (e) {
        showToast("Erreur lors de la sauvegarde.", "error");
    }
}

export function renderProfile() {}