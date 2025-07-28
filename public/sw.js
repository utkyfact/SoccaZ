// SoccaZ Service Worker
const CACHE_NAME = 'soccaz-v1.0.1';
const urlsToCache = [
  '/',
  '/SoccaZ.png',
  '/manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch event - network first for development, cache for production
self.addEventListener('fetch', (event) => {
  // Skip non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip WebSocket connections and HMR requests
  if (event.request.url.includes('ws://') || 
      event.request.url.includes('wss://') ||
      event.request.url.includes('?token=') ||
      event.request.url.includes('@vite/client') ||
      event.request.url.includes('/@react-refresh') ||
      event.request.url.includes('/__vite_ping') ||
      event.request.url.includes('localhost:3001')) {
    return;
  }

  // Skip development server requests  
  if (event.request.url.includes('localhost:3000') && 
      (event.request.url.includes('.js?') || 
       event.request.url.includes('.ts?') ||
       event.request.url.includes('.jsx?') ||
       event.request.url.includes('.tsx?'))) {
    return;
  }

  // For HTML documents, try network first
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match('/') || caches.match(event.request);
        })
    );
    return;
  }

  // For other resources, use cache first for static assets
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then((response) => {
            // Cache successful responses for static assets
            if (response.status === 200 && event.request.method === 'GET') {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseClone);
              });
            }
            return response;
          });
      })
      .catch(() => {
        // Fallback for offline
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Background sync for when connection is restored
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'SoccaZ bildirimi',
    icon: '/SoccaZ.png',
    badge: '/SoccaZ.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'explore',
        title: 'Aç',
        icon: '/SoccaZ.png'
      },
      {
        action: 'close',
        title: 'Kapat',
        icon: '/SoccaZ.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('SoccaZ', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  // Bildirim verilerini al
  const notificationData = event.notification.data;
  const url = notificationData?.url || '/';

  if (event.action === 'explore' || event.action === 'view') {
    event.waitUntil(
      clients.openWindow(url)
    );
  } else {
    // Varsayılan olarak ana sayfaya git
    event.waitUntil(
      clients.openWindow(url)
    );
  }
}); 