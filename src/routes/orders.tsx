// src/routes/orders.tsx - الكود المصحح بالكامل مع دعم صور الفيرنتات

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, lazy, Suspense } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { useMyOrders, useCreateReview, useCreateComplaint } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, Truck, CheckCircle2, Clock, XCircle, 
  Loader2, ShoppingBag, Star, AlertTriangle, 
  ChevronDown, ChevronUp, Eye,
  Calendar, CreditCard, Send, ThumbsUp, ThumbsDown,
  User, Store, Sparkles, Zap, Rocket, Shield, Award, Timer,
  Layers, MessageCircle, Phone
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { StarRating } from "@/components/StarRating";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { OptimizedImage } from "@/components/OptimizedImage";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
  head: () => ({ meta: [{ title: "طلباتي — السوق لعندك" }] }),
});

// ✅ ✅ ✅ دالة الحصول على صورة المنتج الصحيحة (مع دعم الفيرنتات من metadata)
function getProductImage(item: any) {
  const listing = item.listings || item;
  
  // ✅ 1. الأولوية الأولى: metadata.variation_image (من order_items)
  if (item.metadata?.variation_image) {
    return item.metadata.variation_image;
  }
  
  // ✅ 2. الثاني: metadata.product_cover
  if (item.metadata?.product_cover) {
    return item.metadata.product_cover;
  }
  
  // ✅ 3. الثالث: selected_options.variation_image
  if (item.selected_options?.variation_image) {
    return item.selected_options.variation_image;
  }
  
  // ✅ 4. الرابع: variation_snapshot.image_url
  if (item.variation_snapshot?.image_url) {
    return item.variation_snapshot.image_url;
  }
  
  // ✅ 5. الخامس: من selected_options.selected_variation_id
  if (item.selected_options?.selected_variation_id) {
    const variations = listing?.variations || [];
    const variation = variations.find((v: any) => v.id === item.selected_options.selected_variation_id);
    if (variation?.image_url) return variation.image_url;
    if (variation?.color_id) {
      const colors = listing?.colors || [];
      const color = colors.find((c: any) => c.id === variation.color_id);
      if (color?.image_url) return color.image_url;
    }
  }
  
  // ✅ 6. السادس: selected_variation_id القديم
  if (item.selected_variation_id) {
    const variations = listing?.variations || [];
    const variation = variations.find((v: any) => v.id === item.selected_variation_id);
    if (variation?.image_url) return variation.image_url;
    if (variation?.color_id) {
      const colors = listing?.colors || [];
      const color = colors.find((c: any) => c.id === variation.color_id);
      if (color?.image_url) return color.image_url;
    }
    if (variation?.combination) {
      const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
      let colorValue = null;
      for (const key of colorKeys) {
        if (variation.combination[key]) {
          colorValue = variation.combination[key];
          break;
        }
      }
      if (colorValue) {
        const colors = listing?.colors || [];
        const color = colors.find((c: any) => 
          c.color_name_ar === colorValue || c.color_name_en === colorValue
        );
        if (color?.image_url) return color.image_url;
      }
    }
  }
  
  // ✅ 7. السابع: من variation_combination
  if (item.variation_combination?.colors) {
    const colorName = item.variation_combination.colors;
    const colors = listing?.colors || [];
    const color = colors.find((c: any) => 
      c.color_name_ar === colorName || c.color_name_en === colorName
    );
    if (color?.image_url) return color.image_url;
  }
  
  // ✅ 8. أخيراً: cover_url
  return listing?.cover_url || null;
}

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
  const [isCancelling, setIsCancelling] = useState<string | null>(null);
  
  // ✅ Complaint Dialog
  const [complaintDialogOpen, setComplaintDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [complaintSubject, setComplaintSubject] = useState("");
  const [complaintDescription, setComplaintDescription] = useState("");
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  // ============================================================
  // ✅ ✅ ✅ تجميع الطلبات حسب معرف الطلب (order_id) مع دعم order_items
  // ============================================================
const groupedOrders = useMemo(() => {
    const groups: Record<string, {
      orderId: string;
      storeId: string;
      storeName: string;
      storeLogo: string | null;
      storePhone: string | null;
      items: any[];
      totalItems: number;
      totalPrice: number;
      totalWithDelivery: number;
      deliveryFee: number;
      promoDiscount: number;
      status: string;
      createdAt: string;
      updatedAt: string;
      buyerName: string;
      buyerPhone: string;
      notes: string;
      rejectionReason: string | null;
    }> = {};

    orders.forEach((order: any) => {
      const orderId = order.id;
      const storeId = order.seller_id || 'unknown';
      
      // ✅ ✅ ✅ جلب اسم المتجر من أول عنصر في order_items أو من listings
      let storeName = '';
      let storeLogo: string | null = null;
      let storePhone: string | null = null;
      
      // ✅ أولاً: حاول جلب من order_items
      if (order.order_items && order.order_items.length > 0) {
        const firstItem = order.order_items[0];
        const listing = firstItem?.listings;
        if (listing?.profile) {
          storeName = listing.profile.store_name || 
                      listing.profile.full_name || 
                      (app.lang === "ar" ? "متجر" : "Store");
          storeLogo = listing.profile.store_logo_url || null;
          storePhone = listing.profile.store_phone || null;
        } else if (listing) {
          storeName = app.lang === "ar" ? "متجر" : "Store";
        }
      }
      
      // ✅ ثانياً: إذا ما وجدنا من order_items، استخدم listings القديم
      if (!storeName && order.listings?.profile) {
        storeName = order.listings.profile.store_name || 
                    order.listings.profile.full_name || 
                    (app.lang === "ar" ? "متجر" : "Store");
        storeLogo = order.listings.profile.store_logo_url || null;
        storePhone = order.listings.profile.store_phone || null;
      }
      
      // ✅ ثالثاً: إذا ما وجدنا نهائياً
      if (!storeName) {
        storeName = app.lang === "ar" ? "متجر" : "Store";
      }

      if (!groups[orderId]) {
        groups[orderId] = {
          orderId,
          storeId,
          storeName,
          storeLogo,
          storePhone,
          items: [],
          totalItems: 0,
          totalPrice: 0,
          totalWithDelivery: 0,
          deliveryFee: 0,
          promoDiscount: 0,
          status: order.status,
          createdAt: order.created_at,
          updatedAt: order.updated_at,
          buyerName: order.buyer_name || (app.lang === "ar" ? "عميل" : "Customer"),
          buyerPhone: order.buyer_phone || '',
          notes: order.notes || '',
          rejectionReason: order.rejection_reason || null,
        };
      }

      // ✅ ✅ ✅ إضافة العناصر من order_items أو من order نفسه
      let itemsToAdd = [];
      
      if (order.order_items && order.order_items.length > 0) {
        // ✅ استخدام order_items
        itemsToAdd = order.order_items.map((item: any) => ({
          ...item,
          // ✅ التأكد من وجود listings
          listings: item.listings || null,
          // ✅ إضافة الحقول المفقودة للتوافق
          id: item.id,
          listing_id: item.listing_id,
          quantity: item.quantity,
          total: Number(item.price) * item.quantity,
          price: item.price,
          status: order.status,
          created_at: order.created_at,
          order_id: order.id,
          // ✅ ✅ ✅ الاحتفاظ ببيانات الفيرنتات المختارة (مهم لصورة الفيرنت)
          selected_variation_id: item.selected_options?.selected_variation_id || item.selected_variation_id || order.selected_variation_id || null,
          variation_snapshot: item.variation_snapshot || order.variation_snapshot || null,
          // ✅ ✅ ✅ إضافة metadata و selected_options
          metadata: item.metadata || null,
          selected_options: item.selected_options || null,
          variation_combination: item.variation_combination || null,
        }));
      } else {
        // ✅ للتوافق مع الطلبات القديمة (بدون order_items)
        itemsToAdd = [{
          ...order,
          listings: order.listings || null,
          order_id: order.id,
          selected_variation_id: order.selected_options?.selected_variation_id || order.selected_variation_id || null,
          variation_snapshot: order.variation_snapshot || null,
          metadata: order.metadata || null,
          selected_options: order.selected_options || null,
          variation_combination: order.variation_combination || null,
        }];
      }
      
      // ✅ إضافة العناصر إلى المجموعة
      itemsToAdd.forEach((item: any) => {
        groups[orderId].items.push(item);
      });
      
      // ✅ حساب الإجماليات
      groups[orderId].totalItems += itemsToAdd.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
      groups[orderId].totalPrice += itemsToAdd.reduce((sum: number, item: any) => sum + (Number(item.total) || Number(item.price) * (item.quantity || 1) || 0), 0);
      
      // ✅ ✅ ✅ إضافة الإجمالي الكامل من الطلب (بما في ذلك التوصيل والخصم)
      const totalWithDelivery = order.total_with_delivery || 
        (Number(order.total || 0) + Number(order.delivery_fee || 0) - Number(order.promo_discount || 0));
      
      groups[orderId].totalWithDelivery += totalWithDelivery;
      groups[orderId].deliveryFee += Number(order.delivery_fee || 0);
      groups[orderId].promoDiscount += Number(order.promo_discount || 0);

      // ✅ ✅ ✅ LOG 1: طباعة بيانات كل طلب
      console.log(`📊 [Orders] Order ${orderId}:`, {
        total: order.total,
        delivery_fee: order.delivery_fee,
        promo_discount: order.promo_discount,
        total_with_delivery: order.total_with_delivery,
        calculated: totalWithDelivery,
        final_total: groups[orderId].totalWithDelivery,
        final_delivery: groups[orderId].deliveryFee,
        final_promo: groups[orderId].promoDiscount,
      });
      
      // ✅ تحديث الحالة (أعلى أولوية: pending > accepted > shipped > delivered > rejected > cancelled)
      const statusPriority: Record<string, number> = {
        pending: 5,
        accepted: 4,
        shipped: 3,
        assigned: 3,
        delivered: 2,
        completed: 2,
        rejected: 1,
        cancelled: 0,
      };
      
      const currentPriority = statusPriority[groups[orderId].status] || 0;
      const newPriority = statusPriority[order.status] || 0;
      
      if (newPriority > currentPriority) {
        groups[orderId].status = order.status;
      }
    });

    // ✅ ✅ ✅ LOG 2: طباعة جميع المجموعات قبل الـ return
    console.log("📊 [Orders] All grouped orders:", Object.values(groups));
    console.log("📊 [Orders] Total orders:", Object.values(groups).length);

    // ✅ تحويل إلى مصفوفة وترتيب حسب التاريخ (الأحدث أولاً)
    const sorted = Object.values(groups).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // ✅ ✅ ✅ LOG 3: طباعة أول طلب بعد الترتيب
    if (sorted.length > 0) {
      console.log("📊 [Orders] First order after sorting:", {
        orderId: sorted[0].orderId,
        totalPrice: sorted[0].totalPrice,
        deliveryFee: sorted[0].deliveryFee,
        promoDiscount: sorted[0].promoDiscount,
        totalWithDelivery: sorted[0].totalWithDelivery,
      });
    }

    return sorted;
  }, [orders, app.lang]);

  // ============================================================
  // ✅ ✅ ✅ دالة إلغاء الطلب كامل (وليس كل منتج على حدة)
  // ============================================================
  const handleCancelOrder = async (orderId: string) => {
    if (!app.user) return;
    
    if (!confirm(app.lang === "ar" 
      ? "⚠️ هل أنت متأكد من رغبتك في إلغاء هذا الطلب بالكامل؟ هذا الإجراء لا يمكن التراجع عنه."
      : "⚠️ Are you sure you want to cancel this entire order? This action cannot be undone."
    )) return;
    
    setIsCancelling(orderId);
    
    try {
      // ✅ تحديث حالة الطلب إلى cancelled
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId)
        .eq("buyer_id", app.user.id);
      
      if (error) throw error;
      
      toast.success(app.lang === "ar" ? "✅ تم إلغاء الطلب بالكامل بنجاح" : "✅ Order cancelled successfully");
      refetch();
      
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error(app.lang === "ar" ? "❌ فشل إلغاء الطلب" : "❌ Failed to cancel order");
    } finally {
      setIsCancelling(null);
    }
  };

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
      refetch();
      
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
      // ✅ نرسل شكوى على أول منتج في الطلبية
      const firstItem = selectedOrder.items[0];
      
      await createComplaint.mutateAsync({
        order_id: firstItem.order_id || firstItem.id,
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
  // ✅ حالة الطلب
  // ============================================================
  const getOrderStatus = (status: string) => {
    const map: Record<string, { label: string; color: string; icon: any; description: string; bg: string; border: string }> = {
      pending: { 
        label: app.lang === "ar" ? "⏳ قيد الانتظار" : "⏳ Pending", 
        color: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-50/80 dark:bg-amber-950/30",
        border: "border-amber-200/60 dark:border-amber-800/40",
        icon: Timer,
        description: app.lang === "ar" ? "في انتظار موافقة البائع" : "Waiting for seller approval"
      },
      accepted: { 
        label: app.lang === "ar" ? "✅ تم القبول" : "✅ Accepted", 
        color: "text-[#2a655f] dark:text-[#3a8a82]",
        bg: "bg-[#2a655f]/5 dark:bg-[#2a655f]/20",
        border: "border-[#2a655f]/20 dark:border-[#2a655f]/30",
        icon: CheckCircle2,
        description: app.lang === "ar" ? "تم قبول الطلب من قبل البائع" : "Order accepted by seller"
      },
      shipped: { 
        label: app.lang === "ar" ? "🚚 تم الشحن" : "🚚 Shipped", 
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50/80 dark:bg-indigo-950/30",
        border: "border-indigo-200/60 dark:border-indigo-800/40",
        icon: Truck,
        description: app.lang === "ar" ? "تم شحن الطلب بواسطة شركة التوصيل" : "Order shipped by delivery company"
      },
      assigned: { 
        label: app.lang === "ar" ? "📋 تم التعيين" : "📋 Assigned", 
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50/80 dark:bg-purple-950/30",
        border: "border-purple-200/60 dark:border-purple-800/40",
        icon: User,
        description: app.lang === "ar" ? "تم تعيين موزع لتوصيل الطلب" : "Distributor assigned for delivery"
      },
      delivered: { 
        label: app.lang === "ar" ? "📦 تم التوصيل" : "📦 Delivered", 
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
        border: "border-emerald-200/60 dark:border-emerald-800/40",
        icon: CheckCircle2,
        description: app.lang === "ar" ? "تم توصيل الطلب بنجاح" : "Order delivered successfully"
      },
      completed: { 
        label: app.lang === "ar" ? "✅ مكتمل" : "✅ Completed", 
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50/80 dark:bg-emerald-950/30",
        border: "border-emerald-200/60 dark:border-emerald-800/40",
        icon: Award,
        description: app.lang === "ar" ? "تم تسليم الطلب بنجاح" : "Order completed successfully"
      },
      rejected: { 
        label: app.lang === "ar" ? "❌ مرفوض" : "❌ Rejected", 
        color: "text-red-600 dark:text-red-400",
        bg: "bg-red-50/80 dark:bg-red-950/30",
        border: "border-red-200/60 dark:border-red-800/40",
        icon: XCircle,
        description: app.lang === "ar" ? "تم رفض الطلب من قبل البائع" : "Order rejected by seller"
      },
      cancelled: { 
        label: app.lang === "ar" ? "🚫 ملغي" : "🚫 Cancelled", 
        color: "text-rose-600 dark:text-rose-400",
        bg: "bg-rose-50/80 dark:bg-rose-950/30",
        border: "border-rose-200/60 dark:border-rose-800/40",
        icon: XCircle,
        description: app.lang === "ar" ? "تم إلغاء الطلب" : "Order cancelled"
      },
    };
    return map[status] || map.pending;
  };

  // ============================================================
  // ✅ التحقق من إمكانية الإلغاء (فقط pending)
  // ============================================================
  const canCancel = (status: string) => {
    return status === 'pending';
  };

  // ============================================================
  // ✅ التحقق من إمكانية التقييم
  // ============================================================
  const canRate = (status: string) => {
    return status === 'completed' || status === 'delivered';
  };

  // ============================================================
  // ✅ التحقق من الطلبات النشطة
  // ============================================================
  const isActiveOrder = (status: string) => {
    return status === 'pending' || status === 'accepted' || status === 'shipped' || status === 'assigned';
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
              <div className="p-2 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white shadow-lg shadow-[#0d2e2a]/30">
                <ShoppingBag className="h-6 w-6" />
              </div>
              {app.lang === "ar" ? "طلباتي" : "My Orders"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#2a655f]" />
              {groupedOrders.length} {app.lang === "ar" ? "طلب" : "orders"} • {orders.length} {app.lang === "ar" ? "منتج" : "items"}
            </p>
          </div>
          <Link to="/">
            <Button variant="outline" className="rounded-xl border-[#2a655f]/20 hover:bg-[#2a655f]/10 hover:border-[#2a655f]/40 transition-all duration-300">
              {app.lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
            </Button>
          </Link>
        </div>

        {/* ===== ORDERS LIST (GROUPED BY ORDER ID) ===== */}
        {groupedOrders.length === 0 ? (
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
              <Button className="mt-6 bg-[#0d2e2a] hover:bg-[#1a4f4a] text-white rounded-xl shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 hover:scale-105">
                {app.lang === "ar" ? "ابدأ التسوق" : "Start Shopping"}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {groupedOrders.map((group) => {
              const status = getOrderStatus(group.status);
              const StatusIcon = status.icon;
              const isExpanded = expandedOrder === group.orderId;
              const isActive = isActiveOrder(group.status);
              
              // ✅ هل يمكن إلغاء الطلب كامل؟ (فقط إذا كانت الحالة pending)
              const canCancelOrder = canCancel(group.status);
              
              // ✅ هل يمكن تقييم أي منتج في الطلبية؟
              const hasRateableItem = group.items.some((o: any) => canRate(o.status));
              
              // ✅ هل جميع المنتجات مرفوضة؟
              const allRejected = group.items.every((o: any) => o.status === 'rejected');
              
              // ✅ هل جميع المنتجات ملغية؟
              const allCancelled = group.items.every((o: any) => o.status === 'cancelled');
              
              return (
                <div 
                  key={group.orderId}
                  className={cn(
                    "bg-white dark:bg-slate-900/90 rounded-2xl overflow-hidden transition-all duration-500 shadow-sm hover:shadow-xl",
                    "border",
                    isActive 
                      ? "border-[#2a655f]/30 dark:border-[#2a655f]/40 shadow-[#2a655f]/10 hover:shadow-[#2a655f]/25" 
                      : "border-slate-200/50 dark:border-slate-700/50 hover:shadow-md"
                  )}
                >
                  {/* ===== ORDER HEADER ===== */}
                  <div 
                    className={cn(
                      "p-4 cursor-pointer transition-all duration-300",
                      isActive 
                        ? "bg-gradient-to-r from-[#2a655f]/5 via-[#2a655f]/10 to-[#2a655f]/5 dark:from-[#2a655f]/10 dark:via-[#2a655f]/20 dark:to-[#2a655f]/10 hover:from-[#2a655f]/10 hover:via-[#2a655f]/20 hover:to-[#2a655f]/10" 
                        : "hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                    )}
                    onClick={() => setExpandedOrder(isExpanded ? null : group.orderId)}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      
                      {/* ✅ القسم الأيسر: لوغو المتجر + اسمه + عدد المنتجات + التاريخ + السعر */}
                      <div className="flex items-center gap-4">
                        
                        {/* ✅ لوغو المتجر */}
                        <div className="relative h-14 w-14 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-[#2a655f]/20 dark:border-[#2a655f]/30 shadow-md hover:shadow-xl transition-all duration-300">
                          {group.storeLogo ? (
                            <OptimizedImage
                              src={group.storeLogo}
                              alt={group.storeName}
                              width={56}
                              height={56}
                              quality={80}
                              objectFit="cover"
                              className="h-full w-full transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] text-white font-bold text-xl">
                              {group.storeName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          {isActive && (
                            <div className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 animate-pulse ring-2 ring-white dark:ring-slate-900 shadow-lg shadow-emerald-400/50">
                              <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping" />
                            </div>
                          )}
                        </div>
                        
                        {/* ✅ معلومات المتجر + الطلبية */}
                        <div>
                          <div className="flex items-center gap-2">
                            <Store className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#3a8a82]" />
                            <span className="font-bold text-base text-slate-800 dark:text-white">
                              {group.storeName}
                            </span>
                            {isActive && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[9px] font-bold border border-emerald-500/30 animate-pulse">
                                <Zap className="h-2.5 w-2.5" />
                                {app.lang === "ar" ? "نشط" : "Active"}
                              </span>
                            )}
                            {allRejected && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/20 text-red-600 dark:text-red-400 text-[9px] font-bold border border-red-500/30">
                                <XCircle className="h-2.5 w-2.5" />
                                {app.lang === "ar" ? "مرفوض" : "Rejected"}
                              </span>
                            )}
                            {allCancelled && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-600 dark:text-rose-400 text-[9px] font-bold border border-rose-500/30">
                                <XCircle className="h-2.5 w-2.5" />
                                {app.lang === "ar" ? "ملغي" : "Cancelled"}
                              </span>
                            )}
                          </div>
                          
                          {/* ✅ عدد المنتجات + التاريخ + السعر الإجمالي (مع الخصم والتوصيل) */}
<div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
  <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
    <Layers className="h-3 w-3 text-[#2a655f]" />
    {group.totalItems} {app.lang === "ar" ? "منتج" : "items"}
  </span>
  <span className="text-muted-foreground/30">•</span>
  <span className="flex items-center gap-1">
    <Calendar className="h-3 w-3" />
    {new Date(group.createdAt).toLocaleDateString(
      app.lang === "ar" ? "ar-SA" : "en-US",
      { day: 'numeric', month: 'short', year: 'numeric' }
    )}
  </span>
  <span className="text-muted-foreground/30">•</span>
  <span className="flex items-center gap-1 font-bold text-[#2a655f] dark:text-[#3a8a82]">
    <CreditCard className="h-3 w-3" />
    {formatPrice(group.totalWithDelivery, app.currency, app.lang)}
  </span>
</div>
                        </div>
                      </div>

                      {/* ✅ القسم الأيمن: الحالة + زر التوسيع */}
                      <div className="flex items-center gap-3">
                        <Badge className={cn(
                          "border-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold shadow-sm",
                          status.bg,
                          status.border,
                          status.color,
                          isActive && "animate-pulse"
                        )}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {status.label}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground transition-transform duration-300" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-300" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ===== DETAILS (EXPANDED) ===== */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 animate-fade-up">
                      <div className="space-y-4">
                        
                        {/* ✅ حالة الطلب مع وصف */}
                        <div className={cn(
                          "p-4 rounded-xl border",
                          status.bg,
                          status.border
                        )}>
                          <div className="flex items-center gap-3">
                            <StatusIcon className={cn("h-5 w-5", status.color)} />
                            <div>
                              <p className="font-bold text-sm">{status.label}</p>
                              <p className="text-xs text-muted-foreground">{status.description}</p>
                            </div>
                          </div>
                        </div>

                        {/* ✅ معلومات العميل */}
                        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {app.lang === "ar" ? "العميل" : "Customer"}
                            </p>
                            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{group.buyerName}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {app.lang === "ar" ? "رقم الطلب" : "Order ID"}
                            </p>
                            <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{group.orderId.slice(0, 12)}</p>
                          </div>
                          {group.buyerPhone && (
                            <div className="col-span-2">
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {app.lang === "ar" ? "رقم الهاتف" : "Phone"}
                              </p>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{group.buyerPhone}</p>
                            </div>
                          )}
                        </div>

                        {/* ✅ قائمة المنتجات في هذه الطلبية */}
                        <div className="space-y-3">
                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
  <Package className="h-3.5 w-3.5" />
  {app.lang === "ar" ? "المنتجات" : "Products"}
  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
    {group.items.length}
  </Badge>
</div>
                          
                          {group.items.map((item: any) => {
                            // ✅ ✅ ✅ جلب الـ listings من item مباشرة (من order_items)
                            const listing = item.listings || item;
                            
                            // ✅ ✅ ✅ الحصول على الصورة الصحيحة (مع دعم الفيرنتات)
                            const imageUrl = getProductImage(item);
                            
                            // ✅ ✅ ✅ LOG لتأكيد الصورة
                            console.log("📸 [Orders] Item image:", {
                              id: item.id,
                              title: listing?.title_ar,
                              imageUrl: imageUrl,
                              metadata_variation_image: item.metadata?.variation_image,
                              selected_options: item.selected_options,
                              selected_variation_id: item.selected_variation_id
                            });
                            
                            return (
                              <div 
                                key={item.id || item.listing_id}
                                className="p-3 bg-slate-50/80 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 transition-all duration-300"
                              >
                                <div className="flex items-center gap-4">
                                  {/* ✅ صورة المنتج (مع دعم الفيرنتات) */}
                                  <div className="h-12 w-12 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/50 dark:border-slate-700/50">
                                    {imageUrl ? (
                                      <OptimizedImage
                                        src={imageUrl}
                                        alt=""
                                        width={48}
                                        height={48}
                                        quality={80}
                                        objectFit="cover"
                                        className="h-full w-full"
                                      />
                                    ) : (
                                      <div className="h-full w-full flex items-center justify-center bg-slate-100 dark:bg-slate-700">
                                        <Package className="h-5 w-5 text-slate-400" />
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* معلومات المنتج */}
                                  <div className="flex-1">
                                    <p className="font-semibold text-sm text-slate-800 dark:text-white">
                                      {app.lang === "ar" 
                                        ? listing?.title_ar || 'منتج'
                                        : listing?.title_en || listing?.title_ar || 'Product'}
                                    </p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                                      <span>{app.lang === "ar" ? "الكمية:" : "Qty:"} {item.quantity || 1}</span>
                                      <span className="text-muted-foreground/30">•</span>
                                      <span className="font-semibold text-[#2a655f] dark:text-[#3a8a82]">
                                        {formatPrice(
                                          item.total || (Number(item.price) * (item.quantity || 1)) || 0, 
                                          app.currency, 
                                          app.lang
                                        )}
                                      </span>
                                      <span className="text-muted-foreground/30">•</span>
                                      <Badge className={cn(
                                        "border-0 text-[9px] px-2 py-0.5",
                                        getOrderStatus(item.status || group.status).bg,
                                        getOrderStatus(item.status || group.status).color
                                      )}>
                                        {getOrderStatus(item.status || group.status).label}
                                      </Badge>
                                      {/* ✅ ✅ ✅ عرض معلومات الفيرنت المختار */}
                                      {item.selected_variation_id && (
                                        <span className="text-[9px] text-muted-foreground/70 flex items-center gap-1">
                                          <Layers className="h-2.5 w-2.5" />
                                          {item.variation_snapshot?.combination 
                                            ? Object.values(item.variation_snapshot.combination).join(' • ')
                                            : (item.selected_variation_id.slice(0, 8))}
                                        </span>
                                      )}
                                      {/* ✅ ✅ ✅ عرض معلومات الفيرنت من metadata */}
                                      {item.metadata?.variation_combination && Object.keys(item.metadata.variation_combination).length > 0 && (
                                        <span className="text-[9px] text-muted-foreground/70 flex items-center gap-1">
                                          <Layers className="h-2.5 w-2.5" />
                                          {Object.values(item.metadata.variation_combination).join(' • ')}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* ✅ زر عرض المنتج */}
                                  <Link to="/listing/$id" params={{ id: item.listing_id || item.id }}>
                                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-[#2a655f]/10">
                                      <Eye className="h-3.5 w-3.5 text-[#2a655f]" />
                                    </Button>
                                  </Link>
                                </div>

                                {/* ✅ ✅ ✅ أزرار التقييم فقط (تم إزالة زر الإلغاء من هنا) */}
                                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-200/50 dark:border-slate-700/50">
                                  {canRate(item.status || group.status) && (
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] text-muted-foreground">
                                        {app.lang === "ar" ? "قيم:" : "Rate:"}
                                      </span>
                                      <StarRating
                                        rating={item.rating || 0}
                                        onRatingChange={(value) => {
                                          setRatingOrder(item.id || item.listing_id);
                                          setRatingValue(value);
                                          handleRateOrder(item.order_id || group.orderId, item.listing_id, value);
                                        }}
                                        readonly={isRating && ratingOrder === (item.id || item.listing_id)}
                                        size="sm"
                                      />
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* ✅ ✅ ✅ زر إلغاء الطلب كامل (في الأسفل) */}
                        {canCancelOrder && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="w-full rounded-xl bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-[1.02] group"
                            onClick={() => handleCancelOrder(group.orderId)}
                            disabled={isCancelling === group.orderId}
                          >
                            {isCancelling === group.orderId ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                {app.lang === "ar" ? "جاري الإلغاء..." : "Cancelling..."}
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                                {app.lang === "ar" ? "🚫 إلغاء الطلب بالكامل" : "🚫 Cancel Entire Order"}
                              </>
                            )}
                          </Button>
                        )}

                        {/* ✅ ملاحظات الطلب */}
                        {group.notes && (
                          <div className="p-4 bg-yellow-50/50 dark:bg-yellow-950/20 rounded-xl border border-yellow-200/50 dark:border-yellow-800/30">
                            <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 flex items-center gap-1.5">
                              <MessageCircle className="h-3.5 w-3.5" />
                              {app.lang === "ar" ? "ملاحظات" : "Notes"}
                            </p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{group.notes}</p>
                          </div>
                        )}

                        {/* ✅ سبب الرفض (إذا كان مرفوض) */}
                        {group.rejectionReason && (
                          <div className="p-4 bg-red-50/50 dark:bg-red-950/20 rounded-xl border border-red-200/50 dark:border-red-800/30">
                            <p className="text-xs font-medium text-red-600 dark:text-red-400 flex items-center gap-1.5">
                              <XCircle className="h-3.5 w-3.5" />
                              {app.lang === "ar" ? "سبب الرفض" : "Rejection Reason"}
                            </p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">{group.rejectionReason}</p>
                          </div>
                        )}

                        {/* ✅ ✅ ✅ إجمالي الطلبية (المجموع الفرعي + التوصيل + الخصم) */}
                        <div className="p-4 bg-[#2a655f]/5 dark:bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/20 dark:border-[#2a655f]/30">
                          
                          {/* المجموع الفرعي */}
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-muted-foreground">
                              {app.lang === "ar" ? "المجموع الفرعي" : "Subtotal"}
                            </span>
                            <span className="text-lg font-bold text-[#0d2e2a] dark:text-[#3a8a82]">
                              {formatPrice(group.totalPrice, app.currency, app.lang)}
                            </span>
                          </div>
                          
                      {/* ✅ سعر التوصيل - يظهر دائماً (حتى لو 0) */}
{group.deliveryFee !== undefined && (
  <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#2a655f]/10">
    <span className="text-sm text-muted-foreground">
      {app.lang === "ar" ? "سعر التوصيل" : "Delivery Fee"}
    </span>
    <span className={cn(
      "text-sm font-medium",
      group.deliveryFee === 0 
        ? "text-emerald-500 font-bold" 
        : "text-[#0d2e2a] dark:text-[#3a8a82]"
    )}>
      {group.deliveryFee === 0 
        ? (app.lang === "ar" ? "🆓 مجاني" : "🆓 Free")
        : formatPrice(group.deliveryFee, app.currency, app.lang)
      }
    </span>
  </div>
)}
                          
                          {/* ✅ الخصم */}
                          {group.promoDiscount > 0 && (
                            <div className="flex items-center justify-between mt-1 pt-1 border-t border-[#2a655f]/10 text-emerald-500">
                              <span className="text-sm">
                                {app.lang === "ar" ? "💚 الخصم" : "💚 Discount"}
                              </span>
                              <span className="text-sm font-bold">
                                -{formatPrice(group.promoDiscount, app.currency, app.lang)}
                              </span>
                            </div>
                          )}
                          
                          {/* ✅ الإجمالي الكامل */}
                          <div className="flex items-center justify-between mt-2 pt-2 border-t-2 border-[#2a655f]/20">
                            <span className="text-sm font-semibold text-[#0d2e2a] dark:text-white">
                              {app.lang === "ar" ? "الإجمالي الكامل" : "Total"}
                            </span>
                            <span className="text-2xl font-bold text-[#0d2e2a] dark:text-[#3a8a82]">
                              {formatPrice(group.totalWithDelivery, app.currency, app.lang)}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-muted-foreground">
                              {group.totalItems} {app.lang === "ar" ? "منتج" : "items"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(group.createdAt).toLocaleString(
                                app.lang === "ar" ? "ar-SA" : "en-US",
                                { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                              )}
                            </span>
                          </div>
                        </div>

                        {/* ✅ زر الشكوى (إذا كان أي منتج completed أو delivered) */}
                        {hasRateableItem && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl border-amber-500/30 text-amber-600 hover:bg-amber-50 hover:border-amber-500 transition-all duration-300 group"
                            onClick={() => {
                              setSelectedOrder(group);
                              setComplaintDialogOpen(true);
                            }}
                          >
                            <AlertTriangle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            {app.lang === "ar" ? "📢 تقديم شكوى" : "📢 Submit Complaint"}
                          </Button>
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
        <DialogContent className="max-w-lg rounded-2xl border-[#2a655f]/20 shadow-2xl shadow-[#2a655f]/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-[#0d2e2a]">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              {app.lang === "ar" ? "📢 تقديم شكوى" : "📢 Submit Complaint"}
            </DialogTitle>
            <DialogDescription>
              {app.lang === "ar" 
                ? `شكوى بخصوص الطلبية من "${selectedOrder?.storeName || ''}"`
                : `Complaint for order from "${selectedOrder?.storeName || ''}"`}
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
              className="rounded-xl border-slate-200/50 hover:bg-slate-100/50"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleSubmitComplaint}
              disabled={isSubmittingComplaint}
              className="bg-[#0d2e2a] hover:bg-[#1a4f4a] text-white rounded-xl shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 hover:scale-[1.02]"
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