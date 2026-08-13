// supabase/functions/ai-assistant/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SYSTEM_PROMPT_AR = `
أنت مساعد بحث ذكي لمتجر "السوق لعندك".

📌 مهمتك:
- فهم ما يبحث عنه المستخدم
- البحث في قاعدة البيانات
- إعطاء إجابات مختصرة وواضحة

📌 قواعد الرد:
1️⃣ إذا وجدت منتجات، اذكرها فقط
2️⃣ لا تذكر التصنيفات أو المتاجر إذا كانت 0
3️⃣ لكل منتج أضف الرابط كاملاً: /listing/{id}
4️⃣ كن مختصراً ومفيداً

📌 مثال للرد المثالي:
🔍 نتائج البحث عن "جاكيت":

🛍️ جاكيت جلدي رجالي - 400,000 SYP
🔗 /listing/1bd0462f-af3d-4e1f-9737-653e9ce902eb

🛍️ جاكيت شتوي - 350,000 SYP
🔗 /listing/abc123-def456-...

هل تريد تفاصيل أكثر عن أي منتج؟
`;

const SYSTEM_PROMPT_EN = `
You are a smart search assistant for "Souq Le3ndak" store.

📌 Your task:
- Understand what the user is searching for
- Search the database
- Give short and clear answers

📌 Response rules:
1️⃣ If you find products, list them only
2️⃣ Don't mention categories or stores if they are 0
3️⃣ For each product add the full link: /listing/{id}
4️⃣ Be concise and helpful

📌 Example response:
🔍 Search results for "jacket":

🛍️ Men's Leather Jacket - 400,000 SYP
🔗 /listing/1bd0462f-af3d-4e1f-9737-653e9ce902eb

🛍️ Winter Jacket - 350,000 SYP
🔗 /listing/abc123-def456-...

Would you like more details about any product?
`;

serve(async (req) => {
  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    let body;
    try {
      body = await req.json();
    } catch (parseError) {
      console.error("❌ خطأ في قراءة JSON:", parseError);
      return new Response(
        JSON.stringify({ error: "JSON غير صحيح" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const { messages, userId, lang = "ar" } = body;
    
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "الرسائل مطلوبة" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // 📝 استخراج كلمة البحث
    const lastUserMessage = messages.filter(m => m.role === "user").pop()?.content || "";
    const searchTerm = lastUserMessage.trim();

    console.log("🔍 [بحث] الكلمة:", searchTerm);

    const isArabic = lang === "ar";

    // ============================================================
    // 🔍 البحث في المنتجات
    // ============================================================
    const { data: products, error: productsError } = await supabaseClient
      .from("listings")
      .select(`
        id,
        title_ar,
        title_en,
        price,
        cover_url,
        description_ar,
        description_en
      `)
      .eq("status", "published")
      .or(`title_ar.ilike.%${searchTerm}%,title_en.ilike.%${searchTerm}%,description_ar.ilike.%${searchTerm}%,description_en.ilike.%${searchTerm}%`)
      .limit(10);

    if (productsError) {
      console.error("❌ [بحث] خطأ في المنتجات:", productsError);
    }

    const totalProducts = products?.length || 0;
    console.log(`📊 [بحث] عدد المنتجات: ${totalProducts}`);

    // ============================================================
    // 🔍 البحث في التصنيفات
    // ============================================================
    const { data: categories, error: categoriesError } = await supabaseClient
      .from("categories")
      .select(`id, name_ar, name_en`)
      .or(`name_ar.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%`)
      .limit(5);

    if (categoriesError) {
      console.error("❌ [بحث] خطأ في التصنيفات:", categoriesError);
    }

    // ============================================================
    // 🔍 البحث في المتاجر
    // ============================================================
    const { data: stores, error: storesError } = await supabaseClient
      .from("stores")
      .select(`id, name_ar, name_en`)
      .or(`name_ar.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%`)
      .limit(5);

    if (storesError) {
      console.error("❌ [بحث] خطأ في المتاجر:", storesError);
    }

    // ============================================================
    // 📝 بناء قائمة النتائج مع الروابط
    // ============================================================
    
    let results = [];
    let resultText = '';

    // ✅ المنتجات
    if (products && products.length > 0) {
      products.forEach(p => {
        const title = isArabic ? p.title_ar : (p.title_en || p.title_ar);
        const price = p.price?.toLocaleString() || 0;
        const link = `/listing/${p.id}`;
        results.push({
          type: 'product',
          title: title,
          price: price,
          link: link,
          id: p.id
        });
      });
    }

    // ✅ التصنيفات
    if (categories && categories.length > 0) {
      categories.forEach(c => {
        const name = isArabic ? c.name_ar : (c.name_en || c.name_ar);
        const link = `/category/${c.id}`;
        results.push({
          type: 'category',
          title: name,
          link: link,
          id: c.id
        });
      });
    }

    // ✅ المتاجر
    if (stores && stores.length > 0) {
      stores.forEach(s => {
        const name = isArabic ? s.name_ar : (s.name_en || s.name_ar);
        const link = `/store/${s.id}`;
        results.push({
          type: 'store',
          title: name,
          link: link,
          id: s.id
        });
      });
    }

    // ============================================================
    // 📝 بناء النص النهائي مع الروابط
    // ============================================================
    
    if (results.length === 0) {
      resultText = isArabic 
        ? `🔍 لا توجد نتائج لـ "${searchTerm}"`
        : `🔍 No results for "${searchTerm}"`;
    } else {
      const header = isArabic 
        ? `🔍 نتائج البحث عن "${searchTerm}":\n`
        : `🔍 Search results for "${searchTerm}":\n`;
      
      let items = '';
      results.forEach((item, index) => {
        let icon = '';
        let extra = '';
        
        if (item.type === 'product') {
          icon = '🛍️';
          extra = ` - ${item.price} SYP`;
        } else if (item.type === 'category') {
          icon = '📂';
        } else if (item.type === 'store') {
          icon = '🏪';
        }
        
        // ✅ الرابط كامل مع النص
        items += `${icon} ${item.title}${extra}\n`;
        items += `🔗 ${item.link}\n\n`;
      });
      
      resultText = header + items;
      
      // ✅ سؤال للمتابعة
      resultText += isArabic 
        ? 'هل تريد تفاصيل أكثر عن أي منها؟'
        : 'Would you like more details about any of these?';
    }

    // ============================================================
    // 📤 الرد النهائي
    // ============================================================
    const reply = resultText;

    console.log("✅ [بحث] الرد النهائي:", reply.substring(0, 200));

    // 💾 حفظ المحادثة
    if (userId) {
      try {
        await supabaseClient
          .from("ai_chat_history")
          .insert({
            user_id: userId,
            user_message: lastUserMessage,
            ai_response: reply,
            language: lang,
            created_at: new Date().toISOString(),
          });
        console.log("✅ [بحث] تم حفظ المحادثة");
      } catch (historyError) {
        console.warn("⚠️ [بحث] خطأ في حفظ المحادثة:", historyError);
      }
    }

    return new Response(
      JSON.stringify({ reply }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("❌ [بحث] خطأ عام:", error);
    return new Response(
      JSON.stringify({ 
        error: "خطأ داخلي",
        details: error instanceof Error ? error.message : String(error)
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});