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
  useSendTypingIndicator,
  useUserStatus, // ✅ استخدم useUserStatus
} from "@/lib/hooks/useConversation";
// ❌ حذف الاستيراد الغير ضروري
// import { useRealtimeUserStatus } from "@/lib/hooks/useRealtimeConversations";
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
  hideHeader?: boolean;
}

// ====== المكون الرئيسي ======
export function ChatMessages({
  userId,
  conversationId,
  otherUserId,
  className,
  onBack,
  hideHeader = false,
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
  
  // ✅ استخدم useUserStatus بدلاً من useRealtimeUserStatus
  const { data: userStatus } = useUserStatus(otherUserId);
  const isOnline = userStatus?.is_online || false;

  // ✅ سجل القيم للتحقق
  useEffect(() => {
    console.log("🔍 User Status Debug:");
    console.log("  - isOnline:", isOnline);
    console.log("  - userStatus:", userStatus);
    console.log("  - otherUserId:", otherUserId);
  }, [isOnline, userStatus, otherUserId]);

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

  // ====== ✅ تحديد الرسائل كمقروءة ======
  useEffect(() => {
    if (conversationId && userId) {
      markAsRead.mutate(
        { conversationId, userId },
        {
          onSuccess: () => {
            markAsReadInStore(conversationId);
            queryClient.invalidateQueries({ queryKey: ["unread-count", userId] });
            queryClient.invalidateQueries({ queryKey: ["conversations", userId] });
          },
        }
      );
    }
  }, [conversationId, userId]);

  const messages = messagesData?.pages.flat() || [];

  const scrollToMessage = (messageId: string) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
      element.style.transition = "background-color 0.5s, box-shadow 0.5s";
      element.style.backgroundColor = "rgba(42, 101, 95, 0.15)";
      element.style.boxShadow = "0 0 20px rgba(42, 101, 95, 0.2)";
      element.style.borderRadius = "8px";
      setTimeout(() => {
        element.style.backgroundColor = "transparent";
        element.style.boxShadow = "none";
      }, 3000);
    }
  };

  const handleVoiceCall = () => {
    const roomName = `voice-${conversationId}-${Date.now()}`;
    setCallRoomName(roomName);
    setIsVoiceCall(true);
  };

  const handleEndVoiceCall = () => {
    setIsVoiceCall(false);
    setCallRoomName('');
  };

  const handleVideoCall = () => {
    const roomName = `video-${conversationId}-${Date.now()}`;
    setCallRoomName(roomName);
    setIsVideoCall(true);
  };

  const handleEndVideoCall = () => {
    setIsVideoCall(false);
    setCallRoomName('');
  };

  const handleSendMessage = async (content: string, file?: File, location?: { latitude: number; longitude: number }) => {
    if (!content && !file && !location) return;

    try {
      await sendMessage.mutateAsync({
        receiverId: otherUserId,
        content: location ? `📍 ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : content,
        file,
        type: location ? 'location' : 'text',
        reply_to_id: replyTo?.id,
        location: location || undefined,
      });

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

  const handleReply = (message: IMessageItem) => {
    setReplyTo(message);
    setReplyToMessage(message);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyToMessage(null);
  };

  const handleForward = (message: IMessageItem) => {
    setForwardedMessage(message);
    toast.info(
      app.lang === "ar"
        ? "📤 ميزة إعادة التوجيه قيد التطوير"
        : "📤 Forward feature in development"
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessageForEveryone.mutate({ messageId });
  };

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
      const updateField = isParticipant1 ? "is_muted_participant1" : "is_muted_participant2";
      const currentValue = isParticipant1 ? conv.is_muted_participant1 : conv.is_muted_participant2;
      const newValue = !currentValue;

      await supabase.from("conversations").update({ [updateField]: newValue }).eq("id", conversationId);
      toggleMuteConversation(conversationId);
      toast.success(newValue ? (app.lang === "ar" ? "🔇 تم كتم الإشعارات" : "🔇 Muted") : (app.lang === "ar" ? "🔔 تم إلغاء الكتم" : "🔔 Unmuted"));
      setIsMuted(newValue);
      refetch();
    } catch (error) {
      toast.error(app.lang === "ar" ? "❌ فشل تحديث الإشعارات" : "❌ Failed");
    }
  };

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
      const updateField = isParticipant1 ? "pinned_at_participant1" : "pinned_at_participant2";
      const currentValue = isParticipant1 ? conv.pinned_at_participant1 : conv.pinned_at_participant2;
      const newValue = currentValue ? null : new Date().toISOString();

      await supabase.from("conversations").update({ [updateField]: newValue }).eq("id", conversationId);
      togglePinConversation(conversationId);
      toast.success(newValue ? (app.lang === "ar" ? "📌 تم التثبيت" : "📌 Pinned") : (app.lang === "ar" ? "📌 تم إلغاء التثبيت" : "📌 Unpinned"));
      setIsPinned(!!newValue);
      refetch();
    } catch (error) {
      toast.error(app.lang === "ar" ? "❌ فشل التثبيت" : "❌ Failed");
    }
  };

  const handleArchive = async () => {
    if (!userId || !conversationId) return;
    try {
      const { data: conv } = await supabase.from("conversations").select("participant1_id").eq("id", conversationId).single();
      const updateField = conv?.participant1_id === userId ? "is_archived_participant1" : "is_archived_participant2";
      await supabase.from("conversations").update({ [updateField]: true }).eq("id", conversationId);
      deleteFromStore(conversationId);
      toast.success(app.lang === "ar" ? "📦 تمت الأرشفة" : "📦 Archived");
      navigate({ to: "/messages" });
    } catch (error) {
      toast.error(app.lang === "ar" ? "❌ فشل الأرشفة" : "❌ Failed");
    }
  };

  const handleSelect = (messageId: string) => {
    setSelectedMessages(prev => prev.includes(messageId) ? prev.filter(id => id !== messageId) : [...prev, messageId]);
  };

  const handleClearSelection = () => {
    setSelectedMessages([]);
    setIsSelecting(false);
  };

  const handleTyping = (isTyping: boolean) => {
    sendTyping(isTyping);
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-950", className)}>
        <Loader2 className="h-10 w-10 animate-spin text-[#2a655f]" />
        <p className="text-sm font-bold text-muted-foreground mt-3">
          {app.lang === "ar" ? "جاري تحميل محادثتك الآمنة..." : "Loading secure chat..."}
        </p>
      </div>
    );
  }

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 dark:bg-slate-950">
        <div className="h-20 w-20 rounded-3xl bg-[#2a655f]/10 border border-[#2a655f]/20 flex items-center justify-center mb-4 shadow-inner">
          <span className="text-4xl">💬</span>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {app.lang === "ar" ? "اختر محادثة لبدء الدردشة" : "Select a conversation"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {app.lang === "ar" ? "تواصل بسلاسة وأمان مع المتاجر والبائعين" : "Connect smoothly and securely"}
        </p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col h-full bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-[#112926]/30 dark:to-slate-950 relative overflow-hidden",
        className
      )}
    >
      {/* مكون البحث داخل المحادثة */}
      {isSearchOpen && (
        <MessageSearch
          messages={messages}
          onSearchResult={scrollToMessage}
          onClose={() => setIsSearchOpen(false)}
        />
      )}

      {/* ✅ الهيدر - يظهر فقط إذا لم يكن مخفياً */}
      {!hideHeader && (
        <>
          {console.log("📤 Passing to ChatHeader:")}
          {console.log("  - isOnline:", isOnline)}
          {console.log("  - userStatus:", userStatus)}
          {console.log("  - otherUserId:", otherUserId)}
          
          <ChatHeader
            user={{
              id: otherUserId,
              full_name: otherUser?.full_name || null,
              avatar_url: otherUser?.avatar_url || null,
              store_name: otherUser?.store_name || null,
              store_logo_url: otherUser?.store_logo_url || null,
              is_online: isOnline,
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
            onViewProfile={() => navigate({ to: "/profile" })}
            onViewStore={() => {
              if (isStore) {
                navigate({ to: "/store/$id", params: { id: otherUserId } });
              }
            }}
          />
        </>
      )}

      {/* قائمة الرسائل */}
      <div className="flex-1 overflow-hidden p-2 sm:p-4">
        <div className="h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-[#2a655f]/20 bg-white/95 dark:bg-[#1a2b28]/95 backdrop-blur-xl">
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
      </div>

      {/* حقل الإدخال */}
      <div className="p-3 bg-white/90 dark:bg-[#173d38]/90 backdrop-blur-md border-t border-[#2a655f]/20 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <ChatInput
            onSendMessage={handleSendMessage}
            onTyping={handleTyping}
            onRecordVoice={(audioBlob) => {
              toast.success(app.lang === "ar" ? "✅ تم تسجيل الصوت بنجاح" : "✅ Voice recorded");
            }}
            onSendLocation={() => {
              toast.info(app.lang === "ar" ? "📍 تم إرسال الموقع" : "📍 Location shared");
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
      </div>

      {/* شريط تحديد الرسائل */}
      <AnimatePresence>
        {selectedMessages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex items-center justify-between px-6 py-3 bg-[#2a655f]/90 text-white backdrop-blur-md border-t border-emerald-400/30 shadow-2xl"
          >
            <span className="text-sm font-bold">
              {selectedMessages.length} {app.lang === "ar" ? "عناصر محددة" : "selected"}
            </span>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearSelection}
                className="rounded-xl text-white hover:bg-white/10 font-semibold"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="rounded-xl font-bold shadow-md"
                onClick={() => {
                  selectedMessages.forEach(id => {
                    deleteMessageForEveryone.mutate({ messageId: id });
                  });
                  handleClearSelection();
                }}
              >
                {app.lang === "ar" ? "حذف للجميع" : "Delete"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* مكونات مكالمات الصوت والفيديو */}
      {isVoiceCall && (
        <VoiceCall
          roomName={callRoomName}
          displayName={otherUser?.full_name || otherUser?.store_name || "User"}
          onEnd={handleEndVoiceCall}
        />
      )}

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