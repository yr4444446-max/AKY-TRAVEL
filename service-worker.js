// WanderPeak - Service Worker
// Provides offline functionality and caching

const CACHE_NAME = 'wanderpeak-v1';
const OFFLINE_URL = '/index.html';

// Files to cache immediately
const PRECACHE_URLS = [
    '/',
    '/index.html',
    '/famous.html',
    '/style.css',
    '/script.js',
    '/chatbot.js',
    '/manifest.json'
];

// Install event - cache essential files
self.addEventListener('install', (event) => {
    console.log('[Service Worker] Installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Precaching app shell');
                return cache.addAll(PRECACHE_URLS);
            })
            .then(() => {
                console.log('[Service Worker] Skip waiting');
                return self.skipWaiting();
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[Service Worker] Activating...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => {
                            return cacheName !== CACHE_NAME;
                        })
                        .map((cacheName) => {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        })
                );
            })
            .then(() => {
                console.log('[Service Worker] Claiming clients');
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }
    
    // Skip API requests (always fetch from network)
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return new Response(
                        JSON.stringify({
                            error: 'Network unavailable',
                            offline: true
                        }),
                        {
                            headers: { 'Content-Type': 'application/json' }
                        }
                    );
                })
        );
        return;
    }
    
    // Network first, fallback to cache strategy
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                
                // Clone the response
                const responseToCache = response.clone();
                
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        
                        // If requesting a page, return offline page
                        if (event.request.mode === 'navigate') {
                            return caches.match(OFFLINE_URL);
                        }
                        
                        // Return a generic offline response
                        return new Response('Offline', {
                            status: 503,
                            statusText: 'Service Unavailable',
                            headers: new Headers({
                                'Content-Type': 'text/plain'
                            })
                        });
                    });
            })
    );
});

// Background sync for chatbot messages
self.addEventListener('sync', (event) => {
    console.log('[Service Worker] Background sync:', event.tag);
    
    if (event.tag === 'sync-chat-messages') {
        event.waitUntil(
            syncChatMessages()
        );
    }
});

// Push notifications
self.addEventListener('push', (event) => {
    console.log('[Service Worker] Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'New update from WanderPeak',
        icon: 'data:image/svg+xml,%3Csvg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="192" height="192" fill="%231a4d2e"/%3E%3Cpath d="M96 40L64 80L96 120L128 80L96 40Z" fill="%23ffffff"/%3E%3Cpath d="M64 96L96 136L128 96" stroke="%23ffffff" stroke-width="8" fill="none"/%3E%3Ccircle cx="96" cy="156" r="12" fill="%23ffffff"/%3E%3C/svg%3E',
        badge: 'data:image/svg+xml,%3Csvg width="96" height="96" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg"%3E%3Ccircle cx="48" cy="48" r="48" fill="%231a4d2e"/%3E%3Cpath d="M48 20L32 40L48 60L64 40L48 20Z" fill="%23ffffff"/%3E%3C/svg%3E',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('WanderPeak', options)
    );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
    console.log('[Service Worker] Notification clicked');
    
    event.notification.close();
    
    event.waitUntil(
        clients.openWindow('/')
    );
});

// Helper function to sync chat messages
async function syncChatMessages() {
    try {
        // Get pending messages from IndexedDB
        // This would be implemented with IndexedDB in production
        console.log('[Service Worker] Syncing chat messages');
        
        // Send messages to server
        // await fetch('/api/chat/sync', { method: 'POST', body: messages });
        
        return Promise.resolve();
    } catch (error) {
        console.error('[Service Worker] Sync failed:', error);
        return Promise.reject(error);
    }
}

// Message handler for communication with clients
self.addEventListener('message', (event) => {
    console.log('[Service Worker] Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(CACHE_NAME)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
    
    // Send message back to client
    if (event.data && event.data.type === 'PING') {
        event.ports[0].postMessage({
            type: 'PONG',
            cache: CACHE_NAME
        });
    }
});

// Periodic background sync (requires permission)
self.addEventListener('periodicsync', (event) => {
    console.log('[Service Worker] Periodic sync:', event.tag);
    
    if (event.tag === 'check-deals') {
        event.waitUntil(checkForNewDeals());
    }
});

async function checkForNewDeals() {
    try {
        const response = await fetch('/api/deals');
        const data = await response.json();
        
        // Show notification if new deals
        if (data.newDeals && data.newDeals.length > 0) {
            self.registration.showNotification('New Travel Deals!', {
                body: `${data.newDeals.length} new amazing deals available`,
                icon: 'data:image/svg+xml,%3Csvg width="192" height="192" viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"%3E%3Crect width="192" height="192" fill="%231a4d2e"/%3E%3Cpath d="M96 40L64 80L96 120L128 80L96 40Z" fill="%23ffffff"/%3E%3C/svg%3E',
                tag: 'new-deals',
                requireInteraction: true
            });
        }
    } catch (error) {
        console.error('[Service Worker] Failed to check deals:', error);
    }
}

console.log('[Service Worker] Script loaded');
