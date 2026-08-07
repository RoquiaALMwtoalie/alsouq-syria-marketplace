// src/routes/delivery/orders/new.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDeliveryCompanies, useCreateDeliveryOrder, useDistributors, useSendNotificationV2 } from "@/lib/queries";
import {
  Truck, Package, MapPin, Phone, User, 
  ArrowRight, ChevronLeft, Plus, X,
  Calendar, Clock, DollarSign, Navigation,
  Store, Building2, CreditCard, AlertCircle,
  CheckCircle, Loader2, UserPlus, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/delivery/orders/new")({
  component: NewDeliveryOrderPage,
  head: () => ({
    meta: [
      { title: "طلب توصيل جديد - Souqi" },
      { name: "description", content: "إنشاء طلب توصيل جديد" },
    ],
  }),
});

function NewDeliveryOrderPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ State النموذج
  const [formData, setFormData] = useState({
    // معلومات الشحن (من البائع)
    pickupName: "",
    pickupPhone: "",
    pickupAddress: "",
    pickupLat: "",
    pickupLng: "",
    
    // معلومات التسليم (للمشتري)
    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    deliveryLat: "",
    deliveryLng: "",
    
    // شركة التوصيل
    deliveryCompanyId: "",
    
    // الموزع
    distributorId: "",
    
    // التفاصيل
    notes: "",
    codAmount: "0",
    scheduledPickupAt: "",
    scheduledDeliveryAt: "",
  });

  // ✅ جلب البيانات
  const { data: companies = [], isLoading: companiesLoading } = useDeliveryCompanies({ active: true });
  const { data: distributors = [], isLoading: distributorsLoading } = useDistributors({
    companyId: formData.deliveryCompanyId || undefined,
    isAvailable: true,
  });
  const createOrder = useCreateDeliveryOrder();
  const sendNotification = useSendNotificationV2();

  // ✅ الشركة المختارة
  const selectedCompany = useMemo(() => {
    return companies.find((c: any) => c.id === formData.deliveryCompanyId);
  }, [companies, formData.deliveryCompanyId]);

  // ✅ الموزع المختار
  const selectedDistributor = useMemo(() => {
    return distributors.find((d: any) => d.id === formData.distributorId);
  }, [distributors, formData.distributorId]);

  // ✅ حساب رسوم التوصيل
  const estimatedFee = useMemo(() => {
    if (!selectedCompany) return 0;
    return selectedCompany.base_price || 0;
  }, [selectedCompany]);

  const isArabic = app.lang === "ar";

  // ✅ التحقق من صحة النموذج
  const isStep1Valid = 
    formData.pickupName.trim() &&
    formData.pickupPhone.trim() &&
    formData.pickupAddress.trim() &&
    formData.deliveryName.trim() &&
    formData.deliveryPhone.trim() &&
    formData.deliveryAddress.trim();

  const isStep2Valid = 
    formData.deliveryCompanyId &&
    formData.distributorId;

  const handleSubmit = async () => {
    if (!isStep1Valid || !isStep2Valid) {
      toast.error(
        isArabic 
          ? "الرجاء ملء جميع الحقول المطلوبة" 
          : "Please fill all required fields"
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        pickup_name: formData.pickupName,
        pickup_phone: formData.pickupPhone,
        pickup_address: formData.pickupAddress,
        pickup_latitude: parseFloat(formData.pickupLat) || null,
        pickup_longitude: parseFloat(formData.pickupLng) || null,
        delivery_name: formData.deliveryName,
        delivery_phone: formData.deliveryPhone,
        delivery_address: formData.deliveryAddress,
        delivery_latitude: parseFloat(formData.deliveryLat) || null,
        delivery_longitude: parseFloat(formData.deliveryLng) || null,
        delivery_company_id: formData.deliveryCompanyId,
        distributor_id: formData.distributorId,
        notes_ar: formData.notes,
        cod_amount: parseFloat(formData.codAmount) || 0,
        delivery_fee: estimatedFee,
        scheduled_pickup_at: formData.scheduledPickupAt || null,
        scheduled_delivery_at: formData.scheduledDeliveryAt || null,
        tracking_number: `SOUQI-${Date.now().toString(36).toUpperCase()}`,
        status: "assigned",
      };

      const result = await createOrder.mutateAsync(payload);
      
      // ✅ ✅ ✅ إرسال الإشعارات
      if (result.distributor_id) {
        await sendNotification.mutateAsync({
          userId: result.distributor_id,
          type: "delivery_order",
          titleAr: isArabic ? "📦 طلب توصيل جديد" : "📦 New Delivery Order",
          bodyAr: isArabic 
            ? `طلب توصيل من ${result.pickup_name} إلى ${result.delivery_name}` 
            : `Delivery order from ${result.pickup_name} to ${result.delivery_name}`,
          linkUrl: `/distributor/dashboard`,
          metadata: {
            order_id: result.id,
            tracking_number: result.tracking_number,
            pickup_name: result.pickup_name,
            delivery_name: result.delivery_name,
          },
          actions: [
            { label_ar: isArabic ? 'عرض الطلب' : 'View Order', url: `/distributor/dashboard` },
          ]
        });
      }

      // ✅ إشعار لشركة التوصيل
      await sendNotification.mutateAsync({
        userId: app.user?.id,
        type: "delivery_order",
        titleAr: isArabic ? "📦 تم إنشاء طلب توصيل" : "📦 Delivery Order Created",
        bodyAr: isArabic 
          ? `تم إنشاء طلب توصيل جديد برقم ${result.tracking_number}` 
          : `New delivery order created with tracking #${result.tracking_number}`,
        linkUrl: `/delivery/dashboard`,
        metadata: {
          order_id: result.id,
          tracking_number: result.tracking_number,
        },
      });
      
      toast.success(
        isArabic 
          ? "✅ تم إنشاء طلب التوصيل بنجاح!" 
          : "✅ Delivery order created successfully!"
      );
      
      navigate({ to: "/delivery/dashboard" });
    } catch (error) {
      console.error("Error creating delivery order:", error);
      toast.error(
        isArabic 
          ? "❌ حدث خطأ في إنشاء الطلب" 
          : "❌ Error creating order"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-3xl px-4 py-6 md:py-8">
          <div className="flex items-center gap-3">
            <Link to="/delivery/dashboard" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {isArabic ? "لوحة التحكم" : "Dashboard"}
            </Link>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {isArabic ? "📦 طلب توصيل جديد" : "📦 New Delivery Order"}
                </h1>
                <p className="text-white/80 text-xs">
                  {isArabic ? "أدخل معلومات الطلب" : "Enter order details"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== STEPS ===== */}
      <div className="mx-auto max-w-3xl px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          {[
            { number: 1, label: isArabic ? "معلومات الطلب" : "Order Info" },
            { number: 2, label: isArabic ? "اختيار التوصيل" : "Delivery Selection" },
            { number: 3, label: isArabic ? "تأكيد" : "Confirm" },
          ].map((s) => (
            <div key={s.number} className="flex items-center gap-2">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                step === s.number ? "bg-[#2a655f] text-white" :
                step > s.number ? "bg-emerald-500 text-white" :
                "bg-slate-200 dark:bg-slate-700 text-slate-500"
              )}>
                {step > s.number ? <CheckCircle className="h-4 w-4" /> : s.number}
              </div>
              <span className={cn(
                "text-sm font-medium hidden sm:inline",
                step === s.number ? "text-[#2a655f]" :
                step > s.number ? "text-emerald-500" :
                "text-muted-foreground"
              )}>
                {s.label}
              </span>
              {s.number < 3 && (
                <div className={cn(
                  "w-8 h-0.5 mx-1 hidden sm:block",
                  step > s.number ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* ===== STEP 1: ORDER INFO ===== */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-[#2a655f]" />
                {isArabic ? "معلومات الشحن والتسليم" : "Shipping & Delivery Info"}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? "أدخل معلومات مكان الاستلام والتسليم" 
                  : "Enter pickup and delivery locations"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pickup Info */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  <Store className="h-4 w-4 text-[#2a655f]" />
                  {isArabic ? "📍 معلومات الاستلام (من البائع)" : "📍 Pickup Info (From Seller)"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{isArabic ? "اسم المستلم *" : "Pickup Name *"}</Label>
                    <div className="relative">
                      <User className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.pickupName}
                        onChange={(e) => setFormData({ ...formData, pickupName: e.target.value })}
                        placeholder={isArabic ? "اسم البائع" : "Seller name"}
                        className="ps-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
                    <div className="relative">
                      <Phone className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.pickupPhone}
                        onChange={(e) => setFormData({ ...formData, pickupPhone: e.target.value })}
                        placeholder="+963 9xx xxx xxx"
                        className="ps-9"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? "العنوان *" : "Address *"}</Label>
                  <div className="relative">
                    <MapPin className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      value={formData.pickupAddress}
                      onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                      placeholder={isArabic ? "عنوان البائع بالتفصيل" : "Seller address in detail"}
                      className="ps-9 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4" />

              {/* Delivery Info */}
              <div className="space-y-4">
                <h4 className="font-semibold flex items-center gap-2 text-sm">
                  <Truck className="h-4 w-4 text-[#2a655f]" />
                  {isArabic ? "📍 معلومات التسليم (للمشتري)" : "📍 Delivery Info (To Buyer)"}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{isArabic ? "اسم المستلم *" : "Recipient Name *"}</Label>
                    <div className="relative">
                      <User className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.deliveryName}
                        onChange={(e) => setFormData({ ...formData, deliveryName: e.target.value })}
                        placeholder={isArabic ? "اسم المشتري" : "Buyer name"}
                        className="ps-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
                    <div className="relative">
                      <Phone className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.deliveryPhone}
                        onChange={(e) => setFormData({ ...formData, deliveryPhone: e.target.value })}
                        placeholder="+963 9xx xxx xxx"
                        className="ps-9"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>{isArabic ? "العنوان *" : "Address *"}</Label>
                  <div className="relative">
                    <MapPin className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      value={formData.deliveryAddress}
                      onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                      placeholder={isArabic ? "عنوان المشتري بالتفصيل" : "Buyer address in detail"}
                      className="ps-9 min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              {/* Additional */}
              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{isArabic ? "المبلغ المستلم (COD)" : "COD Amount"}</Label>
                    <div className="relative">
                      <DollarSign className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={formData.codAmount}
                        onChange={(e) => setFormData({ ...formData, codAmount: e.target.value })}
                        placeholder="0"
                        className="ps-9"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isArabic 
                        ? "المبلغ الذي سيتم تحصيله عند الاستلام" 
                        : "Amount to be collected on delivery"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>{isArabic ? "ملاحظات" : "Notes"}</Label>
                    <Textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder={isArabic ? "أي ملاحظات إضافية" : "Any additional notes"}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setStep(2)} 
                disabled={!isStep1Valid}
                className="w-full bg-[#2a655f] hover:bg-[#3a8a82] text-white"
              >
                {isArabic ? "التالي →" : "Next →"}
                <ArrowRight className="h-4 w-4 ml-1 rtl:rotate-180" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* ===== STEP 2: DELIVERY SELECTION ===== */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-[#2a655f]" />
                {isArabic ? "اختيار شركة التوصيل والموزع" : "Select Delivery Company & Distributor"}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? "اختر شركة التوصيل المناسبة والموزع المتاح" 
                  : "Choose delivery company and available distributor"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Delivery Company */}
              <div className="space-y-4">
                <Label>{isArabic ? "شركة التوصيل *" : "Delivery Company *"}</Label>
                {companiesLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : (
                  <Select
                    value={formData.deliveryCompanyId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, deliveryCompanyId: value, distributorId: "" });
                    }}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={isArabic ? "اختر شركة توصيل" : "Select delivery company"} />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company: any) => (
                        <SelectItem key={company.id} value={company.id}>
                          <div className="flex items-center gap-2">
                            <span>{isArabic ? company.name_ar : company.name_en}</span>
                            {company.is_featured && (
                              <Badge className="bg-yellow-500 text-white border-0 text-[9px]">
                                ⭐ {isArabic ? "مميز" : "Featured"}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Distributor */}
              <div className="space-y-4">
                <Label>{isArabic ? "الموزع *" : "Distributor *"}</Label>
                {distributorsLoading ? (
                  <Skeleton className="h-12 w-full" />
                ) : !formData.deliveryCompanyId ? (
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-center text-muted-foreground text-sm">
                    {isArabic 
                      ? "الرجاء اختيار شركة توصيل أولاً" 
                      : "Please select a delivery company first"}
                  </div>
                ) : distributors.length === 0 ? (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl text-center">
                    <AlertCircle className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {isArabic 
                        ? "لا يوجد موزعين متاحين لهذه الشركة حالياً" 
                        : "No distributors available for this company"}
                    </p>
                  </div>
                ) : (
                  <Select
                    value={formData.distributorId}
                    onValueChange={(value) => setFormData({ ...formData, distributorId: value })}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder={isArabic ? "اختر موزع" : "Select distributor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {distributors.map((dist: any) => (
                        <SelectItem key={dist.id} value={dist.id}>
                          <div className="flex items-center gap-2">
                            <span>{isArabic ? dist.full_name_ar : dist.full_name_en || dist.full_name_ar}</span>
                            <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[9px]">
                              ● {isArabic ? "متاح" : "Available"}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Estimate */}
              {selectedCompany && selectedDistributor && (
                <div className="p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? "رسوم التوصيل المقدرة" : "Estimated Delivery Fee"}
                      </p>
                      <p className="text-2xl font-bold text-[#2a655f]">
                        {estimatedFee} {app.currency}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">
                        {isArabic ? "الموزع" : "Distributor"}
                      </p>
                      <p className="font-medium">
                        {isArabic ? selectedDistributor.full_name_ar : selectedDistributor.full_name_en || selectedDistributor.full_name_ar}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(1)}
                  className="flex-1 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
                >
                  <ChevronLeft className="h-4 w-4 mr-1 rtl:rotate-180" />
                  {isArabic ? "السابق" : "Previous"}
                </Button>
                <Button 
                  onClick={() => setStep(3)} 
                  disabled={!isStep2Valid}
                  className="flex-1 bg-[#2a655f] hover:bg-[#3a8a82] text-white"
                >
                  {isArabic ? "التالي →" : "Next →"}
                  <ArrowRight className="h-4 w-4 ml-1 rtl:rotate-180" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ===== STEP 3: CONFIRM ===== */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
                {isArabic ? "تأكيد الطلب" : "Confirm Order"}
              </CardTitle>
              <CardDescription>
                {isArabic 
                  ? "راجع معلومات الطلب قبل التأكيد" 
                  : "Review order details before confirmation"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{isArabic ? "الاستلام من" : "Pickup From"}</p>
                  <p className="font-medium">{formData.pickupName}</p>
                  <p className="text-muted-foreground text-xs">{formData.pickupPhone}</p>
                  <p className="text-muted-foreground text-xs">{formData.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{isArabic ? "التسليم إلى" : "Deliver To"}</p>
                  <p className="font-medium">{formData.deliveryName}</p>
                  <p className="text-muted-foreground text-xs">{formData.deliveryPhone}</p>
                  <p className="text-muted-foreground text-xs">{formData.deliveryAddress}</p>
                </div>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{isArabic ? "شركة التوصيل" : "Delivery Company"}</p>
                  <p className="font-medium">
                    {selectedCompany && (isArabic ? selectedCompany.name_ar : selectedCompany.name_en)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">{isArabic ? "الموزع" : "Distributor"}</p>
                  <p className="font-medium">
                    {selectedDistributor && (isArabic ? selectedDistributor.full_name_ar : selectedDistributor.full_name_en || selectedDistributor.full_name_ar)}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200/50 dark:border-slate-700/50 pt-4 grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">{isArabic ? "رسوم التوصيل" : "Delivery Fee"}</p>
                  <p className="font-bold text-[#2a655f]">{estimatedFee} {app.currency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{isArabic ? "COD" : "COD"}</p>
                  <p className="font-bold">{parseFloat(formData.codAmount) || 0} {app.currency}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{isArabic ? "الإجمالي" : "Total"}</p>
                  <p className="font-bold text-emerald-500">
                    {(parseFloat(formData.codAmount) || 0) + estimatedFee} {app.currency}
                  </p>
                </div>
              </div>

              {formData.notes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">{isArabic ? "ملاحظات" : "Notes"}</p>
                  <p className="text-sm">{formData.notes}</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setStep(2)}
                  className="flex-1 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
                >
                  <ChevronLeft className="h-4 w-4 mr-1 rtl:rotate-180" />
                  {isArabic ? "السابق" : "Previous"}
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting}
                  className="flex-1 bg-[#2a655f] hover:bg-[#3a8a82] text-white"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isArabic ? "جاري الإنشاء..." : "Creating..."}
                    </>
                  ) : (
                    <>
                      {isArabic ? "✅ تأكيد الطلب" : "✅ Confirm Order"}
                      <CheckCircle className="h-4 w-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}