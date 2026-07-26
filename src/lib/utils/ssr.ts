// src/lib/utils/ssr.ts

/**
 * 🔥 دالة للتحقق من أن الكود يعمل على العميل (المتصفح)
 */
export function isClient(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * 🔥 دالة للتحقق من أن الكود يعمل على السيرفر
 */
export function isServer(): boolean {
  return typeof window === 'undefined';
}

/**
 * 🔥 دالة آمنة للوصول إلى localStorage
 * لا تسبب أخطاء في SSR
 */
export function safeLocalStorage(): Storage | null {
  if (isClient()) {
    return localStorage;
  }
  return null;
}

/**
 * 🔥 دالة آمنة للحصول على قيمة من localStorage
 */
export function safeGetItem(key: string, defaultValue: string = ''): string {
  const storage = safeLocalStorage();
  if (storage) {
    try {
      const value = storage.getItem(key);
      return value !== null ? value : defaultValue;
    } catch {
      return defaultValue;
    }
  }
  return defaultValue;
}