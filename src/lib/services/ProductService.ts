// src/lib/services/ProductService.ts

import { supabase } from "@/integrations/supabase/client";
import { toPlural, ALLOWED_OPTION_TYPES } from "@/lib/utils/constants";

export class ProductService {
  
  /**
   * ✅ حفظ الخيارات — النظام موحّد على الجمع
   * ✅ لا يوجد أي تحويل — نستخدم المفتاح كما هو
   */
  static async saveOptions(listingId: string, options: Record<string, string[]>) {
    console.log("🔍🔍🔍 [ProductService] ===== SAVE OPTIONS START =====");
    console.log("🔍🔍🔍 [ProductService] options received:", JSON.stringify(options, null, 2));
    console.log("🔍🔍🔍 [ProductService] options keys:", Object.keys(options));
    
    const entries: any[] = [];
    const warnings: string[] = [];
    const skipped: string[] = [];
    
    Object.entries(options).forEach(([key, values]) => {
      console.log(`🔍 [ProductService] Processing key: "${key}", values:`, values);
      
      // ✅ إذا كانت القيم فاضية، تجاهل
      if (!values || values.length === 0) {
        console.log(`⏭️ [ProductService] Skipping empty key: "${key}"`);
        return;
      }
      
      // ✅ حاول أولاً: المفتاح كما هو (إذا كان جمعاً مسموحاً)
      let type = key;
      console.log(`🔍 [ProductService] Trying key as-is: "${type}"`);
      
      // ✅ إذا لم يكن مسموحاً مباشرة، حاول التحويل من مفرد إلى جمع
      if (!ALLOWED_OPTION_TYPES.includes(type)) {
        console.log(`⚠️ [ProductService] "${type}" not allowed, trying toPlural...`);
        const pluralType = toPlural(key);
        console.log(`🔍 [ProductService] toPlural("${key}") → "${pluralType}"`);
        
        if (ALLOWED_OPTION_TYPES.includes(pluralType)) {
          type = pluralType;
          console.log(`✅ [ProductService] Converted to plural: "${type}"`);
        } else {
          console.warn(`⚠️ [ProductService] Type "${type}" NOT allowed!`);
          skipped.push(`"${key}" (غير مسموح)`);
          return;
        }
      } else {
        console.log(`✅ [ProductService] Type "${type}" is allowed directly`);
      }
      
      // ✅ إضافة القيم
      (values as string[]).forEach((value, index) => {
        if (value && value.trim()) {
          console.log(`✅ [ProductService] Adding: ${type} → ${value}`);
          entries.push({
            listing_id: listingId,
            option_type: type,
            option_value: value.trim(),
            sort_order: index,
          });
        }
      });
    });
    
    console.log("🔍🔍🔍 [ProductService] Final entries:", entries);
    console.log("🔍🔍🔍 [ProductService] Entries count:", entries.length);
    
    if (entries.length > 0 || skipped.length > 0) {
      console.log('📊 Product Options Report:', {
        inserted: entries.length,
        skipped: skipped.length,
        warnings: warnings.length > 0 ? warnings : '✅ كل شيء ممتاز'
      });
    }
    
    if (entries.length > 0) {
      console.log(`✅ [ProductService] Inserting ${entries.length} options into database...`);
      const { error } = await supabase
        .from("product_options")
        .insert(entries);
      
      if (error) {
        console.error('❌ Error saving product options:', error);
        throw new Error(`فشل حفظ الخيارات: ${error.message}`);
      }
      console.log(`✅ [ProductService] Successfully inserted ${entries.length} options`);
    } else {
      console.log("⚠️ [ProductService] No options to insert!");
    }
    
    console.log("🔍🔍🔍 [ProductService] ===== SAVE OPTIONS END =====");
    
    return { inserted: entries.length, skipped: skipped.length };
  }
  
  /**
   * ✅ حفظ الألوان
   */
  static async saveColors(listingId: string, colors: any[]) {
    if (!colors || colors.length === 0) return { inserted: 0, errors: [] };
    
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
   * ✅ حفظ التركيبات مع ربط الألوان وإجبار السعر
   * ✅ لا يضيف أي مفاتيح إضافية للـ combination
   */
  static async saveVariations(listingId: string, variations: any[]) {
    console.log("🔍 [ProductService] ===== SAVE VARIATIONS START =====");
    console.log("🔍 [ProductService] Variations to save:", variations.length);
    
    if (!variations || variations.length === 0) {
      console.log("ℹ️ [ProductService] No variations to save, deleting all");
      
      const { error } = await supabase
        .from("product_variations")
        .delete()
        .eq("listing_id", listingId);
      
      if (error) {
        console.error('❌ Error deleting variations:', error);
      } else {
        console.log('✅ [ProductService] All variations deleted');
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
      
      console.log(`🔍 [ProductService] Variation ${index} combination:`, combinedCombination);
      
      const priceToSave = v.price !== undefined && v.price !== null && v.price > 0 
        ? v.price 
        : 0;
      
      let colorId = null;
      if (v.combination.colors || v.combination.color) {
        const colorName = v.combination.colors || v.combination.color;
        colorId = colorMap.get(colorName) || null;
      }
      
      if (v.color_id) {
        colorId = v.color_id;
      }
      
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
    
    console.log("🔍 [ProductService] Entries to insert:", entries.length);
    console.log("🔍 [ProductService] First entry combination:", entries[0]?.combination);
    
    if (entries.length > 0) {
      // ✅ حذف التركيبات القديمة
      console.log('🗑️ [ProductService] Deleting old variations...');
      const { error: deleteError } = await supabase
        .from("product_variations")
        .delete()
        .eq("listing_id", listingId);
      
      if (deleteError) {
        console.error('❌ Error deleting old variations:', deleteError);
      } else {
        console.log('✅ [ProductService] Old variations deleted');
      }
      
      // ✅ حفظ التركيبات الجديدة
      console.log(`💾 [ProductService] Inserting ${entries.length} new variations...`);
      const { error, data } = await supabase
        .from("product_variations")
        .insert(entries)
        .select();
      
      if (error) {
        console.error('❌ Error saving product variations:', error);
        throw new Error(`فشل حفظ التركيبات: ${error.message}`);
      }
      
      console.log(`✅ [ProductService] Saved ${entries.length} variations with prices`);
      console.log('✅ [ProductService] Saved data:', data);
    } else {
      console.log('🗑️ [ProductService] No variations to save, deleting all');
      const { error } = await supabase
        .from("product_variations")
        .delete()
        .eq("listing_id", listingId);
      
      if (error) {
        console.error('❌ Error deleting variations:', error);
      } else {
        console.log('✅ [ProductService] All variations deleted');
      }
    }
    
    console.log("🔍 [ProductService] ===== SAVE VARIATIONS END =====");
    
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
   */
  static async saveAllProductData(
    listingId: string,
    data: {
      options?: Record<string, string[]>;
      colors?: any[];
      variations?: any[];
      image_urls?: string[];
    }
  ) {
    const results = {
      options: { inserted: 0, skipped: 0 },
      colors: { inserted: 0, errors: [] as string[] },
      variations: { inserted: 0 },
      images: { inserted: 0 },
    };
    
    // ✅ 1. حفظ الخيارات
    if (data.options) {
      results.options = await ProductService.saveOptions(listingId, data.options);
    }
    
    // ✅ 2. حفظ الألوان
    if (data.colors) {
      results.colors = await ProductService.saveColors(listingId, data.colors);
    }
    
    // ✅ 3. حفظ التركيبات
    if (data.variations) {
      results.variations = await ProductService.saveVariations(listingId, data.variations);
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

      console.log("📸 [ProductService] Saving images:", validImageUrls);
      console.log("📸 [ProductService] Number of images:", validImageUrls.length);

      if (validImageUrls.length > 0) {
        const { error } = await supabase
          .from("listing_images")
          .insert(validImageUrls);

        if (error) {
          console.error("❌ [ProductService] Error saving images:", error);
          throw new Error(`فشل حفظ الصور: ${error.message}`);
        }
        results.images.inserted = validImageUrls.length;
        console.log("✅ [ProductService] Images saved successfully!");
      }
    } else {
      console.log("ℹ️ [ProductService] No images to save");
    }
    
    console.log('✅ Product data saved successfully');
    console.log(`📊 Results: ${results.options.inserted} options, ${results.colors.inserted} colors, ${results.variations.inserted} variations, ${results.images.inserted} images`);
    
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
      console.error('❌ Error updating metadata:', error);
      throw new Error(`فشل تحديث metadata: ${error.message}`);
    }
    
    return true;
  }
}