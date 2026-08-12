// src/components/Header.tsx

import { cn } from "@/lib/utils";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Search, Heart, ShoppingBag, MessageCircle, User, Moon, Sun, Menu, 
  ChevronDown, MapPin, Globe, LayoutGrid, Store, Package, Tag, Building2,
  Coffee, Utensils, Wrench, Home as HomeIcon, Shirt, Smartphone, Watch, Gift,
  Flower2, BookOpen, Dumbbell, Gamepad2, Palette, BadgePercent, Ticket, X,
  Footprints, TrendingUp, Star, Clock, Shield, Award, Zap, Mail, Phone,
  Twitter, Instagram, Facebook, Youtube, Send, Check, Bell, BellOff, MoreVertical, Trash2,
  Settings, Volume2, VolumeX, LayoutDashboard, LogOut, LogIn, UserPlus, House, Camera,
  CheckCircle, XCircle, Megaphone, Sparkles, Calendar, ChevronLeft, ChevronRight,
  Compass,
  type LucideIcon,
} from "lucide-react";
import { NotificationStatus } from "@/components/NotificationStatus";
import { useState, useEffect, useRef } from "react";
import { useApp, useT, type Lang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCategories, useGovernorates, useAnnouncements, useFavorites, useProfile } from "@/lib/queries";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NOTIFICATION_ICONS } from "@/lib/icons";
import {
  useUserNotifications,
  useMarkNotificationReadV2,
  useMarkAllNotificationsReadV2
} from "@/lib/queries";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { NOTIFICATION_CONFIG, NOTIFICATION_TYPES, NotificationType } from "@/types/notificationTypes";
import { useUnreadCount } from "@/lib/hooks/useConversation";
import { useRealtimeConversations, useNotificationSound } from "@/lib/hooks/useRealtimeConversations";
import { useQueryClient } from "@tanstack/react-query";
import { memo, useMemo, useCallback } from "react";
import { useProfileWithUpdate } from "@/lib/hooks/useProfileWithUpdate";
import { getCategoryIcon } from "@/lib/categoryIcons";
import { useCart } from "@/lib/hooks/useCart";
const ICON_MAP: Record<string, any> = {
  'clock': Clock,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
  'store': Store,
  'package': Package,
  'sparkles': Sparkles,
  'megaphone': Megaphone,
  'gift': Gift,
  'trending-up': TrendingUp,
  'calendar': Calendar,
  'globe': Globe,
  'settings': Settings,
  'shopping-bag': ShoppingBag,
  'shield': Shield,
  'bell': Bell,
};

const getNotificationConfig = (type: string) => {
  return NOTIFICATION_CONFIG[type as NotificationType] || NOTIFICATION_CONFIG[NOTIFICATION_TYPES.SYSTEM];
};

// ✅ أيقونة متحركة ملونة
const AnimatedIcon = ({ 
  Icon, 
  className = "",
  color = "text-[#2a655f]",
  delay = 0,
}: { 
  Icon: LucideIcon, 
  className?: string,
  color?: string,
  delay?: number,
}) => {
  return (
    <div 
      className="relative inline-flex items-center justify-center"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="animate-float-icon group-hover:animate-pulse-slow">
        <Icon className={cn(
          "transition-all duration-500 group-hover:scale-110 group-hover:rotate-12",
          color,
          className
        )} />
      </div>
      {/* ✅ تموجات ملونة حول الأيقونة */}
      <span className="absolute -inset-2 rounded-full border-2 border-[#2a655f]/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute -inset-4 rounded-full border-2 border-[#3a8a82]/10 animate-ripple delay-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <span className="absolute -inset-6 rounded-full border-2 border-[#4a9f95]/5 animate-ripple delay-1500 opacity-0 group-hover:opacity-100 transition-opacity duration-900" />
    </div>
  );
};

// ✅ Mega Menu Component مع أيقونات متحركة ملونة
function MegaMenu({ categories }: { categories: any[] }) {
  const app = useApp();
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
  };

  // التحقق الذكي من العروض والهدايا من قاعدة البيانات حصرياً
  const isPromoCategory = (c: any) => {
    const slug = c.slug?.toLowerCase() || "";
    const nameAr = c.name_ar || "";
    const nameEn = c.name_en?.toLowerCase() || "";
    return (
      slug.includes("offer") || slug.includes("deal") || slug.includes("gift") ||
      nameAr.includes("عروض") || nameAr.includes("خصم") || nameAr.includes("هدايا") ||
      nameEn.includes("offers") || nameEn.includes("deals") || nameEn.includes("gifts")
    );
  };

  const mainCategories = categories.filter(c => !isPromoCategory(c));
  const promoCategories = categories.filter(c => isPromoCategory(c));

  // ✅ ألوان منسجمة مع هوية النظام لأيقونات القائمة الرئيسية
  const iconColors = [
    "text-[#2a655f]", "text-[#3a8a82]", "text-[#1a4f4a]", "text-emerald-600",
    "text-[#2a655f]", "text-[#3a8a82]", "text-[#1a4f4a]", "text-emerald-700",
    "text-[#2a655f]", "text-[#3a8a82]", "text-[#1a4f4a]", "text-emerald-600"
  ];

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <style>{`
        @keyframes special-dance {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.15) rotate(-6deg); }
          50% { transform: scale(1.05) rotate(6deg); }
          75% { transform: scale(1.15) rotate(-3deg); }
        }
        .animate-special-dance {
          animation: special-dance 1.5s ease-in-out infinite;
        }
      `}</style>

      <button
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-[#2a655f]/15 transition-all duration-300 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/30 dark:to-[#3a8a82]/20 border border-[#2a655f]/30 dark:border-[#2a655f]/40 group shadow-sm hover:shadow-md hover:shadow-[#2a655f]/20 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LayoutGrid className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-110 transition-transform" />
        <span className="hidden md:inline font-semibold text-[#2a655f] dark:text-[#3a8a82]">{t("categories")}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-[#2a655f] dark:text-[#3a8a82] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full start-0 mt-2 w-[900px] max-w-[95vw] bg-card rounded-2xl shadow-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30 p-6 grid grid-cols-4 gap-6 animate-in slide-in-from-top-5 duration-200 z-50 bg-gradient-to-br from-white via-emerald-50/20 to-[#2a655f]/10 dark:from-gray-950 dark:via-[#173d38]/20 dark:to-[#2a655f]/20 max-h-[80vh] overflow-y-auto">
          
          {/* التصنيفات الأساسية تقرأ بالكامل من قاعدة البيانات */}
          <div className="col-span-3 grid grid-cols-3 gap-x-4 gap-y-1.5">
            {mainCategories.map((c, index) => {
              const Icon = getCategoryIcon(c.icon);
              const color = iconColors[index % iconColors.length];
              const customBg = c.accent_from && c.accent_to && c.accent_from !== '#000000'
                ? `linear-gradient(135deg, ${c.accent_from}, ${c.accent_to})`
                : undefined;

              return (
                <Link
                  key={c.id || index}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/25 transition-all duration-300 border border-transparent hover:border-[#2a655f]/30"
                >
                  <div 
                    style={{ background: customBg }}
                    className={`h-10 w-10 rounded-xl ${!customBg ? 'bg-gradient-to-br from-[#2a655f]/15 to-[#3a8a82]/15 border border-[#2a655f]/20' : 'text-white'} group-hover:scale-105 transition-all duration-300 flex items-center justify-center shadow-sm overflow-hidden`}
                  >
                    {c.image_url ? (
                      <img src={c.image_url} alt="" className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      <AnimatedIcon 
                        Icon={Icon} 
                        className="h-4 w-4" 
                        color={customBg ? "text-white" : color}
                        delay={index * 50}
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition truncate" dir={app.lang === "ar" ? "rtl" : "ltr"}>
                      {app.lang === "ar" ? c.name_ar : (c.name_en || c.name_ar)}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {app.lang === "ar" ? "تصفح المنتجات" : "Browse products"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* قسم العروض والهدايا المميز (يرقص بألوان السستم المتناسقة) */}
          <div className="col-span-1 space-y-3 border-s border-[#2a655f]/15 dark:border-[#2a655f]/30 ps-4">
            <div className="text-[10px] uppercase tracking-wider text-[#2a655f] dark:text-[#3a8a82] font-extrabold flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82]" />
              {app.lang === "ar" ? "عروض خاصة" : "Special Offers"}
            </div>

            {promoCategories.map((c) => {
              const Icon = getCategoryIcon(c.icon);
              return (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#2a655f]/15 via-[#3a8a82]/10 to-[#2a655f]/15 hover:from-[#2a655f]/25 hover:to-[#3a8a82]/20 transition-all duration-300 border border-[#2a655f]/30 shadow-sm"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center text-white shadow-md animate-special-dance shrink-0 overflow-hidden">
                    {c.image_url ? (
                      <img src={c.image_url} alt="" className="h-full w-full object-cover rounded-xl" />
                    ) : (
                      <AnimatedIcon Icon={Icon} className="h-4 w-4 text-white" color="text-white" delay={0} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] truncate" dir={app.lang === "ar" ? "rtl" : "ltr"}>
                      {app.lang === "ar" ? c.name_ar : (c.name_en || c.name_ar)}
                    </div>
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold animate-pulse">
                      {app.lang === "ar" ? "خصومات تصل إلى 70%" : "Up to 70% off"}
                    </div>
                  </div>
                </Link>
              );
            })}
            
            <Link
              to="/categories"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-[#2a655f]/10 hover:bg-[#2a655f]/20 transition-all duration-300 font-medium text-sm text-[#2a655f] dark:text-[#3a8a82] mt-2 border border-[#2a655f]/20 dark:border-[#2a655f]/30 group cursor-pointer"
            >
              {t("view_all")}
              <ChevronDown className="h-3.5 w-3.5 -rotate-90 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      )}
    </div>
  );
}

export const Header = memo(function Header() {
  // ====== ✅ جميع الـ Hooks ======
  const location = useLocation();
  const t = useT();
  const app = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isRTL = app.lang === 'ar';
  const [q, setQ] = useState("");
  const [gov, setGov] = useState("all");
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // ===== ✅ عدد الرسائل غير المقروءة =====
  const { data: unreadCount = 0 } = useUnreadCount();
  
  // ===== ✅ تفعيل التحديث الفوري للرسائل =====
  useRealtimeConversations(app.user?.id);

  // ===== ✅ إدارة الصوت والإشعارات =====
  const { isEnabled: soundEnabled, toggleSound } = useNotificationSound();

  // ===== ✅ Hooks الإشعارات V2 =====
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: notifications = [], refetch: refetchNotifications } = useUserNotifications(app.user?.id, { limit: 50 });
  const markRead = useMarkNotificationReadV2();
  const markAllRead = useMarkAllNotificationsReadV2();
  const unreadNotificationsCount = notifications.filter((n: any) => !n.is_read).length;

  // ✅ استخدام useMemo لمنع إعادة الحساب
  const isAdmin = useMemo(() => app.roles?.includes("admin") ?? false, [app.roles]);
  const isSeller = useMemo(() => app.roles?.includes("seller") ?? false, [app.roles]);
  const isAuthLoading = useMemo(() => app.authLoading, [app.authLoading]);
  
  const { data: dbCategories = [] } = useCategories();
  const { data: govs = [] } = useGovernorates();
  const { data: announcements = [] } = useAnnouncements();
  const categories = (dbCategories || []).filter((c: any) => c.active !== false);
  
  // ✅ ✅ ✅ استخدام Hook واحد موحد ✅ ✅ ✅
  const { profile } = useProfileWithUpdate();
  
  // ✅ جلب عدد المفضلة
  const { data: favorites = [] } = useFavorites(app.user?.id);
  const favoritesCount = favorites.length;
  const { data: cart } = useCart(app.user?.id);
  const cartItemsCount = cart?.items?.length || 0;

  // ===== ✅ ✅ ✅ البحث التلقائي عند تغيير المحافظة =====
  useEffect(() => {
    if (gov !== "all") {
      const query = q.trim();
      navigate({
        to: "/search",
        search: { 
          q: query || undefined, 
          gov: gov 
        },
      });
    }
  }, [gov]);

  // ===== ✅ دالة تعيين الرسائل كمقروءة =====
  const markMessagesAsRead = useCallback(async () => {
    if (!app.user) return;
    try {
      const { error: convError } = await supabase
        .from("conversations")
        .update({
          unread_count_participant1: 0,
          unread_count_participant2: 0,
        })
        .or(`participant1_id.eq.${app.user.id},participant2_id.eq.${app.user.id}`);

      if (convError) throw convError;

      const { error: msgError } = await supabase
        .from("messages")
        .update({ read_at: new Date().toISOString() })
        .eq("receiver_id", app.user.id)
        .is("read_at", null);

      if (msgError) throw msgError;

      await queryClient.invalidateQueries({ queryKey: ["unread-count", app.user.id] });
      await queryClient.invalidateQueries({ queryKey: ["conversations", app.user.id] });
      
    } catch (error) {
      console.error("❌ Error marking messages as read:", error);
    }
  }, [app.user, queryClient]);

  // ===== ✅ دالة البحث الذكي =====
  const doSearch = useCallback(() => {
    const query = q.trim();
    const govParam = gov === "all" ? undefined : gov;
    
    if (query || govParam) {
      navigate({
        to: "/search",
        search: { 
          q: query || undefined, 
          gov: govParam 
        },
      });
    } else {
      toast.info(app.lang === "ar" ? "🔍 اكتب كلمة للبحث" : "🔍 Type a search term");
    }
  }, [q, gov, navigate, app.lang]);

  // ===== ✅ دالة الذهاب للرئيسية =====
  const goHome = useCallback(() => {
    navigate({ to: "/" });
  }, [navigate]);

  // ===== useEffect للـ Scroll =====
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ====== شرط إخفاء الهيدر ======
  const isChatPage = 
    location.pathname.startsWith('/messages_/') ||
    location.pathname.startsWith('/messages/') ||
    location.pathname.includes('/messages_') ||
    location.pathname.includes('/messages/$userId');
  
  if (isChatPage) {
    return null;
  }

  // ===== ✅ دوال الإشعارات V2 =====
// ✅ فقط إزالة التنقل عند الضغط على الإشعار - مع بقاء "تحديد كمقروء" و "قراءة الكل"
// ✅ ✅ ✅ دالة التعامل مع ضغط الإشعار - مع التنقل إلى الرابط
// ✅ ✅ ✅ دالة التعامل مع ضغط الإشعار - مع التنقل إلى الرابط
async function handleNotificationClick(notification: any) {
  // ✅ تحديث الإشعار كمقروء
  if (!notification.is_read) {
    try {
      await markRead.mutateAsync({
        notificationId: notification.id,
        userId: app.user!.id
      });
      await refetchNotifications();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }
  
  // ✅ ✅ ✅ التنقل إلى الرابط (تم إعادة تفعيله)
  if (notification.link_url) {
    // إذا كان الرابط داخلي (يبدأ بـ /) استخدم navigate
    if (notification.link_url.startsWith('/')) {
      navigate({ to: notification.link_url });
    } else {
      // رابط خارجي
      window.open(notification.link_url, '_blank');
    }
    setNotificationsOpen(false);
  } else {
    // إذا ما في رابط، فقط نغلق النافذة
    setNotificationsOpen(false);
  }
}

  async function handleMarkAsRead(notificationId: string, e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await markRead.mutateAsync({
        notificationId: notificationId,
        userId: app.user!.id
      });
      await refetchNotifications();
      toast.success(app.lang === "ar" ? "تم تحديد الإشعار كمقروء" : "Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }

  async function handleMarkAllAsRead() {
    try {
      await markAllRead.mutateAsync({
        userId: app.user!.id
      });
      await refetchNotifications();
      toast.success(app.lang === "ar" ? "تم تحديد الكل كمقروء" : "All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }

  function formatTime(date: string) {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (app.lang === "ar") {
      if (diffMins < 1) return "الآن";
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      if (diffDays < 7) return `منذ ${diffDays} يوم`;
      return then.toLocaleDateString("ar-SA", { day: "numeric", month: "short" });
    } else {
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return then.toLocaleDateString("en-US", { day: "numeric", month: "short" });
    }
  }

  return (
    <TooltipProvider>
      <header className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
          ? 'bg-background/95 backdrop-blur-xl border-b border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-xl'
          : 'bg-gradient-to-b from-[#2a655f]/5 via-background/50 to-transparent border-b border-transparent'
        }`}>


        <div className="mx-auto max-w-7xl px-3 py-2.5 flex items-center gap-2 overflow-visible">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition shrink-0">
                    <Menu className="h-4.5 w-4.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{app.lang === "ar" ? "القائمة" : "Menu"}</p>
                </TooltipContent>
              </Tooltip>
            </SheetTrigger>
            <SheetContent side={app.lang === "ar" ? "right" : "left"} className="w-80">
              <SheetTitle className="text-lg font-bold flex items-center gap-2">
                <LayoutGrid className="h-5 w-5 text-[#2a655f] dark:text-[#3a8a82]" />
                {t("categories")}
              </SheetTitle>
              <div className="mt-4 grid gap-1">
                {categories.map((c: any) => (
                  <Link
                    key={c.id}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition group"
                  >
                    <span>{app.lang === "ar" ? c.name_ar : c.name_en}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 opacity-50 group-hover:opacity-100 transition" />
                  </Link>
                ))}
              </div>
              <div className="mt-6 grid gap-2 text-sm">
                <Link to="/ai" className="rounded-lg px-3 py-3 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 flex items-center gap-2 transition group">
                  <Sparkles className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" /> {t("ai_insights")}
                </Link>
                <Link to="/dashboard" className="rounded-lg px-3 py-3 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition">{t("dashboard")}</Link>
                <Link to="/reports" className="rounded-lg px-3 py-3 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition">{t("reports")}</Link>
                <Link to="/messages" className="rounded-lg px-3 py-3 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition">{t("messages")}</Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* Home Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={goHome}
                className="flex items-center gap-2 shrink-0 group cursor-pointer"
              >
                <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <House className="h-4.5 w-4.5" />
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="font-black text-lg tracking-tight bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent group-hover:from-[#1a4f4a] group-hover:to-[#2a655f] transition">
                    {t("brand")}
                  </span>
                  <span className="text-[9px] text-muted-foreground tracking-wider">
                    {t("tagline")}
                  </span>
                </div>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>{app.lang === "ar" ? "الرئيسية" : "Home"}</p>
            </TooltipContent>
          </Tooltip>

          {/* Mega Menu */}
          <div className="hidden md:block">
            <MegaMenu categories={categories} />
          </div>

          {/* Desktop Search */}
          <div className="flex-1 max-w-3xl mx-2 hidden lg:flex items-center gap-1.5">
            <div className="relative flex-1 min-w-[160px]">
              <Search className={`absolute inset-y-0 my-auto start-3 h-4 w-4 transition-colors duration-300 ${searchFocused ? 'text-[#2a655f] dark:text-[#3a8a82]' : 'text-muted-foreground'}`} />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder={t("search_placeholder")}
                className={`w-full h-10 ps-9 pe-3 bg-muted/50 border-2 rounded-xl transition-all duration-300 focus:outline-none text-sm ${
                  searchFocused
                    ? 'border-[#2a655f]/60 bg-card shadow-lg shadow-[#2a655f]/20 dark:shadow-[#2a655f]/30'
                    : 'border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#2a655f]/40'
                }`}
              />
            </div>
            
            <button
              onClick={doSearch}
              className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 gap-1 shrink-0 min-w-[100px] rounded-xl border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 hover:border-[#2a655f]/40 transition group text-sm px-3">
                      <MapPin className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-110 transition-transform" />
                      <span className="text-xs max-w-[70px] truncate">
                        {gov === "all"
                          ? t("all_governorates")
                          : (govs.find((g) => g.slug === gov)?.[app.lang === "ar" ? "name_ar" : "name_en"] || t("all_governorates"))}
                      </span>
                      <ChevronDown className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{app.lang === "ar" ? "تصفية حسب الموقع" : "Filter by location"}</p>
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="max-h-80 overflow-auto rounded-xl p-1 border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-xl">
                <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 cursor-pointer flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {t("all_governorates")}
                  {gov === "all" && <Check className="h-4 w-4 ms-auto text-[#2a655f]" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {govs.map((g) => (
                  <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 cursor-pointer flex items-center gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {app.lang === "ar" ? g.name_ar : g.name_en}
                    {gov === g.slug && <Check className="h-4 w-4 ms-auto text-[#2a655f]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tablet Search */}
          <div className="flex-1 max-w-lg mx-1.5 hidden md:flex lg:hidden items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder={t("search_placeholder")}
                className="w-full h-10 ps-9 pe-3 bg-muted/50 border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 rounded-xl focus:border-[#2a655f]/60 focus:bg-card focus:shadow-lg focus:outline-none transition-all text-sm"
              />
            </div>
            
            <button
              onClick={doSearch}
              className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 shrink-0 rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 flex items-center justify-center group relative">
                  <MapPin className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-110 transition-transform" />
                  {gov !== "all" && (
                    <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-[#2a655f] ring-2 ring-background animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-80 overflow-auto rounded-xl p-1 border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-xl">
                <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 cursor-pointer flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {t("all_governorates")}
                  {gov === "all" && <Check className="h-4 w-4 ms-auto text-[#2a655f]" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {govs.map((g) => (
                  <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 cursor-pointer flex items-center gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {app.lang === "ar" ? g.name_ar : g.name_en}
                    {gov === g.slug && <Check className="h-4 w-4 ms-auto text-[#2a655f]" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions - ❌ تم إزالة زر الحجوزات من هنا */}
          <div className="ms-auto flex items-center gap-0.5 shrink-0">
            {/* Language */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition group shrink-0">
                      <Globe className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl p-1 border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-xl">
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Language</DropdownMenuLabel>
                    {(["ar", "en"] as Lang[]).map((l) => (
                      <DropdownMenuItem key={l} onClick={() => app.setLang(l)} className="rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 cursor-pointer">
                        {l === "ar" ? "العربية" : "English"} {app.lang === l && "✓"}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{app.lang === "ar" ? "تغيير اللغة" : "Change language"}</p>
              </TooltipContent>
            </Tooltip>

            {/* Sound toggle */}
            {app.user && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={toggleSound} 
                    className="h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition group shrink-0"
                  >
                    {soundEnabled ? (
                      <Volume2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    ) : (
                      <VolumeX className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>
                    {soundEnabled 
                      ? (app.lang === "ar" ? "🔔 الصوت مفعل" : "🔔 Sound on")
                      : (app.lang === "ar" ? "🔇 الصوت معطل" : "🔇 Sound off")}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Theme */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={app.toggleTheme} className="h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition group shrink-0">
                  {app.theme === "dark" ? <Sun className="h-4 w-4 group-hover:rotate-90 transition-transform" /> : <Moon className="h-4 w-4 group-hover:-rotate-90 transition-transform" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{app.theme === "dark" ? (app.lang === "ar" ? "الوضع النهاري" : "Light mode") : (app.lang === "ar" ? "الوضع الليلي" : "Dark mode")}</p>
              </TooltipContent>
            </Tooltip>

          {/* Messages */}
<Tooltip>
  <TooltipTrigger asChild>
    <Link 
      to="/messages" 
      className="hidden sm:block relative group shrink-0"
      onClick={() => {
        if (unreadCount > 0) {
          markMessagesAsRead();
        }
      }}
    >
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition relative"
      >
        <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform text-[#2a655f] dark:text-[#3a8a82]" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold text-white border-2 border-background animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #2a655f, #3a8a82)',
              boxShadow: '0 0 20px rgba(42, 101, 95, 0.5)'
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>
    </Link>
  </TooltipTrigger>
  <TooltipContent side="bottom" className="bg-[#2a655f] text-white border-[#3a8a82]">
    <p>
      {app.lang === "ar" ? "الرسائل" : "Messages"}
      {unreadCount > 0 && ` (${unreadCount} ${app.lang === "ar" ? "جديدة" : "new"})`}
    </p>
  </TooltipContent>
</Tooltip>

{/* Notifications Dialog - High Contrast & Luxury Version */}
{app.user && (
  <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
    <Tooltip>
      <TooltipTrigger asChild>
        <DialogTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 group relative shrink-0 cursor-pointer"
          >
            <Bell className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-110 transition-transform duration-300" />
            
            {unreadNotificationsCount > 0 && (
              <Badge 
                className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold text-white border-2 border-background animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #2a655f, #3a8a82)',
                  boxShadow: '0 0 20px rgba(42, 101, 95, 0.5)'
                }}
              >
                {unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount}
              </Badge>
            )}
          </Button>
        </DialogTrigger>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-[#2a655f] text-white border-[#3a8a82]">
        <p>{app.lang === "ar" ? "الإشعارات" : "Notifications"}</p>
      </TooltipContent>
    </Tooltip>

    <DialogContent className="max-w-md w-[95vw] rounded-[32px] p-0 overflow-hidden border border-[#2a655f]/50 dark:border-emerald-500/40 shadow-[0_25px_60px_rgba(0,0,0,0.4)] bg-white dark:bg-slate-950 backdrop-blur-2xl animate-in fade-in-50 zoom-in-95 duration-300 [&>button]:hidden">
      
      <style>{`
        @keyframes icon-dance-glow {
          0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 2px rgba(52,211,153,0.5)); }
          50% { transform: scale(1.2) rotate(-8deg); filter: drop-shadow(0 0 8px rgba(52,211,153,0.9)); }
        }
        .animate-icon-dance {
          animation: icon-dance-glow 2s ease-in-out infinite;
        }
      `}</style>

      {/* HEADER - بدون زر X الافتراضي تماماً */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2a655f]/15 via-[#3a8a82]/15 to-[#2a655f]/15 dark:from-[#173d38]/80 dark:to-slate-900 border-b border-[#2a655f]/30 dark:border-[#2a655f]/50 p-4.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 animate-icon-dance">
                <Bell className="h-5 w-5 text-white" />
              </div>
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-emerald-500 px-1.5 text-[10px] font-black text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md">
                  {unreadNotificationsCount}
                </span>
              )}
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900 dark:text-white tracking-wide">
                {app.lang === "ar" ? "الإشعارات" : "Notifications"}
              </DialogTitle>
              <p className="text-xs text-slate-600 dark:text-emerald-300/90 font-bold mt-0.5">
                {unreadNotificationsCount > 0
                  ? app.lang === "ar"
                    ? `${unreadNotificationsCount} إشعار غير مقروء`
                    : `${unreadNotificationsCount} unread`
                  : app.lang === "ar"
                  ? "كل الإشعارات مقروءة"
                  : "All caught up"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadNotificationsCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-black gap-1.5 rounded-xl bg-[#2a655f]/10 hover:bg-[#2a655f]/20 dark:bg-[#2a655f]/30 dark:hover:bg-[#2a655f]/40 text-[#2a655f] dark:text-emerald-300 transition-all cursor-pointer border border-[#2a655f]/30"
                onClick={handleMarkAllAsRead}
                disabled={markAllRead.isPending}
              >
                {markAllRead.isPending ? (
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#2a655f] border-t-transparent" />
                ) : (
                  <Check className="h-3.5 w-3.5 animate-icon-dance" />
                )}
                {app.lang === "ar" ? "تحديد الكل" : "Mark all read"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* LIST */}
      <div className="max-h-[60vh] overflow-y-auto p-3 space-y-2.5 custom-scrollbar bg-slate-50/50 dark:bg-slate-950/50">
        {notifications.length === 0 ? (
          <div className="py-16 text-center">
            <div className="h-20 w-20 rounded-3xl bg-[#2a655f]/10 border border-[#2a655f]/30 flex items-center justify-center mx-auto mb-4 animate-icon-dance">
              <BellOff className="h-10 w-10 text-[#2a655f] dark:text-emerald-400" />
            </div>
            <p className="text-base font-black text-slate-900 dark:text-white">
              {app.lang === "ar" ? "لا توجد إشعارات حالياً" : "No notifications"}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 font-semibold">
              {app.lang === "ar"
                ? "ستظهر إشعاراتك وتحديثاتك هنا فور وصولها"
                : "Notifications will appear here when received"}
            </p>
          </div>
        ) : (
          notifications.map((notification: any) => {
            const isUnread = !notification.is_read;
            const config = getNotificationConfig(notification.type);
            const Icon = ICON_MAP[config.icon] || Bell;

            return (
              <div
                key={notification.id}
                className={`group relative rounded-2xl transition-all duration-300 border ${
                  isUnread
                    ? "bg-[#2a655f]/10 dark:bg-[#2a655f]/25 border-[#2a655f]/40 dark:border-emerald-500/50 shadow-md"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-[#2a655f]/40"
                }`}
              >
                <div 
                  className="flex items-start gap-3.5 p-3.5 cursor-pointer" 
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex-shrink-0">
                    {notification.image_url ? (
                      <div className="relative">
                        <img
                          src={notification.image_url}
                          alt=""
                          className="h-12 w-12 rounded-2xl object-cover border-2 border-[#2a655f]/40 shadow-sm"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        {isUnread && (
                          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                        )}
                      </div>
                    ) : (
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-[#2a655f]/30 shadow-sm bg-[#2a655f]/15 dark:bg-[#2a655f]/30 text-[#2a655f] dark:text-emerald-300`}>
                        <Icon className="h-5 w-5 animate-icon-dance" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${isUnread ? "font-black text-slate-950 dark:text-white" : "font-bold text-slate-900 dark:text-slate-200"}`}>
                          {notification.title_ar || notification.title_en || "إشعار"}
                        </p>
                        <p className={`text-xs mt-1 line-clamp-2 ${isUnread ? "text-slate-800 dark:text-slate-200 font-semibold" : "text-slate-600 dark:text-slate-400 font-medium"}`}>
                          {notification.body_ar || notification.body_en || notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1 font-bold">
                            <Clock className="h-3 w-3 text-[#2a655f] dark:text-emerald-400" />
                            {formatTime(notification.created_at)}
                          </span>
                          {notification.type && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#2a655f]/15 text-[#2a655f] dark:text-emerald-300 font-extrabold border border-[#2a655f]/30">
                              {isRTL ? config.ar : config.en}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-1">
                        {isUnread && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-xl bg-[#2a655f]/10 hover:bg-[#2a655f]/20 text-[#2a655f] dark:text-emerald-300 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-[#2a655f]/30"
                            onClick={(e) => handleMarkAsRead(notification.id, e)}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl p-1.5 min-w-[170px] border border-[#2a655f]/40 shadow-xl bg-white dark:bg-slate-900">
                            {isUnread && (
                              <DropdownMenuItem
                                className="rounded-xl text-xs font-bold cursor-pointer gap-2.5 py-2 hover:bg-[#2a655f]/15 text-slate-900 dark:text-slate-100"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id, e);
                                }}
                              >
                                <Check className="h-4 w-4 text-[#2a655f]" />
                                {app.lang === "ar" ? "تحديد كمقروء" : "Mark as read"}
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuItem
                              className="rounded-xl text-xs font-bold cursor-pointer gap-2.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-500/10"
                              onClick={async (e) => {
                                e.stopPropagation();
                                try {
                                  await supabase
                                    .from('notifications')
                                    .delete()
                                    .eq('id', notification.id);
                                  await refetchNotifications();
                                  toast.success(app.lang === "ar" ? "تم حذف الإشعار" : "Notification deleted");
                                } catch (error) {
                                  console.error('Error deleting notification:', error);
                                  toast.error(app.lang === "ar" ? "حدث خطأ أثناء الحذف" : "Error deleting notification");
                                }
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                              {app.lang === "ar" ? "حذف" : "Delete"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* FOOTER */}
      {notifications.length > 0 && (
        <div className="sticky bottom-0 bg-white dark:bg-slate-950 border-t border-[#2a655f]/30 dark:border-[#2a655f]/50 p-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
            {notifications.length} {app.lang === "ar" ? "إشعار" : "notifications"}
            {unreadNotificationsCount > 0 && ` · ${unreadNotificationsCount} ${app.lang === "ar" ? "غير مقروء" : "unread"}`}
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="text-xs font-bold rounded-xl text-[#2a655f] dark:text-emerald-300 hover:bg-[#2a655f]/15 transition-all cursor-pointer border border-[#2a655f]/30"
            onClick={() => setNotificationsOpen(false)}
          >
            {app.lang === "ar" ? "إغلاق" : "Close"}
          </Button>
        </div>
      )}
    </DialogContent>
  </Dialog>
)}

            {/* ❌ تم إزالة زر الحجوزات من هنا - موجود فقط في منيو الحساب */}

{/* Favorites */}
<Tooltip>
  <TooltipTrigger asChild>
    <Link to="/favorites" className="relative group shrink-0">
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition group"
      >
        <Heart className="h-4 w-4 group-hover:scale-110 transition-transform text-[#2a655f] dark:text-[#3a8a82] group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82]" />
        {favoritesCount > 0 && (
          <Badge 
            className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold text-white border-2 border-background animate-pulse"
            style={{
              background: 'linear-gradient(135deg, #2a655f, #3a8a82)',
              boxShadow: '0 0 20px rgba(42, 101, 95, 0.5)'
            }}
          >
            {favoritesCount > 99 ? '99+' : favoritesCount}
          </Badge>
        )}
      </Button>
    </Link>
  </TooltipTrigger>
  <TooltipContent side="bottom" className="bg-[#2a655f] text-white border-[#3a8a82]">
    <p>
      {app.lang === "ar" ? "المفضلة" : "Favorites"}
      {favoritesCount > 0 && ` (${favoritesCount})`}
    </p>
  </TooltipContent>
</Tooltip>
            {/* Cart */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/cart" className="relative group shrink-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition">
                    <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] bg-[#2a655f] text-white border-2 border-background">
                        {cartItemsCount > 99 ? '99+' : cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{app.lang === "ar" ? "السلة" : "Cart"}</p>
              </TooltipContent>
            </Tooltip>

          {/* User Menu - Ultimate Luxury Version */}
  <Tooltip>
    <TooltipTrigger asChild>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-[#2a655f]/20 dark:hover:bg-[#2a655f]/30 transition-all duration-300 group relative shrink-0 border border-[#2a655f]/30 shadow-[0_0_15px_rgba(42,101,95,0.15)] hover:shadow-[0_0_20px_rgba(52,211,153,0.3)] cursor-pointer overflow-hidden p-0">
            
            {/* لمعان خفيف عند مرور الماوس */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10" />
            
            {/* إذا كان المستخدم مسجل دخول وله صورة شخصية، تظهر صورته بالدائرة الخارجية مباشرة */}
            {app.user && profile?.avatar_url ? (
              <div className="h-full w-full rounded-2xl overflow-hidden relative">
                <img 
                  src={profile.avatar_url} 
                  alt={app.user.name} 
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            ) : (
              <User className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 relative z-10 animate-icon-dance" />
            )}
            
            {app.user && (
              <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background animate-ping z-20" />
            )}
            {app.user && (
              <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background z-20 shadow-[0_0_8px_rgba(16,185,129,1)]" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 rounded-[28px] p-0 border border-[#2a655f]/30 dark:border-[#2a655f]/40 shadow-[0_20px_50px_rgba(23,61,56,0.3)] overflow-hidden bg-gradient-to-b from-white via-emerald-50/20 to-white dark:from-slate-950 dark:via-[#173d38]/30 dark:to-slate-950 backdrop-blur-2xl animate-in fade-in-50 zoom-in-95 duration-300">
          
          <style>{`
            @keyframes icon-dance-glow {
              0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 2px rgba(52,211,153,0.5)); }
              50% { transform: scale(1.2) rotate(-8deg); filter: drop-shadow(0 0 8px rgba(52,211,153,0.9)); }
            }
            .animate-icon-dance {
              animation: icon-dance-glow 2s ease-in-out infinite;
            }

            @keyframes pulse-slow {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.05); }
            }
            .animate-pulse-slow {
              animation: pulse-slow 4s ease-in-out infinite;
            }
          `}</style>

          {app.user ? (
            <>
              {/* رأس المنيو - كارد فاخر مع توهج متحرك */}
              <div className="bg-gradient-to-br from-[#173d38]/30 via-[#2a655f]/20 to-[#3a8a82]/20 dark:from-[#173d38]/60 dark:via-[#2a655f]/40 dark:to-slate-900 p-5 border-b border-[#2a655f]/30 relative overflow-hidden">
                
                {/* دوائر ضوئية خلفية نابضة */}
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-emerald-400/20 blur-2xl animate-pulse-slow pointer-events-none" />
                <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-[#3a8a82]/20 blur-2xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

                <div className="flex items-center gap-4 relative z-10">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#2a655f]/40 overflow-hidden flex-shrink-0 ring-4 ring-white/60 dark:ring-slate-800/80 transform hover:scale-105 transition-transform duration-300">
                    {profile?.avatar_url ? (
                      <img 
                        src={profile.avatar_url} 
                        alt={app.user.name} 
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-white font-black drop-shadow-md">
                        {app.user.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-black text-base text-slate-900 dark:text-white truncate drop-shadow-sm">
                        {app.user.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground truncate font-semibold mt-0.5 tracking-wide" dir="ltr">
                      {profile?.phone || app.user.phone || (app.lang === 'ar' ? "رقم غير متاح" : "No phone")}
                    </p>
                  </div>
                  
                  <Badge variant="outline" className="text-[10px] border-emerald-400/60 text-emerald-600 dark:text-emerald-300 bg-emerald-500/15 flex-shrink-0 font-black px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                    {isAdmin ? (app.lang === 'ar' ? '⭐ أدمن' : '⭐ Admin') : 
                     isSeller ? (app.lang === 'ar' ? '🛍️ بائع' : '🛍️ Seller') : 
                     (app.lang === 'ar' ? '👤 عميل' : '👤 Customer')}
                  </Badge>
                </div>
                
                <div className="mt-4 pt-3 border-t border-[#2a655f]/25 flex items-center justify-between relative z-10">
                  <Link 
                    to="/settings" 
                    className="text-xs text-[#2a655f] dark:text-[#3a8a82] hover:text-emerald-500 flex items-center gap-1.5 font-bold transition-colors group/link"
                  >
                    <div className="h-6 w-6 rounded-xl bg-[#2a655f]/15 flex items-center justify-center group-hover/link:bg-[#2a655f]/30 group-hover/link:scale-110 transition-all shadow-inner">
                      <Camera className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#3a8a82] animate-icon-dance" />
                    </div>
                    {profile?.avatar_url 
                      ? (app.lang === "ar" ? "تغيير الصورة الشخصية" : "Change photo")
                      : (app.lang === "ar" ? "إضافة صورة شخصية" : "Add photo")
                    }
                  </Link>
                  <span className="text-[10px] text-muted-foreground font-bold bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded-full">
                    {app.lang === "ar" ? "عضو منذ" : "Since"} {new Date(app.user.created_at || Date.now()).getFullYear()}
                  </span>
                </div>
                
                {app.user.address && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-muted-foreground font-medium relative z-10">
                    <MapPin className="h-3.5 w-3.5 text-[#2a655f] flex-shrink-0 animate-bounce" />
                    <span className="truncate">{app.user.address}</span>
                  </div>
                )}
              </div>

              {/* القوائم والأزرار الداخلية مع ألوان السستم حصرياً وبدون برتقالي */}
              <div className="p-2.5 space-y-1.5">
                
                {/* طلباتي */}
                <DropdownMenuItem asChild className="rounded-2xl focus:bg-[#2a655f]/20 hover:bg-[#2a655f]/15 dark:focus:bg-[#2a655f]/30 dark:hover:bg-[#2a655f]/30 cursor-pointer py-3 px-3.5 group transition-all duration-300">
                  <Link to="/orders" className="flex items-center gap-3.5 w-full">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm border border-[#2a655f]/20">
                      <Package className="h-5 w-5 text-[#2a655f] dark:text-[#3a8a82] animate-icon-dance" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#2a655f] dark:group-hover:text-emerald-300 transition-colors">
                        {app.lang === "ar" ? "📦 طلباتي الحالية والسابقة" : "📦 My Orders"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {app.lang === "ar" ? "تتبع حالة الطلبات والشحنات" : "Track orders & shipments"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </DropdownMenuItem>

           

                {/* الإعدادات الشخصية */}
                <DropdownMenuItem asChild className="rounded-2xl focus:bg-[#2a655f]/20 hover:bg-[#2a655f]/15 dark:focus:bg-[#2a655f]/30 dark:hover:bg-[#2a655f]/30 cursor-pointer py-3 px-3.5 group transition-all duration-300">
                  <Link to="/settings" className="flex items-center gap-3.5 w-full">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-sm border border-[#2a655f]/20">
                      <Settings className="h-5 w-5 text-[#2a655f] dark:text-[#3a8a82] animate-icon-dance" style={{ animationDelay: '0.8s' }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#2a655f] dark:group-hover:text-emerald-300 transition-colors">
                        {app.lang === "ar" ? "⚙️ الإعدادات الشخصية" : "⚙️ Personal Settings"}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {app.lang === "ar" ? "تعديل الملف الشخصي وكلمة المرور" : "Edit profile & security"}
                      </p>
                    </div>
                    <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator className="my-2 bg-[#2a655f]/20" />

                {/* زر تسجيل الخروج متناسق مع تدرجات السستم */}
                <DropdownMenuItem onClick={app.logout} className="rounded-2xl focus:bg-[#2a655f]/20 hover:bg-[#2a655f]/20 dark:focus:bg-[#173d38]/50 dark:hover:bg-[#173d38]/50 cursor-pointer py-3 px-3.5 group transition-all duration-300">
                  <div className="flex items-center gap-3.5 w-full">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#2a655f]/30 to-[#173d38]/40 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 shadow-sm border border-[#2a655f]/40">
                      <LogOut className="h-5 w-5 text-[#2a655f] dark:text-emerald-300 animate-icon-dance" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black text-[#2a655f] dark:text-emerald-300 group-hover:text-emerald-600 transition-colors">
                        {t("logout")}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {app.lang === "ar" ? "تسجيل الخروج الآمن من الحساب" : "Sign out securely"}
                      </p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>

              {/* تذييل المنيو */}
              <div className="px-5 py-3 bg-slate-50/90 dark:bg-slate-900/60 border-t border-[#2a655f]/25">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <span>
                    {app.lang === "ar" ? "الحالة" : "Status"}: <strong className="text-emerald-600 dark:text-emerald-400">آمن ومحمي</strong>
                  </span>
                  <span className="flex items-center gap-1.5 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-black">{app.lang === "ar" ? "متصل الآن" : "Online"}</span>
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* حالة عدم تسجيل الدخول */}
              <div className="p-7 text-center border-b border-[#2a655f]/20 bg-gradient-to-b from-[#2a655f]/10 via-emerald-50/10 to-transparent">
                <div className="h-18 w-18 rounded-3xl bg-[#2a655f]/15 border-2 border-[#2a655f]/30 flex items-center justify-center mx-auto mb-3.5 shadow-xl animate-icon-dance">
                  <User className="h-9 w-9 text-[#2a655f]" />
                </div>
                <p className="font-black text-lg text-slate-900 dark:text-white">
                  {app.lang === "ar" ? "أهلاً بك في عالم التسوق" : "Welcome to Market"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {app.lang === "ar" ? "سجل الدخول لاستعراض الميزات الفاخرة" : "Sign in to access luxury features"}
                </p>
              </div>
              
              <div className="p-3 space-y-2">
                <DropdownMenuItem asChild className="rounded-2xl focus:bg-[#2a655f]/20 hover:bg-[#2a655f]/15 dark:focus:bg-[#2a655f]/30 dark:hover:bg-[#2a655f]/30 cursor-pointer py-3.5 px-4 transition-all group">
                  <Link to="/auth/$mode" params={{ mode: "login" }} className="flex items-center gap-3.5 w-full">
                    <div className="h-10 w-10 rounded-2xl bg-[#2a655f]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <LogIn className="h-5 w-5 text-[#2a655f] animate-icon-dance" />
                    </div>
                    <span className="font-black text-sm text-slate-800 dark:text-slate-100">{t("login")}</span>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="rounded-2xl focus:bg-[#2a655f]/20 hover:bg-[#2a655f]/15 dark:focus:bg-[#2a655f]/30 dark:hover:bg-[#2a655f]/30 cursor-pointer py-3.5 px-4 transition-all group">
                  <Link to="/auth/$mode" params={{ mode: "register" }} className="flex items-center gap-3.5 w-full">
                    <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserPlus className="h-5 w-5 text-emerald-600 dark:text-emerald-400 animate-icon-dance" style={{ animationDelay: '0.5s' }} />
                    </div>
                    <span className="font-black text-sm text-slate-800 dark:text-slate-100">{t("register")}</span>
                  </Link>
                </DropdownMenuItem>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="rounded-2xl bg-[#173d38] text-white border border-[#2a655f]/50 px-4 py-2 shadow-xl font-bold">
      <p>{app.user ? (app.lang === "ar" ? "حسابي الفاخر" : "My Account") : (app.lang === "ar" ? "تسجيل الدخول" : "Login")}</p>
    </TooltipContent>
  </Tooltip>

            {/* Role Button */}
            {(() => {
              if (isAuthLoading) {
                return <div className="ms-1 px-2 py-0.5 rounded-lg bg-[#2a655f]/20 animate-pulse h-5 w-16" />;
              }

              if (app.user) {
                if (isAdmin) {
                  return (
                    <Link 
                      to="/admin" 
                      className="ms-1 px-1.5 py-0.5 rounded-lg text-[7px] xs:text-[10px] sm:text-[10px] font-semibold bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-sm shadow-[#2a655f]/20 hover:shadow-md hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-0.5 xs:gap-1 border border-[#2a655f]/20 shrink-0"
                    >
                      <LayoutDashboard className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" />
                      {app.lang === "ar" ? "لوحة الأدمن" : "Admin"}
                    </Link>
                  );
                }
                if (isSeller) {
                  return (
                    <Link 
                      to="/dashboard" 
                      className="ms-1 px-1.5 py-0.5 rounded-lg text-[7px] xs:text-[10px] sm:text-[10px] font-semibold bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-sm shadow-[#2a655f]/20 hover:shadow-md hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-0.5 xs:gap-1 border border-[#2a655f]/20 shrink-0"
                    >
                      <Store className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" />
                      {app.lang === "ar" ? "لوحة البائع" : "Seller"}
                    </Link>
                  );
                }
                return (
                  <Link 
                    to="/dashboard" 
                    className="ms-1 px-1.5 py-0.5 rounded-lg text-[7px] xs:text-[10px] sm:text-[10px] font-semibold bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-sm shadow-[#2a655f]/20 hover:shadow-md hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-0.5 xs:gap-1 border border-[#2a655f]/20 shrink-0"
                  >
                    <Store className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" />
                    {app.lang === "ar" ? "أنشئ متجرك" : "List Business"}
                  </Link>
                );
              }
              
              return (
                <Link 
                  to="/auth/$mode" 
                  params={{ mode: "register" }} 
                  className="ms-1 px-1.5 py-0.5 rounded-lg text-[7px] xs:text-[10px] sm:text-[10px] font-semibold bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-sm shadow-[#2a655f]/20 hover:shadow-md hover:shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-0.5 xs:gap-1 border border-[#2a655f]/20 shrink-0"
                >
                  <Store className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" />
                  {app.lang === "ar" ? "أنشئ متجرك" : "List Business"}
                </Link>
              );
            })()}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-3 pb-2.5 flex gap-1.5">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder={t("search_placeholder")}
              className="ps-9 h-10 w-full bg-muted/50 border-[#2a655f]/20 dark:border-[#2a655f]/30 rounded-xl focus-visible:border-[#2a655f]/60 transition text-sm"
            />
          </div>
          
          <Button 
            onClick={doSearch}
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Search className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 w-10 shrink-0 rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 flex items-center justify-center group relative">
                <MapPin className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-110 transition-transform" />
                {gov !== "all" && (
                  <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-[#2a655f] ring-2 ring-background animate-pulse" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 overflow-auto rounded-xl p-1 border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-xl">
              <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 cursor-pointer flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {t("all_governorates")}
                {gov === "all" && <Check className="h-4 w-4 ms-auto text-[#2a655f]" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {govs.map((g) => (
                <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 cursor-pointer flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {app.lang === "ar" ? g.name_ar : g.name_en}
                  {gov === g.slug && <Check className="h-4 w-4 ms-auto text-[#2a655f]" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

{/* ✅ Category Strip - عرض جميع التصنيفات بالكامل من قاعدة البيانات مع تحكم يدوي وحركة مستمرة */}
<div className="relative border-t border-[#2a655f]/30 bg-gradient-to-r from-[#173d38] via-[#2a655f] to-[#173d38] backdrop-blur-md overflow-hidden py-3 shadow-2xl">
  
  {/* خلفية ضوئية متحركة ونابضة */}
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/20 via-transparent to-transparent animate-pulse pointer-events-none" />
  
  {/* خط إشعاعي متحرك في الأعلى */}
  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-200 to-transparent shadow-[0_0_12px_rgba(244,114,182,0.6)]" />

  <style>{`
    @keyframes marquee-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: flex;
      width: max-content;
      animation: marquee-scroll 35s linear infinite;
      will-change: transform;
    }
    .marquee-track.paused {
      animation-play-state: paused !important;
    }
    
    /* لمعان متحرك (Shimmer) للعروض */
    @keyframes shimmerAnimation {
      100% { transform: translateX(200%); }
    }
    .animate-shimmer {
      animation: shimmerAnimation 2s infinite;
    }

    /* حركة مميزة جداً لأيقونة العروض لتلفت انتباه اليوزر بقوة */
    @keyframes offer-icon-dance {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.25) rotate(-10deg); }
      50% { transform: scale(1.1) rotate(10deg); }
      75% { transform: scale(1.25) rotate(-5deg); }
    }
    .offer-icon-special {
      animation: offer-icon-dance 1.2s ease-in-out infinite;
    }

    /* حركة عادية لباقي الأيقونات */
    @keyframes float-icon {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-4px) rotate(2deg); }
    }
    .float-icon {
      animation: float-icon 3s ease-in-out infinite;
    }

    /* تصميم شريط التمرير السفلي للتحكم اليدوي */
    .category-scrollbar::-webkit-scrollbar {
      height: 4px;
    }
    .category-scrollbar::-webkit-scrollbar-track {
      background: rgba(42, 101, 95, 0.2);
      border-radius: 10px;
      margin: 0 16px;
    }
    .category-scrollbar::-webkit-scrollbar-thumb {
      background: #f9a8d4;
      border-radius: 10px;
    }
    .category-scrollbar::-webkit-scrollbar-thumb:hover {
      background: #fbcfe8;
    }
  `}</style>

  {/* حاوية التحكم اليدوي والتمرير الأفقي مع إيقاف الحركة عند المرور بالماوس */}
  <div 
    className="mx-auto max-w-7xl px-4 overflow-x-auto category-scrollbar select-none pb-2" 
    dir="ltr"
    onMouseEnter={(e) => {
      const trackElem = e.currentTarget.querySelector(".marquee-track");
      if (trackElem) trackElem.classList.add("paused");
    }}
    onMouseLeave={(e) => {
      const trackElem = e.currentTarget.querySelector(".marquee-track");
      if (trackElem) trackElem.classList.remove("paused");
    }}
  >
    
    <div className="marquee-track gap-3 py-1.5">
      
      {/* عرض جميع التصنيفات بالكامل من قاعدة البيانات وتكرارها مرتين لضمان استمرار السكرول */}
      {[...categories, ...categories].map((c: any, index: number) => {
        const Icon = getCategoryIcon(c.icon);
        const totalCategories = categories.length;
        const originalIndex = index % totalCategories;
        const isRtl = app.lang === "ar";
        
        // التحقق الذكي من العروض بناءً على الـ slug أو الأسماء القادمة من قاعدة البيانات حصرياً
        const isOffer = c.slug === "offers" || c.slug === "deals" || c.name_ar?.includes("عروض") || c.name_en?.toLowerCase().includes("offers") || c.name_en?.toLowerCase().includes("deals");
        
        if (isOffer) {
          return (
            <Link
              key={`${c.id}-${index}`}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative shrink-0 flex items-center gap-3 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-300 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 text-pink-800 shadow-[0_0_25px_rgba(244,114,182,0.3)] hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden border-2 border-pink-200 animate-pulse"
            >
              {/* ✨ لمعان متحرك لا يتوقف */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
              
              {/* أيقونة العروض بحركة مميزة جداً وخاصة */}
              <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-pink-300/30 border-2 border-pink-300 shadow-lg overflow-hidden offer-icon-special">
                {c.image_url ? (
                  <img src={c.image_url} alt="" className="h-full w-full object-cover rounded-full" />
                ) : (
                  <Icon className="h-4 w-4 text-pink-600" />
                )}
              </div>

              {/* الاسم من قاعدة البيانات حصرياً */}
              <div className="flex flex-col relative z-10">
                <span className="whitespace-nowrap font-black text-sm tracking-wide text-pink-800 drop-shadow-md" dir={isRtl ? "rtl" : "ltr"}>
                  {isRtl ? c.name_ar : (c.name_en || c.name_ar)}
                </span>
                <span className="text-[9px] text-pink-500 font-extrabold uppercase tracking-widest animate-bounce">
                  {isRtl ? "🌸 عروض رائعة" : "🌸 SPECIAL OFFERS"}
                </span>
              </div>

              <span className="relative z-10 ml-2 text-[9px] uppercase bg-white text-pink-500 px-2.5 py-1 rounded-full font-black tracking-wider shadow-lg border border-pink-200 animate-bounce">
                {isRtl ? "💕 تخفيضات" : "💕 SALE"}
              </span>
            </Link>
          );
        }
        
        // الأقسام العادية (جميعها بدون استثناء)
        return (
          <Link
            key={`${c.id}-${index}`}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="group relative shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-medium text-xs transition-all duration-300 bg-white/10 hover:bg-emerald-500/20 text-white shadow-lg border border-white/15 hover:border-emerald-400 hover:scale-105 hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            
            <div className="relative flex items-center justify-center h-7 w-7 rounded-full bg-black/30 border border-white/25 shadow-inner overflow-hidden group-hover:scale-110 transition-transform float-icon">
              {c.image_url ? (
                <img src={c.image_url} alt="" className="h-full w-full object-cover rounded-full" />
              ) : (
                <Icon className="h-3.5 w-3.5 text-emerald-300 group-hover:text-white transition-colors" />
              )}
            </div>
            
            <span className="whitespace-nowrap font-semibold tracking-wide text-white/95 group-hover:text-white" dir={isRtl ? "rtl" : "ltr"}>
              {isRtl ? c.name_ar : (c.name_en || c.name_ar)}
            </span>
            
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,1)]" />
          </Link>
        );
      })}
      
    </div>
  </div>
</div>
      </header>
      {/* ❌❌❌ تم إزالة <Footer /> من هنا ❌❌❌ */}
    </TooltipProvider>
  );
});