// src/components/search/SearchResults.tsx
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SearchResult } from "@/lib/hooks/useSearch";
import { useApp } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Star, MapPin, Store, Package, Tag, TrendingUp, Loader2, 
  Calendar, Eye, Heart, Search, Grid3x3, List, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  totalResults: number;
  viewMode?: "grid" | "list";
  className?: string;
}

export function SearchResults({
  results,
  isLoading,
  hasMore,
  onLoadMore,
  totalResults,
  viewMode = "grid",
  className,
}: SearchResultsProps) {
  const app = useApp();

  if (isLoading && results.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-[#0084ff]" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="h-20 w-20 rounded-full bg-[#e4e6eb] dark:bg-[#3a3b4a] flex items-center justify-center mx-auto mb-4">
          <Search className="h-10 w-10 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">
          {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {app.lang === "ar"
            ? "حاول استخدام كلمات بحث مختلفة أو قلل من الفلاتر"
            : "Try different keywords or reduce filters"}
        </p>
      </motion.div>
    );
  }

  // ✅ أيقونة النوع
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'store': return <Store className="h-3.5 w-3.5" />;
      case 'category': return <Tag className="h-3.5 w-3.5" />;
      case 'offer': return <TrendingUp className="h-3.5 w-3.5" />;
      default: return <Package className="h-3.5 w-3.5" />;
    }
  };

  // ✅ لون النوع
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'store': return "bg-blue-500/10 text-blue-600 border-blue-200 dark:bg-blue-500/20 dark:text-blue-400 dark:border-blue-800";
      case 'category': return "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-800";
      case 'offer': return "bg-red-500/10 text-red-600 border-red-200 dark:bg-red-500/20 dark:text-red-400 dark:border-red-800";
      default: return "bg-purple-500/10 text-purple-600 border-purple-200 dark:bg-purple-500/20 dark:text-purple-400 dark:border-purple-800";
    }
  };

  // ✅ تنسيق السعر
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M SYP`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K SYP`;
    }
    return `${price.toLocaleString()} SYP`;
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* ✅ عدد النتائج */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {app.lang === "ar"
            ? `تم العثور على ${totalResults.toLocaleString()} نتيجة`
            : `${totalResults.toLocaleString()} results found`}
        </p>
      </div>

      {/* ✅ شبكة النتائج */}
      <div className={cn(
        "grid gap-4",
        viewMode === "grid" 
          ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-1"
      )}>
        {results.map((result, index) => (
          <motion.div
            key={`${result.type}-${result.id}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.05, 0.5) }}
            className={cn(
              viewMode === "list" && "sm:col-span-2 lg:col-span-3 xl:col-span-4"
            )}
          >
            <Link
              to={result.url}
              className={cn(
                "block group bg-white dark:bg-[#242538] rounded-xl border border-[#e4e6eb] dark:border-[#3a3b4a] overflow-hidden hover:shadow-lg hover:border-blue-400/50 transition-all duration-300",
                viewMode === "list" && "flex flex-col sm:flex-row"
              )}
            >
              {/* ✅ صورة المنتج */}
              <div className={cn(
                "relative bg-[#e4e6eb] dark:bg-[#3a3b4a] overflow-hidden",
                viewMode === "list" 
                  ? "w-full sm:w-48 h-48 sm:h-auto aspect-square sm:aspect-auto shrink-0"
                  : "aspect-[4/3]"
              )}>
                {result.image ? (
                  <img
                    src={result.image}
                    alt={result.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {getTypeIcon(result.type)}
                  </div>
                )}
                
                {/* ✅ نوع النتيجة (Badge) */}
                <div className="absolute top-2 left-2">
                  <Badge className={cn(
                    "text-[10px] border",
                    getTypeColor(result.type)
                  )}>
                    {getTypeIcon(result.type)}
                    <span className="ml-1">
                      {result.type === 'store' && (app.lang === "ar" ? "متجر" : "Store")}
                      {result.type === 'category' && (app.lang === "ar" ? "تصنيف" : "Category")}
                      {result.type === 'offer' && (app.lang === "ar" ? "عرض" : "Offer")}
                      {result.type === 'product' && (app.lang === "ar" ? "منتج" : "Product")}
                    </span>
                  </Badge>
                </div>

                {/* ✅ السعر */}
                {result.price && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-blue-600 text-white border-0 text-sm font-bold shadow-lg">
                      {formatPrice(result.price)}
                    </Badge>
                  </div>
                )}

                {/* ✅ عرض خاص */}
                {result.badge && result.type === 'offer' && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-red-500 text-white border-0 animate-pulse">
                      {result.badge}
                    </Badge>
                  </div>
                )}

                {/* ✅ زر المفضلة */}
                <button 
                  className="absolute bottom-2 left-2 p-1.5 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                  onClick={(e) => {
                    e.preventDefault();
                    // TODO: إضافة إلى المفضلة
                  }}
                >
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                </button>
              </div>

              {/* ✅ معلومات النتيجة */}
              <div className={cn(
                "p-4 flex-1",
                viewMode === "list" && "flex flex-col justify-between"
              )}>
                <div>
                  <h4 className="font-semibold text-sm line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {result.title}
                  </h4>
                  
                  {result.description && (
                    <p className={cn(
                      "text-xs text-muted-foreground mt-1",
                      viewMode === "list" ? "line-clamp-3" : "line-clamp-2"
                    )}>
                      {result.description}
                    </p>
                  )}

                  <div className="flex items-center gap-2 mt-2">
                    {result.store_name && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
                        <Store className="h-3 w-3 shrink-0" />
                        <span className="truncate">{result.store_name}</span>
                      </span>
                    )}
                    
                    {result.rating && (
                      <span className="text-xs text-yellow-500 flex items-center gap-1 ml-auto">
                        <Star className="h-3 w-3 fill-yellow-500" />
                        {result.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>

                {/* ✅ تاريخ الإضافة + التفاصيل */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100/50 dark:border-slate-800/50">
                  {result.created_at && (
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(result.created_at).toLocaleDateString(
                        app.lang === "ar" ? "ar-SA" : "en-US"
                      )}
                    </div>
                  )}
                  
                  {result.type === 'product' && (
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <Eye className="h-3 w-3" />
                      <span>124</span>
                    </div>
                  )}
                </div>

                {/* ✅ زر التفاصيل (في وضع القائمة) */}
                {viewMode === "list" && (
                  <Button 
                    size="sm"
                    className="mt-3 w-full sm:w-auto rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {app.lang === "ar" ? "عرض التفاصيل" : "View Details"}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                )}
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ✅ زر تحميل المزيد */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="rounded-xl px-8 bg-[#0084ff] hover:bg-[#0073e6] text-white shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {app.lang === "ar" ? "جاري التحميل..." : "Loading..."}
              </>
            ) : (
              app.lang === "ar" ? "تحميل المزيد" : "Load more"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}