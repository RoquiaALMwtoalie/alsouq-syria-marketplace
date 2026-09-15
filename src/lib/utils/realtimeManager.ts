// src/lib/utils/realtimeManager.ts

import { supabase } from '@/integrations/supabase/client';
import { getMaxWebSockets, isIOS } from './deviceDetection';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * 📡 Realtime Manager — يدير كل WebSockets من مكان واحد
 * 
 * ✅ الفوائد:
 * - يمنع إنشاء نفس القناة مرتين
 * - يمنع تجاوز الحد الأقصى (4 على iOS، 6 على Desktop)
 * - يوفر نقطة واحدة للتحكم بكل القنوات
 * - يدعم الحصول على قناة موجودة + إرسال broadcast
 * - يدعم إحصائيات تفصيلية + تشخيص
 */

/**
 * أنواع الـ handlers المدعومة
 */
export interface RealtimeHandler {
  type: 'postgres_changes' | 'presence' | 'broadcast';
  config: any;
  callback: (payload: any) => void;
}

/**
 * تكوين القناة
 */
export interface ChannelConfig {
  name: string;
  handlers: RealtimeHandler[];
}

/**
 * معلومات تفصيلية عن قناة
 */
export interface ChannelInfo {
  name: string;
  handlerCount: number;
  isSubscribed: boolean;
  createdAt: number;
}

/**
 * مدير Realtime
 */
class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map();
  private channelMetadata: Map<string, { handlerCount: number; createdAt: number; isSubscribed: boolean }> = new Map();
  private maxChannels: number;
  private isIOSDevice: boolean;

  constructor() {
    this.maxChannels = getMaxWebSockets();
    this.isIOSDevice = isIOS();
    
    console.log(
      `📡 [RealtimeManager] Initialized — max: ${this.maxChannels}, iOS: ${this.isIOSDevice}`
    );
  }

  /**
   * ✅ إنشاء قناة موحّدة
   * 
   * - إذا القناة موجودة مسبقاً → يرجعها بدون إنشاء جديدة
   * - إذا وصلنا الحد الأقصى → يرفض الإنشاء ويسجل تحذير
   * - إذا في خطأ → يرجع null بدون كسر التطبيق
   */
  createChannel(config: ChannelConfig): RealtimeChannel | null {
    // ✅ 1. إذا القناة موجودة — أرجعها
    if (this.channels.has(config.name)) {
      console.log(`♻️ [RealtimeManager] Channel "${config.name}" already exists — reusing`);
      return this.channels.get(config.name)!;
    }

    // ✅ 2. فحص الحد الأقصى
    if (this.channels.size >= this.maxChannels) {
      console.warn(
        `⚠️ [RealtimeManager] Max channels reached (${this.maxChannels}), skipping "${config.name}"`
      );
      return null;
    }

    // ✅ 3. إنشاء القناة
    try {
      let channel = supabase.channel(config.name);

      // ✅ 4. أضف كل handlers
      config.handlers.forEach((handler) => {
        if (handler.type === 'postgres_changes') {
          channel = channel.on(
            'postgres_changes',
            handler.config,
            handler.callback
          );
        } else if (handler.type === 'presence') {
          channel = channel.on('presence', handler.config, handler.callback);
        } else if (handler.type === 'broadcast') {
          channel = channel.on('broadcast', handler.config, handler.callback);
        }
      });

      // ✅ 5. احفظ القناة + metadata قبل subscribe
      // (حتى يكون العدد صحيحاً عند subscribe callback)
      this.channels.set(config.name, channel);
      this.channelMetadata.set(config.name, {
        handlerCount: config.handlers.length,
        createdAt: Date.now(),
        isSubscribed: false,
      });

      // ✅ 6. اشترك
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(
            `✅ [RealtimeManager] "${config.name}" subscribed (${this.channels.size}/${this.maxChannels})`
          );
          console.log(
            `📊 [RealtimeManager] Active channels: [${Array.from(this.channels.keys()).join(', ')}]`
          );
          // ✅ حدّث metadata
          const meta = this.channelMetadata.get(config.name);
          if (meta) {
            meta.isSubscribed = true;
          }
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`❌ [RealtimeManager] "${config.name}" error`);
        } else if (status === 'TIMED_OUT') {
          console.warn(`⏱️ [RealtimeManager] "${config.name}" timeout`);
        } else if (status === 'CLOSED') {
          console.log(`🔌 [RealtimeManager] "${config.name}" closed`);
          const meta = this.channelMetadata.get(config.name);
          if (meta) {
            meta.isSubscribed = false;
          }
        }
      });

      return channel;
    } catch (e) {
      console.error(
        `❌ [RealtimeManager] Failed to create "${config.name}":`,
        e
      );
      return null;
    }
  }

  /**
   * ✅ إزالة قناة واحدة
   */
  removeChannel(name: string): void {
    const channel = this.channels.get(name);
    if (!channel) {
      console.log(`ℹ️ [RealtimeManager] Channel "${name}" not found`);
      return;
    }

    try {
      supabase.removeChannel(channel);
      this.channels.delete(name);
      this.channelMetadata.delete(name);
      console.log(`🗑️ [RealtimeManager] Removed "${name}"`);
    } catch (e) {
      console.error(`❌ [RealtimeManager] Failed to remove "${name}":`, e);
    }
  }

  /**
   * ✅ إزالة كل القنوات
   */
  removeAll(): void {
    console.log(`🗑️ [RealtimeManager] Removing all ${this.channels.size} channels...`);
    Array.from(this.channels.keys()).forEach((name) => this.removeChannel(name));
  }

  /**
   * ✅ الحصول على قناة موجودة (للاستخدام المباشر)
   * 
   * يُستخدم مثلاً لإرسال broadcast typing
   */
  getChannel(name: string): RealtimeChannel | undefined {
    return this.channels.get(name);
  }

  /**
   * ✅ فحص وجود قناة
   */
  hasChannel(name: string): boolean {
    return this.channels.has(name);
  }

  /**
   * ✅ فحص هل القناة مشتركة (subscribed)
   */
  isChannelSubscribed(name: string): boolean {
    const meta = this.channelMetadata.get(name);
    return meta?.isSubscribed || false;
  }

  /**
   * ✅ عدد القنوات النشطة
   */
  getChannelCount(): number {
    return this.channels.size;
  }

  /**
   * ✅ قائمة أسماء القنوات
   */
  getChannelNames(): string[] {
    return Array.from(this.channels.keys());
  }

  /**
   * ✅ إرسال broadcast عبر قناة
   * 
   * مثال:
   *   realtimeManager.sendBroadcast('realtime-user123', 'typing', { userId, isTyping: true })
   */
  sendBroadcast(
    channelName: string,
    event: string,
    payload: any
  ): boolean {
    const channel = this.channels.get(channelName);
    if (!channel) {
      console.warn(`⚠️ [RealtimeManager] Cannot send broadcast — channel "${channelName}" not found`);
      return false;
    }

    try {
      channel.send({
        type: 'broadcast',
        event,
        payload,
      });
      return true;
    } catch (e) {
      console.error(`❌ [RealtimeManager] Broadcast failed on "${channelName}":`, e);
      return false;
    }
  }

  /**
   * ✅ معلومات تشخيصية عامة
   */
  getStats() {
    return {
      count: this.channels.size,
      max: this.maxChannels,
      channels: this.getChannelNames(),
      isIOS: this.isIOSDevice,
    };
  }

  /**
   * ✅ معلومات تفصيلية عن كل قناة
   */
  getDetailedStats(): ChannelInfo[] {
    const result: ChannelInfo[] = [];
    
    for (const [name, meta] of this.channelMetadata) {
      result.push({
        name,
        handlerCount: meta.handlerCount,
        isSubscribed: meta.isSubscribed,
        createdAt: meta.createdAt,
      });
    }
    
    return result;
  }
}

/**
 * ✅ Singleton instance — نسخة واحدة لكل التطبيق
 */
export const realtimeManager = new RealtimeManager();