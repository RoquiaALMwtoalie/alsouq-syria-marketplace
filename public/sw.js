// public/sw.js - الكود الكامل مع حماية Dev Mode

// ============================================================
// 🔧 DEV MODE: تعطيل Service Worker في التطوير
// ============================================================
const IS_DEV = 
  self.location.hostname === 'localhost' ||
  self.location.hostname === '127.0.0.1' ||
  self.location.port === '3000' ||
  self.location.port === '3001' ||
  self.location.port === '5173';

if (IS_DEV) {
  console.log('🔧 [SW] Dev mode detected - disabling service worker');
  
  // ✅ إلغاء التسجيل + مسح كل الكاشات
  self.addEventListener('install', (event) => {
    event.waitUntil(
      (async () => {
        // امسح كل الكاشات
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
          console.log('🗑️ [SW] Deleted cache:', key);
        }
        
        // إلغاء التسجيل
        await self.registration.unregister();
        console.log('🧹 [SW] Unregistered in dev mode');
        
        // أعد تحميل كل التبويبات
        const clients = await self.clients.matchAll({ type: 'window' });
        for (const client of clients) {
          if ('navigate' in client) {
            client.navigate(client.url);
          }
        }
      })()
    );
    self.skipWaiting();
  });
  
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        for (const key of keys) {
          await caches.delete(key);
        }
        await self.registration.unregister();
        console.log('🧹 [SW] Unregistered in activate');
      })()
    );
  });
  
  self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
  
} else {
  // ============================================================
  // ✅ PRODUCTION MODE: Service Worker كامل (بدون أي تغيير)
  // ============================================================
  
  const APP_NAME = 'ذوق';
  const APP_ICON = '/logo-192.png';
  const APP_BADGE = '/badge.png';

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
      dir: 'rtl',
      lang: 'ar',
      image: data.image || null,
      timestamp: Date.now(),
    };
    
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
          for (let client of windowClients) {
            if (client.url.includes(urlToOpen) && 'focus' in client) {
              return client.focus();
            }
          }
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
    );
  });

  self.addEventListener('message', (event) => {
    console.log('📨 Message received:', event.data);
    
    if (event.data && event.data.type === 'SKIP_WAITING') {
      self.skipWaiting();
    }
  });
}