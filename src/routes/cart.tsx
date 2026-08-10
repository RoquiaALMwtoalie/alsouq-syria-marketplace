// src/routes/cart.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, Store, Shield, 
  Truck, Clock, Award, Sparkles, Tag, X, Loader2, Gift, CheckCircle2,
  MapPin, Edit2, PlusCircle, Navigation, Home, Building2
} from "lucide-react";
import { useState, useCallback, useMemo, useEffect } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  
  // ✅ State للتوصيل
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [deliveryCompany, setDeliveryCompany] = useState<any>(null);
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);

  // ✅ جلب السلة
  const { 
    data: cart, 
    isLoading, 
    isError,
    refetch: refetchCart 
  } = useCart(app.user?.id);

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

  // ✅✅✅ تعريف items (قبل useEffect حق التوصيل)
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
      };
    });
  }, [cart?.items]);

  // ✅✅✅ حساب التوصيل (بعد تعريف items)
  useEffect(() => {
    const calculateDelivery = async () => {
      if (!selectedAddress || !cart?.store?.id) {
        setDeliveryFee(0);
        return;
      }
      
      setIsCalculatingDelivery(true);
      try {
        const { data: companies } = await supabase
          .from("delivery_companies")
          .select("*")
          .eq("is_active", true)
          .limit(1);
        
        const company = companies?.[0];
        if (!company) {
          setDeliveryFee(0);
          setDeliveryCompany(null);
          return;
        }
        
        let distance = 5;
        if (selectedAddress.lat && selectedAddress.lng) {
          distance = 5 + Math.random() * 10;
        }
        
        let fee = (company.base_price || 0) + (distance * (company.price_per_km || 0));
        fee = Math.max(fee, company.min_delivery_fee || 0);
        fee = Math.min(fee, company.max_delivery_fee || 999999);
        fee = Math.round(fee);
        
        const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
        const freeThreshold = company.free_delivery_threshold || 0;
        
        if (freeThreshold > 0 && subtotal >= freeThreshold) {
          fee = 0;
        }
        
        setDeliveryFee(fee);
        setDeliveryCompany(company);
        
      } catch (error) {
        console.error("❌ Error calculating delivery:", error);
        setDeliveryFee(0);
      } finally {
        setIsCalculatingDelivery(false);
      }
    };
    
    calculateDelivery();
  }, [selectedAddress, cart?.store?.id, items]);

  // ✅✅✅ حساب الإجماليات (بعد items و deliveryFee)
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
      
      // ✅ إلغاء كود الخصم عند تغيير العنوان (قد يتغير التوصيل)
      if (promoApplied) {
        removePromoCode();
      }
    }
  }, [userAddresses, promoApplied]);

  // ✅ إضافة عنوان جديد
  const handleAddAddress = useCallback(async () => {
    if (!app.user || !newLocation) return;
    
    try {
      const { error } = await supabase
        .from("user_addresses")
        .insert({
          user_id: app.user.id,
          label: newLocation.label || (app.lang === "ar" ? "عنوان جديد" : "New Address"),
          address_text: newLocation.address,
          details: newLocation.details || "",
          lat: newLocation.lat || 0,
          lng: newLocation.lng || 0,
          is_default: userAddresses.length === 0,
        });
      
      if (error) throw error;
      
      toast.success(app.lang === "ar" ? "✅ تم إضافة العنوان بنجاح" : "✅ Address added successfully");
      
      // ✅ إعادة تحميل العناوين
      const { data } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", app.user.id)
        .order("is_default", { ascending: false });
      
      setUserAddresses(data || []);
      setShowAddAddressDialog(false);
      setNewLocation(null);
      
      // ✅ اختيار العنوان الجديد
      if (data && data.length > 0) {
        setSelectedAddressId(data[0].id);
        setSelectedAddress(data[0]);
      }
      
    } catch (error) {
      console.error("❌ Error adding address:", error);
      toast.error(app.lang === "ar" ? "❌ فشل إضافة العنوان" : "❌ Failed to add address");
    }
  }, [app.user, newLocation, userAddresses.length, app.lang]);

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

  // ✅ تطبيق كود الخصم
  const applyPromoCode = useCallback(async () => {
    if (!promoCode.trim()) {
      toast.error(app.lang === "ar" ? "⚠️ الرجاء إدخال كود الخصم" : "⚠️ Please enter a promo code");
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

      if (error) throw error;

      if (!data) {
        setPromoMessage(app.lang === "ar" ? "❌ كود غير صالح" : "❌ Invalid code");
        toast.error(app.lang === "ar" ? "❌ كود الخصم غير صالح" : "❌ Invalid promo code");
        return;
      }

      const now = new Date();
      const expiresAt = data.expires_at ? new Date(data.expires_at) : null;
      const startsAt = data.starts_at ? new Date(data.starts_at) : null;

      if (startsAt && now < startsAt) {
        setPromoMessage(app.lang === "ar" ? "⏳ الكود غير مفعل بعد" : "⏳ Code not active yet");
        toast.error(app.lang === "ar" ? "⏳ الكود غير مفعل بعد" : "⏳ Code not active yet");
        return;
      }

      if (expiresAt && now > expiresAt) {
        setPromoMessage(app.lang === "ar" ? "❌ انتهت صلاحية الكود" : "❌ Code expired");
        toast.error(app.lang === "ar" ? "❌ انتهت صلاحية الكود" : "❌ Code expired");
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
        toast.error(app.lang === "ar" ? `❌ الحد الأدنى للطلب هو ${formatPrice(minOrder, app.currency, app.lang)}` : `❌ Minimum order is ${formatPrice(minOrder, app.currency, app.lang)}`);
        return;
      }

      let discount = 0;
      if (data.type === "percentage") {
        discount = (subtotal * (data.value / 100));
      } else if (data.type === "fixed") {
        discount = data.value;
      }

      if (data.max_discount && discount > data.max_discount) {
        discount = data.max_discount;
      }

      setPromoApplied(true);
      setPromoDiscount(discount);
      setPromoData(data);
      setPromoMessage(
        app.lang === "ar" 
          ? `✅ خصم ${data.value}${data.type === "percentage" ? '%' : ` ${app.currency}`}`
          : `✅ ${data.value}${data.type === "percentage" ? '%' : ` ${app.currency}`} discount`
      );
      toast.success(
        app.lang === "ar" 
          ? `✅ تم تطبيق الخصم بنجاح! (${formatPrice(discount, app.currency, app.lang)})`
          : `✅ Discount applied successfully! (${formatPrice(discount, app.currency, app.lang)})`
      );

    } catch (error) {
      console.error("❌ Error applying promo code:", error);
      setPromoMessage(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
      toast.error(app.lang === "ar" ? "❌ حدث خطأ أثناء تطبيق الكود" : "❌ Error applying code");
    } finally {
      setIsApplyingPromo(false);
    }
  }, [promoCode, items, app.lang, app.currency]);

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
  const handleClearCart = useCallback(async () => {
    if (!app.user) return;
    if (!confirm(app.lang === "ar" ? "هل أنت متأكد من تفريغ السلة؟" : "Are you sure you want to clear your cart?")) return;
    
    try {
      await clearCart.mutateAsync({ userId: app.user.id });
      if (promoApplied) removePromoCode();
      toast.success(app.lang === "ar" ? "🧹 تم تفريغ السلة" : "🧹 Cart cleared");
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
      for (const item of items) {
        const listing = item.listing || item;
        const sellerId = listing.owner_id || item.listing_id;
        const governorateId = listing.governorate_id || null;
        
        // 1. إنشاء الطلب
        const order = await createOrder.mutateAsync({
          buyer_id: app.user.id,
          seller_id: sellerId,
          listing_id: item.listing_id,
          total: item.subtotal || (Number(item.price) * item.quantity),
          quantity: item.quantity,
          governorate_id: governorateId,
        });

        // 2. إرسال إشعار للمتجر (البائع)
        if (sellerId) {
          await supabase
            .from("notifications")
            .insert({
              user_id: sellerId,
              type: "new_order",
              title_ar: "📦 طلب جديد",
              body_ar: `لديك طلب جديد من ${app.user?.full_name || 'عميل'} على منتج "${listing.title_ar}"`,
              title_en: "📦 New Order",
              body_en: `You have a new order from ${app.user?.full_name || 'Customer'} for "${listing.title_en || listing.title_ar}"`,
              link_url: `/orders/${order.id}`,
              metadata: {
                order_id: order.id,
                buyer_id: app.user.id,
                listing_id: item.listing_id,
                total: item.subtotal,
                quantity: item.quantity,
              }
            });
        }
      }

      await clearCart.mutateAsync({ userId: app.user.id });
      if (promoApplied) removePromoCode();

      toast.success(
        app.lang === "ar" 
          ? "✅ تم إرسال طلبك بنجاح! سنتواصل معك قريباً." 
          : "✅ Order placed successfully! We'll contact you soon.",
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
  }, [app.user, items, createOrder, clearCart, promoApplied, removePromoCode, navigate, app.lang, selectedAddress]);
  
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

  // ✅ إذا كانت السلة فارغة
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

  // ✅ عرض السلة
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
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Store className="h-4 w-4 text-[#2a655f]" />
              {cart.store?.store_name || (app.lang === "ar" ? "سلة واحدة من متجر واحد" : "Single store cart")}
            </p>
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
                      <p className="font-medium text-sm text-slate-800 dark:text-white line-clamp-1">
                        {selectedAddress.address_text}
                        {selectedAddress.label && (
                          <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px] ml-2">
                            {selectedAddress.label}
                          </Badge>
                        )}
                      </p>
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

            {/* ✅ قائمة المنتجات - معدلة لدعم التركيبات */}
            {items.map((item: any) => {
              const listing = item.listing || item;
              
              return (
                <div 
                  key={item.id} 
                  className="group bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4 hover:shadow-xl hover:border-[#2a655f]/30 transition-all duration-300 hover:scale-[1.01]"
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
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors line-clamp-1">
                            {app.lang === "ar" ? listing.title_ar : (listing.title_en || listing.title_ar)}
                          </h3>
                          
                          {/* ✅ عرض التركيبة المختارة - مع دعم variation_combination */}
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
                          
                          {/* ✅ السعر - استخدام سعر العنصر (التركيبة) */}
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-xl font-bold text-[#2a655f] dark:text-[#3a8a82]">
                              {formatPrice(Number(item.price || listing.price), app.currency, app.lang)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(Number(item.price || listing.price) * 1.2, app.currency, app.lang)}
                            </span>
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
            {/* ✅ قائمة العناوين */}
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
                        <p className="font-semibold text-sm flex items-center gap-2">
                          {addr.label || (app.lang === "ar" ? "عنوان" : "Address")}
                          {addr.is_default && (
                            <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[9px]">
                              {app.lang === "ar" ? "افتراضي" : "Default"}
                            </Badge>
                          )}
                        </p>
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
            
            {/* ✅ زر إضافة عنوان */}
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
      <Dialog open={showAddAddressDialog} onOpenChange={setShowAddAddressDialog}>
        <DialogContent className="rounded-2xl max-w-md border-[#2a655f]/20 shadow-2xl shadow-[#2a655f]/10">
          <DialogHeader>
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
          
          <div className="space-y-4 py-4">
            <AddressPicker 
              value={newLocation ?? undefined} 
              onChange={setNewLocation} 
              lang={app.lang} 
            />
            
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
          
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowAddAddressDialog(false);
                setNewLocation(null);
              }}
              className="rounded-xl border-slate-200/50 dark:border-slate-700/50"
            >
              {app.lang === "ar" ? "إلغاء" : "Cancel"}
            </Button>
            <Button
              onClick={handleAddAddress}
              disabled={!newLocation}
              className="rounded-xl bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02]"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "إضافة العنوان" : "Add Address"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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