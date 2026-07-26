// src/lib/hooks/useBookingsRealtime.ts
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function useBookingsRealtime(userId: string | undefined) {
  const queryClient = useQueryClient();
  const channelRef = useRef<any>(null);

  useEffect(() => {
    // ✅ إذا لم يوجد userId
    if (!userId) {
      console.log('⏳ No userId, skipping bookings realtime');
      return;
    }

    const channelName = `bookings-${userId}`;
    console.log(`📡 Setting up unified bookings channel: ${channelName}`);

    // ✅ 1. إنشاء القناة
    const channel = supabase.channel(channelName);

    // ✅ 2. إضافة المستمعين (on) - هذا يجب أن يكون قبل subscribe
    // مستمع لحجوزات العميل
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'bookings',
      filter: `customer_id=eq.${userId}`,
    }, (payload) => {
      console.log('📅 Booking update (as customer):', payload);
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
      handleCustomerNotification(payload);
    });

    // مستمع لحجوزات البائع
    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'bookings',
      filter: `provider_id=eq.${userId}`,
    }, (payload) => {
      console.log('📅 Booking update (as provider):', payload);
      queryClient.invalidateQueries({ queryKey: ['bookings', userId] });
      handleProviderNotification(payload);
    });

    // ✅ 3. الاشتراك (subscribe) - بعد كل الـ on
    channel.subscribe((status) => {
      console.log(`📡 Bookings channel status:`, status);
    });

    // ✅ حفظ القناة
    channelRef.current = channel;

    // ✅ 4. التنظيف عند إلغاء التثبيت
    return () => {
      if (channelRef.current) {
        console.log(`🧹 Cleaning up bookings channel: ${channelName}`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [userId, queryClient]);
}

// ✅ دوال الإشعارات
function handleCustomerNotification(payload: any) {
  const { eventType, new: record } = payload;
  
  if (eventType === 'INSERT') {
    toast.success('✅ تم إرسال طلب الحجز! في انتظار تأكيد المتجر.', {
      duration: 5000,
      icon: '📅',
    });
  }
  
  if (eventType === 'UPDATE') {
    const status = record?.status;
    if (status === 'accepted') {
      toast.success('✅ تم تأكيد حجزك!', { duration: 5000, icon: '✅' });
    } else if (status === 'cancelled') {
      toast.warning('❌ تم إلغاء الحجز', { duration: 5000, icon: '❌' });
    } else if (status === 'rejected') {
      toast.error('❌ تم رفض حجزك', { duration: 5000, icon: '❌' });
    } else if (status === 'completed') {
      toast.success('✔️ تم إكمال الحجز!', { duration: 5000, icon: '✔️' });
    }
  }
}

function handleProviderNotification(payload: any) {
  const { eventType, new: record } = payload;
  
  if (eventType === 'INSERT') {
    const customerName = record?.customer_name || 'عميل';
    toast.success(`📅 حجز جديد من ${customerName}!`, {
      duration: 5000,
      icon: '📅',
    });
  }
  
  if (eventType === 'UPDATE') {
    const status = record?.status;
    if (status === 'cancelled') {
      toast.warning('❌ تم إلغاء الحجز من قبل العميل', {
        duration: 5000,
        icon: '❌',
      });
    } else if (status === 'accepted') {
      toast.success('✅ تم قبول الحجز', {
        duration: 5000,
        icon: '✅',
      });
    }
  }
}