// src/components/dashboard/admin/AdminPromoCodesManager.tsx

import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useMemo } from "react";

// ============================================================
// ✅ أنواع البيانات
// ============================================================
export interface PromoCode {
  id: string;
  code: string;
  label: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping' | 'buy_x_get_y';
  value: number;
  min_order: number;
  max_discount: number | null;
  usage_limit: number;
  used_count: number;
  used_by_users: number;
  is_active: boolean;
  is_public: boolean;
  is_auto_applied: boolean;
  starts_at: string;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  metadata: Record<string, any>;
  store_id: string | null;        // ✅ أضف هذا
  store_name: string | null;      // ✅ أضف هذا
  store_ids: any;                 // ✅ أضف هذا (JSONB)
}

// ============================================================
// 🔥 1. جلب الأكواد مع Pagination + بحث + فلترة (عالسيرفر)
// ============================================================
export async function fetchPromoCodesPaginated({
  page = 0,
  limit = 20,
  search = "",
  filterType = "all",
  filterStatus = "all",
}: {
  page?: number;
  limit?: number;
  search?: string;
  filterType?: string;
  filterStatus?: string;
}) {
  const from = page * limit;
  const to = from + limit - 1;
  
  let query = supabase
    .from("promo_codes")
    .select("*", { count: 'exact' });

  // ✅ بحث في السيرفر (مش في المتصفح)
  if (search.trim()) {
    const s = `%${search.trim()}%`;
    query = query.or(`code.ilike.${s},label.ilike.${s},description.ilike.${s}`);
  }

  // ✅ فلترة حسب النوع في السيرفر
  if (filterType !== "all") {
    query = query.eq("type", filterType);
  }

  // ✅ فلترة حسب الحالة في السيرفر
  if (filterStatus !== "all") {
    if (filterStatus === "active") {
      query = query.eq("is_active", true);
    } else if (filterStatus === "inactive") {
      query = query.eq("is_active", false);
    } else if (filterStatus === "expired") {
      query = query.lt("expires_at", new Date().toISOString());
    }
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;
  return { data: data || [], total: count || 0 };
}

// ============================================================
// 🔥 2. إحصائيات محسّنة باستخدام count() (بدون جلب البيانات)
// ============================================================
export async function getPromoCodesStatsOptimized(): Promise<{
  total: number;
  active: number;
  expired: number;
  used: number;
}> {
  // ✅ إجمالي
  const { count: total } = await supabase
    .from("promo_codes")
    .select("*", { count: 'exact', head: true });

  // ✅ نشط (is_active = true)
  const { count: active } = await supabase
    .from("promo_codes")
    .select("*", { count: 'exact', head: true })
    .eq("is_active", true);

  // ✅ منتهي الصلاحية
  const { count: expired } = await supabase
    .from("promo_codes")
    .select("*", { count: 'exact', head: true })
    .lt("expires_at", new Date().toISOString());

  // ✅ مستخدم (used_count > 0)
  const { count: used } = await supabase
    .from("promo_codes")
    .select("*", { count: 'exact', head: true })
    .gt("used_count", 0);

  return {
    total: total || 0,
    active: active || 0,
    expired: expired || 0,
    used: used || 0,
  };
}

// ============================================================
// 🔥 3. جلب كل الأكواد (للتصدير فقط)
// ============================================================
export async function fetchAllPromoCodes(): Promise<PromoCode[]> {
  const { data, error } = await supabase
    .from("promo_codes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================
// ✅ دوال CRUD (مع دعم metadata)
// ============================================================
export async function createPromoCode(data: Partial<PromoCode>): Promise<PromoCode> {
  const { data: result, error } = await supabase
    .from("promo_codes")
    .insert({
      code: data.code?.toUpperCase().trim(),
      label: data.label?.trim(),
      description: data.description?.trim() || null,
      type: data.type,
      value: data.value,
      min_order: data.min_order || 0,
      max_discount: data.max_discount || null,
      usage_limit: data.usage_limit || 1,
      is_active: data.is_active ?? true,
      is_public: data.is_public ?? false,
      is_auto_applied: data.is_auto_applied ?? false,
      starts_at: data.starts_at || new Date().toISOString(),
      expires_at: data.expires_at || null,
      created_by: data.created_by || null,
      metadata: data.metadata || {},
      store_id: data.store_id || null,      // ✅ جديد
      store_name: data.store_name || null,  // ✅ جديد
      store_ids: data.store_ids || [],      // ✅ جديد
    })
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updatePromoCode(id: string, data: Partial<PromoCode>): Promise<PromoCode> {
  const { data: result, error } = await supabase
    .from("promo_codes")
    .update({
      code: data.code?.toUpperCase().trim(),
      label: data.label?.trim(),
      description: data.description?.trim() || null,
      type: data.type,
      value: data.value,
      min_order: data.min_order || 0,
      max_discount: data.max_discount || null,
      usage_limit: data.usage_limit || 1,
      is_active: data.is_active ?? true,
      is_public: data.is_public ?? false,
      is_auto_applied: data.is_auto_applied ?? false,
      starts_at: data.starts_at || new Date().toISOString(),
      expires_at: data.expires_at || null,
      updated_at: new Date().toISOString(),
      metadata: data.metadata || {},
      store_id: data.store_id || null,      // ✅ جديد
      store_name: data.store_name || null,  // ✅ جديد
      store_ids: data.store_ids || [],      // ✅ جديد
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function deletePromoCode(id: string): Promise<void> {
  const { error } = await supabase
    .from("promo_codes")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

export async function togglePromoCodeStatus(id: string, isActive: boolean): Promise<void> {
  const { error } = await supabase
    .from("promo_codes")
    .update({ 
      is_active: isActive,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);

  if (error) throw error;
}

// ============================================================
// ✅ React Query Hooks
// ============================================================

// 🔥 Infinite Query مع بحث وفلترة (عالسيرفر)
export function usePromoCodesInfinite({
  search = "",
  filterType = "all",
  filterStatus = "all",
}: {
  search?: string;
  filterType?: string;
  filterStatus?: string;
} = {}) {
  return useInfiniteQuery({
    queryKey: ["promo-codes-infinite", search, filterType, filterStatus],
    queryFn: async ({ pageParam = 0 }) => {
      return fetchPromoCodesPaginated({
        page: pageParam,
        limit: 20,
        search,
        filterType,
        filterStatus,
      });
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.reduce((sum, page) => sum + page.data.length, 0);
      return totalLoaded < lastPage.total ? allPages.length : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    retry: 1,
  });
}

// 🔥 جلب كل الأكواد (للتصدير)
export function useAllPromoCodes() {
  return useQuery({
    queryKey: ["promo-codes-all"],
    queryFn: fetchAllPromoCodes,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// 🔥 إحصائيات محسّنة
export function usePromoCodesStatsOptimized() {
  return useQuery({
    queryKey: ["promo-codes-stats-optimized"],
    queryFn: getPromoCodesStatsOptimized,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1,
  });
}

// ✅ Realtime Subscription
export function usePromoCodesRealtime() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const channel = supabase
      .channel('promo-codes-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'promo_codes' },
        () => {
          queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
          queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
          queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}

// ✅ Mutations
export function useCreatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPromoCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
    },
  });
}

export function useUpdatePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromoCode> }) =>
      updatePromoCode(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
    },
  });
}

export function useDeletePromoCode() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePromoCode,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
    },
  });
}

export function useTogglePromoCodeStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      togglePromoCodeStatus(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promo-codes-infinite"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-all"] });
      queryClient.invalidateQueries({ queryKey: ["promo-codes-stats-optimized"] });
    },
  });
}