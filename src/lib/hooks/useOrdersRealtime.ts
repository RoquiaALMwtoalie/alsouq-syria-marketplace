// src/lib/hooks/useOrdersRealtime.ts
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useOrdersRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`orders-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: `buyer_id=eq.${userId}`,
      }, (payload) => {
        queryClient.invalidateQueries(['orders', userId]);
        
        if (payload.eventType === 'INSERT') {
          toast.success('📦 طلب جديد تم استلامه!');
        }
        
        if (payload.eventType === 'UPDATE') {
          const newStatus = payload.new?.status;
          if (newStatus) {
            toast.info(`📦 حالة الطلب: ${newStatus}`);
          }
        }
        
        console.log('📦 Orders updated in realtime');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);
}