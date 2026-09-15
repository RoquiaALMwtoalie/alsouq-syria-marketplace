// src/lib/hooks/useProfileWithUpdate.ts

import { useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { useProfile } from "@/lib/queries";

/**
 * ✅ useProfileWithUpdate
 * 
 * يجلب البروفايل + يستمع للتحديثات الفورية
 * 
 * 🔄 التعديل النهائي:
 * - بدل WebSocket منفصل (profile-${userId}) 
 * - يستمع لـ CustomEvent('profile-updated') من db-${userId}
 * - نفس الفورية 100% (postgres_changes)
 * - نفس اللوجيك
 * - صفر WebSockets إضافية
 */

// ✅ اسم الـ CustomEvent — للاتساق بين الملفات
export const PROFILE_UPDATED_EVENT = 'profile-updated';

export function useProfileWithUpdate() {
  const app = useApp();
  const { data: profile, refetch } = useProfile(app.user?.id);

  // ============================================================
  // ✅ 1. تحديث app.user عند تغيير الـ profile (من الـ query)
  // ============================================================
  useEffect(() => {
    if (profile?.full_name && app.user) {
      app.updateUser({
        name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // ============================================================
  // ✅ 2. الاستماع لـ CustomEvent('profile-updated')
  // 
  // 🔄 التغيير: 
  // - قبل: WebSocket منفصل (profile-${userId})
  // - بعد: CustomEvent من db-${userId} (في useRealtimeConversations)
  // 
  // ✅ الفايدة:
  // - WebSocket واحد أقل (4 → 4 على iOS — على الحد بالضبط)
  // - نفس الفورية (<100ms)
  // - نفس اللوجيك
  // ============================================================
  useEffect(() => {
    if (!app.user?.id) return;

    // ✅ handler الـ CustomEvent
    const handleProfileUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const payload = customEvent.detail;

      // ✅ نفس الـ callback الأصلي — نفس اللوجيك
      if (payload?.full_name) {
        console.log('👤 [useProfileWithUpdate] Profile updated via CustomEvent:', payload);
        
        app.updateUser({
          name: payload.full_name,
          phone: payload.phone,
          avatar_url: payload.avatar_url,
        });
      }
    };

    // ✅ سجّل الـ listener
    window.addEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);

    console.log('✅ [useProfileWithUpdate] Listening to profile-updated event');

    // ✅ دالة التنظيف
    return () => {
      window.removeEventListener(PROFILE_UPDATED_EVENT, handleProfileUpdate);
      console.log('🧹 [useProfileWithUpdate] Removed profile-updated listener');
    };
  }, [app.user?.id]);

  return { profile, refetch };
}