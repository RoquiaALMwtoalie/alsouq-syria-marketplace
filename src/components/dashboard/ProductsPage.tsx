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
  ChevronsLeft, ChevronsRight
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

// ✅ IMPORT: نافذة تحويل إلى عرض
import { ConvertToOfferDialog } from "./ConvertToOfferDialog";

// ✅ IMPORT: Hook السلة
import { useAddToCart } from "@/lib/hooks/useCart";

// ✅ IMPORT: نافذة العرض الترويجي (BOGO/Cross-sell/Bundle)
import { AddBogoOfferDialog } from "./AddBogoOfferDialog";

// ✅ ✅ ✅ IMPORT: حذف العرض الترويجي 🔥🔥🔥
import { useDeleteProductOffer, useSellerOffers } from "@/lib/hooks/useProductOffers";

// ✅ ✅ ✅ IMPORT: نافذة تفاصيل العرض الترويجي
import { PromoOfferDetailDialog } from "./PromoOfferDetailDialog";

const { saveAs } = pkg;

export const ProductsPage = React.memo(function ProductsPage() {
  const app = useApp();
  const t = useT();
  const queryClient = useQueryClient();
  const { data: cats = [] } = useCategories();
  const { data: govs = [] } = useGovernorates();
  
  // ✅ استخدام useMyListings مع الإعدادات المحسنة
  const { 
    data: myListings = [], 
    isLoading, 
    isFetching,
    isError,
    refetch: refetchMyListings 
  } = useMyListings(app.user?.id);
  
  // ✅ جلب العروض الترويجية للبائع
  const { data: sellerOffers = [], refetch: refetchSellerOffers } = useSellerOffers(app.user?.id);

  const create = useCreateListing();
  const update = useUpdateListing();
  const del = useDeleteListing();
  const sendNotification = useSendNotificationV2();
  const addToCart = useAddToCart();
  const isOpeningDialog = useRef(false);
  
  // ✅ منع فتح نافذة التفاصيل بشكل متكرر
  const isOpeningDetail = useRef(false);
  
  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "draft" | "pending" | "published" | "archived">("all");
  const [filterType, setFilterType] = useState<"all" | "product" | "offer" | "promo">("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // ✅ State للتفاصيل
  const [detailCurrentImage, setDetailCurrentImage] = useState<string>("");
  const [detailSelectedColor, setDetailSelectedColor] = useState<any>(null);
  
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
  
  // Slider state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // ✅ State لتحويل المنتج إلى عرض
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [productToConvert, setProductToConvert] = useState<any>(null);
  const [isConverting, setIsConverting] = useState(false);

  // ✅ State لاختيار التركيبة في صفحة التفاصيل
  const [selectedVariation, setSelectedVariation] = useState<any>(null);

  // ✅ ✅ ✅ State للعرض الترويجي (BOGO/Cross-sell/Bundle)
  const [offerDialogOpen, setOfferDialogOpen] = useState(false);
  const [selectedOfferProduct, setSelectedOfferProduct] = useState<any>(null);
  const [editingOffer, setEditingOffer] = useState<any>(null);

  // ✅ ✅ ✅ Delete Promo Offer Mutation
  const deletePromoOffer = useDeleteProductOffer();

  // ✅ ✅ ✅ State لتفاصيل العرض الترويجي
  const [promoDetailDialogOpen, setPromoDetailDialogOpen] = useState(false);
  const [selectedPromoOffer, setSelectedPromoOffer] = useState<any>(null);
  const [selectedPromoProduct, setSelectedPromoProduct] = useState<any>(null);

  // ✅ ✅ ✅ State لـ Dialog تأكيد حذف العرض الترويجي
  const [confirmDeleteOfferOpen, setConfirmDeleteOfferOpen] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState<string | null>(null);

  // ✅ ✅ ✅ ربط العروض الترويجية بالمنتجات
  const productsWithPromo = useMemo(() => {
    const products: any[] = [];
    
    // 1️⃣ إضافة المنتجات العادية وعروض التخفيض
    myListings.forEach((product: any) => {
        products.push({
            ...product,
            is_promo_offer: false,
            product_type: product.is_offer ? 'discount' : 'regular',
        });
    });
    
    // 2️⃣ ✅ إضافة العروض الترويجية كمنتجات مستقلة (بدون دمج)
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

  // ✅ تعريف filteredProducts مع دعم العروض الترويجية
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

  // ✅ حساب عدد الصفحات
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));

  // ✅ المنتجات المعروضة في الصفحة الحالية
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // ✅ Reset عند تغيير الفلاتر أو عدد المنتجات
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus, filterType, itemsPerPage]);

  // ✅ التنقل بين الصفحات
  const goToPage = useCallback((page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  // ✅ إحصائيات
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

  // ===== تصدير =====
  const exportToExcel = useCallback(() => {
    const exportData = filteredProducts.map((p: any) => ({
      'اسم المنتج': p.title_ar || '—',
      'السعر': formatPrice(Number(p.price), app.currency, app.lang),
      'الحالة': p.status === 'pending' ? 'قيد المراجعة' : p.status === 'published' ? 'منشور' : 'مؤرشف',
      'النوع': p.is_offer ? 'عرض تخفيض' : p.has_promo ? 'عرض ترويجي' : 'منتج',
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
  }, [filteredProducts, app.currency, app.lang]);

  const exportToWord = useCallback(() => {
    let html = `
      <html dir="rtl"><head><meta charset="UTF-8">
      <style>body{font-family:Arial;padding:20px}th{background:#2a655f;color:#fff;padding:12px}td{padding:10px;border:1px solid #e2e8f0}
      </style></head><body>
      <h1>📊 تقرير المنتجات</h1>
      <table><thead><tr><th>#</th><th>اسم المنتج</th><th>السعر</th><th>الحالة</th><th>النوع</th><th>التصنيف</th></tr></thead><tbody>
    `;
    filteredProducts.forEach((p: any, i: number) => {
      const type = p.is_offer ? 'عرض تخفيض' : p.has_promo ? 'عرض ترويجي' : 'منتج';
      html += `<tr><td>${i+1}</td><td>${p.title_ar||'—'}</td>
        <td>${formatPrice(Number(p.price), app.currency, app.lang)}</td>
        <td>${p.status === 'pending' ? 'قيد المراجعة' : p.status === 'published' ? 'منشور' : 'مؤرشف'}</td>
        <td>${type}</td>
        <td>${getCategoryName(p.category_id)}</td></tr>`;
    });
    html += `</tbody></table></body></html>`;
    const blob = new Blob([html], { type: 'application/msword;charset=utf-8' });
    saveAs(blob, `المنتجات_${new Date().toLocaleDateString('ar-SA').replace(/\//g, '-')}.doc`);
    toast.success(app.lang === "ar" ? "✅ تم تصدير البيانات إلى Word" : "✅ Data exported to Word");
  }, [filteredProducts, app.currency, app.lang]);

  // ===== دوال مساعدة =====
  const getCategoryName = useCallback((id: string) => {
    const c = cats.find((cat: any) => cat.id === id);
    return c ? (app.lang === "ar" ? c.name_ar : c.name_en) : "";
  }, [cats, app.lang]);

  const getGovernorateName = useCallback((id: string) => {
    const g = govs.find((gov: any) => gov.id === id);
    return g ? (app.lang === "ar" ? g.name_ar : g.name_en) : "";
  }, [govs, app.lang]);

  // ===== دالة إرسال إشعار للأدمن =====
// ===== دالة إرسال إشعار للأدمن =====
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

  // ============================================================
  // ✅✅✅ دالة فتح Dialog التأكيد (بدلاً من confirm())
  // ============================================================
const handleRemovePromoOffer = useCallback((offerId: string) => {
    console.log("🔴🔴🔴 [handleRemovePromoOffer] ===== START =====");
    console.log("🔴🔴🔴 [handleRemovePromoOffer] offerId:", offerId);
    
    // ✅ فتح الـ Dialog المخصص بدلاً من confirm()
    setOfferToDelete(offerId);
    setConfirmDeleteOfferOpen(true);
    
    console.log("🔴🔴🔴 [handleRemovePromoOffer] ===== END (Dialog opened) =====");
}, []);

  // ============================================================
  // ✅✅✅ دالة تأكيد الحذف الفعلية
  // ============================================================
const handleConfirmDeleteOffer = useCallback(async () => {
    if (!offerToDelete) return;
    
    console.log("✅ [handleConfirmDeleteOffer] Confirmed deletion for:", offerToDelete);
    
    try {
        await deletePromoOffer.mutateAsync(offerToDelete);
        await refetchMyListings();
        await refetchSellerOffers();
        toast.success(app.lang === "ar" ? "✅ تم إزالة العرض الترويجي بنجاح" : "✅ Promo offer removed successfully");
        
        setConfirmDeleteOfferOpen(false);
        setOfferToDelete(null);
        
      
        
    } catch (error: any) {
        console.error("❌ [handleConfirmDeleteOffer] Error:", error);
        let errorMessage = "❌ فشل إزالة العرض الترويجي";
        if (error?.message) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }
        toast.error(errorMessage);
    }
}, [offerToDelete, deletePromoOffer, refetchMyListings, refetchSellerOffers, app.lang]);
// ============================================================
// ✅✅✅ دالة فتح تفاصيل العرض الترويجي - المُصححة بالكامل
// ============================================================
const handleViewPromoOffer = useCallback((offer: any) => {
    console.log("🔍 [handleViewPromoOffer] ===== START =====");
    console.log("🔍 [handleViewPromoOffer] offer:", offer);
    
    // ✅ 1. المنتج الأساسي
    const product = myListings.find((p: any) => p.id === offer.listing_id);
    setSelectedPromoProduct(product || null);
    
    // ✅ 2. ✅✅✅ جلب المنتجات المطلوبة (لـ Bundle)
    let bundleProducts: any[] = [];
    let allProducts: any[] = [];
    
    if (offer.offer_type === 'bundle' && offer.required_product_ids) {
        console.log("📦 [handleViewPromoOffer] Bundle detected, fetching products...");
        
        bundleProducts = offer.required_product_ids.map((id: string) => {
            const found = myListings.find((p: any) => p.id === id);
            if (found) {
                // ✅ جلب الفيرنتات المطلوبة لهذا المنتج
                const reqVar = offer.required_variations?.find(
                    (rv: any) => rv.product_id === id
                );
                console.log(`📦 [handleViewPromoOffer] Product found: ${found.title_ar}, quantity: ${reqVar?.quantity || 1}`);
                return {
                    ...found,
                    required_variations: reqVar?.variation_ids || [],
                    required_quantity: reqVar?.quantity || 1,
                };
            } else {
                console.warn(`⚠️ [handleViewPromoOffer] Product not found: ${id}`);
                // ✅ إذا المنتج مش موجود، نرجع كائن مؤقت
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
        
        // ✅ حفظ كل المنتجات في مصفوفة للبحث
        allProducts = bundleProducts;
    }
    
    // ✅ 3. ✅✅✅ جلب المنتج المجاني (الهدية)
    let freeProduct = null;
    if (offer.free_listing_id) {
        console.log("🎁 [handleViewPromoOffer] Fetching free product:", offer.free_listing_id);
        freeProduct = myListings.find((p: any) => p.id === offer.free_listing_id);
        if (freeProduct) {
            freeProduct = {
                ...freeProduct,
                selected_variations: offer.result_variation_ids || [],
            };
            allProducts.push(freeProduct);
            console.log("🎁 [handleViewPromoOffer] Free product found:", freeProduct.title_ar);
        } else {
            console.warn("⚠️ [handleViewPromoOffer] Free product not found:", offer.free_listing_id);
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
    
    // ✅ 4. ✅✅✅ دمج كل البيانات في offer واحد
    const enrichedOffer = {
        ...offer,
        bundle_products: bundleProducts,      // ✅ منتجات الباقة مع تفاصيلها
        _products: allProducts,               // ✅ جميع المنتجات للبحث
        free_product: freeProduct,            // ✅ المنتج المجاني
        product_details: product,             // ✅ المنتج الأساسي
    };
    
    console.log("✅ [handleViewPromoOffer] Enriched offer:", enrichedOffer);
    console.log("✅ [handleViewPromoOffer] bundle_products:", bundleProducts);
    console.log("✅ [handleViewPromoOffer] _products:", allProducts);
    
    setSelectedPromoOffer(enrichedOffer);
    setPromoDetailDialogOpen(true);
    
}, [myListings]);
  // ===== فتح نافذة الإضافة =====
  const openAddDialog = useCallback((type: "product" | "offer") => {
    setDialogType(type);
    setDialogProduct(null);
    setDialogOpen(true);
  }, []);

  // ===== فتح نافذة التعديل =====
  const openEditDialog = useCallback((product: any) => {
    if (isOpeningDialog.current) return;
    isOpeningDialog.current = true;
    
    setDialogProduct(product);
    setDialogType(product.is_offer ? "offer" : "product");
    setDialogOpen(true);
    
    setTimeout(() => { isOpeningDialog.current = false; }, 500);
  }, []);

  // ===== فتح تفاصيل المنتج =====
  const openProductDetail = useCallback((product: any) => {
    setSelectedVariation(null);
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsZoomed(false);
    setDetailCurrentImage(product?.cover_url || '');
    setDetailSelectedColor(null);
    setDetailDialogOpen(true);
  }, []);

  const handleDetailColorSelect = useCallback((color: any) => {
    setDetailSelectedColor(color);
    setDetailCurrentImage(color?.image_url || selectedProduct?.cover_url || '');
    setSelectedVariation(null);
  }, [selectedProduct]);

  // ===== إضافة المنتج للسلة =====
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

  // ✅ ✅ ✅ استخدم useMemo هنا (في أعلى مستوى، قبل أي return)
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

  // ✅ عرض حالة التحميل
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
          <div className="h-full w-1/2 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] rounded-full animate-slide" />
        </div>
      </div>
    );
  }

  // ✅ عرض حالة الخطأ
  if (isError) {
    return (
      <div className="rounded-3xl border-2 border-red-200/50 dark:border-red-800/30 p-20 text-center bg-red-50/50 dark:bg-red-950/20">
        <AlertTriangle className="h-20 w-20 text-red-500/60 mx-auto animate-pulse" />
        <h3 className="text-xl font-semibold text-red-600 dark:text-red-400 mt-4">
          {app.lang === "ar" ? "❌ حدث خطأ في تحميل المنتجات" : "❌ Error loading products"}
        </h3>
        <Button 
          variant="outline" 
          className="mt-6 rounded-xl border-red-300/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-300 hover:scale-105"
          onClick={() => refetchMyListings()}
        >
          <RefreshCw className="h-4 w-4 mr-2 animate-spin-slow" />
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
          <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-[#2a655f]/5 blur-2xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-[#3a8a82]/5 blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
          
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-3">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-[#2a655f]/20 blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative p-2.5 rounded-2xl bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white shadow-lg shadow-[#2a655f]/25 group-hover:shadow-[#2a655f]/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                <ShoppingBag className="h-5 w-5 group-hover:animate-bounce" />
              </div>
            </div>
            {app.lang === "ar" ? "منتجاتي" : "My Products"}
            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20 text-sm px-3 py-1 animate-pulse">
              {stats.total}
            </Badge>
          </h1>
          
          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#2a655f]/5 border border-[#2a655f]/10 hover:bg-[#2a655f]/10 transition-colors">
              <Package className="h-3.5 w-3.5 text-[#2a655f] animate-pulse" />
              <span className="text-[#2a655f] font-medium">{stats.products}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "منتج" : "products"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 hover:bg-emerald-100/50 dark:hover:bg-emerald-950/30 transition-colors">
              <Percent className="h-3.5 w-3.5 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">{stats.offers}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "تخفيض" : "discounts"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 hover:bg-purple-100/50 dark:hover:bg-purple-950/30 transition-colors">
              <Sparkles className="h-3.5 w-3.5 text-purple-500" />
              <span className="text-purple-600 dark:text-purple-400 font-medium">{stats.promo}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "ترويجي" : "promo"}</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-[#2a655f]/30" />
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200/50 dark:border-yellow-800/30 hover:bg-yellow-100/50 dark:hover:bg-yellow-950/30 transition-colors">
              <Clock className="h-3.5 w-3.5 text-yellow-500 animate-pulse" />
              <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.pending}</span>
              <span className="text-xs text-muted-foreground">{app.lang === "ar" ? "قيد المراجعة" : "pending"}</span>
            </span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button 
            size="sm" 
            className="rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 hover:scale-105 transition-all duration-300 group"
            onClick={() => openAddDialog("product")}
          >
            <Plus className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" /> 
            {app.lang === "ar" ? "أضف منتج" : "Add Product"}
          </Button>
          
          <Button 
            size="sm" 
            className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:scale-105 transition-all duration-300 group"
            onClick={() => openAddDialog("offer")}
          >
            <Percent className="h-4 w-4 mr-1.5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" /> 
            {app.lang === "ar" ? "عرض تخفيض" : "Discount Offer"}
          </Button>

          <Button 
            size="sm" 
            className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 hover:scale-105 transition-all duration-300 group"
            onClick={() => {
              setSelectedOfferProduct(null);
              setEditingOffer(null);
              setOfferDialogOpen(true);
            }}
          >
            <Sparkles className="h-4 w-4 mr-1.5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" /> 
            {app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"}
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToExcel} 
            disabled={filteredProducts.length === 0} 
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
          >
            <FileSpreadsheet className="h-4 w-4 mr-1.5" /> Excel
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportToWord} 
            disabled={filteredProducts.length === 0} 
            className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105"
          >
            <FileText className="h-4 w-4 mr-1.5" /> Word
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { refetchMyListings(); refetchSellerOffers(); }} 
            className="rounded-xl border-[#2a655f]/20 hover:border-[#2a655f]/40 hover:bg-[#2a655f]/5 transition-all duration-300 group"
          >
            <RefreshCw className="h-4 w-4 mr-1.5 group-hover:rotate-180 transition-transform duration-700" /> 
            {app.lang === "ar" ? "تحديث" : "Refresh"}
          </Button>
        </div>
      </div>

      {/* ===== STATS CARDS ===== */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {[
          { key: 'total', label: app.lang === 'ar' ? 'الإجمالي' : 'Total', value: stats.total, icon: Package, color: 'text-[#2a655f]', bg: 'bg-[#2a655f]/10', border: 'border-[#2a655f]/20', gradient: 'from-[#2a655f]/5 to-[#2a655f]/10' },
          { key: 'products', label: app.lang === 'ar' ? 'منتجات' : 'Products', value: stats.products, icon: ShoppingBag, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-200/50 dark:border-indigo-800/30', gradient: 'from-indigo-500/5 to-indigo-500/10' },
          { key: 'offers', label: app.lang === 'ar' ? 'تخفيضات' : 'Discounts', value: stats.offers, icon: Percent, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-200/50 dark:border-emerald-800/30', gradient: 'from-emerald-500/5 to-emerald-500/10' },
          { key: 'promo', label: app.lang === 'ar' ? 'ترويجية' : 'Promo', value: stats.promo, icon: Sparkles, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-200/50 dark:border-purple-800/30', gradient: 'from-purple-500/5 to-purple-500/10' },
          { key: 'pending', label: app.lang === 'ar' ? 'قيد المراجعة' : 'Pending', value: stats.pending, icon: Clock, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-200/50 dark:border-yellow-800/30', gradient: 'from-yellow-500/5 to-yellow-500/10' },
          { key: 'published', label: app.lang === 'ar' ? 'منشورة' : 'Published', value: stats.published, icon: CheckCircle2, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-500/10', border: 'border-green-200/50 dark:border-green-800/30', gradient: 'from-green-500/5 to-green-500/10' },
        ].map((stat) => (
          <div key={stat.key} className="group relative bg-white dark:bg-[#1e293b] rounded-xl border border-slate-200/60 dark:border-slate-700/60 p-4 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className={`absolute -top-8 -right-8 h-16 w-16 rounded-full ${stat.bg} blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            <div className="relative flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <stat.icon className={`h-3 w-3 ${stat.color} group-hover:scale-110 transition-transform duration-300`} />
                  {stat.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${stat.color} group-hover:scale-110 transition-transform duration-300 origin-right`}>
                  {stat.value}
                </p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${stat.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 w-full bg-gradient-to-r from-transparent via-[#2a655f] to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
          </div>
        ))}
      </div>

      {/* ===== SEARCH & FILTERS ===== */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 group">
          <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400 group-hover:text-[#2a655f] transition-colors duration-300" />
          <Input 
            value={searchQuery} 
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
            placeholder={app.lang === "ar" ? "🔍 ابحث في منتجاتك..." : "🔍 Search your products..."} 
            className="ps-9 h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 focus:border-[#2a655f]/50 focus:ring-2 focus:ring-[#2a655f]/20 transition-all duration-300" 
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute inset-y-0 end-3 flex items-center text-slate-400 hover:text-[#2a655f] transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        <Select value={filterStatus} onValueChange={(v: any) => { setFilterStatus(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[150px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "الحالة" : "Status"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="all" className="hover:bg-[#2a655f]/10">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="pending" className="hover:bg-[#2a655f]/10">⏳ {app.lang === "ar" ? "قيد المراجعة" : "Pending"}</SelectItem>
            <SelectItem value="published" className="hover:bg-[#2a655f]/10">✅ {app.lang === "ar" ? "منشور" : "Published"}</SelectItem>
            <SelectItem value="archived" className="hover:bg-[#2a655f]/10">📁 {app.lang === "ar" ? "مؤرشف" : "Archived"}</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={(v: any) => { setFilterType(v); setCurrentPage(1); }}>
          <SelectTrigger className="w-[170px] h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 transition-all duration-300">
            <div className="flex items-center gap-2">
              <Tags className="h-4 w-4 text-slate-400" />
              <SelectValue placeholder={app.lang === "ar" ? "النوع" : "Type"} />
            </div>
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#2a655f]/20">
            <SelectItem value="all" className="hover:bg-[#2a655f]/10">{app.lang === "ar" ? "الكل" : "All"}</SelectItem>
            <SelectItem value="product" className="hover:bg-[#2a655f]/10">📦 {app.lang === "ar" ? "منتج" : "Product"}</SelectItem>
            <SelectItem value="offer" className="hover:bg-[#2a655f]/10">🏷️ {app.lang === "ar" ? "عرض تخفيض" : "Discount"}</SelectItem>
            <SelectItem value="promo" className="hover:bg-[#2a655f]/10">✨ {app.lang === "ar" ? "عرض ترويجي" : "Promo"}</SelectItem>
          </SelectContent>
        </Select>
        
        <div className="flex items-center gap-1 bg-muted/50 rounded-xl p-1 border border-slate-200/50 dark:border-slate-700/50">
          <Button 
            variant={viewMode === "grid" ? "default" : "ghost"} 
            size="sm" 
            className={cn(
              "h-8 px-3 rounded-lg text-xs transition-all duration-300",
              viewMode === "grid" && "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25"
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
              "h-8 px-3 rounded-lg text-xs transition-all duration-300",
              viewMode === "list" && "bg-[#2a655f] hover:bg-[#3a8a82] text-white shadow-md shadow-[#2a655f]/25"
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
          className="h-10 rounded-xl border-slate-200/60 dark:border-slate-700/60 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 group"
        >
          <X className="h-4 w-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {app.lang === "ar" ? "مسح الكل" : "Clear All"}
        </Button>
      </div>

      {/* ============================================================ */}
      {/* 🚀 PRODUCTS DISPLAY - صفحة عادية مع Pagination */}
      {/* ============================================================ */}
      {myListings.length === 0 ? (
        <div className="relative rounded-3xl border-2 border-dashed border-[#2a655f]/30 dark:border-[#2a655f]/40 p-20 text-center bg-gradient-to-b from-[#2a655f]/5 to-transparent group hover:border-[#2a655f]/50 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#2a655f] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-[#2a655f]/5 blur-3xl animate-pulse" />
            <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-[#3a8a82]/5 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="relative inline-block">
              <div className="h-24 w-24 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto animate-bounce">
                <Package className="h-12 w-12 text-[#2a655f]/60" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-[#2a655f] flex items-center justify-center shadow-lg shadow-[#2a655f]/30">
                <Plus className="h-4 w-4 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-6 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] bg-clip-text text-transparent">
              {app.lang === "ar" ? "🚀 لا توجد منتجات بعد" : "🚀 No products yet"}
            </h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
              {app.lang === "ar" 
                ? "ابدأ رحلتك التجارية الآن وأضف منتجك الأول لتصل إلى آلاف العملاء" 
                : "Start your business journey now and add your first product to reach thousands of customers"}
            </p>
            <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
              <Button 
                className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-[#2a655f]/40 transition-all duration-300 hover:scale-105 group"
                onClick={() => openAddDialog("product")}
              >
                <Plus className="h-4 w-4 me-2 group-hover:rotate-90 transition-transform duration-300" /> 
                {app.lang === "ar" ? "أضف منتج جديد" : "Add New Product"}
              </Button>
              <Button 
                variant="outline" 
                className="rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300 hover:scale-105 group"
                onClick={() => openAddDialog("offer")}
              >
                <Percent className="h-4 w-4 me-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" /> 
                {app.lang === "ar" ? "أضف عرض تخفيض" : "Add Discount Offer"}
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 transition-all duration-300 hover:scale-105 group"
                onClick={() => {
                  setSelectedOfferProduct(null);
                  setEditingOffer(null);
                  setOfferDialogOpen(true);
                }}
              >
                <Sparkles className="h-4 w-4 me-2 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300" /> 
                {app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"}
              </Button>
            </div>
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="relative rounded-3xl border-2 border-dashed border-slate-200/50 dark:border-slate-800/50 p-20 text-center bg-gradient-to-b from-slate-50/50 to-transparent dark:from-slate-900/20 group hover:border-[#2a655f]/30 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <Search className="h-20 w-20 text-muted-foreground/40 mx-auto group-hover:scale-110 transition-transform duration-500" />
          <h3 className="text-xl font-semibold text-muted-foreground mt-4">
            {app.lang === "ar" ? "🔍 لا توجد نتائج مطابقة" : "🔍 No matching results"}
          </h3>
          <p className="text-sm text-muted-foreground/60 mt-1">
            {app.lang === "ar" 
              ? `لم نعثر على منتجات تطابق "${searchQuery || 'البحث'}"` 
              : `No products match "${searchQuery || 'search'}"`}
          </p>
          <Button 
            variant="outline" 
            className="mt-4 rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 transition-all duration-300"
            onClick={() => { setSearchQuery(""); setFilterStatus("all"); setFilterType("all"); }}
          >
            <X className="h-4 w-4 mr-2" />
            {app.lang === "ar" ? "مسح الفلاتر" : "Clear filters"}
          </Button>
        </div>
      ) : (
        <>
          {/* ===== GRID ===== */}
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedProducts.map((product: any) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${Math.random() * 0.2}s` }}>
                <ProductCard
                  product={product}
                  onEdit={() => openEditDialog(product)}
                  onDelete={() => {
                    setProductToDelete(product);
                    setDeleteDialogOpen(true);
                  }}
                  onView={() => openProductDetail(product)}
                  onConvertToOffer={openConvertDialog}
                  onRepublish={handleRepublish}
                  onAddBogoOffer={handleAddPromoOffer}
                  onRemovePromoOffer={handleRemovePromoOffer}
                  onEditPromoOffer={handleEditPromoOffer}
                  onViewPromoOffer={handleViewPromoOffer}
                  lang={app.lang}
                  currency={app.currency}
                  formatPrice={formatPrice}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>

          {/* ===== PAGINATION ===== */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-5 mt-5 border-t border-slate-200/50 dark:border-slate-800/50">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-muted-foreground">
                {app.lang === "ar" 
                  ? `صفحة ${currentPage} من ${totalPages}` 
                  : `Page ${currentPage} of ${totalPages}`}
              </span>
              <Badge variant="outline" className="border-[#2a655f]/20 text-[#2a655f] text-[10px]">
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
                  <SelectTrigger className="w-[70px] h-8 rounded-lg border-slate-200/50 dark:border-slate-700/50 text-xs">
                    <SelectValue placeholder="6" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg border-[#2a655f]/20">
                    <SelectItem value="6" className="text-xs">6</SelectItem>
                    <SelectItem value="10" className="text-xs">10</SelectItem>
                    <SelectItem value="20" className="text-xs">20</SelectItem>
                    <SelectItem value="30" className="text-xs">30</SelectItem>
                    <SelectItem value="50" className="text-xs">50</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-xs text-muted-foreground">
                  {app.lang === "ar" ? "لكل صفحة" : "per page"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-40"
              >
                <ChevronsLeft className="h-4 w-4 text-[#2a655f]" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="h-9 w-9 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4 text-[#2a655f]" />
              </Button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 7) {
                    pageNum = i + 1;
                  } else if (currentPage <= 4) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 3) {
                    pageNum = totalPages - 6 + i;
                  } else {
                    pageNum = currentPage - 3 + i;
                  }
                  
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
                        "h-9 min-w-[36px] px-2.5 rounded-xl text-sm font-medium transition-all duration-300",
                        pageNum === currentPage 
                          ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-md shadow-[#2a655f]/25" 
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
                className="h-9 w-9 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4 text-[#2a655f]" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-9 w-9 p-0 rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30 hover:bg-[#2a655f]/5 transition-all duration-300 disabled:opacity-40"
              >
                <ChevronsRight className="h-4 w-4 text-[#2a655f]" />
              </Button>
            </div>
          </div>
        </>
      )}

      {/* ===== PRODUCT DETAIL DIALOG ===== */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 bg-white dark:bg-slate-900 p-0 shadow-2xl shadow-[#2a655f]/10">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white z-30 transition-all duration-300 hover:scale-110 hover:rotate-90"
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
              <div className="lg:w-1/2 bg-gradient-to-br from-[#2a655f]/5 via-slate-50 to-[#2a655f]/5 dark:from-[#2a655f]/20 dark:via-slate-800 dark:to-[#2a655f]/20 flex flex-col h-full relative">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-[#2a655f] to-transparent animate-pulse" />
                
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
                            <button onClick={goToPrev} className="absolute start-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-700 transition-all duration-300 hover:scale-110 hover:shadow-[#2a655f]/30">
                              <ChevronLeft className="h-5 w-5" />
                            </button>
                            <button onClick={goToNext} className="absolute end-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow-lg flex items-center justify-center text-slate-700 transition-all duration-300 hover:scale-110 hover:shadow-[#2a655f]/30">
                              <ChevronRight className="h-5 w-5" />
                            </button>
                          </>
                        )}
                        
                        <div className="absolute top-4 start-4 flex flex-col gap-2">
                          {selectedProduct.is_offer && (
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-3 py-1.5 text-xs font-bold animate-pulse">
                              🔥 {app.lang === "ar" ? "عرض خاص" : "Special Offer"}
                              {selectedProduct.discount_percent && ` -${selectedProduct.discount_percent}%`}
                            </Badge>
                          )}
                          {selectedProduct.status === "pending" && (
                            <Badge className="bg-yellow-500/90 text-white border-0 shadow-lg rounded-full px-3 py-1.5 text-xs animate-pulse">
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
                                  "h-1.5 rounded-full transition-all duration-300",
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
                    <div className="flex gap-2 overflow-x-auto px-4 pb-4 scrollbar-thin scrollbar-thumb-[#2a655f]/20 scrollbar-track-transparent">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={cn(
                            "flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105",
                            idx === currentImageIndex 
                              ? "border-[#2a655f] shadow-md shadow-[#2a655f]/25" 
                              : "border-slate-200/50 hover:border-[#2a655f]/50"
                          )}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="lg:w-1/2 p-6 md:p-8 overflow-y-auto bg-white dark:bg-slate-900 h-full relative">
                <div className="absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-transparent via-[#2a655f]/10 to-transparent" />
                
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  {selectedProduct.title_ar}
                  {selectedProduct.is_offer && (
                    <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[10px] animate-pulse">
                      🎯 عرض
                    </Badge>
                  )}
                </h1>
                
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={cn(
                        "h-4 w-4 transition-all duration-300",
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

                <div className="mt-4 p-4 bg-gradient-to-r from-[#2a655f]/5 to-[#2a655f]/10 dark:from-[#2a655f]/20 dark:to-[#2a655f]/10 rounded-2xl border border-[#2a655f]/20 dark:border-[#2a655f]/30">
                  <div className="flex items-end gap-4">
                    <div>
                      <p className="text-3xl font-bold text-[#2a655f] dark:text-[#3a8a82]">
                        {formatPrice(Number(selectedProduct.price), app.currency, app.lang)}
                      </p>
                    </div>
                    {selectedProduct.old_price && selectedProduct.old_price > selectedProduct.price && (
                      <div>
                        <div className="text-sm text-red-500 line-through font-medium">
                          {formatPrice(Number(selectedProduct.old_price), app.currency, app.lang)}
                        </div>
                        <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-0 text-xs animate-pulse">
                          🎯 {Math.round(((selectedProduct.old_price - selectedProduct.price) / selectedProduct.old_price) * 100)}% {app.lang === "ar" ? "خصم" : "OFF"}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {selectedProduct?.colors && selectedProduct.colors.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Palette className="h-4 w-4 text-[#2a655f]" />
                      {app.lang === "ar" ? "اللون" : "Color"}
                      <span className="text-xs text-muted-foreground/60 ms-1">
                        ({selectedProduct.colors.length} {app.lang === "ar" ? "خيار" : "options"})
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      {selectedProduct.colors.map((color: any) => {
                        const isSelected = detailSelectedColor?.id === color.id;
                        return (
                          <div 
                            key={color.id} 
                            className="flex flex-col items-center gap-1 group cursor-pointer"
                            onClick={() => handleDetailColorSelect(color)}
                          >
                            <div className={cn(
                              "relative h-14 w-14 rounded-xl overflow-hidden border-2 transition-all duration-300 shadow-sm",
                              isSelected 
                                ? "border-[#2a655f] ring-2 ring-[#2a655f]/30 scale-110 shadow-md shadow-[#2a655f]/20" 
                                : "border-slate-200/50 group-hover:border-[#2a655f] group-hover:scale-105"
                            )}>
                              <img 
                                src={color.image_url} 
                                alt={color.color_name_ar}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = '/placeholder-color.png';
                                }}
                              />
                              {isSelected && (
                                <div className="absolute inset-0 bg-[#2a655f]/20 flex items-center justify-center">
                                  <CheckCircle2 className="h-6 w-6 text-[#2a655f] drop-shadow-lg" />
                                </div>
                              )}
                            </div>
                            <span className={cn(
                              "text-[10px] transition-colors duration-300 font-medium",
                              isSelected ? "text-[#2a655f] font-bold" : "text-muted-foreground group-hover:text-[#2a655f]"
                            )}>
                              {color.color_name_ar}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    {detailSelectedColor && (
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                        {app.lang === "ar" ? "اللون المختار:" : "Selected color:"} 
                        <span className="font-bold text-[#2a655f]">{detailSelectedColor.color_name_ar}</span>
                      </p>
                    )}
                  </div>
                )}

                {selectedProduct?.variations && selectedProduct.variations.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-[#2a655f]" />
                      {app.lang === "ar" ? "اختر التركيبة" : "Select Variation"}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {selectedProduct.variations.map((variation: any) => {
                        const isSelected = selectedVariation?.id === variation.id;
                        return (
                          <div 
                            key={variation.id}
                            onClick={() => setSelectedVariation(variation)}
                            className={cn(
                              "p-3 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:scale-[1.02]",
                              isSelected 
                                ? "border-[#2a655f] bg-[#2a655f]/10 shadow-md shadow-[#2a655f]/20" 
                                : "border-slate-200/50 hover:border-[#2a655f]/50 hover:shadow-md"
                            )}
                          >
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center justify-between">
                                <div className="flex flex-wrap items-center gap-1">
                                  {Object.entries(variation.combination || {}).map(([key, value]) => (
                                    <span key={key} className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                      {key}: <span className="font-bold text-[#2a655f]">{String(value)}</span>
                                    </span>
                                  ))}
                                </div>
                                {isSelected && (
                                  <CheckCircle2 className="h-5 w-5 text-[#2a655f] flex-shrink-0" />
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="text-xs font-bold text-[#2a655f]">
                                  {formatPrice(variation.price || selectedProduct.price, app.currency, app.lang)}
                                </span>
                                
                                {selectedProduct.is_offer && variation.old_price && variation.old_price > 0 && (
                                  <span className="text-xs text-red-400 line-through">
                                    {formatPrice(variation.old_price, app.currency, app.lang)}
                                  </span>
                                )}
                                
                                {selectedProduct.is_offer && (!variation.old_price || variation.old_price <= 0) && selectedProduct.old_price && selectedProduct.old_price > 0 && (
                                  <span className="text-xs text-red-400 line-through">
                                    {formatPrice(Number(selectedProduct.old_price), app.currency, app.lang)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {selectedProduct.sizes && selectedProduct.sizes.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-[#2a655f]" />
                      {app.lang === "ar" ? "المقاس" : "Size"}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedProduct.sizes.map((size: string) => (
                        <span 
                          key={size}
                          className="px-4 py-2 border-2 border-slate-200/50 rounded-xl text-sm font-medium bg-white/50 dark:bg-slate-900/50 hover:border-[#2a655f] hover:bg-[#2a655f]/5 hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md cursor-default"
                        >
                          {size}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedProduct.description_ar && (
                  <div className="mt-4 p-4 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedProduct.description_ar}
                    </p>
                  </div>
                )}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gradient-to-br from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10 dark:to-transparent rounded-xl border border-[#2a655f]/10 dark:border-[#2a655f]/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Layers className="h-3 w-3 text-[#2a655f]" />
                      {app.lang === "ar" ? "التصنيف" : "Category"}
                    </p>
                    <p className="text-sm font-medium mt-0.5 text-[#2a655f] dark:text-[#3a8a82]">
                      {getCategoryName(selectedProduct.category_id)}
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10 dark:to-transparent rounded-xl border border-[#2a655f]/10 dark:border-[#2a655f]/20">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-[#2a655f]" />
                      {app.lang === "ar" ? "المحافظة" : "Governorate"}
                    </p>
                    <p className="text-sm font-medium mt-0.5 text-[#2a655f] dark:text-[#3a8a82]">
                      {getGovernorateName(selectedProduct.governorate_id)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 p-3 bg-gradient-to-r from-[#2a655f]/5 to-transparent dark:from-[#2a655f]/10 dark:to-transparent rounded-xl border border-[#2a655f]/10 dark:border-[#2a655f]/20">
                  <div className={cn(
                    "h-3 w-3 rounded-full animate-pulse",
                    selectedProduct.is_available ? "bg-emerald-500" : "bg-red-500"
                  )} />
                  <span className="text-sm font-medium">
                    {selectedProduct.is_available
                      ? (app.lang === "ar" ? "✅ متوفر للبيع" : "✅ Available for sale")
                      : (app.lang === "ar" ? "❌ غير متوفر" : "❌ Unavailable")}
                  </span>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 h-12 group transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setDetailDialogOpen(false);
                      openEditDialog(selectedProduct);
                    }}
                  >
                    <Edit2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    {app.lang === "ar" ? "تعديل" : "Edit"}
                  </Button>

                  <Button
                    variant="outline"
                    className="flex-1 rounded-xl border-red-200/50 text-red-500 hover:text-red-600 hover:bg-red-50/50 h-12 group transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      setDetailDialogOpen(false);
                      setProductToDelete(selectedProduct);
                      setDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                    {app.lang === "ar" ? "حذف" : "Delete"}
                  </Button>
                </div>

                <p className="text-[11px] text-muted-foreground text-center mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-[#2a655f]" />
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

      {/* ===== DELETE PRODUCT DIALOG ===== */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 p-0 overflow-hidden shadow-2xl shadow-[#2a655f]/10">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-20 transition-all duration-300 hover:rotate-90"
            onClick={() => setDeleteDialogOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center animate-pulse">
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
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {app.lang === "ar" ? "السعر: " : "Price: "}
                  {formatPrice(Number(productToDelete.price), app.currency, app.lang)}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleDeleteProduct}
                disabled={del.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-[1.02] transition-all duration-300 group"
              >
                {del.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {app.lang === "ar" ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 me-2 group-hover:scale-110 transition-transform duration-300" />
                    {app.lang === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== ✅✅✅ Dialog تأكيد حذف العرض الترويجي ===== */}
      <Dialog open={confirmDeleteOfferOpen} onOpenChange={(open) => {
        setConfirmDeleteOfferOpen(open);
        if (!open) setOfferToDelete(null);
      }}>
        <DialogContent className="max-w-md rounded-2xl border-[#2a655f]/20 dark:border-[#2a655f]/30 p-0 overflow-hidden shadow-2xl shadow-[#2a655f]/10">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 end-4 h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 z-20 transition-all duration-300 hover:rotate-90"
            onClick={() => {
              setConfirmDeleteOfferOpen(false);
              setOfferToDelete(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center animate-pulse">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight">
                  {app.lang === "ar" ? "حذف العرض الترويجي" : "Delete Promo Offer"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {app.lang === "ar" ? "هذا الإجراء لا يمكن التراجع عنه" : "This action cannot be undone"}
                </p>
              </div>
            </div>

            <div className="bg-red-50/50 dark:bg-red-950/20 rounded-xl p-4 border border-red-200/50 dark:border-red-800/30 mb-4">
              <p className="text-sm text-red-700 dark:text-red-300">
                {app.lang === "ar"
                  ? `هل أنت متأكد من حذف العرض الترويجي؟`
                  : `Are you sure you want to delete this promo offer?`}
              </p>
              {offerToDelete && (
                <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                  {app.lang === "ar" ? "العرض: " : "Offer: "}
                  <span className="font-medium">
                    {(() => {
                      // ✅ جلب اسم العرض من sellerOffers
                      const offer = sellerOffers.find((o: any) => o.id === offerToDelete);
                      return offer?.display_text_ar || offer?.display_text_en || offerToDelete;
                    })()}
                  </span>
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmDeleteOfferOpen(false);
                  setOfferToDelete(null);
                }}
                className="flex-1 rounded-xl border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300"
              >
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button
                onClick={handleConfirmDeleteOffer}
                disabled={deletePromoOffer.isPending}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 hover:scale-[1.02] transition-all duration-300 group"
              >
                {deletePromoOffer.isPending ? (
                  <span className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                    {app.lang === "ar" ? "جاري الحذف..." : "Deleting..."}
                  </span>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 me-2 group-hover:scale-110 transition-transform duration-300" />
                    {app.lang === "ar" ? "تأكيد الحذف" : "Confirm Delete"}
                  </>
                )}
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

      {/* ✅ ✅ ✅ نافذة العرض الترويجي (BOGO/Cross-sell/Bundle) - استخدام useMemo */}
      {memoizedAddBogoOfferDialog}

      {/* ✅ ✅ ✅ نافذة تفاصيل العرض الترويجي - استخدام useMemo */}
      {memoizedPromoOfferDetailDialog}
    </div>
  );
});

// ✅ إضافة CSS للحركات
const style = document.createElement('style');
style.textContent = `
  @keyframes slide {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(200%); }
  }
  .animate-slide {
    animation: slide 1.5s ease-in-out infinite;
  }
  .animate-spin-slow {
    animation: spin 2s linear infinite;
  }
  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
    opacity: 0;
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
`;