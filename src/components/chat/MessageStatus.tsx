// src/components/chat/MessageStatus.tsx

import { motion, AnimatePresence } from "framer-motion";
import { Check, CheckCheck, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";

// ====== أنواع ======
export type MessageStatusType = 
  | "sending"      // جاري الإرسال
  | "sent"         // تم الإرسال (علامة واحدة)
  | "delivered"    // تم الوصول (علامتان)
  | "read"         // مقروءة (علامتان زرقاء)
  | "failed"       // فشل الإرسال
  | "pending";     // قيد الانتظار

interface MessageStatusProps {
  status: MessageStatusType;
  readAt?: string | null;
  createdAt?: string;
  isMine: boolean;
  className?: string;
  showTime?: boolean;
  size?: "sm" | "md" | "lg";
}

// ====== أيقونات الحالة ======
const StatusIcons = {
  sending: ({ className }: { className?: string }) => (
    <Loader2 className={cn("animate-spin text-gray-400", className)} />
  ),
  sent: ({ className }: { className?: string }) => (
    <Check className={cn("text-gray-400", className)} />
  ),
  delivered: ({ className }: { className?: string }) => (
    <CheckCheck className={cn("text-gray-400", className)} />
  ),
  read: ({ className }: { className?: string }) => (
    <CheckCheck className={cn("text-blue-500", className)} />
  ),
  failed: ({ className }: { className?: string }) => (
    <AlertCircle className={cn("text-red-500", className)} />
  ),
  pending: ({ className }: { className?: string }) => (
    <Clock className={cn("text-yellow-500", className)} />
  ),
};

// ====== تسميات الحالة ======
const StatusLabels = {
  ar: {
    sending: "جاري الإرسال",
    sent: "تم الإرسال",
    delivered: "تم الوصول",
    read: "مقروءة",
    failed: "فشل الإرسال",
    pending: "قيد الانتظار",
  },
  en: {
    sending: "Sending",
    sent: "Sent",
    delivered: "Delivered",
    read: "Read",
    failed: "Failed",
    pending: "Pending",
  },
};

// ====== المكون الرئيسي ======
export function MessageStatus({
  status,
  readAt,
  createdAt,
  isMine,
  className,
  showTime = true,
  size = "sm",
}: MessageStatusProps) {
  const app = useApp();
  const lang = app.lang || "ar";

  // إذا كانت الرسالة ليست لي، لا نعرض الحالة
  if (!isMine) {
    return null;
  }

  // تحديد حجم الأيقونة
  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  // الحصول على الأيقونة المناسبة
  const StatusIcon = StatusIcons[status] || StatusIcons.sent;

  // الحصول على التسمية
  const label = StatusLabels[lang][status] || status;

  // تنسيق الوقت
  const formatTime = (date?: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // تحديد لون النص
  const textColor = {
    sending: "text-gray-400",
    sent: "text-gray-400",
    delivered: "text-gray-400",
    read: "text-blue-500",
    failed: "text-red-500",
    pending: "text-yellow-500",
  }[status];

  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        textColor,
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex items-center"
        >
          <StatusIcon className={iconSize} />
        </motion.div>
      </AnimatePresence>

      {showTime && (
        <span className="text-[10px] font-medium opacity-70">
          {readAt ? formatTime(readAt) : createdAt ? formatTime(createdAt) : ""}
        </span>
      )}

      {/* Tooltip عند التحويم */}
      <span className="sr-only">{label}</span>
    </div>
  );
}

// ====== نسخة مع Tooltip ======
interface MessageStatusWithTooltipProps extends MessageStatusProps {
  tooltipPosition?: "top" | "bottom" | "left" | "right";
}

export function MessageStatusWithTooltip({
  status,
  readAt,
  createdAt,
  isMine,
  className,
  showTime = true,
  size = "sm",
  tooltipPosition = "top",
}: MessageStatusWithTooltipProps) {
  const app = useApp();
  const lang = app.lang || "ar";

  if (!isMine) {
    return null;
  }

  const label = StatusLabels[lang][status] || status;
  const time = readAt ? new Date(readAt) : createdAt ? new Date(createdAt) : null;
  const timeStr = time ? time.toLocaleString(lang === "ar" ? "ar-SA" : "en-US") : "";

  return (
    <div className="relative group inline-flex items-center">
      <MessageStatus
        status={status}
        readAt={readAt}
        createdAt={createdAt}
        isMine={isMine}
        className={className}
        showTime={showTime}
        size={size}
      />
      
      {/* Tooltip */}
      <div
        className={cn(
          "absolute z-50 hidden group-hover:block",
          "px-2 py-1 rounded-lg",
          "bg-gray-900 dark:bg-gray-800",
          "text-white text-xs font-medium",
          "whitespace-nowrap",
          "shadow-lg",
          {
            "bottom-full mb-2 left-1/2 -translate-x-1/2": tooltipPosition === "top",
            "top-full mt-2 left-1/2 -translate-x-1/2": tooltipPosition === "bottom",
            "right-full mr-2 top-1/2 -translate-y-1/2": tooltipPosition === "left",
            "left-full ml-2 top-1/2 -translate-y-1/2": tooltipPosition === "right",
          }
        )}
      >
        <div className="flex flex-col items-center gap-0.5">
          <span>{label}</span>
          {timeStr && (
            <span className="text-[10px] opacity-70">{timeStr}</span>
          )}
        </div>
        {/* سهم صغير */}
        <div
          className={cn(
            "absolute w-2 h-2 bg-gray-900 dark:bg-gray-800 rotate-45",
            {
              "bottom-[-4px] left-1/2 -translate-x-1/2": tooltipPosition === "top",
              "top-[-4px] left-1/2 -translate-x-1/2": tooltipPosition === "bottom",
              "right-[-4px] top-1/2 -translate-y-1/2": tooltipPosition === "left",
              "left-[-4px] top-1/2 -translate-y-1/2": tooltipPosition === "right",
            }
          )}
        />
      </div>
    </div>
  );
}

// ====== مكون عرض الحالة فقط (بدون وقت) ======
export function SimpleMessageStatus({
  status,
  isMine,
  className,
  size = "sm",
}: {
  status: MessageStatusType;
  isMine: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  if (!isMine) {
    return null;
  }

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  const StatusIcon = StatusIcons[status] || StatusIcons.sent;

  const color = {
    sending: "text-gray-400",
    sent: "text-gray-400",
    delivered: "text-gray-400",
    read: "text-blue-500",
    failed: "text-red-500",
    pending: "text-yellow-500",
  }[status];

  return (
    <motion.div
      key={status}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn("flex items-center", color, className)}
    >
      <StatusIcon className={iconSize} />
    </motion.div>
  );
}

// ====== مكون حالة جماعية (للمجموعات) ======
interface GroupMessageStatusProps {
  status: MessageStatusType;
  readBy: number; // عدد الأشخاص الذين قرأوا
  total: number; // إجمالي الأشخاص
  isMine: boolean;
  className?: string;
}

export function GroupMessageStatus({
  status,
  readBy,
  total,
  isMine,
  className,
}: GroupMessageStatusProps) {
  const app = useApp();
  const lang = app.lang || "ar";

  if (!isMine) {
    return null;
  }

  const iconSize = "h-3 w-3";
  const StatusIcon = StatusIcons[status] || StatusIcons.sent;

  const textColor = {
    sending: "text-gray-400",
    sent: "text-gray-400",
    delivered: "text-gray-400",
    read: "text-blue-500",
    failed: "text-red-500",
    pending: "text-yellow-500",
  }[status];

  // بناء النص
  let label = "";
  if (lang === "ar") {
    if (readBy === 0) label = "لم يقرأ أحد";
    else if (readBy === 1) label = "قرأها شخص واحد";
    else if (readBy === total) label = `قرأها الكل (${total})`;
    else label = `قرأها ${readBy} من ${total}`;
  } else {
    if (readBy === 0) label = "No one read";
    else if (readBy === 1) label = "1 person read";
    else if (readBy === total) label = `All read (${total})`;
    else label = `${readBy} of ${total} read`;
  }

  return (
    <div className={cn("flex items-center gap-1.5", textColor, className)}>
      <StatusIcon className={iconSize} />
      <span className="text-[10px] font-medium opacity-70">{label}</span>
    </div>
  );
}

// ====== مكون حالة مع عرض التاريخ ======
export function MessageStatusWithDate({
  status,
  readAt,
  createdAt,
  isMine,
  className,
  size = "sm",
}: MessageStatusProps) {
  const app = useApp();
  const lang = app.lang || "ar";

  if (!isMine) {
    return null;
  }

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  }[size];

  const StatusIcon = StatusIcons[status] || StatusIcons.sent;

  const textColor = {
    sending: "text-gray-400",
    sent: "text-gray-400",
    delivered: "text-gray-400",
    read: "text-blue-500",
    failed: "text-red-500",
    pending: "text-yellow-500",
  }[status];

  const formatFullDate = (date?: string | null) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleString(lang === "ar" ? "ar-SA" : "en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const dateStr = readAt ? formatFullDate(readAt) : createdAt ? formatFullDate(createdAt) : "";

  return (
    <div className={cn("flex items-center gap-1.5", textColor, className)}>
      <StatusIcon className={iconSize} />
      <span className="text-[10px] font-medium opacity-70">{dateStr}</span>
    </div>
  );
}