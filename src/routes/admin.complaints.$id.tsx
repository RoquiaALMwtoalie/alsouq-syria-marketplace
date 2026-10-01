import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ArrowRight, ArrowLeft, User, Store, Package, Calendar, Clock,
  CheckCircle2, XCircle, AlertTriangle, MessageSquare, Send,
  Loader2, Shield, Phone, Mail, MapPin, FileText, Hash,
  Home, UserCheck, Wallet,
} from "lucide-react";

// ============================================================
// ✅ الأنواع
// ============================================================
type ComplaintStatus = "open" | "pending" | "in_progress" | "resolved" | "closed" | "rejected";

const STATUS_CONFIG: Record<ComplaintStatus, {
  label_ar: string;
  label_en: string;
  color: string;
  bg: string;
  border: string;
  icon: any;
  gradient: string;
}> = {
  open: {
    label_ar: "مفتوحة",
    label_en: "Open",
    color: "text-red-600 dark:text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    icon: AlertTriangle,
    gradient: "from-red-500 to-rose-600",
  },
  pending: {
    label_ar: "قيد المراجعة",
    label_en: "Pending",
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    icon: Clock,
    gradient: "from-amber-500 to-orange-600",
  },
  in_progress: {
    label_ar: "قيد المعالجة",
    label_en: "In Progress",
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    icon: Loader2,
    gradient: "from-blue-500 to-indigo-600",
  },
  resolved: {
    label_ar: "تم الحل",
    label_en: "Resolved",
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-600",
  },
  closed: {
    label_ar: "مغلقة",
    label_en: "Closed",
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-slate-500/30",
    icon: XCircle,
    gradient: "from-slate-500 to-gray-600",
  },
  rejected: {
    label_ar: "مرفوضة",
    label_en: "Rejected",
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    icon: XCircle,
    gradient: "from-rose-500 to-pink-600",
  },
};

// ============================================================
// ✅ Route
// ============================================================
export const Route = createFileRoute("/admin/complaints/$id")({
  component: ComplaintDetailPage,
});

// ============================================================
// ✅ Helpers
// ============================================================
function formatDate(date: string | null | undefined, isRTL: boolean, withTime = true) {
  if (!date) return "—";
  try {
    const options: Intl.DateTimeFormatOptions = {
      calendar: "gregory",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    if (withTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }
    return new Date(date).toLocaleDateString(isRTL ? "ar-SY" : "en-US", options);
  } catch {
    return "—";
  }
}

function formatPrice(price: number | null | undefined, currency: string | null | undefined, isRTL: boolean) {
  if (price === null || price === undefined) return "—";
  return `${Number(price).toLocaleString(isRTL ? "ar-SY" : "en-US")} ${currency || "SYP"}`;
}

function getInitials(name?: string | null) {
  if (!name) return "?";
  return name.charAt(0).toUpperCase();
}

// ============================================================
// ✅ الصفحة
// ============================================================
function ComplaintDetailPage() {
  // ✅ التعديل: استخدام Route.useParams()
  const { id } = Route.useParams();
  const app = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isRTL = app.lang === "ar";

  const [adminResponse, setAdminResponse] = useState("");
  const [pendingStatus, setPendingStatus] = useState<ComplaintStatus | "">("");

  // ============================================================
  // ✅ جلب تفاصيل الشكوى
  // ============================================================
  const { data: complaint, isLoading, error } = useQuery({
    queryKey: ["complaint", id],
    enabled: !!id,
    queryFn: async () => {
      console.log("📡 [Complaint] Fetching:", id);

      const { data, error } = await supabase
        .from("complaints")
        .select(`
          *,
          customer:profiles!complaints_user_id_fkey (
            id,
            full_name,
            phone,
            avatar_url,
            city,
            address_text
          ),
          seller:profiles!complaints_seller_id_fkey (
            id,
            full_name,
            store_name,
            store_logo_url,
            store_phone,
            phone,
            store_address,
            avatar_url
          ),
          order:orders!complaints_order_id_fkey (
            id,
            total,
            currency,
            status,
            created_at,
            buyer_name,
            buyer_phone,
            delivery_address,
            quantity,
            order_items (
              id,
              quantity,
              price,
              currency,
              listing:listings (
                id,
                title_ar,
                title_en,
                cover_url,
                price,
                currency
              )
            )
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ [Complaint] Error:", error);
        throw error;
      }

      console.log("✅ [Complaint] Found:", data);
      return data;
    },
  });

  // ============================================================
  // ✅ تحديث الشكوى
  // ============================================================
  const updateComplaint = useMutation({
    mutationFn: async (params: {
      status?: ComplaintStatus;
      admin_response?: string;
    }) => {
      const payload: any = {
        ...params,
        updated_at: new Date().toISOString(),
      };

      if (params.status === "resolved" || params.status === "closed") {
        payload.resolved_at = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from("complaints")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast.success(isRTL ? "✅ تم تحديث الشكوى" : "✅ Complaint updated");
      queryClient.invalidateQueries({ queryKey: ["complaint", id] });
      queryClient.invalidateQueries({ queryKey: ["complaints"] });
      setAdminResponse("");
      setPendingStatus("");
    },
    onError: (err: any) => {
      toast.error(isRTL ? `❌ فشل: ${err.message}` : `❌ Failed: ${err.message}`);
    },
  });

  // ============================================================
  // ✅ Handlers
  // ============================================================
  const handleStatusChange = async (status: ComplaintStatus) => {
    if (status === complaint?.status) return;
    setPendingStatus(status);
    try {
      await updateComplaint.mutateAsync({ status });
    } catch {
      setPendingStatus("");
    }
  };

  const handleSubmitResponse = async () => {
    if (!adminResponse.trim()) {
      toast.error(isRTL ? "⚠️ اكتب الرد أولاً" : "⚠️ Write a response first");
      return;
    }
    await updateComplaint.mutateAsync({
      admin_response: adminResponse.trim(),
      status: (pendingStatus || complaint?.status) as ComplaintStatus,
    });
  };

  // ============================================================
  // ✅ Loading / Error
  // ============================================================
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#2a655f]/5 to-[#3a8a82]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#2a655f]/5">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
            <AlertTriangle className="absolute inset-0 m-auto h-6 w-6 text-[#2a655f] animate-pulse" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">
            {isRTL ? "⏳ جاري تحميل تفاصيل الشكوى..." : "⏳ Loading complaint details..."}
          </p>
        </div>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#2a655f]/5 to-[#3a8a82]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#2a655f]/5 p-4">
        <div className="max-w-md w-full text-center">
          <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-10 w-10 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {isRTL ? "❌ الشكوى غير موجودة" : "❌ Complaint not found"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
            {isRTL ? "ربما تم حذفها أو الرابط غير صحيح" : "It may have been deleted or the link is invalid"}
          </p>
          <Button
            onClick={() => navigate({ to: "/admin", search: { tab: "complaints" } })}
            className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white"
          >
            <ArrowRight className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2 rotate-180")} />
            {isRTL ? "العودة للشكاوى" : "Back to complaints"}
          </Button>
        </div>
      </div>
    );
  }

  // ============================================================
  // ✅ استخراج البيانات
  // ============================================================
  const status = (complaint.status || "open") as ComplaintStatus;
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const StatusIcon = statusConfig.icon;

  const customer = complaint.customer;
  const seller = complaint.seller;
  const order = complaint.order;
  const orderItems = order?.order_items || [];

  // ============================================================
  // ✅ Render
  // ============================================================
  return (
    <div
      className={cn(
        "min-h-screen bg-gradient-to-br from-white via-[#2a655f]/5 to-[#3a8a82]/5 dark:from-[#0f172a] dark:via-[#0f172a] dark:to-[#2a655f]/5 pb-12",
        isRTL && "font-arabic"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* ============ HEADER ============ */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0f172a]/95 backdrop-blur-xl border-b-2 border-[#2a655f]/30 shadow-lg">
        <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-[#3a8a82] animate-pulse" />

        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate({ to: "/admin", search: { tab: "complaints" } })}
              className="rounded-xl hover:bg-[#2a655f]/10 shrink-0"
            >
              {isRTL ? <ArrowRight className="h-5 w-5" /> : <ArrowLeft className="h-5 w-5" />}
            </Button>

            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 shrink-0">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>

            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-[#2a655f] dark:text-[#3a8a82] truncate">
                {isRTL ? "تفاصيل الشكوى" : "Complaint Details"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
                #{id.slice(0, 8)}
              </p>
            </div>
          </div>

          <Badge
            className={cn(
              "border-2 flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0",
              statusConfig.bg,
              statusConfig.color,
              statusConfig.border
            )}
          >
            <StatusIcon
              className={cn(
                "h-3.5 w-3.5",
                status === "in_progress" && pendingStatus === "in_progress" && "animate-spin"
              )}
            />
            {isRTL ? statusConfig.label_ar : statusConfig.label_en}
          </Badge>
        </div>
      </header>

      {/* ============ CONTENT ============ */}
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">

        {/* ============ 1. العنوان والوصف ============ */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-[#2a655f]/10 to-transparent rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-start gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center shadow-lg shadow-[#2a655f]/30 shrink-0">
                <FileText className="h-7 w-7 text-white" />
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white break-words">
                  {complaint.subject || (isRTL ? "بدون عنوان" : "No title")}
                </h2>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5" />
                    {id.slice(0, 8)}
                  </span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(complaint.created_at, isRTL)}
                  </span>
                  {complaint.resolved_at && (
                    <>
                      <span className="h-1 w-1 rounded-full bg-slate-300" />
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        {isRTL ? "حُلّت: " : "Resolved: "}
                        {formatDate(complaint.resolved_at, isRTL, false)}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {complaint.description && (
              <div className="mt-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="h-4 w-4 text-[#2a655f]" />
                  <span className="text-xs font-bold text-[#2a655f] dark:text-[#3a8a82] uppercase tracking-wider">
                    {isRTL ? "وصف الشكوى" : "Complaint Description"}
                  </span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ============ 2. العميل + المتجر ============ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* ---- العميل ---- */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <User className="h-4 w-4 text-blue-600" />
                </div>
                <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  {isRTL ? "مقدم الشكوى" : "Complainant"}
                </h3>
              </div>

              {customer ? (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-2xl ring-2 ring-blue-500/30 shrink-0">
                    {customer.avatar_url ? (
                      <AvatarImage src={customer.avatar_url} alt={customer.full_name} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xl font-bold">
                        {getInitials(customer.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {customer.full_name || (isRTL ? "عميل" : "Customer")}
                    </p>

                    {customer.phone && (
                      <a
                        href={`tel:${customer.phone}`}
                        className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-blue-600 transition-colors"
                        dir="ltr"
                      >
                        <Phone className="h-3.5 w-3.5 text-blue-500" />
                        {customer.phone}
                      </a>
                    )}

                    {customer.city && (
                      <p className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-blue-500" />
                        {customer.city}
                      </p>
                    )}

                    {customer.address_text && (
                      <p className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                        <Home className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                        <span className="truncate">{customer.address_text}</span>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <User className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-400 italic">
                    {isRTL ? "لا توجد بيانات للعميل" : "No customer data"}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ---- المتجر ---- */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/10 to-transparent rounded-full blur-3xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Store className="h-4 w-4 text-amber-600" />
                </div>
                <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  {isRTL ? "المتجر المشتكى عليه" : "Reported Store"}
                </h3>
              </div>

              {seller ? (
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 rounded-2xl ring-2 ring-amber-500/30 shrink-0">
                    {seller.store_logo_url ? (
                      <AvatarImage src={seller.store_logo_url} alt={seller.store_name} className="object-cover" />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xl font-bold">
                        {getInitials(seller.store_name || seller.full_name)}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 min-w-0 space-y-1.5">
                    <p className="text-base font-bold text-slate-900 dark:text-white truncate">
                      {seller.store_name || seller.full_name || (isRTL ? "متجر" : "Store")}
                    </p>

                    {(seller.store_phone || seller.phone) && (
                      <a
                        href={`tel:${seller.store_phone || seller.phone}`}
                        className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 hover:text-amber-600 transition-colors"
                        dir="ltr"
                      >
                        <Phone className="h-3.5 w-3.5 text-amber-500" />
                        {seller.store_phone || seller.phone}
                      </a>
                    )}

                    {seller.store_address && (
                      <p className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <MapPin className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                        <span className="truncate">{seller.store_address}</span>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <Store className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-400 italic">
                    {isRTL ? "شكوى على المنصة (بدون بائع محدد)" : "Platform complaint (no specific seller)"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============ 3. الطلب المرتبط ============ */}
        {order && (
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-[#2a655f]/10 flex items-center justify-center">
                <Package className="h-4 w-4 text-[#2a655f]" />
              </div>
              <h3 className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] uppercase tracking-wider">
                {isRTL ? "الطلب المرتبط" : "Related Order"}
              </h3>
            </div>

            {/* تفاصيل أساسية */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1">
                  {isRTL ? "رقم الطلب" : "Order ID"}
                </p>
                <p className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                  #{order.id.slice(0, 8)}
                </p>
              </div>

              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1">
                  {isRTL ? "الإجمالي" : "Total"}
                </p>
                <p className="text-xs font-bold text-[#2a655f] dark:text-[#3a8a82]">
                  {formatPrice(order.total, order.currency, isRTL)}
                </p>
              </div>

              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1">
                  {isRTL ? "الحالة" : "Status"}
                </p>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {order.status}
                </p>
              </div>

              <div className="text-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase mb-1">
                  {isRTL ? "التاريخ" : "Date"}
                </p>
                <p className="text-[10px] text-slate-700 dark:text-slate-300">
                  {formatDate(order.created_at, isRTL, false)}
                </p>
              </div>
            </div>

            {/* بيانات المشتري من الطلب */}
            {(order.buyer_name || order.buyer_phone) && (
              <div className="mb-4 p-3 rounded-xl bg-[#2a655f]/5 border border-[#2a655f]/20">
                <p className="text-[10px] text-[#2a655f] dark:text-[#3a8a82] font-bold uppercase mb-2">
                  {isRTL ? "بيانات المشتري في الطلب" : "Order Buyer Info"}
                </p>
                <div className="flex items-center gap-4 text-xs">
                  {order.buyer_name && (
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <UserCheck className="h-3.5 w-3.5 text-[#2a655f]" />
                      {order.buyer_name}
                    </span>
                  )}
                  {order.buyer_phone && (
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300" dir="ltr">
                      <Phone className="h-3.5 w-3.5 text-[#2a655f]" />
                      {order.buyer_phone}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* المنتجات */}
            {orderItems.length > 0 && (
              <div>
                <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
                  {isRTL ? `المنتجات في الطلب (${orderItems.length})` : `Order Items (${orderItems.length})`}
                </p>
                <div className="space-y-2">
                  {orderItems.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/30 transition-colors"
                    >
                      {item.listing?.cover_url ? (
                        <img
                          src={item.listing.cover_url}
                          alt={item.listing.title_ar}
                          className="h-14 w-14 rounded-xl object-cover border-2 border-[#2a655f]/20 shrink-0"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                          <Package className="h-6 w-6 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {isRTL
                            ? item.listing?.title_ar
                            : item.listing?.title_en || item.listing?.title_ar}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400">
                          <span className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {isRTL ? "الكمية:" : "Qty:"} <strong className="text-slate-700 dark:text-slate-300">{item.quantity}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Wallet className="h-3 w-3" />
                            <strong className="text-[#2a655f] dark:text-[#3a8a82]">
                              {formatPrice(item.price, item.currency, isRTL)}
                            </strong>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============ 4. الرد الإداري الحالي ============ */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-emerald-600" />
            </div>
            <h3 className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              {isRTL ? "الرد الإداري" : "Admin Response"}
            </h3>
          </div>

          {complaint.admin_response ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800/30">
              <p className="text-sm text-emerald-800 dark:text-emerald-200 leading-relaxed whitespace-pre-wrap">
                {complaint.admin_response}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-3 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDate(complaint.updated_at || complaint.resolved_at, isRTL)}
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">
                {isRTL ? "لا يوجد رد إداري بعد" : "No admin response yet"}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {isRTL ? "اكتب الرد من الأسفل ⬇" : "Write a response below ⬇"}
              </p>
            </div>
          )}
        </div>

        {/* ============ 5. لوحة الإجراءات ============ */}
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-[#2a655f]/30 p-6 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-8 rounded-lg bg-[#2a655f]/10 flex items-center justify-center">
              <Shield className="h-4 w-4 text-[#2a655f]" />
            </div>
            <h3 className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82] uppercase tracking-wider">
              {isRTL ? "الإجراءات الإدارية" : "Admin Actions"}
            </h3>
          </div>

          {/* تغيير الحالة */}
          <div className="mb-6">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
              {isRTL ? "تغيير حالة الشكوى:" : "Change Complaint Status:"}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {(Object.keys(STATUS_CONFIG) as ComplaintStatus[]).map((s) => {
                const cfg = STATUS_CONFIG[s];
                const Icon = cfg.icon;
                const isActive = status === s;
                const isPendingThis = pendingStatus === s;
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleStatusChange(s)}
                    disabled={updateComplaint.isPending || isActive}
                    className={cn(
                      "relative flex flex-col items-center gap-1.5 px-3 py-3 rounded-xl text-xs font-bold border-2 transition-all duration-300",
                      isActive
                        ? `${cfg.bg} ${cfg.color} ${cfg.border} scale-105 shadow-lg`
                        : "bg-slate-50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 hover:scale-[1.02]",
                      (updateComplaint.isPending || isActive) && "opacity-60 cursor-not-allowed"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4",
                        (s === "in_progress" || isPendingThis) && "animate-spin"
                      )}
                    />
                    <span className="text-center leading-tight">
                      {isRTL ? cfg.label_ar : cfg.label_en}
                    </span>
                    {isActive && (
                      <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* كتابة رد جديد */}
          <div className="border-t-2 border-slate-200 dark:border-slate-700 pt-6">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block mb-2">
              {isRTL ? "اكتب رداً إدارياً:" : "Write Admin Response:"}
            </label>
            <Textarea
              value={adminResponse}
              onChange={(e) => setAdminResponse(e.target.value)}
              placeholder={
                isRTL
                  ? "اكتب ردك على الشكوى هنا... سيظهر للعميل"
                  : "Write your response here... It will be shown to the customer"
              }
              rows={5}
              className="rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 resize-none text-sm"
            />

            <div className="flex items-center justify-between gap-3 mt-4 flex-wrap">
              <p className="text-xs text-slate-400">
                {isRTL
                  ? "💡 الرد سيُحفظ مع الشكوى وسيراه العميل"
                  : "💡 Response will be saved and visible to the customer"}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setAdminResponse("");
                    setPendingStatus("");
                  }}
                  disabled={updateComplaint.isPending}
                  className="rounded-xl"
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>

                <Button
                  onClick={handleSubmitResponse}
                  disabled={updateComplaint.isPending || !adminResponse.trim()}
                  className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 hover:shadow-xl transition-all"
                >
                  {updateComplaint.isPending ? (
                    <Loader2 className={cn("h-4 w-4 animate-spin", isRTL ? "ml-2" : "mr-2")} />
                  ) : (
                    <Send className={cn("h-4 w-4", isRTL ? "ml-2" : "mr-2")} />
                  )}
                  {isRTL ? "إرسال الرد" : "Send Response"}
                </Button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}