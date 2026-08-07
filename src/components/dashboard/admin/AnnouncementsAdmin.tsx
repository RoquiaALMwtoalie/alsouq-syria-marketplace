// src/components/dashboard/admin/AnnouncementsAdmin.tsx

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useApp, useT } from "@/lib/i18n";
import { useAllAnnouncements, useSaveAnnouncement, useDeleteAnnouncement, type AnnouncementRow } from "@/lib/queries";
import { toast } from "sonner";
import { 
  Plus, Pencil, Trash2, AlertTriangle, X, XCircle,
  Megaphone, Sparkles, Zap, Shield, Eye, EyeOff,
  Link2, Hash, GripVertical, CheckCircle2, RefreshCw,
  ChevronLeft, ChevronRight, Layers, FileText, FileSpreadsheet,
  Loader2, Search, Filter, ArrowUpDown, Flame, Crown, Star
} from "lucide-react";
import { cn } from "@/lib/utils";

// ============================================================
// ✅ مؤشر حيوي
// ============================================================
const LiveIndicator = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2d6b63] opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0d2e2a]" />
  </span>
);

// ============================================================
// ✅ Stat Card بألوان النظام
// ============================================================
const StatCard = ({ 
  label, 
  value, 
  gradient,
  bg,
  glow,
  icon: Icon, 
  animation 
}: { 
  label: string; 
  value: number; 
  gradient: string;
  bg: string;
  glow: string;
  icon: any; 
  animation?: string;
}) => (
  <div className={cn(
    "group bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 p-4 shadow-lg hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1 relative overflow-hidden"
  )}>
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#0d2e2a]/5 blur-3xl animate-pulse" />
    </div>
    <div className="flex items-center justify-between relative">
      <div>
        <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#0d2e2a] transition-colors">{value}</p>
      </div>
      <div className={`h-10 w-10 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg ${glow}`}>
        <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon className={cn(
            "h-3.5 w-3.5 text-white",
            animation || "animate-float"
          )} />
        </div>
      </div>
    </div>
    <div className="mt-2 h-0.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 animate-shimmer`} 
        style={{ width: `${Math.min(100, value / 10 * 100)}%` }}
      />
    </div>
  </div>
);

export function AnnouncementsAdmin() {
  const app = useApp();
  const isRTL = app.lang === 'ar';
  const { data: items = [], isLoading, refetch } = useAllAnnouncements();
  const save = useSaveAnnouncement();
  const del = useDeleteAnnouncement();
  const [editing, setEditing] = useState<Partial<AnnouncementRow> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetText, setDeleteTargetText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // ============================================================
  // ✅ إحصائيات
  // ============================================================
  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((a) => a.active).length;
    const inactive = items.filter((a) => !a.active).length;
    return { total, active, inactive };
  }, [items]);

  // ============================================================
  // ✅ فلترة
  // ============================================================
  const filteredItems = useMemo(() => {
    let result = items;
    
    if (filterStatus === "active") {
      result = result.filter((a) => a.active);
    } else if (filterStatus === "inactive") {
      result = result.filter((a) => !a.active);
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((a) => {
        return (
          a.text_ar?.toLowerCase().includes(q) ||
          a.text_en?.toLowerCase().includes(q) ||
          a.link_url?.toLowerCase().includes(q)
        );
      });
    }
    
    return result;
  }, [items, searchQuery, filterStatus]);

  function openNew() {
    setEditing({
      text_ar: "",
      text_en: "",
      link_url: "",
      active: true,
      sort_order: items.length,
    });
  }

  async function handleSave() {
    if (!editing?.text_ar) {
      toast.error(isRTL ? "النص العربي مطلوب" : "Arabic text required");
      return;
    }
    try {
      await save.mutateAsync(editing as any);
      toast.success(isRTL ? "✅ تم الحفظ" : "✅ Saved");
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  function openDeleteDialog(id: string, text: string) {
    setDeleteTargetId(id);
    setDeleteTargetText(text);
    setDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      await del.mutateAsync(deleteTargetId);
      toast.success(isRTL ? "✅ تم حذف الإعلان" : "✅ Announcement deleted");
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetText("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  // ============================================================
  // ✅ حالة التحميل
  // ============================================================
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className="h-12 w-12 rounded-full border-4 border-[#0d2e2a]/20 border-t-[#0d2e2a] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-[#0d2e2a] animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* ============================================================
      // ✅ HEADER
      // ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
              <Megaphone className="h-5 w-5 text-white animate-float" />
            </div>
            <span className="bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] bg-clip-text text-transparent">
              {isRTL ? "شريط الإعلانات" : "Announcement Bar"}
            </span>
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 animate-pulse" />
              {isRTL ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {isRTL
              ? `إدارة شريط الإعلانات (${filteredItems.length} من ${items.length})`
              : `Manage announcement bar (${filteredItems.length} of ${items.length})`}
            <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
            <span className="text-xs text-[#2d6b63] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isRTL ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-[#0d2e2a]/20 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="rounded-lg h-9 px-3 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 transition-all duration-300 hover:scale-105"
            >
              <RefreshCw className="h-4 w-4 animate-spin-slow" />
            </Button>
          </div>
          <Button
            onClick={openNew}
            className="gap-2 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white shadow-lg shadow-[#0d2e2a]/30 hover:shadow-xl transition-all duration-300 rounded-xl hover:scale-105"
          >
            <Plus className="h-4 w-4" />
            {isRTL ? "إعلان جديد" : "New announcement"}
          </Button>
          <Badge className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#0d2e2a]/30 animate-pulse">
            <Sparkles className="h-3 w-3 mr-1" />
            {isRTL ? 'لوحة تحكم' : 'Dashboard'}
          </Badge>
        </div>
      </div>

      {/* ============================================================
      // ✅ STATS CARDS
      // ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard 
          label={isRTL ? 'إجمالي الإعلانات' : 'Total Announcements'} 
          value={stats.total} 
          gradient="from-[#0d2e2a] to-[#1a4f4a]"
          bg="bg-[#0d2e2a]/10"
          glow="shadow-[#0d2e2a]/20"
          icon={Megaphone}
          animation="animate-float"
        />
        <StatCard 
          label={isRTL ? 'نشطة' : 'Active'} 
          value={stats.active} 
          gradient="from-[#2d6b63] to-[#4a9f95]"
          bg="bg-[#2d6b63]/10"
          glow="shadow-[#2d6b63]/20"
          icon={CheckCircle2}
          animation="animate-bounce-slow"
        />
        <StatCard 
          label={isRTL ? 'مخفية' : 'Inactive'} 
          value={stats.inactive} 
          gradient="from-[#6bb5aa] to-[#4a9f95]"
          bg="bg-[#6bb5aa]/10"
          glow="shadow-[#6bb5aa]/20"
          icon={EyeOff}
          animation="animate-float"
        />
      </div>

      {/* ============================================================
      // ✅ SEARCH & FILTERS
      // ============================================================ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-[#0d2e2a] transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "🔍 بحث عن إعلان..." : "🔍 Search announcements..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300`}
          />
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value: any) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 bg-white dark:bg-[#1e293b] hover:border-[#0d2e2a]/40 transition-colors">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-[#0d2e2a]" />
              <SelectValue placeholder={isRTL ? "جميع الإعلانات" : "All"} />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">📋 {isRTL ? "جميع" : "All"}</SelectItem>
            <SelectItem value="active">✅ {isRTL ? "نشطة" : "Active"}</SelectItem>
            <SelectItem value="inactive">🚫 {isRTL ? "مخفية" : "Inactive"}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setFilterStatus("all");
          }}
          className="h-10 rounded-xl border-[#0d2e2a]/20 text-[#0d2e2a] hover:bg-[#0d2e2a]/10 hover:border-[#0d2e2a]/40 transition-all duration-300 hover:scale-105"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {isRTL ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ============================================================
      // ✅ TABLE
      // ============================================================ */}
      <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 overflow-hidden shadow-lg shadow-[#0d2e2a]/5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 hover:bg-transparent bg-gradient-to-r from-[#0d2e2a]/5 to-[#1a4f4a]/5">
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-right min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-3.5 w-3.5" />
                    {isRTL ? "النص" : "Text"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[150px]">
                  <div className="flex items-center justify-center gap-2">
                    <Link2 className="h-3.5 w-3.5" />
                    {isRTL ? "الرابط" : "Link"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[80px]">
                  <div className="flex items-center justify-center gap-2">
                    <Hash className="h-3.5 w-3.5" />
                    {isRTL ? "الترتيب" : "Order"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[100px]">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5" />
                    {isRTL ? "الحالة" : "Status"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-medium text-[#0d2e2a] dark:text-[#4a9f95] text-center min-w-[160px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 animate-pulse" />
                    {isRTL ? "إجراءات" : "Actions"}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-16 w-16 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center animate-bounce-slow">
                        <Megaphone className="h-8 w-8 text-[#0d2e2a]/40" />
                      </div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {isRTL ? "لا توجد إعلانات" : "No announcements"}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {isRTL 
                          ? "ابدأ بإضافة أول إعلان لشريط الإعلانات" 
                          : "Start by adding your first announcement"}
                      </p>
                      <Button
                        onClick={openNew}
                        className="mt-2 gap-2 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white rounded-xl transition-all duration-300 hover:scale-105"
                      >
                        <Plus className="h-4 w-4" />
                        {isRTL ? "إضافة إعلان" : "Add announcement"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((a, index) => (
                  <TableRow 
                    key={a.id} 
                    className="border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/5 dark:hover:bg-[#0d2e2a]/10 transition-all duration-300 group"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                          <Megaphone className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-[#0d2e2a] transition-colors">
                            {a.text_ar}
                          </div>
                          {a.text_en && (
                            <div className="text-xs text-slate-500 dark:text-slate-400" dir="ltr">
                              {a.text_en}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell dir="ltr" className="text-xs text-slate-500 dark:text-slate-400 text-center">
                      {a.link_url ? (
                        <a 
                          href={a.link_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#2d6b63] hover:underline flex items-center justify-center gap-1 transition-colors"
                        >
                          <Link2 className="h-3 w-3" />
                          {a.link_url.length > 30 ? a.link_url.slice(0, 30) + '...' : a.link_url}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-900 dark:text-white text-center font-mono text-sm">
                      <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20">
                        #{a.sort_order}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {a.active ? (
                        <Badge className="bg-[#2d6b63]/10 text-[#2d6b63] border border-[#2d6b63]/20">
                          <CheckCircle2 className="h-3 w-3 mr-1 animate-pulse" />
                          {isRTL ? "نشط" : "Active"}
                        </Badge>
                      ) : (
                        <Badge className="bg-[#6bb5aa]/10 text-[#6bb5aa] border border-[#6bb5aa]/20">
                          <EyeOff className="h-3 w-3 mr-1" />
                          {isRTL ? "مخفي" : "Hidden"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* ✅ زر تعديل - تدرج أخضر النظام */}
                        <Button
                          size="sm"
                          className="rounded-xl h-8 px-3 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 hover:scale-105 group"
                          onClick={() => setEditing({ ...a })}
                          title={isRTL ? "تعديل الإعلان" : "Edit announcement"}
                        >
                          <Pencil className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-300" />
                          <span className="sr-only">{isRTL ? "تعديل" : "Edit"}</span>
                        </Button>

                        {/* ✅ زر حذف - تدرج أحمر احترافي */}
                        <Button
                          size="sm"
                          className="rounded-xl h-8 px-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 group"
                          onClick={() => openDeleteDialog(a.id, a.text_ar)}
                          title={isRTL ? "حذف الإعلان" : "Delete announcement"}
                        >
                          <Trash2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" />
                          <span className="sr-only">{isRTL ? "حذف" : "Delete"}</span>
                        </Button>

                        {/* ✅ مؤشر الترتيب */}
                        <Badge className="bg-[#0d2e2a]/5 text-[#0d2e2a] border border-[#0d2e2a]/10 text-[10px]">
                          <GripVertical className="h-3 w-3 mr-0.5" />
                          {index + 1}
                        </Badge>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* ✅ Footer */}
        <div className="px-4 py-2 border-t border-[#0d2e2a]/10 dark:border-[#0d2e2a]/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-2">
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20">
              {isRTL
                ? `عرض ${filteredItems.length} من ${items.length}`
                : `Showing ${filteredItems.length} of ${items.length}`}
            </Badge>
            <span className="text-[10px] text-[#2d6b63]">
              {isRTL ? `إجمالي ${items.length}` : `Total ${items.length}`}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#0d2e2a]/5 text-[#0d2e2a] border border-[#0d2e2a]/20">
              {filterStatus === "all" && (isRTL ? "جميع" : "All")}
              {filterStatus === "active" && (isRTL ? "نشطة" : "Active")}
              {filterStatus === "inactive" && (isRTL ? "مخفية" : "Inactive")}
            </Badge>
            {searchQuery && (
              <Badge className="bg-[#1a4f4a]/10 text-[#1a4f4a] border border-[#1a4f4a]/20">
                <Search className="h-3 w-3 mr-1" />
                {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
      // ✅ DIALOG - إنشاء/تعديل الإعلان
      // ============================================================ */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-2xl p-6 border border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/20 max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
                {editing?.id ? (
                  <Pencil className="h-4 w-4 text-white" />
                ) : (
                  <Megaphone className="h-4 w-4 text-white" />
                )}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {editing?.id
                    ? isRTL ? "تعديل إعلان" : "Edit announcement"
                    : isRTL ? "إعلان جديد" : "New announcement"}
                </DialogTitle>
                <DialogDescription>
                  {isRTL 
                    ? "أضف أو عدل محتوى الإعلان الذي سيظهر في شريط الإعلانات"
                    : "Add or edit the announcement content for the announcement bar"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {editing && (
            <div className="space-y-4 py-2">
              <div>
                <Label className="font-medium text-[#0d2e2a] flex items-center gap-1">
                  {isRTL ? "النص بالعربية" : "Arabic text"}
                  <span className="text-[#6bb5aa]">*</span>
                </Label>
                <Input
                  value={editing.text_ar || ""}
                  onChange={(e) => setEditing({ ...editing, text_ar: e.target.value })}
                  placeholder={isRTL ? "عروض حصرية على الأزياء حتى 40%" : "Exclusive fashion offers up to 40%"}
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300"
                />
              </div>

              <div>
                <Label className="font-medium text-[#0d2e2a]">
                  {isRTL ? "النص بالإنكليزية" : "English text"}
                </Label>
                <Input
                  value={editing.text_en || ""}
                  onChange={(e) => setEditing({ ...editing, text_en: e.target.value })}
                  dir="ltr"
                  placeholder="Exclusive fashion offers up to 40%"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300"
                />
              </div>

              <div>
                <Label className="font-medium text-[#0d2e2a] flex items-center gap-1">
                  <Link2 className="h-3.5 w-3.5" />
                  {isRTL ? "رابط (اختياري)" : "Link URL (optional)"}
                </Label>
                <Input
                  value={editing.link_url || ""}
                  onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                  dir="ltr"
                  placeholder="/category/offers"
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-medium text-[#0d2e2a] flex items-center gap-1">
                    <Hash className="h-3.5 w-3.5" />
                    {isRTL ? "الترتيب" : "Sort order"}
                  </Label>
                  <Input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, sort_order: Number(e.target.value) })
                    }
                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 transition-all duration-300"
                  />
                </div>
                <div className="flex items-end gap-2">
                  <div className="flex flex-col gap-1 w-full">
                    <Label className="font-medium text-[#0d2e2a]">
                      {isRTL ? "الحالة" : "Status"}
                    </Label>
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-[#0d2e2a]/20 bg-white dark:bg-[#1e293b]">
                      <Switch
                        checked={editing.active ?? true}
                        onCheckedChange={(checked) => 
                          setEditing({ ...editing, active: checked })
                        }
                        className="data-[state=checked]:bg-[#0d2e2a]"
                      />
                      <span className="text-sm text-slate-600 dark:text-slate-300">
                        {editing.active 
                          ? (isRTL ? "نشط" : "Active") 
                          : (isRTL ? "مخفي" : "Inactive")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setEditing(null)}
              className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300"
            >
              <X className="h-4 w-4 mr-1.5" />
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={save.isPending}
              className="gap-2 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white rounded-xl shadow-lg shadow-[#0d2e2a]/30 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {save.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              {isRTL ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DELETE CONFIRMATION DIALOG
      // ============================================================ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md p-6 border border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/20">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-rose-500/10 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
                </DialogTitle>
                <DialogDescription>
                  {isRTL
                    ? "هل أنت متأكد من حذف هذا الإعلان؟ هذا الإجراء لا يمكن التراجع عنه."
                    : "Are you sure you want to delete this announcement? This action cannot be undone."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {deleteTargetText && (
            <div className="p-4 rounded-xl bg-[#0d2e2a]/5 border border-[#0d2e2a]/10">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                <Megaphone className="h-3 w-3" />
                {isRTL ? "الإعلان المراد حذفه:" : "Announcement to delete:"}
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                "{deleteTargetText}"
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
            <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
            <p className="text-xs text-rose-600 dark:text-rose-400">
              {isRTL
                ? "⚠️ هذا الإجراء نهائي ولا يمكن استعادة الإعلان بعد حذفه."
                : "⚠️ This action is permanent and cannot be undone."}
            </p>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteTargetId(null);
                setDeleteTargetText("");
              }}
              className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300"
            >
              <X className="h-4 w-4 mr-1.5" />
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={del.isPending}
              className="rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              {del.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  {isRTL ? "جاري الحذف..." : "Deleting..."}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  {isRTL ? "نعم، احذف" : "Yes, delete"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ CSS Animations
      // ============================================================ */}
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
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default AnnouncementsAdmin;