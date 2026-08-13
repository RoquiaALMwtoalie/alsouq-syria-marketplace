// src/components/AIAssistant/MessageBubble.tsx

import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface MessageBubbleProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    products?: any[];
    timestamp: Date;
  };
  isUser: boolean;
  lang: string;
}

export function MessageBubble({ message, isUser, lang }: MessageBubbleProps) {
  const isArabic = lang === "ar";

  // ✅ تحويل النص إلى عناصر مع روابط قابلة للنقر
  const formatContent = (text: string) => {
    // البحث عن الروابط في النص
    const lines = text.split('\n');
    const result = [];
    
    for (const line of lines) {
      // البحث عن رابط
      const linkMatch = line.match(/🔗\s*(\/listing\/[a-f0-9-]+|\/category\/[a-f0-9-]+|\/store\/[a-f0-9-]+|\/profile\/[a-f0-9-]+|\/governorate\/[a-f0-9-]+|\/delivery\/[a-f0-9-]+)/);
      
      if (linkMatch) {
        const link = linkMatch[1];
        // استخراج النص قبل الرابط
        const textBefore = line.replace(/🔗\s*\/[a-zA-Z]+\/[a-f0-9-]+/, '').trim();
        
        // تحديد نوع الرابط لعرض اسم مناسب
        let linkText = 'رابط';
        if (link.startsWith('/listing/')) linkText = isArabic ? '🛍️ عرض المنتج' : '🛍️ View Product';
        else if (link.startsWith('/category/')) linkText = isArabic ? '📂 عرض التصنيف' : '📂 View Category';
        else if (link.startsWith('/store/')) linkText = isArabic ? '🏪 عرض المتجر' : '🏪 View Store';
        else if (link.startsWith('/profile/')) linkText = isArabic ? '👤 عرض الملف' : '👤 View Profile';
        else if (link.startsWith('/governorate/')) linkText = isArabic ? '📍 عرض المحافظة' : '📍 View Governorate';
        else if (link.startsWith('/delivery/')) linkText = isArabic ? '📦 عرض شركة التوصيل' : '📦 View Delivery';
        
        result.push(
          <div key={result.length} className="py-0.5">
            {textBefore && <span>{textBefore}</span>}
            <Link
              to={link}
              className="inline-block mt-0.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-lg border border-emerald-500/20 hover:border-emerald-500/40 transition-all font-medium text-sm"
            >
              {linkText}
            </Link>
          </div>
        );
      } else {
        // نص عادي
        result.push(
          <div key={result.length} className="py-0.5">
            {line}
          </div>
        );
      }
    }
    
    return result;
  };

  return (
    <div className={cn(
      "flex gap-3",
      isUser ? "flex-row-reverse" : "flex-row"
    )}>
      <div className={cn(
        "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
        isUser 
          ? "bg-[#2a655f]/10 text-[#2a655f]" 
          : "bg-gradient-to-br from-[#2a655f] to-[#3a8a82] text-white"
      )}>
        {isUser ? (
          <User className="h-4 w-4" />
        ) : (
          <Bot className="h-4 w-4" />
        )}
      </div>

      <div className={cn(
        "max-w-[85%] rounded-2xl px-4 py-2.5",
        isUser 
          ? "bg-[#2a655f] text-white rounded-tr-none" 
          : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none"
      )}>
        <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
          {formatContent(message.content)}
        </div>

        <div className={cn(
          "text-[9px] mt-1.5 opacity-60",
          isUser ? "text-white/70" : "text-muted-foreground"
        )}>
          {message.timestamp.toLocaleTimeString(
            isArabic ? "ar-SA" : "en-US",
            { hour: "2-digit", minute: "2-digit" }
          )}
        </div>
      </div>
    </div>
  );
}