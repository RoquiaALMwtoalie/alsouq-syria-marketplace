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

  // ✅ اقتراح سعر تلقائي (خصم 20%)
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
      <DialogContent className="max-w-lg rounded-2xl border-emerald-200/50 dark:border-emerald-800/30 bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-900/20">
        
        {/* Header */}
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Gift className="h-6 w-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold">
                {lang === "ar" ? "🎁 تحويل إلى عرض" : "🎁 Convert to Offer"}
              </DialogTitle>
              <DialogDescription>
                {lang === "ar"
                  ? `أدخل السعر الجديد للمنتج "${product.title_ar}"`
                  : `Enter the new price for "${product.title_ar}"`}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="space-y-6 py-4">
          
          {/* معلومات المنتج الحالي */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
            <div className="flex items-center gap-3">
              <img
                src={product.cover_url || "/placeholder.png"}
                alt={product.title_ar}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md"
              />
              <div>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                  {product.title_ar}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm text-muted-foreground">
                    {lang === "ar" ? "السعر الحالي:" : "Current price:"}
                  </span>
                  <span className="text-lg font-bold text-[#2a655f]">
                    {formatPrice(originalPrice, currency, lang)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* إدخال السعر الجديد */}
          <div className="space-y-3">
            <Label className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              {lang === "ar" ? "السعر الجديد بعد الخصم" : "New Price After Discount"}
            </Label>
            
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                className="pl-10 h-12 text-lg rounded-xl border-emerald-200/50 dark:border-emerald-800/30 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
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
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-emerald-500" />
                  <span className="text-sm font-medium">
                    {lang === "ar" ? "نسبة الخصم:" : "Discount:"}
                  </span>
                  <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-sm font-bold px-3 py-1">
                    {discountPercent}%
                  </Badge>
                </div>
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500"
                    style={{ width: `${Math.min(discountPercent, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* الخطأ */}
            {error && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>

          {/* معاينة العرض */}
          {isValid && (
            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 border-2 border-emerald-200/50 dark:border-emerald-800/30">
              <div className="flex items-start gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={product.cover_url || "/placeholder.png"}
                    alt={product.title_ar}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                  {isValid && discountPercent > 0 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                      -{discountPercent}%
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                    {product.title_ar}
                  </h4>
                  
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                      {formatPrice(newPrice || 0, currency, lang)}
                    </span>
                    <span className="text-sm text-muted-foreground line-through">
                      {formatPrice(originalPrice, currency, lang)}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-xs">
                      🎯 {lang === "ar" ? "توفير" : "Save"} {formatPrice(originalPrice - newPrice, currency, lang)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* نصيحة */}
          {isValid && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-blue-500 mt-0.5" />
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  <p className="font-medium">
                    {lang === "ar" ? "💡 نصيحة:" : "💡 Tip:"}
                  </p>
                  <p className="text-blue-600/70 dark:text-blue-400/70">
                    {lang === "ar"
                      ? `الخصم ${discountPercent}% سيجذب المزيد من العملاء`
                      : `${discountPercent}% discount will attract more customers`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* الأزرار */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 h-11 transition-all duration-300"
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
            className="flex-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-[1.02] h-11 transition-all duration-300 group"
          >
            {isConverting ? (
              <span className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                {lang === "ar" ? "جاري التحويل..." : "Converting..."}
              </span>
            ) : (
              <>
                <Gift className="h-4 w-4 mr-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" />
                {lang === "ar" ? "تحويل إلى عرض" : "Convert to Offer"}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};