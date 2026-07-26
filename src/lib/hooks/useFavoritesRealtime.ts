// src/lib/hooks/useFavoritesRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";  // ✅ أضف هذا السطر
import { supabase } from "@/integrations/supabase/client";

export function useFavoritesRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`favorites-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'favorites',
        filter: `user_id=eq.${userId}`,
      }, () => {
        queryClient.invalidateQueries(['favorites', userId]);
        console.log('⭐ Favorites updated in realtime');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}