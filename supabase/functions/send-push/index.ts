// supabase/functions/send-push/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ============================================================
// 1. استيراد web-push
// ============================================================
// @deno-types="npm:@types/web-push@3.6.3"
import webpush from "npm:web-push@3.6.7";

// ============================================================
// 2. إعدادات VAPID
// ============================================================
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || Deno.env.get("VITE_VAPID_PUBLIC_KEY") || "";
const WEB_PUSH_CONTACT = "mailto:hello@alsouq.sy";

console.log("🔑 VAPID_PUBLIC_KEY:", VAPID_PUBLIC_KEY ? "✅ موجود" : "❌ غير موجود");
console.log("🔑 VAPID_PRIVATE_KEY:", VAPID_PRIVATE_KEY ? "✅ موجود" : "❌ غير موجود");

// ============================================================
// 3. تهيئة web-push
// ============================================================
webpush.setVapidDetails(
  WEB_PUSH_CONTACT,
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

// ============================================================
// 4. CORS Headers
// ============================================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// ============================================================
// 5. الدالة الرئيسية
// ============================================================
serve(async (req) => {
  // 5.1 التعامل مع CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 5.2 قراءة البيانات
    const { userId, title, body, url, icon, imageUrl } = await req.json();

    console.log(`📬 إرسال إشعار للمستخدم: ${userId}`);
    console.log(`📝 العنوان: ${title}`);
    console.log(`📄 النص: ${body}`);

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "userId is required" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // 5.3 إنشاء عميل Supabase
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 5.4 جلب اشتراكات المستخدم
    const { data: subscriptions, error } = await supabase
      .from("push_subscriptions")
      .select("subscription")
      .eq("user_id", userId);

    if (error) {
      console.error("❌ خطأ في جلب الاشتراكات:", error);
      throw error;
    }

    if (!subscriptions || subscriptions.length === 0) {
      console.log(`⚠️ لا توجد اشتراكات للمستخدم: ${userId}`);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "No subscriptions found for this user" 
        }),
        { 
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    console.log(`✅ تم العثور على ${subscriptions.length} اشتراك`);

    // 5.5 بناء بيانات الإشعار
    const payload = JSON.stringify({
      title: title || "📬 السوق اليك",
      body: body || "لديك إشعار جديد",
      icon: icon || imageUrl || "/logo-192.png",
      badge: "/badge.png",
      url: url || "/dashboard",
      tag: `notification-${Date.now()}`,
      data: {
        url: url || "/dashboard",
        notificationId: Date.now().toString(),
      },
    });

    console.log("📦 Payload:", payload);

    // 5.6 إرسال الإشعار لكل اشتراك
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          // تحويل الاشتراك من JSON string إلى object
          const subscription = typeof sub.subscription === 'string' 
            ? JSON.parse(sub.subscription) 
            : sub.subscription;

          console.log(`📤 إرسال إلى: ${subscription.endpoint?.substring(0, 50)}...`);

          // إرسال الإشعار باستخدام web-push
          const response = await webpush.sendNotification(
            subscription,
            payload,
            {
              TTL: 86400, // 24 ساعة
              urgency: "high",
            }
          );

          console.log(`✅ تم الإرسال بنجاح: ${response.statusCode}`);

          return { 
            endpoint: subscription.endpoint, 
            status: response.statusCode,
            success: response.statusCode === 201 || response.statusCode === 200,
            body: response.body,
          };

        } catch (err: any) {
          console.error("❌ خطأ في إرسال الإشعار:", err);
          
          // إذا كان الاشتراك غير صالح (410 أو 404)، نحذفه من قاعدة البيانات
          if (err.statusCode === 410 || err.statusCode === 404) {
            console.log(`🗑️ حذف اشتراك غير صالح (${err.statusCode})`);
            try {
              await supabase
                .from("push_subscriptions")
                .delete()
                .eq("user_id", userId)
                .eq("subscription", JSON.stringify(sub.subscription));
            } catch (deleteError) {
              console.error("❌ خطأ في حذف الاشتراك:", deleteError);
            }
          }

          return { 
            endpoint: subscription?.endpoint || "unknown", 
            status: err.statusCode || 500,
            success: false,
            error: err.message || "Unknown error",
          };
        }
      })
    );

    // 5.7 حساب النتائج
    const sent = results.filter(r => r.status === "fulfilled" && r.value?.success).length;
    const failed = results.filter(r => r.status === "rejected" || !r.value?.success).length;

    console.log(`📊 النتائج: ${sent} تم الإرسال، ${failed} فشل`);

    return new Response(
      JSON.stringify({ 
        success: true,
        sent,
        failed,
        total: subscriptions.length,
        results: results.map(r => 
          r.status === "fulfilled" ? r.value : { success: false, error: r.reason }
        )
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error: any) {
    console.error("❌ خطأ عام:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        stack: error.stack 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});