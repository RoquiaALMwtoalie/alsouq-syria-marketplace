// supabase/functions/send-push/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
// @deno-types="npm:@types/web-push@3.6.3"
import webpush from "npm:web-push@3.6.7";

const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY") || "";
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY") || "";
const WEB_PUSH_CONTACT = Deno.env.get("VAPID_SUBJECT") || "mailto:hello@zooq.sy";

console.log("🔑 VAPID:", VAPID_PUBLIC_KEY ? "✅" : "❌", VAPID_PRIVATE_KEY ? "✅" : "❌");

if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  console.error("❌ VAPID keys missing");
} else {
  webpush.setVapidDetails(WEB_PUSH_CONTACT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
  console.log("✅ web-push initialized");
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = await req.json();
    
    // ✅ يدعم الشكلين: { userId, title, body } و { record: { user_id, title_ar, ... } }
    const record = body.record || body;
    
    const userId = body.userId || record.user_id;
    const title = body.title || record.title_ar;
    const notificationBody = body.body || record.body_ar;
    const url = body.url || record.link_url;
    const tag = body.tag || `notif-${record.id || Date.now()}`;
    const icon = body.icon || record.image_url;

    console.log("📬 Webhook received:", JSON.stringify({ userId, title, url, bodyPreview: notificationBody?.substring(0, 50) }));

    if (!userId) {
      console.error("❌ userId is missing. Full body:", JSON.stringify(body));
      return new Response(
        JSON.stringify({ success: false, error: "userId is required", received: body }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
      return new Response(
        JSON.stringify({ success: false, error: "VAPID keys not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: subs, error } = await supabase
      .from("push_subscriptions")
      .select("id, subscription")
      .eq("user_id", userId);

    if (error) throw error;

    if (!subs || subs.length === 0) {
      console.log(`⚠️ No subscriptions for ${userId}`);
      return new Response(
        JSON.stringify({ success: false, sent: 0, message: "No subscriptions" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = JSON.stringify({
      title: title || "📬 ذوق",
      body: notificationBody || "لديك إشعار جديد",
      icon: icon || "/logo-192.png",
      badge: "/badge.png",
      url: url || "/",
      tag: tag,
      data: { url: url || "/" },
    });

    let sent = 0, failed = 0;
    const results: any[] = [];

    for (const sub of subs) {
      try {
        const subscription = typeof sub.subscription === "string"
          ? JSON.parse(sub.subscription)
          : sub.subscription;
        await webpush.sendNotification(subscription, payload, { TTL: 86400 });
        sent++;
        results.push({ id: sub.id, success: true });
        console.log(`✅ Sent to subscription ${sub.id}`);
      } catch (err: any) {
        failed++;
        console.error(`❌ Failed ${sub.id}: ${err?.statusCode} ${err?.message}`);
        if (err?.statusCode === 410 || err?.statusCode === 404) {
          await supabase.from("push_subscriptions").delete().eq("id", sub.id);
          console.log(`🗑️ Deleted expired subscription ${sub.id}`);
        }
        results.push({ id: sub.id, success: false, error: err?.message });
      }
    }

    console.log(`📊 Results: ${sent} sent, ${failed} failed`);

    return new Response(
      JSON.stringify({ success: true, sent, failed, total: subs.length, results }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("❌ Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
