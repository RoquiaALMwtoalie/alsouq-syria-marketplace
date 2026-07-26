// src/lib/hooks/useRealtimeConversations.ts

import { useEffect, useRef, useState } from "react";
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

// ✅ محاولة تحميل الصوت من عدة مصادر
const getNotificationSound = (): HTMLAudioElement => {
  if (notificationSound) return notificationSound;
  
  // ✅ محاولة استخدام الملف المحلي أولاً
  try {
    notificationSound = new Audio("/notification.mp3");
    notificationSound.volume = 0.3;
    notificationSound.load();
  } catch {
    // ✅ إذا فشل، استخدم رابط خارجي
    try {
      notificationSound = new Audio("https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3");
      notificationSound.volume = 0.3;
      notificationSound.load();
    } catch {
      // ✅ إذا فشل كل شيء، استخدم Web Audio API
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.value = 0.3;
        
        // تشغيل نغمة قصيرة
        const audioBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.15, audioContext.sampleRate);
        const data = audioBuffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
          data[i] = Math.sin(i * 0.1) * 0.5;
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        notificationSound = {
          play: () => {
            source.start(0);
            return Promise.resolve();
          },
          pause: () => {},
          currentTime: 0,
          volume: 0.3,
        } as HTMLAudioElement;
      } catch {
        // ✅ آخر حل: كائن فارغ
        notificationSound = {
          play: () => Promise.resolve(),
          pause: () => {},
          currentTime: 0,
          volume: 0.3,
        } as HTMLAudioElement;
      }
    }
  }
  
  return notificationSound;
};

// ====== تشغيل الصوت ======
const playNotificationSound = () => {
  if (!soundEnabled) return;
  
  try {
    const sound = getNotificationSound();
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {
        // تجاهل الأخطاء
      });
    }
  } catch (error) {
    // تجاهل الأخطاء
  }
};

// ====== تفعيل/تعطيل الصوت ======
export const toggleSound = (enabled: boolean) => {
  soundEnabled = enabled;
};

// ====== إشعار المتصفح (Browser Notification) ======
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

    // إغلاق تلقائي بعد 7 ثواني
    setTimeout(() => notification.close(), 7000);

    // عند النقر على الإشعار
    notification.onclick = () => {
      window.focus();
      notification.close();
      // فتح المحادثة
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

// ====== طلب إذن الإشعارات ======
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission === 'denied') {
    console.log('Notification permission denied');
    return false;
  }

  try {
    const result = await Notification.requestPermission();
    return result === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

// ====== الـ Hook الرئيسي ======
export function useRealtimeConversations(userId: string | undefined) {
  const queryClient = useQueryClient();
  const app = useApp();
  
  // ====== Store ======
  const {
    addMessage,
    markAsRead: markAsReadInStore,
    setTyping,
    updateConversation,
    setConversations,
  } = useConversationStore();

  // ====== Refs لتتبع القنوات ======
  const channelsRef = useRef<{
    messages?: any;
    conversations?: any;
    presence?: any;
    typing?: any;
  }>({});

  // ====== تنظيف القنوات ======
  const cleanupChannels = () => {
    Object.values(channelsRef.current).forEach((channel) => {
      if (channel) {
        try {
          supabase.removeChannel(channel);
        } catch {}
      }
    });
    channelsRef.current = {};
  };

  // ====== طلب إذن الإشعارات عند التحميل ======
  useEffect(() => {
    if (userId) {
      // طلب إذن الإشعارات بعد 5 ثواني من التحميل
      const timer = setTimeout(() => {
        requestNotificationPermission();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      cleanupChannels();
      return;
    }

    console.log("🔄 Setting up Realtime channels for user:", userId);

    // ============================================================
    // 1️⃣ قناة الرسائل الجديدة
    // ============================================================
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

          // ✅ 1. تحديث الـ Cache
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.messages(newMessage.conversation_id),
          });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.conversations(userId),
          });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.unreadCount(userId),
          });

          // ✅ 2. تحديث الـ Store
          addMessage(newMessage.conversation_id, newMessage);

          // ✅ 3. تحديث آخر رسالة في المحادثة
          const conversationUpdate = {
            id: newMessage.conversation_id,
            last_message: newMessage.content,
            last_message_at: newMessage.created_at,
            last_message_sender_id: newMessage.sender_id,
          };
          updateConversation(conversationUpdate as any);

          // ✅ 4. إشعار إذا كانت المحادثة غير نشطة
          const { activeConversationId } = useConversationStore.getState();
          const isActive = activeConversationId === newMessage.conversation_id;
          
          if (!isActive) {
            // ✅ إشعار داخل التطبيق (Toast)
            toast.info(
              app.lang === "ar" ? "📩 رسالة جديدة" : "📩 New message",
              {
                description: newMessage.content?.substring(0, 60) || (app.lang === "ar" ? "رسالة جديدة" : "New message"),
                duration: 6000,
                position: "top-right",
                action: {
                  label: app.lang === "ar" ? "عرض" : "View",
                  onClick: () => {
                    window.location.href = `/messages/${newMessage.sender_id}?cid=${newMessage.conversation_id}`;
                  },
                },
              }
            );

            // ✅ 5. صوت الإشعار
            playNotificationSound();

            // ✅ 6. إشعار المتصفح (Push Notification)
            sendBrowserNotification(
              app.lang === "ar" ? "📩 رسالة جديدة" : "📩 New Message",
              newMessage.content?.substring(0, 80) || (app.lang === "ar" ? "لديك رسالة جديدة" : "You have a new message"),
              '/favicon.ico'
            );

            // ✅ 7. تحديث عدد الإشعارات في عنوان الصفحة
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
          console.log("📝 Message updated:", updated);
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.messages(updated.conversation_id),
          });
        }
      )
      .subscribe((status) => {
        console.log(`📡 Messages channel status: ${status}`);
      });

    // ============================================================
    // 2️⃣ قناة تحديثات المحادثات
    // ============================================================
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
          console.log("📋 Conversation updated:", updated);
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.conversations(userId),
          });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.unreadCount(userId),
          });
          updateConversation(updated);
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
          console.log("📋 Conversation updated (participant2):", updated);
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.conversations(userId),
          });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.unreadCount(userId),
          });
          updateConversation(updated);
        }
      )
      .subscribe((status) => {
        console.log(`📡 Conversations channel status: ${status}`);
      });

    // ============================================================
    // 3️⃣ قناة حالة المستخدمين (Online/Offline)
    // ============================================================
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
          console.log("👤 User status updated:", updated.id, updated.is_online);
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.onlineStatus(updated.id),
          });
          queryClient.invalidateQueries({
            queryKey: QUERY_KEYS.conversations(userId),
          });
        }
      )
      .subscribe((status) => {
        console.log(`📡 Presence channel status: ${status}`);
      });

    // ============================================================
    // 4️⃣ قناة مؤشر الكتابة (Typing)
    // ============================================================
    const typingChannel = supabase
      .channel(`typing-${userId}`)
      .on("broadcast", { event: "typing" }, (payload) => {
        const { userId: typingUserId, conversationId, isTyping } = payload.payload;
        if (typingUserId === userId) return;
        console.log(`✏️ Typing: ${typingUserId} in ${conversationId}: ${isTyping}`);
        setTyping(conversationId, typingUserId, isTyping);
      })
      .subscribe((status) => {
        console.log(`📡 Typing channel status: ${status}`);
      });

    // حفظ القنوات في الـ ref
    channelsRef.current = {
      messages: messagesChannel,
      conversations: conversationsChannel,
      presence: presenceChannel,
      typing: typingChannel,
    };

    // ============================================================
    // 5️⃣ تحديث عنوان الصفحة بعدد الإشعارات
    // ============================================================
    const updateTitle = () => {
      const { conversations } = useConversationStore.getState();
      const unreadCount = conversations.reduce(
        (total, conv) => total + (conv.unread_count_participant1 || 0) + (conv.unread_count_participant2 || 0),
        0
      );
      
      if (unreadCount > 0) {
        document.title = `(${unreadCount}) السوق اليك`;
      } else {
        document.title = "السوق اليك";
      }
    };

    const unsubscribe = useConversationStore.subscribe(updateTitle);

    // ============================================================
    // 6️⃣ التنظيف عند إلغاء التثبيت
    // ============================================================
    return () => {
      console.log("🧹 Cleaning up Realtime channels");
      cleanupChannels();
      unsubscribe();
      document.title = "السوق اليك";
    };
  }, [userId, queryClient, addMessage, updateConversation, setTyping, app.lang]);
}

// ============================================================
// 🔥 HOOK: إرسال مؤشر الكتابة
// ============================================================
export function useSendTypingIndicator(
  conversationId: string | undefined,
  userId: string | undefined
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendTyping = (isTyping: boolean) => {
    if (!conversationId || !userId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // ✅ استخدام send() مع shouldRetry لتجنب التحذير
    try {
      supabase.channel(`typing-${userId}`).send({
        type: "broadcast",
        event: "typing",
        payload: {
          userId,
          conversationId,
          isTyping,
        },
        shouldRetry: true,
      });
    } catch (error) {
      // إذا فشل send، جرب httpSend
      try {
        supabase.channel(`typing-${userId}`).httpSend({
          type: "broadcast",
          event: "typing",
          payload: {
            userId,
            conversationId,
            isTyping,
          },
        });
      } catch {}
    }

    if (isTyping) {
      timeoutRef.current = setTimeout(() => {
        try {
          supabase.channel(`typing-${userId}`).send({
            type: "broadcast",
            event: "typing",
            payload: {
              userId,
              conversationId,
              isTyping: false,
            },
            shouldRetry: true,
          });
        } catch {}
        timeoutRef.current = null;
      }, 3000);
    }
  };

  return sendTyping;
}

// ============================================================
// 🔥 HOOK: إرسال إشعار قراءة (Read Receipt)
// ============================================================
export function useSendReadReceipt() {
  const queryClient = useQueryClient();

  const sendReadReceipt = async (conversationId: string, userId: string) => {
    try {
      await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("conversation_id", conversationId)
        .eq("receiver_id", userId)
        .is("read_at", null);

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(userId),
      });

      const markAsReadInStore = useConversationStore.getState().markAsRead;
      markAsReadInStore(conversationId);

    } catch (error) {
      console.error("Error sending read receipt:", error);
    }
  };

  return sendReadReceipt;
}

// ============================================================
// 🔥 HOOK: إدارة الصوت والإشعارات
// ============================================================
export function useNotificationSound() {
  const [isEnabled, setIsEnabled] = useState(soundEnabled);

  const toggleSound = () => {
    const newState = !isEnabled;
    setIsEnabled(newState);
    soundEnabled = newState;
    
    if (newState) {
      // تشغيل صوت تجريبي
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

  const app = useApp();

  return { isEnabled, toggleSound, playSound };
}

// ============================================================
// 🔥 HOOK: الإشعارات الفورية (Push Notifications)
// ============================================================
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSupported, setIsSupported] = useState(false);
  const app = useApp();

  useEffect(() => {
    setIsSupported("Notification" in window);
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

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
      console.error("Error requesting notification permission:", error);
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

      setTimeout(() => {
        notification.close();
      }, 7000);

      return notification;
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    sendNotification,
  };
}