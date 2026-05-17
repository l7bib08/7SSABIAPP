const CACHE_NAME = "7ssabi-v1";

const ASSETS = [
    "/Jibi_app_test_version/index.php",
    "/Jibi_app_test_version/style.css",
    "/Jibi_app_test_version/assets/Logo/JIBI LOGO.png",
    "/Jibi_app_test_version/assets/LOGO/LOGO Calcul.png",
    "/Jibi_app_test_version/assets/Icons/user.png",
    "/Jibi_app_test_version/assets/Icons/home no click.png",
    "/Jibi_app_test_version/assets/Icons/home click.png",
    "/Jibi_app_test_version/assets/Icons/customers no click.png",
    "/Jibi_app_test_version/assets/Icons/customers click.png",
    "/Jibi_app_test_version/assets/Icons/rapport no click.png",
    "/Jibi_app_test_version/assets/Icons/rapport click.png",
    "/Jibi_app_test_version/assets/Icons/user no click.png",
    "/Jibi_app_test_version/assets/Icons/user click.png",
    "/Jibi_app_test_version/assets/Icons/bloc-notes no click.png",
    "/Jibi_app_test_version/assets/Icons/bloc-notes click.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    // Laisser passer toutes les requêtes POST sans interception
    if (event.request.method === "POST") {
        return;
    }

    const url = new URL(event.request.url);

    // API calls — toujours réseau
    if (url.pathname.includes("/jibi_php/")) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return new Response(
                    JSON.stringify({ success: false, error: "Pas de connexion." }),
                    { headers: { "Content-Type": "application/json" } }
                );
            })
        );
        return;
    }

    // Assets — cache first
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return cached || fetch(event.request).then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clone);
                });
                return response;
            });
        })
    );
});