// src/components/dashboard/admin/BannersAdminPage.tsx

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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
// ✅ مكون بطاقة البنر - بتصميم بسيط
// ============================================================
const BannerCard = React.memo(({
  banner,
  onEdit,
  onDelete,
  isArabic,
}: any) => {
  return (
    <div className="group bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02]">
      
      {/* ===== الصورة ===== */}
      <div className="relative h-44 overflow-hidden">
        <OptimizedImage
          src={banner.image_url}
          alt={banner.title_ar}
          width={600}
          height={300}
          quality={85}
          objectFit="cover"
          className="w-full h-full group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
        
        {/* ✅ Badge الحالة */}
        <Badge
          className={cn(
            "absolute top-3 right-3 border-2 px-3 py-1 text-xs font-medium backdrop-blur-sm",
            banner.active
              ? "bg-emerald-500/20 text-emerald-600 border-emerald-500/30"
              : "bg-slate-500/20 text-slate-400 border-slate-500/30"
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
          <Badge className="bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[10px]">
            <Image className="h-3 w-3 mr-1" />
            Banner
          </Badge>
          {banner.link_url && (
            <Badge className="bg-black/40 backdrop-blur-sm border border-white/20 text-white text-[10px]">
              <Link2 className="h-3 w-3 mr-1" />
              {isArabic ? "رابط" : "Link"}
            </Badge>
          )}
        </div>
      </div>

      {/* ===== المحتوى ===== */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors truncate">
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
          <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40 text-[10px] flex-shrink-0">
            #{banner.sort_order + 1}
          </Badge>
        </div>

        {/* ✅ أزرار الإجراءات - رمادية بالكامل */}
        <div className="mt-3 flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl h-8 px-4 flex-1 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 transition-all duration-300"
            onClick={() => onEdit(banner)}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
            {isArabic ? "تعديل" : "Edit"}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="rounded-xl h-8 px-3 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300"
            onClick={() => onDelete(banner)}
          >
            <Trash2 className="h-3.5 w-3.5 text-gray-500" />
          </Button>
        </div>
      </div>
      
      {/* ✅ خط زخرفي سفلي */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#f9a8d4] to-[#f9a8d4] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
});
BannerCard.displayName = 'BannerCard';

// ============================================================
// ✅ مكون إحصائيات سريعة - بنفس تصميم الصفحات الأخرى
// ============================================================
const StatsCards = React.memo(({ total, active, inactive, isArabic }: any) => {
  const items = [
    {
      key: 'total',
      label: isArabic ? 'إجمالي البنرات' : 'Total Banners',
      value: total,
      icon: LayoutDashboard,
      gradient: 'from-[#2a655f] to-[#1a4f4a]',
    },
    {
      key: 'active',
      label: isArabic ? 'نشط' : 'Active',
      value: active,
      icon: CheckCircle2,
      gradient: 'from-emerald-500 to-teal-500',
    },
    {
      key: 'inactive',
      label: isArabic ? 'غير نشط' : 'Inactive',
      value: inactive,
      icon: Clock,
      gradient: 'from-[#d81b60] to-[#f9a8d4]',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
              style={{ width: `${Math.min(100, (item.value / (total || 1)) * 100)}%` }}
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
    <div className="space-y-5">
      
      {/* ===== HEADER - نفس تصميم باقي الصفحات ===== */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <span className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] bg-clip-text text-transparent">
              {isArabic ? "البنرات" : "Banners"}
            </span>
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]">
              <Sparkles className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
              {isArabic ? 'مباشر' : 'Live'}
            </Badge>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
              <LayoutDashboard className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-[#2a655f] font-medium">{stats.total}</span>
              <span className="text-xs text-muted-foreground">{isArabic ? "إجمالي" : "total"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.active}</span>
              <span className="text-xs text-muted-foreground">{isArabic ? "نشط" : "active"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9a8d4]/10 border border-[#f9a8d4]/20">
              <Clock className="h-3.5 w-3.5 text-[#d81b60]" />
              <span className="text-[#d81b60] font-medium">{stats.inactive}</span>
              <span className="text-xs text-muted-foreground">{isArabic ? "غير نشط" : "inactive"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            onClick={openNew}
            className="rounded-xl h-10 px-4 bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0"
          >
            <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            {isArabic ? "إضافة بنر جديد" : "Add New Banner"}
          </Button>
          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 px-3 py-1.5 text-xs font-medium shadow-lg shadow-[#2a655f]/30">
            <Sparkles className="h-3 w-3 mr-1" />
            {isArabic ? 'لوحة تحكم' : 'Dashboard'}
          </Badge>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <StatsCards {...stats} isArabic={isArabic} />

      {/* ===== BANNERS GRID ===== */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="h-12 w-12 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">
            {isArabic ? "⏳ جاري تحميل البنرات..." : "⏳ Loading banners..."}
          </p>
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 p-16 text-center shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300">
          <div className="h-16 w-16 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto mb-4 animate-bounce-slow">
            <Image className="h-8 w-8 text-[#2a655f]/40" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {isArabic ? "🚀 لا توجد بنرات" : "🚀 No banners"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
            {isArabic
              ? "قم بإضافة أول بنر لجعل الصفحة الرئيسية أكثر جاذبية"
              : "Add your first banner to make the homepage more attractive"}
          </p>
          <Button
            onClick={openNew}
            className="mt-4 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group border-0"
          >
            <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            {isArabic ? "إضافة بنر جديد" : "Add New Banner"}
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {banners.map((banner, index) => (
            <div key={banner.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 0.05}s` }}>
              <BannerCard
                banner={banner}
                onEdit={(b: BannerRow) => setEditing(b)}
                onDelete={(b: BannerRow) => {
                  setBannerToDelete(b);
                  setDeleteDialogOpen(true);
                }}
                isArabic={isArabic}
              />
            </div>
          ))}
        </div>
      )}

      {/* ============================================================
      // ✅ DIALOG: إضافة/تعديل البنر - بتصميم بسيط
      // ============================================================ */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-2xl shadow-pink-500/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-20 transition-all duration-300 border border-gray-300 dark:border-gray-600"
            onClick={() => setEditing(null)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </Button>

          <div className="p-6">
            <DialogHeader>
              <div className="flex items-start gap-4 mb-2">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] flex items-center justify-center shadow-lg shadow-[#2a655f]/20 border-2 border-pink-400/40">
                  {editing?.id ? (
                    <Pencil className="h-6 w-6 text-white" />
                  ) : (
                    <Plus className="h-6 w-6 text-white" />
                  )}
                </div>
                <div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {editing?.id ? (
                      isArabic ? "تعديل البنر" : "Edit Banner"
                    ) : (
                      isArabic ? "إضافة بنر جديد" : "Add New Banner"
                    )}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-slate-500 dark:text-slate-400">
                    {editing?.id
                      ? isArabic ? "تعديل بيانات البنر" : "Edit banner details"
                      : isArabic ? "أدخل معلومات البنر الجديد" : "Enter new banner details"}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {editing && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <span className="text-[#2a655f]">📝</span>
                      {isArabic ? "العنوان (AR) *" : "Title (AR) *"}
                    </Label>
                    <Input
                      value={editing.title_ar || ""}
                      onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })}
                      className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300"
                      placeholder={isArabic ? "مثال: عرض الصيف" : "Example: Summer Sale"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <span className="text-[#2a655f]">🌐</span>
                      {isArabic ? "العنوان (EN)" : "Title (EN)"}
                    </Label>
                    <Input
                      value={editing.title_en || ""}
                      onChange={(e) => setEditing({ ...editing, title_en: e.target.value })}
                      className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300"
                      placeholder="Example: Summer Sale"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <span className="text-[#2a655f]">📝</span>
                      {isArabic ? "العنوان الفرعي (AR)" : "Subtitle (AR)"}
                    </Label>
                    <Input
                      value={editing.subtitle_ar || ""}
                      onChange={(e) => setEditing({ ...editing, subtitle_ar: e.target.value })}
                      className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300"
                      placeholder={isArabic ? "مثال: خصم يصل إلى 50%" : "Example: Up to 50% off"}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                      <span className="text-[#2a655f]">🌐</span>
                      {isArabic ? "العنوان الفرعي (EN)" : "Subtitle (EN)"}
                    </Label>
                    <Input
                      value={editing.subtitle_en || ""}
                      onChange={(e) => setEditing({ ...editing, subtitle_en: e.target.value })}
                      className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300"
                      placeholder="Example: Up to 50% off"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                    <Link2 className="h-4 w-4 text-[#2a655f]" />
                    {isArabic ? "الرابط" : "Link URL"}
                  </Label>
                  <Input
                    value={editing.link_url || ""}
                    onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                    placeholder={isArabic ? "/category/fashion" : "/category/fashion"}
                    className="rounded-xl border border-gray-300 dark:border-gray-600 focus:border-gray-400 focus:ring-2 focus:ring-gray-300/30 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#2a655f] flex items-center gap-1">
                    <Image className="h-4 w-4 text-[#2a655f]" />
                    {isArabic ? "صورة البنر *" : "Banner Image *"}
                  </Label>
                  <ImageInput
                    value={editing.image_url || ""}
                    onChange={(value) => setEditing({ ...editing, image_url: value })}
                    userId={app.user?.id}
                    folder="banners"
                    lang={app.lang}
                    label={isArabic ? "ارفع صورة البنر" : "Upload banner image"}
                    required
                    hint={
                      isArabic
                        ? "ارفع صورة البنر من جهازك أو ضع رابط URL"
                        : "Upload a banner image or paste a URL"
                    }
                    previewClassName="aspect-[16/6] h-auto rounded-xl border border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-300 dark:border-gray-600">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editing.active ?? true}
                      onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-[#2a655f] focus:ring-[#2a655f]/30 accent-[#2a655f]"
                    />
                    <span className="text-sm font-medium text-[#2a655f] dark:text-white">
                      {isArabic ? "🟢 البنر نشط" : "🟢 Banner is active"}
                    </span>
                  </label>
                  <Badge className="bg-[#f9a8d4]/20 text-[#2a655f] border-2 border-pink-400/40 text-[10px]">
                    {isArabic ? `ترتيب: ${editing.sort_order + 1}` : `Order: ${editing.sort_order + 1}`}
                  </Badge>
                </div>
              </div>
            )}

            <DialogFooter className="gap-3 pt-4 border-t border-gray-300 dark:border-gray-600">
              <Button
                variant="outline"
                onClick={() => setEditing(null)}
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-slate-600 hover:text-slate-800 transition-all duration-300"
              >
                <X className="h-4 w-4 mr-1" />
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleSave}
                disabled={save.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] hover:from-[#3a8a82] hover:to-[#2a655f] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-[1.02] border-0"
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
          </div>
        </DialogContent>
      </Dialog>

      {/* ============================================================
      // ✅ DIALOG: تأكيد الحذف - بتصميم بسيط
      // ============================================================ */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-2 border-[#d81b60]/40 shadow-2xl shadow-[#d81b60]/20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 z-20 transition-all duration-300 border border-gray-300 dark:border-gray-600"
            onClick={() => setDeleteDialogOpen(false)}
          >
            <X className="h-4 w-4 text-slate-400 hover:text-slate-600" />
          </Button>

          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="h-14 w-14 rounded-2xl bg-rose-500/10 border-2 border-rose-500/30 flex items-center justify-center flex-shrink-0 animate-pulse">
                <AlertTriangle className="h-7 w-7 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {isArabic ? "تأكيد الحذف" : "Confirm Delete"}
                </DialogTitle>
                <DialogDescription className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  {isArabic ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                </DialogDescription>
              </div>
            </div>

            <div className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-4 border-2 border-rose-200/50 dark:border-rose-800/30 mb-4">
              <p className="text-sm text-rose-700 dark:text-rose-300 font-medium">
                {isArabic
                  ? `هل أنت متأكد من حذف البنر "${bannerToDelete?.title_ar}"؟`
                  : `Are you sure you want to delete the banner "${bannerToDelete?.title_ar}"?`}
              </p>
              {bannerToDelete?.image_url && (
                <div className="mt-3 rounded-lg overflow-hidden border-2 border-rose-200/30 dark:border-rose-800/30">
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
              <p className="text-xs text-rose-600/70 dark:text-rose-400/70 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {isArabic
                  ? "سيتم حذف هذا البنر نهائياً من النظام"
                  : "This banner will be permanently deleted from the system"}
              </p>
            </div>

            <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border-2 border-amber-200/50 dark:border-amber-800/30">
              <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" />
                {isArabic
                  ? "تحذير: حذف هذا البنر سيؤثر على واجهة الصفحة الرئيسية"
                  : "Warning: Deleting this banner will affect the homepage layout"}
              </p>
            </div>

            <DialogFooter className="flex gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-slate-600 hover:text-slate-800 transition-all duration-300"
              >
                {isArabic ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDeleteBanner}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white shadow-lg shadow-rose-500/30 hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-rose-400/50"
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
          animation: fadeInUp 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}

export default BannersAdminPage;