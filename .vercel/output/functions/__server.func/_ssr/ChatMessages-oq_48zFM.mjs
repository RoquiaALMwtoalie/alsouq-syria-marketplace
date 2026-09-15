import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { e as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useApp, b8 as TooltipProvider, b9 as Tooltip, ba as TooltipTrigger, b as Button, c as cn, bb as TooltipContent, $ as DropdownMenu, a0 as DropdownMenuTrigger, a1 as DropdownMenuContent, bm as DropdownMenuLabel, P as Avatar, Q as AvatarImage, U as AvatarFallback, bc as DropdownMenuSeparator, bn as DropdownMenuGroup, a2 as DropdownMenuItem, D as Dialog, g as DialogContent, q as DialogHeader, l as DialogTitle, m as DialogDescription, w as DialogFooter, bo as useMessages, bp as useSendMessage, bq as useMarkAsRead, aK as useDeleteConversation, br as useDeleteMessageForEveryone, bs as useForwardMessage, bt as useMuteConversation, bu as usePinConversation, bv as useUserStatus, bw as useSendTypingIndicator, aM as useConversationStore, B as Badge, I as Input, j as Textarea } from "./router-BU7AgYzK.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { P as Popover, a as PopoverTrigger, b as PopoverContent } from "./popover-CtuXcnOY.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { u as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { a2 as ArrowRight, A as ArrowLeft, q as Search, E as EllipsisVertical, U as User, c as Store, cS as Pin, ai as Bell, aj as BellOff, cT as Archive, S as Share2, cU as Ban, aF as Flag, v as Trash2, p as LoaderCircle, V as ChevronUp, y as ChevronDown, X, o as MessageCircle, cV as Paperclip, bK as Image, a0 as MapPin, cW as SendHorizontal, a1 as Shield, bO as MicOff, K as Mic, ad as Volume2, ae as VolumeX, cX as PhoneOff, g as Sparkles, cY as Video, bF as Camera, b as Clock, cZ as MessagesSquare, c0 as Reply, c_ as File, c$ as Smile, d0 as Forward, ca as Copy, d1 as ExternalLink, a5 as Navigation, aa as Globe, cu as Download, _ as CircleAlert, cc as CheckCheck, u as Check } from "../_libs/lucide-react.mjs";
import { A as AnimatePresence, m as motion } from "../_libs/framer-motion.mjs";
function UserStatus({ user, className }) {
  const app = useApp();
  console.log("🔍 ChatHeader - UserStatus received:", {
    is_online: user.is_online,
    last_seen_at: user.last_seen_at,
    user
  });
  if (user.is_online) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("flex items-center gap-1.5 text-xs text-[#3a8a82]", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3a8a82] opacity-75" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-[#3a8a82]" })
      ] }),
      app.lang === "ar" ? "متصل الآن" : "Online"
    ] });
  }
  if (user.last_seen_at) {
    const lastSeen = new Date(user.last_seen_at);
    const now = /* @__PURE__ */ new Date();
    const diffMs = now.getTime() - lastSeen.getTime();
    const diffMins = Math.floor(diffMs / 6e4);
    const diffHours = Math.floor(diffMs / 36e5);
    const diffDays = Math.floor(diffMs / 864e5);
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
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("flex items-center gap-1.5 text-xs text-muted-foreground", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3 text-[#2a655f]/50" }),
      app.lang === "ar" ? `آخر ظهور ${lastSeenText}` : `Last seen ${lastSeenText}`
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: cn("flex items-center gap-1.5 text-xs text-gray-400", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative flex h-2 w-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex rounded-full h-2 w-2 bg-gray-400" }) }),
    app.lang === "ar" ? "غير متصل" : "Offline"
  ] });
}
function UserInfo({ user, isStore }) {
  const app = useApp();
  const name = user.store_name || user.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  const avatar = user.store_logo_url || user.avatar_url;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 min-w-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-10 w-10 ring-2 ring-[#2a655f]/20 shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: avatar || void 0, alt: name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-sm font-bold", children: name.charAt(0).toUpperCase() })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold text-sm truncate text-foreground", children: name }),
        isStore && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { variant: "secondary", className: "text-[8px] px-1.5 py-0 h-4 bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 rounded-full shrink-0", children: app.lang === "ar" ? "متجر" : "Store" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(UserStatus, { user })
    ] })
  ] });
}
function ChatHeader({
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
  onViewProfile,
  onViewStore,
  onBlock,
  onReport,
  onShare,
  className,
  showBackButton = true,
  showActions = true
}) {
  const app = useApp();
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = reactExports.useState(false);
  const [isHovered, setIsHovered] = reactExports.useState(false);
  const isRtl = app.lang === "ar";
  const name = user.store_name || user.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate({ to: "/messages" });
    }
  };
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
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-center justify-between px-4 py-3",
          "bg-white/95 dark:bg-[#0d1f1d]/95 backdrop-blur-xl",
          "border-b border-[#2a655f]/20",
          "transition-all duration-300",
          isHovered ? "shadow-lg shadow-[#2a655f]/10" : "",
          className
        ),
        onMouseEnter: () => setIsHovered(true),
        onMouseLeave: () => setIsHovered(false),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 min-w-0", children: [
            showBackButton && /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: cn(
                    "h-11 w-11 rounded-2xl transition-all duration-300 shrink-0 relative",
                    "bg-gradient-to-br from-[#2a655f]/10 to-[#3a8a82]/10",
                    "hover:from-[#2a655f]/20 hover:to-[#3a8a82]/20",
                    "hover:scale-105 active:scale-95",
                    "border-2 border-[#2a655f]/20 hover:border-[#2a655f]/50",
                    "text-[#2a655f] dark:text-[#3a8a82]",
                    "shadow-md hover:shadow-xl hover:shadow-[#2a655f]/25",
                    "group"
                  ),
                  onClick: handleBack,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute inset-0 rounded-2xl bg-gradient-to-br from-[#2a655f]/5 to-[#3a8a82]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: isRtl ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: cn(
                      "h-5 w-5 transition-all duration-300",
                      "group-hover:-translate-x-1 group-hover:scale-110"
                    ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: cn(
                      "h-5 w-5 transition-all duration-300",
                      "group-hover:translate-x-1 group-hover:scale-110"
                    ) }) }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -inset-1 rounded-2xl border-2 border-[#2a655f]/0 group-hover:border-[#2a655f]/20 transition-all duration-500 animate-pulse-slow" })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", className: "bg-[#2a655f] text-white border-0 rounded-xl px-4 py-2 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-2 text-sm font-medium", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70", children: "🔙" }),
                app.lang === "ar" ? "العودة للخلف" : "Go Back"
              ] }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-2",
                onClick: onViewProfile,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserInfo, { user, isStore })
              }
            )
          ] }),
          showActions && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 shrink-0", children: [
            onSearch && /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-9 w-9 rounded-full hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-colors text-[#2a655f] dark:text-[#3a8a82] border border-transparent hover:border-[#2a655f]/20",
                  onClick: onSearch,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-4.5 w-4.5" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", className: "bg-[#2a655f] text-white border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: app.lang === "ar" ? "بحث" : "Search" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-9 w-9 rounded-full hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-colors text-[#2a655f] dark:text-[#3a8a82] border border-transparent hover:border-[#2a655f]/20",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-4.5 w-4.5" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-56 rounded-xl p-1 shadow-xl border-[#2a655f]/20 bg-white/95 dark:bg-[#0d1f1d]/95 backdrop-blur-xl", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuLabel, { className: "font-normal", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8 ring-1 ring-[#2a655f]/20", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: user.avatar_url || void 0, alt: name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs", children: name.charAt(0).toUpperCase() })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold text-foreground", children: name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: user.id.slice(0, 8) })
                  ] })
                ] }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[#2a655f]/10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuGroup, { children: [
                  onViewProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10 text-foreground", onClick: onViewProfile, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "h-4 w-4 text-[#2a655f]" }),
                    app.lang === "ar" ? "عرض الملف الشخصي" : "View profile"
                  ] }),
                  isStore && onViewStore && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10 text-foreground", onClick: onViewStore, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-4 w-4 text-[#2a655f]" }),
                    app.lang === "ar" ? "عرض المتجر" : "View store"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[#2a655f]/10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuGroup, { children: [
                  onPin && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10 text-foreground", onClick: onPin, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: cn("h-4 w-4", isPinned ? "text-[#2a655f]" : "") }),
                    isPinned ? app.lang === "ar" ? "إلغاء التثبيت" : "Unpin" : app.lang === "ar" ? "تثبيت" : "Pin"
                  ] }),
                  onMute && /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10 text-foreground", onClick: onMute, children: isMuted ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "h-4 w-4 text-[#2a655f]" }),
                    app.lang === "ar" ? "إلغاء الكتم" : "Unmute"
                  ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(BellOff, { className: "h-4 w-4 text-[#2a655f]" }),
                    app.lang === "ar" ? "كتم الإشعارات" : "Mute notifications"
                  ] }) }),
                  onArchive && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10 text-foreground", onClick: onArchive, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Archive, { className: "h-4 w-4 text-[#2a655f]" }),
                    isArchived ? app.lang === "ar" ? "إلغاء الأرشفة" : "Unarchive" : app.lang === "ar" ? "أرشفة" : "Archive"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[#2a655f]/10" }),
                onShare && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10 text-foreground", onClick: onShare, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "h-4 w-4 text-[#2a655f]" }),
                    app.lang === "ar" ? "مشاركة" : "Share"
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[#2a655f]/10" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuGroup, { children: [
                  onBlock && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30", onClick: onBlock, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Ban, { className: "h-4 w-4" }),
                    app.lang === "ar" ? "حظر" : "Block"
                  ] }),
                  onReport && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg text-orange-500 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30", onClick: onReport, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Flag, { className: "h-4 w-4" }),
                    app.lang === "ar" ? "إبلاغ" : "Report"
                  ] })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[#2a655f]/10" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30", onClick: handleDelete, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                  app.lang === "ar" ? "حذف المحادثة" : "Delete conversation"
                ] })
              ] })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: showDeleteDialog, onOpenChange: setShowDeleteDialog, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-2xl max-w-md border-[#2a655f]/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-xl font-bold text-red-500", children: app.lang === "ar" ? "⚠️ حذف المحادثة" : "⚠️ Delete conversation" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogDescription, { children: app.lang === "ar" ? "هل أنت متأكد من حذف هذه المحادثة؟ سيتم حذف جميع الرسائل بشكل نهائي." : "Are you sure you want to delete this conversation? All messages will be permanently deleted." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setShowDeleteDialog(false), className: "flex-1 rounded-xl border-[#2a655f]/20 hover:border-[#3a8a82]/40", children: app.lang === "ar" ? "إلغاء" : "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: confirmDelete, className: "flex-1 rounded-xl", children: app.lang === "ar" ? "حذف" : "Delete" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      ` })
  ] });
}
const StatusIcons = {
  sending: ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: cn("animate-spin text-[#2a655f]/50", className) }),
  sent: ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: cn("text-[#2a655f]/60", className) }),
  delivered: ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: cn("text-[#2a655f]/60", className) }),
  read: ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CheckCheck, { className: cn("text-[#3a8a82]", className) }),
  failed: ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: cn("text-red-500", className) }),
  pending: ({ className }) => /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: cn("text-yellow-500", className) })
};
const StatusLabels = {
  ar: {
    sending: "جاري الإرسال",
    sent: "تم الإرسال",
    delivered: "تم الوصول",
    read: "مقروءة",
    failed: "فشل الإرسال",
    pending: "قيد الانتظار"
  },
  en: {
    sending: "Sending",
    sent: "Sent",
    delivered: "Delivered",
    read: "Read",
    failed: "Failed",
    pending: "Pending"
  }
};
function MessageStatus({
  status,
  readAt,
  createdAt,
  isMine,
  className,
  showTime = true,
  size = "sm"
}) {
  const app = useApp();
  const lang = app.lang || "ar";
  if (!isMine) {
    return null;
  }
  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  }[size];
  const StatusIcon = StatusIcons[status] || StatusIcons.sent;
  const label = StatusLabels[lang][status] || status;
  const formatTime = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toLocaleTimeString(lang === "ar" ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const textColor = {
    sending: "text-[#2a655f]/50",
    sent: "text-[#2a655f]/60",
    delivered: "text-[#2a655f]/60",
    read: "text-[#3a8a82]",
    failed: "text-red-500",
    pending: "text-yellow-500"
  }[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "flex items-center gap-1.5",
        textColor,
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { mode: "wait", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { scale: 0.5, opacity: 0 },
            animate: { scale: 1, opacity: 1 },
            exit: { scale: 0.5, opacity: 0 },
            transition: { duration: 0.2 },
            className: "flex items-center",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusIcon, { className: iconSize })
          },
          status
        ) }),
        showTime && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-medium opacity-70", children: readAt ? formatTime(readAt) : createdAt ? formatTime(createdAt) : "" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: label })
      ]
    }
  );
}
function LocationPreview({ message }) {
  const app = useApp();
  const [mapError, setMapError] = reactExports.useState(false);
  const extractCoordinates = (content) => {
    const match = content.match(/([-+]?\d+\.\d+),\s*([-+]?\d+\.\d+)/);
    if (match) {
      return {
        latitude: parseFloat(match[1]),
        longitude: parseFloat(match[2])
      };
    }
    return null;
  };
  const coords = message.location || extractCoordinates(message.content);
  if (!coords) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm text-muted-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: app.lang === "ar" ? "📍 موقع غير معروف" : "📍 Unknown location" })
    ] });
  }
  const { latitude, longitude } = coords;
  const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
  const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative rounded-xl overflow-hidden shadow-sm group bg-slate-100 dark:bg-slate-800", children: [
      !mapError ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: `https://static-maps.yandex.ru/1.x/?ll=${longitude},${latitude}&z=14&l=map&size=280,150&pt=${longitude},${latitude},pm2rdl`,
          alt: "Location",
          className: "w-full h-auto",
          onError: () => setMapError(true)
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-[150px] flex items-center justify-center bg-slate-100 dark:bg-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-8 w-8 text-[#2a655f] mx-auto" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-1", children: app.lang === "ar" ? "اضغط للفتح" : "Tap to open" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 left-2 bg-[#2a655f] text-white p-1.5 rounded-full shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-3.5 w-3.5" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: googleMapsUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "absolute bottom-2 right-2 p-2 bg-white/90 dark:bg-slate-900/90 rounded-lg shadow-lg hover:scale-105 transition-transform",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-4 w-4 text-[#2a655f]" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 px-3 py-2 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-mono text-muted-foreground", children: [
        latitude.toFixed(6),
        ", ",
        longitude.toFixed(6)
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: googleMapsUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex-1 px-3 py-1.5 text-xs text-center bg-[#2a655f] hover:bg-[#1a4f4a] text-white rounded-xl transition-colors flex items-center justify-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { className: "h-3 w-3" }),
            app.lang === "ar" ? "خرائط Google" : "Google Maps"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "a",
        {
          href: wazeUrl,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "flex-1 px-3 py-1.5 text-xs text-center bg-[#3a8a82] hover:bg-[#2a655f] text-white rounded-xl transition-colors flex items-center justify-center gap-1",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Navigation, { className: "h-3 w-3" }),
            app.lang === "ar" ? "Waze" : "Waze"
          ]
        }
      )
    ] })
  ] });
}
function AttachmentPreview({ message }) {
  const app = useApp();
  const [isLoading, setIsLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(false);
  if (message.type === "text" || message.type === "location") {
    return null;
  }
  if (!message.file_url) {
    return null;
  }
  if (message.type === "image" || message.file_url?.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mt-2 rounded-xl overflow-hidden max-w-[280px] shadow-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: message.file_url,
          alt: message.file_name || "Image",
          className: "w-full h-auto rounded-xl hover:scale-[1.02] transition-transform duration-300 cursor-pointer",
          onLoad: () => setIsLoading(false),
          onError: (e) => {
            console.error("❌ Image error:", message.file_url);
            setError(true);
            e.target.style.display = "none";
          },
          loading: "lazy"
        }
      ),
      isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-[#2a655f]" }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/30 rounded-xl", children: app.lang === "ar" ? "❌ فشل تحميل الصورة" : "❌ Failed to load image" })
    ] });
  }
  if (message.type === "video") {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative mt-2 rounded-xl overflow-hidden max-w-[280px] shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "video",
      {
        src: message.file_url,
        controls: true,
        className: "w-full h-auto rounded-xl",
        controlsList: "nodownload"
      }
    ) });
  }
  if (message.type === "file") {
    const fileSize = message.file_size ? (message.file_size / 1024 / 1024).toFixed(1) + " MB" : "";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "a",
      {
        href: message.file_url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "mt-2 flex items-center gap-3 p-3 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-colors group max-w-[280px] border border-[#2a655f]/10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(File, { className: "h-8 w-8 text-[#2a655f] shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium truncate", children: message.file_name || "File" }),
            fileSize && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: fileSize })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "h-4 w-4 text-muted-foreground group-hover:text-[#2a655f] transition-colors shrink-0" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 p-2 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl text-sm text-muted-foreground border border-[#2a655f]/10", children: [
    "📎 ",
    message.file_name || "Attachment"
  ] });
}
function DeletedMessage({ isMine }) {
  const app = useApp();
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
    "text-sm italic text-muted-foreground",
    isMine ? "text-[#2a655f]/70" : ""
  ), children: app.lang === "ar" ? "🗑️ تم حذف هذه الرسالة" : "🗑️ This message was deleted" });
}
function ReplyPreview$1({ message }) {
  const app = useApp();
  if (!message) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 px-3 py-1.5 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-lg border-r-4 border-[#2a655f]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]", children: app.lang === "ar" ? "رد على" : "Reply to" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm line-clamp-2 opacity-70", children: message.is_deleted ? app.lang === "ar" ? "تم حذف هذه الرسالة" : "This message was deleted" : message.content })
  ] });
}
const areEqual = (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id && prevProps.message.read_at === nextProps.message.read_at && prevProps.message.content === nextProps.message.content && prevProps.message.is_deleted === nextProps.message.is_deleted && prevProps.isSelected === nextProps.isSelected && prevProps.isSelecting === nextProps.isSelecting && prevProps.isMine === nextProps.isMine && prevProps.showAvatar === nextProps.showAvatar && prevProps.isFirstInGroup === nextProps.isFirstInGroup && prevProps.isLastInGroup === nextProps.isLastInGroup;
};
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
  className
}) => {
  const app = useApp();
  const [showActions, setShowActions] = reactExports.useState(false);
  const [isHovered, setIsHovered] = reactExports.useState(false);
  const messageRef = reactExports.useRef(null);
  const getStatus = () => {
    if (message.is_deleted) return "sent";
    if (message.read_at) return "read";
    if (message.id.startsWith("temp-")) return "sending";
    return "sent";
  };
  const senderName = isMine ? app.lang === "ar" ? "أنت" : "You" : message.sender?.store_name || message.sender?.full_name || (app.lang === "ar" ? "مستخدم" : "User");
  const senderAvatar = message.sender?.store_logo_url || message.sender?.avatar_url;
  const formatTime = (date) => {
    const d = new Date(date);
    return d.toLocaleTimeString(app.lang === "ar" ? "ar-SA" : "en-US", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };
  const handleDoubleClick = () => {
    if (!message.is_deleted && onReply) {
      onReply(message);
    }
  };
  reactExports.useEffect(() => {
    let pressTimer = null;
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
      element.addEventListener("touchstart", handleTouchStart);
      element.addEventListener("touchend", handleTouchEnd);
      element.addEventListener("touchmove", handleTouchEnd);
    }
    return () => {
      if (element) {
        element.removeEventListener("touchstart", handleTouchStart);
        element.removeEventListener("touchend", handleTouchEnd);
        element.removeEventListener("touchmove", handleTouchEnd);
      }
      if (pressTimer) {
        clearTimeout(pressTimer);
      }
    };
  }, [message.id, onSelect, isSelecting]);
  if (message.is_deleted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
      "flex items-start gap-2 px-4 py-1",
      isMine ? "justify-end" : "justify-start",
      className
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn(
      "rounded-2xl px-4 py-2 max-w-[70%]",
      isMine ? "bg-[#2a655f]/20 text-[#2a655f]" : "bg-slate-100 dark:bg-slate-800 text-slate-400"
    ), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DeletedMessage, { isMine }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      id: `message-${message.id}`,
      ref: messageRef,
      className: cn(
        "flex items-start gap-2 px-4 py-1 group",
        isMine ? "justify-end" : "justify-start",
        isSelecting && "cursor-pointer",
        isSelected && "bg-[#2a655f]/10 rounded-lg",
        className
      ),
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      onDoubleClick: handleDoubleClick,
      onClick: () => {
        if (isSelecting && onSelect) {
          onSelect(message.id);
        }
      },
      children: [
        !isMine && showAvatar && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Avatar, { className: "h-8 w-8 ring-2 ring-[#2a655f]/20 shadow-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarImage, { src: senderAvatar || void 0, alt: senderName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs", children: senderName.charAt(0).toUpperCase() })
        ] }) }),
        isMine && showAvatar && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-8 flex-shrink-0" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
          "flex flex-col max-w-[75%]",
          isMine ? "items-end" : "items-start"
        ), children: [
          !isMine && !isFirstInGroup && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82] mb-0.5", children: senderName }),
          message.reply_to && /* @__PURE__ */ jsxRuntimeExports.jsx(ReplyPreview$1, { message: message.reply_to }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: cn(
                "relative rounded-2xl px-4 py-2.5 break-words shadow-sm",
                isMine ? "bg-[#2a655f] text-white rounded-br-sm" : "bg-white dark:bg-[#1a2b28] text-slate-900 dark:text-white rounded-bl-sm border border-[#2a655f]/10",
                isSelected && "ring-2 ring-[#2a655f]",
                message.type === "text" && "min-w-[60px]"
              ),
              children: [
                message.type === "text" && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap break-words leading-relaxed", children: message.content }),
                message.type === "location" && /* @__PURE__ */ jsxRuntimeExports.jsx(LocationPreview, { message }),
                message.is_forwarded && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-[10px] opacity-60 mt-0.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Forward, { className: "h-3 w-3" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: app.lang === "ar" ? "معاد توجيهها" : "Forwarded" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(AttachmentPreview, { message }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn(
                  "flex items-center gap-1 mt-1",
                  isMine ? "justify-end" : "justify-start"
                ), children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn(
                    "text-[10px]",
                    isMine ? "text-[#3a8a82]/70" : "text-muted-foreground"
                  ), children: formatTime(message.created_at) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MessageStatus,
                    {
                      status: getStatus(),
                      readAt: message.read_at,
                      createdAt: message.created_at,
                      isMine,
                      size: "sm",
                      showTime: false
                    }
                  )
                ] }),
                isMine && isHovered && !isSelecting && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenu, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "icon",
                      className: "h-6 w-6 rounded-full bg-white dark:bg-[#1a2b28] shadow-md hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 border border-[#2a655f]/20",
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-3 w-3 text-[#2a655f]" })
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", className: "w-48 rounded-xl p-1 shadow-xl border-[#2a655f]/20", children: [
                    !message.is_deleted && onReply && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10", onClick: () => onReply(message), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Reply, { className: "h-4 w-4 text-[#2a655f]" }),
                      app.lang === "ar" ? "رد" : "Reply"
                    ] }),
                    !message.is_deleted && onForward && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10", onClick: () => onForward(message), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Forward, { className: "h-4 w-4 text-[#2a655f]" }),
                      app.lang === "ar" ? "إعادة توجيه" : "Forward"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10", onClick: () => {
                      navigator.clipboard.writeText(message.content);
                      toast.success(app.lang === "ar" ? "تم نسخ النص" : "Copied");
                    }, children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Copy, { className: "h-4 w-4 text-[#2a655f]" }),
                      app.lang === "ar" ? "نسخ" : "Copy"
                    ] }),
                    onPin && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg hover:bg-[#2a655f]/10", onClick: () => onPin(message.id), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pin, { className: "h-4 w-4 text-[#2a655f]" }),
                      app.lang === "ar" ? "تثبيت" : "Pin"
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(DropdownMenuSeparator, { className: "bg-[#2a655f]/10" }),
                    onDelete && /* @__PURE__ */ jsxRuntimeExports.jsxs(DropdownMenuItem, { className: "cursor-pointer gap-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30", onClick: () => onDelete(message.id), children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-4 w-4" }),
                      app.lang === "ar" ? "حذف للجميع" : "Delete for everyone"
                    ] })
                  ] })
                ] }) })
              ]
            }
          )
        ] })
      ]
    }
  );
};
const MessageItem = reactExports.memo(MessageItemComponent, areEqual);
reactExports.memo(function SimpleMessageItem2(props) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MessageItem, { ...props });
});
reactExports.memo(function MessageItemWithTyping2({
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
  typingUsers = []
}) {
  const app = useApp();
  const isLastMessage = isLastInGroup;
  const isTyping = isLastMessage && typingUsers.length > 0 && !isMine;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MessageItem,
      {
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
        isSelected,
        isSelecting,
        className
      }
    ),
    isTyping && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2 px-4 py-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-shrink-0 mt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Avatar, { className: "h-8 w-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AvatarFallback, { className: "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white text-xs animate-pulse", children: "..." }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-sm border border-[#2a655f]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground", children: app.lang === "ar" ? "يكتب..." : "typing..." }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex gap-0.5", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "h-1.5 w-1.5 rounded-full bg-[#2a655f] animate-pulse",
            style: { animationDelay: `${i * 0.15}s` }
          },
          i
        )) })
      ] }) })
    ] })
  ] });
});
const TypingDots = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1 px-2 py-1", children: [0, 1, 2].map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.span,
    {
      className: "h-2 w-2 rounded-full bg-[#2a655f] dark:bg-[#3a8a82]",
      initial: { scale: 0.8, opacity: 0.3 },
      animate: {
        scale: [0.8, 1.2, 0.8],
        opacity: [0.3, 1, 0.3]
      },
      transition: {
        duration: 1.2,
        repeat: Infinity,
        delay: i * 0.2,
        ease: "easeInOut"
      }
    },
    i
  )) });
};
function TypingIndicator({
  conversationId,
  userIds,
  className,
  showAvatar = true,
  maxUsers = 2
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
  typingUsersInConversation.slice(0, maxUsers);
  typingUsersInConversation.length - maxUsers;
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      transition: { duration: 0.3 },
      className: cn(
        "flex items-center gap-3 px-4 py-2",
        "bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20",
        "border border-[#2a655f]/20 dark:border-[#2a655f]/30",
        "rounded-2xl shadow-sm",
        className
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium text-[#2a655f] dark:text-[#3a8a82]", children: typingText }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TypingDots, {})
      ] })
    }
  ) });
}
function DateSeparator({ date }) {
  const app2 = useApp();
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const today = /* @__PURE__ */ new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === today.toDateString()) {
      return app2.lang === "ar" ? "اليوم" : "Today";
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return app2.lang === "ar" ? "أمس" : "Yesterday";
    }
    return d.toLocaleDateString(app2.lang === "ar" ? "ar-SA" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center my-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 py-1.5 bg-[#2a655f]/10 dark:bg-[#2a655f]/20 rounded-full border border-[#2a655f]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82]", children: formatDate(date) }) }) });
}
function EmptyState({ conversationId }) {
  const app2 = useApp();
  const [name, setName] = reactExports.useState("");
  reactExports.useEffect(() => {
    const { conversations } = useConversationStore.getState();
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      const otherUser = conv.participant1_id === app2.user?.id ? conv.participant2 : conv.participant1;
      setName(otherUser?.store_name || otherUser?.full_name || "");
    }
  }, [conversationId, app2.user?.id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full text-center p-8 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-3xl", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-[#2a655f]/10 dark:bg-[#2a655f]/20 flex items-center justify-center mb-4 border-2 border-[#2a655f]/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MessagesSquare, { className: "h-10 w-10 text-[#2a655f] dark:text-[#3a8a82]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-slate-900 dark:text-white", children: app2.lang === "ar" ? "📩 لا توجد رسائل" : "📩 No messages" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2 max-w-sm", children: app2.lang === "ar" ? `ابدأ المحادثة مع ${name || "هذا المستخدم"}` : `Start a conversation with ${name || "this user"}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground/70 mt-1", children: app2.lang === "ar" ? "اكتب رسالتك الأولى الآن" : "Send your first message now" })
  ] });
}
function ScrollToBottomButton({ onClick, unreadCount }) {
  const app2 = useApp();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.button,
    {
      initial: { scale: 0, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      exit: { scale: 0, opacity: 0 },
      onClick,
      className: cn(
        "absolute bottom-4 left-1/2 -translate-x-1/2",
        "flex items-center gap-2 px-4 py-2",
        "bg-[#2a655f] hover:bg-[#1a4f4a]",
        "text-white text-sm font-medium",
        "rounded-full shadow-lg shadow-[#2a655f]/30",
        "transition-all duration-300",
        "hover:scale-105 active:scale-95 border border-white/10"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" }),
        unreadCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "bg-white text-[#2a655f] text-xs font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center", children: unreadCount }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden sm:inline", children: app2.lang === "ar" ? "انتقل للأسفل" : "Scroll down" })
      ]
    }
  );
}
function MessageList({
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
  maxHeight = "500px"
}) {
  const app2 = useApp();
  const containerRef = reactExports.useRef(null);
  const messagesEndRef = reactExports.useRef(null);
  const [isAtBottom, setIsAtBottom] = reactExports.useState(true);
  const [showScrollButton, setShowScrollButton] = reactExports.useState(false);
  const [unreadCount, setUnreadCount] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const count = messages.filter((msg) => {
      const isUnread = !msg.read_at && msg.receiver_id === userId;
      return isUnread;
    }).length;
    setUnreadCount(count);
  }, [messages, userId]);
  const scrollToBottom = reactExports.useCallback((behavior = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  }, []);
  const handleScroll = reactExports.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;
    const isBottom = scrollHeight - scrollTop - clientHeight < 50;
    setIsAtBottom(isBottom);
    setShowScrollButton(!isBottom && messages.length > 0);
  }, [messages.length]);
  reactExports.useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      scrollToBottom("smooth");
    }
  }, [messages, isAtBottom, scrollToBottom]);
  reactExports.useEffect(() => {
    if (isAtBottom && unreadCount > 0) {
      setUnreadCount(0);
    }
  }, [isAtBottom, unreadCount]);
  const handleScrollTop = reactExports.useCallback(() => {
    const container = containerRef.current;
    if (!container || !onLoadMore || !hasNextPage || isFetchingNextPage) return;
    if (container.scrollTop < 100) {
      onLoadMore();
    }
  }, [onLoadMore, hasNextPage, isFetchingNextPage]);
  const groupedMessages = reactExports.useMemo(() => {
    if (!showDateSeparators) {
      return messages.map((msg) => ({ type: "message", message: msg }));
    }
    const groups = [];
    let lastDate = "";
    messages.forEach((msg) => {
      const msgDate = new Date(msg.created_at).toDateString();
      if (msgDate !== lastDate) {
        groups.push({ type: "date", date: msg.created_at });
        lastDate = msgDate;
      }
      groups.push({ type: "message", message: msg });
    });
    return groups;
  }, [messages, showDateSeparators]);
  const messageGroups = reactExports.useMemo(() => {
    const groups = [];
    let currentGroup = [];
    messages.forEach((msg, index) => {
      const prevMsg = messages[index - 1];
      if (prevMsg && (prevMsg.sender_id !== msg.sender_id || new Date(msg.created_at).getTime() - new Date(prevMsg.created_at).getTime() > 5 * 60 * 1e3)) {
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
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex flex-col items-center justify-center",
          className
        ),
        style: { height: maxHeight },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-[#2a655f]" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: app2.lang === "ar" ? "جاري تحميل الرسائل..." : "Loading messages..." })
        ]
      }
    );
  }
  if (messages.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: cn(
          "flex flex-col items-center justify-center",
          className
        ),
        style: { height: maxHeight },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { conversationId })
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", style: { height: maxHeight }, children: [
    isFetchingNextPage && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-6 w-6 animate-spin text-[#2a655f]" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        ref: containerRef,
        onScroll: (e) => {
          handleScroll();
          handleScrollTop();
        },
        className: cn(
          "overflow-y-auto overflow-x-hidden",
          "scroll-smooth",
          "px-2 py-4",
          "bg-gradient-to-b from-[#f8fafc] to-[#f0f2f5] dark:from-[#0d1f1d] dark:to-[#0a1513]",
          className
        ),
        style: { height: maxHeight },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 pointer-events-none opacity-[0.02] dark:opacity-[0.04]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", style: {
            backgroundImage: `
              radial-gradient(circle at 20% 50%, #2a655f 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, #2a655f 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            backgroundPosition: "0 0, 30px 30px"
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-0.5 relative z-10", children: [
            groupedMessages.map((item, index) => {
              if (item.type === "date") {
                return /* @__PURE__ */ jsxRuntimeExports.jsx(DateSeparator, { date: item.date }, `date-${index}`);
              }
              const msg = item.message;
              const isMine = msg.sender_id === userId;
              const groupIndex = messageGroups.findIndex((g) => g.includes(msg));
              const group = groupIndex !== -1 ? messageGroups[groupIndex] : [msg];
              const msgIndex = group.indexOf(msg);
              const isFirstInGroup = msgIndex === 0;
              const isLastInGroup = msgIndex === group.length - 1;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                MessageItem,
                {
                  message: msg,
                  isMine,
                  isFirstInGroup,
                  isLastInGroup,
                  showAvatar: showAvatar && isFirstInGroup && !isMine,
                  onReply,
                  onForward,
                  onDelete,
                  onPin,
                  onSelect,
                  isSelected: selectedMessages.includes(msg.id),
                  isSelecting
                },
                msg.id
              );
            }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              TypingIndicator,
              {
                conversationId,
                userIds: [userId]
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: messagesEndRef })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: showScrollButton && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ScrollToBottomButton,
      {
        onClick: () => scrollToBottom("smooth"),
        unreadCount
      }
    ) })
  ] });
}
const AnimatedIcon$1 = ({
  Icon,
  className = "",
  color = "text-[#2a655f]",
  delay = 0,
  size = "h-5 w-5"
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative inline-flex items-center justify-center",
      style: { animationDelay: `${delay}ms` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-float-icon group-hover:animate-pulse-slow", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn(
          "transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
          color,
          size,
          className
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -inset-2 rounded-full border-2 border-[#2a655f]/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -inset-4 rounded-full border-2 border-[#3a8a82]/10 animate-ripple delay-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" })
      ]
    }
  );
};
const EMOJIS = [
  "😀",
  "😁",
  "😂",
  "🤣",
  "😃",
  "😄",
  "😅",
  "😆",
  "😉",
  "😊",
  "😋",
  "😎",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "🙂",
  "🤗",
  "🤩",
  "🤔",
  "🤨",
  "😐",
  "😑",
  "😶",
  "🙄",
  "😏",
  "😣",
  "😥",
  "😮",
  "🤐",
  "😯",
  "😪",
  "😫",
  "😴",
  "😌",
  "😛",
  "😜",
  "😝",
  "🤤",
  "😒",
  "😓",
  "😔",
  "😕",
  "🙃",
  "🤑",
  "😲",
  "☹️",
  "🙁",
  "😖",
  "😞",
  "😟",
  "😤",
  "😢",
  "😭",
  "😦",
  "😧",
  "😨",
  "😩",
  "🤯",
  "😬",
  "😰",
  "😱",
  "🥵",
  "🥶",
  "😳",
  "🤪",
  "😵",
  "😡",
  "😠",
  "🤬",
  "👍",
  "👎",
  "👊",
  "✊",
  "🤛",
  "🤜",
  "👏",
  "🙌",
  "👐",
  "🤲",
  "🤝",
  "🙏",
  "✌️",
  "🤟",
  "🤘",
  "👌",
  "👍",
  "👎",
  "💪",
  "🦾",
  "🖐️",
  "✋",
  "🖖",
  "👋",
  "🤚",
  "🦶",
  "🦵",
  "🦿"
];
function EmojiPicker({ onEmojiSelect, open, onOpenChange }) {
  const [search, setSearch] = reactExports.useState("");
  const filteredEmojis = search ? EMOJIS.filter((emoji) => emoji.includes(search)) : EMOJIS;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Popover, { open, onOpenChange, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        variant: "ghost",
        size: "icon",
        className: "h-10 w-10 rounded-2xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-[#2a655f]/20 hover:border-[#3a8a82]/40 group",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon$1, { Icon: Smile, className: "h-5 w-5 text-[#2a655f] group-hover:text-[#3a8a82]", color: "text-[#2a655f]", delay: 0, size: "h-5 w-5" })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PopoverContent,
      {
        className: "w-72 p-3 rounded-2xl shadow-2xl border-[#2a655f]/20 bg-white/95 dark:bg-[#0d1f1d]/95 backdrop-blur-xl",
        align: "start",
        side: "top",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              placeholder: "🔍 Search emojis...",
              value: search,
              onChange: (e) => setSearch(e.target.value),
              className: "h-9 text-sm rounded-xl border-[#2a655f]/20 focus:border-[#3a8a82]/40"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-8 gap-1 max-h-48 overflow-y-auto", children: filteredEmojis.map((emoji) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                onEmojiSelect(emoji);
                onOpenChange(false);
                setSearch("");
              },
              className: "h-9 w-9 flex items-center justify-center rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-colors text-xl hover:scale-110 transform transition-transform",
              children: emoji
            },
            emoji
          )) }),
          filteredEmojis.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-4", children: "No emojis found" })
        ] })
      }
    )
  ] });
}
function ReplyPreview({ replyTo, onCancel }) {
  const app = useApp();
  if (!replyTo) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -10 },
      className: "flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/20 border-r-4 border-[#2a655f] rounded-2xl mb-2",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon$1, { Icon: Reply, className: "h-3.5 w-3.5", color: "text-[#2a655f]", delay: 0, size: "h-3.5 w-3.5" }),
            app.lang === "ar" ? "رد على" : "Replying to",
            " ",
            replyTo.senderName
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm truncate text-muted-foreground mt-0.5", children: replyTo.content })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Button,
          {
            variant: "ghost",
            size: "icon",
            className: "h-8 w-8 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-500 hover:text-red-600 shrink-0 transition-all",
            onClick: onCancel,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
          }
        )
      ]
    }
  );
}
function AttachmentsPreview({ attachments, onRemove }) {
  if (attachments.length === 0) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: -10 },
      animate: { opacity: 1, y: 0 },
      className: "flex flex-wrap gap-2 mb-2",
      children: attachments.map((attachment) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative group rounded-xl overflow-hidden border-2 border-[#2a655f]/20 shadow-md hover:shadow-lg transition-all",
          children: [
            attachment.type === "image" && attachment.preview ? /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: attachment.preview,
                alt: attachment.file.name,
                className: "h-16 w-16 object-cover"
              }
            ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-16 w-16 flex items-center justify-center bg-[#2a655f]/5 dark:bg-[#2a655f]/10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon$1, { Icon: File, className: "h-6 w-6 text-[#2a655f]", color: "text-[#2a655f]", delay: 0, size: "h-6 w-6" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => onRemove(attachment.id),
                className: "absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110 transform shadow-lg",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[8px] truncate px-1.5 py-0.5 backdrop-blur-sm", children: attachment.file.name })
          ]
        },
        attachment.id
      ))
    }
  );
}
function ChatInput({
  onSendMessage,
  onTyping,
  isLoading = false,
  disabled = false,
  placeholder,
  className,
  replyTo = null,
  onCancelReply,
  maxLength = 2e3
}) {
  const app = useApp();
  const isRTL = app.lang === "ar";
  const [message, setMessage] = reactExports.useState("");
  const [isTyping, setIsTyping] = reactExports.useState(false);
  const [attachments, setAttachments] = reactExports.useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = reactExports.useState(false);
  const [isFocused, setIsFocused] = reactExports.useState(false);
  const inputRef = reactExports.useRef(null);
  const fileInputRef = reactExports.useRef(null);
  const imageInputRef = reactExports.useRef(null);
  const typingTimeoutRef = reactExports.useRef(null);
  const handleTyping = reactExports.useCallback((value) => {
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
    }, 2e3);
  }, [isTyping, onTyping]);
  const handleSend = () => {
    const content = message.trim();
    const file = attachments.length > 0 ? attachments[0].file : void 0;
    if (!content && !file) return;
    if (isLoading) return;
    if (content.length > maxLength) {
      toast.error(
        app.lang === "ar" ? `الرسالة طويلة جداً (الحد الأقصى ${maxLength} حرف)` : `Message too long (max ${maxLength} characters)`
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
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  const handleEmojiSelect = (emoji) => {
    const cursorPosition = inputRef.current?.selectionStart || message.length;
    const newMessage = message.slice(0, cursorPosition) + emoji + message.slice(cursorPosition);
    setMessage(newMessage);
    handleTyping(newMessage);
    inputRef.current?.focus();
  };
  const handleFileSelect = (files, type) => {
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 10 * 1024 * 1024) {
        toast.error(
          app.lang === "ar" ? `${file.name} كبير جداً (الحد الأقصى 10MB)` : `${file.name} is too large (max 10MB)`
        );
        continue;
      }
      const attachment = {
        id: `att-${Date.now()}-${i}`,
        type,
        file
      };
      if (type === "image" && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          attachment.preview = e.target?.result;
          setAttachments((prev) => [...prev, attachment]);
        };
        reader.readAsDataURL(file);
      } else {
        setAttachments((prev) => [...prev, attachment]);
      }
    }
  };
  const handleRemoveAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };
  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      toast.error(
        app.lang === "ar" ? "❌ متصفحك لا يدعم مشاركة الموقع" : "❌ Your browser doesn't support location sharing"
      );
      return;
    }
    toast.info(
      app.lang === "ar" ? "📍 جاري الحصول على الموقع..." : "📍 Getting location..."
    );
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        onSendMessage(
          `📍 ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
          void 0,
          { latitude, longitude }
        );
        toast.success(
          app.lang === "ar" ? "✅ تم مشاركة الموقع" : "✅ Location shared"
        );
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error(
          app.lang === "ar" ? "❌ فشل الحصول على الموقع" : "❌ Failed to get location"
        );
      }
    );
  };
  reactExports.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < 50;
  const isOverLimit = remainingChars < 0;
  const defaultPlaceholder = placeholder || (app.lang === "ar" ? "اكتب رسالتك..." : "Type a message...");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
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
      ` }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: replyTo && /* @__PURE__ */ jsxRuntimeExports.jsx(
      ReplyPreview,
      {
        replyTo,
        onCancel: onCancelReply || (() => {
        })
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: attachments.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      AttachmentsPreview,
      {
        attachments,
        onRemove: handleRemoveAttachment
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: cn(
          "flex items-end gap-1 md:gap-2 p-1.5 md:p-2",
          "bg-white/95 dark:bg-[#0d1f1d]/95",
          "border-2",
          "rounded-2xl",
          "transition-all duration-300",
          isFocused ? "border-[#2a655f] shadow-lg shadow-[#2a655f]/20" : "border-[#2a655f]/30 hover:border-[#3a8a82]/50",
          "backdrop-blur-xl",
          className
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-0.5 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-[#2a655f]/20 hover:border-[#3a8a82]/40 group",
                  onClick: () => fileInputRef.current?.click(),
                  disabled: disabled || isLoading,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon$1, { Icon: Paperclip, className: "h-3.5 w-3.5 md:h-5 md:w-5 text-[#2a655f] group-hover:text-[#3a8a82]", color: "text-[#2a655f]", delay: 0, size: "h-3.5 w-3.5 md:h-5 md:w-5" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "bg-[#2a655f] text-white border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: app.lang === "ar" ? "مرفقات" : "Attachments" }) })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                multiple: true,
                className: "hidden",
                accept: "*/*",
                onChange: (e) => handleFileSelect(e.target.files, "file")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-[#2a655f]/20 hover:border-[#3a8a82]/40 group",
                  onClick: () => imageInputRef.current?.click(),
                  disabled: disabled || isLoading,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon$1, { Icon: Image, className: "h-3.5 w-3.5 md:h-5 md:w-5 text-[#2a655f] group-hover:text-[#3a8a82]", color: "text-[#2a655f]", delay: 100, size: "h-3.5 w-3.5 md:h-5 md:w-5" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "bg-[#2a655f] text-white border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: app.lang === "ar" ? "صورة" : "Image" }) })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: imageInputRef,
                type: "file",
                multiple: true,
                className: "hidden",
                accept: "image/*",
                onChange: (e) => handleFileSelect(e.target.files, "image")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Textarea,
            {
              ref: inputRef,
              value: message,
              onChange: (e) => {
                const value = e.target.value;
                if (value.length <= maxLength) {
                  setMessage(value);
                  handleTyping(value);
                }
              },
              onKeyDown: handleKeyDown,
              onFocus: () => setIsFocused(true),
              onBlur: () => setIsFocused(false),
              placeholder: defaultPlaceholder,
              disabled: disabled || isLoading,
              className: cn(
                "flex-1 min-h-[32px] md:min-h-[40px] max-h-[80px] md:max-h-[120px] resize-none",
                "border-0 focus-visible:ring-0 focus-visible:ring-offset-0",
                "bg-transparent p-0.5 md:p-1",
                "text-xs md:text-sm",
                "placeholder:text-muted-foreground/60"
              ),
              rows: 1
            }
          ),
          message.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: cn(
                "hidden sm:inline-block text-[10px] font-medium shrink-0 px-1",
                isOverLimit ? "text-red-500" : isNearLimit ? "text-yellow-500" : "text-[#2a655f]"
              ),
              children: remainingChars
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-0.5 shrink-0", isRTL ? "flex-row" : "flex-row"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              EmojiPicker,
              {
                onEmojiSelect: handleEmojiSelect,
                open: showEmojiPicker,
                onOpenChange: setShowEmojiPicker
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden sm:flex", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Tooltip, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "ghost",
                  size: "icon",
                  className: "h-8 w-8 md:h-10 md:w-10 rounded-xl md:rounded-2xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-[#2a655f]/20 hover:border-[#3a8a82]/40 group",
                  onClick: handleSendLocation,
                  disabled: disabled || isLoading,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon$1, { Icon: MapPin, className: "h-3.5 w-3.5 md:h-5 md:w-5 text-[#2a655f] group-hover:text-[#3a8a82]", color: "text-[#2a655f]", delay: 200, size: "h-3.5 w-3.5 md:h-5 md:w-5" })
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(TooltipContent, { side: "top", className: "bg-[#2a655f] text-white border-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: app.lang === "ar" ? "موقع" : "Location" }) })
            ] }) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                onClick: handleSend,
                disabled: !message.trim() && attachments.length === 0 || isLoading || disabled || isOverLimit,
                className: cn(
                  "h-9 w-9 md:h-12 md:w-12 rounded-xl md:rounded-2xl p-0",
                  "bg-gradient-to-r from-[#2a655f] to-[#3a8a82]",
                  "hover:from-[#1a4f4a] hover:to-[#2a655f]",
                  "text-white shadow-lg shadow-[#2a655f]/30",
                  "transition-all duration-300",
                  "hover:scale-110 hover:shadow-xl hover:shadow-[#2a655f]/40",
                  "active:scale-95",
                  "disabled:opacity-50 disabled:hover:scale-100",
                  isRTL ? "order-last" : ""
                ),
                children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 md:h-5 md:w-5 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon$1, { Icon: SendHorizontal, className: "h-4 w-4 md:h-5 md:w-5 text-white", color: "text-white", delay: 0, size: "h-4 w-4 md:h-5 md:w-5" })
              }
            )
          ] })
        ]
      }
    ),
    isNearLimit && !isOverLimit && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-yellow-500 mt-1 px-1", children: app.lang === "ar" ? `تبقى ${remainingChars} حرف` : `${remainingChars} characters remaining` }),
    isOverLimit && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-red-500 mt-1 px-1", children: app.lang === "ar" ? `تجاوزت الحد الأقصى بـ ${Math.abs(remainingChars)} حرف` : `Exceeded limit by ${Math.abs(remainingChars)} characters` })
  ] });
}
function MessageSearch({
  messages,
  onSearchResult,
  onClose,
  className
}) {
  const app = useApp();
  const [query, setQuery] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const inputRef = reactExports.useRef(null);
  reactExports.useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCurrentIndex(0);
      return;
    }
    const filtered = messages.filter((msg) => {
      const content = msg.content || "";
      return content.toLowerCase().includes(query.toLowerCase());
    });
    setResults(filtered);
    setCurrentIndex(0);
  }, [query, messages]);
  reactExports.useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);
  const goToNext = () => {
    if (results.length === 0) return;
    const next = (currentIndex + 1) % results.length;
    setCurrentIndex(next);
    if (onSearchResult && results[next]) {
      onSearchResult(results[next].id);
    }
  };
  const goToPrev = () => {
    if (results.length === 0) return;
    const prev = (currentIndex - 1 + results.length) % results.length;
    setCurrentIndex(prev);
    if (onSearchResult && results[prev]) {
      onSearchResult(results[prev].id);
    }
  };
  const handleResultClick = (index) => {
    setCurrentIndex(index);
    if (onSearchResult && results[index]) {
      onSearchResult(results[index].id);
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: cn(
        "bg-white/95 dark:bg-[#0d1f1d]/95 backdrop-blur-xl",
        "border-b border-[#2a655f]/20",
        "p-3 shadow-xl",
        className
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f] dark:text-[#3a8a82]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                ref: inputRef,
                value: query,
                onChange: (e) => setQuery(e.target.value),
                placeholder: app.lang === "ar" ? "🔍 بحث في الرسائل..." : "🔍 Search messages...",
                className: "pl-9 pr-4 rounded-xl border-[#2a655f]/20 focus:border-[#3a8a82]/50 focus:ring-[#2a655f]/30"
              }
            )
          ] }),
          results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs font-medium text-[#2a655f] dark:text-[#3a8a82] whitespace-nowrap", children: [
              currentIndex + 1,
              "/",
              results.length
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-transparent hover:border-[#2a655f]/20",
                onClick: goToPrev,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4 text-[#2a655f] dark:text-[#3a8a82]" })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Button,
              {
                variant: "ghost",
                size: "icon",
                className: "h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-transparent hover:border-[#2a655f]/20",
                onClick: goToNext,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 text-[#2a655f] dark:text-[#3a8a82]" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              variant: "ghost",
              size: "icon",
              className: "h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/20 transition-all border border-transparent hover:border-[#2a655f]/20 shrink-0",
              onClick: onClose,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-[#2a655f] dark:text-[#3a8a82]" })
            }
          )
        ] }),
        query && results.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-center text-sm text-muted-foreground py-2", children: app.lang === "ar" ? "لا توجد نتائج" : "No results found" }),
        results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 max-h-32 overflow-y-auto space-y-1", children: [
          results.slice(0, 10).map((msg, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              onClick: () => handleResultClick(index),
              className: cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200",
                currentIndex === index ? "bg-[#2a655f]/10 dark:bg-[#2a655f]/20 border border-[#2a655f]/30 shadow-sm" : "hover:bg-[#2a655f]/5 dark:hover:bg-[#2a655f]/10 border border-transparent hover:border-[#2a655f]/10"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(MessageCircle, { className: "h-3.5 w-3.5 text-[#2a655f] dark:text-[#3a8a82] shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm truncate flex-1 text-foreground", children: msg.content }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-muted-foreground shrink-0", children: new Date(msg.created_at).toLocaleTimeString(
                  app.lang === "ar" ? "ar-SA" : "en-US",
                  { hour: "2-digit", minute: "2-digit" }
                ) })
              ]
            },
            msg.id
          )),
          results.length > 10 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-center text-[#2a655f]/70 dark:text-[#3a8a82]/70 py-1", children: [
            "+ ",
            results.length - 10,
            " ",
            app.lang === "ar" ? "نتيجة إضافية" : "more results"
          ] })
        ] })
      ]
    }
  );
}
const AnimatedIcon = ({
  Icon,
  className = "",
  color = "text-white",
  delay = 0,
  size = "h-6 w-6"
}) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "relative inline-flex items-center justify-center",
      style: { animationDelay: `${delay}ms` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "animate-float-icon", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: cn(
          "transition-all duration-500",
          color,
          size,
          className
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -inset-2 rounded-full border-2 border-white/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" })
      ]
    }
  );
};
function VoiceCall({
  roomName,
  displayName,
  onEnd
}) {
  const app = useApp();
  const containerRef = reactExports.useRef(null);
  const scriptLoadedRef = reactExports.useRef(false);
  const [isMuted, setIsMuted] = reactExports.useState(false);
  const [isSpeaker, setIsSpeaker] = reactExports.useState(false);
  const [callDuration, setCallDuration] = reactExports.useState(0);
  reactExports.useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  reactExports.useEffect(() => {
    const loadJitsiScript = () => {
      if (scriptLoadedRef.current) return;
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initJitsi();
      };
      document.body.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };
    const initJitsi = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return;
      const domain = "meet.jit.si";
      const options = {
        roomName,
        width: "100%",
        height: "100%",
        parentNode: containerRef.current,
        userInfo: {
          displayName: displayName || (app.lang === "ar" ? "مستخدم" : "User")
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: true
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false,
          TOOLBAR_BUTTONS: ["microphone", "hangup"]
        }
      };
      const api = new window.JitsiMeetExternalAPI(domain, options);
      api.addEventListener("videoConferenceLeft", () => {
        onEnd();
      });
      window.jitsiApi = api;
    };
    const timer = setTimeout(() => {
      loadJitsiScript();
    }, 100);
    return () => {
      clearTimeout(timer);
      if (window.jitsiApi) {
        window.jitsiApi.dispose();
        window.jitsiApi = null;
      }
    };
  }, [roomName, displayName, app.lang, onEnd]);
  const styles = `
    @keyframes float-icon {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      25% { transform: translateY(-6px) rotate(3deg); }
      75% { transform: translateY(4px) rotate(-2deg); }
    }
    .animate-float-icon {
      animation: float-icon 3s ease-in-out infinite;
    }
    @keyframes ripple {
      0% { transform: scale(0.8); opacity: 1; }
      100% { transform: scale(2.5); opacity: 0; }
    }
    .animate-ripple {
      animation: ripple 2.5s ease-out infinite;
    }
    @keyframes pulse-ring {
      0%, 100% { transform: scale(1); opacity: 0.3; }
      50% { transform: scale(1.1); opacity: 0.6; }
    }
    .animate-pulse-ring {
      animation: pulse-ring 2s ease-in-out infinite;
    }
  `;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] bg-[#0d1f1d] dark:bg-[#0a1513] flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: styles }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 overflow-hidden pointer-events-none", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -top-40 -right-40 h-96 w-96 rounded-full bg-[#2a655f]/10 blur-3xl animate-float" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-[#3a8a82]/10 blur-3xl animate-float-delayed" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 opacity-[0.03]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 animate-pulse-slow", style: {
        backgroundImage: `
              radial-gradient(circle at 20% 50%, #2a655f 1px, transparent 1px),
              radial-gradient(circle at 80% 50%, #2a655f 1px, transparent 1px)
            `,
        backgroundSize: "60px 60px",
        backgroundPosition: "0 0, 30px 30px"
      } }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center justify-between p-4 border-b border-[#2a655f]/20", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-[#2a655f] flex items-center justify-center shadow-lg shadow-[#2a655f]/30", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: User, className: "h-5 w-5 text-white", color: "text-white", delay: 0, size: "h-5 w-5" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-white font-bold text-lg", children: displayName || (app.lang === "ar" ? "مستخدم" : "User") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm text-[#8ab4ae]", children: [
              app.lang === "ar" ? "مكالمة صوتية" : "Voice call",
              " • ",
              formatDuration(callDuration)
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: onEnd,
          className: "p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex-1 flex flex-col items-center justify-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex items-center justify-center pointer-events-none", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-[200px] w-[200px] rounded-full border-2 border-[#2a655f]/20 animate-pulse-ring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-[240px] w-[240px] rounded-full border border-[#2a655f]/10 animate-pulse-ring", style: { animationDelay: "1s" } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute h-[280px] w-[280px] rounded-full border border-[#2a655f]/5 animate-pulse-ring", style: { animationDelay: "2s" } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-40 w-40 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center text-white text-5xl font-bold shadow-2xl shadow-[#2a655f]/30 border-4 border-[#2a655f]/30 relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative z-10", children: displayName?.charAt(0).toUpperCase() || "?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 rounded-full bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 animate-pulse" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#8ab4ae] text-sm font-medium", children: isMuted ? app.lang === "ar" ? "🔇 مكتوم" : "🔇 Muted" : app.lang === "ar" ? "🎤 متصل" : "🎤 Connected" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[#2a655f]/30 mx-2", children: "|" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[#8ab4ae] text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3 inline mr-1" }),
          app.lang === "ar" ? "مشفر" : "Encrypted"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 flex items-center justify-center gap-6 p-8 border-t border-[#2a655f]/20 bg-[#0d1f1d]/50 backdrop-blur-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setIsMuted(!isMuted),
          className: cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2",
            isMuted ? "bg-red-500/20 border-red-500/30 hover:bg-red-500/30" : "bg-[#2a655f]/20 border-[#2a655f]/30 hover:bg-[#2a655f]/30"
          ),
          children: [
            isMuted ? /* @__PURE__ */ jsxRuntimeExports.jsx(MicOff, { className: "h-6 w-6 text-red-400" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-6 w-6 text-[#8ab4ae]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-6 text-[10px] text-white/40", children: app.lang === "ar" ? "كتم" : "Mute" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => setIsSpeaker(!isSpeaker),
          className: cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2",
            isSpeaker ? "bg-[#3a8a82]/30 border-[#3a8a82]/40 hover:bg-[#3a8a82]/40" : "bg-[#2a655f]/20 border-[#2a655f]/30 hover:bg-[#2a655f]/30"
          ),
          children: [
            isSpeaker ? /* @__PURE__ */ jsxRuntimeExports.jsx(Volume2, { className: "h-6 w-6 text-[#3a8a82]" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(VolumeX, { className: "h-6 w-6 text-[#8ab4ae]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-6 text-[10px] text-white/40", children: app.lang === "ar" ? "صوت" : "Speaker" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: onEnd,
          className: "h-16 w-16 rounded-2xl bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg shadow-red-500/30 border-2 border-red-400/30 relative group",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: PhoneOff, className: "h-8 w-8 text-white", color: "text-white", delay: 0, size: "h-8 w-8" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-6 text-[10px] text-white/40", children: app.lang === "ar" ? "إنهاء" : "End" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -inset-2 rounded-2xl bg-red-500/20 blur-xl animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          className: "h-14 w-14 rounded-2xl bg-[#2a655f]/20 border-[#2a655f]/30 hover:bg-[#2a655f]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 border-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatedIcon, { Icon: Sparkles, className: "h-6 w-6 text-[#8ab4ae]", color: "text-[#8ab4ae]", delay: 100, size: "h-6 w-6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-6 text-[10px] text-white/40", children: app.lang === "ar" ? "تأثيرات" : "Effects" })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 text-center text-xs text-[#2a655f]/40 pb-4 flex items-center justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "h-3 w-3" }),
      app.lang === "ar" ? "🔒 مكالمة صوتية مشفرة بتقنية Jitsi" : "🔒 Encrypted voice call powered by Jitsi"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, className: "hidden" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-8px) rotate(3deg); }
          75% { transform: translateY(6px) rotate(-2deg); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float 4s ease-in-out infinite 1s;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      ` })
  ] });
}
function VideoCall({
  roomName,
  displayName,
  onEnd
}) {
  const app = useApp();
  const containerRef = reactExports.useRef(null);
  const scriptLoadedRef = reactExports.useRef(false);
  reactExports.useEffect(() => {
    const loadJitsiScript = () => {
      if (scriptLoadedRef.current) return;
      const script = document.createElement("script");
      script.src = "https://meet.jit.si/external_api.js";
      script.async = true;
      script.onload = () => {
        scriptLoadedRef.current = true;
        initJitsi();
      };
      document.body.appendChild(script);
      return () => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    };
    const initJitsi = () => {
      if (!containerRef.current || !window.JitsiMeetExternalAPI) return;
      const domain = "meet.jit.si";
      const options = {
        roomName,
        width: "100%",
        height: "100%",
        parentNode: containerRef.current,
        userInfo: {
          displayName: displayName || (app.lang === "ar" ? "مستخدم" : "User")
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false
        },
        interfaceConfigOverwrite: {
          DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
          SHOW_CHROME_EXTENSION_BANNER: false
        }
      };
      const api = new window.JitsiMeetExternalAPI(domain, options);
      api.addEventListener("videoConferenceLeft", () => {
        onEnd();
      });
      window.jitsiApi = api;
    };
    const timer = setTimeout(() => {
      loadJitsiScript();
    }, 100);
    return () => {
      clearTimeout(timer);
      if (window.jitsiApi) {
        window.jitsiApi.dispose();
        window.jitsiApi = null;
      }
    };
  }, [roomName, displayName, app.lang, onEnd]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "fixed inset-0 z-[100] bg-[#0d1f1d] dark:bg-[#0a1513]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-0 left-0 right-0 z-20 p-4 bg-gradient-to-b from-black/60 to-transparent", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-10 rounded-full bg-[#2a655f] flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Video, { className: "h-5 w-5 text-white" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-white font-bold text-sm", children: app.lang === "ar" ? "مكالمة فيديو" : "Video Call" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-xs", children: displayName || (app.lang === "ar" ? "مستخدم" : "User") })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-full bg-emerald-400 animate-pulse" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/70 text-xs", children: app.lang === "ar" ? "متصل" : "Connected" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: onEnd,
        className: "absolute bottom-8 left-1/2 -translate-x-1/2 z-20 h-16 w-16 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all hover:scale-110 shadow-lg shadow-red-500/30 border-2 border-white/20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(PhoneOff, { className: "h-8 w-8 text-white" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -bottom-6 text-white/60 text-[10px] font-medium whitespace-nowrap", children: app.lang === "ar" ? "إنهاء" : "End" })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "absolute bottom-8 left-1/2 -translate-x-[calc(50%+80px)] z-20 h-12 w-12 rounded-full bg-[#2a655f]/80 hover:bg-[#2a655f] flex items-center justify-center transition-all hover:scale-110 border border-white/20 backdrop-blur-sm",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { className: "h-5 w-5 text-white" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        className: "absolute bottom-8 left-1/2 translate-x-[calc(50%+80px)] z-20 h-12 w-12 rounded-full bg-[#2a655f]/80 hover:bg-[#2a655f] flex items-center justify-center transition-all hover:scale-110 border border-white/20 backdrop-blur-sm",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "h-5 w-5 text-white" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: containerRef, className: "w-full h-full" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("style", { children: `
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      ` })
  ] });
}
function ChatMessages({
  userId,
  conversationId,
  otherUserId,
  className,
  onBack,
  hideHeader = false
}) {
  const app = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [replyTo, setReplyTo] = reactExports.useState(null);
  const [isSelecting, setIsSelecting] = reactExports.useState(false);
  const [selectedMessages, setSelectedMessages] = reactExports.useState([]);
  const [forwardTarget, setForwardTarget] = reactExports.useState(null);
  const [isSearchOpen, setIsSearchOpen] = reactExports.useState(false);
  const [isVoiceCall, setIsVoiceCall] = reactExports.useState(false);
  const [isVideoCall, setIsVideoCall] = reactExports.useState(false);
  const [callRoomName, setCallRoomName] = reactExports.useState("");
  const containerRef = reactExports.useRef(null);
  const {
    data: messagesData,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch
  } = useMessages(conversationId);
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();
  const deleteConversation = useDeleteConversation();
  const deleteMessageForEveryone = useDeleteMessageForEveryone();
  useForwardMessage();
  useMuteConversation();
  usePinConversation();
  const { data: userStatus } = useUserStatus(otherUserId);
  const isOnline = userStatus?.is_online || false;
  reactExports.useEffect(() => {
    console.log("🔍 User Status Debug:");
    console.log("  - isOnline:", isOnline);
    console.log("  - userStatus:", userStatus);
    console.log("  - otherUserId:", otherUserId);
  }, [isOnline, userStatus, otherUserId]);
  const sendTyping = useSendTypingIndicator(conversationId, userId);
  const {
    conversations,
    messages: messagesStore,
    addMessage,
    markAsRead: markAsReadInStore,
    deleteConversation: deleteFromStore,
    togglePinConversation,
    toggleMuteConversation,
    setReplyToMessage,
    setForwardedMessage
  } = useConversationStore();
  const [otherUser, setOtherUser] = reactExports.useState(null);
  const [isStore, setIsStore] = reactExports.useState(false);
  const [isMuted, setIsMuted] = reactExports.useState(false);
  const [isPinned, setIsPinned] = reactExports.useState(false);
  const [isArchived, setIsArchived] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", otherUserId).single();
      if (!error && data) {
        setOtherUser(data);
        setIsStore(!!data.store_name);
      }
    };
    fetchUser();
  }, [otherUserId]);
  reactExports.useEffect(() => {
    const conv = conversations.find((c) => c.id === conversationId);
    if (conv) {
      setIsMuted(
        conv.participant1_id === userId ? conv.is_muted_participant1 : conv.is_muted_participant2
      );
      setIsPinned(
        conv.participant1_id === userId ? !!conv.pinned_at_participant1 : !!conv.pinned_at_participant2
      );
      setIsArchived(
        conv.participant1_id === userId ? conv.is_archived_participant1 : conv.is_archived_participant2
      );
    }
  }, [conversations, conversationId, userId]);
  reactExports.useEffect(() => {
    if (conversationId && userId) {
      markAsRead.mutate(
        { conversationId, userId },
        {
          onSuccess: () => {
            markAsReadInStore(conversationId);
            queryClient.invalidateQueries({ queryKey: ["unread-count", userId] });
            queryClient.invalidateQueries({ queryKey: ["conversations", userId] });
          }
        }
      );
    }
  }, [conversationId, userId]);
  const messages = messagesData?.pages.flat() || [];
  const scrollToMessage = (messageId) => {
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
      }, 3e3);
    }
  };
  const handleVoiceCall = () => {
    const roomName = `voice-${conversationId}-${Date.now()}`;
    setCallRoomName(roomName);
    setIsVoiceCall(true);
  };
  const handleEndVoiceCall = () => {
    setIsVoiceCall(false);
    setCallRoomName("");
  };
  const handleVideoCall = () => {
    const roomName = `video-${conversationId}-${Date.now()}`;
    setCallRoomName(roomName);
    setIsVideoCall(true);
  };
  const handleEndVideoCall = () => {
    setIsVideoCall(false);
    setCallRoomName("");
  };
  const handleSendMessage = async (content, file, location) => {
    if (!content && !file && !location) return;
    try {
      await sendMessage.mutateAsync({
        receiverId: otherUserId,
        content: location ? `📍 ${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}` : content,
        file,
        type: location ? "location" : "text",
        reply_to_id: replyTo?.id,
        location: location || void 0
      });
      setReplyTo(null);
      setReplyToMessage(null);
    } catch (error) {
      console.error("❌ Error sending message:", error);
      toast.error(
        app.lang === "ar" ? "❌ فشل إرسال الرسالة" : "❌ Failed to send message"
      );
    }
  };
  const handleReply = (message) => {
    setReplyTo(message);
    setReplyToMessage(message);
  };
  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyToMessage(null);
  };
  const handleForward = (message) => {
    setForwardedMessage(message);
    toast.info(
      app.lang === "ar" ? "📤 ميزة إعادة التوجيه قيد التطوير" : "📤 Forward feature in development"
    );
  };
  const handleDeleteMessage = (messageId) => {
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
          }
        }
      );
    }
  };
  const handleMute = async () => {
    if (!userId || !conversationId) return;
    try {
      const { data: conv, error: fetchError } = await supabase.from("conversations").select("participant1_id, participant2_id, is_muted_participant1, is_muted_participant2").eq("id", conversationId).single();
      if (fetchError) throw fetchError;
      const isParticipant1 = conv.participant1_id === userId;
      const updateField = isParticipant1 ? "is_muted_participant1" : "is_muted_participant2";
      const currentValue = isParticipant1 ? conv.is_muted_participant1 : conv.is_muted_participant2;
      const newValue = !currentValue;
      await supabase.from("conversations").update({ [updateField]: newValue }).eq("id", conversationId);
      toggleMuteConversation(conversationId);
      toast.success(newValue ? app.lang === "ar" ? "🔇 تم كتم الإشعارات" : "🔇 Muted" : app.lang === "ar" ? "🔔 تم إلغاء الكتم" : "🔔 Unmuted");
      setIsMuted(newValue);
      refetch();
    } catch (error) {
      toast.error(app.lang === "ar" ? "❌ فشل تحديث الإشعارات" : "❌ Failed");
    }
  };
  const handlePin = async () => {
    if (!userId || !conversationId) return;
    try {
      const { data: conv, error: fetchError } = await supabase.from("conversations").select("participant1_id, participant2_id, pinned_at_participant1, pinned_at_participant2").eq("id", conversationId).single();
      if (fetchError) throw fetchError;
      const isParticipant1 = conv.participant1_id === userId;
      const updateField = isParticipant1 ? "pinned_at_participant1" : "pinned_at_participant2";
      const currentValue = isParticipant1 ? conv.pinned_at_participant1 : conv.pinned_at_participant2;
      const newValue = currentValue ? null : (/* @__PURE__ */ new Date()).toISOString();
      await supabase.from("conversations").update({ [updateField]: newValue }).eq("id", conversationId);
      togglePinConversation(conversationId);
      toast.success(newValue ? app.lang === "ar" ? "📌 تم التثبيت" : "📌 Pinned" : app.lang === "ar" ? "📌 تم إلغاء التثبيت" : "📌 Unpinned");
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
  const handleSelect = (messageId) => {
    setSelectedMessages((prev) => prev.includes(messageId) ? prev.filter((id) => id !== messageId) : [...prev, messageId]);
  };
  const handleClearSelection = () => {
    setSelectedMessages([]);
    setIsSelecting(false);
  };
  const handleTyping = (isTyping) => {
    sendTyping(isTyping);
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex flex-col items-center justify-center h-full bg-slate-50 dark:bg-slate-950", className), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-10 w-10 animate-spin text-[#2a655f]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-bold text-muted-foreground mt-3", children: app.lang === "ar" ? "جاري تحميل محادثتك الآمنة..." : "Loading secure chat..." })
    ] });
  }
  if (!conversationId) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center h-full p-8 text-center bg-slate-50 dark:bg-slate-950", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-3xl bg-[#2a655f]/10 border border-[#2a655f]/20 flex items-center justify-center mb-4 shadow-inner", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-4xl", children: "💬" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-slate-900 dark:text-white", children: app.lang === "ar" ? "اختر محادثة لبدء الدردشة" : "Select a conversation" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-2", children: app.lang === "ar" ? "تواصل بسلاسة وأمان مع المتاجر والبائعين" : "Connect smoothly and securely" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: containerRef,
      className: cn(
        "flex flex-col h-full bg-gradient-to-b from-slate-50 via-slate-100 to-slate-200 dark:from-slate-950 dark:via-[#112926]/30 dark:to-slate-950 relative overflow-hidden",
        className
      ),
      children: [
        isSearchOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(
          MessageSearch,
          {
            messages,
            onSearchResult: scrollToMessage,
            onClose: () => setIsSearchOpen(false)
          }
        ),
        !hideHeader && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          console.log("📤 Passing to ChatHeader:"),
          console.log("  - isOnline:", isOnline),
          console.log("  - userStatus:", userStatus),
          console.log("  - otherUserId:", otherUserId),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            ChatHeader,
            {
              user: {
                id: otherUserId,
                full_name: otherUser?.full_name || null,
                avatar_url: otherUser?.avatar_url || null,
                store_name: otherUser?.store_name || null,
                store_logo_url: otherUser?.store_logo_url || null,
                is_online: isOnline,
                last_seen_at: userStatus?.last_seen_at || null
              },
              conversationId,
              isStore,
              isMuted,
              isPinned,
              isArchived,
              onBack: onBack || (() => navigate({ to: "/messages" })),
              onMute: handleMute,
              onPin: handlePin,
              onArchive: handleArchive,
              onDelete: handleDeleteConversation,
              onSearch: () => setIsSearchOpen(true),
              onCall: handleVoiceCall,
              onVideoCall: handleVideoCall,
              onViewProfile: () => navigate({ to: "/profile" }),
              onViewStore: () => {
                if (isStore) {
                  navigate({ to: "/store/$id", params: { id: otherUserId } });
                }
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden p-2 sm:p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full w-full rounded-3xl overflow-hidden shadow-2xl border border-[#2a655f]/20 bg-white/95 dark:bg-[#1a2b28]/95 backdrop-blur-xl", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          MessageList,
          {
            messages,
            userId,
            conversationId,
            isLoading,
            isFetchingNextPage,
            hasNextPage,
            onLoadMore: () => fetchNextPage(),
            onReply: handleReply,
            onForward: handleForward,
            onDelete: handleDeleteMessage,
            onPin: () => {
            },
            onSelect: handleSelect,
            selectedMessages,
            isSelecting,
            maxHeight: "100%",
            showDateSeparators: true,
            showAvatar: true,
            className: "h-full"
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 bg-white/90 dark:bg-[#173d38]/90 backdrop-blur-md border-t border-[#2a655f]/20 shadow-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-4xl mx-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          ChatInput,
          {
            onSendMessage: handleSendMessage,
            onTyping: handleTyping,
            onRecordVoice: (audioBlob) => {
              toast.success(app.lang === "ar" ? "✅ تم تسجيل الصوت بنجاح" : "✅ Voice recorded");
            },
            onSendLocation: () => {
              toast.info(app.lang === "ar" ? "📍 تم إرسال الموقع" : "📍 Location shared");
            },
            isLoading: sendMessage.isPending,
            replyTo: replyTo ? {
              id: replyTo.id,
              content: replyTo.content,
              senderName: replyTo.sender_id === userId ? app.lang === "ar" ? "أنت" : "You" : otherUser?.store_name || otherUser?.full_name || (app.lang === "ar" ? "مستخدم" : "User")
            } : null,
            onCancelReply: handleCancelReply,
            maxLength: 2e3
          }
        ) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: selectedMessages.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
            className: "flex items-center justify-between px-6 py-3 bg-[#2a655f]/90 text-white backdrop-blur-md border-t border-emerald-400/30 shadow-2xl",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm font-bold", children: [
                selectedMessages.length,
                " ",
                app.lang === "ar" ? "عناصر محددة" : "selected"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "ghost",
                    size: "sm",
                    onClick: handleClearSelection,
                    className: "rounded-xl text-white hover:bg-white/10 font-semibold",
                    children: app.lang === "ar" ? "إلغاء" : "Cancel"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    variant: "destructive",
                    size: "sm",
                    className: "rounded-xl font-bold shadow-md",
                    onClick: () => {
                      selectedMessages.forEach((id) => {
                        deleteMessageForEveryone.mutate({ messageId: id });
                      });
                      handleClearSelection();
                    },
                    children: app.lang === "ar" ? "حذف للجميع" : "Delete"
                  }
                )
              ] })
            ]
          }
        ) }),
        isVoiceCall && /* @__PURE__ */ jsxRuntimeExports.jsx(
          VoiceCall,
          {
            roomName: callRoomName,
            displayName: otherUser?.full_name || otherUser?.store_name || "User",
            onEnd: handleEndVoiceCall
          }
        ),
        isVideoCall && /* @__PURE__ */ jsxRuntimeExports.jsx(
          VideoCall,
          {
            roomName: callRoomName,
            displayName: otherUser?.full_name || otherUser?.store_name || "User",
            onEnd: handleEndVideoCall
          }
        )
      ]
    }
  );
}
export {
  ChatHeader as C,
  ChatMessages as a
};
