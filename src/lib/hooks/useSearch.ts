// src/lib/hooks/useSearch.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useApp } from "@/lib/i18n";

// ============================================================
// ✅ الأنواع
// ============================================================
export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  image?: string;
  type: 'product' | 'store' | 'category' | 'offer' | 'user';
  url: string;
  badge?: string;
  rating?: number;
  price?: number;
  store_name?: string;
  slug?: string;
  created_at?: string;
  governorate_id?: string;
  // ✅ حقول ListingCard
  title_ar?: string;
  title_en?: string;
  description_ar?: string;
  description_en?: string;
  old_price?: number;
  discount_percent?: number;
  is_offer?: boolean;
  cover_url?: string;
  governorates?: any;
  categories?: any;
  profiles?: any;
  listing_images?: any[];
  product_variations?: any[];
  product_colors?: any[];
  owner_id?: string;
  views?: number;
  favorites_count?: number;
  status?: string;
  is_available?: boolean;
  metadata?: any;
  category_id?: string;
  delivery_fee?: number;
  delivery_method?: string;
  is_featured?: boolean;
  featured_sort?: number;
  // ✅ للمتاجر
  store_logo_url?: string;
  store_cover_url?: string;
  store_description?: string;
  listing_count?: number;
  is_verified?: boolean;
  // ✅ للأقسام
  parent_id?: string | null;
  icon?: string;
  image_url?: string;
  is_main_category?: boolean;
}

export type SearchResultType = 'all' | 'products' | 'stores' | 'categories';

interface SearchFilters {
  category?: string;
  governorate?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'popularity' | 'newest' | 'price_low' | 'price_high' | 'discount' | 'rating';
}

// ============================================================
// ✅ حساب الصلة (relevance score)
// ============================================================
function calculateRelevance(text: string, query: string): number {
  if (!text || !query) return 0;
  
  const normalizedText = text.toLowerCase().trim();
  const normalizedQuery = query.toLowerCase().trim();
  
  // ✅ مطابقة كاملة
  if (normalizedText === normalizedQuery) return 100;
  
  // ✅ يبدأ بـ query
  if (normalizedText.startsWith(normalizedQuery)) return 80;
  
  // ✅ يحتوي على query ككلمة كاملة
  const words = normalizedText.split(/\s+/);
  if (words.includes(normalizedQuery)) return 70;
  
  // ✅ يحتوي على query كجزء
  if (normalizedText.includes(normalizedQuery)) return 50;
  
  // ✅ كل كلمات query موجودة
  const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 1);
  if (queryWords.length > 1) {
    const matchedWords = queryWords.filter(qw => normalizedText.includes(qw));
    return (matchedWords.length / queryWords.length) * 40;
  }
  
  return 0;
}

// ============================================================
// ✅ Hook الرئيسي
// ============================================================
export function useSearch() {
  const app = useApp();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'popularity',
  });
  const [totalResults, setTotalResults] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [storesCount, setStoresCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [activeType, setActiveType] = useState<SearchResultType>('all');
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  
  const abortControllerRef = useRef<AbortController | null>(null);
  const suggestionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ ✅ ✅ Refs لتجنب إعادة التنفيذ اللانهائية
  const lastSearchedRef = useRef<string>("");
  const lastSuggestRef = useRef<string>("");
  const isMountedRef = useRef<boolean>(true);

  const debouncedQuery = useDebounce(query, 400);
  const debouncedSuggestQuery = useDebounce(query, 150);

  // ✅ ✅ ✅ Track mount/unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ============================================================
  // ✅ البحث الرئيسي
  // ============================================================
  const performSearch = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    const searchTerm = debouncedQuery.trim();
    
    if (!searchTerm && !filters.category && !filters.governorate) {
      setResults([]);
      setTotalResults(0);
      setProductsCount(0);
      setStoresCount(0);
      setCategoriesCount(0);
      setHasMore(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    setIsLoading(true);

    try {
      const limit = 20;
      const offset = (pageNum - 1) * limit;

      // ============================================================
      // ✅ 1. المنتجات (listings)
      // ============================================================
      let productsQuery = supabase
        .from("listings")
        .select(`
          id,
          title_ar,
          title_en,
          description_ar,
          description_en,
          price,
          price_usd,
          old_price,
          old_price_usd,
          discount_percent,
          is_offer,
          cover_url,
          rating,
          views,
          favorites_count,
          is_available,
          status,
          created_at,
          updated_at,
          governorate_id,
          category_id,
          owner_id,
          delivery_fee,
          delivery_method,
          is_featured,
          featured_sort,
          metadata,
          governorates:governorate_id (
            id,
            name_ar,
            name_en
          ),
          categories:category_id (
            id,
            name_ar,
            name_en,
            slug
          ),
          profiles:owner_id (
            id,
            full_name,
            store_name,
            store_logo_url,
            avatar_url,
            store_cover_url
          ),
          listing_images (
            id,
            url,
            sort_order
          ),
          product_colors (
            id,
            color_name_ar,
            color_name_en,
            color_hex,
            image_url
          ),
          product_variations (
            id,
            combination,
            price,
            stock_quantity,
            image_url,
            is_active
          )
        `, { count: 'exact' })
        .eq("status", "published")
        .eq("is_available", true);

      // ✅ بحث ذكي بالكلمات
      if (searchTerm) {
        const searchWords = searchTerm.trim().split(' ').filter(w => w.length > 1);
        
        if (searchWords.length > 1) {
          const conditions = searchWords.map(term => 
            `title_ar.ilike.%${term}%,title_en.ilike.%${term}%,description_ar.ilike.%${term}%,description_en.ilike.%${term}%`
          ).join(',');
          productsQuery = productsQuery.or(conditions);
        } else {
          productsQuery = productsQuery.or(
            `title_ar.ilike.%${searchTerm}%,` +
            `title_en.ilike.%${searchTerm}%,` +
            `description_ar.ilike.%${searchTerm}%,` +
            `description_en.ilike.%${searchTerm}%`
          );
        }
      }

      // ✅ الفلاتر
      if (filters.category) productsQuery = productsQuery.eq("category_id", filters.category);
      if (filters.governorate) productsQuery = productsQuery.eq("governorate_id", filters.governorate);
      if (filters.minPrice) productsQuery = productsQuery.gte("price", filters.minPrice);
      if (filters.maxPrice) productsQuery = productsQuery.lte("price", filters.maxPrice);
      if (filters.rating) productsQuery = productsQuery.gte("rating", filters.rating);

      // ✅ الترتيب
      switch (filters.sortBy) {
        case 'newest':
          productsQuery = productsQuery.order("created_at", { ascending: false });
          break;
        case 'price_low':
          productsQuery = productsQuery.order("price", { ascending: true });
          break;
        case 'price_high':
          productsQuery = productsQuery.order("price", { ascending: false });
          break;
        case 'discount':
          productsQuery = productsQuery
            .not("discount_percent", "is", null)
            .order("discount_percent", { ascending: false });
          break;
        case 'rating':
          productsQuery = productsQuery.order("rating", { ascending: false });
          break;
        case 'popularity':
        default:
          productsQuery = productsQuery.order("views", { ascending: false });
          break;
      }

      const { data: products, count: productsTotal, error: productsError } = await productsQuery
        .range(offset, offset + limit - 1);

      if (productsError) throw productsError;

      // ============================================================
      // ✅ 2. المتاجر (profiles) — مع عدد المنتجات (استعلام منفصل)
      // ============================================================
      let stores: any[] = [];
      let storesTotal = 0;

      if (searchTerm || filters.governorate) {
        let storesQuery = supabase
          .from("profiles")
          .select(`
            id,
            full_name,
            store_name,
            store_logo_url,
            avatar_url,
            store_cover_url,
            store_description,
            governorate_id,
            store_active,
            created_at
          `, { count: 'exact' })
          .not("store_name", "is", null)
          .eq("store_active", true);

        if (searchTerm) {
          const storeWords = searchTerm.trim().split(' ').filter(w => w.length > 1);
          
          if (storeWords.length > 1) {
            const storeConditions = storeWords.map(term => 
              `store_name.ilike.%${term}%,full_name.ilike.%${term}%,store_description.ilike.%${term}%`
            ).join(',');
            storesQuery = storesQuery.or(storeConditions);
          } else {
            storesQuery = storesQuery.or(
              `store_name.ilike.%${searchTerm}%,` +
              `full_name.ilike.%${searchTerm}%,` +
              `store_description.ilike.%${searchTerm}%`
            );
          }
        }

        if (filters.governorate) {
          storesQuery = storesQuery.eq("governorate_id", filters.governorate);
        }

        const { data: storesData, count, error: storesError } = await storesQuery.limit(10);
        
        if (storesError) {
          console.error("❌ Stores search error:", storesError);
        } else {
          stores = storesData || [];
          storesTotal = count || 0;

          // ✅ ✅ ✅ جلب عدد المنتجات لكل متجر (استعلام منفصل مضمون)
          if (stores.length > 0) {
            const storeIds = stores.map((s: any) => s.id);

            const { data: countsData, error: countsError } = await supabase
              .from("listings")
              .select("owner_id")
              .in("owner_id", storeIds)
              .eq("status", "published")
              .eq("is_available", true);

            if (countsError) {
              console.error("❌ Listing counts error:", countsError);
            } else {
              // ✅ حساب العدد لكل متجر
              const countsMap: Record<string, number> = {};
              (countsData || []).forEach((row: any) => {
                countsMap[row.owner_id] = (countsMap[row.owner_id] || 0) + 1;
              });

              // ✅ إضافة العدد لكل متجر
              stores = stores.map((s: any) => ({
                ...s,
                listing_count: countsMap[s.id] || 0,
              }));
            }
          }
        }
      }

      // ============================================================
      // ✅ 3. الأقسام (categories) - مع parent_id
      // ============================================================
      let categories: any[] = [];
      let categoriesTotal = 0;

      if (!filters.category && searchTerm) {
        let categoryQuery = supabase
          .from("categories")
          .select(`
            id,
            name_ar,
            name_en,
            slug,
            icon,
            image_url,
            parent_id,
            created_at
          `, { count: 'exact' });

        const catWords = searchTerm.trim().split(' ').filter(w => w.length > 1);
        
        if (catWords.length > 1) {
          const catConditions = catWords.map(term => 
            `name_ar.ilike.%${term}%,name_en.ilike.%${term}%`
          ).join(',');
          categoryQuery = categoryQuery.or(catConditions);
        } else {
          categoryQuery = categoryQuery.or(
            `name_ar.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%`
          );
        }

        const { data: categoriesData, count, error: categoriesError } = await categoryQuery.limit(10);
        
        if (categoriesError) {
          console.error("❌ Categories search error:", categoriesError);
        } else {
          categories = categoriesData || [];
          categoriesTotal = count || 0;
        }
      }

      // ✅ ✅ ✅ إذا تم unmount، لا تحدّث الحالة
      if (!isMountedRef.current) return;

      // ============================================================
      // ✅ 4. حساب الصلة وترتيب النتائج
      // ============================================================
      const productsFormatted: SearchResult[] = (products || []).map((p: any) => {
        const title = app.lang === "ar" ? p.title_ar : (p.title_en || p.title_ar);
        const relevance = calculateRelevance(title || "", searchTerm);
        
        return {
          id: p.id,
          title: title || "",
          title_ar: p.title_ar,
          title_en: p.title_en,
          description: app.lang === "ar" ? p.description_ar : (p.description_en || p.description_ar),
          description_ar: p.description_ar,
          description_en: p.description_en,
          image: p.cover_url,
          cover_url: p.cover_url,
          type: p.is_offer ? 'offer' : 'product' as const,
          url: `/listing/${p.id}`,
          badge: p.is_offer ? (app.lang === "ar" ? "🔥 عرض" : "🔥 Offer") : 
                 p.discount_percent ? `🏷️ -${p.discount_percent}%` : undefined,
          price: p.price,
          old_price: p.old_price,
          discount_percent: p.discount_percent,
          is_offer: p.is_offer,
          store_name: p.profiles?.store_name || p.profiles?.full_name,
          rating: p.rating,
          created_at: p.created_at,
          governorate_id: p.governorate_id,
          governorates: p.governorates,
          categories: p.categories,
          profiles: p.profiles,
          listing_images: p.listing_images,
          product_variations: p.product_variations,
          product_colors: p.product_colors,
          owner_id: p.owner_id,
          views: p.views,
          favorites_count: p.favorites_count,
          status: p.status,
          is_available: p.is_available,
          metadata: p.metadata,
          category_id: p.category_id,
          delivery_fee: p.delivery_fee,
          delivery_method: p.delivery_method,
          is_featured: p.is_featured,
          featured_sort: p.featured_sort,
          // ✅ حفظ الصلة للترتيب
          _relevance: relevance,
        } as any;
      });

      const storesFormatted: SearchResult[] = stores.map((s: any) => {
        const title = s.store_name || s.full_name || "متجر";
        const relevance = calculateRelevance(title, searchTerm);

        // ✅ ✅ ✅ عدد المنتجات جاهز من الاستعلام المنفصل
        const listingCount = s.listing_count ?? 0;
        
        return {
          id: s.id,
          title,
          description: s.store_description || (app.lang === "ar" ? "متجر على ذوق" : "Store on Zooq"),
          image: s.store_logo_url || s.avatar_url,
          cover_url: s.store_cover_url || s.store_logo_url || s.avatar_url,
          type: 'store' as const,
          url: `/store/${s.id}`,
          badge: "🏪 متجر",
          store_name: s.store_name,
          rating: undefined,
          created_at: s.created_at,
          governorate_id: s.governorate_id,
          profiles: s,
          governorates: null,
          categories: null,
          listing_images: [],
          product_variations: [],
          product_colors: [],
          owner_id: s.id,
          views: 0,
          favorites_count: 0,
          status: "published",
          is_available: true,
          metadata: null,
          category_id: null,
          delivery_fee: 0,
          delivery_method: null,
          is_featured: false,
          featured_sort: 0,
          // ✅ حقول المتجر
          store_logo_url: s.store_logo_url,
          store_cover_url: s.store_cover_url,
          store_description: s.store_description,
          is_verified: s.store_active === true,
          // ✅ ✅ ✅ عدد المنتجات
          listing_count: listingCount,
          // ✅ حفظ الصلة
          _relevance: relevance,
        } as any;
      });

      const categoriesFormatted: SearchResult[] = categories.map((c: any) => {
        const title = app.lang === "ar" ? c.name_ar : (c.name_en || c.name_ar);
        const relevance = calculateRelevance(title, searchTerm);
        
        return {
          id: c.id,
          title: title || "",
          description: app.lang === "ar" ? "تصفح المنتجات في هذا القسم" : "Browse products in this category",
          image: c.image_url || c.icon || "/category-placeholder.png",
          cover_url: c.image_url || c.icon || "/category-placeholder.png",
          type: 'category' as const,
          url: `/category/${c.slug}`,
          badge: c.parent_id ? (app.lang === "ar" ? "📂 قسم فرعي" : "📂 Subcategory") : (app.lang === "ar" ? "📂 قسم رئيسي" : "📂 Main Category"),
          slug: c.slug,
          created_at: c.created_at,
          store_name: null,
          rating: undefined,
          governorate_id: null,
          profiles: null,
          governorates: null,
          categories: c,
          listing_images: [],
          product_variations: [],
          product_colors: [],
          owner_id: null,
          views: 0,
          favorites_count: 0,
          status: "published",
          is_available: true,
          metadata: null,
          category_id: c.id,
          delivery_fee: 0,
          delivery_method: null,
          is_featured: false,
          featured_sort: 0,
          // ✅ حقول القسم
          parent_id: c.parent_id,
          icon: c.icon,
          image_url: c.image_url,
          is_main_category: !c.parent_id,
          // ✅ حفظ الصلة
          _relevance: relevance,
        } as any;
      });

      // ✅ ترتيب حسب الصلة
      productsFormatted.sort((a: any, b: any) => (b._relevance || 0) - (a._relevance || 0));
      storesFormatted.sort((a: any, b: any) => (b._relevance || 0) - (a._relevance || 0));
      categoriesFormatted.sort((a: any, b: any) => (b._relevance || 0) - (a._relevance || 0));

      // ✅ دمج الكل
      const formattedResults: SearchResult[] = [
        ...productsFormatted,
        ...storesFormatted,
        ...categoriesFormatted,
      ];

      if (append) {
        setResults(prev => [...prev, ...formattedResults]);
      } else {
        setResults(formattedResults);
      }

      // ✅ الإحصائيات الصحيحة
      setProductsCount(productsTotal || 0);
      setStoresCount(storesTotal || 0);
      setCategoriesCount(categoriesTotal || 0);
      setTotalResults((productsTotal || 0) + (storesTotal || 0) + (categoriesTotal || 0));
      setHasMore((products?.length || 0) === limit);
      setPage(pageNum);

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Search error:", error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [debouncedQuery, filters.category, filters.governorate, filters.minPrice, filters.maxPrice, filters.rating, filters.sortBy, app.lang]);

  // ============================================================
  // ✅ الاقتراحات الفورية
  // ============================================================
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      if (isMountedRef.current) {
        setSuggestions([]);
      }
      return;
    }

    setIsSuggesting(true);

    try {
      // ✅ المنتجات
      let productQuery = supabase
        .from("listings")
        .select(`id, title_ar, title_en, cover_url`)
        .eq("status", "published")
        .eq("is_available", true);

      const prodWords = searchQuery.trim().split(' ').filter(w => w.length > 1);
      
      if (prodWords.length > 1) {
        const prodConditions = prodWords.map(term => 
          `title_ar.ilike.%${term}%,title_en.ilike.%${term}%`
        ).join(',');
        productQuery = productQuery.or(prodConditions);
      } else {
        productQuery = productQuery.or(
          `title_ar.ilike.%${searchQuery}%,title_en.ilike.%${searchQuery}%`
        );
      }

      if (filters.governorate) productQuery = productQuery.eq("governorate_id", filters.governorate);

      const { data: productSuggestions } = await productQuery.limit(5);

      // ✅ المتاجر
      let storeQuery = supabase
        .from("profiles")
        .select(`id, store_name, full_name, store_logo_url, avatar_url`)
        .not("store_name", "is", null)
        .eq("store_active", true);

      const storeWords = searchQuery.trim().split(' ').filter(w => w.length > 1);
      
      if (storeWords.length > 1) {
        const storeConditions = storeWords.map(term => 
          `store_name.ilike.%${term}%,full_name.ilike.%${term}%`
        ).join(',');
        storeQuery = storeQuery.or(storeConditions);
      } else {
        storeQuery = storeQuery.or(
          `store_name.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`
        );
      }

      if (filters.governorate) storeQuery = storeQuery.eq("governorate_id", filters.governorate);

      const { data: storeSuggestions } = await storeQuery.limit(3);

      // ✅ الأقسام
      let categoryQuery = supabase
        .from("categories")
        .select(`id, name_ar, name_en, slug, parent_id`);

      const catWords = searchQuery.trim().split(' ').filter(w => w.length > 1);
      
      if (catWords.length > 1) {
        const catConditions = catWords.map(term => 
          `name_ar.ilike.%${term}%,name_en.ilike.%${term}%`
        ).join(',');
        categoryQuery = categoryQuery.or(catConditions);
      } else {
        categoryQuery = categoryQuery.or(
          `name_ar.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`
        );
      }

      const { data: categorySuggestions } = await categoryQuery.limit(3);

      // ✅ ✅ ✅ إذا تم unmount، لا تحدّث الحالة
      if (!isMountedRef.current) return;

      const allSuggestions: SearchResult[] = [
        ...(productSuggestions || []).map((p: any) => ({
          id: p.id,
          title: app.lang === "ar" ? p.title_ar : (p.title_en || p.title_ar),
          type: 'product' as const,
          url: `/listing/${p.id}`,
          image: p.cover_url,
        })),
        ...(storeSuggestions || []).map((s: any) => ({
          id: s.id,
          title: s.store_name || s.full_name || "متجر",
          type: 'store' as const,
          url: `/store/${s.id}`,
          image: s.store_logo_url || s.avatar_url,
        })),
        ...(categorySuggestions || []).map((c: any) => ({
          id: c.id,
          title: app.lang === "ar" ? c.name_ar : (c.name_en || c.name_ar),
          type: 'category' as const,
          url: `/category/${c.slug}`,
          image: "/category-icon.png",
        })),
      ];

      setSuggestions(allSuggestions);

    } catch (error) {
      console.error("Suggestions error:", error);
    } finally {
      if (isMountedRef.current) {
        setIsSuggesting(false);
      }
    }
  }, [app.lang, filters.governorate]);

  // ============================================================
  // ✅ الـ Debounce
  // ============================================================
  useEffect(() => {
    if (suggestionsTimeoutRef.current) clearTimeout(suggestionsTimeoutRef.current);
    
    const currentKey = `${debouncedSuggestQuery}|${filters.governorate || ""}`;
    
    // ✅ إذا نفس البحث — لا تعيد التنفيذ
    if (lastSuggestRef.current === currentKey) {
      return;
    }
    
    lastSuggestRef.current = currentKey;
    
    suggestionsTimeoutRef.current = setTimeout(() => {
      getSuggestions(debouncedSuggestQuery);
    }, 100);
    
    return () => {
      if (suggestionsTimeoutRef.current) clearTimeout(suggestionsTimeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSuggestQuery, filters.governorate]);

  useEffect(() => {
    const currentKey = `${debouncedQuery}|${filters.category || ""}|${filters.governorate || ""}`;
    
    // ✅ إذا نفس البحث — لا تعيد التنفيذ
    if (lastSearchedRef.current === currentKey) {
      return;
    }
    
    lastSearchedRef.current = currentKey;
    
    if (!debouncedQuery.trim() && !filters.category && !filters.governorate) {
      setResults([]);
      setTotalResults(0);
      setProductsCount(0);
      setStoresCount(0);
      setCategoriesCount(0);
      setHasMore(false);
      return;
    }
    
    performSearch(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, filters.category, filters.governorate]);

  // ============================================================
  // ✅ الدوال المساعدة
  // ============================================================
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      performSearch(page + 1, true);
    }
  }, [hasMore, isLoading, page, performSearch]);

  const setFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ sortBy: 'popularity' });
    setActiveType('all');
  }, []);

  const search = useCallback(() => {
    performSearch(1, false);
  }, [performSearch]);

  // ✅ تصفية النتائج حسب النوع النشط
  const filteredResults = useCallback(() => {
    if (activeType === 'all') return results;
    if (activeType === 'products') {
      return results.filter(r => r.type === 'product' || r.type === 'offer');
    }
    if (activeType === 'stores') return results.filter(r => r.type === 'store');
    if (activeType === 'categories') return results.filter(r => r.type === 'category');
    return results;
  }, [results, activeType]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) abortControllerRef.current.abort();
      if (suggestionsTimeoutRef.current) clearTimeout(suggestionsTimeoutRef.current);
    };
  }, []);

  return {
    query,
    setQuery,
    results: filteredResults(),
    allResults: results,
    suggestions,
    isLoading,
    isSuggesting,
    totalResults,
    productsCount,
    storesCount,
    categoriesCount,
    activeType,
    setActiveType,
    hasMore,
    loadMore,
    filters,
    setFilter,
    resetFilters,
    search,
  };
}