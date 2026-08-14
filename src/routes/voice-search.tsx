// src/routes/voice-search.tsx
// 🎤 صفحة نتائج البحث الصوتي المتقدمة

import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useApp, useT } from "@/lib/i18n";
import { processVoiceSearch } from "@/lib/voiceSearchEngine";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft, Sparkles, Mic, X, Filter, Star, MapPin, Store, Package, ShoppingBag, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/voice-search")({
  component: VoiceSearchPage,
  head: () => ({
    meta: [
      { title: "البحث الصوتي المتقدم — السوق عندك" },
      { name: "description", content: "ابحث بصوتك عن المنتجات والمتاجر والتصنيفات في السوق عندك" },
    ],
  }),
});

function VoiceSearchPage() {
  const app = useApp();
  const t = useT();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [entities, setEntities] = useState<any>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [intent, setIntent] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number>(0);
  
  // ✅ استعادة البحث من URL
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, []);
  
  // ✅ تنفيذ البحث
  const performSearch = async (text: string) => {
    if (!text.trim()) return;
    
    setIsLoading(true);
    setResults([]);
    setTotalCount(0);
    setSuggestions([]);
    setEntities(null);
    
    try {
      const response = await processVoiceSearch(text, app.lang === 'ar' ? 'ar' : 'en');
      
      setResults(response.results);
      setEntities(response.entities);
      setTotalCount(response.totalCount);
      setSuggestions(response.suggestions || []);
      setIntent(response.intent);
      setExecutionTime(response.executionTime);
      
      // تحديث URL
      const url = new URL(window.location.href);
      url.searchParams.set('q', text);
      window.history.pushState({}, '', url.toString());
      
    } catch (error) {
      console.error('❌ Error searching:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ✅ تنفيذ البحث عند الضغط Enter
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      performSearch(query);
    }
  };
  
  const isArabic = app.lang === 'ar';
  
  // ✅ الحصول على أيقونة المصدر
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'listing': return <Package className="h-3.5 w-3.5" />;
      case 'store': return <Store className="h-3.5 w-3.5" />;
      case 'category': return <Tag className="h-3.5 w-3.5" />;
      default: return <Search className="h-3.5 w-3.5" />;
    }
  };
  
  // ✅ الحصول على لون المصدر
  const getSourceColor = (source: string) => {
    switch (source) {
      case 'listing': return 'bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-800';
      case 'store': return 'bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-800';
      case 'category': return 'bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-800';
      default: return 'bg-slate-500/10 text-slate-600';
    }
  };
  
  // ✅ الحصول على تسمية المصدر
  const getSourceLabel = (source: string) => {
    if (isArabic) {
      switch (source) {
        case 'listing': return 'منتج';
        case 'store': return 'متجر';
        case 'category': return 'تصنيف';
        default: return '';
      }
    } else {
      switch (source) {
        case 'listing': return 'Product';
        case 'store': return 'Store';
        case 'category': return 'Category';
        default: return '';
      }
    }
  };
  
  // ✅ الحصول على لون درجة المطابقة
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-amber-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };
  
  // ✅ الحصول على نصوص درجة المطابقة
  const getScoreLabel = (score: number) => {
    if (score >= 80) return isArabic ? 'مطابقة عالية' : 'High match';
    if (score >= 60) return isArabic ? 'مطابقة متوسطة' : 'Medium match';
    if (score >= 40) return isArabic ? 'مطابقة منخفضة' : 'Low match';
    return isArabic ? 'ضعيف' : 'Weak';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="mx-auto max-w-7xl px-4 py-6 md:py-8">
        
        {/* ===== HEADER ===== */}
        <div className="flex items-center gap-3 md:gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl h-10 w-10 shrink-0 hover:bg-[#2a655f]/10"
            onClick={() => navigate({ to: "/" })}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Search className="absolute inset-y-0 my-auto start-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={isArabic ? "🔍 ابحث بصوتك أو بكتابتك..." : "🔍 Search by voice or text..."}
              className="ps-10 pe-24 h-11 md:h-12 rounded-2xl border-2 border-[#2a655f]/20 focus:border-[#2a655f] bg-white dark:bg-slate-900 text-sm md:text-base transition-all"
              autoFocus
            />
            <Button
              size="sm"
              className="absolute inset-y-1 end-1 h-9 md:h-10 rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] text-white hover:shadow-lg transition-all px-3 md:px-4"
              onClick={() => performSearch(query)}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="hidden sm:inline ms-1.5">{isArabic ? "بحث" : "Search"}</span>
                </>
              )}
            </Button>
          </div>
          
          {/* زر الميكروفون السريع */}
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-10 w-10 shrink-0 border-[#2a655f]/30 hover:bg-[#2a655f]/10 hover:border-[#2a655f] transition-all"
            onClick={() => {
              // يمكن تشغيل الميكروفون هنا
              toast.info(isArabic ? "🎤 اضغط على زر الميكروفون في شريط البحث" : "🎤 Click the microphone button in the search bar");
            }}
          >
            <Mic className="h-5 w-5 text-[#2a655f]" />
          </Button>
        </div>
        
        {/* ===== RESULTS SUMMARY ===== */}
        {!isLoading && results.length > 0 && (
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4 text-[#2a655f]" />
              <span>
                {isArabic 
                  ? `🔍 ${totalCount} نتيجة لـ "${query}"` 
                  : `🔍 ${totalCount} results for "${query}"`}
              </span>
              {intent && (
                <Badge className="bg-[#2a655f]/10 text-[#2a655f] border-0 text-[10px]">
                  {isArabic ? `نية: ${intent}` : `Intent: ${intent}`}
                </Badge>
              )}
              <Badge className="bg-slate-100 dark:bg-slate-800 text-muted-foreground border-0 text-[10px]">
                ⚡ {executionTime}ms
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              onClick={() => {
                setQuery("");
                setResults([]);
                setTotalCount(0);
                setEntities(null);
                setSuggestions([]);
                setIntent("");
                window.history.pushState({}, '', '/voice-search');
              }}
            >
              <X className="h-3.5 w-3.5 mr-1" />
              {isArabic ? "مسح الكل" : "Clear all"}
            </Button>
          </div>
        )}
        
        {/* ===== ENTITIES (فلترات مستخرجة) ===== */}
        {entities && Object.keys(entities).length > 0 && (
          <div className="mb-6 p-4 bg-[#2a655f]/5 rounded-2xl border border-[#2a655f]/20 animate-fade-in">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2.5">
              <Filter className="h-4 w-4" />
              <span className="font-medium">{isArabic ? "🔍 فلترات ذكية مستخرجة:" : "🔍 Smart filters extracted:"}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {entities.productType && entities.productType.map((p: string) => (
                <Badge key={p} className="bg-[#2a655f] text-white hover:bg-[#3a8a82] transition-colors cursor-default">
                  📦 {p}
                </Badge>
              ))}
              {entities.brand && entities.brand.map((b: string) => (
                <Badge key={b} className="bg-blue-500 text-white hover:bg-blue-600 transition-colors cursor-default">
                  🏷️ {b}
                </Badge>
              ))}
              {entities.priceMin !== undefined && entities.priceMax !== undefined && (
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-default">
                  💰 {entities.priceMin} - {entities.priceMax} ريال
                </Badge>
              )}
              {entities.priceMin !== undefined && entities.priceMax === undefined && (
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-default">
                  💰 من {entities.priceMin} ريال
                </Badge>
              )}
              {entities.priceMax !== undefined && entities.priceMin === undefined && (
                <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 transition-colors cursor-default">
                  💰 إلى {entities.priceMax} ريال
                </Badge>
              )}
              {entities.location && (
                <Badge className="bg-purple-500 text-white hover:bg-purple-600 transition-colors cursor-default">
                  📍 {entities.location}
                </Badge>
              )}
              {entities.color && entities.color.map((c: string) => (
                <Badge key={c} className="bg-pink-500 text-white hover:bg-pink-600 transition-colors cursor-default">
                  🎨 {c}
                </Badge>
              ))}
              {entities.isOffer && (
                <Badge className="bg-red-500 text-white animate-pulse hover:bg-red-600 transition-colors cursor-default">
                  🔥 عرض خاص
                </Badge>
              )}
              {entities.storeName && entities.storeName.map((s: string) => (
                <Badge key={s} className="bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-default">
                  🏪 {s}
                </Badge>
              ))}
            </div>
          </div>
        )}
        
        {/* ===== SUGGESTIONS ===== */}
        {suggestions.length > 0 && !isLoading && results.length === 0 && (
          <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800/30">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  {isArabic ? "💡 اقتراحات للمساعدة:" : "💡 Suggestions:"}
                </p>
                <ul className="mt-1 space-y-1">
                  {suggestions.map((s, index) => (
                    <li key={index} className="text-sm text-amber-700 dark:text-amber-400">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        
        {/* ===== RESULTS ===== */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, index) => (
              <ResultCard 
                key={result.id} 
                result={result} 
                index={index}
                getSourceIcon={getSourceIcon}
                getSourceColor={getSourceColor}
                getSourceLabel={getSourceLabel}
                getScoreColor={getScoreColor}
                getScoreLabel={getScoreLabel}
                isArabic={isArabic}
                navigate={navigate}
              />
            ))}
          </div>
        ) : query && (
          <div className="text-center py-20 bg-card rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold">
              {isArabic ? "لا توجد نتائج" : "No results found"}
            </h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              {isArabic 
                ? `لم نعثر على نتائج لـ "${query}"` 
                : `No results for "${query}"`}
            </p>
            {suggestions.length > 0 && (
              <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 rounded-2xl border border-amber-200 dark:border-amber-800/30 max-w-md mx-auto">
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  {suggestions[0]}
                </p>
              </div>
            )}
            <Button 
              variant="outline" 
              className="mt-4 rounded-xl"
              onClick={() => {
                setQuery("");
                setResults([]);
                setTotalCount(0);
                setEntities(null);
                window.history.pushState({}, '', '/voice-search');
              }}
            >
              <X className="h-4 w-4 mr-2" />
              {isArabic ? "مسح البحث" : "Clear search"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// 📦 Result Card Component
// ============================================================

interface ResultCardProps {
  result: any;
  index: number;
  getSourceIcon: (source: string) => JSX.Element;
  getSourceColor: (source: string) => string;
  getSourceLabel: (source: string) => string;
  getScoreColor: (score: number) => string;
  getScoreLabel: (score: number) => string;
  isArabic: boolean;
  navigate: any;
}

function ResultCard({
  result,
  index,
  getSourceIcon,
  getSourceColor,
  getSourceLabel,
  getScoreColor,
  getScoreLabel,
  isArabic,
  navigate,
}: ResultCardProps) {
  
  const handleClick = () => {
    if (result.source === 'listing') {
      navigate({ to: "/listing/$id", params: { id: result.id } });
    } else if (result.source === 'store') {
      navigate({ to: "/store/$id", params: { id: result.id } });
    } else if (result.source === 'category') {
      navigate({ to: "/category/$slug", params: { slug: result.id } });
    }
  };
  
  return (
    <div 
      className="group rounded-2xl bg-card overflow-hidden border border-slate-200 dark:border-slate-800 hover:border-[#2a655f]/60 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer animate-fade-up"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={handleClick}
    >
      {/* Image */}
      <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
        {result.image_url ? (
          <img 
            src={result.image_url} 
            alt={result.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-6xl bg-gradient-to-br from-[#2a655f]/10 to-[#3a8a82]/10">
            {result.source === 'listing' ? '📦' : result.source === 'store' ? '🏪' : '📂'}
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <Badge className={`${getSourceColor(result.source)} border text-[10px] font-bold`}>
            {getSourceIcon(result.source)}
            <span className="ms-1">{getSourceLabel(result.source)}</span>
          </Badge>
        </div>
        
        {/* Score Badge */}
        <div className="absolute top-2 right-2">
          <div className="flex flex-col items-end gap-1">
            <Badge className={`${getScoreColor(result.score)} text-white border-0 text-[10px] font-bold`}>
              {result.score}%
            </Badge>
            <Badge className="bg-black/70 text-white border-0 text-[9px]">
              {getScoreLabel(result.score)}
            </Badge>
          </div>
        </div>
        
        {result.price && (
          <Badge className="absolute bottom-2 right-2 bg-[#2a655f] text-white border-0 text-sm font-bold px-3 py-1 rounded-xl shadow-lg">
            {result.price} SYP
          </Badge>
        )}
        
        {result.matchType && (
          <Badge className="absolute bottom-2 left-2 bg-black/60 text-white border-0 text-[9px] backdrop-blur-sm">
            {result.matchType === 'exact' ? '🎯 مطابق' : 
             result.matchType === 'partial' ? '🔍 مشابه' : 
             result.matchType === 'synonym' ? '📚 مرادف' : '🔀 قريب'}
          </Badge>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-sm line-clamp-1 group-hover:text-[#2a655f] transition-colors">
          {result.title}
        </h3>
        
        {result.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
            {result.description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          {result.category && (
            <span className="px-2 py-0.5 rounded-full bg-[#2a655f]/10 text-[#2a655f] text-[10px] font-medium">
              📂 {result.category}
            </span>
          )}
          {result.store && (
            <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-medium">
              🏪 {result.store}
            </span>
          )}
          {result.location && (
            <span className="px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 text-[10px] font-medium">
              📍 {result.location}
            </span>
          )}
        </div>
        
        {/* Score Bar */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className={`h-full ${getScoreColor(result.score)} transition-all duration-1000 rounded-full`}
              style={{ width: `${result.score}%` }}
            />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground">
            {result.score}%
          </span>
        </div>
        
        {/* Source type indicator */}
        <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            {getSourceIcon(result.source)}
            {isArabic ? 'المصدر:' : 'Source:'} {getSourceLabel(result.source)}
          </span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">
            {isArabic ? 'اضغط للتفاصيل →' : 'Click for details →'}
          </span>
        </div>
      </div>
    </div>
  );
}

export default VoiceSearchPage;