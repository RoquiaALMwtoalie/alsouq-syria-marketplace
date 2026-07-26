// src/components/chat/ChatHeader.tsx

import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Video,
  Search,
  Pin,
  Bell,
  BellOff,
  Archive,
  Trash2,
  User,
  Store,
  Star,
  Clock,
  CheckCircle,
  Circle,
  Users,
  Settings,
  Volume2,
  VolumeX,
  Eye,
  EyeOff,
  Ban,
  Flag,
  Share2,
  Copy,
  QrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// ====== أنواع ======
interface User {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  store_name: string | null;
  store_logo_url: string | null;
  is_online: boolean;
  last_seen_at: string | null;
  phone?: string | null;
  bio?: string | null;
}

interface ChatHeaderProps {
  user: User;
  conversationId: string;
  isStore?: boolean;
  isMuted?: boolean;
  isPinned?: boolean;
  isArchived?: boolean;
  onBack?: () => void;
  onMute?: () => void;
  onPin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  onSearch?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onViewProfile?: () => void;
  onViewStore?: () => void;
  onBlock?: () => void;
  onReport?: () => void;
  onShare?: () => void;
  className?: string;
  showBackButton?: boolean;
  showActions?: boolean;
}

// ====== مكون حالة المستخدم ======
function UserStatus({ user, className }: { user: User; className?: string }) {
  const app = useApp();

  if (user.is_online) {
    return (
      <span className={cn("flex items-center gap-1.5 text-xs text-green-500", className)}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
        </span>
        {app.lang === "ar" ? "متصل الآن" : "Online"}
      </span>
    );
  }

  if (user.last_seen_at) {
    const lastSeen = new Date(user.last_seen_at);
    const now = new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    let lastSeenText = "";
    if (app.lang === "ar") {
      if (diffMins < 1) lastSeenText = "الآن";
      else if (diffMins < 60) lastSeenText = `منذ ${diffMins} دقيقة`;
      else if (diffHours < 24) lastSeenText = `منذ ${diffHours} ساعة`;
      else if (diffDays < 7) lastSeenText = `منذ ${diffDays} يوم`;
      else lastSeenText = lastSeen.toLocaleDateString("ar-SA");
    } else {
      if (diffMins < 1) lastSeenText = "Just now";
      else if (diffMins < 60) lastSeenText = `${diffMins}m ago`;
      else if (diffHours < 24) lastSeenText = `${diffHours}h ago`;
      else if (diffDays < 7) lastSeenText = `${diffDays}d ago`;
      else lastSeenText = lastSeen.toLocaleDateString("en-US");
    }

    return (
      <span className={cn("flex items-center gap-1.5 text-xs text-muted-foreground", className)}>
        <Clock className="h-3 w-3" />
        {app.lang === "ar" ? `آخر ظهور ${lastSeenText}` : `Last seen ${lastSeenText}`}
      </span>
    );
  }

  // ✅ بدلاً من "غير متاح"، اعرض "غير متصل"
  return (
    <span className={cn("flex items-center gap-1.5 text-xs text-gray-400", className)}>
      <span className="relative flex h-2 w-2">
        <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-400" />
      </span>
      {app.lang === "ar" ? "غير متصل" : "Offline"}
    </span>
  );
}

// ====== مكون معلومات المستخدم ======
function UserInfo({ user, isStore }: { user: User; isStore?: boolean }) {
  const app = useApp();
  
  const name = user.store_name || user.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  const avatar = user.store_logo_url || user.avatar_url;

  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar className="h-10 w-10 ring-2 ring-blue-200 dark:ring-blue-800 shrink-0">
        <AvatarImage src={avatar || undefined} alt={name} />
        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm font-bold">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-sm truncate">{name}</h2>
          {isStore && (
            <Badge variant="secondary" className="text-[8px] px-1.5 py-0 h-4 bg-emerald-500/10 text-emerald-600 border-emerald-500/20 rounded-full shrink-0">
              {app.lang === "ar" ? "متجر" : "Store"}
            </Badge>
          )}
        </div>
        <UserStatus user={user} />
      </div>
    </div>
  );
}

// ====== المكون الرئيسي ======
export function ChatHeader({
  user,
  conversationId,
  isStore = false,
  isMuted = false,
  isPinned = false,
  isArchived = false,
  onBack,
  onMute,
  onPin,
  onArchive,
  onDelete,
  onSearch,
  onCall,
  onVideoCall,
  onViewProfile,
  onViewStore,
  onBlock,
  onReport,
  onShare,
  className,
  showBackButton = true,
  showActions = true,
}: ChatHeaderProps) {
  const app = useApp();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const name = user.store_name || user.full_name || (app.lang === "ar" ? "مستخدم" : "User");

  // ====== معالج الرجوع ======
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate({ to: "/messages" });
    }
  };

  // ====== معالج الحذف ======
  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteDialog(false);
    toast.success(app.lang === "ar" ? "تم حذف المحادثة" : "Conversation deleted");
  };

  return (
    <>
      {/* ====== ✅ رأس المحادثة - تصميم الماسنجر ====== */}
      <div
        className={cn(
          "flex items-center justify-between px-4 py-3",
          "bg-white dark:bg-[#242538]",
          "border-b border-[#e4e6eb] dark:border-[#3a3b4a]",
          "transition-all duration-300",
          isHovered ? "shadow-sm" : "",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* ✅ الجانب الأيسر - زر الرجوع + معلومات المستخدم */}
        <div className="flex items-center gap-2 min-w-0">
          {/* ✅ زر الرجوع - محسّن مثل الماسنجر */}
          {showBackButton && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-all shrink-0 text-slate-700 dark:text-slate-300 hover:scale-105 active:scale-95"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{app.lang === "ar" ? "رجوع" : "Back"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {/* معلومات المستخدم - قابلة للنقر للذهاب للملف الشخصي */}
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2"
            onClick={onViewProfile}
          >
            <UserInfo user={user} isStore={isStore} />
          </div>
        </div>

        {/* ✅ الجانب الأيمن - أزرار الماسنجر */}
        {showActions && (
          <div className="flex items-center gap-0.5 shrink-0">
            {/* ✅ زر البحث */}
            {onSearch && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors text-slate-600 dark:text-slate-400"
                      onClick={onSearch}
                    >
                      <Search className="h-4.5 w-4.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{app.lang === "ar" ? "بحث" : "Search"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* ✅ زر الاتصال الصوتي */}
            {onCall && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors text-green-600 hover:text-green-700"
                      onClick={onCall}
                    >
                      <Phone className="h-4.5 w-4.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{app.lang === "ar" ? "اتصال صوتي" : "Voice call"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* ✅ زر الاتصال المرئي */}
            {onVideoCall && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors text-[#0084ff] hover:text-[#0073e6]"
                      onClick={onVideoCall}
                    >
                      <Video className="h-4.5 w-4.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{app.lang === "ar" ? "مكالمة فيديو" : "Video call"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            {/* القائمة المنسدلة */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors text-slate-600 dark:text-slate-400"
                >
                  <MoreVertical className="h-4.5 w-4.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl p-1 shadow-xl border-[#e4e6eb] dark:border-[#3a3b4a]">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar_url || undefined} alt={name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                        {name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">{name}</p>
                      <p className="text-xs text-muted-foreground">{user.id}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {onViewProfile && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg" onClick={onViewProfile}>
                      <User className="h-4 w-4" />
                      {app.lang === "ar" ? "عرض الملف الشخصي" : "View profile"}
                    </DropdownMenuItem>
                  )}
                  {isStore && onViewStore && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg" onClick={onViewStore}>
                      <Store className="h-4 w-4" />
                      {app.lang === "ar" ? "عرض المتجر" : "View store"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {onPin && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg" onClick={onPin}>
                      {isPinned ? (
                        <>
                          <Pin className="h-4 w-4 text-yellow-500" />
                          {app.lang === "ar" ? "إلغاء التثبيت" : "Unpin"}
                        </>
                      ) : (
                        <>
                          <Pin className="h-4 w-4" />
                          {app.lang === "ar" ? "تثبيت" : "Pin"}
                        </>
                      )}
                    </DropdownMenuItem>
                  )}

                  {onMute && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg" onClick={onMute}>
                      {isMuted ? (
                        <>
                          <Bell className="h-4 w-4" />
                          {app.lang === "ar" ? "إلغاء الكتم" : "Unmute"}
                        </>
                      ) : (
                        <>
                          <BellOff className="h-4 w-4" />
                          {app.lang === "ar" ? "كتم الإشعارات" : "Mute notifications"}
                        </>
                      )}
                    </DropdownMenuItem>
                  )}

                  {onArchive && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg" onClick={onArchive}>
                      <Archive className="h-4 w-4" />
                      {isArchived
                        ? (app.lang === "ar" ? "إلغاء الأرشفة" : "Unarchive")
                        : (app.lang === "ar" ? "أرشفة" : "Archive")}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                {onShare && (
                  <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg" onClick={onShare}>
                    <Share2 className="h-4 w-4" />
                    {app.lang === "ar" ? "مشاركة" : "Share"}
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  {onBlock && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={onBlock}>
                      <Ban className="h-4 w-4" />
                      {app.lang === "ar" ? "حظر" : "Block"}
                    </DropdownMenuItem>
                  )}
                  {onReport && (
                    <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30" onClick={onReport}>
                      <Flag className="h-4 w-4" />
                      {app.lang === "ar" ? "إبلاغ" : "Report"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem className="cursor-pointer gap-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                  {app.lang === "ar" ? "حذف المحادثة" : "Delete conversation"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* حوار تأكيد الحذف */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-red-500">
              {app.lang === "ar" ? "⚠️ حذف المحادثة" : "⚠️ Delete conversation"}
            </DialogTitle>
            <DialogDescription>
              {app.lang === "ar"
                ? "هل أنت متأكد من حذف هذه المحادثة؟ سيتم حذف جميع الرسائل بشكل نهائي."
                : "Are you sure you want to delete this conversation? All messages will be permanently deleted."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1 rounded-xl">
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button variant="destructive" onClick={confirmDelete} className="flex-1 rounded-xl">
              {app.lang === "ar" ? "حذف" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ====== نسخة مع حالة الاتصال ======
interface ChatHeaderWithCallStatusProps extends ChatHeaderProps {
  callStatus?: 'idle' | 'calling' | 'ringing' | 'connected' | 'ended';
  callDuration?: number;
}

export function ChatHeaderWithCallStatus({
  user,
  conversationId,
  isStore = false,
  isMuted = false,
  isPinned = false,
  isArchived = false,
  callStatus = 'idle',
  callDuration = 0,
  onBack,
  onMute,
  onPin,
  onArchive,
  onDelete,
  onSearch,
  onCall,
  onVideoCall,
  onViewProfile,
  onViewStore,
  onBlock,
  onReport,
  onShare,
  className,
  showBackButton = true,
  showActions = true,
}: ChatHeaderWithCallStatusProps) {
  const app = useApp();

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      <ChatHeader
        user={user}
        conversationId={conversationId}
        isStore={isStore}
        isMuted={isMuted}
        isPinned={isPinned}
        isArchived={isArchived}
        onBack={onBack}
        onMute={onMute}
        onPin={onPin}
        onArchive={onArchive}
        onDelete={onDelete}
        onSearch={onSearch}
        onCall={onCall}
        onVideoCall={onVideoCall}
        onViewProfile={onViewProfile}
        onViewStore={onViewStore}
        onBlock={onBlock}
        onReport={onReport}
        onShare={onShare}
        className={cn(
          callStatus === 'calling' || callStatus === 'ringing' || callStatus === 'connected'
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50"
            : "",
          className
        )}
        showBackButton={showBackButton}
        showActions={callStatus === 'idle' && showActions}
      />

      {(callStatus === 'calling' || callStatus === 'ringing' || callStatus === 'connected') && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 flex items-center justify-center gap-2 text-xs"
        >
          {callStatus === 'calling' && (
            <>
              <span className="animate-pulse text-blue-600">
                {app.lang === "ar" ? "جاري الاتصال..." : "Calling..."}
              </span>
              <span className="flex gap-0.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </span>
            </>
          )}
          {callStatus === 'ringing' && (
            <span className="text-green-600">
              {app.lang === "ar" ? "🔔 جاري الرنين..." : "🔔 Ringing..."}
            </span>
          )}
          {callStatus === 'connected' && (
            <span className="text-green-600">
              {app.lang === "ar" ? "🟢 متصل" : "🟢 Connected"} · {formatDuration(callDuration)}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
}