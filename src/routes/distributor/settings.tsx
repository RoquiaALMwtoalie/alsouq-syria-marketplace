// src/routes/distributor/settings.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDistributors, useUpdateDistributor, useGovernorates } from "@/lib/queries";
import {
  User, Phone, Mail, MapPin, Camera, 
  Save, X, ChevronLeft, CheckCircle,
  AlertCircle, Loader2, Upload, Trash2,
  Building2, Globe, Award, Star, Truck
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/distributor/settings")({
  component: DistributorSettingsPage,
  head: () => ({
    meta: [
      { title: "إعدادات الموزع - Souqi" },
      { name: "description", content: "تعديل الملف الشخصي للموزع" },
    ],
  }),
});

function DistributorSettingsPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "preferences">("profile");
  const [uploading, setUploading] = useState(false);

  // ✅ جلب بيانات الموزع
  const { data: distributors = [], isLoading, refetch } = useDistributors({
    isAvailable: true,
  });
  const { data: governorates = [] } = useGovernorates();
  const updateDistributor = useUpdateDistributor();

  // ✅ الموزع الحالي
  const currentDistributor = useMemo(() => {
    return distributors.find((d: any) => d.user_id === app.user?.id);
  }, [distributors, app.user]);

  // ✅ حالة النموذج
  const [formData, setFormData] = useState({
    full_name_ar: "",
    full_name_en: "",
    phone: "",
    email: "",
    address_ar: "",
    address_en: "",
    governorate_id: "",
    is_available: true,
    distributor_type: "freelance" as "freelance" | "company_employee",
  });

  // ✅ تحميل البيانات عند جلب الموزع
  useMemo(() => {
    if (currentDistributor) {
      setFormData({
        full_name_ar: currentDistributor.full_name_ar || "",
        full_name_en: currentDistributor.full_name_en || "",
        phone: currentDistributor.phone || "",
        email: currentDistributor.email || "",
        address_ar: currentDistributor.address_ar || "",
        address_en: currentDistributor.address_en || "",
        governorate_id: currentDistributor.governorate_id || "",
        is_available: currentDistributor.is_available !== false,
        distributor_type: currentDistributor.distributor_type || "freelance",
      });
    }
  }, [currentDistributor]);

  const isArabic = app.lang === "ar";

  // ✅ رفع الصورة
  const handleUploadImage = async (file: File) => {
    if (!app.user) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${app.user.id}-${Date.now()}.${fileExt}`;
      const filePath = `distributors/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // ✅ تحديث صورة الموزع
      await updateDistributor.mutateAsync({
        id: currentDistributor.id,
        patch: { avatar_url: publicUrl },
      });

      toast.success(
        isArabic 
          ? "✅ تم تحديث الصورة بنجاح" 
          : "✅ Image updated successfully"
      );
      
      refetch();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(
        isArabic 
          ? "❌ حدث خطأ في رفع الصورة" 
          : "❌ Error uploading image"
      );
    } finally {
      setUploading(false);
    }
  };

  // ✅ حفظ التغييرات
  const handleSave = async () => {
    if (!currentDistributor) return;

    // ✅ التحقق من الحقول المطلوبة
    if (!formData.full_name_ar.trim()) {
      toast.error(
        isArabic 
          ? "الاسم الكامل بالعربية مطلوب" 
          : "Full name in Arabic is required"
      );
      return;
    }

    if (!formData.phone.trim()) {
      toast.error(
        isArabic 
          ? "رقم الهاتف مطلوب" 
          : "Phone number is required"
      );
      return;
    }

    setIsSaving(true);
    try {
      await updateDistributor.mutateAsync({
        id: currentDistributor.id,
        patch: formData,
      });

      toast.success(
        isArabic 
          ? "✅ تم حفظ التغييرات بنجاح" 
          : "✅ Changes saved successfully"
      );
      
      refetch();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error(
        isArabic 
          ? "❌ حدث خطأ في حفظ التغييرات" 
          : "❌ Error saving changes"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // ✅ حذف الحساب (طلب إلغاء)
  const handleDeleteAccount = async () => {
    // ✅ في التطبيق الحقيقي، هنا يتم إرسال طلب إلغاء الحساب
    toast.success(
      isArabic 
        ? "✅ تم إرسال طلب إلغاء الحساب" 
        : "✅ Account deletion request sent"
    );
    setIsDeleteDialogOpen(false);
  };

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

  if (!currentDistributor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold">
            {isArabic ? "لم يتم العثور على الملف" : "Profile Not Found"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "ليس لديك ملف موزع مسجل" 
              : "You don't have a distributor profile registered"}
          </p>
          <Link to="/distributor/apply">
            <Button className="mt-6 bg-[#2a655f] hover:bg-[#3a8a82] text-white">
              {isArabic ? "تسجيل كموزع" : "Register as Distributor"}
            </Button>
          </Link>
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
        
        <div className="relative mx-auto max-w-3xl px-4 py-6 md:py-8">
          <div className="flex items-center gap-3">
            <Link to="/distributor/dashboard" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
              <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              {isArabic ? "لوحة التحكم" : "Dashboard"}
            </Link>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">
                  {isArabic ? "⚙️ إعدادات الموزع" : "⚙️ Distributor Settings"}
                </h1>
                <p className="text-white/80 text-xs">
                  {isArabic ? "تعديل الملف الشخصي والإعدادات" : "Edit profile and preferences"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {isArabic ? "الملف الشخصي" : "Profile"}
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              {isArabic ? "الحساب" : "Account"}
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              {isArabic ? "التفضيلات" : "Preferences"}
            </TabsTrigger>
          </TabsList>

          {/* ===== TAB: PROFILE ===== */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-[#2a655f]" />
                  {isArabic ? "المعلومات الشخصية" : "Personal Information"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "قم بتحديث معلوماتك الشخصية" 
                    : "Update your personal information"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center overflow-hidden">
                      {currentDistributor.avatar_url ? (
                        <img 
                          src={currentDistributor.avatar_url} 
                          alt="" 
                          className="h-full w-full object-cover" 
                        />
                      ) : (
                        <User className="h-12 w-12 text-[#2a655f]" />
                      )}
                    </div>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-[#2a655f] text-white flex items-center justify-center hover:bg-[#3a8a82] transition-colors shadow-lg"
                      disabled={uploading}
                    >
                      {uploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Camera className="h-4 w-4" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleUploadImage(file);
                      }}
                    />
                  </div>
                  <div className="flex-1 text-center sm:text-right">
                    <p className="font-bold text-lg">
                      {isArabic ? formData.full_name_ar : formData.full_name_en || formData.full_name_ar}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {currentDistributor.email || (isArabic ? "بريد إلكتروني غير مسجل" : "No email registered")}
                    </p>
                    <Badge className={cn(
                      "mt-1",
                      currentDistributor.is_available 
                        ? "bg-emerald-500/10 text-emerald-600 border-0" 
                        : "bg-red-500/10 text-red-500 border-0"
                    )}>
                      {currentDistributor.is_available 
                        ? (isArabic ? "✅ متاح" : "✅ Available") 
                        : (isArabic ? "❌ غير متاح" : "❌ Unavailable")}
                    </Badge>
                  </div>
                </div>

                {/* Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{isArabic ? "الاسم الكامل (عربي) *" : "Full Name (Arabic) *"}</Label>
                    <div className="relative">
                      <User className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.full_name_ar}
                        onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
                        className="ps-9"
                        dir="rtl"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{isArabic ? "الاسم الكامل (إنجليزي)" : "Full Name (English)"}</Label>
                    <div className="relative">
                      <User className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.full_name_en}
                        onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
                        className="ps-9"
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>{isArabic ? "رقم الهاتف *" : "Phone Number *"}</Label>
                    <div className="relative">
                      <Phone className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="ps-9"
                        dir="ltr"
                        placeholder="+963 9xx xxx xxx"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{isArabic ? "البريد الإلكتروني" : "Email"}</Label>
                    <div className="relative">
                      <Mail className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="ps-9"
                        dir="ltr"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
                  <div className="relative">
                    <MapPin className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      value={formData.address_ar}
                      onChange={(e) => setFormData({ ...formData, address_ar: e.target.value })}
                      className="ps-9 min-h-[80px]"
                      dir="rtl"
                      placeholder={isArabic ? "العنوان بالتفصيل" : "Detailed address"}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "العنوان (إنجليزي)" : "Address (English)"}</Label>
                  <div className="relative">
                    <MapPin className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
                    <Textarea
                      value={formData.address_en}
                      onChange={(e) => setFormData({ ...formData, address_en: e.target.value })}
                      className="ps-9 min-h-[80px]"
                      dir="ltr"
                      placeholder="Detailed address in English"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{isArabic ? "المحافظة" : "Governorate"}</Label>
                  <Select
                    value={formData.governorate_id}
                    onValueChange={(value) => setFormData({ ...formData, governorate_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={isArabic ? "اختر المحافظة" : "Select governorate"} />
                    </SelectTrigger>
                    <SelectContent>
                      {governorates.map((g: any) => (
                        <SelectItem key={g.id} value={g.id}>
                          {isArabic ? g.name_ar : g.name_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSave} 
                  disabled={isSaving}
                  className="w-full bg-[#2a655f] hover:bg-[#3a8a82] text-white"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {isArabic ? "جاري الحفظ..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {isArabic ? "حفظ التغييرات" : "Save Changes"}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: ACCOUNT ===== */}
          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-[#2a655f]" />
                  {isArabic ? "إعدادات الحساب" : "Account Settings"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "إدارة إعدادات الحساب والصلاحيات" 
                    : "Manage account settings and permissions"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{isArabic ? "نوع الحساب" : "Account Type"}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentDistributor.distributor_type === "company_employee" 
                          ? (isArabic ? "موظف في شركة توصيل" : "Company Employee") 
                          : (isArabic ? "موزع مستقل" : "Freelance Distributor")}
                      </p>
                    </div>
                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0">
                      {currentDistributor.distributor_type === "company_employee" 
                        ? (isArabic ? "🏢 شركة" : "🏢 Company") 
                        : (isArabic ? "🆓 مستقل" : "🆓 Freelance")}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{isArabic ? "الحالة" : "Status"}</p>
                      <p className="text-sm text-muted-foreground">
                        {currentDistributor.is_available 
                          ? (isArabic ? "متاح للاستلام" : "Available for pickups") 
                          : (isArabic ? "غير متاح" : "Not available")}
                      </p>
                    </div>
                    <Badge className={cn(
                      currentDistributor.is_available 
                        ? "bg-emerald-500/10 text-emerald-600 border-0" 
                        : "bg-red-500/10 text-red-500 border-0"
                    )}>
                      {currentDistributor.is_available 
                        ? (isArabic ? "✅ متاح" : "✅ Available") 
                        : (isArabic ? "❌ غير متاح" : "❌ Unavailable")}
                    </Badge>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{isArabic ? "التقييم" : "Rating"}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-bold">
                          {Number(currentDistributor.rating || 0).toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({currentDistributor.reviews_count || 0} {isArabic ? "تقييم" : "reviews"})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">{isArabic ? "الطلبات المكتملة" : "Completed Orders"}</p>
                      <p className="text-xl font-bold text-[#2a655f]">
                        {currentDistributor.completed_orders || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-red-200/50 dark:border-red-800/50 pt-4">
                  <Button 
                    variant="destructive" 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="w-full"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {isArabic ? "طلب إلغاء الحساب" : "Request Account Deletion"}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    {isArabic 
                      ? "سيتم إرسال طلب إلغاء الحساب للإدارة للمراجعة" 
                      : "Account deletion request will be sent to administration for review"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ===== TAB: PREFERENCES ===== */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-[#2a655f]" />
                  {isArabic ? "تفضيلات التوصيل" : "Delivery Preferences"}
                </CardTitle>
                <CardDescription>
                  {isArabic 
                    ? "إعدادات تفضيلات التوصيل الخاصة بك" 
                    : "Manage your delivery preferences"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                    <div>
                      <p className="font-medium">{isArabic ? "الحالة" : "Availability Status"}</p>
                      <p className="text-sm text-muted-foreground">
                        {isArabic 
                          ? "حدد ما إذا كنت متاحاً لتلقي طلبات التوصيل" 
                          : "Set whether you're available to receive delivery orders"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={formData.is_available ? "default" : "outline"}
                        size="sm"
                        className={formData.is_available ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                        onClick={() => setFormData({ ...formData, is_available: true })}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {isArabic ? "متاح" : "Available"}
                      </Button>
                      <Button
                        variant={!formData.is_available ? "default" : "outline"}
                        size="sm"
                        className={!formData.is_available ? "bg-red-500 hover:bg-red-600" : ""}
                        onClick={() => setFormData({ ...formData, is_available: false })}
                      >
                        <X className="h-4 w-4 mr-1" />
                        {isArabic ? "غير متاح" : "Unavailable"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{isArabic ? "نوع الموزع" : "Distributor Type"}</Label>
                    <Select
                      value={formData.distributor_type}
                      onValueChange={(value: any) => setFormData({ ...formData, distributor_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="freelance">
                          {isArabic ? "🆓 موزع مستقل" : "🆓 Freelance"}
                        </SelectItem>
                        <SelectItem value="company_employee">
                          {isArabic ? "🏢 موظف شركة توصيل" : "🏢 Company Employee"}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    onClick={handleSave} 
                    disabled={isSaving}
                    className="w-full bg-[#2a655f] hover:bg-[#3a8a82] text-white"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {isArabic ? "جاري الحفظ..." : "Saving..."}
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {isArabic ? "حفظ التغييرات" : "Save Changes"}
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* ===== DELETE ACCOUNT DIALOG ===== */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              {isArabic ? "⚠️ تحذير: إلغاء الحساب" : "⚠️ Warning: Account Deletion"}
            </DialogTitle>
            <DialogDescription>
              {isArabic 
                ? "هل أنت متأكد من رغبتك في إلغاء حسابك كموزع؟ هذا الإجراء لا يمكن التراجع عنه." 
                : "Are you sure you want to delete your distributor account? This action cannot be undone."}
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">
              {isArabic 
                ? "⚠️ سيتم إرسال طلب إلغاء الحساب للإدارة. سيتم إلغاء جميع الطلبات المعلقة." 
                : "⚠️ Account deletion request will be sent to administration. All pending orders will be cancelled."}
            </p>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteAccount}
            >
              {isArabic ? "تأكيد الإلغاء" : "Confirm Deletion"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}