import { Link } from "@tanstack/react-router";
import { Star, MapPin, Heart, ImageIcon, ShoppingCart, Store, Eye, BadgePercent, Sparkles } from "lucide-react";
import { useApp, formatPrice, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ListingWithRelations } from "@/lib/queries";
import { toast } from "sonner";

export function ListingCard({ item, variant = "grid" }: { item: ListingWithRelations; variant?: "grid" | "list" }) {
  const app = useApp();
  const t = useT();
  const fav = app.favorites.includes(item.id);
  const title = app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar);
  const gov = item.governorates ? (app.lang === "ar" ? item.governorates.name_ar : item.governorates.name_en) : "";
  const cat = item.categories ? (app.lang === "ar" ? item.categories.name_ar : item.categories.name_en) : "";
  const cover = item.cover_url || item.listing_images?.[0]?.url;
  
  // ✅ اسم المتجر من الداتا بيز
  const storeName = (item as any).profiles?.store_name || 
                    (item as any).owner?.store_name || 
                    (item as any).profiles?.full_name || 
                    (item as any).owner?.full_name || 
                    "";
  
  // ✅ حساب السعر بالدولار من الداتا بيز
  const priceInUSD = item.price_usd || (Number(item.price) / 14500);
  
  // ✅ هل هو عرض؟ (من الداتا بيز)
  const isOffer = item.is_offer === true;
  const discountPercent = item.discount_percent || 0;
  const oldPrice = item.old_price ? Number(item.old_price) : null;
  const oldPriceUSD = item.old_price_usd || (oldPrice ? (oldPrice / 14500) : null);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!item || !item.id) {
      toast.error("المنتج غير موجود");
      return;
    }
    
    if (typeof app.addToCart !== 'function') {
      toast.error("حدث خطأ في السلة");
      return;
    }
    
    app.addToCart(item);
    toast.success(app.lang === "ar" ? "تم إضافة المنتج للسلة 🛒" : "Product added to cart 🛒");
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    app.toggleFavorite(item.id);
  };

  // ✅ عرض على شكل Grid (شبكة) - تصميم احترافي مثل نون
  if (variant === "grid") {
    return (
      <div className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-2xl hover:shadow-[#2a655f]/15 transition-all duration-500 hover:-translate-y-2 border-2 border-[#2a655f]/20 hover:border-[#2a655f]/60">
        <Link to="/listing/$id" params={{ id: item.id }}>
          {/* الصورة */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#2a655f]/5 to-[#2a655f]/10">
            {cover ? (
              <img
                src={cover}
                alt={title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="h-full w-full grid place-items-center">
                <ImageIcon className="h-12 w-12 text-[#2a655f]/30" />
              </div>
            )}
            
            {/* Overlay داكن عند التمرير */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* ✅ عرض نسبة الخصم - تصميم احترافي */}
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
            
            {/* ✅ اسم المتجر */}
            {storeName && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white/95 z-10 group-hover:bg-black/80 transition-all duration-300">
                <Store className="h-3 w-3" />
                <span className="line-clamp-1 max-w-[120px]">{storeName}</span>
              </div>
            )}
            
            {/* التقييم */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white z-10 group-hover:bg-black/80 transition-all duration-300">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {Number(item.rating).toFixed(1)}
            </div>
            
            {/* زر إضافة للسلة */}
            <button
              onClick={handleAddToCart}
              className="absolute bottom-3 right-3 h-10 w-10 rounded-full bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/30 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl opacity-0 group-hover:opacity-100 z-10"
            >
              <ShoppingCart className="h-4.5 w-4.5" />
            </button>
            
            {/* زر المفضلة */}
            <button
              onClick={handleToggleFavorite}
              className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-rose-500 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
            >
              <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
            </button>
            
            {/* ✅ عرض "عرض" على الصورة */}
            {isOffer && (
              <div className="absolute top-16 right-3 z-20">
                <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                  <Sparkles className="h-3 w-3" />
                  <span>عرض</span>
                </div>
              </div>
            )}
          </div>
          
          {/* المعلومات */}
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
            
            {/* ✅ عرض الأسعار بشكل احترافي */}
            <div className="mt-3">
              {isOffer && oldPrice ? (
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
                      {formatPrice(Number(item.price), app.currency, app.lang)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      وفر {discountPercent}%
                    </span>
                  </div>
                  
                  <div className="text-xs font-medium text-muted-foreground/80 bg-muted/30 px-2 py-0.5 rounded inline-block">
                    ≈ {priceInUSD.toFixed(2)} USD
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <span className="text-xl font-black text-[#2a655f]">
                    {formatPrice(Number(item.price), app.currency, app.lang)}
                  </span>
                  <div className="text-xs font-medium text-muted-foreground/80 bg-muted/30 px-2 py-0.5 rounded inline-block">
                    ≈ {priceInUSD.toFixed(2)} USD
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }

  // ✅ عرض على شكل List (قائمة) - تصميم احترافي
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card shadow-card hover:shadow-2xl hover:shadow-[#2a655f]/15 transition-all duration-500 hover:-translate-y-1 border-2 border-[#2a655f]/20 hover:border-[#2a655f]/60">
      {/* ✅ عرض نسبة الخصم */}
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
        {/* الصورة */}
        <div className="relative w-full sm:w-56 h-48 sm:h-auto shrink-0 overflow-hidden bg-gradient-to-br from-[#2a655f]/5 to-[#2a655f]/10">
          {cover ? (
            <img
              src={cover}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="h-full w-full grid place-items-center">
              <ImageIcon className="h-12 w-12 text-[#2a655f]/30" />
            </div>
          )}
          
          {/* Overlay داكن */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* زر المفضلة */}
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white text-rose-500 shadow-md flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 opacity-0 group-hover:opacity-100"
          >
            <Heart className={`h-4 w-4 transition-colors ${fav ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
          </button>
          
          {/* ✅ عرض "عرض" على الصورة */}
          {isOffer && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse">
                <Sparkles className="h-3 w-3" />
                <span>عرض حصري</span>
              </div>
            </div>
          )}
          
          {/* اسم المتجر */}
          {storeName && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white/95 z-10 group-hover:bg-black/80 transition-all duration-300">
              <Store className="h-3 w-3" />
              <span className="line-clamp-1 max-w-[120px]">{storeName}</span>
            </div>
          )}
        </div>
        
        {/* المعلومات */}
        <div className="flex-1 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                {Number(item.rating).toFixed(1)}
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
          
          {/* ✅ عرض الأسعار بشكل احترافي */}
          <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              {isOffer && oldPrice ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-red-500 line-through font-medium">
                      {formatPrice(oldPrice, app.currency, app.lang)}
                    </span>
                    <span className="text-[10px] text-red-400/70">
                      ≈ {oldPriceUSD?.toFixed(2)} USD
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-[#2a655f]">
                      {formatPrice(Number(item.price), app.currency, app.lang)}
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      وفر {discountPercent}%
                    </span>
                  </div>
                  
                  <div className="text-xs font-medium text-muted-foreground/80 bg-muted/30 px-2 py-0.5 rounded inline-block">
                    ≈ {priceInUSD.toFixed(2)} USD
                  </div>
                </>
              ) : (
                <>
                  <span className="text-2xl font-black text-[#2a655f]">
                    {formatPrice(Number(item.price), app.currency, app.lang)}
                  </span>
                  <div className="text-xs font-medium text-muted-foreground/80 bg-muted/30 px-2 py-0.5 rounded inline-block">
                    ≈ {priceInUSD.toFixed(2)} USD
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                className="h-9 px-4 rounded-full bg-[#2a655f] hover:bg-[#3a8a82] text-white font-medium text-sm flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-[#2a655f]/30 hover:scale-105"
              >
                <ShoppingCart className="h-3.5 w-3.5" />
                {t("add_to_cart")}
              </button>
              <Button 
                size="sm" 
                variant="outline" 
                className="h-9 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/60 transition-all duration-300 hover:scale-105"
              >
                {t("view")}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}