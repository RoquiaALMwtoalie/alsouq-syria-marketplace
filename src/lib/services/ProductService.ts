// src/lib/services/ProductService.ts

import { supabase } from "@/integrations/supabase/client";
import { toPlural, ALLOWED_OPTION_TYPES } from "@/lib/utils/constants";

export class ProductService {
  
  /**
   * ✅ حفظ الخيارات — النظام موحّد على الجمع
   * ✅ لا يوجد أي تحويل — نستخدم المفتاح كما هو
   */
  static async saveOptions(listingId: string, options: Record<string, string[]>, force?: boolean) {
    // 🛡️ حماية: إذا كانت المصفوفة فارغة وDB بها بيانات → ارفض الحذف (إلا إذا force)
    const hasAnyOptionValue = Object.values(options).some(v => v && v.length > 0);
    if (!hasAnyOptionValue && !force) {
      const { count: existingCount } = await supabase
        .from("product_options")
        .select("*", { count: 'exact', head: true })
        .eq("listing_id", listingId);
      if ((existingCount || 0) > 0) {
        return { inserted: 0, skipped: 0, protected: true, reason: "empty_protection" };
      }
    }
    // 🛡️ نهاية الحماية
    
    const entries: any[] = [];
    const warnings: string[] = [];
    const skipped: string[] = [];
    
    Object.entries(options).forEach(([key, values]) => {
      // ✅ إذا كانت القيم فاضية، تجاهل
      if (!values || values.length === 0) {
        return;
      }
      
      // ✅ حاول أولاً: المفتاح كما هو (إذا كان جمعاً مسموحاً)
      let type = key;
      
      // ✅ إذا لم يكن مسموحاً مباشرة، حاول التحويل من مفرد إلى جمع
      if (!ALLOWED_OPTION_TYPES.includes(type)) {
        const pluralType = toPlural(key);
        
        if (ALLOWED_OPTION_TYPES.includes(pluralType)) {
          type = pluralType;
        } else {
          skipped.push(`"${key}" (غير مسموح)`);
          return;
        }
      }
      
      // ✅ إضافة القيم
      (values as string[]).forEach((value, index) => {
        if (value && value.trim()) {
          entries.push({
            listing_id: listingId,
            option_type: type,
            option_value: value.trim(),
            sort_order: index,
          });
        }
      });
    });
    
    if (entries.length > 0) {
      // 🛡️ حذف الخيارات القديمة أولاً لتجنب duplicate key
      await supabase
        .from("product_options")
        .delete()
        .eq("listing_id", listingId);
      
      const { error } = await supabase
        .from("product_options")
        .insert(entries);
      
      if (error) {
        throw new Error(`فشل حفظ الخيارات: ${error.message}`);
      }
    } else if (force) {
      // ✅ force + entries فارغة → احذف كل الخيارات
      await supabase
        .from("product_options")
        .delete()
        .eq("listing_id", listingId);
    }
    
    return { inserted: entries.length, skipped: skipped.length };
  }
  
  /**
   * ✅ حفظ الألوان
   */
  static async saveColors(listingId: string, colors: any[]) {
    // 🛡️ حماية: إذا كانت المصفوفة فارغة وDB بها بيانات → ارفض الحذف
    if (!colors || colors.length === 0) {
      const { count: existingCount } = await supabase
        .from("product_colors")
        .select("*", { count: 'exact', head: true })
        .eq("listing_id", listingId);
      if ((existingCount || 0) > 0) {
        return { inserted: 0, errors: [], savedColors: [], protected: true, reason: "empty_protection" };
      }
    }
    // 🛡️ نهاية الحماية
    
    if (!colors || colors.length === 0) return { inserted: 0, errors: [], savedColors: [] };
    
    const entries: any[] = [];
    const errors: string[] = [];
    
    colors.forEach((color, index) => {
      const name = color.color_name_ar || color.color_name || color.name;
      const image = color.image_url || color.image || '';
      
      if (!name || !name.trim()) {
        errors.push(`⚠️ لون بدون اسم في الفهرس ${index}`);
        return;
      }
      
      if (!image || !image.trim()) {
        errors.push(`⚠️ لون "${name}" بدون صورة`);
        return;
      }
      
      entries.push({
        listing_id: listingId,
        color_name_ar: name.trim(),
        color_name_en: color.color_name_en || null,
        color_hex: color.color_hex || null,
        image_url: image.trim(),
        sort_order: color.sort_order ?? index,
      });
    });
    
    let savedColors: any[] = [];
    
    if (entries.length > 0) {
      // ✅ احذف الألوان القديمة أولاً لتجنب التكرار
      await supabase
        .from("product_colors")
        .delete()
        .eq("listing_id", listingId);
      
      const { data, error } = await supabase
        .from("product_colors")
        .insert(entries)
        .select("id, color_name_ar");
      
      if (error) {
        throw new Error(`فشل حفظ الألوان: ${error.message}`);
      }
      
      savedColors = data || [];
    }
    
    return { inserted: entries.length, errors, savedColors };
  }
  
  /**
   * ✅ حفظ التركيبات مع ربط الألوان وإجبار السعر
   * ✅ لا يضيف أي مفاتيح إضافية للـ combination
   */
  static async saveVariations(listingId: string, variations: any[], force?: boolean) {
    // 🛡️ حماية: إذا كانت المصفوفة فارغة وDB بها بيانات → ارفض الحذف (إلا إذا force)
    if (!variations || variations.length === 0) {
      if (!force) {
        const { count: existingCount } = await supabase
          .from("product_variations")
          .select("*", { count: 'exact', head: true })
          .eq("listing_id", listingId);
        if ((existingCount || 0) > 0) {
          return { inserted: 0, protected: true, reason: "empty_protection" };
        }
      }
    }
    // 🛡️ نهاية الحماية
    
    if (!variations || variations.length === 0) {
      const { error } = await supabase
        .from("product_variations")
        .delete()
        .eq("listing_id", listingId);
      
      if (error) {
        console.error('❌ Error deleting variations:', error);
      }
      return { inserted: 0 };
    }
    
    // ✅ جلب ألوان المنتج للربط
    const { data: colors, error: colorsError } = await supabase
      .from("product_colors")
      .select("id, color_name_ar")
      .eq("listing_id", listingId);
    
    if (colorsError) {
      console.error('❌ Error fetching colors:', colorsError);
    }
    
    const colorMap = new Map();
    (colors || []).forEach((c: any) => {
      colorMap.set(c.color_name_ar, c.id);
    });
    
    const entries: any[] = [];
    
    variations.forEach((v, index) => {
      if (!v.combination || Object.keys(v.combination).length === 0) {
        return;
      }
      
      // ✅ استخدم الـ combination كما هو — لا تضيف أي مفاتيح
      const combinedCombination = { ...v.combination };
      
      const priceToSave = v.price !== undefined && v.price !== null && v.price > 0 
        ? v.price 
        : 0;
      
      // ✅ 1) جرّب المطابقة بالاسم (الأكثر أماناً)
      let colorId: string | null = null;
      const colorNameFromCombo = v.combination.colors || v.combination.color;
      if (colorNameFromCombo) {
        colorId = colorMap.get(String(colorNameFromCombo).trim()) || null;
      }
      
      // ✅ 2) إذا لم يوجد بالاسم، جرّب v.color_id فقط إذا كان UUID حقيقياً
      if (!colorId && v.color_id && !String(v.color_id).startsWith('temp-')) {
        const exists = Array.from(colorMap.values()).includes(v.color_id);
        if (exists) colorId = v.color_id;
      }
      
      // ✅ 3) إذا لم يوجد أي تطابق، null
      if (!colorId) colorId = null;
      
      const sku = v.sku || `VAR-${listingId.substring(0, 8)}-${Date.now()}-${index}`;
      
      entries.push({
        listing_id: listingId,
        combination: combinedCombination,
        is_active: v.is_available !== false,
        sku: sku,
        price: priceToSave,
        old_price: v.old_price || null,
        color_id: colorId,
        stock_quantity: v.stock_quantity || 0,
      });
    });
    
    if (entries.length > 0) {
      // ✅ حذف التركيبات القديمة
      const { error: deleteError } = await supabase
        .from("product_variations")
        .delete()
        .eq("listing_id", listingId);
      
      if (deleteError) {
        console.error('❌ Error deleting old variations:', deleteError);
      }
      
      // ✅ حفظ التركيبات الجديدة
      const { error, data } = await supabase
        .from("product_variations")
        .insert(entries)
        .select();
      
      if (error) {
        throw new Error(`فشل حفظ التركيبات: ${error.message}`);
      }
    } else {
      const { error } = await supabase
        .from("product_variations")
        .delete()
        .eq("listing_id", listingId);
      
      if (error) {
        console.error('❌ Error deleting variations:', error);
      }
    }
    
    return { inserted: entries.length };
  }
  
  /**
   * ✅ حذف جميع بيانات المنتج
   * @param options.force - إذا true، احذف حتى لو DB بها بيانات (حذف مقصود من المستخدم)
   */
  static async deleteProductData(listingId: string, options?: { force?: boolean }) {
    const force = options?.force === true;
    
    // 🛡️ حماية مزدوجة: variations + options (إلا إذا force)
    if (!force) {
      const { count: varsCount } = await supabase
        .from("product_variations")
        .select("*", { count: 'exact', head: true })
        .eq("listing_id", listingId);
      
      const { count: optsCount } = await supabase
        .from("product_options")
        .select("*", { count: 'exact', head: true })
        .eq("listing_id", listingId);
      
      if ((varsCount || 0) > 0 || (optsCount || 0) > 0) {
        return [`🛡️ حماية: تم منع الحذف (${varsCount || 0} تركيبة، ${optsCount || 0} خيار)`];
      }
    } else {
      console.log('🟢 [ProductService.deleteProductData] force = true → bypassing protection');
    }
    // 🛡️ نهاية الحماية
    
    const tables = ['product_options', 'product_colors', 'product_variations'];
    const errors: string[] = [];
    
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('listing_id', listingId);
      
      if (error) {
        errors.push(`❌ فشل حذف من ${table}: ${error.message}`);
      }
    }
    
    // ✅ أيضاً احذف الصور
    const { error: imagesError } = await supabase
      .from("listing_images")
      .delete()
      .eq("listing_id", listingId);
    
    if (imagesError) {
      errors.push(`❌ فشل حذف الصور: ${imagesError.message}`);
    }
    
    return errors;
  }
  
  /**
   * ✅ حفظ كل بيانات المنتج دفعة واحدة (بدون تكرار)
   * @param force - إذا true، اسمح بحذف الخيارات والتركيبات (حذف مقصود)
   */
  static async saveAllProductData(
    listingId: string,
    data: {
      options?: Record<string, string[]>;
      colors?: any[];
      variations?: any[];
      image_urls?: string[];
    },
    force?: boolean
  ) {
    const results = {
      options: { inserted: 0, skipped: 0 },
      colors: { inserted: 0, errors: [] as string[] },
      variations: { inserted: 0 },
      images: { inserted: 0 },
    };
    
    // ✅ 1. حفظ الخيارات
    if (data.options) {
      results.options = await ProductService.saveOptions(listingId, data.options, force);
    }
    
    // ✅ 2. حفظ الألوان
    if (data.colors) {
      results.colors = await ProductService.saveColors(listingId, data.colors);
    }
    
    // ✅ 3. حفظ التركيبات
    if (data.variations) {
      results.variations = await ProductService.saveVariations(listingId, data.variations, force);
    }
    
    // ✅ 4. حفظ الصور الإضافية
    if (data.image_urls && data.image_urls.length > 0) {
      const validImageUrls = data.image_urls
        .filter((url: string) => url && url.trim() !== '')
        .map((url: string, index: number) => ({
          listing_id: listingId,
          url: url.trim(),
          sort_order: index,
        }));

      if (validImageUrls.length > 0) {
        // 🛡️ حذف الصور القديمة أولاً لتجنب التضاعف
        await supabase
          .from("listing_images")
          .delete()
          .eq("listing_id", listingId);
        
        const { error } = await supabase
          .from("listing_images")
          .insert(validImageUrls);

        if (error) {
          throw new Error(`فشل حفظ الصور: ${error.message}`);
        }
        results.images.inserted = validImageUrls.length;
      }
    }
    
    return results;
  }
  
  /**
   * ✅ تحديث metadata فقط للبيانات الإضافية (مشاهدات، SEO، إلخ)
   */
  static async updateMetadata(listingId: string, metadata: Record<string, any>) {
    const { error } = await supabase
      .from("listings")
      .update({ metadata })
      .eq("id", listingId);
    
    if (error) {
      throw new Error(`فشل تحديث metadata: ${error.message}`);
    }
    
    return true;
  }
}