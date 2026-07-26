import { Package, Gift, Clock, Edit2, Trash2, Eye, MoreVertical, DollarSign, Layers, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: any;
  onEdit: () => void;
  onDelete: () => void;
  onView: () => void;
  lang: string;
  currency: string;
  formatPrice: (price: number, currency: string, lang: string) => string;
  viewMode?: "grid" | "list";
}

export function ProductCard({ product, onEdit, onDelete, onView, lang, currency, formatPrice, viewMode = "grid" }: ProductCardProps) {
  const isOffer = product.is_offer;
  const status = product.status;
  const discount = product.discount_percent;
  const avgRating = product.avg_rating || product.rating || 0;
  const reviewsCount = product.reviews_count || 0;

  // ✅ حساب عدد النجوم
  const fullStars = Math.round(avgRating);

  if (viewMode === "list") {
    return (
      <div className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/40 hover:shadow-xl transition-all duration-300 flex flex-col sm:flex-row">
        <div className="sm:w-48 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 relative overflow-hidden">
          {product.cover_url ? (
            <img src={product.cover_url} alt={product.title_ar} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="flex h-full w-full items-center justify-center"><Package className="h-16 w-16 text-muted-foreground/20" /></div>
          )}
          {isOffer && discount && <Badge className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-2.5 py-0.5 text-xs font-bold">-{discount}%</Badge>}
          {status === "pending" && <Badge className="absolute bottom-2 left-2 bg-yellow-500/90 text-white border-0 shadow-lg rounded-full px-2.5 py-0.5 text-xs flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{lang === "ar" ? "قيد المراجعة" : "Pending"}</Badge>}
          {!product.is_available && <Badge className="absolute bottom-2 right-2 bg-red-500/90 text-white border-0 shadow-lg rounded-full px-2.5 py-0.5 text-xs">{lang === "ar" ? "غير متوفر" : "Unavailable"}</Badge>}
        </div>
        <div className="flex-1 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">{product.title_ar}</div>
            
            {/* ✅ التقييم بالنجوم */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={cn(
                    "h-3.5 w-3.5",
                    star <= fullStars ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"
                  )} />
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({reviewsCount})</span>
            </div>
            
            <div className="flex items-center gap-2 mt-1">
              <Badge className={isOffer ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0 rounded-full text-[10px]" : "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0 rounded-full text-[10px]"}>
                {isOffer ? <Gift className="h-3 w-3 mr-1" /> : <Package className="h-3 w-3 mr-1" />}
                {isOffer ? (lang === "ar" ? "عرض" : "Offer") : (lang === "ar" ? "منتج" : "Product")}
              </Badge>
              <span className={`inline-flex items-center gap-1 text-xs ${product.is_available ? 'text-emerald-600' : 'text-red-500'}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${product.is_available ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {product.is_available ? (lang === "ar" ? "متوفر" : "Available") : (lang === "ar" ? "غير متوفر" : "Unavailable")}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mt-2">
              <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{formatPrice(Number(product.price), currency, lang)}</span>
              {product.old_price && product.old_price > product.price && (
                <span className="text-xs text-red-500 line-through">{formatPrice(Number(product.old_price), currency, lang)}</span>
              )}
            </div>
            
            {/* ✅ عرض الألوان المصغرة */}
            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1 mt-2">
                <div className="flex -space-x-1">
                  {product.colors.slice(0, 4).map((color: any) => (
                    <div 
                      key={color.id} 
                      className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden"
                    >
                      <img 
                        src={color.image_url} 
                        alt={color.color_name_ar}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-color.png';
                        }}
                      />
                    </div>
                  ))}
                </div>
                {product.colors.length > 4 && (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    +{product.colors.length - 4}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button size="sm" variant="outline" className="rounded-xl text-xs h-9" onClick={onEdit}><Edit2 className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />{lang === "ar" ? "تعديل" : "Edit"}</Button>
            <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl h-9 w-9 p-0" onClick={onDelete}><Trash2 className="h-4 w-4" /></Button>
            <Button size="sm" variant="ghost" className="rounded-xl h-9 w-9 p-0" onClick={onView}><Eye className="h-4 w-4 text-indigo-500" /></Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 hover:-translate-y-2">
      {/* ===== صورة المنتج ===== */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 cursor-pointer" onClick={onView}>
        {product.cover_url ? (
          <img 
            src={product.cover_url} 
            alt={product.title_ar} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center"><Package className="h-20 w-20 text-muted-foreground/20" /></div>
        )}
        
        {/* ===== Badges ===== */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOffer && (
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1.5">
              🔥 {lang === "ar" ? "عرض" : "Offer"}
              {discount && ` -${discount}%`}
            </Badge>
          )}
          {status === "pending" && (
            <Badge className="bg-yellow-500/90 text-white border-0 shadow-lg rounded-full px-3 py-1 flex items-center gap-1 text-xs">
              <Clock className="h-3 w-3" />
              {lang === "ar" ? "قيد المراجعة" : "Pending"}
            </Badge>
          )}
        </div>
        
        {/* ===== حالة التوفر ===== */}
        {!product.is_available && (
          <Badge className="absolute top-3 right-3 bg-red-500/90 text-white border-0 shadow-lg rounded-full px-3 py-1 text-xs">
            ❌ {lang === "ar" ? "غير متوفر" : "Unavailable"}
          </Badge>
        )}
        
        {/* ===== التصنيف ===== */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="secondary" className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm text-slate-700 dark:text-slate-300 border-0 shadow-lg rounded-full px-3 py-1 text-xs font-medium">
            <Layers className="h-3 w-3 mr-1" />
            {product.category_name || product.categories?.name_ar || ""}
          </Badge>
        </div>
        
        {/* ===== أيقونة Eye عند Hover ===== */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
          <div className="bg-white/95 dark:bg-slate-900/95 rounded-full p-3.5 shadow-2xl hover:scale-110 transition-transform">
            <Eye className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
      </div>
      
      {/* ===== معلومات المنتج ===== */}
      <div className="p-4 space-y-2.5">
        {/* ===== اسم المنتج ===== */}
        <div className="font-semibold text-base line-clamp-1 group-hover:text-indigo-600 transition-colors">
          {product.title_ar}
        </div>
        
        {/* ===== التقييم بالنجوم (مثل نون) ===== */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={cn(
                "h-3.5 w-3.5",
                star <= fullStars ? "fill-yellow-400 text-yellow-400" : "text-slate-300 dark:text-slate-600"
              )} />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({reviewsCount})</span>
        </div>
        
        {/* ===== الألوان المصغرة (مثل نون) ===== */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="flex -space-x-1">
              {product.colors.slice(0, 4).map((color: any) => (
                <div 
                  key={color.id} 
                  className="w-5 h-5 rounded-full border-2 border-white dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  <img 
                    src={color.image_url} 
                    alt={color.color_name_ar}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-color.png';
                    }}
                  />
                </div>
              ))}
            </div>
            {product.colors.length > 4 && (
              <span className="text-[10px] text-muted-foreground font-medium">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
        
        {/* ===== السعر ===== */}
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(Number(product.price), currency, lang)}
            </div>
            {product.price_usd && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                ${Number(product.price_usd).toFixed(2)}
              </div>
            )}
          </div>
          {product.old_price && product.old_price > product.price && (
            <div className="text-xs text-red-500 line-through font-medium">
              {formatPrice(Number(product.old_price), currency, lang)}
            </div>
          )}
        </div>
        
        {/* ===== حالة التوفر ===== */}
        <div className="flex items-center gap-1.5">
          <span className={`h-1.5 w-1.5 rounded-full ${product.is_available ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span className={`text-xs font-medium ${product.is_available ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
            {product.is_available 
              ? (lang === "ar" ? "متوفر" : "Available") 
              : (lang === "ar" ? "غير متوفر" : "Unavailable")}
          </span>
        </div>
        
        {/* ===== أزرار الإجراءات ===== */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <Button size="sm" variant="outline" className="flex-1 rounded-xl text-xs font-medium h-9 group" onClick={onEdit}>
            <Edit2 className="h-3.5 w-3.5 mr-1.5 text-indigo-500 group-hover:rotate-12 transition-transform" />
            {lang === "ar" ? "تعديل" : "Edit"}
          </Button>
          <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600 hover:bg-red-50/50 rounded-xl h-9 w-9 p-0 group" onClick={onDelete}>
            <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="rounded-xl h-9 w-9 p-0 group">
                <MoreVertical className="h-4 w-4 group-hover:scale-110 transition-transform" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-xl min-w-[180px] p-1">
              <DropdownMenuItem className="cursor-pointer rounded-lg text-sm group" onClick={onView}>
                <Eye className="h-4 w-4 mr-2 text-indigo-500" />
                {lang === "ar" ? "عرض التفاصيل" : "View Details"}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg text-sm group" onClick={onEdit}>
                <Edit2 className="h-4 w-4 mr-2 text-indigo-500" />
                {lang === "ar" ? "تعديل" : "Edit"}
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer rounded-lg text-sm text-red-500 hover:text-red-600 hover:bg-red-50" onClick={onDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                {lang === "ar" ? "حذف" : "Delete"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}