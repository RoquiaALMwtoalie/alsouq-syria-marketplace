// src/types/notificationTypes.ts

export const NOTIFICATION_TYPES = {
  // إشعارات المنتجات
  PRODUCT_PENDING: 'product_pending',
  PRODUCT_APPROVED: 'product_approved',
  PRODUCT_REJECTED: 'product_rejected',
  
  // إشعارات المتاجر
  STORE_APPLICATION: 'store_application',
  STORE_APPROVED: 'store_approved',
  STORE_REJECTED: 'store_rejected',
  
  // إشعارات النظام
  ANNOUNCEMENT: 'announcement',
  PROMOTION: 'promotion',
  OFFER: 'offer',
  MARKETING: 'marketing',
  EVENT: 'event',
  NEWS: 'news',
  ORDER_UPDATE: 'order_update',
  SYSTEM: 'system',
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

export const NOTIFICATION_CONFIG: Record<NotificationType, {
  ar: string;
  en: string;
  color: string;
  icon: string;
  priority: 'high' | 'normal' | 'low';
}> = {
  [NOTIFICATION_TYPES.PRODUCT_PENDING]: {
    ar: 'منتج قيد المراجعة',
    en: 'Product Pending',
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    icon: 'clock',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.PRODUCT_APPROVED]: {
    ar: 'موافقة منتج',
    en: 'Product Approved',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: 'check-circle',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.PRODUCT_REJECTED]: {
    ar: 'رفض منتج',
    en: 'Product Rejected',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: 'x-circle',
    priority: 'high',
  },
  [NOTIFICATION_TYPES.STORE_APPLICATION]: {
    ar: 'طلب متجر',
    en: 'Store Application',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: 'store',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.STORE_APPROVED]: {
    ar: 'موافقة متجر',
    en: 'Store Approved',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: 'store',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.STORE_REJECTED]: {
    ar: 'رفض متجر',
    en: 'Store Rejected',
    color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    icon: 'store',
    priority: 'high',
  },
  [NOTIFICATION_TYPES.ANNOUNCEMENT]: {
    ar: 'إعلان',
    en: 'Announcement',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    icon: 'megaphone',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.PROMOTION]: {
    ar: 'ترويجي',
    en: 'Promotion',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    icon: 'sparkles',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.OFFER]: {
    ar: 'عرض خاص',
    en: 'Special Offer',
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    icon: 'gift',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.MARKETING]: {
    ar: 'تسويقي',
    en: 'Marketing',
    color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    icon: 'trending-up',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.EVENT]: {
    ar: 'حدث',
    en: 'Event',
    color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
    icon: 'calendar',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.NEWS]: {
    ar: 'أخبار',
    en: 'News',
    color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
    icon: 'globe',
    priority: 'normal',
  },
  [NOTIFICATION_TYPES.ORDER_UPDATE]: {
    ar: 'تحديث طلب',
    en: 'Order Update',
    color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    icon: 'package',
    priority: 'high',
  },
  [NOTIFICATION_TYPES.SYSTEM]: {
    ar: 'نظام',
    en: 'System',
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400',
    icon: 'settings',
    priority: 'normal',
  },
};