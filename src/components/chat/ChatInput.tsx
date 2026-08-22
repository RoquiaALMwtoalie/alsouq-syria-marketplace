// src/components/chat/ChatInput.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Image,
  File,
  X,
  Loader2,
  Reply,
  MapPin,
  SendHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// ====== أيقونة متحركة ======
const AnimatedIcon = ({ 
  Icon, 
  className = "",
  color = "text-[#2a655f]",
  delay = 0,
  size = "h-5 w-5"
}: any) => {
  return (
    <div 
      className="relative inline-flex items-center justify-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-float-icon group-hover:animate-pulse-slow">
        <Icon className={cn(
          "transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
          color,
          size,
          className
        )} />
      </div>
      <span className="absolute -inset-2 rounded-full border-2 border-[#2a655f]/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute -inset-4 rounded-full border-2 border-[#3a8a82]/10 animate-ripple delay-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
    </div>
  );
};

// ====== مكون اختيار الإيموجي ======
const EMOJIS = [
  "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊",
  "😋", "😎", "😍", "🥰", "😘", "😗", "😙", "😚", "🙂", "🤗",
  "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥",
  "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝",
  "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁",
  "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩",
  "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡",
  "😠", "🤬", "👍", "👎", "👊", "✊", "🤛", "🤜", "👏", "🙌",
  "👐", "🤲", "🤝", "🙏", "✌️", "🤟", "🤘", "👌", "👍", "👎",
  "💪", "🦾", "🖐️", "✋", "🖖", "👋", "🤚", "🦶", "🦵", "🦿",
];

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function EmojiPicker({ onEmojiSelect, open, onOpenChange }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  
  const filteredEmojis = search
    ? EMOJIS.filter(emoji => emoji.includes(search))
    : EMOJIS;

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-2xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-[#2a655f]/20 hover:border-[#3a8a82]/40 group"
        >
          <AnimatedIcon Icon={Smile} className="h-5 w-5 text-[#2a655f] group-hover:text-[#3a8a82]" color="text-[#2a655f]" delay={0} size="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-3 rounded-2xl shadow-2xl border-[#2a655f]/20 bg-white/95 dark:bg-[#0d1f1d]/95 backdrop-blur-xl"
        align="start"
        side="top"
      >
        <div className="space-y-3">
          <Input
            placeholder="🔍 Search emojis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 text-sm rounded-xl border-[#2a655f]/20 focus:border-[#3a8a82]/40"
          />
          <div className="grid grid-cols-8 gap-1 max-h-48 overflow-y-auto">
            {filteredEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onEmojiSelect(emoji);
                  onOpenChange(false);
                  setSearch("");
                }}
                className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-colors text-xl hover:scale-110 transform transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
          {filteredEmojis.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              No emojis found
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

// ====== مكون الرد على رسالة ======
interface ReplyPreviewProps {
  replyTo: {
    id: string;
    content: string;
    senderName: string;
  } | null;
  onCancel: () => void;
}

function ReplyPreview({ replyTo, onCancel }: ReplyPreviewProps) {
  const app = useApp();

  if (!replyTo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 border-r-4 border-[#2a655f] rounded-2xl mb-2"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1.5">
          <AnimatedIcon Icon={Reply} className="h-3.5 w-3.5" color="text-[#2a655f]" delay={0} size="h-3.5 w-3.5" />
          {app.lang === "ar" ? "رد على" : "Replying to"} {replyTo.senderName}
        </p>
        <p className="text-sm truncate text-muted-foreground mt-0.5">
          {replyTo.content}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:text-red-600 shrink-0 transition-all"
        onClick={onCancel}
      >
        <X className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}

// ====== مكون المرفقات ======
interface Attachment {
  id: string;
  type: 'image' | 'file';
  file: File;
  preview?: string;
}

interface AttachmentsPreviewProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

function AttachmentsPreview({ attachments, onRemove }: AttachmentsPreviewProps) {
  if (attachments.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mb-2"
    >
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className="relative group rounded-xl overflow-hidden border-2 border-[#2a655f]/20 shadow-md hover:shadow-lg transition-all"
        >
          {attachment.type === 'image' && attachment.preview ? (
            <img
              src={attachment.preview}
              alt={attachment.file.name}
              className="h-16 w-16 object-cover"
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center bg-[#2a655f]/5 dark:bg-[#2a655f]/10">
              <AnimatedIcon Icon={File} className="h-6 w-6 text-[#2a655f]" color="text-[#2a655f]" delay={0} size="h-6 w-6" />
            </div>
          )}
          <button
            onClick={() => onRemove(attachment.id)}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform shadow-lg"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] truncate px-1.5 py-0.5 backdrop-blur-sm">
            {attachment.file.name}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ====== المكون الرئيسي ======
interface ChatInputProps {
  onSendMessage: (content: string, file?: File, location?: { latitude: number; longitude: number }) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  replyTo?: {
    id: string;
    content: string;
    senderName: string;
  } | null;
  onCancelReply?: () => void;
  maxLength?: number;
}

export function ChatInput({
  onSendMessage,
  onTyping,
  isLoading = false,
  disabled = false,
  placeholder,
  className,
  replyTo = null,
  onCancelReply,
  maxLength = 2000,
}: ChatInputProps) {
  const app = useApp();
  const isRTL = app.lang === 'ar';
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ====== معالجة الكتابة ======
  const handleTyping = useCallback((value: string) => {
    setMessage(value);
    
    if (!isTyping && value.length > 0) {
      setIsTyping(true);
      onTyping?.(true);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTyping?.(false);
      }
    }, 2000);
  }, [isTyping, onTyping]);

  // ====== معالجة إرسال الرسالة ======
  const handleSend = () => {
    const content = message.trim();
    const file = attachments.length > 0 ? attachments[0].file : undefined;

    if (!content && !file) return;
    if (isLoading) return;
    if (content.length > maxLength) {
      toast.error(
        app.lang === "ar"
          ? `الرسالة طويلة جداً (الحد الأقصى ${maxLength} حرف)`
          : `Message too long (max ${maxLength} characters)`
      );
      return;
    }

    onSendMessage(content, file);
    
    setMessage("");
    setAttachments([]);
    setIsTyping(false);
    onTyping?.(false);
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // ====== معالجة مفتاح Enter ======
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ====== إضافة إيموجي ======
  const handleEmojiSelect = (emoji: string) => {
    const cursorPosition = inputRef.current?.selectionStart || message.length;
    const newMessage = message.slice(0, cursorPosition) + emoji + message.slice(cursorPosition);
    setMessage(newMessage);
    handleTyping(newMessage);
    inputRef.current?.focus();
  };

  // ====== إضافة مرفقات ======
  const handleFileSelect = (files: FileList | null, type: 'image' | 'file') => {
    if (!files) return;

    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          app.lang === "ar"
            ? `${file.name} كبير جداً (الحد الأقصى 10MB)`
            : `${file.name} is too large (max 10MB)`
        );
        continue;
      }

      const attachment: Attachment = {
        id: `att-${Date.now()}-${i}`,
        type,
        file,
      };

      if (type === 'image' && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result as string;
          setAttachments(prev => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => [...prev, attachment]);
      }
    }
  };

  // ====== إزالة مرفق ======
  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // ====== مشاركة الموقع ======
  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        app.lang === "ar"
          ? "❌ متصفحك لا يدعم مشاركة الموقع"
          : "❌ Your browser doesn't support location sharing"
      );
      return;
    }

    toast.info(
      app.lang === "ar"
        ? "📍 جاري الحصول على الموقع..."
        : "📍 Getting location..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        onSendMessage(
          `📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          undefined,
          { latitude, longitude }
        );
        
        toast.success(
          app.lang === "ar"
            ? "✅ تم مشاركة الموقع"
            : "✅ Location shared"
        );
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error(
          app.lang === "ar"
            ? "❌ فشل الحصول على الموقع"
            : "❌ Failed to get location"
        );
      }
    );
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < 50;
  const isOverLimit = remainingChars < 0;

  const defaultPlaceholder = placeholder || (
    app.lang === "ar"
      ? "اكتب رسالتك..."
      : "Type a message..."
  );

  return (
    <div className={cn("flex flex-col", className)}>
      {/* ✅ CSS Animations */}
      <style>{`
        @keyframes float-icon {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-6px) rotate(3deg); }
          75% { transform: translateY(4px) rotate(-2deg); }
        }
        .animate-float-icon {
          animation: float-icon 3s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(2.5); opacity: 0; }
        }
        .animate-ripple {
          animation: ripple 2.5s ease-out infinite;
        }
      `}</style>

      <AnimatePresence>
        {replyTo && (
          <ReplyPreview
            replyTo={replyTo}
            onCancel={onCancelReply || (() => {})}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {attachments.length > 0 && (
          <AttachmentsPreview
            attachments={attachments}
            onRemove={handleRemoveAttachment}
          />
        )}
      </AnimatePresence>

      {/* ====== حقل الإدخال ====== */}
      <div
        className={cn(
          "flex items-end gap-1 md:gap-2 p-1.5 md:p-2",
          "bg-white/95 dark:bg-[#0d1f1d]/95",
          "border-2",
          "rounded-2xl",
          "transition-all duration-300",
          isFocused
            ? "border-[#2a655f] shadow-lg shadow-[#2a655f]/20"
            : "border-[#2a655f]/30 hover:border-[#3a8a82]/50",
          "backdrop-blur-xl",
          className
        )}
      >
        {/* أزرار المرفقات */}
        <div className="flex items-center gap-0.5 shrink-0">
          {/* زر المرفقات */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-[#2a655f]/20 hover:border-[#3a8a82]/40 group"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isLoading}
                >
                  <AnimatedIcon Icon={Paperclip} className="h-3.5 w-3.5 md:h-5 md:w-5 text-[#2a655f] group-hover:text-[#3a8a82]" color="text-[#2a655f]" delay={0} size="h-3.5 w-3.5 md:h-5 md:w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-[#2a655f] text-white border-0">
                <p>{app.lang === "ar" ? "مرفقات" : "Attachments"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            accept="*/*"
            onChange={(e) => handleFileSelect(e.target.files, 'file')}
          />

          {/* زر الصورة */}
          <div className="hidden sm:flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-[#2a655f]/20 hover:border-[#3a8a82]/40 group"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={disabled || isLoading}
                  >
                    <AnimatedIcon Icon={Image} className="h-3.5 w-3.5 md:h-5 md:w-5 text-[#2a655f] group-hover:text-[#3a8a82]" color="text-[#2a655f]" delay={100} size="h-3.5 w-3.5 md:h-5 md:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#2a655f] text-white border-0">
                  <p>{app.lang === "ar" ? "صورة" : "Image"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <input
            ref={imageInputRef}
            type="file"
            multiple
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileSelect(e.target.files, 'image')}
          />
        </div>

        {/* حقل النص */}
        <Textarea
          ref={inputRef}
          value={message}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= maxLength) {
              setMessage(value);
              handleTyping(value);
            }
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={defaultPlaceholder}
          disabled={disabled || isLoading}
          className={cn(
            "flex-1 min-h-[32px] md:min-h-[40px] max-h-[80px] md:max-h-[120px] resize-none",
            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            "bg-transparent p-0.5 md:p-1",
            "text-xs md:text-sm",
            "placeholder:text-muted-foreground/60"
          )}
          rows={1}
        />

        {/* عدد الأحرف */}
        {message.length > 0 && (
          <span
            className={cn(
              "hidden sm:inline-block text-[10px] font-medium shrink-0 px-1",
              isOverLimit
                ? "text-red-500"
                : isNearLimit
                ? "text-yellow-500"
                : "text-[#2a655f]"
            )}
          >
            {remainingChars}
          </span>
        )}

        {/* ✅ الأزرار الجانبية */}
        <div className={cn("flex items-center gap-0.5 shrink-0", isRTL ? "flex-row" : "flex-row")}>
          {/* زر الإيموجي */}
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            open={showEmojiPicker}
            onOpenChange={setShowEmojiPicker}
          />

          {/* زر الموقع */}
          <div className="hidden sm:flex">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-[#2a655f]/20 hover:border-[#3a8a82]/40 group"
                    onClick={handleSendLocation}
                    disabled={disabled || isLoading}
                  >
                    <AnimatedIcon Icon={MapPin} className="h-3.5 w-3.5 md:h-5 md:w-5 text-[#2a655f] group-hover:text-[#3a8a82]" color="text-[#2a655f]" delay={200} size="h-3.5 w-3.5 md:h-5 md:w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-[#2a655f] text-white border-0">
                  <p>{app.lang === "ar" ? "موقع" : "Location"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {/* زر الإرسال */}
          <Button
            onClick={handleSend}
            disabled={
              (!message.trim() && attachments.length === 0) ||
              isLoading ||
              disabled ||
              isOverLimit
            }
            className={cn(
              "h-9 w-9 md:h-12 md:w-12 rounded-xl md:rounded-2xl p-0",
              "bg-gradient-to-r from-[#2a655f] to-[#3a8a82]",
              "hover:from-[#1a4f4a] hover:to-[#2a655f]",
              "text-white shadow-lg shadow-[#2a655f]/30",
              "transition-all duration-300",
              "hover:scale-110 hover:shadow-xl hover:shadow-[#2a655f]/40",
              "active:scale-95",
              "disabled:opacity-50 disabled:hover:scale-100",
              isRTL ? "order-last" : ""
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
            ) : (
              <AnimatedIcon Icon={SendHorizontal} className="h-4 w-4 md:h-5 md:w-5 text-white" color="text-white" delay={0} size="h-4 w-4 md:h-5 md:w-5" />
            )}
          </Button>
        </div>
      </div>

      {isNearLimit && !isOverLimit && (
        <p className="text-xs text-yellow-500 mt-1 px-1">
          {app.lang === "ar"
            ? `تبقى ${remainingChars} حرف`
            : `${remainingChars} characters remaining`}
        </p>
      )}
      {isOverLimit && (
        <p className="text-xs text-red-500 mt-1 px-1">
          {app.lang === "ar"
            ? `تجاوزت الحد الأقصى بـ ${Math.abs(remainingChars)} حرف`
            : `Exceeded limit by ${Math.abs(remainingChars)} characters`}
        </p>
      )}
    </div>
  );
}

// ====== نسخة مبسطة ======
export function SimpleChatInput({
  onSendMessage,
  isLoading = false,
  disabled = false,
  placeholder,
  className,
}: {
  onSendMessage: (content: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}) {
  const app = useApp();
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const content = message.trim();
    if (!content) return;
    if (isLoading) return;

    onSendMessage(content);
    setMessage("");
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Input
        ref={inputRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || (app.lang === "ar" ? "اكتب رسالتك..." : "Type a message...")}
        disabled={disabled || isLoading}
        className="flex-1 rounded-full border-[#2a655f]/20 focus:border-[#3a8a82]/50 focus:ring-2 focus:ring-[#2a655f]/30"
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading || disabled}
        className="rounded-full px-6 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 transition-all hover:scale-105 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </div>
  );
}