// src/lib/services/presenceService.ts
import { supabase } from "@/integrations/supabase/client";

type PresenceState = {
  [key: string]: {
    user_id: string;
    online_at: string;
  }[];
};

class PresenceService {
  private channels: Map<string, any> = new Map();
  private presenceStates: Map<string, PresenceState> = new Map();
  private listeners: Map<string, ((state: PresenceState) => void)[]> = new Map();

  /**
   * ✅ اشتراك المستخدم في قناة Presence
   */
  subscribeToPresence(userId: string, onStateChange?: (state: PresenceState) => void) {
    if (this.channels.has(userId)) {
      console.log(`⚠️ User ${userId} already subscribed to presence`);
      return;
    }

    // ✅ إنشاء قناة Presence فريدة
    const channel = supabase.channel(`presence:${userId}`, {
      config: {
        presence: {
          key: userId,
        },
      },
    });

    // ✅ عند تحديث الحالة (مستخدم دخل أو خرج)
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState() as PresenceState;
      this.presenceStates.set(userId, state);
      
      // ✅ إعلام المستمعين
      const listeners = this.listeners.get(userId) || [];
      listeners.forEach(callback => callback(state));
      
      console.log(`✅ Presence updated for user ${userId}:`, state);
    });

    // ✅ عند دخول مستخدم جديد
    channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
      console.log(`👤 User ${key} joined presence`);
    });

    // ✅ عند خروج مستخدم
    channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
      console.log(`👋 User ${key} left presence`);
    });

    // ✅ الاشتراك في القناة
    channel.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`✅ User ${userId} subscribed to presence`);
        
        // ✅ تسجيل وجود المستخدم
        await channel.track({
          user_id: userId,
          online_at: new Date().toISOString(),
        });
      }
    });

    // ✅ حفظ القناة
    this.channels.set(userId, channel);

    // ✅ تسجيل المستمع
    if (onStateChange) {
      const existingListeners = this.listeners.get(userId) || [];
      this.listeners.set(userId, [...existingListeners, onStateChange]);
    }
  }

  /**
   * ✅ إلغاء اشتراك المستخدم من Presence
   */
  unsubscribeFromPresence(userId: string) {
    const channel = this.channels.get(userId);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(userId);
      this.presenceStates.delete(userId);
      this.listeners.delete(userId);
      console.log(`👋 User ${userId} unsubscribed from presence`);
    }
  }

  /**
   * ✅ جلب حالة المستخدمين المتصلين
   */
  getOnlineUsers(userId: string): string[] {
    const state = this.presenceStates.get(userId);
    if (!state) return [];
    
    return Object.keys(state);
  }

  /**
   * ✅ التحقق إذا كان مستخدم معين متصل
   */
  isUserOnline(userId: string, targetUserId: string): boolean {
    const state = this.presenceStates.get(userId);
    if (!state) return false;
    
    return !!state[targetUserId] && state[targetUserId].length > 0;
  }

  /**
   * ✅ الحصول على قائمة المتصلين مع تفاصيلهم
   */
  getOnlineUsersWithDetails(userId: string): any[] {
    const state = this.presenceStates.get(userId);
    if (!state) return [];
    
    const users: any[] = [];
    for (const [key, presences] of Object.entries(state)) {
      if (presences.length > 0) {
        users.push({
          user_id: key,
          online_at: presences[0].online_at,
        });
      }
    }
    return users;
  }

  /**
   * ✅ تنظيف جميع القنوات
   */
  cleanup() {
    for (const [userId, channel] of this.channels) {
      supabase.removeChannel(channel);
    }
    this.channels.clear();
    this.presenceStates.clear();
    this.listeners.clear();
    console.log('🧹 All presence channels cleaned up');
  }
}

export const presenceService = new PresenceService();