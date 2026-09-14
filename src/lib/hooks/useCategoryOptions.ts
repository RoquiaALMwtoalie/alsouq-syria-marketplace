// src/lib/hooks/useCategoryOptions.ts

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface CategoryOption {
  id: string;
  category_id: string;
  option_key: string;
  option_name_ar: string;
  option_name_en: string;
  option_type: "text" | "select" | "color" | "number";
  is_required: boolean;
  sort_order: number;
}

/**
 * ✅ جلب خيارات التصنيف الرئيسي
 * @param parentCategoryId - معرف التصنيف الرئيسي
 */
export function useCategoryOptions(parentCategoryId: string | null | undefined) {
  return useQuery({
    queryKey: ["category-options", parentCategoryId],
    enabled: !!parentCategoryId,
    staleTime: 1000 * 60 * 10, // 10 دقائق cache
    queryFn: async () => {
      if (!parentCategoryId) return [];

      const { data, error } = await supabase
        .from("category_options")
        .select("*")
        .eq("category_id", parentCategoryId)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("❌ Error fetching category options:", error);
        throw error;
      }

      return (data || []) as CategoryOption[];
    },
  });
}