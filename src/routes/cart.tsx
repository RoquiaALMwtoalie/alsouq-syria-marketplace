// src/routes/cart.tsx

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, Store, Shield, 
  Truck, Clock, Award, Sparkles, Tag, X, Loader2, Gift, CheckCircle2
} from "lucide-react";
import { useState, useCallback, useMemo } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { useCreateOrder } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCart, useUpdateCartItem, useClearCart } from "@/lib/hooks/useCart";

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
  
  // ✅ State - فقط للمتغيرات المحلية
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [promoData, setPromoData] = useState<any>(null);
  const [freeItems, setFreeItems] = useState<any[]>([]);

  // ✅ جلب السلة - useCart محسّن مع إعدادات منع التكرار
  const { 
    data: cart, 
    isLoading, 
    isError,
    refetch: refetchCart 
  } = useCart(app.user?.id);

  // ✅ ✅ ✅ حساب عناصر السلة مع subtotal باستخدام useMemo
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
        // ✅ تأكد من وجود listing
        listing: item.listing || null,
      };
    });
  }, [cart?.items]);

  // ✅ ✅ ✅ حساب الإجماليات باستخدام useMemo
  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
    const deliveryFee = subtotal > 100 ? 0 : 15;
    const total = subtotal + deliveryFee - promoDiscount;
    
    return {
      subtotal,
      deliveryFee,
      total,
      itemCount: items.length,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    };
  }, [items, promoDiscount]);

  // ✅ ✅ ✅ دالة إزالة كود الخصم - useCallback
  const removePromoCode = useCallback(() => {
    setPromoCode("");
    setPromoApplied(false);
    setPromoDiscount(0);
    setPromoMessage("");
    setPromoData(null);
    setFreeItems([]);
    toast.info(app.lang === "ar" ? "🗑️ تم إزالة كود الخصم" : "🗑️ Promo code removed");
  }, [app.lang]);

  // ✅ ✅ ✅ تحديث الكمية - useCallback
  const handleUpdateQuantity = useCallback(async (itemId: string, newQuantity: number) => {
    if (!app.user) {
      toast.warning(app.lang === "ar" ? "⚠️ يرجى تسجيل الدخول" : "⚠️ Please login");
      return;
    }
    
    // ✅ منع التحديث إذا كانت الكمية نفسها
    const item = items.find(i => i.id === itemId);
    if (item && item.quantity === newQuantity) return;
    
    try {
      await updateCartItem.mutateAsync({
        itemId,
        quantity: newQuantity,
        userId: app.user.id,
      });
      
      // ✅ إذا كان كود خصم مطبق، نلغيه لأن السعر تغير
      if (promoApplied) {
        removePromoCode();
      }
      
    } catch (error) {
      console.error("❌ Error updating quantity:", error);
      toast.error(app.lang === "ar" ? "❌ حدث خطأ" : "❌ An error occurred");
    }
  }, [app.user, updateCartItem, items, promoApplied, removePromoCode, app.lang]);

  // ✅ ✅ ✅ تفريغ السلة - useCallback
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

  // ✅ ✅ ✅ دالة حساب buy_x_get_y
  const calculateBuyXGetYDiscount = useCallback(async (promoData: any) => {
    if (!promoData || promoData.type !== 'buy_x_get_y') return 0;
    
    try {
      // ✅ تجهيز عناصر السلة للإرسال
      const cartItems = items.map(item => ({
        listing_id: item.listing_id,
        title: app.lang === "ar" ? item.listing?.title_ar : (item.listing?.title_en || item.listing?.title_ar) || 'منتج',
        price: Number(item.price),
        quantity: item.quantity
      }));
      
      // ✅ استدعاء الدالة المخزنة
      const { data, error } = await supabase.rpc('calculate_buy_x_get_y_discount', {
        p_promo_id: promoData.id,
        p_cart_items: cartItems,
        p_max_discount: promoData.max_discount || null
      });
      
      if (error) throw error;
      
      // ✅ حفظ المنتجات المجانية
      if (data?.free_items && data.free_items.length > 0) {
        setFreeItems(data.free_items);
      } else {
        setFreeItems([]);
      }
      
      return data?.discount || 0;
      
    } catch (error) {
      console.error('❌ Error calculating buy_x_get_y:', error);
      return 0;
    }
  }, [items, app.lang]);

  // ✅ ✅ ✅ تطبيق كود الخصم - useCallback
  const applyPromoCode = useCallback(async () => {
    if (!app.user) {
      toast.warning(app.lang === "ar" ? "⚠️ يرجى تسجيل الدخول أولاً" : "⚠️ Please login first");
      return;
    }

    if (!promoCode.trim()) {
      toast.warning(app.lang === "ar" ? "⚠️ يرجى إدخال كود الخصم" : "⚠️ Please enter a promo code");
      return;
    }

    setIsApplyingPromo(true);

    try {
      const { data, error } = await supabase.rpc('validate_promo_code', {
        p_code: promoCode.trim().toUpperCase(),
        p_user_id: app.user.id,
        p_order_total: totals.subtotal,
        p_store_id: null,
        p_product_id: null,
        p_category_id: null,
        p_governorate_id: null,
        p_delivery_company_id: null,
        p_is_first_order: false,
      });

      if (error) {
        console.error("❌ RPC Error:", error);
        throw error;
      }

      if (!data.valid) {
        setPromoMessage(`❌ ${data.message}`);
        setPromoApplied(false);
        setPromoDiscount(0);
        setPromoData(null);
        setFreeItems([]);
        toast.error(data.message);
        setIsApplyingPromo(false);
        return;
      }

      let discount = data.discount || 0;

      // ✅ إذا كان النوع buy_x_get_y، احسب الخصم من السلة
      if (data.type === 'buy_x_get_y' && data.needs_cart_calculation) {
        discount = await calculateBuyXGetYDiscount(data);
      }

      setPromoDiscount(discount);
      setPromoApplied(true);
      setPromoData(data);
      
      // ✅ عرض رسالة مناسبة
      let message = `✅ ${data.label || data.code}`;
      if (data.type === 'buy_x_get_y') {
        const metadata = data.metadata || {};
        const buyQty = metadata.buy_quantity || 2;
        const getQty = metadata.get_quantity || 1;
        message += ` - اشترِ ${buyQty} واحصل على ${getQty} مجاناً 🎁`;
      } else if (discount > 0) {
        message += ` -${discount} ${app.currency}`;
      } else if (data.is_free_shipping) {
        message += ' - توصيل مجاني 🆓';
      }
      setPromoMessage(message);
      
      toast.success(
        app.lang === "ar" 
          ? `✅ تم تطبيق كود الخصم! ${discount > 0 ? `(${discount} ${app.currency})` : '🎁'}` 
          : `✅ Promo code applied! ${discount > 0 ? `(${discount} ${app.currency})` : '🎁'}`
      );

      if (data.id && discount > 0) {
        await supabase.rpc('record_promo_code_usage', {
          p_code_id: data.id,
          p_user_id: app.user.id,
          p_order_id: null,
          p_discount_amount: discount,
        });
      }

    } catch (error: any) {
      console.error("❌ Error applying promo code:", error);
      toast.error(
        app.lang === "ar" 
          ? `❌ حدث خطأ: ${error.message || 'يرجى المحاولة مرة أخرى'}`
          : `❌ An error occurred: ${error.message || 'Please try again'}`
      );
      setFreeItems([]);
    } finally {
      setIsApplyingPromo(false);
    }
  }, [app.user, promoCode, totals.subtotal, app.currency, app.lang, calculateBuyXGetYDiscount]);

  // ✅ ✅ ✅ إتمام الشراء - useCallback
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

    try {
      // ✅ إنشاء الطلبات
      for (const item of items) {
        const listing = item.listing || item;
        await createOrder.mutateAsync({
          buyer_id: app.user.id,
          seller_id: listing.owner_id || item.listing_id,
          listing_id: item.listing_id,
          total: item.subtotal || (Number(item.price) * item.quantity),
          quantity: item.quantity,
        });
      }

      // ✅ تفريغ السلة
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
  }, [app.user, items, createOrder, clearCart, promoApplied, removePromoCode, navigate, app.lang]);

  // ✅ ✅ ✅ عرض حالة التحميل
  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-[#0d2e2a] border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            {app.lang === "ar" ? "جاري تحميل السلة..." : "Loading cart..."}
          </p>
        </div>
      </div>
    );
  }

  // ✅ ✅ ✅ عرض حالة الخطأ
  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold">
            {app.lang === "ar" ? "حدث خطأ في تحميل السلة" : "Error loading cart"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {app.lang === "ar" ? "يرجى تحديث الصفحة والمحاولة مرة أخرى" : "Please refresh the page and try again"}
          </p>
          <Button 
            className="mt-6 bg-[#0d2e2a] text-white hover:bg-[#1a4f4a]"
            onClick={() => refetchCart()}
          >
            {app.lang === "ar" ? "إعادة المحاولة" : "Retry"}
          </Button>
        </div>
      </div>
    );
  }

  // ✅ ✅ ✅ إذا كانت السلة فارغة
  if (!cart || items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-gradient-to-b from-background to-muted/20 flex items-center justify-center">
        <div className="mx-auto max-w-lg px-4 text-center">
          <div className="relative inline-block">
            <div className="h-32 w-32 rounded-full bg-[#0d2e2a]/10 flex items-center justify-center mx-auto animate-bounce-slow">
              <ShoppingBag className="h-16 w-16 text-[#0d2e2a]/40" />
            </div>
            <div className="absolute -top-2 -right-2 h-10 w-10 rounded-full bg-[#0d2e2a] flex items-center justify-center text-white text-sm font-bold animate-pulse">
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
            <Button className="mt-6 h-12 px-8 rounded-2xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 hover:scale-105">
              <ShoppingBag className="h-4 w-4 mr-2" />
              {app.lang === "ar" ? "ابدأ التسوق" : "Start Shopping"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ✅ ✅ ✅ عرض السلة
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-8">
      <div className="mx-auto max-w-7xl px-4">
        
        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3 text-[#0d2e2a] dark:text-white">
              <div className="p-2 rounded-2xl bg-[#0d2e2a] text-white shadow-lg shadow-[#0d2e2a]/20">
                <ShoppingBag className="h-6 w-6" />
              </div>
              {app.lang === "ar" ? "سلة التسوق" : "Shopping Cart"}
              <Badge className="bg-[#0d2e2a] text-white text-sm px-3 py-1">
                {totals.itemCount} {app.lang === "ar" ? "منتجات" : "items"}
              </Badge>
            </h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
              <Store className="h-4 w-4 text-[#0d2e2a]" />
              {cart.store?.store_name || (app.lang === "ar" ? "سلة واحدة من متجر واحد" : "Single store cart")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              className="border-[#0d2e2a]/20 hover:bg-[#0d2e2a]/10 text-[#0d2e2a] rounded-xl"
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
              <Button variant="ghost" className="text-[#0d2e2a] hover:bg-[#0d2e2a]/10 rounded-xl">
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
            {items.map((item: any) => {
              const listing = item.listing || item;
              
              return (
                <div 
                  key={item.id} 
                  className="group bg-white dark:bg-slate-900/80 rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-4 hover:shadow-xl hover:border-[#0d2e2a]/30 transition-all duration-300 hover:scale-[1.01]"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* صورة المنتج */}
                    <div className="relative h-28 w-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 mx-auto sm:mx-0">
                      <img 
                        src={listing.cover_url || '/placeholder.png'} 
                        alt={app.lang === "ar" ? listing.title_ar : listing.title_en || listing.title_ar}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                      {listing.owner_id && (
                        <div className="absolute top-1 left-1">
                          <Badge className="bg-[#0d2e2a]/80 text-white border-0 text-[8px] px-1.5 py-0.5">
                            <Store className="h-2.5 w-2.5 inline mr-0.5" />
                            {app.lang === "ar" ? "متجر" : "Store"}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* تفاصيل المنتج */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-[#0d2e2a] transition-colors line-clamp-1">
                            {app.lang === "ar" ? listing.title_ar : (listing.title_en || listing.title_ar)}
                          </h3>
                          
                          {/* الخيارات المختارة */}
                          <div className="flex flex-wrap items-center gap-2 mt-1">
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
                            {item.selected_variation_id && (
                              <Badge variant="secondary" className="text-[10px] bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                                ✅ {app.lang === "ar" ? "تركيبة" : "Variation"}
                              </Badge>
                            )}
                          </div>
                          
                          {/* السعر */}
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-xl font-bold text-[#0d2e2a] dark:text-[#4a9f95]">
                              {formatPrice(Number(listing.price), app.currency, app.lang)}
                            </span>
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(Number(listing.price) * 1.2, app.currency, app.lang)}
                            </span>
                          </div>
                        </div>

                        {/* أدوات التحكم بالكمية */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border-2 rounded-xl overflow-hidden shadow-sm">
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                              className="h-10 w-10 flex items-center justify-center hover:bg-[#0d2e2a]/10 transition text-[#0d2e2a]"
                              disabled={updateCartItem.isPending}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-12 text-center font-bold text-lg text-[#0d2e2a]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                              className="h-10 w-10 flex items-center justify-center hover:bg-[#0d2e2a]/10 transition text-[#0d2e2a]"
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
                      
                      {/* المجموع الفرعي للمنتج */}
                      <div className="mt-2 text-right text-sm text-muted-foreground">
                        {app.lang === "ar" ? "المجموع" : "Subtotal"}: 
                        <span className="font-bold text-[#0d2e2a] dark:text-[#4a9f95]">
                          {formatPrice(item.subtotal, app.currency, app.lang)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ===== SUMMARY - مع كود الخصم ===== */}
          <div className="lg:sticky lg:top-32 h-fit">
            <div className="bg-white dark:bg-slate-900/90 rounded-2xl border border-[#0d2e2a]/20 p-6 shadow-xl shadow-[#0d2e2a]/5">
              <h2 className="text-lg font-bold text-[#0d2e2a] dark:text-white flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-[#0d2e2a]" />
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
                  {totals.deliveryFee === 0 ? (
                    <span className="font-semibold text-emerald-500">
                      {app.lang === "ar" ? "🆓 مجاني" : "🆓 Free"}
                    </span>
                  ) : (
                    <span className="font-medium">{formatPrice(totals.deliveryFee, app.currency, app.lang)}</span>
                  )}
                </div>

                {/* ✅ كود الخصم */}
                <div className="border-t border-[#0d2e2a]/10 pt-3">
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
                          className="pl-9 h-10 rounded-xl border-[#0d2e2a]/20 focus:border-[#0d2e2a] focus:ring-[#0d2e2a]/20 text-sm"
                          onKeyDown={(e) => e.key === "Enter" && applyPromoCode()}
                          disabled={isApplyingPromo}
                        />
                      </div>
                      <Button
                        onClick={applyPromoCode}
                        disabled={isApplyingPromo}
                        className="h-10 px-4 rounded-xl bg-[#0d2e2a] text-white hover:bg-[#1a4f4a] transition-all duration-300"
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
                
                {/* ✅ الخصم */}
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-sm text-emerald-500">
                    <span>{app.lang === "ar" ? "💚 الخصم" : "💚 Discount"}</span>
                    <span className="font-bold">-{formatPrice(promoDiscount, app.currency, app.lang)}</span>
                  </div>
                )}
                
                <div className="border-t border-[#0d2e2a]/10 my-3 pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-[#0d2e2a] dark:text-white">
                      {app.lang === "ar" ? "الإجمالي" : "Total"}
                    </span>
                    <span className="text-[#0d2e2a] dark:text-[#4a9f95]">
                      {formatPrice(totals.total, app.currency, app.lang)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {app.lang === "ar" ? "شامل جميع الرسوم" : "All fees included"}
                  </p>
                </div>
                
                <Button 
                  size="lg" 
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#0d2e2a] to-[#1a4f4a] hover:from-[#1a4f4a] hover:to-[#0d2e2a] text-white shadow-lg shadow-[#0d2e2a]/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base font-bold"
                  onClick={checkout}
                  disabled={createOrder.isPending}
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
                
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mt-3">
                  <span className="flex items-center gap-1">
                    <Shield className="h-3.5 w-3.5 text-emerald-500" />
                    {app.lang === "ar" ? "دفع آمن" : "Secure"}
                  </span>
                  <span className="text-muted-foreground/30">|</span>
                  <span className="flex items-center gap-1">
                    <Truck className="h-3.5 w-3.5 text-[#0d2e2a]" />
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

        {/* ✅ عرض المنتجات المجانية */}
        {freeItems.length > 0 && (
          <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-950/20 rounded-xl border border-emerald-200 dark:border-emerald-800/30 animate-in slide-in-from-top-3 duration-300">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="h-5 w-5 text-emerald-500" />
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                🎁 {app.lang === "ar" ? "منتجات مجانية!" : "Free Products!"}
              </span>
              <Badge className="bg-emerald-500 text-white border-0 text-[10px]">
                {freeItems.length} {app.lang === "ar" ? "منتج" : "item"}
                {freeItems.length > 1 ? (app.lang === "ar" ? "ات" : "s") : ""}
              </Badge>
            </div>
            <div className="space-y-1">
              {freeItems.map((item: any, index: number) => (
                <div key={index} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30 transition-colors">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 line-through">
                      {formatPrice(item.price, app.currency, app.lang)}
                    </span>
                    <Badge className="bg-emerald-500 text-white border-0 text-[10px] animate-pulse">
                      {app.lang === "ar" ? "مجاني! 🎉" : "FREE! 🎉"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              {app.lang === "ar" 
                ? `تم اختيار ${freeItems.length} منتج مجاني (أرخص المنتجات في السلة)` 
                : `${freeItems.length} free item(s) selected (cheapest products in cart)`}
            </p>
          </div>
        )}

      </div>

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        .slide-in-from-top-3 {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default CartPage;