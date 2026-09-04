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
  CheckCircle, XCircle, Megaphone, Sparkles, Calendar, ChevronLeft, ChevronRight, ShoppingCart,
  Compass, Mic, MicOff, 
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
import { processVoiceSearch } from "@/lib/voiceSearchEngine";
import { VoiceSearch } from "@/components/VoiceSearch";
import { detectVoiceCommand, parseVoiceQuery } from "@/lib/voiceSearch";
// ✅ إضافة import لـ OptimizedImage
import { OptimizedImage } from "@/components/OptimizedImage";

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
      <span className="absolute -inset-2 rounded-full border-2 border-[#2a655f]/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <span className="absolute -inset-4 rounded-full border-2 border-[#3a8a82]/10 animate-ripple delay-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <span className="absolute -inset-6 rounded-full border-2 border-[#4a9f95]/5 animate-ripple delay-1500 opacity-0 group-hover:opacity-100 transition-opacity duration-900" />
    </div>
  );
};

// ✅ Mega Menu Component مع أيقونات متحركة ملونة - مع بوردر فوشي غامق
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
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(244,114,182,0.2); }
          50% { box-shadow: 0 0 40px rgba(244,114,182,0.5); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s ease-in-out infinite;
        }
        @keyframes shimmer-slow {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer-slow {
          background-size: 200% auto;
          animation: shimmer-slow 4s linear infinite;
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
        // ✅ ✅ ✅ بوردر فوشي غامق مطابق لـ StoreCard
        <div className="absolute top-full start-0 mt-2 w-[900px] max-w-[95vw] bg-card rounded-2xl shadow-2xl border-3 border-[#d81b60]/60 hover:border-[#c2185b] shadow-[0_0_35px_rgba(216,27,96,0.2)] hover:shadow-[0_0_55px_rgba(194,24,91,0.35)] transition-all duration-400 p-6 grid grid-cols-4 gap-6 animate-in slide-in-from-top-5 duration-200 z-50 bg-gradient-to-br from-white via-emerald-50/20 to-[#2a655f]/10 dark:from-gray-950 dark:via-[#173d38]/20 dark:to-[#2a655f]/20 max-h-[80vh] overflow-y-auto">
          
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
                      <OptimizedImage
                        src={c.image_url}
                        alt={app.lang === "ar" ? c.name_ar : (c.name_en || c.name_ar)}
                        width={40}
                        height={40}
                        quality={80}
                        objectFit="cover"
                        className="h-full w-full rounded-xl"
                      />
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

          {/* ✅ قسم العروض - تحسين الديزاين مع تأثير توهج نابض */}
          <div className="col-span-1 space-y-3 border-s border-[#2a655f]/15 dark:border-[#2a655f]/30 ps-4">
            <div className="text-[10px] uppercase tracking-wider text-[#2a655f] dark:text-[#3a8a82] font-extrabold flex items-center gap-2">
              <span className="h-1.5 w-5 rounded-full bg-gradient-to-r from-pink-400 to-pink-600 animate-pulse" />
              {app.lang === "ar" ? "🎀 عروض خاصة" : "🎀 Special Offers"}
            </div>

            {promoCategories.map((c) => {
              const Icon = getCategoryIcon(c.icon);
              return (
                <Link
                  key={c.id}
                  to="/category/$slug"
                  params={{ slug: c.slug }}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-pink-100/80 via-pink-200/60 to-pink-300/40 hover:from-pink-200/90 hover:to-pink-400/60 transition-all duration-300 border border-pink-300/50 shadow-md hover:shadow-pink-200/50 animate-glow-pulse"
                >
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white shadow-md animate-special-dance shrink-0 overflow-hidden">
                    {c.image_url ? (
                      <OptimizedImage
                        src={c.image_url}
                        alt={app.lang === "ar" ? c.name_ar : (c.name_en || c.name_ar)}
                        width={40}
                        height={40}
                        quality={80}
                        objectFit="cover"
                        className="h-full w-full rounded-xl"
                      />
                    ) : (
                      <AnimatedIcon Icon={Icon} className="h-4 w-4 text-white" color="text-white" delay={0} />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-pink-800 dark:text-pink-300 truncate" dir={app.lang === "ar" ? "rtl" : "ltr"}>
                      {app.lang === "ar" ? c.name_ar : (c.name_en || c.name_ar)}
                    </div>
                    <div className="text-[10px] text-pink-600 dark:text-pink-400 font-semibold animate-pulse">
                      {app.lang === "ar" ? "🔥 خصومات تصل إلى 70%" : "🔥 Up to 70% off"}
                    </div>
                  </div>
                </Link>
              );
            })}
            
            <Link
              to="/categories"
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-gradient-to-r from-pink-500/20 to-pink-600/20 hover:from-pink-500/40 hover:to-pink-600/40 transition-all duration-300 font-medium text-sm text-pink-700 dark:text-pink-300 mt-2 border border-pink-300/40 dark:border-pink-500/40 group cursor-pointer"
            >
              {t("view_all")}
              <ChevronDown className="h-3.5 w-3.5 -rotate-90 group-hover:translate-x-1 transition-transform text-pink-600" />
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
  
  const { profile } = useProfileWithUpdate();
  
  const { data: favorites = [] } = useFavorites(app.user?.id);
  const favoritesCount = favorites.length;
  const { data: cart } = useCart(app.user?.id);
  const cartItemsCount = cart?.items?.length || 0;

  // ===== ✅ البحث التلقائي عند تغيير المحافظة =====
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

  // ✅ ✅ ✅ دالة معالجة البحث الصوتي
  const handleVoiceSearch = useCallback(async (text: string, entities?: any) => {
    console.log("🎤 Voice search result:", text);
    console.log("📊 Entities:", entities);
    
    const response = await processVoiceSearch(text, app.lang === 'ar' ? 'ar' : 'en');
    
    console.log("🎯 Intent:", response.intent);
    console.log("📊 Entities:", response.entities);
    console.log("📊 Results:", response.results.length);
    
    switch (response.intent) {
      case 'action':
        if (text.includes('سلة') || text.includes('cart') || text.includes('عربة')) {
          navigate({ to: "/cart" });
          toast.info(app.lang === "ar" ? "🛒 تم التوجيه إلى السلة" : "🛒 Navigating to cart");
          return;
        }
        if (text.includes('طلبات') || text.includes('orders') || text.includes('شحن')) {
          navigate({ to: "/orders" });
          toast.info(app.lang === "ar" ? "📦 تم التوجيه إلى الطلبات" : "📦 Navigating to orders");
          return;
        }
        break;
        
      case 'store':
        if (response.results.length > 0) {
          const store = response.results[0];
          navigate({ 
            to: "/store/$id", 
            params: { id: store.id } 
          });
          toast.info(
            app.lang === "ar" 
              ? `🏪 تم التوجيه إلى متجر ${store.title}` 
              : `🏪 Navigating to store: ${store.title}`
          );
        } else {
          navigate({ to: "/stores" });
          toast.info(app.lang === "ar" ? "🏪 تم التوجيه إلى صفحة المتاجر" : "🏪 Navigating to stores");
        }
        return;
        
      case 'category':
        if (response.results.length > 0) {
          const category = response.results[0];
          navigate({ 
            to: "/category/$slug", 
            params: { slug: category.id } 
          });
          toast.info(
            app.lang === "ar" 
              ? `📂 تم التوجيه إلى تصنيف ${category.title}` 
              : `📂 Navigating to category: ${category.title}`
          );
        } else {
          navigate({ to: "/categories" });
          toast.info(app.lang === "ar" ? "📂 تم التوجيه إلى صفحة التصنيفات" : "📂 Navigating to categories");
        }
        return;
        
      case 'help':
        toast.info(
          app.lang === "ar" 
            ? "💡 يمكنك قول: 'ابحث عن جوال سامسونج'، 'عروض السلة'، 'متاجر في دمشق'" 
            : "💡 You can say: 'search Samsung phones', 'show offers', 'stores in Damascus'"
        );
        return;
        
      default:
        if (response.results.length > 0) {
          const searchQuery = entities?.searchTerms?.join(' ') || text;
          navigate({ 
            to: "/search", 
            search: { q: searchQuery } 
          });
          toast.success(
            app.lang === "ar" 
              ? `🔍 تم العثور على ${response.totalCount} نتيجة` 
              : `🔍 Found ${response.totalCount} results`
          );
        } else if (text.trim()) {
          navigate({ 
            to: "/search", 
            search: { q: text.trim() } 
          });
          toast.info(app.lang === "ar" ? "🔍 جاري البحث..." : "🔍 Searching...");
        }
    }
  }, [app.lang, navigate]);

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
      if (notification.link_url.startsWith('/')) {
        navigate({ to: notification.link_url });
      } else {
        window.open(notification.link_url, '_blank');
      }
      setNotificationsOpen(false);
    } else {
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

        {/* ✅ CSS Animations */}
        <style>{`
          @keyframes heartbeat {
            0%, 100% { transform: scale(1); }
            14% { transform: scale(1.3); }
            28% { transform: scale(1); }
            42% { transform: scale(1.3); }
            70% { transform: scale(1); }
          }
          .animate-heartbeat {
            animation: heartbeat 1.5s ease-in-out infinite;
          }
          @keyframes cart-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-4px); }
          }
          .animate-cart-bounce {
            animation: cart-bounce 0.6s ease-in-out;
          }
          @keyframes ripple-pink {
            0% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(2.5); opacity: 0; }
          }
          .animate-ripple-pink {
            animation: ripple-pink 1.5s ease-out infinite;
          }
          @keyframes shimmer-gold {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer-gold {
            background: linear-gradient(90deg, #2a655f, #f9a8d4, #2a655f);
            background-size: 200% 100%;
            animation: shimmer-gold 3s linear infinite;
          }
        `}</style>

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

{/* Home Button - ✦ ZOOQ Premium Brand Identity */}
<Tooltip>
  <TooltipTrigger asChild>
    <button
      onClick={goHome}
      className="flex items-center shrink-0 group cursor-pointer relative"
      aria-label={app.lang === "ar" ? "الرئيسية - ذوق" : "Home - zooq"}
    >
      {/* Glow */}
      <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-[#f9a8d4]/0 via-[#f9a8d4]/15 to-[#2a655f]/0 blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none" />

      {/* LOGO - أصغر قليلاً */}
      <div className="relative flex items-center justify-center shrink-0">
        <div className="absolute -inset-4 rounded-full bg-[#f9a8d4]/15 blur-xl opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500" />
        <img
          src="/images/Logo.png"
          alt="ذوق | zooq"
          draggable={false}
          className="
            relative z-10            h-[36px] w-[36px]
            xs:h-[40px] xs:w-[40px]
            sm:h-[56px] sm:w-[56px]
            md:h-[68px] md:w-[68px]
            lg:h-[78px] lg:w-[78px]
            object-contain
            drop-shadow-[0_4px_20px_rgba(42,101,95,0.3)]
            group-hover:scale-110
            group-hover:drop-shadow-[0_8px_32px_rgba(249,168,212,0.5)]
            transition-all duration-500
          "
        />
      </div>
    </button>
  </TooltipTrigger>

  <TooltipContent
    side="bottom"
    sideOffset={10}
    className="bg-[#071f1c] text-white border border-[#f9a8d4]/30 rounded-xl px-4 py-2.5 shadow-[0_10px_40px_rgba(7,31,28,0.45)]"
  >
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center gap-2">
        <span className="text-[#f9a8d4] text-xs">✦</span>
        <span className="text-sm font-bold tracking-wide">
          {app.lang === "ar" ? "ذوق · كلشي ع ذوقك" : "zooq · Exactly your taste"}
        </span>
        <span className="text-[#f9a8d4] text-xs">✦</span>
      </div>
      <span className="text-[10px] text-white/60 tracking-[0.2em] lowercase font-medium">zooq marketplace</span>
    </div>
  </TooltipContent>
</Tooltip>
          {/* Mega Menu */}
          <div className="hidden md:block">
            <MegaMenu categories={categories} />
          </div>

          {/* Desktop Search - ✅ مع تحسين الديزاين */}
          <div className="flex-1 max-w-3xl mx-2 hidden lg:flex items-center gap-1.5">
            <div className="relative flex-1 min-w-[160px] group">
              <Search className={`absolute inset-y-0 my-auto start-3 h-4 w-4 transition-colors duration-300 ${searchFocused ? 'text-pink-500 dark:text-pink-400' : 'text-muted-foreground'}`} />
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
      ? 'border-pink-500 bg-card shadow-lg shadow-pink-500/20 dark:shadow-pink-400/30'
      : 'border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500'
  }`}
/>
            </div>
            
            <VoiceSearch
  onResult={handleVoiceSearch}
  lang={isRTL ? "ar-SA" : "en-US"}
  buttonSize="md"
  className="border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
/>
            
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
                    <Button variant="outline" className="h-10 gap-1 shrink-0 min-w-[100px] rounded-xl border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 hover:border-pink-400/50 transition group text-sm px-3">
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
  <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white cursor-pointer flex items-center gap-2 text-sm transition-all duration-200">
    <Globe className="h-4 w-4 text-muted-foreground group-hover:text-white" />
    {t("all_governorates")}
    {gov === "all" && <Check className="h-4 w-4 ms-auto text-pink-500" />}
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  {govs.map((g) => (
    <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white cursor-pointer flex items-center gap-2 text-sm transition-all duration-200">
      <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white" />
      {app.lang === "ar" ? g.name_ar : g.name_en}
      {gov === g.slug && <Check className="h-4 w-4 ms-auto text-pink-500" />}
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
  onFocus={() => setSearchFocused(true)}
  onBlur={() => setSearchFocused(false)}
  placeholder={t("search_placeholder")}
  className={`w-full h-10 ps-9 pe-3 bg-muted/50 border-2 rounded-xl transition-all duration-300 focus:outline-none text-sm ${
    searchFocused
      ? 'border-pink-500 bg-card shadow-lg shadow-pink-500/20 dark:shadow-pink-400/30'
      : 'border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500'
  }`}
/>
            </div>
            
           <VoiceSearch
  onResult={handleVoiceSearch}
  lang={isRTL ? "ar-SA" : "en-US"}
  buttonSize="sm"
  className="border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
/>
            
            <button
              onClick={doSearch}
              className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center group"
            >
              <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 w-10 shrink-0 rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-pink-400/50 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 flex items-center justify-center group relative">
                  <MapPin className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-110 transition-transform" />
                  {gov !== "all" && (
                    <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-background animate-pulse" />
                  )}
                </button>
              </DropdownMenuTrigger>
<DropdownMenuContent align="end" className="max-h-80 overflow-auto rounded-xl p-1 border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-xl">
  <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white cursor-pointer flex items-center gap-2 text-sm transition-all duration-200">
    <Globe className="h-4 w-4 text-muted-foreground group-hover:text-white" />
    {t("all_governorates")}
    {gov === "all" && <Check className="h-4 w-4 ms-auto text-pink-500" />}
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  {govs.map((g) => (
    <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white cursor-pointer flex items-center gap-2 text-sm transition-all duration-200">
      <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white" />
      {app.lang === "ar" ? g.name_ar : g.name_en}
      {gov === g.slug && <Check className="h-4 w-4 ms-auto text-pink-500" />}
    </DropdownMenuItem>
  ))}
</DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Actions */}
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

            {/* Messages - ✅ مع تموج وردي */}
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
                      <>
                        <Badge 
                          className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold text-white border-2 border-background animate-pulse"
                          style={{
                            background: 'linear-gradient(135deg, #f9a8d4, #fbcfe8)',
                            boxShadow: '0 0 20px rgba(244,114,182,0.5)'
                          }}
                        >
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </Badge>
                        <span className="absolute -inset-1 rounded-full border-2 border-pink-400/30 animate-ripple-pink" />
                      </>
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

            {/* Notifications Dialog */}
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
                              background: 'linear-gradient(135deg, #f9a8d4, #fbcfe8)',
                              boxShadow: '0 0 20px rgba(244,114,182,0.5)'
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

                  <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2a655f]/15 via-[#3a8a82]/15 to-[#2a655f]/15 dark:from-[#173d38]/80 dark:to-slate-900 border-b border-[#2a655f]/30 dark:border-[#2a655f]/50 p-4.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 animate-icon-dance">
                            <Bell className="h-5 w-5 text-white" />
                          </div>
                          {unreadNotificationsCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-pink-400 px-1.5 text-[10px] font-black text-white flex items-center justify-center ring-2 ring-white dark:ring-slate-900 shadow-md">
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
                            className="text-xs font-black gap-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 dark:bg-pink-500/30 dark:hover:bg-pink-500/40 text-pink-600 dark:text-pink-300 transition-all cursor-pointer border border-pink-300/30"
                            onClick={handleMarkAllAsRead}
                            disabled={markAllRead.isPending}
                          >
                            {markAllRead.isPending ? (
                              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-pink-500 border-t-transparent" />
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )}
                            {app.lang === "ar" ? "تحديد الكل" : "Mark all read"}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

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
                                ? "bg-pink-500/5 dark:bg-pink-500/15 border-pink-400/40 dark:border-pink-500/50 shadow-md"
                                : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-pink-400/40"
                            }`}
                          >
                            <div 
                              className="flex items-start gap-3.5 p-3.5 cursor-pointer" 
                              onClick={() => handleNotificationClick(notification)}
                            >
                              <div className="flex-shrink-0">
                                {notification.image_url ? (
                                  <div className="relative">
                                    <OptimizedImage
                                      src={notification.image_url}
                                      alt=""
                                      width={48}
                                      height={48}
                                      quality={80}
                                      objectFit="cover"
                                      className="h-12 w-12 rounded-2xl object-cover border-2 border-pink-400/40 shadow-sm"
                                    />
                                    {isUnread && (
                                      <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-pink-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                                    )}
                                  </div>
                                ) : (
                                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border border-pink-400/30 shadow-sm bg-pink-500/15 dark:bg-pink-500/30 text-pink-600 dark:text-pink-300`}>
                                    <Icon className="h-5 w-5" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${isUnread ? "font-black text-slate-950 dark:text-white" : "font-bold text-slate-900 dark:text-slate-200"}`}>
                                      {notification.title_ar || notification.title_en || "إشعار"}
                                    </p>
                                    <p className={`text-xs mt-1 whitespace-pre-wrap break-words ${isUnread ? "text-slate-800 dark:text-slate-200 font-semibold" : "text-slate-600 dark:text-slate-400 font-medium"}`}>
  {notification.body_ar || notification.body_en || notification.message}
</p>
                                    <div className="flex items-center gap-2 mt-2">
                                      <span className="text-[10px] text-slate-600 dark:text-slate-400 flex items-center gap-1 font-bold">
                                        <Clock className="h-3 w-3 text-pink-500" />
                                        {formatTime(notification.created_at)}
                                      </span>
                                      {notification.type && (
                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-pink-500/15 text-pink-600 dark:text-pink-300 font-extrabold border border-pink-400/30">
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
                                        className="h-8 w-8 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-600 dark:text-pink-300 transition-all opacity-0 group-hover:opacity-100 cursor-pointer border border-pink-400/30"
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
                                      <DropdownMenuContent align="end" className="rounded-2xl p-1.5 min-w-[170px] border border-pink-400/40 shadow-xl bg-white dark:bg-slate-900">
                                        {isUnread && (
                                          <DropdownMenuItem
                                            className="rounded-xl text-xs font-bold cursor-pointer gap-2.5 py-2 hover:bg-pink-500/15 text-slate-900 dark:text-slate-100"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleMarkAsRead(notification.id, e);
                                            }}
                                          >
                                            <Check className="h-4 w-4 text-pink-500" />
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

                  {notifications.length > 0 && (
                    <div className="sticky bottom-0 bg-white dark:bg-slate-950 border-t border-pink-400/30 dark:border-pink-500/50 p-3.5 flex items-center justify-between">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-bold">
                        {notifications.length} {app.lang === "ar" ? "إشعار" : "notifications"}
                        {unreadNotificationsCount > 0 && ` · ${unreadNotificationsCount} ${app.lang === "ar" ? "غير مقروء" : "unread"}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs font-bold rounded-xl text-pink-600 dark:text-pink-300 hover:bg-pink-500/15 transition-all cursor-pointer border border-pink-400/30"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        {app.lang === "ar" ? "إغلاق" : "Close"}
                      </Button>
                    </div>
                  )}
                </DialogContent>
              </Dialog>
            )}

            {/* ✅ Favorites - قلب معبى بلون زهري دائماً */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/favorites" className="relative group shrink-0">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl hover:bg-pink-500/10 dark:hover:bg-pink-500/20 transition group"
                  >
                    <Heart className={cn(
                      "h-4 w-4 group-hover:scale-110 transition-transform",
                      // ✅ ✅ ✅ قلب معبى بلون زهري دائماً
                      "text-pink-500 fill-pink-500"
                    )} />
                    {favoritesCount > 0 && (
                      <Badge 
                        className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] font-bold text-white border-2 border-background animate-pulse"
                        style={{
                          background: 'linear-gradient(135deg, #ec4899, #f472b6)',
                          boxShadow: '0 0 20px rgba(244,114,182,0.5)'
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
                  {app.lang === "ar" ? "❤️ المفضلة" : "❤️ Favorites"}
                  {favoritesCount > 0 && ` (${favoritesCount})`}
                </p>
              </TooltipContent>
            </Tooltip>

            {/* Cart - ✅ مع حركة ارتداد عند وجود منتجات */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/cart" className="relative group shrink-0">
                  <Button variant="ghost" size="icon" className={cn(
                    "h-9 w-9 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition",
                    cartItemsCount > 0 && "animate-cart-bounce"
                  )}>
                    <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    {cartItemsCount > 0 && (
                      <Badge className="absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full text-[10px] text-white border-2 border-background"
                        style={{
                          background: 'linear-gradient(135deg, #2a655f, #3a8a82)',
                          boxShadow: '0 0 20px rgba(42,101,95,0.5)'
                        }}
                      >
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

        {/* User Menu */}
<Tooltip>
  <TooltipTrigger asChild>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-[#d81b60]/20 dark:hover:bg-[#d81b60]/30 transition-all duration-300 group relative shrink-0 border-2 border-[#d81b60]/60 dark:border-[#d81b60]/50 hover:border-[#d81b60] shadow-[0_0_15px_rgba(216,27,96,0.2)] hover:shadow-[0_0_30px_rgba(216,27,96,0.4)] cursor-pointer overflow-hidden p-0">
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none z-10" />
          
          {app.user && profile?.avatar_url ? (
            <div className="h-full w-full rounded-2xl overflow-hidden relative">
              <OptimizedImage 
                src={profile.avatar_url} 
                alt={app.user.name} 
                width={40}
                height={40}
                quality={85}
                objectFit="cover"
                className="h-full w-full group-hover:scale-110 transition-transform duration-300"
              />
            </div>
          ) : (
            <User className="h-4 w-4 text-[#d81b60] dark:text-[#f48fb1] group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300 relative z-10 animate-icon-dance" />
          )}
          
          {app.user && (
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-background animate-ping z-20" />
          )}
          {app.user && (
            <span className="absolute bottom-0.5 right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background z-20 shadow-[0_0_8px_rgba(16,185,129,1)]" />
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 rounded-[28px] p-0 border-2 border-[#d81b60]/60 dark:border-[#d81b60]/50 shadow-[0_20px_50px_rgba(216,27,96,0.25)] overflow-hidden bg-gradient-to-b from-white via-pink-50/30 to-white dark:from-slate-950 dark:via-[#d81b60]/10 dark:to-slate-950 backdrop-blur-2xl animate-in fade-in-50 zoom-in-95 duration-300">
        
        <style>{`
          @keyframes icon-dance-glow {
            0%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 2px rgba(216,27,96,0.5)); }
            50% { transform: scale(1.2) rotate(-8deg); filter: drop-shadow(0 0 8px rgba(216,27,96,0.9)); }
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
          @keyframes shimmer-pink {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          .animate-shimmer-pink {
            background: linear-gradient(90deg, transparent, rgba(216,27,96,0.1), transparent);
            background-size: 200% 100%;
            animation: shimmer-pink 3s ease-in-out infinite;
          }
        `}</style>

        {app.user ? (
          <>
            <div className="bg-gradient-to-br from-[#d81b60]/20 via-[#f48fb1]/15 to-[#d81b60]/10 dark:from-[#d81b60]/30 dark:via-[#f48fb1]/10 dark:to-[#d81b60]/20 p-5 border-b-2 border-[#d81b60]/30 relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#d81b60]/30 blur-2xl animate-pulse-slow pointer-events-none" />
              <div className="absolute -left-8 -bottom-8 h-32 w-32 rounded-full bg-[#f48fb1]/20 blur-2xl animate-pulse-slow pointer-events-none" style={{ animationDelay: '2s' }} />

              <div className="flex items-center gap-4 relative z-10">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#d81b60] to-[#f48fb1] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-[#d81b60]/40 overflow-hidden flex-shrink-0 ring-4 ring-white/60 dark:ring-slate-800/80 transform hover:scale-105 transition-transform duration-300">
                  {profile?.avatar_url ? (
                    <OptimizedImage 
                      src={profile.avatar_url} 
                      alt={app.user.name} 
                      width={56}
                      height={56}
                      quality={85}
                      objectFit="cover"
                      className="h-full w-full"
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
                
                <Badge variant="outline" className="text-[10px] border-[#d81b60]/60 text-[#d81b60] dark:text-[#f48fb1] bg-[#d81b60]/15 flex-shrink-0 font-black px-2.5 py-1 rounded-full shadow-sm animate-pulse">
                  {isAdmin ? (app.lang === 'ar' ? '⭐ أدمن' : '⭐ Admin') : 
                   isSeller ? (app.lang === 'ar' ? '🛍️ بائع' : '🛍️ Seller') : 
                   (app.lang === 'ar' ? '👤 عميل' : '👤 Customer')}
                </Badge>
              </div>
              
              <div className="mt-4 pt-3 border-t-2 border-[#d81b60]/25 flex items-center justify-between relative z-10">
                <Link 
                  to="/settings" 
                  className="text-xs text-[#d81b60] dark:text-[#f48fb1] hover:text-[#c2185b] flex items-center gap-1.5 font-bold transition-colors group/link"
                >
                  <div className="h-6 w-6 rounded-xl bg-[#d81b60]/15 flex items-center justify-center group-hover/link:bg-[#d81b60]/20 group-hover/link:scale-110 transition-all shadow-inner">
                    <Camera className="h-3.5 w-3.5 text-[#d81b60] dark:text-[#f48fb1] group-hover/link:text-[#c2185b]" />
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
                  <MapPin className="h-3.5 w-3.5 text-[#d81b60] flex-shrink-0 animate-bounce" />
                  <span className="truncate">{app.user.address}</span>
                </div>
              )}
            </div>

            <div className="p-2.5 space-y-1.5">
              <DropdownMenuItem asChild className="rounded-2xl focus:bg-[#d81b60]/20 hover:bg-[#d81b60]/15 dark:focus:bg-[#d81b60]/30 dark:hover:bg-[#d81b60]/20 cursor-pointer py-3 px-3.5 group transition-all duration-300">
                <Link to="/orders" className="flex items-center gap-3.5 w-full">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#d81b60]/20 to-[#f48fb1]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-sm border-2 border-[#d81b60]/30">
                    <Package className="h-5 w-5 text-[#d81b60] dark:text-[#f48fb1]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#d81b60] dark:group-hover:text-[#f48fb1] transition-colors">
                      {app.lang === "ar" ? "📦 طلباتي" : "📦 My Orders"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {app.lang === "ar" ? "تتبع حالة الطلبات" : "Track orders"}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild className="rounded-2xl focus:bg-[#d81b60]/20 hover:bg-[#d81b60]/15 dark:focus:bg-[#d81b60]/30 dark:hover:bg-[#d81b60]/20 cursor-pointer py-3 px-3.5 group transition-all duration-300">
                <Link to="/settings" className="flex items-center gap-3.5 w-full">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#d81b60]/20 to-[#f48fb1]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-sm border-2 border-[#d81b60]/30">
                    <Settings className="h-5 w-5 text-[#d81b60] dark:text-[#f48fb1]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#d81b60] dark:group-hover:text-[#f48fb1] transition-colors">
                      {app.lang === "ar" ? "⚙️ الإعدادات" : "⚙️ Settings"}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {app.lang === "ar" ? "تعديل الملف الشخصي" : "Edit profile"}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 -rotate-90 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-2 bg-[#d81b60]/30" />

              <DropdownMenuItem onClick={app.logout} className="rounded-2xl focus:bg-[#d81b60]/20 hover:bg-[#d81b60]/20 dark:focus:bg-[#d81b60]/30 dark:hover:bg-[#d81b60]/20 cursor-pointer py-3 px-3.5 group transition-all duration-300">
                <div className="flex items-center gap-3.5 w-full">
                  <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-[#d81b60]/30 to-[#f48fb1]/30 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-12 transition-all duration-300 shadow-sm border-2 border-[#d81b60]/40">
                    <LogOut className="h-5 w-5 text-[#d81b60] dark:text-[#f48fb1]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-[#d81b60] dark:text-[#f48fb1] group-hover:text-[#c2185b] transition-colors">
                      {t("logout")}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {app.lang === "ar" ? "تسجيل الخروج الآمن" : "Sign out securely"}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>

            <div className="px-5 py-3 bg-pink-50/90 dark:bg-slate-900/60 border-t-2 border-[#d81b60]/30">
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                <span>
                  {app.lang === "ar" ? "الحالة" : "Status"}: <strong className="text-[#d81b60] dark:text-[#f48fb1]">آمن ومحمي</strong>
                </span>
                <span className="flex items-center gap-1.5 bg-[#d81b60]/10 px-2.5 py-1 rounded-full border-2 border-[#d81b60]/40">
                  <span className="h-2 w-2 rounded-full bg-[#d81b60] animate-ping" />
                  <span className="text-[#d81b60] dark:text-[#f48fb1] font-black">{app.lang === "ar" ? "متصل الآن" : "Online"}</span>
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="p-7 text-center border-b-2 border-[#d81b60]/30 bg-gradient-to-b from-[#d81b60]/10 via-pink-50/10 to-transparent">
              <div className="h-18 w-18 rounded-3xl bg-[#d81b60]/15 border-2 border-[#d81b60]/30 flex items-center justify-center mx-auto mb-3.5 shadow-xl animate-icon-dance">
                <User className="h-9 w-9 text-[#d81b60]" />
              </div>
              <p className="font-black text-lg text-slate-900 dark:text-white">
                {app.lang === "ar" ? "أهلاً بك" : "Welcome"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 font-medium">
                {app.lang === "ar" ? "سجل الدخول للميزات الفاخرة" : "Sign in to access luxury features"}
              </p>
            </div>
            
            <div className="p-3 space-y-2">
              <DropdownMenuItem asChild className="rounded-2xl focus:bg-[#d81b60]/20 hover:bg-[#d81b60]/15 dark:focus:bg-[#d81b60]/30 dark:hover:bg-[#d81b60]/20 cursor-pointer py-3.5 px-4 transition-all group">
                <Link to="/auth/$mode" params={{ mode: "login" }} className="flex items-center gap-3.5 w-full">
                  <div className="h-10 w-10 rounded-2xl bg-[#d81b60]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <LogIn className="h-5 w-5 text-[#d81b60]" />
                  </div>
                  <span className="font-black text-sm text-slate-800 dark:text-slate-100">{t("login")}</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="rounded-2xl focus:bg-[#d81b60]/20 hover:bg-[#d81b60]/15 dark:focus:bg-[#d81b60]/30 dark:hover:bg-[#d81b60]/20 cursor-pointer py-3.5 px-4 transition-all group">
                <Link to="/auth/$mode" params={{ mode: "register" }} className="flex items-center gap-3.5 w-full">
                  <div className="h-10 w-10 rounded-2xl bg-[#d81b60]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <UserPlus className="h-5 w-5 text-[#d81b60]" />
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
  <TooltipContent side="bottom" className="rounded-2xl bg-[#d81b60] text-white border-2 border-[#f48fb1]/50 px-4 py-2 shadow-xl font-bold">
    <p>{app.user ? (app.lang === "ar" ? "حسابي" : "My Account") : (app.lang === "ar" ? "تسجيل الدخول" : "Login")}</p>
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
          className="ms-1 px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-r from-pink-500/10 to-pink-600/10 hover:from-pink-500/20 hover:to-pink-600/20 text-pink-600 dark:text-pink-300 shadow-sm shadow-pink-500/20 hover:shadow-md hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5 border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 animate-pulse-slow cursor-pointer shrink-0"
        >
          <LayoutDashboard className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-pink-500 group-hover:rotate-12 transition-transform" />
          {app.lang === "ar" ? "👑 لوحة الأدمن" : "👑 Admin"}
        </Link>
      );
    }
    if (isSeller) {
      return (
        <Link 
          to="/dashboard" 
          className="ms-1 px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-r from-pink-500/10 to-pink-600/10 hover:from-pink-500/20 hover:to-pink-600/20 text-pink-600 dark:text-pink-300 shadow-sm shadow-pink-500/20 hover:shadow-md hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5 border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 animate-pulse-slow cursor-pointer shrink-0"
        >
          <Store className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-pink-500 group-hover:rotate-12 transition-transform" />
          {app.lang === "ar" ? "🛍️ لوحة البائع" : "🛍️ Seller"}
        </Link>
      );
    }
    // ✅ ✅ ✅ إذا كان مستخدم عادي (ليس بائع) → يوجه إلى /become-seller
    return (
      <Link 
        to="/become-seller"
        className="ms-1 px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-r from-pink-500/10 to-pink-600/10 hover:from-pink-500/20 hover:to-pink-600/20 text-pink-600 dark:text-pink-300 shadow-sm shadow-pink-500/20 hover:shadow-md hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5 border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 animate-pulse-slow cursor-pointer shrink-0"
      >
        <Store className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-pink-500 group-hover:rotate-12 transition-transform" />
        {app.lang === "ar" ? "🚀 طلب فتح متجر" : "🚀 Open Store"}
      </Link>
    );
  }
  
  // ✅ ✅ ✅ إذا كان المستخدم غير مسجل → يوجه إلى /become-seller
  return (
    <Link 
      to="/become-seller"
      className="ms-1 px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold bg-gradient-to-r from-pink-500/10 to-pink-600/10 hover:from-pink-500/20 hover:to-pink-600/20 text-pink-600 dark:text-pink-300 shadow-sm shadow-pink-500/20 hover:shadow-md hover:shadow-pink-500/40 transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap flex items-center gap-1.5 border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 animate-pulse-slow cursor-pointer shrink-0"
    >
      <Store className="h-3 w-3 xs:h-3.5 xs:w-3.5 sm:h-4 sm:w-4 text-pink-500 group-hover:rotate-12 transition-transform" />
      {app.lang === "ar" ? "🚀 طلب فتح متجر" : "🚀 Open Store"}
    </Link>
  );
})()}
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-3 pb-2.5 flex gap-1.5">
          <div className="relative flex-1">
            <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
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
      ? 'border-pink-500 bg-card shadow-lg shadow-pink-500/20 dark:shadow-pink-400/30'
      : 'border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500'
  }`}
/>
          </div>
          
         <VoiceSearch
  onResult={handleVoiceSearch}
  lang={isRTL ? "ar-SA" : "en-US"}
  buttonSize="sm"
  className="border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20"
/>
          
          <Button 
            onClick={doSearch}
            size="icon" 
            className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <Search className="h-4 w-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-10 w-10 shrink-0 rounded-xl border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-pink-400/50 hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 transition-all duration-300 flex items-center justify-center group relative">
                <MapPin className="h-4 w-4 text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-110 transition-transform" />
                {gov !== "all" && (
                  <span className="absolute -top-0.5 -end-0.5 h-2.5 w-2.5 rounded-full bg-pink-500 ring-2 ring-background animate-pulse" />
                )}
              </button>
            </DropdownMenuTrigger>
<DropdownMenuContent align="end" className="max-h-80 overflow-auto rounded-xl p-1 border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-xl">
  <DropdownMenuItem onClick={() => setGov("all")} className="rounded-lg hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white cursor-pointer flex items-center gap-2 text-sm transition-all duration-200">
    <Globe className="h-4 w-4 text-muted-foreground group-hover:text-white" />
    {t("all_governorates")}
    {gov === "all" && <Check className="h-4 w-4 ms-auto text-pink-500" />}
  </DropdownMenuItem>
  <DropdownMenuSeparator />
  {govs.map((g) => (
    <DropdownMenuItem key={g.id} onClick={() => setGov(g.slug)} className="rounded-lg hover:bg-pink-500 hover:text-white dark:hover:bg-pink-600 dark:hover:text-white cursor-pointer flex items-center gap-2 text-sm transition-all duration-200">
      <MapPin className="h-3.5 w-3.5 text-muted-foreground group-hover:text-white" />
      {app.lang === "ar" ? g.name_ar : g.name_en}
      {gov === g.slug && <Check className="h-4 w-4 ms-auto text-pink-500" />}
    </DropdownMenuItem>
  ))}
</DropdownMenuContent>
          </DropdownMenu>
        </div>

     {/* ✅ Category Strip - بوردر وردي */}
<div className="relative border-t-2 border-pink-400/50 bg-gradient-to-r from-[#173d38] via-[#2a655f] to-[#173d38] backdrop-blur-md overflow-hidden py-3 shadow-2xl">
  
  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-200/20 via-transparent to-transparent animate-pulse pointer-events-none" />
  
  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-pink-200 to-transparent shadow-[0_0_12px_rgba(244,114,182,0.6)]" />

  <style>{`
    @keyframes marquee-scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: flex;
      width: max-content;
      animation: marquee-scroll 180s linear infinite;
      will-change: transform;
    }
    .marquee-track.paused {
      animation-play-state: paused !important;
    }
    
    @keyframes shimmerAnimation {
      100% { transform: translateX(200%); }
    }
    .animate-shimmer {
      animation: shimmerAnimation 2s infinite;
    }

    @keyframes offer-icon-dance {
      0%, 100% { transform: scale(1) rotate(0deg); }
      25% { transform: scale(1.25) rotate(-10deg); }
      50% { transform: scale(1.1) rotate(10deg); }
      75% { transform: scale(1.25) rotate(-5deg); }
    }
    .offer-icon-special {
      animation: offer-icon-dance 1.2s ease-in-out infinite;
    }

    @keyframes float-icon {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-4px) rotate(2deg); }
    }
    .float-icon {
      animation: float-icon 3s ease-in-out infinite;
    }

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
    @keyframes pulse-slow {
      0%, 100% { 
        transform: scale(1);
        box-shadow: 0 0 10px rgba(236,72,153,0.2);
      }
      50% { 
        transform: scale(1.02);
        box-shadow: 0 0 25px rgba(236,72,153,0.4);
      }
    }
    .animate-pulse-slow {
      animation: pulse-slow 2s ease-in-out infinite;
    }
    
    @keyframes float-bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-3px); }
    }
    .animate-float-bounce {
      animation: float-bounce 1.5s ease-in-out infinite;
    }
  `}</style>

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
      
      {[...categories, ...categories].map((c: any, index: number) => {
        const Icon = getCategoryIcon(c.icon);
        const totalCategories = categories.length;
        const originalIndex = index % totalCategories;
        const isRtl = app.lang === "ar";
        
        const isOffer = c.slug === "offers" || c.slug === "deals" || c.name_ar?.includes("عروض") || c.name_en?.toLowerCase().includes("offers") || c.name_en?.toLowerCase().includes("deals");
        
        if (isOffer) {
          return (
            <Link
              key={`${c.id}-${index}`}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative shrink-0 flex items-center gap-3 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all duration-300 bg-gradient-to-r from-pink-100 via-pink-200 to-pink-300 text-pink-800 shadow-[0_0_35px_rgba(216,27,96,0.2)] hover:shadow-[0_0_55px_rgba(194,24,91,0.35)] hover:scale-105 hover:-translate-y-1 cursor-pointer overflow-hidden border-3 border-[#d81b60]/60 hover:border-[#c2185b] animate-pulse"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-transparent -translate-x-full animate-shimmer pointer-events-none" />
              
              <div className="relative flex items-center justify-center h-8 w-8 rounded-full bg-pink-300/30 border-2 border-pink-300 shadow-lg overflow-hidden offer-icon-special">
                {c.image_url ? (
                  <OptimizedImage
                    src={c.image_url}
                    alt={isRtl ? c.name_ar : (c.name_en || c.name_ar)}
                    width={32}
                    height={32}
                    quality={80}
                    objectFit="cover"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <Icon className="h-4 w-4 text-pink-600" />
                )}
              </div>

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
        
        return (
          <Link
            key={`${c.id}-${index}`}
            to="/category/$slug"
            params={{ slug: c.slug }}
            className="group relative shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl font-medium text-xs transition-all duration-300 bg-white/10 hover:bg-pink-500/20 text-white shadow-lg border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 hover:scale-105 hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm"
          >
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            
            <div className="relative flex items-center justify-center h-7 w-7 rounded-full bg-black/30 border border-white/25 shadow-inner overflow-hidden group-hover:scale-110 transition-transform float-icon">
              {c.image_url ? (
                <OptimizedImage
                  src={c.image_url}
                  alt={isRtl ? c.name_ar : (c.name_en || c.name_ar)}
                  width={28}
                  height={28}
                  quality={80}
                  objectFit="cover"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <Icon className="h-3.5 w-3.5 text-emerald-300 group-hover:text-white transition-colors" />
              )}
            </div>
            
            <span className="whitespace-nowrap font-semibold tracking-wide text-white/95 group-hover:text-white" dir={isRtl ? "rtl" : "ltr"}>
              {isRtl ? c.name_ar : (c.name_en || c.name_ar)}
            </span>
            
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-pink-400 shadow-[0_0_6px_rgba(244,114,182,1)]" />
          </Link>
        );
      })}
      
    </div>
  </div>
</div>
      </header>
    </TooltipProvider>
  );
});