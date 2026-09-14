import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/i18n";
import { toast } from "sonner";
import { Star, X, Loader2, MessageCircle, Heart } from "lucide-react";
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

  const reset = () => {
    setRating(0);
    setHovered(0);
    setComment("");
  };

  const handleSubmit = async () => {
    if (!app.user?.id) {
      toast.error(isArabic ? "يجب تسجيل الدخول" : "Please login");
      return;
    }
    if (rating === 0) {
      toast.error(isArabic ? "الرجاء اختيار عدد النجوم" : "Please select a rating");
      return;
    }

    setLoading(true);
    try {
      // ✅ تحقق إنه ما قيّم من قبل
      const { data: existing } = await supabase
        .from("order_reviews")
        .select("id")
        .eq("order_id", orderId)
        .eq("user_id", app.user.id)
        .maybeSingle();

      if (existing) {
        // تحديث التقييم الموجود
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
        // إضافة تقييم جديد
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

      // ✅ إشعار للبائع إذا التقييم منخفض
      if (isLowRating) {
        const { data: orderData } = await supabase
          .from("orders")
          .select("seller_id, buyer_name, buyer_phone")
          .eq("id", orderId)
          .maybeSingle();

        if (orderData?.seller_id) {
          await supabase.from("notifications").insert({
            user_id: orderData.seller_id,
            type: "low_rating_alert",
            title_ar: `⚠️ تقييم منخفض (${rating} نجوم)`,
            body_ar: `العميل ${orderData.buyer_name || ""} قيّم الطلب بـ ${rating} نجوم.\n${comment.trim() ? `💬 التعليق: ${comment.trim()}` : "بدون تعليق"}`,
            title_en: `⚠️ Low rating (${rating} stars)`,
            body_en: `Customer ${orderData.buyer_name || ""} rated the order ${rating} stars.\n${comment.trim() ? `💬 Comment: ${comment.trim()}` : "No comment"}`,
            link_url: `/dashboard`,
            metadata: {
              order_id: orderId,
              rating,
              comment: comment.trim() || null,
            },
          });
        }
      }

      toast.success(
        isArabic ? "💚 شكراً لتقييمك!" : "💚 Thanks for your review!"
      );

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full shadow-2xl border-2 border-[#2a655f]/30 overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] p-5 text-white relative">
          <button
            onClick={() => {
              onOpenChange(false);
              reset();
            }}
            className="absolute top-3 end-3 h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-black">
                {isArabic ? "قيّم تجربتك" : "Rate your experience"}
              </h3>
              <p className="text-xs text-white/80">
                {isArabic ? "رأيك يهمنا 💚" : "Your opinion matters 💚"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* صورة + عنوان الطلب */}
          {(orderImage || orderTitle) && (
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
              {orderImage && (
                <img
                  src={orderImage}
                  alt={orderTitle || ""}
                  className="h-14 w-14 rounded-xl object-cover border border-slate-200"
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
            <div className="flex items-center justify-center gap-2" dir="ltr">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hovered || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    className="transition-all duration-200 hover:scale-125"
                    disabled={loading}
                  >
                    <Star
                      className={cn(
                        "h-10 w-10 transition-all duration-200",
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
              {isArabic
                ? "اكتب تعليقك (اختياري)"
                : "Write your comment (optional)"}
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={
                isLowRating
                  ? isArabic
                    ? "اكتب لنا المشكلة يلي واجهتك..."
                    : "Tell us what happened..."
                  : isArabic
                  ? "شاركنا رأيك بالطلب..."
                  : "Share your thoughts..."
              }
              rows={4}
              disabled={loading}
              className="rounded-2xl border-2 border-[#2a655f]/20 focus:border-[#2a655f]/50 resize-none"
              dir={isArabic ? "rtl" : "ltr"}
            />
          </div>

          {/* زر الإرسال */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || loading}
            className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white font-black shadow-lg shadow-[#2a655f]/30 transition-all hover:scale-[1.02] disabled:opacity-50"
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
        </div>
      </div>
    </div>
  );
}