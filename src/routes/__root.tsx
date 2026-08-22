// src/__root.tsx - الكود المصحح بالكامل مع AI Assistant وحماية متقدمة للـ Routes

import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, type ReactNode, useState, useRef, useCallback, useMemo } from "react";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProvider, useApp } from "@/lib/i18n";
import { Header } from "@/components/layout/Header";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";

// ===== ✅ استيراد subscribeToPush =====
import { isPushSupported, subscribeToPush } from '@/lib/pushNotifications';
// ===== إضافة Imports الإشعارات =====
import { Bell, BellOff, Check, Clock, ShoppingBag, Calendar as CalendarIcon, Settings, Gift, Shield, MoreVertical, Trash2, X, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
// ===== نهاية Imports الإشعارات =====

// ===== ✅ استيراد LoginSplash بدلاً من DeliverySplash =====
import { LoginSplash } from "@/components/LoginSplash";

// بعد الـ imports الموجودة
import { ClientOnly } from "@/components/ClientOnly";
// ===== ✅ إضافة استيراد جميع Hooks Realtime =====
import {
  useProfileWithUpdate,
  useFavoritesRealtime,
  useListingsRealtime,
  useCartRealtime,
  useOrdersRealtime,

  useStoresRealtime,
  useCategoriesRealtime,
} from "@/lib/hooks";



// ===== ✅ ✅ ✅ ProgressBar Component - z-index معدل ✅ ✅ ✅
const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[50] bg-[#2a655f]/10 dark:bg-[#2a655f]/20">
      <div 
        className="h-full bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#4a9f95] transition-all duration-300 ease-out relative"
        style={{ width: `${Math.min(progress, 100)}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
      </div>
    </div>
  );
};

// ===== دالة 404 =====
function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black bg-gradient-to-br from-primary to-primary-glow bg-clip-text text-transparent">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <a href="/" className="mt-6 inline-flex rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">Go home</a>
      </div>
    </div>
  );
}

// ===== دالة Error =====
function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "root" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong.</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

// ===== Route Definition =====
export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "السوق لعندك — Syria's Super Marketplace" },
      { name: "description", content: "السوق لعندك: منصة سوريا الشاملة للتسوق والخدمات والعقارات والمطاعم والسياحة والسيارات — كل ما تحتاجه بمكان واحد." },
      { property: "og:title", content: "السوق لعندك — Syria's Super Marketplace" },
      { property: "og:description", content: "اكتشف كل ما تحتاجه في سوريا بمكان واحد: متاجر، خدمات، عقارات، أطباء وأكثر." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

// ===== RootShell =====
function RootShell({ children }: { children: ReactNode }) {
  return (
    <html 
      lang="ar" 
      dir="rtl" 
      style={{ 
        overflowY: 'scroll',
        scrollBehavior: 'smooth'
      }}
    >
      <head><HeadContent /></head>
      <body style={{ 
        overflowX: 'hidden',
        width: '100%'
      }}>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

// ===== ✅ ✅ ✅ مكون طلب الإشعارات الاحترافي - بألوان السستم =====
function NotificationPermissionHandler() {
  const app = useApp();
  const [showBanner, setShowBanner] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ ثوابت localStorage
  const BANNER_SHOWN_KEY = 'notification_banner_shown_v2';
  const BANNER_REMIND_KEY = 'notification_banner_remind_at';
  const BANNER_DISMISSED_KEY = 'notification_banner_dismissed_forever';

  useEffect(() => {
    const checkAndRequestPermission = async () => {
      if (!app.user) {
        console.log('⏳ No user, skipping notification request');
        return;
      }
      
      if (!isPushSupported()) {
        console.log('❌ Push not supported');
        return;
      }
      
      const currentPermission = Notification.permission;
      setPermission(currentPermission);
      console.log('🔔 Current notification permission:', currentPermission);
      
      if (currentPermission !== 'default') {
        console.log(`⏳ Permission already ${currentPermission}`);
        return;
      }
      
      const dismissedForever = localStorage.getItem(BANNER_DISMISSED_KEY) === 'true';
      if (dismissedForever) {
        console.log('🚫 Banner dismissed forever');
        return;
      }
      
      const hasShown = localStorage.getItem(BANNER_SHOWN_KEY) === 'true';
      if (hasShown) {
        console.log('✅ Banner already shown before (once)');
        return;
      }
      
      const remindAt = localStorage.getItem(BANNER_REMIND_KEY);
      if (remindAt) {
        const remindTime = parseInt(remindAt);
        const now = Date.now();
        
        if (now < remindTime) {
          const daysLeft = Math.ceil((remindTime - now) / (1000 * 60 * 60 * 24));
          console.log(`⏳ Reminder in ${daysLeft} days`);
          return;
        }
        
        console.log('🔔 Reminder time reached, showing banner');
        localStorage.removeItem(BANNER_REMIND_KEY);
      }
      
      setTimeout(() => {
        setShowBanner(true);
      }, 2000);
    };
    
    checkAndRequestPermission();
  }, [app.user]);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      console.log('🔔 Requesting notification permission...');
      const result = await Notification.requestPermission();
      setPermission(result);
      console.log('🔔 Permission result:', result);
      
      if (result === 'granted') {
        setShowBanner(false);
        localStorage.setItem(BANNER_SHOWN_KEY, 'true');
        localStorage.removeItem(BANNER_REMIND_KEY);
        
        toast.success(
          app.lang === "ar" 
            ? "🔔 شكراً لتفعيل الإشعارات! سنخبرك بكل جديد." 
            : "🔔 Thanks for enabling notifications! We'll keep you updated.",
          { duration: 4000, position: 'top-center', icon: '🔔' }
        );
      } else if (result === 'denied') {
        toast.info(
          app.lang === "ar" 
            ? "يمكنك تفعيل الإشعارات لاحقاً من إعدادات المتصفح 🔔" 
            : "You can enable notifications later from browser settings 🔔",
          { duration: 4000 }
        );
        setShowBanner(false);
        
        const oneMonthLater = Date.now() + (30 * 24 * 60 * 60 * 1000);
        localStorage.setItem(BANNER_REMIND_KEY, oneMonthLater.toString());
      }
    } catch (error) {
      console.error('❌ Error requesting notification permission:', error);
      toast.error(
        app.lang === "ar" 
          ? "حدث خطأ أثناء طلب الإشعارات" 
          : "Error requesting notifications"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseBanner = () => {
    setShowBanner(false);
    const oneMonthLater = Date.now() + (30 * 24 * 60 * 60 * 1000);
    localStorage.setItem(BANNER_REMIND_KEY, oneMonthLater.toString());
    console.log(`📅 Reminder set for ${new Date(oneMonthLater).toLocaleDateString()}`);
  };

  const handleDismissForever = () => {
    setShowBanner(false);
    localStorage.setItem(BANNER_DISMISSED_KEY, 'true');
    localStorage.setItem(BANNER_SHOWN_KEY, 'true');
    console.log('🚫 Banner dismissed forever');
    
    toast.info(
      app.lang === "ar" 
        ? "يمكنك تفعيل الإشعارات لاحقاً من الإعدادات 🔔" 
        : "You can enable notifications later from settings 🔔",
      { duration: 3000 }
    );
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] animate-in slide-in-from-bottom-full duration-500">
      <div className="mx-auto max-w-7xl px-4 pb-4">
        <div className="relative bg-gradient-to-r from-[#173d38] via-[#2a655f] to-[#3a8a82] rounded-2xl shadow-2xl shadow-[#2a655f]/30 p-4 md:p-5 border border-[#4a9f95]/30">
          <button
            onClick={handleDismissForever}
            className="absolute top-2 right-2 md:top-3 md:right-3 text-white/60 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 md:h-14 md:w-14 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border border-white/20 shadow-lg shadow-[#2a655f]/20">
                <BellRing className="h-6 w-6 md:h-7 md:w-7 text-white animate-pulse" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-right">
              <h4 className="text-white font-bold text-sm md:text-base flex items-center justify-center sm:justify-start gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
                {app.lang === "ar" ? "🔔 فعّل الإشعارات" : "🔔 Enable Notifications"}
              </h4>
              <p className="text-emerald-100/90 text-xs md:text-sm mt-0.5 font-medium">
                {app.lang === "ar" 
                  ? "احصل على تحديثات فورية عن الطلبات والعروض الجديدة" 
                  : "Get instant updates about orders and new offers"}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0 flex-wrap justify-center">
              <Button
                onClick={handleEnableNotifications}
                disabled={isLoading}
                className="h-10 md:h-11 px-4 md:px-6 rounded-xl bg-white text-[#2a655f] hover:bg-emerald-50 font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm md:text-base border-2 border-white/30 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-[#2a655f] border-t-transparent" />
                ) : (
                  <BellRing className="h-4 w-4 mr-2 text-[#2a655f]" />
                )}
                {isLoading 
                  ? (app.lang === "ar" ? "جاري..." : "Loading...")
                  : (app.lang === "ar" ? "تفعيل الآن" : "Enable Now")
                }
              </Button>
              <Button
                variant="ghost"
                onClick={handleCloseBanner}
                className="h-10 md:h-11 px-3 md:px-4 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors text-sm border border-white/20"
              >
                {app.lang === "ar" ? "تذكير لاحقاً" : "Remind later"}
              </Button>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-300/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}

// ===== مكون الإشعارات الداخلي =====
function NotificationsProvider() {
  const app = useApp();
  
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: notifications = [], refetch: refetchNotifications } = useNotifications(app.user?.id);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  async function handleNotificationClick(notification: any) {
    if (!notification.is_read) {
      try {
        const { error } = await supabase
          .from('notifications')
          .update({ is_read: true })
          .eq('id', notification.id)
         .eq('user_id', app.user!.id)
        
        if (error) throw error;
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
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
      .eq('user_id', app.user!.id)
      
      if (error) throw error;
      await refetchNotifications();
      toast.success(app.lang === "ar" ? "تم تحديد الإشعار كمقروء" : "Notification marked as read");
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }

  async function handleMarkAllAsRead() {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
       .eq('user_id', app.user!.id)
        .eq('is_read', false);
      
      if (error) throw error;
      await refetchNotifications();
      toast.success(app.lang === "ar" ? "تم تحديد الكل كمقروء" : "All notifications marked as read");
    } catch (error) {
      console.error("Error marking all as read:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }

  function getNotificationIcon(type: string) {
    switch (type) {
      case 'order': return <ShoppingBag className="h-4 w-4" />;
      case 'booking': return <Clock className="h-4 w-4" />;
      case 'admin': return <Settings className="h-4 w-4" />;
      case 'favorite_offer': return <Gift className="h-4 w-4" />;
      case 'system': return <Shield className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  }

  function getStatusColor(type: string) {
    switch (type) {
      case 'order':
        return "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 dark:bg-[#2a655f]/20 dark:text-[#3a8a82] dark:border-[#2a655f]/30";
      case 'booking':
        return "bg-[#3a8a82]/10 text-[#3a8a82] border-[#3a8a82]/20 dark:bg-[#3a8a82]/20 dark:text-[#4a9f95] dark:border-[#3a8a82]/30";
      case 'admin':
        return "bg-[#1a4f4a]/10 text-[#1a4f4a] border-[#1a4f4a]/20 dark:bg-[#1a4f4a]/20 dark:text-[#2a655f] dark:border-[#1a4f4a]/30";
      case 'favorite_offer':
        return "bg-amber-500/10 text-amber-600 border-amber-200 dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-800";
      default:
        return "bg-slate-500/10 text-slate-600 border-slate-200 dark:bg-slate-500/20 dark:text-slate-400 dark:border-slate-800";
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

  if (!app.user) return null;

  return (
    <div className="fixed bottom-6 start-6 z-50">
      <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
        <DialogTrigger asChild>
          <Button 
            size="icon" 
            className={`
              h-14 w-14 rounded-full shadow-2xl 
              bg-gradient-to-br from-[#2a655f] to-[#3a8a82] 
              hover:shadow-[0_0_30px_rgba(42,101,95,0.5)] 
              transition-all duration-500 hover:scale-110 relative group
              border-2 border-[#4a9f95]/30
              animate-pulse-glow
            `}
            style={{
              animation: 'pulseGlow 3s ease-in-out infinite'
            }}
          >
            <span className="absolute -inset-1 rounded-full border-2 border-[#2a655f]/20 animate-ripple opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="absolute -inset-3 rounded-full border-2 border-[#3a8a82]/10 animate-ripple delay-700 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <span className="absolute -inset-5 rounded-full border-2 border-[#4a9f95]/5 animate-ripple delay-1500 opacity-0 group-hover:opacity-100 transition-opacity duration-900" />
            
            <Bell className="
              h-6 w-6 text-white 
              group-hover:scale-110 group-hover:rotate-12 
              transition-all duration-500
              animate-float-bell
            " />
            
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-6 min-w-6 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center animate-pulse border-2 border-white shadow-lg shadow-red-500/50">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900">
          <div className="sticky top-0 z-10 bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/30 dark:to-[#3a8a82]/20 backdrop-blur-xl border-b border-[#2a655f]/20 dark:border-[#2a655f]/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/25">
                    <Bell className="h-5 w-5 text-white" />
                  </div>
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white dark:border-slate-900">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "الإشعارات" : "Notifications"}
                  </DialogTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {unreadCount > 0
                      ? app.lang === "ar"
                        ? `${unreadCount} إشعار غير مقروء`
                        : `${unreadCount} unread`
                      : app.lang === "ar"
                      ? "كل الإشعارات مقروءة ✨"
                      : "All caught up ✨"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs gap-1.5 rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 text-[#2a655f] dark:text-[#3a8a82] transition-all"
                    onClick={handleMarkAllAsRead}
                    disabled={markAllRead.isPending}
                  >
                    {markAllRead.isPending ? (
                      <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#2a655f] border-t-transparent" />
                    ) : (
                      <Check className="h-3.5 w-3.5" />
                    )}
                    {app.lang === "ar" ? "تحديد الكل" : "Mark all read"}
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

          <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1.5">
            {notifications.length === 0 ? (
              <div className="py-16 text-center">
                <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 dark:bg-[#2a655f]/20 flex items-center justify-center mx-auto mb-4">
                  <BellOff className="h-8 w-8 text-[#2a655f]/40 dark:text-[#3a8a82]/40" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {app.lang === "ar" ? "لا توجد إشعارات" : "No notifications"}
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                  {app.lang === "ar"
                    ? "ستظهر الإشعارات هنا عند استلامها 📬"
                    : "Notifications will appear here 📬"}
                </p>
              </div>
            ) : (
              notifications.map((notification: any) => {
                const isUnread = !notification.is_read;
                const statusColor = getStatusColor(notification.type);
                const icon = getNotificationIcon(notification.type);

                return (
                  <div
                    key={notification.id}
                    className={`group relative rounded-xl transition-all duration-300 ${
                      isUnread
                        ? "bg-gradient-to-r from-[#2a655f]/10 to-[#3a8a82]/10 dark:from-[#2a655f]/30 dark:to-[#3a8a82]/20 border border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:shadow-md"
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
                              className="h-11 w-11 rounded-xl object-cover border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                            {isUnread && (
                              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-[#2a655f] ring-2 ring-white dark:ring-slate-900" />
                            )}
                          </div>
                        ) : (
                          <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${statusColor} border`}>
                            {icon}
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
                                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${statusColor} border`}>
                                  {notification.type}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex-shrink-0 flex items-center gap-1">
                            {isUnread && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-lg hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 text-[#2a655f] hover:text-[#2a655f]/80 transition-all opacity-0 group-hover:opacity-100"
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
                              <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[160px] border-[#2a655f]/20">
                                {isUnread && (
                                  <DropdownMenuItem
                                    className="rounded-lg text-sm cursor-pointer gap-2 text-[#2a655f] hover:text-[#1a4f4a] hover:bg-[#2a655f]/10"
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
                                      window.location.href = notification.link_url;
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

          {notifications.length > 0 && (
            <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-[#2a655f]/20 dark:border-[#2a655f]/30 p-3 flex items-center justify-between">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                {notifications.length} {app.lang === "ar" ? "إشعار" : "notifications"}
                {unreadCount > 0 && ` · ${unreadCount} ${app.lang === "ar" ? "غير مقروء" : "unread"}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs rounded-xl hover:bg-[#2a655f]/10 dark:hover:bg-[#2a655f]/30 text-[#2a655f] dark:text-[#3a8a82]"
                onClick={() => setNotificationsOpen(false)}
              >
                {app.lang === "ar" ? "إغلاق" : "Close"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ===== ✅ ✅ ✅ مكون إدارة Realtime =====
function RealtimeManager() {
  const app = useApp();

  useProfileWithUpdate();
  useFavoritesRealtime(app.user?.id);
  useListingsRealtime();
  useCartRealtime(app.user?.id);
  useOrdersRealtime(app.user?.id);

  useStoresRealtime();
  useCategoriesRealtime();

  return null;
}

// ============================================================
// ✅ ✅ ✅ مكون RouteGuard الاحترافي - مع حل مشكلة Cache
// ============================================================
function RouteGuard() {
  const app = useApp();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isArabic = app.lang === "ar";
  const currentPathRef = useRef(pathname);
  const previousPathRef = useRef<string | null>(null);

  // ✅ تحديث الـ ref عند تغيير المسار
  useEffect(() => {
    previousPathRef.current = currentPathRef.current;
    currentPathRef.current = pathname;
  }, [pathname]);

  // ✅ تنظيف الـ timeout عند unmount
  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  // ✅ ✅ ✅ حل مشكلة Cache القديم
  const clearCacheIfUserChanged = useCallback(() => {
    if (!app.user) return;
    
    const cachedUserId = sessionStorage.getItem('cached_user_id');
    const currentUserId = app.user.id;
    
    if (cachedUserId && cachedUserId !== currentUserId) {
      console.log('🔄 [RouteGuard] User changed, clearing cache...');
      sessionStorage.removeItem('user_roles');
      sessionStorage.removeItem('cached_user_id');
      console.log('✅ [RouteGuard] Cache cleared for new user');
    }
    
    // ✅ إذا لم يكن هناك cached_user_id، قم بتعيينه
    if (!cachedUserId) {
      sessionStorage.setItem('cached_user_id', currentUserId);
      console.log('✅ [RouteGuard] cached_user_id set to:', currentUserId);
    }
  }, [app.user]);

  // ✅ تنفيذ مسح الـ Cache عند تغيير المستخدم
  useEffect(() => {
    clearCacheIfUserChanged();
  }, [app.user, clearCacheIfUserChanged]);

  // ✅ دوال التحقق من الصلاحيات - تجبر جلب الأدوار من الـ DB
const checkAuthorization = useCallback(async () => {
  // ✅ إذا لم يكن هناك مستخدم، السماح بالوصول (لصفحات التسجيل والدخول)
  if (!app.user) {
    setLoading(false);
    setIsAuthorized(true);
    return;
  }

  try {
    // ✅ ✅ ✅ إجبار جلب الأدوار من قاعدة البيانات مباشرة (تجاهل Cache)
    console.log('🔄 [RouteGuard] Forcing fresh roles from DB...');
    
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", app.user.id);

    if (error) throw error;
    
    const roles = data?.map((r: any) => r.role) || [];
    
    // ✅ ✅ ✅ تحديث الـ Cache بالدور الجديد
    sessionStorage.setItem('user_roles', JSON.stringify(roles));
    sessionStorage.setItem('cached_user_id', app.user.id);
    console.log('📦 [RouteGuard] Fresh roles from DB:', roles);

    const isAdmin = roles.includes("admin");
    const isDeliveryCompany = roles.includes("delivery_company");
    const isDistributor = roles.includes("distributor");

    console.log("🔍 [RouteGuard] Path:", pathname);
    console.log("🔍 [RouteGuard] Roles:", { isAdmin, isDeliveryCompany, isDistributor });

    // ============================================================
    // ❌ منع الوصول لـ /dashboard لجميع الأدوار عدا البائع
    // ============================================================
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
      // ✅ إذا كان المستخدم بائع (seller) → يسمح له
      if (roles.includes("seller")) {
        console.log('✅ [RouteGuard] Seller → access granted to /dashboard');
        setLoading(false);
        setIsAuthorized(true);
        return;
      }
      
      // ❌ أي دور آخر (موزع، شركة توصيل، أدمن، مستخدم عادي) → يمنع
      console.log('🚫 [RouteGuard] Blocked: /dashboard for role:', roles);
      redirectToSafePage(isAdmin, isDeliveryCompany, isDistributor);
      return;
    }

    // ============================================================
    // ✅ 1. تعريف المسارات المسموحة لكل دور
    // ============================================================
    
    // ✅ المسارات العامة (متاحة للجميع)
    const publicPaths = [
      "/",
      "/auth",
      "/auth/login",
      "/auth/register",
      "/reset-password",
      "/products",
      "/categories",
      "/search",
      "/voice-search",
      "/listing",
      "/offer",
      "/cart",
      "/orders",
      "/tracking",
      "/contact",
      "/about",
      "/terms",
      "/privacy",
    ];

    // ✅ المسارات الخاصة بالمسؤول (Admin)
    const adminPaths = [
      "/admin",
      "/admin/dashboard",
      "/admin/users",
      "/admin/orders",
      "/admin/products",
      "/admin/categories",
      "/admin/settings",
      "/admin/analytics",
      "/admin/reports",
      "/admin/promo-codes",
      "/admin/announcements",
      "/admin/banners",
      "/admin/delivery",
      "/admin/delivery/companies",
      "/admin/delivery/distributors",
      "/admin/delivery/orders",
      "/admin/delivery/admins",
      "/admin/offers",
      "/admin/bookings",
      "/admin/complaints",
      "/admin/reviews",
      "/admin/notifications",
      "/admin/logs",
      "/admin/backup",
      "/admin/restore",
      "/admin/import",
      "/admin/export",
      "/admin/tools",
    ];

    // ✅ المسارات الخاصة بشركة التوصيل (Delivery Company)
    const deliveryPaths = [
      "/delivery/dashboard",
      "/delivery/orders",
      "/delivery/orders/new",
      "/delivery/orders",
      "/delivery/distributors",
      "/delivery/messages",
      "/delivery/conversation",
      "/delivery/settings",
      "/delivery/reports",
      "/delivery/analytics",
      "/delivery/complete",
      "/delivery/admins",
      "/delivery/notifications",
      "/delivery/tracking",
    ];

    // ✅ المسارات الخاصة بالموزع (Distributor)
    const distributorPaths = [
      "/distributor/dashboard",
      "/distributor/messages",
      "/distributor/conversation",
      "/distributor/settings",
      "/distributor/review",
      "/distributor/notifications",
      "/distributor/tracking",
      "/distributor/orders",
      "/distributor/earnings",
      "/distributor/profile",
      "/distributor/complete",
    ];

    // ============================================================
    // ✅ 2. التحقق من الوصول مع توجيه الأدوار للصفحة الرئيسية
    // ============================================================

    // ✅ 2.1 التحقق من المسارات العامة
    const isPublicPath = publicPaths.some(path => 
      pathname === path || pathname.startsWith(path + '/')
    );

    // ✅ ✅ ✅ 2.1.1 إذا كان المسار هو الصفحة الرئيسية، نوجه حسب الدور
    if (pathname === "/") {
      // ✅ إذا كان المستخدم مسجل
      if (app.user) {
        // ✅ موزع → Dashboard الموزع
        if (roles.includes('distributor')) {
          console.log('🔄 [RouteGuard] Distributor → Redirecting to /distributor/dashboard');
          setLoading(false);
          setIsAuthorized(false);
          navigate({ to: '/distributor/dashboard', replace: true });
          return;
        }
        
        // ✅ شركة توصيل → Dashboard التوصيل
        if (roles.includes('delivery_company')) {
          console.log('🔄 [RouteGuard] Delivery Company → Redirecting to /delivery/dashboard');
          setLoading(false);
          setIsAuthorized(false);
          navigate({ to: '/delivery/dashboard', replace: true });
          return;
        }
        
        // ✅ مسؤول → Dashboard الإدارة
        if (roles.includes('admin')) {
          console.log('🔄 [RouteGuard] Admin → Redirecting to /admin/dashboard');
          setLoading(false);
          setIsAuthorized(false);
          navigate({ to: '/admin/dashboard', replace: true });
          return;
        }
        
        // ✅ بائع → Dashboard البائع
        if (roles.includes('seller')) {
          console.log('🔄 [RouteGuard] Seller → Redirecting to /dashboard');
          setLoading(false);
          setIsAuthorized(false);
          navigate({ to: '/dashboard', replace: true });
          return;
        }
        
        // ✅ مستخدم عادي → يبقى في الصفحة الرئيسية
        console.log('✅ [RouteGuard] Regular user → Access granted to /');
        setLoading(false);
        setIsAuthorized(true);
        return;
      }
      
      // ✅ إذا كان المستخدم غير مسجل → يبقى في الصفحة الرئيسية
      console.log('✅ [RouteGuard] Guest → Access granted to /');
      setLoading(false);
      setIsAuthorized(true);
      return;
    }

    if (isPublicPath) {
      console.log('✅ [RouteGuard] Public path, access granted:', pathname);
      setLoading(false);
      setIsAuthorized(true);
      return;
    }

    // ✅ 2.2 إذا كان المستخدم مسؤول (Admin)
    if (isAdmin) {
      // ✅ المسؤول يسمح له بكل شيء عدا /dashboard (تم منعها أعلاه)
      console.log('✅ [RouteGuard] Admin, access granted:', pathname);
      setLoading(false);
      setIsAuthorized(true);
      return;
    }

    // ✅ 2.3 إذا كان المستخدم شركة توصيل (Delivery Company)
    if (isDeliveryCompany) {
      const isDeliveryPath = deliveryPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );
      
      if (isDeliveryPath) {
        console.log('✅ [RouteGuard] Delivery path, access granted:', pathname);
        setLoading(false);
        setIsAuthorized(true);
        return;
      }

      // ❌ منع شركة التوصيل من الوصول لصفحات الموزع أو المسؤول
      const isDistributorPath = distributorPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );
      const isAdminPath = adminPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );
      
      if (isDistributorPath || isAdminPath) {
        console.log('🚫 [RouteGuard] Delivery → blocked path:', pathname);
        redirectToSafePage(isAdmin, isDeliveryCompany, isDistributor);
        return;
      }
    }

    // ✅ 2.4 إذا كان المستخدم موزع (Distributor)
    if (isDistributor) {
      const isDistributorPath = distributorPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );
      
      if (isDistributorPath) {
        console.log('✅ [RouteGuard] Distributor path, access granted:', pathname);
        setLoading(false);
        setIsAuthorized(true);
        return;
      }

      // ❌ منع الموزع من الوصول لصفحات شركة التوصيل أو المسؤول
      const isDeliveryPath = deliveryPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );
      const isAdminPath = adminPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );
      
      if (isDeliveryPath || isAdminPath) {
        console.log('🚫 [RouteGuard] Distributor → blocked path:', pathname);
        redirectToSafePage(isAdmin, isDeliveryCompany, isDistributor);
        return;
      }
    }

    // ✅ 2.5 مستخدم عادي (بدون دور)
    if (!isAdmin && !isDeliveryCompany && !isDistributor) {
      // ✅ منع المستخدم العادي من الوصول لصفحات الإدارة
      const isRestrictedPath = adminPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      ) || distributorPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      ) || deliveryPaths.some(path => 
        pathname === path || pathname.startsWith(path + '/')
      );
      
      if (isRestrictedPath) {
        console.log('🚫 [RouteGuard] Regular user → restricted path:', pathname);
        redirectToSafePage(isAdmin, isDeliveryCompany, isDistributor);
        return;
      }
    }

    // ✅ إذا لم يتم العثور على أي قاعدة، السماح بالوصول
    console.log('✅ [RouteGuard] No restriction found, access granted:', pathname);
    setLoading(false);
    setIsAuthorized(true);

  } catch (error) {
    console.error('❌ [RouteGuard] Error checking authorization:', error);
    setLoading(false);
    setIsAuthorized(true); // السماح بالوصول في حالة الخطأ
  }
}, [app.user, pathname, navigate, isArabic]);
  // ✅ دالة التوجيه إلى الصفحة الآمنة
  const redirectToSafePage = useCallback((
    isAdmin: boolean,
    isDeliveryCompany: boolean,
    isDistributor: boolean
  ) => {
    // ✅ منع التوجيه المتكرر لنفس المسار
    if (redirectTimeoutRef.current) {
      clearTimeout(redirectTimeoutRef.current);
    }

    // ✅ تحديد الصفحة الآمنة حسب الدور
    let safePath = '/auth/login';
    
    if (isAdmin) safePath = '/admin/dashboard';
    else if (isDistributor) safePath = '/distributor/dashboard';
    else if (isDeliveryCompany) safePath = '/delivery/dashboard';
    else safePath = '/auth/login';

    // ✅ إذا كنا بالفعل في الصفحة الآمنة، لا تفعل شيئاً
    if (pathname === safePath) {
      setLoading(false);
      setIsAuthorized(true);
      return;
    }

    console.log(`🔄 [RouteGuard] Redirecting to: ${safePath}`);

    // ✅ تأخير التوجيه لمنع التنقل السريع
    redirectTimeoutRef.current = setTimeout(() => {
      setLoading(false);
      setIsAuthorized(false);
      
      // ✅ استخدام replace بدلاً من navigate لمنع إضافة الصفحة المحظورة إلى التاريخ
      navigate({ to: safePath, replace: true });
      
      // ✅ عرض رسالة للمستخدم
      toast.warning(
        isArabic 
          ? "⚠️ غير مسموح بالوصول إلى هذه الصفحة. تم إعادة توجيهك." 
          : "⚠️ Access denied. You have been redirected."
      );
    }, 300);
  }, [pathname, navigate, isArabic]);

  // ✅ تنفيذ التحقق
  useEffect(() => {
    checkAuthorization();
  }, [checkAuthorization]);

  // ✅ عرض شاشة تحميل أثناء التحقق (مع تحسين الأداء)
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 z-[9999]">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2a655f] border-t-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-[#2a655f] animate-pulse" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground animate-pulse">
            {isArabic ? "جاري التحقق من الصلاحيات..." : "Checking permissions..."}
          </p>
        </div>
      </div>
    );
  }

  // ✅ إذا لم يكن مصرحاً، لا نعرض المحتوى (سيتم التوجيه)
  if (!isAuthorized) {
    return null;
  }

  return null;
}

// ============================================================
// ✅ RootComponent - لا يستخدم useApp
// ============================================================
function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const location = useRouterState({ select: (s) => s.location });
  
  const [scrollProgress, setScrollProgress] = useState(0);

  // ✅ شريط التقدم
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const progress = (scrollY / (documentHeight - windowHeight)) * 100;
      setScrollProgress(Math.min(progress, 100));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ ضبط السكرول إلى الأعلى
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // ✅ صفحات تخفي الهيدر والفوتر
  const hideChrome = 
    pathname.startsWith("/auth") || 
    pathname.startsWith("/reset-password") ||
    pathname.startsWith("/delivery/dashboard") ||
    pathname.startsWith("/delivery/complete") ||
    pathname.startsWith("/delivery/orders/new") ||
    pathname.startsWith("/delivery/orders/") ||
    pathname.startsWith("/delivery/messages") ||
    pathname.startsWith("/delivery/conversation") ||
    pathname.startsWith("/delivery/conversation/$userId") ||
    pathname.startsWith("/distributor/conversation") ||
    pathname.startsWith("/distributor/conversation/$userId") ||
    pathname.startsWith("/distributor/dashboard") ||
    pathname.startsWith("/distributor/messages") ||
    pathname.startsWith("/delivery/distributors") ||
    pathname.startsWith("/distributor/settings") ||
    pathname.startsWith("/distributor/review") ||
    pathname.startsWith("/messages") ||
    pathname.startsWith("/messages_") ||
    pathname.startsWith("/tracking");
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <RootContent 
          hideChrome={hideChrome} 
          scrollProgress={scrollProgress} 
          location={location}
        />
      </AppProvider>
    </QueryClientProvider>
  );
}

// ============================================================
// ✅ RootContent - يستخدم useApp (داخل AppProvider) مع Realtime للإشعارات و AI Assistant
// ============================================================
function RootContent({ 
  hideChrome, 
  scrollProgress, 
  location 
}: { 
  hideChrome: boolean; 
  scrollProgress: number;
  location: any;
}) {
  const app = useApp();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(false);

  // ============================================================
  // 🔔 Push Notifications - تفعيل الإشعارات المنبثقة
  // ============================================================
  useEffect(() => {
    if (app.user) {
      const timer = setTimeout(() => {
        subscribeToPush(app.user.id).then((success) => {
          if (success) {
            console.log('✅ Push Notifications activated for user:', app.user.id);
          } else {
            console.log('⚠️ Push Notifications not activated for user:', app.user.id);
          }
        });
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [app.user]);

  // ✅ ✅ ✅ إضافة Realtime للإشعارات
  useEffect(() => {
    if (!app.user) return;

    console.log('📡 [Realtime] Setting up notifications channel for user:', app.user.id);

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${app.user.id}`,
        },
        (payload) => {
          const notification = payload.new as any;
          
          console.log('📬 [Realtime] New notification received:', notification);
          
          queryClient.invalidateQueries({ 
            queryKey: ['notifications', 'v2', app.user.id] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['notifications', 'unread', app.user.id] 
          });
          queryClient.invalidateQueries({ 
            queryKey: ['notifications', app.user.id] 
          });
          
          toast.info(notification.body_ar || '📬 لديك إشعار جديد', {
            duration: 5000,
            position: 'bottom-right',
            icon: '🔔',
            action: {
              label: 'عرض',
              onClick: () => {
                if (notification.link_url) {
                  navigate({ to: notification.link_url });
                }
              }
            }
          });

          try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.5;
            audio.play().catch(() => {});
          } catch (e) {}
        }
      )
      .subscribe((status) => {
        console.log(`📡 Realtime notifications status: ${status}`);
      });

    return () => {
      console.log('🧹 [Realtime] Cleaning up notifications channel');
      supabase.removeChannel(channel);
    };
  }, [app.user, queryClient, navigate]);

  // ✅ إظهار السبلاش
  useEffect(() => {
    if (!app?.user) {
      setShowSplash(false);
      return;
    }
    setShowSplash(true);
  }, [app?.user?.id]);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  const isAuthPage = location?.pathname?.startsWith("/auth") || 
                     location?.pathname?.startsWith("/reset-password");

  if (showSplash && !isAuthPage) {
    return (
      <LoginSplash 
        onComplete={handleSplashComplete}
      />
    );
  }

  return (
    <>
      {/* ✅ RouteGuard - حماية متقدمة قبل أي شيء */}
      <RouteGuard />
      
      <RealtimeManager />
      <NotificationPermissionHandler />
      <ProgressBar progress={scrollProgress} />
      
      <ClientOnly>
        <div className="min-h-screen flex flex-col">
          {!hideChrome && <AnnouncementBar />}
          {!hideChrome && <Header />}
          <main className="flex-1"><Outlet /></main>
          {!hideChrome && <Footer />}
        </div>
      </ClientOnly>
      
      <Toaster position="top-center" richColors />
    
    </>
  );
}