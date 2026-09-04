// src/components/dashboard/ProductCard.tsx - تصميم احترافي جديد

import { 
  Package, Gift, Clock, Edit2, Trash2, Eye, MoreVertical, 
  DollarSign, Layers, Star, CheckCircle2, Archive, FileText, RefreshCw,
  Sparkles, Zap, Tag, Percent, Plus, Minus, Calendar, X, ShoppingCart,
  Heart, Shield, Award, Rocket, Crown, Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";
import { OptimizedImage } from "@/components/OptimizedImage";

interface ProductCardProps {
  product: any;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  onConvertToOffer?: (product: any) => void;
  onRepublish?: (product: any) => void;
  onAddPromoOffer?: (product: any) => void;
  onEditPromoOffer?: (offer: any) => void;
  onRemovePromoOffer?: (offerId: string) => void;
  onViewPromoOffer?: (offer: any) => void;
  lang: string;
  currency: string;
  formatPrice: (price: number, currency: string, lang: string) => string;
  viewMode?: "grid" | "list";
}

export function ProductCard({ 
  product, 
  onEdit, 
  onDelete, 
  onView, 
  onConvertToOffer,
  onRepublish,
  onAddPromoOffer,
  onEditPromoOffer,
  onRemovePromoOffer,
  onViewPromoOffer,
  lang, 
  currency, 
  formatPrice, 
  viewMode = "grid" 
}: ProductCardProps) {
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [oldPrice, setOldPrice] = useState<number>(product.price || 0);
  const [isConverting, setIsConverting] = useState(false);

  const isOffer = product.is_offer;
  const status = product.status;
  const discount = product.discount_percent;
  const avgRating = product.avg_rating || product.rating || 0;
  const reviewsCount = product.reviews_count || 0;
  
  const hasPromoOffer = product.promo_offer !== null && product.promo_offer !== undefined;
  const promoOffer = product.promo_offer;
  const fullStars = Math.round(avgRating);

  const handleConvertToOffer = async () => {
    if (!oldPrice || oldPrice <= product.price) {
      toast.error(
        lang === "ar" 
          ? "⚠️ السعر القديم يجب أن يكون أكبر من السعر الحالي" 
          : "⚠️ Old price must be greater than current price"
      );
      return;
    }

    setIsConverting(true);
    try {
      const discountPercent = Math.round(((oldPrice - product.price) / oldPrice) * 100);
      
      const { error } = await supabase
        .from("listings")
        .update({
          is_offer: true,
          old_price: oldPrice,
          discount_percent: discountPercent,
          updated_at: new Date().toISOString(),
        })
        .eq("id", product.id);

      if (error) throw error;

      toast.success(
        lang === "ar" 
          ? `✅ تم تحويل المنتج إلى عرض بخصم ${discountPercent}%!` 
          : `✅ Product converted to offer with ${discountPercent}% discount!`
      );
      
      setShowConvertDialog(false);
      
      if (onConvertToOffer) {
        const updatedProduct = { 
          ...product, 
          is_offer: true, 
          old_price: oldPrice, 
          discount_percent: discountPercent 
        };
        onConvertToOffer(updatedProduct);
      }
      
    } catch (error) {
      console.error("❌ Error converting to offer:", error);
      toast.error(
        lang === "ar" 
          ? "❌ فشل تحويل المنتج إلى عرض" 
          : "❌ Failed to convert product to offer"
      );
    } finally {
      setIsConverting(false);
    }
  };

  const openConvertDialog = () => {
    if (onConvertToOffer) {
      onConvertToOffer(product);
    } else {
      setShowConvertDialog(true);
    }
  };

  const getStatusBadge = () => {
    const statusMap: Record<string, { color: string; icon: any; label: string; bg: string }> = {
      pending: { 
        color: "text-yellow-600 dark:text-yellow-400", 
        icon: Clock, 
        label: lang === "ar" ? "قيد المراجعة" : "Pending",
        bg: "bg-yellow-500/10 border-yellow-400/30"
      },
      published: { 
        color: "text-emerald-600 dark:text-emerald-400", 
        icon: CheckCircle2, 
        label: lang === "ar" ? "منشور" : "Published",
        bg: "bg-emerald-500/10 border-emerald-400/30"
      },
      archived: { 
        color: "text-slate-500 dark:text-slate-400", 
        icon: Archive, 
        label: lang === "ar" ? "مؤرشف" : "Archived",
        bg: "bg-slate-500/10 border-slate-400/30"
      },
      draft: { 
        color: "text-blue-600 dark:text-blue-400", 
        icon: FileText, 
        label: lang === "ar" ? "مسودة" : "Draft",
        bg: "bg-blue-500/10 border-blue-400/30"
      },
    };

    const info = statusMap[status] || statusMap.draft;
    const Icon = info.icon;

    return (
      <Badge className={cn(
        "border-2 shadow-lg rounded-full px-3 py-1 flex items-center gap-1 text-xs font-bold",
        info.bg,
        info.color
      )}>
        <Icon className="h-3 w-3" />
        {info.label}
      </Badge>
    );
  };

  const getPromoTypeLabel = (type: string) => {
    const types: Record<string, { label: string; icon: any; color: string }> = {
      bogo: { 
        label: lang === "ar" ? "اشتر 1 واحصل على 1" : "Buy 1 Get 1", 
        icon: Gift, 
        color: "text-purple-600" 
      },
      cross_sell: { 
        label: lang === "ar" ? "شراء منتج والحصول على آخر" : "Buy product get another", 
        icon: Tag, 
        color: "text-blue-600" 
      },
      bundle: { 
        label: lang === "ar" ? "باقة منتجات" : "Bundle", 
        icon: Package, 
        color: "text-orange-600" 
      },
    };
    return types[type] || types.bogo;
  };

  const renderPromoBadge = () => {
    if (!hasPromoOffer || !promoOffer) return null;
    
    const typeInfo = getPromoTypeLabel(promoOffer.offer_type);
    const Icon = typeInfo.icon;
    
    return (
      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
        <Badge 
          className="border-0 shadow-lg rounded-full px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-2 border-white/30"
        >
          <Sparkles className="h-2.5 w-2.5" />
          {lang === "ar" ? "عرض ترويجي" : "Promo"}
        </Badge>
        <Badge 
          variant="outline" 
          className="border-2 border-[#d81b60]/30 text-[#d81b60] dark:text-[#f9a8d4] text-[9px] rounded-full px-2 py-0 h-5 flex items-center gap-0.5 bg-[#d81b60]/10"
        >
          <Icon className="h-2.5 w-2.5" />
          {typeInfo.label}
        </Badge>
      </div>
    );
  };

  // ✅ VIEW MODE: LIST - تصميم جديد
  if (viewMode === "list") {
    return (
      <>
        <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border-3 border-[#d81b60]/40 hover:border-[#c2185b] shadow-[0_0_25px_rgba(216,27,96,0.1)] hover:shadow-[0_0_45px_rgba(194,24,91,0.2)] transition-all duration-400 hover:-translate-y-1.5 flex flex-col sm:flex-row min-h-[180px]">
          
          <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-[#2a655f]/10 to-[#f9a8d4]/10 dark:from-[#2a655f]/30 dark:to-[#f9a8d4]/20 relative overflow-hidden">
            {product.cover_url ? (
              <OptimizedImage
                src={product.cover_url}
                alt={product.title_ar}
                width={400}
                height={400}
                quality={85}
                objectFit="cover"
                className="h-full w-full transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Package className="h-16 w-16 text-[#2a655f]/20 dark:text-[#f9a8d4]/20 group-hover:scale-110 transition-transform" />
              </div>
            )}
            
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              {isOffer && discount && (
                <Badge className="bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-2 border-white/30 shadow-lg rounded-full px-2.5 py-0.5 text-xs font-bold animate-pulse">
                  -{discount}% 🎯
                </Badge>
              )}
              {getStatusBadge()}
              {hasPromoOffer && (
                <Badge className="bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-2 border-white/30 shadow-lg rounded-full px-2.5 py-0.5 text-[10px] flex items-center gap-1 animate-pulse">
                  <Sparkles className="h-2.5 w-2.5" />
                  {lang === "ar" ? "ترويجي" : "Promo"}
                </Badge>
              )}
            </div>
            
            {!product.is_available && (
              <Badge className="absolute bottom-2 right-2 bg-red-500/90 text-white border-2 border-white/30 shadow-lg rounded-full px-2.5 py-0.5 text-xs">
                ❌ {lang === "ar" ? "غير متوفر" : "Unavailable"}
              </Badge>
            )}
          </div>
          
          <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[180px]">
            <div className="flex-1 min-w-0">
              <div className="font-bold text-base line-clamp-1 group-hover:text-[#d81b60] dark:group-hover:text-[#f9a8d4] transition-colors">
                {product.title_ar}
              </div>
              
              {renderPromoBadge()}
              
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={cn(
                      "h-3.5 w-3.5 transition-all duration-300",
                      star <= fullStars ? "fill-[#f9a8d4] text-[#f9a8d4]" : "text-slate-300 dark:text-slate-600"
                    )} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({reviewsCount})</span>
              </div>
              
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={isOffer ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-2 border-white/30 rounded-full text-[10px] font-bold" : "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white border-2 border-white/30 rounded-full text-[10px] font-bold"}>
                  {isOffer ? <Percent className="h-3 w-3 mr-1" /> : <Package className="h-3 w-3 mr-1" />}
                  {isOffer ? (lang === "ar" ? "عرض تخفيض" : "Discount") : (lang === "ar" ? "منتج" : "Product")}
                </Badge>
                <span className={`inline-flex items-center gap-1 text-xs font-bold ${product.is_available ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${product.is_available ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                  {product.is_available ? (lang === "ar" ? "متوفر" : "Available") : (lang === "ar" ? "غير متوفر" : "Unavailable")}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <span className="text-lg font-bold text-[#2a655f] dark:text-[#3a8a82] group-hover:text-[#d81b60] transition-colors">
                  {formatPrice(Number(product.price), currency, lang)}
                </span>
                {product.old_price && product.old_price > product.price && (
                  <span className="text-xs text-red-500 line-through font-medium">
                    {formatPrice(Number(product.old_price), currency, lang)}
                  </span>
                )}
              </div>
              
              {product.colors && product.colors.length > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  <div className="flex -space-x-1">
                    {product.colors.slice(0, 4).map((color: any) => (
                      <div 
                        key={color.id} 
                        className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden ring-2 ring-[#f9a8d4]/30 group-hover:ring-[#d81b60]/50 transition-all"
                      >
                        <OptimizedImage
                          src={color.image_url}
                          alt={color.color_name_ar}
                          width={40}
                          height={40}
                          quality={80}
                          objectFit="cover"
                          className="w-full h-full"
                        />
                      </div>
                    ))}
                  </div>
                  {product.colors.length > 4 && (
                    <span className="text-[10px] text-muted-foreground font-bold">
                      +{product.colors.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* ===== أزرار الإجراءات - تصميم جديد ===== */}
            <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
              <Button 
                size="sm" 
                className="rounded-xl text-xs h-8 px-3 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 hover:scale-105 transition-all duration-300 border-2 border-white/20"
                onClick={() => {
                  if (hasPromoOffer && onEditPromoOffer) {
                    onEditPromoOffer(promoOffer);
                  } else {
                    onEdit();
                  }
                }}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5 group-hover:rotate-12 transition-transform" />
                {hasPromoOffer 
                  ? (lang === "ar" ? "تعديل العرض" : "Edit Offer")
                  : (lang === "ar" ? "تعديل" : "Edit")
                }
              </Button>
              
              {status === "draft" && onRepublish && (
                <Button 
                  size="sm" 
                  className="rounded-xl text-xs h-8 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all duration-300 border-2 border-white/20"
                  onClick={() => onRepublish(product)}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 group-hover:rotate-180 transition-transform duration-500" />
                  {lang === "ar" ? "نشر" : "Publish"}
                </Button>
              )}
              
              {!hasPromoOffer && onAddPromoOffer && (
                <Button 
                  size="sm" 
                  className="rounded-xl text-xs h-8 px-3 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/25 hover:shadow-[#d81b60]/40 hover:scale-105 transition-all duration-300 border-2 border-white/20"
                  onClick={() => onAddPromoOffer(product)}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
                  {lang === "ar" ? "ترويج" : "Promo"}
                </Button>
              )}
              
              {!isOffer && !hasPromoOffer && (
                <Button 
                  size="sm" 
                  className="rounded-xl text-xs h-8 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 transition-all duration-300 border-2 border-white/20"
                  onClick={openConvertDialog}
                >
                  <Percent className="h-3.5 w-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
                  {lang === "ar" ? "تخفيض" : "Discount"}
                </Button>
              )}
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="rounded-xl h-8 w-8 p-0 text-red-500 hover:text-white hover:bg-red-500 hover:scale-110 transition-all duration-300 border-2 border-red-200/50 hover:border-red-500" 
                onClick={() => {
                  if (hasPromoOffer && onRemovePromoOffer) {
                    onRemovePromoOffer(promoOffer.id);
                  } else {
                    onDelete();
                  }
                }}
              >
                <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </div>
        </div>

        <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
          <DialogContent className="max-w-md rounded-2xl border-3 border-[#d81b60]/40 shadow-[0_0_35px_rgba(216,27,96,0.2)] bg-white dark:bg-slate-900 p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2 border-b-2 border-[#d81b60]/20">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 animate-pulse flex-shrink-0 border-2 border-white/30">
                  <Percent className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-[#2a655f] dark:text-[#f9a8d4]">
                    {lang === "ar" ? "🎁 تحويل المنتج لعرض تخفيض" : "🎁 Convert to Discount Offer"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground">
                    {lang === "ar" 
                      ? `تحويل "${product.title_ar}" إلى عرض تخفيض` 
                      : `Convert "${product.title_en || product.title_ar}" to a discount offer`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="p-4 bg-gradient-to-r from-[#2a655f]/5 to-[#f9a8d4]/5 dark:from-[#2a655f]/20 dark:to-[#f9a8d4]/20 rounded-xl border-2 border-[#2a655f]/20">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {lang === "ar" ? "المنتج" : "Product"}
                </p>
                <p className="text-lg font-bold text-slate-900 dark:text-white">
                  {product.title_ar}
                </p>
                <div className="flex items-center gap-4 mt-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? "السعر الحالي" : "Current Price"}
                    </p>
                    <p className="font-bold text-[#2a655f] dark:text-[#3a8a82]">
                      {formatPrice(Number(product.price), currency, lang)}
                    </p>
                  </div>
                  <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {lang === "ar" ? "الخصم المتوقع" : "Expected Discount"}
                    </p>
                    <p className="font-bold text-[#2a655f]">
                      {oldPrice > product.price 
                        ? `${Math.round(((oldPrice - product.price) / oldPrice) * 100)}%`
                        : '0%'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <DollarSign className="h-4 w-4 text-[#2a655f]" />
                  {lang === "ar" ? "السعر القديم" : "Old Price"}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-1.5">
                  <div className="absolute inset-y-0 start-3 flex items-center">
                    <span className="text-sm font-bold text-[#2a655f]/60">ل.س</span>
                  </div>
                  <Input
                    type="number"
                    min={product.price + 1}
                    value={oldPrice}
                    onChange={(e) => setOldPrice(Number(e.target.value))}
                    placeholder={lang === "ar" ? "أدخل السعر القديم..." : "Enter old price..."}
                    className="ps-12 h-12 rounded-xl border-2 border-[#2a655f]/20 focus:border-[#d81b60] focus:ring-2 focus:ring-[#d81b60]/20 transition-all duration-300 bg-white dark:bg-slate-900"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                  <span className="text-[#2a655f]">💡</span>
                  {lang === "ar" 
                    ? "السعر القديم يجب أن يكون أكبر من السعر الحالي" 
                    : "Old price must be greater than current price"}
                </p>
              </div>

              {oldPrice > product.price && (
                <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-5 duration-300">
                  <Badge className="bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white border-2 border-white/30 text-sm px-3 py-1.5 rounded-lg shadow-lg shadow-[#2a655f]/30">
                    🎯 {Math.round(((oldPrice - product.price) / oldPrice) * 100)}% {lang === "ar" ? "خصم" : "OFF"}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {lang === "ar" ? "العميل سيوفر" : "Customer saves"} 
                    <span className="font-bold text-emerald-600 mx-1">
                      {formatPrice(oldPrice - product.price, currency, lang)}
                    </span>
                  </span>
                </div>
              )}
            </div>

            <DialogFooter className="p-6 pt-2 border-t-2 border-[#d81b60]/20 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConvertDialog(false)}
                className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#d81b60]/50 transition-all duration-300"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleConvertToOffer}
                disabled={isConverting || oldPrice <= product.price}
                className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 border-2 border-white/20"
              >
                {isConverting ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {lang === "ar" ? "جاري التحويل..." : "Converting..."}
                  </span>
                ) : (
                  <>
                    <Percent className="h-4 w-4 mr-2" />
                    {lang === "ar" ? "تحويل لعرض تخفيض" : "Convert to Discount"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // ✅ VIEW MODE: GRID - تصميم جديد
  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border-3 border-[#d81b60]/40 hover:border-[#c2185b] shadow-[0_0_25px_rgba(216,27,96,0.1)] hover:shadow-[0_0_45px_rgba(194,24,91,0.25)] transition-all duration-400 hover:-translate-y-2 flex flex-col h-full min-h-[400px] max-h-[500px]">
        
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#2a655f]/0 via-[#f9a8d4]/0 to-[#2a655f]/0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:via-[#f9a8d4]/10" />
        
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-[#2a655f]/10 to-[#f9a8d4]/10 dark:from-[#2a655f]/30 dark:to-[#f9a8d4]/20 cursor-pointer flex-shrink-0">
          {product.cover_url ? (
            <OptimizedImage
              src={product.cover_url}
              alt={product.title_ar}
              width={400}
              height={400}
              quality={85}
              objectFit="cover"
              className="h-full w-full transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-20 w-20 text-[#2a655f]/20 dark:text-[#f9a8d4]/20 group-hover:text-[#2a655f]/30 transition-all duration-500" />
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOffer && (
              <Badge className="bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-2 border-white/30 shadow-lg rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                🔥 {lang === "ar" ? "تخفيض" : "Discount"}
                {discount && ` -${discount}%`}
              </Badge>
            )}
            
            {hasPromoOffer && (
              <Badge className="bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-2 border-white/30 shadow-lg rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Sparkles className="h-3 w-3" />
                {lang === "ar" ? "عرض ترويجي" : "Promo"}
              </Badge>
            )}
            
            {getStatusBadge()}
          </div>
          
          {!product.is_available && (
            <Badge className="absolute top-3 right-3 bg-red-500/90 text-white border-2 border-white/30 shadow-lg rounded-full px-3 py-1 text-xs animate-pulse">
              ❌ {lang === "ar" ? "غير متوفر" : "Unavailable"}
            </Badge>
          )}
          
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-2 border-[#2a655f]/20 shadow-lg rounded-full px-3 py-1 text-xs font-medium group-hover:border-[#d81b60]/50 transition-all duration-300">
              <Layers className="h-3 w-3 mr-1 text-[#2a655f] group-hover:text-[#d81b60] transition-colors" />
              {product.category_name || product.categories?.name_ar || ""}
            </Badge>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div 
              className="bg-white/95 dark:bg-slate-900/95 rounded-full p-3.5 shadow-2xl hover:scale-110 transition-transform border-3 border-[#2a655f]/30 hover:border-[#d81b60]/50 cursor-pointer group-hover:shadow-[#d81b60]/30"
              onClick={(e) => {
                e.stopPropagation();
                if (hasPromoOffer && onViewPromoOffer && promoOffer) {
                  onViewPromoOffer(promoOffer);
                } else {
                  onView();
                }
              }}
            >
              <Eye className="h-5 w-5 text-[#2a655f] group-hover:text-[#d81b60] transition-colors" />
            </div>
          </div>

          <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {!hasPromoOffer && onAddPromoOffer && (
              <Button
                size="sm"
                className="h-7 px-2 rounded-lg bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/30 hover:shadow-[#d81b60]/50 transition-all duration-300 hover:scale-105 border-2 border-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddPromoOffer(product);
                }}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                <span className="text-[9px] font-bold">
                  {lang === "ar" ? "ترويج" : "Promo"}
                </span>
              </Button>
            )}
            
            {!isOffer && !hasPromoOffer && (
              <Button
                size="sm"
                className="h-7 px-2 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50 transition-all duration-300 hover:scale-105 border-2 border-white/30"
                onClick={(e) => {
                  e.stopPropagation();
                  openConvertDialog();
                }}
              >
                <Percent className="h-3 w-3 mr-1" />
                <span className="text-[9px] font-bold">
                  {lang === "ar" ? "تخفيض" : "Discount"}
                </span>
              </Button>
            )}
          </div>
        </div>
        
        <div className="p-4 space-y-2.5 flex-1 flex flex-col">
          <div className="font-bold text-base line-clamp-1 group-hover:text-[#d81b60] dark:group-hover:text-[#f9a8d4] transition-colors duration-300">
            {product.title_ar}
          </div>
          
          {renderPromoBadge()}
          
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  star <= fullStars ? "fill-[#f9a8d4] text-[#f9a8d4]" : "text-slate-300 dark:text-slate-600"
                )} />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({reviewsCount})</span>
          </div>
          
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-1">
                {product.colors.slice(0, 4).map((color: any) => (
                  <div 
                    key={color.id} 
                    className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden ring-2 ring-[#f9a8d4]/30 group-hover:ring-[#d81b60]/50 transition-all duration-300"
                  >
                    <OptimizedImage
                      src={color.image_url}
                      alt={color.color_name_ar}
                      width={40}
                      height={40}
                      quality={80}
                      objectFit="cover"
                      className="w-full h-full group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
              {product.colors.length > 4 && (
                <span className="text-[10px] text-muted-foreground font-bold">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-end justify-between border-t-2 border-[#2a655f]/10 dark:border-[#2a655f]/20 pt-2.5 mt-auto">
            <div>
              <div className="text-xl font-bold text-[#2a655f] dark:text-[#3a8a82] group-hover:text-[#d81b60] transition-colors duration-300">
                {formatPrice(Number(product.price), currency, lang)}
              </div>
            </div>
            {product.old_price && product.old_price > product.price && (
              <div className="text-xs text-red-500 line-through font-medium">
                {formatPrice(Number(product.old_price), currency, lang)}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1.5">
            <span className={cn(
              "h-1.5 w-1.5 rounded-full transition-all duration-300",
              product.is_available ? 'bg-emerald-500 group-hover:scale-150 group-hover:shadow-[0_0_12px_rgba(16,185,129,0.6)]' : 'bg-red-500 group-hover:scale-150'
            )} />
            <span className={cn(
              "text-xs font-bold transition-colors duration-300",
              product.is_available ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
            )}>
              {product.is_available 
                ? (lang === "ar" ? "متوفر" : "Available") 
                : (lang === "ar" ? "غير متوفر" : "Unavailable")}
            </span>
          </div>
          
          {/* ===== أزرار الإجراءات - تصميم جديد ===== */}
          <div className="flex items-center gap-1 pt-2.5 border-t-2 border-[#2a655f]/10 dark:border-[#2a655f]/20 flex-wrap">
            <Button 
              size="sm" 
              className="flex-1 rounded-xl text-[10px] font-bold h-7 px-2 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-md shadow-[#2a655f]/20 hover:shadow-[#2a655f]/30 hover:scale-[1.02] transition-all duration-300 border-2 border-white/20 min-w-0"
              onClick={() => {
                if (hasPromoOffer && onEditPromoOffer) {
                  onEditPromoOffer(promoOffer);
                } else {
                  onEdit();
                }
              }}
            >
              <Edit2 className="h-3 w-3 mr-0.5 group-hover:rotate-12 transition-transform flex-shrink-0" />
              <span className="truncate text-[9px] sm:text-[10px]">
                {hasPromoOffer 
                  ? (lang === "ar" ? "تعديل العرض" : "Edit Offer")
                  : (lang === "ar" ? "تعديل" : "Edit")
                }
              </span>
            </Button>
            
            {status === "draft" && onRepublish && (
              <Button 
                size="sm" 
                className="rounded-xl text-[10px] font-bold h-7 px-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 hover:scale-[1.02] transition-all duration-300 border-2 border-white/20 flex-shrink-0"
                onClick={() => onRepublish(product)}
              >
                <RefreshCw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-500 flex-shrink-0" />
                <span className="hidden xs:inline text-[9px]">{lang === "ar" ? "نشر" : "Publish"}</span>
              </Button>
            )}
            
            {!hasPromoOffer && onAddPromoOffer && (
              <Button 
                size="sm" 
                className="rounded-xl text-[10px] font-bold h-7 px-2 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-md shadow-[#d81b60]/20 hover:shadow-[#d81b60]/30 hover:scale-[1.02] transition-all duration-300 border-2 border-white/20 flex-shrink-0"
                onClick={() => onAddPromoOffer(product)}
              >
                <Sparkles className="h-3 w-3 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="hidden xs:inline text-[9px]">{lang === "ar" ? "ترويج" : "Promo"}</span>
              </Button>
            )}
            
            {!isOffer && !hasPromoOffer && (
              <Button 
                size="sm" 
                className="rounded-xl text-[10px] font-bold h-7 px-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.02] transition-all duration-300 border-2 border-white/20 flex-shrink-0"
                onClick={openConvertDialog}
              >
                <Percent className="h-3 w-3 group-hover:scale-110 transition-transform flex-shrink-0" />
                <span className="hidden xs:inline text-[9px]">{lang === "ar" ? "تخفيض" : "Discount"}</span>
              </Button>
            )}
            
            <Button 
              size="sm" 
              variant="ghost" 
              className="rounded-xl h-7 w-7 p-0 text-red-500 hover:text-white hover:bg-red-500 hover:scale-110 transition-all duration-300 border-2 border-red-200/50 hover:border-red-500 flex-shrink-0" 
              onClick={() => {
                if (hasPromoOffer && onRemovePromoOffer) {
                  onRemovePromoOffer(promoOffer.id);
                } else {
                  onDelete();
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-md rounded-2xl border-3 border-[#d81b60]/40 shadow-[0_0_35px_rgba(216,27,96,0.2)] bg-white dark:bg-slate-900 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 border-b-2 border-[#d81b60]/20">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 animate-pulse flex-shrink-0 border-2 border-white/30">
                <Percent className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#2a655f] dark:text-[#f9a8d4]">
                  {lang === "ar" ? "🎁 تحويل المنتج لعرض تخفيض" : "🎁 Convert to Discount Offer"}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground">
                  {lang === "ar" 
                    ? `تحويل "${product.title_ar}" إلى عرض تخفيض` 
                    : `Convert "${product.title_en || product.title_ar}" to a discount offer`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-4">
            <div className="p-4 bg-gradient-to-r from-[#2a655f]/5 to-[#f9a8d4]/5 dark:from-[#2a655f]/20 dark:to-[#f9a8d4]/20 rounded-xl border-2 border-[#2a655f]/20">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {lang === "ar" ? "المنتج" : "Product"}
              </p>
              <p className="text-lg font-bold text-slate-900 dark:text-white">
                {product.title_ar}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar" ? "السعر الحالي" : "Current Price"}
                  </p>
                  <p className="font-bold text-[#2a655f] dark:text-[#3a8a82]">
                    {formatPrice(Number(product.price), currency, lang)}
                  </p>
                </div>
                <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    {lang === "ar" ? "الخصم المتوقع" : "Expected Discount"}
                  </p>
                  <p className="font-bold text-[#2a655f]">
                    {oldPrice > product.price 
                      ? `${Math.round(((oldPrice - product.price) / oldPrice) * 100)}%`
                      : '0%'}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <DollarSign className="h-4 w-4 text-[#2a655f]" />
                {lang === "ar" ? "السعر القديم" : "Old Price"}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1.5">
                <div className="absolute inset-y-0 start-3 flex items-center">
                  <span className="text-sm font-bold text-[#2a655f]/60">ل.س</span>
                </div>
                <Input
                  type="number"
                  min={product.price + 1}
                  value={oldPrice}
                  onChange={(e) => setOldPrice(Number(e.target.value))}
                  placeholder={lang === "ar" ? "أدخل السعر القديم..." : "Enter old price..."}
                  className="ps-12 h-12 rounded-xl border-2 border-[#2a655f]/20 focus:border-[#d81b60] focus:ring-2 focus:ring-[#d81b60]/20 transition-all duration-300 bg-white dark:bg-slate-900"
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                <span className="text-[#2a655f]">💡</span>
                {lang === "ar" 
                  ? "السعر القديم يجب أن يكون أكبر من السعر الحالي" 
                  : "Old price must be greater than current price"}
              </p>
            </div>

            {oldPrice > product.price && (
              <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-5 duration-300">
                <Badge className="bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white border-2 border-white/30 text-sm px-3 py-1.5 rounded-lg shadow-lg shadow-[#2a655f]/30">
                  🎯 {Math.round(((oldPrice - product.price) / oldPrice) * 100)}% {lang === "ar" ? "خصم" : "OFF"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {lang === "ar" ? "العميل سيوفر" : "Customer saves"} 
                  <span className="font-bold text-emerald-600 mx-1">
                    {formatPrice(oldPrice - product.price, currency, lang)}
                  </span>
                </span>
              </div>
            )}
          </div>

          <DialogFooter className="p-6 pt-2 border-t-2 border-[#d81b60]/20 gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConvertDialog(false)}
              className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#d81b60]/50 transition-all duration-300"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleConvertToOffer}
              disabled={isConverting || oldPrice <= product.price}
              className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 border-2 border-white/20"
            >
              {isConverting ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {lang === "ar" ? "جاري التحويل..." : "Converting..."}
                </span>
              ) : (
                <>
                  <Percent className="h-4 w-4 mr-2" />
                  {lang === "ar" ? "تحويل لعرض تخفيض" : "Convert to Discount"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}