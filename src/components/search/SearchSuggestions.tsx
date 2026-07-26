// src/components/search/SearchSuggestions.tsx

import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Store, Package, Tag, TrendingUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/i18n";
import { SearchResult } from "@/lib/hooks/useSearch";

interface SearchSuggestionsProps {
  suggestions: SearchResult[];
  isLoading: boolean;
  query: string;
  onSelect: (result: SearchResult) => void;
  className?: string;
}

export function SearchSuggestions({
  suggestions,
  isLoading,
  query,
  onSelect,
  className,
}: SearchSuggestionsProps) {
  const app = useApp();

  if (!query.trim() || query.length < 2) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'store': return <Store className="h-4 w-4 text-blue-500" />;
      case 'category': return <Tag className="h-4 w-4 text-emerald-500" />;
      case 'offer': return <TrendingUp className="h-4 w-4 text-red-500" />;
      default: return <Package className="h-4 w-4 text-purple-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'store': return app.lang === "ar" ? "متجر" : "Store";
      case 'category': return app.lang === "ar" ? "تصنيف" : "Category";
      case 'offer': return app.lang === "ar" ? "عرض" : "Offer";
      default: return app.lang === "ar" ? "منتج" : "Product";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'store': return "border-blue-500/20 bg-blue-500/10 text-blue-600";
      case 'category': return "border-emerald-500/20 bg-emerald-500/10 text-emerald-600";
      case 'offer': return "border-red-500/20 bg-red-500/10 text-red-600";
      default: return "border-purple-500/20 bg-purple-500/10 text-purple-600";
    }
  };

  return (
    <AnimatePresence>
      {(suggestions.length > 0 || isLoading) && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "absolute top-full left-0 right-0 mt-2",
            "bg-white dark:bg-[#242538]",
            "rounded-2xl shadow-2xl border border-[#e4e6eb] dark:border-[#3a3b4a]",
            "overflow-hidden z-50",
            className
          )}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-[#0084ff]" />
              <span className="text-sm text-muted-foreground">
                {app.lang === "ar" ? "جاري البحث..." : "Searching..."}
              </span>
            </div>
          ) : (
            <div className="py-2">
              {suggestions.map((result, index) => (
                <Link
                  key={`${result.type}-${result.id}`}
                  to={result.url}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors group"
                  onClick={() => onSelect(result)}
                >
                  {/* ✅ الصورة أو الأيقونة */}
                  <div className="h-10 w-10 rounded-xl bg-[#e4e6eb] dark:bg-[#3a3b4a] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform overflow-hidden">
                    {result.image ? (
                      <img
                        src={result.image}
                        alt={result.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      getIcon(result.type)
                    )}
                  </div>

                  {/* ✅ المعلومات */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{result.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full border",
                        getTypeColor(result.type)
                      )}>
                        {getTypeLabel(result.type)}
                      </span>
                      {result.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500">
                          {result.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* ✅ سهم */}
                  <Search className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}

              {/* ✅ زر "عرض الكل" */}
              {suggestions.length > 0 && (
                <Link
                  to="/search"
                  search={{ q: query }}
                  className="block px-4 py-3 text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-[#e4e6eb] dark:hover:bg-[#3a3b4a] transition-colors border-t border-[#e4e6eb] dark:border-[#3a3b4a]"
                >
                  {app.lang === "ar" 
                    ? `عرض جميع النتائج (${suggestions.length}) لـ "${query}"`
                    : `See all ${suggestions.length} results for "${query}"`}
                </Link>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}