// src/routes/distributors/index.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { useDistributors, useGovernorates, useMyDeliveryCompany } from "@/lib/queries"; // ✅ أضف useMyDeliveryCompany
import { supabase } from "@/integrations/supabase/client";
import {
  Users, MapPin, Star, Phone, Mail, Clock, 
  CheckCircle, XCircle, Search, Filter,
  Truck, Package, Award, UserCheck, UserX,
  Plus, Edit3, Trash2, X, Save, Loader2,
  AlertCircle, Eye, EyeOff, Lock, Sparkles,
  Building2, Store, Globe, ShoppingBag,
  Megaphone, Rocket, Gem, Crown, Flame,
  CheckCircle as CheckCircleIcon,
  Power, PowerOff, // ✅ أضف Power و PowerOff
  UserPlus, // ✅ أضف UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImageInput } from "@/components/ImageInput";
import { useState, useMemo, useCallback } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/distributors/")({
  component: DistributorsPage,
  head: () => ({
    meta: [
      { title: "الموزعين - Souqi" },
      { name: "description", content: "جميع الموزعين المتاحين للتوصيل في السوق اليك" },
    ],
  }),
});

function DistributorsPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [governorateFilter, setGovernorateFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");

  // ✅ State لإضافة موزع
  const [showAddDistributorDialog, setShowAddDistributorDialog] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
  // ✅ State لتعديل موزع
  const [showEditDistributorDialog, setShowEditDistributorDialog] = useState(false);
  const [editingDistributor, setEditingDistributor] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  // ✅ State للفلديشن (نفس dashboard)
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fullNameAr, setFullNameAr] = useState("");
  const [fullNameEn, setFullNameEn] = useState("");
  const [addressAr, setAddressAr] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [governorateId, setGovernorateId] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [distributorType, setDistributorType] = useState("freelance");

  // ✅ State لفلديشن الرقم
  const [isPhoneChecking, setIsPhoneChecking] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [phoneAvailable, setPhoneAvailable] = useState<boolean | null>(null);
  const [isPhoneChanged, setIsPhoneChanged] = useState(false);

  // ✅ State للتعديل
  const [editPhone, setEditPhone] = useState("");
  const [editFullNameAr, setEditFullNameAr] = useState("");
  const [editFullNameEn, setEditFullNameEn] = useState("");
  const [editAddressAr, setEditAddressAr] = useState("");
  const [editAddressEn, setEditAddressEn] = useState("");
  const [editGovernorateId, setEditGovernorateId] = useState("");
  const [editIsAvailable, setEditIsAvailable] = useState(true);
  const [editDistributorType, setEditDistributorType] = useState("freelance");
  const [editAvatarUrl, setEditAvatarUrl] = useState<string | null>(null);
  
  // ✅ State لفلديشن الرقم في التعديل
  const [isEditPhoneChecking, setIsEditPhoneChecking] = useState(false);
  const [editPhoneError, setEditPhoneError] = useState<string | null>(null);
  const [editPhoneAvailable, setEditPhoneAvailable] = useState<boolean | null>(null);
  const [isEditPhoneChanged, setIsEditPhoneChanged] = useState(false);

  const isArabic = app.lang === "ar";

  // ✅ ✅ ✅ جلب شركة المستخدم أولاً
  const { data: company, isLoading: companyLoading } = useMyDeliveryCompany(app.user?.id);

  // ✅ ✅ ✅ جلب الموزعين (يعتمد على company.id)
  const { 
    data: distributors = [], 
    isLoading: loadingDistributors, 
    refetch: refetchDistributors 
  } = useDistributors({
    companyId: company?.id,  // ✅ فلتر حسب الشركة
    isAvailable: true,
  });

  const { data: governorates = [] } = useGovernorates();

  // ✅ إذا كان المستخدم ليس تابعاً لشركة توصيل
  if (!companyLoading && !company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50/80 via-white to-[#0d2e2a]/5">
        <div className="text-center max-w-md p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200/50">
          <Building2 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {isArabic ? "🚫 غير مصرح" : "🚫 Unauthorized"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isArabic 
              ? "أنت لست تابعاً لشركة توصيل. يرجى التواصل مع الإدارة."
              : "You are not affiliated with a delivery company. Please contact management."}
          </p>
          <Button 
            className="mt-6 bg-[#0d2e2a] text-white hover:bg-[#1a4f4a]"
            onClick={() => navigate({ to: "/" })}
          >
            {isArabic ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  // ✅ التحقق من توفر الرقم (نفس dashboard)
  const checkPhoneAvailability = useCallback(async (phone: string, excludeId?: string) => {
    if (!phone || phone.length < 5) {
      setPhoneError(null);
      setPhoneAvailable(null);
      return;
    }

    setIsPhoneChecking(true);
    try {
      let query = supabase
        .from("profiles")
        .select("id, phone")
        .eq("phone", phone.trim());
      
      if (excludeId) {
        query = query.neq("id", excludeId);
      }
      
      const { data, error } = await query.maybeSingle();

      if (error) throw error;

      if (data) {
        setPhoneError("⚠️ هذا الرقم مستخدم من قبل");
        setPhoneAvailable(false);
      } else {
        setPhoneError(null);
        setPhoneAvailable(true);
      }
    } catch (error) {
      console.error("Error checking phone:", error);
      setPhoneError("حدث خطأ في التحقق من الرقم");
      setPhoneAvailable(false);
    } finally {
      setIsPhoneChecking(false);
    }
  }, []);

  // ✅ التحقق من توفر الرقم للتعديل
  const checkEditPhoneAvailability = useCallback(async (phone: string) => {
    if (!phone || phone.length < 5) {
      setEditPhoneError(null);
      setEditPhoneAvailable(null);
      return;
    }

    setIsEditPhoneChecking(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, phone")
        .eq("phone", phone.trim())
        .neq("id", editingDistributor?.user_id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setEditPhoneError("⚠️ هذا الرقم مستخدم من قبل");
        setEditPhoneAvailable(false);
      } else {
        setEditPhoneError(null);
        setEditPhoneAvailable(true);
      }
    } catch (error) {
      console.error("Error checking phone:", error);
      setEditPhoneError("حدث خطأ في التحقق من الرقم");
      setEditPhoneAvailable(false);
    } finally {
      setIsEditPhoneChecking(false);
    }
  }, [editingDistributor]);

  // ✅ فلترة الموزعين
  const filteredDistributors = useMemo(() => {
    let result = distributors;

    if (governorateFilter !== "all") {
      result = result.filter((d: any) => d.governorate_id === governorateFilter);
    }

    if (availabilityFilter !== "all") {
      result = result.filter((d: any) => 
        availabilityFilter === "available" ? d.is_available : !d.is_available
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((d: any) => {
        const nameAr = d.full_name_ar?.toLowerCase() || "";
        const nameEn = d.full_name_en?.toLowerCase() || "";
        const phone = d.phone || "";
        return nameAr.includes(q) || nameEn.includes(q) || phone.includes(q);
      });
    }

    return result;
  }, [distributors, searchQuery, governorateFilter, availabilityFilter]);

  // ✅ إضافة موزع (مع ربط بالشركة)
  const handleAddDistributor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fullNameAr.trim()) {
      toast.error(isArabic ? "الاسم (عربي) مطلوب" : "Name (Arabic) is required");
      return;
    }

    if (!phone.trim() || phone.length < 9) {
      toast.error(isArabic ? "رقم هاتف صحيح مطلوب" : "Valid phone number is required");
      return;
    }

    // ❌ إذا الرقم موجود، نمنع الإضافة
    if (phoneAvailable === false || phoneError) {
      toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل" : "❌ This phone number is already in use");
      return;
    }

    if (!password || password.length < 6) {
      toast.error(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      return;
    }

    setIsAdding(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-distributor`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            phone: phone.trim(),
            password: password,
            full_name_ar: fullNameAr.trim(),
            full_name_en: fullNameEn.trim() || null,
            address_ar: addressAr.trim() || null,
            address_en: addressEn.trim() || null,
            governorate_id: governorateId || null,
            company_id: company?.id || null, // ✅ ربط بالشركة الحالية
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to create distributor');
      }

      toast.success(
        isArabic
          ? `✅ تم إضافة الموزع بنجاح!\n📱 ${phone}\n🔑 ${password}`
          : `✅ Distributor added successfully!\n📱 ${phone}\n🔑 ${password}`
      );

      setShowAddDistributorDialog(false);
      resetForm();
      await refetchDistributors();

    } catch (error: any) {
      console.error("❌ Error creating distributor:", error);
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    } finally {
      setIsAdding(false);
    }
  };

  // ✅ فتح ديالوج تعديل الموزع
  const openEditDialog = (distributor: any) => {
    setEditingDistributor(distributor);
    setEditPhone(distributor.phone || "");
    setEditFullNameAr(distributor.full_name_ar || "");
    setEditFullNameEn(distributor.full_name_en || "");
    setEditAddressAr(distributor.address_ar || "");
    setEditAddressEn(distributor.address_en || "");
    setEditGovernorateId(distributor.governorate_id || "");
    setEditIsAvailable(distributor.is_available ?? true);
    setEditDistributorType(distributor.distributor_type || "freelance");
    setEditAvatarUrl(distributor.avatar_url || null);
    setIsEditPhoneChanged(false);
    setEditPhoneAvailable(null);
    setEditPhoneError(null);
    setShowEditDistributorDialog(true);
  };

  // ✅ تحديث الموزع
  const handleUpdateDistributor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingDistributor) return;

    if (!editFullNameAr.trim()) {
      toast.error(isArabic ? "الاسم (عربي) مطلوب" : "Name (Arabic) is required");
      return;
    }

    if (!editPhone.trim() || editPhone.length < 9) {
      toast.error(isArabic ? "رقم هاتف صحيح مطلوب" : "Valid phone number is required");
      return;
    }

    // ❌ إذا تم تغيير الرقم وهو غير متاح
    if (isEditPhoneChanged && editPhoneAvailable === false) {
      toast.error(isArabic ? "❌ هذا الرقم مستخدم من قبل" : "❌ This phone number is already in use");
      return;
    }

    setIsEditing(true);

    try {
      const patch: any = {
        full_name_ar: editFullNameAr.trim(),
        full_name_en: editFullNameEn.trim() || null,
        phone: editPhone.trim(),
        address_ar: editAddressAr.trim() || null,
        address_en: editAddressEn.trim() || null,
        governorate_id: editGovernorateId || null,
        is_available: editIsAvailable,
        distributor_type: editDistributorType,
        avatar_url: editAvatarUrl,
      };

      // ✅ تحديث في distributors
      const { error: distError } = await supabase
        .from("distributors")
        .update(patch)
        .eq("id", editingDistributor.id);

      if (distError) throw distError;

      // ✅ إذا تغير الرقم، تحديث في profiles
      if (isEditPhoneChanged && editPhone !== editingDistributor.phone) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({ 
            phone: editPhone.trim(),
            full_name: editFullNameAr.trim(),
          })
          .eq("id", editingDistributor.user_id);

        if (profileError) throw profileError;
      }

      toast.success(
        isArabic 
          ? `✅ تم تحديث معلومات الموزع بنجاح`
          : `✅ Distributor updated successfully`
      );

      setShowEditDistributorDialog(false);
      setEditingDistributor(null);
      setIsEditing(false);
      await refetchDistributors();

    } catch (error: any) {
      console.error("❌ Error updating distributor:", error);
      toast.error(isArabic ? `❌ فشل التحديث: ${error.message}` : `❌ Update failed: ${error.message}`);
      setIsEditing(false);
    }
  };

  // ✅ تعطيل/تفعيل الموزع (بدلاً من الحذف)
  const handleToggleActive = async (distributor: any) => {
    const newStatus = !distributor.is_available;
    const actionText = newStatus ? "تفعيل" : "تعطيل";
    
    if (!confirm(
      isArabic 
        ? `⚠️ هل أنت متأكد من ${actionText} "${distributor.full_name_ar || distributor.full_name_en}"؟`
        : `⚠️ Are you sure you want to ${actionText} "${distributor.full_name_en || distributor.full_name_ar}"?`
    )) return;

    try {
      // ✅ التحقق من وجود طلبات معلقة قبل التعطيل
      if (!newStatus) {
        const { data: pendingOrders, error: ordersError } = await supabase
          .from("delivery_orders")
          .select("id, status")
          .eq("distributor_id", distributor.id)
          .in("status", ["pending", "assigned", "picked_up", "in_transit"]);

        if (ordersError) throw ordersError;

        if (pendingOrders && pendingOrders.length > 0) {
          toast.error(
            isArabic 
              ? `❌ لا يمكن تعطيل الموزع لديه ${pendingOrders.length} طلبات معلقة`
              : `❌ Cannot deactivate distributor with ${pendingOrders.length} pending orders`
          );
          return;
        }
      }

      // ✅ تحديث حالة الموزع
      const { error: updateError } = await supabase
        .from("distributors")
        .update({
          is_available: newStatus,
          is_active: newStatus,
          ...(newStatus ? { 
            deactivated_at: null, 
            deactivated_by: null 
          } : { 
            deactivated_at: new Date().toISOString(), 
            deactivated_by: app.user?.id 
          }),
        })
        .eq("id", distributor.id);

      if (updateError) throw updateError;

      toast.success(
        isArabic 
          ? `✅ تم ${actionText} "${distributor.full_name_ar || distributor.full_name_en}" بنجاح`
          : `✅ "${distributor.full_name_en || distributor.full_name_ar}" ${actionText}ed successfully`
      );

      await refetchDistributors();

    } catch (error: any) {
      console.error("❌ Error toggling distributor:", error);
      toast.error(isArabic ? `❌ فشل ${actionText}: ${error.message}` : `❌ ${actionText} failed: ${error.message}`);
    }
  };

  const resetForm = () => {
    setPhone("");
    setPassword("");
    setFullNameAr("");
    setFullNameEn("");
    setAddressAr("");
    setAddressEn("");
    setGovernorateId("");
    setIsAvailable(true);
    setDistributorType("freelance");
    setAvatarUrl(null);
    setPhoneError(null);
    setPhoneAvailable(null);
    setIsPhoneChanged(false);
  };

  // ✅ إحصائيات
  const stats = {
    total: distributors.length,
    available: distributors.filter((d: any) => d.is_available).length,
    unavailable: distributors.filter((d: any) => !d.is_available).length,
    avgRating: distributors.length > 0 
      ? (distributors.reduce((sum: number, d: any) => sum + Number(d.rating || 0), 0) / distributors.length) 
      : 0,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link to="/" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
                  ← {isArabic ? "الرئيسية" : "Home"}
                </Link>
              </div>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="h-14 w-14 rounded-2xl bg-white/20 backdrop-blur grid place-items-center">
                  <Users className="h-7 w-7" />
                </div>
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold">
                    {isArabic ? "👤 الموزعين" : "👤 Distributors"}
                  </h1>
                  <p className="text-white/80 text-sm mt-1">
                    {isArabic 
                      ? `جميع الموزعين المتاحين للتوصيل (${stats.total} موزع)` 
                      : `All available distributors (${stats.total} distributors)`}
                  </p>
                </div>
              </div>
            </div>
            
            {/* ✅ زر إضافة موزع */}
            <Button 
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm transition-all duration-300 hover:scale-105"
              onClick={() => setShowAddDistributorDialog(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isArabic ? "إضافة موزع" : "Add Distributor"}
            </Button>
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="mx-auto max-w-7xl px-4 -mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard 
            icon={Users} 
            label={isArabic ? "إجمالي الموزعين" : "Total Distributors"} 
            value={stats.total} 
            color="blue" 
          />
          <StatCard 
            icon={UserCheck} 
            label={isArabic ? "متاح" : "Available"} 
            value={stats.available} 
            color="green" 
          />
          <StatCard 
            icon={UserX} 
            label={isArabic ? "غير متاح" : "Unavailable"} 
            value={stats.unavailable} 
            color="red" 
          />
          <StatCard 
            icon={Star} 
            label={isArabic ? "متوسط التقييم" : "Avg Rating"} 
            value={stats.avgRating.toFixed(1)} 
            color="yellow" 
          />
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isArabic ? "🔍 بحث عن موزع..." : "🔍 Search distributor..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9 h-10 rounded-xl border-slate-200/50 dark:border-slate-800/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={governorateFilter}
              onChange={(e) => setGovernorateFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20"
            >
              <option value="all">{isArabic ? "جميع المحافظات" : "All Governorates"}</option>
              {governorates.map((g: any) => (
                <option key={g.id} value={g.id}>
                  {isArabic ? g.name_ar : g.name_en}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20"
            >
              <option value="all">{isArabic ? "الكل" : "All"}</option>
              <option value="available">{isArabic ? "✅ متاح" : "✅ Available"}</option>
              <option value="unavailable">{isArabic ? "❌ غير متاح" : "❌ Unavailable"}</option>
            </select>
          </div>
        </div>
      </div>

      {/* ===== DISTRIBUTORS GRID ===== */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        {loadingDistributors ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border">
                <Skeleton className="h-16 w-16 rounded-full mx-auto" />
                <Skeleton className="h-6 w-3/4 mx-auto mt-3" />
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </div>
            ))}
          </div>
        ) : filteredDistributors.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">
              {isArabic ? "لا يوجد موزعين" : "No distributors found"}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {isArabic 
                ? "لم نجد موزعين مطابقين لمعايير البحث" 
                : "No distributors matching your search criteria"}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10"
                onClick={() => setSearchQuery("")}
              >
                {isArabic ? "مسح البحث" : "Clear search"}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistributors.map((distributor: any) => (
              <DistributorCard 
                key={distributor.id} 
                distributor={distributor}
                onEdit={() => openEditDialog(distributor)}
                onToggleActive={handleToggleActive} // ✅ استخدم onToggleActive بدلاً من onDelete
                isArabic={isArabic}
              />
            ))}
          </div>
        )}
      </div>

      {/* ===== DIALOG: إضافة موزع (مع فلديشن) ===== */}
      <Dialog open={showAddDistributorDialog} onOpenChange={setShowAddDistributorDialog}>
        <DialogContent className="max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
              <UserPlus className="h-6 w-6 text-[#0d2e2a]" />
              {isArabic ? "➕ إضافة موزع جديد" : "➕ Add New Distributor"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "سيتم إنشاء حساب للموزع مع رقم هاتف وكلمة مرور"
                : "A new distributor account will be created with phone and password"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDistributor} className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <ImageInput
                value={avatarUrl || ""}
                onChange={(value) => setAvatarUrl(value)}
                userId={app.user?.id}
                folder="distributors"
                lang={app.lang}
                label={isArabic ? "صورة الموزع" : "Distributor Photo"}
                previewClassName="h-24 w-24 rounded-full object-cover"
                hint={isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>{isArabic ? "الاسم (عربي) *" : "Name (Arabic) *"}</Label>
                <Input
                  value={fullNameAr}
                  onChange={(e) => setFullNameAr(e.target.value)}
                  placeholder={isArabic ? "أحمد محمد" : "Ahmed"}
                  dir="rtl"
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
                <Input
                  value={fullNameEn}
                  onChange={(e) => setFullNameEn(e.target.value)}
                  placeholder="Ahmed Mohamad"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            {/* ✅ رقم الهاتف مع فلديشن */}
            <div className="space-y-1">
              <Label>{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
              <div className="relative">
                <Input
                  value={phone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setPhone(value);
                    setIsPhoneChanged(true);
                    if (value.length >= 5) {
                      checkPhoneAvailability(value);
                    } else {
                      setPhoneError(null);
                      setPhoneAvailable(null);
                    }
                  }}
                  placeholder="0962XXXXXX"
                  dir="ltr"
                  required
                  className={cn(
                    "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20",
                    phoneError && "border-red-500 focus-visible:ring-red-500",
                    phoneAvailable === true && phone.length >= 5 && "border-emerald-400"
                  )}
                />
                {phone.length >= 5 && (
                  <div className="absolute inset-y-0 end-3 flex items-center">
                    {isPhoneChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                    ) : phoneAvailable === true ? (
                      <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                    ) : phoneAvailable === false ? (
                      <X className="h-4 w-4 text-red-400" />
                    ) : null}
                  </div>
                )}
              </div>
              {phoneError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {phoneError}
                </p>
              )}
              {phoneAvailable === true && phone.length >= 5 && !phoneError && (
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <CheckCircleIcon className="h-3 w-3" />
                  {isArabic ? "✓ الرقم متاح" : "✓ Number is available"}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>{isArabic ? "كلمة المرور *" : "Password *"}</Label>
              <div className="relative">
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  required
                  minLength={6}
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 pe-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                {isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
              </p>
            </div>

            <div className="space-y-1">
              <Label>{isArabic ? "المحافظة" : "Governorate"}</Label>
              <Select onValueChange={setGovernorateId}>
                <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>{isArabic ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
                <Input
                  value={addressAr}
                  onChange={(e) => setAddressAr(e.target.value)}
                  placeholder={isArabic ? "دمشق" : "Damascus"}
                  dir="rtl"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? "العنوان (إنجليزي)" : "Address (English)"}</Label>
                <Input
                  value={addressEn}
                  onChange={(e) => setAddressEn(e.target.value)}
                  placeholder="Damascus"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>{isArabic ? "نوع الموزع" : "Distributor Type"}</Label>
                <Select defaultValue="freelance" onValueChange={setDistributorType}>
                  <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freelance">{isArabic ? "🆓 مستقل" : "🆓 Freelance"}</SelectItem>
                    <SelectItem value="company_employee">{isArabic ? "🏢 موظف شركة" : "🏢 Company Employee"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? "متاح للعمل" : "Available"}</Label>
                <Select defaultValue="available" onValueChange={(value) => setIsAvailable(value === "available")}>
                  <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">✅ {isArabic ? "متاح" : "Available"}</SelectItem>
                    <SelectItem value="unavailable">❌ {isArabic ? "غير متاح" : "Unavailable"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
              <Button type="button" variant="outline" onClick={() => {
                setShowAddDistributorDialog(false);
                resetForm();
              }}>
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300"
                disabled={isAdding || (phoneAvailable === false)}
              >
                {isAdding ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <UserPlus className="h-4 w-4 mr-1.5" />
                )}
                {isArabic ? "إضافة الموزع" : "Add Distributor"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: تعديل موزع (مع فلديشن) ===== */}
      <Dialog open={showEditDistributorDialog} onOpenChange={setShowEditDistributorDialog}>
        <DialogContent className="max-w-md rounded-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2">
              <Edit3 className="h-6 w-6 text-[#0d2e2a]" />
              {isArabic ? "✏️ تعديل معلومات الموزع" : "✏️ Edit Distributor Info"}
            </DialogTitle>
            <DialogDescription>
              {isArabic
                ? "تحديث معلومات الموزع"
                : "Update distributor information"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateDistributor} className="space-y-4 py-4">
            <div className="flex flex-col items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <ImageInput
                value={editAvatarUrl || ""}
                onChange={(value) => setEditAvatarUrl(value)}
                userId={app.user?.id}
                folder="distributors"
                lang={app.lang}
                label={isArabic ? "صورة الموزع" : "Distributor Photo"}
                previewClassName="h-24 w-24 rounded-full object-cover"
                hint={isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>{isArabic ? "الاسم (عربي) *" : "Name (Arabic) *"}</Label>
                <Input
                  value={editFullNameAr}
                  onChange={(e) => setEditFullNameAr(e.target.value)}
                  placeholder={isArabic ? "أحمد محمد" : "Ahmed"}
                  dir="rtl"
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
                <Input
                  value={editFullNameEn}
                  onChange={(e) => setEditFullNameEn(e.target.value)}
                  placeholder="Ahmed Mohamad"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            {/* ✅ رقم الهاتف مع فلديشن للتعديل */}
            <div className="space-y-1">
              <Label>{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
              <div className="relative">
                <Input
                  value={editPhone}
                  onChange={(e) => {
                    const value = e.target.value;
                    setEditPhone(value);
                    const oldPhone = editingDistributor?.phone || "";
                    setIsEditPhoneChanged(value !== oldPhone);
                    if (value !== oldPhone && value.length >= 5) {
                      checkEditPhoneAvailability(value);
                    } else {
                      setEditPhoneError(null);
                      setEditPhoneAvailable(null);
                    }
                  }}
                  placeholder="0962XXXXXX"
                  dir="ltr"
                  required
                  className={cn(
                    "rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20",
                    editPhoneError && "border-red-500 focus-visible:ring-red-500",
                    editPhoneAvailable === true && editPhone.length >= 5 && "border-emerald-400"
                  )}
                />
                {editPhone.length >= 5 && isEditPhoneChanged && (
                  <div className="absolute inset-y-0 end-3 flex items-center">
                    {isEditPhoneChecking ? (
                      <Loader2 className="h-4 w-4 animate-spin text-emerald-300" />
                    ) : editPhoneAvailable === true ? (
                      <CheckCircleIcon className="h-4 w-4 text-emerald-400" />
                    ) : editPhoneAvailable === false ? (
                      <X className="h-4 w-4 text-red-400" />
                    ) : null}
                  </div>
                )}
              </div>
              {editPhoneError && isEditPhoneChanged && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {editPhoneError}
                </p>
              )}
              {editPhoneAvailable === true && isEditPhoneChanged && editPhone.length >= 5 && !editPhoneError && (
                <p className="text-xs text-emerald-500 flex items-center gap-1">
                  <CheckCircleIcon className="h-3 w-3" />
                  {isArabic ? "✓ الرقم متاح" : "✓ Number is available"}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label>{isArabic ? "المحافظة" : "Governorate"}</Label>
              <Select value={editGovernorateId || undefined} onValueChange={setEditGovernorateId}>
                <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>{isArabic ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
                <Input
                  value={editAddressAr}
                  onChange={(e) => setEditAddressAr(e.target.value)}
                  placeholder={isArabic ? "دمشق" : "Damascus"}
                  dir="rtl"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? "العنوان (إنجليزي)" : "Address (English)"}</Label>
                <Input
                  value={editAddressEn}
                  onChange={(e) => setEditAddressEn(e.target.value)}
                  placeholder="Damascus"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>{isArabic ? "نوع الموزع" : "Distributor Type"}</Label>
                <Select value={editDistributorType} onValueChange={setEditDistributorType}>
                  <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="freelance">{isArabic ? "🆓 مستقل" : "🆓 Freelance"}</SelectItem>
                    <SelectItem value="company_employee">{isArabic ? "🏢 موظف شركة" : "🏢 Company Employee"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>{isArabic ? "متاح للعمل" : "Available"}</Label>
                <Select value={editIsAvailable ? "available" : "unavailable"} onValueChange={(value) => setEditIsAvailable(value === "available")}>
                  <SelectTrigger className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">✅ {isArabic ? "متاح" : "Available"}</SelectItem>
                    <SelectItem value="unavailable">❌ {isArabic ? "غير متاح" : "Unavailable"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
              <Button type="button" variant="outline" onClick={() => {
                setShowEditDistributorDialog(false);
                setEditingDistributor(null);
              }}>
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white hover:from-[#1a4f4a] hover:to-[#0d2e2a] transition-all duration-300"
                disabled={isEditing || (isEditPhoneChanged && editPhoneAvailable === false)}
              >
                {isEditing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Save className="h-4 w-4 mr-1.5" />
                )}
                {isArabic ? "حفظ التغييرات" : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 📦 StatCard Component
// ============================================================
function StatCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string | number; 
  color: string;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    green: "bg-green-500/10 text-green-500 border-green-500/20",
    red: "bg-red-500/10 text-red-500 border-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center", colors[color])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 DistributorCard Component (مع زر تعطيل/تفعيل فقط)
// ============================================================
function DistributorCard({ 
  distributor, 
  isArabic,
  onEdit,
  onToggleActive
}: { 
  distributor: any; 
  isArabic: boolean;
  onEdit: () => void;
  onToggleActive: (distributor: any) => void;
}) {
  return (
    <div className="group bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30">
      <div className="flex items-start gap-4">
        {/* ✅ الصورة والاسم */}
        <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
          {distributor.avatar_url ? (
            <img 
              src={distributor.avatar_url} 
              alt="" 
              className="h-full w-full object-cover rounded-full" 
            />
          ) : (
            <Users className="h-8 w-8 text-[#2a655f]" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-lg line-clamp-1 group-hover:text-[#2a655f] transition-colors">
              {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
            </h3>
            {distributor.is_available ? (
              <Badge className="bg-emerald-500/10 text-emerald-600 border-0 text-[9px] animate-pulse">
                ● {isArabic ? "متاح" : "Available"}
              </Badge>
            ) : (
              <Badge className="bg-red-500/10 text-red-500 border-0 text-[9px]">
                ● {isArabic ? "غير متاح" : "Unavailable"}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap mt-1">
            <span className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              {Number(distributor.rating || 0).toFixed(1)}
            </span>
            <span className="text-muted-foreground/30">|</span>
            <span className="flex items-center gap-1">
              <Package className="h-3.5 w-3.5" />
              {distributor.completed_orders || 0} {isArabic ? "طلب" : "orders"}
            </span>
            {distributor.governorates && (
              <>
                <span className="text-muted-foreground/30">|</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {isArabic ? distributor.governorates.name_ar : distributor.governorates.name_en}
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {distributor.phone}
            </span>
          </div>
        </div>

        {/* ✅ أزرار: تعديل + تعطيل/تفعيل (بدون حذف) */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* ✅ زر تعديل */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-all duration-300 hover:scale-110 group/btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            title={isArabic ? "تعديل الموزع" : "Edit Distributor"}
          >
            <Edit3 className="h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform duration-300" />
          </Button>
          
          {/* ✅ زر تعطيل/تفعيل (بدلاً من الحذف) */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 w-8 rounded-xl transition-all duration-300 hover:scale-110 group/btn",
              distributor.is_available
                ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300"
                : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            )}
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(distributor);
            }}
            title={
              distributor.is_available
                ? (isArabic ? "تعطيل الموزع" : "Deactivate Distributor")
                : (isArabic ? "تفعيل الموزع" : "Activate Distributor")
            }
          >
            {distributor.is_available ? (
              <PowerOff className="h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform duration-300" />
            ) : (
              <Power className="h-3.5 w-3.5 group-hover/btn:rotate-12 transition-transform duration-300" />
            )}
          </Button>
        </div>
      </div>

      {/* ✅ عرض تاريخ التعطيل إذا كان معطلاً */}
      {!distributor.is_available && distributor.deactivated_at && (
        <div className="mt-3 text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {isArabic 
            ? `تم التعطيل: ${new Date(distributor.deactivated_at).toLocaleDateString()}`
            : `Deactivated: ${new Date(distributor.deactivated_at).toLocaleDateString()}`}
        </div>
      )}

      {distributor.delivery_company_id && (
        <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="h-3.5 w-3.5" />
            <span>
              {isArabic ? "تابع لشركة:" : "Belongs to:"}
            </span>
            <span className="font-medium text-[#2a655f]">
              {distributor.delivery_company?.name_ar || distributor.delivery_company?.name_en || 
               (isArabic ? "شركة توصيل" : "Delivery Company")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}