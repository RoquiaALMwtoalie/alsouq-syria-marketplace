// src/routes/orders.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { useMyOrders, useCreateReview, useCreateComplaint } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, Truck, CheckCircle2, Clock, XCircle, 
  Loader2, ShoppingBag, Star, AlertTriangle, 
  MessageCircle, ChevronDown, ChevronUp, Eye,
  Calendar, CreditCard, Send, ThumbsUp, ThumbsDown
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "طلباتي — السوق لعندك" }] }),
});

function OrdersPage() {
  const app = useApp();
  const navigate = useNavigate();
  const { data: orders = [], isLoading, refetch } = useMyOrders(app.user?.id);
  const createReview = useCreateReview();
  const createComplaint = useCreateComplaint();
  
  // ✅ State
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [ratingOrder, setRatingOrder] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(0);
  const [isRating, setIsRating] = useState(false);
  
  // ✅ Complaint Dialog
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  // ============================================================
  // ✅ دالة تقييم المنتج
  // ============================================================
  const handleRateOrder = async (orderId: string, listingId: string, rating: number) => {
    if (!app.user) {
      toast.error("يرجى تسجيل الدخول أولاً");
      return;
    }
    
    setIsRating(true);
    
    try {
      await createReview.mutateAsync({
        listing_id: listingId,
        user_id: app.user.id,
        rating: rating,
      });
      
      toast.success("⭐ تم تقييم المنتج بنجاح!");
      setRatingOrder(null);
      setRatingValue(0);
      refetch(); // ✅ تحديث الطلبات عشان تظهر "تم التقييم"
      
    } catch (error) {
      console.error("Error rating:", error);
      toast.error("❌ فشل التقييم، حاول مرة أخرى");
    } finally {
      setIsRating(false);
    }
  };

  // ============================================================
  // ✅ دالة إرسال شكوى
  // ============================================================
  const handleSubmitComplaint = async () => {
    if (!app.user || !selectedOrder) return;
    
    if (!complaintSubject.trim() || !complaintDescription.trim()) {
      toast.warning("⚠️ يرجى ملء جميع الحقول");
      return;
    }
    
    setIsSubmittingComplaint(true);
    
    try {
      await createComplaint.mutateAsync({
        order_id: selectedOrder.id,
        user_id: app.user.id,
        subject: complaintSubject.trim(),
        description: complaintDescription.trim(),
      });
      
      setComplaintDialogOpen(false);
      setSelectedOrder(null);
      setComplaintSubject("");
      setComplaintDescription("");
      
    } catch (error) {
      console.error("Error submitting complaint:", error);
      toast.error("❌ فشل إرسال الشكوى");
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  // ============================================================
  // ✅ حالة الطلب - حسب enum عندك
  // ============================================================
  const getOrderStatus = (status: string) => {
    const map: Record<string, { label: string; color: string; icon: any; description: string }> = {
      pending: { 
        label: app.lang === "ar" ? "⏳ قيد الانتظار" : "⏳ Pending", 
        color: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
        icon: Clock,
        description: app.lang === "ar" ? "في انتظار موافقة البائع" : "Waiting for seller approval"
      },
      accepted: { 
        label: app.lang === "ar" ? "✅ تم القبول" : "✅ Accepted", 
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        icon: CheckCircle2,
        description: app.lang === "ar" ? "تم قبول الطلب من قبل البائع" : "Order accepted by seller"
      },
      completed: { 
        label: app.lang === "ar" ? "📦 مكتمل" : "📦 Completed", 
        color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        icon: CheckCircle2,
        description: app.lang === "ar" ? "تم تسليم الطلب بنجاح" : "Order delivered successfully"
      },
      rejected: { 
        label: app.lang === "ar" ? "❌ مرفوض" : "❌ Rejected", 
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        icon: XCircle,
        description: app.lang === "ar" ? "تم رفض الطلب من قبل البائع" : "Order rejected by seller"
      },
      cancelled: { 
        label: app.lang === "ar" ? "🚫 ملغي" : "🚫 Cancelled", 
        color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
        icon: XCircle,
        description: app.lang === "ar" ? "تم إلغاء الطلب" : "Order cancelled"
      },
    };
    return map[status] || map.pending;
  };

  // ============================================================
  // ✅ حالة التحميل
  // ============================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <Skeleton className="h-12 w-48 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-40 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="mx-auto max-w-4xl px-4">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-[#0d2e2a] text-white">
                <ShoppingBag className="h-6 w-6" />
              </div>
              {app.lang === "ar" ? "طلباتي" : "My Orders"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {orders.length} {app.lang === "ar" ? "طلب" : "orders"}
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-xl">
              {app.lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
            </Button>
          </Link>
        </div>

        {/* ===== ORDERS LIST ===== */}
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50">
            <div className="text-7xl mb-4">📦</div>
            <h3 className="text-2xl font-semibold">
              {app.lang === "ar" ? "لا توجد طلبات" : "No orders"}
            </h3>
            <p className="text-muted-foreground mt-2">
              {app.lang === "ar" 
                ? "لم تقم بأي طلب بعد، ابدأ التسوق الآن" 
                : "You haven't placed any orders yet"}
            </p>
            <Link to="/products">
              <Button className="mt-6 bg-[#0d2e2a] hover:bg-[#1a4f4a] text-white rounded-xl">
                {app.lang === "ar" ? "ابدأ التسوق" : "Start Shopping"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => {
              const status = getOrderStatus(order.status);
              const StatusIcon = status.icon;
              const isExpanded = expandedOrder === order.id;
              const isCompleted = order.status === 'completed';
              const hasReview = order.reviewed || false;
              
              return (
                <div 
                  key={order.id}
                  className="bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* ===== ORDER HEADER ===== */}
                  <div 
                    className="p-4 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
                          {order.listings?.cover_url ? (
                            <img 
                              src={order.listings.cover_url} 
                              alt={order.listings.title_ar}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <Package className="h-6 w-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold line-clamp-1">
                            {order.listings?.title_ar || app.lang === "ar" ? "منتج" : "Product"}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(order.created_at).toLocaleDateString(
                                app.lang === "ar" ? "ar-SA" : "en-US",
                                { day: 'numeric', month: 'short', year: 'numeric' }
                              )}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              {formatPrice(order.total, app.currency, app.lang)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge className={cn("border-0 flex items-center gap-1 px-3 py-1", status.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ===== ORDER DETAILS (EXPANDED) ===== */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 animate-fade-up">
                      <div className="grid gap-4">
                        
                        {/* ✅ حالة الطلب مع وصف */}
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <StatusIcon className={cn("h-5 w-5", status.color.replace('bg-', 'text-').replace('/10', ''))} />
                            <div>
                              <p className="font-semibold">{status.label}</p>
                              <p className="text-xs text-muted-foreground">{status.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* ✅ معلومات الطلب */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {app.lang === "ar" ? "رقم الطلب" : "Order ID"}
                            </p>
                            <p className="text-sm font-mono font-semibold">{order.id.slice(0, 12)}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {app.lang === "ar" ? "الكمية" : "Quantity"}
                            </p>
                            <p className="text-sm font-semibold">{order.quantity || 1}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                              {app.lang === "ar" ? "المجموع" : "Total"}
                            </p>
                            <p className="text-sm font-bold text-[#0d2e2a]">
                              {formatPrice(order.total, app.currency, app.lang)}
                            </p>
                          </div>
                        </div>

                        {/* ✅ زر عرض المنتج */}
                        <Link to="/listing/$id" params={{ id: order.listing_id }}>
                          <Button variant="outline" size="sm" className="w-full rounded-xl">
                            <Eye className="h-4 w-4 mr-2" />
                            {app.lang === "ar" ? "عرض المنتج" : "View Product"}
                          </Button>
                        </Link>

                        {/* ✅ ✅ ✅ التقييم (فقط إذا كان completed) */}
                        {isCompleted && (
                          <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl">
                            <div className="flex items-center gap-4">
                              <span className="text-sm font-medium text-muted-foreground">
                                {app.lang === "ar" ? "⭐ قيم المنتج:" : "⭐ Rate product:"}
                              </span>
                              
                              {hasReview ? (
                                <div className="flex items-center gap-2">
                                  <StarRating 
                                    rating={order.rating || 0} 
                                    readonly 
                                    size="md" 
                                  />
                                  <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">
                                    {app.lang === "ar" ? "✅ تم التقييم" : "✅ Rated"}
                                  </Badge>
                                </div>
                              ) : (
                                <StarRating
                                  rating={ratingOrder === order.id ? ratingValue : 0}
                                  onRatingChange={(value) => {
                                    setRatingOrder(order.id);
                                    setRatingValue(value);
                                    handleRateOrder(order.id, order.listing_id, value);
                                  }}
                                  readonly={isRating && ratingOrder === order.id}
                                  size="md"
                                />
                              )}
                            </div>
                          </div>
                        )}

                        {/* ✅ ✅ ✅ زر الشكوى (فقط إذا كان completed) */}
                        {isCompleted && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl border-amber-500/30 text-amber-600 hover:bg-amber-50 hover:border-amber-500 transition-all duration-300"
                            onClick={() => {
                              setSelectedOrder(order);
                              setComplaintDialogOpen(true);
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            {app.lang === "ar" ? "📢 تقديم شكوى" : "📢 Submit Complaint"}
                          </Button>
                        )}

                        {/* ✅ زر التواصل مع البائع (لغير الملغي والمكتمل) */}
                        {order.status !== 'cancelled' && order.status !== 'completed' && (
                          <Link to="/messages/$userId" params={{ userId: order.seller_id }}>
                            <Button variant="outline" size="sm" className="w-full rounded-xl border-blue-500/30 text-blue-600 hover:bg-blue-50 transition-all duration-300">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              {app.lang === "ar" ? "💬 التواصل مع البائع" : "💬 Contact Seller"}
                            </Button>
                          </Link>
                        )}

                        {/* ✅ حالة مرفوض - عرض سبب */}
                        {order.status === 'rejected' && (
                          <div className="p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30">
                            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                              <ThumbsDown className="h-4 w-4" />
                              {app.lang === "ar" 
                                ? "⚠️ تم رفض طلبك من قبل البائع" 
                                : "⚠️ Your order was rejected by the seller"}
                            </p>
                          </div>
                        )}

                        {/* ✅ حالة ملغي - عرض سبب */}
                        {order.status === 'cancelled' && (
                          <div className="p-4 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl border border-rose-200/50 dark:border-rose-800/30">
                            <p className="text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                              <ThumbsDown className="h-4 w-4" />
                              {app.lang === "ar" 
                                ? "🚫 تم إلغاء هذا الطلب" 
                                : "🚫 This order was cancelled"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== COMPLAINT DIALOG ===== */}
      <Dialog open={complaintDialogOpen} onOpenChange={setComplaintDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-[#0d2e2a]">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              {app.lang === "ar" ? "📢 تقديم شكوى" : "📢 Submit Complaint"}
            </DialogTitle>
            <DialogDescription>
              {app.lang === "ar" 
                ? `شكوى بخصوص الطلب رقم ${selectedOrder?.id?.slice(0, 12)}`
                : `Complaint for order #${selectedOrder?.id?.slice(0, 12)}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-[#0d2e2a] font-semibold">
                {app.lang === "ar" ? "الموضوع *" : "Subject *"}
              </Label>
              <Input
                value={complaintSubject}
                onChange={(e) => setComplaintSubject(e.target.value)}
                placeholder={app.lang === "ar" ? "مثال: تأخر في التوصيل" : "Example: Delivery delay"}
                className="rounded-xl border-slate-200/50 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[#0d2e2a] font-semibold">
                {app.lang === "ar" ? "تفاصيل الشكوى *" : "Complaint Details *"}
              </Label>
              <Textarea
                value={complaintDescription}
                onChange={(e) => setComplaintDescription(e.target.value)}
                placeholder={app.lang === "ar" 
                  ? "اكتب تفاصيل شكواك بالتفصيل..." 
                  : "Describe your complaint in detail..."}
                className="min-h-[120px] rounded-xl border-slate-200/50 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
              />
              <p className="text-xs text-muted-foreground">
                {app.lang === "ar" 
                  ? "📌 سيتم إرسال الشكوى إلى فريق الدعم وسنقوم بالرد عليك في أقرب وقت" 
                  : "📌 Your complaint will be sent to our support team and we will respond shortly"}
              </p>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setComplaintDialogOpen(false)}
              className="rounded-xl"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleSubmitComplaint}
              disabled={isSubmittingComplaint}
              className="bg-[#0d2e2a] hover:bg-[#1a4f4a] text-white rounded-xl transition-all duration-300 hover:scale-[1.02]"
            >
              {isSubmittingComplaint ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {app.lang === "ar" ? "إرسال الشكوى" : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OrdersPage;