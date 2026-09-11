// src/components/FavoritesPage.tsx

import { useState, useEffect } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, ShoppingBag, Store, MapPin, Star, Trash2, 
  ShoppingCart, HeartOff, Package, X, ChevronLeft, ChevronRight,
  Share2, Eye, Clock, Truck, Shield, Award, Sparkles, Zap,
  Gem, Crown, Flame, Gift, Compass, TrendingUp, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Link, useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface FavoriteItem {
  id: string;
  listing_id: string;
  created_at: string;
  listings: {
    id: string;
    title_ar: string;
    title_en: string | null;
    description_ar: string | null;
    description_en: string | null;
    price: number;
    price_usd: number | null;
    old_price: number | null;
    currency: string;
    cover_url: string | null;
    status: string;
    is_available: boolean;
    is_offer: boolean;
    discount_percent: number | null;
    rating: number;
    views: number;
    favorites_count: number;
    created_at: string;
    category_id: string;
    governorate_id: string;
    owner_id: string;
    delivery_method: string | null;
    payment_method: string | null;
    categories?: {
      name_ar: string;
      name_en: string;
      slug: string;
    } | null;
    governorates?: {
      name_ar: string;
      name_en: string;
      slug: string;
    } | null;
    listing_images?: Array<{
      url: string;
      sort_order: number;
    }> | null;
    profile?: {
      store_name: string | null;
      full_name: string | null;
      avatar_url: string | null;
      store_logo_url: string | null;
    } | null;
  } | null;
}

// ✅ مكون التقييم - بنفس ألوان الأدمن (بوردر زهري)
const RatingStars = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "h-3.5 w-3.5 transition-all duration-300",
            star <= rating
              ? "fill-[#f9a8d4] text-[#f9a8d4]"
              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
          )}
        />
      ))}
    </div>
  );
};

export function FavoritesPage() {
  const app = useApp();
  const navigate = useNavigate();
  const isRTL = app.lang === 'ar';
  
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showEmptyDialog, setShowEmptyDialog] = useState(false);

  // ============================================================
  // ✅ CSS Animations
  // ============================================================
  const styles = `
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .animate-shimmer {
      background-size: 200% auto;
      animation: shimmer 3s linear infinite;
    }
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .animate-pulse-slow {
      animation: pulse-slow 2.5s ease-in-out infinite;
    }
    @keyframes heart-beat {
      0%, 100% { transform: scale(1); }
      25% { transform: scale(1.15); }
      50% { transform: scale(0.95); }
      75% { transform: scale(1.05); }
    }
    .animate-heart-beat {
      animation: heart-beat 1.5s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    .animate-float {
      animation: float 3s ease-in-out infinite;
    }
    @keyframes bounce-slow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-6px); }
    }
    .animate-bounce-slow {
      animation: bounce-slow 2s ease-in-out infinite;
    }
    @keyframes slide-up {
      0% { opacity: 0; transform: translateY(30px) scale(0.95); }
      100% { opacity: 1; transform: translateY(0) scale(1); }
    }
    .animate-slide-up {
      animation: slide-up 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
  `;

  // ============================================================
  // 📦 جلب البيانات
  // ============================================================
  const fetchFavorites = async () => {
    if (!app.user) {
      navigate({ to: '/auth/login' });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          id,
          listing_id,
          created_at,
          listings:listing_id (
            id,
            title_ar,
            title_en,
            description_ar,
            description_en,
            price,
            price_usd,
            old_price,
            currency,
            cover_url,
            status,
            is_available,
            is_offer,
            discount_percent,
            rating,
            views,
            favorites_count,
            created_at,
            category_id,
            governorate_id,
            owner_id,
            delivery_method,
            payment_method,
            categories:category_id (
              name_ar,
              name_en,
              slug
            ),
            governorates:governorate_id (
              name_ar,
              name_en,
              slug
            ),
            listing_images (
              url,
              sort_order
            ),
            profile:owner_id (
              store_name,
              full_name,
              avatar_url,
              store_logo_url
            )
          )
        `)
        .eq('user_id', app.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const validFavorites = (data || []).filter(
        (item: any) => item.listings !== null
      ) as FavoriteItem[];

      setFavorites(validFavorites);
      
      const deletedCount = (data || []).length - validFavorites.length;
      if (deletedCount > 0) {
        toast.info(
          isRTL 
            ? `⚠️ تم حذف ${deletedCount} منتج من المفضلة` 
            : `⚠️ ${deletedCount} products were removed`,
          { duration: 3000 }
        );
      }

    } catch (error) {
      console.error('❌ Error fetching favorites:', error);
      toast.error(
        isRTL 
          ? '❌ فشل جلب المفضلة' 
          : '❌ Failed to load favorites'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [app.user]);

  // ============================================================
  // ❌ حذف من المفضلة
  // ============================================================
  const removeFromFavorites = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId);

      if (error) throw error;
      
      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      setShowRemoveDialog(false);
      setSelectedItem(null);
      
      toast.success(
        isRTL 
          ? '✅ تمت الإزالة من المفضلة' 
          : '✅ Removed from favorites'
      );
    } catch (error) {
      console.error('❌ Error removing favorite:', error);
      toast.error(
        isRTL 
          ? '❌ فشل الإزالة' 
          : '❌ Failed to remove'
      );
    }
  };

  // ============================================================
  // 🗑️ حذف كل المفضلات
  // ============================================================
  const clearAllFavorites = async () => {
    if (!app.user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', app.user.id);

      if (error) throw error;
      
      setFavorites([]);
      setShowEmptyDialog(false);
      
      toast.success(
        isRTL 
          ? '✅ تم تفريغ المفضلة' 
          : '✅ Favorites cleared'
      );
    } catch (error) {
      console.error('❌ Error clearing favorites:', error);
      toast.error(
        isRTL 
          ? '❌ فشل التفريغ' 
          : '❌ Failed to clear'
      );
    }
  };

  // ============================================================
  // 🛒 إضافة إلى السلة
  // ============================================================
  const addToCart = (listing: any) => {
    if (!listing || !listing.id) {
      toast.error(
        isRTL 
          ? '❌ بيانات المنتج غير مكتملة' 
          : '❌ Product data incomplete'
      );
      return;
    }

    app.addToCart({
      id: listing.id,
      title: isRTL ? listing.title_ar : (listing.title_en || listing.title_ar),
      price: listing.price,
      currency: listing.currency || 'SYP',
      image: listing.cover_url || '/placeholder.png',
      quantity: 1,
    });
    
    toast.success(
      isRTL 
        ? '🛒 تمت الإضافة إلى السلة' 
        : '🛒 Added to cart'
    );
  };

  // ============================================================
  // 📊 دوال مساعدة
  // ============================================================
  const getProductTitle = (item: FavoriteItem | null): string => {
    if (!item?.listings) {
      return isRTL ? 'منتج غير متوفر' : 'Product unavailable';
    }
    const listing = item.listings;
    return isRTL 
      ? listing.title_ar 
      : (listing.title_en || listing.title_ar);
  };

  const getStoreName = (item: FavoriteItem | null): string => {
    if (!item?.listings?.profile) {
      return isRTL ? 'متجر' : 'Store';
    }
    const profile = item.listings.profile;
    return profile.store_name || profile.full_name || (isRTL ? 'متجر' : 'Store');
  };

  const getProductImage = (item: FavoriteItem | null): string => {
    if (!item?.listings) {
      return '/placeholder.png';
    }
    const listing = item.listings;
    
    if (listing.listing_images && listing.listing_images.length > 0) {
      return listing.listing_images[0].url;
    }
    
    return listing.cover_url || '/placeholder.png';
  };

  const getGovernorateName = (item: FavoriteItem | null): string => {
    if (!item?.listings?.governorates) {
      return '';
    }
    const gov = item.listings.governorates;
    return isRTL ? gov.name_ar : (gov.name_en || gov.name_ar);
  };

  const getAvailability = (item: FavoriteItem | null): {
    isAvailable: boolean;
    text: string;
    color: string;
  } => {
    if (!item?.listings) {
      return {
        isAvailable: false,
        text: isRTL ? 'غير متوفر' : 'Unavailable',
        color: 'text-red-500'
      };
    }
    
    const isAvailable = item.listings.is_available !== false;
    return {
      isAvailable,
      text: isAvailable 
        ? (isRTL ? 'متوفر' : 'Available')
        : (isRTL ? 'غير متوفر' : 'Unavailable'),
      color: isAvailable ? 'text-emerald-500' : 'text-red-500'
    };
  };

  // ============================================================
  // 🌀 Skeleton Loader
  // ============================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10">
        <style>{styles}</style>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-10 w-56" />
              <Skeleton className="h-5 w-40 mt-2" />
            </div>
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden border-2 border-pink-400/60 dark:border-pink-400/40">
                <Skeleton className="aspect-square w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 📭 صفحة فارغة
  // ============================================================
  if (favorites.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10 flex items-center justify-center">
        <style>{styles}</style>
        
        <div className="max-w-md mx-auto text-center px-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-[#2a655f] to-[#3a8a82] rounded-full blur-3xl opacity-20 animate-pulse-slow" />
            <div className="relative h-32 w-32 rounded-full bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center mx-auto">
              <Heart className="h-14 w-14 text-pink-500 fill-pink-500 animate-heart-beat" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mt-6">
            {isRTL ? '💔 قائمة المفضلة فارغة' : '💔 Favorites is empty'}
          </h1>
          
          <p className="text-muted-foreground mt-3 leading-relaxed">
            {isRTL 
              ? 'ابدأ بإضافة المنتجات التي تعجبك إلى قائمة المفضلة لتجدها بسهولة لاحقاً' 
              : 'Start adding products you like to your favorites list to find them easily later'}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate({ to: '/' })}
              className="bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white rounded-2xl px-8 py-6 text-base shadow-lg shadow-[#2a655f]/30 hover:shadow-[#2a655f]/50 transition-all hover:scale-105"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {isRTL ? 'استكشف المنتجات' : 'Explore Products'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/categories' })}
              className="rounded-2xl px-8 py-6 text-base border-2 border-pink-400/60 hover:border-pink-500 hover:bg-pink-500/10"
            >
              <Sparkles className="h-5 w-5 mr-2 text-pink-500" />
              {isRTL ? 'تصفح التصنيفات' : 'Browse Categories'}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 🏠 الصفحة الرئيسية
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2a655f]/5 via-transparent to-[#3a8a82]/5 dark:from-[#2a655f]/20 dark:to-[#3a8a82]/10">
      <style>{styles}</style>
      
      <div className="container mx-auto px-4 py-8">
        
        {/* ===== Header ===== */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 shadow-sm">
                <Heart className="h-6 w-6 text-pink-500 fill-pink-500 animate-heart-beat" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
                  {isRTL ? 'المفضلة' : 'Favorites'}
                  <Badge className="bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 text-[10px]">
                    <Sparkles className="h-2.5 w-2.5 mr-1 text-emerald-500 animate-pulse" />
                    {isRTL ? 'مباشر' : 'Live'}
                  </Badge>
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  {isRTL 
                    ? `${favorites.length} منتج في قائمتك` 
                    : `${favorites.length} products in your list`}
                  <span className="h-1 w-1 rounded-full bg-[#f9a8d4]/50" />
                  <span className="text-xs text-[#d81b60] flex items-center gap-1">
                    <Zap className="h-3 w-3 animate-pulse" />
                    {isRTL ? 'تحديث لحظي' : 'Real-time'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className="rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/5 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 h-10"
            >
              <ShoppingBag className="h-4 w-4 mr-1.5 text-[#2a655f]" />
              {isRTL ? 'مواصلة التسوق' : 'Continue Shopping'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmptyDialog(true)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/30 hover:border-red-300 transition-all duration-300 h-10"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {isRTL ? 'تفريغ الكل' : 'Clear All'}
            </Button>
          </div>
        </div>

        {/* ===== Stats Bar - نفس تصميم AdminStores (بوردر زهري + خلفية بيضاء) ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { 
              icon: Heart, 
              label: isRTL ? 'إجمالي المفضلات' : 'Total Favorites',
              value: favorites.length,
              gradient: 'from-[#d81b60] to-[#f9a8d4]',
            },
            { 
              icon: Store, 
              label: isRTL ? 'عدد المتاجر' : 'Stores',
              value: new Set(favorites.map(f => f.listings?.owner_id)).size,
              gradient: 'from-[#2a655f] to-[#1a4f4a]',
            },
            { 
              icon: ShoppingBag, 
              label: isRTL ? 'متوفر للشراء' : 'Available',
              value: favorites.filter(f => f.listings?.is_available !== false).length,
              gradient: 'from-emerald-500 to-teal-500',
            },
            { 
              icon: Star, 
              label: isRTL ? 'متوسط التقييم' : 'Avg Rating',
              value: (favorites.reduce((acc, f) => acc + (f.listings?.rating || 0), 0) / favorites.length || 0).toFixed(1),
              gradient: 'from-amber-500 to-orange-500',
            },
          ].map((stat, i) => (
            <div 
              key={i} 
              className="group bg-white dark:bg-[#1e293b] rounded-xl border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] overflow-hidden relative p-4"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[#f9a8d4]/5 blur-3xl animate-pulse" />
              </div>
              <div className="flex items-center justify-between relative">
                <div>
                  <p className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white group-hover:text-[#2a655f] transition-colors">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-white dark:bg-[#1e293b] border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <div className={`h-6 w-6 rounded-lg bg-gradient-to-br ${stat.gradient} flex items-center justify-center`}>
                    <stat.icon className="h-3.5 w-3.5 text-white" />
                  </div>
                </div>
              </div>
              <div className="mt-2 h-0.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${stat.gradient} transition-all duration-1000 animate-shimmer`} 
                  style={{ width: `${Math.min(100, (Number(stat.value) / (favorites.length || 1)) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ===== Grid - بطاقات بيضاء + بوردر زهري (نفس تصميم الأدمن) ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {favorites.map((item, index) => {
            if (!item?.listings) return null;
            
            const listing = item.listings;
            const productTitle = getProductTitle(item);
            const storeName = getStoreName(item);
            const image = getProductImage(item);
            const governorateName = getGovernorateName(item);
            const { isAvailable, text: availabilityText, color: availabilityColor } = getAvailability(item);
            
            const isOffer = listing.is_offer === true;
            const discount = listing.discount_percent || 0;
            const price = listing.price || 0;
            const oldPrice = listing.old_price || 0;
            const rating = listing.rating || 0;
            const favoritesCount = listing.favorites_count || 0;

            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-[#1e293b] rounded-2xl overflow-hidden border-2 border-pink-400/60 dark:border-pink-400/40 hover:border-pink-500 shadow-sm hover:shadow-xl hover:shadow-pink-500/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] animate-slide-up"
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {/* ===== صورة المنتج ===== */}
                <Link to={`/listing/${listing.id}`} className="block relative aspect-square overflow-hidden bg-[#2a655f]/5">
                  <img
                    src={image}
                    alt={productTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.png';
                    }}
                  />
                  
                  {/* ===== Badges ===== */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {isOffer && discount > 0 && (
                      <Badge className="bg-gradient-to-r from-[#d81b60] to-[#f9a8d4] text-white border-2 border-white/30 shadow-lg rounded-full px-2.5 py-0.5 text-[10px] font-bold animate-pulse">
                        🔥 -{discount}%
                      </Badge>
                    )}
                    {!isAvailable && (
                      <Badge className="bg-red-500/90 text-white border-2 border-white/30 shadow-lg rounded-full px-2.5 py-0.5 text-[10px]">
                        ❌ {isRTL ? 'غير متوفر' : 'Out of stock'}
                      </Badge>
                    )}
                  </div>

                  {/* ===== زر المفضلة - قلب وردي (نفس لون الهيدر تماماً) ===== */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedItem(item);
                      setShowRemoveDialog(true);
                    }}
                    className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-sm border-2 border-pink-400/60 dark:border-pink-400/40 flex items-center justify-center shadow-lg hover:border-pink-500 hover:bg-pink-500/10 transition-all duration-300 hover:scale-110 z-10"
                  >
                    <Heart 
                      className="h-5 w-5 fill-pink-500 text-pink-500 animate-heart-beat" 
                    />
                  </button>
                </Link>

                {/* ===== المحتوى ===== */}
                <div className="p-4 space-y-2">
                  <Link 
                    to={`/store/${listing.owner_id}`} 
                    className="text-xs text-[#2a655f] dark:text-[#3a8a82] hover:text-pink-500 hover:underline flex items-center gap-1 font-bold transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Store className="h-3 w-3 text-[#2a655f] dark:text-[#3a8a82]" />
                    <span className="truncate">{storeName}</span>
                  </Link>

                  <Link to={`/listing/${listing.id}`}>
                    <h3 className="font-bold text-sm line-clamp-2 text-slate-800 dark:text-slate-100 group-hover:text-[#2a655f] transition-colors leading-snug">
                      {productTitle}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <RatingStars rating={rating} />
                    <span className="text-xs text-muted-foreground font-medium">
                      ({favoritesCount})
                    </span>
                  </div>

                  <div className="flex items-end gap-2 pt-1">
                    <span className="text-lg font-bold text-[#2a655f] dark:text-[#3a8a82]">
                      {formatPrice(price, listing.currency || 'SYP', app.lang)}
                    </span>
                    {isOffer && oldPrice > 0 && oldPrice > price && (
                      <span className="text-sm text-[#d81b60] line-through font-medium">
                        {formatPrice(oldPrice, listing.currency || 'SYP', app.lang)}
                      </span>
                    )}
                  </div>

                  {/* ===== Footer ===== */}
                  <div className="flex items-center justify-between pt-2 border-t-2 border-[#2a655f]/10 dark:border-[#2a655f]/20">
                    {governorateName ? (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3 text-[#2a655f]" />
                        <span className="truncate max-w-[70px] font-medium">{governorateName}</span>
                      </div>
                    ) : <span />}
                    
                    <div className="flex items-center gap-1.5">
                      <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", isAvailable ? "bg-emerald-500" : "bg-red-500")} />
                      <span className={cn("text-[10px] font-bold", availabilityColor)}>
                        {availabilityText}
                      </span>
                    </div>
                  </div>

                  {/* ===== أزرار الإجراءات ===== */}
                  <div className="flex items-center gap-1.5 pt-2 border-t-2 border-[#2a655f]/10 dark:border-[#2a655f]/20">
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        addToCart(listing);
                      }}
                      disabled={!isAvailable}
                      className="flex-1 rounded-xl text-[11px] font-bold h-8 bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#3a8a82] hover:to-[#4a9f95] text-white shadow-md shadow-[#2a655f]/25 transition-all duration-300 hover:scale-[1.02] border-2 border-white/20"
                    >
                      <ShoppingCart className="h-3.5 w-3.5 mr-1" />
                      {isRTL ? 'أضف للسلة' : 'Add to Cart'}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelectedItem(item);
                        setShowRemoveDialog(true);
                      }}
                      className="rounded-xl h-8 w-8 p-0 text-pink-500 hover:text-white hover:bg-pink-500 hover:scale-110 transition-all duration-300 border-2 border-pink-400/60 hover:border-pink-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== Footer ===== */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-[#1e293b] rounded-2xl border-2 border-pink-400/60 dark:border-pink-400/40 shadow-sm">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Heart className="h-5 w-5 text-pink-500 fill-pink-500 animate-heart-beat" />
            <span className="font-bold">
              {isRTL 
                ? `لديك ${favorites.length} منتج في قائمة المفضلة` 
                : `You have ${favorites.length} products in your favorites list`}
            </span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className="rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-[#2a655f]/5 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300"
            >
              {isRTL ? 'مواصلة التسوق' : 'Continue Shopping'}
            </Button>
            
            <Button
              size="sm"
              onClick={() => setShowEmptyDialog(true)}
              className="rounded-xl bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/25 transition-all duration-300 hover:scale-105 border-2 border-white/20"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {isRTL ? 'تفريغ الكل' : 'Clear All'}
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Dialog: إزالة من المفضلة ===== */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl p-0 overflow-hidden bg-white dark:bg-[#1e293b]">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-pink-500/10 border-2 border-pink-400/60 flex items-center justify-center">
                    <HeartOff className="h-6 w-6 text-pink-500" />
                  </div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {isRTL ? 'إزالة من المفضلة' : 'Remove from favorites'}
                  </DialogTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-[#2a655f]/10 border border-slate-200 dark:border-slate-700"
                  onClick={() => setShowRemoveDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                {isRTL
                  ? `هل أنت متأكد من إزالة "${getProductTitle(selectedItem)}" من قائمتك؟`
                  : `Are you sure you want to remove "${getProductTitle(selectedItem)}" from your list?`}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRemoveDialog(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300 h-11"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={() => selectedItem && removeFromFavorites(selectedItem.id)}
                className="flex-1 rounded-xl bg-gradient-to-r from-[#d81b60] to-[#f48fb1] hover:from-[#c2185b] hover:to-[#f9a8d4] text-white shadow-lg shadow-[#d81b60]/25 transition-all duration-300 hover:scale-105 border-2 border-white/20 h-11"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                {isRTL ? 'إزالة' : 'Remove'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog: تفريغ الكل ===== */}
      <Dialog open={showEmptyDialog} onOpenChange={setShowEmptyDialog}>
        <DialogContent className="max-w-md rounded-2xl border-2 border-slate-200 dark:border-slate-700 shadow-2xl p-0 overflow-hidden bg-white dark:bg-[#1e293b]">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-red-500/10 border-2 border-red-400/60 flex items-center justify-center">
                    <Trash2 className="h-6 w-6 text-red-500" />
                  </div>
                  <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                    {isRTL ? 'تفريغ المفضلة' : 'Clear favorites'}
                  </DialogTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-[#2a655f]/10 border border-slate-200 dark:border-slate-700"
                  onClick={() => setShowEmptyDialog(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <DialogDescription className="text-slate-500 dark:text-slate-400">
                {isRTL
                  ? `هل أنت متأكد من إزالة جميع المنتجات (${favorites.length}) من قائمتك؟ هذا الإجراء لا يمكن التراجع عنه.`
                  : `Are you sure you want to remove all (${favorites.length}) products from your list? This action cannot be undone.`}
              </DialogDescription>
            </DialogHeader>
            
            <DialogFooter className="mt-6 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowEmptyDialog(false)}
                className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-300 h-11"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                onClick={clearAllFavorites}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-lg shadow-red-600/25 transition-all duration-300 hover:scale-105 border-2 border-white/20 h-11"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                {isRTL ? 'تأكيد التفريغ' : 'Confirm Clear'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}