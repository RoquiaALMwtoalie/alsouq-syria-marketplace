// src/components/AIAssistant/MessageBubble.tsx
// 💬 فقاعة الرسالة - نسخة متطورة مع دعم الروابط والمنتجات والصور

import { Bot, User, Sparkles, ExternalLink, ShoppingBag, Store, Tag, MapPin, Star, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
      // /listing/{id}
      { pattern: /\/listing\/([a-f0-9-]+)/gi, type: 'product' as const, icon: <ShoppingBag className="h-3 w-3" /> },
      // /store/{id}
      { pattern: /\/store\/([a-f0-9-]+)/gi, type: 'store' as const, icon: <Store className="h-3 w-3" /> },
      // /category/{slug}
      { pattern: /\/category\/([a-f0-9-]+|[a-z-]+)/gi, type: 'category' as const, icon: <Tag className="h-3 w-3" /> },
      // /governorate/{id}
      { pattern: /\/governorate\/([a-f0-9-]+)/gi, type: 'governorate' as const, icon: <MapPin className="h-3 w-3" /> },
      // /profile/{id}
      { pattern: /\/profile\/([a-f0-9-]+)/gi, type: 'profile' as const, icon: <User className="h-3 w-3" /> },
      // /delivery/{id}
      { pattern: /\/delivery\/([a-f0-9-]+)/gi, type: 'delivery' as const, icon: <Clock className="h-3 w-3" /> },
      // /search?q=...
      { pattern: /\/search\?q=([^&\s]+)/gi, type: 'search' as const, icon: <Sparkles className="h-3 w-3" /> },
    ];
    
    let lastIndex = 0;
    let foundMatch = false;
    
    // ✅ البحث عن جميع الروابط في النص
    for (const { pattern, type, icon } of linkPatterns) {
      let match;
      pattern.lastIndex = 0;
      
      while ((match = pattern.exec(remaining)) !== null) {
        foundMatch = true;
        const fullMatch = match[0];
        const id = match[1];
        const startIndex = match.index;
        const endIndex = startIndex + fullMatch.length;
        
        // ✅ النص قبل الرابط
        if (startIndex > lastIndex) {
          parts.push(remaining.substring(lastIndex, startIndex));
        }
        
        // ✅ تحديد اسم الرابط
        let label = '';
        switch (type) {
          case 'product': label = isArabic ? '🛍️ عرض المنتج' : '🛍️ View Product'; break;
          case 'store': label = isArabic ? '🏪 عرض المتجر' : '🏪 View Store'; break;
          case 'category': label = isArabic ? '📂 عرض التصنيف' : '📂 View Category'; break;
          case 'governorate': label = isArabic ? '📍 عرض المحافظة' : '📍 View Governorate'; break;
          case 'profile': label = isArabic ? '👤 عرض الملف' : '👤 View Profile'; break;
          case 'delivery': label = isArabic ? '📦 عرض التوصيل' : '📦 View Delivery'; break;
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
    
    // ✅ إضافة النص المتبقي
    if (lastIndex < remaining.length) {
      parts.push(remaining.substring(lastIndex));
    }
    
    // ✅ إذا لم يتم العثور على روابط، أرجع النص كاملاً
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
        // ✅ نص عادي - مع دعم الخطوط الجديدة
        return (
          <span key={index} className="whitespace-pre-wrap">
            {part}
          </span>
        );
      }
      
      // ✅ رابط - عرض كزر قابل للنقر
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
  // 📝 تنسيق النص (تحديد العناوين والقوائم)
  // ============================================================
  
  const formatText = (text: string) => {
    // تقسيم النص إلى سطور
    const lines = text.split('\n');
    
    return lines.map((line, index) => {
      // ✅ عنوان (يبدأ بـ **)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <div key={index} className="font-bold text-base mt-2 mb-1 text-slate-800 dark:text-slate-200">
            {line.replace(/\*\*/g, '')}
          </div>
        );
      }
      
      // ✅ عنوان فرعي (يبدأ بـ #)
      if (line.startsWith('#')) {
        return (
          <div key={index} className="font-semibold text-sm mt-1.5 mb-0.5 text-slate-700 dark:text-slate-300">
            {line.replace(/^#+\s*/, '')}
          </div>
        );
      }
      
      // ✅ قائمة نقطية (تبدأ بـ • أو - أو * أو رقم)
      if (/^[\s]*[•\-*]/.test(line) || /^\d+[\.\)]/.test(line)) {
        return (
          <div key={index} className="flex items-start gap-1.5 text-sm py-0.5">
            <span className="text-[#2a655f] dark:text-[#3a8a82]">•</span>
            <span>{line.replace(/^[\s]*[•\-*\d+\.\)]\s*/, '')}</span>
          </div>
        );
      }
      
      // ✅ سطر فارغ
      if (!line.trim()) {
        return <div key={index} className="h-1" />;
      }
      
      // ✅ نص عادي
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
      {/* ✅ الصورة الرمزية */}
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
      
      {/* ✅ الفقاعة */}
      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm transition-all",
        bubbleStyles
      )}>
        {/* ✅ المحتوى المنسق */}
        <div className="text-sm leading-relaxed break-words space-y-0.5">
          {formatText(message.content)}
        </div>
        
        {/* ✅ المنتجات إذا وجدت */}
        {message.products && message.products.length > 0 && (
          <div className="mt-2 pt-2 border-t border-white/10 dark:border-slate-700/50">
            <p className="text-[10px] font-bold opacity-60 mb-1">
              {isArabic ? '🛍️ المنتجات المقترحة:' : '🛍️ Suggested products:'}
            </p>
            <div className="flex flex-col gap-1">
              {message.products.slice(0, 3).map((product) => (
                <Link
                  key={product.id}
                  to={`/listing/${product.id}`}
                  className="flex items-center gap-2 text-xs p-1.5 rounded-lg hover:bg-white/10 dark:hover:bg-slate-700/30 transition-all group"
                >
                  {product.cover_url && (
                    <img 
                      src={product.cover_url} 
                      alt="" 
                      className="h-8 w-8 rounded object-cover"
                    />
                  )}
                  <span className="flex-1 truncate font-medium group-hover:underline">
                    {isArabic ? product.title_ar : (product.title_en || product.title_ar)}
                  </span>
                  {product.price && (
                    <span className="font-bold text-[#2a655f] dark:text-[#3a8a82]">
                      {product.price.toLocaleString()} SYP
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* ✅ الوقت */}
        <div className={cn(
          "text-[9px] mt-1.5 opacity-60 flex items-center gap-1",
          isUser ? "text-white/70" : "text-muted-foreground"
        )}>
          <Clock className="h-2.5 w-2.5" />
          {message.timestamp.toLocaleTimeString(
            isArabic ? "ar-SA" : "en-US",
            { hour: "2-digit", minute: "2-digit" }
          )}
          
          {/* ✅ أيقونة المساعد (للردود فقط) */}
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