// src/components/chat/ChatInput.tsx

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Paperclip,
  Smile,
  Mic,
  Image,
  File,
  X,
  Loader2,
  Reply,
  MapPin,
  MicOff,
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
          className="h-9 w-9 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors"
        >
          <Smile className="h-5 w-5 text-muted-foreground hover:text-[#0084ff] transition-colors" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72 p-3 rounded-2xl shadow-xl border-[#e4e6eb] dark:border-[#3a3b4a]"
        align="start"
        side="top"
      >
        <div className="space-y-3">
          <Input
            placeholder="🔍 Search emojis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 text-sm rounded-xl"
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
                className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors text-xl hover:scale-110 transform transition-transform"
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
      className="flex items-center justify-between px-3 py-2 bg-[#e4e6eb]/50 dark:bg-[#3a3b4a]/50 border-l-4 border-[#0084ff] rounded-lg mb-2"
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-[#0084ff]">
          {app.lang === "ar" ? "رد على" : "Replying to"} {replyTo.senderName}
        </p>
        <p className="text-sm truncate text-muted-foreground">
          {replyTo.content}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:text-red-600 shrink-0"
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
          className="relative group rounded-xl overflow-hidden border border-[#e4e6eb] dark:border-[#3a3b4a] shadow-sm"
        >
          {attachment.type === 'image' && attachment.preview ? (
            <img
              src={attachment.preview}
              alt={attachment.file.name}
              className="h-16 w-16 object-cover"
            />
          ) : (
            <div className="h-16 w-16 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <File className="h-6 w-6 text-muted-foreground" />
            </div>
          )}
          <button
            onClick={() => onRemove(attachment.id)}
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] truncate px-1 py-0.5">
            {attachment.file.name}
          </div>
        </div>
      ))}
    </motion.div>
  );
}

// ====== ✅ مكون طلب الإذن للمايك ======
function MicrophonePermissionDialog({ 
  open, 
  onClose, 
  onAllow, 
  onDeny,
  app 
}: { 
  open: boolean; 
  onClose: () => void; 
  onAllow: () => void; 
  onDeny: () => void;
  app: any;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-[#242538] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full bg-[#0084ff]/10 flex items-center justify-center">
            <Mic className="h-6 w-6 text-[#0084ff]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {app.lang === "ar" ? "🎤 الوصول إلى الميكروفون" : "🎤 Microphone Access"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {app.lang === "ar" 
                ? "للتمكن من إرسال رسائل صوتية" 
                : "To send voice messages"}
            </p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
          {app.lang === "ar"
            ? "يحتاج التطبيق إلى الوصول إلى الميكروفون الخاص بك لتسجيل وإرسال الرسائل الصوتية. لن يتم استخدامه لأي غرض آخر."
            : "The app needs access to your microphone to record and send voice messages. It won't be used for any other purpose."}
        </p>

        <div className="flex flex-col gap-2">
          <Button
            onClick={onAllow}
            className="rounded-xl bg-[#0084ff] hover:bg-[#0073e6] text-white w-full"
          >
            {app.lang === "ar" ? "👍 السماح بالوصول" : "👍 Allow Access"}
          </Button>
          <Button
            variant="ghost"
            onClick={onDeny}
            className="rounded-xl text-muted-foreground hover:text-slate-700 dark:hover:text-slate-300 w-full"
          >
            {app.lang === "ar" ? "❌ ليس الآن" : "❌ Not Now"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          {app.lang === "ar"
            ? "يمكنك تغيير هذا الإعداد لاحقاً من إعدادات المتصفح"
            : "You can change this setting later in your browser settings"}
        </p>
      </motion.div>
    </div>
  );
}

// ====== المكون الرئيسي ======
interface ChatInputProps {
 onSendMessage: (content: string, file?: File, location?: { latitude: number; longitude: number }) => void;
  onTyping?: (isTyping: boolean) => void;
  onRecordVoice?: (audioBlob: Blob) => void;
  onSendLocation?: () => void;
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
  onRecordVoice,
  onSendLocation,
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
  const [isRecording, setIsRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionState, setPermissionState] = useState<'granted' | 'denied' | 'prompt' | 'unavailable'>('prompt');
  
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
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

    console.log("📤 ChatInput - handleSend:", {
      content,
      file: file?.name,
      fileSize: file?.size,
      fileType: file?.type,
      attachmentsLength: attachments.length,
      hasFile: !!file,
    });

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

    console.log("📎 File selected:", files[0]?.name, files[0]?.type, files[0]?.size);

    const newAttachments: Attachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      console.log(`📎 File ${i}:`, file.name, file.size, file.type);
      
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
          setAttachments(prev => {
            console.log("📎 Added image attachment:", attachment.file.name);
            return [...prev, attachment];
          });
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments(prev => {
          console.log("📎 Added file attachment:", attachment.file.name);
          return [...prev, attachment];
        });
      }
    }
  };

  // ====== إزالة مرفق ======
  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  // ====== ✅ التحقق من الإذن قبل التسجيل ======
  const checkMicrophonePermission = async () => {
    try {
      const permissionStatus = await navigator.permissions.query({ 
        name: 'microphone' as PermissionName 
      });
      
      console.log("🎤 Permission status:", permissionStatus.state);
      
      if (permissionStatus.state === 'granted') {
        startRecording();
      } else if (permissionStatus.state === 'prompt') {
        setShowPermissionDialog(true);
      } else if (permissionStatus.state === 'denied') {
        setPermissionState('denied');
        toast.error(
          app.lang === "ar"
            ? "❌ تم رفض الوصول إلى الميكروفون"
            : "❌ Microphone access was denied",
          {
            duration: 5000,
            action: {
              label: app.lang === "ar" ? "⚙️ فتح الإعدادات" : "⚙️ Open Settings",
              onClick: () => {
                if (navigator.userAgent.includes('Chrome')) {
                  window.open('chrome://settings/content/microphone', '_blank');
                } else if (navigator.userAgent.includes('Firefox')) {
                  window.open('about:preferences#privacy', '_blank');
                } else {
                  window.location.href = window.location.href + '?settings=true';
                }
              }
            }
          }
        );
      }
    } catch (error) {
      console.error("Error checking permission:", error);
      try {
        await startRecording();
      } catch {
        setPermissionState('unavailable');
      }
    }
  };

  // ====== ✅ التحقق من وجود ميكروفون ======
  const checkMicrophoneAvailability = async (): Promise<boolean> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = devices.filter(device => device.kind === 'audioinput');
      console.log("🎤 Microphones found:", audioDevices.length);
      return audioDevices.length > 0;
    } catch (error) {
      console.error("Error checking devices:", error);
      return false;
    }
  };

  // ====== ✅ دالة طلب الإذن ======
  const requestMicrophonePermission = async () => {
    setShowPermissionDialog(false);
    
    try {
      const hasMic = await checkMicrophoneAvailability();
      
      if (!hasMic) {
        toast.error(
          app.lang === "ar"
            ? "🎤 لا يوجد ميكروفون متصل بالجهاز."
            : "🎤 No microphone found on this device.",
          { duration: 5000 }
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false,
      });
      
      stream.getTracks().forEach(track => track.stop());
      setPermissionState('granted');
      startRecording();
      
    } catch (error: any) {
      console.error("Permission error:", error);
      
      if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        toast.error(
          app.lang === "ar"
            ? "🎤 لا يوجد ميكروفون متصل بالجهاز."
            : "🎤 No microphone found.",
          { duration: 5000 }
        );
      } else if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setPermissionState('denied');
        toast.error(
          app.lang === "ar"
            ? "❌ تم رفض الوصول إلى الميكروفون"
            : "❌ Microphone access was denied",
          {
            duration: 5000,
            action: {
              label: app.lang === "ar" ? "⚙️ فتح الإعدادات" : "⚙️ Open Settings",
              onClick: () => {
                if (navigator.userAgent.includes('Chrome')) {
                  window.open('chrome://settings/content/microphone', '_blank');
                } else {
                  window.open(window.location.href, '_blank');
                }
              }
            }
          }
        );
      } else {
        toast.error(
          app.lang === "ar"
            ? "❌ حدث خطأ أثناء محاولة الوصول إلى الميكروفون"
            : "❌ An error occurred while accessing the microphone"
        );
      }
    }
  };

  // ====== ✅ تسجيل صوتي ======
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm' 
        });
        
        if (audioBlob.size > 0 && onRecordVoice) {
          onRecordVoice(audioBlob);
          toast.success(
            app.lang === "ar" 
              ? "✅ تم تسجيل الصوت وإرساله" 
              : "✅ Voice recorded and sent"
          );
        }
        
        stream.getTracks().forEach(track => track.stop());
        audioChunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      toast.info(
        app.lang === "ar" 
          ? "🔴 جاري التسجيل... اضغط مرة أخرى للإيقاف" 
          : "🔴 Recording... press again to stop"
      );
      
    } catch (error: any) {
      console.error("Error accessing microphone:", error);
      
      let errorMessage = "";
      if (error.name === "NotFoundError" || error.name === "DevicesNotFoundError") {
        errorMessage = app.lang === "ar"
          ? "❌ لا يوجد ميكروفون متصل بالجهاز"
          : "❌ No microphone found on this device";
      } else if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        errorMessage = app.lang === "ar"
          ? "❌ تم رفض إذن الميكروفون"
          : "❌ Microphone permission denied";
      } else {
        errorMessage = app.lang === "ar"
          ? "❌ لا يمكن الوصول إلى الميكروفون"
          : "❌ Cannot access microphone";
      }
      
      toast.error(errorMessage);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // ====== ✅ مشاركة الموقع ======
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

    const options = {
      enableHighAccuracy: false,
      timeout: 30000,
      maximumAge: 60000,
    };

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
        
        if (error.code === error.TIMEOUT) {
          toast.error(
            app.lang === "ar"
              ? "⏱️ انتهت المهلة. حاول مرة أخرى."
              : "⏱️ Timeout. Please try again."
          );
        } else {
          let errorMessage = "";
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = app.lang === "ar"
                ? "❌ تم رفض إذن الموقع"
                : "❌ Location permission denied";
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = app.lang === "ar"
                ? "❌ معلومات الموقع غير متاحة"
                : "❌ Location information unavailable";
              break;
            default:
              errorMessage = app.lang === "ar"
                ? "❌ فشل الحصول على الموقع"
                : "❌ Failed to get location";
          }
          toast.error(errorMessage);
        }
      },
      options
    );
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      }
    };
  }, [isRecording]);

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
      {/* ✅ حوار طلب الإذن للمايك */}
      {showPermissionDialog && (
        <MicrophonePermissionDialog
          open={showPermissionDialog}
          onClose={() => setShowPermissionDialog(false)}
          onAllow={requestMicrophonePermission}
          onDeny={() => {
            setShowPermissionDialog(false);
            setPermissionState('denied');
          }}
          app={app}
        />
      )}

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
          "flex items-end gap-2 p-2",
          "bg-white dark:bg-[#242538]",
          "border border-[#e4e6eb] dark:border-[#3a3b4a]",
          "rounded-full",
          "transition-all duration-300",
          isFocused
            ? "border-[#0084ff] shadow-lg shadow-[#0084ff]/20"
            : "hover:border-[#0084ff]/50",
          className
        )}
      >
        {/* أزرار المرفقات */}
        <div className="flex items-center gap-0.5 shrink-0">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors text-slate-500 dark:text-slate-400"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={disabled || isLoading}
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
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

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors text-slate-500 dark:text-slate-400"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={disabled || isLoading}
                >
                  <Image className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{app.lang === "ar" ? "صورة" : "Image"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
          disabled={disabled || isLoading || isRecording}
          className={cn(
            "flex-1 min-h-[40px] max-h-[120px] resize-none",
            "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
            "bg-transparent p-1 text-sm",
            "placeholder:text-muted-foreground/60",
            isRecording && "opacity-50"
          )}
          rows={1}
        />

        {/* عدد الأحرف */}
        {message.length > 0 && (
          <span
            className={cn(
              "text-[10px] font-medium shrink-0 px-1",
              isOverLimit
                ? "text-red-500"
                : isNearLimit
                ? "text-yellow-500"
                : "text-muted-foreground"
            )}
          >
            {remainingChars}
          </span>
        )}

        {/* ✅ الأزرار الجانبية - ترتيب RTL */}
        <div className={cn("flex items-center gap-0.5 shrink-0", isRTL ? "flex-row" : "flex-row")}>
          <EmojiPicker
            onEmojiSelect={handleEmojiSelect}
            open={showEmojiPicker}
            onOpenChange={setShowEmojiPicker}
          />

          {/* ✅ زر الموقع */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors text-slate-500 dark:text-slate-400 hover:text-red-500"
                  onClick={handleSendLocation}
                  disabled={disabled || isLoading}
                >
                  <MapPin className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>{app.lang === "ar" ? "موقع" : "Location"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* ✅ زر التسجيل الصوتي */}
          <Button
            variant={isRecording ? "destructive" : "ghost"}
            size="icon"
            className={cn(
              "h-9 w-9 rounded-full transition-all",
              isRecording
                ? "animate-pulse shadow-lg shadow-red-500/30"
                : "hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a]"
            )}
            onClick={() => {
              if (isRecording) {
                stopRecording();
              } else {
                checkMicrophonePermission();
              }
            }}
            disabled={disabled || isLoading}
          >
            {isRecording ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5 text-slate-500 dark:text-slate-400 hover:text-[#0084ff]" />
            )}
          </Button>

          {/* ✅ زر الإرسال - آخر عنصر */}
          <Button
            onClick={handleSend}
            disabled={
              (!message.trim() && attachments.length === 0) ||
              isLoading ||
              disabled ||
              isRecording ||
              isOverLimit
            }
            className={cn(
              "h-9 w-9 rounded-full p-0",
              "bg-[#0084ff] hover:bg-[#0073e6]",
              "text-white shadow-lg shadow-[#0084ff]/30",
              "transition-all duration-300",
              "hover:scale-105 active:scale-95",
              "disabled:opacity-50 disabled:hover:scale-100",
              isRTL ? "order-last" : ""
            )}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <SendHorizontal className="h-4 w-4" />
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
        className="flex-1 rounded-full border-[#e4e6eb] dark:border-[#3a3b4a] focus:ring-2 focus:ring-[#0084ff]"
      />
      <Button
        onClick={handleSend}
        disabled={!message.trim() || isLoading || disabled}
        className="rounded-full px-6 bg-[#0084ff] hover:bg-[#0073e6] text-white shadow-lg shadow-[#0084ff]/30 transition-all hover:scale-105 disabled:opacity-50"
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