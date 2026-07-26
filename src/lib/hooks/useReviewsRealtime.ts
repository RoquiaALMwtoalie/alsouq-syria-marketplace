// src/lib/hooks/useReviewsRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useReviewsRealtime(listingId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!listingId) return;

    const channel = supabase
      .channel(`reviews-${listingId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reviews',
        filter: `listing_id=eq.${listingId}`,
      }, () => {
        queryClient.invalidateQueries(['reviews', listingId]);
        queryClient.invalidateQueries(['listing', listingId]);
        console.log('⭐ Reviews updated in realtime');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [listingId, queryClient]);
}