// public/sw.js - الكود المحسّن بالكامل

// ✅ اسم التطبيق وشعاره
const APP_NAME = 'السوق اليك';
const APP_ICON = '/logo-192.png';
const APP_BADGE = '/badge.png';

// ✅ ألوان السستم
const COLORS = {
  primary: '#2a655f',
  primaryLight: '#3a8a82',
  primaryDark: '#173d38',
  accent: '#4a9f95',
  success: '#34d399',
  warning: '#fbbf24',
  error: '#ef4444',
};

self.addEventListener('install', (event) => {
  console.log('📦 Service Worker installing...');
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  console.log('✅ Service Worker activated');
  event.waitUntil(self.clients.claim());
});

// ✅ استقبال الإشعارات من الخادم
self.addEventListener('push', function(event) {
  console.log('📬 Push notification received:', event);
  
  let data = {};
  
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: APP_NAME,
      body: '📬 لديك إشعار جديد',
      icon: APP_ICON,
      badge: APP_BADGE,
      color: COLORS.primary,
    };
  }
  
  // ✅ بناء الإشعار مع تصميم احترافي
  const options = {
    body: data.body || '📬 لديك إشعار جديد',
    icon: data.icon || APP_ICON,
    badge: data.badge || APP_BADGE,
    vibrate: [200, 100, 200, 100, 200],
    sound: '/notification.mp3',
    data: {
      url: data.url || '/dashboard',
      notificationId: data.notificationId || null,
    },
    actions: [
      {
        action: 'view',
        title: '👀 عرض التفاصيل',
        icon: '/eye-icon.png',
      },
      {
        action: 'dismiss',
        title: '✖ إغلاق',
        icon: '/close-icon.png',
      }
    ],
    tag: data.tag || `notification-${Date.now()}`,
    requireInteraction: true,
    silent: false,
    // ✅ ✅ ✅ إعدادات التصميم الاحترافي
    dir: 'rtl',
    lang: 'ar',
    image: data.image || null,
    timestamp: Date.now(),
  };
  
  // ✅ إذا كان عندك صورة كبيرة، أضفها
  if (data.largeImage) {
    options.image = data.largeImage;
  }
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || APP_NAME,
      options
    )
  );
});

// ✅ التعامل مع الضغط على الإشعار
self.addEventListener('notificationclick', function(event) {
  console.log('🔔 Notification clicked:', event);
  event.notification.close();
  
  if (event.action === 'dismiss') {
    return;
  }
  
  const urlToOpen = event.notification.data?.url || '/dashboard';
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // ✅ إذا كان هناك نافذة مفتوحة، نستخدمها
        for (let client of windowClients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        // ✅ وإلا نفتح نافذة جديدة
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// ✅ التعامل مع رسائل من التطبيق
self.addEventListener('message', (event) => {
  console.log('📨 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});