// src/components/orders/OrderReviewDialog.tsx

import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/i18n";
import { toast } from "sonner";
import { Star, X, Loader2, MessageCircle, Heart, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface OrderReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderTitle?: string;
  orderImage?: string;
  onSubmitted?: () => void;
}

export function OrderReviewDialog({
  open,
  onOpenChange,
  orderId,
  orderTitle,
  orderImage,
  onSubmitted,
}: OrderReviewDialogProps) {
  const app = useApp();
  const isArabic = app.lang === "ar";

  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const isLowRating = rating > 0 && rating <= 2;
  const commentRequired = isLowRating;
  const commentEmpty = comment.trim().length === 0;

  const reset = () => {
    setRating(0);
    setHovered(0);
    setComment("");
  };

  // ============================================================
  // ✅ إشعار للمتجر (البائع) — يُرسل دائماً
  // ============================================================
  const notifySeller = async (
    sellerId: string,
    buyerName: string,
    ratingValue: number,
    commentText: string,
  ) => {
    try {
      const isLow = ratingValue <= 2;

      await supabase.from("notifications").insert({
        user_id: sellerId,
        type: isLow ? "low_rating_alert" : "new_rating",
        title_ar: isLow
          ? `⚠️ تقييم منخفض (${ratingValue} نجوم)`
          : `⭐ تقييم جديد (${ratingValue} نجوم)`,
        title_en: isLow
          ? `⚠️ Low rating (${ratingValue} stars)`
          : `⭐ New rating (${ratingValue} stars)`,
        body_ar: `العميل ${buyerName} قيّم الطلب بـ ${ratingValue} نجوم.\n${
          commentText ? `💬 التعليق: ${commentText}` : "بدون تعليق"
        }`,
        body_en: `Customer ${buyerName} rated the order ${ratingValue} stars.\n${
          commentText ? `💬 Comment: ${commentText}` : "No comment"
        }`,
        link_url: `/dashboard?tab=orders`,
        reference_id: orderId,
        metadata: {
          order_id: orderId,
          rating: ratingValue,
          comment: commentText || null,
          type: isLow ? "low_rating" : "normal_rating",
        },
      });

      console.log(`✅ Seller notified: rating ${ratingValue} stars`);
    } catch (error) {
      console.error("❌ Error notifying seller:", error);
    }
  };

  // ============================================================
  // ✅ إشعار للأدمن — يُرسل دائماً
  // ============================================================
  const notifyAdmin = async (
    buyerName: string,
    ratingValue: number,
    commentText: string,
    sellerName: string,
  ) => {
    try {
      // ✅ 1. جلب أول admin
      const { data: adminRole, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();

      if (roleError || !adminRole) {
        console.log("ℹ️ No admin found to notify");
        return;
      }

      const isLow = ratingValue <= 2;

      // ✅ 2. إرسال الإشعار للأدمن
      await supabase.from("notifications").insert({
        user_id: adminRole.user_id,
        type: isLow ? "low_rating_alert" : "new_rating",
        title_ar: isLow
          ? `⚠️ تقييم منخفض من عميل (${ratingValue} نجوم)`
          : `⭐ تقييم جديد من عميل (${ratingValue} نجوم)`,
        title_en: isLow
          ? `⚠️ Low rating from customer (${ratingValue} stars)`
          : `⭐ New rating from customer (${ratingValue} stars)`,
        body_ar: `العميل ${buyerName} قيّم طلبه من متجر "${sellerName}" بـ ${ratingValue} نجوم.\n${
          commentText ? `💬 التعليق: ${commentText}` : "بدون تعليق"
        }`,
        body_en: `Customer ${buyerName} rated their order from "${sellerName}" store ${ratingValue} stars.\n${
          commentText ? `💬 Comment: ${commentText}` : "No comment"
        }`,
        link_url: isLow ? `/admin?tab=complaints` : `/admin`,
        reference_id: orderId,
        metadata: {
          order_id: orderId,
          rating: ratingValue,
          comment: commentText || null,
          seller_name: sellerName,
          type: isLow ? "low_rating" : "normal_rating",
          customer_name: buyerName,
        },
      });

      console.log(`✅ Admin notified: rating ${ratingValue} stars`);
    } catch (error) {
      console.error("❌ Error notifying admin:", error);
    }
  };

  // ============================================================
  // ✅ إنشاء شكوى تلقائية — فقط عند التقييم السيئ (⭐1 أو ⭐2)
  // ============================================================
  const createComplaint = async (
    buyerId: string,
    sellerId: string | null,
    ratingValue: number,
    commentText: string,
  ) => {
    try {
      const { error } = await supabase.from("complaints").insert({
        order_id: orderId,
        user_id: buyerId,
        seller_id: sellerId,
        subject: `⚠️ تقييم سلبي (${ratingValue} ${
          ratingValue === 1
            ? isArabic
              ? "نجمة"
              : "star"
            : isArabic
            ? "نجمتين"
            : "stars"
        })`,
        description: commentText,
        status: "pending",
      });

      if (error) throw error;

      console.log(`✅ Complaint created for order ${orderId}`);
    } catch (error) {
      console.error("❌ Error creating complaint:", error);
      throw error;
    }
  };

  // ============================================================
  // ✅ الدالة الرئيسية — إرسال التقييم
  // ============================================================
  const handleSubmit = async () => {
    if (!app.user?.id) {
      toast.error(isArabic ? "يجب تسجيل الدخول" : "Please login");
      return;
    }
    if (rating === 0) {
      toast.error(isArabic ? "الرجاء اختيار عدد النجوم" : "Please select a rating");
      return;
    }
    // ✅ التعليق إجباري عند التقييم السيئ
    if (commentRequired && commentEmpty) {
      toast.error(
        isArabic
          ? "⚠️ الرجاء كتابة سبب التقييم السلبي"
          : "⚠️ Please write the reason for your low rating"
      );
      return;
    }

    setLoading(true);
    try {
      // ✅ 1. حفظ التقييم في order_reviews
      const { data: existing } = await supabase
        .from("order_reviews")
        .select("id")
        .eq("order_id", orderId)
        .eq("user_id", app.user.id)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from("order_reviews")
          .update({
            rating,
            comment: comment.trim() || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("order_reviews")
          .insert({
            order_id: orderId,
            user_id: app.user.id,
            rating,
            comment: comment.trim() || null,
          });
        if (error) throw error;
      }

      // ✅ 2. جلب بيانات الطلب (seller_id, buyer_name)
      const { data: orderData } = await supabase
        .from("orders")
        .select("seller_id, buyer_name, buyer_phone")
        .eq("id", orderId)
        .maybeSingle();

      const sellerId = orderData?.seller_id || null;
      const buyerName =
        orderData?.buyer_name || (isArabic ? "عميل" : "Customer");

      // ✅ 3. جلب اسم المتجر
      let sellerName = isArabic ? "المتجر" : "Store";
      if (sellerId) {
        const { data: sellerProfile } = await supabase
          .from("profiles")
          .select("store_name, full_name")
          .eq("id", sellerId)
          .maybeSingle();
        sellerName =
          sellerProfile?.store_name ||
          sellerProfile?.full_name ||
          (isArabic ? "المتجر" : "Store");
      }

      // ✅ 4. إشعار المتجر (البائع) — دائماً
      if (sellerId) {
        await notifySeller(sellerId, buyerName, rating, comment.trim());
      }

      // ✅ 5. إشعار الأدمن — دائماً
      await notifyAdmin(buyerName, rating, comment.trim(), sellerName);

      // ✅ 6. إذا كان التقييم سيئاً → إنشاء شكوى تلقائية
      if (isLowRating) {
        await createComplaint(
          app.user.id,
          sellerId,
          rating,
          comment.trim(),
        );

        toast.success(
          isArabic
            ? "💚 شكراً لتقييمك! تم إرسال شكوى للفريق المختص."
            : "💚 Thanks for your review! A complaint has been sent to the team.",
          { duration: 5000 }
        );
      } else {
        toast.success(
          isArabic ? "💚 شكراً لتقييمك!" : "💚 Thanks for your review!",
          { duration: 3000 }
        );
      }

      reset();
      onOpenChange(false);
      onSubmitted?.();
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error(
        isArabic
          ? `فشل إرسال التقييم: ${error.message}`
          : `Failed to submit review: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-2 sm:p-4">
      <div
        className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border-2 border-[#2a655f]/30 overflow-hidden flex flex-col"
        style={{
          maxHeight: 'calc(100dvh - 1rem)',
        }}
      >

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] p-4 sm:p-5 text-white relative shrink-0 rounded-t-3xl">
          <button
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
            className="absolute top-3 end-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-black truncate">
                {isArabic ? "قيّم تجربتك" : "Rate your experience"}
              </h3>
              <p className="text-xs text-white/80">
                {isArabic ? "رأيك يهمنا 💚" : "Your opinion matters 💚"}
              </p>
            </div>
          </div>
        </div>

        {/* ✅ CONTENT — قابل للتمرير */}
        <div
          className="p-4 sm:p-5 space-y-4 sm:space-y-5 overflow-y-auto flex-1"
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {/* صورة + عنوان الطلب */}
          {(orderImage || orderTitle) && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              {orderImage && (
                <img
                  src={orderImage}
                  alt={orderTitle || ""}
                  className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover border border-slate-200 shrink-0"
                />
              )}
              <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-2">
                {orderTitle || (isArabic ? "طلبك" : "Your order")}
              </p>
            </div>
          )}

          {/* النجوم */}
          <div className="text-center">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">
              {orderTitle
                ? (isArabic
                    ? `كيف كانت تجربتك من متجر "${orderTitle}"؟`
                    : `How was your experience from "${orderTitle}" store?`)
                : (isArabic ? "كيف كانت تجربتك؟" : "How was your experience?")}
            </p>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hovered || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-all duration-200 hover:scale-125 cursor-pointer"
                    disabled={loading}
                  >
                    <Star
                      className={cn(
                        "h-9 w-9 sm:h-10 sm:w-10 transition-all duration-200",
                        active
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                          : "text-slate-300 dark:text-slate-600"
                      )}
                    />
                  </button>
                );
              })}
            </div>
            {rating > 0 && (
              <p className="mt-2 text-sm font-bold text-[#2a655f]">
                {rating === 1 && (isArabic ? "😞 سيء جداً" : "😞 Very bad")}
                {rating === 2 && (isArabic ? "😕 سيء" : "😕 Bad")}
                {rating === 3 && (isArabic ? "😐 عادي" : "😐 Okay")}
                {rating === 4 && (isArabic ? "😊 جيد" : "😊 Good")}
                {rating === 5 && (isArabic ? "🤩 ممتاز" : "🤩 Excellent")}
              </p>
            )}
          </div>

          {/* رسالة الاعتذار للتقييم المنخفض */}
          {isLowRating && (
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-2xl border-2 border-amber-200 dark:border-amber-800/50 animate-in fade-in slide-in-from-top-3 duration-300">
              <p className="text-sm font-bold text-amber-800 dark:text-amber-200 mb-1">
                {isArabic ? "🙏 نعتذر عن سوء التجربة" : "🙏 We apologize for the bad experience"}
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                {isArabic
                  ? "اكتب لنا المشكلة يلي واجهتك بالطلب وسوف نراجعها ونتواصل معك مع كامل اعتذاراتنا الشديدة."
                  : "Tell us the problem you faced with the order and we will review it and contact you with our sincere apologies."}
              </p>
            </div>
          )}

          {/* الكومنت */}
          <div>
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2">
              <MessageCircle className="h-4 w-4 text-[#2a655f]" />
              {commentRequired
                ? (isArabic
                    ? "اكتب سبب التقييم السلبي *"
                    : "Write the reason for your low rating *")
                : (isArabic
                    ? "اكتب تعليقك (اختياري)"
                    : "Write your comment (optional)")}
              {commentRequired && (
                <span className="text-red-500 text-base font-black">*</span>
              )}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isLowRating
                  ? isArabic
                    ? "اكتب لنا المشكلة يلي واجهتك... (مطلوب)"
                    : "Tell us what happened... (required)"
                  : isArabic
                  ? "شاركنا رأيك بالطلب..."
                  : "Share your thoughts..."
              }
              rows={3}
              disabled={loading}
              className={cn(
                "rounded-2xl border-2 resize-none transition-all",
                "text-base sm:text-sm",
                commentRequired && commentEmpty
                  ? "border-red-400/60 focus:border-red-500 focus:ring-red-500/20"
                  : "border-[#2a655f]/20 focus:border-[#2a655f]/50"
              )}
              dir={isArabic ? "rtl" : "ltr"}
            />
            {/* ✅ تنبيه إذا التعليق مطلوب وفارغ */}
            {commentRequired && commentEmpty && (
              <p className="mt-2 text-xs text-red-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                <AlertCircle className="h-3.5 w-3.5" />
                {isArabic
                  ? "⚠️ التعليق إجباري عند التقييم السلبي — ساعدنا نفهم المشكلة"
                  : "⚠️ Comment is required for low ratings — help us understand the issue"}
              </p>
            )}
          </div>

          {/* زر الإرسال */}
          <Button
            onClick={handleSubmit}
            disabled={
              rating === 0 ||
              loading ||
              (commentRequired && commentEmpty)
            }
            className={cn(
              "w-full h-12 rounded-2xl font-black shadow-lg transition-all",
              "text-base sm:text-sm",
              commentRequired && commentEmpty
                ? "bg-slate-300 dark:bg-slate-700 text-slate-500 cursor-not-allowed"
                : "bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-[#2a655f]/30 hover:scale-[1.02]"
            )}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {isArabic ? "جاري الإرسال..." : "Submitting..."}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                {isArabic ? "إرسال التقييم" : "Submit Review"}
              </span>
            )}
          </Button>

          {/* ✅ ملاحظة إضافية للتقييم السلبي */}
          {commentRequired && (
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5 animate-in fade-in duration-300">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              {isArabic
                ? "سيتم إرسال شكوى تلقائياً إلى فريق الدعم"
                : "A complaint will be sent automatically to the support team"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}