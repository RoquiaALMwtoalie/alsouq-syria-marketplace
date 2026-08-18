// src/routes/delivery/complete.tsx

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Building2, Phone, MapPin, Save, Sparkles, Map, Edit3, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useApp } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useMyDeliveryCompany, useUpdateDeliveryCompany } from "@/lib/queries";
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";

export const Route = createFileRoute("/delivery/complete")({
  component: DeliveryCompletePage,
  head: () => ({ meta: [{ title: "أكمل بيانات شركتك — السوق اليك" }] }),
});

// ✅ دالة استخراج المحافظة من العنوان
async function extractGovernorateFromAddress(address: string, lat?: number, lng?: number): Promise<{ governorate_id: string; governorate_name: string }> {
  try {
    // 1. حاول استخراج المحافظة من الإحداثيات
    if (lat && lng) {
      const { data: governorates } = await supabase
        .from('governorates')
        .select('*');

      if (governorates) {
        for (const g of governorates) {
          if (g.center_lat && g.center_lng) {
            const distance = Math.sqrt(
              Math.pow(lat - g.center_lat, 2) + 
              Math.pow(lng - g.center_lng, 2)
            );
            if (distance < 0.5) {
              return {
                governorate_id: g.id,
                governorate_name: g.name_ar
              };
            }
          }
        }
      }
    }

    // 2. حاول استخراج المحافظة من النص
    if (address) {
      const { data: governorates } = await supabase
        .from('governorates')
        .select('*');

      if (governorates) {
        for (const g of governorates) {
          if (address.includes(g.name_ar) || address.includes(g.name_en || '')) {
            return {
              governorate_id: g.id,
              governorate_name: g.name_ar
            };
          }
        }
      }
    }

    // 3. قيمة افتراضية (دمشق)
    const { data: defaultGov } = await supabase
      .from('governorates')
      .select('id, name_ar')
      .eq('name_ar', 'دمشق')
      .single();

    if (defaultGov) {
      return {
        governorate_id: defaultGov.id,
        governorate_name: defaultGov.name_ar
      };
    }

    return { governorate_id: '', governorate_name: '' };
  } catch (error) {
    console.error('Error extracting governorate:', error);
    return { governorate_id: '', governorate_name: '' };
  }
}

function DeliveryCompletePage() {
  const app = useApp();
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [companyData, setCompanyData] = useState<any>(null);
  const [location, setLocation] = useState<PickedLocation | null>(null);
  
  const [addressMethod, setAddressMethod] = useState<"manual" | "map">("manual");
  
  const { data: company, isLoading: companyLoading } = useMyDeliveryCompany(app.user?.id);
  const updateCompany = useUpdateDeliveryCompany();
  
  const isArabic = app.lang === "ar";

  useEffect(() => {
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        window.location.replace("/auth/login");
        return;
      }
      
      const { data: roleRows } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id);
      
      const role = roleRows?.[0]?.role;
      
      if (role !== "delivery_company") {
        window.location.replace("/");
        return;
      }
      
      const { data: company, error } = await supabase
        .from("delivery_companies")
        .select("*")
        .eq("created_by", userData.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Error fetching company:", error);
        window.location.replace("/delivery/dashboard");
        return;
      }
      
      if (company?.is_verified) {
        window.location.replace("/delivery/dashboard");
        return;
      }
      
      setCompanyData(company);
      setChecking(false);
    })();
  }, []);

async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const formData = new FormData(form);
  
  const patch: any = {
    name_ar: formData.get("name_ar") as string,
    name_en: formData.get("name_en") as string,
    phone: formData.get("phone") as string,
    description_ar: formData.get("description_ar") as string,
    description_en: formData.get("description_en") as string,
    base_price: parseFloat(formData.get("base_price") as string) || 0,
    price_per_km: parseFloat(formData.get("price_per_km") as string) || 0,
    free_delivery_threshold: parseFloat(formData.get("free_delivery_threshold") as string) || 0,
    min_delivery_fee: parseFloat(formData.get("min_delivery_fee") as string) || 0,
    max_delivery_fee: parseFloat(formData.get("max_delivery_fee") as string) || 15000,
    avg_delivery_time: parseInt(formData.get("avg_delivery_time") as string) || 60,
    has_tracking: formData.get("has_tracking") === "on",
    has_insurance: formData.get("has_insurance") === "on",
    has_cod: formData.get("has_cod") === "on",
    has_express: formData.get("has_express") === "on",
    is_active: formData.get("is_active") === "on",
    is_verified: true,
  };

  let governorateId = "";

  // ✅ ✅ ✅ إذا اختار الخريطة ✅ ✅ ✅
  if (addressMethod === "map" && location) {
    patch.address_ar = location.address;
    patch.address_en = location.address;
    
    const result = await extractGovernorateFromAddress(
      location.address,
      location.lat,
      location.lng
    );
    governorateId = result.governorate_id;
    
    // ✅ حفظ في profiles
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        lat: location.lat || 0,
        lng: location.lng || 0,
        address_text: location.address.trim(),
        governorate_id: governorateId || null,
      })
      .eq("id", app.user?.id);
    
    if (updateProfileError) {
      console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
    }
  } else {
    // ✅ ✅ ✅ إذا اختار يدوي ✅ ✅ ✅
    patch.address_ar = formData.get("address_ar") as string;
    patch.address_en = formData.get("address_en") as string;
    
    const result = await extractGovernorateFromAddress(patch.address_ar);
    governorateId = result.governorate_id;
    
    // ✅ ✅ ✅ حفظ العنوان في profiles أيضاً (مهم!)
    const { error: updateProfileError } = await supabase
      .from("profiles")
      .update({
        address_text: patch.address_ar.trim(),
        governorate_id: governorateId || null,
      })
      .eq("id", app.user?.id);
    
    if (updateProfileError) {
      console.error("❌ خطأ في تحديث البروفايل:", updateProfileError);
    }
  }

  if (governorateId) {
    patch.governorate_id = governorateId;
    console.log("📍 Saving governorate_id to company:", governorateId);
  }

  setLoading(true);
  
  try {
    await updateCompany.mutateAsync({
      id: companyData.id,
      patch
    });
    
    toast.success(
      isArabic 
        ? "✅ تم إكمال بيانات الشركة بنجاح! جاري التوجيه للداشبورد..."
        : "✅ Company data completed successfully! Redirecting to dashboard..."
    );
    
    setTimeout(() => {
      window.location.replace("/delivery/dashboard");
    }, 1500);
    
  } catch (error) {
    console.error("Error updating company:", error);
    toast.error(isArabic ? "❌ فشل تحديث بيانات الشركة" : "❌ Failed to update company");
  } finally {
    setLoading(false);
  }
}
  if (checking || companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#0d2e2a] border-t-transparent mx-auto" />
          <p className="mt-4 text-gray-600">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-140px)] overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#0d2e2a] via-[#1a4f4a] to-[#2a655f]" />
      
      <div className="min-h-[calc(100vh-140px)] grid place-items-center px-4 py-10">
        <div className="w-full max-w-4xl">
          <div className="text-center text-white mb-6">
            <div className="inline-flex items-center gap-2">
              <div className="h-11 w-11 rounded-xl bg-white/20 backdrop-blur grid place-items-center font-black text-xl">س</div>
              <div className="font-black text-2xl">السوق اليك</div>
            </div>
            <div className="mt-2 text-sm text-white/85">
              {isArabic 
                ? "📋 أكمل بيانات شركتك لتفعيل حساب التوصيل" 
                : "📋 Complete your company data to activate delivery"}
            </div>
          </div>

          <div className="rounded-3xl border border-white/25 bg-white/15 backdrop-blur-2xl shadow-2xl p-6 md:p-8 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black">
                {isArabic ? "🏢 معلومات شركة التوصيل" : "🏢 Delivery Company Info"}
              </h2>
              <Sparkles className="h-5 w-5 text-yellow-300" />
            </div>
            <p className="text-white/80 text-sm mt-1">
              {isArabic 
                ? "يرجى إكمال جميع البيانات المطلوبة لتفعيل حساب شركتك" 
                : "Please complete all required data to activate your company"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-5">
              {/* ===== الاسم ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-white/90 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> 
                    {isArabic ? "اسم الشركة (عربي)" : "Company Name (Arabic)"} *
                  </Label>
                  <Input 
                    name="name_ar" 
                    defaultValue={companyData?.name_ar || ''}
                    placeholder={isArabic ? "شركة التوصيل السريع" : "Fast Delivery Company"}
                    required
                    className="h-11 bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-white/90 flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" /> 
                    {isArabic ? "اسم الشركة (إنجليزي)" : "Company Name (English)"} *
                  </Label>
                  <Input 
                    name="name_en" 
                    defaultValue={companyData?.name_en || ''}
                    placeholder={isArabic ? "Fast Delivery Company" : "Fast Delivery Company"}
                    required
                    className="h-11 bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50"
                  />
                </div>
              </div>

              {/* ===== رقم الهاتف ===== */}
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-white/90 flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> 
                    {isArabic ? "رقم الهاتف" : "Phone"} *
                  </Label>
                  <Input 
                    name="phone" 
                    type="tel"
                    defaultValue={companyData?.phone || ''}
                    placeholder="09XXXXXXXX"
                    required
                    className="h-11 bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50"
                  />
                </div>
              </div>

              {/* ===== ✅ ✅ ✅ اختيار طريقة إدخال العنوان ✅ ✅ ✅ ===== */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-white/90">
                  {isArabic ? "📍 طريقة إدخال العنوان" : "📍 Address Input Method"}
                </Label>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAddressMethod("manual")}
                    className={`
                      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300
                      ${addressMethod === "manual" 
                        ? "bg-white/20 border-2 border-white shadow-lg" 
                        : "bg-white/5 border-2 border-white/10 hover:bg-white/10"}
                    `}
                  >
                    <Edit3 className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isArabic ? "📝 كتابة يدوية" : "✏️ Manual"}
                    </span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setAddressMethod("map")}
                    className={`
                      flex items-center justify-center gap-2 p-3 rounded-xl transition-all duration-300
                      ${addressMethod === "map" 
                        ? "bg-white/20 border-2 border-white shadow-lg" 
                        : "bg-white/5 border-2 border-white/10 hover:bg-white/10"}
                    `}
                  >
                    <Map className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {isArabic ? "🗺️ اختيار من الخريطة" : "🗺️ Map"}
                    </span>
                  </button>
                </div>
              </div>

              {/* ===== ✅ ✅ ✅ حقل العنوان بناءً على الاختيار ✅ ✅ ✅ ===== */}
              {addressMethod === "manual" ? (
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4 animate-in fade-in-50 duration-300">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-white/90 flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" /> 
                      {isArabic ? "العنوان" : "Address"} *
                    </Label>
                    <Textarea 
                      name="address_ar" 
                      defaultValue={companyData?.address_ar || ''}
                      placeholder={isArabic ? "مثال: شارع الأندلس، مبنى 5، الطابق 3" : "Example: Al-Andalus Street, Building 5, Floor 3"}
                      required
                      rows={2}
                      className="bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 animate-in fade-in-50 duration-300">
                  <Label className="text-xs font-semibold text-white/90 flex items-center gap-1">
                    <Map className="h-3.5 w-3.5" /> 
                    {isArabic ? "اختر موقعك على الخريطة" : "Select your location on the map"} *
                  </Label>
                  <div className="rounded-xl bg-white/90 text-foreground p-3 border border-[#2a655f]/20 focus-within:border-[#2a655f]/50 transition-all duration-300">
                    <AddressPicker 
                      value={location ?? undefined} 
                      onChange={setLocation} 
                      lang={app.lang} 
                    />
                  </div>
                  {location && (
                    <p className="text-xs text-emerald-300 flex items-center gap-1">
                      ✅ {isArabic ? "تم اختيار الموقع" : "Location selected"}
                    </p>
                  )}
                  <p className="text-[10px] text-white/70">
                    {isArabic 
                      ? "📍 سيتم استخدام العنوان المختار من الخريطة تلقائياً" 
                      : "📍 The selected address from the map will be used automatically"}
                  </p>
                </div>
              )}

              {/* ===== الوصف ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-white/90 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> 
                    {isArabic ? "الوصف (عربي)" : "Description (Arabic)"}
                  </Label>
                  <Textarea 
                    name="description_ar" 
                    defaultValue={companyData?.description_ar || ''}
                    placeholder={isArabic ? "وصف الشركة بالعربية" : "Company description in Arabic"}
                    rows={3}
                    className="bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-semibold text-white/90 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> 
                    {isArabic ? "الوصف (إنجليزي)" : "Description (English)"}
                  </Label>
                  <Textarea 
                    name="description_en" 
                    defaultValue={companyData?.description_en || ''}
                    placeholder={isArabic ? "وصف الشركة بالإنجليزية" : "Company description in English"}
                    rows={3}
                    className="bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50"
                  />
                </div>
              </div>

              {/* ===== التسعير ===== */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-white/90">
                    {isArabic ? "السعر الأساسي" : "Base Price"} *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="base_price" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.base_price || 0}
                      required
                      className="h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-white/90">
                    {isArabic ? "سعر الكيلومتر" : "Price per KM"} *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="price_per_km" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.price_per_km || 0}
                      required
                      className="h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-white/90">
                    {isArabic ? "الحد الأدنى" : "Min Fee"} *
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="min_delivery_fee" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.min_delivery_fee || 0}
                      required
                      className="h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50"
                    />
                  </div>
                </div>
               <div className="space-y-1">
  <Label className="text-xs font-medium text-white/90 flex items-center gap-1">
    <DollarSign className="h-3.5 w-3.5" />
    {isArabic ? "الحد الأقصى للتوصيل" : "Max Delivery Fee"} *
    <span className="text-[10px] text-yellow-300/80 font-normal">
      ({isArabic ? "مثال: 15000" : "Example: 15000"})
    </span>
  </Label>
  <div className="relative">
    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
    <Input 
      name="max_delivery_fee" 
      type="number"
      step="0.01"
      defaultValue={companyData?.max_delivery_fee || 15000}
      required
      className="h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50"
    />
  </div>
  <p className="text-[10px] text-white/70">
    {isArabic 
      ? "💡 الحد الأقصى لسعر التوصيل (يُفضل ألا يتجاوز 15,000 ل.س)" 
      : "💡 Maximum delivery fee (preferably not exceeding 15,000 SYP)"}
  </p>
</div>
              </div>

              {/* ===== قيمة التوصيل المجاني ووقت التوصيل ===== */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-white/90">
                    {isArabic ? "قيمة التوصيل المجاني" : "Free Delivery Threshold"}
                  </Label>
                  <div className="relative">
                    <span className="absolute inset-y-0 start-3 flex items-center text-xs text-muted-foreground">ل.س</span>
                    <Input 
                      name="free_delivery_threshold" 
                      type="number"
                      step="0.01"
                      defaultValue={companyData?.free_delivery_threshold || 0}
                      className="h-10 bg-white/90 text-foreground border-0 ps-10 focus:ring-2 focus:ring-[#2a655f]/50"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-medium text-white/90">
                    {isArabic ? "متوسط وقت التوصيل" : "Avg Delivery Time"} *
                  </Label>
                  <Input 
                    name="avg_delivery_time" 
                    type="number"
                    defaultValue={companyData?.avg_delivery_time || 60}
                    required
                    className="h-10 bg-white/90 text-foreground border-0 focus:ring-2 focus:ring-[#2a655f]/50"
                  />
                  <p className="text-[10px] text-white/70">{isArabic ? "بالدقائق" : "In minutes"}</p>
                </div>
              </div>

              {/* ===== الخيارات (Checkboxes) ===== */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-4 bg-white/10 rounded-xl">
                <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="has_tracking" 
                    defaultChecked={companyData?.has_tracking ?? true}
                    className="h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50"
                  />
                  {isArabic ? "تتبع" : "Tracking"}
                </label>
                <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="has_insurance" 
                    defaultChecked={companyData?.has_insurance ?? true}
                    className="h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50"
                  />
                  {isArabic ? "تأمين" : "Insurance"}
                </label>
                <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="has_cod" 
                    defaultChecked={companyData?.has_cod ?? true}
                    className="h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50"
                  />
                  {isArabic ? "دفع عند الاستلام" : "Cash on Delivery"}
                </label>
                <label className="flex items-center gap-2 text-sm text-white/90 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="has_express" 
                    defaultChecked={companyData?.has_express ?? true}
                    className="h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50"
                  />
                  {isArabic ? "توصيل سريع" : "Express"}
                </label>
              </div>

              {/* ===== حالة النشاط ===== */}
              <div className="flex items-center gap-3 p-4 bg-white/10 rounded-xl">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  defaultChecked={companyData?.is_active !== false}
                  className="h-4 w-4 rounded border-white/30 text-[#2a655f] focus:ring-[#2a655f]/50"
                />
                <Label className="text-sm font-medium text-white/90 cursor-pointer">
                  {isArabic ? "🟢 الشركة نشطة" : "🟢 Company is active"}
                </Label>
              </div>

              {/* ===== أزرار ===== */}
              <Button 
                type="submit" 
                size="lg" 
                className="w-full h-12 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-xl transition-all duration-300 font-bold" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {isArabic ? "جاري الحفظ..." : "Saving..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save className="h-5 w-5" />
                    {isArabic ? "حفظ وتفعيل الشركة" : "Save & Activate Company"}
                  </span>
                )}
              </Button>

              <p className="text-xs text-white/70 text-center">
                {isArabic 
                  ? "🔒 بعد حفظ البيانات سيتم تفعيل حساب شركتك ويمكنك البدء في استلام الطلبات" 
                  : "🔒 After saving, your company account will be activated and you can start receiving orders"}
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== أيقونة FileText =====
function FileText(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}