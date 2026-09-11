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
// ✅ Stat Card - بنفس تصميم AdminOverview (أبيض + بوردر زهري)
// ============================================================
const StatCard = ({ 
  label, 
  value, 
  icon: Icon, 
  gradient,
  color,
}: { 
  label: string; 
  value: number; 
  icon: any; 
  gradient: string;
  color: string;
}) => (
  <div className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative">
    <div className="flex items-start justify-between p-4">
      <div>
        <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</p>
      </div>
      <div className="h-12 w-12 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
        <Icon className={cn("h-5 w-5", color)} />
      </div>
    </div>
    <div className="mt-0 h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
      <div 
        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-1000 animate-shimmer`} 
        style={{ width: `${Math.min(100, (value / 1) * 100)}%` }}
      />
    </div>
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
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="h-12 w-12 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
          {isRTL ? "⏳ جاري تحميل الإعلانات..." : "⏳ Loading announcements..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      
      {/* ============================================================
      // ✅ HEADER - نفس تصميم AdminProducts
      // ============================================================ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent">
              {isRTL ? "شريط الإعلانات" : "Announcement Bar"}
            </span>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
              {isRTL ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors">
              <Megaphone className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-[#2a655f] font-medium">{stats.total}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "إجمالي" : "total"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 transition-colors">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.active}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "نشط" : "active"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-800/30 hover:bg-rose-100/50 transition-colors">
              <EyeOff className="h-3.5 w-3.5 text-rose-500" />
              <span className="text-rose-600 dark:text-rose-400 font-medium">{stats.inactive}</span>
              <span className="text-xs text-muted-foreground">{isRTL ? "مخفي" : "hidden"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] rounded-xl p-1 border border-pink-400/60 dark:border-pink-400/40 shadow-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              className="rounded-lg h-9 px-3 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <Button
            onClick={openNew}
            className="rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0"
          >
            <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            {isRTL ? "إعلان جديد" : "New Announcement"}
          </Button>
          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {isRTL ? 'لوحة تحكم' : 'Dashboard'}
          </Badge>
        </div>
      </div>

      {/* ============================================================
      // ✅ STATS CARDS - بنفس تصميم AdminOverview (أبيض + بوردر زهري)
      // ============================================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard 
          label={isRTL ? 'الإجمالي' : 'Total'} 
          value={stats.total} 
          icon={Megaphone}
          gradient="from-[#2a655f] to-[#f9a8d4]"
          color="text-[#2a655f]"
        />
        <StatCard 
          label={isRTL ? 'نشط' : 'Active'} 
          value={stats.active} 
          icon={CheckCircle2}
          gradient="from-emerald-500 to-teal-500"
          color="text-emerald-500"
        />
        <StatCard 
          label={isRTL ? 'مخفي' : 'Inactive'} 
          value={stats.inactive} 
          icon={EyeOff}
          gradient="from-rose-500 to-[#f9a8d4]"
          color="text-rose-500"
        />
      </div>

      {/* ============================================================
      // ✅ SEARCH & FILTERS - هوفر رمادي فاتح
      // ============================================================ */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className={`absolute inset-y-0 my-auto ${isRTL ? 'right-3' : 'left-3'} h-4 w-4 text-slate-400 group-focus-within:text-slate-600 transition-colors duration-300`} />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isRTL ? "🔍 بحث عن إعلان..." : "🔍 Search announcements..."}
            className={`${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] focus:border-slate-300 focus:ring-2 focus:ring-slate-300/30 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className={`absolute inset-y-0 ${isRTL ? 'left-3' : 'right-3'} flex items-center text-slate-400 hover:text-slate-600 transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <Select
          value={filterStatus}
          onValueChange={(value: any) => setFilterStatus(value)}
        >
          <SelectTrigger className="w-[160px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 focus:ring-2 focus:ring-slate-300/30">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-500" />
              <SelectValue placeholder={isRTL ? "جميع الإعلانات" : "All"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-slate-200 dark:border-slate-700">
            <SelectItem value="all" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">📋 {isRTL ? "جميع" : "All"}</SelectItem>
            <SelectItem value="active" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">✅ {isRTL ? "نشطة" : "Active"}</SelectItem>
            <SelectItem value="inactive" className="hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">🚫 {isRTL ? "مخفية" : "Inactive"}</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSearchQuery("");
            setFilterStatus("all");
          }}
          className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
        >
          <XCircle className="h-4 w-4 mr-1.5" />
          {isRTL ? "مسح الكل" : "Clear all"}
        </Button>
      </div>

      {/* ============================================================
      // ✅ TABLE - نفس تصميم AdminStores (رمادي فاتح)
      // ============================================================ */}
      <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-200 dark:border-slate-700 hover:bg-transparent bg-gradient-to-r from-slate-100/50 via-slate-50/30 to-slate-100/50 dark:from-slate-800/30 dark:via-slate-700/20 dark:to-slate-800/30 border-b-2 border-slate-200 dark:border-slate-700">
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-right min-w-[200px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <Megaphone className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {isRTL ? "النص" : "Text"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[150px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Link2 className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {isRTL ? "الرابط" : "Link"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[80px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {isRTL ? "الترتيب" : "Order"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[100px] border-r-2 border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300" />
                    {isRTL ? "الحالة" : "Status"}
                  </div>
                </TableHead>
                <TableHead className="text-xs font-bold text-[#2a655f] dark:text-slate-300 text-center min-w-[160px]">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-[#2a655f] dark:text-slate-300 animate-pulse" />
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
                      <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center animate-bounce-slow">
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
                        className="mt-2 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-105 group border-0"
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
                    className="border-slate-200 dark:border-slate-700 hover:bg-gray-50/60 dark:hover:bg-gray-800/30 transition-colors duration-300 group border-b-2 border-slate-200/60 dark:border-slate-700/60"
                  >
                    <TableCell className="border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300 border-2 border-slate-200 dark:border-slate-700">
                          <Megaphone className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">
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
                    <TableCell dir="ltr" className="text-xs text-slate-500 dark:text-slate-400 text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
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
                    <TableCell className="text-slate-900 dark:text-white text-center font-mono text-sm border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 font-mono hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                        #{a.sort_order}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center border-r-2 border-slate-200/60 dark:border-slate-700/60">
                      {a.active ? (
                        <Badge className="bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-2 border-emerald-500/20 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                          <CheckCircle2 className="h-3 w-3 mr-1 animate-pulse" />
                          {isRTL ? "نشط" : "Active"}
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-2 border-red-500/20 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                          <EyeOff className="h-3 w-3 mr-1" />
                          {isRTL ? "مخفي" : "Hidden"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* ✅ زر تعديل - رمادي مع هوفر رمادي فاتح جداً */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl h-8 w-8 p-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300"
                          onClick={() => setEditing({ ...a })}
                          title={isRTL ? "تعديل الإعلان" : "Edit announcement"}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>

                        {/* ✅ زر حذف - رمادي مع هوفر رمادي فاتح (مع لمسة حمراء) */}
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-xl h-8 w-8 p-0 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-red-300 dark:hover:border-red-500/40 hover:text-red-500 transition-all duration-300"
                          onClick={() => openDeleteDialog(a.id, a.text_ar)}
                          title={isRTL ? "حذف الإعلان" : "Delete announcement"}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>

                        {/* ✅ مؤشر الترتيب */}
                        <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-colors">
                          <GripVertical className="h-3 w-3 mr-0.5 text-[#2a655f] dark:text-slate-400" />
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

        {/* ✅ Footer - رمادي فاتح مثل AdminStores */}
        <div className="px-4 py-2 border-t-2 border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 bg-gradient-to-r from-slate-50/50 to-slate-100/30 dark:from-slate-800/20 dark:to-slate-700/10">
          <span className="flex items-center gap-2">
            <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600">
              {isRTL
                ? `عرض ${filteredItems.length} من ${items.length}`
                : `Showing ${filteredItems.length} of ${items.length}`}
            </Badge>
            <span className="text-[10px] text-[#d81b60]">
              {isRTL ? `إجمالي ${items.length}` : `Total ${items.length}`}
            </span>
          </span>
          <div className="flex items-center gap-2">
            <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600">
              {filterStatus === "all" && (isRTL ? "جميع" : "All")}
              {filterStatus === "active" && (isRTL ? "نشطة" : "Active")}
              {filterStatus === "inactive" && (isRTL ? "مخفية" : "Inactive")}
            </Badge>
            {searchQuery && (
              <Badge className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-2 border-slate-200 dark:border-slate-600">
                <Search className="h-3 w-3 mr-1 text-[#d81b60]" />
                {searchQuery}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================
      // ✅ DIALOG - إنشاء/تعديل الإعلان - هوفر رمادي فاتح
      // ============================================================ */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 max-w-md overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700"
            onClick={() => setEditing(null)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" />
          </Button>

          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-[#f9a8d4]/40">
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
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1">
                    <span>📝</span>
                    {isRTL ? "النص بالعربية *" : "Arabic text *"}
                  </Label>
                  <Input
                    value={editing.text_ar || ""}
                    onChange={(e) => setEditing({ ...editing, text_ar: e.target.value })}
                    placeholder={isRTL ? "عروض حصرية على الأزياء حتى 40%" : "Exclusive fashion offers up to 40%"}
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1">
                    <span>🌐</span>
                    {isRTL ? "النص بالإنكليزية" : "English text"}
                  </Label>
                  <Input
                    value={editing.text_en || ""}
                    onChange={(e) => setEditing({ ...editing, text_en: e.target.value })}
                    dir="ltr"
                    placeholder="Exclusive fashion offers up to 40%"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1">
                    <Link2 className="h-4 w-4" />
                    {isRTL ? "رابط (اختياري)" : "Link URL (optional)"}
                  </Label>
                  <Input
                    value={editing.link_url || ""}
                    onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                    dir="ltr"
                    placeholder="/category/offers"
                    className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4] flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      {isRTL ? "الترتيب" : "Sort order"}
                    </Label>
                    <Input
                      type="number"
                      value={editing.sort_order ?? 0}
                      onChange={(e) =>
                        setEditing({ ...editing, sort_order: Number(e.target.value) })
                      }
                      className="rounded-xl border border-slate-200 dark:border-slate-700 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/30 transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] dark:text-[#f9a8d4]">
                      {isRTL ? "الحالة" : "Status"}
                    </Label>
                    <div className="flex items-center gap-3 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1e293b] hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300">
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

            <DialogFooter className="gap-3 pt-4 border-t-2 border-pink-400/30 dark:border-pink-400/20">
              <Button 
                variant="outline" 
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1" />
                {isRTL ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={save.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0"
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
      // ✅ DELETE CONFIRMATION DIALOG - هوفر رمادي فاتح
      // ============================================================ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md border-2 border-rose-500/40 shadow-2xl shadow-rose-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-50/80 dark:hover:bg-gray-700/30 z-20 transition-all duration-300 border border-slate-200 dark:border-slate-700"
            onClick={() => {
              setDeleteDialogOpen(false);
              setDeleteTargetId(null);
              setDeleteTargetText("");
            }}
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
                  {isRTL ? "تأكيد الحذف" : "Confirm Deletion"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isRTL ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                </DialogDescription>
              </div>
            </div>

            {deleteTargetText && (
              <div className="p-4 bg-slate-50/50 dark:bg-slate-800/50 rounded-xl border-2 border-slate-200/50 dark:border-slate-700/50 mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 flex items-center gap-1">
                  <Megaphone className="h-3 w-3 text-[#2a655f] dark:text-[#f9a8d4]" />
                  {isRTL ? "الإعلان المراد حذفه:" : "Announcement to delete:"}
                </p>
                <p className="font-semibold text-slate-900 dark:text-white">
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
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-800 dark:hover:text-slate-200 transition-all duration-300"
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