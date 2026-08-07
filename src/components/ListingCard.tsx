// src/components/ListingCard.tsx

import { Link } from "@tanstack/react-router";
import { Star, MapPin, Heart, ImageIcon, ShoppingCart, Store, Eye, BadgePercent, Trash2, Sparkles } from "lucide-react";
import { useApp, formatPrice, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ListingWithRelations } from "@/lib/queries";
import { toast } from "sonner";
import { useAddToCart, useClearCart } from "@/lib/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, memo, useCallback, useMemo } from "react";

interface ListingCardProps {
  item: ListingWithRelations;
  variant?: "grid" | "list";
  onAddToCart?: (item: any, e: React.MouseEvent) => void;
}

// ✅ ✅ ✅ استخدم React.memo ✅ ✅ ✅
export const ListingCard = memo(function ListingCard({ 
  item, 
  variant = "grid", 
  onAddToCart: externalOnAddToCart 
}: ListingCardProps) {
  const app = useApp();
  const t = useT();
  const addToCartMutation = useAddToCart();
  const clearCartMutation = useClearCart();
  
  // ✅ ✅ ✅ useMemo للقيم المحسوبة ✅ ✅ ✅
  const fav = useMemo(() => app.favorites.includes(item.id), [app.favorites, item.id]);
  const title = useMemo(() => 
    app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar),
    [app.lang, item.title_ar, item.title_en]
  );
  
  const gov = useMemo(() => 
    item.governorates ? (app.lang === "ar" ? item.governorates.name_ar : item.governorates.name_en) : "",
    [app.lang, item.governorates]
  );
  
  const cat = useMemo(() => 
    item.categories ? (app.lang === "ar" ? item.categories.name_ar : item.categories.name_en) : "",
    [app.lang, item.categories]
  );
  
  const cover = useMemo(() => 
    item.cover_url || item.listing_images?.[0]?.url || "",
    [item.cover_url, item.listing_images]
  );
  
  const storeName = useMemo(() => 
    (item as any).profiles?.store_name || 
    (item as any).owner?.store_name || 
    (item as any).profiles?.full_name || 
    (item as any).owner?.full_name || 
    "",
    [item]
  );
  
  const price = useMemo(() => Number(item.price), [item.price]);
  const priceInUSD = useMemo(() => 
    item.price_usd || (price / 14500),
    [item.price_usd, price]
  );
  
  const isOffer = useMemo(() => item.is_offer === true, [item.is_offer]);
  const discountPercent = useMemo(() => item.discount_percent || 0, [item.discount_percent]);
  const oldPrice = useMemo(() => 
    item.old_price ? Number(item.old_price) : null,
    [item.old_price]
  );
  const oldPriceUSD = useMemo(() => 
    item.old_price_usd || (oldPrice ? (oldPrice / 14500) : null),
    [item.old_price_usd, oldPrice]
  );
  
  // ✅ State للـ Dialog
  const [showStoreConflictDialog, setShowStoreConflictDialog] = useState(false);
  const [conflictData, setConflictData] = useState<any>(null);
  const [currentStoreName, setCurrentStoreName] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // ✅ ✅ ✅ useCallback للدوال ✅ ✅ ✅
  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log("🛒 [ListingCard] Add to cart clicked:", item.id);
    
    if (!item || !item.id) {
      toast.error("المنتج غير موجود");
      return;
    }
    
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }
    
    try {
      await addToCartMutation.mutateAsync({
        userId: app.user.id,
        listingId: item.id,
        quantity: 1,
        onStoreConflict: async (data: any) => {
          console.log("⚠️ [ListingCard] Store conflict!", data);
          
          setIsProcessing(true);
          
          const { data: currentStore } = await supabase
            .from("profiles")
            .select("store_name")
            .eq("id", data.currentStoreId)
            .maybeSingle();
          
          const { data: newStore } = await supabase
            .from("profiles")
            .select("store_name")
            .eq("id", data.newStoreId)
            .maybeSingle();
          
          setCurrentStoreName(currentStore?.store_name || "متجر");
          setNewStoreName(newStore?.store_name || "متجر");
          setConflictData(data);
          setShowStoreConflictDialog(true);
          setIsProcessing(false);
        },
      });
      
      toast.success(app.lang === "ar" ? "✅ تم إضافة المنتج للسلة 🛒" : "✅ Product added to cart 🛒");
    } catch (error) {
      console.error("❌ [ListingCard] Error adding to cart:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ في الإضافة" : "❌ Error adding to cart");
    }
  }, [app.user, app.lang, item.id, addToCartMutation]);

  const handleConfirmSwitchStore = useCallback(async () => {
    if (!conflictData || !app.user) return;
    
    setIsProcessing(true);
    
    try {
      await clearCartMutation.mutateAsync({ userId: app.user.id });
      
      await addToCartMutation.mutateAsync({
        userId: app.user.id,
        listingId: item.id,
        quantity: 1,
      });
      
      toast.success(
        app.lang === "ar" 
          ? `✅ تم تبديل المتجر من "${currentStoreName}" إلى "${newStoreName}" وإضافة المنتج للسلة`
          : `✅ Store switched from "${currentStoreName}" to "${newStoreName}" and product added to cart`
      );
      
      setShowStoreConflictDialog(false);
      setConflictData(null);
      
    } catch (error) {
      console.error("❌ Error switching store:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ أثناء تبديل المتجر" : "❌ Error switching store");
    } finally {
      setIsProcessing(false);
    }
  }, [app.user, app.lang, conflictData, clearCartMutation, addToCartMutation, item.id, currentStoreName, newStoreName]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    app.toggleFavorite(item.id);
  }, [app, item.id]);

  // ✅ ✅ ✅ الصورة مع Lazy Loading ✅ ✅ ✅
  const renderImage = useCallback(() => {
    if (cover) {
      return (
        <img
          src={cover}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.jpg';
          }}
        />
      );
    }
    return (
      <div className="h-full w-full grid place-items-center">
        <ImageIcon className="h-12 w-12 text-[#2a655f]/30" />
      </div>
    );
  }, [cover, title]);

  // ✅ ✅ ✅ عرض السعر مع الخصم ✅ ✅ ✅
  const renderPrice = useCallback(() => {
    if (isOffer && oldPrice) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm text-red-500 line-through font-medium">
              {formatPrice(oldPrice, app.currency, app.lang)}
            </span>
            <span className="text-[10px] text-red-400/70">
              ≈ {oldPriceUSD?.toFixed(2)} USD
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <span className="text-xl font-black text-[#2a655f]">
              {formatPrice(price, app.currency, app.lang)}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              وفر {discountPercent}%
            </span>
          </div>
          
          <div className="text-xs font-medium text-muted-foreground/80 bg-muted/30 px-2 py-0.5 rounded inline-block">
            ≈ {priceInUSD.toFixed(2)} USD
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-1">
        <span className="text-xl font-black text-[#2a655f]">
          {formatPrice(price, app.currency, app.lang)}
        </span>
        <div className="text-xs font-medium text-muted-foreground/80 bg-muted/30 px-2 py-0.5 rounded inline-block">
          ≈ {priceInUSD.toFixed(2)} USD
        </div>
      </div>
    );
  }, [isOffer, oldPrice, price, priceInUSD, discountPercent, app.currency, app.lang]);

  // ============================================================
  // ✅ عرض Grid (شبكة)
  // ============================================================
  if (variant === "grid") {
    return (
      <>
        <div className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-2xl hover:shadow-[#2a655f]/15 transition-all duration-500 hover:-translate-y-2 border-2 border-[#2a655f]/20 hover:border-[#2a655f]/60">
          <Link to="/listing/$id" params={{ id: item.id }}>
            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#2a655f]/5 to-[#2a655f]/10">
              {renderImage()}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {isOffer && discountPercent > 0 && (
                <div className="absolute top-3 right-3 z-20 animate-fade-up">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white px-3 py-2 rounded-xl shadow-2xl flex items-center gap-1.5 border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
                      <BadgePercent className="h-4 w-4" />
                      <span className="text-sm font-black tracking-tight">{discountPercent}%</span>
                      <span className="text-[10px] font-medium opacity-90">خصم</span>
                    </div>
                    <div className="absolute -inset-1 bg-red-500/20 blur-xl -z-10 rounded-full animate-pulse" />
                  </div>
                </div>
              )}
              
              {storeName && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white/95 z-10 group-hover:bg-black/80 transition-all duration-300">
                  <Store className="h-3 w-3" />
                  <span className="line-clamp-1 max-w-[120px]">{storeName}</span>
                </div>
              )}
              
              <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white z-10 group-hover:bg-black/80 transition-all duration-300">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {Number(item.rating || 0).toFixed(1)}
              </div>
              
              <button
                onClick={handleAddToCart}
                className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl opacity-0 group-hover:opacity-100 z-10"
              >
                <ShoppingCart className="h-4.5 w-4.5" />
              </button>
              
              <button
                onClick={handleToggleFavorite}
                className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-rose-500 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
              >
                <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
              </button>
              
              {isOffer && (
                <div className="absolute top-16 right-3 z-20">
                  <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                    <Sparkles className="h-3 w-3" />
                    <span>عرض</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-[#2a655f] transition-colors duration-300">
                {title}
              </h3>
              
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1">{gov || "جميع المحافظات"}</span>
                {cat && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="line-clamp-1">{cat}</span>
                  </>
                )}
              </div>
              
              <div className="mt-3">
                {renderPrice()}
              </div>
            </div>
          </Link>
        </div>

        {/* ✅ مودال تعارض المتجر */}
        <Dialog open={showStoreConflictDialog} onOpenChange={setShowStoreConflictDialog}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-[#0d2e2a]">
                <ShoppingCart className="h-6 w-6 text-amber-500" />
                {app.lang === "ar" ? "⚠️ سلة من متجر آخر" : "⚠️ Cart from another store"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {app.lang === "ar" 
                  ? `لديك منتجات في السلة من "${currentStoreName}"`
                  : `You have items in your cart from "${currentStoreName}"`}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4 space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {app.lang === "ar" 
                    ? `📦 السلة تحتوي على منتجات من "${currentStoreName}"`
                    : `📦 Your cart currently has items from "${currentStoreName}"`}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  {app.lang === "ar" 
                    ? `🛒 المنتج الجديد من "${newStoreName}"`
                    : `🛒 The new product is from "${newStoreName}"`}
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {app.lang === "ar" 
                  ? "لا يمكن إضافة منتجات من أكثر من متجر واحد في نفس السلة"
                  : "You cannot add products from different stores in the same cart"}
              </div>
              
              <div className="text-xs text-muted-foreground/70 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg">
                {app.lang === "ar" 
                  ? `💡 سيتم تفريغ السلة الحالية وإضافة المنتج من "${newStoreName}"`
                  : `💡 The current cart will be cleared and the product from "${newStoreName}" will be added`}
              </div>
            </div>
            
            <DialogFooter className="gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowStoreConflictDialog(false)}
                className="rounded-xl"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                onClick={handleConfirmSwitchStore}
                disabled={isProcessing}
                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {app.lang === "ar" ? "جاري التبديل..." : "Switching..."}
                  </div>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {app.lang === "ar" ? "تفريغ السلة وإضافة الجديد" : "Clear cart and add new"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ============================================================
  // ✅ عرض List (قائمة)
  // ============================================================
  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-2xl hover:shadow-[#2a655f]/15 transition-all duration-500 hover:-translate-y-1 border-2 border-[#2a655f]/20 hover:border-[#2a655f]/60">
        {isOffer && discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-20 animate-fade-up">
            <div className="relative">
              <div className="bg-gradient-to-br from-red-500 via-red-600 to-rose-700 text-white px-3 py-2 rounded-xl shadow-2xl flex items-center gap-1.5 border border-white/20 transform group-hover:scale-110 transition-transform duration-300">
                <BadgePercent className="h-4 w-4" />
                <span className="text-sm font-black tracking-tight">{discountPercent}%</span>
                <span className="text-[10px] font-medium opacity-90">خصم</span>
              </div>
              <div className="absolute -inset-1 bg-red-500/20 blur-xl -z-10 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        <Link to="/listing/$id" params={{ id: item.id }} className="flex flex-col sm:flex-row">
          <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden bg-gradient-to-br from-[#2a655f]/5 to-[#2a655f]/10">
            {renderImage()}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-rose-500 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
            >
              <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
            </button>
            
            {isOffer && (
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                  <Sparkles className="h-3 w-3" />
                  <span>عرض حصري</span>
                </div>
              </div>
            )}
            
            {storeName && (
              <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white/95 z-10 group-hover:bg-black/80 transition-all duration-300">
                <Store className="h-3 w-3" />
                <span className="line-clamp-1 max-w-[120px]">{storeName}</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {Number(item.rating || 0).toFixed(1)}
                </span>
                <span className="text-muted-foreground/30">|</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {gov || "جميع المحافظات"}
                </span>
                {cat && (
                  <>
                    <span className="text-muted-foreground/30">|</span>
                    <span>{cat}</span>
                  </>
                )}
              </div>
              
              <h3 className="mt-1.5 font-bold text-base line-clamp-2 group-hover:text-[#2a655f] transition-colors duration-300">
                {title}
              </h3>
            </div>
            
            <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
              <div className="space-y-1">
                {renderPrice()}
              </div>
              
              <button
                onClick={handleAddToCart}
                className="h-9 px-4 rounded-full bg-[#2a655f] hover:bg-[#3a8a82] text-white font-medium text-sm flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#2a655f]/30 hover:scale-105"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {t("add_to_cart")}
              </button>
            </div>
          </div>
        </Link>
      </div>

      {/* ✅ مودال تعارض المتجر */}
      <Dialog open={showStoreConflictDialog} onOpenChange={setShowStoreConflictDialog}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-[#0d2e2a]">
              <ShoppingCart className="h-6 w-6 text-amber-500" />
              {app.lang === "ar" ? "⚠️ سلة من متجر آخر" : "⚠️ Cart from another store"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {app.lang === "ar" 
                ? `لديك منتجات في السلة من "${currentStoreName}"`
                : `You have items in your cart from "${currentStoreName}"`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {app.lang === "ar" 
                  ? `📦 السلة تحتوي على منتجات من "${currentStoreName}"`
                  : `📦 Your cart currently has items from "${currentStoreName}"`}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                {app.lang === "ar" 
                  ? `🛒 المنتج الجديد من "${newStoreName}"`
                  : `🛒 The new product is from "${newStoreName}"`}
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {app.lang === "ar" 
                ? "لا يمكن إضافة منتجات من أكثر من متجر واحد في نفس السلة"
                : "You cannot add products from different stores in the same cart"}
            </div>
            
            <div className="text-xs text-muted-foreground/70 bg-slate-50 dark:bg-slate-800/30 p-3 rounded-lg">
              {app.lang === "ar" 
                ? `💡 سيتم تفريغ السلة الحالية وإضافة المنتج من "${newStoreName}"`
                : `💡 The current cart will be cleared and the product from "${newStoreName}" will be added`}
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowStoreConflictDialog(false)}
              className="rounded-xl"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              onClick={handleConfirmSwitchStore}
              disabled={isProcessing}
              className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {app.lang === "ar" ? "جاري التبديل..." : "Switching..."}
                </div>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {app.lang === "ar" ? "تفريغ السلة وإضافة الجديد" : "Clear cart and add new"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
});

// ✅ ✅ ✅ أضف displayName للـ Debug ✅ ✅ ✅
ListingCard.displayName = 'ListingCard';
export default ListingCard;