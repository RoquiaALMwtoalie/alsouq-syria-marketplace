// src/routes/listing/$id.tsx - مع "قد تعجبك أيضاً" + "الأكثر مبيعاً"

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Heart, Share2,
  ChevronRight, ChevronLeft,
  Minus, Plus, Tag, ShoppingBag, Store,
  Star, MapPin, Shield, Truck, Award, Clock,
  Sparkles, Layers, Check, AlertTriangle, CheckCircle,
  Gift, Percent, ArrowRight, Package, TrendingUp, Flame
} from "lucide-react";
import { useToggleFavorite } from "@/lib/queries";
import { useProductOffer } from "@/lib/hooks/useProductOffers";
import { useApp, formatPrice, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListing, useListingReviews, useSimilarListings, useTrendingListings } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { translateOptionType } from "@/lib/utils/constants";
import { ClientOnly } from "@/components/ClientOnly";
import { useCart, useAddToCart, useClearCart } from "@/lib/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import { OptimizedImage } from "@/components/OptimizedImage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/listing/$id")({
  beforeLoad: () => ({
    hideFooter: true,
  }),
  component: ListingDetailPage,
  head: () => ({ meta: [{ title: "تفاصيل المنتج — السوق لعندك" }] }),
});

const LoadingSkeleton = () => (
  <div className="mx-auto max-w-4xl px-4 py-8">
    <Skeleton className="aspect-square rounded-2xl w-full" />
    <div className="space-y-4 mt-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-12 w-1/4" />
    </div>
  </div>
);

function ListingDetailPage() {
  const { id } = Route.useParams();
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [showStoreConflict, setShowStoreConflict] = useState(false);
  const [currentStoreName, setCurrentStoreName] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [pendingAddData, setPendingAddData] = useState<any>(null);
  
  const { data: listing, isLoading, isError } = useListing(id);
  const { data: promoOffer } = useProductOffer(id);
  const { data: reviews = [] } = useListingReviews(id);
  const { data: similarListings = [] } = useSimilarListings(listing?.category_id, listing?.id, 4);
  
  // ✅ الأكثر مبيعاً - 8 منتجات
  const { data: trendingListings = [], isLoading: trendingLoading } = useTrendingListings(8);
  
  const { data: cart } = useCart(app.user?.id);
  const addToCartMutation = useAddToCart();
  const clearCartMutation = useClearCart();
  
  const toggleFavoriteMutation = useToggleFavorite();
  const isFavorite = listing ? app.favorites.includes(listing.id) : false;
  
  const images = useMemo(() => {
    const imgList = listing?.listing_images?.map((img: any) => img.url) || [];
    if (listing?.cover_url) imgList.unshift(listing.cover_url);
    return imgList;
  }, [listing]);

  const colors = useMemo(() => (listing as any)?.colors || [], [listing]);
  const sizes = useMemo(() => {
    const options = (listing as any)?.options || [];
    return options.filter((opt: any) => opt.option_type === 'size').map((opt: any) => opt.option_value);
  }, [listing]);
  
  const variations = useMemo(() => (listing as any)?.variations || [], [listing]);

  const avgRating = useMemo(() => (listing as any)?.avg_rating || listing?.rating || 0, [listing]);
  const reviewsCount = useMemo(() => (listing as any)?.reviews_count || reviews.length || 0, [listing, reviews]);

  const storeName = useMemo(() => 
    (listing as any)?.profile?.store_name ||    
    (listing as any)?.profiles?.store_name ||   
    (listing as any)?.owner?.store_name || 
    (listing as any)?.profile?.full_name || 
    (listing as any)?.profiles?.full_name || 
    (listing as any)?.owner?.full_name || 
    "متجر",
  [listing]);

  const storeLogo = useMemo(() => 
    (listing as any)?.profile?.store_logo_url || 
    (listing as any)?.profiles?.store_logo_url || 
    (listing as any)?.owner?.store_logo_url || 
    (listing as any)?.profile?.avatar_url || 
    (listing as any)?.profiles?.avatar_url || 
    (listing as any)?.owner?.avatar_url || 
    null,
  [listing]);

  // ============================================================
  // ✅ ترتيب "قد تعجبك" + 4 فقط + العروض أولاً
  // ============================================================
  const sortedSimilarListings = useMemo(() => {
    if (!similarListings || similarListings.length === 0) return [];
    
    return [...similarListings]
      .sort((a: any, b: any) => {
        const getPriority = (item: any) => {
          // ✅ 1. عرض ترويجي (BOGO / Bundle / Cross-sell)
          if (item.has_promo_offer === true || item.has_promo_offer === "true") return 0;
          // ✅ 2. عرض تخفيضي
          if (item.is_offer === true || (item.discount_percent && item.discount_percent > 0)) return 1;
          // ✅ 3. منتج عادي
          return 2;
        };
        return getPriority(a) - getPriority(b);
      })
      .slice(0, 4);  // ✅ 4 فقط
  }, [similarListings]);

  // ============================================================
  // ✅ تصفية الأكثر مبيعاً - استبعاد المنتج الحالي
  // ============================================================
  const bestSellingListings = useMemo(() => {
    if (!trendingListings || trendingListings.length === 0) return [];
    
    return trendingListings
      .filter((item: any) => item.id !== listing?.id)
      .slice(0, 8);
  }, [trendingListings.length, listing?.id]);

  // التحقق من وجود المنتج في السلة مع نفس التركيبة
  const isInCart = useMemo(() => {
    if (!cart?.items || !listing) return false;
    
    return cart.items.some((item: any) => {
      if (item.listing_id !== listing.id) return false;
      if (selectedColor && item.selected_color !== selectedColor) return false;
      if (selectedSize && item.selected_size !== selectedSize) return false;
      if (selectedVariation?.id && item.selected_variation_id !== selectedVariation.id) return false;
      return true;
    });
  }, [cart, listing, selectedColor, selectedSize, selectedVariation]);

  const cartItemCount = useMemo(() => {
    if (!cart?.items || !listing) return 0;
    
    const item = cart.items.find((item: any) => {
      if (item.listing_id !== listing.id) return false;
      if (selectedColor && item.selected_color !== selectedColor) return false;
      if (selectedSize && item.selected_size !== selectedSize) return false;
      if (selectedVariation?.id && item.selected_variation_id !== selectedVariation.id) return false;
      return true;
    });
    
    return item?.quantity || 0;
  }, [cart, listing, selectedColor, selectedSize, selectedVariation]);

  const promoDiscountPercent = useMemo(() => {
    if (promoOffer && promoOffer.buy_quantity && promoOffer.get_quantity) {
      return Math.round((promoOffer.get_quantity / (promoOffer.buy_quantity + promoOffer.get_quantity)) * 100);
    }
    return 0;
  }, [promoOffer]);

  const promoSavings = useMemo(() => {
    if (promoOffer && promoOffer.get_quantity && listing?.price) {
      return Number(listing.price) * promoOffer.get_quantity;
    }
    return 0;
  }, [promoOffer, listing]);

  const getPromoTypeLabel = useCallback((type: string) => {
    const types: Record<string, { label: string; icon: any; color: string }> = {
      bogo: { 
        label: app.lang === "ar" ? "اشتر 1 واحصل على 1" : "Buy 1 Get 1", 
        icon: Gift,
        color: "text-purple-500"
      },
      cross_sell: { 
        label: app.lang === "ar" ? "شراء منتج والحصول على آخر" : "Buy product get another", 
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

  const promoType = promoOffer?.offer_type ? getPromoTypeLabel(promoOffer.offer_type) : null;

  const sortedVariations = useMemo(() => {
    return [...variations].sort((a, b) => {
      const keysA = Object.keys(a.combination || {});
      const keysB = Object.keys(b.combination || {});
      for (const key of keysA) {
        if (keysB.includes(key)) {
          const valA = String(a.combination[key] || '');
          const valB = String(b.combination[key] || '');
          if (valA !== valB) return valA.localeCompare(valB);
        }
      }
      return (a.id || '').localeCompare(b.id || '');
    });
  }, [variations]);

  const filteredVariations = useMemo(() => {
    const isVariationAvailable = (variation: any) => variation.is_active !== false;
    
    if (!selectedColor && !selectedSize) {
      return sortedVariations.filter((v: any) => isVariationAvailable(v));
    }
    
    return sortedVariations.filter((v: any) => {
      if (!isVariationAvailable(v)) return false;
      
      if (selectedColor) {
        const hasColor = Object.values(v.combination || {}).some(
          (val: any) => String(val) === selectedColor
        );
        if (!hasColor) return false;
      }
      
      if (selectedSize) {
        const hasSize = Object.values(v.combination || {}).some(
          (val: any) => String(val) === selectedSize
        );
        if (!hasSize) return false;
      }
      
      return true;
    });
  }, [sortedVariations, selectedColor, selectedSize]);

  const isVariationSelected = useMemo(() => {
    if (colors.length === 0 && sizes.length === 0 && variations.length === 0) return true;
    if (colors.length > 0 && !selectedColor) return false;
    if (sizes.length > 0 && !selectedSize) return false;
    if (variations.length > 0 && !selectedVariation) {
      if (selectedColor && selectedSize) {
        const matching = variations.find((v: any) => 
          v.combination?.color === selectedColor && 
          v.combination?.size === selectedSize &&
          v.is_active !== false
        );
        return !!matching;
      }
      return false;
    }
    return true;
  }, [colors, sizes, variations, selectedColor, selectedSize, selectedVariation]);

  const getVariationErrorMessage = useMemo(() => {
    if (variations.length > 0) {
      if (!selectedVariation) {
        if (selectedColor && selectedSize) {
          const matching = variations.find((v: any) => 
            v.combination?.color === selectedColor && 
            v.combination?.size === selectedSize &&
            v.is_active !== false
          );
          if (!matching) {
            return app.lang === "ar" 
              ? "⚠️ لا توجد تركيبة متوفرة لهذا اللون والمقاس" 
              : "⚠️ No available variation for this color and size";
          }
        }
        return app.lang === "ar" 
          ? "⚠️ اختر التركيبة المناسبة" 
          : "⚠️ Select the appropriate variation";
      }
      return "";
    }
    if (colors.length > 0 && !selectedColor && sizes.length === 0) {
      return app.lang === "ar" ? "⚠️ اختر اللون أولاً" : "⚠️ Select color first";
    }
    if (sizes.length > 0 && !selectedSize && colors.length === 0) {
      return app.lang === "ar" ? "⚠️ اختر المقاس أولاً" : "⚠️ Select size first";
    }
    if (colors.length > 0 && sizes.length > 0) {
      if (!selectedColor && !selectedSize) {
        return app.lang === "ar" 
          ? "⚠️ اختر اللون والمقاس أولاً" 
          : "⚠️ Select color and size first";
      }
      if (!selectedColor) {
        return app.lang === "ar" ? "⚠️ اختر اللون أولاً" : "⚠️ Select color first";
      }
      if (!selectedSize) {
        return app.lang === "ar" ? "⚠️ اختر المقاس أولاً" : "⚠️ Select size first";
      }
    }
    return "";
  }, [colors, sizes, variations, selectedColor, selectedSize, selectedVariation, app.lang]);

  useEffect(() => {
    if (colors.length === 1 && !selectedColor) {
      setSelectedColor(colors[0].color_name_ar);
      if (colors[0].image_url) setMainImage(colors[0].image_url);
    }
  }, [colors, selectedColor]);

  useEffect(() => {
    if (sizes.length === 1 && !selectedSize) setSelectedSize(sizes[0]);
  }, [sizes, selectedSize]);

  useEffect(() => {
    if (selectedColor && selectedSize && !selectedVariation) {
      const matching = variations.find((v: any) => 
        v.combination?.color === selectedColor && 
        v.combination?.size === selectedSize &&
        v.is_active !== false
      );
      if (matching) setSelectedVariation(matching);
    }
  }, [selectedColor, selectedSize, variations, selectedVariation]);

  useEffect(() => {
    if (listing?.cover_url) setMainImage(listing.cover_url);
    else if (images.length > 0) setMainImage(images[0]);
  }, [listing, images]);

  const handleColorSelect = useCallback((colorName: string, colorImage?: string) => {
    if (selectedColor === colorName) {
      setSelectedColor(null);
      setMainImage(listing?.cover_url || images[0] || "");
      setSelectedVariation(null);
      return;
    }
    setSelectedColor(colorName);
    setSelectedVariation(null);
    if (colorImage) setMainImage(colorImage);
    else {
      const color = colors.find((c: any) => c.color_name_ar === colorName);
      if (color?.image_url) setMainImage(color.image_url);
      else setMainImage(listing?.cover_url || images[0] || "");
    }
  }, [selectedColor, listing, images, colors]);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(selectedSize === size ? null : size);
    setSelectedVariation(null);
  }, [selectedSize]);

  const handleVariationSelect = useCallback((variation: any) => {
    setSelectedVariation(selectedVariation?.id === variation.id ? null : variation);
    
    if (variation.combination) {
      const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
      let colorValue = null;
      
      for (const key of colorKeys) {
        if (variation.combination[key]) {
          colorValue = variation.combination[key];
          break;
        }
      }
      
      if (colorValue) {
        setSelectedColor(colorValue);
        const color = colors.find((c: any) => c.color_name_ar === colorValue);
        if (color?.image_url) {
          setMainImage(color.image_url);
        }
      }
    }
    
    if (variation.combination) {
      const sizeKeys = ['size', 'sizes', 'المقاس', 'مقاس'];
      let sizeValue = null;
      
      for (const key of sizeKeys) {
        if (variation.combination[key]) {
          sizeValue = variation.combination[key];
          break;
        }
      }
      
      if (sizeValue) {
        setSelectedSize(sizeValue);
      }
    }
  }, [selectedVariation, colors]);

  const handleAddToCart = useCallback(async () => {
    if (!app.user) {
      sessionStorage.setItem('redirect_after_login', window.location.pathname);
      sessionStorage.setItem('product_to_cart', JSON.stringify({
        listingId: listing?.id,
        quantity: quantity,
        selectedColor: selectedColor,
        selectedSize: selectedSize,
        selectedVariationId: selectedVariation?.id,
        variationPrice: selectedVariation?.price,
        variationCombination: selectedVariation?.combination,
      }));
      
      toast.info(
        app.lang === "ar" 
          ? "🔐 سيتم إضافة المنتج للسلة بعد تسجيل الدخول" 
          : "🔐 Product will be added to cart after login",
        { duration: 2000 }
      );
      
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
      return;
    }
    
    if (!listing) {
      toast.error(app.lang === "ar" ? "المنتج غير موجود" : "Product not found");
      return;
    }
    
    if (!listing.is_available) {
      toast.error(app.lang === "ar" ? "❌ هذا المنتج غير متوفر حالياً" : "❌ This product is currently unavailable");
      return;
    }

    if (listing.owner_id === app.user.id) {
      toast.error(
        app.lang === "ar" 
          ? "❌ لا يمكنك شراء منتجات من متجرك الخاص" 
          : "❌ You cannot purchase products from your own store"
      );
      return;
    }

    if (!isVariationSelected) {
      const variationsSection = document.getElementById('variations-section');
      if (variationsSection) {
        variationsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        variationsSection.classList.add('ring-2', 'ring-[#1a4f4a]', 'ring-offset-2', 'rounded-xl', 'transition-all', 'duration-300');
        setTimeout(() => {
          variationsSection.classList.remove('ring-2', 'ring-[#1a4f4a]', 'ring-offset-2', 'rounded-xl');
        }, 3000);
      }
      
      toast.warning(
        app.lang === "ar" 
          ? `👆 ${getVariationErrorMessage}` 
          : `👆 ${getVariationErrorMessage}`
      );
      return;
    }

    if (quantity < 1) {
      toast.warning(app.lang === "ar" ? "⚠️ الكمية يجب أن تكون على الأقل 1" : "⚠️ Quantity must be at least 1");
      return;
    }

    try {
      const result = await addToCartMutation.mutateAsync({
        userId: app.user.id,
        listingId: listing.id,
        quantity: quantity,
        selectedColor: selectedColor || undefined,
        selectedSize: selectedSize || undefined,
        selectedVariationId: selectedVariation?.id || undefined,
        variationPrice: selectedVariation?.price || undefined,
        variationCombination: selectedVariation?.combination || undefined,
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
            listingId: listing.id, 
            quantity, 
            selectedColor, 
            selectedSize, 
            selectedVariationId: selectedVariation?.id,
            variationPrice: selectedVariation?.price,
            variationCombination: selectedVariation?.combination,
          });
          setShowStoreConflict(true);
        },
      });
      
      if (result?.action === 'conflict') return;
      
      let details = [];
      if (selectedColor) details.push(`🎨 ${selectedColor}`);
      if (selectedSize) details.push(`📏 ${selectedSize}`);
      if (selectedVariation) {
        const combo = Object.values(selectedVariation.combination).join(' • ');
        details.push(`🔧 ${combo}`);
      }
      
      const detailsText = details.length > 0 ? ` (${details.join(', ')})` : '';
      
      toast.success(
        app.lang === "ar" 
          ? `🛒 تم إضافة ${quantity} × "${listing.title_ar}" للسلة${detailsText}`
          : `🛒 Added ${quantity} × "${listing.title_en || listing.title_ar}" to cart${detailsText}`,
        { 
          duration: 4000,
          action: {
            label: app.lang === "ar" ? "🛒 عرض السلة" : "🛒 View Cart",
            onClick: () => navigate({ to: "/cart" })
          },
          style: {
            background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
            border: '1px solid #f9a8d4',
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(236, 72, 153, 0.25)',
          },
          actionButtonStyle: {
            background: 'linear-gradient(135deg, #1a4f4a, #2a655f)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px',
            padding: '8px 24px',
            boxShadow: '0 8px 30px rgba(26, 79, 74, 0.4)',
            border: 'none',
            fontSize: '14px',
          }
        }
      );
      
      setQuantity(1);
      
    } catch (error: any) {
      console.error("❌ Error adding to cart:", error);
      toast.error(
        app.lang === "ar" 
          ? `❌ فشل إضافة المنتج للسلة: ${error.message || 'خطأ غير معروف'}`
          : `❌ Failed to add to cart: ${error.message || 'Unknown error'}`
      );
    }
  }, [app.user, listing, isVariationSelected, getVariationErrorMessage, selectedColor, selectedSize, selectedVariation, quantity, addToCartMutation, navigate, app.lang]);

  const handleConfirmClearCart = useCallback(async () => {
    if (!app.user || !pendingAddData) return;
    
    try {
      await clearCartMutation.mutateAsync({ userId: app.user.id });
      
      await addToCartMutation.mutateAsync({
        userId: app.user.id,
        listingId: pendingAddData.listingId,
        quantity: pendingAddData.quantity,
        selectedColor: pendingAddData.selectedColor,
        selectedSize: pendingAddData.selectedSize,
        selectedVariationId: pendingAddData.selectedVariationId,
        variationPrice: pendingAddData.variationPrice,
        variationCombination: pendingAddData.variationCombination,
      });
      
      toast.success(
        app.lang === "ar" 
          ? `✅ تم تبديل المتجر وإضافة المنتج للسلة`
          : `✅ Store switched and product added to cart`
      );
      
      setShowStoreConflict(false);
      setPendingAddData(null);
      setQuantity(1);
      
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
    }
  }, [app.user, pendingAddData, clearCartMutation, addToCartMutation, app.lang]);

  const nextImage = useCallback(() => {
    if (selectedColor) {
      const color = colors.find((c: any) => c.color_name_ar === selectedColor);
      if (color?.image_url) {
        setMainImage(color.image_url);
        return;
      }
    }
    setActiveImage((prev) => (prev + 1) % images.length);
  }, [selectedColor, colors, images.length]);

  const prevImage = useCallback(() => {
    if (selectedColor) {
      const color = colors.find((c: any) => c.color_name_ar === selectedColor);
      if (color?.image_url) {
        setMainImage(color.image_url);
        return;
      }
    }
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  }, [selectedColor, colors, images.length]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: listing?.title_ar,
        text: listing?.description_ar || "",
        url: window.location.href,
      });
    } catch {
      navigator.clipboard?.writeText(window.location.href);
      toast.success(app.lang === "ar" ? "تم نسخ الرابط 📋" : "Link copied 📋");
    }
  }, [listing, app.lang]);

  const handleToggleFavorite = useCallback(async () => {
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }
    
    if (!listing) return;
    
    try {
      await toggleFavoriteMutation.mutateAsync({
        userId: app.user.id,
        listingId: listing.id,
        isFav: isFavorite,
      });
      
      app.toggleFavorite(listing.id);
      
      toast.info(
        isFavorite 
          ? (app.lang === "ar" ? "تم إزالة من المفضلة 💔" : "Removed from favorites 💔")
          : (app.lang === "ar" ? "تم إضافة للمفضلة ❤️" : "Added to favorites ❤️")
      );
    } catch (error) {
      console.error("❌ Favorite error:", error);
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }, [app.user, listing, isFavorite, toggleFavoriteMutation, app.lang]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  if (isLoading) return <LoadingSkeleton />;
  if (isError || !listing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold">
            {app.lang === "ar" ? "المنتج غير موجود" : "Product not found"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {app.lang === "ar" ? "قد يكون تم حذفه أو نقله" : "It may have been deleted or moved"}
          </p>
          <Button className="mt-6 bg-[#1a4f4a] hover:bg-[#2a655f] text-white" onClick={() => navigate({ to: "/" })}>
            {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly fallback={<LoadingSkeleton />}>
      <div className="min-h-screen bg-[#f8f9fa] pb-24" dir="rtl">
        
        {/* ===== شريط علوي ===== */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#eee] px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate({ to: -1 })} className="p-2 rounded-full hover:bg-gray-100 transition">
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleFavorite}
              className="p-2 rounded-full hover:bg-gray-100 transition"
              disabled={toggleFavoriteMutation.isPending}
            >
              <Heart className={cn(
                "h-5 w-5 transition-colors",
                isFavorite 
                  ? "fill-pink-500 text-pink-500" 
                  : "text-pink-500"
              )} />
            </button>
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100 transition">
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* عرض الصور */}
        <div className="max-w-xl mx-auto px-4">
          <div className="relative w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative w-full aspect-[4/3] overflow-hidden" onClick={() => setIsZoomed(!isZoomed)}>
              <OptimizedImage
                src={mainImage || images[activeImage]}
                alt={listing.title_ar}
                width={800}
                height={600}
                quality={90}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-300",
                  isZoomed && "scale-150"
                )}
              />
              {images.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); prevImage(); }} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); nextImage(); }} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </>
              )}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {listing.is_offer && (
                  <Badge className="bg-gradient-to-r from-[#1a4f4a] to-[#2a655f] text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold">
                    🔥 {app.lang === "ar" ? "عرض خاص" : "Special Offer"}
                    {listing.discount_percent && ` -${listing.discount_percent}%`}
                  </Badge>
                )}
                {promoOffer && promoOffer.is_active && (
                  <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold animate-pulse">
                    <Gift className="h-3.5 w-3.5 inline ml-1" />
                    {app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"}
                    {promoDiscountPercent > 0 && ` -${promoDiscountPercent}%`}
                  </Badge>
                )}
                {listing.status === "pending" && (
                  <Badge className="bg-yellow-500/90 text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm">
                    ⏳ {app.lang === "ar" ? "قيد المراجعة" : "Pending"}
                  </Badge>
                )}
                {!listing.is_available && (
                  <Badge className="bg-red-500/90 text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm">
                    ❌ {app.lang === "ar" ? "غير متوفر" : "Unavailable"}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 mt-4 space-y-4">
          
          {/* العنوان والتقييم */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h1 className="text-lg font-bold text-gray-900">{listing.title_ar}</h1>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={cn(
                    "h-3.5 w-3.5",
                    star <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  )} />
                ))}
              </div>
              <span className="font-bold text-[#1a4f4a]">{Number(avgRating).toFixed(1)}</span>
              <span>({reviewsCount} {app.lang === "ar" ? "تقييم" : "reviews"})</span>
              <span className="text-gray-300">|</span>
              <span>{listing.governorates ? (app.lang === "ar" ? listing.governorates.name_ar : listing.governorates.name_en) : (app.lang === "ar" ? "جميع المحافظات" : "All Governorates")}</span>
            </div>
          </div>

          {/* اسم المتجر مع صورة دائرية */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{app.lang === "ar" ? "البائع" : "Seller"}</span>
              <Link to="/store/$id" params={{ id: listing.owner_id }} className="flex items-center gap-2 font-semibold text-[#1a4f4a] hover:underline">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  {storeLogo ? (
                    <OptimizedImage src={storeLogo} alt={storeName} width={24} height={24} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="h-3.5 w-3.5 text-gray-500" />
                  )}
                </div>
                <span>{storeName}</span>
              </Link>
            </div>
          </div>

          {/* ✅ عرض ترويجي */}
          {promoOffer && promoOffer.is_active && (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border-2 border-purple-300/50 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-purple-500/20 flex-shrink-0">
                    <Gift className="h-5 w-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-purple-700 flex items-center gap-2">
                      🎁 {app.lang === "ar" ? "هذا المنتج مشمول بعرض ترويجي!" : "This product is included in a promo offer!"}
                    </p>
                    <p className="text-xs text-purple-600/80 mt-0.5">
                      {app.lang === "ar" 
                        ? `💰 اشتري ${promoOffer.buy_quantity || 1} واحصل على ${promoOffer.get_quantity || 1} مجاناً`
                        : `💰 Buy ${promoOffer.buy_quantity || 1} get ${promoOffer.get_quantity || 1} free`
                      }
                    </p>
                  </div>
                </div>
                <Link to="/offer/$id" params={{ id: promoOffer.id }}>
                  <Button 
                    size="sm"
                    className="rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                  >
                    <Gift className="h-4 w-4 ml-2" />
                    {app.lang === "ar" ? "عرض التفاصيل" : "View Offer"}
                  </Button>
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-purple-200/50 flex flex-wrap items-center gap-3 text-xs text-purple-600/70">
                <span className="flex items-center gap-1">
                  <Tag className="h-3.5 w-3.5" />
                  {app.lang === "ar" ? "نوع العرض:" : "Offer type:"}
                  <Badge className="bg-purple-100 text-purple-700 border-0 text-[9px]">
                    {promoOffer.offer_type === 'bogo' && (app.lang === "ar" ? "نفس المنتج" : "Same Product")}
                    {promoOffer.offer_type === 'cross_sell' && (app.lang === "ar" ? "منتج مختلف" : "Different Product")}
                    {promoOffer.offer_type === 'bundle' && (app.lang === "ar" ? "باقة" : "Bundle")}
                  </Badge>
                </span>
                <span className="text-purple-300/50">|</span>
                <span className="flex items-center gap-1">
                  <Percent className="h-3.5 w-3.5" />
                  {app.lang === "ar" ? "التوفير:" : "Savings:"}
                  <span className="font-bold text-emerald-600">
                    {formatPrice(promoSavings || 0, app.currency, app.lang)}
                  </span>
                </span>
              </div>
            </div>
          )}

          {/* السعر */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex flex-col gap-2">
              {listing.is_offer && listing.old_price && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-red-500 line-through font-medium">
                    {formatPrice(Number(listing.old_price), app.currency, app.lang)}
                  </span>
                  <Badge className="bg-[#1a4f4a] text-white border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    🎯 -{Math.round(((Number(listing.old_price) - Number(listing.price)) / Number(listing.old_price)) * 100)}%
                  </Badge>
                </div>
              )}
              <div className="flex items-end gap-3">
                <span className="text-2xl font-black text-[#1a4f4a]">
                  {formatPrice(Number(listing.price), app.currency, app.lang)}
                </span>
                <span className="text-xs text-gray-400">🇸🇾 {app.lang === "ar" ? "سوري" : "SYP"}</span>
              </div>
            </div>
          </div>

          {/* ✅ تنبيه اختيار الفيرنتات */}
          {(colors.length > 0 || sizes.length > 0 || variations.length > 0) && !isVariationSelected && (
            <div className="p-3 bg-[#1a4f4a]/10 rounded-xl border-2 border-[#1a4f4a]/30 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="h-5 w-5 text-[#1a4f4a] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#1a4f4a]">
                  {app.lang === "ar" ? "⚠️ مطلوب اختيار الخيارات" : "⚠️ Options required"}
                </p>
                <p className="text-xs text-[#1a4f4a]/80 mt-0.5">
                  {app.lang === "ar" 
                    ? "يرجى اختيار اللون والمقاس المناسبين قبل إضافة المنتج للسلة"
                    : "Please select the appropriate color and size before adding to cart"}
                </p>
              </div>
            </div>
          )}

          {/* ✅ تم اختيار كل الفيرنتات */}
          {(colors.length > 0 || sizes.length > 0 || variations.length > 0) && isVariationSelected && (
            <div className="p-3 bg-emerald-50 rounded-xl border-2 border-emerald-300/50 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  ✅ {app.lang === "ar" ? "تم اختيار الخيارات" : "Options selected"}
                </p>
                <p className="text-xs text-emerald-600/80 mt-0.5">
                  {selectedColor && `🎨 ${selectedColor}`}
                  {selectedColor && selectedSize && " • "}
                  {selectedSize && `📏 ${selectedSize}`}
                  {selectedVariation && (
                    <>
                      {(selectedColor || selectedSize) && " • "}
                      🔧 {Object.values(selectedVariation.combination).join(' • ')}
                    </>
                  )}
                </p>
              </div>
            </div>
          )}

          {/* الخيارات والكمية */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-4" id="variations-section">
            
            {/* الألوان */}
            {colors.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">🎨 {app.lang === "ar" ? "اللون" : "Color"} <span className="text-red-500">*</span></span>
                  <span className={cn(
                    "text-xs font-medium transition-all duration-300",
                    selectedColor ? "text-emerald-600" : "text-[#1a4f4a]"
                  )}>
                    {selectedColor 
                      ? `✅ ${selectedColor}` 
                      : (app.lang === "ar" ? "⚠️ مطلوب" : "⚠️ Required")}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((c: any) => (
                    <button
                      key={c.id}
                      onClick={() => handleColorSelect(c.color_name_ar, c.image_url)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-xs font-medium transition flex items-center gap-1.5",
                        selectedColor === c.color_name_ar ? "border-[#1a4f4a] bg-[#1a4f4a]/10 text-[#1a4f4a]" : "border-gray-200 text-gray-700"
                      )}
                    >
                      <span 
                        className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                        style={{ backgroundColor: c.color_hex || '#ccc' }}
                      />
                      {c.color_name_ar}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* المقاسات */}
            {sizes.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">📏 {app.lang === "ar" ? "المقاس" : "Size"} <span className="text-red-500">*</span></span>
                  <span className={cn(
                    "text-xs font-medium transition-all duration-300",
                    selectedSize ? "text-emerald-600" : "text-[#1a4f4a]"
                  )}>
                    {selectedSize 
                      ? `✅ ${selectedSize}` 
                      : (app.lang === "ar" ? "⚠️ مطلوب" : "⚠️ Required")}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {sizes.map((s: string) => (
                    <button
                      key={s}
                      onClick={() => handleSizeSelect(s)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-xs font-medium transition",
                        selectedSize === s ? "border-[#1a4f4a] bg-[#1a4f4a]/10 text-[#1a4f4a]" : "border-gray-200 text-gray-700"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* جدول التركيبات */}
            {variations.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5 text-[#1a4f4a]" />
                    {app.lang === "ar" ? "التركيبات" : "Variations"} <span className="text-red-500">*</span>
                  </span>
                  <span className={cn(
                    "text-xs font-medium transition-all duration-300",
                    selectedVariation ? "text-emerald-600" : "text-[#1a4f4a]"
                  )}>
                    {selectedVariation 
                      ? `✅ ${app.lang === "ar" ? "مختار" : "Selected"}` 
                      : (app.lang === "ar" ? "⚠️ مطلوب" : "⚠️ Required")}
                  </span>
                </div>
                <div className="border rounded-xl overflow-hidden border-gray-200">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-50">
                      <tr>
                        {(() => {
                          const keys = new Set<string>();
                          sortedVariations.forEach((v: any) => {
                            if (v.combination) {
                              Object.keys(v.combination).forEach(key => keys.add(key));
                            }
                          });
                          return Array.from(keys).map((key) => (
                            <th key={key} className="px-2 py-1.5 text-right font-medium text-[#1a4f4a]">
                              {key === 'color' || key === 'colors' ? (app.lang === "ar" ? "اللون" : "Color") :
                               key === 'size' ? (app.lang === "ar" ? "المقاس" : "Size") :
                               key === 'fabric' ? (app.lang === "ar" ? "الخامة" : "Fabric") :
                               key === 'season' ? (app.lang === "ar" ? "الموسم" : "Season") :
                               key === 'material' ? (app.lang === "ar" ? "المادة" : "Material") :
                               key === 'style' ? (app.lang === "ar" ? "النمط" : "Style") :
                               key === 'brand' ? (app.lang === "ar" ? "الماركة" : "Brand") :
                               key}
                            </th>
                          ));
                        })()}
                        <th className="px-2 py-1.5 text-right font-medium text-[#1a4f4a]">{app.lang === "ar" ? "السعر" : "Price"}</th>
                        <th className="px-2 py-1.5 text-center font-medium text-[#1a4f4a]">{app.lang === "ar" ? "اختيار" : "Select"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedVariations.map((v: any) => {
                        const isAvailable = v.is_active !== false;
                        const isSelected = selectedVariation?.id === v.id;
                        const keys = Object.keys(v.combination || {});
                        
                        return (
                          <tr 
                            key={v.id}
                            className={cn(
                              "border-t border-gray-100 transition-colors",
                              isSelected ? "bg-[#1a4f4a]/5" : "hover:bg-gray-50",
                              !isAvailable && "opacity-50"
                            )}
                          >
                            {keys.map((key) => (
                              <td key={key} className="px-2 py-2 text-xs">
                                {key === 'color' || key === 'colors' ? (
                                  <div className="flex items-center gap-1.5">
                                    {(() => {
                                      const colorName = v.combination[key];
                                      const colorObj = colors.find((c: any) => 
                                        c.color_name_ar === colorName || c.color_name_en === colorName
                                      );
                                      return (
                                        <>
                                          <span 
                                            className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                                            style={{ backgroundColor: colorObj?.color_hex || '#ccc' }}
                                          />
                                          <span>{colorName || '-'}</span>
                                        </>
                                      );
                                    })()}
                                  </div>
                                ) : (
                                  <span>{v.combination[key] || '-'}</span>
                                )}
                              </td>
                            ))}
                            <td className="px-2 py-2 text-xs font-semibold text-[#1a4f4a]">
                              {v.price ? formatPrice(v.price, app.currency, app.lang) : formatPrice(Number(listing.price), app.currency, app.lang)}
                              {listing.is_offer && v.old_price && v.old_price > 0 && (
                                <span className="mr-1 text-xs text-red-400 line-through">
                                  {formatPrice(v.old_price, app.currency, app.lang)}
                                </span>
                              )}
                            </td>
                            <td className="px-2 py-2 text-center">
                              {isAvailable && (
                                <button
                                  onClick={() => handleVariationSelect(v)}
                                  className={cn(
                                    "px-2 py-0.5 rounded-lg text-[10px] font-medium transition border",
                                    isSelected 
                                      ? "bg-[#1a4f4a] text-white border-[#1a4f4a]" 
                                      : "border-gray-300 text-gray-600 hover:border-[#1a4f4a] hover:text-[#1a4f4a]"
                                  )}
                                >
                                  {isSelected ? "✅" : (app.lang === "ar" ? "اختر" : "Select")}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* عداد الكمية */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm font-medium text-gray-700">{app.lang === "ar" ? "الكمية:" : "Quantity:"}</span>
              <div className="flex items-center bg-[#f4f4f4] rounded-xl px-2 py-1 gap-2 border border-gray-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-bold text-sm w-6 text-center text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* السعر الكلي */}
            <div className="bg-[#fef9ec] border border-[#fde6b5] rounded-2xl p-4 flex items-center justify-between">
              <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-amber-600" />
                {app.lang === "ar" ? "السعر الكلي" : "Total Price"}
              </span>
              <span className="text-xl font-black text-gray-900">
                {formatPrice(Number(listing.price) * quantity, app.currency, app.lang)}
              </span>
            </div>

          </div>

          {/* الوصف */}
          {listing.description_ar && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-sm text-gray-900 mb-2 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#1a4f4a]" />
                {app.lang === "ar" ? "الوصف" : "Description"}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {listing.description_ar}
              </p>
            </div>
          )}

          {/* ===== المنتجات التي قد تعجبك أيضاً (4 فقط — العروض أولاً) ===== */}
          {sortedSimilarListings.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#2a655f] grid place-items-center text-white shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900">
                    {app.lang === "ar" ? "المنتجات التي قد تعجبك أيضاً" : "Products you might also like"}
                  </h3>
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {sortedSimilarListings.length}
                  </Badge>
                </div>
                <Link 
                  to="/category/$slug" 
                  params={{ slug: listing.categories?.slug || "all" }}
                  className="bg-[#f5f5f5] hover:bg-[#e8e8e8] transition-colors px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:text-gray-800"
                >
                  {app.lang === "ar" ? "شاهد المزيد" : "View More"}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sortedSimilarListings.map((item: any) => {
                  const hasPromo = item.has_promo_offer === true || item.has_promo_offer === "true";
                  const hasDiscount = item.is_offer === true || (item.discount_percent && item.discount_percent > 0);
                  
                  return (
                    <Link 
                      key={item.id} 
                      to="/listing/$id" 
                      params={{ id: item.id }} 
                      className="group relative bg-white rounded-2xl p-2 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2a655f]/30 transition-all duration-300 block"
                    >
                      {/* ✅ Badge العرض الترويجي */}
                      {hasPromo && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 text-[9px] px-2 py-0.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                            <Gift className="h-2.5 w-2.5" />
                            {item.promo_offer_type === 'bogo' && 'BOGO'}
                            {item.promo_offer_type === 'bundle' && (app.lang === "ar" ? 'باقة' : 'Bundle')}
                            {item.promo_offer_type === 'cross_sell' && (app.lang === "ar" ? 'عرض' : 'Offer')}
                            {!item.promo_offer_type && (app.lang === "ar" ? 'عرض' : 'Promo')}
                          </Badge>
                        </div>
                      )}
                      
                      {/* ✅ Badge التخفيض */}
                      {!hasPromo && hasDiscount && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 text-[9px] px-2 py-0.5 rounded-full font-bold shadow-lg">
                            🔥 -{item.discount_percent || 20}%
                          </Badge>
                        </div>
                      )}

                      <div className="relative w-full aspect-square overflow-hidden rounded-xl">
                        <OptimizedImage 
                          src={item.cover_url} 
                          alt={item.title_ar} 
                          width={200} 
                          height={200} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      <h4 className="text-xs font-medium text-gray-800 mt-2 line-clamp-2 min-h-[2rem] leading-snug">
                        {app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar)}
                      </h4>
                      
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex flex-col">
                          {hasDiscount && item.old_price && (
                            <span className="text-[10px] text-red-400 line-through">
                              {formatPrice(Number(item.old_price), app.currency, app.lang)}
                            </span>
                          )}
                          <span className="text-sm font-bold text-[#2a655f]">
                            {formatPrice(Number(item.price), app.currency, app.lang)}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-[10px] text-gray-500">
                          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                          <span>{Number(item.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== ✅ الأكثر مبيعاً - كروت عمودية بعرض كامل ===== */}
          {(trendingLoading || bestSellingListings.length > 0) && (
            <div className="space-y-3 pt-2">
              {/* Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#2a655f] grid place-items-center text-white shadow-sm">
                    <Flame className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900">
                    {app.lang === "ar" ? "🔥 الأكثر مبيعاً" : "🔥 Best Sellers"}
                  </h3>
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {bestSellingListings.length}
                  </Badge>
                </div>
                <Link 
                  to="/products"
                  className="bg-[#f5f5f5] hover:bg-[#e8e8e8] transition-colors px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:text-gray-800"
                >
                  {app.lang === "ar" ? "شاهد المزيد" : "View More"}
                </Link>
              </div>

              {/* Vertical List - كل كارت بعرض كامل تحت الثاني */}
              {trendingLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 animate-pulse flex gap-3">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-5 bg-gray-100 rounded w-1/3 mt-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : bestSellingListings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <Flame className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    {app.lang === "ar" ? "لا توجد منتجات رائجة حالياً" : "No trending products yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bestSellingListings.map((item: any, index: number) => (
                    <Link 
                      key={item.id} 
                      to="/listing/$id" 
                      params={{ id: item.id }} 
                      className="group relative bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2a655f]/30 transition-all duration-300 flex gap-3 items-center"
                    >
                      {/* ✅ رقم الترتيب - زيتي */}
                      <div className="absolute top-3 right-3 z-10 h-6 w-6 rounded-full bg-[#2a655f] flex items-center justify-center shadow-md">
                        <span className="text-[10px] font-bold text-white">
                          {index + 1}
                        </span>
                      </div>

                      {/* ✅ صورة المنتج */}
                      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl">
                        <OptimizedImage 
                          src={item.cover_url} 
                          alt={item.title_ar} 
                          width={200} 
                          height={200} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>

                      {/* ✅ تفاصيل المنتج */}
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug pe-8">
                          {app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar)}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] text-gray-500">
                              {Number(item.rating || 0).toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-300">•</span>
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                            <Flame className="h-2 w-2 inline mr-0.5" />
                            {app.lang === "ar" ? "الأكثر مبيعاً" : "Best"}
                          </Badge>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-base font-bold text-[#2a655f]">
                            {formatPrice(Number(item.price), app.currency, app.lang)}
                          </span>
                          <ChevronLeft className="h-4 w-4 text-[#2a655f] group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ===== شريط الأزرار السفلي ===== */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 max-w-xl mx-auto flex gap-3 shadow-lg">
          <Button
            onClick={async () => {
              await handleAddToCart();
              navigate({ to: "/cart" });
            }}
            className="flex-1 bg-[#fef9ec] hover:bg-[#fde6b5] text-gray-900 font-bold h-12 rounded-xl text-base shadow-md transition border-2 border-[#fde6b5]"
            disabled={!listing.is_available || addToCartMutation.isPending || !isVariationSelected}
          >
            {app.lang === "ar" ? "اشتري الآن" : "Buy Now"}
          </Button>
          <Button
            onClick={handleAddToCart}
            className={cn(
              "flex-1 font-bold h-12 rounded-xl text-base shadow-md transition",
              "bg-[#1a4f4a] hover:bg-[#2a655f] text-white"
            )}
            disabled={!listing.is_available || addToCartMutation.isPending || !isVariationSelected}
          >
            {addToCartMutation.isPending ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {app.lang === "ar" ? "جاري..." : "Loading..."}
              </div>
            ) : isInCart ? (
              <>
                <CheckCircle className="h-4 w-4 ml-2" />
                {app.lang === "ar" ? "✅ موجود في السلة" : "✅ In Cart"}
                {cartItemCount > 0 && (
                  <Badge className="bg-white/20 text-white border-0 mr-2 text-[10px]">
                    {cartItemCount}
                  </Badge>
                )}
              </>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 ml-2" />
                {app.lang === "ar" ? "أضف إلى السلة" : "Add to Cart"}
              </>
            )}
          </Button>
        </div>

        {/* مودال تعارض المتاجر */}
        <Dialog open={showStoreConflict} onOpenChange={setShowStoreConflict}>
          <DialogContent className="max-w-md rounded-2xl bg-white p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <ShoppingBag className="h-5 w-5 text-[#1a4f4a]" />
                {app.lang === "ar" ? "سلة من متجر آخر" : "Cart from another store"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                {app.lang === "ar" 
                  ? `لديك منتجات في السلة من متجر "${currentStoreName}". هل تريد تفريغ السلة وإضافة المنتج من "${newStoreName}"؟`
                  : `You have items in your cart from "${currentStoreName}". Do you want to clear the cart and add the product from "${newStoreName}"?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setShowStoreConflict(false)} className="rounded-xl">
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                onClick={handleConfirmClearCart} 
                className="bg-[#1a4f4a] hover:bg-[#2a655f] text-white rounded-xl"
              >
                {app.lang === "ar" ? "تفريغ السلة وإضافة الجديد" : "Clear cart and add new"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </ClientOnly>
  );
}

export default ListingDetailPage;