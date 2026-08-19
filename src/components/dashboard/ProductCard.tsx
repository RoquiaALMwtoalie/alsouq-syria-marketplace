// src/components/dashboard/ProductCard.tsx - الكود الكامل المصحح (زر الحذف يظهر دائماً)

import { 
  Package, Gift, Clock, Edit2, Trash2, Eye, MoreVertical, 
  DollarSign, Layers, Star, CheckCircle2, Archive, FileText, RefreshCw,
  Sparkles, Zap, Tag, Percent, Plus, Minus, Calendar, X
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
        const updatedProduct = { ...product, is_offer: true, old_price: oldPrice, discount_percent: discountPercent };
        onConvertToOffer(updatedProduct);
      } else {
        window.location.reload();
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
    const statusMap: Record<string, { color: string; icon: any; label: string }> = {
      pending: { 
        color: "bg-yellow-500/90 text-white", 
        icon: Clock, 
        label: lang === "ar" ? "قيد المراجعة" : "Pending" 
      },
      published: { 
        color: "bg-green-500/90 text-white", 
        icon: CheckCircle2, 
        label: lang === "ar" ? "منشور" : "Published" 
      },
      archived: { 
        color: "bg-gray-500/90 text-white", 
        icon: Archive, 
        label: lang === "ar" ? "مؤرشف" : "Archived" 
      },
      draft: { 
        color: "bg-blue-500/90 text-white", 
        icon: FileText, 
        label: lang === "ar" ? "مسودة" : "Draft" 
      },
    };

    const info = statusMap[status] || statusMap.draft;
    const Icon = info.icon;

    return (
      <Badge className={cn(
        "border-0 shadow-lg rounded-full px-3 py-1 flex items-center gap-1 text-xs",
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
          className={cn(
            "border-0 shadow-lg rounded-full px-2.5 py-0.5 text-[10px] font-bold flex items-center gap-1",
            "bg-gradient-to-r from-purple-500 to-indigo-500 text-white"
          )}
        >
          <Sparkles className="h-2.5 w-2.5" />
          {lang === "ar" ? "عرض ترويجي" : "Promo"}
        </Badge>
        <Badge 
          variant="outline" 
          className="border-purple-300/50 text-purple-700 dark:text-purple-300 text-[9px] rounded-full px-2 py-0 h-5 flex items-center gap-0.5"
        >
          <Icon className="h-2.5 w-2.5" />
          {typeInfo.label}
        </Badge>
      </div>
    );
  };

  // ============================================================
  // ✅ VIEW MODE: LIST
  // ============================================================
  if (viewMode === "list") {
    return (
      <>
        <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-200/50 dark:border-slate-800/50 hover:border-[#2a655f]/50 hover:shadow-xl hover:shadow-[#2a655f]/10 transition-all duration-300 flex flex-col sm:flex-row min-h-[180px]">
          <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
            {product.cover_url ? (
              <img src={product.cover_url} alt={product.title_ar} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
            ) : (
              <div className="flex h-full w-full items-center justify-center"><Package className="h-16 w-16 text-muted-foreground/20" /></div>
            )}
            
            <div className="absolute top-2 left-2 flex flex-col gap-1.5">
              {isOffer && discount && (
                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-2.5 py-0.5 text-xs font-bold">
                  -{discount}%
                </Badge>
              )}
              {getStatusBadge()}
              {hasPromoOffer && (
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg rounded-full px-2.5 py-0.5 text-[10px] flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5" />
                  {lang === "ar" ? "ترويجي" : "Promo"}
                </Badge>
              )}
            </div>
            
            {!product.is_available && (
              <Badge className="absolute bottom-2 right-2 bg-red-500/90 text-white border-0 shadow-lg rounded-full px-2.5 py-0.5 text-xs">
                {lang === "ar" ? "غير متوفر" : "Unavailable"}
              </Badge>
            )}
          </div>
          
          <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-h-[180px]">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base line-clamp-1 group-hover:text-[#2a655f] transition-colors">
                {product.title_ar}
              </div>
              
              {renderPromoBadge()}
              
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className={cn(
                      "h-3.5 w-3.5",
                      star <= fullStars ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"
                    )} />
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">({reviewsCount})</span>
              </div>
              
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <Badge className={isOffer ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 rounded-full text-[10px]" : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 rounded-full text-[10px]"}>
                  {isOffer ? <Percent className="h-3 w-3 mr-1" /> : <Package className="h-3 w-3 mr-1" />}
                  {isOffer ? (lang === "ar" ? "عرض تخفيض" : "Discount") : (lang === "ar" ? "منتج" : "Product")}
                </Badge>
                <span className={`inline-flex items-center gap-1 text-xs ${product.is_available ? 'text-emerald-600' : 'text-red-500'}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${product.is_available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  {product.is_available ? (lang === "ar" ? "متوفر" : "Available") : (lang === "ar" ? "غير متوفر" : "Unavailable")}
                </span>
              </div>
              
              <div className="flex items-center gap-4 mt-2">
                <span className="text-lg font-bold text-[#2a655f] dark:text-[#3a8a82]">
                  {formatPrice(Number(product.price), currency, lang)}
                </span>
                {product.old_price && product.old_price > product.price && (
                  <span className="text-xs text-red-500 line-through">
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
                        className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden ring-2 ring-white/50 dark:ring-slate-800/50"
                      >
                        <img 
                          src={color.image_url} 
                          alt={color.color_name_ar}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-color.png';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {product.colors.length > 4 && (
                    <span className="text-[10px] text-muted-foreground font-medium">
                      +{product.colors.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
            
            {/* ===== أزرار الإجراءات - LIST VIEW (كل الأزرار تظهر دائماً) ===== */}
            <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">
              {/* ✅ زر تعديل */}
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl text-xs h-8 px-2.5 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 hover:scale-105 transition-all duration-300 relative z-10 whitespace-nowrap" 
                onClick={() => {
                  if (hasPromoOffer && onEditPromoOffer) {
                    onEditPromoOffer(promoOffer);
                  } else {
                    onEdit();
                  }
                }}
              >
                <Edit2 className="h-3.5 w-3.5 mr-1.5 text-[#2a655f] group-hover:rotate-12 transition-transform flex-shrink-0" />
                {hasPromoOffer 
                  ? (lang === "ar" ? "تعديل العرض" : "Edit Offer")
                  : (lang === "ar" ? "تعديل" : "Edit")
                }
              </Button>
              
              {/* ✅ زر إعادة نشر (للمسودات فقط) */}
              {status === "draft" && onRepublish && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl text-xs h-8 px-2 border-blue-500/30 text-blue-600 hover:bg-blue-50/50 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 relative z-10 whitespace-nowrap"
                  onClick={() => onRepublish(product)}
                >
                  <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-blue-500 group-hover:rotate-180 transition-transform duration-500 flex-shrink-0" />
                  {lang === "ar" ? "نشر" : "Publish"}
                </Button>
              )}
              
              {/* ✅ زر عرض ترويجي (للمنتجات بدون عرض ترويجي) */}
              {!hasPromoOffer && onAddPromoOffer && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl text-xs h-8 px-2 border-purple-500/30 text-purple-600 hover:bg-purple-50/50 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 relative z-10 whitespace-nowrap"
                  onClick={() => onAddPromoOffer(product)}
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1.5 text-purple-500 group-hover:scale-110 transition-transform flex-shrink-0" />
                  {lang === "ar" ? "ترويج" : "Promo"}
                </Button>
              )}
              
              {/* ✅ زر تخفيض (للمنتجات العادية فقط) */}
              {!isOffer && !hasPromoOffer && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="rounded-xl text-xs h-8 px-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 hover:scale-105 transition-all duration-300 relative z-10 whitespace-nowrap"
                  onClick={openConvertDialog}
                >
                  <Percent className="h-3.5 w-3.5 mr-1.5 text-[#2a655f] group-hover:scale-110 transition-transform flex-shrink-0" />
                  {lang === "ar" ? "تخفيض" : "Discount"}
                </Button>
              )}
              
              {/* ✅ ✅ ✅ زر الحذف - دائم الظهور */}
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl h-8 w-8 p-0 hover:scale-110 transition-all duration-300 relative z-10 flex-shrink-0" 
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
              
              {/* ✅ زر العين - قائمة منسدلة */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="ghost" className="rounded-xl h-8 w-8 p-0 hover:scale-110 hover:bg-[#2a655f]/5 transition-all duration-300 relative z-10 flex-shrink-0">
                    <Eye className="h-4 w-4 text-[#2a655f] group-hover:scale-110 transition-transform" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-xl min-w-[220px] p-1 border-2 border-[#2a655f]/10 shadow-xl">
                  <DropdownMenuItem className="cursor-pointer rounded-lg text-sm group hover:bg-[#2a655f]/10 transition-colors duration-200" onClick={onView}>
                    <Eye className="h-4 w-4 mr-2 text-[#2a655f]" />
                    {lang === "ar" ? "عرض تفاصيل المنتج" : "View Product Details"}
                  </DropdownMenuItem>
                  
                  {hasPromoOffer && onViewPromoOffer && (
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-lg text-sm group text-purple-600 hover:text-purple-700 hover:bg-purple-50/50 transition-colors duration-200"
                      onClick={() => onViewPromoOffer(promoOffer)}
                    >
                      <Eye className="h-4 w-4 mr-2 text-purple-500" />
                      {lang === "ar" ? "عرض تفاصيل العرض الترويجي" : "View Promo Offer Details"}
                    </DropdownMenuItem>
                  )}
                  
                  <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 my-1" />
                  
                  <DropdownMenuItem className="cursor-pointer rounded-lg text-sm group hover:bg-[#2a655f]/10 transition-colors duration-200" onClick={onEdit}>
                    <Edit2 className="h-4 w-4 mr-2 text-[#2a655f]" />
                    {lang === "ar" ? "تعديل المنتج" : "Edit Product"}
                  </DropdownMenuItem>
                  
                  {hasPromoOffer && onEditPromoOffer && (
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-lg text-sm group text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors duration-200"
                      onClick={() => onEditPromoOffer(promoOffer)}
                    >
                      <Edit2 className="h-4 w-4 mr-2 text-blue-500" />
                      {lang === "ar" ? "تعديل العرض الترويجي" : "Edit Promo Offer"}
                    </DropdownMenuItem>
                  )}
                  
                  <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 my-1" />
                  
                  <DropdownMenuItem className="cursor-pointer rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200" onClick={onDelete}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {lang === "ar" ? "حذف المنتج" : "Delete Product"}
                  </DropdownMenuItem>
                  
                  {hasPromoOffer && onRemovePromoOffer && (
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                      onClick={() => onRemovePromoOffer(promoOffer.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {lang === "ar" ? "حذف العرض الترويجي" : "Remove Promo Offer"}
                    </DropdownMenuItem>
                  )}
                  
                  {status === "draft" && onRepublish && (
                    <>
                      <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 my-1" />
                      <DropdownMenuItem 
                        className="cursor-pointer rounded-lg text-sm group text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors duration-200"
                        onClick={() => onRepublish(product)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                        {lang === "ar" ? "إعادة نشر" : "Republish"}
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
          <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl shadow-[#2a655f]/10 bg-white dark:bg-slate-900 p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2 border-b border-[#2a655f]/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 animate-pulse flex-shrink-0">
                  <Percent className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-[#2a655f]">
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
              <div className="p-4 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 rounded-xl border border-[#2a655f]/20">
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
                    className="ps-12 h-12 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 bg-white dark:bg-slate-900"
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
                <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-5 duration-300">
                  <Badge className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white border-0 text-sm px-3 py-1.5 rounded-lg shadow-lg shadow-[#2a655f]/30">
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

            <DialogFooter className="p-6 pt-2 border-t border-[#2a655f]/10 gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConvertDialog(false)}
                className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300"
              >
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleConvertToOffer}
                disabled={isConverting || oldPrice <= product.price}
                className="rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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

  // ============================================================
  // ✅ VIEW MODE: GRID
  // ============================================================
  return (
    <>
      <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-200/60 dark:border-slate-800/60 hover:border-[#2a655f]/50 hover:shadow-2xl hover:shadow-[#2a655f]/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] flex flex-col h-full min-h-[400px] max-h-[500px]">
        
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#2a655f]/0 via-[#2a655f]/0 to-[#2a655f]/0 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:via-[#2a655f]/10" />
        
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 cursor-pointer flex-shrink-0">
          {product.cover_url ? (
            <img 
              src={product.cover_url} 
              alt={product.title_ar} 
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-20 w-20 text-muted-foreground/20 group-hover:text-[#2a655f]/20 transition-colors duration-500" />
            </div>
          )}
          
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {isOffer && (
              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                🔥 {lang === "ar" ? "تخفيض" : "Discount"}
                {discount && ` -${discount}%`}
              </Badge>
            )}
            
            {hasPromoOffer && (
              <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5 animate-pulse">
                <Sparkles className="h-3 w-3" />
                {lang === "ar" ? "عرض ترويجي" : "Promo"}
              </Badge>
            )}
            
            {getStatusBadge()}
          </div>
          
          {!product.is_available && (
            <Badge className="absolute top-3 right-3 bg-red-500/90 text-white border-0 shadow-lg rounded-full px-3 py-1 text-xs animate-pulse">
              ❌ {lang === "ar" ? "غير متوفر" : "Unavailable"}
            </Badge>
          )}
          
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50 shadow-lg rounded-full px-3 py-1 text-xs font-medium group-hover:border-[#2a655f]/30 transition-all duration-300">
              <Layers className="h-3 w-3 mr-1 text-[#2a655f]" />
              {product.category_name || product.categories?.name_ar || ""}
            </Badge>
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div 
              className="bg-white/95 dark:bg-slate-900/95 rounded-full p-3.5 shadow-2xl hover:scale-110 transition-transform border-2 border-white/20 dark:border-slate-700/50 group-hover:border-[#2a655f]/30 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                if (hasPromoOffer && onViewPromoOffer && promoOffer) {
                  onViewPromoOffer(promoOffer);
                } else {
                  onView();
                }
              }}
            >
              <Eye className="h-5 w-5 text-[#2a655f] group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="absolute bottom-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            {!hasPromoOffer && onAddPromoOffer && (
              <Button
                size="sm"
                className="h-7 px-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all duration-300 hover:scale-105"
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
                className="h-7 px-2 rounded-lg bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50 transition-all duration-300 hover:scale-105"
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
          <div className="font-semibold text-base line-clamp-1 group-hover:text-[#2a655f] transition-colors duration-300">
            {product.title_ar}
          </div>
          
          {renderPromoBadge()}
          
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  star <= fullStars ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"
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
                    className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden ring-2 ring-white/50 dark:ring-slate-800/50 group-hover:ring-[#2a655f]/30 transition-all duration-300"
                  >
                    <img 
                      src={color.image_url} 
                      alt={color.color_name_ar}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-color.png';
                      }}
                    />
                  </div>
                ))}
              </div>
              {product.colors.length > 4 && (
                <span className="text-[10px] text-muted-foreground font-medium">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
          
          <div className="flex items-end justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-2.5 mt-auto">
            <div>
              <div className="text-xl font-bold text-[#2a655f] dark:text-[#3a8a82] group-hover:scale-105 transition-transform duration-300">
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
              product.is_available ? 'bg-emerald-500 group-hover:scale-150' : 'bg-red-500 group-hover:scale-150'
            )} />
            <span className={cn(
              "text-xs font-medium transition-colors duration-300",
              product.is_available ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'
            )}>
              {product.is_available 
                ? (lang === "ar" ? "متوفر" : "Available") 
                : (lang === "ar" ? "غير متوفر" : "Unavailable")}
            </span>
          </div>
          
          {/* ===== أزرار الإجراءات - GRID VIEW (كل الأزرار تظهر دائماً) ===== */}
          <div className="flex items-center gap-1 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/50 flex-wrap">
            {/* ✅ زر تعديل */}
            <Button 
              size="sm" 
              variant="outline" 
              className="flex-1 rounded-xl text-[10px] font-medium h-7 px-1.5 group border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 hover:scale-[1.02] transition-all duration-300 relative z-10 min-w-0" 
              onClick={() => {
                if (hasPromoOffer && onEditPromoOffer) {
                  onEditPromoOffer(promoOffer);
                } else {
                  onEdit();
                }
              }}
            >
              <Edit2 className="h-3 w-3 mr-0.5 text-[#2a655f] group-hover:rotate-12 transition-transform duration-300 flex-shrink-0" />
              <span className="truncate text-[9px] sm:text-[10px]">
                {hasPromoOffer 
                  ? (lang === "ar" ? "تعديل العرض" : "Edit Offer")
                  : (lang === "ar" ? "تعديل" : "Edit")
                }
              </span>
            </Button>
            
            {/* ✅ زر إعادة نشر (للمسودات فقط) */}
            {status === "draft" && onRepublish && (
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl text-[10px] h-7 px-1.5 border-blue-500/30 text-blue-600 hover:bg-blue-50/50 hover:border-blue-500/50 hover:scale-[1.02] transition-all duration-300 relative z-10 flex-shrink-0"
                onClick={() => onRepublish(product)}
              >
                <RefreshCw className="h-3 w-3 text-blue-500 group-hover:rotate-180 transition-transform duration-500 flex-shrink-0" />
                <span className="hidden xs:inline text-[9px]">{lang === "ar" ? "نشر" : "Publish"}</span>
              </Button>
            )}
            
            {/* ✅ زر عرض ترويجي (للمنتجات بدون عرض ترويجي) */}
            {!hasPromoOffer && onAddPromoOffer && (
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl text-[10px] h-7 px-1.5 border-purple-500/30 text-purple-600 hover:bg-purple-50/50 hover:border-purple-500/50 hover:scale-[1.02] transition-all duration-300 relative z-10 flex-shrink-0"
                onClick={() => onAddPromoOffer(product)}
              >
                <Sparkles className="h-3 w-3 text-purple-500 group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span className="hidden xs:inline text-[9px]">{lang === "ar" ? "ترويج" : "Promo"}</span>
              </Button>
            )}
            
            {/* ✅ زر تخفيض (للمنتجات العادية فقط) */}
            {!isOffer && !hasPromoOffer && (
              <Button 
                size="sm" 
                variant="outline" 
                className="rounded-xl text-[10px] h-7 px-1.5 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 hover:scale-[1.02] transition-all duration-300 relative z-10 flex-shrink-0"
                onClick={openConvertDialog}
              >
                <Percent className="h-3 w-3 text-[#2a655f] group-hover:scale-110 transition-transform duration-300 flex-shrink-0" />
                <span className="hidden xs:inline text-[9px]">{lang === "ar" ? "تخفيض" : "Discount"}</span>
              </Button>
            )}
            
            {/* ✅ ✅ ✅ زر الحذف - دائم الظهور */}
            <Button 
              size="sm" 
              variant="ghost" 
              className="text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl h-7 w-7 p-0 group hover:scale-110 transition-all duration-300 relative z-10 flex-shrink-0" 
              onClick={() => {
                if (hasPromoOffer && onRemovePromoOffer) {
                  onRemovePromoOffer(promoOffer.id);
                } else {
                  onDelete();
                }
              }}
            >
              <Trash2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" />
            </Button>
            
            {/* ✅ زر العين - قائمة منسدلة */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="rounded-xl h-7 w-7 p-0 group hover:scale-110 hover:bg-[#2a655f]/5 transition-all duration-300 relative z-10 flex-shrink-0"
                >
                  <Eye className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl min-w-[200px] p-1 border-2 border-[#2a655f]/10 shadow-xl">
                <DropdownMenuItem className="cursor-pointer rounded-lg text-sm group hover:bg-[#2a655f]/10 transition-colors duration-200" onClick={onView}>
                  <Eye className="h-4 w-4 mr-2 text-[#2a655f]" />
                  {lang === "ar" ? "عرض تفاصيل المنتج" : "View Product Details"}
                </DropdownMenuItem>
                
                {hasPromoOffer && onViewPromoOffer && (
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-lg text-sm group text-purple-600 hover:text-purple-700 hover:bg-purple-50/50 transition-colors duration-200"
                    onClick={() => onViewPromoOffer(promoOffer)}
                  >
                    <Eye className="h-4 w-4 mr-2 text-purple-500" />
                    {lang === "ar" ? "عرض تفاصيل العرض الترويجي" : "View Promo Offer Details"}
                  </DropdownMenuItem>
                )}
                
                <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 my-1" />
                
                <DropdownMenuItem className="cursor-pointer rounded-lg text-sm group hover:bg-[#2a655f]/10 transition-colors duration-200" onClick={onEdit}>
                  <Edit2 className="h-4 w-4 mr-2 text-[#2a655f]" />
                  {lang === "ar" ? "تعديل المنتج" : "Edit Product"}
                </DropdownMenuItem>
                
                {hasPromoOffer && onEditPromoOffer && (
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-lg text-sm group text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors duration-200"
                    onClick={() => onEditPromoOffer(promoOffer)}
                  >
                    <Edit2 className="h-4 w-4 mr-2 text-blue-500" />
                    {lang === "ar" ? "تعديل العرض الترويجي" : "Edit Promo Offer"}
                  </DropdownMenuItem>
                )}
                
                <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 my-1" />
                
                <DropdownMenuItem className="cursor-pointer rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200" onClick={onDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {lang === "ar" ? "حذف المنتج" : "Delete Product"}
                </DropdownMenuItem>
                
                {hasPromoOffer && onRemovePromoOffer && (
                  <DropdownMenuItem 
                    className="cursor-pointer rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                    onClick={() => onRemovePromoOffer(promoOffer.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {lang === "ar" ? "حذف العرض الترويجي" : "Remove Promo Offer"}
                  </DropdownMenuItem>
                )}
                
                {status === "draft" && onRepublish && (
                  <>
                    <div className="h-px bg-slate-200/50 dark:bg-slate-700/50 my-1" />
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-lg text-sm group text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors duration-200"
                      onClick={() => onRepublish(product)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2 text-blue-500" />
                      {lang === "ar" ? "إعادة نشر" : "Republish"}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl shadow-[#2a655f]/10 bg-white dark:bg-slate-900 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-2 border-b border-[#2a655f]/10">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 animate-pulse flex-shrink-0">
                <Percent className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#2a655f]">
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
            <div className="p-4 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 rounded-xl border border-[#2a655f]/20">
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
                  className="ps-12 h-12 rounded-xl border-2 border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300 bg-white dark:bg-slate-900"
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
              <div className="flex items-center gap-3 p-3 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30 animate-in fade-in slide-in-from-top-5 duration-300">
                <Badge className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white border-0 text-sm px-3 py-1.5 rounded-lg shadow-lg shadow-[#2a655f]/30">
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

          <DialogFooter className="p-6 pt-2 border-t border-[#2a655f]/10 gap-3">
            <Button
              variant="outline"
              onClick={() => setShowConvertDialog(false)}
              className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300"
            >
              {lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleConvertToOffer}
              disabled={isConverting || oldPrice <= product.price}
              className="rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
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