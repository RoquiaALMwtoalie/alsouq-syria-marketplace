// src/components/chat/MessageSearch.tsx

import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronUp, ChevronDown, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";

interface MessageSearchProps {
  messages: any[];
  onSearchResult: (messageId: string) => void;
  onClose: () => void;
  className?: string;
}

export function MessageSearch({
  messages,
  onSearchResult,
  onClose,
  className,
}: MessageSearchProps) {
  const app = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // ====== البحث ======
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setCurrentIndex(0);
      return;
    }

    const filtered = messages.filter((msg) => {
      const content = msg.content || "";
      return content.toLowerCase().includes(query.toLowerCase());
    });
    
    setResults(filtered);
    setCurrentIndex(0);
  }, [query, messages]);

  // ====== التركيز على الحقل ======
  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  // ====== التالي ======
  const goToNext = () => {
    if (results.length === 0) return;
    const next = (currentIndex + 1) % results.length;
    setCurrentIndex(next);
    if (onSearchResult && results[next]) {
      onSearchResult(results[next].id);
    }
  };

  // ====== السابق ======
  const goToPrev = () => {
    if (results.length === 0) return;
    const prev = (currentIndex - 1 + results.length) % results.length;
    setCurrentIndex(prev);
    if (onSearchResult && results[prev]) {
      onSearchResult(results[prev].id);
    }
  };

  // ====== الضغط على نتيجة ======
  const handleResultClick = (index: number) => {
    setCurrentIndex(index);
    if (onSearchResult && results[index]) {
      onSearchResult(results[index].id);
    }
  };

  return (
    <div
      className={cn(
        "bg-white dark:bg-slate-900 border-b border-slate-200/60 dark:border-slate-700/60",
        "p-3 shadow-lg",
        className
      )}
    >
      <div className="flex items-center gap-2">
        {/* حقل البحث */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              app.lang === "ar"
                ? "🔍 بحث في الرسائل..."
                : "🔍 Search messages..."
            }
            className="pl-9 pr-4 rounded-xl"
          />
        </div>

        {/* نتائج البحث */}
        {results.length > 0 && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {currentIndex + 1}/{results.length}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={goToPrev}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={goToNext}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* زر الإغلاق */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* قائمة النتائج */}
      {query && results.length === 0 && (
        <div className="mt-2 text-center text-sm text-muted-foreground py-2">
          {app.lang === "ar" ? "لا توجد نتائج" : "No results found"}
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-2 max-h-32 overflow-y-auto space-y-1">
          {results.slice(0, 10).map((msg, index) => (
            <div
              key={msg.id}
              onClick={() => handleResultClick(index)}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-colors",
                currentIndex === index
                  ? "bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800"
                  : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
              )}
            >
              <MessageCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              <p className="text-sm truncate flex-1">
                {msg.content}
              </p>
              <span className="text-[10px] text-muted-foreground shrink-0">
                {new Date(msg.created_at).toLocaleTimeString(
                  app.lang === "ar" ? "ar-SA" : "en-US",
                  { hour: "2-digit", minute: "2-digit" }
                )}
              </span>
            </div>
          ))}
          {results.length > 10 && (
            <div className="text-xs text-center text-muted-foreground py-1">
              + {results.length - 10} {app.lang === "ar" ? "نتيجة إضافية" : "more results"}
            </div>
          )}
        </div>
      )}
    </div>
  );
}