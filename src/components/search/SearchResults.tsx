// src/components/search/SearchResults.tsx
import { motion, AnimatePresence } from "framer-motion";
import { SearchResult, SearchResultType } from "@/lib/hooks/useSearch";
import { useApp, formatPrice } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Search, Store, Package, Tag, 
  Star, MapPin, ChevronLeft, ChevronRight, 
  Grid3X3, List, ShoppingBag, Home, FolderTree,
  Sparkles, BadgeCheck, TrendingUp, Gift
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ListingCard } from "@/components/ListingCard";
import { Suspense } from "react";
import { Link } from "@tanstack/react-router";
import { OptimizedImage } from "@/components/OptimizedImage";

// ============================================================
// ✅ Interfaces
// ============================================================
interface SearchResultsProps {
  results: SearchResult[];
  allResults: SearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  totalResults: number;
  productsCount: number;
  storesCount: number;
  categoriesCount: number;
  activeType: SearchResultType;
  setActiveType: (type: SearchResultType) => void;
  viewMode?: "grid" | "list";
  className?: string;
}

// ============================================================
// ✅ StoreCard — بطاقة متجر مخصصة
// ============================================================
function StoreCard({ store, lang }: { store: SearchResult; lang: string }) {
  const isArabic = lang === "ar";
  const storeName = store.title;
  const logoUrl = store.store_logo_url || store.image;
  const coverUrl = store.store_cover_url || store.image;
  const description = store.store_description || store.description;

  return (
    <Link
      to="/store/$id"
      params={{ id: store.id }}
      className="group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {/* ✅ غلاف المتجر */}
      <div className="relative h-24 bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] overflow-hidden">
        {coverUrl && (
          <OptimizedImage
            src={coverUrl}
            alt={storeName}
            width={400}
            height={150}
            quality={80}
            objectFit="cover"
            className="absolute inset-0 h-full w-full opacity-70 group-hover:scale-105 transition-transform duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Badge متجر */}
        <div className="absolute top-2 end-2">
          <Badge className="bg-white/90 backdrop-blur text-[#2a655f] border-0 text-[9px] px-2 py-0.5 font-bold shadow-md">
            <Store className="h-2.5 w-2.5 inline me-1" />
            {isArabic ? "متجر" : "Store"}
          </Badge>
        </div>

        {/* ✅ شارة موثّق — زيتي معتمد بدل الأزرق */}
        {store.is_verified && (
          <div className="absolute top-2 start-2">
            <Badge className="bg-[#2a655f] text-white border-0 text-[9px] px-2 py-0.5 font-bold shadow-md">
              <BadgeCheck className="h-2.5 w-2.5 inline me-1" />
              {isArabic ? "موثق" : "Verified"}
            </Badge>
          </div>
        )}
      </div>

      {/* ✅ شعار + معلومات */}
      <div className="p-4 -mt-8 relative">
        <div className="flex items-end gap-3">
          <div className="h-14 w-14 rounded-xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden grid place-items-center text-[#2a655f] font-black text-xl shrink-0">
            {logoUrl ? (
              <OptimizedImage
                src={logoUrl}
                alt={storeName}
                width={60}
                height={60}
                quality={85}
                objectFit="cover"
                className="h-full w-full"
              />
            ) : (
              storeName.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
        </div>

        <h3 className="mt-2 font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#2a655f] transition-colors">
          {storeName}
        </h3>

        {description && (
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 min-h-[2rem]">
            {description}
          </p>
        )}

        {/* ✅ عداد المنتجات */}
        <div className="flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Package className="h-3.5 w-3.5 text-[#2a655f]" />
            <span className="font-bold text-[#2a655f]">
              {store.listing_count || 0}
            </span>
            {isArabic ? "منتج" : "products"}
          </span>
        </div>

        {/* ✅ زر الزيارة */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-[#2a655f] font-bold group-hover:translate-x-1 transition-transform">
            <span>{isArabic ? "زيارة المتجر" : "Visit Store"}</span>
            {isArabic ? (
              <ChevronLeft className="h-3.5 w-3.5" />
            ) : (
              <ChevronRight className="h-3.5 w-3.5" />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// ✅ CategoryCard — بطاقة قسم مخصصة
// ============================================================
function CategoryCard({ category, lang }: { category: SearchResult; lang: string }) {
  const isArabic = lang === "ar";
  const isMain = category.is_main_category;
  const categoryName = category.title;

  return (
    <Link
      to="/category/$slug"
      params={{ slug: category.slug || category.id }}
      className={cn(
        "group block bg-white dark:bg-slate-900 rounded-2xl p-4 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        isMain 
          ? "border-[#2a655f]/30 hover:border-[#2a655f]/60 bg-gradient-to-br from-white via-white to-[#2a655f]/5" 
          : "border-slate-200 dark:border-slate-700 hover:border-[#3a8a82]/50"
      )}
    >
      <div className="flex items-center gap-3">
        {/* ✅ الأيقونة/الصورة */}
        <div className={cn(
          "h-14 w-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm border",
          isMain 
            ? "bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] border-[#1a4f4a]" 
            : "bg-gradient-to-br from-[#3a8a82]/20 to-[#2a655f]/20 border-[#2a655f]/20"
        )}>
          {category.image_url ? (
            <OptimizedImage
              src={category.image_url}
              alt={categoryName}
              width={56}
              height={56}
              quality={80}
              objectFit="cover"
              className="h-full w-full"
            />
          ) : isMain ? (
            <FolderTree className="h-6 w-6 text-white" />
          ) : (
            <Tag className="h-6 w-6 text-[#2a655f]" />
          )}
        </div>

        {/* ✅ التفاصيل */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            {/* Badge نوع القسم */}
            {isMain ? (
              <Badge className="bg-[#2a655f] text-white border-0 text-[9px] px-2 py-0.5 font-bold">
                <Sparkles className="h-2.5 w-2.5 inline me-0.5" />
                {isArabic ? "قسم رئيسي" : "Main"}
              </Badge>
            ) : (
              <Badge className="bg-[#3a8a82]/20 text-[#2a655f] dark:text-[#3a8a82] border-0 text-[9px] px-2 py-0.5 font-bold">
                <FolderTree className="h-2.5 w-2.5 inline me-0.5" />
                {isArabic ? "قسم فرعي" : "Subcategory"}
              </Badge>
            )}
          </div>

          <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#2a655f] transition-colors">
            {categoryName}
          </h3>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {isArabic ? "تصفح المنتجات في هذا القسم" : "Browse products in this category"}
          </p>
        </div>

        {/* ✅ سهم */}
        <div className="shrink-0">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110",
            isMain 
              ? "bg-[#2a655f]/10 group-hover:bg-[#2a655f]" 
              : "bg-slate-100 dark:bg-slate-800 group-hover:bg-[#2a655f]"
          )}>
            {isArabic ? (
              <ChevronLeft className={cn(
                "h-4 w-4 transition-colors",
                isMain 
                  ? "text-[#2a655f] group-hover:text-white" 
                  : "text-slate-500 group-hover:text-white"
              )} />
            ) : (
              <ChevronRight className={cn(
                "h-4 w-4 transition-colors",
                isMain 
                  ? "text-[#2a655f] group-hover:text-white" 
                  : "text-slate-500 group-hover:text-white"
              )} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

// ============================================================
// ✅ SectionHeader — عنوان القسم مع العداد
// ============================================================
function SectionHeader({ 
  icon: Icon, 
  title, 
  count, 
  color = "#2a655f",
  isArabic
}: { 
  icon: any; 
  title: string; 
  count: number; 
  color?: string;
  isArabic: boolean;
}) {
  return (
    <div className="flex items-center justify-between mb-4 mt-2">
      <div className="flex items-center gap-2.5">
        <div 
          className="h-8 w-8 rounded-xl flex items-center justify-center shadow-sm"
          style={{ backgroundColor: `${color}15`, border: `1px solid ${color}30` }}
        >
          <Icon className="h-4 w-4" style={{ color }} />
        </div>
        <h2 className="text-base font-black text-slate-900 dark:text-white">
          {title}
        </h2>
        <Badge 
          className="text-[10px] font-bold px-2 py-0.5"
          style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
        >
          {count}
        </Badge>
      </div>
      <div className="h-px flex-1 ms-4 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700" />
    </div>
  );
}

// ============================================================
// ✅ TabsBar — شريط التصنيف
// ============================================================
function TabsBar({
  activeType,
  setActiveType,
  totalResults,
  productsCount,
  storesCount,
  categoriesCount,
  isArabic,
}: {
  activeType: SearchResultType;
  setActiveType: (type: SearchResultType) => void;
  totalResults: number;
  productsCount: number;
  storesCount: number;
  categoriesCount: number;
  isArabic: boolean;
}) {
  const tabs: Array<{
    id: SearchResultType;
    label: string;
    count: number;
    icon: any;
    color: string;
  }> = [
    { 
      id: 'all', 
      label: isArabic ? "الكل" : "All", 
      count: totalResults,
      icon: Grid3X3,
      color: "#2a655f"
    },
    { 
      id: 'products', 
      label: isArabic ? "منتجات" : "Products", 
      count: productsCount,
      icon: ShoppingBag,
      color: "#2a655f"
    },
    { 
      id: 'stores', 
      label: isArabic ? "متاجر" : "Stores", 
      count: storesCount,
      icon: Store,
      color: "#3a8a82"
    },
    { 
      id: 'categories', 
      label: isArabic ? "أقسام" : "Categories", 
      count: categoriesCount,
      icon: FolderTree,
      color: "#1a4f4a"
    },
  ];

  return (
    <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
      <div className="flex items-center gap-2 min-w-max">
        {tabs.map((tab) => {
          const isActive = activeType === tab.id;
          const Icon = tab.icon;
          const isDisabled = tab.count === 0 && tab.id !== 'all';

          return (
            <button
              key={tab.id}
              onClick={() => !isDisabled && setActiveType(tab.id)}
              disabled={isDisabled}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 shrink-0",
                isActive
                  ? "text-white shadow-lg border-transparent scale-[1.02]"
                  : isDisabled
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700 cursor-not-allowed"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 hover:shadow-md"
              )}
              style={isActive ? { backgroundColor: tab.color } : {}}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              <span className={cn(
                "text-[10px] font-black px-2 py-0.5 rounded-full",
                isActive
                  ? "bg-white/25 text-white"
                  : isDisabled
                    ? "bg-slate-200 dark:bg-slate-700 text-slate-500"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              )}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================
// ✅ convertToListingItem — للمنتجات فقط
// ============================================================
function convertToListingItem(result: SearchResult) {
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
    updated_at: new Date().toISOString(),
    governorate_id: result.governorate_id || null,
    category_id: result.category_id || null,
    metadata: result.metadata || null,
    delivery_fee: result.delivery_fee || 0,
    delivery_method: result.delivery_method || null,
    is_featured: result.is_featured || false,
    featured_sort: result.featured_sort || 0,
    profile: result.profiles || null,
    is_promo_offer: result.type === 'offer' && result.is_offer === false,
    promo_offer: null,
    store_id: result.owner_id || null,
    store_name: result.store_name || null,
    slug: result.slug || null,
  };
}

// ============================================================
// ✅ Main Component
// ============================================================
export function SearchResults({
  results,
  allResults,
  isLoading,
  hasMore,
  onLoadMore,
  totalResults,
  productsCount,
  storesCount,
  categoriesCount,
  activeType,
  setActiveType,
  viewMode = "grid",
  className,
}: SearchResultsProps) {
  const app = useApp();
  const isArabic = app.lang === "ar";

  // ============================================================
  // ✅ Loading
  // ============================================================
  if (isLoading && results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[#2a655f]" />
        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
          {isArabic ? "جاري البحث..." : "Searching..."}
        </p>
      </div>
    );
  }

  // ============================================================
  // ✅ Empty
  // ============================================================
  if (results.length === 0 && !isLoading) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
          <Search className="h-10 w-10 text-slate-300 dark:text-slate-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          {isArabic ? "لا توجد نتائج" : "No results found"}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">
          {isArabic 
            ? "حاول استخدام كلمات بحث مختلفة أو قلل من الفلاتر"
            : "Try different keywords or reduce filters"}
        </p>
      </motion.div>
    );
  }

  // ============================================================
  // ✅ فصل النتائج حسب النوع
  // ============================================================
  const products = allResults.filter(r => r.type === 'product' || r.type === 'offer');
  const stores = allResults.filter(r => r.type === 'store');
  const categories = allResults.filter(r => r.type === 'category');
  
  // ✅ ترتيب الأقسام: الرئيسية أولاً ثم الفرعية
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.is_main_category && !b.is_main_category) return -1;
    if (!a.is_main_category && b.is_main_category) return 1;
    return 0;
  });

  // ============================================================
  // ✅ Grid classes
  // ============================================================
  const gridClasses = cn(
    "grid gap-4",
    viewMode === "grid" 
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid-cols-1"
  );

  const storeGridClasses = cn(
    "grid gap-4",
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  );

  const categoryGridClasses = cn(
    "grid gap-3",
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  );

  return (
    <div className={cn("space-y-5", className)}>

      {/* ============================================================ */}
      {/* ✅ Tabs التصنيف */}
      {/* ============================================================ */}
      <TabsBar
        activeType={activeType}
        setActiveType={setActiveType}
        totalResults={totalResults}
        productsCount={productsCount}
        storesCount={storesCount}
        categoriesCount={categoriesCount}
        isArabic={isArabic}
      />

      {/* ============================================================ */}
      {/* ✅ عدد النتائج */}
      {/* ============================================================ */}
      <div className="flex items-center justify-between text-sm">
        <p className="text-slate-500 dark:text-slate-400">
          {isArabic
            ? `تم العثور على ${totalResults.toLocaleString()} نتيجة`
            : `${totalResults.toLocaleString()} results found`}
        </p>
        {isLoading && results.length > 0 && (
          <div className="flex items-center gap-1.5 text-[#2a655f]">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            <span className="text-xs font-bold">
              {isArabic ? "جاري التحديث..." : "Updating..."}
            </span>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* ✅ النتائج */}
      {/* ============================================================ */}

      {/* حالة "الكل" */}
      {activeType === 'all' && (
        <div className="space-y-8">

          {/* ✅ قسم المنتجات */}
          {products.length > 0 && (
            <section>
              <SectionHeader
                icon={ShoppingBag}
                title={isArabic ? "🛒 المنتجات" : "🛒 Products"}
                count={productsCount}
                color="#2a655f"
                isArabic={isArabic}
              />
              <div className={gridClasses}>
                {products.map((result, index) => {
                  const item = convertToListingItem(result);
                  return (
                    <motion.div
                      key={`product-${result.id}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.03, 0.4) }}
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
            </section>
          )}

          {/* ✅ قسم المتاجر */}
          {stores.length > 0 && (
            <section>
              <SectionHeader
                icon={Store}
                title={isArabic ? "🏪 المتاجر" : "🏪 Stores"}
                count={storesCount}
                color="#3a8a82"
                isArabic={isArabic}
              />
              <div className={storeGridClasses}>
                {stores.map((store, index) => (
                  <motion.div
                    key={`store-${store.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.4) }}
                  >
                    <StoreCard store={store} lang={app.lang} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* ✅ قسم الأقسام */}
          {sortedCategories.length > 0 && (
            <section>
              <SectionHeader
                icon={FolderTree}
                title={isArabic ? "📂 الأقسام" : "📂 Categories"}
                count={categoriesCount}
                color="#1a4f4a"
                isArabic={isArabic}
              />
              <div className={categoryGridClasses}>
                {sortedCategories.map((category, index) => (
                  <motion.div
                    key={`category-${category.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.4) }}
                  >
                    <CategoryCard category={category} lang={app.lang} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

        </div>
      )}

      {/* حالة "منتجات" فقط */}
      {activeType === 'products' && (
        <div className={gridClasses}>
          {products.map((result, index) => {
            const item = convertToListingItem(result);
            return (
              <motion.div
                key={`product-${result.id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.03, 0.4) }}
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
      )}

      {/* حالة "متاجر" فقط */}
      {activeType === 'stores' && (
        <div className={storeGridClasses}>
          {stores.map((store, index) => (
            <motion.div
              key={`store-${store.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.4) }}
            >
              <StoreCard store={store} lang={app.lang} />
            </motion.div>
          ))}
        </div>
      )}

      {/* حالة "أقسام" فقط */}
      {activeType === 'categories' && (
        <div className={categoryGridClasses}>
          {sortedCategories.map((category, index) => (
            <motion.div
              key={`category-${category.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.4) }}
            >
              <CategoryCard category={category} lang={app.lang} />
            </motion.div>
          ))}
        </div>
      )}

      {/* ============================================================ */}
      {/* ✅ زر تحميل المزيد */}
      {/* ============================================================ */}
      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-xl px-8 bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-xl transition-all duration-300 font-bold h-11"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin me-2" />
                {isArabic ? "جاري التحميل..." : "Loading..."}
              </>
            ) : (
              <>
                {isArabic ? "تحميل المزيد" : "Load more"}
                {isArabic ? (
                  <ChevronLeft className="h-4 w-4 ms-2" />
                ) : (
                  <ChevronRight className="h-4 w-4 ms-2" />
                )}
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}