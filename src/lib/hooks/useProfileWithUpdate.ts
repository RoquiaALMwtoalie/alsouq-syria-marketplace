// src/lib/hooks/useProfileWithUpdate.ts

import { useEffect } from "react";
import { useApp } from "@/lib/i18n";
import { useProfile } from "@/lib/queries";
import { channelManager } from "@/lib/channelManager";

export function useProfileWithUpdate() {
  const app = useApp();
  const { data: profile, refetch } = useProfile(app.user?.id);

  // ✅ تحديث app.user عند تغيير الـ profile (مرة واحدة فقط)
  useEffect(() => {
    if (profile?.full_name && app.user) {
      app.updateUser({
        name: profile.full_name,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]); // ✅ فقط profile

  // ✅ الاستماع للتغييرات في الوقت الفعلي
  useEffect(() => {
    if (!app.user?.id) return;

    const channelName = `profile-${app.user.id}`;
    const unsubscribe = channelManager.subscribe(channelName, (payload) => {
      if (payload.new?.full_name) {
        app.updateUser({
          name: payload.new.full_name,
          phone: payload.new.phone,
          avatar_url: payload.new.avatar_url,
        });
      }
    });

    return unsubscribe;
  }, [app.user?.id]); // ✅ فقط user id

  return { profile, refetch };
}