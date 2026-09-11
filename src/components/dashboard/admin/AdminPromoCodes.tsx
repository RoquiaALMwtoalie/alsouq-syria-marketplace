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
  Check, AlertTriangle,
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
// 🎨 ZOOQ BRAND COLORS - نفس ألوان AdminStores
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
  fuchsiaGlow: 'rgba(216,27,96,0.2)',
};

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
        <SelectTrigger className="w-20 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-mono text-base hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700">
          {hourOptions.map((h) => (
            <SelectItem key={h} value={h} className="text-center font-mono hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-xl font-bold text-slate-600 dark:text-slate-300">:</span>

      <Select
        value={minutes}
        onValueChange={(v) => {
          setMinutes(v);
          updateTime(hours, v, period);
        }}
      >
        <SelectTrigger className="w-20 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-center font-mono text-base hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-700">
          {minuteOptions.map((m) => (
            <SelectItem key={m} value={m} className="text-center font-mono hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
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
        <SelectTrigger className="w-24 h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-center text-sm font-medium hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700">
          <SelectItem value="AM" className="font-medium hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
            {isArabic ? "صباحاً" : "AM"}
          </SelectItem>
          <SelectItem value="PM" className="font-medium hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
            {isArabic ? "مساءً" : "PM"}
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ============================================================
// ✅ مكون إحصائيات سريعة - بنفس تصميم AdminOverview (بوردر زهري)
// ============================================================
const StatsCards = React.memo(({ stats }: { stats: any }) => {
  const app = useApp();
  const isArabic = app.lang === "ar";

  const items = useMemo(() => [
    { 
      label: isArabic ? "📊 الإجمالي" : "📊 Total", 
      value: stats.total, 
      icon: Tag,
      gradient: "from-[#2a655f] to-[#1a4f4a]",
    },
    { 
      label: isArabic ? "✅ نشط" : "✅ Active", 
      value: stats.active, 
      icon: Shield,
      gradient: "from-emerald-500 to-teal-500",
    },
    { 
      label: isArabic ? "⏰ منتهي" : "⏰ Expired", 
      value: stats.expired, 
      icon: Clock,
      gradient: "from-amber-500 to-orange-500",
    },
    { 
      label: isArabic ? "📈 مستخدم" : "📈 Used", 
      value: stats.used, 
      icon: Users,
      gradient: "from-[#d81b60] to-[#f9a8d4]",
    },
  ], [stats, isArabic]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((item) => (
        <div 
          key={item.label} 
          className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" />
          </div>
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">{item.value}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
              <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${item.gradient} flex items-center justify-center`}>
                <item.icon className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </div>
          <div className="mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-1000 animate-shimmer`} 
              style={{ width: `${Math.min(100, (item.value / (stats.total || 1)) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});
StatsCards.displayName = 'StatsCards';

// ============================================================
// ✅ مكون صف الجدول - مع هوفر رمادي فاتح
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
    <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60">
      <TableCell className="border-r-2 border-slate-200/60 dark:border-slate-700/60">
        <button
          onClick={() => onCopy(code.code)}
          className="flex items-center gap-2 hover:text-[#2a655f] dark:hover:text-[#f9a8d4] transition-colors group/code font-mono font-semibold text-slate-700 dark:text-slate-300"
        >
          {code.code}
          <Copy className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover/code:opacity-100 transition-opacity" />
        </button>
      </TableCell>
      <TableCell className="border-r-2 border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          {code.is_public && !code.store_id && (
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-[8px] hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
              <Globe className="h-2.5 w-2.5 inline mr-0.5" />
              {isArabic ? "عام" : "Public"}
            </Badge>
          )}
          {code.store_id && (
            <Badge className="bg-[#d81b60]/10 text-[#d81b60] border-2 border-[#d81b60]/20 text-[8px] hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
              <Store className="h-2.5 w-2.5 inline mr-0.5" />
              {code.store_name || (isArabic ? "مخصص" : "Specific")}
            </Badge>
          )}
          <span className="text-sm font-medium group-hover:text-[#2a655f] dark:group-hover:text-[#f9a8d4] transition-colors">{code.label || "-"}</span>
        </div>
      </TableCell>
      <TableCell className="border-r-2 border-slate-200/60 dark:border-slate-700/60">
        <Badge className={cn("border-2 flex items-center gap-1 px-3 py-1 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", getTypeColor(code.type))}>
          <TypeIcon className="h-3 w-3" />
          <span className="text-xs">{isArabic ? typeInfo.ar : typeInfo.en}</span>
        </Badge>
      </TableCell>
      <TableCell className="font-bold text-slate-700 dark:text-slate-300 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
        {code.type === "free_shipping" ? (
          <span className="text-[#2a655f] dark:text-[#f9a8d4]">🆓 {isArabic ? "مجاني" : "Free"}</span>
        ) : code.type === "percentage" ? (
          `${code.value}%`
        ) : (
          `${code.value} ${currency}`
        )}
      </TableCell>
      <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-center gap-1">
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-[#2a655f] dark:group-hover:text-[#f9a8d4] transition-colors">
            {code.used_count || 0}
          </span>
          {code.usage_limit && (
            <span className="text-xs text-slate-400">
              / {code.usage_limit}
            </span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
        <Badge className={cn("border-2 px-3 py-1 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors", statusColor)}>
          <span className="flex items-center gap-1.5">
            {statusLabel === "نشط" || statusLabel === "Active" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ) : statusLabel === "منتهي الصلاحية" || statusLabel === "Expired" ? (
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            ) : (
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
            )}
            {statusLabel}
          </span>
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-slate-500 dark:text-slate-400 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
        {code.expires_at ? formatDate(code.expires_at) : isArabic ? "غير محدود" : "Unlimited"}
      </TableCell>
      <TableCell className="text-end">
        <div className="flex items-center justify-end gap-1">
          {/* ✅ زر Edit - رمادي مع هوفر رمادي فاتح */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
            onClick={() => onEdit(code)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          
          {/* ✅ زر Delete - رمادي مع هوفر رمادي فاتح */}
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-red-300 hover:text-red-500 transition-all duration-300"
            onClick={() => onDelete(code)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          
          {/* ✅ زر More - رمادي مع هوفر رمادي فاتح */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl border border-slate-200 dark:border-slate-700 p-1 min-w-[160px]">
              <DropdownMenuItem
                className="rounded-lg cursor-pointer gap-2 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                onClick={() => onCopy(code.code)}
              >
                <Copy className="h-4 w-4 text-slate-500" />
                {isArabic ? "نسخ الكود" : "Copy code"}
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg cursor-pointer gap-2 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors"
                onClick={() => onToggle(code)}
              >
                {code.is_active ? (
                  <>
                    <EyeOff className="h-4 w-4 text-slate-500" />
                    {isArabic ? "تعطيل" : "Deactivate"}
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 text-slate-500" />
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

  // ✅ تصفية المتاجر حسب البحث
  const filteredStores = useMemo(() => {
    if (!searchStore.trim()) return activeStores;
    const query = searchStore.trim().toLowerCase();
    return activeStores.filter((store: any) => {
      const name = (store.store_name || store.full_name || '').toLowerCase();
      const phone = (store.store_phone || store.phone || '').toLowerCase();
      return name.includes(query) || phone.includes(query);
    });
  }, [activeStores, searchStore]);

  // ✅ ===== HOOKS =====
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
      percentage: "bg-[#f9a8d4]/20 text-[#d81b60] border-[#f9a8d4]/40",
      fixed: "bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/30",
      free_shipping: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    };
    return map[type] || "bg-slate-500/10 text-slate-600 border-slate-500/20";
  }, []);

  const getStatusColor = useCallback((code: PromoCode) => {
    if (!code.is_active) return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return "bg-amber-500/10 text-amber-600 border-amber-500/20";
    }
    return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
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
        value: parseFloat(formData.value) || 0,
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
          value: parseFloat(formData.value) || 0,
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
  // ✅ فتح نافذة التعديل
  // ============================================================
  const openEditDialog = useCallback((code: PromoCode) => {
    setSelectedCode(code);
    const isSpecific = !!code.store_id;
    setIsStoreSpecific(isSpecific);
    setSelectedStoreId(code.store_id || "");

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
  // ✅ RENDER - الواجهة الرئيسية
  // ============================================================

  return (
    <div className="space-y-5">
      
      {/* ===== HEADER - نفس تصميم باقي الصفحات ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent">
              {isArabic ? "أكواد الخصم" : "Promo Codes"}
            </span>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
              {isArabic ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {isArabic
              ? `إدارة جميع الأكواد (${codes.length} من ${totalCount})`
              : `Manage all codes (${codes.length} of ${totalCount})`}
            <span className="h-1 w-1 rounded-full bg-[#f9a8d4]/50" />
            <span className="text-xs text-[#d81b60] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isArabic ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="rounded-lg h-9 px-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300"
            >
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
          
          <Button
            className="rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0"
            onClick={() => {
              resetForm();
              setShowAddDialog(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            {isArabic ? "إضافة كود جديد" : "Add New Code"}
          </Button>
          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {isArabic ? 'لوحة تحكم' : 'Dashboard'}
          </Badge>
        </div>
      </div>

      {/* ===== STATS CARDS - بوردر زهري مثل AdminOverview ===== */}
      <StatsCards stats={stats} />

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isArabic ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-300`} />
          <Input
            placeholder={isArabic ? "🔍 بحث عن كود..." : "🔍 Search code..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute ${isArabic ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder={isArabic ? "النوع" : "Type"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700">
            <SelectItem value="all" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">{isArabic ? "الكل" : "All"}</SelectItem>
            <SelectItem value="percentage" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">📊 {isArabic ? "نسبة مئوية" : "Percentage"}</SelectItem>
            <SelectItem value="fixed" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">💰 {isArabic ? "قيمة ثابتة" : "Fixed"}</SelectItem>
            <SelectItem value="free_shipping" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">🚚 {isArabic ? "توصيل مجاني" : "Free Shipping"}</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder={isArabic ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700">
            <SelectItem value="all" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">{isArabic ? "الكل" : "All"}</SelectItem>
            <SelectItem value="active" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">✅ {isArabic ? "نشط" : "Active"}</SelectItem>
            <SelectItem value="inactive" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">❌ {isArabic ? "غير نشط" : "Inactive"}</SelectItem>
            <SelectItem value="expired" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">⏰ {isArabic ? "منتهي" : "Expired"}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setFilterType("all");
            setFilterStatus("all");
          }}
          className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
        >
          <X className="h-4 w-4 mr-1.5" />
          {isArabic ? "مسح الكل" : "Clear All"}
        </Button>
      </div>

      {/* ===== TABLE ===== */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
            {isArabic ? "⏳ جاري تحميل الأكواد..." : "⏳ Loading codes..."}
          </p>
        </div>
      ) : codes.length === 0 ? (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 p-16 text-center shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow">
              <Tag className="h-10 w-10 text-[#2a655f]/40" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {searchQuery
                ? isArabic ? "🔍 لا توجد نتائج" : "🔍 No results found"
                : isArabic ? "🚀 لا توجد أكواد خصم" : "🚀 No promo codes"}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md">
              {searchQuery
                ? isArabic ? `لا توجد أكواد تطابق "${searchQuery}"` : `No codes match "${searchQuery}"`
                : isArabic ? "ابدأ بإضافة أول كود خصم لجذب المزيد من العملاء" : "Start adding promo codes to attract more customers"}
            </p>
            {!searchQuery && (
              <Button
                className="mt-2 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 group border-0"
                onClick={() => {
                  resetForm();
                  setShowAddDialog(true);
                }}
              >
                <Plus className="h-4 w-4 me-2 group-hover:rotate-90 transition-transform duration-300" />
                {isArabic ? "إضافة كود جديد" : "Add New Code"}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700">
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                        {isArabic ? "الكود" : "Code"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[160px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                        {isArabic ? "الاسم / النوع" : "Label / Type"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-center gap-2">
                        <Gift className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                        {isArabic ? "النوع" : "Type"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-center gap-2">
                        <DollarSign className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                        {isArabic ? "القيمة" : "Value"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                        {isArabic ? "الاستخدامات" : "Uses"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[120px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                        {isArabic ? "الحالة" : "Status"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[140px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                        {isArabic ? "الصلاحية" : "Expires"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[180px]">
                      <div className="flex items-center justify-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" />
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
                className="rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 hover:scale-105"
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

          <div className="text-center text-sm text-slate-500 dark:text-slate-400 pt-2">
            {isArabic
              ? `عرض ${codes.length} من ${totalCount} كود`
              : `Showing ${codes.length} of ${totalCount} codes`}
          </div>
        </>
      )}

      {/* ============================================================
      // ✅ DIALOG: إضافة كود - بتصميم بسيط
      // ============================================================ */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700"
            onClick={() => setShowAddDialog(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </Button>

          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-slate-200 dark:border-slate-700">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {isArabic ? "إضافة كود خصم جديد" : "Add New Promo Code"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {isArabic ? "أدخل معلومات كود الخصم الجديد" : "Enter the new promo code information"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleAddCode} className="space-y-4 py-4">
              {/* الكود والاسم */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Tag className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "الكود *" : "Code *"}
                  </Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder={isArabic ? "مثال: SUMMER25" : "Example: SUMMER25"}
                    required
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 font-mono text-lg transition-all duration-300"
                  />
                  <p className="text-xs text-slate-400">
                    {isArabic ? "أحرف كبيرة وأرقام فقط" : "Uppercase letters and numbers only"}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Layers className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "الاسم *" : "Label *"}
                  </Label>
                  <Input
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder={isArabic ? "مثال: خصم الصيف" : "Example: Summer Sale"}
                    required
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* الوصف */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                  <Info className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                  {isArabic ? "الوصف" : "Description"}
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={isArabic ? "وصف الكود" : "Code description"}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 min-h-[60px] transition-all duration-300"
                />
              </div>

              {/* النوع والقيمة والحد الأدنى */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Gift className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "النوع *" : "Type *"}
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => {
                      setFormData({ 
                        ...formData, 
                        type: value,
                        value: value === "free_shipping" ? "0" : formData.value
                      });
                    }}
                  >
                    <SelectTrigger className="rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700">
                      <SelectItem value="percentage" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">📊 {isArabic ? "نسبة مئوية" : "Percentage"}</SelectItem>
                      <SelectItem value="fixed" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">💰 {isArabic ? "قيمة ثابتة" : "Fixed"}</SelectItem>
                      <SelectItem value="free_shipping" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">🚚 {isArabic ? "توصيل مجاني" : "Free Shipping"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.type !== "free_shipping" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                      {isArabic ? "القيمة *" : "Value *"}
                    </Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                      placeholder={formData.type === "percentage" ? "10" : "10.00"}
                      required
                      className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                    />
                  </div>
                )}

                {formData.type === "free_shipping" && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                      <Truck className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                      {isArabic ? "القيمة" : "Value"}
                    </Label>
                    <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-sm flex items-center gap-2 h-11">
                      <Truck className="h-4 w-4" />
                      <span>
                        {isArabic 
                          ? "🆓 تُحسب تلقائياً حسب رسوم التوصيل" 
                          : "🆓 Calculated automatically based on delivery fee"}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "الحد الأدنى للطلب" : "Min Order"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.min_order}
                    onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                    placeholder="0"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* الحد الأقصى وحد الاستخدامات */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Shield className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "الحد الأقصى للخصم" : "Max Discount"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                    placeholder={isArabic ? "غير محدود" : "Unlimited"}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Users className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "حد الاستخدامات" : "Usage Limit"}
                  </Label>
                  <Input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="1"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                  <p className="text-xs text-slate-400">
                    {isArabic ? "عدد مرات استخدام الكود" : "Number of times code can be used"}
                  </p>
                </div>
              </div>

              {/* تاريخ الانتهاء */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                  {isArabic ? "تاريخ ووقت الانتهاء" : "Expiry Date & Time"}
                </Label>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-12 text-slate-700 dark:text-slate-300",
                            !formData.expires_at && "text-slate-400"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                          {formData.expires_at ? (
                            formatDate(formData.expires_at)
                          ) : (
                            <span>{isArabic ? "اختر التاريخ" : "Select date"}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl" align="start">
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
                  <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Timer className="h-4 w-4 text-[#d81b60] animate-pulse" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {isArabic ? "ينتهي في: " : "Expires at: "}
                    </span>
                    <span className="text-sm font-bold text-[#d81b60]">
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
                      className="h-6 w-6 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors ml-auto"
                      onClick={() => setFormData({ ...formData, expires_at: "" })}
                    >
                      <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                    </Button>
                  </div>
                )}

                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <Info className="h-3 w-3 text-[#2a655f] dark:text-slate-300" />
                  {isArabic 
                    ? "📅 اختر تاريخ ووقت الانتهاء (اتركه فارغاً للصلاحية الدائمة)" 
                    : "📅 Select expiry date & time (leave empty for unlimited)"}
                </p>
              </div>

              {/* خيار الكود العام / المخصص */}
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                  <Globe className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                  {isArabic ? "نوع الكود" : "Code Type"}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      !isStoreSpecific
                        ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                    )}
                  >
                    <input
                      type="radio"
                      checked={!isStoreSpecific}
                      onChange={() => {
                        setIsStoreSpecific(false);
                        setSelectedStoreId("");
                      }}
                      className="mt-1 h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{isArabic ? "🌐 كود عام" : "🌐 Public Code"}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isArabic ? "ينطبق على جميع المتاجر" : "Applies to all stores"}
                      </p>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      isStoreSpecific
                        ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                    )}
                  >
                    <input
                      type="radio"
                      checked={isStoreSpecific}
                      onChange={() => setIsStoreSpecific(true)}
                      className="mt-1 h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{isArabic ? "🏪 كود مخصص" : "🏪 Specific Code"}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isArabic ? "ينطبق على متجر معين" : "Applies to a specific store"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* اختيار المتجر */}
              {isStoreSpecific && (
                <div className="space-y-2 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-2">
                    <Store className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "اختر المتجر المستهدف *" : "Select Target Store *"}
                  </Label>
                  
                  <div className="relative">
                    <Search className="absolute inset-y-0 my-auto left-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder={isArabic ? "🔍 بحث بالاسم أو رقم الجوال..." : "🔍 Search by name or phone..."}
                      value={searchStore}
                      onChange={(e) => setSearchStore(e.target.value)}
                      className="pl-9 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                    />
                  </div>
                  
                  {storesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#2a655f] dark:text-slate-300" />
                    </div>
                  ) : filteredStores.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      {searchStore 
                        ? (isArabic ? "❌ لا توجد متاجر تطابق البحث" : "❌ No stores match search")
                        : (isArabic ? "❌ لا توجد متاجر نشطة" : "❌ No active stores")}
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-white dark:bg-slate-950">
                      {filteredStores.map((store: any) => (
                        <label
                          key={store.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300",
                            selectedStoreId === store.id
                              ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                          )}
                        >
                          <input
                            type="radio"
                            name="store"
                            value={store.id}
                            checked={selectedStoreId === store.id}
                            onChange={() => setSelectedStoreId(store.id)}
                            className="h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                          />
                          
                          <div className="flex-shrink-0">
                            {store.store_logo_url ? (
                              <img 
                                src={store.store_logo_url} 
                                alt="" 
                                className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Store className="h-5 w-5 text-[#2a655f] dark:text-slate-300" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {store.store_name || store.full_name}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              {store.store_phone || store.phone ? (
                                <span className="flex items-center gap-1">
                                  <span className="text-[#2a655f] dark:text-slate-300">📞</span>
                                  {store.store_phone || store.phone}
                                </span>
                              ) : (
                                <span className="text-slate-400/50">
                                  {isArabic ? "رقم غير متاح" : "No phone"}
                                </span>
                              )}
                              <Badge className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                {store.listing_count || 0} {isArabic ? "منتج" : "products"}
                              </Badge>
                            </div>
                          </div>
                          
                          {selectedStoreId === store.id && (
                            <Check className="h-5 w-5 text-[#2a655f] flex-shrink-0" />
                          )}
                        </label>
                      ))}
                      
                      <div className="text-xs text-slate-400 text-center pt-2 border-t border-slate-200 dark:border-slate-700">
                        {isArabic 
                          ? `عرض ${filteredStores.length} من ${activeStores.length} متجر`
                          : `Showing ${filteredStores.length} of ${activeStores.length} stores`}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Info className="h-3 w-3 text-[#2a655f] dark:text-slate-300" />
                    {isArabic 
                      ? "💡 اختر المتجر الذي سينطبق عليه الكود (يمكنك البحث بالاسم أو رقم الجوال)"
                      : "💡 Select the store where this code will apply (search by name or phone)"}
                  </p>
                </div>
              )}

              {/* تفعيل الكود */}
              <div className="flex items-center gap-3 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  className="data-[state=checked]:bg-[#2a655f]"
                />
                <Label className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isArabic ? "🟢 الكود نشط" : "🟢 Code is active"}
                </Label>
              </div>

              <DialogFooter className="gap-3 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0"
                  disabled={isSubmitting || (isStoreSpecific && !selectedStoreId)}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isArabic ? "جاري الإضافة..." : "Adding..."}
                    </span>
                  ) : (
                    <>
                      <Tag className="h-4 w-4 mr-1.5" />
                      {isArabic ? "إضافة الكود" : "Add Code"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DIALOG: تعديل كود - بتصميم بسيط
      // ============================================================ */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700"
            onClick={() => setShowEditDialog(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </Button>

          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-slate-200 dark:border-slate-700">
                  <Edit className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {isArabic ? "تعديل كود الخصم" : "Edit Promo Code"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {isArabic ? `تعديل كود "${selectedCode?.code}"` : `Editing code "${selectedCode?.code}"`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <form onSubmit={handleEditCode} className="space-y-4 py-4">
              {/* نفس حقول الإضافة ولكن مع تعبئة البيانات - نفس التصميم */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Tag className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "الكود *" : "Code *"}
                  </Label>
                  <Input
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder={isArabic ? "مثال: SUMMER25" : "Example: SUMMER25"}
                    required
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 font-mono text-lg transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Layers className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "الاسم *" : "Label *"}
                  </Label>
                  <Input
                    value={formData.label}
                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                    placeholder={isArabic ? "مثال: خصم الصيف" : "Example: Summer Sale"}
                    required
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                  <Info className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                  {isArabic ? "الوصف" : "Description"}
                </Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={isArabic ? "وصف الكود" : "Code description"}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 min-h-[60px] transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Gift className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "النوع *" : "Type *"}
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700">
                      <SelectItem value="percentage" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">📊 {isArabic ? "نسبة مئوية" : "Percentage"}</SelectItem>
                      <SelectItem value="fixed" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">💰 {isArabic ? "قيمة ثابتة" : "Fixed"}</SelectItem>
                      <SelectItem value="free_shipping" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">🚚 {isArabic ? "توصيل مجاني" : "Free Shipping"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "القيمة *" : "Value *"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === "percentage" ? "10" : "10.00"}
                    required
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "الحد الأدنى للطلب" : "Min Order"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.min_order}
                    onChange={(e) => setFormData({ ...formData, min_order: e.target.value })}
                    placeholder="0"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Shield className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "الحد الأقصى للخصم" : "Max Discount"}
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.max_discount}
                    onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                    placeholder={isArabic ? "غير محدود" : "Unlimited"}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                    <Users className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "حد الاستخدامات" : "Usage Limit"}
                  </Label>
                  <Input
                    type="number"
                    value={formData.usage_limit}
                    onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                    placeholder="1"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* تاريخ الانتهاء */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                  {isArabic ? "تاريخ ووقت الانتهاء" : "Expiry Date & Time"}
                </Label>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-12 text-slate-700 dark:text-slate-300",
                            !formData.expires_at && "text-slate-400"
                          )}
                        >
                          <Calendar className="mr-2 h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                          {formData.expires_at ? (
                            formatDate(formData.expires_at)
                          ) : (
                            <span>{isArabic ? "اختر التاريخ" : "Select date"}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-xl" align="start">
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
                  <div className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                    <Timer className="h-4 w-4 text-[#d81b60] animate-pulse" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {isArabic ? "ينتهي في: " : "Expires at: "}
                    </span>
                    <span className="text-sm font-bold text-[#d81b60]">
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
                      className="h-6 w-6 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors ml-auto"
                      onClick={() => setFormData({ ...formData, expires_at: "" })}
                    >
                      <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
                    </Button>
                  </div>
                )}
              </div>

              {/* خيار الكود العام / المخصص */}
              <div className="space-y-3 pt-2">
                <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-1">
                  <Globe className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                  {isArabic ? "نوع الكود" : "Code Type"}
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      !isStoreSpecific
                        ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                    )}
                  >
                    <input
                      type="radio"
                      checked={!isStoreSpecific}
                      onChange={() => {
                        setIsStoreSpecific(false);
                        setSelectedStoreId("");
                      }}
                      className="mt-1 h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{isArabic ? "🌐 كود عام" : "🌐 Public Code"}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isArabic ? "ينطبق على جميع المتاجر" : "Applies to all stores"}
                      </p>
                    </div>
                  </label>

                  <label
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                      isStoreSpecific
                        ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30"
                        : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                    )}
                  >
                    <input
                      type="radio"
                      checked={isStoreSpecific}
                      onChange={() => setIsStoreSpecific(true)}
                      className="mt-1 h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                        <span className="font-semibold text-sm text-slate-700 dark:text-slate-300">{isArabic ? "🏪 كود مخصص" : "🏪 Specific Code"}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isArabic ? "ينطبق على متجر معين" : "Applies to a specific store"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* اختيار المتجر */}
              {isStoreSpecific && (
                <div className="space-y-2 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-slate-300 flex items-center gap-2">
                    <Store className="h-4 w-4 text-[#2a655f] dark:text-slate-300" />
                    {isArabic ? "اختر المتجر المستهدف *" : "Select Target Store *"}
                  </Label>
                  
                  <div className="relative">
                    <Search className="absolute inset-y-0 my-auto left-3 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder={isArabic ? "🔍 بحث بالاسم أو رقم الجوال..." : "🔍 Search by name or phone..."}
                      value={searchStore}
                      onChange={(e) => setSearchStore(e.target.value)}
                      className="pl-9 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300"
                    />
                  </div>
                  
                  {storesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-[#2a655f] dark:text-slate-300" />
                    </div>
                  ) : filteredStores.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      {searchStore 
                        ? (isArabic ? "❌ لا توجد متاجر تطابق البحث" : "❌ No stores match search")
                        : (isArabic ? "❌ لا توجد متاجر نشطة" : "❌ No active stores")}
                    </div>
                  ) : (
                    <div className="max-h-60 overflow-y-auto space-y-2 border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-white dark:bg-slate-950">
                      {filteredStores.map((store: any) => (
                        <label
                          key={store.id}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all duration-300",
                            selectedStoreId === store.id
                              ? "border-slate-400 bg-slate-100/50 dark:bg-slate-700/30"
                              : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30"
                          )}
                        >
                          <input
                            type="radio"
                            name="store-edit"
                            value={store.id}
                            checked={selectedStoreId === store.id}
                            onChange={() => setSelectedStoreId(store.id)}
                            className="h-4 w-4 accent-[#2a655f] dark:accent-[#f9a8d4]"
                          />
                          
                          <div className="flex-shrink-0">
                            {store.store_logo_url ? (
                              <img 
                                src={store.store_logo_url} 
                                alt="" 
                                className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                <Store className="h-5 w-5 text-[#2a655f] dark:text-slate-300" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                              {store.store_name || store.full_name}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-slate-400">
                              {store.store_phone || store.phone ? (
                                <span className="flex items-center gap-1">
                                  <span className="text-[#2a655f] dark:text-slate-300">📞</span>
                                  {store.store_phone || store.phone}
                                </span>
                              ) : (
                                <span className="text-slate-400/50">
                                  {isArabic ? "رقم غير متاح" : "No phone"}
                                </span>
                              )}
                              <Badge className="text-[9px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                {store.listing_count || 0} {isArabic ? "منتج" : "products"}
                              </Badge>
                            </div>
                          </div>
                          
                          {selectedStoreId === store.id && (
                            <Check className="h-5 w-5 text-[#2a655f] flex-shrink-0" />
                          )}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* تفعيل الكود */}
              <div className="flex items-center gap-3 p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                <Switch
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  className="data-[state=checked]:bg-[#2a655f]"
                />
                <Label className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300">
                  {isArabic ? "🟢 الكود نشط" : "🟢 Code is active"}
                </Label>
              </div>

              <DialogFooter className="gap-3 pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
                >
                  <X className="h-4 w-4 mr-1" />
                  {isArabic ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0"
                  disabled={isSubmitting || (isStoreSpecific && !selectedStoreId)}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isArabic ? "جاري الحفظ..." : "Saving..."}
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1.5" />
                      {isArabic ? "حفظ التغييرات" : "Save Changes"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DIALOG: حذف كود - بتصميم بسيط
      // ============================================================ */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl shadow-slate-200/50 dark:shadow-slate-800/50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700"
            onClick={() => setShowDeleteDialog(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </Button>

          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {isArabic ? "حذف الكود" : "Delete Code"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isArabic ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                </DialogDescription>
              </div>
            </div>

            <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border-2 border-rose-200/50 dark:border-rose-800/30 mb-4">
              <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                {isArabic
                  ? `هل أنت متأكد من حذف كود "${selectedCode?.code}"؟`
                  : `Are you sure you want to delete code "${selectedCode?.code}"?`}
              </p>
              {selectedCode && (
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-rose-200/50 dark:border-rose-800/30">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">
                      {selectedCode.label || selectedCode.code}
                    </p>
                    <p className="text-xs text-slate-400">
                      {selectedCode.type === "percentage" ? `${selectedCode.value}%` : 
                       selectedCode.type === "free_shipping" ? "🆓 توصيل مجاني" :
                       `${selectedCode.value} ${app.currency}`}
                    </p>
                  </div>
                  <Badge className="bg-rose-500/10 text-rose-600 border-2 border-rose-500/30">
                    {selectedCode.used_count || 0} {isArabic ? "استخدام" : "uses"}
                  </Badge>
                </div>
              )}
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-amber-200/50 dark:border-amber-800/30">
              <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {isArabic
                  ? "تحذير: حذف هذا الكود سيؤثر على الطلبات المرتبطة به"
                  : "Warning: Deleting this code will affect associated orders"}
              </p>
            </div>

            <DialogFooter className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDeleteCode}
                disabled={isSubmitting}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-rose-400/50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isArabic ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 me-2" />
                    {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
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