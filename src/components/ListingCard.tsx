// src/components/ListingCard.tsx - الدائرة وردي والأيقونة زيتي + زر المفضلة للمنتجات فقط

import { Link, useNavigate } from "@tanstack/react-router";
import { Star, MapPin, Heart, ImageIcon, ShoppingCart, Store, Sparkles, Gift } from "lucide-react";
import { useApp, formatPrice, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ListingWithRelations } from "@/lib/queries";
import { toast } from "sonner";
import { useAddToCart, useClearCart } from "@/lib/hooks/useCart";
import { useToggleFavorite } from "@/lib/queries";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, memo, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";

// ============================================================
// 🎨 ZOOQ COLORS
// ============================================================
const ZOOQ_COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  oliveVeryLight: '#e8f0ee',
  pink: '#f9a8d4',
  pinkLight: '#fbcfe8',
  pinkDark: '#f48fb1',
};

interface ListingCardProps {
  item: any;
  variant?: "grid" | "list";
  onAddToCart?: (item: any, e: React.MouseEvent) => void;
}

// ============================================================
// ✅ STORE CONFLICT MODAL
// ============================================================
function StoreConflictModalComponent({ 
  open, 
  onOpenChange, 
  onConfirm, 
  currentStoreName, 
  newStoreName,
  isProcessing,
  lang 
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  currentStoreName: string;
  newStoreName: string;
  isProcessing: boolean;
  lang: "ar" | "en";
}) {
  const isArabic = lang === "ar";
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-bold text-[#2a655f]">
            <ShoppingCart className="h-5 w-5 text-[#2a655f]" />
            {isArabic ? "⚠️ سلة من متجر آخر" : "⚠️ Cart from another store"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isArabic 
              ? `لديك منتجات في السلة من متجر "${currentStoreName}"`
              : `You have items in your cart from "${currentStoreName}"`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3 space-y-3">
          <div className="p-3 bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/20 text-xs space-y-1.5">
            <p className="text-[#2a655f] font-medium">
              📦 {isArabic ? `سلتك الحالية تتبع لـ: ${currentStoreName}` : `Current cart: ${currentStoreName}`}
            </p>
            <p className="text-[#2a655f] font-medium">
              🛒 {isArabic ? `المنتج الجديد يتبع لـ: ${newStoreName}` : `New product: ${newStoreName}`}
            </p>
          </div>
          
          <p className="text-xs text-muted-foreground leading-relaxed">
            {isArabic 
              ? "لا يمكن الجمع بين منتجات من متاجر مختلفة في نفس الطلب. هل تريد تفريغ السلة وإضافة هذا المنتج الجديد؟"
              : "You cannot mix products from different stores in the same order. Clear cart and add new?"}
          </p>
        </div>
        
        <DialogFooter className="gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="rounded-xl text-xs h-10"
          >
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button 
            onClick={onConfirm}
            disabled={isProcessing}
            className="bg-[#2a655f] hover:bg-[#3a8a82] text-white rounded-xl text-xs h-10 shadow-md"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                {isArabic ? "جاري التبديل..." : "Switching..."}
              </div>
            ) : (
              <>
                {isArabic ? "تفريغ السلة وإضافة الجديد" : "Clear & Add New"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
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
  
  // ✅ useToggleFavorite للحفظ في قاعدة البيانات
  const toggleFavoriteMutation = useToggleFavorite();
  
  const isPromoOffer = item.is_promo_offer === true;
  const isDiscountOffer = item.is_offer === true && !isPromoOffer;
  const promoOffer = item.promo_offer || item;
  
  // ✅ ✅ ✅ هل نعرض زر المفضلة؟ (فقط للمنتجات العادية وعروض التخفيض)
  const shouldShowFavoriteButton = !isPromoOffer;
  
  const [storeNameFromApi, setStoreNameFromApi] = useState<string>("");
  const [storeLogoFromApi, setStoreLogoFromApi] = useState<string>("");
  const [storeIdFromApi, setStoreIdFromApi] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!isPromoOffer || !promoOffer?.store_id) return;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("store_name, full_name, store_logo_url, avatar_url")
          .eq("id", promoOffer.store_id)
          .maybeSingle();
        
        if (!error && data) {
          setStoreNameFromApi(data.store_name || data.full_name || "");
          setStoreLogoFromApi(data.store_logo_url || data.avatar_url || "");
          setStoreIdFromApi(promoOffer.store_id);
        }
      } catch (error) {
        console.error("❌ Error fetching store name:", error);
      }
    };
    
    fetchStoreData();
  }, [isPromoOffer, promoOffer?.store_id]);
  
  // ✅ ✅ ✅ معرف المفضلة الصحيح (فقط للمنتجات الحقيقية)
  const favoriteTargetId = useMemo(() => {
    // للعروض الترويجية → لا يوجد ID (لا نضيفها للمفضلة)
    if (isPromoOffer) return null;
    // للمنتجات العادية وعروض التخفيض → item.id
    return item?.id || null;
  }, [isPromoOffer, item?.id]);
  
  // ✅ فحص المفضلة (فقط إذا كان ID صحيح)
  const fav = useMemo(() => {
    if (!favoriteTargetId) return false;
    return app.favorites.includes(favoriteTargetId);
  }, [app.favorites, favoriteTargetId]);
  
  const title = useMemo(() => 
    app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar),
    [app.lang, item.title_ar, item.title_en]
  );
  
  const gov = useMemo(() => 
    item.governorates ? (app.lang === "ar" ? item.governorates.name_ar : item.governorates.name_en) : "",
    [app.lang, item.governorates]
  );
  
  const cover = useMemo(() => 
    item.cover_url || item.listing_images?.[0]?.url || "",
    [item.cover_url, item.listing_images]
  );
  
  const storeName = useMemo(() => {
    if (isPromoOffer) {
      if (storeNameFromApi) return storeNameFromApi;
      if (promoOffer?.store_name) return promoOffer.store_name;
      if (promoOffer?.full_name) return promoOffer.full_name;
      
      const profile = item.profile || item.profiles || item.owner;
      if (profile?.store_name) return profile.store_name;
      if (profile?.full_name) return profile.full_name;
      
      return app.lang === "ar" ? "متجر" : "Store";
    }
    
    return (item as any).profile?.store_name || 
           (item as any).profiles?.store_name || 
           (item as any).owner?.store_name || 
           "";
  }, [item, isPromoOffer, promoOffer, storeNameFromApi, app.lang]);

  const storeCover = useMemo(() => {
    if (isPromoOffer) {
      if (storeLogoFromApi) return storeLogoFromApi;
      if (promoOffer?.store_logo_url) return promoOffer.store_logo_url;
      if (promoOffer?.avatar_url) return promoOffer.avatar_url;
      
      const profile = item.profile || item.profiles || item.owner;
      if (profile?.store_logo_url) return profile.store_logo_url;
      if (profile?.avatar_url) return profile.avatar_url;
      
      return "";
    }
    
    return (item as any).profile?.store_logo_url ||
           (item as any).profiles?.store_logo_url ||
           "";
  }, [item, isPromoOffer, promoOffer, storeLogoFromApi]);

  const storeId = useMemo(() => {
    if (isPromoOffer) {
      if (storeIdFromApi) return storeIdFromApi;
      if (promoOffer?.store_id) return promoOffer.store_id;
      if (item.owner_id) return item.owner_id;
      if (item.profile?.id) return item.profile.id;
      return null;
    }
    return item.owner_id || item.profile?.id || item.profiles?.id;
  }, [item, isPromoOffer, promoOffer, storeIdFromApi]);

  const price = useMemo(() => Number(item.price), [item.price]);
  
  const discountPercent = useMemo(() => 
    isDiscountOffer ? (item.discount_percent || 0) : 0,
    [isDiscountOffer, item.discount_percent]
  );
  
  const promoDiscountPercent = useMemo(() => {
    if (isPromoOffer && promoOffer.buy_quantity && promoOffer.get_quantity) {
      return Math.round((promoOffer.get_quantity / (promoOffer.buy_quantity + promoOffer.get_quantity)) * 100);
    }
    return 0;
  }, [isPromoOffer, promoOffer.buy_quantity, promoOffer.get_quantity]);
  
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
    
    if (item.owner_id === app.user.id || item.profile?.id === app.user.id) {
      toast.error(
        app.lang === "ar" 
          ? "❌ لا يمكنك إضافة منتجات من متجرك الخاص إلى السلة" 
          : "❌ You cannot add products from your own store to cart"
      );
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

  // ============================================================
  // ✅ ✅ ✅ زر المفضلة - شغال 100% (للمنتجات العادية فقط)
  // ============================================================
  const handleToggleFavorite = useCallback(async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // ✅ حماية إضافية: لا تعمل على العروض الترويجية
    if (isPromoOffer || !favoriteTargetId) {
      return;
    }
    
    // ✅ 1. تحقق من تسجيل الدخول
    if (!app.user) {
      toast.error(
        app.lang === "ar" 
          ? "🔐 يرجى تسجيل الدخول أولاً" 
          : "🔐 Please login first"
      );
      return;
    }
    
    try {
      // ✅ 2. احفظ في Supabase
      await toggleFavoriteMutation.mutateAsync({
        userId: app.user.id,
        listingId: favoriteTargetId,
        isFav: fav,
      });
      
      // ✅ 3. حدّث الـ state المحلي
      app.toggleFavorite(favoriteTargetId);
      
      // ✅ 4. اعرض toast
      toast.success(
        fav 
          ? (app.lang === "ar" ? "💔 تم الإزالة من المفضلة" : "💔 Removed from favorites")
          : (app.lang === "ar" ? "❤️ تم الإضافة للمفضلة" : "❤️ Added to favorites"),
        {
          duration: 2000,
          style: {
            background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
            border: '1px solid #f9a8d4',
            borderRadius: '16px',
          },
        }
      );
    } catch (error: any) {
      console.error("❌ Favorite error:", error);
      
      // ✅ رسالة خطأ مخصصة حسب نوع الخطأ
      if (error?.code === '23503') {
        toast.error(
          app.lang === "ar" 
            ? "❌ هذا المنتج غير متوفر حالياً" 
            : "❌ This product is not available"
        );
      } else {
        toast.error(
          app.lang === "ar" 
            ? "❌ حدث خطأ، حاول مرة أخرى" 
            : "❌ An error occurred, try again"
        );
      }
    }
  }, [app, favoriteTargetId, fav, toggleFavoriteMutation, app.lang, isPromoOffer]);

  const renderImage = useCallback(() => {
    if (cover) {
      return (
        <OptimizedImage
          src={cover}
          alt={title}
          width={400}
          height={400}
          quality={85}
          objectFit="cover"
          className="w-full h-full transition-transform duration-700 group-hover:scale-110"
        />
      );
    }
    return (
      <div className="h-full w-full grid place-items-center bg-[#2a655f]/5">
        <ImageIcon className="h-12 w-12 text-[#2a655f]/30" />
      </div>
    );
  }, [cover, title]);

  // عرض السعر مع الخصم
  const renderPrice = useCallback(() => {
    if (isDiscountOffer && oldPrice && discountPercent > 0) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#2a655f]/50 line-through font-medium">
            {formatPrice(oldPrice, app.currency, app.lang)}
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-bold text-[#2a655f]">
              {formatPrice(price, app.currency, app.lang)}
            </span>
            <Badge className="bg-[#2a655f] text-white border-0 text-[9px] px-1.5 py-0.5 rounded-full">
              -{discountPercent}%
            </Badge>
          </div>
        </div>
      );
    }
    
    if (isPromoOffer && promoDiscountPercent > 0) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-[#2a655f]">
            {formatPrice(price, app.currency, app.lang)}
          </span>
          <Badge className="bg-[#2a655f] text-white border-0 text-[9px] px-1.5 py-0.5 rounded-full flex items-center gap-1">
            <Gift className="h-2.5 w-2.5" />
            -{promoDiscountPercent}%
          </Badge>
        </div>
      );
    }
    
    return (
      <span className="text-lg font-bold text-[#2a655f]">
        {formatPrice(price, app.currency, app.lang)}
      </span>
    );
  }, [isDiscountOffer, isPromoOffer, oldPrice, price, discountPercent, promoDiscountPercent, app.currency, app.lang]);

  const productLink = isPromoOffer ? "/offer/$id" : "/listing/$id";

  const storeConflictModal = useMemo(() => (
    <StoreConflictModalComponent
      open={showStoreConflictDialog}
      onOpenChange={setShowStoreConflictDialog}
      onConfirm={handleConfirmSwitchStore}
      currentStoreName={currentStoreName}
      newStoreName={newStoreName}
      isProcessing={isProcessing}
      lang={app.lang}
    />
  ), [showStoreConflictDialog, currentStoreName, newStoreName, isProcessing, app.lang, handleConfirmSwitchStore]);

  // ✅ GRID VARIANT
  if (variant === "grid") {
    return (
      <>
        <div 
          onClick={() => navigate({ to: productLink, params: { id: item.id } })}
          className={cn(
            "group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer border border-[#2a655f]/10 hover:border-[#2a655f]/30 h-[380px] w-full"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="relative h-[200px] w-full overflow-hidden bg-[#2a655f]/5 shrink-0">
              {renderImage()}
              
              {/* ✅ ✅ ✅ زر المفضلة - يظهر فقط للمنتجات العادية وعروض التخفيض */}
              {shouldShowFavoriteButton && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleToggleFavorite(e);
                  }}
                  disabled={toggleFavoriteMutation.isPending}
                  className={cn(
                    "absolute top-3 left-3 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10",
                    toggleFavoriteMutation.isPending && "opacity-60 cursor-wait"
                  )}
                >
                  <Heart 
                    className={cn(
                      "h-6 w-6 transition-all duration-300",
                      fav 
                        ? "fill-[#f9a8d4] text-[#f9a8d4] scale-110" 
                        : "text-[#f9a8d4] hover:fill-[#f9a8d4]/30"
                    )} 
                  />
                </button>
              )}
              
              {/* التقييم */}
              <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-xs font-semibold text-[#2a655f] shadow-sm z-10">
                <Star className="h-3 w-3 fill-[#2a655f] text-[#2a655f]" />
                <span>{Number(item.rating || 0).toFixed(1)}</span>
              </div>

              {/* اسم المتجر */}
              {(storeCover || storeName) && storeId && (
                <Link 
                  to="/store/$id" 
                  params={{ id: storeId }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm p-1.5 pe-3 rounded-full shadow-md border border-[#2a655f]/10 max-w-[180px] hover:border-[#2a655f]/30 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full border border-[#2a655f]/20 overflow-hidden bg-white flex-shrink-0 grid place-items-center">
                    {storeCover ? (
                      <OptimizedImage
                        src={storeCover}
                        alt={storeName || "Store"}
                        width={48}
                        height={48}
                        quality={80}
                        objectFit="cover"
                        className="h-full w-full"
                      />
                    ) : (
                      <Store className="h-3 w-3 text-[#2a655f]" />
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-[#2a655f] line-clamp-1">
                    {storeName || (app.lang === "ar" ? "متجر" : "Store")}
                  </span>
                </Link>
              )}
            </div>
            
            <div className="p-3 flex-1 flex flex-col justify-between gap-1.5 min-h-0">
              <div className="flex-1 min-h-0">
                <div className="flex items-center gap-1 text-[10px] text-[#2a655f]/60 mb-1">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="line-clamp-1 text-xs">{gov || (app.lang === "ar" ? "جميع المحافظات" : "All regions")}</span>
                </div>

                <h3 className="font-semibold text-sm line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-[#2a655f] transition-colors duration-300 leading-snug">
                  {title}
                </h3>
              </div>
              
              <div className="pt-2 border-t border-[#2a655f]/10 flex items-center justify-between mt-auto">
                <div className="flex-1 min-w-0">
                  {renderPrice()}
                </div>
                
                {/* ✅ زر سلة - دائرة مفرغة بوردر وردي + أيقونة زيتية */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate({ to: productLink, params: { id: item.id } });
                  }}
                  className="h-9 w-9 rounded-full border-2 border-[#f9a8d4] flex items-center justify-center transition-all duration-300 hover:scale-105 hover:bg-[#f9a8d4]/10 shrink-0 ml-2"
                >
                  <ShoppingCart className="h-4 w-4 text-[#2a655f]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {storeConflictModal}
      </>
    );
  }

  // ✅ LIST VARIANT
  return (
    <>
      <div 
        onClick={() => navigate({ to: productLink, params: { id: item.id } })}
        className={cn(
          "group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col cursor-pointer border border-[#2a655f]/10 hover:border-[#2a655f]/30 h-[380px] w-full"
        )}
      >
        <div className="flex flex-row h-full">
          <div className="relative w-[200px] h-full shrink-0 overflow-hidden bg-[#2a655f]/5">
            {renderImage()}
            
            {/* ✅ ✅ ✅ زر المفضلة - يظهر فقط للمنتجات العادية وعروض التخفيض */}
            {shouldShowFavoriteButton && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorite(e);
                }}
                disabled={toggleFavoriteMutation.isPending}
                className={cn(
                  "absolute top-3 left-3 h-8 w-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10",
                  toggleFavoriteMutation.isPending && "opacity-60 cursor-wait"
                )}
              >
                <Heart 
                  className={cn(
                    "h-6 w-6 transition-all duration-300",
                    fav 
                      ? "fill-[#f9a8d4] text-[#f9a8d4] scale-110" 
                      : "text-[#f9a8d4] hover:fill-[#f9a8d4]/30"
                  )} 
                />
              </button>
            )}
            
            <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-xs font-semibold text-[#2a655f] shadow-sm z-10">
              <Star className="h-3 w-3 fill-[#2a655f] text-[#2a655f]" />
              <span>{Number(item.rating || 0).toFixed(1)}</span>
            </div>

            {(storeCover || storeName) && storeId && (
              <Link 
                to="/store/$id" 
                params={{ id: storeId }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm p-1.5 pe-3 rounded-full shadow-md border border-[#2a655f]/10 max-w-[160px] hover:border-[#2a655f]/30 transition-colors"
              >
                <div className="h-6 w-6 rounded-full border border-[#2a655f]/20 overflow-hidden bg-white flex-shrink-0 grid place-items-center">
                  {storeCover ? (
                    <OptimizedImage
                      src={storeCover}
                      alt={storeName || "Store"}
                      width={48}
                      height={48}
                      quality={80}
                      objectFit="cover"
                      className="h-full w-full"
                    />
                  ) : (
                    <Store className="h-3 w-3 text-[#2a655f]" />
                  )}
                </div>
                <span className="text-[10px] font-medium text-[#2a655f] line-clamp-1">
                  {storeName || (app.lang === "ar" ? "متجر" : "Store")}
                </span>
              </Link>
            )}
          </div>
          
          <div className="flex-1 p-3 flex flex-col justify-between gap-1.5 min-h-0">
            <div className="flex-1 min-h-0">
              <div className="flex items-center gap-1 text-[10px] text-[#2a655f]/60 mb-1">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="line-clamp-1 text-xs">{gov || (app.lang === "ar" ? "جميع المحافظات" : "All regions")}</span>
              </div>
              
              <h3 className="font-semibold text-sm line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-[#2a655f] transition-colors duration-300 leading-snug">
                {title}
              </h3>
            </div>
            
            <div className="pt-2 border-t border-[#2a655f]/10 flex items-center justify-between mt-auto">
              <div className="flex-1 min-w-0">
                {renderPrice()}
              </div>
              
              {/* ✅ زر سلة - دائرة مفرغة بوردر وردي + أيقونة زيتية + نص زيتي */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  navigate({ to: productLink, params: { id: item.id } });
                }}
                className="h-9 px-4 rounded-full border-2 border-[#f9a8d4] flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:bg-[#f9a8d4]/10 shrink-0 ml-2"
              >
                <ShoppingCart className="h-4 w-4 text-[#2a655f]" />
                <span className="text-xs font-medium text-[#2a655f]">
                  {app.lang === "ar" ? "تفاصيل" : "Details"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {storeConflictModal}
    </>
  );
});

// ✅ CSS للحركات
const styleTag = typeof document !== 'undefined' ? document.createElement('style') : null;
if (styleTag) {
  styleTag.innerHTML = `
    @keyframes spin-slow {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .animate-spin-slow {
      animation: spin-slow 3s linear infinite;
    }
  `;
  document.head.appendChild(styleTag);
}

ListingCard.displayName = 'ListingCard';
export default ListingCard;