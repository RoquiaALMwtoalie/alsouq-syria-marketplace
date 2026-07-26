// src/components/dashboard/admin/BannersAdminPage.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ImageInput } from "@/components/ImageInput";
import { useApp, useT } from "@/lib/i18n";
import { useAllBanners, useSaveBanner, useDeleteBanner, type BannerRow } from "@/lib/queries";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, AlertTriangle, X } from "lucide-react";

export function BannersAdminPage() {
  const app = useApp();
  const t = useT();
  const { data: banners = [], isLoading } = useAllBanners();
  const save = useSaveBanner();
  const del = useDeleteBanner();
  const [editing, setEditing] = useState<Partial<BannerRow> | null>(null);
  
  // ===== State خاصة بـ Dialog الحذف =====
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<BannerRow | null>(null);

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
      toast.error(app.lang === "ar" ? "العنوان والصورة مطلوبان" : "Title and image required");
      return;
    }
    try {
      await save.mutateAsync(editing as any);
      toast.success(t("save"));
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  // ===== دالة حذف البنر =====
  async function handleDeleteBanner() {
    if (!bannerToDelete) return;
    try {
      await del.mutateAsync(bannerToDelete.id);
      toast.success(app.lang === "ar" ? "تم حذف البنر بنجاح" : "Banner deleted successfully");
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">{t("banners")}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {app.lang === "ar"
              ? "إدارة البنرات الظاهرة في الصفحة الرئيسية."
              : "Manage banners shown on the homepage."}
          </p>
        </div>
        <Button
          onClick={openNew}
          className="gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg hover:shadow-xl transition rounded-xl"
        >
          <Plus className="h-4 w-4" />
          {t("add")}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="text-slate-500">جار التحميل...</div>
      ) : (
        <div className="grid md:grid-cols-2 gap-5">
          {banners.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={b.image_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Badge
                  variant={b.active ? "default" : "secondary"}
                  className="absolute top-3 end-3 bg-black/60 backdrop-blur border-0 text-white"
                >
                  {b.active ? t("active") : "غير نشط"}
                </Badge>
              </div>
              <div className="p-5">
                <div className="font-bold text-lg text-slate-900 dark:text-white">{b.title_ar}</div>
                {b.subtitle_ar && (
                  <div className="text-sm text-slate-500 mt-1">{b.subtitle_ar}</div>
                )}
                <div className="mt-4 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-slate-200 dark:border-slate-700"
                    onClick={() => setEditing(b)}
                  >
                    {t("edit")}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                    onClick={() => {
                      setBannerToDelete(b);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    {t("delete")}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== Dialog إضافة/تعديل البنر ===== */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {editing?.id ? t("edit") : t("add")} — {t("banners")}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div>
                <Label className="font-medium text-slate-700 dark:text-slate-300">{t("banner_title")} (AR) *</Label>
                <Input
                  value={editing.title_ar || ""}
                  onChange={(e) => setEditing({ ...editing, title_ar: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="font-medium text-slate-700 dark:text-slate-300">{t("banner_title")} (EN)</Label>
                <Input
                  value={editing.title_en || ""}
                  onChange={(e) => setEditing({ ...editing, title_en: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="font-medium text-slate-700 dark:text-slate-300">{t("banner_subtitle")} (AR)</Label>
                <Input
                  value={editing.subtitle_ar || ""}
                  onChange={(e) => setEditing({ ...editing, subtitle_ar: e.target.value })}
                  className="rounded-xl"
                />
              </div>
              <ImageInput
                value={editing.image_url || ""}
                onChange={(value) => setEditing({ ...editing, image_url: value })}
                userId={app.user?.id}
                folder="banners"
                lang={app.lang}
                label={`${t("banner_image")} *`}
                required
                hint={
                  app.lang === "ar"
                    ? "ارفع صورة البنر من جهازك أو ضع رابط URL."
                    : "Upload a banner image or paste a URL."
                }
                previewClassName="aspect-[16/6] h-auto"
              />
              <div>
                <Label className="font-medium text-slate-700 dark:text-slate-300">{t("banner_link")}</Label>
                <Input
                  value={editing.link_url || ""}
                  onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                  placeholder="/category/fashion"
                  className="rounded-xl"
                />
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editing.active ?? true}
                  onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                  className="rounded"
                />
                {t("active")}
              </label>
            </div>
          )}
          <DialogFooter>
            <Button
              onClick={handleSave}
              disabled={save.isPending}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl"
            >
              {save.isPending ? "…" : t("save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== 🔥 Dialog تأكيد الحذف (احترافي) ===== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl p-0 overflow-hidden border-0 shadow-2xl bg-white dark:bg-slate-900">
          {/* ===== HEADER ===== */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-red-50/90 to-rose-50/90 dark:from-red-950/90 dark:to-rose-950/90 backdrop-blur-xl border-b border-red-200/30 dark:border-red-800/30 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-lg shadow-red-500/25">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                    {app.lang === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
                  </DialogTitle>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {app.lang === "ar" ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setDeleteDialogOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* ===== BODY ===== */}
          <div className="p-6">
            <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                {app.lang === "ar"
                  ? `هل أنت متأكد من حذف البنر "${bannerToDelete?.title_ar}"؟`
                  : `Are you sure you want to delete the banner "${bannerToDelete?.title_ar}"?`}
              </p>
              {bannerToDelete?.image_url && (
                <div className="mt-3 rounded-lg overflow-hidden border border-red-200/30 dark:border-red-800/30">
                  <img
                    src={bannerToDelete.image_url}
                    alt={bannerToDelete.title_ar}
                    className="w-full h-24 object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-2">
                {app.lang === "ar"
                  ? "سيتم حذف هذا البنر نهائياً من النظام"
                  : "This banner will be permanently deleted from the system"}
              </p>
            </div>

            {/* ===== FOOTER ===== */}
            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDeleteBanner}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-[1.02] transition-all"
              >
                {del.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {app.lang === "ar" ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 me-2" />
                    {app.lang === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
                  </>
                )}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}