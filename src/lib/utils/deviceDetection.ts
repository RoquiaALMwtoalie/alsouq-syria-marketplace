// src/lib/utils/deviceDetection.ts

/**
 * 🔍 كشف نوع الجهاز وقدراته
 * ✅ ملف مساعد — يستخدمه realtimeManager
 * 
 * 📱 يدعم: iOS, Android, Desktop
 */

/**
 * ✅ كشف iOS (iPhone / iPad / iPod)
 * ملاحظة: كل المتصفحات على iOS تستخدم WebKit
 * (Safari, Chrome, Firefox — كلهم نفس المحرك)
 */
export const isIOS = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  
  const ua = navigator.userAgent;
  const platform = (navigator as any).platform || '';
  
  return (
    /iPad|iPhone|iPod/.test(ua) ||
    // iPad Pro 12.9" + iPadOS 13+ يتعرف كـ Mac
    (platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1)
  );
};

/**
 * ✅ كشف Android
 */
export const isAndroid = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android/i.test(navigator.userAgent);
};

/**
 * ✅ كشف الجوال (iOS + Android + أي جوال)
 */
export const isMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * ✅ كشف Safari (الحقيقي — مش Chrome على iOS)
 */
export const isSafari = (): boolean => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /Safari/.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS/.test(ua);
};

/**
 * ✅ كشف Desktop
 */
export const isDesktop = (): boolean => {
  return !isMobile();
};

/**
 * ✅ الحد الأقصى لـ WebSockets حسب الجهاز
 * 
 * ⚠️ حدود iOS:
 * - iOS WebKit يدعم 4 WebSockets
 * - لكن Safari يقتل الصفحة عند تجاوز 4
 * - نستخدم 4 كحد أقصى (يكفي لـ 4 قنوات: notifications + cache + db + realtime)
 * 
 * 📊 الحدود:
 * - iOS: 4
 * - Android: 4
 * - Mobile أخرى: 4
 * - Desktop: 6
 */
export const getMaxWebSockets = (): number => {
  if (isIOS()) return 4;
  if (isAndroid()) return 4;
  if (isMobile()) return 4;
  return 6;
};

/**
 * ✅ هل الجهاز iOS؟
 * (نفس isIOS لكن مع اسم مختلف للوضوح في الكود)
 */
export const isIOSDevice = (): boolean => {
  return isIOS();
};

/**
 * ✅ هل نُفعّل Realtime؟
 * دائماً نُفعّل — لكن بعدد قنوات أقل على iOS
 */
export const shouldEnableRealtime = (): boolean => {
  return true;
};

/**
 * ✅ معلومات شاملة عن الجهاز
 */
export interface DeviceInfo {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
  isSafari: boolean;
  isDesktop: boolean;
  maxWebSockets: number;
  deviceMemory: number | null;
  hardwareConcurrency: number | null;
  userAgent: string;
}

export const getDeviceInfo = (): DeviceInfo => {
  return {
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isMobile: isMobile(),
    isSafari: isSafari(),
    isDesktop: isDesktop(),
    maxWebSockets: getMaxWebSockets(),
    deviceMemory:
      typeof navigator !== 'undefined'
        ? (navigator as any).deviceMemory || null
        : null,
    hardwareConcurrency:
      typeof navigator !== 'undefined'
        ? navigator.hardwareConcurrency || null
        : null,
    userAgent:
      typeof navigator !== 'undefined' ? navigator.userAgent : '',
  };
};