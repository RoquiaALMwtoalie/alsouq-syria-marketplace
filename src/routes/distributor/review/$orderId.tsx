// src/routes/distributor/review/$orderId.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDeliveryOrders, useUpdateDeliveryOrderStatus } from "@/lib/queries";
import {
  Star, User, Truck, Package, MapPin, 
  Clock, Phone, Mail, Calendar, 
  ChevronLeft, CheckCircle, XCircle,
  MessageCircle, Send, AlertCircle,
  Loader2, Award, ThumbsUp, ThumbsDown,
  Smile, Meh, Frown, Heart, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/distributor/review/$orderId")({
  component: ReviewDistributorPage,
  head: ({ params }) => ({
    meta: [
      { title: `تقييم الموزع - Souqi` },
      { name: "description", content: "قم بتقييم الموزع بعد خدمة التوصيل" },
    ],
  }),
});

function ReviewDistributorPage() {
  const { orderId } = Route.useParams();
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState<string>("");

  // ✅ جلب بيانات الطلب
  const { data: orders = [], isLoading, refetch } = useDeliveryOrders(app.user?.id);
  const updateOrder = useUpdateDeliveryOrderStatus();

  // ✅ البحث عن الطلب
  const order = useMemo(() => {
    return orders.find((o: any) => o.id === orderId);
  }, [orders, orderId]);

  // ✅ الموزع
  const distributor = order?.distributor;

  // ✅ إحصائيات سريعة
  const stats = useMemo(() => {
    if (!distributor) return { rating: 0, orders: 0, reviews: 0 };
    return {
      rating: distributor.rating || 0,
      orders: distributor.completed_orders || 0,
      reviews: distributor.reviews_count || 0,
    };
  }, [distributor]);

  const isArabic = app.lang === "ar";

  // ✅ خيارات التقييم السريع
  const quickReviews = [
    { label: isArabic ? "👍 ممتاز" : "👍 Excellent", value: 5, emoji: "😍" },
    { label: isArabic ? "😊 جيد جداً" : "😊 Very Good", value: 4, emoji: "😊" },
    { label: isArabic ? "😐 جيد" : "😐 Good", value: 3, emoji: "😐" },
    { label: isArabic ? "😕 مقبول" : "😕 Fair", value: 2, emoji: "😕" },
    { label: isArabic ? "👎 سيء" : "👎 Poor", value: 1, emoji: "😞" },
  ];

  // ✅ إرسال التقييم
  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error(
        isArabic 
          ? "الرجاء اختيار تقييم للموزع" 
          : "Please select a rating for the distributor"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ 1. تحديث تقييم الموزع في delivery_orders
      await updateOrder.mutateAsync({
        id: orderId,
        status: order?.status || "delivered",
      });

      // ✅ 2. إضافة التقييم في جدول reviews (إذا موجود)
      if (distributor?.user_id) {
        const { error: reviewError } = await supabase
          .from("reviews")
          .insert({
            listing_id: order?.order_id || null,
            user_id: app.user?.id,
            rating: rating,
            comment: review || (isArabic ? "شكراً على الخدمة" : "Thank you for the service"),
            created_at: new Date().toISOString(),
          });

        if (reviewError) {
          console.error("Error saving review:", reviewError);
        }
      }

      // ✅ 3. تحديث بيانات الموزع (rating)
      if (distributor?.id) {
        const newRating = ((stats.rating * stats.reviews) + rating) / (stats.reviews + 1);
        const { error: updateError } = await supabase
          .from("distributors")
          .update({
            rating: newRating,
            reviews_count: (stats.reviews || 0) + 1,
          })
          .eq("id", distributor.id);

        if (updateError) {
          console.error("Error updating distributor rating:", updateError);
        }
      }

      setIsSuccess(true);
      toast.success(
        isArabic 
          ? "✅ تم إرسال تقييمك بنجاح! شكراً لك" 
          : "✅ Review submitted successfully! Thank you"
      );

      setTimeout(() => {
        navigate({ to: "/distributor/dashboard" });
      }, 3000);

    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(
        isArabic 
          ? "❌ حدث خطأ في إرسال التقييم" 
          : "❌ Error submitting review"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-2xl px-4 py-12">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-64 w-full mt-4 rounded-2xl" />
          <Skeleton className="h-32 w-full mt-4 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold">
            {isArabic ? "لم نجد الطلب" : "Order Not Found"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "لا يوجد طلب بهذا الرقم" 
              : "No order found with this ID"}
          </p>
          <Link to="/distributor/dashboard">
            <Button className="mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white">
              {isArabic ? "العودة للوحة التحكم" : "Back to Dashboard"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (order.status !== "delivered") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-10 w-10 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold">
            {isArabic ? "الطلب لم يتم توصيله بعد" : "Order Not Delivered Yet"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "يمكنك تقييم الموزع بعد اكتمال التوصيل" 
              : "You can review the distributor after delivery is completed"}
          </p>
          <Link to="/distributor/dashboard">
            <Button className="mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white">
              {isArabic ? "العودة للوحة التحكم" : "Back to Dashboard"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-emerald-500/20">
          <div className="h-24 w-24 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="h-12 w-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-emerald-500">
            {isArabic ? "✅ شكراً لك!" : "✅ Thank You!"}
          </h2>
          <p className="text-muted-foreground mt-2 text-lg">
            {isArabic 
              ? "تم إرسال تقييمك بنجاح" 
              : "Your review has been submitted"}
          </p>
          <div className="flex items-center justify-center gap-1 mt-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn(
                "h-8 w-8",
                i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
              )} />
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            {isArabic 
              ? "سيتم توجيهك إلى لوحة التحكم خلال ثوان..." 
              : "You will be redirected to dashboard in a few seconds..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-2xl px-4 py-6 md:py-8">
          <div className="flex items-center gap-3">
            <Link to="/distributor/dashboard" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {isArabic ? "لوحة التحكم" : "Dashboard"}
            </Link>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
                <Star className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {isArabic ? "⭐ تقييم الموزع" : "⭐ Rate Distributor"}
                </h1>
                <p className="text-white/80 text-xs">
                  {isArabic ? "شاركنا تجربتك مع الموزع" : "Share your experience with the distributor"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="mx-auto max-w-2xl px-4 py-8">
        
        {/* ===== ORDER INFO ===== */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5 text-[#2a655f]" />
              {isArabic ? "معلومات الطلب" : "Order Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{isArabic ? "رقم التتبع" : "Tracking"}</p>
                <p className="font-medium">{order.tracking_number || order.id.substring(0, 8)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{isArabic ? "تاريخ التوصيل" : "Delivery Date"}</p>
                <p className="font-medium">
                  {order.delivered_at 
                    ? new Date(order.delivered_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US")
                    : (isArabic ? "غير محدد" : "Not specified")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===== DISTRIBUTOR INFO ===== */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5 text-[#2a655f]" />
              {isArabic ? "الموزع" : "Distributor"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {distributor ? (
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center shrink-0">
                  {distributor.avatar_url ? (
                    <img 
                      src={distributor.avatar_url} 
                      alt="" 
                      className="h-full w-full object-cover rounded-full" 
                    />
                  ) : (
                    <User className="h-8 w-8 text-[#2a655f]" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg">
                    {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {Number(stats.rating).toFixed(1)}
                    </span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {stats.orders} {isArabic ? "طلب" : "orders"}
                    </span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span dir="ltr">{distributor.phone}</span>
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">
                {isArabic ? "لا يوجد موزع معين لهذا الطلب" : "No distributor assigned to this order"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ===== RATING ===== */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5 text-[#2a655f]" />
              {isArabic ? "تقييمك للموزع" : "Your Rating"}
            </CardTitle>
            <CardDescription>
              {isArabic 
                ? "اختر التقييم المناسب لخدمة التوصيل" 
                : "Choose the appropriate rating for the delivery service"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Stars */}
            <div className="flex items-center justify-center gap-2 py-4">
              {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => setRating(starValue)}
                    onMouseEnter={() => setHoverRating(starValue)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="group transition-all duration-200 hover:scale-110"
                  >
                    <Star className={cn(
                      "h-12 w-12 transition-all duration-200",
                      (hoverRating || rating) >= starValue
                        ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                        : "text-slate-200 dark:text-slate-600 group-hover:text-slate-300"
                    )} />
                  </button>
                );
              })}
            </div>

            {/* Quick Reviews */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
              {quickReviews.map((qr) => (
                <button
                  key={qr.value}
                  onClick={() => {
                    setRating(qr.value);
                    setSelectedEmoji(qr.emoji);
                  }}
                  className={cn(
                    "p-2 rounded-xl text-center transition-all duration-200",
                    rating === qr.value
                      ? "bg-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30"
                      : "bg-slate-50 dark:bg-slate-800 hover:bg-[#2a655f]/10"
                  )}
                >
                  <span className="text-2xl block">{qr.emoji}</span>
                  <span className="text-xs font-medium">{qr.label}</span>
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="mt-4 text-center">
                <p className="text-sm text-muted-foreground">
                  {isArabic 
                    ? `اخترت ${rating} ${rating === 1 ? 'نجمة' : rating === 2 ? 'نجمتين' : rating === 3 ? 'نجوم' : rating === 4 ? 'نجوم' : 'نجوم'}`
                    : `You selected ${rating} ${rating === 1 ? 'star' : 'stars'}`}
                  {selectedEmoji && ` ${selectedEmoji}`}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ===== REVIEW TEXT ===== */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-[#2a655f]" />
              {isArabic ? "تعليقك (اختياري)" : "Your Comment (Optional)"}
            </CardTitle>
            <CardDescription>
              {isArabic 
                ? "اكتب تجربتك مع الموزع (اختياري)" 
                : "Write your experience with the distributor (optional)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder={isArabic 
                ? "شاركنا تجربتك مع الموزع..." 
                : "Share your experience with the distributor..."}
              className="min-h-[120px] resize-none"
            />
            <div className="flex justify-end mt-2">
              <span className="text-xs text-muted-foreground">
                {review.length} / 500
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ===== SUBMIT ===== */}
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => navigate({ to: "/distributor/dashboard" })}
            className="flex-1 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
          >
            {isArabic ? "تخطي" : "Skip"}
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            disabled={isSubmitting || rating === 0}
            className="flex-1 bg-[#2a655f] hover:bg-[#3a8a82] text-white"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isArabic ? "جاري الإرسال..." : "Sending..."}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {isArabic ? "إرسال التقييم" : "Submit Review"}
              </>
            )}
          </Button>
        </div>

        {/* ===== NOTES ===== */}
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-[#2a655f] shrink-0 mt-0.5" />
            <p>
              {isArabic 
                ? "تقييمك يساعدنا في تحسين جودة الخدمة. جميع التقييمات تذهب مباشرة للموزع والإدارة." 
                : "Your rating helps us improve service quality. All ratings go directly to the distributor and management."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}