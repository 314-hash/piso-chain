/**
 * PISO Chain Progressive Web App (PWA) Service Worker
 * Caches static assets for offline access and handles 24h mining notifications.
 */

// Version: piso-chain-pwa-v1 (Upgraded to piso-chain-pwa-v2)
const CACHE_NAME = 'piso-chain-pwa-v2';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './pow.html',
    './sakura.html',
    './enterprise.html',
    './features.html',
    './swap.js',
    './swap.html',
    './bridge.html',
    './freqtrade.html',
    './contracts.js',
    './contracts.html',
    './wallet.html',
    './piso_logo.jpg',
    './manifest.json'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    // Cache-first strategy for static assets, network-first for RPC calls
    if (event.request.url.includes('/api/') || event.request.method !== 'GET') {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            });
        }).catch(() => {
            return caches.match('./index.html');
        })
    );
});
