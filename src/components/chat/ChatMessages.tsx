// src/components/chat/ChatMessages.tsx

import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";
import { useConversationStore } from "@/lib/stores/conversationStore";
import {
  useMessages,
  useSendMessage,
  useMarkAsRead,
  useDeleteConversation,
  useDeleteMessageForEveryone,
  useForwardMessage,
  useMuteConversation,
  usePinConversation,
  useUserStatus,
  useRealtimeUserStatus,
  useSendTypingIndicator,
} from "@/lib/hooks/useConversation";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/chat/ChatInput";
import { IMessageItem } from "@/components/chat/MessageItem";
import { MessageSearch } from "@/components/chat/MessageSearch";
import { VoiceCall } from "@/components/chat/VoiceCall";
import { VideoCall } from "@/components/chat/VideoCall";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

// ====== أنواع ======
interface ChatMessagesProps {
  userId: string;
  conversationId: string;
  otherUserId: string;
  className?: string;
  onBack?: () => void;
}

// ====== المكون الرئيسي ======
export function ChatMessages({
  userId,
  conversationId,
  otherUserId,
  className,
  onBack,
}: ChatMessagesProps) {
  const app = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ====== State ======
  const [replyTo, setReplyTo] = useState<IMessageItem | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const [forwardTarget, setForwardTarget] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isVoiceCall, setIsVoiceCall] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [callRoomName, setCallRoomName] = useState('');

  // ====== Refs ======
  const containerRef = useRef<HTMLDivElement>(null);

  // ====== Hooks ======
  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useMessages(conversationId);

  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const deleteConversation = useDeleteConversation();
  const deleteMessageForEveryone = useDeleteMessageForEveryone();
  const forwardMessage = useForwardMessage();
  const muteConversation = useMuteConversation();
  const pinConversation = usePinConversation();
  const { data: userStatus } = useUserStatus(otherUserId);
  const sendTyping = useSendTypingIndicator(conversationId, userId);

  // ====== Store ======
  const {
    conversations,
    messages: messagesStore,
    addMessage,
    markAsRead: markAsReadInStore,
    deleteConversation: deleteFromStore,
    togglePinConversation,
    toggleMuteConversation,
    setReplyToMessage,
    setForwardedMessage,
  } = useConversationStore();

  // ====== جلب بيانات المستخدم الآخر ======
  const [otherUser, setOtherUser] = useState<any>(null);
  const [isStore, setIsStore] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", otherUserId)
        .single();

      if (!error && data) {
        setOtherUser(data);
        setIsStore(!!data.store_name);
      }
    };

    fetchUser();
  }, [otherUserId]);

  // ====== جلب حالة المحادثة ======
  useEffect(() => {
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      setIsMuted(
        conv.participant1_id === userId
          ? conv.is_muted_participant1
          : conv.is_muted_participant2
      );
      setIsPinned(
        conv.participant1_id === userId
          ? !!conv.pinned_at_participant1
          : !!conv.pinned_at_participant2
      );
      setIsArchived(
        conv.participant1_id === userId
          ? conv.is_archived_participant1
          : conv.is_archived_participant2
      );
    }
  }, [conversations, conversationId, userId]);

  // ====== ✅ تحديد الرسائل كمقروءة (محسّن مع onSuccess) ======
  useEffect(() => {
    if (conversationId && userId) {
      console.log("📖 Calling markAsRead for:", userId, "in:", conversationId);
      
      // ✅ تنفيذ markAsRead مع onSuccess
      markAsRead.mutate(
        { conversationId, userId },
        {
          onSuccess: () => {
            console.log("✅ markAsRead completed successfully");
            // ✅ تحديث الـ Store
            markAsReadInStore(conversationId);
            // ✅ ✅ إجبار تحديث الكاش للعداد
            queryClient.invalidateQueries({ queryKey: ["unread-count", userId] });
            queryClient.invalidateQueries({ queryKey: ["conversations", userId] });
          },
          onError: (error) => {
            console.error("❌ markAsRead failed:", error);
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, userId]);

  // ====== الحصول على قائمة الرسائل المسطحة ======
  const messages = messagesData?.pages.flat() || [];

  // ====== دالة التمرير للرسالة (للبحث) ======
  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.style.transition = "background-color 0.5s, box-shadow 0.5s";
      element.style.backgroundColor = "rgba(59, 130, 246, 0.15)";
      element.style.boxShadow = "0 0 20px rgba(59, 130, 246, 0.2)";
      element.style.borderRadius = "8px";
      setTimeout(() => {
        element.style.backgroundColor = "transparent";
        element.style.boxShadow = "none";
      }, 3000);
    }
  };

  // ====== دوال المكالمة الصوتية ======
  const handleVoiceCall = () => {
    const roomName = `voice-${conversationId}-${Date.now()}`;
    setCallRoomName(roomName);
    setIsVoiceCall(true);
  };

  const handleEndVoiceCall = () => {
    setIsVoiceCall(false);
    setCallRoomName('');
  };

  // ====== دوال مكالمة الفيديو ======
  const handleVideoCall = () => {
    const roomName = `video-${conversationId}-${Date.now()}`;
    setCallRoomName(roomName);
    setIsVideoCall(true);
  };

  const handleEndVideoCall = () => {
    setIsVideoCall(false);
    setCallRoomName('');
  };

  // ====== إرسال رسالة ======
  const handleSendMessage = async (content: string, file?: File, location?: { latitude: number; longitude: number }) => {
    console.log("📤📤📤 CHATMESSAGES - handleSendMessage:", {
      content,
      file: file?.name,
      hasFile: !!file,
      hasLocation: !!location,
    });

    if (!content && !file && !location) return;

    try {
      const result = await sendMessage.mutateAsync({
        receiverId: otherUserId,
        content: location ? `📍 ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : content,
        file,
        type: location ? 'location' : 'text',
        reply_to_id: replyTo?.id,
        location: location || undefined,
      });

      console.log("✅ Message sent result:", result);

      setReplyTo(null);
      setReplyToMessage(null);

    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error(
        app.lang === "ar"
          ? "❌ فشل إرسال الرسالة"
          : "❌ Failed to send message"
      );
    }
  };

  // ====== الرد على رسالة ======
  const handleReply = (message: IMessageItem) => {
    setReplyTo(message);
    setReplyToMessage(message);
  };

  // ====== إلغاء الرد ======
  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyToMessage(null);
  };

  // ====== إعادة توجيه رسالة ======
  const handleForward = (message: IMessageItem) => {
    setForwardedMessage(message);
    toast.info(
      app.lang === "ar"
        ? "📤 ميزة إعادة التوجيه قيد التطوير"
        : "📤 Forward feature in development"
    );
  };

  // ====== حذف رسالة ======
  const handleDeleteMessage = (messageId: string) => {
    deleteMessageForEveryone.mutate({ messageId });
  };

  // ====== حذف المحادثة ======
  const handleDeleteConversation = () => {
    if (userId) {
      deleteConversation.mutate(
        { conversationId, userId },
        {
          onSuccess: () => {
            deleteFromStore(conversationId);
            navigate({ to: "/messages" });
          },
        }
      );
    }
  };

  // ====== ✅ كتم المحادثة - النسخة الفعلية ======
  const handleMute = async () => {
    if (!userId || !conversationId) return;

    try {
      const { data: conv, error: fetchError } = await supabase
        .from("conversations")
        .select("participant1_id, participant2_id, is_muted_participant1, is_muted_participant2")
        .eq("id", conversationId)
        .single();

      if (fetchError) throw fetchError;

      const isParticipant1 = conv.participant1_id === userId;
      const updateField = isParticipant1 
        ? "is_muted_participant1" 
        : "is_muted_participant2";
      const currentValue = isParticipant1 
        ? conv.is_muted_participant1 
        : conv.is_muted_participant2;
      const newValue = !currentValue;

      const { error } = await supabase
        .from("conversations")
        .update({ [updateField]: newValue })
        .eq("id", conversationId);

      if (error) throw error;

      toggleMuteConversation(conversationId);

      toast.success(
        newValue
          ? (app.lang === "ar" ? "🔇 تم كتم الإشعارات" : "🔇 Notifications muted")
          : (app.lang === "ar" ? "🔔 تم إلغاء كتم الإشعارات" : "🔔 Notifications unmuted")
      );

      setIsMuted(newValue);
      refetch();

    } catch (error) {
      console.error("Error muting conversation:", error);
      toast.error(
        app.lang === "ar"
          ? "❌ فشل تحديث إعدادات الإشعارات"
          : "❌ Failed to update notification settings"
      );
    }
  };

  // ====== ✅ تثبيت المحادثة - النسخة الفعلية ======
  const handlePin = async () => {
    if (!userId || !conversationId) return;

    try {
      const { data: conv, error: fetchError } = await supabase
        .from("conversations")
        .select("participant1_id, participant2_id, pinned_at_participant1, pinned_at_participant2")
        .eq("id", conversationId)
        .single();

      if (fetchError) throw fetchError;

      const isParticipant1 = conv.participant1_id === userId;
      const updateField = isParticipant1 
        ? "pinned_at_participant1" 
        : "pinned_at_participant2";
      const currentValue = isParticipant1 
        ? conv.pinned_at_participant1 
        : conv.pinned_at_participant2;
      const newValue = currentValue ? null : new Date().toISOString();

      const { error } = await supabase
        .from("conversations")
        .update({ [updateField]: newValue })
        .eq("id", conversationId);

      if (error) throw error;

      togglePinConversation(conversationId);

      toast.success(
        newValue
          ? (app.lang === "ar" ? "📌 تم تثبيت المحادثة" : "📌 Conversation pinned")
          : (app.lang === "ar" ? "📌 تم إلغاء تثبيت المحادثة" : "📌 Conversation unpinned")
      );

      setIsPinned(!!newValue);
      refetch();

    } catch (error) {
      console.error("Error pinning conversation:", error);
      toast.error(
        app.lang === "ar"
          ? "❌ فشل تثبيت المحادثة"
          : "❌ Failed to pin conversation"
      );
    }
  };

  // ====== ✅ أرشفة المحادثة - النسخة الفعلية ======
  const handleArchive = async () => {
    if (!userId || !conversationId) return;

    try {
      const { data: conv, error: fetchError } = await supabase
        .from("conversations")
        .select("participant1_id, participant2_id")
        .eq("id", conversationId)
        .single();

      if (fetchError) throw fetchError;

      const isParticipant1 = conv.participant1_id === userId;
      const updateField = isParticipant1 
        ? "is_archived_participant1" 
        : "is_archived_participant2";

      const { error } = await supabase
        .from("conversations")
        .update({ [updateField]: true })
        .eq("id", conversationId);

      if (error) throw error;

      deleteFromStore(conversationId);

      toast.success(
        app.lang === "ar"
          ? "📦 تم أرشفة المحادثة"
          : "📦 Conversation archived"
      );

      navigate({ to: "/messages" });

    } catch (error) {
      console.error("Error archiving conversation:", error);
      toast.error(
        app.lang === "ar"
          ? "❌ فشل أرشفة المحادثة"
          : "❌ Failed to archive conversation"
      );
    }
  };

  // ====== اختيار الرسائل ======
  const handleSelect = (messageId: string) => {
    setSelectedMessages(prev =>
      prev.includes(messageId)
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
  };

  // ====== إلغاء اختيار الكل ======
  const handleClearSelection = () => {
    setSelectedMessages([]);
    setIsSelecting(false);
  };

  // ====== معالج الكتابة ======
  const handleTyping = (isTyping: boolean) => {
    sendTyping(isTyping);
  };

  // ====== عرض التحميل ======
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center h-full",
          className
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#0084ff]" />
        <p className="text-sm text-muted-foreground mt-2">
          {app.lang === "ar" ? "جاري تحميل المحادثة..." : "Loading conversation..."}
        </p>
      </div>
    );
  }

  // ====== إذا لم توجد محادثة ======
  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="h-20 w-20 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b4a] flex items-center justify-center mb-4">
          <span className="text-4xl">💬</span>
        </div>
        <h3 className="text-xl font-semibold">
          {app.lang === "ar" ? "اختر محادثة" : "Select a conversation"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {app.lang === "ar"
            ? "اختر محادثة من القائمة لبدء المراسلة"
            : "Select a conversation from the list to start messaging"}
        </p>
      </div>
    );
  }

  // ====== ✅ التصميم الرئيسي - مثل الماسنجر ======
  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col h-full bg-[#f0f2f5] dark:bg-[#1a1a2e]",
        className
      )}
    >
      {/* ✅ مكون البحث */}
      {isSearchOpen && (
        <MessageSearch
          messages={messages}
          onSearchResult={scrollToMessage}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* ✅ الرأس */}
      <ChatHeader
        user={{
          id: otherUserId,
          full_name: otherUser?.full_name || null,
          avatar_url: otherUser?.avatar_url || null,
          store_name: otherUser?.store_name || null,
          store_logo_url: otherUser?.store_logo_url || null,
          is_online: userStatus?.is_online || false,
          last_seen_at: userStatus?.last_seen_at || null,
        }}
        conversationId={conversationId}
        isStore={isStore}
        isMuted={isMuted}
        isPinned={isPinned}
        isArchived={isArchived}
        onBack={onBack || (() => navigate({ to: "/messages" }))}
        onMute={handleMute}
        onPin={handlePin}
        onArchive={handleArchive}
        onDelete={handleDeleteConversation}
        onSearch={() => setIsSearchOpen(true)}
        onCall={handleVoiceCall}
        onVideoCall={handleVideoCall}
        onViewProfile={() => {
          navigate({ to: "/profile" });
        }}
        onViewStore={() => {
          if (isStore) {
            navigate({ to: "/store/$id", params: { id: otherUserId } });
          }
        }}
      />

      {/* ✅ قائمة الرسائل */}
      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          userId={userId}
          conversationId={conversationId}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={() => fetchNextPage()}
          onReply={handleReply}
          onForward={handleForward}
          onDelete={handleDeleteMessage}
          onPin={() => {}}
          onSelect={handleSelect}
          selectedMessages={selectedMessages}
          isSelecting={isSelecting}
          maxHeight="100%"
          showDateSeparators={true}
          showAvatar={true}
          className="h-full"
        />
      </div>

      {/* ✅ حقل الإدخال - خلفية بيضاء */}
      <div className="p-3 bg-white dark:bg-[#242538] border-t border-[#e4e6eb] dark:border-[#3a3b4a]">
        <ChatInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          onRecordVoice={(audioBlob) => {
            console.log("🎤 Audio recorded:", audioBlob);
            toast.success(
              app.lang === "ar"
                ? "✅ تم تسجيل الصوت"
                : "✅ Voice recorded"
            );
          }}
          onSendLocation={() => {
            console.log("📍 Location shared");
          }}
          isLoading={sendMessage.isPending}
          replyTo={replyTo ? {
            id: replyTo.id,
            content: replyTo.content,
            senderName: replyTo.sender_id === userId
              ? (app.lang === "ar" ? "أنت" : "You")
              : otherUser?.store_name || otherUser?.full_name || (app.lang === "ar" ? "مستخدم" : "User"),
          } : null}
          onCancelReply={handleCancelReply}
          maxLength={2000}
        />
      </div>

      {/* ✅ شريط اختيار الرسائل */}
      <AnimatePresence>
        {selectedMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center justify-between px-4 py-2 bg-[#0084ff]/10 dark:bg-[#0084ff]/20 border-t border-[#0084ff]/20"
          >
            <span className="text-sm font-medium text-[#0084ff]">
              {selectedMessages.length} {app.lang === "ar" ? "محددة" : "selected"}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="rounded-lg text-[#0084ff] hover:bg-[#0084ff]/10"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-lg"
                onClick={() => {
                  selectedMessages.forEach(id => {
                    deleteMessageForEveryone.mutate({ messageId: id });
                  });
                  handleClearSelection();
                }}
              >
                {app.lang === "ar" ? "حذف" : "Delete"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg"
                onClick={() => {
                  toast.info(
                    app.lang === "ar"
                      ? "📤 ميزة إعادة التوجيه الجماعي قيد التطوير"
                      : "📤 Bulk forward feature in development"
                  );
                }}
              >
                {app.lang === "ar" ? "توجيه" : "Forward"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ مكون المكالمة الصوتية */}
      {isVoiceCall && (
        <VoiceCall
          roomName={callRoomName}
          displayName={otherUser?.full_name || otherUser?.store_name || "User"}
          onEnd={handleEndVoiceCall}
        />
      )}

      {/* ✅ مكون مكالمة الفيديو */}
      {isVideoCall && (
        <VideoCall
          roomName={callRoomName}
          displayName={otherUser?.full_name || otherUser?.store_name || "User"}
          onEnd={handleEndVideoCall}
        />
      )}
    </div>
  );
}

// ====== نسخة مبسطة ======
interface SimpleChatMessagesProps {
  userId: string;
  conversationId: string;
  otherUserId: string;
  className?: string;
}

export function SimpleChatMessages({
  userId,
  conversationId,
  otherUserId,
  className,
}: SimpleChatMessagesProps) {
  const app = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: messagesData, isLoading } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const { data: userStatus } = useUserStatus(otherUserId);

  const [otherUser, setOtherUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", otherUserId)
        .single();
      if (data) setOtherUser(data);
    };
    fetchUser();
  }, [otherUserId]);

  // ✅ تحديد الرسائل كمقروءة (محسّن مع onSuccess)
  useEffect(() => {
    if (conversationId && userId) {
      console.log("📖 [Simple] Calling markAsRead for:", userId, "in:", conversationId);
      
      markAsRead.mutate(
        { conversationId, userId },
        {
          onSuccess: () => {
            console.log("✅ [Simple] markAsRead completed successfully");
            // ✅ ✅ إجبار تحديث الكاش للعداد
            queryClient.invalidateQueries({ queryKey: ["unread-count", userId] });
            queryClient.invalidateQueries({ queryKey: ["conversations", userId] });
          },
          onError: (error) => {
            console.error("❌ [Simple] markAsRead failed:", error);
          },
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, userId]);

  const messages = messagesData?.pages.flat() || [];

  const handleSend = (content: string) => {
    sendMessage.mutate({
      receiverId: otherUserId,
      content,
      type: 'text',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-[#0084ff]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] dark:bg-[#1a1a2e]">
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#242538] border-b border-[#e4e6eb] dark:border-[#3a3b4a]">
        <button
          onClick={() => navigate({ to: "/messages" })}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
        >
          ←
        </button>
        <div className="flex-1">
          <p className="font-semibold">
            {otherUser?.store_name || otherUser?.full_name || "User"}
          </p>
          <p className="text-xs text-muted-foreground">
            {userStatus?.is_online
              ? (app.lang === "ar" ? "🟢 متصل" : "🟢 Online")
              : (app.lang === "ar" ? "غير متصل" : "Offline")}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-[#f0f2f5] dark:bg-[#1a1a2e]">
        {messages.map((msg: any) => {
          const isMine = msg.sender_id === userId;
          return (
            <div
              key={msg.id}
              className={`flex ${isMine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                  isMine
                    ? "bg-[#0084ff] text-white rounded-br-sm shadow-sm"
                    : "bg-white dark:bg-[#3a3b4a] text-slate-900 dark:text-white rounded-bl-sm shadow-sm"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-[10px] opacity-70 mt-1">
                  {new Date(msg.created_at).toLocaleTimeString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-white dark:bg-[#242538] border-t border-[#e4e6eb] dark:border-[#3a3b4a]">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={app.lang === "ar" ? "اكتب رسالتك..." : "Type a message..."}
            className="flex-1 px-4 py-2 rounded-full border border-[#e4e6eb] dark:border-[#3a3b4a] focus:outline-none focus:ring-2 focus:ring-[#0084ff] bg-white dark:bg-[#242538]"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                handleSend(e.currentTarget.value.trim());
                e.currentTarget.value = "";
              }
            }}
          />
          <button
            className="px-4 py-2 bg-[#0084ff] text-white rounded-full hover:bg-[#0073e6] transition"
            onClick={() => {
              const input = document.querySelector("input");
              if (input?.value.trim()) {
                handleSend(input.value.trim());
                input.value = "";
              }
            }}
          >
            {app.lang === "ar" ? "إرسال" : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}