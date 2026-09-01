// src/lib/hooks/useSearch.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useApp } from "@/lib/i18n";

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
  // ✅ ✅ ✅ حقول إضافية لـ ListingCard
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
}

interface SearchFilters {
  category?: string;
  governorate?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'popularity' | 'newest' | 'price_low' | 'price_high' | 'discount' | 'rating';
}

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
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const abortControllerRef = useRef<AbortController | null>(null);
  const suggestionsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedQuery = useDebounce(query, 400);
  const debouncedSuggestQuery = useDebounce(query, 150);

  // ====== ✅ البحث الرئيسي (محسن للبحث الذكي مع بيانات كاملة) ======
  const performSearch = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    const searchTerm = debouncedQuery.trim();
    
    if (!searchTerm && !filters.category && !filters.governorate) {
      setResults([]);
      setTotalResults(0);
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

      // ✅ ✅ ✅ 1. البحث في المنتجات (listings) - بيانات كاملة
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

      // ✅ ✅ ✅ البحث الذكي: تقسيم الكلمات والبحث عن كل كلمة (OR)
      if (searchTerm) {
        const searchWords = searchTerm.trim().split(' ').filter(w => w.length > 1);
        
        if (searchWords.length > 1) {
          // ✅ كلمات متعددة: بحث عن أي كلمة (OR) - ذكي
          const conditions = searchWords.map(term => 
            `title_ar.ilike.%${term}%,title_en.ilike.%${term}%,description_ar.ilike.%${term}%,description_en.ilike.%${term}%`
          ).join(',');
          productsQuery = productsQuery.or(conditions);
        } else {
          // ✅ كلمة واحدة: بحث عادي
          productsQuery = productsQuery.or(
            `title_ar.ilike.%${searchTerm}%,` +
            `title_en.ilike.%${searchTerm}%,` +
            `description_ar.ilike.%${searchTerm}%,` +
            `description_en.ilike.%${searchTerm}%`
          );
        }
      }

      // ✅ فلتر التصنيف
      if (filters.category) {
        productsQuery = productsQuery.eq("category_id", filters.category);
      }

      // ✅ فلتر المحافظة
      if (filters.governorate) {
        productsQuery = productsQuery.eq("governorate_id", filters.governorate);
      }

      // ✅ فلتر السعر
      if (filters.minPrice) {
        productsQuery = productsQuery.gte("price", filters.minPrice);
      }
      if (filters.maxPrice) {
        productsQuery = productsQuery.lte("price", filters.maxPrice);
      }

      // ✅ فلتر التقييم
      if (filters.rating) {
        productsQuery = productsQuery.gte("rating", filters.rating);
      }

      // ✅ ترتيب النتائج - مثل نون
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

      const { data: products, count, error: productsError } = await productsQuery
        .range(offset, offset + limit - 1);

      if (productsError) throw productsError;

      // ✅ 2. البحث في المتاجر (profiles) - محسن للبحث الذكي
      let stores: any[] = [];
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
            created_at,
            is_verified
          `)
          .not("store_name", "is", null);

        if (searchTerm) {
          const storeWords = searchTerm.trim().split(' ').filter(w => w.length > 1);
          
          if (storeWords.length > 1) {
            // ✅ بحث ذكي في المتاجر
            const storeConditions = storeWords.map(term => 
              `store_name.ilike.%${term}%,full_name.ilike.%${term}%`
            ).join(',');
            storesQuery = storesQuery.or(storeConditions);
          } else {
            storesQuery = storesQuery.or(
              `store_name.ilike.%${searchTerm}%,` +
              `full_name.ilike.%${searchTerm}%`
            );
          }
        }

        if (filters.governorate) {
          storesQuery = storesQuery.eq("governorate_id", filters.governorate);
        }

        const { data: storesData } = await storesQuery.limit(5);
        stores = storesData || [];
      }

      // ✅ 3. البحث في التصنيفات (categories) - محسن للبحث الذكي
      let categories: any[] = [];
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
            created_at
          `);

        const catWords = searchTerm.trim().split(' ').filter(w => w.length > 1);
        
        if (catWords.length > 1) {
          // ✅ بحث ذكي في التصنيفات
          const catConditions = catWords.map(term => 
            `name_ar.ilike.%${term}%,name_en.ilike.%${term}%`
          ).join(',');
          categoryQuery = categoryQuery.or(catConditions);
        } else {
          categoryQuery = categoryQuery.or(
            `name_ar.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%`
          );
        }

        const { data: categoriesData } = await categoryQuery.limit(5);
        categories = categoriesData || [];
      }

      // ✅ ✅ ✅ 4. تجميع النتائج مع بيانات كاملة
      const formattedResults: SearchResult[] = [
        // ✅ المنتجات - بيانات كاملة
        ...(products || []).map((p: any) => ({
          id: p.id,
          title: app.lang === "ar" ? p.title_ar : (p.title_en || p.title_ar),
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
        })),
        // ✅ المتاجر
        ...stores.map((s: any) => ({
          id: s.id,
          title: s.store_name || s.full_name || "متجر",
          description: s.store_description || (app.lang === "ar" ? "متجر على السوق" : "Store on Alsouq"),
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
        })),
        // ✅ التصنيفات
        ...categories.map((c: any) => ({
          id: c.id,
          title: app.lang === "ar" ? c.name_ar : (c.name_en || c.name_ar),
          description: app.lang === "ar" ? "تصفح المنتجات في هذا التصنيف" : "Browse products in this category",
          image: c.image_url || c.icon || "/category-placeholder.png",
          cover_url: c.image_url || c.icon || "/category-placeholder.png",
          type: 'category' as const,
          url: `/category/${c.slug}`,
          badge: "📂 تصنيف",
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
        })),
      ];

      if (append) {
        setResults(prev => [...prev, ...formattedResults]);
      } else {
        setResults(formattedResults);
      }

      setTotalResults(count || 0);
      setHasMore((products?.length || 0) === limit);
      setPage(pageNum);

    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.error("Search error:", error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [debouncedQuery, filters, app.lang]);

  // ====== ✅ الاقتراحات الفورية (محسنة للبحث الذكي) ======
  const getSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsSuggesting(true);

    try {
      // ✅ اقتراحات المنتجات - بحث ذكي
      let productQuery = supabase
        .from("listings")
        .select(`
          id,
          title_ar,
          title_en,
          cover_url
        `)
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

      if (filters.governorate) {
        productQuery = productQuery.eq("governorate_id", filters.governorate);
      }

      const { data: productSuggestions } = await productQuery.limit(5);

      // ✅ اقتراحات المتاجر - بحث ذكي
      let storeQuery = supabase
        .from("profiles")
        .select(`
          id,
          store_name,
          full_name,
          store_logo_url,
          avatar_url
        `)
        .not("store_name", "is", null);

      const storeWords = searchQuery.trim().split(' ').filter(w => w.length > 1);
      
      if (storeWords.length > 1) {
        const storeConditions = storeWords.map(term => 
          `store_name.ilike.%${term}%,full_name.ilike.%${term}%`
        ).join(',');
        storeQuery = storeQuery.or(storeConditions);
      } else {
        storeQuery = storeQuery.ilike("store_name", `%${searchQuery}%`);
      }

      if (filters.governorate) {
        storeQuery = storeQuery.eq("governorate_id", filters.governorate);
      }

      const { data: storeSuggestions } = await storeQuery.limit(3);

      // ✅ اقتراحات التصنيفات - بحث ذكي
      let categoryQuery = supabase
        .from("categories")
        .select(`
          id,
          name_ar,
          name_en,
          slug
        `);

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
      setIsSuggesting(false);
    }
  }, [app.lang, filters.governorate]);

  // ====== ✅ تأثير الـ debounce على الاقتراحات ======
  useEffect(() => {
    if (suggestionsTimeoutRef.current) {
      clearTimeout(suggestionsTimeoutRef.current);
    }

    suggestionsTimeoutRef.current = setTimeout(() => {
      getSuggestions(debouncedSuggestQuery);
    }, 100);

    return () => {
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, [debouncedSuggestQuery, getSuggestions]);

  // ====== ✅ تأثير الـ debounce على البحث ======
  useEffect(() => {
    if (!debouncedQuery.trim() && !filters.category && !filters.governorate) {
      setResults([]);
      setTotalResults(0);
      return;
    }
    
    performSearch(1, false);
  }, [performSearch]);

  // ====== ✅ تحميل المزيد ======
  const loadMore = useCallback(() => {
    if (hasMore && !isLoading) {
      performSearch(page + 1, true);
    }
  }, [hasMore, isLoading, page, performSearch]);

  // ====== ✅ تغيير الفلاتر ======
  const setFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  // ====== ✅ إعادة تعيين الفلاتر ======
  const resetFilters = useCallback(() => {
    setFilters({ sortBy: 'popularity' });
  }, []);

  // ====== ✅ البحث المباشر ======
  const search = useCallback(() => {
    performSearch(1, false);
  }, [performSearch]);

  // ====== ✅ تنظيف ======
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (suggestionsTimeoutRef.current) {
        clearTimeout(suggestionsTimeoutRef.current);
      }
    };
  }, []);

  return {
    query,
    setQuery,
    results,
    suggestions,
    isLoading,
    isSuggesting,
    totalResults,
    hasMore,
    loadMore,
    filters,
    setFilter,
    resetFilters,
    search,
  };
}