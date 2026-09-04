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
// ✅ Stat Card بتصميم وردي
// ============================================================
const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  color,
  gradient,
}: { 
  label: string; 
  value: number; 
  icon: any; 
  color: string;
  gradient: string;
}) => (
  <div className="group relative bg-[#fbcfe8] dark:bg-[#fbcfe8]/20 rounded-xl border-3 border-[#f9a8d4]/70 dark:border-[#f9a8d4]/40 hover:border-[#d81b60]/60 shadow-sm hover:shadow-2xl hover:shadow-[#f9a8d4]/20 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-[#f9a8d4]/10 to-[#fbcfe8]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="absolute -top-8 -right-8 h-16 w-16 rounded-full bg-[#fbcfe8]/60 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative flex items-center justify-between p-3">
      <div>
        <p className="text-[10px] font-medium text-[#2a655f] dark:text-[#f9a8d4] uppercase tracking-wider">
          {label}
        </p>
        <p className={`text-xl font-bold mt-0.5 ${color} group-hover:scale-110 transition-transform duration-300`}>
          {value}
        </p>
      </div>
      <div className={`h-9 w-9 rounded-lg bg-[#f9a8d4]/30 dark:bg-[#f9a8d4]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
    </div>
    <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#d81b60] to-[#f9a8d4] scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
  </div>
);

// ============================================================
// ✅ مؤشر حيوي
// ============================================================
const LiveIndicator = () => (
  <span className="relative flex h-2.5 w-2.5">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d81b60] opacity-75" />
    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#2a655f]" />
  </span>
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
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Megaphone className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
        </div>
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
          {isRTL ? "⏳ جاري تحميل الإعلانات..." : "⏳ Loading announcements..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* ============================================================
      // ✅ HEADER - نفس تصميم باقي الصفحات
      // ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative">
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#f9a8d4]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#f9a8d4]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <Megaphone className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {isRTL ? "شريط الإعلانات" : "Announcement Bar"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors">
              <Megaphone className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-[#2a655f] font-medium">{stats.total}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "إجمالي" : "total"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.active}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "نشط" : "active"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9a8d4]/10 border border-[#f9a8d4]/20 hover:bg-[#f9a8d4]/20 transition-colors">
              <EyeOff className="h-3.5 w-3.5 text-[#d81b60]" />
              <span className="text-[#d81b60] font-medium">{stats.inactive}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "مخفي" : "hidden"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="rounded-xl border-2 border-[#2a655f]/20 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/10 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" />
            {isRTL ? "تحديث" : "Refresh"}
          </Button>
          <Button
            onClick={openNew}
            className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-2 border-[#2a655f]/30 hover:border-[#f9a8d4]/50"
          >
            <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            {isRTL ? "إعلان جديد" : "New Announcement"}
          </Button>
        </div>
      </div>

      {/* ============================================================
      // ✅ STATS CARDS - بتصميم وردي
      // ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <StatCard 
          label={isRTL ? 'الإجمالي' : 'Total'} 
          value={stats.total} 
          icon={Megaphone}
          color="text-[#2a655f]"
          gradient="from-[#2a655f] to-[#f9a8d4]"
        />
        <StatCard 
          label={isRTL ? 'نشط' : 'Active'} 
          value={stats.active} 
          icon={CheckCircle2}
          color="text-emerald-500"
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard 
          label={isRTL ? 'مخفي' : 'Inactive'} 
          value={stats.inactive} 
          icon={EyeOff}
          color="text-[#d81b60]"
          gradient="from-[#d81b60] to-[#f9a8d4]"
        />
      </div>

      {/* ============================================================
      // ✅ SEARCH & FILTERS - مع بوردرات وردية
      // ============================================================ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "🔍 بحث عن إعلان..." : "🔍 Search announcements..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 focus:border-[#f9a8d4] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-slate-400 hover:text-[#f9a8d4] transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value: any) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 transition-all duration-300 focus:ring-2 focus:ring-[#f9a8d4]/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={isRTL ? "جميع الإعلانات" : "All"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-3 border-[#2a655f]/20">
            <SelectItem value="all" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">📋 {isRTL ? "جميع" : "All"}</SelectItem>
            <SelectItem value="active" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">✅ {isRTL ? "نشطة" : "Active"}</SelectItem>
            <SelectItem value="inactive" className="hover:bg-[#f9a8d4]/20 hover:text-[#2a655f] transition-colors">🚫 {isRTL ? "مخفية" : "Inactive"}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setFilterStatus("all");
          }}
          className="h-10 rounded-xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 hover:border-[#f9a8d4]/50 hover:bg-[#f9a8d4]/20 transition-all duration-300 group"
        >
          <XCircle className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {isRTL ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ============================================================
      // ✅ TABLE - مع هوفر وردي ونفس تصميم ProductsPage
      // ============================================================ */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-3 border-[#2a655f]/20 dark:border-[#2a655f]/30 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent bg-gradient-to-r from-[#f9a8d4]/30 via-[#fbcfe8]/20 to-[#f9a8d4]/30 dark:from-[#f9a8d4]/20 dark:via-[#fbcfe8]/10 dark:to-[#f9a8d4]/20 border-b-3 border-[#f9a8d4]/50 dark:border-[#f9a8d4]/30">
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-right min-w-[200px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
                    {isRTL ? "النص" : "Text"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[150px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
                    {isRTL ? "الرابط" : "Link"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[80px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
                    {isRTL ? "الترتيب" : "Order"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[100px] border-r-2 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4]" />
                    {isRTL ? "الحالة" : "Status"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-[#f9a8d4] text-center min-w-[160px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-[#2a655f] dark:text-[#f9a8d4] animate-pulse" />
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
                      <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce">
                        <Megaphone className="h-8 w-8 text-[#2a655f]/40" />
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
                        className="mt-2 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 group border-2 border-[#2a655f]/30 hover:border-[#f9a8d4]/50"
                      >
                        <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
                        {isRTL ? "إضافة إعلان" : "Add Announcement"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredItems.map((a, index) => (
                  <TableRow 
                    key={a.id} 
                    className="border-slate-100 dark:border-slate-800 hover:bg-[#f9a8d4]/15 dark:hover:bg-[#f9a8d4]/10 transition-colors duration-300 group border-b-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10"
                  >
                    <TableCell className="border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 border-2 border-[#f9a8d4]/30">
                          <Megaphone className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-[#d81b60] transition-colors">
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
                    <TableCell dir="ltr" className="text-xs text-slate-500 dark:text-slate-400 text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                      {a.link_url ? (
                        <a 
                          href={a.link_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[#2a655f] hover:text-[#d81b60] underline flex items-center justify-center gap-1 transition-colors"
                        >
                          <Link2 className="h-3 w-3" />
                          {a.link_url.length > 30 ? a.link_url.slice(0, 30) + '...' : a.link_url}
                        </a>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-900 dark:text-white text-center font-mono text-sm border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                      <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20">
                        #{a.sort_order}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center border-r-2 border-[#f9a8d4]/20 dark:border-[#f9a8d4]/10">
                      {a.active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20">
                          <CheckCircle2 className="h-3 w-3 mr-1 animate-pulse" />
                          {isRTL ? "نشط" : "Active"}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-2 border-red-500/20">
                          <EyeOff className="h-3 w-3 mr-1" />
                          {isRTL ? "مخفي" : "Hidden"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* ✅ زر تعديل - تدرج زيتوني مع بوردر وردي */}
                        <Button
                          size="sm"
                          className="rounded-xl h-8 px-3 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 group border-2 border-[#2a655f]/30"
                          onClick={() => setEditing({ ...a })}
                          title={isRTL ? "تعديل الإعلان" : "Edit announcement"}
                        >
                          <Pencil className="h-3.5 w-3.5 group-hover:rotate-12 transition-transform duration-300" />
                        </Button>

                        {/* ✅ زر حذف - تدرج أحمر احترافي مع بوردر وردي */}
                        <Button
                          size="sm"
                          className="rounded-xl h-8 px-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 transition-all duration-300 hover:scale-105 group border-2 border-rose-400/50"
                          onClick={() => openDeleteDialog(a.id, a.text_ar)}
                          title={isRTL ? "حذف الإعلان" : "Delete announcement"}
                        >
                          <Trash2 className="h-3.5 w-3.5 group-hover:scale-110 transition-transform duration-300" />
                        </Button>

                        {/* ✅ مؤشر الترتيب */}
                        <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40 text-[10px]">
                          <GripVertical className="h-3 w-3 mr-0.5 text-[#d81b60]" />
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

        {/* ✅ Footer - بنفس تصميم ProductsPage */}
        <div className="px-4 py-2 border-t-3 border-[#f9a8d4]/30 dark:border-[#f9a8d4]/20 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-[#f9a8d4]/10 to-[#fbcfe8]/10">
          <span className="flex items-center gap-2">
            <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
              {isRTL
                ? `عرض ${filteredItems.length} من ${items.length}`
                : `Showing ${filteredItems.length} of ${items.length}`}
            </Badge>
            <span className="text-[10px] text-[#d81b60]">
              {isRTL ? `إجمالي ${items.length}` : `Total ${items.length}`}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
              {filterStatus === "all" && (isRTL ? "جميع" : "All")}
              {filterStatus === "active" && (isRTL ? "نشطة" : "Active")}
              {filterStatus === "inactive" && (isRTL ? "مخفية" : "Inactive")}
            </Badge>
            {searchQuery && (
              <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-[#f9a8d4]/40">
                <Search className="h-3 w-3 mr-1 text-[#d81b60]" />
                {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
      // ✅ DIALOG - إنشاء/تعديل الإعلان - مع بوردرات وردية
      // ============================================================ */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-2xl border-3 border-[#f9a8d4]/40 shadow-2xl shadow-[#f9a8d4]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 max-w-md overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => setEditing(null)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
          </Button>

          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#f9a8d4] flex items-center justify-center shadow-lg shadow-[#f9a8d4]/30 border-2 border-[#f9a8d4]/40">
                  {editing?.id ? (
                    <Pencil className="h-6 w-6 text-white" />
                  ) : (
                    <Megaphone className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {editing?.id
                      ? isRTL ? "تعديل إعلان" : "Edit Announcement"
                      : isRTL ? "إعلان جديد" : "New Announcement"}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {isRTL 
                      ? "أضف أو عدل محتوى الإعلان الذي سيظهر في شريط الإعلانات"
                      : "Add or edit the announcement content for the announcement bar"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {editing && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                    <span className="text-[#2a655f]">📝</span>
                    {isRTL ? "النص بالعربية *" : "Arabic text *"}
                  </Label>
                  <Input
                    value={editing.text_ar || ""}
                    onChange={(e) => setEditing({ ...editing, text_ar: e.target.value })}
                    placeholder={isRTL ? "عروض حصرية على الأزياء حتى 40%" : "Exclusive fashion offers up to 40%"}
                    className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                    <span className="text-[#2a655f]">🌐</span>
                    {isRTL ? "النص بالإنكليزية" : "English text"}
                  </Label>
                  <Input
                    value={editing.text_en || ""}
                    onChange={(e) => setEditing({ ...editing, text_en: e.target.value })}
                    dir="ltr"
                    placeholder="Exclusive fashion offers up to 40%"
                    className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                    <Link2 className="h-4 w-4 text-[#2a655f]" />
                    {isRTL ? "رابط (اختياري)" : "Link URL (optional)"}
                  </Label>
                  <Input
                    value={editing.link_url || ""}
                    onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                    dir="ltr"
                    placeholder="/category/offers"
                    className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <Hash className="h-4 w-4 text-[#2a655f]" />
                      {isRTL ? "الترتيب" : "Sort order"}
                    </Label>
                    <Input
                      type="number"
                      value={editing.sort_order ?? 0}
                      onChange={(e) =>
                        setEditing({ ...editing, sort_order: Number(e.target.value) })
                      }
                      className="rounded-xl border-3 border-[#f9a8d4]/40 focus:border-[#d81b60] focus:ring-2 focus:ring-[#f9a8d4]/30 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f]">
                      {isRTL ? "الحالة" : "Status"}
                    </Label>
                    <div className="flex items-center gap-3 p-2 rounded-xl border-3 border-[#f9a8d4]/40 bg-white dark:bg-[#1e293b] hover:border-[#d81b60]/50 transition-all duration-300">
                      <Switch
                        checked={editing.active ?? true}
                        onCheckedChange={(checked) => 
                          setEditing({ ...editing, active: checked })
                        }
                        className="data-[state=checked]:bg-[#2a655f]"
                      />
                      <span className={`text-sm font-medium ${editing.active ? 'text-emerald-600' : 'text-red-500'}`}>
                        {editing.active 
                          ? (isRTL ? "نشط" : "Active") 
                          : (isRTL ? "مخفي" : "Inactive")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="gap-3 pt-4 border-t-3 border-[#f9a8d4]/30">
              <Button 
                variant="outline" 
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1" />
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={save.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-2 border-[#2a655f]/30"
              >
                {save.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRTL ? "جاري الحفظ..." : "Saving..."}
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-1.5" />
                    {isRTL ? "حفظ" : "Save"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DELETE CONFIRMATION DIALOG - مع بوردرات وردية
      // ============================================================ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md border-3 border-[#d81b60]/40 shadow-2xl shadow-[#d81b60]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-[#f9a8d4]/20 z-20 transition-all duration-300 hover:scale-110 border-2 border-[#f9a8d4]/30"
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteTargetId(null);
              setDeleteTargetText("");
            }}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-[#d81b60]" />
          </Button>

          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isRTL ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                </DialogDescription>
              </div>
            </div>

            {deleteTargetText && (
              <div className="p-4 bg-[#f9a8d4]/10 rounded-xl border-2 border-[#f9a8d4]/30 mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Megaphone className="h-3 w-3 text-[#d81b60]" />
                  {isRTL ? "الإعلان المراد حذفه:" : "Announcement to delete:"}
                </p>
                <p className="font-semibold text-slate-900 dark:text-white group-hover:text-[#d81b60] transition-colors">
                  "{deleteTargetText}"
                </p>
              </div>
            )}

            <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-500/5 border-2 border-rose-500/10">
              <AlertTriangle className="h-4 w-4 text-rose-500 shrink-0" />
              <p className="text-xs text-rose-600 dark:text-rose-400">
                {isRTL
                  ? "⚠️ هذا الإجراء نهائي ولا يمكن استعادة الإعلان بعد حذفه."
                  : "⚠️ This action is permanent and cannot be undone."}
              </p>
            </div>

            <DialogFooter className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetText("");
                }}
                className="flex-1 rounded-xl border-3 border-[#f9a8d4]/40 hover:bg-[#f9a8d4]/20 hover:border-[#d81b60]/60 text-[#2a655f] hover:text-[#d81b60] transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1" />
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={confirmDelete}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-rose-400/50"
              >
                {del.isPending ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isRTL ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    {isRTL ? "تأكيد الحذف" : "Confirm Delete"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
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
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default AnnouncementsAdmin;