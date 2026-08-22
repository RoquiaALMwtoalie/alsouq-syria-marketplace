// src/components/dashboard/admin/BannersAdminPage.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ImageInput } from "@/components/ImageInput";
import { useApp, useT } from "@/lib/i18n";
import { useAllBanners, useSaveBanner, useDeleteBanner, type BannerRow } from "@/lib/queries";
import { toast } from "sonner";
import { 
  Plus, Pencil, Trash2, AlertTriangle, X, 
  Sparkles, Zap, Shield, Image, Link2, 
  CheckCircle2, Clock, Eye, EyeOff, LayoutDashboard,
  TrendingUp, Award, Star, Gem, Rocket, Crown
} from "lucide-react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";

// ============================================================
// ✅ مكون بطاقة البنر - احترافي
// ============================================================
const BannerCard = React.memo(({ 
  banner, 
  onEdit, 
  onDelete,
  isArabic,
}: any) => {
  return (
    <div className="group bg-white dark:bg-[#1e293b] rounded-2xl border border-[#0d2e2a]/20 dark:border-[#0d2e2a]/30 overflow-hidden shadow-lg shadow-[#0d2e2a]/5 hover:shadow-xl hover:shadow-[#0d2e2a]/10 transition-all duration-500 hover:-translate-y-1">
      
      {/* ===== الصورة ===== */}
      <div className="relative h-48 overflow-hidden">
        <OptimizedImage
          src={banner.image_url}
          alt={banner.title_ar}
          width={600}
          height={300}
          quality={85}
          objectFit="cover"
          className="w-full h-full group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        
        {/* ✅ Badge الحالة */}
        <Badge
          className={cn(
            "absolute top-3 right-3 border-0 px-3 py-1 text-xs font-medium backdrop-blur-sm",
            banner.active 
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
              : "bg-slate-500/20 text-slate-400 border border-slate-500/30"
          )}
        >
          {banner.active ? (
            <>
              <CheckCircle2 className="h-3 w-3 mr-1.5 animate-pulse" />
              {isArabic ? "نشط" : "Active"}
            </>
          ) : (
            <>
              <Clock className="h-3 w-3 mr-1.5" />
              {isArabic ? "غير نشط" : "Inactive"}
            </>
          )}
        </Badge>

        {/* ✅ أيقونة نوع البنر */}
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <Badge className="bg-black/40 backdrop-blur-sm border border-white/10 text-white text-[10px]">
            <Image className="h-3 w-3 mr-1" />
            Banner
          </Badge>
          {banner.link_url && (
            <Badge className="bg-blue-500/30 backdrop-blur-sm border border-blue-500/20 text-white text-[10px]">
              <Link2 className="h-3 w-3 mr-1" />
              {isArabic ? "رابط" : "Link"}
            </Badge>
          )}
        </div>
      </div>

      {/* ===== المحتوى ===== */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#0d2e2a] dark:group-hover:text-[#4a9f95] transition-colors truncate">
              {banner.title_ar}
            </h3>
            {banner.subtitle_ar && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                {banner.subtitle_ar}
              </p>
            )}
            {banner.title_en && (
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-1">
                {banner.title_en}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
              #{banner.sort_order + 1}
            </Badge>
          </div>
        </div>

      {/* ✅ أزرار الإجراءات */}
<div className="mt-4 flex items-center gap-2">
  <Button
    size="sm"
    className="rounded-xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 hover:scale-105 flex-1"
    onClick={() => onEdit(banner)}
  >
    <Pencil className="h-3.5 w-3.5 mr-1.5" />
    {isArabic ? "تعديل" : "Edit"}
  </Button>
  <Button
    size="sm"
    variant="ghost"
    className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 transition-all duration-300 hover:scale-105"
    onClick={() => onDelete(banner)}
  >
    <Trash2 className="h-3.5 w-3.5" />
  </Button>
</div>
      </div>
    </div>
  );
});
BannerCard.displayName = 'BannerCard';

// ============================================================
// ✅ مكون إحصائيات سريعة
// ============================================================
const StatsCards = React.memo(({ total, active, inactive, isArabic }: any) => {
  const items = [
    { 
      key: 'total', 
      label: isArabic ? '📊 الإجمالي' : '📊 Total', 
      value: total, 
      gradient: "from-[#0d2e2a] to-[#1a4f4a]",
      icon: LayoutDashboard,
      desc: isArabic ? 'جميع البنرات' : 'All banners',
    },
    { 
      key: 'active', 
      label: isArabic ? '✅ نشط' : '✅ Active', 
      value: active, 
      gradient: "from-[#2d6b63] to-[#4a9f95]",
      icon: CheckCircle2,
      desc: isArabic ? 'بنرات نشطة' : 'Active banners',
    },
    { 
      key: 'inactive', 
      label: isArabic ? '⏸️ غير نشط' : '⏸️ Inactive', 
      value: inactive, 
      gradient: "from-[#4a9f95] to-[#6bb5aa]",
      icon: Clock,
      desc: isArabic ? 'بنرات غير نشطة' : 'Inactive banners',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              <p className="text-[10px] opacity-70 mt-0.5">{item.desc}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <item.icon className="h-5 w-5 text-white/80" />
            </div>
          </div>
          <div className="relative mt-2 h-0.5 w-full rounded-full bg-white/20 overflow-hidden">
            <div 
              className="h-full rounded-full bg-white/40 transition-all duration-1000" 
              style={{ width: `${Math.min(100, (total > 0 ? (item.value / total) * 100 : 0))}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
});
StatsCards.displayName = 'StatsCards';

export function BannersAdminPage() {
  const app = useApp();
  const t = useT();
  const isArabic = app.lang === "ar";
  const { data: banners = [], isLoading } = useAllBanners();
  const save = useSaveBanner();
  const del = useDeleteBanner();
  const [editing, setEditing] = useState<Partial<BannerRow> | null>(null);
  
  // ===== State خاصة بـ Dialog الحذف =====
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<BannerRow | null>(null);

  // ✅ إحصائيات
  const stats = {
    total: banners.length,
    active: banners.filter((b) => b.active).length,
    inactive: banners.filter((b) => !b.active).length,
  };

  function openNew() {
    setEditing({
      title_ar: "",
      image_url: "",
      active: true,
      sort_order: banners.length,
    });
  }

  async function handleSave() {
    if (!editing?.title_ar || !editing?.image_url) {
      toast.error(isArabic ? "⚠️ العنوان والصورة مطلوبان" : "⚠️ Title and image required");
      return;
    }
    try {
      await save.mutateAsync(editing as any);
      toast.success(isArabic ? "✅ تم حفظ البنر بنجاح" : "✅ Banner saved successfully");
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  async function handleDeleteBanner() {
    if (!bannerToDelete) return;
    try {
      await del.mutateAsync(bannerToDelete.id);
      toast.success(isArabic ? "✅ تم حذف البنر بنجاح" : "✅ Banner deleted successfully");
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="space-y-6">
      
      {/* ===== HEADER ===== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#0d2e2a]/30">
              <Image className="h-5 w-5 text-white animate-float" />
            </div>
            <span className="bg-gradient-to-r from-[#0d2e2a] to-[#2d6b63] bg-clip-text text-transparent">
              {isArabic ? "البنرات" : "Banners"}
            </span>
            <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 animate-pulse" />
              {isArabic ? 'مباشر' : 'Live'}
            </Badge>
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
            {isArabic
              ? `إدارة البنرات الظاهرة في الصفحة الرئيسية (${stats.total})`
              : `Manage homepage banners (${stats.total})`}
            <span className="h-1 w-1 rounded-full bg-[#0d2e2a]/30" />
            <span className="text-xs text-[#2d6b63] flex items-center gap-1">
              <Zap className="h-3 w-3 animate-pulse" />
              {isArabic ? 'تحديث لحظي' : 'Real-time'}
            </span>
          </p>
        </div>
        
        <Button
          onClick={openNew}
          className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0d2e2a]/30 rounded-xl px-5"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          {isArabic ? "إضافة بنر جديد" : "Add New Banner"}
        </Button>
      </div>

      {/* ===== STATS ===== */}
      <StatsCards {...stats} isArabic={isArabic} />

      {/* ===== BANNERS GRID ===== */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#0d2e2a] border-t-transparent" />
            <span className="text-slate-500">{isArabic ? "جار التحميل..." : "Loading..."}</span>
          </div>
        </div>
      ) : banners.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1e293b] rounded-3xl border-2 border-dashed border-[#0d2e2a]/30 shadow-lg">
          <div className="h-20 w-20 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Image className="h-10 w-10 text-[#0d2e2a]/40" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
            {isArabic ? "لا توجد بنرات" : "No banners"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2">
            {isArabic 
              ? "قم بإضافة أول بنر لظهوره في الصفحة الرئيسية"
              : "Add your first banner to appear on the homepage"}
          </p>
          <Button
            onClick={openNew}
            className="mt-4 bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0d2e2a]/30 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-1" />
            {isArabic ? "إضافة بنر" : "Add Banner"}
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((banner) => (
            <BannerCard
              key={banner.id}
              banner={banner}
              onEdit={(b: BannerRow) => setEditing(b)}
              onDelete={(b: BannerRow) => {
                setBannerToDelete(b);
                setDeleteDialogOpen(true);
              }}
              isArabic={isArabic}
            />
          ))}
        </div>
      )}

      {/* ===== DIALOG: إضافة/تعديل البنر ===== */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#0d2e2a] dark:text-white flex items-center gap-3">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a] flex items-center justify-center">
                {editing?.id ? (
                  <Pencil className="h-4 w-4 text-white" />
                ) : (
                  <Plus className="h-4 w-4 text-white" />
                )}
              </div>
              {editing?.id ? (
                isArabic ? "تعديل البنر" : "Edit Banner"
              ) : (
                isArabic ? "إضافة بنر جديد" : "Add New Banner"
              )}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                    {isArabic ? "العنوان (AR) *" : "Title (AR) *"}
                  </Label>
                  <Input
                    value={editing.title_ar || ""}
                    onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })}
                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 mt-1.5"
                    placeholder={isArabic ? "مثال: عرض الصيف" : "Example: Summer Sale"}
                  />
                </div>
                <div>
                  <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                    {isArabic ? "العنوان (EN)" : "Title (EN)"}
                  </Label>
                  <Input
                    value={editing.title_en || ""}
                    onChange={(e) => setEditing({ ...editing, title_en: e.target.value })}
                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 mt-1.5"
                    placeholder="Example: Summer Sale"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                    {isArabic ? "العنوان الفرعي (AR)" : "Subtitle (AR)"}
                  </Label>
                  <Input
                    value={editing.subtitle_ar || ""}
                    onChange={(e) => setEditing({ ...editing, subtitle_ar: e.target.value })}
                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 mt-1.5"
                    placeholder={isArabic ? "مثال: خصم يصل إلى 50%" : "Example: Up to 50% off"}
                  />
                </div>
                <div>
                  <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                    {isArabic ? "العنوان الفرعي (EN)" : "Subtitle (EN)"}
                  </Label>
                  <Input
                    value={editing.subtitle_en || ""}
                    onChange={(e) => setEditing({ ...editing, subtitle_en: e.target.value })}
                    className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 mt-1.5"
                    placeholder="Example: Up to 50% off"
                  />
                </div>
              </div>

              <div>
                <Label className="text-[#0d2e2a] dark:text-white font-semibold">
                  {isArabic ? "الرابط" : "Link URL"}
                </Label>
                <Input
                  value={editing.link_url || ""}
                  onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                  placeholder={isArabic ? "/category/fashion" : "/category/fashion"}
                  className="rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-2 focus:ring-[#0d2e2a]/20 mt-1.5"
                />
              </div>

              <div>
                <ImageInput
                  value={editing.image_url || ""}
                  onChange={(value) => setEditing({ ...editing, image_url: value })}
                  userId={app.user?.id}
                  folder="banners"
                  lang={app.lang}
                  label={isArabic ? "صورة البنر *" : "Banner Image *"}
                  required
                  hint={
                    isArabic
                      ? "ارفع صورة البنر من جهازك أو ضع رابط URL"
                      : "Upload a banner image or paste a URL"
                  }
                  previewClassName="aspect-[16/6] h-auto rounded-xl border border-[#0d2e2a]/20"
                />
              </div>

              <div className="flex items-center gap-4 p-4 bg-[#0d2e2a]/5 rounded-xl border border-[#0d2e2a]/20">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.active ?? true}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    className="h-4 w-4 rounded border-[#0d2e2a]/20 text-[#2d6b63] focus:ring-[#2d6b63]/20"
                  />
                  <span className="text-sm font-medium text-[#0d2e2a] dark:text-white">
                    {isArabic ? "🟢 البنر نشط" : "🟢 Banner is active"}
                  </span>
                </label>
                <Badge className="bg-[#0d2e2a]/10 text-[#0d2e2a] border border-[#0d2e2a]/20 text-[10px]">
                  {isArabic ? `ترتيب: ${editing.sort_order + 1}` : `Order: ${editing.sort_order + 1}`}
                </Badge>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2 pt-4 border-t border-[#0d2e2a]/10">
            <Button 
              variant="outline" 
              onClick={() => setEditing(null)}
              className="rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300"
            >
              <X className="h-4 w-4 mr-1" />
              {isArabic ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={save.isPending}
              className="bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#2d6b63] text-white transition-all duration-300 hover:scale-105 shadow-lg shadow-[#0d2e2a]/30 rounded-xl px-6"
            >
              {save.isPending ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {isArabic ? "جاري الحفظ..." : "Saving..."}
                </span>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-1.5" />
                  {isArabic ? "حفظ البنر" : "Save Banner"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: تأكيد الحذف ===== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-[#0d2e2a]/20 shadow-2xl shadow-[#0d2e2a]/10 bg-white dark:bg-[#1e293b]">
          
          {/* ===== HEADER ===== */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-red-50/90 to-rose-50/90 dark:from-red-950/90 dark:to-rose-950/90 backdrop-blur-xl border-b border-red-200/30 dark:border-red-800/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25">
                  <AlertTriangle className="h-5 w-5 text-white animate-pulse" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
                  </DialogTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {isArabic ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 hover:scale-105"
                onClick={() => setDeleteDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ===== BODY ===== */}
          <div className="p-6">
            <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium flex items-center gap-2">
                <span className="text-lg">⚠️</span>
                {isArabic
                  ? `هل أنت متأكد من حذف البنر "${bannerToDelete?.title_ar}"؟`
                  : `Are you sure you want to delete the banner "${bannerToDelete?.title_ar}"?`}
              </p>
              {bannerToDelete?.image_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-red-200/30 dark:border-red-800/30">
                  <OptimizedImage
                    src={bannerToDelete.image_url}
                    alt={bannerToDelete.title_ar}
                    width={400}
                    height={100}
                    quality={80}
                    objectFit="cover"
                    className="w-full h-24 object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {isArabic
                  ? "سيتم حذف هذا البنر نهائياً من النظام"
                  : "This banner will be permanently deleted from the system"}
              </p>
            </div>

            {/* ===== FOOTER ===== */}
            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 transition-all duration-300"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDeleteBanner}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-[1.02] transition-all duration-300"
              >
                {del.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {isArabic ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-1.5" />
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

export default BannersAdminPage;