// src/routes/tracking/$trackingNumber.tsx

import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDeliveryOrders } from "@/lib/queries";
import {
  Package, MapPin, Phone, Clock, CheckCircle, 
  XCircle, Truck, Navigation, User, 
  Calendar, ArrowRight, ChevronLeft, 
  Circle, CircleCheck, CircleDot, 
  Loader2, Home, Store, AlertCircle,
  Mail, Award, Star, MessageCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracking/$trackingNumber")({
  component: TrackingPage,
  head: ({ params }) => ({
    meta: [
      { title: `تتبع الشحنة #${params.trackingNumber} - Souqi` },
      { name: "description", content: "تتبع حالة شحنتك في السوق اليك" },
    ],
  }),
});

function TrackingPage() {
  const { trackingNumber } = Route.useParams();
  const app = useApp();
  const t = useT();
  const [activeTab, setActiveTab] = useState<"tracking" | "details" | "distributor">("tracking");

  // ✅ جلب بيانات الطلب
  const { data: orders = [], isLoading } = useDeliveryOrders(app.user?.id);
  
  // ✅ البحث عن الطلب بالرقم
  const order = useMemo(() => {
    return orders.find((o: any) => o.tracking_number === trackingNumber);
  }, [orders, trackingNumber]);

  // ✅ حالة الطلب
  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: any; step: number }> = {
      pending: { 
        label: app.lang === "ar" ? "قيد المراجعة" : "Pending", 
        color: "text-yellow-500", 
        icon: Clock,
        step: 0 
      },
      assigned: { 
        label: app.lang === "ar" ? "تم التعيين" : "Assigned", 
        color: "text-purple-500", 
        icon: User,
        step: 1 
      },
      picked_up: { 
        label: app.lang === "ar" ? "تم الاستلام" : "Picked Up", 
        color: "text-blue-500", 
        icon: Package,
        step: 2 
      },
      in_transit: { 
        label: app.lang === "ar" ? "قيد التوصيل" : "In Transit", 
        color: "text-orange-500", 
        icon: Truck,
        step: 3 
      },
      delivered: { 
        label: app.lang === "ar" ? "تم التوصيل" : "Delivered", 
        color: "text-green-500", 
        icon: CheckCircle,
        step: 4 
      },
      cancelled: { 
        label: app.lang === "ar" ? "ملغي" : "Cancelled", 
        color: "text-red-500", 
        icon: XCircle,
        step: -1 
      },
    };
    return statusMap[status] || statusMap.pending;
  };

  const isArabic = app.lang === "ar";

  // ✅ Steps للتتبع
  const steps = [
    { 
      label: isArabic ? "تم إنشاء الطلب" : "Order Created", 
      icon: Package,
      key: "created" 
    },
    { 
      label: isArabic ? "تم التعيين" : "Assigned", 
      icon: User,
      key: "assigned" 
    },
    { 
      label: isArabic ? "تم الاستلام" : "Picked Up", 
      icon: Package,
      key: "picked_up" 
    },
    { 
      label: isArabic ? "قيد التوصيل" : "In Transit", 
      icon: Truck,
      key: "in_transit" 
    },
    { 
      label: isArabic ? "تم التوصيل" : "Delivered", 
      icon: CheckCircle,
      key: "delivered" 
    },
  ];

  const currentStep = order ? getStatusInfo(order.status).step : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
        <div className="mx-auto max-w-3xl px-4 py-12">
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
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isArabic ? "لم نجد الشحنة" : "Order Not Found"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? `لا توجد شحنة برقم التتبع "${trackingNumber}"` 
              : `No order found with tracking number "${trackingNumber}"`}
          </p>
          <Link to="/">
            <Button className="mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white">
              <Home className="h-4 w-4 mr-2" />
              {isArabic ? "العودة للرئيسية" : "Back to Home"}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(order.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-3xl px-4 py-8 md:py-12">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition mb-4 group">
            <ChevronLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
            {isArabic ? "الرئيسية" : "Home"}
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center">
              <Navigation className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {isArabic ? "🔍 تتبع الشحنة" : "🔍 Track Order"}
              </h1>
              <p className="text-white/80 text-sm">
                {isArabic 
                  ? `رقم التتبع: ${trackingNumber}` 
                  : `Tracking Number: ${trackingNumber}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        
        {/* ===== Status Card ===== */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className={cn(
                "h-14 w-14 rounded-full flex items-center justify-center",
                statusInfo.color.replace("text-", "bg-") + "/10"
              )}>
                <StatusIcon className={cn("h-7 w-7", statusInfo.color)} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  {isArabic ? "حالة الشحنة" : "Order Status"}
                </p>
                <div className="flex items-center gap-2">
                  <span className={cn("text-xl font-bold", statusInfo.color)}>
                    {statusInfo.label}
                  </span>
                  {order.status === "delivered" && (
                    <Badge className="bg-emerald-500 text-white border-0">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {isArabic ? "تم التسليم" : "Delivered"}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {isArabic ? "تاريخ الطلب" : "Order Date"}
              </p>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleDateString(isArabic ? "ar-SA" : "en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* ===== TABS ===== */}
        <div className="flex items-center gap-2 border-b mb-6">
          {[
            { id: "tracking", label: isArabic ? "📍 التتبع" : "📍 Tracking", icon: Navigation },
            { id: "details", label: isArabic ? "📋 التفاصيل" : "📋 Details", icon: Package },
            { id: "distributor", label: isArabic ? "👤 الموزع" : "👤 Distributor", icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-3 -mb-px border-b-2 font-bold text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "border-[#2a655f] text-[#2a655f]"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== TAB: TRACKING ===== */}
        {activeTab === "tracking" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-bold mb-6">
              {isArabic ? "⏳ مسار الشحنة" : "⏳ Order Timeline"}
            </h3>
            
            <div className="relative">
              {/* خط التتبع */}
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700" />
              
              {/* Steps */}
              <div className="space-y-6">
                {steps.map((step, index) => {
                  const isCompleted = index < currentStep;
                  const isCurrent = index === currentStep;
                  const isUpcoming = index > currentStep;
                  
                  return (
                    <div key={step.key} className="flex items-start gap-4 relative">
                      {/* النقطة */}
                      <div className={cn(
                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0 z-10",
                        isCompleted ? "bg-[#2a655f] text-white" :
                        isCurrent ? "bg-orange-500 text-white animate-pulse" :
                        "bg-slate-200 dark:bg-slate-700 text-slate-400"
                      )}>
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5" />
                        ) : isCurrent ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Circle className="h-5 w-5" />
                        )}
                      </div>
                      
                      {/* المحتوى */}
                      <div className="flex-1 pt-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={cn(
                            "font-semibold",
                            isCompleted ? "text-slate-900 dark:text-white" :
                            isCurrent ? "text-orange-500" :
                            "text-muted-foreground"
                          )}>
                            {step.label}
                          </p>
                          {isCompleted && (
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[9px]">
                              ✅ {isArabic ? "مكتمل" : "Done"}
                            </Badge>
                          )}
                          {isCurrent && (
                            <Badge className="bg-orange-500/10 text-orange-600 border-0 text-[9px] animate-pulse">
                              ● {isArabic ? "حالياً" : "Current"}
                            </Badge>
                          )}
                        </div>
                        
                        {/* تاريخ الخطوة */}
                        {isCompleted && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(order.created_at).toLocaleString(isArabic ? "ar-SA" : "en-US")}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  {isArabic 
                    ? "سيتم تحديث التتبع تلقائياً عند تغيير الحالة" 
                    : "Tracking will update automatically when status changes"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: DETAILS ===== */}
        {activeTab === "details" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-bold mb-6">
              {isArabic ? "📋 تفاصيل الشحنة" : "📋 Order Details"}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* معلومات التسليم */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#2a655f]" />
                  {isArabic ? "عنوان التسليم" : "Delivery Address"}
                </h4>
                <p className="text-sm">{order.delivery_address || isArabic ? "غير محدد" : "Not specified"}</p>
                {order.delivery_phone && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span dir="ltr">{order.delivery_phone}</span>
                  </div>
                )}
                {order.delivery_name && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>{order.delivery_name}</span>
                  </div>
                )}
              </div>

              {/* معلومات الشحن */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#2a655f]" />
                  {isArabic ? "عنوان الاستلام" : "Pickup Address"}
                </h4>
                <p className="text-sm">{order.pickup_address || isArabic ? "غير محدد" : "Not specified"}</p>
                {order.pickup_phone && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span dir="ltr">{order.pickup_phone}</span>
                  </div>
                )}
                {order.pickup_name && (
                  <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                    <User className="h-3.5 w-3.5" />
                    <span>{order.pickup_name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* معلومات إضافية */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">{isArabic ? "رقم التتبع" : "Tracking"}</p>
                <p className="font-bold text-sm mt-1" dir="ltr">{trackingNumber}</p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">{isArabic ? "رسوم التوصيل" : "Delivery Fee"}</p>
                <p className="font-bold text-sm mt-1 text-[#2a655f]">
                  {order.delivery_fee} {app.currency}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">{isArabic ? "المبلغ" : "Amount"}</p>
                <p className="font-bold text-sm mt-1">
                  {order.cod_amount} {app.currency}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center">
                <p className="text-xs text-muted-foreground">{isArabic ? "طريقة الدفع" : "Payment"}</p>
                <p className="font-bold text-sm mt-1">
                  {order.cod_amount > 0 ? (isArabic ? "دفع عند الاستلام" : "Cash on Delivery") : (isArabic ? "مدفوع" : "Paid")}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ===== TAB: DISTRIBUTOR ===== */}
        {activeTab === "distributor" && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50 p-6">
            <h3 className="text-lg font-bold mb-6">
              {isArabic ? "👤 معلومات الموزع" : "👤 Distributor Info"}
            </h3>
            
            {order.distributor ? (
              <div className="flex items-start gap-6">
                <div className="h-20 w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center shrink-0">
                  {order.distributor.avatar_url ? (
                    <img 
                      src={order.distributor.avatar_url} 
                      alt="" 
                      className="h-full w-full object-cover rounded-full" 
                    />
                  ) : (
                    <User className="h-10 w-10 text-[#2a655f]" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold">
                    {isArabic ? order.distributor.full_name_ar : order.distributor.full_name_en || order.distributor.full_name_ar}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {Number(order.distributor.rating || 0).toFixed(1)}
                    </span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      {order.distributor.completed_orders || 0} {isArabic ? "طلب" : "orders"}
                    </span>
                    <span className="text-muted-foreground/30">|</span>
                    <span className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span dir="ltr">{order.distributor.phone}</span>
                    </span>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-2">
                    <Button 
                      size="sm" 
                      className="bg-[#2a655f] hover:bg-[#3a8a82] text-white"
                      onClick={() => window.location.href = `/messages/new?user=${order.distributor.user_id}`}
                    >
                      <MessageCircle className="h-4 w-4 mr-1" />
                      {isArabic ? "مراسلة" : "Message"}
                    </Button>
                    {order.distributor.is_available && (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-0">
                        ● {isArabic ? "متاح" : "Available"}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  {isArabic ? "لم يتم تعيين موزع بعد" : "No distributor assigned yet"}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ===== SHARE BUTTON ===== */}
        <div className="mt-6 flex justify-center">
          <Button 
            variant="outline" 
            className="border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
            onClick={() => {
              const url = window.location.href;
              if (navigator.share) {
                navigator.share({
                  title: isArabic ? `تتبع الشحنة ${trackingNumber}` : `Track Order ${trackingNumber}`,
                  text: isArabic ? `يمكنك تتبع شحنتك برقم: ${trackingNumber}` : `Track your order with: ${trackingNumber}`,
                  url: url,
                });
              } else {
                navigator.clipboard.writeText(url);
                toast.success(isArabic ? "✅ تم نسخ الرابط" : "✅ Link copied");
              }
            }}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {isArabic ? "مشاركة رابط التتبع" : "Share Tracking Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}