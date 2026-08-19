// src/routes/delivery/orders/$id.tsx
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useApp } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import {
  Package, MapPin, Phone, User, Clock, ArrowLeft,
  Loader2, Truck, ChevronRight, Home, ArrowRight,
  Calendar, DollarSign, Hash, MapPinned, UserRound,
  ShoppingBag, CreditCard, BadgeCheck, ShieldCheck,
  Store, Building2, Gauge, Timer, CheckCircle2, XCircle,
  AlertCircle, Info, Sparkles, Zap, Award, Crown, Gem
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/delivery/orders/$id")({
  component: DeliveryOrderDetailPage,
});

function DeliveryOrderDetailPage() {
  const { id } = Route.useParams();
  const app = useApp();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isArabic = app.lang === "ar";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data, error } = await supabase
          .from("delivery_orders")
          .select(`
            *,
            orders:order_id (
              id,
              buyer_id,
              buyer_name,
              buyer_phone,
              total,
              listings:listing_id (
                id,
                title_ar,
                title_en,
                cover_url
              )
            )
          `)
          .eq("id", id)
          .single();

        if (error) throw error;
        setOrder(data);
      } catch (error) {
        console.error("❌ Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ✅ دالة ترجمة الحالة
  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: isArabic ? "قيد المراجعة" : "Pending",
      assigned: isArabic ? "تم التعيين" : "Assigned",
      picked_up: isArabic ? "تم الاستلام" : "Picked up",
      in_transit: isArabic ? "قيد التوصيل" : "In Transit",
      delivered: isArabic ? "تم التوصيل" : "Delivered",
      cancelled: isArabic ? "ملغي" : "Cancelled",
      failed: isArabic ? "فشل" : "Failed",
    };
    return labels[status] || status;
  };

  // ✅ دالة لون الحالة
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      assigned: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      picked_up: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_transit: "bg-orange-500/10 text-orange-500 border-orange-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[status] || "bg-slate-500/10 text-slate-500";
  };

  // ✅ دالة الحصول على أيقونة السهم حسب اللغة
  const getBackIcon = () => {
    if (isArabic) {
      return (
        <div className="relative">
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          <ArrowRight className="h-4 w-4 absolute -right-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300" style={{ color: 'white' }} />
        </div>
      );
    }
    return (
      <div className="relative">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform duration-300" />
        <ArrowLeft className="h-4 w-4 absolute -left-1 opacity-0 group-hover:opacity-100 group-hover:-translate-x-2 transition-all duration-300" style={{ color: 'white' }} />
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#0d2e2a]/20 border-t-[#2a655f]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Truck className="h-6 w-6 text-[#2a655f] animate-pulse" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            {isArabic ? "جاري تحميل تفاصيل الطلب..." : "Loading order details..."}
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5">
        <div className="text-center max-w-md p-8 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-[#0d2e2a]/10">
          <div className="h-24 w-24 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4">
            <Package className="h-12 w-12 text-[#0d2e2a]/40" />
          </div>
          <p className="text-2xl font-bold text-[#0d2e2a] dark:text-white">
            {isArabic ? "الطلب غير موجود" : "Order not found"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            {isArabic ? "الطلب الذي تبحث عنه غير موجود أو تم حذفه" : "The order you're looking for doesn't exist or was deleted"}
          </p>
          <Button 
            className="mt-6 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 hover:scale-105 rounded-xl px-6"
            onClick={() => navigate({ to: "/delivery/dashboard" })}
          >
            <Home className="h-4 w-4 mr-2" />
            {isArabic ? "العودة للوحة التحكم" : "Back to Dashboard"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#0d2e2a]/10 p-4 md:p-8">
      
      {/* ✅ HEADER مع زر الرجوع المحترف - متوافق مع RTL */}
      <div className="max-w-4xl mx-auto mb-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <Button
            onClick={() => navigate({ to: "/delivery/dashboard" })}
            className="group bg-white dark:bg-slate-900/80 hover:bg-[#0d2e2a] dark:hover:bg-[#0d2e2a] text-[#0d2e2a] dark:text-white hover:text-white border-2 border-[#0d2e2a]/20 dark:border-slate-700/50 hover:border-[#0d2e2a] dark:hover:border-[#0d2e2a] shadow-md hover:shadow-xl hover:shadow-[#0d2e2a]/20 transition-all duration-300 rounded-2xl px-5 py-2.5 h-auto"
          >
            <div className="flex items-center gap-2">
              {/* ✅ السهم يتغير حسب اللغة */}
              {getBackIcon()}
              <span className="font-medium text-sm">
                {isArabic ? "الرجوع للوحة التحكم" : "Back to Dashboard"}
              </span>
              <div className="h-4 w-px bg-[#0d2e2a]/20 dark:bg-white/20 mx-1" />
              <span className="text-xs text-muted-foreground group-hover:text-white/70 transition-colors duration-300">
                {isArabic ? "لوحة شركة التوصيل" : "Delivery Dashboard"}
              </span>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/80 dark:bg-slate-900/80 px-4 py-2 rounded-2xl border border-[#0d2e2a]/10 shadow-sm">
            <BadgeCheck className="h-4 w-4 text-[#2a655f]" />
            <span>{isArabic ? "طلب #" : "Order #"}</span>
            <span className="font-mono font-bold text-[#0d2e2a] dark:text-white">
              {order.id.substring(0, 8)}
            </span>
          </div>
        </div>
      </div>

      {/* ✅ MAIN CONTENT */}
      <div className="max-w-4xl mx-auto space-y-5">
        
        {/* ✅ CARD الرئيسي */}
        <Card className="border-0 shadow-2xl shadow-[#0d2e2a]/10 bg-white dark:bg-slate-900/90 overflow-hidden">
          
          {/* ✅ Header مع الحالة */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e2a]/5 to-[#2a655f]/5" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2a655f]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <CardHeader className="relative border-b border-[#0d2e2a]/10 pb-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/20">
                    <Truck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
                      {isArabic ? "تفاصيل الطلب" : "Order Details"}
                      <Sparkles className="h-4 w-4 text-[#d4af37] animate-pulse" />
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {new Date(order.created_at).toLocaleString(isArabic ? "ar-SA" : "en-US", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <Badge className={cn(
                  "border-0 px-4 py-1.5 text-xs font-bold rounded-full shadow-lg flex items-center gap-1.5",
                  getStatusColor(order.status)
                )}>
                  {order.status === "pending" && <Clock className="h-3.5 w-3.5 animate-pulse" />}
                  {order.status === "assigned" && <UserRound className="h-3.5 w-3.5" />}
                  {order.status === "picked_up" && <CheckCircle2 className="h-3.5 w-3.5" />}
                  {order.status === "in_transit" && <Truck className="h-3.5 w-3.5 animate-bounce" />}
                  {order.status === "delivered" && <BadgeCheck className="h-3.5 w-3.5" />}
                  {order.status === "cancelled" && <XCircle className="h-3.5 w-3.5" />}
                  {getStatusLabel(order.status)}
                </Badge>
              </div>
            </CardHeader>
          </div>

          <CardContent className="p-6 space-y-6">
            
            {/* ✅ بطاقات المعلومات - شبكة 2x2 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-4 bg-[#0d2e2a]/5 dark:bg-slate-800/50 rounded-2xl border border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Hash className="h-3.5 w-3.5 text-[#2a655f]" />
                  {isArabic ? "رقم الطلب" : "Order ID"}
                </div>
                <p className="font-mono font-bold text-sm text-[#0d2e2a] dark:text-white group-hover:text-[#2a655f] transition-colors">
                  {order.id.substring(0, 8)}
                </p>
              </div>
              
              <div className="p-4 bg-[#0d2e2a]/5 dark:bg-slate-800/50 rounded-2xl border border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Calendar className="h-3.5 w-3.5 text-[#2a655f]" />
                  {isArabic ? "التاريخ" : "Date"}
                </div>
                <p className="font-medium text-sm text-[#0d2e2a] dark:text-white">
                  {new Date(order.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              
              <div className="p-4 bg-[#0d2e2a]/5 dark:bg-slate-800/50 rounded-2xl border border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-[#2a655f]" />
                  {isArabic ? "رسوم التوصيل" : "Delivery Fee"}
                </div>
                <p className="font-bold text-sm text-[#2a655f] group-hover:scale-105 transition-transform">
                  {order.delivery_fee || 0} {app.currency}
                </p>
              </div>
              
              <div className="p-4 bg-[#0d2e2a]/5 dark:bg-slate-800/50 rounded-2xl border border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group hover:shadow-md">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <Gauge className="h-3.5 w-3.5 text-[#2a655f]" />
                  {isArabic ? "رقم التتبع" : "Tracking"}
                </div>
                <p className="font-mono text-sm text-[#0d2e2a] dark:text-white">
                  {order.tracking_number || "-"}
                </p>
              </div>
            </div>

            {/* ✅ عنوان التوصيل - بطاقة مميزة */}
            <div className="p-5 bg-gradient-to-r from-[#0d2e2a]/5 to-[#2a655f]/5 dark:from-[#0d2e2a]/10 dark:to-[#2a655f]/10 rounded-2xl border-2 border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#2a655f]/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <MapPinned className="h-5 w-5 text-[#2a655f]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                    <span>{isArabic ? "📍 عنوان التوصيل" : "📍 Delivery Address"}</span>
                    <span className="h-1 w-1 rounded-full bg-[#2a655f]/30" />
                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px] rounded-full px-2">
                      {isArabic ? "محدد" : "Set"}
                    </Badge>
                  </p>
                  <p className="font-medium text-[#0d2e2a] dark:text-white mt-1 leading-relaxed">
                    {order.delivery_address || order.pickup_address || (isArabic ? "غير محدد" : "Not specified")}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ معلومات العميل + المنتج - شبكة */}
            <div className="grid md:grid-cols-2 gap-4">
              
              {/* العميل */}
              {order.orders && (
                <div className="p-5 bg-white dark:bg-slate-800/30 rounded-2xl border-2 border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <UserRound className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        {isArabic ? "👤 معلومات العميل" : "👤 Customer Info"}
                      </p>
                      <p className="font-semibold text-[#0d2e2a] dark:text-white mt-1">
                        {order.orders.buyer_name || (isArabic ? "غير معروف" : "Unknown")}
                      </p>
                      {order.orders.buyer_phone && (
                        <a 
                          href={`tel:${order.orders.buyer_phone}`} 
                          className="inline-flex items-center gap-2 mt-1 text-sm text-[#2a655f] hover:text-[#1a4f4a] hover:underline transition-all duration-300 group/phone"
                        >
                          <Phone className="h-3.5 w-3.5 group-hover/phone:scale-110 transition-transform" />
                          <span className="font-mono" dir="ltr">{order.orders.buyer_phone}</span>
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px] rounded-full">
                            {isArabic ? "اتصل" : "Call"}
                          </Badge>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* المنتج */}
              {order.orders?.listings && (
                <div className="p-5 bg-white dark:bg-slate-800/30 rounded-2xl border-2 border-[#0d2e2a]/10 hover:border-[#2a655f]/30 transition-all duration-300 group">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                      <img 
                        src={order.orders.listings.cover_url || '/placeholder.png'} 
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" />
                        {isArabic ? "📦 المنتج" : "📦 Product"}
                      </p>
                      <p className="font-semibold text-[#0d2e2a] dark:text-white mt-1 truncate">
                        {order.orders.listings.title_ar || order.orders.listings.title_en || (isArabic ? "منتج" : "Product")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? "الكمية" : "Qty"}: {order.orders.quantity || 1}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ المجموع الكلي - بطاقة مميزة */}
            <div className="relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-[#0d2e2a] to-[#2a655f] opacity-5" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#2a655f] rounded-full blur-3xl opacity-10" />
              
              <div className="relative p-5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/20">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      {isArabic ? "💰 المجموع الكلي" : "💰 Total Amount"}
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      {isArabic ? "يشمل جميع الرسوم والضرائب" : "Includes all fees and taxes"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] rounded-full px-3 py-1">
                    <ShieldCheck className="h-3 w-3 mr-1" />
                    {isArabic ? "مدفوع" : "Paid"}
                  </Badge>
                  <span className="text-3xl md:text-4xl font-black text-[#2a655f] dark:text-[#3a8a82] drop-shadow-[0_2px_15px_rgba(42,101,95,0.2)]">
                    {order.cod_amount || order.orders?.total || 0} {app.currency}
                  </span>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* ✅ Footer - معلومات إضافية */}
        <div className="flex items-center justify-between flex-wrap gap-3 text-xs text-muted-foreground bg-white/80 dark:bg-slate-900/80 px-5 py-3 rounded-2xl border border-[#0d2e2a]/10 shadow-sm">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5">
              <Timer className="h-3.5 w-3.5 text-[#2a655f]" />
              {isArabic ? "آخر تحديث" : "Last updated"}: {new Date(order.updated_at).toLocaleString(isArabic ? "ar-SA" : "en-US")}
            </span>
            <span className="h-3 w-px bg-[#0d2e2a]/10" />
            <span className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-[#d4af37]" />
              {isArabic ? "طلب مؤكد" : "Verified Order"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-[#2a655f] hover:bg-[#2a655f]/10 rounded-xl text-xs"
            onClick={() => window.print()}
          >
            <Zap className="h-3.5 w-3.5 mr-1.5" />
            {isArabic ? "طباعة" : "Print"}
          </Button>
        </div>

      </div>
    </div>
  );
}