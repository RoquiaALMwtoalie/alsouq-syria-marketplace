// src/routes/cart.tsx - الكود المُصحّح بالكامل مع دعم العروض الترويجية

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, Store, Shield, 
  Truck, Clock, Award, Sparkles, Tag, X, Loader2, Gift, CheckCircle2,
  MapPin, Edit2, PlusCircle, Navigation, Home, Building2, AlertCircle,
  Percent, Package
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
  
  // ✅ ✅ ✅ State لإضافة عنوان جديد (إجباري)
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressDetails, setNewAddressDetails] = useState("");
  
  // ✅ State للتوصيل
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryCompany, setDeliveryCompany] = useState<any>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);

  // ✅ State لديالوغ تفريغ السلة
  const [showClearCartDialog, setShowClearCartDialog] = useState(false);

  // ✅ ✅ ✅ استخدام useRef لمنع إعادة التحميل غير المحدودة
  const isFirstRender = useRef(true);
  const deliveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousCartState = useRef<string>("");

  // ✅ جلب السلة
  const { 
    data: cart, 
    isLoading, 
    isError,
    refetch: refetchCart 
  } = useCart(app.user?.id);
  
  // ✅✅✅ تعريف items (أولاً)
  const items = useMemo(() => {
    if (!cart?.items) return [];
    
    return cart.items.map((item: any) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      const subtotal = price * quantity;
      const subtotal_usd = item.price_usd ? Number(item.price_usd) * quantity : null;
      
      return {
        ...item,
        subtotal,
        subtotal_usd,
        listing: item.listing || null,
        // ✅ ✅ ✅ تحديد نوع العنصر
        isPromoOffer: item.is_promo_offer === true,
        isDiscountOffer: item.listing?.is_offer === true && item.is_promo_offer !== true,
      };
    });
  }, [cart?.items]);

  // ✅✅✅ جب storeId من أول منتج في السلة (ثانياً - بعد تعريف items)
  const storeIdFromCart = useMemo(() => {
    if (!items || items.length === 0) return undefined;
    const firstItem = items[0];
    const listing = firstItem.listing || firstItem;
    return listing.owner_id || firstItem.listing_id;
  }, [items]);

  // ✅✅✅ حساب قيمة السلة (ثالثاً - بعد storeIdFromCart)
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

  // ✅ ✅ ✅ استخراج اسم المتجر وصورته من أول منتج في السلة
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

  // ✅ دالة حساب المسافة (هافرسين)
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

  // ✅✅✅ حساب الإجماليات
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

  // ✅ ✅ ✅ إضافة عنوان جديد (مع التحقق من الإجبارية)
  const handleAddAddress = useCallback(async () => {
    if (!app.user || !newLocation) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء اختيار الموقع على الخريطة" : "⚠️ Please select a location on the map");
      return;
    }
    
    if (!newAddressLabel.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال اسم للعنوان (مثال: المنزل، العمل)" : "⚠️ Please enter a label for the address (e.g. Home, Work)");
      return;
    }
    
    if (!newAddressDetails.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال تفاصيل إضافية للعنوان (رقم الطابق، رقم الشقة، معلم قريب)" : "⚠️ Please enter additional details (floor, apartment, nearby landmark)");
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

  // ✅ ✅ ✅ التحقق: هل يوجد كود مطبق بالفعل؟
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
      return;
    }

    if (expiresAt && now > expiresAt) {
      console.log("❌ [PROMO] Code expired");
      setPromoMessage(app.lang === "ar" ? "❌ انتهت صلاحية الكود" : "❌ Code expired");
      toast.error(app.lang === "ar" ? "❌ انتهت صلاحية الكود" : "❌ Code expired");
      return;
    }

    console.log("✅ [PROMO] Code is valid (active and within date range)");

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
      return;
    }

    if (data.usage_limit) {
      const remaining = data.usage_limit - data.used_count;
      console.log(`📌 [PROMO] Remaining uses: ${remaining}`);
      if (remaining <= 2) {
        toast.warning(
          app.lang === "ar" 
            ? `⚠️ تبقى ${remaining} استخدام${remaining > 1 ? 'ات' : ''} فقط لهذا الكود` 
            : `⚠️ Only ${remaining} use${remaining > 1 ? 's' : ''} remaining for this code`
        );
      }
    }
    console.log("✅ [PROMO] Usage limit check passed");

    const { data: existingUsage, error: usageCheckError } = await supabase
      .from("promo_code_usage")
      .select(`
        id,
        order_id,
        status,
        orders:order_id (
          id,
          status
        )
      `)
      .eq("promo_code_id", data.id)
      .eq("user_id", app.user.id)
      .eq("status", 'pending')
      .maybeSingle();

    if (!usageCheckError && existingUsage) {
      console.log("❌ [PROMO] Code is already in use with a pending order");
      
      const orderId = existingUsage.order_id;
      
      setPromoMessage(
        app.lang === "ar" 
          ? `⚠️ هذا الكود قيد الاستخدام في طلب آخر (#${String(orderId).slice(0, 8)})، انتظر حتى يتم قبوله أو رفضه` 
          : `⚠️ This code is already used in another pending order (#${String(orderId).slice(0, 8)}), wait until it's accepted or rejected`
      );
      toast.warning(
        app.lang === "ar" 
          ? `⚠️ هذا الكود قيد الاستخدام في طلب آخر، انتظر حتى يتم قبوله أو رفضه` 
          : `⚠️ This code is already used in another pending order`
      );
      return;
    }
    console.log("✅ [PROMO] No pending usage found");

    if (data.store_id) {
      console.log("🔍 [PROMO] Step 6: Checking store specificity...");
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
        return;
      }
      console.log("✅ [PROMO] All products belong to the correct store");
    } else {
      console.log("✅ [PROMO] Step 6: Code is public (no store restriction)");
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

  // ✅ تفريغ السلة - فتح الديالوغ
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
      // ✅ ✅ ✅ طباعة القيم قبل الحفظ للتحقق
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

        // ✅ ✅ ✅ حساب total_with_delivery بشكل صحيح
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
          
          // ✅ ✅ ✅ تأكد من حفظ القيم بشكل صحيح
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

        const orderItems = itemsList.map((item: any) => ({
          order_id: order.id,
          listing_id: item.listing_id,
          quantity: item.quantity,
          price: Number(item.price),
          currency: item.currency || 'SYP',
          variation_combination: item.variation_combination || null,
        }));

        const { error: itemsError } = await supabase
          .from("order_items")
          .insert(orderItems);

        if (itemsError) throw itemsError;

        if (promoApplied && promoData && order) {
          try {
            const { error: usageError } = await supabase
              .from("promo_code_usage")
              .insert({
                promo_code_id: promoData.id,
                user_id: app.user.id,
                order_id: order.id,
                discount_amount: promoDiscount,
                used_at: new Date().toISOString(),
                status: 'pending',
                metadata: {
                  subtotal: totals.subtotal,
                  delivery_fee: deliveryFee,
                  total: totals.total,
                  free_items: freeItems,
                }
              });
            
            if (usageError) {
              console.error("❌ Error recording promo usage:", usageError);
            } else {
              console.log(`✅ Promo code ${promoData.code} usage recorded for order ${order.id} (pending)`);
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
           link_url: `/dashboard`,
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
        
        {/* ===== HEADER ===== */}
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
            
            {/* ✅ عرض اسم المتجر مع اللوغو */}
            <div className="mt-2 flex items-center gap-3 p-2.5 bg-[#2a655f]/5 rounded-xl border border-[#2a655f]/10 hover:border-[#2a655f]/30 transition-all duration-300 max-w-md">
              <div className="h-9 w-9 rounded-lg overflow-hidden border-2 border-[#2a655f]/20 flex-shrink-0 bg-gradient-to-br from-[#0d2e2a] to-[#1a4f4a]">
                {storeInfo.logo ? (
                  <img 
                    src={storeInfo.logo} 
                    alt={storeInfo.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      e.target.style.display = 'none';
                    }}
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

        {/* ===== MAIN CONTENT ===== */}
        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          
          {/* ===== CART ITEMS ===== */}
          <div className="space-y-4">
            {/* ✅ عرض العنوان الحالي مع إمكانية التغيير */}
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
              
              {/* ✅ عرض معلومات التوصيل */}
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

            {/* ✅ ✅ ✅ قائمة المنتجات مع تصنيفها (منتج عادي / عرض تخفيضي / عرض ترويجي) */}
            {items.map((item: any) => {
              const listing = item.listing || item;
              const isPromoOffer = item.isPromoOffer === true;
              const isDiscountOffer = item.isDiscountOffer === true;
              const isRegularProduct = !isPromoOffer && !isDiscountOffer;
              
              return (
                <div 
                  key={item.id} 
                  className={cn(
                    "group bg-white dark:bg-slate-900/80 rounded-2xl border p-4 hover:shadow-xl transition-all duration-300 hover:scale-[1.01]",
                    isPromoOffer && "border-purple-500/50 hover:border-purple-500/80 hover:shadow-purple-500/20",
                    isDiscountOffer && "border-red-500/50 hover:border-red-500/80 hover:shadow-red-500/20",
                    isRegularProduct && "border-slate-200/50 dark:border-slate-700/50 hover:border-[#2a655f]/30"
                  )}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 mx-auto sm:mx-0">
                      <img 
                        src={listing.cover_url || '/placeholder.png'} 
                        alt={app.lang === "ar" ? listing.title_ar : listing.title_en || listing.title_ar}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                      {/* ✅ شارة نوع العنصر على الصورة */}
                      {isPromoOffer && (
                        <div className="absolute top-1 left-1">
                          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 text-[8px] px-1.5 py-0.5">
                            <Gift className="h-2.5 w-2.5 inline mr-0.5" />
                            {app.lang === "ar" ? "ترويجي" : "Promo"}
                          </Badge>
                        </div>
                      )}
                      {isDiscountOffer && (
                        <div className="absolute top-1 left-1">
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[8px] px-1.5 py-0.5">
                            <Percent className="h-2.5 w-2.5 inline mr-0.5" />
                            {app.lang === "ar" ? "تخفيض" : "Sale"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          {/* ✅ عرض ترويجي - شارة كبيرة */}
                          {isPromoOffer && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-0 text-[9px] mb-1">
                              <Gift className="h-3 w-3 mr-1" />
                              {app.lang === "ar" ? "🎁 عرض ترويجي" : "🎁 Promo Offer"}
                            </Badge>
                          )}
                          
                          {/* ✅ عرض تخفيضي - شارة */}
                          {isDiscountOffer && (
                            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 text-[9px] mb-1">
                              <Percent className="h-3 w-3 mr-1" />
                              {app.lang === "ar" ? "🔥 عرض تخفيض" : "🔥 Discount"}
                              {listing.discount_percent && ` ${listing.discount_percent}%`}
                            </Badge>
                          )}
                          
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors line-clamp-1">
                            {app.lang === "ar" ? listing.title_ar : (listing.title_en || listing.title_ar)}
                          </h3>
                          
                          {/* ✅ عرض التركيبة المختارة */}
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            {item.variation_combination && Object.keys(item.variation_combination).length > 0 ? (
                              <>
                                {Object.entries(item.variation_combination).map(([key, value]) => (
                                  <Badge key={key} variant="secondary" className="text-[10px] bg-[#2a655f]/10 text-[#2a655f] border-[#2a655f]/20">
                                    {key === "colors" ? "🎨" : key === "sizes" ? "📏" : "🔹"} {String(value)}
                                  </Badge>
                                ))}
                              </>
                            ) : (
                              <>
                                {item.selected_color && (
                                  <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800">
                                    🎨 {item.selected_color}
                                  </Badge>
                                )}
                                {item.selected_size && (
                                  <Badge variant="secondary" className="text-[10px] bg-slate-100 dark:bg-slate-800">
                                    📏 {item.selected_size}
                                  </Badge>
                                )}
                              </>
                            )}
                          </div>
                          
                          {/* ✅ عرض تفاصيل العرض الترويجي (الهدية) */}
                          {isPromoOffer && item.offer_data && (
                            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 flex-wrap">
                              <Gift className="h-3 w-3" />
                              {app.lang === "ar" 
                                ? `🎁 هدية: ${item.offer_data.get_quantity || 1} مجاناً`
                                : `🎁 Gift: ${item.offer_data.get_quantity || 1} free`
                              }
                              {item.selected_gift_variation && (
                                <Badge variant="outline" className="text-[9px] border-emerald-300/50 text-emerald-600">
                                  ✅ {app.lang === "ar" ? "فيرنت مختار" : "Variation selected"}
                                </Badge>
                              )}
                            </div>
                          )}
                          
                          {/* ✅ السعر */}
                          <div className="mt-2 flex items-center gap-3 flex-wrap">
                            <span className="text-xl font-bold text-[#2a655f] dark:text-[#3a8a82]">
                              {formatPrice(Number(item.price || listing.price), app.currency, app.lang)}
                            </span>
                            {listing.old_price && listing.old_price > 0 && (
                              <span className="text-xs text-muted-foreground line-through">
                                {formatPrice(Number(listing.old_price), app.currency, app.lang)}
                              </span>
                            )}
                            {isPromoOffer && (
                              <Badge className="bg-emerald-500/90 text-white border-0 text-[9px]">
                                ✅ {app.lang === "ar" ? "عرض" : "Offer"}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center border-2 rounded-xl overflow-hidden shadow-sm border-[#2a655f]/20">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-10 w-10 flex items-center justify-center hover:bg-[#2a655f]/10 transition text-[#2a655f]"
                              disabled={updateCartItem.isPending}
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
                      
                      <div className="mt-2 text-right text-sm text-muted-foreground">
                        {app.lang === "ar" ? "المجموع" : "Subtotal"}: 
                        <span className="font-bold text-[#2a655f] dark:text-[#3a8a82]">
                          {formatPrice(item.subtotal, app.currency, app.lang)}
                        </span>
                      </div>
                    </div>
                  </div>
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

                {/* ✅ كود الخصم */}
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
            
            {/* ✅ حقل اسم العنوان (إجباري) */}
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
            
            {/* ✅ الخريطة */}
            <AddressPicker 
              value={newLocation ?? undefined} 
              onChange={setNewLocation} 
              lang={app.lang} 
            />
            
            {/* ✅ حقل التفاصيل الإضافية (إجباري) */}
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
            
            {/* ✅ عرض الموقع المختار */}
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
                  <img 
                    src={listing.cover_url || '/placeholder.png'} 
                    alt={listing.title_ar}
                    className="h-10 w-10 rounded-lg object-cover"
                    onError={(e) => (e.target as HTMLImageElement).src = '/placeholder.png'}
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