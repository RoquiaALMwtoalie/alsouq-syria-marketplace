// src/components/chat/MessageList.tsx

import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";
import { MessageItem, IMessageItem } from "@/components/chat/MessageItem";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader2, MessagesSquare } from "lucide-react";
import { useConversationStore } from "@/lib/stores/conversationStore";

// ====== أنواع ======
interface MessageListProps {
  messages: IMessageItem[];
  userId: string;
  conversationId: string;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  onReply?: (message: IMessageItem) => void;
  onForward?: (message: IMessageItem) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onSelect?: (messageId: string) => void;
  selectedMessages?: string[];
  isSelecting?: boolean;
  className?: string;
  showDateSeparators?: boolean;
  showAvatar?: boolean;
  maxHeight?: string;
}

// ====== مكون فاصل التاريخ ======
function DateSeparator({ date }: { date: string }) {
  const app = useApp();
  
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (d.toDateString() === today.toDateString()) {
      return app.lang === "ar" ? "اليوم" : "Today";
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return app.lang === "ar" ? "أمس" : "Yesterday";
    }
    return d.toLocaleDateString(app.lang === "ar" ? "ar-SA" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="flex items-center justify-center my-4">
      <div className="px-4 py-1.5 bg-[#2a655f]/10 dark:bg-[#2a655f]/20 rounded-full border border-[#2a655f]/10">
        <span className="text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]">
          {formatDate(date)}
        </span>
      </div>
    </div>
  );
}

// ====== مكون رسالة "لا توجد رسائل" ======
function EmptyState({ conversationId }: { conversationId: string }) {
  const app = useApp();
  const [name, setName] = useState("");

  useEffect(() => {
    const { conversations } = useConversationStore.getState();
    const conv = conversations.find(c => c.id === conversationId);
    if (conv) {
      const otherUser = conv.participant1_id === app.user?.id 
        ? conv.participant2 
        : conv.participant1;
      setName(otherUser?.store_name || otherUser?.full_name || "");
    }
  }, [conversationId, app.user?.id]);

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-3xl">
      <div className="h-20 w-20 rounded-full bg-[#2a655f]/10 dark:bg-[#2a655f]/20 flex items-center justify-center mb-4 border-2 border-[#2a655f]/20">
        <MessagesSquare className="h-10 w-10 text-[#2a655f] dark:text-[#3a8a82]" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
        {app.lang === "ar" ? "📩 لا توجد رسائل" : "📩 No messages"}
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        {app.lang === "ar"
          ? `ابدأ المحادثة مع ${name || "هذا المستخدم"}`
          : `Start a conversation with ${name || "this user"}`}
      </p>
      <p className="text-xs text-muted-foreground/70 mt-1">
        {app.lang === "ar"
          ? "اكتب رسالتك الأولى الآن"
          : "Send your first message now"}
      </p>
    </div>
  );
}

// ====== مكون زر التمرير للأسفل ======
function ScrollToBottomButton({ onClick, unreadCount }: { onClick: () => void; unreadCount: number }) {
  const app = useApp();

  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      onClick={onClick}
      className={cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2",
        "flex items-center gap-2 px-4 py-2",
        "bg-[#2a655f] hover:bg-[#1a4f4a]",
        "text-white text-sm font-medium",
        "rounded-full shadow-lg shadow-[#2a655f]/30",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95 border border-white/10"
      )}
    >
      <ChevronDown className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="bg-white text-[#2a655f] text-xs font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
      <span className="hidden sm:inline">
        {app.lang === "ar" ? "انتقل للأسفل" : "Scroll down"}
      </span>
    </motion.button>
  );
}

// ====== المكون الرئيسي ======
export function MessageList({
  messages,
  userId,
  conversationId,
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  onReply,
  onForward,
  onDelete,
  onPin,
  onSelect,
  selectedMessages = [],
  isSelecting = false,
  className,
  showDateSeparators = true,
  showAvatar = true,
  maxHeight = "500px",
}: MessageListProps) {
  const app = useApp();
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // ====== حساب عدد الرسائل غير المقروءة ======
  useEffect(() => {
    const count = messages.filter((msg) => {
      const isUnread = !msg.read_at && msg.receiver_id === userId;
      return isUnread;
    }).length;
    setUnreadCount(count);
  }, [messages, userId]);

  // ====== التمرير إلى الأسفل ======
  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  // ====== التحقق من موضع التمرير ======
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom && messages.length > 0);
  }, [messages.length]);

  // ====== التمرير التلقائي عند رسائل جديدة ======
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages, isAtBottom, scrollToBottom]);

  // ====== إعادة تعيين unreadCount عند التمرير للأسفل ======
  useEffect(() => {
    if (isAtBottom && unreadCount > 0) {
      setUnreadCount(0);
    }
  }, [isAtBottom, unreadCount]);

  // ====== تحميل المزيد عند التمرير للأعلى ======
  const handleScrollTop = useCallback(() => {
    const container = containerRef.current;
    if (!container || !onLoadMore || !hasNextPage || isFetchingNextPage) return;

    if (container.scrollTop < 100) {
      onLoadMore();
    }
  }, [onLoadMore, hasNextPage, isFetchingNextPage]);

  // ====== تجميع الرسائل حسب التاريخ ======
  const groupedMessages = useMemo(() => {
    if (!showDateSeparators) {
      return messages.map((msg) => ({ type: 'message' as const, message: msg }));
    }

    const groups: { type: 'message' | 'date'; message?: IMessageItem; date?: string }[] = [];
    let lastDate = "";

    messages.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toDateString();
      if (msgDate !== lastDate) {
        groups.push({ type: 'date', date: msg.created_at });
        lastDate = msgDate;
      }
      groups.push({ type: 'message', message: msg });
    });

    return groups;
  }, [messages, showDateSeparators]);

  // ====== تجميع الرسائل في مجموعات متتالية ======
  const messageGroups = useMemo(() => {
    const groups: IMessageItem[][] = [];
    let currentGroup: IMessageItem[] = [];

    messages.forEach((msg, index) => {
      const prevMsg = messages[index - 1];
      
      if (prevMsg && (
        prevMsg.sender_id !== msg.sender_id ||
        new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 5 * 60 * 1000
      )) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }
      
      currentGroup.push(msg);
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages]);

  // ====== عرض حالة التحميل ======
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          className
        )}
        style={{ height: maxHeight }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#2a655f]" />
        <p className="text-sm text-muted-foreground mt-2">
          {app.lang === "ar" ? "جاري تحميل الرسائل..." : "Loading messages..."}
        </p>
      </div>
    );
  }

  // ====== عرض حالة عدم وجود رسائل ======
  if (messages.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          className
        )}
        style={{ height: maxHeight }}
      >
        <EmptyState conversationId={conversationId} />
      </div>
    );
  }

  // ====== ✅ التصميم الرئيسي ======
  return (
    <div className="relative" style={{ height: maxHeight }}>
      {/* مؤشر تحميل المزيد */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#2a655f]" />
        </div>
      )}

      {/* قائمة الرسائل */}
      <div
        ref={containerRef}
        onScroll={(e) => {
          handleScroll();
          handleScrollTop();
        }}
        className={cn(
          "overflow-y-auto overflow-x-hidden",
          "scroll-smooth",
          "px-2 py-4",
          "bg-gradient-to-b from-[#f8fafc] to-[#f0f2f5] dark:from-[#0d1f1d] dark:to-[#0a1513]",
          className
        )}
        style={{ height: maxHeight }}
      >
        {/* ✅ خطوط زخرفية خفيفة */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #2a655f 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, #2a655f 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }} />
        </div>

        <div className="flex flex-col gap-0.5 relative z-10">
          {groupedMessages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <DateSeparator key={`date-${index}`} date={item.date!} />
              );
            }

            const msg = item.message!;
            const isMine = msg.sender_id === userId;
            
            const groupIndex = messageGroups.findIndex(g => g.includes(msg));
            const group = groupIndex !== -1 ? messageGroups[groupIndex] : [msg];
            const msgIndex = group.indexOf(msg);
            
            const isFirstInGroup = msgIndex === 0;
            const isLastInGroup = msgIndex === group.length - 1;

            return (
              <MessageItem
                key={msg.id}
                message={msg}
                isMine={isMine}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                showAvatar={showAvatar && isFirstInGroup && !isMine}
                onReply={onReply}
                onForward={onForward}
                onDelete={onDelete}
                onPin={onPin}
                onSelect={onSelect}
                isSelected={selectedMessages.includes(msg.id)}
                isSelecting={isSelecting}
              />
            );
          })}
          
          {/* ✅ مؤشر الكتابة */}
          <div className="mt-2">
            <TypingIndicator
              conversationId={conversationId}
              userIds={[userId]}
            />
          </div>
          
          {/* نقطة نهاية الرسائل */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* زر التمرير للأسفل */}
      <AnimatePresence>
        {showScrollButton && (
          <ScrollToBottomButton
            onClick={() => scrollToBottom("smooth")}
            unreadCount={unreadCount}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ====== نسخة مع مؤشر الكتابة المدمج ======
interface MessageListWithTypingProps extends MessageListProps {
  typingUsers?: string[];
}

export function MessageListWithTyping({
  messages,
  userId,
  conversationId,
  typingUsers = [],
  isLoading = false,
  isFetchingNextPage = false,
  hasNextPage = false,
  onLoadMore,
  onReply,
  onForward,
  onDelete,
  onPin,
  onSelect,
  selectedMessages = [],
  isSelecting = false,
  className,
  showDateSeparators = true,
  showAvatar = true,
  maxHeight = "500px",
}: MessageListWithTypingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // حساب عدد الرسائل غير المقروءة
  useEffect(() => {
    const count = messages.filter((msg) => {
      const isUnread = !msg.read_at && msg.receiver_id === userId;
      return isUnread;
    }).length;
    setUnreadCount(count);
  }, [messages, userId]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);

  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isBottom = scrollHeight - scrollTop - clientHeight < 50;
    
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom && messages.length > 0);
  }, [messages.length]);

  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages, isAtBottom, scrollToBottom]);

  const handleScrollTop = useCallback(() => {
    const container = containerRef.current;
    if (!container || !onLoadMore || !hasNextPage || isFetchingNextPage) return;

    if (container.scrollTop < 100) {
      onLoadMore();
    }
  }, [onLoadMore, hasNextPage, isFetchingNextPage]);

  // تجميع الرسائل حسب التاريخ
  const groupedMessages = useMemo(() => {
    if (!showDateSeparators) {
      return messages.map((msg) => ({ type: 'message' as const, message: msg }));
    }

    const groups: { type: 'message' | 'date'; message?: IMessageItem; date?: string }[] = [];
    let lastDate = "";

    messages.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toDateString();
      if (msgDate !== lastDate) {
        groups.push({ type: 'date', date: msg.created_at });
        lastDate = msgDate;
      }
      groups.push({ type: 'message', message: msg });
    });

    return groups;
  }, [messages, showDateSeparators]);

  // تجميع الرسائل في مجموعات متتالية
  const messageGroups = useMemo(() => {
    const groups: IMessageItem[][] = [];
    let currentGroup: IMessageItem[] = [];

    messages.forEach((msg, index) => {
      const prevMsg = messages[index - 1];
      
      if (prevMsg && (
        prevMsg.sender_id !== msg.sender_id ||
        new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 5 * 60 * 1000
      )) {
        if (currentGroup.length > 0) {
          groups.push(currentGroup);
          currentGroup = [];
        }
      }
      
      currentGroup.push(msg);
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages]);

  // عرض حالة التحميل
  if (isLoading) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          className
        )}
        style={{ height: maxHeight }}
      >
        <Loader2 className="h-8 w-8 animate-spin text-[#2a655f]" />
        <p className="text-sm text-muted-foreground mt-2">
          {app.lang === "ar" ? "جاري تحميل الرسائل..." : "Loading messages..."}
        </p>
      </div>
    );
  }

  // عرض حالة عدم وجود رسائل
  if (messages.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center",
          className
        )}
        style={{ height: maxHeight }}
      >
        <EmptyState conversationId={conversationId} />
      </div>
    );
  }

  // معرفة ما إذا كان أي شخص يكتب
  const isTyping = typingUsers.length > 0 && typingUsers.some(id => id !== userId);

  return (
    <div className="relative" style={{ height: maxHeight }}>
      {/* مؤشر تحميل المزيد */}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-[#2a655f]" />
        </div>
      )}

      {/* قائمة الرسائل */}
      <div
        ref={containerRef}
        onScroll={(e) => {
          handleScroll();
          handleScrollTop();
        }}
        className={cn(
          "overflow-y-auto overflow-x-hidden",
          "scroll-smooth",
          "px-2 py-4",
          "bg-gradient-to-b from-[#f8fafc] to-[#f0f2f5] dark:from-[#0d1f1d] dark:to-[#0a1513]",
          className
        )}
        style={{ height: maxHeight }}
      >
        {/* ✅ خطوط زخرفية */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #2a655f 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, #2a655f 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            backgroundPosition: '0 0, 30px 30px'
          }} />
        </div>

        <div className="flex flex-col gap-0.5 relative z-10">
          {groupedMessages.map((item, index) => {
            if (item.type === 'date') {
              return (
                <DateSeparator key={`date-${index}`} date={item.date!} />
              );
            }

            const msg = item.message!;
            const isMine = msg.sender_id === userId;
            
            const groupIndex = messageGroups.findIndex(g => g.includes(msg));
            const group = groupIndex !== -1 ? messageGroups[groupIndex] : [msg];
            const msgIndex = group.indexOf(msg);
            
            const isFirstInGroup = msgIndex === 0;
            const isLastInGroup = msgIndex === group.length - 1;

            return (
              <MessageItem
                key={msg.id}
                message={msg}
                isMine={isMine}
                isFirstInGroup={isFirstInGroup}
                isLastInGroup={isLastInGroup}
                showAvatar={showAvatar && isFirstInGroup && !isMine}
                onReply={onReply}
                onForward={onForward}
                onDelete={onDelete}
                onPin={onPin}
                onSelect={onSelect}
                isSelected={selectedMessages.includes(msg.id)}
                isSelecting={isSelecting}
              />
            );
          })}
          
          {/* ✅ مؤشر الكتابة */}
          {isTyping && (
            <div className="mt-2">
              <TypingIndicator
                conversationId={conversationId}
                userIds={typingUsers}
              />
            </div>
          )}
          
          {/* نقطة نهاية الرسائل */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* زر التمرير للأسفل */}
      <AnimatePresence>
        {showScrollButton && (
          <ScrollToBottomButton
            onClick={() => scrollToBottom("smooth")}
            unreadCount={unreadCount}
          />
        )}
      </AnimatePresence>
    </div>
  );
}