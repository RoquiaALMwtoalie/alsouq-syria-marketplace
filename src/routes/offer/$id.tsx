// src/routes/offer/$id.tsx - نفس تصميم listing/$id مع الحفاظ على كل اللوجيك

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { useProductOfferByIdV2 } from "@/lib/hooks/useProductOffers";
import { useAddToCart, useClearCart } from "@/lib/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Gift, Sparkles, Package, Store, ArrowRight, 
  ChevronLeft, ChevronRight,
  Star, MapPin, 
  Gift as GiftIcon, Tag, ShoppingCart, CheckCircle,
  Truck, Shield, Clock, Award, Minus, Plus, AlertTriangle,
  Layers, Palette, Ruler, Trash2, Check, X,
  ShoppingBag, Percent, ChevronDown, ChevronUp,
  Zap, Rocket, Gem, Crown, Flame, Heart, Share2
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
import { useListings, useSimilarListings, useTrendingListings } from "@/lib/queries";
import { OptimizedImage } from "@/components/OptimizedImage";
import { ClientOnly } from "@/components/ClientOnly";

export const Route = createFileRoute("/offer/$id")({
  beforeLoad: () => ({
    hideFooter: true,
  }),
  component: OfferDetailPage,
  head: () => ({ meta: [{ title: "تفاصيل العرض الترويجي — السوق لعندك" }] }),
});

const LoadingSkeleton = () => (
  <div className="mx-auto max-w-4xl px-4 py-8">
    <Skeleton className="aspect-square rounded-2xl w-full" />
    <div className="space-y-4 mt-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-12 w-1/4" />
    </div>
  </div>
);

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
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isVariationSelectedFlag, setIsVariationSelectedFlag] = useState<boolean>(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // ✅ مؤقت لمنع التحديثات المتكررة للصورة
  const imageUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isImageUpdatingRef = useRef<boolean>(false);

  // ========== ✅ QUERIES ==========
  const { data: rawOffer, isLoading, isError } = useProductOfferByIdV2(id);
  
  const { data: listingsData } = useListings({ limit: 1000 });
  const listings = listingsData?.data || [];

  // ✅ للاقتراحات (نستخدم المنتج الرئيسي للعرض كمرجع)
  const mainProductId = useMemo(() => {
    if (!rawOffer) return undefined;
    const products = Array.isArray(rawOffer.products) 
      ? rawOffer.products 
      : rawOffer.products ? [rawOffer.products] : [];
    return products[0]?.id || rawOffer.listing_id || undefined;
  }, [rawOffer]);

  const mainProductCategoryId = useMemo(() => {
    if (!rawOffer) return undefined;
    const products = Array.isArray(rawOffer.products) 
      ? rawOffer.products 
      : rawOffer.products ? [rawOffer.products] : [];
    return products[0]?.category_id || rawOffer.category_id || undefined;
  }, [rawOffer]);

  const { data: similarListings = [] } = useSimilarListings(
    mainProductCategoryId, 
    mainProductId, 
    4
  );

  const { data: trendingListings = [], isLoading: trendingLoading } = useTrendingListings(8);

  // ========== ✅ OFFER ==========
  const offer = useMemo(() => {
    if (!rawOffer) return null;
    
    const products = Array.isArray(rawOffer.products) 
      ? rawOffer.products 
      : rawOffer.products ? [rawOffer.products] : [];
    
    let mainProduct = products[0] || null;
    let freeProduct = null;
    
    if (rawOffer.offer_type === 'bundle' && rawOffer.free_listing_id) {
      const freeListing = listings.find((l: any) => l.id === rawOffer.free_listing_id);
      if (freeListing) {
        freeProduct = freeListing;
      }
    } else if (products.length > 1) {
      freeProduct = products[1];
    } else if (rawOffer.free_product) {
      freeProduct = rawOffer.free_product;
    }
    
    if (rawOffer.offer_type === 'bundle' && mainProduct) {
      const hasColors = (mainProduct.colors && mainProduct.colors.length > 0);
      const hasVariations = (mainProduct.variations && mainProduct.variations.length > 0);
      
      if (hasColors && !hasVariations) {
        const colorVariations = mainProduct.colors.map((color: any) => ({
          id: color.id,
          combination: {
            colors: color.color_name_ar || color.color_name_en || 'لون',
            hex: color.color_hex || '#ccc'
          },
          price: mainProduct.price || 0,
          old_price: mainProduct.old_price || null,
          image_url: color.image_url || null,
          is_active: true,
          stock_quantity: 0,
          _type: 'color'
        }));
        
        mainProduct = {
          ...mainProduct,
          variations: colorVariations,
          _hasOnlyColors: true
        };
      }
    }
    
    if (freeProduct) {
      const hasColors = (freeProduct.colors && freeProduct.colors.length > 0);
      const hasVariations = (freeProduct.variations && freeProduct.variations.length > 0);
      
      if (hasColors && !hasVariations) {
        const colorVariations = freeProduct.colors.map((color: any) => ({
          id: color.id,
          combination: {
            colors: color.color_name_ar || color.color_name_en || 'لون',
            hex: color.color_hex || '#ccc'
          },
          price: freeProduct.price || 0,
          old_price: freeProduct.old_price || null,
          image_url: color.image_url || null,
          is_active: true,
          stock_quantity: 0,
          _type: 'color'
        }));
        
        freeProduct = {
          ...freeProduct,
          variations: colorVariations,
          _hasOnlyColors: true
        };
      }
    }
    
    return {
      ...rawOffer,
      products: mainProduct,
      free_product: freeProduct,
    };
  }, [rawOffer, listings]);

  // ========== ✅ CALLBACKS ==========
  const getPromoTypeLabel = useCallback((type: string) => {
    const types: Record<string, { label: string; icon: any; color: string; bg: string }> = {
      bogo: { 
        label: app.lang === "ar" ? "🎁 نفس المنتج" : "🎁 Same Product", 
        icon: Gift,
        color: "text-[#1a4f4a]",
        bg: "bg-[#1a4f4a]/10 dark:bg-[#1a4f4a]/20"
      },
      cross_sell: { 
        label: app.lang === "ar" ? "🔄 منتج مختلف" : "🔄 Different Product", 
        icon: Tag,
        color: "text-[#1a4f4a]",
        bg: "bg-[#1a4f4a]/10 dark:bg-[#1a4f4a]/20"
      },
      bundle: { 
        label: app.lang === "ar" ? "📦 باقة منتجات" : "📦 Bundle", 
        icon: Package,
        color: "text-[#1a4f4a]",
        bg: "bg-[#1a4f4a]/10 dark:bg-[#1a4f4a]/20"
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

  // ============================================================
  // ✅ دوال مساعدة لدعم الألوان
  // ============================================================

  const getProductOptions = useCallback((product: any) => {
    if (!product) return { variations: [], colors: [], hasOptions: false };
    
    const variations = product.variations || [];
    const colors = product.colors || product.product_colors || [];
    
    if (variations.length > 0) {
      return { variations, colors: [], hasOptions: true };
    }
    
    if (colors.length > 0) {
      return { variations: [], colors, hasOptions: true };
    }
    
    return { variations: [], colors: [], hasOptions: false };
  }, []);

  const getOptionDisplayName = useCallback((option: any, type: 'variation' | 'color') => {
    if (type === 'variation') {
      const combo = option.combination || {};
      return Object.entries(combo)
        .map(([key, value]) => `${value}`)
        .join(' • ');
    }
    return option.color_name_ar || option.color_name_en || 'لون';
  }, []);

  const getOptionPrice = useCallback((option: any, product: any, type: 'variation' | 'color') => {
    if (type === 'variation') {
      return option.price || product.price || 0;
    }
    return product.price || 0;
  }, []);

  const getOptionImage = useCallback((option: any, type: 'variation' | 'color') => {
    if (type === 'variation') {
      return option.image_url || null;
    }
    return option.image_url || null;
  }, []);

  const mainVariations = useMemo(() => {
    const selectedIds = offer?.variation_ids || [];
    const allVariations = mainProduct?.variations || [];
    
    if (selectedIds.length === 0) {
      return allVariations;
    }
    
    return allVariations.filter((v: any) => selectedIds.includes(v.id));
  }, [mainProduct, offer?.variation_ids]);

  const giftVariations = useMemo(() => {
    const selectedIds = offer?.result_variation_ids || [];
    const allVariations = freeProduct?.variations || [];
    
    if (selectedIds.length === 0) {
      return allVariations;
    }
    
    return allVariations.filter((v: any) => selectedIds.includes(v.id));
  }, [freeProduct, offer?.result_variation_ids]);

  // ============================================================
  // ✅ المنتجات المطلوبة (لـ Bundle) مع دعم الألوان
  // ============================================================
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
      
      const variations = product.variations || [];
      const colors = product.colors || product.product_colors || [];
      
      let options: any[] = [];
      let optionType: 'variation' | 'color' = 'variation';
      
      if (variations.length > 0) {
        options = variations;
        optionType = 'variation';
      } else if (colors.length > 0) {
        options = colors;
        optionType = 'color';
      }
      
      let filteredOptions = options;
      if (selectedVariationIds.length > 0) {
        filteredOptions = options.filter((opt: any) => selectedVariationIds.includes(opt.id));
      }
      
      const selectedMap = selectedVariations[productId] || {};
      const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
      const isComplete = selectedTotal === totalRequiredQuantity;
      const isOver = selectedTotal > totalRequiredQuantity;
      const remaining = Math.max(0, totalRequiredQuantity - selectedTotal);
      
      return {
        product,
        options: filteredOptions,
        optionType: optionType,
        totalRequiredQuantity,
        selectedVariationIds,
        productId,
        selectedMap,
        selectedTotal,
        isComplete,
        isOver,
        remaining,
        hasOptions: filteredOptions.length > 0,
        totalCount: filteredOptions.length,
      };
    }).filter(Boolean);
  }, [offer, listings, selectedVariations]);

  // ============================================================
  // ✅ المنتج الرئيسي مع خياراته (لـ BOGO و Cross-sell) مع دعم الألوان
  // ============================================================
  const mainProductWithVariations = useMemo(() => {
    if (!mainProduct || isBundle) return null;
    
    const productId = mainProduct.id;
    const totalRequiredQuantity = offer?.buy_quantity || 1;
    const selectedMap = selectedVariations[productId] || {};
    const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
    const isComplete = selectedTotal === totalRequiredQuantity;
    const isOver = selectedTotal > totalRequiredQuantity;
    const remaining = Math.max(0, totalRequiredQuantity - selectedTotal);
    
    const variations = mainProduct.variations || [];
    const colors = mainProduct.colors || mainProduct.product_colors || [];
    
    let options: any[] = [];
    let optionType: 'variation' | 'color' = 'variation';
    
    if (variations.length > 0) {
      options = variations;
      optionType = 'variation';
    } else if (colors.length > 0) {
      options = colors;
      optionType = 'color';
    }
    
    return {
      product: mainProduct,
      options: options,
      optionType: optionType,
      totalRequiredQuantity: totalRequiredQuantity,
      productId: productId,
      selectedMap: selectedMap,
      selectedTotal: selectedTotal,
      isComplete: isComplete,
      isOver: isOver,
      remaining: remaining,
      hasOptions: options.length > 0,
      totalCount: options.length,
      isMainProduct: true,
    };
  }, [mainProduct, offer?.buy_quantity, selectedVariations, isBundle]);

  // ============================================================
  // ✅ دالة مساعدة لجلب صورة الخيار من قاعدة البيانات
  // ============================================================
  const getVariationImage = useCallback((product: any, variationId: string): string | null => {
    if (!product) return null;
    
    const variation = product.variations?.find((v: any) => v.id === variationId);
    if (variation?.image_url) {
      return variation.image_url;
    }
    
    if (variation?.color_id) {
      const color = product.colors?.find((c: any) => c.id === variation.color_id);
      if (color?.image_url) {
        return color.image_url;
      }
    }
    
    const color = product.colors?.find((c: any) => c.id === variationId);
    if (color?.image_url) {
      return color.image_url;
    }
    
    if (variation?.combination) {
      const combo = variation.combination || {};
      const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
      for (const key of colorKeys) {
        if (combo[key]) {
          const colorValue = String(combo[key]).trim();
          const foundColor = product.colors?.find((c: any) => 
            String(c.color_name_ar || "").trim().toLowerCase() === colorValue.toLowerCase()
          );
          if (foundColor?.image_url) {
            return foundColor.image_url;
          }
        }
      }
    }
    
    return product.cover_url || null;
  }, []);

  // ============================================================
  // ✅✅✅ مصفوفة صور العرض
  // ============================================================
  const offerImages = useMemo(() => {
    const images: Array<{ 
      url: string; 
      title: string; 
      type: 'main' | 'free' | 'required' | 'variation' | 'color' | 'gift_variation' | 'gift_color';
      variationId?: string;
      colorId?: string;
      productId?: string;
      isGift?: boolean;
      isRequired?: boolean;
      displayName?: string;
    }> = [];
    
    const addImage = (url: string, title: string, type: any, extra?: any) => {
      if (!url) return;
      const exists = images.some(img => img.url === url);
      if (!exists) {
        images.push({ url, title, type, ...extra });
      }
    };
    
    // ✅ 1. المنتج الرئيسي + خياراته + ألوانه
    if (mainProduct) {
      addImage(
        mainProduct.cover_url, 
        mainProduct.title_ar || 'المنتج الرئيسي', 
        'main',
        { productId: mainProduct.id, displayName: mainProduct.title_ar || 'المنتج الرئيسي' }
      );
      
      const selectedIds = offer?.variation_ids || [];
      const allVariations = mainProduct.variations || [];
      const mainVariations = selectedIds.length > 0 
        ? allVariations.filter((v: any) => selectedIds.includes(v.id))
        : allVariations;
      
      mainVariations.forEach((v: any) => {
        let imageUrl = v.image_url || null;
        let displayName = '';
        
        if (!imageUrl && v.color_id) {
          const color = mainProduct.colors?.find((c: any) => c.id === v.color_id);
          if (color?.image_url) {
            imageUrl = color.image_url;
            displayName = color.color_name_ar || '';
          }
        }
        
        if (!imageUrl) {
          const combo = v.combination || {};
          const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
          for (const key of colorKeys) {
            if (combo[key]) {
              const colorValue = String(combo[key]).trim();
              const color = mainProduct.colors?.find((c: any) => 
                String(c.color_name_ar || "").trim().toLowerCase() === colorValue.toLowerCase()
              );
              if (color?.image_url) {
                imageUrl = color.image_url;
                displayName = color.color_name_ar || colorValue;
                break;
              }
              displayName = colorValue;
            }
          }
        }
        
        if (!imageUrl) {
          imageUrl = mainProduct.cover_url;
        }
        
        const comboText = Object.entries(v.combination || {})
          .map(([key, val]) => `${val}`)
          .join(' • ');
        
        addImage(
          imageUrl,
          `${mainProduct.title_ar || 'منتج'} - ${comboText || 'خيار'}`,
          'variation',
          { 
            variationId: v.id, 
            productId: mainProduct.id, 
            displayName: comboText || displayName || 'خيار' 
          }
        );
      });
      
      const colors = mainProduct.colors || mainProduct.product_colors || [];
      colors.forEach((c: any) => {
        if (c.image_url) {
          addImage(
            c.image_url,
            `${mainProduct.title_ar || 'منتج'} - ${c.color_name_ar || 'لون'}`,
            'color',
            { colorId: c.id, productId: mainProduct.id, displayName: c.color_name_ar || 'لون' }
          );
        }
      });
    }
    
    // ✅ 2. الهدية + خياراتها + ألوانها
    if (freeProduct) {
      addImage(
        freeProduct.cover_url,
        freeProduct.title_ar || 'الهدية',
        'free',
        { productId: freeProduct.id, isGift: true, displayName: freeProduct.title_ar || 'الهدية' }
      );
      
      const giftSelectedIds = offer?.result_variation_ids || [];
      const allGiftVariations = freeProduct.variations || [];
      const giftVariations = giftSelectedIds.length > 0 
        ? allGiftVariations.filter((v: any) => giftSelectedIds.includes(v.id))
        : allGiftVariations;
      
      giftVariations.forEach((v: any) => {
        let imageUrl = v.image_url || null;
        let displayName = '';
        
        if (!imageUrl && v.color_id) {
          const color = freeProduct.colors?.find((c: any) => c.id === v.color_id);
          if (color?.image_url) {
            imageUrl = color.image_url;
            displayName = color.color_name_ar || '';
          }
        }
        
        if (!imageUrl) {
          const combo = v.combination || {};
          const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
          for (const key of colorKeys) {
            if (combo[key]) {
              const colorValue = String(combo[key]).trim();
              const color = freeProduct.colors?.find((c: any) => 
                String(c.color_name_ar || "").trim().toLowerCase() === colorValue.toLowerCase()
              );
              if (color?.image_url) {
                imageUrl = color.image_url;
                displayName = color.color_name_ar || colorValue;
                break;
              }
              displayName = colorValue;
            }
          }
        }
        
        if (!imageUrl) {
          imageUrl = freeProduct.cover_url;
        }
        
        const comboText = Object.entries(v.combination || {})
          .map(([key, val]) => `${val}`)
          .join(' • ');
        
        addImage(
          imageUrl,
          `${freeProduct.title_ar || 'هدية'} - ${comboText || 'خيار'}`,
          'gift_variation',
          { 
            variationId: v.id, 
            productId: freeProduct.id, 
            isGift: true, 
            displayName: comboText || displayName || 'خيار' 
          }
        );
      });
      
      const giftColors = freeProduct.colors || freeProduct.product_colors || [];
      giftColors.forEach((c: any) => {
        if (c.image_url) {
          addImage(
            c.image_url,
            `${freeProduct.title_ar || 'هدية'} - ${c.color_name_ar || 'لون'}`,
            'gift_color',
            { colorId: c.id, productId: freeProduct.id, isGift: true, displayName: c.color_name_ar || 'لون' }
          );
        }
      });
    }
    
    // ✅ 3. المنتجات المطلوبة (Bundle) + خياراتها + ألوانها
    if (isBundle) {
      requiredProducts.forEach((req: any) => {
        const product = req.product;
        if (!product) return;
        
        addImage(
          product.cover_url,
          product.title_ar || 'منتج مطلوب',
          'required',
          { productId: product.id, isRequired: true, displayName: product.title_ar || 'منتج مطلوب' }
        );
        
        const reqVariationIds = req.selectedVariationIds || [];
        const allVariations = product.variations || [];
        const variations = reqVariationIds.length > 0 
          ? allVariations.filter((v: any) => reqVariationIds.includes(v.id))
          : allVariations;
        
        variations.forEach((v: any) => {
          let imageUrl = v.image_url || null;
          let displayName = '';
          
          if (!imageUrl && v.color_id) {
            const color = product.colors?.find((c: any) => c.id === v.color_id);
            if (color?.image_url) {
              imageUrl = color.image_url;
              displayName = color.color_name_ar || '';
            }
          }
          
          if (!imageUrl) {
            const combo = v.combination || {};
            const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
            for (const key of colorKeys) {
              if (combo[key]) {
                const colorValue = String(combo[key]).trim();
                const color = product.colors?.find((c: any) => 
                  String(c.color_name_ar || "").trim().toLowerCase() === colorValue.toLowerCase()
                );
                if (color?.image_url) {
                  imageUrl = color.image_url;
                  displayName = color.color_name_ar || colorValue;
                  break;
                }
                displayName = colorValue;
              }
            }
          }
          
          if (!imageUrl) {
            imageUrl = product.cover_url;
          }
          
          const comboText = Object.entries(v.combination || {})
            .map(([key, val]) => `${val}`)
            .join(' • ');
          
          addImage(
            imageUrl,
            `${product.title_ar || 'منتج'} - ${comboText || 'خيار'}`,
            'variation',
            { 
              variationId: v.id, 
              productId: product.id, 
              isRequired: true, 
              displayName: comboText || displayName || 'خيار' 
            }
          );
        });
        
        const colors = product.colors || product.product_colors || [];
        colors.forEach((c: any) => {
          if (c.image_url) {
            addImage(
              c.image_url,
              `${product.title_ar || 'منتج'} - ${c.color_name_ar || 'لون'}`,
              'color',
              { colorId: c.id, productId: product.id, isRequired: true, displayName: c.color_name_ar || 'لون' }
            );
          }
        });
      });
    }
    
    return images;
  }, [mainProduct, freeProduct, requiredProducts, isBundle, offer?.variation_ids, offer?.result_variation_ids]);

  // ============================================================
  // ✅✅✅ دالة موحدة لتغيير الصورة
  // ============================================================
  const changeImage = useCallback((index: number) => {
    if (isImageUpdatingRef.current) return;
    if (index < 0 || index >= offerImages.length) return;
    
    const image = offerImages[index];
    if (!image?.url) return;
    
    if (mainImage === image.url) return;
    
    isImageUpdatingRef.current = true;
    
    if (imageUpdateTimeoutRef.current) {
      clearTimeout(imageUpdateTimeoutRef.current);
      imageUpdateTimeoutRef.current = null;
    }
    
    setMainImage(image.url);
    setCurrentImageIndex(index);
    
    if (image.variationId) {
      setSelectedOptionId(image.variationId);
      setIsVariationSelectedFlag(true);
    } else if (image.colorId) {
      setSelectedOptionId(image.colorId);
      setIsVariationSelectedFlag(true);
    } else {
      setIsVariationSelectedFlag(false);
    }
    
    imageUpdateTimeoutRef.current = setTimeout(() => {
      isImageUpdatingRef.current = false;
      imageUpdateTimeoutRef.current = null;
    }, 300);
  }, [offerImages, mainImage]);

  // ✅ حساب السعر النهائي
  const finalPrice = useMemo(() => {
    if (!offer) return 0;
    
    if (offer.offer_type === 'bogo' || offer.offer_type === 'cross_sell') {
      if (!mainProduct) return 0;
      
      const productId = mainProduct.id;
      const selectedMap = selectedVariations[productId] || {};
      const selectedVariationIds = Object.keys(selectedMap).filter(id => selectedMap[id] > 0);
      
      const defaultKey = `default-${productId}`;
      if (selectedMap[defaultKey] > 0) {
        return mainProduct.price * selectedMap[defaultKey] * quantity;
      }
      
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
          return avgPrice * quantity;
        }
      }
      
      return mainProduct.price * quantity;
    }
    
    if (offer.offer_type === 'bundle') {
      let total = 0;
      let totalQty = 0;
      
      for (const req of requiredProducts) {
        const product = req.product;
        const selectedMap = selectedVariations[product.id] || {};
        
        const defaultKey = `default-${product.id}`;
        if (selectedMap[defaultKey] > 0) {
          total += product.price * selectedMap[defaultKey];
          totalQty += selectedMap[defaultKey];
          continue;
        }
        
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

  // ✅ إحصائيات تقدم المنتجات المطلوبة
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
      !item.hasOptions || item.isComplete
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
        item.hasOptions && !item.isComplete && !item.isOver
      ).length;
    }
    if (isBogo || isCrossSell) {
      if (!mainProductWithVariations) return 0;
      return mainProductWithVariations.hasOptions && !mainProductWithVariations.isComplete && !mainProductWithVariations.isOver ? 1 : 0;
    }
    return 0;
  }, [isBundle, isBogo, isCrossSell, requiredProducts, mainProductWithVariations]);

  // ============================================================
  // ✅ التحقق من اختيار الخيارات
  // ============================================================
  const isVariationSelected = useMemo(() => {
    if (!offer) return false;
    
    const checkProductComplete = (productId: string, requiredQty: number, options: any[]) => {
      const selectedMap = selectedVariations[productId] || {};
      
      if (options.length === 0) {
        const defaultKey = `default-${productId}`;
        return (selectedMap[defaultKey] || 0) >= requiredQty;
      }
      
      const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
      return selectedTotal >= requiredQty;
    };
    
    if (offer.offer_type === 'bogo') {
      const mainComplete = mainProductWithVariations 
        ? checkProductComplete(
            mainProductWithVariations.productId, 
            mainProductWithVariations.totalRequiredQuantity, 
            mainProductWithVariations.options
          )
        : false;
      const giftComplete = giftStats.isComplete && !giftStats.isOver;
      return mainComplete && giftComplete;
    }
    
    if (offer.offer_type === 'cross_sell') {
      const mainComplete = mainProductWithVariations 
        ? checkProductComplete(
            mainProductWithVariations.productId, 
            mainProductWithVariations.totalRequiredQuantity, 
            mainProductWithVariations.options
          )
        : false;
      const giftComplete = giftStats.isComplete && !giftStats.isOver;
      return mainComplete && giftComplete;
    }
    
    if (offer.offer_type === 'bundle') {
      const productsComplete = requiredProducts.every((item: any) => 
        checkProductComplete(item.productId, item.totalRequiredQuantity, item.options)
      );
      const giftComplete = giftStats.isComplete && !giftStats.isOver;
      return productsComplete && giftComplete;
    }
    
    return true;
  }, [offer, selectionStats, giftStats, mainProductWithVariations, requiredProducts, selectedVariations]);

  // ============================================================
  // ✅ ترتيب "قد تعجبك" - العروض أولاً + 4 فقط
  // ============================================================
  const sortedSimilarListings = useMemo(() => {
    if (!similarListings || similarListings.length === 0) return [];
    
    return [...similarListings]
      .sort((a: any, b: any) => {
        const getPriority = (item: any) => {
          // ✅ 1. عرض ترويجي (BOGO / Bundle / Cross-sell)
          if (item.has_promo_offer === true || item.has_promo_offer === "true") return 0;
          // ✅ 2. عرض تخفيضي
          if (item.is_offer === true || (item.discount_percent && item.discount_percent > 0)) return 1;
          // ✅ 3. منتج عادي
          return 2;
        };
        return getPriority(a) - getPriority(b);
      })
      .slice(0, 4);
  }, [similarListings]);

  // ============================================================
  // ✅ الأكثر مبيعاً - 8 منتجات
  // ============================================================
  const bestSellingListings = useMemo(() => {
    if (!trendingListings || trendingListings.length === 0) return [];
    
    // ✅ استبعاد المنتج الرئيسي للعرض
    return trendingListings
      .filter((item: any) => item.id !== mainProductId)
      .slice(0, 8);
  }, [trendingListings.length, mainProductId]);

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
    if (offerImages.length > 0) {
      setMainImage(offerImages[0].url);
      setCurrentImageIndex(0);
    } else if (mainProduct?.cover_url) {
      setMainImage(mainProduct.cover_url);
    }
  }, [offerImages, mainProduct]);

  // ============================================================
  // ✅✅✅ تغيير الصورة الرئيسية عند اختيار خيار
  // ============================================================
  useEffect(() => {
    if (!mainProduct) return;
    
    if (isImageUpdatingRef.current) return;
    
    const productId = mainProduct.id;
    const selectedMap = selectedVariations[productId] || {};
    const selectedVariationIds = Object.keys(selectedMap).filter(id => selectedMap[id] > 0);
    
    if (selectedVariationIds.length === 0) {
      setIsVariationSelectedFlag(false);
      const currentImageExists = offerImages.some(img => img.url === mainImage);
      if (offerImages.length > 0 && !currentImageExists) {
        const imageIndex = currentImageIndex % offerImages.length;
        setMainImage(offerImages[imageIndex].url);
      }
      return;
    }
    
    setIsVariationSelectedFlag(true);
    
    let targetId = selectedOptionId;
    if (!targetId || !selectedVariationIds.includes(targetId)) {
      targetId = selectedVariationIds[selectedVariationIds.length - 1];
    }
    
    if (!targetId) {
      targetId = selectedVariationIds[0];
    }
    
    if (targetId.startsWith('default-')) {
      if (mainProduct.cover_url && mainImage !== mainProduct.cover_url) {
        setMainImage(mainProduct.cover_url);
      }
      return;
    }
    
    const isGiftSelection = targetId.startsWith('gift-');
    const cleanTargetId = isGiftSelection ? targetId.replace('gift-', '') : targetId;
    
    const matchingImage = offerImages.find(img => {
      if (isGiftSelection) {
        return (img.variationId === cleanTargetId || img.colorId === cleanTargetId) && img.isGift === true;
      }
      return img.variationId === cleanTargetId || img.colorId === cleanTargetId;
    });
    
    if (matchingImage?.url && mainImage !== matchingImage.url) {
      setMainImage(matchingImage.url);
      const index = offerImages.findIndex(img => img.url === matchingImage.url);
      if (index >= 0 && index !== currentImageIndex) {
        setCurrentImageIndex(index);
      }
      return;
    }
    
    const imageUrl = getVariationImage(mainProduct, cleanTargetId);
    if (imageUrl && mainImage !== imageUrl) {
      setMainImage(imageUrl);
      const index = offerImages.findIndex(img => img.url === imageUrl);
      if (index >= 0 && index !== currentImageIndex) {
        setCurrentImageIndex(index);
      }
      return;
    }
    
    if (mainProduct.cover_url && mainImage !== mainProduct.cover_url) {
      setMainImage(mainProduct.cover_url);
    }
  }, [selectedVariations, mainProduct, selectedOptionId, offerImages, currentImageIndex, getVariationImage]);

  // ============================================================
  // ✅ اختيار تلقائي للخيارات (لـ Bundle)
  // ============================================================
  useEffect(() => {
    if (isBundle && requiredProducts.length > 0) {
      requiredProducts.forEach((item: any) => {
        const selectedMap = selectedVariations[item.productId] || {};
        const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
        
        const filteredOptions = item.options || [];
        
        if (filteredOptions.length === 0) {
          setSelectedVariations(prev => ({
            ...prev,
            [item.productId]: {
              [`default-${item.productId}`]: item.totalRequiredQuantity
            }
          }));
          return;
        }
        
        if (filteredOptions.length === 1 && selectedTotal === 0) {
          setSelectedVariations(prev => ({
            ...prev,
            [item.productId]: {
              [filteredOptions[0].id]: item.totalRequiredQuantity
            }
          }));
          return;
        }
        
        if (filteredOptions.length > 1 && selectedTotal === 0) {
          const perOption = Math.floor(item.totalRequiredQuantity / filteredOptions.length);
          const remainder = item.totalRequiredQuantity % filteredOptions.length;
          const map: Record<string, number> = {};
          filteredOptions.forEach((opt: any, index: number) => {
            map[opt.id] = perOption + (index < remainder ? 1 : 0);
          });
          setSelectedVariations(prev => ({
            ...prev,
            [item.productId]: map
          }));
        }
      });
    }
  }, [requiredProducts, isBundle]);

  // ============================================================
  // ✅ اختيار تلقائي للخيارات (لـ BOGO و Cross-sell)
  // ============================================================
  useEffect(() => {
    if ((isBogo || isCrossSell) && mainProductWithVariations) {
      const item = mainProductWithVariations;
      const selectedMap = selectedVariations[item.productId] || {};
      const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
      
      const selectedIds = offer?.variation_ids || [];
      const allVariations = item.product.variations || [];
      const filteredOptions = selectedIds.length > 0 
        ? allVariations.filter((v: any) => selectedIds.includes(v.id))
        : allVariations;
      
      if (filteredOptions.length === 0) {
        setSelectedVariations(prev => ({
          ...prev,
          [item.productId]: {
            [`default-${item.productId}`]: item.totalRequiredQuantity
          }
        }));
        return;
      }
      
      if (filteredOptions.length === 1 && selectedTotal === 0) {
        setSelectedVariations(prev => ({
          ...prev,
          [item.productId]: {
            [filteredOptions[0].id]: item.totalRequiredQuantity
          }
        }));
        return;
      }
      
      if (filteredOptions.length > 1 && selectedTotal === 0) {
        const perOption = Math.floor(item.totalRequiredQuantity / filteredOptions.length);
        const remainder = item.totalRequiredQuantity % filteredOptions.length;
        const map: Record<string, number> = {};
        filteredOptions.forEach((opt: any, index: number) => {
          map[opt.id] = perOption + (index < remainder ? 1 : 0);
        });
        setSelectedVariations(prev => ({
          ...prev,
          [item.productId]: map
        }));
      }
    }
  }, [isBogo, isCrossSell, mainProductWithVariations, offer?.variation_ids]);

  // ============================================================
  // ✅ اختيار تلقائي لخيارات الهدية
  // ============================================================
  useEffect(() => {
    if (!freeProduct || !offer) return;
    
    const giftVariationIds = offer?.result_variation_ids || [];
    const totalGiftQty = offer?.get_quantity || 1;
    const variationQuantities = offer?.metadata?.variation_quantities || {};
    
    const variations = freeProduct.variations || [];
    const colors = freeProduct.colors || freeProduct.product_colors || [];
    
    let availableOptions: any[] = [];
    let optionType: 'variation' | 'color' = 'variation';
    
    if (giftVariationIds.length > 0) {
      const filteredVariations = variations.filter((v: any) => giftVariationIds.includes(v.id));
      if (filteredVariations.length > 0) {
        availableOptions = filteredVariations;
        optionType = 'variation';
      } else {
        const filteredColors = colors.filter((c: any) => giftVariationIds.includes(c.id));
        if (filteredColors.length > 0) {
          availableOptions = filteredColors;
          optionType = 'color';
        }
      }
    }
    
    if (availableOptions.length === 0) {
      if (variations.length > 0) {
        availableOptions = variations;
        optionType = 'variation';
      } else if (colors.length > 0) {
        availableOptions = colors;
        optionType = 'color';
      }
    }
    
    if (availableOptions.length === 0) {
      setSelectedGiftVariations(prev => ({
        ...prev,
        [`default-gift`]: totalGiftQty
      }));
      return;
    }
    
    const currentMap = selectedGiftVariations || {};
    const currentTotal = Object.values(currentMap).reduce((sum, qty) => sum + qty, 0);
    
    if (currentTotal === 0) {
      if (Object.keys(variationQuantities).length > 0) {
        const validQuantities: Record<string, number> = {};
        availableOptions.forEach((opt: any) => {
          if (variationQuantities[opt.id] !== undefined && variationQuantities[opt.id] > 0) {
            validQuantities[opt.id] = variationQuantities[opt.id];
          }
        });
        if (Object.keys(validQuantities).length > 0) {
          setSelectedGiftVariations(validQuantities);
          return;
        }
      }
      
      const perOption = Math.floor(totalGiftQty / availableOptions.length);
      const remainder = totalGiftQty % availableOptions.length;
      const map: Record<string, number> = {};
      availableOptions.forEach((opt: any, index: number) => {
        map[opt.id] = perOption + (index < remainder ? 1 : 0);
      });
      setSelectedGiftVariations(map);
    }
  }, [offer, freeProduct, selectedGiftVariations]);

  // ========== ✅ HANDLERS ==========
  
  const handleVariationQuantityChange = useCallback((productId: string, variationId: string, delta: number, updateImage: boolean = true) => {
    if (updateImage) {
      const matchingImage = offerImages.find(img => 
        img.variationId === variationId || img.colorId === variationId
      );
      
      if (matchingImage?.url && mainImage !== matchingImage.url) {
        const index = offerImages.findIndex(img => img.url === matchingImage.url);
        if (index >= 0) {
          changeImage(index);
        } else {
          setMainImage(matchingImage.url);
          setSelectedOptionId(variationId);
          setIsVariationSelectedFlag(true);
        }
      } else if (!matchingImage) {
        const product = productId === mainProduct?.id ? mainProduct : 
                       requiredProducts.find((r: any) => r.productId === productId)?.product;
        if (product?.cover_url && mainImage !== product.cover_url) {
          setMainImage(product.cover_url);
        }
        setSelectedOptionId(variationId);
        setIsVariationSelectedFlag(true);
      } else {
        setSelectedOptionId(variationId);
        setIsVariationSelectedFlag(true);
      }
    }
    
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
    
    if (updateImage) {
      setSelectedOptionId(variationId);
    }
  }, [offerImages, mainImage, changeImage, mainProduct, requiredProducts]);

  const handleGiftVariationQuantityChange = useCallback((variationId: string, delta: number, updateImage: boolean = true) => {
    if (updateImage) {
      const matchingImage = offerImages.find(img => 
        (img.variationId === variationId || img.colorId === variationId) && img.isGift === true
      );
      
      if (matchingImage?.url && mainImage !== matchingImage.url) {
        const index = offerImages.findIndex(img => img.url === matchingImage.url);
        if (index >= 0) {
          changeImage(index);
        } else {
          setMainImage(matchingImage.url);
          setSelectedOptionId(`gift-${variationId}`);
          setIsVariationSelectedFlag(true);
        }
      } else if (!matchingImage) {
        if (freeProduct?.cover_url && mainImage !== freeProduct.cover_url) {
          setMainImage(freeProduct.cover_url);
        }
        setSelectedOptionId(`gift-${variationId}`);
        setIsVariationSelectedFlag(true);
      } else {
        setSelectedOptionId(`gift-${variationId}`);
        setIsVariationSelectedFlag(true);
      }
    }
    
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
  }, [offerImages, mainImage, changeImage, freeProduct]);

  const handleRequiredVariationSelect = useCallback((productId: string, variationId: string) => {
    const matchingImage = offerImages.find(img => 
      img.variationId === variationId || img.colorId === variationId
    );
    
    if (matchingImage?.url && mainImage !== matchingImage.url) {
      const index = offerImages.findIndex(img => img.url === matchingImage.url);
      if (index >= 0) {
        changeImage(index);
      } else {
        setMainImage(matchingImage.url);
        setSelectedOptionId(variationId);
        setIsVariationSelectedFlag(true);
      }
    } else if (matchingImage?.url) {
      setSelectedOptionId(variationId);
      setIsVariationSelectedFlag(true);
    } else {
      const product = productId === mainProduct?.id ? mainProduct : 
                     requiredProducts.find((r: any) => r.productId === productId)?.product;
      if (product?.cover_url && mainImage !== product.cover_url) {
        setMainImage(product.cover_url);
      }
      setSelectedOptionId(variationId);
      setIsVariationSelectedFlag(true);
    }
  }, [offerImages, mainImage, changeImage, mainProduct, requiredProducts]);

  const handleGiftVariationSelect = useCallback((variationId: string) => {
    const matchingImage = offerImages.find(img => 
      (img.variationId === variationId || img.colorId === variationId) && img.isGift === true
    );
    
    if (matchingImage?.url && mainImage !== matchingImage.url) {
      const index = offerImages.findIndex(img => img.url === matchingImage.url);
      if (index >= 0) {
        changeImage(index);
      } else {
        setMainImage(matchingImage.url);
        setSelectedOptionId(`gift-${variationId}`);
        setIsVariationSelectedFlag(true);
      }
    } else if (matchingImage?.url) {
      setSelectedOptionId(`gift-${variationId}`);
      setIsVariationSelectedFlag(true);
    } else {
      if (freeProduct?.cover_url && mainImage !== freeProduct.cover_url) {
        setMainImage(freeProduct.cover_url);
      }
      setSelectedOptionId(`gift-${variationId}`);
      setIsVariationSelectedFlag(true);
    }
  }, [offerImages, mainImage, changeImage, freeProduct]);

  const autoDistributeRemaining = useCallback((productId: string, options: any[], totalRequired: number) => {
    const currentMap = selectedVariations[productId] || {};
    const currentTotal = Object.values(currentMap).reduce((sum, qty) => sum + qty, 0);
    const remaining = totalRequired - currentTotal;
    
    if (remaining <= 0) return;
    
    const availableOptions = options.filter((opt: any) => !currentMap[opt.id] || currentMap[opt.id] > 0);
    if (availableOptions.length === 0) return;
    
    const perOption = Math.floor(remaining / availableOptions.length);
    const remainder = remaining % availableOptions.length;
    
    setSelectedVariations(prev => {
      const newMap = { ...(prev[productId] || {}) };
      availableOptions.forEach((opt: any, index: number) => {
        newMap[opt.id] = (newMap[opt.id] || 0) + perOption + (index < remainder ? 1 : 0);
      });
      return { ...prev, [productId]: newMap };
    });
  }, [selectedVariations]);

  const autoDistributeGiftRemaining = useCallback((options: any[], totalQty: number) => {
    const currentMap = selectedGiftVariations || {};
    const currentTotal = Object.values(currentMap).reduce((sum, qty) => sum + qty, 0);
    const remaining = totalQty - currentTotal;
    
    if (remaining <= 0) return;
    
    const availableOptions = options.filter((opt: any) => !currentMap[opt.id] || currentMap[opt.id] > 0);
    if (availableOptions.length === 0) return;
    
    const perOption = Math.floor(remaining / availableOptions.length);
    const remainder = remaining % availableOptions.length;
    
    setSelectedGiftVariations(prev => {
      const newMap = { ...prev };
      availableOptions.forEach((opt: any, index: number) => {
        newMap[opt.id] = (newMap[opt.id] || 0) + perOption + (index < remainder ? 1 : 0);
      });
      return newMap;
    });
  }, [selectedGiftVariations]);

  const getOptionImageUrl = useCallback((
    option: any,
    product: any,
    type: 'variation' | 'color'
  ): string | null => {
    let image = null;
    
    if (type === 'variation') {
      if (option?.image_url) {
        image = option.image_url;
      }
      if (!image && option?.color_id && product?.colors?.length > 0) {
        const color = product.colors.find((c: any) => c.id === option.color_id);
        if (color?.image_url) {
          image = color.image_url;
        }
      }
      if (!image) {
        const combo = option?.combination || {};
        const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
        let colorValue = null;
        for (const key of colorKeys) {
          if (combo[key]) {
            colorValue = combo[key];
            break;
          }
        }
        if (colorValue && product?.colors?.length > 0) {
          const color = product.colors.find((c: any) => 
            String(c.color_name_ar || "").trim().toLowerCase() === String(colorValue).trim().toLowerCase()
          );
          if (color?.image_url) {
            image = color.image_url;
          }
        }
      }
    } else {
      if (option?.image_url) {
        image = option.image_url;
      }
    }
    
    if (!image) {
      image = product?.cover_url || null;
    }
    
    return image;
  }, []);

  // ============================================================
  // ✅✅✅ دالة إضافة العرض للسلة
  // ============================================================
  const handleAddToCart = useCallback(async () => {
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

    if (selectionStats.hasOver) {
      toast.error(
        app.lang === "ar" 
          ? `⚠️ الكمية المختارة (${totalSelectedQuantity}) تتجاوز المطلوب (${totalRequiredQuantity})`
          : `⚠️ Selected quantity (${totalSelectedQuantity}) exceeds required (${totalRequiredQuantity})`
      );
      return;
    }

    if (giftStats.isOver) {
      toast.error(
        app.lang === "ar" 
          ? `⚠️ كمية الهدية المختارة (${giftStats.selected}) تتجاوز المسموح (${giftStats.total})`
          : `⚠️ Gift quantity (${giftStats.selected}) exceeds allowed (${giftStats.total})`
      );
      return;
    }

    if (!selectionStats.allComplete) {
      const remaining = totalRequiredQuantity - totalSelectedQuantity;
      toast.warning(
        app.lang === "ar" 
          ? `⚠️ متبقي ${remaining} منتج${remaining > 1 ? 'ات' : ''} لاستكمال الكميات`
          : `⚠️ ${remaining} product${remaining > 1 ? 's' : ''} remaining to complete quantities`
      );
      return;
    }

    if (offer?.result_variation_ids?.length > 0 && !giftStats.isComplete) {
      const remaining = giftStats.total - giftStats.selected;
      toast.warning(
        app.lang === "ar" 
          ? `⚠️ متبقي ${remaining} من الهدية لاستكمال الكميات`
          : `⚠️ ${remaining} remaining from gift to complete quantities`
      );
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

    // ============================================================
    // ✅ 1. جمع الخيارات
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

    if (isBogo || isCrossSell) {
      const productId = mainProduct?.id;
      if (productId) {
        mainListingId = productId;
        mainProductTitle = mainProduct?.title_ar || "";
        const selectedMap = selectedVariations[productId] || {};
        
        const defaultKey = `default-${productId}`;
        if (selectedMap[defaultKey] > 0) {
          requiredVariationsDetails[defaultKey] = {
            quantity: selectedMap[defaultKey],
            price: mainProduct?.price || 0,
            combination: {},
            image_url: mainProduct?.cover_url || null,
            product_id: productId,
            product_title: mainProductTitle,
          };
        }
        
        const variations = mainProduct?.variations || [];
        const colors = mainProduct?.colors || mainProduct?.product_colors || [];
        
        for (const [optionId, qty] of Object.entries(selectedMap)) {
          if (qty > 0 && !optionId.startsWith('default-')) {
            let option: any = variations.find((v: any) => v.id === optionId);
            let optionType: 'variation' | 'color' = 'variation';
            let combo = {};
            
            if (option) {
              combo = option.combination || {};
            } else {
              option = colors.find((c: any) => c.id === optionId);
              optionType = 'color';
              if (option) {
                combo = { colors: option.color_name_ar };
              }
            }
            
            if (option) {
              const comboText = Object.entries(combo).map(([key, val]) => `${val}`).join(' • ');
              const price = optionType === 'variation' 
                ? (option.price || mainProduct?.price || 0)
                : (mainProduct?.price || 0);
              const image = getOptionImageUrl(option, mainProduct, optionType);
              
              requiredVariationsDetails[optionId] = {
                quantity: qty,
                price: price,
                combination: combo,
                image_url: image,
                product_id: productId,
                product_title: mainProductTitle,
              };
            }
          }
        }
      }
    }

    if (isBundle) {
      for (const req of requiredProducts) {
        const productId = req.productId;
        if (!mainListingId) mainListingId = productId;
        mainProductTitle = req.product.title_ar || "";
        const selectedMap = selectedVariations[productId] || {};
        
        const defaultKey = `default-${productId}`;
        if (selectedMap[defaultKey] > 0) {
          requiredVariationsDetails[defaultKey] = {
            quantity: selectedMap[defaultKey],
            price: req.product.price || 0,
            combination: {},
            image_url: req.product.cover_url || null,
            product_id: productId,
            product_title: req.product.title_ar || "",
          };
        }
        
        const variations = req.product.variations || [];
        const colors = req.product.colors || req.product.product_colors || [];
        
        for (const [optionId, qty] of Object.entries(selectedMap)) {
          if (qty > 0 && !optionId.startsWith('default-')) {
            let option: any = variations.find((v: any) => v.id === optionId);
            let optionType: 'variation' | 'color' = 'variation';
            let combo = {};
            
            if (option) {
              combo = option.combination || {};
            } else {
              option = colors.find((c: any) => c.id === optionId);
              optionType = 'color';
              if (option) {
                combo = { colors: option.color_name_ar };
              }
            }
            
            if (option) {
              const comboText = Object.entries(combo).map(([key, val]) => `${val}`).join(' • ');
              const price = optionType === 'variation' 
                ? (option.price || req.product.price || 0)
                : (req.product.price || 0);
              const image = getOptionImageUrl(option, req.product, optionType);
              
              requiredVariationsDetails[optionId] = {
                quantity: qty,
                price: price,
                combination: combo,
                image_url: image,
                product_id: productId,
                product_title: req.product.title_ar || "",
              };
            }
          }
        }
      }
    }

    // ============================================================
    // ✅ 2. خيارات الهدية
    // ============================================================
    const giftVariationsDetails: Record<string, {
      quantity: number;
      price: number;
      combination: Record<string, string>;
      image_url?: string | null;
    }> = {};

    const giftVariationIds = offer?.result_variation_ids || [];
    const variations = freeProduct?.variations || [];
    const colors = freeProduct?.colors || freeProduct?.product_colors || [];
    
    let availableGiftOptions: any[] = [];
    let giftOptionType: 'variation' | 'color' = 'variation';
    
    if (giftVariationIds.length > 0) {
      const filteredVariations = variations.filter((v: any) => giftVariationIds.includes(v.id));
      if (filteredVariations.length > 0) {
        availableGiftOptions = filteredVariations;
        giftOptionType = 'variation';
      } else {
        const filteredColors = colors.filter((c: any) => giftVariationIds.includes(c.id));
        if (filteredColors.length > 0) {
          availableGiftOptions = filteredColors;
          giftOptionType = 'color';
        }
      }
    }
    
    if (availableGiftOptions.length === 0) {
      if (variations.length > 0) {
        availableGiftOptions = variations;
        giftOptionType = 'variation';
      } else if (colors.length > 0) {
        availableGiftOptions = colors;
        giftOptionType = 'color';
      }
    }
    
    if (availableGiftOptions.length === 0) {
      const defaultGiftQty = offer?.get_quantity || 1;
      giftVariationsDetails[`default-gift`] = {
        quantity: defaultGiftQty,
        price: 0,
        combination: {},
        image_url: freeProduct?.cover_url || null,
      };
    } else {
      const userSelectedGifts = selectedGiftVariations || {};
      
      availableGiftOptions.forEach((opt: any) => {
        const qty = userSelectedGifts[opt.id] || 0;
        
        if (qty > 0) {
          const isColor = giftOptionType === 'color';
          const displayName = isColor 
            ? opt.color_name_ar || opt.color_name_en || 'لون'
            : Object.entries(opt.combination || {})
                .map(([key, value]) => `${value}`)
                .join(' • ');
          const giftImage = getOptionImageUrl(opt, freeProduct, giftOptionType);
          
          giftVariationsDetails[opt.id] = {
            quantity: qty,
            price: 0,
            combination: isColor ? { colors: opt.color_name_ar } : (opt.combination || {}),
            image_url: giftImage,
          };
        }
      });
    }

    // ============================================================
    // ✅ 3. التحقق
    // ============================================================
    const hasRequired = Object.keys(requiredVariationsDetails).length > 0;

    if (!hasRequired) {
      toast.warning(app.lang === "ar" ? "⚠️ لم تختار أي خيارات" : "⚠️ No options selected");
      return;
    }

    if (!mainListingId) {
      toast.warning(app.lang === "ar" ? "⚠️ لا يوجد منتج رئيسي" : "⚠️ No main product");
      return;
    }

    // ============================================================
    // ✅✅✅ 4. حساب السعر الإجمالي مع ضرب الكمية
    // ============================================================
    let unitPrice = 0;
    for (const [variationId, data] of Object.entries(requiredVariationsDetails)) {
      unitPrice += data.price * data.quantity;
    }
    const totalPrice = unitPrice * quantity;

    // ============================================================
    // ✅ 5. بناء البيانات النهائية
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
        variations: requiredVariationsDetails,
      },
      free_product: {
        id: freeProduct?.id,
        title_ar: freeProduct?.title_ar,
        title_en: freeProduct?.title_en,
        cover_url: freeProduct?.cover_url,
        colors: freeProduct?.colors || [],
        variations: giftVariationsDetails,
      },
      store: {
        id: offer.store_id || mainProduct?.owner_id,
        name: storeData.name,
        logo: storeData.logo,
      }
    };

    // ============================================================
    // ✅✅✅ 6. إضافة للسلة
    // ============================================================
    try {
      await addToCartMutation.mutateAsync({
        userId: app.user.id,
        listingId: mainListingId,
        quantity: quantity,
        price: totalPrice,
        currency: app.currency || "SYP",
        variationPrice: unitPrice,
        selectedVariationId: null,
        selectedColor: null,
        selectedSize: null,
        variationCombination: {},
        variationImage: null,
        extraData: {
          is_promo_offer: true,
          offer_id: offer.id,
          offer_data: offerData,
          required_variations: requiredVariationsDetails,
          gift_variations: giftVariationsDetails,
          currency: app.currency || "SYP",
          quantity: quantity,
        },
      });

      toast.success(
        app.lang === "ar" 
          ? `✅ تم إضافة ${quantity} ${quantity > 1 ? 'عروض' : 'عرض'} للسلة بنجاح!`
          : `✅ ${quantity} offer${quantity > 1 ? 's' : ''} added to cart successfully!`,
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
            background: 'linear-gradient(135deg, #1a4f4a, #2a655f, #3a8a82)',
            color: 'white',
            fontWeight: 'bold',
            borderRadius: '12px',
            padding: '8px 24px',
            boxShadow: '0 8px 30px rgba(26, 79, 74, 0.4)',
            border: 'none',
            fontSize: '14px',
          }
        }
      );

    } catch (error: any) {
      console.error(`❌ [handleAddToCart] Error:`, error);
      
      if (error?.message?.includes("store")) {
        setCurrentStoreName(error.currentStoreName || "");
        setNewStoreName(error.newStoreName || "");
        setPendingAddData({
          listingId: mainListingId,
          quantity: quantity,
          selectedVariations: requiredVariationsDetails,
          selectedGiftVariations: giftVariationsDetails,
        });
        setShowStoreConflict(true);
        return;
      }
      
      toast.error(
        app.lang === "ar" 
          ? "❌ حدث خطأ أثناء إضافة العرض للسلة" 
          : "❌ An error occurred while adding the offer to cart"
      );
    }
  }, [
    app.user,
    app.lang,
    app.currency,
    offer,
    isVariationSelected,
    selectionStats,
    giftStats,
    totalSelectedQuantity,
    totalRequiredQuantity,
    mainProduct,
    selectedVariations,
    selectedGiftVariations,
    freeProduct,
    addToCartMutation,
    navigate,
    isBogo,
    isCrossSell,
    isBundle,
    requiredProducts,
    storeData,
    getOptionImageUrl,
    quantity,
  ]);

  const handleConfirmClearCart = useCallback(async () => {
    if (!app.user || !pendingAddData) return;
    
    try {
      await clearCartMutation.mutateAsync({ userId: app.user.id });
      setShowStoreConflict(false);
      toast.success(app.lang === "ar" ? "✅ تم تفريغ السلة" : "✅ Cart cleared");
      
      await handleAddToCart();
      
    } catch (error: any) {
      console.error("❌ Error clearing cart:", error);
      toast.error(
        app.lang === "ar" 
          ? `❌ فشل تفريغ السلة: ${error.message || "يرجى المحاولة مرة أخرى"}`
          : `❌ Failed to clear cart: ${error.message || "Please try again"}`
      );
    }
  }, [app.user, clearCartMutation, pendingAddData, handleAddToCart, app.lang]);

  const handleShare = useCallback(async () => {
    try {
      await navigator.share({
        title: offer?.display_text_ar || "عرض ترويجي",
        text: offer?.display_text_ar || "",
        url: window.location.href,
      });
    } catch {
      navigator.clipboard?.writeText(window.location.href);
      toast.success(app.lang === "ar" ? "تم نسخ الرابط 📋" : "Link copied 📋");
    }
  }, [offer, app.lang]);

  // ========== ✅ RENDER ==========
  if (isLoading) return <LoadingSkeleton />;

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
          <Button className="mt-6 bg-[#1a4f4a] hover:bg-[#2a655f] text-white" onClick={() => navigate({ to: "/" })}>
            {app.lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ClientOnly fallback={<LoadingSkeleton />}>
      <div className="min-h-screen bg-[#f8f9fa] pb-24" dir="rtl">
        
        {/* ===== شريط علوي ===== */}
        <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-[#eee] px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate({ to: -1 })} className="p-2 rounded-full hover:bg-gray-100 transition">
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100 transition">
              <Share2 className="h-5 w-5 text-gray-700" />
            </button>
          </div>
        </div>

        {/* ===== عرض الصور - بنفس تصميم listing ===== */}
        <div className="max-w-xl mx-auto px-4">
          <div className="relative w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative w-full aspect-[4/3] overflow-hidden" onClick={() => setIsZoomed(!isZoomed)}>
              {mainImage ? (
                <img
                  key={mainImage}
                  src={mainImage}
                  alt={offer.display_text_ar || "Promo offer"}
                  className={cn(
                    "w-full h-full object-cover transition-transform duration-300",
                    isZoomed && "scale-150"
                  )}
                  loading="eager"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <GiftIcon className="h-20 w-20 text-[#1a4f4a]/30" />
                </div>
              )}
              
              {offerImages.length > 1 && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); const newIndex = (currentImageIndex - 1 + offerImages.length) % offerImages.length; changeImage(newIndex); }} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); const newIndex = (currentImageIndex + 1) % offerImages.length; changeImage(newIndex); }} 
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </>
              )}
              
              {/* العروض والعلامات */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Badge className="bg-gradient-to-r from-[#1a4f4a] to-[#2a655f] text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold">
                  🎁 {app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"}
                </Badge>
                {discountPercent > 0 && (
                  <Badge className="bg-gradient-to-r from-[#1a4f4a] to-[#2a655f] text-white border-0 shadow-lg rounded-full px-4 py-1.5 text-sm font-bold animate-pulse">
                    🎯 {discountPercent}% OFF
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto px-4 mt-4 space-y-4">
          
          {/* ===== العنوان ونوع العرض ===== */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-lg font-bold text-gray-900 flex-1">
                {app.lang === "ar" ? offer.display_text_ar : offer.display_text_en}
              </h1>
              {promoType && (
                <Badge className={cn(
                  "border-0 text-xs font-bold px-3 py-1 rounded-full flex-shrink-0",
                  promoType.color,
                  promoType.bg
                )}>
                  {promoType.icon && <promoType.icon className="h-3 w-3 inline ml-1" />}
                  {promoType.label}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-[#1a4f4a]" />
                {app.lang === "ar" ? "اشتري" : "Buy"} 
                <span className="font-bold text-[#1a4f4a]">{offer.buy_quantity || 2}</span>
                {app.lang === "ar" ? "واحصل على" : "& get"} 
                <span className="font-bold text-[#1a4f4a]">{offer.get_quantity || 1}</span>
                {app.lang === "ar" ? "مجاناً" : "free"}
              </span>
              {!offer.expires_at ? (
                <span className="flex items-center gap-1 text-emerald-600">
                  <Clock className="h-3.5 w-3.5" />
                  {app.lang === "ar" ? "🔓 دائم" : "🔓 Permanent"}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[#1a4f4a]">
                  <Clock className="h-3.5 w-3.5" />
                  {app.lang === "ar" ? "ينتهي" : "Expires"}: {new Date(offer.expires_at).toLocaleDateString(app.lang === "ar" ? "ar-SY" : "en-US")}
                </span>
              )}
            </div>
          </div>

          {/* ===== اسم المتجر مع صورة دائرية ===== */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{app.lang === "ar" ? "المتجر" : "Store"}</span>
              <Link to="/store/$id" params={{ id: offer?.store_id || mainProduct?.owner_id }} className="flex items-center gap-2 font-semibold text-[#1a4f4a] hover:underline">
                <span className="text-sm">{storeData.name}</span>
                <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  {storeData.logo ? (
                    <OptimizedImage src={storeData.logo} alt={storeData.name} width={24} height={24} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="h-3.5 w-3.5 text-gray-500" />
                  )}
                </div>
              </Link>
            </div>
          </div>

          {/* ===== السعر ===== */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                <Tag className="h-4 w-4 text-[#1a4f4a]" />
                {app.lang === "ar" ? "السعر" : "Price"}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xl font-black text-[#1a4f4a]">
                  {formatPrice(finalPrice, app.currency, app.lang)}
                </span>
                {discountPercent > 0 && (
                  <Badge className="bg-[#1a4f4a] text-white border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    🎯 -{discountPercent}%
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* ===== ✅ تقدم اختيار المنتجات المطلوبة ===== */}
          {(isBundle || isBogo || isCrossSell) && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-600">
                  {app.lang === "ar" ? "📊 تقدم اختيار الكميات" : "📊 Quantity Progress"}
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
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div 
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    selectionStats.allComplete && !selectionStats.hasOver
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                      : selectionStats.hasOver
                        ? "bg-gradient-to-r from-red-500 to-rose-500"
                        : "bg-gradient-to-r from-[#1a4f4a] to-[#2a655f]"
                  )}
                  style={{ 
                    width: `${Math.min(100, (totalSelectedQuantity / totalRequiredQuantity) * 100)}%` 
                  }}
                />
              </div>
              {selectionStats.hasOver && (
                <div className="mt-2 flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                  <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-700">
                    {app.lang === "ar" 
                      ? `⚠️ الكمية المختارة (${totalSelectedQuantity}) تتجاوز المطلوب (${totalRequiredQuantity})`
                      : `⚠️ Selected quantity (${totalSelectedQuantity}) exceeds required (${totalRequiredQuantity})`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ===== ✅ المنتجات المطلوبة مع خياراتها ===== */}
          {(isBundle || isBogo || isCrossSell) && (
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3" id="variations-section">
              <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                <Package className="h-4 w-4 text-[#1a4f4a]" />
                {app.lang === "ar" ? "المنتجات المطلوبة" : "Required Products"}
                <span className="text-xs text-red-500">*</span>
              </h3>

              {/* ✅ المنتج الرئيسي لـ BOGO و Cross-sell */}
              {(isBogo || isCrossSell) && mainProductWithVariations && (
                (() => {
                  const item = mainProductWithVariations;
                  const product = item.product;
                  
                  const selectedIds = offer?.variation_ids || [];
                  const allVariations = product.variations || [];
                  const filteredOptions = selectedIds.length > 0 
                    ? allVariations.filter((v: any) => selectedIds.includes(v.id))
                    : allVariations;
                  
                  const optionType = item.optionType;
                  const selectedMap = selectedVariations[product.id] || {};
                  const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
                  const isComplete = selectedTotal === item.totalRequiredQuantity;
                  const isOver = selectedTotal > item.totalRequiredQuantity;
                  const remaining = Math.max(0, item.totalRequiredQuantity - selectedTotal);
                  
                  const defaultKey = `default-${product.id}`;
                  const hasDefault = selectedMap[defaultKey] > 0;

                  return (
                    <div className={cn(
                      "p-3 rounded-xl border-2 transition-all duration-300",
                      isComplete && !isOver
                        ? "bg-emerald-50 border-emerald-300/50"
                        : isOver
                          ? "bg-red-50 border-red-300/50"
                          : "bg-amber-50 border-amber-300/50"
                    )}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-[#1a4f4a] to-[#2a655f] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                            {isBogo ? "🎁" : "🔄"}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {product.title_ar}
                            <span className="text-xs text-muted-foreground font-normal mr-1">
                              ({app.lang === "ar" ? "المطلوب" : "Required"}: {item.totalRequiredQuantity})
                            </span>
                          </span>
                        </div>
                        <Badge className={cn(
                          "border-0 text-[10px]",
                          isComplete && !isOver
                            ? "bg-emerald-100 text-emerald-700"
                            : isOver
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                        )}>
                          {isComplete && !isOver
                            ? `✅ ${selectedTotal}/${item.totalRequiredQuantity}`
                            : isOver
                              ? `⚠️ ${selectedTotal}/${item.totalRequiredQuantity}`
                              : `⚠️ ${selectedTotal}/${item.totalRequiredQuantity}`}
                        </Badge>
                      </div>

                      {filteredOptions.length > 0 ? (
                        <div className="mt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Layers className="h-3 w-3 text-[#1a4f4a]" />
                              {app.lang === "ar" ? "🎨 توزيع الكميات" : "🎨 Quantity Distribution"}
                              {remaining > 0 && !isOver && (
                                <Badge className="bg-amber-500/20 text-amber-600 border-0 text-[9px]">
                                  {app.lang === "ar" ? `متبقي ${remaining}` : `${remaining} remaining`}
                                </Badge>
                              )}
                            </span>
                            {remaining > 0 && !isOver && filteredOptions.length > 1 && (
                              <button
                                onClick={() => autoDistributeRemaining(product.id, filteredOptions, item.totalRequiredQuantity)}
                                className="text-[10px] text-[#1a4f4a] hover:underline transition-colors flex items-center gap-1 px-2 py-0.5 border border-[#1a4f4a]/30 rounded-lg hover:bg-[#1a4f4a]/10"
                              >
                                <Zap className="h-3 w-3" />
                                {app.lang === "ar" ? `وزع ${remaining}` : `Distribute ${remaining}`}
                              </button>
                            )}
                          </div>
                          
                          <div className="flex flex-wrap gap-2 mt-2">
                            {filteredOptions.map((opt: any) => {
                              const isColor = optionType === 'color';
                              const displayName = isColor 
                                ? opt.color_name_ar || opt.color_name_en || 'لون'
                                : Object.entries(opt.combination || {})
                                    .map(([key, value]) => `${value}`)
                                    .join(' • ');
                              const currentQty = selectedMap[opt.id] || 0;
                              const price = isColor 
                                ? product.price 
                                : opt.price || product.price;
                              const image = isColor ? opt.image_url : opt.image_url;

                              return (
                                <div key={opt.id} className="flex items-center gap-1.5 p-1.5 border rounded-xl border-gray-200 bg-white/50 shadow-sm hover:shadow-md transition-all">
                                  {isColor && (
                                    <div 
                                      className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                                      style={{ backgroundColor: opt.color_hex || '#ccc' }}
                                    />
                                  )}
                                  {image && (
                                    <img 
                                      src={image} 
                                      alt={displayName}
                                      className="w-5 h-5 rounded object-cover border border-gray-200"
                                    />
                                  )}
                                  <button
                                    onClick={() => handleRequiredVariationSelect(product.id, opt.id)}
                                    className="text-xs font-medium text-gray-700 hover:text-[#1a4f4a] transition-colors hover:underline"
                                  >
                                    {displayName}
                                  </button>
                                  <span className="text-[10px] text-muted-foreground">
                                    ({formatPrice(Number(price), app.currency, app.lang)})
                                  </span>
                                  <div className="flex items-center gap-0.5">
                                    <button
                                      onClick={() => handleVariationQuantityChange(product.id, opt.id, -1, true)}
                                      className={cn(
                                        "h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                                        currentQty > 0 
                                          ? "bg-gray-200 hover:bg-gray-300 border-gray-300"
                                          : "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200"
                                      )}
                                      disabled={currentQty === 0}
                                    >
                                      -
                                    </button>
                                    <span className="w-6 text-center font-bold text-[#1a4f4a] text-sm">
                                      {currentQty}
                                    </span>
                                    <button
                                      onClick={() => handleVariationQuantityChange(product.id, opt.id, 1, true)}
                                      className={cn(
                                        "h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                                        !isOver || currentQty === 0
                                          ? "bg-[#1a4f4a] hover:bg-[#2a655f] text-white border-[#1a4f4a]"
                                          : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
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
                          
                          {hasDefault && (
                            <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-300/50">
                              <p className="text-xs text-emerald-700 flex items-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                {app.lang === "ar" 
                                  ? `✅ تم اختيار ${selectedMap[defaultKey]} وحدة تلقائياً (لا يوجد خيارات)`
                                  : `✅ ${selectedMap[defaultKey]} units selected automatically (no options)`}
                              </p>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 p-2 bg-emerald-50 rounded-xl border border-emerald-300/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <p className="text-sm font-medium text-emerald-700">
                                {app.lang === "ar" ? "✅ هذا المنتج لا يحتوي على خيارات" : "✅ This product has no options"}
                              </p>
                            </div>
                            <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-sm font-bold px-3 py-1">
                              ✅ {selectedTotal || item.totalRequiredQuantity}/{item.totalRequiredQuantity}
                            </Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}

              {/* ✅ المنتجات المطلوبة لـ Bundle */}
              {isBundle && requiredProducts.map((item: any, index: number) => {
                const product = item.product;
                const options = item.options;
                const optionType = item.optionType;
                const selectedMap = selectedVariations[product.id] || {};
                const selectedTotal = Object.values(selectedMap).reduce((sum, qty) => sum + qty, 0);
                const isComplete = selectedTotal === item.totalRequiredQuantity;
                const isOver = selectedTotal > item.totalRequiredQuantity;
                const remaining = Math.max(0, item.totalRequiredQuantity - selectedTotal);
                
                const defaultKey = `default-${product.id}`;
                const hasDefault = selectedMap[defaultKey] > 0;

                return (
                  <div key={product.id} className={cn(
                    "p-3 rounded-xl border-2 transition-all duration-300",
                    isComplete && !isOver
                      ? "bg-emerald-50 border-emerald-300/50"
                      : isOver
                        ? "bg-red-50 border-red-300/50"
                        : "bg-amber-50 border-amber-300/50"
                  )}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0",
                          isComplete && !isOver
                            ? "bg-emerald-500"
                            : isOver
                              ? "bg-red-500"
                              : "bg-amber-500"
                        )}>
                          {index + 1}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {product.title_ar}
                          <span className="text-xs text-muted-foreground font-normal mr-1">
                            ({app.lang === "ar" ? "المطلوب" : "Required"}: {item.totalRequiredQuantity})
                          </span>
                        </span>
                      </div>
                      <Badge className={cn(
                        "border-0 text-[10px]",
                        isComplete && !isOver
                          ? "bg-emerald-100 text-emerald-700"
                          : isOver
                            ? "bg-red-100 text-red-700"
                            : "bg-amber-100 text-amber-700"
                      )}>
                        {isComplete && !isOver
                          ? `✅ ${selectedTotal}/${item.totalRequiredQuantity}`
                          : isOver
                            ? `⚠️ ${selectedTotal}/${item.totalRequiredQuantity}`
                            : `⚠️ ${selectedTotal}/${item.totalRequiredQuantity}`}
                      </Badge>
                    </div>

                    {options.length > 0 ? (
                      <div className="mt-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Layers className="h-3 w-3 text-[#1a4f4a]" />
                            {app.lang === "ar" ? "🎨 توزيع الكميات" : "🎨 Quantity Distribution"}
                            {remaining > 0 && !isOver && (
                              <Badge className="bg-amber-500/20 text-amber-600 border-0 text-[9px]">
                                {app.lang === "ar" ? `متبقي ${remaining}` : `${remaining} remaining`}
                              </Badge>
                            )}
                          </span>
                          {remaining > 0 && !isOver && options.length > 1 && (
                            <button
                              onClick={() => autoDistributeRemaining(product.id, options, item.totalRequiredQuantity)}
                              className="text-[10px] text-[#1a4f4a] hover:underline transition-colors flex items-center gap-1 px-2 py-0.5 border border-[#1a4f4a]/30 rounded-lg hover:bg-[#1a4f4a]/10"
                            >
                              <Zap className="h-3 w-3" />
                              {app.lang === "ar" ? `وزع ${remaining}` : `Distribute ${remaining}`}
                            </button>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {options.map((opt: any) => {
                            const isColor = optionType === 'color';
                            const displayName = isColor 
                              ? opt.color_name_ar || opt.color_name_en || 'لون'
                              : Object.entries(opt.combination || {})
                                  .map(([key, value]) => `${value}`)
                                  .join(' • ');
                            const currentQty = selectedMap[opt.id] || 0;
                            const price = isColor 
                              ? product.price 
                              : opt.price || product.price;
                            const image = isColor ? opt.image_url : opt.image_url;

                            return (
                              <div key={opt.id} className="flex items-center gap-1.5 p-1.5 border rounded-xl border-gray-200 bg-white/50 shadow-sm hover:shadow-md transition-all">
                                {isColor && (
                                  <div 
                                    className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                                    style={{ backgroundColor: opt.color_hex || '#ccc' }}
                                  />
                                )}
                                {image && (
                                  <img 
                                    src={image} 
                                    alt={displayName}
                                    className="w-5 h-5 rounded object-cover border border-gray-200"
                                  />
                                )}
                                <button
                                  onClick={() => handleRequiredVariationSelect(product.id, opt.id)}
                                  className="text-xs font-medium text-gray-700 hover:text-[#1a4f4a] transition-colors hover:underline"
                                >
                                  {displayName}
                                </button>
                                <span className="text-[10px] text-muted-foreground">
                                  ({formatPrice(Number(price), app.currency, app.lang)})
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <button
                                    onClick={() => handleVariationQuantityChange(product.id, opt.id, -1, true)}
                                    className={cn(
                                      "h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                                      currentQty > 0 
                                        ? "bg-gray-200 hover:bg-gray-300 border-gray-300"
                                        : "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200"
                                    )}
                                    disabled={currentQty === 0}
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center font-bold text-[#1a4f4a] text-sm">
                                    {currentQty}
                                  </span>
                                  <button
                                    onClick={() => handleVariationQuantityChange(product.id, opt.id, 1, true)}
                                    className={cn(
                                      "h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                                      !isOver || currentQty === 0
                                        ? "bg-[#1a4f4a] hover:bg-[#2a655f] text-white border-[#1a4f4a]"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
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
                        
                        {hasDefault && (
                          <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-300/50">
                            <p className="text-xs text-emerald-700 flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {app.lang === "ar" 
                                ? `✅ تم اختيار ${selectedMap[defaultKey]} وحدة تلقائياً (لا يوجد خيارات)`
                                : `✅ ${selectedMap[defaultKey]} units selected automatically (no options)`}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="mt-2 p-2 bg-emerald-50 rounded-xl border border-emerald-300/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <p className="text-sm font-medium text-emerald-700">
                              {app.lang === "ar" ? "✅ هذا المنتج لا يحتوي على خيارات" : "✅ This product has no options"}
                            </p>
                          </div>
                          <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-sm font-bold px-3 py-1">
                            ✅ {selectedTotal || item.totalRequiredQuantity}/{item.totalRequiredQuantity}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== ✅ الهدية ===== */}
          {freeProduct && (
            <>
              {/* ===== تقدم اختيار الهدية ===== */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600">
                    {app.lang === "ar" ? "🎁 تقدم اختيار الهدية" : "🎁 Gift Progress"}
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
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      giftStats.isComplete && !giftStats.isOver
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500"
                        : giftStats.isOver
                          ? "bg-gradient-to-r from-red-500 to-rose-500"
                          : "bg-gradient-to-r from-[#1a4f4a] to-[#2a655f]"
                    )}
                    style={{ 
                      width: `${Math.min(100, (giftStats.selected / giftStats.total) * 100)}%` 
                    }}
                  />
                </div>
                {giftStats.isOver && (
                  <div className="mt-2 flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                    <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                    <p className="text-xs text-red-700">
                      {app.lang === "ar" 
                        ? `⚠️ الكمية المختارة (${giftStats.selected}) تتجاوز الهدية (${giftStats.total})`
                        : `⚠️ Selected quantity (${giftStats.selected}) exceeds gift (${giftStats.total})`}
                    </p>
                  </div>
                )}
              </div>

              {/* ===== عرض الهدية مع خياراتها ===== */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                  <GiftIcon className="h-4 w-4 text-[#1a4f4a]" />
                  {app.lang === "ar" ? "🎁 الهدية" : "🎁 Gift"}
                  <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[10px]">
                    ×{offer.get_quantity || 1}
                  </Badge>
                </h3>
                
                <div className="mt-2 p-3 bg-emerald-50 rounded-xl border border-emerald-300/50">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const giftVariationIds = offer?.result_variation_ids || [];
                      const variations = freeProduct?.variations || [];
                      const colors = freeProduct?.colors || freeProduct?.product_colors || [];
                      
                      let giftImage = freeProduct?.cover_url || null;
                      let availableOptions: any[] = [];
                      let optionType: 'variation' | 'color' = 'variation';
                      
                      if (giftVariationIds.length > 0) {
                        const filteredVariations = variations.filter((v: any) => giftVariationIds.includes(v.id));
                        if (filteredVariations.length > 0) {
                          availableOptions = filteredVariations;
                          optionType = 'variation';
                        } else {
                          const filteredColors = colors.filter((c: any) => giftVariationIds.includes(c.id));
                          if (filteredColors.length > 0) {
                            availableOptions = filteredColors;
                            optionType = 'color';
                          }
                        }
                      }
                      
                      if (availableOptions.length === 0) {
                        if (variations.length > 0) {
                          availableOptions = variations;
                          optionType = 'variation';
                        } else if (colors.length > 0) {
                          availableOptions = colors;
                          optionType = 'color';
                        }
                      }
                      
                      if (availableOptions.length > 0) {
                        availableOptions.forEach((opt: any) => {
                          if (!giftImage) {
                            if (optionType === 'variation') {
                              if (opt.image_url) {
                                giftImage = opt.image_url;
                              } else {
                                const combo = opt.combination || {};
                                const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
                                let colorValue = null;
                                for (const key of colorKeys) {
                                  if (combo[key]) {
                                    colorValue = combo[key];
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
                            } else {
                              if (opt.image_url) {
                                giftImage = opt.image_url;
                              }
                            }
                          }
                        });
                      }
                      
                      return (
                        <>
                          {giftImage ? (
                            <OptimizedImage
                              src={giftImage}
                              alt={freeProduct?.title_ar}
                              width={48}
                              height={48}
                              quality={80}
                              objectFit="cover"
                              className="h-12 w-12 rounded-lg object-cover border-2 border-emerald-300/50"
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center border-2 border-emerald-300/50">
                              <GiftIcon className="h-6 w-6 text-emerald-400" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-emerald-700">
                              {freeProduct?.title_ar}
                            </p>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge className="bg-emerald-500/90 text-white border-0 text-[10px]">
                                ✅ {app.lang === "ar" ? "مجاناً" : "FREE"}
                              </Badge>
                              {availableOptions.length > 0 && (
                                <Badge className="bg-[#1a4f4a]/20 text-[#1a4f4a] border-0 text-[10px]">
                                  🎨 {availableOptions.length} {app.lang === "ar" ? "خيار" : "options"}
                                </Badge>
                              )}
                              {availableOptions.length === 0 && (
                                <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-[10px]">
                                  ✅ {app.lang === "ar" ? "لا يوجد خيارات" : "No options"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  
                  {/* ===== توزيع الكميات على خيارات الهدية ===== */}
                  {(() => {
                    const giftVariationIds = offer?.result_variation_ids || [];
                    const totalGiftQty = offer?.get_quantity || 1;
                    const variations = freeProduct?.variations || [];
                    const colors = freeProduct?.colors || freeProduct?.product_colors || [];
                    
                    let availableOptions: any[] = [];
                    let optionType: 'variation' | 'color' = 'variation';
                    
                    if (giftVariationIds.length > 0) {
                      const filteredVariations = variations.filter((v: any) => giftVariationIds.includes(v.id));
                      if (filteredVariations.length > 0) {
                        availableOptions = filteredVariations;
                        optionType = 'variation';
                      } else {
                        const filteredColors = colors.filter((c: any) => giftVariationIds.includes(c.id));
                        if (filteredColors.length > 0) {
                          availableOptions = filteredColors;
                          optionType = 'color';
                        }
                      }
                    }
                    
                    if (availableOptions.length === 0) {
                      if (variations.length > 0) {
                        availableOptions = variations;
                        optionType = 'variation';
                      } else if (colors.length > 0) {
                        availableOptions = colors;
                        optionType = 'color';
                      }
                    }
                    
                    if (availableOptions.length === 0) {
                      return (
                        <div className="mt-3 p-3 bg-emerald-50/50 rounded-xl border border-emerald-300/50">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <p className="text-sm font-medium text-emerald-700">
                                {app.lang === "ar" ? "✅ الهدية لا تحتوي على خيارات" : "✅ Gift has no options"}
                              </p>
                            </div>
                            <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-sm font-bold px-3 py-1">
                              ✅ {totalGiftQty}/{totalGiftQty}
                            </Badge>
                          </div>
                        </div>
                      );
                    }
                    
                    const giftSelectedMap = selectedGiftVariations || {};
                    const giftSelectedTotal = Object.values(giftSelectedMap).reduce((sum, qty) => sum + qty, 0);
                    const giftIsOver = giftSelectedTotal > totalGiftQty;
                    const giftRemaining = Math.max(0, totalGiftQty - giftSelectedTotal);
                    
                    return (
                      <div className="mt-3 p-3 bg-white/50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-700 flex items-center gap-2">
                            🎨 {app.lang === "ar" ? "توزيع كميات الهدية" : "Gift Quantity Distribution"}
                            {giftRemaining > 0 && !giftIsOver && (
                              <Badge className="bg-amber-500/20 text-amber-600 border-0 text-[9px]">
                                {app.lang === "ar" ? `متبقي ${giftRemaining}` : `${giftRemaining} remaining`}
                              </Badge>
                            )}
                          </span>
                          {giftRemaining > 0 && !giftIsOver && availableOptions.length > 1 && (
                            <button
                              onClick={() => autoDistributeGiftRemaining(availableOptions, totalGiftQty)}
                              className="text-[10px] text-[#1a4f4a] hover:underline transition-colors flex items-center gap-1 px-2 py-0.5 border border-[#1a4f4a]/30 rounded-lg hover:bg-[#1a4f4a]/10"
                            >
                              <Zap className="h-3 w-3" />
                              {app.lang === "ar" ? `وزع ${giftRemaining}` : `Distribute ${giftRemaining}`}
                            </button>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mt-2">
                          {availableOptions.map((opt: any) => {
                            const isColor = optionType === 'color';
                            const displayName = isColor 
                              ? opt.color_name_ar || opt.color_name_en || 'لون'
                              : Object.entries(opt.combination || {})
                                  .map(([key, value]) => `${value}`)
                                  .join(' • ');
                            const currentQty = selectedGiftVariations[opt.id] || 0;
                            const price = isColor 
                              ? freeProduct?.price || 0
                              : opt.price || freeProduct?.price || 0;
                            
                            return (
                              <div key={opt.id} className="flex items-center gap-1.5 p-1.5 border rounded-xl border-gray-200 bg-white/50 shadow-sm hover:shadow-md transition-all">
                                {isColor && (
                                  <div 
                                    className="w-3 h-3 rounded-full border border-gray-300 flex-shrink-0"
                                    style={{ backgroundColor: opt.color_hex || '#ccc' }}
                                  />
                                )}
                                <button
                                  onClick={() => handleGiftVariationSelect(opt.id)}
                                  className="text-xs font-medium text-gray-700 hover:text-emerald-600 transition-colors hover:underline"
                                >
                                  {displayName}
                                </button>
                                <span className="text-[10px] text-muted-foreground">
                                  ({formatPrice(Number(price), app.currency, app.lang)})
                                </span>
                                <div className="flex items-center gap-0.5">
                                  <button
                                    onClick={() => handleGiftVariationQuantityChange(opt.id, -1, true)}
                                    className={cn(
                                      "h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                                      currentQty > 0 
                                        ? "bg-gray-200 hover:bg-gray-300 border-gray-300"
                                        : "bg-gray-100 text-gray-300 cursor-not-allowed border-gray-200"
                                    )}
                                    disabled={currentQty === 0}
                                  >
                                    -
                                  </button>
                                  <span className="w-6 text-center font-bold text-[#1a4f4a] text-sm">
                                    {currentQty}
                                  </span>
                                  <button
                                    onClick={() => handleGiftVariationQuantityChange(opt.id, 1, true)}
                                    className={cn(
                                      "h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold transition-all border",
                                      !giftIsOver && (currentQty === 0 || giftRemaining > 0)
                                        ? "bg-[#1a4f4a] hover:bg-[#2a655f] text-white border-[#1a4f4a]"
                                        : "bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300"
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
                          <div className="mt-2 flex items-center gap-2 p-2 bg-red-50 rounded-lg border border-red-200">
                            <AlertTriangle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            <p className="text-xs text-red-700">
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

          {/* ===== ✅ تنبيه اختيار الخيارات ===== */}
          {!isVariationSelected && (
            <div className="p-3 bg-amber-50 rounded-xl border-2 border-amber-300/50 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700">
                  {app.lang === "ar" 
                    ? `⚠️ غير مكتمل (المنتجات: ${totalSelectedQuantity}/${totalRequiredQuantity}${offer?.result_variation_ids?.length > 0 ? `, الهدية: ${giftStats.selected}/${giftStats.total}` : ''})`
                    : `⚠️ Incomplete (Products: ${totalSelectedQuantity}/${totalRequiredQuantity}${offer?.result_variation_ids?.length > 0 ? `, Gift: ${giftStats.selected}/${giftStats.total}` : ''})`}
                </p>
                <p className="text-xs text-amber-600/80">
                  {app.lang === "ar" 
                    ? `يرجى استكمال الكميات المطلوبة`
                    : `Please complete required quantities`}
                </p>
              </div>
            </div>
          )}

          {/* ===== ✅ تم الاختيار ===== */}
          {isVariationSelected && (
            <div className="p-3 bg-emerald-50 rounded-xl border-2 border-emerald-300/50 flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-emerald-700">
                  ✅ {app.lang === "ar" ? "تم استكمال جميع الكميات" : "All quantities completed"}
                </p>
                <p className="text-xs text-emerald-600/80">
                  {isBundle 
                    ? `📦 ${requiredProducts.length} ${app.lang === "ar" ? "منتج" : "products"}`
                    : `🛒 ${app.lang === "ar" ? "جاهز للإضافة للسلة" : "Ready to add to cart"}`}
                  {Object.keys(selectedGiftVariations).length > 0 && ` 🎁 ${freeProduct?.title_ar}`}
                </p>
              </div>
            </div>
          )}

          {/* ===== عداد الكمية ===== */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">{app.lang === "ar" ? "الكمية:" : "Quantity:"}</span>
              <div className="flex items-center bg-[#f4f4f4] rounded-xl px-2 py-1 gap-2 border border-gray-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="font-bold text-sm w-6 text-center text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)} 
                  className="w-7 h-7 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* ===== السعر الكلي ===== */}
          <div className="bg-[#fef9ec] border border-[#fde6b5] rounded-2xl p-4 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
              <Tag className="h-4 w-4 text-amber-600" />
              {app.lang === "ar" ? "السعر الكلي" : "Total Price"}
            </span>
            <span className="text-xl font-black text-gray-900">
              {formatPrice(finalPrice, app.currency, app.lang)}
            </span>
          </div>

          {/* ===== المنتجات التي قد تعجبك أيضاً (4 فقط — العروض أولاً) ===== */}
          {sortedSimilarListings.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#2a655f] grid place-items-center text-white shadow-sm">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900">
                    {app.lang === "ar" ? "المنتجات التي قد تعجبك أيضاً" : "Products you might also like"}
                  </h3>
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {sortedSimilarListings.length}
                  </Badge>
                </div>
                <Link 
                  to="/category/$slug" 
                  params={{ slug: "all" }}
                  className="bg-[#f5f5f5] hover:bg-[#e8e8e8] transition-colors px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:text-gray-800"
                >
                  {app.lang === "ar" ? "شاهد المزيد" : "View More"}
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {sortedSimilarListings.map((item: any) => {
                  const hasPromo = item.has_promo_offer === true || item.has_promo_offer === "true";
                  const hasDiscount = item.is_offer === true || (item.discount_percent && item.discount_percent > 0);
                  
                  return (
                    <Link 
                      key={item.id} 
                      to="/listing/$id" 
                      params={{ id: item.id }} 
                      className="group relative bg-white rounded-2xl p-2 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2a655f]/30 transition-all duration-300 block"
                    >
                      {/* ✅ Badge العرض الترويجي */}
                      {hasPromo && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 text-[9px] px-2 py-0.5 rounded-full font-bold shadow-lg flex items-center gap-1">
                            <Gift className="h-2.5 w-2.5" />
                            {item.promo_offer_type === 'bogo' && 'BOGO'}
                            {item.promo_offer_type === 'bundle' && (app.lang === "ar" ? 'باقة' : 'Bundle')}
                            {item.promo_offer_type === 'cross_sell' && (app.lang === "ar" ? 'عرض' : 'Offer')}
                            {!item.promo_offer_type && (app.lang === "ar" ? 'عرض' : 'Promo')}
                          </Badge>
                        </div>
                      )}
                      
                      {/* ✅ Badge التخفيض */}
                      {!hasPromo && hasDiscount && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-gradient-to-r from-[#2a655f] to-[#1a4f4a] text-white border-0 text-[9px] px-2 py-0.5 rounded-full font-bold shadow-lg">
                            🔥 -{item.discount_percent || 20}%
                          </Badge>
                        </div>
                      )}

                      <div className="relative w-full aspect-square overflow-hidden rounded-xl">
                        <OptimizedImage 
                          src={item.cover_url} 
                          alt={item.title_ar} 
                          width={200} 
                          height={200} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>
                      
                      <h4 className="text-xs font-medium text-gray-800 mt-2 line-clamp-2 min-h-[2rem] leading-snug">
                        {app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar)}
                      </h4>
                      
                      <div className="flex items-center justify-between mt-1.5">
                        <div className="flex flex-col">
                          {hasDiscount && item.old_price && (
                            <span className="text-[10px] text-red-400 line-through">
                              {formatPrice(Number(item.old_price), app.currency, app.lang)}
                            </span>
                          )}
                          <span className="text-sm font-bold text-[#2a655f]">
                            {formatPrice(Number(item.price), app.currency, app.lang)}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-[10px] text-gray-500">
                          <Star className="h-2.5 w-2.5 fill-yellow-400 text-yellow-400" />
                          <span>{Number(item.rating || 0).toFixed(1)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== ✅ الأكثر مبيعاً - كروت عمودية بعرض كامل ===== */}
          {(trendingLoading || bestSellingListings.length > 0) && (
            <div className="space-y-3 pt-2">
              {/* Header */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-[#2a655f] grid place-items-center text-white shadow-sm">
                    <Flame className="h-3.5 w-3.5" />
                  </div>
                  <h3 className="font-bold text-base text-gray-900">
                    {app.lang === "ar" ? "🔥 الأكثر مبيعاً" : "🔥 Best Sellers"}
                  </h3>
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {bestSellingListings.length}
                  </Badge>
                </div>
                <Link 
                  to="/products"
                  className="bg-[#f5f5f5] hover:bg-[#e8e8e8] transition-colors px-4 py-1.5 rounded-full text-xs font-medium text-gray-600 hover:text-gray-800"
                >
                  {app.lang === "ar" ? "شاهد المزيد" : "View More"}
                </Link>
              </div>

              {/* Vertical List */}
              {trendingLoading ? (
                <div className="space-y-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white rounded-2xl p-3 border border-gray-100 animate-pulse flex gap-3">
                      <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-100 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-1/2" />
                        <div className="h-5 bg-gray-100 rounded w-1/3 mt-auto" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : bestSellingListings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
                  <Flame className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    {app.lang === "ar" ? "لا توجد منتجات رائجة حالياً" : "No trending products yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bestSellingListings.map((item: any, index: number) => (
                    <Link 
                      key={item.id} 
                      to="/listing/$id" 
                      params={{ id: item.id }} 
                      className="group relative bg-white rounded-2xl p-3 border border-gray-100 shadow-sm hover:shadow-md hover:border-[#2a655f]/30 transition-all duration-300 flex gap-3 items-center"
                    >
                      {/* ✅ رقم الترتيب - زيتي */}
                      <div className="absolute top-3 right-3 z-10 h-6 w-6 rounded-full bg-[#2a655f] flex items-center justify-center shadow-md">
                        <span className="text-[10px] font-bold text-white">
                          {index + 1}
                        </span>
                      </div>

                      {/* ✅ صورة المنتج */}
                      <div className="relative w-24 h-24 shrink-0 overflow-hidden rounded-xl">
                        <OptimizedImage 
                          src={item.cover_url} 
                          alt={item.title_ar} 
                          width={200} 
                          height={200} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                      </div>

                      {/* ✅ تفاصيل المنتج */}
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug pe-8">
                          {app.lang === "ar" ? item.title_ar : (item.title_en || item.title_ar)}
                        </h4>
                        
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="flex items-center gap-0.5">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-[10px] text-gray-500">
                              {Number(item.rating || 0).toFixed(1)}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-300">•</span>
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                            <Flame className="h-2 w-2 inline mr-0.5" />
                            {app.lang === "ar" ? "الأكثر مبيعاً" : "Best"}
                          </Badge>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-base font-bold text-[#2a655f]">
                            {formatPrice(Number(item.price), app.currency, app.lang)}
                          </span>
                          <ChevronLeft className="h-4 w-4 text-[#2a655f] group-hover:-translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

        {/* ===== شريط الأزرار السفلي ===== */}
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 max-w-xl mx-auto flex gap-3 shadow-lg">
          <Button
            onClick={handleAddToCart}
            className="flex-1 bg-[#fef9ec] hover:bg-[#fde6b5] text-gray-900 font-bold h-12 rounded-xl text-base shadow-md transition border-2 border-[#fde6b5]"
            disabled={!isVariationSelected || addToCartMutation.isPending || isSubmitting}
          >
            {addToCartMutation.isPending || isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-900/30 border-t-gray-900" />
                {app.lang === "ar" ? "جاري..." : "Loading..."}
              </div>
            ) : (
              app.lang === "ar" ? "اشتري الآن" : "Buy Now"
            )}
          </Button>
          <Button
            onClick={handleAddToCart}
            className={cn(
              "flex-1 font-bold h-12 rounded-xl text-base shadow-md transition",
              "bg-[#1a4f4a] hover:bg-[#2a655f] text-white"
            )}
            disabled={!isVariationSelected || addToCartMutation.isPending || isSubmitting}
          >
            {addToCartMutation.isPending || isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                {app.lang === "ar" ? "جاري..." : "Loading..."}
              </div>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4 ml-2" />
                {app.lang === "ar" ? "أضف العرض للسلة" : "Add Offer to Cart"}
              </>
            )}
          </Button>
        </div>

        {/* ===== مودال تعارض المتاجر ===== */}
        <Dialog open={showStoreConflict} onOpenChange={setShowStoreConflict}>
          <DialogContent className="max-w-md rounded-2xl bg-white p-6">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <ShoppingBag className="h-5 w-5 text-[#1a4f4a]" />
                {app.lang === "ar" ? "سلة من متجر آخر" : "Cart from another store"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 mt-1">
                {app.lang === "ar" 
                  ? `لديك منتجات في السلة من متجر "${currentStoreName}". هل تريد تفريغ السلة وإضافة العرض من "${newStoreName}"؟`
                  : `You have items in your cart from "${currentStoreName}". Do you want to clear the cart and add the offer from "${newStoreName}"?`}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="mt-4 flex gap-2">
              <Button variant="outline" onClick={() => setShowStoreConflict(false)} className="rounded-xl">
                {app.lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button 
                onClick={handleConfirmClearCart} 
                className="bg-[#1a4f4a] hover:bg-[#2a655f] text-white rounded-xl"
              >
                {app.lang === "ar" ? "تفريغ السلة وإضافة الجديد" : "Clear cart and add new"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </ClientOnly>
  );
}

export default OfferDetailPage;