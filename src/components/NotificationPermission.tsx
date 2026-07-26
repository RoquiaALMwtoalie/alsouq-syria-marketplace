// src/components/NotificationPermission.tsx
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, BellOff, BellRing, Loader2 } from 'lucide-react';
import { useApp } from '@/lib/i18n';
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

export function NotificationPermission() {
  const app = useApp();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // ===== التحقق من حالة الإشعارات فقط =====
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
      }
    };

    checkStatus();
  }, [app.user]);

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

  // ===== عرض حالة الإشعارات فقط =====
  if (permission === 'denied' && !isSubscribed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-red-500 px-2 py-1 rounded-lg bg-red-50/50 dark:bg-red-950/20 border border-red-200/30">
              <BellOff className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px]">
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

  // ===== عرض حالة مفعلة =====
  if (isSubscribed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/30">
              <BellRing className="h-3.5 w-3.5" />
              <span className="hidden md:inline text-[10px] font-medium">
                {app.lang === "ar" ? "مفعلة" : "On"}
              </span>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{app.lang === "ar" ? "الإشعارات مفعلة ✅" : "Notifications enabled ✅"}</p>
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
          <div className="flex items-center gap-2 text-xs text-muted-foreground px-2 py-1 rounded-lg bg-muted/50">
            <Bell className="h-3.5 w-3.5" />
            <span className="hidden md:inline text-[10px]">
              {app.lang === "ar" ? "غير مفعلة" : "Off"}
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{app.lang === "ar" ? "الإشعارات غير مفعلة" : "Notifications disabled"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}