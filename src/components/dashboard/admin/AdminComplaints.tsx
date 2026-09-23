// src/components/dashboard/admin/AdminComplaints.tsx

import React, { useState, useMemo, useCallback } from "react";
import { useApp } from "@/lib/i18n";
import { useAllComplaints, useUpdateComplaint } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle, CheckCircle2, Clock, XCircle,
  Loader2, Search, Filter, ChevronDown, ChevronUp,
  Reply, Eye, Send, User, Calendar,
  Package, Phone, Sparkles, Zap, Shield,
  TrendingUp, TrendingDown, Users, MessageSquare,
  Check, Ban, RefreshCw, Star, Wallet, ShoppingCart,
  Crown, Award, Target,
  FileSpreadsheet,
  FileText,
  X,
  Activity,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

// ============================================================
// ✅ دوال تنسيق التاريخ (ميلادي + سوري)
// ============================================================
const formatDate = (date: string | Date, lang: string, withTime = false) => {
  if (!date) return "—";
  const locale = lang === "ar" ? "ar-SY" : "en-US";
  const options: Intl.DateTimeFormatOptions = {
    calendar: "gregory", // ✅ ميلادي
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  };
  try {
    return new Date(date).toLocaleDateString(locale, options);
  } catch {
    return new Date(date).toLocaleDateString("en-GB", options);
  }
};

const formatDateLong = (date: string | Date, lang: string, withTime = false) => {
  if (!date) return "—";
  const locale = lang === "ar" ? "ar-SY" : "en-US";
  const options: Intl.DateTimeFormatOptions = {
    calendar: "gregory",
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(withTime && { hour: "2-digit", minute: "2-digit" }),
  };
  try {
    return new Date(date).toLocaleDateString(locale, options);
  } catch {
    return new Date(date).toLocaleDateString("en-GB", options);
  }
};

// ✅ الوقت بصيغة 12 ساعة (ما بيتأثر بالتقويم)
const formatTime = (date: string | Date) => {
  if (!date) return "—";
  try {
    return new Date(date).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "—";
  }
};

// ✅ لاسم الملف (بدون مشاكل مع / )
const formatDateForFilename = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

// ============================================================
// 🎨 ZOOQ BRAND COLORS
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
// ✅ نوع فلتر التاريخ
// ============================================================
type DateFilterType = 
  | 'all'           // الكل
  | 'today'         // اليوم
  | 'yesterday'     // أمس
  | 'last7days'     // آخر 7 أيام
  | 'last30days'    // آخر 30 يوم
  | 'thisMonth'     // هذا الشهر
  | 'lastMonth'     // الشهر الماضي
  | 'thisYear'      // هذا العام
  | 'custom';       // مخصص

// ============================================================
// ✅ دالة فلترة بالتاريخ
// ============================================================
const filterByDate = (
  dateStr: string, 
  filterType: DateFilterType,
  customFrom?: Date,
  customTo?: Date
): boolean => {
  if (filterType === 'all') return true;
  
  const date = new Date(dateStr);
  const now = new Date();
  
  const startOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(0, 0, 0, 0);
    return copy;
  };
  
  const endOfDay = (d: Date) => {
    const copy = new Date(d);
    copy.setHours(23, 59, 59, 999);
    return copy;
  };
  
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);
  
  switch (filterType) {
    case 'today':
      return date >= todayStart && date <= todayEnd;
    
    case 'yesterday': {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      return date >= startOfDay(yesterday) && date <= endOfDay(yesterday);
    }
    
    case 'last7days': {
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return date >= startOfDay(sevenDaysAgo) && date <= todayEnd;
    }
    
    case 'last30days': {
      const thirtyDaysAgo = new Date(now);
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return date >= startOfDay(thirtyDaysAgo) && date <= todayEnd;
    }
    
    case 'thisMonth': {
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return date >= monthStart && date <= monthEnd;
    }
    
    case 'lastMonth': {
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return date >= lastMonthStart && date <= lastMonthEnd;
    }
    
    case 'thisYear': {
      const yearStart = new Date(now.getFullYear(), 0, 1);
      const yearEnd = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return date >= yearStart && date <= yearEnd;
    }
    
    case 'custom': {
      if (!customFrom && !customTo) return true;
      const from = customFrom ? startOfDay(customFrom) : new Date(0);
      const to = customTo ? endOfDay(customTo) : new Date(8640000000000000);
      return date >= from && date <= to;
    }
    
    default:
      return true;
  }
};

// ============================================================
// ✅ مكون إحصائيات سريعة - خلفية بيضاء وبوردر زهري
// ============================================================
const StatsCards = React.memo(({ stats, isArabic }: { stats: any; isArabic: boolean }) => {
  const items = useMemo(() => [
    { 
      key: 'total', 
      label: isArabic ? '📊 الإجمالي' : '📊 Total', 
      value: stats.total, 
      icon: AlertTriangle,
      color: 'text-[#2a655f]',
      gradient: 'from-[#2a655f] to-[#f9a8d4]',
    },
    { 
      key: 'pending', 
      label: isArabic ? '⏳ قيد المراجعة' : '⏳ Pending', 
      value: stats.pending, 
      icon: Clock,
      color: 'text-amber-500',
      gradient: 'from-amber-500 to-amber-600',
    },
    { 
      key: 'inProgress', 
      label: isArabic ? '🔄 قيد المعالجة' : '🔄 In Progress', 
      value: stats.inProgress, 
      icon: Loader2,
      color: 'text-[#3a8a82]',
      gradient: 'from-[#3a8a82] to-[#4a9f95]',
    },
    { 
      key: 'resolved', 
      label: isArabic ? '✅ تم الحل' : '✅ Resolved', 
      value: stats.resolved, 
      icon: CheckCircle2,
      color: 'text-emerald-500',
      gradient: 'from-emerald-500 to-teal-500',
    },
    { 
      key: 'closed', 
      label: isArabic ? '📌 مغلقة' : '📌 Closed', 
      value: stats.closed, 
      icon: XCircle,
      color: 'text-[#f9a8d4]',
      gradient: 'from-[#f9a8d4] to-[#fbcfe8]',
    },
  ], [stats, isArabic]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((item) => (
        <div 
          key={item.key} 
          className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4"
        >
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
            <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" />
          </div>
          <div className="flex items-center justify-between relative">
            <div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
              <p className={`text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors ${item.color}`}>{item.value}</p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">
                {stats.total > 0 ? `${Math.round((item.value / stats.total) * 100)}%` : '0%'}
              </p>
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
// ✅ مكون صف الشكوى
// ============================================================
const ComplaintRow = React.memo(({ 
  complaint, 
  isExpanded, 
  onToggle, 
  onReply,
  isArabic,
  getStatusBadge,
  index,
  rank,
}: any) => {
  const status = getStatusBadge(complaint.status);
  const StatusIcon = status.icon;
  const user = complaint.profiles;
  
  const rankColor = rank === 1 ? 'text-[#2a655f]' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-[#f9a8d4]' : 'text-slate-400';
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
  const rankBg = rank === 1 ? 'bg-[#2a655f]/10' : rank === 2 ? 'bg-slate-300/10' : rank === 3 ? 'bg-[#f9a8d4]/20' : 'bg-slate-100/30';
  
  return (
    <TableRow 
      className="border-slate-200 dark:border-slate-700 hover:bg-[#f9a8d4]/15 dark:hover:bg-[#f9a8d4]/10 transition-colors duration-300 group border-b-2 border-pink-400/30 dark:border-pink-400/20 cursor-pointer"
      onClick={() => onToggle(complaint.id)}
    >
      {/* ✅ الترتيب */}
      <TableCell className="text-center border-r-2 border-pink-400/30 dark:border-pink-400/20">
        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${rankBg} ${rankColor} font-bold text-sm transition-all duration-300 group-hover:scale-110`}>
          {rankEmoji}
        </span>
      </TableCell>
      
      {/* ✅ الموضوع */}
      <TableCell className="font-semibold text-slate-900 dark:text-white text-right border-r-2 border-pink-400/30 dark:border-pink-400/20">
        <div className="flex items-center gap-2 justify-end">
          <span className="group-hover:text-[#2a655f] transition-colors">
            {complaint.subject || (isArabic ? "شكوى" : "Complaint")}
          </span>
          {rank <= 3 && (
            <span className="text-lg animate-bounce">{rankEmoji}</span>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground justify-end mt-0.5">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3 text-[#2a655f]" />
            {user?.full_name || (isArabic ? "مستخدم" : "User")}
          </span>
        </div>
      </TableCell>
      
      {/* ✅ التاريخ والوقت الكامل */}
      <TableCell className="text-center border-r-2 border-pink-400/30 dark:border-pink-400/20">
        <div className="flex flex-col items-center gap-0.5">
          {/* التاريخ */}
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-400" />
            <span className="text-xs text-slate-700 dark:text-slate-300">
              {formatDate(complaint.created_at, isArabic ? "ar" : "en")}
            </span>
          </div>
          {/* ✅ الوقت: الساعة:الدقيقة */}
          <div className="flex items-center gap-1 text-[10px] text-[#d81b60] dark:text-pink-400 font-mono">
            <Clock className="h-3 w-3" />
            {formatTime(complaint.created_at)}
          </div>
        </div>
      </TableCell>
      
      {/* ✅ رقم الطلب */}
      <TableCell className="text-slate-600 dark:text-slate-300 text-center font-mono border-r-2 border-pink-400/30 dark:border-pink-400/20">
        <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20">
          #{complaint.order_id?.slice(0, 12) || '—'}
        </Badge>
      </TableCell>
      
      {/* ✅ الحالة */}
      <TableCell className="text-center border-r-2 border-pink-400/30 dark:border-pink-400/20">
        <Badge className={cn("border-2 flex items-center gap-1.5 px-3 py-1 text-xs", status.bg, status.color)}>
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </Badge>
      </TableCell>
      
      {/* ✅ الإجراءات */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-1.5">
          {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
            <Button
              size="sm"
              variant="ghost"
              className="h-8 w-8 rounded-lg border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-200 hover:scale-105"
              onClick={(e) => {
                e.stopPropagation();
                onReply(complaint);
              }}
              title={isArabic ? "رد" : "Reply"}
            >
              <Reply className="h-4 w-4" />
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8 w-8 rounded-lg border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-200 hover:scale-105"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/admin/complaints/${complaint.id}`, '_blank');
            }}
            title={isArabic ? "عرض التفاصيل" : "View Details"}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400 group-hover:text-[#2a655f] group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400 group-hover:text-[#2a655f] group-hover:scale-110 transition-transform" />
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});
ComplaintRow.displayName = 'ComplaintRow';

// ============================================================
// ✅ مكون تفاصيل الشكوى الممتدة
// ============================================================
const ComplaintDetails = React.memo(({ 
  complaint, 
  isArabic,
  onReply,
}: any) => {
  const user = complaint.profiles;
  
  return (
    <div className="px-4 pb-4 pt-3 border-t-3 border-pink-400/30 dark:border-pink-400/20 animate-in slide-in-from-top-2 duration-300 bg-gradient-to-r from-[#f9a8d4]/5 to-[#fbcfe8]/5 dark:from-[#f9a8d4]/5 dark:to-[#fbcfe8]/5 rounded-b-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ✅ معلومات العميل */}
        <div className="p-4 bg-white/70 dark:bg-slate-900/70 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Users className="h-3 w-3 text-[#2a655f]" />
            {isArabic ? "معلومات العميل" : "Customer Information"}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              {user?.full_name || "-"}
            </p>
            {user?.phone && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-3 w-3 text-[#2a655f]" />
                <span dir="ltr">{user.phone}</span>
              </p>
            )}
            {user?.email && (
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Mail className="h-3 w-3 text-[#2a655f]" />
                {user.email}
              </p>
            )}
          </div>
        </div>

        {/* ✅ تفاصيل الشكوى */}
        <div className="p-4 bg-amber-50/50 dark:bg-amber-950/20 rounded-xl border-2 border-amber-200/50 dark:border-amber-800/30">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3 text-amber-500" />
            {isArabic ? "تفاصيل الشكوى" : "Complaint Details"}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300 mt-2 leading-relaxed">
            {complaint.description}
          </p>
        </div>

        {/* ✅ رد الأدمن */}
        <div className="space-y-3">
          {complaint.admin_response && (
            <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border-2 border-emerald-200/50 dark:border-emerald-800/30 animate-in slide-in-from-left-2 duration-300">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Reply className="h-3 w-3 text-emerald-500" />
                {isArabic ? "رد الإدارة" : "Admin Response"}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-1">
                {complaint.admin_response}
              </p>
              {complaint.resolved_at && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                  {isArabic ? "تم الحل في " : "Resolved on "}
                  {formatDate(complaint.resolved_at, isArabic ? "ar" : "en")}
                </p>
              )}
            </div>
          )}
          
          {/* ✅ زر الرد السريع */}
          {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
            <Button
              size="sm"
              className="w-full border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300 hover:scale-105 rounded-xl"
              onClick={() => onReply(complaint)}
            >
              <Reply className="h-4 w-4 mr-2" />
              {isArabic ? "رد على الشكوى" : "Reply"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
});
ComplaintDetails.displayName = 'ComplaintDetails';

export function AdminComplaints() {
  const app = useApp();
  const isArabic = app.lang === "ar";
  const { data: complaints = [], isLoading, refetch } = useAllComplaints();
  const updateComplaint = useUpdateComplaint();
  
  // ✅ State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<DateFilterType>("all");
  const [customFromDate, setCustomFromDate] = useState<Date | undefined>(undefined);
  const [customToDate, setCustomToDate] = useState<Date | undefined>(undefined);
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ============================================================
  // ✅ فلترة الشكاوى - محسّنة
  // ============================================================
  const filteredComplaints = useMemo(() => {
    let result = complaints;
    
    if (filterStatus !== "all") {
      result = result.filter((c: any) => c.status === filterStatus);
    }

    // ✅ فلتر التاريخ
    if (filterDate !== "all") {
      result = result.filter((c: any) => 
        filterByDate(c.created_at, filterDate, customFromDate, customToDate)
      );
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((c: any) => {
        const subject = (c.subject || "").toLowerCase();
        const userName = (c.profiles?.full_name || "").toLowerCase();
        const orderId = (c.order_id || "").toLowerCase();
        return subject.includes(q) || userName.includes(q) || orderId.includes(q);
      });
    }

    // ✅ الترتيب الثابت: الأحدث أولاً
    result = [...result].sort((a: any, b: any) => {
      const aDate = new Date(a.created_at || 0).getTime();
      const bDate = new Date(b.created_at || 0).getTime();
      return bDate - aDate;
    });
    
    return result;
  }, [complaints, searchQuery, filterStatus, filterDate, customFromDate, customToDate]);

  // ============================================================
  // ✅ Pagination
  // ============================================================
  const totalPages = Math.ceil(filteredComplaints.length / limit);
  const paginatedComplaints = useMemo(() => {
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredComplaints.slice(start, end);
  }, [filteredComplaints, page, limit]);

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // ============================================================
  // ✅ إحصائيات الشكاوى
  // ============================================================
  const stats = useMemo(() => {
    const total = complaints.length;
    const pending = complaints.filter((c: any) => c.status === 'pending').length;
    const inProgress = complaints.filter((c: any) => c.status === 'in_progress').length;
    const resolved = complaints.filter((c: any) => c.status === 'resolved').length;
    const closed = complaints.filter((c: any) => c.status === 'closed').length;
    return { total, pending, inProgress, resolved, closed };
  }, [complaints]);

  // ============================================================
  // ✅ حالة الشكوى
  // ============================================================
  const getStatusBadge = useCallback((status: string) => {
    const map: Record<string, { label: string; color: string; icon: any; bg: string }> = {
      pending: { 
        label: isArabic ? "⏳ قيد المراجعة" : "⏳ Pending", 
        color: "text-amber-600 border-amber-500/30",
        bg: "bg-amber-500/10",
        icon: Clock
      },
      in_progress: { 
        label: isArabic ? "🔄 قيد المعالجة" : "🔄 In Progress", 
        color: "text-[#3a8a82] border-[#3a8a82]/30",
        bg: "bg-[#3a8a82]/10",
        icon: Loader2
      },
      resolved: { 
        label: isArabic ? "✅ تم الحل" : "✅ Resolved", 
        color: "text-emerald-600 border-emerald-500/30",
        bg: "bg-emerald-500/10",
        icon: CheckCircle2
      },
      closed: { 
        label: isArabic ? "📌 مغلقة" : "📌 Closed", 
        color: "text-[#f9a8d4] border-[#f9a8d4]/30",
        bg: "bg-[#f9a8d4]/10",
        icon: XCircle
      },
    };
    return map[status] || map.pending;
  }, [isArabic]);

  // ============================================================
  // ✅ اسم فلتر التاريخ للعرض
  // ============================================================
  const getDateFilterLabel = useCallback((filter: DateFilterType) => {
    const labels: Record<DateFilterType, { ar: string; en: string; emoji: string }> = {
      all: { ar: "كل الوقت", en: "All Time", emoji: "🗓️" },
      today: { ar: "اليوم", en: "Today", emoji: "☀️" },
      yesterday: { ar: "أمس", en: "Yesterday", emoji: "🌙" },
      last7days: { ar: "آخر 7 أيام", en: "Last 7 Days", emoji: "📅" },
      last30days: { ar: "آخر 30 يوم", en: "Last 30 Days", emoji: "📆" },
      thisMonth: { ar: "هذا الشهر", en: "This Month", emoji: "🗓️" },
      lastMonth: { ar: "الشهر الماضي", en: "Last Month", emoji: "📅" },
      thisYear: { ar: "هذا العام", en: "This Year", emoji: "🎯" },
      custom: { ar: "مخصص", en: "Custom", emoji: "🔧" },
    };
    return labels[filter];
  }, []);

  // ============================================================
  // ✅ تحديث الشكوى
  // ============================================================
  const handleUpdateComplaint = async () => {
    if (!selectedComplaint) return;
    if (!newStatus) {
      toast.warning(isArabic ? "⚠️ يرجى اختيار حالة جديدة" : "⚠️ Please select a new status");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateComplaint.mutateAsync({
        id: selectedComplaint.id,
        status: newStatus,
        admin_response: adminResponse || undefined,
      });
      
      setReplyDialogOpen(false);
      setSelectedComplaint(null);
      setAdminResponse("");
      setNewStatus("");
      refetch();
      
      toast.success(
        isArabic 
          ? "✅ تم تحديث حالة الشكوى بنجاح" 
          : "✅ Complaint updated successfully"
      );
      
    } catch (error) {
      console.error("Error updating complaint:", error);
      toast.error(
        isArabic 
          ? "❌ فشل تحديث الشكوى" 
          : "❌ Failed to update complaint"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // ✅ دوال التنقل
  // ============================================================
  const toggleExpand = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  }, []);

  const openReplyDialog = useCallback((complaint: any) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setAdminResponse(complaint.admin_response || "");
    setReplyDialogOpen(true);
  }, []);

  // ============================================================
  // ✅ تصدير
  // ============================================================
  const exportToExcel = () => {
    const exportData = filteredComplaints.map((c: any) => ({
      'الموضوع': c.subject || '—',
      'العميل': c.profiles?.full_name || '—',
      'رقم الطلب': c.order_id || '—',
      'الحالة': isArabic 
        ? c.status === 'pending' ? 'قيد المراجعة' 
        : c.status === 'in_progress' ? 'قيد المعالجة'
        : c.status === 'resolved' ? 'تم الحل'
        : 'مغلقة'
        : c.status,
      'تاريخ الشكوى': formatDate(c.created_at, isArabic ? "ar" : "en"),
      'الوقت': formatTime(c.created_at),
      'رد الإدارة': c.admin_response || '—',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الشكاوى');
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 15 }, { wch: 30 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `الشكاوى_${formatDateForFilename()}.xlsx`);
    toast.success(isArabic ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };

  const exportToWord = () => {
    let htmlContent = `
      <html dir="rtl" lang="ar">
      <head><meta charset="UTF-8">
      <style>
        body { font-family: 'Arial', sans-serif; padding: 20px; }
        h1 { color: #2a655f; text-align: center; border-bottom: 2px solid #f9a8d4; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #2a655f; color: white; padding: 12px; text-align: right; }
        td { padding: 10px; border: 1px solid #e2e8f0; text-align: right; }
        tr:nth-child(even) { background: #f8fafc; }
        .footer { margin-top: 20px; text-align: center; color: #94a3b8; font-size: 12px; }
      </style></head>
      <body>
        <h1>📊 تقرير الشكاوى</h1>
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${formatDate(new Date(), "ar")}</p>
        <table>
          <thead><tr><th>#</th><th>الموضوع</th><th>العميل</th><th>رقم الطلب</th><th>الحالة</th><th>التاريخ</th><th>الوقت</th></tr></thead>
          <tbody>
    `;
    filteredComplaints.forEach((c: any, i: number) => {
      const statusText = c.status === 'pending' ? 'قيد المراجعة' : c.status === 'in_progress' ? 'قيد المعالجة' : c.status === 'resolved' ? 'تم الحل' : 'مغلقة';
      htmlContent += `
        <tr>
          <td>${i + 1}</td>
          <td>${c.subject || '—'}</td>
          <td>${c.profiles?.full_name || '—'}</td>
          <td>${c.order_id || '—'}</td>
          <td>${statusText}</td>
          <td>${formatDate(c.created_at, "ar")}</td>
          <td>${formatTime(c.created_at)}</td>
        </tr>
      `;
    });
    htmlContent += `
          </tbody></table>
          <div class="footer">إجمالي الشكاوى: ${filteredComplaints.length}</div>
        </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `الشكاوى_${formatDateForFilename()}.doc`);
    toast.success(isArabic ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  // ============================================================
  // ✅ حالة التحميل
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {isArabic ? "⏳ جاري تحميل الشكاوى..." : "⏳ Loading complaints..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {isArabic ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
        <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ===== HEADER - نفس تصميم Overview ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent">
              {isArabic ? "الشكاوى" : "Complaints"}
            </span>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]">
              <Activity className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
              {isArabic ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors">
              <AlertTriangle className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-[#2a655f] font-medium">{stats.total}</span>
              <span className="text-xs text-muted-foreground">{isArabic ? 'إجمالي' : 'total'}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/50 transition-colors">
              <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span className="text-amber-600 dark:text-amber-400 font-medium">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">{isArabic ? 'قيد المراجعة' : 'pending'}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.resolved}</span>
              <span className="text-xs text-muted-foreground">{isArabic ? 'تم الحل' : 'resolved'}</span>
            </span>
          </p>
        </div>

        {/* ✅ أزرار التصدير - رمادية */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border-2 border-pink-400/60 dark:border-pink-400/40 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToExcel}
              disabled={filteredComplaints.length === 0}
              className="rounded-lg h-9 px-4 text-slate-600 hover:bg-slate-100 hover:text-slate-800 gap-2 transition-all duration-300"
            >
              <FileSpreadsheet className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Excel</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={exportToWord}
              disabled={filteredComplaints.length === 0}
              className="rounded-lg h-9 px-4 text-slate-600 hover:bg-slate-100 hover:text-slate-800 gap-2 transition-all duration-300"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium">Word</span>
            </Button>
            <div className="w-px h-6 bg-slate-300/50" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="rounded-lg h-9 px-3 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30 animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            {isArabic ? 'تقرير لحظي' : 'Live Report'}
          </Badge>
        </div>
      </div>

      {/* ===== STATS CARDS - خلفية بيضاء وبوردر زهري ===== */}
      <StatsCards stats={stats} isArabic={isArabic} />

      {/* ===== SEARCH & FILTERS - مثل SellerApplicationsAdmin ===== */}
      <div className="space-y-3">
        {/* ✅ الصف الأول: البحث (كامل العرض) */}
        <div className="relative flex-1 group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-focus-within:text-[#d81b60] transition-colors duration-300" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={isArabic ? "🔍 بحث عن شكوى..." : "🔍 Search complaints..."}
            className="ps-9 h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300 hover:border-pink-500"
          />
        </div>

        {/* ✅ الصف الثاني: الفلاتر - شبكة ذكية */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {/* فلتر الحالة */}
          <Select
            value={filterStatus}
            onValueChange={(value) => {
              setFilterStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-[#d81b60]" />
                <SelectValue placeholder={isArabic ? "الحالة" : "Status"} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40">
              <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">{isArabic ? "📋 الكل" : "📋 All"}</SelectItem>
              <SelectItem value="pending" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">⏳ {isArabic ? "قيد المراجعة" : "Pending"}</SelectItem>
              <SelectItem value="in_progress" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">🔄 {isArabic ? "قيد المعالجة" : "In Progress"}</SelectItem>
              <SelectItem value="resolved" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">✅ {isArabic ? "تم الحل" : "Resolved"}</SelectItem>
              <SelectItem value="closed" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">📌 {isArabic ? "مغلقة" : "Closed"}</SelectItem>
            </SelectContent>
          </Select>

          {/* ✅ فلتر التاريخ الجديد */}
          <Select
            value={filterDate}
            onValueChange={(value: DateFilterType) => {
              setFilterDate(value);
              if (value === 'custom') {
                setShowCustomDatePicker(true);
              } else {
                setShowCustomDatePicker(false);
                setCustomFromDate(undefined);
                setCustomToDate(undefined);
              }
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#d81b60]" />
                <SelectValue placeholder={isArabic ? "التاريخ" : "Date"} />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40">
              <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                🗓️ {isArabic ? "كل الوقت" : "All Time"}
              </SelectItem>
              <SelectItem value="today" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                ☀️ {isArabic ? "اليوم" : "Today"}
              </SelectItem>
              <SelectItem value="yesterday" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                🌙 {isArabic ? "أمس" : "Yesterday"}
              </SelectItem>
              <SelectItem value="last7days" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                📅 {isArabic ? "آخر 7 أيام" : "Last 7 Days"}
              </SelectItem>
              <SelectItem value="last30days" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                📆 {isArabic ? "آخر 30 يوم" : "Last 30 Days"}
              </SelectItem>
              <SelectItem value="thisMonth" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                🗓️ {isArabic ? "هذا الشهر" : "This Month"}
              </SelectItem>
              <SelectItem value="lastMonth" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                📅 {isArabic ? "الشهر الماضي" : "Last Month"}
              </SelectItem>
              <SelectItem value="thisYear" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                🎯 {isArabic ? "هذا العام" : "This Year"}
              </SelectItem>
              <SelectItem value="custom" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">
                🔧 {isArabic ? "مخصص" : "Custom"}
              </SelectItem>
            </SelectContent>
          </Select>

          {/* عدد العرض */}
          <Select
            value={String(limit)}
            onValueChange={(value) => {
              setLimit(Number(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 bg-white dark:bg-[#1e293b] hover:border-pink-500 transition-all duration-300 focus:ring-2 focus:ring-pink-500/30">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{isArabic ? "عدد" : "Show"}</span>
                <SelectValue placeholder="10" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40">
              <SelectItem value="6" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">6</SelectItem>
              <SelectItem value="10" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">10</SelectItem>
              <SelectItem value="20" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">20</SelectItem>
              <SelectItem value="50" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">50</SelectItem>
              <SelectItem value="100" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">100</SelectItem>
            </SelectContent>
          </Select>

          {/* زر مسح الكل */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery("");
              setFilterStatus("all");
              setFilterDate("all");
              setCustomFromDate(undefined);
              setCustomToDate(undefined);
              setShowCustomDatePicker(false);
              setPage(1);
            }}
            className="w-full h-10 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300"
          >
            <X className="h-4 w-4 mr-1.5" />
            {isArabic ? "مسح الكل" : "Clear all"}
          </Button>
        </div>

        {/* ✅ منتقي التاريخ المخصص - يظهر فقط عند اختيار "مخصص" */}
        {filterDate === 'custom' && (
          <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-gradient-to-r from-[#f9a8d4]/10 to-[#fbcfe8]/10 dark:from-[#f9a8d4]/5 dark:to-[#fbcfe8]/5 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 animate-in slide-in-from-top-2 duration-300">
            <div className="flex items-center gap-2 text-sm font-medium text-[#2a655f] dark:text-white">
              <Calendar className="h-4 w-4 text-[#d81b60]" />
              {isArabic ? "الفترة المخصصة:" : "Custom Range:"}
            </div>

            {/* من تاريخ */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 transition-all duration-300 h-10 text-sm",
                    !customFromDate && "text-slate-400"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4 text-[#d81b60]" />
                  {customFromDate ? (
                    formatDate(customFromDate, isArabic ? "ar" : "en")
                  ) : (
                    <span>{isArabic ? "من تاريخ" : "From date"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-xl" align="start">
                <CalendarComponent
                  mode="single"
                  selected={customFromDate}
                  onSelect={(date) => {
                    setCustomFromDate(date);
                    setPage(1);
                  }}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>

            {/* إلى تاريخ */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[200px] justify-start text-left font-normal rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 transition-all duration-300 h-10 text-sm",
                    !customToDate && "text-slate-400"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4 text-[#d81b60]" />
                  {customToDate ? (
                    formatDate(customToDate, isArabic ? "ar" : "en")
                  ) : (
                    <span>{isArabic ? "إلى تاريخ" : "To date"}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-xl" align="start">
                <CalendarComponent
                  mode="single"
                  selected={customToDate}
                  onSelect={(date) => {
                    setCustomToDate(date);
                    setPage(1);
                  }}
                  disabled={(date) => date > new Date() || (customFromDate && date < customFromDate)}
                  initialFocus
                  className="rounded-2xl"
                />
              </PopoverContent>
            </Popover>

            {/* زر مسح التاريخ المخصص */}
            {(customFromDate || customToDate) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setCustomFromDate(undefined);
                  setCustomToDate(undefined);
                  setPage(1);
                }}
                className="rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1.5" />
                {isArabic ? "مسح" : "Clear"}
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ===== TABLE - مثل Overview ===== */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-dashed border-pink-400/60 dark:border-pink-400/40 shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300">
          <div className="h-20 w-20 rounded-full bg-[#fbcfe8]/60 dark:bg-[#fbcfe8]/20 flex items-center justify-center mx-auto mb-4 animate-bounce-slow border-2 border-pink-400/60 dark:border-pink-400/40">
            <AlertTriangle className="h-10 w-10 text-[#2a655f]/40" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {searchQuery
              ? isArabic ? "لا توجد نتائج" : "No results found"
              : isArabic ? "لا توجد شكاوى" : "No complaints"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? isArabic ? `لا توجد شكاوى تطابق "${searchQuery}"` : `No complaints match "${searchQuery}"`
              : isArabic ? "لم يتم تقديم أي شكاوى حتى الآن" : "No complaints have been submitted yet"}
          </p>
          {(searchQuery || filterStatus !== "all" || filterDate !== "all") && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setFilterStatus("all");
                setFilterDate("all");
                setCustomFromDate(undefined);
                setCustomToDate(undefined);
              }}
              className="mt-4 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300"
            >
              {isArabic ? "مسح الفلاتر" : "Clear filters"}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 overflow-hidden shadow-lg hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-[#f9a8d4]/30 via-[#fbcfe8]/20 to-[#f9a8d4]/30 dark:from-[#f9a8d4]/20 dark:via-[#fbcfe8]/10 dark:to-[#f9a8d4]/20 border-b-2 border-pink-400/60 dark:border-pink-400/40">
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[60px] border-r-2 border-pink-400/30 dark:border-pink-400/20">
                      {isArabic ? "الترتيب" : "Rank"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-right min-w-[180px] border-r-2 border-pink-400/30 dark:border-pink-400/20">
                      {isArabic ? "الموضوع" : "Subject"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[150px] border-r-2 border-pink-400/30 dark:border-pink-400/20">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
                        {isArabic ? "التاريخ والوقت" : "Date & Time"}
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-pink-400/30 dark:border-pink-400/20">
                      {isArabic ? "رقم الطلب" : "Order ID"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-pink-400/30 dark:border-pink-400/20">
                      {isArabic ? "الحالة" : "Status"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px]">
                      {isArabic ? "إجراءات" : "Actions"}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedComplaints.map((complaint: any, index: number) => {
                    const rank = (page - 1) * limit + index + 1;
                    const isExpanded = expandedId === complaint.id;
                    
                    return (
                      <React.Fragment key={complaint.id}>
                        <ComplaintRow
                          complaint={complaint}
                          isExpanded={isExpanded}
                          onToggle={toggleExpand}
                          onReply={openReplyDialog}
                          isArabic={isArabic}
                          getStatusBadge={getStatusBadge}
                          index={index}
                          rank={rank}
                        />
                        {isExpanded && (
                          <TableRow className="border-none hover:bg-transparent">
                            <TableCell colSpan={6} className="p-0 border-none">
                              <ComplaintDetails
                                complaint={complaint}
                                isArabic={isArabic}
                                onReply={openReplyDialog}
                              />
                            </TableCell>
                          </TableRow>
                        )}
                      </React.Fragment>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* ===== Pagination - مثل Overview ===== */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t-2 border-pink-400/30 dark:border-pink-400/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredComplaints.length === 0 ? (
                    <span>{isArabic ? "لا توجد شكاوى" : "No complaints"}</span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#d81b60] animate-pulse" />
                      {isArabic
                        ? `عرض ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredComplaints.length)} من ${filteredComplaints.length} شكوى`
                        : `Showing ${(page - 1) * limit + 1}-${Math.min(page * limit, filteredComplaints.length)} of ${filteredComplaints.length} complaints`}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    disabled={page === 1}
                    className="h-8 w-8 p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300 disabled:opacity-50"
                  >
                    <span className="text-xs font-bold">«</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="h-8 w-8 p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300 disabled:opacity-50"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className={cn(
                            "h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all duration-300",
                            page === pageNum
                              ? "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#f9a8d4]/30 border-2 border-white/30 scale-105"
                              : "border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800"
                          )}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    {totalPages > 5 && page < totalPages - 2 && (
                      <>
                        <span className="text-slate-400 text-sm px-1">...</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => goToPage(totalPages)}
                          className="h-8 min-w-[32px] p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 text-xs transition-all duration-300"
                        >
                          {totalPages}
                        </Button>
                      </>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="h-8 w-8 p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    disabled={page === totalPages}
                    className="h-8 w-8 p-0 rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 text-slate-600 hover:bg-slate-100 hover:border-pink-500 hover:text-slate-800 transition-all duration-300 disabled:opacity-50"
                  >
                    <span className="text-xs font-bold">»</span>
                  </Button>
                </div>
              </div>
            )}

            {/* ===== Footer ===== */}
            <div className="px-4 py-2 border-t-2 border-pink-400/30 dark:border-pink-400/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#f9a8d4]/10 to-[#fbcfe8]/10 flex-wrap gap-2">
              <span className="flex items-center gap-2">
                <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40">
                  {isArabic
                    ? `عرض ${paginatedComplaints.length} من ${filteredComplaints.length}`
                    : `Showing ${paginatedComplaints.length} of ${filteredComplaints.length}`}
                </Badge>
                <span className="text-[10px] text-[#d81b60]">
                  {isArabic ? `إجمالي ${complaints.length}` : `Total ${complaints.length}`}
                </span>
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                {searchQuery && (
                  <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40">
                    🔍 {searchQuery}
                  </Badge>
                )}
                {filterStatus !== "all" && (
                  <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40">
                    {getStatusBadge(filterStatus).label}
                  </Badge>
                )}
                {filterDate !== "all" && (
                  <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40">
                    {getDateFilterLabel(filterDate).emoji} {isArabic ? getDateFilterLabel(filterDate).ar : getDateFilterLabel(filterDate).en}
                    {filterDate === "custom" && (customFromDate || customToDate) && (
                      <span className="ml-1 text-[10px]">
                        ({customFromDate ? formatDate(customFromDate, isArabic ? "ar" : "en") : '...'}
                        {' - '}
                        {customToDate ? formatDate(customToDate, isArabic ? "ar" : "en") : '...'})
                      </span>
                    )}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== REPLY DIALOG ===== */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 z-20 transition-all duration-300 border-2 border-slate-300"
            onClick={() => setReplyDialogOpen(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </Button>
          <div className="p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl text-[#2a655f] dark:text-white">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center">
                  <Reply className="h-4 w-4 text-white" />
                </div>
                {isArabic ? "رد على الشكوى" : "Reply to Complaint"}
              </DialogTitle>
              <DialogDescription>
                {isArabic 
                  ? `شكوى بخصوص الطلب #${selectedComplaint?.order_id?.slice(0, 12)}`
                  : `Complaint for order #${selectedComplaint?.order_id?.slice(0, 12)}`}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label className="text-[#2a655f] dark:text-white font-semibold">
                  {isArabic ? "الحالة الجديدة" : "New Status"}
                </Label>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300">
                    <SelectValue placeholder={isArabic ? "اختر حالة" : "Select status"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40">
                    <SelectItem value="pending" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">⏳ {isArabic ? "قيد المراجعة" : "Pending"}</SelectItem>
                    <SelectItem value="in_progress" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">🔄 {isArabic ? "قيد المعالجة" : "In Progress"}</SelectItem>
                    <SelectItem value="resolved" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">✅ {isArabic ? "تم الحل" : "Resolved"}</SelectItem>
                    <SelectItem value="closed" className="hover:bg-[#f9a8d4]/20 hover:text-[#d81b60] transition-colors">📌 {isArabic ? "مغلقة" : "Closed"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-[#2a655f] dark:text-white font-semibold">
                  {isArabic ? "الرد (اختياري)" : "Response (Optional)"}
                </Label>
                <Textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder={isArabic 
                    ? "اكتب ردك على الشكوى..." 
                    : "Write your response to the complaint..."}
                  className="min-h-[100px] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t-2 border-pink-400/30">
              <Button
                variant="outline"
                onClick={() => setReplyDialogOpen(false)}
                className="rounded-xl border-2 border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 hover:text-slate-800 transition-all duration-300"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleUpdateComplaint}
                disabled={isSubmitting}
                className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105 border-2 border-[#2a655f]/40 px-6"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isArabic ? "تحديث وإرسال" : "Update & Send"}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide {
          animation: slide 1.5s ease-in-out infinite;
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
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          background-size: 200% auto;
          animation: shimmer 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default AdminComplaints;