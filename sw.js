const CACHE_NAME = 'b4dcat-v1.0.0';
const urlsToCache = [
  '/',
  '/assets/css/landing.css',
  '/assets/css/layout-styles.css',
  '/assets/css/content-styles.css',
  '/assets/js/landing.js',
  '/assets/js/ads.js',
  '/assets/img/favicon.ico',
  '/assets/img/favicon-32x32.png',
  '/assets/img/favicon-16x16.png',
  '/assets/img/favicon-192.png',
  '/assets/img/favicon-512.png',
  '/utilities/',
  '/wiki/',
  '/tasks/',
  '/projects/',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&family=Source+Code+Pro&display=swap',
  'https://cdn.jsdelivr.net/npm/tsparticles@2.10.1/tsparticles.bundle.min.js',
  'https://unpkg.com/typed.js@2.0.16/dist/typed.umd.js'
];

// Установка Service Worker и кэширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов и возврат кэшированных ресурсов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращаем кэшированный ресурс, если он есть
        if (response) {
          return response;
        }

        // Иначе делаем сетевой запрос
        return fetch(event.request).then(
          response => {
            // Проверяем, что получили валидный ответ
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Клонируем ответ, так как он может быть использован только один раз
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
      .catch(() => {
        // Возвращаем офлайн-страницу для HTML запросов
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('/offline.html');
        }
      })
  );
});

// Обновление кэша при новой версии
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обработка push-уведомлений
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Новое уведомление!',
    icon: '/assets/img/favicon-192.png',
    badge: '/assets/img/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Открыть',
        icon: '/assets/img/icon-open.png'
      },
      {
        action: 'close',
        title: 'Закрыть',
        icon: '/assets/img/icon-close.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('B4DCAT', options)
  );
});

// Обработка кликов по уведомлениям
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
}); 