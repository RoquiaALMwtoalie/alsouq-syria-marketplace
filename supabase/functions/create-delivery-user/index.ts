// supabase/functions/create-delivery-user/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ تعريف المتغيرات مباشرة
const SUPABASE_URL = "https://jjqgfjpxaxjpyohvcbfi.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "sb_secret_o0aW0IiENQ9TJqT86abZOA_6MA1JKZ1";

const supabaseAdmin = createClient(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY
);

// ✅ Supabase عادي (لـ signUp)
const supabase = createClient(
  SUPABASE_URL,
  "sb_publishable_fEPybgejg_mSqpmlDj6rNw_7o67e7nt"
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Content-Type': 'application/json',
};

serve(async (req) => {
  // ✅ معالجة OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    const { phone, password, name_ar, name_en } = await req.json();

    // ✅ التحقق من البيانات
    if (!phone || phone.length < 9) {
      return new Response(
        JSON.stringify({ error: "Invalid phone number" }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!password || password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // ✅ 1. التحقق من وجود الرقم في profiles
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id, phone")
      .eq("phone", phone)
      .maybeSingle();

    if (existingProfile) {
      return new Response(
        JSON.stringify({ error: "Phone number already used" }),
        { status: 409, headers: corsHeaders }
      );
    }

    // ✅ 2. استخدام signUp (يعمل 100%)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: `${phone}@delivery.sy`,
      password: password,
      options: {
        data: {
          full_name: name_ar,
          phone: phone,
        }
      }
    });

    if (authError) {
      console.error("❌ Auth Error:", authError);
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 500, headers: corsHeaders }
      );
    }

    if (!authData.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        { status: 500, headers: corsHeaders }
      );
    }

    const userId = authData.user.id;

    // ✅ 3. تحديث profile (باستخدام supabaseAdmin لتجاوز RLS)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: name_ar,
        phone: phone,
      })
      .eq("id", userId);

    if (profileError) {
      console.error("❌ Profile Error:", profileError);
      // حذف المستخدم في حالة الفشل
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Failed to create profile" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ✅ 4. إضافة دور delivery_company
    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: userId,
        role: "delivery_company",
      });

    if (roleError) {
      console.error("❌ Role Error:", roleError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Failed to assign role" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ✅ 5. إنشاء الشركة
    const slug = name_en
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") + "-" + Date.now().toString().slice(-6);

    const { data: companyData, error: companyError } = await supabaseAdmin
      .from("delivery_companies")
      .insert({
        name_ar: name_ar,
        name_en: name_en || name_ar,
        slug: slug,
        phone: phone,
        created_by: userId,
        is_active: true,
        is_verified: false,
      })
      .select()
      .single();

    if (companyError) {
      console.error("❌ Company Error:", companyError);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Failed to create company" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ✅ 6. ربط المستخدم بالشركة
    const { error: updateError } = await supabaseAdmin
      .from("profiles")
      .update({
        company_id: companyData.id,
      })
      .eq("id", userId);

    if (updateError) {
      console.error("❌ Update Error:", updateError);
      await supabaseAdmin.from("delivery_companies").delete().eq("id", companyData.id);
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return new Response(
        JSON.stringify({ error: "Failed to link user to company" }),
        { status: 500, headers: corsHeaders }
      );
    }

    // ✅ 7. إرجاع النتيجة
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          company: companyData,
          manager: {
            id: userId,
            phone: phone,
            name: name_ar,
          },
        },
        message: "Company created successfully",
      }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error: any) {
    console.error("❌ Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: corsHeaders }
    );
  }
});