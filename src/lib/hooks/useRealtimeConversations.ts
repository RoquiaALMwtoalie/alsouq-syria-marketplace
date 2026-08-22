// src/lib/hooks/useRealtimeConversations.ts

import { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { toast } from "sonner";
import { useApp } from "@/lib/i18n";

// ====== Query Keys ======
const QUERY_KEYS = {
  conversations: (userId: string) => ["conversations", userId],
  messages: (conversationId: string) => ["messages", conversationId],
  unreadCount: (userId: string) => ["unread-count", userId],
  onlineStatus: (userId: string) => ["online-status", userId],
};

// ====== صوت الإشعار ======
let notificationSound: HTMLAudioElement | null = null;
let soundEnabled = true;

const getNotificationSound = (): HTMLAudioElement => {
  if (notificationSound) return notificationSound;
  
  try {
    notificationSound = new Audio("/notification.mp3");
    notificationSound.volume = 0.3;
    notificationSound.load();
  } catch {
    try {
      notificationSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
      notificationSound.volume = 0.3;
      notificationSound.load();
    } catch {
      notificationSound = {
        play: () => Promise.resolve(),
        pause: () => {},
        currentTime: 0,
        volume: 0.3,
      } as HTMLAudioElement;
    }
  }
  return notificationSound;
};

const playNotificationSound = () => {
  if (!soundEnabled) return;
  try {
    const sound = getNotificationSound();
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    }
  } catch {}
};

export const toggleSound = (enabled: boolean) => {
  soundEnabled = enabled;
};

const sendBrowserNotification = (title: string, body: string, icon?: string) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  try {
    const notification = new Notification(title, {
      body: body,
      icon: icon || '/favicon.ico',
      badge: '/favicon.ico',
      vibrate: [200, 100, 200],
      tag: 'message-notification',
      requireInteraction: true,
      silent: false,
    });

    setTimeout(() => notification.close(), 7000);

    notification.onclick = () => {
      window.focus();
      notification.close();
      const match = body.match(/\/messages\/([^?]+)/);
      if (match) {
        window.location.href = `/messages/${match[1]}`;
      }
    };

    return notification;
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch (error) {
    return false;
  }
};

// ============================================================
// ✅ متغيرات لمنع التكرار (خارج الدالة)
// ============================================================
let isRealtimeSetup = false;
let setupTimeout: NodeJS.Timeout | null = null;
let currentUserId: string | null = null;

// ============================================================
// 🔥 HOOK: حالة المستخدم مع Realtime (محدثة لحظياً) ✅ NEW
// ============================================================
export function useRealtimeUserStatus(userId: string | undefined) {
  const [isOnline, setIsOnline] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    let isMounted = true;

    // جلب البيانات الأولية
    const fetchUserStatus = async () => {
      try {
        const { data: userData, error } = await supabase
          .from("profiles")
          .select("is_online, last_seen_at")
          .eq("id", userId)
          .single();

        if (error) throw error;

        if (isMounted) {
          setData(userData);
          setIsOnline(userData?.is_online || false);
          setLoading(false);
        }
      } catch (error) {
        console.error("❌ Error fetching user status:", error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserStatus();

    // ✅ الاشتراك في التحديثات اللحظية (Realtime)
    const channel = supabase
      .channel(`user-status-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (!isMounted) return;
          const updated = payload.new as any;
          setData(updated);
          setIsOnline(updated?.is_online || false);
        }
      )
      .subscribe();

    // ✅ تنظيف القناة عند إزالة المكون
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return { data, isOnline, loading };
}

// ============================================================
// ====== الـ Hook الرئيسي (مُحسّن لمنع الـ Re-renders اللانهائية)
// ============================================================
export function useRealtimeConversations(userId: string | undefined) {
  const queryClient = useQueryClient();
  const app = useApp();
  
  // استخدام الـ Refs لتثبيت قيم اللغات والحالات لمنع إعادة تهيئة القنوات
  const langRef = useRef(app.lang);
  useEffect(() => {
    langRef.current = app.lang;
  }, [app.lang]);

  // Refs لتتبع القنوات وحمايتها من التكرار
  const channelsRef = useRef<{
    messages?: any;
    conversations?: any;
    presence?: any;
    typing?: any;
  }>({});

  const cleanupChannels = useCallback(() => {
    Object.values(channelsRef.current).forEach((channel) => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch {}
      }
    });
    channelsRef.current = {};
    isRealtimeSetup = false;
    currentUserId = null;
  }, []);

  // طلب إذن الإشعارات مرة واحدة عند التحميل
  useEffect(() => {
    if (userId) {
      const timer = setTimeout(() => {
        requestNotificationPermission();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  // الاشتراك في قنوات الـ Realtime بناءً على الـ userId فقط
  useEffect(() => {
    if (!userId) {
      cleanupChannels();
      return;
    }

    // ✅ إذا تم الإعداد مسبقاً لنفس المستخدم، لا تفعل شيئاً
    if (isRealtimeSetup && currentUserId === userId) {
      console.log('⏳ [useRealtimeConversations] Already setup for user:', userId);
      return;
    }

    // ✅ إذا كان هناك مستخدم مختلف، قم بتنظيف القنوات القديمة
    if (currentUserId && currentUserId !== userId) {
      console.log('🔄 [useRealtimeConversations] User changed, cleaning up old channels...');
      cleanupChannels();
      isRealtimeSetup = false;
    }

    // ✅ منع التكرار أثناء الإعداد
    if (setupTimeout) {
      clearTimeout(setupTimeout);
      setupTimeout = null;
    }

    console.log("🔄 Setting up Realtime channels for user:", userId);

    // ✅ تأخير الإعداد 3 ثواني لتجنب التصارع
    setupTimeout = setTimeout(() => {
      if (!userId) return;
      
      // ✅ إذا كانت القنوات مفعلة مسبقاً، لا داعي لإعادة إنشائها
      if (channelsRef.current.messages && isRealtimeSetup) {
        console.log('⏳ [useRealtimeConversations] Channels already exist, skipping...');
        return;
      }

      // ✅ تحديث الحالة
      isRealtimeSetup = true;
      currentUserId = userId;

      // 1️⃣ قناة الرسائل الجديدة
      const messagesChannel = supabase
        .channel(`messages-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${userId}`,
          },
          async (payload) => {
            const newMessage = payload.new as any;
            console.log("📩 New message received:", newMessage);

            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.messages(newMessage.conversation_id),
            });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.conversations(userId),
            });
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.unreadCount(userId),
            });

            const store = useConversationStore.getState();
            store.addMessage(newMessage.conversation_id, newMessage);

            store.updateConversation({
              id: newMessage.conversation_id,
              last_message: newMessage.content,
              last_message_at: newMessage.created_at,
              last_message_sender_id: newMessage.sender_id,
            } as any);

            const isActive = store.activeConversationId === newMessage.conversation_id;
            
            if (!isActive) {
              const isAr = langRef.current === "ar";
              toast.info(
                isAr ? "📩 رسالة جديدة" : "📩 New message",
                {
                  description: newMessage.content?.substring(0, 60) || (isAr ? "رسالة جديدة" : "New message"),
                  duration: 6000,
                  position: "top-right",
                  action: {
                    label: isAr ? "عرض" : "View",
                    onClick: () => {
                      window.location.href = `/messages/${newMessage.sender_id}?cid=${newMessage.conversation_id}`;
                    },
                  },
                }
              );

              playNotificationSound();

              sendBrowserNotification(
                isAr ? "📩 رسالة جديدة" : "📩 New Message",
                newMessage.content?.substring(0, 80) || (isAr ? "لديك رسالة جديدة" : "You have a new message"),
                '/favicon.ico'
              );

              const { conversations } = useConversationStore.getState();
              const unreadCount = conversations.reduce(
                (total, conv) => total + (conv.unread_count_participant1 || 0) + (conv.unread_count_participant2 || 0),
                0
              );
              if (unreadCount > 0) {
                document.title = `(${unreadCount}) السوق اليك`;
              }
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `receiver_id=eq.${userId}`,
          },
          (payload) => {
            const updated = payload.new as any;
            queryClient.invalidateQueries({
              queryKey: QUERY_KEYS.messages(updated.conversation_id),
            });
          }
        )
        .subscribe((status) => {
          console.log(`📡 Messages channel status: ${status}`);
        });

      // 2️⃣ قناة تحديثات المحادثات
      const conversationsChannel = supabase
        .channel(`conversations-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "conversations",
            filter: `participant1_id=eq.${userId}`,
          },
          (payload) => {
            const updated = payload.new as any;
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations(userId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount(userId) });
            useConversationStore.getState().updateConversation(updated);
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "conversations",
            filter: `participant2_id=eq.${userId}`,
          },
          (payload) => {
            const updated = payload.new as any;
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations(userId) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.unreadCount(userId) });
            useConversationStore.getState().updateConversation(updated);
          }
        )
        .subscribe((status) => {
          console.log(`📡 Conversations channel status: ${status}`);
        });

      // 3️⃣ قناة حالة المستخدمين (Online/Offline)
      const presenceChannel = supabase
        .channel(`presence-${userId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
          },
          (payload) => {
            const updated = payload.new as any;
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.onlineStatus(updated.id) });
            queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations(userId) });
          }
        )
        .subscribe((status) => {
          console.log(`📡 Presence channel status: ${status}`);
        });

      // 4️⃣ قناة مؤشر الكتابة (Typing)
      const typingChannel = supabase
        .channel(`typing-${userId}`)
        .on("broadcast", { event: "typing" }, (payload) => {
          const { userId: typingUserId, conversationId, isTyping } = payload.payload;
          if (typingUserId === userId) return;
          useConversationStore.getState().setTyping(conversationId, typingUserId, isTyping);
        })
        .subscribe((status) => {
          console.log(`📡 Typing channel status: ${status}`);
        });

      channelsRef.current = {
        messages: messagesChannel,
        conversations: conversationsChannel,
        presence: presenceChannel,
        typing: typingChannel,
      };

      // 5️⃣ تحديث عنوان الصفحة ديناميكياً
      const updateTitle = () => {
        const { conversations } = useConversationStore.getState();
        const unreadCount = conversations.reduce(
          (total, conv) => total + (conv.unread_count_participant1 || 0) + (conv.unread_count_participant2 || 0),
          0
        );
        document.title = unreadCount > 0 ? `(${unreadCount}) السوق اليك` : "السوق اليك";
      };

      const unsubscribeStore = useConversationStore.subscribe(updateTitle);

      // ✅ تنظيف timeout بعد الانتهاء
      setupTimeout = null;

      // ✅ دالة التنظيف النهائية
      const cleanup = () => {
        console.log("🧹 Cleaning up Realtime channels");
        cleanupChannels();
        unsubscribeStore();
        document.title = "السوق اليك";
        isRealtimeSetup = false;
        currentUserId = null;
      };

      // ✅ إرجاع دالة التنظيف للـ useEffect
      return cleanup;
      
    }, 3000); // ✅ تأخير 3 ثواني

    return () => {
      if (setupTimeout) {
        clearTimeout(setupTimeout);
        setupTimeout = null;
      }
    };
  }, [userId]); // ✅ إزالة queryClient و cleanupChannels من dependencies

  // إرجاع دالة لإعادة تعيين الحالة عند الحاجة
  return {
    reset: () => {
      cleanupChannels();
      isRealtimeSetup = false;
      currentUserId = null;
    }
  };
}

// ============================================================
// 🔥 HOOK: إرسال مؤشر الكتابة
// ============================================================
export function useSendTypingIndicator(
  conversationId: string | undefined,
  userId: string | undefined
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback((isTyping: boolean) => {
    if (!conversationId || !userId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    try {
      supabase.channel(`typing-${userId}`).send({
        type: "broadcast",
        event: "typing",
        payload: { userId, conversationId, isTyping },
        shouldRetry: true,
      });
    } catch {
      try {
        supabase.channel(`typing-${userId}`).httpSend({
          type: "broadcast",
          event: "typing",
          payload: { userId, conversationId, isTyping },
        });
      } catch {}
    }

    if (isTyping) {
      timeoutRef.current = setTimeout(() => {
        try {
          supabase.channel(`typing-${userId}`).send({
            type: "broadcast",
            event: "typing",
            payload: { userId, conversationId, isTyping: false },
            shouldRetry: true,
          });
        } catch {}
        timeoutRef.current = null;
      }, 3000);
    }
  }, [conversationId, userId]);
}

// ============================================================
// 🔥 HOOK: إرسال إشعار قراءة (Read Receipt)
// ============================================================
export function useSendReadReceipt() {
  const queryClient = useQueryClient();

  return useCallback(async (conversationId: string, userId: string) => {
    try {
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("receiver_id", userId)
        .is("read_at", null);

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.conversations(userId) });

      useConversationStore.getState().markAsRead(conversationId);
    } catch (error) {
      console.error("Error sending read receipt:", error);
    }
  }, [queryClient]);
}

// ============================================================
// 🔥 HOOK: إدارة الصوت والإشعارات
// ============================================================
export function useNotificationSound() {
  const [isEnabled, setIsEnabled] = useState(soundEnabled);
  const app = useApp();

  const toggleSoundState = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    soundEnabled = newState;
    
    if (newState) {
      try {
        const sound = getNotificationSound();
        if (sound) {
          sound.currentTime = 0;
          sound.play().catch(() => {});
        }
      } catch {}
      toast.success(app.lang === "ar" ? "🔔 تم تفعيل الصوت" : "🔔 Sound enabled");
    } else {
      toast.info(app.lang === "ar" ? "🔇 تم تعطيل الصوت" : "🔇 Sound disabled");
    }
  };

  const playSound = () => {
    if (isEnabled) {
      playNotificationSound();
    }
  };

  return { isEnabled, toggleSound: toggleSoundState, playSound };
}

// ============================================================
// 🔥 HOOK: الإشعارات الفورية (Push Notifications)
// ============================================================
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const app = useApp();

  useEffect(() => {
    const supported = "Notification" in window;
    setIsSupported(supported);
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) {
      toast.error(app.lang === "ar" ? "الإشعارات غير مدعومة في هذا المتصفح" : "Notifications not supported in this browser");
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === "granted") {
        toast.success(app.lang === "ar" ? "✅ تم تفعيل الإشعارات" : "✅ Notifications enabled");
        return true;
      } else {
        toast.error(app.lang === "ar" ? "❌ تم رفض الإشعارات" : "❌ Notifications denied");
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const sendNotification = (title: string, options?: NotificationOptions) => {
    if (!isSupported || permission !== "granted") return;

    try {
      const notification = new Notification(title, {
        icon: "/favicon.ico",
        badge: "/favicon.ico",
        ...options,
      });

      setTimeout(() => notification.close(), 7000);
      return notification;
    } catch (error) {}
  };

  return { permission, isSupported, requestPermission, sendNotification };
}