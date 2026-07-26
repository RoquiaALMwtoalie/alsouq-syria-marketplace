// src/components/dashboard/admin/AnnouncementsAdmin.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useApp, useT } from "@/lib/i18n";
import { useAllAnnouncements, useSaveAnnouncement, useDeleteAnnouncement, type AnnouncementRow } from "@/lib/queries";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, AlertTriangle, X } from "lucide-react";

export function AnnouncementsAdmin() {
  const app = useApp();
  const { data: items = [], isLoading } = useAllAnnouncements();
  const save = useSaveAnnouncement();
  const del = useDeleteAnnouncement();
  const [editing, setEditing] = useState<Partial<AnnouncementRow> | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetText, setDeleteTargetText] = useState("");

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
      toast.error(app.lang === "ar" ? "النص العربي مطلوب" : "Arabic text required");
      return;
    }
    try {
      await save.mutateAsync(editing as any);
      toast.success(app.lang === "ar" ? "تم الحفظ" : "Saved");
      setEditing(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  // ✅ فتح نافذة تأكيد الحذف
  function openDeleteDialog(id: string, text: string) {
    setDeleteTargetId(id);
    setDeleteTargetText(text);
    setDeleteDialogOpen(true);
  }

  // ✅ تنفيذ الحذف
  async function confirmDelete() {
    if (!deleteTargetId) return;
    try {
      await del.mutateAsync(deleteTargetId);
      toast.success(app.lang === "ar" ? "✅ تم حذف الإعلان" : "✅ Announcement deleted");
      setDeleteDialogOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetText("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            {app.lang === "ar" ? "شريط الإعلانات" : "Announcement bar"}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {app.lang === "ar"
              ? "يظهر أعلى الموقع كشريط متحرك لجميع الزوار."
              : "Shown as a marquee strip at the top of every page."}
          </p>
        </div>
        <Button
          onClick={openNew}
          className="gap-2 bg-[#2563eb] hover:bg-[#1d4ed8] text-white shadow-lg hover:shadow-xl transition rounded-xl"
        >
          <Plus className="h-4 w-4" />
          {app.lang === "ar" ? "إعلان جديد" : "New announcement"}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-500">جار التحميل...</div>
      ) : (
        <div className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-100 dark:border-slate-800 hover:bg-transparent">
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {app.lang === "ar" ? "النص" : "Text"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {app.lang === "ar" ? "الرابط" : "Link"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {app.lang === "ar" ? "الترتيب" : "Order"}
                </TableHead>
                <TableHead className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {app.lang === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className="text-end text-xs font-medium text-slate-500 dark:text-slate-400">
                  {app.lang === "ar" ? "إجراء" : "Action"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((a) => (
                <TableRow key={a.id} className="border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <TableCell>
                    <div className="font-semibold text-slate-900 dark:text-white">{a.text_ar}</div>
                    {a.text_en && (
                      <div className="text-xs text-slate-500" dir="ltr">
                        {a.text_en}
                      </div>
                    )}
                  </TableCell>
                  <TableCell dir="ltr" className="text-xs text-slate-500">
                    {a.link_url || "—"}
                  </TableCell>
                  <TableCell className="text-slate-900 dark:text-white">{a.sort_order}</TableCell>
                  <TableCell>
                    {a.active ? (
                      <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">
                        {app.lang === "ar" ? "نشط" : "Active"}
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {app.lang === "ar" ? "مخفي" : "Hidden"}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-end">
                    <div className="flex gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-xl border-slate-200 dark:border-slate-700"
                        onClick={() => setEditing({ ...a })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl"
                        onClick={() => openDeleteDialog(a.id, a.text_ar)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center text-slate-500 py-12"
                  >
                    {app.lang === "ar"
                      ? "لا توجد إعلانات بعد."
                      : "No announcements yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* ✅ Dialog إنشاء/تعديل الإعلان */}
      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
              {editing?.id
                ? app.lang === "ar"
                  ? "تعديل إعلان"
                  : "Edit announcement"
                : app.lang === "ar"
                ? "إعلان جديد"
                : "New announcement"}
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="grid gap-3">
              <div>
                <Label className="font-medium text-slate-700 dark:text-slate-300">
                  {app.lang === "ar" ? "النص بالعربية *" : "Arabic text *"}
                </Label>
                <Input
                  value={editing.text_ar || ""}
                  onChange={(e) => setEditing({ ...editing, text_ar: e.target.value })}
                  placeholder="عروض حصرية على الأزياء حتى 40%"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="font-medium text-slate-700 dark:text-slate-300">
                  {app.lang === "ar" ? "النص بالإنكليزية" : "English text"}
                </Label>
                <Input
                  value={editing.text_en || ""}
                  onChange={(e) => setEditing({ ...editing, text_en: e.target.value })}
                  dir="ltr"
                  placeholder="Exclusive offers on fashion up to 40%"
                  className="rounded-xl"
                />
              </div>
              <div>
                <Label className="font-medium text-slate-700 dark:text-slate-300">
                  {app.lang === "ar" ? "رابط (اختياري)" : "Link URL (optional)"}
                </Label>
                <Input
                  value={editing.link_url || ""}
                  onChange={(e) => setEditing({ ...editing, link_url: e.target.value })}
                  dir="ltr"
                  placeholder="/category/offers"
                  className="rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="font-medium text-slate-700 dark:text-slate-300">
                    {app.lang === "ar" ? "الترتيب" : "Sort order"}
                  </Label>
                  <Input
                    type="number"
                    value={editing.sort_order ?? 0}
                    onChange={(e) =>
                      setEditing({ ...editing, sort_order: Number(e.target.value) })
                    }
                    className="rounded-xl"
                  />
                </div>
                <label className="flex items-end gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 pb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.active ?? true}
                    onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                    className="rounded"
                  />
                  {app.lang === "ar" ? "مفعّل" : "Active"}
                </label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleSave}
              disabled={save.isPending}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-xl"
            >
              {app.lang === "ar" ? "حفظ" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ Dialog تأكيد الحذف الاحترافي */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                  {app.lang === "ar" ? "تأكيد الحذف" : "Confirm Deletion"}
                </DialogTitle>
                <DialogDescription>
                  {app.lang === "ar"
                    ? "هل أنت متأكد من حذف هذا الإعلان؟ هذا الإجراء لا يمكن التراجع عنه."
                    : "Are you sure you want to delete this announcement? This action cannot be undone."}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {deleteTargetText && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
                {app.lang === "ar" ? "الإعلان المراد حذفه:" : "Announcement to delete:"}
              </p>
              <p className="font-semibold text-slate-900 dark:text-white">
                "{deleteTargetText}"
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500 shrink-0" />
            <p className="text-xs text-red-600 dark:text-red-400">
              {app.lang === "ar"
                ? "⚠️ هذا الإجراء نهائي ولا يمكن استعادة الإعلان بعد حذفه."
                : "⚠️ This action is permanent and cannot be undone."}
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setDeleteTargetId(null);
                setDeleteTargetText("");
              }}
              className="rounded-xl"
            >
              <X className="h-4 w-4 mr-1.5" />
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={del.isPending}
              className="rounded-xl"
            >
              {del.isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-1.5" />
                  {app.lang === "ar" ? "جاري الحذف..." : "Deleting..."}
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  {app.lang === "ar" ? "نعم، احذف" : "Yes, delete"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}