// src/components/FavoritesPage.tsx
import { useState, useEffect } from "react";
import { useApp, formatPrice } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { 
  Heart, ShoppingBag, Store, MapPin, Star, Trash2, 
  ShoppingCart, HeartOff, Package, X, ChevronLeft, ChevronRight,
  Share2, Eye, Clock, Truck, Shield, Award, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export function FavoritesPage() {
  const app = useApp();
  const navigate = useNavigate();
  const isRTL = app.lang === 'ar';
  
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<FavoriteItem | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showEmptyDialog, setShowEmptyDialog] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // ============================================================
  // 📦 جلب البيانات من قاعدة البيانات
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
            ? `⚠️ تم حذف ${deletedCount} منتج من المفضلة لأنه غير متوفر` 
            : `⚠️ ${deletedCount} products were removed because they're no longer available`,
          { duration: 4000 }
        );
      }

    } catch (error) {
      console.error('❌ Error fetching favorites:', error);
      toast.error(
        isRTL 
          ? '❌ فشل جلب المفضلة، حاول مرة أخرى' 
          : '❌ Failed to load favorites, please try again'
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
          ? '✅ تمت إزالة المنتج من المفضلة' 
          : '✅ Removed from favorites'
      );
    } catch (error) {
      console.error('❌ Error removing favorite:', error);
      toast.error(
        isRTL 
          ? '❌ فشل الإزالة، حاول مرة أخرى' 
          : '❌ Failed to remove, please try again'
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
          ? '❌ فشل التفريغ، حاول مرة أخرى' 
          : '❌ Failed to clear, please try again'
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
        ? '🛒 تمت إضافة المنتج إلى السلة' 
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

  const renderRating = (rating: number) => {
    if (!rating || rating === 0) {
      return (
        <span className="text-xs text-slate-400">
          {isRTL ? 'لا توجد تقييمات' : 'No reviews'}
        </span>
      );
    }

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 fill-yellow-400/50 text-yellow-400" />
        );
      } else {
        stars.push(
          <Star key={i} className="h-3.5 w-3.5 text-slate-300 dark:text-slate-600" />
        );
      }
    }
    return stars;
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(
      isRTL ? 'ar-SA' : 'en-US',
      { year: 'numeric', month: 'short', day: 'numeric' }
    );
  };

  // ============================================================
  // 🌀 Skeleton Loader
  // ============================================================
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
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
              <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm">
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
  // 📭 صفحة فارغة - احترافية
  // ============================================================
  if (favorites.length === 0) {
    return (
      <div className="min-h-[80vh] bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center px-6">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-rose-400 rounded-full blur-3xl opacity-20 animate-pulse" />
            <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-950/30 dark:to-rose-950/30 flex items-center justify-center mx-auto border-4 border-pink-200/50 dark:border-pink-800/50">
              <Heart className="h-14 w-14 text-pink-500" strokeWidth={1.5} />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-6">
            {isRTL ? 'قائمة المفضلة فارغة' : 'Favorites is empty'}
          </h1>
          
          <p className="text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
            {isRTL 
              ? 'ابدأ بإضافة المنتجات التي تعجبك إلى قائمة المفضلة لتجدها بسهولة لاحقاً' 
              : 'Start adding products you like to your favorites list to find them easily later'}
          </p>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate({ to: '/' })}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl px-8 py-6 text-base shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 transition-all hover:scale-105"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              {isRTL ? 'استكشف المنتجات' : 'Explore Products'}
            </Button>
            
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/categories' })}
              className="rounded-2xl px-8 py-6 text-base border-2"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              {isRTL ? 'تصفح التصنيفات' : 'Browse Categories'}
            </Button>
          </div>
          
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              { icon: Truck, text: isRTL ? 'توصيل سريع' : 'Fast Delivery' },
              { icon: Shield, text: isRTL ? 'دفع آمن' : 'Secure Payment' },
              { icon: Award, text: isRTL ? 'جودة مضمونة' : 'Quality Guarantee' },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
                <item.icon className="h-5 w-5 text-blue-500" />
                <span className="text-xs text-slate-600 dark:text-slate-400">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // 🏠 الصفحة الرئيسية - احترافية مثل نون
  // ============================================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* ===== Header ===== */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 shadow-lg shadow-pink-500/25">
                <Heart className="h-6 w-6 text-white fill-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                  {isRTL ? 'المفضلة' : 'Favorites'}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {isRTL 
                    ? `${favorites.length} منتج في قائمتك` 
                    : `${favorites.length} products in your list`}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className="rounded-xl border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ShoppingBag className="h-4 w-4 mr-1.5" />
              {isRTL ? 'مواصلة التسوق' : 'Continue Shopping'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEmptyDialog(true)}
              className="rounded-xl border-red-200/50 text-red-500 hover:text-red-600 hover:bg-red-50/50 dark:hover:bg-red-950/30"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {isRTL ? 'تفريغ الكل' : 'Clear All'}
            </Button>
          </div>
        </div>

        {/* ===== Stats Bar ===== */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { 
              icon: Heart, 
              label: isRTL ? 'إجمالي المفضلات' : 'Total Favorites',
              value: favorites.length,
              color: 'text-pink-500'
            },
            { 
              icon: Store, 
              label: isRTL ? 'عدد المتاجر' : 'Stores',
              value: new Set(favorites.map(f => f.listings?.owner_id)).size,
              color: 'text-blue-500'
            },
            { 
              icon: ShoppingBag, 
              label: isRTL ? 'متوفر للشراء' : 'Available',
              value: favorites.filter(f => f.listings?.is_available !== false).length,
              color: 'text-emerald-500'
            },
            { 
              icon: Star, 
              label: isRTL ? 'متوسط التقييم' : 'Avg Rating',
              value: (favorites.reduce((acc, f) => acc + (f.listings?.rating || 0), 0) / favorites.length || 0).toFixed(1),
              color: 'text-yellow-500'
            },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl bg-${stat.color.split('-')[1]}-50 dark:bg-${stat.color.split('-')[1]}-950/30`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Grid ===== */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {favorites.map((item) => {
            if (!item?.listings) return null;
            
            const listing = item.listings;
            const productTitle = getProductTitle(item);
            const storeName = getStoreName(item);
            const image = getProductImage(item);
            const governorateName = getGovernorateName(item);
            const { isAvailable, text: availabilityText, color: availabilityColor } = getAvailability(item);
            const isHovered = hoveredItem === item.id;
            
            const isOffer = listing.is_offer === true;
            const discount = listing.discount_percent || 0;
            const price = listing.price || 0;
            const oldPrice = listing.old_price || 0;
            const rating = listing.rating || 0;
            const favoritesCount = listing.favorites_count || 0;

            return (
              <div
                key={item.id}
                className="group relative bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200/50 dark:border-slate-700/50"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {/* ===== صورة المنتج ===== */}
                <Link to={`/listing/${listing.id}`} className="block relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    src={image}
                    alt={productTitle}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.png';
                    }}
                  />
                  
                  {/* ===== Badges ===== */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {isOffer && discount > 0 && (
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-3 py-1 text-[10px] font-bold animate-pulse">
                        -{discount}%
                      </Badge>
                    )}
                    {!isAvailable && (
                      <Badge className="bg-red-500/90 text-white border-0 shadow-lg rounded-full px-3 py-1 text-[10px]">
                        {isRTL ? 'غير متوفر' : 'Out of stock'}
                      </Badge>
                    )}
                  </div>

                  {/* ===== Quick Actions - تظهر عند التمرير ===== */}
                  <div className={cn(
                    "absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 transition-opacity duration-300",
                    isHovered ? "opacity-100" : "opacity-0"
                  )}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            className="h-12 w-12 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 shadow-xl text-slate-700 dark:text-white"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowRemoveDialog(true);
                            }}
                          >
                            <HeartOff className="h-5 w-5 text-pink-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRTL ? 'إزالة من المفضلة' : 'Remove from favorites'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            className="h-12 w-12 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 shadow-xl text-slate-700 dark:text-white"
                            onClick={() => addToCart(listing)}
                            disabled={!isAvailable}
                          >
                            <ShoppingCart className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRTL ? 'إضافة إلى السلة' : 'Add to cart'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            className="h-12 w-12 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-700 shadow-xl text-slate-700 dark:text-white"
                            onClick={() => navigate({ to: `/listing/${listing.id}` })}
                          >
                            <Eye className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRTL ? 'عرض التفاصيل' : 'View details'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* ===== زر المفضلة في الزاوية ===== */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur hover:bg-white dark:hover:bg-slate-700 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      setSelectedItem(item);
                      setShowRemoveDialog(true);
                    }}
                  >
                    <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
                  </Button>
                </Link>

                {/* ===== المحتوى ===== */}
                <div className="p-4 space-y-2">
                  {/* ===== اسم المتجر ===== */}
                  <Link 
                    to={`/store/${listing.owner_id}`} 
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Store className="h-3 w-3" />
                    <span className="truncate">{storeName}</span>
                  </Link>

                  {/* ===== اسم المنتج ===== */}
                  <Link to={`/listing/${listing.id}`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {productTitle}
                    </h3>
                  </Link>

                  {/* ===== التقييم ===== */}
                  <div className="flex items-center gap-1.5">
                    <div className="flex items-center gap-0.5">
                      {renderRating(rating)}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({favoritesCount})
                    </span>
                  </div>

                  {/* ===== السعر ===== */}
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-slate-900 dark:text-white">
                      {formatPrice(price, listing.currency || 'SYP', app.lang)}
                    </span>
                    {isOffer && oldPrice > 0 && oldPrice > price && (
                      <span className="text-sm text-red-500 line-through">
                        {formatPrice(oldPrice, listing.currency || 'SYP', app.lang)}
                      </span>
                    )}
                  </div>

                  {/* ===== الموقع والحالة ===== */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-700/50">
                    {governorateName && (
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-[80px]">{governorateName}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1.5">
                      <div className={cn("h-1.5 w-1.5 rounded-full", isAvailable ? "bg-emerald-500" : "bg-red-500")} />
                      <span className={cn("text-[10px] font-medium", availabilityColor)}>
                        {availabilityText}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== Footer Actions ===== */}
        <div className="mt-12 flex items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          <div className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
            <Heart className="h-5 w-5 text-pink-500" />
            <span>
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
              className="rounded-xl"
            >
              {isRTL ? 'مواصلة التسوق' : 'Continue Shopping'}
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowEmptyDialog(true)}
              className="rounded-xl"
            >
              <Trash2 className="h-4 w-4 mr-1.5" />
              {isRTL ? 'تفريغ الكل' : 'Clear All'}
            </Button>
          </div>
        </div>
      </div>

      {/* ===== Dialog: إزالة من المفضلة ===== */}
      <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <DialogContent className="rounded-2xl max-w-md p-0 overflow-hidden">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-pink-100 dark:bg-pink-950/30">
                    <HeartOff className="h-6 w-6 text-pink-500" />
                  </div>
                  <DialogTitle className="text-xl font-bold">
                    {isRTL ? 'إزالة من المفضلة' : 'Remove from favorites'}
                  </DialogTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
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
                className="flex-1 rounded-xl"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                variant="destructive"
                onClick={() => selectedItem && removeFromFavorites(selectedItem.id)}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
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
        <DialogContent className="rounded-2xl max-w-md p-0 overflow-hidden">
          <div className="p-6">
            <DialogHeader className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-red-100 dark:bg-red-950/30">
                    <Trash2 className="h-6 w-6 text-red-500" />
                  </div>
                  <DialogTitle className="text-xl font-bold">
                    {isRTL ? 'تفريغ المفضلة' : 'Clear favorites'}
                  </DialogTitle>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
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
                className="flex-1 rounded-xl"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </Button>
              <Button
                variant="destructive"
                onClick={clearAllFavorites}
                className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600"
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