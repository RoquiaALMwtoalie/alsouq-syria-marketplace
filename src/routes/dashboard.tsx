import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { 
  Bell, BellOff, Check, CheckCheck, Clock, ShoppingCart, 
  Calendar as CalendarIcon, Settings, Package, Gift, Shield, 
  MoreVertical, Trash2, X, BellRing, Sparkles,
  MessageCircle  // ✅ أضف هذا السطر
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { useApp, useT } from "@/lib/i18n";
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useRealtimeNotifications,
} from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// استيراد مكونات لوحة التحكم
import { SellerDashboard } from "@/components/dashboard/SellerDashboard";
import { AdminDashboard } from "@/components/dashboard/admin";
import { BecomeSellerCard } from "@/components/dashboard/BecomeSellerCard";

// ===== إضافة استيراد دوال الإشعارات الفورية =====
import { 
  subscribeToPush, 
  isPushSupported, 
  requestPushPermission,
  getPushSubscriptionStatus,
  getNotificationPermission
} from "@/lib/pushNotifications";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "لوحة التحكم — السوق اليك" }] }),
});

function Dashboard() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();

  // ===== إضافة State الإشعارات =====
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { data: notifications = [], refetch: refetchNotifications } = useNotifications(app.user?.id);
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  // ===== State للإشعارات الفورية =====
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [popupShown, setPopupShown] = useState(false);

  // ===== تفعيل الاستماع للإشعارات الفورية =====

  // ===== 🔥 التحقق من حالة الإشعارات =====
  useEffect(() => {
    const checkStatus = async () => {
      if (!app.user) return;
      
      const supported = isPushSupported();
      if (!supported) return;

      const perm = getNotificationPermission();
      setPermission(perm);
      
      const subscribed = await getPushSubscriptionStatus();
      setIsSubscribed(subscribed);
      
      // إذا كان المستخدم مشتركاً، لا نظهر البوب أب
      if (subscribed) {
        setPopupShown(true);
        return;
      }
      
      // إذا كان الإذن ممنوعاً، لا نظهر البوب أب (لن يتمكن من التفعيل)
      if (perm === 'denied') {
        setPopupShown(true);
        return;
      }
      
      // إذا لم يظهر البوب أب من قبل، نظهره بعد 3 ثواني
      if (!popupShown) {
        setTimeout(() => {
          setShowNotificationPopup(true);
        }, 3000);
      }
    };

    checkStatus();
  }, [app.user, popupShown]);

  // ===== تفعيل الإشعارات =====
  const enableNotifications = async () => {
    if (!app.user) return;
    
    try {
      // طلب إذن الإشعارات
      const granted = await requestPushPermission();
      
      if (!granted) {
        setPermission('denied');
        toast.info(
          app.lang === "ar" 
            ? "الرجاء السماح بالإشعارات من إعدادات المتصفح 🔔" 
            : "Please allow notifications from browser settings 🔔"
        );
        return;
      }

      // الاشتراك في Push
      const success = await subscribeToPush(app.user.id);
      if (success) {
        setIsSubscribed(true);
        setPermission('granted');
        setShowNotificationPopup(false);
        toast.success(
          app.lang === "ar" 
            ? "🔔 تم تفعيل الإشعارات بنجاح" 
            : "🔔 Notifications enabled successfully"
        );
      } else {
        toast.error(
          app.lang === "ar" 
            ? "حدث خطأ أثناء تفعيل الإشعارات" 
            : "Error enabling notifications"
        );
      }
    } catch (error) {
      console.error('❌ Error enabling notifications:', error);
      toast.error(
        app.lang === "ar" 
          ? "حدث خطأ ما" 
          : "Something went wrong"
      );
    }
  };

  // ===== إغلاق البوب أب =====
  const closePopup = () => {
    setShowNotificationPopup(false);
    setPopupShown(true);
  };

  // ===== التحقق من المصادقة =====
  useEffect(() => {
    if (!app.authLoading && !app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
    }
  }, [app.authLoading, app.user, navigate]);

  if (app.authLoading || !app.user) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        جار التحميل...
      </div>
    );
  }

  const isAdmin = app.roles?.includes("admin") ?? false;
  const isSeller = app.roles?.includes("seller") ?? false;

  // ===== دوال الإشعارات (نفس طريقة الهيدر) =====
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
      case 'order': return <ShoppingCart className="h-4 w-4" />;
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
        return "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800";
      case 'booking':
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800";
      case 'admin':
        return "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800";
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

  // ===== مكون زر الجرس (نفس طريقة الهيدر) =====
  const NotificationButton = () => (
    <Dialog open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group"
        >
          <div className="relative">
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-400 group-hover:scale-110 transition-transform duration-300" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-rose-500 px-1 text-[10px] font-bold text-white shadow-lg shadow-red-500/30 animate-pulse border-2 border-white dark:border-slate-900">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </div>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900">
        {/* ===== HEADER ===== */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-50/90 to-indigo-50/90 dark:from-blue-950/90 dark:to-indigo-950/90 backdrop-blur-xl border-b border-blue-200/30 dark:border-blue-800/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
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
                    ? "كل الإشعارات مقروءة"
                    : "All caught up"}
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
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
                  <CheckCheck className="h-3.5 w-3.5" />
                )}
                {app.lang === "ar" ? "تحديد الكل كمقروء" : "Mark all read"}
              </Button>
            )}
          </div>
        </div>

        {/* ===== LIST ===== */}
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
              const statusColor = getStatusColor(notification.type);
              const icon = getNotificationIcon(notification.type);

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
                    {/* ===== Avatar / Icon with Image ===== */}
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
                        <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${statusColor} border`}>
                          {icon}
                        </div>
                      )}
                    </div>

                    {/* ===== Content ===== */}
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

                        {/* ===== Actions ===== */}
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

        {/* ===== FOOTER ===== */}
        {notifications.length > 0 && (
          <div className="sticky bottom-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 p-3 flex items-center justify-between">
            <span className="text-xs text-slate-400 dark:text-slate-500">
              {notifications.length} {app.lang === "ar" ? "إشعار" : "notifications"}
              {unreadCount > 0 && ` · ${unreadCount} ${app.lang === "ar" ? "غير مقروء" : "unread"}`}
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
  );

  // ===== عرض لوحة التحكم حسب الدور =====
  if (isAdmin) {
    return (
      <>
        <AdminDashboard notificationButton={<NotificationButton />} />
        
        {/* ===== 🔥 Popup الإشعارات الاحترافي ===== */}
        {showNotificationPopup && !isSubscribed && permission !== 'denied' && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full mx-4 p-8 shadow-2xl border border-blue-200/30 dark:border-blue-800/30 animate-in zoom-in-95 duration-300">
              {/* أيقونة */}
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <BellRing className="h-10 w-10 text-white" />
                </div>
              </div>
              
              {/* العنوان */}
              <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
                {app.lang === "ar" ? "🔔 فعّل الإشعارات" : "🔔 Enable Notifications"}
              </h3>
              
              {/* الوصف */}
              <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-6">
                {app.lang === "ar" 
                  ? "احصل على تحديثات فورية حول طلباتك وعروضك الجديدة حتى لو كان التطبيق مغلقاً" 
                  : "Get instant updates about your orders and new offers even when the app is closed"}
              </p>
              
              {/* الفوائد */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/30">
                  <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <ShoppingCart className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {app.lang === "ar" ? "طلبات جديدة" : "New Orders"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {app.lang === "ar" ? "تعرف فوراً عند طلب منتجك" : "Know immediately when your product is ordered"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/30 dark:border-emerald-800/30">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <Gift className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {app.lang === "ar" ? "عروض حصرية" : "Exclusive Offers"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {app.lang === "ar" ? "أول من يعرف عن التخفيضات والعروض" : "Be the first to know about discounts and deals"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/30 dark:border-purple-800/30">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <MessageCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {app.lang === "ar" ? "رسائل فورية" : "Instant Messages"}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {app.lang === "ar" ? "تواصل مباشر مع العملاء" : "Direct communication with customers"}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* الأزرار */}
              <div className="flex flex-col gap-3">
                <Button
                  onClick={enableNotifications}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-[1.02] text-base"
                >
                  <BellRing className="h-5 w-5 mr-2" />
                  {app.lang === "ar" ? "تفعيل الإشعارات الآن" : "Enable Notifications Now"}
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={closePopup}
                  className="w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  {app.lang === "ar" ? "ليس الآن" : "Not Now"}
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* ===== زر الإشعارات الثابت إذا كان الإشعارات ممنوعة ===== */}
        {permission === 'denied' && !isSubscribed && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Button
              onClick={enableNotifications}
              className="gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-105 px-6 py-3 h-auto text-sm"
            >
              <BellRing className="h-4 w-4" />
              {app.lang === "ar" ? "🔔 تفعيل الإشعارات" : "🔔 Enable Notifications"}
            </Button>
          </div>
        )}
      </>
    );
  }

  if (!isSeller) {
    return <BecomeSellerCard />;
  }

  return (
    <>
      <SellerDashboard notificationButton={<NotificationButton />} />
      
      {/* ===== 🔥 Popup الإشعارات الاحترافي ===== */}
      {showNotificationPopup && !isSubscribed && permission !== 'denied' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full mx-4 p-8 shadow-2xl border border-blue-200/30 dark:border-blue-800/30 animate-in zoom-in-95 duration-300">
            {/* أيقونة */}
            <div className="flex justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <BellRing className="h-10 w-10 text-white" />
              </div>
            </div>
            
            {/* العنوان */}
            <h3 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
              {app.lang === "ar" ? "🔔 فعّل الإشعارات" : "🔔 Enable Notifications"}
            </h3>
            
            {/* الوصف */}
            <p className="text-center text-slate-500 dark:text-slate-400 text-sm mb-6">
              {app.lang === "ar" 
                ? "احصل على تحديثات فورية حول طلباتك وعروضك الجديدة حتى لو كان التطبيق مغلقاً" 
                : "Get instant updates about your orders and new offers even when the app is closed"}
            </p>
            
            {/* الفوائد */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/30 dark:border-blue-800/30">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <ShoppingCart className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "طلبات جديدة" : "New Orders"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {app.lang === "ar" ? "تعرف فوراً عند طلب منتجك" : "Know immediately when your product is ordered"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/30 dark:border-emerald-800/30">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Gift className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "عروض حصرية" : "Exclusive Offers"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {app.lang === "ar" ? "أول من يعرف عن التخفيضات والعروض" : "Be the first to know about discounts and deals"}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200/30 dark:border-purple-800/30">
                <div className="h-8 w-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "رسائل فورية" : "Instant Messages"}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {app.lang === "ar" ? "تواصل مباشر مع العملاء" : "Direct communication with customers"}
                  </div>
                </div>
              </div>
            </div>
            
            {/* الأزرار */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={enableNotifications}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-[1.02] text-base"
              >
                <BellRing className="h-5 w-5 mr-2" />
                {app.lang === "ar" ? "تفعيل الإشعارات الآن" : "Enable Notifications Now"}
              </Button>
              
              <Button
                variant="ghost"
                onClick={closePopup}
                className="w-full text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                {app.lang === "ar" ? "ليس الآن" : "Not Now"}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* ===== زر الإشعارات الثابت إذا كان الإشعارات ممنوعة ===== */}
      {permission === 'denied' && !isSubscribed && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <Button
            onClick={enableNotifications}
            className="gap-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:scale-105 px-6 py-3 h-auto text-sm"
          >
            <BellRing className="h-4 w-4" />
            {app.lang === "ar" ? "🔔 تفعيل الإشعارات" : "🔔 Enable Notifications"}
          </Button>
        </div>
      )}
    </>
  );
}