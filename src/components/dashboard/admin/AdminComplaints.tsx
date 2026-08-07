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
  AlertTriangle, CheckCircle2, Clock, XCircle, 
  Loader2, Search, Filter, ChevronDown, ChevronUp,
  Reply, Eye, Send, User, Calendar,
  Package, Phone, Sparkles, Zap, Shield,
  TrendingUp, TrendingDown, Users, MessageSquare,
  Check, Ban, RefreshCw
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ============================================================
// ✅ مكون إحصائيات سريعة - محسّن
// ============================================================
const StatsCards = React.memo(({ stats, isArabic }: { stats: any; isArabic: boolean }) => {
  const items = useMemo(() => [
    { 
      key: 'total', 
      label: isArabic ? '📊 الإجمالي' : '📊 Total', 
      value: stats.total, 
      gradient: "from-[#0d2e2a] to-[#1a4f4a]",
      icon: AlertTriangle,
      change: isArabic ? 'جميع الشكاوى' : 'All complaints',
    },
    { 
      key: 'pending', 
      label: isArabic ? '⏳ قيد المراجعة' : '⏳ Pending', 
      value: stats.pending, 
      gradient: "from-[#1a4f4a] to-[#2d6b63]",
      icon: Clock,
      change: stats.total > 0 ? `${Math.round((stats.pending / stats.total) * 100)}%` : '0%',
    },
    { 
      key: 'in_progress', 
      label: isArabic ? '🔄 قيد المعالجة' : '🔄 In Progress', 
      value: stats.inProgress, 
      gradient: "from-[#2d6b63] to-[#4a9f95]",
      icon: Loader2,
      change: stats.total > 0 ? `${Math.round((stats.inProgress / stats.total) * 100)}%` : '0%',
    },
    { 
      key: 'resolved', 
      label: isArabic ? '✅ تم الحل' : '✅ Resolved', 
      value: stats.resolved, 
      gradient: "from-[#4a9f95] to-[#6bb5aa]",
      icon: CheckCircle2,
      change: stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}%` : '0%',
    },
    { 
      key: 'closed', 
      label: isArabic ? '📌 مغلقة' : '📌 Closed', 
      value: stats.closed, 
      gradient: "from-[#6bb5aa] to-[#8dcfc6]",
      icon: XCircle,
      change: stats.total > 0 ? `${Math.round((stats.closed / stats.total) * 100)}%` : '0%',
    },
  ], [stats, isArabic]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map((item) => (
        <div
          key={item.key}
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
              <p className="text-[10px] opacity-80 font-medium tracking-wider uppercase">{item.label}</p>
              <p className="text-2xl font-bold mt-0.5">{item.value}</p>
              <p className="text-[10px] opacity-70 mt-0.5">{item.change}</p>
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
// ✅ مكون صف الشكوى - محسّن
// ============================================================
const ComplaintRow = React.memo(({ 
  complaint, 
  isExpanded, 
  onToggle, 
  onReply,
  isArabic,
  getStatusBadge,
}: any) => {
  const status = getStatusBadge(complaint.status);
  const StatusIcon = status.icon;
  const user = complaint.profiles;
  
  return (
    <div className="bg-white dark:bg-[#1e293b] rounded-2xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 overflow-hidden shadow-lg shadow-[#0d2e2a]/5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300">
      
      {/* ===== HEADER ===== */}
      <div
        className="p-4 cursor-pointer hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/10 transition-colors group"
        onClick={() => onToggle(complaint.id)}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-[#0d2e2a] dark:text-white truncate group-hover:text-[#1a4f4a] transition-colors">
                {complaint.subject}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                <span className="flex items-center gap-1">
                  <User className="h-3 w-3 text-[#2d6b63]" />
                  {user?.full_name || isArabic ? "مستخدم" : "User"}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/20" />
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-[#2d6b63]" />
                  {new Date(complaint.created_at).toLocaleDateString(
                    isArabic ? "ar-SA" : "en-US",
                    { day: 'numeric', month: 'short', year: 'numeric' }
                  )}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/20" />
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3 text-[#2d6b63]" />
                  {complaint.orders?.listings?.title_ar || isArabic ? "طلب" : "Order"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Badge className={cn("border-0 flex items-center gap-1.5 px-3 py-1 text-xs", status.bg, status.color)}>
              <StatusIcon className="h-3 w-3" />
              {status.label}
            </Badge>
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-[#0d2e2a] group-hover:scale-110 transition-transform" />
            ) : (
              <ChevronDown className="h-5 w-5 text-[#0d2e2a] group-hover:scale-110 transition-transform" />
            )}
          </div>
        </div>
      </div>

      {/* ===== DETAILS ===== */}
      {isExpanded && (
        <div className="px-4 pb-4 pt-2 border-t border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 animate-in slide-in-from-top-2 duration-300">
          <div className="grid gap-4">
            
            {/* ✅ معلومات العميل */}
            <div className="p-4 bg-gradient-to-r from-[#0d2e2a]/5 to-[#1a4f4a]/5 dark:from-[#0d2e2a]/10 dark:to-[#1a4f4a]/10 rounded-xl border border-[#0d2e2a]/10">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Users className="h-3 w-3 text-[#2d6b63]" />
                {isArabic ? "معلومات العميل" : "Customer Information"}
              </p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-semibold text-[#0d2e2a] dark:text-white">{user?.full_name || "-"}</p>
                  {user?.phone && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3 text-[#2d6b63]" />
                      {user.phone}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">
                    {isArabic ? "رقم الطلب" : "Order ID"}
                  </p>
                  <p className="text-xs font-mono font-semibold text-[#0d2e2a] dark:text-[#4a9f95]">
                    #{complaint.order_id?.slice(0, 12) || '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* ✅ تفاصيل الشكوى */}
            <div className="p-4 bg-amber-50/30 dark:bg-amber-950/10 rounded-xl border border-amber-200/30 dark:border-amber-800/30">
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* ✅ رد الأدمن */}
            {complaint.admin_response && (
              <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/10 rounded-xl border border-emerald-200/30 dark:border-emerald-800/30 animate-in slide-in-from-left-2 duration-300">
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

            {/* ✅ أزرار الإجراءات */}
            <div className="flex flex-wrap gap-2 pt-1">
              {complaint.status !== 'resolved' && complaint.status !== 'closed' && (
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0d2e2a]/30 rounded-xl"
                  onClick={() => onReply(complaint)}
                >
                  <Reply className="h-4 w-4 mr-2" />
                  {isArabic ? "رد على الشكوى" : "Reply"}
                </Button>
              )}
              
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 hover:scale-105"
                onClick={() => {
                  window.open(`/admin/complaints/${complaint.id}`, '_blank');
                }}
              >
                <Eye className="h-4 w-4 mr-2" />
                {isArabic ? "عرض التفاصيل" : "View Details"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
ComplaintRow.displayName = 'ComplaintRow';

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
    
    return result;
  }, [complaints, searchQuery, filterStatus]);

  // ============================================================
  // ✅ إحصائيات الشكاوى - محسّنة
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
        color: "text-amber-600",
        bg: "bg-amber-500/10 border-amber-500/20",
        icon: Clock
      },
      in_progress: { 
        label: isArabic ? "🔄 قيد المعالجة" : "🔄 In Progress", 
        color: "text-[#1a4f4a]",
        bg: "bg-[#1a4f4a]/10 border-[#1a4f4a]/20",
        icon: Loader2
      },
      resolved: { 
        label: isArabic ? "✅ تم الحل" : "✅ Resolved", 
        color: "text-[#2d6b63]",
        bg: "bg-[#2d6b63]/10 border-[#2d6b63]/20",
        icon: CheckCircle2
      },
      closed: { 
        label: isArabic ? "📌 مغلقة" : "📌 Closed", 
        color: "text-[#6bb5aa]",
        bg: "bg-[#6bb5aa]/10 border-[#6bb5aa]/20",
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
  // ✅ حالة التحميل
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-[#0d2e2a]" />
          <p className="text-sm text-muted-foreground">
            {isArabic ? "جار تحميل الشكاوى..." : "Loading complaints..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <AlertTriangle className="h-5 w-5 text-white animate-float" />
            </div>
            <span className="bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] bg-clip-text text-transparent">
              {isArabic ? "إدارة الشكاوى" : "Complaints"}
            </span>
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 animate-pulse" />
              {isArabic ? 'مباشر' : 'Live'}
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {isArabic
              ? `إدارة جميع الشكاوى (${filteredComplaints.length} من ${stats.total})`
              : `Manage all complaints (${filteredComplaints.length} of ${stats.total})`}
            <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
            <span className="text-xs text-[#2d6b63] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isArabic ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 hover:scale-105"
        >
          <RefreshCw className="h-4 w-4 mr-2 animate-spin-slow" />
          {isArabic ? "تحديث" : "Refresh"}
        </Button>
      </div>

      {/* ===== STATS CARDS ===== */}
      <StatsCards stats={stats} isArabic={isArabic} />

      {/* ===== FILTERS ===== */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm group">
          <Search className={`absolute inset-y-0 my-auto ${isArabic ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#0d2e2a] transition-colors duration-300`} />
          <Input
            placeholder={isArabic ? "🔍 بحث عن شكوى..." : "🔍 Search complaint..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${isArabic ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute ${isArabic ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors`}
            >
              <XCircle className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] hover:border-[#0d2e2a]/40 transition-colors">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#0d2e2a]" />
              <SelectValue placeholder={isArabic ? "جميع الحالات" : "All status"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{isArabic ? "📋 جميع الحالات" : "📋 All"}</SelectItem>
            <SelectItem value="pending">⏳ {isArabic ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="in_progress">🔄 {isArabic ? "قيد المعالجة" : "In Progress"}</SelectItem>
            <SelectItem value="resolved">✅ {isArabic ? "تم الحل" : "Resolved"}</SelectItem>
            <SelectItem value="closed">📌 {isArabic ? "مغلقة" : "Closed"}</SelectItem>
          </SelectContent>
        </Select>

        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery("")}
            className="h-10 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 transition-all duration-300"
          >
            <XCircle className="h-4 w-4 mr-1" />
            {isArabic ? "مسح" : "Clear"}
          </Button>
        )}
      </div>

      {/* ===== COMPLAINTS LIST ===== */}
      {filteredComplaints.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#0d2e2a]/30 shadow-lg">
          <div className="h-20 w-20 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <AlertTriangle className="h-10 w-10 text-amber-500/40" />
          </div>
          <h3 className="text-xl font-semibold text-[#0d2e2a] dark:text-white">
            {isArabic ? "لا توجد شكاوى" : "No complaints"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {isArabic 
              ? "لم يتم تقديم أي شكاوى حتى الآن" 
              : "No complaints have been submitted yet"}
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchQuery("")}
              className="mt-4 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 transition-all duration-300"
            >
              {isArabic ? "مسح البحث" : "Clear search"}
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComplaints.map((complaint: any) => (
            <ComplaintRow
              key={complaint.id}
              complaint={complaint}
              isExpanded={expandedId === complaint.id}
              onToggle={toggleExpand}
              onReply={openReplyDialog}
              isArabic={isArabic}
              getStatusBadge={getStatusBadge}
            />
          ))}
        </div>
      )}

      {/* ===== REPLY DIALOG ===== */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="max-w-lg rounded-2xl border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl text-[#0d2e2a] dark:text-white">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center">
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
              <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                {isArabic ? "الحالة الجديدة" : "New Status"}
              </Label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="rounded-xl border-[#0d2e2a]/20">
                  <SelectValue placeholder={isArabic ? "اختر حالة" : "Select status"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">⏳ {isArabic ? "قيد المراجعة" : "Pending"}</SelectItem>
                  <SelectItem value="in_progress">🔄 {isArabic ? "قيد المعالجة" : "In Progress"}</SelectItem>
                  <SelectItem value="resolved">✅ {isArabic ? "تم الحل" : "Resolved"}</SelectItem>
                  <SelectItem value="closed">📌 {isArabic ? "مغلقة" : "Closed"}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                {isArabic ? "الرد (اختياري)" : "Response (Optional)"}
              </Label>
              <Textarea
                value={adminResponse}
                onChange={(e) => setAdminResponse(e.target.value)}
                placeholder={isArabic 
                  ? "اكتب ردك على الشكوى..." 
                  : "Write your response to the complaint..."}
                className="min-h-[100px] rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setReplyDialogOpen(false)}
              className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300"
            >
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleUpdateComplaint}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0d2e2a]/30 rounded-xl px-6"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isArabic ? "تحديث وإرسال" : "Update & Send"}
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

export default AdminComplaints;