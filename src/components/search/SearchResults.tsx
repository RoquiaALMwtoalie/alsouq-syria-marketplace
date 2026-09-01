// src/components/search/SearchResults.tsx
import { motion } from "framer-motion";
import { SearchResult } from "@/lib/hooks/useSearch";
import { useApp } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Loader2, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { ListingCard } from "@/components/ListingCard";
import { Suspense } from "react";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  totalResults: number;
  viewMode?: "grid" | "list";
  className?: string;
}

export function SearchResults({
  results,
  isLoading,
  hasMore,
  onLoadMore,
  totalResults,
  viewMode = "grid",
  className,
}: SearchResultsProps) {
  const app = useApp();

  // ✅ تحويل SearchResult إلى شكل متوافق مع ListingCard
  const convertToListingItem = (result: SearchResult) => {
    // ✅ إذا كان المنتج (product أو offer) - يستخدم البيانات كاملة
    if (result.type === 'product' || result.type === 'offer') {
      return {
        id: result.id,
        title_ar: result.title_ar || result.title,
        title_en: result.title_en || result.title,
        description_ar: result.description_ar || result.description || "",
        description_en: result.description_en || result.description || "",
        price: result.price || 0,
        old_price: result.old_price || null,
        discount_percent: result.discount_percent || 0,
        is_offer: result.is_offer || false,
        cover_url: result.cover_url || result.image || "",
        rating: result.rating || 0,
        governorates: result.governorates || null,
        categories: result.categories || null,
        profiles: result.profiles || null,
        listing_images: result.listing_images || [],
        product_variations: result.product_variations || [],
        product_colors: result.product_colors || [],
        owner_id: result.owner_id || null,
        views: result.views || 0,
        favorites_count: result.favorites_count || 0,
        status: result.status || "published",
        is_available: result.is_available !== undefined ? result.is_available : true,
        created_at: result.created_at || new Date().toISOString(),
        updated_at: result.updated_at || new Date().toISOString(),
        governorate_id: result.governorate_id || null,
        category_id: result.category_id || null,
        metadata: result.metadata || null,
        delivery_fee: result.delivery_fee || 0,
        delivery_method: result.delivery_method || null,
        is_featured: result.is_featured || false,
        featured_sort: result.featured_sort || 0,
        profile: result.profiles || null,
        // ✅ للعروض الترويجية
        is_promo_offer: result.type === 'offer' && result.is_offer === false,
        promo_offer: null,
        store_id: result.owner_id || null,
        // ✅ للمتجر
        store_name: result.store_name || result.profiles?.store_name || null,
        // ✅ للتصنيفات
        slug: result.slug || null,
      };
    }
    
    // ✅ للمتاجر - نحولها لمنتج وهمي للعرض
    if (result.type === 'store') {
      return {
        id: result.id,
        title_ar: result.title,
        title_en: result.title,
        description_ar: result.description || "متجر على السوق",
        description_en: result.description || "Store on Alsouq",
        price: 0,
        old_price: null,
        discount_percent: 0,
        is_offer: false,
        cover_url: result.image || result.cover_url || "",
        rating: 0,
        governorates: null,
        categories: null,
        profiles: result.profiles || { store_name: result.title, id: result.id },
        listing_images: [],
        product_variations: [],
        product_colors: [],
        owner_id: result.id,
        views: 0,
        favorites_count: 0,
        status: "published",
        is_available: true,
        created_at: result.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        governorate_id: result.governorate_id || null,
        category_id: null,
        metadata: null,
        delivery_fee: 0,
        delivery_method: null,
        is_featured: false,
        featured_sort: 0,
        profile: result.profiles || { store_name: result.title, id: result.id },
        is_promo_offer: false,
        promo_offer: null,
        store_id: result.id,
        store_name: result.title,
        slug: null,
      };
    }
    
    // ✅ للتصنيفات - نحولها لمنتج وهمي للعرض
    if (result.type === 'category') {
      return {
        id: result.id,
        title_ar: result.title,
        title_en: result.title,
        description_ar: result.description || "تصفح المنتجات في هذا التصنيف",
        description_en: result.description || "Browse products in this category",
        price: 0,
        old_price: null,
        discount_percent: 0,
        is_offer: false,
        cover_url: result.image || result.cover_url || "",
        rating: 0,
        governorates: null,
        categories: result.categories || { name_ar: result.title, name_en: result.title, slug: result.slug },
        profiles: null,
        listing_images: [],
        product_variations: [],
        product_colors: [],
        owner_id: null,
        views: 0,
        favorites_count: 0,
        status: "published",
        is_available: true,
        created_at: result.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        governorate_id: null,
        category_id: result.id,
        metadata: null,
        delivery_fee: 0,
        delivery_method: null,
        is_featured: false,
        featured_sort: 0,
        profile: null,
        is_promo_offer: false,
        promo_offer: null,
        store_id: null,
        store_name: null,
        slug: result.slug || null,
      };
    }
    
    // ✅ fallback
    return {
      id: result.id,
      title_ar: result.title,
      title_en: result.title,
      description_ar: result.description || "",
      description_en: result.description || "",
      price: 0,
      old_price: null,
      discount_percent: 0,
      is_offer: false,
      cover_url: result.image || "",
      rating: 0,
      governorates: null,
      categories: null,
      profiles: null,
      listing_images: [],
      product_variations: [],
      product_colors: [],
      owner_id: null,
      views: 0,
      favorites_count: 0,
      status: "published",
      is_available: true,
      created_at: result.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      governorate_id: null,
      category_id: null,
      metadata: null,
      delivery_fee: 0,
      delivery_method: null,
      is_featured: false,
      featured_sort: 0,
      profile: null,
      is_promo_offer: false,
      promo_offer: null,
      store_id: null,
      store_name: null,
      slug: null,
    };
  };

  if (isLoading && results.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#2a655f]" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="h-20 w-20 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b4a] flex items-center justify-center mx-auto mb-4">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">
          {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {app.lang === "ar"
            ? "حاول استخدام كلمات بحث مختلفة أو قلل من الفلاتر"
            : "Try different keywords or reduce filters"}
        </p>
      </motion.div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* ✅ عدد النتائج */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {app.lang === "ar"
            ? `تم العثور على ${totalResults.toLocaleString()} نتيجة`
            : `${totalResults.toLocaleString()} results found`}
        </p>
      </div>

      {/* ✅ ✅ ✅ استخدام ListingCard مع البيانات الكاملة */}
      <div className={cn(
        "grid gap-4",
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      )}>
        {results.map((result, index) => {
          const item = convertToListingItem(result);
          return (
            <motion.div
              key={`${result.type}-${result.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.5) }}
              className={cn(
                viewMode === "list" && "sm:col-span-2 lg:col-span-3 xl:col-span-4"
              )}
            >
              <Suspense fallback={<div className="h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" />}>
                <ListingCard item={item} variant={viewMode} />
              </Suspense>
            </motion.div>
          );
        })}
      </div>

      {/* ✅ زر تحميل المزيد */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-xl px-8 bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {app.lang === "ar" ? "جاري التحميل..." : "Loading..."}
              </>
            ) : (
              app.lang === "ar" ? "تحميل المزيد" : "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}