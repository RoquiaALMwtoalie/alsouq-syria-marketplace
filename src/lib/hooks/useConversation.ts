// src/lib/hooks/useConversation.ts

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { conversationService, IConversation, IMessage } from "@/lib/services/conversationService";
import { useApp } from "@/lib/i18n";
import { toast } from "sonner";
import { useEffect, useCallback, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// ====== QUERY KEYS ======
const QUERY_KEYS = {
  conversations: (userId: string) => ["conversations", userId],
  messages: (conversationId: string) => ["messages", conversationId],
  unreadCount: (userId: string) => ["unread-count", userId],
  onlineStatus: (userId: string) => ["online-status", userId],
};

// ====== أنواع الأخطاء ======
export type ConversationError = {
  code: 'NETWORK' | 'PERMISSION' | 'TIMEOUT' | 'UNKNOWN' | 'AUTH';
  message: string;
  retryable: boolean;
};

// ====== دالة الحصول على رسالة خطأ مفهومة ======
const getErrorMessage = (error: any, lang: string): ConversationError => {
  console.error("🔴 Error details:", error);
  
  // خطأ المصادقة
  if (error.message?.includes('authenticated') || error.message?.includes('JWT')) {
    return {
      code: 'AUTH',
      message: lang === 'ar' 
        ? '🔒 يرجى تسجيل الدخول مرة أخرى'
        : '🔒 Please login again',
      retryable: false,
    };
  }
  
  // أخطاء الشبكة
  if (error.message?.includes('network') || 
      error.message?.includes('fetch') ||
      error.code === 'NETWORK_ERROR' ||
      error.message?.includes('Failed to fetch')) {
    return {
      code: 'NETWORK',
      message: lang === 'ar' 
        ? '⚠️ مشكلة في الاتصال بالإنترنت. تأكد من اتصالك وحاول مرة أخرى.'
        : '⚠️ Network issue. Check your connection and try again.',
      retryable: true,
    };
  }
  
  // أخطاء الصلاحية
  if (error.message?.includes('permission') || 
      error.code === 'PERMISSION_DENIED' ||
      error.message?.includes('RLS')) {
    return {
      code: 'PERMISSION',
      message: lang === 'ar'
        ? '🔒 ليس لديك صلاحية لهذه العملية.'
        : '🔒 You don\'t have permission for this action.',
      retryable: false,
    };
  }
  
  // انتهاء المهلة
  if (error.message?.includes('timeout') || 
      error.code === 'TIMEOUT' ||
      error.message?.includes('timed out')) {
    return {
      code: 'TIMEOUT',
      message: lang === 'ar'
        ? '⏱️ استغرق الطلب وقتاً طويلاً. حاول مرة أخرى.'
        : '⏱️ Request timed out. Please try again.',
      retryable: true,
    };
  }
  
  // خطأ في قاعدة البيانات
  if (error.message?.includes('database') || 
      error.message?.includes('DB')) {
    return {
      code: 'UNKNOWN',
      message: lang === 'ar'
        ? '❌ حدث خطأ في قاعدة البيانات. حاول مرة أخرى.'
        : '❌ Database error. Please try again.',
      retryable: true,
    };
  }
  
  // خطأ غير معروف
  return {
    code: 'UNKNOWN',
    message: lang === 'ar'
      ? '❌ حدث خطأ غير متوقع. حاول مرة أخرى.'
      : '❌ An unexpected error occurred. Please try again.',
    retryable: true,
  };
};

// ====== دالة عرض الخطأ مع زر إعادة المحاولة ======
const showErrorToast = (error: ConversationError, onRetry?: () => void) => {
  toast.error(error.message, {
    duration: 5000,
    action: error.retryable && onRetry ? {
      label: '🔄 إعادة المحاولة',
      onClick: onRetry,
    } : undefined,
  });
};

// ============================================================
// 1️⃣ HOOK: جلب المحادثات
// ============================================================
export function useConversations() {
  const app = useApp();
  const userId = app.user?.id;
  const [retryCount, setRetryCount] = useState(0);

  return useQuery({
    queryKey: QUERY_KEYS.conversations(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User not authenticated");
      return conversationService.getConversations(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
  });
}

// ============================================================
// 2️⃣ HOOK: جلب رسائل محادثة
// ============================================================
export function useMessages(conversationId: string | undefined, limit: number = 50) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.messages(conversationId || ""),
    queryFn: ({ pageParam = 0 }) => {
      if (!conversationId) return [];
      return conversationService.getMessages(conversationId, limit, pageParam);
    },
    enabled: !!conversationId,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length < limit) return undefined;
      return allPages.length * limit;
    },
    staleTime: 30 * 1000,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
  });
}

// ============================================================
// 3️⃣ HOOK: ✅ إرسال رسالة (مع دعم الموقع وإعادة المحاولة)
// ============================================================
export function useSendMessage() {
  const queryClient = useQueryClient();
  const app = useApp();
  const [retryQueue, setRetryQueue] = useState<any[]>([]);

  const sendMessageFn = async (params: {
    receiverId: string;
    content: string;
    type?: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location';
    file?: File;
    file_url?: string;
    file_name?: string;
    file_size?: number;
    reply_to_id?: string;
    location?: { latitude: number; longitude: number };
  }) => {
    if (!app.user) {
      const error = new Error("User not authenticated");
      (error as any).code = 'AUTH';
      throw error;
    }
    
    console.log("📤 useSendMessage - mutationFn:", {
      receiverId: params.receiverId,
      content: params.content,
      file: params.file?.name,
      hasFile: !!params.file,
      hasLocation: !!params.location,
    });
    
    return conversationService.sendMessage(
      app.user.id,
      params.receiverId,
      params.content,
      { 
        type: params.type, 
        file: params.file, 
        file_url: params.file_url, 
        file_name: params.file_name, 
        file_size: params.file_size, 
        reply_to_id: params.reply_to_id,
        location: params.location,
      }
    );
  };

  const mutation = useMutation({
    mutationFn: sendMessageFn,
    onSuccess: (message, variables) => {
      const userId = app.user?.id;

      if (userId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.conversations(userId),
        });
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.unreadCount(userId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(message.conversation_id),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(variables.receiverId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.unreadCount(variables.receiverId),
      });

      toast.success("✅ تم إرسال الرسالة");
    },
    onError: (error, variables) => {
      console.error("❌ Error sending message:", error);
      
      const errorInfo = getErrorMessage(error, app.lang);
      
      // إذا كان الخطأ قابل لإعادة المحاولة، نعرض زر إعادة المحاولة
      if (errorInfo.retryable) {
        toast.error(errorInfo.message, {
          duration: 8000,
          action: {
            label: '🔄 إعادة المحاولة',
            onClick: () => {
              // إعادة محاولة الإرسال
              mutation.mutate(variables);
            },
          },
        });
      } else {
        toast.error(errorInfo.message, {
          duration: 5000,
        });
      }
    },
  });

  // ✅ دالة لإعادة المحاولة مع تأخير
  const retrySend = useCallback((params: Parameters<typeof sendMessageFn>[0]) => {
    // تأخير 2 ثانية قبل إعادة المحاولة
    setTimeout(() => {
      mutation.mutate(params);
    }, 2000);
  }, [mutation]);

  return {
    ...mutation,
    retrySend,
  };
}

// ============================================================
// 4️⃣ HOOK: تعيين الرسائل كمقروءة
// ============================================================
export function useMarkAsRead() {
  const queryClient = useQueryClient();
  const app = useApp();

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      return conversationService.markAsRead(conversationId, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(variables.conversationId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.unreadCount(variables.userId),
      });
    },
    onError: (error) => {
      console.error("❌ Error marking as read:", error);
      const errorInfo = getErrorMessage(error, app.lang);
      toast.error(errorInfo.message, { duration: 3000 });
    },
  });
}

// ============================================================
// 5️⃣ HOOK: حذف محادثة
// ============================================================
export function useDeleteConversation() {
  const queryClient = useQueryClient();
  const app = useApp();

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      return conversationService.deleteConversation(conversationId, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.unreadCount(variables.userId),
      });
      toast.success("🗑️ تم حذف المحادثة");
    },
    onError: (error) => {
      console.error("❌ Error deleting conversation:", error);
      const errorInfo = getErrorMessage(error, app.lang);
      toast.error(errorInfo.message, { duration: 5000 });
    },
  });
}

// ============================================================
// 6️⃣ HOOK: عدد الرسائل غير المقروءة
// ============================================================
export function useUnreadCount() {
  const app = useApp();
  const userId = app.user?.id;

  return useQuery({
    queryKey: QUERY_KEYS.unreadCount(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User not authenticated");
      return conversationService.getUnreadCount(userId);
    },
    enabled: !!userId,
    staleTime: 10 * 1000,
    refetchInterval: 30 * 1000,
    retry: 2,
  });
}

// ============================================================
// 7️⃣ HOOK: إنشاء أو جلب محادثة
// ============================================================
export function useGetOrCreateConversation() {
  const queryClient = useQueryClient();
  const app = useApp();

  return useMutation({
    mutationFn: async ({
      userId,
      otherUserId,
    }: {
      userId: string;
      otherUserId: string;
    }) => {
      return conversationService.getOrCreateConversation(userId, otherUserId);
    },
    onSuccess: (conversation, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(variables.userId),
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(variables.otherUserId),
      });
    },
    onError: (error) => {
      console.error("❌ Error creating conversation:", error);
      const errorInfo = getErrorMessage(error, app.lang);
      toast.error(errorInfo.message, { duration: 5000 });
    },
  });
}

// ============================================================
// 8️⃣ HOOK: تحديث آخر ظهور
// ============================================================
export function useUpdateLastSeen() {
  const queryClient = useQueryClient();
  const app = useApp();

  return useMutation({
    mutationFn: async ({ userId }: { userId: string }) => {
      return conversationService.updateLastSeen(userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.onlineStatus(variables.userId),
      });
    },
    onError: (error) => {
      console.error("❌ Error updating last seen:", error);
    },
  });
}

// ============================================================
// 9️⃣ HOOK: كتم إشعارات المحادثة
// ============================================================
export function useMuteConversation() {
  const queryClient = useQueryClient();
  const app = useApp();

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      return conversationService.muteConversation(conversationId, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(variables.userId),
      });
      toast.success("🔇 تم تحديث إعدادات الإشعارات");
    },
    onError: (error) => {
      console.error("❌ Error muting conversation:", error);
      const errorInfo = getErrorMessage(error, app.lang);
      toast.error(errorInfo.message, { duration: 5000 });
    },
  });
}

// ============================================================
// 🔟 HOOK: تثبيت محادثة
// ============================================================
export function usePinConversation() {
  const queryClient = useQueryClient();
  const app = useApp();

  return useMutation({
    mutationFn: async ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      return conversationService.pinConversation(conversationId, userId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.conversations(variables.userId),
      });
      toast.success("📌 تم تحديث التثبيت");
    },
    onError: (error) => {
      console.error("❌ Error pinning conversation:", error);
      const errorInfo = getErrorMessage(error, app.lang);
      toast.error(errorInfo.message, { duration: 5000 });
    },
  });
}

// ============================================================
// 1️⃣1️⃣ HOOK: حذف رسالة للجميع
// ============================================================
export function useDeleteMessageForEveryone() {
  const queryClient = useQueryClient();
  const app = useApp();

  return useMutation({
    mutationFn: async ({ messageId }: { messageId: string }) => {
      return conversationService.deleteMessageForEveryone(messageId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["messages"],
      });
      toast.success("🗑️ تم حذف الرسالة للجميع");
    },
    onError: (error) => {
      console.error("❌ Error deleting message:", error);
      const errorInfo = getErrorMessage(error, app.lang);
      toast.error(errorInfo.message, { duration: 5000 });
    },
  });
}

// ============================================================
// 1️⃣2️⃣ HOOK: إعادة توجيه رسالة
// ============================================================
export function useForwardMessage() {
  const queryClient = useQueryClient();
  const app = useApp();

  return useMutation({
    mutationFn: async ({
      messageId,
      newConversationId,
      senderId,
    }: {
      messageId: string;
      newConversationId: string;
      senderId: string;
    }) => {
      return conversationService.forwardMessage(messageId, newConversationId, senderId);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.messages(variables.newConversationId),
      });
      toast.success("✅ تم إعادة توجيه الرسالة");
    },
    onError: (error) => {
      console.error("❌ Error forwarding message:", error);
      const errorInfo = getErrorMessage(error, app.lang);
      toast.error(errorInfo.message, { duration: 5000 });
    },
  });
}

// ============================================================
// 1️⃣3️⃣ HOOK: حالة المستخدم
// ============================================================
export function useUserStatus(userId: string | undefined) {
  const app = useApp();

  return useQuery({
    queryKey: QUERY_KEYS.onlineStatus(userId || ""),
    queryFn: async () => {
      if (!userId) return { is_online: false, last_seen_at: null };
      
      const { data, error } = await supabase
        .from("profiles")
        .select("is_online, last_seen_at")
        .eq("id", userId)
        .single();

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
    staleTime: 10 * 1000,
    refetchInterval: 15 * 1000,
    retry: 2,
  });
}

// ============================================================
// 1️⃣4️⃣ HOOK: إرسال مؤشر الكتابة
// ============================================================
// ============================================================
// 1️⃣4️⃣ HOOK: إرسال مؤشر الكتابة
// ============================================================
export function useSendTypingIndicator(
  conversationId: string | undefined,
  userId: string | undefined
) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stopTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendTyping = useCallback((isTyping: boolean) => {
    if (!conversationId || !userId) return;

    // إلغاء المؤقتات السابقة
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
      stopTimeoutRef.current = null;
    }

    // ✅ استخدام send() بشكل صحيح (بدون shouldRetry)
    supabase.channel("typing-realtime").send({
      type: "broadcast",
      event: "typing",
      payload: {
        userId,
        conversationId,
        isTyping,
      },
    });

    // إذا كان يكتب، أرسل إشارة توقف بعد 3 ثواني
    if (isTyping) {
      stopTimeoutRef.current = setTimeout(() => {
        supabase.channel("typing-realtime").send({
          type: "broadcast",
          event: "typing",
          payload: {
            userId,
            conversationId,
            isTyping: false,
          },
        });
        stopTimeoutRef.current = null;
      }, 3000);
    }
  }, [conversationId, userId]);

  // تنظيف عند إلغاء التثبيت
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (stopTimeoutRef.current) {
        clearTimeout(stopTimeoutRef.current);
        stopTimeoutRef.current = null;
      }
      // إرسال إشارة توقف عند مغادرة الصفحة
      if (conversationId && userId) {
        supabase.channel("typing-realtime").send({
          type: "broadcast",
          event: "typing",
          payload: {
            userId,
            conversationId,
            isTyping: false,
          },
        });
      }
    };
  }, [conversationId, userId]);

  return sendTyping;
}
// ============================================================
// 1️⃣5️⃣ Realtime لحالة المستخدم
// ============================================================
export function useRealtimeUserStatus(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel("user-status")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          queryClient.setQueryData(
            QUERY_KEYS.onlineStatus(userId),
            {
              is_online: updated.is_online,
              last_seen_at: updated.last_seen_at,
            }
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}

// ============================================================
// 1️⃣6️⃣ تتبع وجود المستخدم (محسّن)
// ============================================================
export function useTrackUserPresence() {
  const app = useApp();
  const userId = app.user?.id;
  const updateLastSeen = useUpdateLastSeen();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!userId) return;

    // تعيين المستخدم كـ online عند التحميل
    const setInitialOnline = async () => {
      try {
        await conversationService.updateLastSeen(userId);
        setIsOnline(true);
      } catch (error) {
        console.error("Error setting initial online status:", error);
      }
    };
    setInitialOnline();

    // تحديث كل 30 ثانية
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updateLastSeen.mutate({ userId });
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    }, 30000);

    // عند عودة المستخدم للصفحة
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateLastSeen.mutate({ userId });
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // عند إغلاق الصفحة
    const handleBeforeUnload = () => {
      conversationService.setOffline(userId);
      setIsOnline(false);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
      conversationService.setOffline(userId);
      setIsOnline(false);
    };
  }, [userId, updateLastSeen]);

  return { isOnline };
}