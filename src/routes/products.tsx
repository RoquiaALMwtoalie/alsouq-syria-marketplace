// src/routes/products.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useApp, useT } from "@/lib/i18n";
import { useListings } from "@/lib/queries";
import { ListingCard } from "@/components/ListingCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Filter, X, Sparkles, ShoppingBag, Layers } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCart, useAddToCart } from "@/lib/hooks/useCart";
import { toast } from "sonner";

export const Route = createFileRoute("/products")({
  component: ProductsPage,
  head: () => ({ meta: [{ title: "جميع المنتجات — السوق لعندك" }] }),
});

function ProductsPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "product" | "offer">("all");
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  // ✅ Cart Hooks
  const { refetch: refetchCart } = useCart(app.user?.id);
  const addToCartMutation = useAddToCart();
  
  const { data: allProducts = [], isLoading } = useListings({
    sort: "popular",
    limit: 100,
  });

  // ✅ ✅ ✅ دالة التحقق من وجود فيرنتات
  const hasVariations = (product: any) => {
    const hasColors = product.colors && product.colors.length > 0;
    const options = product.options || [];
    const hasSizes = options.some((opt: any) => opt.option_type === 'size');
    const hasVariations = product.variations && product.variations.length > 0;
    const hasOtherOptions = options.some((opt: any) => 
      opt.option_type !== 'size' && opt.option_type !== 'color'
    );
    
    const result = hasColors || hasSizes || hasVariations || hasOtherOptions;
    
    if (product) {
      console.log("🔍 [hasVariations] product:", product.id, product.title_ar);
      console.log("🔍 [hasVariations] hasColors:", hasColors);
      console.log("🔍 [hasVariations] hasSizes:", hasSizes);
      console.log("🔍 [hasVariations] hasVariations:", hasVariations);
      console.log("🔍 [hasVariations] hasOtherOptions:", hasOtherOptions);
      console.log("🔍 [hasVariations] RESULT:", result);
    }
    
    return result;
  };

  // ✅ فلترة
  const filteredProducts = useMemo(() => {
    let result = allProducts;
    
    if (filterType === "product") {
      result = result.filter((p: any) => p.is_offer !== true);
    } else if (filterType === "offer") {
      result = result.filter((p: any) => p.is_offer === true);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p: any) => {
        const titleAr = (p.title_ar || "").toLowerCase();
        const titleEn = (p.title_en || "").toLowerCase();
        const descAr = (p.description_ar || "").toLowerCase();
        const descEn = (p.description_en || "").toLowerCase();
        
        return titleAr.includes(q) || 
               titleEn.includes(q) || 
               descAr.includes(q) || 
               descEn.includes(q);
      });
    }
    
    return result;
  }, [allProducts, searchQuery, filterType]);

  const searchStats = {
    total: allProducts.length,
    filtered: filteredProducts.length,
    hasResults: filteredProducts.length > 0,
  };

  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) return [];
    
    const q = searchQuery.toLowerCase().trim();
    const matched = allProducts
      .filter((p: any) => {
        const title = (p.title_ar || "").toLowerCase();
        return title.includes(q) && !filteredProducts.includes(p);
      })
      .slice(0, 5);
    
    return matched;
  }, [allProducts, searchQuery, filteredProducts]);

  // ✅ ✅ ✅ دالة إضافة للسلة
  const handleQuickAddToCart = async (product: any, e: React.MouseEvent) => {
    e.stopPropagation();
    
    console.log("🛒 [QuickAdd] Product:", product.id, product.title_ar);
    
    if (!app.user) {
      console.log("❌ [QuickAdd] No user logged in");
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
      return;
    }
    
    if (!product.is_available) {
      console.log("❌ [QuickAdd] Product not available");
      toast.error(app.lang === "ar" ? "❌ هذا المنتج غير متوفر" : "❌ This product is unavailable");
      return;
    }

    // ✅ التحقق من وجود فيرنتات
    if (hasVariations(product)) {
      console.log("🔄 [QuickAdd] Product HAS variations, redirecting to detail page");
      navigate({ 
        to: "/listing/$id", 
        params: { id: product.id } 
      });
      
      toast.info(
        app.lang === "ar" 
          ? `👆 اختر اللون والمقاس المناسب لـ "${product.title_ar}"` 
          : `👆 Select the appropriate color and size for "${product.title_en || product.title_ar}"`,
        { duration: 4000 }
      );
      return;
    }

    // ✅ إذا ما في فيرنتات → أضف للسلة مباشرة
    console.log("🔄 [QuickAdd] Product has NO variations, adding to cart...");
    setAddingToCart(product.id);
    
    try {
      console.log("🔄 [QuickAdd] Calling addToCartMutation...");
      
      const result = await addToCartMutation.mutateAsync({
        userId: app.user.id,
        listingId: product.id,
        quantity: 1,
      });
      
      console.log("✅ [QuickAdd] Add to cart result:", result);
      
      // ✅ تحديث السلة
      await queryClient.invalidateQueries({ queryKey: ["cart", app.user.id] });
      await refetchCart();
      console.log("✅ [QuickAdd] Cart invalidated and refetched");
      
      toast.success(
        app.lang === "ar" 
          ? `🛒 تم إضافة "${product.title_ar}" للسلة` 
          : `🛒 Added "${product.title_en || product.title_ar}" to cart`,
        { 
          duration: 3000,
          action: {
            label: app.lang === "ar" ? "📦 عرض السلة" : "📦 View Cart",
            onClick: () => navigate({ to: "/cart" })
          }
        }
      );
    } catch (error) {
      console.error("❌ [QuickAdd] Error adding to cart:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
    } finally {
      setAddingToCart(null);
    }
  };

  const handleProductClick = (productId: string) => {
    console.log("👆 [handleProductClick] Navigating to product:", productId);
    navigate({ to: "/listing/$id", params: { id: productId } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-8">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2"
            >
              <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
              {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
            </Link>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <span>{app.lang === "ar" ? "🛍️ جميع المنتجات" : "🛍️ All Products"}</span>
              <Badge className="bg-primary/10 text-primary border-0 text-sm px-3 py-1">
                {searchStats.filtered}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {searchQuery.trim() ? (
                app.lang === "ar" 
                  ? `نتائج البحث عن "${searchQuery}" (${searchStats.filtered} منتج)` 
                  : `Results for "${searchQuery}" (${searchStats.filtered} products)`
              ) : (
                app.lang === "ar" 
                  ? `عرض جميع المنتجات (${searchStats.total})` 
                  : `Showing all products (${searchStats.total})`
              )}
            </p>
          </div>
        </div>

        {/* ===== SEARCH BAR ===== */}
        <div className="relative mb-4">
          <div className="relative">
            <Search className="absolute inset-y-0 my-auto start-3 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={app.lang === "ar" ? "🔍 ابحث عن منتج..." : "🔍 Search for product..."}
              className="ps-12 h-14 rounded-2xl border-2 border-slate-200/50 bg-white/50 dark:border-slate-800/50 dark:bg-slate-900/50 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 transition-all text-lg"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 end-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          {searchQuery.trim() && (
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>
                {app.lang === "ar" 
                  ? `⚡ بحث فوري: ${searchStats.filtered} نتيجة` 
                  : `⚡ Live search: ${searchStats.filtered} results`}
              </span>
              {searchStats.filtered === 0 && (
                <span className="text-red-500">
                  {app.lang === "ar" ? "⚠️ لا توجد نتائج" : "⚠️ No results"}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ===== FILTERS ===== */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">
              {app.lang === "ar" ? "تصفية:" : "Filter:"}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {[
              { value: "all", label: app.lang === "ar" ? "الكل" : "All" },
              { value: "product", label: app.lang === "ar" ? "📦 منتجات" : "📦 Products" },
              { value: "offer", label: app.lang === "ar" ? "🏷️ عروض" : "🏷️ Offers" },
            ].map((f) => (
              <button
                key={f.value}
                onClick={() => setFilterType(f.value as any)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
                  filterType === f.value
                    ? "bg-primary text-white shadow-md shadow-primary/25"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ===== SUGGESTIONS ===== */}
        {suggestions.length > 0 && (
          <div className="mb-6 p-4 bg-primary/5 rounded-2xl border border-primary/10">
            <p className="text-xs text-muted-foreground mb-2">
              {app.lang === "ar" ? "💡 اقتراحات:" : "💡 Suggestions:"}
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((p: any) => (
                <Link
                  key={p.id}
                  to="/listing/$id"
                  params={{ id: p.id }}
                  className="px-3 py-1.5 bg-white dark:bg-slate-800 rounded-lg text-sm hover:bg-primary/10 transition-all border border-slate-200/50 dark:border-slate-700/50"
                >
                  {p.title_ar}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ===== PRODUCTS GRID ===== */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50">
            <div className="text-7xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold">
              {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {app.lang === "ar" 
                ? `لم نعثر على منتجات تطابق "${searchQuery}"` 
                : `No products match "${searchQuery}"`}
            </p>
            {searchQuery.trim() && (
              <Button 
                variant="outline" 
                className="mt-4 rounded-xl"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 mr-2" />
                {app.lang === "ar" ? "مسح البحث" : "Clear search"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((item) => {
              return (
                <div
                  key={item.id}
                  className="relative group cursor-pointer"
                  onClick={() => handleProductClick(item.id)}
                >
                  {/* ✅ ✅ ✅ زر واحد فقط - اللي في ListingCard (تحت عاليمين) */}
                  {/* ✅ تم حذف الزر العائم من فوق */}
                  
                  <ListingCard 
                    item={item}
                    onAddToCart={(product, e) => {
                      e.stopPropagation();
                      console.log("🛒 [products] onAddToCart called for:", product.id);
                      handleQuickAddToCart(product, e);
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductsPage;