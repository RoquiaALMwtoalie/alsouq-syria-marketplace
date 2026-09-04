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
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
const { saveAs } = pkg;

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
// ✅ مكون إحصائيات سريعة - خلفية وردية وبوردر وردي
// ============================================================
const StatsCards = React.memo(({ stats, isArabic }: { stats: any; isArabic: boolean }) => {
  const items = useMemo(() => [
    { 
      key: 'total', 
      label: isArabic ? '📊 الإجمالي' : '📊 Total', 
      value: stats.total, 
      icon: AlertTriangle,
      color: 'text-[#2a655f]',
    },
    { 
      key: 'pending', 
      label: isArabic ? '⏳ قيد المراجعة' : '⏳ Pending', 
      value: stats.pending, 
      icon: Clock,
      color: 'text-amber-500',
    },
    { 
      key: 'inProgress', 
      label: isArabic ? '🔄 قيد المعالجة' : '🔄 In Progress', 
      value: stats.inProgress, 
      icon: Loader2,
      color: 'text-[#3a8a82]',
    },
    { 
      key: 'resolved', 
      label: isArabic ? '✅ تم الحل' : '✅ Resolved', 
      value: stats.resolved, 
      icon: CheckCircle2,
      color: 'text-emerald-500',
    },
    { 
      key: 'closed', 
      label: isArabic ? '📌 مغلقة' : '📌 Closed', 
      value: stats.closed, 
      icon: XCircle,
      color: 'text-[#f9a8d4]',
    },
  ], [stats, isArabic]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((item) => (
        <div 
          key={item.key} 
          className="group relative bg-[#fbcfe8] dark:bg-[#fbcfe8]/20 rounded-xl border-3 border-[#f9a8d4]/70 dark:border-[#f9a8d4]/40 hover:border-[#d81b60]/60 shadow-sm hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#f9a8d4]/10 to-[#fbcfe8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-[#fbcfe8]/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative flex items-center justify-between p-3">
            <div>
              <p className="text-[10px] font-medium text-[#2a655f] dark:text-[#f9a8d4] uppercase tracking-wider">
                {item.label}
              </p>
              <p className={`text-xl font-bold mt-0.5 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                {item.value}
              </p>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">
                {stats.total > 0 ? `${Math.round((item.value / stats.total) * 100)}%` : '0%'}
              </p>
            </div>
            <div className={`h-9 w-9 rounded-lg bg-[#f9a8d4]/30 dark:bg-[#f9a8d4]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30`}>
              <item.icon className={`h-4 w-4 ${item.color}`} />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#d81b60] to-[#f9a8d4] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
        </div>
      ))}
    </div>
  );
});
StatsCards.displayName = 'StatsCards';

// ============================================================
// ✅ مكون صف الشكوى - مثل CustomersPage
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
      className="border-slate-100 dark:border-slate-800 hover:bg-[#f9a8d4]/15 dark:hover:bg-[#f9a8d4]/10 transition-colors duration-300 group border-b-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10 cursor-pointer"
      onClick={() => onToggle(complaint.id)}
    >
      {/* ✅ الترتيب */}
      <TableCell className="text-center">
        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${rankBg} ${rankColor} font-bold text-sm transition-all duration-300 group-hover:scale-110`}>
          {rankEmoji}
        </span>
      </TableCell>
      
      {/* ✅ الموضوع */}
      <TableCell className="font-semibold text-slate-900 dark:text-white text-right border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
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
          <span className="h-1 w-1 rounded-full bg-[#2a655f]/20" />
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-[#2a655f]" />
            {new Date(complaint.created_at).toLocaleDateString(
              isArabic ? "ar-SA" : "en-US",
              { day: 'numeric', month: 'short', year: 'numeric' }
            )}
          </span>
        </div>
      </TableCell>
      
      {/* ✅ رقم الطلب */}
      <TableCell className="text-slate-600 dark:text-slate-300 text-center font-mono border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
        <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20">
          #{complaint.order_id?.slice(0, 12) || '—'}
        </Badge>
      </TableCell>
      
      {/* ✅ الحالة */}
      <TableCell className="text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
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
              className="h-8 w-8 rounded-lg hover:bg-[#2a655f]/10 hover:text-[#2a655f] transition-all duration-200 hover:scale-105 border-2 border-[#f9a8d4]/30"
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
            className="h-8 w-8 rounded-lg hover:bg-[#f9a8d4]/30 transition-all duration-200 hover:scale-105 border-2 border-[#f9a8d4]/30"
            onClick={(e) => {
              e.stopPropagation();
              window.open(`/admin/complaints/${complaint.id}`, '_blank');
            }}
            title={isArabic ? "عرض التفاصيل" : "View Details"}
          >
            <Eye className="h-4 w-4 text-[#2a655f]" />
          </Button>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-[#2a655f] group-hover:scale-110 transition-transform" />
          ) : (
            <ChevronDown className="h-5 w-5 text-[#2a655f] group-hover:scale-110 transition-transform" />
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
    <div className="px-4 pb-4 pt-3 border-t-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 animate-in slide-in-from-top-2 duration-300 bg-gradient-to-r from-[#f9a8d4]/5 to-[#fbcfe8]/5 dark:from-[#f9a8d4]/5 dark:to-[#fbcfe8]/5 rounded-b-2xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* ✅ معلومات العميل */}
        <div className="p-4 bg-white/70 dark:bg-slate-900/70 rounded-xl border-2 border-[#f9a8d4]/40">
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
                  {new Date(complaint.resolved_at).toLocaleDateString(
                    isArabic ? "ar-SA" : "en-US",
                    { day: 'numeric', month: 'short', year: 'numeric' }
                  )}
                </p>
              )}
            </div>
          )}
          
          {/* ✅ زر الرد السريع */}
          {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] hover:from-[#3a8a82] hover:to-[#f48fb1] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#f9a8d4]/30 rounded-xl border-2 border-[#f9a8d4]/50"
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState<"created_at" | "status">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // ============================================================
  // ✅ فلترة الشكاوى - محسّنة
  // ============================================================
  const filteredComplaints = useMemo(() => {
    let result = complaints;
    
    if (filterStatus !== "all") {
      result = result.filter((c: any) => c.status === filterStatus);
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

    result = [...result].sort((a: any, b: any) => {
      let aVal = a[sortBy] || '';
      let bVal = b[sortBy] || '';
      if (sortBy === 'status') {
        const statusOrder = { pending: 0, in_progress: 1, resolved: 2, closed: 3 };
        aVal = statusOrder[a.status] || 0;
        bVal = statusOrder[b.status] || 0;
      }
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    
    return result;
  }, [complaints, searchQuery, filterStatus, sortBy, sortOrder]);

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
      'تاريخ الشكوى': new Date(c.created_at).toLocaleDateString('ar-SA'),
      'رد الإدارة': c.admin_response || '—',
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'الشكاوى');
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 20 }, { wch: 30 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `الشكاوى_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
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
        <p style="text-align: center; color: #64748b;">تاريخ التقرير: ${new Date().toLocaleDateString('ar-SA')}</p>
        <table>
          <thead><tr><th>#</th><th>الموضوع</th><th>العميل</th><th>رقم الطلب</th><th>الحالة</th><th>التاريخ</th></tr></thead>
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
          <td>${new Date(c.created_at).toLocaleDateString('ar-SA')}</td>
        </tr>
      `;
    });
    htmlContent += `
          </tbody></table>
          <div class="footer">إجمالي الشكاوى: ${filteredComplaints.length}</div>
        </body></html>
    `;
    const blob = new Blob([htmlContent], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `الشكاوى_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
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
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#f9a8d4]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-amber-500/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <AlertTriangle className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {isArabic ? "الشكاوى" : "Complaints"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 hover:bg-amber-100/50 transition-colors">
              <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
              <span className="text-amber-600 dark:text-amber-400 font-medium">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">{isArabic ? "قيد المراجعة" : "pending"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.resolved}</span>
              <span className="text-xs text-muted-foreground">{isArabic ? "تم الحل" : "resolved"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="text-xs text-[#2a655f] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isArabic ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={exportToExcel}
            disabled={filteredComplaints.length === 0}
            className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300 hover:scale-105"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" />
            Excel
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToWord}
            disabled={filteredComplaints.length === 0}
            className="rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#f9a8d4]/50 transition-all duration-300 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-1.5" />
            Word
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/10 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" />
            {isArabic ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <StatsCards stats={stats} isArabic={isArabic} />

      {/* ===== SEARCH & FILTERS - مثل CustomersPage ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#f9a8d4] transition-colors duration-300" />
          <Input
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder={isArabic ? "🔍 بحث عن شكوى..." : "🔍 Search complaints..."}
            className="ps-9 h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value) => {
            setFilterStatus(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] hover:border-[#f9a8d4]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={isArabic ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">{isArabic ? "📋 الكل" : "📋 All"}</SelectItem>
            <SelectItem value="pending" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">⏳ {isArabic ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="in_progress" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🔄 {isArabic ? "قيد المعالجة" : "In Progress"}</SelectItem>
            <SelectItem value="resolved" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">✅ {isArabic ? "تم الحل" : "Resolved"}</SelectItem>
            <SelectItem value="closed" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📌 {isArabic ? "مغلقة" : "Closed"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortBy}
          onValueChange={(value: any) => {
            setSortBy(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[140px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] hover:border-[#f9a8d4]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={isArabic ? "ترتيب حسب" : "Sort by"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <SelectItem value="created_at" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📅 {isArabic ? "التاريخ" : "Date"}</SelectItem>
            <SelectItem value="status" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📊 {isArabic ? "الحالة" : "Status"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={sortOrder}
          onValueChange={(value: any) => {
            setSortOrder(value);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] hover:border-[#f9a8d4]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <SelectValue placeholder={isArabic ? "ترتيب" : "Order"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <SelectItem value="desc" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">⬇️ {isArabic ? "تنازلي" : "Descending"}</SelectItem>
            <SelectItem value="asc" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">⬆️ {isArabic ? "تصاعدي" : "Ascending"}</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(limit)}
          onValueChange={(value) => {
            setLimit(Number(value));
            setPage(1);
          }}
        >
          <SelectTrigger className="w-[100px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-[#1e293b] hover:border-[#f9a8d4]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">{isArabic ? "عدد" : "Show"}</span>
              <SelectValue placeholder="10" />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
            <SelectItem value="6" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">6</SelectItem>
            <SelectItem value="10" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">10</SelectItem>
            <SelectItem value="20" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">20</SelectItem>
            <SelectItem value="50" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">50</SelectItem>
            <SelectItem value="100" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">100</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setFilterStatus("all");
            setSortBy("created_at");
            setSortOrder("desc");
            setPage(1);
          }}
          className="h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/10 transition-all duration-300 group"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {isArabic ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ===== TABLE - مثل CustomersPage ===== */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-dashed border-[#f9a8d4]/40 shadow-lg hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-300">
          <div className="h-20 w-20 rounded-full bg-[#fbcfe8]/60 dark:bg-[#fbcfe8]/20 flex items-center justify-center mx-auto mb-4 animate-bounce-slow border-3 border-[#f9a8d4]/70">
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
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-xl border-3 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/10 transition-all duration-300"
            >
              {isArabic ? "مسح البحث" : "Clear search"}
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-gradient-to-r from-[#f9a8d4]/30 via-[#fbcfe8]/20 to-[#f9a8d4]/30 dark:from-[#f9a8d4]/20 dark:via-[#fbcfe8]/10 dark:to-[#f9a8d4]/20 border-b-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30">
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[60px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "الترتيب" : "Rank"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-right min-w-[200px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "الموضوع" : "Subject"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                      {isArabic ? "رقم الطلب" : "Order ID"}
                    </TableHead>
                    <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[120px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
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
                            <TableCell colSpan={5} className="p-0 border-none">
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

            {/* ===== Pagination - مثل CustomersPage ===== */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  {filteredComplaints.length === 0 ? (
                    <span>{isArabic ? "لا توجد شكاوى" : "No complaints"}</span>
                  ) : (
                    <span>
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
                    className="h-8 w-8 p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300 disabled:opacity-50"
                  >
                    <span className="text-xs font-bold">«</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="h-8 w-8 p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300 disabled:opacity-50"
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
                          className={`h-8 min-w-[32px] p-0 rounded-xl text-xs font-medium transition-all duration-300 ${
                            page === pageNum
                              ? "bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] text-white shadow-md shadow-[#2a655f]/25 border-2 border-white/30"
                              : "border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 hover:text-[#2a655f]"
                          }`}
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
                          className="h-8 min-w-[32px] p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 text-xs"
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
                    className="h-8 w-8 p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300 disabled:opacity-50"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    disabled={page === totalPages}
                    className="h-8 w-8 p-0 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300 disabled:opacity-50"
                  >
                    <span className="text-xs font-bold">»</span>
                  </Button>
                </div>
              </div>
            )}

            {/* ===== Footer ===== */}
            <div className="px-4 py-2 border-t-3 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#f9a8d4]/15 via-[#fbcfe8]/10 to-[#f9a8d4]/15 dark:from-[#f9a8d4]/10 dark:via-[#fbcfe8]/5 dark:to-[#f9a8d4]/10">
              <span>
                {isArabic
                  ? `عرض ${paginatedComplaints.length} من ${filteredComplaints.length} شكوى (إجمالي ${complaints.length})`
                  : `Showing ${paginatedComplaints.length} of ${filteredComplaints.length} complaints (total ${complaints.length})`}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20">
                  {sortBy === "created_at" ? (isArabic ? "📅 التاريخ" : "📅 Date") :
                   (isArabic ? "📊 الحالة" : "📊 Status")}
                  {sortOrder === "desc" ? " ↓" : " ↑"}
                </Badge>
                {searchQuery && (
                  <Badge variant="secondary" className="bg-[#f9a8d4]/10 text-[#2a655f] border-2 border-[#f9a8d4]/20">
                    🔍 {searchQuery}
                  </Badge>
                )}
                {filterStatus !== "all" && (
                  <Badge variant="secondary" className="bg-[#f9a8d4]/10 text-[#2a655f] border-2 border-[#f9a8d4]/20">
                    {getStatusBadge(filterStatus).label}
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ===== REPLY DIALOG ===== */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-3 border-[#f9a8d4]/60 shadow-2xl shadow-[#f9a8d4]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => setReplyDialogOpen(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
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
                  <SelectTrigger className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300">
                    <SelectValue placeholder={isArabic ? "اختر حالة" : "Select status"} />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-3 border-[#f9a8d4]/40">
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
                  className="min-h-[100px] rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
                />
              </div>
            </div>

            <DialogFooter className="gap-2 pt-4 border-t-3 border-[#f9a8d4]/30">
              <Button
                variant="outline"
                onClick={() => setReplyDialogOpen(false)}
                className="rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleUpdateComplaint}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] hover:from-[#3a8a82] hover:to-[#f48fb1] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#f9a8d4]/30 rounded-xl px-6 border-2 border-[#f9a8d4]/50"
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
      `}</style>
    </div>
  );
}

export default AdminComplaints;