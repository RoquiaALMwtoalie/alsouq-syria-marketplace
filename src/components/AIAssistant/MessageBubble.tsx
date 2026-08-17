// 💬 فقاعة الرسالة - نسخة متطورة مع دعم الروابط والمنتجات والصور

import { Bot, User, Sparkles, ExternalLink, ShoppingBag, Store, Tag, MapPin, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useApp } from "@/lib/i18n";

// ============================================================
// 📊 الأنواع
// ============================================================

interface MessageBubbleProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    products?: any[];
    stores?: any[];
    categories?: any[];
    governorates?: any[];
    timestamp: Date;
  };
  isUser: boolean;
  lang: string;
}

interface ParsedLink {
  type: 'product' | 'store' | 'category' | 'governorate' | 'profile' | 'delivery' | 'search';
  url: string;
  text: string;
  label: string;
  icon: JSX.Element;
}

// ============================================================
// 🛍️ بطاقة المنتج
// ============================================================

const ProductCard = ({ product }: { product: any }) => {
  const app = useApp();
  const isArabic = app.lang === "ar";
  
  return (
    <Link
      to={`/listing/${product.id}`}
      className="block mt-2 p-3 rounded-xl border border-[#2a655f]/20 hover:border-[#2a655f]/40 bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex gap-3">
        {/* صورة المنتج */}
        {product.cover_url ? (
          <img
            src={product.cover_url}
            alt={product.title_ar || product.title_en || "منتج"}
            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="h-16 w-16 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
            <ShoppingBag className="h-6 w-6 text-slate-400" />
          </div>
        )}
        
        {/* معلومات المنتج */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors">
            {product.title_ar || product.title_en || "منتج"}
          </h4>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
            {/* السعر */}
            {product.price && (
              <span className="text-sm font-bold text-[#2a655f] dark:text-[#3a8a82]">
                {product.price.toLocaleString()} ل.س
              </span>
            )}
            
            {/* الخصم */}
            {product.is_offer && product.discount_percent && (
              <Badge className="bg-red-500/20 text-red-600 dark:text-red-400 border-0 text-[10px]">
                خصم {product.discount_percent}%
              </Badge>
            )}
          </div>
          
          {/* المتجر والمحافظة */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
            {product.store_name && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <Store className="h-3 w-3" />
                {product.store_name}
              </span>
            )}
            
            {product.governorate_name_ar && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <MapPin className="h-3 w-3" />
                {product.governorate_name_ar}
              </span>
            )}
          </div>
        </div>
        
        {/* زر عرض المنتج */}
        <div className="flex items-center">
          <Button
            size="sm"
            className="h-8 px-3 rounded-lg bg-[#2a655f] hover:bg-[#3a8a82] text-white text-[10px] font-medium transition-all group-hover:scale-105 flex-shrink-0"
          >
            {isArabic ? "عرض المنتج" : "View Product"}
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

// ============================================================
// 🏪 بطاقة المتجر
// ============================================================

const StoreCard = ({ store }: { store: any }) => {
  const app = useApp();
  const isArabic = app.lang === "ar";
  
  return (
    <Link
      to={`/store/${store.id}`}
      className="block mt-2 p-3 rounded-xl border border-[#2a655f]/20 hover:border-[#2a655f]/40 bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex gap-3 items-center">
        {/* أيقونة المتجر */}
        <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center flex-shrink-0">
          <Store className="h-8 w-8 text-white" />
        </div>
        
        {/* معلومات المتجر */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors">
            {store.store_name || store.name_ar || "متجر"}
          </h4>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
            {store.governorate_name_ar && (
              <span className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
                <MapPin className="h-3 w-3" />
                {store.governorate_name_ar}
              </span>
            )}
            
            {store.store_active !== undefined && (
              <span className="flex items-center gap-1 text-[10px] text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isArabic ? "نشط" : "Active"}
              </span>
            )}
          </div>
        </div>
        
        {/* زر عرض المتجر */}
        <div className="flex items-center">
          <Button
            size="sm"
            className="h-8 px-3 rounded-lg bg-[#2a655f] hover:bg-[#3a8a82] text-white text-[10px] font-medium transition-all group-hover:scale-105 flex-shrink-0"
          >
            {isArabic ? "عرض المتجر" : "View Store"}
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

// ============================================================
// 🏷️ بطاقة التصنيف (مع زر عرض التصنيف)
// ============================================================

const CategoryCard = ({ category }: { category: any }) => {
  const app = useApp();
  const isArabic = app.lang === "ar";
  
  // ✅ صورة التصنيف (إذا موجودة)
  const categoryImage = category.image_url || null;
  
  return (
    <Link
      to={`/category/${category.slug}`}
      className="block mt-2 p-3 rounded-xl border border-[#2a655f]/20 hover:border-[#2a655f]/40 bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex gap-3 items-center">
        {/* صورة أو أيقونة التصنيف */}
        {categoryImage ? (
          <img
            src={categoryImage}
            alt={category.name_ar || category.name_en || "تصنيف"}
            className="h-14 w-14 rounded-lg object-cover flex-shrink-0"
          />
        ) : (
          <div className="h-14 w-14 rounded-lg bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center flex-shrink-0">
            <Tag className="h-7 w-7 text-white" />
          </div>
        )}
        
        {/* معلومات التصنيف */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors">
            {category.name_ar || category.name_en || "تصنيف"}
          </h4>
          
          {category.name_en && (
            <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
              {category.name_en}
            </p>
          )}
        </div>
        
        {/* ✅ زر عرض التصنيف */}
        <div className="flex items-center">
          <Button
            size="sm"
            className="h-9 px-4 rounded-xl bg-[#2a655f] hover:bg-[#3a8a82] text-white text-[11px] font-medium transition-all group-hover:scale-105 flex-shrink-0 shadow-md hover:shadow-lg"
          >
            {isArabic ? "عرض التصنيف" : "View Category"}
            <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

// ============================================================
// 📍 بطاقة المحافظة
// ============================================================

const GovernorateCard = ({ governorate }: { governorate: any }) => {
  const app = useApp();
  const isArabic = app.lang === "ar";
  
  return (
    <Link
      to={`/governorate/${governorate.id || governorate.slug}`}
      className="block mt-2 p-3 rounded-xl border border-[#2a655f]/20 hover:border-[#2a655f]/40 bg-white/50 dark:bg-slate-800/50 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex gap-3 items-center">
        {/* أيقونة المحافظة */}
        <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-[#2a655f] to-[#3a8a82] flex items-center justify-center flex-shrink-0">
          <MapPin className="h-6 w-6 text-white" />
        </div>
        
        {/* معلومات المحافظة */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white truncate group-hover:text-[#2a655f] dark:group-hover:text-[#3a8a82] transition-colors">
            {governorate.name_ar || governorate.name_en || "محافظة"}
          </h4>
        </div>
        
        {/* زر عرض المحافظة */}
        <div className="flex items-center">
          <Button
            size="sm"
            className="h-8 px-3 rounded-lg bg-[#2a655f] hover:bg-[#3a8a82] text-white text-[10px] font-medium transition-all group-hover:scale-105 flex-shrink-0"
          >
            {isArabic ? "عرض المحافظة" : "View Governorate"}
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

// ============================================================
// 🎯 المكون الرئيسي
// ============================================================

export function MessageBubble({ message, isUser, lang }: MessageBubbleProps) {
  const isArabic = lang === "ar";
  const [isExpanded, setIsExpanded] = useState(false);
  
  // ============================================================
  // 🔗 تحليل النص واستخراج الروابط
  // ============================================================
  
  const parseLinks = (text: string): (string | ParsedLink)[] => {
    const parts: (string | ParsedLink)[] = [];
    let remaining = text;
    
    // ✅ أنماط الروابط المدعومة
    const linkPatterns = [
      { pattern: /\/listing\/([a-f0-9-]+)/gi, type: 'product' as const, icon: <ShoppingBag className="h-3 w-3" /> },
      { pattern: /\/store\/([a-f0-9-]+)/gi, type: 'store' as const, icon: <Store className="h-3 w-3" /> },
      { pattern: /\/category\/([a-f0-9-]+|[a-z-]+)/gi, type: 'category' as const, icon: <Tag className="h-3 w-3" /> },
      { pattern: /\/governorate\/([a-f0-9-]+)/gi, type: 'governorate' as const, icon: <MapPin className="h-3 w-3" /> },
      { pattern: /\/profile\/([a-f0-9-]+)/gi, type: 'profile' as const, icon: <User className="h-3 w-3" /> },
      { pattern: /\/delivery\/([a-f0-9-]+)/gi, type: 'delivery' as const, icon: <Clock className="h-3 w-3" /> },
      { pattern: /\/search\?q=([^&\s]+)/gi, type: 'search' as const, icon: <Sparkles className="h-3 w-3" /> },
    ];
    
    let lastIndex = 0;
    let foundMatch = false;
    
    for (const { pattern, type, icon } of linkPatterns) {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(remaining)) !== null) {
        foundMatch = true;
        const fullMatch = match[0];
        const id = match[1];
        const startIndex = match.index;
        const endIndex = startIndex + fullMatch.length;
        
        if (startIndex > lastIndex) {
          parts.push(remaining.substring(lastIndex, startIndex));
        }
        
        let label = '';
        switch (type) {
          case 'product': label = isArabic ? '🛍️ عرض المنتج' : '🛍️ View Product'; break;
          case 'store': label = isArabic ? '🏪 عرض المتجر' : '🏪 View Store'; break;
          case 'category': label = isArabic ? '📂 عرض التصنيف' : '📂 View Category'; break;
          case 'governorate': label = isArabic ? '📍 عرض المحافظة' : '📍 View Governorate'; break;
          case 'profile': label = isArabic ? '👤 عرض الملف' : '👤 View Profile'; break;
          case 'delivery': label = isArabic ? '🚚 عرض التوصيل' : '🚚 View Delivery'; break;
          case 'search': label = isArabic ? '🔍 عرض البحث' : '🔍 View Search'; break;
        }
        
        parts.push({
          type,
          url: fullMatch,
          text: fullMatch,
          label,
          icon,
        });
        
        lastIndex = endIndex;
        pattern.lastIndex = lastIndex;
      }
    }
    
    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }
    
    if (!foundMatch && parts.length === 0) {
      parts.push(text);
    }
    
    return parts;
  };
  
  // ============================================================
  // 🖼️ عرض المحتوى مع الروابط
  // ============================================================
  
  const renderContent = (text: string) => {
    const parts = parseLinks(text);
    
    return parts.map((part, index) => {
      if (typeof part === 'string') {
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      }
      
      return (
        <Link
          key={index}
          to={part.url}
          className="inline-flex items-center gap-1.5 mt-1 px-3 py-1.5 bg-[#2a655f]/10 hover:bg-[#2a655f]/20 dark:bg-[#2a655f]/20 dark:hover:bg-[#2a655f]/30 text-[#2a655f] dark:text-[#3a8a82] rounded-xl border border-[#2a655f]/20 hover:border-[#2a655f]/40 transition-all duration-300 group text-xs font-medium"
        >
          <span className="group-hover:scale-110 transition-transform">
            {part.icon}
          </span>
          {part.label}
          <ExternalLink className="h-2.5 w-2.5 opacity-50 group-hover:opacity-100 transition-opacity" />
        </Link>
      );
    });
  };
  
  // ============================================================
  // ⭐ عرض التقييمات إذا وجدت
  // ============================================================
  
  const renderRating = (rating?: number) => {
    if (!rating) return null;
    return (
      <div className="flex items-center gap-0.5 mt-1">
        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
        <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
          {rating.toFixed(1)}
        </span>
      </div>
    );
  };
  
  // ============================================================
  // 📝 تنسيق النص
  // ============================================================
  
  const formatText = (text: string) => {
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-bold text-base mt-2 mb-1 text-slate-800 dark:text-slate-200">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      
      if (line.startsWith('#')) {
        return (
          <div key={index} className="font-semibold text-sm mt-1.5 mb-0.5 text-slate-700 dark:text-slate-300">
            {line.replace(/^#+\s*/, '')}
          </div>
        );
      }
      
      if (/^[\s]*[•\-*]/.test(line) || /^\d+[\.\)]/.test(line)) {
        return (
          <div key={index} className="flex items-start gap-1.5 text-sm py-0.5">
            <span className="text-[#2a655f] dark:text-[#3a8a82]">•</span>
            <span>{line.replace(/^[\s]*[•\-*\d+\.\)]\s*/, '')}</span>
          </div>
        );
      }
      
      if (/^[\s]*[:：]/.test(line)) {
        return (
          <div key={index} className="text-sm py-0.5 font-medium text-slate-700 dark:text-slate-300">
            {line}
          </div>
        );
      }
      
      if (!line.trim()) {
        return <div key={index} className="h-1" />;
      }
      
      return (
        <div key={index} className="text-sm leading-relaxed">
          {renderContent(line)}
        </div>
      );
    });
  };
  
  // ============================================================
  // 🎨 تحديد لون الفقاعة
  // ============================================================
  
  const bubbleStyles = isUser
    ? "bg-[#2a655f] text-white rounded-tr-none"
    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none";
  
  const avatarStyles = isUser
    ? "bg-[#2a655f]/10 text-[#2a655f]"
    : "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white";
  
  // ============================================================
  // 🖥️ العرض
  // ============================================================
  
  return (
    <div className={cn(
      "flex gap-3 animate-fade-up",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
        avatarStyles
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>
      
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm transition-all",
        bubbleStyles
      )}>
        <div className="text-sm leading-relaxed break-words space-y-0.5">
          {formatText(message.content)}
        </div>
        
        {/* ===== بطاقات المنتجات ===== */}
        {message.products && message.products.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10 dark:border-slate-700/50">
            <p className="text-[10px] font-bold opacity-60 mb-2">
              {isArabic ? '🛍️ المنتجات المقترحة:' : '🛍️ Suggested products:'}
            </p>
            <div className="flex flex-col gap-2">
              {message.products.slice(0, 3).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
        
        {/* ===== بطاقات المتاجر ===== */}
        {message.stores && message.stores.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10 dark:border-slate-700/50">
            <p className="text-[10px] font-bold opacity-60 mb-2">
              {isArabic ? '🏪 المتاجر المقترحة:' : '🏪 Suggested stores:'}
            </p>
            <div className="flex flex-col gap-2">
              {message.stores.slice(0, 3).map((store) => (
                <StoreCard key={store.id} store={store} />
              ))}
            </div>
          </div>
        )}
        
        {/* ===== بطاقات التصنيفات ===== */}
        {message.categories && message.categories.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10 dark:border-slate-700/50">
            <p className="text-[10px] font-bold opacity-60 mb-2">
              {isArabic ? '📂 التصنيفات المتاحة:' : '📂 Available categories:'}
            </p>
            <div className="flex flex-col gap-2">
              {message.categories.map((category) => (
                <CategoryCard key={category.id || category.slug} category={category} />
              ))}
            </div>
          </div>
        )}
        
        {/* ===== بطاقات المحافظات ===== */}
        {message.governorates && message.governorates.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10 dark:border-slate-700/50">
            <p className="text-[10px] font-bold opacity-60 mb-2">
              {isArabic ? '📍 المحافظات المتاحة:' : '📍 Available governorates:'}
            </p>
            <div className="flex flex-col gap-2">
              {message.governorates.map((governorate) => (
                <GovernorateCard key={governorate.id || governorate.slug} governorate={governorate} />
              ))}
            </div>
          </div>
        )}
        
        <div className={cn(
          "text-[9px] mt-1.5 opacity-60 flex items-center gap-1",
          isUser ? "text-white/70" : "text-muted-foreground"
        )}>
          <Clock className="h-2.5 w-2.5" />
          {message.timestamp.toLocaleTimeString(
            isArabic ? "ar-SA" : "en-US",
            { hour: "2-digit", minute: "2-digit" }
          )}
          
          {!isUser && (
            <Badge className="ml-1 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-0 text-[7px] px-1 py-0">
              <Sparkles className="h-2 w-2 inline mr-0.5" />
              AI
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;