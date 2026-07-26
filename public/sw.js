// public/sw.js
// Service Worker لتشغيل الإشعارات حتى لو التطبيق مسكر

self.addEventListener('install', (event) => {
  console.log('📦 Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// استقبال الإشعارات من الخادم
self.addEventListener('push', function(event) {
  console.log('📬 Push notification received:', event);
  
  let data = {};
  
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: '📬 السوق اليك',
      body: event.data ? event.data.text() : 'لديك إشعار جديد',
    };
  }
  
  const options = {
    body: data.body || 'لديك إشعار جديد',
    icon: data.icon || '/logo-192.png',
    badge: data.badge || '/badge.png',
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: data.url || '/dashboard',
      notificationId: data.notificationId || null,
    },
    actions: [
      {
        action: 'view',
        title: '👀 عرض',
      },
      {
        action: 'dismiss',
        title: '✖ إغلاق',
      }
    ],
    tag: data.tag || 'notification',
    requireInteraction: true,
    silent: false,
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || '📬 السوق اليك', options)
  );
});

// التعامل مع الضغط على الإشعار
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 Notification clicked:', event);
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  // فتح التطبيق عند الضغط على الإشعار
  const urlToOpen = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // إذا كان هناك نافذة مفتوحة، نستخدمها
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        // وإلا نفتح نافذة جديدة
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// التعامل مع رسائل من التطبيق
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});