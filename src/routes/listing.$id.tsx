import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Star, MapPin, Heart, ShoppingBag, MessageCircle, Phone, Share2,
  ChevronLeft, ChevronRight, Store, Truck, Shield, Clock, Award,
  BadgePercent, Package, ArrowRight, Sparkles, CalendarDays,
  Minus, Plus, X, Check, CreditCard, Wallet, Send, Palette, Ruler, Layers,
  ShoppingCart
} from "lucide-react";
// src/routes/listing/$id.tsx
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

export const Route = createFileRoute("/listing/$id")({
  component: ListingDetailPage,
  head: () => ({ meta: [{ title: "تفاصيل المنتج — السوق لعندك" }] }),
});

// ✅ Skeleton للتحميل (خارج المكون)
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
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<any | null>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  // ✅ State للصورة الرئيسية (تتغير عند اختيار لون)
  const [mainImage, setMainImage] = useState<string>("");
  
  // ✅ State للحجز
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  
  const { data: listing, isLoading } = useListing(id);
  const { data: reviews = [] } = useListingReviews(id);
  const { data: similarListings = [] } = useSimilarListings(
    listing?.category_id,
    listing?.id,
    4
  );
  // ✅ Mutation لإضافة/إزالة المفضلة
const toggleFavoriteMutation = useToggleFavorite();
  
  
  const isFavorite = listing ? app.favorites.includes(listing.id) : false;
  
  // ✅ جلب الصور من listing_images
  const images = listing?.listing_images?.map((img: any) => img.url) || [];
  if (listing?.cover_url) images.unshift(listing.cover_url);
  
  // ✅ استخراج الألوان من product_colors
  const colors = (listing as any)?.colors || [];
  
  // ✅ استخراج المقاسات من metadata.options.sizes
  const sizes = (listing as any)?.metadata?.options?.sizes || [];
  
  // ✅ استخراج التركيبات من metadata.variations
  const variations = (listing as any)?.metadata?.variations || [];
  
  // ✅ حساب التقييم
  const avgRating = (listing as any)?.avg_rating || listing?.rating || 0;
  const reviewsCount = (listing as any)?.reviews_count || reviews.length || 0;
  
  // ✅ اسم المتجر
  const storeName = (listing as any)?.profiles?.store_name || 
                    (listing as any)?.owner?.store_name || 
                    (listing as any)?.profiles?.full_name || 
                    (listing as any)?.owner?.full_name || 
                    "متجر";
  
  // ✅ التحقق من تفعيل الحجز
  const allowsBookings = (listing as any)?.profiles?.allows_bookings || 
                         (listing as any)?.owner?.allows_bookings || 
                         false;

  
  // ✅ تهيئة الصورة الرئيسية
  useEffect(() => {
    if (listing?.cover_url) {
      setMainImage(listing.cover_url);
    } else if (images.length > 0) {
      setMainImage(images[0]);
    }
  }, [listing, images]);

  // ✅ اختيار لون مع تغيير الصورة
  const handleColorSelect = (colorName: string, colorImage?: string) => {
    // ✅ إذا كان نفس اللون المختار، ألغِ الاختيار
    if (selectedColor === colorName) {
      setSelectedColor(null);
      setMainImage(listing?.cover_url || images[0] || "");
      setSelectedVariation(null);
      return;
    }
    
    setSelectedColor(colorName);
    setSelectedVariation(null);
    
    // ✅ تغيير الصورة إلى صورة اللون المختار
    if (colorImage) {
      setMainImage(colorImage);
    } else {
      // ✅ البحث عن صورة اللون في product_colors
      const color = colors.find((c: any) => c.color_name_ar === colorName);
      if (color?.image_url) {
        setMainImage(color.image_url);
      } else {
        setMainImage(listing?.cover_url || images[0] || "");
      }
    }
  };

  // ✅ اختيار مقاس
  const handleSizeSelect = (size: string) => {
    setSelectedSize(selectedSize === size ? null : size);
    setSelectedVariation(null);
  };

  // ✅ اختيار تركيبة
  const handleVariationSelect = (variation: any) => {
    setSelectedVariation(selectedVariation?.id === variation.id ? null : variation);
    if (variation.combination.color) {
      setSelectedColor(variation.combination.color);
      // ✅ تحديث الصورة عند اختيار تركيبة فيها لون
      const color = colors.find((c: any) => c.color_name_ar === variation.combination.color);
      if (color?.image_url) {
        setMainImage(color.image_url);
      }
    }
    if (variation.combination.size) {
      setSelectedSize(variation.combination.size);
    }
  };

  // ✅ إضافة للسلة مع التركيبة المختارة
  const handleAddToCart = () => {
    if (!listing) return;
    
    const cartItem = {
      ...listing,
      quantity: quantity,
      selectedColor: selectedColor,
      selectedSize: selectedSize,
      selectedVariation: selectedVariation,
    };
    
    app.addToCart(cartItem);
    
    let details = [];
    if (selectedColor) details.push(`اللون: ${selectedColor}`);
    if (selectedSize) details.push(`المقاس: ${selectedSize}`);
    if (selectedVariation) {
      const combo = Object.values(selectedVariation.combination).join(' • ');
      details.push(`التركيبة: ${combo}`);
    }
    
    const detailsText = details.length > 0 ? ` (${details.join(', ')})` : '';
    
    toast.success(
      app.lang === "ar" 
        ? `تم إضافة المنتج للسلة 🛒${detailsText}` 
        : `Product added to cart 🛒${detailsText}`,
      { icon: "🛒" }
    );
  };

  // ✅ مشاركة المنتج
  const handleShare = async () => {
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
  };

  // ✅ التنقل بين الصور
  const nextImage = () => {
    if (selectedColor) {
      // ✅ إذا كان هناك لون مختار، نعرض صورة اللون بدلاً من الصور العادية
      const color = colors.find((c: any) => c.color_name_ar === selectedColor);
      if (color?.image_url) {
        setMainImage(color.image_url);
        return;
      }
    }
    setActiveImage((prev) => (prev + 1) % images.length);
  };
  
  const prevImage = () => {
    if (selectedColor) {
      const color = colors.find((c: any) => c.color_name_ar === selectedColor);
      if (color?.image_url) {
        setMainImage(color.image_url);
        return;
      }
    }
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  // ✅ التحقق من توفر التركيبة
  const isVariationAvailable = (variation: any) => {
    return variation.is_active !== false;
  };

  // ✅ التحقق من تطابق التركيبة مع الاختيارات
  const isVariationMatching = (variation: any) => {
    if (!selectedColor && !selectedSize) return false;
    const combo = variation.combination;
    if (selectedColor && combo.color !== selectedColor) return false;
    if (selectedSize && combo.size !== selectedSize) return false;
    return true;
  };

  // ✅ تصفية التركيبات المتوفرة بناءً على الاختيارات
  const filteredVariations = useMemo(() => {
    if (!selectedColor && !selectedSize) return variations.filter(v => isVariationAvailable(v));
    return variations.filter(v => {
      if (!isVariationAvailable(v)) return false;
      if (selectedColor && v.combination.color !== selectedColor) return false;
      if (selectedSize && v.combination.size !== selectedSize) return false;
      return true;
    });
  }, [variations, selectedColor, selectedSize]);

  // ✅ دالة تأكيد الحجز
// src/routes/listing/$id.tsx

const handleBookingConfirm = async (bookingData: any) => {
  if (!app.user) {
    toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
    navigate({ to: "/login" });
    return;
  }

  setIsBookingLoading(true);
  try {
    // ✅ 1. إنشاء الحجز
    const result = await createBooking({
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

    // ✅ 2. إرسال إشعار لصاحب المتجر
    await supabase
      .from('notifications')
      .insert({
        recipient_id: listing.owner_id,
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
      });

    // ✅ 3. إرسال إشعار تأكيد للعميل
    await supabase
      .from('notifications')
      .insert({
        recipient_id: app.user.id,
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
      });

    // ✅ 4. إشعار Toast للعميل
    toast.success(
      app.lang === "ar" 
        ? "✅ تم إرسال طلب الحجز بنجاح! في انتظار تأكيد المتجر." 
        : "✅ Booking request sent successfully! Waiting for store confirmation.",
      { duration: 5000 }
    );

    setIsBookingModalOpen(false);
    navigate({ to: "/bookings" });

  } catch (error: any) {
    console.error("Booking error:", error);
    toast.error(
      app.lang === "ar" 
        ? "❌ حدث خطأ أثناء الحجز، حاول مرة أخرى" 
        : "❌ An error occurred, please try again"
    );
  } finally {
    setIsBookingLoading(false);
  }
};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // ✅ إذا كان في حالة تحميل، اعرض Skeleton
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // ✅ إذا المنتج غير موجود
  if (!listing) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold">المنتج غير موجود</h2>
          <p className="text-muted-foreground mt-2">قد يكون تم حذفه أو نقله</p>
          <Button className="mt-6" onClick={() => navigate({ to: "/" })}>
            العودة للرئيسية
          </Button>
        </div>
      </div>
    );
  }

  // ✅ لف المحتوى بـ ClientOnly لحل مشكلة SSR
  return (
    <ClientOnly fallback={<LoadingSkeleton />}>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-6">
          {/* ===== Breadcrumb ===== */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link to="/" className="hover:text-primary transition-colors">الرئيسية</Link>
            <ChevronLeft className="h-4 w-4" />
            <Link to="/category/$slug" params={{ slug: listing.categories?.slug || "all" }} className="hover:text-primary transition-colors">
              {listing.categories ? (app.lang === "ar" ? listing.categories.name_ar : listing.categories.name_en) : "المنتجات"}
            </Link>
            <ChevronLeft className="h-4 w-4" />
            <span className="text-foreground font-medium line-clamp-1">{listing.title_ar}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-10">
            
            {/* ============================================================ */}
            {/* ===== LEFT - قسم الصور (مثل نون 100%) ===== */}
            {/* ============================================================ */}
            <div className="space-y-4">
              <div 
                className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 to-primary/10 border border-border/30 shadow-xl cursor-zoom-in"
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {/* ✅ الصورة الرئيسية (تتغير عند اختيار لون) */}
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
                
                {/* ✅ أزرار التنقل مثل نون */}
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
                
                {/* ✅ عداد الصور مثل نون */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur px-4 py-1.5 rounded-full text-white text-xs font-medium">
                    {activeImage + 1} / {images.length}
                  </div>
                )}
                
                {/* ✅ الشارات (عرض، pending، غير متوفر) */}
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
              
              {/* ✅ صور مصغرة مثل نون */}
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

            {/* ============================================================ */}
            {/* ===== RIGHT - معلومات المنتج (مثل نون 100%) ===== */}
            {/* ============================================================ */}
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
                  <span>{listing.governorates ? (app.lang === "ar" ? listing.governorates.name_ar : listing.governorates.name_en) : "جميع المحافظات"}</span>
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
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
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

              {/* ===== السعر - مثل نون تماماً ===== */}
              <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
                <div className="flex flex-col gap-3">
                  
                  {/* ✅ السعر القديم (إذا كان عرض) - مشطوب وباللون الأحمر */}
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
                  
                  {/* ✅ السعر الحالي - كبير وواضح */}
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

              {/* ===== ✅ الألوان (مثل نون - تغير الصورة) ===== */}
              {colors && colors.length > 0 && (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-medium text-muted-foreground">
                      {app.lang === "ar" ? "اللون" : "Color"}
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
                            ? "border-primary ring-2 ring-primary/30 scale-110" 
                            : "border-slate-200/50 hover:border-primary/50 group-hover:scale-105"
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
                            <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                              <div className="h-6 w-6 rounded-full bg-primary/80 backdrop-blur flex items-center justify-center">
                                <Check className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          )}
                        </div>
                        <span className={cn(
                          "text-[10px] transition-colors font-medium",
                          selectedColor === color.color_name_ar ? "text-primary" : "text-muted-foreground"
                        )}>
                          {color.color_name_ar}
                        </span>
                      </div>
                    ))}
                  </div>
                  {/* ✅ عرض اللون المختار مع الصورة */}
                  {selectedColor && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3">
                      <img 
                        src={mainImage} 
                        alt={selectedColor}
                        className="h-12 w-12 rounded-lg object-cover border border-slate-200/50"
                      />
                      <div>
                        <p className="text-sm font-medium">
                          {app.lang === "ar" ? "اللون المختار:" : "Selected color:"}
                        </p>
                        <p className="text-sm text-muted-foreground">{selectedColor}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== ✅ المقاسات (مثل نون) ===== */}
              {sizes && sizes.length > 0 && (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    {app.lang === "ar" ? "المقاس" : "Size"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size: string) => (
                      <button
                        key={size}
                        onClick={() => handleSizeSelect(size)}
                        className={cn(
                          "px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all",
                          selectedSize === size
                            ? "border-primary bg-primary/5 text-primary shadow-sm"
                            : "border-slate-200/50 hover:border-primary/50 hover:bg-primary/5"
                        )}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* ===== ✅ التركيبات (مثل نون مع اختيار) ===== */}
              {variations && variations.length > 0 && (
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <p className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-3">
                    <Layers className="h-4 w-4" />
                    {app.lang === "ar" ? "التركيبات المتوفرة" : "Available Variations"}
                    {filteredVariations.length > 0 && (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                        {filteredVariations.length} {app.lang === "ar" ? "متوفرة" : "available"}
                      </Badge>
                    )}
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {variations.map((v: any) => {
                      const isAvailable = isVariationAvailable(v);
                      const isSelected = selectedVariation?.id === v.id;
                      const isMatching = isVariationMatching(v);
                      
                      const comboDisplay = Object.entries(v.combination).map(([key, value]) => ({
                        label: translateOptionType(key, app.lang),
                        value: value
                      }));
                      
                      return (
                        <button
                          key={v.id}
                          onClick={() => isAvailable && handleVariationSelect(v)}
                          disabled={!isAvailable}
                          className={cn(
                            "relative p-3 rounded-xl border-2 transition-all text-sm text-center",
                            isAvailable ? "cursor-pointer" : "cursor-not-allowed opacity-50",
                            isSelected && isAvailable
                              ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                              : isMatching && isAvailable
                                ? "border-emerald-400/50 bg-emerald-50/30 dark:bg-emerald-950/10 hover:border-emerald-500"
                                : "border-slate-200/50 dark:border-slate-800/50 hover:border-primary/30 hover:bg-primary/5",
                            !isAvailable && "line-through"
                          )}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-xs font-medium">
                              {comboDisplay.map((item, idx) => (
                                <span key={idx}>
                                  {idx > 0 && <span className="text-muted-foreground/50 mx-0.5">•</span>}
                                  <span>{item.value}</span>
                                </span>
                              ))}
                            </span>
                            {isAvailable ? (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                                <Check className="h-3 w-3" />
                                {app.lang === "ar" ? "متوفر" : "Available"}
                              </span>
                            ) : (
                              <span className="text-[10px] text-red-500 flex items-center gap-0.5">
                                <X className="h-3 w-3" />
                                {app.lang === "ar" ? "غير متوفر" : "Unavailable"}
                              </span>
                            )}
                          </div>
                          {isSelected && isAvailable && (
                            <div className="absolute -top-1 -right-1">
                              <Badge className="bg-primary text-white border-0 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                                <Check className="h-3 w-3" />
                              </Badge>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {selectedVariation && (
                    <div className="mt-3 p-3 bg-primary/5 rounded-xl border border-primary/10">
                      <p className="text-xs text-muted-foreground">
                        {app.lang === "ar" ? "التركيبة المختارة:" : "Selected variation:"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {Object.entries(selectedVariation.combination).map(([key, value]) => (
                          <Badge key={key} className="bg-primary/10 text-primary border-0">
                            {translateOptionType(key, app.lang)}: {value as string}
                          </Badge>
                        ))}
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0">
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
                    <Sparkles className="h-5 w-5 text-primary" />
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
                <div className="flex items-center border-2 rounded-2xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-12 w-12 flex items-center justify-center hover:bg-muted transition text-lg font-bold"
                  >
                    <Minus className="h-5 w-5" />
                  </button>
                  <span className="w-16 text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-12 w-12 flex items-center justify-center hover:bg-muted transition text-lg font-bold"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* ===== أزرار الشراء مثل نون ===== */}
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-[0.98] text-lg font-bold"
                  onClick={handleAddToCart}
                  disabled={!listing.is_available}
                >
                  <ShoppingBag className="h-5 w-5 me-3" />
                  {app.lang === "ar" ? "أضف للسلة" : "Add to Cart"}
                  <Badge className="bg-white/20 text-white border-0 ms-3">
                    {quantity}
                  </Badge>
                </Button>
                
                <div className="flex gap-3">
                  <Button 
  size="lg" 
  variant="outline" 
  className={cn(
    "flex-1 h-12 rounded-2xl border-2 transition text-base font-semibold",
    isFavorite 
      ? "border-rose-500 bg-rose-50 text-rose-500 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30" 
      : "hover:bg-primary/5"
  )}
  onClick={async () => {
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }
    
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
      toast.error(app.lang === "ar" ? "حدث خطأ" : "An error occurred");
    }
  }}
  disabled={toggleFavoriteMutation.isPending}  // ✅ أضف هذا
>
  <Heart className={cn(
    "h-5 w-5 me-2",
    isFavorite ? "fill-rose-500 text-rose-500" : "",
    toggleFavoriteMutation.isPending && "animate-pulse"  // ✅ أضف هذا
  )} />
  {toggleFavoriteMutation.isPending   // ✅ أضف هذا
    ? (app.lang === "ar" ? "جاري..." : "Loading...")
    : isFavorite 
      ? (app.lang === "ar" ? "تمت الإضافة" : "Added") 
      : (app.lang === "ar" ? "أضف للمفضلة" : "Add to favorites")
  }
</Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="h-12 w-12 rounded-2xl border-2 hover:bg-primary/5 transition p-0"
                    onClick={handleShare}
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* ✅ زر الحجز مثل نون */}
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
                    <item.icon className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================================ */}
          {/* ===== تقييمات العملاء ===== */}
          {/* ============================================================ */}
          {reviews.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">
                    {app.lang === "ar" ? "تقييمات العملاء" : "Customer Reviews"}
                  </h2>
                  <Badge className="bg-primary/10 text-primary border-0 text-sm px-3 py-1">
                    {reviews.length}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 font-medium">
                  {app.lang === "ar" ? "عرض الكل" : "View All"} 
                  <ArrowRight className="h-4 w-4 ms-1 rtl:rotate-180" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review) => (
                  <div key={review.id} className="p-5 rounded-2xl bg-card border border-border/30 shadow-sm hover:shadow-md transition">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center font-bold text-primary text-lg flex-shrink-0">
                        {review.profile?.full_name?.charAt(0) || "U"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold">{review.profile?.full_name || "مستخدم"}</div>
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

          {/* ============================================================ */}
          {/* ===== منتجات مشابهة ===== */}
          {/* ============================================================ */}
          {similarListings.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-primary" />
                  {app.lang === "ar" ? "منتجات مشابهة" : "Similar Products"}
                </h2>
                <Link to="/category/$slug" params={{ slug: listing.categories?.slug || "all" }} className="text-sm text-primary hover:underline font-medium">
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
                        <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition">
                          {app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar)}
                        </h4>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
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

        {/* ============================================================ */}
        {/* ===== مودال الحجز ===== */}
        {/* ============================================================ */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={() => setIsBookingModalOpen(false)}
          listing={listing}
          storeName={storeName}
          onConfirm={handleBookingConfirm}
          isLoading={isBookingLoading}
        />
      </div>
    </ClientOnly>
  );
}