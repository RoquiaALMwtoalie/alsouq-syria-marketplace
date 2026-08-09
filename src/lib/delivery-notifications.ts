// src/lib/delivery-notifications.ts
import { supabase } from "@/integrations/supabase/client";

export async function notifyDeliveryCompanyAdmins(
  companyId: string,
  notification: {
    type: string;
    title_ar: string;
    body_ar: string;
    link_url?: string;
    metadata?: Record<string, any>;
  }
) {
  try {
    console.log("🔍 [notifyDeliveryCompanyAdmins] companyId:", companyId);
    
    // 1. جلب جميع أدمنز الشركة
    const { data: admins, error: adminsError } = await supabase
      .from("delivery_company_admins")
      .select("user_id")
      .eq("company_id", companyId);

    if (adminsError) {
      console.error("❌ Admins error:", adminsError);
      throw adminsError;
    }

    console.log("🔍 [notifyDeliveryCompanyAdmins] admins found:", admins);

    // 2. جلب صاحب الشركة
    const { data: company, error: companyError } = await supabase
      .from("delivery_companies")
      .select("created_by")
      .eq("id", companyId)
      .single();

    if (companyError) {
      console.error("❌ Company error:", companyError);
      throw companyError;
    }

    console.log("🔍 [notifyDeliveryCompanyAdmins] company created_by:", company?.created_by);

    // 3. دمج المعرفات
    const userIds = admins?.map((a: any) => a.user_id) || [];
    if (company?.created_by && !userIds.includes(company.created_by)) {
      userIds.push(company.created_by);
    }

    if (userIds.length === 0) {
      console.log("ℹ️ No users to notify");
      return [];
    }

    console.log("🔍 [notifyDeliveryCompanyAdmins] final userIds:", userIds);

    // 4. إرسال الإشعارات - استخدم insert مباشرة
    const notifications = userIds.map((userId: string) => ({
      user_id: userId,
      type: notification.type,
      title_ar: notification.title_ar,
      body_ar: notification.body_ar,
      link_url: notification.link_url || null,
      metadata: notification.metadata || {},
      created_at: new Date().toISOString(),
      is_read: false,
    }));

    console.log("🔍 [notifyDeliveryCompanyAdmins] notifications to insert:", notifications);

    const { data, error } = await supabase
      .from("notifications")
      .insert(notifications)
      .select();

    if (error) {
      console.error("❌ Insert error:", error);
      throw error;
    }

    console.log("✅ [notifyDeliveryCompanyAdmins] Sent successfully:", data?.length, "notifications");
    return data;

  } catch (error) {
    console.error("❌ [notifyDeliveryCompanyAdmins] Error:", error);
    throw error;
  }
}