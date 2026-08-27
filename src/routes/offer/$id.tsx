// src/routes/offer/$id.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { useProductOfferByIdV2 } from "@/lib/hooks/useProductOffers";
import { useAddToCart, useClearCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Gift, Sparkles, Package, Store, ArrowRight, 
  ChevronLeft, Star, MapPin, 
  Gift as GiftIcon, Tag, ShoppingCart, CheckCircle,
  Truck, Shield, Clock, Award, Minus, Plus, AlertTriangle,
  Layers, Palette, Ruler, Trash2, Check, X,
  ShoppingBag, Percent, ChevronDown, ChevronUp,
  Zap, Rocket, Gem, Crown, Flame
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useListings } from "@/lib/queries";
import { OptimizedImage } from "@/components/OptimizedImage";

export const Route = createFileRoute("/offer/$id")({
  component: OfferDetailPage,
  head: () => ({ meta: [{ title: "تفاصيل العرض الترويجي — السوق لعندك" }] }),
});

function OfferDetailPage() {
  const { id } = Route.useParams();
  const app = useApp();
  const navigate = useNavigate();
  const addToCartMutation = useAddToCart();
  const clearCartMutation = useClearCart();

  // ========== ✅ STATE ==========
  const [selectedVariations, setSelectedVariations] = useState<Record<string, Record<string, number>>>({});
  const [selectedGiftVariations, setSelectedGiftVariations] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [showStoreConflict, setShowStoreConflict] = useState(false);
  const [currentStoreName, setCurrentStoreName] = useState("");
  const [newStoreName, setNewStoreName] = useState("");
  const [pendingAddData, setPendingAddData] = useState<any>(null);
  const [mainImage, setMainImage] = useState<string>("");

  // ========== ✅ QUERIES ==========
  const { data: rawOffer, isLoading, isError } = useProductOfferByIdV2(id);
  
  const offer = useMemo(() => {
    if (!rawOffer) return null;
    return {
      ...rawOffer,
      products: Array.isArray(rawOffer.products) 
        ? rawOffer.products[0] 
        : rawOffer.products,
      free_product: Array.isArray(rawOffer.free_product) 
        ? rawOffer.free_product[0] 
        : rawOffer.free_product,
    };
  }, [rawOffer]);
  
  const { data: listingsData } = useListings({ limit: 1000 });
  const listings = listingsData?.data || [];

  // ========== ✅ CALLBACKS ==========
  const getPromoTypeLabel = useCallback((type: string) => {
    const types: Record<string, { label: string; icon: any; color: string; bg: string }> = {
      bogo: { 
        label: app.lang === "ar" ? "🎁 نفس المنتج" : "🎁 Same Product", 
        icon: Gift,
        color: "text-purple-600",
        bg: "bg-purple-100 dark:bg-purple-900/30"
      },
      cross_sell: { 
        label: app.lang === "ar" ? "🔄 منتج مختلف" : "🔄 Different Product", 
        icon: Tag,
        color: "text-blue-600",
        bg: "bg-blue-100 dark:bg-blue-900/30"
      },
      bundle: { 
        label: app.lang === "ar" ? "📦 باقة منتجات" : "📦 Bundle", 
        icon: Package,
        color: "text-orange-600",
        bg: "bg-orange-100 dark:bg-orange-900/30"
      },
    };
    return types[type] || types.bogo;
  }, [app.lang]);

  // ========== ✅ MEMOS ==========
  const discountPercent = useMemo(() => {
    return offer?.buy_quantity && offer?.get_quantity
      ? Math.round((offer.get_quantity / (offer.buy_quantity + offer.get_quantity)) * 100)
      : 0;
  }, [offer]);

  const mainProduct = offer?.products;
  const freeProduct = offer?.free_product;
  const promoType = offer?.offer_type ? getPromoTypeLabel(offer.offer_type) : null;
  const isBundle = useMemo(() => offer?.offer_type === 'bundle', [offer]);
  const isBogo = useMemo(() => offer?.offer_type === 'bogo', [offer]);
  const isCrossSell = useMemo(() => offer?.offer_type === 'cross_sell', [offer]);

  // ✅ فيرنتات المنتج الرئيسي (يجب تعريفه أولاً)
  const mainVariations = useMemo(() => {
    const selectedIds = offer?.variation_ids || [];
    const allVariations = mainProduct?.variations || [];
    
    if (selectedIds.length === 0) {
      return allVariations;
    }
    
    return allVariations.filter((v: any) => selectedIds.includes(v.id));
  }, [mainProduct, offer?.variation_ids]);

  // ✅ فيرنتات الهدية
  const giftVariations = useMemo(() => {
    const selectedIds = offer?.result_variation_ids || [];
    const allVariations = freeProduct?.variations || [];
    
    if (selectedIds.length === 0) {
      return allVariations;
    }
    
    return allVariations.filter((v: any) => selectedIds.includes(v.id));
  }, [freeProduct, offer?.result_variation_ids]);

  // ✅ المنتجات المطلوبة (لـ Bundle)
  const requiredProducts = useMemo(() => {
    if (!offer?.required_product_ids || offer.required_product_ids.length === 0) {
      return [];
    }
    
    return offer.required_product_ids.map((productId: string) => {
      const product = listings.find((l: any) => l.id === productId);
      if (!product) return null;
      
      const selectedVariationIds = offer.required_variations?.find(
        (rv: any) => rv.product_id === productId
      )?.variation_ids || [];
      
      const totalRequiredQuantity = offer.required_variations?.find(
        (rv: any) => rv.product_id === productId
      )?.quantity || 1;
      
      const allVariations = product.variations || [];
      
      const variations = selectedVariationIds.length === 0
        ? allVariations
        : allVariations.filter((v: any) => selectedVariationIds.includes(v.id));
      
      const selectedMap = selectedVariations[productId] || {};
      const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
      const isComplete = selectedTotal === totalRequiredQuantity;
      const isOver = selectedTotal > totalRequiredQuantity;
      const remaining = Math.max(0, totalRequiredQuantity - selectedTotal);
      
      return {
        product,
        variations,
        totalRequiredQuantity,
        selectedVariationIds,
        productId,
        selectedMap,
        selectedTotal,
        isComplete,
        isOver,
        remaining,
        hasVariations: variations.length > 0,
        totalCount: variations.length,
      };
    }).filter(Boolean);
  }, [offer, listings, selectedVariations]);

  // ✅ المنتج الرئيسي مع فيرنتاته (لـ BOGO و Cross-sell) - يعتمد على mainVariations
  const mainProductWithVariations = useMemo(() => {
    if (!mainProduct || isBundle) return null;
    
    const variations = mainVariations.length > 0 
      ? mainVariations 
      : mainProduct.variations || [];
    
    const totalRequiredQuantity = offer?.buy_quantity || 1;
    const productId = mainProduct.id;
    const selectedMap = selectedVariations[productId] || {};
    const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
    const isComplete = selectedTotal === totalRequiredQuantity;
    const isOver = selectedTotal > totalRequiredQuantity;
    const remaining = Math.max(0, totalRequiredQuantity - selectedTotal);
    
    return {
      product: mainProduct,
      variations: variations,
      totalRequiredQuantity: totalRequiredQuantity,
      productId: productId,
      selectedMap: selectedMap,
      selectedTotal: selectedTotal,
      isComplete: isComplete,
      isOver: isOver,
      remaining: remaining,
      hasVariations: variations.length > 0,
      totalCount: variations.length,
      isMainProduct: true,
    };
  }, [mainProduct, mainVariations, offer?.buy_quantity, selectedVariations, isBundle]);

  // ✅ حساب السعر النهائي
// ✅ حساب السعر النهائي (مثل صفحة المنتج تماماً)
const finalPrice = useMemo(() => {
  if (!offer) return 0;
  
  // ✅ BOGO و Cross-sell
  if (offer.offer_type === 'bogo' || offer.offer_type === 'cross_sell') {
    if (!mainProduct) return 0;
    
    const productId = mainProduct.id;
    const selectedMap = selectedVariations[productId] || {};
    const selectedVariationIds = Object.keys(selectedMap).filter(id => selectedMap[id] > 0);
    
    // ✅ ✅ ✅ نفس منطق صفحة المنتج: استخدم سعر الفيرنت المختار
    if (selectedVariationIds.length > 0) {
      let totalPrice = 0;
      let totalQty = 0;
      
      for (const variationId of selectedVariationIds) {
        const qty = selectedMap[variationId] || 0;
        if (qty > 0) {
          const variation = mainProduct.variations?.find((v: any) => v.id === variationId);
          const price = variation?.price || mainProduct.price;
          totalPrice += price * qty;
          totalQty += qty;
        }
      }
      
      if (totalQty > 0) {
        const avgPrice = totalPrice / totalQty;
        return avgPrice * quantity; // ✅ ✅ ✅ مضروب في الكمية
      }
    }
    
    return mainProduct.price * quantity;
  }
  
  // ✅ Bundle
  if (offer.offer_type === 'bundle') {
    let total = 0;
    let totalQty = 0;
    
    for (const req of requiredProducts) {
      const product = req.product;
      const selectedMap = selectedVariations[product.id] || {};
      
      for (const [variationId, qty] of Object.entries(selectedMap)) {
        if (qty > 0) {
          const variation = product.variations?.find((v: any) => v.id === variationId);
          const price = variation?.price || product.price;
          total += price * qty;
          totalQty += qty;
        }
      }
    }
    
    if (totalQty > 0) {
      const avgPrice = total / totalQty;
      return avgPrice * quantity;
    }
    
    return total * quantity;
  }
  
  return 0;
}, [offer, mainProduct, requiredProducts, selectedVariations, quantity]);
  // ✅ إحصائيات تقدم المنتجات المطلوبة (لجميع أنواع العروض)
  const selectionStats = useMemo(() => {
    let items: any[] = [];
    
    if (isBundle) {
      items = requiredProducts;
    } else if (isBogo || isCrossSell) {
      if (mainProductWithVariations) {
        items = [mainProductWithVariations];
      }
    }
    
    if (items.length === 0) {
      return { total: 0, completed: 0, percentage: 0, allComplete: false, hasOver: false, items: [] };
    }
    
    const total = items.length;
    const completed = items.filter((item: any) => 
      !item.hasVariations || item.isComplete
    ).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    const allComplete = total > 0 && completed === total;
    const hasOver = items.some((item: any) => item.isOver);
    
    return { total, completed, percentage, allComplete, hasOver, items };
  }, [isBundle, isBogo, isCrossSell, requiredProducts, mainProductWithVariations]);

  // ✅ إحصائيات تقدم الهدية
  const giftStats = useMemo(() => {
    const totalGiftQty = offer?.get_quantity || 1;
    const giftVariationIds = offer?.result_variation_ids || [];
    
    if (giftVariationIds.length === 0) {
      return { total: totalGiftQty, selected: 0, remaining: totalGiftQty, isComplete: false, isOver: false };
    }
    
    const selectedMap = selectedGiftVariations || {};
    const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
    const isComplete = selectedTotal === totalGiftQty;
    const isOver = selectedTotal > totalGiftQty;
    const remaining = Math.max(0, totalGiftQty - selectedTotal);
    
    return { total: totalGiftQty, selected: selectedTotal, remaining, isComplete, isOver };
  }, [offer, selectedGiftVariations]);

  // ✅ الكمية الإجمالية المطلوبة
  const totalRequiredQuantity = useMemo(() => {
    if (isBundle) {
      return requiredProducts.reduce((sum: number, item: any) => sum + item.totalRequiredQuantity, 0);
    }
    if (isBogo || isCrossSell) {
      return mainProductWithVariations?.totalRequiredQuantity || 0;
    }
    return 0;
  }, [isBundle, isBogo, isCrossSell, requiredProducts, mainProductWithVariations]);

  // ✅ الكمية الإجمالية المختارة
  const totalSelectedQuantity = useMemo(() => {
    if (isBundle) {
      return requiredProducts.reduce((sum: number, item: any) => sum + item.selectedTotal, 0);
    }
    if (isBogo || isCrossSell) {
      return mainProductWithVariations?.selectedTotal || 0;
    }
    return 0;
  }, [isBundle, isBogo, isCrossSell, requiredProducts, mainProductWithVariations]);

  // ✅ عدد المنتجات المتبقية
  const remainingProducts = useMemo(() => {
    if (isBundle) {
      return requiredProducts.filter((item: any) => 
        item.hasVariations && !item.isComplete && !item.isOver
      ).length;
    }
    if (isBogo || isCrossSell) {
      if (!mainProductWithVariations) return 0;
      return mainProductWithVariations.hasVariations && !mainProductWithVariations.isComplete && !mainProductWithVariations.isOver ? 1 : 0;
    }
    return 0;
  }, [isBundle, isBogo, isCrossSell, requiredProducts, mainProductWithVariations]);

  // ✅ التحقق من اختيار الفيرنتات
  const isVariationSelected = useMemo(() => {
    if (!offer) return false;
    
    // ✅ BOGO: تحقق من المنتج الرئيسي والهدية
    if (offer.offer_type === 'bogo') {
      const mainComplete = mainProductWithVariations?.isComplete || false;
      const giftComplete = giftStats.isComplete && !giftStats.isOver;
      return mainComplete && giftComplete;
    }
    
    // ✅ Cross-sell: تحقق من المنتج الرئيسي والهدية
    if (offer.offer_type === 'cross_sell') {
      const mainComplete = mainProductWithVariations?.isComplete || false;
      const giftComplete = giftStats.isComplete && !giftStats.isOver;
      return mainComplete && giftComplete;
    }
    
    // ✅ Bundle: تحقق من المنتجات والهدية
    if (offer.offer_type === 'bundle') {
      const productsComplete = selectionStats.allComplete && !selectionStats.hasOver;
      const giftComplete = giftStats.isComplete && !giftStats.isOver;
      return productsComplete && giftComplete;
    }
    
    return true;
  }, [offer, selectionStats, giftStats, mainProductWithVariations]);

  // ✅ بيانات المتجر
  const storeData = useMemo(() => {
    const logo = offer?.store?.store_logo_url || 
                 offer?.store?.avatar_url || 
                 mainProduct?.profiles?.store_logo_url || 
                 mainProduct?.profiles?.avatar_url || 
                 mainProduct?.profile?.store_logo_url || 
                 mainProduct?.profile?.avatar_url || 
                 mainProduct?.owner?.store_logo_url || 
                 mainProduct?.owner?.avatar_url || 
                 null;
    
    const name = offer?.store?.store_name || 
                 offer?.store?.full_name || 
                 mainProduct?.profiles?.store_name || 
                 mainProduct?.profiles?.full_name || 
                 mainProduct?.profile?.store_name || 
                 mainProduct?.profile?.full_name || 
                 mainProduct?.owner?.store_name || 
                 mainProduct?.owner?.full_name || 
                 (app.lang === "ar" ? "متجر" : "Store");
    
    return { logo, name };
  }, [offer, mainProduct, app.lang]);

  // ========== ✅ EFFECTS ==========
  // ✅ تعيين الصورة الأولية
  useEffect(() => {
    if (mainProduct?.cover_url) {
      setMainImage(mainProduct.cover_url);
    }
  }, [mainProduct]);

  // ✅ اختيار تلقائي للفيرنتات وتوزيع الكميات (للمنتجات المطلوبة في Bundle)
  useEffect(() => {
    if (isBundle && requiredProducts.length > 0) {
      requiredProducts.forEach((item: any) => {
        const selectedMap = selectedVariations[item.product.id] || {};
        const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
        
        if (item.variations.length === 1 && selectedTotal === 0) {
          setSelectedVariations(prev => ({
            ...prev,
            [item.product.id]: {
              [item.variations[0].id]: item.totalRequiredQuantity
            }
          }));
        }
        
        if (item.selectedVariationIds.length === 0 && item.variations.length > 1 && selectedTotal === 0) {
          const perVariation = Math.floor(item.totalRequiredQuantity / item.variations.length);
          const remainder = item.totalRequiredQuantity % item.variations.length;
          const map: Record<string, number> = {};
          item.variations.forEach((v: any, index: number) => {
            map[v.id] = perVariation + (index < remainder ? 1 : 0);
          });
          setSelectedVariations(prev => ({
            ...prev,
            [item.product.id]: map
          }));
        }
      });
    }
  }, [requiredProducts, isBundle]);

  // ✅ اختيار تلقائي لفيرنتات المنتج الرئيسي (لـ BOGO و Cross-sell)
  useEffect(() => {
    if ((isBogo || isCrossSell) && mainProductWithVariations) {
      const item = mainProductWithVariations;
      const selectedMap = selectedVariations[item.productId] || {};
      const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
      
      if (item.variations.length === 1 && selectedTotal === 0) {
        setSelectedVariations(prev => ({
          ...prev,
          [item.productId]: {
            [item.variations[0].id]: item.totalRequiredQuantity
          }
        }));
      }
      
      if (item.variations.length > 1 && selectedTotal === 0) {
        const perVariation = Math.floor(item.totalRequiredQuantity / item.variations.length);
        const remainder = item.totalRequiredQuantity % item.variations.length;
        const map: Record<string, number> = {};
        item.variations.forEach((v: any, index: number) => {
          map[v.id] = perVariation + (index < remainder ? 1 : 0);
        });
        setSelectedVariations(prev => ({
          ...prev,
          [item.productId]: map
        }));
      }
    }
  }, [isBogo, isCrossSell, mainProductWithVariations]);

  // ✅ اختيار تلقائي لفيرنتات الهدية وتوزيع الكميات (لجميع أنواع العروض)
  useEffect(() => {
    if (!freeProduct || !offer) return;
    
    const giftVariationIds = offer?.result_variation_ids || [];
    const totalGiftQty = offer?.get_quantity || 1;
    const variationQuantities = offer?.metadata?.variation_quantities || {};
    
    // ✅ استخدام الفيرنتات المحددة أو جميع الفيرنتات إذا لم تكن محددة
    let availableVariations: any[] = [];
    
    if (giftVariationIds.length > 0) {
      availableVariations = giftVariations.filter((v: any) => 
        giftVariationIds.includes(v.id)
      );
    } else {
      availableVariations = freeProduct.variations || [];
    }
    
    if (availableVariations.length === 0) return;
    
    const currentMap = selectedGiftVariations || {};
    const currentTotal = Object.values(currentMap).reduce((sum, qty) => sum + qty, 0);
    
    if (currentTotal === 0) {
      if (Object.keys(variationQuantities).length > 0) {
        const validQuantities: Record<string, number> = {};
        availableVariations.forEach((v: any) => {
          if (variationQuantities[v.id] !== undefined && variationQuantities[v.id] > 0) {
            validQuantities[v.id] = variationQuantities[v.id];
          }
        });
        if (Object.keys(validQuantities).length > 0) {
          setSelectedGiftVariations(validQuantities);
          return;
        }
      }
      
      const perVariation = Math.floor(totalGiftQty / availableVariations.length);
      const remainder = totalGiftQty % availableVariations.length;
      const map: Record<string, number> = {};
      availableVariations.forEach((v: any, index: number) => {
        map[v.id] = perVariation + (index < remainder ? 1 : 0);
      });
      setSelectedGiftVariations(map);
    }
  }, [offer, freeProduct, giftVariations, selectedGiftVariations]);

  // ✅ تغيير الصورة الرئيسية عند اختيار فيرنت من ألوان المنتج الرئيسي
  useEffect(() => {
    if (!mainProduct) return;
    
    const productId = mainProduct.id;
    const selectedMap = selectedVariations[productId] || {};
    const selectedVariationIds = Object.keys(selectedMap).filter(id => selectedMap[id] > 0);
    
    if (selectedVariationIds.length > 0) {
      const firstSelectedId = selectedVariationIds[0];
      const selectedVariation = mainProduct.variations?.find((v: any) => v.id === firstSelectedId);
      
      if (selectedVariation) {
        if (selectedVariation.image_url) {
          setMainImage(selectedVariation.image_url);
          return;
        }
        
        const combo = selectedVariation.combination || {};
        const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
        let colorValue = null;
        for (const key of colorKeys) {
          if (combo[key]) {
            colorValue = combo[key];
            break;
          }
        }
        
        if (colorValue) {
          const productColors = mainProduct.colors || [];
          const color = productColors.find((c: any) => 
            String(c.color_name_ar || "").trim().toLowerCase() === String(colorValue).trim().toLowerCase()
          );
          if (color?.image_url) {
            setMainImage(color.image_url);
            return;
          }
        }
      }
    }
    
    if (mainProduct.cover_url && mainImage !== mainProduct.cover_url) {
      setMainImage(mainProduct.cover_url);
    }
  }, [selectedVariations, mainProduct, mainImage]);

  // ========== ✅ HANDLERS ==========
  // ✅ دالة تغيير كمية فيرنت معين (للمنتجات المطلوبة في Bundle و BOGO و Cross-sell)
  const handleVariationQuantityChange = useCallback((productId: string, variationId: string, delta: number) => {
    setSelectedVariations(prev => {
      const productMap = prev[productId] || {};
      const currentQty = productMap[variationId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        const newMap = { ...productMap };
        delete newMap[variationId];
        if (Object.keys(newMap).length === 0) {
          const newState = { ...prev };
          delete newState[productId];
          return newState;
        }
        return { ...prev, [productId]: newMap };
      }
      
      return {
        ...prev,
        [productId]: {
          ...productMap,
          [variationId]: newQty
        }
      };
    });
  }, []);

  // ✅ دالة تغيير كمية فيرنت الهدية (لجميع أنواع العروض)
  const handleGiftVariationQuantityChange = useCallback((variationId: string, delta: number) => {
    setSelectedGiftVariations(prev => {
      const currentQty = prev[variationId] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      if (newQty === 0) {
        const newState = { ...prev };
        delete newState[variationId];
        return newState;
      }
      
      return {
        ...prev,
        [variationId]: newQty
      };
    });
  }, []);

  // ✅ دالة توزيع الكمية المتبقية بالتساوي (للمنتجات المطلوبة)
  const autoDistributeRemaining = useCallback((productId: string, variations: any[], totalRequired: number) => {
    const currentMap = selectedVariations[productId] || {};
    const currentTotal = Object.values(currentMap).reduce((sum, qty) => sum + qty, 0);
    const remaining = totalRequired - currentTotal;
    
    if (remaining <= 0) return;
    
    const availableVariations = variations.filter((v: any) => !currentMap[v.id] || currentMap[v.id] > 0);
    if (availableVariations.length === 0) return;
    
    const perVariation = Math.floor(remaining / availableVariations.length);
    const remainder = remaining % availableVariations.length;
    
    setSelectedVariations(prev => {
      const newMap = { ...(prev[productId] || {}) };
      availableVariations.forEach((v: any, index: number) => {
        newMap[v.id] = (newMap[v.id] || 0) + perVariation + (index < remainder ? 1 : 0);
      });
      return { ...prev, [productId]: newMap };
    });
  }, [selectedVariations]);

  // ✅ دالة توزيع الكمية المتبقية للهدية بالتساوي (لجميع أنواع العروض)
  const autoDistributeGiftRemaining = useCallback((variations: any[], totalQty: number) => {
    const currentMap = selectedGiftVariations || {};
    const currentTotal = Object.values(currentMap).reduce((sum, qty) => sum + qty, 0);
    const remaining = totalQty - currentTotal;
    
    if (remaining <= 0) return;
    
    const availableVariations = variations.filter((v: any) => !currentMap[v.id] || currentMap[v.id] > 0);
    if (availableVariations.length === 0) return;
    
    const perVariation = Math.floor(remaining / availableVariations.length);
    const remainder = remaining % availableVariations.length;
    
    setSelectedGiftVariations(prev => {
      const newMap = { ...prev };
      availableVariations.forEach((v: any, index: number) => {
        newMap[v.id] = (newMap[v.id] || 0) + perVariation + (index < remainder ? 1 : 0);
      });
      return newMap;
    });
  }, [selectedGiftVariations]);

  // ============================================================
  // ✅✅✅ دالة دمج الفيرنتات المتطابقة
  // ============================================================
  const mergeItems = useCallback((items: Array<{
    listingId: string;
    variationId: string;
    quantity: number;
    isGift: boolean;
    price: number;
    combination: Record<string, string>;
  }>) => {
    const mergedMap = new Map<string, {
      listingId: string;
      variationId: string;
      quantity: number;
      isGift: boolean;
      price: number;
      combination: Record<string, string>;
    }>();

    for (const item of items) {
      const key = `${item.listingId}-${item.variationId}`;
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key)!;
        existing.quantity += item.quantity;
      } else {
        mergedMap.set(key, { ...item });
      }
    }

    return Array.from(mergedMap.values());
  }, []);

  // ============================================================
  // ✅✅✅ دالة إضافة العرض للسلة (الكود المصحح بالكامل)
  // ============================================================
// ============================================================
// ✅ دالة مساعدة لاستخراج صورة الفيرنت (تعريفها خارج useCallback)
// ============================================================
const getVariationImage = (
  variation: any,
  product: any,
  colors: any[]
): string | null => {
  let image = null;
  
  // 1. صورة الفيرنت مباشرة
  if (variation?.image_url) {
    image = variation.image_url;
  }
  
  // 2. من اللون عبر color_id
  if (!image && variation?.color_id && colors?.length > 0) {
    const color = colors.find((c: any) => c.id === variation.color_id);
    if (color?.image_url) {
      image = color.image_url;
    }
  }
  
  // 3. من اللون عبر الـ combination
  if (!image) {
    const combo = variation?.combination || {};
    const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
    let colorValue = null;
    for (const key of colorKeys) {
      if (combo[key]) {
        colorValue = combo[key];
        break;
      }
    }
    if (colorValue && colors?.length > 0) {
      const color = colors.find((c: any) => 
        String(c.color_name_ar || "").trim().toLowerCase() === String(colorValue).trim().toLowerCase()
      );
      if (color?.image_url) {
        image = color.image_url;
      }
    }
  }
  
  // 4. الصورة النهائية (cover_url)
  if (!image) {
    image = product?.cover_url || null;
  }
  
  return image;
};

// ============================================================
// ✅ دالة إضافة العرض للسلة
// ============================================================
const handleAddToCart = useCallback(async () => {
  console.log("🚀 [handleAddToCart] ===== START =====");
  console.log("🚀 [handleAddToCart] User:", app.user?.id);
  console.log("🚀 [handleAddToCart] Offer:", offer?.id);

  if (!app.user) {
    toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
    navigate({ to: "/auth/$mode", params: { mode: "login" } });
    return;
  }

  if (!offer) {
    toast.error(app.lang === "ar" ? "العرض غير موجود" : "Offer not found");
    return;
  }

  if (!isVariationSelected) {
    toast.warning(app.lang === "ar" ? "⚠️ الرجاء استكمال الكميات المطلوبة" : "⚠️ Please complete required quantities");
    return;
  }

  if (offer.store_id === app.user.id || mainProduct?.owner_id === app.user.id) {
    toast.error(
      app.lang === "ar" 
        ? "❌ لا يمكنك إضافة عروض من متجرك الخاص إلى السلة" 
        : "❌ You cannot add offers from your own store to cart"
    );
    return;
  }

  console.log("📊 [handleAddToCart] selectedVariations:", selectedVariations);
  console.log("📊 [handleAddToCart] selectedGiftVariations:", selectedGiftVariations);

  // ============================================================
  // ✅ 1. جمع الفيرنتات التي اختارها المستخدم مع الكميات التي اختارها
  // ============================================================
  const requiredVariationsDetails: Record<string, {
    quantity: number;
    price: number;
    combination: Record<string, string>;
    image_url?: string | null;
    product_id: string;
    product_title: string;
  }> = {};
  
  let mainListingId = "";
  let mainProductTitle = "";

  // ✅ 1.1 فيرنتات المنتج الرئيسي (BOGO / Cross-sell) - حسب اختيارات المستخدم
  if (isBogo || isCrossSell) {
    const productId = mainProduct?.id;
    if (productId) {
      mainListingId = productId;
      mainProductTitle = mainProduct?.title_ar || "";
      const selectedMap = selectedVariations[productId] || {};
      const productColors = mainProduct?.colors || [];
      
      for (const [variationId, qty] of Object.entries(selectedMap)) {
        if (qty > 0) {
          const variation = mainProduct?.variations?.find((v: any) => v.id === variationId);
          const combo = variation?.combination || {};
          const comboText = Object.entries(combo).map(([key, val]) => `${val}`).join(' • ');
          
          const variationImage = getVariationImage(variation, mainProduct, productColors);
          
          requiredVariationsDetails[variationId] = {
            quantity: qty, // ✅ الكمية التي اختارها المستخدم
            price: variation?.price || mainProduct?.price || 0,
            combination: combo,
            image_url: variationImage,
            product_id: productId,
            product_title: mainProductTitle,
          };
          console.log(`✅ [handleAddToCart] User selected: ${comboText} x${qty} (image: ${variationImage || 'none'})`);
        }
      }
    }
  }

  // ✅ 1.2 فيرنتات Bundle - حسب اختيارات المستخدم
  if (isBundle) {
    for (const req of requiredProducts) {
      const productId = req.productId;
      if (!mainListingId) mainListingId = productId;
      mainProductTitle = req.product.title_ar || "";
      const selectedMap = selectedVariations[productId] || {};
      const productColors = req.product.colors || [];
      
      for (const [variationId, qty] of Object.entries(selectedMap)) {
        if (qty > 0) {
          const variation = req.product.variations?.find((v: any) => v.id === variationId);
          const combo = variation?.combination || {};
          const comboText = Object.entries(combo).map(([key, val]) => `${val}`).join(' • ');
          
          const variationImage = getVariationImage(variation, req.product, productColors);
          
          requiredVariationsDetails[variationId] = {
            quantity: qty, // ✅ الكمية التي اختارها المستخدم
            price: variation?.price || req.product.price || 0,
            combination: combo,
            image_url: variationImage,
            product_id: productId,
            product_title: req.product.title_ar || "",
          };
          console.log(`✅ [handleAddToCart] User selected bundle: ${comboText} x${qty} (image: ${variationImage || 'none'})`);
        }
      }
    }
  }

  // ============================================================
  // ✅ 2. فيرنتات الهدية - فقط الفيرنتات المحددة في العرض مع كميات اختيار المستخدم
  // ============================================================
  const giftVariationsDetails: Record<string, {
    quantity: number;
    price: number;
    combination: Record<string, string>;
    image_url?: string | null;
  }> = {};

  // ✅ استخدام الفيرنتات المحددة فقط (result_variation_ids)
  const giftVariationIds = offer?.result_variation_ids || [];
  let availableGiftVariations: any[] = [];

  if (giftVariationIds.length > 0) {
    availableGiftVariations = freeProduct?.variations?.filter((v: any) => 
      giftVariationIds.includes(v.id)
    ) || [];
    console.log(`📊 [handleAddToCart] Using ${availableGiftVariations.length} gift variations from result_variation_ids`);
  } else {
    availableGiftVariations = freeProduct?.variations || [];
    console.log(`📊 [handleAddToCart] Using all ${availableGiftVariations.length} gift variations (fallback)`);
  }

  const giftColors = freeProduct?.colors || [];

  // ✅ ✅ ✅ استخدام selectedGiftVariations (اختيارات المستخدم للهدية)
  const userSelectedGifts = selectedGiftVariations || {};

  availableGiftVariations.forEach((variation: any) => {
    // ✅ جلب الكمية التي اختارها المستخدم لهذا الفيرنت في الهدية
    const qty = userSelectedGifts[variation.id] || 0;
    
    if (qty > 0) {
      const combo = variation?.combination || {};
      const comboText = Object.entries(combo).map(([key, val]) => `${val}`).join(' • ');
      
      const giftImage = getVariationImage(variation, freeProduct, giftColors);
      
      giftVariationsDetails[variation.id] = {
        quantity: qty, // ✅ الكمية التي اختارها المستخدم للهدية
        price: 0,
        combination: combo,
        image_url: giftImage,
      };
      console.log(`✅ [handleAddToCart] Gift variation (user selected): ${comboText} x${qty} (image: ${giftImage || 'none'})`);
    }
  });

  // ============================================================
  // ✅ 3. التحقق
  // ============================================================
  const hasRequired = Object.keys(requiredVariationsDetails).length > 0;

  if (!hasRequired) {
    toast.warning(app.lang === "ar" ? "⚠️ لم تختار أي فيرنتات" : "⚠️ No variations selected");
    return;
  }

  if (!mainListingId) {
    toast.warning(app.lang === "ar" ? "⚠️ لا يوجد منتج رئيسي" : "⚠️ No main product");
    return;
  }

  // ============================================================
  // ✅ 4. حساب السعر الإجمالي (حسب كميات المستخدم)
  // ============================================================
  let totalPrice = 0;
  for (const [variationId, data] of Object.entries(requiredVariationsDetails)) {
    totalPrice += data.price * data.quantity;
  }

  // ============================================================
  // ✅ 5. بناء البيانات النهائية للعرض مع الصور وكميات المستخدم
  // ============================================================
  const offerData = {
    offer_id: offer.id,
    offer_type: offer.offer_type,
    buy_quantity: offer.buy_quantity,
    get_quantity: offer.get_quantity,
    display_text_ar: offer.display_text_ar,
    display_text_en: offer.display_text_en,
    required_products: {
      main_product: {
        id: mainProduct?.id,
        title_ar: mainProduct?.title_ar,
        title_en: mainProduct?.title_en,
        cover_url: mainProduct?.cover_url,
        colors: mainProduct?.colors || [],
      },
      variations: requiredVariationsDetails, // ✅ كميات المستخدم
    },
    free_product: {
      id: freeProduct?.id,
      title_ar: freeProduct?.title_ar,
      title_en: freeProduct?.title_en,
      cover_url: freeProduct?.cover_url,
      colors: freeProduct?.colors || [],
      variations: giftVariationsDetails, // ✅ كميات المستخدم للهدية
    },
    store: {
      id: offer.store_id || mainProduct?.owner_id,
      name: storeData.name,
      logo: storeData.logo,
    }
  };

  console.log(`📊 [handleAddToCart] Offer data:`, offerData);

  // ============================================================
  // ✅ 6. إضافة عنصر واحد للسلة
  // ============================================================
  try {
    const extraData: any = {
      is_promo_offer: true,
      offer_id: offer.id,
      offer_data: offerData,
    };

    console.log(`📤 [handleAddToCart] Sending to useAddToCart:`, {
      listingId: mainListingId,
      quantity: 1,
      selectedVariationId: null,
      variationPrice: totalPrice,
      hasOfferData: true,
      variationsWithImages: Object.keys(requiredVariationsDetails).length,
      giftVariationsWithImages: Object.keys(giftVariationsDetails).length,
    });

    await addToCartMutation.mutateAsync({
      userId: app.user.id,
      listingId: mainListingId,
      quantity: 1,
      selectedVariationId: null,
      variationPrice: totalPrice,
      variationCombination: {},
      extraData: extraData,
      onStoreConflict: async (data: any) => {
        setCurrentStoreName(data.currentStoreName || "");
        setNewStoreName(data.newStoreName || "");
        setPendingAddData({
          listingId: mainListingId,
          quantity: 1,
          selectedVariations: requiredVariationsDetails,
          selectedGiftVariations: giftVariationsDetails,
        });
        setShowStoreConflict(true);
      },
    });

    const totalSelected = Object.keys(requiredVariationsDetails).length;
    const totalGift = Object.keys(giftVariationsDetails).length;
    
    console.log(`✅ [handleAddToCart] Added: ${totalSelected} selected variations + ${totalGift} gift variations`);

    toast.success(
      app.lang === "ar" 
        ? `🛒 تم إضافة العرض (${totalSelected} منتج${totalSelected > 1 ? 'ات' : ''} + ${totalGift} هدية)`
        : `🛒 Offer added (${totalSelected} product${totalSelected > 1 ? 's' : ''} + ${totalGift} gift)`,
      { 
        duration: 4000,
        icon: '🛒',
        style: {
          background: 'linear-gradient(135deg, #fdf2f8, #fce7f3)',
          color: '#831843',
          borderRadius: '16px',
          border: '1px solid #f9a8d4',
          boxShadow: '0 20px 60px rgba(236, 72, 153, 0.25)',
        },
        className: 'font-bold',
        action: {
          label: app.lang === "ar" ? "🛒 عرض السلة 🛒" : "🛒 View Cart 🛒",
          onClick: () => {
            navigate({ to: "/cart" });
            toast.dismiss();
          }
        },
        actionButtonStyle: {
          background: 'linear-gradient(135deg, #f472b6, #ec4899, #db2777)',
          color: 'white',
          fontWeight: 'bold',
          borderRadius: '12px',
          padding: '8px 24px',
          boxShadow: '0 8px 30px rgba(236, 72, 153, 0.4)',
          border: 'none',
          fontSize: '14px',
        }
      }
    );

  } catch (error: any) {
    console.error(`❌ [handleAddToCart] Error:`, error);
    if (!error?.message?.includes("store")) {
      toast.error(
        app.lang === "ar" 
          ? "❌ حدث خطأ أثناء إضافة العرض للسلة" 
          : "❌ An error occurred while adding the offer to cart"
      );
    }
  }

  console.log("🚀 [handleAddToCart] ===== END =====");
}, [app.user, app.lang, offer, isVariationSelected, mainProduct, selectedVariations, selectedGiftVariations, freeProduct, addToCartMutation, navigate, isBogo, isCrossSell, isBundle, requiredProducts, storeData]);
const handleConfirmClearCart = useCallback(async () => {
    if (!app.user || !pendingAddData) return;
    
    try {
      await clearCartMutation.mutateAsync({ userId: app.user.id });
      
      await addToCartMutation.mutateAsync({
        userId: app.user.id,
        listingId: pendingAddData.listingId,
        quantity: pendingAddData.quantity,
        selectedVariationId: pendingAddData.selectedVariations?.[offer?.listing_id || ''] || undefined,
        extraData: {
          is_promo_offer: true,
          offer_id: offer?.id,
          selected_gift_variation: Object.keys(pendingAddData.selectedGiftVariations || {}).find(id => pendingAddData.selectedGiftVariations?.[id] > 0) || null,
          selected_variations: pendingAddData.selectedVariations,
          selected_gift_variations: pendingAddData.selectedGiftVariations,
          offer_data: {
            offer_type: offer?.offer_type,
            buy_quantity: offer?.buy_quantity,
            get_quantity: offer?.get_quantity,
            required_product_ids: offer?.required_product_ids,
            free_listing_id: offer?.free_listing_id,
            required_variations: offer?.required_variations,
            result_variation_ids: offer?.result_variation_ids,
          }
        },
      });
      
      toast.success(
        app.lang === "ar" 
          ? `✅ تم تبديل المتجر وإضافة العرض للسلة`
          : `✅ Store switched and offer added to cart`
      );
      
      setShowStoreConflict(false);
      setPendingAddData(null);
      
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
    }
  }, [app.user, pendingAddData, addToCartMutation, clearCartMutation, app.lang, offer]);

  // ========== ✅ LOADING & ERROR ==========
  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-14 w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !offer || !offer.is_active) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🎁</div>
          <h2 className="text-2xl font-bold">
            {app.lang === "ar" ? "العرض غير موجود" : "Offer not found"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {app.lang === "ar" ? "قد يكون تم انتهاؤه أو إلغاؤه" : "It may have expired or been cancelled"}
          </p>
          <Button className="mt-6" onClick={() => navigate({ to: "/" })}>
            {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  // ========== ✅ RENDER ==========
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* ===== Breadcrumb ===== */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            {app.lang === "ar" ? "الرئيسية" : "Home"}
          </Link>
          <ChevronLeft className="h-4 w-4" />
          <span className="text-foreground font-medium line-clamp-1">
            {app.lang === "ar" ? offer.display_text_ar : offer.display_text_en}
          </span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10">
          
          {/* ===== LEFT - قسم الصور ===== */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-950/30 dark:to-indigo-950/30 border-2 border-purple-200/50 dark:border-purple-800/30 shadow-xl">
              {mainImage ? (
                <OptimizedImage
                  src={mainImage}
                  alt={offer.display_text_ar || "Promo offer"}
                  width={800}
                  height={800}
                  quality={85}
                  priority={true}
                  objectFit="cover"
                  className="w-full h-full transition-all duration-700 hover:scale-105"
                />
              ) : mainProduct?.cover_url ? (
                <OptimizedImage
                  src={mainProduct.cover_url}
                  alt={offer.display_text_ar || "Promo offer"}
                  width={800}
                  height={800}
                  quality={85}
                  priority={true}
                  objectFit="cover"
                  className="w-full h-full transition-all duration-700 hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <GiftIcon className="h-20 w-20 text-purple-300" />
                </div>
              )}
              
              {/* ✅ ألوان المنتج - مع تغيير الصورة عند الضغط */}
              {mainProduct?.colors && mainProduct.colors.length > 0 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full">
                  {mainProduct.colors.map((color: any) => {
                    const matchingVariation = mainProduct.variations?.find((v: any) => {
                      const combo = v.combination || {};
                      const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
                      for (const key of colorKeys) {
                        if (String(combo[key] || "").trim().toLowerCase() === String(color.color_name_ar || "").trim().toLowerCase()) {
                          return true;
                        }
                      }
                      return false;
                    });
                    
                    const isSelected = matchingVariation && selectedVariations[mainProduct.id]?.[matchingVariation.id] > 0;
                    const variationImage = matchingVariation?.image_url || color.image_url;
                    
                    return (
                      <button
                        key={color.id}
                        onClick={() => {
                          if (matchingVariation) {
                            if (variationImage) {
                              setMainImage(variationImage);
                            }
                            if (!selectionStats.hasOver) {
                              handleVariationQuantityChange(mainProduct.id, matchingVariation.id, 1);
                            }
                          }
                        }}
                        className={cn(
                          "w-6 h-6 rounded-full border-2 transition-all duration-300",
                          isSelected 
                            ? "border-white ring-2 ring-purple-500 scale-110 shadow-lg shadow-purple-500/50" 
                            : "border-white/50 hover:scale-110 hover:border-white/80",
                          mainImage === variationImage && "ring-2 ring-purple-300 scale-105"
                        )}
                        style={{ backgroundColor: color.color_hex || '#ccc' }}
                        title={color.color_name_ar}
                      />
                    );
                  })}
                </div>
              )}
              
              <div className="absolute top-4 start-4 flex flex-col gap-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold animate-pulse">
                  <Sparkles className="h-3.5 w-3.5 inline mr-1" />
                  {app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"}
                </Badge>
                {discountPercent > 0 && (
                  <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold animate-pulse">
                    🎁 {discountPercent}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ===== RIGHT - معلومات العرض ===== */}
          <div className="space-y-6">
            
            {/* ===== نوع العرض ===== */}
            <div className="flex items-center gap-3 flex-wrap">
              {promoType && (
                <Badge className={cn(
                  "border-0 text-sm font-bold px-4 py-2 rounded-full",
                  promoType.color,
                  promoType.bg
                )}>
                  {promoType.icon && <promoType.icon className="h-4 w-4 inline mr-1.5" />}
                  {promoType.label}
                </Badge>
              )}
              {offer.is_featured && (
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-full px-3 py-1.5 text-sm">
                  ⭐ {app.lang === "ar" ? "مميز" : "Featured"}
                </Badge>
              )}
              {!offer.expires_at && (
                <Badge variant="outline" className="border-emerald-500/30 text-emerald-600 rounded-full px-3 py-1.5">
                  🔓 {app.lang === "ar" ? "دائم" : "Permanent"}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              {app.lang === "ar" ? offer.display_text_ar : offer.display_text_en}
            </h1>

            {/* ===== المتجر ===== */}
            {(offer?.store_id || mainProduct?.owner_id) && (
              <Link 
                to="/store/$id" 
                params={{ id: offer?.store_id || mainProduct?.owner_id }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-indigo-500/10 hover:from-purple-500/20 hover:to-indigo-500/20 transition-all border border-purple-300/30 dark:border-purple-800/30 group"
              >
                <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 bg-gradient-to-br from-purple-600 to-indigo-600">
                  {storeData.logo ? (
                    <OptimizedImage
                      src={storeData.logo}
                      alt={storeData.name}
                      width={56}
                      height={56}
                      quality={85}
                      objectFit="cover"
                      className="h-full w-full"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-white font-bold text-2xl">
                      {storeData.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="font-bold text-lg group-hover:text-purple-600 transition">{storeData.name}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    {app.lang === "ar" ? "متجر موثوق" : "Trusted Store"}
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group-hover:bg-purple-500/10 group-hover:scale-105 transition">
                  {app.lang === "ar" ? "زيارة المتجر" : "Visit Store"} <ArrowRight className="h-4 w-4 ms-1" />
                </Button>
              </Link>
            )}

            {/* ===== تفاصيل العرض ===== */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-6 rounded-2xl border border-purple-200/50 dark:border-purple-800/30">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "الكمية المطلوبة للشراء" : "Required Purchase Quantity"}
                  </p>
                  <p className="text-2xl font-bold text-[#0d2e2a]">
                    {offer.buy_quantity || 2}
                  </p>
                </div>
                <div className="text-center p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl">
                  <p className="text-xs text-muted-foreground">
                    {app.lang === "ar" ? "الكمية المجانية" : "Free Quantity"}
                  </p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {offer.get_quantity || 1}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {app.lang === "ar" ? "🎯 اشتري" : "🎯 Buy"} 
                  <span className="font-bold text-[#0d2e2a] mx-1">{offer.buy_quantity || 2}</span>
                  {app.lang === "ar" ? "واحصل على" : "and get"} 
                  <span className="font-bold text-emerald-600 mx-1">{offer.get_quantity || 1}</span>
                  {app.lang === "ar" ? "مجاناً 🎁" : "free 🎁"}
                </span>
              </div>
            </div>

            {/* ===== السعر ===== */}
            <div className="bg-gradient-to-r from-primary/5 to-transparent p-6 rounded-2xl border border-primary/10">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-4xl md:text-5xl font-black text-primary">
                    {finalPrice.toLocaleString(app.lang === "ar" ? "ar-SY" : "en-US")}
                  </span>
                  {discountPercent > 0 && (
                    <Badge className="bg-gradient-to-r from-rose-500 to-orange-500 text-white border-0 text-sm font-bold px-3 py-1.5 rounded-full shadow-md shadow-rose-500/20 animate-pulse">
                      🎁 {discountPercent}% OFF
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* ===== ✅ تقدم اختيار المنتجات المطلوبة (لجميع أنواع العروض) ===== */}
            {(isBundle || isBogo || isCrossSell) && (
              <div className="p-4 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {app.lang === "ar" ? "📊 تقدم اختيار الكميات (المنتجات)" : "📊 Quantity Progress (Products)"}
                    </span>
                    <Badge className={cn(
                      "border-0 text-[10px]",
                      selectionStats.allComplete && !selectionStats.hasOver 
                        ? "bg-emerald-500/20 text-emerald-600" 
                        : selectionStats.hasOver 
                          ? "bg-red-500/20 text-red-600"
                          : "bg-amber-500/20 text-amber-600"
                    )}>
                      {selectionStats.allComplete && !selectionStats.hasOver 
                        ? "✅ مكتمل" 
                        : selectionStats.hasOver 
                          ? `⚠️ تجاوز ${totalSelectedQuantity}/${totalRequiredQuantity}`
                          : `⚠️ ${totalSelectedQuantity}/${totalRequiredQuantity}`}
                    </Badge>
                  </div>
                  <span className="text-xs font-bold text-[#0d2e2a]">
                    {totalSelectedQuantity}/{totalRequiredQuantity}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      selectionStats.allComplete && !selectionStats.hasOver
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : selectionStats.hasOver
                          ? "bg-gradient-to-r from-red-500 to-rose-500"
                          : "bg-gradient-to-r from-[#2a655f] to-[#3a8a82]"
                    )}
                    style={{ 
                      width: `${Math.min(100, (totalSelectedQuantity / totalRequiredQuantity) * 100)}%` 
                    }}
                  />
                </div>
                
                {selectionStats.hasOver && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-800/30">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-700 dark:text-red-400">
                      {app.lang === "ar" 
                        ? `⚠️ الكمية المختارة (${totalSelectedQuantity}) تتجاوز المطلوب (${totalRequiredQuantity})`
                        : `⚠️ Selected quantity (${totalSelectedQuantity}) exceeds required (${totalRequiredQuantity})`}
                    </p>
                  </div>
                )}

                {!selectionStats.allComplete && !selectionStats.hasOver && remainingProducts > 0 && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                    <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                    <p className="text-xs text-amber-700 dark:text-amber-400">
                      {app.lang === "ar" 
                        ? `⚠️ متبقي ${remainingProducts} منتج${remainingProducts > 1 ? 'ات' : ''} لاستكمال الكميات`
                        : `⚠️ ${remainingProducts} product${remainingProducts > 1 ? 's' : ''} remaining to complete quantities`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ===== ✅ المنتجات المطلوبة مع فيرنتاتها ===== */}
            {(isBundle || isBogo || isCrossSell) && (
              <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <Package className="h-4 w-4 text-[#0d2e2a]" />
                    {app.lang === "ar" ? "المنتجات المطلوبة" : "Required Products"}
                    <span className="text-xs text-red-500">*</span>
                  </h3>
                </div>
                
                {/* ✅ عرض المنتج الرئيسي لـ BOGO و Cross-sell */}
                {(isBogo || isCrossSell) && mainProductWithVariations && (
                  (() => {
                    const item = mainProductWithVariations;
                    const product = item.product;
                    const variations = item.variations;
                    const selectedMap = selectedVariations[product.id] || {};
                    const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
                    const isComplete = selectedTotal === item.totalRequiredQuantity;
                    const isOver = selectedTotal > item.totalRequiredQuantity;
                    const remaining = Math.max(0, item.totalRequiredQuantity - selectedTotal);

                    return (
                      <div key={product.id} className={cn(
                        "p-4 rounded-xl border transition-all duration-300 mb-3",
                        isComplete && !isOver
                          ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30"
                          : isOver
                            ? "bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/30"
                            : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30"
                      )}>
                        {/* ===== رأس المنتج ===== */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-[#2a655f] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                              {isBogo ? "🎁" : "🔄"}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900 dark:text-white">
                                {product.title_ar}
                                <span className="text-xs text-muted-foreground font-normal mr-2">
                                  ({app.lang === "ar" ? "المطلوب" : "Required"}: {item.totalRequiredQuantity})
                                </span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatPrice(Number(product.price), app.currency, app.lang)}
                              </p>
                            </div>
                          </div>
                          
                          <Badge className={cn(
                            "border-0 text-[10px]",
                            isComplete && !isOver
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : isOver
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          )}>
                            {isComplete && !isOver
                              ? `✅ ${selectedTotal}/${item.totalRequiredQuantity}`
                              : isOver
                                ? `⚠️ ${selectedTotal}/${item.totalRequiredQuantity}`
                                : `⚠️ ${selectedTotal}/${item.totalRequiredQuantity}`}
                          </Badge>
                        </div>

                        {/* ===== فيرنتات هذا المنتج مع أزرار + و - ===== */}
                        {variations.length > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Layers className="h-3 w-3" />
                                {app.lang === "ar" ? "🎨 توزيع الكميات" : "🎨 Quantity Distribution"}
                                {remaining > 0 && !isOver && (
                                  <Badge className="bg-amber-500/20 text-amber-600 border-0 text-[9px]">
                                    {app.lang === "ar" ? `متبقي ${remaining}` : `${remaining} remaining`}
                                  </Badge>
                                )}
                              </span>
                              {remaining > 0 && !isOver && (
                                <button
                                  onClick={() => autoDistributeRemaining(product.id, variations, item.totalRequiredQuantity)}
                                  className="text-[10px] text-[#2a655f] hover:underline transition-colors flex items-center gap-1 px-2 py-1 border border-[#2a655f]/20 rounded-lg hover:bg-[#2a655f]/5"
                                >
                                  <Zap className="h-3 w-3" />
                                  {app.lang === "ar" ? `وزع ${remaining} المتبقية` : `Distribute ${remaining} remaining`}
                                </button>
                              )}
                            </div>
                            
                            <div className="flex flex-wrap gap-3 mt-2">
                              {variations.map((v: any) => {
                                const combo = v.combination || {};
                                const comboText = Object.entries(combo)
                                  .map(([key, value]) => `${value}`)
                                  .join(' • ');
                                const currentQty = selectedMap[v.id] || 0;
                                const price = v.price || product.price;

                                return (
                                  <div key={v.id} className="flex items-center gap-2 p-2 border rounded-xl border-slate-200/50 bg-white/50 dark:bg-slate-800/50">
                                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                      {comboText || v.id.slice(0, 6)}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                      ({formatPrice(Number(price), app.currency, app.lang)})
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => handleVariationQuantityChange(product.id, v.id, -1)}
                                        className={cn(
                                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                          currentQty > 0 
                                            ? "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                                            : "bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800"
                                        )}
                                        disabled={currentQty === 0}
                                      >
                                        -
                                      </button>
                                      <span className="w-8 text-center font-bold text-[#0d2e2a] text-sm">
                                        {currentQty}
                                      </span>
                                      <button
                                        onClick={() => handleVariationQuantityChange(product.id, v.id, 1)}
                                        className={cn(
                                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                          !isOver || currentQty === 0
                                            ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white"
                                            : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700"
                                        )}
                                        disabled={isOver}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* ===== إذا كان المنتج ليس لديه فيرنتات ===== */}
                        {!item.hasVariations && (
                          <div className="mt-2">
                            <p className="text-xs text-emerald-500/60 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {app.lang === "ar" ? "✅ هذا المنتج لا يحتوي على فيرنتات" : "✅ This product has no variations"}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}
                
                {/* ✅ عرض المنتجات المطلوبة لـ Bundle */}
                {isBundle && requiredProducts.map((item: any, index: number) => {
                  const product = item.product;
                  const variations = item.variations;
                  const selectedMap = selectedVariations[product.id] || {};
                  const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
                  const isComplete = selectedTotal === item.totalRequiredQuantity;
                  const isOver = selectedTotal > item.totalRequiredQuantity;
                  const remaining = Math.max(0, item.totalRequiredQuantity - selectedTotal);

                  return (
                    <div key={product.id} className={cn(
                      "p-4 rounded-xl border transition-all duration-300 mb-3",
                      isComplete && !isOver
                        ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/50 dark:border-emerald-800/30"
                        : isOver
                          ? "bg-red-50/50 dark:bg-red-950/20 border-red-200/50 dark:border-red-800/30"
                          : "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/50 dark:border-amber-800/30"
                    )}>
                      {/* ===== رأس المنتج ===== */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0",
                            isComplete && !isOver
                              ? "bg-emerald-500"
                              : isOver
                                ? "bg-red-500"
                                : "bg-amber-500"
                          )}>
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-white">
                              {product.title_ar}
                              <span className="text-xs text-muted-foreground font-normal mr-2">
                                ({app.lang === "ar" ? "المطلوب" : "Required"}: {item.totalRequiredQuantity})
                              </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(Number(product.price), app.currency, app.lang)}
                            </p>
                          </div>
                        </div>
                        
                        <Badge className={cn(
                          "border-0 text-[10px]",
                          isComplete && !isOver
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                            : isOver
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                        )}>
                          {isComplete && !isOver
                            ? `✅ ${selectedTotal}/${item.totalRequiredQuantity}`
                            : isOver
                              ? `⚠️ ${selectedTotal}/${item.totalRequiredQuantity}`
                              : `⚠️ ${selectedTotal}/${item.totalRequiredQuantity}`}
                        </Badge>
                      </div>

                      {/* ===== فيرنتات هذا المنتج مع أزرار + و - ===== */}
                      {variations.length > 0 && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Layers className="h-3 w-3" />
                              {app.lang === "ar" ? "🎨 توزيع الكميات" : "🎨 Quantity Distribution"}
                              {remaining > 0 && !isOver && (
                                <Badge className="bg-amber-500/20 text-amber-600 border-0 text-[9px]">
                                  {app.lang === "ar" ? `متبقي ${remaining}` : `${remaining} remaining`}
                                </Badge>
                              )}
                            </span>
                            {remaining > 0 && !isOver && (
                              <button
                                onClick={() => autoDistributeRemaining(product.id, variations, item.totalRequiredQuantity)}
                                className="text-[10px] text-[#2a655f] hover:underline transition-colors flex items-center gap-1 px-2 py-1 border border-[#2a655f]/20 rounded-lg hover:bg-[#2a655f]/5"
                              >
                                <Zap className="h-3 w-3" />
                                {app.lang === "ar" ? `وزع ${remaining} المتبقية` : `Distribute ${remaining} remaining`}
                              </button>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-3 mt-2">
                            {variations.map((v: any) => {
                              const combo = v.combination || {};
                              const comboText = Object.entries(combo)
                                .map(([key, value]) => `${value}`)
                                .join(' • ');
                              const currentQty = selectedMap[v.id] || 0;
                              const price = v.price || product.price;

                              return (
                                <div key={v.id} className="flex items-center gap-2 p-2 border rounded-xl border-slate-200/50 bg-white/50 dark:bg-slate-800/50">
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {comboText || v.id.slice(0, 6)}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    ({formatPrice(Number(price), app.currency, app.lang)})
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleVariationQuantityChange(product.id, v.id, -1)}
                                      className={cn(
                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        currentQty > 0 
                                          ? "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                                          : "bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800"
                                      )}
                                      disabled={currentQty === 0}
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center font-bold text-[#0d2e2a] text-sm">
                                      {currentQty}
                                    </span>
                                    <button
                                      onClick={() => handleVariationQuantityChange(product.id, v.id, 1)}
                                      className={cn(
                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        !isOver || currentQty === 0
                                          ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white"
                                          : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700"
                                      )}
                                      disabled={isOver}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ===== إذا كان المنتج ليس لديه فيرنتات ===== */}
                      {!item.hasVariations && (
                        <div className="mt-2">
                          <p className="text-xs text-emerald-500/60 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            {app.lang === "ar" ? "✅ هذا المنتج لا يحتوي على فيرنتات" : "✅ This product has no variations"}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* ===== ✅ الهدية (لجميع أنواع العروض) ===== */}
            {freeProduct && (
              <>
                {/* ===== تقدم اختيار الهدية ===== */}
                <div className="p-4 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {app.lang === "ar" ? "📊 تقدم اختيار الهدية" : "📊 Gift Progress"}
                      </span>
                      <Badge className={cn(
                        "border-0 text-[10px]",
                        giftStats.isComplete && !giftStats.isOver
                          ? "bg-emerald-500/20 text-emerald-600"
                          : giftStats.isOver
                            ? "bg-red-500/20 text-red-600"
                            : "bg-amber-500/20 text-amber-600"
                      )}>
                        {giftStats.isComplete && !giftStats.isOver
                          ? "✅ مكتمل"
                          : giftStats.isOver
                            ? `⚠️ تجاوز ${giftStats.selected}/${giftStats.total}`
                            : `⚠️ ${giftStats.selected}/${giftStats.total}`}
                      </Badge>
                    </div>
                    <span className="text-xs font-bold text-[#0d2e2a]">
                      {giftStats.selected}/{giftStats.total}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        giftStats.isComplete && !giftStats.isOver
                          ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                          : giftStats.isOver
                            ? "bg-gradient-to-r from-red-500 to-rose-500"
                            : "bg-gradient-to-r from-[#2a655f] to-[#3a8a82]"
                      )}
                      style={{ 
                        width: `${Math.min(100, (giftStats.selected / giftStats.total) * 100)}%` 
                      }}
                    />
                  </div>
                  
                  {giftStats.isOver && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-800/30">
                      <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      <p className="text-xs text-red-700 dark:text-red-400">
                        {app.lang === "ar" 
                          ? `⚠️ الكمية المختارة (${giftStats.selected}) تتجاوز الهدية (${giftStats.total})`
                          : `⚠️ Selected quantity (${giftStats.selected}) exceeds gift (${giftStats.total})`}
                      </p>
                    </div>
                  )}

                  {!giftStats.isComplete && !giftStats.isOver && giftStats.remaining > 0 && (
                    <div className="mt-2 flex items-center gap-2 p-2 bg-amber-50/50 dark:bg-amber-950/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                      <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        {app.lang === "ar" 
                          ? `⚠️ متبقي ${giftStats.remaining} من الهدية لاستكمال الكميات`
                          : `⚠️ ${giftStats.remaining} remaining from gift to complete quantities`}
                      </p>
                    </div>
                  )}
                </div>

                {/* ===== الهدية مع التحكم في الكميات ===== */}
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-sm flex items-center gap-2 text-emerald-600">
                      <GiftIcon className="h-4 w-4" />
                      {app.lang === "ar" ? "🎁 الهدية" : "🎁 Gift"}
                    </h3>
                    <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[10px]">
                      ×{offer.get_quantity || 1}
                    </Badge>
                  </div>
                  
                  <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const giftVariationIds = offer?.result_variation_ids || [];
                        let giftImage = freeProduct.cover_url || null;
                        let giftVariationNames: { id: string; name: string; qty: number }[] = [];
                        
                        // ✅ استخدام الفيرنتات المحددة أو جميع الفيرنتات
                        const availableGiftVariations = giftVariationIds.length > 0
                          ? giftVariations.filter((v: any) => giftVariationIds.includes(v.id))
                          : freeProduct.variations || [];
                        
                        if (availableGiftVariations.length > 0) {
                          availableGiftVariations.forEach((variation: any) => {
                            if (!giftImage) {
                              if (variation.image_url) {
                                giftImage = variation.image_url;
                              } else {
                                const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
                                let colorValue = null;
                                for (const key of colorKeys) {
                                  if (variation.combination?.[key]) {
                                    colorValue = variation.combination[key];
                                    break;
                                  }
                                }
                                if (colorValue) {
                                  const productColors = freeProduct?.colors || [];
                                  const color = productColors.find((c: any) => 
                                    String(c.color_name_ar || "").trim().toLowerCase() === String(colorValue).trim().toLowerCase()
                                  );
                                  if (color?.image_url) {
                                    giftImage = color.image_url;
                                  }
                                }
                              }
                            }
                            
                            const combo = variation.combination || {};
                            const comboText = Object.entries(combo)
                              .map(([key, value]) => `${value}`)
                              .join(' • ');
                            const qty = selectedGiftVariations[variation.id] || 0;
                            giftVariationNames.push({
                              id: variation.id,
                              name: comboText,
                              qty: qty
                            });
                          });
                        }
                        
                        return (
                          <>
                            {giftImage ? (
                              <OptimizedImage
                                src={giftImage}
                                alt={freeProduct.title_ar}
                                width={48}
                                height={48}
                                quality={80}
                                objectFit="cover"
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <GiftIcon className="h-6 w-6 text-emerald-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-bold text-emerald-700 dark:text-emerald-300">
                                {freeProduct.title_ar}
                              </p>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge className="bg-emerald-500/90 text-white border-0 text-[10px]">
                                  ✅ {app.lang === "ar" ? "مجاناً" : "FREE"}
                                </Badge>
                                <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[10px]">
                                  ×{offer.get_quantity || 1}
                                </Badge>
                                {availableGiftVariations.length > 0 && (
                                  <Badge className="bg-purple-500/20 text-purple-600 border-0 text-[10px]">
                                    🎨 {availableGiftVariations.length} {app.lang === "ar" ? "فيرنتات" : "variations"}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                    
                    {/* ===== توزيع الكميات على فيرنتات الهدية مع أزرار + و - ===== */}
                    {(() => {
                      const giftVariationIds = offer?.result_variation_ids || [];
                      const totalGiftQty = offer?.get_quantity || 1;
                      
                      // ✅ استخدام الفيرنتات المحددة أو جميع الفيرنتات
                      const availableGiftVariations = giftVariationIds.length > 0
                        ? giftVariations.filter((v: any) => giftVariationIds.includes(v.id))
                        : freeProduct?.variations || [];
                      
                      if (availableGiftVariations.length === 0) return null;
                      
                      const giftSelectedMap = selectedGiftVariations || {};
                      const giftSelectedTotal = Object.values(giftSelectedMap).reduce((sum, qty) => sum + qty, 0);
                      const giftIsOver = giftSelectedTotal > totalGiftQty;
                      const giftRemaining = Math.max(0, totalGiftQty - giftSelectedTotal);
                      
                      return (
                        <div className="mt-3 p-3 bg-white/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                              🎨 {app.lang === "ar" ? "توزيع كميات الهدية" : "Gift Quantity Distribution"}
                              {giftRemaining > 0 && !giftIsOver && (
                                <Badge className="bg-amber-500/20 text-amber-600 border-0 text-[9px]">
                                  {app.lang === "ar" ? `متبقي ${giftRemaining}` : `${giftRemaining} remaining`}
                                </Badge>
                              )}
                            </span>
                            {giftRemaining > 0 && !giftIsOver && (
                              <button
                                onClick={() => autoDistributeGiftRemaining(availableGiftVariations, totalGiftQty)}
                                className="text-[10px] text-[#2a655f] hover:underline transition-colors flex items-center gap-1 px-2 py-1 border border-[#2a655f]/20 rounded-lg hover:bg-[#2a655f]/5"
                              >
                                <Zap className="h-3 w-3" />
                                {app.lang === "ar" ? `وزع ${giftRemaining}` : `Distribute ${giftRemaining}`}
                              </button>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {availableGiftVariations.map((variation: any) => {
                              const combo = variation.combination || {};
                              const comboText = Object.entries(combo)
                                .map(([key, value]) => `${value}`)
                                .join(' • ');
                              const currentQty = selectedGiftVariations[variation.id] || 0;
                              const price = variation.price || freeProduct?.price || 0;
                              
                              return (
                                <div key={variation.id} className="flex items-center gap-2 p-2 border rounded-xl border-slate-200/50 bg-white/50 dark:bg-slate-800/50">
                                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                    {comboText}
                                  </span>
                                  <span className="text-[10px] text-muted-foreground">
                                    ({formatPrice(Number(price), app.currency, app.lang)})
                                  </span>
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => handleGiftVariationQuantityChange(variation.id, -1)}
                                      className={cn(
                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        currentQty > 0 
                                          ? "bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600"
                                          : "bg-slate-100 text-slate-300 cursor-not-allowed dark:bg-slate-800"
                                      )}
                                      disabled={currentQty === 0}
                                    >
                                      -
                                    </button>
                                    <span className="w-8 text-center font-bold text-[#0d2e2a] text-sm">
                                      {currentQty}
                                    </span>
                                    <button
                                      onClick={() => handleGiftVariationQuantityChange(variation.id, 1)}
                                      className={cn(
                                        "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                                        !giftIsOver && (currentQty === 0 || giftRemaining > 0)
                                          ? "bg-[#2a655f] hover:bg-[#1a4f4a] text-white"
                                          : "bg-slate-200 text-slate-400 cursor-not-allowed dark:bg-slate-700"
                                      )}
                                      disabled={giftIsOver || (currentQty > 0 && giftRemaining === 0)}
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          {giftIsOver && (
                            <div className="mt-2 flex items-center gap-2 p-2 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-200/50 dark:border-red-800/30">
                              <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                              <p className="text-xs text-red-700 dark:text-red-400">
                                {app.lang === "ar" 
                                  ? `⚠️ الكمية المختارة (${giftSelectedTotal}) تتجاوز الهدية (${totalGiftQty})`
                                  : `⚠️ Selected quantity (${giftSelectedTotal}) exceeds gift (${totalGiftQty})`}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </>
            )}

            {/* ===== تنبيه اختيار الفيرنتات ===== */}
            {!isVariationSelected && (
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/50 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                    {app.lang === "ar" 
                      ? `⚠️ غير مكتمل (المنتجات: ${totalSelectedQuantity}/${totalRequiredQuantity}${offer?.result_variation_ids?.length > 0 ? `, الهدية: ${giftStats.selected}/${giftStats.total}` : ''})`
                      : `⚠️ Incomplete (Products: ${totalSelectedQuantity}/${totalRequiredQuantity}${offer?.result_variation_ids?.length > 0 ? `, Gift: ${giftStats.selected}/${giftStats.total}` : ''})`}
                  </p>
                  <p className="text-xs text-amber-600/80 dark:text-amber-400/70">
                    {app.lang === "ar" 
                      ? `يرجى استكمال الكميات المطلوبة`
                      : `Please complete required quantities`}
                  </p>
                </div>
              </div>
            )}

            {/* ===== تم الاختيار ===== */}
            {isVariationSelected && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300">
                <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                    ✅ {app.lang === "ar" ? "تم استكمال جميع الكميات" : "All quantities completed"}
                  </p>
                  <p className="text-xs text-emerald-600/80 dark:text-emerald-400/70">
                    {isBundle 
                      ? `📦 ${requiredProducts.length} ${app.lang === "ar" ? "منتج" : "products"}`
                      : `🛒 ${app.lang === "ar" ? "جاهز للإضافة للسلة" : "Ready to add to cart"}`
                    }
                    {Object.keys(selectedGiftVariations).length > 0 && ` 🎁 ${freeProduct?.title_ar}`}
                  </p>
                </div>
              </div>
            )}

            {/* ===== الكمية ===== */}
            <div className="flex items-center gap-4">
              <span className="font-semibold">{app.lang === "ar" ? "الكمية:" : "Quantity:"}</span>
              <div className="flex items-center border-2 rounded-2xl overflow-hidden shadow-sm border-[#0d2e2a]/20">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="h-12 w-12 flex items-center justify-center hover:bg-[#0d2e2a]/5 transition text-lg font-bold text-[#0d2e2a]"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <span className="w-16 text-center font-bold text-lg text-[#0d2e2a]">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="h-12 w-12 flex items-center justify-center hover:bg-[#0d2e2a]/5 transition text-lg font-bold text-[#0d2e2a]"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* ===== زر إضافة للسلة ===== */}
            <Button 
              size="lg" 
              className={cn(
                "w-full h-14 rounded-2xl text-white shadow-xl shadow-[#2a655f]/30 hover:shadow-2xl hover:shadow-[#2a655f]/40 transition-all hover:scale-[1.02] active:scale-[0.98] text-lg font-bold",
                "bg-[#2a655f] hover:bg-[#1a4f4a]",
                !isVariationSelected && "opacity-60 cursor-not-allowed hover:scale-100 hover:shadow-xl"
              )}
              onClick={handleAddToCart}
              disabled={addToCartMutation.isPending || !isVariationSelected}
            >
              {addToCartMutation.isPending ? (
                <div className="flex items-center gap-3">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {app.lang === "ar" ? "جاري الإضافة..." : "Adding..."}
                </div>
              ) : !isVariationSelected ? (
                <>
                  <AlertTriangle className="h-5 w-5 me-3" />
                  {app.lang === "ar" 
                    ? `⚠️ أكمل الكميات المطلوبة (${totalSelectedQuantity}/${totalRequiredQuantity}${offer?.result_variation_ids?.length > 0 ? `, هدية: ${giftStats.selected}/${giftStats.total}` : ''})`
                    : `⚠️ Complete required quantities (${totalSelectedQuantity}/${totalRequiredQuantity}${offer?.result_variation_ids?.length > 0 ? `, Gift: ${giftStats.selected}/${giftStats.total}` : ''})`}
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 me-3" />
                  {app.lang === "ar" ? "أضف العرض للسلة" : "Add Offer to Cart"}
                  <Badge className="bg-white/20 text-white border-0 ms-3">
                    {quantity}
                  </Badge>
                </>
              )}
            </Button>

            {/* ===== مميزات ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t">
              {[
                { icon: Truck, label: app.lang === "ar" ? "توصيل سريع" : "Fast Delivery" },
                { icon: Shield, label: app.lang === "ar" ? "دفع آمن" : "Secure Payment" },
                { icon: Award, label: app.lang === "ar" ? "ضمان الجودة" : "Quality Guarantee" },
                { icon: Clock, label: app.lang === "ar" ? "دعم 24/7" : "24/7 Support" },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition border border-border/30">
                  <item.icon className="h-5 w-5 text-[#0d2e2a]" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===== مودال تعارض المتجر ===== */}
      <Dialog open={showStoreConflict} onOpenChange={setShowStoreConflict}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl text-[#0d2e2a]">
              <ShoppingCart className="h-6 w-6 text-amber-500" />
              {app.lang === "ar" ? "⚠️ سلة من متجر آخر" : "⚠️ Cart from another store"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {app.lang === "ar" 
                ? `لديك منتجات في السلة من "${currentStoreName}"`
                : `You have items in your cart from "${currentStoreName}"`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                {app.lang === "ar" 
                  ? `📦 السلة تحتوي على منتجات من "${currentStoreName}"`
                  : `📦 Your cart currently has items from "${currentStoreName}"`}
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                {app.lang === "ar" 
                  ? `🛒 العرض الجديد من "${newStoreName}"`
                  : `🛒 The new offer is from "${newStoreName}"`}
              </p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              {app.lang === "ar" 
                ? "لا يمكن إضافة منتجات من أكثر من متجر واحد في نفس السلة"
                : "You cannot add products from different stores in the same cart"}
            </div>
          </div>
          
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowStoreConflict(false)}>
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmClearCart}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "تفريغ السلة وإضافة العرض" : "Clear cart and add offer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default OfferDetailPage;