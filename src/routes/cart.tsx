// src/routes/cart.tsx - الكود المُصحّح بالكامل

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, Store, Shield, 
  Truck, Clock, Award, Sparkles, Tag, X, Loader2, Gift, CheckCircle2,
  MapPin, Edit2, PlusCircle, Navigation, Home, Building2, AlertCircle,
  Percent, Package, Layers
} from "lucide-react";
import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useCreateOrder } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart, useUpdateCartItem, useClearCart } from "@/lib/hooks/useCart";
import { AddressPicker, type PickedLocation } from "@/components/AddressPicker";
import { OptimizedImage } from "@/components/OptimizedImage";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCartTotal } from "@/lib/hooks/useCartTotal";

export const Route = createFileRoute("/cart")({
  component: CartPage,
  head: () => ({ meta: [{ title: "سلة التسوق — السوق لعندك" }] }),
});

function CartPage() {
  const app = useApp();
  const navigate = useNavigate();
  
  // ✅ Hooks
  const createOrder = useCreateOrder();
  const updateCartItem = useUpdateCartItem();
  const clearCart = useClearCart();
  
  // ✅ جلب السلة
  const { 
    data: cart, 
    isLoading, 
    isError,
    refetch: refetchCart 
  } = useCart(app.user?.id);
  
  // ✅ State
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [freeItems, setFreeItems] = useState<any[]>([]);
  
  // ✅ State للعناوين
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [newLocation, setNewLocation] = useState<PickedLocation | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  
  // ✅ State لإضافة عنوان جديد
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressDetails, setNewAddressDetails] = useState("");
  
  // ✅ State للتوصيل
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryCompany, setDeliveryCompany] = useState<any>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);

  // ✅ State لديالوغ تفريغ السلة
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);

  // ✅ useRef
  const isFirstRender = useRef(true);
  const deliveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousCartState = useRef<string>("");
  
  // ✅ تعريف items مع دعم الفيرنتات بشكل كامل
// ✅ تعريف items مع دعم الفيرنتات والعروض التخفيضية
const items = useMemo(() => {
  if (!cart?.items) return [];
  
  return cart.items.map((item: any) => {
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    const subtotal = price * quantity;
    const subtotal_usd = item.price_usd ? Number(item.price_usd) * quantity : null;
    
    const listing = item.listings || item.listing || null;
    
    // ✅ التحقق مما إذا كان هذا العنصر هدية
    const isGift = item.is_free === true || item.variation_snapshot?.is_gift === true;
    
    // ============================================================
    // ✅✅✅ حساب displayImage مع دعم العروض التخفيضية والفيرنتات ✅✅✅
    // ============================================================
    let displayImage = listing?.cover_url || '/placeholder.png';
    
    // ✅ 1. جلب صورة الفيرنت من variation_snapshot
    if (item.variation_snapshot) {
      if (item.variation_snapshot.variation_image) {
        displayImage = item.variation_snapshot.variation_image;
      } else if (item.variation_snapshot.cover_url) {
        displayImage = item.variation_snapshot.cover_url;
      } else if (item.variation_snapshot.image_url) {
        displayImage = item.variation_snapshot.image_url;
      }
    }
    
    // ✅ 2. التحقق من selected_variation_id (العروض التخفيضية والمنتجات العادية)
    if (!displayImage || displayImage === '/placeholder.png') {
      const variationId = item.selected_variation_id || 
                          item.selected_options?.selected_variation_id;
      
      if (variationId && listing?.variations) {
        const selectedVariation = listing.variations.find(
          (v: any) => v.id === variationId
        );
        if (selectedVariation) {
          if (selectedVariation.image_url) {
            displayImage = selectedVariation.image_url;
          }
          if (selectedVariation.color_id && listing.colors) {
            const color = listing.colors.find((c: any) => c.id === selectedVariation.color_id);
            if (color?.image_url) {
              displayImage = color.image_url;
            }
          }
        }
      }
    }
    
    // ✅ 3. التحقق من variation_combination (استخراج اللون)
    if (!displayImage || displayImage === '/placeholder.png') {
      const combination = item.variation_combination || 
                          item.selected_options?.combination || 
                          {};
      
      const colorKeys = ['colors', 'color', 'اللون', 'لون', 'colour'];
      let colorValue = null;
      for (const key of colorKeys) {
        if (combination[key]) {
          colorValue = combination[key];
          break;
        }
      }
      
      if (colorValue && listing?.colors) {
        const color = listing.colors.find((c: any) => 
          String(c.color_name_ar || "").trim().toLowerCase() === String(colorValue).trim().toLowerCase() ||
          String(c.color_name_en || "").trim().toLowerCase() === String(colorValue).trim().toLowerCase()
        );
        if (color?.image_url) {
          displayImage = color.image_url;
        }
      }
    }
    
    // ✅ 4. التحقق من selected_color (fallback)
    if (!displayImage || displayImage === '/placeholder.png') {
      const colorName = item.selected_color || 
                        item.selected_options?.selected_color;
      
      if (colorName && listing?.colors) {
        const color = listing.colors.find((c: any) => 
          String(c.color_name_ar || "").trim().toLowerCase() === String(colorName).trim().toLowerCase() ||
          String(c.color_name_en || "").trim().toLowerCase() === String(colorName).trim().toLowerCase()
        );
        if (color?.image_url) {
          displayImage = color.image_url;
        }
      }
    }
    
    // ✅ 5. fallback أخير: استخدم cover_url
    if (!displayImage || displayImage === '/placeholder.png') {
      if (listing?.cover_url) {
        displayImage = listing.cover_url;
      }
    }
    
    // ✅ استخراج اسم الفيرنت
    const getVariationName = () => {
      if (item.variation_snapshot?.variation_data?.combination) {
        return Object.values(item.variation_snapshot.variation_data.combination).join(' • ');
      }
      if (item.variation_snapshot?.combination) {
        return Object.values(item.variation_snapshot.combination).join(' • ');
      }
      if (item.selected_options?.combination) {
        return Object.values(item.selected_options.combination).join(' • ');
      }
      if (item.variation_combination && Object.keys(item.variation_combination).length > 0) {
        return Object.values(item.variation_combination).join(' • ');
      }
      if (item.selected_color || item.selected_size) {
        const parts = [];
        if (item.selected_color) parts.push(item.selected_color);
        if (item.selected_size) parts.push(item.selected_size);
        return parts.join(' • ');
      }
      return '';
    };
    
    const variationName = getVariationName();
    
    let displayTitle = app.lang === "ar" ? listing?.title_ar : (listing?.title_en || listing?.title_ar);
    if (isGift && item.variation_snapshot?.title_ar) {
      displayTitle = item.variation_snapshot.title_ar;
    }
    
    return {
      ...item,
      subtotal,
      subtotal_usd,
      listing: listing,
      displayImage: displayImage,
      variationName: variationName,
      displayTitle: displayTitle,
      isGift: isGift,
      isPromoOffer: item.is_promo_offer === true || item.offer_id !== null,
      isDiscountOffer: listing?.is_offer === true && item.is_promo_offer !== true,
    };
  });
}, [cart?.items, app.lang]);

  // ✅ جب storeId من أول منتج في السلة
  const storeIdFromCart = useMemo(() => {
    if (!items || items.length === 0) return undefined;
    const firstItem = items[0];
    const listing = firstItem.listing || firstItem;
    return listing.owner_id || firstItem.listing_id;
  }, [items]);

  // ✅ حساب قيمة السلة
  const cartTotal = useCartTotal(app.user?.id, storeIdFromCart);
  
  // ✅ جلب عناوين المستخدم
  useEffect(() => {
    const fetchUserAddresses = async () => {
      if (!app.user) return;
      
      setIsLoadingAddresses(true);
      try {
        const { data, error } = await supabase
          .from("user_addresses")
          .select("*")
          .eq("user_id", app.user.id)
          .order("is_default", { ascending: false });
        
        if (error) throw error;
        
        setUserAddresses(data || []);
        
        const defaultAddress = data?.find((a: any) => a.is_default) || data?.[0] || null;
        if (defaultAddress) {
          setSelectedAddressId(defaultAddress.id);
          setSelectedAddress(defaultAddress);
        }
      } catch (error) {
        console.error("❌ Error fetching addresses:", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    
    fetchUserAddresses();
  }, [app.user]);

  // ✅ استخراج اسم المتجر وصورته
  const storeInfo = useMemo(() => {
    if (items.length === 0) {
      return { 
        name: app.lang === "ar" ? "متجر" : "Store",
        logo: null,
        cover: null
      };
    }
    
    const firstItem = items[0];
    const listing = firstItem.listing || firstItem;
    
    const name = 
      (listing as any)?.profile?.store_name ||    
      (listing as any)?.profiles?.store_name ||   
      (listing as any)?.owner?.store_name || 
      (listing as any)?.profile?.full_name || 
      (listing as any)?.profiles?.full_name || 
      (listing as any)?.owner?.full_name || 
      "متجر";
    
    const logo = 
      (listing as any)?.profile?.store_logo_url || 
      (listing as any)?.profiles?.store_logo_url || 
      (listing as any)?.owner?.store_logo_url || 
      (listing as any)?.profile?.avatar_url || 
      (listing as any)?.profiles?.avatar_url || 
      (listing as any)?.owner?.avatar_url || 
      null;
    
    const cover = 
      (listing as any)?.profile?.store_cover_url || 
      (listing as any)?.profiles?.store_cover_url || 
      (listing as any)?.owner?.store_cover_url || 
      null;
    
    return {
      name: name || (app.lang === "ar" ? "متجر" : "Store"),
      logo: logo,
      cover: cover
    };
  }, [items, app.lang]);

  // ✅ دالة حساب المسافة
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) return 0;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  // ✅ دالة حساب سعر التوصيل
  const calculateDeliveryPrice = useCallback((company: any, distanceInKm: number, orderTotal: number): number => {
    const freeThreshold = company.free_delivery_threshold || 0;
    if (freeThreshold > 0 && orderTotal >= freeThreshold) {
      return 0;
    }

    const basePrice = company.base_price || 0;
    const pricePerKm = company.price_per_km || 0;
    let price = basePrice + (distanceInKm * pricePerKm);

    const minFee = company.min_delivery_fee || 0;
    if (price < minFee) {
      price = minFee;
    }

    const maxFee = company.max_delivery_fee || 999999;
    if (price > maxFee) {
      price = maxFee;
    }

    return Math.round(price);
  }, []);

  // ✅ حساب التوصيل
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (deliveryTimeoutRef.current) {
      clearTimeout(deliveryTimeoutRef.current);
    }

    deliveryTimeoutRef.current = setTimeout(() => {
      const calculateDelivery = async () => {
        if (!selectedAddress || !storeIdFromCart) {
          setDeliveryFee(0);
          setDeliveryCompany(null);
          return;
        }
        
        setIsCalculatingDelivery(true);
        try {
          const { data: store, error: storeError } = await supabase
            .from("profiles")
            .select("delivery_company_id, lat, lng, governorate_id")
            .eq("id", storeIdFromCart)
            .maybeSingle();

          if (storeError || !store) {
            console.error("❌ [Cart] Store not found:", storeError);
            setDeliveryFee(0);
            setDeliveryCompany(null);
            return;
          }

          let selectedCompany = null;

          if (store.delivery_company_id) {
            const { data: company, error: companyError } = await supabase
              .from("delivery_companies")
              .select("*")
              .eq("id", store.delivery_company_id)
              .eq("is_active", true)
              .maybeSingle();

            if (!companyError && company) {
              selectedCompany = company;
              console.log("✅ [Cart] Using store's delivery company:", company.name_ar);
            }
          }

          if (!selectedCompany) {
            const { data: companies, error: companiesError } = await supabase
              .from("delivery_companies")
              .select("*")
              .eq("is_active", true);

            if (!companiesError && companies) {
              const matchingCompanies = companies.filter((c: any) => {
                const coverage = c.coverage_areas || [];
                if (coverage.includes("all") || coverage.includes(store.governorate_id)) {
                  return true;
                }
                if (c.governorate_id === store.governorate_id) {
                  return true;
                }
                return false;
              });

              if (matchingCompanies.length > 0) {
                selectedCompany = matchingCompanies.sort((a: any, b: any) => 
                  (a.base_price || 0) - (b.base_price || 0)
                )[0];
                console.log("✅ [Cart] Using best matching company:", selectedCompany.name_ar);
              }
            }
          }

          if (!selectedCompany) {
            const { data: fallbackCompany, error: fallbackError } = await supabase
              .from("delivery_companies")
              .select("*")
              .eq("is_active", true)
              .limit(1)
              .maybeSingle();

            if (!fallbackError && fallbackCompany) {
              selectedCompany = fallbackCompany;
              console.log("✅ [Cart] Using fallback company:", selectedCompany.name_ar);
            }
          }

          if (!selectedCompany) {
            setDeliveryFee(0);
            setDeliveryCompany(null);
            return;
          }

          let distance = 0;
          const hasValidCoordinates = store.lat && store.lng && selectedAddress.lat && selectedAddress.lng;

          if (hasValidCoordinates) {
            distance = calculateDistance(
              store.lat,
              store.lng,
              selectedAddress.lat,
              selectedAddress.lng
            );
            console.log(`📍 [Cart] Real distance: ${distance.toFixed(2)} km`);
          } else {
            const storeGovId = store.governorate_id;
            const userGovId = selectedAddress.governorate_id;
            
            if (storeGovId === userGovId) {
              distance = 5;
            } else {
              distance = 25;
            }
            console.log(`📍 [Cart] Estimated distance: ${distance} km`);
          }

          const fee = calculateDeliveryPrice(selectedCompany, distance, cartTotal);
          console.log(`💰 [Cart] Delivery fee: ${fee} SYP (cartTotal: ${cartTotal})`);
          
          setDeliveryFee(Number(fee) || 0);
          setDeliveryCompany(selectedCompany);

        } catch (error) {
          console.error("❌ [Cart] Error calculating delivery:", error);
          setDeliveryFee(0);
          setDeliveryCompany(null);
        } finally {
          setIsCalculatingDelivery(false);
        }
      };
      
      calculateDelivery();
    }, 300);

    return () => {
      if (deliveryTimeoutRef.current) {
        clearTimeout(deliveryTimeoutRef.current);
      }
    };
  }, [selectedAddress, storeIdFromCart, cartTotal, calculateDistance, calculateDeliveryPrice]);

  // ✅ حساب الإجماليات
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const total = subtotal + deliveryFee - promoDiscount;
    
    return {
      subtotal,
      deliveryFee,
      total,
      itemCount: items.length,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items, deliveryFee, promoDiscount]);
  
  // ✅ تغيير العنوان
  const handleAddressChange = useCallback((addressId: string) => {
    const address = userAddresses.find((a: any) => a.id === addressId);
    if (address) {
      setSelectedAddressId(addressId);
      setSelectedAddress(address);
      
      if (promoApplied) {
        removePromoCode();
      }
    }
  }, [userAddresses, promoApplied]);

  // ✅ إزالة كود الخصم
  const removePromoCode = useCallback(() => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoMessage("");
    setPromoData(null);
    setFreeItems([]);
    toast.info(app.lang === "ar" ? "🗑️ تم إزالة كود الخصم" : "🗑️ Promo code removed");
  }, [app.lang]);

  // ✅ إضافة عنوان جديد
  const handleAddAddress = useCallback(async () => {
    if (!app.user || !newLocation) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء اختيار الموقع على الخريطة" : "⚠️ Please select a location on the map");
      return;
    }
    
    if (!newAddressLabel.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال اسم للعنوان" : "⚠️ Please enter a label for the address");
      return;
    }
    
    if (!newAddressDetails.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال تفاصيل إضافية" : "⚠️ Please enter additional details");
      return;
    }
    
    try {
      const { error } = await supabase
        .from("user_addresses")
        .insert({
          user_id: app.user.id,
          label: newAddressLabel.trim(),
          address_text: newLocation.address,
          details: newAddressDetails.trim(),
          lat: newLocation.lat || 0,
          lng: newLocation.lng || 0,
          is_default: userAddresses.length === 0,
        });
      
      if (error) throw error;
      
      toast.success(app.lang === "ar" ? "✅ تم إضافة العنوان بنجاح" : "✅ Address added successfully");
      
      const { data } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", app.user.id)
        .order("is_default", { ascending: false });
      
      setUserAddresses(data || []);
      setShowAddAddressDialog(false);
      setNewLocation(null);
      setNewAddressLabel("");
      setNewAddressDetails("");
      
      if (data && data.length > 0) {
        setSelectedAddressId(data[0].id);
        setSelectedAddress(data[0]);
      }
      
    } catch (error) {
      console.error("❌ Error adding address:", error);
      toast.error(app.lang === "ar" ? "❌ فشل إضافة العنوان" : "❌ Failed to add address");
    }
  }, [app.user, newLocation, newAddressLabel, newAddressDetails, userAddresses.length, app.lang]);

  // ✅ تطبيق كود الخصم
  const applyPromoCode = useCallback(async () => {
    console.log("🔍 [PROMO] ===== START APPLYING PROMO CODE =====");
    console.log("🔍 [PROMO] Code entered:", promoCode.trim().toUpperCase());
    
    if (!promoCode.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال كود الخصم" : "⚠️ Please enter a promo code");
      return;
    }

    if (promoApplied) {
      console.log("❌ [PROMO] A promo code is already applied");
      toast.error(
        app.lang === "ar" 
          ? "⚠️ لا يمكن تطبيق أكثر من كود خصم واحد. قم بإزالة الكود الحالي أولاً" 
          : "⚠️ Cannot apply more than one promo code. Please remove the current code first"
      );
      setPromoMessage(
        app.lang === "ar" 
          ? "⚠️ يوجد كود خصم مطبق بالفعل، قم بإزالته أولاً" 
          : "⚠️ A promo code is already applied, please remove it first"
      );
      setIsApplyingPromo(false);
      return;
    }

    setIsApplyingPromo(true);
    setPromoMessage("");

    try {
      const { data, error } = await supabase
        .from("promo_codes")
        .select("*")
        .eq("code", promoCode.trim().toUpperCase())
        .eq("is_active", true)
        .maybeSingle();

      if (error) {
        console.error("❌ [PROMO] Database error:", error);
        throw error;
      }

      if (!data) {
        console.log("❌ [PROMO] Code not found or inactive");
        setPromoMessage(app.lang === "ar" ? "❌ كود غير صالح" : "❌ Invalid code");
        toast.error(app.lang === "ar" ? "❌ كود الخصم غير صالح" : "❌ Invalid promo code");
        setIsApplyingPromo(false);
        return;
      }

      console.log("✅ [PROMO] Code found:", {
        code: data.code,
        type: data.type,
        value: data.value,
        is_active: data.is_active,
        used_count: data.used_count,
        usage_limit: data.usage_limit,
        expires_at: data.expires_at,
        store_id: data.store_id,
        store_name: data.store_name,
      });

      const now = new Date();
      const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
      const startsAt = data.starts_at ? new Date(data.starts_at) : null;

      if (startsAt && now < startsAt) {
        console.log("❌ [PROMO] Code not active yet");
        setPromoMessage(app.lang === "ar" ? "⏳ الكود غير مفعل بعد" : "⏳ Code not active yet");
        toast.error(app.lang === "ar" ? "⏳ الكود غير مفعل بعد" : "⏳ Code not active yet");
        setIsApplyingPromo(false);
        return;
      }

      if (expiresAt && now > expiresAt) {
        console.log("❌ [PROMO] Code expired");
        setPromoMessage(app.lang === "ar" ? "❌ انتهت صلاحية الكود" : "❌ Code expired");
        toast.error(app.lang === "ar" ? "❌ انتهت صلاحية الكود" : "❌ Code expired");
        setIsApplyingPromo(false);
        return;
      }

      console.log("✅ [PROMO] Code is valid (active and within date range)");

      // ✅ التحقق من المتجر
      if (data.store_id) {
        console.log("🔍 [PROMO] Checking store specificity...");
        console.log("📌 [PROMO] Code is for store:", data.store_id, data.store_name);
        
        const hasDifferentStore = items.some((item: any) => {
          const listing = item.listing || item;
          const isDifferent = listing.owner_id !== data.store_id;
          if (isDifferent) {
            console.log("⚠️ [PROMO] Product", listing.title_ar, "belongs to different store:", listing.owner_id);
          }
          return isDifferent;
        });

        if (hasDifferentStore) {
          console.log("❌ [PROMO] Cart contains products from different stores");
          setPromoMessage(
            app.lang === "ar" 
              ? `❌ هذا الكود مخصص لمتجر "${data.store_name}" فقط` 
              : `❌ This code is only for store "${data.store_name}"`
          );
          toast.error(
            app.lang === "ar" 
              ? `❌ هذا الكود مخصص لمتجر "${data.store_name}" فقط` 
              : `❌ This code is only for store "${data.store_name}"`
          );
          setIsApplyingPromo(false);
          return;
        }
        console.log("✅ [PROMO] All products belong to the correct store");
      } else {
        console.log("✅ [PROMO] Code is public (no store restriction)");
      }

      // ✅ التحقق من عدد الاستخدامات
      if (data.usage_limit && data.used_count >= data.usage_limit) {
        console.log("❌ [PROMO] Code usage limit reached");
        setPromoMessage(
          app.lang === "ar" 
            ? `❌ تم استخدام هذا الكود بالكامل (${data.used_count}/${data.usage_limit})` 
            : `❌ This code has been fully used (${data.used_count}/${data.usage_limit})`
        );
        toast.error(
          app.lang === "ar" 
            ? `❌ تم استخدام هذا الكود بالكامل (${data.used_count}/${data.usage_limit})` 
            : `❌ This code has been fully used (${data.used_count}/${data.usage_limit})`
        );
        setIsApplyingPromo(false);
        return;
      }

      // ✅ تحذير عدد الاستخدامات المتبقية
      if (data.usage_limit) {
        const remaining = data.usage_limit - data.used_count;
        console.log(`📌 [PROMO] Remaining uses: ${remaining}`);
        
        if (remaining <= 2 && data.used_count === 0) {
          toast.warning(
            app.lang === "ar" 
              ? `⚠️ تبقى ${remaining} استخدام${remaining > 1 ? 'ات' : ''} فقط لهذا الكود` 
              : `⚠️ Only ${remaining} use${remaining > 1 ? 's' : ''} remaining for this code`
          );
        }
      }
      console.log("✅ [PROMO] Usage limit check passed");

      // ✅ التحقق من استخدام الكود من قبل هذا المستخدم
      const { data: existingUsage, error: usageCheckError } = await supabase
        .from("promo_code_usage")
        .select(`
          id,
          order_id,
          used_at,
          discount_amount,
          orders:order_id (
            id,
            status,
            delivery_status,
            created_at
          )
        `)
        .eq("promo_code_id", data.id)
        .eq("user_id", app.user.id)
        .order("used_at", { ascending: false });

      if (!usageCheckError && existingUsage && existingUsage.length > 0) {
        console.log(`📌 [PROMO] Total usage records: ${existingUsage.length}`);
        
        // ✅ 1. تصنيف الاستخدامات
        const completedUses = existingUsage.filter((usage: any) => {
          const order = usage.orders;
          if (!order) return false;
          const isCompleted = order.status === 'completed' || 
                              order.status === 'delivered' ||
                              order.status === 'done' ||
                              order.delivery_status === 'delivered' ||
                              order.delivery_status === 'completed';
          return isCompleted;
        });
        
        const pendingUses = existingUsage.filter((usage: any) => {
          const order = usage.orders;
          if (!order) return false;
          const isPending = order.status === 'pending' || 
                            order.status === 'processing' || 
                            order.status === 'accepted' ||
                            order.delivery_status === 'pending' ||
                            order.delivery_status === 'assigned' ||
                            order.delivery_status === 'picked_up' ||
                            order.delivery_status === 'in_transit';
          return isPending;
        });
        
        const cancelledUses = existingUsage.filter((usage: any) => {
          const order = usage.orders;
          if (!order) return false;
          const isCancelled = order.status === 'cancelled' || 
                              order.status === 'canceled' ||
                              order.status === 'rejected' ||
                              order.delivery_status === 'cancelled';
          return isCancelled;
        });
        
        const userUsageLimit = data.metadata?.user_usage_limit || 1;
        const completedCount = completedUses.length;
        const pendingCount = pendingUses.length;
        
        console.log(`📌 [PROMO] Completed: ${completedCount}, Pending: ${pendingCount}, Limit: ${userUsageLimit}`);
        
        // ✅ 2. الأولوية القصوى: التحقق من الوصول للحد المسموح
        if (completedCount >= userUsageLimit) {
          // ❌ منع الاستخدام - وصل للحد المسموح
          let message = "";
          if (userUsageLimit === 1) {
            message = app.lang === "ar" 
              ? `✅ لقد استفدت من هذا الكود مسبقاً (${completedCount} مرة)، لا يمكن استخدامه مجدداً` 
              : `✅ You have already used this code (${completedCount} time), cannot use it again`;
          } else {
            message = app.lang === "ar" 
              ? `✅ لقد استفدت من هذا الكود مسبقاً (${completedCount}/${userUsageLimit} مرة)، لا يمكن استخدامه مجدداً` 
              : `✅ You have already used this code (${completedCount}/${userUsageLimit} times), cannot use it again`;
          }
          
          setPromoMessage(message);
          toast.info(
            app.lang === "ar" 
              ? `✅ لقد استفدت من هذا الكود مسبقاً (${completedCount} مرة)` 
              : `✅ You have already used this code (${completedCount} times)`
          );
          setIsApplyingPromo(false);
          return;
        }
        
        // ✅ 3. التحقق من وجود طلب جاري (بعد التأكد من عدم الوصول للحد)
        if (pendingCount > 0) {
          // ⚠️ تحذير: يوجد طلب جاري، ولكن ما زال مسموح بالاستخدام (لأنه لم يصل للحد)
          const remainingUses = userUsageLimit - completedCount;
          const pendingOrder = pendingUses[0];
          const orderId = pendingOrder.order_id?.slice(0, 8) || '';
          
          console.log(`⚠️ [PROMO] User has pending order but hasn't reached limit (${completedCount}/${userUsageLimit})`);
          
          // عرض تحذير مع السماح بالاستخدام
          setPromoMessage(
            app.lang === "ar" 
              ? `⚠️ لديك طلب جاري بهذا الكود (رقم: #${orderId})، ولكن يمكنك استخدامه ${remainingUses} مرة${remainingUses > 1 ? 'ات' : ''} متبقية` 
              : `⚠️ You have a pending order with this code (ID: #${orderId}), but you have ${remainingUses} more use${remainingUses > 1 ? 's' : ''} remaining`
          );
          
          toast.warning(
            app.lang === "ar" 
              ? `⚠️ لديك طلب جاري بهذا الكود، ولكن يمكنك استخدامه مرة أخرى (${remainingUses} متبقية)` 
              : `⚠️ You have a pending order with this code, but you can use it again (${remainingUses} remaining)`
          );
          
          // ✅ السماح بالاستخدام (طالما لم يصل للحد)
          // نكمل تطبيق الكود...
        }
        
        // ✅ 4. تنبيه بعدد الاستخدامات المتبقية (فقط إذا لم يصل للحد)
        const remainingUses = userUsageLimit - completedCount;
        if (remainingUses > 0 && remainingUses <= 2 && pendingCount === 0) {
          // ✅ فقط إذا لم يكن هناك طلب جاري (لتجنب تكرار الرسائل)
          setTimeout(() => {
            toast.info(
              app.lang === "ar" 
                ? `ℹ️ يمكنك استخدام هذا الكود ${remainingUses} مرة${remainingUses > 1 ? 'ات' : ''} متبقية` 
                : `ℹ️ You have ${remainingUses} more use${remainingUses > 1 ? 's' : ''} remaining`
            );
          }, 500);
        }
      }

      console.log("🔍 [PROMO] Step 7: Calculating subtotal and checking min order...");
      const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      const minOrder = data.min_order || 0;

      console.log("📌 [PROMO] Subtotal:", subtotal);
      console.log("📌 [PROMO] Minimum order:", minOrder);

      if (subtotal < minOrder) {
        console.log("❌ [PROMO] Subtotal below minimum order");
        setPromoMessage(
          app.lang === "ar" 
            ? `❌ الحد الأدنى للطلب هو ${formatPrice(minOrder, app.currency, app.lang)}` 
            : `❌ Minimum order is ${formatPrice(minOrder, app.currency, app.lang)}`
        );
        toast.error(
          app.lang === "ar" 
            ? `❌ الحد الأدنى للطلب هو ${formatPrice(minOrder, app.currency, app.lang)}` 
            : `❌ Minimum order is ${formatPrice(minOrder, app.currency, app.lang)}`
        );
        setIsApplyingPromo(false);
        return;
      }
      console.log("✅ [PROMO] Subtotal meets minimum order requirement");

      console.log("🔍 [PROMO] Step 8: Calculating discount...");
      let discount = 0;
      let discountMessage = "";
      let freeItemsList: any[] = [];

      if (data.type === "percentage") {
        discount = (subtotal * (data.value / 100));
        discountMessage = `${data.value}%`;
        console.log("📌 [PROMO] Percentage discount:", data.value, "% →", discount);
      } 
      else if (data.type === "fixed") {
        discount = data.value;
        discountMessage = `${formatPrice(data.value, app.currency, app.lang)}`;
        console.log("📌 [PROMO] Fixed discount:", data.value);
      }
      else if (data.type === "free_shipping") {
        discount = deliveryFee;
        discountMessage = app.lang === "ar" ? "توصيل مجاني" : "Free Shipping";
        console.log("📌 [PROMO] Free shipping discount:", deliveryFee);
        
        if (deliveryFee === 0) {
          console.log("✅ [PROMO] Delivery is already free");
          setPromoMessage(app.lang === "ar" ? "✅ التوصيل مجاني بالفعل" : "✅ Shipping is already free");
          toast.info(app.lang === "ar" ? "✅ التوصيل مجاني بالفعل" : "✅ Shipping is already free");
          setIsApplyingPromo(false);
          return;
        }
      }
      else if (data.type === "buy_x_get_y") {
        const buyQty = data.metadata?.buy_quantity || 2;
        const getQty = data.metadata?.get_quantity || 1;
        console.log("📌 [PROMO] Buy X Get Y:", buyQty, "→ get", getQty, "free");
        
        const sortedItems = [...items].sort((a, b) => a.price - b.price);
        let freeItemsCount = 0;
        let freeDiscount = 0;
        freeItemsList = [];
        
        for (const item of sortedItems) {
          const batches = Math.floor(item.quantity / buyQty);
          const freePerBatch = Math.min(getQty, batches);
          if (freePerBatch > 0) {
            const freeItem = {
              ...item,
              free_quantity: freePerBatch,
              free_amount: freePerBatch * item.price
            };
            freeItemsList.push(freeItem);
            freeItemsCount += freePerBatch;
            freeDiscount += freePerBatch * item.price;
          }
        }
        
        discount = freeDiscount;
        discountMessage = `${app.lang === "ar" ? `اشترِ ${buyQty} واحصل على ${getQty} مجاناً` : `Buy ${buyQty} Get ${getQty} Free`}`;
        console.log("📌 [PROMO] Buy X Get Y discount:", freeDiscount);
        
        if (discount === 0) {
          console.log("❌ [PROMO] No free items qualify");
          setPromoMessage(
            app.lang === "ar" 
              ? `❌ اشترِ ${buyQty} منتج للحصول على ${getQty} مجاناً` 
              : `❌ Buy ${buyQty} items to get ${getQty} free`
          );
          toast.error(
            app.lang === "ar" 
              ? `❌ اشترِ ${buyQty} منتج للحصول على ${getQty} مجاناً` 
              : `❌ Buy ${buyQty} items to get ${getQty} free`
          );
          setIsApplyingPromo(false);
          return;
        }
      }

      if (data.max_discount && discount > data.max_discount) {
        console.log("📌 [PROMO] Applying max discount limit:", data.max_discount);
        discount = data.max_discount;
      }

      if (discount > subtotal) {
        console.log("📌 [PROMO] Discount exceeds subtotal, adjusting...");
        discount = subtotal;
      }

      console.log("💰 [PROMO] Final discount:", discount);
      console.log("💰 [PROMO] Final discount message:", discountMessage);

      if (discount <= 0) {
        console.log("❌ [PROMO] Discount is 0, cannot apply");
        setPromoMessage(app.lang === "ar" ? "❌ لا يمكن تطبيق الخصم" : "❌ Cannot apply discount");
        toast.error(app.lang === "ar" ? "❌ لا يمكن تطبيق الخصم" : "❌ Cannot apply discount");
        setIsApplyingPromo(false);
        return;
      }

      console.log("✅ [PROMO] Step 9: Applying discount...");
      setPromoApplied(true);
      setPromoDiscount(discount);
      setPromoData(data);
      setFreeItems(freeItemsList);
      setPromoMessage(
        app.lang === "ar" 
          ? `✅ خصم ${discountMessage} (${formatPrice(discount, app.currency, app.lang)})` 
          : `✅ ${discountMessage} discount (${formatPrice(discount, app.currency, app.lang)})`
      );
      
      console.log("✅ [PROMO] ===== PROMO CODE APPLIED SUCCESSFULLY =====");
      console.log("📌 [PROMO] New total:", subtotal - discount + deliveryFee);
      
      toast.success(
        app.lang === "ar" 
          ? `✅ تم تطبيق الخصم بنجاح! (${formatPrice(discount, app.currency, app.lang)})`
          : `✅ Discount applied successfully! (${formatPrice(discount, app.currency, app.lang)})`
      );

    } catch (error) {
      console.error("❌ [PROMO] Error:", error);
      setPromoMessage(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
      toast.error(app.lang === "ar" ? "❌ حدث خطأ أثناء تطبيق الكود" : "❌ Error applying code");
    } finally {
      setIsApplyingPromo(false);
      console.log("🔍 [PROMO] ===== END APPLYING PROMO CODE =====");
    }
  }, [promoCode, promoApplied, items, deliveryFee, app.lang, app.currency, app.user?.id]);
  
  // ✅ تحديث الكمية
  const handleUpdateQuantity = useCallback(async (itemId: string, newQuantity: number) => {
    if (!app.user) {
      toast.warning(app.lang === "ar" ? "⚠️ يرجى تسجيل الدخول" : "⚠️ Please login");
      return;
    }
    
    const item = items.find(i => i.id === itemId);
    if (item && item.quantity === newQuantity) return;
    
    try {
      await updateCartItem.mutateAsync({
        itemId,
        quantity: newQuantity,
        userId: app.user.id,
      });
      
      if (promoApplied) {
        removePromoCode();
      }
      
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
    }
  }, [app.user, updateCartItem, items, promoApplied, removePromoCode, app.lang]);

  // ✅ تفريغ السلة
  const handleClearCart = useCallback(() => {
    if (!app.user) return;
    setShowClearCartDialog(true);
  }, [app.user]);

  // ✅ تأكيد تفريغ السلة
  const confirmClearCart = useCallback(async () => {
    if (!app.user) return;
    
    try {
      await clearCart.mutateAsync({ userId: app.user.id });
      if (promoApplied) removePromoCode();
      toast.success(app.lang === "ar" ? "🧹 تم تفريغ السلة" : "🧹 Cart cleared");
      setShowClearCartDialog(false);
    } catch (error) {
      console.error("❌ Error clearing cart:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
    }
  }, [app.user, clearCart, promoApplied, removePromoCode, app.lang]);

  // ✅ إتمام الشراء
  const checkout = useCallback(async () => {
    if (!app.user) {
      toast.error(app.lang === "ar" ? "يرجى تسجيل الدخول أولاً" : "Please login first");
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
      return;
    }

    if (items.length === 0) {
      toast.error(app.lang === "ar" ? "السلة فارغة" : "Cart is empty");
      return;
    }

    if (!selectedAddress) {
      toast.error(app.lang === "ar" ? "يرجى اختيار عنوان التوصيل" : "Please select a delivery address");
      return;
    }

    try {
      console.log("📊 [Checkout] ===== ORDER SUMMARY =====");
      console.log("💰 deliveryFee:", deliveryFee);
      console.log("💰 promoDiscount:", promoDiscount);
      console.log("💰 totals.total:", totals.total);
      console.log("💰 totals.subtotal:", totals.subtotal);
      console.log("💰 promoApplied:", promoApplied);
      console.log("💰 promoData:", promoData);

      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", app.user.id)
        .maybeSingle();

      if (profileError) {
        console.error("❌ Error fetching user profile:", profileError);
      }

      const buyerName = userProfile?.full_name || app.user.full_name || app.user.email || 'عميل';
      const buyerPhone = userProfile?.phone || app.user.phone || '';

      const groupedBySeller = items.reduce((acc: any, item: any) => {
        const listing = item.listing || item;
        const sellerId = listing.owner_id || item.listing_id;
        if (!acc[sellerId]) acc[sellerId] = [];
        acc[sellerId].push(item);
        return acc;
      }, {});

      for (const [sellerId, sellerItems] of Object.entries(groupedBySeller)) {
        const itemsList = sellerItems as any[];
        
        const total = itemsList.reduce((sum, item) => {
          const price = Number(item.price);
          const quantity = Number(item.quantity);
          return sum + (price * quantity);
        }, 0);

        const firstItem = itemsList[0];
        const firstListing = firstItem.listing || firstItem;
        const governorateId = firstListing.governorate_id || null;

        const finalDeliveryFee = deliveryFee || 0;
        const finalPromoDiscount = promoApplied ? promoDiscount : 0;
        const finalTotalWithDelivery = totals.total || (total + finalDeliveryFee - finalPromoDiscount);

        console.log(`📊 [Checkout] Order for seller ${sellerId}:`);
        console.log(`   total: ${total}`);
        console.log(`   deliveryFee: ${finalDeliveryFee}`);
        console.log(`   promoDiscount: ${finalPromoDiscount}`);
        console.log(`   total_with_delivery: ${finalTotalWithDelivery}`);

        const orderData: any = {
          buyer_id: app.user.id,
          seller_id: sellerId,
          listing_id: firstItem.listing_id,
          total: total,
          quantity: itemsList.reduce((sum, item) => sum + (item.quantity || 1), 0),
          notes: `طلب من ${storeInfo.name} (${itemsList.length} منتجات)`,
          governorate_id: governorateId,
          delivery_address: selectedAddress.address_text,
          delivery_lat: selectedAddress.lat || 0,
          delivery_lng: selectedAddress.lng || 0,
          buyer_name: buyerName,
          buyer_phone: buyerPhone,
          status: 'pending',
          currency: itemsList[0]?.currency || 'SYP',
          created_at: new Date().toISOString(),
          delivery_fee: finalDeliveryFee,
          promo_discount: finalPromoDiscount,
          promo_code_id: promoApplied && promoData ? promoData.id : null,
          total_with_delivery: finalTotalWithDelivery,
        };

        console.log("📊 [Checkout] Final orderData:", orderData);

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert(orderData)
          .select()
          .single();

        if (orderError) throw orderError;

        console.log(`✅ [Checkout] Order created with ID: ${order.id}`);

        // ✅ حفظ بيانات الفيرنتات في order_items
      // ✅ ✅ ✅ حفظ بيانات الفيرنتات والعروض الترويجية في order_items
const orderItems = itemsList.map((item: any) => {
  // ✅ ✅ ✅ استخراج بيانات العرض الترويجي
  let offerData = null;
  let isPromoOffer = false;
  
  // ✅ من variation_snapshot
  if (item.variation_snapshot?.offer_data) {
    offerData = item.variation_snapshot.offer_data;
    isPromoOffer = true;
  }
  
  // ✅ من item مباشرة
  if (item.offer_id && item.variation_snapshot?.offer_data) {
    isPromoOffer = true;
  }
  
  // ✅ من metadata (إذا كانت موجودة)
  if (item.metadata?.promo_offer_data) {
    offerData = item.metadata.promo_offer_data;
    isPromoOffer = true;
  }
  
  return {
    order_id: order.id,
    listing_id: item.listing_id,
    quantity: item.quantity,
    price: Number(item.price),
    currency: item.currency || 'SYP',
    variation_combination: item.variation_combination || null,
    selected_options: {
      selected_variation_id: item.selected_variation_id || null,
      selected_color: item.selected_color || null,
      selected_size: item.selected_size || null,
    },
    metadata: {
      variation_image: item.displayImage || null,
      variation_price: Number(item.price),
      variation_combination: item.variation_combination || {},
      product_title: item.listing?.title_ar || null,
      product_cover: item.listing?.cover_url || null,
      is_promo_offer: isPromoOffer,
      is_discount_offer: item.isDiscountOffer || false,
      // ✅ ✅ ✅ حفظ بيانات العرض الترويجي الكاملة
      promo_offer_data: offerData,
    },
  };
});
        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

       if (promoApplied && promoData && order) {
  try {
    // ✅ 1. تسجيل استخدام الكود
    const { error: usageError } = await supabase
      .from("promo_code_usage")
      .insert({
        promo_code_id: promoData.id,
        user_id: app.user.id,
        order_id: order.id,
        discount_amount: promoDiscount,
        used_at: new Date().toISOString(),
        store_id: promoData.store_id || null,
        metadata: {
          subtotal: totals.subtotal,
          delivery_fee: deliveryFee,
          total: totals.total,
          free_items: freeItems,
          order_status: 'pending',
        }
      });
    
    if (usageError) {
      console.error("❌ Error recording promo usage:", usageError);
    } else {
      console.log(`✅ Promo code ${promoData.code} usage recorded`);
      
      // ✅ ✅ ✅ 2. زيادة used_count
      const { data: currentCode, error: fetchError } = await supabase
        .from("promo_codes")
        .select("used_count")
        .eq("id", promoData.id)
        .single();
      
      if (!fetchError && currentCode) {
        const newCount = (currentCode.used_count || 0) + 1;
        const { error: updateError } = await supabase
          .from("promo_codes")
          .update({ used_count: newCount })
          .eq("id", promoData.id);
        
        if (updateError) {
          console.error("❌ Error updating used_count:", updateError);
        } else {
          console.log(`✅ Promo code ${promoData.code} used_count: ${newCount}`);
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Error in promo code recording:", error);
  }
}
        // ✅ إشعار للبائع
        await supabase
          .from("notifications")
          .insert({
            user_id: sellerId,
            type: "new_order",
            title_ar: "📦 طلب جديد",
            body_ar: `لديك طلب جديد من ${buyerName} (${itemsList.length} منتجات)${promoApplied ? ` 🔥 تم استخدام كود خصم` : ''}`,
            title_en: "📦 New Order",
            body_en: `You have a new order from ${buyerName} (${itemsList.length} products)${promoApplied ? ` 🔥 Promo code used` : ''}`,
           link_url: `/dashboard?tab=orders`,
            metadata: {
              order_id: order.id,
              buyer_id: app.user.id,
              total: total,
              items_count: itemsList.length,
              buyer_name: buyerName,
              buyer_phone: buyerPhone,
              promo_code_used: promoApplied ? promoData.code : null,
              promo_discount: promoApplied ? promoDiscount : 0,
            }
          });
      }

      // ✅ تفريغ السلة
      await clearCart.mutateAsync({ userId: app.user.id });
      if (promoApplied) removePromoCode();

      toast.success(
        app.lang === "ar" 
          ? `✅ تم إرسال طلبك بنجاح! (${Object.keys(groupedBySeller).length} طلب)${promoApplied ? ` 🎉 خصم ${formatPrice(promoDiscount, app.currency, app.lang)}` : ''}`
          : `✅ Orders placed successfully! (${Object.keys(groupedBySeller).length} orders)${promoApplied ? ` 🎉 ${formatPrice(promoDiscount, app.currency, app.lang)} discount` : ''}`,
        { duration: 5000 }
      );

      navigate({ to: "/orders" });

    } catch (error: any) {
      console.error("❌ Checkout error:", error);
      toast.error(
        app.lang === "ar" 
          ? `❌ حدث خطأ أثناء إتمام الطلب: ${error.message || 'يرجى المحاولة مرة أخرى'}`
          : `❌ An error occurred during checkout: ${error.message || 'Please try again'}`
      );
    }
  }, [app.user, items, clearCart, promoApplied, removePromoCode, navigate, app.lang, selectedAddress, storeInfo.name, promoData, promoDiscount, totals, deliveryFee, freeItems]);
  
  if (isLoading || isLoadingAddresses) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#2a655f] border-t-transparent rounded-full mx-auto" />
          <p className="mt-4 text-muted-foreground">
            {app.lang === "ar" ? "جاري تحميل السلة..." : "Loading cart..."}
          </p>
        </div>
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="relative inline-block">
            <div className="h-32 w-32 rounded-full bg-[#2a655f]/10 flex items-center justify-center mx-auto animate-bounce-slow">
              <ShoppingBag className="h-16 w-16 text-[#2a655f]/40" />
            </div>
            <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-[#2a655f] flex items-center justify-center text-white text-sm font-bold animate-pulse">
              0
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-slate-900 dark:text-white">
            {app.lang === "ar" ? "🛒 سلة التسوق فارغة" : "🛒 Your cart is empty"}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {app.lang === "ar" 
              ? "ابدأ بالتسوق وأضف المنتجات التي تريدها إلى سلة التسوق" 
              : "Start shopping and add the products you want to your cart"}
          </p>
          <Link to="/">
            <Button className="mt-6 h-12 px-8 rounded-2xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-105">
              <ShoppingBag className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "ابدأ التسوق" : "Start Shopping"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-[#2a655f] dark:text-white">
              <div className="p-2 rounded-2xl bg-[#2a655f] text-white shadow-lg shadow-[#2a655f]/20">
                <ShoppingBag className="h-6 w-6" />
              </div>
              {app.lang === "ar" ? "سلة التسوق" : "Shopping Cart"}
              <Badge className="bg-[#2a655f] text-white text-sm px-3 py-1">
                {totals.itemCount} {app.lang === "ar" ? "منتجات" : "items"}
              </Badge>
            </h1>
            
            <div className="mt-2 flex items-center gap-3 p-2.5 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10 hover:border-[#2a655f]/30 transition-all duration-300 max-w-md">
              <div className="h-9 w-9 rounded-lg overflow-hidden border-2 border-[#2a655f]/20 flex-shrink-0 bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a]">
                {storeInfo.logo ? (
                  <OptimizedImage
                    src={storeInfo.logo}
                    alt={storeInfo.name}
                    width={36}
                    height={36}
                    quality={80}
                    objectFit="cover"
                    className="h-full w-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-white font-bold text-sm">
                    {storeInfo.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                  {storeInfo.name}
                </p>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3 w-3 text-emerald-500" />
                  <span className="text-[10px] text-muted-foreground">
                    {app.lang === "ar" ? "متجر موثوق" : "Trusted Store"}
                  </span>
                  <span className="text-[10px] text-muted-foreground/30">•</span>
                  <span className="text-[10px] text-muted-foreground">
                    {items.length} {app.lang === "ar" ? "منتج" : "products"}
                  </span>
                </div>
              </div>
              <Link to={`/store/${items[0]?.listing?.owner_id || items[0]?.listing_id}`}>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 px-3 rounded-lg text-[10px] text-[#2a655f] hover:bg-[#2a655f]/10 hover:text-[#2a655f] hover:scale-105 transition-all duration-300"
                >
                  {app.lang === "ar" ? "زيارة" : "Visit"}
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-[#2a655f]/20 hover:bg-[#2a655f]/10 text-[#2a655f] rounded-xl"
              onClick={handleClearCart}
              disabled={clearCart.isPending}
            >
              {clearCart.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {app.lang === "ar" ? "تفريغ السلة" : "Clear Cart"}
            </Button>
            <Link to="/">
              <Button variant="ghost" className="text-[#2a655f] hover:bg-[#2a655f]/10 rounded-xl">
                {app.lang === "ar" ? "متابعة التسوق" : "Continue Shopping"}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          
          {/* CART ITEMS */}
          <div className="space-y-4">
            {/* عنوان التوصيل */}
            <div className="bg-white dark:bg-slate-900/80 rounded-2xl border border-[#2a655f]/20 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-[#2a655f]/10">
                    <MapPin className="h-5 w-5 text-[#2a655f]" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "📍 عنوان التوصيل" : "📍 Delivery Address"}
                    </p>
                    {selectedAddress ? (
                      <div className="font-medium text-sm text-slate-800 dark:text-white line-clamp-1">
                        {selectedAddress.address_text}
                        {selectedAddress.label && (
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] ml-2">
                            {selectedAddress.label}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-amber-500 font-medium">
                        {app.lang === "ar" ? "⚠️ لم يتم اختيار عنوان" : "⚠️ No address selected"}
                      </p>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddressDialog(true)}
                  className="text-[#2a655f] hover:bg-[#2a655f]/10 rounded-xl"
                >
                  <Edit2 className="h-4 w-4 mr-1.5" />
                  {app.lang === "ar" ? "تغيير" : "Change"}
                </Button>
              </div>
              
              {selectedAddress && (
                <div className="mt-3 pt-3 border-t border-[#2a655f]/10 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-4 w-4 text-[#2a655f]" />
                    {isCalculatingDelivery ? (
                      <span className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        {app.lang === "ar" ? "جاري الحساب..." : "Calculating..."}
                      </span>
                    ) : (
                      <span>
                        {deliveryFee === 0 
                          ? (app.lang === "ar" ? "🆓 توصيل مجاني" : "🆓 Free Delivery")
                          : `${app.lang === "ar" ? "توصيل" : "Delivery"}: ${formatPrice(deliveryFee, app.currency, app.lang)}`
                        }
                      </span>
                    )}
                  </div>
                  {deliveryCompany && (
                    <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
                      {deliveryCompany.name_ar || "شركة توصيل"}
                    </Badge>
                  )}
                </div>
              )}
            </div>

            {/* ✅ قائمة المنتجات مع عرض الفيرنتات المختارة وأزرار التحكم */}
            {items.map((item: any) => {
              const listing = item.listing || item;
              
              // ✅ التحقق من وجود عرض ترويجي
              const isPromoOffer = item.variation_snapshot?.is_promo_offer === true || 
                                   item.offer_id !== null ||
                                   item.variation_snapshot?.offer_id !== undefined;
              
              // ✅ استخراج بيانات العرض من variation_snapshot
              const offerData = item.variation_snapshot?.offer_data || {};
              const requiredVariations = offerData?.required_products?.variations || {};
              const giftVariations = offerData?.free_product?.variations || {};
              const hasRequired = Object.keys(requiredVariations).length > 0;
              const hasGift = Object.keys(giftVariations).length > 0;

              return (
                <div 
                  key={item.id} 
                  className={cn(
                    "group bg-white dark:bg-slate-900/80 rounded-2xl border p-4 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]",
                    isPromoOffer && "border-purple-500/50 hover:border-purple-500/80 hover:shadow-purple-500/20"
                  )}
                >
                  {/* ===== عرض العرض الترويجي ===== */}
                  {isPromoOffer && (
                    <>
                      {/* شارة العرض الترويجي */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 px-3 py-1 rounded-full text-xs font-bold">
                          <Gift className="h-3.5 w-3.5 inline mr-1.5" />
                          {app.lang === "ar" ? "عرض ترويجي" : "Promo Offer"}
                        </Badge>
                        
                        <Badge variant="outline" className="border-purple-300 text-purple-600 text-[10px]">
                          {offerData?.offer_type === 'bogo' ? '🎁 نفس المنتج' : 
                           offerData?.offer_type === 'cross_sell' ? '🔄 منتج مختلف' : '📦 باقة'}
                        </Badge>
                      </div>

                      {/* نص العرض */}
                      {offerData?.display_text_ar && (
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                          {app.lang === "ar" ? offerData.display_text_ar : offerData.display_text_en}
                        </p>
                      )}

                      {/* المنتجات المطلوبة */}
                      {hasRequired && (
                        <div className="space-y-2 mb-3">
                          <p className="text-xs font-semibold text-slate-500 flex items-center gap-2">
                            <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                            🛒 المنتجات المطلوبة ({Object.keys(requiredVariations).length})
                          </p>
                          {Object.entries(requiredVariations).map(([id, data]: any) => {
                            const comboText = Object.values(data.combination || {}).join(' • ');
                            const mainProduct = offerData?.required_products?.main_product || {};
                            const variationImage = data.image_url || 
                                                  mainProduct?.cover_url || 
                                                  item.variation_snapshot?.cover_url || 
                                                  null;
                            
                            return (
                              <div key={id} className="flex items-center gap-3 p-2.5 bg-white/70 rounded-xl border border-purple-100/50">
                                {variationImage ? (
                                  <img 
                                    src={variationImage} 
                                    alt={comboText} 
                                    className="w-10 h-10 rounded-lg object-cover border border-purple-100"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/placeholder.png';
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-purple-400">
                                    <Package className="h-5 w-5" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-700 truncate">{comboText || 'فيرنت'}</p>
                                  <p className="text-xs text-muted-foreground">الكمية: {data.quantity}</p>
                                </div>
                                <p className="text-sm font-bold text-[#0d2e2a] whitespace-nowrap">
                                  {(data.price * data.quantity).toLocaleString()} SYP
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* الهدية */}
                      {hasGift && (
                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-emerald-500 flex items-center gap-2">
                            <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                            🎁 الهدية ({Object.keys(giftVariations).length})
                          </p>
                          {Object.entries(giftVariations).map(([id, data]: any) => {
                            const comboText = Object.values(data.combination || {}).join(' • ');
                            const freeProduct = offerData?.free_product || {};
                            const giftImage = data.image_url || 
                                             freeProduct?.cover_url || 
                                             item.variation_snapshot?.cover_url || 
                                             null;
                            
                            return (
                              <div key={id} className="flex items-center gap-3 p-2.5 bg-emerald-50/70 rounded-xl border border-emerald-100/50">
                                {giftImage ? (
                                  <img 
                                    src={giftImage} 
                                    alt={comboText} 
                                    className="w-10 h-10 rounded-lg object-cover border border-emerald-100"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = '/placeholder.png';
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-400">
                                    <Gift className="h-5 w-5" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-slate-700 truncate">{comboText || 'فيرنت'}</p>
                                  <p className="text-xs text-muted-foreground">الكمية: {data.quantity}</p>
                                </div>
                                <Badge className="bg-emerald-500/20 text-emerald-600 border-0 text-xs font-bold px-3 py-1 rounded-full">
                                  مجاناً 🎁
                                </Badge>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* ✅ إجمالي السعر مع أزرار التحكم بالكمية */}
                      <div className="mt-3 pt-3 border-t border-purple-200/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">إجمالي المنتجات المطلوبة</span>
                          <span className="text-lg font-bold text-[#0d2e2a]">
                            {item.price?.toLocaleString()} SYP
                          </span>
                        </div>
                        
                        {/* ✅ أزرار التحكم بالكمية للعرض الترويجي */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border-2 rounded-xl overflow-hidden shadow-sm border-[#2a655f]/20">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-10 w-10 flex items-center justify-center hover:bg-[#2a655f]/10 transition text-[#2a655f]"
                              disabled={updateCartItem.isPending || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-bold text-lg text-[#2a655f]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-10 w-10 flex items-center justify-center hover:bg-[#2a655f]/10 transition text-[#2a655f]"
                              disabled={updateCartItem.isPending}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition"
                            onClick={() => handleUpdateQuantity(item.id, 0)}
                            disabled={updateCartItem.isPending}
                          >
                            {updateCartItem.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {/* ===== عرض المنتج العادي والعرض التخفيضي ===== */}
                  {!isPromoOffer && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* صورة المنتج */}
                      <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 mx-auto sm:mx-0">
                        <OptimizedImage
                          src={item.displayImage || listing?.cover_url || '/placeholder.png'}
                          alt={app.lang === "ar" ? listing.title_ar : listing.title_en || listing.title_ar}
                          width={112}
                          height={112}
                          quality={80}
                          objectFit="cover"
                          className="h-full w-full group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* شارة العرض التخفيضي */}
                        {item.isDiscountOffer && listing.discount_percent && (
                          <Badge className="absolute top-2 start-2 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[9px] px-1.5 py-0.5">
                            -{listing.discount_percent}%
                          </Badge>
                        )}
                      </div>
                      
                      {/* معلومات المنتج */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors line-clamp-1">
                          {app.lang === "ar" ? listing.title_ar : (listing.title_en || listing.title_ar)}
                        </h3>
                        
                        {/* ✅ الفيرنت المختار مع صورة وسعر وكمية */}
                        {item.variationName && (
                          <div className="mt-2 p-3 bg-gradient-to-r from-[#2a655f]/5 to-[#3a8a82]/5 rounded-xl border border-[#2a655f]/20">
                            <div className="flex items-center gap-3">
                              {/* صورة الفيرنت */}
                              {item.displayImage && item.displayImage !== '/placeholder.png' ? (
                                <img 
                                  src={item.displayImage} 
                                  alt={item.variationName} 
                                  className="w-12 h-12 rounded-lg object-cover border-2 border-[#2a655f]/30"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = '/placeholder.png';
                                  }}
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-[#2a655f]/10 flex items-center justify-center text-[#2a655f]/40">
                                  <Layers className="h-6 w-6" />
                                </div>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                  <Layers className="h-4 w-4 text-[#2a655f]" />
                                  {app.lang === "ar" ? "الفيرنت المختار:" : "Selected variation:"}
                                  <span className="font-bold text-[#2a655f]">{item.variationName}</span>
                                </p>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                                  <span className="flex items-center gap-1">
                                    <span className="text-[#2a655f] font-bold">×</span>
                                    <span className="font-medium">{item.quantity}</span>
                                  </span>
                                  <span className="text-muted-foreground/30">|</span>
                                  <span className="font-bold text-[#2a655f]">
                                    {formatPrice(Number(item.price), app.currency, app.lang)}
                                  </span>
                                  {item.isDiscountOffer && listing.old_price && (
                                    <span className="line-through text-red-400 text-[10px]">
                                      {formatPrice(Number(listing.old_price), app.currency, app.lang)}
                                    </span>
                                  )}
                                </div>
                              </div>
                              
                              {item.isDiscountOffer && (
                                <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[9px]">
                                  🔥 {app.lang === "ar" ? "تخفيض" : "Sale"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* ✅ إذا كان المنتج ليس لديه فيرنتات */}
                        {!item.variationName && (
                          <div className="mt-2 flex items-center gap-3 flex-wrap">
                            <span className="text-xl font-bold text-[#2a655f] dark:text-[#3a8a82]">
                              {formatPrice(Number(item.price), app.currency, app.lang)}
                            </span>
                            {item.isDiscountOffer && listing.old_price && (
                              <span className="text-sm line-through text-red-400">
                                {formatPrice(Number(listing.old_price), app.currency, app.lang)}
                              </span>
                            )}
                            {item.isDiscountOffer && listing.discount_percent && (
                              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[10px]">
                                -{listing.discount_percent}%
                              </Badge>
                            )}
                          </div>
                        )}
                        
                        {/* ✅ أزرار التحكم بالكمية */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex items-center border-2 rounded-xl overflow-hidden shadow-sm border-[#2a655f]/20">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-10 w-10 flex items-center justify-center hover:bg-[#2a655f]/10 transition text-[#2a655f]"
                              disabled={updateCartItem.isPending || item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-bold text-lg text-[#2a655f]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-10 w-10 flex items-center justify-center hover:bg-[#2a655f]/10 transition text-[#2a655f]"
                              disabled={updateCartItem.isPending}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 rounded-xl hover:bg-red-500/10 hover:text-red-500 transition"
                            onClick={() => handleUpdateQuantity(item.id, 0)}
                            disabled={updateCartItem.isPending}
                          >
                            {updateCartItem.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ===== SUMMARY ===== */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-[#2a655f]/20 p-6 shadow-xl shadow-[#2a655f]/5">
              <h2 className="text-lg font-bold text-[#2a655f] dark:text-white flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-[#2a655f]" />
                {app.lang === "ar" ? "ملخص الطلب" : "Order Summary"}
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {app.lang === "ar" ? "المجموع الفرعي" : "Subtotal"}
                  </span>
                  <span className="font-medium">{formatPrice(totals.subtotal, app.currency, app.lang)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {app.lang === "ar" ? "التوصيل" : "Delivery"}
                  </span>
                  {deliveryFee === 0 ? (
                    <span className="font-semibold text-emerald-500">
                      {app.lang === "ar" ? "🆓 مجاني" : "🆓 Free"}
                    </span>
                  ) : (
                    <span className="font-medium">{formatPrice(deliveryFee, app.currency, app.lang)}</span>
                  )}
                </div>

                {/* كود الخصم */}
                <div className="border-t border-[#2a655f]/10 pt-3">
                  {promoApplied ? (
                    <div className="flex items-center justify-between p-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30">
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                          {promoMessage}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 rounded-full hover:bg-emerald-200/50"
                        onClick={removePromoCode}
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={app.lang === "ar" ? "🎫 كود الخصم" : "🎫 Promo code"}
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          className="pl-9 h-10 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 text-sm"
                          onKeyDown={(e) => e.key === "Enter" && applyPromoCode()}
                          disabled={isApplyingPromo}
                        />
                      </div>
                      <Button
                        onClick={applyPromoCode}
                        disabled={isApplyingPromo}
                        className="h-10 px-4 rounded-xl bg-[#2a655f] text-white hover:bg-[#1a4f4a] transition-all duration-300"
                      >
                        {isApplyingPromo ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          app.lang === "ar" ? "تطبيق" : "Apply"
                        )}
                      </Button>
                    </div>
                  )}
                  {promoMessage && !promoApplied && (
                    <p className="text-xs text-red-500 mt-1">{promoMessage}</p>
                  )}
                </div>
                
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-500">
                    <span>{app.lang === "ar" ? "💚 الخصم" : "💚 Discount"}</span>
                    <span className="font-bold">-{formatPrice(promoDiscount, app.currency, app.lang)}</span>
                  </div>
                )}
                
                <div className="border-t border-[#2a655f]/10 my-3 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#2a655f] dark:text-white">
                      {app.lang === "ar" ? "الإجمالي" : "Total"}
                    </span>
                    <span className="text-[#2a655f] dark:text-[#3a8a82]">
                      {formatPrice(totals.total, app.currency, app.lang)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {app.lang === "ar" ? "شامل جميع الرسوم" : "All fees included"}
                  </p>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base font-bold"
                  onClick={checkout}
                  disabled={createOrder.isPending || !selectedAddress}
                >
                  {createOrder.isPending ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      {app.lang === "ar" ? "جاري الإتمام..." : "Processing..."}
                    </div>
                  ) : (
                    <>
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      {app.lang === "ar" ? "إتمام الطلب" : "Place Order"}
                      <Badge className="bg-white/20 text-white border-0 ml-2">
                        {formatPrice(totals.total, app.currency, app.lang)}
                      </Badge>
                    </>
                  )}
                </Button>
                
                {!selectedAddress && (
                  <p className="text-xs text-amber-500 text-center">
                    {app.lang === "ar" ? "⚠️ يرجى اختيار عنوان التوصيل" : "⚠️ Please select a delivery address"}
                  </p>
                )}
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-emerald-500" />
                    {app.lang === "ar" ? "دفع آمن" : "Secure"}
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-[#2a655f]" />
                    {app.lang === "ar" ? "توصيل سريع" : "Fast"}
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="flex items-center gap-1">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    {app.lang === "ar" ? "ضمان الجودة" : "Quality"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== DIALOG: تغيير العنوان ===== */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="rounded-2xl max-w-md border-[#2a655f]/20 shadow-2xl shadow-[#2a655f]/10">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#2a655f]/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#2a655f]" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#2a655f]">
                  {app.lang === "ar" ? "📍 اختيار عنوان التوصيل" : "📍 Select Delivery Address"}
                </DialogTitle>
                <DialogDescription>
                  {app.lang === "ar" 
                    ? "اختر عنواناً من قائمتك أو أضف عنواناً جديداً" 
                    : "Choose an address from your list or add a new one"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {userAddresses.length > 0 ? (
              <div className="space-y-2">
                {userAddresses.map((addr: any) => (
                  <button
                    key={addr.id}
                    onClick={() => {
                      handleAddressChange(addr.id);
                      setShowAddressDialog(false);
                    }}
                    className={cn(
                      "w-full text-start p-3 rounded-xl border-2 transition-all duration-300 hover:border-[#2a655f]/50",
                      selectedAddressId === addr.id
                        ? "border-[#2a655f] bg-[#2a655f]/5"
                        : "border-slate-200/50 dark:border-slate-700/50 hover:bg-[#2a655f]/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "p-1.5 rounded-lg",
                        selectedAddressId === addr.id ? "bg-[#2a655f] text-white" : "bg-slate-100 dark:bg-slate-800"
                      )}>
                        {addr.is_default ? (
                          <Home className="h-4 w-4" />
                        ) : (
                          <MapPin className="h-4 w-4" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm flex items-center gap-2">
                          {addr.label || (app.lang === "ar" ? "عنوان" : "Address")}
                          {addr.is_default && (
                            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px]">
                              {app.lang === "ar" ? "افتراضي" : "Default"}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{addr.address_text}</p>
                        {addr.details && (
                          <p className="text-xs text-muted-foreground/70 line-clamp-1">{addr.details}</p>
                        )}
                      </div>
                      {selectedAddressId === addr.id && (
                        <CheckCircle2 className="h-5 w-5 text-[#2a655f] flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <MapPin className="h-12 w-12 mx-auto mb-2 text-[#2a655f]/30" />
                <p>{app.lang === "ar" ? "لا توجد عناوين محفوظة" : "No saved addresses"}</p>
              </div>
            )}
            
            <Button
              variant="outline"
              onClick={() => {
                setShowAddressDialog(false);
                setShowAddAddressDialog(true);
              }}
              className="w-full rounded-xl border-[#2a655f]/30 text-[#2a655f] hover:bg-[#2a655f]/10 hover:border-[#2a655f]/50 transition-all duration-300"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "إضافة عنوان جديد" : "Add New Address"}
            </Button>
          </div>
          
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowAddressDialog(false)}
              className="rounded-xl"
            >
              {app.lang === "ar" ? "إغلاق" : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: إضافة عنوان جديد ===== */}
      <Dialog open={showAddAddressDialog} onOpenChange={(open) => {
        setShowAddAddressDialog(open);
        if (!open) {
          setNewLocation(null);
          setNewAddressLabel("");
          setNewAddressDetails("");
        }
      }}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] border-[#2a655f]/20 shadow-2xl shadow-[#2a655f]/10 flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-[#2a655f]">
                  {app.lang === "ar" ? "📍 إضافة عنوان جديد" : "📍 Add New Address"}
                </DialogTitle>
                <DialogDescription>
                  {app.lang === "ar" 
                    ? "اختر موقعك على الخريطة وأدخل تفاصيل العنوان" 
                    : "Choose your location on the map and enter address details"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4 px-1">
            
            {/* حقل اسم العنوان */}
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <Home className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "اسم العنوان" : "Address Label"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newAddressLabel}
                onChange={(e) => setNewAddressLabel(e.target.value)}
                placeholder={app.lang === "ar" ? "مثال: المنزل، العمل، المكتب" : "e.g. Home, Work, Office"}
                className="mt-1.5 h-11 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20"
              />
              {!newAddressLabel.trim() && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {app.lang === "ar" ? "⚠️ هذا الحقل مطلوب" : "⚠️ This field is required"}
                </p>
              )}
            </div>
            
            {/* الخريطة */}
            <AddressPicker 
              value={newLocation ?? undefined} 
              onChange={setNewLocation} 
              lang={app.lang} 
            />
            
            {/* حقل التفاصيل الإضافية */}
            <div>
              <Label className="text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "تفاصيل إضافية" : "Additional Details"}
                <span className="text-red-500">*</span>
                <span className="text-xs text-muted-foreground">({app.lang === "ar" ? "مطلوب" : "Required"})</span>
              </Label>
              <Textarea
                value={newAddressDetails}
                onChange={(e) => setNewAddressDetails(e.target.value)}
                placeholder={app.lang === "ar" 
                  ? "رقم الطابق، رقم الشقة، معلم قريب..." 
                  : "Floor number, apartment number, nearby landmark..."}
                rows={2}
                className="mt-1.5 rounded-xl border-[#2a655f]/20 focus:border-[#2a655f] focus:ring-[#2a655f]/20 resize-none"
              />
              {!newAddressDetails.trim() && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {app.lang === "ar" ? "⚠️ هذا الحقل مطلوب" : "⚠️ This field is required"}
                </p>
              )}
            </div>
            
            {/* عرض الموقع المختار */}
            {newLocation && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200/50 dark:border-emerald-800/30">
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {app.lang === "ar" ? "✅ تم اختيار الموقع" : "✅ Location selected"}
                </p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{newLocation.address}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex-shrink-0 gap-3 pt-4 border-t border-[#2a655f]/10">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddAddressDialog(false);
                setNewLocation(null);
                setNewAddressLabel("");
                setNewAddressDetails("");
              }}
              className="rounded-xl border-slate-200/50 dark:border-slate-700/50"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleAddAddress}
              disabled={!newLocation || !newAddressLabel.trim() || !newAddressDetails.trim()}
              className="rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "إضافة العنوان" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== DIALOG: تأكيد تفريغ السلة ===== */}
      <AlertDialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
        <AlertDialogContent className="rounded-2xl border-[#2a655f]/20 shadow-2xl shadow-[#2a655f]/10 max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center animate-pulse">
                <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-[#2a655f] dark:text-white">
                  {app.lang === "ar" ? "🗑️ تفريغ السلة" : "🗑️ Clear Cart"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-muted-foreground">
                  {app.lang === "ar" 
                    ? "هل أنت متأكد من رغبتك في تفريغ سلة التسوق؟ هذا الإجراء لا يمكن التراجع عنه."
                    : "Are you sure you want to clear your shopping cart? This action cannot be undone."}
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>

          <div className="my-4 max-h-48 overflow-y-auto space-y-2">
            <p className="text-xs font-medium text-muted-foreground">
              {app.lang === "ar" ? `📦 سيتم حذف ${items.length} منتج` : `📦 ${items.length} items will be removed`}
            </p>
            {items.slice(0, 5).map((item: any) => {
              const listing = item.listing || item;
              return (
                <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                  <OptimizedImage
                    src={item.displayImage || '/placeholder.png'}
                    alt={listing.title_ar}
                    width={40}
                    height={40}
                    quality={80}
                    objectFit="cover"
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">
                      {app.lang === "ar" ? listing.title_ar : (listing.title_en || listing.title_ar)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {app.lang === "ar" ? "الكمية" : "Qty"}: {item.quantity} × {formatPrice(Number(item.price), app.currency, app.lang)}
                    </p>
                  </div>
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-0">
                    {formatPrice(item.subtotal, app.currency, app.lang)}
                  </Badge>
                </div>
              );
            })}
            {items.length > 5 && (
              <p className="text-xs text-muted-foreground text-center">
                {app.lang === "ar" ? `و ${items.length - 5} منتجات أخرى` : `and ${items.length - 5} more items`}
              </p>
            )}
          </div>

          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel className="rounded-xl border-slate-200/50 dark:border-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 transition-all duration-300">
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearCart}
              disabled={clearCart.isPending}
              className="rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all duration-300 hover:scale-[1.02]"
            >
              {clearCart.isPending ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                  {app.lang === "ar" ? "جاري التفريغ..." : "Clearing..."}
                </div>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  {app.lang === "ar" ? "تأكيد التفريغ" : "Confirm Clear"}
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default CartPage;