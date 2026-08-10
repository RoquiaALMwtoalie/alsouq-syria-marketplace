// src/components/ListingCard.tsx

import { Link, useNavigate } from "@tanstack/react-router";
import { Star, MapPin, Heart, ImageIcon, ShoppingCart, Store, Sparkles, Trash2, Eye } from "lucide-react";
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
import { cn } from "@/lib/utils";

interface ListingCardProps {
  item: ListingWithRelations;
  variant?: "grid" | "list";
  onAddToCart?: (item: any, e: React.MouseEvent) => void;
}

export const ListingCard = memo(function ListingCard({ 
  item, 
  variant = "grid", 
  onAddToCart: externalOnAddToCart 
}: ListingCardProps) {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();
  const clearCartMutation = useClearCart();
  
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
    (item as any).profile?.store_name || 
    (item as any).profiles?.store_name || 
    (item as any).owner?.store_name || 
    (item as any).profile?.full_name || 
    (item as any).profiles?.full_name || 
    (item as any).owner?.full_name || 
    "",
    [item]
  );

  const storeCover = useMemo(() => 
    (item as any).profile?.store_cover_url || 
    (item as any).profile?.store_logo_url ||
    (item as any).profiles?.store_cover_url || 
    (item as any).profiles?.store_logo_url ||
    "",
    [item]
  );
  
  const price = useMemo(() => Number(item.price), [item.price]);
  
  const hasVariations = useMemo(() => 
    item.variations && item.variations.length > 0,
    [item.variations]
  );
  
  const isOffer = useMemo(() => item.is_offer === true, [item.is_offer]);
  const discountPercent = useMemo(() => item.discount_percent || 0, [item.discount_percent]);
  const oldPrice = useMemo(() => 
    item.old_price ? Number(item.old_price) : null,
    [item.old_price]
  );
  
  const [showStoreConflictDialog, setShowStoreConflictDialog] = useState(false);
  const [conflictData, setConflictData] = useState<any>(null);
  const [currentStoreName, setCurrentStoreName] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAddToCart = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
          ? `✅ تم تبديل المتجر إلى "${newStoreName}" وإضافة المنتج`
          : `✅ Store switched to "${newStoreName}" and product added`
      );
      setShowStoreConflictDialog(false);
      setConflictData(null);
    } catch (error) {
      toast.error(app.lang === "ar" ? "❌ حدث خطأ أثناء تبديل المتجر" : "❌ Error switching store");
    } finally {
      setIsProcessing(false);
    }
  }, [app.user, app.lang, conflictData, clearCartMutation, addToCartMutation, item.id, newStoreName]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    app.toggleFavorite(item.id);
  }, [app, item.id]);

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

  const renderPrice = useCallback(() => {
    if (isOffer && oldPrice) {
      return (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-rose-500 line-through font-semibold">
              {formatPrice(oldPrice, app.currency, app.lang)}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-1">
            <span className="text-lg md:text-xl font-black text-[#2a655f] dark:text-[#3a8a82] tracking-tight">
              {formatPrice(price, app.currency, app.lang)}
            </span>
            <span className="text-[10px] font-bold text-white bg-gradient-to-r from-red-600 to-orange-500 px-2 py-0.5 rounded-full shadow-md animate-pulse">
              {discountPercent}% OFF
            </span>
          </div>
        </div>
      );
    }
    
    return (
      <div>
        <span className="text-lg md:text-xl font-black text-[#2a655f] dark:text-[#3a8a82] tracking-tight">
          {formatPrice(price, app.currency, app.lang)}
        </span>
      </div>
    );
  }, [isOffer, oldPrice, price, discountPercent, app.currency, app.lang]);

  const renderVariations = useCallback((maxDisplay: number = 3) => {
    const variationsArray = item.variations || [];
    
    if (!variationsArray || variationsArray.length === 0) {
      return null;
    }
    
    return (
      <div className="flex flex-wrap gap-1">
        {variationsArray.slice(0, maxDisplay).map((variation: any, idx: number) => {
          const combinationText = variation.combination 
            ? Object.entries(variation.combination)
                .map(([_, value]) => `${value}`)
                .join(' / ')
            : '';

          return (
            <Badge 
              key={idx}
              variant="outline"
              className="text-[9px] px-1.5 py-0 border-[#2a655f]/20 bg-[#2a655f]/5 dark:bg-[#2a655f]/10"
            >
              <span>{combinationText}</span>
              <span className="font-bold text-[#2a655f] mr-1">
                ({formatPrice(variation.price || item.price, app.currency, app.lang)})
              </span>
            </Badge>
          );
        })}
        {variationsArray.length > maxDisplay && (
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-[#2a655f]/20">
            +{variationsArray.length - maxDisplay}
          </Badge>
        )}
      </div>
    );
  }, [item.variations, item.price, app.currency, app.lang]);

  if (variant === "grid") {
    return (
      <>
        <div className={cn(
          "group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl hover:shadow-[#2a655f]/30 transition-all duration-500 hover:-translate-y-1.5 flex flex-col h-[440px]",
          isOffer 
            ? "border-2 border-red-500/80 glowing-offer-card" 
            : "border-2 border-[#1b433e] dark:border-[#3a8a82]/80 hover:border-[#2a655f]"
        )}>
          <Link to="/listing/$id" params={{ id: item.id }} className="flex flex-col h-full">
            <div className="relative h-[210px] w-full overflow-hidden bg-gradient-to-br from-[#2a655f]/5 to-[#3a8a82]/10 shrink-0">
              {renderImage()}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {isOffer && discountPercent > 0 && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 text-white px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-1 border-2 border-white/40 animate-bounce font-black">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-xs">خصم {discountPercent}%</span>
                  </div>
                </div>
              )}
              
              <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white z-10">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{Number(item.rating || 0).toFixed(1)}</span>
              </div>
              
              <button
                onClick={handleToggleFavorite}
                className="absolute top-12 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-rose-500 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
              >
                <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
              </button>

              {(storeCover || storeName) && (
                <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-gradient-to-r from-black/80 via-black/70 to-[#1b433e]/80 backdrop-blur-md p-1.5 pe-3.5 rounded-full border border-white/20 shadow-xl max-w-[210px] group-hover:border-[#3a8a82] transition-colors">
                  <div className="h-7 w-7 rounded-full border border-white/40 shadow-inner overflow-hidden bg-white flex-shrink-0 grid place-items-center">
                    {storeCover ? (
                      <img 
                        src={storeCover} 
                        alt={storeName || "Store"} 
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Store className="h-3.5 w-3.5 text-[#2a655f]" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-white tracking-wide line-clamp-1">
                    {storeName || (app.lang === "ar" ? "متجر" : "Store")}
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <div className="flex items-center gap-1 text-[11px] text-muted-foreground mb-1.5">
                  <MapPin className="h-3 w-3 shrink-0 text-[#2a655f]" />
                  <span className="line-clamp-1">{gov || "جميع المحافظات"}</span>
                  {cat && (
                    <>
                      <span>•</span>
                      <span className="line-clamp-1 text-[#2a655f] font-medium">{cat}</span>
                    </>
                  )}
                </div>

                <h3 className="font-bold text-sm line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-[#2a655f] transition-colors duration-300 leading-snug h-[40px]">
                  {title}
                </h3>
              </div>
              
              {renderVariations(3)}
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  {renderPrice()}
                </div>
                
                {hasVariations ? (
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white shadow-md shadow-indigo-500/30 transition-all duration-300 hover:scale-105 shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate({ to: "/listing/$id", params: { id: item.id } });
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    onClick={handleAddToCart}
                    className="h-10 w-10 rounded-xl bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 shrink-0"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Link>
        </div>

        <StoreConflictModal />
      </>
    );
  }

  return (
    <>
      <div className={cn(
        "group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-2xl hover:shadow-[#2a655f]/20 transition-all duration-500 hover:-translate-y-1",
        isOffer 
          ? "border-2 border-red-500/80 glowing-offer-card" 
          : "border-2 border-[#1b433e] dark:border-[#3a8a82]/80 hover:border-[#2a655f]"
      )}>
        {isOffer && discountPercent > 0 && (
          <div className="absolute top-3 right-3 z-25">
            <div className="bg-gradient-to-r from-red-600 to-amber-500 text-white px-3.5 py-1 rounded-xl shadow-lg flex items-center gap-1 border border-white/20 animate-pulse font-bold text-xs">
              <Sparkles className="h-3.5 w-3.5" />
              <span>عرض خاص {discountPercent}%</span>
            </div>
          </div>
        )}

        <Link to="/listing/$id" params={{ id: item.id }} className="flex flex-col sm:flex-row h-full">
          <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden bg-gradient-to-br from-[#2a655f]/5 to-[#3a8a82]/15">
            {renderImage()}
            
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-rose-500 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
            >
              <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
            </button>
            
            {(storeCover || storeName) && (
              <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-gradient-to-r from-black/80 via-black/70 to-[#1b433e]/80 backdrop-blur-md p-1.5 pe-3.5 rounded-full border border-white/20 shadow-xl max-w-[210px] group-hover:border-[#3a8a82] transition-colors">
                <div className="h-7 w-7 rounded-full border border-white/40 shadow-inner overflow-hidden bg-white flex-shrink-0 grid place-items-center">
                  {storeCover ? (
                    <img 
                      src={storeCover} 
                      alt={storeName || "Store"} 
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <Store className="h-3.5 w-3.5 text-[#2a655f]" />
                  )}
                </div>
                <span className="text-[11px] font-bold text-white tracking-wide line-clamp-1">
                  {storeName || (app.lang === "ar" ? "متجر" : "Store")}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  {Number(item.rating || 0).toFixed(1)}
                </span>
                <span className="text-muted-foreground/30">•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-[#2a655f]" />
                  {gov || "جميع المحافظات"}
                </span>
                {cat && (
                  <>
                    <span className="text-muted-foreground/30">•</span>
                    <span className="text-[#2a655f] font-medium">{cat}</span>
                  </>
                )}
              </div>
              
              <h3 className="mt-2 font-bold text-base md:text-lg line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-[#2a655f] transition-colors duration-300">
                {title}
              </h3>
            </div>
            
            {renderVariations(4)}
            
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                {renderPrice()}
              </div>
              
              {hasVariations ? (
                <Link to="/listing/$id" params={{ id: item.id }}>
                  <Button
                    className="h-10 px-5 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-xs flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105"
                  >
                    <Eye className="h-4 w-4" />
                    {app.lang === "ar" ? "اختيار" : "Choose"}
                  </Button>
                </Link>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  className="h-10 px-5 rounded-xl bg-[#2a655f] hover:bg-[#3a8a82] text-white font-semibold text-xs flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#2a655f]/30 hover:scale-105"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t("add_to_cart") || "إضافة للسلة"}
                </Button>
              )}
            </div>
          </div>
        </Link>
      </div>

      <StoreConflictModal />
    </>
  );

  function StoreConflictModal() {
    return (
      <Dialog open={showStoreConflictDialog} onOpenChange={setShowStoreConflictDialog}>
        <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#2a655f]">
              <ShoppingCart className="h-5 w-5 text-amber-500" />
              {app.lang === "ar" ? "⚠️ سلة من متجر آخر" : "⚠️ Cart from another store"}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {app.lang === "ar" 
                ? `لديك منتجات في السلة من متجر "${currentStoreName}"`
                : `You have items in your cart from "${currentStoreName}"`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-3 space-y-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-xl border border-amber-200/60 dark:border-amber-800/40 text-xs space-y-1.5">
              <p className="text-amber-800 dark:text-amber-300 font-medium">
                📦 {app.lang === "ar" ? `سلتك الحالية تتبع لـ: ${currentStoreName}` : `Current cart: ${currentStoreName}`}
              </p>
              <p className="text-amber-800 dark:text-amber-300 font-medium">
                🛒 {app.lang === "ar" ? `المنتج الجديد يتبع لـ: ${newStoreName}` : `New product: ${newStoreName}`}
              </p>
            </div>
            
            <p className="text-xs text-muted-foreground leading-relaxed">
              {app.lang === "ar" 
                ? "لا يمكن الجمع بين منتجات من متاجر مختلفة في نفس الطلب. هل تريد تفريغ السلة وإضافة هذا المنتج الجديد؟"
                : "You cannot mix products from different stores in the same order. Clear cart and add new?"}
            </p>
          </div>
          
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowStoreConflictDialog(false)}
              className="rounded-xl text-xs h-10"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              onClick={handleConfirmSwitchStore}
              disabled={isProcessing}
              className="bg-[#2a655f] hover:bg-[#3a8a82] text-white rounded-xl text-xs h-10 shadow-md"
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {app.lang === "ar" ? "جاري التبديل..." : "Switching..."}
                </div>
              ) : (
                <>
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  {app.lang === "ar" ? "تفريغ السلة وإضافة الجديد" : "Clear & Add New"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
});

const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleTag) {
  styleTag.innerHTML = `
    @keyframes offer-glow {
      0% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4), 0 0 20px rgba(245, 158, 11, 0.2); }
      50% { box-shadow: 0 0 25px rgba(239, 68, 68, 0.8), 0 0 40px rgba(245, 158, 11, 0.5); }
      100% { box-shadow: 0 0 10px rgba(239, 68, 68, 0.4), 0 0 20px rgba(245, 158, 11, 0.2); }
    }
    .glowing-offer-card {
      animation: offer-glow 2.5s infinite ease-in-out;
    }
  `;
  document.head.appendChild(styleTag);
}

ListingCard.displayName = 'ListingCard';
export default ListingCard;