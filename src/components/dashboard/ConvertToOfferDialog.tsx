// src/components/dashboard/ConvertToOfferDialog.tsx

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Gift,
  DollarSign,
  Percent,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Layers,
  Minus,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/i18n";

interface VariationPrice {
  id: string;
  combination: Record<string, string>;
  price: number;
  old_price: number;
  original_price: number;
}

interface ConvertToOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  onConfirm: (productId: string, newPrice: number, variationPrices?: Record<string, number>, variationOldPrices?: Record<string, number>) => void;
  isConverting: boolean;
  lang: string;
  currency: string;
  formatPrice: (price: number, currency: string, lang: string) => string;
}

export const ConvertToOfferDialog = ({
  open,
  onOpenChange,
  product,
  onConfirm,
  isConverting,
  lang,
  currency,
  formatPrice,
}: ConvertToOfferDialogProps) => {
  const [newPrice, setNewPrice] = useState<number>(0);
  const [error, setError] = useState<string>("");
  
  // ✅ State للفيرنتات
  const [variationPrices, setVariationPrices] = useState<Record<string, number>>({});
  const [variationOldPrices, setVariationOldPrices] = useState<Record<string, number>>({});
  const [bulkDiscountPercent, setBulkDiscountPercent] = useState<number>(0);
  const [expandedVariations, setExpandedVariations] = useState<boolean>(true);

  const hasVariations = product?.variations && product.variations.length > 0;

  // ✅ تحميل الأسعار عند فتح النافذة
  useEffect(() => {
    if (product && open) {
      const originalPrice = Number(product.price);
      const suggestedPrice = Math.round(originalPrice * 0.8);
      setNewPrice(suggestedPrice);
      setError("");
      
      // ✅ تعبئة أسعار الفيرنتات
      if (hasVariations) {
        const prices: Record<string, number> = {};
        const oldPrices: Record<string, number> = {};
        
        product.variations.forEach((v: any) => {
          const currentPrice = v.price || originalPrice || 0;
          const suggestedVarPrice = Math.round(currentPrice * 0.8);
          prices[v.id] = suggestedVarPrice;
          oldPrices[v.id] = currentPrice;
        });
        
        setVariationPrices(prices);
        setVariationOldPrices(oldPrices);
        setBulkDiscountPercent(20);
        setExpandedVariations(true);
      }
    }
  }, [product, open, hasVariations]);

  if (!product) return null;

  const originalPrice = Number(product.price);
  
  // ✅ حساب الخصم للمنتج بدون فيرنتات
  const discountPercent = originalPrice > 0 && newPrice > 0 && newPrice < originalPrice
    ? Math.round(((originalPrice - newPrice) / originalPrice) * 100)
    : 0;
  
  const isValid = newPrice > 0 && newPrice < originalPrice;

  // ✅ حساب الخصم للفيرنتات
  const getVariationDiscount = (varId: string) => {
    const oldPrice = variationOldPrices[varId] || 0;
    const newPriceVar = variationPrices[varId] || 0;
    if (oldPrice > 0 && newPriceVar > 0 && newPriceVar < oldPrice) {
      return Math.round(((oldPrice - newPriceVar) / oldPrice) * 100);
    }
    return 0;
  };

  // ✅ التحقق من صحة الفيرنتات
  const areVariationsValid = () => {
    if (!hasVariations) return true;
    
    for (const v of product.variations) {
      const newPriceVar = variationPrices[v.id];
      const oldPriceVar = variationOldPrices[v.id];
      if (!newPriceVar || newPriceVar <= 0) return false;
      if (!oldPriceVar || oldPriceVar <= 0) return false;
      if (newPriceVar >= oldPriceVar) return false;
    }
    return true;
  };

  const isFormValid = hasVariations ? areVariationsValid() : isValid;

  // ✅ تطبيق خصم على كل الفيرنتات
  const applyBulkDiscount = (percent: number) => {
    if (!hasVariations || !product.variations) return;
    
    const newPrices: Record<string, number> = {};
    product.variations.forEach((v: any) => {
      const currentPrice = v.price || originalPrice || 0;
      const discountedPrice = Math.round(currentPrice * (1 - percent / 100));
      newPrices[v.id] = discountedPrice;
    });
    
    setVariationPrices(newPrices);
    setBulkDiscountPercent(percent);
  };

  // ✅ تطبيق خصم على كل الفيرنتات (تطبيق فعلي)
  const handleApplyBulkDiscount = () => {
    if (bulkDiscountPercent > 0 && bulkDiscountPercent <= 100) {
      applyBulkDiscount(bulkDiscountPercent);
    }
  };

  const handleConfirm = () => {
    if (!isFormValid) {
      setError(
        lang === "ar" 
          ? "⚠️ الرجاء التأكد من أن السعر الجديد أقل من السعر القديم" 
          : "⚠️ Please ensure new price is less than old price"
      );
      return;
    }

    if (hasVariations) {
      // ✅ تحويل مع فيرنتات
      onConfirm(product.id, 0, variationPrices, variationOldPrices);
    } else {
      onConfirm(product.id, newPrice);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-2xl rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 shadow-2xl shadow-[#2a655f]/10 p-0 overflow-hidden max-h-[95vh] flex flex-col">
        
        {/* ===== Header ===== */}
        <div className="p-5 pb-3 border-b border-[#2a655f]/10 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 flex-shrink-0">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#2a655f]">
                {lang === "ar" ? "🎁 تحويل إلى عرض تخفيض" : "🎁 Convert to Discount Offer"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                {lang === "ar"
                  ? `تحويل "${product.title_ar}" إلى عرض خاص`
                  : `Convert "${product.title_en || product.title_ar}" to a special offer`}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* ===== Body ===== */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* معلومات المنتج الحالي */}
          <div className="p-3 rounded-xl bg-[#2a655f]/5 dark:bg-[#2a655f]/10 border border-[#2a655f]/10">
            <div className="flex items-center gap-3">
              <img
                src={product.cover_url || "/placeholder.png"}
                alt={product.title_ar}
                className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md flex-shrink-0"
              />
              <div className="min-w-0">
                <p className="font-medium text-sm text-slate-800 dark:text-slate-200 truncate">
                  {product.title_ar}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-muted-foreground">
                    {lang === "ar" ? "السعر الحالي:" : "Current:"}
                  </span>
                  <span className="text-base font-bold text-[#2a655f]">
                    {formatPrice(originalPrice, currency, lang)}
                  </span>
                  {hasVariations && (
                    <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-[9px]">
                      <Layers className="h-3 w-3 inline mr-1" />
                      {product.variations.length} {lang === "ar" ? "فيرنت" : "variations"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ===== عرض الفيرنتات ===== */}
          {hasVariations && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                  <Layers className="h-4 w-4 text-[#2a655f]" />
                  {lang === "ar" ? "أسعار الفيرنتات" : "Variation Prices"}
                  <span className="text-red-500 text-xs">*</span>
                </Label>
                
                {/* ✅ تطبيق خصم على الكل */}
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] text-muted-foreground whitespace-nowrap">
                    {lang === "ar" ? "خصم الكل:" : "Bulk:"}
                  </Label>
                  <div className="flex items-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={bulkDiscountPercent}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0 && val <= 100) {
                          setBulkDiscountPercent(val);
                        }
                      }}
                      className="h-7 w-14 text-xs rounded-lg border-slate-200/50 dark:border-slate-800/50"
                    />
                    <span className="text-xs">%</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 px-2 text-[10px] text-[#2a655f] hover:bg-[#2a655f]/10"
                      onClick={handleApplyBulkDiscount}
                    >
                      {lang === "ar" ? "تطبيق" : "Apply"}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {product.variations.map((variation: any) => {
                  const combo = variation.combination || {};
                  const comboText = Object.entries(combo)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join(' • ');
                  
                  const currentPrice = variationPrices[variation.id] ?? variation.price ?? originalPrice ?? 0;
                  const currentOldPrice = variationOldPrices[variation.id] ?? variation.price ?? originalPrice ?? 0;
                  const varDiscount = currentOldPrice > currentPrice && currentOldPrice > 0
                    ? Math.round(((currentOldPrice - currentPrice) / currentOldPrice) * 100)
                    : 0;
                  const isVarValid = currentPrice > 0 && currentOldPrice > 0 && currentPrice < currentOldPrice;

                  return (
                    <div key={variation.id} className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 transition-all">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-[10px] border-slate-200/50">
                            {comboText || variation.id.slice(0, 6)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {lang === "ar" ? "السعر الحالي:" : "Current:"}
                            <span className="font-bold text-[#2a655f] mx-1">
                              {formatPrice(variation.price || originalPrice || 0, currency, lang)}
                            </span>
                          </span>
                        </div>
                        {varDiscount > 0 && (
                          <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[9px]">
                            🎯 {varDiscount}% {lang === "ar" ? "خصم" : "OFF"}
                          </Badge>
                        )}
                        {!isVarValid && currentPrice > 0 && currentOldPrice > 0 && (
                          <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0 text-[9px]">
                            ⚠️ {lang === "ar" ? "غير صحيح" : "Invalid"}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <Label className="text-[10px] text-muted-foreground">
                            {lang === "ar" ? "السعر الجديد" : "New Price"}
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={currentPrice}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val >= 0) {
                                setVariationPrices({
                                  ...variationPrices,
                                  [variation.id]: val
                                });
                              }
                            }}
                            className={cn(
                              "h-8 text-xs rounded-lg border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50",
                              currentPrice >= currentOldPrice && currentPrice > 0 && "border-red-300 dark:border-red-700"
                            )}
                          />
                        </div>
                        <div>
                          <Label className="text-[10px] text-muted-foreground">
                            {lang === "ar" ? "السعر القديم" : "Old Price"}
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            value={currentOldPrice}
                            onChange={(e) => {
                              const val = Number(e.target.value);
                              if (val >= 0) {
                                setVariationOldPrices({
                                  ...variationOldPrices,
                                  [variation.id]: val
                                });
                              }
                            }}
                            className="h-8 text-xs rounded-lg border-slate-200/50 dark:border-slate-800/50 focus:border-[#2a655f]/50"
                          />
                        </div>
                      </div>
                      
                      {currentOldPrice > currentPrice && currentOldPrice > 0 && (
                        <div className="mt-1.5 flex items-center gap-2">
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                            💰 {lang === "ar" ? "وفر" : "Save"} {formatPrice(currentOldPrice - currentPrice, currency, lang)}
                          </span>
                        </div>
                      )}
                      {currentPrice >= currentOldPrice && currentPrice > 0 && currentOldPrice > 0 && (
                        <div className="mt-1.5 flex items-center gap-2 text-[10px] text-red-500">
                          <AlertCircle className="h-3 w-3" />
                          {lang === "ar" ? "السعر الجديد يجب أن يكون أقل" : "New price must be lower"}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              <div className="flex items-center gap-2 p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50">
                <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                <p className="text-[10px] text-amber-600 dark:text-amber-400">
                  {lang === "ar" 
                    ? "⚠️ كل فيرنت له سعر مستقل. حدد السعر الجديد والقديم لكل فيرنت" 
                    : "⚠️ Each variation has its own price. Set new and old price for each variation"}
                </p>
              </div>
            </div>
          )}

          {/* ===== إدخال السعر الجديد (بدون فيرنتات) ===== */}
          {!hasVariations && (
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <DollarSign className="h-4 w-4 text-[#2a655f]" />
                {lang === "ar" ? "السعر الجديد بعد الخصم" : "New Price After Discount"}
                <span className="text-red-500 text-xs">*</span>
              </Label>
              
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
                  <span className="text-sm font-bold text-[#2a655f]/60">ل.س</span>
                </div>
                <Input
                  type="number"
                  value={newPrice || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setNewPrice(val);
                    setError("");
                    
                    if (val <= 0) {
                      setError(lang === "ar" ? "السعر يجب أن يكون أكبر من 0" : "Price must be greater than 0");
                    } else if (val >= originalPrice) {
                      setError(lang === "ar" ? "السعر الجديد يجب أن يكون أقل من السعر الأصلي" : "New price must be less than original price");
                    }
                  }}
                  className="ps-12 h-11 text-base rounded-xl border-[#2a655f]/20 dark:border-[#2a655f]/30 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 bg-white dark:bg-slate-900"
                  placeholder={lang === "ar" ? "أدخل السعر الجديد..." : "Enter new price..."}
                  min={0}
                  max={originalPrice - 1}
                />
                {newPrice > 0 && newPrice < originalPrice && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                  </div>
                )}
                {newPrice >= originalPrice && newPrice > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <XCircle className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-500 text-xs">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </div>
              )}

              {/* عرض نسبة الخصم */}
              {isValid && (
                <div className="flex items-center gap-3 p-2.5 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/10">
                  <div className="flex items-center gap-2">
                    <Percent className="h-4 w-4 text-[#2a655f]" />
                    <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                      {lang === "ar" ? "الخصم:" : "Discount:"}
                    </span>
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-xs font-bold px-2.5 py-0.5">
                      {discountPercent}%
                    </Badge>
                  </div>
                  <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2a655f] to-[#3a8a82] transition-all duration-500"
                      style={{ width: `${Math.min(discountPercent, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== معاينة العرض ===== */}
          {isFormValid && (
            <div className="p-3 rounded-xl bg-[#2a655f]/5 dark:bg-[#2a655f]/10 border-2 border-[#2a655f]/20">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={product.cover_url || "/placeholder.png"}
                    alt={product.title_ar}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                  {hasVariations ? (
                    <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                      {product.variations.length} 🎨
                    </Badge>
                  ) : (
                    discountPercent > 0 && (
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                        -{discountPercent}%
                      </div>
                    )
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                    {product.title_ar}
                  </h4>
                  
                  {hasVariations ? (
                    <div className="mt-1">
                      <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-0 text-[9px]">
                        {lang === "ar" ? "عرض مع فيرنتات" : "Offer with variations"}
                      </Badge>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {lang === "ar" 
                          ? `تحديث أسعار ${product.variations.length} فيرنت` 
                          : `Updating ${product.variations.length} variations`}
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-xl font-bold text-red-600 dark:text-red-400">
                        {formatPrice(newPrice || 0, currency, lang)}
                      </span>
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(originalPrice, currency, lang)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* نصيحة */}
          {(isValid || (hasVariations && isFormValid)) && (
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-blue-700 dark:text-blue-300">
                  <span className="font-medium">
                    {lang === "ar" ? "💡 نصيحة:" : "💡 Tip:"}
                  </span>
                  <span className="text-blue-600/70 dark:text-blue-400/70">
                    {hasVariations
                      ? (lang === "ar"
                          ? ` العرض مع فيرنتات متعددة يزيد من فرص البيع`
                          : ` Offer with multiple variations increases sales chances`)
                      : (lang === "ar"
                          ? ` الخصم ${discountPercent}% سيجذب المزيد من العملاء`
                          : ` ${discountPercent}% discount will attract more customers`)
                    }
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== Footer ===== */}
        <div className="p-4 pt-3 border-t border-[#2a655f]/10 flex-shrink-0 flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 h-10 text-sm transition-all duration-300"
            disabled={isConverting}
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          
          <Button
            onClick={handleConfirm}
            disabled={!isFormValid || isConverting}
            className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 hover:scale-[1.02] h-10 text-sm transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConverting ? (
              <span className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                {lang === "ar" ? "جاري التحويل..." : "Converting..."}
              </span>
            ) : (
              <>
                <Gift className="h-3.5 w-3.5 mr-1.5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                {hasVariations 
                  ? (lang === "ar" ? "تحويل الكل" : "Convert All")
                  : (lang === "ar" ? "تحويل إلى عرض" : "Convert to Offer")
                }
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};