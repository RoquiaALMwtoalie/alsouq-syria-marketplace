// src/components/dashboard/ProductsPage.tsx

import { useQueryClient } from "@tanstack/react-query";
import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { 
  Plus, Package, ShoppingBag, Gift, Layers, 
  Search, Filter, RefreshCw, FileSpreadsheet, FileText,
  ChevronLeft, ChevronRight, X, Eye, Edit2, Trash2,
  DollarSign, MapPin, Truck, CreditCard, Clock,
  CheckCircle2, AlertTriangle, Palette, Ruler,
  Share2, Heart, Bookmark, Star, ZoomIn, ZoomOut,
  MessageCircle, ThumbsUp, ThumbsDown, ChevronDown,
  Sparkles, Zap, TrendingUp, Award, Target, Rocket,
  Play, Pause, ShoppingCart, Percent, Tags,
  ChevronsLeft, ChevronsRight, Folder, FolderTree, CornerDownRight
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
import { OptimizedImage } from "@/components/OptimizedImage";

// ✅ IMPORT: نافذة تحويل إلى عرض
import { ConvertToOfferDialog } from "./ConvertToOfferDialog";

// ✅ IMPORT: Hook السلة
import { useAddToCart } from "@/lib/hooks/useCart";

// ✅ IMPORT: نافذة العرض الترويجي
import { AddBogoOfferDialog } from "./AddBogoOfferDialog";

// ✅ IMPORT: حذف العرض الترويجي
import { useDeleteProductOffer, useSellerOffers } from "@/lib/hooks/useProductOffers";

// ✅ IMPORT: نافذة تفاصيل العرض الترويجي
import { PromoOfferDetailDialog } from "./PromoOfferDetailDialog";

const { saveAs } = pkg;

// ============================================================
// 🎨 ZOOQ BRAND COLORS
// ============================================================
const COLORS = {
  olive: '#2a655f',
  oliveLight: '#3a8a82',
  oliveDark: '#1a4f4a',
  pink: '#f9a8d4',
  pinkLight: '#fbcfe8',
  fuchsia: '#d81b60',
  fuchsiaDark: '#c2185b',
};

export const ProductsPage = React.memo(function ProductsPage() {
  const app = useApp();
  const t = useT();
  const queryClient = useQueryClient();
  const { data: cats = [] } = useCategories();
  const { data: govs = [] } = useGovernorates();

  // ✅ منع التمرير التلقائي
  useEffect(() => {
    const currentScroll = window.scrollY;
    let isBlocking = true;
    let timeoutId: NodeJS.Timeout | null = null;
    
    const preventScroll = () => {
      if (isBlocking) window.scrollTo({ top: currentScroll, behavior: 'instant' });
    };
    
    window.addEventListener('scroll', preventScroll, { passive: true });
    window.addEventListener('wheel', preventScroll, { passive: true });
    window.addEventListener('touchmove', preventScroll, { passive: true });
    
    requestAnimationFrame(() => {
      window.scrollTo({ top: currentScroll, behavior: 'instant' });
    });
    
    timeoutId = setTimeout(() => {
      isBlocking = false;
      window.scrollTo({ top: currentScroll, behavior: 'instant' });
    }, 300);
    
    return () => {
      isBlocking = false;
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('scroll', preventScroll);
      window.removeEventListener('wheel', preventScroll);
      window.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  // ✅ جلب المنتجات
  const { 
    data: myListings = [], 
    isLoading, 
    isFetching,
    isError,
    refetch: refetchMyListings 
  } = useMyListings(app.user?.id);
  
  const { data: sellerOffers = [], refetch: refetchSellerOffers } = useSellerOffers(app.user?.id);

  const create = useCreateListing();
  const update = useUpdateListing();
  const del = useDeleteListing();
  const sendNotification = useSendNotificationV2();
  const addToCart = useAddToCart();
  const isOpeningDialog = useRef(false);
  const isOpeningDetail = useRef(false);
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "pending" | "published" | "archived">("all");
  const [filterType, setFilterType] = useState<"all" | "product" | "offer" | "promo">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  
  // Detail states
  const [detailCurrentImage, setDetailCurrentImage] = useState<string>("");
  const [detailSelectedColor, setDetailSelectedColor] = useState<any>(null);
  
  // Dialogs
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogProduct, setDialogProduct] = useState<any>(null);
  const [dialogType, setDialogType] = useState<"product" | "offer">("product");
  const [isSaving, setIsSaving] = useState(false);

  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any>(null);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [productToConvert, setProductToConvert] = useState<any>(null);
  const [isConverting, setIsConverting] = useState(false);

  const [selectedVariation, setSelectedVariation] = useState<any>(null);

  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [selectedOfferProduct, setSelectedOfferProduct] = useState<any>(null);
  const [editingOffer, setEditingOffer] = useState<any>(null);

  const deletePromoOffer = useDeleteProductOffer();

  const [promoDetailDialogOpen, setPromoDetailDialogOpen] = useState(false);
  const [selectedPromoOffer, setSelectedPromoOffer] = useState<any>(null);
  const [selectedPromoProduct, setSelectedPromoProduct] = useState<any>(null);

  const [confirmDeleteOfferOpen, setConfirmDeleteOfferOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  // ============================================================
  // ✅ دالة جلب اسم التصنيف الكامل (رئيسي + فرعي)
  // ============================================================
  const getFullCategoryPath = useCallback((parentCategoryId: string | null | undefined, categoryId: string | null | undefined): { parent: string; child: string } => {
    const parent = parentCategoryId ? cats.find((c: any) => c.id === parentCategoryId) : null;
    const child = categoryId ? cats.find((c: any) => c.id === categoryId) : null;
    
    return {
      parent: parent ? (app.lang === "ar" ? parent.name_ar : parent.name_en) : "",
      child: child && child.id !== parentCategoryId ? (app.lang === "ar" ? child.name_ar : child.name_en) : "",
    };
  }, [cats, app.lang]);

  const getCategoryName = useCallback((id: string) => {
    const c = cats.find((cat: any) => cat.id === id);
    return c ? (app.lang === "ar" ? c.name_ar : c.name_en) : "";
  }, [cats, app.lang]);

  const getGovernorateName = useCallback((id: string) => {
    const g = govs.find((gov: any) => gov.id === id);
    return g ? (app.lang === "ar" ? g.name_ar : g.name_en) : "";
  }, [govs, app.lang]);

  // ✅ ربط العروض الترويجية بالمنتجات
  const productsWithPromo = useMemo(() => {
    const products: any[] = [];
    
    myListings.forEach((product: any) => {
      products.push({
        ...product,
        is_promo_offer: false,
        product_type: product.is_offer ? 'discount' : 'regular',
      });
    });
    
    sellerOffers.forEach((offer: any) => {
      const listing = myListings.find((l: any) => l.id === offer.listing_id);
      if (listing) {
        products.push({
          id: `promo-${offer.id}`,
          title_ar: offer.display_text_ar || `🎁 ${listing.title_ar}`,
          title_en: offer.display_text_en || `🎁 ${listing.title_en || listing.title_ar}`,
          price: listing.price || 0,
          cover_url: listing.cover_url || '',
          status: offer.is_active ? 'published' : 'archived',
          is_available: offer.is_active,
          is_offer: false,
          is_promo_offer: true,
          product_type: 'promo',
          promo_offer: offer,
          created_at: offer.created_at,
          category_id: offer.category_id || listing.category_id,
          parent_category_id: offer.parent_category_id || listing.parent_category_id,
          colors: listing.colors || [],
          variations: listing.variations || [],
          avg_rating: listing.rating || 0,
          reviews_count: 0,
          buy_quantity: offer.buy_quantity,
          get_quantity: offer.get_quantity,
          offer_type: offer.offer_type,
          free_listing: myListings.find((l: any) => l.id === offer.free_listing_id) || null,
          original_listing: listing,
        });
      }
    });
    
    return products;
  }, [myListings, sellerOffers]);

  // ✅ الفلترة
  const filteredProducts = useMemo(() => {
    let result = productsWithPromo;
    
    if (filterStatus !== "all") {
      result = result.filter((p: any) => p.status === filterStatus);
    }
    
    if (filterType === "product") {
      result = result.filter((p: any) => p.product_type === 'regular');
    } else if (filterType === "offer") {
      result = result.filter((p: any) => p.product_type === 'discount');
    } else if (filterType === "promo") {
      result = result.filter((p: any) => p.product_type === 'promo');
    }
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p: any) => {
        const title = (p.title_ar || "").toLowerCase();
        return title.includes(q);
      });
    }
    
    return result;
  }, [productsWithPromo, searchQuery, filterStatus, filterType]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterType, itemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  }, [currentPage]);

  // ✅ الإحصائيات
  const stats = useMemo(() => {
    const promoCount = productsWithPromo.filter((p: any) => p.has_promo).length;
    
    return {
      total: productsWithPromo.length,
      pending: productsWithPromo.filter((p: any) => p.status === "pending").length,
      published: productsWithPromo.filter((p: any) => p.status === "published").length,
      archived: productsWithPromo.filter((p: any) => p.status === "archived").length,
      offers: productsWithPromo.filter((p: any) => p.is_offer === true).length,
      products: productsWithPromo.filter((p: any) => p.is_offer !== true && !p.has_promo).length,
      promo: promoCount,
      totalOffers: sellerOffers.length,
    };
  }, [productsWithPromo, sellerOffers]);

  // ===== تصدير Excel =====
  const exportToExcel = useCallback(() => {
    const exportData = filteredProducts.map((p: any) => {
      const fullCat = getFullCategoryPath(p.parent_category_id, p.category_id);
      const catStr = fullCat.parent && fullCat.child 
        ? `${fullCat.parent} > ${fullCat.child}` 
        : fullCat.parent || fullCat.child || '';
      
      return {
        'اسم المنتج': p.title_ar || '—',
        'السعر': formatPrice(Number(p.price), app.currency, app.lang),
        'الحالة': p.status === 'pending' ? 'قيد المراجعة' : p.status === 'published' ? 'منشور' : 'مؤرشف',
        'النوع': p.is_promo_offer ? 'عرض ترويجي' : p.is_offer ? 'عرض تخفيض' : 'منتج',
        'التصنيف': catStr,
        'تاريخ الإضافة': new Date(p.created_at).toLocaleDateString(app.lang === 'ar' ? 'ar-SA' : 'en-US'),
      };
    });

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'المنتجات');
    ws['!cols'] = [{ wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 15 }, { wch: 30 }, { wch: 20 }];
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.xlsx`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Excel" : "✅ Data exported to Excel");
  }, [filteredProducts, app.currency, app.lang, getFullCategoryPath]);

  // ===== تصدير Word =====
  const exportToWord = useCallback(() => {
    let html = `
      <html dir="rtl"><head><meta charset="UTF-8">
      <style>body{font-family:Arial;padding:20px}th{background:#2a655f;color:#fff;padding:12px}td{padding:10px;border:1px solid #e2e8f0}
      </style></head><body>
      <h1>📊 تقرير المنتجات</h1>
      <table><thead><tr><th>#</th><th>اسم المنتج</th><th>السعر</th><th>الحالة</th><th>النوع</th><th>التصنيف</th></tr></thead><tbody>
    `;
    filteredProducts.forEach((p: any, i: number) => {
      const type = p.is_promo_offer ? 'عرض ترويجي' : p.is_offer ? 'عرض تخفيض' : 'منتج';
      const fullCat = getFullCategoryPath(p.parent_category_id, p.category_id);
      const catStr = fullCat.parent && fullCat.child 
        ? `${fullCat.parent} > ${fullCat.child}` 
        : fullCat.parent || fullCat.child || '';
      
      html += `<tr><td>${i+1}</td><td>${p.title_ar||'—'}</td>
        <td>${formatPrice(Number(p.price), app.currency, app.lang)}</td>
        <td>${p.status === 'pending' ? 'قيد المراجعة' : p.status === 'published' ? 'منشور' : 'مؤرشف'}</td>
        <td>${type}</td>
        <td>${catStr}</td></tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  }, [filteredProducts, app.currency, app.lang, getFullCategoryPath]);

  // ===== إرسال إشعار للأدمن =====
  const notifyAdmin = useCallback(async (productTitle: string, actionType: string, userId: string, listingId: string) => {
    try {
      const { data: adminRole, error: roleError } = await supabase
        .from("user_roles")
        .select("user_id")
        .eq("role", "admin")
        .limit(1)
        .maybeSingle();

      if (roleError || !adminRole) return;

      const { data: userProfile } = await supabase
        .from("profiles")
        .select("full_name, store_name")
        .eq("id", userId)
        .maybeSingle();

      const userName = userProfile?.full_name || userProfile?.store_name || userId || 'مستخدم';
      
      let tabTarget = "";
      if (actionType === "إضافة" || actionType === "تعديل" || actionType === "إعادة نشر") {
        tabTarget = "listings";
      }

      await supabase.from("notifications").insert({
        user_id: adminRole.user_id,
        type: "product_pending",
        title_ar: `📦 طلب ${actionType} منتج`,
        body_ar: `قام ${userName} بـ ${actionType} المنتج "${productTitle}"، بحاجة للمراجعة`,
        link_url: `/admin?tab=${tabTarget}`,
        metadata: { product_id: listingId, action: actionType, user_name: userName },
        created_at: new Date().toISOString(),
        is_read: false,
      });
    } catch (error) {
      console.error("❌ Error notifying admin:", error);
    }
  }, []);

  // ===== حفظ المنتج =====
  const handleSaveProduct = useCallback(async (data: any) => {
    setDialogOpen(false);
    
    const isEditing = !!dialogProduct;
    toast.success(
      isEditing
        ? app.lang === "ar" ? "✅ تم تعديل المنتج بنجاح" : "✅ Product updated successfully"
        : data.is_offer
          ? app.lang === "ar" ? "✅ تم إرسال العرض للمراجعة" : "✅ Offer sent for review"
          : app.lang === "ar" ? "✅ تم إرسال المنتج للمراجعة" : "✅ Product sent for review"
    );

    setTimeout(() => setDialogProduct(null), 100);

    try {
      setIsSaving(true);
      const price = Number(data.price);
      const oldPrice = Number(data.old_price) || 0;
      const discount = data.is_offer && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : null;

      let listingId: string;
      const productTitle = data.title_ar;
      const currentDialogProduct = dialogProduct;

      if (isEditing && currentDialogProduct) {
        await update.mutateAsync({
          id: currentDialogProduct.id,
          patch: {
            title_ar: data.title_ar,
            description_ar: data.description_ar || null,
            price,
            old_price: oldPrice || null,
            discount_percent: discount,
            is_offer: data.is_offer,
            is_available: data.is_available,
            delivery_method: data.delivery_method,
            payment_method: data.payment_method,
            delivery_note: data.delivery_note || null,
            kind: data.kind || "product",
            category_id: data.category_id,
            parent_category_id: data.parent_category_id,
            governorate_id: data.governorate_id,
            cover_url: data.cover_url,
            updated_at: new Date().toISOString(),
          }
        });
        listingId = currentDialogProduct.id;
        await ProductService.deleteProductData(listingId);
      } else {
        const result = await create.mutateAsync({
          owner_id: app.user!.id,
          title_ar: data.title_ar,
          description_ar: data.description_ar || null,
          price,
          old_price: oldPrice || null,
          discount_percent: discount,
          is_offer: data.is_offer,
          is_available: data.is_available,
          delivery_method: data.delivery_method,
          payment_method: data.payment_method,
          delivery_note: data.delivery_note || null,
          kind: data.kind || "product",
          category_id: data.category_id,
          parent_category_id: data.parent_category_id,
          governorate_id: data.governorate_id,
          cover_url: data.cover_url,
          image_urls: [data.cover_url, ...(data.image_urls || [])].filter(Boolean),
          status: "pending",
        } as any);
        listingId = result.id;
      }

      await ProductService.saveAllProductData(listingId, {
        options: data.options || {},
        colors: data.colors || [],
        variations: data.variations || [],
        image_urls: data.image_urls || [],
      });

      const actionType = isEditing ? "تعديل" : "إضافة";
      notifyAdmin(productTitle, actionType, app.user!.id, listingId).catch(console.error);
      
      queryClient.invalidateQueries({ queryKey: ["listings", "my", app.user?.id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", listingId] });
      
      await refetchMyListings();

      if (!isEditing) {
        getUserDisplayName(app.user!.id).then(async (userName) => {
          const { data: existingApp } = await supabase
            .from("seller_applications")
            .select("id, status")
            .eq("user_id", app.user!.id)
            .eq("status", "pending")
            .limit(1)
            .maybeSingle();

          if (!existingApp) {
            await supabase.from("seller_applications").insert({
              user_id: app.user!.id,
              store_name: userName,
              store_description: `طلب إضافة منتج: ${productTitle}`,
              application_type: 'product',
              status: 'pending',
            });
          }
        }).catch(console.error);
      }
      
    } catch (e) {
      console.error("❌ Error in handleSaveProduct:", e);
      toast.error(e instanceof Error ? e.message : String(e));
    } finally {
      setIsSaving(false);
    }
  }, [dialogProduct, update, create, app.user, notifyAdmin, refetchMyListings, app.lang, queryClient]);

  // ===== حذف المنتج =====
  const handleDeleteProduct = useCallback(async () => {
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
  }, [productToDelete, del, refetchMyListings, app.lang]);

  // ===== تحويل المنتج إلى عرض =====
  const handleConvertToOffer = useCallback(async (productId: string, newPrice: number) => {
    try {
      setIsConverting(true);
      
      const product = myListings.find((p: any) => p.id === productId);
      if (!product) {
        toast.error(app.lang === "ar" ? "المنتج غير موجود" : "Product not found");
        return;
      }

      const originalPrice = Number(product.price);
      const discountPercent = Math.round(((originalPrice - newPrice) / originalPrice) * 100);
      
      await update.mutateAsync({
        id: productId,
        patch: {
          is_offer: true,
          old_price: originalPrice,
          price: newPrice,
          discount_percent: discountPercent,
          status: "published",
          updated_at: new Date().toISOString(),
        }
      });

      if (product.variations && product.variations.length > 0) {
        const updatedVariations = product.variations.map((v: any) => ({
          ...v,
          price: newPrice,
          old_price: v.price,
        }));
        await ProductService.saveVariations(productId, updatedVariations);
      }

      toast.success(
        app.lang === "ar"
          ? `🎉 تم تحويل "${product.title_ar}" إلى عرض تخفيض بخصم ${discountPercent}%`
          : `🎉 Converted "${product.title_ar}" to discount offer with ${discountPercent}% off`
      );

      setConvertDialogOpen(false);
      setProductToConvert(null);
      await refetchMyListings();
      await notifyAdmin(product.title_ar, "تحويل إلى عرض", app.user!.id, productId);

    } catch (error) {
      console.error("❌ Error converting to offer:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ أثناء تحويل المنتج" : "❌ Error converting product");
    } finally {
      setIsConverting(false);
    }
  }, [myListings, update, refetchMyListings, notifyAdmin, app.user, app.lang]);

  // ===== إعادة نشر المنتج =====
  const handleRepublish = useCallback(async (product: any) => {
    try {
      setIsSaving(true);
      
      await update.mutateAsync({
        id: product.id,
        patch: {
          status: "pending",
          updated_at: new Date().toISOString(),
        }
      });
      
      toast.success(app.lang === "ar" ? "📤 تم إرسال طلب إعادة النشر للمراجعة" : "📤 Republish request sent for review");
      await notifyAdmin(product.title_ar, "إعادة نشر", app.user!.id, product.id);
      
      queryClient.invalidateQueries({ queryKey: ["listings", "my", app.user?.id] });
      queryClient.invalidateQueries({ queryKey: ["listings"] });
      queryClient.invalidateQueries({ queryKey: ["listing", product.id] });
      
      await refetchMyListings();
      
    } catch (error) {
      console.error("❌ Error republishing product:", error);
      toast.error(app.lang === "ar" ? "❌ فشل إرسال طلب إعادة النشر" : "❌ Failed to send republish request");
    } finally {
      setIsSaving(false);
    }
  }, [update, app.user, app.lang, notifyAdmin, refetchMyListings, queryClient]);

  // ===== دوال العروض الترويجية =====
  const openConvertDialog = useCallback((product: any) => {
    setProductToConvert(product);
    setConvertDialogOpen(true);
  }, []);

  const handleAddPromoOffer = useCallback((product: any) => {
    setSelectedOfferProduct(product);
    setEditingOffer(null);
    setOfferDialogOpen(true);
  }, []);

  const handleEditPromoOffer = useCallback((offer: any) => {
    setSelectedOfferProduct(null);
    setEditingOffer(offer);
    setOfferDialogOpen(true);
  }, []);

  const handleRemovePromoOffer = useCallback((offerId: string) => {
    setOfferToDelete(offerId);
    setConfirmDeleteOfferOpen(true);
  }, []);

  const handleConfirmDeleteOffer = useCallback(async () => {
    if (!offerToDelete) return;
    
    try {
      await deletePromoOffer.mutateAsync(offerToDelete);
      await refetchMyListings();
      await refetchSellerOffers();
      toast.success(app.lang === "ar" ? "✅ تم إزالة العرض الترويجي بنجاح" : "✅ Promo offer removed successfully");
      
      setConfirmDeleteOfferOpen(false);
      setOfferToDelete(null);
    } catch (error: any) {
      console.error("❌ Error:", error);
      let errorMessage = "❌ فشل إزالة العرض الترويجي";
      if (error?.message) errorMessage = error.message;
      toast.error(errorMessage);
    }
  }, [offerToDelete, deletePromoOffer, refetchMyListings, refetchSellerOffers, app.lang]);

  const handleViewPromoOffer = useCallback((offer: any) => {
    const product = myListings.find((p: any) => p.id === offer.listing_id);
    setSelectedPromoProduct(product || null);
    
    let bundleProducts: any[] = [];
    let allProducts: any[] = [];
    
    if (offer.offer_type === 'bundle' && offer.required_product_ids) {
      bundleProducts = offer.required_product_ids.map((id: string) => {
        const found = myListings.find((p: any) => p.id === id);
        if (found) {
          const reqVar = offer.required_variations?.find((rv: any) => rv.product_id === id);
          return {
            ...found,
            required_variations: reqVar?.variation_ids || [],
            required_quantity: reqVar?.quantity || 1,
          };
        } else {
          return {
            id: id,
            title_ar: `منتج ${id.slice(0, 8)}`,
            title_en: `Product ${id.slice(0, 8)}`,
            price: 0,
            variations: [],
            required_variations: [],
            required_quantity: 1,
          };
        }
      }).filter(Boolean);
      
      allProducts = bundleProducts;
    }
    
    let freeProduct = null;
    if (offer.free_listing_id) {
      freeProduct = myListings.find((p: any) => p.id === offer.free_listing_id);
      if (freeProduct) {
        freeProduct = {
          ...freeProduct,
          selected_variations: offer.result_variation_ids || [],
        };
        allProducts.push(freeProduct);
      } else {
        freeProduct = {
          id: offer.free_listing_id,
          title_ar: `منتج ${offer.free_listing_id.slice(0, 8)}`,
          title_en: `Product ${offer.free_listing_id.slice(0, 8)}`,
          price: 0,
          variations: [],
          selected_variations: offer.result_variation_ids || [],
        };
        allProducts.push(freeProduct);
      }
    }
    
    const enrichedOffer = {
      ...offer,
      bundle_products: bundleProducts,
      _products: allProducts,
      free_product: freeProduct,
      product_details: product,
    };
    
    setSelectedPromoOffer(enrichedOffer);
    setPromoDetailDialogOpen(true);
  }, [myListings]);

  // ===== فتح النوافذ =====
  const openAddDialog = useCallback((type: "product" | "offer") => {
    setDialogType(type);
    setDialogProduct(null);
    setDialogOpen(true);
  }, []);

  const openEditDialog = useCallback((product: any) => {
    if (isOpeningDialog.current) return;
    isOpeningDialog.current = true;
    
    // ✅ للعروض الترويجية
    if (product.is_promo_offer && product.promo_offer) {
      handleEditPromoOffer(product.promo_offer);
      setTimeout(() => { isOpeningDialog.current = false; }, 500);
      return;
    }
    
    // ✅ للمنتجات العادية
    setDialogProduct(product);
    setDialogType(product.is_offer ? "offer" : "product");
    setDialogOpen(true);
    
    setTimeout(() => { isOpeningDialog.current = false; }, 500);
  }, [handleEditPromoOffer]);

  const openProductDetail = useCallback((product: any) => {
    if (isOpeningDetail.current) return;
    isOpeningDetail.current = true;
    
    // ✅ للعروض الترويجية → نافذة التفاصيل الخاصة
    if (product.is_promo_offer && product.promo_offer) {
      handleViewPromoOffer(product.promo_offer);
      setTimeout(() => { isOpeningDetail.current = false; }, 500);
      return;
    }
    
    setSelectedVariation(null);
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsZoomed(false);
    setDetailCurrentImage(product?.cover_url || '');
    setDetailSelectedColor(null);
    setDetailDialogOpen(true);
    
    setTimeout(() => { isOpeningDetail.current = false; }, 500);
  }, [handleViewPromoOffer]);

  const handleDetailColorSelect = useCallback((color: any) => {
    setDetailSelectedColor(color);
    setDetailCurrentImage(color?.image_url || selectedProduct?.cover_url || '');
    setSelectedVariation(null);
  }, [selectedProduct]);

  const handleAddToCartFromDetail = useCallback(async () => {
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      return;
    }
    if (!selectedProduct) return;
    
    const hasVariations = selectedProduct.variations && selectedProduct.variations.length > 0;
    if (hasVariations && !selectedVariation) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء اختيار التركيبة أولاً" : "⚠️ Please select a variation first");
      return;
    }
    
    try {
      await addToCart.mutateAsync({
        userId: app.user.id,
        listingId: selectedProduct.id,
        quantity: 1,
        selectedColor: selectedVariation?.combination?.colors || undefined,
        selectedSize: selectedVariation?.combination?.sizes || undefined,
        selectedVariationId: selectedVariation?.id || undefined,
        variationPrice: selectedVariation?.price || selectedProduct.price,
        variationCombination: selectedVariation?.combination || undefined,
      });
      toast.success(app.lang === "ar" ? "✅ تم إضافة المنتج للسلة 🛒" : "✅ Product added to cart 🛒");
    } catch (error) {
      console.error("❌ Error adding to cart:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ في الإضافة" : "❌ Error adding to cart");
    }
  }, [app.user, selectedProduct, selectedVariation, addToCart, app.lang]);

  // ✅ النوافذ المؤجلة
  const memoizedAddBogoOfferDialog = useMemo(() => (
    <AddBogoOfferDialog
      key="add-bogo-offer-dialog"
      open={offerDialogOpen}
      onOpenChange={setOfferDialogOpen}
      product={selectedOfferProduct}
      existingOffer={editingOffer}
      onSuccess={() => {
        refetchMyListings();
        refetchSellerOffers();
        toast.success(app.lang === "ar" ? "✅ تم إضافة العرض الترويجي بنجاح" : "✅ Promo offer added successfully");
      }}
    />
  ), [offerDialogOpen, selectedOfferProduct, editingOffer, refetchMyListings, refetchSellerOffers, app.lang]);

  const memoizedPromoOfferDetailDialog = useMemo(() => (
    <PromoOfferDetailDialog
      key="promo-offer-detail-dialog"
      open={promoDetailDialogOpen}
      onOpenChange={setPromoDetailDialogOpen}
      offer={selectedPromoOffer}
      product={selectedPromoProduct}
      lang={app.lang}
      currency={app.currency}
      formatPrice={formatPrice}
      onEdit={() => {
        if (selectedPromoOffer) {
          handleEditPromoOffer(selectedPromoOffer);
        }
      }}
      onDelete={() => {
        if (selectedPromoOffer) {
          handleRemovePromoOffer(selectedPromoOffer.id);
        }
      }}
    />
  ), [promoDetailDialogOpen, selectedPromoOffer, selectedPromoProduct, app.lang, app.currency, formatPrice, handleEditPromoOffer, handleRemovePromoOffer]);

  // ✅ حالة التحميل
  if (isLoading || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-6">
        <div className="relative">
          <div className="h-20 w-20 rounded-full border-4 border-[#2a655f]/20 border-t-[#2a655f] animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-8 w-8 text-[#2a655f] animate-pulse" />
          </div>
          <div className="absolute -inset-4 rounded-full border-2 border-[#2a655f]/10 animate-ping" />
        </div>
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 animate-pulse">
            {app.lang === "ar" ? "⏳ جاري تحميل منتجاتك..." : "⏳ Loading your products..."}
          </p>
          <p className="text-sm text-muted-foreground">
            {app.lang === "ar" ? "قد يستغرق هذا بضع ثوانٍ" : "This may take a few seconds"}
          </p>
        </div>
        <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#f9a8d4] rounded-full animate-slide" />
        </div>
      </div>
    );
  }

  // ✅ حالة الخطأ
  if (isError) {
    return (
      <div className="rounded-3xl border-2 border-red-200/50 dark:border-red-800/30 p-20 text-center bg-red-50/50 dark:bg-red-950/20">
        <AlertTriangle className="h-20 w-20 text-red-500/60 mx-auto animate-pulse" />
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mt-4">
          {app.lang === "ar" ? "❌ حدث خطأ في تحميل المنتجات" : "❌ Error loading products"}
        </h3>
        <Button 
          variant="outline" 
          className="mt-6 rounded-xl border-2 border-red-300/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 hover:scale-105"
          onClick={() => refetchMyListings()}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          {app.lang === "ar" ? "🔄 إعادة المحاولة" : "🔄 Retry"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25">
              <ShoppingBag className="h-5 w-5" />
            </div>
            {app.lang === "ar" ? "منتجاتي" : "My Products"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-sm px-3 py-1">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10">
              <Package className="h-3.5 w-3.5 text-[#2a655f]" />
              <span className="text-[#2a655f] font-medium">{stats.products}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "منتج" : "products"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50">
              <Percent className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.offers}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "تخفيض" : "discounts"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#f9a8d4]/10 border border-[#f9a8d4]/20">
              <Sparkles className="h-3.5 w-3.5 text-[#d81b60]" />
              <span className="text-[#d81b60] font-medium">{stats.promo}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "ترويجي" : "promo"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/50">
              <Clock className="h-3.5 w-3.5 text-yellow-500" />
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "قيد المراجعة" : "pending"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            size="sm" 
            className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:scale-105 transition-all duration-300"
            onClick={() => openAddDialog("product")}
          >
            <Plus className="h-4 w-4 mr-1.5" /> 
            {app.lang === "ar" ? "أضف منتج" : "Add Product"}
          </Button>
          
          <Button 
            size="sm" 
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 hover:scale-105 transition-all duration-300"
            onClick={() => openAddDialog("offer")}
          >
            <Percent className="h-4 w-4 mr-1.5" /> 
            {app.lang === "ar" ? "عرض تخفيض" : "Discount"}
          </Button>

          <Button 
            size="sm" 
            className="rounded-xl bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/25 hover:scale-105 transition-all duration-300"
            onClick={() => {
              setSelectedOfferProduct(null);
              setEditingOffer(null);
              setOfferDialogOpen(true);
            }}
          >
            <Sparkles className="h-4 w-4 mr-1.5" /> 
            {app.lang === "ar" ? "عرض ترويجي" : "Promo"}
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel} 
            disabled={filteredProducts.length === 0} 
            className="rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-all duration-300"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToWord} 
            disabled={filteredProducts.length === 0} 
            className="rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-all duration-300"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Word
          </Button>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: Package, gradient: 'from-[#2a655f] to-[#f9a8d4]' },
          { key: 'products', label: app.lang === 'ar' ? 'منتجات' : 'Products', value: stats.products, icon: ShoppingBag, gradient: 'from-[#3a8a82] to-[#f9a8d4]' },
          { key: 'offers', label: app.lang === 'ar' ? 'تخفيضات' : 'Discounts', value: stats.offers, icon: Percent, gradient: 'from-[#1a4f4a] to-[#f9a8d4]' },
          { key: 'promo', label: app.lang === 'ar' ? 'ترويجية' : 'Promo', value: stats.promo, icon: Sparkles, gradient: 'from-[#d81b60] to-[#f9a8d4]' },
          { key: 'pending', label: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending', value: stats.pending, icon: Clock, gradient: 'from-amber-500 to-orange-500' },
          { key: 'published', label: app.lang === 'ar' ? 'منشورة' : 'Published', value: stats.published, icon: CheckCircle2, gradient: 'from-emerald-500 to-teal-500' },
        ].map((stat, i) => (
          <div 
            key={i} 
            className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex items-start justify-between p-4">
              <div>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1 group-hover:text-[#2a655f] transition-colors">{stat.value}</p>
              </div>
              <div className="h-12 w-12 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                <stat.icon className="h-5 w-5 text-[#2a655f]" />
              </div>
            </div>
            <div className="mt-0 h-1 w-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div 
                className={cn("h-full rounded-full bg-gradient-to-r", stat.gradient, "transition-all duration-1000 animate-shimmer")} 
                style={{ width: `${Math.min(100, (stat.value / (stats.total || 1)) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-focus-within:text-[#2a655f] transition-colors" />
          <Input 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            placeholder={app.lang === "ar" ? "🔍 ابحث في منتجاتك..." : "🔍 Search your products..."} 
            className="ps-9 h-10 rounded-xl border border-slate-200 dark:border-slate-700 focus:border-[#2a655f] focus:ring-2 focus:ring-[#2a655f]/20 transition-all" 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f]">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Select value={filterStatus} onValueChange={(v: any) => { setFilterStatus(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/50 transition-all">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="pending">⏳ {app.lang === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="published">✅ {app.lang === "ar" ? "منشور" : "Published"}</SelectItem>
            <SelectItem value="archived">📁 {app.lang === "ar" ? "مؤرشف" : "Archived"}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={(v: any) => { setFilterType(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[170px] h-10 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/50 transition-all">
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "النوع" : "Type"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="product">📦 {app.lang === "ar" ? "منتج" : "Product"}</SelectItem>
            <SelectItem value="offer">🏷️ {app.lang === "ar" ? "عرض تخفيض" : "Discount"}</SelectItem>
            <SelectItem value="promo">✨ {app.lang === "ar" ? "عرض ترويجي" : "Promo"}</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
          <Button 
            variant={viewMode === "grid" ? "default" : "ghost"} 
            size="sm" 
            className={cn(
              "h-8 px-3 rounded-lg text-xs transition-all",
              viewMode === "grid" && "bg-[#2a655f] hover:bg-[#3a8a82] text-white"
            )} 
            onClick={() => setViewMode("grid")}
          >
            <Layers className="h-3.5 w-3.5 mr-1" />
            {app.lang === "ar" ? "شبكة" : "Grid"}
          </Button>
          <Button 
            variant={viewMode === "list" ? "default" : "ghost"} 
            size="sm" 
            className={cn(
              "h-8 px-3 rounded-lg text-xs transition-all",
              viewMode === "list" && "bg-[#2a655f] hover:bg-[#3a8a82] text-white"
            )} 
            onClick={() => setViewMode("list")}
          >
            <Layers className="h-3.5 w-3.5 mr-1 rotate-90" />
            {app.lang === "ar" ? "قائمة" : "List"}
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); setCurrentPage(1); }} 
          className="h-10 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-50 transition-all"
        >
          <X className="h-4 w-4 mr-1.5" />
          {app.lang === "ar" ? "مسح" : "Clear"}
        </Button>
      </div>

      {/* ============================================================ */}
      {/* ✅ عرض المنتجات - بطريقة السلة (List Mode) */}
      {/* ============================================================ */}
      {myListings.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-20 text-center bg-gradient-to-b from-[#2a655f]/5 to-transparent">
          <div className="h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto">
            <Package className="h-12 w-12 text-[#2a655f]/60" />
          </div>
          <h3 className="text-2xl font-bold mt-6 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
            {app.lang === "ar" ? "🚀 لا توجد منتجات بعد" : "🚀 No products yet"}
          </h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            {app.lang === "ar" 
              ? "ابدأ رحلتك التجارية الآن وأضف منتجك الأول" 
              : "Start your business journey now and add your first product"}
          </p>
          <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
            <Button 
              className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white shadow-lg hover:scale-105 transition-all"
              onClick={() => openAddDialog("product")}
            >
              <Plus className="h-4 w-4 me-2" /> 
              {app.lang === "ar" ? "أضف منتج جديد" : "Add New Product"}
            </Button>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-20 text-center">
          <Search className="h-20 w-20 text-muted-foreground/40 mx-auto" />
          <h3 className="text-xl font-semibold text-muted-foreground mt-4">
            {app.lang === "ar" ? "🔍 لا توجد نتائج مطابقة" : "🔍 No matching results"}
          </h3>
          <Button 
            variant="outline" 
            className="mt-4 rounded-xl"
            onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); }}
          >
            <X className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
          </Button>
        </div>
      ) : (
        <>
          {/* ===== عرض المنتجات - يشبه السلة (كروت بعرض كامل تحت بعض) ===== */}
          <div className={cn(
            "space-y-3",
            viewMode === "grid" && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 space-y-0"
          )}>
            {paginatedProducts.map((product: any) => {
              const isChild = product.parent_category_id && product.parent_category_id !== product.category_id;
              const parentCat = product.parent_category_id ? cats.find((c: any) => c.id === product.parent_category_id) : null;
              const childCat = product.category_id && product.category_id !== product.parent_category_id
                ? cats.find((c: any) => c.id === product.category_id)
                : null;

              return (
                <div 
                  key={product.id}
                  className="group bg-white dark:bg-[#1e293b] rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 hover:shadow-lg transition-all duration-300 overflow-hidden"
                >
                  <div className="flex flex-col md:flex-row gap-3 p-3">
                    
                    {/* ✅ الصورة */}
                    <div 
                      className="relative w-full md:w-32 h-48 md:h-32 shrink-0 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer"
                      onClick={() => openProductDetail(product)}
                    >
                      <OptimizedImage
                        src={product.cover_url || '/placeholder.png'}
                        alt={product.title_ar}
                        width={200}
                        height={200}
                        quality={85}
                        objectFit="cover"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      
                      {/* ✅ شارات على الصورة */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {product.is_promo_offer && (
                          <Badge className="bg-gradient-to-r from-[#d81b60] to-[#f48fb1] text-white border-0 text-[9px] px-2 py-0.5 animate-pulse">
                            <Sparkles className="h-2.5 w-2.5 mr-1" />
                            {app.lang === "ar" ? "ترويجي" : "Promo"}
                          </Badge>
                        )}
                        {product.is_offer && !product.is_promo_offer && (
                          <Badge className="bg-emerald-500 text-white border-0 text-[9px] px-2 py-0.5">
                            🔥 -{product.discount_percent || 0}%
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {/* ✅ المحتوى */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                      
                      <div>
                        {/* ✅ اسم المنتج */}
                        <h3 
                          className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-[#2a655f] transition-colors mb-1"
                          onClick={() => openProductDetail(product)}
                        >
                          {product.title_ar}
                        </h3>
                        
                        {/* ✅ التصنيف (رئيسي + فرعي) */}
                        {(parentCat || childCat) && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 mb-1 flex-wrap">
                            {parentCat && (
                              <span className="inline-flex items-center gap-0.5 bg-[#2a655f]/10 text-[#2a655f] px-2 py-0.5 rounded-full font-medium">
                                <Folder className="h-2.5 w-2.5" />
                                {app.lang === "ar" ? parentCat.name_ar : parentCat.name_en}
                              </span>
                            )}
                            {childCat && (
                              <>
                                <CornerDownRight className="h-2.5 w-2.5 text-[#d81b60]/60" />
                                <span className="inline-flex items-center gap-0.5 bg-[#d81b60]/10 text-[#d81b60] px-2 py-0.5 rounded-full font-medium">
                                  <FolderTree className="h-2.5 w-2.5" />
                                  {app.lang === "ar" ? childCat.name_ar : childCat.name_en}
                                </span>
                              </>
                            )}
                          </div>
                        )}
                        
                        {/* ✅ الحالة والتقييم */}
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <Badge className={cn(
                            "text-[9px] border-0 px-2 py-0.5",
                            product.status === 'published' && "bg-emerald-500/10 text-emerald-600",
                            product.status === 'pending' && "bg-amber-500/10 text-amber-600",
                            product.status === 'archived' && "bg-slate-500/10 text-slate-600"
                          )}>
                            {product.status === 'published' && '✅ ' + (app.lang === "ar" ? "منشور" : "Published")}
                            {product.status === 'pending' && '⏳ ' + (app.lang === "ar" ? "قيد المراجعة" : "Pending")}
                            {product.status === 'archived' && '📁 ' + (app.lang === "ar" ? "مؤرشف" : "Archived")}
                          </Badge>
                          
                          {product.avg_rating > 0 && (
                            <div className="flex items-center gap-0.5">
                              <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                              <span className="text-[10px] font-medium text-slate-600 dark:text-slate-400">
                                {Number(product.avg_rating).toFixed(1)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* ✅ السعر والإجراءات */}
                      <div className="flex items-end justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                        <div className="flex flex-col">
                          {product.is_offer && product.old_price && (
                            <span className="text-[10px] text-slate-400 line-through">
                              {formatPrice(Number(product.old_price), app.currency, app.lang)}
                            </span>
                          )}
                          <span className="text-base font-bold text-[#2a655f]">
                            {formatPrice(Number(product.price), app.currency, app.lang)}
                          </span>
                        </div>
                        
                        {/* ✅ أزرار الإجراءات */}
                        <div className="flex items-center gap-1">
                          {/* عرض */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10 hover:border-[#2a655f] hover:text-[#2a655f] transition-all"
                            onClick={() => openProductDetail(product)}
                            title={app.lang === "ar" ? "عرض" : "View"}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          
                          {/* تعديل */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/10 hover:border-[#2a655f] hover:text-[#2a655f] transition-all"
                            onClick={() => openEditDialog(product)}
                            title={app.lang === "ar" ? "تعديل" : "Edit"}
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </Button>
                          
                          {/* تحويل لتخفيض (للمنتجات العادية فقط) */}
                          {!product.is_offer && !product.is_promo_offer && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-600 transition-all"
                              onClick={() => openConvertDialog(product)}
                              title={app.lang === "ar" ? "تحويل لتخفيض" : "Convert to Discount"}
                            >
                              <Percent className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          
                          {/* إضافة عرض ترويجي */}
                          {!product.is_promo_offer && !product.has_promo && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#d81b60]/10 hover:border-[#d81b60] hover:text-[#d81b60] transition-all"
                              onClick={() => handleAddPromoOffer(product)}
                              title={app.lang === "ar" ? "إضافة عرض ترويجي" : "Add Promo"}
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          
                          {/* حذف */}
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 rounded-lg border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:border-red-400 hover:text-red-600 transition-all"
                            onClick={() => {
                              setProductToDelete(product);
                              setDeleteDialogOpen(true);
                            }}
                            title={app.lang === "ar" ? "حذف" : "Delete"}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== PAGINATION ===== */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-5 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {app.lang === "ar" 
                  ? `صفحة ${currentPage} من ${totalPages}` 
                  : `Page ${currentPage} of ${totalPages}`}
              </span>
              <Badge variant="outline" className="border-slate-200 text-slate-600 text-[10px]">
                {filteredProducts.length} {app.lang === "ar" ? "منتج" : "products"}
              </Badge>
              
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {app.lang === "ar" ? "عرض:" : "Show:"}
                </span>
                <Select 
                  value={String(itemsPerPage)} 
                  onValueChange={(v) => { 
                    setItemsPerPage(Number(v)); 
                    setCurrentPage(1); 
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg">
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronsLeft className="h-4 w-4 text-[#2a655f]" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4 text-[#2a655f]" />
              </Button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) pageNum = i + 1;
                  else if (currentPage <= 4) pageNum = i + 1;
                  else if (currentPage >= totalPages - 3) pageNum = totalPages - 6 + i;
                  else pageNum = currentPage - 3 + i;
                  
                  if (i === 0 && pageNum > 1 && currentPage > 4) {
                    return <span key="dots-start" className="px-1 text-muted-foreground">…</span>;
                  }
                  if (i === 6 && pageNum < totalPages - 1 && currentPage < totalPages - 3) {
                    return <span key="dots-end" className="px-1 text-muted-foreground">…</span>;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "ghost"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className={cn(
                        "h-9 min-w-[36px] px-2.5 rounded-xl text-sm font-medium transition-all",
                        pageNum === currentPage 
                          ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-md" 
                          : "hover:bg-[#2a655f]/10 hover:text-[#2a655f]"
                      )}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4 text-[#2a655f]" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40"
              >
                <ChevronsRight className="h-4 w-4 text-[#2a655f]" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ===== PRODUCT DETAIL DIALOG ===== */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30 transition-all"
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
              
              {/* ✅ الصور */}
              <div className="lg:w-1/2 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex flex-col h-full relative">
                <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
                  {(() => {
                    const allImages: string[] = [];
                    if (selectedProduct.cover_url) allImages.push(selectedProduct.cover_url);
                    if (selectedProduct.listing_images) {
                      selectedProduct.listing_images.forEach((img: any) => {
                        if (img.url && !allImages.includes(img.url)) allImages.push(img.url);
                      });
                    }
                    if (selectedProduct.image_urls) {
                      selectedProduct.image_urls.forEach((url: string) => {
                        if (url && url.trim() && !allImages.includes(url)) allImages.push(url);
                      });
                    }
                    const images = allImages.length > 0 ? allImages : [selectedProduct.cover_url || '/placeholder.png'];
                    
                    return (
                      <>
                        <img
                          src={detailCurrentImage || selectedProduct?.cover_url || '/placeholder.png'}
                          alt={selectedProduct?.title_ar}
                          className={cn(
                            "max-h-full max-w-full object-contain rounded-xl transition-all duration-500 cursor-pointer",
                            isZoomed && "scale-150 cursor-zoom-out"
                          )}
                          onClick={() => setIsZoomed(!isZoomed)}
                        />
                        
                        {images.length > 1 && (
                          <>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1)); }} 
                              className="absolute start-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center"
                            >
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0)); }} 
                              className="absolute end-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center"
                            >
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* ✅ التفاصيل */}
              <div className="lg:w-1/2 p-6 md:p-8 overflow-y-auto bg-white dark:bg-slate-900 h-full">
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {selectedProduct.title_ar}
                </h1>
                
                {/* ✅ التصنيف (رئيسي + فرعي) */}
                {(() => {
                  const parentCat = selectedProduct.parent_category_id 
                    ? cats.find((c: any) => c.id === selectedProduct.parent_category_id) 
                    : null;
                  const childCat = selectedProduct.category_id && selectedProduct.category_id !== selectedProduct.parent_category_id
                    ? cats.find((c: any) => c.id === selectedProduct.category_id)
                    : null;
                  
                  if (!parentCat && !childCat) return null;
                  
                  return (
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      {parentCat && (
                        <span className="inline-flex items-center gap-1 bg-[#2a655f]/10 text-[#2a655f] px-3 py-1 rounded-full text-xs font-medium">
                          <Folder className="h-3 w-3" />
                          {app.lang === "ar" ? parentCat.name_ar : parentCat.name_en}
                        </span>
                      )}
                      {childCat && (
                        <>
                          <CornerDownRight className="h-3 w-3 text-[#d81b60]" />
                          <span className="inline-flex items-center gap-1 bg-[#d81b60]/10 text-[#d81b60] px-3 py-1 rounded-full text-xs font-medium">
                            <FolderTree className="h-3 w-3" />
                            {app.lang === "ar" ? childCat.name_ar : childCat.name_en}
                          </span>
                        </>
                      )}
                    </div>
                  );
                })()}
                
                {/* ✅ السعر */}
                <div className="mt-4 p-4 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 rounded-2xl border border-[#2a655f]/20">
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-3xl font-bold text-[#2a655f]">
                        {formatPrice(Number(selectedProduct.price), app.currency, app.lang)}
                      </p>
                    </div>
                    {selectedProduct.old_price && selectedProduct.old_price > selectedProduct.price && (
                      <div>
                        <div className="text-sm text-red-500 line-through">
                          {formatPrice(Number(selectedProduct.old_price), app.currency, app.lang)}
                        </div>
                        <Badge className="bg-[#d81b60]/20 text-[#d81b60] border-0 text-xs">
                          {Math.round(((selectedProduct.old_price - selectedProduct.price) / selectedProduct.old_price) * 100)}% {app.lang === "ar" ? "خصم" : "OFF"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* ✅ الوصف */}
                {selectedProduct.description_ar && (
                  <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl">
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {selectedProduct.description_ar}
                    </p>
                  </div>
                )}

                {/* ✅ أزرار الإجراءات */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-2 border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 h-12"
                    onClick={() => {
                      setDetailDialogOpen(false);
                      openEditDialog(selectedProduct);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    {app.lang === "ar" ? "تعديل" : "Edit"}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-2 border-red-200 text-red-500 hover:bg-red-50 h-12"
                    onClick={() => {
                      setDetailDialogOpen(false);
                      setProductToDelete(selectedProduct);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {app.lang === "ar" ? "حذف" : "Delete"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ===== DELETE PRODUCT DIALOG ===== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-0 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {app.lang === "ar" ? "حذف المنتج" : "Delete Product"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {app.lang === "ar" ? "لا يمكن التراجع" : "Cannot be undone"}
                </p>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300">
                {app.lang === "ar"
                  ? `هل أنت متأكد من حذف "${productToDelete?.title_ar}"؟`
                  : `Delete "${productToDelete?.title_ar}"?`}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDeleteProduct}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
              >
                {del.isPending ? "..." : (app.lang === "ar" ? "تأكيد" : "Confirm")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog تأكيد حذف العرض الترويجي ===== */}
      <Dialog open={confirmDeleteOfferOpen} onOpenChange={setConfirmDeleteOfferOpen}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 p-0 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold">
                  {app.lang === "ar" ? "حذف العرض الترويجي" : "Delete Promo Offer"}
                </h3>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300">
                {app.lang === "ar"
                  ? "هل أنت متأكد من حذف هذا العرض؟"
                  : "Are you sure?"}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmDeleteOfferOpen(false);
                  setOfferToDelete(null);
                }}
                className="flex-1 rounded-xl"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleConfirmDeleteOffer}
                disabled={deletePromoOffer.isPending}
                className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white"
              >
                {deletePromoOffer.isPending ? "..." : (app.lang === "ar" ? "تأكيد" : "Confirm")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ✅ ProductFormDialog */}
      <ProductFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        product={dialogProduct}
        productType={dialogType}
        onSave={handleSaveProduct}
        isSaving={isSaving}
        lang={app.lang}
      />

      {/* ✅ ConvertToOfferDialog */}
      <ConvertToOfferDialog
        open={convertDialogOpen}
        onOpenChange={setConvertDialogOpen}
        product={productToConvert}
        onConfirm={handleConvertToOffer}
        isConverting={isConverting}
        lang={app.lang}
        currency={app.currency}
        formatPrice={formatPrice}
      />

      {/* ✅ نافذة العرض الترويجي */}
      {memoizedAddBogoOfferDialog}

      {/* ✅ نافذة تفاصيل العرض الترويجي */}
      {memoizedPromoOfferDetailDialog}

      <style>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-slide {
          animation: slide 1.5s ease-in-out infinite;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
});

export default ProductsPage;