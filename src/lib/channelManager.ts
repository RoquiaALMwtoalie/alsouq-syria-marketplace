// src/lib/channelManager.ts
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

type ChannelCallback = (payload: any) => void;

class ChannelManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private callbacks: Map<string, Set<ChannelCallback>> = new Map();
  private channelTimestamps: Map<string, number> = new Map();
  private isSubscribing: Map<string, boolean> = new Map(); // ✅ منع الاشتراك المتكرر
  private reconnectTimeouts: Map<string, NodeJS.Timeout> = new Map(); // ✅ تتبع إعادة الاتصال
  private readonly MAX_CHANNELS = 10;
  private readonly CHANNEL_TTL = 5 * 60 * 1000;

  // ✅ اشترك في قناة مع رد اتصال - نسخة محسنة
  subscribe(channelName: string, callback: ChannelCallback): () => void {
    // ✅ منع الاشتراك المتكرر لنفس القناة
    if (this.isSubscribing.get(channelName)) {
      console.log(`⏳ [ChannelManager] Already subscribing to ${channelName}, skipping...`);
      return () => {};
    }

    // ✅ إذا كانت القناة موجودة، أضف الـ callback فقط
    if (this.channels.has(channelName)) {
      if (!this.callbacks.has(channelName)) {
        this.callbacks.set(channelName, new Set());
      }
      this.callbacks.get(channelName)!.add(callback);
      this.channelTimestamps.set(channelName, Date.now());
      console.log(`♻️ [ChannelManager] Added callback to existing channel: ${channelName}`);
      
      return () => {
        const callbacks = this.callbacks.get(channelName);
        if (callbacks) {
          callbacks.delete(callback);
          if (callbacks.size === 0) {
            this.closeChannel(channelName);
          }
        }
      };
    }

    // ✅ التحقق من عدد القنوات المفتوحة
    if (this.channels.size >= this.MAX_CHANNELS) {
      this.closeOldestChannel();
    }

    // ✅ تخزين رد الاتصال
    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, new Set());
    }
    this.callbacks.get(channelName)!.add(callback);

    // ✅ وضع علامة "جارٍ الاشتراك"
    this.isSubscribing.set(channelName, true);

    // ✅ إلغاء أي إعادة اتصال معلقة
    if (this.reconnectTimeouts.has(channelName)) {
      clearTimeout(this.reconnectTimeouts.get(channelName)!);
      this.reconnectTimeouts.delete(channelName);
    }

    // ✅ استخراج الـ user_id من اسم القناة (للتصفية)
    const userId = channelName.replace('profile-', '');
    
    const channel = supabase
      .channel(channelName, {
        config: {
          broadcast: { ack: true },
          presence: { key: userId },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const callbacks = this.callbacks.get(channelName);
          if (callbacks) {
            callbacks.forEach(cb => cb(payload));
          }
        }
      )
      .subscribe((status) => {
        console.log(`📡 Channel ${channelName} status: ${status}`);
        
        // ✅ إزالة علامة "جارٍ الاشتراك"
        this.isSubscribing.set(channelName, false);

        // ✅ إذا كانت الحالة CLOSED أو CHANNEL_ERROR، حاول إعادة الاتصال
        if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          const hasCallbacks = this.callbacks.has(channelName) && 
                               this.callbacks.get(channelName)!.size > 0;
          
          if (hasCallbacks && !this.reconnectTimeouts.has(channelName)) {
            console.log(`🔄 [ChannelManager] Will reconnect ${channelName} in 5s...`);
            const timeout = setTimeout(() => {
              this.reconnectTimeouts.delete(channelName);
              this.reconnectChannel(channelName);
            }, 5000); // ✅ زيادة المدة إلى 5 ثواني
            this.reconnectTimeouts.set(channelName, timeout);
          }
        }
      });

    this.channels.set(channelName, channel);
    this.channelTimestamps.set(channelName, Date.now());
    console.log(`✅ Channel ${channelName} created`);

    // ✅ إرجاع دالة لإلغاء الاشتراك
    return () => {
      const callbacks = this.callbacks.get(channelName);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.closeChannel(channelName);
        }
      }
    };
  }

  // ✅ إعادة الاتصال بالقناة - نسخة محسنة
  private reconnectChannel(channelName: string): void {
    // ✅ التحقق من وجود callbacks
    const hasCallbacks = this.callbacks.has(channelName) && 
                         this.callbacks.get(channelName)!.size > 0;
    
    if (!hasCallbacks) {
      console.log(`ℹ️ [ChannelManager] No callbacks for ${channelName}, skipping reconnect`);
      return;
    }

    // ✅ إزالة القناة القديمة
    const existingChannel = this.channels.get(channelName);
    if (existingChannel) {
      supabase.removeChannel(existingChannel);
      this.channels.delete(channelName);
    }

    // ✅ إزالة أي إعادة اتصال معلقة
    if (this.reconnectTimeouts.has(channelName)) {
      clearTimeout(this.reconnectTimeouts.get(channelName)!);
      this.reconnectTimeouts.delete(channelName);
    }

    // ✅ إعادة إنشاء القناة
    const userId = channelName.replace('profile-', '');
    const callbacks = this.callbacks.get(channelName);
    
    if (callbacks && callbacks.size > 0) {
      const newChannel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`,
          },
          (payload) => {
            const cbSet = this.callbacks.get(channelName);
            if (cbSet) {
              cbSet.forEach(cb => cb(payload));
            }
          }
        )
        .subscribe((status) => {
          console.log(`📡 Channel ${channelName} reconnected status: ${status}`);
        });

      this.channels.set(channelName, newChannel);
      this.channelTimestamps.set(channelName, Date.now());
      console.log(`✅ Channel ${channelName} reconnected`);
    }
  }

  // ✅ إغلاق أقدم قناة
  private closeOldestChannel(): void {
    let oldestKey: string | null = null;
    let oldestTime = Infinity;

    for (const [key, timestamp] of this.channelTimestamps) {
      if (timestamp < oldestTime) {
        oldestTime = timestamp;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.closeChannel(oldestKey);
    }
  }

  // ✅ إغلاق قناة محددة بشكل آمن
  closeChannel(channelName: string): void {
    // ✅ إلغاء أي إعادة اتصال معلقة
    if (this.reconnectTimeouts.has(channelName)) {
      clearTimeout(this.reconnectTimeouts.get(channelName)!);
      this.reconnectTimeouts.delete(channelName);
    }

    const channel = this.channels.get(channelName);
    if (channel) {
      supabase.removeChannel(channel);
      this.channels.delete(channelName);
      this.callbacks.delete(channelName);
      this.channelTimestamps.delete(channelName);
      this.isSubscribing.delete(channelName);
      console.log(`❌ Channel ${channelName} closed`);
    }
  }

  // ✅ الحصول على قناة (للاستخدام المباشر)
  getChannel(channelName: string): RealtimeChannel | undefined {
    if (this.channels.has(channelName)) {
      this.channelTimestamps.set(channelName, Date.now());
    }
    return this.channels.get(channelName);
  }

  // ✅ التحقق من وجود قناة
  hasChannel(channelName: string): boolean {
    return this.channels.has(channelName);
  }

  // ✅ الحصول على عدد القنوات المفتوحة
  getChannelCount(): number {
    return this.channels.size;
  }

  // ✅ إغلاق جميع القنوات
  closeAll(): void {
    // ✅ إلغاء جميع عمليات إعادة الاتصال المعلقة
    for (const [name, timeout] of this.reconnectTimeouts) {
      clearTimeout(timeout);
      this.reconnectTimeouts.delete(name);
    }

    for (const [channelName] of this.channels) {
      this.closeChannel(channelName);
    }
    console.log('✅ All channels closed');
  }

  // ✅ تنظيف القنوات المنتهية صلاحيتها (يُستدعى كل دقيقة)
  cleanupExpiredChannels(): void {
    const now = Date.now();
    const toRemove: string[] = [];

    for (const [channelName, timestamp] of this.channelTimestamps) {
      if (now - timestamp > this.CHANNEL_TTL) {
        const callbacks = this.callbacks.get(channelName);
        if (!callbacks || callbacks.size === 0) {
          toRemove.push(channelName);
        }
      }
    }

    for (const channelName of toRemove) {
      this.closeChannel(channelName);
    }

    if (toRemove.length > 0) {
      console.log(`🧹 [ChannelManager] Cleaned up ${toRemove.length} expired channels`);
    }
  }
}

// ✅ تصدير نسخة واحدة (Singleton)
export const channelManager = new ChannelManager();

// ✅ تنظيف تلقائي كل دقيقة
if (typeof window !== 'undefined') {
  setInterval(() => {
    channelManager.cleanupExpiredChannels();
  }, 60 * 1000);
}