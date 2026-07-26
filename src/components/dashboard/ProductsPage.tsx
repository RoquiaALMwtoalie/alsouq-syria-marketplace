// src/components/dashboard/ProductsPage.tsx
import { useState, useMemo } from "react";
import { 
  Plus, Package, ShoppingBag, Gift, Layers, 
  Search, Filter, RefreshCw, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, X, Eye, Edit2, Trash2,
  DollarSign, MapPin, Truck, CreditCard, Clock,
  CheckCircle2, AlertTriangle, Palette, Ruler,
  Share2, Heart, Bookmark, Star, ZoomIn, ZoomOut,
  MessageCircle, ThumbsUp, ThumbsDown, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useApp, useT, formatPrice } from "@/lib/i18n";
import { useCategories, useGovernorates, useMyListings, useCreateListing, useDeleteListing, useUpdateListing, useSendNotificationV2, type ListingKind } from "@/lib/queries";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import * as XLSX from 'xlsx';
import pkg from 'file-saver';
import { ProductFormDialog } from "./ProductFormDialog";
import { ProductCard } from "./ProductCard";
import { Variation } from "./ProductOptionsManager";
import { cn } from "@/lib/utils";
import { ProductService } from "@/lib/services/ProductService";
import { getUserDisplayName } from "@/lib/utils/helpers";
const { saveAs } = pkg;

export function ProductsPage() {
  const app = useApp();
  const t = useT();
  const { data: cats = [] } = useCategories();
  const { data: govs = [] } = useGovernorates();
  const { data: myListings = [], isLoading, refetch: refetchMyListings } = useMyListings(app.user?.id);
  const create = useCreateListing();
  const update = useUpdateListing();
  const del = useDeleteListing();
  const sendNotification = useSendNotificationV2();

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "published" | "archived">("all");
  const [filterType, setFilterType] = useState<"all" | "product" | "offer">("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProduct, setDialogProduct] = useState<any>(null);
  const [dialogType, setDialogType] = useState<"product" | "offer">("product");
  const [isSaving, setIsSaving] = useState(false);

  // Detail Dialog
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  
  // ✅ Slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Filters
  const filteredProducts = useMemo(() => {
    let result = myListings;
    if (filterStatus !== "all") result = result.filter((p: any) => p.status === filterStatus);
    if (filterType === "product") result = result.filter((p: any) => p.is_offer !== true);
    else if (filterType === "offer") result = result.filter((p: any) => p.is_offer === true);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p: any) => {
        const title = (p.title_ar || "").toLowerCase();
        return title.includes(q);
      });
    }
    return result;
  }, [myListings, searchQuery, filterStatus, filterType]);

  const totalPages = Math.ceil(filteredProducts.length / limit);
  const paginatedProducts = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredProducts.slice(start, start + limit);
  }, [filteredProducts, page, limit]);

  const stats = {
    total: myListings.length,
    pending: myListings.filter((p: any) => p.status === "pending").length,
    published: myListings.filter((p: any) => p.status === "published").length,
    archived: myListings.filter((p: any) => p.status === "archived").length,
    offers: myListings.filter((p: any) => p.is_offer === true).length,
    products: myListings.filter((p: any) => p.is_offer !== true).length,
  };

  // ===== تصدير =====
  const exportToExcel = () => {
    const exportData = filteredProducts.map((p: any) => ({
      'اسم المنتج': p.title_ar || '—',
      'السعر': formatPrice(Number(p.price), app.currency, app.lang),
      'الحالة': p.status === 'pending' ? 'قيد المراجعة' : p.status === 'published' ? 'منشور' : 'مؤرشف',
      'النوع': p.is_offer ? 'عرض' : 'منتج',
      'التصنيف': getCategoryName(p.category_id),
      'تاريخ الإضافة': new Date(p.created_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المنتجات');
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 25 }, { wch: 20 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  };

  const exportToWord = () => {
    let html = `
      <html dir="rtl"><head><meta charset="UTF-8">
      <style>body{font-family:Arial;padding:20px}th{background:#3b82f6;color:#fff;padding:12px}td{padding:10px;border:1px solid #e2e8f0}
      </style></head><body>
      <h1>📊 تقرير المنتجات</h1>
      <table><thead><tr><th>#</th><th>اسم المنتج</th><th>السعر</th><th>الحالة</th><th>النوع</th><th>التصنيف</th></tr></thead><tbody>
    `;
    filteredProducts.forEach((p: any, i: number) => {
      html += `<tr><td>${i+1}</td><td>${p.title_ar||'—'}</td>
        <td>${formatPrice(Number(p.price), app.currency, app.lang)}</td>
        <td>${p.status === 'pending' ? 'قيد المراجعة' : p.status === 'published' ? 'منشور' : 'مؤرشف'}</td>
        <td>${p.is_offer ? 'عرض' : 'منتج'}</td>
        <td>${getCategoryName(p.category_id)}</td></tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  };

  // ===== دوال مساعدة =====
  const getCategoryName = (id: string) => {
    const c = cats.find((cat: any) => cat.id === id);
    return c ? (app.lang === "ar" ? c.name_ar : c.name_en) : "";
  };

  const getGovernorateName = (id: string) => {
    const g = govs.find((gov: any) => gov.id === id);
    return g ? (app.lang === "ar" ? g.name_ar : g.name_en) : "";
  };

  // ===== ✅ دالة إرسال إشعار للأدمن (معدلة - تستخدم V2) =====
  const notifyAdmin = async (productTitle: string, actionType: string, userId: string, listingId: string) => {
    try {
      // ✅ جلب ID الأدمن (أول مستخدم لديه role = admin)
      const { data: adminRole, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();

      if (roleError || !adminRole) {
        console.log("ℹ️ No admin found to notify");
        return;
      }

      // ✅ استخدم الدالة المساعدة لجلب اسم المستخدم (store_name أولاً)
      const userName = await getUserDisplayName(userId);

      // ✅ إرسال الإشعار باستخدام V2
      await sendNotification.mutateAsync({
        userId: adminRole.user_id,
        type: "product_pending",
        titleAr: `📦 طلب ${actionType === "إضافة" ? "إضافة" : "تعديل"} منتج`,
        bodyAr: `قام ${userName} بـ ${actionType} المنتج "${productTitle}"، بحاجة للمراجعة`,
        linkUrl: `/admin/listings/${listingId}`,
        metadata: {
          product_id: listingId,
          action: actionType,
          user_name: userName,
          user_id: userId,
        },
        actions: [
          { label_ar: 'مراجعة المنتج', url: `/admin/listings/${listingId}` },
        ]
      });

      console.log(`✅ Admin notified about ${actionType} product: ${productTitle} from ${userName}`);
    } catch (error) {
      console.error("❌ Error notifying admin:", error);
    }
  };

  // ===== ✅ حفظ المنتج (معدل - يستخدم getUserDisplayName) =====
  const handleSaveProduct = async (data: any) => {
    setIsSaving(true);
    try {
      const price = Number(data.price);
      const oldPrice = Number(data.old_price) || 0;
      const discount = data.is_offer && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

      const isEditing = !!dialogProduct;
      let listingId: string;
      const productTitle = data.title_ar;

      if (isEditing) {
        // ✅ تحديث المنتج
        const { data: updated, error: updateError } = await supabase
          .from("listings")
          .update({
            title_ar: data.title_ar,
            description_ar: data.description_ar || null,
            price,
            price_usd: Number(data.price_usd) || null,
            old_price: oldPrice || null,
            old_price_usd: Number(data.old_price_usd) || null,
            discount_percent: discount,
            is_offer: data.is_offer,
            is_available: data.is_available,
            delivery_method: data.delivery_method,
            payment_method: data.payment_method,
            delivery_note: data.delivery_note || null,
            kind: data.kind || "product",
            category_id: data.category_id,
            governorate_id: data.governorate_id,
            cover_url: data.cover_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", dialogProduct.id)
          .select()
          .single();

        if (updateError) throw updateError;
        listingId = dialogProduct.id;

        // ✅ حذف البيانات القديمة باستخدام ProductService
        await ProductService.deleteProductData(listingId);

      } else {
        // ✅ إضافة منتج جديد
        const result = await create.mutateAsync({
          owner_id: app.user!.id,
          title_ar: data.title_ar,
          description_ar: data.description_ar || null,
          price,
          price_usd: Number(data.price_usd) || null,
          old_price: oldPrice || null,
          old_price_usd: Number(data.old_price_usd) || null,
          discount_percent: discount,
          is_offer: data.is_offer,
          is_available: data.is_available,
          delivery_method: data.delivery_method,
          payment_method: data.payment_method,
          delivery_note: data.delivery_note || null,
          kind: data.kind || "product",
          category_id: data.category_id,
          governorate_id: data.governorate_id,
          cover_url: data.cover_url,
          image_urls: [data.cover_url, ...(data.image_urls || [])].filter(Boolean),
          status: "pending",
        } as any);

        listingId = result.id;
      }

      // ✅ حفظ البيانات الجديدة باستخدام ProductService
      await ProductService.saveAllProductData(listingId, {
        options: data.options,
        colors: data.colors,
        variations: data.variations,
      });

      // ✅ تحديث metadata (للتخزين المؤقت فقط)
      await supabase
        .from("listings")
        .update({
          metadata: {
            options: data.options || {},
            variations: data.variations || [],
            colors: data.colors || [],
          }
        })
        .eq("id", listingId);

      // ✅ إرسال إشعار للأدمن (يستخدم getUserDisplayName داخلياً)
      const actionType = isEditing ? "تعديل" : "إضافة";
      await notifyAdmin(productTitle, actionType, app.user!.id, listingId);

      // ✅ 6. إنشاء طلب في seller_applications (عشان يظهر في قائمة الأدمن)
      // ✅ فقط عند إضافة منتج جديد (ليس عند التعديل)
      if (!isEditing) {
        try {
          // ✅ استخدم الدالة المساعدة لجلب اسم المستخدم
          const userName = await getUserDisplayName(app.user!.id);

          const { error: appError } = await supabase
            .from("seller_applications")
            .insert({
              user_id: app.user!.id,
              store_name: userName,
              store_description: `طلب إضافة منتج: ${productTitle}`,
              application_type: 'product',
              status: 'pending',
            });

          if (appError) {
            console.error("❌ Error creating seller application:", appError);
          } else {
            console.log(`✅ Seller application created for product: ${productTitle} from ${userName}`);
          }
        } catch (appError) {
          console.error("❌ Exception creating seller application:", appError);
        }
      }

      toast.success(
        isEditing
          ? app.lang === "ar" ? "تم تعديل المنتج بنجاح ✅" : "Product updated successfully ✅"
          : data.is_offer
            ? app.lang === "ar" ? "تم إرسال العرض للأدمن للمراجعة" : "Offer sent to admin"
            : app.lang === "ar" ? "تم إرسال المنتج للأدمن للمراجعة" : "Product sent to admin"
      );
      
      setDialogOpen(false);
      setDialogProduct(null);
      await refetchMyListings();
    } catch (e) {
      console.error("❌ Error in handleSaveProduct:", e);
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  };

  // ===== حذف المنتج =====
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      await del.mutateAsync(productToDelete.id);
      toast.success(app.lang === "ar" ? "تم حذف المنتج بنجاح" : "Product deleted");
      setDeleteDialogOpen(false);
      setProductToDelete(null);
      await refetchMyListings();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : String(e));
    }
  };

  // ===== فتح نافذة الإضافة =====
  const openAddDialog = (type: "product" | "offer") => {
    setDialogType(type);
    setDialogProduct(null);
    setDialogOpen(true);
  };

  // ===== فتح نافذة التعديل =====
  const openEditDialog = (product: any) => {
    setDialogProduct(product);
    setDialogType(product.is_offer ? "offer" : "product");
    setDialogOpen(true);
  };

  // ===== فتح تفاصيل المنتج =====
  const openProductDetail = (product: any) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsZoomed(false);
    setDetailDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20">
              <ShoppingBag className="h-5 w-5" />
            </div>
            {app.lang === "ar" ? "منتجاتي" : "My Products"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-blue-600">📦 {stats.products} {app.lang === "ar" ? "منتج" : "products"}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="inline-flex items-center gap-1 text-emerald-600">🎁 {stats.offers} {app.lang === "ar" ? "عرض" : "offers"}</span>
            <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
            <span className="inline-flex items-center gap-1 text-yellow-600">⏳ {stats.pending} {app.lang === "ar" ? "قيد المراجعة" : "pending"}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all" onClick={() => openAddDialog("product")}>
            <Plus className="h-4 w-4 mr-1.5" /> {app.lang === "ar" ? "أضف منتج" : "Add Product"}
          </Button>
          <Button size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:scale-105 transition-all" onClick={() => openAddDialog("offer")}>
            <Gift className="h-4 w-4 mr-1.5" /> {app.lang === "ar" ? "أضف عرض" : "Add Offer"}
          </Button>
          <Button variant="outline" size="sm" onClick={exportToExcel} disabled={filteredProducts.length === 0} className="rounded-xl border-emerald-500/30 text-emerald-600">
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
          </Button>
          <Button variant="outline" size="sm" onClick={exportToWord} disabled={filteredProducts.length === 0} className="rounded-xl border-blue-500/30 text-blue-600">
            <FileText className="h-4 w-4 mr-1.5" /> Word
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetchMyListings()} className="rounded-xl">
            <RefreshCw className="h-4 w-4 mr-1.5" /> {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-500/10' },
          { key: 'products', label: app.lang === 'ar' ? 'منتجات' : 'Products', value: stats.products, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
          { key: 'offers', label: app.lang === 'ar' ? 'عروض' : 'Offers', value: stats.offers, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { key: 'pending', label: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending', value: stats.pending, color: 'text-yellow-600', bg: 'bg-yellow-500/10' },
          { key: 'published', label: app.lang === 'ar' ? 'منشورة' : 'Published', value: stats.published, color: 'text-green-600', bg: 'bg-green-500/10' },
        ].map((stat) => (
          <div key={stat.key} className="bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-3 shadow-sm text-center">
            <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" />
          <Input value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }} placeholder={app.lang === "ar" ? "بحث..." : "Search..."} className="ps-9 h-10 rounded-xl" />
        </div>
        <Select value={filterStatus} onValueChange={(v: any) => { setFilterStatus(v); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl"><div className="flex items-center gap-2"><Filter className="h-4 w-4 text-slate-400" /><SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} /></div></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="pending">{app.lang === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="published">{app.lang === "ar" ? "منشور" : "Published"}</SelectItem>
            <SelectItem value="archived">{app.lang === "ar" ? "مؤرشف" : "Archived"}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterType} onValueChange={(v: any) => { setFilterType(v); setPage(1); }}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl"><div className="flex items-center gap-2"><Layers className="h-4 w-4 text-slate-400" /><SelectValue placeholder={app.lang === "ar" ? "النوع" : "Type"} /></div></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="product">📦 {app.lang === "ar" ? "منتج" : "Product"}</SelectItem>
            <SelectItem value="offer">🏷️ {app.lang === "ar" ? "عرض" : "Offer"}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1); }}>
          <SelectTrigger className="w-[100px] h-10 rounded-xl"><SelectValue placeholder="12" /></SelectTrigger>
          <SelectContent><SelectItem value="6">6</SelectItem><SelectItem value="12">12</SelectItem><SelectItem value="24">24</SelectItem><SelectItem value="48">48</SelectItem></SelectContent>
        </Select>
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1">
          <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" className="h-8 px-3 rounded-lg text-xs" onClick={() => setViewMode("grid")}><Layers className="h-3.5 w-3.5 mr-1" />{app.lang === "ar" ? "شبكة" : "Grid"}</Button>
          <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="h-8 px-3 rounded-lg text-xs" onClick={() => setViewMode("list")}><Layers className="h-3.5 w-3.5 mr-1 rotate-90" />{app.lang === "ar" ? "قائمة" : "List"}</Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); setPage(1); }} className="h-10 rounded-xl"><X className="h-4 w-4 mr-1.5" />{app.lang === "ar" ? "مسح" : "Clear"}</Button>
      </div>

      {/* Dialogs */}
      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={dialogProduct}
        productType={dialogType}
        onSave={handleSaveProduct}
        isSaving={isSaving}
        lang={app.lang}
      />

      {/* Products Grid/List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20"><div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600/20 border-t-indigo-600" /></div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50 p-20 text-center">
          <Package className="h-20 w-20 text-muted-foreground/40 mx-auto" />
          <p className="text-xl font-semibold text-muted-foreground mt-4">{app.lang === "ar" ? "لا توجد منتجات" : "No products"}</p>
          <p className="text-sm text-muted-foreground/60 mt-1">{app.lang === "ar" ? "ابدأ بإضافة منتجك الأول" : "Start by adding your first product"}</p>
          <div className="flex items-center justify-center gap-3 mt-6">
            <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg" onClick={() => openAddDialog("product")}><Plus className="h-4 w-4 me-2" /> {app.lang === "ar" ? "أضف منتج" : "Add Product"}</Button>
            <Button variant="outline" className="rounded-xl border-emerald-600/30 text-emerald-600" onClick={() => openAddDialog("offer")}><Gift className="h-4 w-4 me-2" /> {app.lang === "ar" ? "أضف عرض" : "Add Offer"}</Button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => openEditDialog(product)}
              onDelete={() => {
                setProductToDelete(product);
                setDeleteDialogOpen(true);
              }}
              onView={() => openProductDetail(product)}
              lang={app.lang}
              currency={app.currency}
              formatPrice={formatPrice}
              viewMode={viewMode}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {paginatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => openEditDialog(product)}
              onDelete={() => {
                setProductToDelete(product);
                setDeleteDialogOpen(true);
              }}
              onView={() => openProductDetail(product)}
              lang={app.lang}
              currency={app.currency}
              formatPrice={formatPrice}
              viewMode="list"
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-xs text-slate-500">{app.lang === "ar" ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={() => setPage(1)} disabled={page === 1} className="h-8 w-8 p-0 rounded-xl"><span className="text-xs">«</span></Button>
            <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1} className="h-8 w-8 p-0 rounded-xl"><ChevronLeft className="h-4 w-4" /></Button>
            <span className="px-3 text-sm font-medium">{page}</span>
            <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === totalPages} className="h-8 w-8 p-0 rounded-xl"><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" onClick={() => setPage(totalPages)} disabled={page === totalPages} className="h-8 w-8 p-0 rounded-xl"><span className="text-xs">»</span></Button>
          </div>
        </div>
      )}

      {/* ===== Product Detail Dialog - مثل نون 100% ===== */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900 p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30"
            onClick={() => {
              setDetailDialogOpen(false);
              setSelectedProduct(null);
              setIsZoomed(false);
            }}
          >
            <X className="h-5 w-5" />
          </Button>

          {selectedProduct && (
            <div className="flex flex-col lg:flex-row h-[95vh]">
              
              {/* ===== LEFT - صورة وسلايدر ===== */}
              <div className="lg:w-1/2 bg-slate-50 dark:bg-slate-800 flex flex-col h-full">
                <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                  {(() => {
                    const allImages = [];
                    
                    if (selectedProduct.cover_url) {
                      allImages.push(selectedProduct.cover_url);
                    }
                    
                    if (selectedProduct.listing_images && Array.isArray(selectedProduct.listing_images)) {
                      selectedProduct.listing_images.forEach((img: any) => {
                        if (img.url && !allImages.includes(img.url)) {
                          allImages.push(img.url);
                        }
                      });
                    }
                    
                    if (selectedProduct.image_urls && Array.isArray(selectedProduct.image_urls)) {
                      selectedProduct.image_urls.forEach((url: string) => {
                        if (url && url.trim() && !allImages.includes(url)) {
                          allImages.push(url);
                        }
                      });
                    }
                    
                    const images = allImages.length > 0 ? allImages : [selectedProduct.cover_url || '/placeholder.png'];
                    
                    const goToPrev = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
                    };
                    const goToNext = (e: React.MouseEvent) => {
                      e.stopPropagation();
                      setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
                    };
                    
                    return (
                      <>
                        <img
                          src={images[currentImageIndex]}
                          alt={selectedProduct.title_ar}
                          className={cn(
                            "max-h-full max-w-full object-contain rounded-xl transition-all duration-300 cursor-pointer",
                            isZoomed && "scale-150 cursor-zoom-out"
                          )}
                          onClick={() => setIsZoomed(!isZoomed)}
                        />
                        
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={goToPrev}
                              className="absolute start-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-700 transition-all hover:scale-110"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button
                              onClick={goToNext}
                              className="absolute end-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-700 transition-all hover:scale-110"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        <div className="absolute top-4 start-4 flex flex-col gap-2">
                          {selectedProduct.is_offer && (
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-3 py-1.5 text-xs font-bold">
                              🔥 {app.lang === "ar" ? "عرض خاص" : "Special Offer"}
                              {selectedProduct.discount_percent && ` -${selectedProduct.discount_percent}%`}
                            </Badge>
                          )}
                          {selectedProduct.status === "pending" && (
                            <Badge className="bg-yellow-500/90 text-white border-0 shadow-lg rounded-full px-3 py-1.5 text-xs">
                              ⏳ {app.lang === "ar" ? "قيد المراجعة" : "Pending"}
                            </Badge>
                          )}
                          {selectedProduct.is_available === false && (
                            <Badge className="bg-red-500/90 text-white border-0 shadow-lg rounded-full px-3 py-1.5 text-xs">
                              ❌ {app.lang === "ar" ? "غير متوفر" : "Unavailable"}
                            </Badge>
                          )}
                        </div>
                        
                        {images.length > 1 && (
                          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1.5">
                            {images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={() => setCurrentImageIndex(idx)}
                                className={cn(
                                  "h-1.5 rounded-full transition-all",
                                  idx === currentImageIndex ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/70"
                                )}
                              />
                            ))}
                            <span className="text-[10px] text-white/70 ms-1">
                              {currentImageIndex + 1}/{images.length}
                            </span>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
                
                {/* ✅ صور مصغرة (Thumbnails) */}
                {(() => {
                  const allImages = [];
                  if (selectedProduct.cover_url) allImages.push(selectedProduct.cover_url);
                  if (selectedProduct.listing_images && Array.isArray(selectedProduct.listing_images)) {
                    selectedProduct.listing_images.forEach((img: any) => {
                      if (img.url && !allImages.includes(img.url)) allImages.push(img.url);
                    });
                  }
                  if (selectedProduct.image_urls && Array.isArray(selectedProduct.image_urls)) {
                    selectedProduct.image_urls.forEach((url: string) => {
                      if (url && url.trim() && !allImages.includes(url)) allImages.push(url);
                    });
                  }
                  const images = allImages.length > 0 ? allImages : [selectedProduct.cover_url || '/placeholder.png'];
                  
                  if (images.length <= 1) return null;
                  
                  return (
                    <div className="flex gap-2 overflow-x-auto px-4 pb-4">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={cn(
                            "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all",
                            idx === currentImageIndex 
                              ? "border-blue-500 shadow-md" 
                              : "border-slate-200/50 hover:border-slate-400"
                          )}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>

              {/* ===== RIGHT - معلومات المنتج مثل نون ===== */}
              <div className="lg:w-1/2 p-6 md:p-8 overflow-y-auto bg-white dark:bg-slate-900 h-full">
                
                {/* اسم المنتج */}
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {selectedProduct.title_ar}
                </h1>
                
                {/* ✅ التقييمات */}
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn(
                        "h-4 w-4",
                        star <= Math.round(selectedProduct.avg_rating || selectedProduct.rating || 0) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-slate-300 dark:text-slate-600"
                      )} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({selectedProduct.reviews_count || 0} {app.lang === "ar" ? "تقييم" : "reviews"})
                  </span>
                </div>

                {/* ✅ عرض التقييمات */}
                {selectedProduct.reviews && selectedProduct.reviews.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <MessageCircle className="h-4 w-4" />
                      {app.lang === "ar" ? "آخر التقييمات" : "Latest Reviews"}
                    </p>
                    <div className="space-y-2 mt-2 max-h-32 overflow-y-auto">
                      {selectedProduct.reviews.slice(0, 2).map((review: any) => (
                        <div key={review.id} className="flex items-start gap-2 p-2 bg-slate-50/50 dark:bg-slate-800/30 rounded-lg">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1">
                              <div className="flex text-yellow-400 text-[10px]">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star key={s} className={cn(
                                    "h-2.5 w-2.5",
                                    s <= review.rating ? "fill-current" : "text-slate-300"
                                  )} />
                                ))}
                              </div>
                              {review.comment && (
                                <span className="text-xs text-muted-foreground truncate">- {review.comment}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* السعر */}
                <div className="mt-4 p-4 bg-slate-50/80 dark:bg-slate-800/50 rounded-2xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                        {formatPrice(Number(selectedProduct.price), app.currency, app.lang)}
                      </p>
                      {selectedProduct.price_usd && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5" />
                          ${Number(selectedProduct.price_usd).toFixed(2)}
                        </p>
                      )}
                    </div>
                    {selectedProduct.old_price && selectedProduct.old_price > selectedProduct.price && (
                      <div>
                        <div className="text-sm text-red-500 line-through font-medium">
                          {formatPrice(Number(selectedProduct.old_price), app.currency, app.lang)}
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-xs">
                          🎯 {Math.round(((selectedProduct.old_price - selectedProduct.price) / selectedProduct.old_price) * 100)}% {app.lang === "ar" ? "خصم" : "OFF"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* الألوان */}
                {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      {app.lang === "ar" ? "اللون" : "Color"}
                      <span className="text-xs text-muted-foreground/60 ms-1">
                        ({selectedProduct.colors.length} {app.lang === "ar" ? "خيار" : "options"})
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {selectedProduct.colors.map((color: any) => (
                        <div key={color.id} className="flex flex-col items-center gap-1 group cursor-pointer">
                          <div className="relative h-14 w-14 rounded-xl overflow-hidden border-2 border-slate-200/50 group-hover:border-blue-500 transition-all shadow-sm group-hover:shadow-md">
                            <img 
                              src={color.image_url} 
                              alt={color.color_name_ar}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder-color.png';
                              }}
                            />
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <CheckCircle2 className="h-5 w-5 text-blue-500 drop-shadow-lg" />
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground group-hover:text-blue-600 transition-colors font-medium">
                            {color.color_name_ar}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* المقاسات */}
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground">
                      {app.lang === "ar" ? "المقاس" : "Size"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProduct.sizes.map((size: string) => (
                        <span 
                          key={size}
                          className="px-4 py-2 border-2 border-slate-200/50 rounded-xl text-sm font-medium bg-white/50 dark:bg-slate-900/50 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 transition-all cursor-default shadow-sm hover:shadow-md"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* الوصف */}
                {selectedProduct.description_ar && (
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedProduct.description_ar}
                    </p>
                  </div>
                )}

                {/* معلومات إضافية */}
                <div className="mt-6 grid grid-cols-2 gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                  <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {app.lang === "ar" ? "التصنيف" : "Category"}
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      {getCategoryName(selectedProduct.category_id)}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {app.lang === "ar" ? "المحافظة" : "Governorate"}
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      {getGovernorateName(selectedProduct.governorate_id)}
                    </p>
                  </div>
                </div>

                {/* حالة التوفر */}
                <div className="mt-4 flex items-center gap-2 p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
                  <div className={cn(
                    "h-3 w-3 rounded-full",
                    selectedProduct.is_available ? "bg-emerald-500" : "bg-red-500"
                  )} />
                  <span className="text-sm font-medium">
                    {selectedProduct.is_available
                      ? (app.lang === "ar" ? "✅ متوفر للبيع" : "✅ Available for sale")
                      : (app.lang === "ar" ? "❌ غير متوفر" : "❌ Unavailable")}
                  </span>
                </div>

                {/* التوصيل والدفع */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Truck className="h-3 w-3" />
                      {app.lang === "ar" ? "التوصيل" : "Delivery"}
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      {selectedProduct.delivery_method === "pickup" && "🏪 " + (app.lang === "ar" ? "استلام من المتجر" : "Store pickup")}
                      {selectedProduct.delivery_method === "local_delivery" && "🚚 " + (app.lang === "ar" ? "توصيل داخل المدينة" : "Local delivery")}
                      {selectedProduct.delivery_method === "nationwide" && "📦 " + (app.lang === "ar" ? "شحن لكل المحافظات" : "Nationwide shipping")}
                      {selectedProduct.delivery_method === "none" && "❌ " + (app.lang === "ar" ? "بدون توصيل" : "No delivery")}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50/80 dark:bg-slate-800/50 rounded-xl">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <CreditCard className="h-3 w-3" />
                      {app.lang === "ar" ? "الدفع" : "Payment"}
                    </p>
                    <p className="text-sm font-medium mt-0.5">
                      {selectedProduct.payment_method === "cash" && "💰 " + (app.lang === "ar" ? "نقداً عند الاستلام" : "Cash on delivery")}
                      {selectedProduct.payment_method === "transfer" && "🏦 " + (app.lang === "ar" ? "تحويل بنكي" : "Bank transfer")}
                      {selectedProduct.payment_method === "online" && "💳 " + (app.lang === "ar" ? "دفع إلكتروني" : "Online payment")}
                      {selectedProduct.payment_method === "all" && "🌐 " + (app.lang === "ar" ? "كل الطرق" : "All methods")}
                    </p>
                  </div>
                </div>

                {/* أزرار الإجراءات */}
                <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl hover:border-indigo-500/50 hover:bg-indigo-50/50 h-12 group transition-all"
                    onClick={() => {
                      setDetailDialogOpen(false);
                      openEditDialog(selectedProduct);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2 text-indigo-500 group-hover:rotate-12 transition-transform" />
                    {app.lang === "ar" ? "تعديل" : "Edit"}
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-red-200/50 text-red-500 hover:text-red-600 hover:bg-red-50/50 h-12 group transition-all"
                    onClick={() => {
                      setDetailDialogOpen(false);
                      setProductToDelete(selectedProduct);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    {app.lang === "ar" ? "حذف" : "Delete"}
                  </Button>
                </div>

                {/* ✅ زر المشاركة */}
                <div className="mt-4 flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full h-8 w-8 p-0 hover:bg-blue-50"
                    onClick={async () => {
                      try {
                        if (navigator.share) {
                          await navigator.share({
                            title: selectedProduct.title_ar,
                            text: selectedProduct.description_ar || "",
                            url: window.location.href,
                          });
                        } else {
                          await navigator.clipboard?.writeText(window.location.href);
                          toast.success(app.lang === "ar" ? "تم نسخ الرابط 📋" : "Link copied 📋");
                        }
                      } catch (error) {
                        if (error instanceof Error && error.name !== 'AbortError') {
                          toast.error(app.lang === "ar" ? "فشل المشاركة" : "Share failed");
                        }
                      }
                    }}
                  >
                    <Share2 className="h-4 w-4 text-blue-500" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "مشاركة" : "Share"}
                  </span>
                </div>

                {/* تاريخ الإضافة */}
                <p className="text-[11px] text-muted-foreground text-center mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                  {app.lang === "ar" ? "تم الإضافة في " : "Added on "}
                  {new Date(selectedProduct.created_at).toLocaleDateString(
                    app.lang === "ar" ? "ar-SY" : "en-US",
                    { year: 'numeric', month: 'long', day: 'numeric' }
                  )}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== Delete Dialog ===== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-slate-200/50 dark:border-slate-800/50 p-0 overflow-hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-20"
            onClick={() => setDeleteDialogOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  {app.lang === "ar" ? "حذف المنتج" : "Delete Product"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {app.lang === "ar" ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                </p>
              </div>
            </div>

            <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300">
                {app.lang === "ar"
                  ? `هل أنت متأكد من حذف المنتج "${productToDelete?.title_ar}"؟`
                  : `Are you sure you want to delete "${productToDelete?.title_ar}"?`}
              </p>
              {productToDelete?.price && (
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                  {app.lang === "ar" ? "السعر: " : "Price: "}
                  {formatPrice(Number(productToDelete.price), app.currency, app.lang)}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDeleteProduct}
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}