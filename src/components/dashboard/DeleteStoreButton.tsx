// src/components/dashboard/DeleteStoreButton.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Trash2,
  AlertTriangle,
  Loader2,
  Package,
  ShoppingBag,
  MessageCircle,
  Heart,
  Star,
  ShoppingCart,
  Store,
  X,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { useApp } from "@/lib/i18n";
import {
  useDeleteStore,
  useStoreDependencies,
  useHasActiveOrders,
  useHasActiveComplaints,
} from "@/lib/queries/store";
import { useProfile } from "@/lib/queries";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DeleteStoreButtonProps {
  userId: string;
  onDeleted?: () => void;
}

export function DeleteStoreButton({ userId, onDeleted }: DeleteStoreButtonProps) {
  const app = useApp();
  const isRTL = app.lang === "ar";

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showFinalDialog, setShowFinalDialog] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const { data: profile } = useProfile(userId);
  const deleteStore = useDeleteStore();
  const { data: dependencies, isLoading: depsLoading } = useStoreDependencies(userId);
  const { data: activeOrders, isLoading: ordersLoading } = useHasActiveOrders(userId);
  const { data: activeComplaints, isLoading: complaintsLoading } = useHasActiveComplaints(userId);

  const isLoading = depsLoading || ordersLoading || complaintsLoading;
  const hasActiveOrders = activeOrders?.hasActive || false;
  const hasActiveComplaints = activeComplaints?.hasActive || false;
  const canDelete = !hasActiveOrders && !hasActiveComplaints;

  // ✅ فتح نافذة التأكيد
  const openConfirmDialog = async () => {
    setIsChecking(true);
    setShowConfirmDialog(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    setIsChecking(false);
  };

  // ✅ تنفيذ الحذف
  const handleDelete = async () => {
    if (confirmText !== profile?.store_name) {
      toast.error(
        isRTL
          ? "⚠️ الاسم الذي أدخلته غير مطابق"
          : "⚠️ The name you entered does not match"
      );
      return;
    }

    const result = await deleteStore.mutateAsync(userId);

    if (result.success) {
      setShowConfirmDialog(false);
      setShowFinalDialog(true);
      setTimeout(() => {
        setShowFinalDialog(false);
        if (onDeleted) onDeleted();
        window.location.reload();
      }, 3000);
    }
  };

  // ✅ إذا لم يكن المستخدم لديه متجر
  if (!profile?.store_name) {
    return null;
  }

  return (
    <>
      {/* ✅ زر حذف المتجر */}
      <div className="mt-8 p-6 bg-gradient-to-br from-red-50/80 to-rose-50/80 dark:from-red-950/20 dark:to-rose-950/20 rounded-2xl border-2 border-red-200/50 dark:border-red-800/30 shadow-lg shadow-red-500/5 hover:shadow-red-500/20 transition-all duration-500 group">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <AlertTriangle className="h-7 w-7 text-white animate-pulse" />
              </div>
              <div className="absolute -inset-2 rounded-2xl bg-red-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center gap-2">
                ⚠️ {isRTL ? "منطقة الخطر" : "Danger Zone"}
                <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50 text-[10px] animate-pulse">
                  {isRTL ? "حذف نهائي" : "Permanent Deletion"}
                </Badge>
              </h3>
              <p className="text-sm text-red-600/70 dark:text-red-400/70 mt-1 max-w-md">
                {isRTL
                  ? `حذف متجر "${profile.store_name}" سيؤدي إلى حذف جميع منتجاتك وبياناتك نهائياً`
                  : `Deleting store "${profile.store_name}" will permanently delete all your products and data`}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-red-500/60 dark:text-red-400/60">
                <span className="flex items-center gap-1">
                  <Package className="h-3 w-3" />
                  {dependencies?.counts.listings || 0} {isRTL ? "منتج" : "products"}
                </span>
                <span className="w-px h-3 bg-red-200/50" />
                <span className="flex items-center gap-1">
                  <ShoppingBag className="h-3 w-3" />
                  {dependencies?.counts.orders || 0} {isRTL ? "طلب" : "orders"}
                </span>
                <span className="w-px h-3 bg-red-200/50" />
                <span className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {dependencies?.counts.favorites || 0} {isRTL ? "مفضلة" : "favorites"}
                </span>
              </div>
            </div>
          </div>

          <Button
            onClick={openConfirmDialog}
            disabled={isLoading || deleteStore.isPending}
            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/30 hover:shadow-red-600/50 transition-all duration-300 hover:scale-105 group/btn rounded-xl px-6 h-12"
          >
            {deleteStore.isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <Trash2 className="h-5 w-5 mr-2 group-hover/btn:scale-110 transition-transform duration-300" />
                {isRTL ? "🗑️ حذف المتجر" : "🗑️ Delete Store"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* ✅ نافذة التأكيد */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-2xl rounded-2xl border-red-200/50 dark:border-red-800/30 shadow-2xl shadow-red-500/20 p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle className="text-2xl font-bold flex items-center gap-3 text-red-600 dark:text-red-400">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center animate-bounce">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              {isRTL ? "⚠️ تأكيد حذف المتجر" : "⚠️ Confirm Store Deletion"}
            </DialogTitle>
            <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              {isRTL
                ? "هذا الإجراء لا يمكن التراجع عنه. سيتم حذف جميع بيانات المتجر نهائياً."
                : "This action cannot be undone. All store data will be permanently deleted."}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="p-6 space-y-4">
              {/* ✅ معلومات المتجر */}
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-2">
                    <Store className="h-4 w-4 text-[#2a655f]" />
                    {isRTL ? "اسم المتجر" : "Store Name"}
                  </span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {profile?.store_name}
                  </span>
                </div>
              </div>

              {/* ✅ إحصاءات البيانات المرتبطة */}
              {dependencies && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-3 border border-red-200/30 dark:border-red-800/30">
                    <p className="text-xs text-red-600/70 dark:text-red-400/70">📦 {isRTL ? "منتجات" : "Products"}</p>
                    <p className="text-xl font-bold text-red-700 dark:text-red-400">{dependencies.counts.listings}</p>
                  </div>
                  <div className="bg-amber-50/50 dark:bg-amber-950/20 rounded-xl p-3 border border-amber-200/30 dark:border-amber-800/30">
                    <p className="text-xs text-amber-600/70 dark:text-amber-400/70">🛒 {isRTL ? "طلبات" : "Orders"}</p>
                    <p className="text-xl font-bold text-amber-700 dark:text-amber-400">{dependencies.counts.orders}</p>
                  </div>
                  <div className="bg-blue-50/50 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-200/30 dark:border-blue-800/30">
                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70">💬 {isRTL ? "رسائل" : "Messages"}</p>
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-400">{dependencies.counts.messages}</p>
                  </div>
                  <div className="bg-pink-50/50 dark:bg-pink-950/20 rounded-xl p-3 border border-pink-200/30 dark:border-pink-800/30">
                    <p className="text-xs text-pink-600/70 dark:text-pink-400/70">❤️ {isRTL ? "مفضلات" : "Favorites"}</p>
                    <p className="text-xl font-bold text-pink-700 dark:text-pink-400">{dependencies.counts.favorites}</p>
                  </div>
                  <div className="bg-green-50/50 dark:bg-green-950/20 rounded-xl p-3 border border-green-200/30 dark:border-green-800/30">
                    <p className="text-xs text-green-600/70 dark:text-green-400/70">⭐ {isRTL ? "تقييمات" : "Reviews"}</p>
                    <p className="text-xl font-bold text-green-700 dark:text-green-400">{dependencies.counts.reviews}</p>
                  </div>
                  <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-xl p-3 border border-purple-200/30 dark:border-purple-800/30">
                    <p className="text-xs text-purple-600/70 dark:text-purple-400/70">🛍️ {isRTL ? "سلات" : "Carts"}</p>
                    <p className="text-xl font-bold text-purple-700 dark:text-purple-400">{dependencies.counts.carts}</p>
                  </div>
                </div>
              )}

              {/* ✅ تحذير الطلبات النشطة */}
              {hasActiveOrders && (
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-xl p-4 border-2 border-amber-200/50 dark:border-amber-800/50">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                        ⚠️ {isRTL ? `يوجد ${activeOrders?.count || 0} طلب نشط` : `${activeOrders?.count || 0} active order(s)`}
                      </p>
                      <p className="text-xs text-amber-600/70 dark:text-amber-400/70 mt-1">
                        {isRTL
                          ? "يجب إلغاء أو إتمام الطلبات النشطة قبل حذف المتجر"
                          : "You must cancel or complete active orders before deleting the store"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ تحذير الشكاوى النشطة */}
              {hasActiveComplaints && (
                <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-4 border-2 border-red-200/50 dark:border-red-800/50">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0 animate-pulse" />
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-400">
                        ⚠️ {isRTL ? `يوجد ${activeComplaints?.count || 0} شكوى نشطة` : `${activeComplaints?.count || 0} active complaint(s)`}
                      </p>
                      <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                        {isRTL
                          ? "يجب حل الشكاوى النشطة قبل حذف المتجر"
                          : "You must resolve active complaints before deleting the store"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ✅ حقل تأكيد الاسم */}
              <div className="bg-red-50/30 dark:bg-red-950/10 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30">
                <label className="block text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                  {isRTL
                    ? `✍️ اكتب اسم المتجر "${profile?.store_name}" لتأكيد الحذف`
                    : `✍️ Type the store name "${profile?.store_name}" to confirm deletion`}
                </label>
                <Input
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={isRTL ? "أدخل اسم المتجر هنا..." : "Enter store name here..."}
                  className={cn(
                    "rounded-xl border-red-200/50 dark:border-red-800/50 focus:border-red-500 focus:ring-red-500/20",
                    confirmText && confirmText !== profile?.store_name && "border-red-500 focus:border-red-500"
                  )}
                />
                {confirmText && confirmText !== profile?.store_name && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <X className="h-3 w-3" />
                    {isRTL ? "الاسم غير مطابق" : "Name does not match"}
                  </p>
                )}
                {confirmText === profile?.store_name && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {isRTL ? "✓ الاسم مطابق، يمكنك الحذف" : "✓ Name matches, you can delete"}
                  </p>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="p-6 pt-0 flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowConfirmDialog(false);
                setConfirmText("");
              }}
              className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300 h-12"
            >
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={
                deleteStore.isPending ||
                confirmText !== profile?.store_name ||
                hasActiveOrders ||
                hasActiveComplaints
              }
              className={cn(
                "flex-1 rounded-xl text-white shadow-lg transition-all duration-300 h-12",
                confirmText === profile?.store_name && !hasActiveOrders && !hasActiveComplaints
                  ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/30 hover:shadow-red-600/50 hover:scale-105"
                  : "bg-slate-400 cursor-not-allowed opacity-50"
              )}
            >
              {deleteStore.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {isRTL ? "جاري الحذف..." : "Deleting..."}
                </span>
              ) : (
                <>
                  <Trash2 className="h-5 w-5 mr-2" />
                  {isRTL ? "تأكيد الحذف النهائي" : "Confirm Permanent Deletion"}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ✅ نافذة النجاح (Final) */}
      <Dialog open={showFinalDialog} onOpenChange={setShowFinalDialog}>
        <DialogContent className="max-w-md rounded-2xl border-green-200/50 dark:border-green-800/30 shadow-2xl shadow-green-500/20 p-8 text-center">
          <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-xl shadow-green-500/30 animate-bounce">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
            ✅ {isRTL ? "تم حذف المتجر بنجاح" : "Store Deleted Successfully"}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-400">
            {isRTL
              ? "تم حذف متجرك وجميع بياناته المرتبطة. سيتم تحديث الصفحة تلقائياً..."
              : "Your store and all associated data have been deleted. The page will refresh automatically..."}
          </DialogDescription>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Loader2 className="h-5 w-5 animate-spin text-green-500" />
            <span className="text-sm text-green-600 dark:text-green-400">
              {isRTL ? "جاري التحديث..." : "Updating..."}
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}