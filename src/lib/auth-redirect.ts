// src/lib/auth-redirect.ts

import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";

export interface RedirectResult {
  url: string;
  needsCompletion: boolean;
  role?: string;
}

/**
 * ✅ دالة تحديد التوجيه المناسب بعد تسجيل الدخول
 * تستخدم مرة واحدة فقط عند تسجيل الدخول
 */
export async function getAuthRedirect(user: User): Promise<RedirectResult> {
  // ✅ 1. جلب الأدوار
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id);

  const userRoles = (roles ?? []).map((r: any) => r.role);
  const role = userRoles[0] || "customer";

  // ✅ 2. جلب البيانات
  const [{ data: profile }, { data: addressRows }] = await Promise.all([
    supabase
      .from("profiles")
      .select("phone, full_name, address_text")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("user_addresses")
      .select("address_text")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .maybeSingle(),
  ]);

  const hasPhone = profile?.phone && profile.phone.trim() !== "";
  const hasName = profile?.full_name && profile.full_name.trim() !== "";
  const hasAddress = Boolean(profile?.address_text?.trim() || addressRows?.address_text?.trim());

  // ✅ 3. التوجيه حسب الرول
  if (role === "admin") {
    return { url: "/admin", needsCompletion: false, role };
  }

  if (role === "delivery_company") {
    // ✅ إذا بيانات ناقصة، روح complete
    if (!hasName || !hasPhone || !hasAddress) {
      return { url: "/delivery/complete", needsCompletion: true, role };
    }
    return { url: "/delivery/dashboard", needsCompletion: false, role };
  }

  if (role === "distributor") {
    // ✅ شيل الشرط وروح مباشرة للـ dashboard
    return { url: "/distributor/dashboard", needsCompletion: false, role };
  }

  if (role === "seller") {
    return { url: "/dashboard", needsCompletion: false, role };
  }

  // ✅ customer أو أي دور آخر
  return { url: "/", needsCompletion: false, role };
}