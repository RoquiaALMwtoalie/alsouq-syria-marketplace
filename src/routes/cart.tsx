// src/routes/cart.tsx - الكود المُصحّح بالكامل مع تصميم بسيط بألوان أبيض، رمادي، أسود، وزيتي فقط (بدون خطوات)

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, Store, Shield, 
  Truck, Clock, Award, Sparkles, Tag, X, Loader2, Gift, CheckCircle2,
  MapPin, Edit2, PlusCircle, Navigation, Home, Building2, AlertCircle,
  Percent, Package, Layers, Check, ChevronRight, Info
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
  
  const createOrder = useCreateOrder();
  const updateCartItem = useUpdateCartItem();
  const clearCart = useClearCart();
  
  const { 
    data: cart, 
    isLoading, 
    isError,
    refetch: refetchCart 
  } = useCart(app.user?.id);
  
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [freeItems, setFreeItems] = useState<any[]>([]);
  
  const [userAddresses, setUserAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [showAddAddressDialog, setShowAddAddressDialog] = useState(false);
  const [newLocation, setNewLocation] = useState<PickedLocation | null>(null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(false);
  
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressDetails, setNewAddressDetails] = useState("");
  
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryCompany, setDeliveryCompany] = useState<any>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);

  const [showClearCartDialog, setShowClearCartDialog] = useState(false);

  // ✅ State جديدة لميزة المسافة
  const [userCurrentLocation, setUserCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distanceFromSelectedAddress, setDistanceFromSelectedAddress] = useState<number | null>(null);
  const [showDistanceWarningDialog, setShowDistanceWarningDialog] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt' | null>(null);

  const isFirstRender = useRef(true);
  const deliveryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousCartState = useRef<string>("");
  
  const items = useMemo(() => {
    if (!cart?.items) return [];
    
    return cart.items.map((item: any) => {
      const price = Number(item.price);
      const quantity = Number(item.quantity);
      const subtotal = price * quantity;
      const subtotal_usd = item.price_usd ? Number(item.price_usd) * quantity : null;
      
      const listing = item.listings || item.listing || null;
      
      const isGift = item.is_free === true || item.variation_snapshot?.is_gift === true;
      
      let displayImage = listing?.cover_url || '/placeholder.png';
      
      if (item.variation_snapshot) {
        if (item.variation_snapshot.variation_image) {
          displayImage = item.variation_snapshot.variation_image;
        } else if (item.variation_snapshot.cover_url) {
          displayImage = item.variation_snapshot.cover_url;
        } else if (item.variation_snapshot.image_url) {
          displayImage = item.variation_snapshot.image_url;
        }
      }
      
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
      
      if (!displayImage || displayImage === '/placeholder.png') {
        if (listing?.cover_url) {
          displayImage = listing.cover_url;
        }
      }
      
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

      const sellerName = 
        (listing as any)?.profile?.store_name ||    
        (listing as any)?.profiles?.store_name ||   
        (listing as any)?.owner?.store_name || 
        (listing as any)?.profile?.full_name || 
        (listing as any)?.profiles?.full_name || 
        (listing as any)?.owner?.full_name || 
        (app.lang === "ar" ? "متجر" : "Store");
      
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
        sellerName,
      };
    });
  }, [cart?.items, app.lang]);

  const storeIdFromCart = useMemo(() => {
    if (!items || items.length === 0) return undefined;
    const firstItem = items[0];
    const listing = firstItem.listing || firstItem;
    return listing.owner_id || firstItem.listing_id;
  }, [items]);

  const cartTotal = useCartTotal(app.user?.id, storeIdFromCart);

  // ✅ دالة حساب المسافة (Haversine)
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

  // ✅ دالة جلب موقع المستخدم الحالي
  const getUserCurrentLocation = useCallback((): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn("Geolocation not supported");
        resolve(null);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationPermission('granted');
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.warn("Location permission denied or error:", error);
          setLocationPermission('denied');
          resolve(null);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        }
      );
    });
  }, []);

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
    const name = firstItem.sellerName;
    const logo = (listing as any)?.profile?.store_logo_url || (listing as any)?.profiles?.store_logo_url || null;
    const cover = (listing as any)?.profile?.store_cover_url || null;
    
    return { name, logo, cover };
  }, [items, app.lang]);

  const calculateDeliveryPrice = useCallback((company: any, distanceInKm: number, orderTotal: number): number => {
    const freeThreshold = company.free_delivery_threshold || 0;
    if (freeThreshold > 0 && orderTotal >= freeThreshold) return 0;

    const basePrice = company.base_price || 0;
    const pricePerKm = company.price_per_km || 0;
    let price = basePrice + (distanceInKm * pricePerKm);

    const minFee = company.min_delivery_fee || 0;
    if (price < minFee) price = minFee;

    const maxFee = company.max_delivery_fee || 999999;
    if (price > maxFee) price = maxFee;

    return Math.round(price);
  }, []);

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
            setDeliveryFee(0);
            setDeliveryCompany(null);
            return;
          }

          let selectedCompany = null;
          if (store.delivery_company_id) {
            const { data: company } = await supabase
              .from("delivery_companies")
              .select("*")
              .eq("id", store.delivery_company_id)
              .eq("is_active", true)
              .maybeSingle();
            if (company) selectedCompany = company;
          }

          if (!selectedCompany) {
            const { data: companies } = await supabase
              .from("delivery_companies")
              .select("*")
              .eq("is_active", true);

            if (companies) {
              selectedCompany = companies[0];
            }
          }

          if (!selectedCompany) {
            setDeliveryFee(0);
            setDeliveryCompany(null);
            return;
          }

          let distance = store.lat && store.lng && selectedAddress.lat && selectedAddress.lng
            ? calculateDistance(store.lat, store.lng, selectedAddress.lat, selectedAddress.lng)
            : 5;

          const fee = calculateDeliveryPrice(selectedCompany, distance, cartTotal);
          setDeliveryFee(Number(fee) || 0);
          setDeliveryCompany(selectedCompany);
        } catch (error) {
          console.error("Delivery error:", error);
        } finally {
          setIsCalculatingDelivery(false);
        }
      };
      calculateDelivery();
    }, 300);

    return () => {
      if (deliveryTimeoutRef.current) clearTimeout(deliveryTimeoutRef.current);
    };
  }, [selectedAddress, storeIdFromCart, cartTotal, calculateDistance, calculateDeliveryPrice]);

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

  // ✅ دالة التحقق من المسافة قبل تغيير العنوان
  const handleAddressChange = useCallback(async (addressId: string) => {
    const address = userAddresses.find((a: any) => a.id === addressId);
    if (!address) return;

    // إذا كان العنوان يحتوي على إحداثيات، نتحقق من المسافة
    if (address.lat && address.lng) {
      setIsGettingLocation(true);
      const currentLocation = await getUserCurrentLocation();
      setIsGettingLocation(false);

      if (currentLocation) {
        const distance = calculateDistance(
          currentLocation.lat,
          currentLocation.lng,
          address.lat,
          address.lng
        );

        // إذا كانت المسافة أكبر من 10 كم، نعرض تحذيراً
        if (distance > 10) {
          setSelectedAddressId(addressId);
          setSelectedAddress(address);
          setDistanceFromSelectedAddress(distance);
          setShowDistanceWarningDialog(true);
          return;
        }

        // المسافة قريبة، نحدث المسافة ونكمل
        setDistanceFromSelectedAddress(distance);
      } else {
        setDistanceFromSelectedAddress(null);
      }
    } else {
      setDistanceFromSelectedAddress(null);
    }

    setSelectedAddressId(addressId);
    setSelectedAddress(address);
    if (promoApplied) removePromoCode();
  }, [userAddresses, promoApplied, getUserCurrentLocation, calculateDistance]);

  const removePromoCode = useCallback(() => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoMessage("");
    setPromoData(null);
    setFreeItems([]);
    toast.info(app.lang === "ar" ? "🗑️ تم إزالة كود الخصم" : "🗑️ Promo code removed");
  }, [app.lang]);

  const handleAddAddress = useCallback(async () => {
    if (!app.user || !newLocation || !newAddressLabel.trim() || !newAddressDetails.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء تعبئة الحقول المطلوبة واختيار الموقع" : "⚠️ Please fill required fields and location");
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
      toast.error(app.lang === "ar" ? "❌ فشل إضافة العنوان" : "❌ Failed to add address");
    }
  }, [app.user, newLocation, newAddressLabel, newAddressDetails, userAddresses.length, app.lang]);

  const applyPromoCode = useCallback(async () => {
    if (!promoCode.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال كود الخصم" : "⚠️ Please enter a promo code");
      return;
    }

    if (promoApplied) {
      toast.error(
        app.lang === "ar" 
          ? "⚠️ لا يمكن تطبيق أكثر من كود خصم واحد" 
          : "⚠️ Cannot apply more than one promo code"
      );
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

      if (error || !data) {
        setPromoMessage(app.lang === "ar" ? "❌ كود غير صالح" : "❌ Invalid code");
        toast.error(app.lang === "ar" ? "❌ كود الخصم غير صالح" : "❌ Invalid promo code");
        setIsApplyingPromo(false);
        return;
      }

      const now = new Date();
      const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
      const startsAt = data.starts_at ? new Date(data.starts_at) : null;

      if (startsAt && now < startsAt) {
        setPromoMessage(app.lang === "ar" ? "⏳ الكود غير مفعل بعد" : "⏳ Code not active yet");
        toast.error(app.lang === "ar" ? "⏳ الكود غير مفعل بعد" : "⏳ Code not active yet");
        setIsApplyingPromo(false);
        return;
      }

      if (expiresAt && now > expiresAt) {
        setPromoMessage(app.lang === "ar" ? "❌ انتهت صلاحية الكود" : "❌ Code expired");
        toast.error(app.lang === "ar" ? "❌ انتهت صلاحية الكود" : "❌ Code expired");
        setIsApplyingPromo(false);
        return;
      }

      if (data.store_id) {
        const hasDifferentStore = items.some((item: any) => {
          const listing = item.listing || item;
          return listing.owner_id !== data.store_id;
        });

        if (hasDifferentStore) {
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
      }

      if (data.usage_limit && data.used_count >= data.usage_limit) {
        setPromoMessage(
          app.lang === "ar" 
            ? `❌ تم استخدام هذا الكود بالكامل` 
            : `❌ This code has been fully used`
        );
        toast.error(
          app.lang === "ar" 
            ? `❌ تم استخدام هذا الكود بالكامل` 
            : `❌ This code has been fully used`
        );
        setIsApplyingPromo(false);
        return;
      }

      const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
      const minOrder = data.min_order || 0;

      if (subtotal < minOrder) {
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

      let discount = 0;
      let discountMessage = "";

      if (data.type === "percentage") {
        discount = (subtotal * (data.value / 100));
        discountMessage = `${data.value}%`;
      } 
      else if (data.type === "fixed") {
        discount = data.value;
        discountMessage = `${formatPrice(data.value, app.currency, app.lang)}`;
      }
      else if (data.type === "free_shipping") {
        discount = deliveryFee;
        discountMessage = app.lang === "ar" ? "توصيل مجاني" : "Free Shipping";
        
        if (deliveryFee === 0) {
          setPromoMessage(app.lang === "ar" ? "✅ التوصيل مجاني بالفعل" : "✅ Shipping is already free");
          toast.info(app.lang === "ar" ? "✅ التوصيل مجاني بالفعل" : "✅ Shipping is already free");
          setIsApplyingPromo(false);
          return;
        }
      }

      if (data.max_discount && discount > data.max_discount) {
        discount = data.max_discount;
      }

      if (discount > subtotal) {
        discount = subtotal;
      }

      if (discount <= 0) {
        setPromoMessage(app.lang === "ar" ? "❌ لا يمكن تطبيق الخصم" : "❌ Cannot apply discount");
        toast.error(app.lang === "ar" ? "❌ لا يمكن تطبيق الخصم" : "❌ Cannot apply discount");
        setIsApplyingPromo(false);
        return;
      }

      setPromoApplied(true);
      setPromoDiscount(discount);
      setPromoData(data);
      setPromoMessage(
        app.lang === "ar" 
          ? `✅ خصم ${discountMessage} (${formatPrice(discount, app.currency, app.lang)})` 
          : `✅ ${discountMessage} discount (${formatPrice(discount, app.currency, app.lang)})`
      );
      
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
    }
  }, [promoCode, promoApplied, items, deliveryFee, app.lang, app.currency]);

  const handleUpdateQuantity = useCallback(async (itemId: string, newQuantity: number) => {
    if (!app.user) return;
    try {
      await updateCartItem.mutateAsync({ itemId, quantity: newQuantity, userId: app.user.id });
      if (promoApplied) removePromoCode();
    } catch (error) {
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ Error updating quantity");
    }
  }, [app.user, updateCartItem, promoApplied, removePromoCode, app.lang]);

  const handleClearCart = useCallback(() => {
    if (!app.user) return;
    setShowClearCartDialog(true);
  }, [app.user]);

  const confirmClearCart = useCallback(async () => {
    if (!app.user) return;
    try {
      await clearCart.mutateAsync({ userId: app.user.id });
      if (promoApplied) removePromoCode();
      setShowClearCartDialog(false);
      toast.success(app.lang === "ar" ? "🧹 تم تفريغ السلة" : "🧹 Cart cleared");
    } catch (error) {
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ Error");
    }
  }, [app.user, clearCart, promoApplied, removePromoCode, app.lang]);

  const checkout = useCallback(async () => {
    if (!app.user) {
      navigate({ to: "/auth/$mode", params: { mode: "login" } });
      return;
    }
    if (items.length === 0 || !selectedAddress) {
      toast.error(app.lang === "ar" ? "البيانات غير مكتملة" : "Incomplete data");
      return;
    }

    try {
      const groupedBySeller = items.reduce((acc: any, item: any) => {
        const sellerId = item.listing?.owner_id || item.listing_id;
        if (!acc[sellerId]) acc[sellerId] = [];
        acc[sellerId].push(item);
        return acc;
      }, {});

      for (const [sellerId, sellerItems] of Object.entries(groupedBySeller)) {
        const itemsList = sellerItems as any[];
        const total = itemsList.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);

        const orderData = {
          buyer_id: app.user.id,
          seller_id: sellerId,
          listing_id: itemsList[0].listing_id,
          total: total,
          quantity: itemsList.reduce((sum, item) => sum + item.quantity, 0),
          delivery_address: selectedAddress.address_text,
          delivery_lat: selectedAddress.lat || 0,
          delivery_lng: selectedAddress.lng || 0,
          status: 'pending',
          currency: itemsList[0]?.currency || 'SYP',
          delivery_fee: deliveryFee,
          promo_discount: promoApplied ? promoDiscount : 0,
          total_with_delivery: totals.total,
        };

        const { data: order, error: orderError } = await supabase
          .from("orders")
          .insert(orderData)
          .select()
          .single();

        if (orderError) throw orderError;

        const orderItems = itemsList.map((item: any) => ({
          order_id: order.id,
          listing_id: item.listing_id,
          quantity: item.quantity,
          price: Number(item.price),
          currency: item.currency || 'SYP',
          variation_combination: item.variation_combination || null,
        }));

        await supabase.from("order_items").insert(orderItems);
      }

      await clearCart.mutateAsync({ userId: app.user.id });
      toast.success(app.lang === "ar" ? "✅ تم إرسال طلبك بنجاح!" : "✅ Order placed successfully!");
      navigate({ to: "/orders" });
    } catch (error: any) {
      toast.error(error.message || "Checkout error");
    }
  }, [app.user, items, selectedAddress, deliveryFee, promoApplied, promoDiscount, totals.total, clearCart, navigate, app.lang]);

  if (isLoading || isLoadingAddresses) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f8f9fc]">
        <div className="animate-spin h-10 w-10 border-4 border-[#2a655f] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#f8f9fc] flex flex-col items-center justify-center p-4">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {app.lang === "ar" ? "سلة التسوق فارغة" : "Your cart is empty"}
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          {app.lang === "ar" ? "أضف منتجاتك المفضلة وابدأ التسوق" : "Add your favorite products and start shopping"}
        </p>
        <Link to="/">
          <Button className="mt-2 rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white px-8 shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02]">
            {app.lang === "ar" ? "ابدأ التسوق" : "Start Shopping"}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fc] text-gray-900 pb-32">
      <div className="mx-auto max-w-lg px-4 py-4 space-y-4">
        
        {/* ===== رأس الصفحة: السلة وزر الرجوع ===== */}
        <div className="flex items-center justify-between mb-2">
          <Link to="/">
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 border border-gray-200 hover:border-[#2a655f]/30 hover:text-[#2a655f] transition-all duration-200">
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#2a655f]" />
            {app.lang === "ar" ? "السلة" : "Cart"}
            <Badge className="bg-[#2a655f] text-white border-0 text-xs px-2 py-0.5 rounded-full">
              {items.length}
            </Badge>
          </h1>
          <button
            onClick={handleClearCart}
            className="h-10 w-10 flex items-center justify-center rounded-full bg-white shadow-sm text-gray-700 border border-gray-200 hover:border-red-300 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
            disabled={clearCart.isPending}
          >
            {clearCart.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* ===== تنبيه التوصيل المجاني ===== */}
        <div 
          onClick={() => setShowAddressDialog(true)}
          className="flex items-center gap-2 bg-[#e8f0ee] text-[#2a655f] px-4 py-3 rounded-2xl text-xs font-semibold cursor-pointer shadow-sm border border-[#2a655f]/20 hover:border-[#2a655f]/50 transition-all duration-200"
        >
          <MapPin className="h-4 w-4 text-[#2a655f] shrink-0" />
          <span className="truncate flex-1">
            {selectedAddress 
              ? selectedAddress.address_text 
              : (app.lang === "ar" ? "أضف عنوان الشحن لمعرفة الحد المطلوب للتوصيل المجاني" : "Add shipping address for free delivery info")}
          </span>
          {distanceFromSelectedAddress !== null && (
            <Badge className={cn(
              "text-[9px] px-2 py-0.5 shrink-0",
              distanceFromSelectedAddress > 10
                ? "bg-amber-500/20 text-amber-700 border border-amber-400/40"
                : "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20"
            )}>
              {distanceFromSelectedAddress.toFixed(1)} {app.lang === "ar" ? "كم" : "km"}
            </Badge>
          )}
          <ChevronRight className="h-4 w-4 text-[#2a655f]/50 shrink-0" />
        </div>

        {/* ===== عرض المنتجات ===== */}
        {items.map((item: any) => {
          const isDiscount = item.isDiscountOffer === true;
          const isPromo = item.isPromoOffer === true;
          const discountPercent = item.listing?.discount_percent || 0;
          const oldPrice = item.listing?.old_price ? Number(item.listing.old_price) : null;
          const price = Number(item.price);

          return (
            <div key={item.id} className="space-y-2">
              
              <div className="flex items-center justify-between px-1">
                <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                  <Store className="h-3.5 w-3.5 text-[#2a655f]" />
                  {item.sellerName}
                </span>
                <span className="text-xs font-bold text-[#0a0a0a]">
                  {formatPrice(item.subtotal, app.currency, app.lang)}
                </span>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200 flex gap-3 relative hover:border-[#2a655f]/30 transition-all duration-200">
                
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      {isDiscount && discountPercent > 0 && (
                        <Badge className="bg-[#2a655f] text-white border-0 text-[9px] px-2 py-0.5 rounded-full">
                          🔥 -{discountPercent}%
                        </Badge>
                      )}
                      {isPromo && (
                        <Badge className="bg-[#2a655f] text-white border-0 text-[9px] px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Gift className="h-2.5 w-2.5" />
                          {app.lang === "ar" ? "عرض ترويجي" : "Promo"}
                        </Badge>
                      )}
                    </div>

                    <h3 className="font-bold text-sm text-gray-800 line-clamp-2">
                      {item.displayTitle}
                    </h3>
                    
                    {item.variationName && (
                      <div className="mt-1.5 inline-flex items-center bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-0.5 rounded-lg">
                        {item.variationName}
                      </div>
                    )}

                    <div className="mt-1.5 flex items-center gap-2 flex-wrap">
                      {isDiscount && oldPrice && oldPrice > price ? (
                        <>
                          <span className="text-xs text-gray-400 line-through font-medium">
                            {formatPrice(oldPrice, app.currency, app.lang)}
                          </span>
                          <span className="text-sm font-bold text-[#0a0a0a]">
                            {formatPrice(price, app.currency, app.lang)}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-bold text-[#0a0a0a]">
                          {formatPrice(price, app.currency, app.lang)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="h-8 w-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-bold transition"
                        disabled={updateCartItem.isPending}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center font-bold text-xs text-[#0a0a0a]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="h-8 w-8 flex items-center justify-center text-gray-700 hover:bg-gray-200 font-bold transition"
                        disabled={updateCartItem.isPending || item.quantity <= 1}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleUpdateQuantity(item.id, 0)}
                      className="h-8 w-8 flex items-center justify-center text-red-500 hover:bg-red-50 rounded-xl transition ml-auto"
                      disabled={updateCartItem.isPending}
                      title="حذف"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="h-20 w-20 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                  <OptimizedImage
                    src={item.displayImage}
                    alt={item.displayTitle}
                    width={80}
                    height={80}
                    quality={80}
                    objectFit="cover"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          );
        })}

        {/* ===== كود الخصم ===== */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          {promoApplied ? (
            <div className="flex items-center justify-between p-3 bg-[#e8f0ee] rounded-xl border border-[#2a655f]/30">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#2a655f]" />
                <span className="text-sm font-bold text-[#2a655f]">
                  {promoMessage}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-[#2a655f]/10 border border-[#2a655f]/20"
                onClick={removePromoCode}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2a655f]/50" />
                <Input
                  placeholder={app.lang === "ar" ? "🎫 كود الخصم" : "🎫 Promo code"}
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                  className="pl-9 h-11 rounded-xl border-2 border-gray-200 focus:border-[#2a655f] focus:ring-[#2a655f]/20 text-sm font-medium bg-white"
                  onKeyDown={(e) => e.key === "Enter" && applyPromoCode()}
                  disabled={isApplyingPromo}
                />
              </div>
              <Button
                onClick={applyPromoCode}
                disabled={isApplyingPromo}
                className="h-11 px-5 rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white font-bold shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02]"
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
            <p className="text-xs text-red-500 mt-1 font-medium">{promoMessage}</p>
          )}
        </div>

        {/* ===== عرض الخصم المطبق ===== */}
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm text-[#2a655f] py-2 px-4 bg-[#e8f0ee] rounded-xl border border-[#2a655f]/20">
            <span className="font-bold">{app.lang === "ar" ? "💚 الخصم" : "💚 Discount"}</span>
            <span className="font-bold text-[#0a0a0a]">-{formatPrice(promoDiscount, app.currency, app.lang)}</span>
          </div>
        )}

        {/* ===== المجموع الفرعي والتوصيل - الأرقام باللون الأسود الغامق ===== */}
      <div className="flex justify-between text-sm py-1">
  <span className="font-bold text-[#0a0a0a]">
    {app.lang === "ar" ? "المجموع الفرعي" : "Subtotal"}
  </span>
  <span className="font-bold text-[#0a0a0a] text-base">
    {formatPrice(totals.subtotal, app.currency, app.lang)}
  </span>
</div>
<div className="flex justify-between text-sm py-1 border-b border-gray-100">
  <span className="font-bold text-[#0a0a0a]">
    {app.lang === "ar" ? "التوصيل" : "Delivery"}
  </span>
  {deliveryFee === 0 ? (
    <span className="font-bold text-[#2a655f]">
      {app.lang === "ar" ? "🆓 مجاني" : "🆓 Free"}
    </span>
  ) : (
    <span className="font-bold text-[#0a0a0a] text-base">
      {formatPrice(deliveryFee, app.currency, app.lang)}
    </span>
  )}
</div>

        {/* ===== زر ومجموع الفاتورة الثابت بالأسفل - المبلغ الإجمالي بالأسود الغامق ===== */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-30">
          <div className="max-w-lg mx-auto flex items-center justify-between mb-3 px-1">
           <span className="text-xs font-bold text-[#0a0a0a]">
  {app.lang === "ar" ? "المبلغ الإجمالي" : "Total Amount"}
</span>
            <span className="text-xl font-extrabold text-[#0a0a0a]">
              {formatPrice(totals.total, app.currency, app.lang)}
            </span>
          </div>
          
          <div className="max-w-lg mx-auto flex gap-2">
            <Button 
              className="w-full h-12 rounded-2xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white font-bold shadow-lg shadow-[#2a655f]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-sm flex items-center justify-center gap-2"
              onClick={checkout}
              disabled={createOrder.isPending || !selectedAddress}
            >
              {createOrder.isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {app.lang === "ar" ? "جاري الإتمام..." : "Processing..."}
                </>
              ) : (
                <>
                  <ShoppingBag className="h-5 w-5" />
                  <span>{app.lang === "ar" ? "إتمام الطلب" : "Place Order"}</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>

      </div>

      {/* ===== نافذة اختيار العنوان ===== */}
      <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
        <DialogContent className="rounded-2xl max-w-md bg-white border-2 border-[#2a655f]/20 shadow-xl">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#e8f0ee] flex items-center justify-center">
                <MapPin className="h-5 w-5 text-[#2a655f]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-[#2a655f]">
                  {app.lang === "ar" ? "📍 اختيار عنوان التوصيل" : "📍 Select Delivery Address"}
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  {app.lang === "ar" ? "اختر عنواناً من قائمتك" : "Choose an address from your list"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {userAddresses.map((addr: any) => (
              <div
                key={addr.id}
                onClick={() => {
                  handleAddressChange(addr.id);
                  setShowAddressDialog(false);
                }}
                className={cn(
                  "p-3 rounded-xl border-2 cursor-pointer flex items-center justify-between transition-all duration-200",
                  selectedAddressId === addr.id
                    ? "border-[#2a655f] bg-[#e8f0ee]"
                    : "border-gray-200 hover:border-[#2a655f]/30 hover:bg-gray-50"
                )}
              >
                <div>
                  <p className="font-bold text-xs text-gray-900 flex items-center gap-2">
                    {addr.label}
                    {addr.is_default && (
                      <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-2 border-[#2a655f]/20 text-[9px] px-2 py-0.5">
                        {app.lang === "ar" ? "افتراضي" : "Default"}
                      </Badge>
                    )}
                  </p>
                  <p className="text-[11px] text-gray-500 line-clamp-1">{addr.address_text}</p>
                </div>
                {selectedAddressId === addr.id && (
                  <Check className="h-5 w-5 text-[#2a655f]" />
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                setShowAddressDialog(false);
                setShowAddAddressDialog(true);
              }}
              className="w-full rounded-xl border-dashed border-2 border-[#2a655f]/30 text-[#2a655f] font-bold hover:bg-[#e8f0ee] hover:border-[#2a655f]/50"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "إضافة عنوان جديد" : "Add New Address"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== نافذة إضافة عنوان جديد ===== */}
      <Dialog open={showAddAddressDialog} onOpenChange={(open) => {
        setShowAddAddressDialog(open);
        if (!open) {
          setNewLocation(null);
          setNewAddressLabel("");
          setNewAddressDetails("");
        }
      }}>
        <DialogContent className="rounded-2xl max-w-md max-h-[90vh] bg-white border-2 border-[#2a655f]/20 shadow-xl flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#e8f0ee] flex items-center justify-center">
                <PlusCircle className="h-5 w-5 text-[#2a655f]" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-[#2a655f]">
                  {app.lang === "ar" ? "📍 إضافة عنوان جديد" : "📍 Add New Address"}
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500">
                  {app.lang === "ar" ? "أدخل تفاصيل العنوان الجديد" : "Enter new address details"}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto space-y-4 py-4 px-1">
            <div>
              <Label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                <Home className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "اسم العنوان" : "Address Label"}
                <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newAddressLabel}
                onChange={(e) => setNewAddressLabel(e.target.value)}
                placeholder={app.lang === "ar" ? "مثال: المنزل، العمل، المكتب" : "e.g. Home, Work, Office"}
                className="mt-1.5 h-11 rounded-xl border-2 border-gray-200 focus:border-[#2a655f] focus:ring-[#2a655f]/20 font-medium bg-white"
              />
            </div>
            
            <AddressPicker 
              value={newLocation ?? undefined} 
              onChange={setNewLocation} 
              lang={app.lang} 
            />
            
            <div>
              <Label className="text-sm font-bold text-gray-700 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-[#2a655f]" />
                {app.lang === "ar" ? "تفاصيل إضافية" : "Additional Details"}
                <span className="text-red-500">*</span>
              </Label>
              <Textarea
                value={newAddressDetails}
                onChange={(e) => setNewAddressDetails(e.target.value)}
                placeholder={app.lang === "ar" 
                  ? "رقم الطابق، رقم الشقة، معلم قريب..." 
                  : "Floor number, apartment number, nearby landmark..."}
                rows={2}
                className="mt-1.5 rounded-xl border-2 border-gray-200 focus:border-[#2a655f] focus:ring-[#2a655f]/20 resize-none font-medium bg-white"
              />
            </div>
            
            {newLocation && (
              <div className="p-3 bg-[#e8f0ee] rounded-xl border border-[#2a655f]/20">
                <p className="text-sm font-bold text-[#2a655f] flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {app.lang === "ar" ? "✅ تم اختيار الموقع" : "✅ Location selected"}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-1">{newLocation.address}</p>
              </div>
            )}
          </div>
          
          <DialogFooter className="flex-shrink-0 gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddAddressDialog(false);
                setNewLocation(null);
                setNewAddressLabel("");
                setNewAddressDetails("");
              }}
              className="rounded-xl border-2 border-gray-200 font-bold hover:bg-gray-50"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleAddAddress}
              disabled={!newLocation || !newAddressLabel.trim() || !newAddressDetails.trim()}
              className="rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02] font-bold"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "إضافة العنوان" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== نافذة تفريغ السلة الاحترافية والناعمة ===== */}
      <AlertDialog open={showClearCartDialog} onOpenChange={setShowClearCartDialog}>
        <AlertDialogContent className="rounded-3xl max-w-md bg-white border-0 shadow-2xl shadow-red-500/10 overflow-hidden p-0">
          {/* Header gradient */}
          <div className="bg-gradient-to-r from-red-500/10 to-rose-500/10 px-6 pt-6 pb-4 border-b border-red-100/50">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center shadow-lg shadow-red-500/25">
                <Trash2 className="h-7 w-7 text-white" />
              </div>
              <div>
                <AlertDialogTitle className="text-xl font-bold text-gray-900">
                  {app.lang === "ar" ? "🗑️ تفريغ السلة" : "🗑️ Clear Cart"}
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-gray-500 mt-0.5">
                  {app.lang === "ar" 
                    ? "سيتم إزالة جميع المنتجات من سلة التسوق" 
                    : "All items will be removed from your cart"}
                </AlertDialogDescription>
              </div>
            </div>
          </div>

          {/* محتوى المنتجات */}
          <div className="px-6 py-4 max-h-48 overflow-y-auto">
            <div className="space-y-2">
              {items.slice(0, 4).map((item: any) => {
                const listing = item.listing || item;
                return (
                  <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-xl border border-gray-100">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <OptimizedImage
                        src={item.displayImage || '/placeholder.png'}
                        alt={item.displayTitle}
                        width={40}
                        height={40}
                        quality={80}
                        objectFit="cover"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-700 line-clamp-1">{item.displayTitle}</p>
                      <p className="text-[10px] text-gray-400">
                        {app.lang === "ar" ? "الكمية" : "Qty"}: {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-[#0a0a0a]">
                      {formatPrice(item.subtotal, app.currency, app.lang)}
                    </span>
                  </div>
                );
              })}
              {items.length > 4 && (
                <p className="text-[10px] text-gray-400 text-center font-medium">
                  {app.lang === "ar" ? `و ${items.length - 4} منتجات أخرى` : `and ${items.length - 4} more items`}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50/80 border-t border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">
                {app.lang === "ar" ? "عدد المنتجات" : "Items"}
              </span>
              <span className="text-sm font-bold text-[#0a0a0a]">
                {items.length}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                {app.lang === "ar" ? "المجموع" : "Total"}
              </span>
              <span className="text-base font-extrabold text-[#0a0a0a]">
                {formatPrice(totals.total, app.currency, app.lang)}
              </span>
            </div>
          </div>

          <AlertDialogFooter className="px-6 pb-6 pt-2 gap-3">
            <AlertDialogCancel className="rounded-2xl border-2 border-gray-200 font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 h-11 px-6 flex-1">
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmClearCart}
              disabled={clearCart.isPending}
              className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] font-bold h-11 px-6 flex-1"
            >
              {clearCart.isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {app.lang === "ar" ? "جاري التفريغ..." : "Clearing..."}
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  {app.lang === "ar" ? "تأكيد التفريغ" : "Confirm Clear"}
                </div>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ===== نافذة تحذير المسافة (جديدة) ===== */}
      <Dialog open={showDistanceWarningDialog} onOpenChange={setShowDistanceWarningDialog}>
        <DialogContent className="rounded-3xl max-w-md bg-white border-2 border-amber-400/40 shadow-2xl shadow-amber-500/20 p-0 overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 px-6 pt-6 pb-4 border-b border-amber-200/50">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/25 animate-pulse">
                <AlertCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-gray-900">
                  {app.lang === "ar" ? "⚠️ تنبيه الموقع" : "⚠️ Location Warning"}
                </DialogTitle>
                <DialogDescription className="text-xs text-gray-500 mt-0.5">
                  {app.lang === "ar" 
                    ? "أنت بعيد عن العنوان المختار" 
                    : "You are far from the selected address"}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* المحتوى */}
          <div className="p-6 space-y-4">
            
            {/* بطاقة المسافة */}
            <div className="bg-amber-50 dark:bg-amber-950/20 rounded-2xl p-4 border-2 border-amber-200/50 dark:border-amber-800/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-amber-700 dark:text-amber-300 font-medium flex items-center gap-2">
                  <Navigation className="h-4 w-4" />
                  {app.lang === "ar" ? "المسافة بينك وبين العنوان" : "Distance from your location"}
                </span>
                <Badge className="bg-amber-500 text-white border-0 text-xs px-3 py-1 font-bold">
                  {distanceFromSelectedAddress?.toFixed(1)} {app.lang === "ar" ? "كم" : "km"}
                </Badge>
              </div>
              
              <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-amber-800/30">
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {app.lang === "ar" 
                    ? "📍 الموقع الحالي: تم اكتشافه بنجاح"
                    : "📍 Current location: detected successfully"}
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
                  {app.lang === "ar" 
                    ? `🏠 العنوان المختار: ${selectedAddress?.label || selectedAddress?.address_text}`
                    : `🏠 Selected address: ${selectedAddress?.label || selectedAddress?.address_text}`}
                </p>
              </div>
            </div>

            {/* التحذير */}
            <div className="bg-red-50 dark:bg-red-950/20 rounded-xl p-4 border-2 border-red-200/50 dark:border-red-800/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0 animate-pulse" />
                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-400">
                    {app.lang === "ar"
                      ? "⚠️ هل أنت متأكد من اختيار هذا العنوان؟"
                      : "⚠️ Are you sure about this address?"}
                  </p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">
                    {app.lang === "ar"
                      ? "أنت حالياً بعيد عن هذا العنوان. قد يؤثر ذلك على وقت التوصيل."
                      : "You are currently far from this address. This may affect delivery time."}
                  </p>
                </div>
              </div>
            </div>

            {/* نصائح */}
            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-xl p-3 border border-blue-200/50 dark:border-blue-800/30">
              <p className="text-xs text-blue-700 dark:text-blue-300 flex items-start gap-2">
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                {app.lang === "ar"
                  ? "💡 إذا كنت تطلب لمنزل آخر أو لشخص آخر، يمكنك المتابعة بأمان."
                  : "💡 If you're ordering for another home or person, you can safely continue."}
              </p>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-6 pt-0 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowDistanceWarningDialog(false);
                // إعادة تعيين العنوان السابق
                const previousAddress = userAddresses.find((a: any) => a.id !== selectedAddressId);
                if (previousAddress) {
                  setSelectedAddressId(previousAddress.id);
                  setSelectedAddress(previousAddress);
                  setDistanceFromSelectedAddress(null);
                }
              }}
              className="flex-1 rounded-xl border-2 border-gray-300 font-bold hover:bg-gray-50 h-11"
            >
              {app.lang === "ar" ? "تغيير العنوان" : "Change Address"}
            </Button>
            <Button
              onClick={() => {
                setShowDistanceWarningDialog(false);
                if (promoApplied) removePromoCode();
              }}
              className="flex-1 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30 font-bold h-11"
            >
              {app.lang === "ar" ? "متابعة على أي حال" : "Continue Anyway"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}

export default CartPage;