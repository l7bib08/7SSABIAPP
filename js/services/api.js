console.log("API VERSION NEW");

const BASE_URL = "http://localhost/Jibi_app_test_version/jibi_php/api/";
const JSON_HEADERS = { "Content-Type": "application/json" };

async function apiFetch(url, options = {}) {
    const response = await fetch(url, {
        credentials: "same-origin",
        ...options
    });

    let data = null;
    const contentType = response.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = {
            success: false,
            message: await response.text()
        };
    }

    if (!response.ok || data?.success === false) {
        throw new Error(data?.error || data?.message || "Erreur serveur.");
    }

    return data;
}

export const api = {

    getSession() {
        return apiFetch(BASE_URL + "auth/session.php");
    },

    logout() {
        return apiFetch(BASE_URL + "auth/logout.php", {
            method: "POST"
        });
    },

    getDashboard() {
        return apiFetch(BASE_URL + "dashboard.php");
    },

    getClients() {
        return apiFetch(BASE_URL + "clients/index.php");
    },

    createClient(payload) {
        return apiFetch(BASE_URL + "clients/create.php", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(payload)
        });
    },

    updateClient(id, payload) {
        return apiFetch(BASE_URL + `clients/update.php?id=${encodeURIComponent(id)}`, {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(payload)
        });
    },

    deleteClient(id) {
        return apiFetch(BASE_URL + `clients/delete.php?id=${encodeURIComponent(id)}`, {
            method: "POST"
        });
    },

    createSale(payload) {
        return apiFetch(BASE_URL + "sales/create.php", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(payload)
        });
    },

    createExpense(payload) {
        return apiFetch(BASE_URL + "expenses/create.php", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(payload)
        });
    },

    createPayment(payload) {
        return apiFetch(BASE_URL + "payments/create.php", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(payload)
        });
    },

    getReports() {
        return apiFetch(BASE_URL + "reports/today.php");
    },

    getCommerce() {
    return apiFetch(BASE_URL + "commerce/get.php");
    },

    saveCommerce(payload) {
        return apiFetch(BASE_URL + "commerce/save.php", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify(payload)
        });
    },

    exportReport(date) {
        return apiFetch(BASE_URL + "reports/export.php", {
            method: "POST",
            headers: JSON_HEADERS,
            body: JSON.stringify({ date })
        });
    }
};