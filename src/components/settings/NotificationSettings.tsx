// src/components/settings/NotificationSettings.tsx
import { useState, useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { useProfile, useUpdateStorePreferences } from "@/lib/queries";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, BellOff, BellRing, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function NotificationSettings() {
  const app = useApp();
  const { data: profile, isLoading: profileLoading } = useProfile(app.user?.id);
  const update = useUpdateStorePreferences();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if (profile) {
      setNotificationsEnabled(profile.notifications_enabled !== false);
    }
    
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, [profile]);

  const handleToggleNotifications = async (enabled: boolean) => {
    if (!app.user) return;
    
    // ✅ إذا كان التفعيل والإذن ليس مفعلاً، اطلب الإذن أولاً
    if (enabled && permission === 'default') {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'denied') {
        toast.error(app.lang === "ar" ? "❌ تم رفض الإشعارات في المتصفح" : "❌ Notifications denied in browser");
        return;
      }
    }
    
    // ✅ إذا كان التفعيل والإذن محظور
    if (enabled && permission === 'denied') {
      toast.error(
        app.lang === "ar" 
          ? "❌ الإشعارات محظورة في المتصفح. يرجى تفعيلها من إعدادات المتصفح." 
          : "❌ Notifications blocked in browser. Please enable from browser settings."
      );
      return;
    }
    
    setIsLoading(true);
    try {
      await update.mutateAsync({
        userId: app.user.id,
        notifications_enabled: enabled,
      });
      
      setNotificationsEnabled(enabled);
      
      toast.success(
        enabled 
          ? (app.lang === "ar" ? "🔔 تم تفعيل الإشعارات" : "🔔 Notifications enabled")
          : (app.lang === "ar" ? "🔕 تم إيقاف الإشعارات" : "🔕 Notifications disabled")
      );
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "Error");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (permission === 'denied') return <BellOff className="h-5 w-5 text-red-500" />;
    if (notificationsEnabled && permission === 'granted') return <BellRing className="h-5 w-5 text-emerald-500" />;
    return <Bell className="h-5 w-5 text-muted-foreground" />;
  };

  const getStatusText = () => {
    if (permission === 'denied') {
      return app.lang === "ar" ? "محظورة في المتصفح" : "Blocked in browser";
    }
    if (notificationsEnabled && permission === 'granted') {
      return app.lang === "ar" ? "مفعلة" : "Enabled";
    }
    return app.lang === "ar" ? "غير مفعلة" : "Disabled";
  };

  const getStatusColor = () => {
    if (permission === 'denied') return "text-red-500";
    if (notificationsEnabled && permission === 'granted') return "text-emerald-500";
    return "text-muted-foreground";
  };

  if (profileLoading) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon()}
          {app.lang === "ar" ? "إعدادات الإشعارات" : "Notification Settings"}
        </CardTitle>
        <CardDescription>
          {app.lang === "ar"
            ? "تحكم في إشعارات التطبيق وتنبيهاتك"
            : "Control your app notifications and alerts"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
          <div className="space-y-0.5">
            <Label className="text-base font-medium">
              {app.lang === "ar" ? "الإشعارات" : "Notifications"}
            </Label>
            <p className="text-sm text-muted-foreground">
              {app.lang === "ar"
                ? "استلم إشعارات عن الطلبات والرسائل والعروض"
                : "Receive notifications about orders, messages and offers"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <Switch
              checked={notificationsEnabled && permission !== 'denied'}
              onCheckedChange={handleToggleNotifications}
              disabled={isLoading || permission === 'denied'}
              className={permission === 'denied' ? "opacity-50 cursor-not-allowed" : ""}
            />
          </div>
        </div>

        {permission === 'denied' && (
          <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
            <p className="text-sm text-red-600 dark:text-red-400">
              {app.lang === "ar"
                ? "⚠️ الإشعارات محظورة في المتصفح. يرجى تفعيلها من إعدادات المتصفح."
                : "⚠️ Notifications are blocked in your browser. Please enable them from browser settings."}
            </p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}