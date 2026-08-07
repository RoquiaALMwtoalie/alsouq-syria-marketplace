// src/components/chat/MessageItem.tsx

import { useState, useRef, useEffect, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  CheckCheck,
  Clock,
  AlertCircle,
  Loader2,
  Copy,
  Reply,
  Forward,
  Trash2,
  Pin,
  MoreVertical,
  Image,
  File,
  Play,
  Volume2,
  MapPin,
  Download,
  ExternalLink,
  Navigation,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageStatus, MessageStatusType } from "@/components/chat/MessageStatus";
import { toast } from "sonner";

// ====== أنواع ======
export interface IMessageItem {
  id: string;
  conversation_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location';
  file_url?: string | null;
  file_name?: string | null;
  file_size?: number | null;
  reply_to_id?: string | null;
  is_deleted: boolean;
  is_forwarded: boolean;
  forwarded_from_id?: string | null;
  read_at: string | null;
  created_at: string;
  updated_at: string;
  location?: { latitude: number; longitude: number } | null;
  sender?: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    store_name: string | null;
    store_logo_url?: string | null;
  };
  reply_to?: IMessageItem | null;
}

interface MessageItemProps {
  message: IMessageItem;
  isMine: boolean;
  isFirstInGroup: boolean;
  isLastInGroup: boolean;
  showAvatar: boolean;
  onReply?: (message: IMessageItem) => void;
  onForward?: (message: IMessageItem) => void;
  onDelete?: (messageId: string) => void;
  onPin?: (messageId: string) => void;
  onSelect?: (messageId: string) => void;
  isSelected?: boolean;
  isSelecting?: boolean;
  className?: string;
}

// ====== مكون عرض الموقع ======
function LocationPreview({ message }: { message: IMessageItem }) {
  const app = useApp();
  const [mapError, setMapError] = useState(false);

  const extractCoordinates = (content: string) => {
    const match = content.match(/([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2]),
      };
    }
    return null;
  };

  const coords = message.location || extractCoordinates(message.content);

  if (!coords) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{app.lang === "ar" ? "📍 موقع غير معروف" : "📍 Unknown location"}</span>
      </div>
    );
  }

  const { latitude, longitude } = coords;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;

  return (
    <div className="mt-2 space-y-2">
      <div className="relative rounded-xl overflow-hidden shadow-sm group bg-slate-100 dark:bg-slate-800">
        {!mapError ? (
          <img
            src={`https://static-maps.yandex.ru/1.x/?ll=${longitude},${latitude}&z=14&l=map&size=280,150&pt=${longitude},${latitude},pm2rdl`}
            alt="Location"
            className="w-full h-auto"
            onError={() => setMapError(true)}
          />
        ) : (
          <div className="w-full h-[150px] flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <div className="text-center">
              <MapPin className="h-8 w-8 text-[#2a655f] mx-auto" />
              <p className="text-xs text-muted-foreground mt-1">
                {app.lang === "ar" ? "اضغط للفتح" : "Tap to open"}
              </p>
            </div>
          </div>
        )}
        
        <div className="absolute top-2 left-2 bg-[#2a655f] text-white p-1.5 rounded-full shadow-lg">
          <MapPin className="h-3.5 w-3.5" />
        </div>
        
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-slate-900/90 rounded-lg shadow-lg hover:scale-105 transition-transform"
        >
          <ExternalLink className="h-4 w-4 text-[#2a655f]" />
        </a>
      </div>
      
      <div className="flex items-center gap-2 px-3 py-2 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/10">
        <Navigation className="h-3.5 w-3.5 text-[#2a655f]" />
        <span className="text-xs font-mono text-muted-foreground">
          {latitude.toFixed(6)}, {longitude.toFixed(6)}
        </span>
      </div>
      
      <div className="flex gap-2">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-1.5 text-xs text-center bg-[#2a655f] hover:bg-[#1a4f4a] text-white rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          <Globe className="h-3 w-3" />
          {app.lang === "ar" ? "خرائط Google" : "Google Maps"}
        </a>
        <a
          href={wazeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 px-3 py-1.5 text-xs text-center bg-[#3a8a82] hover:bg-[#2a655f] text-white rounded-xl transition-colors flex items-center justify-center gap-1"
        >
          <Navigation className="h-3 w-3" />
          {app.lang === "ar" ? "Waze" : "Waze"}
        </a>
      </div>
    </div>
  );
}

// ====== مكون المرفقات ======
function AttachmentPreview({ message }: { message: IMessageItem }) {
  const app = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  if (message.type === 'text' || message.type === 'location') {
    return null;
  }

  if (!message.file_url) {
    return null;
  }

  if (message.type === 'image' || message.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return (
      <div className="relative mt-2 rounded-xl overflow-hidden max-w-[280px] shadow-sm">
        <img
          src={message.file_url}
          alt={message.file_name || "Image"}
          className="w-full h-auto rounded-xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer"
          onLoad={() => setIsLoading(false)}
          onError={(e) => {
            console.error("❌ Image error:", message.file_url);
            setError(true);
            (e.target as HTMLImageElement).style.display = 'none';
          }}
          loading="lazy"
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl">
            <Loader2 className="h-6 w-6 animate-spin text-[#2a655f]" />
          </div>
        )}
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl">
            {app.lang === "ar" ? "❌ فشل تحميل الصورة" : "❌ Failed to load image"}
          </div>
        )}
      </div>
    );
  }

  if (message.type === 'video') {
    return (
      <div className="relative mt-2 rounded-xl overflow-hidden max-w-[280px] shadow-sm">
        <video
          src={message.file_url}
          controls
          className="w-full h-auto rounded-xl"
          controlsList="nodownload"
        />
      </div>
    );
  }

  if (message.type === 'file') {
    const fileSize = message.file_size
      ? (message.file_size / 1024 / 1024).toFixed(1) + " MB"
      : "";

    return (
      <a
        href={message.file_url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center gap-3 p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-colors group max-w-[280px] border border-[#2a655f]/10"
      >
        <File className="h-8 w-8 text-[#2a655f] shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{message.file_name || "File"}</p>
          {fileSize && <p className="text-xs text-muted-foreground">{fileSize}</p>}
        </div>
        <Download className="h-4 w-4 text-muted-foreground group-hover:text-[#2a655f] transition-colors shrink-0" />
      </a>
    );
  }

  return (
    <div className="mt-2 p-2 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl text-sm text-muted-foreground border border-[#2a655f]/10">
      📎 {message.file_name || "Attachment"}
    </div>
  );
}

// ====== مكون رسالة محذوفة ======
function DeletedMessage({ isMine }: { isMine: boolean }) {
  const app = useApp();
  return (
    <div className={cn(
      "text-sm italic text-muted-foreground",
      isMine ? "text-[#2a655f]/70" : ""
    )}>
      {app.lang === "ar" ? "🗑️ تم حذف هذه الرسالة" : "🗑️ This message was deleted"}
    </div>
  );
}

// ====== مكون الرد على رسالة ======
function ReplyPreview({ message }: { message: IMessageItem }) {
  const app = useApp();
  
  if (!message) return null;
  
  return (
    <div className="mb-1 px-3 py-1.5 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-lg border-r-4 border-[#2a655f]">
      <p className="text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]">
        {app.lang === "ar" ? "رد على" : "Reply to"}
      </p>
      <p className="text-sm line-clamp-2 opacity-70">
        {message.is_deleted 
          ? (app.lang === "ar" ? "تم حذف هذه الرسالة" : "This message was deleted")
          : message.content
        }
      </p>
    </div>
  );
}

// ====== دالة المقارنة لـ React.memo ======
const areEqual = (prevProps: MessageItemProps, nextProps: MessageItemProps) => {
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.read_at === nextProps.message.read_at &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.is_deleted === nextProps.message.is_deleted &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isSelecting === nextProps.isSelecting &&
    prevProps.isMine === nextProps.isMine &&
    prevProps.showAvatar === nextProps.showAvatar &&
    prevProps.isFirstInGroup === nextProps.isFirstInGroup &&
    prevProps.isLastInGroup === nextProps.isLastInGroup
  );
};

// ====== المكون الرئيسي - مع React.memo ======
const MessageItemComponent = ({
  message,
  isMine,
  isFirstInGroup,
  isLastInGroup,
  showAvatar,
  onReply,
  onForward,
  onDelete,
  onPin,
  onSelect,
  isSelected = false,
  isSelecting = false,
  className,
}: MessageItemProps) => {
  const app = useApp();
  const [showActions, setShowActions] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  const getStatus = (): MessageStatusType => {
    if (message.is_deleted) return "sent";
    if (message.read_at) return "read";
    if (message.id.startsWith("temp-")) return "sending";
    return "sent";
  };

  const senderName = isMine
    ? (app.lang === "ar" ? "أنت" : "You")
    : message.sender?.store_name || message.sender?.full_name || (app.lang === "ar" ? "مستخدم" : "User");

  const senderAvatar = message.sender?.store_logo_url || message.sender?.avatar_url;

  const formatTime = (date: string) => {
    const d = new Date(date);
    return d.toLocaleTimeString(app.lang === "ar" ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDoubleClick = () => {
    if (!message.is_deleted && onReply) {
      onReply(message);
    }
  };

  useEffect(() => {
    let pressTimer: NodeJS.Timeout | null = null;

    const handleTouchStart = () => {
      if (isSelecting) return;
      pressTimer = setTimeout(() => {
        if (onSelect) {
          onSelect(message.id);
        }
      }, 500);
    };

    const handleTouchEnd = () => {
      if (pressTimer) {
        clearTimeout(pressTimer);
        pressTimer = null;
      }
    };

    const element = messageRef.current;
    if (element) {
      element.addEventListener('touchstart', handleTouchStart);
      element.addEventListener('touchend', handleTouchEnd);
      element.addEventListener('touchmove', handleTouchEnd);
    }

    return () => {
      if (element) {
        element.removeEventListener('touchstart', handleTouchStart);
        element.removeEventListener('touchend', handleTouchEnd);
        element.removeEventListener('touchmove', handleTouchEnd);
      }
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [message.id, onSelect, isSelecting]);

  if (message.is_deleted) {
    return (
      <div className={cn(
        "flex items-start gap-2 px-4 py-1",
        isMine ? "justify-end" : "justify-start",
        className
      )}>
        <div className={cn(
          "rounded-2xl px-4 py-2 max-w-[70%]",
          isMine 
            ? "bg-[#2a655f]/20 text-[#2a655f]" 
            : "bg-slate-100 dark:bg-slate-800 text-slate-400"
        )}>
          <DeletedMessage isMine={isMine} />
        </div>
      </div>
    );
  }

  // ====== ✅ التصميم الرئيسي ======
  return (
    <div
      id={`message-${message.id}`}
      ref={messageRef}
      className={cn(
        "flex items-start gap-2 px-4 py-1 group",
        isMine ? "justify-end" : "justify-start",
        isSelecting && "cursor-pointer",
        isSelected && "bg-[#2a655f]/10 rounded-lg",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onDoubleClick={handleDoubleClick}
      onClick={() => {
        if (isSelecting && onSelect) {
          onSelect(message.id);
        }
      }}
    >
      {/* صورة المرسل (لغير المرسل فقط) */}
      {!isMine && showAvatar && (
        <div className="flex-shrink-0 mt-1">
          <Avatar className="h-8 w-8 ring-2 ring-[#2a655f]/20 shadow-sm">
            <AvatarImage src={senderAvatar || undefined} alt={senderName} />
            <AvatarFallback className="bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs">
              {senderName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {/* فراغ للحفاظ على المحاذاة (للرسائل الخاصة بي) */}
      {isMine && showAvatar && <div className="w-8 flex-shrink-0" />}

      {/* محتوى الرسالة */}
      <div className={cn(
        "flex flex-col max-w-[75%]",
        isMine ? "items-end" : "items-start"
      )}>
        {/* اسم المرسل (لغير المرسل فقط) */}
        {!isMine && !isFirstInGroup && (
          <span className="text-xs font-medium text-[#2a655f] dark:text-[#3a8a82] mb-0.5">
            {senderName}
          </span>
        )}

        {/* الرد على رسالة */}
        {message.reply_to && (
          <ReplyPreview message={message.reply_to} />
        )}

        {/* ===== ✅ فقاعة الرسالة - بألوان السستم ===== */}
        <div
          className={cn(
            "relative rounded-2xl px-4 py-2.5 break-words shadow-sm",
            isMine
              ? "bg-[#2a655f] text-white rounded-br-sm"
              : "bg-white dark:bg-[#1a2b28] text-slate-900 dark:text-white rounded-bl-sm border border-[#2a655f]/10",
            isSelected && "ring-2 ring-[#2a655f]",
            message.type === 'text' && "min-w-[60px]"
          )}
        >
          {/* ✅ محتوى النص */}
          {message.type === 'text' && (
            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </p>
          )}

          {/* ✅ عرض الموقع */}
          {message.type === 'location' && (
            <LocationPreview message={message} />
          )}

          {/* إعادة توجيه */}
          {message.is_forwarded && (
            <div className="flex items-center gap-1 text-[10px] opacity-60 mt-0.5">
              <Forward className="h-3 w-3" />
              <span>{app.lang === "ar" ? "معاد توجيهها" : "Forwarded"}</span>
            </div>
          )}

          {/* المرفقات */}
          <AttachmentPreview message={message} />

          {/* الوقت والحالة */}
          <div className={cn(
            "flex items-center gap-1 mt-1",
            isMine ? "justify-end" : "justify-start"
          )}>
            <span className={cn(
              "text-[10px]",
              isMine ? "text-[#3a8a82]/70" : "text-muted-foreground"
            )}>
              {formatTime(message.created_at)}
            </span>
            
            <MessageStatus
              status={getStatus()}
              readAt={message.read_at}
              createdAt={message.created_at}
              isMine={isMine}
              size="sm"
              showTime={false}
            />
          </div>

          {/* القائمة المنسدلة عند التحويم */}
          {isMine && isHovered && !isSelecting && (
            <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-white dark:bg-[#1a2b28] shadow-md hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 border border-[#2a655f]/20"
                  >
                    <MoreVertical className="h-3 w-3 text-[#2a655f]" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl p-1 shadow-xl border-[#2a655f]/20">
                  {!message.is_deleted && onReply && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10" onClick={() => onReply(message)}>
                      <Reply className="h-4 w-4 text-[#2a655f]" />
                      {app.lang === "ar" ? "رد" : "Reply"}
                    </DropdownMenuItem>
                  )}
                  {!message.is_deleted && onForward && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10" onClick={() => onForward(message)}>
                      <Forward className="h-4 w-4 text-[#2a655f]" />
                      {app.lang === "ar" ? "إعادة توجيه" : "Forward"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10" onClick={() => {
                    navigator.clipboard.writeText(message.content);
                    toast.success(app.lang === "ar" ? "تم نسخ النص" : "Copied");
                  }}>
                    <Copy className="h-4 w-4 text-[#2a655f]" />
                    {app.lang === "ar" ? "نسخ" : "Copy"}
                  </DropdownMenuItem>
                  {onPin && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10" onClick={() => onPin(message.id)}>
                      <Pin className="h-4 w-4 text-[#2a655f]" />
                      {app.lang === "ar" ? "تثبيت" : "Pin"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator className="bg-[#2a655f]/10" />
                  {onDelete && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={() => onDelete(message.id)}>
                      <Trash2 className="h-4 w-4" />
                      {app.lang === "ar" ? "حذف للجميع" : "Delete for everyone"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ====== تصدير المكون مع React.memo ======
export const MessageItem = memo(MessageItemComponent, areEqual);

// ====== نسخة مبسطة ======
export const SimpleMessageItem = memo(function SimpleMessageItem(props: MessageItemProps) {
  return <MessageItem {...props} />;
});

// ====== نسخة مع مؤشر الكتابة ======
export const MessageItemWithTyping = memo(function MessageItemWithTyping({
  message,
  isMine,
  isFirstInGroup,
  isLastInGroup,
  showAvatar,
  onReply,
  onForward,
  onDelete,
  onPin,
  onSelect,
  isSelected = false,
  isSelecting = false,
  className,
  typingUsers = [],
}: MessageItemProps & { typingUsers?: string[] }) {
  const app = useApp();

  const isLastMessage = isLastInGroup;
  const isTyping = isLastMessage && typingUsers.length > 0 && !isMine;

  return (
    <>
      <MessageItem
        message={message}
        isMine={isMine}
        isFirstInGroup={isFirstInGroup}
        isLastInGroup={isLastInGroup}
        showAvatar={showAvatar}
        onReply={onReply}
        onForward={onForward}
        onDelete={onDelete}
        onPin={onPin}
        onSelect={onSelect}
        isSelected={isSelected}
        isSelecting={isSelecting}
        className={className}
      />
      
      {isTyping && (
        <div className="flex items-start gap-2 px-4 py-1">
          <div className="flex-shrink-0 mt-1">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs animate-pulse">
                ...
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm border border-[#2a655f]/10">
            <div className="flex items-center gap-1">
              <span className="text-sm text-muted-foreground">
                {app.lang === "ar" ? "يكتب..." : "typing..."}
              </span>
              <span className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-[#2a655f] animate-pulse"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
});