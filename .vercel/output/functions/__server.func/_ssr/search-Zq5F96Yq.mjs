import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { supabase } from "./client-DEhnCGNP.mjs";
import { u as useApp, I as Input, aR as Sheet, aS as SheetTrigger, b as Button, aT as SheetContent, c as cn$1, B as Badge, f as useGovernorates, e as useCategories, L as Label, aQ as ListingCard, O as OptimizedImage } from "./router-BU7AgYzK.mjs";
import { g as useLocation, L as Link } from "../_libs/tanstack__react-router.mjs";
import { S as Slider$1, a as SliderTrack, b as SliderRange, c as SliderThumb } from "../_libs/radix-ui__react-slider.mjs";
import { R as Root2, I as Item, H as Header, T as Trigger2, C as Content2 } from "../_libs/radix-ui__react-accordion.mjs";
import "../_libs/sonner.mjs";
import { q as Search, X, I as SlidersHorizontal, z as Grid3x3, D as List, g as Sparkles, J as FolderTree, c as Store, cv as RotateCcw, a0 as MapPin, T as Tag, bU as DollarSign, h as Star, y as ChevronDown, u as Check, p as LoaderCircle, i as ShoppingBag, a as ChevronLeft, C as ChevronRight, cw as BadgeCheck, P as Package } from "../_libs/lucide-react.mjs";
import { m as motion } from "../_libs/framer-motion.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/radix-ui__react-dropdown-menu.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-effect-event+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/radix-ui__react-menu.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-is-hydrated+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__react-tooltip.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/zustand.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/react-intersection-observer.mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-radio-group.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-avatar.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
import "../_libs/radix-ui__react-collapsible.mjs";
function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = reactExports.useState(value);
  reactExports.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  return debouncedValue;
}
function calculateRelevance(text, query) {
  if (!text || !query) return 0;
  const normalizedText = text.toLowerCase().trim();
  const normalizedQuery = query.toLowerCase().trim();
  if (normalizedText === normalizedQuery) return 100;
  if (normalizedText.startsWith(normalizedQuery)) return 80;
  const words = normalizedText.split(/\s+/);
  if (words.includes(normalizedQuery)) return 70;
  if (normalizedText.includes(normalizedQuery)) return 50;
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 1);
  if (queryWords.length > 1) {
    const matchedWords = queryWords.filter((qw) => normalizedText.includes(qw));
    return matchedWords.length / queryWords.length * 40;
  }
  return 0;
}
function useSearch() {
  const app = useApp();
  const [query, setQuery] = reactExports.useState("");
  const [results, setResults] = reactExports.useState([]);
  const [suggestions, setSuggestions] = reactExports.useState([]);
  const [isLoading, setIsLoading] = reactExports.useState(false);
  const [isSuggesting, setIsSuggesting] = reactExports.useState(false);
  const [filters, setFilters] = reactExports.useState({
    sortBy: "popularity"
  });
  const [totalResults, setTotalResults] = reactExports.useState(0);
  const [productsCount, setProductsCount] = reactExports.useState(0);
  const [storesCount, setStoresCount] = reactExports.useState(0);
  const [categoriesCount, setCategoriesCount] = reactExports.useState(0);
  const [activeType, setActiveType] = reactExports.useState("all");
  const [hasMore, setHasMore] = reactExports.useState(false);
  const [page, setPage] = reactExports.useState(1);
  const abortControllerRef = reactExports.useRef(null);
  const suggestionsTimeoutRef = reactExports.useRef(null);
  const lastSearchedRef = reactExports.useRef("");
  const lastSuggestRef = reactExports.useRef("");
  const isMountedRef = reactExports.useRef(true);
  const debouncedQuery = useDebounce(query, 400);
  const debouncedSuggestQuery = useDebounce(query, 150);
  reactExports.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const performSearch = reactExports.useCallback(async (pageNum = 1, append = false) => {
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
      let productsQuery = supabase.from("listings").select(`
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
        `, { count: "exact" }).eq("status", "published").eq("is_available", true);
      if (searchTerm) {
        const searchWords = searchTerm.trim().split(" ").filter((w) => w.length > 1);
        if (searchWords.length > 1) {
          const conditions = searchWords.map(
            (term) => `title_ar.ilike.%${term}%,title_en.ilike.%${term}%,description_ar.ilike.%${term}%,description_en.ilike.%${term}%`
          ).join(",");
          productsQuery = productsQuery.or(conditions);
        } else {
          productsQuery = productsQuery.or(
            `title_ar.ilike.%${searchTerm}%,title_en.ilike.%${searchTerm}%,description_ar.ilike.%${searchTerm}%,description_en.ilike.%${searchTerm}%`
          );
        }
      }
      if (filters.category) productsQuery = productsQuery.eq("category_id", filters.category);
      if (filters.governorate) productsQuery = productsQuery.eq("governorate_id", filters.governorate);
      if (filters.minPrice) productsQuery = productsQuery.gte("price", filters.minPrice);
      if (filters.maxPrice) productsQuery = productsQuery.lte("price", filters.maxPrice);
      if (filters.rating) productsQuery = productsQuery.gte("rating", filters.rating);
      switch (filters.sortBy) {
        case "newest":
          productsQuery = productsQuery.order("created_at", { ascending: false });
          break;
        case "price_low":
          productsQuery = productsQuery.order("price", { ascending: true });
          break;
        case "price_high":
          productsQuery = productsQuery.order("price", { ascending: false });
          break;
        case "discount":
          productsQuery = productsQuery.not("discount_percent", "is", null).order("discount_percent", { ascending: false });
          break;
        case "rating":
          productsQuery = productsQuery.order("rating", { ascending: false });
          break;
        case "popularity":
        default:
          productsQuery = productsQuery.order("views", { ascending: false });
          break;
      }
      const { data: products, count: productsTotal, error: productsError } = await productsQuery.range(offset, offset + limit - 1);
      if (productsError) throw productsError;
      let stores = [];
      let storesTotal = 0;
      if (searchTerm || filters.governorate) {
        let storesQuery = supabase.from("profiles").select(`
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
          `, { count: "exact" }).not("store_name", "is", null).eq("store_active", true);
        if (searchTerm) {
          const storeWords = searchTerm.trim().split(" ").filter((w) => w.length > 1);
          if (storeWords.length > 1) {
            const storeConditions = storeWords.map(
              (term) => `store_name.ilike.%${term}%,full_name.ilike.%${term}%,store_description.ilike.%${term}%`
            ).join(",");
            storesQuery = storesQuery.or(storeConditions);
          } else {
            storesQuery = storesQuery.or(
              `store_name.ilike.%${searchTerm}%,full_name.ilike.%${searchTerm}%,store_description.ilike.%${searchTerm}%`
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
          if (stores.length > 0) {
            const storeIds = stores.map((s) => s.id);
            const { data: countsData, error: countsError } = await supabase.from("listings").select("owner_id").in("owner_id", storeIds).eq("status", "published").eq("is_available", true);
            if (countsError) {
              console.error("❌ Listing counts error:", countsError);
            } else {
              const countsMap = {};
              (countsData || []).forEach((row) => {
                countsMap[row.owner_id] = (countsMap[row.owner_id] || 0) + 1;
              });
              stores = stores.map((s) => ({
                ...s,
                listing_count: countsMap[s.id] || 0
              }));
            }
          }
        }
      }
      let categories = [];
      let categoriesTotal = 0;
      if (!filters.category && searchTerm) {
        let categoryQuery = supabase.from("categories").select(`
            id,
            name_ar,
            name_en,
            slug,
            icon,
            image_url,
            parent_id,
            created_at
          `, { count: "exact" });
        const catWords = searchTerm.trim().split(" ").filter((w) => w.length > 1);
        if (catWords.length > 1) {
          const catConditions = catWords.map(
            (term) => `name_ar.ilike.%${term}%,name_en.ilike.%${term}%`
          ).join(",");
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
      if (!isMountedRef.current) return;
      const productsFormatted = (products || []).map((p) => {
        const title = app.lang === "ar" ? p.title_ar : p.title_en || p.title_ar;
        const relevance = calculateRelevance(title || "", searchTerm);
        return {
          id: p.id,
          title: title || "",
          title_ar: p.title_ar,
          title_en: p.title_en,
          description: app.lang === "ar" ? p.description_ar : p.description_en || p.description_ar,
          description_ar: p.description_ar,
          description_en: p.description_en,
          image: p.cover_url,
          cover_url: p.cover_url,
          type: p.is_offer ? "offer" : "product",
          url: `/listing/${p.id}`,
          badge: p.is_offer ? app.lang === "ar" ? "🔥 عرض" : "🔥 Offer" : p.discount_percent ? `🏷️ -${p.discount_percent}%` : void 0,
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
          _relevance: relevance
        };
      });
      const storesFormatted = stores.map((s) => {
        const title = s.store_name || s.full_name || "متجر";
        const relevance = calculateRelevance(title, searchTerm);
        const listingCount = s.listing_count ?? 0;
        return {
          id: s.id,
          title,
          description: s.store_description || (app.lang === "ar" ? "متجر على ذوق" : "Store on Zooq"),
          image: s.store_logo_url || s.avatar_url,
          cover_url: s.store_cover_url || s.store_logo_url || s.avatar_url,
          type: "store",
          url: `/store/${s.id}`,
          badge: "🏪 متجر",
          store_name: s.store_name,
          rating: void 0,
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
          _relevance: relevance
        };
      });
      const categoriesFormatted = categories.map((c) => {
        const title = app.lang === "ar" ? c.name_ar : c.name_en || c.name_ar;
        const relevance = calculateRelevance(title, searchTerm);
        return {
          id: c.id,
          title: title || "",
          description: app.lang === "ar" ? "تصفح المنتجات في هذا القسم" : "Browse products in this category",
          image: c.image_url || c.icon || "/category-placeholder.png",
          cover_url: c.image_url || c.icon || "/category-placeholder.png",
          type: "category",
          url: `/category/${c.slug}`,
          badge: c.parent_id ? app.lang === "ar" ? "📂 قسم فرعي" : "📂 Subcategory" : app.lang === "ar" ? "📂 قسم رئيسي" : "📂 Main Category",
          slug: c.slug,
          created_at: c.created_at,
          store_name: null,
          rating: void 0,
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
          _relevance: relevance
        };
      });
      productsFormatted.sort((a, b) => (b._relevance || 0) - (a._relevance || 0));
      storesFormatted.sort((a, b) => (b._relevance || 0) - (a._relevance || 0));
      categoriesFormatted.sort((a, b) => (b._relevance || 0) - (a._relevance || 0));
      const formattedResults = [
        ...productsFormatted,
        ...storesFormatted,
        ...categoriesFormatted
      ];
      if (append) {
        setResults((prev) => [...prev, ...formattedResults]);
      } else {
        setResults(formattedResults);
      }
      setProductsCount(productsTotal || 0);
      setStoresCount(storesTotal || 0);
      setCategoriesCount(categoriesTotal || 0);
      setTotalResults((productsTotal || 0) + (storesTotal || 0) + (categoriesTotal || 0));
      setHasMore((products?.length || 0) === limit);
      setPage(pageNum);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Search error:", error);
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
      abortControllerRef.current = null;
    }
  }, [debouncedQuery, filters.category, filters.governorate, filters.minPrice, filters.maxPrice, filters.rating, filters.sortBy, app.lang]);
  const getSuggestions = reactExports.useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      if (isMountedRef.current) {
        setSuggestions([]);
      }
      return;
    }
    setIsSuggesting(true);
    try {
      let productQuery = supabase.from("listings").select(`id, title_ar, title_en, cover_url`).eq("status", "published").eq("is_available", true);
      const prodWords = searchQuery.trim().split(" ").filter((w) => w.length > 1);
      if (prodWords.length > 1) {
        const prodConditions = prodWords.map(
          (term) => `title_ar.ilike.%${term}%,title_en.ilike.%${term}%`
        ).join(",");
        productQuery = productQuery.or(prodConditions);
      } else {
        productQuery = productQuery.or(
          `title_ar.ilike.%${searchQuery}%,title_en.ilike.%${searchQuery}%`
        );
      }
      if (filters.governorate) productQuery = productQuery.eq("governorate_id", filters.governorate);
      const { data: productSuggestions } = await productQuery.limit(5);
      let storeQuery = supabase.from("profiles").select(`id, store_name, full_name, store_logo_url, avatar_url`).not("store_name", "is", null).eq("store_active", true);
      const storeWords = searchQuery.trim().split(" ").filter((w) => w.length > 1);
      if (storeWords.length > 1) {
        const storeConditions = storeWords.map(
          (term) => `store_name.ilike.%${term}%,full_name.ilike.%${term}%`
        ).join(",");
        storeQuery = storeQuery.or(storeConditions);
      } else {
        storeQuery = storeQuery.or(
          `store_name.ilike.%${searchQuery}%,full_name.ilike.%${searchQuery}%`
        );
      }
      if (filters.governorate) storeQuery = storeQuery.eq("governorate_id", filters.governorate);
      const { data: storeSuggestions } = await storeQuery.limit(3);
      let categoryQuery = supabase.from("categories").select(`id, name_ar, name_en, slug, parent_id`);
      const catWords = searchQuery.trim().split(" ").filter((w) => w.length > 1);
      if (catWords.length > 1) {
        const catConditions = catWords.map(
          (term) => `name_ar.ilike.%${term}%,name_en.ilike.%${term}%`
        ).join(",");
        categoryQuery = categoryQuery.or(catConditions);
      } else {
        categoryQuery = categoryQuery.or(
          `name_ar.ilike.%${searchQuery}%,name_en.ilike.%${searchQuery}%`
        );
      }
      const { data: categorySuggestions } = await categoryQuery.limit(3);
      if (!isMountedRef.current) return;
      const allSuggestions = [
        ...(productSuggestions || []).map((p) => ({
          id: p.id,
          title: app.lang === "ar" ? p.title_ar : p.title_en || p.title_ar,
          type: "product",
          url: `/listing/${p.id}`,
          image: p.cover_url
        })),
        ...(storeSuggestions || []).map((s) => ({
          id: s.id,
          title: s.store_name || s.full_name || "متجر",
          type: "store",
          url: `/store/${s.id}`,
          image: s.store_logo_url || s.avatar_url
        })),
        ...(categorySuggestions || []).map((c) => ({
          id: c.id,
          title: app.lang === "ar" ? c.name_ar : c.name_en || c.name_ar,
          type: "category",
          url: `/category/${c.slug}`,
          image: "/category-icon.png"
        }))
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
  reactExports.useEffect(() => {
    if (suggestionsTimeoutRef.current) clearTimeout(suggestionsTimeoutRef.current);
    const currentKey = `${debouncedSuggestQuery}|${filters.governorate || ""}`;
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
  }, [debouncedSuggestQuery, filters.governorate]);
  reactExports.useEffect(() => {
    const currentKey = `${debouncedQuery}|${filters.category || ""}|${filters.governorate || ""}`;
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
  }, [debouncedQuery, filters.category, filters.governorate]);
  const loadMore = reactExports.useCallback(() => {
    if (hasMore && !isLoading) {
      performSearch(page + 1, true);
    }
  }, [hasMore, isLoading, page, performSearch]);
  const setFilter = reactExports.useCallback((key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);
  const resetFilters = reactExports.useCallback(() => {
    setFilters({ sortBy: "popularity" });
    setActiveType("all");
  }, []);
  const search = reactExports.useCallback(() => {
    performSearch(1, false);
  }, [performSearch]);
  const filteredResults = reactExports.useCallback(() => {
    if (activeType === "all") return results;
    if (activeType === "products") {
      return results.filter((r) => r.type === "product" || r.type === "offer");
    }
    if (activeType === "stores") return results.filter((r) => r.type === "store");
    if (activeType === "categories") return results.filter((r) => r.type === "category");
    return results;
  }, [results, activeType]);
  reactExports.useEffect(() => {
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
    search
  };
}
function StoreCard({ store, lang }) {
  const isArabic = lang === "ar";
  const storeName = store.title;
  const logoUrl = store.store_logo_url || store.image;
  const coverUrl = store.store_cover_url || store.image;
  const description = store.store_description || store.description;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: "/store/$id",
      params: { id: store.id },
      className: "group block bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 hover:shadow-xl transition-all duration-300 hover:-translate-y-1",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative h-24 bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] overflow-hidden", children: [
          coverUrl && /* @__PURE__ */ jsxRuntimeExports.jsx(
            OptimizedImage,
            {
              src: coverUrl,
              alt: storeName,
              width: 400,
              height: 150,
              quality: 80,
              objectFit: "cover",
              className: "absolute inset-0 h-full w-full opacity-70 group-hover:scale-105 transition-transform duration-500"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 end-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-white/90 backdrop-blur text-[#2a655f] border-0 text-[9px] px-2 py-0.5 font-bold shadow-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-2.5 w-2.5 inline me-1" }),
            isArabic ? "متجر" : "Store"
          ] }) }),
          store.is_verified && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-2 start-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f] text-white border-0 text-[9px] px-2 py-0.5 font-bold shadow-md", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(BadgeCheck, { className: "h-2.5 w-2.5 inline me-1" }),
            isArabic ? "موثق" : "Verified"
          ] }) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 -mt-8 relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-14 w-14 rounded-xl bg-white dark:bg-slate-900 border-4 border-white dark:border-slate-900 shadow-lg overflow-hidden grid place-items-center text-[#2a655f] font-black text-xl shrink-0", children: logoUrl ? /* @__PURE__ */ jsxRuntimeExports.jsx(
            OptimizedImage,
            {
              src: logoUrl,
              alt: storeName,
              width: 60,
              height: 60,
              quality: 85,
              objectFit: "cover",
              className: "h-full w-full"
            }
          ) : storeName.charAt(0)?.toUpperCase() || "?" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-2 font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#2a655f] transition-colors", children: storeName }),
          description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 min-h-[2rem]", children: description }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-3 mt-3 text-xs text-slate-500 dark:text-slate-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Package, { className: "h-3.5 w-3.5 text-[#2a655f]" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-bold text-[#2a655f]", children: store.listing_count || 0 }),
            isArabic ? "منتج" : "products"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 pt-3 border-t border-slate-100 dark:border-slate-800", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-[#2a655f] font-bold group-hover:translate-x-1 transition-transform", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: isArabic ? "زيارة المتجر" : "Visit Store" }),
            isArabic ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5" })
          ] }) })
        ] })
      ]
    }
  );
}
function CategoryCard({ category, lang }) {
  const isArabic = lang === "ar";
  const isMain = category.is_main_category;
  const categoryName = category.title;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Link,
    {
      to: "/category/$slug",
      params: { slug: category.slug || category.id },
      className: cn$1(
        "group block bg-white dark:bg-slate-900 rounded-2xl p-4 border-2 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        isMain ? "border-[#2a655f]/30 hover:border-[#2a655f]/60 bg-gradient-to-br from-white via-white to-[#2a655f]/5" : "border-slate-200 dark:border-slate-700 hover:border-[#3a8a82]/50"
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn$1(
          "h-14 w-14 rounded-xl flex items-center justify-center shrink-0 overflow-hidden shadow-sm border",
          isMain ? "bg-gradient-to-br from-[#2a655f] to-[#1a4f4a] border-[#1a4f4a]" : "bg-gradient-to-br from-[#3a8a82]/20 to-[#2a655f]/20 border-[#2a655f]/20"
        ), children: category.image_url ? /* @__PURE__ */ jsxRuntimeExports.jsx(
          OptimizedImage,
          {
            src: category.image_url,
            alt: categoryName,
            width: 56,
            height: 56,
            quality: 80,
            objectFit: "cover",
            className: "h-full w-full"
          }
        ) : isMain ? /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-6 w-6 text-white" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-6 w-6 text-[#2a655f]" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5 flex-wrap mb-1", children: isMain ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f] text-white border-0 text-[9px] px-2 py-0.5 font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-2.5 w-2.5 inline me-0.5" }),
            isArabic ? "قسم رئيسي" : "Main"
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#3a8a82]/20 text-[#2a655f] dark:text-[#3a8a82] border-0 text-[9px] px-2 py-0.5 font-bold", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-2.5 w-2.5 inline me-0.5" }),
            isArabic ? "قسم فرعي" : "Subcategory"
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#2a655f] transition-colors", children: categoryName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1", children: isArabic ? "تصفح المنتجات في هذا القسم" : "Browse products in this category" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn$1(
          "h-8 w-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110",
          isMain ? "bg-[#2a655f]/10 group-hover:bg-[#2a655f]" : "bg-slate-100 dark:bg-slate-800 group-hover:bg-[#2a655f]"
        ), children: isArabic ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: cn$1(
          "h-4 w-4 transition-colors",
          isMain ? "text-[#2a655f] group-hover:text-white" : "text-slate-500 group-hover:text-white"
        ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: cn$1(
          "h-4 w-4 transition-colors",
          isMain ? "text-[#2a655f] group-hover:text-white" : "text-slate-500 group-hover:text-white"
        ) }) }) })
      ] })
    }
  );
}
function SectionHeader({
  icon: Icon,
  title,
  count,
  color = "#2a655f",
  isArabic
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 mt-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "h-8 w-8 rounded-xl flex items-center justify-center shadow-sm",
          style: { backgroundColor: `${color}15`, border: `1px solid ${color}30` },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4", style: { color } })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-base font-black text-slate-900 dark:text-white", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Badge,
        {
          className: "text-[10px] font-bold px-2 py-0.5",
          style: { backgroundColor: `${color}15`, color, border: `1px solid ${color}30` },
          children: count
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-px flex-1 ms-4 bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700" })
  ] });
}
function TabsBar({
  activeType,
  setActiveType,
  totalResults,
  productsCount,
  storesCount,
  categoriesCount,
  isArabic
}) {
  const tabs = [
    {
      id: "all",
      label: isArabic ? "الكل" : "All",
      count: totalResults,
      icon: Grid3x3,
      color: "#2a655f"
    },
    {
      id: "products",
      label: isArabic ? "منتجات" : "Products",
      count: productsCount,
      icon: ShoppingBag,
      color: "#2a655f"
    },
    {
      id: "stores",
      label: isArabic ? "متاجر" : "Stores",
      count: storesCount,
      icon: Store,
      color: "#3a8a82"
    },
    {
      id: "categories",
      label: isArabic ? "أقسام" : "Categories",
      count: categoriesCount,
      icon: FolderTree,
      color: "#1a4f4a"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2 min-w-max", children: tabs.map((tab) => {
    const isActive = activeType === tab.id;
    const Icon = tab.icon;
    const isDisabled = tab.count === 0 && tab.id !== "all";
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => !isDisabled && setActiveType(tab.id),
        disabled: isDisabled,
        className: cn$1(
          "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 border-2 shrink-0",
          isActive ? "text-white shadow-lg border-transparent scale-[1.02]" : isDisabled ? "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-700 cursor-not-allowed" : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#2a655f]/40 hover:shadow-md"
        ),
        style: isActive ? { backgroundColor: tab.color } : {},
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-4 w-4" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: tab.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn$1(
            "text-[10px] font-black px-2 py-0.5 rounded-full",
            isActive ? "bg-white/25 text-white" : isDisabled ? "bg-slate-200 dark:bg-slate-700 text-slate-500" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          ), children: tab.count })
        ]
      },
      tab.id
    );
  }) }) });
}
function convertToListingItem(result) {
  return {
    id: result.id,
    title_ar: result.title_ar || result.title,
    title_en: result.title_en || result.title,
    description_ar: result.description_ar || result.description || "",
    description_en: result.description_en || result.description || "",
    price: result.price || 0,
    old_price: result.old_price || null,
    discount_percent: result.discount_percent || 0,
    is_offer: result.is_offer || false,
    cover_url: result.cover_url || result.image || "",
    rating: result.rating || 0,
    governorates: result.governorates || null,
    categories: result.categories || null,
    profiles: result.profiles || null,
    listing_images: result.listing_images || [],
    product_variations: result.product_variations || [],
    product_colors: result.product_colors || [],
    owner_id: result.owner_id || null,
    views: result.views || 0,
    favorites_count: result.favorites_count || 0,
    status: result.status || "published",
    is_available: result.is_available !== void 0 ? result.is_available : true,
    created_at: result.created_at || (/* @__PURE__ */ new Date()).toISOString(),
    updated_at: (/* @__PURE__ */ new Date()).toISOString(),
    governorate_id: result.governorate_id || null,
    category_id: result.category_id || null,
    metadata: result.metadata || null,
    delivery_fee: result.delivery_fee || 0,
    delivery_method: result.delivery_method || null,
    is_featured: result.is_featured || false,
    featured_sort: result.featured_sort || 0,
    profile: result.profiles || null,
    is_promo_offer: result.type === "offer" && result.is_offer === false,
    promo_offer: null,
    store_id: result.owner_id || null,
    store_name: result.store_name || null,
    slug: result.slug || null
  };
}
function SearchResults({
  results,
  allResults,
  isLoading,
  hasMore,
  onLoadMore,
  totalResults,
  productsCount,
  storesCount,
  categoriesCount,
  activeType,
  setActiveType,
  viewMode = "grid",
  className
}) {
  const app = useApp();
  const isArabic = app.lang === "ar";
  if (isLoading && results.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-20 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-8 w-8 animate-spin text-[#2a655f]" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 font-medium", children: isArabic ? "جاري البحث..." : "Searching..." })
    ] });
  }
  if (results.length === 0 && !isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        className: "text-center py-20",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-10 w-10 text-slate-300 dark:text-slate-600" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-slate-900 dark:text-white", children: isArabic ? "لا توجد نتائج" : "No results found" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto", children: isArabic ? "حاول استخدام كلمات بحث مختلفة أو قلل من الفلاتر" : "Try different keywords or reduce filters" })
        ]
      }
    );
  }
  const products = allResults.filter((r) => r.type === "product" || r.type === "offer");
  const stores = allResults.filter((r) => r.type === "store");
  const categories = allResults.filter((r) => r.type === "category");
  const sortedCategories = [...categories].sort((a, b) => {
    if (a.is_main_category && !b.is_main_category) return -1;
    if (!a.is_main_category && b.is_main_category) return 1;
    return 0;
  });
  const gridClasses = cn$1(
    "grid gap-4",
    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
  );
  const storeGridClasses = cn$1(
    "grid gap-4",
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
  );
  const categoryGridClasses = cn$1(
    "grid gap-3",
    "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn$1("space-y-5", className), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      TabsBar,
      {
        activeType,
        setActiveType,
        totalResults,
        productsCount,
        storesCount,
        categoriesCount,
        isArabic
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 dark:text-slate-400", children: isArabic ? `تم العثور على ${totalResults.toLocaleString()} نتيجة` : `${totalResults.toLocaleString()} results found` }),
      isLoading && results.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[#2a655f]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-bold", children: isArabic ? "جاري التحديث..." : "Updating..." })
      ] })
    ] }),
    activeType === "all" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-8", children: [
      products.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            icon: ShoppingBag,
            title: isArabic ? "🛒 المنتجات" : "🛒 Products",
            count: productsCount,
            color: "#2a655f",
            isArabic
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: gridClasses, children: products.map((result, index) => {
          const item = convertToListingItem(result);
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: Math.min(index * 0.03, 0.4) },
              className: cn$1(
                viewMode === "list" && "sm:col-span-2 lg:col-span-3 xl:col-span-4"
              ),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { item, variant: viewMode }) })
            },
            `product-${result.id}`
          );
        }) })
      ] }),
      stores.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            icon: Store,
            title: isArabic ? "🏪 المتاجر" : "🏪 Stores",
            count: storesCount,
            color: "#3a8a82",
            isArabic
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: storeGridClasses, children: stores.map((store, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: Math.min(index * 0.05, 0.4) },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(StoreCard, { store, lang: app.lang })
          },
          `store-${store.id}`
        )) })
      ] }),
      sortedCategories.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SectionHeader,
          {
            icon: FolderTree,
            title: isArabic ? "📂 الأقسام" : "📂 Categories",
            count: categoriesCount,
            color: "#1a4f4a",
            isArabic
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: categoryGridClasses, children: sortedCategories.map((category, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            transition: { delay: Math.min(index * 0.05, 0.4) },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryCard, { category, lang: app.lang })
          },
          `category-${category.id}`
        )) })
      ] })
    ] }),
    activeType === "products" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: gridClasses, children: products.map((result, index) => {
      const item = convertToListingItem(result);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { delay: Math.min(index * 0.03, 0.4) },
          className: cn$1(
            viewMode === "list" && "sm:col-span-2 lg:col-span-3 xl:col-span-4"
          ),
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-80 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-2xl" }), children: /* @__PURE__ */ jsxRuntimeExports.jsx(ListingCard, { item, variant: viewMode }) })
        },
        `product-${result.id}`
      );
    }) }),
    activeType === "stores" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: storeGridClasses, children: stores.map((store, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: Math.min(index * 0.05, 0.4) },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(StoreCard, { store, lang: app.lang })
      },
      `store-${store.id}`
    )) }),
    activeType === "categories" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: categoryGridClasses, children: sortedCategories.map((category, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: Math.min(index * 0.05, 0.4) },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(CategoryCard, { category, lang: app.lang })
      },
      `category-${category.id}`
    )) }),
    hasMore && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center pt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: onLoadMore,
        disabled: isLoading,
        className: "rounded-xl px-8 bg-[#2a655f] hover:bg-[#1a4f4a] text-white shadow-lg shadow-[#2a655f]/25 hover:shadow-xl transition-all duration-300 font-bold h-11",
        children: isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "h-4 w-4 animate-spin me-2" }),
          isArabic ? "جاري التحميل..." : "Loading..."
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          isArabic ? "تحميل المزيد" : "Load more",
          isArabic ? /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronLeft, { className: "h-4 w-4 ms-2" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-4 w-4 ms-2" })
        ] })
      }
    ) })
  ] });
}
const Slider = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Slider$1,
  {
    ref,
    className: cn$1("relative flex w-full touch-none select-none items-center", className),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SliderTrack, { className: "relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SliderRange, { className: "absolute h-full bg-primary" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SliderThumb, { className: "block h-4 w-4 rounded-full border border-primary/50 bg-background shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" })
    ]
  }
));
Slider.displayName = Slider$1.displayName;
const Accordion = Root2;
const AccordionItem = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Item, { ref, className: cn$1("border-b", className), ...props }));
AccordionItem.displayName = "AccordionItem";
const AccordionTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { className: "flex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger2,
  {
    ref,
    className: cn$1(
      "flex flex-1 items-center justify-between py-4 text-sm font-medium cursor-pointer transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" })
    ]
  }
) }));
AccordionTrigger.displayName = Trigger2.displayName;
const AccordionContent = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Content2,
  {
    ref,
    className: "overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn$1("pb-4 pt-0", className), children })
  }
));
AccordionContent.displayName = Content2.displayName;
function SearchFilters({
  filters,
  setFilter,
  resetFilters,
  onClose
}) {
  const app = useApp();
  const { data: governorates = [] } = useGovernorates();
  const { data: categories = [] } = useCategories();
  const [priceRange, setPriceRange] = reactExports.useState([
    filters.minPrice || 0,
    filters.maxPrice || 1e7
  ]);
  reactExports.useEffect(() => {
    setPriceRange([
      filters.minPrice || 0,
      filters.maxPrice || 1e7
    ]);
  }, [filters.minPrice, filters.maxPrice]);
  const handlePriceChange = (value) => {
    setPriceRange([value[0], value[1]]);
  };
  const applyPriceRange = () => {
    setFilter("minPrice", priceRange[0] > 0 ? priceRange[0] : void 0);
    setFilter("maxPrice", priceRange[1] < 1e7 ? priceRange[1] : void 0);
  };
  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key] && key !== "sortBy"
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-bold text-slate-900 dark:text-white", children: app.lang === "ar" ? "فلتر البحث" : "Search Filters" }),
        activeFiltersCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "bg-[#2a655f] text-white", children: activeFiltersCount })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        activeFiltersCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            onClick: resetFilters,
            className: "text-sm text-red-500 hover:text-red-600 transition flex items-center gap-1",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "h-3.5 w-3.5" }),
              app.lang === "ar" ? "مسح" : "Reset"
            ]
          }
        ),
        onClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: onClose,
            className: "lg:hidden p-2 rounded-lg hover:bg-muted transition",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-5 w-5" })
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Accordion, { type: "single", collapsible: true, className: "space-y-2", defaultValue: "governorate", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "governorate", className: "border rounded-xl px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "h-4 w-4 text-[#2a655f]" }),
          app.lang === "ar" ? "المحافظة" : "Governorate"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "px-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 max-h-[200px] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilter("governorate", void 0),
              className: cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted",
                !filters.governorate && "bg-[#2a655f]/10 text-[#2a655f] font-medium"
              ),
              children: app.lang === "ar" ? "كل المحافظات" : "All Governorates"
            }
          ),
          governorates.map((gov) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilter("governorate", gov.id),
              className: cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted",
                filters.governorate === gov.id && "bg-[#2a655f]/10 text-[#2a655f] font-medium"
              ),
              children: app.lang === "ar" ? gov.name_ar : gov.name_en
            },
            gov.id
          ))
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "category", className: "border rounded-xl px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tag, { className: "h-4 w-4 text-emerald-600" }),
          app.lang === "ar" ? "التصنيف" : "Category"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "px-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 max-h-[200px] overflow-y-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilter("category", void 0),
              className: cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted",
                !filters.category && "bg-emerald-500/10 text-emerald-600 font-medium"
              ),
              children: app.lang === "ar" ? "كل التصنيفات" : "All Categories"
            }
          ),
          categories.map((cat) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilter("category", cat.id),
              className: cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted",
                filters.category === cat.id && "bg-emerald-500/10 text-emerald-600 font-medium"
              ),
              children: app.lang === "ar" ? cat.name_ar : cat.name_en
            },
            cat.id
          ))
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "price", className: "border rounded-xl px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(DollarSign, { className: "h-4 w-4 text-purple-600" }),
          app.lang === "ar" ? "نطاق السعر" : "Price Range"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "px-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Slider,
            {
              value: priceRange,
              min: 0,
              max: 1e7,
              step: 1e5,
              onValueChange: handlePriceChange,
              className: "[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "من" : "From" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: priceRange[0] || 0,
                  onChange: (e) => {
                    const val = Number(e.target.value);
                    setPriceRange([val, priceRange[1]]);
                  },
                  className: "h-9 text-sm"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "text-xs text-muted-foreground", children: app.lang === "ar" ? "إلى" : "To" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  type: "number",
                  value: priceRange[1] || 0,
                  onChange: (e) => {
                    const val = Number(e.target.value);
                    setPriceRange([priceRange[0], val]);
                  },
                  className: "h-9 text-sm"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              onClick: applyPriceRange,
              className: "w-full rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white",
              size: "sm",
              children: app.lang === "ar" ? "تطبيق السعر" : "Apply Price"
            }
          )
        ] }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AccordionItem, { value: "rating", className: "border rounded-xl px-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionTrigger, { className: "hover:no-underline py-3 px-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-sm font-medium", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Star, { className: "h-4 w-4 text-yellow-500" }),
          app.lang === "ar" ? "التقييم" : "Rating"
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AccordionContent, { className: "px-3 pb-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          [4.5, 4, 3.5, 3].map((rating) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => setFilter("rating", filters.rating === rating ? void 0 : rating),
              className: cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm transition hover:bg-muted flex items-center gap-2",
                filters.rating === rating && "bg-yellow-500/10 text-yellow-600 font-medium"
              ),
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center", children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Star,
                  {
                    className: cn(
                      "h-4 w-4",
                      i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground"
                    )
                  },
                  i
                )) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                  rating,
                  "+"
                ] })
              ]
            },
            rating
          )),
          filters.rating && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilter("rating", void 0),
              className: "w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition",
              children: app.lang === "ar" ? "إزالة فلتر التقييم" : "Remove rating filter"
            }
          )
        ] }) })
      ] })
    ] }),
    onClose && /* @__PURE__ */ jsxRuntimeExports.jsx(
      Button,
      {
        onClick: onClose,
        className: "w-full rounded-xl bg-gradient-to-r from-[#2a655f] to-[#3a8a82] hover:from-[#1a4f4a] hover:to-[#2a655f] text-white",
        children: app.lang === "ar" ? "تطبيق الفلاتر" : "Apply Filters"
      }
    )
  ] });
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function SortDropdown({ value, onChange, lang }) {
  const [isOpen, setIsOpen] = reactExports.useState(false);
  const dropdownRef = reactExports.useRef(null);
  const options = [
    { value: "popularity", label: lang === "ar" ? "الأكثر رواجاً" : "Most Popular", icon: "⭐" },
    { value: "newest", label: lang === "ar" ? "الواصل حديثاً" : "New Arrivals", icon: "🆕" },
    { value: "price_low", label: lang === "ar" ? "السعر: من الأقل" : "Price: Low to High", icon: "💰" },
    { value: "price_high", label: lang === "ar" ? "السعر: من الأعلى" : "Price: High to Low", icon: "💰" },
    { value: "discount", label: lang === "ar" ? "أكبر خصم" : "Biggest Discount", icon: "🏷️" },
    { value: "rating", label: lang === "ar" ? "الأعلى تقييماً" : "Highest Rated", icon: "⭐" }
  ];
  const selectedOption = options.find((opt) => opt.value === value) || options[0];
  reactExports.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", ref: dropdownRef, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: cn$1(
          "flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-all duration-200 min-w-[170px]",
          isOpen ? "border-[#2a655f] bg-white dark:bg-slate-800 shadow-lg shadow-[#2a655f]/10" : "border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-800 hover:border-[#2a655f]/50"
        ),
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none", children: selectedOption.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-start truncate", children: selectedOption.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: cn$1(
            "h-4 w-4 text-slate-400 transition-transform duration-200 flex-shrink-0",
            isOpen ? "rotate-180" : ""
          ) })
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-full left-0 right-0 mt-1.5 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl shadow-black/10 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-1.5", children: options.map((option) => {
      const isSelected = value === option.value;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => {
            onChange(option.value);
            setIsOpen(false);
          },
          className: cn$1(
            "w-full px-4 py-2.5 text-sm text-start flex items-center gap-3 transition-colors duration-150",
            isSelected ? "bg-[#2a655f]/10 text-[#2a655f] font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50"
          ),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-base leading-none w-6 text-center", children: option.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 font-medium", children: option.label }),
            isSelected && /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4 text-[#2a655f] flex-shrink-0" })
          ]
        },
        option.value
      );
    }) }) })
  ] });
}
function SearchPage() {
  const app = useApp();
  const location = useLocation();
  const search = location.search;
  const [viewMode, setViewMode] = reactExports.useState("grid");
  const [mobileFiltersOpen, setMobileFiltersOpen] = reactExports.useState(false);
  const {
    query,
    setQuery,
    results,
    allResults,
    isLoading,
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
    resetFilters
  } = useSearch();
  reactExports.useEffect(() => {
    const q = search?.q || "";
    const gov = search?.gov || "";
    if (q) setQuery(q);
    if (gov) setFilter("governorate", gov);
  }, [search, setQuery, setFilter]);
  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key] && key !== "sortBy"
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-[#f8fafc] dark:bg-[#0f172a]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 z-40 bg-white/80 dark:bg-[#0f172a]/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative flex-1 max-w-2xl", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute inset-y-0 my-auto start-3 h-4 w-4 text-slate-400" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Input,
          {
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: app.lang === "ar" ? "ابحث عن منتجات، متاجر، تصنيفات..." : "Search for products, stores, categories...",
            className: "ps-9 pe-10 h-12 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:border-[#2a655f] focus:bg-white dark:focus:bg-slate-900 transition-all text-base",
            autoFocus: true
          }
        ),
        query && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setQuery(""),
            className: "absolute inset-y-0 my-auto end-3 h-6 w-6 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4 text-slate-500" })
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Sheet, { open: mobileFiltersOpen, onOpenChange: setMobileFiltersOpen, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            className: "lg:hidden h-12 gap-2 rounded-xl border-slate-200/60 dark:border-slate-700/60 relative",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SlidersHorizontal, { className: "h-4 w-4" }),
              activeFiltersCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -top-1 -end-1 h-5 min-w-5 px-1.5 rounded-full bg-[#2a655f] text-white text-[10px] font-bold flex items-center justify-center shadow-md", children: activeFiltersCount })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SheetContent,
          {
            side: app.lang === "ar" ? "right" : "left",
            className: "w-[320px] p-0 [&>button]:hidden",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              SearchFilters,
              {
                filters,
                setFilter,
                resetFilters,
                onClose: () => setMobileFiltersOpen(false)
              }
            )
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-1 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-1 bg-white dark:bg-slate-800", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setViewMode("grid"),
            className: cn$1(
              "p-2 rounded-lg transition-all",
              viewMode === "grid" ? "bg-[#2a655f] text-white shadow-md" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Grid3x3, { className: "h-4 w-4" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setViewMode("list"),
            className: cn$1(
              "p-2 rounded-lg transition-all",
              viewMode === "list" ? "bg-[#2a655f] text-white shadow-md" : "hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(List, { className: "h-4 w-4" })
          }
        )
      ] })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto max-w-7xl px-4 py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:block w-72 shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-24", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        SearchFilters,
        {
          filters,
          setFilter,
          resetFilters
        }
      ) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "flex-1 min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4 flex-wrap gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-9 w-9 rounded-xl bg-[#2a655f]/10 border border-[#2a655f]/20 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Sparkles, { className: "h-4 w-4 text-[#2a655f]" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-lg font-black text-slate-900 dark:text-white leading-tight", children: app.lang === "ar" ? "نتائج البحث" : "Search Results" }),
              query && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-slate-500 dark:text-slate-400 mt-0.5", children: [
                app.lang === "ar" ? "عن:" : "for:",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-bold text-[#2a655f]", children: [
                  '"',
                  query,
                  '"'
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-slate-500 dark:text-slate-400 hidden sm:inline", children: app.lang === "ar" ? "ترتيب حسب:" : "Sort by:" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              SortDropdown,
              {
                value: filters.sortBy || "popularity",
                onChange: (val) => setFilter("sortBy", val),
                lang: app.lang
              }
            )
          ] })
        ] }),
        activeFiltersCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2 mb-4", children: [
          filters.category && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-[#2a655f]/10 text-[#2a655f] border border-[#2a655f]/20 py-1.5 px-3 rounded-lg flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FolderTree, { className: "h-3 w-3" }),
            app.lang === "ar" ? "تصنيف" : "Category",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setFilter("category", void 0),
                className: "ms-1 hover:text-red-500 transition",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ] }),
          filters.governorate && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 py-1.5 px-3 rounded-lg flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Store, { className: "h-3 w-3" }),
            app.lang === "ar" ? "محافظة" : "Governorate",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setFilter("governorate", void 0),
                className: "ms-1 hover:text-red-500 transition",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ] }),
          filters.minPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-purple-500/10 text-purple-600 border border-purple-500/20 py-1.5 px-3 rounded-lg flex items-center gap-1", children: [
            app.lang === "ar" ? "من" : "From",
            ": ",
            filters.minPrice,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setFilter("minPrice", void 0),
                className: "ms-1 hover:text-red-500 transition",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ] }),
          filters.maxPrice && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-purple-500/10 text-purple-600 border border-purple-500/20 py-1.5 px-3 rounded-lg flex items-center gap-1", children: [
            app.lang === "ar" ? "إلى" : "To",
            ": ",
            filters.maxPrice,
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setFilter("maxPrice", void 0),
                className: "ms-1 hover:text-red-500 transition",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ] }),
          filters.rating && /* @__PURE__ */ jsxRuntimeExports.jsxs(Badge, { className: "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20 py-1.5 px-3 rounded-lg flex items-center gap-1", children: [
            "⭐ ",
            filters.rating,
            "+",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => setFilter("rating", void 0),
                className: "ms-1 hover:text-red-500 transition",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3 w-3" })
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: resetFilters,
              className: "text-xs text-red-500 hover:text-red-600 transition px-2 py-1 font-bold",
              children: app.lang === "ar" ? "مسح الكل" : "Clear all"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          SearchResults,
          {
            results,
            allResults,
            isLoading,
            hasMore,
            onLoadMore: loadMore,
            totalResults,
            productsCount,
            storesCount,
            categoriesCount,
            activeType,
            setActiveType,
            viewMode
          }
        ),
        !isLoading && results.length === 0 && query && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            className: "text-center py-20",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "h-10 w-10 text-slate-400" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-slate-900 dark:text-white", children: app.lang === "ar" ? "لا توجد نتائج" : "No results found" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto", children: app.lang === "ar" ? `لم نعثر على أي نتائج لـ "${query}". حاول استخدام كلمات بحث مختلفة أو قلل من الفلاتر.` : `No results found for "${query}". Try different keywords or reduce filters.` }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  className: "mt-6 rounded-xl border-slate-300 text-[#2a655f] hover:bg-[#2a655f]/10",
                  onClick: () => {
                    setQuery("");
                    resetFilters();
                  },
                  children: app.lang === "ar" ? "مسح البحث" : "Clear search"
                }
              )
            ]
          }
        )
      ] })
    ] }) })
  ] });
}
const SplitComponent = SearchPage;
export {
  SplitComponent as component
};
