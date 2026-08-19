// src/components/dashboard/admin/AdminPromoCodes.tsx

import React, { useState, useMemo, useCallback } from "react";
import { useApp } from "@/lib/i18n";
import {
  Tag, Plus, Edit, Trash2, Search, X, Eye, EyeOff,
  Loader2, DollarSign, Percent, Truck, Gift,
  Filter, MoreVertical, Copy, RefreshCw, Sparkles,
  Zap, Shield, Layers, Clock, Calendar, Users,
  CheckCircle2, TrendingUp, TrendingDown, Store, Globe,
  Info, MapPin, CalendarClock, Timer,
  Check,  // ✅ أضف هذا السطر
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  usePromoCodesInfinite,
  useAllPromoCodes,
  usePromoCodesStatsOptimized,
  usePromoCodesRealtime,
  useCreatePromoCode,
  useUpdatePromoCode,
  useDeletePromoCode,
  useTogglePromoCodeStatus,
  type PromoCode,
} from "./AdminPromoCodesManager";
import { useAllStores } from "@/lib/queries";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

// ============================================================
// ✅ مكون TimePicker مخصص
// ============================================================
function CustomTimePicker({ 
  value, 
  onChange,
  isArabic
}: { 
  value: string; 
  onChange: (time: string) => void;
  isArabic: boolean;
}) {
  const [hours, setHours] = useState(() => {
    if (!value) return "12";
    const parts = value.split(":");
    return parts[0] || "12";
  });
  
  const [minutes, setMinutes] = useState(() => {
    if (!value) return "00";
    const parts = value.split(":");
    return parts[1] || "00";
  });

  const [period, setPeriod] = useState(() => {
    if (!value) return "AM";
    const h = parseInt(value.split(":")[0] || "12");
    return h >= 12 ? "PM" : "AM";
  });

  const updateTime = useCallback((h: string, m: string, p: string) => {
    let hour = parseInt(h);
    if (p === "PM" && hour < 12) hour += 12;
    if (p === "AM" && hour === 12) hour = 0;
    const timeStr = `${String(hour).padStart(2, "0")}:${m}`;
    onChange(timeStr);
  }, [onChange]);

  const hourOptions = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const minuteOptions = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, "0"));

  return (
    <div className="flex items-center gap-2">
      <Select
        value={hours}
        onValueChange={(v) => {
          setHours(v);
          updateTime(v, minutes, period);
        }}
      >
        <SelectTrigger className="w-20 h-10 rounded-xl border-[#0d2e2a]/20 text-center font-mono text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48 overflow-y-auto">
          {hourOptions.map((h) => (
            <SelectItem key={h} value={h} className="text-center font-mono">
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-xl font-bold text-[#0d2e2a] dark:text-white">:</span>

      <Select
        value={minutes}
        onValueChange={(v) => {
          setMinutes(v);
          updateTime(hours, v, period);
        }}
      >
        <SelectTrigger className="w-20 h-10 rounded-xl border-[#0d2e2a]/20 text-center font-mono text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48 overflow-y-auto">
          {minuteOptions.map((m) => (
            <SelectItem key={m} value={m} className="text-center font-mono">
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={period}
        onValueChange={(v) => {
          setPeriod(v);
          updateTime(hours, minutes, v);
        }}
      >
        <SelectTrigger className="w-24 h-10 rounded-xl border-[#0d2e2a]/20 text-center text-sm font-medium">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="AM" className="font-medium">
            {isArabic ? "صباحاً" : "AM"}
          </SelectItem>
          <SelectItem value="PM" className="font-medium">
            {isArabic ? "مساءً" : "PM"}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ============================================================
// ✅ مكون إحصائيات سريعة
// ============================================================
const StatsCards = React.memo(({ stats }: { stats: any }) => {
  const app = useApp();
  const isArabic = app.lang === "ar";

  const items = useMemo(() => [
    { 
      label: isArabic ? "📊 الإجمالي" : "📊 Total", 
      value: stats.total, 
      gradient: "from-[#0d2e2a] to-[#1a4f4a]",
      icon: Tag,
      change: "+0%",
    },
    { 
      label: isArabic ? "✅ نشط" : "✅ Active", 
      value: stats.active, 
      gradient: "from-[#2d6b63] to-[#4a9f95]",
      icon: Shield,
      change: stats.total > 0 ? `${Math.round((stats.active / stats.total) * 100)}%` : "0%",
    },
    { 
      label: isArabic ? "⏰ منتهي" : "⏰ Expired", 
      value: stats.expired, 
      gradient: "from-[#1a4f4a] to-[#2d6b63]",
      icon: Clock,
      change: stats.total > 0 ? `${Math.round((stats.expired / stats.total) * 100)}%` : "0%",
    },
    { 
      label: isArabic ? "📈 مستخدم" : "📈 Used", 
      value: stats.used, 
      gradient: "from-[#4a9f95] to-[#6bb5aa]",
      icon: Users,
      change: stats.total > 0 ? `${Math.round((stats.used / stats.total) * 100)}%` : "0%",
    },
  ], [stats, isArabic]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div
          key={item.label}
          className={cn(
            "group bg-gradient-to-br p-4 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden cursor-default",
            item.gradient
          )}
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-white/10 blur-3xl animate-pulse" />
          </div>
          <div className="relative flex items-center justify-between">
            <div>
              <p className="text-xs opacity-80 font-medium">{item.label}</p>
              <p className="text-2xl font-bold mt-1">{item.value}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp className="h-3 w-3 text-emerald-300" />
                <span className="text-[10px] opacity-70">{item.change}</span>
              </div>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <item.icon className="h-5 w-5 text-white/80" />
            </div>
          </div>
          <div className="relative mt-2 h-0.5 w-full rounded-full bg-white/20 overflow-hidden">
            <div 
              className="h-full rounded-full bg-white/40 transition-all duration-1000" 
              style={{ width: `${Math.min(100, (stats.total > 0 ? (item.value / stats.total) * 100 : 0))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});
StatsCards.displayName = 'StatsCards';

// ============================================================
// ✅ مكون صف الجدول
// ============================================================
const PromoCodeRow = React.memo(({ 
  code, 
  onEdit, 
  onDelete, 
  onToggle, 
  onCopy,
  isArabic,
  currency,
  getTypeLabel,
  getTypeColor,
  getStatusColor,
  getStatusLabel,
  formatDate,
}: any) => {
  const typeInfo = getTypeLabel(code.type);
  const TypeIcon = typeInfo.icon;
  const statusColor = getStatusColor(code);
  const statusLabel = getStatusLabel(code);

  return (
    <TableRow className="group border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/10 transition-all duration-200">
      <TableCell className="font-mono font-semibold text-[#0d2e2a] dark:text-[#4a9f95]">
        <button
          onClick={() => onCopy(code.code)}
          className="flex items-center gap-2 hover:text-[#1a4f4a] transition-colors group/code"
        >
          {code.code}
          <Copy className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover/code:opacity-100 transition-opacity" />
        </button>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {code.is_public && !code.store_id && (
            <Badge className="bg-[#2d6b63]/10 text-[#2d6b63] border border-[#2d6b63]/20 text-[8px]">
              <Globe className="h-2.5 w-2.5 inline mr-0.5" />
              {isArabic ? "عام" : "Public"}
            </Badge>
          )}
          {code.store_id && (
            <Badge className="bg-[#1a4f4a]/10 text-[#1a4f4a] border border-[#1a4f4a]/20 text-[8px]">
              <Store className="h-2.5 w-2.5 inline mr-0.5" />
              {code.store_name || isArabic ? "مخصص" : "Specific"}
            </Badge>
          )}
          <span className="text-sm font-medium">{code.label || "-"}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={cn("border-0 flex items-center gap-1 px-3 py-1", getTypeColor(code.type))}>
          <TypeIcon className="h-3 w-3" />
          <span className="text-xs">{isArabic ? typeInfo.ar : typeInfo.en}</span>
        </Badge>
      </TableCell>
      <TableCell className="font-bold text-[#0d2e2a] dark:text-[#4a9f95]">
        {code.type === "free_shipping" ? (
          <span className="text-[#2d6b63]">🆓 مجاني</span>
        ) : code.type === "percentage" ? (
          `${code.value}%`
        ) : (
          `${code.value} ${currency}`
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-[#0d2e2a] dark:text-white">
            {code.used_count || 0}
          </span>
          {code.usage_limit && (
            <span className="text-xs text-muted-foreground">
              / {code.usage_limit}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell>
        <Badge className={cn("border-0 px-3 py-1", statusColor)}>
          <span className="flex items-center gap-1.5">
            {statusLabel === "نشط" || statusLabel === "Active" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-[#2d6b63] animate-pulse" />
            ) : statusLabel === "منتهي الصلاحية" || statusLabel === "Expired" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            )}
            {statusLabel}
          </span>
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground">
        {code.expires_at ? formatDate(code.expires_at) : isArabic ? "غير محدود" : "Unlimited"}
      </TableCell>
      <TableCell className="text-end">
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-lg hover:bg-[#0d2e2a]/10 transition-all duration-200 hover:scale-105"
            onClick={() => onEdit(code)}
          >
            <Edit className="h-4 w-4 text-[#2d6b63]" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200 hover:scale-105"
            onClick={() => onDelete(code)}
          >
            <Trash2 className="h-4 w-4 text-rose-500" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg hover:bg-[#0d2e2a]/10 transition-all duration-200 hover:scale-105">
                <MoreVertical className="h-4 w-4 text-[#0d2e2a]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl p-1 min-w-[160px]">
              <DropdownMenuItem
                className="rounded-lg cursor-pointer gap-2 hover:bg-[#0d2e2a]/10 transition-colors"
                onClick={() => onCopy(code.code)}
              >
                <Copy className="h-4 w-4 text-[#2d6b63]" />
                {isArabic ? "نسخ الكود" : "Copy code"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer gap-2 hover:bg-[#0d2e2a]/10 transition-colors"
                onClick={() => onToggle(code)}
              >
                {code.is_active ? (
                  <>
                    <EyeOff className="h-4 w-4 text-rose-500" />
                    {isArabic ? "تعطيل" : "Deactivate"}
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-[#2d6b63]" />
                    {isArabic ? "تفعيل" : "Activate"}
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
});
PromoCodeRow.displayName = 'PromoCodeRow';

export function AdminPromoCodes() {
  const app = useApp();
  const isArabic = app.lang === "ar";

  // ✅ State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedCode, setSelectedCode] = useState<PromoCode | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ State للكود العام/مخصص
  const [isStoreSpecific, setIsStoreSpecific] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");

  // ✅ State للبحث في المتاجر
  const [searchStore, setSearchStore] = useState("");

  // ✅ جلب المتاجر النشطة
  const { data: stores = [], isLoading: storesLoading } = useAllStores(100);

  // ✅ تصفية المتاجر النشطة فقط
  const activeStores = useMemo(() => {
    return stores.filter((store: any) => store.store_active !== false);
  }, [stores]);

  // ✅ تصفية المتاجر حسب البحث (الاسم أو رقم الجوال)
  const filteredStores = useMemo(() => {
    if (!searchStore.trim()) return activeStores;
    const query = searchStore.trim().toLowerCase();
    return activeStores.filter((store: any) => {
      const name = (store.store_name || store.full_name || '').toLowerCase();
      const phone = (store.store_phone || store.phone || '').toLowerCase();
      return name.includes(query) || phone.includes(query);
    });
  }, [activeStores, searchStore]);

  // ✅ ===== HOOKS الاحترافية =====
  
  const {
    data: infiniteData,
    isLoading,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePromoCodesInfinite({
    search: searchQuery,
    filterType,
    filterStatus,
  });

  const { data: stats = { total: 0, active: 0, expired: 0, used: 0 } } = usePromoCodesStatsOptimized();
  usePromoCodesRealtime();

  const codes = useMemo(() => {
    if (!infiniteData) return [];
    return infiniteData.pages.flatMap((page) => page.data) || [];
  }, [infiniteData]);

  const totalCount = useMemo(() => {
    if (!infiniteData || infiniteData.pages.length === 0) return 0;
    return infiniteData.pages[0]?.total || 0;
  }, [infiniteData]);

  // ✅ ===== دوال مساعدة =====
  const copyCode = useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    toast.success(isArabic ? "✅ تم نسخ الكود" : "✅ Code copied");
  }, [isArabic]);

  const getTypeLabel = useCallback((type: string) => {
    const map: Record<string, { ar: string; en: string; icon: any }> = {
      percentage: { ar: "نسبة مئوية", en: "Percentage", icon: Percent },
      fixed: { ar: "قيمة ثابتة", en: "Fixed", icon: DollarSign },
      free_shipping: { ar: "توصيل مجاني", en: "Free Shipping", icon: Truck },
    };
    return map[type] || map.percentage;
  }, []);

  const getTypeColor = useCallback((type: string) => {
    const map: Record<string, string> = {
      percentage: "bg-[#0d2e2a]/10 text-[#0d2e2a] border-[#0d2e2a]/20",
      fixed: "bg-[#1a4f4a]/10 text-[#1a4f4a] border-[#1a4f4a]/20",
      free_shipping: "bg-[#2d6b63]/10 text-[#2d6b63] border-[#2d6b63]/20",
    };
    return map[type] || "bg-slate-500/10 text-slate-600";
  }, []);

  const getStatusColor = useCallback((code: PromoCode) => {
    if (!code.is_active) return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
    return "bg-[#2d6b63]/10 text-[#2d6b63] border-[#2d6b63]/20";
  }, []);

  const getStatusLabel = useCallback((code: PromoCode) => {
    if (!code.is_active) return isArabic ? "غير نشط" : "Inactive";
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return isArabic ? "منتهي الصلاحية" : "Expired";
    }
    return isArabic ? "نشط" : "Active";
  }, [isArabic]);

  const formatDate = useCallback((date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleString(
      isArabic ? "ar-SA" : "en-US",
      { 
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
      }
    );
  }, [isArabic]);

  // ✅ ===== Mutations =====
  const createMutation = useCreatePromoCode();
  const updateMutation = useUpdatePromoCode();
  const deleteMutation = useDeletePromoCode();
  const toggleMutation = useTogglePromoCodeStatus();

  // ✅ Form state
  const [formData, setFormData] = useState({
    code: "",
    label: "",
    description: "",
    type: "percentage" as any,
    value: "",
    min_order: "0",
    max_discount: "",
    usage_limit: "1",
    is_active: true,
    is_public: false,
    expires_at: "",
    store_id: "",
    store_name: "",
  });

  const resetForm = useCallback(() => {
    setFormData({
      code: "",
      label: "",
      description: "",
      type: "percentage",
      value: "",
      min_order: "0",
      max_discount: "",
      usage_limit: "1",
      is_active: true,
      is_public: false,
      expires_at: "",
      store_id: "",
      store_name: "",
    });
    setIsStoreSpecific(false);
    setSelectedStoreId("");
    setSearchStore("");
  }, []);

  // ============================================================
  // ✅ معالجة النماذج
  // ============================================================

const handleAddCode = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    if (isStoreSpecific && !selectedStoreId) {
      toast.error(isArabic ? "⚠️ يرجى اختيار متجر للكود المخصص" : "⚠️ Please select a store for specific code");
      setIsSubmitting(false);
      return;
    }

    const selectedStore = activeStores.find((s: any) => s.id === selectedStoreId);
    const storeName = selectedStore?.store_name || null;

    // ✅ تحويل expires_at للصيغة الصحيحة
    let expiresAt = formData.expires_at || null;
    if (expiresAt) {
      const date = new Date(expiresAt);
      expiresAt = date.toISOString();
    }

    await createMutation.mutateAsync({
      code: formData.code,
      label: formData.label,
      description: formData.description,
      type: formData.type,
      value: parseFloat(formData.value),
      min_order: parseFloat(formData.min_order) || 0,
      max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
      usage_limit: parseInt(formData.usage_limit) || 1,
      is_active: formData.is_active,
      is_public: formData.is_public,
      expires_at: expiresAt,
      created_by: app.user?.id,
      metadata: {},
      store_id: isStoreSpecific ? selectedStoreId : null,
      store_name: isStoreSpecific ? storeName : null,
    });

    toast.success(isArabic ? "✅ تم إضافة الكود بنجاح" : "✅ Code added successfully");
    setShowAddDialog(false);
    resetForm();
  } catch (error: any) {
    toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

const handleEditCode = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!selectedCode) return;
  setIsSubmitting(true);

  try {
    if (isStoreSpecific && !selectedStoreId) {
      toast.error(isArabic ? "⚠️ يرجى اختيار متجر للكود المخصص" : "⚠️ Please select a store for specific code");
      setIsSubmitting(false);
      return;
    }

    const selectedStore = activeStores.find((s: any) => s.id === selectedStoreId);
    const storeName = selectedStore?.store_name || null;

    // ✅ تحويل expires_at للصيغة الصحيحة
    let expiresAt = formData.expires_at || null;
    if (expiresAt) {
      const date = new Date(expiresAt);
      expiresAt = date.toISOString();
    }

    await updateMutation.mutateAsync({
      id: selectedCode.id,
      data: {
        code: formData.code,
        label: formData.label,
        description: formData.description,
        type: formData.type,
        value: parseFloat(formData.value),
        min_order: parseFloat(formData.min_order) || 0,
        max_discount: formData.max_discount ? parseFloat(formData.max_discount) : null,
        usage_limit: parseInt(formData.usage_limit) || 1,
        is_active: formData.is_active,
        is_public: formData.is_public,
        expires_at: expiresAt,
        metadata: {},
        store_id: isStoreSpecific ? selectedStoreId : null,
        store_name: isStoreSpecific ? storeName : null,
      },
    });

    toast.success(isArabic ? "✅ تم تحديث الكود بنجاح" : "✅ Code updated successfully");
    setShowEditDialog(false);
    setSelectedCode(null);
    resetForm();
  } catch (error: any) {
    toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  const handleDeleteCode = async () => {
    if (!selectedCode) return;
    setIsSubmitting(true);

    try {
      await deleteMutation.mutateAsync(selectedCode.id);
      toast.success(isArabic ? "✅ تم حذف الكود بنجاح" : "✅ Code deleted successfully");
      setShowDeleteDialog(false);
      setSelectedCode(null);
    } catch (error: any) {
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (code: PromoCode) => {
    try {
      await toggleMutation.mutateAsync({
        id: code.id,
        isActive: !code.is_active,
      });
      toast.success(
        isArabic
          ? code.is_active ? "❌ تم تعطيل الكود" : "✅ تم تفعيل الكود"
          : code.is_active ? "❌ Code deactivated" : "✅ Code activated"
      );
    } catch (error: any) {
      toast.error(isArabic ? `❌ ${error.message}` : `❌ ${error.message}`);
    }
  };

  // ============================================================
  // ✅ فتح نافذة التعديل مع تعبئة الحقول
  // ============================================================

const openEditDialog = useCallback((code: PromoCode) => {
  setSelectedCode(code);
  const metadata = code.metadata || {};
  
  const isSpecific = !!code.store_id;
  setIsStoreSpecific(isSpecific);
  setSelectedStoreId(code.store_id || "");

  // ✅ تحويل التاريخ للصيغة الصحيحة للعرض
  let formattedExpiresAt = "";
  if (code.expires_at) {
    const date = new Date(code.expires_at);
    formattedExpiresAt = date.toISOString().slice(0, 16);
  }

  setFormData({
    code: code.code,
    label: code.label || "",
    description: code.description || "",
    type: code.type,
    value: String(code.value),
    min_order: String(code.min_order || 0),
    max_discount: code.max_discount ? String(code.max_discount) : "",
    usage_limit: String(code.usage_limit || 1),
    is_active: code.is_active,
    is_public: code.is_public || false,
    expires_at: formattedExpiresAt,
    store_id: code.store_id || "",
    store_name: code.store_name || "",
  });
  
  setShowEditDialog(true);
}, []);
  // ============================================================
  // ✅ التصميم - الواجهة الرئيسية
  // ============================================================

  return (
    <div className="space-y-6">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
              <Tag className="h-5 w-5 text-white animate-float" />
            </div>
            <span className="bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] bg-clip-text text-transparent">
              {isArabic ? "أكواد الخصم" : "Promo Codes"}
            </span>
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 animate-pulse" />
              {isArabic ? 'مباشر' : 'Live'}
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {isArabic
              ? `إدارة أكواد الخصم والعروض الترويجية (${totalCount} كود)`
              : `Manage promo codes and offers (${totalCount} codes)`}
            <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
            <span className="text-xs text-[#2d6b63] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isArabic ? 'تحديث لحظي' : 'Live'}
            </span>
          </p>
        </div>
        
        <Button
          className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0d2e2a]/30 rounded-xl px-5"
          onClick={() => {
            resetForm();
            setShowAddDialog(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {isArabic ? "إضافة كود جديد" : "Add New Code"}
        </Button>
      </div>

      {/* ===== STATS ===== */}
      <StatsCards stats={stats} />

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm group">
          <Search className={`absolute inset-y-0 my-auto ${isArabic ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#0d2e2a] transition-colors duration-300`} />
          <Input
            placeholder={isArabic ? "🔍 بحث عن كود..." : "🔍 Search code..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute ${isArabic ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-[#0d2e2a]" />
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40 h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 hover:border-[#0d2e2a]/40 transition-colors">
              <SelectValue placeholder={isArabic ? "جميع الأنواع" : "All types"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? "📋 جميع الأنواع" : "📋 All types"}</SelectItem>
              <SelectItem value="percentage">{isArabic ? "📊 نسبة مئوية" : "📊 Percentage"}</SelectItem>
              <SelectItem value="fixed">{isArabic ? "💰 قيمة ثابتة" : "💰 Fixed"}</SelectItem>
              <SelectItem value="free_shipping">{isArabic ? "🚚 توصيل مجاني" : "🚚 Free Shipping"}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 hover:border-[#0d2e2a]/40 transition-colors">
              <SelectValue placeholder={isArabic ? "جميع الحالات" : "All status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{isArabic ? "📋 جميع الحالات" : "📋 All status"}</SelectItem>
              <SelectItem value="active">{isArabic ? "✅ نشط" : "✅ Active"}</SelectItem>
              <SelectItem value="inactive">{isArabic ? "❌ غير نشط" : "❌ Inactive"}</SelectItem>
              <SelectItem value="expired">{isArabic ? "⏰ منتهي" : "⏰ Expired"}</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-xl hover:bg-[#0d2e2a]/10 transition-all duration-300 hover:scale-105"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-4 w-4 text-[#0d2e2a] animate-spin-slow" />
          </Button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent" />
            <span className="text-slate-500">{isArabic ? "جار التحميل..." : "Loading..."}</span>
          </div>
        </div>
      ) : codes.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border border-dashed border-[#0d2e2a]/30 shadow-lg">
          <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Tag className="h-10 w-10 text-[#0d2e2a]/40" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {searchQuery
              ? isArabic ? "لا توجد نتائج" : "No results found"
              : isArabic ? "لا توجد أكواد خصم" : "No promo codes"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? isArabic ? `لا توجد أكواد تطابق "${searchQuery}"` : `No codes match "${searchQuery}"`
              : isArabic ? "قم بإضافة أول كود خصم" : "Add your first promo code"}
          </p>
          {!searchQuery && (
            <Button
              className="mt-4 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0d2e2a]/30 rounded-xl"
              onClick={() => {
                resetForm();
                setShowAddDialog(true);
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              {isArabic ? "إضافة كود" : "Add Code"}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 overflow-hidden shadow-lg shadow-[#0d2e2a]/5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 hover:bg-transparent bg-gradient-to-r from-[#0d2e2a]/5 to-[#1a4f4a]/5">
                    <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5" />
                        {isArabic ? "الكود" : "Code"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5" />
                        {isArabic ? "الاسم / النوع" : "Label / Type"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                      <div className="flex items-center gap-2">
                        <Gift className="h-3.5 w-3.5" />
                        {isArabic ? "النوع" : "Type"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3.5 w-3.5" />
                        {isArabic ? "القيمة" : "Value"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5" />
                        {isArabic ? "الاستخدامات" : "Uses"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                      <div className="flex items-center gap-2">
                        <Shield className="h-3.5 w-3.5" />
                        {isArabic ? "الحالة" : "Status"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95]">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {isArabic ? "الصلاحية" : "Expires"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-end">
                      <div className="flex items-center justify-end gap-2">
                        <Zap className="h-3.5 w-3.5 animate-pulse" />
                        {isArabic ? "إجراءات" : "Actions"}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {codes.map((code: PromoCode) => (
                    <PromoCodeRow
                      key={code.id}
                      code={code}
                      onEdit={openEditDialog}
                      onDelete={(c: PromoCode) => {
                        setSelectedCode(c);
                        setShowDeleteDialog(true);
                      }}
                      onToggle={handleToggleStatus}
                      onCopy={copyCode}
                      isArabic={isArabic}
                      currency={app.currency}
                      getTypeLabel={getTypeLabel}
                      getTypeColor={getTypeColor}
                      getStatusColor={getStatusColor}
                      getStatusLabel={getStatusLabel}
                      formatDate={formatDate}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {hasNextPage && (
            <div className="flex justify-center pt-4">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    {isArabic ? "جار التحميل..." : "Loading..."}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {isArabic ? "تحميل المزيد" : "Load More"}
                  </>
                )}
              </Button>
            </div>
          )}

          <div className="text-center text-sm text-muted-foreground pt-2">
            {isArabic
              ? `عرض ${codes.length} من ${totalCount} كود`
              : `Showing ${codes.length} of ${totalCount} codes`}
          </div>
        </>
      )}

      {/* ===== DIALOG: إضافة كود ===== */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              {isArabic ? "إضافة كود خصم جديد" : "Add New Promo Code"}
            </DialogTitle>
            <DialogDescription>
              {isArabic ? "أدخل معلومات كود الخصم الجديد" : "Enter the new promo code information"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddCode} className="space-y-4">
            {/* الكود والاسم */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                  {isArabic ? "الكود *" : "Code *"}
                </Label>
                <Input
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder={isArabic ? "مثال: SUMMER25" : "Example: SUMMER25"}
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 font-mono text-lg"
                />
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "أحرف كبيرة وأرقام فقط" : "Uppercase letters and numbers only"}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                  {isArabic ? "الاسم *" : "Label *"}
                </Label>
                <Input
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  placeholder={isArabic ? "مثال: خصم الصيف" : "Example: Summer Sale"}
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            {/* الوصف */}
            <div className="space-y-2">
              <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                {isArabic ? "الوصف" : "Description"}
              </Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={isArabic ? "وصف الكود" : "Code description"}
                className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 min-h-[60px]"
              />
            </div>

            {/* النوع والقيمة والحد الأدنى */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                  {isArabic ? "النوع *" : "Type *"}
                </Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger className="rounded-xl border-[#0d2e2a]/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">{isArabic ? "📊 نسبة مئوية" : "📊 Percentage"}</SelectItem>
                    <SelectItem value="fixed">{isArabic ? "💰 قيمة ثابتة" : "💰 Fixed"}</SelectItem>
                    <SelectItem value="free_shipping">{isArabic ? "🚚 توصيل مجاني" : "🚚 Free Shipping"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                  {isArabic ? "القيمة *" : "Value *"}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder={formData.type === "percentage" ? "10" : "10.00"}
                  required
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                  {isArabic ? "الحد الأدنى للطلب" : "Min Order"}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.min_order}
                  onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                  placeholder="0"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
                />
              </div>
            </div>

            {/* الحد الأقصى وحد الاستخدامات */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                  {isArabic ? "الحد الأقصى للخصم" : "Max Discount"}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.max_discount}
                  onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                  placeholder={isArabic ? "غير محدود" : "Unlimited"}
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                  {isArabic ? "حد الاستخدامات" : "Usage Limit"}
                </Label>
                <Input
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                  placeholder="1"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
                />
                <p className="text-xs text-muted-foreground">
                  {isArabic ? "عدد مرات استخدام الكود" : "Number of times code can be used"}
                </p>
              </div>
            </div>

            {/* ✅ ✅ ✅ حقل تاريخ الانتهاء الاحترافي مع الوقت */}
            <div className="space-y-2">
              <Label className="text-[#0d2e2a] dark:text-white font-semibold flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-[#2a655f]" />
                {isArabic ? "تاريخ ووقت الانتهاء" : "Expiry Date & Time"}
              </Label>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-xl border-[#0d2e2a]/20 hover:border-[#2a655f]/40 transition-all duration-300 h-12",
                          !formData.expires_at && "text-muted-foreground"
                        )}
                      >
                        <Calendar className="mr-2 h-4 w-4 text-[#2a655f]" />
                        {formData.expires_at ? (
                          formatDate(formData.expires_at)
                        ) : (
                          <span>{isArabic ? "اختر التاريخ" : "Select date"}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={formData.expires_at ? new Date(formData.expires_at) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const currentTime = formData.expires_at ? new Date(formData.expires_at) : new Date();
                            const newDate = new Date(date);
                            newDate.setHours(currentTime.getHours());
                            newDate.setMinutes(currentTime.getMinutes());
                            setFormData({ 
                              ...formData, 
                              expires_at: newDate.toISOString() 
                            });
                          } else {
                            setFormData({ ...formData, expires_at: "" });
                          }
                        }}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="rounded-2xl"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex-shrink-0">
                  <CustomTimePicker
                    value={formData.expires_at ? new Date(formData.expires_at).toTimeString().slice(0, 5) : ""}
                    onChange={(time) => {
                      if (formData.expires_at) {
                        const date = new Date(formData.expires_at);
                        const [hours, minutes] = time.split(":").map(Number);
                        date.setHours(hours || 0);
                        date.setMinutes(minutes || 0);
                        setFormData({ ...formData, expires_at: date.toISOString() });
                      } else {
                        const date = new Date();
                        const [hours, minutes] = time.split(":").map(Number);
                        date.setHours(hours || 0);
                        date.setMinutes(minutes || 0);
                        setFormData({ ...formData, expires_at: date.toISOString() });
                      }
                    }}
                    isArabic={isArabic}
                  />
                </div>
              </div>

              {formData.expires_at && (
                <div className="flex items-center gap-2 p-3 bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/20">
                  <Timer className="h-4 w-4 text-[#2a655f] animate-pulse" />
                  <span className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                    {isArabic ? "ينتهي في: " : "Expires at: "}
                  </span>
                  <span className="text-sm font-bold text-[#2a655f]">
                    {new Date(formData.expires_at).toLocaleString(
                      isArabic ? "ar-SA" : "en-US",
                      { 
                        weekday: "short",
                        year: "numeric", 
                        month: "short", 
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      }
                    )}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-red-100 transition-colors ml-auto"
                    onClick={() => setFormData({ ...formData, expires_at: "" })}
                  >
                    <X className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Info className="h-3 w-3" />
                {isArabic 
                  ? "📅 اختر تاريخ ووقت الانتهاء (اتركه فارغاً للصلاحية الدائمة)" 
                  : "📅 Select expiry date & time (leave empty for unlimited)"}
              </p>
            </div>

            {/* ✅ ✅ ✅ خيار الكود العام / المخصص */}
            <div className="space-y-3 pt-2">
              <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                {isArabic ? "نوع الكود" : "Code Type"}
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    !isStoreSpecific
                      ? "border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20"
                      : "border-[#0d2e2a]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5"
                  )}
                >
                  <input
                    type="radio"
                    checked={!isStoreSpecific}
                    onChange={() => {
                      setIsStoreSpecific(false);
                      setSelectedStoreId("");
                    }}
                    className="mt-1 h-4 w-4 accent-[#2a655f]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-[#2a655f]" />
                      <span className="font-semibold text-sm">{isArabic ? "🌐 كود عام" : "🌐 Public Code"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isArabic ? "ينطبق على جميع المتاجر" : "Applies to all stores"}
                    </p>
                  </div>
                </label>

                <label
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    isStoreSpecific
                      ? "border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20"
                      : "border-[#0d2e2a]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5"
                  )}
                >
                  <input
                    type="radio"
                    checked={isStoreSpecific}
                    onChange={() => setIsStoreSpecific(true)}
                    className="mt-1 h-4 w-4 accent-[#2a655f]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-[#2a655f]" />
                      <span className="font-semibold text-sm">{isArabic ? "🏪 كود مخصص" : "🏪 Specific Code"}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isArabic ? "ينطبق على متجر معين" : "Applies to a specific store"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* ✅ اختيار المتجر (يظهر فقط عند اختيار مخصص) */}
            {isStoreSpecific && (
              <div className="space-y-2 p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
                <Label className="text-[#0d2e2a] dark:text-white font-semibold flex items-center gap-2">
                  <Store className="h-4 w-4 text-[#2a655f]" />
                  {isArabic ? "اختر المتجر المستهدف *" : "Select Target Store *"}
                </Label>
                
                {/* ✅ حقل البحث عن المتجر */}
                <div className="relative">
                  <Search className="absolute inset-y-0 my-auto left-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={isArabic ? "🔍 بحث بالاسم أو رقم الجوال..." : "🔍 Search by name or phone..."}
                    value={searchStore}
                    onChange={(e) => setSearchStore(e.target.value)}
                    className="pl-9 rounded-xl border-[#0d2e2a]/20"
                  />
                </div>
                
                {storesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-[#2a655f]" />
                  </div>
                ) : filteredStores.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {searchStore 
                      ? (isArabic ? "❌ لا توجد متاجر تطابق البحث" : "❌ No stores match search")
                      : (isArabic ? "❌ لا توجد متاجر نشطة" : "❌ No active stores")}
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto space-y-2 border rounded-xl p-2 bg-white dark:bg-slate-950">
                    {filteredStores.map((store: any) => (
                      <label
                        key={store.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300",
                          selectedStoreId === store.id
                            ? "border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20"
                            : "border-[#0d2e2a]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5"
                        )}
                      >
                        <input
                          type="radio"
                          name="store"
                          value={store.id}
                          checked={selectedStoreId === store.id}
                          onChange={() => setSelectedStoreId(store.id)}
                          className="h-4 w-4 accent-[#2a655f]"
                        />
                        
                        <div className="flex-shrink-0">
                          {store.store_logo_url ? (
                            <img 
                              src={store.store_logo_url} 
                              alt="" 
                              className="h-10 w-10 rounded-xl object-cover border border-[#0d2e2a]/20"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 flex items-center justify-center">
                              <Store className="h-5 w-5 text-[#2a655f]" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                            {store.store_name || store.full_name}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            {store.store_phone || store.phone ? (
                              <span className="flex items-center gap-1">
                                <span className="text-[#2a655f]">📞</span>
                                {store.store_phone || store.phone}
                              </span>
                            ) : (
                              <span className="text-muted-foreground/50">
                                {isArabic ? "رقم غير متاح" : "No phone"}
                              </span>
                            )}
                            <Badge className="text-[9px] bg-[#2d6b63]/10 text-[#2d6b63] border-0">
                              {store.listing_count || 0} {isArabic ? "منتج" : "products"}
                            </Badge>
                          </div>
                        </div>
                        
                        {selectedStoreId === store.id && (
                          <Check className="h-5 w-5 text-[#2a655f] flex-shrink-0" />
                        )}
                      </label>
                    ))}
                    
                    <div className="text-xs text-muted-foreground text-center pt-2 border-t border-[#0d2e2a]/10">
                      {isArabic 
                        ? `عرض ${filteredStores.length} من ${activeStores.length} متجر`
                        : `Showing ${filteredStores.length} of ${activeStores.length} stores`}
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="h-3 w-3" />
                  {isArabic 
                    ? "💡 اختر المتجر الذي سينطبق عليه الكود (يمكنك البحث بالاسم أو رقم الجوال)"
                    : "💡 Select the store where this code will apply (search by name or phone)"}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 pt-2">
              <div className="flex items-center gap-3 p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-colors">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  className="data-[state=checked]:bg-[#2d6b63]"
                />
                <Label className="cursor-pointer text-sm text-[#0d2e2a] dark:text-white">
                  {isArabic ? "🟢 الكود نشط" : "🟢 Code is active"}
                </Label>
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
                className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0d2e2a]/30 rounded-xl px-6"
                disabled={isSubmitting || (isStoreSpecific && !selectedStoreId)}
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <>
                    <Tag className="h-4 w-4 mr-1.5" />
                    {isArabic ? "إضافة الكود" : "Add Code"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    {/* ===== DIALOG: تعديل كود (مطابق لفورم الإضافة) ===== */}
<Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
  <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10">
    <DialogHeader>
      <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-3">
        <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#1a4f4a] to-[#2d6b63] flex items-center justify-center">
          <Edit className="h-4 w-4 text-white" />
        </div>
        {isArabic ? "تعديل كود الخصم" : "Edit Promo Code"}
      </DialogTitle>
      <DialogDescription>
        {isArabic ? `تعديل كود "${selectedCode?.code}"` : `Editing code "${selectedCode?.code}"`}
      </DialogDescription>
    </DialogHeader>
    
    <form onSubmit={handleEditCode} className="space-y-4">
      {/* الكود والاسم */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#0d2e2a] dark:text-white font-semibold">
            {isArabic ? "الكود *" : "Code *"}
          </Label>
          <Input
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
            placeholder={isArabic ? "مثال: SUMMER25" : "Example: SUMMER25"}
            required
            className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 font-mono text-lg"
          />
          <p className="text-xs text-muted-foreground">
            {isArabic ? "أحرف كبيرة وأرقام فقط" : "Uppercase letters and numbers only"}
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-[#0d2e2a] dark:text-white font-semibold">
            {isArabic ? "الاسم *" : "Label *"}
          </Label>
          <Input
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder={isArabic ? "مثال: خصم الصيف" : "Example: Summer Sale"}
            required
            className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
          />
        </div>
      </div>

      {/* الوصف */}
      <div className="space-y-2">
        <Label className="text-[#0d2e2a] dark:text-white font-semibold">
          {isArabic ? "الوصف" : "Description"}
        </Label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder={isArabic ? "وصف الكود" : "Code description"}
          className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 min-h-[60px]"
        />
      </div>

      {/* النوع والقيمة والحد الأدنى */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-[#0d2e2a] dark:text-white font-semibold">
            {isArabic ? "النوع *" : "Type *"}
          </Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="rounded-xl border-[#0d2e2a]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">{isArabic ? "📊 نسبة مئوية" : "📊 Percentage"}</SelectItem>
              <SelectItem value="fixed">{isArabic ? "💰 قيمة ثابتة" : "💰 Fixed"}</SelectItem>
              <SelectItem value="free_shipping">{isArabic ? "🚚 توصيل مجاني" : "🚚 Free Shipping"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-[#0d2e2a] dark:text-white font-semibold">
            {isArabic ? "القيمة *" : "Value *"}
          </Label>
          <Input
            type="number"
            step="0.01"
            value={formData.value}
            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
            placeholder={formData.type === "percentage" ? "10" : "10.00"}
            required
            className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#0d2e2a] dark:text-white font-semibold">
            {isArabic ? "الحد الأدنى للطلب" : "Min Order"}
          </Label>
          <Input
            type="number"
            step="0.01"
            value={formData.min_order}
            onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
            placeholder="0"
            className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
          />
        </div>
      </div>

      {/* الحد الأقصى وحد الاستخدامات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-[#0d2e2a] dark:text-white font-semibold">
            {isArabic ? "الحد الأقصى للخصم" : "Max Discount"}
          </Label>
          <Input
            type="number"
            step="0.01"
            value={formData.max_discount}
            onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
            placeholder={isArabic ? "غير محدود" : "Unlimited"}
            className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-[#0d2e2a] dark:text-white font-semibold">
            {isArabic ? "حد الاستخدامات" : "Usage Limit"}
          </Label>
          <Input
            type="number"
            value={formData.usage_limit}
            onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
            placeholder="1"
            className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
          />
          <p className="text-xs text-muted-foreground">
            {isArabic ? "عدد مرات استخدام الكود" : "Number of times code can be used"}
          </p>
        </div>
      </div>

      {/* ✅ حقل تاريخ الانتهاء الاحترافي مع الوقت */}
      <div className="space-y-2">
        <Label className="text-[#0d2e2a] dark:text-white font-semibold flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-[#2a655f]" />
          {isArabic ? "تاريخ ووقت الانتهاء" : "Expiry Date & Time"}
        </Label>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal rounded-xl border-[#0d2e2a]/20 hover:border-[#2a655f]/40 transition-all duration-300 h-12",
                    !formData.expires_at && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4 text-[#2a655f]" />
                  {formData.expires_at ? (
                    formatDate(formData.expires_at)
                  ) : (
                    <span>{isArabic ? "اختر التاريخ" : "Select date"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10" align="start">
                <CalendarComponent
                  mode="single"
                  selected={formData.expires_at ? new Date(formData.expires_at) : undefined}
                  onSelect={(date) => {
                    if (date) {
                      const currentTime = formData.expires_at ? new Date(formData.expires_at) : new Date();
                      const newDate = new Date(date);
                      newDate.setHours(currentTime.getHours());
                      newDate.setMinutes(currentTime.getMinutes());
                      setFormData({ ...formData, expires_at: newDate.toISOString() });
                    } else {
                      setFormData({ ...formData, expires_at: "" });
                    }
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex-shrink-0">
            <CustomTimePicker
              value={formData.expires_at ? new Date(formData.expires_at).toTimeString().slice(0, 5) : ""}
              onChange={(time) => {
                if (formData.expires_at) {
                  const date = new Date(formData.expires_at);
                  const [hours, minutes] = time.split(":").map(Number);
                  date.setHours(hours || 0);
                  date.setMinutes(minutes || 0);
                  setFormData({ ...formData, expires_at: date.toISOString() });
                } else {
                  const date = new Date();
                  const [hours, minutes] = time.split(":").map(Number);
                  date.setHours(hours || 0);
                  date.setMinutes(minutes || 0);
                  setFormData({ ...formData, expires_at: date.toISOString() });
                }
              }}
              isArabic={isArabic}
            />
          </div>
        </div>

        {formData.expires_at && (
          <div className="flex items-center gap-2 p-3 bg-[#2a655f]/10 rounded-xl border border-[#2a655f]/20">
            <Timer className="h-4 w-4 text-[#2a655f] animate-pulse" />
            <span className="text-sm font-medium text-[#0d2e2a] dark:text-white">
              {isArabic ? "ينتهي في: " : "Expires at: "}
            </span>
            <span className="text-sm font-bold text-[#2a655f]">
              {new Date(formData.expires_at).toLocaleString(
                isArabic ? "ar-SA" : "en-US",
                { 
                  weekday: "short",
                  year: "numeric", 
                  month: "short", 
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true
                }
              )}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-red-100 transition-colors ml-auto"
              onClick={() => setFormData({ ...formData, expires_at: "" })}
            >
              <X className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
            </Button>
          </div>
        )}

        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="h-3 w-3" />
          {isArabic 
            ? "📅 اختر تاريخ ووقت الانتهاء (اتركه فارغاً للصلاحية الدائمة)" 
            : "📅 Select expiry date & time (leave empty for unlimited)"}
        </p>
      </div>

      {/* ✅ خيار الكود العام / المخصص */}
      <div className="space-y-3 pt-2">
        <Label className="text-[#0d2e2a] dark:text-white font-semibold">
          {isArabic ? "نوع الكود" : "Code Type"}
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
              !isStoreSpecific
                ? "border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20"
                : "border-[#0d2e2a]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5"
            )}
          >
            <input
              type="radio"
              checked={!isStoreSpecific}
              onChange={() => {
                setIsStoreSpecific(false);
                setSelectedStoreId("");
              }}
              className="mt-1 h-4 w-4 accent-[#2a655f]"
            />
            <div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#2a655f]" />
                <span className="font-semibold text-sm">{isArabic ? "🌐 كود عام" : "🌐 Public Code"}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isArabic ? "ينطبق على جميع المتاجر" : "Applies to all stores"}
              </p>
            </div>
          </label>

          <label
            className={cn(
              "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
              isStoreSpecific
                ? "border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20"
                : "border-[#0d2e2a]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5"
            )}
          >
            <input
              type="radio"
              checked={isStoreSpecific}
              onChange={() => setIsStoreSpecific(true)}
              className="mt-1 h-4 w-4 accent-[#2a655f]"
            />
            <div>
              <div className="flex items-center gap-2">
                <Store className="h-4 w-4 text-[#2a655f]" />
                <span className="font-semibold text-sm">{isArabic ? "🏪 كود مخصص" : "🏪 Specific Code"}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isArabic ? "ينطبق على متجر معين" : "Applies to a specific store"}
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* ✅ اختيار المتجر */}
      {isStoreSpecific && (
        <div className="space-y-2 p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
          <Label className="text-[#0d2e2a] dark:text-white font-semibold flex items-center gap-2">
            <Store className="h-4 w-4 text-[#2a655f]" />
            {isArabic ? "اختر المتجر المستهدف *" : "Select Target Store *"}
          </Label>
          
          <div className="relative">
            <Search className="absolute inset-y-0 my-auto left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isArabic ? "🔍 بحث بالاسم أو رقم الجوال..." : "🔍 Search by name or phone..."}
              value={searchStore}
              onChange={(e) => setSearchStore(e.target.value)}
              className="pl-9 rounded-xl border-[#0d2e2a]/20"
            />
          </div>
          
          {storesLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#2a655f]" />
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {searchStore 
                ? (isArabic ? "❌ لا توجد متاجر تطابق البحث" : "❌ No stores match search")
                : (isArabic ? "❌ لا توجد متاجر نشطة" : "❌ No active stores")}
            </div>
          ) : (
            <div className="max-h-60 overflow-y-auto space-y-2 border rounded-xl p-2 bg-white dark:bg-slate-950">
              {filteredStores.map((store: any) => (
                <label
                  key={store.id}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300",
                    selectedStoreId === store.id
                      ? "border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20"
                      : "border-[#0d2e2a]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5"
                  )}
                >
                  <input
                    type="radio"
                    name="store-edit"
                    value={store.id}
                    checked={selectedStoreId === store.id}
                    onChange={() => setSelectedStoreId(store.id)}
                    className="h-4 w-4 accent-[#2a655f]"
                  />
                  
                  <div className="flex-shrink-0">
                    {store.store_logo_url ? (
                      <img 
                        src={store.store_logo_url} 
                        alt="" 
                        className="h-10 w-10 rounded-xl object-cover border border-[#0d2e2a]/20"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f]/20 to-[#3a8a82]/20 flex items-center justify-center">
                        <Store className="h-5 w-5 text-[#2a655f]" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {store.store_name || store.full_name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {store.store_phone || store.phone ? (
                        <span className="flex items-center gap-1">
                          <span className="text-[#2a655f]">📞</span>
                          {store.store_phone || store.phone}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/50">
                          {isArabic ? "رقم غير متاح" : "No phone"}
                        </span>
                      )}
                      <Badge className="text-[9px] bg-[#2d6b63]/10 text-[#2d6b63] border-0">
                        {store.listing_count || 0} {isArabic ? "منتج" : "products"}
                      </Badge>
                    </div>
                  </div>
                  
                  {selectedStoreId === store.id && (
                    <Check className="h-5 w-5 text-[#2a655f] flex-shrink-0" />
                  )}
                </label>
              ))}
              
              <div className="text-xs text-muted-foreground text-center pt-2 border-t border-[#0d2e2a]/10">
                {isArabic 
                  ? `عرض ${filteredStores.length} من ${activeStores.length} متجر`
                  : `Showing ${filteredStores.length} of ${activeStores.length} stores`}
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            {isArabic 
              ? "💡 اختر المتجر الذي سينطبق عليه الكود (يمكنك البحث بالاسم أو رقم الجوال)"
              : "💡 Select the store where this code will apply (search by name or phone)"}
          </p>
        </div>
      )}

      {/* ✅ أزرار التفعيل */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4 pt-2">
        <div className="flex items-center gap-3 p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-colors">
          <Switch
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            className="data-[state=checked]:bg-[#2d6b63]"
          />
          <Label className="cursor-pointer text-sm text-[#0d2e2a] dark:text-white">
            {isArabic ? "🟢 الكود نشط" : "🟢 Code is active"}
          </Label>
        </div>
      </div>

      <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowEditDialog(false)}
          className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300"
        >
          <X className="h-4 w-4 mr-1" />
          {isArabic ? "إلغاء" : "Cancel"}
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-[#1a4f4a] to-[#2d6b63] hover:from-[#2d6b63] hover:to-[#4a9f95] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#1a4f4a]/30 rounded-xl px-6"
          disabled={isSubmitting || (isStoreSpecific && !selectedStoreId)}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4 mr-1.5" />
              {isArabic ? "حفظ التغييرات" : "Save Changes"}
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  </DialogContent>
</Dialog>

      {/* ===== DIALOG: حذف كود ===== */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rounded-2xl border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-rose-500 flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-rose-500" />
              </div>
              {isArabic ? "حذف الكود" : "Delete Code"}
            </DialogTitle>
            <DialogDescription>
              {isArabic ? `هل أنت متأكد من حذف كود "${selectedCode?.code}"؟` : `Are you sure you want to delete code "${selectedCode?.code}"?`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-xl border border-rose-200 dark:border-rose-800/30">
              <p className="text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {isArabic ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
              </p>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteCode}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white transition-all duration-300 hover:scale-105 rounded-xl px-6"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  {isArabic ? "حذف نهائي" : "Delete Permanently"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AdminPromoCodes;