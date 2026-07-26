// src/components/NotificationStatus.tsx
import { useState, useEffect } from 'react';
import { Bell, BellOff, BellRing, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/i18n';
import { useProfile, useUpdateStorePreferences } from '@/lib/queries';
import { 
  isPushSupported, 
  getPushSubscriptionStatus,
  getNotificationPermission
} from '@/lib/pushNotifications';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';

export function NotificationStatus() {
  const app = useApp();
  const { data: profile } = useProfile(app.user?.id);
  const update = useUpdateStorePreferences();
  
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isLoading, setIsLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  
  // ✅ قراءة الحالة من قاعدة البيانات
  const notificationsEnabled = profile?.notifications_enabled !== false;

  // ===== التحقق من حالة الإشعارات =====
  useEffect(() => {
    const checkStatus = async () => {
      if (!app.user) return;
      
      const supported = isPushSupported();
      setIsSupported(supported);
      
      if (supported) {
        const perm = getNotificationPermission();
        setPermission(perm);
        
        const subscribed = await getPushSubscriptionStatus();
        setIsSubscribed(subscribed);
        
        // ✅ إذا كانت مفعلة في قاعدة البيانات والإذن default، اطلب الإذن
        if (notificationsEnabled && perm === 'default' && !hasRequested) {
          setHasRequested(true);
          setTimeout(() => {
            requestPermission();
          }, 1500);
        }
      }
    };

    checkStatus();
  }, [app.user, notificationsEnabled]);

  // ===== ✅ طلب الإذن =====
  const requestPermission = async () => {
    if (!app.user) return;
    
    setIsLoading(true);
    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);
      
      if (permissionResult === 'granted') {
        // ✅ تحديث قاعدة البيانات
        await update.mutateAsync({
          userId: app.user.id,
          notifications_enabled: true,
        });
        
        toast.success(app.lang === "ar" ? "🔔 تم تفعيل الإشعارات!" : "🔔 Notifications enabled!");
        const subscribed = await getPushSubscriptionStatus();
        setIsSubscribed(subscribed);
      } else if (permissionResult === 'denied') {
        // ✅ تحديث قاعدة البيانات بإيقاف الإشعارات
        await update.mutateAsync({
          userId: app.user.id,
          notifications_enabled: false,
        });
        toast.error(app.lang === "ar" ? "❌ تم رفض الإشعارات" : "❌ Notifications denied");
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ===== ✅ تبديل حالة الإشعارات =====
  const toggleNotifications = async () => {
    if (!app.user) return;
    
    const newState = !notificationsEnabled;
    
    // ✅ إذا كان التفعيل والإذن ليس مفعلاً، اطلب الإذن أولاً
    if (newState && permission === 'default') {
      await requestPermission();
      return;
    }
    
    // ✅ إذا كان التفعيل والإذن محظور
    if (newState && permission === 'denied') {
      toast.error(
        app.lang === "ar" 
          ? "❌ الإشعارات محظورة في المتصفح. يرجى تفعيلها من الإعدادات." 
          : "❌ Notifications blocked in browser. Please enable from settings."
      );
      return;
    }
    
    setIsLoading(true);
    try {
      await update.mutateAsync({
        userId: app.user.id,
        notifications_enabled: newState,
      });
      
      toast.success(
        newState 
          ? (app.lang === "ar" ? "🔔 تم تفعيل الإشعارات" : "🔔 Notifications enabled")
          : (app.lang === "ar" ? "🔕 تم إيقاف الإشعارات" : "🔕 Notifications disabled")
      );
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  // إذا كان المستخدم غير مسجل الدخول
  if (!app.user) return null;
  
  // إذا كان المتصفح لا يدعم الـ Push
  if (!isSupported) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 rounded-lg bg-muted/50">
              <BellOff className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px]">
                {app.lang === "ar" ? "غير مدعوم" : "Not supported"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{app.lang === "ar" ? "المتصفح لا يدعم الإشعارات الفورية" : "Browser doesn't support push notifications"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // ===== حالة محظورة =====
  if (permission === 'denied') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-red-500 px-2 py-1 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/30 cursor-not-allowed">
              <BellOff className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px] font-medium">
                {app.lang === "ar" ? "محظورة" : "Blocked"}
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{app.lang === "ar" ? "الإشعارات محظورة 🔕" : "Notifications blocked 🔕"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // ===== حالة مفعلة =====
  if (notificationsEnabled && permission === 'granted') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={toggleNotifications}
              disabled={isLoading}
              className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <BellRing className="h-3.5 w-3.5" />
              )}
              <span className="hidden md:inline text-[10px] font-medium">
                {app.lang === "ar" ? "مفعلة" : "On"}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>
              {app.lang === "ar" 
                ? "الإشعارات مفعلة ✅ (اضغط لإيقافها)" 
                : "Notifications enabled ✅ (click to disable)"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // ===== الحالة الافتراضية (غير مفعلة) =====
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={toggleNotifications}
            disabled={isLoading}
            className="flex items-center gap-2 text-xs px-2 py-1 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 border border-blue-200/30 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600" />
            ) : (
              <Bell className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            )}
            <span className="hidden md:inline text-[10px] font-medium text-blue-600 dark:text-blue-400">
              {isLoading 
                ? (app.lang === "ar" ? "جاري..." : "Loading...")
                : (app.lang === "ar" ? "فعّل" : "Enable")}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>
            {app.lang === "ar" 
              ? "اضغط لتفعيل الإشعارات 🔔" 
              : "Click to enable notifications 🔔"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}