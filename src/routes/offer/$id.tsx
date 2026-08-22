// src/routes/offer/$id.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { useProductOfferByIdV2 } from "@/lib/hooks/useProductOffers";
import { useAddToCart, useClearCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Gift, Sparkles, Package, Store, ArrowRight, 
  ChevronLeft, Star, MapPin, 
  Gift as GiftIcon, Tag, ShoppingCart, CheckCircle,
  Truck, Shield, Clock, Award, Minus, Plus, AlertTriangle,
  Layers, Palette, Ruler, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useListings } from "@/lib/queries";

export const Route = createFileRoute("/offer/$id")({
  component: OfferDetailPage,
  head: () => ({ meta: [{ title: "تفاصيل العرض الترويجي — السوق لعندك" }] }),
});

function OfferDetailPage() {
  const { id } = Route.useParams();
  const app = useApp();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();
  const clearCartMutation = useClearCart();

  // ========== ✅ أولاً: كل الـ useState ==========
  const [selectedVariations, setSelectedVariations] = useState<Record<string, string>>({});
  const [selectedGiftVariation, setSelectedGiftVariation] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showStoreConflict, setShowStoreConflict] = useState(false);
  const [currentStoreName, setCurrentStoreName] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [pendingAddData, setPendingAddData] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");

  // ========== ✅ ثانياً: Queries (useQuery) ==========
  const { data: rawOffer, isLoading, isError } = useProductOfferByIdV2(id);
  
  // ✅✅✅ معالجة البيانات من RPC (products كمصفوفة)
  const offer = useMemo(() => {
    if (!rawOffer) return null;
    
    return {
      ...rawOffer,
      products: Array.isArray(rawOffer.products) 
        ? rawOffer.products[0] 
        : rawOffer.products,
      free_product: Array.isArray(rawOffer.free_product) 
        ? rawOffer.free_product[0] 
        : rawOffer.free_product,
    };
  }, [rawOffer]);
  
  const { data: listingsData } = useListings({ limit: 1000 });
  const listings = listingsData?.data || [];

  // ========== ✅ ثالثاً: الـ useCallback (قبل useMemo) ==========
  const getPromoTypeLabel = useCallback((type: string) => {
    const types: Record<string, { label: string; icon: any; color: string }> = {
      bogo: { 
        label: app.lang === "ar" ? "نفس المنتج" : "Same Product", 
        icon: Gift,
        color: "text-purple-500"
      },
      cross_sell: { 
        label: app.lang === "ar" ? "منتج مختلف" : "Different Product", 
        icon: Tag,
        color: "text-blue-500"
      },
      bundle: { 
        label: app.lang === "ar" ? "باقة منتجات" : "Bundle", 
        icon: Package,
        color: "text-orange-500"
      },
    };
    return types[type] || types.bogo;
  }, [app.lang]);

  // ========== ✅ رابعاً: كل الـ useMemo متجمعين مع بعض ==========
  
  // ✅ حساب نسبة الخصم
  const discountPercent = useMemo(() => {
    return offer?.buy_quantity && offer?.get_quantity
      ? Math.round((offer.get_quantity / (offer.buy_quantity + offer.get_quantity)) * 100)
      : 0;
  }, [offer]);

  const mainProduct = offer?.products;
  const freeProduct = offer?.free_product;
  const promoType = offer?.offer_type ? getPromoTypeLabel(offer.offer_type) : null;

  // ✅ المنتجات المطلوبة (لـ Bundle)
  const requiredProducts = useMemo(() => {
    if (!offer?.required_product_ids || offer.required_product_ids.length === 0) {
      return [];
    }
    
    return offer.required_product_ids.map((productId: string) => {
      const product = listings.find((l: any) => l.id === productId);
      if (!product) return null;
      
      const selectedVariationIds = offer.required_variations?.find(
        (rv: any) => rv.product_id === productId
      )?.variation_ids || [];
      
      const allVariations = product.variations || [];
      
      if (selectedVariationIds.length === 0) {
        return {
          product,
          variations: allVariations
        };
      }
      
      return {
        product,
        variations: allVariations.filter((v: any) => selectedVariationIds.includes(v.id))
      };
    }).filter(Boolean);
  }, [offer, listings]);

  // ✅ فيرنتات المنتج الرئيسي
  const mainVariations = useMemo(() => {
    const selectedIds = offer?.variation_ids || [];
    const allVariations = mainProduct?.variations || [];
    
    if (selectedIds.length === 0) {
      return allVariations;
    }
    
    return allVariations.filter((v: any) => selectedIds.includes(v.id));
  }, [mainProduct, offer?.variation_ids]);

  // ✅ فيرنتات الهدية
  const giftVariations = useMemo(() => {
    const selectedIds = offer?.result_variation_ids || [];
    const allVariations = freeProduct?.variations || [];
    
    if (selectedIds.length === 0) {
      return allVariations;
    }
    
    return allVariations.filter((v: any) => selectedIds.includes(v.id));
  }, [freeProduct, offer?.result_variation_ids]);

  // ✅ حساب السعر النهائي
  const finalPrice = useMemo(() => {
    if (!offer) return 0;
    
    if (offer.offer_type === 'bogo' || offer.offer_type === 'cross_sell') {
      if (!mainProduct) return 0;
      
      if (selectedVariations[offer.listing_id]) {
        const variation = mainVariations.find((v: any) => v.id === selectedVariations[offer.listing_id]);
        return (variation?.price || mainProduct.price) * quantity;
      }
      
      return mainProduct.price * quantity;
    }
    
    if (offer.offer_type === 'bundle') {
      let total = 0;
      
      requiredProducts.forEach((item: any) => {
        const product = item.product;
        const selectedVarId = selectedVariations[product.id];
        
        if (selectedVarId) {
          const variation = product.variations?.find((v: any) => v.id === selectedVarId);
          total += (variation?.price || product.price) * quantity;
        } else {
          total += product.price * quantity;
        }
      });
      
      return total;
    }
    
    return 0;
  }, [offer, mainProduct, mainVariations, selectedVariations, quantity, requiredProducts]);

  // ✅ التحقق من اختيار الفيرنتات
  const isVariationSelected = useMemo(() => {
    if (!offer) return false;
    
    if (offer.offer_type === 'bogo' || offer.offer_type === 'cross_sell') {
      if (mainVariations.length > 0 && !selectedVariations[offer.listing_id]) return false;
      return true;
    }
    
    if (offer.offer_type === 'bundle') {
      for (const item of requiredProducts) {
        const product = item.product;
        if (item.variations.length > 0 && !selectedVariations[product.id]) {
          return false;
        }
      }
      return true;
    }
    
    return true;
  }, [offer, mainVariations, selectedVariations, requiredProducts]);

  // ✅ ✅ ✅ اختيار أول فيرنت هدية تلقائياً
  useEffect(() => {
    if (offer && giftVariations.length > 0 && !selectedGiftVariation) {
      setSelectedGiftVariation(giftVariations[0].id);
      console.log("🎁 [OfferDetailPage] Auto-selected gift variation:", giftVariations[0].id);
    }
  }, [offer, giftVariations, selectedGiftVariation]);

  // ✅ تعيين الصورة الأولية عند تحميل العرض
  useEffect(() => {
    if (mainProduct?.cover_url) {
      setMainImage(mainProduct.cover_url);
    }
  }, [mainProduct]);

  // ✅ هل هو عرض Bundle؟
  const isBundle = useMemo(() => {
    return offer?.offer_type === 'bundle';
  }, [offer]);

  // ✅ ✅ ✅ استخراج بيانات المتجر للعرض
  const storeId = useMemo(() => {
    return offer?.store_id || mainProduct?.owner_id || null;
  }, [offer, mainProduct]);

  // ✅ ✅ ✅ اسم المتجر
  const offerStoreName = useMemo(() => {
    if (offer?.store?.store_name) return offer.store.store_name;
    if (offer?.store?.full_name) return offer.store.full_name;
    
    if (mainProduct?.profiles?.store_name) return mainProduct.profiles.store_name;
    if (mainProduct?.profiles?.full_name) return mainProduct.profiles.full_name;
    if (mainProduct?.profile?.store_name) return mainProduct.profile.store_name;
    if (mainProduct?.profile?.full_name) return mainProduct.profile.full_name;
    if (mainProduct?.owner?.store_name) return mainProduct.owner.store_name;
    if (mainProduct?.owner?.full_name) return mainProduct.owner.full_name;
    
    return app.lang === "ar" ? "متجر" : "Store";
  }, [offer, mainProduct, app.lang]);

  // ✅ ✅ ✅ شعار المتجر
  const offerStoreLogo = useMemo(() => {
    if (offer?.store?.store_logo_url) return offer.store.store_logo_url;
    if (offer?.store?.avatar_url) return offer.store.avatar_url;
    
    if (mainProduct?.profiles?.store_logo_url) return mainProduct.profiles.store_logo_url;
    if (mainProduct?.profiles?.avatar_url) return mainProduct.profiles.avatar_url;
    if (mainProduct?.profile?.store_logo_url) return mainProduct.profile.store_logo_url;
    if (mainProduct?.profile?.avatar_url) return mainProduct.profile.avatar_url;
    if (mainProduct?.owner?.store_logo_url) return mainProduct.owner.store_logo_url;
    if (mainProduct?.owner?.avatar_url) return mainProduct.owner.avatar_url;
    
    return null;
  }, [offer, mainProduct]);

  // ========== ✅ خامساً: الـ useCallback (دوال) ==========
  
  // ✅✅✅ دالة اختيار الفيرنت مع تغيير الصورة
 const handleVariationSelect = useCallback((productId: string, variationId: string) => {
  setSelectedVariations(prev => {
    const current = prev[productId];
    if (current === variationId) {
      const newState = { ...prev };
      delete newState[productId];
      return newState;
    }
    return { ...prev, [productId]: variationId };
  });

  // ✅✅✅ تغيير الصورة الرئيسية عند اختيار الفيرنت
  const variation = mainVariations.find((v: any) => v.id === variationId);
  if (variation) {
    console.log("🔍 [Offer] Variation selected:", variation);
    console.log("🔍 [Offer] Combination:", variation.combination);
    
    // ✅ 1. البحث عن قيمة اللون في الفيرنت
    const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
    let colorValue = null;
    
    for (const key of colorKeys) {
      if (variation.combination?.[key]) {
        colorValue = variation.combination[key];
        break;
      }
    }
    
    console.log("🎨 [Offer] Color value from variation:", colorValue);
    
    // ✅ 2. إذا وجد لون، ابحث عن صورته في product_colors
    if (colorValue) {
      const productColors = mainProduct?.colors || [];
      console.log("🎨 [Offer] Available colors:", productColors.map((c: any) => c.color_name_ar));
      
      // ✅✅✅ مقارنة محسّنة (تجاهل المسافات وحالة الأحرف)
      const searchValue = String(colorValue).trim().toLowerCase();
      
      const color = productColors.find((c: any) => {
        const nameAr = (c.color_name_ar || "").trim().toLowerCase();
        const nameEn = (c.color_name_en || "").trim().toLowerCase();
        
        // ✅ مقارنة دقيقة مع تجاهل المسافات
        return nameAr === searchValue || nameEn === searchValue;
      });
      
      console.log("🎨 [Offer] Found color:", color);
      
      if (color?.image_url) {
        setMainImage(color.image_url);
        console.log("✅ [Offer] Changed main image to color image:", color.image_url);
      } else {
        console.log("⚠️ [Offer] No color found for value:", colorValue);
        console.log("⚠️ [Offer] Available colors:", productColors.map((c: any) => ({
          name_ar: c.color_name_ar,
          name_en: c.color_name_en,
          image_url: c.image_url
        })));
      }
    }
    
    // ✅ 3. إذا كان للفيرنت صورة خاصة، استخدمها
    if (variation.image_url) {
      setMainImage(variation.image_url);
      console.log("🖼️ [Offer] Changed main image to variation image:", variation.image_url);
    }
  }
}, [mainVariations, mainProduct]);

  // ============================================================
  // ✅✅✅ دالة إضافة العرض للسلة (المصححة)
  // ============================================================
 const handleAddToCart = useCallback(async () => {
  if (!app.user) {
    toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
    navigate({ to: "/auth/$mode", params: { mode: "login" } });
    return;
  }

  if (!offer) {
    toast.error(app.lang === "ar" ? "العرض غير موجود" : "Offer not found");
    return;
  }

  if (!isVariationSelected) {
    toast.warning(app.lang === "ar" ? "⚠️ الرجاء اختيار الفيرنتات أولاً" : "⚠️ Please select variations first");
    return;
  }

  // ✅ منع المستخدم من إضافة عروض متجره الخاص
  if (offer.store_id === app.user.id) {
    toast.error(
      app.lang === "ar" 
        ? "❌ لا يمكنك إضافة عروض من متجرك الخاص إلى السلة" 
        : "❌ You cannot add offers from your own store to cart"
    );
    return;
  }

  if (mainProduct?.owner_id === app.user.id) {
    toast.error(
      app.lang === "ar" 
        ? "❌ لا يمكنك إضافة عروض من متجرك الخاص إلى السلة" 
        : "❌ You cannot add offers from your own store to cart"
    );
    return;
  }

  if (mainProduct?.profile?.id === app.user.id || mainProduct?.profiles?.id === app.user.id) {
    toast.error(
      app.lang === "ar" 
        ? "❌ لا يمكنك إضافة عروض من متجرك الخاص إلى السلة" 
        : "❌ You cannot add offers from your own store to cart"
    );
    return;
  }

  // ✅✅✅ جلب الفيرنت المختار مع سعره وصورته
  const selectedVariationId = selectedVariations[offer.listing_id];
  let selectedVariation = null;
  let variationPrice = mainProduct?.price || 0;
  let variationImage = mainImage || mainProduct?.cover_url || null;

  if (selectedVariationId && mainVariations.length > 0) {
    selectedVariation = mainVariations.find((v: any) => v.id === selectedVariationId);
    if (selectedVariation) {
      // ✅✅✅ السعر من الفيرنت (وليس من المنتج الأساسي)
      variationPrice = selectedVariation.price || selectedVariation.old_price || mainProduct?.price || 0;
      console.log("💰 [Offer] Variation price:", variationPrice);
      
      // ✅✅✅ صورة الفيرنت
      if (selectedVariation.image_url) {
        variationImage = selectedVariation.image_url;
      } else {
        // حاول إيجاد صورة اللون
        const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
        let colorValue = null;
        for (const key of colorKeys) {
          if (selectedVariation.combination?.[key]) {
            colorValue = selectedVariation.combination[key];
            break;
          }
        }
        if (colorValue) {
          const productColors = mainProduct?.colors || [];
          const color = productColors.find((c: any) => 
            c.color_name_ar === colorValue || c.color_name_en === colorValue
          );
          if (color?.image_url) {
            variationImage = color.image_url;
          }
        }
      }
    }
  }

  // ✅✅✅ جلب فيرنت الهدية
  const giftVariationId = selectedGiftVariation;
  let giftVariation = null;
  let giftImage = freeProduct?.cover_url || null;

  if (giftVariationId && giftVariations.length > 0) {
    giftVariation = giftVariations.find((v: any) => v.id === giftVariationId);
    if (giftVariation) {
      giftImage = giftVariation.image_url || freeProduct?.cover_url || null;
    }
  }

  try {
    await addToCartMutation.mutateAsync({
      userId: app.user.id,
      listingId: offer.listing_id,
      quantity: quantity,
      selectedVariationId: selectedVariationId,
      // ✅✅✅ أضف هذين السطرين (مهم جداً)
      variationPrice: variationPrice,  // ✅ سعر الفيرنت
      variationCombination: selectedVariation?.combination || undefined,  // ✅ تركيبة الفيرنت
      extraData: {
        is_promo_offer: true,
        offer_id: offer.id,
        selected_gift_variation: selectedGiftVariation,
        selected_variations: selectedVariations,
        // ✅✅✅ بيانات الفيرنت المختار مع السعر الصحيح
        selected_variation_data: selectedVariation ? {
          id: selectedVariation.id,
          price: variationPrice,  // ✅ سعر الفيرنت
          image_url: variationImage,
          combination: selectedVariation.combination || {},
        } : null,
        // ✅✅✅ بيانات الهدية للسلة (بسعر 0 وكلمة مجاناً)
        gift_data: freeProduct ? {
          id: freeProduct.id,
          title_ar: freeProduct.title_ar,
          title_en: freeProduct.title_en,
          price: 0,  // ✅ مجاناً
          cover_url: giftImage,
          variation_id: giftVariationId,
          variation_data: giftVariation ? {
            id: giftVariation.id,
            combination: giftVariation.combination || {},
            image_url: giftImage,
          } : null,
          is_free: true,  // ✅ علم بأنها هدية
        } : null,
        offer_data: {
          offer_type: offer.offer_type,
          buy_quantity: offer.buy_quantity,
          get_quantity: offer.get_quantity,
          required_product_ids: offer.required_product_ids,
          free_listing_id: offer.free_listing_id,
          required_variations: offer.required_variations,
          result_variation_ids: offer.result_variation_ids,
        }
      },
      onStoreConflict: async (data: any) => {
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
        setPendingAddData({ 
          listingId: offer.listing_id, 
          quantity, 
          selectedVariations,
          selectedGiftVariation,
        });
        setShowStoreConflict(true);
      },
    });

    // ✅ Toast مع زر "عرض السلة" - تصميم زهر
toast.success(
  app.lang === "ar" 
    ? `🛒 تم إضافة العرض للسلة (${quantity} × ${mainProduct?.title_ar || offer.display_text_ar})`
    : `🛒 Added offer to cart (${quantity} × ${mainProduct?.title_ar || offer.display_text_ar})`,
  { 
    duration: 4000,
    icon: '🛒',
    style: {
      background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',  // ✅ زهر خفيف
      color: '#831843',  // ✅ زهر غامق للنص
      borderRadius: '16px',
      border: '1px solid #f9a8d4',
      boxShadow: '0 20px 60px rgba(236, 72, 153, 0.25)',
    },
    className: 'font-bold',
    action: {
      label: app.lang === "ar" ? "🛒 عرض السلة 🛒" : "🛒 View Cart 🛒",
      onClick: () => {
        navigate({ to: "/cart" });
        toast.dismiss();
      }
    },
    actionButtonStyle: {
      background: 'linear-gradient(135deg, #f472b6, #ec4899, #db2777)',  // ✅ زهر
      color: 'white',
      fontWeight: 'bold',
      borderRadius: '12px',
      padding: '8px 24px',
      boxShadow: '0 8px 30px rgba(236, 72, 153, 0.4)',
      border: 'none',
      fontSize: '14px',
    }
  }
);

  } catch (error: any) {
    console.error("❌ Error adding offer to cart:", error);
    toast.error(
      app.lang === "ar" 
        ? `❌ فشل إضافة العرض للسلة: ${error.message || 'خطأ غير معروف'}`
        : `❌ Failed to add offer to cart: ${error.message || 'Unknown error'}`
    );
  }
}, [app.user, app.lang, offer, isVariationSelected, mainProduct, mainVariations, selectedVariations, selectedGiftVariation, giftVariations, freeProduct, quantity, addToCartMutation, navigate, mainImage]);
  const handleConfirmClearCart = useCallback(async () => {
    if (!app.user || !pendingAddData) return;
    
    try {
      await clearCartMutation.mutateAsync({ userId: app.user.id });
      
      await addToCartMutation.mutateAsync({
        userId: app.user.id,
        listingId: pendingAddData.listingId,
        quantity: pendingAddData.quantity,
        selectedVariationId: pendingAddData.selectedVariations?.[offer?.listing_id || ''] || undefined,
        extraData: {
          is_promo_offer: true,
          offer_id: offer?.id,
          selected_gift_variation: pendingAddData.selectedGiftVariation,
          selected_variations: pendingAddData.selectedVariations,
          offer_data: {
            offer_type: offer?.offer_type,
            buy_quantity: offer?.buy_quantity,
            get_quantity: offer?.get_quantity,
            required_product_ids: offer?.required_product_ids,
            free_listing_id: offer?.free_listing_id,
            required_variations: offer?.required_variations,
            result_variation_ids: offer?.result_variation_ids,
          }
        },
      });
      
      toast.success(
        app.lang === "ar" 
          ? `✅ تم تبديل المتجر وإضافة العرض للسلة`
          : `✅ Store switched and offer added to cart`
      );
      
      setShowStoreConflict(false);
      setPendingAddData(null);
      
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
    }
  }, [app.user, pendingAddData, addToCartMutation, clearCartMutation, app.lang, offer]);

  // ========== ✅ سادساً: الـ if statements ==========
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-14 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !offer || !offer.is_active) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold">
            {app.lang === "ar" ? "العرض غير موجود" : "Offer not found"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {app.lang === "ar" ? "قد يكون تم انتهاؤه أو إلغاؤه" : "It may have expired or been cancelled"}
          </p>
          <Button className="mt-6" onClick={() => navigate({ to: "/" })}>
            {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  // ========== ✅ سابعاً: الـ JSX ==========
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* ===== Breadcrumb ===== */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            {app.lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground font-medium line-clamp-1">
            {app.lang === "ar" ? offer.display_text_ar : offer.display_text_en}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* ===== LEFT - قسم الصور ===== */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 border-2 border-purple-200/50 dark:border-purple-800/30 shadow-xl">
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={offer.display_text_ar || "Promo offer"}
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
              ) : mainProduct?.cover_url ? (
                <img
                  src={mainProduct.cover_url}
                  alt={offer.display_text_ar || "Promo offer"}
                  className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <GiftIcon className="h-20 w-20 text-purple-300" />
                </div>
              )}
              
              {/* ✅ عرض ألوان المنتج أسفل الصورة (مثل صفحة المنتج) */}
              {mainProduct?.colors && mainProduct.colors.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
                  {mainProduct.colors.map((color: any) => {
                    // البحث عن فيرنت لهذا اللون
                    const matchingVariation = mainVariations.find((v: any) => {
                      const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
                      for (const key of colorKeys) {
                        if (v.combination?.[key] === color.color_name_ar) return true;
                      }
                      return false;
                    });
                    
                    return (
                      <button
                        key={color.id}
                        onClick={() => {
                          if (matchingVariation) {
                            handleVariationSelect(offer.listing_id, matchingVariation.id);
                          }
                        }}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all",
                          mainImage === color.image_url 
                            ? "border-white ring-2 ring-purple-500 scale-110" 
                            : "border-white/50 hover:scale-110"
                        )}
                        style={{ backgroundColor: color.color_hex || '#ccc' }}
                        title={color.color_name_ar}
                      />
                    );
                  })}
                </div>
              )}
              
              <div className="absolute top-4 start-4 flex flex-col gap-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 inline mr-1" />
                  {app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"}
                </Badge>
                {discountPercent > 0 && (
                  <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold animate-pulse">
                    🎁 {discountPercent}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ===== RIGHT - معلومات العرض ===== */}
          <div className="space-y-6">
            
            <div className="flex items-center gap-3 flex-wrap">
              {promoType && (
                <Badge className={cn(
                  "border-0 text-sm font-bold px-4 py-2 rounded-full",
                  promoType.color
                )}>
                  {promoType.icon && <promoType.icon className="h-4 w-4 inline mr-1.5" />}
                  {promoType.label}
                </Badge>
              )}
              {offer.is_featured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-full px-3 py-1.5 text-sm">
                  ⭐ {app.lang === "ar" ? "مميز" : "Featured"}
                </Badge>
              )}
              {!offer.expires_at && (
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 rounded-full px-3 py-1.5">
                  🔓 {app.lang === "ar" ? "دائم" : "Permanent"}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {app.lang === "ar" ? offer.display_text_ar : offer.display_text_en}
            </h1>

            {/* ===== ✅ المتجر ===== */}
            {storeId && (
              <Link 
                to="/store/$id" 
                params={{ id: storeId }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 transition-all border border-purple-300/30 dark:border-purple-800/30 group"
              >
                <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 bg-gradient-to-br from-purple-600 to-indigo-600">
                  {offerStoreLogo ? (
                    <img 
                      src={offerStoreLogo} 
                      alt={offerStoreName}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-store.png';
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white font-bold text-2xl">
                      {offerStoreName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-lg group-hover:text-purple-600 transition">{offerStoreName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    {app.lang === "ar" ? "متجر موثوق" : "Trusted Store"}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group-hover:bg-purple-500/10 group-hover:scale-105 transition">
                  {app.lang === "ar" ? "زيارة المتجر" : "Visit Store"} <ArrowRight className="h-4 w-4 ms-1" />
                </Button>
              </Link>
            )}

            {/* ✅ تفاصيل العرض */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "الكمية المطلوبة" : "Required Quantity"}
                  </p>
                  <p className="text-2xl font-bold text-[#0d2e2a]">
                    {offer.buy_quantity || 2}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "الكمية المجانية" : "Free Quantity"}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {offer.get_quantity || 1}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {app.lang === "ar" ? "🎯 اشتري" : "🎯 Buy"} 
                  <span className="font-bold text-[#0d2e2a] mx-1">{offer.buy_quantity || 2}</span>
                  {app.lang === "ar" ? "واحصل على" : "and get"} 
                  <span className="font-bold text-emerald-600 mx-1">{offer.get_quantity || 1}</span>
                  {app.lang === "ar" ? "مجاناً 🎁" : "free 🎁"}
                </span>
              </div>
            </div>

          {/* ===== السعر ===== */}
<div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
  <div className="flex flex-col gap-3">
    <div className="flex items-center gap-4 flex-wrap">
      <span className="text-4xl md:text-5xl font-black text-primary">
        {finalPrice.toLocaleString(app.lang === "ar" ? "ar-SY" : "en-US")}
      </span>
      {discountPercent > 0 && (
        <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 text-white border-0 text-sm font-bold px-3 py-1.5 rounded-full shadow-md shadow-rose-500/20 animate-pulse">
          🎁 {discountPercent}% OFF
        </Badge>
      )}
    </div>
  </div>
</div>

            {/* ===== ✅ المنتجات المطلوبة ===== */}
            {isBundle ? (
              // ✅ BUNDLE: عدة منتجات
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#0d2e2a]" />
                    {app.lang === "ar" ? "المنتجات المطلوبة" : "Required Products"}
                    <span className="text-xs text-red-500">*</span>
                  </h3>
                  <span className={cn(
                    "text-xs font-medium transition-all duration-300",
                    requiredProducts.every((item: any) => 
                      item.variations.length === 0 || selectedVariations[item.product.id]
                    ) ? "text-emerald-600" : "text-amber-500"
                  )}>
                    {requiredProducts.every((item: any) => 
                      item.variations.length === 0 || selectedVariations[item.product.id]
                    ) 
                      ? `✅ ${app.lang === "ar" ? "تم الاختيار" : "Selected"}` 
                      : (app.lang === "ar" ? "⚠️ مطلوب" : "⚠️ Required")}
                  </span>
                </div>
                
                {requiredProducts.map((item: any, index: number) => {
                  const product = item.product;
                  const variations = item.variations;
                  const isSelected = !!selectedVariations[product.id];

                  return (
                    <div key={product.id} className="p-4 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 mb-3">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">
                          {index + 1}. {product.title_ar}
                        </p>
                        <Badge className={cn(
                          "border-0 text-[10px]",
                          isSelected || variations.length === 0
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        )}>
                          {isSelected || variations.length === 0
                            ? `✅ ${app.lang === "ar" ? "مختار" : "Selected"}` 
                            : `⚠️ ${app.lang === "ar" ? "مطلوب" : "Required"}`}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-1">
                        {formatPrice(Number(product.price), app.currency, app.lang)}
                      </p>

                      {/* ✅ فيرنتات هذا المنتج */}
                      {variations.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-muted-foreground mb-1.5">
                            🎨 {app.lang === "ar" ? "اختر الفيرنت (المتاح في العرض)" : "Select variation (available in offer)"}
                            <span className="text-red-500 ml-1">*</span>
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {variations.map((v: any) => {
                              const combo = v.combination || {};
                              const comboText = Object.entries(combo)
                                .map(([key, value]) => `${value}`)
                                .join(' • ');
                              const isSelectedVar = selectedVariations[product.id] === v.id;
                              const price = v.price || product.price;

                              return (
                                <button
                                  key={v.id}
                                  onClick={() => handleVariationSelect(product.id, v.id)}
                                  className={cn(
                                    "px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all",
                                    isSelectedVar
                                      ? "border-[#0d2e2a] bg-[#0d2e2a]/5 text-[#0d2e2a] shadow-sm"
                                      : "border-slate-200/50 hover:border-[#4a9f95] hover:bg-[#0d2e2a]/5"
                                  )}
                                >
                                  {comboText}
                                  <span className="text-[10px] text-muted-foreground ml-1">
                                    ({formatPrice(Number(price), app.currency, app.lang)})
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              // ✅ BOGO أو Cross-sell: منتج واحد
              <>
                {mainProduct && (
                  <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-sm flex items-center gap-2">
                        <Package className="h-4 w-4 text-[#0d2e2a]" />
                        {app.lang === "ar" ? "المنتج المطلوب" : "Required Product"}
                        {mainVariations.length > 0 && (
                          <span className="text-xs text-red-500">*</span>
                        )}
                      </h3>
                      <span className={cn(
                        "text-xs font-medium transition-all duration-300",
                        selectedVariations[offer.listing_id] || mainVariations.length === 0
                          ? "text-emerald-600" : "text-amber-500"
                      )}>
                        {selectedVariations[offer.listing_id] || mainVariations.length === 0
                          ? `✅ ${app.lang === "ar" ? "مختار" : "Selected"}` 
                          : (app.lang === "ar" ? "⚠️ مطلوب" : "⚠️ Required")}
                      </span>
                    </div>
                    
                    <div className="p-4 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                      <p className="font-medium">{mainProduct.title_ar}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(Number(mainProduct.price), app.currency, app.lang)}
                      </p>
                    </div>

                    {mainVariations.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5" />
                          {app.lang === "ar" ? "اختر الفيرنت (المتاح في العرض)" : "Select variation (available in offer)"}
                          <span className="text-red-500 ml-1">*</span>
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {mainVariations.map((v: any) => {
                            const combo = v.combination || {};
                            const comboText = Object.entries(combo)
                              .map(([key, value]) => `${value}`)
                              .join(' • ');
                            const isSelected = selectedVariations[offer.listing_id] === v.id;
                            const price = v.price || mainProduct.price;

                            return (
                              <button
                                key={v.id}
                                onClick={() => handleVariationSelect(offer.listing_id, v.id)}
                                className={cn(
                                  "px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all",
                                  isSelected
                                    ? "border-[#0d2e2a] bg-[#0d2e2a]/5 text-[#0d2e2a] shadow-sm"
                                    : "border-slate-200/50 hover:border-[#4a9f95] hover:bg-[#0d2e2a]/5"
                                )}
                              >
                                {comboText}
                                <span className="text-[10px] text-muted-foreground ml-1">
                                  ({formatPrice(Number(price), app.currency, app.lang)})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ===== ✅ الهدية ===== */}
            {freeProduct && (
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-600">
                    <GiftIcon className="h-4 w-4" />
                    {app.lang === "ar" ? "🎁 الهدية" : "🎁 Gift"}
                  </h3>
                  <span className="text-xs font-medium text-emerald-600">
                    ✅ {app.lang === "ar" ? "محددة مسبقاً" : "Pre-selected"}
                  </span>
                </div>
                
                <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                  <div className="flex items-center gap-3">
                    {freeProduct.cover_url ? (
                      <img 
                        src={freeProduct.cover_url} 
                        alt={freeProduct.title_ar}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                        <GiftIcon className="h-6 w-6 text-emerald-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-bold text-emerald-700 dark:text-emerald-300">
                        {freeProduct.title_ar}
                      </p>
                      <Badge className="bg-emerald-500/90 text-white border-0 text-[10px]">
                        ✅ {app.lang === "ar" ? "مجاناً" : "FREE"}
                      </Badge>
                      {giftVariations.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          🎨 {app.lang === "ar" ? "الفيرنت المحدد:" : "Selected variation:"}{" "}
                          {giftVariations.map((v: any) => {
                            const combo = v.combination || {};
                            return Object.entries(combo)
                              .map(([key, value]) => `${value}`)
                              .join(' • ');
                          }).join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ✅ تنبيه اختيار الفيرنتات */}
            {!isVariationSelected && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {app.lang === "ar" ? "⚠️ مطلوب اختيار الخيارات" : "⚠️ Options required"}
                  </p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/70">
                    {app.lang === "ar" 
                      ? "يرجى اختيار الفيرنتات المتاحة في العرض قبل إضافة للسلة"
                      : "Please select the variations available in the offer before adding to cart"}
                  </p>
                </div>
              </div>
            )}

            {/* ✅ تم اختيار كل الفيرنتات */}
            {isVariationSelected && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    ✅ {app.lang === "ar" ? "تم اختيار الخيارات" : "Options selected"}
                  </p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70">
                    {Object.keys(selectedVariations).length > 0 && `📦 ${Object.keys(selectedVariations).length} منتج`}
                    {selectedGiftVariation && ` 🎁 ${freeProduct?.title_ar}`}
                  </p>
                </div>
              </div>
            )}

            {/* ✅ الكمية */}
            <div className="flex items-center gap-4">
              <span className="font-semibold">{app.lang === "ar" ? "الكمية:" : "Quantity:"}</span>
              <div className="flex items-center border-2 rounded-2xl overflow-hidden shadow-sm border-[#0d2e2a]/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 flex items-center justify-center hover:bg-[#0d2e2a]/5 transition text-lg font-bold text-[#0d2e2a]"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="w-16 text-center font-bold text-lg text-[#0d2e2a]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12 flex items-center justify-center hover:bg-[#0d2e2a]/5 transition text-lg font-bold text-[#0d2e2a]"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* ✅ زر إضافة للسلة */}
            <Button 
              size="lg" 
              className={cn(
                "w-full h-14 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-lg font-bold",
                "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700",
                !isVariationSelected && "opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-xl"
              )}
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || !isVariationSelected}
            >
              {addToCartMutation.isPending ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {app.lang === "ar" ? "جاري الإضافة..." : "Adding..."}
                </div>
              ) : !isVariationSelected ? (
                <>
                  <AlertTriangle className="h-5 w-5 me-3" />
                  {app.lang === "ar" ? "⚠️ اختر الخيارات أولاً" : "⚠️ Select options first"}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 me-3" />
                  {app.lang === "ar" ? "أضف العرض للسلة" : "Add Offer to Cart"}
                  <Badge className="bg-white/20 text-white border-0 ms-3">
                    {quantity}
                  </Badge>
                </>
              )}
            </Button>

            {/* ✅ مميزات */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
              {[
                { icon: Truck, label: app.lang === "ar" ? "توصيل سريع" : "Fast Delivery" },
                { icon: Shield, label: app.lang === "ar" ? "دفع آمن" : "Secure Payment" },
                { icon: Award, label: app.lang === "ar" ? "ضمان الجودة" : "Quality Guarantee" },
                { icon: Clock, label: app.lang === "ar" ? "دعم 24/7" : "24/7 Support" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition border border-border/30">
                  <item.icon className="h-5 w-5 text-[#0d2e2a]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== مودال تعارض المتجر ===== */}
      <Dialog open={showStoreConflict} onOpenChange={setShowStoreConflict}>
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
                  ? `🛒 العرض الجديد من "${newStoreName}"`
                  : `🛒 The new offer is from "${newStoreName}"`}
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {app.lang === "ar" 
                ? "لا يمكن إضافة منتجات من أكثر من متجر واحد في نفس السلة"
                : "You cannot add products from different stores in the same cart"}
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowStoreConflict(false)}>
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmClearCart}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "تفريغ السلة وإضافة العرض" : "Clear cart and add offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OfferDetailPage;