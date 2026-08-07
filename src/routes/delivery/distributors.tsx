// src/routes/delivery/distributors.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useApp, useT } from "@/lib/i18n";
import { 
  useDistributors, 
  useDeliveryCompanies, 
  useCreateDistributor, 
  useUpdateDistributor,
  useDeleteDistributor,
  useGovernorates,
  useMyDeliveryCompany 
} from "@/lib/queries";
import {
  Users, Plus, Search, Filter, X, 
  Phone, Mail, MapPin, Star, 
  UserPlus, Camera, Loader2, User,
  CheckCircle, XCircle, MoreVertical,
  Eye, Edit, Trash2, ArrowLeft,
  Truck, RefreshCw, AlertCircle,
  UserCheck, EyeOff, Lock, Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo, useRef } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageInput } from "@/components/ImageInput";

export const Route = createFileRoute("/delivery/distributors")({
  component: DistributorsManagementPage,
  head: () => ({
    meta: [
      { title: "إدارة الموزعين - Souqi" },
      { name: "description", content: "إدارة الموزعين التابعين لشركتك" },
    ],
  }),
});

function DistributorsManagementPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedDistributor, setSelectedDistributor] = useState<any>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // ✅ State للـ Dialog (تحويل المستخدم إلى موزع)
  const [showConvertDialog, setShowConvertDialog] = useState(false);
  const [existingUserData, setExistingUserData] = useState<any>(null);
  const [pendingFormData, setPendingFormData] = useState<any>(null);

  // ✅ جلب شركات التوصيل النشطة
  const { data: myCompany, isLoading: companyLoading } = useMyDeliveryCompany(app.user?.id);
  const companyId = myCompany?.id || "";

  // ✅ جلب الموزعين
  const { data: distributors = [], isLoading, refetch } = useDistributors({
    companyId: companyId || undefined,
  });

  // ✅ جلب باقي البيانات
  const { data: governorates = [] } = useGovernorates();
  const createDistributor = useCreateDistributor();
  const updateDistributor = useUpdateDistributor();
  const deleteDistributor = useDeleteDistributor();

  const isArabic = app.lang === "ar";

  // ✅ دالة تحويل المستخدم إلى موزع (معرفة هنا في النطاق الرئيسي)
// ✅ دالة تحويل المستخدم إلى موزع - باستخدام RPC أو Edge Function
const handleConvertUser = async () => {
  if (!existingUserData || !pendingFormData) return;

  const userId = existingUserData.id;
  const { full_name_ar, full_name_en, phone, address_ar, address_en, governorate_id, is_available, distributor_type, avatar_url } = pendingFormData;

  try {
    // ✅ تحديث الاسم
    if (full_name_ar && full_name_ar !== existingUserData.full_name) {
      await supabase
        .from("profiles")
        .update({ full_name: full_name_ar })
        .eq("id", userId);
    }

    // ✅ إضافة دور الموزع
    await supabase.from("user_roles").insert({
      user_id: userId,
      role: "distributor"
    });

    // ✅ إضافة الموزع - باستخدام RPC
    const { data: distributorId, error: distributorError } = await supabase.rpc('add_distributor', {
      p_user_id: userId,
      p_full_name_ar: full_name_ar || existingUserData.full_name || `موزع ${phone}`,
      p_full_name_en: full_name_en || `Distributor ${phone}`,
      p_phone: phone,
      p_email: `${phone}@distributor.sy`,
      p_address_ar: address_ar || null,
      p_address_en: address_en || null,
      p_governorate_id: governorate_id || null,
      p_is_available: is_available,
      p_distributor_type: distributor_type || 'freelance',
      p_avatar_url: avatar_url || existingUserData.avatar_url || null,
      p_delivery_company_id: companyId || null,
    });

    if (distributorError) {
      console.error("❌ RPC error:", distributorError);
      throw distributorError;
    }

    toast.success(
      isArabic 
        ? `✅ تم تحويل "${existingUserData.full_name}" إلى موزع بنجاح!` 
        : `✅ Successfully converted "${existingUserData.full_name}" to distributor!`
    );
    
    setShowConvertDialog(false);
    setExistingUserData(null);
    setPendingFormData(null);
    refetch();
    
  } catch (error) {
    console.error("Error converting user:", error);
    toast.error(isArabic ? "❌ فشل تحويل المستخدم" : "❌ Failed to convert user");
  }
};
  // ✅ فلترة الموزعين
  const filteredDistributors = useMemo(() => {
    let result = distributors;

    if (companyId) {
      result = result.filter((d: any) => d.delivery_company_id === companyId);
    }

    if (statusFilter !== "all") {
      result = result.filter((d: any) => 
        statusFilter === "active" ? d.is_active : !d.is_active
      );
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
  }, [distributors, searchQuery, statusFilter, availabilityFilter, companyId]);

  // ✅ إحصائيات
  const stats = useMemo(() => {
    const total = distributors.length;
    const active = distributors.filter((d: any) => d.is_active).length;
    const available = distributors.filter((d: any) => d.is_available).length;
    const avgRating = distributors.length > 0 
      ? distributors.reduce((sum: number, d: any) => sum + Number(d.rating || 0), 0) / distributors.length 
      : 0;
    const totalOrders = distributors.reduce((sum: number, d: any) => sum + (d.completed_orders || 0), 0);

    return { total, active, available, avgRating, totalOrders };
  }, [distributors]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* ===== HEADER ===== */}
      <div className="relative bg-gradient-to-r from-[#2a655f] via-[#3a8a82] to-[#1a4f4a] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-4 py-6 md:py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Link to="/delivery/dashboard" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1">
                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                {isArabic ? "العودة للوحة" : "Back to Dashboard"}
              </Link>
              <span className="text-white/30">|</span>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white/20 backdrop-blur grid place-items-center">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">
                    {isArabic ? "👤 إدارة الموزعين" : "👤 Distributors Management"}
                  </h1>
                  <p className="text-white/80 text-xs">
                    {isArabic ? `إدارة ${distributors.length} موزع` : `Managing ${distributors.length} distributors`}
                  </p>
                </div>
              </div>
            </div>
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-[#2a655f] hover:bg-white/90">
                  <UserPlus className="h-4 w-4 mr-1" />
                  {isArabic ? "إضافة موزع" : "Add Distributor"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5 text-[#2a655f]" />
                    {isArabic ? "إضافة موزع جديد" : "Add New Distributor"}
                  </DialogTitle>
                </DialogHeader>
                <AddDistributorForm 
                  companyId={companyId} 
                  onSuccess={() => {
                    refetch();
                    setIsAddModalOpen(false);
                  }}
                  onConvertUser={handleConvertUser}
                  showConvertDialog={showConvertDialog}
                  setShowConvertDialog={setShowConvertDialog}
                  existingUserData={existingUserData}
                  setExistingUserData={setExistingUserData}
                  pendingFormData={pendingFormData}
                  setPendingFormData={setPendingFormData}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* ===== STATS ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard icon={Users} label={isArabic ? "الإجمالي" : "Total"} value={stats.total} color="blue" />
          <StatCard icon={CheckCircle} label={isArabic ? "نشط" : "Active"} value={stats.active} color="green" />
          <StatCard icon={UserCheck} label={isArabic ? "متاح" : "Available"} value={stats.available} color="emerald" />
          <StatCard icon={Star} label={isArabic ? "متوسط التقييم" : "Avg Rating"} value={stats.avgRating.toFixed(1)} color="yellow" />
          <StatCard icon={Truck} label={isArabic ? "إجمالي الطلبات" : "Total Orders"} value={stats.totalOrders} color="purple" />
        </div>
      </div>

      {/* ===== FILTERS ===== */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={isArabic ? "🔍 بحث عن موزع..." : "🔍 Search distributor..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-10 rounded-xl"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20"
            >
              <option value="all">{isArabic ? "جميع الحالات" : "All status"}</option>
              <option value="active">{isArabic ? "✅ نشط" : "✅ Active"}</option>
              <option value="inactive">{isArabic ? "❌ غير نشط" : "❌ Inactive"}</option>
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#2a655f]/20"
            >
              <option value="all">{isArabic ? "التوفر" : "Availability"}</option>
              <option value="available">{isArabic ? "✅ متاح" : "✅ Available"}</option>
              <option value="unavailable">{isArabic ? "❌ غير متاح" : "❌ Unavailable"}</option>
            </select>

            {(searchQuery || statusFilter !== "all" || availabilityFilter !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery("");
                  setStatusFilter("all");
                  setAvailabilityFilter("all");
                }}
              >
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "مسح" : "Clear"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : filteredDistributors.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-2xl font-semibold">
              {isArabic ? "لا يوجد موزعين" : "No distributors found"}
            </h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery 
                ? (isArabic ? `لا توجد نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"`)
                : (isArabic ? "قم بإضافة موزعين لشركتك" : "Add distributors to your company")}
            </p>
            {!searchQuery && (
              <Button 
                className="mt-4 bg-[#2a655f] hover:bg-[#3a8a82] text-white"
                onClick={() => setIsAddModalOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-1" />
                {isArabic ? "إضافة موزع" : "Add Distributor"}
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-2xl border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 dark:bg-slate-800/50">
                  <TableHead>{isArabic ? "الموزع" : "Distributor"}</TableHead>
                  <TableHead>{isArabic ? "رقم الهاتف" : "Phone"}</TableHead>
                  <TableHead>{isArabic ? "المحافظة" : "Governorate"}</TableHead>
                  <TableHead>{isArabic ? "التقييم" : "Rating"}</TableHead>
                  <TableHead>{isArabic ? "الطلبات" : "Orders"}</TableHead>
                  <TableHead>{isArabic ? "الحالة" : "Status"}</TableHead>
                  <TableHead className="text-center">{isArabic ? "إجراءات" : "Actions"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDistributors.map((distributor: any) => (
                  <DistributorRow 
                    key={distributor.id} 
                    distributor={distributor}
                    onEdit={() => {
                      setSelectedDistributor(distributor);
                      setIsEditModalOpen(true);
                    }}
                    onDelete={() => {
                      setSelectedDistributor(distributor);
                      setIsDeleteDialogOpen(true);
                    }}
                    onToggleStatus={() => {
                      updateDistributor.mutate({
                        id: distributor.id,
                        patch: { is_active: !distributor.is_active }
                      });
                      toast.success(
                        isArabic 
                          ? `✅ تم ${distributor.is_active ? 'تعطيل' : 'تفعيل'} الموزع بنجاح` 
                          : `✅ Distributor ${distributor.is_active ? 'deactivated' : 'activated'} successfully`
                      );
                      refetch();
                    }}
                    onToggleAvailability={() => {
                      updateDistributor.mutate({
                        id: distributor.id,
                        patch: { is_available: !distributor.is_available }
                      });
                      toast.success(
                        isArabic 
                          ? `✅ تم ${distributor.is_available ? 'إيقاف' : 'تفعيل'} توفر الموزع بنجاح` 
                          : `✅ Distributor availability ${distributor.is_available ? 'disabled' : 'enabled'} successfully`
                      );
                      refetch();
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* ===== EDIT MODAL ===== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-[#2a655f]" />
              {isArabic ? "تعديل بيانات الموزع" : "Edit Distributor"}
            </DialogTitle>
          </DialogHeader>
          {selectedDistributor && (
            <EditDistributorForm 
              distributor={selectedDistributor}
              onSuccess={() => {
                refetch();
                setIsEditModalOpen(false);
                setSelectedDistributor(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ===== DELETE CONFIRMATION ===== */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-5 w-5" />
              {isArabic ? "⚠️ تأكيد الحذف" : "⚠️ Confirm Delete"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              {isArabic 
                ? `هل أنت متأكد من حذف الموزع "${selectedDistributor?.full_name_ar}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `Are you sure you want to delete "${selectedDistributor?.full_name_ar}"? This action cannot be undone.`}
            </p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setIsDeleteDialogOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1"
                onClick={async () => {
                  if (!selectedDistributor) return;
                  try {
                    await deleteDistributor.mutateAsync(selectedDistributor.id);
                    toast.success(isArabic ? "✅ تم حذف الموزع بنجاح" : "✅ Distributor deleted successfully");
                    refetch();
                    setIsDeleteDialogOpen(false);
                    setSelectedDistributor(null);
                  } catch (error) {
                    toast.error(isArabic ? "❌ حدث خطأ" : "❌ Error occurred");
                  }
                }}
              >
                {isArabic ? "حذف" : "Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ============================================================
// 📦 StatCard Component
// ============================================================
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const colors: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-500",
    green: "bg-green-500/10 text-green-500",
    emerald: "bg-emerald-500/10 text-emerald-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
    purple: "bg-purple-500/10 text-purple-500",
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border">
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
// 📦 DistributorRow Component
// ============================================================
function DistributorRow({ distributor, onEdit, onDelete, onToggleStatus, onToggleAvailability }: { 
  distributor: any; 
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onToggleAvailability: () => void;
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";

  return (
    <TableRow className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={distributor.avatar_url || ""} />
            <AvatarFallback className="bg-[#2a655f]/10 text-[#2a655f]">
              {distributor.full_name_ar?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">
              {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
            </p>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-sm" dir="ltr">{distributor.phone}</TableCell>
      <TableCell className="text-sm">
        {distributor.governorates 
          ? (isArabic ? distributor.governorates.name_ar : distributor.governorates.name_en)
          : '-'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{Number(distributor.rating || 0).toFixed(1)}</span>
        </div>
      </TableCell>
      <TableCell className="text-sm">{distributor.completed_orders || 0}</TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <Badge className={distributor.is_active ? "bg-emerald-500/10 text-emerald-600 border-0" : "bg-red-500/10 text-red-500 border-0"}>
            {distributor.is_active ? (isArabic ? "✅ نشط" : "✅ Active") : (isArabic ? "❌ غير نشط" : "❌ Inactive")}
          </Badge>
          <Badge className={distributor.is_available ? "bg-blue-500/10 text-blue-600 border-0" : "bg-slate-500/10 text-slate-500 border-0"}>
            {distributor.is_available ? (isArabic ? "● متاح" : "● Available") : (isArabic ? "○ غير متاح" : "○ Unavailable")}
          </Badge>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg hover:bg-[#2a655f]/10" onClick={onEdit}>
            <Edit className="h-4 w-4 text-[#2a655f]" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onToggleStatus}>
                {distributor.is_active ? (isArabic ? "تعطيل" : "Deactivate") : (isArabic ? "تفعيل" : "Activate")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleAvailability}>
                {distributor.is_available ? (isArabic ? "إيقاف التوفر" : "Disable availability") : (isArabic ? "تفعيل التوفر" : "Enable availability")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-500" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                {isArabic ? "حذف" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ============================================================
// 📦 AddDistributorForm Component (مع إنشاء حساب و Dialog)
// ============================================================
function AddDistributorForm({ 
  companyId, 
  onSuccess,
  onConvertUser,
  showConvertDialog,
  setShowConvertDialog,
  existingUserData,
  setExistingUserData,
  pendingFormData,
  setPendingFormData,
}: { 
  companyId: string; 
  onSuccess: () => void;
  onConvertUser: () => Promise<void>;
  showConvertDialog: boolean;
  setShowConvertDialog: (value: boolean) => void;
  existingUserData: any;
  setExistingUserData: (value: any) => void;
  pendingFormData: any;
  setPendingFormData: (value: any) => void;
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const { data: governorates = [] } = useGovernorates();
  const createDistributor = useCreateDistributor();
  
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    full_name_ar: "",
    full_name_en: "",
    phone: "",
    password: "",
    address_ar: "",
    address_en: "",
    governorate_id: "",
    is_available: true,
    distributor_type: "freelance" as "freelance" | "company_employee",
  });

  // ✅ دالة إنشاء موزع جديد
// ✅ دالة إنشاء موزع جديد - باستخدام Edge Function (نفس طريقة dashboard)
const createNewDistributor = async (data: any) => {
  const { full_name_ar, full_name_en, phone, password, address_ar, address_en, governorate_id, is_available, distributor_type, avatar_url } = data;

  console.log("📝 [createNewDistributor] Starting...");

  try {
    // ✅ استدعاء Edge Function (نفس طريقة إضافة الأدمن)
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-distributor`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          phone,
          password,
          full_name_ar,
          full_name_en,
          address_ar,
          address_en,
          governorate_id,
          company_id: companyId || null,
        }),
      }
    );

    const result = await response.json();

    if (!response.ok || result.error) {
      throw new Error(result.error || 'Failed to create distributor');
    }

    toast.success(
      isArabic 
        ? `✅ تم إضافة الموزع بنجاح!\n📱 الرقم: ${phone}\n🔑 كلمة المرور: ${password}\n👤 الاسم: ${full_name_ar || full_name_en}`
        : `✅ Distributor added successfully!\n📱 Phone: ${phone}\n🔑 Password: ${password}\n👤 Name: ${full_name_en || full_name_ar}`
    );
    
    setShowConvertDialog(false);
    setExistingUserData(null);
    setPendingFormData(null);
    onSuccess();
    
  } catch (error: any) {
    console.error("❌ Error creating distributor:", error);
    toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
  }
};

  // ✅ دالة handleSubmit
// ✅ دالة handleSubmit - تستخدم Edge Function فقط
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!formData.full_name_ar.trim()) {
    toast.error(isArabic ? "الاسم (عربي) مطلوب" : "Name (Arabic) is required");
    return;
  }
  
  if (!formData.phone.trim() || formData.phone.length < 9) {
    toast.error(isArabic ? "رقم هاتف صحيح مطلوب" : "Valid phone number is required");
    return;
  }

  setLoading(true);
  try {
    // ✅ 1. التحقق من وجود المستخدم (اختياري، لأن Edge Function بتتحقق)
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id, full_name, phone, avatar_url")
      .eq("phone", formData.phone)
      .maybeSingle();

    if (existingProfile) {
      // ✅ التحقق إذا كان بالفعل موزع
      const { data: existingDistributor } = await supabase
        .from("distributors")
        .select("id")
        .eq("user_id", existingProfile.id)
        .maybeSingle();
      
      if (existingDistributor) {
        toast.error(
          isArabic 
            ? `❌ المستخدم "${existingProfile.full_name}" بالفعل موزع` 
            : `❌ User "${existingProfile.full_name}" is already a distributor`
        );
        setLoading(false);
        return;
      }

      // ✅ فتح Dialog
      setExistingUserData(existingProfile);
      setPendingFormData(formData);
      setShowConvertDialog(true);
      setLoading(false);
      return;
    }

    // ✅ المستخدم غير موجود، استخدم Edge Function
    if (!formData.password || formData.password.length < 6) {
      toast.error(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
      setLoading(false);
      return;
    }

    // ✅ استدعاء Edge Function (بدون supabase.auth.signUp)
    await createNewDistributor(formData);

  } catch (error: any) {
    console.error("Error adding distributor:", error);
    toast.error(isArabic ? "❌ حدث خطأ: " + (error.message || "") : "❌ Error: " + (error.message || ""));
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        {/* ✅ صورة الموزع */}
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

        {/* ✅ الاسم */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>{isArabic ? "الاسم (عربي) *" : "Name (Arabic) *"}</Label>
            <Input
              value={formData.full_name_ar}
              onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
              placeholder={isArabic ? "أحمد محمد" : "Ahmed"}
              dir="rtl"
              required
            />
          </div>
          <div className="space-y-1">
            <Label>{isArabic ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
            <Input
              value={formData.full_name_en}
              onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
              placeholder="Ahmed Mohamad"
            />
          </div>
        </div>

        {/* ✅ رقم الهاتف */}
        <div className="space-y-1">
          <Label>{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0962XXXXXX"
            dir="ltr"
            required
          />
          <p className="text-xs text-muted-foreground">
            {isArabic ? "سيستخدم هذا الرقم لتسجيل الدخول" : "This number will be used for login"}
          </p>
        </div>

        {/* ✅ كلمة المرور */}
        <div className="space-y-1">
          <Label>{isArabic ? "كلمة المرور *" : "Password *"}</Label>
          <div className="relative">
            <Input
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              required
              minLength={6}
              className="pe-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
          </p>
        </div>

        {/* ✅ المحافظة */}
        <div className="space-y-1">
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

        {/* ✅ العنوان */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>{isArabic ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
            <Input
              value={formData.address_ar}
              onChange={(e) => setFormData({ ...formData, address_ar: e.target.value })}
              placeholder={isArabic ? "دمشق" : "Damascus"}
              dir="rtl"
            />
          </div>
          <div className="space-y-1">
            <Label>{isArabic ? "العنوان (إنجليزي)" : "Address (English)"}</Label>
            <Input
              value={formData.address_en}
              onChange={(e) => setFormData({ ...formData, address_en: e.target.value })}
              placeholder="Damascus"
            />
          </div>
        </div>

        {/* ✅ النوع والحالة */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>{isArabic ? "نوع الموزع" : "Distributor Type"}</Label>
            <Select
              value={formData.distributor_type}
              onValueChange={(value: any) => setFormData({ ...formData, distributor_type: value })}
            >
              <SelectTrigger>
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
            <Select
              value={formData.is_available ? "available" : "unavailable"}
              onValueChange={(value) => setFormData({ ...formData, is_available: value === "available" })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">✅ {isArabic ? "متاح" : "Available"}</SelectItem>
                <SelectItem value="unavailable">❌ {isArabic ? "غير متاح" : "Unavailable"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ✅ أزرار الإرسال */}
        <div className="flex gap-3 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onSuccess} className="flex-1">
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-[#2a655f] hover:bg-[#3a8a82] text-white">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isArabic ? "جاري..." : "Loading..."}
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4 mr-2" />
                {isArabic ? "إضافة موزع" : "Add Distributor"}
              </>
            )}
          </Button>
        </div>
      </form>

      {/* ===== ✅ Dialog تحويل المستخدم إلى موزع ===== */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">
                  {isArabic ? "🔄 تحويل المستخدم إلى موزع" : "🔄 Convert User to Distributor"}
                </DialogTitle>
                <p className="text-white/80 text-sm mt-0.5">
                  {isArabic 
                    ? "هذا الرقم مرتبط بحساب موجود" 
                    : "This number is linked to an existing account"}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4">
            {/* معلومات المستخدم */}
            <div className="flex items-center gap-3 p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
              <div className="h-14 w-14 rounded-full bg-[#2a655f]/10 flex items-center justify-center overflow-hidden">
                {existingUserData?.avatar_url ? (
                  <img src={existingUserData.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-[#2a655f]">
                    {existingUserData?.full_name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#2a655f] dark:text-white">
                  {existingUserData?.full_name || (isArabic ? "مستخدم" : "User")}
                </p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  📱 {existingUserData?.phone}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "🆔 مستخدم مسجل في النظام" : "🆔 Registered user"}
                </p>
              </div>
              <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">
                {isArabic ? "عميل" : "Customer"}
              </Badge>
            </div>

            {/* تحذير */}
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  {isArabic ? "⚠️ تحويل الدور" : "⚠️ Role Change"}
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                  {isArabic 
                    ? `سيتم إضافة صلاحية "موزع" للمستخدم "${existingUserData?.full_name}"`
                    : `The "distributor" role will be added to "${existingUserData?.full_name}"`}
                </p>
              </div>
            </div>

            {/* معلومات الموزع الجديدة */}
            <div className="p-4 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {isArabic ? "📋 بيانات الموزع الجديدة" : "📋 New Distributor Data"}
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isArabic ? "الاسم" : "Name"}</span>
                  <span className="font-medium">{pendingFormData?.full_name_ar || pendingFormData?.full_name_en || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isArabic ? "الهاتف" : "Phone"}</span>
                  <span className="font-medium" dir="ltr">{pendingFormData?.phone}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {isArabic 
                ? "📌 سيتم إضافة الموزع إلى شركتك الحالية" 
                : "📌 The distributor will be added to your current company"}
            </p>
          </div>

          {/* Footer */}
          <DialogFooter className="p-4 border-t border-[#2a655f]/10 bg-slate-50/50 dark:bg-slate-900/50 gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowConvertDialog(false);
                setExistingUserData(null);
                setPendingFormData(null);
                toast.info(
                  isArabic 
                    ? "📱 يمكنك استخدام رقم آخر لإضافة موزع جديد" 
                    : "📱 You can use another number to add a new distributor"
                );
              }}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-1.5" />
              {isArabic ? "استخدام رقم آخر" : "Use Another Number"}
            </Button>
            <Button
              onClick={onConvertUser}
              className="flex-1 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white hover:from-[#3a8a82] hover:to-[#2a655f]"
            >
              <UserPlus className="h-4 w-4 mr-1.5" />
              {isArabic ? "تحويل إلى موزع" : "Convert to Distributor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================================
// 📦 EditDistributorForm Component
// ============================================================
function EditDistributorForm({ distributor, onSuccess }: { distributor: any; onSuccess: () => void }) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const { data: governorates = [] } = useGovernorates();
  const updateDistributor = useUpdateDistributor();
  
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(distributor.avatar_url || null);
  const [formData, setFormData] = useState({
    full_name_ar: distributor.full_name_ar || "",
    full_name_en: distributor.full_name_en || "",
    phone: distributor.phone || "",
    address_ar: distributor.address_ar || "",
    address_en: distributor.address_en || "",
    governorate_id: distributor.governorate_id || "",
    is_available: distributor.is_available ?? true,
    distributor_type: distributor.distributor_type || "freelance",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.full_name_ar.trim() || !formData.phone.trim()) {
      toast.error(isArabic ? "الاسم ورقم الهاتف مطلوبان" : "Name and phone are required");
      return;
    }

    setLoading(true);
    try {
      await updateDistributor.mutateAsync({
        id: distributor.id,
        patch: {
          full_name_ar: formData.full_name_ar.trim(),
          full_name_en: formData.full_name_en?.trim() || null,
          phone: formData.phone.trim(),
          address_ar: formData.address_ar?.trim() || null,
          address_en: formData.address_en?.trim() || null,
          governorate_id: formData.governorate_id || null,
          is_available: formData.is_available,
          distributor_type: formData.distributor_type || 'freelance',
          avatar_url: avatarUrl,
        },
      });
      
      toast.success(isArabic ? "✅ تم تحديث الموزع بنجاح" : "✅ Distributor updated successfully");
      onSuccess();
    } catch (error: any) {
      console.error("Error updating distributor:", error);
      toast.error(isArabic ? "❌ حدث خطأ: " + (error.message || "") : "❌ Error: " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
            value={formData.full_name_ar}
            onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
            dir="rtl"
          />
        </div>
        <div className="space-y-1">
          <Label>{isArabic ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
          <Input
            value={formData.full_name_en}
            onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            dir="ltr"
          />
        </div>
        <div className="space-y-1">
          <Label>{isArabic ? "المحافظة" : "Governorate"}</Label>
          <Select
            value={formData.governorate_id}
            onValueChange={(value) => setFormData({ ...formData, governorate_id: value })}
          >
            <SelectTrigger>
              <SelectValue />
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label>{isArabic ? "نوع الموزع" : "Distributor Type"}</Label>
          <Select
            value={formData.distributor_type}
            onValueChange={(value: any) => setFormData({ ...formData, distributor_type: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freelance">{isArabic ? "🆓 مستقل" : "🆓 Freelance"}</SelectItem>
              <SelectItem value="company_employee">{isArabic ? "🏢 موظف شركة" : "🏢 Company Employee"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>{isArabic ? "الحالة" : "Status"}</Label>
          <Select
            value={formData.is_available ? "available" : "unavailable"}
            onValueChange={(value) => setFormData({ ...formData, is_available: value === "available" })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">✅ {isArabic ? "متاح" : "Available"}</SelectItem>
              <SelectItem value="unavailable">❌ {isArabic ? "غير متاح" : "Unavailable"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onSuccess} className="flex-1">
          {isArabic ? "إلغاء" : "Cancel"}
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-[#2a655f] hover:bg-[#3a8a82] text-white">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isArabic ? "جاري..." : "Loading..."}
            </>
          ) : (
            <>
              <Edit className="h-4 w-4 mr-2" />
              {isArabic ? "حفظ التغييرات" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}