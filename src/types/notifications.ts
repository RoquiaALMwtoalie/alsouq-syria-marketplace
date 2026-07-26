// src/types/notifications.ts

export type NotificationType = 
  | 'order_placed'
  | 'order_confirmed'
  | 'order_shipped'
  | 'order_delivered'
  | 'order_cancelled'
  | 'order_returned'
  | 'product_approved'
  | 'product_rejected'
  | 'product_pending'
  | 'store_approved'
  | 'store_rejected'
  | 'store_application'
  | 'promotion'
  | 'announcement'
  | 'system'
  | 'social'
  | 'message'
  | 'review'
  | 'follow';

export type NotificationPriority = 'high' | 'normal' | 'low';

export interface NotificationAction {
  label_ar: string;
  label_en?: string;
  url: string;
  icon?: string;
  color?: string;
}

export interface NotificationMetadata {
  order_id?: string;
  product_id?: string;
  store_id?: string;
  user_id?: string;
  review_id?: string;
  message_id?: string;
  reason?: string;
  store_name?: string;
  product_name?: string;
  application_id?: string;
  action?: string;
  [key: string]: any;
}

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title_ar: string;
  title_en?: string;
  body_ar: string;
  body_en?: string;
  icon: string;
  color: string;
  priority: NotificationPriority;
  link_url?: string;
  image_url?: string;
  actions: NotificationAction[];
  is_read: boolean;
  is_dismissed: boolean;
  is_sent: boolean;
  metadata: NotificationMetadata;
  scheduled_for?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  read_at?: string;
  sent_at?: string;
}

// تكوينات الأنواع
export const NOTIFICATION_CONFIG: Record<NotificationType, { icon: string; color: string; priority: NotificationPriority }> = {
  order_placed: { icon: 'shopping-bag', color: '#3b82f6', priority: 'high' },
  order_confirmed: { icon: 'check-circle', color: '#10b981', priority: 'high' },
  order_shipped: { icon: 'truck', color: '#8b5cf6', priority: 'high' },
  order_delivered: { icon: 'check-circle', color: '#10b981', priority: 'normal' },
  order_cancelled: { icon: 'x-circle', color: '#ef4444', priority: 'high' },
  order_returned: { icon: 'rotate-ccw', color: '#f59e0b', priority: 'normal' },
  product_approved: { icon: 'check-circle', color: '#10b981', priority: 'normal' },
  product_rejected: { icon: 'x-circle', color: '#ef4444', priority: 'high' },
  product_pending: { icon: 'clock', color: '#f59e0b', priority: 'normal' },
  store_approved: { icon: 'store', color: '#10b981', priority: 'normal' },
  store_rejected: { icon: 'store', color: '#ef4444', priority: 'high' },
  store_application: { icon: 'store', color: '#3b82f6', priority: 'normal' },
  promotion: { icon: 'sparkles', color: '#f59e0b', priority: 'normal' },
  announcement: { icon: 'megaphone', color: '#3b82f6', priority: 'normal' },
  system: { icon: 'settings', color: '#6b7280', priority: 'normal' },
  social: { icon: 'users', color: '#8b5cf6', priority: 'low' },
  message: { icon: 'message-circle', color: '#8b5cf6', priority: 'high' },
  review: { icon: 'star', color: '#f59e0b', priority: 'normal' },
  follow: { icon: 'user-plus', color: '#3b82f6', priority: 'low' },
};