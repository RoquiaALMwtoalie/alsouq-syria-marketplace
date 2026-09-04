// src/components/ListingCard.tsx - الكود الكامل مع بوردر فوشي غامق مطابق لـ StoreCard

import { Link, useNavigate } from "@tanstack/react-router";
import { 
  Star, MapPin, Heart, ImageIcon, ShoppingCart, Store, Sparkles, Trash2, Eye, Gift, Tag, Percent, Package 
} from "lucide-react";
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
import { useState, memo, useCallback, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const ZOOQ_COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  oliveVeryLight: '#e8f0ee',
  pink: '#f9a8d4',
  pinkLight: '#fbcfe8',
  pinkDark: '#f48fb1',
  pinkVeryLight: '#fdf2f8',
  glowOlive: 'rgba(42,101,95,0.15)',
  glowPink: 'rgba(249,168,212,0.2)',
  glowPinkStrong: 'rgba(249,168,212,0.35)',
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
            <ShoppingCart className="h-5 w-5 text-[#f9a8d4]" />
            {isArabic ? "⚠️ سلة من متجر آخر" : "⚠️ Cart from another store"}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            {isArabic 
              ? `لديك منتجات في السلة من متجر "${currentStoreName}"`
              : `You have items in your cart from "${currentStoreName}"`}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-3 space-y-3">
          <div className="p-3 bg-[#fbcfe8]/45 dark:bg-[#2a655f]/10 rounded-xl border border-[#f9a8d4]/35 dark:border-[#2a655f]/35 text-xs space-y-1.5">
            <p className="text-[#2a655f] dark:text-[#fbcfe8] font-medium">
              📦 {isArabic ? `سلتك الحالية تتبع لـ: ${currentStoreName}` : `Current cart: ${currentStoreName}`}
            </p>
            <p className="text-[#2a655f] dark:text-[#fbcfe8] font-medium">
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
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
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
  
  const isPromoOffer = item.is_promo_offer === true;
  const isDiscountOffer = item.is_offer === true && !isPromoOffer;
  const promoOffer = item.promo_offer || item;
  
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
  
  const storeName = useMemo(() => {
    if (isPromoOffer) {
      if (storeNameFromApi) return storeNameFromApi;
      if (promoOffer?.store_name) return promoOffer.store_name;
      if (promoOffer?.full_name) return promoOffer.full_name;
      
      const profile = item.profile || item.profiles || item.owner;
      if (profile?.store_name) return profile.store_name;
      if (profile?.full_name) return profile.full_name;
      if (item.profile?.store_name) return item.profile.store_name;
      if (item.profiles?.store_name) return item.profiles.store_name;
      
      const mainProduct = item.products || item;
      if (mainProduct?.profile?.store_name) return mainProduct.profile.store_name;
      if (mainProduct?.profiles?.store_name) return mainProduct.profiles.store_name;
      
      if (item.store_name) return item.store_name;
      
      return app.lang === "ar" ? "متجر" : "Store";
    }
    
    return (item as any).profile?.store_name || 
           (item as any).profiles?.store_name || 
           (item as any).owner?.store_name || 
           (item as any).profile?.full_name || 
           (item as any).profiles?.full_name || 
           (item as any).owner?.full_name || 
           "";
  }, [item, isPromoOffer, promoOffer, storeNameFromApi, app.lang]);

  const storeCover = useMemo(() => {
    if (isPromoOffer) {
      if (storeLogoFromApi) return storeLogoFromApi;
      if (promoOffer?.store_logo_url) return promoOffer.store_logo_url;
      if (promoOffer?.avatar_url) return promoOffer.avatar_url;
      
      const profile = item.profile || item.profiles || item.owner;
      if (profile?.store_cover_url) return profile.store_cover_url;
      if (profile?.store_logo_url) return profile.store_logo_url;
      if (profile?.avatar_url) return profile.avatar_url;
      
      const mainProduct = item.products || item;
      if (mainProduct?.profile?.store_logo_url) return mainProduct.profile.store_logo_url;
      if (mainProduct?.profiles?.store_logo_url) return mainProduct.profiles.store_logo_url;
      
      return "";
    }
    
    return (item as any).profile?.store_cover_url || 
           (item as any).profile?.store_logo_url ||
           (item as any).profiles?.store_cover_url || 
           (item as any).profiles?.store_logo_url ||
           "";
  }, [item, isPromoOffer, promoOffer, storeLogoFromApi]);

  const storeId = useMemo(() => {
    if (isPromoOffer) {
      if (storeIdFromApi) return storeIdFromApi;
      if (promoOffer?.store_id) return promoOffer.store_id;
      
      if (item.owner_id) return item.owner_id;
      if (item.profile?.id) return item.profile.id;
      if (item.profiles?.id) return item.profiles.id;
      
      const mainProduct = item.products || item;
      if (mainProduct?.owner_id) return mainProduct.owner_id;
      
      return null;
    }
    return item.owner_id || item.profile?.id || item.profiles?.id;
  }, [item, isPromoOffer, promoOffer, storeIdFromApi]);

  const price = useMemo(() => Number(item.price), [item.price]);
  
  const hasVariations = useMemo(() => {
    if (item.variations?.length > 0) return true;
    if (item.variation_ids?.length > 0) return true;
    if (item.product_variations?.length > 0) return true;
    if (item.product_options?.length > 0) return true;
    if (item.options?.length > 0) return true;
    if (item.product_colors?.length > 0) return true;
    if (isPromoOffer && promoOffer?.variation_ids?.length > 0) return true;
    if (item.metadata?.variations && Object.keys(item.metadata.variations).length > 0) return true;
    return false;
  }, [item, isPromoOffer, promoOffer]);
  
  const discountPercent = useMemo(() => 
    isDiscountOffer ? (item.discount_percent || 0) : 0,
    [isDiscountOffer, item.discount_percent]
  );
  
  const savings = useMemo(() => {
    if (isDiscountOffer && item.old_price && item.old_price > item.price) {
      return Number(item.old_price) - Number(item.price);
    }
    return 0;
  }, [isDiscountOffer, item.old_price, item.price]);
  
  const promoDiscountPercent = useMemo(() => {
    if (isPromoOffer && promoOffer.buy_quantity && promoOffer.get_quantity) {
      return Math.round((promoOffer.get_quantity / (promoOffer.buy_quantity + promoOffer.get_quantity)) * 100);
    }
    return 0;
  }, [isPromoOffer, promoOffer.buy_quantity, promoOffer.get_quantity]);
  
  const promoSavings = useMemo(() => {
    if (isPromoOffer && promoOffer.get_quantity && price) {
      return price * promoOffer.get_quantity;
    }
    return 0;
  }, [isPromoOffer, promoOffer.get_quantity, price]);
  
  const oldPrice = useMemo(() => 
    item.old_price ? Number(item.old_price) : null,
    [item.old_price]
  );
  
  const getPromoTypeLabel = useCallback((type: string) => {
    const types: Record<string, { label: string; icon: any }> = {
      bogo: { 
        label: app.lang === "ar" ? "اشتر 1 واحصل على 1" : "Buy 1 Get 1", 
        icon: Gift 
      },
      cross_sell: { 
        label: app.lang === "ar" ? "شراء منتج والحصول على آخر" : "Buy product get another", 
        icon: Tag 
      },
      bundle: { 
        label: app.lang === "ar" ? "باقة منتجات" : "Bundle", 
        icon: Package 
      },
    };
    return types[type] || types.bogo;
  }, [app.lang]);

  const promoType = isPromoOffer && promoOffer.offer_type ? getPromoTypeLabel(promoOffer.offer_type) : null;
  
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
    
    if (item.owner_id === app.user.id || item.profile?.id === app.user.id || item.profiles?.id === app.user.id) {
      toast.error(
        app.lang === "ar" 
          ? "❌ لا يمكنك إضافة منتجات من متجرك الخاص إلى السلة" 
          : "❌ You cannot add products from your own store to cart"
      );
      return;
    }
    
    if (isPromoOffer && promoOffer?.store_id === app.user.id) {
      toast.error(
        app.lang === "ar" 
          ? "❌ لا يمكنك إضافة عروض من متجرك الخاص إلى السلة" 
          : "❌ You cannot add offers from your own store to cart"
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
  }, [app.user, app.lang, item.id, isPromoOffer, promoOffer, addToCartMutation]);

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
      <div className="h-full w-full grid place-items-center">
        <ImageIcon className="h-12 w-12 text-[#2a655f]/30" />
      </div>
    );
  }, [cover, title]);

  const renderPrice = useCallback(() => {
    if (isDiscountOffer && oldPrice) {
      return (
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#2a655f]/55 dark:text-[#fbcfe8]/80 line-through font-semibold">
              {formatPrice(oldPrice, app.currency, app.lang)}
            </span>
          </div>
          
          <div className="flex items-center justify-between gap-1">
            <span className="text-lg md:text-xl font-black text-[#2a655f] dark:text-[#3a8a82] tracking-tight">
              {formatPrice(price, app.currency, app.lang)}
            </span>
            <span className="text-[10px] font-bold text-white bg-[#2a655f] px-2 py-0.5 rounded-full shadow-md">
              {discountPercent}% OFF
            </span>
          </div>
          
          {savings > 0 && (
            <div className="text-[10px] text-[#2a655f] dark:text-[#f9a8d4] font-medium">
              💰 {app.lang === "ar" ? "وفر" : "Save"} {formatPrice(savings, app.currency, app.lang)}
            </div>
          )}
        </div>
      );
    }
    
    if (isPromoOffer) {
      return (
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-lg md:text-xl font-black text-[#2a655f] dark:text-[#3a8a82] tracking-tight">
              {formatPrice(price, app.currency, app.lang)}
            </span>
            {promoDiscountPercent > 0 && (
              <span className="text-[10px] font-bold text-[#2a655f] bg-[#f9a8d4] px-2 py-0.5 rounded-full shadow-md">
                🎁 {promoDiscountPercent}% OFF
              </span>
            )}
          </div>
          
          {promoSavings > 0 && (
            <div className="text-[10px] text-[#2a655f] dark:text-[#f9a8d4] font-medium flex items-center gap-1">
              <Gift className="h-3 w-3" />
              {app.lang === "ar" ? "وفر" : "Save"} {formatPrice(promoSavings, app.currency, app.lang)}
              <span className="text-[#2a655f] dark:text-[#f9a8d4] font-bold text-[9px]">
                ({app.lang === "ar" ? "مجاناً" : "FREE"})
              </span>
            </div>
          )}
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
  }, [isDiscountOffer, isPromoOffer, oldPrice, price, discountPercent, savings, promoSavings, promoDiscountPercent, app.currency, app.lang]);

  const renderPromoDetails = useCallback(() => {
    if (!isPromoOffer || !promoOffer) return null;
    
    return (
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        <Badge className="bg-[#2a655f] text-white border-0 text-[9px] px-2 py-0.5 flex items-center gap-1">
          <Sparkles className="h-2.5 w-2.5" />
          {app.lang === "ar" ? "عرض ترويجي" : "Promo"}
        </Badge>
        {promoType && (
          <Badge variant="outline" className="text-[9px] border-[#f9a8d4]/60 text-[#2a655f] dark:border-[#fbcfe8]/50 dark:text-[#f9a8d4] px-2 py-0.5 flex items-center gap-1">
            {promoType.icon && <promoType.icon className="h-2.5 w-2.5" />}
            {promoType.label}
          </Badge>
        )}
        <span className="text-[10px] text-[#2a655f] dark:text-[#f9a8d4] font-medium flex items-center gap-1">
          <Gift className="h-2.5 w-2.5" />
          {app.lang === "ar" ? "اشتري" : "Buy"} {promoOffer.buy_quantity || 2} 
          {app.lang === "ar" ? " واحصل على" : " get"} {promoOffer.get_quantity || 1} 
          {app.lang === "ar" ? " مجاناً" : " free"}
        </span>
      </div>
    );
  }, [isPromoOffer, promoOffer, promoType, app.lang]);

  const renderVariations = useCallback((maxDisplay: number = 3) => {
    let variationsArray = [];
    
    if (isPromoOffer && item.variation_ids && item.variation_ids.length > 0) {
      variationsArray = (item.variations || []).filter((v: any) => 
        item.variation_ids.includes(v.id)
      );
    } else {
      variationsArray = item.variations || [];
    }
    
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
  }, [isPromoOffer, item.variations, item.variation_ids, item.price, app.currency, app.lang]);

  const renderColors = useCallback((maxDisplay: number = 5) => {
    const colors = item.product_colors || item.colors || [];
    
    if (!colors || colors.length === 0) return null;
    
    const isLightColor = (hex: string): boolean => {
      if (!hex || hex === '#CCCCCC' || hex === '#cccccc') return true;
      
      let r: number, g: number, b: number;
      const clean = hex.replace('#', '');
      
      if (clean.length === 3) {
        r = parseInt(clean[0] + clean[0], 16);
        g = parseInt(clean[1] + clean[1], 16);
        b = parseInt(clean[2] + clean[2], 16);
      } else if (clean.length === 6) {
        r = parseInt(clean.substring(0, 2), 16);
        g = parseInt(clean.substring(2, 4), 16);
        b = parseInt(clean.substring(4, 6), 16);
      } else {
        return true;
      }
      
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5;
    };
    
    const defaultColors: Record<string, string> = {
      'أحمر': '#FF0000', 'احمر': '#FF0000',
      'أزرق': '#0000FF', 'ازرق': '#0000FF',
      'أخضر': '#00FF00', 'اخضر': '#00FF00',
      'أسود': '#000000', 'اسود': '#000000',
      'أبيض': '#FFFFFF', 'ابيض': '#FFFFFF',
      'بني': '#8B4513',
      'ذهبي': '#FFD700',
      'فضي': '#C0C0C0',
      'وردي': '#FF69B4',
      'بنفسجي': '#800080',
      'أصفر': '#FFFF00', 'اصفر': '#FFFF00',
      'برتقالي': '#FF8C00',
      'رمادي': '#808080',
      'بيج': '#F5F5DC',
      'نحاسي': '#B87333',
      'تركواز': '#40E0D0',
      'فيروزي': '#40E0D0',
      'كحلي': '#000080',
      'عسلي': '#C68E5E',
      'كريمي': '#FFFDD0',
      'خمري': '#722F37',
      'نبيتي': '#722F37',
      'عنابي': '#800000',
      'زيتوني': '#808000',
      'نعناعي': '#98FF98',
      'لافندر': '#E6E6FA',
      'موف': '#C8A2C8',
      'مرجاني': '#FF7F50',
      'قرمزي': '#DC143C',
      'كرزي': '#DE3163',
      'سماوي': '#00BFFF',
      'ليموني': '#FFF44F',
      'خوخي': '#FFDAB9',
      'عنبري': '#FFBF00',
      'زهري': '#FFB6C1',
      'فوشي': '#FF00FF',
      'أرجواني': '#800080',
      'بشري': '#F5D0B8',
      'خردلي': '#DAA520',
      'مينت': '#98FF98',
      'بيبي بينك': '#F4C2C2',
      'نود': '#E8D5B7',
      'رملي': '#D7C4A1',
      'ثلجي': '#FFFAFA',
      'أوف وايت': '#F8F8FF',
      'ترابي': '#C4A882',
      'قمحي': '#F5DEB3',
      'حنطي': '#D4A574',
      'سكري': '#FDF5E6',
      'عاجي': '#FFFFF0',
      'لؤلؤي': '#F5F5F5',
      'قهوي': '#6F4E37',
      'شوكولاتة': '#7B3F00',
      'كاكي': '#C3B091',
      'برونزي': '#CD7F32',
    };
    
    return (
      <div className="flex items-center gap-1.5 mt-2 flex-wrap">
        <span className="text-[10px] text-muted-foreground font-medium">
          {app.lang === "ar" ? "الألوان:" : "Colors:"}
        </span>
        {colors.slice(0, maxDisplay).map((color: any, idx: number) => {
          let hexColor = color.color_hex;
          if (!hexColor || hexColor === 'null' || hexColor === '') {
            const name = (color.color_name_ar || color.color_name_en || '').toLowerCase();
            hexColor = defaultColors[name] || '#CCCCCC';
          }
          
          const imageUrl = color.image_url;
          const colorName = app.lang === "ar" ? color.color_name_ar : (color.color_name_en || color.color_name_ar);
          const isLight = isLightColor(hexColor);
          
          return (
            <div
              key={idx}
              className="group relative h-6 w-6 rounded-full border-2 border-[#f9a8d4]/30 shadow-sm transition-transform hover:scale-110 cursor-pointer overflow-visible flex items-center justify-center"
              style={{ 
                backgroundColor: imageUrl ? 'transparent' : hexColor,
                backgroundImage: imageUrl ? `url(${imageUrl})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div 
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-xl text-[11px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 shadow-xl border border-white/20 pointer-events-none"
                style={{ 
                  backgroundColor: hexColor,
                  color: isLight ? '#1a1a1a' : '#ffffff',
                  boxShadow: `0 8px 25px ${hexColor}88, 0 2px 8px rgba(0,0,0,0.1)`,
                }}
              >
                {colorName || (app.lang === "ar" ? "لون" : "Color")}
                <div 
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
                  style={{ 
                    backgroundColor: hexColor,
                  }}
                />
              </div>
              
              {!imageUrl && !hexColor && (
                <span className="text-[8px] font-bold text-white">?</span>
              )}
            </div>
          );
        })}
        {colors.length > maxDisplay && (
          <span className="text-[9px] text-muted-foreground">
            +{colors.length - maxDisplay}
          </span>
        )}
      </div>
    );
  }, [item.product_colors, item.colors, app.lang]);

  const isOfferCard = isDiscountOffer || isPromoOffer;
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
  ), [showStoreConflictDialog, currentStoreName, newStoreName, isProcessing, app.lang]);

  // ✅ GRID VARIANT - بوردر فوشي غامق مطابق تماماً لـ StoreCard
  if (variant === "grid") {
    return (
      <>
        <div 
          onClick={() => navigate({ to: productLink, params: { id: item.id } })}
          className={cn(
            "group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-[0_0_35px_rgba(216,27,96,0.2)] hover:shadow-[0_0_55px_rgba(194,24,91,0.35)] transition-all duration-400 hover:-translate-y-1.5 flex flex-col min-h-[440px] cursor-pointer border-3 border-[#d81b60]/60 hover:border-[#c2185b]",
            isOfferCard && "border-3 border-[#d81b60]/60 hover:border-[#c2185b]"
          )}
        >
          <div className="flex flex-col h-full">
            <div className="relative h-[210px] w-full overflow-hidden bg-gradient-to-br from-[#2a655f]/5 to-[#3a8a82]/10 shrink-0">
              {renderImage()}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {isDiscountOffer && discountPercent > 0 && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] blur-lg rounded-full opacity-60" />
                    <div className="relative bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 border-2 border-white/50 font-black text-[10px] sm:text-xs">
                      <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin-slow" />
                      <span className="tracking-wide">{discountPercent}%</span>
                      <span className="text-[7px] sm:text-[8px] font-bold bg-white/25 px-1.5 py-0.5 rounded-full">OFF</span>
                    </div>
                  </div>
                </div>
              )}
              
              {isPromoOffer && promoDiscountPercent > 0 && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#f9a8d4] to-[#fbcfe8] blur-lg rounded-full opacity-60" />
                    <div className="relative bg-gradient-to-r from-[#f9a8d4] to-[#fbcfe8] text-[#2a655f] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 border-2 border-[#2a655f]/20 font-black text-[10px] sm:text-xs">
                      <Gift className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin-slow" />
                      <span className="tracking-wide">{promoDiscountPercent}%</span>
                      <span className="text-[7px] sm:text-[8px] font-bold bg-[#2a655f]/10 px-1.5 py-0.5 rounded-full">FREE</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-xs font-semibold text-white z-10">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span>{Number(item.rating || 0).toFixed(1)}</span>
              </div>
              
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorite(e);
                }}
                className="absolute top-12 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-rose-500 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
              >
                <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
              </button>

              {(storeCover || storeName) && storeId && (
                <Link 
                  to="/store/$id" 
                  params={{ id: storeId }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-gradient-to-r from-black/80 via-black/70 to-[#1b433e]/80 backdrop-blur-md p-1.5 pe-3.5 rounded-full border border-white/20 shadow-xl max-w-[210px] group-hover:border-[#3a8a82] transition-colors hover:bg-black/90"
                >
                  <div className="h-7 w-7 rounded-full border border-white/40 shadow-inner overflow-hidden bg-white flex-shrink-0 grid place-items-center">
                    {storeCover ? (
                      <OptimizedImage
                        src={storeCover}
                        alt={storeName || "Store"}
                        width={56}
                        height={56}
                        quality={80}
                        objectFit="cover"
                        className="h-full w-full"
                      />
                    ) : (
                      <Store className="h-3.5 w-3.5 text-[#2a655f]" />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-white tracking-wide line-clamp-1">
                    {storeName || (app.lang === "ar" ? "متجر" : "Store")}
                  </span>
                </Link>
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
                
                {renderPromoDetails()}
              </div>
              
              {renderVariations(3)}
              {renderColors()}
              
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  {renderPrice()}
                </div>
                
                {hasVariations ? (
                  <Button
                    size="icon"
                    className="h-10 w-10 rounded-xl bg-[#f9a8d4] hover:bg-[#fbcfe8] text-[#2a655f] shadow-md shadow-[#f9a8d4]/25 transition-all duration-300 hover:scale-105 shrink-0"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate({ to: productLink, params: { id: item.id } });
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddToCart(e);
                    }}
                    className="h-10 w-10 rounded-xl bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 shrink-0"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {storeConflictModal}
      </>
    );
  }

  // ✅ LIST VARIANT - بوردر فوشي غامق مطابق تماماً لـ StoreCard
  return (
    <>
      <div 
        onClick={() => navigate({ to: productLink, params: { id: item.id } })}
        className={cn(
          "group relative rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-[0_0_35px_rgba(216,27,96,0.2)] hover:shadow-[0_0_55px_rgba(194,24,91,0.35)] transition-all duration-400 hover:-translate-y-1.5 flex flex-col min-h-[440px] cursor-pointer border-3 border-[#d81b60]/60 hover:border-[#c2185b]",
          isOfferCard && "border-3 border-[#d81b60]/60 hover:border-[#c2185b]"
        )}
      >
        <div className="flex flex-col sm:flex-row h-full">
          <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden bg-gradient-to-br from-[#2a655f]/5 to-[#3a8a82]/15">
            {renderImage()}
            
            {isDiscountOffer && discountPercent > 0 && (
              <div className="absolute top-3 right-3 z-20">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] blur-lg rounded-full opacity-60" />
                  <div className="relative bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 border-2 border-white/50 font-black text-[10px] sm:text-xs">
                    <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin-slow" />
                    <span className="tracking-wide">{discountPercent}%</span>
                    <span className="text-[7px] sm:text-[8px] font-bold bg-white/25 px-1.5 py-0.5 rounded-full">OFF</span>
                  </div>
                </div>
              </div>
            )}
            
            {isPromoOffer && promoDiscountPercent > 0 && (
              <div className="absolute top-3 right-3 z-20">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#f9a8d4] to-[#fbcfe8] blur-lg rounded-full opacity-60" />
                  <div className="relative bg-gradient-to-r from-[#f9a8d4] to-[#fbcfe8] text-[#2a655f] px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 border-2 border-[#2a655f]/20 font-black text-[10px] sm:text-xs">
                    <Gift className="h-3 w-3 sm:h-3.5 sm:w-3.5 animate-spin-slow" />
                    <span className="tracking-wide">{promoDiscountPercent}%</span>
                    <span className="text-[7px] sm:text-[8px] font-bold bg-[#2a655f]/10 px-1.5 py-0.5 rounded-full">FREE</span>
                  </div>
                </div>
              </div>
            )}
            
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleFavorite(e);
              }}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-rose-500 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
            >
              <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
            </button>
            
            {(storeCover || storeName) && storeId && (
              <Link 
                to="/store/$id" 
                params={{ id: storeId }}
                onClick={(e) => e.stopPropagation()}
                className="absolute bottom-3 left-3 z-20 flex items-center gap-2 bg-gradient-to-r from-black/80 via-black/70 to-[#1b433e]/80 backdrop-blur-md p-1.5 pe-3.5 rounded-full border border-white/20 shadow-xl max-w-[210px] group-hover:border-[#3a8a82] transition-colors hover:bg-black/90"
              >
                <div className="h-7 w-7 rounded-full border border-white/40 shadow-inner overflow-hidden bg-white flex-shrink-0 grid place-items-center">
                  {storeCover ? (
                    <OptimizedImage
                      src={storeCover}
                      alt={storeName || "Store"}
                      width={56}
                      height={56}
                      quality={80}
                      objectFit="cover"
                      className="h-full w-full"
                    />
                  ) : (
                    <Store className="h-3.5 w-3.5 text-[#2a655f]" />
                  )}
                </div>
                <span className="text-[11px] font-bold text-white tracking-wide line-clamp-1">
                  {storeName || (app.lang === "ar" ? "متجر" : "Store")}
                </span>
              </Link>
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
              
              {renderPromoDetails()}
            </div>
            
            {renderVariations(4)}
            {renderColors()}
            
            <div className="mt-2 flex flex-wrap items-end justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                {renderPrice()}
              </div>
              
              {hasVariations ? (
                <Button
                  className="h-10 px-5 rounded-xl bg-[#f9a8d4] hover:bg-[#fbcfe8] text-[#2a655f] font-semibold text-xs flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#f9a8d4]/25 hover:scale-105"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate({ to: productLink, params: { id: item.id } });
                  }}
                >
                  <Eye className="h-4 w-4" />
                  {app.lang === "ar" ? "اختيار" : "Choose"}
                </Button>
              ) : (
                <Button                  
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddToCart(e);
                  }}
                  className="h-10 px-5 rounded-xl bg-[#2a655f] hover:bg-[#3a8a82] text-white font-semibold text-xs flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#2a655f]/30 hover:scale-105"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {t("add_to_cart") || "إضافة للسلة"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {storeConflictModal}
    </>
  );
});

// ✅ ✅ ✅ CSS أنماط البوردر الفوشي الغامق المطابق لـ StoreCard
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