// src/lib/pushNotifications.ts
import { supabase } from "@/integrations/supabase/client";

const VAPID_PUBLIC_KEY = 'BP1RKVDzJaNmBtgeyIxDWTXx5TH7H96xS5VgPKMu77_ZOpsonDHctEl3xvS8DJkBOZbUHaAydwAzXdZU2hB9IRc';

console.log('🔑 VAPID_PUBLIC_KEY loaded');

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported() {
  return (
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window
  );
}

export async function requestPushPermission(): Promise<boolean> {
  if (!isPushSupported()) {
    console.warn('الـ Push غير مدعوم في هذا المتصفح');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('خطأ في طلب إذن الإشعارات:', error);
    return false;
  }
}

export async function subscribeToPush(userId: string): Promise<boolean> {
  if (!isPushSupported()) {
    console.warn('⚠️ Push غير مدعوم');
    return false;
  }
  
  try {
    if (!VAPID_PUBLIC_KEY) {
      console.error('❌ VAPID_PUBLIC_KEY غير موجود');
      return false;
    }

    console.log('✅ VAPID_PUBLIC_KEY موجود');

    let registration;
    try {
      registration = await navigator.serviceWorker.ready;
      console.log('✅ Service Worker جاهز');
    } catch (swError) {
      console.warn('⚠️ Service Worker ليس جاهزاً، جاري التسجيل...');
      registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
      });
      console.log('✅ Service Worker مسجل بنجاح');
    }
    
    if (Notification.permission !== 'granted') {
      const granted = await requestPushPermission();
      if (!granted) {
        console.warn('⚠️ المستخدم رفض إذن الإشعارات');
        return false;
      }
    }
    
    const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    console.log('✅ تم تحويل المفتاح بنجاح');

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    });
    
    console.log('✅ تم الاشتراك في Push بنجاح');
    console.log('📝 Endpoint:', subscription.endpoint);
    
    // ✅ تحويل الاشتراك إلى JSON كامل
    const subscriptionJSON = subscription.toJSON();
    
    // ✅ حفظ الاشتراك في قاعدة البيانات (عمود subscription من نوع jsonb)
    const subscriptionData = {
      user_id: userId,
      subscription: subscriptionJSON, // ✅ حفظ كامل الاشتراك كـ JSON
    };

    console.log('💾 جاري حفظ الاشتراك في قاعدة البيانات...');

    // ✅ استخدام upsert مع onConflict
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(subscriptionData, { 
        onConflict: 'user_id'
      });
    
    if (error) {
      console.error('❌ خطأ في حفظ الاشتراك:', error);
      return false;
    }
    
    console.log('✅ تم حفظ الاشتراك في قاعدة البيانات');
    return true;
    
  } catch (error: any) {
    console.error('❌ خطأ في الاشتراك بـ Push:', error);
    return false;
  }
}

export async function unsubscribeFromPush(userId: string): Promise<boolean> {
  try {
    // حذف الاشتراك من قاعدة البيانات
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('user_id', userId);
    
    if (error) {
      console.error('❌ خطأ في حذف الاشتراك:', error);
      return false;
    }
    
    // إلغاء الاشتراك من Service Worker
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (subscription) {
      await subscription.unsubscribe();
    }
    
    console.log('✅ تم إلغاء الاشتراك من Push Notifications');
    return true;
    
  } catch (error) {
    console.error('❌ خطأ في إلغاء الاشتراك:', error);
    return false;
  }
}

export async function getPushSubscriptionStatus(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return !!subscription;
  } catch {
    return false;
  }
}

export function getNotificationPermission(): NotificationPermission {
  return Notification.permission;
}