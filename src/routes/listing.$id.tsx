// src/routes/listing/$id.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Star, MapPin, Heart, ShoppingBag, MessageCircle, Phone, Share2,
  ChevronLeft, ChevronRight, Store, Truck, Shield, Clock, Award,
  BadgePercent, Package, ArrowRight, Sparkles, CalendarDays,
  Minus, Plus, X, Check, CreditCard, Wallet, Send, Palette, Ruler, Layers,
  ShoppingCart, Trash2, CheckCircle
} from "lucide-react";
import { useToggleFavorite } from "@/lib/queries";
import { useApp, formatPrice, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListing, useListingReviews, useSimilarListings } from "@/lib/queries";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { BookingModal } from "@/components/booking/BookingModal";
import { useCreateBooking } from "@/lib/queries";
import { translateOptionType } from "@/lib/utils/constants";
import { ClientOnly } from "@/components/ClientOnly";
import { useCart, useAddToCart, useClearCart } from "@/lib/hooks/useCart";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/listing/$id")({
  component: ListingDetailPage,
  head: () => ({ meta: [{ title: "تفاصيل المنتج — السوق لعندك" }] }),
});

// ✅ Skeleton للتحميل
const LoadingSkeleton = () => (
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

function ListingDetailPage() {
  const { id } = Route.useParams();
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  
  // ✅ State
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mainImage, setMainImage] = useState<string>("");
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [showStoreConflict, setShowStoreConflict] = useState(false);
  const [currentStoreName, setCurrentStoreName] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [pendingAddData, setPendingAddData] = useState<any>(null);
  
  // ✅ Queries
  const { 
    data: listing, 
    isLoading, 
    isError,
  } = useListing(id);
  
  const { data: reviews = [] } = useListingReviews(id);
  const { data: similarListings = [] } = useSimilarListings(
    listing?.category_id,
    listing?.id,
    4
  );
  
  // ✅ Cart Hooks
  const { data: cart } = useCart(app.user?.id);
  const addToCartMutation = useAddToCart();
  const clearCartMutation = useClearCart();
  
  // ✅ Favorites
  const toggleFavoriteMutation = useToggleFavorite();
  const isFavorite = listing ? app.favorites.includes(listing.id) : false;
  
  // ✅ Create Booking
  const createBooking = useCreateBooking();
  
  // ✅ ✅ ✅ استخراج البيانات - مصحح (من product_variations وليس metadata)
  const images = useMemo(() => {
    const imgList = listing?.listing_images?.map((img: any) => img.url) || [];
    if (listing?.cover_url) imgList.unshift(listing.cover_url);
    return imgList;
  }, [listing]);

  // ✅ الألوان من product_colors
  const colors = useMemo(() => (listing as any)?.colors || [], [listing]);
  
  // ✅ المقاسات من product_options
  const sizes = useMemo(() => {
    const options = (listing as any)?.options || [];
    return options
      .filter((opt: any) => opt.option_type === 'size')
      .map((opt: any) => opt.option_value);
  }, [listing]);
  
  // ✅ التركيبات من product_variations
  const variations = useMemo(() => (listing as any)?.variations || [], [listing]);

  const avgRating = useMemo(() => (listing as any)?.avg_rating || listing?.rating || 0, [listing]);
  const reviewsCount = useMemo(() => (listing as any)?.reviews_count || reviews.length || 0, [listing, reviews]);

  const storeName = useMemo(() => 
    (listing as any)?.profiles?.store_name || 
    (listing as any)?.owner?.store_name || 
    (listing as any)?.profiles?.full_name || 
    (listing as any)?.owner?.full_name || 
    "متجر",
  [listing]);

  const allowsBookings = useMemo(() => 
    (listing as any)?.profiles?.allows_bookings || 
    (listing as any)?.owner?.allows_bookings || 
    false,
  [listing]);

  // ✅ ✅ ✅ التحقق من وجود المنتج في السلة
  const isInCart = useMemo(() => {
    return cart?.items?.some((item: any) => item.listing_id === listing?.id);
  }, [cart, listing]);

  const cartItemCount = useMemo(() => {
    const item = cart?.items?.find((item: any) => item.listing_id === listing?.id);
    return item?.quantity || 0;
  }, [cart, listing]);

  // ✅ ✅ ✅ ترتيب التركيبات (حسب اللون ثم المقاس)
  const sortedVariations = useMemo(() => {
    return [...variations].sort((a, b) => {
      const colorA = a.combination?.color || '';
      const colorB = b.combination?.color || '';
      if (colorA !== colorB) return colorA.localeCompare(colorB);
      const sizeA = a.combination?.size || '';
      const sizeB = b.combination?.size || '';
      return sizeA.localeCompare(sizeB);
    });
  }, [variations]);

  // ✅ ✅ ✅ تصفية التركيبات
  const filteredVariations = useMemo(() => {
    const isVariationAvailable = (variation: any) => variation.is_active !== false;
    
    if (!selectedColor && !selectedSize) {
      return sortedVariations.filter((v: any) => isVariationAvailable(v));
    }
    
    return sortedVariations.filter((v: any) => {
      if (!isVariationAvailable(v)) return false;
      if (selectedColor && v.combination?.color !== selectedColor) return false;
      if (selectedSize && v.combination?.size !== selectedSize) return false;
      return true;
    });
  }, [sortedVariations, selectedColor, selectedSize]);

  // ✅ ✅ ✅ اختيار تلقائي
  useEffect(() => {
    // ✅ إذا كان في لون واحد
    if (colors.length === 1 && !selectedColor) {
      setSelectedColor(colors[0].color_name_ar);
      if (colors[0].image_url) {
        setMainImage(colors[0].image_url);
      }
    }
  }, [colors, selectedColor]);

  useEffect(() => {
    // ✅ إذا كان في مقاس واحد
    if (sizes.length === 1 && !selectedSize) {
      setSelectedSize(sizes[0]);
    }
  }, [sizes, selectedSize]);

  useEffect(() => {
    // ✅ إذا تطابق اللون والمقاس مع تركيبة
    if (selectedColor && selectedSize && !selectedVariation) {
      const matching = variations.find((v: any) => 
        v.combination?.color === selectedColor && 
        v.combination?.size === selectedSize &&
        v.is_active !== false
      );
      if (matching) {
        setSelectedVariation(matching);
      }
    }
  }, [selectedColor, selectedSize, variations, selectedVariation]);

  // ✅ ✅ ✅ تهيئة الصورة الرئيسية
  useEffect(() => {
    if (listing?.cover_url) {
      setMainImage(listing.cover_url);
    } else if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [listing, images]);

  // ✅ ✅ ✅ دوال معالجة
  const handleColorSelect = useCallback((colorName: string, colorImage?: string) => {
    if (selectedColor === colorName) {
      setSelectedColor(null);
      setMainImage(listing?.cover_url || images[0] || "");
      setSelectedVariation(null);
      return;
    }
    
    setSelectedColor(colorName);
    setSelectedVariation(null);
    
    if (colorImage) {
      setMainImage(colorImage);
    } else {
      const color = colors.find((c: any) => c.color_name_ar === colorName);
      if (color?.image_url) {
        setMainImage(color.image_url);
      } else {
        setMainImage(listing?.cover_url || images[0] || "");
      }
    }
  }, [selectedColor, listing, images, colors]);

  const handleSizeSelect = useCallback((size: string) => {
    setSelectedSize(selectedSize === size ? null : size);
    setSelectedVariation(null);
  }, [selectedSize]);

  const handleVariationSelect = useCallback((variation: any) => {
    setSelectedVariation(selectedVariation?.id === variation.id ? null : variation);
    if (variation.combination?.color) {
      setSelectedColor(variation.combination.color);
      const color = colors.find((c: any) => c.color_name_ar === variation.combination.color);
      if (color?.image_url) {
        setMainImage(color.image_url);
      }
    }
    if (variation.combination?.size) {
      setSelectedSize(variation.combination.size);
    }
  }, [selectedVariation, colors]);

  // ✅ ✅ ✅ دالة إضافة للسلة
  const handleAddToCart = useCallback(async () => {
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
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

    if (colors.length > 1 && !selectedColor) {
      toast.warning(app.lang === "ar" ? "⚠️ يرجى اختيار اللون أولاً" : "⚠️ Please select a color first");
      return;
    }

    if (sizes.length > 1 && !selectedSize) {
      toast.warning(app.lang === "ar" ? "⚠️ يرجى اختيار المقاس أولاً" : "⚠️ Please select a size first");
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
            selectedVariationId: selectedVariation?.id 
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
            label: app.lang === "ar" ? "📦 عرض السلة" : "📦 View Cart",
            onClick: () => navigate({ to: "/cart" })
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
  }, [app.user, listing, colors, sizes, selectedColor, selectedSize, selectedVariation, quantity, addToCartMutation, navigate, app.lang]);

  // ✅ ✅ ✅ دالة تأكيد تفريغ السلة
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

  // ✅ ✅ ✅ دالة تأكيد الحجز
  const handleBookingConfirm = useCallback(async (bookingData: any) => {
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      navigate({ to: "/login" });
      return;
    }

    if (!listing) {
      toast.error(app.lang === "ar" ? "المنتج غير موجود" : "Product not found");
      return;
    }

    setIsBookingLoading(true);
    try {
      const result = await createBooking.mutateAsync({
        listing_id: listing.id,
        customer_id: app.user.id,
        provider_id: listing.owner_id,
        starts_at: bookingData.startDate.toISOString(),
        ends_at: bookingData.endDate ? bookingData.endDate.toISOString() : null,
        guests: bookingData.guests,
        total: bookingData.total,
        currency: app.currency,
        notes: bookingData.notes || "",
      });

      await supabase
        .from('notifications')
        .insert([
          {
             user_id: app.user.id,
            type: 'booking',
            title_ar: `📅 حجز جديد على "${listing.title_ar}"`,
            body_ar: `قام ${app.user.name} بحجز ${bookingData.guests} ضيف/ضيوف في ${new Date(bookingData.startDate).toLocaleDateString('ar-SA')}`,
            title_en: `📅 New booking for "${listing.title_en || listing.title_ar}"`,
            body_en: `${app.user.name} booked ${bookingData.guests} guest(s) on ${new Date(bookingData.startDate).toLocaleDateString('en-US')}`,
            link_url: `/dashboard/bookings`,
            metadata: {
              booking_id: result.id,
              listing_id: listing.id,
              customer_id: app.user.id,
              guests: bookingData.guests,
              total: bookingData.total,
              start_date: bookingData.startDate,
              end_date: bookingData.endDate,
            },
          },
          {
           user_id: app.user.id,
            type: 'booking_confirmation',
            title_ar: `✅ تم إرسال طلب الحجز`,
            body_ar: `تم إرسال طلب حجز "${listing.title_ar}" إلى المتجر في انتظار التأكيد`,
            title_en: `✅ Booking request sent`,
            body_en: `Booking request for "${listing.title_en || listing.title_ar}" sent to the store. Waiting for confirmation.`,
            link_url: `/bookings`,
            metadata: {
              booking_id: result.id,
              listing_id: listing.id,
              status: 'pending',
            },
          }
        ]);

      toast.success(
        app.lang === "ar" 
          ? "✅ تم إرسال طلب الحجز بنجاح! في انتظار تأكيد المتجر." 
          : "✅ Booking request sent successfully! Waiting for store confirmation.",
        { duration: 5000 }
      );

      setIsBookingModalOpen(false);
      navigate({ to: "/bookings" });

    } catch (error: any) {
      console.error("❌ Booking error:", error);
      toast.error(
        app.lang === "ar" 
          ? "❌ حدث خطأ أثناء الحجز، حاول مرة أخرى" 
          : "❌ An error occurred, please try again"
      );
    } finally {
      setIsBookingLoading(false);
    }
  }, [app.user, listing, createBooking, navigate, app.lang, app.currency]);

  // ✅ ✅ ✅ التنقل بين الصور
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

  // ✅ ✅ ✅ مشاركة المنتج
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

  // ✅ ✅ ✅ دالة إضافة/إزالة من المفضلة
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

  // ✅ Scroll to top
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // ✅ حالة التحميل
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // ✅ إذا المنتج غير موجود
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
          <Button className="mt-6" onClick={() => navigate({ to: "/" })}>
            {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly fallback={<LoadingSkeleton />}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* ===== Breadcrumb ===== */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">
              {app.lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <Link 
              to="/category/$slug" 
              params={{ slug: listing.categories?.slug || "all" }} 
              className="hover:text-primary transition-colors"
            >
              {listing.categories ? (app.lang === "ar" ? listing.categories.name_ar : listing.categories.name_en) : (app.lang === "ar" ? "المنتجات" : "Products")}
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-foreground font-medium line-clamp-1">
              {app.lang === "ar" ? listing.title_ar : (listing.title_en || listing.title_ar)}
            </span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10">
            
            {/* ===== LEFT - قسم الصور (نفسه) ===== */}
            <div className="space-y-4">
              <div 
                className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border border-border/30 shadow-xl cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={listing.title_ar}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isZoomed ? "scale-150 cursor-zoom-out" : "hover:scale-105"
                    )}
                  />
                ) : images.length > 0 ? (
                  <img
                    src={images[activeImage]}
                    alt={listing.title_ar}
                    className={cn(
                      "w-full h-full object-cover transition-all duration-700",
                      isZoomed ? "scale-150 cursor-zoom-out" : "hover:scale-105"
                    )}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-lg">
                    <Package className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                )}
                
                {images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); nextImage(); }}
                      className="absolute end-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur text-slate-800 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 border border-white/20"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); prevImage(); }}
                      className="absolute start-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/90 backdrop-blur text-slate-800 hover:bg-white shadow-lg flex items-center justify-center transition-all hover:scale-110 border border-white/20"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                  </>
                )}
                
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur px-4 py-1.5 rounded-full text-white text-xs font-medium">
                    {activeImage + 1} / {images.length}
                  </div>
                )}
                
                <div className="absolute top-4 start-4 flex flex-col gap-2">
                  {listing.is_offer && (
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold">
                      🔥 {app.lang === "ar" ? "عرض خاص" : "Special Offer"}
                      {listing.discount_percent && ` -${listing.discount_percent}%`}
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
              
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setActiveImage(i);
                        setMainImage(img);
                        setSelectedColor(null);
                      }}
                      className={cn(
                        "relative w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0",
                        activeImage === i 
                          ? "border-primary shadow-lg shadow-primary/20 scale-105" 
                          : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                      )}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ===== RIGHT - معلومات المنتج ===== */}
            <div className="space-y-6">
              
              {/* ===== التقييم والمحافظة ===== */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-950/30 px-4 py-2 rounded-full border border-yellow-200/30">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn(
                        "h-4 w-4",
                        star <= Math.round(avgRating) ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"
                      )} />
                    ))}
                  </div>
                  <span className="font-bold text-sm">{Number(avgRating).toFixed(1)}</span>
                  <span className="text-sm text-muted-foreground">({reviewsCount} {app.lang === "ar" ? "تقييم" : "reviews"})</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>{listing.governorates ? (app.lang === "ar" ? listing.governorates.name_ar : listing.governorates.name_en) : (app.lang === "ar" ? "جميع المحافظات" : "All Governorates")}</span>
                </div>
              </div>

              {/* ===== العنوان ===== */}
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {app.lang === "ar" ? listing.title_ar : (listing.title_en || listing.title_ar)}
              </h1>

              {/* ===== اسم المتجر ===== */}
              <Link 
                to="/store/$id" 
                params={{ id: listing.owner_id }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-primary/5 to-primary/10 hover:from-primary/10 hover:to-primary/20 transition-all border border-primary/10 group"
              >
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
                  {storeName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg group-hover:text-primary transition">{storeName}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    {app.lang === "ar" ? "متجر موثوق" : "Trusted Store"}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group-hover:bg-primary/10 group-hover:scale-105 transition">
                  {app.lang === "ar" ? "زيارة المتجر" : "Visit Store"} <ArrowRight className="h-4 w-4 ms-1" />
                </Button>
              </Link>

              {/* ===== السعر ===== */}
              <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
                <div className="flex flex-col gap-3">
                  {listing.is_offer && (listing.old_price || listing.old_price_usd) && (
                    <div className="flex items-center gap-4 flex-wrap">
                      {listing.old_price && (
                        <span className="text-lg text-red-500 line-through font-medium">
                          {formatPrice(Number(listing.old_price), app.currency, app.lang)}
                        </span>
                      )}
                      {listing.old_price_usd && (
                        <span className="text-sm text-red-400 line-through">
                          ${Number(listing.old_price_usd).toFixed(2)}
                        </span>
                      )}
                      {listing.old_price && listing.price && (
                        <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md shadow-red-500/20">
                          🎯 -{Math.round(((Number(listing.old_price) - Number(listing.price)) / Number(listing.old_price)) * 100)}%
                        </Badge>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-end gap-4 flex-wrap">
                      <span className="text-4xl md:text-5xl font-black text-primary">
                        {formatPrice(Number(listing.price), app.currency, app.lang)}
                      </span>
                      {listing.price_usd && (
                        <span className="text-lg font-semibold text-muted-foreground">
                          ${Number(listing.price_usd).toFixed(2)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                        <span className="text-base">🇸🇾</span>
                        <span className="font-medium">{app.lang === "ar" ? "سوري" : "SYP"}</span>
                        <span className="text-foreground font-semibold">{formatPrice(Number(listing.price), app.currency, app.lang)}</span>
                      </span>
                      {listing.price_usd && (
                        <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full">
                          <span className="text-base">💵</span>
                          <span className="font-medium">{app.lang === "ar" ? "دولار" : "USD"}</span>
                          <span className="text-foreground font-semibold">${Number(listing.price_usd).toFixed(2)}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== ✅ الألوان - تصميم متناسق مع نظامك ===== */}
              {colors.length > 0 && (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {app.lang === "ar" ? "🎨 اللون" : "🎨 Color"}
                      {colors.length > 1 && (
                        <span className="text-xs text-muted-foreground/60 ms-1">
                          ({colors.length} {app.lang === "ar" ? "خيارات" : "options"})
                        </span>
                      )}
                    </p>
                    <span className="text-xs text-muted-foreground/60">
                      {selectedColor || (app.lang === "ar" ? "اختر لوناً" : "Select a color")}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colors.map((color: any) => (
                      <div 
                        key={color.id} 
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                        onClick={() => handleColorSelect(color.color_name_ar, color.image_url)}
                      >
                        <div className={cn(
                          "relative h-14 w-14 rounded-full overflow-hidden border-2 transition-all shadow-sm",
                          selectedColor === color.color_name_ar 
                            ? "border-[#0d2e2a] ring-2 ring-[#0d2e2a]/30 scale-110 shadow-md shadow-[#0d2e2a]/20" 
                            : "border-slate-200/50 hover:border-[#4a9f95] group-hover:scale-105"
                        )}>
                          <img 
                            src={color.image_url} 
                            alt={color.color_name_ar}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-color.png';
                            }}
                          />
                          {selectedColor === color.color_name_ar && (
                            <div className="absolute inset-0 bg-[#0d2e2a]/10 flex items-center justify-center">
                              <div className="h-6 w-6 rounded-full bg-[#0d2e2a]/80 backdrop-blur flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <span className={cn(
                          "text-[10px] transition-colors font-medium",
                          selectedColor === color.color_name_ar ? "text-[#0d2e2a] font-bold" : "text-muted-foreground"
                        )}>
                          {color.color_name_ar}
                        </span>
                      </div>
                    ))}
                  </div>
                  {selectedColor && (
                    <div className="mt-3 p-3 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/10 flex items-center gap-3">
                      <img 
                        src={mainImage} 
                        alt={selectedColor}
                        className="h-12 w-12 rounded-lg object-cover border border-slate-200/50"
                      />
                      <div>
                        <p className="text-sm font-medium text-[#0d2e2a]">
                          {app.lang === "ar" ? "اللون المختار:" : "Selected color:"}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedColor}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== ✅ المقاسات - تصميم متناسق ===== */}
              {sizes.length > 0 && (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    {app.lang === "ar" ? "📏 المقاس" : "📏 Size"}
                    {sizes.length > 1 && (
                      <span className="text-xs text-muted-foreground/60 ms-1">
                        ({sizes.length} {app.lang === "ar" ? "خيارات" : "options"})
                      </span>
                    )}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={cn(
                          "px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all",
                          selectedSize === size
                            ? "border-[#0d2e2a] bg-[#0d2e2a]/5 text-[#0d2e2a] shadow-sm"
                            : "border-slate-200/50 hover:border-[#4a9f95] hover:bg-[#0d2e2a]/5"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== ✅ جدول التركيبات - مثل نون وبألوان النظام ===== */}
              {variations.length > 0 && (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#0d2e2a]" />
                      {app.lang === "ar" ? "التركيبات المتوفرة" : "Available Variations"}
                      {filteredVariations.length > 0 && (
                        <Badge className="bg-[#0d2e2a] text-white border-0 text-[10px]">
                          {filteredVariations.length} {app.lang === "ar" ? "متوفرة" : "available"}
                        </Badge>
                      )}
                    </p>
                    {selectedVariation && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                        ✅ {app.lang === "ar" ? "مختار" : "Selected"}
                      </Badge>
                    )}
                  </div>
                  
                  {/* ✅ جدول التركيبات مثل نون */}
                  <div className="border rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="bg-[#0d2e2a]/5 dark:bg-slate-800/50">
                        <tr>
                          <th className="px-3 py-2 text-right font-medium text-muted-foreground text-[11px]">
                            {app.lang === "ar" ? "اللون" : "Color"}
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-muted-foreground text-[11px]">
                            {app.lang === "ar" ? "المقاس" : "Size"}
                          </th>
                          <th className="px-3 py-2 text-right font-medium text-muted-foreground text-[11px]">
                            {app.lang === "ar" ? "السعر" : "Price"}
                          </th>
                          <th className="px-3 py-2 text-center font-medium text-muted-foreground text-[11px]">
                            {app.lang === "ar" ? "التوفر" : "Status"}
                          </th>
                          <th className="px-3 py-2 text-center font-medium text-muted-foreground text-[11px]">
                            {app.lang === "ar" ? "اختيار" : "Select"}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedVariations.map((v: any) => {
                          const isAvailable = v.is_active !== false;
                          const isSelected = selectedVariation?.id === v.id;
                          const colorObj = colors.find((c: any) => c.color_name_ar === v.combination?.color);
                          
                          return (
                            <tr 
                              key={v.id}
                              className={cn(
                                "border-t border-slate-100/50 dark:border-slate-800/30 transition-colors",
                                isSelected ? "bg-[#0d2e2a]/5 dark:bg-[#0d2e2a]/10" : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30",
                                !isAvailable && "opacity-50"
                              )}
                            >
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded-full border border-slate-200 flex-shrink-0"
                                    style={{ 
                                      backgroundColor: colorObj?.color_hex || '#ccc' 
                                    }}
                                  />
                                  <span className="text-xs">{v.combination?.color || '-'}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5 font-medium text-xs">{v.combination?.size || '-'}</td>
                              <td className="px-3 py-2.5 text-xs font-semibold text-[#0d2e2a]">
                                {v.price ? formatPrice(v.price, app.currency, app.lang) : formatPrice(Number(listing.price), app.currency, app.lang)}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {isAvailable ? (
                                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[9px] px-2 py-0.5">
                                    ✅ {app.lang === "ar" ? "متوفر" : "Available"}
                                  </Badge>
                                ) : (
                                  <Badge className="bg-red-100 text-red-700 border-0 text-[9px] px-2 py-0.5">
                                    ❌ {app.lang === "ar" ? "غير متوفر" : "Unavailable"}
                                  </Badge>
                                )}
                              </td>
                              <td className="px-3 py-2.5 text-center">
                                {isAvailable && (
                                  <Button
                                    size="sm"
                                    variant={isSelected ? "default" : "outline"}
                                    className={cn(
                                      "rounded-lg h-7 px-2.5 text-[10px] transition-all",
                                      isSelected 
                                        ? "bg-[#0d2e2a] hover:bg-[#1a4f4a] text-white" 
                                        : "border-[#0d2e2a]/30 text-[#0d2e2a] hover:bg-[#0d2e2a]/5"
                                    )}
                                    onClick={() => handleVariationSelect(v)}
                                  >
                                    {isSelected ? (
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                    ) : (
                                      <ShoppingBag className="h-3 w-3 mr-1" />
                                    )}
                                    {isSelected 
                                      ? (app.lang === "ar" ? "مختار" : "Selected")
                                      : (app.lang === "ar" ? "اختر" : "Select")}
                                  </Button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {selectedVariation && (
                    <div className="mt-3 p-3 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/10">
                      <p className="text-xs text-muted-foreground">
                        {app.lang === "ar" ? "✅ التركيبة المختارة:" : "✅ Selected variation:"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {Object.entries(selectedVariation.combination || {}).map(([key, value]) => (
                          <Badge key={key} className="bg-[#0d2e2a]/10 text-[#0d2e2a] border-0 text-[10px]">
                            {translateOptionType(key, app.lang)}: {value as string}
                          </Badge>
                        ))}
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px]">
                          ✅ {app.lang === "ar" ? "متوفر" : "Available"}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== الوصف ===== */}
              {listing.description_ar && (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-[#0d2e2a]" />
                    {app.lang === "ar" ? "الوصف" : "Description"}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed bg-muted/30 p-4 rounded-xl border border-border/30">
                    {app.lang === "ar" ? listing.description_ar : (listing.description_en || listing.description_ar)}
                  </p>
                </div>
              )}

              {/* ===== حالة التوفر ===== */}
              <div className="flex items-center gap-2 p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  listing.is_available ? "bg-emerald-500" : "bg-red-500"
                )} />
                <span className="text-sm font-medium">
                  {listing.is_available
                    ? (app.lang === "ar" ? "✅ متوفر للبيع" : "✅ Available for sale")
                    : (app.lang === "ar" ? "❌ غير متوفر" : "❌ Unavailable")}
                </span>
              </div>

              {/* ===== الكمية ===== */}
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

              {/* ===== ✅ أزرار الشراء - مع حالة السلة ===== */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className={cn(
                    "w-full h-14 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-lg font-bold",
                    isInCart 
                      ? "bg-emerald-600 hover:bg-emerald-700" 
                      : "bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a]"
                  )}
                  onClick={handleAddToCart}
                  disabled={!listing.is_available || addToCartMutation.isPending}
                >
                  {addToCartMutation.isPending ? (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      {app.lang === "ar" ? "جاري الإضافة..." : "Adding..."}
                    </div>
                  ) : isInCart ? (
                    <>
                      <CheckCircle className="h-5 w-5 me-3" />
                      {app.lang === "ar" ? "✅ موجود في السلة" : "✅ In Cart"}
                      {cartItemCount > 0 && (
                        <Badge className="bg-white/20 text-white border-0 ms-3">
                          {cartItemCount}
                        </Badge>
                      )}
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 me-3" />
                      {app.lang === "ar" ? "أضف للسلة" : "Add to Cart"}
                      <Badge className="bg-white/20 text-white border-0 ms-3">
                        {quantity}
                      </Badge>
                    </>
                  )}
                </Button>
                
                <div className="flex gap-3">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className={cn(
                      "flex-1 h-12 rounded-2xl border-2 transition text-base font-semibold",
                      isFavorite 
                        ? "border-rose-500 bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30" 
                        : "hover:bg-[#0d2e2a]/5 border-[#0d2e2a]/30"
                    )}
                    onClick={handleToggleFavorite}
                    disabled={toggleFavoriteMutation.isPending}
                  >
                    <Heart className={cn(
                      "h-5 w-5 me-2",
                      isFavorite ? "fill-rose-500 text-rose-500" : "",
                      toggleFavoriteMutation.isPending && "animate-pulse"
                    )} />
                    {toggleFavoriteMutation.isPending
                      ? (app.lang === "ar" ? "جاري..." : "Loading...")
                      : isFavorite 
                        ? (app.lang === "ar" ? "تمت الإضافة" : "Added") 
                        : (app.lang === "ar" ? "أضف للمفضلة" : "Add to favorites")
                    }
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-12 w-12 rounded-2xl border-2 hover:bg-[#0d2e2a]/5 transition p-0 border-[#0d2e2a]/30"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5 text-[#0d2e2a]" />
                  </Button>
                </div>
                
                {/* ✅ زر الحجز */}
                {allowsBookings && (
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    className="w-full h-14 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all text-lg font-bold hover:scale-[1.02] active:scale-[0.98]"
                    onClick={() => setIsBookingModalOpen(true)}
                    disabled={!listing.is_available}
                  >
                    <CalendarDays className="h-5 w-5 me-3" />
                    {app.lang === "ar" ? "احجز الآن" : "Book Now"}
                    <Badge className="bg-white/20 text-white border-0 ms-3">
                      {app.lang === "ar" ? "متوفر" : "Available"}
                    </Badge>
                  </Button>
                )}
              </div>

              {/* ===== مميزات إضافية ===== */}
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

          {/* ===== تقييمات العملاء (نفسه) ===== */}
          {reviews.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {app.lang === "ar" ? "تقييمات العملاء" : "Customer Reviews"}
                  </h2>
                  <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border-0 text-sm px-3 py-1">
                    {reviews.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="text-[#0d2e2a] hover:text-[#1a4f4a] font-medium">
                  {app.lang === "ar" ? "عرض الكل" : "View All"} 
                  <ArrowRight className="h-4 w-4 ms-1 rtl:rotate-180" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="p-5 rounded-2xl bg-card border border-border/30 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#0d2e2a]/20 to-[#0d2e2a]/10 flex items-center justify-center font-bold text-[#0d2e2a] text-lg flex-shrink-0">
                        {review.profile?.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{review.profile?.full_name || (app.lang === "ar" ? "مستخدم" : "User")}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={cn(
                                "h-4 w-4",
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"
                              )} />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString(
                              app.lang === "ar" ? "ar-SY" : "en-US",
                              { day: 'numeric', month: 'short', year: 'numeric' }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    {review.comment && (
                      <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                        {review.comment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== منتجات مشابهة (نفسه) ===== */}
          {similarListings.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-[#0d2e2a]" />
                  {app.lang === "ar" ? "منتجات مشابهة" : "Similar Products"}
                </h2>
                <Link to="/category/$slug" params={{ slug: listing.categories?.slug || "all" }} className="text-sm text-[#0d2e2a] hover:underline font-medium">
                  {app.lang === "ar" ? "عرض الكل" : "View All"} <ArrowRight className="h-4 w-4 inline" />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {similarListings.slice(0, 4).map((item) => (
                  <Link key={item.id} to="/listing/$id" params={{ id: item.id }} className="group">
                    <div className="rounded-2xl overflow-hidden bg-card border border-border/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                      <div className="aspect-square overflow-hidden bg-muted/30 relative">
                        {item.cover_url ? (
                          <img 
                            src={item.cover_url} 
                            alt={item.title_ar} 
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                        {item.is_offer && item.discount_percent && (
                          <Badge className="absolute top-3 start-3 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-xs px-2 py-1">
                            -{item.discount_percent}%
                          </Badge>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-[#0d2e2a] transition">
                          {app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar)}
                        </h4>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-bold text-[#0d2e2a]">
                            {formatPrice(Number(item.price), app.currency, app.lang)}
                          </span>
                          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                            {Number(item.rating).toFixed(1)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===== مودال الحجز ===== */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          listing={listing}
          storeName={storeName}
          onConfirm={handleBookingConfirm}
          isLoading={isBookingLoading}
        />

        {/* ===== مودال تعارض المتجر ===== */}
        <Dialog open={showStoreConflict} onOpenChange={setShowStoreConflict}>
          <DialogContent className="max-w-md rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl text-[#0d2e2a]">
                <ShoppingBag className="h-6 w-6 text-amber-500" />
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