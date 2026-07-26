// src/lib/utils/helpers.ts

import { supabase } from "@/integrations/supabase/client";

/**
 * ✅ جلب اسم المستخدم المناسب للعرض
 * الأولوية: store_name > full_name > user_id
 */
export async function getUserDisplayName(userId: string): Promise<string> {
  try {
    // ✅ جلب بيانات المستخدم
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .select("full_name, store_name")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ Error fetching user profile:", error);
      return userId;
    }

    // ✅ الأولوية: store_name > full_name > userId
    if (userProfile?.store_name && userProfile.store_name.trim() !== "") {
      return userProfile.store_name.trim();
    }
    
    if (userProfile?.full_name && userProfile.full_name.trim() !== "") {
      return userProfile.full_name.trim();
    }
    
    return userId;
  } catch (error) {
    console.error("❌ Error in getUserDisplayName:", error);
    return userId;
  }
}