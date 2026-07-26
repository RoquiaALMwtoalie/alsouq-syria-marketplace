// src/lib/channelManager.ts
import { supabase } from "@/integrations/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";

type ChannelCallback = (payload: any) => void;

class ChannelManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private callbacks: Map<string, Set<ChannelCallback>> = new Map();

  // ✅ اشترك في قناة مع رد اتصال
  subscribe(channelName: string, callback: ChannelCallback): () => void {
    // ✅ تخزين رد الاتصال
    if (!this.callbacks.has(channelName)) {
      this.callbacks.set(channelName, new Set());
    }
    this.callbacks.get(channelName)!.add(callback);

    // ✅ إنشاء القناة إذا لم تكن موجودة
    if (!this.channels.has(channelName)) {
      const channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${channelName.replace('profile-', '')}`,
          },
          (payload) => {
            // ✅ تنفيذ جميع ردود الاتصال
            const callbacks = this.callbacks.get(channelName);
            if (callbacks) {
              callbacks.forEach(cb => cb(payload));
            }
          }
        )
        .subscribe((status) => {
          console.log(`📡 Channel ${channelName} status: ${status}`);
        });

      this.channels.set(channelName, channel);
      console.log(`✅ Channel ${channelName} created`);
    }

    // ✅ إرجاع دالة لإلغاء الاشتراك
    return () => {
      const callbacks = this.callbacks.get(channelName);
      if (callbacks) {
        callbacks.delete(callback);
        // ✅ إذا لم يعد هناك ردود اتصال، أغلق القناة
        if (callbacks.size === 0) {
          const channel = this.channels.get(channelName);
          if (channel) {
            supabase.removeChannel(channel);
            this.channels.delete(channelName);
            this.callbacks.delete(channelName);
            console.log(`❌ Channel ${channelName} closed`);
          }
        }
      }
    };
  }

  // ✅ الحصول على قناة (للاستخدام المباشر)
  getChannel(channelName: string): RealtimeChannel | undefined {
    return this.channels.get(channelName);
  }

  // ✅ إغلاق جميع القنوات
  closeAll() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.callbacks.clear();
    console.log('✅ All channels closed');
  }
}

// ✅ تصدير نسخة واحدة (Singleton)
export const channelManager = new ChannelManager();