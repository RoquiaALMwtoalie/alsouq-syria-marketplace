// src/lib/hooks/usePresence.ts
import { useEffect, useState, useCallback } from "react";
import { presenceService } from "@/lib/services/presenceService";
import { useApp } from "@/lib/i18n";

export function usePresence() {
  const app = useApp();
  const userId = app.user?.id;
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [onlineUsersDetails, setOnlineUsersDetails] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;

    // ✅ الاشتراك في Presence
    presenceService.subscribeToPresence(userId, (state) => {
      // ✅ تحديث قائمة المتصلين
      const users = Object.keys(state);
      setOnlineUsers(users);
      
      // ✅ تحديث تفاصيل المتصلين
      const details = [];
      for (const [key, presences] of Object.entries(state)) {
        if (presences.length > 0) {
          details.push({
            user_id: key,
            online_at: presences[0].online_at,
          });
        }
      }
      setOnlineUsersDetails(details);
    });

    // ✅ تنظيف عند إلغاء التثبيت
    return () => {
      presenceService.unsubscribeFromPresence(userId);
    };
  }, [userId]);

  /**
   * ✅ التحقق إذا كان مستخدم معين متصل
   */
  const isOnline = useCallback((targetUserId: string) => {
    return presenceService.isUserOnline(userId!, targetUserId);
  }, [userId]);

  /**
   * ✅ جلب قائمة المتصلين
   */
  const getOnlineUsers = useCallback(() => {
    return presenceService.getOnlineUsers(userId!);
  }, [userId]);

  return {
    onlineUsers,
    onlineUsersDetails,
    isOnline,
    getOnlineUsers,
  };
}