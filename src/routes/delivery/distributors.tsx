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
  UserCheck, EyeOff, Lock, Unlock,
  Package, Clock, CheckCircle2,
  UserRoundPlus,
  UserPen,
  UserX as UserXIcon,
  UsersRound,
  BadgeCheck,
  Crown,
  ShieldCheck,
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState, useMemo, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { ImageInput } from "@/components/ImageInput";

// ============================================================
// 🎨 ZOOQ BRAND COLORS - زيتي ووردي
// ============================================================
const COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  oliveVeryLight: '#e8f0ee',
  pink: '#f9a8d4',
  pinkLight: '#fbcfe8',
  pinkDark: '#f48fb1',
  pinkVeryLight: '#fdf2f8',
  fuchsia: '#d81b60',
  fuchsiaDark: '#c2185b',
};

export const Route = createFileRoute("/delivery/distributors")({
  component: DistributorsManagementPage,
  head: () => ({
    meta: [
      { title: "إدارة الموزعين - ذوق" },
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

  // ✅ جلب إحصائيات الطلبات لكل موزع
  const [distributorStats, setDistributorStats] = useState<Record<string, any>>({});
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!distributors.length) return;
      
      const statsMap: Record<string, any> = {};
      
      for (const dist of distributors) {
        const { data: orders, error } = await supabase
          .from("delivery_orders")
          .select("status, order_id")
          .eq("distributor_id", dist.id);
        
        if (!error && orders) {
          statsMap[dist.id] = {
            total: orders.length,
            pending: orders.filter((o: any) => o.status === 'pending' || o.status === 'assigned').length,
            in_transit: orders.filter((o: any) => o.status === 'in_transit' || o.status === 'picked_up').length,
            delivered: orders.filter((o: any) => o.status === 'delivered').length,
            cancelled: orders.filter((o: any) => o.status === 'cancelled' || o.status === 'failed').length,
          };
        } else {
          statsMap[dist.id] = { total: 0, pending: 0, in_transit: 0, delivered: 0, cancelled: 0 };
        }
      }
      
      setDistributorStats(statsMap);
    };
    
    fetchStats();
  }, [distributors]);

  // ✅ دالة تحويل المستخدم إلى موزع
  const handleConvertUser = async () => {
    if (!existingUserData || !pendingFormData) return;

    const userId = existingUserData.id;
    const { full_name_ar, full_name_en, phone, address_ar, address_en, governorate_id, is_available, distributor_type, avatar_url, rating } = pendingFormData;

    try {
      if (full_name_ar && full_name_ar !== existingUserData.full_name) {
        await supabase
          .from("profiles")
          .update({ full_name: full_name_ar })
          .eq("id", userId);
      }

      await supabase.from("user_roles").insert({
        user_id: userId,
        role: "distributor"
      });

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
        p_rating: rating || 0,
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
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0ee]/40 via-white to-[#fdf2f8] dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#1a4f4a]/10">
      
      {/* ===== HEADER - زيتي مع لمسات وردية ===== */}
      <div className="relative bg-gradient-to-r from-[#0d2e2a]/95 via-[#1a4f4a]/90 to-[#2a655f]/85 backdrop-blur-md text-white overflow-hidden shadow-2xl shadow-[#0d2e2a]/20 border-b border-white/10 sticky top-0 z-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-6 md:py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <Link to="/delivery/dashboard" className="text-white/70 hover:text-white transition text-sm flex items-center gap-1 group">
                <ArrowLeft className="h-4 w-4 rtl:rotate-180 group-hover:-translate-x-1 transition-transform" />
                {isArabic ? "العودة للوحة" : "Back to Dashboard"}
              </Link>
              <span className="text-white/30">|</span>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#f9a8d4] to-[#f48fb1] grid place-items-center shadow-lg shadow-[#f9a8d4]/30">
                  <UsersRound className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold">
                    <span className="bg-gradient-to-r from-[#f9a8d4] via-[#fbcfe8] to-[#f9a8d4] bg-clip-text text-transparent">
                      {isArabic ? "إدارة الموزعين" : "Distributors Management"}
                    </span>
                  </h1>
                  <p className="text-white/80 text-xs flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-[#f9a8d4]" />
                    {isArabic ? `إدارة ${distributors.length} موزع` : `Managing ${distributors.length} distributors`}
                  </p>
                </div>
              </div>
            </div>
            
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] transition-all duration-300 hover:scale-105 shadow-lg shadow-[#d81b60]/30 rounded-xl">
                  <UserRoundPlus className="h-4 w-4 mr-1.5" />
                  {isArabic ? "إضافة موزع" : "Add Distributor"}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#f9a8d4]/30 shadow-2xl rounded-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-[#d81b60] dark:text-[#f9a8d4]">
                    <UserRoundPlus className="h-5 w-5 text-[#d81b60]" />
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

      {/* ===== STATS - وردية ===== */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <StatCard icon={UsersRound} label={isArabic ? "الإجمالي" : "Total"} value={stats.total} color="pink" />
          <StatCard icon={CheckCircle} label={isArabic ? "نشط" : "Active"} value={stats.active} color="pink" />
          <StatCard icon={UserCheck} label={isArabic ? "متاح" : "Available"} value={stats.available} color="pink" />
          <StatCard icon={Star} label={isArabic ? "متوسط التقييم" : "Avg Rating"} value={stats.avgRating.toFixed(1)} color="pink" />
          <StatCard icon={Truck} label={isArabic ? "إجمالي الطلبات" : "Total Orders"} value={stats.totalOrders} color="olive" />
        </div>
      </div>

      {/* ===== FILTERS - وردية ===== */}
      <div className="mx-auto max-w-7xl px-4 py-4">
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-4 shadow-sm border-2 border-[#f9a8d4]/30 hover:border-[#f9a8d4]/60 transition-all duration-300">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] group">
              <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground group-focus-within:text-[#d81b60] transition-colors duration-300" />
              <Input
                placeholder={isArabic ? "🔍 بحث عن موزع..." : "🔍 Search distributor..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ps-9 h-10 rounded-xl border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 transition-all duration-300"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-[#f9a8d4]/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d81b60]/20 transition-all duration-300 hover:border-[#d81b60]/50"
            >
              <option value="all">{isArabic ? "جميع الحالات" : "All status"}</option>
              <option value="active">{isArabic ? "✅ نشط" : "✅ Active"}</option>
              <option value="inactive">{isArabic ? "❌ غير نشط" : "❌ Inactive"}</option>
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="h-10 px-3 rounded-xl border border-[#f9a8d4]/30 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-[#d81b60]/20 transition-all duration-300 hover:border-[#d81b60]/50"
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
                className="text-[#d81b60] hover:bg-[#fbcfe8]/30 rounded-xl"
              >
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "مسح" : "Clear"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ===== TABLE - وردية ===== */}
      <div className="mx-auto max-w-7xl px-4 pb-12">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-2xl" />
            ))}
          </div>
        ) : filteredDistributors.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#f9a8d4]/40">
            <UsersRound className="h-16 w-16 text-[#d81b60]/40 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-[#d81b60] dark:text-[#f9a8d4]">
              {isArabic ? "لا يوجد موزعين" : "No distributors found"}
            </h3>
            <p className="text-muted-foreground mt-2">
              {searchQuery 
                ? (isArabic ? `لا توجد نتائج تطابق "${searchQuery}"` : `No results match "${searchQuery}"`)
                : (isArabic ? "قم بإضافة موزعين لشركتك" : "Add distributors to your company")}
            </p>
            {!searchQuery && (
              <Button 
                className="mt-4 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] shadow-lg shadow-[#d81b60]/30 rounded-xl"
                onClick={() => setIsAddModalOpen(true)}
              >
                <UserRoundPlus className="h-4 w-4 mr-1.5" />
                {isArabic ? "إضافة موزع" : "Add Distributor"}
              </Button>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#f9a8d4]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-[#f9a8d4]/30 via-[#fbcfe8]/20 to-[#f9a8d4]/30 dark:from-[#f9a8d4]/20 dark:via-[#fbcfe8]/10 dark:to-[#f9a8d4]/20 border-b-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30">
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-right min-w-[180px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "الموزع" : "Distributor"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "رقم الهاتف" : "Phone"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "المحافظة" : "Governorate"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[100px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "التقييم" : "Rating"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[160px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "الطلبات" : "Orders"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[180px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px]">
                      {isArabic ? "إجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDistributors.map((distributor: any) => {
                    const stats = distributorStats[distributor.id] || { total: 0, pending: 0, in_transit: 0, delivered: 0, cancelled: 0 };
                    return (
                      <DistributorRow 
                        key={distributor.id} 
                        distributor={distributor}
                        stats={stats}
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
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>

      {/* ===== EDIT MODAL - وردي ===== */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#f9a8d4]/30 shadow-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#d81b60] dark:text-[#f9a8d4]">
              <UserPen className="h-5 w-5 text-[#d81b60]" />
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

      {/* ===== DELETE CONFIRMATION - وردي ===== */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-md border-[#f9a8d4]/30 shadow-2xl rounded-2xl">
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
              <Button variant="outline" className="flex-1 border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30" onClick={() => setIsDeleteDialogOpen(false)}>
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                variant="destructive" 
                className="flex-1 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/30"
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

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}

// ============================================================
// 📦 StatCard Component - وردي/زيتي
// ============================================================
function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: "pink" | "olive" }) {
  const colors = {
    pink: "bg-[#fbcfe8] dark:bg-[#fbcfe8]/30 border-[#f9a8d4]/60 dark:border-[#f9a8d4]/30 text-[#d81b60]",
    olive: "bg-[#e8f0ee] dark:bg-[#e8f0ee]/20 border-[#2a655f]/40 dark:border-[#2a655f]/30 text-[#2a655f]",
  };

  return (
    <div className={cn(
      "rounded-xl p-4 shadow-sm border-2 hover:shadow-lg hover:border-[#d81b60]/60 transition-all duration-300 hover:scale-[1.03] group cursor-pointer",
      colors[color]
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground group-hover:text-[#d81b60] transition-colors">{label}</p>
          <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white group-hover:scale-105 transition-transform">{value}</p>
        </div>
        <div className={cn(
          "h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12",
          color === "pink" ? "bg-[#f9a8d4]/50 dark:bg-[#f9a8d4]/30 group-hover:bg-[#f9a8d4]/70" : "bg-[#2a655f]/20 group-hover:bg-[#2a655f]/30"
        )}>
          <Icon className="h-4 w-4 text-[#d81b60]" />
        </div>
      </div>
    </div>
  );
}

// ============================================================
// 📦 DistributorRow Component - وردي
// ============================================================
function DistributorRow({ distributor, stats, onEdit, onDelete, onToggleStatus, onToggleAvailability }: { 
  distributor: any;
  stats: { total: number; pending: number; in_transit: number; delivered: number; cancelled: number };
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onToggleAvailability: () => void;
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";

  const tooltips = {
    total: isArabic ? "📦 إجمالي جميع الطلبات الموكلة للموزع" : "📦 Total all orders assigned to distributor",
    pending: isArabic ? "⏳ طلبات قيد المراجعة أو منتظرة التنفيذ" : "⏳ Orders pending review or waiting for execution",
    in_transit: isArabic ? "🚚 طلبات قيد التوصيل (في الطريق)" : "🚚 Orders in transit (on the way)",
    delivered: isArabic ? "✅ طلبات تم توصيلها بنجاح للعميل" : "✅ Orders successfully delivered to customer",
    cancelled: isArabic ? "❌ طلبات ملغية أو فشل توصيلها" : "❌ Cancelled or failed orders",
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-emerald-500";
    if (rating >= 3.5) return "text-blue-500";
    if (rating >= 2.5) return "text-yellow-500";
    if (rating >= 1.5) return "text-orange-500";
    return "text-red-500";
  };

  const getRatingBg = (rating: number) => {
    if (rating >= 4.5) return "bg-emerald-500/10";
    if (rating >= 3.5) return "bg-blue-500/10";
    if (rating >= 2.5) return "bg-yellow-500/10";
    if (rating >= 1.5) return "bg-orange-500/10";
    return "bg-red-500/10";
  };

  return (
    <TableRow className="hover:bg-[#f9a8d4]/15 dark:hover:bg-[#f9a8d4]/10 transition-colors duration-300 border-b-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10 group">
      
      <TableCell className="text-right align-middle border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
        <div className="flex items-center gap-3 justify-end">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate group-hover:text-[#d81b60] transition-colors">
              {isArabic ? distributor.full_name_ar : distributor.full_name_en || distributor.full_name_ar}
            </p>
          </div>
          <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-[#f9a8d4]/30 group-hover:ring-[#d81b60]/50 transition-all duration-300">
            <AvatarImage src={distributor.avatar_url || ""} className="object-cover" />
            <AvatarFallback className="bg-gradient-to-br from-[#d81b60] to-[#f48fb1] text-white text-sm font-bold">
              {distributor.full_name_ar?.charAt(0) || distributor.full_name_en?.charAt(0) || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </TableCell>
      
      <TableCell className="text-center align-middle text-sm border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10" dir="ltr">
        <span className="font-mono bg-[#fbcfe8]/30 dark:bg-[#fbcfe8]/20 px-2 py-1 rounded-lg text-xs border border-[#f9a8d4]/20">
          {distributor.phone}
        </span>
      </TableCell>
      
      <TableCell className="text-center align-middle text-sm border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
        {distributor.governorates 
          ? (isArabic ? distributor.governorates.name_ar : distributor.governorates.name_en)
          : '-'}
      </TableCell>
      
      <TableCell className="text-center align-middle border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
        <div className="flex flex-col items-center gap-0.5">
          <div className="flex items-center gap-1">
            <Star className={cn(
              "h-3.5 w-3.5 fill-current",
              getRatingColor(Number(distributor.rating || 0))
            )} />
            <span className={cn(
              "font-bold text-sm",
              getRatingColor(Number(distributor.rating || 0))
            )}>
              {Number(distributor.rating || 0).toFixed(1)}
            </span>
          </div>
          <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((Number(distributor.rating || 0) / 5) * 100, 100)}%`,
                backgroundColor: Number(distributor.rating || 0) >= 4.5 ? '#10b981' :
                                Number(distributor.rating || 0) >= 3.5 ? '#3b82f6' :
                                Number(distributor.rating || 0) >= 2.5 ? '#eab308' :
                                Number(distributor.rating || 0) >= 1.5 ? '#f97316' : '#ef4444'
              }}
            />
          </div>
        </div>
      </TableCell>
      
      <TableCell className="text-center align-middle border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-[#2a655f]/10 text-[#2a655f] dark:text-[#3a8a82] border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform border border-[#2a655f]/20">
                  <Package className="h-3 w-3 mr-0.5" />
                  {stats.total || 0}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                <p className="text-xs">{tooltips.total}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform">
                  <Clock className="h-3 w-3 mr-0.5" />
                  {stats.pending || 0}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                <p className="text-xs">{tooltips.pending}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform">
                  <Truck className="h-3 w-3 mr-0.5" />
                  {stats.in_transit || 0}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                <p className="text-xs">{tooltips.in_transit}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform">
                  <CheckCircle2 className="h-3 w-3 mr-0.5" />
                  {stats.delivered || 0}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                <p className="text-xs">{tooltips.delivered}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge className="bg-red-500/10 text-red-500 dark:text-red-400 border-0 text-[10px] px-2 py-1 cursor-help hover:scale-105 transition-transform">
                  <XCircle className="h-3 w-3 mr-0.5" />
                  {stats.cancelled || 0}
                </Badge>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs bg-[#0d2e2a] text-white border-[#0d2e2a]/30">
                <p className="text-xs">{tooltips.cancelled}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </TableCell>
      
      <TableCell className="text-center align-middle border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
        <div className="flex flex-col items-center gap-1">
          <Badge className={distributor.is_active ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0" : "bg-red-500/20 text-red-500 dark:text-red-400 border-0"}>
            {distributor.is_active ? (isArabic ? "✅ نشط" : "✅ Active") : (isArabic ? "❌ غير نشط" : "❌ Inactive")}
          </Badge>
          <Badge className={distributor.is_available ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border-0" : "bg-slate-500/20 text-slate-500 dark:text-slate-400 border-0"}>
            {distributor.is_available ? (isArabic ? "● متاح" : "● Available") : (isArabic ? "○ غير متاح" : "○ Unavailable")}
          </Badge>
        </div>
      </TableCell>
      
      <TableCell className="text-center align-middle">
        <div className="flex items-center justify-center gap-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 rounded-xl hover:bg-[#fbcfe8]/30 transition-all duration-300 group-hover:scale-110 text-[#d81b60]"
            onClick={onEdit}
          >
            <UserPen className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-xl hover:bg-[#fbcfe8]/30 transition-all duration-300">
                <MoreVertical className="h-4 w-4 text-[#d81b60]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-1 border-[#f9a8d4]/30">
              <DropdownMenuItem onClick={onToggleStatus} className="rounded-lg cursor-pointer hover:bg-[#fbcfe8]/30">
                {distributor.is_active ? (isArabic ? "تعطيل" : "Deactivate") : (isArabic ? "تفعيل" : "Activate")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onToggleAvailability} className="rounded-lg cursor-pointer hover:bg-[#fbcfe8]/30">
                {distributor.is_available ? (isArabic ? "إيقاف التوفر" : "Disable availability") : (isArabic ? "تفعيل التوفر" : "Enable availability")}
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#f9a8d4]/20" />
              <DropdownMenuItem className="rounded-lg cursor-pointer gap-2 text-red-500 hover:bg-red-50/50" onClick={onDelete}>
                <Trash2 className="h-4 w-4" />
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
// 📦 AddDistributorForm Component - وردي
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
    rating: 0,
  });

  const createNewDistributor = async (data: any) => {
    const { full_name_ar, full_name_en, phone, password, address_ar, address_en, governorate_id, is_available, distributor_type, avatar_url, rating } = data;

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
            phone,
            password,
            full_name_ar,
            full_name_en,
            address_ar,
            address_en,
            governorate_id,
            company_id: companyId || null,
            rating: rating || 0,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || result.error) {
        throw new Error(result.error || 'Failed to create distributor');
      }

      toast.success(
        isArabic 
          ? `✅ تم إضافة الموزع بنجاح!\n📱 الرقم: ${phone}\n🔑 كلمة المرور: ${password}\n👤 الاسم: ${full_name_ar || full_name_en}\n⭐ التقييم: ${rating || 0}`
          : `✅ Distributor added successfully!\n📱 Phone: ${phone}\n🔑 Password: ${password}\n👤 Name: ${full_name_en || full_name_ar}\n⭐ Rating: ${rating || 0}`
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
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, full_name, phone, avatar_url")
        .eq("phone", formData.phone)
        .maybeSingle();

      if (existingProfile) {
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

        setExistingUserData(existingProfile);
        setPendingFormData(formData);
        setShowConvertDialog(true);
        setLoading(false);
        return;
      }

      if (!formData.password || formData.password.length < 6) {
        toast.error(isArabic ? "كلمة المرور يجب أن تكون 6 أحرف على الأقل" : "Password must be at least 6 characters");
        setLoading(false);
        return;
      }

      await createNewDistributor(formData);

    } catch (error: any) {
      console.error("Error adding distributor:", error);
      toast.error(isArabic ? "❌ حدث خطأ: " + (error.message || "") : "❌ Error: " + (error.message || ""));
    } finally {
      setLoading(false);
    }
  };

  const handleRatingChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setFormData({ ...formData, rating: numValue });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="flex flex-col items-center gap-3 p-4 bg-[#fbcfe8]/20 rounded-xl border border-[#f9a8d4]/30">
          <ImageInput
            value={avatarUrl || ""}
            onChange={(value) => setAvatarUrl(value)}
            userId={app.user?.id}
            folder="distributors"
            lang={app.lang}
            label={isArabic ? "صورة الموزع" : "Distributor Photo"}
            previewClassName="h-24 w-24 rounded-full object-cover border-4 border-[#f9a8d4]/50"
            hint={isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo"}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "الاسم (عربي) *" : "Name (Arabic) *"}</Label>
            <Input
              value={formData.full_name_ar}
              onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
              placeholder={isArabic ? "أحمد محمد" : "Ahmed"}
              dir="rtl"
              required
              className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
            <Input
              value={formData.full_name_en}
              onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
              placeholder="Ahmed Mohamad"
              className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="0962XXXXXX"
            dir="ltr"
            required
            className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
          />
          <p className="text-xs text-muted-foreground">
            {isArabic ? "سيستخدم هذا الرقم لتسجيل الدخول" : "This number will be used for login"}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "كلمة المرور *" : "Password *"}</Label>
          <div className="relative">
            <Input
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              type={showPassword ? "text" : "password"}
              placeholder="********"
              required
              minLength={6}
              className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl pe-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground hover:text-[#d81b60] transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            {isArabic ? "6 أحرف على الأقل" : "At least 6 characters"}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "المحافظة" : "Governorate"}</Label>
          <Select
            value={formData.governorate_id}
            onValueChange={(value) => setFormData({ ...formData, governorate_id: value })}
          >
            <SelectTrigger className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl">
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
            <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "العنوان (عربي)" : "Address (Arabic)"}</Label>
            <Input
              value={formData.address_ar}
              onChange={(e) => setFormData({ ...formData, address_ar: e.target.value })}
              placeholder={isArabic ? "دمشق" : "Damascus"}
              dir="rtl"
              className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "العنوان (إنجليزي)" : "Address (English)"}</Label>
            <Input
              value={formData.address_en}
              onChange={(e) => setFormData({ ...formData, address_en: e.target.value })}
              placeholder="Damascus"
              className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-2 text-[#d81b60] dark:text-[#f9a8d4]">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            {isArabic ? "تقييم الموزع" : "Distributor Rating"}
          </Label>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Input
                type="number"
                value={formData.rating}
                onChange={(e) => handleRatingChange(e.target.value)}
                min="0"
                max="5"
                step="0.1"
                className="w-full border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
                placeholder="0 - 5"
              />
            </div>
            <div className="flex items-center gap-1 px-3 py-1.5 bg-[#fbcfe8]/30 rounded-lg border border-[#f9a8d4]/30">
              <Star className={cn(
                "h-4 w-4",
                formData.rating >= 4.5 ? "text-emerald-500 fill-emerald-500" :
                formData.rating >= 3.5 ? "text-blue-500 fill-blue-500" :
                formData.rating >= 2.5 ? "text-yellow-500 fill-yellow-500" :
                formData.rating >= 1.5 ? "text-orange-500 fill-orange-500" :
                "text-slate-400"
              )} />
              <span className="font-bold text-sm text-[#d81b60]">
                {formData.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/ 5</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {isArabic ? "⭐ قيم الموزع من 0 إلى 5 (يمكنك استخدام أرقام عشرية مثل 4.5)" : "⭐ Rate the distributor from 0 to 5 (you can use decimal numbers like 4.5)"}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "نوع الموزع" : "Distributor Type"}</Label>
            <Select
              value={formData.distributor_type}
              onValueChange={(value: any) => setFormData({ ...formData, distributor_type: value })}
            >
              <SelectTrigger className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="freelance">{isArabic ? "🆓 مستقل" : "🆓 Freelance"}</SelectItem>
                <SelectItem value="company_employee">{isArabic ? "🏢 موظف شركة" : "🏢 Company Employee"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "متاح للعمل" : "Available"}</Label>
            <Select
              value={formData.is_available ? "available" : "unavailable"}
              onValueChange={(value) => setFormData({ ...formData, is_available: value === "available" })}
            >
              <SelectTrigger className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">✅ {isArabic ? "متاح" : "Available"}</SelectItem>
                <SelectItem value="unavailable">❌ {isArabic ? "غير متاح" : "Unavailable"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-[#f9a8d4]/30">
          <Button type="button" variant="outline" onClick={onSuccess} className="flex-1 border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30 rounded-xl">
            {isArabic ? "إلغاء" : "Cancel"}
          </Button>
          <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] shadow-lg shadow-[#d81b60]/30 rounded-xl">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isArabic ? "جاري..." : "Loading..."}
              </>
            ) : (
              <>
                <UserRoundPlus className="h-4 w-4 mr-2" />
                {isArabic ? "إضافة موزع" : "Add Distributor"}
              </>
            )}
          </Button>
        </div>
      </form>

      {/* ===== ✅ Dialog تحويل المستخدم إلى موزع - وردي ===== */}
      <Dialog open={showConvertDialog} onOpenChange={setShowConvertDialog}>
        <DialogContent className="max-w-md rounded-2xl overflow-hidden p-0 shadow-2xl border-[#f9a8d4]/30">
          <div className="bg-gradient-to-r from-[#d81b60] to-[#f48fb1] p-6 text-white">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <UserRoundPlus className="h-6 w-6 text-white" />
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

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-[#fbcfe8]/20 rounded-xl border border-[#f9a8d4]/30">
              <div className="h-14 w-14 rounded-full bg-[#fbcfe8]/40 flex items-center justify-center overflow-hidden border-2 border-[#f9a8d4]/30">
                {existingUserData?.avatar_url ? (
                  <img src={existingUserData.avatar_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-[#d81b60]">
                    {existingUserData?.full_name?.charAt(0) || 'U'}
                  </span>
                )}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#d81b60] dark:text-[#f9a8d4]">
                  {existingUserData?.full_name || (isArabic ? "مستخدم" : "User")}
                </p>
                <p className="text-sm text-muted-foreground" dir="ltr">
                  📱 {existingUserData?.phone}
                </p>
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "🆔 مستخدم مسجل في النظام" : "🆔 Registered user"}
                </p>
              </div>
              <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/20">
                {isArabic ? "عميل" : "Customer"}
              </Badge>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                  {isArabic ? "⚠️ تحويل الدور" : "⚠️ Role Change"}
                </p>
                <p className="text-xs text-amber-600/80 dark:text-amber-400/70 mt-0.5">
                  {isArabic 
                    ? `سيتم إضافة صلاحية "موزع" للمستخدم "${existingUserData?.full_name}" مع تقييم ${pendingFormData?.rating || 0}`
                    : `The "distributor" role will be added to "${existingUserData?.full_name}" with rating ${pendingFormData?.rating || 0}`}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#fbcfe8]/20 rounded-xl border border-[#f9a8d4]/30">
              <p className="text-xs font-medium text-muted-foreground mb-2">
                {isArabic ? "📋 بيانات الموزع الجديدة" : "📋 New Distributor Data"}
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isArabic ? "الاسم" : "Name"}</span>
                  <span className="font-medium text-[#d81b60]">{pendingFormData?.full_name_ar || pendingFormData?.full_name_en || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{isArabic ? "الهاتف" : "Phone"}</span>
                  <span className="font-medium text-[#d81b60]" dir="ltr">{pendingFormData?.phone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                    {isArabic ? "التقييم" : "Rating"}
                  </span>
                  <span className="font-medium text-[#d81b60]">{pendingFormData?.rating?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {isArabic 
                ? "📌 سيتم إضافة الموزع إلى شركتك الحالية" 
                : "📌 The distributor will be added to your current company"}
            </p>
          </div>

          <DialogFooter className="p-4 border-t border-[#f9a8d4]/30 bg-[#fbcfe8]/20 gap-2">
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
              className="flex-1 border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30 rounded-xl"
            >
              <X className="h-4 w-4 mr-1.5" />
              {isArabic ? "استخدام رقم آخر" : "Use Another Number"}
            </Button>
            <Button
              onClick={onConvertUser}
              className="flex-1 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] shadow-lg shadow-[#d81b60]/30 rounded-xl"
            >
              <UserRoundPlus className="h-4 w-4 mr-1.5" />
              {isArabic ? "تحويل إلى موزع" : "Convert to Distributor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================================
// 📦 EditDistributorForm Component - وردي
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
    rating: distributor.rating || 0,
  });

  const handleRatingChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 5) {
      setFormData({ ...formData, rating: numValue });
    }
  };

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
          rating: formData.rating,
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
      <div className="flex flex-col items-center gap-3 p-4 bg-[#fbcfe8]/20 rounded-xl border border-[#f9a8d4]/30">
        <ImageInput
          value={avatarUrl || ""}
          onChange={(value) => setAvatarUrl(value)}
          userId={app.user?.id}
          folder="distributors"
          lang={app.lang}
          label={isArabic ? "صورة الموزع" : "Distributor Photo"}
          previewClassName="h-24 w-24 rounded-full object-cover border-4 border-[#f9a8d4]/50"
          hint={isArabic ? "اضغط لرفع صورة الموزع" : "Click to upload distributor photo"}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "الاسم (عربي) *" : "Name (Arabic) *"}</Label>
          <Input
            value={formData.full_name_ar}
            onChange={(e) => setFormData({ ...formData, full_name_ar: e.target.value })}
            dir="rtl"
            className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "الاسم (إنجليزي)" : "Name (English)"}</Label>
          <Input
            value={formData.full_name_en}
            onChange={(e) => setFormData({ ...formData, full_name_en: e.target.value })}
            className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "رقم الهاتف *" : "Phone *"}</Label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            dir="ltr"
            className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "المحافظة" : "Governorate"}</Label>
          <Select
            value={formData.governorate_id}
            onValueChange={(value) => setFormData({ ...formData, governorate_id: value })}
          >
            <SelectTrigger className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl">
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

      <div className="space-y-1">
        <Label className="flex items-center gap-2 text-[#d81b60] dark:text-[#f9a8d4]">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
          {isArabic ? "تقييم الموزع" : "Distributor Rating"}
        </Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              type="number"
              value={formData.rating}
              onChange={(e) => handleRatingChange(e.target.value)}
              min="0"
              max="5"
              step="0.1"
              className="w-full border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl"
              placeholder="0 - 5"
            />
          </div>
          <div className="flex items-center gap-1 px-3 py-1.5 bg-[#fbcfe8]/30 rounded-lg border border-[#f9a8d4]/30">
            <Star className={cn(
              "h-4 w-4",
              formData.rating >= 4.5 ? "text-emerald-500 fill-emerald-500" :
              formData.rating >= 3.5 ? "text-blue-500 fill-blue-500" :
              formData.rating >= 2.5 ? "text-yellow-500 fill-yellow-500" :
              formData.rating >= 1.5 ? "text-orange-500 fill-orange-500" :
              "text-slate-400"
            )} />
            <span className="font-bold text-sm text-[#d81b60]">
              {formData.rating.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">/ 5</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {isArabic ? "⭐ قيم الموزع من 0 إلى 5" : "⭐ Rate the distributor from 0 to 5"}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "نوع الموزع" : "Distributor Type"}</Label>
          <Select
            value={formData.distributor_type}
            onValueChange={(value: any) => setFormData({ ...formData, distributor_type: value })}
          >
            <SelectTrigger className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="freelance">{isArabic ? "🆓 مستقل" : "🆓 Freelance"}</SelectItem>
              <SelectItem value="company_employee">{isArabic ? "🏢 موظف شركة" : "🏢 Company Employee"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-[#d81b60] dark:text-[#f9a8d4]">{isArabic ? "الحالة" : "Status"}</Label>
          <Select
            value={formData.is_available ? "available" : "unavailable"}
            onValueChange={(value) => setFormData({ ...formData, is_available: value === "available" })}
          >
            <SelectTrigger className="border-[#f9a8d4]/30 focus:border-[#d81b60] focus:ring-[#d81b60]/20 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">✅ {isArabic ? "متاح" : "Available"}</SelectItem>
              <SelectItem value="unavailable">❌ {isArabic ? "غير متاح" : "Unavailable"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-[#f9a8d4]/30">
        <Button type="button" variant="outline" onClick={onSuccess} className="flex-1 border-[#f9a8d4]/30 hover:bg-[#fbcfe8]/30 rounded-xl">
          {isArabic ? "إلغاء" : "Cancel"}
        </Button>
        <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white hover:from-[#c2185b] hover:to-[#f9a8d4] shadow-lg shadow-[#d81b60]/30 rounded-xl">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isArabic ? "جاري..." : "Loading..."}
            </>
          ) : (
            <>
              <UserPen className="h-4 w-4 mr-2" />
              {isArabic ? "حفظ التغييرات" : "Save Changes"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}