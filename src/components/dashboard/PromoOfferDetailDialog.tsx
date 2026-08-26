
// src/components/dashboard/PromoOfferDetailDialog.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Gift, Sparkles, Package, Tag, X, Calendar, Clock, 
  ShoppingBag, Percent, Layers, CheckCircle2, AlertCircle,
  Edit2, Trash2, Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/i18n";

interface PromoOfferDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  offer: any;
  product: any;
  lang: string;
  currency: string;
  formatPrice: (price: number, currency: string, lang: string) => string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PromoOfferDetailDialog({
  open,
  onOpenChange,
  offer,
  product,
  lang,
  currency,
  formatPrice,
  onEdit,
  onDelete,
}: PromoOfferDetailDialogProps) {

  if (!offer) return null;

  const isArabic = lang === "ar";

  // ✅ الحصول على نوع العرض
  const getOfferTypeLabel = (type: string) => {
    const types: Record<string, { label: string; icon: any; color: string; bg: string }> = {
      bogo: {
        label: isArabic ? "نفس المنتج" : "Same Product",
        icon: Gift,
        color: "text-purple-600",
        bg: "bg-purple-100 dark:bg-purple-900/30",
      },
      cross_sell: {
        label: isArabic ? "منتج مختلف" : "Different Product",
        icon: Tag,
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/30",
      },
      bundle: {
        label: isArabic ? "باقة منتجات" : "Bundle",
        icon: Package,
        color: "text-orange-600",
        bg: "bg-orange-100 dark:bg-orange-900/30",
      },
    };
    return types[type] || types.bogo;
  };

  // ✅ الحصول على حالة العرض
  const getStatusInfo = () => {
    const isActive = offer.is_active;
    const isExpired = offer.expires_at && new Date(offer.expires_at) < new Date();
    const isFuture = offer.starts_at && new Date(offer.starts_at) > new Date();

    if (!isActive) {
      return {
        label: isArabic ? "غير نشط" : "Inactive",
        color: "bg-gray-500 text-white",
        icon: AlertCircle,
      };
    }
    if (isExpired) {
      return {
        label: isArabic ? "منتهي" : "Expired",
        color: "bg-red-500 text-white",
        icon: AlertCircle,
      };
    }
    if (isFuture) {
      return {
        label: isArabic ? "قادم" : "Upcoming",
        color: "bg-blue-500 text-white",
        icon: Clock,
      };
    }
    return {
      label: isArabic ? "نشط" : "Active",
      color: "bg-emerald-500 text-white",
      icon: CheckCircle2,
    };
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;
  const typeInfo = getOfferTypeLabel(offer.offer_type);
  const TypeIcon = typeInfo.icon;

  // ✅ ✅ ✅ دالة لجلب اسم المنتج
  const getProductName = (productId: string) => {
    // 1. من product الرئيسي
    if (product?.id === productId) {
      return product?.title_ar || (isArabic ? "منتج" : "Product");
    }
    
    // 2. من offer.products
    if (offer.products && Array.isArray(offer.products)) {
      const found = offer.products.find((p: any) => p.id === productId);
      if (found) return found.title_ar || (isArabic ? "منتج" : "Product");
    }
    
    // 3. من offer._products (اللي بنضيفها في handleViewPromoOffer)
    if (offer._products && Array.isArray(offer._products)) {
      const found = offer._products.find((p: any) => p.id === productId);
      if (found) return found.title_ar || (isArabic ? "منتج" : "Product");
    }
    
    // 4. من offer.bundle_products
    if (offer.bundle_products && Array.isArray(offer.bundle_products)) {
      const found = offer.bundle_products.find((p: any) => p.id === productId);
      if (found) return found.title_ar || (isArabic ? "منتج" : "Product");
    }
    
    // 5. من offer.free_product
    if (offer.free_product?.id === productId) {
      return offer.free_product.title_ar || (isArabic ? "منتج" : "Product");
    }
    
    return isArabic ? `منتج ${productId.slice(0, 8)}` : `Product ${productId.slice(0, 8)}`;
  };

  // ✅ ✅ ✅ دالة لجلب سعر المنتج
  const getProductPrice = (productId: string) => {
    if (product?.id === productId) return product?.price || 0;
    if (offer._products && Array.isArray(offer._products)) {
      const found = offer._products.find((p: any) => p.id === productId);
      if (found) return found.price || 0;
    }
    if (offer.free_product?.id === productId) return offer.free_product.price || 0;
    return 0;
  };

  // ✅ ✅ ✅ دالة لجلب فيرنتات منتج معين
  const getProductVariations = (productId: string) => {
    if (product?.id === productId && product?.variations) return product.variations;
    if (offer._products && Array.isArray(offer._products)) {
      const found = offer._products.find((p: any) => p.id === productId);
      if (found && found.variations) return found.variations;
    }
    if (offer.free_product?.id === productId && offer.free_product?.variations) {
      return offer.free_product.variations;
    }
    return [];
  };

  // ✅ ✅ ✅ عرض تفاصيل الفيرنتات
  const renderVariationDetails = (variationIds: string[], productId: string) => {
    if (!variationIds || variationIds.length === 0) {
      return (
        <p className="text-[10px] text-emerald-500/60 mt-1">
          ✅ {isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"}
        </p>
      );
    }

    const variations = getProductVariations(productId);
    if (!variations || variations.length === 0) {
      return null;
    }

    const filteredVariations = variations.filter((v: any) => variationIds.includes(v.id));
    if (filteredVariations.length === 0) return null;

    return (
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {filteredVariations.map((v: any) => {
          const combo = v.combination || {};
          const comboText = Object.entries(combo)
            .map(([key, value]) => `${key}: ${value}`)
            .join(' • ');
          return (
            <Badge key={v.id} variant="outline" className="text-[9px] border-purple-200/50 dark:border-purple-800/30 text-purple-600 dark:text-purple-300">
              {comboText || v.id.slice(0, 6)}
              {v.price && (
                <span className="ml-1 text-[8px] text-emerald-500">
                  {formatPrice(Number(v.price), currency, lang)}
                </span>
              )}
            </Badge>
          );
        })}
      </div>
    );
  };

  // ✅ الحصول على اسم التصنيف
  const getCategoryName = () => {
    if (offer.category_id && offer.category) {
      return isArabic ? offer.category.name_ar : offer.category.name_en;
    }
    return isArabic ? "غير محدد" : "Not specified";
  };

  // ✅ تنسيق التاريخ
  const formatDate = (date: string) => {
    if (!date) return isArabic ? "غير محدد" : "Not set";
    return new Date(date).toLocaleDateString(
      isArabic ? "ar-SA" : "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );
  };

  // ✅ نص العرض المخصص
  const getDisplayText = () => {
    return offer.display_text_ar || offer.display_text_en || "";
  };

  // ✅ الحصول على اسم الهدية
  const getGiftName = () => {
    if (offer.offer_type === "bogo") {
      return product?.title_ar || (isArabic ? "نفس المنتج" : "Same product");
    }
    if (offer.free_product?.title_ar) return offer.free_product.title_ar;
    if (offer.free_listing?.title_ar) return offer.free_listing.title_ar;
    return offer.free_listing_id || (isArabic ? "منتج مجاني" : "Free product");
  };

  // ✅ الحصول على سعر الهدية
  const getGiftPrice = () => {
    if (offer.free_product?.price) return offer.free_product.price;
    if (offer.free_listing?.price) return offer.free_listing.price;
    return 0;
  };

  // ✅ الحصول على فيرنتات الهدية
  const getGiftVariationIds = () => offer.result_variation_ids || [];

  // ✅ الحصول على فيرنتات المنتج الأساسي
  const getBaseVariationIds = () => offer.variation_ids || [];

  // ✅ الحصول على اسم المنتج الأساسي
  const getBaseProductName = () => {
    return product?.title_ar || offer.listing_id || (isArabic ? "منتج" : "Product");
  };

  // ✅ الحصول على سعر المنتج الأساسي
  const getBaseProductPrice = () => product?.price || 0;

  // ✅ جلب المنتجات المطلوبة للباقة
  const getBundleProducts = () => {
    const bundleProducts: any[] = [];
    
    if (offer.required_product_ids && offer.required_product_ids.length > 0) {
      offer.required_product_ids.forEach((id: string, index: number) => {
        let productData = {
          id: id,
          title_ar: getProductName(id),
          price: getProductPrice(id),
          variations: getProductVariations(id),
          quantity: 1,
          variation_ids: [] as string[],
        };
        
        if (offer.required_variations && offer.required_variations[index]) {
          const reqVar = offer.required_variations[index];
          productData.quantity = reqVar.quantity || 1;
          productData.variation_ids = reqVar.variation_ids || [];
        }
        
        bundleProducts.push(productData);
      });
    }
    
    return bundleProducts;
  };

  const bundleProducts = getBundleProducts();
  const baseVariationIds = getBaseVariationIds();
  const giftVariationIds = getGiftVariationIds();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-2xl p-0 overflow-hidden border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-2xl shadow-[#2a655f]/10 bg-white dark:bg-slate-900 max-h-[90vh] flex flex-col">
        
        {/* ===== HEADER ===== */}
        <div className="relative p-6 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 flex-shrink-0">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-500" />
          
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-600/30 flex-shrink-0">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                  {isArabic ? "تفاصيل العرض الترويجي" : "Promo Offer Details"}
                  <Badge className={cn(
                    "border-0 shadow-lg rounded-full px-3 py-1 flex items-center gap-1.5 text-xs",
                    statusInfo.color
                  )}>
                    <StatusIcon className="h-3 w-3" />
                    {statusInfo.label}
                  </Badge>
                </DialogTitle>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
                  <TypeIcon className="h-4 w-4" />
                  {typeInfo.label}
                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                  <span className="text-[#2a655f] dark:text-[#3a8a82] font-medium">
                    {getBaseProductName()}
                  </span>
                  {offer.is_featured && (
                    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px]">
                      ⭐ {isArabic ? "مميز" : "Featured"}
                    </Badge>
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:rotate-90 flex-shrink-0"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* ===== نص العرض ===== */}
          {getDisplayText() && (
            <div className="p-4 bg-gradient-to-r from-purple-50/50 to-indigo-50/50 dark:from-purple-950/20 dark:to-indigo-950/20 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
              <p className="text-center text-base font-semibold text-purple-700 dark:text-purple-300">
                🎯 {getDisplayText()}
              </p>
            </div>
          )}

          {/* ===== التصنيف ===== */}
          {offer.category_id && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-[#2a655f]" />
                {isArabic ? "التصنيف" : "Category"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-sm px-3 py-1 rounded-lg">
                  {getCategoryName()}
                </Badge>
                {offer.is_featured && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 text-[10px]">
                    ⭐ {isArabic ? "مميز" : "Featured"}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* ===== المنتج الأساسي مع فيرنتاته ===== */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5 text-[#2a655f]" />
              {isArabic ? "المنتج الأساسي" : "Base Product"}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">
                {getBaseProductName()}
              </span>
              <Badge variant="outline" className="text-[10px] border-slate-200/50">
                {baseVariationIds.length > 0 
                  ? `${baseVariationIds.length} ${isArabic ? "فيرنتات محددة" : "specific variations"}`
                  : (isArabic ? "كل الفيرنتات" : "All variations")}
              </Badge>
              <span className="text-xs font-bold text-[#2a655f]">
                {formatPrice(Number(getBaseProductPrice()), currency, lang)}
              </span>
            </div>
            {/* ✅ عرض فيرنتات المنتج الأساسي */}
            {baseVariationIds.length > 0 && product?.variations && (
              <div className="mt-2">
                <p className="text-[10px] text-muted-foreground mb-1">
                  {isArabic ? "الفيرنتات المحددة:" : "Specific variations:"}
                </p>
                {renderVariationDetails(baseVariationIds, offer.listing_id)}
              </div>
            )}
            {baseVariationIds.length === 0 && product?.variations && product.variations.length > 0 && (
              <p className="text-[10px] text-emerald-500/60 mt-1">
                ✅ {isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"}
              </p>
            )}
          </div>

          {/* ===== الكمية المطلوبة للشراء ===== */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
            <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5 text-[#2a655f]" />
              {isArabic ? "الكمية المطلوبة للشراء" : "Required Purchase Quantity"}
            </p>
            <p className="text-2xl font-bold text-[#2a655f] dark:text-[#3a8a82] mt-1">
              {offer.buy_quantity || 1}
            </p>
          </div>

          {/* ===== المنتجات المطلوبة (للباقة) ===== */}
          {offer.offer_type === 'bundle' && bundleProducts.length > 0 && (
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Package className="h-3.5 w-3.5 text-[#2a655f]" />
                {isArabic ? "المنتجات المطلوبة (باقة)" : "Required Products (Bundle)"}
              </p>
              <div className="space-y-2 mt-1.5">
                {bundleProducts.map((item: any, index: number) => (
                  <div key={item.id || index} className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {index + 1}. {item.title_ar}
                        </span>
                        {item.price > 0 && (
                          <span className="text-xs text-muted-foreground mr-2">
                            ({formatPrice(Number(item.price), currency, lang)})
                          </span>
                        )}
                      </div>
                      <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
                        {isArabic ? `الكمية: ${item.quantity}` : `Qty: ${item.quantity}`}
                      </Badge>
                    </div>
                    
                    {/* ✅ عرض فيرنتات هذا المنتج */}
                    {item.variation_ids.length > 0 && item.variations && item.variations.length > 0 && (
                      <div className="mt-2">
                        <p className="text-[10px] text-muted-foreground mb-1">
                          {isArabic ? "الفيرنتات المحددة:" : "Specific variations:"}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {item.variation_ids.map((vid: string) => {
                            const variation = item.variations.find((v: any) => v.id === vid);
                            if (!variation) return null;
                            const combo = variation.combination || {};
                            const comboText = Object.entries(combo)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(' • ');
                            return (
                              <Badge key={vid} variant="outline" className="text-[9px] border-purple-200/50 dark:border-purple-800/30 text-purple-600 dark:text-purple-300">
                                {comboText || vid.slice(0, 6)}
                                {variation.price && (
                                  <span className="ml-1 text-[8px] text-emerald-500">
                                    {formatPrice(Number(variation.price), currency, lang)}
                                  </span>
                                )}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    
                    {/* ✅ إذا كان "كل الفيرنتات" */}
                    {item.variation_ids.length === 0 && item.variations && item.variations.length > 0 && (
                      <p className="text-[10px] text-emerald-500/60 mt-1">
                        ✅ {isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"}
                      </p>
                    )}
                    
                    {/* ✅ إذا كان مافي فيرنتات */}
                    {(!item.variations || item.variations.length === 0) && (
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {isArabic ? "لا يوجد فيرنتات" : "No variations"}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ===== الهدية ===== */}
          <div className="p-4 bg-gradient-to-r from-emerald-50/30 to-teal-50/30 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
            <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Gift className="h-3.5 w-3.5 text-emerald-500" />
              {isArabic ? "الهدية" : "Gift"}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                {getGiftName()}
              </span>
              {giftVariationIds.length > 0 && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px]">
                  {giftVariationIds.length} {isArabic ? "فيرنتات محددة" : "specific variations"}
                </Badge>
              )}
              {giftVariationIds.length === 0 && (
                <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[10px]">
                  {isArabic ? "كل الفيرنتات" : "All variations"}
                </Badge>
              )}
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ×{offer.get_quantity || 1}
              </span>
              {getGiftPrice() > 0 && (
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(Number(getGiftPrice()), currency, lang)}
                </span>
              )}
            </div>
            
            {/* ✅ عرض فيرنتات الهدية */}
            {giftVariationIds.length > 0 && (
              <div className="mt-2">
                <p className="text-[10px] text-muted-foreground mb-1">
                  {isArabic ? "فيرنتات الهدية المحددة:" : "Specific gift variations:"}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {giftVariationIds.map((vid: string) => {
                    const giftProduct = offer.free_product || offer.free_listing;
                    const variation = giftProduct?.variations?.find((v: any) => v.id === vid);
                    if (!variation) return null;
                    const combo = variation.combination || {};
                    const comboText = Object.entries(combo)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(' • ');
                    return (
                      <Badge key={vid} variant="outline" className="text-[9px] border-emerald-200/50 dark:border-emerald-800/30 text-emerald-600 dark:text-emerald-300">
                        {comboText || vid.slice(0, 6)}
                        {variation.price && (
                          <span className="ml-1 text-[8px] text-emerald-500">
                            {formatPrice(Number(variation.price), currency, lang)}
                          </span>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
            {giftVariationIds.length === 0 && (
              <p className="text-[10px] text-emerald-500/60 mt-1">
                ✅ {isArabic ? "جميع الفيرنتات مشمولة" : "All variations included"}
              </p>
            )}
          </div>

          {/* ===== المدة ===== */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#2a655f]" />
                {isArabic ? "تاريخ البدء" : "Start Date"}
              </p>
              <p className="text-sm font-medium mt-1 text-slate-900 dark:text-white">
                {formatDate(offer.starts_at)}
              </p>
            </div>
            <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300">
              <p className="text-xs text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#2a655f]" />
                {isArabic ? "تاريخ الانتهاء" : "End Date"}
              </p>
              <p className="text-sm font-medium mt-1 text-slate-900 dark:text-white">
                {offer.expires_at ? formatDate(offer.expires_at) : (isArabic ? "🔓 دائم" : "🔓 Permanent")}
              </p>
            </div>
          </div>

          {/* ===== إحصائيات إضافية ===== */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center">
              <p className="text-[10px] text-muted-foreground">{isArabic ? "نوع العرض" : "Offer Type"}</p>
              <p className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] mt-0.5">
                {offer.offer_type === 'bogo' ? (isArabic ? "نفس المنتج" : "BOGO") :
                 offer.offer_type === 'cross_sell' ? (isArabic ? "منتج مختلف" : "Cross-sell") :
                 (isArabic ? "باقة" : "Bundle")}
              </p>
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center">
              <p className="text-[10px] text-muted-foreground">{isArabic ? "الكمية المشتراة" : "Buy Quantity"}</p>
              <p className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] mt-0.5">
                {offer.buy_quantity || 1}
              </p>
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-center">
              <p className="text-[10px] text-muted-foreground">{isArabic ? "الكمية المجانية" : "Free Quantity"}</p>
              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                {offer.get_quantity || 1}
              </p>
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <DialogFooter className="p-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex-shrink-0 gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300"
          >
            <X className="h-4 w-4 mr-2" />
            {isArabic ? "إغلاق" : "Close"}
          </Button>
          {onEdit && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onEdit();
              }}
              className="rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50/50 hover:border-blue-500/50 transition-all duration-300"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              {isArabic ? "تعديل" : "Edit"}
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                onDelete();
              }}
              className="rounded-xl border-red-200/50 text-red-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {isArabic ? "حذف" : "Delete"}
            </Button>
          )}
          <Button
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300 hover:scale-[1.02]"
            onClick={() => onOpenChange(false)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {isArabic ? "تم" : "Done"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}