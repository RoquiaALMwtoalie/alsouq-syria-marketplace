// src/lib/services/ProductService.ts

import { supabase } from "@/integrations/supabase/client";
import { toSingular, ALLOWED_OPTION_TYPES } from "@/lib/utils/constants";

export class ProductService {
  
  /**
   * ✅ حفظ الخيارات مع التحويل التلقائي
   */
  static async saveOptions(listingId: string, options: Record<string, string[]>) {
    const entries: any[] = [];
    const warnings: string[] = [];
    const skipped: string[] = [];
    
    Object.entries(options).forEach(([key, values]) => {
      // 🔥 التحويل الذكي: أي كلمة → مفرد
      let type = toSingular(key);
      
      // ✅ التحقق من أن النوع مسموح
      if (!ALLOWED_OPTION_TYPES.includes(type)) {
        // حاول مرة ثانية: إذا كانت الكلمة تنتهي بـ 's' جرب بدونها
        if (key.endsWith('s') && key.length > 1) {
          const attempt = key.slice(0, -1);
          if (ALLOWED_OPTION_TYPES.includes(attempt)) {
            type = attempt;
          } else {
            skipped.push(`"${key}" → "${type}" (غير مسموح)`);
            return;
          }
        } else {
          skipped.push(`"${key}" → "${type}" (غير مسموح)`);
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
    
    // ✅ تسجيل التقرير
    if (entries.length > 0 || skipped.length > 0) {
      console.log('📊 Product Options Report:', {
        inserted: entries.length,
        skipped: skipped.length,
        warnings: warnings.length > 0 ? warnings : '✅ كل شيء ممتاز'
      });
    }
    
    // ✅ إدراج الخيارات
    if (entries.length > 0) {
      const { error } = await supabase
        .from("product_options")
        .insert(entries);
      
      if (error) {
        console.error('❌ Error saving product options:', error);
        throw new Error(`فشل حفظ الخيارات: ${error.message}`);
      }
    }
    
    return { inserted: entries.length, skipped: skipped.length };
  }
  
  /**
   * ✅ حفظ الألوان
   */
  static async saveColors(listingId: string, colors: any[]) {
    if (!colors || colors.length === 0) return { inserted: 0 };
    
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
    
    if (entries.length > 0) {
      const { error } = await supabase
        .from("product_colors")
        .insert(entries);
      
      if (error) {
        console.error('❌ Error saving product colors:', error);
        throw new Error(`فشل حفظ الألوان: ${error.message}`);
      }
    }
    
    return { inserted: entries.length, errors };
  }
  
  /**
   * ✅ حفظ التركيبات
   */
  static async saveVariations(listingId: string, variations: any[]) {
    if (!variations || variations.length === 0) return { inserted: 0 };
    
    const entries: any[] = [];
    
    variations.forEach((v, index) => {
      if (!v.combination || Object.keys(v.combination).length === 0) {
        return;
      }
      
      entries.push({
        listing_id: listingId,
        combination: v.combination,
        is_active: v.is_available !== false,
        sku: v.sku || `VAR-${listingId.substring(0, 8)}-${Date.now()}-${index}`,
        price: v.price || null,
        stock_quantity: v.stock_quantity || 0,
      });
    });
    
    if (entries.length > 0) {
      const { error } = await supabase
        .from("product_variations")
        .insert(entries);
      
      if (error) {
        console.error('❌ Error saving product variations:', error);
        throw new Error(`فشل حفظ التركيبات: ${error.message}`);
      }
    }
    
    return { inserted: entries.length };
  }
  
  /**
   * ✅ حذف جميع بيانات المنتج
   */
  static async deleteProductData(listingId: string) {
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
    
    return errors;
  }
  
  /**
   * ✅ حفظ كل بيانات المنتج دفعة واحدة
   */
  static async saveAllProductData(
    listingId: string,
    data: {
      options?: Record<string, string[]>;
      colors?: any[];
      variations?: any[];
    }
  ) {
    const results = {
      options: { inserted: 0, skipped: 0 },
      colors: { inserted: 0, errors: [] as string[] },
      variations: { inserted: 0 },
    };
    
    if (data.options) {
      results.options = await ProductService.saveOptions(listingId, data.options);
    }
    
    if (data.colors) {
      results.colors = await ProductService.saveColors(listingId, data.colors);
    }
    
    if (data.variations) {
      results.variations = await ProductService.saveVariations(listingId, data.variations);
    }
    
    // ✅ تحديث metadata
    await supabase
      .from("listings")
      .update({
        metadata: {
          options: data.options || {},
          variations: data.variations || [],
          colors: data.colors || [],
        }
      })
      .eq("id", listingId);
    
    return results;
  }
}