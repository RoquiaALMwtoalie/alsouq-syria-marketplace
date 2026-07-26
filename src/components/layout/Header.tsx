// src/components/Header.tsx
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  Search, Heart, ShoppingBag, MessageCircle, User, Moon, Sun, Menu, 
  ChevronDown, MapPin, Globe, LayoutGrid, Store, Package, Tag, Building2,
  Coffee, Utensils, Wrench, Home as HomeIcon, Shirt, Smartphone, Watch, Gift,
  Flower2, BookOpen, Dumbbell, Gamepad2, Palette, BadgePercent, Ticket, X,
  Footprints, TrendingUp, Star, Clock, Shield, Award, Zap, Mail, Phone,
  Twitter, Instagram, Facebook, Youtube, Send, Check, Bell, BellOff, MoreVertical, Trash2,
  Settings, Volume2, VolumeX, LayoutDashboard, LogOut, LogIn, UserPlus, House, Camera,
  CheckCircle, XCircle, Megaphone, Sparkles, Calendar,
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
// ✅ استيراد دالة الأيقونات من قاعدة البيانات
import { getCategoryIcon } from "@/lib/categoryIcons";

// ✅ خريطة الأيقونات للإشعارات
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

// ✅ دالة للحصول على إعدادات الإشعار
const getNotificationConfig = (type: string) => {
  return NOTIFICATION_CONFIG[type as NotificationType] || NOTIFICATION_CONFIG[NOTIFICATION_TYPES.SYSTEM];
};

// ✅ Mega Menu Component - يستخدم الأيقونات من قاعدة البيانات
// ✅ Mega Menu Component - الجزء المصحح
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

  const mainCategories = categories.filter(c => c.slug !== 'offers' && c.slug !== 'gifts');
  const promoCategories = categories.filter(c => c.slug === 'offers' || c.slug === 'gifts');

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm hover:bg-primary/10 transition-all duration-200 bg-gradient-to-r from-blue-50/50 to-blue-100/30 dark:from-blue-950/30 dark:to-blue-900/20 border border-blue-200/30 dark:border-blue-800/30 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <LayoutGrid className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
        <span className="hidden md:inline font-semibold text-blue-700 dark:text-blue-300">{t("categories")}</span>
        <ChevronDown className={`h-3.5 w-3.5 text-blue-600 dark:text-blue-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full start-0 mt-2 w-[900px] bg-card rounded-2xl shadow-2xl border border-blue-200/30 dark:border-blue-800/30 p-6 grid grid-cols-4 gap-6 animate-in slide-in-from-top-5 duration-200 z-50 bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-950 dark:to-blue-950/20">
          <div className="col-span-3 grid grid-cols-3 gap-x-4 gap-y-1">
            {mainCategories.map((c) => {
              const Icon = getCategoryIcon(c.icon);
              return (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group border border-transparent hover:border-blue-200/30 dark:hover:border-blue-800/30"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/5 group-hover:from-blue-500/20 group-hover:to-blue-600/10 transition flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                      {app.lang === "ar" ? c.name_ar : c.name_en}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {app.lang === "ar" ? "تصفح المنتجات" : "Browse products"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="col-span-1 space-y-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
              {app.lang === "ar" ? "عروض خاصة" : "Special Offers"}
            </div>
            {promoCategories.map((c) => {
              const Icon = getCategoryIcon(c.icon);
              return (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-red-500/10 to-orange-500/10 hover:from-red-500/20 hover:to-orange-500/20 transition border border-red-500/10 group"
                >
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{app.lang === "ar" ? c.name_ar : c.name_en}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {app.lang === "ar" ? "خصومات تصل إلى 70%" : "Up to 70% off"}
                    </div>
                  </div>
                </Link>
              );
            })}
            
            {/* ✅ ✅ ✅ زر عرض الكل - ياخذ لصفحة التصنيفات ✅ ✅ ✅ */}
            <Link
              to="/categories"   // ✅ الآن يروح لصفحة جميع التصنيفات
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500/10 to-blue-600/10 hover:from-blue-500/20 hover:to-blue-600/20 transition font-medium text-sm text-blue-600 dark:text-blue-400 mt-2 border border-blue-200/30 dark:border-blue-800/30 group"
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
  // ====== ✅ جميع الـ Hooks أولاً ======
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

  // ============================================================
  // ✅ ✅ ✅ البحث التلقائي عند تغيير المحافظة ✅ ✅ ✅
  // ============================================================
  useEffect(() => {
    // ✅ إذا كانت المحافظة مختلفة عن "all"
    if (gov !== "all") {
      const query = q.trim();
      // ✅ ننفذ البحث تلقائياً (مع كلمة البحث إن وجدت)
      navigate({
        to: "/search",
        search: { 
          q: query || undefined, 
          gov: gov 
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gov]); // ✅ فقط عند تغيير gov

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
  async function handleNotificationClick(notification: any) {
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
    
    if (notification.link_url) {
      window.location.href = notification.link_url;
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
          ? 'bg-background/95 backdrop-blur-xl border-b border-blue-200/30 dark:border-blue-800/30 shadow-xl'
          : 'bg-gradient-to-b from-blue-50/30 via-background/50 to-transparent border-b border-transparent'
        }`}>
        {/* Announcement Bar */}
        {announcements.length > 0 && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white py-2 overflow-hidden border-b border-white/10">
            <div className="mx-auto max-w-7xl px-4">
              <div className="flex items-center justify-center gap-6 animate-marquee whitespace-nowrap">
                {announcements.map((announcement, index) => (
                  <span key={announcement.id} className="text-sm font-medium flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white/60 animate-pulse" />
                    {app.lang === "ar" ? announcement.text_ar : (announcement.text_en || announcement.text_ar)}
                    {announcement.link_url && (
                      <Link
                        to={announcement.link_url}
                        className="text-white/80 hover:text-white underline-offset-2 hover:underline transition text-xs font-semibold"
                      >
                        {app.lang === "ar" ? "اعرف أكثر" : "Learn more"}
                      </Link>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-100%); }
          }
          .animate-marquee {
            animation: marquee 20s linear infinite;
            display: flex;
            gap: 40px;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        <div className="mx-auto max-w-7xl px-3 py-2.5 flex items-center gap-2 overflow-visible">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition shrink-0">
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
                <LayoutGrid className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                {t("categories")}
              </SheetTitle>
              <div className="mt-4 grid gap-1">
                {categories.map((c: any) => (
                  <Link
                    key={c.id}
                    to="/category/$slug"
                    params={{ slug: c.slug }}
                    className="flex items-center justify-between rounded-lg px-3 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition group"
                  >
                    <span>{app.lang === "ar" ? c.name_ar : c.name_en}</span>
                    <ChevronDown className="h-4 w-4 -rotate-90 opacity-50 group-hover:opacity-100 transition" />
                  </Link>
                ))}
              </div>
              <div className="mt-6 grid gap-2 text-sm">
                <Link to="/ai" className="rounded-lg px-3 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 flex items-center gap-2 transition group">
                  <Sparkles className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" /> {t("ai_insights")}
                </Link>
                <Link to="/dashboard" className="rounded-lg px-3 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition">{t("dashboard")}</Link>
                <Link to="/reports" className="rounded-lg px-3 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition">{t("reports")}</Link>
                <Link to="/messages" className="rounded-lg px-3 py-3 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition">{t("messages")}</Link>
              </div>
            </SheetContent>
          </Sheet>

          {/* ✅ Home Button مع Tooltip */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={goHome}
                className="flex items-center gap-2 shrink-0 group cursor-pointer"
              >
                <div className="grid place-items-center h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <House className="h-4.5 w-4.5" />
                </div>
                <div className="hidden sm:flex flex-col leading-none">
                  <span className="font-black text-lg tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
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

          {/* ✅ Desktop Search */}
          <div className="flex-1 max-w-3xl mx-2 hidden lg:flex items-center gap-1.5">
            <div className="relative flex-1 min-w-[160px]">
              <Search className={`absolute inset-y-0 my-auto start-3 h-4 w-4 transition-colors duration-300 ${searchFocused ? 'text-blue-600 dark:text-blue-400' : 'text-muted-foreground'}`} />
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
                    ? 'border-blue-400/60 bg-card shadow-lg shadow-blue-200/30 dark:shadow-blue-900/20'
                    : 'border-blue-200/30 dark:border-blue-800/30 hover:border-blue-300/50'
                }`}
              />
            </div>
            
            <button
              onClick={doSearch}
              className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>

            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="h-10 gap-1 shrink-0 min-w-[100px] rounded-xl border-blue-200/30 dark:border-blue-800/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:border-blue-400/50 transition group text-sm px-3">
                      <MapPin className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
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
              <DropdownMenuContent align="end" className="max-h-80 overflow-auto rounded-xl p-1 border-blue-200/30 dark:border-blue-800/30 shadow-xl">
                <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {t("all_governorates")}
                  {gov === "all" && <Check className="h-4 w-4 ms-auto text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {govs.map((g) => (
                  <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {app.lang === "ar" ? g.name_ar : g.name_en}
                    {gov === g.slug && <Check className="h-4 w-4 ms-auto text-blue-600" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ✅ Tablet Search */}
          <div className="flex-1 max-w-lg mx-1.5 hidden md:flex lg:hidden items-center gap-1.5">
            <div className="relative flex-1">
              <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && doSearch()}
                placeholder={t("search_placeholder")}
                className="w-full h-10 ps-9 pe-3 bg-muted/50 border-2 border-blue-200/30 dark:border-blue-800/30 rounded-xl focus:border-blue-400/60 focus:bg-card focus:shadow-lg focus:outline-none transition-all text-sm"
              />
            </div>
            
            <button
              onClick={doSearch}
              className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 shrink-0 rounded-xl border-2 border-blue-200/30 dark:border-blue-800/30 hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 flex items-center justify-center group relative">
                  <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                  {gov !== "all" && (
                    <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-background animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="max-h-80 overflow-auto rounded-xl p-1 border-blue-200/30 dark:border-blue-800/30 shadow-xl">
                <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center gap-2 text-sm">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  {t("all_governorates")}
                  {gov === "all" && <Check className="h-4 w-4 ms-auto text-blue-600" />}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {govs.map((g) => (
                  <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center gap-2 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {app.lang === "ar" ? g.name_ar : g.name_en}
                    {gov === g.slug && <Check className="h-4 w-4 ms-auto text-blue-600" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ✅ Actions */}
          <div className="ms-auto flex items-center gap-0.5 shrink-0">
            {/* Language */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group shrink-0">
                      <Globe className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl p-1 border-blue-200/30 dark:border-blue-800/30 shadow-xl">
                    <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">Language</DropdownMenuLabel>
                    {(["ar", "en"] as Lang[]).map((l) => (
                      <DropdownMenuItem key={l} onClick={() => app.setLang(l)} className="rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer">
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
                    className="h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group shrink-0"
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
                <Button variant="ghost" size="icon" onClick={app.toggleTheme} className="h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group shrink-0">
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
                    className="h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition relative"
                  >
                    <MessageCircle className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold text-white border-2 border-background animate-pulse"
                        style={{
                          background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                          boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                        }}
                      >
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>
                  {app.lang === "ar" ? "الرسائل" : "Messages"}
                  {unreadCount > 0 && ` (${unreadCount} ${app.lang === "ar" ? "جديدة" : "new"})`}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Notifications Dialog */}
            {app.user && (
              <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group shrink-0">
                        <Bell className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        {unreadNotificationsCount > 0 && (
                          <span className="absolute -top-1 -right-1 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse border-2 border-background">
                            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>{app.lang === "ar" ? "الإشعارات" : "Notifications"}</p>
                  </TooltipContent>
                </Tooltip>

                <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900">
                  {/* HEADER */}
                  <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90 backdrop-blur-xl border-b border-blue-200/30 dark:border-blue-800/30 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                            <Bell className="h-5 w-5 text-white" />
                          </div>
                          {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                              {unreadNotificationsCount}
                            </span>
                          )}
                        </div>
                        <div>
                          <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                            {app.lang === "ar" ? "الإشعارات" : "Notifications"}
                          </DialogTitle>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
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
                            className="text-xs gap-1.5 rounded-xl hover:bg-blue-100/50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all"
                            onClick={handleMarkAllAsRead}
                            disabled={markAllRead.isPending}
                          >
                            {markAllRead.isPending ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            {app.lang === "ar" ? "تحديد الكل كمقروء" : "Mark all read"}
                          </Button>
                        )}
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-all"
                          onClick={() => setNotificationsOpen(false)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* LIST */}
                  <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1.5">
                    {notifications.length === 0 ? (
                      <div className="py-16 text-center">
                        <div className="h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                          <BellOff className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                        </div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                          {app.lang === "ar" ? "لا توجد إشعارات" : "No notifications"}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {app.lang === "ar"
                            ? "ستظهر الإشعارات هنا عند استلامها"
                            : "Notifications will appear here"}
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
                            className={`group relative rounded-xl transition-all duration-300 ${
                              isUnread
                                ? "bg-gradient-to-r from-blue-50/80 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/20 border border-blue-200/40 dark:border-blue-800/40 hover:shadow-md"
                                : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                            }`}
                          >
                            <div 
                              className="flex items-start gap-3 p-3 cursor-pointer" 
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex-shrink-0">
                                {notification.image_url ? (
                                  <div className="relative">
                                    <img
                                      src={notification.image_url}
                                      alt=""
                                      className="h-11 w-11 rounded-xl object-cover border-2 border-slate-200/50 dark:border-slate-700/50"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                    {isUnread && (
                                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-slate-900" />
                                    )}
                                  </div>
                                ) : (
                                  <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${config.color} border`}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${isUnread ? "font-semibold text-slate-900 dark:text-white" : "text-slate-600 dark:text-slate-400"}`}>
                                      {notification.title_ar || notification.title_en || "إشعار"}
                                    </p>
                                    <p className={`text-xs mt-0.5 line-clamp-2 ${isUnread ? "text-slate-700 dark:text-slate-300" : "text-slate-500 dark:text-slate-500"}`}>
                                      {notification.body_ar || notification.body_en || notification.message}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {formatTime(notification.created_at)}
                                      </span>
                                      {notification.type && (
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${config.color} border`}>
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
                                        className="h-7 w-7 rounded-lg hover:bg-blue-100/50 dark:hover:bg-blue-900/30 text-blue-500 hover:text-blue-600 transition-all opacity-0 group-hover:opacity-100"
                                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                                      >
                                        <Check className="h-3.5 w-3.5" />
                                      </Button>
                                    )}
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="h-7 w-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all opacity-0 group-hover:opacity-100"
                                        >
                                          <MoreVertical className="h-3.5 w-3.5 text-slate-400" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[160px]">
                                        {isUnread && (
                                          <DropdownMenuItem
                                            className="rounded-lg text-sm cursor-pointer gap-2"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleMarkAsRead(notification.id, e);
                                            }}
                                          >
                                            <Check className="h-4 w-4" />
                                            {app.lang === "ar" ? "تحديد كمقروء" : "Mark as read"}
                                          </DropdownMenuItem>
                                        )}
                                        {notification.link_url && (
                                          <DropdownMenuItem
                                            className="rounded-lg text-sm cursor-pointer gap-2"
                                            onClick={() => {
                                              navigate({ to: notification.link_url as any });
                                              setNotificationsOpen(false);
                                            }}
                                          >
                                            <Bell className="h-4 w-4" />
                                            {app.lang === "ar" ? "عرض التفاصيل" : "View details"}
                                          </DropdownMenuItem>
                                        )}
                                        <DropdownMenuItem
                                          className="rounded-lg text-sm cursor-pointer gap-2 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/30"
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
                    <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {notifications.length} {app.lang === "ar" ? "إشعار" : "notifications"}
                        {unreadNotificationsCount > 0 && ` · ${unreadNotificationsCount} ${app.lang === "ar" ? "غير مقروء" : "unread"}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        {app.lang === "ar" ? "إغلاق" : "Close"}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}

            {/* ✅ Bookings Shortcut - في الهيدر بجانب المفضلة */}
            {app.user && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to="/bookings" className="relative group shrink-0">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-9 w-9 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-950/20 transition group"
                    >
                      <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform group-hover:text-emerald-500" />
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/30">
                  <p className="text-emerald-700 dark:text-emerald-300">
                    {app.lang === "ar" ? "📅 حجوزاتي" : "📅 My Bookings"}
                  </p>
                </TooltipContent>
              </Tooltip>
            )}

            {/* Favorites */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/favorites" className="relative group shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl hover:bg-pink-50 dark:hover:bg-pink-950/20 transition group"
                  >
                    <Heart className="h-4 w-4 group-hover:scale-110 transition-transform group-hover:fill-pink-500 group-hover:text-pink-500" />
                    {favoritesCount > 0 && (
                      <Badge className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] bg-gradient-to-r from-pink-500 to-rose-500 text-white border-2 border-background animate-pulse shadow-lg shadow-pink-500/30">
                        {favoritesCount > 99 ? '99+' : favoritesCount}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="bg-pink-50 dark:bg-pink-950/30 border-pink-200 dark:border-pink-800/30">
                <p className="text-pink-700 dark:text-pink-300">
                  {app.lang === "ar" ? "المفضلة" : "Favorites"}
                  {favoritesCount > 0 && ` (${favoritesCount})`}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Cart */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/cart" className="relative group shrink-0">
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition">
                    <ShoppingBag className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {app.cart.length > 0 && (
                      <Badge className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] bg-gradient-to-r from-blue-600 to-blue-700 text-white border-2 border-background">
                        {app.cart.length}
                      </Badge>
                    )}
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{app.lang === "ar" ? "السلة" : "Cart"}</p>
              </TooltipContent>
            </Tooltip>

            {/* User Menu */}
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition group relative shrink-0">
                      <User className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      {app.user && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background animate-pulse" />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-72 rounded-2xl p-0 border-blue-200/30 dark:border-blue-800/30 shadow-2xl overflow-hidden">
                    {app.user ? (
                      <>
                        <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 border-b border-blue-200/30 dark:border-blue-800/30">
                          <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/25 overflow-hidden flex-shrink-0">
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
                                <span className="text-white font-bold text-lg">
                                  {app.user.name?.charAt(0).toUpperCase() || 'U'}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-slate-900 dark:text-white truncate">
                                {app.user.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate" dir="ltr">
                                {profile?.phone || app.user.phone || "رقم غير متاح"}
                              </p>
                            </div>
                            
                            <Badge variant="outline" className="text-[10px] border-emerald-500/30 text-emerald-600 bg-emerald-500/10">
                              {isAdmin ? (app.lang === 'ar' ? 'أدمن' : 'Admin') : 
                               isSeller ? (app.lang === 'ar' ? 'بائع' : 'Seller') : 
                               (app.lang === 'ar' ? 'عميل' : 'Customer')}
                            </Badge>
                          </div>
                          
                          <div className="mt-2 flex items-center justify-between">
                            <Link 
                              to="/settings" 
                              className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 transition-colors"
                            >
                              <Camera className="h-3 w-3" />
                              {profile?.avatar_url 
                                ? (app.lang === "ar" ? "تغيير الصورة الشخصية" : "Change profile photo")
                                : (app.lang === "ar" ? "إضافة صورة شخصية" : "Add profile photo")
                              }
                            </Link>
                            <span className="text-[10px] text-muted-foreground">
                              {app.lang === "ar" ? "مستخدم منذ" : "Member since"} {new Date(app.user.created_at || Date.now()).getFullYear()}
                            </span>
                          </div>
                          
                          {app.user.address && (
                            <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3 w-3 text-blue-500" />
                              <span className="truncate">{app.user.address}</span>
                            </div>
                          )}
                        </div>

                        <div className="p-1.5">
                          {/* ✅ حجوزاتي - في قائمة الحساب مثل نون */}
                          <DropdownMenuItem asChild className="rounded-xl hover:bg-emerald-50/50 dark:hover:bg-emerald-900/20 cursor-pointer py-2.5 px-3 group">
                            <Link to="/bookings" className="flex items-center gap-3 w-full">
                              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition">
                                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                  {app.lang === "ar" ? "📅 حجوزاتي" : "📅 My Bookings"}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {app.lang === "ar" ? "إدارة الحجوزات والمواعيد" : "Manage bookings & appointments"}
                                </p>
                              </div>
                              <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild className="rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer py-2.5 px-3 group">
                            <Link to="/settings" className="flex items-center gap-3 w-full">
                              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition">
                                <Settings className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900 dark:text-white">
                                  {app.lang === "ar" ? "الإعدادات الشخصية" : "Personal Settings"}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {app.lang === "ar" ? "تعديل الملف الشخصي وكلمة المرور" : "Edit profile & password"}
                                </p>
                              </div>
                              <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 transition" />
                            </Link>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="my-1.5" />

                          <DropdownMenuItem onClick={app.logout} className="rounded-xl hover:bg-red-50/50 dark:hover:bg-red-950/20 cursor-pointer py-2.5 px-3 group">
                            <div className="flex items-center gap-3 w-full">
                              <div className="h-8 w-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition">
                                <LogOut className="h-4 w-4 text-red-500" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                  {t("logout")}
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                  {app.lang === "ar" ? "تسجيل الخروج من الحساب" : "Sign out of your account"}
                                </p>
                              </div>
                            </div>
                          </DropdownMenuItem>
                        </div>

                        <div className="px-4 py-2 bg-slate-50/50 dark:bg-slate-800/30 border-t border-blue-200/30 dark:border-blue-800/30">
                          <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                            <span>
                              {app.lang === "ar" ? "آخر تسجيل دخول" : "Last login"}: {new Date().toLocaleDateString(app.lang === "ar" ? "ar-SA" : "en-US")}
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              {app.lang === "ar" ? "متصل" : "Online"}
                            </span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="p-4 text-center border-b border-blue-200/30 dark:border-blue-800/30">
                          <div className="h-14 w-14 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2">
                            <User className="h-7 w-7 text-slate-400" />
                          </div>
                          <p className="font-semibold text-slate-900 dark:text-white">
                            {app.lang === "ar" ? "مرحباً بك" : "Welcome"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {app.lang === "ar" ? "سجل الدخول للاستفادة من الميزات" : "Sign in to access all features"}
                          </p>
                        </div>
                        <div className="p-2 space-y-1">
                          <DropdownMenuItem asChild className="rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer py-2.5">
                            <Link to="/auth/$mode" params={{ mode: "login" }} className="flex items-center gap-3 w-full">
                              <LogIn className="h-4 w-4 text-blue-600" />
                              <span className="font-medium">{t("login")}</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="rounded-xl hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer py-2.5">
                            <Link to="/auth/$mode" params={{ mode: "register" }} className="flex items-center gap-3 w-full">
                              <UserPlus className="h-4 w-4 text-emerald-600" />
                              <span className="font-medium">{t("register")}</span>
                            </Link>
                          </DropdownMenuItem>
                        </div>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{app.user ? (app.lang === "ar" ? "الحساب" : "Account") : (app.lang === "ar" ? "تسجيل الدخول" : "Login")}</p>
              </TooltipContent>
            </Tooltip>

         {/* Role Button - نسخة محسنة للموبايل */}
{(() => {
  if (isAuthLoading) {
    return <div className="ms-1 px-2 py-0.5 rounded-lg bg-blue-500/20 animate-pulse h-5 w-16" />;
  }

  if (app.user) {
    if (isAdmin) {
      return (
        <Link 
          to="/admin" 
          className="ms-1 px-1.5 py-0.5 rounded-lg text-[7px] xs:text-[10px] sm:text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-0.5 xs:gap-1 border border-blue-400/20 shrink-0"
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
          className="ms-1 px-1.5 py-0.5 rounded-lg text-[7px] xs:text-[10px] sm:text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-0.5 xs:gap-1 border border-blue-400/20 shrink-0"
        >
          <Store className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" />
          {app.lang === "ar" ? "لوحة البائع" : "Seller"}
        </Link>
      );
    }
    return (
      <Link 
        to="/dashboard" 
        className="ms-1 px-1.5 py-0.5 rounded-lg text-[7px] xs:text-[10px] sm:text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-0.5 xs:gap-1 border border-blue-400/20 shrink-0"
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
      className="ms-1 px-1.5 py-0.5 rounded-lg text-[7px] xs:text-[10px] sm:text-[10px] font-semibold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-sm shadow-blue-500/20 hover:shadow-md hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-0.5 xs:gap-1 border border-blue-400/20 shrink-0"
    >
      <Store className="h-2 w-2 xs:h-2.5 xs:w-2.5 sm:h-3 sm:w-3" />
      {app.lang === "ar" ? "أنشئ متجرك" : "List Business"}
    </Link>
  );
})()}
          </div>
        </div>

        {/* ✅ Mobile Search */}
        <div className="md:hidden px-3 pb-2.5 flex gap-1.5">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && doSearch()}
              placeholder={t("search_placeholder")}
              className="ps-9 h-10 w-full bg-muted/50 border-blue-200/30 dark:border-blue-800/30 rounded-xl focus-visible:border-blue-400/60 transition text-sm"
            />
          </div>
          
          <Button 
            onClick={doSearch}
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Search className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 w-10 shrink-0 rounded-xl border-2 border-blue-200/30 dark:border-blue-800/30 hover:border-blue-400/50 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-300 flex items-center justify-center group relative">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                {gov !== "all" && (
                  <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-blue-600 ring-2 ring-background animate-pulse" />
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-80 overflow-auto rounded-xl p-1 border-blue-200/30 dark:border-blue-800/30 shadow-xl">
              <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4 text-muted-foreground" />
                {t("all_governorates")}
                {gov === "all" && <Check className="h-4 w-4 ms-auto text-blue-600" />}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {govs.map((g) => (
                <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-blue-50/50 dark:hover:bg-blue-900/20 cursor-pointer flex items-center gap-2 text-sm">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  {app.lang === "ar" ? g.name_ar : g.name_en}
                  {gov === g.slug && <Check className="h-4 w-4 ms-auto text-blue-600" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* ✅ Category Strip - يستخدم الأيقونات من قاعدة البيانات */}
        <nav className="border-t border-blue-200/40 dark:border-blue-800/40 bg-gradient-to-r from-blue-50/80 via-blue-100/60 to-blue-50/80 dark:from-blue-950/60 dark:via-blue-900/40 dark:to-blue-950/60 backdrop-blur-md overflow-x-auto no-scrollbar shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="mx-auto max-w-7xl px-4 flex items-center gap-1.5 py-3 text-sm">
            {categories.slice(0, 12).map((c: any) => {
              // ✅ جلب الأيقونة من قاعدة البيانات
              const Icon = getCategoryIcon(c.icon);
              const isOffer = c.slug === "offers";
              return (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className={`shrink-0 flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-medium text-xs transition-all duration-300 ${
                    isOffer
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 hover:-translate-y-0.5"
                      : "bg-white/70 dark:bg-gray-900/70 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 hover:scale-105 hover:-translate-y-0.5 border border-blue-200/30 dark:border-blue-800/30 backdrop-blur-sm"
                  }`}
                >
                  <Icon className={`h-4 w-4 shrink-0 transition-all duration-300 ${
                    isOffer ? "text-white" : "text-blue-500 dark:text-blue-400"
                  } group-hover:scale-110 group-hover:rotate-6`} />
                  <span className="whitespace-nowrap font-semibold tracking-wide">
                    {app.lang === "ar" ? c.name_ar : c.name_en}
                  </span>
                  {isOffer && (
                    <span className="text-[8px] uppercase bg-white/20 px-1.5 py-0.5 rounded-full font-bold tracking-wider animate-pulse">
                      {app.lang === "ar" ? "🔥 عروض" : "🔥 OFFERS"}
                    </span>
                  )}
                </Link>
              );
            })}
            {categories.length > 12 && (
              <Link
                to="/categories"
                className="shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/40 hover:shadow-lg hover:shadow-blue-200/50 dark:hover:shadow-blue-900/30 transition-all duration-300 border border-blue-200/30 dark:border-blue-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm hover:scale-105 hover:-translate-y-0.5"
              >
                <span>{t("view_all")}</span>
                <ChevronDown className="h-3.5 w-3.5 -rotate-90 transition-transform group-hover:translate-x-1" />
              </Link>
            )}
          </div>
        </nav>
      </header>
    </TooltipProvider>
  );
});

export function Footer() {
  // ====== ✅ جميع الـ Hooks أولاً ======
  const location = useLocation();
  const t = useT();
  const app = useApp();
  const year = new Date().getFullYear();
  const { data: dbCategories = [] } = useCategories();
  const categories = (dbCategories || []).filter((c: any) => c.active !== false);

  // ====== ✅ شرط إخفاء الفوتر ======
  const isChatPage = 
    location.pathname.startsWith('/messages_/') ||
    location.pathname.startsWith('/messages/') ||
    location.pathname.includes('/messages_') ||
    location.pathname.includes('/messages/$userId');
  
  if (isChatPage) {
    return null;
  }

  const quickLinks = [
    { label: app.lang === "ar" ? "الرئيسية" : "Home", href: "/" },
    { label: app.lang === "ar" ? "المتاجر" : "Stores", href: "/stores" },
    { label: app.lang === "ar" ? "العروض" : "Offers", href: "/category/offers" },
    { label: app.lang === "ar" ? "المفضلة" : "Favorites", href: "/favorites" },
    { label: app.lang === "ar" ? "المدونة" : "Blog", href: "/blog" },
    { label: app.lang === "ar" ? "اتصل بنا" : "Contact", href: "/contact" },
  ];

  const platformLinks = [
    { label: app.lang === "ar" ? "لوحة التحكم" : "Dashboard", href: "/dashboard" },
    { label: app.lang === "ar" ? "الرسائل" : "Messages", href: "/messages" },
    { label: app.lang === "ar" ? "الطلبات" : "Orders", href: "/orders" },
    { label: app.lang === "ar" ? "الحجوزات" : "Bookings", href: "/bookings" },
    { label: app.lang === "ar" ? "التقارير" : "Reports", href: "/reports" },
  ];

  const supportLinks = [
    { label: app.lang === "ar" ? "الأسئلة الشائعة" : "FAQ", href: "/faq" },
    { label: app.lang === "ar" ? "سياسة الخصوصية" : "Privacy Policy", href: "/privacy" },
    { label: app.lang === "ar" ? "الشروط والأحكام" : "Terms & Conditions", href: "/terms" },
    { label: app.lang === "ar" ? "سياسة الاسترجاع" : "Return Policy", href: "/returns" },
    { label: app.lang === "ar" ? "مركز المساعدة" : "Help Center", href: "/help" },
  ];

  return (
    <footer className="relative mt-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-indigo-50/60 to-slate-100/80 dark:from-gray-950 dark:via-slate-950 dark:to-gray-950" />
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.06]">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, #3b82f6 1px, transparent 1px),
            radial-gradient(circle at 80% 50%, #3b82f6 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: '0 0, 30px 30px'
        }} />
      </div>
      <div className="absolute -top-40 -end-40 h-96 w-96 rounded-full bg-gradient-to-br from-blue-400/30 to-blue-600/10 blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -start-40 h-96 w-96 rounded-full bg-gradient-to-tr from-indigo-400/30 to-purple-500/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-500/5 to-indigo-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 pt-20 pb-8">
        <div className="grid gap-10 md:grid-cols-12 mb-16">
          <div className="md:col-span-4 space-y-5">
            <button onClick={() => window.location.href = '/'} className="inline-flex items-center gap-3 group cursor-pointer">
              <div className="grid place-items-center h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-2xl shadow-lg group-hover:shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <House className="h-8 w-8" />
              </div>
              <div>
                <div className="font-black text-2xl tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {t("brand")}
                </div>
                <div className="text-xs text-muted-foreground tracking-wider uppercase">
                  {t("tagline")}
                </div>
              </div>
            </button>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              {app.lang === "ar"
                ? "منصة سورية شاملة تجمع أفضل المتاجر والخدمات في مكان واحد، بتصميم عصري وتجربة استثنائية تجعل التسوق متعة حقيقية."
                : "A comprehensive Syrian platform bringing together top stores and services in one place, with a modern design and exceptional shopping experience."}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-9 w-9 rounded-full border-2 border-background bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {app.lang === "ar" ? "انضم إلينا" : "Join us"}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {[
                { icon: Twitter, label: "Twitter", color: "hover:text-blue-400" },
                { icon: Instagram, label: "Instagram", color: "hover:text-pink-500" },
                { icon: Facebook, label: "Facebook", color: "hover:text-blue-600" },
                { icon: Globe, label: "Website", color: "hover:text-indigo-500" },
                { icon: Youtube, label: "YouTube", color: "hover:text-red-500" },
              ].map((social, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={social.label}
                  className="group grid place-items-center h-11 w-11 rounded-2xl border border-blue-200/30 dark:border-blue-800/30 bg-white/50 dark:bg-gray-900/50 hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-110 hover:shadow-lg backdrop-blur"
                >
                  <social.icon className="h-5 w-5 text-muted-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              {app.lang === "ar" ? "روابط سريعة" : "Quick Links"}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600/30 dark:bg-blue-400/30 group-hover:w-3 group-hover:bg-blue-600 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              {app.lang === "ar" ? "المنصة" : "Platform"}
            </h4>
            <ul className="space-y-3">
              {platformLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600/30 dark:bg-blue-400/30 group-hover:w-3 group-hover:bg-blue-600 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              {app.lang === "ar" ? "الدعم" : "Support"}
            </h4>
            <ul className="space-y-3">
              {supportLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 flex items-center gap-2 group"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600/30 dark:bg-blue-400/30 group-hover:w-3 group-hover:bg-blue-600 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-sm font-bold text-foreground mb-5 flex items-center gap-2">
              <span className="h-1.5 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600" />
              {app.lang === "ar" ? "تواصل معنا" : "Contact Us"}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <MapPin className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="mt-1.5">{app.lang === "ar" ? "دمشق، سوريا" : "Damascus, Syria"}</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Phone className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="mt-1.5" dir="ltr">+963 11 000 0000</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Mail className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="mt-1.5">hello@alsouq.sy</span>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground hover:text-foreground transition-colors group">
                <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
                  <Clock className="h-4.5 w-4.5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="mt-1.5">{app.lang === "ar" ? "دعم 24/7" : "24/7 Support"}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-blue-200/30 dark:border-blue-800/30 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">©</span>
              {year} <span className="text-blue-600 dark:text-blue-400 font-semibold">{t("brand")}</span>
            </span>
            <span className="hidden sm:inline text-muted-foreground/30">|</span>
            <span>{app.lang === "ar" ? "جميع الحقوق محفوظة." : "All rights reserved."}</span>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <a href="#" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              {app.lang === "ar" ? "الخصوصية" : "Privacy"}
            </a>
            <a href="#" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              {app.lang === "ar" ? "الشروط" : "Terms"}
            </a>
            <a href="#" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              {app.lang === "ar" ? "الدعم" : "Support"}
            </a>
            <a href="#" className="text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
              {app.lang === "ar" ? "ملفات التعريف" : "Cookies"}
            </a>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-green-600 dark:text-green-400 font-medium">
                {app.lang === "ar" ? "نظام آمن" : "Secure"}
              </span>
            </div>
            <span className="text-muted-foreground/30">|</span>
            <span className="text-muted-foreground flex items-center gap-1">
              <span className="text-blue-600 dark:text-blue-400">⚡</span>
              v2.0.0
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-blue-200/20 dark:border-blue-800/20">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-muted-foreground font-medium me-2">
              {app.lang === "ar" ? "التصنيفات:" : "Categories:"}
            </span>
            {categories.slice(0, 12).map((c: any) => (
              <Link
                key={c.id}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors px-2 py-1 rounded-full hover:bg-blue-50 dark:hover:bg-blue-950/30 border border-transparent hover:border-blue-200/30"
              >
                {app.lang === "ar" ? c.name_ar : c.name_en}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}