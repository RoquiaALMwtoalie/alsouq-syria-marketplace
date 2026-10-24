// supabase/functions/send-expo-push/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const body = await req.json();
    const record = body.record || body;
    const userId = body.userId || record.user_id;
    const title = body.title || record.title_ar;
    const notificationBody = body.body || record.body_ar;
    const url = body.url || record.link_url;

    console.log("📬 Expo Push received:", { userId, title, url });

    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "userId is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: tokens, error } = await supabase
      .from("expo_push_tokens")
      .select("token, platform")
      .eq("user_id", userId);

    if (error) throw error;

    if (!tokens || tokens.length === 0) {
      console.log(`⚠️ No Expo tokens for user ${userId}`);
      return new Response(
        JSON.stringify({ success: false, sent: 0, message: "No Expo tokens" }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }

    const messages = tokens.map((t: any) => ({
      to: t.token,
      title: title || "📬 ذوق",
      body: notificationBody || "لديك إشعار جديد",
      sound: "default",
      priority: "high",
      data: { url: url || "/" },
    }));

    console.log(`📤 Sending to ${messages.length} Expo tokens`);

    const expoRes = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(messages),
    });

    const expoResult = await expoRes.json();
    console.log("📊 Expo result:", JSON.stringify(expoResult));

    if (expoResult.data) {
      for (let i = 0; i < expoResult.data.length; i++) {
        const result = expoResult.data[i];
        if (result.status === "error" && result.details?.error === "DeviceNotRegistered") {
          await supabase.from("expo_push_tokens").delete().eq("token", tokens[i].token);
          console.log(`🗑️ Deleted invalid token: ${tokens[i].token}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, sent: messages.length, result: expoResult }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("❌ Unexpected error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});