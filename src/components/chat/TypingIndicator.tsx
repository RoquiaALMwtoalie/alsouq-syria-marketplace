// src/components/chat/TypingIndicator.tsx

import { motion, AnimatePresence } from "framer-motion";
import { useApp } from "@/lib/i18n";
import { useConversationStore } from "@/lib/stores/conversationStore";
import { cn } from "@/lib/utils";

// ====== أنواع ======
interface TypingIndicatorProps {
  conversationId: string;
  userIds: string[];
  className?: string;
  showAvatar?: boolean;
  maxUsers?: number;
}

// ====== مكون النقاط المتحركة ======
const TypingDots = () => {
  return (
    <div className="flex items-center gap-1 px-2 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-blue-500 dark:bg-blue-400"
          initial={{ scale: 0.8, opacity: 0.3 }}
          animate={{
            scale: [0.8, 1.2, 0.8],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ====== المكون الرئيسي ======
export function TypingIndicator({
  conversationId,
  userIds,
  className,
  showAvatar = true,
  maxUsers = 2,
}: TypingIndicatorProps) {
  const app = useApp();
  
  // ✅ استخدام selector مباشر بدلاً من useTypingUsers
  const typingUsers = useConversationStore(
    (state) => state.typingUsers
  );
  
  // تصفية المستخدمين الذين يكتبون في هذه المحادثة (استبعاد المستخدم الحالي)
  const typingUsersInConversation = typingUsers.filter(
    (t) => t.conversationId === conversationId && t.userId !== app.user?.id
  );

  // إذا لا يوجد أحد يكتب، لا نعرض شيئاً
  if (typingUsersInConversation.length === 0) {
    return null;
  }

  // تحديد عدد المستخدمين الذين نعرضهم
  const displayUsers = typingUsersInConversation.slice(0, maxUsers);
  const remainingCount = typingUsersInConversation.length - maxUsers;

  // بناء نص المؤشر
  let typingText = "";
  
  if (app.lang === "ar") {
    if (typingUsersInConversation.length === 1) {
      typingText = "يكتب...";
    } else if (typingUsersInConversation.length === 2) {
      typingText = "يكتبان...";
    } else {
      typingText = `${typingUsersInConversation.length} أشخاص يكتبون...`;
    }
  } else {
    if (typingUsersInConversation.length === 1) {
      typingText = "typing...";
    } else if (typingUsersInConversation.length === 2) {
      typingText = "are typing...";
    } else {
      typingText = `${typingUsersInConversation.length} people are typing...`;
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex items-center gap-3 px-4 py-2",
          "bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30",
          "border border-blue-200/30 dark:border-blue-800/30",
          "rounded-2xl shadow-sm",
          className
        )}
      >
        {/* النص والنقاط المتحركة */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {typingText}
          </span>
          <TypingDots />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ====== نسخة بسيطة (بدون صور) ======
export function SimpleTypingIndicator({
  conversationId,
  className,
}: {
  conversationId: string;
  className?: string;
}) {
  const app = useApp();
  const typingUsers = useConversationStore(
    (state) => state.typingUsers
  );
  
  const typingUsersInConversation = typingUsers.filter(
    (t) => t.conversationId === conversationId && t.userId !== app.user?.id
  );

  if (typingUsersInConversation.length === 0) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400",
          className
        )}
      >
        <span>
          {app.lang === "ar" ? "يكتب" : "typing"}
        </span>
        <TypingDots />
      </motion.div>
    </AnimatePresence>
  );
}