import { api } from "../services/api.js";
import { state } from "../state.js";
import { showToast } from "../ui/notifications.js";

export function bindAuthEvents(showScreen) {

    document.getElementById("btn-go-signup")?.addEventListener("click", () => {
        showScreen("screen-signup");
    });

    document.getElementById("btn-back-login")?.addEventListener("click", () => {
        showScreen("screen-login");
    });

}