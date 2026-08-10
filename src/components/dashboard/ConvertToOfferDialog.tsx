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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ConvertToOfferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: any;
  onConfirm: (productId: string, newPrice: number) => void;
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

  useEffect(() => {
    if (product?.price) {
      const originalPrice = Number(product.price);
      const suggestedPrice = Math.round(originalPrice * 0.8);
      setNewPrice(suggestedPrice);
    }
  }, [product]);

  if (!product) return null;

  const originalPrice = Number(product.price);
  const discountPercent = originalPrice > 0 && newPrice > 0 && newPrice < originalPrice
    ? Math.round(((originalPrice - newPrice) / originalPrice) * 100)
    : 0;
  
  const isValid = newPrice > 0 && newPrice < originalPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-md rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 shadow-2xl shadow-[#2a655f]/10 p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* ===== Header ===== */}
        <div className="p-5 pb-3 border-b border-[#2a655f]/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 flex-shrink-0">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-[#2a655f]">
                {lang === "ar" ? "🎁 تحويل إلى عرض" : "🎁 Convert to Offer"}
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
        <div className="p-5 space-y-4">
          
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
                </div>
              </div>
            </div>
          </div>

          {/* إدخال السعر الجديد */}
          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2 text-slate-700 dark:text-slate-300">
              <DollarSign className="h-4 w-4 text-[#2a655f]" />
              {lang === "ar" ? "السعر الجديد بعد الخصم" : "New Price After Discount"}
              <span className="text-red-500 text-xs">*</span>
            </Label>
            
            <div className="relative">
              {/* ✅ ل.س بدلاً من $ */}
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

            {/* الخطأ */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-xs">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </div>
            )}
          </div>

          {/* معاينة العرض */}
          {isValid && (
            <div className="p-3 rounded-xl bg-[#2a655f]/5 dark:bg-[#2a655f]/10 border-2 border-[#2a655f]/20">
              <div className="flex items-start gap-3">
                <div className="relative flex-shrink-0">
                  <img
                    src={product.cover_url || "/placeholder.png"}
                    alt={product.title_ar}
                    className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                  {isValid && discountPercent > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg animate-pulse">
                      -{discountPercent}%
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 truncate">
                    {product.title_ar}
                  </h4>
                  
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xl font-bold text-red-600 dark:text-red-400">
                      {formatPrice(newPrice || 0, currency, lang)}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      {formatPrice(originalPrice, currency, lang)}
                    </span>
                  </div>

                  <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-[9px] mt-1">
                    🎯 {lang === "ar" ? "توفير" : "Save"} {formatPrice(originalPrice - newPrice, currency, lang)}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          {/* نصيحة */}
          {isValid && (
            <div className="p-2.5 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-start gap-2">
                <Sparkles className="h-3.5 w-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-[10px] text-blue-700 dark:text-blue-300">
                  <span className="font-medium">
                    {lang === "ar" ? "💡 نصيحة:" : "💡 Tip:"}
                  </span>
                  <span className="text-blue-600/70 dark:text-blue-400/70">
                    {lang === "ar"
                      ? ` الخصم ${discountPercent}% سيجذب المزيد من العملاء`
                      : ` ${discountPercent}% discount will attract more customers`}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ===== Footer ===== */}
        <div className="p-4 pt-3 border-t border-[#2a655f]/10 flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 h-10 text-sm transition-all duration-300"
          >
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          
          <Button
            onClick={() => {
              if (isValid) {
                onConfirm(product.id, newPrice);
              }
            }}
            disabled={!isValid || isConverting}
            className="flex-1 rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 hover:scale-[1.02] h-10 text-sm transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isConverting ? (
              <span className="flex items-center gap-2">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                {lang === "ar" ? "جاري التحويل..." : "Converting..."}
              </span>
            ) : (
              <>
                <Gift className="h-3.5 w-3.5 mr-1.5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                {lang === "ar" ? "تحويل إلى عرض" : "Convert to Offer"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};